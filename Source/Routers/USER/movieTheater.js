const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const MovieTheaterCluster=require('../../Models/movieTheaterCluster');
const MovieTheater=require('../../Models/movieTheater');
const Showtime=require('../../Models/showtime');
const router = express.Router();
const { body, validationResult } = require('express-validator');




module.exports=router;