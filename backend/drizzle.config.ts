import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",

  driver: "pglite",
  dbCredentials: {
    url: "./pgdata",
  },
});
