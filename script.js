/**
 * Connect Penha - Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initAccordion();
  initContactForm();
  initSmoothScroll();
  initCarousel();
});

/**
 * Header scroll effect and mobile menu
 */
function initHeader() {
  const header = document.getElementById('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  // Scroll handler
  function handleScroll() {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mobile menu toggle
  menuToggle?.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    nav?.classList.toggle('open');
    document.body.classList.toggle('menu-open', !isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close menu on link click (mobile)
  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        menuToggle?.setAttribute('aria-expanded', 'false');
        nav?.classList.remove('open');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });
  });
}

/**
 * FAQ Accordion
 */
function initAccordion() {
  const items = document.querySelectorAll('[data-accordion]');

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const content = item.querySelector('.accordion__content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.hasAttribute('data-open');

      if (isOpen) {
        item.removeAttribute('data-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        // Close others
        items.forEach((other) => {
          other.removeAttribute('data-open');
          other.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
        });
        item.setAttribute('data-open', '');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Contact form
 */
function initContactForm() {
  const form = document.getElementById('contact-form');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.querySelector('#nome')?.value;
    const email = form.querySelector('#email')?.value;
    const telefone = form.querySelector('#telefone')?.value;

    if (!nome || !email || !telefone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Aqui você pode integrar com seu backend ou serviço de formulário
    console.log('Form submitted:', { nome, email, telefone });
    alert('Obrigado! Entraremos em contato em breve.');

    form.reset();
  });
}

/**
 * Carrossel de perspectivas
 */
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const slides = carousel.querySelectorAll('.carousel__slide');
  const prevBtn = carousel.querySelector('.carousel__btn--prev');
  const nextBtn = carousel.querySelector('.carousel__btn--next');
  const dotsContainer = carousel.querySelector('.carousel__dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const total = slides.length;

  // Criar dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.setAttribute('data-index', i);
    dot.classList.toggle('active', i === 0);
    dotsContainer?.appendChild(dot);
  });

  const dots = dotsContainer?.querySelectorAll('span') || [];

  function goTo(index) {
    currentIndex = (index + total) % total;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));
  dots.forEach((d) => d.addEventListener('click', () => goTo(parseInt(d.dataset.index, 10))));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header')?.offsetHeight || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}
