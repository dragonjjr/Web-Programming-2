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
    const movies = await sequelize.query("SELECT TOP 5 FROM `Movies` ORDER BY ReleaseDate DESC", { type: DataTypes.SELECT });
    return movies;
};

Movie.getListTopMovie= async function()
{
    //lấy danh sách các phim (5) bán được nhiều vé nhất
    const movies = await sequelize.query("SELECT TOP 5 mv.id,COUNT(*) AS SumTicket FROM `Movies` mv JOIN `Showtimes` st ON mv.id=st.MoviedId JOIN `Bookings` bk ON st.id=bk.ShowtimeId JOIN `Tickets` tk ON tk.BookingID=bk.ID GROUP BY mv.id, mv.Name, mv.ReleaseDate, mv.PosterImage, mv.Time, mv.Trailer ORDER BY SumTicket DESC"
                        ,{ type: DataTypes.SELECT });
    return movies;
};

module.exports=Movie;