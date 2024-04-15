module.exports = (app) => {
    const order = require('../controllers/order.controller.js');

    // Create a new employee
    app.post('/order', order.create);

    // Retrieve all employee
    app.get('/order', order.findAll);

    // Retrieve a single Note with noteId
    app.get('/order/:id', order.findOne);

    // Update a Note with noteId
    app.put('/order/:id', order.update);

    // Delete a Note with noteId
    app.delete('/order/:id', order.delete);

    app.get('/orderDetails',order.getOrderDetails);

    app.get('/getOrderDetailsByStatus/:status',order.getOrderDetailsByStatus);

    app.get('/order/getbytableandphno/:tableno/:phno',order.findbyTableandPhoneNum);

    app.get('/order/getorderbytableno/:tableno', order.getOrderByTable);


  

}