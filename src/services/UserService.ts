import {ContentModel, UserModel} from "../models/User.model";
import {z} from "zod";
import bcrypt from "bcrypt";
import { content, ContentInput } from "../controllers/UserController";

const CheckUser = z.object({
    firstName:z.string().min(3,{message:"Firstname must be more than 3 chars"}),
    lastName:z.string().min(3,{message:"lastName must be atleast 3 chars"}).optional(),
    email:z.string().email({message:"Email must be correct"}),
    password:z.string().min(3,{message:"pass must be greater then 3 chars"})
})
type check = z.infer<typeof CheckUser>



export const CreateUser = async({User}: { User: check })=>{
    try{
        const ans = await UserModel.create({
            firstName:User.firstName,
            lastName:User.lastName,
            email:User.email,
            password:User.password
        })
        return ans;
    }catch(err:any){
        return err.message || "INTERNAL SERVER ERROR";
    }
}

export const LoginUser = async(email:string, password:string)=>{

    try{

        const user = await UserModel.findOne({email});

        if(!user){
            throw new Error("no user found!!!")
        }

        const checkPass = await bcrypt.compare(password,user.password)

        return checkPass;
    }catch(err:any){
        return err.message || "INTERNAL SERVER ERROR";
    }
}


export const CreateContent = async({contentData,userId}:{contentData:ContentInput,userId:string})=>{
    try{
        const newContent = await ContentModel.create({
            title:contentData.title,
            link:contentData.link,
            tags:contentData.tags,
            userId,
            type:contentData.type
        })
        return newContent;
    }catch(err:any){
        return err.message || "INTERNAL SERVER ERROR";
    }
}   