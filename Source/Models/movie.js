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

Movie.findById= async function(id)
{
    return await Movie.findByPk(id);
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
    const movies = await db.query('SELECT "mv"."id", COUNT(*) AS "SumTicket" FROM "Movies" AS mv JOIN "Showtimes" AS st ON "mv"."id"="st"."MovieId" JOIN "Bookings" AS bk ON "st"."id"="bk"."ShowtimeId" JOIN "Tickets" AS tk ON "tk"."BookingID"="bk"."ID" GROUP BY "mv"."id", "mv"."Name", "mv"."ReleaseDate", "mv"."PosterImage", "mv"."Time", "mv"."Trailer" ORDER BY "SumTicket" DESC LIMIT ?',
                        { 
                            replacements: [top],
                            type: db.QueryTypes.SELECT 
                        });
    return movies;
};

Movie.getNameMovieOfMovieTheater = async function()
{
    const nameMovie = db.query('SELECT DISTINCT "mv"."Name" , "st"."MovieTheaterId","mv"."id" FROM "Showtimes" AS "st" JOIN "MovieTheaters" AS "mt" ON "st"."MovieTheaterId" = "mt"."id" JOIN "Movies" AS "mv" ON "mv"."id" = "st"."MovieId" GROUP BY "st"."MovieTheaterId", "mv"."Name","mv"."id"',
                                { type: db.QueryTypes.SELECT });
    return nameMovie;
}


module.exports=Movie;