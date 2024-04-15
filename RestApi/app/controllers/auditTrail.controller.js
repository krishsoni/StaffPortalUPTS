// auditTrailController.js


const AuditTrailModel = require('../models/auditTrail.model.js');
const _ = require('lodash');
exports.getAuditTrailUpdates = async (req, res) => {
  try {
    const { collectionName } = req.params;
    const auditTrailUpdates = await AuditTrailModel.find({ 
      collectionName,
      action: 'update'
    }).select('oldValue newValue');
  //   const differencesArray = auditTrailUpdates.map(doc => {
  //     const differences = _.reduce(doc.newValue, (result, value, key) => {
  //         if (!_.isEqual(value, doc.oldValue[key])) {
  //             result[key] = { oldValue: doc.oldValue[key], newValue: value };
  //         }
  //         return result;
  //     }, {});
  //     return { id: doc.newValue._id, differences };
  // });
  //   res.json(differencesArray);
  const response = [];

  // Iterate over the audit trails
  for (const trail of auditTrailUpdates) {
      const { oldValue, newValue } = trail;

      // Iterate over fields in newValue
      for (const key in newValue) {
        const id = newValue._id || oldValue._id;
       // console.log('Came here -->',newValue[_id]);
          // Check if field value changed
           
          if (oldValue[key] !== newValue[key]) {
            const oldValue1 =  oldValue[key]!==undefined ? oldValue[key] : 0
         console.log('oldValue',oldValue1);
              response.push({
                  _id:id,
                  field: key,
                  oldValue: oldValue1,
                  newValue: newValue[key],
                  date : newValue.updatedAt
              });
          }
      }
  }

  res.json(response);


  } catch (error) {
    console.error('Error retrieving audit trail updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function findDifferences(oldDoc, newDoc) {
  const differences = {};
  for (const key in newDoc) {
    if (oldDoc[key] !== newDoc[key]) {
      if (!differences[oldDoc.id]) {
        differences[oldDoc.id] = {};
      }
      differences[oldDoc.id][key] = {
        oldValue: oldDoc[key],
        newValue: newDoc[key]
      };
    }
  }
  return differences;
}