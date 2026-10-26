import { Pool } from "pg";

/** @type {import('pg').Pool | null} */
let pool = null;

export function databaseUrl() {
  return process.env.DATABASE_URL || "";
}

export function hasDatabase() {
  return Boolean(databaseUrl());
}

export function getPool() {
  const url = databaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 10,
      // Fail fast when DATABASE_URL is unreachable (rooms catalog still renders).
      connectionTimeoutMillis: Number(
        process.env.DATABASE_CONNECT_TIMEOUT_MS || 3000,
      ),
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return pool;
}

/**
 * @template T
 * @param {(client: import('pg').PoolClient) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTransaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * @param {string} text
 * @param {unknown[]} [params]
 */
export async function query(text, params = []) {
  return getPool().query(text, params);
}
