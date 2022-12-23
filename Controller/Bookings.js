const express = require("express");
const router = express.Router();
const Booking = require('../Model/Booking')

// This method posts a new booking based on the information it gets from the user it the request body 
// and then saves the booking.
router.post("/api/bookings", function (req, res) {
  console.log(req.body)
  var booking = new Booking(req.body);
  booking.save(function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).json(booking);
  })
})

//This method delets all the bookings that has been created by using the deletMany function.
router.delete("/api/bookings", function (req, res) {
  console.log(req.body)
  Booking.deleteMany(function(err, bookings) {
    if (err) { return res.status(500).send(err); }
    return res.status(200).json({ bookings });
});
})

router.get('/api/bookings', function (req, res) {
    Booking.find(function (err, bookings) {
        if(err) {
            return res.status(500).send(err);
        }
        return res.status(200).json({ bookings: bookings});
    });
})

// This method deletes a booking with a specific id that is passed to the url as a request parameter.
router.delete('/api/bookings/:id', function(req, res) {
  var id = req.params.id
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