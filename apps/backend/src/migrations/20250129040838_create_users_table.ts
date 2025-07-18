import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("email", 150).notNullable().unique().index();
    table.string("password", 180).notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
