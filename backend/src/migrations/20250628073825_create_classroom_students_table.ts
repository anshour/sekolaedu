import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("classroom_students", (table) => {
    table.integer("student_id").unsigned().notNullable();
    table.foreign("student_id").references("students.id").onDelete("CASCADE");
    table.integer("classroom_id").unsigned().notNullable();
    table
      .foreign("classroom_id")
      .references("classrooms.id")
      .onDelete("CASCADE");
    table.primary(["student_id", "classroom_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("classroom_students");
}
