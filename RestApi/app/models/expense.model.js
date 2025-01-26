const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Expense = mongoose.Schema({
    projectNumber:String,		
    empId:Number,
    expenseType:String,
    noofWorkers:Number,
    pour: Number,
    floor :Number,
    worktype: String,
    amount:Number,
    remarks:String,
    status: String,
    attachmentCount: Number
    }, {
        timestamps: true
    });
autoIncrement.initialize(mongoose.connection); 
Expense.plugin(autoIncrement.plugin, {
    model: 'Expense',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Expense', Expense);