import { Sequelize } from "sequelize";
import config from "~/config";

const sequelize = new Sequelize(
  `postgres://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?sslmode=require`,
  {
    logging: false,
  },
);

export default sequelize;
