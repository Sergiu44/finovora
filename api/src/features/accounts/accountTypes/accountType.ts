import { DataTypes, Sequelize, Optional, NonAttribute } from "sequelize";
import { Account } from "../account";
import { Model, Table } from "sequelize-typescript";
import User from "../../users/user";

type AccountTypeAttributes = {
  id: number;
  userId: number | null;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

type AccountTypeCreationAttributes = Optional<
  AccountTypeAttributes,
  "id" | "createdAt" | "updatedAt"
>;

@Table({
  tableName: "account-types",
  freezeTableName: true,
  timestamps: false,
})
export class AccountType extends Model<
  AccountTypeAttributes,
  AccountTypeCreationAttributes
> {
  declare id: number;
  declare name: string;
  declare description?: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare accounts?: NonAttribute<Account[]>;

  static associate() {
    AccountType.hasOne(Account, {
      foreignKey: "accountTypeId",
    });
    AccountType.belongsTo(User, {
      foreignKey: "userId",
    });
  }

  public static configInit(SequelizeInstance: Sequelize) {
    AccountType.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(255),
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
        tableName: "account-types",
        freezeTableName: true,
      }
    );
  }
}
