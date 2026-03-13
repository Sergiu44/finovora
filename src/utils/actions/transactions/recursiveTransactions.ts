import { createEnhancedAxios } from "../../../configs/axios";

export interface RecursiveTransaction {
  name: string;
  id: number;
}

export const getRecursiveTransactionsAsync = async () => {
  const { data } = await createEnhancedAxios().get<RecursiveTransaction[]>(
    `${import.meta.env.BASE_URL}/recursive-transactions`,
    {
      withCredentials: true,
    }
  );
  return data;
};
