import { Request, Response } from "express";
import {
  createCategoryValidation,
  editCategoryValidation,
} from "../validations/category.validation";
import { logger } from "../utils/logger";
import {
  destroyCategory,
  findCategoryById,
  getAllCategoryFromDatabase,
  queryCategoryByGendre,
  queryCategoryByName,
  saveCategoryToDatabase,
  updateCategory,
} from "../services/categoryService";
import { responseError, responseSuccess } from "../utils/response";

export const getCategory = async (req: Request, res: Response) => {
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const gendre = typeof req.query.gendre === "string" ? req.query.gendre : "";
  try {
    if (search) {
      const queryCategories = await queryCategoryByName(search);
      logger.info('"Successfully query categories');
      return responseSuccess(res, queryCategories, "ok", 200);
    }

    if (gendre) {
      const categories = await queryCategoryByGendre(gendre.toUpperCase());
      logger.info('"Successfully query categories');
      return responseSuccess(res, categories, "ok", 200);
    }

    const categories = await getAllCategoryFromDatabase();
    logger.info('"Successfully retrieved categories');
    return responseSuccess(res, categories, "ok", 200);
  } catch (error) {
    logger.error("Failed to retrieve categories", error);
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Failed to retrieve categories",
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const category = await findCategoryById(id);
    logger.info('"Successfully get category');
    return responseSuccess(res, category, "ok", 200);
  } catch (error) {
    logger.error("Failed to get category", error);
    return responseError(res, "Failed to get category", 500, false);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { error, value } = createCategoryValidation(req.body);
  if (error) {
    logger.error(`Error: ${error.details[0].message}`);
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: error.details[0].message,
    });
  }
  try {
    const category = await saveCategoryToDatabase(value);
    logger.info("New category added successfully");
    return res.status(201).send({
      status: true,
      statusCode: 201,
      category,
      message: "New category added successfully",
    });
  } catch (error: any) {
    logger.error(`Failed to add new category: ${error.message}`);
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Failed to add new category. Please try again later.",
    });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  const { error, value } = editCategoryValidation(req.body);

  if (error) {
    logger.error(`Error: ${error.details[0].message}`);
    return responseError(res, error.details[0].message, 400, false);
  }

  try {
    const category = await updateCategory(id, value);
    logger.info("Update category successfuly");
    return responseSuccess(res, category, "ok", 200);
  } catch (error) {
    logger.error(`Failed update category: ${error}`);
    return res;
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  try {
    await destroyCategory(id);
    logger.info("Delete category successfully");
    return responseSuccess(res, { data: null }, "ok", 200);
  } catch (error) {
    logger.error("Failde delete category: ", error);
    return responseError(res, "Failed delete category", 500, false);
  }
};
