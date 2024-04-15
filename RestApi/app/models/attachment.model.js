const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const attachment= new mongoose.Schema({
    name: String,
    data: String,
    expenseId: Number // Store attachment data in Base64 format
}, {
    timestamps: true
});
autoIncrement.initialize(mongoose.connection); 
attachment.plugin(autoIncrement.plugin, {
    model: 'Attachment',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
const Attachment = mongoose.model('Attachment', attachment);

module.exports = Attachment;