const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookingSchema = new Schema(
    {
        day: { type: String, required: true},
        time: { type: String, required: true },
        description: { type: String },
        clinic: { type: Schema.Types.String, ref: 'clinics', required: true }
    }
);

module.exports = mongoose.model('bookings', bookingSchema);