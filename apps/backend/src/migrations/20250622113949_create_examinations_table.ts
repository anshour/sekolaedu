import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("examinations", (table) => {
    table.increments("id").primary();
    table.integer("classroom_id").unsigned().notNullable();
    table.foreign("classroom_id").references("classrooms.id");
    table.integer("subject_id").unsigned().notNullable();
    table.foreign("subject_id").references("subjects.id");
    table.string("name", 100).notNullable();
    table.string("status", 50).notNullable(); // e.g., "SCHEDULED", "COMPLETED", "CANCELED"
    table.date("date").notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.integer("minimum_passing_score").unsigned().nullable();
    table.string("type", 50).notNullable(); // e.g., "Ulangan Harian", "Ujian Tengah Semester", "Ujian Akhir Tahun", "Ujian Praktek"
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("examinations");
}
