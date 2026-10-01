/* Sticky positioning is native CSS; this keeps anchors and focus accessible. */
(() => {
  const bar = document.querySelector('.site-nav-bar');
  const topLink = document.querySelector('.back-to-top');
  if (!bar || !topLink) return;

  const page = document.documentElement;
  let measuredHeight = 0;
  function measureHeader() {
    const height = Math.ceil(bar.getBoundingClientRect().height);
    if (height !== measuredHeight) {
      measuredHeight = height;
      page.style.setProperty('--site-nav-height', height + 'px');
    }
  }
  measureHeader();
  if ('ResizeObserver' in window) {
    new ResizeObserver(measureHeader).observe(bar);
  } else {
    addEventListener('resize', measureHeader);
    bar.addEventListener('click', () => requestAnimationFrame(measureHeader));
  }

  topLink.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const navigationToggle = bar.querySelector('.nav-toggle');
    if (navigationToggle?.getAttribute('aria-expanded') === 'true') navigationToggle.click();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.classList.contains('motion-off');
    document.body.focus({preventScroll: true});
    window.scrollTo({top: 0, left: 0, behavior: still ? 'auto' : 'smooth'});
  });
})();
