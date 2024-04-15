module.exports = (app) => {
    const project = require('../controllers/project.controller.js');

    // Create a new project
    app.post('/project', project.create);

    // Retrieve all project
    app.get('/project', project.findAll);

    // Retrieve a single Note with noteId
    app.get('/project/:id', project.findOne);

    // Retrieve a single Note with Name
    app.post('/project/getbyprojectName', project.getbyprojectName);

    // Update a Note with noteId
    app.put('/project/:id', project.update);

    // Delete a Note with noteId
    app.delete('/project/:id', project.delete);

   // app.get('/projectDetails',project.getprojectDetails);




  

}