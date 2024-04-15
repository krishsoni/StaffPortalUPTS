module.exports = (app) => {
    const auditTrailController = require('../controllers/auditTrail.controller.js');

    // Create a new balance
    app.get('/auditTrail/updates/:collectionName', auditTrailController.getAuditTrailUpdates);

    
}