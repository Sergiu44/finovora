import { createEnhancedAxios } from "../../../configs/axios";

export interface BaseCategory {
  id: string;
  name: string;
  subCategories: BaseCategory[];
}

export async function getCategories(categoriesType?: number): Promise<BaseCategory[]> {
  const { data } = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/categories`, {
    withCredentials: true,
    params: {
      type: categoriesType,
    },
  });
  return data;
}

export interface CreateCategory {
  name: string;
  transactionTypeId: number;
  parentCategoryId?: string;
}
export async function createCategory(data: CreateCategory): Promise<boolean[]> {
  const { data: response } = await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/categories`,
    { ...data },
    {
      withCredentials: true,
    }
  );
  return response;
}

export type DeleteCategoriesList = string[];
export async function deleteCategories(data: DeleteCategoriesList): Promise<boolean> {
  const { data: response } = await createEnhancedAxios().delete(`${import.meta.env.VITE_API_URL}/categories`, {
    data,
    withCredentials: true,
  });
  return response;
}

export async function editCategory(name: string, id: string): Promise<boolean> {
  const { data: response } = await createEnhancedAxios().put(
    `${import.meta.env.VITE_API_URL}/categories/${id}`,
    { name },
    {
      withCredentials: true,
    }
  );
  return response;
}
