import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("password_resets", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.string("email").notNullable();
    table.string("token").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("password_resets");
}
