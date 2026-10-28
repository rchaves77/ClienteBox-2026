import React, { useState } from 'react';
import { 
  AlertTriangle, 
  TrendingDown, 
  MapPin, 
  DollarSign, 
  Send, 
  Sparkles, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Sliders
} from 'lucide-react';

interface LossCalculatorProps {
  onOpenBriefing?: () => void;
}

export const LossCalculator: React.FC<LossCalculatorProps> = ({ onOpenBriefing }) => {
  const [empresa, setEmpresa] = useState('');
  const [nicho, setNicho] = useState('Clínica Médica / Especialidades');
  const [cidadeUf, setCidadeUf] = useState('Rio Branco / AC');
  const [avaliacoesGoogle, setAvaliacoesGoogle] = useState(24);
  const [ticketMedio, setTicketMedio] = useState(350);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const nichosDisponiveis = [
    'Clínica Médica / Especialidades',
    'Dentista & Odontologia',
    'Fisioterapia & Reabilitação',
    'Clínica de Estética & Dermatologia',
    'Advocacia & Consultoria Jurídica',
    'Oficina Mecânica & Auto Center',
    'Restaurante / Bar / Gastronomia',
    'Contabilidade & Assessoria Fiscal',
    'Imobiliária & Corretores',
    'Clínica Veterinária & Pet Shop',
    'Academia / CrossFit / Pilates',
    'Salão de Beleza / Barbearia',
    'Psicologia & Saúde Mental',
    'Comércio & Varejo Físico',
    'Outro Negócio Local'
  ];

  // Algorithmic estimation calculation:
  // Volume base por nicho
  const volumeBuscasEstimado = nicho.includes('Médica') || nicho.includes('Dentista') || nicho.includes('Fisioterapia') || nicho.includes('Estética')
    ? 280
    : nicho.includes('Restaurante') || nicho.includes('Mecânica')
    ? 380
    : 190;

  // Se tem poucas avaliações (< 40), a taxa de perda para o top 3 concorrente é ~65%.
  const taxaDesvioPercent = avaliacoesGoogle < 30 ? 0.72 : avaliacoesGoogle < 80 ? 0.55 : avaliacoesGoogle < 150 ? 0.38 : 0.22;
  const rotasPerdidasMes = Math.max(12, Math.round(volumeBuscasEstimado * taxaDesvioPercent));
  
  // Taxa de conversão média conservadora em compra real (35%)
  const clientesPerdidosMes = Math.round(rotasPerdidasMes * 0.35);
  const faturamentoDesviadoMes = clientesPerdidosMes * ticketMedio;
  const faturamentoDesviadoAno = faturamentoDesviadoMes * 12;

  // Índice de Vulnerabilidade Algorítmica (0 a 100)
  const scoreVulnerabilidade = Math.min(96, Math.max(25, Math.round(100 - (avaliacoesGoogle * 0.35))));

  const handleRunDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);
      // Scroll smoothly to results
      const resultElem = document.getElementById('resultado-diagnostico');
      if (resultElem) {
        resultElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  // WhatsApp Link generator with pre-filled message
  const whatsappText = encodeURIComponent(
    `Olá Rômulo! Fiz o auto-diagnóstico do meu negócio na ClienteBox.\n\n` +
    `🏢 Empresa: ${empresa || 'Minha Empresa'}\n` +
    `📍 Localização: ${cidadeUf}\n` +
    `🏷️ Nicho: ${nicho}\n` +
    `⭐ Avaliações Atuais: ${avaliacoesGoogle}\n` +
    `💰 Ticket Médio: R$ ${ticketMedio.toLocaleString('pt-BR')}\n` +
    `🚨 Estimativa de Desvio: R$ ${faturamentoDesviadoMes.toLocaleString('pt-BR')}/mês (~${rotasPerdidasMes} rotas perdidas no raio de 3km).\n\n` +
    `Quero agendar a auditoria técnica e travar minha vaga com o desconto de R$ 700,00!`
  );
  const whatsappUrl = `https://wa.me/5568981034408?text=${whatsappText}`;

  return (
    <section id="diagnostico" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>INTELIGÊNCIA GEOESPACIAL DE MERCADO</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Calculadora de Auto-Diagnóstico de Perdas
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Descubra quantos clientes estão digitando o que você vende agora no seu bairro e sendo desviados para o seu concorrente por falhas técnicas no Google Maps.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0d1322] border border-white/[0.08] p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
          <form onSubmit={handleRunDiagnostic} className="space-y-5">
            
            {/* Input 1: Nome da Empresa */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase tracking-wider mb-2">
                1. Nome da Empresa / Marca *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Clínica Odonto Prime, Instituto Vital..."
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full bg-[#060911] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                />
              </div>
            </div>

            {/* Input 2: Nicho / Profissão Liberal */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase tracking-wider mb-2">
                2. Nicho / Profissão Liberal *
              </label>
              <select
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                className="w-full bg-[#060911] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                {nichosDisponiveis.map((n) => (
                  <option key={n} value={n} className="bg-[#0d1322] text-slate-200">
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 3: Cidade / Estado */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase tracking-wider mb-2">
                3. Cidade &amp; Estado de Atuação *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Rio Branco / AC, São Paulo / SP..."
                  value={cidadeUf}
                  onChange={(e) => setCidadeUf(e.target.value)}
                  className="w-full bg-[#060911] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                />
              </div>
            </div>

            {/* Input 4: Slider Avaliações no Google */}
            <div className="p-4 bg-[#080d1a] rounded-2xl border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">4. Número Atual de Avaliações no Google:</span>
                <span className="text-amber-400 font-mono text-sm bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/25">
                  ⭐ {avaliacoesGoogle} avaliações
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={avaliacoesGoogle}
                onChange={(e) => setAvaliacoesGoogle(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Perfil Novo/Sem Reputação)</span>
                <span>250</span>
                <span>500+ (Autoridade Forte)</span>
              </div>
            </div>

            {/* Input 5: Slider Ticket Médio */}
            <div className="p-4 bg-[#080d1a] rounded-2xl border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">5. Valor Médio por Cliente / Venda (Ticket):</span>
                <span className="text-emerald-400 font-mono text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/25">
                  R$ {ticketMedio.toLocaleString('pt-BR')}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>R$ 50</span>
                <span>R$ 2.500</span>
                <span>R$ 5.000+</span>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-red-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCalculating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Cruzando Dados Geoespaciais...</span>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 fill-current" />
                  <span>🔥 Diagnosticar Meu Perfil no Google Agora</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Diagnostic Results Dashboard (5 Cols) */}
        <div id="resultado-diagnostico" className="lg:col-span-5 space-y-5">
          <div className="bg-[#0d1322] border border-white/[0.08] p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                PARECER ALGORÍTMICO DE IMPACTO
              </span>
              <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full uppercase ${
                scoreVulnerabilidade > 60 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {scoreVulnerabilidade > 60 ? '🚨 Risco Crítico de Perda' : '⚠️ Oportunidade de Otimização'}
              </span>
            </div>

            {/* Metric 1: Faturamento Desviado Mensal */}
            <div className="p-5 bg-gradient-to-b from-[#160c14] to-[#0d1322] rounded-2xl border border-red-500/30 space-y-1">
              <span className="text-xs font-mono text-red-300 uppercase tracking-wider block">
                Faturamento Estimado Desviado / Mês:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-red-400 font-mono">
                R$ {faturamentoDesviadoMes.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-slate-400">
                (Representa ~R$ {faturamentoDesviadoAno.toLocaleString('pt-BR')} em faturamento indo para a concorrência por ano)
              </p>
            </div>

            {/* Metric 2: Rotas Perdidas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[#080d1a] rounded-2xl border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">
                  Rotas GPS Perdidas / Mês
                </span>
                <strong className="text-xl sm:text-2xl font-black text-amber-400 font-mono block">
                  ~{rotasPerdidasMes} rotas
                </strong>
                <span className="text-[10px] text-slate-500 block">No raio de até 3km</span>
              </div>

              <div className="p-4 bg-[#080d1a] rounded-2xl border border-white/[0.06] space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">
                  Vulnerabilidade
                </span>
                <strong className="text-xl sm:text-2xl font-black text-red-400 font-mono block">
                  {scoreVulnerabilidade}%
                </strong>
                <span className="text-[10px] text-slate-500 block">Falta de autoridade EXIF</span>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="p-4 bg-[#090e1a] rounded-xl border border-white/[0.05] text-xs text-slate-300 leading-relaxed space-y-1.5">
              <span className="font-bold text-white block">
                Por que isso acontece com {empresa || 'sua empresa'}?
              </span>
              <p className="text-slate-400 text-[11px]">
                Sem imagens georreferenciadas com tags EXIF da sua sede física e sem o ajuste de categorias primárias, o Google entrega o clique para quem tiver maior proximidade aparente, mesmo que o seu serviço seja superior.
              </p>
            </div>

            {/* WhatsApp Direct Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Travar Vaga no WhatsApp com Meu Diagnóstico</span>
            </a>

            {onOpenBriefing && (
              <button
                type="button"
                onClick={onOpenBriefing}
                className="w-full py-3 text-xs font-mono text-slate-400 hover:text-white transition-colors underline cursor-pointer text-center block"
              >
                Ou preencher o briefing completo de auditoria do meu negócio
              </button>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
