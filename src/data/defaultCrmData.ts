import { CrmTab, CrmLead, QuickMessageTemplate } from '../types';

export const CRM_STORAGE_TABS_KEY = 'clientebox_crm_tabs_v1';
export const CRM_STORAGE_LEADS_KEY = 'clientebox_crm_leads_v1';
export const CRM_STORAGE_CONFIG_KEY = 'clientebox_crm_config_v1';

export const defaultCrmTabs: CrmTab[] = [
  {
    id: 'inbox',
    title: 'INBOX',
    color: '#0ea5e9', // Sky Blue / WaSeller style
    order: 1
  },
  {
    id: 'retomar-2x',
    title: 'RETOMAR 2X',
    color: '#f59e0b', // Amber / Warning
    order: 2
  },
  {
    id: 'retomar-1x',
    title: 'RETOMAR 1X',
    color: '#10b981', // Emerald / Cyan
    order: 3
  },
  {
    id: 'proposta-enviada',
    title: 'PROPOSTA ENVIADA',
    color: '#8b5cf6', // Violet
    order: 4
  },
  {
    id: 'fechado',
    title: 'FECHADO (GANHO) 🚀',
    color: '#22c55e', // Green
    order: 5
  }
];

export const defaultCrmLeads: CrmLead[] = [
  {
    id: 'lead-1',
    tabId: 'inbox',
    name: 'Marcelo Takano',
    phone: '5568999812345',
    lastMessage: 'Por agora esse orçamento...',
    messageType: 'text',
    dealValue: 700,
    tags: ['Orçamento Maps', 'Quente'],
    followUpDate: '2026-10-09',
    followUpTime: '10:00',
    notes: 'Interessado na otimização de 7 dias do Google Maps para a clínica.',
    unreadCount: 0,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-2',
    tabId: 'inbox',
    name: 'Nutricionista Luzia',
    phone: '5568999823456',
    lastMessage: '🎙️ Mensagem de Áudio (0:42)',
    messageType: 'audio',
    dealValue: 900,
    tags: ['Saúde & Nutrição', 'Avaliações'],
    followUpDate: '2026-10-10',
    followUpTime: '14:30',
    notes: 'Pediu diagnóstico de concorrentes em Rio Branco.',
    unreadCount: 1,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-3',
    tabId: 'inbox',
    name: 'Taynah Joerke Ansill...',
    phone: '5568999834567',
    lastMessage: 'Olá! Gostaria de saber mais sobre a otimização de perfil',
    messageType: 'text',
    dealValue: 700,
    tags: ['Google Maps', 'Novo Lead'],
    notes: 'Entrou em contato pelo formulário do site.',
    unreadCount: 2,
    source: 'formspree',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-4',
    tabId: 'inbox',
    name: 'Na Hora da Notícia',
    phone: '5568999845678',
    lastMessage: 'Influencer envolvimento e tráfego...',
    messageType: 'text',
    dealValue: 1200,
    tags: ['Portal de Notícias', 'Tráfego'],
    unreadCount: 99,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-5',
    tabId: 'inbox',
    name: 'ACHADINHOS DA CIDADE',
    phone: '5568999856789',
    lastMessage: 'Saca Prótese com 5...',
    messageType: 'text',
    dealValue: 500,
    tags: ['Comércio Local'],
    unreadCount: 99,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-6',
    tabId: 'inbox',
    name: 'Maria do Socorro F.',
    phone: '5568999867890',
    lastMessage: '📷 Imagem da Fachada enviada',
    messageType: 'image',
    dealValue: 700,
    tags: ['Estética', 'Em Negociação'],
    unreadCount: 4,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-7',
    tabId: 'inbox',
    name: 'Pleno.News Regional',
    phone: '5568999878901',
    lastMessage: '🔴 Envio de releases e parcerias comerciais',
    messageType: 'text',
    dealValue: 0,
    tags: ['Parceria'],
    unreadCount: 5,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-8',
    tabId: 'inbox',
    name: 'Cris - CRP 24/02216',
    phone: '5568999889012',
    lastMessage: 'CRP 24/02216 - Consultório de Psicologia Clínica',
    messageType: 'text',
    dealValue: 800,
    tags: ['Psicologia', 'Blindagem'],
    unreadCount: 0,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-9',
    tabId: 'inbox',
    name: 'GB AABB Kids/Teens',
    phone: '5568999890123',
    lastMessage: 'Boa tarde! Tudo bem? Podemos marcar reunião amanhã?',
    messageType: 'text',
    dealValue: 700,
    tags: ['Escola de Esportes', 'VIP'],
    unreadCount: 0,
    source: 'whatsapp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-10',
    tabId: 'retomar-1x',
    name: 'Dr. Roberto Odonto Prime',
    phone: '5568999112233',
    lastMessage: 'Vou ver com a recepção e te aviso até sexta.',
    messageType: 'text',
    dealValue: 1400,
    tags: ['Odontologia', 'Follow-up 1'],
    followUpDate: '2026-10-09',
    followUpTime: '15:00',
    notes: 'Ligar sexta-feira após as 14h para fechar contrato.',
    unreadCount: 0,
    source: 'prospecting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-11',
    tabId: 'retomar-2x',
    name: 'Auto Center Imperial',
    phone: '5568999445566',
    lastMessage: 'Visualizou proposta técnica mas não respondeu.',
    messageType: 'proposal',
    dealValue: 700,
    tags: ['Mecânica & Pneus', 'Retomar 2x'],
    followUpDate: '2026-10-08',
    followUpTime: '17:00',
    notes: 'Enviar script de encerramento de ciclo com escassez de vaga.',
    unreadCount: 0,
    source: 'prospecting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lead-12',
    tabId: 'fechado',
    name: 'Instituto SerClin Saúde Integrada',
    phone: '5568981034408',
    lastMessage: 'PIX confirmado! Gestão iniciada com sucesso.',
    messageType: 'text',
    dealValue: 1200,
    tags: ['Cliente Ativo', 'Gestão Mensal'],
    notes: 'Relatório Executivo A4 de 6 páginas entregue com sucesso.',
    unreadCount: 0,
    source: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const defaultQuickMessages: QuickMessageTemplate[] = [
  {
    id: 'qm-1',
    title: '🔥 Follow-up 1X (Retomada Amigável)',
    category: 'followup',
    text: 'Olá {nome}! Tudo bem? Passando para saber se conseguiu dar uma olhada na proposta de otimização do perfil no Google Maps que conversamos. Conseguimos liberar a vaga com a condição especial para essa semana!'
  },
  {
    id: 'qm-2',
    title: '⏰ Follow-up 2X (Escassez & Encerramento)',
    category: 'followup',
    text: 'Oi {nome}! Sei que o dia a dia é corrido. Estou fechando a agenda das consultorias deste ciclo e reservei uma vaga para sua empresa. Caso ainda tenha interesse em destravar mais rotas e ligações no Maps, me avise por aqui!'
  },
  {
    id: 'qm-3',
    title: '🚀 Primeiro Contato & Diagnóstico Gratuito',
    category: 'saudacao',
    text: 'Olá {nome}! Aqui é o Rômulo da ClienteBox. Fiz um levantamento do seu perfil no Google Maps e identifiquei que concorrentes estão captando chamadas no seu raio local. Posso te enviar um parecer com 3 melhorias rápidas sem custo?'
  },
  {
    id: 'qm-4',
    title: '📄 Envio de Proposta Comercial',
    category: 'proposta',
    text: 'Olá {nome}! Preparei a proposta executiva sob medida para o seu negócio no Google Maps. Investimento único de R$ {valor} com garantia de execução em 7 dias. Segue o link com todos os detalhes!'
  },
  {
    id: 'qm-5',
    title: '✅ Fechamento & Dados PIX',
    category: 'fechamento',
    text: 'Excelente decisão {nome}! Para iniciarmos a otimização de 7 dias, a nossa chave PIX oficial é: (68) 98103-4408 (Rômulo Chaves da Silva - Sicredi). Assim que realizar, me envie o comprovante para começarmos imediatamente!'
  }
];

export interface CrmConfig {
  myWhatsAppNumber: string;
  defaultCountryCode: string;
  enableNotifications: boolean;
  webhookUrl?: string;
  apiKey?: string;
  autoSyncLeads: boolean;
}

export const defaultCrmConfig: CrmConfig = {
  myWhatsAppNumber: '5568981034408',
  defaultCountryCode: '55',
  enableNotifications: true,
  autoSyncLeads: true
};
