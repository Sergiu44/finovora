import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { CLIENT_APP_ORIGIN } from "../../../utils/constants/env";
import {
  BAD_REQUEST,
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  OK,
} from "../../../utils/constants/http";
import appAssert from "../../../utils/utilities/appAssert";
import catchErrors from "../../../utils/utilities/catchErrors";
import { ProfileSetupSession } from "./profileSetupSession";

const PROFILE_SETUP_SESSION_TTL_MINUTES = 30;

const buildSessionPath = (token: string) => `/profile-setup/${token}`;

const buildSessionUrl = (token: string) =>
  `${CLIENT_APP_ORIGIN}${buildSessionPath(token)}`;

const serializeSession = (session: ProfileSetupSession) => ({
  id: session.id,
  userId: session.userId,
  token: session.token,
  status: session.status,
  expiresAt: session.expiresAt,
  completedAt: session.completedAt,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

const expireSessionIfNeeded = async (session?: ProfileSetupSession | null) => {
  if (!session) {
    return null;
  }
  const now = new Date();
  if (session.status === "active" && session.expiresAt <= now) {
    session.status = "expired";
    await session.save();
    return null;
  }
  return session;
};

export const createOrResumeProfileSetupSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { forceNew } = (req.body ?? {}) as { forceNew?: boolean };

    let existingSession = await ProfileSetupSession.findOne({
      where: { userId, status: "active" },
      order: [["updatedAt", "DESC"]],
    });

    existingSession = await expireSessionIfNeeded(existingSession);

    if (existingSession && !forceNew) {
      return res.status(OK).json({
        resumed: true,
        session: serializeSession(existingSession),
        path: buildSessionPath(existingSession.token),
        url: buildSessionUrl(existingSession.token),
        expiresInMinutes: PROFILE_SETUP_SESSION_TTL_MINUTES,
      });
    }

    if (existingSession && forceNew) {
      existingSession.status = "expired";
      await existingSession.save();
    }

    const expiresAt = new Date(
      Date.now() + PROFILE_SETUP_SESSION_TTL_MINUTES * 60 * 1000
    );

    const session = await ProfileSetupSession.create({
      userId,
      token: randomUUID(),
      expiresAt,
    });

    return res.status(CREATED).json({
      resumed: false,
      session: serializeSession(session),
      path: buildSessionPath(session.token),
      url: buildSessionUrl(session.token),
      expiresInMinutes: PROFILE_SETUP_SESSION_TTL_MINUTES,
    });
  }
);

const findSessionForUserOrThrow = async (
  token: string,
  userId: number
): Promise<ProfileSetupSession> => {
  let session = await ProfileSetupSession.findOne({ where: { token } });
  appAssert(session, NOT_FOUND, "Session not found");
  appAssert(
    session!.userId === userId,
    FORBIDDEN,
    "You cannot access this session"
  );
  session = await expireSessionIfNeeded(session);
  appAssert(session, NOT_FOUND, "Session expired");
  return session!;
};

export const getProfileSetupSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { token } = req.params;

    const session = await findSessionForUserOrThrow(token, userId);

    return res.status(OK).json({
      session: serializeSession(session),
      path: buildSessionPath(session.token),
      url: buildSessionUrl(session.token),
    });
  }
);

export const completeProfileSetupSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { token } = req.params;

    const session = await findSessionForUserOrThrow(token, userId);

    appAssert(
      session.status === "active",
      BAD_REQUEST,
      "Session already closed"
    );

    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    return res.status(OK).json({
      session: serializeSession(session),
    });
  }
);

