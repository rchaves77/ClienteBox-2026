import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import LandingPage2026 from './LandingPage2026';
import { InstitutionalView } from './components/InstitutionalView';
import { PortfolioView } from './components/PortfolioView';
import { ServicesView } from './components/ServicesView';
import { AdminView } from './components/AdminView';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { ProspectingView } from './components/ProspectingView';
import { LoginRestrictedView } from './components/LoginRestrictedView';
import { PublicOnboardingForm } from './components/PublicOnboardingForm';
import { OnboardingSubmissionsViewer } from './components/OnboardingSubmissionsViewer';
import { WhatsAppCrmView } from './components/WhatsAppCrmView';
import { PrivateSidebar } from './components/PrivateSidebar';
import { Toast } from './components/Toast';
import { AppState, Company, ActiveTab, ToastMessage } from './types';
import { defaultState, STORAGE_KEY } from './data/defaultData';

const AUTH_KEY = 'clientebox_auth_session';
const THEME_KEY = 'clientebox_theme_preference';
const FONTSIZE_PERCENT_KEY = 'clientebox_fontsize_percent';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('site');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);

  // Theme state: dark or light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Font size scale percentage state (e.g. 90, 100, 115, 130, 145)
  const [fontSizePercent, setFontSizePercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(FONTSIZE_PERCENT_KEY);
      return saved ? Number(saved) : 100;
    } catch {
      return 100;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.companies) {
          delete parsed.companies['dra-cibele-cristina'];
          delete parsed.companies['clientebox'];
          if (!parsed.companies[parsed.selectedCompanyId]) {
            parsed.selectedCompanyId = Object.keys(parsed.companies)[0] || 'jc-fisioterapia';
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Falha ao ler localStorage, usando estado padrão:', e);
    }
    return defaultState;
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Synchronize HTML document element fontSize whenever fontSizePercent changes
  useEffect(() => {
    try {
      document.documentElement.style.fontSize = `${fontSizePercent}%`;
      localStorage.setItem(FONTSIZE_PERCENT_KEY, String(fontSizePercent));
    } catch (e) {
      console.error('Erro ao aplicar tamanho de fonte no DOM:', e);
    }
  }, [fontSizePercent]);

  // Synchronize HTML class for theme-light
  useEffect(() => {
    try {
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('Erro ao sincronizar tema no DOM:', e);
    }
  }, [theme]);

  // Toggle Theme handler
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Modo ${nextTheme === 'light' ? 'Claro' : 'Escuro'} ativado.`, 'info');
  };

  // Increase Font Size handler (A+)
  const handleIncreaseFontSize = () => {
    setFontSizePercent((prev) => {
      const next = prev >= 150 ? 150 : prev + 15;
      showToast(`Tamanho das letras aumentado para ${next}%`, 'info');
      return next;
    });
  };

  // Decrease Font Size handler (A-)
  const handleDecreaseFontSize = () => {
    setFontSizePercent((prev) => {
      const next = prev <= 85 ? 85 : prev - 15;
      showToast(`Tamanho das letras ajustado para ${next}%`, 'info');
      return next;
    });
  };

  // Persist state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Erro ao salvar no storage:', e);
    }
  }, [appState]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } catch (e) {
      console.error('Erro ao salvar sessão auth:', e);
    }
    setActiveTab('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error('Erro ao remover sessão auth:', e);
    }
    setActiveTab('site');
    showToast('Sessão encerrada. Você está na página pública.', 'info');
  };

  const showToast = (title: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: String(Date.now()),
      title,
      type
    });
  };

  const handleUpdateCompany = async (updatedCompany: Company) => {
    setAppState((prev) => ({
      ...prev,
      companies: {
        ...prev.companies,
        [updatedCompany.id]: updatedCompany
      }
    }));

    try {
      await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCompany)
      });
    } catch (e) {
      console.error('Erro ao sincronizar atualização no Cloud SQL:', e);
    }
  };

  const handleAddCompany = async (newCompany: Company) => {
    setAppState((prev) => ({
      ...prev,
      selectedCompanyId: newCompany.id,
      companies: {
        ...prev.companies,
        [newCompany.id]: newCompany
      }
    }));

    try {
      await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
      showToast(`Empresa "${newCompany.nome}" cadastrada com sucesso!`, 'success');
    } catch (e) {
      console.error('Erro ao inserir empresa:', e);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    setAppState((prev) => {
      const remainingCompanies = { ...prev.companies };
      delete remainingCompanies[id];
      const remainingKeys = Object.keys(remainingCompanies);
      const nextSelected = remainingKeys.length > 0 ? remainingKeys[0] : '';

      return {
        selectedCompanyId: nextSelected,
        companies: remainingCompanies
      };
    });

    try {
      await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      showToast('Empresa removida do banco de dados.', 'info');
    } catch (e) {
      console.error('Erro ao excluir empresa:', e);
    }
  };

  const handleSelectCompany = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      selectedCompanyId: id
    }));
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `clientebox_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON exportado com sucesso!', 'success');
  };

  const handleImportJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.companies && parsed.selectedCompanyId) {
        setAppState(parsed);
        showToast('Dados de empresas importados com sucesso!', 'success');
      } else {
        showToast('Formato JSON de backup inválido.', 'error');
      }
    } catch (e) {
      showToast('Erro ao ler arquivo JSON.', 'error');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const selectedCompany = appState.companies[appState.selectedCompanyId] || Object.values(appState.companies)[0];

  // Check if viewing private authenticated tab
  const isPrivateArea = isAuthenticated && (activeTab === 'admin' || activeTab === 'report' || activeTab === 'prospecting' || activeTab === 'onboarding' || activeTab === 'crm');

  const themeContainerClass = theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-[#0b0e14] text-slate-100';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all ${themeContainerClass}`}>
      {/* TOP HEADER (oculto na LandingPage2026 pois ela possui o cabeçalho espacial integrado) */}
      {activeTab !== 'site' && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          companies={appState.companies}
          selectedCompanyId={appState.selectedCompanyId}
          setSelectedCompanyId={handleSelectCompany}
          onPrintReport={handlePrintReport}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          fontSizePercent={fontSizePercent}
          onIncreaseFontSize={handleIncreaseFontSize}
          onDecreaseFontSize={handleDecreaseFontSize}
          onOpenBriefingModal={() => setIsBriefingModalOpen(true)}
        />
      )}

      {/* PRIVATE AREA WITH LEFT SIDEBAR NAVIGATION */}
      {isPrivateArea ? (
        <div className="flex-1 flex">
          <PrivateSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            companies={appState.companies}
            selectedCompanyId={appState.selectedCompanyId}
            setSelectedCompanyId={handleSelectCompany}
            onPrintReport={handlePrintReport}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
            {activeTab === 'admin' && (
              <AdminView
                appState={appState}
                onUpdateCompany={handleUpdateCompany}
                onAddCompany={handleAddCompany}
                onDeleteCompany={handleDeleteCompany}
                onSelectCompany={handleSelectCompany}
                onViewReport={() => setActiveTab('report')}
                onExportJson={handleExportJson}
                onImportJson={handleImportJson}
                showToast={showToast}
              />
            )}

            {activeTab === 'report' && selectedCompany && (
              <ExecutiveReportView
                company={selectedCompany}
                showToast={showToast}
                onPrintReport={handlePrintReport}
                onUpdateCompany={handleUpdateCompany}
              />
            )}

            {activeTab === 'crm' && (
              <WhatsAppCrmView
                showToast={showToast}
                companies={appState.companies}
              />
            )}

            {activeTab === 'prospecting' && (
              <ProspectingView
                appState={appState}
                showToast={showToast}
                onAddCompany={handleAddCompany}
                onUpdateCompany={handleUpdateCompany}
                onSelectCompany={handleSelectCompany}
                onPrintReport={handlePrintReport}
              />
            )}

            {activeTab === 'onboarding' && (
              <div className="p-4 sm:p-6">
                <OnboardingSubmissionsViewer
                  showToast={showToast}
                  onAddCompany={handleAddCompany}
                />
              </div>
            )}
          </main>
        </div>
      ) : (
        /* PUBLIC SITE & ONBOARDING / LOGIN */
        <main className="flex-1">
          {activeTab === 'site' && (
            <LandingPage2026
              onOpenAdmin={() => setActiveTab('admin')}
              showToast={showToast}
              externalBriefingOpen={isBriefingModalOpen}
              setExternalBriefingOpen={setIsBriefingModalOpen}
            />
          )}

          {(activeTab === 'portfolio' || activeTab === 'services') && (
            <ServicesView
              onGoToDiagnostic={() => {
                setActiveTab('site');
                setTimeout(() => {
                  const el = document.getElementById('diagnostico') || document.getElementById('diagnostico-cliente');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onGoToOnboarding={() => setActiveTab('onboarding')}
            />
          )}

          {activeTab === 'onboarding' && (
            <PublicOnboardingForm
              showToast={showToast}
              onReturnToHome={() => setActiveTab('site')}
            />
          )}

          {!isAuthenticated && (activeTab === 'admin' || activeTab === 'report' || activeTab === 'prospecting' || activeTab === 'crm') && (
            <LoginRestrictedView
              onLoginSuccess={handleLoginSuccess}
              onReturnToPublicSite={() => setActiveTab('site')}
              showToast={showToast}
            />
          )}
        </main>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
