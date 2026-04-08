// ===== MOBILE MENU =====
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('open');
    });
  }

  // Close menu when clicking a link
  document.querySelectorAll('.main-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });

  // ===== HIGHLIGHT ACTIVE NAV LINK =====
  const params = new URLSearchParams(window.location.search);
  const currentCat = params.get('cat');
  if (currentCat) {
    document.querySelectorAll('.main-nav a').forEach(function(link) {
      if (link.href.includes('cat=' + currentCat)) {
        link.classList.add('active');
      }
    });
  }

  // ===== CAROUSEL =====
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoplayTimer;

    function showSlide(index) {
      slides.forEach(function(s) { s.classList.remove('active'); });
      dots.forEach(function(d) { d.classList.remove('active'); });
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        showSlide(currentSlide - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        showSlide(currentSlide + 1);
        resetAutoplay();
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showSlide(parseInt(this.dataset.index));
        resetAutoplay();
      });
    });

    startAutoplay();
  }

  // ===== RENDER PRODUCT CARD =====
  function renderProductCard(product) {
    var priceNoteHtml = product.priceNote
      ? '<div class="product-price-note">' + product.priceNote + '</div>'
      : '';

    return '<div class="product-card">' +
      '<div class="product-image">' +
        '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" onerror="this.src=\'images/site/placeholder.png\'">' +
      '</div>' +
      '<div class="product-info">' +
        '<div class="product-name">' + product.name + '</div>' +
        '<div class="product-price">$' + product.price + ' <span class="unit">/ ' + product.unit + '</span></div>' +
        priceNoteHtml +
      '</div>' +
    '</div>';
  }

  // ===== HOME PAGE: Latest & Popular Products =====
  var latestGrid = document.getElementById('latestProducts');
  if (latestGrid) {
    var latest = PRODUCTS.filter(function(p) { return p.badge === 'latest'; });
    // Fill with recent products if not enough badges
    if (latest.length < 6) {
      var remaining = PRODUCTS.filter(function(p) { return p.badge !== 'latest'; }).slice(0, 6 - latest.length);
      latest = latest.concat(remaining);
    }
    latestGrid.innerHTML = latest.map(renderProductCard).join('');
  }

  var popularGrid = document.getElementById('popularProducts');
  if (popularGrid) {
    var popular = PRODUCTS.filter(function(p) { return p.badge === 'popular'; });
    // Fill with other products
    if (popular.length < 6) {
      var others = PRODUCTS.filter(function(p) { return p.badge !== 'popular' && p.badge !== 'latest'; }).slice(0, 6 - popular.length);
      popular = popular.concat(others);
    }
    popularGrid.innerHTML = popular.map(renderProductCard).join('');
  }

  // ===== CATEGORY PAGE =====
  var categoryGrid = document.getElementById('categoryProducts');
  if (categoryGrid && currentCat) {
    var catInfo = CATEGORIES[currentCat];
    if (catInfo) {
      // Set page title
      document.title = catInfo.name + ' - 420 The Cure SGV';
      document.getElementById('categoryTitle').textContent = catInfo.name;

      // Highlight sidebar link
      document.querySelectorAll('.sidebar-links a').forEach(function(link) {
        if (link.href.includes('cat=' + currentCat)) {
          link.classList.add('active');
        }
      });

      // Get and render products
      var products = getProductsByCategory(currentCat);
      document.getElementById('categoryCount').textContent = 'Showing all ' + products.length + ' results';

      function renderCategory(prods) {
        categoryGrid.innerHTML = prods.map(renderProductCard).join('');
      }

      renderCategory(products);

      // Sorting
      var sortSelect = document.getElementById('sortSelect');
      if (sortSelect) {
        sortSelect.addEventListener('change', function() {
          var sorted = products.slice();
          switch (this.value) {
            case 'price-low':
              sorted.sort(function(a, b) { return a.price - b.price; });
              break;
            case 'price-high':
              sorted.sort(function(a, b) { return b.price - a.price; });
              break;
            case 'name':
              sorted.sort(function(a, b) { return a.name.localeCompare(b.name); });
              break;
            default:
              break;
          }
          renderCategory(sorted);
        });
      }
    }
  }
});
