import { createEnhancedAxios } from "../../../configs/axios";

export interface BaseCategory {
  id: number;
  name: string;
  subCategories: BaseCategory[];
}

export async function getCategories(
  categoriesType?: number
): Promise<BaseCategory[]> {
  const { data } = await createEnhancedAxios().get(
    `${import.meta.env.VITE_API_URL}/categories`,
    {
      withCredentials: true,
      params: {
        type: categoriesType,
      },
    }
  );
  return data;
}

export interface BaseCategoryWithBudget extends BaseCategory {
  budgetAmount: number;
  currencyId: string;
  startDate: string;
  endDate: string;
}

export async function getCategoriesWithBudget(
  categoriesType?: number
): Promise<{ categories: BaseCategoryWithBudget[]; totalIncome: number }> {
  const { data } = await createEnhancedAxios().get(
    `${import.meta.env.VITE_API_URL}/categories/budget`,
    {
      withCredentials: true,
      params: {
        transactionTypeId: categoriesType,
      },
    }
  );
  return data;
}

export interface CreateCategoryWithBudgetModel {
  budgetAmount: number;
  currencyId: string;
  startDate: string;
  endDate: string | null;
  categoryId: string;
  subCategories: CreateCategoryWithBudgetModel[];
}

export async function createBudgetPlanner(
  data: CreateCategoryWithBudgetModel[]
): Promise<boolean> {
  const { data: response } = await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/categories/budget`,
    data,
    {
      withCredentials: true,
    }
  );
  return response;
}

export interface BudgetOverviewData {
  categoryId: number;
  categoryName: string;
  budgetAmount: number;
  actualSpending: number;
  remaining: number;
  percentage: number;
  currency: {
    id: number;
    code: string;
    symbol: string;
  };
}

export async function getBudgetOverview(): Promise<BudgetOverviewData[]> {
  const { data } = await createEnhancedAxios().get(
    `${import.meta.env.VITE_API_URL}/categories/budget/overview`,
    {
      withCredentials: true,
    }
  );
  return data;
}

export interface CreateCategory {
  name: string;
  transactionTypeId: number;
  parentCategoryId?: number;
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
export async function deleteCategories(
  data: DeleteCategoriesList
): Promise<boolean> {
  const { data: response } = await createEnhancedAxios().delete(
    `${import.meta.env.VITE_API_URL}/categories`,
    {
      data,
      withCredentials: true,
    }
  );
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
