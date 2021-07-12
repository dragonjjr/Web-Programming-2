const { DataTypes } = require('sequelize');
const db=require('./database');

const MovieTheaterCluster = db.define('MovieTheaterCluster', {
    // Model attributes are defined here
    Name: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
  },{
       // Other model options go here
});


MovieTheaterCluster.getAll = async function()
{
    return await MovieTheaterCluster.findAll();
}

module.exports=MovieTheaterCluster;