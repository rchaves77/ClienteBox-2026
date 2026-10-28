import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronsDown,
  Cpu,
  Crown,
  FileCheck2,
  FileSpreadsheet,
  GitBranch,
  LayoutDashboard,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquareWarning,
  Moon,
  Navigation,
  NavigationOff,
  PhoneMissed,
  Radio,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Sun,
  X,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAdmin?: () => void;
  showToast?: (title: string, type?: 'success' | 'info' | 'error') => void;
  externalBriefingOpen?: boolean;
  setExternalBriefingOpen?: (open: boolean) => void;
}

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
  }
}

const NICHES = [
  { name: 'Advogados / Advocacia & Direito', demand: 190 },
  { name: 'Agentes Imobiliários / Corretores', demand: 175 },
  { name: 'Agrônomos / Engenharia Agronômica', demand: 120 },
  { name: 'Arquitetos / Arquitetura & Urbanismo', demand: 145 },
  { name: 'Assistentes Sociais', demand: 110 },
  { name: 'Auto Peças & Oficinas Mecânicas', demand: 310 },
  { name: 'Barbearias & Salões de Beleza', demand: 290 },
  { name: 'Biólogos / Biotecnologia', demand: 105 },
  { name: 'Biomedicina & Análises Clínicas', demand: 210 },
  { name: 'Contadores / Contabilidade & Fiscal', demand: 165 },
  { name: 'Corretores de Seguros', demand: 150 },
  { name: 'Dentistas / Odontologia & Ortodontia', demand: 280 },
  { name: 'Designers / Agências de Design', demand: 135 },
  { name: 'Economistas / Consultoria Financeira', demand: 140 },
  { name: 'Educadores Físicos / Academias & Personal', demand: 260 },
  { name: 'Enfermeiros / Cuidados de Saúde', demand: 170 },
  { name: 'Engenheiros Civis / Engenharia & Obras', demand: 160 },
  { name: 'Engenheiros Eletricistas', demand: 155 },
  { name: 'Estética & Cosmetologia', demand: 275 },
  { name: 'Farmacêuticos / Farmácias', demand: 340 },
  { name: 'Fisioterapeutas / Fisioterapia & Pilates', demand: 230 },
  { name: 'Fonoaudiólogos / Fonoaudiologia', demand: 165 },
  { name: 'Fotógrafos / Estúdios Fotográficos', demand: 150 },
  { name: 'Gastronomia / Restaurantes & Bares', demand: 420 },
  { name: 'Geólogos / Geologia', demand: 100 },
  { name: 'Médicos / Clínicas Médicas & Especiais', demand: 320 },
  { name: 'Nutricionistas / Nutrição & Dieta', demand: 215 },
  { name: 'Oftalmologistas / Óticas', demand: 270 },
  { name: 'Outros Serviços / Comércio Local', demand: 240 },
  { name: 'Pediatras / Pediatria', demand: 250 },
  { name: 'Periodontistas', demand: 195 },
  { name: 'Personal Trainers / Consultoria Esportiva', demand: 200 },
  { name: 'Podólogos / Podologia', demand: 185 },
  { name: 'Psicanalistas', demand: 175 },
  { name: 'Psicólogos / Psicologia & Terapia', demand: 245 },
  { name: 'Psiquiatras / Saúde Mental', demand: 235 },
  { name: 'Publicitários / Marketing & Mídia', demand: 145 },
  { name: 'Radiologistas', demand: 190 },
  { name: 'Terapeutas Holísticos / Massoterapia', demand: 180 },
  { name: 'Terapeutas Ocupacionais', demand: 170 },
  { name: 'Tradutores & Intérpretes', demand: 115 },
  { name: 'Veterinários / Clínicas Pet & Petshops', demand: 310 },
];

const WHATSAPP_NUMBER = '5568981034408';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbglvwvr';
const USE_IMAGE_SEQUENCE = false; // Mude para true se adicionar /public/frames/frame_0001.webp a 0180.webp
const TOTAL_FRAMES = 180;

