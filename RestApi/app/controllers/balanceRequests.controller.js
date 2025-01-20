const BalanceRequest = require('../models/balanceRequests.model.js');


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if(!req.body.empId) {
    return res.status(400).send({
        message: "Employee Id can not be empty"
    });
}


// Create a user
const balanceRequest = new BalanceRequest({
    empId: req.body.empId,
    empNo: req.body.empNo,
    empName: req.body.empName,
    Amount: req.body.Amount,
    Status: 'Submitted',
});

// Save User in the database
balanceRequest.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Balance request."
    });
});
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    BalanceRequest.find()
    .then(balanceRequest => {
        res.send(balanceRequest);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Requests."
        });
    });
};
// Retrieve and return Submitted from the database.
exports.findSubmitted = (req, res) => {
    BalanceRequest.find({ Status: 'Submitted' })
    .then(balanceRequest => {
        res.send(balanceRequest);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Requests."
        });
    });
};

// Retrieve the count of submitted requests
exports.getSubmittedRequestCount = (req, res) => {
    BalanceRequest.countDocuments({ Status: 'Submitted' })
        .then(count => {
            res.send({ count });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while counting submitted requests."
            });
        });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {
    BalanceRequest.findById(req.params.id)
    .then(balanceRequest => {
        if(!balanceRequest) {
            return res.status(404).send({
                message: "Request not found with id " + req.params.id
            });            
        }
        res.send(balanceRequest);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Request not  found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Request with id " + req.params.id
        });
    });
};

exports.getRequestbyUserName = (req,res) => {

    BalanceRequest.find({"empId": req.params.empId})
    .then(balanceRequest => {
        if(!balanceRequest) {
            return res.status(404).send({
                message: "Invalid EmpId" + req.params.empId
            });            
        }
        res.send(balanceRequest);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Invalid EmpId" + req.params.empId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Request with EmpId " + req.params.empId
        });
    });
};

exports.getLastRequestByEmpId = (req, res)=>{
    console.log('came here--->');
    BalanceRequest.find(
        { empId: parseInt(req.params.empId) }, // Filter condition
        {
          empNo:1,
          empName: 1,
          Amount: 1,
          Status:1,
          createdAt: 1,
        }
      )
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(3)                // Limit to 3 documents
        .exec(function (err, results) {
          if (err) {
            console.error('Error:', err);
            res.status(500).send('An error occurred while fetching expenses.');
          } else {
            console.log('Results:', results);
            res.status(200).json(results); // Send the response
          }
        });
 };



// Update a User identified by the UserId in the request
exports.update = (req, res) => {
    if(!req.params.id) {
        return res.status(400).send({
            message: "Request id can not be empty"
        });
    }  
    // Find note and update it with the request body
    BalanceRequest.findByIdAndUpdate(req.params.id, {
       Status: req.body.Status
    }, {new: true})
    .then(balanceRequest => {
        if(!balanceRequest) {
            return res.status(404).send({
                message: "Request not found with id " + req.params.id
            });
        }
        res.send(balanceRequest);
    }).catch(err => {
        console.log(err);
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Request not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating Request with id " + req.params.id
        });
    });
};

