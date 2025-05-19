/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('email', 150).notNullable().unique().index();
        table.string('password', 255).notNullable();
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTable('users');
};
