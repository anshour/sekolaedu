import { default as baseKnex } from "knex";
// @ts-ignore
import knexConfig from "../../knexfile";
import config from "../config";

const knex = baseKnex(
  config.app.nodeEnv === "production"
    ? knexConfig.production
    : knexConfig.development,
);

export default knex;
