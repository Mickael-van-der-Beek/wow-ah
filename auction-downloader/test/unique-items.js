var path = require('path');
var fs = require('fs');

function dumpUniqueItemIds (items) {
	fs.writeFile(
		// path.resolve(__dirname, 'unique-items-dump.csv'),
		path.resolve(__dirname, 'unique-items-dump2.csv'),
		Object.keys(items).join('\n'),
		'utf8',
		function (e) {
			if (e) {
				throw e;
			}

			throw 'done!';
		}
	);
}

function processFile (filepaths, items, i) {
	if (filepaths.length === i) {
		return dumpUniqueItemIds(items);
	}

	fs.readFile(
		filepaths[i],
		'utf8',
		function (e, json) {
			if (e) {
				throw e;
			}

			var stats = {
				total: 0,
				inserts: 0
			};

			var itemRegexp = /(?:"item":)([0-9]+)(?:,)/g;
			var itemId;
			var item;

			while ((item = itemRegexp.exec(json)) !== null) {
				itemId = item[1];

				if (!itemId) {
					throw 'undefined itemid ' + itemId;
				}

				stats.total += 1;

				if (!(itemId in items)) {
					stats.inserts += 1;
					items[itemId] = null;
				}
			}

			console.log('\nprogress=', (i / (filepaths.length / 100)), '%');
			console.log('filename=', path.basename(filepaths[i]));
			console.log('inserts_perc=', (stats.inserts / (stats.total / 100)), '%');
			console.log('uniques=', stats.inserts);

			processFile(filepaths, items, i + 1);
		}
	);
}

function processDirectory (dirname) {
	fs.readdir(
		dirname,
		function (e, filenames) {
			if (e) {
				throw e;
			}

			var filepaths = filenames
				.map(function (filename) {
					return path.resolve(dirname, filename);
				});

			processFile(filepaths, {}, 0);
		}
	);
}

processDirectory('/Users/kollektiv/Documents/wow-ah/merged');
