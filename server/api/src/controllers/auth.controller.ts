import { Request, Response } from "express";
import {
  addToken,
  createUser,
  findUserByEmail,
  getUserFromDatabase,
  updateUser,
} from "../services/userService";
import { logger } from "../utils/logger";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { responseError, responseSuccess } from "../utils/response";

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await getUserFromDatabase();
    logger.info("Success get users");
    return responseSuccess(res, users, "ok", 200);
  } catch (error) {
    logger.error("Failed get users");
    return responseError(res, "Failed get users", 500, false);
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { error, value } = registerValidation(req.body);
  if (error) {
    logger.error(`Error: ${error.details[0].message}`);
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: error.details[0].message,
    });
  }
  try {
    const existsEmail = await findUserByEmail(value.email);
    if (existsEmail) {
      logger.info("Email already exists");
      return responseError(res, "Email already exists", 400, false);
    }

    const hashing = await hash(value.password, 10);
    value.password = hashing;

    await createUser(value);
    logger.info("User created successfull");
    res.status(201).send({
      status: true,
      statusCode: 200,
      message: "User created successfull",
    });
  } catch (error) {
    logger.error("Failed to create user");
    res.status(409).send({
      status: false,
      statusCode: 409,
      message: "Failed to create user. Something went wrong",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { error, value } = loginValidation(req.body);
  if (error) {
    logger.error(`Error: ${error.details[0].message}`);
    return res.status(400).send({
      status: false,
      statusCode: 400,
      message: error.details[0].message,
    });
  }
  try {
    const user = await findUserByEmail(value.email);
    if (!user) {
      logger.info("User not found");
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "User not found",
      });
    }

    const isValidPassword = await compare(value.password, user.password);
    if (!isValidPassword) {
      logger.info("Invalid Email or Password");
      return res.status(400).send({
        status: false,
        statusCode: 400,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "1d" });
    const userLogin = await addToken(user.id, token);
    logger.info("success login");
    res.status(201).send({
      status: true,
      statusCode: 200,
      token,
      user: userLogin,
      message: "User logged in successfully",
    });
  } catch (error) {
    logger.error("failed");
    res.status(409).send({
      status: false,
      statusCode: 409,
      message: "something went wrong",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken: string = req.cookies.token;

    if (!refreshToken) return res.sendStatus(401);
    console.log(refreshToken);
    res.send({
      token: refreshToken,
    });

    // const user = await prisma.user.findMany({
    //   where: {
    //     refreshToken,
    //   },
    // });

    // if (!user[0].refreshToken) return res.sendStatus(403);

    // jwt.verify(
    //   refreshToken,
    //   "foqiueeoiwjfslkdjfsalkjfeiwaoe",
    //   (err: any, decode: any) => {
    //     if (err) return res.sendStatus(403);

    //     const userId = user[0].id;
    //     const username = user[0].username;
    //     const role = user[0].role;
    //     const email = user[0].email;
    //     const accesToken = jwt.sign(
    //       { userId, username, role, email },
    //       "skafjiewaojfoiwa",
    //       { expiresIn: "20s" }
    //     );

    //     res.json({ accesToken });
    //   }
    // );
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken: string = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await prisma.user.findMany({
    where: {
      refreshToken,
    },
  });

  if (!user[0].refreshToken) return res.sendStatus(204);

  const userId = user[0].id;

  await updateUser({ id: userId }, { refreshToken: null });

  res.clearCookie("refreshToken");

  return res.sendStatus(200);
};
