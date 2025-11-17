import { verifyEmailController } from "./auth.controller";
import { findUserByEmail } from "../repository/user.repository";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt/jwt-gen";
import userType from "../types/user.type";
import { hashPassword } from "../utils/bcrypt/bcrypt";
export const loginService = async (email: string, password: string) => {
  // CHECK THAT ALL FIELDS ARE PRESENT
  if (!email || !password) {
    return {
      status: false,
      code: 400,
      message: "Missing fields",
    };
  }
  // check if email exists in the database
  const user: userType = findUserByEmail({ email });
  if (!user) {
    return {
      status: false,
      code: 404,
      message: "Email or Password does not exist",
    };
  }
  // verify password
  const isMatch = bcrypt.compare(user.password, password);
  if (!isMatch) {
    return {
      status: false,
      code: 400,
      message: "Incorrect Email or Password",
    };
  }
  // generate JWT token
  const token = generateToken({
    userId: user.id,
    firstname: user.first_name,
    lastname: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });

  return {
    status: "success",
    code: 200,
    message: "User authenticated",
    data: {
      token,
      // user: {...}
    },
  };
};

export const registerService = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  phone: string
) => {
  //check that all fields exist
  if(!firstname || !lastname || !email || !password || !phone){
    return {
      status: false,
      code: 400,
      message: "Missing fields",
    };
  }
  // check if email or phone number already exists in the database
  const user: userType = findUserByEmail({ email });
  if (user) {
    return {
      status: false,
      code: 400,
      message: "Email already exists",
    };
  }
  // hash password
  const hashedPassword = hashPassword(password);

  // create user in the database
  
  return {
    status: "success",
    code: 201,
    message: "User registered successfully",
    data: {
      // user: { ... }
    },
  };
};

export const logoutService = async (userId: string) => {
  // invalidate user session or token if necessary
  return {
    status: "success",
    code: 200,
    message: "User logged out successfully",
  };
};
export const generateVerifyCode = async () => {};
export const verifyEmailService = async (token: string) => {
  //
};
