import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema
    .createTable("permissions", (table) => {
      table.increments("id").primary();
      table.string("name", 100).unique().notNullable();
      table.string("description").nullable();
      table.timestamps(true, true);
    })

    .createTable("roles", (table) => {
      table.increments("id").primary();
      table.string("name", 25).unique().notNullable();
      table.timestamps(true, true);
    })

    .table("users", (table) => {
      table.integer("role_id").unsigned().nullable();
      table.foreign("role_id").references("roles.id").onDelete("CASCADE");
    })

    .createTable("user_permissions", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
      table.integer("permission_id").unsigned().notNullable();
      table
        .foreign("permission_id")
        .references("permissions.id")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    })

    .createTable("role_permissions", (table) => {
      table.increments("id").primary();
      table.integer("role_id").unsigned().notNullable();
      table.foreign("role_id").references("roles.id").onDelete("CASCADE");
      table.integer("permission_id").unsigned().notNullable();
      table
        .foreign("permission_id")
        .references("permissions.id")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTableIfExists("role_permissions")
    .dropTableIfExists("user_permissions")
    .dropTableIfExists("user_roles")
    .dropTableIfExists("permissions")
    .dropTableIfExists("roles");
}
