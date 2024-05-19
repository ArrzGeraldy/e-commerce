import Joi from "joi";
import { RegisterType } from "../types/auth.types";

export const registerValidation = (payload: RegisterType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
  });

  return schema.validate(payload);
};
export const loginValidation = (payload: RegisterType) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return schema.validate(payload);
};
