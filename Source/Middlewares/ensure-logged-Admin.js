module.exports=function ensureLoggedIn(req,res,next)
{
    if(!req.currentAdmin){
        res.redirect('/admin/auth/login');
    }
    else
    {
        next();
    }
};