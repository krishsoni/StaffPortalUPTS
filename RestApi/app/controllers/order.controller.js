const Order = require('../models/order.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.Tableno) {
    return res.status(400).send({
        message: "Table Number Cannot be empty"
    });
}


// Create  Shiftdata
const order = new Order({
    Tableno: req.body.Tableno,
    PhoneNumber : req.body.PhoneNumber,
    Createdby : req.body.Createdby,
    Attribute1 : req.body.Attribute1
});

// Save Shiftdata in the database
order.save()
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
    Order.find()
    .then(order => {
        res.send(order);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Order."
        });
    });
};

// Find a single User with a UserId
exports.findbyTableandPhoneNum = (req, res) => {
    var query = { "Tableno": req.params.tableno,"PhoneNumber":req.params.phno, "Attribute1": "New" };
    console.log(query);
    Order.find(query)
    .then(order => {
        console.log('came here '+order);
        if(!order) {
            return res.status(404).send({
                message: "Order not found with Table no " + req.params.tableno
            });            
        }
        res.send(order);
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



// Find a single User with a UserId
exports.findOne = (req, res) => {
    Order.findById(req.params.id)
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });            
        }
        res.send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.id
        });
    });
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
Order.findByIdAndUpdate(req.params.id, {
    Attribute1: "Completed"
}, {new: true})
.then(order => {
    if(!order) {
        return res.status(404).send({
            message: "Note not found with id " + req.params.id
        });
    }
    res.send(order);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Order not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating Order with id " + req.params.id
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

exports.getOrderDetails = (req, res) => {


    Order.aggregate([
        { $lookup:
            {
                from: 'orderitems',
                localField: '_id',
                foreignField: 'OrderNo',
                as: 'Items'
              }
         }
        ], function(err, results) {
            console.log(results);
            res.send(results);
        });


};

exports.getOrderDetailsByStatus = (req, res) => {


    Order.aggregate([
        { $lookup:
            {
                from: 'orderitems',
                localField: '_id',
                foreignField: 'OrderNo',
                as: 'Items'
              }
         },
         { $match: {'Attribute1': req.params.status }  }
        ], function(err, results) {
            console.log(results);
            res.send(results);
        });


};

exports.getOrderByTable = (req, res) => {
    Order.aggregate([
        { $lookup:
            {
                from: 'orderitems',
                localField: '_id',
                foreignField: 'OrderNo',
                as: 'Items'
              }
         },
        //  {
        //     $match:{
        //        'Tableno': req.params.tableno

        //     }

        //    }
        
           { $match: { $and: [ { 'Tableno': req.params.tableno }, { 'Attribute1': "New" } ] } }
        ], function(err, results) {
            console.log(results);
            console.log(new Date());
            res.send(results);
        });
}