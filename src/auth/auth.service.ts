import { verifyEmailController } from "./auth.controller";
import { createUserWithWallet, findUserByEmail, updateVerificationCode } from "../repository/user.repository";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt/jwt-gen";
import userType from "../types/user.type";
import { hashPassword } from "../utils/bcrypt/bcrypt";
import { generateVerificationCode, generateVerificationExpiry } from "../utils/verification/verification";

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
  const user = await findUserByEmail(email);
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
    first_name: user.first_name,
    last_name: user.last_name,
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
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  phone: string
) => {
  //check that all fields exist
  if(!first_name || !last_name || !email || !password || !phone){
    return {
      status: false,
      code: 400,
      message: "Missing fields",
    };
  }
  // check if email or phone number already exists in the database
  const userExists = await findUserByEmail(email);
  if (userExists) {
    return {
      status: false,
      code: 400,
      message: "Email already exists",
    };
  }
  // hash password
  const hashedPassword = await hashPassword(password);
//code should expire in 30 mins
  // create user in the database
  const user = createUserWithWallet({
    first_name:first_name,
    last_name:last_name,
    email,
    password:hashedPassword,
    phone,
    role:'user',
    is_active:false,
  });
  // create verification code
  const code = await createVerificationCodeService((await user).userData.email)
  return {
    status: "success",
    code: 201,
    message: "User registered successfully",
    data: {
      user,
      verification: code
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

export const createVerificationCodeService = async (email:string) => {
  if(!email){
    return{
      status:false,
      code:404,
      message:"All Fields must be present"
    }
  }
  const user = await findUserByEmail(email);
  if(!user){
    return{
      status:false,
      code:404,
      message:"Email does not exist"
    }
  }

      const verificationCode = await generateVerificationCode();
      const verificationExpiryDate = await generateVerificationExpiry(30) 

      // update the verification code for the user
      const result = await updateVerificationCode( user.id, verificationCode, verificationExpiryDate );
      return result
};

export const verifyEmailService = async (token: string) => {
  //
};
