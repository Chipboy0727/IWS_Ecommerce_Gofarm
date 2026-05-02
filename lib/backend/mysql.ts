import mysql from "mysql2/promise";

type MysqlConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
};

let pool: mysql.Pool | null = null;

function parseMysqlUrl(value: string): MysqlConfig | null {
  try {
    const url = new URL(value);
    if (!url.protocol.startsWith("mysql")) return null;
    const database = url.pathname.replace(/^\//, "");
    if (!url.hostname || !url.username || !database) return null;
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database,
      ssl: url.protocol === "mysqls:" || url.searchParams.get("ssl") === "true",
    };
  } catch {
    return null;
  }
}

function resolveMysqlConfig(): MysqlConfig | null {
  const url = process.env.MYSQL_URL ?? process.env.DATABASE_URL;
  if (url) return parseMysqlUrl(url);

  const host = process.env.MYSQL_HOST?.trim() ?? "";
  const user = process.env.MYSQL_USER?.trim() ?? "";
  const database = process.env.MYSQL_DATABASE?.trim() ?? "";
  if (!host || !user || !database) return null;

  return {
    host,
    port: Number.parseInt(process.env.MYSQL_PORT ?? "3306", 10) || 3306,
    user,
    password: process.env.MYSQL_PASSWORD ?? "",
    database,
    ssl: process.env.MYSQL_SSL === "true",
  };
}


export function getMysqlPool() {
  if (pool) return pool;
  const config = resolveMysqlConfig();
  if (!config) return null;

  pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
}

