import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("test", "root", "Sergiu123!@_", {
  port: 3306,
  host: "localhost",
  dialect: "mysql",
  pool: {},
});
