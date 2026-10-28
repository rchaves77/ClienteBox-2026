import React, { useState } from 'react';
import { LogoSvg } from './LogoSvg';
import { 
  Globe, 
  LayoutDashboard, 
  FileText, 
  Users, 
  KeyRound, 
  User, 
  Lock, 
  LogOut, 
  Building2, 
  ChevronRight, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { ActiveTab, Company } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenLoginModal: () => void;
  userEmail?: string;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  companies,
  selectedCompanyId,
  onSelectCompany,
  isAuthenticated,
  onLogout,
  onOpenLoginModal,
  userEmail = 'romulochaves77@gmail.com',
  userName = 'Rômulo Chaves'
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const navItems = [
    {
      id: 'site' as ActiveTab,
      label: 'Site & Apresentação Executiva',
      shortLabel: 'Site',
      icon: Globe,
      description: 'Visão pública do cliente e diagnósticos',
      requiresAuth: false
    },
    {
      id: 'admin' as ActiveTab,
      label: 'Painel de Gestão & SEO',
      shortLabel: 'Gestão',
      icon: LayoutDashboard,
      description: 'Lançamento de métricas e IA Gemini',
      requiresAuth: true
    },
    {
      id: 'report' as ActiveTab,
      label: 'Relatório Executivo PDF',
      shortLabel: 'Relatório',
      icon: FileText,
      description: 'Impressão e auditoria para o cliente',
      requiresAuth: true
    },
    {
      id: 'prospecting' as ActiveTab,
      label: 'Prospecção & Propostas',
      shortLabel: 'Propostas',
      icon: Users,
      description: 'Propostas comerciais e scripts',
      requiresAuth: true
    },
    {
      id: 'access_config' as ActiveTab,
      label: 'Configurações de Acesso',
      shortLabel: 'Acessos',
      icon: KeyRound,
      description: 'Firestore & Senhas dos Clientes',
      requiresAuth: true
    },
    {
      id: 'my_profile' as ActiveTab,
      label: 'Meu Perfil & Segurança',
      shortLabel: 'Perfil',
      icon: User,
      description: 'Sua conta e alteração de senha',
      requiresAuth: true
    }
  ];

  return (
    <>
      {/* MOBILE TRIGGER BUTTON (Floating Top-Left on small screens) */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 bg-[#111622] hover:bg-[#182030] text-amber-400 rounded-xl border border-slate-700 shadow-2xl transition-all"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* BACKDROP FOR MOBILE */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* VERTICAL LEFT SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0d111a] border-r border-slate-800/80 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 font-sans ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOP BRAND HEADER */}
        <div className="p-5 border-b border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoSvg size="md" showText={true} />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              v4.2 SQL
            </span>
          </div>

          {/* COMPANY SELECTOR DROPDOWN */}
          {companies.length > 0 && (
            <div className="bg-[#141a26] p-2.5 rounded-2xl border border-slate-700/60 shadow-inner space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                Empresa Selecionada:
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => {
                  onSelectCompany(e.target.value);
                  setMobileOpen(false);
                }}
                className="w-full bg-[#0b0e14] border border-slate-700/80 text-amber-300 font-extrabold text-xs px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-amber-400 transition-all cursor-pointer truncate"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* MIDDLE VERTICAL NAVIGATION STACK */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="text-[10px] uppercase font-bold text-slate-500 px-3 tracking-widest mb-1">
            Navegação do Sistema
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.requiresAuth && !isAuthenticated;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isLocked) {
                    onOpenLoginModal();
                  } else {
                    setActiveTab(item.id);
                  }
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff5a35] to-orange-600 text-white shadow-lg shadow-[#ff5a35]/20 font-bold'
                    : 'text-slate-300 hover:bg-[#161d2a] hover:text-white border border-transparent hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#182030] text-slate-400 group-hover:text-amber-400 group-hover:bg-[#202b40]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 truncate">
                    <span className="text-xs font-semibold block truncate leading-tight">
                      {item.label}
                    </span>
                    <span className={`text-[10px] block truncate ${isActive ? 'text-amber-100' : 'text-slate-500'}`}>
                      {item.description}
                    </span>
                  </div>
                </div>

                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 transition-transform ${isActive ? 'translate-x-1 text-white' : 'text-slate-600 group-hover:text-slate-300'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM USER PROFILE & AUTH CARD */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0d14]">
          {isAuthenticated ? (
            <div className="bg-[#141a26] p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-md">
                  {userName.charAt(0)}
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-xs font-bold text-white block truncate leading-none">
                    {userName}
                  </span>
                  <span className="text-[10px] text-amber-400/90 font-mono block truncate mt-0.5">
                    {userEmail}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors shrink-0"
                title="Sair do Sistema"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="w-full flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-amber-300 font-bold text-xs py-3 px-4 rounded-2xl border border-amber-500/30 transition-all shadow-lg active:scale-95"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Entrar na Área Restrita</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
