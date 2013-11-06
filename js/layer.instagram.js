MIC.InstagramLayer = {
	client_id: '8622b4a74c4643bbb092478bb30b6c31',
	api_base: 'https://api.instagram.com/v1/',
	tag: 'madeincluj',

	metadata: {
		data_name: 'instagram',
		title: '#madeincluj',
		description: 'Concursul Instagram.',
		thumbnail_src: '',
	},

	photos: [],
	max_photos: 100,
	excluded: [],

	marker_template: 'tmpl-square-photo-marker',
	item_template: 'tmpl-instagram-item',
	locations: [],

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
			this.map = map;
			this.featureGroup = new L.FeatureGroup();
			MIC.LayerToggle.addLayer(this.featureGroup, this.metadata);
			this.fetch();
			this.initialized = true;
		}
		return this;
	},

	fetch: function() {
		this.fetchHardcoded();
		// this.fetchExclusions();
	},

	fetchExclusions: function() {
		var that = this;
		$.ajax({
			cache: false,
			url: 'json/instagram-excluded.json',
			dataType: 'json',
			error: function(value) {
				this.fetchInstagram();
			},
			success: function(resp) {
				that.excluded = resp;
				this.fetchInstagram();
			}
		});
	},

	url: function() {
		return this.api_base + 'tags/' + this.tag + '/media/recent?client_id=' + this.client_id + '&callback=?';
	},

	fetchInstagram: function() {
		var that = this;
		var xhr = $.getJSON(this.url());
		function responseHandler(response) {
			if (response) {
				if (response.data) {
					that.loadInstagram(response.data);
				}

				if (response.pagination && response.pagination.next_max_tag_id && that.photos.length < that.max_photos) {
					var xhr = $.getJSON(that.url() + "&max_tag_id=" + response.pagination.next_max_tag_id);
					xhr.done(responseHandler);
				}
			}
		}
		xhr.done(responseHandler);
	},

	fetchHardcoded: function() {
		var that = this;
		$.ajax({
			cache: false,
			url: 'json/hardcoded-pictures.json',
			dataType: 'json',
			success: function(resp) {
				var doSetTimeout = function(i) {
					setTimeout(function(){
						that.loadHardcoded(resp.slice(i, i+10));
					}, 0);
				};
				for (var i = 0; i < resp.length; i += 10 ) {
					doSetTimeout(i);
				}
			}
		});
	},

	loadInstagram: function(data) {
		var photos = data.filter(function(item) {
			return item.location && item.type === 'image' && this.excluded.indexOf(item.id) < 0;
		}, this).map(function(item) {
			var type = 'neutral';
			if (item.tags.indexOf('plus') > -1) {
				type = 'plus';
			} else if (item.tags.indexOf('minus') > -1) {
				type = 'minus';
			}
			return {
				user: {
					name: item.user ? item.user.full_name || item.user.username : 'Anonim',
					photo: item.user ? item.user.profile_picture : null,
					url: item.user.username ? "http://instagram.com/" + item.user.username : ''
				},
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

	loadHardcoded: function(data) {
		var photos = data.map(function(item) {
			return {
				user: {
					name: item.user.name ? item.user.name : 'Anonim',
					photo: item.user.photo ? item.user.photo : null,
					url:  item.user.url ? item.user.url : '#'
				},
				images: {
					thumbnail: {
						url: item.images.thumbnail ? item.images.thumbnail.url : item.images.standard_resolution.url,
						height: item.images.thumbnail ? item.images.thumbnail.height : 150,
						width: item.images.thumbnail ? item.images.thumbnail.width : 150
					},
					standard_resolution: item.images.standard_resolution
				},
				location: item.location,
				caption: item.caption
			};
		});
		this.renderItems(photos);
	},

	renderItems: function(photos) {

		var recomputeSize = function(photo) {
			var maxHeight = that.map._size.y - 100; // margins and such
			if (maxHeight < photo.height) {
				var proportion = maxHeight / photo.height;
				photo.height = maxHeight;
				photo.width = proportion * photo.width;
			}
		};

		// If two photos overlap, move one a bit to the right.
		var recomputeLocation = function(photo) {
			for (var i = 0; i < that.locations.length; i++) {
				var loc = that.locations[i];
				if (loc.latitude == photo.location.latitude && loc.longitude == photo.location.longitude) {
					photo.location.longitude = loc.longitude + 0.0006;
				}
			}
			that.locations.push (photo.location);
		};

		var that = this;
		photos.map(function(photo) {
			recomputeSize( photo.images.standard_resolution);
			recomputeLocation(photo);
			var popup = MIC.handlebars_templates[that.item_template](photo);
			var marker =  L.photoMarker([photo.location.latitude, photo.location.longitude], {
				src: photo.images.thumbnail.url,
				size: [photo.images.thumbnail.width, photo.images.thumbnail.height],
				smallestSizeZoom: 13,
				largestSizeZoom: 18,
				matrix: { 13: 0.125, 15: 0.25, 17: 0.5, 18: 0.75 },
				iconTemplate: that.marker_template
			}).bindPopup(popup, {maxWidth: "auto"});
			that.featureGroup.addLayer(marker);
		});
	}
};
