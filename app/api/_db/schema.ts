import {
  boolean,
  integer,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 240 }).notNull().unique(),
  password: varchar({ length: 240 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const groupsTable = pgTable("groups", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 150 }).notNull(),
});

export const listsTable = pgTable("lists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  groupId: integer("group_id").references(() => groupsTable.id),
  name: varchar({ length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  description: varchar({ length: 200 }),
});

export const usersGroupsTable = pgTable(
  "users_groups",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    groupId: integer("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("users_groups_user_group_unique").on(table.userId, table.groupId),
  ],
);

export const itemsTable = pgTable("items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  listId: integer("list_id")
    .notNull()
    .references(() => listsTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 120 }).notNull(),
  quantity: integer().notNull().default(1),
  checked: boolean().notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  checkedAt: timestamp("checked_at"),
});
