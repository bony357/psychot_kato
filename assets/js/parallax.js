/**
 * Parallax effect for iOS Safari
 * Replaces CSS background-attachment: fixed which doesn't work properly on iOS
 */
(function() {
  'use strict';

  // Detect iOS devices (including iPadOS)
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  // Add iOS class to html element for CSS targeting
  if (isIOS()) {
    document.documentElement.classList.add('ios-device');
  } else {
    // Not iOS, use CSS parallax - no JavaScript needed
    return;
  }

  // Get all elements with parallax background
  var parallaxElements = document.querySelectorAll('.masthead');
  
  if (parallaxElements.length === 0) {
    return;
  }

  // Throttle function for performance
  function throttle(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Parallax scroll handler
  function updateParallax() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    parallaxElements.forEach(function(element) {
      var rect = element.getBoundingClientRect();
      var elementTop = rect.top + scrollTop;
      var windowHeight = window.innerHeight;
      
      // Only apply parallax when element is in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        // Calculate parallax offset
        // The background moves slower than the scroll (0.5 = half speed)
        var parallaxOffset = (scrollTop - elementTop + windowHeight) * 0.5;
        
        // Apply background position to create parallax effect
        element.style.backgroundPosition = 'center ' + parallaxOffset + 'px';
      }
    });
  }

  // Throttled version for better performance (runs max every 16ms ~60fps)
  var throttledUpdate = throttle(updateParallax, 16);

  // Initialize parallax on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateParallax);
  } else {
    updateParallax();
  }

  // Update on scroll
  window.addEventListener('scroll', throttledUpdate, { passive: true });
  
  // Update on resize
  window.addEventListener('resize', throttledUpdate, { passive: true });
  
  // Update on orientation change (important for mobile)
  window.addEventListener('orientationchange', function() {
    setTimeout(updateParallax, 100);
  });
})();

