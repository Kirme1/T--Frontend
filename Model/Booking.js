const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Here the Booking schema with all its attributes is defined:
var bookingSchema = new Schema(
    {
        userId: { type: Number, required: true},
        requestId: { type: Number, required: true },
        dentistId: { type: Number, required: true },
        issuance: { type: Number, required: true},
        date: { type: Date, required: true}
    }
);

module.exports = mongoose.model('bookings', bookingSchema);