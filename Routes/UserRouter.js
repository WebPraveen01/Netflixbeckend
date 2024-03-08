import express from "express";
import { changeUserPassword, getLikedMovies, addLikedMovie,getUsers, loginUser, registerUser } from "../Controllers/UserControllers.js";
import {admin} from "../midddleware/Auth.js"

const router =  express.Router();

router.post("/",registerUser);
router.post("/login",loginUser);
router.put("/password",changeUserPassword);
router.get("/favorites",getLikedMovies);
router.post("/favorites",addLikedMovie);
router.get("/", admin,getUsers);

export default router;