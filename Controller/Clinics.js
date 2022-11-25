const express = require("express");
const router = express.Router();
const Clinic = require('../Model/Clinic')


router.post('/api/clinics', function (req, res) {
    console.log(req.body)
    let clinic = new Clinic(req.body);
    clinic.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).json(clinic);
    })
  })

router.get('/api/clinics', (req, res) => {
    Clinic.find(function (err, clinics) {
        if(err) {
            return res.status(500).send(err);
        }
        res.status(200).json({dentists: clinics });
    });
})


module.exports = router
