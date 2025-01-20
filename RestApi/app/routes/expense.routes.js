module.exports = (app) => {
    const expense = require('../controllers/expense.controller.js');

    // Create a new balance
    app.post('/expense', expense.create);

    // Retrieve all expense
    app.get('/expense', expense.findAll);

    // Retrieve a single Note with noteId
    app.get('/expense/:id', expense.findOne);

    // Update a Note with noteId
    app.put('/expense/:id', expense.update);

    app.get('/expense/getByEmpId/:id', expense.getExpenseByEmpId);

    app.get('/expenseDetails/GetView',expense.getExpenseView);

    app.get('/expense/getExpensesByEmpId/:id', expense.getLastExpensesByEmpId);

    app.get('/getUnApprovedCount', expense.getUnApprovedRequestCount);

}