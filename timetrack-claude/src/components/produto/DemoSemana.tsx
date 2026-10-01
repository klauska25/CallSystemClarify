"use client";

import { useState } from "react";
import { Etiqueta } from "@/components/Etiqueta";
import { JORNADA_MIN, SEMANA, equipe, formatarMin, hora, iniciais, type Dia, type Funcionario } from "@/lib/semana";

const ESCALA_MIN = Math.max(10 * 60, ...equipe.flatMap((f) => f.dias.map((d) => d.trabalhadoMin)));
const pct = (min: number) => `${(min / ESCALA_MIN) * 100}%`;

// Demonstração da página do produto: a semana de cada funcionário vista pelo RH.
export function DemoSemana() {
  const [emailAtivo, setEmailAtivo] = useState(equipe[0].usuario.email);
  const [diaAtivo, setDiaAtivo] = useState(0);
  const [aviso, setAviso] = useState("");

  const funcionario = equipe.find((f) => f.usuario.email === emailAtivo)!;
  const dia = funcionario.dias[diaAtivo];
  const primeiroNome = funcionario.usuario.nome.split(" ")[0];

  function escolher(email: string) {
    setEmailAtivo(email);
    setAviso("");
  }

  function enviarParaFolha() {
    const { pendencias } = funcionario.totais;
    setAviso(
      pendencias > 0
        ? `Resolva ${pendencias === 1 ? "1 pendência" : `${pendencias} pendências`} de ${primeiroNome} antes de enviar para a folha.`
        : `Horas da semana de ${primeiroNome} enviadas para a folha.`,
    );
  }

  return (
    <div className="glass grid overflow-hidden rounded-3xl lg:grid-cols-[320px_1fr]">
      {/* Equipe */}
      <div className="p-4 md:p-6 lg:pr-3">
        <div className="flex items-baseline justify-between px-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Equipe</p>
          <p className="font-mono text-xs text-muted">Semana {SEMANA.numero}</p>
        </div>
        <ul className="mt-3 space-y-1">
          {equipe.map((f) => (
            <li key={f.usuario.email}>
              <ItemEquipe funcionario={f} ativo={f.usuario.email === emailAtivo} aoEscolher={escolher} />
            </li>
          ))}
        </ul>
      </div>

      {/* Semana da pessoa escolhida */}
      <div className="p-4 md:p-6 lg:pl-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-medium text-fg">{funcionario.usuario.nome}</h3>
            <p className="mt-0.5 truncate text-sm text-muted">
              {funcionario.usuario.empresa} · {funcionario.setor} · {funcionario.escala}
            </p>
          </div>
          <button
            type="button"
            onClick={enviarParaFolha}
            className="neu-raised h-10 shrink-0 rounded-full bg-neu px-5 text-sm font-bold text-fg transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-line active:translate-y-0 active:neu-inset"
          >
            Enviar para a folha
          </button>
        </div>
        <p role="status" className="mt-2 min-h-5 text-sm font-semibold text-fg">
          {aviso}
        </p>

        <dl className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
          <Indicador rotulo="Trabalhadas" valor={formatarMin(funcionario.totais.trabalhadoMin)} chave="bg-chart-base" />
          <Indicador rotulo="Horas extras" valor={formatarMin(funcionario.totais.extrasMin)} chave="bg-chart-extra" />
          <Indicador rotulo="Adicional noturno" valor={formatarMin(funcionario.totais.noturnoMin)} />
          <Indicador
            rotulo="Pendências"
            valor={String(funcionario.totais.pendencias)}
            chave={funcionario.totais.pendencias > 0 ? "bg-tone-warn-fg" : undefined}
          />
        </dl>

        <Grafico funcionario={funcionario} diaAtivo={diaAtivo} aoEscolher={setDiaAtivo} />
        <Detalhe dia={dia} />
      </div>
    </div>
  );
}

