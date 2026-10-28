import React, { useState } from 'react';
import { Sparkles, Printer, Moon, Sun, Upload, Send, RefreshCw, FileText, CheckCircle2, Copy, ShieldCheck, Zap } from 'lucide-react';

export interface FivePageProposalState {
  clientName: string;
  clientTitle: string;
  niche: string;
  cityState: string;
  crnCrm: string;
  responsavelTecnico: string;
  periodoAcompanhamento: string;
  dataEmissao: string;
  
  quoteCap1: string;
  
  // Chapter 1 metrics
  catRaiz: string;
  catRaizSub: string;
  catalogo: string;
  catalogoSub: string;
  website: string;
  websiteSub: string;
  acompanhamento: string;
  acompanhamentoSub: string;

  // Chapter 1 audit table
  erroCategoria: string;
  erroCategoriaImpacto: string;
  erroCatalogo: string;
  erroCatalogoImpacto: string;
  erroWebsite: string;
  erroWebsiteImpacto: string;
  erroPosicionamento: string;
  erroPosicionamentoImpacto: string;

  // Chapter 2 Competitors
  competitor1Name: string;
  competitor1Reviews: number;
  competitor1Nota: string;
  competitor1Estrategia: string;

  competitor2Name: string;
  competitor2Reviews: number;
  competitor2Nota: string;
  competitor2Estrategia: string;

  competitor3Name: string;
  competitor3Reviews: number;
  competitor3Nota: string;
  competitor3Estrategia: string;

  // Chapter 4 Pricing
  setupTitle: string;
  setupSubtitle: string;
  setupValor: string;
  
  planoMensal: string;
  planoTrimestral: string;
  planoTrimestralSub: string;
  planoSemestral: string;
  planoSemestralSub: string;
  planoAnual: string;
  planoAnualSub: string;

  // Chapter 5 PIX
  pixChave: string;
  pixTitular: string;
  pixBanco: string;

  // Custom Logos
  boxLogoUrl?: string;
  clientLogoUrl?: string;
}

export const defaultFivePageData: FivePageProposalState = {
  clientName: 'Dra. Luzia Alves',
  clientTitle: 'Nutricionista Clínica',
  niche: 'Nutrição Clínica & Emagrecimento',
  cityState: 'Sinop/MT',
  crnCrm: 'CRN 16485',
  responsavelTecnico: 'Rômulo Chaves da Silva',
  periodoAcompanhamento: '60 Dias com Gestão Ativa',
  dataEmissao: '27 de Setembro de 2026',

  quoteCap1: 'O município de Sinop tem um dos mercados de saúde privada mais aquecidos do estado. Centenas de mulheres com mais de 40 anos, com diabetes tipo 2 ou em busca de emagrecimento clínico pesquisam no Google por "Nutricionista em Sinop". Contudo, a Clínica Qualitativa está invisível para a pesquisa principal. O problema não é sua competência técnica: é estritamente cadastral e de indexação algorítmica.',

  catRaiz: 'Genérica',
  catRaizSub: 'Sem Match Exato',
  catalogo: 'Inexistente',
  catalogoSub: 'Sem Serviços',
  website: 'Sem Link',
  websiteSub: 'Fricção de Contato',
  acompanhamento: '60 Dias',
  acompanhamentoSub: 'Gestão & Posts Semanais',

  erroCategoria: 'Categoria médica genérica sem correspondência raiz',
  erroCategoriaImpacto: 'O Google descarta o perfil nas buscas por "Nutricionista em Sinop".',
  erroCatalogo: 'Bioimpedância, diabetes e menopausa ausentes',
  erroCatalogoImpacto: 'Pacientes 40+ não veem segurança no tratamento e buscam quem detalha.',
  erroWebsite: 'Sem direcionamento direto e fluido para o WhatsApp',
  erroWebsiteImpacto: 'A paciente clica com dor/urgência, não encontra canal rápido e desiste.',
  erroPosicionamento: 'Perfil não indexado para termos de cauda longa',
  erroPosicionamentoImpacto: 'Buscas de alto ticket em Sinop são interceptadas pelos concorrentes.',

  competitor1Name: 'Vanessa Araújo',
  competitor1Reviews: 73,
  competitor1Nota: '5.0 ★',
  competitor1Estrategia: 'SEO de cauda longa no título do perfil ("Emagrecimento, hipertrofia e saúde da mulher").',

  competitor2Name: 'Katya Benedetti',
  competitor2Reviews: 56,
  competitor2Nota: '5.0 ★',
  competitor2Estrategia: 'Descrição institucional aprofundada segmentando Nutrição Esportiva, Gastro e Mulher.',

  competitor3Name: 'NutriCenter',
  competitor3Reviews: 45,
  competitor3Nota: '4.9 ★',
  competitor3Estrategia: 'Catálogo agressivo de consultas e exames complementares direto na vitrine de busca.',

  setupTitle: 'Setup Raiz + 60 Dias de Acompanhamento Técnico',
  setupSubtitle: 'Otimização Completa, 60 Dias de Gestão com Posts Semanais e Relatórios Mensais',
  setupValor: 'R$ 700,00',

  planoMensal: 'R$ 300,00 / mês',
  planoTrimestral: 'R$ 810,00',
  planoTrimestralSub: 'R$ 270/mês • 10% OFF',
  planoSemestral: 'R$ 1.440,00',
  planoSemestralSub: 'R$ 240/mês • 20% OFF',
  planoAnual: 'R$ 2.520,00',
  planoAnualSub: 'R$ 210/mês • 30% OFF',

  pixChave: '(68) 98103-4408',
  pixTitular: 'Rômulo Chaves da Silva',
  pixBanco: 'Banco Sicredi'
};

