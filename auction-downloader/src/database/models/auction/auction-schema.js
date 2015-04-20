var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	return new (mongoose.Schema)({
		startFile: {
			type: 'Date'
		},
		startDate: {
			type: 'Date'
		},
		startTime: {
			type: 'String'
		},

		endFile: {
			type: 'Date'
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
				type: 'String',
				index: true
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
