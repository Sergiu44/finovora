import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import {
  createTransactionHandler,
  deleteTransactionHandler,
  getTransactionHandler,
  getTransactionsForAccountHandler,
} from "./transaction.controller";

const transactionRoutes = Router();

transactionRoutes.post("/", [authenticate], createTransactionHandler);
transactionRoutes.get(
  "/accounts/:accountId",
  [authenticate],
  getTransactionsForAccountHandler
);
transactionRoutes.get("/:id", [authenticate], getTransactionHandler);
transactionRoutes.delete("/:id", [authenticate], deleteTransactionHandler);

export default transactionRoutes;
