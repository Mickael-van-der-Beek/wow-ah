var Database = require('../../database/database');

var colog = require('colog');

module.exports = function (app) {
	'use strict';

	var apiVersion = app.get('version');
	colog.success('\t[\u2714] Items');

	/**
	 * Similarity
	 */

	app
	.route('/' + apiVersion + '/item:id')
	.post(
		function (req, res) {
			var startDate = req.query.startDate || new Date('2015-01-01');
			var endDate = req.query.endDate || new Date();
			var itemId = req.params.id;

			Database.db
				.model('Auction')
				.aggregate([
					{
						$match: {
							'item.id': itemId
						}
					},
					{
						$group: {
							_id: 'startDate'
						}
					}
				], function (e, results) {
					if (e) {
						return res
							.type('json')
							.status(500)
							.end();
					}

					res
						.type('json')
						.status(200)
						.end(results);
				});
		}
	);

};