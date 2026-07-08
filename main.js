/* Source Layer — main.js: header scroll state, mobile menu, reveal-on-scroll */
(function () {
  'use strict';

  var hdr = document.querySelector('.hdr');

  // Header scrolled state
  function onScroll() {
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn && hdr) {
    menuBtn.addEventListener('click', function () {
      var open = hdr.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on link tap
    hdr.querySelectorAll('.mnav a').forEach(function (a) {
      a.addEventListener('click', function () {
        hdr.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal on scroll (respects reduced motion via CSS)
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) {
      // Reveal anything already in view immediately; observe the rest
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('in');
      } else {
        io.observe(el);
      }
    });
    // Safety net: never leave content hidden if callbacks don't arrive
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add('in'); });
      io.disconnect();
    }, 1800);
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
