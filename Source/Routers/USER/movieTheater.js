const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const MovieTheaterCluster=require('../../Models/movieTheaterCluster');
const MovieTheater=require('../../Models/movieTheater');
const Showtime=require('../../Models/showtime');
const Movie=require('../../Models/movie');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const moment = require('moment');

router.use(function (req,res,next){
    res.locals.title='Cinemas';
    next();
})

router.get('/',expressAsyncHandler(async function(req,res){
    res.locals.movieTheaterCluster = null;
    res.locals.movieTheater = null;
    res.locals.timeMovie = null;
    res.locals.nameMovie = null;

    const movieTheaterCluster = await MovieTheaterCluster.getAll();
    const movieTheater = await MovieTheater.getAll();
    const nameMovie = await Movie.getNameMovieOfMovieTheater();
    const timeMovie = await Showtime.getTimeMovieOfMovieTheater();
    timeMovie.forEach(element => {
        element.BeginAt = moment(element.BeginAt).format("HH:mm A");
    });
    timeMovie.sort(function (a, b) {
        return a.BeginAt.localeCompare(b.BeginAt);
    });
    res.locals.timeMovie = timeMovie;
    res.locals.nameMovie = nameMovie;
    res.locals.movieTheaterCluster = movieTheaterCluster;
    res.locals.movieTheater = movieTheater;
    res.render('USER/cinemas');
}));

router.post('/',expressAsyncHandler(async function(req,res){
    res.end('AAa');
}));


module.exports=router;