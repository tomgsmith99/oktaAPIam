// Okta API Access Management

////////////////////////////////////////////////////
require('dotenv').config()

const express = require('express')

var fs = require("fs")

var okta_bootstrap = require("okta-bootstrapper")

var promptly = require("promptly")

///////////////////////////////////////////////////

// this object stores the Okta bootstrap output file
// if one is available
var bootstrap_obj

// this global object stores the final settings that the app will use
// after considering 1) hard-coded values, 2) the bootstrap obj,
// 3) environment variables
global.CONFIG = require("./config/config.json")

global.GATEWAYS = require("./config/gateways.json")

/***********************************************/

init()

async function init() {
	try {
		bootstrap_obj = await okta_bootstrap.valid_output_file_exists()
		console.log("Found a valid Okta bootstrap file at okta_bootstrap/output/okta_bootstrap_OUT.json")
		console.log("Do you want to:")
		console.log("(L) load this file")
		console.log("(i) ignore bootstrap - load values from the env and any hard-coded values")
		console.log("(q) quit")

		var user_input = await promptly.prompt("\n:", {default: "L"})

		user_input = user_input.toUpperCase()

		var done

		if (user_input === "L") {
			done = await assign_config_vals(true) // use the bootstrap file
		}
		else if (user_input === "I") {
			done = await assign_config_vals(false) // don't use the bootstrap file
		}
		else { process.exit() }

	} catch (e) {

		console.log("the error is: " + e)
	}
}

function assign_config_vals(with_bootstrap) {
	for (var key in CONFIG) {
		var source = ""
		console.log("----------------")
		if (CONFIG[key] != "") {
			source = "config.json"
		}
		else if (with_bootstrap && lookup_bootstrap_val(key) != "") {
			source = "okta_bootstrap_OUT.json"
			CONFIG[key] = lookup_bootstrap_val(key)
		}
		else if (process.env[key]) {
			source = "process.env"
			CONFIG[key] = process.env[key]
		}

		if (CONFIG[key] != "") {
			console.log("Found a value for " + key + ": " + CONFIG[key])
			console.log("Source: " + source)
		}
		else {
			console.log("WARNING: could not find a value for " + key)
		}
	}

	var this_session = {}

	this_session = CONFIG

	fs.readFile('./config/gateways.json', 'utf8', (error, data) => {
		if (error) { throw new Error(error) }

		var regex
		for (var key in CONFIG) {
			regex = new RegExp('{{' + key + '}}', 'g')

			data = data.replace(regex, CONFIG[key])
		}

		this_session.GATEWAYS = JSON.parse(data)

		fs.writeFile('./config/this_session.json', JSON.stringify(this_session, null, 2), "utf8", (error) => {

			if (error) { throw new Error(error) }

			console.log("Finished loading values...")

			console.log("---------------------------")
			return "done"
		})
	})

	// hard-coded for now, will update when I add more gateways

	fs.readFile('./api_specs/mulesoft.raml', 'utf8', (error, data) => {
		if (error) { throw new Error(error) }

		var regex
		for (var key in CONFIG) {
			regex = new RegExp('{{' + key + '}}', 'g')

			data = data.replace(regex, CONFIG[key])
		}

		fs.writeFile('./api_specs/mulesoft.raml', data, "utf8", (error) => {

			if (error) { throw new Error(error) }

			console.log("Finished updating RAML files...")

			console.log("---------------------------")
			return "done"
		})
	})
}

function lookup_bootstrap_val(key) {

	// usernames are a challenge bc they are stored two levels deep in the user object
	// we are also going to shorten usernames: t.s@abc.org -> t.s
	if (key === "SILVER_USERNAME") {
		if (bootstrap_obj.SILVER_USER && bootstrap_obj.SILVER_USER != "") {

			var arr = bootstrap_obj.SILVER_USER.profile.login.split("@")

			return arr[0]
		}
		else { return "" }
	}
	else if (key === "GOLD_USERNAME") {
		if (bootstrap_obj.GOLD_USER && bootstrap_obj.GOLD_USER != "") {

			var arr = bootstrap_obj.GOLD_USER.profile.login.split("@")

			return arr[0]
		}
		else { return "" }
	}
	else {
		if (bootstrap_obj[key] && bootstrap_obj[key] != "") {
			return bootstrap_obj[key]
		}
		else { return "" }
	}
}