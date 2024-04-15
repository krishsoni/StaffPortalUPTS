// AuditTrailModel.js

const mongoose = require('mongoose');

// Define schema for audit trail collection
const AuditTrailSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    collectionName: { type: String, required: true },
    action: { type: String, enum: ['create', 'update', 'delete'], required: true },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    user: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create model from schema
const AuditTrailModel = mongoose.model('AuditTrail', AuditTrailSchema);

module.exports = AuditTrailModel;
