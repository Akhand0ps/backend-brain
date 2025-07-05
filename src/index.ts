import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB} from "./config/db";
import cors from "cors";

connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: true, // or whatever your frontend port is
  credentials: true
}));
const PORT=process.env.PORT || 5000;

import UserRoutes from "./routes/UserRoutes";


app.get("/hey",(req,res)=>{
    res.send("hey");
});

app.use("/api/v1",UserRoutes);


app.listen(PORT,()=>{
    console.log(`Server running of PORT ${PORT}`);
})