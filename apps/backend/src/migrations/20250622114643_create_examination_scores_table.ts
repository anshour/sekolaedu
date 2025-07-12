import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("examination_scores", (table) => {
    table.increments("id").primary();
    table.integer("examination_id").unsigned().notNullable();
    table.foreign("examination_id").references("examinations.id");
    table.integer("student_id").unsigned().notNullable();
    table.foreign("student_id").references("students.id");
    table.integer("score").unsigned().notNullable();
    table.string("status", 50).notNullable(); // e.g., "PASSED", "FAILED"
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("examination_scores");
}
