module.exports = (app) => {
    const menu = require('../controllers/menu.controller.js');

    // Create a new employee
    app.post('/MenuItem', menu.create);

    // Retrieve all employee
    app.get('/Menu', menu.findAll);

    // Retrieve a single Note with noteId
    app.get('/Menu/:id', menu.findOne);

    // Update a Note with noteId
    app.put('/Menu/:id', menu.update);

    // Delete a Note with noteId
    app.delete('/Menu/:id', menu.delete);

    app.get('/MenuCategories',menu.getbyCategories);

    app.get('/MenuItems', menu.getMenuItems);

    app.get('/VegMenuCategories',menu.getVegCategories);

}