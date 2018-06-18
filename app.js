// Okta API Access Management

////////////////////////////////////////////////////
require('dotenv').config()

require('./cfg.js')

var bodyParser = require('body-parser')

const express = require('express')

var session = require("express-session")

var bootstrap = require("okta-bootstrapper")

///////////////////////////////////////////////////

// SET UP WEB SERVER
const app = express();

app.use(express.static('public'));

app.use(session({
	secret: SESSION_SECRET,
	cookie: { maxAge: SESSION_MAX_AGE },
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());

require('./routes.js')(app);

var port = process.env.PORT || 3090

app.listen(port, function () {
	console.log('App listening on port ' + port);
})

bootstrap.init()
.then((successMsg) => console.log("the bootstrap file is: " + successMsg))

try {
	var bootstrap_output = bootstrap.init()
} catch (e) {
	console.log("the error is: " + e)
}


