import { Router } from "express";
import { getUserHandler, getUserProfileHandler, updateUserProfileHandler } from "./user.controller";
import authenticate from "../../middleware/authenticate";
import { validateDto } from "../../middleware/validate";
import { updateUserProfileSchema } from "./user.schemas";

const userRoutes = Router();

userRoutes.get("/", getUserHandler);
userRoutes.get("/profile", [authenticate], getUserProfileHandler);
userRoutes.put("/profile", [authenticate, validateDto(updateUserProfileSchema)], updateUserProfileHandler);

export default userRoutes;
