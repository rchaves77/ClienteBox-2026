import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import fs from 'fs';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        // Headers CORS & Content-Type
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        res.setHeader('Content-Type', 'application/json');

        const storeFile = path.join(process.cwd(), 'data_store.json');
        let storeData: any = { gestores: [], companies: {}, onboardingSubmissions: [] };
        try {
          if (fs.existsSync(storeFile)) {
            storeData = JSON.parse(fs.readFileSync(storeFile, 'utf-8'));
          }
        } catch (e) {
          console.warn('[Vite API Plugin] Leitura local:', e);
        }

        // 1. GET / POST /api/companies
        if (req.url.startsWith('/api/companies') || req.url.startsWith('/api/company')) {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(storeData.companies || {}));
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const comp = JSON.parse(body);
                if (comp && comp.id) {
                  if (!storeData.companies) storeData.companies = {};
                  storeData.companies[comp.id] = comp;
                  fs.writeFileSync(storeFile, JSON.stringify(storeData, null, 2));
                }
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, company: comp }));
              } catch {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              }
            });
            return;
          }
        }

        // 2. GET / POST /api/onboarding-submissions
        if (req.url.startsWith('/api/onboarding-submissions') || req.url.startsWith('/api/onboarding-submission')) {
          if (req.method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(storeData.onboardingSubmissions || []));
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const sub = JSON.parse(body);
                if (!storeData.onboardingSubmissions) storeData.onboardingSubmissions = [];
                storeData.onboardingSubmissions.unshift(sub);
                fs.writeFileSync(storeFile, JSON.stringify(storeData, null, 2));
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, submission: sub }));
              } catch {
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true }));
              }
            });
            return;
          }
        }

        // 3. POST /api/scan-competitors
        if (req.url.startsWith('/api/scan-competitors') || req.url.startsWith('/api/scan-competitor')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            let parsed: any = {};
            try { parsed = JSON.parse(body); } catch {}
            const ticket = Number(parsed.ticketMedio || 250);
            const reviews = Number(parsed.avaliacoes || 12);
            const lost = Math.max(5, Math.round(35 - (reviews * 0.4)));
            const lostVal = lost * ticket;

            res.statusCode = 200;
            return res.end(JSON.stringify({
              empresa_analisada: {
                nome: parsed.empresa || "Sua Empresa",
                cidade: parsed.cidade || "Goiânia / GO",
                nicho: parsed.nicho || "Estética & Saúde",
                status_posicionamento: "Oportunidade no Google Maps",
                risco_perda: "Alto"
              },
              concorrentes_reais: [
                {
                  nome: `Concorrente Líder em ${parsed.cidade || 'Goiânia'}`,
                  nota: 5.0,
                  avaliacoes: 120,
                  endereco_bairro: `Setor Nobre / ${parsed.cidade || 'Goiânia'}`,
                  pontos_fortes: "Top 1 no Google Maps com atração diária de rotas"
                }
              ],
              estimativa_perdas: {
                clientes_perdidos_mes: lost,
                faturamento_perdido_mes: lostVal,
                faturamento_perdido_anual: lostVal * 12,
                diagnostico_resumo: `Sua empresa possui ${reviews} avaliações enquanto os líderes acumulam mais de 80 avaliações.`
              }
            }));
          });
          return;
        }

        // Fallback genérico para qualquer outra rota /api
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: 'API Ok' }));
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
