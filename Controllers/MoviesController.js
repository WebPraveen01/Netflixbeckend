import { MoviesData } from "../Data/MoviesData.js";
import asyncHandler from "express-async-handler";
import Movie from "../Models/MoviesModel.js"

 export const importMovies = asyncHandler(async(req,res) =>{
    await Movie.deleteMany({});
    const  movies =await Movie.insertMany(MoviesData);
    res.status(201).json(movies);
})

export const getMovies = asyncHandler(async(req,res)=>{
    try{
        const {catagory, time,language,rate,year,search} = req.query; 
        let query = {
            ...(catagory && {catagory}),
            ...(time && { time }),
            ...(language && { language }),
            ...(rate && { rate }),
            ...(year && { year }),
            ...(search && { name :{ $regex:search, $options: "i"} }),
            
        }
        const page = Number(req.query.pageNumber) || 1; // if page number is not provided in query we set it to 1
        const limit = 2;  // 2 movies per page
        const skip = (page-1) * limit;  // skip 2 movies per page

    //find movies by query skip and limit
        const movies = await Movie.find(query)
        .sort({createdAt: -1})
        .skip(skip).limit(limit)
    //get totol number of movies    

    const count  = await Movie.countDocuments(query);
    // send response with movie and total number of movie

    res.json({
        movies,
        page,
        pages:Math.ceil(count / limit), //total number of pages
        totalMovies:count,  // total number of  movies
    })

    }catch(error){
        res.status(400).json({message:error.message})

    }

})


 //@desc get movies by id
 // GET /api/movies/:id
 //@acess public

 export const getMovieById  = asyncHandler(async(req,res)=>{
    try{
     //find movie by id in database
     const movie = await Movie.findById(req.params.id);

     if(movie){
        res.json(movie)
     }
     else{
        res.status(404)
        throw new Error ("Movie not found")
     }

    }catch(error){
        res.status(400).json({message:error.message})
    }

})

 //@desc get top rated movies
 // GET /api/movies/random
 //@acess public
export const getTopratedMovies = asyncHandler(async(req,res)=>{
    try{
        //find top rate movies
        const movies = await Movie.find({}).sort({rate:-1});
        //send top rate movies to the client
        res.json(movies);

    }catch(error){

        res.staus(400).json({message:error.message})
    }
})

//@desc get top rated movies
 // GET /api/movies/random
 //@acess public

 export const getRandomMovies = asyncHandler(async(req,res)=>{
    try{
        const movies = await Movie.aggregate([{$sample:{size:8}}]);
        res.json(movies);

    }catch(error){
        res.status(400).json({message:error.message})

    }
 })

 export const createMovieReview = asyncHandler(async(req,res)=>{
    try{

        const movie = await Movie.findById(req.params.id);
        if(movie){
            //check if the user already reviewd this movie
            const alreadyReviewed = movie.reviews.find(
                (r) => r.userId.toString()=== req.user._id.toString()
            );
            if(alreadyReviewed){
                res.status(400);
                throw new Error("you already reviwed this movie");
            }
            //else create a new review

            const review = {
                userName:req.userfullName,
                userId:req.user._id,
                userImage:req.user.image,
                rating: Number(rating), 
                comment,
            }

            //push the new reivew to reivew array
            movie.reviews.push(review);
            //increment the number of reviews
            movie.numberofReviews = movie.reviews.length;
            //calculat the new rate

            movie.rate = movie.review.reduce((acc,item) => item.rating + acc,0) / movie.reviews.length;
            //save into the database

            await movie.save();
            res.status(201).json({
                message:"Review added",
            });

        }else{
            res.status(400);
            throw new Error("Movie not found");
        }
    }catch(error){
        res.status(400).json({message: error.message})

    }
 })