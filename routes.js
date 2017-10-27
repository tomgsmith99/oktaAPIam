var config = require(__base + '.env.js');

var request = require("request");

var bodyParser = require('body-parser');

var fs = require('fs');

var request = require('request');

module.exports = function (app) {

	app.get('/', function(req, res, next) {

		fs.readFile(__base + 'index.html', 'utf8', (error, webPage) => {
			if (error) { throw new Error(error) }
			else {

				webPage = webPage.replace(/{{redirect_uri}}/g, config.okta.redirect_uri);
				webPage = webPage.replace(/{{oktaTenant}}/g, config.oktaTenant);

				res.send(webPage);
			}
		});
	});

	app.post('/introspect', function(req, res, next) {

		var accessToken = req.body.accessToken;

		var options = { method: 'POST',
		  url: 'https://partnerpoc.oktapreview.com/oauth2/ausce8ii5wBzd0zvQ0h7/v1/introspect',
		  qs: { token: accessToken },
		  headers: 
		   {
		     'cache-control': 'no-cache',
		     authorization: 'Basic MG9hY2UzdDhyYlpUcnA4amkwaDc6cXZNcjl5ODdZa19jTEdWZnJvdjBUU1E5dGpGMmJfb0lFX0MwSFlxNQ==',
		     accept: 'application/json',
		     'content-type': 'application/x-www-form-urlencoded' } };

		request(options, function (error, response, body) {
			if (error) throw new Error(error);

			console.log(body);

			res.json(body);
		});

	});
}