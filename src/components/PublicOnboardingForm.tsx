import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  User, 
  Globe, 
  FileText,
  Camera,
  CheckCircle2,
  Award,
  ArrowRight,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface PublicOnboardingFormProps {
  showToast: (title: string, type?: 'success' | 'info' | 'error') => void;
  onReturnToHome?: () => void;
}

export interface BriefingFormData {
  nomeEmpresa: string;
  responsavelNomeCargo: string;
  telefoneWhatsapp: string;
  categoriaAtuacao: string;
  tipoAtendimento: 'Físico (Sede Própria)' | 'Atendimento em Domicílio / Área de Cobertura' | 'Ambos (Atendimento Físico e Domicílio)';
  enderecoPontoReferencia: string;
  horarioFuncionamento: string;
  siteInstagram: string;
  servicosProdutosVender: string;
  diferenciaisEmpresa: string;
}

const INITIAL_BRIEFING_DATA: BriefingFormData = {
  nomeEmpresa: '',
  responsavelNomeCargo: '',
  telefoneWhatsapp: '',
  categoriaAtuacao: '',
  tipoAtendimento: 'Ambos (Atendimento Físico e Domicílio)',
  enderecoPontoReferencia: '',
  horarioFuncionamento: 'Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 12:00',
  siteInstagram: '',
  servicosProdutosVender: '',
  diferenciaisEmpresa: ''
};

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mbglvwvr';

