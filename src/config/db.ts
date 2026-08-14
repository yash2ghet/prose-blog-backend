import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env.ts";
import * as schema from "../db/schema/index.ts";

const client = postgres(env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });

export async function connectDB() {
  try {
    await client`SELECT 1`;
    console.log("✅ Connected to database successfully");
  } catch (error) {
    console.error("❌ Invalid DB Connection:", error);
    process.exit(1);
  }
}

export default db;