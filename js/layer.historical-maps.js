MIC.HistoricalMapsLayer = {

	maps: {},
	data_url: '../historical-maps/json/maps.json',

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
			this.layer = L.tileLayer('', {
				minZoom: 13,
				maxZoom: 20,
				opacity: 0.7,
				tms: true
			});
			// TOOD: init opacity & time sliders
			// this.slider = new L.Control.Slider({
			// 	value: this.layer.options.opacity,
			// 	slider: function(value) {
			// 		value = value.toFixed(1);
			// 		this.layer.setOpacity(value);
			// 	}
			// });
			// map.addControl(control);
			this.fetch();
			this.initialized = true;
		}
		return this;
	},

	fetch: function() {
		var xhr = $.getJSON(this.data_url);
		var that = this;
		xhr.done(function(response) {
			if (response) that.load(response);
		})
		return xhr;
	},

	load: function(data) {
		this.maps = data.maps;
		this.loadMap(data.default);
	},

	loadMap: function(id) {
		var map = this.maps.filter(function(map) {
			return map.id == id;
		})[0];
		var mapBounds = new L.LatLngBounds(map.bounds[0], map.bounds[1]);
		this.layer.setUrl(map.local_url);
		this.layer.options.bounds = mapBounds;
	}

};