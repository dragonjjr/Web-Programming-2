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

module.exports=Booking;