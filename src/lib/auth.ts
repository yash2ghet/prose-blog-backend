import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as authSchema from "./auth-schema.ts";
import { user } from "../db/schema/users.ts";
import { session } from "../db/schema/sessions.ts";
import { account } from "../db/schema/accounts.ts";
import { verification } from "../db/schema/verification.ts";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const schema = {
  ...authSchema,
  user,
  session,
  account,
  verification,
};

const db = drizzle({ client: pool, schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: ["http://localhost:3000"],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
  emailAndPassword: { enabled: true },
});