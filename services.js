document.addEventListener('DOMContentLoaded', () => {
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

  // Navbar Scroll
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
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#3b82f6' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#3b82f6', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 1, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // Typed.js
  if (document.querySelector('#typed-text') && typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: ['Frontend Developer', 'Web Designer', 'Wordpress Developer', 'Digital Solutions Creator'],
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 1000,
      loop: true
    });
  }

  // ===== تحميل الخدمات من JSON =====
  const container = document.getElementById('services-container');

  fetch('./data/services.json')
    .then(response => response.json())
    .then(data => {
      const services = data.services || [];

      services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-blue-500/70 transition-all duration-300 animate-slide-in';

        card.innerHTML = `
          <div class="flex justify-center mb-4">
            <i class="${service.icon || 'fas fa-code'} text-5xl text-blue-500 pulse-icon"></i>
          </div>
          <h3 class="text-2xl font-semibold text-white mb-3 text-center">${service.title}</h3>
          <p class="text-gray-400 text-center">${service.description}</p>
        `;

        container.appendChild(card);
      });

      // تشغيل الأنيميشن بعد التحميل
      initAnimations();
    })
    .catch(error => {
      console.error('خطأ في تحميل الخدمات:', error);
      if (container) {
        container.innerHTML = '<p class="text-center text-red-400 col-span-full">حدث خطأ أثناء تحميل الخدمات</p>';
      }
    });

  function initAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll('.animate-slide-in').forEach((element) => {
        gsap.fromTo(element,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }
  }

  // FAQ Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('i');
      answer.classList.toggle('hidden');
      icon.classList.toggle('rotate');
      if (!answer.classList.contains('hidden')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // Back to Top
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

// تعطيل الزر الأيمن والاختصارات
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", function (e) {
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || (e.ctrlKey && e.key === "U")) {
    e.preventDefault();
  }
});
