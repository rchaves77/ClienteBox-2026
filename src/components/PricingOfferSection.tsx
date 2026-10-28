import React from 'react';
import {
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Clock,
  BadgeCheck,
  FileText,
  DollarSign
} from 'lucide-react';

interface PricingOfferSectionProps {
  onOpenBriefing?: () => void;
  onWhatsApp?: () => void;
}

const deliverables = [
  { item: 'Auditoria e Correção de Categorias Primária e Secundária', valor: 'R$ 600' },
  { item: 'Parametrização de UTM WhatsApp & Links Rápidos', valor: 'R$ 500' },
  { item: 'Upload de Fotos Georreferenciadas com Meta-Tags EXIF GPS', valor: 'R$ 800' },
  { item: 'Relatório Executivo Oficial de 6 Páginas A4 em PDF', valor: 'R$ 1.000' },
  { item: 'Sistema de Avaliações Ativas ajustado para ranquear', valor: 'Incluso' }
];

export const PricingOfferSection: React.FC<PricingOfferSectionProps> = ({
  onOpenBriefing,
  onWhatsApp
}) => {
  const handleWhatsApp = onWhatsApp || (() => {
    window.open(
      `https://wa.me/5568981034408?text=${encodeURIComponent(
        'Olá Rômulo! Gostaria de fechar a Otimização Completa do Google Business Profile na taxa única de R$ 700.'
      )}`,
      '_blank'
    );
  });

  return (
    <section id="investimento" className="relative w-full bg-slate-50 dark:bg-[#060911] py-16 sm:py-24 overflow-hidden transition-colors">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 dark:bg-[#0d1322]/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl transition-all">
          
          {/* Badge */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest">
              <BadgeCheck className="w-3.5 h-3.5" />
              OFERTA ÚNICA · SEM MENSALIDADE OBRIGATÓRIA
            </span>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Otimização Completa do seu{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
              Google Business Profile
            </span>
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Valor único, sem fidelidade. Você investe uma vez e o seu perfil assume o topo do mapa local, blindado e pronto para atrair chamadas.
          </p>

          {/* Deliverables Stack */}
          <div className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-10">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block text-center mb-2">
              Stack de Entregáveis Inclusos no Pacote:
            </span>
            {deliverables.map((d) => (
              <div
                key={d.item}
                className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] rounded-xl px-4 py-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{d.item}</span>
                </div>
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 shrink-0 line-through">
                  {d.valor}
                </span>
              </div>
            ))}
          </div>

          {/* Price Box with Real vs Discount Comparison */}
          <div className="text-center bg-slate-100 dark:bg-black/30 rounded-2xl p-6 border border-slate-200 dark:border-white/[0.06] mb-6 sm:mb-8">
            <span className="text-slate-500 text-xs sm:text-sm font-mono block">
              Valor Total dos Entregáveis:{' '}
              <span className="line-through font-bold text-red-500/80">R$ 2.900,00</span>
            </span>

            <div className="flex items-end justify-center gap-2 mt-2">
              <span className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white">
                R$ 700
              </span>
              <span className="text-slate-500 text-xs sm:text-sm font-mono mb-2">
                (Taxa Única)
              </span>
            </div>

            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono mt-1">
              Economia imediata de R$ 2.200,00 · À vista no PIX por R$ 700 ou R$ 749 em até 12x
            </p>
          </div>

          {/* Guarantee */}
          <div className="flex items-start gap-3 sm:gap-4 bg-emerald-500/[0.07] border border-emerald-500/25 rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm mb-1">
                Garantia Incondicional de 60 Dias
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                Se o perfil não crescer em avaliações, visualizações e contatos, continuo trabalhando de graça até crescer. Sem devolução, mas sem parar.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>🔥 Garantir Otimização — R$ 700</span>
            </button>

            <button
              type="button"
              onClick={onOpenBriefing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-base px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-700 shadow-xl transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>📋 Preencher Briefing</span>
            </button>
          </div>

          {/* Trust Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 sm:mt-8 text-[10px] sm:text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Resultados em até 30 dias</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Especialista em Google Business Profile</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Sem fidelidade</span>
          </div>

        </div>
      </div>
    </section>
  );
};
