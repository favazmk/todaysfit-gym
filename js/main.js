/**
 * TODAY'S FIT GYM LLC — MAIN JAVASCRIPT
 * Domain: todaysfitgym.com | Bur Dubai, Dubai, UAE
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveals();
  initLightbox();
  initModals();
  initAccordion();
  initForms();
  initSmoothScroll();
  initHeroScrollSequence();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close on link click
  const navLinks = drawer.querySelectorAll('.mobile-nav-link, .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. FACILITY GALLERY & LIGHTBOX
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('facilityLightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentIndex = 0;

  const updateLightbox = (index) => {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const fullSrc = item.getAttribute('data-full') || item.querySelector('img').src;
    const title = item.querySelector('.gallery-title')?.textContent || 'Today\'s Fit Gym Facility';
    const tag = item.querySelector('.gallery-tag')?.textContent || '';

    lightboxImg.src = fullSrc;
    lightboxImg.alt = title;
    lightboxCaption.textContent = tag ? `${tag} — ${title}` : title;
  };

  const openLightbox = (index) => {
    updateLightbox(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => updateLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateLightbox(currentIndex + 1));

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
  });
}

/* --------------------------------------------------------------------------
   5. QUICK ACTION MODALS (JOIN NOW & BOOK VISIT)
   -------------------------------------------------------------------------- */
function initModals() {
  const joinModal = document.getElementById('joinModal');
  const visitModal = document.getElementById('visitModal');
  
  const openModal = (modal, defaultPlan = '') => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (defaultPlan) {
      const planSelect = modal.querySelector('select[name="membership_plan"]');
      if (planSelect) planSelect.value = defaultPlan;
    }
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Triggers for Join Modal
  document.querySelectorAll('[data-open-join]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || '12 Months (AED 1260)';
      openModal(joinModal, plan);
    });
  });

  // Triggers for Visit Modal
  document.querySelectorAll('[data-open-visit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(visitModal);
    });
  });

  // Close buttons
  document.querySelectorAll('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(joinModal);
      closeModal(visitModal);
    });
  });

  // Click outside to close
  [joinModal, visitModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(joinModal);
      closeModal(visitModal);
    }
  });
}

/* --------------------------------------------------------------------------
   6. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items for clean accordion effect
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Auto-expand first item if desired
  if (items[0]) {
    items[0].classList.add('active');
    const firstContent = items[0].querySelector('.accordion-content');
    if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
  }
}

/* --------------------------------------------------------------------------
   7. FORM HANDLING & WHATSAPP INTEGRATION
   -------------------------------------------------------------------------- */
