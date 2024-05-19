import { prisma } from "../db";

export const getItemsCartByUser = async (userId: number) => {
  return prisma.cartItem.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
    },
  });
};

export const saveProductToCart = async (
  userId: number,
  quantity: number,
  productId: string,
  price: number
) => {
  return await prisma.cartItem.create({
    data: {
      userId,
      quantity,
      productId,
      total: price,
    },
  });
};

export const findItemUserInCart = async (userId: number, id: number) => {
  return await prisma.cartItem.findUnique({
    where: {
      userId,
      id,
    },
  });
};

export const productInCartUser = async (userId: number, productId: string) => {
  return await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const updateItemInCart = async (
  id: number,
  userId: number,
  productId: string,
  quantity: number,
  total: number
) => {
  return await prisma.cartItem.update({
    where: {
      id,
    },
    data: {
      userId,
      productId,
      quantity,
      total,
    },
  });
};

export const handleDuplicateProduct = async (
  userId: number,
  quantity: number,
  productId: string,
  total: number
) => {
  return await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: {
      userId,
      quantity,
      productId,
      total,
    },
  });
};

export const destroyCart = async (userId: number, id: number) => {
  return await prisma.cartItem.delete({
    where: {
      userId,
      id,
    },
  });
};
