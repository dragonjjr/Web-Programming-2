const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Movie=require('../../Models/movie');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const moment = require('moment');


router.get('/',expressAsyncHandler(async function(req,res){
    res.locals.movies=null;
    const movies= await Movie.getListMovieInShowtime();
    res.locals.movies=movies;
    res.render('USER/movie',{title : 'New movies'});
  
}));

router.get('/detail',expressAsyncHandler(async function(req,res){
    res.locals.moviedetail=null;
    const id = req.query.id;
    const moviedetail = await Movie.findById(id);
    const ReleaseDate = moment(moviedetail.ReleaseDate).format( 'MMM-DD-YYYY');
    res.locals.moviedetail = moviedetail;
    res.render('USER/detailMovie',{ReleaseDate : ReleaseDate, title: 'Detail movie'});
  
}));

module.exports=router;