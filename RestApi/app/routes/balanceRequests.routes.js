module.exports = (app) => {
    const balancerequests = require('../controllers/balanceRequests.controller.js');

    // Create a new user
    app.post('/balanceRequest', balancerequests.create);

  
    // Retrieve all user
    app.get('/balanceRequest', balancerequests.findAll);

    app.get('/balanceRequest/submitted', balancerequests.findSubmitted);

    // Retrieve a single Note with noteId
    app.get('/balanceRequest/:id', balancerequests.findOne);

    // Update a Note with noteId
    app.put('/balanceRequest/:id', balancerequests.update);

    app.get('/balanceRequest/getLastRequestByEmpId/:empId', balancerequests.getLastRequestByEmpId);

    app.get('/balanceRequest/getRequestbyUserName/:empId', balancerequests.getRequestbyUserName);

    app.get('/getSubmittedCount', balancerequests.getSubmittedRequestCount);


}