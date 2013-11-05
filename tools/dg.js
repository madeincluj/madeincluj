var ejs = require('ejs');
var slug = require('slug');
var fs = require('fs-extra');

slug.charmap['ș'] = 's';
slug.charmap['ț'] = 't';
slug.charmap['ă'] = 'a';
slug.charmap['â'] = 'a';
slug.charmap['î'] = 'i';

var json_dir = '../collection/dg/json/metadata/';
var output_dir = 'site/cladiri/';
var template = 'templates/building.html';

var img_base_url = '../s3/collection/dg/';
var thumb_dir = 'thumb/';
var large_dir = 'large/';
var original_dir = 'original/';

var geojson = JSON.parse(fs.readFileSync('../collection/dg/json/dg.json'));

var jsons = fs.readdirSync(json_dir);
var tmpl = fs.readFileSync(template, 'utf8');

var tmpl_f = ejs.compile(tmpl, {
	filename: template
});

fs.removeSync(output_dir);

jsons.forEach(function(filepath) {
	var json = JSON.parse(fs.readFileSync(json_dir + filepath), 'utf8');
	var feature = geojson.features.filter(function(feature) {
		return feature.properties.id = 'way/' + json.id;
	})[0];

	json.photos = json.photos.map(function(photo) { 
		return {
			thumb: img_base_url + thumb_dir + photo,
			large: img_base_url + large_dir + photo,
			original: img_base_url + original_dir + photo
		}
	});

	var output = tmpl_f({
		building: json,
		feature: feature,
		root: '../../..'
	});
	var slug_path = json.slug || slug(json.name || json.id.replace('way/', '')).toLowerCase();
	var output_path = output_dir + slug_path + '/index.html';
	fs.outputFile(output_path, output);
});