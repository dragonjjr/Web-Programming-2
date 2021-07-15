const { DataTypes } = require('sequelize');
const db=require('./database');
const User=require('./users');
const Showtime=require('./showtime');

const Booking = db.define('Booking', {
    // Model attributes are defined here
    ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    }, 
    Date:{
        type: DataTypes.DATE,
        allowNull: true,
    },  
    PriceTotal:{
        type: DataTypes.DOUBLE,
        allowNull: true,
    },  
  },{
       // Other model options go here
});

Booking.belongsTo(User);
User.hasMany(Booking);

Booking.belongsTo(Showtime);
Showtime.hasMany(Booking);

Booking.createBooking = async function(id,date,priceTotal,showtimeId,userId) {
    await Booking.create({
        ID: id,
        Date: date,
        PriceTotal: priceTotal,
        ShowtimeId: showtimeId,
        UserId: userId
    });
}

 Booking.getListBookingOfUser= async function(userId)
 {
    //get date, movie, movietheater, tickets
    const bookings = await db.query('SELECT "bk"."createdAt", "mv"."Name" AS "nameMovie", "mvt"."Name" AS "nameMovieTheater" FROM "Bookings" AS bk JOIN "Showtimes" AS st ON "bk"."ShowtimeId"="st"."id" JOIN "Movies" AS mv ON "mv"."id"="st"."MovieId" JOIN "MovieTheaters" AS mvt ON "mvt"."id"="st"."MovieTheaterId" WHERE "bk"."UserId"=?',
                     {   replacements: [userId],
                         type: db.QueryTypes.SELECT 
                    });
    return bookings;
 };


 Booking.getTotalRevenueByMonth = async function()
 {
    const total = await db.query('SELECT EXTRACT( MONTH FROM "bk"."Date") AS Thang, EXTRACT( YEAR FROM "bk"."Date") AS Nam, SUM("bk"."PriceTotal") AS DoanhThu FROM "Bookings" AS bk GROUP BY EXTRACT( MONTH FROM "bk"."Date"), EXTRACT( YEAR FROM "bk"."Date") ORDER BY EXTRACT( YEAR FROM "bk"."Date") DESC, EXTRACT( MONTH FROM "bk"."Date") DESC OFFSET 0 LIMIT 4',
                { type: db.QueryTypes.SELECT });
    return total;
 }

 Booking.getTotalRevenueByDay = async function()
 {
    const total = await db.query('SELECT EXTRACT(DAY FROM "bk"."Date") AS Ngay, EXTRACT( MONTH FROM "bk"."Date") AS Thang, EXTRACT( YEAR FROM "bk"."Date") AS Nam, SUM("bk"."PriceTotal") AS DoanhThu FROM "Bookings" AS bk GROUP BY EXTRACT(DAY FROM "bk"."Date"), EXTRACT( MONTH FROM "bk"."Date"), EXTRACT( YEAR FROM "bk"."Date") ORDER BY EXTRACT( YEAR FROM "bk"."Date") DESC, EXTRACT( MONTH FROM "bk"."Date") DESC OFFSET 0 LIMIT 4',
                { type: db.QueryTypes.SELECT });
    return total;
 }

 Booking.getRevenueByLocation = async function(start,end)
 {
    const total = await db.query('SELECT "mvtc"."Name" AS namelocation, CASE WHEN SUM("bk"."PriceTotal") is NULL THEN 0 ELSE SUM(CASE WHEN "bk"."Date">=? AND "bk"."Date"<=? THEN "bk"."PriceTotal" ELSE 0 END) END AS doanhthu, CASE WHEN COUNT("tk"."ID") is NULL THEN 0 ELSE COUNT(CASE WHEN "bk"."Date">=? AND "bk"."Date"<=? THEN 1 ELSE NULL END) END AS numtickets FROM "Bookings" AS bk JOIN "Tickets" AS tk ON "tk"."BookingID"="bk"."ID" JOIN "Showtimes" AS st ON "bk"."ShowtimeId"="st"."id" JOIN "MovieTheaters" AS mvt ON "st"."MovieTheaterId"="mvt"."id" RIGHT JOIN "MovieTheaterClusters" AS mvtc ON "mvtc"."id"="mvt"."MovieTheaterClusterId" GROUP BY "mvtc"."id","mvtc"."Name" ORDER BY doanhthu DESC',
                {   replacements: [start,end,start,end],
                    type: db.QueryTypes.SELECT 
                });
    return total;
 }

 Booking.getRevenueByMovie = async function(start,end)
 {
    const total = await db.query('SELECT "mv"."Name" AS namemovie, CASE WHEN SUM("bk"."PriceTotal") is NULL THEN 0 ELSE SUM(CASE WHEN "bk"."Date">=? AND "bk"."Date"<=? THEN "bk"."PriceTotal" ELSE 0 END) END AS doanhthu, CASE WHEN COUNT("tk"."ID") is NULL THEN 0 ELSE COUNT(CASE WHEN "bk"."Date">=? AND "bk"."Date"<=? THEN 1 ELSE NULL END) END AS numtickets FROM "Bookings" AS bk JOIN "Tickets" AS tk ON "tk"."BookingID"="bk"."ID" JOIN "Showtimes" AS st ON "bk"."ShowtimeId"="st"."id" RIGHT JOIN "Movies" AS mv ON "st"."MovieId"="mv"."id" GROUP BY "mv"."id","mv"."Name" ORDER BY doanhthu DESC',
    {   replacements: [start,end,start,end],
        type: db.QueryTypes.SELECT 
    });
    return total;
 }
 
module.exports=Booking;