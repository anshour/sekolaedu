import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
    table.integer("current_classroom_id").unsigned().nullable();
    table
      .foreign("current_classroom_id")
      .references("classrooms.id")
      .onDelete("SET NULL");
    table
      .enum("status", [
        "active",
        "candidate",
        "graduated",
        "dropped",
        "transferred",
      ])
      .notNullable()
      .defaultTo("active");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("students");
}
