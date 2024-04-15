module.exports = (app) => {
    const tables = require('../controllers/tables.controller.js');

    // Create a new employee
    app.post('/tables', tables.create);

    // Retrieve all employee
    app.get('/tables', tables.findAll);

    // Retrieve a single Note with noteId
    app.get('/tables/:id', tables.findOne);

    // Update a Note with noteId
    app.put('/tables/:id', tables.update);

    // Delete a Note with noteId
    app.delete('/tables/:id', tables.delete);

    app.get('/tables/getTablebyNum/:tableno',tables.findbyTableNum);
}