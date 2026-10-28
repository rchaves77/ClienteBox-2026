import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Sparkles, 
  Download, 
  Upload, 
  PlusCircle, 
  X, 
  TrendingUp, 
  Shield, 
  CreditCard, 
  Calendar, 
  Layers,
  HelpCircle,
  BarChart3,
  Edit3,
  Search,
  Box
} from 'lucide-react';
import { Company, Competitor, AppState } from '../types';
import { SeoDashboard } from './SeoDashboard';
import { SeoHealthLineDashboard } from './SeoHealthLineDashboard';
import { Keywords3DVisualizer } from './Keywords3DVisualizer';
import { GestoresManagerSection } from './GestoresManagerSection';
import { OnboardingSubmissionsViewer } from './OnboardingSubmissionsViewer';
import { calculateSeoHealthScore } from '../utils/seoHealth';

interface AdminViewProps {
  appState: AppState;
  onUpdateCompany: (company: Company) => void;
  onAddCompany: (company: Company) => void;
  onDeleteCompany: (id: string) => void;
  onSelectCompany: (id: string) => void;
  onViewReport: () => void;
  onExportJson: () => void;
  onImportJson: (jsonStr: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  appState,
  onUpdateCompany,
  onAddCompany,
  onDeleteCompany,
  onSelectCompany,
  onViewReport,
  onExportJson,
  onImportJson,
  showToast,
}) => {
  const currentCompany = appState.companies[appState.selectedCompanyId] || Object.values(appState.companies)[0];
  const [formData, setFormData] = useState<Company>({ ...currentCompany });
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'dashboard' | 'keywords3d' | 'form'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCompanies = Object.values(appState.companies).filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.nome.toLowerCase().includes(term) ||
      c.responsavel.toLowerCase().includes(term) ||
      c.categoria.toLowerCase().includes(term) ||
      c.endereco.toLowerCase().includes(term)
    );
  });

  // Sync state when selected company changes
  React.useEffect(() => {
    if (currentCompany) {
      setFormData({ ...currentCompany });
    }
  }, [appState.selectedCompanyId, currentCompany]);

  // Handle form field changes
  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetricaAnteriorChange = (field: keyof Company['metricasAnterior'], value: number) => {
    setFormData((prev) => ({
      ...prev,
      metricasAnterior: { ...prev.metricasAnterior, [field]: value }
    }));
  };

  const handleMetricaAtualChange = (field: keyof Company['metricasAtual'], value: number) => {
    setFormData((prev) => ({
      ...prev,
      metricasAtual: { ...prev.metricasAtual, [field]: value }
    }));
  };

  // Actions executed helpers
  const handleAddAcao = () => {
    setFormData((prev) => ({
      ...prev,
      acoes: [...prev.acoes, 'Nova otimização técnica realizada no perfil']
    }));
  };

  const handleUpdateAcao = (index: number, val: string) => {
    const updated = [...formData.acoes];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, acoes: updated }));
  };

  const handleRemoveAcao = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      acoes: prev.acoes.filter((_, i) => i !== index)
    }));
  };

  // Next steps helpers
  const handleAddProximoPasso = () => {
    setFormData((prev) => ({
      ...prev,
      proximosPassos: [...prev.proximosPassos, 'Novo próximo passo estratégico']
    }));
  };

  const handleUpdateProximoPasso = (index: number, val: string) => {
    const updated = [...formData.proximosPassos];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, proximosPassos: updated }));
  };

  const handleRemoveProximoPasso = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      proximosPassos: prev.proximosPassos.filter((_, i) => i !== index)
    }));
  };

  // Competitor helpers
  const handleAddCompetitor = () => {
    const count = formData.concorrentes.length + 1;
    const newComp: Competitor = {
      nome: `Concorrente ${count}`,
      posicao: `Top ${count}`,
      categoria: formData.categoria || 'Serviço Local',
      nota: '4.5 ★ (30)',
      status: 'Acompanhamento de fotos e horários'
    };
    setFormData((prev) => ({
      ...prev,
      concorrentes: [...prev.concorrentes, newComp]
    }));
  };

  const handleUpdateCompetitor = (index: number, field: keyof Competitor, val: string) => {
    const updated = [...formData.concorrentes];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, concorrentes: updated }));
  };

  const handleRemoveCompetitor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      concorrentes: prev.concorrentes.filter((_, i) => i !== index)
    }));
  };

  // Save changes
  const handleSave = () => {
    onUpdateCompany(formData);
    showToast(`Empresa "${formData.nome}" salva com sucesso!`, 'success');
  };

  // Create new company
  const handleCreateNew = () => {
    const id = `empresa-${Date.now()}`;
    const newCo: Company = {
      id,
      nome: 'Nova Empresa Exemplo',
      responsavel: 'Nome do Responsável',
      categoria: 'Serviço Local',
      endereco: 'Endereço da Empresa, Bairro, Cidade/UF',
      ltv: 500,
      pixChave: '(00) 90000-0000',
      pixFavorecido: 'Rômulo Chaves da Silva',
      pixBanco: 'Sicredi',
      periodo: 'Setembro a Outubro 2026',
      ciclo: 'Novembro 2026',
      dataIntervencao: '01 de Outubro',
      metricasAnterior: { interacoes: 100, rotas: 40, chats: 20, ligacoes: 10 },
      metricasAtual: { interacoes: 180, rotas: 85, chats: 35, ligacoes: 18 },
      acoes: ['Início do contrato e auditoria do perfil'],
      proximosPassos: ['Publicação de fotos georreferenciadas'],
      concorrentes: [
        { nome: 'Nova Empresa Exemplo (Você)', posicao: 'Top 1', categoria: 'Serviço Local', nota: '5.0 ★ (10)', status: 'Líder do Raio' }
      ]
    };
    onAddCompany(newCo);
    setIsCreatingNew(false);
    showToast('Nova empresa cadastrada com sucesso!', 'success');
  };

  // Generate AI Insights (Suporte a sites estáticos e servidor Gemini)
  const handleGenerateAiInsights = async () => {
    setIsAiLoading(true);
    showToast('Consultando IA para análise técnica do relatório...', 'info');

    const generateClientInsights = () => {
      const rotas = formData.metricasAtual.rotas || 0;
      const chats = formData.metricasAtual.chats || 0;
      const interacoes = formData.metricasAtual.interacoes || (rotas + chats);

      const diag = `Crescimento de alta performance no perfil do Google Maps para ${formData.nome} (${formData.categoria}). ` +
        `Neste ciclo, alcançamos ${interacoes} interações totais e ${rotas} solicitações de rotas GPS direcionadas à sede. ` +
        `Destacamos a migração positiva para os canais diretos de agendamento via WhatsApp (${chats} conversas), garantindo a retenção da demanda no bairro.`;

      const acoes = [
        `Intensificar postagens semanais georreferenciadas do catálogo de ${formData.categoria}`,
        `Acelerar campanha de avaliações 5 estrelas pós-atendimento`,
        `Monitoramento de blindagem algorítmica contra alterações concorrentes`
      ];

      handleInputChange('diagnosticoCustom', diag);
      setFormData((prev) => ({
        ...prev,
        proximosPassos: Array.from(new Set([...prev.proximosPassos, ...acoes]))
      }));

      showToast('Análise técnica de inteligência gerada com sucesso!', 'success');
      setIsAiLoading(false);
    };

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.nome,
          category: formData.categoria,
          previousMetrics: formData.metricasAnterior,
          currentMetrics: formData.metricasAtual,
          competitors: formData.concorrentes
        })
      });

      if (!response.ok) {
        generateClientInsights();
        return;
      }

      const result = await response.json();
      if (result && result.diagnostico) {
        handleInputChange('diagnosticoCustom', result.diagnostico);
        if (Array.isArray(result.acoesSugeridas) && result.acoesSugeridas.length > 0) {
          setFormData((prev) => ({
            ...prev,
            proximosPassos: Array.from(new Set([...prev.proximosPassos, ...result.acoesSugeridas]))
          }));
        }
        showToast('Análise de IA gerada com sucesso!', 'success');
      } else {
        generateClientInsights();
      }
    } catch (e) {
      console.warn('API de servidor indisponível. Utilizando gerador local estático de inteligência:', e);
      generateClientInsights();
    } finally {
      setIsAiLoading(false);
    }
  };

  // File import JSON
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportJson(content);
          showToast('Dados importados com sucesso!', 'success');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* TOP CONTROLS CARD: Search Bar, Company Selector & Quick Actions */}
      <div className="bg-[#111622] p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* SEARCH BAR & SELECTOR GROUP */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-1">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar empresa por nome, responsável ou segmento..."
                className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Company Selector Dropdown populated with filtered list */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <select
                value={appState.selectedCompanyId}
                onChange={(e) => onSelectCompany(e.target.value)}
                className="bg-[#182030] border border-slate-700 text-amber-300 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ff5a35] cursor-pointer w-full sm:w-auto sm:max-w-[300px] truncate"
              >
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#111622] text-white">
                      {c.nome} ({c.responsavel})
                    </option>
                  ))
                ) : (
                  <option value="" disabled className="bg-[#111622] text-slate-500">
                    Nenhuma empresa encontrada
                  </option>
                )}
              </select>

              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 bg-[#ff5a35]/15 hover:bg-[#ff5a35]/25 border border-[#ff5a35]/40 text-[#ff5a35] font-bold text-xs px-3 py-2.5 rounded-xl transition-all shrink-0"
                title="Cadastrar Nova Empresa"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Empresa</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end shrink-0">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#ff5a35] hover:bg-[#ff481f] text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff5a35]/20 transition-all text-xs sm:text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados</span>
            </button>

            <button
              onClick={() => {
                handleSave();
                onViewReport();
              }}
              className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0ea5e9] text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-xs sm:text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Relatório (A4 6 Páginas)</span>
            </button>

            {/* Backup options */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2.5">
              <button
                onClick={onExportJson}
                className="p-2.5 rounded-xl bg-[#182030] hover:bg-[#202b40] text-slate-300 transition-colors border border-slate-700"
                title="Exportar Backup JSON"
              >
                <Download className="w-4 h-4" />
              </button>

              <label
                className="p-2.5 rounded-xl bg-[#182030] hover:bg-[#202b40] text-slate-300 transition-colors border border-slate-700 cursor-pointer"
                title="Importar Backup JSON"
              >
                <Upload className="w-4 h-4" />
                <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
              </label>

              {Object.keys(appState.companies).length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir a empresa "${formData.nome}"?`)) {
                      onDeleteCompany(formData.id);
                      showToast('Empresa excluída com sucesso.', 'info');
                    }
                  }}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-colors"
                  title="Excluir Empresa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Search Result Chips when typing */}
        {searchTerm && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">
              Resultados da busca ({filteredCompanies.length}):
            </span>
            {filteredCompanies.map((comp) => {
              const isSelected = comp.id === appState.selectedCompanyId;
              const compHealth = calculateSeoHealthScore(comp);
              return (
                <button
                  key={comp.id}
                  onClick={() => onSelectCompany(comp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#ff5a35] text-white shadow-md'
                      : 'bg-[#182030] text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{comp.nome}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${compHealth.colorClass}`}>
                    {compHealth.score} pts &bull; {compHealth.label}
                  </span>
                </button>
              );
            })}
            {filteredCompanies.length === 0 && (
              <span className="text-rose-400 font-medium">
                Nenhuma empresa encontrada com "{searchTerm}".
              </span>
            )}
          </div>
        )}
      </div>

      {/* SUB-NAV VIEW MODE SELECTOR */}
      <div className="flex flex-wrap items-center justify-between bg-[#111622] p-3 rounded-2xl border border-slate-800 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveViewMode('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeViewMode === 'all'
                ? 'bg-[#ff5a35] text-white shadow-lg shadow-[#ff5a35]/20'
                : 'bg-[#182030] text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visão Completa (Dashboard + Edição)</span>
          </button>

          <button
            onClick={() => setActiveViewMode('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeViewMode === 'dashboard'
                ? 'bg-[#ff5a35] text-white shadow-lg shadow-[#ff5a35]/20'
                : 'bg-[#182030] text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Dashboard SEO (Recharts)</span>
          </button>

          <button
            onClick={() => setActiveViewMode('keywords3d')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeViewMode === 'keywords3d'
                ? 'bg-[#ff5a35] text-white shadow-lg shadow-[#ff5a35]/20'
                : 'bg-[#182030] text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Box className="w-4 h-4 text-purple-400" />
            <span>Rankings 3D (Three.js)</span>
          </button>

          <button
            onClick={() => setActiveViewMode('form')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeViewMode === 'form'
                ? 'bg-[#ff5a35] text-white shadow-lg shadow-[#ff5a35]/20'
                : 'bg-[#182030] text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            <Edit3 className="w-4 h-4 text-sky-400" />
            <span>Formulário de Cadastro & Métricas</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Geração de relatórios executivos com inteligência local
        </span>
      </div>

      {/* 3D KEYWORDS VISUALIZER SECTION (THREE.JS) */}
      {(activeViewMode === 'all' || activeViewMode === 'keywords3d') && (
        <div className="space-y-8">
          <Keywords3DVisualizer
            company={formData}
            onUpdateKeywords={(newTerms) => {
              setFormData((prev) => ({ ...prev, termosBusca: newTerms }));
            }}
          />
        </div>
      )}

      {/* DASHBOARD SECTION WITH RECHARTS */}
      {(activeViewMode === 'all' || activeViewMode === 'dashboard') && (
        <div className="space-y-8">
          <SeoHealthLineDashboard
            appState={appState}
            onSelectCompany={onSelectCompany}
          />
          <SeoDashboard
            appState={appState}
            selectedCompanyId={appState.selectedCompanyId}
            onSelectCompany={onSelectCompany}
          />
        </div>
      )}

      {/* FORM AND METRIC SECTIONS */}
      {(activeViewMode === 'all' || activeViewMode === 'form') && (
        <>
          {/* SECTION 1: CADASTRO E DADOS DA EMPRESA */}
          <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#ff5a35]" />
              Dados Institucionais do Cliente
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${calculateSeoHealthScore(formData).colorClass}`}>
              <span className={`w-2 h-2 rounded-full ${calculateSeoHealthScore(formData).badgeBg} animate-pulse`} />
              Saúde SEO: {calculateSeoHealthScore(formData).score}/100 ({calculateSeoHealthScore(formData).label})
            </span>
          </div>
          <span className="text-xs text-slate-400">Edição e Personalização do Relatório</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Nome da Empresa / Clínica:</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Responsável / Médico / Diretor:</label>
            <input
              type="text"
              value={formData.responsavel}
              onChange={(e) => handleInputChange('responsavel', e.target.value)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Categoria Principal:</label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Endereço Completo no Google Maps:</label>
            <input
              type="text"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">LTV Médio do Paciente/Cliente (R$):</label>
            <input
              type="number"
              value={formData.ltv}
              onChange={(e) => handleInputChange('ltv', parseFloat(e.target.value) || 0)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>
        </div>

        {/* Ciclo, Data de Entrada e Pagamento PIX */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs text-amber-400 font-bold uppercase block mb-1">📅 Dia que Entrei na Empresa (Início da Gestão):</label>
            <input
              type="text"
              value={formData.dataIntervencao}
              onChange={(e) => handleInputChange('dataIntervencao', e.target.value)}
              placeholder="Ex: 10 de Agosto ou 2026-08-10"
              className="w-full bg-[#182030] border border-amber-500/50 rounded-xl px-3 py-2 text-sm text-amber-300 font-bold focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Período de Avaliação:</label>
            <input
              type="text"
              value={formData.periodo}
              onChange={(e) => handleInputChange('periodo', e.target.value)}
              placeholder="Ex: Agosto a Setembro 2026"
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Ciclo do Relatório:</label>
            <input
              type="text"
              value={formData.ciclo}
              onChange={(e) => handleInputChange('ciclo', e.target.value)}
              placeholder="Ex: Outubro 2026"
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Chave PIX para Renovação:</label>
            <input
              type="text"
              value={formData.pixChave}
              onChange={(e) => handleInputChange('pixChave', e.target.value)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Favorecido PIX:</label>
            <input
              type="text"
              value={formData.pixFavorecido}
              onChange={(e) => handleInputChange('pixFavorecido', e.target.value)}
              className="w-full bg-[#182030] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ff5a35]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: MENSURAÇÃO E LANÇAMENTO DE MÉTRICAS */}
      <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Métricas Comparativas do Ciclo (Mês Anterior vs Mês Atual)
          </h3>
          
          <button
            onClick={handleGenerateAiInsights}
            disabled={isAiLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Gerando Análise com IA...' : 'Gerar Análise com Gemini IA'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mês Anterior */}
          <div className="bg-[#141b28] p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Mês Anterior (Antes do Acelerador)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Interações Totais:</label>
                <input
                  type="number"
                  value={formData.metricasAnterior.interacoes}
                  onChange={(e) => handleMetricaAnteriorChange('interacoes', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-300"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Rotas GPS Solicitadas:</label>
                <input
                  type="number"
                  value={formData.metricasAnterior.rotas}
                  onChange={(e) => handleMetricaAnteriorChange('rotas', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-300"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Chats / WhatsApp:</label>
                <input
                  type="number"
                  value={formData.metricasAnterior.chats}
                  onChange={(e) => handleMetricaAnteriorChange('chats', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-300"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Ligações Telefônicas:</label>
                <input
                  type="number"
                  value={formData.metricasAnterior.ligacoes}
                  onChange={(e) => handleMetricaAnteriorChange('ligacoes', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Mês Atual */}
          <div className="bg-[#141b28] p-5 rounded-xl border border-emerald-900/40 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                Mês Atual (Com Gestão ClienteBox)
              </h4>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                Acelerado
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Interações Totais:</label>
                <input
                  type="number"
                  value={formData.metricasAtual.interacoes}
                  onChange={(e) => handleMetricaAtualChange('interacoes', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-emerald-700/50 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Rotas GPS Solicitadas:</label>
                <input
                  type="number"
                  value={formData.metricasAtual.rotas}
                  onChange={(e) => handleMetricaAtualChange('rotas', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-emerald-700/50 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Chats / WhatsApp:</label>
                <input
                  type="number"
                  value={formData.metricasAtual.chats}
                  onChange={(e) => handleMetricaAtualChange('chats', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-emerald-700/50 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Ligações Telefônicas:</label>
                <input
                  type="number"
                  value={formData.metricasAtual.ligacoes}
                  onChange={(e) => handleMetricaAtualChange('ligacoes', parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1c2638] border border-emerald-700/50 rounded-lg px-3 py-1.5 text-sm font-bold text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Diagnóstico custom / IA */}
        {formData.diagnosticoCustom && (
          <div className="bg-[#182030] p-4 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Diagnóstico Gerado por IA para o Relatório:
              </span>
              <button
                onClick={() => handleInputChange('diagnosticoCustom', '')}
                className="text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            </div>
            <textarea
              value={formData.diagnosticoCustom}
              onChange={(e) => handleInputChange('diagnosticoCustom', e.target.value)}
              rows={3}
              className="w-full bg-[#121722] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* SECTION 3: AÇÕES REALIZADAS E PRÓXIMOS PASSOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ações Realizadas */}
        <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Ações Executadas no Ciclo ({formData.acoes.length})
            </h3>
            <button
              onClick={handleAddAcao}
              className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-800/50 hover:bg-amber-900/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.acoes.map((acao, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={acao}
                  onChange={(e) => handleUpdateAcao(idx, e.target.value)}
                  className="w-full bg-[#182030] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleRemoveAcao(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1.5"
                  title="Remover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Próximos Passos Estratégicos ({formData.proximosPassos.length})
            </h3>
            <button
              onClick={handleAddProximoPasso}
              className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/50 hover:bg-emerald-900/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.proximosPassos.map((passo, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={passo}
                  onChange={(e) => handleUpdateProximoPasso(idx, e.target.value)}
                  className="w-full bg-[#182030] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={() => handleRemoveProximoPasso(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1.5"
                  title="Remover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: TABELA DE CONCORRENTES & INTELIGÊNCIA COMPETITIVA */}
      <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Inteligência Competitiva (Tabela de Concorrentes)</h3>
            <p className="text-xs text-slate-400">Edição dos dados comparativos exibidos na Página 5 do Relatório Executivo</p>
          </div>

          <button
            onClick={handleAddCompetitor}
            className="flex items-center gap-1.5 bg-[#182030] hover:bg-[#202b40] text-amber-400 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Concorrente</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-2.5 px-3">Posição</th>
                <th className="py-2.5 px-3">Nome da Empresa</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3">Nota e Avaliações</th>
                <th className="py-2.5 px-3">Status / Vulnerabilidade</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {formData.concorrentes.map((comp, idx) => (
                <tr key={idx} className="hover:bg-[#151c2a]">
                  <td className="py-2 px-3 w-28">
                    <input
                      type="text"
                      value={comp.posicao}
                      onChange={(e) => handleUpdateCompetitor(idx, 'posicao', e.target.value)}
                      className="w-full bg-[#182030] border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={comp.nome}
                      onChange={(e) => handleUpdateCompetitor(idx, 'nome', e.target.value)}
                      className="w-full bg-[#182030] border border-slate-700 rounded px-2 py-1 text-white font-medium"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={comp.categoria}
                      onChange={(e) => handleUpdateCompetitor(idx, 'categoria', e.target.value)}
                      className="w-full bg-[#182030] border border-slate-700 rounded px-2 py-1 text-slate-300"
                    />
                  </td>
                  <td className="py-2 px-3 w-32">
                    <input
                      type="text"
                      value={comp.nota}
                      onChange={(e) => handleUpdateCompetitor(idx, 'nota', e.target.value)}
                      className="w-full bg-[#182030] border border-slate-700 rounded px-2 py-1 text-amber-400"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={comp.status}
                      onChange={(e) => handleUpdateCompetitor(idx, 'status', e.target.value)}
                      className="w-full bg-[#182030] border border-slate-700 rounded px-2 py-1 text-slate-300"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleRemoveCompetitor(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Excluir"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: FORMULÁRIOS E FICHAS RECEBIDAS DAS EMPRESAS (PÚBLICO) */}
      <OnboardingSubmissionsViewer showToast={showToast} onAddCompany={onAddCompany} />

      {/* SECTION 6: GESTORES E ADMINISTRADORES DO SISTEMA */}
      <GestoresManagerSection showToast={showToast} />
        </>
      )}
    </motion.div>
  );
};
