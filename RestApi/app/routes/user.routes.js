module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create a new user
    app.post('/user', user.create);

    app.post('/user/generateToken',user.createToken);

    app.post('/user/verifyToken',user.verifyToken);

    // Retrieve all user
    app.get('/user', user.findAll);

    // Retrieve a single Note with noteId
    app.get('/user/:id', user.findOne);

    // Update a Note with noteId
    app.put('/user/:noteId', user.update);

    // Delete a Note with noteId
    app.delete('/user/:noteId', user.delete);

    app.post('/user/getuserbyUserName', user.getuserbyUserName);

    app.post('/user/getuserbyName', user.getuserbyName);
}