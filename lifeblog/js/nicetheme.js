/*
            /$$
    /$$    /$$$$
   | $$   |_  $$    /$$$$$$$
 /$$$$$$$$  | $$   /$$_____/
|__  $$__/  | $$  |  $$$$$$
   | $$     | $$   \____  $$
   |__/    /$$$$$$ /$$$$$$$/
          |______/|_______/
================================
        Keep calm and get rich.
                    Is the best.
  	@Author: Dami
  	@Date:   2017-09-06 15:27:44
 * @Last Modified by: suxing
 * @Last Modified time: 2019-09-29 23:10:49
*/

window.$ = jQuery;
var lastKnownScrollY = 0;
var currentScrollY = 0;
var ticking = false;
var idOfTabBar = 'post-dock';
var eleTabBar = null;
const classes = {
	pinned: 'post-dock-pin',
	unpinned: 'post-dock-unpin',
};

function setLightModeClass() {
	$('body').removeClass('nice-dark-mode')
	$('.logo-dark').removeClass('d-inline-block')
	$('.logo-dark').addClass('d-none')
	$('.logo-light').removeClass('d-none')
	$('.logo-light').addClass('d-inline-block')
	$('.switch-dark-mode').removeClass('current')
}
function setLightMode() {
	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'html',
		data: {
			toggle_action: 'off',
			action: 'cosy19_toggle_dark_mode'
		},
	})
		.done(function () {
			setLightModeClass()
		})
}

function setDarkModeClass() {
	$('body').addClass('nice-dark-mode')
	$('.logo-dark').removeClass('d-none')
	$('.logo-dark').addClass('d-inline-block')
	$('.logo-light').removeClass('d-inline-block')
	$('.logo-light').addClass('d-none')
	$('.switch-dark-mode').addClass('current')
}
function setDarkMode() {
	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'html',
		data: {
			toggle_action: 'on',
			action: 'cosy19_toggle_dark_mode'
		},
	})
		.done(function () {
			setDarkModeClass()
		})
}


function onScroll() {
	currentScrollY = window.pageYOffset;
	requestTick();
}
function requestTick() {
	if (!ticking) {
		requestAnimationFrame(update);
	}
	ticking = true;
}
function update() {
	if (currentScrollY < lastKnownScrollY) {
		pin();
	} else if (currentScrollY > lastKnownScrollY) {
		unpin();
	}
	lastKnownScrollY = currentScrollY;
	ticking = false;
}
function pin() {
	if (eleTabBar && eleTabBar.classList.contains(classes.unpinned)) {
		eleTabBar.classList.remove(classes.unpinned);
		eleTabBar.classList.add(classes.pinned);
	}
}
function unpin() {
	if (eleTabBar && (eleTabBar.classList.contains(classes.pinned) || !eleTabBar.classList.contains(classes.unpinned))) {
		eleTabBar.classList.remove(classes.pinned);
		eleTabBar.classList.add(classes.unpinned);
	}
}
window.onload = function () {
	eleTabBar = document.getElementById(idOfTabBar);
	document.addEventListener('scroll', onScroll, false);
}

function scrollTop() {
	var $window = $(window),
		$window_width = $window.width(),
		$window_height = $window.height(),
		scroll = $window.scrollTop(),
		startPoint = $window_height / 2,
		scrTopBtn = $("#back-to-top");
	commentBtn = $(".btn-scroll-comment");
	if (scroll >= startPoint && $window_width >= 1024) {
		scrTopBtn.addClass('current');
	} else {
		scrTopBtn.removeClass('current');
	}
	scrTopBtn.on("click", function () {
		$("html, body").stop().animate({
			scrollTop: 0
		},
			600);
	});
	commentBtn.on("click", function () {
		$("body, html").stop().animate({ scrollTop: $("#respond").offset().top }, 600);
	});

};

