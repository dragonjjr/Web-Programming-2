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
    res.locals.title='Showtime management';
    next();
})

router.get('/',expressAsyncHandler(async function(req,res){

    try
    {
        //============= SHOW TIME =====================================
        var ListShowtime=null;
        const numItemStInPage=8;
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
  
}));


// ========================= SHOWTIME ===================================
router.get('/getlistcinema',expressAsyncHandler(async function(req,res){

    try
    {
        const locationId=req.query.locationid;
        var cinema = await MovieTheater.getByLocationId(locationId);
        res.send(JSON.stringify(cinema));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
    
}));

router.post('/updateshowtime',expressAsyncHandler(async function(req,res){

    try
    {
        var showtimeNewData=req.body.showtimeUpdate;
        var showtimeOldData=await Showtime.findById(showtimeNewData.id);
    
        showtimeOldData.BeginAt=showtimeNewData.BeginAt;
        showtimeOldData.EndAt=showtimeNewData.EndAt;
        showtimeOldData.PriceTicket=showtimeNewData.PriceTicket;
    
        await showtimeOldData.save();
    
        res.send(JSON.stringify("OK"));
    }
    catch
    {
        res.send(JSON.stringify("F"));
    }
    
}));

router.post('/deleteshowtime',expressAsyncHandler(async function(req,res)
{
    try
    {
        const listIdShowtime=req.body.listIdShowtime;
        for(var id of listIdShowtime)
        {
            await Showtime.deleteById(id);
        }
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
}));

router.post('/addshowtime',expressAsyncHandler(async function(req,res)
{
    try
    {
        const showtime=req.body.showtimeNew;
        await Showtime.createShowtime(showtime.BeginAt,showtime.EndAt,showtime.PriceTicket,showtime.MovieId,showtime.MovieTheaterId);
        res.send(JSON.stringify("OK"));
    }
    catch (err)
    {
        console.log(err);
        res.send(JSON.stringify("F"));
    }
}));

module.exports=router;