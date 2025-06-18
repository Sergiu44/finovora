import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../utils/constants/http";
import { clearAuthCookies } from "../../utils/utilities/cookies";
import AppError from "../../utils/utilities/AppError";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  res.status(BAD_REQUEST).json({ message: error.message, errors });
};

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`PATH: ${req.path} -> `, error);

  if (req.path === "/auth/refresh") clearAuthCookies(res);

  if (error instanceof z.ZodError) return handleZodError(res, error);

  if (error instanceof AppError) return handleAppError(res, error);

  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
