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
    remarks:req.body.remarks,
    status:'UnApproved'
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
// Retrieve the count of submitted requests
exports.getUnApprovedRequestCount = (req, res) => {
  Expense.countDocuments({ status: 'UnApproved' })
      .then(count => {
          res.send({ count });
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while counting unapproved requests."
          });
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
Expense.findByIdAndUpdate(req.params.id, {
   status: req.body.status
}, {new: true})
.then(expense => {
    if(!expense) {
        return res.status(404).send({
            message: "Request not found with id " + req.params.id
        });
    }
    res.send(expense);
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
});};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {

};

// exports.getExpenseByEmpId = (req, res)=>{
//    console.log('came here--->');
   
//    Expense.find(
//         {
//             "empId" : parseInt(req.params.id)
//         }, 
//         {
//             "projectNumber" : "$projectNumber",
//             "empId" : "$empId",
//             "expenseType" : "$expenseType",
//             "worktype" : "$worktype",
//             "amount" : "$amount",
//             "remarks" : "$remarks",
//             "createdAt" : "$createdAt"
//         }
//     , function(err, results) {
//         console.log(results);
//          res.send(results);
//      });
// };

exports.getExpenseByEmpId = (req, res) => {
  console.log('came here--->');

  // Convert empId to an integer if necessary
  const empId = parseInt(req.params.id);

  Expense.aggregate([
    {
      $match: { empId: empId } // Match expenses with the given empId
    },
    {
      $lookup: {
        from: 'attachments',         // Attachments collection
        localField: '_id',           // Expense ID field in the Expense collection
        foreignField: 'expenseId',   // Matching field in the Attachment collection
        as: 'attachments'            // Output array field for matched attachments
      }
    },
    {
      $project: {
        projectNumber: 1,
        empId: 1,
        expenseType: 1,
        worktype: 1,
        amount: 1,
        remarks: 1,
        createdAt: 1,
        status:1,
        attachmentCount: { $size: '$attachments' } // Count attachments
      }
    }
  ])
    .exec()
    .then(results => {
      console.log(results);
      res.send(results);
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).send({ error: 'An error occurred while fetching data' });
    });
};

exports.getExpenseView = (req, res) => {
    console.log('Came into this method-->', req);
  
    Expense.aggregate([
      // Lookup for employee details
      {
        $lookup: {
          from: 'employees',
          localField: 'empId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: '$employee', // Unwind the employee array
      },
      // Lookup for attachment details
      {
        $lookup: {
          from: 'attachments',
          localField: '_id',
          foreignField: 'expenseId',
          as: 'attachments',
        },
      },
      // Project fields with attachment count
      {
        $project: {
          _id: 0, // Exclude _id field
          expenseId: '$_id',
          amount: 1,
          createdAt: 1,
          employeeId: '$employee._id',
          empName: '$employee.firstname',
          projectNumber: 1,
          expenseType: 1,
          floor: 1,
          pour: 1,
          noofWorkers: 1,
          worktype: 1,
          remarks: 1,
          status:1,
          attachmentCount: { $size: '$attachments' }, // Count attachments
        },
      },
    ])
      .exec() // Execute the aggregation pipeline
      .then((results) => {
        console.log('Results:', results);
        res.send(results);
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).json({ message: 'An error occurred', error: err });
      });
  };

    exports.getLastExpensesByEmpId = (req, res)=>{
        console.log('came here--->');
        Expense.find(
            { empId: parseInt(req.params.id) }, // Filter condition
            {
              projectNumber: 1,
              empId: 1,
              worktype:1,
              expenseType: 1,
              amount: 1,
              remarks: 1,
              createdAt: 1,
              status:1
            }
          )
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(6)                // Limit to 5 documents
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
