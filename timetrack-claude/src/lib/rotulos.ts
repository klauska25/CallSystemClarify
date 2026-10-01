// Rótulos em português e tons das etiquetas para os valores de dados.ts.
import type {
  Categoria,
  Plano,
  Prioridade,
  StatusChamado,
  StatusConta,
  StatusOperacional,
  TipoRegistro,
} from "./dados";

export type Tom = "ok" | "info" | "warn" | "danger" | "neutral";

type Etiqueta = { rotulo: string; tom: Tom };

export const planos: Record<Plano, string> = {
  free: "Free",
  starter: "Starter",
  business: "Business",
  enterprise: "Enterprise",
};

export const categorias: Record<Categoria, string> = {
  acesso: "Acesso",
  dados: "Dados",
  integracao: "Integração",
  duvida: "Dúvida",
  bug: "Bug",
  feature: "Sugestão",
};

export const statusConta: Record<StatusConta, Etiqueta> = {
  ativa: { rotulo: "Ativa", tom: "ok" },
  pendente: { rotulo: "Pendente", tom: "warn" },
  bloqueada: { rotulo: "Bloqueada", tom: "danger" },
};

export const prioridades: Record<Prioridade, Etiqueta> = {
  baixa: { rotulo: "Baixa", tom: "neutral" },
  media: { rotulo: "Média", tom: "info" },
  alta: { rotulo: "Alta", tom: "warn" },
  critica: { rotulo: "Crítica", tom: "danger" },
};

export const statusChamado: Record<StatusChamado, Etiqueta> = {
  aberto: { rotulo: "Aberto", tom: "info" },
  "em-andamento": { rotulo: "Em andamento", tom: "warn" },
  resolvido: { rotulo: "Resolvido", tom: "ok" },
  fechado: { rotulo: "Fechado", tom: "neutral" },
};

export const statusOperacional: Record<StatusOperacional, Etiqueta> = {
  operacional: { rotulo: "Operacional", tom: "ok" },
  degradado: { rotulo: "Degradado", tom: "warn" },
  "fora-do-ar": { rotulo: "Fora do ar", tom: "danger" },
};

export const tiposRegistro: Record<TipoRegistro, Etiqueta> = {
  entrada: { rotulo: "Entrada", tom: "info" },
  saida: { rotulo: "Saída", tom: "neutral" },
};
