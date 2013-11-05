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
				maxZoom: 17,
				opacity: 0.7,
				tms: true
			});

			var that = this;
			this.slider = new L.Control.Slider({
				id: 'opacity-slider',
				value: this.layer.options.opacity,
				slider: function(value) {
					value = value.toFixed(1);
					that.layer.setOpacity(value);
				}
			});

			var layerOnAdd = this.layer.onAdd;
			this.layer.onAdd = function(map) {
				layerOnAdd.apply(this, Array.prototype.slice.call(arguments));
				map.addControl(that.slider);
				if (this._url.length > 0) {
					$('#opacity-slider').show();
				} else {
					$('#opacity-slider').hide();
				}
			}

			var layerOnRemove = this.layer.onRemove;
			this.layer.onRemove = function(map) {
				layerOnRemove.apply(this, Array.prototype.slice.call(arguments));
				map.removeControl(that.slider);
			}

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
		var selectedYear = $("#nav-time li.selected a").first().attr('year');
		this.loadMap(selectedYear);
	},

	loadMap: function(year) {
		var map = this.maps.filter(function(map) {
			return map.year == year;
		})[0];

		if (map) {
			this.layer.setUrl(map.local_url);
			var mapBounds = new L.LatLngBounds(map.bounds[0], map.bounds[1]);
			this.layer.options.bounds = mapBounds;
			$('#opacity-slider').show();

		} else {
			this.layer.setUrl('');
			$('#opacity-slider').hide();
		}
	}
};