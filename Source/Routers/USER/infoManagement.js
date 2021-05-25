const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User=require('../../Models/users');
const router = express.Router();
const { body, validationResult } = require('express-validator');


router.get('/profile',function(req,res){
    res.render('USER/information/profile',{title: 'My profile' });
});

router.get('/tickets',function(req,res){
    res.render('USER/information/bookingHistory',{title: 'My booking history' });
});

module.exports=router;