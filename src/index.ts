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

const allowedOrigins = [
  "http://localhost:5173",
  "https://yourbrain.vercel.app",
  "https://vercel.com/akhand0ps-projects/backend-brain/D6pi2MrvfpeTkozNQmKqTtqiWkQx"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
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