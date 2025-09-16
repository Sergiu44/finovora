import { NextFunction, Request, RequestHandler, Response } from "express";
import { AnyZodObject } from "zod";
import { BAD_REQUEST } from "../utils/constants/http";

export const validateDto: (schema: AnyZodObject) => RequestHandler =
  (schema: AnyZodObject) => (req, res, next) => {
    const result = schema.safeParse({
      ...req.body,
    });

    if (result.error && result.error?.issues.length > 0) {
      res.status(BAD_REQUEST).json({
        message: "Invalid request body",
        errors: result.error.issues,
      });
    }

    next();
  };

export const validateParams =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      ...req.params,
    });

    if (result.error && result.error?.issues.length > 0) {
      return res.status(BAD_REQUEST).json({
        message: "Invalid request body",
        errors: result.error.issues,
      });
    }

    next();
  };
