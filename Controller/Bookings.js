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

router.get("api/bookings/book", (req, res) => {
  var id = req.data.time;
    Booking.findOne({_id: id})
    .exec(function (err, booking) {
      if(booking) {
        Booking.findOneAndDelete({_id: id}, function(err, booking2) {
          if (booking2) {
              return res.status(200);
          }
        })
      }
      else {
        return res.status(404);
      }
    })
})

module.exports = router