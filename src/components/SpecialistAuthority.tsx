import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Compass
} from 'lucide-react';

export const SpecialistAuthority: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gradient-to-b dark:from-[#0d1424] dark:via-[#0b101c] dark:to-[#070a13] border border-slate-200 dark:border-white/[0.1] rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-colors">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Portrait Column (5 Cols) - Frame Elegante sem nenhum botão de alterar foto */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative group">
              {/* Outer Neon Glow Ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-blue-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
              
              {/* Photo Frame Container */}
              <div className="relative w-56 h-64 sm:w-64 sm:h-72 bg-slate-900 dark:bg-[#060911] rounded-2xl p-2 border border-slate-200 dark:border-white/[0.15] overflow-hidden flex flex-col items-center justify-center shadow-2xl">
                {/* Specialist Portrait */}
                <div className="w-full h-full rounded-xl bg-white border border-white/[0.08] flex flex-col items-center justify-end relative overflow-hidden">
                  <img
                    src="/romulo.jpg"
                    alt="Rômulo Chaves da Silva"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent p-3 text-center">
                    <strong className="text-white font-extrabold text-sm sm:text-base tracking-wide block">
                      Rômulo Chaves da Silva
                    </strong>
                    <span className="text-[11px] text-emerald-400 font-mono font-medium block">
                      Especialista em Inteligência Local
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge Attached to Frame */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-[#060911] border border-emerald-500/50 text-emerald-400 text-[11px] font-mono font-bold px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Atendimento Direto &bull; Sem Intermediários</span>
              </div>
            </div>

            {/* Scarcity Badge */}
            <div className="mt-8 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl text-amber-600 dark:text-amber-300 font-mono text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>
                Auditorias Exclusivas: <strong>Apenas 8 Empresas / Mês</strong>
              </span>
            </div>
          </div>

          {/* Bio & Authority Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>ESTRATÉGIA HUMANA &bull; CONSULTORIA DEDICADA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              O Especialista por Trás da Sua Operação Local
            </h2>

            {/* Featured Quote */}
            <div className="p-6 bg-slate-50 dark:bg-[#060911]/80 rounded-2xl border-l-4 border-emerald-500 border-slate-200 dark:border-white/[0.06] shadow-md">
              <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed italic font-medium">
                &quot;Eu não terceirizo a inteligência estratégica da sua empresa para robôs ou estagiários. Quem audita o seu perfil, mapeia os concorrentes e cria o plano de blindagem sou eu pessoalmente.&quot;
              </p>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold block mt-3">
                — Rômulo Chaves da Silva, Fundador da ClienteBox
              </span>
            </div>

            {/* Technical Pillars & Competencies */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-bold">Reserva de Raio Territorial:</strong>
                  Não aceitamos duas empresas do mesmo nicho no mesmo raio de 3km para evitar conflito de interesse. O nosso compromisso de Top #1 é com você.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-bold">Entrega Oficial em Documento PDF A4:</strong>
                  Você recebe um relatório executivo de 6 páginas com diagnósticos de concorrentes, mapa de calor de buscas e comprovação dos ajustes realizados.
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
