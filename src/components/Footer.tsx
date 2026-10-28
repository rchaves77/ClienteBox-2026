import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenBriefing?: () => void;
  onAccessAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBriefing, onAccessAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#04070d] border-t border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-clientebox.png" 
                alt="ClienteBox Logo Oficial" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Inteligência Local &bull; Google Maps
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Consultoria técnica de alta precisão especializada no destravamento de perfis no Google Business Profile, georreferenciamento EXIF e rastreamento de rotas e chamadas para empresas locais.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Servidores &amp; Ferramentas de Auditoria Operando em Tempo Real</span>
            </div>
          </div>

          {/* Quick Links Column (3 Cols) */}
          <div className="md:col-span-3 space-y-3 text-xs font-mono">
            <strong className="text-slate-900 dark:text-white uppercase font-bold tracking-wider block">
              Navegação Rápida
            </strong>
            <ul className="space-y-2">
              <li>
                <a href="#diagnostico" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  &bull; Calculadora de Diagnóstico
                </a>
              </li>
              <li>
                <a href="#metodo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  &bull; Os 4 Pilares do Método
                </a>
              </li>
              <li>
                <a href="#resultados" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  &bull; Caso de Estudo &amp; Métricas
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  &bull; Planos &amp; Acompanhamento
                </a>
              </li>
              <li>
                <a href="#investimento" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  &bull; Pacote &amp; Investimento Único
                </a>
              </li>
              {onOpenBriefing && (
                <li>
                  <button 
                    onClick={onOpenBriefing} 
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    &bull; Preencher Briefing Oficial
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Admin Column (4 Cols) */}
          <div className="md:col-span-4 space-y-3 text-xs font-mono">
            <strong className="text-white uppercase font-bold tracking-wider block">
              Atendimento Direto
            </strong>
            <p className="text-slate-400">
              Especialista Responsável: Rômulo Chaves da Silva
            </p>
            <a 
              href={`https://wa.me/5568981034408?text=${encodeURIComponent('Olá Rômulo, estou no site da ClienteBox e gostaria de tirar dúvidas sobre a aceleração do meu perfil no Google Maps!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="group-hover:underline">WhatsApp: (68) 98103-4408</span>
            </a>
            <p className="text-slate-300 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>clienteboxplus@gmail.com</span>
            </p>
            <p className="text-slate-500">
              Rio Branco / AC &bull; Atendimento em Todo o Território Nacional
            </p>

            {onAccessAdmin && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onAccessAdmin}
                  className="text-[11px] text-slate-500 hover:text-amber-400 transition-colors underline cursor-pointer"
                >
                  🔒 Acesso Restrito do Gestor / Painel
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} ClienteBox &bull; clientebox.com.br. Todos os direitos reservados.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Voltar ao Início</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
