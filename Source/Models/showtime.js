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


Showtime.getTimeMovieOfMovieTheater = async function()
{
    const timeMovie = db.query('SELECT"mv"."Name","st"."MovieTheaterId","st"."BeginAt", "mv"."id" FROM"Showtimes"AS"st"JOIN"MovieTheaters"AS"mt"ON"st"."MovieTheaterId"="mt"."id"JOIN"Movies"AS"mv"ON"mv"."id"="st"."MovieId"GROUP BY"st"."MovieTheaterId","mv"."Name","st"."BeginAt","mv"."id"',
                                { type: db.QueryTypes.SELECT });
    return timeMovie;
}

Showtime.belongsTo(Movie);
Movie.hasMany(Showtime);

Showtime.belongsTo(MovieTheater);
MovieTheater.hasMany(Showtime);

module.exports=Showtime;