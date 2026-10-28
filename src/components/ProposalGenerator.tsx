import React, { useState } from 'react';
import { CommercialProposalData, Company } from '../types';
import { sanitizeClonedDocForCanvas } from '../utils/pdfExport';
import { LogoSvg } from './LogoSvg';
import { 
  Download, Printer, Copy, Check, Sun, Moon, Upload, Building2, 
  FileText, Sparkles, Sliders, Eye, RefreshCw, ShieldCheck, CheckCircle2, 
  ExternalLink, Layers, ChevronRight, Edit3, X
} from 'lucide-react';

interface ProposalGeneratorProps {
  proposal: CommercialProposalData;
  onUpdateProposal: (proposal: CommercialProposalData) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onAddCompany: (company: Company) => void;
  onPrintReport: () => void;
  clienteBoxLogoUrl?: string | null;
  clientLogoUrl?: string | null;
  onUploadClienteBox?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClient?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({
  proposal,
  onUpdateProposal,
  showToast,
  onAddCompany,
  onPrintReport,
  clienteBoxLogoUrl,
  clientLogoUrl,
  onUploadClienteBox,
  onUploadClient
}) => {
  const [viewMode, setViewMode] = useState<'document' | 'customize'>('document');
  const [reportTheme, setReportTheme] = useState<'dark' | 'light'>('dark');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Universal Engine JSON Modal State
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const isDark = reportTheme === 'dark';

  // Save proposal changes to LocalStorage for offline/refresh persistence
  React.useEffect(() => {
    try {
      localStorage.setItem('clientebox_universal_proposal_v1', JSON.stringify(proposal));
    } catch (e) {
      console.warn('Erro ao salvar proposta no LocalStorage:', e);
    }
  }, [proposal]);

  const handleApplyJsonInput = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed && parsed.documento && parsed.diagnostico_cenario_atual) {
        onUpdateProposal(parsed as CommercialProposalData);
        showToast('Proposta atualizada reativamente com o JSON fornecido!', 'success');
        setShowJsonModal(false);
      } else {
        showToast('JSON inválido. Certifique-se de incluir a estrutura padrão da proposta.', 'error');
      }
    } catch (err) {
      showToast('Erro ao processar código JSON. Verifique a sintaxe.', 'error');
    }
  };

  const handleOpenJsonModal = () => {
    setJsonInput(JSON.stringify(proposal, null, 2));
    setShowJsonModal(true);
  };

  const copyToClipboard = (text: string, keyName: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    showToast(`${label} copiado!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Quick field updates in customize mode
  const handleClientFieldChange = (field: string, value: string) => {
    const updated = JSON.parse(JSON.stringify(proposal)) as CommercialProposalData;
    // @ts-ignore
    updated.documento.cliente[field] = value;
    onUpdateProposal(updated);
  };

  const handlePricingChange = (valor: string) => {
    const updated = JSON.parse(JSON.stringify(proposal)) as CommercialProposalData;
    updated.condicao_comercial.valor_proposta = valor;
    onUpdateProposal(updated);
  };

  const handlePixChange = (chave: string) => {
    const updated = JSON.parse(JSON.stringify(proposal)) as CommercialProposalData;
    updated.documento.empresa_consultora.dados_pagamento.chave_pix = chave;
    onUpdateProposal(updated);
  };

  // Convert lead to managed company
  const handleConvertToCompany = () => {
    const clientData = proposal.documento.cliente;
    const newComp: Company = {
      id: `lead_${Date.now()}`,
      nome: clientData.nome_fantasia,
      responsavel: clientData.responsavel,
      categoria: clientData.nicho,
      endereco: `${clientData.bairro}, ${clientData.cidade_uf}`,
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
        categoria: clientData.nicho,
        nota: String(g.nota || "5.0"),
        status: g.status
      })),
      diagnosticoCustom: proposal.diagnostico_cenario_atual.resumo_executivo
    };

    onAddCompany(newComp);
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    showToast('Gerando o arquivo PDF formatado da proposta...', 'info');
    try {
      const element = document.getElementById('proposal-pdf-content');
      if (!element) {
        showToast('Elemento da proposta não encontrado.', 'error');
        return;
      }

      // @ts-ignore
      const html2pdfModule = (await import('html2pdf.js')).default;
      const sanitizeName = proposal.documento.cliente.nome_fantasia.replace(/[^a-zA-Z0-9_-]/g, '_');

      const opt = {
        margin: 5,
        filename: `Proposta-Comercial-ClienteBox-${sanitizeName}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false, 
          backgroundColor: reportTheme === 'dark' ? '#0b0e14' : '#ffffff',
          onclone: (clonedDoc: Document) => sanitizeClonedDocForCanvas(clonedDoc)
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdfModule().set(opt).from(element).save();
      showToast('Download da Proposta PDF concluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF da proposta:', error);
      showToast('Falha no download direto. Tente a opção "Imprimir / PDF do Navegador".', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* TOOLBAR CONTROLS */}
      <div className="bg-[#131926] p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff5a35]/20 to-orange-500/20 border border-[#ff5a35]/40 flex items-center justify-center text-[#ff5a35]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white font-display">
                Documento de Proposta Comercial (5 Páginas A4)
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/30">
                Aprovado para Impressão
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Personalizado para: <strong className="text-slate-200">{proposal.documento.cliente.nome_fantasia}</strong> &bull; {proposal.condicao_comercial.valor_proposta}
            </p>
          </div>
        </div>

        {/* View Toggle & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="bg-[#0b0e14] p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('document')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                viewMode === 'document' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Documento</span>
            </button>

            <button
              onClick={() => setViewMode('customize')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                viewMode === 'customize' 
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Editar Campos</span>
            </button>
          </div>

          <button
            onClick={handleOpenJsonModal}
            className="flex items-center gap-1.5 bg-[#182030] hover:bg-[#202b40] text-purple-300 font-bold px-3 py-2 rounded-xl border border-purple-500/40 text-xs transition-all"
            title="Motor Universal JSON (White-label para qualquer nicho)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Motor Universal JSON</span>
          </button>

          <button
            onClick={() => setReportTheme(isDark ? 'light' : 'dark')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-all"
            title="Alternar Tema Visual"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{isDark ? 'Claro' : 'Escuro'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 bg-[#ff5a35] hover:bg-[#ff481f] disabled:opacity-50 text-white font-extrabold px-3 py-2 rounded-xl shadow-lg shadow-[#ff5a35]/20 transition-all active:scale-95 text-xs"
          >
            {isGeneratingPdf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isGeneratingPdf ? 'Baixando...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={onPrintReport}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={handleConvertToCompany}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl shadow-md shadow-emerald-600/20 text-xs transition-all"
            title="Cadastrar Lead no Painel de Empresas"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">+ Módulo Empresa</span>
          </button>
        </div>
      </div>

      {/* CUSTOMIZATION FORM MODE */}
      {viewMode === 'customize' && (
        <div className="bg-[#131926] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white font-display">
                Editar Dados Rápidos da Proposta Comercial
              </h3>
            </div>
            <button
              onClick={() => setViewMode('document')}
              className="text-xs bg-sky-500/20 text-sky-300 font-bold px-3 py-1.5 rounded-lg hover:bg-sky-500/30"
            >
              Ver Documento Atualizado →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Nome do Cliente / Empresa:</label>
              <input
                type="text"
                value={proposal.documento.cliente.nome_fantasia}
                onChange={(e) => handleClientFieldChange('nome_fantasia', e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-sky-500 text-slate-100 p-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Responsável:</label>
              <input
                type="text"
                value={proposal.documento.cliente.responsavel}
                onChange={(e) => handleClientFieldChange('responsavel', e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-sky-500 text-slate-100 p-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Cidade / UF:</label>
              <input
                type="text"
                value={proposal.documento.cliente.cidade_uf}
                onChange={(e) => handleClientFieldChange('cidade_uf', e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-sky-500 text-slate-100 p-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Valor do Serviço (Taxa Única):</label>
              <input
                type="text"
                value={proposal.condicao_comercial.valor_proposta}
                onChange={(e) => handlePricingChange(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-sky-500 text-slate-100 p-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">Chave PIX de Recebimento:</label>
              <input
                type="text"
                value={proposal.documento.empresa_consultora.dados_pagamento.chave_pix}
                onChange={(e) => handlePixChange(e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-sky-500 text-slate-100 p-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider">WhatsApp para Contato:</label>
              <input
                type="text"
                value={proposal.documento.cliente.telefone_whatsapp}
                onChange={(e) => handleClientFieldChange('telefone_whatsapp', e.target.value)}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-sky-500 text-slate-100 p-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Logo Uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
            <label className="flex items-center justify-between bg-[#0b0e14] p-3 rounded-2xl border border-slate-800 cursor-pointer hover:border-slate-700 text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Logo ClienteBox:
              </span>
              <input type="file" accept="image/*" onChange={onUploadClienteBox} className="hidden" />
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg font-bold">Enviar Imagem</span>
            </label>

            <label className="flex items-center justify-between bg-[#0b0e14] p-3 rounded-2xl border border-slate-800 cursor-pointer hover:border-slate-700 text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" /> Logo do Cliente:
              </span>
              <input type="file" accept="image/*" onChange={onUploadClient} className="hidden" />
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg font-bold">Enviar Imagem</span>
            </label>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODE (PRINTABLE A4 5-PAGE VIEW) */}
      {viewMode === 'document' && (
        <div 
          id="proposal-pdf-content" 
          className={`max-w-4xl mx-auto space-y-12 print:space-y-0 print:max-w-none transition-colors duration-300 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          
          {/* PÁGINA 1: CAPA OFICIAL CLIENTEBOX */}
          <div className={`report-page p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:min-h-screen print:page-break-after ${
            isDark ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="text-center space-y-6">
              <div className="text-xs font-black tracking-widest uppercase text-sky-500">
                INTELIGÊNCIA ESTRATÉGICA & RANQUEAMENTO LOCAL
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-rose-600 print:text-rose-700 leading-tight">
                {proposal.documento.titulo}
              </h1>

              <div className="text-xl font-extrabold uppercase tracking-wide text-slate-200 print:text-slate-900">
                {proposal.documento.cliente.nome_fantasia} | {proposal.documento.cliente.nicho}
              </div>

              <div className="inline-block px-4 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider bg-slate-800/40 border-slate-700 text-sky-400 print:bg-slate-100 print:border-slate-300 print:text-slate-800">
                {proposal.documento.cliente.cidade_uf} &bull; {proposal.documento.data_emissao}
              </div>
            </div>

            {/* Cover Center Logo Wrapper */}
            <div className="my-12 flex flex-col items-center justify-center">
              <div className={`w-64 h-64 rounded-3xl border p-6 flex items-center justify-center shadow-2xl ${
                isDark ? 'bg-[#182030] border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                {clienteBoxLogoUrl || clientLogoUrl ? (
                  <img 
                    src={clientLogoUrl || clienteBoxLogoUrl!} 
                    alt="Logo" 
                    className="max-w-full max-h-full object-contain" 
                  />
                ) : (
                  <LogoSvg size="lg" />
                )}
              </div>
            </div>

            <div className="border-t pt-6 text-center border-slate-800 print:border-slate-300 space-y-1">
              <h4 className="text-sm font-extrabold text-slate-200 print:text-slate-900">
                ClienteBox — Gestão Estratégica & Posicionamento no Google Maps
              </h4>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Rua Quintino Bocaiúva, 1848, Bairro Bosque - Rio Branco / AC &bull; {proposal.documento.data_emissao}
              </p>
            </div>
          </div>

          {/* PÁGINA 2: O DIAGNÓSTICO */}
          <div className={`report-page p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:min-h-screen print:page-break-after ${
            isDark ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-800 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 p-1 flex items-center justify-center">
                    {clienteBoxLogoUrl ? (
                      <img src={clienteBoxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain" />
                    ) : (
                      <LogoSvg size="sm" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-100 print:text-slate-900">
                      Cliente<span className="text-orange-500">Box</span>
                    </h2>
                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Gestão Estratégica & SEO no Google Maps</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 print:text-slate-900">{proposal.documento.cliente.nome_fantasia}</h4>
                    <p className="text-xs text-slate-400 print:text-slate-600">{proposal.documento.cliente.cidade_uf}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-sky-500/40 bg-sky-500/10 flex items-center justify-center font-extrabold text-sky-400 text-sm">
                    {clientLogoUrl ? (
                      <img src={clientLogoUrl} alt="Client" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      proposal.documento.cliente.nome_fantasia.slice(0, 2).toUpperCase()
                    )}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 mb-1">
                Proposta Comercial & Diagnóstico de Ecossistema Digital
              </div>
              <h1 className="text-2xl font-black uppercase text-slate-100 print:text-slate-900 mb-1">
                AUDITORIA DE CANAIS & REPUTAÇÃO
              </h1>
              <div className="text-xs text-slate-400 print:text-slate-600 mb-6 font-semibold">
                {proposal.documento.cliente.nome_fantasia.toUpperCase()} &bull; {proposal.documento.cliente.cidade_uf.toUpperCase()} &bull; {proposal.documento.data_emissao.toUpperCase()}
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Capítulo 01. O Diagnóstico</div>
              <h3 className="text-base font-extrabold text-slate-100 print:text-slate-900 mb-4">
                Ruptura Entre Redes Sociais e Cadastro no Google Maps
              </h3>

              <div className={`p-4 rounded-xl border-l-4 border-sky-500 italic text-xs leading-relaxed mb-6 ${
                isDark ? 'bg-[#182030] text-slate-300' : 'bg-slate-100 text-slate-800'
              }`}>
                "{proposal.diagnostico_cenario_atual.resumo_executivo}"
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.entries(proposal.diagnostico_cenario_atual.metricas_chave).map(([mKey, metric], idx) => (
                  <div key={idx} className={`p-3 rounded-xl border text-center ${
                    isDark ? 'bg-[#182030] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">{metric.rotulo}</span>
                    <div className="text-lg font-black text-sky-400 my-1">{metric.valor}</div>
                    <span className="text-[10px] font-bold text-rose-500 block">{metric.status}</span>
                  </div>
                ))}
              </div>

              {/* Auditoria de Canais Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b font-bold uppercase ${
                      isDark ? 'bg-[#182030] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}>
                      <th className="py-2.5 px-3">Canal Auditado</th>
                      <th className="py-2.5 px-3">Dados Atuais</th>
                      <th className="py-2.5 px-3">Status Técnico</th>
                      <th className="py-2.5 px-3">Impacto Algorítmico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                    {proposal.diagnostico_cenario_atual.auditoria_canais.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 font-bold text-slate-100 print:text-slate-900">{item.canal}</td>
                        <td className="py-3 px-3 text-slate-300 print:text-slate-700">{item.dados_atuais}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === 'Gravíssimo' || item.status === 'Crítico' 
                              ? 'bg-rose-500/20 text-rose-400' 
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400 print:text-slate-600">{item.impacto_algoritmico}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800 print:border-slate-300 flex justify-between">
              <span>ClienteBox – Soluções Digitais — Gestão Estratégica & SEO no Google Maps</span>
              <span>Página 2 de 5</span>
            </div>
          </div>

          {/* PÁGINA 3: INTELIGÊNCIA COMPETITIVA */}
          <div className={`report-page p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:min-h-screen print:page-break-after ${
            isDark ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-800 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 p-1 flex items-center justify-center">
                    {clienteBoxLogoUrl ? (
                      <img src={clienteBoxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain" />
                    ) : (
                      <LogoSvg size="sm" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-100 print:text-slate-900">
                      Cliente<span className="text-orange-500">Box</span>
                    </h2>
                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Gestão Estratégica & SEO no Google Maps</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 print:text-slate-900">{proposal.documento.cliente.nome_fantasia}</h4>
                    <p className="text-xs text-slate-400 print:text-slate-600">{proposal.documento.cliente.cidade_uf}</p>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Capítulo 02. Inteligência Competitiva</div>
              <h3 className="text-lg font-extrabold text-slate-100 print:text-slate-900 mb-6">
                Para Onde Estão Indo os Orçamentos em {proposal.documento.cliente.cidade_uf}?
              </h3>

              {/* Grafico de Barras Horizontais */}
              <div className={`p-6 rounded-2xl border space-y-5 mb-8 ${
                isDark ? 'bg-[#182030] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider text-center mb-4">
                  {proposal.inteligencia_competitiva.titulo_grafico}
                </div>

                {proposal.inteligencia_competitiva.dados_grafico.map((g, idx) => {
                  const isTarget = g.empresa.includes('Atual') || g.empresa.includes(proposal.documento.cliente.nome_fantasia);
                  const isMeta = g.empresa.includes('Meta');
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className={isTarget ? 'text-rose-500 font-extrabold' : isMeta ? 'text-emerald-400 font-extrabold' : 'text-slate-300 print:text-slate-800'}>
                          {g.empresa}
                        </span>
                        <span className="text-slate-400 text-[11px]">{g.avaliacoes} reviews &bull; {g.nota} ★</span>
                      </div>
                      <div className="w-full bg-slate-800 print:bg-slate-200 h-5 rounded-lg overflow-hidden relative">
                        <div
                          className={`h-full rounded-lg transition-all duration-500 flex items-center justify-end px-2 text-[10px] font-black text-white ${
                            isTarget ? 'bg-rose-600' : isMeta ? 'bg-emerald-600' : 'bg-slate-600'
                          }`}
                          style={{ width: `${Math.max(Number(g.largura_barra_percentual) || 20, 15)}%` }}
                        >
                          {g.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Capítulo 03. Engenharia de SEO Local</div>
              <h3 className="text-lg font-extrabold text-slate-100 print:text-slate-900 mb-4">
                Escopo de Execução da Taxa Única de Otimização
              </h3>

              <div className={`p-6 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#182030] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-xs font-bold text-sky-400 uppercase mb-2">Ações Técnicas em 7 Dias Úteis:</div>
                <ul className="space-y-2 text-xs text-slate-300 print:text-slate-800">
                  {proposal.engenharia_seo_local.escopo_execucao_taxa_unica.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800 print:border-slate-300 flex justify-between">
              <span>ClienteBox – Soluções Digitais — Gestão Estratégica & SEO no Google Maps</span>
              <span>Página 3 de 5</span>
            </div>
          </div>

          {/* PÁGINA 4: VIABILIDADE FINANCEIRA */}
          <div className={`report-page p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:min-h-screen print:page-break-after ${
            isDark ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-800 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 p-1 flex items-center justify-center">
                    {clienteBoxLogoUrl ? (
                      <img src={clienteBoxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain" />
                    ) : (
                      <LogoSvg size="sm" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-100 print:text-slate-900">
                      Cliente<span className="text-orange-500">Box</span>
                    </h2>
                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Gestão Estratégica & SEO no Google Maps</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 print:text-slate-900">{proposal.documento.cliente.nome_fantasia}</h4>
                    <p className="text-xs text-slate-400 print:text-slate-600">{proposal.documento.cliente.cidade_uf}</p>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Capítulo 04. Viabilidade Financeira & LTV</div>
              <h3 className="text-lg font-extrabold text-slate-100 print:text-slate-900 mb-4">
                Apenas 1 Atendimento Já Paga 100% da Otimização
              </h3>

              <div className={`p-4 rounded-xl border-l-4 border-sky-500 italic text-xs leading-relaxed mb-6 ${
                isDark ? 'bg-[#182030] text-slate-300' : 'bg-slate-100 text-slate-800'
              }`}>
                "{proposal.viabilidade_financeira.ponto_de_equilibrio}"
              </div>

              {/* Tabela de Cenários de ROI */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b font-bold uppercase ${
                      isDark ? 'bg-[#182030] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}>
                      <th className="py-2.5 px-3">Cenário Projetado</th>
                      <th className="py-2.5 px-3">Investimento</th>
                      <th className="py-2.5 px-3">Novos Chamados/mês</th>
                      <th className="py-2.5 px-3">Receita Bruta/mês</th>
                      <th className="py-2.5 px-3">LTV Anual (12M)</th>
                      <th className="py-2.5 px-3">ROI Estimado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                    {proposal.viabilidade_financeira.cenarios.map((c, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 text-slate-100 print:text-slate-900 font-bold">{c.cenario}</td>
                        <td className="py-3 px-3 text-slate-300 print:text-slate-700">{c.investimento}</td>
                        <td className="py-3 px-3 text-slate-300 print:text-slate-700">{c.novos_clientes_mes}</td>
                        <td className="py-3 px-3 text-slate-300 print:text-slate-700">{c.receita_bruta_mes}</td>
                        <td className="py-3 px-3 text-emerald-400 print:text-emerald-700 font-bold">{c.ltv_anual_12m}</td>
                        <td className="py-3 px-3 text-emerald-400 print:text-emerald-700 font-bold">{c.roi_estimado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Capítulo 05. Continuidade Operacional</div>
              <h3 className="text-lg font-extrabold text-slate-100 print:text-slate-900 mb-4">
                Opções de Gestão Mensal & Acompanhamento
              </h3>

              <div className={`p-5 rounded-2xl border border-sky-500/40 space-y-3 ${
                isDark ? 'bg-[#182030]' : 'bg-sky-50/50 text-slate-800'
              }`}>
                <div className="text-sm font-extrabold text-sky-400">
                  Planos Opcionais de Gestão & SEO Local Contínuo:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mensal</span>
                    <strong className="text-sm font-black text-amber-400 block mt-0.5">
                      {proposal.condicao_comercial.planos_acompanhamento_opcionais?.mensal || "R$ 300,00 / mês"}
                    </strong>
                  </div>

                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Trimestral</span>
                    <strong className="text-sm font-black text-amber-400 block mt-0.5">
                      {proposal.condicao_comercial.planos_acompanhamento_opcionais?.trimestral || "R$ 950,00"}
                    </strong>
                  </div>

                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Semestral</span>
                    <strong className="text-sm font-black text-amber-400 block mt-0.5">
                      {proposal.condicao_comercial.planos_acompanhamento_opcionais?.semestral || "R$ 1.550,00"}
                    </strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 print:text-slate-700 leading-relaxed pt-1">
                  Serviços inclusos na gestão: monitoramento quinzenal de avaliações, respostas oficiais com SEO, otimização contínua de fotos/postagens e proteção contra rebaixamento no algoritmo.
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800 print:border-slate-300 flex justify-between">
              <span>ClienteBox – Soluções Digitais — Gestão Estratégica & SEO no Google Maps</span>
              <span>Página 4 de 5</span>
            </div>
          </div>

          {/* PÁGINA 5: FECHAMENTO COMERCIAL */}
          <div className={`report-page p-8 sm:p-12 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[842px] print:rounded-none print:border-none print:shadow-none print:min-h-screen ${
            isDark ? 'bg-[#111622] border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-800 print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 p-1 flex items-center justify-center">
                    {clienteBoxLogoUrl ? (
                      <img src={clienteBoxLogoUrl} alt="ClienteBox" className="w-full h-full object-contain" />
                    ) : (
                      <LogoSvg size="sm" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-100 print:text-slate-900">
                      Cliente<span className="text-orange-500">Box</span>
                    </h2>
                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Gestão Estratégica & SEO no Google Maps</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 print:text-slate-900">{proposal.documento.cliente.nome_fantasia}</h4>
                    <p className="text-xs text-slate-400 print:text-slate-600">{proposal.documento.cliente.cidade_uf}</p>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Capítulo 06. Fechamento Comercial</div>
              <h3 className="text-lg font-extrabold text-slate-100 print:text-slate-900 mb-6">
                Condição Especial de Contratação & Garantia de 60 Dias
              </h3>

              {/* Pricing Card */}
              <div className="p-6 rounded-2xl border-2 border-sky-500 bg-gradient-to-br from-sky-500/10 to-blue-600/10 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-100 print:text-slate-900">
                    {proposal.condicao_comercial.servico}
                  </h4>
                  <p className="text-xs text-sky-400 font-semibold mt-1">
                    {proposal.condicao_comercial.modelo}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-400 line-through">De R$ 1.400,00</div>
                  <div className="text-2xl font-black text-slate-100 print:text-slate-900">
                    {proposal.condicao_comercial.valor_proposta} <span className="text-xs font-semibold">(Taxa Única)</span>
                  </div>
                </div>
              </div>

              {/* Garantia Quote Box */}
              <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/10 text-xs text-slate-200 print:text-slate-800 leading-relaxed mb-6">
                <strong className="text-emerald-400 font-bold block mb-1">Compromisso de Risco Zero & Garantia de 60 Dias:</strong>
                {proposal.condicao_comercial.garantia.descricao}
              </div>

              <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">Dados Oficiais para Início Imediato</div>
              <h4 className="text-sm font-extrabold text-slate-100 print:text-slate-900 mb-3">Quitação via PIX & Validação Técnica</h4>

              {/* PIX Box */}
              <div className={`p-4 rounded-2xl border border-dashed grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-8 ${
                isDark ? 'bg-[#182030] border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Chave PIX (Celular)</span>
                  <strong className="text-sm font-extrabold text-sky-400 block mt-1">{proposal.documento.empresa_consultora.dados_pagamento.chave_pix}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Titular da Conta</span>
                  <strong className="text-sm font-extrabold text-sky-400 block mt-1">{proposal.documento.empresa_consultora.dados_pagamento.titular}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Instituição Bancária</span>
                  <strong className="text-sm font-extrabold text-sky-400 block mt-1">{proposal.documento.empresa_consultora.dados_pagamento.instituicao_bancaria}</strong>
                </div>
              </div>

              {/* Signature */}
              <div className="text-center space-y-1">
                <h4 className="text-sm font-extrabold text-slate-100 print:text-slate-900">
                  {proposal.documento.empresa_consultora.responsavel_tecnico}
                </h4>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Responsável Técnico &bull; ClienteBox Presença Digital
                </p>
                <p className="text-xs text-sky-400 font-bold">
                  WhatsApp Corporativo: {proposal.documento.empresa_consultora.contato_corporativo}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800 print:border-slate-300 flex justify-between">
              <span>ClienteBox – Soluções Digitais — Gestão Estratégica & SEO no Google Maps</span>
              <span>Página 5 de 5</span>
            </div>
          </div>

        </div>
      )}

      {/* UNIVERSAL ENGINE JSON MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121722] border border-purple-500/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setShowJsonModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">ClienteBox Universal Engine (SaaS / White-Label)</h3>
                <p className="text-slate-400 text-xs">Cole ou edite o JSON estruturado para qualquer nicho (odontologia, estética, oficinas, restaurantes, etc.)</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                Código JSON Estruturado da Proposta Comercial:
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={12}
                className="w-full bg-[#0b0e14] border border-slate-700 focus:border-purple-400 text-emerald-300 font-mono text-xs p-3 rounded-2xl outline-none"
                placeholder="{"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                💾 Alterações salvas automaticamente no LocalStorage do navegador.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(jsonInput);
                    showToast('Código JSON copiado para a área de transferência!', 'success');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
                >
                  Copiar JSON
                </button>

                <button
                  type="button"
                  onClick={handleApplyJsonInput}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg shadow-purple-600/20 transition-all"
                >
                  Aplicar ao Documento (Reativo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
