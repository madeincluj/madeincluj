MIC.CollectionLayer = {

	marker_template: 'tmpl-hex-photo-marker',
	item_template: 'tmpl-collection-item',

	metadata: {
		data_name: 'colectia-fortepan',
		name: 'Colecția de fotografie',
		description: 'Imagini din arhivă.',
		thumbnail_url: '',
		layers: [
			{
				data_name: 'colectia-fortepan',
				name: "Colecția Fortepan",
				description: 'Descriere',
				geojson_url: "../collection/fortepan/json/fortepan.json",
				img_base_url: "http://madeincluj.s3.amazonaws.com/s3/collection/fortepan/",
				thumb_dir: "thumb/",
				large_dir: "large/",
				original_dir: "original/"
			}, {
				data_name: 'fotografii-istorice',
				name: "Fotografii istorice",
				description: 'Descriere',
				geojson_url: "../collection/historical-photography/json/historical-photography.json",
				img_base_url: "http://madeincluj.s3.amazonaws.com/s3/collection/historical-photography/",
				thumb_dir: "thumb/",
				large_dir: "large/",
				original_dir: "original/"
			}
		],
		multiple: true
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

	// TODO: add to toggle control.
	initialize: function(map) {
		if (!this.initialized) {
			MIC.compileTemplate(this.marker_template);
			MIC.compileTemplate(this.item_template);
			this.map = map;
			for (var i = 0; i < this.metadata.layers.length; i++) {
				var collection = this.metadata.layers[i];
				collection.layer = new L.FeatureGroup();
				this.fetch(collection);
			}
			MIC.LayerToggle.addLayerGroup(this.metadata);
			this.initialized = true;
		}
		return this;
	},

	fetch: function(collection) {
		var xhr = $.getJSON(collection.geojson_url);
		var that = this;
		xhr.done(function(response) {
			if (response) that.load(collection, response);
		})
	},

	load: function(collection, json) {
		collection.json = json;
		collection.json.features.forEach(function(feature) {
			feature.properties.photo = {
				thumb: collection.img_base_url + collection.thumb_dir + feature.properties.id + '.jpg',
				large: collection.img_base_url + collection.large_dir + feature.properties.id + '.jpg',
				original: collection.img_base_url + collection.original_dir + feature.properties.id + '.jpg'
			};
		}, this);
		this.render(collection);
	},

	render: function(collection) {
		var markers = collection.json.features.map(function(feature) {
			var src = collection.img_base_url + collection.thumb_dir + feature.properties.id + '.jpg';
			var marker = L.photoMarker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
				src: src,
				size: [150, 150],
				smallestSizeZoom: 13,
				largestSizeZoom: 18,
				matrix: { 13: 0.2, 14: 0.25, 15: 0.30, 16: 0.45, 17: 0.7, 18: 0.9, 19: 1 },
				iconTemplate: this.marker_template
			});
			marker.feature = feature;
			return marker;
		}, this);
		markers.forEach(function(marker) {
			collection.layer.addLayer(marker);
		}, this);
		collection.layer.on('click', this.onclick, this);
	},

	onclick: function(e) {
		var feature = e.layer.feature;
		var html = MIC.handlebars_templates[this.item_template](feature);
		MIC.showPopup(html);
	}
};