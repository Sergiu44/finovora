import { DataTypes, Sequelize, Optional } from "sequelize";
import { Model, Table } from "sequelize-typescript";

type AccountTypeAttributes = {
  id: number;
  userId: number | null;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

type AccountTypeCreationAttributes = Optional<AccountTypeAttributes, "id" | "createdAt" | "updatedAt">;

@Table({
  tableName: "account-types",
  freezeTableName: true,
  timestamps: false,
})
export class AccountType extends Model<AccountTypeAttributes, AccountTypeCreationAttributes> {
  declare id: number;
  declare userId: number | null;
  declare name: string;
  declare description?: string;
  declare createdAt: Date;
  declare updatedAt: Date;

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
        sequelize: SequelizeInstance,
        timestamps: false,
        tableName: "account-types",
        freezeTableName: true,
      }
    );
  }
}
