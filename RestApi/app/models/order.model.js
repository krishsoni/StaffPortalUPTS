const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Order = mongoose.Schema({
    Tableno: String,
    PhoneNumber : Number,
    Createdby : String,
    Attribute1 : String,
    Attribute2 : String,
    Attribute3 : String,
    Total : Number,
    CreatedAt : {type : Date, 'default': Date.now }

});
autoIncrement.initialize(mongoose.connection); 
Order.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Order', Order);