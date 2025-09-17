import { Router } from "express";
import authenticate from "../../../middleware/authenticate";
import {
  createUserGradientHandler,
  deleteUserGradientHandler,
  getUserGradientsHandler,
} from "./userGradient.controller";
import { validateDto } from "../../../middleware/validate";
import { createUserGradientSchema } from "./userGradient.schemas";

const userGradientRoutes = Router();

userGradientRoutes.get("/", [authenticate], getUserGradientsHandler);
userGradientRoutes.post(
  "/",
  [authenticate, validateDto(createUserGradientSchema)],
  createUserGradientHandler
);
userGradientRoutes.delete("/:id", [authenticate], deleteUserGradientHandler);

export default userGradientRoutes;
