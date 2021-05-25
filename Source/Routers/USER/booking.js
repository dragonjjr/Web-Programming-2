const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Ticket=require('../../Models/ticket');
const Booking=require('../../Models/booking');
const User=require('../../Models/users');
const router = express.Router();
const { body, validationResult } = require('express-validator');




module.exports=router;