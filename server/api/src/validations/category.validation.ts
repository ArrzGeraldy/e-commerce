import Joi from "joi";
import { CategoryType } from "../types/category.types";

export const createCategoryValidation = (category: CategoryType) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(category);
};

export const editCategoryValidation = (category: CategoryType) => {
  const schema = Joi.object({
    name: Joi.string().allow(""),
  });

  return schema.validate(category);
};
