/* Progressive enhancement: the full menu remains readable without JavaScript. */
(() => {
 const root=document.querySelector('.clean-menu');
 if(!root)return;
 const groups=[...root.querySelectorAll('[data-menu-tabs]')].map(list=>({
   list,buttons:[...list.querySelectorAll('[role="tab"]')]
 }));
 const controlled=new Map();
 groups.forEach(group=>group.buttons.forEach(button=>controlled.set(button.getAttribute('aria-controls'),{group,button})));
 let hoverTimer=null;
 const hoverEnabled=()=>window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches;
 function cancelHover(){
   if(hoverTimer!==null){clearTimeout(hoverTimer);hoverTimer=null;}
 }
 function wouldHideFocus(group,button){
   return group.buttons.some(tab=>tab!==button&&document.getElementById(tab.getAttribute('aria-controls')).contains(document.activeElement));
 }
 function canPreview(group,button){
   if(!hoverEnabled())return false;
   for(let node=button;node&&node!==root;node=node.parentElement)if(node.hidden)return false;
   // A focused scroll region or deep-linked panel must not block mouse intent.
   // Activation transfers focus only when its current container will be hidden.
   return true;
 }
 function activate(group,button,{focus=false,updateHash=false}={}){
   cancelHover();
   group.buttons.forEach(tab=>{
     const selected=tab===button;
     tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;
     document.getElementById(tab.getAttribute('aria-controls')).hidden=!selected;
   });
   if(focus)button.focus();
   if(updateHash)history.replaceState(null,'','#'+button.getAttribute('aria-controls'));
 }
 groups.forEach(group=>{
   activate(group,group.buttons[0]);
   group.buttons.forEach(button=>{
     button.addEventListener('click',()=>activate(group,button,{updateHash:true}));
     button.addEventListener('pointerenter',event=>{
       cancelHover();
       if(event.pointerType!=='mouse'||event.buttons||button.getAttribute('aria-selected')==='true'||!canPreview(group,button))return;
       hoverTimer=setTimeout(()=>{
         hoverTimer=null;
         if(canPreview(group,button))activate(group,button,{focus:wouldHideFocus(group,button),updateHash:true});
       },180);
     });
     button.addEventListener('pointerleave',cancelHover);
     button.addEventListener('pointercancel',cancelHover);
     button.addEventListener('pointerdown',cancelHover);
     button.addEventListener('keydown',event=>{
       cancelHover();
       let index=group.buttons.indexOf(button);
       if(event.key==='ArrowRight')index=(index+1)%group.buttons.length;
       else if(event.key==='ArrowLeft')index=(index+group.buttons.length-1)%group.buttons.length;
       else if(event.key==='Home')index=0;
       else if(event.key==='End')index=group.buttons.length-1;
       else return;
       event.preventDefault();activate(group,group.buttons[index],{focus:true,updateHash:true});
     });
   });
 });
 root.addEventListener('focusin',cancelHover);
 addEventListener('blur',cancelHover);
 addEventListener('pagehide',cancelHover);
 root.classList.add('menu-enhanced');
 function revealHash(){
   cancelHover();
   let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
   const target=document.getElementById(id);if(!target||!root.contains(target))return;
   let node=target;const ancestors=[];
   while(node&&node!==root){const control=controlled.get(node.id);if(control)ancestors.unshift(control);node=node.parentElement;}
   ancestors.forEach(({group,button})=>activate(group,button));
   if(target.classList.contains('menu-category'))requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'auto'}));
 }
 addEventListener('hashchange',revealHash);
 revealHash();
})();
