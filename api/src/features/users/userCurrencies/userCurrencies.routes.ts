import { Router } from "express";
import authenticate from "../../../middleware/authenticate";
import { getUserCurrenciesHandler, createUserCurrencyHandler, setPrimaryCurrencyHandler, deleteUserCurrencyHandler, getUserCurrencyRateHandler } from "./userCurrencies.controller";

const userCurrenciesRoutes = Router();

userCurrenciesRoutes.get("/", [authenticate], getUserCurrenciesHandler);
userCurrenciesRoutes.post("/", [authenticate], createUserCurrencyHandler);
userCurrenciesRoutes.put("/:id/set-primary", [authenticate], setPrimaryCurrencyHandler);
userCurrenciesRoutes.get("/:id/rate", [authenticate], getUserCurrencyRateHandler);
userCurrenciesRoutes.delete("/:id", [authenticate], deleteUserCurrencyHandler);

export default userCurrenciesRoutes;