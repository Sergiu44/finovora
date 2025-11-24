import { DataTypes, NonAttribute, Optional, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { Account } from "../accounts/account";
import User from "../users/user";
import { TransactionType } from "./transactionTypes/transactionType";
import { Category } from "../categories/category";
import { Currency } from "../currencies/currency";

type TransactionAttributes = {
  id: number;
  userId: number;
  accountId: number;
  destinationAccountId?: number;
  transactionTypeId: number;
  categoryId?: number;
  currencyId?: number;
  amount: number;
  description?: string;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  fixed?: boolean;
};

type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;

@Table({
  tableName: "transactions",
  timestamps: true,
})
export class Transaction extends Model<
  TransactionAttributes,
  TransactionCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare accountId: number;
  declare destinationAccountId: number;
  declare transactionTypeId: number;
  declare categoryId?: number;
  declare currencyId?: number;
  declare amount: number;
  declare description: string | null;
  declare transactionDate: Date;
  declare fixed?: boolean;
  declare user: NonAttribute<User>;
  declare account: NonAttribute<Account>;
  declare destinationAccount: NonAttribute<Account>;
  declare transactionType: NonAttribute<TransactionType>;
  declare category: NonAttribute<Category>;
  declare currency: NonAttribute<Currency>;

  static associate() {
    Transaction.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
    Transaction.belongsTo(Account, {
      foreignKey: "accountId",
      as: "account",
    });
    Transaction.belongsTo(TransactionType, {
      foreignKey: "transactionTypeId",
      as: "transactionType",
    });
    Transaction.belongsTo(Category, {
      foreignKey: "categoryId",
      as: "category",
    });
    Transaction.belongsTo(Account, {
      foreignKey: "destinationAccountId",
      as: "destinationAccount",
    });
    Transaction.belongsTo(Currency, {
      foreignKey: "currencyId",
      as: "currency",
    })
  }

  public static configInit(SequelizeInstance: Sequelize) {
    Transaction.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: {
              tableName: "users",
            },
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        accountId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: {
              tableName: "accounts",
            },
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        destinationAccountId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: "accounts",
            },
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        fixed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        transactionTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "transaction-types",
            },
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        categoryId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: {
              tableName: "transaction-categories",
            },
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        amount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
          comment: "Positive for income, negative for expenses",
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
          comment: "Transaction description or notes",
        },
        transactionDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
          comment: "When the transaction actually occurred",
        },
        currencyId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          defaultValue: 1,
          references: {
            model: Currency,
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          comment: "Soft delete timestamp",
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "transactions",
        timestamps: true,
      }
    );
  }
}
