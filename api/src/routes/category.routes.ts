import { Router } from "express";
import {
  createCategoryAsync,
  deleteBulkCategoriesAsync,
  editCategoryAsync,
  getCategoriesAsync,
} from "../controllers/category.controller";
import authenticate from "../middleware/authenticate";

const categoryRoutes = Router();

categoryRoutes.get("/", [authenticate], getCategoriesAsync);
categoryRoutes.post("/", [authenticate], createCategoryAsync);
categoryRoutes.delete("/", [authenticate], deleteBulkCategoriesAsync);
categoryRoutes.put("/:id", [authenticate], editCategoryAsync);
export default categoryRoutes;
