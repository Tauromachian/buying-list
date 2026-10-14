import { boolean, date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
});

export const listsTable = pgTable("lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 200 }),
});

export const usersListsTable = pgTable("users_lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
  list_id: integer()
    .notNull()
    .references(() => listsTable.id),
});

export const itemsTable = pgTable("items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 120 }).notNull(),
  quantity: integer().notNull().default(1),
  checked: boolean().notNull().default(false),
  created_at: date().notNull(),
  checked_at: date().notNull(),
});
