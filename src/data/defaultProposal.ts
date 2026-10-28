import { CommercialProposalData } from '../types';

export const juLopesProposalData: CommercialProposalData = {
  documento: {
    tipo: "Proposta Comercial & Diagnóstico de Ecossistema Digital",
    titulo: "PLANO DE DESTRAVAMENTO & DOMINÂNCIA EM ESTÉTICA",
    subtitulo: "Otimização de Conversão de Agendamentos e Tração no Top 3 do Google Maps",
    versao_template: "A4 - 5 Páginas com Capa",
    data_emissao: "21 de Setembro de 2026",
    empresa_consultora: {
      nome: "ClienteBox – Soluções Digitais",
      slogan: "Gestão Estratégica & SEO no Google Maps",
      responsavel_tecnico: "Rômulo Chaves da Silva",
      contato_corporativo: "(68) 98103-4408",
      dados_pagamento: {
        metodo: "PIX",
        chave_pix: "(68) 98103-4408",
        tipo_chave: "Celular",
        titular: "Rômulo Chaves da Silva",
        instituicao_bancaria: "Sicredi"
      }
    },
    cliente: {
      nome_fantasia: "Ju Lopes Estética",
      responsavel: "Dra. Julyelle Lopes (Biomédica & Enf. Esteta)",
      credenciais: "CRBM 16.521 / COREN 132.772 &bull; Expert em Microfocado e Fios de PDO",
      nicho: "Clínica de Estética & Saúde",
      cidade_uf: "Goiânia / GO",
      bairro: "Jardim América",
      telefone_whatsapp: "(62) 98104-2368",
      canais_auditados: {
        google_maps: "Ju Lopes Estética (32 avaliações, nota 5.0 — Parado desde maio/2024)",
        instagram: "https://www.instagram.com/julopesestetica (@julopesestetica — 13 mil seguidores)",
        website_configurado: "Site aponta para o Instagram (sem landing page de agendamento)",
        concorrentes_referencia: [
          "Stoá Estética (187 avaliações, nota 5.0)",
          "Dermo Beauty (116 avaliações)",
          "Mestria / Ludmilla (Jardim América)"
        ]
      }
    }
  },
  diagnostico_cenario_atual: {
    resumo_executivo: "A Ju Lopes possui expressiva autoridade de marca no Instagram com 13 mil seguidores e nota máxima 5.0 no Google, mas seu perfil no Google Empresas não recebe uma avaliação nova desde maio de 2024 (mais de 2 anos estagnado). Além disso, o botão de website aponta para o Instagram em vez de uma página direta de agendamento, dispersando clientes de alto ticket que pesquisam 'clínica de estética em Goiânia' e fazendo com que concorrentes como a Stoá Estética (187 avaliações) dominem o topo da busca.",
    argumento_contraste: "Autoridade absurda no Instagram (13 mil seguidores e nota 5.0) × Invisibilidade e estagnação no Google Maps (parado desde maio/2024 enquanto concorrentes capturam as clientes de Goiânia).",
    metricas_chave: {
      nota_media: {
        valor: "5.0 ★",
        rotulo: "Nota Média",
        status: "Excelente, porém Parada",
        tipo: "alerta"
      },
      total_avaliacoes: {
        valor: "32 Reviews",
        rotulo: "Volume no Maps",
        status: "Estagnado desde Mai/2024",
        tipo: "critico"
      },
      instagram_followers: {
        valor: "13.000",
        rotulo: "Seguidores Insta",
        status: "Autoridade Não Monetizada",
        tipo: "alerta"
      },
      concorrente_lider: {
        valor: "187 Reviews",
        rotulo: "Stoá Estética",
        status: "Capturando Top 1 no Maps",
        tipo: "critico"
      }
    },
    auditoria_canais: [
      {
        canal: "Google Business Profile",
        dados_atuais: "Parado desde maio de 2024 (32 avaliações)",
        status: "Gravíssimo",
        impacto_algoritmico: "O Google interpreta o perfil como 'inativo', rebaixando o ranqueamento orgânico e a visibilidade local."
      },
      {
        canal: "Website / Agendamento",
        dados_atuais: "Site apontando direto para o Instagram",
        status: "Crítico",
        impacto_algoritmico: "Cliente com intenção de fechar clica, se distrai com o feed do Instagram e abandona o agendamento."
      },
      {
        canal: "Respostas & Interações",
        dados_atuais: "Nenhuma resposta recente às avaliações no perfil",
        status: "Alerta",
        impacto_algoritmico: "Sinal de descaso para o algoritmo do Google e menor taxa de conversão das pesquisas."
      },
      {
        canal: "Conteúdo & Fotos",
        dados_atuais: "Fotos institucionais sem atualizações recentes",
        status: "Fricção",
        impacto_algoritmico: "Vitrine visual fraca em comparação a concorrentes que postam semanalmente no perfil do Google."
      }
    ]
  },
  inteligencia_competitiva: {
    titulo_grafico: "Volume de Avaliações & Posicionamento no Google Maps (Goiânia/GO)",
    dados_grafico: [
      {
        empresa: "Stoá Estética",
        avaliacoes: 187,
        nota: 5.0,
        largura_barra_percentual: 100,
        status: "Líder de Chamados"
      },
      {
        empresa: "Dermo Beauty",
        avaliacoes: 116,
        nota: 4.9,
        largura_barra_percentual: 62,
        status: "Top 2 Consolidado"
      },
      {
        empresa: "Ju Lopes Estética (Atual)",
        avaliacoes: 32,
        nota: 5.0,
        largura_barra_percentual: 17,
        status: "Estagnado desde Mai/2024"
      },
      {
        empresa: "Meta 60 Dias",
        avaliacoes: "60+ reviews",
        nota: 5.0,
        largura_barra_percentual: 35,
        status: "Top 3 em Ascensão"
      }
    ]
  },
  engenharia_seo_local: {
    escopo_execucao_taxa_unica: [
      "Corrigir o Nome e Cadastro Oficial: Padronização técnica de categorias, nome e informações no Google Empresas.",
      "Otimização de Descrição e Serviços: Cadastro detalhado dos procedimentos (Harmonização, Botox, Microfocado, Fios de PDO, Melasma, Varizes) com horários completos.",
      "Integração do WhatsApp Direct (wa.me): Sincronização do link direto de agendamento sem desviar para redes intermediárias.",
      "Implementação do Sistema de Avaliações Ativas: Automação e script pós-atendimento para transformar 1 em cada 20 pacientes em novas avaliações no Google.",
      "Atualização Visual & Postagens Iniciais: Publicação de 2 postagens estratégicas no perfil e upload de fotos georreferenciadas dos procedimentos e da clínica."
    ]
  },
  viabilidade_financeira: {
    ticket_medio_servico: "R$ 200,00 a R$ 500,00 por procedimento estético",
    ltv_anual_estimado: "R$ 2.400,00 a R$ 6.000,00 por cliente recorrente em 1 ano",
    ponto_de_equilibrio: "Apenas 1 nova paciente de procedimento básico já paga 100% do investimento único de R$ 700.",
    cenarios: [
      {
        cenario: "Conservador",
        investimento: "R$ 700,00 (único)",
        novos_clientes_mes: "1 paciente",
        receita_bruta_mes: "R$ 300,00",
        ltv_anual_12m: "R$ 2.400,00",
        roi_estimado: "242%"
      },
      {
        cenario: "Realista",
        investimento: "R$ 700,00 (único)",
        novos_clientes_mes: "2 a 3 pacientes",
        receita_bruta_mes: "R$ 600,00 a R$ 900,00",
        ltv_anual_12m: "R$ 4.800,00 a R$ 7.200,00",
        roi_estimado: "928%"
      },
      {
        cenario: "Com Google Ads",
        investimento: "R$ 700,00 + tráfego",
        novos_clientes_mes: "3 a 6 pacientes",
        receita_bruta_mes: "R$ 900,00 a R$ 1.800,00",
        ltv_anual_12m: "R$ 7.200,00 a R$ 14.400,00",
        roi_estimado: "1.950%"
      }
    ]
  },
  condicao_comercial: {
    servico: "Otimização Inicial Completa + Tração no Google Business Profile",
    valor_proposta: "R$ 700,00",
    modelo: "Taxa Única de Otimização (Prazo: 7 dias úteis)",
    planos_acompanhamento_opcionais: {
      mensal: "R$ 300,00 / mês",
      trimestral: "R$ 950,00 / trimestre",
      semestral: "R$ 1.550,00 / semestre"
    },
    garantia: {
      prazo_dias: 60,
      descricao: "Compromisso de Risco Zero & Garantia de 60 Dias: Se em 60 dias o perfil não crescer (mais avaliações, mais visualizações, mais contatos), continuo trabalhando de graça até crescer. Sem custo extra."
    }
  },
  scripts_comerciais_whatsapp: {
    mensagem_2_diagnostico: `Perfeito, e é ótimo que vocês já cuidem disso — mostra que a Ju Lopes tem atenção com a imagem. Eu sou especialista em Google Business Profile para o nicho de estética, e analisando o perfil de vocês com calma encontrei 3 pontos que estão passando despercebidos e custando cliente todo dia. Olha:

1️⃣ 13 mil seguidores no Instagram, mas o Google parou de receber avaliações em maio de 2024 — Vocês têm autoridade absurda no Insta, mas o Google não sabe disso. Quem pesquisa "clínica de estética em Goiânia" hoje encontra a Stoá Estética, com 187 avaliações, no topo — não vocês. No Google, quem tem mais avaliações recentes vence, não quem atende melhor.

2️⃣ O site de vocês aponta pro Instagram em vez de uma página de agendamento — A cliente que pesquisa no Google já tem intenção de fechar. Ela clica, cai no Instagram, se distrai com o feed e não agenda. Cada clique que não vira agendamento é dinheiro indo embora.

3️⃣ Nenhuma resposta às avaliações e zero postagens no perfil — O Google favorece perfis ativos. Sem avaliações novas, sem posts, sem respostas, ele empurra o perfil de vocês pra baixo — e a cliente que pesquisa agora fecha com a Mestria ou a Ludmilla, que estão no mesmo Jardim América.

Resumindo: vocês têm 13 mil seguidores, nota 5.0 e uma clínica linda — mas o Google tá escondendo tudo isso porque o perfil está parado desde 2024. A cliente que pesquisa estética agora não encontra vocês no topo. 😕`,
    cta_transicao: `E olha, a parte boa: isso não é sobre vocês fazerem errado — é sobre um sistema que ainda não existe. Eu já resolvi isso pra outras clínicas e, em 1 minuto, te mostro exatamente o que eu faria. Posso mandar?`,
    mensagem_3_fechamento: `Então, Ju. Por um valor único de R$ 700, eu faço a otimização inicial completa do Google Business de vocês:

✅ Corrigir o nome e o cadastro que aparece no Google
✅ Criar descrição completa com serviços e horários
✅ Sincronizar o telefone certo e o link do WhatsApp
✅ Deixar 2 postagens no perfil
✅ Ajustar o sistema de avaliação para melhor ranquear

E o melhor: se em 60 dias o perfil não crescer (mais avaliações, mais visualizações, mais contatos), eu continuo trabalhando de graça até crescer. Sem custo extra.

Pensa no retorno: 1 cliente nova por mês já paga o investimento. Com acompanhamento, essa cliente vale em média R$ 2.400 por ano pra vocês (procedimentos recorrentes). Se fecharem só 2 clientes por mês com o perfil otimizado, são R$ 4.800 de retorno sobre R$ 700 investidos. 🚀

Quer que eu comece hoje?`,
    banco_de_objecoes: {
      "o_que_faz_exatamente": "Eu sou especialista em Google Business Profile para o nicho de estética. Corrijo nome, endereço, telefone, descrição, serviços, horários, postagens e implemento um sistema que pede avaliação automaticamente após cada atendimento. Faço o Google entender que o perfil de vocês é o mais relevante quando alguém pesquisa 'clínica de estética em Goiânia'. Vocês continuam atendendo, eu faço o Google trabalhar pra vocês.",
      "ja_temos_instagram": "O Instagram de vocês tem 13 mil seguidores — é excelente. Mas o Instagram mostra o trabalho pra quem já conhece. O Google traz a cliente que está procurando estética AGORA, com intenção de agendar. São canais diferentes. Quem segue no Insta admira, mas quem pesquisa no Google é quem vai pagar o procedimento. E hoje, quem pesquisa no Google não encontra vocês no topo.",
      "ja_temos_agencia": "Agência faz o generalista — social media, tráfego, branding. Eu sou especialista em Google Business Profile para estética. Complemento, não substituo. A agência cuida do Instagram, eu cuido do Google. E o perfil parado desde 2024, com a Stoá capturando as clientes? Ninguém atacou ainda — eu ataco.",
      "deixa_eu_pensar": "Entendo perfeitamente. Só lembrando: cada dia sem avaliações novas, a cliente que pesquisa 'estética em Goiânia' encontra a Stoá com 187 avaliações e agenda com ela. Essa cliente não volta. A diferença entre aparecer no topo ou não é de semanas — e cada semana tem cliente indo pra concorrência.",
      "quanto_custa": "Valor único de R$ 700 pela otimização inicial completa. Sem mensalidade, sem fidelidade. Inclui correção do cadastro, descrição com serviços e horários, postagens e sistema de avaliações. Se o perfil não crescer em 60 dias, continuo trabalhando de graça até crescer.",
      "e_caro": "1 cliente nova já paga os R$ 700. Vocês têm 13 mil seguidores — se eu colocar um sistema que transforma 1 em cada 20 em avaliação no Google, vocês passam de 32 para centenas de reviews e dominam a busca 'estética em Goiânia'. Se paga no primeiro procedimento.",
      "nao_temos_tempo": "Eu sei que vocês atendem o dia todo — por isso eu faço tudo. Vocês só me passam as fotos da clínica e as informações dos serviços. O resto é todo comigo. Vocês focam no atendimento, eu foco no Google."
    },
    cases_autoridade: [
      {
        cliente: "Instituto SerClin",
        resultado: "Redução do Custo por Clique (CPC) no Google Ads de R$ 2,89 para R$ 0,18 com otimização técnica contínua."
      },
      {
        cliente: "Jucelino Castro Fisioterapia",
        resultado: "Crescimento de 70,6% em pedidos de rota no GPS e consolidação de demanda direta no Bosque (Iniciado em 17/07/2026 com otimização + sistema da clínica)."
      }
    ]
  }
};

