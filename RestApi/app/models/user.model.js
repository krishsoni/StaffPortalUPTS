const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    mobilenumber: String,
    address: String,
    city: String,
    country: String,
    postalcode: String,
    password: String,
    isadmin : Boolean,
    empId:Number,
    passwordChange: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);