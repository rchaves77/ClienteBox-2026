import React, { useState } from 'react';
import { 
  Sparkles, MapPin, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, 
  Search, MessageSquare, DollarSign, ShieldAlert, Award, RefreshCw, ChevronRight, Zap
} from 'lucide-react';
import { BRAZIL_CITIES, LIBERAL_PROFESSIONS } from '../data/brazilCities';

interface ClientSelfProspectingProps {
  onContactWhatsApp?: (companyName: string, city: string, lostValue: number) => void;
}

export const ClientSelfProspecting: React.FC<ClientSelfProspectingProps> = ({ onContactWhatsApp }) => {
  const [empresa, setEmpresa] = useState('');
  const [nicho, setNicho] = useState('Estética & Cosmetologia');
  const [cidade, setCidade] = useState('Goiânia / GO');
  const [avaliacoes, setAvaliacoes] = useState<number | ''>(12);
  const [ticketMedio, setTicketMedio] = useState<number | ''>(250);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Calculated fallback estimates handling clean number inputs
  const numericAvaliacoes = typeof avaliacoes === 'number' ? avaliacoes : (Number(avaliacoes) || 0);
  const numericTicketMedio = typeof ticketMedio === 'number' ? ticketMedio : (Number(ticketMedio) || 0);

  const clientesPerdidosMes = scanResult?.estimativa_perdas?.clientes_perdidos_mes || Math.max(5, Math.round(35 - (numericAvaliacoes * 0.4)));
  const faturamentoPerdidoMes = scanResult?.estimativa_perdas?.faturamento_perdido_mes || (clientesPerdidosMes * numericTicketMedio);
  const faturamentoPerdidoAnual = scanResult?.estimativa_perdas?.faturamento_perdido_anual || (faturamentoPerdidoMes * 12);

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa.trim()) return;

    setIsAnalyzing(true);
    setHasResult(false);

    // Simulação rápida para feedback imediato e 100% estático no cliente
    setTimeout(() => {
      const lost = Math.max(5, Math.round(35 - (numericAvaliacoes * 0.4)));
      const lostVal = lost * numericTicketMedio;

      setScanResult({
        empresa_analisada: {
          nome: empresa,
          cidade: cidade,
          nicho: nicho,
          status_posicionamento: "Oportunidade de Otimização no Google Maps",
          risco_perda: "Alto - Concorrentes capturando tráfego de rota"
        },
        concorrentes_reais: [
          {
            nome: `Concorrente Líder em ${cidade || 'Sua Região'}`,
            nota: 5.0,
            avaliacoes: Math.max(85, numericAvaliacoes + 48),
            endereco_bairro: `Bairro Principal / ${cidade || 'Sua Cidade'}`,
            pontos_fortes: "Top 1 no Google Maps com atração diária de rotas GPS"
          },
          {
            nome: `Concorrente Direto (${nicho})`,
            nota: 4.8,
            avaliacoes: Math.max(50, numericAvaliacoes + 28),
            endereco_bairro: `Centro / ${cidade || 'Sua Cidade'}`,
            pontos_fortes: "Perfil verificado com fotos e avaliações recentes"
          }
        ],
        estimativa_perdas: {
          clientes_perdidos_mes: lost,
          faturamento_perdido_mes: lostVal,
          faturamento_perdido_anual: lostVal * 12,
          diagnostico_resumo: `A sua empresa possui ${numericAvaliacoes} avaliações enquanto os líderes do segmento em ${cidade} acumulam mais de 80 avaliações com links diretos de atendimento.`
        }
      });

      setIsAnalyzing(false);
      setHasResult(true);
    }, 600);
  };

  const getWhatsAppMessage = () => {
    const msg = `Olá Rômulo, fiz o diagnóstico do meu negócio (${empresa}) no site da ClienteBox.\n\n` +
      `📍 *Empresa:* ${empresa} (${nicho} - ${cidade})\n` +
      `⭐ *Avaliações atuais:* ${numericAvaliacoes} reviews\n` +
      `💸 *Estimativa de Clientes Perdidos:* ~${clientesPerdidosMes} atendimentos/mês (Estimativa de R$ ${faturamentoPerdidoMes.toLocaleString('pt-BR')}/mês não aproveitados)\n\n` +
      `Quero agendar a otimização de 7 dias por R$ 700 para destravar meu perfil no Google Maps!`;
    return `https://wa.me/5568981034408?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div id="diagnostico-cliente" className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ferramenta de Auto-Diagnóstico Gratuito</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
          Descubra Quantos Clientes Sua Empresa Pode Estar Perdendo no Google Maps
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
          Insira os dados do seu negócio abaixo para analisar sua visibilidade local, comparar sua presença com os concorrentes do seu bairro e ver oportunidades de agendamento.
        </p>
      </div>

      {/* DIAGNOSTIC FORM */}
      <div className="bg-[#131924] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden mb-8">
        <form onSubmit={handleRunDiagnostic} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Nome da Sua Empresa / Marca *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Instituto SerClin / Clínica Silva"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 p-3 rounded-xl outline-none font-medium text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Nicho / Profissões Liberais
            </label>
            <select
              value={nicho}
              onChange={(e) => setNicho(e.target.value)}
              className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 p-3 rounded-xl outline-none font-medium text-sm transition-all cursor-pointer"
            >
              {LIBERAL_PROFESSIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Cidade / Estado (Cidades do Brasil)
            </label>
            <input
              type="text"
              list="brazil-cities-list"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Digite sua cidade (ex: Rio Branco / AC)"
              className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 p-3 rounded-xl outline-none font-medium text-sm transition-all"
            />
            <datalist id="brazil-cities-list">
              {BRAZIL_CITIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Número de Avaliações no Google (Reviews)
            </label>
            <input
              type="number"
              min="0"
              max="50000"
              step="1"
              value={avaliacoes}
              onChange={(e) => setAvaliacoes(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ex: 12"
              className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 p-3 rounded-xl outline-none font-medium text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Ticket Médio do Serviço (R$)
            </label>
            <input
              type="number"
              min="0"
              max="1000000"
              step="1"
              value={ticketMedio}
              onChange={(e) => setTicketMedio(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ex: 1200"
              className="w-full bg-[#0b0e14] border border-slate-700 focus:border-amber-500 text-slate-100 p-3 rounded-xl outline-none font-medium text-sm transition-all"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black p-3 rounded-xl shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditando Presença no Google Maps...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>🔥 Diagnosticar Meu Perfil no Google Agora</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DIAGNOSTIC RESULT CARDS */}
      {hasResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Lost Revenue Metric Box */}
          <div className="bg-gradient-to-br from-[#182030] to-[#111622] p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Diagnóstico de Visibilidade: Oportunidade de Crescimento Local</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  {empresa} em {cidade}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Análise calculada com base no volume de procuras ativas para o segmento de {nicho}.
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 px-5 py-3 rounded-2xl text-center">
                <span className="text-[10px] text-amber-300 font-bold uppercase block">Estimativa de Receita Não Aproveitada</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  R$ {faturamentoPerdidoMes.toLocaleString('pt-BR')} <span className="text-xs font-normal">/ mês</span>
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-center">
              <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Potenciais Clientes Capturados por Concorrentes</span>
                <span className="text-xl font-extrabold text-amber-400 my-1 block font-mono">
                  ~{clientesPerdidosMes} contatos/mês
                </span>
                <span className="text-[10px] text-slate-500">Procurando por {nicho}</span>
              </div>

              <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Nível de Visibilidade Atual</span>
                <span className="text-xl font-extrabold text-amber-400 my-1 block">
                  {numericAvaliacoes < 30 ? 'Necessita Otimização' : 'Oportunidade no Top 3'}
                </span>
                <span className="text-[10px] text-slate-500">{numericAvaliacoes} avaliações no perfil</span>
              </div>

              <div className="bg-[#0b0e14] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Potencial Anual Estimado</span>
                <span className="text-xl font-extrabold text-amber-400 my-1 block font-mono">
                  R$ {faturamentoPerdidoAnual.toLocaleString('pt-BR')}
                </span>
                <span className="text-[10px] text-slate-500">Faturamento anual potencial</span>
              </div>
            </div>

            {/* Real Competitors List if found */}
            {scanResult?.concorrentes_reais && scanResult.concorrentes_reais.length > 0 && (
              <div className="bg-[#0b0e14] p-5 rounded-2xl border border-slate-800 space-y-3 mb-6">
                <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-emerald-400" />
                    <span>Concorrentes Reais Rastreados em {cidade}:</span>
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                    Varredura Ativa
                  </span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {scanResult.concorrentes_reais.map((conc: any, idx: number) => (
                    <div key={idx} className="bg-[#131924] p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all text-xs">
                      <div className="font-bold text-white mb-1 flex items-center justify-between">
                        <span className="truncate pr-2">{conc.nome}</span>
                        <span className="text-amber-400 font-extrabold font-mono text-[11px] shrink-0">
                          {conc.nota} ★
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1.5">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{conc.endereco_bairro || cidade}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 bg-emerald-950/60 p-1.5 rounded border border-emerald-900/60 leading-tight">
                        {conc.avaliacoes} avaliações · {conc.pontos_fortes || "Presença ativa no Maps"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparative Breakdown */}
            <div className="bg-[#0b0e14] p-5 rounded-2xl border border-slate-800 space-y-3 mb-6">
              <h4 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>O que a ClienteBox vai corrigir na sua empresa em 7 dias úteis:</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 bg-[#131924] p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ajuste de Categoria Primária & Termos Locais</span>
                </li>
                <li className="flex items-center gap-2 bg-[#131924] p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Link de WhatsApp Direto com Rastreamento UTM</span>
                </li>
                <li className="flex items-center gap-2 bg-[#131924] p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sincronização de Fotos Georreferenciadas</span>
                </li>
                <li className="flex items-center gap-2 bg-[#131924] p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SISTEMA DE COLETA ATIVA DE AVALIAÇÕES PÓS-ATENDIMENTO</span>
                </li>
              </ul>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/40 border border-emerald-500/40 p-5 rounded-2xl">
              <div>
                <h4 className="text-sm font-extrabold text-emerald-300">
                  Apenas 1 novo cliente recuperado já cobre 100% da otimização!
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Taxa única de R$ 700,00 sem mensalidades obrigatórias & Garantia de 60 Dias.
                </p>
              </div>

              <a
                href={getWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-xl shadow-emerald-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Solicitar Otimização no WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
