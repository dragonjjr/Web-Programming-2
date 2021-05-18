const { DataTypes } = require('sequelize');
const db=require('./database');
const Booking=require('./booking');

const Ticket = db.define('Ticket', {
    // Model attributes are defined here
    ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },  
    IdSeat: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    IndexRow: {
        type: DataTypes.STRING,
        allowNull: true,
    } ,
    IndexColumn: {
        type: DataTypes.STRING,
        allowNull: true,
    } ,
    Price:{
        type: DataTypes.DOUBLE,
        allowNull: true,
    },  
  },{
       // Other model options go here
  });


Ticket.belongsTo(Booking);
Booking.hasMany(Ticket);

module.exports=Ticket;