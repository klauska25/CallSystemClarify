// Faixa de clientes (fictícios) que passa sozinha. Só os nomes, como logotipos de texto,
// direto sobre o fundo. Para no hover; com movimento reduzido fica parada.

const clientes = [
  { nome: "Agência Azul", estilo: "font-serif text-2xl" },
  { nome: "StartupIO", estilo: "font-mono text-lg font-medium" },
  { nome: "ACME", estilo: "font-display text-lg font-bold uppercase tracking-[0.3em]" },
  { nome: "TechCorp", estilo: "font-sans text-2xl font-extrabold tracking-tight" },
  { nome: "Logística Sul", estilo: "font-serif text-2xl italic" },
  { nome: "clínica vida", estilo: "font-display text-2xl font-medium lowercase" },
  { nome: "Manufatura·Ltd", estilo: "font-mono text-sm uppercase tracking-[0.2em]" },
  { nome: "Bom Preço", estilo: "font-sans text-2xl font-extrabold" },
];

function Lista({ duplicada = false }: { duplicada?: boolean }) {
  return (
    <ul
      aria-hidden={duplicada || undefined}
      className={`flex shrink-0 items-center gap-x-14 pr-14 md:gap-x-20 md:pr-20 ${
        duplicada ? "motion-reduce:hidden" : "motion-reduce:flex-wrap motion-reduce:gap-y-6"
      }`}
    >
      {clientes.map(({ nome, estilo }) => (
        <li key={nome} className={`whitespace-nowrap text-muted transition-colors hover:text-fg ${estilo}`}>
          {nome}
        </li>
      ))}
    </ul>
  );
}

export function Clientes() {
  return (
    <section aria-labelledby="titulo-clientes" className="pt-4 md:pt-8">
      <h2 id="titulo-clientes" className="px-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:px-5">
        Equipes que já fecham o ponto com o TimeTrack
      </h2>
      <div className="group mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none motion-reduce:px-5">
          <Lista />
          <Lista duplicada />
        </div>
      </div>
    </section>
  );
}
