import { DataTypes, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";

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

type AccountCreationAttributes = Optional<AccountAttributes, "id" | "createdAt" | "updatedAt" | "balance">;

@Table({
  tableName: "account",
  freezeTableName: true,
  timestamps: false,
})
export class Account extends Model<AccountAttributes, AccountCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare accountTypeId: number;
  declare currencyId: number;
  declare name: string;
  declare description?: string;
  declare color?: string;
  declare balance: number;
  declare createdAt: Date;
  declare updatedAt: Date;

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
            model: {
              tableName: "account-types",
            },
            key: "id",
          },
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: "users",
            },
            key: "id",
          },
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
            model: {
              tableName: "currencies",
            },
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
          defaultValue: Date.now(),
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Date.now(),
        },
      },
      {
        timestamps: false,
        sequelize: SequelizeInstance,
        tableName: "account-types",
      }
    );
  }
}
