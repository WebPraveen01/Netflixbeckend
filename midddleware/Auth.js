import jwt from "jsonwebtoken";

const generateToken =(id =>{
    return jwt.sign({ id }),process.env.JWT_SECRET,{
        expiresIn:"1d",
    }
})

const admin = (req,res,next)=>{
    if(req.users && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error("not authroized as an admin")
    }
};

export { generateToken,admin };