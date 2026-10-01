/* Photo navigation adds focus to the existing menu-tab deep-link behavior. */
(() => {
 const root = document.querySelector('.menu-gallery-page');
 if (!root) return;
 const galleries = root.querySelectorAll('.menu-gallery');
 // Below-menu photos animate once on arrival, never while still offscreen.
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('gallery-inview');
    observer.unobserve(entry.target);
   });
  }, { threshold: 0.12 });
  galleries.forEach(gallery => observer.observe(gallery));
 } else {
  galleries.forEach(gallery => gallery.classList.add('gallery-inview'));
 }
 root.querySelectorAll('[data-menu-photo]').forEach(link => {
  link.addEventListener('click', event => {
   if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
   const href = link.getAttribute('href');
   if (!href || !href.startsWith('#')) return;
   const target = document.getElementById(href.slice(1));
   if (!target) return;
   event.preventDefault();
   if (location.hash !== href) history.pushState(null, '', href);
   // Also reveals the tab when an already-selected photo is clicked again.
   window.dispatchEvent(new Event('hashchange'));
   requestAnimationFrame(() => {
    const destination = target.querySelector('h2') || target;
    if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
   });
  });
 });
})();
