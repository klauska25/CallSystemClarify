import { chamados, statusSistema, usuarios } from "@/lib/dados";

const totais = [
  { rotulo: "Usuários", valor: usuarios.length },
  { rotulo: "Chamados", valor: chamados.length },
  { rotulo: "Componentes do sistema", valor: statusSistema.componentes.length },
];

export default function Home() {
  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden p-3">
      {/* Brilhos do fundo, como no componente Background do design system. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 size-[560px] rounded-full bg-glow blur-[130px]" />
        <div className="absolute -bottom-48 -right-48 size-[620px] rounded-full bg-glow blur-[150px]" />
      </div>

      <section className="glass w-full max-w-3xl rounded-3xl p-8">
        <h1 className="font-display text-4xl font-bold text-fg">TimeTrack</h1>
        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          {totais.map(({ rotulo, valor }) => (
            <div key={rotulo} className="neu-raised rounded-2xl bg-neu p-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {rotulo}
              </dt>
              <dd className="mt-2 font-display text-4xl font-medium text-fg">{valor}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
