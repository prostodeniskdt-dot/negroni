// Логика страницы партнёров (partners.html).
// Анимация счётчиков, FAQ аккордеон, валидация формы.

(function () {
  'use strict';

  // === Анимация счётчиков ===
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    // Используем IntersectionObserver для запуска только при видимости
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.dataset.count + '+'; });
      return;
    }

    var observed = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          counters.forEach(function (el) {
            var target = parseInt(el.dataset.count, 10) || 0;
            var duration = 1500;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              // Easing: ease-out cubic
              var ease = 1 - Math.pow(1 - progress, 3);
              var current = Math.round(start + (target - start) * ease);
              el.textContent = current + '+';
              if (progress < 1) {
                requestAnimationFrame(step);
              }
            }

            requestAnimationFrame(step);
          });
        }
      });
    }, { threshold: 0.3 });

    var statsSection = document.getElementById('partnerStats');
    if (statsSection) observer.observe(statsSection);
  }

  // === FAQ аккордеон ===
  function initFAQ() {
    var items = document.querySelectorAll('.partners-faq-item');
    items.forEach(function (item) {
      var question = item.querySelector('.partners-faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Закрыть все
        items.forEach(function (i) { i.classList.remove('open'); });

        // Открыть текущий (если был закрыт)
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // === Валидация и отправка формы ===
  function initForm() {
    var form = document.getElementById('partnerContactForm');
    var statusEl = document.getElementById('formStatus');
    var i18n = window.NegroniI18n;
    if (!form || !statusEl) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.className = 'partners-form-status';

      var name = form.elements.name ? form.elements.name.value.trim() : '';
      var company = form.elements.company ? form.elements.company.value.trim() : '';
      var email = form.elements.email ? form.elements.email.value.trim() : '';

      // Валидация
      if (!name) {
        statusEl.textContent = i18n ? i18n.t('partners.errName') : 'Пожалуйста, укажите ваше имя.';
        statusEl.classList.add('error');
        form.elements.name.focus();
        return;
      }

      if (!company) {
        statusEl.textContent = i18n ? i18n.t('partners.errCompany') : 'Пожалуйста, укажите название компании или бренда.';
        statusEl.classList.add('error');
        form.elements.company.focus();
        return;
      }

      if (!email || !isValidEmail(email)) {
        statusEl.textContent = i18n ? i18n.t('partners.errEmail') : 'Пожалуйста, укажите корректный email.';
        statusEl.classList.add('error');
        form.elements.email.focus();
        return;
      }

      // Собираем данные
      var formData = {
        name: name,
        company: company,
        email: email,
        phone: form.elements.phone ? form.elements.phone.value.trim() : '',
        tier: form.elements.tier ? form.elements.tier.value : '',
        message: form.elements.message ? form.elements.message.value.trim() : ''
      };

      // Аналитика
      if (window.NegroniAnalytics) {
        window.NegroniAnalytics.track('partner_form_submit', {
          company: formData.company,
          tier: formData.tier
        });
      }

      // Имитация отправки (заменить на реальный endpoint)
      statusEl.textContent = i18n ? i18n.t('partners.formSending') : 'Отправляем...';
      statusEl.className = 'partners-form-status';

      setTimeout(function () {
        // Здесь можно подключить реальную отправку:
        // fetch('/api/partners', { method: 'POST', body: JSON.stringify(formData) })

        statusEl.textContent = i18n ? i18n.t('partners.formSuccess') : 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 2 рабочих дней.';
        statusEl.classList.add('success');
        form.reset();

        // Также можно отправить на email через сервис типа Formspree:
        // action="https://formspree.io/f/xxxxx" method="POST"
      }, 800);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // === Плавный скролл к форме при клике по ссылкам ===
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // === Инициализация ===
  animateCounters();
  initFAQ();
  initForm();
  initSmoothScroll();
})();