function cropImagetoDataURI(element) {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var originWidth = element.width;
	var originHeight = element.height;
	var maxWidth = 300, maxHeight = 300;
	var targetWidth = originWidth, targetHeight = originHeight;
	if (originWidth > maxWidth || originHeight > maxHeight) {
		if (originWidth / originHeight > maxWidth / maxHeight) {
			targetWidth = maxWidth;
			targetHeight = Math.round(maxWidth * (originHeight / originWidth));
		} else {
			targetHeight = maxHeight;
			targetWidth = Math.round(maxHeight * (originWidth / originHeight));
		}
	}
	canvas.width = targetWidth;
	canvas.height = targetHeight;
	context.clearRect(0, 0, targetWidth, targetHeight);
	context.drawImage(element, 0, 0, targetWidth, targetHeight);
	return canvas.toDataURL()
}
jQuery(document).scroll(function ($) {
	scrollTop()
});
jQuery(document).ready(function ($) {

	// Enable all tooltips
	$('[data-toggle="nicetooltip"]').tooltip();
	$(".nice-tooltip-hide").click(function () {
		$("[data-toggle='nicetooltip']").tooltip('hide');
	});

	$(window).on('scroll', function () {
		var b = $(window).scrollTop();
		if (b > 72) {
			$(".fixed-top").addClass("scroll");
		} else {
			$(".fixed-top").removeClass("scroll");
		}
	});
	if ($('.list-default-poster .bg-poster').length) {
		var specialImageDOM = $('.list-default-poster .bg-poster');
		var specialSectionDOM = $('.list-default-poster .bg-color');
		var colorThief = new ColorThief();

		colorThief.getColorAsync(specialImageDOM.data('img'), function (color, element) {
			var colors = colorThief.getPalette(element, 3);
			var mainColor = 'rgba(' + colors[0][0] + ', ' + colors[0][1] + ', ' + colors[0][2] + ', 1)';
			var subColor = 'rgba(' + colors[1][0] + ', ' + colors[1][1] + ', ' + colors[1][2] + ', 1)';
			var thirdColor = 'rgba(' + colors[2][0] + ', ' + colors[2][1] + ', ' + colors[2][2] + ', 1)';

			specialImageDOM.attr('data-img', '')
			specialImageDOM.css({
				'background-image': 'url("' + cropImagetoDataURI(element) + '")'
			})
			specialSectionDOM.css({
				'background': 'linear-gradient( -10deg, ' + mainColor + ' 0%, ' + subColor + '100%, ' + thirdColor + '100%)'
			})
		});
	}
	if ($('.list-author-pushes .list-item').length) {
		$('.list-author-pushes .list-item').each(function (index, element) {
			var authorCoverDOM = $(element).find('.bg-poster');
			var authorGradientDOM = $(element).find('.bg-author');
			var colorThief = new ColorThief();
			colorThief.getColorAsync(authorCoverDOM.data('img'), function (color, element) {
				var colors = colorThief.getPalette(element, 3);
				var mainColor = 'rgba(' + colors[0][0] + ', ' + colors[0][1] + ', ' + colors[0][2] + ', 1)';
				var subColor = 'rgba(' + colors[1][0] + ', ' + colors[1][1] + ', ' + colors[1][2] + ', 1)';
				var thirdColor = 'rgba(' + colors[2][0] + ', ' + colors[2][1] + ', ' + colors[2][2] + ', 1)';
				authorCoverDOM.attr('data-img', '')
				authorCoverDOM.css({
					'background-image': 'url("' + cropImagetoDataURI(element) + '")'
				})
				authorGradientDOM.css({
					'background': 'linear-gradient( to bottom, ' + mainColor + ' 0%, ' + subColor + '100%, ' + thirdColor + '100%)'
				})
			});
		})
	}
	if ($('.list-magazine > .bg-magazine').length) {
		var magazineCoverDOM = $('.list-magazine > .bg-magazine');
		var magazineBgCoverDOM = $('.list-magazine > .bg-image-color');
		var colorThief = new ColorThief();
		colorThief.getColorAsync(magazineCoverDOM.data('img'), function (color, element) {
			var colors = colorThief.getPalette(element, 3);
			var mainColor = 'rgba(' + colors[0][0] + ', ' + colors[0][1] + ', ' + colors[0][2] + ', 1)';
			var subColor = 'rgba(' + colors[1][0] + ', ' + colors[1][1] + ', ' + colors[1][2] + ', 1)';
			var thirdColor = 'rgba(' + colors[2][0] + ', ' + colors[2][1] + ', ' + colors[2][2] + ', 1)';

			magazineCoverDOM.attr('data-img', '')
			magazineCoverDOM.css({
				'background-image': 'url("' + cropImagetoDataURI(element) + '")'
			})
			magazineBgCoverDOM.css({
				'background': 'linear-gradient( to bottom, ' + mainColor + ' 0%, ' + subColor + '100%, ' + thirdColor + '100%)'
			})
		});
	}
	if ($('.post-image-poster  .bg-image-cover').length) {
		var postimageCoverDOM = $('.post-image-poster  .bg-image-cover');
		var postimageBgCoverDOM = $('.post-image-poster .bg-image-color');
		var colorThief = new ColorThief();
		colorThief.getColorAsync(postimageCoverDOM.data('img'), function (color, element) {
			var colors = colorThief.getPalette(element, 2);
			var mainColor = 'rgba(' + colors[0][0] + ', ' + colors[0][1] + ', ' + colors[0][2] + ', 1)';
			var subColor = 'rgba(' + colors[1][0] + ', ' + colors[1][1] + ', ' + colors[1][2] + ', 1)';

			postimageCoverDOM.attr('data-img', '')
			postimageCoverDOM.css({
				'background-image': 'url("' + cropImagetoDataURI(element) + '")'
			})
			postimageBgCoverDOM.css({
				'background': 'linear-gradient( to top, ' + mainColor + ' 10%, ' + subColor + '200%)'
			})
		});
	}
	if ($('.poster-mask .bg-poster').length) {
		var specialImageDOM = $('.poster-mask .bg-poster');
		var specialSectionDOM = $('.poster-mask .bg-color');
		var colorThief = new ColorThief();

		colorThief.getColorAsync(specialImageDOM.data('img'), function (color, element) {
			var colors = colorThief.getPalette(element, 3);
			var mainColor = 'rgba(' + colors[0][0] + ', ' + colors[0][1] + ', ' + colors[0][2] + ', 1)';
			var subColor = 'rgba(' + colors[1][0] + ', ' + colors[1][1] + ', ' + colors[1][2] + ', 1)';
			var thirdColor = 'rgba(' + colors[2][0] + ', ' + colors[2][1] + ', ' + colors[2][2] + ', 1)';

			specialImageDOM.attr('data-img', '')
			specialImageDOM.css({
				'background-image': 'url("' + cropImagetoDataURI(element) + '")'
			})
			specialSectionDOM.css({
				'background': 'linear-gradient( -10deg, ' + mainColor + ' 0%, ' + subColor + '100%, ' + thirdColor + '100%)'
			})
		});
	}
	if ($('#author-popup-wrap .bg-poster').length) {
		var authorPopupCover = $('#author-popup-wrap .bg-poster');
		var authorPopupBg = $('#author-popup-wrap .bg-author');
		var colorThief = new ColorThief();
		colorThief.getColorAsync(authorPopupCover.data('img'), function (color, element) {
			var colors = colorThief.getPalette(element, 3);
			var mainColor = 'rgba(' + colors[0][0] + ', ' + colors[0][1] + ', ' + colors[0][2] + ', 1)';
			var subColor = 'rgba(' + colors[1][0] + ', ' + colors[1][1] + ', ' + colors[1][2] + ', 1)';
			var thirdColor = 'rgba(' + colors[2][0] + ', ' + colors[2][1] + ', ' + colors[2][2] + ', 1)';
			authorPopupCover.attr('data-img', '')
			authorPopupCover.css({
				'background-image': 'url("' + cropImagetoDataURI(element) + '")'
			})
			authorPopupBg.css({
				'background': 'linear-gradient( to bottom, ' + mainColor + ' 0%, ' + subColor + '100%, ' + thirdColor + '100%)'
			})
		});
	}

	if ($('.list-banner-style01').length > 0) {
		$('.list-banner-style01 .owl-carousel').owlCarousel({
			items: 1,
			margin: 10,
			loop: true,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			animateOut: 'fadeOut',
			dots: true,
			nav: true,
			navText: ['<i class="iconfont icon-xiangqian"></i>', '<i class="iconfont icon-xianghou"></i>'],
		});
	}

	if ($('.list-banner-style02').length > 0) {
		$('.list-banner-style02 .owl-carousel').owlCarousel({
			loop: true,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			dots: true,
			animateOut: 'fadeOut',
			responsiveClass: true,
			responsive: {
				0: {
					items: 1,
					margin: 10,
				},
				768: {
					items: 3,
					margin: 10,
					center: true,
					autoWidth: true,
					nav: true,
					navText: ['<i class="iconfont icon-zuojiantou-2"></i>', '<i class="iconfont icon-youjiantou-2"></i>'],
				},
				992: {
					items: 3,
					margin: 20,
					center: true,
					autoWidth: true,
					nav: true,
					navText: ['<i class="iconfont icon-zuojiantou-2"></i>', '<i class="iconfont icon-youjiantou-2"></i>'],
				}
			}
		});
	}

	if ($('.list-banner-style03').length > 0) {
		$('.list-banner-style03 .owl-carousel').owlCarousel({
			items: 1,
			margin: 10,
			loop: true,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			dots: true,
			animateOut: 'fadeOut',
			nav: true,
			navText: ['<i class="iconfont icon-xiangqian"></i>', '<i class="iconfont icon-xianghou"></i>']
		});
	}

	if ($('.list-banner-style04').length > 0) {
		$('.list-banner-style04 .owl-carousel').owlCarousel({
			items: 1,
			margin: 10,
			loop: true,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			animateOut: 'fadeOut',
			dots: true,
			nav: true,
			navText: ['<i class="iconfont icon-xiangqian"></i>', '<i class="iconfont icon-xianghou"></i>'],
		});
	}

	if ($(".main-menu li").hasClass("menu-item-has-children")) {
		$(".main-menu li.menu-item-has-children > a").prepend('<span class="sub-menu-icon text-xs iconfont icon-caret-down"></span>')
	};
	$('.sidebar').length > 0 && $('.sidebar').theiaStickySidebar({
		additionalMarginTop: 20,
		additionalMarginBottom: 100
	});

	$('.sidebar-home').length > 0 && $('.sidebar-home').theiaStickySidebar({
		additionalMarginTop: 100,
		additionalMarginBottom: 100
	});


	$('.links-sidebar').length > 0 && $('.links-sidebar').theiaStickySidebar({
		additionalMarginTop: 20,
		additionalMarginBottom: 100
	});
	
	if ($('#widget-scroll-menu').length && toc.tag * 1 !== 0) {
		var observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				var id = entry.target.getAttribute('id');
				if (entry.intersectionRatio > 0) {
					$('.widget-scroll-menu a[href="#' + id + '"]').parent('li').addClass('active');
					return
				}
				$('.widget-scroll-menu a[href="#' + id + '"]').parent('li').removeClass('active');
			});
		});
		$('.post-content h' + toc.tag).each(function (index, element) {
			$(this).attr('id', 'scroll-' + index)
			observer.observe(element);
		})
	}

	// dark mode
	if (globals.allow_switch_darkmode !== '0') {
		if (globals.allow_switch_darkmode === 'device' && window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) setDarkMode()
			window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
				e.matches && setDarkMode()
			});
			if (window.matchMedia("(prefers-color-scheme: light)").matches) setLightMode()
			window.matchMedia("(prefers-color-scheme: light)").addListener(function (e) {
				e.matches && setLightMode()
			});
		}

		$(document).on('click', '.switch-dark-mode', function (event) {
			event.preventDefault();
			// $.ajax({
			// 	url: globals.ajax_url,
			// 	type: 'POST',
			// 	dataType: 'html',
			// 	data: {
			// 		toggle_action: $('body').hasClass('nice-dark-mode') === true ? 'off' : 'on',
			// 		action: 'cosy19_toggle_dark_mode'
			// 	},
			// })
			// 	.done(function (response) {
			// 		if (!$('body').hasClass('nice-dark-mode')) {
			// 			setDarkModeClass()
			// 			return
			// 		}
			// 		setLightModeClass()
			// 	})

				if (!$('body').hasClass('nice-dark-mode')) {
						setDarkModeClass()
						return
					}
					setLightModeClass()
		});
	}

	globals.post_id != 0 && addHistoryView(globals.post_id)
});

