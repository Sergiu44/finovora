import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import {
  createTransaction,
  getTransactionsForAccount,
} from "./transaction.service";
import { Transaction } from "./transaction";
import { TransactionType } from "./transactionTypes/transactionType";
import { Category } from "../categories/category";
import { Account } from "../accounts/account";
import appAssert from "../../utils/utilities/appAssert";
import { NOT_FOUND } from "../../utils/constants/http";
import { Currency } from "../currencies/currency";

export const createTransactionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const {
      accountId,
      amount,
      description,
      transactionDate,
      transactionTypeId,
      categoryId,
      destinationAccountId,
    } = req.body;
    const transaction = await createTransaction({
      accountId,
      destinationAccountId,
      amount,
      description,
      transactionDate,
      transactionTypeId,
      categoryId,
      userId: req.userId,
    });
    return res.status(201).json(transaction);
  }
);

export const getTransactionsForAccountHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const { startDate, endDate } = req.query;

    const transactions = await getTransactionsForAccount(
      Number.parseInt(accountId),
      req.userId,
      startDate as string,
      endDate as string
    );
    return res.status(200).json(transactions);
  }
);

export const getTransactionHandler = catchErrors(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(Number.parseInt(id), {
    include: [
      {
        model: TransactionType,
        as: "transactionType",
      },
      {
        model: Category,
        as: "category",
      },
      {
        model: Account,
        foreignKey: "accountId",
        as: "account",
      },
      {
        model: Account,
        foreignKey: "destinationAccountId",
        as: "destinationAccount",
      },
      {
        model: Currency,
        as: "currency"
      }
    ],
  });
  appAssert(transaction, NOT_FOUND, "Transaction not found");
  return res.status(200).json(transaction);
})
