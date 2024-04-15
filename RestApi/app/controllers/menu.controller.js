const Menu = require('../models/menu.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.Name) {
    return res.status(400).send({
        message: "Name Cannot be empty"
    });
}


// Create  Shiftdata
const menu = new Menu({
    Name: req.body.Name,
    Type: req.body.Type,
    Description : req.body.Description,
    Price : req.body.Price,
    Category : req.body.Category
});

// Save Shiftdata in the database
menu.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Menu Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Menu.find()
    .then(menu => {
        res.send(menu);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Menu."
        });
    });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {

};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {

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

exports.getVegCategories = (req, res) => {
    // Menu.collection.distinct("Category", function(error, results){
    //     console.log(results);
    //     res.send(results);
    //   });

    Menu.aggregate([
        {'$match' : {"Type" : "Veg"}},
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

exports.getMenuItems = (req,res) => {
    Menu.collection.distinct("Name", function(error, results){
           console.log(results);
           res.send(results);
    });
};