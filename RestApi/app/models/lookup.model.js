const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Lookup = mongoose.Schema({
    lookupType:String,		
    value:String
    }, {
        timestamps: true
    });
autoIncrement.initialize(mongoose.connection); 
Lookup.plugin(autoIncrement.plugin, {
    model: 'Lookup',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Lookup', Lookup);