// Números do TimeTrack. Fictícios, como o resto do sistema.
const numeros = [
  { valor: "1.200", sufixo: "+", texto: "empresas registram o ponto da equipe no TimeTrack" },
  { valor: "6", sufixo: "h", texto: "economizadas por mês, em média, no fechamento da folha" },
  { valor: "92", sufixo: "%", texto: "menos ajustes manuais de batida por mês" },
  { valor: "38", sufixo: "mil", texto: "funcionários batendo ponto pelo app todos os dias" },
];

export function Numeros() {
  return (
    <section aria-label="O TimeTrack em números" className="pt-12 md:pt-16">
      <dl className="glass grid grid-cols-2 gap-1 rounded-3xl p-2 lg:grid-cols-4">
        {numeros.map(({ valor, sufixo, texto }) => (
          <div key={texto} className="flex flex-col-reverse justify-end gap-2 rounded-2xl p-3 sm:p-5 md:gap-3 md:p-6">
            <dt className="max-w-60 text-xs leading-relaxed text-muted sm:text-sm">{texto}</dt>
            <dd className="font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl md:text-6xl">
              {valor}
              <span className="text-brand-dark dark:text-brand">{sufixo}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
