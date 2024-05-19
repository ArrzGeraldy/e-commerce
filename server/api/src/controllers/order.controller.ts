import { Request, Response } from "express";
import { prisma } from "../db";
import { responseSuccess } from "../utils/response";

export const getOrderItems = async (req: Request, res: Response) => {
  const orderId = String(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: {
        orderId,
      },
    });

    const orderItems = await prisma.orderDetail.findMany({
      where: {
        orderId,
      },
      include: {
        product: true,
      },
    });

    const data = { order, orderItems };

    return responseSuccess(res, data, "get", 200);
  } catch (error) {
    console.log(error);
  }
};

export const getResultPayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.body.id);

    const payment = await prisma.order.update({
      where: {
        id,
      },
      data: {
        isPayment: true,
      },
    });
    console.log({ payment, transaction: "success" });
    res.send({ payment, transaction: "success" });
  } catch (error) {
    console.log(error);
    console.log({ transaction: "error" });
    res.send({ transaction: "error" });
  }
};
