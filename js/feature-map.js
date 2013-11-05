var FeatureMap = {

	enable: function(feature) {
		this._initFeature(feature);
		this._initMap();
		this._initBase();
		this._addFeature();
	},

	_initFeature: function(feature) {
		this.featureLayer = L.geoJson(feature);
		this.bounds = this.featureLayer.getBounds();
		this.center = this.bounds.getCenter();
	},

	_initMap: function() {
		this.map = L.map('map', {
			attributionControl :false,
			center: this.center,
			zoom: 14,
			minZoom: 13,
			maxZoom: 20,
			maxBounds: new L.LatLngBounds([46.3,23], [47, 24]),
		}).fitBounds(this.bounds);
	},

	_initBase: function() {
		var ggl = new L.Google('ROADMAP', {
			mapOptions: {
				backgroundColor: '#ffffff',
				styles: [
				  {
				    "featureType": "all",
				    "elementType": "all",
				    "stylers": [
				      {
				        "hue": "#2DB5E2"
				      },
				      {
				        "saturation": "-20"
				      }
				    ]
				  },
				  {
				    "featureType": "all",
				    "elementType": "labels",
				    "stylers": [
				      {
				        "visibility": "off"
				      }
				    ]
				  },
				  {
				    "featureType": "road",
				    "elementType": "geometry",
				    "stylers": [
				      {
				        "lightness": "100"
				      },
				      {
				        "visibility": "simplified"
				      }
				    ]
				  }
				]
			}
		});
		this.map.addLayer(ggl);
	},

	_addFeature: function() {
		this.featureLayer.addTo(this.map);
	}
}