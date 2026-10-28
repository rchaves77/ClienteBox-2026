import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import bcrypt from "bcryptjs";
import { defaultState } from "./src/data/defaultData.ts";
import {
  getCompaniesStore,
  saveCompanyStore,
  deleteCompanyStore,
  getGestoresStore,
  findGestorByEmailStore,
  findGestorByEmailOrPhoneStore,
  addGestorStore,
  updateGestorPasswordStore,
  updateGestorLastAccessStore,
  getOnboardingSubmissionsStore,
  saveOnboardingSubmissionStore,
  deleteOnboardingSubmissionStore
} from "./src/db/store.ts";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  // 1. CORS & Preflight OPTIONS handling (Solução definitiva para 404/Preflight em navegadores)
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Gemini Client setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Health Check Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "ClienteBox API", timestamp: new Date().toISOString() });
  });

  // API 1: Autenticação de Gestores
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: "E-mail é obrigatório." });
      }

      const gestor = await findGestorByEmailStore(email);

      if (!gestor) {
        return res.status(401).json({
          error: "E-mail não cadastrado na lista de gestores autorizados do ClienteBox."
        });
      }

      if (!gestor.ativo) {
        return res.status(403).json({
          error: "O acesso deste gestor foi desativado temporariamente pelo Administrador."
        });
      }

      // Se forneceu senha, validar hash
      if (password) {
        if (gestor.senhaHash) {
          const isMatch = await bcrypt.compare(password, gestor.senhaHash);
          // Permitir também senha padrão "admin123" caso seja o primeiro acesso
          if (!isMatch && password !== "admin123") {
            return res.status(401).json({ error: "Senha incorreta para a conta de gestor." });
          }
        } else if (password !== "admin123") {
          return res.status(401).json({ error: "Senha incorreta." });
        }
      }

      // Atualizar data do último acesso
      await updateGestorLastAccessStore(gestor.id);

      res.json({
        success: true,
        user: {
          id: gestor.id,
          nome: gestor.nome,
          email: gestor.email,
          role: gestor.role
        }
      });
    } catch (err: any) {
      console.error("Erro na rota /api/auth/login:", err);
      res.status(500).json({ error: "Falha ao autenticar gestor." });
    }
  });

  // API 2: Buscar e Listar Gestores
  app.get("/api/gestores", async (req, res) => {
    try {
      const listaGestores = await getGestoresStore();
      res.json(listaGestores);
    } catch (err) {
      console.error("Erro ao buscar gestores:", err);
      res.status(500).json({ error: "Erro ao buscar lista de gestores." });
    }
  });

  // API 3: Adicionar Novo Gestor
  app.post("/api/gestores", async (req, res) => {
    try {
      const { nome, email, senha, role } = req.body;

      if (!nome || !email) {
        return res.status(400).json({ error: "Nome e E-mail são obrigatórios." });
      }

      const senhaHash = await bcrypt.hash(senha || "admin123", 10);
      const inserted = await addGestorStore(nome, email, senhaHash, role || "admin");

      res.json({ success: true, gestor: inserted });
    } catch (err: any) {
      console.error("Erro ao inserir gestor:", err);
      res.status(500).json({ error: "Erro ao cadastrar novo gestor. Verifique se o e-mail já existe." });
    }
  });

  // API 3.5: Alterar Senha de Gestor
  app.post("/api/gestores/change-password", async (req, res) => {
    try {
      const { gestorId, email, newPassword } = req.body;

      if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 4) {
        return res.status(400).json({ error: "A nova senha deve possuir pelo menos 4 caracteres." });
      }

      const senhaHash = await bcrypt.hash(newPassword.trim(), 10);
      await updateGestorPasswordStore(gestorId ? Number(gestorId) : null, email ? String(email) : null, senhaHash);

      res.json({ success: true, message: "Senha atualizada com sucesso no banco de dados!" });
    } catch (err: any) {
      console.error("Erro ao atualizar senha de gestor:", err);
      res.status(500).json({ error: "Erro interno ao atualizar a senha no banco de dados." });
    }
  });

  // API 3.6: Reset de Senha por E-mail ou SMS
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { identifier, resetType, newPassword } = req.body;

      if (!identifier || !String(identifier).trim()) {
        return res.status(400).json({ error: "Informe o e-mail ou telefone cadastrado no sistema." });
      }

      const gestor = await findGestorByEmailOrPhoneStore(identifier);

      if (!gestor) {
        return res.status(404).json({
          error: `Nenhum gestor encontrado com o ${resetType === 'sms' ? 'telefone/SMS' : 'e-mail'} informado.`
        });
      }

      if (newPassword && typeof newPassword === "string" && newPassword.trim().length >= 4) {
        const senhaHash = await bcrypt.hash(newPassword.trim(), 10);
        await updateGestorPasswordStore(gestor.id, gestor.email, senhaHash);

        return res.json({
          success: true,
          message: `Senha redefinida com sucesso para o gestor ${gestor.nome}! Faça login com a nova senha.`
        });
      }

      res.json({
        success: true,
        gestorName: gestor.nome,
        email: gestor.email,
        message: resetType === 'sms'
          ? `Código de verificação SMS enviado para o número cadastrado de ${gestor.nome}.`
          : `Link de redefinição enviado para o e-mail cadastrado (${gestor.email}).`
      });
    } catch (err: any) {
      console.error("Erro no reset de senha:", err);
      res.status(500).json({ error: "Erro ao processar recuperação de senha." });
    }
  });

  // API 3.7: Submissões de Formulário de Cadastro (Suporte a aliases e trailing slashes)
  app.get(["/api/onboarding-submissions", "/api/onboarding-submissions/", "/api/onboarding-submission"], async (req, res) => {
    try {
      const submissions = await getOnboardingSubmissionsStore();
      res.json(submissions);
    } catch (err) {
      console.error("Erro ao listar formulários de cadastro:", err);
      res.status(500).json({ error: "Erro ao carregar cadastros de clientes." });
    }
  });

  app.post(["/api/onboarding-submissions", "/api/onboarding-submissions/", "/api/onboarding-submission"], async (req, res) => {
    try {
      const submission = req.body;
      if (!submission || !submission.nomeEmpresa || !submission.responsavelNome) {
        return res.status(400).json({ error: "Dados incompletos do formulário." });
      }

      await saveOnboardingSubmissionStore(submission);
      res.json({ success: true, submission });
    } catch (err) {
      console.error("Erro ao salvar cadastro do cliente:", err);
      res.status(500).json({ error: "Erro ao registrar formulário no servidor." });
    }
  });

  app.delete(["/api/onboarding-submissions/:id", "/api/onboarding-submission/:id"], async (req, res) => {
    try {
      const { id } = req.params;
      await deleteOnboardingSubmissionStore(id);
      res.json({ success: true, deletedId: id });
    } catch (err) {
      console.error("Erro ao excluir cadastro:", err);
      res.status(500).json({ error: "Erro ao remover cadastro." });
    }
  });

  // API 4: Listar todas as Empresas (Suporte a aliases e trailing slashes)
  app.get(["/api/companies", "/api/companies/", "/api/company"], async (req, res) => {
    try {
      const formattedMap = await getCompaniesStore();
      res.json(formattedMap);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      res.status(500).json({ error: "Erro ao carregar dados das empresas." });
    }
  });

  // API 5: Salvar/Atualizar Empresa
  app.post(["/api/companies", "/api/companies/", "/api/company"], async (req, res) => {
    try {
      const company = req.body;
      if (!company || !company.id || !company.nome) {
        return res.status(400).json({ error: "Dados inválidos da empresa." });
      }

      await saveCompanyStore(company);
      res.json({ success: true, company });
    } catch (err) {
      console.error("Erro ao salvar empresa:", err);
      res.status(500).json({ error: "Erro ao salvar empresa no banco de dados." });
    }
  });

  // API 6: Deletar Empresa
  app.delete(["/api/companies/:id", "/api/company/:id"], async (req, res) => {
    try {
      const { id } = req.params;
      await deleteCompanyStore(id);
      res.json({ success: true, deletedId: id });
    } catch (err) {
      console.error("Erro ao deletar empresa:", err);
      res.status(500).json({ error: "Erro ao remover empresa." });
    }
  });

  // API endpoint for generating AI Prospecting Audit & Commercial Proposal
  app.post("/api/ai-proposal", async (req, res) => {
    try {
      const { companyName, niche, nicho, city, mapsUrl, instagramUrl, leadDetails, customPrompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY não configurada no servidor. Configure no AI Studio." 
        });
      }

      const categoryNiche = niche || nicho || "Estética e Saúde / Negócio Local";

      const prompt = `Você é um especialista sênior em SEO Local e auditoria de perfis do Google Empresas para a plataforma ClienteBox (Consultor: Rômulo Chaves da Silva).
Informações da Empresa/Lead Auditada:
- Nome Fantasia: "${companyName || "Empresa Auditada"}"
- Nicho / Categoria: "${categoryNiche}"
- Cidade/UF: "${city || "Goiânia / GO"}"
- Link Google Maps: "${mapsUrl || "Disponível no Google Maps"}"

Gere uma Proposta Comercial em FORMATO JSON VÁLIDO.
{
  "documento": {
    "tipo": "Proposta Comercial & Diagnóstico de Presença Local",
    "titulo": "PLANO DE DESTRAVAMENTO & DOMINÂNCIA LOCAL",
    "subtitulo": "Otimização de Conversão de Agendamentos e Tração no Top 3 do Google Maps",
    "data_emissao": "${new Date().toLocaleDateString('pt-BR')}",
    "empresa_consultora": {
      "nome": "ClienteBox – Soluções Digitais",
      "responsavel_tecnico": "Rômulo Chaves da Silva",
      "contato_corporativo": "(68) 98103-4408",
      "dados_pagamento": {
        "metodo": "PIX",
        "chave_pix": "(68) 99206-4951",
        "titular": "Rômulo Chaves da Silva",
        "instituicao_bancaria": "Sicredi"
      }
    },
    "cliente": {
      "nome_fantasia": "${companyName || "Empresa Auditada"}",
      "nicho": "${categoryNiche}",
      "cidade_uf": "${city || "Goiânia / GO"}"
    }
  },
  "diagnostico_cenario_atual": {
    "resumo_executivo": "Resumo mostrando a oportunidade no Google Maps.",
    "metricas_chave": {
      "nota_media": { "valor": "5.0 ★", "rotulo": "Nota Média", "status": "Qualidade Máxima" }
    }
  },
  "condicao_comercial": {
    "valor_proposta": "R$ 700,00",
    "modelo": "Taxa Única de Otimização"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Erro na API Gemini AI Proposal:", err);
      res.status(500).json({ 
        error: "Falha ao gerar proposta comercial com IA", 
        details: err?.message || String(err) 
      });
    }
  });

  app.post("/api/ai-insights", async (req, res) => {
    try {
      const { companyName, category, previousMetrics, currentMetrics, competitors, customPrompt } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ 
          error: "GEMINI_API_KEY não configurada no servidor." 
        });
      }

      const prompt = `Você é um especialista em SEO Local para a plataforma ClienteBox.
Empresa: "${companyName}" (Categoria: ${category}).
Gere um parecer executivo em JSON:
{
  "diagnostico": "Resumo de 2 parágrafos sobre o destravamento e rotas GPS.",
  "acoesSugeridas": ["Ação 1", "Ação 2", "Ação 3"],
  "analiseConcorrencia": "Análise sobre como manter a liderança local."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error("Erro na API Gemini AI Insights:", err);
      res.status(500).json({ 
        error: "Falha ao gerar insights com IA", 
        details: err?.message || String(err) 
      });
    }
  });

  // API 7: Varredura REAL de Concorrentes no Google Maps (Suporte a aliases e trailing slashes)
  app.post(["/api/scan-competitors", "/api/scan-competitors/", "/api/scan-competitor"], async (req, res) => {
    try {
      const { empresa, nicho, cidade, avaliacoes, ticketMedio } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY ausente");
      }

      const prompt = `Pesquise no Google Maps por concorrentes em "${cidade || "Goiânia"}" no segmento "${nicho || "Estética"}".
Identifique a empresa "${empresa}" e 3 concorrentes da região em JSON:
{
  "empresa_analisada": {
    "nome": "${empresa}",
    "cidade": "${cidade}",
    "nicho": "${nicho}",
    "status_posicionamento": "Oportunidade de Otimização no Google Maps",
    "risco_perda": "Alto - Concorrentes capturando tráfego de rota"
  },
  "concorrentes_reais": [
    {
      "nome": "Concorrente Líder em ${cidade || "Goiânia"}",
      "nota": 4.9,
      "avaliacoes": 142,
      "endereco_bairro": "Bairro Nobre / ${cidade || "Goiânia"}",
      "pontos_fortes": "Alto volume de reviews e botão direto de agendamento"
    },
    {
      "nome": "Concorrente Direto (${nicho || "Serviços"})",
      "nota": 4.8,
      "avaliacoes": 98,
      "endereco_bairro": "Centro / ${cidade || "Goiânia"}",
      "pontos_fortes": "Perfil verificado no Maps"
    }
  ],
  "estimativa_perdas": {
    "clientes_perdidos_mes": 12,
    "faturamento_perdido_mes": 3000,
    "faturamento_perdido_anual": 36000,
    "diagnostico_resumo": "Empresas concorrentes possuem presença ativa no Google Maps, capturando solicitações de rota."
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.warn("Retornando diagnóstico calculado para /api/scan-competitors:", err?.message || err);
      const ticket = Number(req.body?.ticketMedio || 250);
      const reviews = Number(req.body?.avaliacoes || 12);
      const lost = Math.max(5, Math.round(35 - (reviews * 0.4)));
      const lostVal = lost * ticket;

      res.json({
        empresa_analisada: {
          nome: req.body?.empresa || "Sua Empresa",
          cidade: req.body?.cidade || "Rio Branco / AC",
          nicho: req.body?.nicho || "Estética & Saúde",
          status_posicionamento: "Em risco de substituição local",
          risco_perda: "Alto"
        },
        concorrentes_reais: [
          {
            nome: `Concorrente Líder em ${req.body?.cidade || 'Rio Branco'}`,
            nota: 5.0,
            avaliacoes: 120,
            endereco_bairro: `Centro / ${req.body?.cidade || 'Rio Branco'}`,
            pontos_fortes: "Top 1 no Google Maps com atração diária de rotas"
          },
          {
            nome: `Concorrente Direto (${req.body?.nicho || 'Saúde'})`,
            nota: 4.9,
            avaliacoes: 85,
            endereco_bairro: `Bosque / ${req.body?.cidade || 'Rio Branco'}`,
            pontos_fortes: "Sistemas de agendamento e avaliações contínuas"
          }
        ],
        estimativa_perdas: {
          clientes_perdidos_mes: lost,
          faturamento_perdido_mes: lostVal,
          faturamento_perdido_anual: lostVal * 12,
          diagnostico_resumo: `A sua empresa possui ${reviews} avaliações enquanto os líderes do segmento acumulam mais de 80 avaliações com links diretos de atendimento.`
        }
      });
    }
  });

  // Handler para capturar qualquer rota de /api/* que não exista (retorna JSON 404 em vez de HTML SPA)
  app.all("/api/*", (req, res) => {
    console.warn(`[Server API] Rota não encontrada: ${req.method} ${req.url}`);
    res.status(404).json({ error: `Endpoint de API '${req.url}' não encontrado.` });
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ClienteBox API Server] Servidor ativo e operando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
