// Okta API Access Management

////////////////////////////////////////////////////
require('dotenv').config()

var bodyParser = require('body-parser')

const express = require('express')

var fs = require("fs")

var session = require("express-session")

var promptly = require("promptly")

///////////////////////////////////////////////////

/************************************************/
/* Load config file */

var config_path = "./config/this_session.json"

fs.readFile(config_path, (err, data) => {
	if (err) {
		console.log("No config file found at  " + config_path)
		console.log("Please run the script config.js one time to set up this file.")
		process.exit()
	}
})

global.CONFIG = require(config_path)

/************************************************/


// this global object stores the final settings that the app will use
// after considering 1) hard-coded values, 2) the bootstrap obj,
// 3) environment variables
// global.CONFIG = require("./config/config.json")

// global.GATEWAYS = require("./config/gateways.json")

const app = express()

app.use(session({
	secret: process.env.SESSION_SECRET,
	cookie: { maxAge: parseInt(process.env.SESSION_MAX_AGE) },
	resave: true,
	saveUninitialized: true
}))

app.use(bodyParser.json())

require('./routes.js')(app)

app.listen(CONFIG.PORT, function () {
	console.log('App listening on port ' + CONFIG.PORT + "...")
})

/***********************************************/

// init()

// async function init() {
// 	try {
// 		bootstrap_obj = await okta_bootstrap.valid_output_file_exists()
// 		console.log("Found a valid Okta bootstrap file at okta_bootstrap/output/okta_bootstrap_OUT.json")
// 		console.log("Do you want to:")
// 		console.log("(L) load this file")
// 		console.log("(i) ignore this file")
// 		var user_input = await promptly.prompt("\n:", {default: "L"})

// 		user_input = user_input.toUpperCase()

// 		var done

// 		if (user_input === "L") {
// 			done = await assign_config_vals(true) // use the bootstrap file
// 		}
// 		else {
// 			done = await assign_config_vals(false) // ignore the bootstrap file
// 		}

// 		launch_web_server()

// 	} catch (e) {

// 		if (e === "No okta bootstrap output file found at okta_bootstrap/output/okta_bootstrap_OUT.json...") {
// 			console.log("WARNING: Could not find a valid Okta bootstrap file at okta_bootstrap/output/okta_bootstrap_OUT.json. You can create a bootstrap file by running the okta_bootstrap.js app")
// 			console.log("Do you want to:")
// 			console.log("(C) continue without Okta bootstrap")
// 			console.log("(q) quit")

// 			var user_input = await promptly.prompt("\n:", {default: "C"})

// 			user_input = user_input.toUpperCase()

// 			var done

// 			if (user_input === "C") {
// 				done = await assign_config_vals(false) // ignore the bootstrap file
// 				launch_web_server()
// 			}
// 			else {
// 				process.exit()
// 			}
// 		}
// 		else {
// 			console.log("the error is: " + e)
// 		}
// 	}
// }

// function assign_config_vals(with_bootstrap) {
// 	for (var key in CONFIG) {
// 		var source = ""
// 		console.log("----------------")
// 		if (CONFIG[key] != "") {
// 			source = "config.json"
// 		}
// 		else if (with_bootstrap && lookup_bootstrap_val(key) != "") {
// 			source = "okta_bootstrap_OUT.json"
// 			CONFIG[key] = lookup_bootstrap_val(key)
// 		}
// 		else if (process.env[key]) {
// 			source = "process.env"
// 			CONFIG[key] = process.env[key]
// 		}

// 		if (CONFIG[key] != "") {
// 			console.log("Found a value for " + key + ": " + CONFIG[key])
// 			console.log("Source: " + source)
// 		}
// 		else {
// 			console.log("WARNING: could not find a value for " + key)
// 		}
// 	}

// 	fs.readFile('./config/gateways.json', 'utf8', (error, data) => {
// 		if (error) { throw new Error(error) }

// 		var regex
// 		for (var key in CONFIG) {
// 			regex = new RegExp('{{' + key + '}}', 'g')

// 			data = data.replace(regex, CONFIG[key])
// 		}

// 		// fs.writeFile('./config/this_session.json', JSON.stringify(data, null, 2), "utf8", (error) => {

// 		fs.writeFile('./config/this_session.json', data, "utf8", (error) => {

// 			if (error) { throw new Error(error) }

// 			console.log("Finished loading values...")

// 			console.log("---------------------------")
// 			return "done"
// 		})
// 	})
// }

// function launch_web_server() {

// 	console.log("launching web server...")

// 	app.use(session({
// 		secret: process.env.SESSION_SECRET,
// 		cookie: { maxAge: parseInt(process.env.SESSION_MAX_AGE) },
// 		resave: true,
// 		saveUninitialized: true
// 	}))

// 	app.use(bodyParser.json())

// 	require('./routes.js')(app)

// 	app.listen(CONFIG.PORT, function () {
// 		console.log('App listening on port ' + CONFIG.PORT + "...")
// 	})
// }

// function lookup_bootstrap_val(key) {

// 	// usernames are a challenge bc they are stored two levels deep in the user object
// 	// we are also going to shorten usernames: t.s@abc.org -> t.s
// 	if (key === "SILVER_USERNAME") {
// 		if (bootstrap_obj.SILVER_USER && bootstrap_obj.SILVER_USER != "") {

// 			var arr = bootstrap_obj.SILVER_USER.profile.login.split("@")

// 			return arr[0]
// 		}
// 		else { return "" }
// 	}
// 	else if (key === "GOLD_USERNAME") {
// 		if (bootstrap_obj.GOLD_USER && bootstrap_obj.GOLD_USER != "") {

// 			var arr = bootstrap_obj.GOLD_USER.profile.login.split("@")

// 			return arr[0]
// 		}
// 		else { return "" }
// 	}
// 	else {
// 		if (bootstrap_obj[key] && bootstrap_obj[key] != "") {
// 			return bootstrap_obj[key]
// 		}
// 		else { return "" }
// 	}
// }