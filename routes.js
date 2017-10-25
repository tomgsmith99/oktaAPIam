var config = require(__base + '.env.js');

var fs = require('fs');

var request = require('request');

module.exports = function (app) {

	app.get('/', function(req, res, next) {

		fs.readFile(__base + 'index.html', 'utf8', (error, webPage) => {
			if (error) { throw new Error(error) }
			else {

				console.log("the redirect_uri is: " + config.okta.redirect_uri);

				webPage = webPage.replace(/{{redirect_uri}}/g, config.okta.redirect_uri);

				res.send(webPage);
			}
		});
	});

	app.post('/introspect', function(req, res, next) {

		console.log("the request is: " + req);

		res.send("this is some data");

		// var email = req.body.firstName + "." + req.body.surName + getRandomInt(1, 10000) + "@mailinator.com";

		// const options = {
		// 	url: 'https://' + config.okta.reg.tenantName + '.' + config.okta.reg.domain + '/api/v1/users',
		// 	qs: { activate: 'true' },
		// 	method: 'POST',
		// 	headers: {
		// 			'cache-control': 'no-cache',
		// 			authorization: 'SSWS ' + config.okta.reg.api_key,
		// 			'content-type': 'application/json',
		// 			accept: 'application/json'
		// 	},
		// 	body: { profile: 
		// 			{ firstName: req.body.firstName,
		// 				lastName: req.body.surName,
		// 				email: email,
		// 				login: email
		// 			}
		// 	},
		// 	json: true
		// };

		// request(options, function (error, response, body) {
		// 	if (error) throw new Error(error);

		// 	res.send(JSON.stringify(body));

		// 	console.log(body);
		// });
	});
}