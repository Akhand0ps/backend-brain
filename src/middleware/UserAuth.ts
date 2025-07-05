import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request,Response,NextFunction } from "express";
import {UserModel} from "../models/User.model";


const secret = process.env.JWT_SECRET;


interface MyJwtPayload extends JwtPayload{
    userId:string;
}

export const UserAuth = async(req:Request,res:Response,next:NextFunction)=>{

    const token = req.cookies.token;
    console.log(token);

    try{
        if(!token){
            res.status(401).json({message:"Unauthorized"});
            return;
        }
        if(!secret){
            throw new Error("No secret in env");
        }

        const decode = jwt.verify(token,secret) as MyJwtPayload;
        const user = await UserModel.findById(decode.userId);

        if(!user){
            throw new Error("Unauthorized");
        }
        //@ts-ignore
        req.user = user;
        console.log('middleware success');
        next();
    }catch(err){
        res.status(500).json({message:"INTERNAL SERVER ERROR"});
    }
}


