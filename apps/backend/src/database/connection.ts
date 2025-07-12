import { default as baseKnex } from "knex";
// @ts-ignore
import knexConfig from "../../knexfile";

const knex = baseKnex(knexConfig);

export default knex;
