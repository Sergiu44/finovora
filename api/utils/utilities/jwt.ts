import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWT_REFRESH_TOKEN, JWT_TOKEN } from "../constants/env";
import jwt from "jsonwebtoken";

export type RefreshTokenPayload = {
  sessionId: number;
};

export type AccessTokenPayload = {
  userId: number;
  sessionId: number;
};

type SignOptionsWithSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

export const accessTokenSignOptions: SignOptionsWithSecret = {
  expiresIn: "15m",
  secret: JWT_TOKEN,
};

export const refreshTokenSignOptions: SignOptionsWithSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_TOKEN,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsWithSecret
): string => {
  const { secret, ...signOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOptions });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_TOKEN, ...verifyOptions } = options || {};
  try {
    const payload = jwt.verify(token, secret, { ...defaults, ...verifyOptions }) as TPayload;
    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};
