import { createEnhancedAxios } from "../../../configs/axios"

export const getUserCurrenciesAsync = async () => {
    const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/user-currencies`, {
        withCredentials: true,
    });
    return res.data;
}

export const addUserCurrencyAsync = async (currencyId: number) => {
    const res = await createEnhancedAxios().post(
        `${import.meta.env.VITE_API_URL}/user-currencies`,
        { currencyId },
        {
            withCredentials: true,
        }
    );
    return res.data;
}

export const setPrimaryCurrencyAsync = async (userCurrencyId: number) => {
    const res = await createEnhancedAxios().put(
        `${import.meta.env.VITE_API_URL}/user-currencies/${userCurrencyId}/set-primary`,
        {},
        {
            withCredentials: true,
        }
    );
    return res.data;
}

export const deleteUserCurrencyAsync = async (userCurrencyId: number) => {
    const res = await createEnhancedAxios().delete(
        `${import.meta.env.VITE_API_URL}/user-currencies/${userCurrencyId}`,
        {
            withCredentials: true,
        }
    );
    return res.data;
}