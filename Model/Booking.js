const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookingSchema = new Schema(
    {
        userId: { type: Number, required: true},
        requestId: { type: Number, required: true },
        dentistId: { type: Number, required: true },
        issuance: { type: Number, required: true},
        time: { type: String, required: true},
        clinicId: { type: Number, required: true},
        date: { type: Date, required: true}
    }
);

module.exports = mongoose.model('bookings', bookingSchema);