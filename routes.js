var config = require(__base + '.env.js');

var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

module.exports = function (app) {

	app.get('/', function(req, res, next) {

		fs.readFile(__base + 'index.html', 'utf8', (error, webPage) => {
			if (error) { throw new Error(error) }
			else {

				webPage = webPage.replace(/{{oktaTenant}}/g, config.oktaTenant);
				webPage = webPage.replace(/{{authServerID}}/g, config.authServerID);
				webPage = webPage.replace(/{{clientID}}/g, config.clientID);
				webPage = webPage.replace(/{{redirect_uri}}/g, config.redirect_uri);
				webPage = webPage.replace(/{{proxy_uri}}/g, config.proxy_uri);

				res.send(webPage);
			}
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
}