MIC.LayerToggle = {

	// TODO: test this entire thing better !

	item_template: 'tmpl-layer-toggle-item',

	layers: {},

	initialize: function(map, trigger_id, container_id) {
		if (!this.initialized) {
			MIC.compileTemplate(this.item_template);
			this.map = map;
			this.initUI(trigger_id, container_id);
			this.initialized = true;
		}
		return this;
	},

	initUI: function(trigger_id, container_id) {
		container_id = container_id || 'layers';
		this._layerNav = $('#' + container_id);
		this._layerNav.on('click', '.sub-layer', this.sublayerClick);
		this._layerNav.on('click', '.layer[data-name]', this.layerClick);
		this.initToggle(trigger_id);
	},

	initToggle: function(trigger_id) {
		trigger_id = trigger_id || 'nav-layers';
		this._layerBtn = $('#' + trigger_id);
		var that = this;
		this._layerBtn.on('click', this.showLayerMenu);
	},

	showLayerMenu: function() {
		var btn = MIC.LayerToggle._layerBtn;
		btn.addClass('active');
		MIC.LayerToggle._layerNav.css({
			top: btn.outerHeight() + btn.position().top,
			left: btn.position().left
		}).addClass('visible');
		$(window).on('click', MIC.LayerToggle.hideLayerMenu);
		btn.on('click', MIC.LayerToggle.hideLayerMenu);
		return false;
	},
	hideLayerMenu: function(e) {
		if (!$(e.target).closest('#layers').length) {
			MIC.LayerToggle._layerBtn.removeClass('active');
			MIC.LayerToggle._layerNav.removeClass('visible');
			MIC.LayerToggle._layerBtn.off('click', MIC.LayerToggle.hideLayerMenu);
			$(window).off('click', MIC.LayerToggle.hideLayerMenu);
		}
		return false;
	},

	sublayerClick: function() {
		var that = MIC.LayerToggle;
		var data_name = $(this).attr('data-name');
		var layer = that.layers[data_name];
		var map = that.map;
		var unique = $(this).data('multiple') !== 'true';

		$(this).toggleClass('active');

		if ($(this).hasClass('active')) {

			if (unique) {
				var activeSiblings = $(this).siblings('.active');
				that._removeLayers(activeSiblings);
			}

			$(this).parent().addClass('active');
			layer.addTo(map);

		} else {
			var activeSiblings = $(this).siblings('.active');
			if (activeSiblings.length == 0) {
				$(this).parent().removeClass('active');
			}
			map.removeLayer(layer);
		}
		return false;
	},

	layerClick: function(e) {
		var that = MIC.LayerToggle;
		var data_name = $(this).attr('data-name');
		var layer = that.layers[data_name];
		var map = that.map;

		$(this).toggleClass('active');

		if ($(this).hasClass('active')) {
			layer.addTo(map);
			var children = $(this).children('[data-name='+ data_name +']');
			children.addClass('active');

		} else {
			map.removeLayer(layer);
			var activeChildren = $(this).children('.active');
			that._removeLayers(activeChildren);
		}
		return false;
	},

	layerToggleAll: function(e) {
		var that = e.data.self;

		$(this).toggleClass('active');

		if  ($(this).hasClass('active')) {
			var children = $(this).children('.sub-layer');
			that._addLayers(children);

		} else {
			var activeChildren = $(this).children('.active');
			that._removeLayers(activeChildren);
		}
		return false;
	},

	_removeLayers: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var data_name = $(elements[i]).attr('data-name');
			this.map.removeLayer(this.layers[data_name]);
			console.log('remove from map ' + data_name);
		}
		elements.removeClass('active');
	},

	_addLayers: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			var data_name = $(elements[i]).attr('data-name');
			var layer = this.layers[data_name];
			layer.addTo(this.map);
		}
		elements.addClass('active');
	},

	addLayer: function(layer, metadata, isEnabled) {
		this.layers[metadata.data_name] = layer;
		var html = MIC.handlebars_templates[this.item_template](metadata);
		this._layerNav.append(html);
		if (isEnabled) {
			var elements = $('[data-name='+ metadata.data_name +']');
			elements.addClass('active');
			layer.addTo(this.map);
		}
	},

	addLayerGroup: function(data) {
		for (var i=0; i < data.layers.length; i++) {
			var layer = data.layers[i];
			this.layers[layer.data_name] = layer.layer;
		}
		var html = MIC.handlebars_templates[this.item_template](data);
		var element = $(html).appendTo(this._layerNav);
	}
};