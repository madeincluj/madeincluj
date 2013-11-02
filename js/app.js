var MIC = {
	handlebars_templates: [],

	compileTemplate: function (templateName) {
		if (!this.handlebars_templates[templateName]) {
			var str = document.getElementById(templateName).innerHTML;
			this.handlebars_templates[templateName] = Handlebars.compile(str);
		}
	},

	showPopup: function(content) {
		this.popup.show().find('.popup-content').html(content);
	},

	initialize: function() {


		var map = this.map = L.map('map', {
			center: [46.7684, 23.5919],
			zoom: 15,
			minZoom: 13,
			maxZoom: 20,
			maxBounds: new L.LatLngBounds([46.3,23], [47, 24])
		});
			
		var ggl = new L.Google('ROADMAP', {
			mapOptions: {
				styles: GMAPS_STYLES
			}
		});
		map.addLayer(ggl);	
		var hash = L.hash(map);

		// Layer toggle controls
		var historicalTiles = '../historical-maps/img/1869/{z}/{x}/{y}.png';
		var options = {
			minZoom: 13,
			maxZoom: 17,
			opacity: 0.7,
			tms: true
		};
		var historicalLayer = L.tileLayer(historicalTiles, options);
		var instaLayer = MIC.InstagramLayer.initialize(map).enable();
		var buildingPhotosLayer = MIC.BuildingPhotosLayer.initialize(map).enable();
		var streetNamesLayer = MIC.StreetNamesLayer.initialize(map).enable();

		var overlayMaps = {
			"Hărți istorice": historicalLayer,
    		"Instagram #madeincluj": instaLayer.featureGroup,
    		"Clădiri '60-'80": buildingPhotosLayer.featureGroup
			// add more layers here as they are integrated
		};

		L.control.layers(null, overlayMaps).addTo(map);


		var popup = this.popup = $("#popup-container");
		this.popup.on('click', '.close-popup', function() {
			popup.hide();
			return false;
		}).on('click', '.item-gallery-thumbs img', function() {
			var src = $(this).data('large');
			var img = popup.find('.item-gallery-view'); 
			img.fadeOut('fast', function() {
				img.attr('src', src);
				img.fadeIn('fast');
			});
		});
	}
};