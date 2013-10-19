L.ZoomifyTileLayer = L.TileLayer.extend({
	initialize: function(url, opts) {
		L.TileLayer.prototype.initialize.call(this, url, o);
	},
	getTileUrl: function(tilePoint) {
			return L.Util.template(this._url, L.extend({
				s: this._getSubdomain(tilePoint),
				z: tilePoint.z,
				x: tilePoint.x,
				y: tilePoint.y
			}, this.options));
	}
});