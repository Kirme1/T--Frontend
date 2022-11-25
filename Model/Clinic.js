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
        coordinate: [{longitude: {type: Number, required: true}},
                      {latitude: {type: Number, required: true}}
            ],
        openinghours: [{monday: {type: String}},
                        {tuesday: {type: String}},
                        {wednesday: {type: String}},
                        {thursday: {type: String}},
                        {friday: {type: String}} 
            ]
    }
);

module.exports = mongoose.model('clinics', clinicSchema);