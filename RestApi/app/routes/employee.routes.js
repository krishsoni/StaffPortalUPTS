    module.exports = (app) => {
    const employee = require('../controllers/employee.controller.js');
    const requireAuth  = require('../auth/authMiddleware.js');

    // Create a new employee
    app.post('/employee', employee.create);

    // Retrieve all employee
    app.get('/employee', employee.findAll);

    // Retrieve a single Note with noteId
    //app.get('/employee/:id', requireAuth, employee.findOne);

    app.get('/employee/:id', employee.findOne);

    // Update a Note with noteId
    app.put('/employee/:id', employee.update);

    // Delete a Note with noteId
    app.delete('/employee/:id', employee.delete);

    app.get('/employeeDetails',employee.getemployeeDetails);




  

}