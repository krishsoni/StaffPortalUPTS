const mongoose = require('mongoose');

const OrderItem = mongoose.Schema({
    id: Number,
  OrderNo:Number,
  Name: String,
  Qty: Number,
  Perference: String,
    Attribute1: String,
    Attribute2:String,
    Attribute3:String

});

module.exports = mongoose.model('OrderItem', OrderItem);