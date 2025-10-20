import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import { Account } from "./account";
import { AccountType } from "./accountTypes/accountType";
import { Currency } from "../currencies/currency";
import User from "../users/user";
import { getColorGradient, isDefaultGradient } from "./accounts.service";
import { BAD_REQUEST } from "../../utils/constants/http";
import appAssert from "../../utils/utilities/appAssert";
import { DefaultGradient } from "../nomenclatures/defaultGradients/defaultGradient";
import { UserGradient } from "../users/userGradients/userGradient";
import { Transaction } from "../transactions/transaction";
import { Category } from "../categories/category";
import { TransactionType } from "../transactions/transactionTypes/transactionType";
import { Op } from "sequelize";
import { DateUtils } from "../../utils/utilities/DateUtils";

export const getAccountsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accounts = await Account.findAll({
      where: {
        userId: req.userId,
      },
    });

    return res.status(200).json(accounts);
  }
);

export const getAccountsCardFormatHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accounts = await Account.findAll({
      where: {
        userId: req.userId,
      },
      include: [
        {
          model: DefaultGradient,
          foreignKey: "defaultGradientId",
          as: "defaultGradient",
        },
        {
          model: UserGradient,
          as: "userGradient",
          foreignKey: "userGradientId",
        },
        {
          model: AccountType,
          as: "accountType",
          foreignKey: "accountTypeId",
        },
        {
          model: Currency,
          as: "currency",
          foreignKey: "currencyId",
        },
      ],
    });

    return res.status(200).json(accounts);
  }
);

export const getAccountsForSwitchHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accounts = await Account.findAll({
      where: {
        userId: req.userId,
      },
      include: [
        { model: AccountType, as: "accountType", attributes: ["id", "name"] },
        {
          model: Currency,
          as: "currency",
          attributes: ["id", "code", "symbol"],
        },
      ],
    });

    return res.status(200).json(accounts);
  }
);

export const getAccountHandler = catchErrors(
  async (req: Request, res: Response) => {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: [
        { model: AccountType, as: "accountType", attributes: ["id", "name"] },
        {
          model: DefaultGradient,
          foreignKey: "defaultGradientId",
          as: "defaultGradient",
        },
        {
          model: UserGradient,
          as: "userGradient",
          foreignKey: "userGradientId",
        },
        {
          model: Currency,
          as: "currency",
          attributes: ["id", "code", "symbol"],
        },
        {
          model: Transaction,
          as: "transactions",
          foreignKey: "accountId",
          attributes: ["id", "amount", "transactionDate", "description"],
          where: {
            transactionDate: {
              [Op.between]: [
                DateUtils.getFirstDayOfLastMonth(),
                DateUtils.getLastDayOfMonth(),
              ],
            },
          },
          required: false,
          include: [
            {
              model: TransactionType,
              as: "transactionType",
              attributes: ["id", "name"],
            },
            { model: Category, as: "category", attributes: ["id", "name"] },
          ],
        },
      ],
      order: [
        [{ model: Transaction, as: "transactions" }, "transactionDate", "ASC"],
      ], // Order by most recent first
    });

    const lastMonthTransactions = account?.transactions?.filter(
      (transaction) =>
        transaction.transactionDate >= DateUtils.getFirstDayOfLastMonth() &&
        transaction.transactionDate <= DateUtils.getFirstDayOfMonth()
    );
    const currentMonthTransactions = account?.transactions?.filter(
      (transaction) =>
        transaction.transactionDate >= DateUtils.getFirstDayOfMonth() &&
        transaction.transactionDate <= DateUtils.getLastDayOfMonth()
    );

    const incomeLastMonth =
      lastMonthTransactions
        ?.filter((transaction) => transaction.transactionType.name === "Income")
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;
    const incomeCurrentMonth =
      currentMonthTransactions
        ?.filter((transaction) => transaction.transactionType.name === "Income")
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;
    const expenseLastMonth =
      lastMonthTransactions
        ?.filter(
          (transaction) => transaction.transactionType.name === "Expense"
        )
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;
    const expenseCurrentMonth =
      currentMonthTransactions
        ?.filter(
          (transaction) => transaction.transactionType.name === "Expense"
        )
        .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;
    const incomePercentage = incomeCurrentMonth
      ? ((incomeCurrentMonth - incomeLastMonth) / incomeLastMonth) * 100
      : null;
    const expensePercentage = expenseCurrentMonth
      ? ((expenseCurrentMonth - expenseLastMonth) / expenseLastMonth) * 100
      : null;

    return res.status(200).json({
      ...account?.toJSON(),
      transactions: currentMonthTransactions,
      incomePercentage,
      expensePercentage,
    });
  }
);