export const eletroRodriguesProposalData: CommercialProposalData = {
  documento: {
    tipo: "Proposta Comercial & Diagnóstico de Ecossistema Digital",
    titulo: "PLANO DE DESTRAVAMENTO & INTEGRAÇÃO LOCAL",
    subtitulo: "Otimização de Conversão de Agendamentos e Tração no Top 3 do Google Maps",
    versao_template: "A4 - 5 Páginas com Capa",
    data_emissao: "21 de Setembro de 2026",
    empresa_consultora: {
      nome: "ClienteBox – Soluções Digitais",
      slogan: "Gestão Estratégica & SEO no Google Maps",
      responsavel_tecnico: "Rômulo Chaves da Silva",
      contato_corporativo: "(68) 98103-4408",
      dados_pagamento: {
        metodo: "PIX",
        chave_pix: "(68) 98103-4408",
        tipo_chave: "Celular",
        titular: "Rômulo Chaves da Silva",
        instituicao_bancaria: "Sicredi"
      }
    },
    cliente: {
      nome_fantasia: "Eletro Rodrigues",
      responsavel: "Rodrigo (Responsável Técnico)",
      credenciais: "Eletricista Residencial & Comercial",
      nicho: "Serviços Elétricos e Manutenção Predial",
      cidade_uf: "Goiânia / GO",
      bairro: "Atendimento Domiciliar Goiânia",
      telefone_whatsapp: "(62) 98100-0000",
      canais_auditados: {
        google_maps: "Eletro Rodrigues (19 avaliações, nota 4.8)",
        instagram: "https://www.instagram.com/eletro_rodriguez (@eletro_rodriguez com Z)",
        website_configurado: "Linktree intermediário sem botão nativo de WhatsApp",
        concorrentes_referencia: [
          "Murilo Eletricista (65 avaliações, nota 5.0)",
          "Eletricista Goiânia 24h"
        ]
      }
    }
  },
  diagnostico_cenario_atual: {
    resumo_executivo: "A Eletro Rodrigues possui presença ativa nas redes sociais exibindo serviços concluídos, mas apresenta três rupturas graves no Google: conflito de grafia no nome entre Instagram (com Z) e Google (com S), atributo incorreto informando que 'não atende no local' e ausência de botão nativo de WhatsApp, fazendo com que os chamados mais lucrativos de Goiânia migrem para os concorrentes.",
    argumento_contraste: "Presença ativa nas redes sociais exibindo obras e fiações versus três rupturas críticas no Google Maps que afastam chamados emergenciais e de alto ticket em Goiânia.",
    metricas_chave: {
      nota_media: {
        valor: "4.8 ★",
        rotulo: "Nota Média",
        status: "Risco por Queixas sem Resposta",
        tipo: "alerta"
      },
      total_avaliacoes: {
        valor: "19 Reviews",
        rotulo: "Volume no Maps",
        status: "Abaixo do Líder (65)",
        tipo: "critico"
      },
      servico_local: {
        valor: "Indisponível",
        rotulo: "Serviço no Local",
        status: "Erro Cadastral Grave",
        tipo: "critico"
      },
      naming_nap: {
        valor: "Conflito S/Z",
        rotulo: "Naming / NAP",
        status: "Quebra de Autoridade",
        tipo: "critico"
      }
    },
    auditoria_canais: [
      {
        canal: "Google Business Profile",
        dados_atuais: "Marcado como 'serviço no local indisponível'",
        status: "Gravíssimo",
        impacto_algoritmico: "Algoritmo reduz alcance domiciliar e clientes julgam que não há visitas presenciais em Goiânia."
      },
      {
        canal: "Instagram vs Google",
        dados_atuais: "@eletro_rodriguez (Z) vs Eletro Rodrigues (S)",
        status: "Crítico",
        impacto_algoritmico: "Quebra de correspondência direta no motor de busca e perda de autoridade de marca."
      },
      {
        canal: "Canal de Conversão",
        dados_atuais: "Linktree intermediário sem botão nativo de WhatsApp",
        status: "Fricção",
        impacto_algoritmico: "Adiciona etapa desnecessária em emergências elétricas, reduzindo a conversão em 40%."
      },
      {
        canal: "Reputação & Avaliações",
        dados_atuais: "Reclamações sobre fiação abertas sem resposta oficial",
        status: "Alerta",
        impacto_algoritmico: "Gera insegurança imediata em novos contratantes que pesquisam antes de fechar."
      }
    ]
  },
  inteligencia_competitiva: {
    titulo_grafico: "Volume de Avaliações & Posicionamento no Google Maps (Goiânia/GO)",
    dados_grafico: [
      {
        empresa: "Murilo Eletricista",
        avaliacoes: 65,
        nota: 5.0,
        largura_barra_percentual: 85,
        status: "Líder de Chamados"
      },
      {
        empresa: "Eletro Rodrigues (Atual)",
        avaliacoes: 19,
        nota: 4.8,
        largura_barra_percentual: 25,
        status: "Travado no Google"
      },
      {
        empresa: "Meta 60 Dias",
        avaliacoes: "35+ reviews",
        nota: 5.0,
        largura_barra_percentual: 50,
        status: "Top 3 Consolidado"
      }
    ]
  },
  engenharia_seo_local: {
    escopo_execucao_taxa_unica: [
      "Alinhamento NAP e Nomenclatura: Padronização de nome e bio entre Instagram, Facebook e Google Maps.",
      "Correção do Atributo Presencial: Habilitação formal de visita a domicílio e definição do raio de atendimento em Goiânia.",
      "Integração com WhatsApp Nativo: Inserção do link direto wa.me sem páginas intermediárias para orçamentos rápidos.",
      "Blindagem Técnica de Avaliações: Elaboração de respostas profissionais para neutralizar queixas antigas no perfil.",
      "Metadados em Fotos: Upload de fotos de serviços reais georreferenciadas diretamente no painel do Google."
    ]
  },
  viabilidade_financeira: {
    ticket_medio_servico: "R$ 350,00 a R$ 1.200,00 por serviço elétrico",
    ltv_anual_estimado: "R$ 4.200,00 a R$ 14.400,00 por cliente recorrente/indicação",
    ponto_de_equilibrio: "Apenas 1 a 2 serviços residenciais já cobrem 100% da taxa de otimização única.",
    cenarios: [
      {
        cenario: "Conservador",
        investimento: "R$ 600,00 (único)",
        novos_clientes_mes: "2 serviços",
        receita_bruta_mes: "R$ 700,00",
        ltv_anual_12m: "R$ 8.400,00",
        roi_estimado: "1.300%"
      },
      {
        cenario: "Realista",
        investimento: "R$ 600,00 (único)",
        novos_clientes_mes: "5 serviços",
        receita_bruta_mes: "R$ 1.750,00",
        ltv_anual_12m: "R$ 21.000,00",
        roi_estimado: "3.400%"
      }
    ]
  },
  condicao_comercial: {
    servico: "Destravamento, Alinhamento de Marca e Otimização no Maps",
    valor_proposta: "R$ 600,00",
    modelo: "Taxa Única de Otimização (Prazo: 7 dias úteis)",
    planos_acompanhamento_opcionais: {
      mensal: "R$ 450,00 / mês"
    },
    garantia: {
      prazo_dias: 60,
      descricao: "Compromisso de Risco Zero & Garantia de 60 Dias: Garantia de 60 dias com suporte e novos ajustes sem custo até consolidação dos resultados de tráfego e contatos."
    }
  },
  scripts_comerciais_whatsapp: {
    mensagem_2_diagnostico: `Analisando o perfil da Eletro Rodrigues no Google Maps e Instagram, identificamos 3 rupturas graves que fazem clientes de Goiânia fecharem com concorrentes:

1️⃣ Conflito de grafia no nome (@eletro_rodriguez com Z no Insta vs Eletro Rodrigues no Maps) — isso quebra a correspondência e autoridade no motor de busca do Google.

2️⃣ Perfil marcado como 'não atende no local' — o algoritmo reduz seu raio de alcance e espanta clientes que precisam de visita técnica urgente.

3️⃣ Ausência de botão direto de WhatsApp no Maps — quem precisa de eletricista com pressa desiste ao cair em páginas intermediárias.

Arrumando esses 3 pontos, seus chamados diretos no WhatsApp aumentam imediatamente. ⚡`,
    cta_transicao: `Consegue ver como esses pequenos detalhes cadastrais fazem os orçamentos de Goiânia irem direto pros concorrentes? Posso te mandar o plano rápido de correção que preparei?`,
    mensagem_3_fechamento: `Então, Rodrigo. Por apenas R$ 600 (taxa única de otimização, de R$ 1.200 por R$ 600), faço toda a correção cadastral, alinhamento de marca, ativação do WhatsApp nativo e blindagem de avaliações em até 7 dias úteis:

✅ Correção do nome e padronização NAP
✅ Habilitação de visita a domicílio no Google
✅ Inserção do botão direto de WhatsApp (wa.me)
✅ Resposta técnica e blindagem de queixas no perfil
✅ Upload de fotos de fiações com geolocalização

E o melhor: com apenas 1 a 2 chamados elétricos executados você já recupera 100% do investimento. Além disso, dou Garantia de 60 Dias — se não houver aumento de contatos, continuo ajustando sem custo extra.

Podemos dar o start hoje?`,
    banco_de_objecoes: {
      "o_que_faz_exatamente": "Eu sou especialista em Google Business Profile para prestadores de serviços técnicos. Arrumo seu cadastro no Maps, ativo o botão direto do WhatsApp, habilito o raio de atendimento domiciliar em Goiânia, organizo suas fotos e crio um sistema para coletar novas avaliações positivas após cada serviço.",
      "ja_temos_instagram": "O Instagram de vocês mostra o trabalho excelente que executam nas obras. Mas quem tem uma emergência de fiação ou curto-circuito em Goiânia pesquisa direto no Google Maps! Se no Google o cadastro fala que não atende no local, o cliente fecha com outro eletricista na hora.",
      "ja_temos_agencia": "Agências focam em posts de redes sociais. Eu faço a engenharia técnica e o SEO Local do Google Maps para fazer seu telefone tocar com chamados reais na sua região. É um serviço especializado e complementar.",
      "deixa_eu_pensar": "Tranquilo! Só lembre que enquanto o perfil estiver como 'não atende no local' e com o WhatsApp escondido, os clientes que pesquisam eletricista no Google continuarão chamando os concorrentes. Essa taxa de R$ 600 se paga no primeiro serviço prestado.",
      "quanto_custa": "Valor único de R$ 600 (de R$ 1.200 por R$ 600 nesta condição). Sem mensalidade, sem fidelidade. Entrego tudo pronto e configurado em 7 dias úteis.",
      "e_caro": "Um único serviço de fiação ou instalação de padrão residencial em Goiânia custa entre R$ 350 e R$ 1.200. Ou seja, no primeiro serviço que entrar pelo Google Maps otimizado, você já recupera 100% dos R$ 600.",
      "nao_temos_tempo": "Você não precisa gastar tempo. Você foca nos atendimentos e eu faço 100% da parte técnica e cadastral no Google. Só preciso das informações básicas dos seus serviços."
    },
    cases_autoridade: [
      {
        cliente: "Instituto SerClin",
        resultado: "Redução do Custo por Clique (CPC) no Google Ads de R$ 2,89 para R$ 0,18 com otimização técnica contínua."
      },
      {
        cliente: "Jucelino Castro Fisioterapia",
        resultado: "Crescimento de 70,6% em pedidos de rota no GPS e consolidação de demanda direta no Bosque."
      }
    ]
  }
};

// Default is Ju Lopes Estética as requested in the current context
export const defaultProposalData: CommercialProposalData = juLopesProposalData;