function ItemEquipe({
  funcionario: f,
  ativo,
  aoEscolher,
}: {
  funcionario: Funcionario;
  ativo: boolean;
  aoEscolher: (email: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => aoEscolher(f.usuario.email)}
      aria-pressed={ativo}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-accent-line ${
        ativo ? "neu-raised bg-neu" : "hover:bg-hover"
      }`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent-line/40 bg-brand/15 font-display text-sm font-semibold text-brand-dark dark:text-brand">
        {iniciais(f.usuario.nome)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-fg">{f.usuario.nome}</span>
        <span className="block truncate text-xs text-muted">
          {f.setor} · {f.escala}
        </span>
      </span>
      <span className="font-mono text-xs tabular-nums text-muted">{formatarMin(f.totais.trabalhadoMin)}</span>
    </button>
  );
}

function Indicador({ rotulo, valor, chave }: { rotulo: string; valor: string; chave?: string }) {
  return (
    <div className="rounded-2xl bg-hover p-4">
      <dt className="flex items-center gap-2 text-xs text-muted">
        <span aria-hidden className={`size-2 shrink-0 rounded-[2px] ${chave ?? "bg-transparent"}`} />
        {rotulo}
      </dt>
      <dd className="mt-1.5 font-display text-2xl font-medium text-fg md:text-3xl">{valor}</dd>
    </div>
  );
}

// Colunas empilhadas: horas dentro da jornada (cinza) + extras (âmbar), com a linha de 8h.
function Grafico({
  funcionario,
  diaAtivo,
  aoEscolher,
}: {
  funcionario: Funcionario;
  diaAtivo: number;
  aoEscolher: (indice: number) => void;
}) {
  return (
    <div className="mt-6">
      <div className="relative h-48 md:h-56">
        {/* Linha da jornada */}
        <div aria-hidden className="absolute inset-x-0 border-t border-fg/15" style={{ bottom: pct(JORNADA_MIN) }}>
          <span className="absolute -top-5 right-0 font-mono text-[11px] text-muted">jornada 8h</span>
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 border-t border-fg/15" />

        <div role="group" aria-label={`Horas por dia de ${funcionario.usuario.nome}`} className="absolute inset-0 grid grid-cols-7">
          {funcionario.dias.map((d, i) => (
            <Coluna key={d.data} dia={d} ativo={i === diaAtivo} aoEscolher={() => aoEscolher(i)} />
          ))}
        </div>
      </div>

      <div aria-hidden className="mt-2 grid grid-cols-7">
        {funcionario.dias.map((d, i) => (
          <span
            key={d.data}
            className={`text-center font-mono text-xs ${i === diaAtivo ? "font-medium text-fg" : "text-muted"}`}
          >
            {d.curto}
          </span>
        ))}
      </div>
    </div>
  );
}

function descrever(d: Dia) {
  if (d.folga) return `${d.rotulo}: folga.`;
  const partes = [`${d.rotulo}: ${formatarMin(d.trabalhadoMin)} trabalhadas`];
  if (d.extrasMin) partes.push(`${formatarMin(d.extrasMin)} extras`);
  if (d.pendente) partes.push("saída não registrada");
  return partes.join(", ") + ".";
}

function Coluna({ dia, ativo, aoEscolher }: { dia: Dia; ativo: boolean; aoEscolher: () => void }) {
  const base = Math.min(dia.trabalhadoMin, JORNADA_MIN);
  return (
    <button
      type="button"
      onClick={aoEscolher}
      onPointerEnter={(e) => e.pointerType === "mouse" && aoEscolher()}
      onFocus={aoEscolher}
      aria-pressed={ativo}
      aria-label={descrever(dia)}
      className={`relative mx-0.5 flex flex-col items-center justify-end rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-accent-line md:mx-1.5 ${
        ativo ? "bg-hover" : ""
      }`}
    >
      {dia.folga ? (
        <span className="mb-2 font-mono text-[10px] text-muted">folga</span>
      ) : (
        <>
          {dia.pendente && <span aria-hidden className="mb-1.5 size-2 rounded-full bg-tone-warn-fg" />}
          {dia.extrasMin > 0 && (
            // Mínimo de 4px para poucos minutos extras não sumirem.
            <span
              className="w-6 rounded-t-[4px] bg-chart-extra"
              style={{ height: `max(4px, calc(${pct(dia.extrasMin)} - 2px))`, marginBottom: 2 }}
            />
          )}
          <span
            className={`w-6 bg-chart-base ${dia.extrasMin > 0 ? "" : "rounded-t-[4px]"}`}
            style={{ height: pct(base) }}
          />
        </>
      )}
    </button>
  );
}

function Detalhe({ dia }: { dia: Dia }) {
  const abaixo = !dia.folga && !dia.pendente ? JORNADA_MIN - dia.trabalhadoMin : 0;
  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-hover px-4 py-3.5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold text-fg">{dia.rotulo}</p>
        <p className="mt-0.5 font-mono text-xs text-muted">
          {dia.folga
            ? "Folga. Nenhuma batida."
            : dia.periodos.map((p) => `${hora(p.inicio)} → ${p.fim ? hora(p.fim) : "sem saída"}`).join(" · ")}
        </p>
      </div>
      {!dia.folga && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
          <Valor chave="bg-chart-base" rotulo="Trabalhadas" valor={formatarMin(dia.trabalhadoMin)} />
          <Valor chave="bg-chart-extra" rotulo="Extras" valor={formatarMin(dia.extrasMin)} />
          <Valor rotulo="Noturno" valor={formatarMin(dia.noturnoMin)} />
          {dia.pendente && <Etiqueta rotulo="Saída não registrada" tom="warn" />}
          {abaixo > 0 && <Etiqueta rotulo={`${formatarMin(abaixo)} abaixo da jornada`} tom="neutral" />}
        </div>
      )}
    </div>
  );
}

function Valor({ rotulo, valor, chave }: { rotulo: string; valor: string; chave?: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {chave && <span aria-hidden className={`size-2 rounded-[2px] ${chave}`} />}
      {rotulo}
      <span className="font-mono font-medium tabular-nums text-fg">{valor}</span>
    </span>
  );
}
