const express = require('express');
const bcrypt=require('bcrypt');
const uuid=require('uuid');
const expressAsyncHandler = require('express-async-handler');
const User = require('../../Models/users');
const Email=require('../../Models/email');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());


//set layout
router.use(function (req,res,next){
    res.locals.layout='Layouts/layoutLogin';
    next();
})

router.get('/login',function(req,res){
    res.render('USER/auth/login',{title: 'Login' });
});

router.post('/login',expressAsyncHandler(async function(req,res){

    res.locals.errors=null;
    const {username,password}=req.body;
    const user = await User.findByEmail(username);
  
    if(user && bcrypt.compareSync(password,user.Password)&&user.Token===null)
    {
        req.session.userId=user.id;
        res.redirect('/');
    }
    else
    {
        res.locals.errors=["Email or passwork incorrect"];
        return res.status(400).render('USER/auth/login', {title: 'Login' });
    }

}));

router.get('/register',function(req,res){
    res.render('USER/auth/register',{title: 'Register' });
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

    res.locals.errors=null;
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('USER/auth/register', { errors: errors.array(), title: 'Register' });
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

    res.locals.notifications=null;
    res.locals.notifications=["Send to your mail success, please check to reset password"];
    return res.status(400).render('USER/auth/register', {title: 'Register' });
    
}));


router.get('/activateAccount',expressAsyncHandler(async function(req,res)
{

    const email=req.query.email;
    const token=req.query.token;

    const isActivate=await User.activate(email,token);

    if(isActivate==false)
    {
        res.send('Error, verify your account dont succeed');
    }
    else
    {
        res.redirect('/auth/login');
    }
}));

router.get('/forgotpassword',function(req,res){
    res.render('USER/auth/forgotPassword', {title: 'Forgot password' });
});

router.post('/forgotpassword',[
    body('email')
    .isEmail()
    .normalizeEmail()
    .custom(async function(email){
        const found = await User.findByEmail(email);

        if(!found)
        {
            throw Error('Email does not exist');
        }
        else {
            return true;
        }
    }),
],expressAsyncHandler(async function(req,res){

    res.locals.errors=null;
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('USER/auth/forgotpassword', { errors: errors.array(), title: 'Forgot password' });
    }
    const {email}=req.body;

    const user= await User.findByEmail(email);

    //tạo id xác thực ngẫu nhiên
    const token=uuid.v4();

    user.Token=token;
    await user.save();

    //gui email
    const url = process.env.BASE_URL || 'http://localhost:3000';
    const subject = 'Quên mật khẩu';
    await Email.send(email, subject, "Forgor password",'<b>Link to reset your password, click to login: <a href="'+url+'/auth/resetpassword?email='+email+'&token='+token+'">Reset password</a></b>');

    res.locals.notifications=null;
    res.locals.notifications=["Send to your mail success, please check to reset password"];
    return res.status(400).render('USER/auth/forgotpassword', {title: 'Forgot password' });

 
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
    
            res.render('USER/auth/resetPassword',  {title: 'Reset password' });
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

        res.redirect('/auth/login');
    }
   
    else
    {
        res.send('Error');
    }
   
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || '1155874818257998',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '0ce9a896b4b4a157ff468b10352ce466',
    callbackURL: "http://localhost:3000/auth/facebook/cb",
    profileFields: ['id','email','displayName']
  },
   expressAsyncHandler( async function(accessToken, refreshToken, profile, cb) {
        const found = await User.findByEmail(profile.emails[0].value);
        if(found)
        {
            return cb(null,found.id);
        }
        else {
            await User.createUser(profile.displayName,profile.emails[0].value,'','','user',null);
        } 
        const found2 = await User.findByEmail(profile.emails[0].value);
        return cb(null,found2.id);
  })));

router.get('/facebook',
  passport.authenticate('facebook',{scope:'email'}));

router.get('/facebook/cb',
  passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Đăng nhập thành công
    //Chuyển hướng
    res.redirect('/');
});
passport.serializeUser(function(user,done){
    done(null,user);
});
passport.deserializeUser(function(id,done){
    return done(null,id);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID || '166614953659-sakaimlo77u2836bn2eci0kd327v4eqq.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_APP_SECRET || 'GdOvaVe6MgIbF3WCqbUc4OpA',
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
   expressAsyncHandler( async function(accessToken, refreshToken, profile, cb) {
        const found = await User.findByEmail(profile.emails[0].value);
        if(found)
        {
            return cb(null,found.id);
        }
        else {
            await User.createUser(profile.displayName,profile.emails[0].value,'','','user',null);
        } 
        const found2 = await User.findByEmail(profile.emails[0].value);
        return cb(null,found2.id);
  })));


router.get('/google',
  passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
      console.log(req.params);
    // Đăng nhập thành công
    //Chuyển hướng
    res.redirect('/');
});

router.get('/logout',function(req,res){
    delete req.session.userId; //xóa session
    res.redirect('/auth/login');
})

module.exports=router;