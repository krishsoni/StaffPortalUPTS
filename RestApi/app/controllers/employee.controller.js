const Employee = require('../models/employee.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.empNo) {
    console.log('Employee No'+req.body.empNo);
    return res.status(400).send({
        message: "EmpNo Cannot be empty"
    });
}

console.log('Firstname'+req.body.firstname);
// Create  Shiftdata
const employee = new Employee({
    empNo: req.body.empNo,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    mobilenumber : req.body.mobilenumber,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    postalcode: req.body.postalcode,
    createdby : req.body.createdby,
    gratuity: req.body.gratuity,
    bonus: req.body.bonus,
    username : req.body.username,
    manager : req.body.manager
});

// Save Shiftdata in the database
employee.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the employee Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Employee.find()
    .then(employee => {
        res.send(employee);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving employee."
        });
    });
};




// Find a single User with a UserId
exports.findOne = (req, res) => {
    Employee.findById(req.params.id)
    .then(employee => {
        if(!employee) {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.id
            });            
        }
        res.send(employee);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Employee not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Employee with id " + req.params.id
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
     // Validate Request
 if(!req.params.id) {
    return res.status(400).send({
        message: "employee id can not be empty"
    });
}

// Find note and update it with the request body
Employee.findByIdAndUpdate(req.params.id, {
    empNo: req.body.empNo,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    mobilenumber : req.body.mobilenumber,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    postalcode: req.body.postalcode,
    createdby : req.body.createdby,
    gratuity: req.body.gratuity,
    bonus: req.body.bonus,
    manager : req.body.manager,
}, {new: true})
.then(employee => {
    employee.save();
    if(!employee) {
        return res.status(404).send({
            message: "Employee not found with id " + req.params.id
        });
    }
    res.send(employee);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "employee not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating employee with id " + req.params.id
    });
});

};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};


exports.getemployeeDetails = (req, res) => {


    Employee.aggregate([
        { $lookup:
            {
                from: 'employeeitems',
                localField: '_id',
                foreignField: 'employeeNo',
                as: 'Items'
              }
         }
        ], function(err, results) {
            console.log(results);
            res.send(results);
        });


};

