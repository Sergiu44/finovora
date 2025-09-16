import { Router } from "express";
import defaultGradientRoutes from "./defaultGradients/default-gradient.routes";

const nomenclatureRoutes = Router();

nomenclatureRoutes.use("/default-gradients", defaultGradientRoutes);

export default nomenclatureRoutes;
