const express = require("express");
const router = express.Router();
const timeSlot = require('../Model/TimeSlot')

router.post("api/TimeSlots", (req, res) => {
  let slot = new timeSlot(req.body);
  slot.save(function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).json(slot);
  })
})

router.get("api/TimeSlots", (req, res) => {
    timeSlot.find(function (err, timeSlot) {
        if(err) {
            return res.status(500).send(err);
        }
        if(timeSlot !== null) {
            res.status(200)
        }
    });
})

router.delete("api/TimeSlots", (req, res) => {
    timeSlot.deleteMany(function (err, timeSlot) {
        if(err) {
          return res.status(500).send(err);
        }
        res.status(200);a
      });
})

module.exports = router