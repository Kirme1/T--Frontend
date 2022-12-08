const express = require("express");
const router = express.Router();
const User = require('../Model/User')
const Booking = require('../Model/Booking')
const jwt= require("jsonwebtoken");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')



router.post('/api/login', (req,res,next) =>{
    User.findOne({emailAddress: req.body.emailAddress})
    .exec() 
    .then(user =>{
     if(user.length < 1){
        return res.status(401).json({
            message: 'Authentication failed'
        });
     }
     bcrypt.compare(req.body.password, user.password, (err, result)=>{
     if(err){
        return res.status(401).json({
            message: 'Authentication failed'
        });
     }
     if (result){
        const token =jwt.sign({
            emailAddress: user.emailAddress,
            _id: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h"
        });
        console.log(token)
        return res.status(200).json({
            message: 'Authentication succussful',
            token: token
        });
    }
    return res.status(401).json({
        message:'Authentication failed'
    });
    })
})
    .catch(err =>{
        console.log(err);
        return res.status(500)
    })
    
});

router.post('/api/users', function(req, res, next){
    var password = req.body.password;
     bcrypt.hash(password, 10, (err,hash) =>{
         if(err){
             return re.status(500);
         }
      else {
       var user = new User({
         _id: new mongoose.Types.ObjectId,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         emailAddress: req.body.emailAddress,
         password: hash
       });
       user.save()
       .then(result => {
         console.log(result);
       return res.status(201).json(result)
         
       })
       .catch(err => {
        console.log(err);
        return res.status(500).json({
         error: err
        });
       })
     }
     });
    
 });

 router.get('/api/users/:id/bookings', function(req, res, next){
    User.findOne({_id: req.params.id})
    .populate('bookings').exec(function(err, user) {
        if(err){ return res.status(500).send(err);}
        if(user == null){
            return res.status(404).json({'message': ' User not found'});
        }
       console.log(user.bookings);
       return res.status(200).json({bookings: user.bookings});
    });
  });
  
  router.post("/api/users/:id/bookings", function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        return res.status(500);
      }
      if (user == null) {
        return res.status(404).json({ message: "User not found" });
      }
      var booking = new Booking(req.body);
      booking.save(function (err) {
        if (err) {
          return res.status(500);
        }
        console.log("Booking created.");
      });
      user.bookings.push(booking);
      user.save();
      console.log("Booking added to ");
      return res.status(201).json(user);
    });
  });

  router.patch('/api/user/:id', function(req, res,next) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) { return res.status(500).send(err); }
        if (user == null) {
        return res.status(404).json({"message": "User not found"});
        }
        user.firstName = (req.body.firstName || user.firstName);
        user.lastName = (req.body.lastName || user.lastName);
        user.emailAddress = (req.body.emailAddress || user.emailAddress);
        user.password = (req.body.password || user.password)
        user.bookings = (req.body.bookings || user.bookings)
        user.save()
        .then(result => {
          console.log(result);
        return res.status(201).json(result)
        })
        .catch(err => {
         console.log(err);
         return res.status(500).json({
          error: err
         });
        })
    });
});

 module.exports = router
 