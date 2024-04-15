const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const auditTrailMiddleware = require('../auditTrail/auditTrailMiddleware.js');

const Balance = mongoose.Schema({
    empId:Number,
    amount:Number,
    operation:String
    }, {
        timestamps: true
    });
autoIncrement.initialize(mongoose.connection); 
Balance.plugin(autoIncrement.plugin, {
    model: 'Balance',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
Balance.plugin(auditTrailMiddleware);
module.exports = mongoose.model('Balance', Balance);