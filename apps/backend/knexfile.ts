import config from "./src/config";
import { Knex } from "knex";
require("tsx");

const knexConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    database: config.dbName,
    password: config.dbPassword,
    ssl: config.dbSsl ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: "./src/migrations",
  },
  seeds: {
    directory: "./src/seeds",
  },
};

export default knexConfig;