function initForms() {
  // Join Modal Form
  const joinForm = document.getElementById('joinForm');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = joinForm.querySelector('input[name="name"]').value.trim();
      const phone = joinForm.querySelector('input[name="phone"]').value.trim();
      const plan = joinForm.querySelector('select[name="membership_plan"]').value;

      if (!name || !phone) {
        showToast('Please fill in your name and contact phone number.', 'error');
        return;
      }

      const text = encodeURIComponent(
        `Hello Today's Fit Gym, my name is ${name}. I am interested in joining with the ${plan} plan. Please contact me at ${phone}.`
      );
      window.open(`https://wa.me/971567037002?text=${text}`, '_blank');
      showToast('Redirecting to WhatsApp with your membership enquiry...', 'success');
      
      const modal = document.getElementById('joinModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
      joinForm.reset();
    });
  }

  // Visit Modal Form
  const visitForm = document.getElementById('visitForm');
  if (visitForm) {
    visitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = visitForm.querySelector('input[name="name"]').value.trim();
      const phone = visitForm.querySelector('input[name="phone"]').value.trim();
      const date = visitForm.querySelector('input[name="visit_date"]')?.value || 'Upcoming';

      if (!name || !phone) {
        showToast('Please fill in your name and contact phone number.', 'error');
        return;
      }

      const text = encodeURIComponent(
        `Hello Today's Fit Gym, my name is ${name}. I would like to book a visit / tour of the gym (Preferred date: ${date}). Phone: ${phone}.`
      );
      window.open(`https://wa.me/971567037002?text=${text}`, '_blank');
      showToast('Redirecting to WhatsApp to confirm your gym tour...', 'success');

      const modal = document.getElementById('visitModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
      visitForm.reset();
    });
  }

  // Main Contact Page Form
  const contactForm = document.getElementById('contactEnquiryForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = contactForm.querySelector('input[name="first_name"]').value.trim();
      const lastName = contactForm.querySelector('input[name="last_name"]').value.trim();
      const phone = contactForm.querySelector('input[name="phone"]').value.trim();
      const email = contactForm.querySelector('input[name="email"]').value.trim();
      const interest = contactForm.querySelector('select[name="interest"]').value;
      const message = contactForm.querySelector('textarea[name="message"]').value.trim();

      if (!firstName || !phone) {
        showToast('Please provide your name and phone number.', 'error');
        return;
      }

      const text = encodeURIComponent(
        `Hello Today's Fit Gym!\n\nName: ${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nInterest: ${interest}\n\nMessage: ${message || 'I would like more information.'}`
      );

      window.open(`https://wa.me/971567037002?text=${text}`, '_blank');
      showToast('Thank you! Your message has been prepared for WhatsApp.', 'success');
      contactForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   8. TOAST NOTIFICATIONS
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' 
        ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' 
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* --------------------------------------------------------------------------
   9. SMOOTH SCROLL FOR IN-PAGE ANCHORS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* --------------------------------------------------------------------------
   10. THREE.JS 3D DUMBBELL EXPERIENCE
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined' || typeof gsap === 'undefined') return;

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff0dd, 2.5); // Warm key light
  dirLight.position.set(5, 5, 4);
  scene.add(dirLight);

  const rimLight = new THREE.SpotLight(0xff0000, 2); // Brand red rim light
  rimLight.position.set(-5, 5, -5);
  scene.add(rimLight);

  // Dumbbell Construction
  const dumbbell = new THREE.Group();
  
  const metalMat = new THREE.MeshStandardMaterial({ 
    color: 0x888888, 
    metalness: 0.8, 
    roughness: 0.3 
  });
  
  const rubberMat = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    metalness: 0.2, 
    roughness: 0.9 
  });

  // Handle
  const handleGeo = new THREE.CylinderGeometry(0.15, 0.15, 2, 32);
  const handle = new THREE.Mesh(handleGeo, metalMat);
  handle.rotation.z = Math.PI / 2;
  dumbbell.add(handle);

  // Inner Plates
  const innerPlateGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
  const innerPlate1 = new THREE.Mesh(innerPlateGeo, rubberMat);
  innerPlate1.position.x = 1.2;
  innerPlate1.rotation.z = Math.PI / 2;
  
  const innerPlate2 = innerPlate1.clone();
  innerPlate2.position.x = -1.2;
  
  dumbbell.add(innerPlate1);
  dumbbell.add(innerPlate2);

  // Outer Plates
  const outerPlateGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
  const outerPlate1 = new THREE.Mesh(outerPlateGeo, rubberMat);
  outerPlate1.position.x = 1.6;
  outerPlate1.rotation.z = Math.PI / 2;
  
  const outerPlate2 = outerPlate1.clone();
  outerPlate2.position.x = -1.6;

  dumbbell.add(outerPlate1);
  dumbbell.add(outerPlate2);

  // Caps
  const capGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
  const cap1 = new THREE.Mesh(capGeo, metalMat);
  cap1.position.x = 1.8;
  cap1.rotation.z = Math.PI / 2;
  
  const cap2 = cap1.clone();
  cap2.position.x = -1.8;

  dumbbell.add(cap1);
  dumbbell.add(cap2);

  scene.add(dumbbell);

  // Initial State (Hero)
  dumbbell.position.set(3, -2, 0);
  dumbbell.rotation.set(0.5, -0.4, 0.2);
  dumbbell.scale.set(1.2, 1.2, 1.2);

  // Render Loop
  let isRendering = true;
  const tick = () => {
    if (isRendering) {
      renderer.render(scene, camera);
      if (!prefersReducedMotion) {
        // Very subtle idle floating if desired, but user requested no random movement when stopped.
        // We rely purely on scroll for rotation.
      }
    }
    window.requestAnimationFrame(tick);
  };
  tick();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  if (prefersReducedMotion) {
    // Fade out immediately after hero
    gsap.to(canvas, {
      opacity: 0,
      scrollTrigger: {
        trigger: '#brand-statement',
        start: 'top center',
        end: 'top top',
        scrub: true
      }
    });
    return;
  }

  // GSAP ScrollTrigger Choreography
  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth < 768;
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '55% center',
      scrub: 1
    }
  });

  // 1. To Brand Statement
  tl.to(dumbbell.position, {
    x: isMobile ? -1 : -4,
    y: isMobile ? 1 : 2,
    z: -2,
    ease: 'power1.inOut'
  }, 0)
  .to(dumbbell.rotation, {
    x: 1.5,
    y: 0.8,
    z: 1,
    ease: 'power1.inOut'
  }, 0)
  .to(dumbbell.scale, {
    x: 1, y: 1, z: 1,
    ease: 'power1.inOut'
  }, 0);

  // 2. To Programs
  tl.to(dumbbell.position, {
    x: isMobile ? 1.5 : 3.5,
    y: isMobile ? -0.5 : -1,
    z: 1,
    ease: 'power1.inOut'
  }, 0.3)
  .to(dumbbell.rotation, {
    x: 2.5,
    y: -0.5,
    z: 0.5,
    ease: 'power1.inOut'
  }, 0.3);

  // 3. To Facility
  tl.to(dumbbell.position, {
    x: isMobile ? -1.5 : -3,
    y: isMobile ? -1 : -2,
    z: 0,
    ease: 'power1.inOut'
  }, 0.6)
  .to(dumbbell.rotation, {
    x: 3.5,
    y: 1.2,
    z: -0.5,
    ease: 'power1.inOut'
  }, 0.6);

  // 4. Exit / Fade out
  tl.to(dumbbell.position, {
    y: 3,
    ease: 'power1.in'
  }, 0.9)
  .to(dumbbell.scale, {
    x: 0.7, y: 0.7, z: 0.7,
    ease: 'power1.in'
  }, 0.9)
  .to(canvas, {
    opacity: 0,
    ease: 'power1.in',
    onComplete: () => {
      isRendering = false;
      canvas.style.display = 'none';
    },
    onReverseComplete: () => {
      isRendering = true;
      canvas.style.display = 'block';
    }
  }, 0.9);
});




