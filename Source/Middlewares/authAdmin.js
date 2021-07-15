const asyncHandler = require('express-async-handler');
const User=require('../Models/users')

module.exports=asyncHandler(async function auth(req,res,next)
{
    const {adminId}=req.session;
    res.locals.currentAdmin=null;

    if(adminId)
    {
        User.findById(adminId).then(function(admin){
            if(admin)
            {
                req.currentAdmin=admin;
                res.locals.currentAdmin=admin; 
            }
            next();
        }).catch(next);
    }
    else
    {
        next();
    }
});