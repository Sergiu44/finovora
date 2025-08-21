import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import { Category } from "../models/category";
import { Op } from "sequelize";
import appAssert from "../../utils/utilities/appAssert";
import { NOT_FOUND } from "../../utils/constants/http";

export const getCategoriesAsync = catchErrors(async (req: Request, res: Response) => {
  const categories = await Category.findAll({
    where: { userId: req.userId, parentCategoryId: null },
    attributes: ["name", "id"],
    include: [
      {
        model: Category,
        as: "subCategories",
        attributes: ["name", "id"],
      },
    ],
  });
  return res.status(200).json(categories);
});

export const createCategoryAsync = catchErrors(async (req: Request, res: Response) => {
  const { name, parentCategoryId } = req.body;
  const category = await Category.create({ name, parentCategoryId, userId: req.userId });
  return res.status(201).json(category);
});

export const deleteBulkCategoriesAsync = catchErrors(async (req: Request, res: Response) => {
  const categoryIds = req.body;
  await Category.destroy({
    where: {
      id: { [Op.in]: categoryIds },
      userId: req.userId,
    },
  });
  return res.status(204).send();
});

export const editCategoryAsync = catchErrors(async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const userId = req.userId;

  const categoryToUpdate = await Category.findOne({
    where: { id, userId },
  });
  appAssert(!!categoryToUpdate, NOT_FOUND, "Category not found");
  await categoryToUpdate.update({ name });
  return res.status(200).json(categoryToUpdate);
});
