import { Router } from "express";
import {
  createBudgetPlannerAsync,
  createCategoryAsync,
  deleteBulkCategoriesAsync,
  editCategoryAsync,
  getBudgetOverviewAsync,
  getCategoriesAsync,
  getCategoriesDropdownAsync,
  getCategoriesWithBudgetAsync,
} from "./category.controller";
import authenticate from "../../middleware/authenticate";

const categoryRoutes = Router();

categoryRoutes.get("/", [authenticate], getCategoriesAsync);
categoryRoutes.post("/", [authenticate], createCategoryAsync);
categoryRoutes.delete("/", [authenticate], deleteBulkCategoriesAsync);
categoryRoutes.put("/:id", [authenticate], editCategoryAsync);
categoryRoutes.get("/dropdown", [authenticate], getCategoriesDropdownAsync);
categoryRoutes.get("/budget", [authenticate], getCategoriesWithBudgetAsync);
categoryRoutes.post("/budget", [authenticate], createBudgetPlannerAsync);
categoryRoutes.get("/budget/overview", [authenticate], getBudgetOverviewAsync);
export default categoryRoutes;
