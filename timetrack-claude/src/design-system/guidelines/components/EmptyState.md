# EmptyState

Tela de uma conversa vazia: a pergunta "Como posso ajudar?" e cartões de sugestão que enviam a mensagem com um clique.

**Origem:** `src/components/chat/EmptyState.tsx`.

## O que você fornece
- `onPickSuggestion(text)`: normalmente a mesma função de envio do MessageInput.

## Regras
- Título em `heading-empty` (Outfit 24px, 500), centralizado. É o único texto centralizado do app.
- Grade de cartões a `space-6` do título, uma coluna no celular e duas a partir de 640px, intervalo `space-3`, largura máxima 680px.
- Cartão: `glass-soft`, `radius-2xl`, padding `space-3.5` × `space-4`, estilo `suggestion`. No hover sobe 2px.
- As sugestões são frases reais de quem usa o TimeTrack, em primeira pessoa, incluindo uma fora do escopo para mostrar que o atendente recusa. Nada de "Experimente perguntar..." ou exemplos genéricos.
- Enquanto a conversa está vazia, o relevo do fundo ondula devagar (ver Background).
