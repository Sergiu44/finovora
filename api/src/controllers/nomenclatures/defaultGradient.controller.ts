import { Request, Response } from "express";
import catchErrors from "../../../utils/utilities/catchErrors";
import { DefaultGradient } from "../../models/nomenclatures/defaultGradient";
import User from "../../models/user";
import appAssert from "../../../utils/utilities/appAssert";
import { NOT_FOUND } from "../../../utils/constants/http";

export const getDefaultGradientsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    appAssert(user, NOT_FOUND, "User not found");
    const defaultGradients = await DefaultGradient.findAll();

    return res.status(200).send({
      items: defaultGradients,
      status: true,
      message: "List of default gradients successful",
    });
  }
);
