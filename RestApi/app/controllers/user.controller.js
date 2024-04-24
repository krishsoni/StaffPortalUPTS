const User = require('../models/user.model.js');
const  genToken  = require('../auth/auth.js');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if(!req.body.username) {
    return res.status(400).send({
        message: "Username can not be empty"
    });
}


// Create a user
const user = new User({
    firstname: req.body.firstname, 
    lastname: req.body.lastname,
    username : req.body.username,
    mobilenumber: req.body.mobilenumber,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    postalcode: req.body.postalcode,
    password: req.body.password,
    isadmin : req.body.isadmin,
    empId : req.body.empId,
    passwordChange: false
});

// Save User in the database
user.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
    });
});
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    User.find()
    .then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not  found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with id " + req.params.id
        });
    });
};

exports.getuserbyUserName = (req,res) => {

    User.find({"username": req.body.username, "password": req.body.password})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Invalid Username" + req.body.username
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Invalid Username" + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with Username " + req.params.username
        });
    });
};

exports.getuserbyName = (req,res) => {

    User.find({"username": req.body.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Invalid Username" + req.body.username
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Invalid Username" + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Error retrieving User with Username " + req.params.username
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            message: "user id can not be empty"
        });
    }  
    // Find note and update it with the request body
    User.findByIdAndUpdate(new ObjectId(req.params.id), {
        password: req.body.password,
        passwordChange: req.body.passwordChange
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });
        }
        res.send(user);
    }).catch(err => {
        console.log(err);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "user not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.id
        });
    });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};


exports.createToken = (req, res) =>
{  
    const user = new User({
        username: req.body.username});
  
   return  res.status(200).send(genToken.generateToken(user));

};

exports.verifyToken = (req,res)=>
{
    

    return res.status(200).send(genToken.verifyToken(req.body.token)) ;
};