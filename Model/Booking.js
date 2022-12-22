const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookingSchema = new Schema(
    {
        //userId: { type: Number, required: true},
        requestId: { type: String, required: true },
        dentistId: { type: Number, required: true },
        issuance: { type: String, required: true},
        date: { type: Date, required: true},
        time: {type: String, required: true},
        clinicName: { type: String, required: true}
    }
);

module.exports = mongoose.model('booking', bookingSchema);