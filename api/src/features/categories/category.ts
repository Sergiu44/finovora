import { DataTypes, NonAttribute, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import User from "../users/user";
import { TransactionType } from "../transactions/transactionTypes/transactionType";
import { BudgetExpense } from "./categoryBudget/categoryBudget";

type CategoryAttributes = {
  id: number;
  userId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  parentCategoryId: number | null;
  transactionTypeId: number;
};

type CategoryCreationAttributes = Omit<
  CategoryAttributes,
  "id" | "createdAt" | "updatedAt"
>;

@Table({
  tableName: "transaction-categories",
  timestamps: true,
  freezeTableName: true,
})
export class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare parentCategoryId: number | null;
  declare parentCategory?: NonAttribute<Category>;
  declare transactionTypeId: number;
  declare transactionType?: NonAttribute<TransactionType>;
  declare budgetExpense?: NonAttribute<BudgetExpense>;
  declare subCategories?: NonAttribute<Category[]>;

  static associate() {
    Category.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
    Category.belongsTo(Category, {
      foreignKey: "parentCategoryId",
      as: "parentCategory",
    });
    Category.hasMany(Category, {
      foreignKey: "parentCategoryId",
      as: "subCategories",
      onDelete: "CASCADE",
    });
    Category.belongsTo(TransactionType, {
      foreignKey: "transactionTypeId",
      as: "transactionType",
    });
    Category.hasOne(BudgetExpense, {
      foreignKey: "categoryId",
      as: "budgetExpense",
    });
  }

  public static configInit(SequelizeInstance: Sequelize) {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
          onDelete: "CASCADE"
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
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
        parentCategoryId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: Category,
            key: "id",
          },
        },
        transactionTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: TransactionType,
            key: "id",
          },
        },
      },
      {
        sequelize: SequelizeInstance,
        tableName: "transaction-categories",
        timestamps: true,
        freezeTableName: true,
      }
    );
  }
}
