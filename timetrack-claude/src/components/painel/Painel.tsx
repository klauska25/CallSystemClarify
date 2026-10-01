"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { Etiqueta, EtiquetaCategoria } from "@/components/Etiqueta";
import { CloseIcon, SearchIcon } from "@/design-system/react/icons";
import type { Chamado, StatusSistema, Usuario } from "@/lib/dados";
import { formatarDataHora } from "@/lib/formatar";
import { planos, prioridades, statusChamado, statusConta, statusOperacional } from "@/lib/rotulos";

type Aba = "usuarios" | "chamados" | "status";

const abas: { id: Aba; rotulo: string }[] = [
  { id: "usuarios", rotulo: "Usuários" },
  { id: "chamados", rotulo: "Chamados" },
  { id: "status", rotulo: "Status" },
];

type Props = { usuarios: Usuario[]; chamados: Chamado[]; status: StatusSistema };

export function Painel({ usuarios, chamados, status }: Props) {
  const [aba, setAba] = useState<Aba>("usuarios");
  const [busca, setBusca] = useState("");
  const prefixo = useId();

  const termo = busca.trim().toLowerCase();
  const usuariosFiltrados = usuarios.filter((u) => u.email.toLowerCase().includes(termo));
  const chamadosFiltrados = chamados
    .filter((c) => c.usuarioEmail.toLowerCase().includes(termo))
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));

  const totais: Record<Aba, number> = {
    usuarios: usuarios.length,
    chamados: chamados.length,
    status: status.componentes.length,
  };

  // Setas trocam de aba, como pede o padrão de abas acessíveis.
  function navegarComTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    const passo = evento.key === "ArrowRight" ? 1 : evento.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    const atual = abas.findIndex((a) => a.id === aba);
    const proxima = abas[(atual + passo + abas.length) % abas.length].id;
    setAba(proxima);
    document.getElementById(`${prefixo}-aba-${proxima}`)?.focus();
  }

  return (
    <section className="glass rounded-3xl p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Suporte</p>
          <h1 className="mt-2 font-display text-3xl font-medium text-fg">Painel interno</h1>
        </div>

        <div
          role="tablist"
          aria-label="Seções do painel"
          onKeyDown={navegarComTeclado}
          className="neu-inset flex rounded-full bg-neu p-1"
        >
          {abas.map(({ id, rotulo }) => {
            const ativa = aba === id;
            return (
              <button
                key={id}
                id={`${prefixo}-aba-${id}`}
                type="button"
                role="tab"
                aria-selected={ativa}
                aria-controls={`${prefixo}-painel`}
                tabIndex={ativa ? 0 : -1}
                onClick={() => setAba(id)}
                className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-accent-line md:flex-none ${
                  ativa ? "neu-raised bg-neu text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {rotulo}
                <span className="font-mono text-xs font-normal text-muted">{totais[id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {aba !== "status" && <CampoBusca valor={busca} aoMudar={setBusca} />}
      {aba !== "status" && termo && (
        <p className="mt-3 px-1 text-sm text-muted">
          {aba === "usuarios"
            ? `${usuariosFiltrados.length} de ${usuarios.length} usuários com "${busca.trim()}" no email.`
            : `${chamadosFiltrados.length} de ${chamados.length} chamados com "${busca.trim()}" no email.`}
        </p>
      )}

      <div
        id={`${prefixo}-painel`}
        role="tabpanel"
        aria-labelledby={`${prefixo}-aba-${aba}`}
        className="mt-5"
      >
        {aba === "usuarios" && <ListaUsuarios usuarios={usuariosFiltrados} />}
        {aba === "chamados" && <ListaChamados chamados={chamadosFiltrados} />}
        {aba === "status" && <PainelStatus status={status} />}
      </div>
    </section>
  );
}

function CampoBusca({ valor, aoMudar }: { valor: string; aoMudar: (v: string) => void }) {
  return (
    <div className="relative mt-5">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && aoMudar("")}
        placeholder="Buscar por email"
        aria-label="Buscar por email"
        autoComplete="off"
        spellCheck={false}
        className="neu-inset h-11 w-full rounded-full border border-transparent bg-neu pl-10 pr-10 text-base text-fg outline-none placeholder:text-muted focus:border-accent-line/60 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {valor && (
        <button
          type="button"
          onClick={() => aoMudar("")}
          aria-label="Limpar busca"
          title="Limpar busca"
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-hover hover:text-fg focus-visible:outline-2 focus-visible:outline-accent-line"
        >
          <CloseIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function Vazio({ texto }: { texto: string }) {
  return <p className="px-1 py-6 text-sm text-muted">{texto}</p>;
}

const cartao = "rounded-2xl bg-hover p-4 md:p-5";

function ListaUsuarios({ usuarios }: { usuarios: Usuario[] }) {
  if (usuarios.length === 0) return <Vazio texto="Nenhum usuário encontrado." />;

  return (
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {usuarios.map((u) => (
        <li key={u.id} className={cartao}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-fg">{u.nome}</p>
              <p className="truncate font-mono text-xs text-muted">{u.email}</p>
            </div>
            <Etiqueta {...statusConta[u.statusConta]} />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Campo rotulo="Empresa" className="col-span-2 sm:col-span-1">
              {u.empresa}
            </Campo>
            <Campo rotulo="Plano">{planos[u.plano]}</Campo>
            <Campo rotulo="Último login">
              {u.ultimoLogin ? formatarDataHora(u.ultimoLogin) : "Nunca entrou"}
            </Campo>
          </dl>

          {u.motivoBloqueio && <p className="mt-3 text-sm text-muted">{u.motivoBloqueio}.</p>}
        </li>
      ))}
    </ul>
  );
}

function Campo({ rotulo, children, className = "" }: { rotulo: string; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{rotulo}</dt>
      <dd className="mt-0.5 truncate text-fg">{children}</dd>
    </div>
  );
}

function ListaChamados({ chamados }: { chamados: Chamado[] }) {
  if (chamados.length === 0) return <Vazio texto="Nenhum chamado encontrado." />;

  return (
    <ul className="space-y-2">
      {chamados.map((c) => (
        <li key={c.protocolo} className={cartao}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-sm font-medium text-fg">{c.protocolo}</p>
              <p className="mt-0.5 flex flex-wrap gap-x-1.5 font-mono text-xs text-muted">
                <span className="min-w-0 truncate">{c.usuarioEmail}</span>
                <span aria-hidden className="hidden sm:inline">·</span>
                <span>{formatarDataHora(c.criadoEm)}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 md:justify-end">
              <EtiquetaCategoria categoria={c.categoria} />
              <Etiqueta rotulo={`Prioridade ${prioridades[c.prioridade].rotulo.toLowerCase()}`} tom={prioridades[c.prioridade].tom} />
              <Etiqueta {...statusChamado[c.status]} />
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-fg">{c.descricao}</p>
        </li>
      ))}
    </ul>
  );
}

function PainelStatus({ status }: { status: StatusSistema }) {
  const geral = statusOperacional[status.geral];
  const comProblema = status.componentes.filter((c) => c.status !== "operacional").length;

  return (
    <div className="space-y-3">
      <div className="neu-raised flex flex-col gap-3 rounded-2xl bg-neu p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">Status geral</p>
          <p className="mt-1 font-display text-2xl font-medium text-fg">
            {comProblema === 0
              ? "Todos os sistemas funcionando."
              : `${comProblema} de ${status.componentes.length} componentes com problema.`}
          </p>
          <p className="mt-1 font-mono text-xs text-muted">Atualizado em {formatarDataHora(status.atualizadoEm)}</p>
        </div>
        <Etiqueta {...geral} />
      </div>

      <ul className="space-y-2">
        {status.componentes.map((c) => (
          <li key={c.nome} className={`${cartao} flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between`}>
            <div className="min-w-0">
              <p className="text-sm font-bold text-fg">{c.nome}</p>
              {c.detalhe && <p className="mt-1 text-sm text-muted">{c.detalhe}</p>}
            </div>
            <Etiqueta {...statusOperacional[c.status]} />
          </li>
        ))}
      </ul>
    </div>
  );
}
