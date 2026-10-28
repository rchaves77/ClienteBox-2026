import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, UserCheck, RefreshCw, CheckCircle2, Database, Sparkles, ShieldCheck, Mail, Save, AlertCircle } from 'lucide-react';

interface AccessConfigViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

interface GestorCred {
  id?: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  updatedAt?: string;
}

export const AccessConfigView: React.FC<AccessConfigViewProps> = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'online' | 'offline' | 'loading'>('loading');

  // Global Password Form State
  const [globalPassword, setGlobalPassword] = useState('');
  const [confirmGlobalPassword, setConfirmGlobalPassword] = useState('');
  const [isUpdatingGlobal, setIsUpdatingGlobal] = useState(false);
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState<string | null>(null);

  // Gestor Specific Password Form State
  const [gestoresList, setGestoresList] = useState<GestorCred[]>([]);
  const [selectedGestor, setSelectedGestor] = useState<GestorCred | null>(null);
  const [gestorPassword, setGestorPassword] = useState('');
  const [confirmGestorPassword, setConfirmGestorPassword] = useState('');
  const [isUpdatingGestor, setIsUpdatingGestor] = useState(false);

  // Load Firestore Settings
  const loadFirestoreAccessSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/access-settings');
      if (res.ok) {
        const data = await res.json();
        setFirestoreStatus('online');
        if (data.lastGlobalUpdate) {
          setLastGlobalUpdate(data.lastGlobalUpdate);
        }
        if (Array.isArray(data.gestores)) {
          setGestoresList(data.gestores);
        }
      } else {
        setFirestoreStatus('offline');
      }
    } catch (err) {
      console.error('Erro ao carregar configurações do Firestore:', err);
      setFirestoreStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirestoreAccessSettings();
  }, []);

  // Update Global Admin Password in Firestore
  const handleUpdateGlobalPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalPassword.trim()) {
      showToast('Digite a nova senha global.', 'error');
      return;
    }
    if (globalPassword !== confirmGlobalPassword) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }
    if (globalPassword.length < 4) {
      showToast('A senha deve ter no mínimo 4 caracteres.', 'error');
      return;
    }

    setIsUpdatingGlobal(true);
    try {
      const res = await fetch('/api/access-settings/global-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: globalPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar no Firestore.');
      }

      // Also persist locally for smooth offline/browser login
      localStorage.setItem('clientebox_custom_password', globalPassword);

      showToast('Senha Global atualizada com sucesso no Firestore!', 'success');
      setGlobalPassword('');
      setConfirmGlobalPassword('');
      loadFirestoreAccessSettings();
    } catch (err: any) {
      console.error('Erro ao salvar senha global:', err);
      showToast(err.message || 'Falha ao atualizar senha global.', 'error');
    } finally {
      setIsUpdatingGlobal(false);
    }
  };

  // Update Individual Gestor Password in Firestore
  const handleUpdateGestorPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGestor) {
      showToast('Selecione um gestor para alterar a senha.', 'error');
      return;
    }
    if (!gestorPassword.trim()) {
      showToast('Digite a nova senha.', 'error');
      return;
    }
    if (gestorPassword !== confirmGestorPassword) {
      showToast('A confirmação de senha não confere.', 'error');
      return;
    }

    setIsUpdatingGestor(true);
    try {
      const res = await fetch('/api/access-settings/gestor-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedGestor.email,
          newPassword: gestorPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar gestor no Firestore.');
      }

      showToast(`Senha de ${selectedGestor.nome} atualizada no Firestore!`, 'success');
      setGestorPassword('');
      setConfirmGestorPassword('');
      setSelectedGestor(null);
      loadFirestoreAccessSettings();
    } catch (err: any) {
      console.error('Erro ao salvar senha de gestor:', err);
      showToast(err.message || 'Falha ao atualizar senha.', 'error');
    } finally {
      setIsUpdatingGestor(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[90px] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Database className="w-3.5 h-3.5" />
            Armazenamento Seguro via Firebase Firestore
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Configurações de Acesso & Senhas
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Painel centralizado para gerenciamento global de credenciais, hashes criptográficos Bcrypt e controle de acessos no banco de dados Firestore.
          </p>
        </div>

        {/* FIRESTORE CONNECTION BADGE */}
        <div className="flex flex-col items-end gap-2 shrink-0 relative z-10">
          <div className="flex items-center gap-2 bg-[#182030] p-3 rounded-2xl border border-slate-700/80 shadow-inner">
            <div className={`w-3 h-3 rounded-full ${firestoreStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Conexão Firestore:</span>
              <span className="text-xs font-bold text-white font-mono">
                {firestoreStatus === 'online' ? 'Ativo (gen-lang-client)' : 'Offline / Verificando'}
              </span>
            </div>
          </div>

          <button
            onClick={loadFirestoreAccessSettings}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 bg-[#161d2a] px-3 py-1.5 rounded-xl border border-slate-800 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Sincronizar Firestore</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY ACCESS NOTICE */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#182030] to-amber-950/20 p-5 rounded-2xl border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/40 shrink-0">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <span>Acesso Emergencial Inicial Configurado</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase px-2 py-0.5 rounded border border-amber-500/30">
                Ativo no Firestore
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              O acesso emergencial foi temporariamente redefinido no banco Firestore. Utilize sua nova senha para entrar e, em seguida, altere a Senha Global abaixo.
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID FOR PASSWORD MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: SENHA GLOBAL ADMINISTRATIVA */}
        <div className="bg-[#111622] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Senha Global do Administrador
                  </h3>
                  <span className="text-xs text-slate-400 block">
                    Altera a chave mestre de acesso armazenada no Firestore
                  </span>
                </div>
              </div>
            </div>

            {lastGlobalUpdate && (
              <div className="text-[11px] text-slate-400 font-mono bg-[#161d2a] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Última Atualização no Firestore:</span>
                <strong className="text-amber-300">{new Date(lastGlobalUpdate).toLocaleString('pt-BR')}</strong>
              </div>
            )}

            <form onSubmit={handleUpdateGlobalPassword} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nova Senha Global:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={globalPassword}
                    onChange={(e) => setGlobalPassword(e.target.value)}
                    placeholder="Digite a nova senha mestre..."
                    required
                    className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirmar Nova Senha Global:
                </label>
                <input
                  type="password"
                  value={confirmGlobalPassword}
                  onChange={(e) => setConfirmGlobalPassword(e.target.value)}
                  placeholder="Repita a nova senha global..."
                  required
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingGlobal}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdatingGlobal ? 'Salvando no Firestore...' : 'Atualizar Senha Global no Firestore'}</span>
              </button>
            </form>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
            💡 As senhas são processadas com algoritmo Bcrypt diretamente no servidor antes da gravação no Firestore.
          </div>
        </div>

        {/* CARD 2: GERENCIAMENTO DE CREDENCIAIS POR GESTOR */}
        <div className="bg-[#111622] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Credenciais Individuais de Gestores
                  </h3>
                  <span className="text-xs text-slate-400 block">
                    Gerencie o acesso específico de cada conta cadastrada
                  </span>
                </div>
              </div>
            </div>

            {/* Select Gestor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Selecione o Gestor:
              </label>
              <select
                value={selectedGestor?.email || ''}
                onChange={(e) => {
                  const found = gestoresList.find((g) => g.email === e.target.value);
                  setSelectedGestor(found || null);
                }}
                className="w-full bg-[#182030] border border-slate-700 text-amber-300 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#ff5a35]"
              >
                <option value="">-- Escolha uma conta para alterar --</option>
                {gestoresList.map((g, idx) => (
                  <option key={idx} value={g.email}>
                    {g.nome} ({g.email}) - {g.role}
                  </option>
                ))}
              </select>
            </div>

            {selectedGestor ? (
              <form onSubmit={handleUpdateGestorPassword} className="space-y-4 bg-[#161d2a] p-4 rounded-2xl border border-slate-700/80">
                <div className="text-xs text-slate-300">
                  Alterando senha para: <strong className="text-white">{selectedGestor.nome}</strong> ({selectedGestor.email})
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Nova Senha Individual:
                  </label>
                  <input
                    type="password"
                    value={gestorPassword}
                    onChange={(e) => setGestorPassword(e.target.value)}
                    placeholder="Digite a nova senha para o gestor..."
                    required
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Confirmar Senha:
                  </label>
                  <input
                    type="password"
                    value={confirmGestorPassword}
                    onChange={(e) => setConfirmGestorPassword(e.target.value)}
                    placeholder="Repita a senha..."
                    required
                    className="w-full bg-[#0b0e14] border border-slate-700 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedGestor(null)}
                    className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white bg-[#111622] rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingGestor}
                    className="bg-[#ff5a35] hover:bg-[#ff481f] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md"
                  >
                    {isUpdatingGestor ? 'Salvando...' : 'Atualizar Credencial'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-[#161d2a] rounded-2xl border border-dashed border-slate-700 text-center space-y-2">
                <Mail className="w-6 h-6 text-slate-500 mx-auto" />
                <span className="text-xs text-slate-400 block font-medium">
                  Selecione um gestor na lista acima para redefinir sua senha individual no Firestore.
                </span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
            🔒 Todas as alterações de credencial sincronizam simultaneamente no Firestore e na camada SQL.
          </div>
        </div>

      </div>

      {/* TABLE OF REGISTERED MANAGERS */}
      <div className="bg-[#111622] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Contas de Gestores Cadastradas no Firestore
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {gestoresList.length} contas mapeadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-2.5 px-3">Gestor</th>
                <th className="py-2.5 px-3">E-mail</th>
                <th className="py-2.5 px-3">Função</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {gestoresList.map((g, idx) => (
                <tr key={idx} className="hover:bg-[#161d2a]">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{g.nome}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{g.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-purple-950/60 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {g.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedGestor(g)}
                      className="inline-flex items-center gap-1 bg-[#182030] hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all text-[11px]"
                    >
                      <Key className="w-3 h-3" />
                      <span>Alterar Senha</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION FOR COMPANY CLIENT ACCOUNTS & FIRST-LOGIN BACKUP ACCESS */}
      <ClientCompanyAccountsManager showToast={showToast} />
    </div>
  );
};

// Sub-component for Company Client User accounts
const ClientCompanyAccountsManager: React.FC<{ showToast: (msg: string, type?: 'success' | 'info' | 'error') => void }> = ({ showToast }) => {
  const [clientEmail, setClientEmail] = useState('');
  const [companyId, setCompanyId] = useState('instituto-serclin');
  const [companyName, setCompanyName] = useState('Instituto SerClin');
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClients = async () => {
    try {
      const res = await fetch('/api/client-users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.clientUsers)) {
          setClientsList(data.clientUsers);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddClientUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail.trim()) {
      showToast('Digite o e-mail da empresa cliente.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/client-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clientEmail.trim().toLowerCase(),
          companyId,
          companyName
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao cadastrar empresa cliente.');
      }

      showToast(`Acesso criado para ${clientEmail}! No primeiro acesso, o cliente criará sua própria senha.`, 'success');
      setClientEmail('');
      loadClients();
    } catch (err: any) {
      showToast(err.message || 'Erro ao cadastrar cliente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetClientPassword = async (email: string) => {
    try {
      const res = await fetch('/api/client-users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        showToast(`Senha de ${email} redefinida! O cliente criará uma nova senha no próximo acesso.`, 'success');
        loadClients();
      }
    } catch (e) {
      showToast('Erro ao redefinir senha do cliente.', 'error');
    }
  };

  return (
    <div className="bg-[#111622] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-amber-400" />
          Acesso Exclusivo para Clientes (Backup de Relatórios & Primeiro Acesso)
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Cadastre o e-mail da empresa para dar acesso direto ao seu relatório. No primeiro login, eles definem a própria senha e você pode redefini-la a qualquer momento em 1 clique.
        </p>
      </div>

      <form onSubmit={handleAddClientUser} className="bg-[#161d2a] p-4 rounded-2xl border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              E-mail da Empresa Cliente:
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="ex: contato@serclin.com.br"
              required
              className="w-full bg-[#0b0e14] border border-slate-700 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Empresa Associada:
            </label>
            <select
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setCompanyName(e.target.options[e.target.selectedIndex].text);
              }}
              className="w-full bg-[#0b0e14] border border-slate-700 text-amber-300 font-bold text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
            >
              <option value="instituto-serclin">Instituto SerClin</option>
              <option value="jc-fisioterapia">JC Fisioterapia</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? 'Cadastrando...' : '+ Cadastrar Acesso do Cliente'}
            </button>
          </div>
        </div>
      </form>

      {/* CLIENT ACCOUNTS LIST */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
              <th className="py-2.5 px-3">Empresa</th>
              <th className="py-2.5 px-3">E-mail Cadastrado</th>
              <th className="py-2.5 px-3">Status do Acesso</th>
              <th className="py-2.5 px-3 text-right">Ação de Segurança</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {clientsList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-500 text-xs italic">
                  Nenhum e-mail de cliente cadastrado ainda. Utilize o formulário acima para criar o primeiro acesso de backup.
                </td>
              </tr>
            ) : (
              clientsList.map((client, idx) => (
                <tr key={idx} className="hover:bg-[#161d2a]">
                  <td className="py-2.5 px-3 font-bold text-white">
                    {client.companyName || client.companyId}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-300">
                    {client.email}
                  </td>
                  <td className="py-2.5 px-3">
                    {client.firstLoginRequired ? (
                      <span className="bg-amber-950/60 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        Aguardando Criação de Senha
                      </span>
                    ) : (
                      <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        Senha Definida (Ativo)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleResetClientPassword(client.email)}
                      className="inline-flex items-center gap-1 bg-[#182030] hover:bg-rose-500 hover:text-white text-rose-300 font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all text-[11px]"
                      title="Forçar o cliente a criar uma nova senha no próximo acesso"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resetar Senha</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
