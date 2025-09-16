import { RequestHandler } from "express";
import appAssert from "../utils/utilities/appAssert";
import { UNAUTHORIZED } from "../utils/constants/http";
import AppErrorCode from "../utils/constants/appErrorCode";
import { verifyToken } from "../utils/utilities/jwt";

const authenticate: RequestHandler = (req, _, next) => {
  const accessToken = req.cookies["accessToken"] as string | undefined;

  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId;
  req.sessionId = payload.sessionId;
  next();
};

export default authenticate;
