import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("subjects", (table) => {
    table.integer("teacher_id").unsigned().nullable();
    table.foreign("teacher_id").references("teachers.id").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("subjects", (table) => {
    table.dropForeign(["teacher_id"]);
    table.dropColumn("teacher_id");
  });
}
