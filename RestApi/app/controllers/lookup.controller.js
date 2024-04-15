const Lookup = require('../models/lookup.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.lookupType) {
    return res.status(400).send({
        message: "Lookup Type Cannot be empty"
    });
}


// Create  Shiftdata
const lookup = new Lookup({
   lookupType: req.body.lookupType,
   value :req.body.value
});

// Save Shiftdata in the database
lookup.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Lookup Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Lookup.find()
    .then(lookup => {
        res.send(lookup);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Lookup."
        });
    });
};


// Find a single User with a UserId
exports.findOne = (req, res) => {
    Lookup.findById(req.params.id)
    .then(lookup => {
        if(!lookup) {
            return res.status(404).send({
                message: "Lookup not found with id " + req.params.id
            });            
        }
        res.send(expense);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Lookup not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving lookup with id " + req.params.id
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
     // Validate Request
 if(!req.body._id) {
    return res.status(400).send({
        message: "Lookup Id can not be empty"
    });
}};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};


exports.getByLookupType = (req, res) =>{

  Lookup.find({
        "lookupType": req.body.lookupType
      } , {
        "_id": 0,
        "value": 1
      }, function(err, results) {
        console.log(results);
         res.send(results);
     });
};
