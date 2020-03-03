/* global angular */
angular.module('webstar', ['ngAnimate', 'ngTouch', 'ui.bootstrap'])

.component('app', {
	templateUrl: 'component/app.html',
	controller: function($window, ScrollService)
	{
		var $ctrl = this;
		
		var s = $window.skrollr.init({
			smoothScrolling: false,
			forceHeight: false,
		});
		if(s.isMobile())
		{
			$ctrl.mobile = true;
			s.destroy();
		}
		
		$ctrl.scrollTo = ScrollService.scrollTo;
	}
})

.directive('mouseGuide', function($window)
{
	return {
		restrict: 'C',
		link: function(scope, elem, attrs)
		{
			angular.element($window.document).click(function()
			{
				elem.css('background', 'rgb(' + Math.random() + ',' + Math.random() + ',' + Math.random() + ')');
			});
			
			elem.css('left', '-100px');
			angular.element($window.document).on('mousemove', function(event)
			{
				elem.css('left', event.clientX + 'px');
			});
		}
	};
})

.directive('stickyTop', function($window)
{
	return {
		restrict: 'C',
		link: function(scope, elem, attrs)
		{
			elem.after(angular.element('<div>').css('min-height', elem.height() + 'px'));
			
			var s = $window.skrollr.get();
			if(!s) return;
			
			var pos;
			resetPos();
			
			function resetPos()
			{
				pos = elem.offset().top;
			}
			
			angular.element($window).on('resize', resetPos);
			
			angular.element($window.document).on('scroll', function()
			{
				elem.toggleClass('attached', $window.scrollY > pos);
			});
		}
	};
})

.service('ScrollService', function($window, $timeout, BrowserService)
{
	this.scrollTo = function(offset)
	{
		if(typeof offset === 'string') offset = angular.element('[name=' + offset + ']').offset().top;
		
		if(BrowserService.guess !== 'Firefox')
		{
			angular.element('html,body').animate({
				scrollTop: offset,
			}, 500);
		}
		else
		{
			$timeout(function() {$window.scrollTo(0, offset)}, 0, false);
		}
	}
})

.service('BrowserService', function($window)
{
	this.guess = null;
	if($window.navigator.userAgent.search('Firefox') > -1) this.guess = 'Firefox';
})