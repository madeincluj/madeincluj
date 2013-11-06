MIC.LayerToggle = {

	item_template: 'tmpl-layer-toggle-item',

	layers: {},

	enable: function() {
		this.initialize();
		this.enabled = true;
		return this;
	},

	disable: function() {
		this.enabled = false;
		return this;
	},

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
		this._layerNav.on('click', '.layer', {self: this}, this.onclick);
		this.initToggle();
	},

	initToggle: function(trigger_id) {
		trigger_id = trigger_id || 'nav-layers';
		var layerBtn = $('#' + trigger_id);
		var that = this;
		layerBtn.on('click', function() {
			that._layerNav.toggle();
		});
	},

	addLayer: function(layer, metadata) {
		this.layers[metadata.data_name] = layer;
		var html = MIC.handlebars_templates[this.item_template](metadata);
		this._layerNav.append(html);
	},

	onclick: function(e) {
		var data_name = $(this).attr('data-name');
		var layer = e.data.self.layers[data_name];
		var map = e.data.self.map;

		$(this).toggleClass('active');
		if  ($(this).hasClass('active')) {
			layer.addTo(map);

		} else {
			map.removeLayer(layer);
		}
	}
};