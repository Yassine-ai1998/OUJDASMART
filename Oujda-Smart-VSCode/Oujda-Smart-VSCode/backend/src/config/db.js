import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import fs from "node:fs/promises";
import path from "node:path";
import { config, ROOT } from "./env.js";
const connection =
  config.mode === "embedded"
    ? new PGlite(process.env.DATA_DIR || path.join(ROOT, ".data"))
    : new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
export const query = (sql, params = []) => connection.query(sql, params);
export const rows = async (sql, params = []) => (await query(sql, params)).rows;
export const one = async (sql, params = []) => (await rows(sql, params))[0];
export async function tx(fn) {
  if (config.mode === "embedded")
    return connection.transaction((client) =>
      fn((q, p = []) => client.query(q, p)),
    );
  const client = await connection.connect();
  try {
    await client.query("BEGIN");
    const value = await fn((q, p = []) => client.query(q, p));
    await client.query("COMMIT");
    return value;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
export async function initialize() {
  const sql = await fs.readFile(path.join(ROOT, "sql/schema.sql"), "utf8");
  if (config.mode === "embedded") await connection.exec(sql);
  else await connection.query(sql);
}
export async function close() {
  if (config.mode === "embedded") await connection.close();
  else await connection.end();
}
