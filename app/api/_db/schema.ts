import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
});

export const listsTable = pgTable("lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  description: varchar({ length: 200 }),
});

export const usersListsTable = pgTable("users_lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  listId: integer("list_id")
    .notNull()
    .references(() => listsTable.id),
});

export const itemsTable = pgTable("items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  listId: integer("list_id")
    .notNull()
    .references(() => listsTable.id),
  name: varchar({ length: 120 }).notNull(),
  quantity: integer().notNull().default(1),
  checked: boolean().notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  checkedAt: timestamp("checked_at"),
});