function addHistoryView(id) {
	var historyView = JSON.parse(localStorage.getItem('history-view')) || []
	var historyViewTime = new Date(localStorage.getItem('history-view-time'))
	var currentDate = new Date()
	var page = { id: id }

	if (+historyViewTime < +currentDate.setDate(currentDate.getDate() - 7)) {
		historyView = []
		localStorage.setItem('history-view-time', +currentDate)
	}

	for (var i = 0, len = historyView.length; i < len; i++) {
		if (page['id'] && historyView[i]['id'] && page['id'] === historyView[i]['id']) {
			historyView.splice(i, 1);
			break;
		}
	}

	historyView.push(page);

	if (historyView.length > 20) {
		historyView.splice(0, 1);
	}

	localStorage.setItem('history-view', JSON.stringify(historyView));
}

function toggleCommentAuthorInfo() {
	var changeMsg = '<i class="text-xs iconfont icon-bianji"></i>';
	var closeMsg = '<i class="text-xs iconfont icon-check"></i>';
	$('.comment-form-info').slideToggle('slow', function () {
		if ($('.comment-form-info').css('display') == 'none') {
			$('#toggle-comment-author-info').html(changeMsg);
		} else {
			$('#toggle-comment-author-info').html(closeMsg);
		}
	});
};

