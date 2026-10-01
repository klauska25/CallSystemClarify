# CategoryBadge

Etiqueta em pílula que mostra a categoria de um atendimento, dada pelo classificador.

**Origem:** `src/components/chat/CategoryBadge.tsx`, cores em `src/lib/categories.ts`.

## Quando usar
- No topo do chat, ao lado do título, e no item da lista de conversas, abaixo da prévia.
- Uma etiqueta por atendimento. Conversa sem categoria não mostra etiqueta (nada de "Sem categoria").

## O que você fornece
- `category`: uma de `acesso`, `dados`, `integracao`, `duvida`, `bug`, `feature`. O rótulo vem do mapa, não do chamador.

## Regras
- Fundo `category-<chave>-bg` com texto `category-<chave>-fg`; os dois mudam com o tema.
- Estilo `badge` (12px, 500), `radius-full`, padding 2px × `space-3`.
- As seis cores são do Tailwind (100/800 no claro, 950 a 80% e 300 no escuro). Elas só existem para etiquetas: não use como cor de estado nem de destaque.
- A cor nunca é a única informação: o rótulo em texto sempre aparece.
