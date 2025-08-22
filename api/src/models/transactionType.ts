import { DataTypes, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";

type TransactionTypeAttributes = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type TransactionTypeCreationAttributes = Optional<TransactionTypeAttributes, "id" | "name" | "createdAt" | "updatedAt">;

@Table({
  tableName: "transactionTypes",
  timestamps: true,
  freezeTableName: true,
})
export class TransactionType extends Model<TransactionTypeAttributes, TransactionTypeCreationAttributes> {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  public static configInit(SequelizeInstance: Sequelize) {
    TransactionType.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { sequelize: SequelizeInstance, tableName: "transactionTypes", timestamps: true }
    );
  }
}
