# ThemeToggle

Botão redondo em relevo que alterna entre tema claro e escuro.

**Origem:** `src/components/chat/ThemeToggle.tsx`, `src/hooks/use-theme.ts`, `src/lib/theme.ts`.

## Comportamento
- No tema claro mostra a lua ("Ativar tema escuro"); no escuro, o sol ("Ativar tema claro"). O rótulo vai em `aria-label` e `title`.
- O tema vive no atributo `data-theme` do `<html>` e é salvo em `localStorage` (`timetrack-theme`). Sem escolha salva, segue `prefers-color-scheme`.
- Um script no `<head>` aplica o tema antes da pintura para não piscar. O ícone só aparece depois que o tema é conhecido.

## Regras
- `size-icon-button` (36px), `radius-full`, `neu` + `neu-raised`; pressionado vira `neu-inset`.
- Ícone de 18px em `muted`, `fg` no hover. Foco: contorno de 2px `accent-line`.
