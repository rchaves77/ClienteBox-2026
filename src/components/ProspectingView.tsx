import React, { useState } from 'react';
import { AppState, CommercialProposalData, Company } from '../types';
import { juLopesProposalData, eletroRodriguesProposalData, defaultProposalData } from '../data/defaultProposal';
import { LogoSvg } from './LogoSvg';
import { ProposalGenerator } from './ProposalGenerator';
import { FivePageProposalModel } from './FivePageProposalModel';
import { 
  Sparkles, Download, Copy, Check, ShieldCheck, Zap, Printer, MessageSquare, 
  FileText, Loader2, Building2, Sun, Moon, Upload, RefreshCw, Layers, Users, BookOpen
} from 'lucide-react';
import { BRAZIL_CITIES, LIBERAL_PROFESSIONS } from '../data/brazilCities';

interface ProspectingViewProps {
  appState?: AppState;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onAddCompany: (company: Company) => void;
  onUpdateCompany?: (company: Company) => void;
  onSelectCompany?: (id: string) => void;
  onPrintReport: () => void;
}

export const ProspectingView: React.FC<ProspectingViewProps> = ({
  appState,
  showToast,
  onAddCompany,
  onUpdateCompany,
  onSelectCompany,
  onPrintReport
}) => {
  const [proposal, setProposal] = useState<CommercialProposalData>(juLopesProposalData);
  const [subTab, setSubTab] = useState<'five_pages' | 'script' | 'proposal' | 'crm'>('five_pages');
  const [reportTheme, setReportTheme] = useState<'dark' | 'light'>('dark');
  const [selectedPreset, setSelectedPreset] = useState<'juLopes' | 'eletroRodrigues'>('juLopes');
  
  // Custom Logos State
  const [clienteBoxLogoUrl, setClienteBoxLogoUrl] = useState<string | null>(null);
  const [clientLogoUrl, setClientLogoUrl] = useState<string | null>(null);

  // Lead Audit Form State
  const [companyName, setCompanyName] = useState('Ju Lopes Estética');
  const [niche, setNiche] = useState('Clínica de Estética & Saúde');
  const [city, setCity] = useState('Goiânia / GO');
  const [mapsUrl, setMapsUrl] = useState('Ju Lopes Estética (32 avaliações, nota 5.0)');
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/julopesestetica');
  const [leadDetails, setLeadDetails] = useState('13k seguidores no Instagram, parada no Google desde maio/2024, site aponta pro Insta');
  const [isLoading, setIsLoading] = useState(false);

  // Copy tracking
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const crmList = Object.values(appState?.companies || {});

  const copyToClipboard = (text: string, keyName: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(`${label} copiado para a área de transferência!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Switch presets
  const handleSelectPreset = (preset: 'juLopes' | 'eletroRodrigues') => {
    setSelectedPreset(preset);
    if (preset === 'juLopes') {
      setProposal(juLopesProposalData);
      setCompanyName('Ju Lopes Estética');
      setNiche('Clínica de Estética & Saúde');
      setCity('Goiânia / GO');
      setMapsUrl('Ju Lopes Estética (32 avaliações, nota 5.0)');
      setInstagramUrl('https://www.instagram.com/julopesestetica');
      setLeadDetails('13k seguidores no Insta, parado no Google desde maio/2024');
      showToast('Modelo de proposta Ju Lopes Estética carregado!', 'info');
    } else {
      setProposal(eletroRodriguesProposalData);
      setCompanyName('Eletro Rodrigues');
      setNiche('Serviços Elétricos e Manutenção Predial');
      setCity('Goiânia / GO');
      setMapsUrl('Eletro Rodrigues (19 avaliações, nota 4.8)');
      setInstagramUrl('https://www.instagram.com/eletro_rodriguez');
      setLeadDetails('Erro cadastral no Maps: "não atende no local", nome com S/Z');
      showToast('Modelo de proposta Eletro Rodrigues carregado!', 'info');
    }
  };

  // Handle image upload for ClienteBox logo
  const handleUploadClienteBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setClienteBoxLogoUrl(url);
      showToast('Logo ClienteBox atualizada!', 'success');
    }
  };

  // Handle image upload for Client logo
  const handleUploadClient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setClientLogoUrl(url);
      showToast('Logo do Cliente atualizada!', 'success');
    }
  };

  // AI Generation call
  const handleGenerateProposal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    showToast('Auditando lead e gerando proposta comercial com Gemini IA...', 'info');

    try {
      const response = await fetch('/api/ai-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyName || proposal.documento.cliente.nome_fantasia,
          niche: niche || proposal.documento.cliente.nicho,
          city: city || proposal.documento.cliente.cidade_uf,
          mapsUrl,
          instagramUrl,
          leadDetails
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || 'Erro ao comunicar com a IA');
      }

      const newProposal: CommercialProposalData = await response.json();
      setProposal(newProposal);
      showToast('Auditoria e Proposta Comercial geradas com sucesso!', 'success');
    } catch (err: any) {
      console.error('Erro na auditoria/proposta com Gemini:', err);
      showToast(err?.message || 'Falha ao gerar proposta com IA. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save or update lead in CRM without duplicate entries
  const handleSaveToCrm = () => {
    const clientData = proposal.documento.cliente;
    const targetName = (companyName || clientData.nome_fantasia || '').trim();

    if (!targetName) {
      showToast('Por favor, informe o nome da empresa para salvar no CRM.', 'error');
      return;
    }

    // Check if company already exists in appState by normalized name match
    const existingEntry = crmList.find(
      (c) => c.nome.toLowerCase().trim() === targetName.toLowerCase().trim()
    );

    if (existingEntry) {
      // Deduplicated Update
      const updatedCompany: Company = {
        ...existingEntry,
        nome: targetName,
        responsavel: clientData.responsavel || existingEntry.responsavel,
        categoria: niche || clientData.nicho || existingEntry.categoria,
        endereco: city || `${clientData.bairro}, ${clientData.cidade_uf}` || existingEntry.endereco,
        dataIntervencao: new Date().toLocaleDateString('pt-BR'),
        acoes: proposal.engenharia_seo_local.escopo_execucao_taxa_unica,
        diagnosticoCustom: proposal.diagnostico_cenario_atual.resumo_executivo,
        concorrentes: proposal.inteligencia_competitiva.dados_grafico.map((g, idx) => ({
          nome: g.empresa,
          posicao: idx === 0 ? "Top 1 Líder" : `Top ${idx + 1}`,
          categoria: niche || clientData.nicho,
          nota: String(g.nota || "5.0"),
          status: g.status
        }))
      };

      if (onUpdateCompany) {
        onUpdateCompany(updatedCompany);
      } else {
        onAddCompany(updatedCompany);
      }

      if (onSelectCompany) {
        onSelectCompany(updatedCompany.id);
      }

      showToast(`Empresa "${updatedCompany.nome}" já existe no CRM! Dados e auditoria atualizados sem duplicar registro.`, 'success');
    } else {
      // New Company Creation
      const newComp: Company = {
        id: `lead_${Date.now()}`,
        nome: targetName,
        responsavel: clientData.responsavel || "Gestor / Proprietário",
        categoria: niche || clientData.nicho || "Geral",
        endereco: city || `${clientData.bairro}, ${clientData.cidade_uf}` || "Goiânia / GO",
        ltv: proposal.viabilidade_financeira.ticket_medio_servico.includes('200') ? 2400 : 4200,
        pixChave: proposal.documento.empresa_consultora.dados_pagamento.chave_pix,
        pixFavorecido: proposal.documento.empresa_consultora.dados_pagamento.titular,
        pixBanco: proposal.documento.empresa_consultora.dados_pagamento.instituicao_bancaria,
        periodo: `${proposal.documento.data_emissao}`,
        ciclo: "Ciclo Inicial Otimização",
        dataIntervencao: new Date().toLocaleDateString('pt-BR'),
        metricasAnterior: { interacoes: 50, rotas: 20, chats: 15, ligacoes: 15 },
        metricasAtual: { interacoes: 120, rotas: 60, chats: 35, ligacoes: 25 },
        acoes: proposal.engenharia_seo_local.escopo_execucao_taxa_unica,
        proximosPassos: [
          "Início da otimização técnica no Google Business Profile",
          "Ativação da coleta ativa de avaliações pós-atendimento",
          "Troca do canal de agendamento para o WhatsApp nativo"
        ],
        concorrentes: proposal.inteligencia_competitiva.dados_grafico.map((g, idx) => ({
          nome: g.empresa,
          posicao: idx === 0 ? "Top 1 Líder" : `Top ${idx + 1}`,
          categoria: niche || clientData.nicho,
          nota: String(g.nota || "5.0"),
          status: g.status
        })),
        diagnosticoCustom: proposal.diagnostico_cenario_atual.resumo_executivo
      };

      onAddCompany(newComp);
      if (onSelectCompany) {
        onSelectCompany(newComp.id);
      }
      showToast(`Nova empresa "${newComp.nome}" salva com sucesso na lista de acompanhamento (CRM)!`, 'success');
    }
  };

  // Load company into input fields for real-time re-analysis
  const handleReanalyzeCompany = (comp: Company) => {
    setCompanyName(comp.nome);
    setNiche(comp.categoria);
    setCity(comp.endereco);
    setMapsUrl(`${comp.nome} - perfil Google Maps`);
    setLeadDetails(`Re-análise periódica da empresa ${comp.nome}. Última intervenção cadastrada: ${comp.dataIntervencao}.`);
    
    // Sync proposal state
    setProposal((prev) => ({
      ...prev,
      documento: {
        ...prev.documento,
        cliente: {
          ...prev.documento.cliente,
          nome_fantasia: comp.nome,
          nicho: comp.categoria,
          cidade_uf: comp.endereco
        }
      }
    }));

    showToast(`Dados de "${comp.nome}" carregados no auditor! Clique em "Auditar Novo Lead com IA" para re-analisar.`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scripts = proposal.scripts_comerciais_whatsapp;
  const isDark = reportTheme === 'dark';

  return (
    <div className="w-full bg-[#0b0e14] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-100 font-sans print:bg-white print:text-slate-900 print:p-0">
      
      {/* HEADER & LEAD INPUT FORM */}
      <div className="max-w-6xl mx-auto mb-8 bg-[#131926] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Módulo Prospecção & CRM</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Auditoria de Leads & CRM de Acompanhamento
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSubTab('five_pages')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
                subTab === 'five_pages'
                  ? 'bg-gradient-to-r from-[#38bdf8] to-[#0284c7] text-[#050811] shadow-lg shadow-[#38bdf8]/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Modelo 5 Páginas (Gerador 1 Texto)</span>
            </button>

            <button
              onClick={() => setSubTab('script')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                subTab === 'script'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Scripts WhatsApp & Objeções</span>
            </button>

            <button
              onClick={() => setSubTab('proposal')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                subTab === 'proposal'
                  ? 'bg-[#ff5a35] text-white shadow-lg shadow-[#ff5a35]/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Gerador Alternativo</span>
            </button>

            <button
              onClick={() => setSubTab('crm')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                subTab === 'crm'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>CRM Acompanhamento ({crmList.length})</span>
            </button>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0b0e14] p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Selecione um Modelo Pré-Definido de Proposta:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleSelectPreset('juLopes')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedPreset === 'juLopes'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>✨ Ju Lopes Estética (R$ 700)</span>
            </button>

            <button
              onClick={() => handleSelectPreset('eletroRodrigues')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedPreset === 'eletroRodrigues'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>⚡ Eletro Rodrigues (R$ 600)</span>
            </button>
          </div>
        </div>

        {/* Lead Form Inputs */}
        <form onSubmit={handleGenerateProposal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nome da Empresa / Lead:
              </label>
              <input
                type="text"
                placeholder="Ex: Ju Lopes Estética"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 text-xs sm:text-sm rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nicho / Profissões Liberais:
              </label>
              <input
                type="text"
                list="prospecting-niche-list"
                placeholder="Ex: Estética & Cosmetologia"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 text-xs sm:text-sm rounded-xl p-3 outline-none"
              />
              <datalist id="prospecting-niche-list">
                {LIBERAL_PROFESSIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Cidade / UF / Bairro:
              </label>
              <input
                type="text"
                list="prospecting-cities-list"
                placeholder="Ex: Goiânia / GO"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 text-xs sm:text-sm rounded-xl p-3 outline-none"
              />
              <datalist id="prospecting-cities-list">
                {BRAZIL_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Link do Google Maps:
              </label>
              <input
                type="text"
                placeholder="Cole o link ou resumo do perfil no Maps"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 text-xs sm:text-sm rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Link do Instagram / Site:
              </label>
              <input
                type="text"
                placeholder="https://instagram.com/julopesestetica"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 text-xs sm:text-sm rounded-xl p-3 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold px-4 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-xs sm:text-sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isLoading ? 'Auditando Lead com IA...' : 'Auditar Lead com IA'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* SUB TAB 0: NEW 5-PAGE PROPOSAL MODEL (WITH TEXT PROMPT FIELD) */}
      {subTab === 'five_pages' && (
        <FivePageProposalModel showToast={showToast} />
      )}

      {/* SUB TAB 1: SCRIPTS WHATSAPP & BANCO DE OBJEÇÕES */}
      {subTab === 'script' && (
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Lead Bar */}
          <div className="bg-[#131926] p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider block">Lead Auditado Atual</span>
              <h2 className="text-xl font-bold text-white">{proposal.documento.cliente.nome_fantasia} ({proposal.documento.cliente.nicho})</h2>
              <p className="text-xs text-slate-400">{proposal.documento.cliente.cidade_uf} &bull; {proposal.documento.cliente.telefone_whatsapp}</p>
            </div>

            <button
              onClick={handleSaveToCrm}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 text-xs sm:text-sm transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Salvar no CRM de Acompanhamento</span>
            </button>
          </div>

          {/* Script Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Mensagem 2: Diagnóstico */}
            <div className="bg-[#131926] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Passo 1 &bull; Diagnóstico</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">Abertura</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Mensagem de Diagnóstico (3 Pontos)</h3>
                <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {scripts.mensagem_2_diagnostico}
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(scripts.mensagem_2_diagnostico, 'msg2', 'Mensagem 2 (Diagnóstico)')}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-4 py-2.5 rounded-xl border border-slate-700 text-xs transition-all active:scale-95"
              >
                {copiedKey === 'msg2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedKey === 'msg2' ? 'Copiado!' : 'Copiar Mensagem 2'}</span>
              </button>
            </div>

            {/* CTA Transição */}
            <div className="bg-[#131926] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Passo 2 &bull; Transição</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full font-bold">Filtro de Permissão</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">CTA de Transição Fluida</h3>
                <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {scripts.cta_transicao}
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(scripts.cta_transicao, 'cta', 'CTA de Transição')}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold px-4 py-2.5 rounded-xl border border-slate-700 text-xs transition-all active:scale-95"
              >
                {copiedKey === 'cta' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
                <span>{copiedKey === 'cta' ? 'Copiado!' : 'Copiar CTA Transição'}</span>
              </button>
            </div>

            {/* Mensagem 3: Fechamento */}
            <div className="bg-[#131926] p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Passo 3 &bull; Fechamento</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold">
                    Proposta {proposal.condicao_comercial.valor_proposta}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">Mensagem de Oferta e Garantia 60 Dias</h3>
                <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {scripts.mensagem_3_fechamento}
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(scripts.mensagem_3_fechamento, 'msg3', 'Mensagem 3 (Fechamento)')}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
              >
                {copiedKey === 'msg3' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'msg3' ? 'Copiado!' : `Copiar Oferta ${proposal.condicao_comercial.valor_proposta}`}</span>
              </button>
            </div>
          </div>

          {/* BANCO DE OBJEÇÕES INTERATIVO */}
          <div className="bg-[#131926] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Banco Inteligente de Quebra de Objeções</h3>
                  <p className="text-xs text-slate-400">Respostas ensaiadas e prontas para disparar no WhatsApp</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(scripts.banco_de_objecoes).map(([objKey, answerText], idx) => {
                const titleMap: Record<string, string> = {
                  "o_que_faz_exatamente": "❓ 'O que você faz exatamente?'",
                  "ja_temos_instagram": "📸 'Já temos Instagram com seguidores'",
                  "ja_temos_agencia": "🏢 'Já temos agência de marketing'",
                  "deixa_eu_pensar": "🤔 'Deixa eu pensar / falar com sócio'",
                  "quanto_custa": "💰 'Quanto custa?'",
                  "e_caro": "💸 'Achei caro'",
                  "nao_temos_tempo": "⏳ 'Não temos tempo agora'"
                };

                const displayTitle = titleMap[objKey] || objKey.replace(/_/g, ' ').toUpperCase();

                return (
                  <div key={idx} className="bg-[#0b0e14] p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-amber-400 block mb-1">{displayTitle}</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{answerText}</p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(answerText, `obj_${objKey}`, displayTitle)}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all active:scale-95"
                    >
                      {copiedKey === `obj_${objKey}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedKey === `obj_${objKey}` ? 'Resposta Copiada!' : 'Copiar Resposta'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CASES DE AUTORIDADE PARA PROVA SOCIAL */}
          <div className="bg-[#131926] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Cases de Prova Social ClienteBox (Para usar nas mensagens):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scripts.cases_autoridade?.map((c, idx) => (
                <div key={idx} className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{c.cliente}</span>
                    <p className="text-xs text-slate-300 mt-1">{c.resultado}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${c.cliente}: ${c.resultado}`, `case_${idx}`, c.cliente)}
                    className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    <Copy className="w-3 h-3" /> Copiar Case
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB TAB 2: PROPOSTA COMERCIAL (PROPOSAL GENERATOR) */}
      {subTab === 'proposal' && (
        <ProposalGenerator
          proposal={proposal}
          onUpdateProposal={setProposal}
          showToast={showToast}
          onAddCompany={onAddCompany}
          onPrintReport={onPrintReport}
          clienteBoxLogoUrl={clienteBoxLogoUrl}
          clientLogoUrl={clientLogoUrl}
          onUploadClienteBox={handleUploadClienteBox}
          onUploadClient={handleUploadClient}
        />
      )}

      {/* SUB TAB 3: CRM LISTA DE ACOMPANHAMENTO */}
      {subTab === 'crm' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-[#131926] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider block">CRM & Acompanhamento Periódico</span>
                <h2 className="text-xl font-bold text-white">Empresas Prospectadas em Acompanhamento ({crmList.length})</h2>
                <p className="text-xs text-slate-400">Re-analise os dados reais periodicamente sem duplicar o cadastro da empresa.</p>
              </div>

              <button
                onClick={handleSaveToCrm}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 text-xs sm:text-sm transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span>Salvar Lead Atual no CRM</span>
              </button>
            </div>

            {crmList.length === 0 ? (
              <div className="text-center py-12 bg-[#0b0e14] rounded-2xl border border-slate-800">
                <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-bold text-sm">Nenhuma empresa no CRM ainda.</p>
                <p className="text-slate-500 text-xs mt-1">Clique em "Salvar no CRM" após auditar um lead para salvar o registro sem duplicações.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crmList.map((comp) => (
                  <div key={comp.id} className="bg-[#0b0e14] p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                          {comp.ciclo || 'Ativo no CRM'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {comp.dataIntervencao}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{comp.nome}</h3>
                      <p className="text-xs text-slate-400 font-medium">{comp.categoria} &bull; {comp.endereco}</p>

                      <div className="mt-3 bg-[#131926] p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Interações Atuais:</span>
                          <span className="font-bold text-amber-400 font-mono">{comp.metricasAtual.interacoes}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Rotas GPS:</span>
                          <span className="font-bold text-emerald-400 font-mono">{comp.metricasAtual.rotas}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleReanalyzeCompany(comp)}
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-xs transition-all active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-analisar Dados Reais (IA)</span>
                      </button>

                      {onSelectCompany && (
                        <button
                          onClick={() => {
                            onSelectCompany(comp.id);
                            showToast(`Empresa "${comp.nome}" ativada no painel de controle.`, 'info');
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2 px-3 rounded-xl border border-slate-700 text-xs transition-all"
                        >
                          <Building2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Ver Métricas no Dashboard</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

