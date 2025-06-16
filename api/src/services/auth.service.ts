import { CLIENT_APP_ORIGIN } from "../../utils/constants/env";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../../utils/constants/http";
import VerificationCodeTypes from "../../utils/constants/verificationCodeTypes";
import appAssert from "../../utils/utilities/appAssert";
import {
  fiveMinutesAgo,
  ONE_DAYS_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "../../utils/utilities/date";
import User from "../../models/user";
import VerificationCode from "../../models/verification";
import { sendEmail } from "../../utils/emails/sendEmail";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../../utils/emails/templates";
import { Session } from "../../models/session";
import { RefreshTokenPayload, refreshTokenSignOptions, signToken, verifyToken } from "../../utils/utilities/jwt";
import { Op } from "sequelize";
import { hashPassword } from "../../utils/utilities/bcrypt";

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
  const user = await newUser.save();

  const verificationCode = await VerificationCode.create({
    userId: user.id,
    type: VerificationCodeTypes.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${CLIENT_APP_ORIGIN}/email/verify/${verificationCode.id}`;
  const { error: errorEmail } = await sendEmail({
    to: user.get({ plain: true }).email,
    ...getVerifyEmailTemplate(url),
  });

  if (errorEmail) console.log("Failed to send verification email: " + errorEmail);

  const newSession = await Session.create({
    userId: user.id,
    userAgent: data.userAgent,
  });
  const session = await newSession.save();

  const refreshToken = signToken({ sessionId: session.id }, refreshTokenSignOptions);
  const accessToken = signToken({ sessionId: session.id, userId: user.id });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
  const newUser = await User.findOne({ where: { email } });
  appAssert(newUser, UNAUTHORIZED, "Invalid email or password");

  const isValid = await newUser.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

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
  appAssert(session && session.dataValues.expiresAt.getTime() > now, UNAUTHORIZED, "Session not found or expired");

  const sessionNeedsRefresh = session.dataValues.expiresAt.getTime() - now <= ONE_DAYS_MS;
  if (sessionNeedsRefresh) {
    session.dataValues.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session.id }, refreshTokenSignOptions)
    : undefined;
  const accessToken = signToken({ userId: session.dataValues.userId.toString(), sessionId: session.id });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyEmail = async (verificationCode: string) => {
  const validCode = await VerificationCode.findOne({
    where: { type: VerificationCodeTypes.EmailVerification, expiresAt: { [Op.gt]: new Date() }, id: verificationCode },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const user = await User.findOne({ where: { id: validCode.dataValues.userId } });
  appAssert(user, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await user.update("verified", true);

  await validCode.destroy();

  return {
    user: user.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  appAssert(user, NOT_FOUND, "User not found");

  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCode.count({
    where: {
      userId: user.id,
      type: VerificationCodeTypes.PasswordReset,
      createdAt: { [Op.gt]: fiveMinAgo },
    },
  });

  appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many requests, please try again later");

  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCode.create({
    userId: user.id,
    type: VerificationCodeTypes.PasswordReset,
    expiresAt,
  });

  const url = `${CLIENT_APP_ORIGIN}/password/reset?code=${verificationCode.id}&exp=${expiresAt.getTime()}`;

  const { data, error } = await sendEmail({
    to: user.dataValues.email,
    ...getPasswordResetTemplate(url),
  });

  appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);

  return {
    url,
    emailId: data?.id,
  };
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

export const resetPassword = async ({ password, verificationCode }: ResetPasswordParams) => {
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
