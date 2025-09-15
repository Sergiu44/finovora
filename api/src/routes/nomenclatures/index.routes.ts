import { Router } from "express";
import defaultGradientRoutes from "./default-gradient.routes";

const nomenclaturesRoutes = Router();

nomenclaturesRoutes.use("/default-gradients", defaultGradientRoutes);

export default nomenclaturesRoutes;
