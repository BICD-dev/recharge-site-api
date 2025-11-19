import { createUserWithWallet, findUser, findUserByEmail, update } from "../repository/user.repository";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt/jwt-gen";
import userType from "../types/user.type";
import { hashPassword } from "../utils/bcrypt/bcrypt";
import { generateVerificationCode, generateVerificationExpiry } from "../utils/verification/verification";
import { sendVerificationEmail } from "../utils/brevo/emailService";
type updateResultType = {
  id:string,
  email:string
} | null;
export const loginService = async (email: string, password: string) => {
  // CHECK THAT ALL FIELDS ARE PRESENT
  if (!email || !password) {
    return {
      status: "failure",
      code: 400,
      message: "Missing fields",
    };
  }
  // check if email exists in the database
  const user = await findUserByEmail(email);
  if (!user) {
    return {
      status: "failure",
      code: 404,
      message: "Email or Password does not exist",
    };
  }
  // verify password
  const isMatch = bcrypt.compare(user.password, password);
  if (!isMatch) {
    return {
      status: "failure",
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
      status: "failure",
      code: 400,
      message: "Missing fields",
    };
  }
  // check if email or phone number already exists in the database
  const userExists = await findUserByEmail(email);
  if (userExists) {
    return {
      status: "failure",
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
  // send verification code
  const sendCode = await sendVerificationCodeService((await user).userData.email)
  return {
    status: "success",
    code: 201,
    message: "User registered successfully",
    data: {
      user,
      verification: "Verification code sent to email",
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

export const sendVerificationCodeService = async (email: string) => {
  try {
    if (!email) {
      return {
        status: "failure",
        code: 404,
        message: "Email is required"
      };
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return {
        status: "failure",
        code: 404,
        message: "Email does not exist"
      };
    }

    const verificationCode = generateVerificationCode(); 
    const verificationExpiryDate = generateVerificationExpiry(10); // minutes
    // hash the code
    const hashedCode = await hashPassword(verificationCode,10);
    // update the verfication code in the db
    const updateResult = await update(
      {
        update:{verification_code: hashedCode,verification_code_expires: verificationExpiryDate,},
        conditions:{id: user.id}
      }
    );

    if (!updateResult) {
      return {
        status: "failure",
        code: 500,
        message: "Failed to update verification details"
      };
    }
    // send email with code
    const emailResult = await sendVerificationEmail(email, verificationCode);
    if (emailResult.status === "success") {
    return { status: "success", code: 200, message: "Verification code sent", data:{email} };
  } else {
    return { status: "failure", code: 500, message: "Failed to send verification email" };
  }

    
  } catch (error) {
    console.error("Verification service error:", error);
    return {
      status: "error",
      code: 500,
      message: "Internal server error"
    };
  }
};


export const verifyEmailService = async (user_id: string, codeInput:string) => {
  //fetch record based on user id from token
  const record = await findUser({id: user_id});
  if(!record){
    return {
      status: "failure",
      code: 404,
      message: "User not found"
    };
  };

  // check if the code has expired
  const currentTime = new Date();
  const codeExpiry = record.verification_code_expires;
  if(codeExpiry && currentTime > codeExpiry){
    return {
      status: "failure",
      code: 400,
      message: "Verification code has expired"
    };
  }
  // check if the code on the record matches the input code
  const storedHashedCode =  record.verification_code;
  const isCodeValid = await bcrypt.compare(codeInput, storedHashedCode);
  if(!isCodeValid){
    return {
      status: "failure",
      code: 400,
      message: "Invalid verification code"
    };
  };
  // if all checks pass, update user record to set is_active to true and clear verification code fields
  const updateResult: updateResultType = await update(
    {
      
      update:{id: record.id},
      conditions:{
        is_active: true,
        verification_code: null,
        verification_code_expires: null,
      }
    }
  );
  return {
    status: "success",
    code: 200,
    message: "Email verified successfully"
  };

};
