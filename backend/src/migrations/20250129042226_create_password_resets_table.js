/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('password_resets', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('email').notNullable();
    table.string('token').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('password_resets');
};
