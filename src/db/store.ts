import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { db } from './index.ts';
import { gestores, companies } from './schema.ts';
import { eq } from 'drizzle-orm';
import { defaultState } from '../data/defaultData.ts';

const STORE_FILE = path.join(process.cwd(), 'data_store.json');

interface GestorItem {
  id: number;
  uid?: string | null;
  nome: string;
  email: string;
  telefone?: string;
  senhaHash: string | null;
  role: string;
  ativo: boolean;
  criadoEm: any;
  ultimoAcesso?: any;
}

interface LocalStoreData {
  gestores: GestorItem[];
  companies: Record<string, any>;
  onboardingSubmissions: any[];
}

function loadLocalStore(): LocalStoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.onboardingSubmissions) parsed.onboardingSubmissions = [];
      return parsed;
    }
  } catch (e) {
    console.warn('[Store] Erro ao ler armazenamento local, reinicializando...', e);
  }

  // Initial default store
  const defaultGestorHash = bcrypt.hashSync('admin123', 10);
  const initial: LocalStoreData = {
    gestores: [
      {
        id: 1,
        nome: 'ClienteBox Admin',
        email: 'clienteboxplus@gmail.com',
        telefone: '(68) 98103-4408',
        senhaHash: defaultGestorHash,
        role: 'superadmin',
        ativo: true,
        criadoEm: new Date().toISOString(),
        ultimoAcesso: null,
      },
      {
        id: 2,
        nome: 'Rômulo Chaves',
        email: 'romulochaves77@gmail.com',
        telefone: '(68) 98103-4408',
        senhaHash: defaultGestorHash,
        role: 'superadmin',
        ativo: true,
        criadoEm: new Date().toISOString(),
        ultimoAcesso: null,
      },
    ],
    companies: defaultState.companies,
    onboardingSubmissions: [],
  };

  saveLocalStore(initial);
  return initial;
}

function saveLocalStore(data: LocalStoreData) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Store] Erro ao salvar armazenamento local:', e);
  }
}

// Helper to safely execute a DB operation with fallback
async function withDbFallback<T>(
  dbAction: () => Promise<T>,
  fallbackAction: () => Promise<T>
): Promise<T> {
  try {
    return await dbAction();
  } catch (err: any) {
    // Quietly fallback on Cloud SQL errors
    return await fallbackAction();
  }
}

export async function getCompaniesStore(): Promise<Record<string, any>> {
  return withDbFallback(
    async () => {
      const dbCompanies = await db.select().from(companies);
      if (!dbCompanies || dbCompanies.length === 0) {
        // Seed default companies to Cloud SQL
        for (const comp of Object.values(defaultState.companies)) {
          await saveCompanyStore(comp);
        }
        return defaultState.companies;
      }
      const formattedMap: Record<string, any> = {};
      dbCompanies.forEach((c) => {
        formattedMap[c.id] = {
          id: c.id,
          nome: c.nome,
          responsavel: c.responsavel || '',
          categoria: c.categoria || '',
          endereco: c.endereco || '',
          ltv: c.ltv || 0,
          pixChave: c.pixChave || '',
          pixFavorecido: c.pixFavorecido || '',
          pixBanco: c.pixBanco || '',
          periodo: c.periodo || '',
          ciclo: c.ciclo || '',
          dataIntervencao: c.dataIntervencao || '',
          metricasAnterior: c.metricasAnterior,
          metricasAtual: c.metricasAtual,
          acoes: c.acoes,
          proximosPassos: c.proximosPassos,
          concorrentes: c.concorrentes,
          diagnosticoCustom: c.diagnosticoCustom || '',
        };
      });
      return formattedMap;
    },
    async () => {
      const store = loadLocalStore();
      return store.companies;
    }
  );
}

export async function saveCompanyStore(company: any): Promise<void> {
  await withDbFallback(
    async () => {
      await db
        .insert(companies)
        .values({
          id: company.id,
          nome: company.nome,
          responsavel: company.responsavel || '',
          categoria: company.categoria || '',
          endereco: company.endereco || '',
          ltv: company.ltv || 0,
          pixChave: company.pixChave || '',
          pixFavorecido: company.pixFavorecido || '',
          pixBanco: company.pixBanco || '',
          periodo: company.periodo || '',
          ciclo: company.ciclo || '',
          dataIntervencao: company.dataIntervencao || '',
          metricasAnterior: company.metricasAnterior,
          metricasAtual: company.metricasAtual,
          acoes: company.acoes,
          proximosPassos: company.proximosPassos,
          concorrentes: company.concorrentes,
          diagnosticoCustom: company.diagnosticoCustom || '',
          atualizadoEm: new Date(),
        })
        .onConflictDoUpdate({
          target: companies.id,
          set: {
            nome: company.nome,
            responsavel: company.responsavel || '',
            categoria: company.categoria || '',
            endereco: company.endereco || '',
            ltv: company.ltv || 0,
            pixChave: company.pixChave || '',
            pixFavorecido: company.pixFavorecido || '',
            pixBanco: company.pixBanco || '',
            periodo: company.periodo || '',
            ciclo: company.ciclo || '',
            dataIntervencao: company.dataIntervencao || '',
            metricasAnterior: company.metricasAnterior,
            metricasAtual: company.metricasAtual,
            acoes: company.acoes,
            proximosPassos: company.proximosPassos,
            concorrentes: company.concorrentes,
            diagnosticoCustom: company.diagnosticoCustom || '',
            atualizadoEm: new Date(),
          },
        });
    },
    async () => {
      const store = loadLocalStore();
      store.companies[company.id] = company;
      saveLocalStore(store);
    }
  );
}

