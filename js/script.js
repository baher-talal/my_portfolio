// ── Dark / Light toggle ──
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const icon = toggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-moon';
  } else {
    icon.className = 'far fa-moon';
  }
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch(e) {}
}

// Init from saved preference (default: dark)
let saved = 'dark';
try {
  saved = localStorage.getItem('portfolio-theme') || 'dark';
} catch(e) {}
applyTheme(saved);

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// ── Scroll-to-top ──
const scrollBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, {passive: true});

// ── Prevent navigation on private project cards ──
document.querySelectorAll('.project-card--no-link').forEach(card => {
  card.addEventListener('click', e => e.preventDefault());
});

// ── Project details modal ──
const projectDetailsModal = $('#projectDetailsModal');

document.querySelectorAll('#project-list .project-card--no-link').forEach(card => {
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('role', 'button');
  card.tabIndex = 0;
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      card.click();
    }
  });
  card.addEventListener('click', () => {
    projectDetailsModal.modal('show', card);
  });
});

projectDetailsModal.on('show.bs.modal', function (event) {
  const projectCard = event.relatedTarget;
  const title = projectCard.querySelector('.project-title').textContent.trim();
  const description = projectCard.querySelector('.project-desc').textContent.trim();
  const stack = projectCard.querySelector('.project-stack');
  const modalDescription = this.querySelector('.project-modal-desc');
  const modalGallery = this.querySelector('.project-modal-gallery');
  const modalStack = this.querySelector('.project-modal-stack');

  this.querySelector('#projectDetailsModalTitle').textContent = title;
  modalDescription.textContent = description;
  modalDescription.hidden = !description;
  const galleryImages = (projectCard.dataset.gallery || '')
    .split(',')
    .map(path => path.trim())
    .filter(Boolean);
  modalGallery.replaceChildren(...galleryImages.map((path, index) => {
    const figure = document.createElement('figure');
    figure.className = 'project-modal-image';

    const image = document.createElement('img');
    image.alt = `${title} screenshot ${index + 1}`;

    const placeholder = document.createElement('figcaption');
    placeholder.className = 'project-modal-image-placeholder';
    placeholder.textContent = `Add screenshot: ${path}`;
    placeholder.hidden = true;

    image.addEventListener('error', () => {
      image.hidden = true;
      placeholder.hidden = false;
    }, { once: true });
    image.src = path;

    figure.append(image, placeholder);
    return figure;
  }));
  modalStack.replaceChildren(...Array.from(stack.children, item => item.cloneNode(true)));
});

// ── Projects: progressive disclosure ──
const projectCards = Array.from(document.querySelectorAll('#project-list .project-card'));
const projectsLoadMore = document.querySelector('.projects-load-more');
const initiallyVisibleProjects = 8;

projectCards.slice(initiallyVisibleProjects).forEach(card => {
  card.hidden = true;
});

if (projectsLoadMore) {
  projectsLoadMore.hidden = projectCards.length <= initiallyVisibleProjects;
  projectsLoadMore.addEventListener('click', () => {
    projectCards.forEach(card => {
      card.hidden = false;
    });
    projectsLoadMore.hidden = true;
  });
}
