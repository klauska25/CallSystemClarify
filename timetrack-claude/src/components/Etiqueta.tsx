import type { Categoria } from "@/lib/dados";
import { categorias, type Tom } from "@/lib/rotulos";

const tons: Record<Tom, string> = {
  ok: "bg-tone-ok-bg text-tone-ok-fg",
  info: "bg-tone-info-bg text-tone-info-fg",
  warn: "bg-tone-warn-bg text-tone-warn-fg",
  danger: "bg-tone-danger-bg text-tone-danger-fg",
  neutral: "bg-tone-neutral-bg text-tone-neutral-fg",
};

const cores: Record<Categoria, string> = {
  acesso: "bg-category-acesso-bg text-category-acesso-fg",
  dados: "bg-category-dados-bg text-category-dados-fg",
  integracao: "bg-category-integracao-bg text-category-integracao-fg",
  duvida: "bg-category-duvida-bg text-category-duvida-fg",
  bug: "bg-category-bug-bg text-category-bug-fg",
  feature: "bg-category-feature-bg text-category-feature-fg",
};

const base = "inline-flex shrink-0 items-center rounded-full px-3 py-0.5 text-xs font-medium";

// Etiqueta de status ou prioridade. A cor nunca é a única informação: o rótulo sempre aparece.
export function Etiqueta({ rotulo, tom }: { rotulo: string; tom: Tom }) {
  return <span className={`${base} ${tons[tom]}`}>{rotulo}</span>;
}

// CategoryBadge do design system.
export function EtiquetaCategoria({ categoria }: { categoria: Categoria }) {
  return <span className={`${base} ${cores[categoria]}`}>{categorias[categoria]}</span>;
}
