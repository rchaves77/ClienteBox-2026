import { Company } from '../types';

export interface SeoHealthInfo {
  score: number; // 0 to 100
  label: string; // "Excelente", "Acelerado", "Em Otimização", "Inércia Algorítmica"
  colorClass: string;
  badgeBg: string;
  textColor: string;
  description: string;
}

export function calculateSeoHealthScore(company: Company): SeoHealthInfo {
  if (!company) {
    return {
      score: 50,
      label: 'Em Otimização',
      colorClass: 'bg-amber-950/80 text-amber-400 border border-amber-700/60',
      badgeBg: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: 'Aguardando auditoria completa do perfil.'
    };
  }

  let score = 20; // Base baseline

  const prev = company.metricasAnterior?.interacoes || 0;
  const curr = company.metricasAtual?.interacoes || 0;

  // 1. Growth Factor (up to 30 pts)
  if (prev > 0) {
    const growthRatio = (curr - prev) / prev;
    if (growthRatio >= 0.4) score += 30;
    else if (growthRatio >= 0.2) score += 22;
    else if (growthRatio >= 0.05) score += 15;
    else if (growthRatio >= 0) score += 8;
  } else if (curr > 0) {
    score += 20;
  }

  // 2. High-Intent Conversion Ratio (up to 25 pts)
  const highIntentActions = (company.metricasAtual?.rotas || 0) + (company.metricasAtual?.chats || 0) + (company.metricasAtual?.ligacoes || 0);
  if (curr > 0) {
    const conversionRate = highIntentActions / curr;
    if (conversionRate >= 0.7) score += 25;
    else if (conversionRate >= 0.5) score += 18;
    else if (conversionRate >= 0.3) score += 12;
    else score += 5;
  }

  // 3. Executed Actions Volume (up to 25 pts)
  const acoesCount = company.acoes?.length || 0;
  if (acoesCount >= 4) score += 25;
  else if (acoesCount >= 2) score += 18;
  else if (acoesCount === 1) score += 10;

  // 4. Local Ranking Position (up to 20 pts)
  const top1Comp = company.concorrentes?.find(c => c.posicao.includes('Top 1') || c.nome.includes('Você'));
  if (top1Comp) {
    score += 20;
  } else if (company.concorrentes?.some(c => c.posicao.includes('Top 2'))) {
    score += 12;
  } else {
    score += 5;
  }

  // Cap score safely between 0 and 100
  score = Math.min(100, Math.max(0, score));

  if (score >= 88) {
    return {
      score,
      label: 'Excelente',
      colorClass: 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60',
      badgeBg: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      description: 'Perfil com hiperpresença local e dominância algorítmica no raio.'
    };
  } else if (score >= 72) {
    return {
      score,
      label: 'Acelerado',
      colorClass: 'bg-sky-950/80 text-sky-400 border border-sky-700/60',
      badgeBg: 'bg-sky-500',
      textColor: 'text-sky-400',
      description: 'Aceleração consistente de rotas e atendimentos no perfil.'
    };
  } else if (score >= 50) {
    return {
      score,
      label: 'Em Otimização',
      colorClass: 'bg-amber-950/80 text-amber-400 border border-amber-700/60',
      badgeBg: 'bg-amber-500',
      textColor: 'text-amber-400',
      description: 'Necessita reforço de georreferenciamento e avaliações.'
    };
  } else {
    return {
      score,
      label: 'Inércia Algorítmica',
      colorClass: 'bg-rose-950/80 text-rose-400 border border-rose-700/60',
      badgeBg: 'bg-rose-500',
      textColor: 'text-rose-400',
      description: 'Risco de perda de tráfego local para concorrentes do bairro.'
    };
  }
}
