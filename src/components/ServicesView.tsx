import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Star, 
  Smartphone, 
  TrendingUp, 
  Instagram, 
  Users, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Zap, 
  FileText, 
  Check, 
  Phone,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface ServicesViewProps {
  onGoToOnboarding: () => void;
  onGoToDiagnostic: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onGoToOnboarding,
  onGoToDiagnostic,
}) => {
  const [selectedFilter, setSelectedCategory] = useState<'all' | 'seo' | 'automation' | 'growth' | 'management'>('all');

  const servicesList = [
    {
      id: 'seo-local',
      category: 'seo',
      icon: Search,
      title: 'Google Business Profile + SEO Local de Precisão',
      tagline: 'Presença no Top 3 do Google Maps para buscas de alta intenção',
      scope: 'Reestruturação integral do cadastro comercial, categorização exata (Primary & Secondary Categories), inserção estratégica de palavras-chave de cauda longa nos atributos, catálogo visual de tratamentos e indexação geográfica direcionada à sua região.',
      benefits: [
        'Apareça em 1º lugar quando potenciais clientes/pacientes buscam por nutricionista, fisioterapeuta, médica ou clínica na sua cidade',
        'Captação de demanda reprimida com alta taxa de conversão e prontas para agendamento',
        'Blindagem técnica do perfil contra alterações maliciosas de endereço, horários ou telefone feitas pela concorrência',
        'Crescimento mensurável no volume de solicitações de rotas GPS e ligações diretas'
      ]
    },
    {
      id: 'site-alta-performance',
      category: 'automation',
      icon: Globe,
      title: 'Site Institucional de Alta Performance com SEO Integrado',
      tagline: 'Portal web veloz, responsivo e construído para conversão de agendamentos',
      scope: 'Desenvolvimento de plataforma web rápida, segura (SSL) e totalmente adaptada para celulares. Estruturada para transmitir autoridade técnica nas suas especialidades, com chamadas para ação sem atrito e conformidade regulatória.',
      benefits: [
        'Carregamento instantâneo no celular com experiência de navegação impecável',
        'Apresentação clara da metodologia de atendimento, estrutura e corpo clínico',
        'Eliminação da taxa de evasão de visitantes por falta de informações claras',
        'Ranqueamento orgânico contínuo nas primeiras posições das pesquisas do Google Search'
      ]
    },
    {
      id: 'sistema-gestao-clinica',
      category: 'management',
      icon: ShieldCheck,
      title: 'Sistema Integrado de Gestão Clínica e Empresarial',
      tagline: 'Prontuário eletrônico seguro, agenda centralizada e controle financeiro',
      scope: 'Solução robusta e simplificada para a operação diária do consultório/empresa: prontuário eletrônico seguro, histórico clínico completo do paciente, controle financeiro de consultas/vendas e relatórios gerenciais.',
      benefits: [
        'Elimina a dependência de planilhas manuais ou prontuários em papel vulneráveis',
        'Garante conformidade técnica com normas de segurança e privacidade (LGPD)',
        'Visão transparente do faturamento bruto, ticket médio e fluxo de agendamentos',
        'Organização operacional ágil para médicos, terapeutas, recepção e gestores'
      ]
    },
    {
      id: 'agendamento-bot-24h',
      category: 'automation',
      icon: Clock,
      title: 'Plataforma de Agendamento Online + Bot Inteligente 24 Horas',
      tagline: 'Captura ininterrupta de pacientes no site e WhatsApp com confirmação anti-falta',
      scope: 'Canal interativo ininterrupto para captura de pacientes. O cliente pode agendar consultas pela interface web com sincronização em tempo real da agenda ou interagir via WhatsApp com o bot inteligente, que executa triagens e confirmações automáticas.',
      benefits: [
        'Atendimento e captura atenta de leads 24h por dia (à noite, feriados e fins de semana)',
        'Redução expressiva no índice de no-show (faltas) através de disparos de lembretes preventivos',
        'Esclarecimento automático de dúvidas frequentes e orientações pré-consulta',
        'Zero sobrecarga para o corpo clínico ou equipe de secretárias'
      ]
    },
    {
      id: 'coleta-avaliacoes-5estrelas',
      category: 'seo',
      icon: Star,
      title: 'Mecanismo Automatizado de Coleta de Avaliações 5 Estrelas',
      tagline: 'Aceleração contínua de provas sociais e notas máximas no Google',
      scope: 'Fluxo programado de disparos pós-consulta via mensagem que convida o paciente satisfeito a avaliar a clínica no Google com apenas dois cliques, gerando volume constante de depoimentos positivos.',
      benefits: [
        'Combustível algorítmico necessário para ultrapassar a marca de avaliações dos concorrentes locais',
        'Aumento rápido da nota média e atração de pacientes que buscam pela clínica mais recomendada',
        'Fortalecimento da prova social de autoridade no Google Maps',
        'Canal preventivo de escuta para garantir a satisfação plena do cliente'
      ]
    },
    {
      id: 'whatsapp-estruturado',
      category: 'automation',
      icon: Smartphone,
      title: 'WhatsApp Business Profissional e Estruturado',
      tagline: 'Catálogo de procedimentos, respostas rápidas e gestão visual do funil',
      scope: 'Configuração arquitetada para recepção: padronização visual da conta comercial, catálogo de procedimentos com descrições e valores de referência, mensagens rápidas pré-configuradas e fluxo de etiquetas para acompanhamento visual do funil.',
      benefits: [
        'Redução do tempo de resposta no atendimento aos potenciais clientes',
        'Apresentação clara dos serviços com redução de até 60% na evasão de contatos',
        'Acompanhamento organizado de cada lead desde o primeiro "Oi" até a consulta firmada',
        'Comunicação padronizada e alinhada com a postura da empresa'
      ]
    },
    {
      id: 'gestao-instagram-autoridade',
      category: 'growth',
      icon: Instagram,
      title: 'Gestão Estratégica de Redes Sociais & Instagram de Autoridade',
      tagline: 'Linha editorial focada em converter seguidores em pacientes de alto valor',
      scope: 'Planejamento de linha editorial orientada a autoridade técnica: produção de pautas autorais sobre tratamentos, prevenção, longevidade e emagrecimento consciente, com chamadas estratégicas para agendamento.',
      benefits: [
        'Posicionamento de marca forte e diferenciado da concorrência comum',
        'Construção de uma audiência qualificada e engajada na sua região',
        'Geração contínua de interesse e desejo pelos seus procedimentos especializados',
        'Valorização do valor percebido da consulta e acompanhamento clínico'
      ]
    },
    {
      id: 'trafego-pago-google-ads',
      category: 'growth',
      icon: TrendingUp,
      title: 'Tráfego Pago Especializado via Google Ads & Meta Ads',
      tagline: 'Anúncios diretos para palavras-chave mais buscadas na sua cidade',
      scope: 'Estruturação de anúncios focados nas palavras-chave de maior intenção de agendamento na sua região. Esta frente garante a captação imediata de pacientes qualificados já no primeiro mês de funcionamento.',
      benefits: [
        'Entrada imediata de chamadas e mensagens no WhatsApp desde os primeiros dias',
        'Operação como tração inicial enquanto o SEO orgânico se consolida no topo do ranking',
        'Segmentação demográfica e geográfica por bairro e raio de alcance da clínica',
        'Relatórios periódicos de custo por agendamento e retorno financeiro'
      ]
    },
    {
      id: 'blindagem-monitoramento-36m',
      category: 'seo',
      icon: Award,
      title: 'Gestão Contínua de Posicionamento e Blindagem de Ranking',
      tagline: 'Auditorias quinzenais, combate à concorrência desleal e suporte técnico',
      scope: 'Auditorias técnicas periódicas das métricas locais, combate a práticas predatórias da concorrência, ajustes de metadados conforme mudanças nos algoritmos do Google e relatórios analíticos de desempenho.',
      benefits: [
        'Sustentação contínua da liderança no mapa sem risco de perda de posições',
        'Monitoramento proativo e proteção da reputação da sua empresa na internet',
        'Envio de relatórios mensais claros de chamadas, solicitações de rota e cliques',
        'Acompanhamento e suporte direto com o consultor responsável'
      ]
    },
    {
      id: 'treinamento-operacional-equipe',
      category: 'management',
      icon: Users,
      title: 'Treinamento Operacional de Recepcionista e Equipe',
      tagline: 'Capacitação da secretaria para atendimento humanizado e conversão',
      scope: 'Capacitação prática da secretária ou recepcionista, fornecendo domínio pleno sobre o manuseio da agenda, operação do prontuário, acompanhamento do bot de WhatsApp e triagem humanizada dos leads recebidos.',
      benefits: [
        'Garante que 100% dos contatos gerados na internet sejam acolhidos com excelência',
        'Elimina falhas na passagem de informações e valores de procedimentos',
        'Aumento na taxa de conversão de mensagens em consultas agendadas',
        'Equipe alinhada, segura e capacitada para operar as ferramentas tecnológicas'
      ]
    }
  ];

  const filteredServices = servicesList.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HERO HEADER */}
        <section className="bg-gradient-to-r from-[#111622] via-[#182030] to-[#111622] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5a35]/15 blur-[140px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Portfólio Oficial de Serviços ClienteBox</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
              ECOSSISTEMA DIGITAL COMPLETO
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Soluções integradas de engenharia de SEO Local, sites de alta conversão, automação inteligente no WhatsApp e gestão de presença no Google Maps.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onGoToOnboarding}
                className="flex items-center gap-2 bg-[#ff5a35] hover:bg-[#ff481f] text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-[#ff5a35]/25 transition-all text-sm active:scale-95"
              >
                <span>Preencher Cadastro de Otimização</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToDiagnostic}
                className="flex items-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-300 font-extrabold border border-amber-500/30 px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Solicitar Auditoria Grátis</span>
              </button>
            </div>
          </div>
        </section>

        {/* CATEGORY FILTER BUTTONS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#ff5a35]" />
              Estrutura Completa dos Módulos de Serviço
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Filtre pelas áreas estratégicas de atuação da ClienteBox para a sua empresa ou clínica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#161d2a] p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: 'Todos os Módulos' },
              { id: 'seo', label: 'SEO & Google Maps' },
              { id: 'automation', label: 'Sites & Automações' },
              { id: 'growth', label: 'Tráfego & Redes' },
              { id: 'management', label: 'Gestão & Equipe' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id as any)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedFilter === f.id
                    ? 'bg-[#ff5a35] text-white shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-[#1f283a]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => {
            const IconComp = service.icon;
            return (
              <div
                key={service.id}
                className="bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#182030] text-amber-400 rounded-2xl border border-slate-700 shadow-inner">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                      Módulo Integrado
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white font-display leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-amber-300 font-bold mt-1">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Scope of Execution */}
                  <div className="bg-[#161d2a] p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Escopo Técnico de Entrega:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {service.scope}
                    </p>
                  </div>

                  {/* Clear Business Benefits */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Benefícios Diretos para o Seu Negócio:
                    </span>
                    <ul className="space-y-2">
                      {service.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={onGoToOnboarding}
                    className="w-full flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-300 border border-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all"
                  >
                    <span>Incluir este Módulo no Seu Cadastro</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPARATIVE PACKAGES SECTION */}
        <section className="bg-[#111622] p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              3 Formas de Contratar &bull; 1 Caminho de Máximo Resultado
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Formatos de Implementação do Ecossistema
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Oferecemos desde a estruturação essencial do Google Maps até a implantação integral da infraestrutura tecnológica e operacional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Package A */}
            <div className="bg-[#161d2a] p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">
                    Opção A — Essencial
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    SEM MENSALIDADE
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">Correção de Visibilidade</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">R$ 700,00</span>
                  <span className="text-[11px] font-mono text-slate-400">taxa única</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focado no destravamento imediato do perfil no Google Maps, automação de avaliações e padronização do WhatsApp.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">✓ Google Business Profile + SEO Local</li>
                  <li className="flex items-center gap-2">✓ Automação de Avaliações 5 Estrelas</li>
                  <li className="flex items-center gap-2">✓ WhatsApp Business Estruturado</li>
                  <li className="flex items-center gap-2">✓ Relatório A4 Executivo Oficial</li>
                  <li className="flex items-center gap-2">✓ Garantia de 60 Dias</li>
                </ul>
              </div>

              <button
                onClick={onGoToOnboarding}
                className="w-full bg-[#182030] hover:bg-[#202b40] text-emerald-400 border border-emerald-500/40 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                Solicitar Opção Essencial — R$ 700
              </button>
            </div>

            {/* Package B */}
            <div className="bg-[#161d2a] p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-sky-400 tracking-wider block">
                  Opção B — Presença Digital
                </span>
                <h3 className="text-lg font-black text-white">Presença &amp; Automação Web</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-sky-400">R$ 1.800,00</span>
                  <span className="text-[11px] font-mono text-slate-400">valor único</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Inclui site institucional de alta performance, agendamento online com bot 24h e integração completa com WhatsApp.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">✓ Tudo da Opção Essencial</li>
                  <li className="flex items-center gap-2">✓ Site Profissional com SEO Integrado</li>
                  <li className="flex items-center gap-2">✓ Agendamento Online + Bot 24h</li>
                  <li className="flex items-center gap-2">✓ Hospedagem Segura SSL</li>
                </ul>
              </div>

              <button
                onClick={onGoToOnboarding}
                className="w-full bg-[#182030] hover:bg-[#202b40] text-sky-300 border border-sky-800/60 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                Solicitar Presença Digital
              </button>
            </div>

            {/* Package C */}
            <div className="bg-gradient-to-b from-[#1c2638] to-[#161d2a] p-6 rounded-2xl border-2 border-[#ff5a35] space-y-4 flex flex-col justify-between relative shadow-xl shadow-[#ff5a35]/10">
              <div className="absolute -top-3 right-4 bg-[#ff5a35] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                Recomendada (Ecossistema)
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-[#ff5a35] tracking-wider block">
                  Opção C — Ecossistema Completo
                </span>
                <h3 className="text-lg font-black text-white">Infraestrutura Integral</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">R$ 2.900,00</span>
                  <span className="text-[11px] font-mono text-slate-400">valor único</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ecossistema completo com sistema de gestão, Google Ads patrocinado, treinamento de equipe e blindagem contínua.
                </p>
                <ul className="space-y-1.5 text-xs text-slate-200 pt-2 border-t border-slate-800 font-semibold">
                  <li className="flex items-center gap-2">✓ Tudo da Opção Presença Digital</li>
                  <li className="flex items-center gap-2">✓ Sistema de Gestão &amp; Prontuário</li>
                  <li className="flex items-center gap-2">✓ Google Ads (Estruturação de Campanhas)</li>
                  <li className="flex items-center gap-2">✓ Treinamento Operacional de Recepção</li>
                  <li className="flex items-center gap-2">✓ Blindagem contra Sabotagem</li>
                </ul>
              </div>

              <button
                onClick={onGoToOnboarding}
                className="w-full bg-[#ff5a35] hover:bg-[#ff481f] text-white font-black py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Contratar Ecossistema Completo
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER CTA CALLOUT */}
        <section className="bg-gradient-to-r from-amber-950/40 via-[#182030] to-amber-950/40 p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Pronto para implementar estas soluções na sua empresa?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Preencha os dados da sua empresa no formulário de cadastro ou solicite uma auditoria prévia sem compromisso com o consultor Rômulo Chaves.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGoToOnboarding}
              className="flex items-center justify-center gap-2 bg-[#ff5a35] hover:bg-[#ff481f] text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-[#ff5a35]/20 transition-all text-sm"
            >
              <span>Ir para o Formulário de Cadastro</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToDiagnostic}
              className="flex items-center justify-center gap-2 bg-[#161d2a] hover:bg-[#1f283a] text-slate-200 border border-slate-700 font-bold px-6 py-3.5 rounded-xl text-sm"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Solicitar Auditoria Grátis</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
