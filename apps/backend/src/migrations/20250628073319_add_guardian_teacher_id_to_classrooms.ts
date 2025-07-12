import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("classrooms", (table) => {
    table.integer("guardian_teacher_id").unsigned().nullable();
    table
      .foreign("guardian_teacher_id")
      .references("teachers.id")
      .onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("classrooms", (table) => {
    table.dropForeign(["guardian_teacher_id"]);
    table.dropColumn("guardian_teacher_id");
  });
}
