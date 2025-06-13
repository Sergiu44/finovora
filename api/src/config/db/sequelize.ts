import { IDatabaseConnection } from "./IDatabaseConnection";
import { Sequelize, Sequelize as SequelizeType } from "sequelize";

export default class SequelizeDatabaseWrapper implements IDatabaseConnection {
  private static instance: SequelizeDatabaseWrapper | null = null;
  private static dbInstance: SequelizeType | null = null;
  private environment: string;

  private constructor(environment: string) {
    this.environment = environment;
  }

  public static getInstance(
    environment: string = "development"
  ): SequelizeDatabaseWrapper {
    if (!SequelizeDatabaseWrapper.instance) {
      SequelizeDatabaseWrapper.instance = new SequelizeDatabaseWrapper(
        environment
      );
    }
    return SequelizeDatabaseWrapper.instance;
  }

  public getDatabaseInstance(): SequelizeType {
    if (!SequelizeDatabaseWrapper.dbInstance) {
      throw new Error(
        "Database not initialized. Call connectToDatabase first."
      );
    }
    return SequelizeDatabaseWrapper.dbInstance;
  }

  connectToDatabase: () => Promise<void> = async () => {
    try {
      if (!SequelizeDatabaseWrapper.dbInstance) {
        // Here you can add environment-specific configuration
        const sequelize = this.getEnvironmentConfig();
        await sequelize.authenticate();
        SequelizeDatabaseWrapper.dbInstance = sequelize;
        console.log(
          `Database connection established successfully for ${this.environment} environment.`
        );
      }
    } catch (err) {
      console.error(
        `Error initializing the API server for ${this.environment} environment:`,
        err
      );
      throw err;
    }
  };

  private getEnvironmentConfig(): Sequelize {
    // Add environment-specific configuration here
    switch (this.environment) {
      case "development":
        return new Sequelize("test", "root", "Copernic@1234", {
          port: 3306,
          host: "localhost",
          dialect: "mysql",
          pool: {},
        });
      default:
        return new Sequelize("test", "root", "Copernic@1234", {
          port: 3306,
          host: "localhost",
          dialect: "mysql",
          pool: {},
        });
    }
  }
}
