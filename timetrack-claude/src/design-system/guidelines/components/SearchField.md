# SearchField

Campo de busca em pílula afundada que filtra a lista de conversas.

**Origem:** `src/components/chat/SearchField.tsx`, filtro em `src/lib/search-conversations.ts`.

## O que você fornece
- `value` e `onChange(value)`: campo controlado.

## Comportamento
- Esc limpa a busca. O botão de limpar (ícone `close` de 14px) só aparece com texto.
- O "x" nativo do navegador é escondido para não duplicar o botão.
- Sem resultados, a lista mostra "Nenhum atendimento encontrado." em `body-sm` `muted`.

## Regras
- `neu` + `neu-inset`, `radius-full`, padding vertical `space-2.5` e 40px nas laterais para os ícones.
- Ícone `search` de 16px em `muted` a `space-4` da borda esquerda.
- Foco: borda `accent-line` a 60%.
