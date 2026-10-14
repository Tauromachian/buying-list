import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const {
  NEXT_DB_HOST,
  NEXT_DB_PORT,
  NEXT_DB_NAME,
  NEXT_DB_USER,
  NEXT_DB_PASSWORD,
} = process.env;

const DB_URL = `postgresql://${NEXT_DB_USER}:${NEXT_DB_PASSWORD}@${NEXT_DB_HOST}:${NEXT_DB_PORT}/${NEXT_DB_NAME}`;

export default defineConfig({
  out: "./drizzle",
  schema: "./app/_db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL!,
  },
});
