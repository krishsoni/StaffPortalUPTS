const mongoose = require('mongoose');

const Menu = mongoose.Schema({
    id: String,
    Name: String,
    Type: String,
    Description : String,
    Price : Number,
    Category : String,
    Attribute1 : String,
    Attribute2 : String,
    Attribute3 : String

});

module.exports = mongoose.model('Menu', Menu);