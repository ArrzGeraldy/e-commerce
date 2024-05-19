import { prisma } from "../db";
import { CategoryType } from "../types/category.types";

export const getAllCategoryFromDatabase = async () => {
  return await prisma.category.findMany();
};

export const saveCategoryToDatabase = async (categoryData: CategoryType) => {
  const category = await prisma.category.create({
    data: {
      name: categoryData.name,
    },
  });
  return category;
};

export const queryCategoryByGendre = async (gendre: string) => {
  return prisma.category.findMany({
    where: {
      products: {
        some: {
          gendre,
        },
      },
    },
    distinct: ["name"],
    orderBy: {
      id: "asc",
    },
  });
};

export const queryCategoryByName = async (search: string) => {
  return prisma.category.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
};

export const findCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  return category;
};

export const updateCategory = async (id: number, newData: object) => {
  return await prisma.category.update({
    where: {
      id,
    },
    data: newData,
  });
};

export const destroyCategory = async (id: number) => {
  return prisma.category.delete({
    where: {
      id,
    },
  });
};
