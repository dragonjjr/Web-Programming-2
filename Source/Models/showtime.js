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

Showtime.getTimeMovieOfMovieTheater = async function()
{
    const timeMovie = db.query('SELECT"mv"."Name","st"."MovieTheaterId","st"."BeginAt", "mv"."id" FROM"Showtimes"AS"st"JOIN"MovieTheaters"AS"mt"ON"st"."MovieTheaterId"="mt"."id"JOIN"Movies"AS"mv"ON"mv"."id"="st"."MovieId"GROUP BY"st"."MovieTheaterId","mv"."Name","st"."BeginAt","mv"."id"',
                                { type: db.QueryTypes.SELECT });
    return timeMovie;
}

Showtime.getListByMovieId=async function(movieId)
{
    const showtimes = await db.query('SELECT "st"."id" AS "ShowtimeId","mvtc"."Name" AS "MvThtClusterName", "mvtc"."id" AS "MvThtClusterId","mvt"."Name" AS "MvThtName", "mvt"."id" AS "MvThtId", "st"."BeginAt" AS "Time", "st"."PriceTicket" AS "Price" FROM "Showtimes" AS st JOIN "MovieTheaters" AS mvt ON "st"."MovieTheaterId"="mvt"."id" JOIN "MovieTheaterClusters" AS mvtc ON "mvt"."MovieTheaterClusterId"="mvtc"."id" WHERE "st"."MovieId"=?', 
    { 
        replacements: [movieId], //mảng danh sách tham số
        type: db.QueryTypes.SELECT 
    });
    return showtimes;
}

Showtime.getByShowtimeId=async function(showtimeId)
{
    const showtime = await db.query('SELECT "st"."BeginAt" AS "BeginAt", "mv"."Name" AS "NameMovie", "mvt"."Name" AS "NameMvt","mvt"."Address" AS "AddressMvt" FROM "Showtimes" AS st JOIN "Movies" AS mv ON "st"."MovieId"="mv"."id" JOIN "MovieTheaters" AS mvt ON "mvt"."id"="st"."MovieTheaterId" WHERE "st"."id"=?', 
    { 
        replacements: [showtimeId], //mảng danh sách tham số
        type: db.QueryTypes.SELECT 
    });
    return showtime;
}

module.exports=Showtime;