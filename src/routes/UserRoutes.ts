import express from "express";

import {signup,login,content,getContent,deleteContent, share, ShareLink,me} from "../controllers/UserController";
import { UserAuth } from "../middleware/UserAuth";
const router = express.Router();


router.post("/register",signup);
router.post("/login",login);
router.get("/me",UserAuth,me);
router.post("/content",UserAuth,content);
router.get("/content",UserAuth,getContent);
router.delete("/content",UserAuth,deleteContent);
router.put("/brain/share",UserAuth,share);
router.get("/brain/:shareLink",ShareLink);//no need of middleware


export default router;