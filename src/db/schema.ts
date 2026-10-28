import { pgTable, serial, text, boolean, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

// Tabela de gestores/administradores com acesso ao painel do site
export const gestores = pgTable('gestores', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(), // Firebase UID se autenticado via Google
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  telefone: text('telefone').default(''), // Telefone / WhatsApp para SMS / recuperação de senha
  senhaHash: text('senha_hash'), // Hash bcrypt para login direto com e-mail e senha
  role: text('role').default('admin').notNull(), // 'superadmin', 'admin', 'gestor'
  ativo: boolean('ativo').default(true).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  ultimoAcesso: timestamp('ultimo_acesso'),
});

// Tabela de formulários de cadastro/otimização enviados por empresas públicas
export const onboardingSubmissions = pgTable('onboarding_submissions', {
  id: text('id').primaryKey(),
  responsavelNome: text('responsavel_nome').notNull(),
  responsavelTelefone: text('responsavel_telefone').notNull(),
  responsavelEmail: text('responsavel_email').notNull(),
  nomeEmpresa: text('nome_empresa').notNull(),
  niches: jsonb('niches').notNull(), // Array de nichos selecionados
  customNiche: text('custom_niche').default(''),
  dadosCompletos: jsonb('dados_completos').notNull(), // JSON completo do formulário
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

// Tabela de empresas sob gestão ClienteBox
export const companies = pgTable('companies', {
  id: text('id').primaryKey(), // ID em formato string (ex: 'sorriso-vitals')
  nome: text('nome').notNull(),
  responsavel: text('responsavel').default(''),
  categoria: text('categoria').default(''),
  endereco: text('endereco').default(''),
  ltv: integer('ltv').default(0),
  pixChave: text('pix_chave').default(''),
  pixFavorecido: text('pix_favorecido').default(''),
  pixBanco: text('pix_banco').default(''),
  periodo: text('periodo').default(''),
  ciclo: text('ciclo').default(''),
  dataIntervencao: text('data_intervencao').default(''),
  metricasAnterior: jsonb('metricas_anterior').notNull(),
  metricasAtual: jsonb('metricas_atual').notNull(),
  acoes: jsonb('acoes').notNull(),
  proximosPassos: jsonb('proximos_passos').notNull(),
  concorrentes: jsonb('concorrentes').notNull(),
  diagnosticoCustom: text('diagnostico_custom').default(''),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  atualizadoEm: timestamp('atualizado_em').defaultNow().notNull(),
});
