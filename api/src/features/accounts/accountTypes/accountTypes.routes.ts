import { Router } from "express";
import {
  createAccountTypeHandler,
  deleteAccountTypeHandler,
  getAccountTypeHandler,
  getAccountTypesDropDownHandler,
  getAccountTypesHandler,
  updateAccountTypeHandler,
} from "./accountTypes.controller";
import authenticate from "../../../middleware/authenticate";

// Prefix: /account-types
const accountTypesRoutes = Router();

accountTypesRoutes.get("/", [authenticate], getAccountTypesHandler);
accountTypesRoutes.get(
  "/dropdown",
  [authenticate],
  getAccountTypesDropDownHandler
);
accountTypesRoutes.get("/:id", [authenticate], getAccountTypeHandler);
accountTypesRoutes.post("/", [authenticate], createAccountTypeHandler); // Assuming you want to handle POST requests as well
accountTypesRoutes.put("/:id", [authenticate], updateAccountTypeHandler);
accountTypesRoutes.delete("/:id", [authenticate], deleteAccountTypeHandler);

export default accountTypesRoutes;