export default function LandingPage2026({
  onOpenAdmin,
  showToast,
  externalBriefingOpen,
  setExternalBriefingOpen,
}: LandingPageProps) {
  const scrollySectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estados do HUD 3D (180 frames)
  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [internalBriefingOpen, setInternalBriefingOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<boolean>(false);
  const [fontScale, setFontScale] = useState<number>(100);
  const [isSubmittingBriefing, setIsSubmittingBriefing] = useState<boolean>(false);

  const isBriefingOpen = externalBriefingOpen !== undefined ? externalBriefingOpen : internalBriefingOpen;
  const setIsBriefingOpen = (val: boolean) => {
    setInternalBriefingOpen(val);
    if (setExternalBriefingOpen) setExternalBriefingOpen(val);
  };

  // Estados da Calculadora Interativa (#diagnostico)
  const [companyName, setCompanyName] = useState<string>('');
  const [city, setCity] = useState<string>('Rio Branco - AC');
  const [selectedNicheIndex, setSelectedNicheIndex] = useState<number>(11); // Odontologia padrão
  const [reviews, setReviews] = useState<number>(18);
  const [ticket, setTicket] = useState<number>(350);

  // Estados do Modal de Briefing Oficial (10 Campos)
  const [bf, setBf] = useState({
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: 'Atendimento Presencial Físico (Na Sede)',
    c6: '',
    c7: '',
    c8: '',
    c9: '',
    c10: '',
  });

  // Cálculos em tempo real da Calculadora de Perdas
  const currentNiche = NICHES[selectedNicheIndex] || NICHES[11];
  const authorityFactor = Math.max(0.18, 1 - reviews / 240);
  const lostRoutes = Math.max(12, Math.round(currentNiche.demand * authorityFactor * 0.58));
  const lostLeads = Math.max(4, Math.round(lostRoutes * 0.33));
  const lostClients = Math.max(2, Math.round(lostLeads * 0.35));
  const lostMonthlyRevenue = lostClients * ticket;
  const lostAnnualRevenue = lostMonthlyRevenue * 12;
  const visibilityScore = Math.min(94, Math.max(14, Math.round(100 - authorityFactor * 78)));
  const clientsToBreakEven = Math.max(1, Math.ceil(700 / ticket));

  const diagnosticWhatsAppUrl = () => {
    const text = [
      `Olá Rômulo! Fiz o Auto-Diagnóstico de Perdas na *ClienteBox*:`,
      `• *Empresa:* ${companyName.trim() || 'Minha Empresa'} (${city.trim() || 'Brasil'})`,
      `• *Nicho:* ${currentNiche.name}`,
      `• *Avaliações Atuais:* ${reviews} reviews`,
      `• *Ticket Médio:* R$ ${ticket}`,
      `• *Rotas Waze/Maps Perdidas:* ${lostRoutes}/mês`,
      `• *Faturamento Desviado:* ${lostMonthlyRevenue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}/mês`,
      `Quero destravar meu perfil e assumir o Top #1 do Google Maps!`,
    ].join('\n');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleBriefingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBriefing(true);

    const mappedTipoAtendimento:
      | 'Físico (Sede Própria)'
      | 'Atendimento em Domicílio / Área de Cobertura'
      | 'Ambos (Atendimento Físico e Domicílio)' =
      bf.c5 === 'Atendimento Presencial Físico (Na Sede)'
        ? 'Físico (Sede Própria)'
        : bf.c5 === 'Atendimento em Domicílio / Área de Cobertura'
        ? 'Atendimento em Domicílio / Área de Cobertura'
        : 'Ambos (Atendimento Físico e Domicílio)';

    const formDataObj = {
      nomeEmpresa: bf.c1,
      responsavelNomeCargo: bf.c2,
      telefoneWhatsapp: bf.c3,
      categoriaAtuacao: bf.c4,
      tipoAtendimento: mappedTipoAtendimento,
      enderecoPontoReferencia: bf.c6,
      horarioFuncionamento: bf.c7 || 'Segunda a Sexta: 08:00 às 18:00',
      siteInstagram: bf.c8,
      servicosProdutosVender: bf.c9,
      diferenciaisEmpresa: bf.c10,
    };

    const submissionRecord = {
      id: `sub_${Date.now()}`,
      nomeEmpresa: bf.c1,
      responsavelNome: bf.c2,
      responsavelTelefone: bf.c3,
      niches: [bf.c4],
      dadosCompletos: formDataObj,
      criadoEm: new Date().toISOString(),
    };

    // 1. Salva no LocalStorage do Painel Admin e dispara eventos reativos
    try {
      const storedList = JSON.parse(localStorage.getItem('clientebox_completed_submissions') || '[]');
      storedList.unshift(submissionRecord);
      localStorage.setItem('clientebox_completed_submissions', JSON.stringify(storedList.slice(0, 100)));
      window.dispatchEvent(new Event('onboarding_submission_added'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Aviso ao salvar ficha localmente:', err);
    }

    // 2. Envia cópia para o backend e Formspree sem bloquear abertura do WhatsApp
    try {
      fetch('/api/onboarding-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionRecord),
      }).catch(() => {});

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          'Nome Oficial da Empresa': bf.c1,
          'Nome do Responsável e Cargo': bf.c2,
          'Telefone / WhatsApp': bf.c3,
          'Ramo / Categoria Principal': bf.c4,
          'Tipo de Atendimento': bf.c5,
          'Endereço e Ponto de Referência': bf.c6 || 'Não informado',
          'Horário de Funcionamento': bf.c7 || 'Não informado',
          'Site / Instagram': bf.c8 || 'Não informado',
          'Principais Serviços / Produtos': bf.c9,
          'Diferenciais da Empresa': bf.c10 || 'Não informado',
        }),
      }).catch(() => {});
    } catch {
      // ignora erro de rede secundário
    }

    const msg = [
      '📋 *FICHA OFICIAL DE BRIEFING - CLIENTEBOX*',
      '-----------------------------------------',
      `*1. Nome Oficial no Google:* ${bf.c1}`,
      `*2. Responsável e Cargo:* ${bf.c2}`,
      `*3. WhatsApp de Atendimento:* ${bf.c3}`,
      `*4. Ramo / Categoria Principal:* ${bf.c4}`,
      `*5. Tipo de Atendimento:* ${bf.c5}`,
      `*6. Endereço e Referência:* ${bf.c6 || 'Não informado'}`,
      `*7. Horário de Funcionamento:* ${bf.c7 || 'Não informado'}`,
      `*8. Site / Instagram / Cardápio:* ${bf.c8 || 'Não informado'}`,
      `*9. Serviços que Mais Deseja Vender:* ${bf.c9}`,
      `*10. Diferenciais da Empresa:* ${bf.c10 || 'Não informado'}`,
      '-----------------------------------------',
      'Solicito início do alinhamento de SEO Local e blindagem no Google Maps.',
    ].join('\n');

    setIsSubmittingBriefing(false);
    setIsBriefingOpen(false);
    if (showToast) {
      showToast('Ficha de Briefing salva no painel e pronta para envio no WhatsApp!', 'success');
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Motor Frame a Frame no Scroll (GSAP ScrollTrigger + HTML5 Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = scrollySectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const playhead = { frame: 1 };

    // Preload se USE_IMAGE_SEQUENCE = true
    const loadedImages: HTMLImageElement[] = [];
    if (USE_IMAGE_SEQUENCE) {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/frames/frame_${String(i).padStart(4, '0')}.webp`;
        loadedImages.push(img);
      }
    }

    const particles = Array.from({ length: 45 }, (_, i) => ({
      progress: i / 45,
      speed: 0.0035 + (i % 5) * 0.0008,
      lane: i % 3,
      offset: Math.sin(i * 12.3) * 28,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const isoProject = (
      x: number,
      y: number,
      z: number,
      zoom: number,
      pitch: number,
      cw: number,
      ch: number
    ) => ({
      x: cw / 2 + (x - y) * Math.cos(0.46) * zoom,
      y: ch * 0.38 + (x + y) * Math.sin(0.46) * pitch * zoom - z * zoom,
    });

    const render = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const frame = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(playhead.frame)));

      if (
        USE_IMAGE_SEQUENCE &&
        loadedImages[frame - 1]?.complete &&
        loadedImages[frame - 1]?.naturalWidth > 0
      ) {
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(loadedImages[frame - 1], 0, 0, cw, ch);
      } else {
        ctx.fillStyle = '#050507';
        ctx.fillRect(0, 0, cw, ch);

        const pStage2 = Math.max(0, Math.min(1, (frame - 60) / 62));
        const pStage3 = Math.max(0, Math.min(1, (frame - 122) / 58));
        const zoom = 1 + Math.sin(pStage2 * Math.PI) * 0.22 + pStage3 * 0.14;
        const pitch = 0.82 - pStage2 * 0.12 + pStage3 * 0.08;

        const gridRange = 7;
        const step = Math.min(cw, ch) * 0.068;
        ctx.lineWidth = 1;

        // 1. Malha Urbana Isométrica 3D
        for (let i = -gridRange; i <= gridRange; i++) {
          const p1 = isoProject(i * step, -gridRange * step, 0, zoom, pitch, cw, ch);
          const p2 = isoProject(i * step, gridRange * step, 0, zoom, pitch, cw, ch);
          ctx.strokeStyle = pStage3 > 0.2 ? 'rgba(16, 185, 129, 0.16)' : 'rgba(255, 255, 255, 0.06)';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          const q1 = isoProject(-gridRange * step, i * step, 0, zoom, pitch, cw, ch);
          const q2 = isoProject(gridRange * step, i * step, 0, zoom, pitch, cw, ch);
          ctx.beginPath();
          ctx.moveTo(q1.x, q1.y);
          ctx.lineTo(q2.x, q2.y);
          ctx.stroke();
        }

        const centerBase = isoProject(0, 0, 0, zoom, pitch, cw, ch);

        // 2. Onda de Choque EXIF GPS (Estágio 2)
        if (frame >= 61 && frame <= 135) {
          const waveProgress = ((frame - 61) % 32) / 32;
          const maxRadius = Math.min(cw, ch) * 0.36 * zoom;
          const radius = waveProgress * maxRadius;
          ctx.save();
          ctx.strokeStyle = `rgba(6, 182, 212, ${1 - waveProgress})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(centerBase.x, centerBase.y, radius, radius * 0.52, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Segunda onda harmônica EXIF
          const wave2 = ((frame - 45) % 32) / 32;
          ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - wave2) * 0.75})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(
            centerBase.x,
            centerBase.y,
            wave2 * maxRadius,
            wave2 * maxRadius * 0.52,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }

        const competitors = [
          { x: -2.2 * step, y: -1.5 * step, label: 'Concorrente A' },
          { x: 2.3 * step, y: -1.6 * step, label: 'Concorrente B' },
          { x: 1.55 * step, y: 1.65 * step, label: 'Concorrente C' },
        ];

        // 3. Partículas de Clientes Locais
        particles.forEach((pt) => {
          pt.progress = (pt.progress + pt.speed) % 1;
          const t = pt.progress;
          const comp = competitors[pt.lane];
          const spawnX = (pt.lane === 0 ? -4.2 : pt.lane === 1 ? 4.2 : -3.2) * step;
          const spawnY = (pt.lane === 0 ? 3.0 : pt.lane === 1 ? 2.8 : -3.8) * step;

          const targetX = comp.x * (1 - pStage3);
          const targetY = comp.y * (1 - pStage3);

          const curX = spawnX + (targetX - spawnX) * t + Math.sin(t * Math.PI) * pt.offset;
          const curY = spawnY + (targetY - spawnY) * t + Math.cos(t * Math.PI) * pt.offset;
          const pos = isoProject(curX, curY, 4, zoom, pitch, cw, ch);

          ctx.beginPath();
          if (pStage3 > 0.35) {
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
          } else if (pStage2 > 0.3) {
            ctx.fillStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
          } else {
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
          }
          ctx.shadowBlur = 10;
          ctx.arc(pos.x, pos.y, 3.5 * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 4. Pinos dos Concorrentes
        competitors.forEach((comp) => {
          const cPos = isoProject(comp.x, comp.y, 16 * (1 - pStage3 * 0.5), zoom, pitch, cw, ch);
          ctx.fillStyle = pStage3 > 0.5 ? 'rgba(113, 113, 122, 0.45)' : 'rgba(239, 68, 68, 0.85)';
          ctx.beginPath();
          ctx.arc(cPos.x, cPos.y, 7 * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = `600 ${Math.round(11 * zoom)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = pStage3 > 0.5 ? 'rgba(161, 161, 170, 0.5)' : 'rgba(252, 165, 165, 0.9)';
          ctx.textAlign = 'center';
          ctx.fillText(comp.label, cPos.x, cPos.y - 14 * zoom);
        });

        // 5. Pino Central da Sua Empresa (Sobe em 3D no Estágio 3)
        const elevation3D = pStage3 * 62 + pStage2 * 14;
        const pinTop = isoProject(0, 0, elevation3D, zoom, pitch, cw, ch);

        const gradPillar = ctx.createLinearGradient(centerBase.x, centerBase.y, pinTop.x, pinTop.y);
        if (pStage3 > 0.2) {
          gradPillar.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
          gradPillar.addColorStop(1, 'rgba(16, 185, 129, 0.9)');
        } else {
          gradPillar.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
          gradPillar.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
        }
        ctx.strokeStyle = gradPillar;
        ctx.lineWidth = (6 + pStage3 * 8) * zoom;
        ctx.beginPath();
        ctx.moveTo(centerBase.x, centerBase.y);
        ctx.lineTo(pinTop.x, pinTop.y);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = pStage3 > 0.25 ? '#10b981' : pStage2 > 0.2 ? '#06b6d4' : '#52525b';
        ctx.shadowColor = pStage3 > 0.25 ? '#10b981' : '#06b6d4';
        ctx.shadowBlur = pStage3 > 0.25 ? 30 : 8;
        ctx.arc(pinTop.x, pinTop.y, (10 + pStage3 * 8) * zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.font = `700 ${Math.round(13 * zoom)}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle =
          pStage3 > 0.3 ? '#34d399' : pStage2 > 0.2 ? '#67e8f9' : 'rgba(161, 161, 170, 0.8)';
        ctx.fillText(
          pStage3 > 0.3
            ? '★ SUA EMPRESA — TOP #1 GOOGLE MAPS'
            : pStage2 > 0.2
            ? '⚡ CALIBRANDO EXIF GPS & UTMs...'
            : 'SUA EMPRESA (PINO INVISÍVEL)',
          pinTop.x,
          pinTop.y - 22 * zoom
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Configura GSAP ScrollTrigger se disponível no window
    let stInstance: any;
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      stInstance = window.gsap.to(playhead, {
        frame: TOTAL_FRAMES,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: '+=3000',
          scrub: 0.4,
        },
        onUpdate: () => setCurrentFrame(Math.round(playhead.frame)),
      });
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (stInstance?.scrollTrigger) stInstance.scrollTrigger.kill();
    };
  }, []);

  const surfaceCard = lightMode
    ? 'bg-white/85 border-black/10 text-[#1d1d1f] shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
    : 'bg-[#101218]/75 border-white/10 text-[#f5f5f7] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]';

  const mutedText = lightMode ? 'text-zinc-600' : 'text-zinc-400';
  const secondaryText = lightMode ? 'text-zinc-700' : 'text-zinc-300';

  return (
    <div
      style={{ fontSize: `${fontScale}%` }}
      className={`${
        lightMode ? 'bg-[#f5f5f7] text-[#1d1d1f]' : 'bg-[#050507] text-[#f5f5f7]'
      } min-h-screen transition-colors duration-300 overflow-x-hidden`}
    >
      {/* =====================================================================
           BARRA DE NAVEGAÇÃO ESPACIAL (APPLE GLASSMORPHISM + ACESSIBILIDADE)
      ====================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl transition-all duration-300 border-b ${
          lightMode ? 'bg-[#f5f5f7]/85 border-black/10' : 'bg-[#050507]/80 border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Oficial com Fallback Inteligente */}
          <a href="#inicio" className="flex items-center gap-3 group focus:outline-none shrink-0">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-white/15 flex items-center justify-center overflow-hidden shadow-lg">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="ClienteBox Logo Oficial"
                  className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 text-black font-extrabold text-lg tracking-tighter">
                  CB
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight leading-none">ClienteBox</span>
              <span className={`text-[11px] ${mutedText} font-medium tracking-wider uppercase mt-0.5`}>
                Gestão & Inteligência Local
              </span>
            </div>
          </a>

          {/* Links Centrais (Desktop) */}
          <nav className={`hidden lg:flex items-center gap-7 text-sm font-medium ${secondaryText}`}>
            <a href="#inicio" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Início
            </a>
            <a href="#scrolly-engine" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Simulação 3D
            </a>
            <a href="#diagnostico" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Diagnóstico de Perdas
            </a>
            <a href="#metodo" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Serviços & Método
            </a>
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              Cadastro / Briefing
            </button>
          </nav>

          {/* Controles de Acessibilidade, Tema & Área Restrita */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className={`hidden sm:flex items-center border rounded-lg p-1 text-xs font-mono ${
                lightMode ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
              }`}
            >
              <button
                onClick={() => setFontScale((s) => Math.max(85, s - 6))}
                className="px-2 py-1 hover:bg-emerald-500/20 rounded transition"
                title="Diminuir Fonte"
              >
                A-
              </button>
              <button
                onClick={() => setFontScale(100)}
                className={`px-2 py-1 ${mutedText} hover:text-emerald-400 transition`}
                title="Tamanho Padrão"
              >
                {fontScale}%
              </button>
              <button
                onClick={() => setFontScale((s) => Math.min(125, s + 6))}
                className="px-2 py-1 hover:bg-emerald-500/20 rounded transition"
                title="Aumentar Fonte"
              >
                A+
              </button>
            </div>

            <button
              onClick={() => setLightMode(!lightMode)}
              className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium ${
                lightMode
                  ? 'bg-black/5 hover:bg-black/10 border-black/10 text-zinc-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
              }`}
              title="Alternar Tema Claro/Escuro"
            >
              {lightMode ? (
                <>
                  <Moon className="w-4 h-4 text-emerald-600" />
                  <span className="hidden xl:inline">Tema Escuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline">Tema Claro</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenAdmin}
              className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-sm whitespace-nowrap ${
                lightMode
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Área Restrita</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl border ${
                lightMode ? 'bg-black/5 border-black/10 text-zinc-800' : 'bg-white/5 border-white/10 text-zinc-200'
              }`}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-6 py-5 space-y-4 backdrop-blur-2xl ${
              lightMode ? 'bg-white/95 border-black/10' : 'bg-[#0b0d13]/95 border-white/10'
            }`}
          >
            <div className="flex flex-col space-y-3 text-sm font-medium">
              <a
                href="#inicio"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-400"
              >
                Início
              </a>
              <a
                href="#scrolly-engine"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-400"
              >
                Simulação 3D de Rotas
              </a>
              <a
                href="#diagnostico"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-400"
              >
                Auto-Diagnóstico de Perdas
              </a>
              <a
                href="#metodo"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-emerald-400"
              >
                Os 4 Pilares & Oferta
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBriefingOpen(true);
                }}
                className="text-left py-1.5 text-emerald-400 font-semibold"
              >
                📋 Preencher Briefing Oficial (10 Campos)
              </button>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className={`text-xs ${mutedText}`}>Acessibilidade:</span>
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setFontScale((s) => Math.max(85, s - 6))}
                  className="px-2.5 py-1 bg-emerald-500/15 rounded"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontScale(100)}
                  className="px-2.5 py-1 bg-emerald-500/15 rounded"
                >
                  {fontScale}%
                </button>
                <button
                  onClick={() => setFontScale((s) => Math.min(125, s + 6))}
                  className="px-2.5 py-1 bg-emerald-500/15 rounded"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
           DOBRA 1: HERO IMERSIVO ESTILO APPLE PRO
      ====================================================================== */}
      <section id="inicio" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute rounded-full blur-[110px] pointer-events-none z-0 w-[500px] h-[500px] bg-emerald-500/15 -top-32 left-1/2 -translate-x-1/2" />
        <div className="absolute rounded-full blur-[110px] pointer-events-none z-0 w-[400px] h-[400px] bg-cyan-500/10 top-40 right-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Kicker Superior */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md mb-8">
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-emerald-400">
              Acelerador de Presença Local & Google Business Profile
            </span>
          </div>

          <p className={`text-xs sm:text-sm font-mono uppercase tracking-[0.25em] ${mutedText} mb-4`}>
            DESTRAVAMENTO DE ROTAS & LIGAÇÕES NO GOOGLE MAPS
          </p>
          <h1
            className={`font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.06] max-w-5xl mx-auto mb-6 ${
              lightMode
                ? 'text-zinc-900'
                : 'bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent'
            }`}
          >
            Enquanto o seu pino está invisível, o seu concorrente recebe a rota.
          </h1>
          <p className={`text-base sm:text-xl ${mutedText} max-w-3xl mx-auto font-normal leading-relaxed mb-10`}>
            Auditamos, reestruturamos e otimizamos o perfil de negócios da sua empresa no Google para converter
            buscas imediatas de clientes locais em{' '}
            <strong className={lightMode ? 'text-zinc-900 font-semibold' : 'text-white font-semibold'}>
              rotas GPS no Waze/Maps
            </strong>{' '}
            e <strong className="text-emerald-400 font-semibold">chamadas rastreadas no WhatsApp</strong>.
          </p>

          {/* CTAs Principais */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-base shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.65)] transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
            >
              <span>📋 Preencher Briefing do Meu Negócio</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <a
              href="#diagnostico"
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl border backdrop-blur-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2.5 ${surfaceCard} hover:border-emerald-500/40`}
            >
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>Auto-Diagnóstico de Perdas</span>
            </a>
          </div>

          {/* 4 Selos Rápidos de Autoridade */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-12">
            <div
              className={`rounded-xl px-4 py-3 border backdrop-blur-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${surfaceCard}`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sem Mensalidade Obrigatória</span>
            </div>
            <div
              className={`rounded-xl px-4 py-3 border backdrop-blur-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${surfaceCard}`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Relatório PDF A4 Executivo</span>
            </div>
            <div
              className={`rounded-xl px-4 py-3 border backdrop-blur-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${surfaceCard}`}
            >
              <GitBranch className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rastreamento UTM WhatsApp</span>
            </div>
            <div
              className={`rounded-xl px-4 py-3 border backdrop-blur-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium ${surfaceCard}`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Blindagem contra Concorrentes</span>
            </div>
          </div>

          {/* Indicador de Scroll para o Motor 3D */}
          <div className={`inline-flex flex-col items-center gap-2 ${mutedText} text-xs font-mono uppercase tracking-widest`}>
            <span>Role para visualizar o diagnóstico 3D de rotas em tempo real</span>
            <ChevronsDown className="w-5 h-5 text-emerald-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* =====================================================================
           1. SIMULAÇÃO 3D INTERATIVA NO SCROLL (GSAP ScrollTrigger + HTML5 Canvas)
      ====================================================================== */}
      <section
        ref={scrollySectionRef}
        id="scrolly-engine"
        className="relative w-full h-screen overflow-hidden bg-[#050507] text-white select-none border-y border-white/10"
      >
        {/* Canvas 3D Fullscreen */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

        {/* Vinheta Espacial Apple */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_38%,transparent_30%,rgba(5,5,7,0.85)_100%)]" />

        {/* HUD Superior Compacto: Status Comercial e Contador em Tempo Real (Sem vazar no meio da tela) */}
        <div className="absolute top-[5.25rem] left-3 right-3 sm:left-8 sm:right-8 z-20 flex items-center justify-between gap-2 pointer-events-none max-w-7xl mx-auto">
          {/* Selo de Auditoria Territorial */}
          <div className="backdrop-blur-xl bg-[#101218]/75 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-2.5 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  currentFrame <= 60 ? 'bg-red-400' : currentFrame <= 122 ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  currentFrame <= 60 ? 'bg-red-500' : currentFrame <= 122 ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
              />
            </span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-300 font-semibold">
              Radar Google Maps
            </span>
            {currentFrame <= 60 ? (
              <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/30">
                Estágio 1 • Invisibilidade Local
              </span>
            ) : currentFrame <= 122 ? (
              <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Estágio 2 • Varredura EXIF GPS
              </span>
            ) : (
              <span className="hidden md:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Estágio 3 • Top #1 Google Maps
              </span>
            )}
          </div>

          {/* Contador de Perdas / Captura Compacto */}
          <div className="backdrop-blur-xl bg-[#101218]/75 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 flex items-center gap-2.5 transition-all duration-300">
            <div className="flex flex-col text-right">
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                {currentFrame <= 60
                  ? 'Evasão em Tempo Real no Bairro'
                  : currentFrame <= 122
                  ? 'Calibragem Geográfica'
                  : 'Tráfego Local Recuperado'}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-zinc-200">
                {currentFrame <= 60
                  ? 'Rotas indo p/ concorrentes:'
                  : currentFrame <= 122
                  ? 'Auditando 3 Gargalos:'
                  : 'Rotas convergindo p/ você:'}
              </span>
            </div>
            <div
              className={`font-mono font-extrabold text-sm sm:text-lg px-2.5 py-0.5 rounded-lg border tabular-nums ${
                currentFrame <= 60
                  ? 'text-red-400 bg-red-500/10 border-red-500/25'
                  : currentFrame <= 122
                  ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'
                  : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              {currentFrame <= 60
                ? `+${14 + Math.floor(currentFrame * 0.45)}`
                : currentFrame <= 122
                ? 'EXIF'
                : `+${18 + Math.floor((currentFrame - 122) * 1.1)}`}
            </div>
          </div>
        </div>

        {/* OVERLAY ESTÁGIO 1: Pino Invisível & Desvio de Clientes (Compacto na base) */}
        {currentFrame <= 60 && (
          <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 sm:bottom-5 z-20 max-w-4xl mx-auto pointer-events-none">
            <div className="backdrop-blur-xl bg-[#101218]/80 px-4 py-3.5 sm:px-6 sm:py-4 rounded-2xl border border-red-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-mono text-[10px] sm:text-xs uppercase">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Estágio 01 • Diagnóstico de Evasão Local</span>
                </div>
                <h2 className="font-bold text-base sm:text-xl text-white leading-snug">
                  O cliente não avisa que não te encontrou. Ele clica em &ldquo;Rotas&rdquo; no concorrente.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                  As partículas vermelhas acima representam buscas reais no seu bairro sendo desviadas para
                  concorrentes enquanto o seu pino permanece sem autoridade algorítmica.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY ESTÁGIO 2: Onda EXIF GPS & Os 3 Gargalos Ocultos (Compacto na base) */}
        {currentFrame >= 61 && currentFrame <= 122 && (
          <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 sm:bottom-5 z-20 max-w-6xl mx-auto pointer-events-none">
            <div className="text-center mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] sm:text-xs uppercase shadow-lg">
                <Radio className="w-3 h-3 animate-spin" />
                <span>Estágio 02 • Disparo de Onda EXIF GPS & Diagnóstico dos 3 Gargalos Ocultos</span>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
              {/* Gargalo 1 */}
              <div className="backdrop-blur-xl bg-[#101218]/80 px-3.5 py-2.5 sm:p-4 rounded-xl border border-cyan-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-400">GARGALO 01</span>
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-xs sm:text-base text-white mb-0.5">1. Inércia Algorítmica</h3>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-snug">
                  Sem metadados georreferenciados EXIF constantes, o Google reduz a entrega de rotas para a sua
                  ficha.
                </p>
              </div>
              {/* Gargalo 2 */}
              <div className="backdrop-blur-xl bg-[#101218]/80 px-3.5 py-2.5 sm:p-4 rounded-xl border border-cyan-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-400">GARGALO 02</span>
                  <NavigationOff className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-xs sm:text-base text-white mb-0.5">2. Desvio de Rotas no Bairro</h3>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-snug">
                  Concorrentes com categorias primárias e secundárias calibradas capturam os clientes do seu raio.
                </p>
              </div>
              {/* Gargalo 3 */}
              <div className="backdrop-blur-xl bg-[#101218]/80 px-3.5 py-2.5 sm:p-4 rounded-xl border border-cyan-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-cyan-400">GARGALO 03</span>
                  <MessageSquareWarning className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-xs sm:text-base text-white mb-0.5">3. WhatsApp Sem Rastreio</h3>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-snug">
                  Links sem parametrização UTM impedem rastrear exatamente quantos clientes vieram do Google Maps.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY ESTÁGIO 3: Top #1 Google Maps & Rotas Verde-Esmeralda (Compacto na base) */}
        {currentFrame >= 123 && (
          <div className="absolute inset-x-3 sm:inset-x-6 bottom-3 sm:bottom-5 z-20 max-w-4xl mx-auto pointer-events-none">
            <div className="backdrop-blur-xl bg-[#101218]/80 px-4 py-3.5 sm:px-6 sm:py-4 rounded-2xl border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] sm:text-xs uppercase">
                  <Crown className="w-3 h-3" />
                  <span>Estágio 03 • Dominância Territorial Top #1</span>
                </div>
                <h2 className="font-bold text-base sm:text-xl text-white leading-snug">
                  Protocolo ClienteBox Ativado: Todas as rotas convergem para você.
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                  O pino da sua empresa se eleva ao <strong className="text-emerald-400">Top #1 do Google Maps</strong>,
                  convertendo as buscas do bairro em rotas Waze/Maps e chamadas no WhatsApp.
                </p>
              </div>
              <div className="pointer-events-auto shrink-0">
                <button
                  onClick={() => setIsBriefingOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <span>Destravar Meu Perfil Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barra de Progresso Inferior da Simulação */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-30">
          <div
            style={{ width: `${(currentFrame / TOTAL_FRAMES) * 100}%` }}
            className="h-full bg-gradient-to-r from-red-500 via-cyan-400 to-emerald-400 transition-all duration-75"
          />
        </div>
      </section>

      {/* =====================================================================
           3. CALCULADORA INTERATIVA DE AUTO-DIAGNÓSTICO DE PERDAS (#diagnostico)
      ====================================================================== */}
      <section id="diagnostico" className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute rounded-full blur-[110px] pointer-events-none z-0 w-[450px] h-[450px] bg-emerald-500/10 top-1/3 left-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Cabeçalho da Seção */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
              <Activity className="w-4 h-4" />
              <span>Ferramenta de Auto-Diagnóstico Gratuito</span>
            </div>
            <h2 className="font-extrabold text-3xl sm:text-5xl tracking-tight mb-4">
              Descubra Quantos Clientes Sua Empresa Está Perdendo no Google Maps
            </h2>
            <p className={`${mutedText} text-base sm:text-lg`}>
              Insira os dados do seu negócio e deslize os controles abaixo para calcular em tempo real o
              faturamento desviado para concorrentes do seu bairro.
            </p>
          </div>

          {/* Grid Calculadora Interativa */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Coluna Esquerda: Controles & 42 Nichos Originais */}
            <div className={`lg:col-span-7 border backdrop-blur-2xl rounded-3xl p-6 sm:p-10 flex flex-col justify-between ${surfaceCard}`}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-xs font-mono uppercase tracking-wider ${mutedText} mb-2`}>
                      Nome da Sua Empresa / Marca *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Clínica Odonto Prime"
                      className={`w-full px-4 py-3.5 rounded-xl border focus:border-emerald-500 focus:outline-none text-sm font-medium transition ${
                        lightMode ? 'bg-black/[0.03] border-black/15 text-zinc-900' : 'bg-white/[0.04] border-white/10 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-mono uppercase tracking-wider ${mutedText} mb-2`}>
                      Cidade / Estado (Brasil)
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Rio Branco - AC"
                      className={`w-full px-4 py-3.5 rounded-xl border focus:border-emerald-500 focus:outline-none text-sm font-medium transition ${
                        lightMode ? 'bg-black/[0.03] border-black/15 text-zinc-900' : 'bg-white/[0.04] border-white/10 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Lista Completa de 42 Nichos Liberais e Comerciais Originais */}
                <div>
                  <label className={`block text-xs font-mono uppercase tracking-wider ${mutedText} mb-2`}>
                    Nicho / Profissões Liberais & Comércio Local
                  </label>
                  <select
                    value={selectedNicheIndex}
                    onChange={(e) => setSelectedNicheIndex(Number(e.target.value))}
                    className={`w-full px-4 py-3.5 rounded-xl border focus:border-emerald-500 focus:outline-none text-sm font-medium transition ${
                      lightMode ? 'bg-white border-black/15 text-zinc-900' : 'bg-zinc-900 border-white/15 text-white'
                    }`}
                  >
                    {NICHES.map((niche, idx) => (
                      <option key={niche.name} value={idx}>
                        {niche.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slider 1: Número de Avaliações no Google (Reviews) */}
                <div
                  className={`p-5 rounded-2xl border ${
                    lightMode ? 'bg-black/[0.02] border-black/10' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <label htmlFor="calc-reviews" className="text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Número Atual de Avaliações no Google (Reviews)</span>
                    </label>
                    <span className="font-mono font-bold text-base sm:text-lg text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap tabular-nums">
                      {reviews} avaliações
                    </span>
                  </div>
                  <input
                    id="calc-reviews"
                    type="range"
                    min={0}
                    max={300}
                    step={1}
                    value={reviews}
                    onChange={(e) => setReviews(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg"
                  />
                  <div className={`flex justify-between text-[11px] font-mono ${mutedText} mt-2`}>
                    <span>0 (Invisível)</span>
                    <span>75 (Média Local)</span>
                    <span>150+</span>
                    <span>300+ (Dominante)</span>
                  </div>
                </div>

                {/* Slider 2: Ticket Médio do Serviço (R$) */}
                <div
                  className={`p-5 rounded-2xl border ${
                    lightMode ? 'bg-black/[0.02] border-black/10' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <label htmlFor="calc-ticket" className="text-sm font-semibold flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Ticket Médio por Cliente / Serviço (R$)</span>
                    </label>
                    <span className="font-mono font-bold text-base sm:text-lg text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap tabular-nums">
                      {ticket.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <input
                    id="calc-ticket"
                    type="range"
                    min={50}
                    max={5000}
                    step={25}
                    value={ticket}
                    onChange={(e) => setTicket(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg"
                  />
                  <div className={`flex justify-between text-[11px] font-mono ${mutedText} mt-2`}>
                    <span>R$ 50</span>
                    <span>R$ 1.000</span>
                    <span>R$ 2.500</span>
                    <span>R$ 5.000</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs ${mutedText}`}>
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                  Cálculo baseado em CTR de SEO Local (Top 3 Pack vs. Posição #8+)
                </span>
                <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                  Score de Presença: {visibilityScore}/100
                </span>
              </div>
            </div>

            {/* Coluna Direita: Painel de Resultados em Tempo Real */}
            <div
              className={`lg:col-span-5 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-red-500/30 flex flex-col justify-between relative overflow-hidden ${surfaceCard}`}
            >
              <div className="absolute rounded-full blur-[90px] pointer-events-none w-64 h-64 bg-red-500/15 -top-10 -right-10" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-xs uppercase font-semibold">
                    Relatório de Evasão Local
                  </span>
                  <span className={`font-mono text-xs ${mutedText} truncate max-w-[160px]`}>
                    {currentNiche.name.split('/')[0].trim()}
                  </span>
                </div>

                <p className={`text-xs font-mono uppercase tracking-wider ${mutedText} mb-1`}>
                  Faturamento Desviado para Concorrentes / Mês:
                </p>
                <div className="font-extrabold text-4xl sm:text-5xl text-red-400 tracking-tight mb-2 tabular-nums">
                  {lostMonthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <p className={`text-xs ${mutedText} mb-6`}>
                  Estimativa anual de perda acumulada:{' '}
                  <strong className={`${lightMode ? 'text-zinc-900' : 'text-white'} font-mono tabular-nums`}>
                    {lostAnnualRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/ano
                  </strong>
                </p>

                {/* Métricas Secundárias */}
                <div className="grid grid-cols-2 gap-3.5 mb-6">
                  <div
                    className={`p-4 rounded-2xl border ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.04] border-white/10'
                    }`}
                  >
                    <div className={`flex items-center gap-2 text-xs ${mutedText} mb-1`}>
                      <Navigation className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Rotas Waze/Maps Perdidas</span>
                    </div>
                    <div className="font-mono font-bold text-2xl tabular-nums">
                      {lostRoutes} <span className={`text-xs font-normal ${mutedText}`}>/mês</span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.04] border-white/10'
                    }`}
                  >
                    <div className={`flex items-center gap-2 text-xs ${mutedText} mb-1`}>
                      <PhoneMissed className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Chamadas WhatsApp Perdidas</span>
                    </div>
                    <div className="font-mono font-bold text-2xl tabular-nums">
                      {lostLeads} <span className={`text-xs font-normal ${mutedText}`}>/mês</span>
                    </div>
                  </div>
                </div>

                {/* Diagnóstico Técnico Dinâmico */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 mb-6">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className={`text-xs sm:text-sm ${secondaryText} leading-relaxed`}>
                      Recuperando apenas <strong>{clientsToBreakEven} cliente(s)</strong> através do protocolo
                      ClienteBox, o investimento único de R$ 700,00 já é 100% pago.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão WhatsApp com Resumo Preenchido Automaticamente */}
              <div className="relative z-10 space-y-3">
                <a
                  href={diagnosticWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
                >
                  <span>🔥 Diagnosticar Meu Perfil no Google Agora</span>
                  <Send className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsBriefingOpen(true)}
                  className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold transition ${
                    lightMode
                      ? 'bg-black/5 hover:bg-black/10 border-black/10 text-zinc-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                  }`}
                >
                  Ou preencha a Ficha Oficial de Briefing (10 Campos) →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
           O EFEITO PONTO DE VIRADA (PROVA SOCIAL + GRÁFICO DE TRAÇÃO +40%)
      ====================================================================== */}
      <section className="py-20 sm:py-28 border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Texto & Case Real Dr. Jucelino Castro */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase">
                <span>O Efeito Ponto de Virada</span>
              </div>
              <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">
                De dias intercalados a um fluxo contínuo de contatos locais.
              </h2>
              <p className={`${mutedText} text-base leading-relaxed`}>
                Antes da intervenção técnica da ClienteBox, os perfis enfrentam altas oscilações algorítmicas. Com
                o protocolo de correção primária, imagens georreferenciadas EXIF e UTMs no WhatsApp, a relevância
                territorial do perfil é destravada.
              </p>

              {/* Card Depoimento */}
              <div className={`p-6 sm:p-8 rounded-3xl border border-emerald-500/30 ${surfaceCard}`}>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <blockquote className={`text-sm sm:text-base ${secondaryText} italic leading-relaxed mb-5`}>
                  &ldquo;Em menos de 15 dias após os ajustes de georreferenciamento e links de atendimento,
                  registramos um aumento de 40% no envio de rotas para o consultório. É o investimento de maior ROI
                  na história da clínica.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
                    JC
                  </div>
                  <div>
                    <div className="font-bold text-sm">Dr. Jucelino Castro</div>
                    <div className="text-xs text-emerald-400">JC Fisioterapia Especializada</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico Visual de Tração (+40% Rotas/Dia) */}
            <div className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border ${surfaceCard}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-bold text-lg">Histórico de Tráfego Local (Rotas/Dia)</h3>
                  <p className={`text-xs ${mutedText}`}>
                    Mês Anterior (Inércia) vs. Após Otimização ClienteBox
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-sm tabular-nums">
                  +40% de Tração
                </span>
              </div>

              {/* Barras Comparativas */}
              <div className="h-56 flex items-end justify-between gap-2 sm:gap-3 pt-8 pb-2 px-2 border-b border-white/10">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-zinc-700/60 rounded-t-lg h-16" />
                  <span className="text-[10px] font-mono text-zinc-500">Sem 1</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-zinc-700/60 rounded-t-lg h-12" />
                  <span className="text-[10px] font-mono text-zinc-500">Sem 2</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-amber-500/60 rounded-t-lg h-24 relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-400 whitespace-nowrap">
                      Intervenção
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">Setup</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-emerald-500/70 rounded-t-lg h-32" />
                  <span className="text-[10px] font-mono text-emerald-400">Sem 3</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-emerald-500/85 rounded-t-lg h-40" />
                  <span className="text-[10px] font-mono text-emerald-400">Sem 4</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg h-44 shadow-[0_0_25px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-mono font-bold text-emerald-400">Top #1</span>
                </div>
              </div>

              <div className={`flex flex-wrap items-center justify-between gap-2 text-xs ${mutedText} mt-4`}>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" /> Antes (Inércia Algorítmica)
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Após Otimização (Tração Contínua)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
           4. CARD EXECUTIVO VERIFICADO (RÔMULO CHAVES DA SILVA)
           (Sem botão "Alterar Foto" - Design Executivo Limpo & Verificado)
      ====================================================================== */}
      <section id="especialista" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className={`rounded-3xl p-8 sm:p-12 border border-emerald-500/30 relative overflow-hidden ${surfaceCard}`}
          >
            <div className="absolute rounded-full blur-[110px] pointer-events-none w-80 h-80 bg-emerald-500/15 -bottom-20 -right-20" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              {/* Foto Executiva & Insígnia Verificada (Sem botão Alterar Foto) */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-40 h-48 sm:w-44 sm:h-52 rounded-3xl bg-gradient-to-b from-emerald-500/30 via-zinc-900 to-cyan-500/20 p-1 border-2 border-emerald-400/50 shadow-[0_20px_50px_rgba(16,185,129,0.2)] mb-4">
                  <div className="w-full h-full rounded-[20px] bg-white flex items-end justify-center relative overflow-hidden">
                    <img
                      src="/romulo.jpg"
                      alt="Rômulo Chaves da Silva — Especialista em SEO Local"
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="absolute -bottom-2.5 -right-2.5 px-3 py-1 rounded-full bg-emerald-500 text-black font-bold text-xs flex items-center gap-1 shadow-lg">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Verificado</span>
                  </div>
                </div>

                <h3 className="font-bold text-xl">Rômulo Chaves da Silva</h3>
                <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider mt-0.5">
                  Especialista em SEO Local & Engenharia de Sistemas
                </p>
                <div
                  className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs ${
                    lightMode ? 'bg-black/5 border-black/10 text-zinc-700' : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auditorias Exclusivas • Máx. 8 Empresas/Mês</span>
                </div>
              </div>

              {/* Declaração de Autoridade & Compromisso */}
              <div className="md:col-span-8 space-y-5">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono uppercase ${
                    lightMode ? 'bg-black/5 border-black/10 text-zinc-700' : 'bg-white/5 border-white/10 text-zinc-300'
                  }`}
                >
                  <span>Atendimento Direto & Sem Intermediários</span>
                </div>

                <h2 className="font-bold text-2xl sm:text-3xl leading-snug">
                  &ldquo;Eu não terceirizo a inteligência estratégica da sua empresa para robôs ou
                  estagiários.&rdquo;
                </h2>

                <p className={`${secondaryText} text-base leading-relaxed`}>
                  Quem audita o seu perfil no Google Business Profile, mapeia a malha de concorrentes do seu
                  bairro, injeta os metadados geográficos EXIF e cria o plano de blindagem algorítmica{' '}
                  <strong className={lightMode ? 'text-zinc-900' : 'text-white'}>sou eu pessoalmente</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Exclusividade Territorial</div>
                      <div className={`text-xs ${mutedText} mt-0.5`}>
                        Apenas 8 empresas por mês para evitar conflito de interesse no mesmo raio local.
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">Entrega Executiva A4</div>
                      <div className={`text-xs ${mutedText} mt-0.5`}>
                        Relatório técnico de 6 páginas comprovando a parametrização e métricas reais.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
           OS 4 PILARES DO MÉTODO CLIENTEBOX & OFERTA DE TAXA ÚNICA (R$ 700)
      ====================================================================== */}
      <section id="metodo" className="py-20 sm:py-28 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho 4 Pilares */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Protocolo de Execução
            </span>
            <h2 className="font-extrabold text-3xl sm:text-5xl tracking-tight mt-2 mb-4">
              Os 4 Pilares do Método ClienteBox
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            <div className={`p-7 rounded-3xl border hover:border-emerald-500/40 transition group ${surfaceCard}`}>
              <div className="font-mono font-bold text-3xl text-emerald-400/50 group-hover:text-emerald-400 transition mb-4">
                01
              </div>
              <h3 className="font-bold text-xl mb-2">Auditoria de Categoria</h3>
              <p className={`text-sm ${mutedText} leading-relaxed`}>
                Correção precisa das categorias primárias e secundárias para alinhar seu perfil aos termos de
                maior volume de busca imediata no bairro.
              </p>
            </div>

            <div className={`p-7 rounded-3xl border hover:border-emerald-500/40 transition group ${surfaceCard}`}>
              <div className="font-mono font-bold text-3xl text-emerald-400/50 group-hover:text-emerald-400 transition mb-4">
                02
              </div>
              <h3 className="font-bold text-xl mb-2">UTMs no WhatsApp</h3>
              <p className={`text-sm ${mutedText} leading-relaxed`}>
                Parametrização completa de links rastreáveis para você saber exatamente quantas vendas e mensagens
                vieram do Google Maps.
              </p>
            </div>

            <div className={`p-7 rounded-3xl border hover:border-emerald-500/40 transition group ${surfaceCard}`}>
              <div className="font-mono font-bold text-3xl text-emerald-400/50 group-hover:text-emerald-400 transition mb-4">
                03
              </div>
              <h3 className="font-bold text-xl mb-2">Georreferenciamento</h3>
              <p className={`text-sm ${mutedText} leading-relaxed`}>
                Imagens com metadados geográficos EXIF GPS da sua sede enviadas ao servidor do Google para
                fortalecer autoridade territorial.
              </p>
            </div>

            <div className={`p-7 rounded-3xl border hover:border-emerald-500/40 transition group ${surfaceCard}`}>
              <div className="font-mono font-bold text-3xl text-emerald-400/50 group-hover:text-emerald-400 transition mb-4">
                04
              </div>
              <h3 className="font-bold text-xl mb-2">Blindagem Algorítmica</h3>
              <p className={`text-sm ${mutedText} leading-relaxed`}>
                Monitoramento preventivo contra edições maliciosas (&ldquo;sugerir uma edição&rdquo;) e alteração
                de endereços/telefones por concorrentes.
              </p>
            </div>
          </div>

          {/* Card Oferta de Entrada - Taxa Única R$ 700,00 */}
          <div
            className={`max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/40 shadow-[0_0_70px_rgba(16,185,129,0.15)] ${surfaceCard}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs uppercase font-semibold">
                  Oferta de Entrada — Taxa Única
                </span>
                <h3 className="font-extrabold text-3xl sm:text-4xl">Aceleração Total do Perfil</h3>
                <p className={`${mutedText} text-sm sm:text-base`}>
                  Tudo o que a sua empresa precisa para assumir o Top #1 do mapa local, sem fidelidade ou
                  mensalidade obrigatória.
                </p>

                <div className="space-y-3 pt-3">
                  <div
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-sm ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Auditoria e Correção de Categorias Primária e Secundária</span>
                    </span>
                    <span className={`font-mono ${mutedText} line-through text-xs shrink-0`}>R$ 600</span>
                  </div>
                  <div
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-sm ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Parametrização de UTM WhatsApp & Links Rápidos</span>
                    </span>
                    <span className={`font-mono ${mutedText} line-through text-xs shrink-0`}>R$ 500</span>
                  </div>
                  <div
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-sm ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Upload de Fotos Georreferenciadas com Meta-Tags EXIF</span>
                    </span>
                    <span className={`font-mono ${mutedText} line-through text-xs shrink-0`}>R$ 800</span>
                  </div>
                  <div
                    className={`flex items-center justify-between gap-2 p-3 rounded-xl border text-sm ${
                      lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Relatório Executivo Oficial de 6 Páginas A4 em PDF</span>
                    </span>
                    <span className={`font-mono ${mutedText} line-through text-xs shrink-0`}>R$ 1.000</span>
                  </div>
                </div>
              </div>

              {/* Box Preço e Ação */}
              <div
                className={`lg:col-span-5 p-6 sm:p-8 rounded-2xl border text-center space-y-4 ${
                  lightMode ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.04] border-white/10'
                }`}
              >
                <div className={`text-xs font-mono ${mutedText}`}>
                  Valor Total Combinado: <span className="line-through text-red-400">R$ 2.900,00</span>
                </div>
                <div className="font-extrabold text-4xl sm:text-5xl text-emerald-400 tabular-nums">R$ 700,00</div>
                <div
                  className={`text-xs font-mono uppercase tracking-wider py-1.5 rounded-lg ${
                    lightMode ? 'bg-black/5 text-zinc-700' : 'bg-white/5 text-zinc-300'
                  }`}
                >
                  Taxa Única • Sem Mensalidade Obrigatória
                </div>
                <p className={`text-xs ${mutedText}`}>
                  ROI comprovado logo nos primeiros clientes locais atendidos.
                </p>
                <button
                  onClick={() => setIsBriefingOpen(true)}
                  className="w-full py-4 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>📋 Preencher Briefing (10 Campos)</span>
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    'Olá Rômulo! Quero garantir uma das 8 vagas mensais de Aceleração Total da ClienteBox (Taxa Única R$ 700).'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    lightMode
                      ? 'bg-black/5 hover:bg-black/10 border-black/10 text-zinc-800'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Falar Direto pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
           FAQ: DÚVIDAS FREQUENTES SOBRE A GESTÃO
      ====================================================================== */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Dúvidas Frequentes
            </span>
            <h2 className="font-bold text-3xl sm:text-4xl mt-2">Perguntas Frequentes sobre a Gestão</h2>
          </div>

          <div className="space-y-4">
            <details className={`rounded-2xl p-6 border group ${surfaceCard}`} open>
              <summary className="font-bold text-base sm:text-lg cursor-pointer flex items-center justify-between list-none gap-4">
                <span>Em quanto tempo vejo os primeiros resultados no meu perfil do Google?</span>
                <ChevronDown className="w-5 h-5 text-emerald-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className={`text-sm ${mutedText} mt-3 leading-relaxed`}>
                Muitas empresas destravam as primeiras solicitações de rotas e contatos via WhatsApp nas primeiras
                48 a 72 horas após as correções técnicas de categoria, imagens georreferenciadas EXIF e links de
                comunicação direta.
              </p>
            </details>

            <details className={`rounded-2xl p-6 border group ${surfaceCard}`}>
              <summary className="font-bold text-base sm:text-lg cursor-pointer flex items-center justify-between list-none gap-4">
                <span>Preciso pagar mensalidade obrigatória para manter a otimização?</span>
                <ChevronDown className="w-5 h-5 text-emerald-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className={`text-sm ${mutedText} mt-3 leading-relaxed`}>
                Não. O protocolo de Aceleração Total (R$ 700) é uma taxa única de engenharia e reestruturação
                completa. Toda a propriedade intelectual e as otimizações permanecem na conta oficial da sua
                empresa.
              </p>
            </details>

            <details className={`rounded-2xl p-6 border group ${surfaceCard}`}>
              <summary className="font-bold text-base sm:text-lg cursor-pointer flex items-center justify-between list-none gap-4">
                <span>Como sei que as mensagens e ligações estão vindo especificamente do Google Maps?</span>
                <ChevronDown className="w-5 h-5 text-emerald-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className={`text-sm ${mutedText} mt-3 leading-relaxed`}>
                Implementamos parâmetros de rastreio UTM exclusivos no botão de WhatsApp e site da sua ficha, além
                de entregar o Relatório Executivo A4 com a telemetria auditada diretamente da API do Google
                Business Profile.
              </p>
            </details>

            <details className={`rounded-2xl p-6 border group ${surfaceCard}`}>
              <summary className="font-bold text-base sm:text-lg cursor-pointer flex items-center justify-between list-none gap-4">
                <span>O que acontece se um concorrente tentar mudar o meu endereço ou horário no Google?</span>
                <ChevronDown className="w-5 h-5 text-emerald-400 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className={`text-sm ${mutedText} mt-3 leading-relaxed`}>
                O Pilar 04 (Blindagem Algorítmica) trava a consistência de NAP (Nome, Endereço e Telefone) com
                sinais cruzados e metadados GPS, impedindo que sugestões maliciosas de terceiros derrubem seu pino.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* =====================================================================
           RODAPÉ OFICIAL + ACESSO À ÁREA DE GESTÃO DE CLIENTES
      ====================================================================== */}
      <footer
        className={`border-t py-12 ${
          lightMode ? 'bg-zinc-200/70 border-black/10' : 'bg-[#030305] border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm overflow-hidden">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="ClienteBox"
                  className="w-full h-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              ) : (
                'CB'
              )}
            </div>
            <div>
              <div className="font-bold text-sm">ClienteBox — Gestão & Inteligência Local</div>
              <div className={`text-xs ${mutedText}`}>
                © 2026 ClienteBox. Desenvolvido por Rômulo Chaves da Silva. Todos os direitos reservados.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsBriefingOpen(true)}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Abrir Briefing Oficial (10 Campos)
            </button>
            <button
              onClick={onOpenAdmin}
              className={`px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                lightMode
                  ? 'bg-black/5 hover:bg-black/10 border-black/10 text-zinc-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acessar Área de Gestão de Clientes</span>
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
           4. MODAL / DRAWER LIMPO: BRIEFING OFICIAL DE 10 CAMPOS -> WHATSAPP & ADMIN
      ====================================================================== */}
      {isBriefingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#0d1017] text-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 border border-emerald-500/30 relative shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                  Ficha Oficial de Otimização & Briefing
                </span>
                <h3 className="font-extrabold text-2xl sm:text-3xl text-white mt-1">
                  Briefing para o Google Meu Negócio
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Preencha os 10 campos estratégicos abaixo para darmos início ao alinhamento de SEO Local e
                  blindagem do seu perfil.
                </p>
              </div>
              <button
                onClick={() => setIsBriefingOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBriefingSubmit} className="space-y-5 mt-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    1. Nome Oficial da Empresa (Como no Google) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bf.c1}
                    onChange={(e) => setBf({ ...bf, c1: e.target.value })}
                    placeholder="Ex: Clínica Integrada Vida"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    2. Nome do Responsável e Cargo *
                  </label>
                  <input
                    type="text"
                    required
                    value={bf.c2}
                    onChange={(e) => setBf({ ...bf, c2: e.target.value })}
                    placeholder="Ex: Dr. Carlos - Diretor Clínico"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    3. Telefone / WhatsApp de Atendimento *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bf.c3}
                    onChange={(e) => setBf({ ...bf, c3: e.target.value })}
                    placeholder="Ex: (68) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    4. Ramo / Categoria Principal no Google *
                  </label>
                  <input
                    type="text"
                    required
                    value={bf.c4}
                    onChange={(e) => setBf({ ...bf, c4: e.target.value })}
                    placeholder="Ex: Clínica Odontológica / Advocacia"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  5. Tipo de Atendimento Oferecido *
                </label>
                <select
                  value={bf.c5}
                  onChange={(e) => setBf({ ...bf, c5: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                >
                  <option value="Atendimento Presencial Físico (Na Sede)">
                    Atendimento Presencial Físico (Na Sede)
                  </option>
                  <option value="Atendimento em Domicílio / Área de Cobertura">
                    Atendimento em Domicílio / Área de Cobertura
                  </option>
                  <option value="Ambos (Sede Física + Domicílio / Cobertura)">
                    Ambos (Sede Física + Domicílio / Cobertura)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    6. Endereço Completo com Ponto de Referência
                  </label>
                  <input
                    type="text"
                    value={bf.c6}
                    onChange={(e) => setBf({ ...bf, c6: e.target.value })}
                    placeholder="Rua, Número, Bairro, Cidade e Referência"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    7. Horário de Funcionamento Exato
                  </label>
                  <input
                    type="text"
                    value={bf.c7}
                    onChange={(e) => setBf({ ...bf, c7: e.target.value })}
                    placeholder="Ex: Seg a Sex 08h às 18h, Sáb 08h às 12h"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  8. Site Oficial, Instagram ou Cardápio Digital
                </label>
                <input
                  type="text"
                  value={bf.c8}
                  onChange={(e) => setBf({ ...bf, c8: e.target.value })}
                  placeholder="Ex: @suaempresa ou www.suaempresa.com.br"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  9. Principais Serviços / Produtos que Mais Deseja Vender no Google *
                </label>
                <textarea
                  rows={2}
                  required
                  value={bf.c9}
                  onChange={(e) => setBf({ ...bf, c9: e.target.value })}
                  placeholder="Liste os serviços de maior margem ou procura..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  10. Diferenciais da Empresa e Pontos Fortes
                </label>
                <textarea
                  rows={2}
                  value={bf.c10}
                  onChange={(e) => setBf({ ...bf, c10: e.target.value })}
                  placeholder="Ex: Estacionamento próprio, atendimento 24h, equipamentos importados..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-emerald-500 focus:outline-none text-sm text-white"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Salvo no Painel Admin e enviado para o WhatsApp de Rômulo Chaves
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingBriefing}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
                >
                  <span>
                    {isSubmittingBriefing ? 'Processando...' : 'Enviar Ficha de Briefing Agora'}
                  </span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
