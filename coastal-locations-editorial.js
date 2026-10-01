/* The photographic mosaic is the primary interface. Existing static records
   remain the single source for the accessible details drawer. */
(() => {
  'use strict';
  const body = document.body;
  const explorer = document.querySelector('.editorial-records');
  if (!body.classList.contains('editorial-locations-page') || !explorer) return;

  const cards = [...explorer.querySelectorAll('.place-card')];
  const tiles = [...document.querySelectorAll('[data-location-tile]')];
  const openers = [...document.querySelectorAll('[data-open-location]')];
  const filters = [...document.querySelectorAll('[data-location-filter]')];
  const status = document.querySelector('[data-location-filter-status]');
  const scrim = document.querySelector('.location-drawer-scrim');
  let lastOpener = null;
  const backgroundInert = new Set();

  const clearBackgroundInert = () => {
    backgroundInert.forEach((element) => { element.inert = false; });
    backgroundInert.clear();
  };

  const isolateDialog = (dialog) => {
    clearBackgroundInert();
    let branch = dialog;
    while (branch?.parentElement && branch !== document.body) {
      const parent = branch.parentElement;
      [...parent.children].forEach((sibling) => {
        if (sibling === branch || sibling === scrim || sibling.inert) return;
        sibling.inert = true;
        backgroundInert.add(sibling);
      });
      branch = parent;
    }
  };

  // The existing scroll observer reveals cards. Give neighboring cards short,
  // alternating delays, then release the animation so filtering stays responsive.
  document.querySelectorAll('.editorial-location-board,.editorial-location-continuation').forEach((grid) => {
    [...grid.querySelectorAll('.editorial-location-tile')]
      .filter((tile) => getComputedStyle(tile).display !== 'none')
      .forEach((tile, index) => {
        tile.style.setProperty('--card-arrival-delay', (index % 2) * 85 + 'ms');
        tile.addEventListener('animationend', (event) => {
          if (event.target === tile && event.animationName === 'coastal-card-arrive') tile.classList.add('card-arrived');
        });
      });
  });

  /* This runs before location-cards.js so its former hover-flip behavior is
     not attached. Its proven focus, inert, Escape and deep-link logic remains. */
  cards.forEach((card) => {
    card.dataset.cardKind = 'editorial';
    card.querySelector('.place-details')?.setAttribute('role', 'dialog');
  });
  body.classList.add('editorial-enhanced');

  const cardFor = (slug) => cards.find((card) => card.id === slug);
  const visualFor = (slug) => openers.find((opener) => opener.dataset.openLocation === slug);

  openers.forEach((opener) => opener.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const card = cardFor(opener.dataset.openLocation);
    const control = card?.querySelector('.place-open');
    if (!card || !control) return;
    event.preventDefault();
    lastOpener = opener;
    history.replaceState(null, '', `#${card.id}`);
    control.click();
  }));

  const syncDrawer = () => {
    const openCard = cards.find((card) => card.classList.contains('is-open'));
    body.classList.toggle('location-drawer-open', Boolean(openCard));
    if (scrim) scrim.hidden = !openCard;
    cards.forEach((card) => {
      const details = card.querySelector('.place-details');
      if (!details) return;
      if (card === openCard) details.setAttribute('aria-modal', 'true');
      else details.removeAttribute('aria-modal');
    });
    if (openCard) isolateDialog(openCard.querySelector('.place-details'));
    else clearBackgroundInert();
    if (openCard && !lastOpener) lastOpener = visualFor(openCard.id) || null;
  };
  const observer = new MutationObserver(syncDrawer);
  cards.forEach((card) => observer.observe(card, { attributes:true, attributeFilter:['class'] }));

  const closeDrawer = () => {
    const openCard = cards.find((card) => card.classList.contains('is-open'));
    if (!openCard) return;
    openCard.querySelector('.place-close')?.click();
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    requestAnimationFrame(() => lastOpener?.focus({ preventScroll:true }));
  };
  scrim?.addEventListener('click', closeDrawer);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.editorial-records .place-close')) return;
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    requestAnimationFrame(() => lastOpener?.focus({ preventScroll:true }));
  });
  document.addEventListener('keydown', (event) => {
    const openCard = cards.find((card) => card.classList.contains('is-open'));
    if (!openCard) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeDrawer();
      return;
    }
    if (event.key !== 'Tab') return;
    const details = openCard.querySelector('.place-details');
    const focusable = [...details.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter((node) => !node.hidden && node.getClientRects().length);
    if (!focusable.length) {
      event.preventDefault();
      details.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!details.contains(document.activeElement) || document.activeElement === details) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, true);

  const uniqueLocationCount = (visibleTiles) => new Set(visibleTiles.map((tile) => tile.dataset.locationTile)).size;
  filters.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.locationFilter;
    filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const matches = [];
    tiles.forEach((tile) => {
      const regions = (tile.dataset.locationRegion || '').split(/\s+/).filter(Boolean);
      const match = selected === 'all' || regions.includes(selected);
      tile.classList.toggle('is-muted', !match);
      tile.classList.toggle('is-highlighted', match && selected !== 'all');
      if (match) matches.push(tile);
    });
    if (status) {
      const count = uniqueLocationCount(matches);
      status.textContent = selected === 'all' ? 'All locations shown.' : `${count} ${count === 1 ? 'location' : 'locations'} highlighted.`;
    }
  }));

  syncDrawer();
})();
