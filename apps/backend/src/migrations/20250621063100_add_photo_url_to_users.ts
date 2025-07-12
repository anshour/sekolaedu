import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.string("photo_url").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.dropColumn("photo_url");
  });
}
