Interface de atendimento do TimeTrack, um sistema de controle de ponto. Uma tela só: lista de conversas à esquerda, chat à direita, sobre um fundo de relevo topográfico. Painéis de vidro fosco, controles em relevo suave e um único verde-limão para o que é da pessoa e para a ação principal.

## Conteúdo e voz

- **Todo texto de tela em português do Brasil.** Código (nomes, arquivos, tipos) em inglês; comentários em português.
- **Nunca use emojis nem travessões** (— ou –) na interface. Para separar autor e hora, use " · " (`Atendente · 21:38`). Para encadear frases, use ponto final.
- **Frases curtas, no tom de um atendente educado.** Rótulos de ação são verbos ou nomes diretos: "Enviar", "Nova conversa", "Limpar busca", "Configurações da conta". Avisos dizem o que aconteceu: "Nenhum atendimento encontrado.", "Conversa sem mensagens".
- **Instruções de teclado em frases completas:** "Enter envia. Shift+Enter quebra a linha."
- **Exemplos são reais.** Sugestões e dados de amostra vêm do domínio de ponto eletrônico, em primeira pessoa: "Preciso de um relatório de horas do mês passado", "O relatório de março mostra 12 horas a menos para a equipe de vendas." Nada de lorem ipsum nem de texto de marketing ("Seu assistente inteligente!").
- **Tempo relativo em português:** "agora", "há 4 min", "há 1 hora", "há 3 horas", "ontem", "anteontem", "há 5 dias". Hora em `HH:MM` no fuso de quem usa, só calculada no navegador.
- **A marca é texto:** "TimeTrack" seguido de "SUPORTE" em maiúsculas espaçadas. Quem responde se chama sempre "Atendente"; quem pergunta aparece pelo nome; conversa sem nome é de "Visitante".
- Rótulos de seção em maiúsculas monoespaçadas: "CONVERSAS".

## Fundamentos visuais

