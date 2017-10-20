var fs = require('fs');

module.exports = function (app) {

	app.get('/', function(req, res, next) {

		fs.readFile(__base + 'index.html', 'utf8', (error, webPage) => {
			if (error) { throw new Error(error) }
			else {
				res.send(webPage);
			}
		});
	});
}