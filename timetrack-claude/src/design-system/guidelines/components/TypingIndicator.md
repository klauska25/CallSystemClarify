# TypingIndicator

Três pontos que pulam enquanto o atendente prepara a resposta.

**Origem:** `src/components/chat/TypingIndicator.tsx`.

## Quando usar
- No fim da lista de mensagens, do lado do atendente, entre o envio e a resposta.

## Regras
- Mesmo contêiner do balão do atendente: `glass-soft`, `radius-bubble`, padding `space-4`.
- Pontos de 6px em `typing-dot`, intervalo `space-1`, animação `bounce` do Tailwind com atraso de 0, 150 e 300ms.
- `role="status"` com o rótulo "Atendente digitando" para leitores de tela.
- Com `prefers-reduced-motion`, os pontos ficam parados.
