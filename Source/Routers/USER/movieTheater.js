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

router.get('/getlistcinema',expressAsyncHandler(async function(req,res){

    try
    {
        const locationId=req.query.locationid;
        var cinema = await MovieTheater.getByLocationId(locationId);

        if(req.query.pageIndex)
        {
            const pageIndex = req.query.pageIndex;
            const numItemInPage = 5;
            var cinema = await MovieTheater.getListMovieTheater(locationId,pageIndex,numItemInPage);
            
        }
        res.send(JSON.stringify(cinema));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
    
}));



router.get('/getcinema',expressAsyncHandler(async function(req,res){

    try
    {
        const locationId=req.query.locationid;
        var cinema = await MovieTheater.findById(locationId);
        res.send(JSON.stringify(cinema));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
    
}));

router.get('/gettimemovieofmovietheater',expressAsyncHandler(async function(req,res){

    try
    {
        const locationId=req.query.locationid;
        const nameMovie = await Movie.getNameMovieOfMovieTheater(locationId);
        const timeMovie = await Showtime.getTimeMovieOfMovieTheater(locationId);
        timeMovie.forEach(element => {
            element.BeginAt = moment(element.BeginAt).format("HH:mm A");
        });
        timeMovie.sort(function (a, b) {
            return a.BeginAt.localeCompare(b.BeginAt);
        });

        var ListTimeMovie = [[],[]];
        nameMovie.forEach(elementnameMovie=>{
            ListTimeMovie[0].push(elementnameMovie);
        })
        timeMovie.forEach(elementtimeMovie=>{
            ListTimeMovie[1].push(elementtimeMovie);
        })
        res.send(JSON.stringify(ListTimeMovie));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
    
}));

module.exports=router;