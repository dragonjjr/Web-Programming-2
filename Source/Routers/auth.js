const express = require('express');
const bcrypt=require('bcrypt');
const uuid=require('uuid');
const expressAsyncHandler = require('express-async-handler');
const User = require('../Models/users');
const Email=require('../Models/email');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.use(function (req,res,next){
    res.locals.title='Login';
    next();
})

router.get('/login',function(req,res){
    res.render('auth/login');
});

router.post('/login',expressAsyncHandler(async function(req,res){

    const {username,password}=req.body;
    const user = await User.findByEmail(username);
  
    if(user && bcrypt.compareSync(password,user.Password)&&user.Token===null)
    {
        req.session.userId=user.id;
        res.send("Logged in");
    }
    else
    {
        res.render('auth/login');
    }

}));

router.get('/register',function(req,res){
    res.render('auth/register');
});

router.post('/register',[
    body('username')
    .isEmail()
    .normalizeEmail()
    .custom(async function(username){
        const found = await User.findByEmail(username);

        if(found)
        {
            throw Error('Email already exist');
        }
        else {
            return true;
        }
    }),

    body('fullname')
    .notEmpty(),

    body('mobilephone')
    .notEmpty(),
    
    body('password')
    .isLength({ min: 6 }),
],expressAsyncHandler(async function(req,res){

    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('auth/register', { errors: errors.array(), title: 'Register' });
    }

    const {username,password,fullname,mobilephone}=req.body;

        //hash password
    const salt = bcrypt.genSaltSync(10);
    const pwdHash=bcrypt.hashSync(password,salt);
    //tạo id xác thực ngẫu nhiên
    const token=uuid.v4();

    const role='user';
    //lưu account vào database
    await User.createUser(fullname,username,pwdHash,mobilephone,role,token);


    //gui email
    const url = process.env.BASE_URL || 'http://localhost:3000';
    const subject = 'Kích hoạt tài khoản';
    await Email.send(username, subject, "Verify account",'<b>Link to verify account, click to login: <a href="'+url+'/auth/activateAccount?email='+username+'&token='+token+'">Verify account</a></b>');

    res.send('Send to your mail success, please check to verify account');
    
   
}));


router.get('/activateAccount',expressAsyncHandler(async function(req,res)
{

    const email=req.query.email;
    const token=req.query.token;

    const isActivate=await User.activate(email,token);

    if(isActivate==false)
    {
        res.send('Kích hoạt không thành công');
    }
    else
    {
        res.redirect('/auth/login');
    }
}));

router.get('/forgotpassword',function(req,res){
    res.render('auth/forgotPassword');
});

router.post('/forgotpassword',expressAsyncHandler(async function(req,res){
    const {email}=req.body;

    const user= await User.findByEmail(email);

    if(!user)
    {
        res.send('Email does not exist');
    }

    else
    {
         //tạo id xác thực ngẫu nhiên
         const token=uuid.v4();

         user.Token=token;
         await user.save();
 
         //gui email
         const url = process.env.BASE_URL || 'http://localhost:3000';
         const subject = 'Quên mật khẩu';
         await Email.send(email, subject, "Forgor password",'<b>Link to reset your password, click to login: <a href="'+url+'/auth/resetpassword?email='+email+'&token='+token+'">Reset password</a></b>');
 
         res.send('Send to your mail success, please check to reset password');
    }
   
}));

router.get('/resetpassword',expressAsyncHandler(async function(req,res){

    const {email,token}=req.query;
    const user= await User.findByEmail(email);

    if(user)
    {
        if(user.Token===token)
        {
            user.Token=null;
            await user.save();
    
            res.render('auth/resetPassword');
        }
        else
        {
            res.send('Error');
        }
    }
    else
    {
        res.send('Error');
    }

}));

router.post('/resetpassword',expressAsyncHandler(async function(req,res){

    const {email}=req.query;
    const newPwd=req.body.newPassword;

    const user= await User.findByEmail(email);

    if(user)
    {
        //hash password
        const salt = bcrypt.genSaltSync(10);
        const pwdHash=bcrypt.hashSync(newPwd,salt);

        //lưu new password vào database
        user.Password=pwdHash;
        await user.save();

        res.send('Your password was reseted');
    }
   
    else
    {
        res.send('Error');
    }
   
}));

router.get('/logout',function(req,res){
    delete req.session.userId; //xóa session
    res.redirect('/');
})

module.exports=router;