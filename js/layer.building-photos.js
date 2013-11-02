MIC.BuildingPhotosLayer = {
	
	marker_template: 'tmpl-building-photo-marker',
	item_template: 'tmpl-building-item',

	geojson_url: '../collection/dg/json/buildings.json',
	img_base_url: '../colleciton/dg/img/',
	
	item_url : function(feature) {
		return '../collection/dg/json/metadata/' + feature.properties.id.replace('way/', '') + '.json';
	},

	geojson: null,
	loaded_buildings: {},

	map: null,

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
			MIC.compileTemplate(this.marker_template);
			MIC.compileTemplate(this.item_template);
			this.map = map;
			this.featureGroup = new L.FeatureGroup();
			this.initialized = true;
			this.fetch();
		}
		return this;
	},

	fetch: function() {
		var that = this;
		var xhr = $.getJSON(this.geojson_url);
		xhr.done(function(response) {
			if (response) that.load(response);
		});
		return xhr;
	},

	fetchItem: function(feature) {
		var xhr = $.getJSON(this.item_url(feature));
		var that = this;
		xhr.done(function(response) {
			if (response) that.loadItem(feature, response);
		});
		return xhr;
	},

	load: function(json) {
		this.geojson = json;
		this.render();
	},

	loadItem: function(feature, json) {
		this.loaded_buildings[feature.properties.id] = json;
	},

	render: function() {
		var markers = this.geojson.features.map(function(feature) {
			return L.geoJson(feature);
		});
		markers.forEach(function(marker) {
			this.featureGroup.addLayer(marker);
		}, this);
		this.featureGroup.on('click', this.onclick, this);
	},

	onclick: function(e) {
		console.log(arguments);
		var feature = e.layer.feature;
		var xhr = this.fetchItem(feature);
		var that = this;
		xhr.done(function() {
			that.showPopup(feature);
		});
	},

	showPopup: function(feature) {
		var json = this.loaded_buildings[feature.properties.id];
		var html = MIC.handlebars_templates[this.item_template](json);
		var popup = L.popup(html, {
			maxWidth: 'auto'
		});
		popup.addTo(this.map);
	}

};