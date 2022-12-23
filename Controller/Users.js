const express = require("express");
const router = express.Router();
const User = require('../Model/User')
const Booking = require('../Model/Booking')
const jwt= require("jsonwebtoken");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const process = require('../nodemon.json')

const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
         callback(err);                 
      }
      else {
          callback(null, html);
      }
  });
};

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'dentistimo.dit356@gmail.com',
    pass: 'mvlorickmpwwjgtm'
  },
});


// This method checks the email address entered by the user and finds the user with that specific email address
// then if it finds that email address it checks the User's password
// If the passwrod entered by the user is the same as the stored password related to that emailaddres in the database
// user's authentication is successful, otherwise it is failed.
// The method also creates a token based on the emailAddress and user id and with the help of JsonWebToken library.
// The token expiration date is detemrined as one hour.
// All the unknown errors are handeled to prevent the backend from crashing.

router.post('/api/login', (req,res,next) =>{
  console.log('here backend')
  console.log(process.env.JWT_KEY)
  console.log(req.body)
    User.findOne({emailAddress: req.body.email})
    .exec() 
    .then(user =>{
      if(!user) {
        console.log('here again')
        return res.status(404).json({ message: 'User not found!'})
      } else {
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
  }
})
    .catch(err =>{
        console.log(err);
        return res.status(500)
    })
    
});

// This method creates a new user with the infromation sent by the user in the request body.
// It gets a passwrod from the user and uses the bcrypt library to hash the password.
// If the password is hased successfuly the new user is created and saved.
// All the errors are handeled to preven the backend from crashing.
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

 router.get('/api/users/:id', function(req, res, next) {
  var id = req.params.id;
  User.findById(id)
  .populate("bookings")
  .exec(function (err, user) {
      if (err) { return res.status(500).send(err); }
      if (user === null) {
          return res.status(404).json({'message': 'Staff not found!'});
      }
      return res.status(200).json({user: user});
  });
});

// This method retrieves all the bookings that has been made by a specific user.
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
  
  // This method creates an neww booking for a specific user. It first finds the use with a specific id 
  // and then save the new booking for that user.
  router.post("/api/users/:id/bookings", function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        return res.status(500);
      }
      if (user == null) {
        return res.status(404).json({ message: "User not found" });
      }

      Booking.findOne({time: req.body.time, clinicName: req.body.clinicName, dentistId: req.body.dentistId, date: req.body.date}).exec(function (err, booking1) {
        if (err) {
          return res.status(500);
        }
        if (booking1 === null) {
          var booking = new Booking(req.body);
      booking.save(function (err) {
        if (err) {
          return res.status(500);
        }
        console.log("Booking Created.");
      });
      user.bookings.push(booking);
      user.save();
      console.log("Booking added to ");

      readHTMLFile('./index.html', function(err, html) {
        if (err) {
           console.log('error reading file', err);
           return;
        }
        var template = handlebars.compile(html);
        var replacements = {
             name: user.firstName +' '+ user.lastName,
             office: booking.clinicName,
             time: booking.time,
             date: booking.date,
             dentist: booking.dentistId
        };
        console.log(replacements, user.emailAddress)
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'Dentistimo <noreply.dentistimo@gmail.com>',
            to : user.emailAddress,
            subject : 'Booking',
            html : htmlToSend
         };
         transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
            console.log("The email has been sent!")
        });
    });
/*
      transporter.sendMail({
        from: 'Dentistimo <noreply.dentistimo@gmail.com>', // sender address
        to: user.emailAddress, // list of receivers
        replyTo: 'noreply.dentistimo@gmail.com',
        subject: "Booking", // Subject line
        text: "Your slot is booked.", // plain text body
        //html: {path: '/Users/aminmahmoudi/Downloads/1670851371520-ObLrqbeWAccVE5DF/index.html'}
        html: "<b>Hello world?</b>", // html body
      }, (error) => {
          if(error) {
              console.log(error)
          } else {
              console.log('email sent!')
          }
      });
*/
      return res.status(201).json(user);
          
        } else if(booking !== null) {
          console.log('here you go:', booking)
          return res.status(400).json({ message: "Slot already booked" });
        }

      })
    });
  });

  router.patch('/api/users/:id', function(req, res,next) { 
    User.findOne({ _id: req.params.id }).exec(function (err, user) {
        if (err) {
          console.log("It's me")
           return res.status(500).send(err); }
        if (user === null) {
        return res.status(404).json({"message": "User not found"});
        }
        var hashCode = user.password
        if(req.body.password) {
          bcrypt.hash(req.body.password, 10, (err,hash) =>{
            if(err){
                return re.status(500);
            } else {
              hashCode = hash
            }
          })
        }
        user.firstName = (req.body.firstName || user.firstName);
        user.lastName = (req.body.lastName || user.lastName);
        user.emailAddress = (req.body.emailAddress || user.emailAddress);
        user.password = (hashCode || user.password)
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
 