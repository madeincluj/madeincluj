L.Control.Slider = (function () {

	var extend = function(target, source1, source2) {
		for (var property in source1) {
			if (source1.hasOwnProperty(property)) {
				target[property] = source1[property];
			}
		}
		for (var property in source2) {
			if (source2.hasOwnProperty(property)) {
				target[property] = source2[property];
			}
		}
		return target;
	};

	var Knob = L.Draggable.extend({
		
		defaults: {
			knobSize: 6, // in px
			orientation: 'horizontal',
			parentSize: 100, // in px
			min: 0,
			max: 1,
			step: 0.1
		},

		initialize: function(element, options) {
			L.Draggable.prototype.initialize.call(this, element, element);
			this._element = element;
			this._options = extend({}, this.defaults, options);
			
			this._steps = this._steps();
			this._stepSize = this._options.parentSize / (this._steps - 1);

			this.on('predrag', function () {
				this._dragStart();
			}, this);
		},

		_dragStart: function() {
			if (this._options.orientation === 'horizontal') {
				this._newPos.y = 0;
				this._newPos.x = this._adjust(this._newPos.x);

			} else {
				this._newPos.x = 0;
				this._newPos.y = this._adjust(this._newPos.y);
			}
		},

		_adjust: function (pos) {
			var value = this._toValue(pos);
			value = Math.max(0, Math.min(this._options.max, value));
			return this._toPos(value);
		},

		_toPos: function (value) {
			var pos = ((value - this._options.min) / this._options.step * this._stepSize);
			// pos = (pos - (this._stepSize + this._options.knobSize) / 2);
			pos = (pos - this._options.knobSize / 2);
			return pos;
		},

		_toValue: function (pos) {
			var value = pos + this._options.knobSize / 2;
			// var value = pos + (this._stepSize + this._options.knobSize) / 2;
			value = value / this._stepSize * this._options.step;
			value += this._options.min;
			return value;
		},

		_steps: function() {
			var levels = (this._options.max - this._options.min) / this._options.step + 1;
			return levels < Infinity ? levels : 0;
		},

		setPosition: function (pos) { 
			if (this._options.orientation === 'horizontal') {
				L.DomUtil.setPosition(this._element, L.point(this._adjust(pos), 0));
			} else {
				L.DomUtil.setPosition(this._element, L.point(0, this._adjust(pos)));
			}
		},

		getValue: function () {
			var pos = L.DomUtil.getPosition(this._element);
			if (this._options.orientation === 'horizontal') {
				return this._toValue(pos.x);
			} else {
				return this._toValue(pos.y);
			}
		},

		setValue: function (value) {
			this.setPosition(this._toPos(value));
		}
	});

	var Slider = L.Control.extend({

		defaults: {
			position: 'topleft',
			orientation: 'horizontal',
			wrapClass: 'leaflet-control-slider',
			size: 100, // in px;
			knobSize: 6, // in px
			
			min: 0,
			max: 1,
			step: 0.1,
			value: 1,
			slider: function(){}
		},

		initialize: function (options) {
			this.options = extend({}, this.defaults, options);
			this._steps = this._steps();
			L.Util.setOptions(this, this.options);

			this._ui = this._createUI();
			this._knob = new Knob(this._ui.knob, {
				knobSize: this.options.knobSize,
				orientation: this.options.orientation,
				parentSize: this.options.size,
				steps: this._steps,
				min: this.options.min,
				max: this.options.max,
				step: this.options.step,
			});
			this._knob.setValue(this.options.value);
		},

		onAdd: function (map) {
			this._map = map;
			map.whenReady(this._updateSize, this)
			   .whenReady(this._initKnob, this)
			   .whenReady(this._initEvents, this);
			return this._ui.wrap;
		},

		_createUI: function () {
			var ui = {},
				ns = this.options.wrapClass,
				id = this.options.id;

			ui.wrap = L.DomUtil.create('div', ns + ' leaflet-bar ' + ns + '-' + this.options.orientation),
			ui.body = L.DomUtil.create('div', ns + '-body', ui.wrap),
			ui.knob = L.DomUtil.create('div', ns + '-knob', ui.body);
			if (id) {
				ui.wrap.id = id;
			}

			L.DomEvent.disableClickPropagation(ui.wrap);
			L.DomEvent.disableClickPropagation(ui.knob);

			return ui;
		},

		_updateSize: function () {
			if (this.options.orientation === 'horizontal') {
				this._ui.body.style.width = this.options.size + 'px';
			} else {
				this._ui.body.style.height = this.options.size + 'px';
			}
		},

		_initKnob: function () {
			this._knob.enable();
		},

		_initEvents: function (map) {
			L.DomEvent.on(this._ui.body, 'click', this._onClick, this);
			this._knob.on('drag', this._slide, this);
		},

		_steps: function() {
			var levels = (this.options.max - this.options.min) / this.options.step + 1;
			return levels < Infinity ? levels : 0;
		},

		_onClick: function (e) {
			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
				pos;

			if (this.options.orientation === 'horizontal') {
				pos = e.clientX - L.DomUtil.getViewportOffset(this._ui.body).x;
			} else {
				pos = e.clientY - L.DomUtil.getViewportOffset(this._ui.body).y;
			}
			this._knob.setPosition(pos);
			this._slide();
		},

		_slide: function() {
			var value = this._knob.getValue();
			this.options.slider(value);
		}
	});

	return Slider;

})();