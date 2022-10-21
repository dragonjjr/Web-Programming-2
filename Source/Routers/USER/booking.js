const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const uuid = require("uuid");
const Ticket = require("../../Models/ticket");
const Booking = require("../../Models/booking");
const Movie = require("../../Models/movie");
const Showtime = require("../../Models/showtime");
const Email = require("../../Models/email");
const router = express.Router();
const checkLogged = require("../../Middlewares/ensure-logged-in");
const { body, validationResult } = require("express-validator");
const sequelize = require("../../Models/database");

router.use(checkLogged);
router.use(function (req, res, next) {
  res.locals.title = "Buy ticket";
  next();
});

router.get(
  "/",
  expressAsyncHandler(async function (req, res) {
    try {
      res.locals.showtimes = null;
      res.locals.seats = null; //danh sách các ghế đã được mua

      const movieId = req.query.id;
      const movie = await Movie.findById(movieId);

      const listShowtimeOfMovie = await Showtime.getListByMovieId(movieId);

      res.locals.showtimes = listShowtimeOfMovie;

      res.render("USER/booking/buyTicket", { nameMovie: movie.Name });
    } catch {
      res.send(JSON.stringify("F"));
    }
  })
);

router.post(
  "/",
  expressAsyncHandler(async function (req, res) {
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const user = res.locals.currentUser;
      const tickets = req.body.tickets;
      const bookingInfo = req.body.bookingInfo;
      const { userId } = req.session;
      const date = new Date();
      const bookingId = uuid.v4();

      await Booking.createBooking(
        bookingId,
        date,
        bookingInfo.priceTotal,
        user.id,
        bookingInfo.showtimeId,
        transaction
      );

      // // var ticket={
      // //     iSeat: idSeat,
      // //     iRow: row,
      // //     iColumn: column,
      // //     price: priceTicket
      // //  }

      for (var item of tickets) {
        await Ticket.createTicket(
          item.iSeat,
          item.iRow,
          item.iColumn,
          item.price,
          bookingId,
          bookingInfo.showtimeId,
          transaction
        );
      }

      await transaction.commit();

      //---------------------------Send Email
      //lấy thông tin suất chiếu
      const showtime = await Showtime.getByShowtimeId(bookingInfo.showtimeId);
      const timeOg = new Date(showtime[0].BeginAt);
      const time =
        timeOg.getDate() +
        "/" +
        (timeOg.getMonth() + 1) +
        "/" +
        timeOg.getFullYear() +
        " - " +
        timeOg.getHours() +
        ":" +
        timeOg.getMinutes();

      //thông tin danh sách vé đã đặt (html)
      var htmlListTicket = "<ul>";
      const lenListTk = tickets.length;
      for (var i = 0; i < lenListTk; i++) {
        htmlListTicket +=
          "<li>ID: " +
          tickets[i].iSeat +
          ", row " +
          tickets[i].iRow +
          " seat " +
          tickets[i].iColumn +
          ", price: $" +
          tickets[i].price +
          "</li>";
      }
      htmlListTicket += "</ul>";

      //gửi
      const url = process.env.BASE_URL || "http://localhost:3000";
      const subject = "Thông tin vé đặt";
      await Email.send(
        user.Email,
        subject,
        "Booking successfull",
        `<h3>Showtime information</h3><b>Movie:</b> ${showtime[0].NameMovie}<br> <b>Begin at:</b> ${time}<br><b>Cinema:</b> ${showtime[0].NameMvt}<br> <b>Address:</b> ${showtime[0].AddressMvt} <br> <h3>Ticket information</h3> ${htmlListTicket} <b>Total: </b>$${bookingInfo.priceTotal}`
      );

      res.send(JSON.stringify("OK"));
    } catch (e) {
      console.log(e);
      if (transaction) await transaction.rollback();
      res.send(JSON.stringify("F"));
    }
  })
);

router.get(
  "/getTicketsBooked",
  expressAsyncHandler(async function (req, res) {
    try {
      const showtimeId = req.query.showtimeId;

      const tickets = await Ticket.getListTicketByShowtimeId(showtimeId);

      res.send(JSON.stringify(tickets));
    } catch {
      res.send(JSON.stringify("F"));
    }
  })
);

router.get(
  "/success",
  expressAsyncHandler(async function (req, res) {
    res.render("USER/booking/success");
  })
);
module.exports = router;
