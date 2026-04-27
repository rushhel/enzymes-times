/* ЭТРА v6 — Interactive behaviors
   - Intro video gateway (auto-dismiss after 5s, skippable, localStorage memory)
   - Promo bar dismiss
   - Sticky header scroll state
   - Mobile menu
   - "Зачем вы тут?" tabs
   - "С чего начать" accordion expand
   - Team bio expand
   - Product modal (reads from window.PRODUCTS)
   - About / Video modal
   - Cart (localStorage persistence, drawer)
   - Quiz modal (5 placeholder questions → product recommendation)
   - Catalog category filters
   - Scroll reveal
*/

(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function pluralize(n, one, few, many) {
    var mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  /* safe DOM builder — no innerHTML with dynamic values */
  function el(tagSpec, attrs, children) {
    var parts = tagSpec.split('.');
    var tag = parts.shift();
    var node = document.createElement(tag);
    parts.forEach(function (c) { if (c) node.classList.add(c); });
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        node.setAttribute(k, String(v));
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (child) {
        if (child === null || child === undefined || child === false) return;
        if (typeof child === 'string' || typeof child === 'number') {
          node.appendChild(document.createTextNode(String(child)));
        } else {
          node.appendChild(child);
        }
      });
    }
    return node;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* ------------------ intro gateway ------------------ */
  function initIntroGate() {
    var gate = $('.intro-gate');
    if (!gate) return;
    var seen = false;
    try { seen = localStorage.getItem('etra_v8_intro_seen') === '1'; } catch (e) {}
    if (seen) {
      gate.classList.add('is-dismissed');
      setTimeout(function () { gate.parentNode && gate.parentNode.removeChild(gate); }, 100);
      return;
    }

    var vid = $('.intro-gate__video');
    if (vid) {
      vid.muted = true;
      vid.playsInline = true;
      vid.play().catch(function () {});
    }

    function dismiss() {
      gate.classList.add('is-dismissed');
      try { localStorage.setItem('etra_v8_intro_seen', '1'); } catch (e) {}
      setTimeout(function () {
        if (gate.parentNode) gate.parentNode.removeChild(gate);
      }, 950);
    }

    var skip = $('.intro-gate__skip');
    if (skip) skip.addEventListener('click', dismiss);
    setTimeout(dismiss, 5200);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Enter') dismiss();
    }, { once: true });
  }

  /* ------------------ promo bar ------------------ */
  function initPromoBar() {
    var bar = $('.promo-bar');
    var close = $('.promo-bar__close');
    if (!bar || !close) return;
    try {
      if (localStorage.getItem('etra_v8_promo_dismissed') === '1') {
        document.body.classList.add('promo-dismissed');
        bar.style.display = 'none';
      }
    } catch (e) {}
    close.addEventListener('click', function () {
      document.body.classList.add('promo-dismissed');
      try { localStorage.setItem('etra_v8_promo_dismissed', '1'); } catch (e) {}
      setTimeout(function () { bar.style.display = 'none'; }, 600);
    });
  }

  /* ------------------ sticky header ------------------ */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------ mobile menu ------------------ */
  function initMobileMenu() {
    var toggle = $('.menu-toggle');
    var menu = $('.site-nav');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
    });
    $$('.site-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ------------------ purpose inline accordion ------------------ */
  function initPurposeTabs() {
    var items = $$('.purpose-item');
    if (!items.length) return;
    items.forEach(function (item) {
      var btn = $('.purpose-item__title', item);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var wasActive = item.classList.contains('is-active');
        items.forEach(function (i) { i.classList.remove('is-active'); });
        if (!wasActive) item.classList.add('is-active');
      });
    });
  }

  /* ------------------ start accordion ------------------ */
  function initStartAccordion() {
    var btn = $('.start-hero__toggle');
    var wrap = $('.start-hero');
    if (!btn || !wrap) return;
    btn.addEventListener('click', function () { wrap.classList.toggle('is-open'); });
  }

  /* ------------------ team bios ------------------ */
  function initTeam() {
    $$('.team-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var open = card.classList.toggle('is-open');
        if (open) {
          $$('.team-card').forEach(function (c) { if (c !== card) c.classList.remove('is-open'); });
        }
      });
    });
  }

  /* ------------------ product modal ------------------ */
  function initProductModal() {
    var modal = $('.product-modal');
    if (!modal) return;
    var body = $('.product-modal__body', modal);

    function close() {
      modal.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    function open(key) {
      var p = window.PRODUCTS && window.PRODUCTS[key];
      if (!p) return;
      clear(body);

      var closeBtn = el('button.product-modal__close', { 'aria-label': 'Закрыть' }, '×');
      closeBtn.addEventListener('click', close);

      var media = el('div.product-modal__media', null, [el('img', { src: p.img, alt: p.name })]);

      var addBtn = el('button.btn.btn--primary', null, 'В корзину');
      addBtn.addEventListener('click', function () { Cart.add(key); Cart.flash(); close(); });

      var info = el('div.product-modal__info', null, [
        el('span.product-modal__cat', null, p.category),
        el('h3.product-modal__title', null, p.name),
        el('p.product-modal__tagline', null, p.tagline),
        el('div.product-modal__rating', null, [
          el('span.stars', null, '★'.repeat(Math.round(p.rating))),
          el('span.rating-text', null, ' ' + p.rating + ' · ' + p.reviews + ' отзывов')
        ]),
        el('p.product-modal__desc', null, p.description),
        el('div.product-modal__meta', null, [
          el('div', null, [el('span.label', null, 'Объём'), p.volume]),
          el('div', null, [el('span.label', null, 'Вкус'), p.taste])
        ]),
        el('ul.product-modal__benefits', null, p.benefits.map(function (b) { return el('li', null, b); })),
        el('div.product-modal__cta', null, [el('span.product-modal__price', null, p.price), addBtn])
      ]);

      body.appendChild(closeBtn);
      body.appendChild(media);
      body.appendChild(info);
      modal.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }

    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-product]');
      if (!target) return;
      e.preventDefault();
      open(target.dataset.product);
    });
  }

  /* ------------------ about / video modal ------------------ */
  function initAboutModal() {
    var modal = $('.about-modal');
    if (!modal) return;
    var vid = $('.about-modal__video video', modal);
    var closeBtn = $('.about-modal__close', modal);

    function open() {
      modal.classList.add('is-open');
      document.body.classList.add('no-scroll');
      if (vid) { vid.currentTime = 0; vid.play().catch(function () {}); }
    }
    function close() {
      modal.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      if (vid) vid.pause();
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    $$('.js-open-about').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
  }

  /* ------------------ cart ------------------ */
  var Cart = (function () {
    var STORAGE_KEY = 'etra_v8_cart';
    var items = [];

    function load() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        items = raw ? JSON.parse(raw) : [];
      } catch (e) { items = []; }
    }
    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (e) {}
    }
    function add(key) {
      var p = window.PRODUCTS && window.PRODUCTS[key];
      if (!p) return;
      var existing = items.find(function (i) { return i.key === key; });
      if (existing) existing.qty += 1;
      else items.push({ key: key, name: p.name, price: p.priceNum, img: p.img, qty: 1 });
      save();
      render();
    }
    function remove(key) {
      items = items.filter(function (i) { return i.key !== key; });
      save();
      render();
    }
    function count() { return items.reduce(function (n, i) { return n + i.qty; }, 0); }
    function total() { return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0); }

    function buildItemNode(i) {
      var img = el('img', { src: i.img, alt: '' });
      var info = el('div.cart-item__info', null, [
        el('div.cart-item__name', null, i.name),
        el('div.cart-item__meta', null, '€' + i.price + ' × ' + i.qty)
      ]);
      var removeBtn = el('button.cart-item__remove', { 'aria-label': 'Удалить' }, '×');
      removeBtn.addEventListener('click', function () { remove(i.key); });
      return el('div.cart-item', null, [img, info, removeBtn]);
    }

    function render() {
      var badge = $('.cart-toggle__count');
      if (badge) {
        var c = count();
        badge.textContent = String(c);
        badge.classList.toggle('is-empty', c === 0);
      }
      var drawer = $('.cart-drawer');
      if (!drawer) return;
      var list = $('.cart-drawer__list', drawer);
      var totalEl = $('.cart-drawer__total', drawer);
      clear(list);
      if (!items.length) {
        list.appendChild(el('p.cart-drawer__empty', null, [
          'Корзина пуста.',
          el('br'),
          'Начните со стартового набора.'
        ]));
      } else {
        items.forEach(function (i) { list.appendChild(buildItemNode(i)); });
      }
      totalEl.textContent = '€' + total();
    }

    function flash() {
      var badge = $('.cart-toggle');
      if (!badge) return;
      badge.classList.add('is-flash');
      setTimeout(function () { badge.classList.remove('is-flash'); }, 600);
    }

    function initToggle() {
      var toggle = $('.cart-toggle');
      var drawer = $('.cart-drawer');
      var backdrop = $('.cart-backdrop');
      if (!toggle || !drawer) return;
      var openDrawer = function () {
        drawer.classList.add('is-open');
        if (backdrop) backdrop.classList.add('is-visible');
        document.body.classList.add('no-scroll');
      };
      var closeDrawer = function () {
        drawer.classList.remove('is-open');
        if (backdrop) backdrop.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
      };
      toggle.addEventListener('click', openDrawer);
      var closeBtn = $('.cart-drawer__close', drawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (backdrop) backdrop.addEventListener('click', closeDrawer);
    }

    return { load: load, add: add, remove: remove, render: render, flash: flash, initToggle: initToggle };
  })();

  /* ------------------ quiz ------------------ */
  var QUIZ = {
    questions: [
      {
        q: 'Как вы оцениваете свой уровень энергии?',
        options: [
          { label: 'Низкий — устаю быстро', score: { energy: 2, detox: 1 } },
          { label: 'Средний — по-разному', score: { energy: 1 } },
          { label: 'Высокий — полон сил', score: {} }
        ]
      },
      {
        q: 'Как у вас со сном?',
        options: [
          { label: 'Плохо — не высыпаюсь', score: { detox: 2 } },
          { label: 'Нормально', score: { detox: 1 } },
          { label: 'Отлично', score: {} }
        ]
      },
      {
        q: 'Как работает пищеварение?',
        options: [
          { label: 'Есть проблемы — вздутие, дискомфорт', score: { gut: 3 } },
          { label: 'Иногда неидеально', score: { gut: 1 } },
          { label: 'Всё хорошо', score: {} }
        ]
      },
      {
        q: 'Хотите ли снизить вес или очиститься?',
        options: [
          { label: 'Да, чистка и снижение веса', score: { detox: 2 } },
          { label: 'Нет, скорее поддержать форму', score: { starter: 1 } }
        ]
      },
      {
        q: 'Есть проблемы с кожей или иммунитетом?',
        options: [
          { label: 'Да, бывают высыпания или простуды', score: { gut: 1, detox: 1 } },
          { label: 'Нет, всё в порядке', score: { starter: 1 } }
        ]
      }
    ],
    scores: null,
    index: 0
  };

  function initQuiz() {
    var modal = $('.quiz-modal');
    if (!modal) return;
    var body = $('.quiz-modal__body', modal);

    function close() {
      modal.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    function renderResult() {
      var best = 'starter', max = -1;
      Object.keys(QUIZ.scores).forEach(function (k) {
        if (QUIZ.scores[k] > max) { max = QUIZ.scores[k]; best = k; }
      });
      var recKey = (window.QUIZ_RECOMMENDATIONS || {})[best] || 'praenzyme';
      var p = window.PRODUCTS[recKey];
      clear(body);

      var closeBtn = el('button.quiz-modal__close', { 'aria-label': 'Закрыть' }, '×');
      closeBtn.addEventListener('click', close);

      var addBtn = el('button.btn.btn--primary', null, 'Добавить в корзину');
      addBtn.addEventListener('click', function () { Cart.add(recKey); Cart.flash(); close(); });

      var restartBtn = el('button.btn.btn--ghost', null, 'Пройти заново');
      restartBtn.addEventListener('click', open);

      var card = el('div.quiz-result__card', { 'data-product': recKey }, [
        el('img', { src: p.img, alt: p.name }),
        el('div', null, [
          el('div.quiz-result__card-name', null, p.name),
          el('div.quiz-result__card-tagline', null, p.tagline),
          el('div.quiz-result__card-price', null, p.price)
        ])
      ]);

      body.appendChild(closeBtn);
      body.appendChild(el('div.quiz-result', null, [
        el('div.quiz-result__meta', null, 'ВАША РЕКОМЕНДАЦИЯ'),
        el('h3.quiz-result__title', null, 'Начните с — ' + p.name),
        el('p.quiz-result__subtitle', null, 'На основе ваших ответов, это ваш лучший первый шаг.'),
        card,
        el('div.quiz-result__actions', null, [addBtn, restartBtn])
      ]));
    }

    function render() {
      if (QUIZ.index >= QUIZ.questions.length) { renderResult(); return; }
      var q = QUIZ.questions[QUIZ.index];
      var step = (QUIZ.index + 1) + ' / ' + QUIZ.questions.length;
      clear(body);

      var closeBtn = el('button.quiz-modal__close', { 'aria-label': 'Закрыть' }, '×');
      closeBtn.addEventListener('click', close);

      var optionButtons = q.options.map(function (opt) {
        var b = el('button.quiz-option', null, opt.label);
        b.addEventListener('click', function () {
          Object.keys(opt.score || {}).forEach(function (k) {
            QUIZ.scores[k] = (QUIZ.scores[k] || 0) + opt.score[k];
          });
          QUIZ.index += 1;
          render();
        });
        return b;
      });

      body.appendChild(closeBtn);
      body.appendChild(el('div.quiz-step', null, [
        el('div.quiz-step__meta', null, 'ПРОЙТИ ТЕСТ · ' + step),
        el('h3.quiz-step__q', null, q.q),
        el('div.quiz-step__options', null, optionButtons)
      ]));
    }

    function open() {
      QUIZ.scores = { energy: 0, detox: 0, gut: 0, starter: 0 };
      QUIZ.index = 0;
      modal.classList.add('is-open');
      document.body.classList.add('no-scroll');
      render();
    }

    $$('.js-open-quiz').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  /* ------------------ catalog with filters ------------------ */
  var CATALOG_ORDER = ['praenzyme', 'energetic', 'etragenez', 'bifidumfanata', 'twostarters', 'parasiteoff', 'biotarkhun', 'twocourses'];
  /* category for filter chips — maps to product.category */
  var CATEGORIES = [
    { key: 'all',       label: 'Все продукты' },
    { key: 'drinks',    label: 'Все напитки' },
    { key: 'courses',   label: 'Курсы и наборы' },
    { key: 'bar',       label: 'Здоровый Бар' },
    { key: 'special',   label: 'Специальный выпуск' },
    { key: 'cosmetics', label: 'Съедобная косметика' },
    { key: 'cleanse',   label: 'Питание и чистки' },
    { key: 'complex',   label: 'Комплексные решения' }
  ];
  var SEGMENT_LABELS = {
    drinks:    'Все напитки',
    courses:   'Курсы и наборы',
    bar:       'Здоровый Бар',
    special:   'Специальный выпуск',
    cosmetics: 'Съедобная косметика',
    cleanse:   'Питание и чистки',
    complex:   'Комплексные решения'
  };
  var SEGMENT_ORDER = ['drinks', 'courses', 'bar', 'special', 'cosmetics', 'cleanse', 'complex'];
  var currentFilter = 'all';

  function buildProductCard(key) {
    var p = window.PRODUCTS[key];
    if (!p) return null;
    var card = el('article.product-card.reveal', { 'data-product': key, 'data-category': p.category, 'data-segment': p.segment });
    if (p.badge) {
      card.appendChild(el('span.product-card__badge.product-card__badge--' + p.badge, null, p.badge));
    }
    card.appendChild(el('div.product-card__media', null, [
      el('img', { src: p.img, alt: p.name, loading: 'lazy' })
    ]));
    card.appendChild(el('div.product-card__body', null, [
      el('span.product-card__cat', null, p.category),
      el('h4.product-card__name', null, p.name),
      el('p.product-card__tagline', null, p.tagline),
      el('div.product-card__footer', null, [
        el('span.product-card__price', null, p.price),
        el('button.product-card__cta', { type: 'button' }, 'Подробнее →')
      ])
    ]));
    return card;
  }

  function applyFilter() {
    $$('.product-card').forEach(function (card) {
      var cat = card.dataset.category;
      var visible = currentFilter === 'all' || cat === currentFilter;
      card.style.display = visible ? '' : 'none';
    });
  }

  function initCatalog() {
    var segContainer = document.getElementById('catalog-segments');
    var rail = $('.catalog-rail');
    var filterRow = $('.catalog-filters');
    var container = segContainer || rail;
    if (!container) return;

    clear(container);

    // Group products by segment
    var groups = {};
    CATALOG_ORDER.forEach(function (key) {
      var p = window.PRODUCTS[key];
      if (!p) return;
      var seg = p.segment || 'other';
      if (!groups[seg]) groups[seg] = [];
      groups[seg].push(key);
    });

    if (segContainer) {
      // Segmented rendering (catalog page)
      SEGMENT_ORDER.forEach(function (seg) {
        var keys = groups[seg] || [];
        var header = el('div.catalog-segment__header', null, [
          el('h3.catalog-segment__title', null, SEGMENT_LABELS[seg] || seg),
          keys.length
            ? el('span.catalog-segment__count', null, keys.length + ' ' + pluralize(keys.length, 'продукт', 'продукта', 'продуктов'))
            : el('span.catalog-segment__count.catalog-segment__soon', null, 'Скоро')
        ]);
        var segRail = el('div.catalog-rail');
        if (keys.length) {
          keys.forEach(function (key) {
            var card = buildProductCard(key);
            if (card) segRail.appendChild(card);
          });
        } else {
          segRail.appendChild(el('div.catalog-segment__empty', null, 'Новые продукты скоро появятся'));
        }
        var section = el('div.catalog-segment', { 'data-segment': seg }, [header, segRail]);
        segContainer.appendChild(section);
      });
    } else {
      // Flat rendering (homepage or fallback)
      CATALOG_ORDER.forEach(function (key) {
        var card = buildProductCard(key);
        if (card) container.appendChild(card);
      });

      if (filterRow) {
        clear(filterRow);
        CATEGORIES.forEach(function (cat) {
          var btn = el('button.catalog-filter', { type: 'button', 'data-filter': cat.key }, cat.label);
          if (cat.key === currentFilter) btn.classList.add('is-active');
          btn.addEventListener('click', function () {
            currentFilter = cat.key;
            $$('.catalog-filter').forEach(function (b) {
              b.classList.toggle('is-active', b.dataset.filter === currentFilter);
            });
            applyFilter();
          });
          filterRow.appendChild(btn);
        });
      }
    }

    initReveal();
  }

  /* ------------------ scroll reveal ------------------ */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(function (e) { e.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    $$('.reveal').forEach(function (e) { io.observe(e); });
  }

  /* ------------------ smooth anchors ------------------ */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ------------------ boot ------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initIntroGate();
    initPromoBar();
    initHeader();
    initMobileMenu();
    initPurposeTabs();
    initStartAccordion();
    initTeam();
    initCatalog();
    initProductModal();
    initAboutModal();
    Cart.load();
    Cart.initToggle();
    Cart.render();
    initQuiz();
    initReveal();
    initAnchors();
  });
})();
