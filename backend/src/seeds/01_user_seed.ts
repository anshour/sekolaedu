import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  const hashedPassword = await bcrypt.hash("password", 10);

  await knex("users").insert([
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      is_active: true,
    },
  ]);

  await knex.raw(
    `SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users))`,
  );
}
