// auditTrailMiddleware.js

const AuditTrailModel = require('../models/auditTrail.model');
const mongoose = require('mongoose');

function auditTrailMiddleware(schema) {
    let oldValues;
    let newValues;
    
    schema.pre('findOneAndUpdate', async function(next) {
        const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    console.log('Old values:', doc.toObject());
    oldValues = doc.toObject();
  }
});
schema.post('findOneAndUpdate', async function(doc) {
    console.log('New values:', doc.toObject());
    newValues = doc.toObject();

    const action = doc.isNew ? 'create' : 'update'; // Determine the action (create or update)
    const oldValue = oldValues; // Get the old value (undefined for new documents)
      const newValue = doc.toObject(); // Get the new value
      const user = getCurrentUser(); // Get the current user
     const collectionName = doc.constructor.collection.name; // Get the name of the collection

 const auditTrailEntry = new AuditTrailModel({
     documentId: mongoose.Types.ObjectId(),
     collectionName,
     action,
     oldValue,
     newValue,
     user
 });
 auditTrailEntry.save();
  });
}
function getCurrentUser() {
    // Example: Retrieve user information from the request object in an Express.js application
    // This assumes that you're using Passport.js for authentication and the user information
    // is stored in req.user after successful authentication.
   
        return 'anonymous'; // Return a default value if user is not authenticated
  
}


module.exports = auditTrailMiddleware;
