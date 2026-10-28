import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Globe, 
  Clock, 
  MessageSquare, 
  Star, 
  Smartphone, 
  TrendingUp, 
  Instagram, 
  ShieldCheck, 
  Users, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Calendar,
  Layers,
  Zap,
  Phone
} from 'lucide-react';

interface PortfolioViewProps {
  onGoToDiagnostic: () => void;
  onGoToOnboarding: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onGoToDiagnostic,
  onGoToOnboarding
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'google' | 'web' | 'growth'>('all');

  const services = [
    {
      id: 'google-maps',
      category: 'google',
      icon: MapPin,
      badge: 'SEO Local & Posição Top 3',
      title: 'Google Business Profile & Dominância no Google Maps',
      subtitle: 'Otimização cadastral de precisão, taxonomia de categorias e blindagem algorítmica.',
      description: 'Reestruturação completa do Perfil de Empresa no Google. Implantação das categorias primárias de correspondência exata, inserção de palavras-chave de cauda longa, geotagging de imagens da sede e indexação geográfica para capturar pacientes e clientes que buscam ativamente na sua região.',
      benefits: [
        'Apareça no Top 3 do Google Maps quando o paciente pesquisa na sua cidade',
        'Captura imediata de buscas com altíssima intenção de agendamento',
        'Blindagem contra alterações maliciosas de endereço ou telefone por concorrentes',
        'Aumento comprovado no volume de solicitações de rotas GPS e ligações diretas'
      ]
    },
    {
      id: 'site-institucional',
      category: 'web',
      icon: Globe,
      badge: 'Conversão & Autoridade',
      title: 'Site Institucional de Alta Performance com SEO Integrado',
      subtitle: 'Plataforma web ultrarrápida, responsiva e desenvolvida para transmissão de autoridade técnica.',
      description: 'Desenvolvimento de portal corporativo de alta velocidade e conversão, totalmente adaptado para celulares. Arquitetura orientada a autoridade clínica e institucional, otimizado para motores de busca (SEO On-Page) e em total conformidade com diretrizes regulatórias.',
      benefits: [
        'Carregamento instantâneo e experiência fluida no celular',
        'Apresentação clara dos serviços, tratamentos e diferenciais da empresa',
        'Chamadas diretas e sem fricção para agendamento no WhatsApp',
        'Indexação orgânica contínua na primeira página do Google Search'
      ]
    },
    {
      id: 'bot-agendamento',
      category: 'web',
      icon: Clock,
      badge: 'Automação 24/7',
      title: 'Agendamento Online + Bot Inteligente de Atendimento 24 Horas',
      subtitle: 'Canal interativo ininterrupto no WhatsApp e site com triagem e confirmações anti-falta.',
      description: 'Módulo integrado de agendamento e atendimento via WhatsApp operando 24h por dia. O robô inteligente realiza triagem inicial de conveniência, esclarece dúvidas frequentes, envia orientações pré-consulta e dispara confirmações automáticas com lembretes para zerar faltas.',
      benefits: [
        'Atendimento e captura de leads fora do horário comercial (noites e finais de semana)',
        'Redução drástica no número de faltas (no-show) por esquecimento',
        'Sincronização em tempo real da agenda da recepção',
        'Zero sobrecarga para a equipe do consultório ou secretária'
      ]
    },
    {
      id: 'coleta-avaliacoes',
      category: 'google',
      icon: Star,
      badge: 'Prova Social & Reputação',
      title: 'Mecanismo Automatizado de Coleta de Avaliações 5 Estrelas',
      subtitle: 'Fluxo programado de pós-atendimento para aceleração contínua de provas sociais.',
      description: 'Sistema inteligente de disparos pós-consulta via mensagem que convida o paciente satisfeito a avaliar a clínica no Google Maps com apenas 2 cliques. É o combustível algorítmico necessário para ultrapassar os concorrentes locais no menor tempo.',
      benefits: [
        'Aumento constante na nota média e no número de avaliações 5 estrelas',
        'Fortalecimento imediato da reputação e autoridade da marca',
        'Sinal de relevância direta para o algoritmo do Google reordenar o mapa no topo',
        'Tratamento preventivo de feedbacks para preservação da imagem'
      ]
    },
    {
      id: 'whatsapp-business',
      category: 'web',
      icon: Smartphone,
      badge: 'Atendimento & Vendas',
      title: 'WhatsApp Business Profissional & Estruturado',
      subtitle: 'Padronização visual, catálogo de serviços e funil de atendimento para a recepção.',
      description: 'Arquitetura comercial completa para o WhatsApp oficial: catálogo de procedimentos com descrições detalhadas, respostas rápidas pré-configuradas para dúvidas comuns e fluxo de etiquetas para acompanhamento visual da jornada do cliente.',
      benefits: [
        'Elimina a perda de contatos por demora no atendimento',
        'Apresentação clara e padronizada de serviços e especialidades',
        'Organização do funil de atendimento da equipe da recepção',
        'Transição sem atrito do Google direto para a conversa'
      ]
    },
    {
      id: 'trafego-pago',
      category: 'growth',
      icon: TrendingUp,
      badge: 'Tração Imediata',
      title: 'Gestão Estratégica de Tráfego Pago (Google Ads & Meta Ads)',
      subtitle: 'Anúncios de alta intenção para captação de pacientes e clientes desde o primeiro dia.',
      description: 'Campanhas patrocinadas de alta precisão no Google Search e Redes Sociais. Foco nas palavras-chave mais buscadas da sua região, garantindo a atração imediata de pacientes qualificados enquanto o SEO orgânico se consolida no topo.',
      benefits: [
        'Resultados e entrada de novos agendamentos logo na primeira semana',
        'Segmentação geográfica precisa no raio de atuação da clínica',
        'Otimização contínua de custo por clique (CPC) e custo por lead (CPL)',
        'Relatórios de retorno sobre investimento (ROI) claros e mensuráveis'
      ]
    },
    {
      id: 'instagram-autoridade',
      category: 'growth',
      icon: Instagram,
      badge: 'Posicionamento de Marca',
      title: 'Gestão Estratégica de Redes Sociais & Instagram de Autoridade',
      subtitle: 'Linha editorial técnica orientada a converter seguidores em clientes de alto valor.',
      description: 'Planejamento e produção de conteúdos autorais sobre procedimentos, tratamentos e longevidade. Foco em educar a audiência local e construir uma percepção de autoridade clínica que estimula o desejo de agendamento.',
      benefits: [
        'Posicionamento de marca forte e profissional',
        'Transformação de seguidores passivos em clientes ativos',
        'Produção de pautas estratégicas direcionadas ao seu público-alvo',
        'Fortalecimento da marca pessoal do profissional/médico'
      ]
    },
    {
      id: 'sistema-gestao',
      category: 'web',
      icon: ShieldCheck,
      badge: 'Organização Operacional',
      title: 'Sistema Integrado de Gestão Clínica / Empresarial',
      subtitle: 'Prontuário eletrônico seguro, agenda centralizada e controle financeiro.',
      description: 'Solução robusta e intuitiva para a operação diária: prontuário eletrônico seguro, histórico do paciente, controle de consultas e relatórios gerenciais, eliminando planilhas manuais ou papéis vulneráveis.',
      benefits: [
        'Conformidade total com requisitos de segurança e LGPD',
        'Centralização do histórico de atendimento e evolução clínica',
        'Controle financeiro de consultas e faturamento da empresa',
        'Operação organizada e ágil para médicos, secretárias e gestores'
      ]
    },
    {
      id: 'treinamento-equipe',
      category: 'growth',
      icon: Users,
      badge: 'Capacitação Humana',
      title: 'Treinamento Operacional de Equipe & Recepção',
      subtitle: 'Capacitação da secretária para atendimento humanizado e conversão de leads.',
      description: 'Treinamento prático da secretária ou recepcionista da empresa. Ensina a operação do prontuário, acompanhamento do bot do WhatsApp e técnicas de acolhimento humanizado para converter contatos do Google em agendamentos firmados.',
      benefits: [
        'Garante que nenhum lead vindo da internet seja perdido no balcão',
        'Padronização da linguagem e do padrão de atendimento da clínica',
        'Domínio pleno das ferramentas tecnológicas pela equipe interna',
        'Melhoria na experiência e satisfação dos pacientes desde o primeiro contato'
      ]
    },
    {
      id: 'blindagem-continua',
      category: 'google',
      icon: Award,
      badge: 'Sustentação de Ranking',
      title: 'Gestão Contínua de Posicionamento & Blindagem de Ranking',
      subtitle: 'Auditorias quinzenais, proteção contra concorrência desleal e relatórios analíticos.',
      description: 'Acompanhamento constante das métricas de busca local. Auditorias técnicas quinzenais, combate a tentativas da concorrência de sugerir edições indevidas no seu perfil e ajustes no algoritmo para garantir que a empresa permaneça em 1º lugar.',
      benefits: [
        'Manutenção garantida do topo do mapa ao longo dos meses',
        'Monitoramento constante da movimentação dos concorrentes da região',
        'Relatórios gerenciais mensais de ligações, rotas e chats recebidos',
        'Assistência e suporte técnico contínuo direto com o consultor'
      ]
    }
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <section className="bg-gradient-to-r from-[#111622] via-[#161d2a] to-[#111622] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5a35]/10 blur-[130px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ClienteBox — Entregamos clientes como presente</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
              ECOSSISTEMA DIGITAL COMPLETO DE ALTA CONVERSÃO
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              O pacote tecnológico e estratégico que faz a sua clínica ou empresa nascer e se consolidar no topo do Google — com SEO Local, site responsivo, robô de atendimento 24h e marketing de precisão integrados.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onGoToOnboarding}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff5a35] to-[#ff7a55] hover:from-[#ff481f] hover:to-[#ff6842] text-white font-black px-6 py-3.5 rounded-xl shadow-lg shadow-[#ff5a35]/25 transition-all text-sm active:scale-95"
              >
                <span>Preencher Cadastro de Otimização</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onGoToDiagnostic}
                className="flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-300 font-extrabold border border-amber-500/30 px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Realizar Diagnóstico / Auditoria Grátis</span>
              </button>
            </div>
          </div>
        </section>

        {/* MISSÃO, VISÃO E VALORES CORPORATIVOS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-display">Nossa Missão</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminar a ociosidade operacional de clínicas e empresas locais, conectando-as a pacientes e clientes com alta intenção de compra no exato momento em que buscam pelo serviço no Google.
            </p>
          </div>

          <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-display">Nossa Visão</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ser a principal referência nacional em Engenharia de SEO Local no Google Maps, automação inteligente no WhatsApp e construção de reputação de autoridade na área de saúde e negócios.
            </p>
          </div>

          <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl w-fit border border-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-display">Nossos Valores</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transparência quantitativa, compromisso com resultados financeiros reais (LTV/ROI), ética absoluta nas diretrizes do Google e blindagem técnica contínua contra a concorrência.
            </p>
          </div>
        </section>

        {/* CATEGORY FILTER TABS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
                <Layers className="w-6 h-6 text-[#ff5a35]" />
                Nossos Serviços & Soluções do Ecossistema
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Conheça os 10 pilares estratégicos desenvolvidos pela ClienteBox para alavancar sua presença no mercado.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#161d2a] p-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
              {[
                { id: 'all', label: 'Todos os Serviços' },
                { id: 'google', label: 'Google & SEO Local' },
                { id: 'web', label: 'Site & Automação' },
                { id: 'growth', label: 'Tráfego & Crescimento' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#ff5a35] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* SERVICES GRID */}
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
                      <div className="p-3 bg-[#182030] text-amber-400 rounded-2xl border border-slate-700">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white font-display leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs text-amber-300 font-semibold mt-1">
                        {service.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Principais Benefícios para a Sua Empresa:
                      </span>
                      <ul className="space-y-1.5">
                        {service.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <button
                      onClick={onGoToOnboarding}
                      className="w-full flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-300 border border-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                    >
                      <span>Contratar este Serviço no Cadastro</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PROPOSAL CASE HIGHLIGHT / FOOTER CTA */}
        <section className="bg-gradient-to-r from-amber-950/40 via-[#182030] to-amber-950/40 p-8 sm:p-10 rounded-3xl border border-amber-500/30 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Pronto para ver a sua clínica ou negócio liderando no Google Maps?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Preencha a nossa ficha oficial de cadastro ou solicite um diagnóstico comercial gratuito com auditoria completa de presença local.
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
              <span>Fazer Diagnóstico Grátis</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
