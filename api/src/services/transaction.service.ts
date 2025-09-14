import { BAD_REQUEST, NOT_FOUND } from "../../utils/constants/http";
import appAssert from "../../utils/utilities/appAssert";
import { TransactionTypes } from "../lib/enums/TransactionTypes";
import { Account } from "../models/account";
import { Category } from "../models/category";
import { Transaction } from "../models/transaction";
import { TransactionType } from "../models/transactionType";
import User from "../models/user";
import { Op, WhereOptions } from "sequelize";

type CreateTransactionAttributes = {
  accountId: number;
  amount: number;
  description: string;
  transactionDate: Date;
  transactionTypeId: number;
  categoryId: number;
  userId: number;
};
export const createTransaction = async (transaction: CreateTransactionAttributes) => {
  const existingUser = await User.findByPk(transaction.userId);
  appAssert(existingUser, NOT_FOUND, "User does not exist");
  const existingAccount = await Account.findByPk(transaction.accountId);
  appAssert(existingAccount, NOT_FOUND, "Account does not exist");
  const existingTransactionType = await TransactionType.findByPk(transaction.transactionTypeId);
  appAssert(existingTransactionType, NOT_FOUND, "Transaction type does not exist");
  const existingCategory = await Category.findByPk(transaction.categoryId);
  appAssert(existingCategory, NOT_FOUND, "Category does not exist");

  switch (transaction.transactionTypeId) {
    case TransactionTypes.Income:
      existingAccount.balance += transaction.amount;
      break;
    case TransactionTypes.Expense:
      existingAccount.balance -= transaction.amount;
      break;
    default:
      appAssert(false, BAD_REQUEST, "Invalid transaction type");
  }

  existingAccount.save();

  const newTransaction = await Transaction.create(transaction);
  return newTransaction;
};

export const getTransactionsForAccount = async (
  accountId: number,
  userId: number,
  startDate?: string,
  endDate?: string
) => {
  const existingAccount = await Account.findByPk(accountId);
  appAssert(existingAccount, NOT_FOUND, "Account does not exist");
  appAssert(existingAccount.userId === userId, NOT_FOUND, "Account does not belong to user");

  // Build where clause for date filtering
  const whereClause: WhereOptions = { accountId, userId };

  if (startDate && endDate) {
    whereClause.transactionDate = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    whereClause.transactionDate = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    whereClause.transactionDate = {
      [Op.lte]: new Date(endDate),
    };
  }

  const transactions = await Transaction.findAll({
    where: whereClause,
    include: [
      {
        model: TransactionType,
        as: "transactionType",
      },
      {
        model: Category,
        as: "category",
      },
    ],
    order: [["transactionDate", "DESC"]],
  });
  return transactions;
};
