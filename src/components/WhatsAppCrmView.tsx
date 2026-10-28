import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Tag, 
  DollarSign, 
  Trash2, 
  Edit3, 
  MoreVertical, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Settings, 
  QrCode, 
  Copy, 
  Check, 
  FileText, 
  User, 
  Layers, 
  AlertCircle, 
  X,
  Volume2,
  Image as ImageIcon,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Download,
  Upload
} from 'lucide-react';
import { CrmTab, CrmLead, QuickMessageTemplate, Company } from '../types';
import { 
  defaultCrmTabs, 
  defaultCrmLeads, 
  defaultQuickMessages, 
  defaultCrmConfig, 
  CRM_STORAGE_TABS_KEY, 
  CRM_STORAGE_LEADS_KEY, 
  CRM_STORAGE_CONFIG_KEY,
  CrmConfig
} from '../data/defaultCrmData';

interface WhatsAppCrmViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  companies?: Record<string, Company>;
}

export const WhatsAppCrmView: React.FC<WhatsAppCrmViewProps> = ({
  showToast,
  companies = {}
}) => {
  // Tabs & Leads State
  const [tabs, setTabs] = useState<CrmTab[]>(() => {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_TABS_KEY);
      return stored ? JSON.parse(stored) : defaultCrmTabs;
    } catch {
      return defaultCrmTabs;
    }
  });

  const [leads, setLeads] = useState<CrmLead[]>(() => {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_LEADS_KEY);
      return stored ? JSON.parse(stored) : defaultCrmLeads;
    } catch {
      return defaultCrmLeads;
    }
  });

  const [crmConfig, setCrmConfig] = useState<CrmConfig>(() => {
    try {
      const stored = localStorage.getItem(CRM_STORAGE_CONFIG_KEY);
      return stored ? JSON.parse(stored) : defaultCrmConfig;
    } catch {
      return defaultCrmConfig;
    }
  });

  const [quickMessages, setQuickMessages] = useState<QuickMessageTemplate[]>(defaultQuickMessages);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeTabFilter, setActiveTabFilter] = useState<string>('all');

  // Modals State
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState(false);
  const [editingTab, setEditingTab] = useState<CrmTab | null>(null);
  const [newTabTitle, setNewTabTitle] = useState('');
  const [newTabColor, setNewTabColor] = useState('#10b981');

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<CrmLead | null>(null);
  const [leadFormData, setLeadFormData] = useState<Partial<CrmLead>>({
    name: '',
    phone: '',
    tabId: 'inbox',
    dealValue: 700,
    tags: ['Google Maps'],
    lastMessage: '',
    notes: '',
    followUpDate: '',
    followUpTime: ''
  });

  const [isQuickMsgModalOpen, setIsQuickMsgModalOpen] = useState(false);
  const [selectedLeadForMessage, setSelectedLeadForMessage] = useState<CrmLead | null>(null);
  const [customText, setCustomText] = useState('');

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Drag and Drop State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(CRM_STORAGE_TABS_KEY, JSON.stringify(tabs));
    } catch (e) {
      console.warn('Erro ao salvar abas:', e);
    }
  }, [tabs]);

  useEffect(() => {
    try {
      localStorage.setItem(CRM_STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.warn('Erro ao salvar leads:', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(CRM_STORAGE_CONFIG_KEY, JSON.stringify(crmConfig));
    } catch (e) {
      console.warn('Erro ao salvar config:', e);
    }
  }, [crmConfig]);

  // Clean and format phone for WhatsApp
  const cleanPhone = (phoneStr: string) => {
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.length === 10 || cleaned.length === 11) {
      cleaned = '55' + cleaned;
    }
    return cleaned;
  };

  // Open WhatsApp directly
  const handleOpenWhatsApp = (lead: CrmLead, message?: string) => {
    const phone = cleanPhone(lead.phone);
    if (!phone) {
      showToast('Telefone inválido ou não informado para este lead.', 'error');
      return;
    }

    const textToUse = message ? encodeURIComponent(message) : '';
    const url = textToUse 
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${textToUse}`
      : `https://api.whatsapp.com/send?phone=${phone}`;

    window.open(url, '_blank');
    showToast(`Iniciando conversa no WhatsApp com ${lead.name}...`, 'success');
  };

  // Send Quick Script Template to WhatsApp
  const handleSendQuickTemplate = (lead: CrmLead, template: QuickMessageTemplate) => {
    let processedText = template.text
      .replace(/{nome}/g, lead.name)
      .replace(/{valor}/g, lead.dealValue ? lead.dealValue.toLocaleString('pt-BR') : '700,00');

    handleOpenWhatsApp(lead, processedText);
    setIsQuickMsgModalOpen(false);

    // If template is follow-up 1x, suggest moving to Retomar 1x
    if (template.category === 'followup' && template.id === 'qm-1') {
      const retomar1Tab = tabs.find(t => t.id === 'retomar-1x' || t.title.toLowerCase().includes('retomar 1'));
      if (retomar1Tab && lead.tabId !== retomar1Tab.id) {
        moveLeadToTab(lead.id, retomar1Tab.id);
        showToast(`Lead movido automaticamente para a aba "${retomar1Tab.title}"!`, 'info');
      }
    } else if (template.category === 'followup' && template.id === 'qm-2') {
      const retomar2Tab = tabs.find(t => t.id === 'retomar-2x' || t.title.toLowerCase().includes('retomar 2'));
      if (retomar2Tab && lead.tabId !== retomar2Tab.id) {
        moveLeadToTab(lead.id, retomar2Tab.id);
        showToast(`Lead movido automaticamente para a aba "${retomar2Tab.title}"!`, 'info');
      }
    }
  };

  // Move lead to another tab
  const moveLeadToTab = (leadId: string, newTabId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          tabId: newTabId,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    }));
  };

  // Tab Management
  const handleSaveTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabTitle.trim()) {
      showToast('O título da aba é obrigatório.', 'error');
      return;
    }

    if (editingTab) {
      setTabs(prev => prev.map(t => t.id === editingTab.id ? { ...t, title: newTabTitle.trim(), color: newTabColor } : t));
      showToast(`Aba "${newTabTitle}" atualizada com sucesso!`, 'success');
    } else {
      const newId = `tab-${Date.now()}`;
      const newTabItem: CrmTab = {
        id: newId,
        title: newTabTitle.trim().toUpperCase(),
        color: newTabColor,
        order: tabs.length + 1
      };
      setTabs(prev => [...prev, newTabItem]);
      showToast(`Nova aba "${newTabTitle}" adicionada ao CRM!`, 'success');
    }

    setIsNewTabModalOpen(false);
    setEditingTab(null);
    setNewTabTitle('');
  };

  const handleDeleteTab = (tabId: string, tabTitle: string) => {
    if (tabs.length <= 1) {
      showToast('Você precisa manter pelo menos 1 aba no CRM.', 'error');
      return;
    }

    const leadsInTab = leads.filter(l => l.tabId === tabId).length;
    if (leadsInTab > 0) {
      if (!confirm(`A aba "${tabTitle}" possui ${leadsInTab} contatos. Deseja mover esses contatos para a primeira aba e excluir?`)) {
        return;
      }
      const firstOtherTab = tabs.find(t => t.id !== tabId);
      if (firstOtherTab) {
        setLeads(prev => prev.map(l => l.tabId === tabId ? { ...l, tabId: firstOtherTab.id } : l));
      }
    }

    setTabs(prev => prev.filter(t => t.id !== tabId));
    showToast(`Aba "${tabTitle}" removida.`, 'info');
  };

  // Lead Management
  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadFormData.name?.trim() || !leadFormData.phone?.trim()) {
      showToast('Nome e telefone são obrigatórios.', 'error');
      return;
    }

    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? {
        ...l,
        ...leadFormData,
        updatedAt: new Date().toISOString()
      } as CrmLead : l));
      showToast(`Lead "${leadFormData.name}" atualizado!`, 'success');
    } else {
      const newLead: CrmLead = {
        id: `lead-${Date.now()}`,
        tabId: leadFormData.tabId || tabs[0]?.id || 'inbox',
        name: leadFormData.name.trim(),
        phone: leadFormData.phone.trim(),
        lastMessage: leadFormData.lastMessage || 'Novo lead cadastrado',
        messageType: 'text',
        dealValue: Number(leadFormData.dealValue) || 700,
        tags: Array.isArray(leadFormData.tags) ? leadFormData.tags : ['Google Maps'],
        followUpDate: leadFormData.followUpDate || '',
        followUpTime: leadFormData.followUpTime || '',
        notes: leadFormData.notes || '',
        unreadCount: 0,
        source: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLeads(prev => [newLead, ...prev]);
      showToast(`Lead "${newLead.name}" adicionado na aba!`, 'success');
    }

    setIsLeadModalOpen(false);
    setEditingLead(null);
  };

  const handleDeleteLead = (leadId: string, leadName: string) => {
    if (!confirm(`Deseja excluir o contato "${leadName}" do CRM?`)) return;
    setLeads(prev => prev.filter(l => l.id !== leadId));
    showToast(`Contato "${leadName}" removido.`, 'info');
  };

  // Drag and drop handlers
  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetTabId: string) => {
    if (draggedLeadId) {
      moveLeadToTab(draggedLeadId, targetTabId);
      setDraggedLeadId(null);
    }
  };

  // Import Leads from System (Companies and Onboarding)
  const handleImportCompaniesToCrm = () => {
    const existingPhones = new Set(leads.map(l => cleanPhone(l.phone)));
    let addedCount = 0;

    const newEntries: CrmLead[] = [];

    // Import from Registered Companies
    Object.values(companies).forEach((comp, idx) => {
      const phoneMatch = comp.responsavel.match(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/);
      const rawPhone = phoneMatch ? phoneMatch[0] : '68981034408';
      const cleaned = cleanPhone(rawPhone);

      if (!existingPhones.has(cleaned)) {
        existingPhones.add(cleaned);
        addedCount++;
        newEntries.push({
          id: `imp-comp-${Date.now()}-${idx}`,
          tabId: 'inbox',
          name: comp.nome,
          phone: rawPhone,
          lastMessage: `Cliente sob gestão: ${comp.ciclo}`,
          messageType: 'text',
          dealValue: comp.ltv || 1200,
          tags: [comp.categoria.split(' ')[0] || 'Empresa', 'Gestão Ativa'],
          notes: `Endereço: ${comp.endereco}`,
          unreadCount: 0,
          source: 'manual',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    // Import from LocalStorage Onboarding Submissions
    try {
      const storedSubmissions = JSON.parse(localStorage.getItem('clientebox_completed_submissions') || '[]');
      storedSubmissions.forEach((sub: any, idx: number) => {
        const cleaned = cleanPhone(sub.responsavelTelefone || '');
        if (cleaned && !existingPhones.has(cleaned)) {
          existingPhones.add(cleaned);
          addedCount++;
          newEntries.push({
            id: `imp-onb-${Date.now()}-${idx}`,
            tabId: 'inbox',
            name: sub.nomeEmpresa || sub.responsavelNome,
            phone: sub.responsavelTelefone,
            lastMessage: `Ficha Formspree preenchida (${new Date(sub.criadoEm).toLocaleDateString('pt-BR')})`,
            messageType: 'text',
            dealValue: 700,
            tags: sub.niches || ['Formspree'],
            notes: `Responsável: ${sub.responsavelNome}. Serviços: ${sub.dadosCompletos?.servicosProdutosVender || ''}`,
            unreadCount: 1,
            source: 'formspree',
            createdAt: sub.criadoEm || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    } catch (e) {
      console.warn('Erro ao importar submissões:', e);
    }

    if (newEntries.length > 0) {
      setLeads(prev => [...newEntries, ...prev]);
      showToast(`${addedCount} novos contatos importados para a aba INBOX!`, 'success');
    } else {
      showToast('Nenhum novo contato encontrado para importar.', 'info');
    }

    setIsImportModalOpen(false);
  };

  // Filter Leads
  const filteredLeads = leads.filter(l => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      l.name.toLowerCase().includes(q) || 
      l.phone.includes(q) || 
      l.tags.some(t => t.toLowerCase().includes(q)) || 
      l.lastMessage?.toLowerCase().includes(q);

    const matchesTag = selectedTag === 'all' || l.tags.includes(selectedTag);
    const matchesTab = activeTabFilter === 'all' || l.tabId === activeTabFilter;

    return matchesSearch && matchesTag && matchesTab;
  });

  // Calculate Pipeline Sums
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const totalLeadsCount = leads.length;

  const getTabStats = (tabId: string) => {
    const tabLeads = leads.filter(l => l.tabId === tabId);
    const sum = tabLeads.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);
    return { count: tabLeads.length, totalValue: sum };
  };

  // All Unique Tags for Filter
  const allTags = Array.from(new Set(leads.flatMap(l => l.tags)));

  return (
    <div className="w-full min-h-screen bg-[#0b0e14] text-slate-100 p-3 sm:p-6 space-y-6">
      
      {/* TOP HEADER BAR (WASELLER STYLE) */}
      <div className="bg-[#121722] rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  CRM WhatsApp & Funil de Conversas
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  WaSeller Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Organize conversas em abas personalizadas, acompanhe follow-ups e envie scripts diretos pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* METRICS BADGES & TOP ACTIONS */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-[#182030] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total no CRM</span>
              <strong className="text-white font-mono">{totalLeadsCount} contatos</strong>
            </div>
          </div>

          <div className="bg-[#182030] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Pipeline Total</span>
              <strong className="text-emerald-400 font-mono">
                R$ {totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          {/* ADD TAB BUTTON */}
          <button
            onClick={() => {
              setEditingTab(null);
              setNewTabTitle('');
              setNewTabColor('#10b981');
              setIsNewTabModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            title="Adicionar nova coluna / etapa do funil"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ Nova Aba</span>
          </button>

          {/* ADD LEAD BUTTON */}
          <button
            onClick={() => {
              setEditingLead(null);
              setLeadFormData({
                name: '',
                phone: '',
                tabId: tabs[0]?.id || 'inbox',
                dealValue: 700,
                tags: ['Google Maps'],
                lastMessage: '',
                notes: ''
              });
              setIsLeadModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <User className="w-4 h-4" />
            <span>+ Novo Lead</span>
          </button>

          {/* IMPORT LEADS */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="p-2.5 bg-[#182030] hover:bg-[#202b40] text-slate-300 border border-slate-700 rounded-xl transition-all"
            title="Importar contatos do sistema"
          >
            <Upload className="w-4 h-4 text-amber-400" />
          </button>

          {/* WHATSAPP CONFIG */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2.5 bg-[#182030] hover:bg-[#202b40] text-slate-300 border border-slate-700 rounded-xl transition-all"
            title="Configurações do WhatsApp e Conexão"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-[#121722] p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, telefone, mensagem ou tag..."
              className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* TAG FILTER */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#0b0e14] border border-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Todas as Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* TAB FILTER (MOBILE HELPER) */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeTabFilter}
              onChange={(e) => setActiveTabFilter(e.target.value)}
              className="bg-[#0b0e14] border border-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">Todas as Abas</option>
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>{tab.title}</option>
              ))}
            </select>
          </div>

          {/* RESET FILTER */}
          {(searchQuery || selectedTag !== 'all' || activeTabFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('all');
                setActiveTabFilter('all');
              }}
              className="text-amber-400 hover:text-amber-300 underline font-bold px-2 py-1"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* HORIZONTAL KANBAN FUNNEL COLUMNS / ABAS (EXACT WASELLER INTERFACE) */}
      <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-700">
        <div className="flex items-start gap-4 min-w-max">
          {tabs.map((tab) => {
            const stats = getTabStats(tab.id);
            const tabLeads = filteredLeads.filter(l => l.tabId === tab.id);

            return (
              <div
                key={tab.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(tab.id)}
                className="w-80 sm:w-84 shrink-0 bg-[#121722] rounded-2xl border border-slate-800 shadow-xl flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* TAB HEADER (PILL BADGE STYLE AS IN SCREENSHOT) */}
                <div 
                  className="p-3 border-b border-slate-800/80 flex items-center justify-between gap-2"
                  style={{ borderTop: `4px solid ${tab.color}` }}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span 
                      className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm truncate"
                      style={{ backgroundColor: tab.color }}
                    >
                      {tab.title}
                    </span>

                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono">
                      {stats.count}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono font-medium truncate">
                      R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* TAB MENU OPTIONS */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTab(tab);
                        setNewTabTitle(tab.title);
                        setNewTabColor(tab.color);
                        setIsNewTabModalOpen(true);
                      }}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                      title="Editar esta aba"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteTab(tab.id, tab.title)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                      title="Excluir aba"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CARDS LIST UNDER THIS TAB */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {tabLeads.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-2">
                      <MessageSquare className="w-6 h-6 mx-auto text-slate-600" />
                      <p className="text-xs font-medium">Nenhuma conversa nesta aba</p>
                      <p className="text-[10px] text-slate-600">Arraste contatos para cá ou crie um novo lead.</p>
                    </div>
                  ) : (
                    tabLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        className="bg-[#161c28] hover:bg-[#1a2232] border border-slate-800 hover:border-slate-700 rounded-xl p-3 shadow-md space-y-2.5 transition-all cursor-grab active:cursor-grabbing group relative"
                      >
                        {/* CARD TOP INFO */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-slate-700/80 border border-slate-600 flex items-center justify-center text-xs font-black text-amber-400 shrink-0">
                              {lead.name.slice(0, 2).toUpperCase()}
                            </div>

                            <div className="overflow-hidden">
                              <h4 className="text-xs font-extrabold text-white truncate group-hover:text-amber-400 transition-colors">
                                {lead.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                {lead.phone}
                              </p>
                            </div>
                          </div>

                          {/* DEAL VALUE */}
                          {lead.dealValue > 0 && (
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono shrink-0">
                              R$ {lead.dealValue.toLocaleString('pt-BR')}
                            </span>
                          )}
                        </div>

                        {/* LAST MESSAGE PREVIEW (WASELLER STYLE) */}
                        {lead.lastMessage && (
                          <div className="bg-[#0e131d] p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                            {lead.messageType === 'audio' ? (
                              <Volume2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            ) : lead.messageType === 'image' ? (
                              <ImageIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            ) : (
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span className="truncate italic">{lead.lastMessage}</span>
                          </div>
                        )}

                        {/* TAGS */}
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* FOLLOW-UP DATE REMINDER */}
                        {lead.followUpDate && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Retorno: {lead.followUpDate} {lead.followUpTime || ''}</span>
                          </div>
                        )}

                        {/* ACTION BAR IN CARD (LIKE WASELLER ICONS) */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            {/* WHATSAPP DIRECT BUTTON */}
                            <button
                              onClick={() => handleOpenWhatsApp(lead)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all"
                              title="Abrir no WhatsApp Web / Celular"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>

                            {/* QUICK SCRIPTS BUTTON */}
                            <button
                              onClick={() => {
                                setSelectedLeadForMessage(lead);
                                setIsQuickMsgModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 transition-all font-bold flex items-center gap-1 text-[10px]"
                              title="Enviar script / mensagem rápida"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Script</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* MOVE TO TAB QUICK DROPDOWN */}
                            <select
                              value={lead.tabId}
                              onChange={(e) => moveLeadToTab(lead.id, e.target.value)}
                              className="bg-[#0e131d] border border-slate-700 text-slate-300 text-[10px] font-bold py-1 px-1.5 rounded-lg focus:outline-none cursor-pointer max-w-[100px] truncate"
                              title="Mover de aba"
                            >
                              {tabs.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                            </select>

                            {/* EDIT LEAD */}
                            <button
                              onClick={() => {
                                setEditingLead(lead);
                                setLeadFormData({ ...lead });
                                setIsLeadModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-white"
                              title="Editar lead"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {/* DELETE LEAD */}
                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.name)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Excluir"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>

                {/* FOOTER BUTTON: ADD LEAD IN THIS SPECIFIC TAB */}
                <div className="p-2.5 border-t border-slate-800/80 bg-[#141924] rounded-b-2xl">
                  <button
                    onClick={() => {
                      setEditingLead(null);
                      setLeadFormData({
                        name: '',
                        phone: '',
                        tabId: tab.id,
                        dealValue: 700,
                        tags: ['Google Maps'],
                        lastMessage: ''
                      });
                      setIsLeadModalOpen(true);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar nesta aba</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* QUICK BUTTON TO ADD NEW TAB AT THE END OF FUNNEL */}
          <div className="w-80 shrink-0">
            <button
              onClick={() => {
                setEditingTab(null);
                setNewTabTitle('');
                setNewTabColor('#38bdf8');
                setIsNewTabModalOpen(true);
              }}
              className="w-full h-40 border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-amber-400 transition-all bg-[#121722]/50 hover:bg-[#121722]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-black">+ Adicionar Nova Aba / Coluna</span>
              <span className="text-[10px] text-slate-500">Crie etapas como "Proposta", "Cobrança", "Pós-Venda"</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: CREATE OR EDIT TAB / ABA */}
      {isNewTabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121722] border border-amber-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{editingTab ? 'Editar Aba do CRM' : 'Criar Nova Aba no CRM'}</span>
              </h3>
              <button onClick={() => setIsNewTabModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTab} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Nome / Título da Aba *</label>
                <input
                  type="text"
                  required
                  value={newTabTitle}
                  onChange={(e) => setNewTabTitle(e.target.value)}
                  placeholder="Ex: RETOMAR 1X, PROPOSTA ENVIADA, FECHAMENTO"
                  className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Cor de Destaque da Aba</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newTabColor}
                    onChange={(e) => setNewTabColor(e.target.value)}
                    className="w-10 h-10 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#ff5a35', '#64748b'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewTabColor(c)}
                        className={`w-6 h-6 rounded-full border ${newTabColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTabModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg"
                >
                  {editingTab ? 'Salvar Alterações' : 'Criar Aba'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE OR EDIT LEAD */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121722] border border-emerald-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>{editingLead ? 'Editar Contato / Lead' : 'Adicionar Novo Lead ao CRM'}</span>
              </h3>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase mb-1">Nome do Contato ou Empresa *</label>
                  <input
                    type="text"
                    required
                    value={leadFormData.name || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                    placeholder="Ex: Dr. Roberto / Marcelo Takano / Clínica Odonto"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    required
                    value={leadFormData.phone || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                    placeholder="Ex: (68) 98103-4408 ou 5568981034408"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Aba Inicial do CRM</label>
                  <select
                    value={leadFormData.tabId || tabs[0]?.id}
                    onChange={(e) => setLeadFormData({ ...leadFormData, tabId: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-slate-700 text-amber-300 font-bold rounded-xl p-3 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {tabs.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Valor da Oportunidade (R$)</label>
                  <input
                    type="number"
                    value={leadFormData.dealValue || 700}
                    onChange={(e) => setLeadFormData({ ...leadFormData, dealValue: Number(e.target.value) })}
                    placeholder="Ex: 700 ou 1400"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-emerald-400 font-mono font-bold rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Etiqueta / Nicho (Separado por vírgula)</label>
                  <input
                    type="text"
                    value={Array.isArray(leadFormData.tags) ? leadFormData.tags.join(', ') : ''}
                    onChange={(e) => setLeadFormData({ 
                      ...leadFormData, 
                      tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Ex: Google Maps, Odonto, Quente"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase mb-1">Última Mensagem / Resumo da Conversa</label>
                  <input
                    type="text"
                    value={leadFormData.lastMessage || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, lastMessage: e.target.value })}
                    placeholder="Ex: Aguardando retorno sobre o valor de R$ 700"
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Data Agendada de Retorno</label>
                  <input
                    type="date"
                    value={leadFormData.followUpDate || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, followUpDate: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">Horário do Retorno</label>
                  <input
                    type="time"
                    value={leadFormData.followUpTime || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, followUpTime: e.target.value })}
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold uppercase mb-1">Notas Internas & Diagnóstico</label>
                  <textarea
                    rows={2}
                    value={leadFormData.notes || ''}
                    onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                    placeholder="Anotações sobre a necessidade do cliente, concorrentes, etc."
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg"
                >
                  {editingLead ? 'Salvar Lead' : 'Cadastrar Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK SCRIPTS / MENSAGENS RÁPIDAS COM DISPARO */}
      {isQuickMsgModalOpen && selectedLeadForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121722] border border-amber-500/30 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Scripts de Disparo Rápido para {selectedLeadForMessage.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  WhatsApp: {selectedLeadForMessage.phone}
                </p>
              </div>
              <button onClick={() => setIsQuickMsgModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Escolha o script para abrir no WhatsApp com 1 clique:
              </span>

              {quickMessages.map((tmpl) => {
                const previewText = tmpl.text
                  .replace(/{nome}/g, selectedLeadForMessage.name)
                  .replace(/{valor}/g, selectedLeadForMessage.dealValue ? selectedLeadForMessage.dealValue.toLocaleString('pt-BR') : '700');

                return (
                  <div
                    key={tmpl.id}
                    className="p-3 bg-[#161c28] hover:bg-[#1a2334] border border-slate-800 hover:border-amber-500/50 rounded-xl space-y-2 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                        {tmpl.title}
                      </strong>
                      <button
                        onClick={() => handleSendQuickTemplate(selectedLeadForMessage, tmpl)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg flex items-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95"
                      >
                        <Send className="w-3 h-3" />
                        <span>Disparar</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0c1018] p-2.5 rounded-lg border border-slate-800/80">
                      "{previewText}"
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(selectedLeadForMessage)}
                className="text-slate-400 hover:text-white underline"
              >
                Abrir conversa em branco no WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setIsQuickMsgModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: WHATSAPP INTEGRATION SETTINGS */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121722] border border-sky-500/30 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" />
                <span>Configuração de Conexão WhatsApp</span>
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#0d121c] border border-emerald-500/30 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Integração Direta com WhatsApp Web Ativa</h4>
                  <p className="text-[11px] text-slate-400">
                    Ao clicar em qualquer contato, o sistema aciona o WhatsApp com número sanitizado e scripts preenchidos.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Seu Número Oficial do WhatsApp (Atendente / Consultor)
                </label>
                <input
                  type="text"
                  value={crmConfig.myWhatsAppNumber}
                  onChange={(e) => setCrmConfig({ ...crmConfig, myWhatsAppNumber: e.target.value })}
                  placeholder="Ex: 5568981034408"
                  className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-sky-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Usado para redirecionamentos e mensagens de atendimento do ClienteBox.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Código de País Padrão
                </label>
                <input
                  type="text"
                  value={crmConfig.defaultCountryCode}
                  onChange={(e) => setCrmConfig({ ...crmConfig, defaultCountryCode: e.target.value })}
                  placeholder="55"
                  className="w-full bg-[#0b0e14] border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="p-3 bg-[#151c2a] rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Compatibilidade com WaSeller Extension & APIs:
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  As abas criadas aqui sincronizam em tempo real no seu navegador. Você pode usar tanto a extensão do Chrome quanto abrir as conversas diretamente pelo botão verde de disparo.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsModalOpen(false);
                    showToast('Configurações do WhatsApp salvas!', 'success');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black shadow-lg"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: IMPORT LEADS FROM SYSTEM */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121722] border border-amber-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Importar Contatos para o CRM</span>
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Você pode importar automaticamente para a aba <strong>INBOX</strong> todos os contatos já cadastrados no sistema:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-[#161c28] border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-white block">Empresas do Painel de Gestão</strong>
                    <span className="text-[10px] text-slate-400">
                      {Object.keys(companies).length} empresas cadastradas
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="p-3 bg-[#161c28] border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-white block">Formulários Recebidos (Formspree)</strong>
                    <span className="text-[10px] text-slate-400">
                      Briefings preenchidos pelas empresas no site
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleImportCompaniesToCrm}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-lg"
                >
                  Importar Agora para INBOX
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
