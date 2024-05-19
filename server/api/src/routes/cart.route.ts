import { Router } from "express";
import {
  addToCart,
  deleteItemFromCart,
  editCart,
  getCartUser,
} from "../controllers/cart.controller";

export const CartRouter = Router();

CartRouter.get("/:id", getCartUser);
CartRouter.post("/", addToCart);
CartRouter.patch("/:id", editCart);
CartRouter.delete("/", deleteItemFromCart);
