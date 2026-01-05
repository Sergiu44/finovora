import { IDatabaseConnection } from "./IDatabaseConnection";
import { Sequelize as SequelizeType } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import User from "../../features/users/user";
import { Session } from "../../auth/sessions/session";
import { VerificationCode } from "../../auth/verifications/verification";
import { AccountType } from "../../features/accounts/accountTypes/accountType";
import { Account } from "../../features/accounts/account";
import { Currency } from "../../features/currencies/currency";
import { Category } from "../../features/categories/category";
import { TransactionType } from "../../features/transactions/transactionTypes/transactionType";
import { Transaction } from "../../features/transactions/transaction";
import { DefaultGradient } from "../../features/nomenclatures/defaultGradients/defaultGradient";
import { UserGradient } from "../../features/users/userGradients/userGradient";
import { BudgetExpense } from "../../features/categories/categoryBudget/categoryBudget";
import { UserProfile } from "../../features/users/userProfiles/userProfile";
import { ProfileSetupSession } from "../../features/users/profileSetupSessions/profileSetupSession";
import { CurrencyExchange } from "../../features/currencies/exchange/currencyExchange";
import { UserCurrency } from "../../features/currencies/user-currencies/userCurrency";

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
        this.initializeModels();
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
        return new Sequelize("finovora", "root", "Sergiu123!@_", {
          port: 3306,
          host: "localhost",
          dialect: "mysql",
          pool: {},
          models: [
            User,
            Session,
            VerificationCode,
            Account,
            AccountType,
            Currency,
            Category,
            TransactionType,
            Transaction,
            DefaultGradient,
            UserGradient,
            BudgetExpense,
            UserProfile,
            ProfileSetupSession,
            CurrencyExchange,
            UserCurrency,
          ],
        });
      default:
        return new Sequelize("finovora", "", "", {
          port: 3306,
          host: "localhost",
          dialect: "mysql",
          pool: {},
        });
    }
  }

  private initializeModels() {
    const dbInstance = this.getDatabaseInstance();
    User.configInit(dbInstance);
    VerificationCode.configInit(dbInstance);
    Session.configInit(dbInstance);
    Currency.configInit(dbInstance);
    Account.configInit(dbInstance);
    Category.configInit(dbInstance);
    AccountType.configInit(dbInstance);
    TransactionType.configInit(dbInstance);
    Transaction.configInit(dbInstance);
    DefaultGradient.configInit(dbInstance);
    UserGradient.configInit(dbInstance);
    BudgetExpense.configInit(dbInstance);
    UserProfile.configInit(dbInstance);
    ProfileSetupSession.configInit(dbInstance);
    CurrencyExchange.configInit(dbInstance);
    UserCurrency.configInit(dbInstance);

    Account.associate();
    AccountType.associate();
    Category.associate();
    TransactionType.associate();
    Transaction.associate();
    UserGradient.associate();
    BudgetExpense.associate();
    UserProfile.associate();
    ProfileSetupSession.associate();
    CurrencyExchange.associate();
    UserCurrency.associate();
  }
}
