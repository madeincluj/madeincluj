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
		MIC._initPopupGallery();
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
		this._init3DLink();
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
		var collectionLayer = MIC.CollectionLayer.initialize(this.map).enable();
		var monumentsLayer = MIC.MonumentsLayer.initialize(this.map).enable();
	},

	_initUI: function() {
		this._initTimeSpans();
		this._init3DLink();
		this._initPopups();
	},

	_initTimeSpans: function() {
		$("#nav-time li a").on('click', function () {
			var year = $(this).attr('data-year');
			$(this).parent().siblings().removeClass('selected');
			$(this).parent().addClass('selected');
			MIC.HistoricalMapsLayer.loadMap(year);
		});
	},

	_init3DLink: function() {
		if (!window.WebGLRenderingContext) {
			$('#nav-3d').addClass('disabled');
		}
	},

	_initPopups: function() {

		moveToItem = function(from_item, to_item) {
			var gallery_prev = that.popup.find('.gallery-prev');
			var gallery_next = that.popup.find('.gallery-next');

			if (from_item.hasClass('first')) {
				gallery_prev.css('z-index', 100)

			} else if (to_item.hasClass('first')) {
				gallery_prev.css('z-index', 0)
			}

			if (from_item.hasClass('last')) {
				gallery_next.css('z-index', 100)

			} else if (to_item.hasClass('last')) {
				gallery_next.css('z-index', 0)
			}

			from_item.removeClass('active');
			to_item.addClass('active');

			var position = to_item.position().left;
			if (!to_item.hasClass('first')) {
				position -= gallery_prev.width()
			}

			var gallery = that.popup.find('.gallery');
			gallery.animate({left: -position});
		}

		var that = this;
		var popup = this.popup = $("#popup-container");

		this.popup.on('click', '.close-popup', function() {
			that.hidePopup();
			return false;

		}).on('click', '.gallery-prev', function() {
			var from = $(that.popup).find('.gallery-item.active');
			var to = from.prev();
			moveToItem(from, to);

		}).on('click', '.gallery-next', function() {
			var from = $(that.popup).find('.gallery-item.active');
			var to = from.next();
			moveToItem(from, to);

		}).on('click', '.item-gallery-thumbs span', function() {
			var src = $(this).data('large');
			var img = popup.find('.item-gallery-view').css('background-image', 'url(' + src + ')');
		});
	},

	_initPopupGallery: function() {
		// Set max-width of gallery images.
		var width = this.popup.width();
		// Information area should be 30%
		this.popup.find('.gallery-item.item-info').css('width', width * 0.3);
		// Images should not expand more than 70%. Panoramas should not overflow this width.
		this.popup.find('.gallery-item.item-image').css('maxWidth', width * 0.7);

		// Initialize css helper classes.
		this.popup.find('.gallery-item:first').addClass('first active');
		this.popup.find('.gallery-item:last').addClass('last');

		var gallery = this.popup.find('.gallery');
		var item_images = gallery.find('.gallery-item.item-image:not(:has(img))')

		item_images.each(function() {
			var that = this;
			$('<img>').load(function(e) {
				gallery.width(gallery.width() + this.width)
				$(this).appendTo(that);
			}).attr('src', $(this).attr('data-src'));
		})
	}
};