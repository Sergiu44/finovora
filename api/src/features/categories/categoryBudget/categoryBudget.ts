import { DataTypes, NonAttribute, Sequelize } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import User from "../../users/user";
import { Category } from "../category";
import { Currency } from "../../currencies/currency";

type CategoryBudgetAttributes = {
  id: number;
  userId: number;
  categoryId: number;
  budgetAmount: number;
  currencyId: number;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryBudgetCreationAttributes = Omit<
  CategoryBudgetAttributes,
  "id" | "createdAt" | "updatedAt"
>;

@Table({
  tableName: "budget-expenses",
  timestamps: true,
  freezeTableName: true,
})
export class BudgetExpense extends Model<
  CategoryBudgetAttributes,
  CategoryBudgetCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare categoryId: number;
  declare budgetAmount: number;
  declare currencyId: number;
  declare startDate: Date;
  declare endDate: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare user: NonAttribute<User>;
  declare category: NonAttribute<Category>;
  declare currency: NonAttribute<Currency>;

  static associate() {
    BudgetExpense.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
    });
    BudgetExpense.belongsTo(Category, {
      foreignKey: "categoryId",
      as: "category",
    });
    BudgetExpense.belongsTo(Currency, {
      foreignKey: "currencyId",
      as: "currency",
    });
  }

  static configInit(SequelizeInstance: Sequelize) {
    BudgetExpense.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: User,
            key: "id",
          },
        },
        categoryId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: Category,
            key: "id",
          },
        },
        budgetAmount: {
          type: DataTypes.DECIMAL(20, 2),
          allowNull: false,
        },
        currencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        endDate: {
          type: DataTypes.DATE,
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
        tableName: "budget-expenses",
        timestamps: true,
        freezeTableName: true,
      }
    );
  }
}
