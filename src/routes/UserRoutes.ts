import express from "express";
import cors from "cors"; // <--- Import cors
import { signup, login, content, getContent, deleteContent, share, ShareLink, me } from "../controllers/UserController";
import { UserAuth } from "../middleware/UserAuth";

const router = express.Router();

// // Define allowed origins for CORS. It's good practice to keep this consistent
// // with your main app.js or server.ts if you have a global CORS setup.
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://yourbrain.vercel.app",
//   // Note: The following two Vercel URLs are typically for specific deployments
//   // and might change. For production, focus on the main domain.
//   "https://vercel.com/akhand0ps-projects/brain-frontend-ha7o/Gy8TCo5vinTcmZjkwhzRRjDfmD8E",
//   "https://brain-frontend-ha7o-git-main-akhand0ps-projects.vercel.app"
// ];

// // Configure CORS options specifically for these routes
// const corsOptions = {
//   origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     // or if the origin is in our allowed list.
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"), false);
//     }
//   },
//   credentials: true, // Allow cookies, authorization headers, etc.
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly list all allowed methods
//   allowedHeaders: ["Content-Type", "Authorization"] // Explicitly list all allowed headers
// };

// // Apply the CORS middleware to all routes handled by this router.
// // This will automatically handle preflight (OPTIONS) requests.
// router.use(cors(corsOptions)); // <--- Add this line here

// Now define your actual routes

router.post("/register", signup);
router.post("/login", login);
router.get("/me", UserAuth, me);
router.post("/content", UserAuth, content);
router.get("/content", UserAuth, getContent);
router.delete("/content", UserAuth, deleteContent);
router.put("/brain/share", UserAuth, share);
router.get("/brain/:shareLink", ShareLink); // No need for UserAuth middleware here

export default router;