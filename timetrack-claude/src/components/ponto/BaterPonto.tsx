"use client";

import { useState, useSyncExternalStore } from "react";
import { Etiqueta } from "@/components/Etiqueta";
import type { RegistroPonto, TipoRegistro, Usuario } from "@/lib/dados";
import { formatarDuracao } from "@/lib/formatar";
import { tiposRegistro } from "@/lib/rotulos";

type Batida = Omit<RegistroPonto, "usuarioEmail">;

const CHAVE = "timetrack-ponto";
const EVENTO = "timetrack-ponto-mudou";

// Relógio: avisa a cada segundo e devolve o segundo atual (número estável dentro do segundo).
function assinarRelogio(aviso: () => void) {
  const id = setInterval(aviso, 1000);
  return () => clearInterval(id);
}
const segundoAtual = () => Math.floor(Date.now() / 1000);

// Registros salvos no navegador. Devolve o texto bruto para a comparação ser estável.
function assinarRegistros(aviso: () => void) {
  window.addEventListener("storage", aviso);
  window.addEventListener(EVENTO, aviso);
  return () => {
    window.removeEventListener("storage", aviso);
    window.removeEventListener(EVENTO, aviso);
  };
}
function lerRegistros() {
  try {
    return localStorage.getItem(CHAVE) ?? "[]";
  } catch {
    return "[]";
  }
}
function salvarRegistros(lista: Batida[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {}
  window.dispatchEvent(new Event(EVENTO));
}
function interpretar(texto: string | null): Batida[] {
  if (!texto) return [];
  try {
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// Dia no fuso do navegador, no formato AAAA-MM-DD.
const diaLocal = (data: Date) => data.toLocaleDateString("sv-SE");

const hora = (data: Date, segundos = false) =>
  data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    ...(segundos && { second: "2-digit" }),
  });

// Soma os intervalos entrada → saída. Se o último ficou aberto, conta até agora.
function horasTrabalhadas(batidas: Batida[], agora: number) {
  let total = 0;
  for (let i = 0; i < batidas.length; i += 2) {
    const inicio = Date.parse(batidas[i].dataHora);
    const fim = batidas[i + 1] ? Date.parse(batidas[i + 1].dataHora) : agora;
    total += fim - inicio;
  }
  return total;
}

export function BaterPonto({ funcionario }: { funcionario: Usuario }) {
  const segundo = useSyncExternalStore(assinarRelogio, segundoAtual, () => null);
  const bruto = useSyncExternalStore(assinarRegistros, lerRegistros, () => null);
  const [aviso, setAviso] = useState("");

  const carregado = segundo !== null && bruto !== null;
  const agora = segundo === null ? null : new Date(segundo * 1000);
  const hoje = agora ? diaLocal(agora) : null;

  const todos = interpretar(bruto);
  const deHoje = todos
    .filter((b) => diaLocal(new Date(b.dataHora)) === hoje)
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora));

  const proximo: TipoRegistro = deHoje.length % 2 === 0 ? "entrada" : "saida";
  const trabalhando = proximo === "saida";

  function bater() {
    const momento = new Date();
    const tipo = proximo;
    salvarRegistros([...todos, { id: crypto.randomUUID(), tipo, dataHora: momento.toISOString() }]);
    setAviso(`${tiposRegistro[tipo].rotulo} registrada às ${hora(momento)}.`);
  }

  function apagarHoje() {
    salvarRegistros(todos.filter((b) => diaLocal(new Date(b.dataHora)) !== hoje));
    setAviso("Registros de hoje apagados.");
  }

  const primeiroNome = funcionario.nome.split(" ")[0];

  return (
    <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
      <section aria-labelledby="titulo-ponto" className="glass flex flex-col rounded-3xl p-6 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {funcionario.empresa}
        </p>
        <h1 id="titulo-ponto" className="mt-3 font-display text-3xl font-medium text-fg md:text-4xl">
          Olá, {primeiroNome}.
        </h1>
        <p className="mt-1 min-h-6 text-muted first-letter:uppercase">
          {agora?.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>

        <p className="mt-10 font-display text-6xl font-medium tabular-nums tracking-tight text-fg sm:text-7xl md:text-8xl">
          {agora ? hora(agora, true) : "--:--:--"}
        </p>

        <button
          type="button"
          onClick={bater}
          disabled={!carregado}
          className="glow-brand mt-10 h-20 w-full rounded-full bg-brand text-xl font-bold text-ink transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-brand/35 disabled:text-ink/55 disabled:shadow-none md:h-24 md:text-2xl"
        >
          Bater ponto
        </button>
        <p className="mt-4 min-h-5 text-sm text-muted">
          {carregado &&
            (trabalhando
              ? "Você está trabalhando. A próxima batida registra a saída."
              : "A próxima batida registra a entrada.")}
        </p>
        <p role="status" className="mt-1 min-h-5 text-sm font-semibold text-fg">
          {aviso}
        </p>
      </section>

      <section aria-labelledby="titulo-registros" className="glass flex flex-col rounded-3xl p-6 md:p-8">
        <h2 id="titulo-registros" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Registros de hoje
        </h2>

        <div className="neu-raised mt-4 rounded-2xl bg-neu p-5">
          <p className="text-sm text-muted">Horas trabalhadas hoje</p>
          <p className="mt-1 font-display text-3xl font-medium tabular-nums text-fg">
            {carregado && agora ? formatarDuracao(horasTrabalhadas(deHoje, agora.getTime())) : "0h 00min"}
          </p>
        </div>

        {carregado && deHoje.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Nenhum registro hoje. Bata o ponto para começar o dia.</p>
        ) : (
          <ol className="mt-4 space-y-1">
            {deHoje.map((batida) => (
              <li
                key={batida.id}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 hover:bg-hover"
              >
                <Etiqueta {...tiposRegistro[batida.tipo]} />
                <span className="font-mono text-base tabular-nums text-fg">{hora(new Date(batida.dataHora))}</span>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-8">
          <p className="font-mono text-xs text-muted">Os registros ficam salvos neste navegador.</p>
          {deHoje.length > 0 && (
            <button
              type="button"
              onClick={apagarHoje}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted transition hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-line"
            >
              Apagar registros de hoje
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
