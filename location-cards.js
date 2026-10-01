/* Progressive enhancement: native HTML information, matching visual and focus states. */
(() => {
  'use strict';
  const explorer = document.querySelector('.location-explorer');
  if (!explorer) return;
  const cards = [...explorer.querySelectorAll('.place-card')];
  const views = [...explorer.querySelectorAll('[data-location-view]')];
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  const states = new Map(cards.map(card => [card, { pinned: false, hovering: false }]));
  let listView = false;
  const replacesFront = card => ['flip', 'shutters', 'album', 'poster', 'cabinet'].includes(card.dataset.cardKind);

  function syncCard(card) {
    const state = states.get(card);
    const open = state.pinned || (!listView && state.hovering);
    card.classList.toggle('is-open', open);
    const front = card.querySelector('.place-front');
    const detail = card.querySelector('.place-details');
    const frontHidden = !listView && open && replacesFront(card);
    front.inert = frontHidden;
    front.setAttribute('aria-hidden', String(frontHidden));
    detail.inert = !listView && !open;
    detail.setAttribute('aria-hidden', String(!listView && !open));
    card.querySelector('.place-open').setAttribute('aria-expanded', String(open || listView));
    card.setAttribute('aria-labelledby', card.id + (frontHidden ? '-detail-name' : '-name'));
  }

  function setOpen(card, open, focus = true) {
    const state = states.get(card);
    state.pinned = open;
    state.hovering = false;
    syncCard(card);
    if (focus) card.querySelector(open ? '.place-details' : '.place-open').focus({ preventScroll: replacesFront(card) });
  }

  cards.forEach(card => {
    card.querySelector('.place-open').addEventListener('click', () => setOpen(card, true));
    card.querySelector('.place-close').addEventListener('click', () => setOpen(card, false));
    card.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !listView && card.classList.contains('is-open')) {
        event.preventDefault();
        setOpen(card, false);
      }
    });
    // Mirror :hover in state so the back's links become accessible, too.
    // Listen on the stable outer article, not the rotating inner surface.
    if (card.dataset.cardKind === 'flip') {
      card.addEventListener('pointerenter', event => {
        if (!hoverQuery.matches || event.pointerType === 'touch' || listView) return;
        if (card.querySelector('.place-front').contains(document.activeElement)) return;
        states.get(card).hovering = true;
        syncCard(card);
      });
      card.addEventListener('pointerleave', () => {
        const state = states.get(card);
        if (state.hovering && card.querySelector('.place-details').contains(document.activeElement)) state.pinned = true;
        state.hovering = false;
        syncCard(card);
      });
    }
    syncCard(card);
  });

  views.forEach(button => button.addEventListener('click', () => {
    listView = button.dataset.locationView === 'list';
    explorer.classList.toggle('places-list', listView);
    views.forEach(view => view.setAttribute('aria-pressed', String(view === button)));
    cards.forEach(card => {
      states.get(card).hovering = false;
      syncCard(card);
    });
  }));

  hoverQuery.addEventListener('change', () => {
    cards.forEach(card => {
      const state = states.get(card);
      if (state.hovering && card.querySelector('.place-details').contains(document.activeElement)) state.pinned = true;
      state.hovering = false;
      syncCard(card);
    });
  });

  function revealHash() {
    let slug;
    try { slug = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const card = cards.find(item => item.id === slug);
    if (card) setOpen(card, true, false);
  }
  explorer.classList.add('cards-ready');
  revealHash();
  window.addEventListener('hashchange', revealHash);
})();
