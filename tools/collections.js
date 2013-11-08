// collections website generator

var ejs = require('ejs');
var slug = require('slug');
var fs = require('fs-extra');

var collections = {
	'fortepan' : {
		json: '../collection/fortepan/json/fortepan.json',
		img_base_url: 'http://madeincluj.s3.amazonaws.com/collection/fortepan/',
		original_path: 'original/',
		large_path: 'large/',
		thumb_path: 'thumb/',
		name: 'Colecția Fortepan'
	},
	'fotografii-istorice': {
		json: '../collection/historical-collection/json/historical-collection.json',
		img_base_url: 'http://madeincluj.s3.amazonaws.com/collection/historical-collection/',
		original_path: 'original/',
		large_path: 'large/',
		thumb_path: 'thumb/',
		name: 'Fotografie istorică',
		hide: true
	},
	'arhiva' : {
		json: '../collection/historical-photography/json/historical-photography.json',
		img_base_url: 'http://madeincluj.s3.amazonaws.com/collection/historical-photography/',
		original_path: 'original/',
		large_path: 'large/',
		thumb_path: 'thumb/',
		name: 'Arhiva de fotografie'
	}
};

var output_dir = 'obiective/colectie/';
var collection_tmpl_file = 'templates/collection.html';
var item_tmpl_file = 'templates/collection_item.html';
var collections_tmpl_file = 'templates/collections.html';

for (var slug in collections) {
	var collection = collections[slug];
	var json = JSON.parse(fs.readFileSync(collection.json, 'utf8'));
	var tmpl = fs.readFileSync(collection_tmpl_file, 'utf8');
	var item_tmpl = fs.readFileSync(item_tmpl_file, 'utf8');

	var item_tmpl_f = ejs.compile(item_tmpl, {
			filename: 'templates/collection_item.html',
	});

	var tmpl_f = ejs.compile(tmpl, {
		filename: 'templates/collection.html'
	});

	json.features.forEach(function(feature, idx, arr) {
		feature.properties.photo = {
			original: collection.img_base_url + collection.original_path + feature.properties.id + '.jpg',
			large: collection.img_base_url + collection.large_path + feature.properties.id + '.jpg',
			thumb: collection.img_base_url + collection.thumb_path + feature.properties.id + '.jpg'
		};

		var itemOutput = item_tmpl_f({
			feature: feature,
			collection: arr,
			index: idx,
			root: '../../../..'
		});

		fs.outputFile(output_dir + slug + '/' + feature.properties.id + '/index.html', itemOutput);
	});

	var output = tmpl_f({
		collection: json,
		root: '../../..'
	});
	fs.outputFile(output_dir + slug + '/index.html', output);
};

var collections_tmpl = fs.readFileSync(collections_tmpl_file, 'utf8');
var collections_tmpl_f = ejs.compile(collections_tmpl, {
	filename: collections_tmpl_file
});

var collections_output = collections_tmpl_f({
	collections: collections,
	root: '../..'
});

fs.outputFile(output_dir + 'index.html', collections_output);