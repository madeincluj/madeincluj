MIC.InstagramLayer = {
	client_id: '8622b4a74c4643bbb092478bb30b6c31',
	api_base: 'https://api.instagram.com/v1/',
	tag: 'cluj',

	photos: [],
	max_photos: 30,

	marker_template: 'tmpl-instagram-marker',
	item_template: 'tmpl-instagram-item',

	enable: function() {
		this.initialize(); 
		this.enabled = true;
	},

	disable: function() {
		this.enabled = false;
	},

	initialize: function() {
		if (!this.initialized) {
			MIC.compileTemplate(this.marker_template);
			MIC.compileTemplate(this.item_template);
			this.fetch();
			this.initialized = true;
		}
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
			}
		});
		this.photos = this.photos.concat(photos);
		if (this.enabled) {
			this.renderItems(photos);
		}
	},

	renderItems: function(photos) {
		var that = this;
		var markers = photos.map(function(photo) {
			var popup = MIC.handlebars_templates[that.item_template](photo);
			return L.photoMarker([photo.location.latitude, photo.location.longitude], {
				src: photo.images.thumbnail.url,
				size: [photo.images.thumbnail.width, photo.images.thumbnail.height],
				smallestSizeZoom: 13,
				largestSizeZoom: 18,
				matrix: { 13: 0.125, 15: 0.25, 17: 0.5, 18: 0.75 }
			}).bindPopup(popup, {maxWidth: "auto"});
		});

		// TODO: Group should not be added to map from here.
		L.featureGroup(markers).addTo(map);
	}

};