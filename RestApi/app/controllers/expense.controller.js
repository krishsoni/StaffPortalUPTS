const Expense = require('../models/expense.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.projectNumber) {
    return res.status(400).send({
        message: "Project Number  Cannot be empty"
    });
}


// Create  Shiftdata
const expense = new Expense({
    projectNumber:req.body.projectNumber,		
    empId:req.body.empId,
    expenseType:req.body.expenseType,
    amount:req.body.amount,
    noofWorkers:req.body.noofWorkers,
    pour: req.body.pour,
    floor :req.body.floor,
    worktype: req.body.worktype,
    remarks:req.body.remarks
});

// Save Shiftdata in the database
expense.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Expense Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Expense.find()
    .then(expense => {
        res.send(expense);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Expense."
        });
    });
};


// Find a single User with a UserId
exports.findOne = (req, res) => {
    Expense.findById(req.params.id)
    .then(expense => {
        if(!expense) {
            return res.status(404).send({
                message: "Expense not found with id " + req.params.id
            });            
        }
        res.send(expense);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Expense not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving expense with id " + req.params.id
        });
    });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
     // Validate Request
 if(!req.body._id) {
    return res.status(400).send({
        message: "employee id can not be empty"
    });
}};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};

exports.getExpenseByEmpId = (req, res)=>{
   console.log('came here--->');
   
   Expense.find(
        {
            "empId" : parseInt(req.params.id)
        }, 
        {
            "projectNumber" : "$projectNumber",
            "empId" : "$empId",
            "expenseType" : "$expenseType",
            "amount" : "$amount",
            "remarks" : "$remarks",
            "createdAt" : "$createdAt"
        }
    , function(err, results) {
        console.log(results);
         res.send(results);
     });
};

exports.getExpenseView = (req,res) =>{
    console.log('came here--->',req);
        Expense.aggregate([
            {
              $lookup: {
                from: "employees",
                localField: "empId",
                foreignField: "_id",
                as: "employee"
              }
            },
            {
              $unwind: "$employee"
            },
            {
                $project: {
                  _id: 0, // Exclude _id field
                  expenseId: "$_id",
                  amount: 1, // Include fields from expenses collection
                  createdAt: 1,
                  employeeId: "$employee._id",
                  empId: "$employee.firstname", // Include fields from employees collection
                  projectNumber: 1,
                  expenseType :1,
                  floor: 1,
                  pour: 1,
                  noofWorkers: 1,
                  worktype: 1,
                  remarks: 1
    
                }
              }
          ], function(err, results) {
            console.log(results);
             res.send(results);
         });
    };