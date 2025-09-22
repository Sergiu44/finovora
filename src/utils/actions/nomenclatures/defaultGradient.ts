import { createEnhancedAxios } from "../../../configs/axios";
import type { UserGradientItem } from "../users/userGradients";

export interface CardGradientItem {
  id: number;
  name: string;
  slug: string;
  colors: string[];
  type: "user" | "default";
}

export interface DefaultGradientItem {
  id: number;
  name: string;
  slug: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
}

export const isDefaultGradientItem = (
  item: DefaultGradientItem | UserGradientItem
): item is DefaultGradientItem => {
  return (
    item &&
    typeof item === "object" &&
    "color1" in item &&
    "color2" in item &&
    "color3" in item &&
    "color4" in item &&
    "color5" in item
  );
};

type GET_DEFAULT_GRADIENT_RESPONSE = {
  items: DefaultGradientItem[];
  status: boolean;
  message: string;
};

export const getDefaultGradientsAsync = async () => {
  const res = await createEnhancedAxios().get<GET_DEFAULT_GRADIENT_RESPONSE>(
    `${import.meta.env.VITE_API_URL}/nomenclatures/default-gradients`,
    { withCredentials: true }
  );
  return res.data;
};
