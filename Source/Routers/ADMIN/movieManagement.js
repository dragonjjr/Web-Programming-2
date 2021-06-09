const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const router = express.Router();

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

   res.render('ADMIN/movie');
}));


module.exports=router;