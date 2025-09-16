import { Router } from "express";
import { getDefaultGradientsHandler } from "./defaultGradient.controller";
import authenticate from "../../../middleware/authenticate";

const defaultGradientRoutes = Router();

defaultGradientRoutes.get("/", [authenticate], getDefaultGradientsHandler);

export default defaultGradientRoutes;
