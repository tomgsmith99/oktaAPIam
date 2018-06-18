// Okta API Access Management

////////////////////////////////////////////////////
require('dotenv').config()

// require('./cfg.js')

var bodyParser = require('body-parser')

const express = require('express')

var session = require("express-session")

var okta_bootstrap = require("okta-bootstrapper")

var promptly = require("promptly")

///////////////////////////////////////////////////

// this object stores the Okta bootstrap output file
// if one is available
var bootstrap_obj

// this global object stores the final settings that the app will use
// after considering 1) hard-coded values, 2) the bootstrap obj,
// 3) environment variables
var config = require("./config/config.json")

var gateways = require("./config/gateways.json")

const app = express()

/***********************************************/

init()

async function init() {
	try {
		bootstrap_obj = await okta_bootstrap.valid_output_file_exists()
		console.log("Found a valid Okta bootstrap file at okta_bootstrap/output/okta_bootstrap_OUT.json")
		console.log("Do you want to:")
		console.log("(L) load this file")
		console.log("(i) ignore this file")
		var user_input = await promptly.prompt("\n:", {default: "L"})

		user_input = user_input.toUpperCase()

		var done

		if (user_input === "L") {
			done = await assign_config_vals(true) // use the bootstrap file
		}
		else {
			done = await assign_config_vals(false) // ignore the bootstrap file
		}

		launch_web_server()

	} catch (e) {

		if (e === "No okta bootstrap output file found at okta_bootstrap/output/okta_bootstrap_OUT.json...") {
			console.log("WARNING: Could not find a valid Okta bootstrap file at okta_bootstrap/output/okta_bootstrap_OUT.json. You can create a bootstrap file by running the okta_bootstrap.js app")
			console.log("Do you want to:")
			console.log("(C) continue without Okta bootstrap")
			console.log("(q) quit")

			var user_input = await promptly.prompt("\n:", {default: "C"})

			user_input = user_input.toUpperCase()

			var done

			if (user_input === "C") {
				done = await assign_config_vals(false) // ignore the bootstrap file
				launch_web_server()
			}
			else {
				process.exit()
			}
		}
		else {
			console.log("the error is: " + e)
		}
	}
}

function assign_config_vals(with_bootstrap) {
	for (key in config) {
		var source = ""
		console.log("----------------")
		if (config[key] != "") {
			source = "config.json"
		}
		else if (with_bootstrap && lookup_bootstrap_val(key) != "") {
			source = "okta_bootstrap_OUT.json"
			config[key] = lookup_bootstrap_val(key)
		}
		else if (process.env[key]) {
			source = "process.env"
			config[key] = process.env[key]
		}

		if (config[key] != "") {
			console.log("Found a value for " + key + ": " + config[key])
			console.log("Source: " + source)
		}
		else {
			console.log("WARNING: could not find a value for " + key)
		}
	}

	console.log("Finished building config...")
	console.log("---------------------------")
	return "done"
}

function launch_web_server() {

	app.use(express.static('public'))

	app.use(session({
		secret: process.env.SESSION_SECRET,
		cookie: { maxAge: parseInt(process.env.SESSION_MAX_AGE) },
		resave: true,
		saveUninitialized: true
	}))

	app.use(bodyParser.json())

	require('./routes.js')(app)

	app.listen(config.PORT, function () {
		console.log('App listening on port ' + config.PORT + "...");
	})
}

function lookup_bootstrap_val(key) {

	// simple values where name of key in config.json === name of key in bootstrap_OUT.json
	if (key === "PORT" || key === "OKTA_TENANT") {
		if (bootstrap_obj[key] && bootstrap_obj[key] != "") {
			return bootstrap_obj[key]
		}
		else { return "" }
	}

	// when name of key in config.json != name of key in bootstrap_OUT.json
	// ex: OKTA_CLIENT_ID != OKTA_CLIENT.client_id

	if (key === "OKTA_CLIENT_ID") {
		if (bootstrap_obj.OKTA_CLIENT.client_id && bootstrap_obj.OKTA_CLIENT.client_id != "") {
			return bootstrap_obj.OKTA_CLIENT.client_id
		}
		else { return "" }
	}
	else if (key === "OKTA_CLIENT_SECRET") {
		if (bootstrap_obj.OKTA_CLIENT.client_secret && bootstrap_obj.OKTA_CLIENT.client_secret != "") {
			return bootstrap_obj.OKTA_CLIENT.client_secret
		}
		else { return "" }
	}
	else if (key === "OKTA_AUTH_SERVER_ID") {
		if (bootstrap_obj.OKTA_AUTHORIZATION_SERVER.id && bootstrap_obj.OKTA_AUTHORIZATION_SERVER.id != "") {
			return bootstrap_obj.OKTA_AUTHORIZATION_SERVER.id
		}
		else { return "" }
	}
	else if (key === "PORT") {
		if (bootstrap_obj.PORT && bootstrap_obj.PORT != "") {
			return bootstrap_obj.PORT
		}
		else { return "" }
	}
	else { return "" }
}