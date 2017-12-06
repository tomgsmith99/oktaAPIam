// Okta API Access Management

////////////////////////////////////////////////////
global.__base = __dirname + '/';

var config = require(__base + ".env.js");

var bodyParser = require('body-parser');

const express = require('express');

var fs = require('fs');

var session = require("express-session");

///////////////////////////////////////////////////

// SET UP WEB SERVER
const app = express();

app.use(express.static('public'));

app.use(session({ secret: config.SECRET, cookie: { maxAge: 60000 }}));

app.use(bodyParser.json());

require(__base + 'routes.js')(app);

var port = process.env.PORT || 3090

app.listen(port, function () {
	console.log('App listening on port ' + port);
});