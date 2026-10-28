import React from 'react';
import { LogoSvg } from './LogoSvg';
import { 
  Globe, 
  Layers, 
  ClipboardList, 
  Lock, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  Building2,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { ActiveTab, Company } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  companies: Record<string, Company>;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  onPrintReport: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  fontSizePercent?: number;
  onIncreaseFontSize?: () => void;
  onDecreaseFontSize?: () => void;
  onOpenBriefingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  companies,
  selectedCompanyId,
  setSelectedCompanyId,
  isAuthenticated,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  theme = 'dark',
  onToggleTheme,
  fontSizePercent = 100,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onOpenBriefingModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#060911]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.08] print:hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* BRAND LOGO & BADGE */}
        <div className="flex items-center gap-3">
          {isAuthenticated && setIsSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#161d2a] hover:bg-slate-200 dark:hover:bg-[#1f283a] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              title="Abrir Menu de Gestão"
            >
              <Menu className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            </button>
          )}

          <button 
            onClick={() => setActiveTab('site')} 
            className="text-left focus:outline-none flex items-center gap-3 group shrink-0 cursor-pointer"
          >
            <img 
              src="/logo-clientebox.png" 
              alt="ClienteBox Logo Oficial" 
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
              Gestão &amp; Inteligência Local
            </span>
          </button>
        </div>

        {/* TOP NAVBAR COMPANY SELECTOR DROPDOWN (LOGGED IN ONLY) */}
        {isAuthenticated && companies && Object.keys(companies).length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#161b22] border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-sm">
            <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
            <span className="hidden lg:inline text-xs font-bold text-slate-700 dark:text-slate-300">Empresa:</span>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-transparent text-xs text-amber-600 dark:text-amber-300 font-black focus:outline-none cursor-pointer border-none py-0.5 pr-2 max-w-[170px] sm:max-w-[260px] truncate font-mono"
              title="Selecionar empresa ativa no sistema"
            >
              {Object.values(companies).map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-[#111622] text-slate-900 dark:text-slate-100 font-semibold">
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CLEAN PUBLIC NAVIGATION LINKS (#diagnostico, #metodo, #resultados, #investimento) */}
        {!isAuthenticated && activeTab === 'site' && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono">
            <a
              href="#diagnostico"
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Diagnóstico
            </a>
            <a
              href="#metodo"
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Método
            </a>
            <a
              href="#resultados"
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Resultados
            </a>
            <a
              href="#planos"
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Planos
            </a>
            <a
              href="#investimento"
              className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Investimento
            </a>
          </nav>
        )}

        {/* NOT AUTHENTICATED BUT ON OTHER TABS */}
        {!isAuthenticated && activeTab !== 'site' && (
          <nav className="hidden md:flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('site')}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              ← Voltar ao Início
            </button>
          </nav>
        )}

        {/* RIGHT SIDE ACCESSIBILITY CONTROLS & LOGIN */}
        <div className="flex items-center gap-2">
          
          {/* Theme Toggle Button (Claro / Escuro) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 bg-[#161b22] hover:bg-[#202838] text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 shadow-sm"
              title={`Alternar para tema ${theme === 'dark' ? 'Claro' : 'Escuro'}`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap font-sans font-bold">Tema Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap font-sans font-bold">Tema Escuro</span>
                </>
              )}
            </button>
          )}

          {/* Font Size Accessibility Controls (A- / A+) */}
          {onIncreaseFontSize && onDecreaseFontSize && (
            <div className="flex items-center gap-0.5 bg-[#161b22] p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={onDecreaseFontSize}
                className="px-2 py-1 rounded-lg bg-[#1e2638] hover:bg-[#283248] text-slate-300 font-extrabold hover:text-white transition-all active:scale-95"
                title="Diminuir tamanho das letras (A-)"
              >
                A-
              </button>
              <span className="px-1.5 font-mono text-[11px] font-extrabold text-amber-300">
                {fontSizePercent}%
              </span>
              <button
                onClick={onIncreaseFontSize}
                className="px-2 py-1 rounded-lg bg-[#1e2638] hover:bg-[#283248] text-emerald-400 font-extrabold hover:text-emerald-300 transition-all active:scale-95"
                title="Aumentar tamanho das letras (A+)"
              >
                A+
              </button>
            </div>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('crm')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'crm'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-black'
                    : 'bg-[#182030] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}
                title="Acessar CRM WhatsApp & Funil"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CRM WhatsApp</span>
              </button>

              <span className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                <ShieldCheck className="w-4 h-4" />
                <span>Gestor</span>
              </span>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 bg-[#182030] hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                title="Sair da Área Restrita"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenBriefingModal}
                className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                title="Abrir Formulário de Briefing Oficial"
              >
                <span>📋 Preencher Briefing</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-1.5 bg-[#182030] hover:bg-[#202b40] text-slate-200 border border-white/[0.1] px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                title="Acessar Área Restrita do Gestor"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Área Restrita / Login</span>
                <span className="md:hidden">Login</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
