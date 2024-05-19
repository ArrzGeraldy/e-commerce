import { Router } from "express";
import {
  getUser,
  loginUser,
  logout,
  refreshToken,
  registerUser,
} from "../controllers/auth.controller";
// import { verifyJwt } from "../middleware/verifyJwt";

export const AuthRouter = Router();

AuthRouter.get("/user", getUser);
AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.get("/token", refreshToken);
AuthRouter.delete("/logout", logout);
