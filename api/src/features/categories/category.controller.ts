import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import { Category } from "./category";
import { Op } from "sequelize";
import appAssert from "../../utils/utilities/appAssert";
import { BAD_REQUEST, NOT_FOUND } from "../../utils/constants/http";
import { BudgetExpense } from "./categoryBudget/categoryBudget";
import { Currency } from "../currencies/currency";
import { Transaction } from "../transactions/transaction";
import { DateUtils } from "../../utils/utilities/DateUtils";
import { TransactionTypes } from "../../lib/enums/TransactionTypes";

export const getCategoriesAsync = catchErrors(
  async (req: Request, res: Response) => {
    const { type } = req.query;
    const categories = await Category.findAll({
      where: {
        userId: req.userId,
        parentCategoryId: null,
        transactionTypeId: type as string,
      },
      attributes: ["name", "id"],
      include: [
        {
          model: Category,
          as: "subCategories",
          attributes: ["name", "id"],
        },
      ],
    });
    return res.status(200).json(categories);
  }
);

export const createCategoryAsync = catchErrors(
  async (req: Request, res: Response) => {
    const { name, parentCategoryId, transactionTypeId } = req.body;
    const category = await Category.create({
      name,
      parentCategoryId,
      userId: req.userId,
      transactionTypeId,
    });
    return res.status(201).json(category);
  }
);

export const deleteBulkCategoriesAsync = catchErrors(
  async (req: Request, res: Response) => {
    const categoryIds = req.body;
    await Category.destroy({
      where: {
        id: { [Op.in]: categoryIds },
        userId: req.userId,
      },
    });
    return res.status(204).send();
  }
);

export const editCategoryAsync = catchErrors(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const { id } = req.params;
    const userId = req.userId;

    const categoryToUpdate = await Category.findOne({
      where: { id, userId },
    });
    appAssert(!!categoryToUpdate, NOT_FOUND, "Category not found");
    await categoryToUpdate.update({ name });
    return res.status(200).json(categoryToUpdate);
  }
);

export const getCategoriesDropdownAsync = catchErrors(
  async (req: Request, res: Response) => {
    appAssert(
      !!req.query.transactionTypeId,
      BAD_REQUEST,
      "Transaction type ID is required"
    );
    const categories = await Category.findAll({
      where: {
        userId: req.userId,
        transactionTypeId: req.query.transactionTypeId as string,
      },
      attributes: ["id", "name"],
    });
    return res
      .status(200)
      .json(categories.map((c) => ({ id: c.id, value: c.name })));
  }
);

export const getCategoriesWithBudgetAsync = catchErrors(
  async (req: Request, res: Response) => {
    appAssert(
      !!req.query.transactionTypeId,
      BAD_REQUEST,
      "Transaction type ID is required"
    );
    const totalIncome = await Transaction.sum("amount", {
      where: {
        userId: req.userId,
        transactionTypeId: TransactionTypes.Income,
        transactionDate: {
          [Op.between]: [
            DateUtils.getFirstDayOfMonth(),
            DateUtils.getLastDayOfMonth(),
          ],
        },
      },
    });
    const categories = await Category.findAll({
      where: {
        userId: req.userId,
        transactionTypeId: req.query.transactionTypeId as string,
      },
      include: [
        {
          model: BudgetExpense,
          as: "budgetExpense",
          foreignKey: "categoryId",
          attributes: ["id", "budgetAmount"],
          include: [
            {
              model: Currency,
              as: "currency",
              attributes: ["id", "code", "symbol"],
            },
          ],
        },
      ],
      attributes: ["id", "name"],
    });
    return res.status(200).json({
      categories: categories.map((c) => ({ id: c.id, value: c.name })),
      totalIncome,
    });
  }
);

export const createBudgetPlannerAsync = catchErrors(
  async (req: Request, res: Response) => {
    const categoriesBudgets = req.body;
    const budgetPlanner = await BudgetExpense.bulkCreate(
      categoriesBudgets.map((cb: object) => ({
        ...cb,
        userId: req.userId,
      }))
    );
    return res.status(201).json(budgetPlanner);
  }
);

export const getBudgetOverviewAsync = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    // Get current month date range
    const firstDayOfMonth = DateUtils.getFirstDayOfMonth();
    const lastDayOfMonth = DateUtils.getLastDayOfMonth();

    // Get all budget expenses for the user
    const budgetExpenses = await BudgetExpense.findAll({
      where: {
        userId,
        startDate: {
          [Op.lte]: lastDayOfMonth,
        },
        endDate: {
          [Op.or]: [{ [Op.is]: null }, { [Op.gte]: firstDayOfMonth }],
        },
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Currency,
          as: "currency",
          attributes: ["id", "code", "symbol"],
        },
      ],
    });

    // Get actual spending for each category in current month
    const budgetData = await Promise.all(
      budgetExpenses.map(async (budget) => {
        const actualSpending = await Transaction.sum("amount", {
          where: {
            userId,
            categoryId: budget.categoryId,
            transactionTypeId: TransactionTypes.Expense,
            transactionDate: {
              [Op.between]: [firstDayOfMonth, lastDayOfMonth],
            },
          },
        });

        return {
          categoryId: budget.categoryId,
          categoryName: budget.category.name,
          budgetAmount: parseFloat(budget.budgetAmount.toString()),
          actualSpending: actualSpending || 0,
          remaining: Math.max(
            0,
            parseFloat(budget.budgetAmount.toString()) - (actualSpending || 0)
          ),
          percentage: Math.round(
            ((actualSpending || 0) /
              parseFloat(budget.budgetAmount.toString())) *
              100
          ),
          currency: budget.currency,
        };
      })
    );

    return res.status(200).json(budgetData);
  }
);
