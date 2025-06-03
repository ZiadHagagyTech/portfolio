document.addEventListener('DOMContentLoaded', function () {
  // Theme Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeToggleMobile = document.querySelector('.theme-toggle-mobile');
  const body = document.body;

  // function toggleTheme() {
  //   body.classList.toggle('light-mode');
  //   body.classList.toggle('dark-mode');
  //   const isLightMode = body.classList.contains('light-mode');
  //   body.setAttribute('data-theme', isLightMode ? 'light' : 'dark');
  //   localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  //   themeToggle.querySelector('i').classList.toggle('fa-moon');
  //   themeToggle.querySelector('i').classList.toggle('fa-sun');
  //   if (themeToggleMobile) {
  //     themeToggleMobile.querySelector('i').classList.toggle('fa-moon');
  //     themeToggleMobile.querySelector('i').classList.toggle('fa-sun');
  //   }
  // }

  // themeToggle.addEventListener('click', toggleTheme);
  // if (themeToggleMobile) {
  //   themeToggleMobile.addEventListener('click', toggleTheme);
  // }

  // Load Saved Theme
  // const savedTheme = localStorage.getItem('theme');
  // if (savedTheme === 'light') {
  //   body.classList.add('light-mode');
  //   body.classList.remove('dark-mode');
  //   body.setAttribute('data-theme', 'light');
  //   themeToggle.querySelector('i').classList.remove('fa-moon');
  //   themeToggle.querySelector('i').classList.add('fa-sun');
  //   if (themeToggleMobile) {
  //     themeToggleMobile.querySelector('i').classList.remove('fa-moon');
  //     themeToggleMobile.querySelector('i').classList.add('fa-sun');
  //   }
  // } else {
  //   body.classList.add('dark-mode');
  //   body.classList.remove('light-mode');
  //   body.setAttribute('data-theme', 'dark');
  // }

  // Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
  });

  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
  });

  // Close Mobile Menu on Link Click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });

  // Typed.js for Hero Section (Updated to English)
  if (document.querySelector('#typed-text')) {
    new Typed('#typed-text', {
      strings: ['Frontend Developer', 'Web Designer','Wordpress Developer', 'Digital Solutions Creator'],
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 1000,
      loop: true,
    });
  }

  // Particles.js (Highly optimized for performance)
  if (document.querySelector('#particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: '#1E90FF' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#1E90FF', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 3, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false },
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } },
      },
      retina_detect: true,
    });
  }

  // Navbar Scroll Effect
  // const navbar = document.querySelector('.navbar');
  // window.addEventListener('scroll', () => {
  //   if (window.scrollY > 50) {
  //     navbar.classList.add('scrolled');
  //   } else {
  //     navbar.classList.remove('scrolled');
  //   }
  // });

  // Back to Top Button
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.remove('hidden');
      backToTop.style.opacity = '1';
    } else {
      backToTop.style.opacity = '0';
      setTimeout(() => backToTop.classList.add('hidden'), 300);
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Statistics Counter Animation (Faster)
  function animateCounter(element, target, duration) {
    let start = 0;
    const stepTime = Math.round(duration / target);
    const timer = setInterval(() => {
      start++;
      element.textContent = start;
      if (start >= target) {
        clearInterval(timer);
        element.textContent = target;
      }
    }, stepTime);
  }

  const statItems = document.querySelectorAll('.stat-item h3');
  let statsAnimated = false;

  function checkStatsInView() {
    const statsSection = document.querySelector('#features');
    const rect = statsSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight && !statsAnimated) {
      statItems.forEach(item => {
        const target = parseInt(item.getAttribute('data-count'));
        animateCounter(item, target, 1000);
      });
      statsAnimated = true;
    }
  }

  window.addEventListener('scroll', checkStatsInView);
  checkStatsInView();

  // Skills Progress Bars Fix
  const progressBars = document.querySelectorAll('.skill-progress');
  progressBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    if (progress) {
      bar.style.width = `${progress}%`;
    }
  });

  // Vanilla Tilt for Cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
    });
  }

  // Testimonials Scroll Dots with Debounce
  const testimonialsGrid = document.querySelector('#testimonials .grid');
  if (testimonialsGrid) {
    const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'scroll-dots';
    cards.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'scroll-dot';
      if (index === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });
    testimonialsGrid.parentNode.appendChild(dotsContainer);

    let scrollTimeout;
    testimonialsGrid.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const cardWidth = cards[0].offsetWidth + 16; // Card width + gap
        const scrollPosition = testimonialsGrid.scrollLeft;
        const activeIndex = Math.round(scrollPosition / cardWidth);
        document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === activeIndex);
        });
      }, 50); // Debounce delay
    });
  }
});



// تعطيل الزر الأيمن
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// تعطيل اختصارات F12 و Ctrl+Shift+I و Ctrl+Shift+J و Ctrl+U
document.addEventListener("keydown", function (e) {
  if (e.key === "F12" || 
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || 
      (e.ctrlKey && e.key === "U")) {
      e.preventDefault();
  }
});