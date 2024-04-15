const Tables = require('../models/tables.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.tableno) {
    return res.status(400).send({
        message: "Table Number Cannot be empty"
    });
}


// Create  Shiftdata
const tables = new Tables({
    tableno: req.body.tableno,
    capacity: req.body.capacity,
    active : req.body.active,
    currentUser: req.body.currentUser
});

// Save Shiftdata in the database
tables.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Table Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Tables.find()
    .then(TableData => {
        res.send(TableData);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving ShiftData."
        });
    });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {

};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
  console.log('Came inside Update-->');
 // Validate Request
 if(!req.body._id) {
    return res.status(400).send({
        message: "Order content can not be empty"
    });
}

// Find note and update it with the request body
Tables.findByIdAndUpdate(req.params.id, {
    active: req.body.active,currentUser : req.body.currentUser
}, {new: true})
.then(tables => {
    if(!tables) {
        return res.status(404).send({
            message: "Table not found with id " + req.params.id
        });
    }
    res.send(tables);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Table not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating Table with id " + req.params.id
    });
});
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};
// Find a single User with a UserId
exports.findbyTableNum = (req, res) => {
    var query = {"tableno": req.params.tableno};
    console.log("query --->"+query.toString());
    Tables.find(query)
    .then(tables => {
        console.log('came here '+tables);
        if(!tables) {
            return res.status(404).send({
                message: "Order not found with Table no " + req.params.tableno
            });            
        }
        res.send(tables);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Order not found with table no " + req.params.tableno
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with table no " + req.params.tableno
        });
    });
};