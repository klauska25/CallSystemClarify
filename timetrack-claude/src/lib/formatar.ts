// Datas dos dados fictícios mostradas sempre no horário de Brasília,
// para o servidor e o navegador gerarem o mesmo texto.
const dataHora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatarDataHora(iso: string) {
  return dataHora.format(new Date(iso)).replace(",", " às");
}

export function formatarDuracao(ms: number) {
  const minutos = Math.max(0, Math.floor(ms / 60000));
  const horas = Math.floor(minutos / 60);
  return `${horas}h ${String(minutos % 60).padStart(2, "0")}min`;
}
