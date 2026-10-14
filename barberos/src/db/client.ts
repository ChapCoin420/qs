import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.ts";

export type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { barberosPool?: Pool };

function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return url;
}

/** One pool per process (survives Next.js dev hot reloads). */
export function getDb(): Db {
  globalForDb.barberosPool ??= new Pool({ connectionString: databaseUrl(), max: 10 });
  return drizzle(globalForDb.barberosPool, { schema });
}

export function createDb(connectionString: string): { db: Db; pool: Pool } {
  const pool = new Pool({ connectionString, max: 5 });
  return { db: drizzle(pool, { schema }), pool };
}
