var express = require('express');
var http = require('http');
var path = require('path');

var colog = require('colog');

module.exports = (function () {
	'use strict';

	function Webserver () {}

	Webserver.prototype.init = function (config) {
		config  = config || {};

		http.globalAgent.maxSockets = 100;

		this.app = express();
		this.server = http.createServer(this.app);

		this.app.set('env', global.NODE_ENV);
		this.app.set('port', config.port);
		this.app.set('version', config.version);
		this.app.set('protocol', config.protocol);
		this.app.set('hostname', config.hostname);
		this.app.set('indexPath', config.indexPath);
		this.app.set('staticPath', config.staticPath);

		this.app.set('query parser', 'extended');
		this.app.disable('x-powered-by');
		this.app.enable('strict routing');
		this.app.enable('case sensitive routing');
	};

	Webserver.prototype.listen = function (callback) {
		var port = this.app.get('port');

		colog.success('[\u2714] Webserver listening on port ' + port);

		this.server
			.listen(port)
			.on('error', callback)
			.on('listening', callback);
	};

	Webserver.prototype.importControllers = function (controllersPath) {
		require(path.resolve(__dirname, controllersPath))(this.app);
	};

	Webserver.prototype.importStatics = function () {
		var staticPath = path.resolve(__dirname, this.app.get('staticPath'));
		var indexPath = path.resolve(__dirname, this.app.get('indexPath'));

		this.app.use(
			express.static(staticPath, {
				dotfiles: 'deny'
			})
		);

		this.app.get('*', function (req, res) {
			res.status(200).sendFile(indexPath);
		});
	};

	return new Webserver();
})();
