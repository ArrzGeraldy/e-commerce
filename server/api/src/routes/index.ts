import { Application, Router } from "express";
import { ProductRouter } from "./product.route";
import { CategoryRouter } from "./category.route";
import { AuthRouter } from "./auth.route";
import { CartRouter } from "./cart.route";
import { OrderRouter } from "./order.route";

const _routes: Array<[string, Router]> = [
  ["/product", ProductRouter],
  ["/category", CategoryRouter],
  ["/auth", AuthRouter],
  ["/cart", CartRouter],
  ["/order", OrderRouter],
];

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route;

    app.use(url, router);
  });
};
