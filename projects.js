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
  
      // Close menu when clicking a link
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          hamburger.style.display = 'block';
        });
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
  
    // Particles.js (only on larger screens)
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
  
    // GSAP Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
  
      document.querySelectorAll('.animate-slide-in').forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
  
        if (isVisible) {
          gsap.to(element, {
            y: 0,
            duration: window.innerWidth <= 768 ? 0.2 : 0.3,
            ease: 'power2.out'
          });
        } else {
          gsap.fromTo(element, 
            { y: 20 },
            {
              y: 0,
              duration: window.innerWidth <= 768 ? 0.2 : 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 90%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });
    }
  
    // Typed.js
    if (document.querySelector('#typed-text') && typeof Typed !== 'undefined') {
      new Typed('#typed-text', {
        strings: ['Frontend Developer', 'Web Designer','Wordpress Developer', 'Digital Solutions Creator'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1000,
        loop: true
      });
    }
  
    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
  
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
  
        const filter = button.getAttribute('data-filter');
  
        gsap.to(projectCards, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            projectCards.forEach((card) => {
              const category = card.getAttribute('data-category');
              if (filter === 'all' || category === filter) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            });
  
            gsap.fromTo(projectCards, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: window.innerWidth <= 768 ? 0.2 : 0.3, stagger: 0.1 }
            );
          }
        });
      });
    });
  
    // Counter Animation for Stats and Achievements
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / 100;
  
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCounter, 20);
        } else {
          counter.innerText = target;
        }
      };
  
      const rect = counter.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
  
      if (isVisible) {
        updateCounter();
      } else {
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 90%',
          onEnter: () => updateCounter()
        });
      }
    });
  
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