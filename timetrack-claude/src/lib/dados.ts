// Dados fictícios do TimeTrack, mantidos em memória.
// Datas em ISO 8601 no fuso de Brasília (-03:00). "Hoje" é 01/10/2026.

export type Plano = "free" | "starter" | "business" | "enterprise";
export type StatusConta = "ativa" | "bloqueada" | "pendente";

export type Usuario = {
  id: string;
  email: string;
  nome: string;
  empresa: string;
  plano: Plano;
  ultimoLogin: string | null; // null: nunca entrou
  statusConta: StatusConta;
  motivoBloqueio?: string;
};

export type Categoria = "acesso" | "dados" | "integracao" | "duvida" | "bug" | "feature";
export type Prioridade = "baixa" | "media" | "alta" | "critica";
export type StatusChamado = "aberto" | "em-andamento" | "resolvido" | "fechado";

export type Chamado = {
  protocolo: string; // TT-2026-NNNNNN
  usuarioEmail: string;
  categoria: Categoria;
  prioridade: Prioridade;
  descricao: string;
  status: StatusChamado;
  criadoEm: string;
};

export type StatusOperacional = "operacional" | "degradado" | "fora-do-ar";

export type ComponenteSistema = {
  nome: string;
  status: StatusOperacional;
  detalhe?: string;
};

export type StatusSistema = {
  geral: StatusOperacional;
  atualizadoEm: string;
  componentes: ComponenteSistema[];
};

export type TipoRegistro = "entrada" | "saida";

export type RegistroPonto = {
  id: string;
  usuarioEmail: string;
  tipo: TipoRegistro;
  dataHora: string;
};

export const usuarios: Usuario[] = [
  {
    id: "usr_001",
    email: "joao@empresa.com",
    nome: "João Pereira da Silva",
    empresa: "Empresa Modelo Ltda",
    plano: "business",
    ultimoLogin: "2026-10-01T08:57:12-03:00",
    statusConta: "bloqueada",
    motivoBloqueio: "5 tentativas de login com senha incorreta",
  },
  {
    id: "usr_002",
    email: "mariana.costa@construtorahorizonte.com.br",
    nome: "Mariana Costa",
    empresa: "Construtora Horizonte",
    plano: "enterprise",
    ultimoLogin: "2026-10-01T07:45:03-03:00",
    statusConta: "ativa",
  },
  {
    id: "usr_003",
    email: "rafael.oliveira@rotasul.com.br",
    nome: "Rafael Oliveira",
    empresa: "Transportadora Rota Sul",
    plano: "business",
    ultimoLogin: "2026-09-30T18:12:44-03:00",
    statusConta: "bloqueada",
    motivoBloqueio: "5 tentativas de login com senha incorreta",
  },
  {
    id: "usr_004",
    email: "ana.souza@clinicavidaplena.com.br",
    nome: "Ana Beatriz Souza",
    empresa: "Clínica Vida Plena",
    plano: "starter",
    ultimoLogin: null,
    statusConta: "pendente",
    motivoBloqueio: "Aguardando confirmação do email de cadastro",
  },
  {
    id: "usr_005",
    email: "carlos.mendes@paodourado.com.br",
    nome: "Carlos Eduardo Mendes",
    empresa: "Padaria Pão Dourado",
    plano: "free",
    ultimoLogin: "2026-09-28T06:02:31-03:00",
    statusConta: "ativa",
  },
  {
    id: "usr_006",
    email: "fernanda.lima@farmabemestar.com.br",
    nome: "Fernanda Lima",
    empresa: "Rede Farma Bem Estar",
    plano: "enterprise",
    ultimoLogin: "2026-10-01T09:20:58-03:00",
    statusConta: "ativa",
  },
  {
    id: "usr_007",
    email: "lucas.almeida@ferroforte.ind.br",
    nome: "Lucas Almeida",
    empresa: "Metalúrgica Ferro Forte",
    plano: "starter",
    ultimoLogin: "2026-09-15T14:33:09-03:00",
    statusConta: "bloqueada",
    motivoBloqueio: "Pagamento da assinatura em atraso",
  },
  {
    id: "usr_008",
    email: "patricia.rocha@pontocriativo.com.br",
    nome: "Patrícia Rocha",
    empresa: "Agência Ponto Criativo",
    plano: "business",
    ultimoLogin: "2026-09-30T17:48:26-03:00",
    statusConta: "ativa",
  },
];

