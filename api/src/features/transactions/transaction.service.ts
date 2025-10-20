import { BAD_REQUEST, NOT_FOUND } from "../../utils/constants/http";
import appAssert from "../../utils/utilities/appAssert";
import { TransactionTypes } from "../../lib/enums/TransactionTypes";
import { Account } from "../accounts/account";
import { Category } from "../categories/category";
import { Transaction } from "./transaction";
import { TransactionType } from "./transactionTypes/transactionType";
import User from "../users/user";
import { Op, Sequelize, WhereOptions } from "sequelize";
import SequelizeDatabaseWrapper from "../../config/db/sequelize";
import { DateUtils } from "../../utils/utilities/DateUtils";

type CreateTransactionAttributes = {
  accountId: number;
  destinationAccountId?: number;
  amount: number;
  description: string;
  transactionDate: Date;
  transactionTypeId: number;
  categoryId: number;
  userId: number;
};
export const createTransaction = async (
  transaction: CreateTransactionAttributes
) => {
  // Start a managed transaction
  const result = await SequelizeDatabaseWrapper.getInstance()
    .getDatabaseInstance()
    .transaction(async (t) => {
      // Find all required entities within the transaction
      const [existingUser, existingAccount, existingTransactionType] =
        await Promise.all([
          User.findByPk(transaction.userId, { transaction: t, lock: true }),
          Account.findByPk(transaction.accountId, {
            transaction: t,
            lock: true,
          }),
          TransactionType.findByPk(transaction.transactionTypeId, {
            transaction: t,
          }),
        ]);

      // Validate existence of required entities
      appAssert(existingUser, NOT_FOUND, "User does not exist");
      appAssert(existingAccount, NOT_FOUND, "Account does not exist");
      appAssert(
        existingTransactionType,
        NOT_FOUND,
        "Transaction type does not exist"
      );

      // Handle destination account for transfers
      let existingDestinationAccount: Account | null = null;
      if (transaction.destinationAccountId) {
        existingDestinationAccount = await Account.findByPk(
          transaction.destinationAccountId,
          {
            transaction: t,
            lock: true,
          }
        );
        appAssert(
          existingDestinationAccount,
          NOT_FOUND,
          "Destination account does not exist"
        );
      }

      // Update account balances based on transaction type
      const sequelize =
        SequelizeDatabaseWrapper.getInstance().getDatabaseInstance();

      switch (transaction.transactionTypeId) {
        case TransactionTypes.Income:
          await Account.update(
            {
              balance: sequelize.literal(`balance + ${transaction.amount}`),
            },
            {
              where: { id: existingAccount.id },
              transaction: t,
            }
          );
          break;
        case TransactionTypes.Expense:
          // Ensure sufficient balance for expense
          appAssert(
            existingAccount.balance >= transaction.amount,
            BAD_REQUEST,
            "Insufficient balance for this transaction"
          );
          await Account.update(
            {
              balance: sequelize.literal(`balance - ${transaction.amount}`),
            },
            {
              where: { id: existingAccount.id },
              transaction: t,
            }
          );
          break;
        case TransactionTypes.Transfer:
          // Ensure sufficient balance for transfer
          appAssert(
            existingAccount.balance >= transaction.amount,
            BAD_REQUEST,
            "Insufficient balance for this transfer"
          );

          // Update source account
          await Account.update(
            {
              balance: sequelize.literal(`balance - ${transaction.amount}`),
            },
            {
              where: { id: existingAccount.id },
              transaction: t,
            }
          );

          // Update destination account
          if (existingDestinationAccount) {
            await Account.update(
              {
                balance: sequelize.literal(`balance + ${transaction.amount}`),
              },
              {
                where: { id: existingDestinationAccount.id },
                transaction: t,
              }
            );
          }
          break;
        default:
          appAssert(false, BAD_REQUEST, "Invalid transaction type");
      }

      // Refresh account balances from database
      await existingAccount.reload({ transaction: t });
      if (existingDestinationAccount) {
        await existingDestinationAccount.reload({ transaction: t });
      }

      // Save account balance changes
      await existingAccount.save({ transaction: t });
      if (existingDestinationAccount) {
        await existingDestinationAccount.save({ transaction: t });
      }

      // Create the main transaction record
      const newTransaction = await Transaction.create(
        {
          ...transaction,
          amount:
            transaction.transactionTypeId === TransactionTypes.Income
              ? transaction.amount
              : -transaction.amount,
        },
        {
          transaction: t,
        }
      );

      // For transfers, create the corresponding transaction in the destination account
      if (transaction.destinationAccountId) {
        await Transaction.create(
          {
            ...transaction,
            accountId: transaction.destinationAccountId,
            destinationAccountId: transaction.accountId,
            transactionTypeId: TransactionTypes.Transfer,
            categoryId: undefined,
          },
          { transaction: t }
        );
      }

      return newTransaction;
    });

  return result;
};

export const getTransactionsForAccount = async (
  accountId: number,
  userId: number,
  startDate?: string,
  endDate?: string
) => {
  const existingAccount = await Account.findByPk(accountId);
  appAssert(existingAccount, NOT_FOUND, "Account does not exist");
  appAssert(
    existingAccount.userId === userId,
    NOT_FOUND,
    "Account does not belong to user"
  );

  // Build where clause for date filtering
  const whereClause: WhereOptions = {
    accountId,
    userId,
    transactionDate: {
      [Op.between]: [
        DateUtils.getFirstDayOfMonth(),
        DateUtils.getLastDayOfMonth(),
      ],
    },
  };

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
