var colog = require('colog');

module.exports = function (app) {
	'use strict';

	colog.success('[\u2714] Webserver Controllers:');

	require('./items')(app);

};
