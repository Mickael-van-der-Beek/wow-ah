var AuctionSchema = require('./auction-schema');

var mongoose = require('mongoose');

module.exports = (function () {
	'use strict';

	AuctionSchema.statics.upsertFromApi = function (file, newAuction, callback) {
		this
			.findOne({
				'auction.id': newAuction.auc
			})
			.exec(function (e, oldAuction) {
				if (e) {
					return callback(e);
				}

				if (oldAuction) {
					return this.updateFromApi(file, oldAuction, callback);
				}

				this.createFromApi(file, newAuction, callback);
			}.bind(this));
	};

	AuctionSchema.statics.createFromApi = function (file, newAuction, callback) {
		var mod = new Date(file.modified);
		var time = mod.getHours() + ':' + mod.getMinutes() + ':' + mod.getSeconds();
		mod.setHours(0, 0, 0, 0);

		this({
			startFile: file.modified,
			startDate: mod,
			startTime: time,

			endFile: file.modified,
			endDate: mod,
			endTime: time,

			auction: {
				id: newAuction.auc
			},

			user: {
				realm: newAuction.ownerRealm,
				id: newAuction.owner
			},

			item: {
				quantity: newAuction.quantity,
				id: newAuction.item
			},

			buyout: {
				date: file.modified,
				value: newAuction.buyout
			},

			bid: {
				date: file.modified,
				value: newAuction.bid
			}
		})
		.save(function (e) {
			callback(e);
		});
	};

	AuctionSchema.statics.updateFromApi = function (file, oldAuction, callback) {
		var mod = new Date(file.modified);
		var time = mod.getHours() + ':' + mod.getMinutes() + ':' + mod.getSeconds();
		mod.setHours(0, 0, 0, 0);

		if (
			(mod < oldAuction.startDate) ||
			(mod === oldAuction.startDate || (time < oldAuction.startTime))
		) {
			oldAuction.startFile = file.modified;
			oldAuction.startDate = mod;
			oldAuction.startTime = time;
		}

		if (
			(mod > oldAuction.endDate) ||
			(mod === oldAuction.endDate || (time > oldAuction.endTime))
		) {
			oldAuction.endFile = file.modified;
			oldAuction.endDate = mod;
			oldAuction.endTime = time;
		}

		oldAuction.save(function (e) {
			callback(e);
		});
	};
})();

