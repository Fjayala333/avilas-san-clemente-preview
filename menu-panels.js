/* Keeps every tab independent; a single explicit escape from nested scrolling. */
(() => {
 const paper=document.querySelector('.menu-enhanced .menu-paper');
 if(!paper)return;
 const regions=[...paper.querySelectorAll('.menu-scroll')];
 const tools=document.createElement('div');tools.className='menu-viewport-tools';
 const hint=document.createElement('span');hint.id='menu-scroll-help';
 hint.textContent='Scroll within the menu to explore.';
 const toggle=document.createElement('button');toggle.type='button';
 toggle.textContent='Expand menu';toggle.setAttribute('aria-pressed','false');
 toggle.setAttribute('aria-controls','all-day-food all-day-drinks breakfast-menu kids-menu trays-menu');
 regions.forEach(region=>region.setAttribute('aria-describedby',hint.id));
 tools.append(hint,toggle);paper.prepend(tools);
 toggle.addEventListener('click',()=>{
  const expanded=paper.classList.toggle('menus-uncontained');
  toggle.setAttribute('aria-pressed',String(expanded));
  toggle.textContent=expanded?'Use scrollable menu':'Expand menu';
  hint.textContent=expanded?'Full menu view — scroll the page.':'Scroll within the menu to explore.';
 });
})();
