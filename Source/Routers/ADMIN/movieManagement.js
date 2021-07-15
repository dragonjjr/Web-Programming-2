const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const Movie= require('../../Models/movie');
const Showtime= require('../../Models/showtime');
const MovieTheaterCluster=require('../../Models/movieTheaterCluster');
const MovieTheater=require('../../Models/movieTheater');
const router = express.Router();
const checkLogged=require('../../Middlewares/ensure-logged-Admin');

router.use(checkLogged);

//set layout
router.use(function (req,res,next){
    res.locals.layout='Layouts/layoutAdmin';
    next();
})

router.use(function (req,res,next){
    res.locals.title='Movie management';
    next();
})

router.get('/',expressAsyncHandler(async function(req,res){

  // ==============MOVIE ===================================
   const numItemInPage=5; 
   var pageIndex=1;
   if(req.query.pageIndex)
   {
      pageIndex=req.query.pageIndex;
   }
   
   const AllMovie=await Movie.getAll();

   //cal num page
   var len=AllMovie.length; 
   var page=Math.floor(len/numItemInPage);
   if(len%numItemInPage>0)
   {
     page+=1;
   }
   res.locals.pageMovie=page;
   res.locals.pageIndex=pageIndex;     
   res.locals.Movies=await Movie.getListMovie(pageIndex,numItemInPage);
   //==================================================================

   
   res.render('ADMIN/movie');
}));

// ========================= MOVIE ===================================
router.post('/updatemovie',expressAsyncHandler(async function(req,res){

    try
    {
        var movieNewData=req.body.movieUpdate;
        var movieOldData=await Movie.findById(movieNewData.id);
    
        movieOldData.Name=movieNewData.Name;
        movieOldData.Time=movieNewData.Time;
        movieOldData.ReleaseDate=movieNewData.ReleaseDate;
        movieOldData.Introduce=movieNewData.Introduce;
        movieOldData.PosterImage=movieNewData.PosterImage;
        movieOldData.Trailer=movieNewData.Trailer;
    
        await movieOldData.save();
    
        res.send(JSON.stringify("OK"));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
    
}));

router.post('/addmovie',expressAsyncHandler(async function(req,res){

    try
    {
        const movie=req.body.movieNew;
        await Movie.createMovie(movie.Name,movie.ReleaseDate,movie.PosterImage,movie.Time,movie.Introduce,movie.Trailer);
    
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
    
}));

router.post('/deletemovie',expressAsyncHandler(async function(req,res){

    try
    {
        const listIdMovie=req.body.listIdMovie;
        for(var id of listIdMovie)
        {
            await Movie.deleteById(id);
        }
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
    
}));


module.exports=router;