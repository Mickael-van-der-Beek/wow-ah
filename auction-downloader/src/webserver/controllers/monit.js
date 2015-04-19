var colog = require('colog');

module.exports = function (app) {
	'use strict';

	colog.success('\t[\u2714] Monit (AWS)');

	/**
	 * Monit ping controller
	 */

	app
	.route('/')
	.get(
		function (req, res) {
			res.status(200).end();
		}
	);

};
