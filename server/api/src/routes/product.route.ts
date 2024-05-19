import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProductById,
  getTotalPagesProduct,
} from "../controllers/product.controller";
import { verifyJwt } from "../middleware/verifyJwt";

export const ProductRouter = Router();

ProductRouter.get("/total-pages", getTotalPagesProduct);
ProductRouter.get("/", getProduct);
ProductRouter.get("/:id", getProductById);
ProductRouter.get("/coba", verifyJwt, getProduct);
// ProductRouter.get("/:name", getProductByName);
ProductRouter.post("/", createProduct);
ProductRouter.put("/:id", editProduct);
ProductRouter.delete("/:id", deleteProduct);
