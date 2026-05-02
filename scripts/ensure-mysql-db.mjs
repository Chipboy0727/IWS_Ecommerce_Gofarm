/**
 * Creates MYSQL_DATABASE if missing (reads .env from project root).
 * Run: npm run db:ensure
 */
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const host = process.env.MYSQL_HOST?.trim() || "127.0.0.1";
const port = Number.parseInt(process.env.MYSQL_PORT || "3306", 10) || 3306;
const user = process.env.MYSQL_USER?.trim();
const password = process.env.MYSQL_PASSWORD ?? "";
const database = process.env.MYSQL_DATABASE?.trim() || "gofarm";

if (!user) {
  console.error("Missing MYSQL_USER in .env");
  process.exit(1);
}

if (!/^[a-zA-Z0-9_]+$/.test(database)) {
  console.error("Invalid MYSQL_DATABASE name (use letters, numbers, underscore only).");
  process.exit(1);
}

let conn;
try {
  conn = await mysql.createConnection({ host, port, user, password });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`[db:ensure] Database "${database}" is ready on ${host}:${port}.`);
} catch (err) {
  console.error("[db:ensure] Connection failed. Check MySQL is running and .env credentials.");
  console.error(err.message || err);
  process.exit(1);
} finally {
  if (conn) await conn.end().catch(() => {});
}
