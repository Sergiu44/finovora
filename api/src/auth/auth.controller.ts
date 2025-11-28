import { Request, Response } from "express";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "./auth.schemas";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  sendVerificationCode,
  verifyEmail,
} from "./auth.service";
import { clearAuthCookies, setAuthCookies } from "../utils/utilities/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../utils/constants/http";
import { verifyToken } from "../utils/utilities/jwt";
import { Session } from "./sessions/session";
import appAssert from "../utils/utilities/appAssert";
import catchErrors from "../utils/utilities/catchErrors";
import { UserProfile } from "../features/users/userProfiles/userProfile";
import { createProfileSetupSession } from "../features/users/profileSetupSessions/profileSetupSession.service";

export const registerHandler = catchErrors(
  async (req: Request, res: Response) => {
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });

    const { user, accessToken, refreshToken } = await createAccount(request);

    // New users don't have a profile yet
    const userWithProfile = {
      ...user,
      hasProfile: false,
    };

    return setAuthCookies({ res, accessToken, refreshToken })
      .status(CREATED)
      .json(userWithProfile);
  }
);

export const loginHandler = catchErrors(async (req: Request, res: Response) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { accessToken, refreshToken, user } = await loginUser(request);
  const userProfile = await UserProfile.findOne({ where: { userId: user.id } });

  let sessionSetupToken = null;
  if(!userProfile)
    sessionSetupToken = await createProfileSetupSession(user.id);

  // Add hasProfile field to user object
  const userWithProfile = {
    ...user,
    hasProfile: Boolean(userProfile),
  };

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json({ user: userWithProfile, message: "Login succesful", redirectTo: userProfile ? "/dashboard" : `/auth/profile-setup/${sessionSetupToken?.token}` });
});

export const logoutHandler = catchErrors(
  async (req: Request, res: Response) => {
    const accessToken = req.cookies["accessToken"] as string | undefined;
    const { payload } = verifyToken(accessToken || "");

    if (payload) {
      await Session.destroy({ where: { id: payload.sessionId } });
    }

    return clearAuthCookies(res).status(OK).json({
      message: "Logout successful",
    });
  }
);

export const refreshHandler = catchErrors(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies["refreshToken"] as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshUserAccessToken(refreshToken);

    return setAuthCookies({ res, accessToken, refreshToken: newRefreshToken })
      .status(OK)
      .json({
        message: "Access Token refreshed successfully",
      });
  }
);

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({
    message: "Email verified successfully",
  });
});

export const sendPasswordResetHandler = catchErrors(
  async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);
    await sendPasswordResetEmail(email);

    return res.status(OK).json({
      message: "Password reset email sent successfully",
    });
  }
);

export const resetPasswordHandler = catchErrors(
  async (req: Request, res: Response) => {
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);
    return clearAuthCookies(res).status(OK).json({
      message: "Password reset successful",
    });
  }
);

export const sendVerificationEmailHandler = catchErrors(
  async (req: Request, res: Response) => {
    const request = emailSchema.parse(req.body.email);

    const { message, ...verificationCode } =
      await sendVerificationCode(request);

    return res.status(OK).json({
      message,
      verificationCode,
    });
  }
);
