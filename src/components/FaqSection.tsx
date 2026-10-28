import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. Em quanto tempo vejo os primeiros resultados de rotas e chamadas?',
      a: 'Entre 48 horas e 72 horas após a validação das categorias primárias e injeção das imagens georreferenciadas nos servidores do Google. O algoritmo do Google Maps atualiza a grade de relevância local e o seu pino passa a ser entregue nas buscas ativas do bairro.'
    },
    {
      q: '2. Existe cobrança de mensalidade obrigatória ou fidelidade?',
      a: 'Não! O nosso serviço opera no modelo de Taxa Única de R$ 700,00 para intervenção técnica, estruturação completa e entrega do Relatório Executivo Oficial de 6 Páginas A4 em PDF. Você é o dono absoluto do seu perfil e não fica preso a nenhuma assinatura forçada.'
    },
    {
      q: '3. Como é feito o rastreio das mensagens de WhatsApp vindas do Google Maps?',
      a: 'Criamos links de contato personalizados com tags UTM específicas do Google Business Profile. Quando um cliente clica no botão "Conversar" ou "Agendar" dentro do Maps, a mensagem inicial chega com uma identificação técnica rastreada, permitindo saber o dia, hora e origem exata de cada fechamento.'
    },
    {
      q: '4. O que acontece se um concorrente tentar sabotar meu endereço ou telefone?',
      a: 'Aplicamos a Blindagem Algorítmica da ClienteBox no seu perfil: parametrização de segurança, proteção contra edições públicas sugeridas e monitoramento preventivo. Se alguém tentar alterar o seu número ou marcar sua empresa como "Fechada Permanentemente", a edição é bloqueada e notificada.'
    },
    {
      q: '5. Funciona para qualquer ramo e porte de empresa local?',
      a: 'Sim! O algoritmo de proximidade e relevância do Google Maps privilegia negócios que atendem presencialmente ou em domicílio no raio da cidade. É perfeito para Clínicas Médicas, Dentistas, Fisioterapeutas, Advogados, Oficinas, Restaurantes, Salões, Contabilidades, Imobiliárias e Comércio em geral.'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>TRANSPARÊNCIA TOTAL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Perguntas Frequentes &bull; FAQ
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
          Tire todas as suas dúvidas sobre prazos, funcionamento técnico e garantias da intervenção.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : ''
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-white/[0.04] pt-4 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
