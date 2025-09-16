import express from "express";
import { getCurrenciesDropDownHandler } from "./currency.controller";

const currencyRoutes = express.Router();

currencyRoutes.get("/dropdown", getCurrenciesDropDownHandler);

export default currencyRoutes;
