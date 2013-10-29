var fs = require('fs-extra');
var marked = require('marked');
var fm = require('yaml-front-matter');
var ejs = require('ejs');

var markdown_pages_dir = 'content/md/';
var html_pages_dir = 'content/html/';
var templates_dir = 'templates/';
var output_dir = 'site/';

var md_pages = fs.readdirSync(markdown_pages_dir);

marked.setOptions({
	gfm: true
});

md_pages.forEach(function(filepath) {
	var file = fs.readFileSync(markdown_pages_dir + filepath, 'utf8');
	var properties = fm.loadFront(file);
	var html = marked(properties.__content);

	var output = html;
	if (properties.template) {
		var tmpl = fs.readFileSync(templates_dir + properties.template, 'utf8');
		output = ejs.render(tmpl, {
			page: properties,
			content: html
		});
	}

	var slug = properties.slug || 'untitled'; // todo

	fs.outputFile(output_dir + slug + '/index.html', output);

});

var html_pages = fs.readdirSync(html_pages_dir);

html_pages.forEach(function(filepath) {
	var output_path = output_dir + filepath.replace('.html', '') + '/index.html';
	fs.copy(html_pages_dir + filepath, output_path);
});