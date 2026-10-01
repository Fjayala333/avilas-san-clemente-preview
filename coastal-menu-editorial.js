/* Coastal-only reading controls. Existing tab controller and all menu data remain authoritative. */
(() => {
 'use strict';
 const root=document.querySelector('.coastal.clean-menu.menu-enhanced');
 if(!root)return;
 const paper=root.querySelector('.menu-paper');
 const regions=[...paper.querySelectorAll('.menu-scroll')];
 const bar=document.createElement('div');bar.className='coastal-menu-bar';
 const pills=document.createElement('nav');pills.className='coastal-menu-pills';pills.setAttribute('aria-label','Jump to a menu category');
 const mode=document.createElement('div');mode.className='coastal-menu-mode';
 const aside=document.createElement('aside');aside.className='coastal-menu-index';aside.setAttribute('aria-label','Current menu index');
 aside.innerHTML='<p>On this menu</p><nav class="coastal-index-links" aria-label="Menu section index"></nav><p class="coastal-side-note">Buena comida.<br>Mejores momentos.</p>';
 const sideLinks=aside.querySelector('nav');
 const expanders=[];
 function expandButton(){
  const button=document.createElement('button');button.type='button';button.className='coastal-menu-expand';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Expand menu into the page');
  button.innerHTML='Expand menu <span aria-hidden="true">⤢</span>';
  button.addEventListener('click',()=>{
   const expanded=paper.classList.toggle('menus-uncontained');
   root.classList.toggle('coastal-full-menu',expanded);
   expanders.forEach(b=>{b.setAttribute('aria-pressed',String(expanded));b.setAttribute('aria-label',expanded?'Return to scrollable menu':'Expand menu into the page');b.innerHTML=expanded?'Compact menu <span aria-hidden="true">⤡</span>':'Expand menu <span aria-hidden="true">⤢</span>';});
   requestAnimationFrame(updateCurrent);
  });
  expanders.push(button);return button;
 }
 bar.append(pills,mode,expandButton());aside.append(expandButton());
 const logo=document.createElement('img');logo.src='assets/avila-charro-logo.png';logo.width=1426;logo.height=1103;logo.alt='';logo.className='coastal-side-mark';
 const place=document.createElement('small');place.textContent='San Clemente, CA';
 aside.append(logo,place);paper.prepend(bar);paper.append(aside);
 let activeRegion=null,categories=[],currentId='',queued=false;
 const visible=node=>{for(let n=node;n&&n!==paper;n=n.parentElement)if(n.hidden)return false;return true;};
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||root.classList.contains('motion-off');
 function setCurrent(id){
  if(id===currentId)return;currentId=id;
  [pills,sideLinks].forEach(nav=>nav.querySelectorAll('[data-category-link]').forEach(a=>{
   if(a.dataset.categoryLink===id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');
  }));
 }
 function updateCurrent(){
  queued=false;if(!activeRegion||!categories.length)return;
  const expanded=paper.classList.contains('menus-uncontained');
  const top=expanded?bar.getBoundingClientRect().bottom+24:activeRegion.getBoundingClientRect().top+35;
  let current=categories[0];
  for(const section of categories){if(section.getBoundingClientRect().top<=top)current=section;else break;}
  setCurrent(current.id);
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(updateCurrent);}}
 function link(section){
  const a=document.createElement('a');a.href='#'+section.id;a.dataset.categoryLink=section.id;a.textContent=section.querySelector('h2').textContent;
  a.addEventListener('click',event=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   event.preventDefault();history.replaceState(null,'','#'+section.id);
   if(paper.classList.contains('menus-uncontained'))section.scrollIntoView({block:'start',behavior:reduced()?'auto':'smooth'});
   else activeRegion.scrollTo({top:activeRegion.scrollTop+section.getBoundingClientRect().top-activeRegion.getBoundingClientRect().top,behavior:reduced()?'auto':'smooth'});
   setCurrent(section.id);
  });
  return a;
 }
 function updateMenu(){
  const region=regions.find(visible);if(!region||region===activeRegion)return;
  activeRegion=region;categories=[...region.querySelectorAll('.menu-category')];currentId='';
  pills.replaceChildren();sideLinks.replaceChildren();mode.replaceChildren();
  categories.forEach(section=>{pills.append(link(section));sideLinks.append(link(section));});
  const owner=region.closest('[role=tabpanel]');
  if(owner?.id==='all-day-food'||owner?.id==='all-day-drinks'){
   const drinks=owner.id==='all-day-food',button=document.createElement('button');
   button.type='button';button.textContent=drinks?'Drinks →':'← Food';button.setAttribute('aria-label',drinks?'Show drinks menu':'Show food menu');
   button.addEventListener('click',()=>document.getElementById(drinks?'tab-all-day-drinks':'tab-all-day-food').click());
   mode.append(button);
  }
  expanders.forEach(b=>b.setAttribute('aria-controls',owner.id));
  updateCurrent();
 }
 regions.forEach(region=>region.addEventListener('scroll',schedule,{passive:true}));
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 new MutationObserver(updateMenu).observe(paper,{subtree:true,attributes:true,attributeFilter:['hidden']});
 root.classList.add('coastal-editorial-ready');updateMenu();
})();
