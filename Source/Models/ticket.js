const { DataTypes } = require("sequelize");
const uuid = require("uuid");
const db = require("./database");
const Booking = require("./booking");
const Showtime = require("./showtime");

const Ticket = db.define(
  "Ticket",
  {
    // Model attributes are defined here
    ID: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    IdSeat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IndexRow: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IndexColumn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    indexes: [
      {
        unique: true,
        fields: ["IndexRow", "IndexColumn", "ShowtimeId"],
      },
    ],
  }
);

Ticket.belongsTo(Booking);
Booking.hasMany(Ticket);

Ticket.belongsTo(Showtime);
Showtime.hasMany(Ticket);

Ticket.createTicket = async function (
  idSeat,
  iRow,
  iColumn,
  price,
  bookingId,
  showtimeId,
  transaction
) {
  await Ticket.create(
    {
      ID: uuid.v4(),
      IdSeat: idSeat,
      IndexRow: iRow,
      IndexColumn: iColumn,
      Price: price,
      BookingID: bookingId,
      ShowtimeId: showtimeId,
    },
    { transaction: transaction }
  );
};

Ticket.getListTicketByShowtimeId = async function (showtimeId) {
  //get tickets booked
  const tickets = await db.query(
    'SELECT * FROM "Tickets" AS tk JOIN "Bookings" AS bk ON "tk"."BookingID"="bk"."ID" WHERE "bk"."ShowtimeId"=?',
    {
      replacements: [showtimeId],
      type: db.QueryTypes.SELECT,
    }
  );
  return tickets;
};

module.exports = Ticket;
