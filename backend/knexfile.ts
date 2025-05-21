import config from "./src/config";

require("tsx");

const knexConfig = {
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
  searchPath: [config.dbSchema],
};

export default knexConfig;
