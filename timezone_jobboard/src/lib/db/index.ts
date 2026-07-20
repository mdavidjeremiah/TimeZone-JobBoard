import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazily created so that `next build` never needs a real DATABASE_URL.
// Only throws when a route actually tries to touch the database.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon Postgres connection string to .env.local (see .env.example)."
    );
  }

  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}