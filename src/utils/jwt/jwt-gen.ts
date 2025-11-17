// utils/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

interface JwtPayload {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  phone:string;
  role?: string;
}

export const generateToken = (
  payload: JwtPayload,
  expiresIn: number = 3600*3
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload as jwt.JwtPayload, JWT_SECRET, options);
};
