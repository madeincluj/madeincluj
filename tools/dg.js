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

var jsons = fs.readdirSync(json_dir);
var tmpl = fs.readFileSync(template, 'utf8');

fs.removeSync(output_dir);

jsons.forEach(function(filepath) {
	var json = JSON.parse(fs.readFileSync(json_dir + filepath), 'utf8');
	var output = ejs.render(tmpl, {
		building: json
	});
	var slug_path = slug(json.name || json.id.replace('way/', '')).toLowerCase();
	var output_path = output_dir + slug_path + '/index.html';
	fs.outputFile(output_path, output);
});