const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Movie=require('../../Models/movie');
const router = express.Router();
const { body, validationResult } = require('express-validator');


module.exports=router;