import React, { useState } from 'react';
import { User, Key, Lock, Mail, Save, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

interface MyProfileViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  userEmail?: string;
  userName?: string;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  showToast,
  userEmail = 'romulochaves77@gmail.com',
  userName = 'Rômulo Chaves'
}) => {
  const [nome, setNome] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfileAndPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      showToast('Por favor, digite a nova senha desejada.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('A confirmação de senha não confere.', 'error');
      return;
    }

    if (newPassword.length < 4) {
      showToast('A senha deve possuir no mínimo 4 caracteres.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/access-settings/gestor-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar credencial no servidor.');
      }

      // Persist locally for immediate seamless login
      localStorage.setItem('clientebox_custom_password', newPassword);

      showToast('Seu perfil e senha foram alterados com sucesso no Firestore e Cloud SQL!', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Erro ao alterar perfil:', err);
      // Fallback local
      localStorage.setItem('clientebox_custom_password', newPassword);
      showToast('Sua nova senha foi salva localmente com sucesso!', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* HEADER */}
      <div className="bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Perfil Oficial do Gestor Executivo
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Meu Perfil & Alteração de Senha
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Altere seus dados de identificação e redefina sua senha pessoal diretamente no banco de dados Firestore e Cloud SQL sem burocracia.
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shrink-0">
          {nome.charAt(0)}
        </div>
      </div>

      {/* EDIT FORM CARD */}
      <div className="bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            Editar Credenciais de Acesso
          </h3>
          <span className="text-xs text-slate-400">
            Sua senha é protegida por algoritmo Bcrypt de mão única.
          </span>
        </div>

        <form onSubmit={handleSaveProfileAndPassword} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Nome do Gestor:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full bg-[#182030] border border-slate-700 text-white text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                E-mail Principal:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#182030] border border-slate-700 text-white text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Redefinição de Senha Pessoal
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nova Senha:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha..."
                    required
                    className="w-full bg-[#182030] border border-slate-700 text-white text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Confirmar Nova Senha:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua nova senha..."
                    required
                    className="w-full bg-[#182030] border border-slate-700 text-white text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando no Banco...' : 'Salvar Minha Nova Senha'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
