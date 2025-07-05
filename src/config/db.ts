import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL as string;

export const connectDB = async()=>{
    try{
        await mongoose.connect(MONGO_DB_URL);
        console.log("MongoDB connected");
    }catch(err){
        console.log("MongoDB connection error",err);
        process.exit(1);
    }
}