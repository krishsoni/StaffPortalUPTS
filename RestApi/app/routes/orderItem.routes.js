module.exports = (app) => {
    const orderItem = require('../controllers/orderItem.controller.js');

    // Create a new employee
    app.post('/orderItem', orderItem.create);

    // Retrieve all employee
    app.get('/orderItem', orderItem.findAll);

    // Retrieve a single Note with noteId
    app.get('/orderItem/:id', orderItem.findOne);

    // Update a Note with noteId
    app.put('/orderItem/:id', orderItem.update);

    // Delete a Note with noteId
    app.delete('/orderItem/:id', orderItem.delete);


  

}