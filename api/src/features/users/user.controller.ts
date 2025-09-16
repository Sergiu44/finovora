import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import User from "./user";
import appAssert from "../../utils/utilities/appAssert";
import { NOT_FOUND } from "../../utils/constants/http";

export const getUserHandler = catchErrors(
  async (req: Request, res: Response) => {
    const user = await User.findByPk(req.userId);
    appAssert(user, NOT_FOUND, "User not found");
    return res.status(200).json(user.omitPassword());
  }
);
