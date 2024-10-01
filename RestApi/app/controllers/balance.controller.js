const Balance = require('../models/balance.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.empId) {
    return res.status(400).send({
        message: "Employee Id Cannot be empty"
    });
}


// Create  Shiftdata
const balance = new Balance({		
    empId:req.body.empId,
    amount: req.body.amount,
    operation:req.body.operation
});

// Save Shiftdata in the database
balance.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Balance Entry."
    });
});
};

// Retrieve and return all Shiftdata from the database.
exports.findAll = (req, res) => {
    Balance.find()
    .then(balance => {
        res.send(balance);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving balance."
        });
    });
};


// Find a single User with a UserId
exports.findOne = (req, res) => {
    Balance.findById(req.params.id)
    .then(balance => {
        if(!balance) {
            return res.status(404).send({
                message: "balance not found with id " + req.params.id
            });            
        }
        res.send(balance);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "balance not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving balance with id " + req.params.id
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
}

// Find note and update it with the request body
Balance.findByIdAndUpdate(req.params.id, {empId:req.body.empId,
  amount:req.body.amount,
  operation:req.body.operation
}, {new: true})
.then(balance => {
  if(!balance) {
      return res.status(404).send({
          message: "Balance not found with id " + req.params.id
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


exports.getBalancebyEmpId=(req, res) => {
    console.log('Id is -->'+req.params.id);

  
Balance.aggregate([
    {
      $match: { empId: parseInt(req.params.id), operation: { $in: ["D", "C"] } }
    },
    {
      $group: {
        _id: { empid: "$empid", operation: "$operation" },
        totalAmount: { $sum: "$amount" }
      }
    },
    {
      $group: {
        _id: "$_id.empid",
        debitTotal: {
          $sum: {
            $cond: [{ $eq: ["$_id.operation", "D"] }, "$totalAmount", 0]
          }
        },
        creditTotal: {
          $sum: {
            $cond: [{ $eq: ["$_id.operation", "C"] }, "$totalAmount", 0]
          }
        }
      }
    },
    {
      $project: {
         netAmount: { $subtract: ["$creditTotal", "$debitTotal"] }
       // netAmount : "$creditTotal"
      }
    }
  ], function(err, results) {
        console.log(results);
         res.send(results);
     });
  



};
exports.getBalanceAllEmp=(req, res) => {
  
  console.log('Came here -----1---->');
  
  Balance.aggregate([
    {
      $group: {
          _id: '$empId', // Group by empId
          totalCredit: {
              $sum: {
                  $cond: [{ $eq: ['$operation', 'C'] }, '$amount', 0],
              },
          },
          totalDebit: {
              $sum: {
                  $cond: [{ $eq: ['$operation', 'D'] }, '$amount', 0],
              },
          },
      },
  },
  {
      $project: {
          empId: '$_id', // Project empId
          totalCredit: 1, // Include totalCredit for debugging
          totalDebit: 1, // Include totalDebit for debugging
          netBalance: { $subtract: ['$totalCredit', '$totalDebit'] }, // Calculate net balance
      },
  },
  {
      $lookup: {
          from: 'employees', // Name of the Employee collection
          localField: 'empId', // Field from the Balance collection
          foreignField: '_id', // Match with the _id field in the Employee collection
          as: 'employeeDetails', // Output array field
      },
  },
  {
      $unwind: {
          path: '$employeeDetails', // Unwind to flatten the array
          preserveNullAndEmptyArrays: true, // Keep balances even if no matching employee
      },
  },
  {
      $project: {
          empId: 1,
          totalCredit: 1, // Include totalCredit in the output for debugging
          totalDebit: 1, // Include totalDebit in the output for debugging
          netBalance: 1,
          firstName: '$employeeDetails.firstname', // Use firstName from employeeDetails
      },
  },
   
  ], function(err, results) {
        console.log(results);
         res.send(results);
     });
  
  
  
  
  };