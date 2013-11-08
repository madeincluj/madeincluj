var ejs = require('ejs');
var slug = require('slug');
var fs = require('fs-extra');

slug.charmap['ș'] = 's';
slug.charmap['ț'] = 't';
slug.charmap['ă'] = 'a';
slug.charmap['â'] = 'a';
slug.charmap['î'] = 'i';

var json_dir = '../collection/monuments/json/metadata/';
var output_dir = 'obiective/monumente/';
var template = 'templates/monument.html';

// var img_base_url = '../s3/collection/dg/';
var img_base_url = 'http://madeincluj.s3.amazonaws.com/collection/monuments/';
var thumb_dir = 'thumb/';
var large_dir = 'large/';
var original_dir = 'original/';

var geojson = JSON.parse(fs.readFileSync('../collection/monuments/json/monuments.json'));

var jsons = fs.readdirSync(json_dir);
var tmpl = fs.readFileSync(template, 'utf8');

var tmpl_f = ejs.compile(tmpl, {
	filename: template
});

fs.removeSync(output_dir);

var collection = [];

jsons.forEach(function(filepath) {
	var json = JSON.parse(fs.readFileSync(json_dir + filepath), 'utf8');
	json.id = json.slug;
	var feature = geojson.features.filter(function(feature) {
		return feature.properties.id = json.id;
	})[0];

	json.description.ro = '<p>\n' + json.description.ro.replace(/(\r?\n)+/gm, '</p>\n<p>') + '</p>'; 

	json.photos = (json.photos || []).map(function(photo) { 
		return {
			thumb: img_base_url + thumb_dir + json.id  + '/' + photo,
			large: img_base_url + large_dir + json.id  + '/'  + photo,
			original: img_base_url + original_dir + json.id  + '/'  + photo
		}
	});
	
	collection.push(json);

	var output = tmpl_f({
		building: json,
		feature: feature,
		root: '../../..'
	});
	var slug_path = json.slug || slug(json.name || json.id).toLowerCase();
	var output_path = output_dir + slug_path + '/index.html';
	fs.outputFile(output_path, output);
});

var building_index_template = 'templates/monument-index.html';
var building_index_tmpl = fs.readFileSync(building_index_template, 'utf8');
var building_index_tmpl_f = ejs.compile(building_index_tmpl, {
	filename: building_index_template
});

var index = building_index_tmpl_f({
	collection: collection.sort(function(a, b) {
		if (a.name > b.name) return 1;
		if (b.name > a.name) return -1;
		return 0;
	}),
	root: '../..'
});

fs.outputFile(output_dir + '/index.html', index);