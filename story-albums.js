/* Progressive enhancement: all originals remain available without JavaScript. */
(() => {
  document.querySelectorAll('[data-memory-album]').forEach(album => {
    const index = album.querySelector('.memory-index');
    const tabs = [...index.querySelectorAll('.memory-tab')];
    const pages = [...album.querySelectorAll('.memory-page')];
    if (!pages.length || pages.length !== tabs.length) return;
    const wide = window.matchMedia('(min-width: 861px)');
    let selected = -1;

    function select(next, focus = false) {
      if (next < 0 || next >= pages.length) return;
      const changed = next !== selected;
      selected = next;
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === next));
        tab.tabIndex = i === next ? 0 : -1;
        pages[i].hidden = i !== next;
        if (changed) pages[i].querySelector('.memory-credit').open = false;
      });
      if (focus) tabs[next].focus();
    }

    function orientation() {
      index.setAttribute('aria-orientation', wide.matches && !album.classList.contains('memory-family') ? 'vertical' : 'horizontal');
    }

    function fromHash() {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return false; }
      const next = pages.findIndex(page => page.id === id);
      if (next < 0) return false;
      select(next);
      return true;
    }

    tabs.forEach((tab, i) => {
      const original = pages[i].querySelector('img');
      const thumbnail = original.cloneNode(false);
      thumbnail.alt = '';
      thumbnail.removeAttribute('id');
      tab.querySelector('.memory-thumb').append(thumbnail);
      tab.setAttribute('role', 'tab');
      pages[i].setAttribute('role', 'tabpanel');
      pages[i].setAttribute('aria-labelledby', tab.id);
      pages[i].tabIndex = 0;
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', event => {
        const vertical = index.getAttribute('aria-orientation') === 'vertical';
        const forward = vertical ? 'ArrowDown' : 'ArrowRight';
        const back = vertical ? 'ArrowUp' : 'ArrowLeft';
        let next;
        if (event.key === forward) next = (i + 1) % tabs.length;
        else if (event.key === back) next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
      });
    });

    index.setAttribute('role', 'tablist');
    orientation();
    if (!fromHash()) select(Number(album.dataset.start) || 0);
    album.classList.add('album-ready');
    index.hidden = false;
    wide.addEventListener?.('change', orientation);
    window.addEventListener('hashchange', fromHash);
  });
})();
