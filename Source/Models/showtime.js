const { DataTypes } = require('sequelize');
const db=require('./database');
const Movie=require('./movie');
const MovieTheater=require('./movieTheater');

const Showtime = db.define('Showtime', {
    // Model attributes are defined here
    BeginAt:{
        type: DataTypes.DATE,
        allowNull: true,
    },  
    EndAt:{
        type: DataTypes.DATE,
        allowNull: true,
    },  
    PriceTicket:{
        type: DataTypes.DOUBLE,
        allowNull: true,
    },  
  },{
       // Other model options go here
  });

Showtime.belongsTo(Movie);
Movie.hasMany(Showtime);

Showtime.belongsTo(MovieTheater);
MovieTheater.hasMany(Showtime);

module.exports=Showtime;