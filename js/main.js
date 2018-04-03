jQuery(document).ready(function($){
	//update this value if you change this breakpoint in the style.css file (or _layout.scss if you use SASS)
	var MqL = 1070;

	//on desktop, switch from product intro div to product tour div
	$('a[href="#cd-product-tour"]').on('click', function(event){
		event.preventDefault();
		$('header').addClass('slide-down');
		if($(window).width() < MqL) {
			$('body,html').animate({'scrollTop': $('#cd-product-tour').offset().top - 30 }, 200); 
		} else {
			$('.cd-main-content').addClass('is-product-tour');
			$('.top').hide();
			// uploadVideo(jQuery('.cd-active'));
		}
	});

	//update the slider - desktop only
	$('.cd-prev').on('click', function(event){
		event.preventDefault();
		var activeSlide = $('.cd-active');
		if(activeSlide.is(':first-child')) {
			//in this case - switch from product tour div to product intro div
			showProductIntro();
		} else {
			updateSlider(activeSlide, 'prev'); 
		}
	});
	$('.cd-next').on('click', function(event){
		event.preventDefault();
		var activeSlide = $('.cd-active');
		updateSlider(activeSlide, 'next'); 
	});
	$("a[href='#top']").click(function() {
		$("html, body").animate({ scrollTop: 0 }, "slow");
		return false;
	  });

	$(document).keyup(function(event){
		if(event.which=='37' && $('.cd-main-content').hasClass('is-product-tour') ) {
			var activeSlide = $('.cd-active');
			if(activeSlide.is(':first-child')) {
				//in this case - switch from product tour div to product intro div
				showProductIntro();
			} else {
				updateSlider(activeSlide, 'prev'); 
			}
		} else if(event.which=='39' && $('.cd-main-content').hasClass('is-product-tour')) {
			var activeSlide = $('.cd-active');
			updateSlider(activeSlide, 'next');
		}
	});

	$(window).on('resize', function(){
		window.requestAnimationFrame(function(){
			if($(window).width() < MqL) {
				$('.cd-single-item').each(function(){
					$(this).find('img').css('opacity', 1).end().find('video').hide();
				});
			} else {
				$('.cd-single-item.cd-active').find('video').show();
				( $('.cd-main-content').hasClass('is-product-tour') ) ? $('header').addClass('slide-down') : $('header').removeClass('slide-down');
			}
		});
	});
	$(window).on('scroll', function(){
		window.requestAnimationFrame(function(){
			if($(window).width() < MqL && $(window).scrollTop() < $('#cd-product-tour').offset().top - 30 ) {
				$('header').removeClass('slide-down');
			} else if ($(window).width() < MqL && $(window).scrollTop() >= $('#cd-product-tour').offset().top - 30 ){
				$('header').addClass('slide-down');
			}
		});
	});

	function showProductIntro() {
		$('header').removeClass('slide-down');
		$('.cd-main-content').removeClass('is-product-tour');
		$('.cd-active').find('video').get(0).pause();
		$('.cd-single-item').find('video').each(function(){
			$(this).get(0).currentTime = 0;
		});
	}

	function updateSlider(active, direction) {
		var selected;
		if( direction == 'next' ) {
			selected = active.next();
			//on Firefox CSS transition/animation fails when parent element changes visibility attribute
			//so we have to change .cd-single-item childrens attributes after having changed its visibility value
	        setTimeout(function() {
	           	active.removeClass('cd-active').addClass('cd-hidden').next().removeClass('cd-move-right').addClass('cd-active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	           		active.addClass('cd-not-visible');
	           	});
	        }, 50);
		} else {
			selected = active.prev();
			//on Firefox CSS transition/animation fails when parent element changes visibility attribute
			//so we have to change .cd-single-item childrens attributes after having changed its visibility value
	        setTimeout(function() {
	           	active.removeClass('cd-active').addClass('cd-move-right').prev().addClass('cd-active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	           		active.addClass('cd-not-visible');
	           	});
	        }, 50);
		}
		//update visible slider
		selected.removeClass('cd-not-visible');
		//update slider navigation (in case we reached the last slider)
        updateSliderNav(selected);
        //load the video for the new slider
		// uploadVideo(selected);

	}

	function updateSliderNav(selected) {
		( selected.is(':last-child') ) ? $('.cd-next').addClass('cd-inactive') : $('.cd-next').removeClass('cd-inactive') ;
		$('.cd-loader').stop().hide().css('width', 0);
	}
});