import { boolean, date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }),
});

export const lists = pgTable("lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }),
  description: varchar({ length: 200 }),
});

export const usersLists = pgTable("users_lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => users.id),
  list_id: integer()
    .notNull()
    .references(() => lists.id),
});

export const items = pgTable("items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 120 }),
  quantity: integer().default(1),
  checked: boolean().default(false),
  created_at: date(),
  checked_at: date(),
});
