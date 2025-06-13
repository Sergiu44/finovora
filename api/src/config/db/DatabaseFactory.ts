import { IDatabaseConnection } from "./IDatabaseConnection";
import Sequelize from "./sequelize";

export class DatabaseFactory {
  public static createDatabaseConnection(
    environment: string
  ): IDatabaseConnection {
    switch (environment) {
      case "development":
        return Sequelize.getInstance();
      default:
        throw new Error(`Unsupported environment: ${environment}`);
    }
  }
}
