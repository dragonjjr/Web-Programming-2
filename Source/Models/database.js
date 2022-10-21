const { Sequelize } = require("sequelize");
var sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/TestCinema",
  {
    //   dialect: 'postgres',
    //   dialectOptions: {
    //   ssl: {
    //     rejectUnauthorized: false, // very important
    //   }
    // }
  }
);
module.exports = sequelize;
