module.exports = function(grunt) {
	grunt.initConfig({
		useminPrepare: {
			html: 'index.html'
		},

		yaml: {
			pictures: {
				files: [{
					expand: true,
					cwd: 'metadata/',
					src: ['*.yaml'],
					dest: 'json/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-yaml');
	grunt.registerTask('metadata', 'Compile picture metadata from YAML source', ['yaml:pictures']);
};