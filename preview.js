'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches;
document.documentElement.classList.add('js-nav');
const nav=document.querySelector('.nav'),toggle=document.querySelector('.nav-toggle');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});nav.addEventListener('click',e=>{if(e.target.closest('a')){toggle.setAttribute('aria-expanded','false');nav.classList.remove('open');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){toggle.click();toggle.focus();}});}
if(window.ScrollCraft)ScrollCraft.mount(document.body);
// The engine stays untouched. These natural-flow scenes share one event-driven paint.
const animated=[...document.querySelectorAll('.reveal,.wipe,.motion-enter')];
const scenes=[...document.querySelectorAll('[data-scene]')];
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const p=clamp(n);return p*p*(3-2*p);};
const motion=document.querySelector('.motion');
let queued=false;
const motionDisabled=()=>paused||reduce.matches;
function paint(){
 queued=false;
 if(document.hidden)return;
 const still=motionDisabled()||innerWidth<801;
 scenes.forEach(el=>{
  const r=el.getBoundingClientRect();
  const p=still?1:smooth((innerHeight*.9-r.top)/Math.max(1,Math.min(r.height,innerHeight)*.95));
  const second=still?1:smooth((innerHeight*.76-r.top)/Math.max(1,Math.min(r.height,innerHeight)*.9));
  const travel=still?1:clamp((innerHeight-r.top)/Math.max(1,innerHeight+r.height));
  el.style.setProperty('--scene',p.toFixed(4));
  el.style.setProperty('--scene-second',second.toFixed(4));
  el.style.setProperty('--travel',travel.toFixed(4));
 });
}
function queue(){if(!queued&&!document.hidden){queued=true;requestAnimationFrame(paint);}}
function setMotion(){
 const off=motionDisabled();
 document.body.classList.toggle('motion-off',off);
 document.documentElement.classList.toggle('motion-stopped',off);
 if(motion){
  motion.setAttribute('aria-pressed',String(off));
  motion.disabled=reduce.matches;
  motion.textContent=reduce.matches?'Reduced motion enabled':paused?'Resume motion':'Pause motion';
 }
 // Settle synchronously, including at the moment a device preference changes.
 paint();
}
addEventListener('scroll',queue,{passive:true});
addEventListener('resize',queue);
document.addEventListener('visibilitychange',queue);
if(motion)motion.addEventListener('click',()=>{if(!reduce.matches){paused=!paused;setMotion();}});
reduce.addEventListener('change',()=>{paused=reduce.matches;setMotion();});
setMotion();
document.documentElement.classList.add('motion-enhanced');
if('IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){
   entry.target.classList.add('is-visible');
   observer.unobserve(entry.target);
  }
 }),{threshold:.1});
 document.documentElement.classList.add('motion-ready');
 animated.forEach(el=>observer.observe(el));
}
const focusImage=document.querySelector('#focus-image');
const focusStates={soup:{scale:1.45,origin:'22% 44%',caption:'Mamá Avila’s Soup: chicken, rice, avocado and warm tortillas. $18 on the official San Clemente menu.',href:'modern-menu.html#soups',label:'Explore soups ↗',alt:'Mama Avila’s soup within the original food-spread photograph'},guacamole:{scale:1.6,origin:'48% 58%',caption:'Guacamole Fresco: avocado, tomato, cilantro, onion and lime, finished with shredded cheese. $16 on the official menu.',href:'modern-menu.html#appetizers',label:'Explore appetizers ↗',alt:'Guacamole within the original food-spread photograph'},spread:{scale:1,origin:'50% 50%',caption:'A generous spread from our original restaurant photography. Explore the menu to plan your meal.',href:'modern-menu.html',label:'View Menu ↗',alt:'The original restaurant food-spread photograph'}};
document.querySelectorAll('[data-focus]').forEach(button=>button.addEventListener('click',()=>{const state=focusStates[button.dataset.focus];if(!state||!focusImage)return;focusImage.style.transformOrigin=state.origin;focusImage.style.transform='scale('+state.scale+')';focusImage.alt=state.alt;focusImage.classList.remove('focus-arrive');if(!motionDisabled()){void focusImage.offsetWidth;focusImage.classList.add('focus-arrive');}document.querySelector('#focus-caption').textContent=state.caption;const link=document.querySelector('#focus-link');link.href=state.href;link.textContent=state.label;document.querySelectorAll('[data-focus]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
