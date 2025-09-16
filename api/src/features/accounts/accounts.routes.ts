import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import {
  createAccountHandler,
  deleteAccountHandler,
  getAccountHandler,
  getAccountsDropDownHandler,
  getAccountsForSwitchHandler,
  getAccountsGroupedByAccountTypeHandler,
  getAccountsHandler,
  setDefaultAccountHandler,
  updateAccountHandler,
} from "./accounts.controller";
import { validateDto } from "../../middleware/validate";
import { updateDefaultAccountSchema } from "./accounts.schemas";

const accountsRoutes = Router();

accountsRoutes.put(
  "/set",
  [authenticate, validateDto(updateDefaultAccountSchema)],
  setDefaultAccountHandler
);
accountsRoutes.get("/", [authenticate], getAccountsHandler);
accountsRoutes.get("/dropdown", [authenticate], getAccountsDropDownHandler);
accountsRoutes.post("/", [authenticate], createAccountHandler);
accountsRoutes.get("/switch", [authenticate], getAccountsForSwitchHandler);
accountsRoutes.get(
  "/groupedByAccountTypes",
  [authenticate],
  getAccountsGroupedByAccountTypeHandler
);
accountsRoutes.put("/:id", [authenticate], updateAccountHandler);
accountsRoutes.get("/:id", [authenticate], getAccountHandler);
accountsRoutes.delete("/:id", [authenticate], deleteAccountHandler);

export default accountsRoutes;
