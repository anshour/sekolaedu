import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("teachers", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table
      .enu("type", ["regular", "assistant"])
      .notNullable()
      .defaultTo("regular");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("teachers");
}
