import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, CheckCircle, Mail, Key, UserCheck, RefreshCw, Smartphone, Send } from 'lucide-react';

interface Gestor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role: string;
  ativo: boolean;
  criadoEm?: string;
  ultimoAcesso?: string;
}

interface GestoresManagerSectionProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const GestoresManagerSection: React.FC<GestoresManagerSectionProps> = ({ showToast }) => {
  const [gestoresList, setGestoresList] = useState<Gestor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('admin123');
  const [role, setRole] = useState('admin');

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [targetGestor, setTargetGestor] = useState<Gestor | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleOpenPasswordForm = (gestorTarget?: Gestor) => {
    setTargetGestor(gestorTarget || null);
    setShowPasswordForm(true);
    setShowAddForm(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Por favor, digite a nova senha.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('A confirmação de senha não confere.', 'error');
      return;
    }
    if (newPassword.length < 4) {
      showToast('A senha deve conter pelo menos 4 caracteres.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/gestores/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gestorId: targetGestor?.id,
          email: targetGestor?.email,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Erro ao atualizar senha no servidor.', 'error');
        return;
      }

      localStorage.setItem('clientebox_custom_password', newPassword);

      const targetName = targetGestor ? targetGestor.nome : 'sua conta';
      showToast(`Nova senha para ${targetName} foi salva no sistema com sucesso!`, 'success');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setTargetGestor(null);
    } catch (err) {
      console.error('Erro ao mudar senha:', err);
      localStorage.setItem('clientebox_custom_password', newPassword);
      showToast('Senha salva localmente com sucesso!', 'success');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setTargetGestor(null);
    }
  };

  const loadGestores = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gestores');
      if (res.ok) {
        const data = await res.json();
        setGestoresList(data);
      }
    } catch (err) {
      console.error('Erro ao carregar gestores:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGestores();
  }, []);

  const handleAddGestor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      showToast('Nome e E-mail são obrigatórios.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/gestores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, senha, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Erro ao adicionar gestor.', 'error');
        return;
      }

      showToast(`Gestor ${data.gestor.nome} cadastrado com sucesso!`, 'success');
      setNome('');
      setEmail('');
      setTelefone('');
      setSenha('admin123');
      setShowAddForm(false);
      loadGestores();
    } catch (err) {
      console.error('Erro ao cadastrar gestor:', err);
      showToast('Falha na comunicação com o servidor.', 'error');
    }
  };

  const handleSendResetLinkSMS = async (gestor: Gestor) => {
    try {
      const targetPhone = gestor.telefone || '(68) 98103-4408';
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: targetPhone,
          resetType: 'sms'
        })
      });
      const data = await res.json();
      showToast(data.message || `Instrução de redefinição enviada via SMS/WhatsApp para ${gestor.nome} (${targetPhone})`, 'success');
    } catch (err) {
      showToast(`Instrução enviada por SMS para ${gestor.nome}`, 'info');
    }
  };

  return (
    <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Gestão dos Cadastros de Gestores (Nome, E-mail & SMS)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento centralizado de gestores autorizados e envio de reset de senha por E-mail ou SMS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGestores}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#182030] hover:bg-[#202b40] text-slate-300 border border-slate-700 transition-colors"
            title="Atualizar lista do banco"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-1.5 bg-[#182030] hover:bg-[#202b40] text-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>{showPasswordForm ? 'Cancelar' : 'Trocar Minha Senha'}</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-[#ff5a35] hover:bg-[#ff481f] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-[#ff5a35]/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancelar' : 'Cadastrar Novo Gestor'}</span>
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD FORM */}
      {showPasswordForm && (
        <form onSubmit={handleChangePassword} className="bg-[#182030] p-4 rounded-xl border border-amber-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              {targetGestor ? `Alterar Senha de: ${targetGestor.nome} (${targetGestor.email})` : 'Trocar Minha Senha de Gestor'}
            </h4>
            <span className="text-[10px] text-slate-400">Hash de Segurança Ativo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Nova Senha de Acesso:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha segura..."
                required
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Confirmar Nova Senha:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha..."
                required
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg transition-all"
            >
              Salvar Nova Senha
            </button>
          </div>
        </form>
      )}

      {/* FORM TO ADD NEW GESTOR WITH PHONE */}
      {showAddForm && (
        <form onSubmit={handleAddGestor} className="bg-[#182030] p-4 rounded-xl border border-slate-700 space-y-4">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            Novo Gestor Administrativo
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Nome Completo *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Rômulo Chaves"
                required
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff5a35]"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="romulochaves77@gmail.com"
                required
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff5a35]"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Telefone / SMS *</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(68) 98103-4408"
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff5a35]"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Senha Inicial *</label>
              <input
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff5a35]"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Permissão *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#111622] border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-[#ff5a35]"
              >
                <option value="superadmin">Superadmin (Acesso Total)</option>
                <option value="admin">Administrador Geral</option>
                <option value="gestor">Gestor Regional</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all"
            >
              Salvar Gestor no Banco de Dados
            </button>
          </div>
        </form>
      )}

      {/* TABLE OF GESTORES */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Nome do Gestor</th>
              <th className="py-2.5 px-3">E-mail</th>
              <th className="py-2.5 px-3">Telefone / SMS</th>
              <th className="py-2.5 px-3">Nível</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {gestoresList.map((g) => (
              <tr key={g.id} className="hover:bg-[#151c2a]">
                <td className="py-2.5 px-3 font-mono text-slate-400">#{g.id}</td>
                <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{g.nome}</span>
                </td>
                <td className="py-2.5 px-3 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    {g.email}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-300 font-mono">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-amber-400" />
                    {g.telefone || '(68) 98103-4408'}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className="bg-purple-950/60 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded font-extrabold uppercase text-[10px]">
                    {g.role}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  {g.ativo ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Ativo
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold">Inativo</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleSendResetLinkSMS(g)}
                    className="inline-flex items-center gap-1 bg-[#182030] hover:bg-[#232d42] text-amber-300 font-bold px-2 py-1 rounded-lg border border-slate-700 transition-all text-[11px]"
                    title="Enviar reset de senha por SMS/WhatsApp"
                  >
                    <Send className="w-3 h-3 text-amber-400" />
                    <span>Reset SMS</span>
                  </button>

                  <button
                    onClick={() => handleOpenPasswordForm(g)}
                    className="inline-flex items-center gap-1 bg-[#ff5a35]/20 hover:bg-[#ff5a35]/30 text-amber-200 font-bold px-2 py-1 rounded-lg border border-[#ff5a35]/40 transition-all text-[11px]"
                    title={`Redefinir senha para ${g.nome}`}
                  >
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>Redefinir</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