export async function deleteCompanyStore(id: string): Promise<void> {
  await withDbFallback(
    async () => {
      await db.delete(companies).where(eq(companies.id, id));
    },
    async () => {
      const store = loadLocalStore();
      delete store.companies[id];
      saveLocalStore(store);
    }
  );
}

export async function getGestoresStore(): Promise<any[]> {
  return withDbFallback<any[]>(
    async () => {
      const dbGestores = await db
        .select({
          id: gestores.id,
          nome: gestores.nome,
          email: gestores.email,
          role: gestores.role,
          ativo: gestores.ativo,
          criadoEm: gestores.criadoEm,
          ultimoAcesso: gestores.ultimoAcesso,
        })
        .from(gestores);
      return dbGestores;
    },
    async () => {
      const store = loadLocalStore();
      return store.gestores.map((g) => ({
        id: g.id,
        nome: g.nome,
        email: g.email,
        role: g.role,
        ativo: g.ativo,
        criadoEm: g.criadoEm,
        ultimoAcesso: g.ultimoAcesso,
      }));
    }
  );
}

export async function findGestorByEmailStore(email: string): Promise<any | null> {
  const formattedEmail = String(email).trim().toLowerCase();
  return withDbFallback<any | null>(
    async () => {
      const res = await db.select().from(gestores).where(eq(gestores.email, formattedEmail));
      return res[0] || null;
    },
    async () => {
      const store = loadLocalStore();
      return store.gestores.find((g) => g.email.toLowerCase() === formattedEmail) || null;
    }
  );
}

export async function addGestorStore(
  nome: string,
  email: string,
  senhaHash: string,
  role: string = 'admin'
): Promise<any> {
  const formattedEmail = String(email).trim().toLowerCase();
  return withDbFallback<any>(
    async () => {
      const inserted = await db
        .insert(gestores)
        .values({
          nome,
          email: formattedEmail,
          senhaHash,
          role,
          ativo: true,
        })
        .returning();
      return inserted[0];
    },
    async () => {
      const store = loadLocalStore();
      const newId = store.gestores.length > 0 ? Math.max(...store.gestores.map((g) => g.id)) + 1 : 1;
      const newGestor: GestorItem = {
        id: newId,
        nome,
        email: formattedEmail,
        senhaHash,
        role,
        ativo: true,
        criadoEm: new Date().toISOString(),
      };
      store.gestores.push(newGestor);
      saveLocalStore(store);
      return newGestor;
    }
  );
}

export async function updateGestorPasswordStore(
  gestorId: number | null,
  email: string | null,
  senhaHash: string
): Promise<void> {
  await withDbFallback(
    async () => {
      if (gestorId) {
        await db.update(gestores).set({ senhaHash }).where(eq(gestores.id, gestorId));
      } else if (email) {
        await db.update(gestores).set({ senhaHash }).where(eq(gestores.email, email.trim().toLowerCase()));
      } else {
        await db.update(gestores).set({ senhaHash });
      }
    },
    async () => {
      const store = loadLocalStore();
      if (gestorId) {
        const g = store.gestores.find((x) => x.id === gestorId);
        if (g) g.senhaHash = senhaHash;
      } else if (email) {
        const formatted = email.trim().toLowerCase();
        const g = store.gestores.find((x) => x.email.toLowerCase() === formatted);
        if (g) g.senhaHash = senhaHash;
      } else {
        store.gestores.forEach((g) => (g.senhaHash = senhaHash));
      }
      saveLocalStore(store);
    }
  );
}

export async function updateGestorLastAccessStore(id: number): Promise<void> {
  await withDbFallback(
    async () => {
      await db.update(gestores).set({ ultimoAcesso: new Date() }).where(eq(gestores.id, id));
    },
    async () => {
      const store = loadLocalStore();
      const g = store.gestores.find((x) => x.id === id);
      if (g) {
        g.ultimoAcesso = new Date().toISOString();
        saveLocalStore(store);
      }
    }
  );
}

export async function findGestorByEmailOrPhoneStore(identifier: string): Promise<any | null> {
  const query = String(identifier).trim().toLowerCase();
  const digitsOnly = query.replace(/\D/g, '');

  return withDbFallback<any | null>(
    async () => {
      const res = await db.select().from(gestores);
      return res.find((g) => {
        const emailMatch = g.email && g.email.toLowerCase() === query;
        const phoneDigits = g.telefone ? g.telefone.replace(/\D/g, '') : '';
        const phoneMatch = digitsOnly.length >= 8 && phoneDigits.includes(digitsOnly);
        return emailMatch || phoneMatch;
      }) || null;
    },
    async () => {
      const store = loadLocalStore();
      return store.gestores.find((g) => {
        const emailMatch = g.email && g.email.toLowerCase() === query;
        const phoneDigits = g.telefone ? g.telefone.replace(/\D/g, '') : '';
        const phoneMatch = digitsOnly.length >= 8 && phoneDigits.includes(digitsOnly);
        return emailMatch || phoneMatch;
      }) || null;
    }
  );
}

export async function getOnboardingSubmissionsStore(): Promise<any[]> {
  const store = loadLocalStore();
  return store.onboardingSubmissions || [];
}

export async function saveOnboardingSubmissionStore(submission: any): Promise<void> {
  const store = loadLocalStore();
  if (!store.onboardingSubmissions) store.onboardingSubmissions = [];
  store.onboardingSubmissions.unshift(submission);
  saveLocalStore(store);
}

export async function deleteOnboardingSubmissionStore(id: string): Promise<void> {
  const store = loadLocalStore();
  if (store.onboardingSubmissions) {
    store.onboardingSubmissions = store.onboardingSubmissions.filter((s) => s.id !== id);
    saveLocalStore(store);
  }
}
