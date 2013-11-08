var ejs = require('ejs');
var slug = require('slug');
var fs = require('fs-extra');

slug.charmap['ș'] = 's';
slug.charmap['ț'] = 't';
slug.charmap['ă'] = 'a';
slug.charmap['â'] = 'a';
slug.charmap['î'] = 'i';

var streets_json_dir = '../street-names/json/metadata/';
var output_dir = 'obiective/strazi/';
var template = 'templates/street.html';
var geojson = JSON.parse(fs.readFileSync('../street-names/json/selected-streets.json', 'utf8'));

var img_base_url = 'http://madeincluj.s3.amazonaws.com/collection/historical-photography/';
var thumb_dir = 'thumb/';
var large_dir = 'large/';
var original_dir = 'original/';

var jsons = fs.readdirSync(streets_json_dir);
var tmpl = fs.readFileSync(template, 'utf8');
var tmpl_f = ejs.compile(tmpl, {
	filename: template
})

fs.removeSync(output_dir);

var collection = [];

jsons.forEach(function(filepath) {
	var json = JSON.parse(fs.readFileSync(streets_json_dir + filepath), 'utf8');
	var feature = geojson.features.filter(function(feature) {
		return feature.properties.id === 'way/' + json.id;
	})[0];

	json.photos = [];

	if (json.media) {
		if (json.media['historical-photography']) {
			json.photos = json.photos.concat(json.media['historical-photography'].map(function (photoId) {
				return {
					thumb: img_base_url + thumb_dir + photoId + '.jpg',
					large: img_base_url + large_dir + photoId + '.jpg',
					original: img_base_url + original_dir + photoId + '.jpg'
				}
			}));
		}
	}

	collection.push(json);

	try {
		var output = tmpl_f({
			street: json,
			feature: feature,
			root: '../../..'
		});
	} catch (e) {
		output = '';
	}
	var slug_path = json.slug || slug(json.name.ro || json.name || json.id.replace('way/', '')).toLowerCase();
	var output_path = output_dir + slug_path + '/index.html';
	fs.outputFile(output_path, output);
});

var street_index_template = 'templates/street-index.html';
var street_index_tmpl = fs.readFileSync(street_index_template, 'utf8');
var street_index_tmpl_f = ejs.compile(street_index_tmpl, {
	filename: street_index_template
});

var index = street_index_tmpl_f({
	collection: collection.sort(function(a, b) {
		if (a.name > b.name) return 1;
		if (b.name > a.name) return -1;
		return 0;
	}),
	root: '../..'
});

fs.outputFile(output_dir + '/index.html', index);