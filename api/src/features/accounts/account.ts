import { DataTypes, Sequelize, Optional, NonAttribute } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { AccountType } from "./accountTypes/accountType";
import User from "../users/user";
import { Currency } from "../currencies/currency";
import { DefaultGradient } from "../nomenclatures/defaultGradients/defaultGradient";
import { UserGradient } from "../users/userGradients/userGradient";
import { Transaction } from "../transactions/transaction";

type AccountAttributes = {
  id: number;
  userId: number;
  accountTypeId: number;
  name: string;
  description?: string;
  currencyId: number;
  defaultGradientId?: number;
  userGradientId?: number;
  createdAt: Date;
  updatedAt: Date;
  balance: number;
};

type AccountCreationAttributes = Optional<
  AccountAttributes,
  "id" | "createdAt" | "updatedAt" | "balance"
>;

@Table({
  tableName: "accounts",
  freezeTableName: true,
  timestamps: false,
})
export class Account extends Model<
  AccountAttributes,
  AccountCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare currencyId: number;
  declare name: string;
  declare description?: string;
  declare balance: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare accountTypeId: number;
  declare accountType: NonAttribute<AccountType>;
  declare defaultGradientId?: number;
  declare userGradientId?: number;
  declare defaultGradient?: NonAttribute<DefaultGradient>;
  declare userGradient?: NonAttribute<UserGradient>;
  declare transactions?: NonAttribute<Transaction[]>;

  static associate() {
    Account.belongsTo(AccountType, {
      foreignKey: "accountTypeId",
      as: "accountType",
    });
    Account.belongsTo(User, {
      foreignKey: "userId",
    });
    Account.belongsTo(Currency, {
      foreignKey: "currencyId",
      as: "currency",
    });
    Account.belongsTo(DefaultGradient, {
      foreignKey: "defaultGradientId",
      as: "defaultGradient",
    });
    Account.belongsTo(UserGradient, {
      foreignKey: "userGradientId",
      as: "userGradient",
    });
    Account.hasMany(Transaction, {
      foreignKey: "accountId",
      as: "transactions",
    });
  }

  public static configInit(SequelizeInstance: Sequelize) {
    Account.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        accountTypeId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: AccountType,
            key: "id",
          },
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          onDelete: "CASCADE"
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        balance: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          defaultValue: 0,
        },
        currencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Currency,
            key: "id",
          },
        },
        defaultGradientId: {
          type: DataTypes.TINYINT,
          allowNull: true,
          references: {
            model: {
              tableName: "default-gradients",
            },
            key: "id",
          },
        },
        userGradientId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: "user-gradients",
            },
            key: "id",
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        sequelize: SequelizeInstance,
        timestamps: false,
        tableName: "accounts",
        freezeTableName: true,
      }
    );
  }
}
