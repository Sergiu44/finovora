import { Request, Response } from "express";
import catchErrors from "../../../utils/utilities/catchErrors";
import { AccountType } from "../../models/accountType";
import { Op } from "sequelize";

export const getAccountTypesHandler = catchErrors(async (req: Request, res: Response) => {
  console.log(req.userId);
  const userAccountTypes = await AccountType.findAll({
    where: {
      [Op.or]: [{ userId: req.userId }, { userId: null }],
    },
  });

  return res.status(200).json(userAccountTypes);
});