/* --------------------------------------------------------------------------
   11. ABOUT PAGE V2 CINEMATIC SCROLL (REFINED)
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initAboutScrollExperience();
});

function initAboutScrollExperience() {
  if (!document.querySelector('main.about-page')) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // Let CSS fallbacks handle it

  gsap.registerPlugin(ScrollTrigger);

  // Use matchMedia for responsive choreographies
  let mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 1025px)",
    isTablet: "(min-width: 769px) and (max-width: 1024px)",
    isMobile: "(max-width: 768px)"
  }, (context) => {
    let { isDesktop, isTablet, isMobile } = context.conditions;

    initAboutHero(isDesktop, isTablet, isMobile);
    initAboutApproach(isDesktop, isTablet, isMobile);
    initAboutPillars(isDesktop, isTablet, isMobile);
    initAboutSpace(isDesktop, isTablet, isMobile);

    return () => {
      // clean up all ScrollTriggers on breakpoint change
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });
}

function initAboutHero(isDesktop, isTablet, isMobile) {
  const section = document.querySelector('.about-hero');
  const overlay = document.querySelector('.approach-overlay');
  if (!section) return;

  const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  loadTl.to('.hero-image-wrap img', { scale: 1, duration: 2 }, 0)
    .to('.hero-eyebrow', { opacity: 1, duration: 1 }, 0.2)
    .to('.hero-heading', { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.2 }, 0.3)
    .to('.hero-sub', { opacity: 1, duration: 1 }, 0.6)
    .to('.hero-actions', { opacity: 1, duration: 1 }, 0.8);

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: isMobile ? '+=60%' : '+=100%',
      scrub: isMobile ? 0.7 : 1,
      pin: true,
      anticipatePin: 1
    }
  });

  scrollTl.to('.hero-image-wrap img', {
    scale: 1.04,
    ease: 'none'
  }, 0)
  .to('.hero-heading-wrap', {
    y: isMobile ? -20 : -50,
    scale: 0.95,
    ease: 'none'
  }, 0)
  .to(overlay, {
    yPercent: 0,
    ease: 'none'
  }, 0);
}

function initAboutApproach(isDesktop, isTablet, isMobile) {
  const section = document.querySelector('.about-approach');
  const overlay = document.querySelector('.pillars-overlay');
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: isMobile ? '+=80%' : '+=120%',
      scrub: isMobile ? 0.7 : 1,
      pin: true,
      anticipatePin: 1
    }
  });

  tl.to('.approach-text', {
    opacity: 1,
    y: -10,
    ease: 'power2.out'
  }, 0.1)
  .to('.about-approach .motion-image-wrap', {
    clipPath: 'inset(0 0% 0 0)',
    ease: 'power2.inOut'
  }, 0.2)
  .to('.about-approach .motion-image-wrap img', {
    scale: 1,
    ease: 'power2.inOut'
  }, 0.2)
  .to(overlay, {
    yPercent: 0,
    ease: 'none'
  }, 0.8);
}

function initAboutPillars(isDesktop, isTablet, isMobile) {
  const section = document.querySelector('.about-pillars');
  if (!section) return;

  const pillars = gsap.utils.toArray('.pillar-item');
  if (!pillars.length) return;

  const indicator = document.querySelector('.pillars-indicator-line');

  // Reset to robust state
  gsap.set(pillars, { opacity: 0, yPercent: -50, scale: 0.96 });
  gsap.set(pillars[0], { opacity: 1, yPercent: -50, scale: 1, pointerEvents: 'auto' });

  const endDistance = isMobile ? (pillars.length * 70) : (pillars.length * 80);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${endDistance}%`,
      scrub: isMobile ? 0.7 : 1,
      pin: true,
      anticipatePin: 1
    }
  });

  for (let i = 0; i < pillars.length - 1; i++) {
    const current = pillars[i];
    const next = pillars[i + 1];

    // Hold current state
    tl.to({}, { duration: 0.3 });

    // EXIT current completely
    tl.to(current, {
      yPercent: -80,
      opacity: 0,
      scale: 0.97,
      duration: 0.4,
      pointerEvents: 'none',
      ease: 'power2.inOut'
    });

    // Update indicator line midway
    tl.to(indicator, {
      width: `${((i + 2) / pillars.length) * 100}%`,
      ease: 'none',
      duration: 0.2
    }, "-=0.2");

    // ENTER next AFTER current has visually cleared
    tl.fromTo(next,
      { yPercent: 0, opacity: 0, scale: 0.96 },
      {
        yPercent: -50,
        opacity: 1,
        scale: 1,
        pointerEvents: 'auto',
        duration: 0.4,
        ease: 'power3.out'
      }
    );
  }
}

function initAboutSpace(isDesktop, isTablet, isMobile) {
  const section = document.querySelector('.about-space');
  if (!section) return;

  const slides = gsap.utils.toArray('.space-slide');
  if (!slides.length) return;

  gsap.set(slides, { yPercent: 100, zIndex: i => i });
  gsap.set(slides[0], { yPercent: 0 });

  const endDistance = isMobile ? (slides.length * 60) : (slides.length * 100);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${endDistance}%`,
      scrub: isMobile ? 0.7 : 1,
      pin: true,
      anticipatePin: 1
    }
  });

  slides.forEach((slide, index) => {
    if (index === 0) {
      // First slide caption is visible
      gsap.set(slide.querySelector('.space-caption'), { opacity: 1, x: 0 });
      return;
    }

    const previous = slides[index - 1];
    const prevCaption = previous.querySelector('.space-caption');
    const currCaption = slide.querySelector('.space-caption');

    // Slide images
    tl.to(previous, {
      scale: 0.96,
      yPercent: -10,
      ease: 'none',
      duration: 1
    }, `scene-${index}`);

    tl.to(slide, {
      yPercent: 0,
      ease: 'none',
      duration: 1
    }, `scene-${index}`);

    tl.to(slide.querySelector('img'), {
      scale: 1,
      ease: 'none',
      duration: 1
    }, `scene-${index}`);

    // Slide Captions - synchronized when the incoming image is dominant (halfway through transition)
    tl.to(prevCaption, {
      opacity: 0,
      x: -20,
      duration: 0.2
    }, `scene-${index}+=0.5`);

    tl.to(currCaption, {
      opacity: 1,
      x: 0,
      duration: 0.3
    }, `scene-${index}+=0.7`);
  });
}


/* --------------------------------------------------------------------------
   9. HERO SCROLL SEQUENCE
   Scrubs a WebP frame sequence against scroll position while the hero is
   pinned. Scrolling back runs it in reverse — it is just a lower frame index.
   Frames were time-remapped at export so visual change per scroll unit is
   roughly constant; do not resample them assuming linear time.
   -------------------------------------------------------------------------- */
