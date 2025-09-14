import { Request, Response } from "express";
import catchErrors from "../../../utils/utilities/catchErrors";
import { Account } from "../../models/account";
import { AccountType } from "../../models/accountType";
import { Currency } from "../../models/currency";
import User from "../../models/user";
import appAssert from "../../../utils/utilities/appAssert";
import { BAD_REQUEST } from "../../../utils/constants/http";

export const getAccountsHandler = catchErrors(async (req: Request, res: Response) => {
  const accounts = await Account.findAll({
    where: {
      userId: req.userId,
    },
  });

  return res.status(200).json(accounts);
});

export const getAccountsForSwitchHandler = catchErrors(async (req: Request, res: Response) => {
  const accounts = await Account.findAll({
    where: {
      userId: req.userId,
    },
    include: [
      { model: AccountType, as: "accountType", attributes: ["id", "name"] },
      { model: Currency, as: "currency", attributes: ["id", "code", "symbol"] },
    ],
  });

  return res.status(200).json(accounts);
});

export const getAccountHandler = catchErrors(async (req: Request, res: Response) => {
  const account = await Account.findOne({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
    include: [{ model: Currency, as: "currency", attributes: ["id", "code", "symbol"] }],
  });

  return res.status(200).json(account);
});

export const createAccountHandler = catchErrors(async (req: Request, res: Response) => {
  const { name, accountTypeId, description, currencyId, color, balance } = req.body;

  const newAccount = await Account.create({
    userId: req.userId,
    name,
    accountTypeId,
    description,
    currencyId,
    color,
    balance,
  });

  return res.status(201).json(newAccount);
});

export const updateAccountHandler = catchErrors(async (req: Request, res: Response) => {
  const { name, accountTypeId, description, currencyId, color, balance } = req.body;

  const updatedAccount = await Account.update(
    {
      userId: req.userId,
      name,
      accountTypeId,
      description,
      currencyId,
      color,
      balance,
    },
    {
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    }
  );

  return res.status(200).json(updatedAccount);
});

export const getAccountsGroupedByAccountTypeHandler = catchErrors(async (req: Request, res: Response) => {
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
      { model: Currency, as: "currency", attributes: ["id", "code", "symbol"] },
    ],
  });

  accounts.forEach((account) => {
    const accountType = resultObj[account.accountType.name];
    if (accountType) {
      accountType.accounts.push(account);
    }
  });

  return res.status(200).json(resultObj);
});

export const setDefaultAccountHandler = catchErrors(async (req: Request, res: Response) => {
  console.log("Setting default account for user:", req.userId, req.body.accountId);
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
    return res.status(404).json({ message: "Account not found or not updated" });
  }

  return res.status(200).json({ message: "Default account set successfully" });
});

export const deleteAccountHandler = catchErrors(async (req: Request, res: Response) => {
  const accountId = req.params.id;
  const userId = req.userId;

  const deletedCount = await Account.destroy({
    where: {
      id: accountId,
      userId: userId,
    },
  });

  if (deletedCount === 0) {
    return res.status(404).json({ message: "Account not found or not deleted" });
  }

  return res.status(200).json({ message: "Account deleted successfully" });
});

export const getAccountsDropDownHandler = catchErrors(async (req: Request, res: Response) => {
  const accounts = await Account.findAll({
    where: {
      userId: req.userId,
    },
    include: [
      { model: AccountType, as: "accountType", attributes: ["id", "name"] },
      { model: Currency, as: "currency", attributes: ["id", "code", "symbol"] },
    ],
  });

  const dropdownData = accounts.map((account) => ({
    id: account.id,
    value: `${account.name} (${account.accountType.name})`,
  }));

  return res.status(200).json(dropdownData);
});