export const PublicOnboardingForm: React.FC<PublicOnboardingFormProps> = ({ showToast, onReturnToHome }) => {
  const [formData, setFormData] = useState<BriefingFormData>(INITIAL_BRIEFING_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleChange = (field: keyof BriefingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nomeEmpresa.trim() || 
      !formData.responsavelNomeCargo.trim() || 
      !formData.telefoneWhatsapp.trim() || 
      !formData.categoriaAtuacao.trim() || 
      !formData.servicosProdutosVender.trim()
    ) {
      showToast('Por favor, preencha todos os campos obrigatórios (*).', 'error');
      return;
    }

    setIsSubmitting(true);

    const submissionRecord = {
      id: `sub_${Date.now()}`,
      nomeEmpresa: formData.nomeEmpresa,
      responsavelNome: formData.responsavelNomeCargo,
      responsavelTelefone: formData.telefoneWhatsapp,
      niches: [formData.categoriaAtuacao],
      dadosCompletos: formData,
      criadoEm: new Date().toISOString()
    };

    // 1. Salvar cópia no LocalStorage e disparar evento reativo em tempo real
    try {
      const storedList = JSON.parse(localStorage.getItem('clientebox_completed_submissions') || '[]');
      storedList.unshift(submissionRecord);
      localStorage.setItem('clientebox_completed_submissions', JSON.stringify(storedList.slice(0, 100)));
      
      // Disparar evento para que a aba "Fichas e Formulários Recebidos" atualize instantaneamente
      window.dispatchEvent(new Event('onboarding_submission_added'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Aviso ao salvar cópia local:', err);
    }

    // 2. Disparar POST para o servidor Backend do ClienteBox
    try {
      await fetch('/api/onboarding-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionRecord)
      });
    } catch (err) {
      console.warn('Aviso ao salvar formulário no banco de dados:', err);
    }

    // 3. Disparo POST oficial para o endpoint do Formspree (https://formspree.io/f/mbglvwvr)
    const formspreePayload = {
      "Nome Oficial da Empresa": formData.nomeEmpresa,
      "Nome do Responsável e Cargo": formData.responsavelNomeCargo,
      "Telefone / WhatsApp": formData.telefoneWhatsapp,
      "Ramo / Categoria Principal": formData.categoriaAtuacao,
      "Tipo de Atendimento": formData.tipoAtendimento,
      "Endereço Completo & Ponto de Referência": formData.enderecoPontoReferencia || 'Não informado',
      "Horário de Funcionamento": formData.horarioFuncionamento || 'Não informado',
      "Site / Instagram / Cardápio Digital": formData.siteInstagram || 'Não informado',
      "Principais Serviços / Produtos a Vender": formData.servicosProdutosVender,
      "Diferenciais da Empresa": formData.diferenciaisEmpresa || 'Não informado',
      "Data de Envio": new Date().toLocaleString('pt-BR')
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formspreePayload)
      });

      if (response.ok) {
        console.log('Briefing enviado com sucesso para o Formspree!');
      } else {
        console.warn('Formspree retornou status:', response.status);
      }
    } catch (err) {
      console.warn('Aviso ao conectar ao Formspree:', err);
    }

    setIsSubmitting(false);
    setIsSubmittedSuccess(true);
    showToast('Ficha de briefing recebida e registrada no sistema com sucesso!', 'success');
  };

  const getWhatsAppPhotoUrl = () => {
    const empresaNome = formData.nomeEmpresa.trim() || 'Minha Empresa';
    const text = `Olá Rômulo! Acabei de preencher a ficha de briefing no site da ClienteBox para a empresa *${empresaNome}*.\n\n` +
      `📸 Estou enviando por aqui as fotos da fachada, ambiente interno e arquivo do logotipo para a otimização do nosso perfil no Google Maps!`;
    return `https://wa.me/5568981034408?text=${encodeURIComponent(text)}`;
  };

  const handleCopySummary = () => {
    const summaryText = `*FICHA DE BRIEFING - GOOGLE MEU NEGÓCIO*\n` +
      `----------------------------------------\n` +
      `🏢 *Empresa:* ${formData.nomeEmpresa}\n` +
      `👤 *Responsável:* ${formData.responsavelNomeCargo}\n` +
      `📞 *WhatsApp:* ${formData.telefoneWhatsapp}\n` +
      `📌 *Ramo/Categoria:* ${formData.categoriaAtuacao}\n` +
      `🏬 *Atendimento:* ${formData.tipoAtendimento}\n` +
      `📍 *Endereço:* ${formData.enderecoPontoReferencia || 'N/A'}\n` +
      `⏰ *Horários:* ${formData.horarioFuncionamento}\n` +
      `🌐 *Links:* ${formData.siteInstagram || 'N/A'}\n` +
      `🎯 *Serviços Principais:* ${formData.servicosProdutosVender}\n` +
      `⭐ *Diferenciais:* ${formData.diferenciaisEmpresa || 'N/A'}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    showToast('Resumo da ficha copiado para a área de transferência!', 'success');
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div id="briefing-form-container" className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
      
      {/* SUCCESS CONFIRMATION SCREEN */}
      {isSubmittedSuccess ? (
        <div className="bg-[#111622] p-8 sm:p-12 rounded-3xl border-2 border-emerald-500/40 shadow-2xl text-center space-y-8 animate-fadeIn">
          
          <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-4 py-1.5 rounded-full inline-block">
              Briefing Registrado no Sistema
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              Cadastro Recebido com Sucesso! 🎉
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              Recebemos os dados estratégicos da empresa <strong className="text-amber-300 font-bold">{formData.nomeEmpresa}</strong>. Nosso especialista de inteligência local já iniciou a montagem do plano de blindagem do seu perfil no Google Maps.
            </p>
          </div>

          {/* MAIN PROMINENT WHATSAPP PHOTO BUTTON */}
          <div className="bg-gradient-to-r from-[#16231d] via-[#122820] to-[#16231d] p-6 sm:p-8 rounded-2xl border-2 border-emerald-500/50 shadow-xl max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Etapa Final para Ativação Rápida</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Envie agora as fotos da sua fachada, ambiente e arquivo da sua logotipo para que nossa equipe faça a georreferenciação das imagens.
            </p>

            <a
              href={getWhatsAppPhotoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all transform active:scale-98"
            >
              <Camera className="w-6 h-6 shrink-0" />
              <span>Enviar Fotos pelo WhatsApp 📸</span>
            </a>
          </div>

          {/* Action Tools */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800 max-w-xl mx-auto">
            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-slate-200 border border-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copiedSummary ? 'Ficha Copiada!' : 'Copiar Resumo da Ficha'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSubmittedSuccess(false);
                setFormData(INITIAL_BRIEFING_DATA);
                if (onReturnToHome) onReturnToHome();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#182030] hover:bg-[#202b40] text-slate-300 font-bold text-xs px-5 py-3 rounded-xl border border-slate-700 transition-all"
            >
              <span>Preencher Novo Formulário</span>
            </button>
          </div>

        </div>
      ) : (
        /* BRIEFING FORM */
        <div className="bg-[#111622] p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-800">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ficha Oficial de Otimização & Briefing</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
              Formulário de Briefing para o Google Meu Negócio
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Preencha os dados estratégicos do seu negócio abaixo para darmos início ao alinhamento de SEO Local e blindagem do seu perfil no Google Maps.
            </p>
          </div>

          {/* Form Element */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Nome Oficial da Empresa (Obrigatório) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>1. Nome Oficial da Empresa (Como deve aparecer no Google) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomeEmpresa}
                  onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
                  placeholder="Ex: Jucelino Castro Fisioterapia / SerClin Instituto de Saúde"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 2. Nome do Responsável e Cargo (Obrigatório) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>2. Nome do Responsável e Cargo *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsavelNomeCargo}
                  onChange={(e) => handleChange('responsavelNomeCargo', e.target.value)}
                  placeholder="Ex: Dr. Jucelino Castro - Fisioterapeuta Diretor"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 3. Telefone / WhatsApp de atendimento (Obrigatório) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>3. Telefone / WhatsApp de Atendimento *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.telefoneWhatsapp}
                  onChange={(e) => handleChange('telefoneWhatsapp', e.target.value)}
                  placeholder="Ex: (68) 98103-4408"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 4. Ramo / Categoria de atuação principal (Obrigatório) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>4. Ramo / Categoria Principal no Google *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.categoriaAtuacao}
                  onChange={(e) => handleChange('categoriaAtuacao', e.target.value)}
                  placeholder="Ex: Clínica de Fisioterapia / Salão de Beleza / Odontologia"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 5. Tipo de atendimento (Físico, Domicílio ou Ambos) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>5. Tipo de Atendimento Oferecido *</span>
                </label>
                <select
                  value={formData.tipoAtendimento}
                  onChange={(e) => handleChange('tipoAtendimento', e.target.value as any)}
                  className="w-full bg-[#182030] border border-slate-700 text-amber-300 font-bold text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] cursor-pointer"
                >
                  <option value="Físico (Sede Própria)">Atendimento Presencial Físico (Na Sede)</option>
                  <option value="Atendimento em Domicílio / Área de Cobertura">Atendimento em Domicílio / Área de Cobertura</option>
                  <option value="Ambos (Atendimento Físico e Domicílio)">Ambos (Sede Física + Domicílio / Cobertura)</option>
                </select>
              </div>

              {/* 6. Endereço completo com ponto de referência */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>6. Endereço Completo com Ponto de Referência</span>
                </label>
                <input
                  type="text"
                  value={formData.enderecoPontoReferencia}
                  onChange={(e) => handleChange('enderecoPontoReferencia', e.target.value)}
                  placeholder="Ex: Rua Quintino Bocaiúva, 1848, Bairro Bosque, Rio Branco/AC (Próximo ao Hospital de Urgência)"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 7. Horário de funcionamento */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>7. Horário de Funcionamento Exato</span>
                </label>
                <input
                  type="text"
                  value={formData.horarioFuncionamento}
                  onChange={(e) => handleChange('horarioFuncionamento', e.target.value)}
                  placeholder="Ex: Seg a Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00 | Dom: Fechado"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 8. Site, Instagram ou Cardápio digital */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>8. Site Oficial, Instagram ou Cardápio Digital</span>
                </label>
                <input
                  type="text"
                  value={formData.siteInstagram}
                  onChange={(e) => handleChange('siteInstagram', e.target.value)}
                  placeholder="Ex: @jucelinocastro.fisio / www.suaempresa.com.br"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium"
                />
              </div>

              {/* 9. Principais serviços/produtos que mais quer vender (Obrigatório) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>9. Principais Serviços / Produtos que Mais Deseja Vender no Google *</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.servicosProdutosVender}
                  onChange={(e) => handleChange('servicosProdutosVender', e.target.value)}
                  placeholder="Ex: Fisioterapia Esportiva, Reabilitação de Coluna, Pilates Clínico e Tratamento de Dores Crônicas"
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium leading-relaxed"
                />
              </div>

              {/* 10. Diferenciais da empresa */}
              <div className="md:col-span-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>10. Diferenciais da Empresa e Pontos Fortes</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.diferenciaisEmpresa}
                  onChange={(e) => handleChange('diferenciaisEmpresa', e.target.value)}
                  placeholder="Ex: Estacionamento próprio gratuito, atendimento personalizado individual, ambiente climatizado e mais de 10 anos de tradição na cidade."
                  className="w-full bg-[#182030] border border-slate-700 text-white placeholder-slate-500 text-sm p-3.5 rounded-xl focus:outline-none focus:border-[#ff5a35] transition-all font-medium leading-relaxed"
                />
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Envio direto e seguro para a equipe da ClienteBox</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#ff5a35] to-[#ff7a55] hover:from-[#ff481f] hover:to-[#ff6842] text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl shadow-[#ff5a35]/25 transition-all transform active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processando Envio...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5 shrink-0" />
                    <span>Enviar Ficha de Briefing Agora</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
};
