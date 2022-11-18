const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var timeSlotSchema = new Schema(
    {
        userId: { type: Number, required: true},
        reququestId: { type: Number, required: true },
        dentistId: { type: Number, required: true },
        issuance: {type: Number, required: true},
        date: {type: String, required: true}
    }
);

module.exports = mongoose.model('timeSlots', timeSlotSchema);