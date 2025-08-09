import catchErrors from "../../utils/utilities/catchErrors";
import { Currency } from "../models/currency";
import { Request, Response } from "express";

export const getCurrenciesDropDownHandler = catchErrors(async (req: Request, res: Response) => {
  const userCurrencies = await Currency.findAll();

  return res
    .status(200)
    .json(userCurrencies.map((uc) => ({ id: uc.id, value: `${uc.dataValues.symbol} (${uc.dataValues.name})` })));
});
