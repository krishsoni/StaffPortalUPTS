const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const auditTrailMiddleware = require('../auditTrail/auditTrailMiddleware.js');

const Employee = mongoose.Schema({
    empNo:String,
    firstname: String,
    lastname: String,
    mobilenumber : Number,
    address: String,
    city: String,
    country: String,
    postalcode: String,
    createdby : String,
    gratuity: Number,
    bonus: Number,
    username : String ,
    manager : String,
    }, {
        timestamps: true
    });
autoIncrement.initialize(mongoose.connection); 
Employee.plugin(autoIncrement.plugin, {
    model: 'Employee',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

Employee.plugin(auditTrailMiddleware);
module.exports = mongoose.model('Employee', Employee);