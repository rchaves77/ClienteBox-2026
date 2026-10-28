import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  Phone, 
  Tag, 
  MapPin, 
  Clock, 
  Globe, 
  ShoppingBag, 
  Award,
  Sparkles
} from 'lucide-react';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (title: string, type?: 'success' | 'info' | 'error') => void;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    responsavelNomeCargo: '',
    telefoneWhatsapp: '',
    categoriaAtuacao: '',
    tipoAtendimento: 'Ambos (Sede Física e Atendimento em Domicílio)',
    enderecoPontoReferencia: '',
    horarioFuncionamento: 'Segunda a Sexta: 08:00 às 18:00 | Sábado: 08:00 às 12:00',
    siteInstagram: '',
    servicosProdutosVender: '',
    diferenciaisEmpresa: ''
  });

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        id: `briefing-${Date.now()}`,
        nomeEmpresa: formData.nomeEmpresa,
        responsavelNome: formData.responsavelNomeCargo,
        responsavelTelefone: formData.telefoneWhatsapp,
        niches: [formData.categoriaAtuacao || 'Negócio Local'],
        criadoEm: new Date().toISOString(),
        dadosCompletos: formData
      };

      // 1. Salvar no localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('clientebox_completed_submissions') || '[]');
        stored.unshift(payload);
        localStorage.setItem('clientebox_completed_submissions', JSON.stringify(stored));
      } catch (err) {
        console.warn('Erro ao salvar localmente:', err);
      }

      // 2. Tentar registrar no backend
      try {
        await fetch('/api/onboarding-submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Backend sync avisado:', err);
      }

      // 3. Montar link formatado para o WhatsApp de atendimento
      const whatsappMsg = encodeURIComponent(
        `🚀 NOVO BRIEFING RECEBIDO - CLIENTEBOX\n\n` +
        `1. Empresa: ${formData.nomeEmpresa}\n` +
        `2. Responsável: ${formData.responsavelNomeCargo}\n` +
        `3. WhatsApp: ${formData.telefoneWhatsapp}\n` +
        `4. Categoria: ${formData.categoriaAtuacao}\n` +
        `5. Atendimento: ${formData.tipoAtendimento}\n` +
        `6. Endereço: ${formData.enderecoPontoReferencia}\n` +
        `7. Horário: ${formData.horarioFuncionamento}\n` +
        `8. Site/Insta: ${formData.siteInstagram || 'Não possui'}\n` +
        `9. Principais Serviços: ${formData.servicosProdutosVender}\n` +
        `10. Diferenciais: ${formData.diferenciaisEmpresa || 'Qualidade e agilidade'}\n\n` +
        `Solicito a auditoria técnica da taxa única de R$ 749,00 (de R$ 2.900,00)!`
      );

      showToast?.('Briefing registrado com sucesso! Abrindo WhatsApp de confirmação...', 'success');
      
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        window.open(`https://wa.me/5568981034408?text=${whatsappMsg}`, '_blank');
      }, 500);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      showToast?.('Erro ao processar dados. Tente novamente.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#0d1322] border border-white/[0.1] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0a0f1d]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-lg font-black text-white">
                Briefing Oficial de Auditoria &bull; 10 Campos
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Preencha os dados da sua empresa para iniciarmos o mapeamento geoespacial.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          
          {/* Campo 1: Nome Oficial da Empresa */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Nome Oficial da Empresa *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: JC Fisioterapia Especializada"
              value={formData.nomeEmpresa}
              onChange={(e) => handleChange('nomeEmpresa', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 2: Responsável / Cargo */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>2. Nome do Responsável e Cargo *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Dr. Jucelino Castro - Sócio Diretor"
              value={formData.responsavelNomeCargo}
              onChange={(e) => handleChange('responsavelNomeCargo', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 3: WhatsApp */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Telefone / WhatsApp Oficial do Negócio *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: (68) 98103-4408"
              value={formData.telefoneWhatsapp}
              onChange={(e) => handleChange('telefoneWhatsapp', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 4: Categoria Principal */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Ramo / Categoria Principal *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Clínica de Fisioterapia, Odontologia, Oficina Mecânica..."
              value={formData.categoriaAtuacao}
              onChange={(e) => handleChange('categoriaAtuacao', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 5: Tipo de Atendimento */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>5. Tipo de Atendimento *</span>
            </label>
            <select
              value={formData.tipoAtendimento}
              onChange={(e) => handleChange('tipoAtendimento', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans cursor-pointer"
            >
              <option value="Sede Física (Clientes vêm até o local)">Sede Física (Clientes vêm até o local)</option>
              <option value="Atendimento em Domicílio (Prestação de serviço externo)">Atendimento em Domicílio (Prestação de serviço externo)</option>
              <option value="Ambos (Sede Física e Atendimento em Domicílio)">Ambos (Sede Física e Atendimento em Domicílio)</option>
            </select>
          </div>

          {/* Campo 6: Endereço & Ponto de Referência */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>6. Endereço Completo &amp; Ponto de Referência *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rua Quintino Bocaiúva, 1848 - Bosque, Rio Branco/AC (Em frente à praça)"
              value={formData.enderecoPontoReferencia}
              onChange={(e) => handleChange('enderecoPontoReferencia', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 7: Horário de Funcionamento */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>7. Horário Exato de Funcionamento *</span>
            </label>
            <input
              type="text"
              required
              value={formData.horarioFuncionamento}
              onChange={(e) => handleChange('horarioFuncionamento', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 8: Site / Instagram */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>8. Site / Instagram / Cardápio Digital (Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: @jcfisioterapia ou www.suaempresa.com.br"
              value={formData.siteInstagram}
              onChange={(e) => handleChange('siteInstagram', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 9: Principais Serviços a Vender */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>9. Principais Serviços / Produtos a Vender *</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Ex: Fisioterapia traumato-ortopédica, pilates clínico, RPG, reabilitação pós-cirúrgica..."
              value={formData.servicosProdutosVender}
              onChange={(e) => handleChange('servicosProdutosVender', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Campo 10: Diferenciais da Empresa */}
          <div>
            <label className="block text-slate-300 font-bold uppercase mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>10. Diferenciais Competitivos da Empresa</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Estacionamento privativo, atendimento individual de 1h, tecnologia alemã..."
              value={formData.diferenciaisEmpresa}
              onChange={(e) => handleChange('diferenciaisEmpresa', e.target.value)}
              className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          {/* Footer Submit Button */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-slate-400 hover:text-white font-mono font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? 'Registrando...' : 'Enviar Briefing e Iniciar Auditoria'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
