import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { HeroScrollCanvas } from './HeroScrollCanvas';
import { LossCalculator } from './LossCalculator';
import { MethodBentoGrid } from './MethodBentoGrid';
import { SocialProofSection } from './SocialProofSection';
import { SpecialistAuthority } from './SpecialistAuthority';
import { PricingOfferSection } from './PricingOfferSection';
import { PricingPlansSection } from './PricingPlansSection';
import { FaqSection } from './FaqSection';
import { BriefingModal } from './BriefingModal';
import { Footer } from './Footer';

interface InstitutionalViewProps {
  onAccessAdmin: () => void;
  showToast?: (title: string, type?: 'success' | 'info' | 'error') => void;
  isBriefingModalOpen?: boolean;
  setIsBriefingModalOpen?: (open: boolean) => void;
}

export const InstitutionalView: React.FC<InstitutionalViewProps> = ({ 
  onAccessAdmin, 
  showToast,
  isBriefingModalOpen: externalBriefingOpen,
  setIsBriefingModalOpen: externalSetBriefingOpen
}) => {
  const [internalBriefingOpen, setInternalBriefingOpen] = useState(false);

  const isModalOpen = externalBriefingOpen !== undefined ? externalBriefingOpen : internalBriefingOpen;
  const setModalOpen = externalSetBriefingOpen !== undefined ? externalSetBriefingOpen : setInternalBriefingOpen;

  const handleOpenBriefing = () => {
    setModalOpen(true);
  };

  const handleCloseBriefing = () => {
    setModalOpen(false);
  };

  const handleOpenDiagnostic = () => {
    const el = document.getElementById('diagnostico');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#060911] selection:bg-emerald-500 selection:text-slate-950 min-h-screen transition-colors">
      
      {/* 1. HERO SECTION + SCROLL-DRIVEN FRAME A FRAME (CANVAS + GSAP SCROLLTRIGGER 300VH) */}
      <HeroScrollCanvas 
        onOpenDiagnostic={handleOpenDiagnostic}
        onOpenBriefing={handleOpenBriefing}
      />

      {/* 2. FERRAMENTA INTERATIVA: CALCULADORA DE AUTO-DIAGNÓSTICO DE PERDAS (#diagnostico) */}
      <LossCalculator onOpenBriefing={handleOpenBriefing} />

      {/* 3. OS 4 PILARES DO MÉTODO CLIENTEBOX (#metodo) */}
      <MethodBentoGrid />

      {/* 4. PROVA SOCIAL & GRÁFICO "EFEITO PONTO DE VIRADA" (#resultados) */}
      <SocialProofSection />

      {/* 5. O ESPECIALISTA POR TRÁS DA ESTRATÉGIA (AUTORIDADE RÔMULO CHAVES) */}
      <SpecialistAuthority />

      {/* 5.5. PLANOS ESSENCIAL / TRIMESTRAL / SEMESTRAL */}
      <PricingPlansSection onOpenBriefing={handleOpenBriefing} />

      {/* 6. OFERTA DE ENTRADA & STACK DE VALOR (#investimento) */}
      <PricingOfferSection onOpenBriefing={handleOpenBriefing} />

      {/* 7. PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
      <FaqSection />

      {/* 8. FOOTER GEO-INTELLIGENCE */}
      <Footer 
        onOpenBriefing={handleOpenBriefing}
        onAccessAdmin={onAccessAdmin}
      />

      {/* 9. MODAL / DRAWER OFICIAL DE BRIEFING (10 CAMPOS) */}
      <BriefingModal 
        isOpen={isModalOpen}
        onClose={handleCloseBriefing}
        showToast={showToast}
      />

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/5568981034408?text=${encodeURIComponent(
          'Olá Rômulo! Estou no site da ClienteBox e gostaria de acelerar e blindar o perfil da minha empresa no Google Maps.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2 sm:gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/40 border border-emerald-300 transition-all transform hover:scale-105 active:scale-95"
        title="Conversar direto no WhatsApp: (68) 98103-4408"
      >
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-slate-950"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-slate-950" />
        <span className="text-xs font-mono font-bold tracking-tight pr-1 hidden sm:inline">
          WhatsApp Direto: (68) 98103-4408
        </span>
      </a>

    </div>
  );
};
