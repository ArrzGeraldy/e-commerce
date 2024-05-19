import { Request, Response } from "express";
import {
  createProductValidatoin,
  editProductValidatoin,
} from "../validations/product.validation";
import { logger } from "../utils/logger";
import {
  destroyProductFromDatabase,
  findProductById,
  findProductByName,
  getProductByGendre,
  getProductByGendreAndCategory,
  getProductByGendreAndSearch,
  getProductBySearch,
  getProductBySearchGendreAndCategory,
  getProductFromDatabase,
  getTotalPages,
  saveProductToDatabase,
  updateProduct,
} from "../services/productService";
import { findCategoryById } from "../services/categoryService";
import { deleteFileInImagesFolder } from "../utils/deleteImage";
import {
  responseError,
  responsePagination,
  responseSuccess,
} from "../utils/response";
import { createPagination } from "../utils/pagination";

export const getTotalPagesProduct = async (req: Request, res: Response) => {
  const limit: number = Number(req.query.limit) || 12;
  try {
    const totalPages = await getTotalPages(limit);
    return res.status(200).send({
      message: "ok",
      totalPages,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const search: string = req.query.search ? String(req.query.search) : "";
  const gendre: string = req.query.gendre
    ? String(req.query.gendre).toUpperCase()
    : "";
  const categoryName: string = req.query.category
    ? String(req.query.category)
    : "";

  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 12;
  const skip: number = (page - 1) * limit;

  try {
    let data;

    if (search && gendre && categoryName) {
      data = await getProductBySearchGendreAndCategory(
        search,
        gendre,
        categoryName
      );
    } else if (gendre && categoryName) {
      const { product, totalPages, totalCount } =
        await getProductByGendreAndCategory(gendre, categoryName, {
          skip,
          limit,
        });
      data = product;

      const pagination = createPagination(page, totalPages, limit, totalCount);
      return responsePagination(res, data, 200, pagination);
      // gendre n category name
    } else if (gendre && search) {
      const { product, totalPages, totalCount } =
        await getProductByGendreAndSearch(gendre, search, { skip, limit });
      data = product;
      const pagination = createPagination(page, totalPages, limit, totalCount);
      return responsePagination(res, data, 200, pagination);
    } else if (gendre || search) {
      if (gendre) {
        const { product, totalPages, totalCount } = await getProductByGendre(
          gendre,
          { skip, limit }
        );
        data = product;
        const pagination = createPagination(
          page,
          totalPages,
          limit,
          totalCount
        );
        return responsePagination(res, data, 200, pagination);
      }

      if (search) {
        data = await getProductBySearch(search);
      }
    } else {
      data = await getProductFromDatabase(page, limit);
      const { totalPages, totalCount } = await getTotalPages(limit);
      const pagination = createPagination(page, totalPages, limit, totalCount);
      return responsePagination(res, data, 200, pagination);
    }

    if (!data || data.length === 0) {
      return responseError(res, "Product not found", 404, false); // Use 404 for not found
    }
    return responseSuccess(res, data, "OK", 200);
  } catch (error) {
    console.log(error);
    return responseError(res, "Failed get product", 500, false);
  }
};

// export const getProduct = async (req: Request, res: Response) => {
//   const search: string =
//     typeof req.query.search === "string" ? req.query.search : "";
//   const gendre: string =
//     typeof req.query.gendre === "string" ? req.query.gendre : "";
//   const categoryName: string =
//     typeof req.query.category === "string" ? req.query.category : "";

//   const page: number = Number(req.query.page) || 1;
//   const limit: number = Number(req.query.limit) || 2;

//   try {
//     if (search) {
//       if (gendre || categoryName) {
//         const data = await queryProductSearchCondition(
//           search,
//           gendre.toUpperCase(),
//           categoryName
//         );
//         return res.status(200).send({
//           status: "ok",
//           data: data,
//         });
//       }
//       const data = await queryProductByName(search);
//       return res.status(200).send({
//         status: "ok",
//         data: data,
//       });
//     }

//     if (gendre) {
//       if (categoryName) {
//         const data = await getProductByGendreAndCategory(
//           gendre.toLocaleUpperCase(),
//           categoryName,
//           page,
//           limit
//         );
//         logger.info("Successfully get products by gendre & category");
//         return responseSuccess(res, data, "ok", 200);
//       }
//       const data = await getProductByGendre(
//         gendre.toLocaleUpperCase(),
//         page,
//         limit
//       );
//       logger.info("Successfully get products by gendre");
//       return responseSuccess(res, data, "ok", 200);
//     }
//     const products = await getProductFromDatabase(page, limit);
//     if (!products || products.length === 0) {
//       logger.warn("No products found");
//       return res.status(404).send({
//         status: "not found",
//         message: "No products found",
//         data: null,
//       });
//     }
//     logger.info("Successfully retrieved products");
//     return res.status(200).send({
//       status: "ok",
//       data: products,
//     });
//   } catch (error) {
//     logger.error("Failed to retrieve products", error);
//     return res.status(500).send({
//       status: false,
//       statusCode: 500,
//       message: "Failed to retrieve products",
//     });
//   }
// };

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const product = await findProductById(id);
    logger.info("Get product by id successfully");
    return responseSuccess(res, product, "ok", 200);
  } catch (error) {
    logger.error("Failed to retrieve products: ", error);
    return responseError(res, "Failed to retrieve products", 500, false);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.categoryId = parseInt(req.body.categoryId);
  const { error, value } = createProductValidatoin(req.body);
  if (error) {
    logger.error(`Error: ${error.details[0].message}`);
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: error.details[0].message,
    });
  }

  try {
    const isProductExists = await findProductByName(value.name);
    const isCategoryExists = await findCategoryById(parseInt(value.categoryId));
    if (isProductExists) {
      logger.info("The product name is already in use");
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "The product name is already in use",
      });
    }

    if (!isCategoryExists) {
      logger.info("Category does not exists");
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Category does not exists",
      });
    }

    if (!req.file) {
      return res.status(422).send({
        status: false,
        statusCode: 422,
        message: "Image required",
      });
    }
    value.imageUrl = req.file.destination + "/" + req.file.filename;

    const product = await saveProductToDatabase(value);
    logger.info("New product added successfully");
    return res.status(201).send({
      status: true,
      statusCode: 201,
      data: product,
      message: "New product added successfully",
    });
  } catch (error: any) {
    logger.error(`Failed to add new product: ${error.message}`);
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Failed to add new product. Please try again later.",
    });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  const id: string = typeof req.params.id === "string" ? req.params.id : "";

  const { error, value } = editProductValidatoin(req.body);
  if (error) {
    logger.error(`Error: ${error.details[0].message}`);
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: error.details[0].message,
    });
  }
  try {
    const product = await findProductById(id);
    if (product) {
      if (req.file) {
        const fileName = product.imageUrl.split("images/")[1];
        deleteFileInImagesFolder(fileName);
        console.log(fileName);

        value.imageUrl = req.file.destination + "/" + req.file.filename;
      }
      const data = await updateProduct(id, value);
      logger.info(`Edit update successfully`);
      return res.status(200).send({
        message: "Upadate product succes",
        data,
      });
    }
  } catch (error) {
    logger.error(`Failed to update product: ${error}`);
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Failed update product. Please try again later.",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id: string = typeof req.params.id === "string" ? req.params.id : "";

  try {
    const product = await findProductById(id);
    if (!product) {
      throw new Error("Undifined product");
    }
    const fileName = product.imageUrl.split("images/")[1];
    deleteFileInImagesFolder(fileName);

    await destroyProductFromDatabase(id);
    logger.info("Succesfully deleted product");

    return res.status(200).send({
      message: "Data deleted",
    });
  } catch (error: any) {
    logger.error(`Failed to delete product: ${error.message}`);
    return res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Failed delete product. Please try again later.",
    });
  }
};