export const chamados: Chamado[] = [
  {
    protocolo: "TT-2026-004817",
    usuarioEmail: "rafael.oliveira@rotasul.com.br",
    categoria: "acesso",
    prioridade: "alta",
    descricao:
      "Minha conta foi bloqueada depois de errar a senha. Preciso liberar o acesso para fechar o ponto da equipe hoje.",
    status: "aberto",
    criadoEm: "2026-09-30T18:20:15-03:00",
  },
  {
    protocolo: "TT-2026-004809",
    usuarioEmail: "joao@empresa.com",
    categoria: "dados",
    prioridade: "media",
    descricao:
      "O relatório de setembro mostra 12 horas a menos para a equipe de vendas. As batidas aparecem no espelho de ponto, mas não entram no total.",
    status: "em-andamento",
    criadoEm: "2026-09-29T10:42:07-03:00",
  },
  {
    protocolo: "TT-2026-004795",
    usuarioEmail: "mariana.costa@construtorahorizonte.com.br",
    categoria: "integracao",
    prioridade: "critica",
    descricao:
      "A exportação para a folha de pagamento falha com erro de tempo esgotado. O fechamento da folha é amanhã.",
    status: "em-andamento",
    criadoEm: "2026-09-30T08:05:51-03:00",
  },
  {
    protocolo: "TT-2026-004762",
    usuarioEmail: "carlos.mendes@paodourado.com.br",
    categoria: "duvida",
    prioridade: "baixa",
    descricao:
      "Como cadastro uma escala 12x36 para os padeiros do turno da madrugada?",
    status: "resolvido",
    criadoEm: "2026-09-24T06:15:33-03:00",
  },
  {
    protocolo: "TT-2026-004741",
    usuarioEmail: "fernanda.lima@farmabemestar.com.br",
    categoria: "bug",
    prioridade: "alta",
    descricao:
      "No aplicativo, a batida de saída fica girando e não confirma quando o celular está sem sinal. Depois aparece duplicada.",
    status: "fechado",
    criadoEm: "2026-09-18T19:02:48-03:00",
  },
  {
    protocolo: "TT-2026-004823",
    usuarioEmail: "patricia.rocha@pontocriativo.com.br",
    categoria: "feature",
    prioridade: "baixa",
    descricao:
      "Seria útil receber um aviso por email quando alguém da equipe esquecer de bater a saída.",
    status: "aberto",
    criadoEm: "2026-10-01T09:11:24-03:00",
  },
];

export const statusSistema: StatusSistema = {
  geral: "degradado",
  atualizadoEm: "2026-10-01T09:30:00-03:00",
  componentes: [
    { nome: "API Principal", status: "operacional" },
    { nome: "Painel Web", status: "operacional" },
    {
      nome: "Integração Folha",
      status: "degradado",
      detalhe: "Exportações para a folha de pagamento estão mais lentas que o normal.",
    },
    { nome: "App Mobile", status: "operacional" },
    { nome: "Relatórios", status: "operacional" },
  ],
};

// Semana passada: segunda 21/09 a sexta 25/09/2026.
// Cada dia tem entrada, saída para o almoço, volta e saída (null = esqueceu de bater).
type DiaDePonto = [data: string, ...horarios: (string | null)[]];

const batidasPorUsuario: Record<string, DiaDePonto[]> = {
  "joao@empresa.com": [
    ["2026-09-21", "08:58", "12:01", "13:02", "18:04"],
    ["2026-09-22", "09:03", "12:15", "13:14", "18:10"],
    ["2026-09-23", "08:55", "12:00", "12:59", "17:58"],
    ["2026-09-24", "09:12", "12:30", "13:31", null],
    ["2026-09-25", "08:49", "12:05", "13:06", "17:02"],
  ],
  "mariana.costa@construtorahorizonte.com.br": [
    ["2026-09-21", "07:30", "11:30", "12:30", "16:48"],
    ["2026-09-22", "07:28", "11:35", "12:34", "17:55"],
    ["2026-09-23", "07:31", "11:30", "12:31", "16:50"],
    ["2026-09-24", "07:35", "11:42", "12:40", "16:47"],
    ["2026-09-25", "07:26", "11:30", "12:29", "16:30"],
  ],
  "fernanda.lima@farmabemestar.com.br": [
    ["2026-09-21", "13:00", "17:00", "17:15", "22:02"],
    ["2026-09-22", "12:57", "17:04", "17:19", "22:00"],
    ["2026-09-23", "13:05", "17:02", "17:17", "22:08"],
    ["2026-09-24", "13:01", "16:58", "17:13", "21:59"],
    ["2026-09-25", "12:54", "17:00", "17:15", "22:31"],
  ],
};

const tiposDoDia: TipoRegistro[] = ["entrada", "saida", "entrada", "saida"];

export const registrosPonto: RegistroPonto[] = Object.entries(batidasPorUsuario).flatMap(
  ([usuarioEmail, dias]) =>
    dias.flatMap(([data, ...horarios]) =>
      horarios.flatMap((hora, i) =>
        hora === null
          ? []
          : [
              {
                id: `pt_${usuarioEmail.split("@")[0]}_${data}_${i + 1}`,
                usuarioEmail,
                tipo: tiposDoDia[i],
                dataHora: `${data}T${hora}:00-03:00`,
              },
            ],
      ),
    ),
);
