import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

// Custom enhancer function
export function createEnhancedAxios(config?: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);

  // Request Interceptor
  instance.interceptors.request.use(
    (request) => {
      // Always set withCredentials to true unless explicitly set to false
      if (request.withCredentials === false) {
        // If explicitly set to false, remove the property
        delete request.withCredentials;
      } else {
        request.withCredentials = true;
      }
      return request;
    },
    (error) => {
      toast.error("Request error", { description: error.message });
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response) {
        const status = error.response.status;
        // Try to infer a better type for data
        const data = error.response.data as { message?: string } | undefined;
        const message = data?.message || error.message;
        switch (status) {
          case 400:
            toast.error("Bad Request", { description: message });
            break;
          case 401:
            toast.error("Unauthorized", { description: "Session expired. Redirecting to login...", duration: 5000 });
            if (typeof window !== "undefined") {
              setTimeout(() => {
                window.location.href = "/auth/login";
              }, 5000);
            }
            break;
          case 403:
            toast.error("Forbidden", { description: message });
            break;
          case 404:
            toast.error("Not Found", { description: message });
            break;
          case 500:
            toast.error("Server Error", { description: message });
            break;
          default:
            toast.error("Error", { description: message });
        }
      } else if (error.request) {
        toast.error("No response from server", { description: error.message });
      } else {
        toast.error("Axios Error", { description: error.message });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
