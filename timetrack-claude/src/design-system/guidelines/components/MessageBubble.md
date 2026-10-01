# MessageBubble

Balão de uma mensagem com a legenda de autor e hora logo abaixo.

**Origem:** `src/components/chat/MessageBubble.tsx`.

## Variantes
- **Quem pergunta** (`role: "user"`): alinhado à direita, fundo `brand`, texto `ink`, sombra `glow-brand`. É o único lugar grande onde o verde aparece.
- **Atendente** (`role: "assistant"`): alinhado à esquerda, `glass-soft` com texto `fg`.

## O que você fornece
- `message` (`id`, `role`, `text`, `sentAt`), `contactName` (nome de quem pergunta) e `showTime`.
- O autor do lado do atendente é sempre "Atendente".

## Regras
- Estilo `message` (15px, altura 1.625), `radius-bubble` (22px), padding `space-3` × `space-4`.
- Largura máxima 85% no celular e 70% a partir de 768px.
- Texto com `white-space: pre-wrap`: as quebras de linha digitadas são mantidas.
- Legenda em `message-meta` (mono 11px, `muted`), separando autor e hora com " · ".
- `showTime` fica falso na renderização do servidor para não mostrar a hora no fuso errado.
