import { useQuery } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import { createEnhancedAxios } from "../../../configs/axios";

export const useDropdownDataQuery = (entity: string, opt?: AxiosRequestConfig) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dropdown/" + entity],
    queryFn: async () => {
      return createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/${entity}/dropdown`, {
        withCredentials: true,
        ...opt,
      });
    },
    enabled: !!entity,
    retry: false,
  });

  return { data, isLoading, error };
};
