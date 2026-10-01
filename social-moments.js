// No third-party requests until the visitor explicitly loads an Instagram player.
const links=[...document.querySelectorAll('[data-reel]')];
if(links.length&&typeof HTMLDialogElement!=='undefined'){
 const dialog=document.createElement('dialog');dialog.className='reel-dialog';dialog.setAttribute('aria-labelledby','reel-title');
 dialog.innerHTML='<header><h2 id="reel-title">A moment at Avila’s</h2><button type="button" aria-label="Close reel">×</button></header><p class="reel-description"></p><button type="button" class="reel-consent">Load Instagram player</button><div class="reel-frame"></div><p class="reel-disclosure">Loading the player connects to Instagram and may use cookies. Playback may require Instagram access. Nothing plays automatically.</p><a class="reel-external" target="_blank" rel="noopener">Watch directly on Instagram ↗</a>';
 document.body.append(dialog);
 let opener=null,code='';
 const frame=dialog.querySelector('.reel-frame'),consent=dialog.querySelector('.reel-consent');
 links.forEach(a=>a.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  if(!/^[A-Za-z0-9_-]+$/.test(a.dataset.reel))return;
  event.preventDefault();opener=a;code=a.dataset.reel;
  dialog.querySelector('#reel-title').textContent=a.dataset.reelTitle||'A moment at Avila’s';
  dialog.querySelector('.reel-description').textContent=a.dataset.reelDescription||'From the San Clemente restaurant’s Instagram collection.';
  dialog.querySelector('.reel-external').href=a.href;consent.hidden=false;frame.replaceChildren();dialog.showModal();document.documentElement.classList.add('reel-dialog-open');
 }));
 consent.addEventListener('click',()=>{const iframe=document.createElement('iframe');iframe.src='https://www.instagram.com/p/'+code+'/embed/';iframe.title=dialog.querySelector('#reel-title').textContent+' on Instagram';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allow='fullscreen';frame.replaceChildren(iframe);consent.hidden=true;iframe.focus();});
 dialog.querySelector('header button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{frame.replaceChildren();document.documentElement.classList.remove('reel-dialog-open');opener?.focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
}
