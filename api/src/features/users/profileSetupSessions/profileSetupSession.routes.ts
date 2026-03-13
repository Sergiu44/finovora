import { Router } from "express";
import multer from "multer";
import authenticate from "../../../middleware/authenticate";
import {
  completeProfileSetupSessionHandler,
  createOrResumeProfileSetupSessionHandler,
  getProfileSetupSessionHandler,
} from "./profileSetupSession.controller";
import { validateDto } from "../../../middleware/validate";
import { createOrResumeProfileSetupSessionSchema } from "./profileSetupSession.schemas";

const profileSetupSessionRoutes = Router();
const upload = multer();

profileSetupSessionRoutes.post(
  "/",
  [authenticate, validateDto(createOrResumeProfileSetupSessionSchema)],
  createOrResumeProfileSetupSessionHandler
);

profileSetupSessionRoutes.get(
  "/:token",
  [authenticate],
  getProfileSetupSessionHandler
);

profileSetupSessionRoutes.post(
  "/:token/setup",
  [authenticate, upload.any()],
  completeProfileSetupSessionHandler
);

export default profileSetupSessionRoutes;

