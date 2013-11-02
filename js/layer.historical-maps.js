MIC.HistoricalMapsLayer = {
	enable: function() {
		this.initialize();
		this.enabled = true;
		return this;
	},
	disable: function() {
		this.enabled = false;
		return this;
	},
	initialize: function(map) {
		if (!this.initialized) {
			this.map = map;
			this.initialized = true;
		}
		return this;
	}
};