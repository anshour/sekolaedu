import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("roles", (table) => {
    table.string("readable_name", 50).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("roles", (table) => {
    table.dropColumn("readable_name");
  });
}
