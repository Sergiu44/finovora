import { Router } from "express";
import { getAccountTypesHandler } from "../../controllers/accounts/accountTypes.controller";
import authenticate from "../../middleware/authenticate";

// Prefix: /account-types
const accountTypesRoutes = Router();

accountTypesRoutes.get("/", [authenticate], getAccountTypesHandler);

export default accountTypesRoutes;
