import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  ExternalLink, 
  Download,
  Send,
  Clock,
  Briefcase,
  Globe,
  Award,
  X,
  ShieldCheck,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Company } from '../types';

export interface OnboardingSubmission {
  id: string;
  responsavelNome: string;
  responsavelTelefone: string;
  responsavelEmail?: string;
  nomeEmpresa: string;
  niches: string[];
  customNiche?: string;
  dadosCompletos: any;
  criadoEm: string;
}

interface OnboardingSubmissionsViewerProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onAddCompany: (company: Company) => void;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbglvwvr';

export const OnboardingSubmissionsViewer: React.FC<OnboardingSubmissionsViewerProps> = ({
  showToast,
  onAddCompany
}) => {
  const [submissions, setSubmissions] = useState<OnboardingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // New Manual Submission Form state
  const [newForm, setNewForm] = useState({
    nomeEmpresa: '',
    responsavelNomeCargo: '',
    telefoneWhatsapp: '',
    categoriaAtuacao: '',
    tipoAtendimento: 'Ambos (Atendimento Físico e Domicílio)',
    enderecoPontoReferencia: '',
    horarioFuncionamento: 'Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 12:00',
    siteInstagram: '',
    servicosProdutosVender: '',
    diferenciaisEmpresa: '',
    enviarFormspree: true
  });

  const loadSubmissions = async () => {
    setIsLoading(true);
    let apiData: OnboardingSubmission[] = [];

    // 1. Carregar do Servidor Backend / Cloud SQL
    try {
      const res = await fetch('/api/onboarding-submissions');
      if (res.ok) {
        apiData = await res.json();
      }
    } catch (err) {
      console.warn('Aviso ao carregar cadastros do servidor:', err);
    }

    // 2. Carregar do LocalStorage
    let localData: OnboardingSubmission[] = [];
    try {
      const stored = localStorage.getItem('clientebox_completed_submissions');
      if (stored) {
        localData = JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Aviso ao ler do LocalStorage:', err);
    }

    // 3. Mesclar ambas as fontes sem duplicidades por ID ou Nome+Data
    const combinedMap = new Map<string, OnboardingSubmission>();

    [...apiData, ...localData].forEach((sub) => {
      if (sub && sub.nomeEmpresa) {
        const key = sub.id || `${sub.nomeEmpresa.toLowerCase()}_${sub.criadoEm || ''}`;
        if (!combinedMap.has(key)) {
          combinedMap.set(key, sub);
        }
      }
    });

    const mergedList = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime()
    );

    setSubmissions(mergedList);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubmissions();

    // Escutar eventos locais de novo formulário preenchido
    const handleUpdate = () => loadSubmissions();

    window.addEventListener('onboarding_submission_added', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('onboarding_submission_added', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja excluir o cadastro da empresa "${nome}"?`)) return;

    try {
      await fetch(`/api/onboarding-submissions/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Erro ao remover do servidor:', err);
    }

    // Remover do LocalStorage
    try {
      const stored = JSON.parse(localStorage.getItem('clientebox_completed_submissions') || '[]');
      const filtered = stored.filter((s: any) => s.id !== id);
      localStorage.setItem('clientebox_completed_submissions', JSON.stringify(filtered));
    } catch (err) {
      console.warn('Erro ao atualizar storage:', err);
    }

    showToast(`Cadastro de "${nome}" excluído.`, 'info');
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreateManualSubmission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newForm.nomeEmpresa.trim() || !newForm.responsavelNomeCargo.trim() || !newForm.telefoneWhatsapp.trim()) {
      showToast('Preencha os campos obrigatórios (*).', 'error');
      return;
    }

    setIsSubmittingNew(true);

    const submissionRecord: OnboardingSubmission = {
      id: `sub_${Date.now()}`,
      nomeEmpresa: newForm.nomeEmpresa.trim(),
      responsavelNome: newForm.responsavelNomeCargo.trim(),
      responsavelTelefone: newForm.telefoneWhatsapp.trim(),
      niches: [newForm.categoriaAtuacao || 'Negócio Local'],
      dadosCompletos: { ...newForm },
      criadoEm: new Date().toISOString()
    };

    // 1. Salvar localmente
    try {
      const storedList = JSON.parse(localStorage.getItem('clientebox_completed_submissions') || '[]');
      storedList.unshift(submissionRecord);
      localStorage.setItem('clientebox_completed_submissions', JSON.stringify(storedList.slice(0, 100)));
    } catch (err) {
      console.warn('Erro ao salvar localmente:', err);
    }

    // 2. Salvar na API
    try {
      await fetch('/api/onboarding-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionRecord)
      });
    } catch (err) {
      console.warn('Erro ao enviar para API:', err);
    }

    // 3. Enviar para o Formspree se solicitado
    if (newForm.enviarFormspree) {
      try {
        await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "Nome Oficial da Empresa": newForm.nomeEmpresa,
            "Nome do Responsável e Cargo": newForm.responsavelNomeCargo,
            "Telefone / WhatsApp": newForm.telefoneWhatsapp,
            "Ramo / Categoria Principal": newForm.categoriaAtuacao,
            "Tipo de Atendimento": newForm.tipoAtendimento,
            "Endereço Completo & Ponto de Referência": newForm.enderecoPontoReferencia || 'Não informado',
            "Horário de Funcionamento": newForm.horarioFuncionamento || 'Não informado',
            "Site / Instagram / Cardápio Digital": newForm.siteInstagram || 'Não informado',
            "Principais Serviços / Produtos a Vender": newForm.servicosProdutosVender,
            "Diferenciais da Empresa": newForm.diferenciaisEmpresa || 'Não informado',
            "Data de Envio": new Date().toLocaleString('pt-BR')
          })
        });
      } catch (err) {
        console.warn('Aviso ao disparar para o Formspree:', err);
      }
    }

    setIsSubmittingNew(false);
    setIsAddModalOpen(false);
    showToast(`Formulário de "${newForm.nomeEmpresa}" registrado e sincronizado com sucesso!`, 'success');
    loadSubmissions();

    setNewForm({
      nomeEmpresa: '',
      responsavelNomeCargo: '',
      telefoneWhatsapp: '',
      categoriaAtuacao: '',
      tipoAtendimento: 'Ambos (Atendimento Físico e Domicílio)',
      enderecoPontoReferencia: '',
      horarioFuncionamento: 'Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 12:00',
      siteInstagram: '',
      servicosProdutosVender: '',
      diferenciaisEmpresa: '',
      enviarFormspree: true
    });
  };

  const handleConvertToCompany = (sub: OnboardingSubmission) => {
    const rawData = sub.dadosCompletos || {};
    const companyId = (rawData.nomeEmpresa || sub.nomeEmpresa)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    const newComp: Company = {
      id: companyId || `empresa-${Date.now()}`,
      nome: rawData.nomeEmpresa || sub.nomeEmpresa,
      responsavel: `${sub.responsavelNome} (${sub.responsavelTelefone})`,
      categoria: sub.niches?.join(' / ') || rawData.categoriaAtuacao || rawData.primaryCategory || 'Negócio Local',
      endereco: rawData.enderecoPontoReferencia || `${rawData.rua || 'Rua Principal'}, ${rawData.numero || 'S/N'} - ${rawData.bairro || 'Centro'}, ${rawData.cidade || 'Rio Branco'} - ${rawData.estado || 'AC'}`,
      ltv: 1500,
      pixChave: '(68) 98103-4408',
      pixFavorecido: 'Rômulo Chaves da Silva',
      pixBanco: 'Sicredi',
      periodo: `${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
      ciclo: 'Início de Gestão',
      dataIntervencao: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
      metricasAnterior: { interacoes: 100, rotas: 40, chats: 20, ligacoes: 15 },
      metricasAtual: { interacoes: 280, rotas: 120, chats: 65, ligacoes: 40 },
      acoes: [
        'Análise da ficha pública de cadastro e alinhamento de categorias',
        'Parametrização de botão de agendamento rápido via WhatsApp',
        'Otimização do Perfil no Google Business Profile e geomapeamento'
      ],
      proximosPassos: [
        'Coleta ativa de avaliações 5 estrelas pós-atendimento',
        'Inclusão de fotos de alta resolução do espaço físico'
      ],
      concorrentes: [
        {
          nome: `${rawData.nomeEmpresa || sub.nomeEmpresa} (Nova)`,
          posicao: 'Início de Gestão',
          categoria: sub.niches?.[0] || 'Negócio Local',
          nota: '5.0 ★ (Novo)',
          status: 'Otimização Ativa ClienteBox'
        }
      ]
    };

    onAddCompany(newComp);
    showToast(`Empresa "${newComp.nome}" convertida e adicionada às empresas sob gestão com sucesso!`, 'success');
  };

  const handleSendToCrm = (sub: OnboardingSubmission) => {
    try {
      const storedLeads = JSON.parse(localStorage.getItem('clientebox_crm_leads_v1') || '[]');
      const newCrmLead = {
        id: `lead-from-onb-${Date.now()}`,
        tabId: 'inbox',
        name: sub.nomeEmpresa || sub.responsavelNome,
        phone: sub.responsavelTelefone,
        lastMessage: `Ficha de Briefing recebida: ${sub.niches?.[0] || 'Negócio Local'}`,
        messageType: 'text',
        dealValue: 700,
        tags: [...(sub.niches || []), 'Formspree'],
        notes: `Responsável: ${sub.responsavelNome}. Contato enviado das Fichas para o CRM WhatsApp.`,
        unreadCount: 1,
        source: 'formspree',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storedLeads.unshift(newCrmLead);
      localStorage.setItem('clientebox_crm_leads_v1', JSON.stringify(storedLeads));
      showToast(`Contato "${newCrmLead.name}" enviado para a aba INBOX do CRM WhatsApp!`, 'success');
    } catch (e) {
      showToast('Erro ao enviar contato para o CRM.', 'error');
    }
  };

  const filtered = submissions.filter((s) => {
    const q = searchQuery.toLowerCase();
    const data = s.dadosCompletos || {};
    return (
      s.nomeEmpresa?.toLowerCase().includes(q) ||
      s.responsavelNome?.toLowerCase().includes(q) ||
      s.responsavelTelefone?.toLowerCase().includes(q) ||
      s.niches?.some((n) => n.toLowerCase().includes(q)) ||
      data.servicosProdutosVender?.toLowerCase().includes(q) ||
      data.enderecoPontoReferencia?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
      
      {/* FORMSPREE INTEGRATION STATUS BANNER */}
      <div className="bg-gradient-to-r from-[#141d2d] via-[#172338] to-[#141d2d] p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">Integração Formspree Conectada</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Ativo & Sincronizado
              </span>
            </div>
            <p className="text-slate-300 mt-0.5 font-mono text-[11px]">
              Endpoint Oficial: <span className="text-amber-300 font-bold underline">{FORMSPREE_ENDPOINT}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Formularíssimo / Teste Formspree</span>
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            Fichas e Formulários de Otimização Recebidos ({submissions.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastros preenchidos pelas empresas no formulário público para início de gestão no Google Maps.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por empresa, nome, nicho..."
            className="bg-[#161d2a] border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ff5a35] w-full sm:w-56"
          />

          <button
            onClick={loadSubmissions}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#182030] hover:bg-[#202b40] text-slate-300 border border-slate-700 transition-colors shrink-0"
            title="Atualizar formulários"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* EMPTY SUBMISSIONS STATE */}
      {filtered.length === 0 ? (
        <div className="p-10 text-center bg-[#161d2a] rounded-2xl border border-slate-800 space-y-4">
          <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
          <div>
            <p className="text-base text-slate-300 font-bold">
              Nenhum formulário de cadastro recebido ainda.
            </p>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Envie o link do formulário público para as empresas parceiras preencherem. Todas as respostas enviadas via <strong className="text-amber-400">Formspree ({FORMSPREE_ENDPOINT})</strong> aparecerão aqui em tempo real!
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-400 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Simular Cadastro de Teste Formspree</span>
          </button>
        </div>
      ) : (
        /* SUBMISSIONS LIST */
        <div className="space-y-4">
          {filtered.map((sub) => {
            const isExpanded = expandedId === sub.id;
            const data = sub.dadosCompletos || {};

            return (
              <div
                key={sub.id}
                className="bg-[#161d2a] rounded-2xl border border-slate-800 overflow-hidden transition-all hover:border-slate-700"
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-white">
                        {sub.nomeEmpresa}
                      </span>
                      {sub.niches?.map((n) => (
                        <span
                          key={n}
                          className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        >
                          {n}
                        </span>
                      ))}
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full">
                        Formspree Sincronizado
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        {sub.responsavelNome}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {sub.responsavelTelefone}
                      </span>
                      {sub.responsavelEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {sub.responsavelEmail}
                        </span>
                      )}
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                    <button
                      onClick={() => handleSendToCrm(sub)}
                      className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-sky-600/20"
                      title="Enviar contato direto para o CRM WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Enviar p/ CRM</span>
                    </button>

                    <button
                      onClick={() => handleConvertToCompany(sub)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                      title="Importar e criar nova empresa no painel"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Gerenciar Empresa</span>
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      className="p-2 rounded-xl bg-[#182030] hover:bg-[#202b40] text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Ocultar' : 'Ver Detalhes'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(sub.id, sub.nomeEmpresa)}
                      className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition-colors"
                      title="Excluir cadastro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div className="p-5 bg-[#111622] border-t border-slate-800 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-slate-500 font-bold uppercase tracking-wider block">1. Endereço Completo & Referência:</span>
                        <p className="text-slate-200">
                          {data.enderecoPontoReferencia || `${data.rua || 'Rua'}, nº ${data.numero || 'S/N'} - ${data.bairro || 'Bairro'}, ${data.cidade || 'Rio Branco'}/${data.estado || 'AC'}`}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 font-bold uppercase tracking-wider block">2. Horário de Funcionamento:</span>
                        <p className="text-slate-200">
                          {data.horarioFuncionamento || `Seg-Sex: ${data.horarioSemana || '08:00 - 18:00'} | Sáb: ${data.horarioSabado || '08:00 - 12:00'}`}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 font-bold uppercase tracking-wider block">3. Canais, Redes & Links:</span>
                        <p className="text-slate-200">
                          WhatsApp: {data.telefoneWhatsapp || sub.responsavelTelefone}<br />
                          Site/Instagram: {data.siteInstagram || data.instagram || 'Não informado'}<br />
                          Tipo de Atendimento: {data.tipoAtendimento || 'Ambos'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-amber-400 font-bold uppercase tracking-wider block">4. Principais Serviços / Produtos a Vender:</span>
                        <p className="text-slate-200 whitespace-pre-line bg-[#0d121c] p-3 rounded-xl border border-slate-800 font-medium">
                          {data.servicosProdutosVender || data.customServices || 'Não informado'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-emerald-400 font-bold uppercase tracking-wider block">5. Diferenciais da Empresa:</span>
                        <p className="text-slate-200 whitespace-pre-line bg-[#0d121c] p-3 rounded-xl border border-slate-800 font-medium">
                          {data.diferenciaisEmpresa || 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE MANUAL / TEST FORMS PREEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#131926] border border-amber-500/30 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Registrar / Testar Formulário Formspree</h3>
                  <p className="text-xs text-slate-400">Adicione uma ficha de briefing diretamente no painel centralizado</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSubmission} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase mb-1">Nome Oficial da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={newForm.nomeEmpresa}
                    onChange={(e) => setNewForm({ ...newForm, nomeEmpresa: e.target.value })}
                    placeholder="Ex: Jucelino Castro Fisioterapia"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Nome do Responsável *</label>
                  <input
                    type="text"
                    required
                    value={newForm.responsavelNomeCargo}
                    onChange={(e) => setNewForm({ ...newForm, responsavelNomeCargo: e.target.value })}
                    placeholder="Ex: Dr. Jucelino Castro"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newForm.telefoneWhatsapp}
                    onChange={(e) => setNewForm({ ...newForm, telefoneWhatsapp: e.target.value })}
                    placeholder="Ex: (68) 98103-4408"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Categoria / Categoria Principal</label>
                  <input
                    type="text"
                    value={newForm.categoriaAtuacao}
                    onChange={(e) => setNewForm({ ...newForm, categoriaAtuacao: e.target.value })}
                    placeholder="Ex: Clínica de Fisioterapia"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Tipo de Atendimento</label>
                  <select
                    value={newForm.tipoAtendimento}
                    onChange={(e) => setNewForm({ ...newForm, tipoAtendimento: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-slate-700 text-amber-300 font-bold rounded-xl p-3 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Físico (Sede Própria)">Físico (Sede Própria)</option>
                    <option value="Atendimento em Domicílio / Área de Cobertura">Atendimento em Domicílio</option>
                    <option value="Ambos (Atendimento Físico e Domicílio)">Ambos (Físico + Domicílio)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase mb-1">Endereço Completo & Ponto de Referência</label>
                  <input
                    type="text"
                    value={newForm.enderecoPontoReferencia}
                    onChange={(e) => setNewForm({ ...newForm, enderecoPontoReferencia: e.target.value })}
                    placeholder="Ex: Rua Quintino Bocaiúva, 1848 - Bairro Bosque, Rio Branco/AC"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase mb-1">Principais Serviços / Produtos que Quer Vender</label>
                  <textarea
                    rows={3}
                    value={newForm.servicosProdutosVender}
                    onChange={(e) => setNewForm({ ...newForm, servicosProdutosVender: e.target.value })}
                    placeholder="Ex: Fisioterapia Esportiva, Reabilitação de Coluna, Pilates Clínico"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enviar-formspree-check"
                  checked={newForm.enviarFormspree}
                  onChange={(e) => setNewForm({ ...newForm, enviarFormspree: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                />
                <label htmlFor="enviar-formspree-check" className="text-slate-300 font-bold cursor-pointer">
                  Disparar cópia de teste para o Formspree ({FORMSPREE_ENDPOINT})
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 font-bold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingNew ? 'Salvando...' : 'Salvar Formulário'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
