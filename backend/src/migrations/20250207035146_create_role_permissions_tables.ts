import { Knex } from "knex";

export async function up(knex: Knex) {
  return (
    knex.schema
      // Tabel permissions
      .createTable("permissions", (table) => {
        table.increments("id").primary();
        table.string("name").unique().notNullable();
        table.string("description").nullable();
        table.timestamps(true, true);
      })

      // Tabel roles
      .createTable("roles", (table) => {
        table.increments("id").primary();
        table.string("name").unique().notNullable();
        table.timestamps(true, true);
      })

      // Tabel user_roles
      .createTable("user_roles", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references("users.id").onDelete("CASCADE");
        table.integer("role_id").unsigned().notNullable();
        table.foreign("role_id").references("roles.id").onDelete("CASCADE");
        table.timestamps(true, true);
      })

      // Tabel user_permissions (opsional tambahan langsung ke user)
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

      // Tabel role_permissions
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
      })
  );
}

export async function down(knex: Knex) {
  return knex.schema
    .dropTableIfExists("role_permissions")
    .dropTableIfExists("user_permissions")
    .dropTableIfExists("user_roles")
    .dropTableIfExists("roles")
    .dropTableIfExists("permissions");
}
