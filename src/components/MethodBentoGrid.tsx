import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  Search, 
  Compass, 
  Sparkles, 
  Lock, 
  TrendingUp, 
  Camera, 
  FileCheck
} from 'lucide-react';

export const MethodBentoGrid: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setHoveredCard(cardIndex);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const pillars = [
    {
      id: 1,
      badge: 'Pilar 01 &bull; Inteligência Semântica',
      title: 'Auditoria de Categoria',
      subtitle: 'Alinhamento algorítmico primário e secundário',
      description: 'Correção precisa das categorias primárias e secundárias para alinhar seu perfil aos termos de maior volume e intenção transacional no bairro. Muitas empresas usam categorias genéricas e são simplesmente ignoradas pelo algoritmo quando o cliente pesquisa pelo produto ou procedimento específico.',
      tags: ['Categorias Ocultas', 'Intenção Transacional', 'Mapeamento Local'],
      icon: Search,
      accentColor: 'emerald',
      colSpan: 'md:col-span-7'
    },
    {
      id: 2,
      badge: 'Pilar 02 &bull; Mensuração de ROI',
      title: 'UTMs no WhatsApp',
      subtitle: 'Rastreabilidade ponta a ponta',
      description: 'Parametrização completa de links com códigos UTM exclusivos para você saber exatamente quais conversas, ligações e vendas vieram do perfil do Google Maps vs. outros canais.',
      tags: ['Códigos UTM', 'Atendimento Parametrizado', 'ROI Comprovado'],
      icon: MessageSquare,
      accentColor: 'blue',
      colSpan: 'md:col-span-5'
    },
    {
      id: 3,
      badge: 'Pilar 03 &bull; Metadados EXIF GPS',
      title: 'Georreferenciamento',
      subtitle: 'Injeção de coordenadas da sua sede física',
      description: 'Imagens tratadas com metadados geográficos (latitude, longitude, altitude e geohash) da sua sede física enviadas ao servidor do Google Maps para forçar relevância territorial e ancoragem no raio de 3km a 10km.',
      tags: ['EXIF GPS', 'Geohash', 'Ancoragem Territorial'],
      icon: Compass,
      accentColor: 'blue',
      colSpan: 'md:col-span-5'
    },
    {
      id: 4,
      badge: 'Pilar 04 &bull; Proteção de Ativo',
      title: 'Blindagem Algorítmica',
      subtitle: 'Defesa ativa contra sabotagem de concorrentes',
      description: 'Monitoramento preventivo contra edições maliciosas de terceiros, como alterações forçadas de horário, telefone da recepção, endereço ou fechamento indevido sugerido por concorrentes desleais.',
      tags: ['Proteção de Perfil', 'Anti-Edição Maliciosa', 'Soberania de Dados'],
      icon: ShieldCheck,
      accentColor: 'emerald',
      colSpan: 'md:col-span-7'
    }
  ];

  return (
    <section id="metodo" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>ENGENHARIA DE RANKING LOCAL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Os 4 Pilares do Método ClienteBox
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Uma intervenção técnica estruturada em 4 frentes simultâneas para tirar sua empresa da inércia e colocá-la na rota imediata dos compradores da sua cidade.
        </p>
      </div>

      {/* Bento Grid with Interactive Mouse Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isHovered = hoveredCard === idx;

          return (
            <div
              key={pillar.id}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={handleMouseLeave}
              className={`${pillar.colSpan} relative bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/[0.08] rounded-3xl p-7 sm:p-9 overflow-hidden transition-all duration-300 group hover:border-emerald-500/40 shadow-xl flex flex-col justify-between`}
            >
              {/* Dynamic Spotlight Glow */}
              {isHovered && (
                <div
                  className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
                  style={{
                    background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), transparent 80%)`
                  }}
                />
              )}

              {/* Ambient static corner gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/5 via-emerald-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400" dangerouslySetInnerHTML={{ __html: pillar.badge }} />
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {pillar.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                    {pillar.subtitle}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Tags footer */}
              <div className="pt-6 relative z-10 flex flex-wrap gap-2">
                {pillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#060911]/80 px-3 py-1 rounded-lg border border-slate-200 dark:border-white/[0.06]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
