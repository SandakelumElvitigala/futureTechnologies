$(function() {

	/*-----------------------------------------------------------------
	| Minimal Code Page Specific
	|------------------------------------------------------------------
	*/
	//Product Single Page
	$(function() {
		var $seqProductElement = document.getElementById("ty-seqProductImgSlider"),
			$seqModalProductElement = document.getElementById("ty-seqModalProductImgSlider"),
		$sequenceOptions = {
			keyNavigation: true
		};
		if($seqProductElement && $($seqProductElement).find('ul.seq-canvas li').length > 0) {
			var $mySeqProductImgSlider = sequence($seqProductElement, $sequenceOptions);
			$($seqProductElement).find('ul.seq-canvas li:first').addClass('seq-in');
		}

        if($seqModalProductElement && $($seqModalProductElement).find('ul.seq-canvas li').length > 0) {
            var $mySeqModalProductImgSlider = sequence($seqModalProductElement, $sequenceOptions);
            $($seqModalProductElement).find('ul.seq-canvas li:first').addClass('seq-in');
        }

        $('div.pg-image-zoom').on('click', function () {
            if( !($('.ty-mainWrap').hasClass('modalOpen')) ) $('.ty-mainWrap').addClass('modalOpen');
            $('.ty-modal #product-gallery.ty-modalContentWrap').addClass('ty-modal-show');
        });
	});

	/*-----------------------------------------------------------------
	| Common utility functions across all pages
	|------------------------------------------------------------------
	*/
	$(function() {
		var $mainWrap = $('.ty-mainWrap'),
			$navTrigger = $('.ty-navTrigger'),
			$catNavTrigger = $('.ty-catNav-trigger'),
			$catNavTriggerClose = $('.ty-catNav-trigger-close'),
			$modalTriggerClose = $('.ty-modalTrigger-close'),
			$inputField = $('.ty-input, .ty-textarea'),
			$scrollElement = document.querySelector(".ty-content"),
			$headroom = $('#ty-scrollHeader-headroom');

		/*-----------------------------------------------------------------
		| General Main Menu Open and Close Functionality 
		|------------------------------------------------------------------
		*/
		$navTrigger.on('click', function() {
			var $nav = $(this).closest('#ty-nav');
			if( !$nav.hasClass('open') ) $nav.addClass('open');
			else $nav.removeClass('open');
		});

		/*-----------------------------------------------------------------
		| Category Menu Open and Close Functionality
		|------------------------------------------------------------------
		*/
		//open Categories Nav function
		function openCatNav () {
			if ( !$mainWrap.hasClass('openCat') ) $mainWrap.addClass('openCat');
		}
		//Close Categories Nav function
		function closeCatNav () {
			if ( $mainWrap.hasClass('openCat') ) $mainWrap.removeClass('openCat');
		}
		//Triggers to open and close nav
		$catNavTrigger.on('click', function() { openCatNav(); });
		$catNavTriggerClose.on('click', function() { closeCatNav(); });

		/*-----------------------------------------------------------------
		| Register close button event handler for all the modals
		|------------------------------------------------------------------
		*/
		$modalTriggerClose.on('click', function(){
            $mainWrap.removeClass('modalOpen');
            $('.ty-modal .ty-modalContentWrap.ty-modal-show').removeClass('ty-modal-show');
        });

		/*-----------------------------------------------------------------
		| Register form input Focus/Blur event handlers
		|------------------------------------------------------------------
		*/
		//Add 'focus' Class focus on 'focus' event
		$inputField.on('focus', function() {
			$(this).closest('.ty-inputHolder').addClass('focus');
		});

		$inputField.on('blur', function() {
			var ivalue = this.value;
			if( !ivalue ) $(this).closest('.ty-inputHolder').removeClass('focus full');
			else $(this).closest('.ty-inputHolder').addClass('full');
		});

		/*-----------------------------------------------------------------
		| Scroll initialization for the header
		|------------------------------------------------------------------
		*/
		var header = new Headroom(document.querySelector("#ty-scrollHeader-headroom"), {
	        tolerance: 5,
	        offset : 85,
	        scroller : $scrollElement,
	        onTop : closeAtTop
	    });
	    header.init();

		setTimeout( function () {
	    	$headroom.removeClass('ty-display-none');
	    }, 100);

	    // Close menu when on top
	    function closeAtTop() {
	    	var headroomNav = $headroom.find('#ty-nav');

	    	if ( headroomNav.hasClass('open') ) {
	    		headroomNav.removeClass('open');
	    	}
	    }

	});

    /*-----------------------------------------------------------------
	| Search Products Related Functions
	|------------------------------------------------------------------
	*/
    $(function() {
        var minLength = 3,
            maxProducts = 6,
            searchRequest = null,
            $searchModal = $('.ty-modal #modal-search-products'),
            $moreResults = $('.ty-modal #modal-search-products div.pg-more-results'),
    	    $searchInput = $('.ty-modal #modal-search-products.ty-modalContentWrap').find('input#search-products');

        /*-----------------------------------------------------------------
        | Search Modal Open
        |------------------------------------------------------------------
        */
        $('.pg-search-btn').on('click', function() {
            $searchInput.val('');
            $searchModal.find('ul div.pg-search-results').html('');
            $moreResults.hide();
            showModal('#modal-search-products');
            setTimeout(function () { $searchInput.focus(); }, 1000);
        });

        $searchInput.on('keyup', function() {
            var that = this,
                key = jQuery.trim($(this).val());

            if (key.length <= minLength) {
                $searchModal.find('ul div.pg-search-results').html('');
                $moreResults.hide();
                return;
            }

            if (searchRequest !== null) {
                searchRequest.abort();
            }

            searchRequest = $.ajax({
                type: 'GET',
                dataType: 'json',
                url: $('.ajax-api-route').data('url') + '/search',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content'),
                    searchKey: key
                },
                beforeSend: function() {
                    $searchModal.find('ul div.pg-search-results').html('');
                    $moreResults.hide();
                    $searchModal.find('ul').removeClass('loading').addClass('loading');
                },
                success: function(data) {
                    if (key === jQuery.trim($(that).val())) {
                        $searchModal.find('ul div.pg-search-results').html(data);

                        var nodeCount = $searchModal.find('ul div.pg-search-results li').length;
                        if (nodeCount >= maxProducts) {
                            $moreResults.show();
                        }
					}
                },
                complete: function() {
                    $searchModal.find('ul').removeClass('loading');
                }
            });
        });

        $moreResults.find('a').on('click', function (e) {
            e.preventDefault();

            var key = $searchInput.val(),
                url = $(this).data('url') + '?q=' + key;

            window.location.href = url;
        });
	});

	/*-----------------------------------------------------------------
	| Quote Processing Related Function
	|------------------------------------------------------------------
	*/
	$(function() {
	    var quoteBaseUrl = $('.ajax-api-route').data('url') + '/quote';

		/*-----------------------------------------------------------------
		| Live Update of Cart Total Value on Navigation
		|------------------------------------------------------------------
		*/
		$(document).ready(function() {

			function refreshCartTotal() {
				$.ajax({
		            type: 'GET',
		            dataType: 'json',
		            url: quoteBaseUrl + '/value',
		            data: { 
		            	_token: $('meta[name="csrf-token"]').attr('content')
		            },
		            success: function(data) {
				    	if(data.status == "success") {
				    		$('.ty-quoteBlockWrap .ty-quoteValueHolder h1').html(formatMoney(data.quote_total, 0));

				    		if($control) { 
				    			$control = false; 
								setTimeout(function() {
									refreshCartTotal(); 
								}, 1000);
				    		}
			    		}
		            },
		            error: function(e) { console.log('Request could not complete'); }
		        });
			}

			var $control = true;
			refreshCartTotal();
		});

		/*-----------------------------------------------------------------
		| "Add to Quote" button processing logic
		|------------------------------------------------------------------
		*/
		$('.pg-add-quote').on('click', function(e) {
			e.preventDefault(); e.stopPropagation();
			
			var pId = $(this).data('pid');
			
	        $.ajax({
	            type: 'GET',
	            dataType: 'json',
	            url: quoteBaseUrl + '/has',
	            data: { 
	            	pId: pId,
	            	_token: $('meta[name="csrf-token"]').attr('content')
	            },
	            success: function(data) {
	            	$('.ty-modal #modal-add-quote.ty-modalContentWrap')
	            		.find('.ty-Quote-productDetails').html(data);
	            	showModal('#modal-add-quote');
	            	registerAddQuoteModalEvents();
	            },
	            error: function(e) { console.log('Request could not complete'); }
	        });
		});

		//Register events for the rendered HTML blocks
		function registerAddQuoteModalEvents() {
			//Register Number Spinner Events
			registerNumberSpinnerEvents($('#modal-add-quote'), null);
			//Cancel Button Event
			$('#modal-add-quote #ty-cancel.ty-modalTrigger-close').on('click', function() {
				closeModal();
			});
			//Confirm Button
			$('#modal-add-quote button#ty-confirm').on('click', function() {
				var pId = $(this).data('pid'),
					pQuantity = $('#modal-add-quote').find('.ty-quoteQtyWrap input#qty').val();

				updateProductQuantity(pId, pQuantity, closeModal);
			});
		}

		/*-----------------------------------------------------------------
		| Process Quotation List and Updates
		|------------------------------------------------------------------
		*/
		$('.pg-quoteBlock').on('click', function() {
	        $.ajax({
	            type: 'GET',
	            dataType: 'json',
	            data: {
            		_token: $('meta[name="csrf-token"]').attr('content')
	            },
	            url: quoteBaseUrl,
	            success: function(data) {
	            	$('.ty-modal #modal-list-quote.ty-modalContentWrap')
	            		.find('.ty-modal-quotationList').html(data);
	            	showModal('#modal-list-quote');
	            	registerListQuoteModalEvents();
	            	loadReplacingProducts();
	            },
	            error: function(e) { console.log('Request could not complete'); }
	        });
		});

		function registerListQuoteModalEvents() {
			registerNumberSpinnerEvents($('#modal-list-quote'), preQuantityUpdated);

			$('#modal-list-quote button.ty-quoteRemove-btn').on('click', function() {
				removeProduct($(this));
			});

			$('#modal-list-quote div.ty-quotationList-sendEmailBtnWrap button').
				on('click', function() {
					initQuoteInboxUserDetails($('#modal-user-details'));
					switchModal('#modal-user-details');
				});

            /*-----------------------------------------------------------------
			| Add product to quote from quote list
			|------------------------------------------------------------------
			*/
            $('#modal-list-quote select[name="quick-add-category"]')
                .on('change', function () {
                    var apiBaseUrl =  $('.ajax-api-route').data('url'),
						categoryId = $(this).find(':selected').val();

                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            _token: $('meta[name="csrf-token"]').attr('content')
                        },
                        url: apiBaseUrl + '/category/' + categoryId + '/products',
                        success: function(data) {
							var productOptions = '<option value="" selected disabled>Pick Product</option>';

							$.each(data.products, function(index, product) {
                                productOptions = productOptions + '<option value="' + product.id + '">' + product.name + ' - ' + formatMoney(product.main_price, 0) + ' LKR</option>';
							});

                            $('#modal-list-quote select[name="quick-add-product"]').html(productOptions);
                            $('#modal-list-quote select[name="quick-add-product"]').removeClass('inactive');
                        },
                        error: function() { console.log('Request could not complete'); }
                    });
                });

            $('#modal-list-quote button.quick-add-submit').on('click', function () {
            	var productId = $('#modal-list-quote select[name="quick-add-product"]').find(':selected').val();

            	if (productId === undefined || productId === null || productId.trim() === '') {
            		return;
				}


                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: quoteBaseUrl + '/add',
                    data: {
                        pId: productId,
                        pQuantity: 1,
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    beforeSend: function () {
                        $('.ty-modal #modal-list-quote.ty-modalContentWrap')
                            .find('.ty-modal-quotationList').addClass('loading');
                    },
                    success: function(data) {
                        if(data.status == "success") {
                            $('.ty-quoteBlockWrap .ty-quoteValueHolder h1').html(formatMoney(data.quote_total, 0));
                            refreshQuoteList();
                        }
                    },
                    error: function() { console.log('Request could not complete'); }
                });
            });
		}

		function refreshQuoteList() {
            $.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                url: quoteBaseUrl,
                success: function(data) {
                    $('.ty-modal #modal-list-quote.ty-modalContentWrap')
                        .find('.ty-modal-quotationList').html(data);
                    registerListQuoteModalEvents();
                    loadReplacingProducts();
                },
				complete: function () {
                    setTimeout(function () {
                        $('.ty-modal #modal-list-quote.ty-modalContentWrap')
                            .find('.ty-modal-quotationList').removeClass('loading');
                    }, 1000);
                },
                error: function(e) { console.log('Request could not complete'); }
            });
        }

        function loadReplacingProducts() {
            var apiBaseUrl =  $('.ajax-api-route').data('url');

            $('.ty-modal #modal-list-quote.ty-modalContentWrap')
                .find('.ty-modal-quotationList ul li').each(function(index, row) {

					var categoryId = $(row).data('category-id');
					var currentPId = $(row).data('pid');

					$.ajax({
						type: 'GET',
						dataType: 'json',
						data: {
							_token: $('meta[name="csrf-token"]').attr('content')
						},
						url: apiBaseUrl + '/category/' + categoryId + '/products',
						success: function(data) {
							var productOptions = '<option value="" selected disabled>Pick Product</option>';

							$.each(data.products, function(index, product) {
								productOptions = productOptions + '<option value="' + product.id + '">' + product.name + ' - ' + formatMoney(product.main_price, 0) + ' LKR</option>';
							});

                            $(row).find('select[name="quick-replace-products_' + currentPId + '"]').html(productOptions);
                            $(row).find('select[name="quick-replace-products_' + currentPId + '"]').on('change', function () {
								replaceProduct(currentPId, $(this).find(':selected').val());
                            });
						},
						error: function() { console.log('Request could not complete'); }
					});
				});
        }

        function replaceProduct(existingPId, newPId) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: quoteBaseUrl + '/replace',
                data: {
                    existingPId: existingPId,
                    newPId: newPId,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                beforeSend: function () {
                    $('.ty-modal #modal-list-quote.ty-modalContentWrap')
                        .find('.ty-modal-quotationList').addClass('loading');
                },
                success: function (data) {
                    if (data.status == "success") {
                        $('.ty-quoteBlockWrap .ty-quoteValueHolder h1').html(formatMoney(data.quote_total, 0));
                        refreshQuoteList();
                    }
                },
                error: function () {
                    console.log('Request could not complete');
                }
            });
        }


		function preQuantityUpdated(elemt) {
			var $row = elemt.closest('li');
			updateProductQuantity(
					$row.data('pid'), 
					$row.find('div.ty-quoteQtyWrap input').val(),
					postQuantityUpdated
				);
		}

		function postQuantityUpdated(data) {
			var product = data.product_specs,
				$row = $('#modal-list-quote').find('li[data-pid="' + product.pId + '"]'),
				pTotal = parseInt(product.pQuantity) * parseFloat(product.pPrice)

			$row.find('span.ty-quotePrice-full').html(formatMoney(pTotal, 0));
			$('.ty-modal #modal-list-quote.ty-modalContentWrap').
				find('.ty-quotationList-totalWrap span.ty-total-price').html(formatMoney(data.quote_total, 0));
		}

		function removeProduct(elemt) {
			var $row = elemt.closest('li');

	        $.ajax({
	            type: 'POST',
	            dataType: 'json',
	            url: quoteBaseUrl + '/remove',
	            data: { 
	            	pId: $row.data('pid'),
	            	_token: $('meta[name="csrf-token"]').attr('content')
	            },
	            success: function(data) {
	            	if(data.status == 'success') {
	            		$('.ty-quoteBlockWrap .ty-quoteValueHolder h1').html(formatMoney(data.quote_total, 0));

	            		if(data.quote_total == 0) {
	            			$row.parent('ul').html('<h4>Your Quote is empty. Please add items to the quote.</h4>');
	            			$('#modal-list-quote div.ty-quotationList-sendEmailBtnWrap').remove();
	            		} else $row.remove();
	            		$('.ty-modal #modal-list-quote.ty-modalContentWrap').
							find('.ty-quotationList-totalWrap span.ty-total-price').
							html(formatMoney(data.quote_total, 0));
	            	}
	            },
	            error: function(e) { console.log('Request could not complete'); }
	        });
		}

		/*-----------------------------------------------------------------
		| Quote Inbox User Details Gathering
		|------------------------------------------------------------------
		*/
		function initQuoteInboxUserDetails(modal) {
			modal.find('form input[type="text"], input[type="email"]').val('').trigger('blur');
			modal.find('form p.ty-verifyText').html('');
			modal.find('form div.ty-inputHolder').removeClass('verify');
			modal.find('.ty-detailsFormWrap').removeClass('loading');

			modal.find('form').unbind('submit').submit(function (e) {
		        e.preventDefault();
		        var userData = {};
		        userData['_token'] = $('meta[name="csrf-token"]').attr('content');
		        modal.find('form input[type="text"], input[type="email"]').each(function() {
		            userData[$(this).attr('name')] = $(this).val();
		        });

		        $.ajax({
		            type: 'POST',
		            dataType: 'json',
		            url: modal.find('form').data('form-action'),
		            data: userData,
		            beforeSend: function() { 
		                modal.find('form p.ty-verifyText').html('');
		                modal.find('form div.ty-inputHolder').removeClass('verify');
		                modal.find('form input[type="submit"]').val('Processing');
		                modal.find('.ty-detailsFormWrap').removeClass('loading').addClass('loading');
		            },
		            success: function(data) {
		                if(data.status == 'success') {
		                	switchModal('#modal-quote-success');
		                	resetQuote();
		                }
		                else if(data.status == 'failed') {
		                    if(data.code == 'validation_error') {
		                        $.each(data.errors, function(key, value) {
		                            var pTag = modal.find('form [name=' + key + ']').next();
		                            pTag.html(value);
		                            pTag.closest('div.ty-inputHolder').addClass('verify');
		                        });
		                    } else console.log('Request made was not an ajax');
		                }
		            },
		            error: function(e) {
		                switchModal('#modal-email-error');
		                console.log('Request could not complete');
		            },
		            complete: function() {
		                modal.find('form input[type="submit"]').val('Submit');
		                modal.find('.ty-detailsFormWrap').removeClass('loading');
		            }
		        });
	        });
		}

		function resetQuote() {
	        $.ajax({
	            type: 'POST',
	            dataType: 'json',
	            data: {
	            	_token: $('meta[name="csrf-token"]').attr('content')
	            },
	            url: quoteBaseUrl + '/reset',
	            success: function(data) {
			    	if(data.status == "success")
			    		$('.ty-quoteBlockWrap .ty-quoteValueHolder h1').html(formatMoney(data.quote_total, 0));
	            },
	            error: function(e) { console.log('Request could not complete'); }
	        });
		}

		/*-----------------------------------------------------------------
		| Utility functions for the quote processor
		|------------------------------------------------------------------
		*/
	    function switchModal(modalId) {
	    	if( !($('.ty-mainWrap').hasClass('modalOpen')) ) $('.ty-mainWrap').addClass('modalOpen');
	    	$('.ty-modal .ty-modalContentWrap.ty-modal-show').removeClass('ty-modal-show');
	    	$('.ty-modal ' + modalId + '.ty-modalContentWrap').addClass('ty-modal-show');
	    }

	    function closeModal() {
	    	$('.ty-mainWrap').removeClass('modalOpen');
    		$('.ty-modal .ty-modalContentWrap.ty-modal-show').removeClass('ty-modal-show');
	    }

	    function registerNumberSpinnerEvents(modal, callback) {
	    	modal.find('.ty-quoteQtyWrap').find('button.ty-add, button.ty-subtract').on('click', function() {
	    		if($updateProcessing) return false;
	    		var $inputNumber = $(this).siblings('div.ty-qty-inputHolder').find('input'),
					currentValue = parseInt($inputNumber.val());
	    		if($(this).hasClass('ty-add')) {
	    			$inputNumber.val(currentValue + 1);
	    		} else if($(this).hasClass('ty-subtract')) {
	    			if(currentValue <= 1) return false;
	    			$inputNumber.val(currentValue - 1);
	    		}

	    		if(callback) callback($(this));
	    	});
	    	modal.find('.ty-quoteQtyWrap input').on('blur', function() {
	    		if(!(/^[1-9]\d*$/.test($(this).val())))
	    			$(this).val(1);

	    		if(callback) callback($(this));
	    	});
	    }

	    var $updateProcessing = false;
    	function updateProductQuantity(pId, pQuantity, callback) {
    		if($updateProcessing) return false;
			$.ajax({
			    type: 'POST',
			    dataType: 'json',
			    url: quoteBaseUrl + '/add',
			    data: { 
			    	pId: pId,
			    	pQuantity: pQuantity,
			    	_token: $('meta[name="csrf-token"]').attr('content')
			    },
			    beforeSend: function() { 
			    	$updateProcessing = true; 
			    	$('.ty-modal .ty-quoteQtyWrap input').prop('disabled', true);
			    },
			    success: function(data) {
			    	if(data.status == "success") {
			    		$('.ty-quoteBlockWrap .ty-quoteValueHolder h1').html(formatMoney(data.quote_total, 0));
			    		if(callback) callback(data);
			    	}
			    },
			    error: function(e) { console.log('Request could not complete'); },
			    complete: function() { 
			    	$updateProcessing = false; 
			    	$('.ty-modal .ty-quoteQtyWrap input').prop('disabled', false);
			    }
			});
    	}

    	function formatMoney(value, decimals, dec_point, thousands_sep) {
			dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
		    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

		    var parts = value.toFixed(decimals).split('.');
		    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

		    return parts.join(dec_point);
		}

		function unFormatMoney(value, dec_point, thousands_sep) {
		    dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
		    thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

		    var parts = value.split(dec_point);
		    var re = new RegExp("[" + thousands_sep + "]");
		    parts[0] = parts[0].replace(re, '');

		    return parseFloat(parts.join(dec_point));
		}

	});

    /*-----------------------------------------------------------------
	| Global Utility functions
	|------------------------------------------------------------------
	*/
    function showModal(modalId) {
        if( !($('.ty-mainWrap').hasClass('modalOpen')) ) $('.ty-mainWrap').addClass('modalOpen');
        $('.ty-modal ' + modalId + '.ty-modalContentWrap').addClass('ty-modal-show');
    }
});