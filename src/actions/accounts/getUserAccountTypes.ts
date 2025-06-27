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
