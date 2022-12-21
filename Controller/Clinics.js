const express = require("express");
const router = express.Router();
const Clinic = require('../Model/Clinic')

// This method posts a new clinic based on the information in request body and then saves the created clinic.
router.post('/api/clinics', function(req, res) {
    console.log(req.body)
    let clinic = new Clinic(req.body);
     console.log(clinic)
    clinic.save(function (err) {
      if (err) {
        return res.status(500).send(err);
      }
       res.status(201).json(clinic);
    })
  })

  // This method retrieves all the clinics that have been created.
router.get('/api/clinics', function (req, res)  {
    Clinic.find(function (err, clinics) {
        if(err) {
            return res.status(500).send(err);
        }
        res.status(200).json({dentists: clinics });
    });
})

module.exports = router
