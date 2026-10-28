import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const getSqlHost = () => {
  let host = process.env.SQL_HOST;
  if (host && host.startsWith('/app/cloudsql') && !fs.existsSync(host)) {
    if (fs.existsSync('/app/cloudsql')) {
      const dirs = fs.readdirSync('/app/cloudsql');
      if (dirs.length > 0) {
        host = '/app/cloudsql/' + dirs[0];
      }
    }
  }
  return host;
};

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: getSqlHost(),
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
