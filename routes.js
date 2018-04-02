
var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

var session = require("express-session");

//*******************************************/

module.exports = function (app) {

	app.get('/F5', function(req, res, next) {

		getPage("F5", "appAccess", function(err, webPage) {
			if (err) { throw new Error(err) }

			req.session.partner = req.params.partner;

			res.send(webPage);
		});
	});


	app.get('/:partner', function(req, res, next) {

		getPage(req.params.partner, "apiAM", function(err, webPage) {
			if (err) { throw new Error(err) }

			req.session.partner = req.params.partner;

			res.send(webPage);
		});
	});

	app.post('/getAccessToken', function(req, res, next) {
		var code = req.body.code;

		console.log("the authorization code is: " + code);

		// exchange the authorization code
		// for an access token

		var url = OKTA_OAUTH_PATH + "token";

		var redirect_uri = getRedirectURI(req.session.partner);

		console.log("the url is: " + url);
		console.log("the redirect_uri is: " + redirect_uri);

		var options = { method: 'POST',
			url: url,
			qs: 
				{ grant_type: 'authorization_code',
				code: code,
				redirect_uri: redirect_uri
			},
			headers: 
				{ 'cache-control': 'no-cache',
				authorization: 'Basic ' + getBasicAuthString(req.session.partner),
				'content-type': 'application/x-www-form-urlencoded' }
		};

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

			// send the access token to the introspection endpoint
			// (for illustration purposes only)

			url = OKTA_OAUTH_PATH + "introspect";

			var options = { method: 'POST',
				url: url,
				qs: { token: req.session.access_token },
				headers:
				{
				'cache-control': 'no-cache',
				authorization: 'Basic ' + getBasicAuthString(req.session.partner),

				accept: 'application/json',
				'content-type': 'application/x-www-form-urlencoded' }
			};

			request(options, function (error, response, body) {
				if (error) throw new Error(error);

				console.log("response from Okta: ");
				console.log(body);

				res.json(body);
			});
		});
	});

	app.post('/getData', function(req, res, next) {
		var endpoint = req.body.endpoint;

		console.log("the requested endpoint is: " + endpoint);

		console.log("the access_token token is: \n" + req.session.access_token + "\n");

		// send the access token to the requested API endpoint

		var url = getProxyURI(req.session.partner) + "/" + req.body.endpoint;

		var options = { method: 'GET',
			url: url,
			headers:
			{
			'cache-control': 'no-cache',
			authorization: "Bearer " + req.session.access_token,

			accept: 'application/json',
			'content-type': 'application/x-www-form-urlencoded' }
		};

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

			fs.readFile('./html/' + partner + '.html', 'utf8', (error, partner_content) => {

				if (error) { throw new Error(error) }

				page = page.replace(/{{title}}/g, getTitle(partner));

				page = page.replace(/{{OKTA_TENANT}}/g, OKTA_TENANT);
				page = page.replace(/{{OKTA_OAUTH_PATH}}/g, OKTA_OAUTH_PATH);
				page = page.replace(/{{CLIENT_ID}}/g, getClientID(partner));
				page = page.replace(/{{redirect_uri}}/g, getRedirectURI(partner));
				page = page.replace(/{{partner}}/g, partner);
				page = page.replace(/{{DISPLAY_NAME}}/g, getDisplayName(partner));
				page = page.replace(/{{partner_links}}/g, getLinks(partner));
				page = page.replace(/{{partner_content}}/g, partner_content);

				if (solutionType == "apiAM") {
					fs.readFile('./html/left_col.html', 'utf8', (error, left_col) => {

						page = page.replace(/{{left_col}}/g, left_col)

						fs.readFile('./html/right_col.html', 'utf8', (error, right_col) => {

							page = page.replace(/{{right_col}}/g, right_col)
							page = page.replace(/{{proxy_uri}}/g, getProxyURI(partner));

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

	function getClientID(partner) {
		if (typeof _CFG[partner.toUpperCase()].CLIENT_ID === 'undefined') {
			return OKTA_CLIENT_ID
		}
		return _CFG[partner.toUpperCase()].CLIENT_ID
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

	function getProxyURI(partner) {
		return _CFG[partner.toUpperCase()].PROXY_URI
	}

	function getRedirectURI(partner) {
		return REDIRECT_URI_BASE + "/" + partner;
	}

	function getBasicAuthString(partner) {

		partner = partner.toUpperCase();

		var x = getClientID(partner) + ":" + getClientSecret(partner);

		var y = new Buffer(x).toString('base64');

		return y;
	}

	function getSettings() {
		console.log("the OAUTH_PATH is: " + getOAuthPath())
	}

	function getTitle(partner) {
		return "Okta API Access Management with " + getDisplayName(partner)
	}
}