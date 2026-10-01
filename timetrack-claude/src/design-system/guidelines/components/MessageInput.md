# MessageInput

Painel de vidro no pé do chat com o campo de texto e o botão Enviar.

**Origem:** `src/components/chat/MessageInput.tsx`.

## O que você fornece
- `onSend(text)`: recebe o texto já sem espaços nas pontas. O campo se limpa sozinho depois do envio.

## Comportamento
- Enter envia; Shift+Enter quebra a linha; nada é enviado durante composição de acento (`isComposing`).
- O textarea cresce com o texto até 160px e depois rola.
- Enviar fica desabilitado enquanto o campo está vazio: fundo `brand` a 35%, texto `ink` a 55%, sem brilho.

## Regras
- Painel `glass`, `radius-3xl`, padding `space-2.5` no celular e `space-3` no desktop, largura máxima `size-column`.
- Campo: `neu` + `neu-inset`, `radius-2xl`, estilo `input` (16px, evita zoom no iOS), altura mínima `size-control`. No foco ganha borda `accent-line` a 60%.
- Enviar: pílula `brand` com texto `ink`, `glow-brand`, `body-sm-bold`, altura `size-control`, hover `brand-hover`. É a única ação primária da tela.
- A dica "Enter envia. Shift+Enter quebra a linha." só aparece a partir de 768px.
- O rótulo "Mensagem" existe só para leitores de tela.
