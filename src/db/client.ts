import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import Database from "better-sqlite3";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import { SEED_STORES, seedDatabase } from "./seed";

export type Db = BetterSQLite3Database<typeof schema>;

const MIGRATIONS_DIR = join(process.cwd(), "drizzle");

/** Opens (and if needed migrates and seeds) a database. `:memory:` gives an isolated test DB. */
export function openDatabase(path: string): Db {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  // Several Next build workers can open the file at once; wait instead of failing.
  sqlite.pragma("busy_timeout = 5000");

  const db = drizzle({ client: sqlite, schema });
  migrate(db, { migrationsFolder: MIGRATIONS_DIR });
  const [row] = db.select({ n: count() }).from(schema.stores).all();
  if (row?.n === 0) seedDatabase(db, SEED_STORES);
  return db;
}

const globalForDb = globalThis as typeof globalThis & { storefrontDb?: Db };

/** One connection per server process (survives dev hot reloads). */
export function getDb(): Db {
  globalForDb.storefrontDb ??= openDatabase(process.env.DATABASE_PATH ?? "data/store.db");
  return globalForDb.storefrontDb;
}
