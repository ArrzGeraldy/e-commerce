import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Midtrans from "midtrans-client";
import { prisma } from "./config/db.js";
import {
  addTokenToOrder,
  createOrder,
  createOrderDetails,
} from "./services/orderServices.js";

const app = express();
const PORT = 4001;

const corsOptions = {
  origin: "*", // Mengizinkan semua asal
};
dotenv.config();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

app.post("/order", async (req, res) => {
  // const { total } = req.body;
  const total = Number(req.body.total);
  const userId = Number(req.body.userId);
  const items = req.body.items;
  try {
    const order = await createOrder(total, userId);

    const itemsDetails = items.map((item) => {
      return {
        orderId: order.orderId,
        productId: item.productId,
        quantity: item.quantity,
        total: item.total,
      };
    });

    let parameter = {
      transaction_details: {
        order_id: order.orderId,
        gross_amount: total,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    const orderToken = await addTokenToOrder(token, order.id);

    const orderDetails = await createOrderDetails(itemsDetails);
    res.send({ order: orderToken, orderDetails });
  } catch (error) {
    console.log(error);
  }

  // try {
  //   const order = await prisma.order.create({
  //     data: {
  //       userId,
  //       totalPayment: total,
  //     },
  //   });

  //   const orderD = items.forEach(async (item) => {
  //     await prisma.orderDetail.create({
  //       data: {
  //         orderId: order.orderId,
  //         productId: item.productId,
  //         total: item.total,
  //         quantity: item.quantity,
  //       },
  //     });
  //   });

  //   let parameter = {
  //     transaction_details: {
  //       order_id: order.id,
  //       gross_amount: total,
  //     },
  //   };

  //   const token = await snap.createTransactionToken(parameter);
  //   return res.send({ token });
  // } catch (error) {
  //   console.log(error);
  //   return res.sendStatus(500);
  // }
});

app.listen(PORT, () => {
  console.log("app run on port: ", PORT);
});
