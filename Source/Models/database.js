const { Sequelize } = require('sequelize');
module.exports = new Sequelize(process.env.DATABASE_URL||'postgres://postgres:mailonga1vipboy@localhost:5432/cinema',{
  //   dialect: 'postgres',
  //   dialectOptions: {
  //   ssl: {
  //     rejectUnauthorized: false, // very important
  //   }
  // }
});