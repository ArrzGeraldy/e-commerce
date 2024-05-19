import Joi from "joi";
import { ProductType } from "../types/product.types";

export const createProductValidatoin = (product: ProductType) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    gendre: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().allow(""),
    // image: Joi.allow(""),
    categoryId: Joi.number().required(),
  });

  return schema.validate(product);
};

export const editProductValidatoin = (product: ProductType) => {
  const schema = Joi.object({
    name: Joi.string().allow(""),
    gendre: Joi.string().allow(""),
    price: Joi.number().allow(""),
    stock: Joi.number().allow(""),
    description: Joi.string().allow(""),
    imageUrl: Joi.string().allow(""),
    categoryId: Joi.number().allow(""),
  });

  return schema.validate(product);
};