export const createAccountHandler = catchErrors(
  async (req: Request, res: Response) => {
    const {
      name,
      accountTypeId,
      description,
      currencyId,
      gradientId,
      balance,
      type,
    } = req.body;

    const gradient = await getColorGradient(gradientId, type);
    appAssert(gradient, BAD_REQUEST, "Invalid color or type");

    const newAccount = await Account.create({
      userId: req.userId,
      name,
      accountTypeId,
      description,
      currencyId,
      balance,
      ...(isDefaultGradient(gradient)
        ? { defaultGradientId: gradient.id }
        : { userGradientId: gradient.id }),
    });

    return res.status(201).json(newAccount);
  }
);

export const updateAccountHandler = catchErrors(
  async (req: Request, res: Response) => {
    const {
      name,
      accountTypeId,
      description,
      currencyId,
      gradientId,
      balance,
      type,
    } = req.body;

    const updatedAccount = await Account.update(
      {
        userId: req.userId,
        name,
        accountTypeId,
        description,
        currencyId,
        balance,
        ...(type === "user"
          ? { userGradientId: gradientId, defaultGradientId: undefined }
          : { defaultGradientId: gradientId, userGradientId: undefined }),
      },
      {
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      }
    );

    return res.status(200).json(updatedAccount);
  }
);

export const getAccountsGroupedByAccountTypeHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accountTypes = await AccountType.findAll();

    const resultObj = accountTypes.reduce(
      (acc, accountType) => {
        acc[accountType.name] = {
          accountTypeId: accountType.id,
          accounts: [],
        };
        return acc;
      },
      {} as Record<string, { accountTypeId: number; accounts: Account[] }>
    );

    const accounts = await Account.findAll({
      where: {
        userId: req.userId,
      },
      include: [
        { model: AccountType, as: "accountType", attributes: ["id", "name"] },
        {
          model: Currency,
          as: "currency",
          attributes: ["id", "code", "symbol"],
        },
      ],
    });

    accounts.forEach((account) => {
      const accountType = resultObj[account.accountType.name];
      if (accountType) {
        accountType.accounts.push(account);
      }
    });

    return res.status(200).json(resultObj);
  }
);

export const setDefaultAccountHandler = catchErrors(
  async (req: Request, res: Response) => {
    console.log(
      "Setting default account for user:",
      req.userId,
      req.body.accountId
    );
    const accountId = req.body.accountId as string;
    const userId = req.userId as number;

    const updatedAccount = await User.update(
      { primaryAccountId: parseInt(accountId) },
      {
        where: {
          id: userId,
        },
      }
    );

    if (updatedAccount[0] === 0) {
      return res
        .status(404)
        .json({ message: "Account not found or not updated" });
    }

    return res
      .status(200)
      .json({ message: "Default account set successfully" });
  }
);

export const deleteAccountHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accountId = req.params.id;
    const userId = req.userId;

    const deletedCount = await Account.destroy({
      where: {
        id: accountId,
        userId: userId,
      },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Account not found or not deleted" });
    }

    return res.status(200).json({ message: "Account deleted successfully" });
  }
);

export const getAccountsDropDownHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accounts = await Account.findAll({
      where: {
        userId: req.userId,
      },
      include: [
        { model: AccountType, as: "accountType", attributes: ["id", "name"] },
        {
          model: Currency,
          as: "currency",
          attributes: ["id", "code", "symbol"],
        },
      ],
    });

    const dropdownData = accounts.map((account) => ({
      id: account.id,
      value: `${account.name} (${account.accountType.name})`,
    }));

    return res.status(200).json(dropdownData);
  }
);
