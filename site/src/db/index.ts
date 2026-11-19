import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import * as schema from "./schema";

const file = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./data/app.db";

// در حالت توسعه، اتصال بین رفرش‌ها نگه داشته می‌شود
const g = globalThis as unknown as { __sqlite?: Database.Database };
const sqlite = g.__sqlite ?? new Database(path.resolve(process.cwd(), file));
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
if (process.env.NODE_ENV !== "production") g.__sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
export * from "./schema";
