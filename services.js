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
        // Check if element is in viewport on load
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
  
        if (isVisible) {
          // Show immediately if visible on load
          gsap.to(element, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          // Animate when scrolling into view
          gsap.fromTo(element, 
            { y: 20 },
            {
              y: 0,
              duration: 0.3,
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
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 1000,
        loop: true
      });
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