import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("academic_years", (table) => {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table.boolean("is_active").defaultTo(false).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("academic_years");
}
