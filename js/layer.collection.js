MIC.CollectionLayer = {

	item_template: 'tmpl-collection-item',

	collections: [
		{
			name: "Colecția Fortepan",
			geojson_url: "../collection/fortepan/json/fortepan.json",
			img_base_url: "../s3/collection/fortepan/",
			thumb_dir: "thumb/",
			large_dir: "large/",
			original_dir: "original/"
		}, 
		{
			name: "Fotografii istorice",
			geojson_url: "../collection/historical-photography/json/historical-photography.json",
			img_base_url: "../s3/collection/historical-photography/",
			thumb_dir: "thumb/",
			thumb_dir: "thumb/",
			large_dir: "large/",
			original_dir: "original/"
		}
	],

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
			MIC.compileTemplate(this.item_template);
			this.map = map;

			for (var i = 0; i < this.collections.length; i++) {
				var collection = this.collections[i];
				collection.layer = new L.FeatureGroup();
				this.fetch(collection);
				this.map.addLayer(collection.layer);
			}
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
		this.render(collection);
	},

	render: function(collection) {
		var markers = collection.json.features.map(function(feature) {
			var src = collection.img_base_url + collection.thumb_dir + feature.properties.id + '.jpg';
			var marker = L.photoMarker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
				src: src,
				size: [100, 100],
				smallestSizeZoom: 13,
				largestSizeZoom: 18
			});
			marker.feature = feature;
			return marker;
		}, this);
		markers.forEach(function(marker) {
			collection.layer.addLayer(marker);
		}, this);
		collection.layer.on('click', this.onclick, this);
	},

	onclick: function(e) {}
};