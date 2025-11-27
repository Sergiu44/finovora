import { Router } from "express";
import authenticate from "../../../middleware/authenticate";
import {
  completeProfileSetupSessionHandler,
  createOrResumeProfileSetupSessionHandler,
  getProfileSetupSessionHandler,
} from "./profileSetupSession.controller";

const profileSetupSessionRoutes = Router();

profileSetupSessionRoutes.post(
  "/",
  [authenticate],
  createOrResumeProfileSetupSessionHandler
);

profileSetupSessionRoutes.get(
  "/:token",
  [authenticate],
  getProfileSetupSessionHandler
);

profileSetupSessionRoutes.post(
  "/:token/complete",
  [authenticate],
  completeProfileSetupSessionHandler
);

export default profileSetupSessionRoutes;

