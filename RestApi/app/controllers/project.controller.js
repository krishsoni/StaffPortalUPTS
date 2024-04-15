const Project = require('../models/project.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.projectNumber) {
    return res.status(400).send({
        message: "Project Number Cannot be empty"
    });
}


// Create  Shiftdata
const project = new Project({
    state: req.body.state,	
    city:req.body.city,		
    projectNumber: req.body.projectNumber,	
    projectName: req.body.projectName,		
    floor:req.body.floor,		
    pour:req.body.pour,		
    workType:req.body.workType,
    remarks:req.body.remarks,
    supervisor:req.body.supervisor,
    status:req.body.status
});

// Save Shiftdata in the database
project.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Project Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Project.find()
    .then(project => {
        res.send(project);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Project."
        });
    });
};




// Find a single User with a UserId
exports.findOne = (req, res) => {
    Project.findById(req.params.id)
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: "Project not found with id " + req.params.id
            });            
        }
        res.send(project);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Project not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Project with id " + req.params.id
        });
    });
};

exports.getbyprojectName = (req, res) => {
    Project.find({"projectName": req.body.projectName})
    .then(project => {
        if(!project) {
            return res.status(404).send({
                message: "Project not found with Name " + req.params.projectName
            });            
        }
        res.send(project);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Project not found with Name " + req.params.projectName
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Project with Name " + req.params.projectName
        });
    });
};


// Update a User identified by the UserId in the request
exports.update = (req, res) => {
     // Validate Request
 if(!req.params.id) {
    return res.status(400).send({
        message: "Project id can not be empty"
    });
}

// Find note and update it with the request body
Project.findByIdAndUpdate(req.params.id, {
    state: req.body.state,	
    city:req.body.city,		
    projectNumber: req.body.projectNumber,	
    projectName: req.body.projectName,		
    floor:req.body.floor,		
    pour:req.body.pour,		
    workType:req.body.workType,
    remarks:req.body.remarks,
    supervisor:req.body.supervisor,
    status:req.body.status
}, {new: true})
.then(project => {
    if(!project) {
        return res.status(404).send({
            message: "Project not found with id " + req.params.id
        });
    }
    res.send(project);
}).catch(err => {
    if(err.kind === 'ObjectId') {
        return res.status(404).send({
            message: "Project not found with id " + req.params.id
        });                
    }
    return res.status(500).send({
        message: "Error updating Project with id " + req.params.id
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

