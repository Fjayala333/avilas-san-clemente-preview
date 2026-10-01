/* Local originals open without JavaScript; enhancement adds an accessible viewer. */
(() => {
 const links=[...document.querySelectorAll('[data-gallery-photo]')];
 if(!links.length||typeof HTMLDialogElement==='undefined')return;
 const dialog=document.createElement('dialog');dialog.className='photo-dialog';
 dialog.setAttribute('aria-labelledby','photo-dialog-title');
 dialog.innerHTML='<header><h2 id="photo-dialog-title"></h2><button type="button" class="photo-close" aria-label="Close photograph">×</button></header><p id="photo-dialog-description" class="photo-description" hidden></p><img class="photo-large" alt=""><div class="photo-dialog-bottom"><a class="photo-source" target="_blank" rel="noopener">Original Instagram post ↗</a><div class="photo-paging"><button type="button" class="photo-prev" aria-label="Previous photograph">←</button><span class="photo-count" aria-live="polite"></span><button type="button" class="photo-next" aria-label="Next photograph">→</button></div></div>';
 document.body.append(dialog);
 const large=dialog.querySelector('.photo-large');
 const description=dialog.querySelector('.photo-description');
 let active=[],index=0,opener=null;
 function show(){
  const link=active[index],img=link.querySelector('img');
  large.src=link.href;large.alt=img.alt;
  dialog.querySelector('#photo-dialog-title').textContent=link.dataset.title||img.alt;
  const copy=(link.dataset.description||img.alt||'').trim();
  description.textContent=copy;description.hidden=!copy;
  if(copy)dialog.setAttribute('aria-describedby','photo-dialog-description');
  else dialog.removeAttribute('aria-describedby');
  dialog.querySelector('.photo-source').href=link.dataset.source;
  dialog.querySelector('.photo-count').textContent=(index+1)+' / '+active.length;
 }
 function step(delta){index=(index+delta+active.length)%active.length;show();}
 links.forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();opener=link;
  active=links.filter(item=>item.dataset.galleryPhoto===link.dataset.galleryPhoto);
  index=active.indexOf(link);show();dialog.showModal();
  document.documentElement.classList.add('photo-dialog-open');
 }));
 dialog.querySelector('.photo-close').addEventListener('click',()=>dialog.close());
 dialog.querySelector('.photo-prev').addEventListener('click',()=>step(-1));
 dialog.querySelector('.photo-next').addEventListener('click',()=>step(1));
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}
  if(event.key==='ArrowRight'){event.preventDefault();step(1);}
 });
 dialog.addEventListener('close',()=>{
  large.removeAttribute('src');document.documentElement.classList.remove('photo-dialog-open');opener?.focus();
 });
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog)return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
 });
})();
