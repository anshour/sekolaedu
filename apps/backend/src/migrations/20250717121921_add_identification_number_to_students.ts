import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("students", (table) => {
        table.string("identification_number").unique().nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("students", (table) => {
        table.dropColumn("identification_number");
    });
}

