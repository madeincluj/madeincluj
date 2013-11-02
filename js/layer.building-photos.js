MIC.BuildingPhotosLayer = {
	
	marker_template: 'tmpl-building-photo-marker',
	item_template: 'tmpl-building-item',

	geojson_url: '../collection/dg/json/buildings.json',
	img_base_url: '../s3/collection/dg/',
	thumb_dir: 'thumb/',
	large_dir: 'large/',
	original_dir: 'original/',
	
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
		var id = json.id;
		json.photos = json.photos.map(function(photo) {
			return {
				thumb: this.img_base_url + this.thumb_dir + id + '/' + photo,
				large: this.img_base_url + this.large_dir + id + '/' + photo,
				original: this.img_base_url + this.original_dir + id + '/' + photo
			};
		}, this);
	},

	render: function() {
		var markers = this.geojson.features.map(function(feature) {
			var src = this.img_base_url + this.thumb_dir + feature.properties.id.replace('way/', '') + '/0.jpg';
			var marker = L.photoMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
				src: src,
				size: [100, 100],
				smallestSizeZoom: 13,
				largestSizeZoom: 18
			});
			marker.feature = feature;
			return marker;
		}, this);
		markers.forEach(function(marker) {
			this.featureGroup.addLayer(marker);
		}, this);
		this.featureGroup.on('click', this.onclick, this);
	},

	onclick: function(e) {
		var xhr = this.fetchItem(e.layer.feature);
		var that = this;
		xhr.done(function() {
			that.showPopup(e);
		});
	},

	showPopup: function(e) {
		var feature = e.layer.feature;
		var json = this.loaded_buildings[feature.properties.id];
		var html = MIC.handlebars_templates[this.item_template](json);
		MIC.showPopup(html);
	}

};