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

MovieTheaterCluster.findById= async function(id)
{
    return await MovieTheaterCluster.findByPk(id);
};

MovieTheaterCluster.createMovieTheaterCluster = async function(name) {
    await MovieTheaterCluster.create({
             Name:name,
         });
 }

MovieTheaterCluster.getAll = async function()
{
    return await MovieTheaterCluster.findAll();
}

MovieTheaterCluster.deleteById = async function(id) {
    await MovieTheaterCluster.destroy({
        where: {
          id
        }
    });
}


MovieTheaterCluster.getByLocationId = async function(locationId)
{
    const cinemas = await db.query('SELECT * FROM "MovieTheatersCluster" WHERE "Id" = ?', 
    { 
        replacements: [locationId], //mảng danh sách tham số
        type: db.QueryTypes.SELECT 
    });
    return cinemas;
}


MovieTheaterCluster.getListMovieTheaterCluster = async function(pageIndex,pageSize)
{
    const offset=(pageIndex-1)*pageSize;
    const movies = await db.query('SELECT * FROM "MovieTheaterClusters" OFFSET ? LIMIT ?', 
            { 
                replacements: [offset,pageSize], //mảng danh sách tham số
                type: db.QueryTypes.SELECT 
            });
    return movies;
}

module.exports=MovieTheaterCluster;