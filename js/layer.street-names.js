MIC.StreetNamesLayer = {
	
	item_template: 'tmpl-street-name-item',
	geojson_url: '../street-names/json/selected-streets.json',

	metadata: {
		data_name: 'street-names',
		title: 'Istoria străzilor',
		description: 'Evoluția străzilor din Cluj-Napoca.',
		thumbnail_src: '',
	},

	geojson: null,

	loaded_streets: {},

	item_url: function(feature) {
		return '../street-names/json/metadata/' + feature.properties.id.replace('way/', '') + '.json';
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
			MIC.compileTemplate(this.item_template);
			this.initialized = true;
			this.fetch();
		}
		return this;
	},

	fetch: function() {
		var xhr = $.getJSON(this.geojson_url);
		var that = this;
		xhr.done(function(response) {
			if (response) that.load(response);
		})
		return xhr;
	},

	fetchItem: function(feature) {
		var url = this.item_url(feature);
		var xhr = $.getJSON(url);
		var that = this;
		xhr.done(function(response) {
			if (response) that.loadItem(feature, response);
		})
		return xhr;
	},

	loadItem: function(feature, json) {
		this.loaded_streets[feature.properties.id] = json;
	},

	load: function(json) {
		this.geojson = json;
		this.featureGroup = new L.D3geoJSON(this.geojson, {
			id: 'svg-streets',
			featureAttributes: {
				'class': function(feature) {
					return 'highway-' + feature.properties.highway;
				}
			},
			pointerEvents: 'visibleStroke'
		});

		var that = this;
		this.featureGroup.on('click', function(e) {
			var feature = e.data, xhr = that.fetchItem(feature);
			xhr.done(function(response) {
				if (response) that.showPopup(feature);
			});
		});
		MIC.LayerToggle.addLayer(this.featureGroup, this.metadata);
	},

	showPopup: function(feature) {
		var json = this.loaded_streets[feature.properties.id];
		var html = MIC.handlebars_templates[this.item_template](json);
		MIC.showPopup(html);
	}
};