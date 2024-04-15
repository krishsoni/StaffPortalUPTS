module.exports = (app) => {
    const attachment = require('../controllers/attachment.controller.js');

    // Create a new balance
    app.post('/attachment', attachment.create);

   
 

    // Retrieve a single Note with noteId
    app.get('/attachment/:id', attachment.findOne);

    app.post('/attachment/getattachmentbyexpId', attachment.getattachmentbyexpId);


   

}