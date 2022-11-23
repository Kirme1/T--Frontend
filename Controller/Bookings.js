const express = require("express");
const router = express.Router();
const Booking = require('../Model/Booking')

router.post("/api/bookings", function (req, res) {
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

router.delete('/api/bookings', function(req, res) {
  var id = req.body.time;
        Booking.findOneAndDelete({_id: id}, function(err, booking) {
          if (!booking) {
            return res.status(404).json({ message: "Name was not found"});
          }
          if(err) {
            return res.status(500).send(err);
          }
          res.status(200).json(booking);
    })
})

module.exports = router