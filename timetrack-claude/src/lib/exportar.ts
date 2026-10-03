// Exporta as listas do painel para CSV no formato que o Excel em português abre direto:
// ponto e vírgula como separador e BOM no início para os acentos aparecerem certos.
import { calcularSla, formatarPrazo, PRAZO_HORAS } from "./atencao";
import type { Chamado, Usuario } from "./dados";
import { formatarDataHora } from "./formatar";
import { categorias, planos, prioridades, statusChamado, statusConta } from "./rotulos";

// Aspas em todo campo. Texto que começa com = + - @ viraria fórmula no Excel, então ganha um apóstrofo.
function celula(valor: string) {
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;
  return `"${seguro.replace(/"/g, '""')}"`;
}

function gerarCsv(cabecalho: string[], linhas: string[][]) {
  return "﻿" + [cabecalho, ...linhas].map((l) => l.map(celula).join(";")).join("\r\n");
}

// "30/09/2026 18:20", formato que o Excel reconhece como data.
const dataExcel = (iso: string) => formatarDataHora(iso).replace(" às", "");

export function csvChamados(chamados: Chamado[], usuarios: Usuario[], agora: number) {
  const empresa = new Map(usuarios.map((u) => [u.email.toLowerCase(), u.empresa]));
  return gerarCsv(
    ["Protocolo", "Email", "Empresa", "Categoria", "Prioridade", "Status", "Aberto em", "Prazo", "Situação do prazo", "Descrição"],
    chamados.map((c) => {
      const sla = calcularSla(c, agora);
      return [
        c.protocolo,
        c.usuarioEmail,
        empresa.get(c.usuarioEmail.toLowerCase()) ?? "",
        categorias[c.categoria],
        prioridades[c.prioridade].rotulo,
        statusChamado[c.status].rotulo,
        dataExcel(c.criadoEm),
        `${PRAZO_HORAS[c.prioridade]}h`,
        !sla ? "Encerrado" : sla.atrasado ? `Atrasado há ${formatarPrazo(sla.minutos)}` : `Faltam ${formatarPrazo(sla.minutos)}`,
        c.descricao,
      ];
    }),
  );
}

export function csvUsuarios(usuarios: Usuario[]) {
  return gerarCsv(
    ["Nome", "Email", "Empresa", "Plano", "Situação da conta", "Motivo", "Último login"],
    usuarios.map((u) => [
      u.nome,
      u.email,
      u.empresa,
      planos[u.plano],
      statusConta[u.statusConta].rotulo,
      u.motivoBloqueio ?? "",
      u.ultimoLogin ? dataExcel(u.ultimoLogin) : "Nunca entrou",
    ]),
  );
}

// Só no navegador: cria o arquivo e dispara o download.
export function baixarCsv(nome: string, conteudo: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
