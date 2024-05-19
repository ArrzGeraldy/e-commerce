import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtError extends Error {
  name: string;
  message: string;
  expiredAt?: number;
}

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token: string | undefined = authHeader && authHeader?.split(" ")[1];
  if (token === undefined) return res.sendStatus(401);
  console.log(token);

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decode: any) => {
    // console.log(err);
    if (err) return res.sendStatus(403);

    next();
  });
};
