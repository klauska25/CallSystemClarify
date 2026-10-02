import { usuarios, statusSistema } from "@/lib/dados";
export type Usuario = { nome: string; email: string; plano: string; statusConta: string; motivoBloqueio?: string };
export function buscarUsuario(email: string): Usuario | null {
  const u = usuarios.find((x) => x.email.toLowerCase() === email.toLowerCase());
  return u ? { nome: u.nome, email: u.email, plano: u.plano, statusConta: u.statusConta, motivoBloqueio: (u as { motivoBloqueio?: string }).motivoBloqueio } : null;
}
export function lerStatusSistema(): { geral: string; componentes: { nome: string; status: string }[] } {
  return statusSistema;
}
