(function () {
  var config = window.SCRUBS_CONFIG || {};
  var catalog = window.SCRUBS_CATALOG || [];

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function formatPrice(n) {
    return 'PKR ' + Number(n).toLocaleString('en-PK');
  }

  function whatsappUrl(text) {
    return (
      'https://wa.me/' +
      config.whatsappNumber +
      '?text=' +
      encodeURIComponent(text)
    );
  }

  function telHref() {
    var n = String(config.whatsappNumber || '');
    return n.charAt(0) === '+' ? 'tel:' + n : 'tel:+' + n;
  }

  function productHref(product) {
    return 'product.html?slug=' + encodeURIComponent(product.slug);
  }

  function colorDots(product) {
    return (
      '<span class="color-dots">' +
      product.colors
        .map(function (c) {
          return (
            '<span class="color-dot" style="background:' +
            c.hex +
            '" title="' +
            c.name +
            '"></span>'
          );
        })
        .join('') +
      '</span>'
    );
  }

  function renderCard(product) {
    return (
      '<a class="product-card reveal" href="' +
      productHref(product) +
      '">' +
      '<div class="product-card-media">' +
      '<img src="' +
      product.image +
      '" alt="">' +
      '</div>' +
      '<div class="product-card-body">' +
      '<p class="product-card-category">' +
      product.categoryLabel +
      '</p>' +
      '<h3 class="product-card-name">' +
      product.name +
      '</h3>' +
      '<div class="product-card-meta">' +
      '<span class="product-card-price">' +
      formatPrice(product.price) +
      '</span>' +
      colorDots(product) +
      '</div>' +
      '</div>' +
      '</a>'
    );
  }

  function initNav() {
    var toggle = qs('.nav-toggle');
    var links = qs('.nav-links');
    var backdrop = qs('[data-nav-backdrop]');
    if (!toggle || !links) return;

    function close() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      links.classList.remove('is-open');
      if (backdrop) backdrop.hidden = true;
    }

    function open() {
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      links.classList.add('is-open');
      if (backdrop) backdrop.hidden = false;
    }

    toggle.addEventListener('click', function () {
      if (document.body.classList.contains('nav-open')) close();
      else open();
    });

    if (backdrop) backdrop.addEventListener('click', close);
    qsa('a', links).forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initConfigCopy() {
    qsa('[data-config="phone"]').forEach(function (el) {
      el.textContent = config.phoneDisplay;
    });
    qsa('[data-config="city"]').forEach(function (el) {
      el.textContent = config.city;
    });
    qsa('[data-config="email"]').forEach(function (el) {
      el.textContent = config.email;
      if (el.tagName === 'A') el.href = 'mailto:' + config.email;
    });
    qsa('[data-config-phone-link]').forEach(function (el) {
      el.href = telHref();
      if (!el.textContent.trim()) el.textContent = config.phoneDisplay;
    });
    qsa('[data-whatsapp-link]').forEach(function (el) {
      el.href = whatsappUrl(
        'Hello, I would like to order uniforms from ' + config.brandName + '.'
      );
    });
  }

  function initFeatured() {
    var grid = qs('[data-featured-grid]');
    if (!grid) return;
    var featured = catalog.filter(function (p) {
      return p.featured;
    });
      grid.innerHTML = featured.map(renderCard).join('');
      observeReveals(grid);
  }

  function initShop() {
    var grid = qs('[data-shop-grid]');
    if (!grid) return;

    var params = new URLSearchParams(location.search);
    var category = params.get('category') || 'all';
    var color = params.get('color') || 'all';

    function apply() {
      qsa('[data-filter-category]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter-category') === category);
      });
      qsa('[data-filter-color]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter-color') === color);
      });

      var matches = catalog.filter(function (p) {
        var catOk = category === 'all' || p.category === category;
        var colorOk =
          color === 'all' ||
          p.colors.some(function (c) {
            return c.id === color;
          });
        return catOk && colorOk;
      });

      if (!matches.length) {
        grid.innerHTML =
          '<p class="empty-state">No uniforms match those filters. <button type="button" class="text-link" data-clear-filters>Clear filters</button></p>';
        var clearBtn = qs('[data-clear-filters]', grid);
        if (clearBtn) {
          clearBtn.addEventListener('click', function () {
            category = 'all';
            color = 'all';
            apply();
          });
        }
        return;
      }

      grid.innerHTML = matches.map(renderCard).join('');
      observeReveals(grid);
    }

    qsa('[data-filter-category]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        category = btn.getAttribute('data-filter-category');
        apply();
      });
    });
    qsa('[data-filter-color]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        color = btn.getAttribute('data-filter-color');
        apply();
      });
    });

    apply();
  }

  function initProduct() {
    var root = qs('[data-product-root]');
    if (!root) return;

    var slug = new URLSearchParams(location.search).get('slug');
    var product = catalog.filter(function (p) {
      return p.slug === slug;
    })[0];

    if (!product) {
      root.innerHTML =
        '<div class="empty-state empty-state--page">' +
        '<h1>Uniform not found</h1>' +
        '<p>That piece is not in the collection. Browse the shop to pick a set, top, or pant.</p>' +
        '<a class="cta-button" href="shop.html">Back to shop</a>' +
        '</div>';
      return;
    }

    document.title = product.name + ' — ' + (config.brandName || 'Scrubs Ilyas');

    var color = product.colors[0];
    var size = product.sizes[2] || product.sizes[0];
    var qty = 1;

    function orderMessage() {
      return [
        'Hello, I would like to order from ' + config.brandName + ':',
        product.name,
        'Color: ' + color.name,
        'Size: ' + size,
        'Quantity: ' + qty,
        'Price: ' + formatPrice(product.price) + ' each'
      ].join('\n');
    }

    function paint() {
      var swatches = product.colors
        .map(function (c) {
          var active = c.id === color.id ? ' is-active' : '';
          return (
            '<button type="button" class="swatch' +
            active +
            '" data-color="' +
            c.id +
            '" style="--swatch:' +
            c.hex +
            '" aria-label="' +
            c.name +
            '"' +
            (c.id === color.id ? ' aria-pressed="true"' : ' aria-pressed="false"') +
            '></button>'
          );
        })
        .join('');

      var sizes = product.sizes
        .map(function (s) {
          var active = s === size ? ' is-active' : '';
          return (
            '<button type="button" class="size-btn' +
            active +
            '" data-size="' +
            s +
            '"' +
            (s === size ? ' aria-pressed="true"' : ' aria-pressed="false"') +
            '>' +
            s +
            '</button>'
          );
        })
        .join('');

      root.innerHTML =
        '<nav class="breadcrumb"><a href="shop.html">Shop</a><span>/</span><span>' +
        product.name +
        '</span></nav>' +
        '<div class="product-layout">' +
        '<div class="product-visual">' +
        '<img class="garment-photo" data-color="' +
        color.id +
        '" src="' +
        product.image +
        '" alt="' +
        product.name +
        ' in ' +
        color.name +
        '">' +
        '</div>' +
        '<div class="product-info">' +
        '<p class="eyebrow">' +
        product.categoryLabel +
        '</p>' +
        '<h1 class="product-title">' +
        product.name +
        '</h1>' +
        '<p class="product-price">' +
        formatPrice(product.price) +
        '</p>' +
        '<p class="product-blurb">' +
        product.blurb +
        '</p>' +
        '<p class="product-details">' +
        product.details +
        '</p>' +
        '<div class="option-block">' +
        '<div class="option-label">Color · <span data-color-name>' +
        color.name +
        '</span></div>' +
        '<div class="swatch-row">' +
        swatches +
        '</div>' +
        '</div>' +
        '<div class="option-block">' +
        '<div class="option-label">Size · <a href="size-guide.html">Size guide</a></div>' +
        '<div class="size-row">' +
        sizes +
        '</div>' +
        '</div>' +
        '<div class="option-block">' +
        '<div class="option-label">Quantity</div>' +
        '<div class="qty-stepper">' +
        '<button type="button" data-qty-dec aria-label="Decrease quantity">−</button>' +
        '<input type="number" min="1" max="20" value="' +
        qty +
        '" data-qty>' +
        '<button type="button" data-qty-inc aria-label="Increase quantity">+</button>' +
        '</div>' +
        '</div>' +
        '<div class="product-actions">' +
        '<a class="cta-button" data-order-whatsapp href="' +
        whatsappUrl(orderMessage()) +
        '">Order on WhatsApp</a>' +
        '<a class="cta-button cta-button--ghost" href="contact.html">Bulk / college order</a>' +
        '</div>' +
        '<p class="fine-print">Prices are in PKR. We confirm size, color, and delivery on WhatsApp before you pay.</p>' +
        '</div>' +
        '</div>';

      bind();
    }

    function bind() {
      qsa('[data-color]', root).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-color');
          color =
            product.colors.filter(function (c) {
              return c.id === id;
            })[0] || color;
          paint();
        });
      });
      qsa('[data-size]', root).forEach(function (btn) {
        btn.addEventListener('click', function () {
          size = btn.getAttribute('data-size');
          paint();
        });
      });
      var input = qs('[data-qty]', root);
      var order = qs('[data-order-whatsapp]', root);
      function setQty(n) {
        qty = Math.max(1, Math.min(20, n));
        if (input) input.value = qty;
        if (order) order.href = whatsappUrl(orderMessage());
      }
      var dec = qs('[data-qty-dec]', root);
      var inc = qs('[data-qty-inc]', root);
      if (dec) {
        dec.addEventListener('click', function () {
          setQty(qty - 1);
        });
      }
      if (inc) {
        inc.addEventListener('click', function () {
          setQty(qty + 1);
        });
      }
      if (input) {
        input.addEventListener('change', function () {
          setQty(parseInt(input.value, 10) || 1);
        });
      }
    }

    paint();
  }

  var revealObserver = null;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function observeReveals(root) {
    var nodes = qsa('.reveal', root || document).filter(function (el) {
      return !el.classList.contains('is-in');
    });
    if (!nodes.length) return;

    if (prefersReducedMotion()) {
      nodes.forEach(function (el) {
        el.classList.add('is-in');
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
    }

    nodes.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  function initContact() {
    var form = qs('[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (qs('[name="name"]', form) || {}).value || '';
      var phone = (qs('[name="phone"]', form) || {}).value || '';
      var college = (qs('[name="college"]', form) || {}).value || '';
      var message = (qs('[name="message"]', form) || {}).value || '';
      var lines = [
        'Hello, inquiry from the ' + config.brandName + ' website:',
        'Name: ' + name.trim(),
        'Phone: ' + phone.trim()
      ];
      if (college.trim()) lines.push('College: ' + college.trim());
      if (message.trim()) lines.push('', message.trim());
      window.location.href = whatsappUrl(lines.join('\n'));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initConfigCopy();
    initFeatured();
    initShop();
    initProduct();
    initContact();
    observeReveals();
  });
})();
