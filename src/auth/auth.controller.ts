import { Request, Response } from "express";
import { loginService, registerService } from "./auth.service";
export const loginController = async (req: Request, res: Response) =>{
    try {
        const {email, password} = req.body;
        const result = await loginService(email, password);
        if(result.status === "success"){
            return res.status(result.code).json(result);
        } else {
            return res.status(result.code).json(result);
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal server error",
        });
    }
}

export const registerController = async (req: Request, res: Response) =>{
    try {
        const {firstname, lastname, email, password, phone} = req.body;
        const result = await registerService(firstname, lastname, email, password, phone);
        if(result.status === "success"){
            return res.status(result.code).json(result);
        } else {
            return res.status(result.code).json(result);
        }
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Internal server error",
        });
    }
}

export const verifyEmailController = async (req: Request, res: Response) =>{

}