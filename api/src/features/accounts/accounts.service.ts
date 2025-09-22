import { DefaultGradient } from "../nomenclatures/defaultGradients/defaultGradient";
import { UserGradient } from "../users/userGradients/userGradient";

export const getColorGradient = (colorId: string, type: "default" | "user") => {
  if (type === "default") {
    return DefaultGradient.findByPk(colorId);
  }
  return UserGradient.findByPk(colorId);
};

export const isDefaultGradient = (
  gradient: DefaultGradient | UserGradient
): gradient is DefaultGradient => {
  return gradient instanceof DefaultGradient;
};
