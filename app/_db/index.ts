import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const {
  NEXT_DB_HOST,
  NEXT_DB_PORT,
  NEXT_DB_NAME,
  NEXT_DB_USER,
  NEXT_DB_PASSWORD,
} = process.env;

const DB_URL = `postgresql://${NEXT_DB_USER}:${NEXT_DB_PASSWORD}@${NEXT_DB_HOST}:${NEXT_DB_PORT}/${NEXT_DB_NAME}`;

export const db = drizzle(DB_URL as string);
