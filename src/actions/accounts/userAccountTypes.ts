"use server";

import { createEnhancedAxios } from "../../configs/axios";

export interface AccountType {
  id: number;
  userId: null | number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserAccountTypes(): Promise<AccountType[]> {
  const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/account-types`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getUserAccountType(id: string): Promise<AccountType> {
  const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/account-types/${id}`, {
    withCredentials: true,
  });
  return res.data;
}

export type CreateAccountType = Omit<AccountType, "id" | "createdAt" | "updatedAt">;
export async function createUserAccountType(data: CreateAccountType): Promise<boolean> {
  const res = await createEnhancedAxios().post(`${import.meta.env.VITE_API_URL}/account-types`, data, {
    withCredentials: true,
  });
  return res.status === 201;
}

export async function updateUserAccountType(id: string, data: CreateAccountType): Promise<boolean> {
  const res = await createEnhancedAxios().put(`${import.meta.env.VITE_API_URL}/account-types/${id}`, data, {
    withCredentials: true,
  });
  return res.status === 200;
}

export type DeleteAccountType = Pick<AccountType, "id">;
export async function deleteUserAccountType(data: DeleteAccountType) {
  const res = await createEnhancedAxios().delete(`${import.meta.env.VITE_API_URL}/account-types/${data.id}`, {
    withCredentials: true,
  });
  return res.status === 200;
}
