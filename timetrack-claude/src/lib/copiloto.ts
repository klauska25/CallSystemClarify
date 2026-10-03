// Copiloto do atendente: tipos e rótulos usados pela tela e pela rota /api/copiloto.
import type { Tom } from "./rotulos";

export const ACOES = {
  enviar_link_senha: { rotulo: "Enviar link de nova senha", tom: "info" },
  reenviar_confirmacao: { rotulo: "Reenviar email de confirmação", tom: "info" },
  encaminhar_financeiro: { rotulo: "Encaminhar ao financeiro", tom: "warn" },
  escalar_engenharia: { rotulo: "Escalar para a engenharia", tom: "danger" },
  pedir_mais_informacoes: { rotulo: "Pedir mais informações", tom: "neutral" },
  responder_e_resolver: { rotulo: "Responder e resolver", tom: "ok" },
  registrar_sugestao: { rotulo: "Registrar a sugestão", tom: "neutral" },
} as const satisfies Record<string, { rotulo: string; tom: Tom }>;

export type AcaoCopiloto = keyof typeof ACOES;
export const LISTA_ACOES = Object.keys(ACOES) as AcaoCopiloto[];

export type Sugestao = {
  diagnostico: string;
  acao: AcaoCopiloto;
  motivoAcao: string;
  resposta: string;
  origem: "gemini" | "regras";
  modelo?: string; // modelo do Gemini que respondeu
};
