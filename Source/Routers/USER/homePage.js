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

router.get('/',function(req,res){
    res.render('USER/index');
});


module.exports=router;