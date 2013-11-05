var FeatureMap = {

	enable: function(feature) {
		this._initFeature(feature);
		this._initMap();
		this._initBase();
		this._addFeature();
	},

	_initFeature: function(feature) {
		this.featureLayer = L.geoJson(feature);
		this.center = this.featureLayer.getBounds().getCenter();
	},

	_initMap: function() {
		this.map = L.map('map', {
			attributionControl :false,
			center: this.center,
			zoom: 14,
			minZoom: 13,
			maxZoom: 20,
			maxBounds: new L.LatLngBounds([46.3,23], [47, 24]),
		});
	},

	_initBase: function() {
		var ggl = new L.Google('ROADMAP');
		this.map.addLayer(ggl);
	},

	_addFeature: function() {
		this.featureLayer.addTo(this.map);
	}
}