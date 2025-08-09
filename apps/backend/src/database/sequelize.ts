import "./pg-type-parsers";
import { Sequelize } from "sequelize";
import config from "~/config";

const sequelize = new Sequelize(
  `postgres://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`,
  {
    logging: false,
  },
);

export default sequelize;
