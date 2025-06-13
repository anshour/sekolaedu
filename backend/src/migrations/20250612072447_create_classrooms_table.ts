import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("classrooms", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.smallint("level").notNullable();
    table.integer("academic_year_id").unsigned().notNullable();
    table
      .foreign("academic_year_id")
      .references("academic_years.id")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("classrooms");
}