function ajax_load_comments(data) {
	var buttonDOM = $('#comments-next-button');
	buttonDOM.hide();

	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'html',
		data: data,
	})
		.done(function (response) {
			if (response) {
				if (data.commentspage == 'newest') {
					buttonDOM.data('paged', data.paged * 1 - 1);
				} else {
					buttonDOM.data('paged', data.paged * 1 + 1);
				}
				$('.' + data.append).append(response);
				buttonDOM.show();
			} else {
				buttonDOM.hide();
			}

		})
}

$(document).on('click', '#comments-next-button', function (event) {
	event.preventDefault();
	ajax_load_comments($('#comments-next-button').data());
});
// $(document).on('click', '.search-popup', function (event) {
// 	event.preventDefault();
// 	$('.search-popup-form .form-control').focus();
// 	var $this = $('#search-popup-wrap');
// 	ncPopup('full', $this.html())
// });
$(document).on('click', '.author-popup', function (event) {
	event.preventDefault();
	var $this = $('#author-popup-wrap')
	ncPopup('no-padding', $this.html())
});
$(document).on('click', '.single-popup', function (event) {
	event.preventDefault();
	var img = $(this).data("img");
	var title = $(this).data("title");
	var desc = $(this).data("desc");
	var html = '<div class="text-center"><div class="text-lg mb-1">' + title + '</div>\
				<div class="text-muted text-xs mb-2">('+ desc + ')</div>\
				<img src="' + img + '" alt="' + title + '" style="width:100%;height:auto;">\
				</div>'
	ncPopup('small', html)
});

