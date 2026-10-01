(() => {
  const mainContent = document.querySelector('main#main');
  if (mainContent && !mainContent.hasAttribute('tabindex')) mainContent.tabIndex = -1;

  const ORDER_URL = 'https://order.online/store/AvilasElRanchito-36353517?hideModal=true&pickup=true';
  const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=204+Avenida+Del+Mar+San+Clemente+CA+92672';
  const PHONE_URL = 'tel:+19494985000';
  const compatibleRoutes = {
    'coastal.html': '/avilas-san-clemente-preview/',
    'coastal-menu.html': '/avilas-san-clemente-preview/coastal-menu.html',
    'menu/': '/avilas-san-clemente-preview/coastal-menu.html',
    'coastal-story.html': '/avilas-san-clemente-preview/coastal-story.html',
    'our-story/': '/avilas-san-clemente-preview/coastal-story.html',
    'coastal-locations.html': '/avilas-san-clemente-preview/coastal-locations.html',
    'locations/': '/avilas-san-clemente-preview/coastal-locations.html'
  };

  document.querySelectorAll('a[href]').forEach((link) => {
    const raw = link.getAttribute('href');
    if (!raw || raw.startsWith('http') || raw.startsWith('tel:') || raw.startsWith('mailto:') || raw.startsWith('#')) return;
    const [path, hash = ''] = raw.split('#');
    const name = path.replace(/^\.\//, '').replace(/^\//, '');
    if (compatibleRoutes[name]) link.setAttribute('href', compatibleRoutes[name] + (hash ? `#${hash}` : ''));
  });

  const nav = document.querySelector('.nav');
  if (nav && !nav.querySelector('.nav-order')) {
    const order = document.createElement('a');
    order.className = 'nav-order';
    order.href = ORDER_URL;
    order.target = '_blank';
    order.rel = 'noopener';
    order.textContent = 'Order Online ↗';
    order.dataset.track = 'order-nav';
    nav.append(order);
  }

  const heroActions = document.querySelector('.hero .actions, .coastal-hero .actions, .coastal-gallery-caption .actions, .hero-actions');
  if (heroActions && !heroActions.querySelector('.hero-order')) {
    const order = document.createElement('a');
    order.className = 'btn primary hero-order';
    order.href = ORDER_URL;
    order.target = '_blank';
    order.rel = 'noopener';
    order.textContent = 'Order Online ↗';
    order.dataset.track = 'order-hero';
    heroActions.prepend(order);
  }

  function restaurantNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: false
    }).formatToParts(new Date()).reduce((out, part) => (out[part.type] = part.value, out), {});
    const day = parts.weekday;
    const minutes = Number(parts.hour === '24' ? 0 : parts.hour) * 60 + Number(parts.minute);
    const hours = {
      Mon: [660, 1260], Tue: [660, 1260], Wed: [660, 1260], Thu: [660, 1260],
      Fri: [660, 1320], Sat: [600, 1320], Sun: [600, 1260]
    };
    const [openAt, closeAt] = hours[day];
    const open = minutes >= openAt && minutes < closeAt;
    const label = (value) => {
      const hour = Math.floor(value / 60);
      return `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;
    };
    return { open, text: open ? `Open now · until ${label(closeAt)}` : `Closed now · ${day === 'Sat' || day === 'Sun' ? 'opens at 10 AM' : 'opens at 11 AM'}` };
  }

  const heroCopy = document.querySelector('.hero-copy, .coastal-hero-copy, .coastal-gallery-caption > div:last-child, .hero > div');
  if (document.body.classList.contains('home') && heroCopy && !heroCopy.querySelector('.open-status')) {
    const status = restaurantNow();
    const line = document.createElement('p');
    line.className = 'open-status';
    line.dataset.open = String(status.open);
    line.textContent = status.text;
    heroCopy.append(line);
  }

  if (!document.querySelector('.mobile-actions')) {
    const mobile = document.createElement('nav');
    mobile.className = 'mobile-actions';
    mobile.setAttribute('aria-label', 'Quick actions');
    mobile.innerHTML = `
      <a href="/avilas-san-clemente-preview/coastal-menu.html" data-track="menu-mobile">Menu</a>
      <a href="${MAP_URL}" target="_blank" rel="noopener" data-track="directions-mobile">Directions</a>
      <a href="${PHONE_URL}" data-track="call-mobile">Call</a>
      <a href="${ORDER_URL}" target="_blank" rel="noopener" data-track="order-mobile">Order</a>`;
    document.body.append(mobile);
  }

  const sanClementeActions = document.querySelector('#san-clemente .location-actions, [data-location="san-clemente"] .location-actions');
  if (sanClementeActions && !sanClementeActions.querySelector('.order-location')) {
    const order = document.createElement('a');
    order.className = 'btn order-location';
    order.href = ORDER_URL;
    order.target = '_blank';
    order.rel = 'noopener';
    order.textContent = 'Order Online ↗';
    order.dataset.track = 'order-location';
    sanClementeActions.insertBefore(order, sanClementeActions.querySelector('.location-source'));
  }

  if (document.body.classList.contains('clean-menu')) {
    const guestFavorites = /Avila|Pepe|Mamá/i;
    const chileWords = /jalapeñ|chile|chili|chipotle|salsa negra/i;
    document.querySelectorAll('.dish').forEach((dish) => {
      const title = dish.querySelector('h3')?.textContent || '';
      const description = dish.querySelector('p')?.textContent || '';
      const badges = [];
      if (guestFavorites.test(title)) badges.push('Guest favorite');
      if (chileWords.test(description)) badges.push('Made with chile');
      if (!badges.length) return;
      const row = document.createElement('div');
      row.className = 'dish-badges';
      row.setAttribute('aria-label', 'Dish notes');
      badges.forEach((label) => {
        const badge = document.createElement('span');
        badge.className = 'dish-badge';
        badge.textContent = label;
        row.append(badge);
      });
      dish.append(row);
    });
    const menuReader = document.querySelector('.coastal-menu-reader');
    if (menuReader && !document.querySelector('.menu-dietary-note')) {
      const note = document.createElement('p');
      note.className = 'menu-dietary-note';
      note.textContent = 'Please tell your server about allergies or dietary needs. Ingredients, preparation methods and availability may change.';
      menuReader.append(note);
    }
  }

  document.querySelectorAll('[data-gallery-photo]').forEach((link) => {
    if (link.dataset.description) return;
    const alt = link.querySelector('img')?.alt?.trim();
    if (alt) link.dataset.description = alt.endsWith('.') ? alt : `${alt}.`;
  });

  const footer = document.querySelector('.footer');
  if (footer && !footer.querySelector('.footer-social')) {
    const social = document.createElement('nav');
    social.className = 'footer-social';
    social.setAttribute('aria-label', 'Follow us on social media');
    social.innerHTML = `
      <span class="footer-social-label">Follow us</span>
      <a href="https://www.facebook.com/AvilasElRanchito" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook (opens in a new tab)">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1.02.28-1.75 1.75-1.75H17V2.37A22.85 22.85 0 0 0 14.45 2C11.92 2 10 3.54 10 6.4v3.1H7V13h3v9z"/avilas-san-clemente-preview/></svg>
        <span>Facebook</span>
      </a>
      <a href="https://www.instagram.com/avilas.san.clemente/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram (opens in a new tab)">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/avilas-san-clemente-preview/><circle cx="12" cy="12" r="4"/avilas-san-clemente-preview/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/avilas-san-clemente-preview/></svg>
        <span>Instagram</span>
      </a>`;
    footer.prepend(social);
  }
  const navBar = document.querySelector('.site-nav-bar');
  const footerSocial = footer?.querySelector('.footer-social');
  if (navBar && footerSocial && !document.querySelector('.header-social')) {
    const headerSocial = footerSocial.cloneNode(true);
    headerSocial.className = 'header-social';
    headerSocial.setAttribute('aria-label', 'Follow us');
    navBar.before(headerSocial);
  }
  if (footer && !footer.querySelector('.site-legal')) {
    [...footer.children].forEach((child) => {
      if (/compare all|local preview|not published/i.test(child.textContent || '')) child.remove();
    });
    const legal = document.createElement('div');
    legal.className = 'site-legal';
    legal.innerHTML = '<a href="/avilas-san-clemente-preview/privacy/index.html">Privacy</a><a href="/avilas-san-clemente-preview/accessibility/index.html">Accessibility</a><a href="tel:+19494985000">(949) 498-5000</a><span>© Avila’s El Ranchito · San Clemente</span>';
    footer.append(legal);
  }

  function eventName(link) {
    if (link.dataset.track) return link.dataset.track;
    const href = link.href || '';
    if (href.startsWith('tel:')) return 'call';
    if (/google\.com\/maps/i.test(href)) return 'directions';
    if (/order\.online/i.test(href)) return 'order';
    if (/\/menu\/?(?:#|$)|coastal-menu/i.test(href)) return 'menu';
    return '';
  }
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const name = eventName(link);
    if (!name) return;
    const detail = { action: name, label: link.textContent.trim(), href: link.href, path: location.pathname };
    window.dispatchEvent(new CustomEvent('avila:conversion', { detail }));
    if (typeof window.gtag === 'function') window.gtag('event', name, detail);
  });
})();
