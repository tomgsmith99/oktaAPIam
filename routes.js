var config = require(__base + '.env.js');

var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

var session = require("express-session");

//*******************************************/

module.exports = function (app) {

	app.get('/favicon.ico', function(req, res, next) {
		var img = fs.readFileSync(__base + '/favicon.ico');
		res.writeHead(200, {'Content-Type': 'image/x-icon' });
		res.end(img, 'binary');
	});

	app.get('/', function(req, res, next) {

		getPage("index", function(err, webPage) {
			if (err) { throw new Error(err) }

			res.send(webPage);
		});
	});

	app.get('/:partner', function(req, res, next) {

		getPage(req.params.partner, function(err, webPage) {
			if (err) { throw new Error(err) }

			req.session.partner = req.params.partner;

			res.send(webPage);
		});
	});

	app.post('/getAccessToken', function(req, res, next) {
		var code = req.body.code;

		console.log("the authorizaation code is: " + code);

		// exchange the authorization code
		// for an access token

		var url = getOAuthPath() + "token";
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
				authorization: 'Basic ' + getBasicAuthString(),
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

			url = getOAuthPath() + "introspect";

			var options = { method: 'POST',
				url: url,
				qs: { token: req.session.access_token },
				headers:
				{
				'cache-control': 'no-cache',
				authorization: 'Basic ' + getBasicAuthString(),

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

		// send the access token to the requested API endpoint

		var url = config.proxy_uri + "/" + req.body.endpoint;

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

	function getOAuthPath() {
		return config.oktaTenant + "/oauth2/" + config.authServerID + "/v1/";
	}

	function getPage(partner, callback) {

		var title = "Okta API Access Management";

		if (partner != "index") {
			title += " with " + titleCase(partner);
		}

		fs.readFile(__base + 'html/head.html', 'utf8', (error, head) => {

			head = head.replace(/{{title}}/g, title);

			head = head.replace(/{{oktaTenant}}/g, config.oktaTenant);
			head = head.replace(/{{authServerID}}/g, config.authServerID);
			head = head.replace(/{{clientID}}/g, config.clientID);
			head = head.replace(/{{redirect_uri}}/g, config.redirect_uri_base + '/' + partner);
			head = head.replace(/{{partner}}/g, partner);

			fs.readFile(__base + 'html/nav.html', 'utf8', (error, nav) => {
				if (error) { throw new Error(error) }

				fs.readFile(__base + 'html/' + partner + '_nav.html', 'utf8', (error, localNav) => {
					if (error) { throw new Error(error) }

					nav = nav.replace(/{{localNav}}/g, localNav);

					fs.readFile(__base + 'html/' + partner + '.html', 'utf8', (error, webPage) => {
						if (error) { throw new Error(error) }

							webPage = webPage.replace(/{{head}}/g, head);

							webPage = webPage.replace(/{{nav}}/g, nav);

							webPage = webPage.replace(/{{proxy_uri}}/g, config.proxy_uri);

							return callback(null, webPage);
					});
				});
			});
		});
	}

	function getRedirectURI(partner) {
		return config.redirect_uri_base + "/" + partner;
	}

	function getBasicAuthString() {

		var x = config.clientID + ":" + config.client_secret;

		var y = new Buffer(x).toString('base64');

		console.log("the auth string is: " + y);
		
		return y;
	}

	function titleCase(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}