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
		$(document).on('keyup', this.escHandler);
	},

	escHandler: function(e) {
		if (e.keyCode === 27) {
			MIC.hidePopup();
			return false;
		}
	},

	hidePopup: function() {
		this.popup.hide();
		$(document).off('keyup', this.escHandler);
	},

	initialize: function() {
		this._initMap();
		this._initToggle();
		this._initLayers();
		this._initUI();
	},

	_initMap: function() {
		this.map = L.map('map', {
			center: [46.7684, 23.5919],
			zoom: 15,
			minZoom: 13,
			maxZoom: 20,
			maxBounds: new L.LatLngBounds([46.3,23], [47, 24]),
			scrollWheelZoom: false
		});

		var hash = L.hash(this.map);
	},

	_initToggle: function() {
		MIC.LayerToggle.initialize(this.map);
	},

	_initLayers: function() {
		var ggl = new L.Google('ROADMAP', {
			mapOptions: {
				styles: GMAPS_STYLES
			}
		});
		this.map.addLayer(ggl);

		var instaLayer = MIC.InstagramLayer.initialize(this.map).enable();
		var streetNamesLayer = MIC.StreetNamesLayer.initialize(this.map).enable();
		var historicalLayer = MIC.HistoricalMapsLayer.initialize(this.map).enable();
		var buildingPhotosLayer = MIC.BuildingPhotosLayer.initialize(this.map).enable();

		// var collectionLayer = MIC.CollectionLayer.initialize(this.map).enable();
	},

	_initUI: function() {
		$("#nav-time li a").on('click', function () {
			var year = $(this).attr('year');
			$(this).parent().siblings().removeClass('selected');
			$(this).parent().addClass('selected');
			MIC.HistoricalMapsLayer.loadMap(year);
		});

		var that = this;

		var popup = this.popup = $("#popup-container");
		this.popup.on('click', '.close-popup', function() {
			that.hidePopup();
			return false;
		}).on('click', '.item-gallery-thumbs img', function() {
			var src = $(this).data('large');
			var img = popup.find('.item-gallery-view img'); 
			img.fadeOut('fast', function() {
				img.attr('src', src);
				img.fadeIn('fast');
			});
		});
	}
};