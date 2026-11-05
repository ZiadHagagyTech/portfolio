document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.close-menu');

  if (hamburger && mobileMenu && closeMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      hamburger.style.display = 'none';
    });

    closeMenu.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.style.display = 'block';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.style.display = 'block';
      });
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
  if (document.getElementById('particles-js') && window.innerWidth > 768) {
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
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1000,
      loop: true
    });
  }

  // ===== تحميل المشاريع من JSON =====
  const container = document.getElementById('projects-container');

  fetch('./data/projects.json')
    .then(response => response.json())
    .then(data => {
      const projects = data.projects || [];

      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card bg-gray-800 rounded-xl shadow-lg hover:shadow-blue-500/70 transition-all duration-300 animate-slide-in';
        card.setAttribute('data-category', project.category || 'other');

        card.innerHTML = `
          <img src="${project.image}" loading="lazy" alt="${project.title}" class="w-full h-48 object-cover rounded-t-xl">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-white mb-2">${project.title}</h3>
            <p class="text-gray-400 mb-4">${project.description}</p>
            <a href="${project.link || '#'}">
              <p style="color: #3b82f6; text-align: center; border: #3b82f6 dotted;">عرض تفاصيل الموقع</p>
            </a>
          </div>
        `;

        container.appendChild(card);
      });

      // بعد تحميل المشاريع شغل الفلتر والأنيميشن
      initFilterAndAnimations();
    })
    .catch(error => {
      console.error('خطأ في تحميل المشاريع:', error);
      if (container) {
        container.innerHTML = '<p class="text-center text-red-400 col-span-full">حدث خطأ أثناء تحميل المشاريع</p>';
      }
    });

  function initFilterAndAnimations() {
    // GSAP Animations
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

    // Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((btn) => {
          btn.classList.remove('active', 'bg-blue-500');
          btn.classList.add('bg-gray-800');
        });
        button.classList.add('active', 'bg-blue-500');
        button.classList.remove('bg-gray-800');

        const filter = button.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

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
