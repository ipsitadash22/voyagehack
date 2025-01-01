import express from "express";
import { login, register } from "../controllers/auth.js";
const router=express.Router();
//we r posting a request on the portal
router.post("/register",register)
router.post("/login",login)
export default router