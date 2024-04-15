const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

const Project = mongoose.Schema({
    state: String,	
    city:String,		
    projectNumber: { type: Number, unique: true, required: true },	
    projectName:String,		
    floor:String,		
    pour:String,		
    workType:String,
    remarks:String,
    supervisor:String,
    status:String		
    }, {
        timestamps: true
    });
autoIncrement.initialize(mongoose.connection); 
Project.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});
Project.index({ projectNumber: 1 }, { unique: true });
module.exports = mongoose.model('Project', Project);