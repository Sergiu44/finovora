import { createEnhancedAxios } from "../../../configs/axios";

export type UserGradientItem = {
  id: number;
  name: string;
  slug: string;
  to: string;
  from: string;
};

type GET_USER_GRADIENTS_RESPONSE = {
  items: UserGradientItem[];
  status: boolean;
  message: string;
};

export const getUserGradientsAsync =
  async (): Promise<GET_USER_GRADIENTS_RESPONSE> => {
    const res = await createEnhancedAxios().get(
      `${import.meta.env.VITE_API_URL}/user-gradients`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  };

type CREATE_USER_GRADIENT_RESPONSE = {
  item: UserGradientItem;
  status: boolean;
  message: string;
};

export const createUserGradientAsync = async (
  userGradient: Omit<UserGradientItem, "id">
): Promise<CREATE_USER_GRADIENT_RESPONSE> => {
  const res = await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/user-gradients`,
    userGradient,
    { withCredentials: true }
  );
  return res.data;
};

type DELETE_USER_GRADIENT_RESPONSE = {
  status: boolean;
  message: string;
};

export const deleteUserGradientAsync = async (
  id: number
): Promise<DELETE_USER_GRADIENT_RESPONSE> => {
  const res = await createEnhancedAxios().delete(
    `${import.meta.env.VITE_API_URL}/user-gradients/${id}`,
    { withCredentials: true }
  );
  return res.data;
};
