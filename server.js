import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from "./config/db.js";
import userRouter from "./Routes/UserRouter.js";
import { errorHandler } from "./midddleware/errorMiddlewares.js";
import moviesRouter from "./Routes/MoviesRouter.js";
//import bodyParser from "body-parser";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

connectDB();

app.get("/",(req,res)=>{
    res.send('API is runnig...');
})

app.use("/api/users",userRouter);
app.use("/api/movies",moviesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 6000;

app.listen(PORT,()=>{
    console.log(`Server is running in http://localhost/${PORT}`);
});