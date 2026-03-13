import { randomUUID } from "crypto";
import { CLIENT_APP_ORIGIN } from "../../../utils/constants/env";
import { FORBIDDEN, NOT_FOUND } from "../../../utils/constants/http";
import appAssert from "../../../utils/utilities/appAssert";
import { ProfileSetupSession } from "./profileSetupSession";

export const PROFILE_SETUP_SESSION_TTL_MINUTES = 30;

export const buildSessionPath = (token: string) => `/profile-setup/${token}`;

export const buildSessionUrl = (token: string) =>
  `${CLIENT_APP_ORIGIN}${buildSessionPath(token)}`;

export const serializeSession = (session: ProfileSetupSession) => ({
  id: session.id,
  userId: session.userId,
  token: session.token,
  status: session.status,
  expiresAt: session.expiresAt,
  completedAt: session.completedAt,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

export const expireSessionIfNeeded = async (
  session?: ProfileSetupSession | null
): Promise<ProfileSetupSession | null> => {
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

export const findActiveSessionForUser = async (
  userId: number
): Promise<ProfileSetupSession | null> => {
  const session = await ProfileSetupSession.findOne({
    where: { userId, status: "active" },
    order: [["updatedAt", "DESC"]],
  });

  return await expireSessionIfNeeded(session);
};

export const findSessionForUserOrThrow = async (
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

export const createProfileSetupSession = async (
  userId: number
): Promise<ProfileSetupSession> => {
  const expiresAt = new Date(
    Date.now() + PROFILE_SETUP_SESSION_TTL_MINUTES * 60 * 1000
  );

  return await ProfileSetupSession.create({
    userId,
    token: randomUUID(),
    expiresAt,
  });
};

export const expireSession = async (
  session: ProfileSetupSession
): Promise<void> => {
  session.status = "expired";
  await session.save();
};

export const completeSession = async (
  session: ProfileSetupSession
): Promise<void> => {
  session.status = "completed";
  session.completedAt = new Date();
  await session.save();
};

