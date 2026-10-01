// Resumo semanal de ponto para a demonstração da página do produto.
// Lê os registros de dados.ts e calcula horas por dia sem depender de fuso:
// as horas vêm direto do texto ISO (já em -03:00).
import { registrosPonto, usuarios, type RegistroPonto, type Usuario } from "./dados";

export const JORNADA_MIN = 8 * 60;
const NOTURNO = [
  [0, 5 * 60],
  [22 * 60, 29 * 60],
] as const; // 22h às 5h

export const SEMANA = {
  numero: 39,
  dias: ["2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-27"],
};

const NOMES_DIA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export type Periodo = { inicio: string; fim: string | null };

export type Dia = {
  data: string;
  nome: string;    // "Segunda"
  curto: string;   // "Seg"
  rotulo: string;  // "Segunda, 21/09"
  folga: boolean;
  periodos: Periodo[];
  trabalhadoMin: number; // só períodos fechados
  extrasMin: number;
  noturnoMin: number;
  pendente: boolean;     // alguma entrada sem saída
};

export type Funcionario = {
  usuario: Usuario;
  setor: string;
  escala: string;
  dias: Dia[];
  totais: { trabalhadoMin: number; extrasMin: number; noturnoMin: number; pendencias: number };
};

// Setor e escala só existem na demonstração.
const PERFIS: Record<string, { setor: string; escala: string }> = {
  "joao@empresa.com": { setor: "Vendas", escala: "5x2" },
  "mariana.costa@construtorahorizonte.com.br": { setor: "Obras", escala: "5x2" },
  "fernanda.lima@farmabemestar.com.br": { setor: "Farmácia", escala: "13h às 22h" },
};

const minutos = (iso: string) => Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16));
export const hora = (iso: string) => iso.slice(11, 16);

function sobreposicao(a: number, b: number, [c, d]: readonly [number, number]) {
  return Math.max(0, Math.min(b, d) - Math.max(a, c));
}

function montarDia(data: string, indice: number, registros: RegistroPonto[]): Dia {
  const doDia = registros.filter((r) => r.dataHora.startsWith(data)).sort((a, b) => a.dataHora.localeCompare(b.dataHora));

  const periodos: Periodo[] = [];
  for (const r of doDia) {
    if (r.tipo === "entrada") periodos.push({ inicio: r.dataHora, fim: null });
    else if (periodos.length && periodos[periodos.length - 1].fim === null) periodos[periodos.length - 1].fim = r.dataHora;
  }

  let trabalhadoMin = 0;
  let noturnoMin = 0;
  for (const { inicio, fim } of periodos) {
    if (!fim) continue;
    const a = minutos(inicio);
    const b = minutos(fim) < a ? minutos(fim) + 24 * 60 : minutos(fim);
    trabalhadoMin += b - a;
    noturnoMin += NOTURNO.reduce((soma, faixa) => soma + sobreposicao(a, b, faixa), 0);
  }
  const pendente = periodos.some((p) => p.fim === null);
  const [, mes, diaMes] = data.split("-");

  return {
    data,
    nome: NOMES_DIA[indice],
    curto: NOMES_DIA[indice].slice(0, 3),
    rotulo: `${NOMES_DIA[indice]}, ${diaMes}/${mes}`,
    folga: periodos.length === 0,
    periodos,
    trabalhadoMin,
    // Sem a saída, não dá para saber se houve extra.
    extrasMin: pendente ? 0 : Math.max(0, trabalhadoMin - JORNADA_MIN),
    noturnoMin,
    pendente,
  };
}

export const equipe: Funcionario[] = Object.keys(PERFIS).map((email) => {
  const usuario = usuarios.find((u) => u.email === email)!;
  const registros = registrosPonto.filter((r) => r.usuarioEmail === email);
  const dias = SEMANA.dias.map((data, i) => montarDia(data, i, registros));
  return {
    usuario,
    ...PERFIS[email],
    dias,
    totais: {
      trabalhadoMin: dias.reduce((s, d) => s + d.trabalhadoMin, 0),
      extrasMin: dias.reduce((s, d) => s + d.extrasMin, 0),
      noturnoMin: dias.reduce((s, d) => s + d.noturnoMin, 0),
      pendencias: dias.filter((d) => d.pendente).length,
    },
  };
});

export function formatarMin(min: number) {
  return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, "0")}`;
}

export function iniciais(nome: string) {
  const partes = nome.split(" ");
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
