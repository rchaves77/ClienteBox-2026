import { AppState } from '../types';

export const STORAGE_KEY = 'clientebox_state_v7';

export const defaultState: AppState = {
  selectedCompanyId: 'jc-fisioterapia',
  companies: {
    'jc-fisioterapia': {
      id: 'jc-fisioterapia',
      nome: 'Jucelino Castro Fisioterapia - Fisioterapeuta em Rio Branco',
      responsavel: 'Dr. Jucelino Castro',
      categoria: 'Clínica de Fisioterapia Especializada',
      endereco: 'Rua Quintino Bocaiuva, 1848 - Bosque, Rio Branco - AC, 69900-670',
      ltv: 1200,
      pixChave: '(68) 98103-4408',
      pixFavorecido: 'Rômulo Chaves da Silva',
      pixBanco: 'Sicredi',
      periodo: 'Abril a Setembro de 2026 (Relatório Fechado)',
      ciclo: 'Outubro 2026',
      dataIntervencao: '16 de Julho de 2026',
      monthlyHistory: [
        {
          mesAno: '2026-04',
          nomeMes: 'Abril / 2026',
          visualizacoes: 215,
          interacoes: 74,
          rotas: 38,
          chats: 9,
          chamadas: 26,
          websiteClicks: 1,
          novasAvaliacoes: 0,
          notaMedia: 4.5,
          observacao: 'Pré-Consultoria'
        },
        {
          mesAno: '2026-05',
          nomeMes: 'Maio / 2026',
          visualizacoes: 228,
          interacoes: 78,
          rotas: 40,
          chats: 11,
          chamadas: 25,
          websiteClicks: 2,
          novasAvaliacoes: 1,
          notaMedia: 4.5,
          observacao: 'Pré-Consultoria'
        },
        {
          mesAno: '2026-06',
          nomeMes: 'Junho / 2026',
          visualizacoes: 224,
          interacoes: 79,
          rotas: 40,
          chats: 12,
          chamadas: 26,
          websiteClicks: 1,
          novasAvaliacoes: 0,
          notaMedia: 4.5,
          observacao: 'Pré-Consultoria'
        },
        {
          mesAno: '2026-07',
          nomeMes: 'Julho / 2026',
          visualizacoes: 262,
          interacoes: 93,
          rotas: 56,
          chats: 18,
          chamadas: 18,
          websiteClicks: 1,
          novasAvaliacoes: 3,
          notaMedia: 4.6,
          observacao: 'Transição (Início em 16/07 — Quinzena 1: 21 rotas | Quinzena 2: 35 rotas [+66,7%])'
        },
        {
          mesAno: '2026-08',
          nomeMes: 'Agosto / 2026',
          visualizacoes: 342,
          interacoes: 121,
          rotas: 82,
          chats: 27,
          chamadas: 11,
          websiteClicks: 1,
          novasAvaliacoes: 14,
          notaMedia: 4.8,
          observacao: 'Pós-Consultoria (Auditado Oficial Google: +128,3% em interações)'
        },
        {
          mesAno: '2026-09',
          nomeMes: 'Setembro / 2026',
          visualizacoes: 247,
          interacoes: 103,
          rotas: 71,
          chats: 18,
          chamadas: 13,
          websiteClicks: 1,
          novasAvaliacoes: 17,
          notaMedia: 4.9,
          observacao: 'Setembro Fechado Auditado (103 interações, 71 rotas GPS [+184%], 18 chats, 13 chamadas, 247 visualizações [+15,4%])'
        }
      ],
      metricasAnterior: {
        interacoes: 121,
        rotas: 82,
        chats: 27,
        ligacoes: 11
      },
      metricasAtual: {
        interacoes: 103,
        rotas: 71,
        chats: 18,
        ligacoes: 13
      },
      diagnosticoCustom: 'Relatório Fechado de Setembro de 2026: Consolidação de liderança e alta tração local no Google Maps para Jucelino Castro Fisioterapia no bairro Bosque. O perfil registrou 103 interações totais (+77,6% x set/2025) e 71 solicitações de rotas GPS (+184,0% x set/2025). O volume total de visualizações atingiu 247 pessoas (+15,4% x set/2025), sendo 52% via busca móvel e 21% via Google Maps móvel, mantendo a atração contínua de pacientes sem depender de mídia paga.',
      acoes: [
        "Otimização das chamadas diretas e botão de WhatsApp na recepção",
        "Cadastro de novas fotos de alta resolução georreferenciadas no bairro Bosque",
        "Parametrização de link UTM rastreado no botão do WhatsApp",
        "Auditoria e blindagem da categoria principal para Fisioterapia Especializada"
      ],
      proximosPassos: [
        "Aceleração da campanha de coleta de avaliações 5 estrelas no pós-consulta",
        "Monitoramento e neutralização de sugestões indevidas de concorrentes no Bosque",
        "Publicação semanal de artigos curtos no feed do Google Meu Negócio",
        "Blindagem do endereço contra edições maliciosas no mapa"
      ],
      concorrentes: [
        { nome: "Jucelino Castro Fisioterapia (Você)", posicao: "Top 1", categoria: "Fisioterapia Especializada", nota: "4.9 ★ (35 avaliações)", status: "Líder Absoluto no Bosque" },
        { nome: "FisioClin Rio Branco", posicao: "Top 2", categoria: "Clínica de Fisioterapia", nota: "4.7 ★ (68)", status: "Sem link de WhatsApp direto" },
        { nome: "Centro Ortopédico Bosque", posicao: "Top 3", categoria: "Ortopedia & Reabilitação", nota: "4.5 ★ (42)", status: "Poucas fotos e atualizações antigas" },
        { nome: "ReabFisio Acre", posicao: "Top 4 (Fora)", categoria: "Fisioterapia Geral", nota: "4.2 ★ (19)", status: "Inativo há mais de 6 meses" }
      ],
      termosBusca: [
        { termo: 'academia', exibicoes: '< 15' },
        { termo: 'fisiatra', exibicoes: '< 15' },
        { termo: 'fisioterapeuta', exibicoes: '< 15' },
        { termo: 'fisioterapeuta rio branco', exibicoes: '< 15' },
        { termo: 'fisioterapia', exibicoes: '< 15' }
      ]
    },

    'instituto-serclin': {
      id: 'instituto-serclin',
      nome: 'Instituto SerClin',
      responsavel: 'Dra. Patrícia Serpa / Rômulo Silva',
      categoria: 'Clínica Médica & Saúde Integrada',
      endereco: 'Rua Sorocaba, 140 - Doca Furtado, Rio Branco - AC, 69918-130',
      ltv: 1800,
      pixChave: '(68) 98103-4408',
      pixFavorecido: 'Rômulo Chaves da Silva',
      pixBanco: 'Sicredi',
      periodo: 'Junho a Setembro 2026 (Auditado das Capturas do Painel)',
      ciclo: 'Outubro 2026',
      dataIntervencao: '01 de Junho de 2026',
      monthlyHistory: [
        {
          mesAno: '2026-05',
          nomeMes: 'Maio / 2026',
          visualizacoes: 350,
          interacoes: 64,
          rotas: 42,
          chats: 12,
          chamadas: 10,
          websiteClicks: 2,
          novasAvaliacoes: 1,
          notaMedia: 4.8,
          pesquisasTotais: 147,
          detalhesDispositivos: {
            buscaMovel: '210 (60%)',
            buscaDesktop: '80 (23%)',
            mapsMovel: '45 (13%)',
            mapsDesktop: '15 (4%)'
          },
          observacao: 'Métricas Auditadas do Painel Google (Maio/2026: Termos de Pesquisa Iniciais do Instituto SerClin)',
          termosBusca: [
            { termo: 'neuropsicologia', exibicoes: 82 },
            { termo: 'avaliação neuropsicológica', exibicoes: 25 },
            { termo: 'neuropsicologia rio branco acre', exibicoes: 25 },
            { termo: 'clinica de psicologia', exibicoes: '< 15' },
            { termo: 'clinica psicologia', exibicoes: '< 15' },
            { termo: 'clínica de psicologia rio branco acre', exibicoes: '< 15' },
            { termo: 'crp', exibicoes: '< 15' },
            { termo: 'neuropsicologa', exibicoes: '< 15' },
            { termo: 'neuropsicologia infantil rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologo', exibicoes: '< 15' },
            { termo: 'neuropsicológala', exibicoes: '< 15' },
            { termo: 'neuropsicóloga', exibicoes: '< 15' },
            { termo: 'neuropsicóloga acre', exibicoes: '< 15' },
            { termo: 'neuropsicólogo', exibicoes: '< 15' },
            { termo: 'neuropsilogos em rio branco acre', exibicoes: '< 15' },
            { termo: 'psicologo rio branco', exibicoes: '< 15' },
            { termo: 'terapia', exibicoes: '< 15' }
          ]
        },
        {
          mesAno: '2026-06',
          nomeMes: 'Junho / 2026',
          visualizacoes: 409,
          interacoes: 82,
          rotas: 55,
          chats: 18,
          chamadas: 8,
          websiteClicks: 1,
          novasAvaliacoes: 2,
          notaMedia: 4.9,
          pesquisasTotais: 101,
          detalhesDispositivos: {
            buscaMovel: '257 (63%)',
            buscaDesktop: '81 (20%)',
            mapsMovel: '53 (13%)',
            mapsDesktop: '18 (4%)'
          },
          observacao: 'Métricas Auditadas do Painel Google (Junho/2026: 409 visualizações, 82 interações, 55 rotas, 18 chats, 8 chamadas, 1 site, 101 pesquisas)',
          termosBusca: [
            { termo: 'neuropsicologia', exibicoes: 54 },
            { termo: 'neuropsicologia rio branco acre', exibicoes: 31 },
            { termo: 'avaliação neuropsicológica', exibicoes: 16 },
            { termo: 'clinica psicologia', exibicoes: '< 15' },
            { termo: 'clínica de avaliação psicológica', exibicoes: '< 15' },
            { termo: 'crp', exibicoes: '< 15' },
            { termo: 'francisca rariane psicologa', exibicoes: '< 15' },
            { termo: 'neuropsicologa', exibicoes: '< 15' },
            { termo: 'neuropsicologia infantil rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologo', exibicoes: '< 15' },
            { termo: 'neuropsicóloga', exibicoes: '< 15' },
            { termo: 'neuropsicóloga em rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicólogo', exibicoes: '< 15' },
            { termo: 'psicologa rio branco', exibicoes: '< 15' },
            { termo: 'psicologia', exibicoes: '< 15' },
            { termo: 'psicologo que faz aba', exibicoes: '< 15' },
            { termo: 'rua omar sabino de paula, 431, doca furtado, rio branco ac, 69918-114, brasil', exibicoes: '< 15' }
          ]
        },
        {
          mesAno: '2026-07',
          nomeMes: 'Julho / 2026',
          visualizacoes: 695,
          interacoes: 93,
          rotas: 55,
          chats: 27,
          chamadas: 6,
          websiteClicks: 5,
          novasAvaliacoes: 4,
          notaMedia: 4.9,
          pesquisasTotais: 179,
          detalhesDispositivos: {
            buscaMovel: '499 (72%)',
            buscaDesktop: '134 (19%)',
            mapsMovel: '38 (5%)',
            mapsDesktop: '24 (3%)'
          },
          observacao: 'Métricas Auditadas do Painel Google (Julho/2026: 695 visualizações, 93 interações, 55 rotas, 27 chats [+237,5%], 6 chamadas, 5 site, 179 pesquisas)',
          termosBusca: [
            { termo: 'neuropsicologia', exibicoes: 67 },
            { termo: 'neuropsicologia rio branco acre', exibicoes: 54 },
            { termo: 'neuropsicólogo', exibicoes: 22 },
            { termo: 'crp', exibicoes: 20 },
            { termo: 'gestalt terapia', exibicoes: 16 },
            { termo: 'avaliação neuropsicológica', exibicoes: '< 15' },
            { termo: 'chaves', exibicoes: '< 15' },
            { termo: 'clinicadepsicanalise em acre (ac)', exibicoes: '< 15' },
            { termo: 'clinicas de avaliação neuropsicológica', exibicoes: '< 15' },
            { termo: 'instituto serclin - drª helenara chaves - neuropsicologia (crp - 24/02216)', exibicoes: '< 15' },
            { termo: 'neuropsicologa', exibicoes: '< 15' },
            { termo: 'neuropsicologa rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologia em rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologia infantil', exibicoes: '< 15' },
            { termo: 'neuropsicologia infantil rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologia rio branco', exibicoes: '< 15' },
            { termo: 'neuropsicologo', exibicoes: '< 15' },
            { termo: 'neuropsicológica', exibicoes: '< 15' },
            { termo: 'neuropsicóloga', exibicoes: '< 15' },
            { termo: 'psicanalista', exibicoes: '< 15' },
            { termo: 'psicologia', exibicoes: '< 15' },
            { termo: 'psicologos que trabalham com avaliações', exibicoes: '< 15' },
            { termo: 'psicopedagogia', exibicoes: '< 15' },
            { termo: 'psicoterapia', exibicoes: '< 15' },
            { termo: 'psicólogo', exibicoes: '< 15' },
            { termo: 'psicólogo em rio branco, ac', exibicoes: '< 15' }
          ]
        },
        {
          mesAno: '2026-08',
          nomeMes: 'Agosto / 2026',
          visualizacoes: 681,
          interacoes: 86,
          rotas: 44,
          chats: 24,
          chamadas: 12,
          websiteClicks: 6,
          novasAvaliacoes: 8,
          notaMedia: 4.9,
          pesquisasTotais: 133,
          detalhesDispositivos: {
            buscaMovel: '488 (72%)',
            buscaDesktop: '110 (16%)',
            mapsMovel: '42 (6%)',
            mapsDesktop: '41 (6%)'
          },
          observacao: 'Métricas Auditadas do Painel Google (Agosto/2026: 681 visualizações, 86 interações, 44 rotas, 24 chats [+500%], 12 chamadas, 6 site, 133 pesquisas)',
          termosBusca: [
            { termo: 'neuropsicologia', exibicoes: 56 },
            { termo: 'neuropsicóloga', exibicoes: 31 },
            { termo: 'avaliação neuropsicológica', exibicoes: 24 },
            { termo: 'neuropsicólogo', exibicoes: 22 },
            { termo: '"helena kristina moura psicologia acre', exibicoes: '< 15' },
            { termo: 'clinica de psicologia', exibicoes: '< 15' },
            { termo: 'crp', exibicoes: '< 15' },
            { termo: 'doutor neuropisicologo raiou rio branco acre', exibicoes: '< 15' },
            { termo: 'gestalt terapia', exibicoes: '< 15' },
            { termo: 'neuropsicologa', exibicoes: '< 15' },
            { termo: 'neuropsicologia em rio branco', exibicoes: '< 15' },
            { termo: 'neuropsicologia em rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologia infantil', exibicoes: '< 15' },
            { termo: 'neuropsicologia infantil rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologia rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicologo', exibicoes: '< 15' },
            { termo: 'neuropsicóloga em rio branco acre', exibicoes: '< 15' },
            { termo: 'neuropsicólogo em rio branco acre', exibicoes: '< 15' },
            { termo: 'psicanalista', exibicoes: '< 15' },
            { termo: 'psicologa nilmara nogueira', exibicoes: '< 15' },
            { termo: 'psicologia', exibicoes: '< 15' },
            { termo: 'psicopedagogia', exibicoes: '< 15' },
            { termo: 'psicoterapia', exibicoes: '< 15' },
            { termo: 'psicólogos em rio branco acre', exibicoes: '< 15' },
            { termo: 'terapia', exibicoes: '< 15' }
          ]
        },
        {
          mesAno: '2026-09',
          nomeMes: 'Setembro / 2026',
          visualizacoes: 620,
          interacoes: 81,
          rotas: 58,
          chats: 17,
          chamadas: 4,
          websiteClicks: 2,
          novasAvaliacoes: 11,
          notaMedia: 4.9,
          pesquisasTotais: 'Em processamento pelo Google',
          pesquisasStatusText: 'Suas pesquisas estarão disponíveis em breve',
          detalhesDispositivos: {
            buscaMovel: '436 (70%)',
            buscaDesktop: '115 (19%)',
            mapsDesktop: '37 (6%)',
            mapsMovel: '32 (5%)'
          },
          observacao: 'Métricas Auditadas do Painel Google (Setembro/2026: 620 visualizações, 81 interações, 58 rotas [+190%], 17 chats, 4 chamadas, 2 site)'
        }
      ],
      metricasAnterior: {
        interacoes: 86,
        rotas: 44,
        chats: 24,
        ligacoes: 12
      },
      metricasAtual: {
        interacoes: 81,
        rotas: 58,
        chats: 17,
        ligacoes: 4
      },
      termosBusca: [
        { termo: 'neuropsicologia', exibicoes: 54 },
        { termo: 'neuropsicologia rio branco acre', exibicoes: 31 },
        { termo: 'avaliação neuropsicológica', exibicoes: 16 },
        { termo: 'clinica psicologia', exibicoes: '< 15' },
        { termo: 'clínica de avaliação psicológica', exibicoes: '< 15' },
        { termo: 'crp', exibicoes: '< 15' },
        { termo: 'francisca rariane psicologa', exibicoes: '< 15' },
        { termo: 'neuropsicologa', exibicoes: '< 15' },
        { termo: 'neuropsicologia infantil rio branco acre', exibicoes: '< 15' },
        { termo: 'neuropsicologo', exibicoes: '< 15' },
        { termo: 'neuropsicóloga', exibicoes: '< 15' },
        { termo: 'neuropsicóloga em rio branco acre', exibicoes: '< 15' },
        { termo: 'neuropsicólogo', exibicoes: '< 15' },
        { termo: 'psicologa rio branco', exibicoes: '< 15' },
        { termo: 'psicologia', exibicoes: '< 15' },
        { termo: 'psicologo que faz aba', exibicoes: '< 15' },
        { termo: 'rua omar sabino de paula, 431, doca furtado, rio branco ac, 69918-114, brasil', exibicoes: '< 15' }
      ],
      acoes: [
        "Otimização completa do Perfil de Empresa no Google no bairro Doca Furtado",
        "Cadastro das especialidades médicas e botão direto para agendamento presencial/online",
        "Inclusão de fotos de alta resolução da estrutura e equipe do Instituto SerClin",
        "Implementação de respostas personalizadas a dúvidas frequentes no perfil do Google Maps"
      ],
      proximosPassos: [
        "Aceleração do programa de fidelização e coleta de depoimentos 5 estrelas dos pacientes",
        "Inclusão do catálogo digital de consultas e exames na aba de Produtos",
        "Manutenção da liderança no raio médico do bairro Doca Furtado"
      ],
      concorrentes: [
        { nome: "Instituto SerClin (Você)", posicao: "Top 1", categoria: "Clínica Médica Especializada", nota: "4.9 ★ (156)", status: "Referência no Doca Furtado" },
        { nome: "Clinica Médica Rio Branco", posicao: "Top 2", categoria: "Clínica Geral", nota: "4.5 ★ (84)", status: "Sem atualização de horários" },
        { nome: "Centro de Saúde Acre", posicao: "Top 3", categoria: "Consultórios Médicos", nota: "4.2 ★ (41)", status: "Sem fotos do espaço físico" }
      ]
    }
  }
};
