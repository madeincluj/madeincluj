MIC.HistoricalMapsLayer = {

	tiles_url: '../historical-maps/img/1869/{z}/{x}/{y}.png',

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
			this.layer = L.tileLayer(this.tiles_url, {
				minZoom: 13,
				maxZoom: 17,
				opacity: 0.7,
				tms: true
			});
			this.initialized = true;
		}
		return this;
	}
};