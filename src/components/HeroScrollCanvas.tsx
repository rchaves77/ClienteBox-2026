import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Navigation,
  ShieldCheck,
  FileText,
  Zap,
  Clock,
  ArrowRight,
  Radio,
  AlertTriangle,
  MessageCircle,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroScrollCanvasProps {
  onOpenDiagnostic: () => void;
  onOpenBriefing: () => void;
}

export const HeroScrollCanvas: React.FC<HeroScrollCanvasProps> = ({
  onOpenDiagnostic,
  onOpenBriefing
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lostCount, setLostCount] = useState(14);
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const [isLightMode, setIsLightMode] = useState(false);

  // Monitor theme changes on <html>
  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('theme-light'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Dynamic increment for lost clients in local radius
  useEffect(() => {
    const interval = setInterval(() => {
      setLostCount(prev => prev + 1);
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger setup (Scrubbed with smooth native propagation)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          setScrollProgress(self.progress);
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Canvas Procedural 3D Geo-Intelligence Radar & Map Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.02;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const p = scrollProgressRef.current; // 0.0 to 1.0
      const light = document.documentElement.classList.contains('theme-light');

      ctx.clearRect(0, 0, w, h);

      // 1. Spatial Background
      if (light) {
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, Math.max(w, h));
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(0.5, '#f8fafc');
        bgGrad.addColorStop(1, '#f1f5f9');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      } else {
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, Math.max(w, h));
        bgGrad.addColorStop(0, '#0d1629');
        bgGrad.addColorStop(0.5, '#070b14');
        bgGrad.addColorStop(1, '#04070d');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. Perspective Map Grid (Cyber-Geospatial Cartography)
      ctx.save();
      ctx.strokeStyle = light ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.09)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      const offsetX = (time * 10) % gridSize;
      const offsetY = (time * 8) % gridSize;
      for (let x = -gridSize; x <= w + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offsetX, 0);
        ctx.lineTo(x + offsetX, h);
        ctx.stroke();
      }
      for (let y = -gridSize; y <= h + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offsetY);
        ctx.lineTo(w, y + offsetY);
        ctx.stroke();
      }
      ctx.restore();

      // Coordinates Center (User's Business Coordinates)
      const centerX = w * 0.5;
      const centerY = h * 0.5;

      // 3. Stage-Dependent Visuals
      if (p <= 0.35) {
        // --- STAGE 1: Gargalo Oculto & Desvio de Rotas (Red/Amber Competitors) ---
        ctx.save();
        ctx.strokeStyle = light ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        const compAX = centerX + w * 0.22;
        const compAY = centerY - h * 0.14;
        const compBX = centerX - w * 0.24;
        const compBY = centerY + h * 0.16;

        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY - 60);
        ctx.quadraticCurveTo(centerX, centerY - 120, compAX, compAY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + 80, centerY + 80);
        ctx.quadraticCurveTo(centerX - 40, centerY + 140, compBX, compBY);
        ctx.stroke();
        ctx.restore();

        // Pulsing warning rings around competitor pins
        const ringPulse = (Math.sin(time * 3) + 1) * 15;
        ctx.beginPath();
        ctx.arc(compAX, compAY, 18 + ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(compAX, compAY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(compBX, compBY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Dormant Pin at Center
        ctx.fillStyle = light ? '#64748b' : '#475569';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Dim warning label
        ctx.fillStyle = light ? '#b91c1c' : '#f87171';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ DESVIO DE CLIENTES NO BAIRRO', centerX, centerY + 45);
      } else if (p >= 0.33 && p < 0.67) {
        // --- STAGE 2: Protocolo de Georreferenciamento & Autoridade Territorial ---
        const s2Progress = (p - 0.33) / 0.34;
        const radius = Math.min(w, h) * (0.2 + s2Progress * 0.35);

        // Concentric Expanding Radar Waves
        ctx.save();
        for (let r = 1; r <= 3; r++) {
          const waveRadius = (radius * (r / 3) + time * 20) % radius;
          ctx.beginPath();
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = light
            ? `rgba(16, 185, 129, ${0.35 * (1 - waveRadius / radius)})`
            : `rgba(16, 185, 129, ${0.45 * (1 - waveRadius / radius)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Radar Scanning Line Sweep
        const sweepAngle = time * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, sweepAngle, sweepAngle + 0.35);
        ctx.closePath();
        const sweepGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        sweepGrad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
        sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fill();
        ctx.restore();

        // Active Territory Center Core
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fill();

        // EXIF GPS Coordinates Floating Text
        ctx.fillStyle = light ? '#047857' : '#34d399';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`EXIF GPS: -09°58'29" S, -67°48'36" W [GEOHASH ACTIVE]`, centerX, centerY + 38);
      } else {
        // --- STAGE 3: Dominância Top #1 & Rotas Ativas ---
        // Converging Traffic Lines towards Center Pin
        ctx.save();
        const angles = [0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6];
        for (let i = 0; i < angles.length; i++) {
          const a = angles[i];
          const rx = centerX + Math.cos(a) * (Math.min(w, h) * 0.45);
          const ry = centerY + Math.sin(a) * (Math.min(w, h) * 0.45);

          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(centerX, centerY);
          ctx.strokeStyle = light ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Animated particle moving along route
          const arrowPos = (time * 1.5 + i * 0.25) % 1;
          const px = rx + (centerX - rx) * arrowPos;
          const py = ry + (centerY - ry) * arrowPos;
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Supreme #1 Pin
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = light ? 15 : 30;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Gold Trophy Badge
        ctx.fillStyle = light ? '#b45309' : '#fbbf24';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('👑 #1 TOP MAPS RANK', centerX, centerY - 28);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Helper to scroll smoothly between the stages
  const scrollToStage = (stageRatio: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const maxScroll = container.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + Math.max(0, maxScroll * stageRatio);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const pillarsData = [
    {
      id: 0,
      badge: '01',
      title: 'Fim da Inércia Algorítmica',
      desc: 'Correção de categorias primárias e secundárias ocultas para responder aos termos de alta intenção comercial no seu bairro.',
      tag: '✓ 100% Indexado no Core Google',
      iconColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      id: 1,
      badge: '02',
      title: 'Bloqueio do Desvio de Rotas',
      desc: 'Fotos da sua sede com tags EXIF GPS reais enviadas aos servidores para forçar autoridade no raio de 3km a 10km.',
      tag: '✓ Tráfego desviado recuperado',
      iconColor: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      id: 2,
      badge: '03',
      title: 'WhatsApp com Rastreio UTM',
      desc: 'Parametrização de links diretos no perfil. Você sabe exatamente qual cliente veio de busca no Maps ou Waze.',
      tag: '✓ ROI comprovado na ponta',
      iconColor: 'bg-purple-500/20 text-purple-400'
    }
  ];

  // Discrete, non-overlapping stage indicators
  const isStage1 = scrollProgress < 0.33;
  const isStage2 = scrollProgress >= 0.33 && scrollProgress < 0.67;
  const isStage3 = scrollProgress >= 0.67;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[220vh] md:min-h-[300vh] bg-slate-50 dark:bg-[#060911] transition-colors"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Sticky Canvas Container (Pinned Viewport with full scroll-through capability) */}
      <div
        className="sticky top-0 w-full h-[100dvh] min-h-[100dvh] overflow-hidden flex items-center justify-center"
        style={{ touchAction: 'pan-y' }}
      >
        {/* HTML5 Canvas Background (pointer-events-none ensures zero scroll capture) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block pointer-events-none"
        />

        {/* Ambient Top & Bottom Vignettes (Adaptive to theme) */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-[#060911] dark:via-[#060911]/80 pointer-events-none z-10 transition-colors" />
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-slate-50 via-slate-50/85 to-transparent dark:from-[#060911] dark:via-[#060911]/85 pointer-events-none z-10 transition-colors" />

        {/* =========================================================================
            STAGE 1: 0% to 33% (O GARGALO OCULTO & DESVIO DE ROTAS)
            ========================================================================= */}
        <div
          className={`absolute inset-0 pt-20 sm:pt-24 pb-6 px-4 flex flex-col items-center justify-center transition-all duration-300 ${
            isStage1
              ? 'opacity-100 scale-100 pointer-events-auto z-20 visible'
              : 'opacity-0 scale-95 pointer-events-none z-10 invisible'
          }`}
        >
          <div className="w-full max-w-4xl max-h-[calc(100dvh-6rem)] flex flex-col justify-center items-center my-auto space-y-3 sm:space-y-4 text-center py-2 overflow-y-auto">
            {/* Category / Scope Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-mono font-semibold tracking-wider shrink-0">
              <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>ESPECIALISTA EM GOOGLE BUSINESS PROFILE · RIO BRANCO/AC</span>
            </div>

            {/* Giant High-Impact Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-[1.1] shrink-0">
              APAREÇA NO TOP 1 DO{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
                GOOGLE MAPS
              </span>{' '}
              E RECEBA CLIENTES PRONTOS PARA CONTRATAR
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed shrink-0">
              Otimização completa do seu Google Business Profile em valor único, com garantia de 60 dias. Se o perfil não crescer em avaliações, visualizações e contatos, eu continuo trabalhando de graça até crescer.
            </p>

            {/* Real-time Lost Traffic Widget */}
            <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-white/95 dark:bg-[#0d1322]/90 backdrop-blur-xl border border-red-500/30 rounded-2xl px-4 py-2.5 sm:py-3 shadow-2xl shadow-red-500/10 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
              </div>
              <div className="text-[11px] sm:text-xs text-left">
                <span className="text-red-600 dark:text-red-300 font-extrabold uppercase tracking-wide block text-[10px]">
                  🚨 Estimativa de Perdas no Raio Local
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">
                  Clientes que clicaram em &quot;Rotas&quot; no seu concorrente hoje:{' '}
                  <strong className="text-red-500 dark:text-red-400 font-black text-xs sm:text-sm">+{lostCount}</strong>
                </span>
              </div>
            </div>

            {/* Interactive Scroll / Click Hint */}
            <div className="pt-1 sm:pt-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollToStage(0.5)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors cursor-pointer group"
              >
                <span>Role para baixo ou clique para ver a transformação</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 2: 34% to 66% (PROTOCOLO DE GEORREFERENCIAMENTO & 3 GARGALOS)
            ========================================================================= */}
        <div
          className={`absolute inset-0 pt-20 sm:pt-24 pb-6 px-4 flex flex-col items-center justify-center transition-all duration-300 ${
            isStage2
              ? 'opacity-100 scale-100 pointer-events-auto z-20 visible'
              : 'opacity-0 scale-95 pointer-events-none z-10 invisible'
          }`}
        >
          <div className="w-full max-w-5xl max-h-[calc(100dvh-6rem)] flex flex-col justify-center items-center my-auto space-y-3 sm:space-y-4 text-center py-2 overflow-y-auto">
            {/* Stage 2 Header */}
            <div className="space-y-1 sm:space-y-1.5 shrink-0">
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase inline-block">
                PROTOCOLO DE GEORREFERENCIAMENTO ATIVADO
              </span>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Os 3 Gargalos do Perfil Foram Resolvidos
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-xl mx-auto line-clamp-2 sm:line-clamp-none">
                Ao alimentar o algoritmo com metadados geoespaciais, os concorrentes perdem força e a sua sede se torna a escolha número 1 do bairro.
              </p>
            </div>

            {/* Mobile Tab Selectors (< 768px) */}
            <div className="flex md:hidden items-center justify-center gap-1.5 shrink-0 pointer-events-auto">
              {pillarsData.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMobileCard(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeMobileCard === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.badge}. {tab.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Mobile View: Single Compact Card */}
            <div className="block md:hidden w-full max-w-md pointer-events-auto shrink-0">
              <div className="bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 text-left shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl ${pillarsData[activeMobileCard].iconColor} flex items-center justify-center font-mono font-bold text-xs`}>
                    {pillarsData[activeMobileCard].badge}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {pillarsData[activeMobileCard].tag}
                  </span>
                </div>
                <h3 className="text-slate-900 dark:text-white font-extrabold text-sm sm:text-base mb-1">
                  {pillarsData[activeMobileCard].title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {pillarsData[activeMobileCard].desc}
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span>Toque nas abas acima para alternar os 3 pilares</span>
              </div>
            </div>

            {/* Desktop View: Full 3-Column Bento Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-3.5 lg:gap-4 w-full pointer-events-auto text-left shrink-0">
              {pillarsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/95 dark:bg-[#0d1322]/90 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] rounded-2xl p-4 lg:p-5 shadow-xl transition-all hover:border-emerald-500/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`w-8 h-8 rounded-xl ${item.iconColor} flex items-center justify-center font-mono font-bold text-xs`}>
                        {item.badge}
                      </div>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-extrabold text-sm lg:text-base mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage 2 navigation hint */}
            <div className="pt-1 shrink-0">
              <button
                type="button"
                onClick={() => scrollToStage(0.85)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors cursor-pointer group"
              >
                <span>Role para baixo ou clique para ver a Dominância Top #1</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STAGE 3: 67% to 100% (TOP #1 DO MAPA, NOTIFICAÇÕES & CTAs)
            ========================================================================= */}
        <div
          className={`absolute inset-0 pt-20 sm:pt-24 pb-6 px-4 flex flex-col items-center justify-center transition-all duration-300 ${
            isStage3
              ? 'opacity-100 scale-100 pointer-events-auto z-20 visible'
              : 'opacity-0 scale-95 pointer-events-none z-10 invisible'
          }`}
        >
          <div className="w-full max-w-4xl max-h-[calc(100dvh-6rem)] flex flex-col justify-center items-center my-auto space-y-3 sm:space-y-4 text-center py-2 overflow-y-auto">
            {/* Live Simulation Push Notifications */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pointer-events-auto shrink-0 w-full sm:w-auto">
              <div className="bg-white/95 dark:bg-[#0d1322]/95 border border-blue-500/40 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 text-left w-full sm:w-auto">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                  <Navigation className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px]">
                  <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 block font-bold">WAZE &bull; ROTA INICIADA</span>
                  <span className="text-slate-900 dark:text-white font-semibold">Cliente a 1,2 km traçando rota para sua sede</span>
                </div>
              </div>

              <div className="bg-white/95 dark:bg-[#0d1322]/95 border border-emerald-500/40 px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2.5 text-left w-full sm:w-auto">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px]">
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block font-bold">WHATSAPP UTM &bull; NOVO CONTATO</span>
                  <span className="text-slate-900 dark:text-white font-semibold">&quot;Olá! Vi no Maps e quero agendar hoje&quot;</span>
                </div>
              </div>
            </div>

            {/* Stage 3 Hero Title */}
            <div className="space-y-1 sm:space-y-1.5 shrink-0">
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] sm:text-xs font-bold tracking-widest uppercase inline-block">
                DOMINÂNCIA LOCAL CONQUISTADA
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Seu Negócio no Top #1 Absoluto das Buscas
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
                O cliente pesquisa pelo seu serviço no bairro e a sua empresa aparece em primeiro lugar com autoridade blindada e rotas instantâneas.
              </p>
            </div>

            {/* Direct High-Conversion Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1 pointer-events-auto shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>🔥 Diagnosticar Meu Perfil Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenBriefing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl sm:rounded-2xl border border-slate-700 shadow-xl transition-all cursor-pointer"
              >
                <span>📋 Preencher Briefing do Meu Negócio</span>
              </button>
            </div>

            {/* 4 Technical Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-3xl mx-auto pt-1 text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 pointer-events-auto shrink-0 w-full">
              <div className="bg-white/80 dark:bg-[#0b101c]/80 border border-slate-200 dark:border-white/[0.06] p-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Sem Mensalidade Obrigatória</span>
              </div>
              <div className="bg-white/80 dark:bg-[#0b101c]/80 border border-slate-200 dark:border-white/[0.06] p-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">Relatório PDF A4 Executivo</span>
              </div>
              <div className="bg-white/80 dark:bg-[#0b101c]/80 border border-slate-200 dark:border-white/[0.06] p-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Rastreamento UTM WhatsApp</span>
              </div>
              <div className="bg-white/80 dark:bg-[#0b101c]/80 border border-slate-200 dark:border-white/[0.06] p-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Blindagem contra Concorrência</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
