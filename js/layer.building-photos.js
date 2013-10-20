MIC.BuildingPhotosLayer = {
	marker_template: 'tmpl-building-photo-marker',
	enable: function() {
		this.initialize();
		this.enabled = true;
	},
	disable: function() {
		this.enabled = false;
	},
	initialize: function() {
		if (!this.initialized) {
			MIC.compileTemplate(this.marker_template);
			this.initialized = true;
		}
	}
};