$(document).on("click", '.btn-action-like[data-action="like"]', function () {
	event.preventDefault();
	var $this = $(this);
	var id = $this.data("id");

	if ($this.hasClass('requesting')) {
		return false;
	}
	$this.addClass('requesting');

	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'html',
		data: { action: 'cosy19_like', id, like_action: 'like' },
	})
		.done(function (data) {
			$('.btn-action-like').addClass('current');
			$('.btn-action-like').attr('data-action', 'unlike');
			ncPopupTips(1, __cosy__.thank_you)
			$('.like-count').html(data.trim());
		})
		.always(function () {
			$this.removeClass('requesting');
		})
	return false;
});
$(document).on("click", '.btn-action-like[data-action="unlike"]', function () {
	event.preventDefault();

	var $this = $(this);
	var id = $this.data("id");

	if ($this.hasClass('requesting')) {
		return false;
	}

	$this.addClass('requesting');

	$this.removeClass('current');

	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'html',
		data: { action: 'cosy19_like', id, like_action: 'unlike' },
	})
		.done(function (data) {
			$('.btn-action-like').removeClass('current');
			$('.btn-action-like').attr('data-action', 'like');
			ncPopupTips(0, __cosy__.cancelled)
			$('.like-count').html(data.trim());
		})
		.always(function () {
			$this.removeClass('requesting');
		})
	return false;
});

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
function givenElementInViewport(el, fn) {
	return function () {
		if (isElementInViewport(el)) {
			fn.call();
		}
	}
}
function addViewportEvent(el, fn) {
	if (window.addEventListener) {
		addEventListener('DOMContentLoaded', givenElementInViewport(el, fn), false);
		addEventListener('load', givenElementInViewport(el, fn), false);
		addEventListener('scroll', givenElementInViewport(el, fn), false);
		addEventListener('resize', givenElementInViewport(el, fn), false);
	} else if (window.attachEvent) {
		attachEvent('DOMContentLoaded', givenElementInViewport(el, fn));
		attachEvent('load', givenElementInViewport(el, fn));
		attachEvent('scroll', givenElementInViewport(el, fn));
		attachEvent('resize', givenElementInViewport(el, fn));
	}
}

