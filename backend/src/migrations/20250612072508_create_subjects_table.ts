import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("subjects", (table) => {
    table.increments("id").primary();
    table.integer("classroom_id").unsigned().notNullable();
    table
      .foreign("classroom_id")
      .references("classrooms.id")
      .onDelete("CASCADE");
    table.string("name", 100).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("subjects");
}
