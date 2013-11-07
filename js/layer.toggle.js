MIC.LayerToggle = {

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
		this._layerNav.on('click', '.sub-layer', {self: this}, this.sublayerClick);
		this._layerNav.on('click', '.layer[data-name]', {self: this}, this.layerClick);
		this.initToggle(trigger_id);
	},

	initToggle: function(trigger_id) {
		trigger_id = trigger_id || 'nav-layers';
		var layerBtn = $('#' + trigger_id);
		var that = this;
		layerBtn.on('click', function() {
			that._layerNav.toggle();
		});
	},

	sublayerClick: function(e) {
		var data_name = $(this).attr('data-name');
		var layer = e.data.self.layers[data_name];
		var map = e.data.self.map;

		$(this).toggleClass('active');
		if  ($(this).hasClass('active')) {
			$(this).parent().addClass('active');
			layer.addTo(map);
			console.log('add to map ' + data_name);

		} else {
			if ($(this).siblings('.active').length < 1) {
				$(this).parent().removeClass('active');
			}
			map.removeLayer(layer);
			console.log('remove from map ' + data_name);
		}
		return false;
	},

	layerClick: function(e) {
		var data_name = $(this).attr('data-name');
		var layer = e.data.self.layers[data_name];
		var map = e.data.self.map;

		$(this).toggleClass('active');
		if  ($(this).hasClass('active')) {
			console.log('add to map ' + data_name);
			$(this).children('[data-name='+ data_name +']').toggleClass('active');
			layer.addTo(map);

		} else {
			console.log('remove from map ' + data_name);
			$(this).children('.sub-layer').removeClass('active');
			map.removeLayer(layer);
		}
	},

	layerToggleAll: function(e) {
		var layers = e.data.self.layers;
		var map = e.data.self.map;
		$(this).toggleClass('active');
		if  ($(this).hasClass('active')) {
			for (var i = 0; i < layers.length; i++) {
				layers[i].addTo(map);
			}
			$(this).children('.sub-layer').addClass('active');
		} else {
			for (var i = 0; i < layers.length; i++) {
				map.removeLayer(layers[i]);
			}
			$(this).children('.sub-layer').removeClass('active');
		}
		return false;
	},

	addLayer: function(layer, metadata) {
		this.layers[metadata.data_name] = layer;
		var html = MIC.handlebars_templates[this.item_template](metadata);
		this._layerNav.append(html);
	},

	addLayerGroup: function(data) {
		for (var i=0; i < data.layers.length; i++) {
			var layer = data.layers[i];
			this.layers[layer.data_name] = layer.layer;
		}
		var html = MIC.handlebars_templates[this.item_template](data);
		var element = $(html).appendTo(this._layerNav);

		if (data.select_all) {
			element.on('click', '.sub-layer', {self: this}, this.sublayerClick);
			element.on('click', {self: this}, this.layerToggleAll);
		}
	}
};