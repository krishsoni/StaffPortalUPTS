const mongoose = require('mongoose');

const Tables = mongoose.Schema({
    id: String,
    tableno: String,
    capacity: Number,
    active : String,
    currentUser:String

});

module.exports = mongoose.model('Table', Tables);