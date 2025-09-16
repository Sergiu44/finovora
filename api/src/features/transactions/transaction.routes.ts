import { Router } from "express";
import authenticate from "../../middleware/authenticate";
import {
  createTransactionHandler,
  getTransactionsForAccountHandler,
} from "./transaction.controller";

const transactionRoutes = Router();

transactionRoutes.post("/", [authenticate], createTransactionHandler);
transactionRoutes.get(
  "/:accountId",
  [authenticate],
  getTransactionsForAccountHandler
);

export default transactionRoutes;
