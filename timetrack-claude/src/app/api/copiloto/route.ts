// Copiloto do atendente: lê um chamado, a conta do cliente e o status do sistema e devolve
// diagnóstico, próxima ação e uma resposta pronta. Usa o Gemini quando há GEMINI_API_KEY;
// sem chave, ou se o Gemini falhar, responde por regras com os mesmos dados.
import { LISTA_ACOES, type AcaoCopiloto, type Sugestao } from "@/lib/copiloto";
import { contextoEmTexto, montarContexto, sugestaoPorRegras, type Contexto } from "@/lib/copiloto-servidor";
import type { Categoria, Chamado, Prioridade, StatusChamado } from "@/lib/dados";
import { modelosGemini } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LIMITE_GEMINI_MS = 40_000; // todas as tentativas juntas, com folga antes do maxDuration

const INSTRUCOES =
  "Você é o copiloto de um atendente humano do suporte do TimeTrack, um sistema de ponto eletrônico. " +
  "Leia os dados do chamado e devolva um JSON com: " +
  "diagnostico (1 a 3 frases para o atendente, dizendo a causa mais provável e citando os dados que a sustentam); " +
  "acao (a próxima ação, escolhida da lista permitida); " +
  "motivoAcao (1 frase dizendo por que essa ação); " +
  "resposta (a mensagem pronta para o atendente mandar ao cliente). " +
  "Regras da resposta ao cliente: português do Brasil, tom cordial e direto, no máximo 5 frases, " +
  'comece com "Olá, <primeiro nome>." e termine com uma linha em branco seguida de "Equipe de suporte TimeTrack". ' +
  "Não use emojis nem travessões. Não invente fatos, prazos, telas ou valores que não estejam nos dados. " +
  "Não informe preços. Nunca revele dados de outros clientes.";

const ESQUEMA = {
  type: "OBJECT",
  properties: {
    diagnostico: { type: "STRING" },
    acao: { type: "STRING", enum: LISTA_ACOES },
    motivoAcao: { type: "STRING" },
    resposta: { type: "STRING" },
  },
  required: ["diagnostico", "acao", "motivoAcao", "resposta"],
  propertyOrdering: ["diagnostico", "acao", "motivoAcao", "resposta"],
};

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ erro: "Envie um JSON com o chamado." }, { status: 400 });
  }

  const chamado = lerChamado(corpo);
  if (!chamado) return Response.json({ erro: "Chamado inválido." }, { status: 400 });

  const ctx = montarContexto(chamado);
  const chave = process.env.GEMINI_API_KEY;
  const sugestao = (chave && (await sugerirComGemini(chave, ctx, request.signal))) || sugestaoPorRegras(ctx);
  return Response.json(sugestao, { headers: { "Cache-Control": "no-store" } });
}

// ---------- Pedido ----------

const CATEGORIAS: Categoria[] = ["acesso", "dados", "integracao", "duvida", "bug", "feature"];
const PRIORIDADES: Prioridade[] = ["baixa", "media", "alta", "critica"];
const STATUS: StatusChamado[] = ["aberto", "em-andamento", "resolvido", "fechado"];

const texto = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

// Aceita só os campos do chamado, com tamanho limitado.
function lerChamado(corpo: unknown): Chamado | null {
  if (!corpo || typeof corpo !== "object") return null;
  const c = corpo as Record<string, unknown>;
  const protocolo = texto(c.protocolo, 20);
  const usuarioEmail = texto(c.usuarioEmail, 120);
  const descricao = texto(c.descricao, 1000);
  const criadoEm = texto(c.criadoEm, 40);
  const categoria = CATEGORIAS.find((x) => x === c.categoria);
  const prioridade = PRIORIDADES.find((x) => x === c.prioridade);
  const status = STATUS.find((x) => x === c.status);

  if (!protocolo || !/^TT-\d{4}-\d{6}$/.test(protocolo)) return null;
  if (!usuarioEmail || !descricao || !criadoEm || Number.isNaN(Date.parse(criadoEm))) return null;
  if (!categoria || !prioridade || !status) return null;
  return { protocolo, usuarioEmail, descricao, criadoEm, categoria, prioridade, status };
}

// ---------- Gemini ----------

function urlGemini(modelo: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`;
}

// null: nenhum modelo deu uma resposta válida; quem chamou cai nas regras.
async function sugerirComGemini(chave: string, ctx: Contexto, sinal: AbortSignal): Promise<Sugestao | null> {
  const cancelar = new AbortController();
  const aoCancelar = () => cancelar.abort();
  sinal.addEventListener("abort", aoCancelar);
  const limite = setTimeout(aoCancelar, LIMITE_GEMINI_MS);

  const corpo = JSON.stringify({
    systemInstruction: { parts: [{ text: INSTRUCOES }] },
    contents: [{ role: "user", parts: [{ text: contextoEmTexto(ctx) }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: ESQUEMA, temperature: 0.4 },
  });

  try {
    // Diferente do chatbot, aqui qualquer falha tenta o próximo modelo: um modelo pode
    // não aceitar o formato de resposta (400) ou devolver um JSON incompleto.
    for (const modelo of modelosGemini()) {
      if (cancelar.signal.aborted) break;
      try {
        const resposta = await fetch(urlGemini(modelo), {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
          body: corpo,
          signal: cancelar.signal,
          cache: "no-store",
        });
        if (!resposta.ok) {
          // Só o status: o corpo do erro pode repetir dados do pedido.
          console.error(`[copiloto] Gemini (${modelo}) respondeu ${resposta.status}`);
          await resposta.body?.cancel();
          if (resposta.status === 401 || resposta.status === 403) return null; // chave inválida
          continue;
        }
        const sugestao = lerSugestao(await resposta.json());
        if (sugestao) return { ...sugestao, origem: "gemini", modelo };
        console.error(`[copiloto] Gemini (${modelo}) devolveu um JSON fora do formato`);
      } catch (e) {
        console.error(`[copiloto] Falha no Gemini (${modelo}): ${e instanceof Error ? e.name : "erro desconhecido"}`);
      }
    }
    return null;
  } finally {
    clearTimeout(limite);
    sinal.removeEventListener("abort", aoCancelar);
  }
}

type RespostaGemini = { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] };

function lerSugestao(json: RespostaGemini): Omit<Sugestao, "origem"> | null {
  const bruto = (json.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("")
    .trim()
    .replace(/^```(?:json)?\s*|\s*```$/g, "");

  try {
    const s = JSON.parse(bruto) as Record<string, unknown>;
    const acao = LISTA_ACOES.find((a) => a === s.acao) as AcaoCopiloto | undefined;
    const diagnostico = texto(s.diagnostico, 800);
    const motivoAcao = texto(s.motivoAcao, 300);
    const resposta = texto(s.resposta, 2000);
    if (!acao || !diagnostico || !motivoAcao || !resposta) return null;
    return { acao, diagnostico, motivoAcao, resposta: semTravessoes(resposta) };
  } catch {
    return null;
  }
}

// A interface não usa travessões; se o modelo escapar, vira vírgula.
const semTravessoes = (t: string) => t.replace(/\s*[—–]\s*/g, ", ");
