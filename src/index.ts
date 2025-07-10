import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 🟢 Connect to MongoDB
connectDB();

// 🔧 Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Allowed origins for frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://yourbrain.vercel.app",
  "https://brain-frontend-ha7o-git-main-akhand0ps-projects.vercel.app",
  "https://brain-frontend-gilt.vercel.app"
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Preflight request handler
app.options("*", cors());

// ✅ Routes
app.get("/hey", (req, res) => {
  res.send("Hey from backend!");
});

app.use("/api/v1", UserRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
