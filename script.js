// ============================================
// Sterling & Associates — Main Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Theme Switcher ---
  const themeSwitcher = document.getElementById('themeSwitcher');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('lk-theme') || 'gold';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'gold') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
    });
    localStorage.setItem('lk-theme', theme);
  }

  // Toggle panel open/close
  themeToggleBtn.addEventListener('click', () => {
    themeSwitcher.classList.toggle('open');
  });

  // Select a theme
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      applyTheme(theme);
    });
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!themeSwitcher.contains(e.target)) {
      themeSwitcher.classList.remove('open');
    }
  });

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // --- Counter animation ---
  const counters = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      countersAnimated = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        const step = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(target * eased);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target;
          }
        };
        requestAnimationFrame(step);
      });
    }
  };

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // --- Scroll reveal animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(
    '.practice-card, .team-card, .about-content, .about-image, .contact-info, .contact-form-wrapper, .cta-banner h2, .cta-banner p, .cta-banner .btn'
  );
  animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Stagger practice cards
  document.querySelectorAll('.practice-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  document.querySelectorAll('.team-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // --- Testimonial slider ---
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slides = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  const goToSlide = (index) => {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  });

  // Auto-advance testimonials
  let autoSlide = setInterval(() => {
    goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  }, 5000);

  // Pause auto-advance on hover
  const slider = document.getElementById('testimonialSlider');
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    }, 5000);
  });

  // --- Contact form ---
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Form submitted:', data);

    // Show success message
    formSuccess.classList.add('visible');

    // Reset form
    form.reset();

    // Hide success after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove('visible');
    }, 5000);
  });

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link highlighting ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = 'var(--color-accent)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
