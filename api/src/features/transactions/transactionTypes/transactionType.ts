import { DataTypes, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { Transaction } from "../transaction";
import { Category } from "../../categories/category";

type TransactionTypeAttributes = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type TransactionTypeCreationAttributes = Optional<
  TransactionTypeAttributes,
  "id" | "name" | "createdAt" | "updatedAt"
>;

@Table({
  tableName: "transaction-types",
  timestamps: true,
  freezeTableName: true,
})
export class TransactionType extends Model<
  TransactionTypeAttributes,
  TransactionTypeCreationAttributes
> {
  declare id: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static associate() {
    TransactionType.hasMany(Transaction, {
      foreignKey: "transactionTypeId",
      as: "transactions",
    });
    TransactionType.hasMany(Category, {
      foreignKey: "transactionTypeId",
      as: "categories",
    });
  }

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
      {
        sequelize: SequelizeInstance,
        tableName: "transaction-types",
        timestamps: true,
      }
    );
  }
}