if ($('.posts-ajax-load').length > 0) {
	addViewportEvent(document.querySelector('.posts-ajax-load'), function () {
		if ($('.dposts-ajax-load').data('comments') == 'comments') {
			return false;
		}

		if ($('.dposts-ajax-load').hasClass('loading') === false) {
			var data = $('.dposts-ajax-load').data();
			if ($('.dposts-ajax-load').data('paged') <= 3) {
				$('.dposts-ajax-load').addClass('loading');
				ajax_load_posts($('.dposts-ajax-load').data());
			}

		}

	});
}

$(document).on('click', '.dposts-ajax-load', function (event) {
	event.preventDefault();
	var $this = jQuery(this)
	if ($this.hasClass('loading') === false) {
		$this.addClass('loading');
		ajax_load_posts($this.data());
	}
});

// $(document).on('click', '.list-ajax-nav .item-ajax-nav', function (event) {
// 	event.preventDefault();
// 	var t = $(this);
// 	if (!t.hasClass('active')) {
// 		$('.list-ajax-nav .item-ajax-nav').removeClass('active');
// 		t.addClass('active');

// 		var cid = t.find('a').data('cid');
// 		if (cid) {
// 			$('.dposts-ajax-load').data('tabcid', cid);
// 		} else {
// 			$('.dposts-ajax-load').removeData('tabcid');
// 		}
// 		$('.dposts-ajax-load').data('paged', 1);
// 		$('.list-home').html('');
// 		$('.dposts-ajax-load').addClass('loading').text(__cosy__.load_more);
// 		ajax_load_posts($('.dposts-ajax-load').data());
// 	}
// });

$(document).on('click', '.list-ajax-nav .item-ajax-nav', function (event) {
	event.preventDefault();
	var t = $(this);
	if (!t.hasClass('active')) {
		$('.list-ajax-nav .item-ajax-nav').removeClass('active');
		t.addClass('active');
		var text = $(t).text().trim();
		$("div[name='category_item']").attr("style","display:none !important");
		//$("div[data-show-flag='["+text+"]']").show();
		$("div[data-show-flag='"+text+"']").show();

		
		//$('.list-home').html('');
		//$('.dposts-ajax-load').addClass('loading').text(__cosy__.load_more);
		//ajax_load_posts($('.dposts-ajax-load').data());
	}
});

function ajax_load_posts(data) {
	$('.ajax-loading').show();

	var loadButton = jQuery('.dposts-ajax-load')
	loadButton.hide();

	var times = globals.posts_per_page
	while (times--) $('.' + data.append).append($('template.card-skeleton').html());

	$.ajax({
		url: globals.ajax_url,
		type: 'POST',
		dataType: 'html',
		data: data,
	})
		.done(function (response) {
			loadButton.removeAttr('disabled');
			if (response.trim()) {
				loadButton.data('paged', data.paged * 1 + 1);
				$('.' + data.append).append(response);
				loadButton.removeClass('loading').show();
			} else {
				loadButton.attr('disabled', 'disabled');
				loadButton.addClass('disabled').show();
				loadButton.text(__cosy__.reached_the_end).show();
			}
		})
		.always(function () {
			$('div.card-skeleton').detach()
			$('.ajax-loading').hide();
		});
}

/*
	mobile-sidebar-tab-menu
	----------------------------------------------------
*/
$(document).on('click', '#mobile-sidebar-trigger', function (event) {
	event.preventDefault();
	$('.mobile-sidebar').addClass('open');
	$('body').addClass('modal-open');
});
$(document).on('click', '#mobile-sidebar-close,.mobile-overlay', function (event) {
	$('.mobile-sidebar').removeClass('open');
	$('body').removeClass('modal-open');
});
$(window).resize(function () {
	$('.mobile-sidebar').removeClass('open');
	$('body').removeClass('modal-open');
});

//console.log('\n' + ' %c Cosy Designed by nicetheme® %c https://www.nicetheme.cn ' + '\n', 'color: #fadfa3; background: #030307; padding:5px 0; font-size:18px;', 'background: #fadfa3; padding:5px 0; font-size:18px;');
