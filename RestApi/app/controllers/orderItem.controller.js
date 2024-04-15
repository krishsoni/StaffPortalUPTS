const OrderItem = require('../models/orderItem.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.OrderNo) {
    return res.status(400).send({
        message: "Order Number Cannot be empty"
    });
}


// Create  Shiftdata
const orderItem = new OrderItem({
    OrderNo: req.body.OrderNo,
    Name: req.body.Name,
  Qty: req.body.Qty,
  Perference: req.body.Perference,
  Attribute1 : req.body.Attribute1,
  Attribute2 : req.body.Attribute2
});

// Save Shiftdata in the database
orderItem.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Order Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    OrderItem.find()
    .then(orderItem => {
        res.send(orderItem);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Order."
        });
    });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {

};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
         // Validate Request
 if(!req.body._id) {
    return res.status(400).send({
        message: "Order id can not be empty"
    });
}

// Find note and update it with the request body
OrderItem.findByIdAndUpdate(req.params.id, {
    Attribute3: "Served"
}, {new: true})
.then(orderItem => {
    if(!orderItem) {
        return res.status(404).send({
            message: "Order Item not found with id " + req.params.id
        });
    }
    res.send(orderItem);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Order Item not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating Order Item with id " + req.params.id
    });
});


};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};

// Get Distinct Categories
exports.getbyCategories = (req, res) => {
    // Menu.collection.distinct("Category", function(error, results){
    //     console.log(results);
    //     res.send(results);
    //   });

    Menu.aggregate([
        { '$group': { 
            '_id': '$Category', 
            'total': { '$sum': 1 }, 
            'docs': { '$push': '$$ROOT' }
        } },
        { '$sort': { 'total': -1 } },
        { '$group': {
            '_id': null,
            'data': {
                '$push': {
                    'name': '$_id',
                    'products': '$docs'
                }
            }
        } },
        { '$replaceRoot': {
            'newRoot': { 'Result': '$data' }
        } }    
    ], function(err, results) {
        console.log(results);
        res.send(results);
    });


};