var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		startDate: {
			type: 'Date'
		},
		startTime: {
			type: 'String'
		},

		endDate: {
			type: 'Date'
		},
		endTime: {
			type: 'String'
		},

		auction: {
			id: {
				type: 'String',
				index: {
					unique: true
				}
			}
		},

		user: {
			realm: {
				type: 'String'
			},
			id: {
				type: 'String'
			}
		},

		item: {
			quantity: {
				type: 'Number'
			},
			id: {
				type: 'String'
			}
		},

		buyout: {
			date: {
				type: 'Date'
			},
			value: {
				type: 'Number'
			}
		},

		bid: {
			date: {
				type: 'Date'
			},
			value: {
				type: 'Number'
			}
		}
	});
})();
