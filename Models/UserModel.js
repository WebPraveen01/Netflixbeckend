import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Please add a full name"],
    },
    email:{
        type:String,
        required:[true,"Please add a an email"],
    },
    password:{
        type:String,
        requried:[true,'Please add password'],
        minlength:[6,'password must be atleast 6 character'],

    },
    image:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    likedMovies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Movies",
        }
    ]
},
{
    timeStamps:true,
}
);

export default mongoose.model("User",UserSchema);
