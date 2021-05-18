const { DataTypes } = require('sequelize');
const db=require('./database');
const mvThCluster=require('./movieTheaterCluster');


const MovieTheater = db.define('MovieTheater', {
    // Model attributes are defined here
    Name: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    Kind:{
        type: DataTypes.STRING,
        allowNull: true,
    },  
    Width:{
        type: DataTypes.STRING,
        allowNull: true,
    },  
    Height:{
        type: DataTypes.STRING,
        allowNull: true,
    },  
  },{
       // Other model options go here
  });

MovieTheater.belongsTo(mvThCluster);
mvThCluster.hasMany(MovieTheater);


module.exports=MovieTheater;