import { prisma } from "../db";
import { RegisterType } from "../types/auth.types";

export const createUser = async (userData: RegisterType) => {
  const { email, username, password } = userData;
  return await prisma.user.create({
    data: {
      email,
      username,
      password,
    },
  });
};

export const getUserFromDatabase = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });
};

export const addToken = async (id: number, token: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      refreshToken: token,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const updateUser = async (updateBy: any, newData: any) => {
  const update = await prisma.user.update({
    where: updateBy,
    data: newData,
  });
  return update;
};
