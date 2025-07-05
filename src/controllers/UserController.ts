import {CreateUser,LoginUser,CreateContent} from "../services/UserService";
import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {ContentModel, LinkModel, UserModel} from "../models/User.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { random } from "../utils/random";
import { UserAuth } from "../middleware/UserAuth";



const CheckUser = z.object({
    firstName:z.string().min(3,{message:"Firstname must be more than 3 chars"}),
    lastName:z.string().min(3,{message:"lastName must be atleast 3 chars"}).optional().or(z.literal('')),
    email:z.string().email({message:"Email must be correct"}),
    password:z.string().min(3,{message:"Password must be atleast 3 chars"})
})

const loginSchema = z.object({
    email:z.string().email(),
    password:z.string().min(3)
})

export const ContentInputSchema = z.object({
    title:z.string().min(1,{message:"Title is required"}),
    link:z.string(),
    tags:z.array(z.string()).optional(),
    type:z.string(),

});

export type ContentInput = z.infer<typeof ContentInputSchema>


const secret = process.env.JWT_SECRET as string | undefined;

export const signup = async(req: Request, res: Response)=>{

    try{

        console.log('came here in signup');
        console.log(req.body.firstName);
        console.log(req.body.lastName);
        console.log(req.body.email);
        console.log(req.body.password);

        // Removed invalid type comparison; Zod validation is used below
        // if(!req.body.email || !req.body.firstName || !req.body.password){
        //     throw new Error("All fields are required");
        // }


        const result = CheckUser.safeParse(req.body);

        if(!result.success){ 
            res.status(400).json({message: result.error.errors[0].message});
            return;
        }

        const isUserExist = await UserModel.findOne({email:req.body.email});

        if(isUserExist){
            res.status(400).json({message:"User already exist"});
            return;
        }
    
       

        const {firstName,lastName,email,password} = req.body;

        const hashPass = await bcrypt.hash(password,10);

        const User = {
            firstName,
            lastName,
            email,
            password:hashPass
        }

        const user = await CreateUser({
            User
        });

        if (!secret) {
            throw new Error("jwt secret is missing");
        }
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" });
        
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        })
        console.log("res");
        res.status(201).json({
            message:"Registered!!!",
            token,
            email
        })
    }catch(err:any){
       res.status(500).json({message:err.message || "Signup failed || INTERNAL SERVER ERROR"});
    }
}


export const login = async(req:Request, res:Response)=>{

    try{

        loginSchema.safeParse(req.body);

        const {email,password} = req.body;
        if(!email || !password){
            throw new Error("Please enter Email and Password both");
        }

        const user = await UserModel.findOne({email});
        

        if(!user){
            res.status(401).json({message:"Invalid email or password"});
            return;
        }

        const isMatch = await LoginUser(email,password);

        if(!isMatch){
            res.status(401).json({message:"Invalid email or password"})
            return;
        }

        if (!secret) {
            throw new Error("jwt secret is missing");
        }


        const token = jwt.sign({userId: user._id},secret,{expiresIn:"7d"});
        
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        })
        console.log("inside the login");

        res.status(201).json({
            message:"logged In",
            token,
            email
        })
    }catch(err:any){
        res.status(500).json({message: err.message || "INTERNAL SERVER ERROR"});
    }
}

export const me = async(req:Request,res:Response,next:NextFunction)=>{
    //@ts-ignore
    const user = req.user;
    res.status(200).json({user});
}
export const content = async(req:Request,res:Response)=>{

    try{
        console.log("came in content controller");
        const result = ContentInputSchema.safeParse(req.body);
        if(!result.success){
            res.status(400).json({message:result.error.errors[0].message});
            return;
        }
        const contentData: ContentInput = result.data;

        //@ts-ignore
        const userId = req.user._id;
        if(!userId){
            res.status(401).json({message:"Unauthorized"});
            return;
        }

        const newContent  = await CreateContent({
            contentData,
            userId,
        })

        res.status(201).json({message:"Content created",content:newContent});
    }catch(err:any){
        res.status(500).json({message:err.message || "INTERNAL SERVOR ERROR"});
    }
}


export const getContent = async(req:Request,res:Response)=>{
    
    try{
        console.log("came in getcontent");
        //@ts-ignore
        const userId = req.user._id;
        console.log(userId);
        const content = await ContentModel.find({
            userId:userId
        }).populate("userId","firstName");

        console.log(content);

        if(!content){
            res.status(400).json({message:"No content found"});
            return;
        }

        res.status(200).json({message:"found content",content});
    }catch(err:any){
        res.status(500).json({message:err.message || "INTERNAL SERVER ERROR"});
    }
}


export const deleteContent = async(req:Request,res:Response)=>{

    try{
        console.log('came in delete content');
        //@ts-ignore
        const userId = req.user._id;
        const contentId = req.body.contentId;
        console.log(contentId);

        const deleted = await ContentModel.findOneAndDelete({
            _id:contentId,
            userId:userId
        });
        if(!deleted){
            res.status(404).json({message:"content not found or not authorized"});
            return;
        }
        res.status(200).json({message:"deleted"});
    }catch(err:any){
        res.status(500).json({message:err.message || "INTERNAL SERVER ERROR"});
    }
}

export const share = async(req:Request,res:Response)=>{

    try{
        
        const share = req.body.share;
        if(!share){
            await LinkModel.deleteOne({
            // @ts-ignore
                userId:req.user._id
            })
            res.status(200).json({message: "Removed the link"});
            return;
        }
        const exisitingLink = await LinkModel.findOne({
            //@ts-ignore
            userId:req.user._id
        })

        if(exisitingLink){
            res.status(200).json({hash:exisitingLink.hash});
            return;
        }

        const newLink = await LinkModel.create({
            // @ts-ignore
            userId: req.user._id,
            hash:random(10)
        });

        res.status(200).json({hash:newLink.hash});

    }catch(err:any){
        res.status(500).json({message:err.message || "INTERNAL SERVER ERROR"});
    }
}
export const ShareLink = async(req:Request,res:Response)=>{

    try{
        console.log("came in sharelink");
        const hash = req.params.shareLink;
        // console.log("hash: "+hash);
        const link = await LinkModel.findOne({
            hash
        })
        // console.log("link: "+link);
        if(!link){
            res.status(404).json({message:"Incorrect Input"});
            return;
        }
        const content = await ContentModel.find({
            userId:link.userId
        })
        if(!content){
            res.status(404).json({message:"NO CONTENT AVAIBLE"});
            return;
        }

        const user = await UserModel.findOne({
            _id:link.userId
        })


        if(!user){
            res.status(404).json({message:"Content User not found"});
            return;
        }

        const firstName = user.firstName;
        console.log("firstName: "+firstName)

        res.status(200).json({
            firstName,
            content
        })
    }catch(err:any){
        res.status(500).json({message:err.message || "INTERNAL SERVER ERROR"});
    }
}



