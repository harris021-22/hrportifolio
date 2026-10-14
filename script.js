// Menu mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Link ativo ao rolar (ScrollSpy)
if (nav) {
  const links = [...nav.querySelectorAll('a')];
  const secs = links.map(a => {
    const h = a.getAttribute('href');
    try {
      return (h && h.startsWith('#')) ? document.querySelector(h) : null;
    } catch {
      return null;
    }
  });

  addEventListener('scroll', () => {
    let idx = 0;
    secs.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < 140) idx = i;
    });
    links.forEach((a, i) => a.classList.toggle('active', i === idx));
  }, { passive: true });
}

// ==========================================
// Carrosséis Arrastáveis (Drag-to-Scroll & Setas)
// ==========================================
document.querySelectorAll('.carousel-viewport').forEach(viewport => {
  const track = viewport.querySelector('.carousel-track');
  if (!track) return;

  const id = viewport.id;
  const prevBtn = document.querySelector(`[data-carousel-prev="${id}"]`);
  const nextBtn = document.querySelector(`[data-carousel-next="${id}"]`);

  // Navegação por setas (anterior / próximo)
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const firstChild = track.firstElementChild;
      const step = firstChild ? firstChild.offsetWidth + 20 : 340;
      track.scrollBy({ left: -step, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const firstChild = track.firstElementChild;
      const step = firstChild ? firstChild.offsetWidth + 20 : 340;
      track.scrollBy({ left: step, behavior: 'smooth' });
    });
  }

  // Arraste com o mouse (Drag-to-Scroll)
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;

  track.addEventListener('mousedown', (e) => {
    if (window.innerWidth > 980 || track.scrollWidth <= track.clientWidth) return;
    isDown = true;
    hasDragged = false;
    track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  const stopDrag = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('dragging');
  };

  track.addEventListener('mouseleave', stopDrag);
  track.addEventListener('mouseup', stopDrag);

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged = true;
    }
    track.scrollLeft = scrollLeft - walk;
  });

  // Previne clique involuntário nos links durante o arraste
  track.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
});

// Animação de entrada suave (Scroll Reveal)
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.block, .cta, .card, .project').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
}

// Ano dinâmico no rodapé
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Voltar ao início suavemente ao clicar no botão Home, na marca ou no botão voltar ao topo
document.querySelectorAll('a[href="#topo"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (history.pushState) {
      history.pushState(null, '', '#topo');
    }
  });
});
