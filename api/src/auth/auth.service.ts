import { CLIENT_APP_ORIGIN } from "../utils/constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../utils/constants/http";
import VerificationCodeTypes from "../utils/constants/verificationCodeTypes";
import appAssert from "../utils/utilities/appAssert";
import {
  DateUtils
} from "../utils/utilities/DateUtils";
import User from "../features/users/user";
import { VerificationCode } from "./verifications/verification";
import { sendEmail } from "../utils/emails/sendEmail";
import {
  createPasswordResetTemplate,
  createVerifyEmailTemplate,
} from "../utils/emails/templates";
import { Session } from "./sessions/session";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/utilities/jwt";
import { Op } from "sequelize";
import { hashPassword } from "../utils/utilities/bcrypt";
import { generateOTP } from "../utils/utilities/otpGenerator";

export type CreateAccountParams = {
  email: string;
  password: string;
  confirmPassword: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await User.findOne({ where: { email: data.email } });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  const newUser = await User.create({
    email: data.email,
    password: data.password,
  });

  const verificationCode = await VerificationCode.create({
    userId: newUser.id,
    code: generateOTP(),
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: DateUtils.fiveMinutesFromNow(),
  });

  const { error: errorEmail } = await sendEmail({
    to: newUser.email,
    ...createVerifyEmailTemplate(verificationCode.code),
  });

  if (errorEmail)
    console.log("Failed to send verification email: " + errorEmail);

  const newSession = await Session.create({
    userId: newUser.id,
    userAgent: data.userAgent,
  });
  const session = await newSession.save();

  const refreshToken = signToken(
    { sessionId: session.id },
    refreshTokenSignOptions
  );
  const accessToken = signToken({ sessionId: session.id, userId: newUser.id });

  return {
    user: newUser.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  const newUser = await User.findOne({ where: { email } });
  appAssert(newUser, NOT_FOUND, "Email/password combination does not exist");

  const isValid = await newUser.comparePassword(newUser, password);
  appAssert(isValid, UNAUTHORIZED, "Email/password combination does not exist");

  const userId = newUser.id;
  const newSession = await Session.create({
    userId,
    userAgent,
  });
  const session = await newSession.save();

  const sessionInfo = { sessionId: session.id };
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({ ...sessionInfo, userId: newUser.id });

  return {
    user: newUser.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });

  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await Session.findByPk(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.dataValues.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session not found or expired"
  );

  const sessionNeedsRefresh =
    session.dataValues.expiresAt.getTime() - now <= DateUtils.ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.dataValues.expiresAt = DateUtils.thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session.id }, refreshTokenSignOptions)
    : undefined;
  const accessToken = signToken({
    userId: session.dataValues.userId,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const verifyEmail = async (verificationCode: string) => {
  const validCode = await VerificationCode.findOne({
    where: {
      type: VerificationCodeTypes.EmailVerification,
      expiresAt: { [Op.gt]: new Date() },
      code: verificationCode,
    },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const user = await User.findOne({
    where: { id: validCode.dataValues.userId },
  });
  appAssert(user, INTERNAL_SERVER_ERROR, "Failed to verify email");

  user.verified = true;
  await user.save();

  await validCode.destroy();

  return {
    user: user.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  appAssert(user, NOT_FOUND, "User not found");

  const fiveMinAgo = DateUtils.fiveMinutesAgo();
  const count = await VerificationCode.count({
    where: {
      userId: user.id,
      type: VerificationCodeTypes.PasswordReset,
      createdAt: { [Op.gt]: DateUtils.fiveMinutesAgo() },
    },
  });

  appAssert(
    count <= 1,
    TOO_MANY_REQUESTS,
    "Too many requests, please try again later"
  );

  const expiresAt = DateUtils.oneHourFromNow();
  const verificationCode = await VerificationCode.create({
    userId: user.id,
    code: generateOTP(),
    type: VerificationCodeTypes.PasswordReset,
    expiresAt,
  });

  const url = `${CLIENT_APP_ORIGIN}/password/reset?code=${verificationCode.id}&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: user.dataValues.email,
    ...createPasswordResetTemplate(url),
  });

  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );

  return {
    url,
    emailId: data?.id,
  };
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  const validCode = await VerificationCode.findOne({
    where: {
      id: verificationCode,
      type: VerificationCodeTypes.PasswordReset,
      expiresAt: { [Op.gt]: new Date() },
    },
  });

  appAssert(validCode, NOT_FOUND, "Invalid or expires verification code");

  const updatedUser = await User.findByPk(validCode.dataValues.userId);
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");
  updatedUser.set("password", await hashPassword(password));

  await validCode.destroy();

  await Session.destroy({
    where: {
      userId: updatedUser.id,
    },
  });

  return {
    user: updatedUser.omitPassword(),
  };
};
