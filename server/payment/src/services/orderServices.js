import { prisma } from "../config/db.js";

export const createOrder = async (total, userId) => {
  return await prisma.order.create({
    data: {
      totalPayment: total,
      userId,
    },
  });
};

export const addTokenToOrder = async (token, id) => {
  return await prisma.order.update({
    where: {
      id,
    },
    data: {
      snapToken: token,
    },
  });
};
export const createOrderDetails = async (itemsDetails) => {
  return await prisma.orderDetail.createMany({
    data: itemsDetails,
  });
};
