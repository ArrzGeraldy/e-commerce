import { prisma } from "../db";
import { ProductType } from "../types/product.types";

type WhereClause = {
  gendre: string;
  category: {
    name: {
      contains: string;
      mode: "insensitive";
    }; // Allow complex Category filtering (optional)
  };
};
type WhereClauseSearchAndGendre = {
  gendre: string;

  name: {
    contains: string;
    mode: "insensitive";
  }; // Allow complex Category filtering (optional)
};

export const saveProductToDatabase = async (productData: ProductType) => {
  const { name, gendre, price, stock, description, imageUrl, categoryId } =
    productData;

  return await prisma.product.create({
    data: {
      name,
      gendre,
      price,
      stock,
      description,
      imageUrl,
      categoryId,
    },
  });
};

export const getTotalPages = async (limit: number) => {
  const totalCount = await prisma.product.count(); // Mendapatkan jumlah total item
  const totalPages = Math.ceil(totalCount / limit); // Menghitung total halaman
  return { totalPages, totalCount };
};

export const getProductFromDatabase = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return await prisma.product.findMany({
    skip,
    take: limit,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductBySearchGendreAndCategory = async (
  search: string,
  gendre: string,
  categoryName: string
) => {
  return await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
      gendre,
      category: {
        name: {
          contains: categoryName,
          mode: "insensitive",
        },
      },
    },
    include: {
      category: true,
    },
  });
};

export const getProductByGendreAndCategory = async (
  gendre: string,
  categoryName: string,
  { skip = 0, limit = 12 }
) => {
  const whereClause: WhereClause = {
    gendre,

    category: {
      name: {
        contains: categoryName,
        mode: "insensitive",
      },
    },
  };

  const totalCount = await prisma.product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / limit);

  const product = await prisma.product.findMany({
    skip,
    take: limit,
    where: whereClause,
    include: {
      category: true,
    },
  });

  return { product, totalPages, totalCount };
};

export const getProductByGendreAndSearch = async (
  gendre: string,
  search: string,
  { skip = 0, limit = 8 }
) => {
  const whereClause: WhereClauseSearchAndGendre = {
    gendre,

    name: {
      contains: search,
      mode: "insensitive",
    },
  };

  const totalCount = await prisma.product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / limit);
  const product = await prisma.product.findMany({
    skip,
    take: limit,
    where: whereClause,
    include: {
      category: true,
    },
  });

  return { product, totalPages, totalCount };
};

export const getProductByGendre = async (
  gendre: string,
  { skip = 0, limit = 12 }
) => {
  const whereClause = { gendre };

  const totalCount = await prisma.product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalCount / limit);

  const product = await prisma.product.findMany({
    skip,
    take: limit,
    where: whereClause,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { product, totalPages, totalCount };
};

export const getProductBySearch = async (search: string) => {
  return await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    include: {
      category: true,
    },
  });
};

// select product by category ?
// example = women all
// export const getProductByGendre = async (
//   gendre: string,
//   page: number,
//   limit: number
// ) => {
//   const skip = (page - 1) * limit;
//   return await prisma.product.findMany({
//     skip,
//     take: limit,
//     where: {
//       gendre,
//     },
//     include: {
//       category: true,
//     },
//   });
// };

// select product where gendre ? and category ?
// export const getProductByGendreAndCategory = async (
//   gendre: string,
//   categoryName: string,
//   page: number,
//   limit: number
// ) => {
//   const skip = (page - 1) * limit;
//   return await prisma.product.findMany({
//     skip,
//     take: limit,
//     include: {
//       category: true,
//     },
//     where: {
//       gendre,
//       category: {
//         name: {
//           contains: categoryName,
//           mode: "insensitive",
//         },
//       },
//     },
//   });
// };

// show product by name
export const findProductByName = async (productName: string) => {
  return await prisma.product.findUnique({
    where: {
      name: productName,
    },
  });
};

// find product by id
export const findProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
};

// search product like productName = ? gendre = ? and category = ?
export const queryProductSearchCondition = async (
  search: string,
  gendre: string,
  category: string
) => {
  return await prisma.product.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
      gendre,
      category: {
        name: {
          contains: category,
          mode: "insensitive",
        },
      },
    },
  });
};

// search product like productName = ?
export const queryProductByName = async (productName: string) => {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
    where: {
      name: {
        contains: productName,
        mode: "insensitive",
      },
    },
  });
};

export const updateProduct = async (id: string, newData: object) => {
  return await prisma.product.update({
    where: {
      id,
    },
    data: newData,
  });
};

export const destroyProductFromDatabase = async (id: string) => {
  return await prisma.product.delete({
    where: {
      id,
    },
  });
};
