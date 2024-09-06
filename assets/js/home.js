$(function() {
	/*-----------------------------------------------------------------
	| Home main slider initialization
	|------------------------------------------------------------------
	*/
	var $sequenceElement = document.getElementById("ty-seqHomeSlider"),
		$sliderPlayInterval = $('section.ty-homeSlider').attr('data-interval');
		$sequenceOptions = {
			keyNavigation: true,
			autoPlay : true,
			autoPlayInterval : $sliderPlayInterval
		};
	if($sequenceElement) {
		var $mySequence = sequence($sequenceElement, $sequenceOptions);
		$($sequenceElement).find('ul.seq-canvas li:first').addClass('seq-in');
	}

	/*-----------------------------------------------------------------
	| Slick Carousel --- homeTabs initialization
	|------------------------------------------------------------------
	*/
	var $homeTabDisplay = $('.ty-homeTab-display'),
		$homeTabSelectItem = $('.ty-homeTabs-selectItem'),
		$homeTabSelectWrap = $('.ty-homeTabs-selectWrap'),
		$homeTabDisplayWrap = $('.ty-homeTab-displayWrap');

	$homeTabDisplay.each( function(){
		var slickOptions = {
            	lazyLoad: 'ondemand',
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: true,
				prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
				nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
				mobileFirst: true,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 3
						}
					},
					{
						breakpoint: 970,
						settings: {
							slidesToShow: 2
						}
					},
					{
						breakpoint: 766,
						settings: {
							slidesToShow: 2
						}
					}
				]
		};
		$(this).slick(slickOptions);
	});

	$homeTabSelectItem.on('click', function(){
		//identify which homeTabDisplay-to-show
		var tabToShowData = $(this).data('item'),
			$tabtoShow = $("#"+tabToShowData);

		//Add Class to homeTabDisplay-to-show if class doesnt exist already
		if ( !$tabtoShow.hasClass('active')) {
			$homeTabDisplayWrap.find('.active').removeClass('active');
			$tabtoShow.addClass('active');
			//Update HomeTab
			$homeTabSelectWrap.find('.active').removeClass('active');
			$(this).closest('li').addClass('active');
		}
	});

});