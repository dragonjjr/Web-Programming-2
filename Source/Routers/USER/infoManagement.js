const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User=require('../../Models/users');
const Booking=require('../../Models/booking');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const checkLogged=require('../../Middlewares/ensure-logged-in');
router.use(checkLogged);


router.get('/profile',function(req,res){
    res.render('USER/information/profile',{title: 'My profile' });
});

//save profile
router.post('/profile',expressAsyncHandler(async function(req,res){
   var user=res.locals.currentUser;
   const newName=req.body.name;
   const newPhone=req.body.phone;

   user.Name=newName;
   user.Phone=newPhone;
   await user.save();

   res.redirect('/information/profile');
}));

router.get('/tickets',expressAsyncHandler(async function(req,res){
    var user=res.locals.currentUser;
    res.locals.Bookings=null;

    const Bookings=await Booking.getListBookingOfUser(user.id);
    res.locals.Bookings=Bookings;

    res.render('USER/information/bookingHistory',{title: 'My booking history' });
}));

module.exports=router;