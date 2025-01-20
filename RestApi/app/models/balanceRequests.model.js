const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const BalanceRequests = mongoose.Schema({
    empId: Number,
    empNo:String,
    empName: String,
    Amount: Number,
    Status: String,
    }, {
        timestamps: true
    });
autoIncrement.initialize(mongoose.connection); 
BalanceRequests.plugin(autoIncrement.plugin, {
    model: 'BalanceRequests',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('BalanceRequests', BalanceRequests);