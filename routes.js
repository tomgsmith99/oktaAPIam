
var bodyParser = require("body-parser")

var fs = require("fs")

const OktaJwtVerifier = require('@okta/jwt-verifier')

var request = require("request")

var session = require("express-session")

//*******************************************/

const oktaJwtVerifier = new OktaJwtVerifier({
	issuer: CONFIG.OKTA_AS_PATH_BASE
})

module.exports = function (app) {

	app.get('/', function(req, res, next) {

		fs.readFile('./html/index.html', 'utf8', (error, page) => {

			// console.log("the gateway is: " + req.session.partner)

			evaluate_vars(page, (error, page) => {
				if (error) { throw new Error(error) }

				res.send(page)

			})

			// page = evaluate_vars(page)

			// set_proxy_uris(page)

			// page = page.replace(/{{OKTA_TENANT}}/g, CONFIG.OKTA_TENANT)
			// page = page.replace(/{{SILVER_USERNAME}}/g, CONFIG.SILVER_USERNAME)
			// page = page.replace(/{{FAKE_USER_PASSWORD}}/g, CONFIG.FAKE_USER_PASSWORD)


			// if (error) { throw new Error(error) }


		})

		// res.send("<p>this is the callback page</p>")
	})

	// app.get('/authorization-code/callback', function(req, res, next) {

	// 	fs.readFile('./html/callback.html', 'utf8', (error, page) => {

	// 		console.log("the gateway is: " + req.session.partner)

	// 		page = page.replace(/{{GATEWAY}}/g, req.session.partner)

	// 		if (error) { throw new Error(error) }

	// 		res.send(page)

	// 	})

	// 	// res.send("<p>this is the callback page</p>")
	// })

	app.get('/F5', function(req, res, next) {

		getPage("F5", "appAccess", function(err, webPage) {
			if (err) { throw new Error(err) }

			req.session.partner = req.params.partner;

			res.send(webPage);
		});
	});


	// app.get('/:partner', function(req, res, next) {

	// 	getPage(req.params.partner, "apiAM", function(err, webPage) {
	// 		if (err) { throw new Error(err) }

	// 		req.session.partner = req.params.partner

	// 		console.log("on the gateway homepage, the gateway in the session is: " + req.session.partner)

	// 		res.send(webPage)
	// 	})
	// })

	app.post('/getAccessToken', function(req, res, next) {
		var code = req.body.code;

		console.log("the authorization code is: " + code);

		// exchange the authorization code
		// for an access token

		var options = {
			method: 'POST',
			url: CONFIG.OKTA_OAUTH_PATH + "token",
			qs: {
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: CONFIG.REDIRECT_URI
			},
			headers: {
				'cache-control': 'no-cache',
				authorization: 'Basic ' + getBasicAuthString(),
				'content-type': 'application/x-www-form-urlencoded'
			}
		}

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);

			var obj = JSON.parse(body);

			if (obj.hasOwnProperty("access_token")) {
				req.session.access_token = obj.access_token;
				console.log("the access token is: " + req.session.access_token);
			}
			if (obj.hasOwnProperty("id_token")) {
				req.session.id_token = obj.id_token;
			}

			var response_to_browser = {}

			response_to_browser.access_token = obj.access_token
			response_to_browser.id_token = obj.id_token

			oktaJwtVerifier.verifyAccessToken(obj.id_token)
			.then(jwt => {
				console.log("the type of jwt.claims is: " + typeof jwt.claims)
				response_to_browser.id_token_decoded = jwt.claims
				console.log(jwt.claims)

				oktaJwtVerifier.verifyAccessToken(obj.access_token)
				.then(jwt => {
					response_to_browser.access_token_decoded = jwt.claims

					console.log(jwt.claims)

					console.log("the response to the browser is: ")
					console.dir(response_to_browser)

					res.json(JSON.stringify(response_to_browser))
				})
				.catch(err => {
					console.log("something went wrong with the access_token validation")
					console.log(err)

				})
			})
			.catch(err => {
				console.log("something went wrong with the id_token validation")
				console.log(err)
			})





			// send the access_token to the introspect endpoint to validate it
			// var options = {
			// 	method: 'POST',
			// 	url: CONFIG.OKTA_OAUTH_PATH + "introspect",
			// 	qs: { token: req.session.access_token },
			// 	headers: {
			// 		'cache-control': 'no-cache',
			// 		authorization: 'Basic ' + getBasicAuthString(),
			// 		accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded'
			// 	}
			// }

			// request(options, function (error, response, body) {
			// 	if (error) throw new Error(error)

			// 	console.log("response from Okta: ")
			// 	console.log(body)

			// 	// FOR DEMO PURPOSES ONLY
			// 	// WITH CODE FLOW YOU SHOULD NOT SEND THE ACCESS TOKEN BACK TO THE BROWSER

			// 	body = JSON.parse(body)
			// 	body.access_token = req.session.access_token
			// 	res.json(JSON.stringify(body))
			// })
		})
	})

	app.post('/getData', function(req, res, next) {
		var endpoint = req.body.endpoint;

		console.log("the requested endpoint is: " + endpoint);

		console.log("the access_token token is: \n" + req.session.access_token + "\n");

		// send the access token to the requested API endpoint

		var url = GATEWAYS[req.session.partner].proxy_uri + "/" + req.body.endpoint

		var options = { method: 'GET',
			url: url,
			headers: {
				'cache-control': 'no-cache',
				authorization: "Bearer " + req.session.access_token,

				accept: 'application/json',
				'content-type': 'application/x-www-form-urlencoded'
			}
		}

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log("******\nresponse from API gateway: ");

			console.log(body);

			res.json(body);
		});
	});

	app.post('/killSession', function(req, res, next) {
		req.session.destroy(function(err) {
			if (err) throw new Error(err);
			console.log("successfully destroyed session.");
			res.send("OK");
		})
	});

	function getPage(partner, solutionType, callback) {

		fs.readFile('./html/main.html', 'utf8', (error, page) => {

			if (error) { throw new Error(error) }

			page = page.replace(/{{PARTNER}}/g, partner)

			fs.readFile('./html/' + partner + '.html', 'utf8', (error, partner_content) => {

				if (error) { throw new Error(error) }

				page = page.replace(/{{title}}/g, getTitle(partner));

				page = page.replace(/{{HOME}}/g, CONFIG.HOME);
				page = page.replace(/{{OKTA_TENANT}}/g, CONFIG.OKTA_TENANT);
				page = page.replace(/{{OKTA_OAUTH_PATH}}/g, CONFIG.OKTA_OAUTH_PATH);
				page = page.replace(/{{CLIENT_ID}}/g, CONFIG.OKTA_CLIENT_ID);
				page = page.replace(/{{redirect_uri}}/g, CONFIG.REDIRECT_URI);
				page = page.replace(/{{partner}}/g, partner);
				page = page.replace(/{{DISPLAY_NAME}}/g, GATEWAYS[partner].display_name)
				// page = page.replace(/{{partner_links}}/g, getLinks(partner));
				page = page.replace(/{{partner_content}}/g, partner_content);

				if (solutionType == "apiAM") {
					fs.readFile('./html/left_col.html', 'utf8', (error, left_col) => {

						page = page.replace(/{{left_col}}/g, left_col)

						fs.readFile('./html/right_col.html', 'utf8', (error, right_col) => {

							if (error) { return callback(error) }

							right_col = right_col.replace(/{{SILVER_USERNAME_SHORT}}/g, CONFIG.SILVER_USERNAME)
							right_col = right_col.replace(/{{FAKE_USER_PASSWORD}}/g, CONFIG.FAKE_USER_PASSWORD)

							page = page.replace(/{{right_col}}/g, right_col)
							page = page.replace(/{{proxy_uri}}/g, GATEWAYS[partner].proxy_uri)

							return callback(null, page);
						});
					});
				}
				else {
					page = page.replace(/{{left_col}}/g, "")

					fs.readFile('./html/right_col/' + partner + '.html', 'utf8', (error, right_col) => {

						page = page.replace(/{{right_col}}/g, right_col)
						page = page.replace(/{{proxy_uri}}/g, getProxyURI(partner));

						return callback(null, page);
					});
				}
			});
		});
	}

	function getClientSecret(partner) {
		if (typeof _CFG[partner.toUpperCase()].CLIENT_SECRET === 'undefined') {
			return OKTA_CLIENT_SECRET
		}
		return _CFG[partner.toUpperCase()].CLIENT_SECRET
	}

	function getDisplayName(partner) {
		if (typeof _CFG[partner.toUpperCase()].DISPLAY_NAME === 'undefined') {
			return partner
		}
		return _CFG[partner.toUpperCase()].DISPLAY_NAME
	}

	function getLinks(partner) {

		links = "<li><a href='/" + partner + "'>Demo</a></li>"

		if (typeof _CFG[partner.toUpperCase()].LINKS === 'undefined') {
			return links
		}

		links_arr = _CFG[partner.toUpperCase()].LINKS

		for (i = 0; i < links_arr.length; i++) {
			links += "\n<li><a href ='" + links_arr[i].href + "' target = '_blank'>" + links_arr[i].name + "</a></li>"
		}
		return links
	}

	function getRedirectURI(partner) {
		return REDIRECT_URI_BASE + "/" + partner;
	}

	function getBasicAuthString() {

		var x = CONFIG.OKTA_CLIENT_ID + ":" + CONFIG.OKTA_CLIENT_SECRET

		var y = new Buffer(x).toString('base64')

		return y
	}

	function getSettings() {
		console.log("the OAUTH_PATH is: " + getOAuthPath())
	}

	function getTitle(partner) {
		// return "Okta API Access Management with " + getDisplayName(partner)
		return "Okta API Access Management with " + GATEWAYS[partner].display_name

	}
}

function evaluate_vars(page, callback) {
	var regex
	for (var key in CONFIG) {
		regex = new RegExp('{{' + key + '}}', 'g')

		page = page.replace(regex, CONFIG[key])
	}
	return callback(null, page)
}

// function set_proxy_uris(page) {
// 	var js = ""
// 	for (var key in GATEWAYS) {
// 		console.log(key + ": " + GATEWAYS[key].proxy_uri)
// 		if (GATEWAYS[key].proxy_uri && GATEWAYS[key].proxy_uri != "") {
// 			js += "proxy_uris." + key + ": " + GATEWAYS[key].proxy_uri
// 		}
// 	}
// }