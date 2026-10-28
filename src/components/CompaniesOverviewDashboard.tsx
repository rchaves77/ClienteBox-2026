import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Building2, 
  Award, 
  ArrowUpRight, 
  Sparkles 
} from 'lucide-react';
import { Company } from '../types';

interface CompaniesOverviewDashboardProps {
  companies: Company[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
}

export const CompaniesOverviewDashboard: React.FC<CompaniesOverviewDashboardProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
}) => {
  const [sortBy, setSortBy] = useState<'cliques' | 'visualizacoes'>('cliques');

  if (!companies || companies.length === 0) return null;

  // Transform company data for the comparison chart using exact real numbers
  const chartData = companies.map((comp) => {
    const rotas = comp.metricasAtual?.rotas || 0;
    const ligacoes = comp.metricasAtual?.ligacoes || 0;
    const chats = comp.metricasAtual?.chats || 0;
    const cliques = comp.metricasAtual?.interacoes || (rotas + ligacoes + chats);

    // Retrieve exact real visualizacoes / impressoes from current metrics without artificial multipliers
    const m = comp.metricasAtual as any;
    const visualizacoes = m?.visualizacoes || m?.impressoesSearch || (rotas + ligacoes + chats);
    const isGoogleSynced = Boolean(m?.googleSyncedAt);

    return {
      id: comp.id,
      nomeCompleto: comp.nome,
      nomeCurto: comp.nome.length > 20 ? comp.nome.substring(0, 18) + '...' : comp.nome,
      cliques,
      visualizacoes,
      rotas,
      ligacoes,
      chats,
      isGoogleSynced,
      googleSyncedAt: m?.googleSyncedAt,
      ltv: comp.ltv || 0
    };
  }).sort((a, b) => b[sortBy] - a[sortBy]);

  // Ecosystem summary calculations
  const totalCliques = chartData.reduce((acc, curr) => acc + curr.cliques, 0);
  const totalVisualizacoes = chartData.reduce((acc, curr) => acc + curr.visualizacoes, 0);
  const topCompany = chartData[0];
  const avgCliques = Math.round(totalCliques / (chartData.length || 1));

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111622] p-4 rounded-2xl border border-slate-700 shadow-2xl space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1.5">
            <p className="font-extrabold text-amber-300 text-sm truncate">
              {data.nomeCompleto}
            </p>
            {data.isGoogleSynced ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                ✓ Google API
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                Manual / Local
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-sky-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Visualizações Reais:
              </span>
              <strong className="text-white font-mono">{data.visualizacoes.toLocaleString('pt-BR')}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#ff5a35]">
              <span className="flex items-center gap-1">
                <MousePointerClick className="w-3.5 h-3.5" /> Cliques & Ações Totais:
              </span>
              <strong className="text-white font-mono">{data.cliques.toLocaleString('pt-BR')}</strong>
            </div>
            <div className="pt-1 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
              <div>Rotas: <strong className="text-emerald-400">{data.rotas}</strong></div>
              <div>Ligações: <strong className="text-purple-400">{data.ligacoes}</strong></div>
              <div>Chats: <strong className="text-sky-300">{data.chats}</strong></div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 block italic pt-1">
            💡 Clique na barra para selecionar esta empresa no painel
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Evolução Geral do Ecossistema
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#ff5a35]" />
            Comparativo de Performance do Último Mês
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe o volume de pesquisas, visualizações e conversões reais entre todas as {companies.length} empresas.
          </p>
        </div>

        {/* SORT CONTROLS */}
        <div className="flex items-center gap-2 bg-[#161d2a] p-1.5 rounded-2xl border border-slate-700/80 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Ordenar por:</span>
          <button
            onClick={() => setSortBy('cliques')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === 'cliques'
                ? 'bg-[#ff5a35] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cliques & Ações
          </button>
          <button
            onClick={() => setSortBy('visualizacoes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sortBy === 'visualizacoes'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Visualizações
          </button>
        </div>
      </div>

      {/* TOP KPI HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161d2a] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Visualizações</span>
            <Eye className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalVisualizacoes.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-slate-500 block">Exibições no Google Maps & Busca</span>
        </div>

        <div className="bg-[#161d2a] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[#ff5a35]">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Cliques Reais</span>
            <MousePointerClick className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalCliques.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-slate-500 block">Rotas GPS + Chamadas + Chats</span>
        </div>

        <div className="bg-[#161d2a] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] uppercase font-bold text-slate-400">Líder do Mês</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-sm font-extrabold text-amber-300 truncate">
            {topCompany ? topCompany.nomeCompleto : 'N/A'}
          </p>
          <span className="text-[10px] text-slate-400 block font-mono">
            {topCompany ? `${topCompany.cliques} ações registradas` : ''}
          </span>
        </div>

        <div className="bg-[#161d2a] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] uppercase font-bold text-slate-400">Média por Empresa</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">
            {avgCliques.toLocaleString('pt-BR')}
          </p>
          <span className="text-[10px] text-slate-500 block">Ações médias por cliente/mês</span>
        </div>
      </div>

      {/* RECHARTS COMPARATIVE BAR CHART */}
      <div className="bg-[#0b0e14] p-4 sm:p-6 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-800/60">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Building2 className="w-4 h-4 text-amber-400" />
            Gráfico de Desempenho Comparativo ({chartData.length} Empresas)
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            💡 Dica: Clique no nome ou barra da empresa para gerenciar
          </span>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: -10, bottom: 25 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  const clickedId = state.activePayload[0].payload.id;
                  if (clickedId) onSelectCompany(clickedId);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
              <XAxis 
                dataKey="nomeCurto" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: '#334155' }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                formatter={(value) => <span className="text-slate-300 text-xs font-bold">{value}</span>}
              />
              <Bar 
                dataKey="visualizacoes" 
                name="Visualizações no Google" 
                fill="#38bdf8" 
                radius={[6, 6, 0, 0]} 
                cursor="pointer"
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-vis-${entry.id}`} 
                    fill={entry.id === selectedCompanyId ? '#0284c7' : '#38bdf8'} 
                  />
                ))}
              </Bar>
              <Bar 
                dataKey="cliques" 
                name="Cliques & Conversões Reais" 
                fill="#ff5a35" 
                radius={[6, 6, 0, 0]} 
                cursor="pointer"
              >
                {chartData.map((entry) => (
                  <Cell 
                    key={`cell-cli-${entry.id}`} 
                    fill={entry.id === selectedCompanyId ? '#e03e18' : '#ff5a35'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
