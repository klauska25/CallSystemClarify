// Modelos do Gemini usados pelo cérebro do chatbot e pelo copiloto do atendente. Roda só no servidor.

// Modelos tentados em ordem. O Google aposenta modelos e cada chave só enxerga alguns
// (o gemini-2.5-flash passou a responder 404), então, se um não existir para a chave
// (404), estiver sem cota (429) ou sobrecarregado no Google (500, 503, 504, comuns no
// plano grátis em horário de pico), tenta o próximo. GEMINI_MODEL, se definida na Vercel,
// entra na frente da lista: dá para trocar de modelo sem mexer no código.
const MODELOS_GEMINI = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
export const STATUS_TENTAR_OUTRO_MODELO = [404, 429, 500, 503, 504];

export function modelosGemini(): string[] {
  const escolhido = process.env.GEMINI_MODEL?.trim();
  return escolhido ? [escolhido, ...MODELOS_GEMINI.filter((m) => m !== escolhido)] : MODELOS_GEMINI;
}
