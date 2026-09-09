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
