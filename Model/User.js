const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    SSN: { type: String },
    firstName: { type: String },
    lastName: {type: String},
    emailAddress: { type: String },
    password: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model('user', userSchema);