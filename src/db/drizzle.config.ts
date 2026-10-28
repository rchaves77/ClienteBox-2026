import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

let sqlHost = process.env.SQL_HOST;
if (sqlHost && sqlHost.startsWith("/app/cloudsql") && !fs.existsSync(sqlHost)) {
  if (fs.existsSync("/app/cloudsql")) {
    const dirs = fs.readdirSync("/app/cloudsql");
    if (dirs.length > 0) {
      sqlHost = "/app/cloudsql/" + dirs[0];
    }
  }
}

const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost) {
  throw new Error("SQL_HOST must be set in environment variables.");
}
if (!sqlDbName) {
  throw new Error("SQL_DB_NAME must be set in environment variables.");
}
if (!user) {
  throw new Error("SQL_ADMIN_USER must be set in environment variables.");
}
if (!password) {
  throw new Error("SQL_ADMIN_PASSWORD must be set in environment variables.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    host: sqlHost,
    user: user,
    password: password,
    database: sqlDbName,
    ssl: false,
  },
  verbose: true,
});
