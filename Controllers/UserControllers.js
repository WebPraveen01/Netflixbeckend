import asyncHandler from "express-async-handler";
import UserModel from "../Models/UserModel.js";
import bcryptjs from "bcryptjs";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import pkg from 'passport'
import { generateToken } from "../midddleware/Auth.js";
import express from "express";

//  export const registerUser = asyncHandler(async(req,res)=>{
//     console.log(req.body);
//     const {fullName,email, password,image} = req.body
//     try{
//         const userExists = await UserModel.findOne({email})
//         if(userExists){
//             res.status(400)
//             throw new Error("user already exists");
//         }

//         //const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, 7);

//         const user =  await UserModel.create({
//             fullName,
//             email,
//             password:hashedPassword,
//             image,
//         });

//         if(user){
//             res.status(201).json({
//                 _id:user._id,
//                 fullName:user.fullName,
//                 email:user.email,
//                 image:user.image,
//                 isAdmin:user.isAdmin,
//                 //token:generateToken(user_id),

//             });
//         }else{
//             res.status(400);
//             throw new Error("Invalid user data");
//         }
        
       
//     }catch(error){}
// })

 export const registerUser = async (req, res) => {
     
    console.log(req.body,"hi")
    const { fullName,email, password, image } = req.body;
    
    try {
      const preuser = await UserModel.findOne({ email });
      if (preuser) {
        res.status(422).json({ error: "This email is already exist" });
    //   } else if (password !== cpassword) {
    //     res.status(422).json({ error: "password are not matching" });;
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const finaluser = new UserModel({
        fullName:fullName,
        email :email, 
        password: hashedPassword, 
        image :image,
        //isAdmin:isAdmin,
        //token:generateToken(id),
        });
  
        // yaha pe hasing krenge
  
        const storedata = await finaluser.save();
        // console.log(storedata + "user successfully added");
        res.status(201).json(storedata);
      }
    }
    catch (error) {
      res.status(500).json({ error: error.message });
  
    }
  };

  // export const loginUser = asyncHandler(async(req,res)=>{
  //    const {email, password} = req.body;
  //    try{
  //       const user = await User.findOne({email});
  //       if(user &&(await bcrypt.compare(password,user.password))){
  //           res.json({
  //               _id:user_id,
  //               fullName:user.fullName,
  //               email:user.email,
  //               image:user.image,
  //               isAdmin:user.isAdmin,
  //               token:generateToken(user_id),
  //           })
  //       } else{
  //           res.status(401);
  //           throw new Error("invalid email or passoword")
  //       }

  //    } catch(error){
  //       res.status(400).json({message:error.me})
  //    }
  // })
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ error: "fill the details" });
    }
    try {
  
      const userlogin = await UserModel.findOne({ email: email });
      const isMatch = await bcrypt.compare(String (password), String(userlogin.password));
      if (userlogin) {
        console.log("is match", isMatch);

      } else {
        res.status(400).json({ error: "user not exist" });
      }
      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential pass" });
      } 
      else {
        // Generate a JWT token
        const token = jwt.sign({ userId: UserModel._id }, "MySecretKey", { expiresIn: '1d' });
        await UserModel.findOneAndUpdate(
          { email },
          { tokens: { token } },
          { new: true });
        // res.cookie("AsmiBoutique", token, {
        //   expires: new Date(Date.now() + 2589000),
        //   httpOnly: true
        // });
        // Send the token back to the user
        res.status(201).json({ userlogin, token });
      }
  
    } catch (error) {
      console.log(error.message);
    }
  }

export const changeUserPassword = asyncHandler(async(req,res)=>{
    const  { email,oldPassword,newPassword } =req.body;
    try{
        const user = await UserModel.findOne({ email });
        if(user && (await bcrypt.compare(String (oldPassword),String(user.password)))){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword,salt);
            user.password= hashedPassword;
            await user.save();
            res.json({ message:"Password Change"});
        }
        else{
            res.status(401);
            throw new Error("Invalid old password")
        }
    } catch(error){
        res.status(400).json({message:error.message})
    }
});


export const getLikedMovies =asyncHandler(async(req,res) =>{
  try{
    const user = await UserModel.findById(req._id).populate("likedMovies");
    if(user){
      res.status(400);
      throw new Error("User not found");
    }
  }catch(error){
    res.status(400).json({message:error.message})
  }
});

export const addLikedMovie = asyncHandler(async(req,res)=>{
  const {movieId}  = req.body;
  try{
    const user = await UserModel.findById(req._id)
    if(user){
      if(user.likedMovies.includes(movieId)){
        res.status(400);
        throw new Error("Movie already liked");
      }
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies)
    }
    else{
      res.status(404);
      throw new Error("User not found")
    }
  } catch(error){
    res.status(400).json({message:error.message})
  }
})

export const getUsers =asyncHandler(async(req,res)=>{
try{
 const users = await User.find({});
 res.json(users)
} catch(error){
  res.status(400).json("message:error.message");
}
})

