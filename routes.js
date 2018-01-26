
var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

var session = require("express-session");

//*******************************************/

module.exports = function (app) {

	app.get('/:partner', function(req, res, next) {

		getPage(req.params.partner, function(err, webPage) {
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

		console.log("the access_token token is: " + req.session.access_token);

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

	function getPage(partner, callback) {

		var title = "Okta API Access Management";

		if (partner != "index") {
			title += " with " + titleCase(partner);
		}

		fs.readFile('./html/head.html', 'utf8', (error, head) => {

			head = head.replace(/{{title}}/g, title);

			head = head.replace(/{{OKTA_TENANT}}/g, OKTA_TENANT);
			head = head.replace(/{{OKTA_OAUTH_PATH}}/g, OKTA_OAUTH_PATH);
			head = head.replace(/{{CLIENT_ID}}/g, getClientID(partner));
			head = head.replace(/{{redirect_uri}}/g, getRedirectURI(partner));
			head = head.replace(/{{partner}}/g, partner);

			fs.readFile('./html/nav.html', 'utf8', (error, nav) => {
				if (error) { throw new Error(error) }

				fs.readFile('./html/' + partner + '_dropdown.html', 'utf8', (error, localNav) => {
					if (error) { throw new Error(error) }

					nav = nav.replace(/{{localNav}}/g, localNav);

					fs.readFile('./html/' + partner + '.html', 'utf8', (error, partner_content) => {
						if (error) { throw new Error(error) }

						fs.readFile('./html/main.html', 'utf8', (error, webPage) => {
							if (error) { throw new Error(error) }

								webPage = webPage.replace(/{{partner_content}}/g, partner_content);

								webPage = webPage.replace(/{{head}}/g, head);

								webPage = webPage.replace(/{{nav}}/g, nav);

								webPage = webPage.replace(/{{proxy_uri}}/g, getProxyURI(partner));

								return callback(null, webPage);
						});
					});
				});
			});
		});
	}

	function getClientID(partner) {
		return _CFG[partner.toUpperCase()].CLIENT_ID
	}

	function getProxyURI(partner) {
		return _CFG[partner.toUpperCase()].PROXY_URI
	}

	function getRedirectURI(partner) {
		return REDIRECT_URI_BASE + "/" + partner;
	}

	function getBasicAuthString(partner) {

		partner = partner.toUpperCase();

		var x = _CFG[partner].CLIENT_ID + ":" + _CFG[partner].CLIENT_SECRET;

		var y = new Buffer(x).toString('base64');

		return y;
	}

	function getSettings() {
		console.log("the OAUTH_PATH is: " + getOAuthPath())
	}

	function titleCase(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}