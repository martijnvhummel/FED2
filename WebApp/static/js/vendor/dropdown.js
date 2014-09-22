$(function() {
	var pull 		= $('#pull');
		menu 		= $('nav ul');
		menuHeight	= menu.height();

	$(pull).on('click', function(e) {
		e.preventDefault();
		menu.slideToggle();
	});

	$(window).resize(function(){
		var w = $(window).width();
		if(w > 320 && menu.is(':hidden')) {
			menu.removeAttr('style');
		}
	});
});

// Bron: ‘How To Create A Responsive Navigation’, Thoriq Firdaus, bron geraadpleegd op 15 november 2013, http://www.hongkiat.com/blog/responsive-web-nav/