const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const MovieTheaterCluster = require('../../Models/movieTheaterCluster');
const MovieTheater = require('../../Models/movieTheater');
const Showtime=require('../../Models/showtime');
const Movie=require('../../Models/movie');
const moment = require('moment');
const router = express.Router();
const checkLogged=require('../../Middlewares/ensure-logged-Admin');

router.use(checkLogged);

//set layout
router.use(function (req,res,next){
    res.locals.layout='Layouts/layoutAdmin';
    next();
})

router.use(function (req,res,next){
    res.locals.title='Cinema management';
    next();
})

router.get('/',expressAsyncHandler(async function(req,res){ 

   // ==============MOVIETHEATERCLUSTER ===================================
   const numItemInPage=5; 
   var pageMTCIndex=1;
   if(req.query.pageMTCIndex)
   {
      pageMTCIndex=req.query.pageMTCIndex;
   }
   const AllMovieTheaterCluster = await MovieTheaterCluster.getAll();

   //cal num page
   var len=AllMovieTheaterCluster.length; 
   var page=Math.floor(len/numItemInPage);
   if(len%numItemInPage>0)
   {
     page+=1;
   }
   res.locals.pageMovieTheaterCluster=page;
   res.locals.pageMTCIndex=pageMTCIndex;     
   res.locals.MovieTheaterCluster = await MovieTheaterCluster.getListMovieTheaterCluster(pageMTCIndex,numItemInPage);
   //==================================================================

   //========================================MOVIETHEATER=====================
   var ListMovieTheater=null;
   var pageMTIndex=1;
   if(req.query.pageMTIndex)
   {
      pageMTIndex=req.query.pageMTIndex;
   }
   var locationId='all';
   if(req.query.locationid)
   {
       locationId=req.query.locationid;
   }

   if(locationId=='all')
   {
       ListMovieTheater= await MovieTheater.getAll();
   }

   const AllMovieTheater = await MovieTheater.getAll();

   //cal num page
   var lenMovieTheater=AllMovieTheater.length; 
   var pageMovieTheater=Math.floor(lenMovieTheater/numItemInPage);
   if(lenMovieTheater%numItemInPage>0)
   {
     pageMovieTheater+=1;
   }
   res.locals.pageMovieTheater=pageMovieTheater;
   res.locals.pageMTIndex=pageMTIndex;     
   res.locals.Locations = AllMovieTheaterCluster;
   res.locals.locationId = locationId;
    res.render('ADMIN/cinema');
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

router.post('/updatemovietheatercluster',expressAsyncHandler(async function(req,res){

    try
    {
        var movieTheaterClusterNewData = req.body.movieTheaterClusterUpdate;
        var movieTheaterClusterOldData = await MovieTheaterCluster.findById(movieTheaterClusterNewData.id);

        movieTheaterClusterOldData.Name=movieTheaterClusterNewData.Name;

        await movieTheaterClusterOldData.save();
    
        res.send(JSON.stringify("OK"));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
}));


router.post('/deletemovietheatercluster',expressAsyncHandler(async function(req,res)
{
    try
    {
        const listIdMovieTheaterCluster=req.body.listIdMovieTheaterCluster;
        for(var id of listIdMovieTheaterCluster)
        {
            await MovieTheaterCluster.deleteById(id);
        }
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
}));

router.post('/addmovietheatercluster',expressAsyncHandler(async function(req,res){

    try
    {
        const movietheatercluster=req.body.movieTheaterClusterNew;
        await MovieTheaterCluster.createMovieTheaterCluster(movietheatercluster.Name);
    
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
    
}));


//================================MovieTheater====================================
router.post('/deletemovietheater',expressAsyncHandler(async function(req,res)
{
    try
    {
        const listIdMovieTheater=req.body.listIdMovieTheater;
        for(var id of listIdMovieTheater)
        {
            await MovieTheater.deleteById(id);
        }
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
}));
router.post('/addmovietheater',expressAsyncHandler(async function(req,res){

    try
    {
        const movietheater=req.body.movieTheaterNew;
        await MovieTheater.createMovieTheater(movietheater.Name,movietheater.Address,movietheater.Image,movietheater.Kind,movietheater.Width,movietheater.Height,movietheater.MovieTheaterClusterId);
    
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
    
}));
router.post('/updatemovietheater',expressAsyncHandler(async function(req,res){

    try
    {
        var movieTheaterNewData = req.body.movieTheaterUpdate;
        var movieTheaterOldData = await MovieTheater.findById(movieTheaterNewData.id);
        movieTheaterOldData.Name=movieTheaterNewData.Name;
        movieTheaterOldData.Address=movieTheaterNewData.Address;
        movieTheaterOldData.Image=movieTheaterNewData.Image;
        movieTheaterOldData.Kind=movieTheaterNewData.Kind;
        movieTheaterOldData.Width=movieTheaterNewData.Width;
        movieTheaterOldData.Height=movieTheaterNewData.Height;
        await movieTheaterOldData.save();
    
        res.send(JSON.stringify("OK"));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
}));
module.exports=router;