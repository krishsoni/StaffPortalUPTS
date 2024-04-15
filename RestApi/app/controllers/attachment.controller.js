const Attachment = require('../models/attachment.model.js');

// Create and Save a new ShiftData
exports.create = (req, res) => {
  // Validate request
  if(!req.body.data) {
    return res.status(400).send({
        message: "Attachment Id Cannot be empty"
    });
}


// Create  Shiftdata
const attachment = new Attachment({		
    name:req.body.name,
    data: req.body.data,
    expenseId: req.body.expenseId
});

// Save Shiftdata in the database
attachment.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the Attachment Entry."
    });
});
};


// Find a single User with a UserId
exports.findOne = (req, res) => {
    Attachment.findById(req.params.id)
    .then(attachment => {
        if(!attachment) {
            return res.status(404).send({
                message: "Attachment not found with id " + req.params.id
            });            
        }
        res.send(attachment);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Attachment not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving attachment with id " + req.params.id
        });
    });
};

exports.getattachmentbyexpId = (req, res) => {
    Attachment.find({"expenseId": req.body.expenseId})
    .then(attachment => {
        if(!attachment) {
            return res.status(404).send({
                message: "Expense not found with Id " + req.params.expenseId
            });            
        }
        res.send(attachment);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Expense not found with Id " + req.params.expenseId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Expense with Id " + req.params.expenseId
        });
    });
};