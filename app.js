// Okta + Mulesoft integration

////////////////////////////////////////////////////
global.__base = __dirname + '/';

var config = require(__base + ".env.js");

const express = require('express');

var fs = require('fs');

///////////////////////////////////////////////////

// SET UP WEB SERVER
const app = express();

require(__base + 'routes.js')(app);

var port = process.env.PORT || 3090

app.listen(port, function () {
	console.log('App listening on port ' + port);
});