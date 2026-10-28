import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  PhoneCall,
  MessageSquare,
  Navigation,
  Database
} from 'lucide-react';
import { AppState, Company } from '../types';
import { calculateSeoHealthScore } from '../utils/seoHealth';

interface SeoHealthLineDashboardProps {
  appState: AppState;
  onSelectCompany: (id: string) => void;
}

export const SeoHealthLineDashboard: React.FC<SeoHealthLineDashboardProps> = ({
  appState,
  onSelectCompany
}) => {
  const companies = Object.values(appState.companies);
  const selectedCompanyId = appState.selectedCompanyId;
  const currentCompany = appState.companies[selectedCompanyId] || companies[0];

  const [metricMode, setMetricMode] = useState<'consolidated' | 'byCompany'>('consolidated');

  if (!companies || companies.length === 0) return null;

  // Colors palette for multi-line company comparison
  const companyColors = [
    '#ff5a35', // Primary Orange
    '#10b981', // Emerald Green
    '#38bdf8', // Sky Blue
    '#a855f7', // Purple
    '#f59e0b', // Amber
    '#ec4899', // Pink
  ];

  // REAL DATA PROCESSING DIRECTLY FROM DATABASE STORED METRICS
  
  // 1. Consolidated Line Data strictly from Cloud SQL stored metrics (Mês Anterior vs Mês Atual)
  const realConsolidatedLineData = [
    {
      periodo: 'Ciclo Anterior (Sem Otimização)',
      'Cliques e Interações Totais (Real)': companies.reduce((acc, c) => acc + Number(c.metricasAnterior.interacoes || 0), 0),
      'Solicitações de Rota GPS (Real)': companies.reduce((acc, c) => acc + Number(c.metricasAnterior.rotas || 0), 0),
      'Atendimentos WhatsApp / Fone (Real)': companies.reduce((acc, c) => acc + Number((c.metricasAnterior.chats || 0) + (c.metricasAnterior.ligacoes || 0)), 0),
    },
    {
      periodo: 'Ciclo Atual (Com Otimização ClienteBox)',
      'Cliques e Interações Totais (Real)': companies.reduce((acc, c) => acc + Number(c.metricasAtual.interacoes || 0), 0),
      'Solicitações de Rota GPS (Real)': companies.reduce((acc, c) => acc + Number(c.metricasAtual.rotas || 0), 0),
      'Atendimentos WhatsApp / Fone (Real)': companies.reduce((acc, c) => acc + Number((c.metricasAtual.chats || 0) + (c.metricasAtual.ligacoes || 0)), 0),
    }
  ];

  // 2. By Company Line Data strictly from stored metrics in database
  const realByCompanyLineData = [
    {
      periodo: 'Ciclo Anterior',
      ...companies.reduce((acc, c) => {
        acc[c.nome] = Number(c.metricasAnterior.interacoes || 0);
        return acc;
      }, {} as Record<string, number>)
    },
    {
      periodo: 'Ciclo Atual (Otimizado)',
      ...companies.reduce((acc, c) => {
        acc[c.nome] = Number(c.metricasAtual.interacoes || 0);
        return acc;
      }, {} as Record<string, number>)
    }
  ];

  // Exact real sums across all registered companies
  const totalClicksCurrent = companies.reduce((acc, c) => acc + Number(c.metricasAtual.interacoes || 0), 0);
  const totalClicksPrev = companies.reduce((acc, c) => acc + Number(c.metricasAnterior.interacoes || 0), 0);
  
  const totalRoutesCurrent = companies.reduce((acc, c) => acc + Number(c.metricasAtual.rotas || 0), 0);
  const totalRoutesPrev = companies.reduce((acc, c) => acc + Number(c.metricasAnterior.rotas || 0), 0);

  const totalChatsCurrent = companies.reduce((acc, c) => acc + Number(c.metricasAtual.chats || 0), 0);
  const totalCallsCurrent = companies.reduce((acc, c) => acc + Number(c.metricasAtual.ligacoes || 0), 0);

  // Exact real growth percentage calculation
  const realGrowthNumber = totalClicksPrev > 0
    ? (((totalClicksCurrent - totalClicksPrev) / totalClicksPrev) * 100)
    : 0;
  const realGrowthFormatted = realGrowthNumber.toFixed(1);

  const realRouteGrowthNumber = totalRoutesPrev > 0
    ? (((totalRoutesCurrent - totalRoutesPrev) / totalRoutesPrev) * 100)
    : 0;

  return (
    <div className="bg-[#111622] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
              <span>Saúde de SEO &amp; Métricas Reais do Banco de Dados</span>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold uppercase font-mono">
                Dados Reais Cloud SQL
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Métricas 100% reais cadastradas nas empresas do sistema ({companies.length} empresa(s) ativa(s))
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#182030] p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setMetricMode('consolidated')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                metricMode === 'consolidated'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Consolidado
            </button>
            <button
              onClick={() => setMetricMode('byCompany')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                metricMode === 'byCompany'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Por Empresa
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY REAL METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Real Clicks */}
        <div className="bg-[#151c2a] p-4.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Interações Totais (Reais)</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-display">
            {totalClicksCurrent.toLocaleString('pt-BR')} <span className="text-xs text-slate-500 font-normal">cliq.</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{realGrowthFormatted}% em relação ao ciclo anterior ({totalClicksPrev})</span>
          </div>
        </div>

        {/* Card 2: GPS Routes */}
        <div className="bg-[#151c2a] p-4.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Rotas GPS Solicitadas (Reais)</span>
            <Navigation className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-display">
            {totalRoutesCurrent.toLocaleString('pt-BR')} <span className="text-xs text-slate-500 font-normal">rotas</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-bold mt-1.5">
            +{realRouteGrowthNumber.toFixed(1)}% vs anterior ({totalRoutesPrev})
          </div>
        </div>

        {/* Card 3: WhatsApp Chats */}
        <div className="bg-[#151c2a] p-4.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Inícios de Chat WhatsApp (Reais)</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-display">
            {totalChatsCurrent.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1.5">
            Mensagens diretas de clientes no período
          </div>
        </div>

        {/* Card 4: Phone Calls */}
        <div className="bg-[#151c2a] p-4.5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>Ligações Telefônicas (Reais)</span>
            <PhoneCall className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300 font-display">
            {totalCallsCurrent.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1.5">
            Chamadas para o telefone do estabelecimento
          </div>
        </div>

      </div>

      {/* RECHARTS LINE CHART: REAL METRICS */}
      <div className="bg-[#151c2a] p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>
                {metricMode === 'consolidated'
                  ? 'Gráfico de Linha: Comparativo Real de Desempenho (Anterior vs Atual)'
                  : 'Gráfico de Linha: Comparativo Real por Empresa (Anterior vs Atual)'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Gráfico gerado exclusivamente com os dados reais salvos no banco de dados Cloud SQL
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-extrabold bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full font-mono">
            Dados 100% Reais
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metricMode === 'consolidated' ? (
              <LineChart data={realConsolidatedLineData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243044" />
                <XAxis dataKey="periodo" stroke="#cbd5e1" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111622',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                
                <Line
                  type="monotone"
                  dataKey="Cliques e Interações Totais (Real)"
                  stroke="#ff5a35"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#ff5a35' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Solicitações de Rota GPS (Real)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#10b981' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Atendimentos WhatsApp / Fone (Real)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 5, fill: '#38bdf8' }}
                />
              </LineChart>
            ) : (
              <LineChart data={realByCompanyLineData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243044" />
                <XAxis dataKey="periodo" stroke="#cbd5e1" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111622',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

                {companies.map((comp, idx) => (
                  <Line
                    key={comp.id}
                    type="monotone"
                    dataKey={comp.nome}
                    stroke={companyColors[idx % companyColors.length]}
                    strokeWidth={comp.id === selectedCompanyId ? 4 : 2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* REAL COMPANY DATA TABLE & EDIT QUICK SELECT */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Métricas Reais Armazenadas por Empresa ({companies.length}):</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            Você pode editar os números de qualquer empresa no formulário abaixo
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((comp) => {
            const health = calculateSeoHealthScore(comp);
            const isSelected = comp.id === selectedCompanyId;
            const prevInt = Number(comp.metricasAnterior.interacoes || 0);
            const currInt = Number(comp.metricasAtual.interacoes || 0);
            const compGrowth = prevInt > 0 ? (((currInt - prevInt) / prevInt) * 100).toFixed(1) : '100';

            return (
              <div
                key={comp.id}
                onClick={() => onSelectCompany(comp.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#182236] border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-[#151c2a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 truncate max-w-[150px]">
                    {comp.categoria || 'Geral'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${health.colorClass}`}>
                    {health.score}/100 &bull; {health.label}
                  </span>
                </div>

                <h5 className="font-extrabold text-white text-sm truncate mb-1">
                  {comp.nome}
                </h5>

                <p className="text-[11px] text-slate-400 truncate mb-3">
                  {comp.responsavel} &bull; {comp.endereco || 'Endereço'}
                </p>

                {/* Real Comparison Grid */}
                <div className="space-y-1.5 text-xs bg-[#0b0e14] p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 text-[11px]">Anterior vs Atual:</span>
                    <strong className="text-white font-mono">
                      {prevInt} &rarr; {currInt} <span className="text-emerald-400 font-bold">({compGrowth}%)</span>
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 text-[11px]">Rotas GPS Atuais:</span>
                    <strong className="text-emerald-400 font-mono">{comp.metricasAtual.rotas} rotas</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 text-[11px]">WhatsApp + Fone:</span>
                    <strong className="text-purple-300 font-mono">{comp.metricasAtual.chats + comp.metricasAtual.ligacoes} contatos</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
