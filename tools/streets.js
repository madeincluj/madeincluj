var ejs = require('ejs');
var slug = require('slug');
var fs = require('fs-extra');

slug.charmap['ș'] = 's';
slug.charmap['ț'] = 't';
slug.charmap['ă'] = 'a';
slug.charmap['â'] = 'a';
slug.charmap['î'] = 'i';

var streets_json_dir = '../street-names/json/metadata/';
var output_dir = 'site/strazi/';
var template = 'templates/street.html';

var jsons = fs.readdirSync(streets_json_dir);
var tmpl = fs.readFileSync(template, 'utf8');

fs.removeSync(output_dir);

jsons.forEach(function(filepath) {
	var json = JSON.parse(fs.readFileSync(streets_json_dir + filepath), 'utf8');
	console.log(json);
	try {
		var output = ejs.render(tmpl, {
			street: json
		});
	} catch (e) {
		output = '';
	}
	var slug_path = json.slug || slug(json.name.ro || json.name || json.id.replace('way/', '')).toLowerCase();
	var output_path = output_dir + slug_path + '/index.html';
	fs.outputFile(output_path, output);
});