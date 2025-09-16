import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import { Session } from "./session";
import { Op } from "sequelize";
import { NOT_FOUND, OK } from "../../utils/constants/http";
import z from "zod";
import appAssert from "../../utils/utilities/appAssert";

export const getSessionsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const sessions = await Session.findAll({
      where: {
        userId: req.userId,
        expiresAt: { [Op.gt]: Date.now() },
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(OK).json(
      sessions.map((session) => ({
        ...session,
        isCurrent: session.id === req.sessionId,
      }))
    );
  }
);

export const deleteSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const sessionId = z.string().parse(req.params.id);
    const deleted = await Session.destroy({
      where: {
        id: sessionId,
        userId: req.userId,
      },
    });

    appAssert(deleted >= 1, NOT_FOUND, "Session not found");

    return res.status(OK).json({
      message: "Session removed successfully",
    });
  }
);
