const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var clinicSchema = new Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true},
        owner: { type: String, required: true},
        dentists: { type: Number, required: true },
        address: { type: String, required: true},
        city: { type: String, required: true},
        coordinate: { type: Array },
        openinghours: { type: Array }
    },
    {
        minimize: false,
        versionKey: false
      }
);

module.exports = mongoose.model('clinics', clinicSchema);