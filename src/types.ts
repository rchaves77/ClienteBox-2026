export interface CompanyMetrics {
  interacoes: number;
  rotas: number;
  chats: number;
  ligacoes: number;
}

export interface Competitor {
  id?: string;
  nome: string;
  posicao: string;
  categoria: string;
  nota: string;
  status: string;
}

export interface DeviceDistribution {
  buscaMovel: number | string;
  buscaDesktop: number | string;
  mapsMovel: number | string;
  mapsDesktop: number | string;
  porcentagens?: {
    buscaMovelPct: number | string;
    buscaDesktopPct: number | string;
    mapsMovelPct: number | string;
    mapsDesktopPct: number | string;
  };
}

export interface MonthlyMetricRecord {
  mesAno: string;
  nomeMes: string;
  rotas: number;
  chamadas: number;
  chats: number;
  websiteClicks?: number;
  agendamentos?: number;
  interacoes: number;
  visualizacoes?: number;
  novasAvaliacoes?: number;
  notaMedia?: number;
  observacao?: string;
  termosBusca?: SearchTermItem[];
  detalhesDispositivos?: DeviceDistribution;
  pesquisasTotais?: number | string;
  pesquisasStatusText?: string;
}

export interface SearchTermItem {
  termo: string;
  exibicoes: string | number;
}

export interface Company {
  id: string;
  nome: string;
  responsavel: string;
  categoria: string;
  endereco: string;
  ltv: number; // Valor médio por paciente / cliente em R$
  pixChave: string;
  pixFavorecido: string;
  pixBanco: string;
  periodo: string; // Ex: "Agosto a Setembro 2026"
  ciclo: string; // Ex: "Outubro 2026"
  dataIntervencao: string; // Ex: "16 de Julho"
  dataEntradaGestao?: string;
  monthlyHistory?: MonthlyMetricRecord[];
  termosBusca?: SearchTermItem[];
  metricasAnterior: CompanyMetrics;
  metricasAtual: CompanyMetrics;
  acoes: string[];
  proximosPassos: string[];
  concorrentes: Competitor[];
  diagnosticoCustom?: string;
}

export interface AppState {
  selectedCompanyId: string;
  companies: Record<string, Company>;
}

export type ActiveTab = 'site' | 'portfolio' | 'services' | 'admin' | 'crm' | 'report' | 'prospecting' | 'onboarding';

export interface CrmTab {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface CrmLead {
  id: string;
  tabId: string;
  name: string;
  phone: string;
  lastMessage?: string;
  messageType?: 'text' | 'audio' | 'image' | 'proposal';
  dealValue: number;
  tags: string[];
  followUpDate?: string;
  followUpTime?: string;
  notes?: string;
  unreadCount?: number;
  avatarUrl?: string;
  source?: 'whatsapp' | 'manual' | 'prospecting' | 'formspree';
  createdAt: string;
  updatedAt: string;
}

export interface QuickMessageTemplate {
  id: string;
  title: string;
  category: 'saudacao' | 'followup' | 'proposta' | 'fechamento' | 'cobranca';
  text: string;
}

export interface CommercialProposalData {
  documento: {
    tipo: string;
    titulo: string;
    subtitulo: string;
    versao_template: string;
    data_emissao: string;
    empresa_consultora: {
      nome: string;
      slogan: string;
      responsavel_tecnico: string;
      contato_corporativo: string;
      dados_pagamento: {
        metodo: string;
        chave_pix: string;
        tipo_chave: string;
        titular: string;
        instituicao_bancaria: string;
      };
    };
    cliente: {
      nome_fantasia: string;
      responsavel: string;
      credenciais?: string;
      nicho: string;
      cidade_uf: string;
      bairro: string;
      telefone_whatsapp: string;
      canais_auditados: {
        google_maps: string;
        instagram: string;
        website_configurado: string;
        concorrentes_referencia: string[];
      };
    };
  };
  diagnostico_cenario_atual: {
    resumo_executivo: string;
    argumento_contraste: string;
    metricas_chave: Record<string, {
      valor: string;
      rotulo: string;
      status: string;
      tipo: 'destaque' | 'alerta' | 'critico' | 'sucesso';
    }>;
    auditoria_canais: Array<{
      canal: string;
      dados_atuais: string;
      status: string;
      impacto_algoritmico: string;
    }>;
  };
  inteligencia_competitiva: {
    titulo_grafico: string;
    dados_grafico: Array<{
      empresa: string;
      avaliacoes: number | string;
      nota: number | string;
      largura_barra_percentual: number;
      status: string;
    }>;
  };
  engenharia_seo_local: {
    escopo_execucao_taxa_unica: string[];
  };
  viabilidade_financeira: {
    ticket_medio_servico: string;
    ltv_anual_estimado: string;
    ponto_de_equilibrio: string;
    cenarios: Array<{
      cenario: string;
      investimento: string;
      novos_clientes_mes: string;
      receita_bruta_mes: string;
      ltv_anual_12m: string;
      roi_estimado: string;
    }>;
  };
  condicao_comercial: {
    servico: string;
    valor_proposta: string;
    modelo: string;
    planos_acompanhamento_opcionais?: {
      mensal?: string;
      trimestral?: string;
      semestral?: string;
    };
    garantia: {
      prazo_dias: number;
      descricao: string;
    };
  };
  scripts_comerciais_whatsapp: {
    mensagem_2_diagnostico: string;
    cta_transicao: string;
    mensagem_3_fechamento: string;
    banco_de_objecoes: Record<string, string>;
    cases_autoridade?: Array<{
      cliente: string;
      resultado: string;
    }>;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  type?: 'success' | 'info' | 'error';
}
