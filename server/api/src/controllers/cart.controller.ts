import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { responseError, responseSuccess } from "../utils/response";
import {
  destroyCart,
  findItemUserInCart,
  getItemsCartByUser,
  handleDuplicateProduct,
  productInCartUser,
  saveProductToCart,
  updateItemInCart,
} from "../services/cartService";
import { findProductById } from "../services/productService";

export const getCartUser = async (req: Request, res: Response) => {
  const userId: number = Number(req.params.id);
  try {
    const items = await getItemsCartByUser(userId);
    return responseSuccess(res, items, "ok", 200);
  } catch (error) {
    console.log(error);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId: number = Number(req.body.userId);
  const productId: string = String(req.body.productId);
  const price: number = Number(req.body.price);
  const quantity: number = Number(req.body.quantity);
  try {
    const existsProduct = await findProductById(productId);
    if (!existsProduct) {
      logger.error("Product not found");
      return responseError(res, "Product not found", 400, false);
    }

    const existsInCart = await productInCartUser(userId, productId);

    if (existsInCart) {
      const incrementQuantity = existsInCart.quantity + 1;
      const total = incrementQuantity * price;
      const data = await handleDuplicateProduct(
        userId,
        incrementQuantity,
        productId,
        total
      );
      return responseSuccess(res, data, "update", 201);
    }

    const data = await saveProductToCart(userId, quantity, productId, price);
    logger.info("Add product to cart successfully");
    return responseSuccess(res, data, "Add product to cart successfully", 201);
  } catch (error) {
    console.log(error);
  }
};

export const editCart = async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const userId: number = Number(req.body.userId);
  const productId: string = String(req.body.productId);
  const price: number = Number(req.body.price);
  const quantity: number = Number(req.body.quantity);

  try {
    const total = quantity * price;
    const update = await updateItemInCart(
      id,
      userId,
      productId,
      quantity,
      total
    );
    return responseSuccess(res, update, "updated", 200);
  } catch (error) {
    console.log(error);
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  try {
    const userId: number = Number(req.body.userId);
    const id: number = Number(req.body.id);

    if (!id || !userId) {
      logger.error("Not found");
      return res.sendStatus(404);
    }

    const isValid = await findItemUserInCart(userId, id);
    if (!isValid) {
      logger.error("Unauthorized");
      return res.sendStatus(401);
    }

    await destroyCart(userId, id);
    logger.info("Delete item from cart Successfully");
    return res
      .status(200)
      .send({ message: "Delete item from cart Successfully" });
  } catch (error) {
    console.log(error);
  }
};