### Cor
- **Uma cor de marca.** `brand` (#a3e635) é igual nos dois temas e aparece em poucos lugares: o balão de quem pergunta, o botão Enviar e o círculo do botão Nova conversa. Texto sobre `brand` é sempre `ink`. Hover usa `brand-hover`.
- **O resto é neutro e muda com o tema:** `surface` de fundo, `fg` para texto, `muted` para o secundário, `hover` para o fundo de hover, `line` para a barra de rolagem.
- **`accent-line` é o verde funcional**: contorno de foco e borda de campo focado. No claro é mais escuro (#65a30d) porque o limão some sobre o branco.
- **Categorias têm cores próprias** (`category-<chave>-bg` e `-fg`), usadas só em CategoryBadge, sempre com o rótulo em texto.
- Não há cores de erro, sucesso ou aviso definidas ainda. Se precisar, crie tokens novos; não reaproveite as cores de categoria.
- Proibido: gradientes, roxo como acento, cores saturadas fora de `brand` e das etiquetas.

### Temas
- Dois temas, **Claro** e **Escuro**, controlados por `data-theme` no `<html>`. O padrão segue `prefers-color-scheme`; a escolha do botão é salva em `localStorage` (`timetrack-theme`).
- Escreva os componentes só com tokens. Nunca pinte uma cor literal que só funcione num tema.

### Tipografia
- **Outfit** (`display`) para títulos e a marca: `wordmark`, `heading-empty`, `heading-chat`, `initials`. Peso 500 nos títulos; 700 só na marca.
- **Manrope** (`sans`) para todo texto corrido e controles: `message` (15px) nos balões, `input` (16px) no campo, `body-sm` e `body-sm-bold` (14px) em listas e botões, `badge` e `caption` (12px).
- **IBM Plex Mono** (`mono`) para horários, metadados e rótulos de seção: `timestamp`, `message-meta`, `section-label`.
- Maiúsculas só em rótulos de 11px, com espaçamento de 0.2em (`eyebrow`, `section-label`).
- As três famílias vêm do Google Fonts (no app, via `next/font`).
- Textos de uma linha (nomes, títulos, prévias) truncam com reticências; balões quebram linha e respeitam quebras digitadas.

### Superfícies: vidro e relevo
O app tem duas materialidades, cada uma com um papel:
- **Vidro (`glass`, `glass-soft`)** para painéis que flutuam sobre o fundo: barra lateral, topo, campo de mensagem (`glass`); balões do atendente, sugestões e indicador de digitação (`glass-soft`). Fundo `glass`, borda `glass-border`, fio de luz `glass-highlight`, sombra `glass-shadow`, desfoque `blur-glass` (28px, saturação 160%) ou `blur-glass-soft` (16px, 150%). No celular a gaveta usa `glass-strong`, mais opaco.
- **Relevo (`neu`)** para controles dentro dos painéis. `neu-raised` quando o elemento salta (botões Nova conversa e tema, item ativo da lista, rodapé da conta); `neu-inset` quando afunda (campos de texto e o estado pressionado dos botões).
- `glow-brand` acompanha `brand` e nada mais.
- Não empilhe vidro sobre vidro, não invente sombras novas e não use relevo como painel.

### Fundo
- `surface` + dois brilhos `glow` nos cantos + linhas de relevo `pattern-line` (ver Background e `assets/Topography`). O fundo existe para o vidro ter o que desfocar; não coloque conteúdo nele.

### Forma
- `radius-full` para tudo que é clicável e pequeno: botões, busca, etiquetas, avatar.
- `radius-3xl` (24px) para painéis grandes no desktop e para o campo de mensagem; `radius-2xl` (16px) para itens, cartões, campos e painéis no celular; `radius-bubble` (22px) para balões.
- Bordas de 1px só no vidro (`glass-border`) e no foco. Sem divisórias entre itens: o espaço separa.

### Espaço e layout
- Escala do Tailwind (4px): `space-1` a `space-10`. Painéis distam `space-3` entre si e da borda da janela no desktop; no celular, `space-2`.
- Desktop (768px+): barra lateral de 300px (`size-sidebar`) + chat. Coluna de mensagens e campo com no máximo 768px (`size-column`), centralizados.
- Celular: o chat ocupa a tela; a lista vira gaveta da esquerda, aberta pelo botão de menu no topo.
- Alvos de toque de no mínimo 36px (`size-icon-button`); controles principais com 44px (`size-control`).
- Alinhamento à esquerda. Só o título do estado vazio é centralizado.

### Estados e movimento
- **Hover:** fundo `hover` em itens e botões de ícone, cor passa de `muted` para `fg`; botões em relevo sobem 1px, sugestões sobem 2px; Enviar passa para `brand-hover`.
- **Pressionado:** botões em relevo trocam `neu-raised` por `neu-inset`.
- **Foco:** contorno sólido de 2px em `accent-line` (com 2px de afastamento nos botões grandes); campos ganham borda `accent-line` a 60%. No tema claro esse verde fica em 2.6:1 sobre `surface`, abaixo dos 3:1 recomendados; está registrado como está no código.
- **Desabilitado:** Enviar a 35% de `brand` com texto a 55%, sem brilho, cursor `not-allowed`.
- **Movimento:** transições de 150 a 300ms; gaveta em 300ms `ease-out`; relevo entra com `fade-in` de 450ms. Toda animação decorativa respeita `prefers-reduced-motion`.

### Acessibilidade
- Botões só de ícone têm `aria-label` (e `title` quando há espaço para dica). Ícones são `aria-hidden`.
- A lista de mensagens é `role="log"`; o indicador de digitação é `role="status"`.
- Contrastes medidos: `fg` passa de 15:1 nos dois temas; `ink` sobre `brand` 13:1; `muted` passa 4.5:1 sobre vidro e relevo, e fica em 4.48:1 direto sobre `surface` clara. Prefira `muted` dentro de painéis.

## Iconografia
- Oito ícones de traço desenhados à mão, em grade de 24px, linha de 2px com pontas arredondadas (`plus` usa 2.5px, `settings` 1.8px): `menu`, `close`, `plus`, `arrow-right`, `sun`, `moon`, `search`, `settings` (em `assets/Icons`).
- Sem biblioteca de ícones e sem emojis. Precisa de um novo? Desenhe no mesmo traço e grade.
- No código os ícones herdam a cor do texto (`currentColor`): `muted` em repouso, `fg` no hover, `ink` sobre `brand`.
- Tamanhos: 20px (padrão), 18px no botão de tema, 16px na busca e no Enviar, 14px dentro do círculo de mais e no botão de limpar.
- Não há logotipo. A marca é o nome em Outfit; não desenhe um símbolo.

## Não sincronizado

- **Origem:** `klauska25/ChatbotClarify`, Next.js 15 + Tailwind 4. Tokens de `src/app/globals.css`; cores das etiquetas, cinza do indicador, escala de espaço, raios e tipos dos valores do Tailwind 4.3.3 que as classes usam.
- **Componentes em prévia estática.** O app não tem biblioteca de componentes exportável (são componentes Next.js com Tailwind), então não há `bundle.js`. As prévias são versões HTML dos componentes, desenhadas com `components/bundle.css`, que traduz as classes Tailwind para CSS com os tokens deste sistema.
- **Fora do sistema:** `ChatApp` e `MessageList` (composições da tela inteira) e o desenho ao vivo em WebGL de `LiveTopography` (aparece só como máscara estática em Background).
- **Fontes** são do Google Fonts; nenhum arquivo de fonte foi copiado.
- **Ícones:** em `assets/Icons` o traço foi fixado em #6b6b66 (`muted` claro) para aparecerem como imagem; os traçados são idênticos aos do código.
