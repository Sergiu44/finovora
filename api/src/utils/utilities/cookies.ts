import { NODE_ENV } from "../constants/env";
import { CookieOptions, Response } from "express";
import { DateUtils } from "./DateUtils";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  // to be changed to 15 minutes from now
  expires: DateUtils.thirtyDaysFromNow(),
});

const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: DateUtils.thirtyDaysFromNow(),
  path: "/auth/refresh",
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken?: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
  }

  return res;
};

export const clearAuthCookies = (res: Response) => {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: "/auth/refresh",
  });
};
