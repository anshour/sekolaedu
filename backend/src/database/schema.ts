import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    password: varchar("password", { length: 180 }).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    role_id: integer("role_id").references(() => roles.id, {
      onDelete: "cascade",
    }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 25 }).notNull().unique(),
  readable_name: varchar("readable_name", { length: 50 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// User permissions junction table
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  permission_id: integer("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Role permissions junction table
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role_id: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  permission_id: integer("permission_id")
    .notNull()
    .references(() => permissions.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Password resets table
export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  email: varchar("email").notNull(),
  token: varchar("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
  userPermissions: many(userPermissions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  userPermissions: many(userPermissions),
  rolePermissions: many(rolePermissions),
}));

export const userPermissionsRelations = relations(
  userPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [userPermissions.user_id],
      references: [users.id],
    }),
    permission: one(permissions, {
      fields: [userPermissions.permission_id],
      references: [permissions.id],
    }),
  }),
);

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.role_id],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permission_id],
      references: [permissions.id],
    }),
  }),
);
