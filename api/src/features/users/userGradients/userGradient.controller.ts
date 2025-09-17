import { Request, Response } from "express";
import catchErrors from "../../../utils/utilities/catchErrors";
import { UserGradient } from "./userGradient";
import User from "../user";
import { NOT_FOUND } from "../../../utils/constants/http";
import appAssert from "../../../utils/utilities/appAssert";

export const getUserGradientsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userGradients = await UserGradient.findAll({
      where: {
        userId: req.userId,
      },
    });
    return res.status(200).json({
      items: userGradients,
      status: true,
      message: "List of user gradients successful",
    });
  }
);

export const createUserGradientHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    appAssert(user, NOT_FOUND, "User not found");
    const userGradient = await UserGradient.create({
      ...req.body,
      userId,
    });
    return res.status(201).json({
      item: userGradient,
      status: true,
      message: "User gradient created successfully",
    });
  }
);

export const deleteUserGradientHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userGradient = await UserGradient.findByPk(req.params.id);
    appAssert(userGradient, NOT_FOUND, "User gradient not found");
    await userGradient.destroy();
    return res.status(200).json({ status: true, message: "User gradient deleted successfully" });
  }
);
