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
		this._initMap();
		this._initLayers();
		this._initUI();	
	},

	_initMap: function() {
		this.map = L.map('map', {
			center: [46.7684, 23.5919],
			zoom: 15,
			minZoom: 13,
			maxZoom: 20,
			maxBounds: new L.LatLngBounds([46.3,23], [47, 24])
		});

		var hash = L.hash(this.map);
	},

	_initLayers: function() {
		var ggl = new L.Google('ROADMAP', {		
			mapOptions: {
				styles: GMAPS_STYLES
			}
		});
		this.map.addLayer(ggl);	

		var historicalLayer = MIC.HistoricalMapsLayer.initialize(this.map).enable();
		var instaLayer = MIC.InstagramLayer.initialize(this.map).enable();
		var buildingPhotosLayer = MIC.BuildingPhotosLayer.initialize(this.map).enable();
		var streetNamesLayer = MIC.StreetNamesLayer.initialize(this.map).enable();
		// var collectionLayer = MIC.CollectionLayer.initialize(this.map).enable();

		var overlayMaps = {
			"Hărți istorice": historicalLayer.layer,
			"Instagram #madeincluj": instaLayer.featureGroup,
			"Clădiri '60-'80": buildingPhotosLayer.featureGroup
			// add more layers here as they are integrated
		};

		L.control.layers(null, overlayMaps).addTo(this.map);
	},

	_initUI: function() {
		$("#nav-time li a").on('click', function () {
			var year = $(this).attr('year');
			$(this).parent().siblings().removeClass('selected');
			$(this).parent().addClass('selected');
			MIC.HistoricalMapsLayer.loadMap(year);
		});

		var popup = this.popup = $("#popup-container");
		this.popup.on('click', '.close-popup', function() {
			popup.hide();
			return false;
		}).on('click', '.item-gallery-thumbs img', function() {
			var src = $(this).data('large');
			var img = popup.find('.item-gallery-view img'); 
			img.fadeOut('fast', function() {
				img.attr('src', src);
				img.fadeIn('fast');
			});
		});

		var layerBtn = $("#nav-layers"), layerNav = $("#layers");
		layerBtn.on('click', function() {
			layerNav.toggle();
		});
	}
};