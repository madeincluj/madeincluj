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
	},

	initialize: function() {
		var popup = this.popup = $("#popup-container");
		this.popup.on('click', '.close-popup', function() {
			popup.hide();
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