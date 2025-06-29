import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("classrooms", (table) => {
    table.integer("count_students").unsigned().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("classrooms", (table) => {
    table.dropColumn("count_students");
  });
}
