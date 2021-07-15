const express = require('express');
const bcrypt=require('bcrypt');
const uuid=require('uuid');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const router = express.Router();
const { body, validationResult } = require('express-validator');

//set layout
router.use(function (req,res,next){
    res.locals.layout='Layouts/layoutLoginAdmin';
    next();
})


router.get('/login',expressAsyncHandler(async function(req,res){

   res.render('ADMIN/login',{title: 'Login'});
}));

router.post('/login',expressAsyncHandler(async function(req,res){

    const {username,password}=req.body;
    const user = await User.findByEmail(username);
  
    if(user && user.Password==password)
    {
        req.session.adminId=user.id;
        res.redirect('/admin/index');
    }
    else
    {
        res.redirect('/admin/auth/login');
    }

 }));

router.get('/logout',expressAsyncHandler(async function(req,res){
    delete req.session.adminId; //xóa session
    req.logout();
    res.redirect('/admin/auth/login')
 }));

module.exports=router;