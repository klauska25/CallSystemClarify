import Link from "next/link";
import { Clientes } from "@/components/produto/Clientes";
import { DemoSemana } from "@/components/produto/DemoSemana";
import { Numeros } from "@/components/produto/Numeros";
import { Recursos } from "@/components/produto/Recursos";
import { CHATBOT_URL } from "@/lib/links";
import { ArrowRightIcon } from "@/design-system/react/icons";

type Plano = {
  nome: string;
  resumo: string;
  itens: string[];
  preco?: { valor: string; unidade: string };
  destaque?: string;
};

const planos: Plano[] = [
  {
    nome: "Free",
    resumo: "Para conhecer o TimeTrack com uma equipe pequena.",
    preco: { valor: "R$ 0", unidade: "para sempre" },
    itens: ["Até 5 funcionários", "Ponto pelo navegador", "Histórico de 30 dias"],
  },
  {
    nome: "Starter",
    resumo: "Para pequenas empresas que querem largar a planilha.",
    preco: { valor: "R$ 9,90", unidade: "por funcionário ao mês" },
    destaque: "Mais escolhido",
    itens: ["Até 50 funcionários", "App mobile", "Relatórios mensais", "Suporte por chat"],
  },
  {
    nome: "Business",
    resumo: "Para empresas com escalas, turnos e banco de horas.",
    itens: [
      "Funcionários ilimitados",
      "Integração com a folha",
      "Escalas e banco de horas",
      "Suporte prioritário",
    ],
  },
  {
    nome: "Enterprise",
    resumo: "Para grupos com várias empresas e filiais.",
    itens: [
      "Várias empresas e filiais",
      "Login único e controle de acesso",
      "API e integrações sob medida",
      "Gerente de conta dedicado",
    ],
  },
];

const botaoRelevo =
  "neu-raised inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neu px-6 text-sm font-bold text-fg transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line active:translate-y-0 active:neu-inset";

export default function ProdutoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-2 md:px-3">
      <section className="px-2 pb-12 pt-10 md:px-5 md:pb-16 md:pt-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Ponto eletrônico</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight text-fg md:text-6xl">
          O ponto da sua equipe, sem papel e sem planilha.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg/80 md:text-lg">
          O funcionário bate o ponto de entrada e saída em um toque. O RH acompanha as horas de cada
          pessoa durante o mês e fecha a folha sem retrabalho.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/ponto"
            className="glow-brand inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-ink transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line"
          >
            Experimentar o ponto
            <ArrowRightIcon />
          </Link>
          <a href="#planos" className={botaoRelevo}>
            Ver planos
          </a>
        </div>
      </section>

      <Clientes />
      <Numeros />
      <Recursos />

      <section id="demonstracao" aria-labelledby="titulo-demo" className="scroll-mt-28 pt-16 md:pt-24">
        <div className="flex flex-col gap-4 px-2 md:flex-row md:items-end md:justify-between md:px-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Demonstração</p>
            <h2 id="titulo-demo" className="mt-3 max-w-xl font-display text-3xl font-medium tracking-tight text-fg md:text-4xl">
              Veja a semana de cada funcionário em segundos.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Escolha alguém da equipe e passe o mouse nos dias. É assim que o RH vê o ponto no TimeTrack.
          </p>
        </div>
        <div className="mt-8">
          <DemoSemana />
        </div>
      </section>

      <section id="planos" aria-labelledby="titulo-planos" className="scroll-mt-28 pt-16 md:pt-24">
        <div className="px-2 md:px-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Planos</p>
          <h2 id="titulo-planos" className="mt-3 font-display text-3xl font-medium tracking-tight text-fg md:text-4xl">
            Escolha o tamanho da sua equipe.
          </h2>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {planos.map((plano) => (
            <li key={plano.nome} className="glass flex flex-col rounded-3xl p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-2xl font-medium text-fg">{plano.nome}</h3>
                {plano.destaque && (
                  <span className="rounded-full border border-accent-line/60 px-3 py-0.5 text-xs font-medium text-fg">
                    {plano.destaque}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{plano.resumo}</p>

              <div className="mt-6 min-h-16">
                {plano.preco ? (
                  <>
                    <p className="font-display text-4xl font-medium text-fg">{plano.preco.valor}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{plano.preco.unidade}</p>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-muted">Proposta sob medida para a sua empresa.</p>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-fg">
                {plano.itens.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-line" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plano.preco ? (
                  <Link href="/ponto" className={`${botaoRelevo} w-full`}>
                    {plano.nome === "Free" ? "Começar grátis" : "Assinar o Starter"}
                  </Link>
                ) : (
                  <a
                    href={`mailto:vendas@timetrack.example?subject=${encodeURIComponent(`Plano ${plano.nome}`)}`}
                    className={`${botaoRelevo} w-full`}
                  >
                    Fale com vendas
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass mt-16 flex flex-col items-start gap-4 rounded-3xl p-6 md:mt-24 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h2 className="font-display text-2xl font-medium text-fg">Ficou com alguma dúvida?</h2>
          <p className="mt-1 text-sm text-muted">O atendente do TimeTrack responde na hora, em uma nova aba.</p>
        </div>
        <a href={CHATBOT_URL} target="_blank" rel="noopener noreferrer" className={botaoRelevo}>
          Ajuda
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </section>
    </main>
  );
}
