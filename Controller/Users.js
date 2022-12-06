const express = require("express");
const router = express.Router();
const User = require('../Model/User')
const jwt= require("jsonwebtoken");


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
         SSN: req.body.SSN,
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

 module.exports = router
 