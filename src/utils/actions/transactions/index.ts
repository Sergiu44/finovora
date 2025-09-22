import { createEnhancedAxios } from "../../../configs/axios";

export interface TransactionAccountCardFormat {
  amount: string;
  category: {
    id: number;
    name: string;
  };
  description: string;
  id: number;
  transactionDate: Date;
  transactionType: {
    id: number;
    name: string;
  };
}

export interface CreateTransactionAttributes {
  accountId: number;
  amount: number;
  description: string;
  transactionDate: Date;
  transactionTypeId: number;
  categoryId: number;
  userId: number;
}

export async function createTransactionAsync(
  transaction: CreateTransactionAttributes
) {
  const { data } = await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/transactions`,
    transaction,
    {
      withCredentials: true,
    }
  );
  return data;
}

export async function getTransactionsForAccountAsync(
  accountId: number,
  startDate?: string,
  endDate?: string
) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const queryString = params.toString();
  const url = `${import.meta.env.VITE_API_URL}/transactions/${accountId}${queryString ? `?${queryString}` : ""}`;

  const { data } = await createEnhancedAxios().get(url, {
    withCredentials: true,
  });
  return data;
}
