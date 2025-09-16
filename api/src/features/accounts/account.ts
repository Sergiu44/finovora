import { DataTypes, Sequelize, Optional, NonAttribute } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { AccountType } from "./accountTypes/accountType";
import User from "../users/user";
import { Currency } from "../currencies/currency";

type AccountAttributes = {
  id: number;
  userId: number;
  accountTypeId: number;
  name: string;
  description?: string;
  currencyId: number;
  color?: string;
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
  declare color?: string;
  declare balance: number;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare accountTypeId: number;
  declare accountType: NonAttribute<AccountType>;

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
        color: {
          type: DataTypes.STRING(20),
          allowNull: true,
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
