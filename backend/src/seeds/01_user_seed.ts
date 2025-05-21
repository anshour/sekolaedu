import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // await knex("users").del();

  const hashedPassword = await bcrypt.hash("password", 10);

  await knex("users").insert([
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      is_active: true,
    },
    {
      id: 2,
      name: "Regular User",
      email: "user@example.com",
      password: hashedPassword,
      is_active: true,
    },
  ]);
}
