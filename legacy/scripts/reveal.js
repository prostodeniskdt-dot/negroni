// Появление секций с классом .reveal при скролле.
// Progressive enhancement: если IntersectionObserver не поддерживается,
// все элементы сразу становятся видимыми.

(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Фолбэк для старых браузеров
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Перестаём следить после появления
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();
