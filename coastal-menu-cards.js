/* Coastal category-first menu. Original dish markup remains the source of truth. */
(() => {
 'use strict';
 const root=document.querySelector('.coastal.clean-menu');
 if(!root)return;
 const paper=root.querySelector('.menu-paper');
 const tabs=[...root.querySelectorAll('.menu-tabs [role="tab"]')];
 const sections=[...paper.querySelectorAll('.menu-category')];
 const panels=[...paper.querySelectorAll('[role="tabpanel"]')];
 const byId=id=>document.getElementById(id);
 const categories=[
  ['appetizers','Appetizers','A little something to share.'],
  ['soups','Soups & Salads','Comfort by the bowl. Freshness by the plate.'],
  ['botanas','Botana Platters','Made for gathering.'],
  ['combinations','Combinations','A little bit of your favorites.'],
  ['entrees','Tradicionales','The classics, done right.'],
  ['favorites','Local Favorites','Find your next favorite.','assets/instagram/post-CIgZ-0Qpy7U.jpg'],
  ['tacos','Tacos','Good things come in tortillas.'],
  ['drinks','Drinks','Something refreshing for the table.']
 ];
 const extraCategories=[
  ['light','Light cuisine','Fresh, satisfying choices for a lighter meal.'],
  ['burritos','Burritos','Your favorite fillings, wrapped up and ready.'],
 ['a-la-carte','À la carte','A little extra for your plate.','assets/coastal-a-la-carte-v1.png'],
  ['desserts','Desserts','Save a little room for something sweet.','assets/coastal-dessert-flan-v1.png']
 ];
 const drinks=['beverages','drinks','margaritas','beer-wine'];
 const landing=document.createElement('section');landing.id='coastal-categories';landing.className='coastal-category-landing';landing.setAttribute('aria-label','Browse menu categories');
 const grid=document.createElement('div');grid.className='coastal-category-grid';
 const extraGrid=document.createElement('div');extraGrid.className='coastal-category-grid coastal-category-grid--extras';
 const cardLinks=new Map();
 function anchor(id,label){const a=document.createElement('a');a.href='#'+id;a.textContent=label;return a;}
 function buildCard([id,title,description,override],index,target){
  const section=byId(id),original=section.querySelector('.coastal-category-photo');
  const a=anchor(id,'');a.className='coastal-category-card';cardLinks.set(id,a);
  const image=document.createElement('img');image.src=override||original?.src;image.alt='';image.width=600;image.height=400;image.loading=index<4?'eager':'lazy';image.decoding='async';
  image.style.objectPosition=original?.style.objectPosition||'50% 50%';
  const copy=document.createElement('div');copy.className='coastal-card-copy';
  const heading=document.createElement('h2');heading.textContent=title;
  const count=document.createElement('span');count.className='coastal-card-count';
  const ids=id==='drinks'?drinks:[id];count.textContent=ids.reduce((n,key)=>n+byId(key).querySelectorAll('.dish').length,0)+' items';
  const p=document.createElement('p');p.textContent=description;
  const arrow=document.createElement('span');arrow.className='coastal-card-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
  copy.append(heading,count,p,arrow);a.append(image,copy);target.append(a);
 }
 categories.forEach((category,index)=>buildCard(category,index,grid));
 extraCategories.forEach((category,index)=>buildCard(category,index+categories.length,extraGrid));
 const more=document.createElement('h2');more.className='coastal-more-categories';more.textContent='Also on the menu';
 const signoff=document.createElement('p');signoff.className='coastal-menu-signoff';signoff.textContent='Buena comida. Mejores momentos.';
 landing.append(grid,more,extraGrid,signoff);paper.before(landing);
 const toolbar=document.createElement('div');toolbar.className='coastal-detail-toolbar';
 const back=anchor('all-day','← Back to categories');const title=document.createElement('p');toolbar.append(back,title);paper.prepend(toolbar);
 const intro=root.querySelector('.menu-intro>div');
 const eyebrow=document.createElement('p');eyebrow.className='coastal-menu-eyebrow';eyebrow.textContent='Comida Mexicana Siempre';intro.prepend(eyebrow);
 intro.querySelector('p:not(.coastal-menu-eyebrow)').textContent='Family recipes. Fresh favorites. Find your next plate.';
 const quote=document.createElement('p');quote.className='coastal-menu-handnote';quote.innerHTML='Good food<br>brings people together';root.querySelector('.menu-intro').append(quote);
 let currentId='',hoverTimer;
 const menuFor=id=>id==='breakfast'||id==='breakfast-menu'?'breakfast-menu':id==='kids'||id==='kids-menu'?'kids-menu':id==='party-trays'||id==='trays-menu'?'trays-menu':'all-day';
 function render(id,{scroll=false,focus=false}={}){
  if(id==='all-day-food'||!id)id='all-day';
  if(id==='all-day-drinks')id='drinks';
  const selected=menuFor(id),isLanding=id==='all-day';
  const selection=id==='breakfast-menu'?['breakfast']:id==='kids-menu'?['kids']:id==='trays-menu'?['party-trays']:id==='drinks'?drinks:[id];
  if(!isLanding&&!selection.every(key=>sections.some(s=>s.id===key)))return false;
  currentId=id;
  tabs.forEach(tab=>{const active=tab.getAttribute('aria-controls')===selected;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
  sections.forEach(s=>s.hidden=isLanding||!selection.includes(s.id));
  panels.forEach(p=>p.hidden=![...p.querySelectorAll('.menu-category')].some(s=>!s.hidden));
  landing.hidden=!isLanding;paper.hidden=isLanding;
  title.textContent=id==='drinks'?'Drinks':isLanding?'':byId(selection[0]).querySelector('h2').textContent;
  const target=isLanding?landing:paper;
  if(scroll)target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||root.classList.contains('motion-off')?'auto':'smooth'});
  if(focus){const focusTarget=isLanding?(cardLinks.get(lastCategory)||grid.querySelector('a')):byId(selection[0]).querySelector('h2');focusTarget.tabIndex=isLanding?0:-1;focusTarget.focus({preventScroll:true});}
  return true;
 }
 let lastCategory='appetizers';
 function go(id,options={}){if(id!=='all-day')lastCategory=id;if(render(id,options)&&location.hash!=='#'+id)history.pushState(null,'','#'+id);}
 landing.addEventListener('click',event=>{const a=event.target.closest('a');if(!a||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();go(a.hash.slice(1),{scroll:true,focus:true});});
 back.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();go('all-day',{scroll:true,focus:true});});
 tabs.forEach((tab,index)=>{
  const activate=()=>go(tab.getAttribute('aria-controls'));
  tab.addEventListener('click',activate);
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();go(tabs[next].getAttribute('aria-controls'));});
  tab.addEventListener('pointerenter',event=>{clearTimeout(hoverTimer);if(event.pointerType==='mouse'&&!event.buttons&&matchMedia('(hover: hover) and (pointer: fine)').matches)hoverTimer=setTimeout(()=>{if(paper.contains(document.activeElement)||landing.contains(document.activeElement))tab.focus();activate();},220);});
  ['pointerleave','pointerdown','pointercancel'].forEach(type=>tab.addEventListener(type,()=>clearTimeout(hoverTimer)));
 });
 function revealHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!render(id))render('all-day');if(id==='all-day')requestAnimationFrame(()=>landing.scrollIntoView({block:'start',behavior:'auto'}));}
 root.classList.add('menu-enhanced','coastal-cards-ready');
 addEventListener('hashchange',revealHash);addEventListener('pagehide',()=>clearTimeout(hoverTimer));revealHash();
})();
