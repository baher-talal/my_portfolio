// ── Dark / Light toggle ──
// NOTE: initial theme is applied inline in <head> before first paint (no flash).
// This script only handles the toggle button behavior.
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const icon = toggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-moon' : 'far fa-moon';
  try { localStorage.setItem('portfolio-theme', theme); } catch(e) {}
}

// Sync button icon with whatever the inline script already applied
const currentTheme = root.getAttribute('data-theme') || 'dark';
applyTheme(currentTheme);

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ── Auto-number project cards ──
// Numbers are generated here so they never get out of sync with the HTML order.
document.querySelectorAll('#project-list .project-number').forEach((el, i) => {
  el.textContent = String(i + 1).padStart(2, '0');
});

// ── Scroll-to-top ──
const scrollBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ── Project details modal (for project-card--no-link cards) ──
const projectDetailsModal = $('#projectDetailsModal');

document.querySelectorAll('#project-list .project-card--no-link').forEach(card => {
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('role', 'button');
  card.tabIndex = 0;
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
  card.addEventListener('click', () => projectDetailsModal.modal('show', card));
});

projectDetailsModal.on('show.bs.modal', function(event) {
  const card = event.relatedTarget;
  const title       = card.querySelector('.project-title').textContent.trim();
  const description = card.querySelector('.project-desc').textContent.trim();
  const stack       = card.querySelector('.project-stack');

  this.querySelector('#projectDetailsModalTitle').textContent = title;

  const modalDesc = this.querySelector('.project-modal-desc');
  modalDesc.textContent = description;
  modalDesc.hidden = !description;

  const galleryImages = (card.dataset.gallery || '')
    .split(',').map(p => p.trim()).filter(Boolean);

  const modalGallery = this.querySelector('.project-modal-gallery');
  modalGallery.replaceChildren(...galleryImages.map((path, idx) => {
    const figure      = document.createElement('figure');
    figure.className  = 'project-modal-image';
    const img         = document.createElement('img');
    img.alt           = `${title} screenshot ${idx + 1}`;
    const placeholder = document.createElement('figcaption');
    placeholder.className = 'project-modal-image-placeholder';
    placeholder.textContent = `Add screenshot: ${path}`;
    placeholder.hidden = true;
    img.addEventListener('error', () => { img.hidden = true; placeholder.hidden = false; }, { once: true });
    img.src = path;
    figure.append(img, placeholder);
    return figure;
  }));

  this.querySelector('.project-modal-stack')
    .replaceChildren(...Array.from(stack.children, el => el.cloneNode(true)));
});

// ── Progressive disclosure (Show More) ──
const projectCards    = Array.from(document.querySelectorAll('#project-list .project-card'));
const loadMoreBtn     = document.querySelector('.projects-load-more');
const INITIAL_VISIBLE = 8;

projectCards.slice(INITIAL_VISIBLE).forEach(card => { card.hidden = true; });

if (loadMoreBtn) {
  loadMoreBtn.hidden = projectCards.length <= INITIAL_VISIBLE;
  loadMoreBtn.addEventListener('click', () => {
    projectCards.forEach(card => { card.hidden = false; });
    loadMoreBtn.hidden = true;
  });
}
