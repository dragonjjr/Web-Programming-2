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
    Introduce:{
        type: DataTypes.TEXT,
        allowNull: true,
    },  
    Trailer:{
        type: DataTypes.STRING, //link youtube
        allowNull: true,
    },  
  },{
       // Other model options go here
  });


Movie.createMovie = async function(name,releaseDate,poster,time,introduce,trailer) {
   await Movie.create({
            Name:name,
            ReleaseDate:releaseDate,
            PosterImage: poster,
            Time: time,
            Introduce: introduce,
            Trailer:trailer
        });
}

Movie.deleteById = async function(id) {
    await Movie.destroy({
        where: {
          id
        }
      });
 }

Movie.findById= async function(id)
{
    return await Movie.findByPk(id);
};

Movie.getAll = async function()
{
    return await Movie.findAll();
}

Movie.getCount = async function()
{
    return await db.query('SELECT COUNT(*) FROM "Movies"', 
    { 
        type: db.QueryTypes.SELECT 
    });
}

Movie.getListMovie = async function(pageIndex,pageSize)
{
    const offset=(pageIndex-1)*pageSize;
    const movies = await db.query('SELECT * FROM "Movies" ORDER BY "createdAt" OFFSET ? LIMIT ?', 
            { 
                replacements: [offset,pageSize], //mảng danh sách tham số
                type: db.QueryTypes.SELECT 
            });
    return movies;
}

Movie.getListMovieInShowtime= async function()
{
    const movies = await db.query('SELECT DISTINCT "mv"."id","mv"."Name","mv"."PosterImage","mv"."Trailer" FROM "Movies" AS mv JOIN "Showtimes" AS st ON "mv"."id"="st"."MovieId" AND "st"."BeginAt">NOW() ', 
            { 
                type: db.QueryTypes.SELECT 
            });
    return movies;
};

Movie.getListNewMovie= async function(top)
{
    const movies = await db.query('SELECT * FROM "Movies" ORDER BY "ReleaseDate" DESC LIMIT ?', 
            { 
                replacements: [top], //mảng danh sách tham số
                type: db.QueryTypes.SELECT 
            });
    return movies;
};

Movie.getListTopMovie= async function(top)
{
    //lấy danh sách các phim bán được nhiều vé nhất
    const movies = await db.query('SELECT DISTINCT "mv"."id","mv"."Name","mv","PosterImage","mv"."Trailer", COUNT(*) AS "SumTicket" FROM "Movies" AS mv JOIN "Showtimes" AS st ON "mv"."id"="st"."MovieId" JOIN "Bookings" AS bk ON "st"."id"="bk"."ShowtimeId" JOIN "Tickets" AS tk ON "tk"."BookingID"="bk"."ID" GROUP BY "mv"."id", "mv"."Name", "mv"."ReleaseDate", "mv"."PosterImage", "mv"."Time", "mv"."Trailer" ORDER BY "SumTicket" DESC LIMIT ?',
                        { 
                            replacements: [top],
                            type: db.QueryTypes.SELECT 
                        });
    return movies;
};

Movie.getNameMovieOfMovieTheater = async function(id)
{
    const nameMovie = db.query('SELECT DISTINCT "mv"."Name" , "st"."MovieTheaterId","mv"."id" FROM "Showtimes" AS "st" JOIN "MovieTheaters" AS "mt" ON "st"."MovieTheaterId" = "mt"."id" JOIN "Movies" AS "mv" ON "mv"."id" = "st"."MovieId" WHERE "st"."MovieTheaterId" = ? AND "st"."BeginAt">NOW() GROUP BY "st"."MovieTheaterId", "mv"."Name","mv"."id"',
                                { replacements: [id],
                                    type: db.QueryTypes.SELECT });
    return nameMovie;
}

module.exports=Movie;