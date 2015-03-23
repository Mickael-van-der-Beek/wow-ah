var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		wid: {
			type: 'String'
		},

		username: {
			type: 'String'
		},

		realm: {
			type: 'String'
		}
	});
})();