module.exports = (app) => {
    const lookup = require('../controllers/lookup.controller.js');

    // Create a new balance
    app.post('/lookup', lookup.create);

    // Retrieve all balance
    app.get('/lookup', lookup.findAll);

    // Retrieve a single Note with noteId
    app.get('/lookup/:id', lookup.findOne);

    // Update a Note with noteId
    app.put('/lookup/:id', lookup.update);

    // get net balance for an employee
    app.post('/lookup/getByLookupType',lookup.getByLookupType);

}