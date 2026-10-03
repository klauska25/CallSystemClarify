// Prazo de atendimento (SLA) dos chamados e a lista "Precisa de atenção" da Visão geral.
// Cruza chamados, contas e status do sistema para dizer ao suporte por onde começar.
import type { Categoria, Chamado, Prioridade, StatusSistema, Usuario } from "./dados";
import type { Tom } from "./rotulos";

// Prazo para resolver, em horas, contado da abertura do chamado.
export const PRAZO_HORAS: Record<Prioridade, number> = { critica: 4, alta: 8, media: 24, baixa: 72 };

// Os dados são fictícios e "hoje" é 01/10/2026: o relógio do painel para na última
// atualização do status, para os prazos não mudarem a cada visita.
export const agoraDoPainel = (status: StatusSistema) => Date.parse(status.atualizadoEm);

export type Sla = { atrasado: boolean; minutos: number }; // minutos que faltam ou de atraso

export function emAberto(c: Chamado) {
  return c.status === "aberto" || c.status === "em-andamento";
}

// null: chamado já resolvido ou fechado, sem prazo correndo.
export function calcularSla(c: Chamado, agora: number): Sla | null {
  if (!emAberto(c)) return null;
  const passados = Math.max(0, Math.floor((agora - Date.parse(c.criadoEm)) / 60000));
  const restantes = PRAZO_HORAS[c.prioridade] * 60 - passados;
  return { atrasado: restantes < 0, minutos: Math.abs(restantes) };
}

export function formatarPrazo(minutos: number) {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 48) return minutos % 60 ? `${horas}h ${String(minutos % 60).padStart(2, "0")}min` : `${horas}h`;
  return `${Math.floor(horas / 24)} dias`;
}

export function rotuloSla(sla: Sla): { rotulo: string; tom: Tom } {
  if (sla.atrasado) return { rotulo: `Atrasado há ${formatarPrazo(sla.minutos)}`, tom: "danger" };
  return { rotulo: `Faltam ${formatarPrazo(sla.minutos)}`, tom: sla.minutos <= 120 ? "warn" : "neutral" };
}

export type Alerta = { id: string; tom: Tom; titulo: string; detalhe: string; peso: number };

const PESO_PRIORIDADE: Record<Prioridade, number> = { critica: 40, alta: 30, media: 20, baixa: 10 };

// Componente do sistema que costuma estar por trás de cada categoria de chamado.
const COMPONENTE_DA_CATEGORIA: Partial<Record<Categoria, string>> = {
  integracao: "Integração Folha",
  dados: "Relatórios",
  bug: "App Mobile",
};

const primeiroNome = (u: Usuario | undefined, email: string) => (u ? u.nome.split(" ")[0] : email);

export function listarAlertas(chamados: Chamado[], usuarios: Usuario[], status: StatusSistema): Alerta[] {
  const agora = agoraDoPainel(status);
  const alertas: Alerta[] = [];
  const porEmail = new Map(usuarios.map((u) => [u.email.toLowerCase(), u]));
  const componentesExplicados = new Set<string>();
  const contasExplicadas = new Set<string>();

  for (const c of chamados) {
    const sla = calcularSla(c, agora);
    if (!sla) continue;
    const u = porEmail.get(c.usuarioEmail.toLowerCase());
    const quem = u ? `${primeiroNome(u, c.usuarioEmail)} (${u.empresa})` : c.usuarioEmail;
    const pistas: string[] = [];

    const nomeComponente = COMPONENTE_DA_CATEGORIA[c.categoria];
    const componente = status.componentes.find((x) => x.nome === nomeComponente && x.status !== "operacional");
    if (componente) {
      pistas.push(`${componente.nome} está ${componente.status === "fora-do-ar" ? "fora do ar" : "degradada"}. Pode ser a mesma causa.`);
      componentesExplicados.add(componente.nome);
    }
    if (u?.statusConta === "bloqueada") {
      pistas.push(`A conta está bloqueada: ${u.motivoBloqueio?.toLowerCase() ?? "sem motivo registrado"}.`);
      contasExplicadas.add(u.email);
    }

    // Só entram na lista os chamados atrasados ou perto de estourar o prazo (2h).
    if (!sla.atrasado && sla.minutos > 120 && pistas.length === 0) continue;

    alertas.push({
      id: c.protocolo,
      tom: sla.atrasado ? "danger" : "warn",
      titulo: `${c.protocolo} de ${quem} ${sla.atrasado ? `está atrasado há ${formatarPrazo(sla.minutos)}` : `vence em ${formatarPrazo(sla.minutos)}`}.`,
      detalhe: [c.descricao, ...pistas].join(" "),
      peso: PESO_PRIORIDADE[c.prioridade] + (sla.atrasado ? 5 : 0),
    });
  }

  for (const x of status.componentes) {
    if (x.status === "operacional" || componentesExplicados.has(x.nome)) continue;
    alertas.push({
      id: `componente-${x.nome}`,
      tom: x.status === "fora-do-ar" ? "danger" : "warn",
      titulo: `${x.nome} está ${x.status === "fora-do-ar" ? "fora do ar" : "degradada"}.`,
      detalhe: x.detalhe ?? "Afeta todos os clientes que usam esse recurso.",
      peso: x.status === "fora-do-ar" ? 50 : 25,
    });
  }

  for (const u of usuarios) {
    if (u.statusConta !== "bloqueada" || contasExplicadas.has(u.email)) continue;
    alertas.push({
      id: `conta-${u.id}`,
      tom: "warn",
      titulo: `${primeiroNome(u, u.email)} (${u.empresa}) está com a conta bloqueada.`,
      detalhe: `Motivo: ${u.motivoBloqueio?.toLowerCase() ?? "não registrado"}. Ainda não abriu chamado.`,
      peso: 15,
    });
  }

  return alertas.sort((a, b) => b.peso - a.peso);
}
