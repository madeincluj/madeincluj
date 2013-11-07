var fs = require('fs-extra');
var request = require('request');

var instajson = JSON.parse(fs.readFileSync('json/hardcoded-pictures.json', 'utf8'));
var output_dir = './img/contest/';

var download = function(url, filename) {
	request(url).pipe(fs.createWriteStream(filename));
}

for (var i = 0; i < instajson.length; i++) { 
    var url = instajson[i].images.standard_resolution.url;
    console.log('downloading: ' + url);
	download(url, output_dir + i + '.png');
}
