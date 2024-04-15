module.exports = (app) => {
    const balance = require('../controllers/balance.controller.js');

    // Create a new balance
    app.post('/balance', balance.create);

    // Retrieve all balance
    app.get('/balance', balance.findAll);

    // Retrieve a single Note with noteId
    app.get('/balance/:id', balance.findOne);

    // Update a Note with noteId
    app.put('/balance/:id', balance.update);

    // get net balance for an employee
    app.get('/balance/getBalancebyEmpId/:id',balance.getBalancebyEmpId);

}