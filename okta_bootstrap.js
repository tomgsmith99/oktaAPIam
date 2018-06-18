// Okta API Access Management

////////////////////////////////////////////////////

var bootstrap = require("okta-bootstrapper")

///////////////////////////////////////////////////

// bootstrap.init()
// .then((successMsg) => console.log("the bootstrap file is: " + successMsg))

try {
	var bootstrap_output = bootstrap.init()
} catch (e) {
	console.log("the error is: " + e)
}


