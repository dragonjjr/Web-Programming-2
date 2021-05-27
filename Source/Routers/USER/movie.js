const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Movie=require('../../Models/movie');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(function (req,res,next){
    res.locals.title='Detail movie';
    next();
})

router.get('/detail',expressAsyncHandler(async function(req,res){

    res.render('USER/detailMovie');
  
}));

module.exports=router;