const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: { type: String },
    lastName: {type: String},
    emailAddress: { type: String },
    password: {
        type: String,
        required: true
      },
      bookings: [{
        type: Schema.Types.ObjectId,
        ref: "Booking"
     }]
});

module.exports = mongoose.model('user', userSchema);