module.exports = function(grunt) {
	grunt.initConfig({
		useminPrepare: {
			html: 'index.html'
		}
	});

	grunt.loadNpmTasks('grunt-usemin');
};