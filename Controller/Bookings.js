const express = require("express");
const router = express.Router();
const Booking = require('../Model/Booking')

router.post("api/bookings", (req, res) => {
  let booking = new Booking(req.body);
  booking.save(function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).json(booking);
  })
})

router.get("api/bookings", (req, res) => {
    Booking.find(function (err, bookings) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json({ bookings: bookings});
        res.status(200);
    });
})

module.exports = router