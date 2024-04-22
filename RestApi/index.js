const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// create express app
const app = express();

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '5mb' }));

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require routes
require('./app/routes/user.routes.js')(app);
require('./app/routes/employee.routes.js')(app);
require('./app/routes/project.routes.js')(app);
require('./app/routes/tables.routes.js')(app);
require('./app/routes/menu.routes.js')(app);
require('./app/routes/order.routes.js')(app);
require('./app/routes/orderItem.routes.js')(app);
require('./app/routes/balance.routes.js')(app);
require('./app/routes/expense.routes.js')(app);
require('./app/routes/lookup.routes.js')(app);
require('./app/routes/attachment.routes.js')(app);
require('./app/routes/auditTrail.routes.js')(app);


// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});