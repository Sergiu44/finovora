import { Request, Response } from "express";
import catchErrors from "../../../utils/utilities/catchErrors";
import { AccountType } from "./accountType";
import { Op } from "sequelize";
import {
  createAccountTypeSchema,
  deletAccountTypeSchema,
} from "./accountTypes.schemas";
import User from "../../users/user";
import appAssert from "../../../utils/utilities/appAssert";
import { NOT_FOUND } from "../../../utils/constants/http";

export const getAccountTypesHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userAccountTypes = await AccountType.findAll({
      where: {
        [Op.or]: [{ userId: req.userId }, { userId: null }],
      },
    });

    return res.status(200).json(userAccountTypes);
  }
);

export const getAccountTypeHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userAccountTypes = await AccountType.findOne({
      where: {
        [Op.or]: [{ id: req.params.id }],
      },
    });

    return res.status(200).json(userAccountTypes);
  }
);

export const createAccountTypeHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { name, description, userId } = createAccountTypeSchema.parse({
      ...req.body,
      userId: req.userId,
    });

    const userExists = await User.findByPk(userId);
    appAssert(userExists, NOT_FOUND, "User does not exist");

    await AccountType.create({
      name,
      description,
      userId,
    });
    return res.status(201).json(true);
  }
);

export const updateAccountTypeHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { name, description, userId } = createAccountTypeSchema.parse({
      ...req.body,
      userId: req.userId,
    });

    const userExists = await User.findByPk(userId);
    appAssert(userExists, NOT_FOUND, "User does not exist");

    await AccountType.update(
      {
        name,
        description,
        userId,
      },
      {
        where: {
          id: { [Op.eq]: req.params.id },
        },
      }
    );
    return res.status(200).json(true);
  }
);

export const deleteAccountTypeHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { userId, id } = deletAccountTypeSchema.parse({
      id: parseInt(req.params.id),
      userId: req.userId,
    });

    const userExists = await User.findByPk(userId);
    appAssert(userExists, NOT_FOUND, "User does not exist");

    const noRowsDelete = await AccountType.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
        userId: {
          [Op.eq]: userId,
        },
      },
    });

    appAssert(noRowsDelete > 0, NOT_FOUND, "Account type does not exist");

    return res.status(204).send();
  }
);

export const getAccountTypesDropDownHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userAccountTypes = await AccountType.findAll({
      where: {
        [Op.or]: [{ userId: req.userId }, { userId: null }],
      },
    });

    return res.status(200).json(
      userAccountTypes.map((uat) => ({
        id: uat.id,
        value: uat.dataValues.name,
      }))
    );
  }
);
