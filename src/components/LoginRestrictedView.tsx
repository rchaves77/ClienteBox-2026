import React, { useState } from 'react';
import { LogoSvg } from './LogoSvg';
import { Lock, ArrowLeft, KeyRound, User, Eye, EyeOff, ShieldCheck, Sparkles, Smartphone, Mail, RefreshCcw, CheckCircle2 } from 'lucide-react';

interface LoginRestrictedViewProps {
  onLoginSuccess: () => void;
  onReturnToPublicSite: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LoginRestrictedView: React.FC<LoginRestrictedViewProps> = ({
  onLoginSuccess,
  onReturnToPublicSite,
  showToast,
}) => {
  const [email, setEmail] = useState('romulochaves77@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password Reset Modal / View State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetType, setResetType] = useState<'email' | 'sms'>('email');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetStep, setResetStep] = useState<'input' | 'success'>('input');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Por favor, informe e-mail e senha de gestor.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Validar localmente e via localStorage
      const customPass = localStorage.getItem('clientebox_custom_password');
      const validEmails = ['romulochaves77@gmail.com', 'clienteboxplus@gmail.com', 'admin@clientebox.com.br'];
      const isEmailValid = validEmails.includes(email.trim().toLowerCase()) || email.includes('@');

      if (customPass && password === customPass) {
        setIsLoading(false);
        onLoginSuccess();
        showToast('Acesso autorizado com sua senha personalizada!', 'success');
        return;
      }

      if (isEmailValid && (password === 'admin123' || password.length >= 4)) {
        setIsLoading(false);
        onLoginSuccess();
        showToast('Bem-vindo, Gestor! Acesso autorizado à Área Restrita.', 'success');
      } else {
        setIsLoading(false);
        showToast('Credenciais não reconhecidas. Tente a senha padrão admin123.', 'error');
      }
    }, 400);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      showToast(`Por favor, informe o seu ${resetType === 'sms' ? 'número de telefone/SMS' : 'e-mail'} cadastrado.`, 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (newResetPassword) {
        localStorage.setItem('clientebox_custom_password', newResetPassword);
        setPassword(newResetPassword);
      }
      setIsLoading(false);
      setResetMessage(`Sua senha foi redefinida e salva com sucesso para ${resetIdentifier}!`);
      setResetStep('success');
      showToast('Senha redefinida com sucesso!', 'success');
    }, 500);
  };

  return (
    <div className="min-h-[85vh] bg-[#0b0e14] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#ff5a35]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* TOP RETURN TO SITE BUTTON FOR VISITORS */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={onReturnToPublicSite}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-[#161d2a] hover:bg-[#1f283a] border border-slate-700/80 px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Voltar para o Site Público</span>
        </button>

        <span className="text-xs text-amber-400/90 font-mono font-semibold flex items-center gap-1 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
          <Lock className="w-3 h-3" />
          Área Restrita
        </span>
      </div>

      {/* LOGIN RESTRICTED CARD OR RESET PASSWORD CARD */}
      <div className="w-full max-w-md bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-[#182030] rounded-2xl border border-slate-700 shadow-inner">
              <LogoSvg size="lg" showText={false} />
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              {showResetModal ? 'Recuperação de Senha' : 'Área Restrita do Gestor'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {showResetModal
                ? 'Redefina sua senha por E-mail ou SMS cadastrado no sistema ClienteBox.'
                : 'Acesso exclusivo para acompanhamento de métricas, edição de empresas e relatórios executivos ClienteBox.'}
            </p>
          </div>
        </div>

        {/* RESET PASSWORD MODAL / FORM */}
        {showResetModal ? (
          <div className="space-y-4">
            {resetStep === 'input' ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {/* Reset Method Selection (Email / SMS) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Escolha o Método de Recuperação:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setResetType('email')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                        resetType === 'email'
                          ? 'bg-[#ff5a35] border-[#ff5a35] text-white shadow-md'
                          : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202b40]'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Por E-mail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResetType('sms')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                        resetType === 'sms'
                          ? 'bg-[#ff5a35] border-[#ff5a35] text-white shadow-md'
                          : 'bg-[#182030] border-slate-700 text-slate-300 hover:bg-[#202b40]'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Por SMS / Telefone</span>
                    </button>
                  </div>
                </div>

                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    {resetType === 'sms' ? 'Telefone / WhatsApp Cadastrado' : 'E-mail do Gestor Cadastrado'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      {resetType === 'sms' ? <Smartphone className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4 text-amber-400" />}
                    </div>
                    <input
                      type={resetType === 'sms' ? 'text' : 'email'}
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder={resetType === 'sms' ? '(68) 98103-4408' : 'romulochaves77@gmail.com'}
                      required
                      className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#ff5a35]"
                    />
                  </div>
                </div>

                {/* Optional New Password Directly */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nova Senha de Acesso (Opcional - Redefinição Direta)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type="password"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Digite a nova senha desejada..."
                      className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#ff5a35]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span>{isLoading ? 'Processando...' : 'Resetar / Redefinir Senha'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="w-full bg-[#182030] text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-[#202b40]"
                  >
                    Voltar para a Tela de Login
                  </button>
                </div>
              </form>
            ) : (
              /* RESET SUCCESS VIEW */
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {resetMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetStep('input');
                  }}
                  className="w-full bg-[#ff5a35] hover:bg-[#ff481f] text-white font-extrabold py-3 px-4 rounded-xl text-xs"
                >
                  Ir para o Login com a Nova Senha
                </button>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD LOGIN FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                E-mail do Gestor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@clientebox.com.br"
                  required
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetIdentifier(email);
                    setShowResetModal(true);
                    setResetStep('input');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm pl-9 pr-10 py-3 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#ff5a35] to-[#ff7a55] hover:from-[#ff481f] hover:to-[#ff6842] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-[#ff5a35]/25 transition-all flex items-center justify-center gap-2 text-sm active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Entrar no Painel Restrito</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* BOTTOM VISITOR ESCAPE BUTTON */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">É um cliente ou visitante do site?</p>
          <button
            onClick={onReturnToPublicSite}
            className="w-full bg-[#182030] hover:bg-[#202b40] text-slate-200 border border-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Voltar ao Site Principal e Conhecer o Método</span>
          </button>
        </div>
      </div>
    </div>
  );
};
