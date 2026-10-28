import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Edit3, 
  FileSpreadsheet,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Company, MonthlyMetricRecord } from '../types';

interface MonthlyMetricsManagerCardProps {
  company: Company;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onUpdateCompanyHistory: (companyId: string, history: MonthlyMetricRecord[], dataEntradaGestao?: string) => void;
}

export const MonthlyMetricsManagerCard: React.FC<MonthlyMetricsManagerCardProps> = ({
  company,
  showToast,
  onUpdateCompanyHistory
}) => {
  const [dataEntrada, setDataEntrada] = useState<string>(
    company.dataEntradaGestao || company.dataIntervencao || '16/07/2026'
  );

  const [history, setHistory] = useState<MonthlyMetricRecord[]>(
    company.monthlyHistory && company.monthlyHistory.length > 0
      ? company.monthlyHistory
      : [
          {
            mesAno: '2026-04',
            nomeMes: 'Abril 2026',
            rotas: 62,
            chamadas: 10,
            chats: 0,
            websiteClicks: 0,
            agendamentos: 0,
            interacoes: 72,
            visualizacoes: 840,
            observacao: 'Métricas reais do painel Google (Antes da entrada na gestão ClienteBox)'
          },
          {
            mesAno: '2026-05',
            nomeMes: 'Maio 2026',
            rotas: 68,
            chamadas: 12,
            chats: 0,
            websiteClicks: 0,
            agendamentos: 0,
            interacoes: 80,
            visualizacoes: 920,
            observacao: 'Métricas do painel Google'
          },
          {
            mesAno: '2026-06',
            nomeMes: 'Junho 2026',
            rotas: 75,
            chamadas: 14,
            chats: 0,
            websiteClicks: 0,
            agendamentos: 0,
            interacoes: 89,
            visualizacoes: 1050,
            observacao: 'Métricas do painel Google'
          },
          {
            mesAno: '2026-07',
            nomeMes: 'Julho 2026 (Entrada 16/07)',
            rotas: 110,
            chamadas: 24,
            chats: 12,
            websiteClicks: 8,
            agendamentos: 4,
            interacoes: 146,
            visualizacoes: 1680,
            observacao: 'Início da Gestão ClienteBox em 16/07/2026'
          },
          {
            mesAno: '2026-08',
            nomeMes: 'Agosto 2026',
            rotas: 175,
            chamadas: 55,
            chats: 82,
            websiteClicks: 22,
            agendamentos: 15,
            interacoes: 312,
            visualizacoes: 2650,
            observacao: 'Pós-otimização inicial no Google Maps'
          },
          {
            mesAno: '2026-09',
            nomeMes: 'Setembro 2026',
            rotas: 245,
            chamadas: 51,
            chats: 98,
            websiteClicks: 34,
            agendamentos: 28,
            interacoes: 394,
            visualizacoes: 3250,
            observacao: 'Gestão contínua ativa'
          }
        ]
  );

  // New month record form
  const [newMesAno, setNewMesAno] = useState<string>('2026-10');
  const [newNomeMes, setNewNomeMes] = useState<string>('Outubro 2026');
  const [newRotas, setNewRotas] = useState<number>(0);
  const [newChamadas, setNewChamadas] = useState<number>(0);
  const [newChats, setNewChats] = useState<number>(0);
  const [newWebsite, setNewWebsite] = useState<number>(0);
  const [newVisualizacoes, setNewVisualizacoes] = useState<number>(0);
  const [newObservacao, setNewObservacao] = useState<string>('');

  const handleUpdateRecord = (index: number, field: keyof MonthlyMetricRecord, value: any) => {
    const updated = [...history];
    const rec = { ...updated[index], [field]: value };
    
    // Recalculate total interações
    if (field === 'rotas' || field === 'chamadas' || field === 'chats' || field === 'websiteClicks') {
      rec.interacoes = (rec.rotas || 0) + (rec.chamadas || 0) + (rec.chats || 0) + (rec.websiteClicks || 0);
    }
    
    updated[index] = rec;
    setHistory(updated);
  };

  const handleAddMonth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNomeMes.trim()) {
      showToast('Informe o nome do mês.', 'error');
      return;
    }

    const totalInt = newRotas + newChamadas + newChats + newWebsite;
    const newRecord: MonthlyMetricRecord = {
      mesAno: newMesAno || `2026-${String(history.length + 1).padStart(2, '0')}`,
      nomeMes: newNomeMes.trim(),
      rotas: newRotas,
      chamadas: newChamadas,
      chats: newChats,
      websiteClicks: newWebsite,
      interacoes: totalInt,
      visualizacoes: newVisualizacoes,
      observacao: newObservacao.trim()
    };

    const updated = [...history, newRecord];
    setHistory(updated);
    
    // Clear new form
    setNewNomeMes('');
    setNewRotas(0);
    setNewChamadas(0);
    setNewChats(0);
    setNewWebsite(0);
    setNewVisualizacoes(0);
    setNewObservacao('');

    showToast(`Mês "${newRecord.nomeMes}" adicionado ao histórico!`, 'success');
  };

  const handleDeleteRecord = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    showToast('Registro mensal removido.', 'info');
  };

  const handleSaveAll = () => {
    onUpdateCompanyHistory(company.id, history, dataEntrada);
    showToast(`Histórico mensal de métricas reais para ${company.nome} salvo com sucesso!`, 'success');
  };

  // Find max interactions for chart scaling
  const maxInteractions = Math.max(...history.map((item) => item.interacoes || 1), 100);

  return (
    <div className="bg-[#111622] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Métricas Reais Mês a Mês do Google Meu Negócio
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Gestão do Histórico Mensal — {company.nome}
          </h3>
          <p className="text-xs text-slate-400">
            Insira os números exatos extraídos do painel do Google para acompanhar a evolução pré e pós-entrada na gestão.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg text-xs transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Histórico Mensal</span>
        </button>
      </div>

      {/* START DATE & HIGHLIGHT SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#161d2a] p-4 rounded-2xl border border-slate-700/80 items-center">
        <div>
          <label className="block text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Data de Entrada na Gestão ClienteBox:
          </label>
          <input
            type="text"
            value={dataEntrada}
            onChange={(e) => setDataEntrada(e.target.value)}
            placeholder="Ex: 16/07/2026"
            className="w-full bg-[#111622] border border-slate-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 bg-[#111622] p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Antes da Gestão (Ex: Abril/2026)</span>
            <span className="text-sm font-black text-rose-400 block mt-0.5">
              72 Interações (62 Rotas + 10 Chamadas)
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 hidden sm:block" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Após Entrada em {dataEntrada}</span>
            <span className="text-sm font-black text-emerald-400 block mt-0.5">
              394 Interações (+447% de Crescimento)
            </span>
          </div>
        </div>
      </div>

      {/* VISUAL MONTHLY EVOLUTION CHART */}
      <div className="bg-[#161d2a] p-5 rounded-2xl border border-slate-700/80 space-y-3">
        <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          Evolução Visual do Perfil Mês a Mês (Interações Totais Reais)
        </h4>

        <div className="flex items-end justify-between gap-2 h-40 pt-6 pb-2 px-2 border-b-2 border-slate-700">
          {history.map((item, idx) => {
            const heightPercent = Math.min(100, Math.max(12, Math.round((item.interacoes / maxInteractions) * 100)));
            const isPostManagement = item.mesAno >= '2026-07' || item.nomeMes.toLowerCase().includes('julho');

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                
                {/* TOOLTIP ON HOVER */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded-lg shadow-xl pointer-events-none z-20 whitespace-nowrap text-center">
                  <strong className="block text-amber-300">{item.nomeMes}</strong>
                  <span>📍 Rotas: {item.rotas} | 📞 Chamadas: {item.chamadas}</span>
                  <br />
                  <span>💬 Chats: {item.chats} | 👁️ Vis: {item.visualizacoes || 0}</span>
                </div>

                {/* BAR VALUE */}
                <span className={`text-[10px] font-extrabold mb-1 ${isPostManagement ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {item.interacoes}
                </span>

                {/* BAR SHAPE */}
                <div 
                  className={`w-full rounded-t-lg transition-all ${
                    isPostManagement
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-t from-slate-700 to-slate-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                ></div>

                {/* MONTH CAPTION */}
                <span className="text-[10px] font-bold text-slate-400 mt-2 text-center line-clamp-1">
                  {item.nomeMes.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-slate-600 inline-block"></span>
            Período Pré-Gestão
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
            Período Pós-Entrada na Gestão ({dataEntrada})
          </span>
        </div>
      </div>

      {/* MONTHLY METRICS EDITABLE TABLE */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-amber-400" />
          Tabela Editável de Métricas Mensais Reais
        </h4>

        <div className="bg-[#0b0e14] rounded-2xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#161d2a] text-slate-300 border-b border-slate-800">
                <th className="p-3 uppercase font-extrabold text-[10px]">Mês / Período</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-emerald-400">Rotas (GPS)</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-purple-400">Chamadas</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-sky-400">Cliques Chat</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-cyan-400">Website</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-amber-400">Total Interações</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-slate-300">Visualizações</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-slate-400">Observações</th>
                <th className="p-3 uppercase font-extrabold text-[10px] text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {history.map((row, idx) => {
                const isPost = row.mesAno >= '2026-07' || row.nomeMes.toLowerCase().includes('julho');

                return (
                  <tr key={idx} className={isPost ? 'bg-emerald-500/5' : 'bg-transparent'}>
                    {/* MONTH NAME */}
                    <td className="p-2.5 min-w-[140px]">
                      <input
                        type="text"
                        value={row.nomeMes}
                        onChange={(e) => handleUpdateRecord(idx, 'nomeMes', e.target.value)}
                        className="w-full bg-[#182030] border border-slate-700 text-white font-bold text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-amber-400"
                      />
                    </td>

                    {/* ROTAS */}
                    <td className="p-2.5 w-20">
                      <input
                        type="number"
                        value={row.rotas}
                        onChange={(e) => handleUpdateRecord(idx, 'rotas', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#182030] border border-slate-700 text-emerald-400 font-extrabold text-xs px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </td>

                    {/* CHAMADAS */}
                    <td className="p-2.5 w-20">
                      <input
                        type="number"
                        value={row.chamadas}
                        onChange={(e) => handleUpdateRecord(idx, 'chamadas', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#182030] border border-slate-700 text-purple-400 font-extrabold text-xs px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </td>

                    {/* CHATS */}
                    <td className="p-2.5 w-20">
                      <input
                        type="number"
                        value={row.chats}
                        onChange={(e) => handleUpdateRecord(idx, 'chats', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#182030] border border-slate-700 text-sky-400 font-extrabold text-xs px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </td>

                    {/* WEBSITE */}
                    <td className="p-2.5 w-20">
                      <input
                        type="number"
                        value={row.websiteClicks || 0}
                        onChange={(e) => handleUpdateRecord(idx, 'websiteClicks', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#182030] border border-slate-700 text-cyan-400 font-extrabold text-xs px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </td>

                    {/* TOTAL INTERAÇÕES */}
                    <td className="p-2.5 w-24">
                      <span className="font-black text-amber-400 bg-[#182030] px-2.5 py-1 rounded-lg block text-center border border-slate-700">
                        {row.interacoes}
                      </span>
                    </td>

                    {/* VISUALIZAÇÕES */}
                    <td className="p-2.5 w-24">
                      <input
                        type="number"
                        value={row.visualizacoes || 0}
                        onChange={(e) => handleUpdateRecord(idx, 'visualizacoes', parseInt(e.target.value) || 0)}
                        className="w-full bg-[#182030] border border-slate-700 text-slate-200 font-bold text-xs px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </td>

                    {/* OBSERVAÇÃO */}
                    <td className="p-2.5 min-w-[180px]">
                      <input
                        type="text"
                        value={row.observacao || ''}
                        onChange={(e) => handleUpdateRecord(idx, 'observacao', e.target.value)}
                        placeholder="Ex: Dados do painel Google"
                        className="w-full bg-[#182030] border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </td>

                    {/* ACTIONS */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-[#182030] rounded-lg transition-colors"
                        title="Remover mês"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM TO ADD NEW MONTHLY RECORD */}
      <form onSubmit={handleAddMonth} className="bg-[#161d2a] p-4 rounded-2xl border border-slate-700/80 space-y-3">
        <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          Adicionar Novo Mês ao Histórico Real:
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Mês/Ano:</label>
            <input
              type="text"
              value={newNomeMes}
              onChange={(e) => setNewNomeMes(e.target.value)}
              placeholder="Ex: Outubro 2026"
              required
              className="w-full bg-[#111622] border border-slate-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Rotas GPS:</label>
            <input
              type="number"
              value={newRotas}
              onChange={(e) => setNewRotas(parseInt(e.target.value) || 0)}
              className="w-full bg-[#111622] border border-slate-700 text-emerald-400 font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Chamadas:</label>
            <input
              type="number"
              value={newChamadas}
              onChange={(e) => setNewChamadas(parseInt(e.target.value) || 0)}
              className="w-full bg-[#111622] border border-slate-700 text-purple-400 font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Chats:</label>
            <input
              type="number"
              value={newChats}
              onChange={(e) => setNewChats(parseInt(e.target.value) || 0)}
              className="w-full bg-[#111622] border border-slate-700 text-sky-400 font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Website:</label>
            <input
              type="number"
              value={newWebsite}
              onChange={(e) => setNewWebsite(parseInt(e.target.value) || 0)}
              className="w-full bg-[#111622] border border-slate-700 text-cyan-400 font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Visualizações:</label>
            <input
              type="number"
              value={newVisualizacoes}
              onChange={(e) => setNewVisualizacoes(parseInt(e.target.value) || 0)}
              className="w-full bg-[#111622] border border-slate-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <input
            type="text"
            value={newObservacao}
            onChange={(e) => setNewObservacao(e.target.value)}
            placeholder="Observação (Ex: Dados extraídos do painel Google)"
            className="w-full sm:flex-1 bg-[#111622] border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg focus:outline-none"
          />

          <button
            type="submit"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2 rounded-xl shadow-lg transition-all active:scale-95 shrink-0"
          >
            + Adicionar Mês ao Histórico
          </button>
        </div>
      </form>
    </div>
  );
};
