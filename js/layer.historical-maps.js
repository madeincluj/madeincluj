MIC.HistoricalMapsLayer = {

	use_local_maps: true,
	maps: {},
	data_url: '../historical-maps/json/maps.json',

	metadata: {
		name: 'Hărți istorice',
		description: 'Documente vechi suprapuse peste harta actuală',
		thumbnail_url: '',
		multiple: false
	},

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
			this.fetch();
			this.initialized = true;
		}
		return this;
	},

	_initLayer: function(data) {
		var url = this.use_local_maps ? data.local_url : data.s3_url;
		var layer = L.tileLayer(url, {
			minZoom: 13,
			maxZoom: 17,
			opacity: 0.7,
			tms: true,
			bounds: new L.LatLngBounds(data.bounds[0], data.bounds[1])
		});

		var slider = this._initSlider(layer);

		var layerOnAdd = layer.onAdd;
		layer.onAdd = function(map) {
			layerOnAdd.apply(this, Array.prototype.slice.call(arguments));
			map.addControl(slider);
			if (this._url.length > 0) {
				$('#opacity-slider').show();
			} else {
				$('#opacity-slider').hide();
			}
		};

		var layerOnRemove = layer.onRemove;
		layer.onRemove = function(map) {
			layerOnRemove.apply(this, Array.prototype.slice.call(arguments));
			map.removeControl(slider);
		};

		return layer;
	},

	_initSlider: function(layer) {
		var slider = new L.Control.Slider({
			id: 'opacity-slider',
			value: layer.options.opacity,
			slider: function(value) {
				value = value.toFixed(1);
				layer.setOpacity(value);
			}
		});
		return slider;
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
		this.metadata.layers = data.maps;
		for (var i = 0; i < this.metadata.layers.length; i++) {
			var historicalMap = this.metadata.layers[i];
			historicalMap.layer = this._initLayer(historicalMap);
		}
		if (this.metadata.layers[0]) {
			this.metadata.data_name = this.metadata.layers[0].data_name;
		}
		MIC.LayerToggle.addLayerGroup(this.metadata);
	}

	// load: function(data) {
	// 	this.maps = data.maps;
	// 	var selectedYear = $("#nav-time li.selected a").first().attr('data-year');
	// 	this.loadMap(selectedYear);
	// },

	// loadMap: function(year) {
	// 	var map = this.maps.filter(function(map) {
	// 		return map.data_name == year + '-map';
	// 	})[0];

	// 	if (map) {
	// 		if (this.use_local_maps) {
	// 			this.layer.setUrl(map.local_url);
	// 		} else {
	// 			this.layer.setUrl(map.s3_url);
	// 		}
	// 		var mapBounds = new L.LatLngBounds(map.bounds[0], map.bounds[1]);
	// 		this.layer.options.bounds = mapBounds;
	// 		$('#opacity-slider').show();

	// 	} else {
	// 		this.layer.setUrl('');
	// 		$('#opacity-slider').hide();
	// 	}
	// }
};