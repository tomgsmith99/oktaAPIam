// Render Okta strings to put into gateway

var fs = require("fs")

/********************************/

var gateways = ["mulesoft"]

get_gateway()
.then((gateway) => get_settings(gateway))

function get_gateway() {

	return new Promise((resolve, reject) => {

		var msg = ""
		if (!(process.argv[2])) {
			msg += "Sorry, you must provide the name of a gateway to this script like this:"
			msg += "\nnode get_settings.js --mulesoft"
			msg += "\ntoday the supported gateways are:"
			for (var key in gateways) {
				msg += "\n" + gateways[key]
			}
			reject(msg)
		}

		var g = process.argv[2]

		var arr = g.split("--")

		var orig_input = arr[1]

		var gateway = orig_input.toLowerCase()

		for (var key in gateways) {
			if (gateways[key] === gateway)
			resolve(gateway)
		}
		reject("Sorry, " + orig_input + " is not supported at this time")
	})
}

function get_settings(gateway) {

	fs.readFile("./config/this_session.json", (err, data) => {
		if (err) throw new Error(err)

		var obj = JSON.parse(data)

		console.log("\n===========================")

		console.log("Settings for " + gateway)

		console.log("===========================\n")

		for (var key in obj.GATEWAYS[gateway].settings) {
			console.log(key + ": ")
			console.log(obj.GATEWAYS[gateway].settings[key])
			console.log("")
		}
	})
}