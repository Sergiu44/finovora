import express from "express";
import { getCurrenciesDropDownHandler, getCurrenciesHandler } from "./currency.controller";

const currencyRoutes = express.Router();

currencyRoutes.get("/", getCurrenciesHandler);
currencyRoutes.get("/dropdown", getCurrenciesDropDownHandler);

export default currencyRoutes;
