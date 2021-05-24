const asyncHandler = require('express-async-handler');
const User=require('../Models/users')

module.exports=asyncHandler(async function auth(req,res,next)
{
    const {userId,passport}=req.session;
    res.locals.currentUser=null;
    res.locals.errors = null;
    
    if(userId)
    {
        User.findById(userId).then(function(user){
            if(user)
            {
                req.currentUser=user;
                res.locals.currentUser=user; 
            }
            next();
        }).catch(next);
    }
    else if(passport && passport.user)
    {
      User.findById(passport.user).then(function(user){
            if(user)
           {
                req.currentUser=user;
                res.locals.currentUser=user; 
            }
            next();
        }).catch(next);
    }
    else
    {
        next();
    }
});