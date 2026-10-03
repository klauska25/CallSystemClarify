"use client";

import { useEffect, useState, type ReactNode } from "react";

// Taxímetro de reunião: soma em tempo real quanto a reunião custa pelo salário de quem está na sala.

// Custo médio por hora de cada cargo, com encargos. Valores fictícios.
const cargos = [
  { id: "estagiario", rotulo: "Estagiário", porHora: 15 },
  { id: "analista", rotulo: "Analista", porHora: 45 },
  { id: "gerente", rotulo: "Gerente", porHora: 110 },
  { id: "diretor", rotulo: "Diretor", porHora: 250 },
] as const;

type CargoId = (typeof cargos)[number]["id"];
type Pessoas = Record<CargoId, number>;

// O que daria para comprar com o dinheiro da reunião, do mais barato ao mais caro.
const comparacoes = [
  { singular: "cafezinho", plural: "cafezinhos", preco: 6 },
  { singular: "coxinha", plural: "coxinhas", preco: 9 },
  { singular: "pizza grande", plural: "pizzas grandes", preco: 70 },
  { singular: "cesta básica", plural: "cestas básicas", preco: 780 },
  { singular: "iPhone", plural: "iPhones", preco: 7500 },
];

const PASSO_MS = 100;

// Lido só nos cliques e no intervalo, nunca durante a renderização.
const relogio = () => Date.now();

const reais = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function cronometro(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

const custoPorHora = (pessoas: Pessoas) => cargos.reduce((soma, c) => soma + c.porHora * pessoas[c.id], 0);

export function Taximetro() {
  const [pessoas, setPessoas] = useState<Pessoas>({ estagiario: 1, analista: 3, gerente: 1, diretor: 0 });
  // Custo e tempo já fechados, e o início do trecho que está rodando (null: parado).
  const [base, setBase] = useState({ custo: 0, ms: 0 });
  const [inicio, setInicio] = useState<number | null>(null);
  const [agora, setAgora] = useState(0);

  useEffect(() => {
    if (inicio === null) return;
    const id = setInterval(() => setAgora(relogio()), PASSO_MS);
    return () => clearInterval(id);
  }, [inicio]);

  const porHora = custoPorHora(pessoas);
  const trecho = inicio === null ? 0 : Math.max(0, agora - inicio);
  const ms = base.ms + trecho;
  const custo = base.custo + (porHora * trecho) / 3_600_000;
  const rodando = inicio !== null;
  const totalPessoas = cargos.reduce((soma, c) => soma + pessoas[c.id], 0);

  // Fecha o trecho atual com o custo da sala como estava, para a mudança valer só daqui para frente.
  function fecharTrecho() {
    const momento = relogio();
    if (inicio !== null) {
      const decorrido = momento - inicio;
      setBase((b) => ({ custo: b.custo + (porHora * decorrido) / 3_600_000, ms: b.ms + decorrido }));
    }
    return momento;
  }

  function alternar() {
    if (rodando) {
      fecharTrecho();
      setInicio(null);
    } else {
      const momento = relogio();
      setInicio(momento);
      setAgora(momento);
    }
  }

  function zerar() {
    setBase({ custo: 0, ms: 0 });
    setInicio(null);
  }

  function mudarPessoas(id: CargoId, passo: number) {
    if (rodando) {
      const momento = fecharTrecho();
      setInicio(momento);
      setAgora(momento);
    }
    setPessoas((p) => ({ ...p, [id]: Math.max(0, Math.min(50, p[id] + passo)) }));
  }

  const compraveis = comparacoes.filter((c) => custo >= c.preco);

  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
      <section aria-labelledby="titulo-taximetro" className="glass flex flex-col rounded-3xl p-6 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Taxímetro de reunião</p>
        <h1 id="titulo-taximetro" className="mt-3 font-display text-3xl font-medium text-fg md:text-4xl">
          Quanto custa esta reunião?
        </h1>
        <p className="mt-1 text-muted">Escolha quem está na sala e aperte Iniciar.</p>

        <p
          aria-live="off"
          className="mt-10 break-all font-display text-5xl font-medium tabular-nums tracking-tight text-fg sm:text-7xl md:text-8xl"
        >
          {reais(custo)}
        </p>
        <p className="mt-3 font-mono text-sm tabular-nums text-muted">
          {cronometro(ms)} · {reais(porHora / 60)} por minuto · {totalPessoas} {totalPessoas === 1 ? "pessoa" : "pessoas"}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={alternar}
            disabled={!rodando && porHora === 0}
            className="glow-brand h-16 flex-1 rounded-full bg-brand px-8 text-lg font-bold text-ink transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-brand/35 disabled:text-ink/55 disabled:shadow-none md:text-xl"
          >
            {rodando ? "Pausar" : ms > 0 ? "Continuar" : "Iniciar"}
          </button>
          <button
            type="button"
            onClick={zerar}
            disabled={ms === 0 && !rodando}
            className="neu-raised h-16 rounded-full bg-neu px-8 text-lg font-bold text-fg transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line active:translate-y-0 active:neu-inset disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Zerar
          </button>
        </div>

        <div className="mt-8 min-h-16" aria-live="polite">
          {compraveis.length === 0 ? (
            <p className="text-sm text-muted">
              {ms === 0 ? "O valor sobe a cada décimo de segundo." : "Ainda não dá para pagar nem um cafezinho."}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted">Com esse dinheiro já dava para pagar</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {compraveis.map((c) => {
                  const qtd = Math.floor(custo / c.preco);
                  return (
                    <li key={c.singular} className="glass-soft rounded-full px-4 py-2 text-sm font-semibold text-fg">
                      <span className="tabular-nums">{qtd}</span> {qtd === 1 ? c.singular : c.plural}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="titulo-sala" className="glass flex flex-col rounded-3xl p-6 md:p-8">
        <h2 id="titulo-sala" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Quem está na sala
        </h2>

        <ul className="mt-4 space-y-2">
          {cargos.map((c) => (
            <li key={c.id} className="neu-raised flex items-center justify-between gap-3 rounded-2xl bg-neu p-4">
              <div>
                <p className="font-semibold text-fg">{c.rotulo}</p>
                <p className="font-mono text-xs text-muted">{reais(c.porHora)} por hora</p>
              </div>
              <div className="flex items-center gap-2">
                <BotaoPasso rotulo={`Tirar um ${c.rotulo.toLowerCase()}`} onClick={() => mudarPessoas(c.id, -1)} disabled={pessoas[c.id] === 0}>
                  <path d="M5 12h14" />
                </BotaoPasso>
                <span className="w-8 text-center font-display text-xl font-medium tabular-nums text-fg" aria-live="polite">
                  {pessoas[c.id]}
                </span>
                <BotaoPasso rotulo={`Adicionar um ${c.rotulo.toLowerCase()}`} onClick={() => mudarPessoas(c.id, 1)} disabled={pessoas[c.id] === 50}>
                  <path d="M12 5v14M5 12h14" />
                </BotaoPasso>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <p className="text-sm text-muted">Custo da sala por hora</p>
          <p className="mt-1 font-display text-3xl font-medium tabular-nums text-fg">{reais(porHora)}</p>
          <p className="mt-4 font-mono text-xs text-muted">Valores médios fictícios, com encargos.</p>
        </div>
      </section>
    </div>
  );
}

function BotaoPasso({
  rotulo,
  onClick,
  disabled,
  children,
}: {
  rotulo: string;
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      onClick={onClick}
      disabled={disabled}
      className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-line disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
