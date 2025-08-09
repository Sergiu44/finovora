import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import {
  createAccountHandler,
  getAccountHandler,
  getAccountsForSwitchHandler,
  getAccountsGroupedByAccountTypeHandler,
  getAccountsHandler,
  setDefaultAccountHandler,
  updateAccountHandler,
} from "../../controllers/accounts/accounts.controller";

const accountsRoutes = Router();

accountsRoutes.put("/set", [authenticate], setDefaultAccountHandler);
accountsRoutes.get("/", [authenticate], getAccountsHandler);
accountsRoutes.post("/", [authenticate], createAccountHandler);
accountsRoutes.get("/switch", [authenticate], getAccountsForSwitchHandler);
accountsRoutes.get("/groupedByAccountTypes", [authenticate], getAccountsGroupedByAccountTypeHandler);
accountsRoutes.put("/:id", [authenticate], updateAccountHandler);
accountsRoutes.get("/:id", [authenticate], getAccountHandler);

export default accountsRoutes;
