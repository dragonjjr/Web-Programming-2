const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Movie=require('../../Models/movie');
const User = require('../../Models/users');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(function (req,res,next){
    res.locals.title='Home';
    next();
})

router.get('/',expressAsyncHandler(async function(req,res){

    res.locals.nowShowingMovies=null;
    res.locals.topMovies=null;
    //lấy 5 phim
    const topMovies=await Movie.getListTopMovie(4);
    const nowSwMovies=await Movie.getListNewMovie(6);

    res.locals.topMovies=topMovies;
    res.locals.nowShowingMovies=nowSwMovies;

    res.render('USER/index');
}));


module.exports=router;