const { DataTypes } = require('sequelize');
const db=require('./database');

const Movie = db.define('Movie', {
    // Model attributes are defined here
    Name: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    ReleaseDate:{
        type: DataTypes.DATE,
        allowNull: true,
    },  
    PosterImage:{
        type: DataTypes.BLOB,
        allowNull: true,
    },  
    Time:{
        type: DataTypes.STRING,
        allowNull: true,
    },  
  },{
       // Other model options go here
  });

module.exports=Movie;