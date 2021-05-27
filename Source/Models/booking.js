const { DataTypes } = require('sequelize');
const sequery = require('sequelize-raw-query');
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


Booking.add = async function(date,priceTotal,userId,showtimeId) {
    await Booking.create({
             Date: date,
             PriceTotal: priceTotal,
             UserId: userId,
             ShowtimeId: showtimeId
         });
 }

 Booking.getListBookingOfUser= async function(userId)
 {
    //get date, movie, movietheater, tickets
    const bookings = await db.query('SELECT "bk"."createdAt", "mv"."Name" AS "nameMovie", "mvt"."Name" AS "nameMovieTheater" FROM "Bookings" AS bk JOIN "Showtimes" AS st ON "bk"."ShowtimeId"="st"."id" JOIN "Movies" AS mv ON "mv"."id"="st"."MovieId" JOIN "MovieTheaters" AS mvt ON "mvt"."id"="st"."MovieTheaterId"',
                     { type: db.QueryTypes.SELECT });
    return bookings;
 };


module.exports=Booking;