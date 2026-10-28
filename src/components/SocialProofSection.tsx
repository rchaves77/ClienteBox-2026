import React, { useState } from 'react';
import {
  TrendingUp,
  Star,
  CheckCircle2,
  Quote
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const SocialProofSection: React.FC = () => {
  const [activeMetricTab, setActiveMetricTab] = useState<'rotas' | 'chamadas'>('rotas');

  const chartData = [
    { period: 'Sem -4', rotasAntes: 9, rotasDepois: null, chamadasAntes: 6, chamadasDepois: null, label: 'Pré-Intervenção' },
    { period: 'Sem -3', rotasAntes: 11, rotasDepois: null, chamadasAntes: 7, chamadasDepois: null, label: 'Inércia' },
    { period: 'Sem -2', rotasAntes: 8, rotasDepois: null, chamadasAntes: 5, chamadasDepois: null, label: 'Inércia' },
    { period: 'Sem -1', rotasAntes: 10, rotasDepois: null, chamadasAntes: 8, chamadasDepois: null, label: 'Auditoria Inicial' },
    { period: 'Dia 0', rotasAntes: 10, rotasDepois: 10, chamadasAntes: 8, chamadasDepois: 8, label: '⚡ INTERVENÇÃO CLIENTEBOX' },
    { period: 'Sem +1', rotasAntes: null, rotasDepois: 22, chamadasAntes: null, chamadasDepois: 16, label: 'Indexação EXIF' },
    { period: 'Sem +2', rotasAntes: null, rotasDepois: 34, chamadasAntes: null, chamadasDepois: 23, label: '+40% de Tração' },
    { period: 'Sem +3', rotasAntes: null, rotasDepois: 46, chamadasAntes: null, chamadasDepois: 29, label: 'Top #1 Consolidado' },
    { period: 'Sem +4', rotasAntes: null, rotasDepois: 58, chamadasAntes: null, chamadasDepois: 37, label: 'Pico de Atendimento' }
  ];

  return (
    <section id="resultados" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>COMPROVAÇÃO TÉCNICA AUDITADA</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          O Efeito &quot;Ponto de Virada&quot; nos Dados
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Veja a curva real de desempenho antes e após a intervenção com geocodificação EXIF e correção de autoridade territorial.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Chart Container (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0d1322] border border-white/[0.08] p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Evolução Real de Tração Semanal</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                  +480% TRAÇÃO
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparativo da média de solicitações de rotas no Waze/Google Maps
              </p>
            </div>
            {/* Metric Switcher Tab */}
            <div className="flex items-center gap-1 p-1 bg-[#060911] rounded-xl border border-white/[0.08] text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveMetricTab('rotas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeMetricTab === 'rotas'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Rotas GPS
              </button>
              <button
                type="button"
                onClick={() => setActiveMetricTab('chamadas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeMetricTab === 'chamadas'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ligações &amp; WhatsApp
              </button>
            </div>
          </div>

          {/* Recharts Component */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBefore" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAfter" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0d1322', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '1rem',
                    color: '#fff',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetricTab === 'rotas' ? 'rotasAntes' : 'chamadasAntes'} 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorBefore)" 
                  name="Inércia Algorítmica (Antes)"
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetricTab === 'rotas' ? 'rotasDepois' : 'chamadasDepois'} 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAfter)" 
                  name="Tração Contínua (Após ClienteBox)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono pt-2 border-t border-white/[0.05]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="text-slate-400">Inércia Prévia: ~10 rotas/semana</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-emerald-400 font-bold">Após Intervenção: 58 rotas/semana (+480%)</span>
            </div>
          </div>
        </div>

        {/* Verified Testimonial Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#10182b] to-[#0a0f1d] border border-white/[0.1] p-7 sm:p-9 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Auditoria de Caso Real
            </span>
          </div>

          {/* Testimonial Quote */}
          <div className="space-y-4">
            <Quote className="w-8 h-8 text-emerald-400/30" />
            <p className="text-white text-base sm:text-lg font-medium leading-relaxed italic">
              &quot;Em menos de 15 dias após os ajustes de georreferenciamento e links de atendimento, registramos um aumento de 40% no envio de rotas para o consultório. É o investimento de maior ROI na história da clínica.&quot;
            </p>
          </div>

          {/* Author Details */}
          <div className="pt-6 border-t border-white/[0.08] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shrink-0">
              JC
            </div>
            <div>
              <strong className="text-white font-bold text-base block">
                Dr. Jucelino Castro
              </strong>
              <span className="text-xs text-slate-400 block font-mono">
                JC Fisioterapia Especializada &bull; Rio Branco / AC
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                +40% de Tração Contínua Comprovada em Relatório A4
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

