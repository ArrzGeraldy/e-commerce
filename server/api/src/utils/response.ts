import { Response } from "express";
import { PaginationType } from "../types/pagiantion.type";

export const responseSuccess = (
  res: Response,
  data: any,
  message: string,
  statusCode: number
) => {
  return res.status(statusCode).send({
    message,
    data,
  });
};

export const responseError = (
  res: Response,
  message: string,
  statusCode: number,
  status: boolean
) => {
  return res.status(statusCode).send({
    status,
    statusCode,
    message,
  });
};

export const responsePagination = (
  res: Response,
  data: any,
  statusCode: number,
  pagination: PaginationType
) => {
  return res.status(statusCode).send({
    pagination,
    data,
  });
};
