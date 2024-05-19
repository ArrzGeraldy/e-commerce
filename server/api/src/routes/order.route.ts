import { Router } from "express";
import {
  getOrderItems,
  getResultPayment,
} from "../controllers/order.controller";

export const OrderRouter = Router();

OrderRouter.post("/result", getResultPayment);
OrderRouter.get("/:id", getOrderItems);