interface FivePageProposalModelProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const FivePageProposalModel: React.FC<FivePageProposalModelProps> = ({ showToast }) => {
  const [data, setData] = useState<FivePageProposalState>(defaultFivePageData);
  const [promptText, setPromptText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Custom Logos
  const [boxLogoUrl, setBoxLogoUrl] = useState<string>('image_2.png');
  const [clientLogoUrl, setClientLogoUrl] = useState<string>('image_3.png');

  // One-click text prompt generator parser
  const handleGenerateFromText = async () => {
    if (!promptText.trim()) {
      showToast('Digite ou cole as informações da proposta no campo de texto.', 'error');
      return;
    }

    setIsGenerating(true);
    showToast('Analisando texto e construindo proposta comercial de 5 páginas...', 'info');

    try {
      // Simulate/Parse intelligent fields from user text input
      const text = promptText.trim();

      // Extract client name
      let name = 'Cliente Especial';
      const nameMatch = text.match(/(?:cliente|dra\.|dr\.|empresa|nome):\s*([^,.\n]+)/i) || text.match(/(Dra?\.\s*[A-Z][a-z]+\s*[A-Z][a-z]+)/);
      if (nameMatch) name = nameMatch[1].trim();

      // Extract city/state
      let city = 'Sinop/MT';
      const cityMatch = text.match(/(?:cidade|local|praça|em):\s*([^,.\n]+)/i) || text.match(/([A-Z][a-z\s]+\/[A-Z]{2})/);
      if (cityMatch) city = cityMatch[1].trim();

      // Extract niche / specialty
      let niche = 'Clínica de Saúde & Estética';
      const nicheMatch = text.match(/(?:nicho|segmento|área|especialidade):\s*([^,.\n]+)/i);
      if (nicheMatch) niche = nicheMatch[1].trim();

      // Extract price / setup
      let price = 'R$ 700,00';
      const priceMatch = text.match(/(?:valor|setup|preço|investimento):\s*(R\$\s*[\d.,]+)/i);
      if (priceMatch) price = priceMatch[1].trim();

      // Update state dynamically
      setData((prev) => ({
        ...prev,
        clientName: name,
        clientTitle: niche,
        niche: niche,
        cityState: city,
        setupValor: price,
        quoteCap1: `O mercado de ${niche} em ${city} possui uma forte demanda de buscas ativas no Google. Pacientes e clientes pesquisam diariamente por "melhores profissionais em ${city}", porém o perfil de ${name} necessita de estruturação algorítmica para liderar as primeiras posições do Google Maps.`,
        erroCategoriaImpacto: `O Google descarta o perfil nas buscas por "${niche} em ${city}".`,
        erroPosicionamentoImpacto: `Buscas de alto valor em ${city} estão sendo capturadas pelos concorrentes.`
      }));

      showToast(`Proposta comercial para "${name}" gerada com sucesso!`, 'success');
    } catch (err) {
      showToast('Erro ao processar texto. Verifique as informações.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBoxLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) setBoxLogoUrl(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) setClientLogoUrl(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen ${isLightMode ? 'bg-slate-300 text-slate-900' : 'bg-[#050811] text-white'} font-sans pb-20`}>
      
      {/* TOOLBAR DOCK & TEXT PROMPT INPUT BOX */}
      <div className="sticky top-0 z-50 bg-[#0b0f19] border-b-2 border-[#38bdf8] p-4 sm:p-5 shadow-2xl space-y-4 print:hidden">
        <div className="max-w-6xl mx-auto space-y-3">
          
          {/* HEADER & CONTROLS */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#182030] rounded-xl border border-slate-700 text-[#38bdf8]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  Gerador de Proposta Comercial & Diagnóstico (Modelo de 5 Páginas)
                </h2>
                <p className="text-xs text-slate-400">
                  Cole um texto com os dados do cliente para gerar automaticamente toda a proposta técnica oficial para impressão.
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 bg-[#1e293b] text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:border-[#38bdf8]">
                <Upload className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Logo ClienteBox</span>
                <input type="file" accept="image/*" onChange={handleBoxLogoUpload} className="hidden" />
              </label>

              <label className="flex items-center gap-1.5 bg-[#1e293b] text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:border-[#38bdf8]">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Foto/Logo Cliente</span>
                <input type="file" accept="image/*" onChange={handleClientLogoUpload} className="hidden" />
              </label>

              <button
                onClick={() => setIsLightMode(!isLightMode)}
                className="px-3.5 py-1.5 rounded-lg bg-[#334155] hover:bg-[#475569] text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{isLightMode ? 'Modo Escuro' : 'Modo Claro'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#38bdf8] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-[#050811] font-black text-xs shadow-lg flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>GERAR PDF OFICIAL (Ctrl + P)</span>
              </button>
            </div>
          </div>

          {/* TEXT PROMPT INPUT FIELD FOR 1-CLICK AI GENERATION */}
          <div className="bg-[#121a2f] p-3 sm:p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              Campo de Texto Inteligente — Digite ou Cole as informações do cliente abaixo:
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={2}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder='Ex: "Cliente: Dra. Fernanda Lima, Dermatologista em Manaus/AM. Ficha sem catálogo e sem botão de WhatsApp. Setup: R$ 800,00 com 60 dias de gestão inclusos."'
                className="flex-1 bg-[#18233c] border border-slate-700 text-white placeholder-slate-500 text-xs p-3 rounded-xl focus:outline-none focus:border-[#38bdf8] font-sans"
              />
              <button
                onClick={handleGenerateFromText}
                disabled={isGenerating}
                className="bg-[#ff5722] hover:bg-[#e64a19] text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Gerar Tudo com 1 Clique</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 5-PAGE DOCUMENT CONTAINER */}
      <div className={`max-w-[210mm] mx-auto space-y-8 my-6 ${isLightMode ? 'light-mode-styles' : ''}`}>
        
        {/* PAGE 1: COVER */}
        <div className="a4-page bg-[#0a0f1d] border border-[#1f2d4a] rounded-xl p-[12mm_15mm] shadow-2xl relative min-h-[297mm] flex flex-col justify-between overflow-hidden">
          <div className="absolute w-[360px] h-[360px] bg-[radial-gradient(circle,_rgba(56,189,248,0.15)_0%,_rgba(0,0,0,0)_70%)] top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          {/* Cover Header */}
          <div className="flex justify-between items-center pb-4 border-b-2 border-[#1f2d4a] z-10">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-1 shadow-lg">
                <img src={boxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Cliente<span className="text-[#ff5722]">Box</span></h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#38bdf8]">Gestão Estratégica & Inteligência no Maps</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <h4 className="text-base font-extrabold text-white">{data.clientName}</h4>
                <p className="text-xs text-slate-400">{data.clientTitle} • {data.crnCrm}</p>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1f2d4a] bg-white flex items-center justify-center shadow-lg">
                <img src={clientLogoUrl} alt={data.clientName} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Cover Body */}
          <div className="text-center my-auto py-6 z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#38bdf8]/10 border border-[#38bdf8] rounded-full text-xs font-extrabold uppercase tracking-widest text-[#38bdf8]">
              Diagnóstico de Presença Local & Proposta Técnica
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              ESTRUTURAÇÃO E GESTÃO<br />NO GOOGLE MAPS
            </h1>
            <div className="text-lg font-extrabold text-[#ff5722] uppercase tracking-widest">
              {data.clientName.toUpperCase()} • {data.cityState.toUpperCase()}
            </div>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Engenharia de SEO local, catalogação de especialidades, 60 dias de acompanhamento contínuo com publicações semanais e relatórios mensais de desempenho para posicionar o perfil nas buscas ativas.
            </p>
          </div>

          {/* Cover Meta Grid */}
          <div className="grid grid-cols-3 gap-3 bg-[#121a2f] border border-[#1f2d4a] rounded-xl p-4 z-10">
            <div>
              <h5 className="text-[10px] uppercase font-bold text-slate-400">Responsável Técnico</h5>
              <p className="text-xs font-extrabold text-white">{data.responsavelTecnico}</p>
            </div>
            <div>
              <h5 className="text-[10px] uppercase font-bold text-slate-400">Período de Acompanhamento</h5>
              <p className="text-xs font-extrabold text-white">{data.periodoAcompanhamento}</p>
            </div>
            <div>
              <h5 className="text-[10px] uppercase font-bold text-slate-400">Praça & Ciclo</h5>
              <p className="text-xs font-extrabold text-white">{data.cityState} • {data.dataEmissao}</p>
            </div>
          </div>
        </div>

        {/* PAGE 2: CAPÍTULO 01 - O ABISMO DE AUTORIDADE */}
        <div className="a4-page bg-[#0a0f1d] border border-[#1f2d4a] rounded-xl p-[12mm_15mm] shadow-2xl min-h-[297mm] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Page Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#1f2d4a]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg p-1">
                  <img src={boxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Cliente<span className="text-[#ff5722]">Box</span></h2>
                  <p className="text-[8px] uppercase font-bold text-[#38bdf8]">Inteligência no Maps</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-extrabold text-white">{data.clientName}</h4>
                <p className="text-[10px] text-slate-400">{data.cityState}</p>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-wider">Capítulo 01. O Abismo de Autoridade</div>
              <h3 className="text-lg font-black text-white">Por Que o Perfil Está Invisível nas Buscas Ativas?</h3>
            </div>

            <div className="bg-[#121a2f] border-l-4 border-[#38bdf8] p-3 rounded-r-lg text-xs italic text-slate-200 leading-relaxed">
              "{data.quoteCap1}"
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#121a2f] border border-[#1f2d4a] p-2.5 rounded-lg text-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Categoria Raiz</div>
                <div className="text-base font-black text-rose-500">{data.catRaiz}</div>
                <div className="text-[9px] font-bold text-rose-400">{data.catRaizSub}</div>
              </div>
              <div className="bg-[#121a2f] border border-[#1f2d4a] p-2.5 rounded-lg text-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Catálogo no Google</div>
                <div className="text-base font-black text-rose-500">{data.catalogo}</div>
                <div className="text-[9px] font-bold text-rose-400">{data.catalogoSub}</div>
              </div>
              <div className="bg-[#121a2f] border border-[#1f2d4a] p-2.5 rounded-lg text-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Canal no Website</div>
                <div className="text-base font-black text-rose-500">{data.website}</div>
                <div className="text-[9px] font-bold text-rose-400">{data.websiteSub}</div>
              </div>
              <div className="bg-[#121a2f] border border-[#1f2d4a] p-2.5 rounded-lg text-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase">Acompanhamento</div>
                <div className="text-base font-black text-emerald-400">{data.acompanhamento}</div>
                <div className="text-[9px] font-bold text-emerald-400">{data.acompanhamentoSub}</div>
              </div>
            </div>

            {/* Audit Table */}
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#121a2f] text-white border-b-2 border-[#1f2d4a]">
                  <th className="p-2 text-[10px] uppercase font-bold">Parâmetro Auditado</th>
                  <th className="p-2 text-[10px] uppercase font-bold">Situação Atual Identificada</th>
                  <th className="p-2 text-[10px] uppercase font-bold">Status Técnico</th>
                  <th className="p-2 text-[10px] uppercase font-bold">Impacto Comercial Direto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d4a] text-slate-300">
                <tr>
                  <td className="p-2 font-bold text-white">Erro Estrutural de Categoria</td>
                  <td className="p-2">{data.erroCategoria}</td>
                  <td className="p-2"><span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded">Incompatível</span></td>
                  <td className="p-2">{data.erroCategoriaImpacto}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">Catálogo de Especialidades</td>
                  <td className="p-2">{data.erroCatalogo}</td>
                  <td className="p-2"><span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded">Oculto</span></td>
                  <td className="p-2">{data.erroCatalogoImpacto}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">Fricção no Link Website</td>
                  <td className="p-2">{data.erroWebsite}</td>
                  <td className="p-2"><span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded">Perda de Leads</span></td>
                  <td className="p-2">{data.erroWebsiteImpacto}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">Posicionamento de Busca</td>
                  <td className="p-2">{data.erroPosicionamento}</td>
                  <td className="p-2"><span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-extrabold px-2 py-0.5 rounded">Sem Relevância</span></td>
                  <td className="p-2">{data.erroPosicionamentoImpacto}</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-[#121a2f] border border-[#1f2d4a] p-3 rounded-lg space-y-1">
              <h4 className="text-xs font-bold text-[#38bdf8]">O Paradoxo da Presença Digital da Clínica</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "A concorrência não atende melhor que você; ela apenas está posicionada onde a paciente procura. Ao estruturarmos as categorias corretas, organizarmos o catálogo clínico e mantermos o perfil ativo com postagens semanais por 60 dias, o perfil passa a disputar ativamente essa demanda."
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1f2d4a] flex justify-between text-[10px] text-slate-400">
            <span>ClienteBox — Gestão Estratégica & Inteligência no Google Maps</span>
            <span>Página 2 de 5</span>
          </div>
        </div>

        {/* PAGE 3: CAPÍTULO 02 & 03 - BENCHMARK & ENGENHARIA SEO */}
        <div className="a4-page bg-[#0a0f1d] border border-[#1f2d4a] rounded-xl p-[12mm_15mm] shadow-2xl min-h-[297mm] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#1f2d4a]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg p-1">
                  <img src={boxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Cliente<span className="text-[#ff5722]">Box</span></h2>
                  <p className="text-[8px] uppercase font-bold text-[#38bdf8]">Inteligência no Maps</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-extrabold text-white">{data.clientName}</h4>
                <p className="text-[10px] text-slate-400">{data.cityState}</p>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-wider">Capítulo 02. Inteligência Competitiva</div>
              <h3 className="text-lg font-black text-white">Benchmark do Mercado em {data.cityState}</h3>
            </div>

            {/* Competitor Chart */}
            <div className="bg-[#121a2f] border border-[#1f2d4a] rounded-xl p-3 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Volume de Prova Social Acumulada no Google Maps — {data.cityState}</span>
                <span className="text-[#38bdf8]">Busca: {data.niche}</span>
              </div>

              <div className="flex items-end justify-around h-28 pt-4 border-b-2 border-[#1f2d4a] pb-1">
                <div className="flex flex-col items-center w-[18%] h-full justify-end">
                  <div className="w-full bg-slate-600 rounded-t-lg relative flex justify-center h-[90%]">
                    <span className="absolute -top-4 text-[10px] font-bold text-white">{data.competitor1Reviews} Reviews</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 text-center">{data.competitor1Name}</span>
                </div>

                <div className="flex flex-col items-center w-[18%] h-full justify-end">
                  <div className="w-full bg-slate-600 rounded-t-lg relative flex justify-center h-[72%]">
                    <span className="absolute -top-4 text-[10px] font-bold text-white">{data.competitor2Reviews} Reviews</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 text-center">{data.competitor2Name}</span>
                </div>

                <div className="flex flex-col items-center w-[18%] h-full justify-end">
                  <div className="w-full bg-slate-600 rounded-t-lg relative flex justify-center h-[58%]">
                    <span className="absolute -top-4 text-[10px] font-bold text-white">{data.competitor3Reviews} Reviews</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 text-center">{data.competitor3Name}</span>
                </div>

                <div className="flex flex-col items-center w-[18%] h-full justify-end">
                  <div className="w-full bg-rose-500 rounded-t-lg relative flex justify-center h-[12%]">
                    <span className="absolute -top-4 text-[10px] font-bold text-rose-400">Invisível</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 mt-1 text-center">{data.clientName}<br /><small>Atual</small></span>
                </div>

                <div className="flex flex-col items-center w-[18%] h-full justify-end">
                  <div className="w-full bg-emerald-500 rounded-t-lg relative flex justify-center h-[75%]">
                    <span className="absolute -top-4 text-[10px] font-bold text-emerald-300">Plano Ativo</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 mt-1 text-center">{data.clientName}<br /><small>60 Dias</small></span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-wider">Capítulo 03. Engenharia de SEO Local</div>
              <h3 className="text-base font-black text-white">O Que Depende Diretamente da Nossa Execução Técnica</h3>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#121a2f] text-white border-b-2 border-[#1f2d4a]">
                  <th className="p-2 text-[10px] uppercase font-bold text-left">Perfil Concorrente</th>
                  <th className="p-2 text-[10px] uppercase font-bold text-left">Volume & Avaliações</th>
                  <th className="p-2 text-[10px] uppercase font-bold text-left">Estratégia Utilizada no Google Maps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d4a] text-slate-300">
                <tr>
                  <td className="p-2 font-bold text-white">{data.competitor1Name}</td>
                  <td className="p-2">{data.competitor1Reviews} avaliações ({data.competitor1Nota})</td>
                  <td className="p-2">{data.competitor1Estrategia}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">{data.competitor2Name}</td>
                  <td className="p-2">{data.competitor2Reviews} avaliações ({data.competitor2Nota})</td>
                  <td className="p-2">{data.competitor2Estrategia}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">{data.competitor3Name}</td>
                  <td className="p-2">{data.competitor3Reviews} avaliações ({data.competitor3Nota})</td>
                  <td className="p-2">{data.competitor3Estrategia}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-rose-400">{data.clientName}</td>
                  <td className="p-2 text-rose-400">Fora do Ranking</td>
                  <td className="p-2 text-rose-400">Categoria genérica, ausência de catálogo e falta de link de conversão direta.</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-[#121a2f] border border-[#1f2d4a] p-3 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-[#38bdf8]">Entregáveis Estruturais Sob Nossa Responsabilidade:</h4>
              <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                <li><strong>Otimização Cadastral Raiz GBP:</strong> Configuração para categorias exatas e dados institucionais completos.</li>
                <li><strong>SEO Local com Termos Estratégicos:</strong> Redação com foco em termos de alta busca na praça de {data.cityState}.</li>
                <li><strong>Catálogo Clínico Estruturado:</strong> Vitrine completa dos serviços e procedimentos principais.</li>
                <li><strong>Link Direto no Botão Website:</strong> Rota rastreada para conversão direta no WhatsApp sem dispersão.</li>
                <li><strong>Sistema de Captação de Reviews 5★:</strong> Script e link encurtado para coleta organizada de avaliações.</li>
                <li><strong>Gestão Contínua por 60 Dias:</strong> Publicações semanais no Google Meu Negócio e relatório mensal de desempenho.</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1f2d4a] flex justify-between text-[10px] text-slate-400">
            <span>ClienteBox — Gestão Estratégica & Inteligência no Google Maps</span>
            <span>Página 3 de 5</span>
          </div>
        </div>

        {/* PAGE 4: CAPÍTULO 04 - PROPOSTA DE INVESTIMENTO */}
        <div className="a4-page bg-[#0a0f1d] border border-[#1f2d4a] rounded-xl p-[12mm_15mm] shadow-2xl min-h-[297mm] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#1f2d4a]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg p-1">
                  <img src={boxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Cliente<span className="text-[#ff5722]">Box</span></h2>
                  <p className="text-[8px] uppercase font-bold text-[#38bdf8]">Inteligência no Maps</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-extrabold text-white">{data.clientName}</h4>
                <p className="text-[10px] text-slate-400">{data.cityState}</p>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-wider">Capítulo 04. Escada de Valor & Acompanhamento de 60 Dias</div>
              <h3 className="text-lg font-black text-white">Proposta de Investimento e Planos de Gestão Técnica</h3>
            </div>

            {/* Pricing Box */}
            <div className="bg-gradient-to-r from-[#0284c7]/20 to-[#121a2f] border-2 border-[#38bdf8] p-4 rounded-xl flex justify-between items-center">
              <div>
                <div className="text-sm font-black text-white">{data.setupTitle}</div>
                <div className="text-xs text-[#38bdf8] mt-0.5">{data.setupSubtitle}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{data.setupValor} <span className="text-xs font-normal text-slate-400">(Taxa Única)</span></div>
              </div>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#121a2f] text-white border-b-2 border-[#1f2d4a]">
                  <th className="p-2 text-[10px] uppercase font-bold text-left">Modalidade de Continuidade Após 60 Dias</th>
                  <th className="p-2 text-[10px] uppercase font-bold text-left">Escopo Operacional</th>
                  <th className="p-2 text-[10px] uppercase font-bold text-left">Investimento & Vantagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d4a] text-slate-300">
                <tr>
                  <td className="p-2 font-bold text-white">Manutenção Mensal</td>
                  <td className="p-2">Métricas mensais, auditoria da concorrência, postagens no perfil e suporte operacional.</td>
                  <td className="p-2 font-bold text-white">{data.planoMensal}</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">Plano Trimestral</td>
                  <td className="p-2">Manutenção contínua e inteligência analítica por 3 meses.</td>
                  <td className="p-2 font-bold text-emerald-400">{data.planoTrimestral} <span className="text-[10px] text-slate-400 font-normal">({data.planoTrimestralSub})</span></td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">Plano Semestral</td>
                  <td className="p-2">Gestão contínua com prioridade de ranqueamento por 6 meses.</td>
                  <td className="p-2 font-bold text-emerald-400">{data.planoSemestral} <span className="text-[10px] text-slate-400 font-normal">({data.planoSemestralSub})</span></td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-white">Plano Anual</td>
                  <td className="p-2">Gestão técnica completa por 12 meses contínuos.</td>
                  <td className="p-2 font-bold text-emerald-400">{data.planoAnual} <span className="text-[10px] text-slate-400 font-normal">({data.planoAnualSub})</span></td>
                </tr>
              </tbody>
            </table>

            <div className="bg-[#121a2f] border border-[#1f2d4a] p-3 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-[#38bdf8]">🎁 Itens Inclusos no Ciclo de 60 Dias da Contratação:</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc">
                <li><strong>60 Dias de Acompanhamento Técnico:</strong> Monitoramento contínuo das métricas, correções cadastrais e suporte direto.</li>
                <li><strong>Publicações Semanais no Perfil:</strong> Alimentação periódica da ficha com conteúdos técnicos e imagens profissionais.</li>
                <li><strong>Relatório Mensal de Desempenho:</strong> Emissão de painel analítico mensal detalhando visualizações, rotas e cliques de contato.</li>
                <li><strong>Disponibilização de Material para Redes:</strong> Artes e textos criados entregues em alta resolução para uso livre.</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1f2d4a] flex justify-between text-[10px] text-slate-400">
            <span>ClienteBox — Gestão Estratégica & Inteligência no Google Maps</span>
            <span>Página 4 de 5</span>
          </div>
        </div>

        {/* PAGE 5: CAPÍTULO 05 - GARANTIA & PRÓXIMOS PASSOS */}
        <div className="a4-page bg-[#0a0f1d] border border-[#1f2d4a] rounded-xl p-[12mm_15mm] shadow-2xl min-h-[297mm] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-[#1f2d4a]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg p-1">
                  <img src={boxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Cliente<span className="text-[#ff5722]">Box</span></h2>
                  <p className="text-[8px] uppercase font-bold text-[#38bdf8]">Inteligência no Maps</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-xs font-extrabold text-white">{data.clientName}</h4>
                <p className="text-[10px] text-slate-400">{data.cityState}</p>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase tracking-wider">Capítulo 05. Garantia Operacional & Próximos Passos</div>
              <h3 className="text-lg font-black text-white">Compromisso Técnico de Entrega & Ativação</h3>
            </div>

            <div className="bg-[#121a2f] border-l-4 border-emerald-400 p-3.5 rounded-r-lg text-xs text-slate-200 leading-relaxed space-y-1">
              <strong className="text-emerald-400 block font-extrabold">Garantia Operacional de Execução Técnica (60 Dias):</strong>
              <p>
                Nosso compromisso consiste na entrega rigorosa da otimização inicial e no acompanhamento ativo de 60 dias com publicações semanais e relatórios mensais. Se ao final dos 60 dias o perfil de {data.clientName} não registrar elevação mensurável em visualizações da ficha, solicitações de rotas e cliques de contato, continuaremos executando os ajustes técnicos gratuitamente até que essa expansão aconteça.
              </p>
            </div>

            <div className="bg-[#121a2f] border border-[#1f2d4a] p-3 rounded-lg space-y-1">
              <h4 className="text-xs font-bold text-[#38bdf8]">Cronograma de Ativação</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Alinhamento inicial de 10 minutos para validação de acessos e definição do catálogo de serviços.<br />
                2. Formalização do termo de prestação e liberação da ordem de serviço do Setup Inicial.<br />
                3. Execução das correções no Google Meu Negócio e início imediato do ciclo de 60 dias com publicações semanais.
              </p>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-extrabold text-[#38bdf8] uppercase">Dados Oficiais para Liquidação do Setup Inicial</div>
              <div className="text-xs font-bold text-white">Investimento Inicial: {data.setupValor} (Taxa Única com 60 Dias Inclusos)</div>
            </div>

            {/* PIX Box */}
            <div className="bg-[#121a2f] border border-dashed border-[#38bdf8] rounded-xl p-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-[9px] uppercase font-bold text-slate-400">Chave PIX (Celular)</div>
                <div className="text-xs font-black text-[#38bdf8] mt-0.5">{data.pixChave}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-slate-400">Titular da Conta</div>
                <div className="text-xs font-black text-[#38bdf8] mt-0.5">{data.pixTitular}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-slate-400">Instituição Bancária</div>
                <div className="text-xs font-black text-[#38bdf8] mt-0.5">{data.pixBanco}</div>
              </div>
            </div>

            {/* Signature */}
            <div className="pt-6 text-center space-y-0.5">
              <div className="text-sm font-black text-white">{data.responsavelTecnico}</div>
              <div className="text-xs text-slate-400">Consultor Sênior em Presença Digital & SEO Local • ClienteBox</div>
              <div className="text-[10px] text-[#38bdf8]">{data.cityState} • {data.dataEmissao}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1f2d4a] flex justify-between text-[10px] text-slate-400">
            <span>ClienteBox — Gestão Estratégica & Inteligência no Google Maps</span>
            <span>Página 5 de 5</span>
          </div>
        </div>

      </div>
    </div>
  );
};
