const { DataTypes } = require("sequelize");
const db = require("./database");
const mvThCluster = require("./movieTheaterCluster");

const MovieTheater = db.define(
  "MovieTheater",
  {
    // Model attributes are defined here
    Name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    Kind: {
      type: DataTypes.STRING, // 2D, 3D,...
      allowNull: true,
    },
    Width: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options go here
  }
);

MovieTheater.belongsTo(mvThCluster);
mvThCluster.hasMany(MovieTheater);

MovieTheater.createMovieTheater = async function (
  name,
  address,
  image,
  kind,
  width,
  height,
  movietheaterclusterId
) {
  await MovieTheater.create({
    Name: name,
    Address: address,
    Image: image,
    Kind: kind,
    Width: width,
    Height: height,
    MovieTheaterClusterId: movietheaterclusterId,
  });
};
MovieTheater.getAll = async function () {
  return await MovieTheater.findAll();
};
MovieTheater.findById = async function (id) {
  return await MovieTheater.findByPk(id);
};

MovieTheater.getByLocationId = async function (locationId) {
  const cinemas = await db.query(
    'SELECT * FROM "MovieTheaters" WHERE "MovieTheaterClusterId" = ?',
    {
      replacements: [locationId], //mảng danh sách tham số
      type: db.QueryTypes.SELECT,
    }
  );
  return cinemas;
};

MovieTheater.getListMovieTheater = async function (
  movietheaterId,
  pageIndex,
  pageSize
) {
  const offset = (pageIndex - 1) * pageSize;
  const movies = await db.query(
    'SELECT * FROM "MovieTheaters" WHERE "MovieTheaterClusterId" = ? OFFSET ? LIMIT ?',
    {
      replacements: [movietheaterId, offset, pageSize], //mảng danh sách tham số
      type: db.QueryTypes.SELECT,
    }
  );
  return movies;
};
MovieTheater.deleteById = async function (id) {
  await MovieTheater.destroy({
    where: {
      id,
    },
  });
};

module.exports = MovieTheater;
