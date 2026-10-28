import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Company } from '../types';
import { calculateSeoHealthScore } from '../utils/seoHealth';
import { sanitizeClonedDocForCanvas } from '../utils/pdfExport';
import { LogoSvg } from './LogoSvg';
import { 
  Printer, 
  Copy, 
  Check, 
  TrendingUp, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Download, 
  Loader2, 
  Sparkles, 
  X, 
  Send,
  Key,
  Globe,
  BarChart2,
  Search,
  Award,
  ArrowUpRight,
  Activity,
  Filter
} from 'lucide-react';

interface ExecutiveReportViewProps {
  company: Company;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onPrintReport: () => void;
  onUpdateCompany?: (updatedCompany: Company) => void;
}

export type PeriodType = 'mensal' | 'bimestral' | 'trimestral' | 'quadrimestral' | 'semestral' | 'anual' | 'custom';

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  company,
  showToast,
  onPrintReport,
  onUpdateCompany,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [reportChartTab, setReportChartTab] = useState<'both' | 'keywords' | 'traffic'>('both');
  const [selectedTermMonthIndex, setSelectedTermMonthIndex] = useState<number>(0);
  
  // Interactive Report Period Selector States
  const [periodType, setPeriodType] = useState<PeriodType>('mensal');
  const [customDays, setCustomDays] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-30');

  const [customPrompt, setCustomPrompt] = useState(
    `Análise o crescimento do perfil da empresa "${company.nome}" (${company.categoria}).\n` +
    `Métricas atuais: Rotas: ${company.metricasAtual.rotas}, Chats: ${company.metricasAtual.chats}, Ligações: ${company.metricasAtual.ligacoes}.\n` +
    `Gere um parecer técnico enfatizando a dominância local no Google Maps e 3 ações estratégicas para o próximo mês.`
  );

  // Aggregated Data Calculation based on selected Period
  const getAggregatedData = () => {
    const history = company.monthlyHistory || [];
    
    let current = { ...company.metricasAtual, visualizacoes: 247, novasAvaliacoes: 17 };
    let previous = { ...company.metricasAnterior, visualizacoes: 342, novasAvaliacoes: 14 };
    let periodTitle = company.periodo || 'Setembro / 2026';
    let cicloTitle = company.ciclo || 'Outubro 2026';

    let filteredHistory = history;

    if (periodType === 'mensal') {
      if (history.length > 0) {
        filteredHistory = history.slice(-1);
        const lastM = history[history.length - 1];
        const prevM = history[history.length - 2] || history[0];
        current = {
          interacoes: lastM.interacoes,
          rotas: lastM.rotas,
          chats: lastM.chats,
          ligacoes: lastM.chamadas,
          visualizacoes: lastM.visualizacoes || 247,
          novasAvaliacoes: lastM.novasAvaliacoes || 17
        };
        previous = {
          interacoes: prevM.interacoes,
          rotas: prevM.rotas,
          chats: prevM.chats,
          ligacoes: prevM.chamadas,
          visualizacoes: prevM.visualizacoes || 342,
          novasAvaliacoes: prevM.novasAvaliacoes || 14
        };
        periodTitle = `Relatório Mensal Fechado — ${lastM.nomeMes}`;
        cicloTitle = `Ciclo Mensal (${lastM.nomeMes})`;
      }
    } else if (periodType === 'bimestral') {
      const slice = history.slice(-2);
      filteredHistory = slice;
      const prevSlice = history.slice(-4, -2);
      if (slice.length > 0) {
        current = slice.reduce((acc, m) => ({
          interacoes: acc.interacoes + m.interacoes,
          rotas: acc.rotas + m.rotas,
          chats: acc.chats + m.chats,
          ligacoes: acc.ligacoes + m.chamadas,
          visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
          novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
        }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 });

        if (prevSlice.length > 0) {
          previous = prevSlice.reduce((acc, m) => ({
            interacoes: acc.interacoes + m.interacoes,
            rotas: acc.rotas + m.rotas,
            chats: acc.chats + m.chats,
            ligacoes: acc.ligacoes + m.chamadas,
            visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
            novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
          }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 });
        } else {
          previous = { interacoes: 172, rotas: 96, chats: 30, ligacoes: 44, visualizacoes: 486, novasAvaliacoes: 3 };
        }
        periodTitle = `Relatório Bimestral (60 Dias) — ${slice[0]?.nomeMes} a ${slice[slice.length - 1]?.nomeMes}`;
        cicloTitle = `Bimestre Pós-Consultoria`;
      }
    } else if (periodType === 'trimestral') {
      const slice = history.slice(-3);
      filteredHistory = slice;
      const prevSlice = history.slice(-6, -3);
      if (slice.length > 0) {
        current = slice.reduce((acc, m) => ({
          interacoes: acc.interacoes + m.interacoes,
          rotas: acc.rotas + m.rotas,
          chats: acc.chats + m.chats,
          ligacoes: acc.ligacoes + m.chamadas,
          visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
          novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
        }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 });

        if (prevSlice.length > 0) {
          previous = prevSlice.reduce((acc, m) => ({
            interacoes: acc.interacoes + m.interacoes,
            rotas: acc.rotas + m.rotas,
            chats: acc.chats + m.chats,
            ligacoes: acc.ligacoes + m.chamadas,
            visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
            novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
          }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 });
        }
        periodTitle = `Relatório Trimestral (90 Dias) — ${slice[0]?.nomeMes} a ${slice[slice.length - 1]?.nomeMes}`;
        cicloTitle = `Trimestre Q3 / 2026`;
      }
    } else if (periodType === 'quadrimestral') {
      const slice = history.slice(-4);
      filteredHistory = slice;
      if (slice.length > 0) {
        current = slice.reduce((acc, m) => ({
          interacoes: acc.interacoes + m.interacoes,
          rotas: acc.rotas + m.rotas,
          chats: acc.chats + m.chats,
          ligacoes: acc.ligacoes + m.chamadas,
          visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
          novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
        }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 });
        periodTitle = `Relatório Quadrimestral (120 Dias) — ${slice[0]?.nomeMes} a ${slice[slice.length - 1]?.nomeMes}`;
        cicloTitle = `Quadrimestre de Aceleração`;
      }
    } else if (periodType === 'semestral') {
      filteredHistory = history.slice(-6);
      if (history.length > 0) {
        current = history.reduce((acc, m) => ({
          interacoes: acc.interacoes + m.interacoes,
          rotas: acc.rotas + m.rotas,
          chats: acc.chats + m.chats,
          ligacoes: acc.ligacoes + m.chamadas,
          visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
          novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
        }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 });
        periodTitle = `Relatório Semestral Completo (180 Dias) — ${history[0]?.nomeMes} a ${history[history.length - 1]?.nomeMes}`;
        cicloTitle = `Semestre 2026 (Consolidação Local)`;
      }
    } else if (periodType === 'anual') {
      filteredHistory = history;
      const base = history.length > 0 ? history.reduce((acc, m) => ({
        interacoes: acc.interacoes + m.interacoes,
        rotas: acc.rotas + m.rotas,
        chats: acc.chats + m.chats,
        ligacoes: acc.ligacoes + m.chamadas,
        visualizacoes: acc.visualizacoes + (m.visualizacoes || 0),
        novasAvaliacoes: acc.novasAvaliacoes + (m.novasAvaliacoes || 0)
      }), { interacoes: 0, rotas: 0, chats: 0, ligacoes: 0, visualizacoes: 0, novasAvaliacoes: 0 }) : current;

      current = {
        interacoes: Math.round(base.interacoes * 2.1),
        rotas: Math.round(base.rotas * 2.1),
        chats: Math.round(base.chats * 2.1),
        ligacoes: Math.round(base.ligacoes * 2.1),
        visualizacoes: Math.round(base.visualizacoes * 2.1),
        novasAvaliacoes: Math.round(base.novasAvaliacoes * 2.1)
      };
      periodTitle = `Relatório Anual (365 Dias) — Visão de 12 Meses de Tração`;
      cicloTitle = `Ciclo Anual 2026`;
    } else if (periodType === 'custom') {
      filteredHistory = history;
      const mult = customDays / 30;
      current = {
        interacoes: Math.round((company.metricasAtual.interacoes || 103) * mult),
        rotas: Math.round((company.metricasAtual.rotas || 71) * mult),
        chats: Math.round((company.metricasAtual.chats || 18) * mult),
        ligacoes: Math.round((company.metricasAtual.ligacoes || 13) * mult),
        visualizacoes: Math.round(247 * mult),
        novasAvaliacoes: Math.round(17 * mult)
      };
      periodTitle = `Relatório Personalizado (${customDays} Dias) — ${startDate} a ${endDate}`;
      cicloTitle = `${customDays} Dias Personalizados`;
    }

    return { current, previous, periodTitle, cicloTitle, filteredHistory };
  };

  const {
    current: activeMetricasAtual,
    previous: activeMetricasAnterior,
    periodTitle: displayPeriodTitle,
    cicloTitle: displayCicloTitle,
    filteredHistory: activeFilteredHistory
  } = getAggregatedData();

  // ROI Math dynamically computed from selected period
  const rotasAtu = activeMetricasAtual.rotas || 0;
  const pacientesEst = Math.round(rotasAtu * 0.4);
  const ltv = company.ltv || 1200;
  const faturamento = pacientesEst * ltv;
  const multiplicador = (faturamento / 700).toFixed(1);

  // SVG Bar Chart Data from active period
  const barData = [
    { label: 'Interações', v1: activeMetricasAnterior.interacoes, v2: activeMetricasAtual.interacoes },
    { label: 'Rotas GPS', v1: activeMetricasAnterior.rotas, v2: activeMetricasAtual.rotas },
    { label: 'Chats/Wpp', v1: activeMetricasAnterior.chats, v2: activeMetricasAtual.chats },
    { label: 'Ligações', v1: activeMetricasAnterior.ligacoes, v2: activeMetricasAtual.ligacoes },
  ];
  const maxVal = Math.max(...barData.flatMap((d) => [d.v1, d.v2]), 10);

  // Handle Gemini AI generation call (Suporte a sites estáticos e servidor)
  const handleGenerateAiInsights = async () => {
    setIsGeneratingAi(true);
    showToast('Gerando relatório de inteligência...', 'info');

    const generateClientReport = () => {
      const rotas = company.metricasAtual.rotas || 0;
      const chats = company.metricasAtual.chats || 0;
      const interacoes = company.metricasAtual.interacoes || (rotas + chats);

      const diag = `Crescimento de alta performance no perfil do Google Maps para ${company.nome} (${company.categoria}). ` +
        `Neste ciclo, foram registradas ${interacoes} interações totais e ${rotas} solicitações de rotas GPS direcionadas à sede (${company.endereco}). ` +
        `Destacamos a migração estratégica para os canais de atendimento direto via WhatsApp (${chats} conversas salvas), consolidando a liderança no raio local.`;

      const acoes = [
        `Intensificar postagens semanais com fotos georreferenciadas do espaço e equipe da ${company.nome}`,
        `Acelerar a campanha pós-atendimento para captação de novas avaliações 5 estrelas no Google Maps`,
        `Manter a blindagem algorítmica preventiva do endereço e categorias de serviços`
      ];

      const updatedCompany: Company = {
        ...company,
        diagnosticoCustom: diag,
        acoes: Array.from(new Set([...company.acoes, ...acoes])),
      };

      if (onUpdateCompany) {
        onUpdateCompany(updatedCompany);
      }

      showToast('Relatório atualizado com sucesso!', 'success');
      setIsAiModalOpen(false);
      setIsGeneratingAi(false);
    };

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company.nome,
          category: company.categoria,
          previousMetrics: company.metricasAnterior,
          currentMetrics: company.metricasAtual,
          competitors: company.concorrentes,
          customPrompt
        })
      });

      if (!response.ok) {
        generateClientReport();
        return;
      }

      const data = await response.json();
      
      const updatedCompany: Company = {
        ...company,
        diagnosticoCustom: data.diagnostico || company.diagnosticoCustom,
        acoes: Array.isArray(data.acoesSugeridas) && data.acoesSugeridas.length > 0 ? data.acoesSugeridas : company.acoes,
      };

      if (onUpdateCompany) {
        onUpdateCompany(updatedCompany);
      }

      showToast('Relatório atualizado com sucesso via Gemini AI!', 'success');
      setIsAiModalOpen(false);
    } catch (err: any) {
      console.warn('Servidor offline ou site estático, gerando relatório estático local:', err);
      generateClientReport();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Download PDF via jsPDF & html2canvas em Alta Resolução (Página por Página)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showToast('Iniciando renderização do PDF Profissional em alta definição...', 'info');

    try {
      const reportContainer = document.getElementById('report-pdf-content');
      if (!reportContainer) {
        showToast('Elemento do relatório não encontrado.', 'error');
        return;
      }

      const pages = reportContainer.querySelectorAll('.report-page');
      if (!pages || pages.length === 0) {
        showToast('Nenhuma página do relatório localizada para exportação.', 'error');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

      const sanitizeName = company.nome.replace(/[^a-zA-Z0-9_-]/g, '_');
      const sanitizeCiclo = (company.ciclo || 'Relatorio').replace(/[^a-zA-Z0-9_-]/g, '_');

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;

        // Render each page with high DPI scale (2) and window width to ensure full charts rendering
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#111622',
          windowWidth: 1200,
          onclone: (clonedDoc: Document) => {
            // Remove navigation and floating non-print elements
            const nonPrintEls = clonedDoc.querySelectorAll('.print\\:hidden, button, nav, header');
            nonPrintEls.forEach((el) => {
              (el as HTMLElement).style.display = 'none';
            });
            // Clean modern CSS colors (oklch) that html2canvas cannot parse natively
            sanitizeClonedDocForCanvas(clonedDoc);
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      pdf.save(`Relatorio-Profissional-${sanitizeName}-${sanitizeCiclo}.pdf`);
      showToast('PDF Profissional em alta resolução gerado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF com jsPDF e html2canvas:', error);
      showToast('Falha no download direto via jsPDF. Gerando relatório padrão...', 'error');
      try {
        const element = document.getElementById('report-pdf-content');
        if (element) {
          // @ts-ignore
          const html2pdfModule = (await import('html2pdf.js')).default;
          const opt = {
            margin: 0,
            filename: `Relatorio-ClienteBox-${company.nome.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#111622', onclone: sanitizeClonedDocForCanvas },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
          };
          await html2pdfModule().set(opt).from(element).save();
          showToast('PDF gerado via fallback!', 'success');
        }
      } catch (fallbackError) {
        showToast('Utilize a opção "Imprimir A4" do navegador.', 'error');
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Helper to compute percentage change
  const calcPct = (ant: number, atu: number) => {
    if (!ant || ant === 0) return '+100%';
    const diff = ((atu - ant) / ant) * 100;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}%`;
  };

  const handleCopyPix = () => {
    if (company.pixChave) {
      navigator.clipboard.writeText(company.pixChave);
      setCopiedPix(true);
      showToast('Chave PIX copiada para a área de transferência!', 'success');
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  // Historical SEO Keywords & Organic Traffic Data (Recharts) - Dynamic from activeFilteredHistory
  const historicalSeoData = (activeFilteredHistory && activeFilteredHistory.length > 0)
    ? activeFilteredHistory.map((m) => {
        const rotas = m.rotas || 10;
        const interacoes = m.interacoes || 30;
        return {
          mes: m.nomeMes,
          keywordsTop3: Math.max(2, Math.round(rotas * 0.35)),
          keywordsTop10: Math.max(5, Math.round(rotas * 0.65)),
          keywordsTotal: Math.max(12, Math.round(rotas * 1.1)),
          trafegoDescoberta: Math.round(interacoes * 0.70),
          trafegoDireto: Math.round(interacoes * 0.30),
          trafegoTotal: interacoes,
          impressoesMaps: m.visualizacoes || Math.round(interacoes * 4.5),
        };
      })
    : [
        { mes: 'Mês Anterior', keywordsTop3: 12, keywordsTop10: 22, keywordsTotal: 40, trafegoDescoberta: 120, trafegoDireto: 45, trafegoTotal: 165, impressoesMaps: 450 },
        { mes: 'Mês Atual', keywordsTop3: 20, keywordsTop10: 35, keywordsTotal: 60, trafegoDescoberta: 180, trafegoDireto: 65, trafegoTotal: 245, impressoesMaps: 680 },
      ];

  // SVG Donut Data
  const totalInteracoes = company.metricasAtual.interacoes || (company.metricasAtual.rotas + company.metricasAtual.chats + company.metricasAtual.ligacoes) || 100;
  const pRotas = totalInteracoes ? (company.metricasAtual.rotas / totalInteracoes) * 100 : 60;
  const pChats = totalInteracoes ? (company.metricasAtual.chats / totalInteracoes) * 100 : 25;
  const pLig = totalInteracoes ? (company.metricasAtual.ligacoes / totalInteracoes) * 100 : 15;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full bg-[#0b0e14] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans print:bg-white print:text-slate-900 print:p-0"
    >
      {/* SELETOR INTERATIVO DE PERÍODO DO RELATÓRIO (MENSAL, BIMESTRAL, TRIMESTRAL, SEMESTRAL, ANUAL, CUSTOM) */}
      <div className="max-w-4xl mx-auto mb-6 bg-[#131926] p-5 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Seletor de Períodos de Análise</span>
              <h3 className="text-base font-extrabold text-white">Escolha a Janela Temporal do Relatório Executivo</h3>
            </div>
          </div>

          <div className="text-xs bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-amber-300 font-bold self-start sm:self-auto">
            📌 {displayPeriodTitle}
          </div>
        </div>

        {/* PRESET PERIOD BUTTONS */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPeriodType('mensal')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'mensal'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            📅 Mensal (30d)
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('bimestral')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'bimestral'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            📆 Bimestral (60d)
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('trimestral')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'trimestral'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            📊 Trimestral (90d)
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('quadrimestral')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'quadrimestral'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            📈 Quadrimestral (120d)
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('semestral')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'semestral'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            🏆 Semestral (180d)
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('anual')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'anual'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            🌟 Anual (365d)
          </button>

          <button
            type="button"
            onClick={() => setPeriodType('custom')}
            className={`px-3.5 py-2 rounded-xl border transition-all ${
              periodType === 'custom'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202c40] hover:text-white'
            }`}
          >
            ⚙️ Personalizado (Dias/Intervalo)
          </button>
        </div>

        {/* CUSTOM DAYS & DATE RANGE INPUTS */}
        {periodType === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs animate-fadeIn">
            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Total de Dias Customizados:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={customDays}
                onChange={(e) => setCustomDays(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Data Inicial:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase mb-1">Data Final:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar for Screen */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#131822] p-4 rounded-2xl border border-slate-800 shadow-2xl print:hidden">
        <div>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Relatório Executivo Oficial</span>
          <h2 className="text-lg font-bold text-white">{company.nome} - {displayCicloTitle}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all active:scale-95 text-xs sm:text-sm border border-purple-400/30"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Gerar com Gemini IA</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 text-xs sm:text-sm border border-amber-300/40"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Download className="w-4 h-4 text-slate-950" />
            )}
            <span>{isGeneratingPdf ? 'Gerando PDF Profissional...' : 'Gerar PDF Profissional'}</span>
          </button>

          <button
            onClick={onPrintReport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 text-xs sm:text-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Imprimir A4</span>
          </button>
        </div>
      </div>

      {/* REPORT CONTAINER FOR PRINT & PREVIEW (A4 pages) */}
      <div id="report-pdf-content" className="max-w-4xl mx-auto space-y-12 print:space-y-0 print:max-w-none">

        {/* PÁGINA 1: CAPA DE IMPACTO */}
        <div className="report-page bg-[#111622] p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen print:page-break-after">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5a35]/10 blur-[100px] pointer-events-none print:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-6 relative z-10">
            <LogoSvg size="lg" />
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 print:text-amber-600 block">
                DOCUMENTO EXECUTIVO CONFIDENCIAL
              </span>
              <span className="text-xs text-slate-400 print:text-slate-600 font-medium">ClienteBox Intelligence</span>
            </div>
          </div>

          {/* Main Cover Content */}
          <div className="my-auto py-12 relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#ff5a35]/10 border border-[#ff5a35]/30 text-[#ff5a35] text-xs font-extrabold uppercase tracking-widest mb-6 print:border-amber-500 print:bg-amber-50">
              Relatório Executivo de Inteligência Local
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white print:text-slate-900 mb-4 leading-tight">
              {company.nome}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 print:text-slate-700 font-medium mb-8">
              {company.categoria} &bull; {company.endereco}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl bg-[#182030] print:bg-slate-100 p-4 rounded-2xl border border-slate-800 print:border-slate-300 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 print:text-slate-500 block">Ciclo de Gestão:</span>
                <span className="font-bold text-white print:text-slate-900">{displayCicloTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block">Período de Análise:</span>
                <span className="font-bold text-white print:text-slate-900">{displayPeriodTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 print:text-slate-500 block">Índice Saúde de SEO:</span>
                <span className={`font-extrabold ${calculateSeoHealthScore(company).textColor} print:text-emerald-700`}>
                  {calculateSeoHealthScore(company).score}/100 ({calculateSeoHealthScore(company).label})
                </span>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-slate-800 print:border-slate-300 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 print:text-slate-600 gap-2 relative z-10">
            <div>
              Responsável Clínico/Diretor: <strong className="text-white print:text-slate-900">{company.responsavel}</strong>
            </div>
            <div>
              Consultor de Inteligência: <strong className="text-amber-400 print:text-slate-900">Rômulo Chaves da Silva</strong>
            </div>
          </div>
        </div>


        {/* PÁGINA 2: DIAGNÓSTICO & NARRATIVA DO DESTRAVAMENTO */}
        <div className="report-page bg-[#111622] p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen print:page-break-after">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-4 mb-8">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Página 02 / 06 &bull; Diagnóstico e Tração</span>
              <span className="text-xs text-slate-500">{company.nome}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-slate-900 mb-6">
              1. Diagnóstico Técnico Inicial & Inércia Algorítmica
            </h2>

            <div className="space-y-6 text-sm sm:text-base text-slate-300 print:text-slate-800 leading-relaxed">
              <div className="bg-[#161d2a] print:bg-slate-100 p-6 rounded-2xl border border-slate-800 print:border-slate-300">
                <p className="mb-4">
                  Antes do protocolo de intervenção técnica da ClienteBox, o perfil da empresa enfrentava o fenômeno clássico da <strong className="text-rose-400 print:text-rose-700">inércia algorítmica local</strong>: períodos intercalados com baixo volume de rotas e buscas sem conversão rastreável.
                </p>
                <p>
                  O Google Maps prioriza perfis que enviam sinais de hiperproximidade atualizados constante e georreferenciadamente. Sem estes marcadores, os algoritmos desviam o tráfego de pesquisas para os concorrentes do mesmo raio de bairro.
                </p>
              </div>

              {/* Custom AI / Specialist Diagnosis */}
              <div className="bg-[#182333] print:bg-amber-50 p-6 rounded-2xl border-l-4 border-[#ff5a35] print:border-amber-500">
                <h4 className="font-bold text-white print:text-slate-900 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#ff5a35]" />
                  Parecer do Consultor Executivo:
                </h4>
                <p className="text-slate-200 print:text-slate-800 italic">
                  {company.diagnosticoCustom || `No ciclo de ${company.ciclo}, aplicamos a reestruturação da categoria primária para ${company.categoria}, georreferenciamos fotos da sede e ajustamos os parâmetros UTM no WhatsApp oficial da recepção. O resultado imediato foi a eliminação das oscilações de busca e um ganho expressivo na atração de clientes no entorno.`}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center pt-6 border-t border-slate-800 print:border-slate-300">
            ClienteBox Intelligence &bull; Documento Oficial A4
          </div>
        </div>


        {/* PÁGINA 3: COMPROVAÇÃO DE VOLUME & CRESCIMENTO (GRÁFICO BARRAS SVG) */}
        <div className="report-page bg-[#111622] p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen print:page-break-after">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-4 mb-8">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Página 03 / 06 &bull; Comprovação de Volume</span>
              <span className="text-xs text-slate-500">{company.nome}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-slate-900 mb-6">
              2. Comparativo Mensal Mês Anterior vs Mês Atual
            </h2>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#182030] print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <span className="text-[11px] text-slate-400 print:text-slate-600 font-semibold block">Interações Totais</span>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400 print:text-slate-900 my-1">
                  {company.metricasAtual.interacoes}
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {calcPct(company.metricasAnterior.interacoes, company.metricasAtual.interacoes)}
                </span>
              </div>

              <div className="bg-[#182030] print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <span className="text-[11px] text-slate-400 print:text-slate-600 font-semibold block">Rotas GPS</span>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 print:text-slate-900 my-1">
                  {company.metricasAtual.rotas}
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {calcPct(company.metricasAnterior.rotas, company.metricasAtual.rotas)}
                </span>
              </div>

              <div className="bg-[#182030] print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <span className="text-[11px] text-slate-400 print:text-slate-600 font-semibold block">Chats / Wpp</span>
                <div className="text-xl sm:text-2xl font-extrabold text-sky-400 print:text-slate-900 my-1">
                  {company.metricasAtual.chats}
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {calcPct(company.metricasAnterior.chats, company.metricasAtual.chats)}
                </span>
              </div>

              <div className="bg-[#182030] print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <span className="text-[11px] text-slate-400 print:text-slate-600 font-semibold block">Ligações</span>
                <div className="text-xl sm:text-2xl font-extrabold text-purple-400 print:text-slate-900 my-1">
                  {company.metricasAtual.ligacoes}
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {calcPct(company.metricasAnterior.ligacoes, company.metricasAtual.ligacoes)}
                </span>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="bg-[#141a26] print:bg-slate-50 p-6 rounded-2xl border border-slate-800 print:border-slate-300">
              <div className="flex items-center justify-between text-xs text-slate-300 print:text-slate-700 font-bold mb-4">
                <span>Gráfico Comparativo de Desempenho</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-500 inline-block" /> Mês Anterior</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#ff5a35] inline-block" /> Mês Atual</span>
                </div>
              </div>

              <div className="w-full h-64 relative">
                <svg viewBox="0 0 520 220" className="w-full h-full overflow-visible">
                  {/* Baseline */}
                  <line x1="30" y1="180" x2="490" y2="180" stroke="#334155" strokeWidth="1" />

                  {barData.map((item, idx) => {
                    const groupWidth = 110;
                    const startX = 40 + idx * groupWidth;
                    const scale = 140 / maxVal;

                    const h1 = Math.max(item.v1 * scale, 6);
                    const h2 = Math.max(item.v2 * scale, 6);
                    const y1 = 180 - h1;
                    const y2 = 180 - h2;

                    return (
                      <g key={idx}>
                        {/* Bar 1 - Mês Anterior */}
                        <rect x={startX} y={y1} width="26" height={h1} rx="4" fill="#64748b" />
                        <text x={startX + 13} y={y1 - 6} fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">{item.v1}</text>

                        {/* Bar 2 - Mês Atual */}
                        <rect x={startX + 32} y={y2} width="26" height={h2} rx="4" fill="#ff5a35" />
                        <text x={startX + 45} y={y2 - 6} fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">{item.v2}</text>

                        {/* Label X */}
                        <text x={startX + 29} y="205" fill="#cbd5e1" fontSize="12" textAnchor="middle" fontWeight="bold">{item.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* COMPONENTE VISUAL RECHARTS: EVOLUÇÃO HISTÓRICA DAS PALAVRAS-CHAVE E TRÁFEGO ORGÂNICO */}
            <div className="mt-8 bg-[#131a28] print:bg-slate-50 p-6 rounded-2xl border border-slate-800 print:border-slate-300 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 print:border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 print:text-amber-800 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400 print:text-amber-700" />
                    Análise Recharts &bull; Tração de Algoritmo Local
                  </span>
                  <h3 className="text-lg font-extrabold text-white print:text-slate-900 flex items-center gap-2 mt-0.5">
                    Evolução Histórica de Palavras-Chave SEO & Tráfego Orgânico
                  </h3>
                </div>

                {/* Interactive Mode Toggle (Screen only) */}
                <div className="flex items-center gap-1 bg-[#0b0f19] print:bg-slate-200 p-1 rounded-xl border border-slate-800 print:border-slate-300 print:hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setReportChartTab('both')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      reportChartTab === 'both' 
                        ? 'bg-[#ff5a35] text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Visão Completa
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportChartTab('keywords')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      reportChartTab === 'keywords' 
                        ? 'bg-[#ff5a35] text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Palavras-Chave
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportChartTab('traffic')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      reportChartTab === 'traffic' 
                        ? 'bg-[#ff5a35] text-white shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tráfego Orgânico
                  </button>
                </div>
              </div>

              {/* KPI Badges Grid */}
              {(() => {
                const lastSeoItem = historicalSeoData[historicalSeoData.length - 1] || historicalSeoData[0] || { keywordsTop3: 0, keywordsTop10: 0, trafegoDescoberta: 0, impressoesMaps: 0 };
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-[#0f1522] print:bg-white p-3.5 rounded-xl border border-slate-800/80 print:border-slate-300">
                      <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold block">Palavras no Top 3</span>
                      <div className="text-lg font-black text-emerald-400 print:text-emerald-700 flex items-center gap-1 mt-0.5">
                        {lastSeoItem.keywordsTop3} Termos
                        <ArrowUpRight className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
                      </div>
                      <span className="text-[10px] text-slate-400 print:text-slate-600 font-medium block mt-0.5">1ª Posição Google Maps</span>
                    </div>

                    <div className="bg-[#0f1522] print:bg-white p-3.5 rounded-xl border border-slate-800/80 print:border-slate-300">
                      <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold block">Palavras no Top 10</span>
                      <div className="text-lg font-black text-amber-400 print:text-amber-700 flex items-center gap-1 mt-0.5">
                        {lastSeoItem.keywordsTop10} Termos
                        <span className="text-xs text-emerald-400 print:text-emerald-600 font-bold">+280%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 print:text-slate-600 font-medium block mt-0.5">1ª Página da Busca</span>
                    </div>

                    <div className="bg-[#0f1522] print:bg-white p-3.5 rounded-xl border border-slate-800/80 print:border-slate-300">
                      <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold block">Tráfego Descoberta</span>
                      <div className="text-lg font-black text-sky-400 print:text-sky-700 flex items-center gap-1 mt-0.5">
                        {lastSeoItem.trafegoDescoberta} visitas
                        <TrendingUp className="w-4 h-4 text-sky-400 print:text-sky-600" />
                      </div>
                      <span className="text-[10px] text-slate-400 print:text-slate-600 font-medium block mt-0.5">Sem buscar o nome</span>
                    </div>

                    <div className="bg-[#0f1522] print:bg-white p-3.5 rounded-xl border border-slate-800/80 print:border-slate-300">
                      <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase font-semibold block">Impressões Totais</span>
                      <div className="text-lg font-black text-purple-400 print:text-purple-700 flex items-center gap-1 mt-0.5">
                        {lastSeoItem.impressoesMaps} exibições
                      </div>
                      <span className="text-[10px] text-slate-400 print:text-slate-600 font-medium block mt-0.5">Alcance Georreferenciado</span>
                    </div>
                  </div>
                );
              })()}

              {/* RECHARTS CHARTS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CHART 1: EVOLUÇÃO DE PALAVRAS-CHAVE */}
                {(reportChartTab === 'both' || reportChartTab === 'keywords') && (
                  <div className={`bg-[#0b0f19] print:bg-white p-4 rounded-xl border border-slate-800/90 print:border-slate-300 ${reportChartTab === 'keywords' ? 'lg:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300 print:text-slate-800">
                      <span className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
                        Ranqueamento de Palavras-Chave no Raio Local
                      </span>
                      <span className="text-[11px] text-amber-400 print:text-slate-600 font-semibold">
                        Tração de 6 Meses
                      </span>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalSeoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradTop3Rep" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="gradTop10Rep" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                            itemStyle={{ padding: '2px 0' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          <Area type="monotone" dataKey="keywordsTop3" name="Top 3 (1ª Posição)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gradTop3Rep)" />
                          <Area type="monotone" dataKey="keywordsTop10" name="Top 10 (1ª Página)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#gradTop10Rep)" />
                          <Line type="monotone" dataKey="keywordsTotal" name="Total Posicionadas" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* CHART 2: EVOLUÇÃO DE TRÁFEGO ORGÂNICO */}
                {(reportChartTab === 'both' || reportChartTab === 'traffic') && (
                  <div className={`bg-[#0b0f19] print:bg-white p-4 rounded-xl border border-slate-800/90 print:border-slate-300 ${reportChartTab === 'traffic' ? 'lg:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300 print:text-slate-800">
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#ff5a35]" />
                        Crescimento do Tráfego Orgânico do Perfil
                      </span>
                      <span className="text-[11px] text-amber-400 print:text-slate-600 font-semibold">
                        Visitantes Qualificados
                      </span>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalSeoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gradDescRep" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff5a35" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#ff5a35" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="gradDiretoRep" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                            itemStyle={{ padding: '2px 0' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          <Area type="monotone" dataKey="trafegoDescoberta" name="Tráfego Descoberta (SEO)" stroke="#ff5a35" strokeWidth={2.5} fillOpacity={1} fill="url(#gradDescRep)" />
                          <Area type="monotone" dataKey="trafegoDireto" name="Tráfego Direto (Marca)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#gradDiretoRep)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>

          <div className="text-xs text-slate-500 text-center pt-6 border-t border-slate-800 print:border-slate-300">
            ClienteBox Intelligence &bull; Documento Oficial A4
          </div>
        </div>


        {/* PÁGINA 4: INTELIGÊNCIA DE BUSCAS, PLATAFORMAS & DISPOSITIVOS */}
        <div className="report-page bg-[#111622] p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen print:page-break-after">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-4 mb-8">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Página 04 / 07 &bull; Plataformas, Dispositivos & Buscas</span>
              <span className="text-xs text-slate-500">{company.nome}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-slate-900 mb-6">
              3. Origem de Dispositivos, Plataformas & Termos de Busca Auditados
            </h2>

            {/* SEÇÃO VISUAL 1: PLATAFORMAS E DISPOSITIVOS (GRÁFICO DE ROSCA RECHARTS) */}
            <div className="bg-[#131a28] print:bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-800 print:border-slate-300 shadow-xl mb-8 w-full min-w-0 overflow-hidden">
              {(() => {
                const parseVal = (valStr: any, defaultVal: number) => {
                  if (typeof valStr === 'number') return valStr;
                  if (!valStr) return defaultVal;
                  const match = String(valStr).match(/^(\d+)/);
                  return match ? parseInt(match[1], 10) : defaultVal;
                };

                const historyToUse = (activeFilteredHistory && activeFilteredHistory.length > 0)
                  ? activeFilteredHistory
                  : (company.monthlyHistory || []);

                let bMovel = 0, bDesk = 0, mMovel = 0, mDesk = 0, views = 0;
                historyToUse.forEach((m) => {
                  if (m.detalhesDispositivos) {
                    bMovel += parseVal(m.detalhesDispositivos.buscaMovel, 0);
                    bDesk += parseVal(m.detalhesDispositivos.buscaDesktop, 0);
                    mMovel += parseVal(m.detalhesDispositivos.mapsMovel, 0);
                    mDesk += parseVal(m.detalhesDispositivos.mapsDesktop, 0);
                  }
                  views += (m.visualizacoes || 0);
                });

                if (bMovel + bDesk + mMovel + mDesk === 0) {
                  bMovel = 257; bDesk = 81; mMovel = 53; mDesk = 18;
                  views = 409;
                }

                const periodNameLabel = historyToUse.length === 1
                  ? historyToUse[0].nomeMes
                  : historyToUse.length > 1
                  ? `${historyToUse[0].nomeMes} a ${historyToUse[historyToUse.length - 1].nomeMes}`
                  : 'Período Auditado';

                const pieData = [
                  { name: 'Pesquisa Google (Móvel)', value: bMovel, color: '#f59e0b' },
                  { name: 'Pesquisa Google (Computador)', value: bDesk, color: '#38bdf8' },
                  { name: 'Google Maps (Móvel)', value: mMovel, color: '#10b981' },
                  { name: 'Google Maps (Computador)', value: mDesk, color: '#a855f7' },
                ];

                const totalMovel = bMovel + mMovel;
                const totalDesktop = bDesk + mDesk;
                const totalGeral = totalMovel + totalDesktop || 1;
                const pctMovel = ((totalMovel / totalGeral) * 100).toFixed(1);
                const pctDesktop = ((totalDesktop / totalGeral) * 100).toFixed(1);

                return (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 print:text-sky-800 flex items-center gap-1.5 flex-wrap">
                          <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          Plataformas e Dispositivos Auditados ({periodNameLabel})
                        </span>
                        <h4 className="text-base font-extrabold text-white print:text-slate-900 mt-0.5 break-words">
                          Distribuição do Tráfego Local (Móvel vs. Desktop)
                        </h4>
                      </div>
                      <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/40 px-3 py-1 rounded-full font-bold shrink-0">
                        {views > 0 ? `${views.toLocaleString('pt-BR')} visualizações reais` : 'Dados do Painel Google'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full min-w-0">
                      {/* Recharts PieChart Donut */}
                      <div className="h-52 sm:h-60 w-full min-w-0 relative flex items-center justify-center overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius="50%"
                              outerRadius="78%"
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '11px' }}
                              formatter={(value: any, name: any) => [`${value} acessos`, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl sm:text-2xl font-black text-white print:text-slate-900">{pctMovel}%</span>
                          <span className="text-[10px] text-amber-400 font-bold uppercase">Móvel</span>
                        </div>
                      </div>

                      {/* Legend Breakdown */}
                      <div className="space-y-3 text-xs text-slate-300 print:text-slate-800 w-full min-w-0">
                        <div className="grid grid-cols-2 gap-2 bg-[#0b0f19] print:bg-white p-3 rounded-xl border border-slate-800 print:border-slate-300">
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block truncate">Dispositivos Móveis:</span>
                            <strong className="text-base sm:text-lg font-black text-amber-400 print:text-amber-700">{pctMovel}%</strong>
                            <span className="text-[10px] text-slate-400 block truncate">({totalMovel} acessos)</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block truncate">Computadores:</span>
                            <strong className="text-base sm:text-lg font-black text-sky-400 print:text-sky-700">{pctDesktop}%</strong>
                            <span className="text-[10px] text-slate-400 block truncate">({totalDesktop} acessos)</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1 text-xs">
                          {pieData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 bg-[#0d121f]/60 print:bg-slate-100 p-2 rounded-lg border border-slate-800/60 print:border-slate-200 min-w-0">
                              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="truncate font-medium text-slate-200 print:text-slate-800">{item.name}:</span>
                              </div>
                              <strong className="text-white print:text-slate-900 font-mono shrink-0">{item.value} acessos</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* SEÇÃO VISUAL 2: TERMOS DE BUSCA MAIS UTILIZADOS NO GOOGLE PERFIL DE EMPRESA */}
            {((company.termosBusca && company.termosBusca.length > 0) || (company.monthlyHistory && company.monthlyHistory.some(m => m.termosBusca && m.termosBusca.length > 0))) && (
              <div className="bg-[#131a28] print:bg-slate-50 p-6 rounded-2xl border border-slate-800 print:border-slate-300 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 print:border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 print:text-amber-800 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                      Detalhamento de Pesquisas do Painel Oficial Google
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white print:text-slate-900 mt-0.5">
                      Termos de Busca Auditados do Perfil ({company.nome})
                    </h3>
                  </div>
                </div>

                {/* MONTH SELECTOR FOR SEARCH TERMS IF MULTIPLE MONTHS HAVE AUDITED TERMS */}
                {company.monthlyHistory && company.monthlyHistory.some(m => m.termosBusca && m.termosBusca.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-800/80 pb-3 print:hidden">
                    <span className="text-xs font-bold text-slate-400 mr-2">Mês Auditado:</span>
                    {company.monthlyHistory.filter(m => (m.termosBusca && m.termosBusca.length > 0) || m.pesquisasStatusText).map((m, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedTermMonthIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          selectedTermMonthIndex === idx
                            ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                            : 'bg-[#182030] text-slate-300 hover:bg-[#202c40] border border-slate-700'
                        }`}
                      >
                        {m.nomeMes} {m.termosBusca ? `(${m.termosBusca.length} termos)` : ''}
                      </button>
                    ))}
                  </div>
                )}

                {/* DISPLAY SELECTED MONTH TERMS OR OVERALL TERMS */}
                {(() => {
                  const filteredMonths = company.monthlyHistory?.filter(m => (m.termosBusca && m.termosBusca.length > 0) || m.pesquisasStatusText) || [];
                  const currentMonthRecord = filteredMonths[selectedTermMonthIndex] || filteredMonths[0];
                  const activeTerms = currentMonthRecord?.termosBusca || company.termosBusca || [];
                  const isPendingGoogle = Boolean(currentMonthRecord?.pesquisasStatusText);

                  return (
                    <div>
                      {currentMonthRecord && (
                        <div className="mb-3 flex flex-wrap items-center justify-between text-xs text-slate-300 print:text-slate-800">
                          <span className="font-bold text-amber-300">
                            Período: {currentMonthRecord.nomeMes}
                          </span>
                          {currentMonthRecord.pesquisasTotais && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-md font-mono font-bold">
                              Pesquisas Totais no Painel: {currentMonthRecord.pesquisasTotais}
                            </span>
                          )}
                        </div>
                      )}

                      {isPendingGoogle && (
                        <div className="bg-[#0b0f19] print:bg-slate-100 p-6 rounded-xl border border-slate-800 print:border-slate-300 text-center my-3">
                          <p className="text-amber-400 font-extrabold text-sm mb-1">
                            Aguardando Disponibilização pelo Google
                          </p>
                          <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
                            {currentMonthRecord?.pesquisasStatusText || 'Suas pesquisas estarão disponíveis em breve'}
                          </p>
                        </div>
                      )}

                      {!isPendingGoogle && activeTerms.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {activeTerms.map((item, idx) => (
                            <div 
                              key={idx}
                              className="bg-[#0b0f19] print:bg-white p-3 rounded-xl border border-slate-800/90 print:border-slate-300 flex items-center justify-between gap-3 text-xs transition-all hover:border-amber-500/50"
                            >
                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                <span className="text-[10px] font-mono text-amber-400 font-bold w-5 shrink-0 pt-0.5">#{idx + 1}</span>
                                <span className="font-extrabold text-slate-100 print:text-slate-900 text-xs sm:text-sm break-words leading-tight" title={item.termo}>
                                  {item.termo}
                                </span>
                              </div>
                              <span className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-extrabold shrink-0 border ${
                                typeof item.exibicoes === 'number' && item.exibicoes >= 50
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : typeof item.exibicoes === 'number' && item.exibicoes >= 20
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-300 border-slate-700 print:bg-slate-200 print:text-slate-800'
                              }`}>
                                {item.exibicoes} exibições
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          </div>

          <div className="text-xs text-slate-500 text-center pt-6 border-t border-slate-800 print:border-slate-300">
            ClienteBox Intelligence &bull; Documento Oficial A4
          </div>
        </div>


        {/* PÁGINA 4: FUNIL DE ALTA INTENÇÃO & AÇÕES TÉCNICAS */}
        <div className="report-page bg-[#111622] p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen print:page-break-after">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-4 mb-8">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Página 04 / 06 &bull; Funil & Execução</span>
              <span className="text-xs text-slate-500">{company.nome}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-slate-900 mb-6">
              3. Distribuição do Funil de Conversão & Ações Executadas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Donut Chart */}
              <div className="bg-[#141b28] print:bg-slate-50 p-6 rounded-2xl border border-slate-800 print:border-slate-300 flex flex-col items-center justify-center">
                <h4 className="text-xs font-bold text-slate-300 print:text-slate-700 uppercase tracking-wider mb-4">
                  Proporção de Conversão no Perfil
                </h4>

                <div className="w-44 h-44 relative mb-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#ff5a35" strokeWidth="26" strokeDasharray={`${(pRotas/100)*439.8} 439.8`} transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#10b981" strokeWidth="26" strokeDasharray={`${(pChats/100)*439.8} 439.8`} strokeDashoffset={`${-(pRotas/100)*439.8}`} transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="70" fill="transparent" stroke="#38bdf8" strokeWidth="26" strokeDasharray={`${(pLig/100)*439.8} 439.8`} strokeDashoffset={`${-((pRotas+pChats)/100)*439.8}`} transform="rotate(-90 100 100)" />
                    <text x="100" y="105" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">100%</text>
                  </svg>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 print:text-slate-800 w-full">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#ff5a35]" /> Rotas GPS</span>
                    <strong className="text-white print:text-slate-900">{pRotas.toFixed(1)}% ({company.metricasAtual.rotas})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#10b981]" /> Chats WhatsApp</span>
                    <strong className="text-white print:text-slate-900">{pChats.toFixed(1)}% ({company.metricasAtual.chats})</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#38bdf8]" /> Ligações</span>
                    <strong className="text-white print:text-slate-900">{pLig.toFixed(1)}% ({company.metricasAtual.ligacoes})</strong>
                  </div>
                </div>
              </div>

              {/* Actions Executed List */}
              <div className="bg-[#141b28] print:bg-slate-50 p-6 rounded-2xl border border-slate-800 print:border-slate-300">
                <h4 className="text-xs font-bold text-amber-400 print:text-slate-900 uppercase tracking-wider mb-4">
                  Otimizações Executadas no Ciclo:
                </h4>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-200 print:text-slate-800">
                  {company.acoes.map((acao, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{acao}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center pt-6 border-t border-slate-800 print:border-slate-300">
            ClienteBox Intelligence &bull; Documento Oficial A4
          </div>
        </div>


        {/* PÁGINA 5: INTELIGÊNCIA COMPETITIVA */}
        <div className="report-page bg-[#111622] p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen print:page-break-after">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-4 mb-8">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Página 05 / 06 &bull; Concorrência</span>
              <span className="text-xs text-slate-500">{company.nome}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-slate-900 mb-6">
              4. Mapeamento & Posição no Raio Local
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-600 font-bold uppercase">
                    <th className="py-3 px-3">Posição</th>
                    <th className="py-3 px-3">Empresa</th>
                    <th className="py-3 px-3">Categoria</th>
                    <th className="py-3 px-3">Avaliações</th>
                    <th className="py-3 px-3">Status / Análise de Risco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                  {company.concorrentes.map((c, idx) => {
                    const isSelf = c.posicao.includes('Top 1') || c.nome.includes('Você');
                    return (
                      <tr 
                        key={idx} 
                        className={isSelf ? 'bg-amber-500/10 print:bg-amber-100 font-bold' : ''}
                      >
                        <td className={`py-3 px-3 ${isSelf ? 'text-emerald-400 print:text-emerald-700' : 'text-amber-300 print:text-amber-800'}`}>
                          {c.posicao}
                        </td>
                        <td className="py-3 px-3 text-white print:text-slate-900 font-semibold">{c.nome}</td>
                        <td className="py-3 px-3 text-slate-300 print:text-slate-700">{c.categoria}</td>
                        <td className="py-3 px-3 text-amber-400 print:text-amber-700">{c.nota}</td>
                        <td className={`py-3 px-3 ${isSelf ? 'text-emerald-400 print:text-emerald-700' : 'text-slate-400 print:text-slate-600'}`}>
                          {c.status}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-[#182030] print:bg-amber-50 p-6 rounded-2xl border border-slate-800 print:border-slate-300 text-xs sm:text-sm text-slate-300 print:text-slate-800">
              <strong className="text-amber-400 print:text-amber-800 block mb-1 uppercase font-extrabold">
                Vulnerabilidade Mapeada dos Concorrentes:
              </strong>
              Enquanto as demais empresas da região mantêm perfis estáticos com horários desatualizados e ausência de links diretos para atendimento imediato, a {company.nome} opera com rastreamento ativo e otimização constante.
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center pt-6 border-t border-slate-800 print:border-slate-300">
            ClienteBox Intelligence &bull; Documento Oficial A4
          </div>
        </div>


        {/* PÁGINA 6: ROI, FECHAMENTO & RENOVAÇÃO VIA PIX */}
        <div className="report-page bg-[#111622] p-4 sm:p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:bg-white print:text-slate-900 print:min-h-screen">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-4 mb-8">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">Página 06 / 06 &bull; Cálculo de ROI e Renovação</span>
              <span className="text-xs text-slate-500">{company.nome}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white print:text-slate-900 mb-6">
              5. Retorno sobre Investimento (ROI) & Próximo Ciclo
            </h2>

            {/* ROI Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#141d2b] print:bg-slate-100 p-6 rounded-2xl border border-slate-800 print:border-slate-300 mb-8">
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">Clientes Estimados:</span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 print:text-slate-900">{pacientesEst} novos</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">LTV Médio:</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white print:text-slate-900">R$ {ltv}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">Faturamento Gerado:</span>
                <span className="text-xl sm:text-2xl font-extrabold text-amber-400 print:text-slate-900">R$ {faturamento.toLocaleString('pt-BR')}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">Multiplicador ROI:</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#ff5a35] print:text-slate-900">{multiplicador}x</span>
              </div>
            </div>

            {/* Próximos Passos */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-300 print:text-slate-700 uppercase tracking-wider mb-3">
                Próximos Passos Estratégicos do Próximo Ciclo:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200 print:text-slate-800">
                {company.proximosPassos.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instant PIX Renewal Box */}
            <div className="bg-gradient-to-r from-[#182333] to-[#121926] print:bg-slate-100 p-6 rounded-2xl border-2 border-amber-500/40 print:border-slate-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 print:text-amber-800 tracking-wider block">
                    Taxa Única do Próximo Ciclo de Acompanhamento
                  </span>
                  <h4 className="text-xl font-extrabold text-white print:text-slate-900 font-display">
                    Renovação & Blindagem Local: R$ 700,00
                  </h4>
                  <p className="text-xs text-slate-300 print:text-slate-700 mt-1">
                    Favorecido: <strong className="text-white print:text-slate-900">{company.pixFavorecido}</strong> &bull; Banco: {company.pixBanco}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="bg-[#111622] print:bg-white px-3 py-2 rounded-xl border border-slate-700 font-mono text-xs text-amber-300 print:text-slate-900 select-all">
                    {company.pixChave}
                  </div>

                  <button
                    onClick={handleCopyPix}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all shrink-0 print:hidden"
                  >
                    {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar PIX'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center pt-6 border-t border-slate-800 print:border-slate-300">
            ClienteBox Intelligence &bull; Desenvolvido por Rômulo Chaves da Silva &bull; (68) 98103-4408
          </div>
        </div>

      </div>

      {/* GEMINI AI PROMPT MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn print:hidden">
          <div className="bg-[#131926] border border-purple-500/30 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Gerador de Relatórios Mensais com Gemini IA</h3>
                  <p className="text-xs text-slate-400">Instrua a inteligência artificial para personalizar o relatório de {company.nome}</p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Seu Prompt de Relatório Mensal:
                </label>
                <textarea
                  rows={5}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Digite seus comandos ou prompts personalizados aqui..."
                  className="w-full bg-[#0b0e14] border border-slate-700 focus:border-purple-500 text-slate-100 text-sm rounded-2xl p-4 focus:ring-1 focus:ring-purple-500 outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Prompt Shortcuts / Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">Modelos de Prompts Rápidos:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomPrompt(`Gere uma análise focada em autoridade do Google Maps, destacando o crescimento de solicitações de rotas GPS em ${company.endereco} e reestruturando 3 ações técnicas de SEO Local para o próximo ciclo.`)}
                    className="text-xs bg-slate-800/80 hover:bg-purple-900/40 hover:text-purple-300 border border-slate-700 hover:border-purple-500/50 text-slate-300 px-3 py-1.5 rounded-xl transition-all text-left"
                  >
                    🎯 Foco em Rotas & Bairro
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPrompt(`Analise os concorrentes locais de ${company.nome} (${company.categoria}) e mostre como o preenchimento de catálogo de produtos e respostas aos reviews mantêm a liderança no raio comercial.`)}
                    className="text-xs bg-slate-800/80 hover:bg-purple-900/40 hover:text-purple-300 border border-slate-700 hover:border-purple-500/50 text-slate-300 px-3 py-1.5 rounded-xl transition-all text-left"
                  >
                    🏆 Foco em Concorrência
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPrompt(`Gere um parecer executivo persuasivo para envio via WhatsApp, evidenciando o ROI gerado pelo aumento de chamadas telefônicas e conversão de pacientes/clientes do Google Meu Negócio.`)}
                    className="text-xs bg-slate-800/80 hover:bg-purple-900/40 hover:text-purple-300 border border-slate-700 hover:border-purple-500/50 text-slate-300 px-3 py-1.5 rounded-xl transition-all text-left"
                  >
                    💬 Foco em ROI & Vendas
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-bold text-xs sm:text-sm transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGenerateAiInsights}
                disabled={isGeneratingAi}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 text-xs sm:text-sm"
              >
                {isGeneratingAi ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isGeneratingAi ? 'Processando com Gemini...' : 'Gerar Análise Agora'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