function initHeroScrollSequence() {
  const track = document.getElementById('heroScroll');
  const canvas = document.getElementById('heroCanvas');
  const fallback = document.getElementById('heroFallback');
  if (!track || !canvas || !fallback) return;

  /* Two crops of the same take, time-remapped identically so both tell the
     story at the same pace. Mobile is a centred 9:16 crop at fewer frames. */
  const SOURCES = {
    desktop: { dir: 'assets/hero/desktop', count: 90 },
    mobile:  { dir: 'assets/hero/mobile',  count: 45 }
  };
  const wide = window.matchMedia('(min-width: 1024px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pick = () => (wide.matches ? SOURCES.desktop : SOURCES.mobile);

  const ctx = canvas.getContext('2d', { alpha: false });
  let set = null;
  let frames = [];
  let active = false;
  let ticking = false;
  let lastDrawn = -1;

  const srcFor = (s, i) => `${s.dir}/f${String(i).padStart(3, '0')}.webp`;

  /* Draw with "cover" framing so the frame fills any viewport aspect ratio. */
  function paint(img) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (!cw || !ch) return;
    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
    }
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  /* Frames load progressively, so fall back to the closest one already decoded
     rather than dropping the paint entirely. */
  function nearestReady(i) {
    const n = set.count;
    if (frames[i] && frames[i].complete && frames[i].naturalWidth) return frames[i];
    for (let r = 1; r < n; r++) {
      const lo = frames[i - r];
      if (lo && lo.complete && lo.naturalWidth) return lo;
      const hi = frames[i + r];
      if (hi && hi.complete && hi.naturalWidth) return hi;
    }
    return null;
  }

  function frameForScroll() {
    const total = track.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    const p = Math.min(Math.max(-track.getBoundingClientRect().top / total, 0), 1);
    return Math.round(p * (set.count - 1));
  }

  function render() {
    ticking = false;
    if (!active) return;
    const i = frameForScroll();
    if (i === lastDrawn) return;
    const img = nearestReady(i);
    if (!img) return;
    paint(img);
    lastDrawn = i;
  }

  function onScroll() {
    if (ticking || !active) return;
    ticking = true;
    requestAnimationFrame(render);
  }

  function onResize() {
    if (!active) return;
    lastDrawn = -1;
    onScroll();
  }

  function loadFrames() {
    const s = set;
    frames = new Array(s.count);
    /* Frame 0 first so the canvas can take over from the still immediately,
       then the rest in order — the sequence is watched front to back. */
    const first = new Image();
    first.src = srcFor(s, 0);
    frames[0] = first;
    first.onload = () => {
      if (set !== s) return;           // breakpoint changed mid-load
      canvas.classList.add('is-ready');
      lastDrawn = -1;
      onScroll();
      for (let i = 1; i < s.count; i++) {
        const img = new Image();
        img.src = srcFor(s, i);
        frames[i] = img;
      }
    };
  }

  function enable(next) {
    const changed = set !== next;
    set = next;
    active = true;
    track.classList.remove('is-static');
    if (changed) {
      canvas.classList.remove('is-ready');
      fallback.src = srcFor(set, 0);
      loadFrames();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    lastDrawn = -1;
    onScroll();
  }

  function disable(next) {
    set = next;
    active = false;
    track.classList.add('is-static');
    canvas.classList.remove('is-ready');
    /* Static hero shows the destination, not the corridor it started in. */
    fallback.src = srcFor(next, next.count - 1);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  }

  function evaluate() {
    const next = pick();
    if (reducedMotion.matches) disable(next);
    else enable(next);
  }

  reducedMotion.addEventListener('change', evaluate);
  wide.addEventListener('change', evaluate);
  evaluate();
}
