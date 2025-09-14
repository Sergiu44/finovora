"use server";

import { createEnhancedAxios } from "../../../configs/axios";

export interface Account {
  id: number;
  userId: number;
  accountTypeId: number;
  currencyId: number;
  balance: number;
  color: string | null;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AccountListItem extends Account {
  currency: {
    id: number;
    name: string;
    symbol: string;
  };
  accountType: {
    id: number;
    name: string;
  };
}

export interface AccountWithAccountType {
  [key: string]: { accountTypeId: string; accounts: AccountListItem[] };
}

export async function getUserAccounts(): Promise<Account[]> {
  const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/accounts`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getUserAccount(accountId: number): Promise<Account[]> {
  const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/accounts/${accountId}`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getAccountsForSwitch(): Promise<AccountListItem[]> {
  const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/accounts/switch`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getUserAccountsGroupedByAccountTypes(): Promise<AccountWithAccountType> {
  const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/accounts/groupedByAccountTypes`, {
    withCredentials: true,
  });
  return res.data;
}

export type CreateAccount = Omit<Account, "id" | "createdAt" | "updatedAt">;
export async function createUserAccount(data: CreateAccount): Promise<boolean> {
  const res = await createEnhancedAxios().post(`${import.meta.env.VITE_API_URL}/accounts`, data, {
    withCredentials: true,
  });
  return res.status === 201;
}

export async function updateUserAccount(id: string, data: CreateAccount): Promise<boolean> {
  const res = await createEnhancedAxios().put(`${import.meta.env.VITE_API_URL}/accounts/${id}`, data, {
    withCredentials: true,
  });
  return res.status === 201;
}

export type DeleteAccount = Pick<Account, "id">;
export async function deleteUserAccount(data: DeleteAccount) {
  const res = await createEnhancedAxios().delete(`${import.meta.env.VITE_API_URL}/accounts/${data.id}`, {
    withCredentials: true,
  });
  return res.status === 200;
}

export async function setUserAccountAsDefault(accountId: number): Promise<boolean> {
  const res = await createEnhancedAxios().put(
    `${import.meta.env.VITE_API_URL}/accounts/set`,
    { accountId },
    {
      withCredentials: true,
    }
  );
  return res.status === 200;
}
