document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeToggleMobile = document.querySelector('.theme-toggle-mobile');
  const body = document.body;

  if (themeToggle && themeToggleMobile) {
    const toggleTheme = () => {
      if (body.dataset.theme === 'dark') {
        body.dataset.theme = 'light';
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        themeToggleMobile.querySelector('i').classList.replace('fa-moon', 'fa-sun');
      } else {
        body.dataset.theme = 'dark';
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        themeToggleMobile.querySelector('i').classList.replace('fa-sun', 'fa-moon');
      }
    };

    themeToggle.addEventListener('click', toggleTheme);
    themeToggleMobile.addEventListener('click', toggleTheme);
  }

  // Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');

  if (hamburger && mobileMenu && closeMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Particles.js
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: '#3b82f6' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#3b82f6', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // GSAP Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.animate-slide-in').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // Vanilla Tilt
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 10,
      speed: 400,
      perspective: 1000
    });
  }

  // Skill Progress Animation
  if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.skill-progress').forEach((progress) => {
      gsap.to(progress, {
        width: `${progress.dataset.progress}%`,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: progress,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // Typed.js
  if (document.querySelector('#typed-text') && typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: ['Frontend Developer', 'UI/UX Designer', 'Digital Innovator'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1000,
      loop: true
    });
  }

  // Back to Top Button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.remove('hidden');
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
        backToTop.classList.add('hidden');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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