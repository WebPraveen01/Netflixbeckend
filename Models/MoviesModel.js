import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    userName:{type:String,required:true},
    userImage:{type:String},
    rating:{type:Number,required:true},
    comment:{type:Number,required:true},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
},
{
    timestamp:true,
}
);


 const moviesSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    titleImage:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        rquired:true,
    },
    catagory:{
        type:String,
        rquired:true,
    },
    language:{
        type:String,
        rquired:true,
    },
    year:{
        type:Number,
        rquired:true,
    },
    time:{
        type:Number,
        rquired:true,
    },
    video:{
        type:Number,
        //rquired:true,
    },
    rate:{
        type:Number,
        rquired:true,
        default:0
    },
    numberofReviews:{
        type:Number,
        rquired:true,
        default:0
    },
    reviews:[reviewSchema],
    casts:[
        {
         name:{type:String,rquired:true},
         image:{type:String,rquired:true},
        }
    ]
    
 },
 {
    timestamp:true,
 }
 
 );


export default mongoose.model("Movies",moviesSchema);