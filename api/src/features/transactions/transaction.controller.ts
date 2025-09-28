import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import {
  createTransaction,
  getTransactionsForAccount,
} from "./transaction.service";

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
