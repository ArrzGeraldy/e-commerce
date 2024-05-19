import { Router } from "express";
import {
  createCategory,
  editCategory,
  getCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/category.controller";

export const CategoryRouter = Router();

CategoryRouter.get("/", getCategory);
CategoryRouter.get("/:id", getCategoryById);
CategoryRouter.post("/", createCategory);
CategoryRouter.put("/:id", editCategory);
CategoryRouter.delete("/:id", deleteCategory);
