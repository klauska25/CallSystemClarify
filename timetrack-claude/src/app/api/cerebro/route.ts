// Cérebro do chatbot de suporte do TimeTrack. Roda só no servidor.
// Responde com o Gemini quando há GEMINI_API_KEY; sem chave, ou se o Gemini falhar, responde por regras.
import { usuarios, type Usuario } from "@/lib/dados";
import { formatarDataHora } from "@/lib/formatar";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Papel = "user" | "assistant";
type Mensagem = { role: Papel; content: string };
type Cerebro = "gemini" | "regras";
type Conexao = { hora: string; cerebro: Cerebro; mensagem: string };

const MODELO = "gemini-2.5-flash";
const URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:streamGenerateContent?alt=sse`;
const ESPERA_GEMINI_MS = 20_000; // até o Gemini começar a responder
const LIMITE_GEMINI_MS = 45_000; // resposta inteira, com folga para as regras antes do maxDuration
const MAX_MENSAGENS = 40;
const MAX_CARACTERES = 4_000;
const MAX_CONEXOES = 50;
const MENSAGEM_TESTE = "Não consigo logar";

const SISTEMA_PADRAO =
  "Você é o atendente de suporte do TimeTrack, um sistema de controle de ponto. " +
  "Responda em português do Brasil, com frases curtas e cordiais. " +
  "Fale só sobre o TimeTrack; recuse com educação qualquer outro assunto. " +
  "Não informe preços: ofereça falar com um atendente humano.";

const ERRO_AMIGAVEL = "Tive um problema para responder agora. Pode tentar de novo em instantes?";

// Últimas chamadas, a mais recente primeiro. Vive na memória desta instância do servidor.
const conexoes: Conexao[] = [];

function registrar(cerebro: Cerebro, mensagens: Mensagem[]) {
  const ultima = [...mensagens].reverse().find((m) => m.role === "user");
  conexoes.unshift({
    hora: new Date().toISOString(),
    cerebro,
    mensagem: Array.from(ultima?.content ?? "").slice(0, 80).join(""),
  });
  conexoes.length = Math.min(conexoes.length, MAX_CONEXOES);
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro("Não entendi o pedido. Envie um JSON com messages e system.", 400);
  }

  const pedido = lerPedido(corpo);
  if (!pedido) {
    return erro("Envie messages com pelo menos uma mensagem do usuário.", 400);
  }

  return responder(pedido.messages, pedido.system, "text/event-stream", request.signal);
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  if (params.has("conexoes")) {
    return Response.json(conexoes, { headers: { ...cors, "Cache-Control": "no-store" } });
  }

  if (params.has("teste")) {
    const mensagens: Mensagem[] = [{ role: "user", content: MENSAGEM_TESTE }];
    return responder(mensagens, SISTEMA_PADRAO, "text/plain; charset=utf-8", request.signal);
  }

  return erro("Use POST para conversar, ?teste=1 para testar ou ?conexoes=1 para ver as conexões.", 400);
}

function lerPedido(corpo: unknown): { messages: Mensagem[]; system: string } | null {
  if (!corpo || typeof corpo !== "object") return null;
  const { messages, system } = corpo as { messages?: unknown; system?: unknown };
  if (!Array.isArray(messages)) return null;

  const validas: Mensagem[] = [];
  for (const m of messages) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    if (content.trim()) validas.push({ role, content: content.slice(0, MAX_CARACTERES) });
  }

  if (!validas.some((m) => m.role === "user")) return null;
  const sistema = typeof system === "string" && system.trim() ? system : SISTEMA_PADRAO;
  return { messages: validas.slice(-MAX_MENSAGENS), system: sistema };
}

// ---------- Resposta em stream ----------

const codificador = new TextEncoder();

function evento(dados: Record<string, string>) {
  return codificador.encode(`data: ${JSON.stringify(dados)}\n\n`);
}

function cabecalhos(tipo: string) {
  return {
    ...cors,
    "Content-Type": tipo,
    "Cache-Control": "no-cache, no-transform",
    "X-Content-Type-Options": "nosniff",
  };
}

function erro(message: string, status: number) {
  return new Response(evento({ type: "error", message }), {
    status,
    headers: cabecalhos("text/event-stream"),
  });
}

function responder(mensagens: Mensagem[], sistema: string, tipo: string, sinal: AbortSignal) {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enviar = (dados: Record<string, string>) => {
        try {
          controller.enqueue(evento(dados));
        } catch {
          // A conexão já fechou; não há para quem enviar.
        }
      };
      const texto = (text: string) => enviar({ type: "text", text });

      let cerebro: Cerebro = "regras";
      try {
        const chave = process.env.GEMINI_API_KEY;
        const resultado = chave ? await responderComGemini(chave, mensagens, sistema, texto, sinal) : "falhou";

        if (resultado === "falhou") {
          await responderPorRegras(mensagens, texto, sinal);
        } else {
          cerebro = "gemini";
        }

        if (resultado === "interrompido") {
          enviar({ type: "error", message: ERRO_AMIGAVEL });
        } else {
          enviar({ type: "done", cerebro });
        }
      } catch {
        enviar({ type: "error", message: ERRO_AMIGAVEL });
      } finally {
        registrar(cerebro, mensagens);
        try {
          controller.close();
        } catch {
          // Já fechado.
        }
      }
    },
  });

  return new Response(stream, { headers: cabecalhos(tipo) });
}

// ---------- Gemini ----------

// "ok": respondeu tudo. "falhou": nada foi enviado, dá para cair nas regras.
// "interrompido": parou no meio da resposta, depois de já ter enviado texto.
type ResultadoGemini = "ok" | "falhou" | "interrompido";

async function responderComGemini(
  chave: string,
  mensagens: Mensagem[],
  sistema: string,
  texto: (t: string) => void,
  sinal: AbortSignal,
): Promise<ResultadoGemini> {
  let enviouTexto = false;
  const cancelar = new AbortController();
  const aoCancelar = () => cancelar.abort();
  sinal.addEventListener("abort", aoCancelar);
  const esperaInicio = setTimeout(aoCancelar, ESPERA_GEMINI_MS);
  const limite = setTimeout(aoCancelar, LIMITE_GEMINI_MS);

  try {
    const resposta = await fetch(URL_GEMINI, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sistema }] },
        contents: mensagens.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      }),
      signal: cancelar.signal,
      cache: "no-store",
    });
    clearTimeout(esperaInicio);

    if (!resposta.ok || !resposta.body) {
      // Só o status: o corpo do erro pode repetir dados do pedido.
      console.error(`[cerebro] Gemini respondeu ${resposta.status}`);
      return "falhou";
    }

    const leitor = resposta.body.pipeThrough(new TextDecoderStream()).getReader();
    let pendente = "";

    for (;;) {
      const { done, value } = await leitor.read();
      if (value) pendente += value;

      // O Gemini manda eventos SSE separados por linha em branco.
      const blocos = pendente.split(/\r?\n\r?\n/);
      pendente = done ? "" : (blocos.pop() ?? "");

      for (const bloco of blocos) {
        const pedaco = lerEventoGemini(bloco);
        if (pedaco) {
          texto(pedaco);
          enviouTexto = true;
        }
      }

      if (done) break;
    }

    return enviouTexto ? "ok" : "falhou";
  } catch (e) {
    console.error(`[cerebro] Falha no Gemini: ${e instanceof Error ? e.name : "erro desconhecido"}`);
    return enviouTexto ? "interrompido" : "falhou";
  } finally {
    clearTimeout(esperaInicio);
    clearTimeout(limite);
    sinal.removeEventListener("abort", aoCancelar);
  }
}

function lerEventoGemini(bloco: string): string {
  const dados = bloco
    .split(/\r?\n/)
    .filter((linha) => linha.startsWith("data:"))
    .map((linha) => linha.slice(5).trim())
    .join("");
  if (!dados) return "";

  const json = JSON.parse(dados) as {
    error?: { message?: string };
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  };
  if (json.error) throw new Error("Erro no stream do Gemini");

  const partes = json.candidates?.[0]?.content?.parts ?? [];
  return partes
    .filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("");
}

// ---------- Regras ----------

async function responderPorRegras(mensagens: Mensagem[], texto: (t: string) => void, sinal: AbortSignal) {
  const ultima = [...mensagens].reverse().find((m) => m.role === "user")?.content ?? "";
  const resposta = respostaPorRegras(ultima);

  // Pedaços de poucas palavras, com uma pausa curta para parecer digitação.
  const palavras = resposta.match(/\S+\s*/g) ?? [];
  for (let i = 0; i < palavras.length; i += 3) {
    if (sinal.aborted) return;
    texto(palavras.slice(i, i + 3).join(""));
    await new Promise((r) => setTimeout(r, 40));
  }
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const reEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const reAcesso = /\b(login|logar|logo\s+no|loga|logando|logou|entrar|entro|senha\w*|acess\w*|bloque\w*|desbloque\w*|travad\w*)\b/;
const rePreco = /\b(preco\w*|valor\w*|plano\w*|custa\w*|custo\w*|mensalidade\w*|cobra\w*|orcamento\w*)\b/;
const reForaDoTema =
  /\b(receita\w*|futebol|jogo\w*|filme\w*|serie\w*|musica\w*|piada\w*|poema\w*|poesia|politic\w*|eleica\w*|previsao do tempo|clima|horoscopo|signo\w*|namor\w*|viage\w*|bitcoin|cripto\w*|aposta\w*|loteria|novela\w*)\b/;
const reTimeTrack =
  /\b(timetrack|ponto|batida\w*|bater|registr\w*|marcac\w*|relatorio\w*|espelho|hora\w*|jornada\w*|escala\w*|turno\w*|equipe\w*|funcionari\w*|colaborador\w*|aplicativo|app|sistema|conta|chamado\w*|protocolo|folha|export\w*|integra\w*|erro\w*|bug\w*|ferias|banco de horas|suporte|atendente|cadastr\w*|email|usuario\w*|empresa)\b/;
const reSaudacao = /\b(oi|ola|bom dia|boa tarde|boa noite|ajuda|ajudar|socorro|obrigad\w*|valeu|tudo bem)\b/;

function respostaPorRegras(mensagem: string): string {
  const email = mensagem.match(reEmail)?.[0];
  if (email) return explicarConta(email);

  const texto = normalizar(mensagem);

  if (reAcesso.test(texto)) {
    return "Vou verificar o seu acesso. Qual é o email que você usa para entrar no TimeTrack?";
  }

  if (rePreco.test(texto)) {
    return "Não informo preços nem condições de planos por aqui. Se quiser, passo você para um atendente humano, que explica tudo com calma. Posso fazer isso?";
  }

  const palavras = texto.split(/\s+/).filter(Boolean).length;
  const foraDoTema = reForaDoTema.test(texto) || (!reTimeTrack.test(texto) && !reSaudacao.test(texto) && palavras > 3);
  if (foraDoTema) {
    return "Desculpe, só consigo ajudar com assuntos do TimeTrack, como acesso à conta, registro de ponto e relatórios. Em que posso ajudar no TimeTrack?";
  }

  return "Olá! Sou o atendente do TimeTrack. Como posso ajudar você com o TimeTrack hoje?";
}

function explicarConta(email: string): string {
  const usuario = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!usuario) {
    return `Não encontrei nenhuma conta com o email ${email}. Pode conferir se está escrito certo, do jeito que você usa para entrar no TimeTrack?`;
  }

  const nome = usuario.nome.split(" ")[0];
  switch (usuario.statusConta) {
    case "bloqueada":
      return `${nome}, encontrei a sua conta e ela está bloqueada. Motivo: ${minuscula(usuario.motivoBloqueio ?? "não informado")}. ${comoDesbloquear(usuario)}`;
    case "pendente":
      return `${nome}, encontrei a sua conta, mas o cadastro ainda está pendente: falta confirmar o email. Procure a mensagem do TimeTrack na sua caixa de entrada, e também no spam, e clique no link de confirmação. Depois disso você já consegue entrar. Se o email não chegou, posso chamar um atendente humano para reenviar.`;
    case "ativa":
      return `${nome}, a sua conta está ativa e sem nenhum bloqueio. ${
        usuario.ultimoLogin ? `O último acesso foi em ${formatarDataHora(usuario.ultimoLogin)}.` : "Ela ainda não teve nenhum acesso."
      } Se não está conseguindo entrar, confira se digitou o email certo e use "Esqueci minha senha" na tela de entrada para criar uma senha nova.`;
  }
}

function comoDesbloquear(usuario: Usuario) {
  const motivo = normalizar(usuario.motivoBloqueio ?? "");
  if (motivo.includes("senha")) {
    return 'Para liberar, use "Esqueci minha senha" na tela de entrada e crie uma senha nova; o acesso volta assim que a senha for trocada. Se preferir, chamo um atendente humano.';
  }
  if (motivo.includes("pagamento")) {
    return "Para liberar, quem cuida do financeiro da sua empresa precisa regularizar a assinatura. Assim que o pagamento for confirmado, o acesso volta. Se precisar da fatura, chamo um atendente humano.";
  }
  return "Para liberar, posso chamar um atendente humano, que resolve isso com você.";
}

function minuscula(texto: string) {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}
