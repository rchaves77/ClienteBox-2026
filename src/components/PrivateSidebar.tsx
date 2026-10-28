import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Shield, 
  Globe, 
  LogOut, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  X, 
  ClipboardList,
  MessageSquare
} from 'lucide-react';
import { ActiveTab, Company } from '../types';
import { LogoSvg } from './LogoSvg';

interface PrivateSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  companies: Record<string, Company>;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  onPrintReport: () => void;
  onLogout: () => void;
  isOpen: boolean; // Mobile overlay open state
  setIsOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export const PrivateSidebar: React.FC<PrivateSidebarProps> = ({
  activeTab,
  setActiveTab,
  companies,
  selectedCompanyId,
  setSelectedCompanyId,
  onPrintReport,
  onLogout,
  isOpen,
  setIsOpen,
  isCollapsed: externalIsCollapsed,
  setIsCollapsed: externalSetIsCollapsed
}) => {
  // Default to compact icons mode on desktop (isCollapsed = true) so menu expands on hover
  const [internalIsCollapsed, setInternalIsCollapsed] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed;

  // On desktop, the sidebar is visually expanded if not collapsed OR if hovered
  const isExpandedDesktop = !isCollapsed || isHovered;

  const activeCompany = companies[selectedCompanyId] || Object.values(companies)[0];

  const navItems = [
    {
      id: 'admin' as ActiveTab,
      label: 'Painel de Gestão',
      subtitle: 'Métricas, Saúde SEO & Edição',
      icon: LayoutDashboard,
      color: 'text-amber-400'
    },
    {
      id: 'crm' as ActiveTab,
      label: 'CRM WhatsApp',
      subtitle: 'Abas, Follow-up & WaSeller',
      icon: MessageSquare,
      color: 'text-emerald-400'
    },
    {
      id: 'report' as ActiveTab,
      label: 'Relatório Executivo A4',
      subtitle: 'PDF de 6 Páginas para Cliente',
      icon: FileText,
      color: 'text-sky-400'
    },
    {
      id: 'prospecting' as ActiveTab,
      label: 'Prospecção & Propostas',
      subtitle: 'Gerador com IA & Auditorias',
      icon: Sparkles,
      color: 'text-[#ff5a35]'
    },
    {
      id: 'onboarding' as ActiveTab,
      label: 'Fichas & Formulários',
      subtitle: 'Cadastros Recebidos dos Clientes',
      icon: ClipboardList,
      color: 'text-sky-400'
    }
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR PANEL (RESPONSIVE + COMPACT HOVER EXPANDABLE ON DESKTOP) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#0d1117] border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out print:hidden ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isExpandedDesktop ? 'lg:w-72 lg:shadow-2xl' : 'lg:w-20'}`}
      >
        {/* TOP BRAND HEADER */}
        <div className={`p-4 border-b border-slate-800 flex items-center ${isExpandedDesktop ? 'justify-between' : 'justify-center'}`}>
          {isExpandedDesktop ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('site');
                  setIsOpen(false);
                }}
                className="focus:outline-none"
              >
                <LogoSvg size="md" />
              </button>

              <div className="flex items-center gap-1">
                {/* Desktop Collapse Button */}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={isCollapsed ? "Fixar Menu Aberto" : "Recolher para Apenas Ícones"}
                >
                  <ChevronLeft className="w-5 h-5 text-amber-400" />
                </button>

                {/* Mobile Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Fechar Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            /* Compact Header (Icons Mode) */
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('site');
                  setIsOpen(false);
                }}
                className="focus:outline-none"
                title="ClienteBox - Ir para Início"
              >
                <LogoSvg size="sm" showText={false} />
              </button>

              <button
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all"
                title="Fixar Menu Completo"
              >
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>

        {/* SELECT ACTIVE MANAGED COMPANY */}
        <div className="p-3 border-b border-slate-800/80 bg-[#111622]">
          {isExpandedDesktop ? (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Empresa Ativa em Gestão</span>
              </label>

              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full bg-[#182030] border border-slate-700 text-xs text-amber-300 font-bold p-2.5 rounded-xl focus:outline-none focus:border-[#ff5a35] cursor-pointer truncate"
              >
                {Object.values(companies).map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111622] text-white">
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            /* Compact Company Icon Indicator with Tooltip */
            <div className="group relative flex justify-center py-1">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center cursor-pointer">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0d1117] border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                {activeCompany?.nome || 'Empresa Ativa'}
              </div>
            </div>
          )}
        </div>

        {/* PRIVATE NAVIGATION LIST */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isExpandedDesktop && (
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 block">
              Área de Gestão e Operação
            </span>
          )}

          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full rounded-2xl flex items-center transition-all ${
                    isExpandedDesktop ? 'p-3 text-left gap-3' : 'p-3 justify-center'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff5a35] to-[#ff7a55] text-white shadow-lg shadow-[#ff5a35]/25 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#161d2a]'
                  }`}
                  title={!isExpandedDesktop ? item.label : undefined}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-black/20 text-white' : 'bg-[#182030] ' + item.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>

                  {isExpandedDesktop && (
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-extrabold block truncate">{item.label}</span>
                      <span className={`text-[10px] block truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {item.subtitle}
                      </span>
                    </div>
                  )}
                </button>

                {/* Hover Tooltip in Compact Mode */}
                {!isExpandedDesktop && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0d1117] border border-slate-700 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                    <p className="font-extrabold text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* PDF EXPORT ACTION */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="group relative">
              <button
                onClick={() => {
                  setActiveTab('report');
                  setTimeout(onPrintReport, 150);
                }}
                className={`w-full flex items-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black p-3 rounded-2xl text-xs transition-all shadow-md active:scale-98 ${
                  isExpandedDesktop ? 'gap-2 justify-start' : 'justify-center'
                }`}
                title={!isExpandedDesktop ? "Exportar PDF Relatório A4" : undefined}
              >
                <Printer className="w-4 h-4 shrink-0" />
                {isExpandedDesktop && <span>Exportar PDF Relatório A4</span>}
              </button>

              {!isExpandedDesktop && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0d1117] border border-amber-500/50 px-3 py-1.5 rounded-xl text-xs font-extrabold text-amber-300 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                  Exportar PDF Relatório A4
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER PUBLIC RETURN & LOGOUT */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-[#090c12]">
          {/* Public Site Button */}
          <div className="group relative">
            <button
              onClick={() => {
                setActiveTab('site');
                setIsOpen(false);
              }}
              className={`w-full flex items-center p-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#141a26] hover:bg-[#1c2536] border border-slate-800 transition-all ${
                isExpandedDesktop ? 'justify-between' : 'justify-center'
              }`}
              title={!isExpandedDesktop ? "Ver Site Público" : undefined}
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400 shrink-0" />
                {isExpandedDesktop && <span>Ver Site Público</span>}
              </span>
              {isExpandedDesktop && <ChevronRight className="w-4 h-4 text-slate-500" />}
            </button>

            {!isExpandedDesktop && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0d1117] border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-sky-300 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                Ver Site Público
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="group relative">
            <button
              onClick={onLogout}
              className={`w-full flex items-center p-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 transition-all ${
                isExpandedDesktop ? 'justify-center gap-2' : 'justify-center'
              }`}
              title={!isExpandedDesktop ? "Sair da Área Restrita" : undefined}
            >
              <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
              {isExpandedDesktop && <span>Sair da Área Restrita</span>}
            </button>

            {!isExpandedDesktop && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#0d1117] border border-rose-800 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                Sair da Área Restrita
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
