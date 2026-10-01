import type { ReactNode } from "react";

// "O que o TimeTrack faz": quatro cartões de vidro que ficam mais foscos no hover.

// Ícones novos no mesmo traço do design system: grade de 24px, linha de 2px, pontas redondas.
function Icone({ children }: { children: ReactNode }) {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const recursos = [
  {
    titulo: "Registro de ponto",
    texto: "Batidas pelo app com localização por GPS. Sem internet, os registros ficam guardados e sincronizam sozinhos depois.",
    icone: (
      <Icone>
        <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
        <path d="M11 18h2" />
      </Icone>
    ),
  },
  {
    titulo: "Escalas e turnos",
    texto: "Monte escalas como 12x36 e turnos noturnos que passam da meia-noite, sem dividir o dia de forma errada.",
    icone: (
      <Icone>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4M8 14h3M8 17h6" />
      </Icone>
    ),
  },
  {
    titulo: "Integração com a folha",
    texto: "Horas extras e adicional noturno calculados e enviados direto para o sistema de folha de pagamento.",
    icone: (
      <Icone>
        <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </Icone>
    ),
  },
  {
    titulo: "Relatórios",
    texto: "Espelho de ponto e relatórios mensais por funcionário, prontos para conferência.",
    icone: (
      <Icone>
        <path d="M4 20h16M7 16v-4M12 16V7M17 16v-6" />
      </Icone>
    ),
  },
];

export function Recursos() {
  return (
    <section id="recursos" aria-labelledby="titulo-recursos" className="scroll-mt-28 pt-16 md:pt-24">
      <div className="px-2 md:px-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">O que o TimeTrack faz</p>
        <h2 id="titulo-recursos" className="mt-3 max-w-xl font-display text-3xl font-medium tracking-tight text-fg md:text-4xl">
          Do registro da batida até a folha de pagamento.
        </h2>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recursos.map(({ titulo, texto, icone }, i) => (
          <li
            key={titulo}
            className="glass-soft rounded-2xl p-6 transition-[background-color,backdrop-filter,translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-glass-strong hover:shadow-[var(--glass-shadow)] hover:[backdrop-filter:blur(28px)_saturate(160%)] motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl bg-hover text-fg">{icone}</span>
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-6 font-display text-lg font-medium text-fg">{titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{texto}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
