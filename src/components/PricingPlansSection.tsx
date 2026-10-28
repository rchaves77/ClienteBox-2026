import React from 'react';
import {
  Check,
  ShieldCheck,
  Gem,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

interface PricingPlansSectionProps {
  onOpenBriefing?: () => void;
  onWhatsApp?: (planName?: string) => void;
}

const plans = [
  {
    id: 'essencial',
    name: 'ESSENCIAL',
    price: 'R$ 700',
    period: 'valor único',
    tagline: 'Otimização inicial completa do seu perfil',
    features: [
      'Correção de nome, categoria e dados cadastrais',
      'Descrição completa com serviços e horários',
      'Telefone e link do WhatsApp sincronizados',
      '2 postagens estratégicas no perfil',
      'Sistema de avaliações ajustado para ranquear',
      'Acompanhamento por 30 dias',
      'Relatório comparativo de evolução'
    ],
    highlight: false,
    badge: null
  },
  {
    id: 'trimestral',
    name: 'TRIMESTRAL',
    price: 'R$ 950',
    period: 'valor único · 3 meses',
    tagline: 'Acompanhamento contínuo para consolidar posição',
    features: [
      'Tudo do Essencial',
      '3 meses de acompanhamento contínuo',
      'Análise de concorrentes no raio local',
      'Ajustes estratégicos de performance',
      'Novos conteúdos (postagens, atualizações, categorias)',
      'Fortalecimento com avaliações e diretórios',
      'Relatórios comparativos mensais'
    ],
    highlight: true,
    badge: 'MAIS ESCOLHIDO'
  },
  {
    id: 'semestral',
    name: 'SEMESTRAL',
    price: 'R$ 1.550',
    period: 'valor único · 6 meses',
    tagline: 'Crescimento consolidado e blindagem no mapa local',
    features: [
      'Tudo do Trimestral',
      '6 meses de acompanhamento contínuo',
      'Relatórios comparativos quinzenais',
      'Prioridade no atendimento e suporte direto',
      'Blindagem contra ações da concorrência',
      'Expansão contínua de autoridade territorial'
    ],
    highlight: false,
    badge: null
  }
];

export const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({
  onOpenBriefing,
  onWhatsApp
}) => {
  const handleSelectPlan = (planName: string) => {
    if (onWhatsApp) {
      onWhatsApp(planName);
    } else {
      const msg = `Olá Rômulo! Gostaria de contratar o plano ${planName} para acelerar e blindar o perfil da minha empresa no Google Maps.`;
      window.open(`https://wa.me/5568981034408?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  return (
    <section id="planos" className="relative w-full bg-slate-100 dark:bg-[#0b1220] py-16 sm:py-24 overflow-hidden transition-colors">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400 text-[10px] sm:text-xs font-mono font-bold tracking-wider">
            <Gem className="w-3.5 h-3.5" />
            INVESTIMENTO ÚNICO · SEM MENSALIDADE OBRIGATÓRIA
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Escolha o plano que{' '}
            <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 dark:from-teal-400 dark:via-emerald-300 dark:to-sky-400 bg-clip-text text-transparent">
              destrava seu perfil
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Valores únicos, sem fidelidade. Quem pesquisa no Google já tem intenção real de contratar — o plano certo coloca você na frente dessa busca.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-white dark:bg-gradient-to-b dark:from-teal-500/[0.12] dark:to-[#0d1322] border-2 border-teal-500 shadow-2xl shadow-teal-500/15 md:scale-[1.03]'
                  : 'bg-white dark:bg-[#0d1322]/90 border border-slate-200 dark:border-white/[0.08] hover:border-teal-500/40 shadow-xl'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg shadow-teal-500/30">
                  ⭐ {plan.badge}
                </span>
              )}

              <div className="mb-4 sm:mb-5">
                <h3 className="text-slate-900 dark:text-white font-black text-lg sm:text-xl tracking-wide">
                  {plan.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs mt-1">
                  {plan.tagline}
                </p>
              </div>

              <div className="mb-5 sm:mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-500 text-[10px] sm:text-xs font-mono mb-1.5">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                    <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                      plan.highlight ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black transition-all transform active:scale-95 cursor-pointer ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-xl shadow-teal-500/25 hover:from-teal-400 hover:to-emerald-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                }`}
              >
                <span>Quero o {plan.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Callouts: Garantia + Stack */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="flex items-start gap-3 sm:gap-4 bg-emerald-500/[0.07] border border-emerald-500/25 rounded-2xl p-4 sm:p-5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm mb-1">
                Garantia de 60 Dias ClienteBox
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                Se em 60 dias o perfil não crescer em avaliações, visualizações e contatos, continuo trabalhando de graça até crescer. Sem devolução, mas sem parar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:gap-4 bg-sky-500/[0.07] border border-sky-500/25 rounded-2xl p-4 sm:p-5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm mb-1">
                Valor real dos entregáveis
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                R$ 2.900 em serviços — você paga R$ 23,33 por dia (total 700,00). Um único cliente novo cobre 100% da otimização nos primeiros meses.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mt-8 sm:mt-10">
          <button
            type="button"
            onClick={() => handleSelectPlan('Essencial (R$ 700,00)')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>🔥 Garantir Minha Vaga — R$ 700,00</span>
          </button>

          <button
            type="button"
            onClick={onOpenBriefing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-base px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-700 shadow-xl transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>📋 Preencher Briefing do Meu Negócio</span>
          </button>
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 sm:mt-8 text-[10px] sm:text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-500" /> Resultados visíveis em 30 dias</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-teal-500" /> Especialista em Google Business Profile</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> Sem fidelidade</span>
        </div>

      </div>
    </section>
  );
};
