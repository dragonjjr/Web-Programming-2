const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const MovieTheaterCluster = require('../../Models/movieTheaterCluster');
const MovieTheater = require('../../Models/movieTheater');
const router = express.Router();

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
   var pageMovieTheater=Math.floor(len/numItemInPage);
   if(lenMovieTheater%numItemInPage>0)
   {
     pageMovieTheater+=1;
   }
   res.locals.pageMovieTheater=pageMovieTheater;
   res.locals.pageMTIndex=pageMTIndex;     
   res.locals.MovieTheater = await MovieTheater.getListMovieTheater(pageMTIndex,numItemInPage);

   try
   {
       //============= SHOW TIME =====================================
      
       var pageIndex=1;

       if(req.query.pageIndex)
       {
           pageIndex=req.query.pageIndex;
       }

       var locationId='all';
       var cinemaId='all';
       //execute: check location and cinema

       if(req.query.locationid && req.query.cinemaid)
       {
           locationId=req.query.locationid;
           cinemaId=req.query.cinemaid;
       }

       if(locationId=='all')
       {
           ListShowtime= await Showtime.getAll();
       }
       else if(cinemaId=='all')
       {
           ListShowtime= await Showtime.getListByLocationId(locationId);
       }
       else
       {
           ListShowtime= await Showtime.getListByCinemaId(cinemaId);
       }

       const AllMovie=await Movie.getAll();
       const AllLocation= await MovieTheaterCluster.getAll();

       //cal num page
       var lenSt=ListShowtime.length; 
       var pageSt=Math.floor(lenSt/numItemStInPage);
       if(lenSt%numItemStInPage>0)
       {
           pageSt+=1;
       }

       res.locals.pageShowtime=pageSt;
       res.locals.pageIndex=pageIndex;  
       
       res.locals.Locations=AllLocation;
       res.locals.AllMovie=AllMovie;
       res.locals.locationId=locationId;
       res.locals.cinemaId=cinemaId;


       const beginIndex=(pageIndex-1)*numItemStInPage;
       res.locals.Showtimes=ListShowtime.slice(beginIndex,beginIndex+numItemStInPage);

       res.render('ADMIN/showtime');
   }
   catch (err)
   {
       console.log(err);
       res.send('error');
   }


    res.render('ADMIN/cinema');
}));

router.post('/updatecinema',expressAsyncHandler(async function(req,res){

    try
    {
        var movieTheaterClusterNewData = req.body.movieTheaterClusterUpdate;
        var movieTheaterClusterOldData = await MovieTheaterCluster.findById(movieTheaterClusterNewData.id);
        console.log(movieTheaterClusterOldData);

        movieTheaterClusterOldData.Name=movieTheaterClusterNewData.Name;

        await movieTheaterClusterOldData.save();
    
        res.send(JSON.stringify("OK"));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
}));


router.post('/deletecinema',expressAsyncHandler(async function(req,res)
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

router.post('/addcinema',expressAsyncHandler(async function(req,res){

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


module.exports=router;