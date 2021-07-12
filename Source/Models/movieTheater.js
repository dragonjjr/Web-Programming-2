const { DataTypes } = require('sequelize');
const db=require('./database');
const mvThCluster=require('./movieTheaterCluster');


const MovieTheater = db.define('MovieTheater', {
    // Model attributes are defined here
    Name: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    Address:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    Image:{
        type: DataTypes.BLOB,
        allowNull: true,
    },  
    Kind:{
        type: DataTypes.STRING, // 2D, 3D,...
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

MovieTheater.getAll = async function()
{
    return await MovieTheater.findAll();
}

MovieTheater.getByLocationId = async function(locationId)
{
    const cinemas = await db.query('SELECT * FROM "MovieTheaters" WHERE "MovieTheaterClusterId" = ?', 
    { 
        replacements: [locationId], //mảng danh sách tham số
        type: db.QueryTypes.SELECT 
    });
    return cinemas;
}

MovieTheater.belongsTo(mvThCluster);
mvThCluster.hasMany(MovieTheater);


module.exports=MovieTheater;