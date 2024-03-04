import express from "express";
import { changeUserPassword, loginUser, registerUser } from "../Controllers/UserControllers.js";

const router =  express.Router();

router.post("/",registerUser);
router.post("/login",loginUser);
router.put("/password",changeUserPassword);

export default router;