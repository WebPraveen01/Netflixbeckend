import express from "express";
import { getMovieById, getMovies, getRandomMovies, getTopratedMovies, importMovies } from "../Controllers/MoviesController.js";
import { admin } from "../midddleware/Auth.js";

const router = express.Router();

router.post("/import",importMovies);
router.get("/",getMovies);
router.get("/:id",getMovieById);
router.get("/rated/top",getTopratedMovies);
router.get("/random/all",getRandomMovies);


 export default router;