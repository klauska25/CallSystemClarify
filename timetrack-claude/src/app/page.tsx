import Link from "next/link";
import { CHATBOT_URL } from "@/lib/links";
import { ArrowRightIcon } from "@/design-system/react/icons";

const recursos = [
  {
    titulo: "Ponto em um toque",
    texto: "Entrada e saída registradas com a hora exata, pelo celular ou pelo computador.",
  },
  {
    titulo: "Horas sempre em dia",
    texto: "O RH vê quem chegou, quem saiu e quem esqueceu de bater a saída, sem esperar o fim do mês.",
  },
  {
    titulo: "Integração com a folha",
    texto: "As horas do mês vão direto para o sistema de folha de pagamento no fechamento.",
  },
  {
    titulo: "Relatórios por equipe",
    texto: "Compare horas previstas e trabalhadas por setor, por semana ou por mês.",
  },
];

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

      <section aria-labelledby="titulo-recursos" className="px-0 md:px-0">
        <h2 id="titulo-recursos" className="sr-only">
          O que o TimeTrack faz
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recursos.map(({ titulo, texto }) => (
            <li key={titulo} className="glass-soft rounded-2xl p-5">
              <h3 className="font-display text-lg font-medium text-fg">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{texto}</p>
            </li>
          ))}
        </ul>
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
