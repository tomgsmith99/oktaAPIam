var config = require(__base + '.env.js');

var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

module.exports = function (app) {

	app.get('/', function(req, res, next) {

		getPartnerPage("index", function(err, webPage) {
			if (err) { throw new Error(err) }

			res.send(webPage);
		});
	});

	app.get('/:partner', function(req, res, next) {

		getPartnerPage(req.params.partner, function(err, webPage) {
			if (err) { throw new Error(err) }

			res.send(webPage);
		});
	});

	app.post('/introspect', function(req, res, next) {

		var accessToken = req.body.accessToken;

		var options = { method: 'POST',
		  url: config.oktaTenant + '/oauth2/' + config.authServerID + '/v1/introspect',
		  qs: { token: accessToken },
		  headers: 
		   {
		     'cache-control': 'no-cache',
		    authorization: 'Basic ' + config.authString,

		     accept: 'application/json',
		     'content-type': 'application/x-www-form-urlencoded' } };

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);

			res.json(body);
		});

	});

	function getPartnerPage(partner, callback) {

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

			fs.readFile(__base + 'html/nav.html', 'utf8', (error, nav) => {
				if (error) { throw new Error(error) }

				fs.readFile(__base + 'html/' + partner + '.html', 'utf8', (error, webPage) => {
					if (error) { throw new Error(error) }
					else {

						webPage = webPage.replace(/{{head}}/g, head);

						webPage = webPage.replace(/{{nav}}/g, nav);

						webPage = webPage.replace(/{{proxy_uri}}/g, config.proxy_uri);

						return callback(null, webPage);
					}
				});
			});
		});
	}

	function titleCase(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}