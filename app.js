// Okta Access Management

////////////////////////////////////////////////////
global.__base = __dirname + '/';

var bodyParser = require('body-parser');

// var config = require(__base + ".env.js");

const express = require('express');

// var session = require("express-session");

// var morgan = require('morgan');

///////////////////////////////////////////////////

// SET UP WEB SERVER
const app = express();

// make sure oktaAuth.js is first to enforce authentitcation
require(__base + 'routes.js')(app);

var port = process.env.PORT || 3090

app.listen(port, function () {
	console.log('App listening on port ' + port);
});