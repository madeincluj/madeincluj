MIC.InstagramLayer = {
	client_id: '8622b4a74c4643bbb092478bb30b6c31',
	api_base: 'https://api.instagram.com/v1/',
	tag: 'madeincluj',

	photos: [],
	max_photos: 30,

	marker_template: 'tmpl-instagram-marker',
	item_template: 'tmpl-instagram-item',

	enable: function() {
		this.enabled = true;
		this.initialize(); 
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
      		this.featureGroup = new L.FeatureGroup();
			this.map = map;
			this.fetch();
			this.initialized = true;
		}
		return this;
	},

	url: function() {
		return this.api_base + 'tags/' + this.tag + '/media/recent?client_id=' + this.client_id + '&callback=?';
	},

	fetch: function() {
		var that = this;
		var xhr = $.getJSON(this.url());
		function responseHandler(response) {
			if (response) {
				if (response.data) {
					that.load(response.data);
				}

				if (response.pagination && response.pagination.next_max_tag_id && that.photos.length < that.max_photos) {
					var xhr = $.getJSON(that.url() + "&max_tag_id=" + response.pagination.next_max_tag_id);
					xhr.done(responseHandler);
				}
			}
		}
		xhr.done(responseHandler);
	},

	load: function(data) {
		var photos = data.filter(function(item) {
			return item.location && item.type === 'image';
		}).map(function(item) {
			var type = 'neutral';
			if (item.tags.indexOf('plus') > -1) {
				type = 'plus';
			} else if (item.tags.indexOf('minus') > -1) {
				type = 'minus';
			}
			return {
				user_name: item.user ? item.user.full_name || item.user.username : 'Anonim',
				user_photo: item.user ? item.user.profile_picture : null,
				images: item.images,
				link: item.link, 
				location: item.location,
				type: type,
				created: item.created_time ? new Date(item.created_time * 1000) : null,
				caption: item.caption && item.caption.text ? item.caption.text : ''
			};
		});
		this.photos = this.photos.concat(photos);
		if (this.enabled) {
			this.renderItems(photos);
		}
	},

	renderItems: function(photos) {

		recomputeSize = function(photo) {
			// remove additional pixels for margins and such
			var maxHeight = that.map._size.y - 100;
			if (maxHeight < photo.height) {
				// photos are squares
				photo.height = maxHeight;
				photo.width = maxHeight;
			}
		}

		var that = this;

		photos.map(function(photo) {
			recomputeSize( photo.images.standard_resolution);
			var popup = MIC.handlebars_templates[that.item_template](photo);
			var marker =  L.photoMarker([photo.location.latitude, photo.location.longitude], {
				src: photo.images.thumbnail.url,
				size: [photo.images.thumbnail.width, photo.images.thumbnail.height],
				smallestSizeZoom: 13,
				largestSizeZoom: 18,
				matrix: { 13: 0.125, 15: 0.25, 17: 0.5, 18: 0.75 }
			}).bindPopup(popup, {maxWidth: "auto"});
			that.featureGroup.addLayer(marker);
		});

		// TODO: Group should not be added to map from here.
		this.featureGroup.addTo(this.map);
	}

};
