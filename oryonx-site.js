(()=>{
'use strict';
const root=document.documentElement,valid=['palette','mono','warm'];
let mode=valid.includes(root.dataset.theme)?root.dataset.theme:'palette';
const appearance=document.querySelector('[data-appearance]');
function applyTheme(value){
 if(!valid.includes(value))return;
 mode=value;root.dataset.theme=value;if(appearance)appearance.value=value;
 document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(!/^oryonx-[\w-]+\.html(?:[?#]|$)/.test(raw))return;const u=new URL(raw,location.href);u.searchParams.set('thema',value);a.setAttribute('href',u.pathname.split('/').pop()+u.search+u.hash)});
 document.dispatchEvent(new CustomEvent('oryonx:theme'));
}
if(appearance)appearance.addEventListener('change',()=>applyTheme(appearance.value));applyTheme(mode);
const menu=document.querySelector('.site-menu'),mobile=matchMedia('(max-width: 1050px)');
if(menu){
 const summary=menu.querySelector('summary');
 const setMenu=()=>{menu.open=!mobile.matches;};setMenu();mobile.addEventListener('change',setMenu);
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(mobile.matches)menu.open=false}));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobile.matches&&menu.open){menu.open=false;summary.focus()}});
 document.addEventListener('click',event=>{if(mobile.matches&&menu.open&&!menu.contains(event.target))menu.open=false});
}
const allocation=[0,1,2],names=['Campagnes','Content','Rapportages'];
const sentences=['ORYONX voert uit, jouw team bepaalt mee de richting.','we maken en verbeteren het werk samen.','jouw team werkt zelfstandig met een ingerichte werkwijze.'];
const workButtons=[...document.querySelectorAll('[data-work]')],list=document.querySelector('[data-work-summary]');
function renderAllocation(){
 workButtons.forEach(b=>b.setAttribute('aria-pressed',String(allocation[Number(b.dataset.work)]===Number(b.dataset.mode))));
 allocation.forEach((m,i)=>{const dot=document.querySelector('.dot-'+i);if(dot)dot.style.transform='translateX('+((m-i)*270)+'px)'});
 if(list)list.replaceChildren(...allocation.map((m,i)=>{const li=document.createElement('li');li.textContent=names[i]+': '+sentences[m];return li}));
}
workButtons.forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{const row=Number(b.dataset.work),value=Number(b.dataset.mode);if(![0,1,2].includes(row)||![0,1,2].includes(value))return;allocation[row]=value;renderAllocation()})});
const reset=document.querySelector('[data-reset-allocation]');if(reset){reset.hidden=false;reset.addEventListener('click',()=>{allocation.splice(0,3,0,1,2);renderAllocation()})}
const prepare=document.querySelector('[data-prepare]');
if(prepare){
 const message=document.querySelector('#contact-message'),error=document.querySelector('#message-error'),result=document.querySelector('[data-result]'),output=document.querySelector('#contact-summary'),copy=document.querySelector('[data-copy]'),status=document.querySelector('[data-copy-status]');
 prepare.disabled=false;
 function invalidateDraft(){result.hidden=true;status.textContent=''}; ['#contact-name','#contact-company','#contact-topic','#contact-message'].forEach(selector=>{const field=document.querySelector(selector);field.addEventListener('input',invalidateDraft);field.addEventListener('change',invalidateDraft)}); message.addEventListener('input',()=>{message.removeAttribute('aria-invalid');error.textContent=''});
 prepare.addEventListener('click',()=>{
  const text=message.value.trim();
  if(!text){error.textContent='Beschrijf kort welk werk je wilt verbeteren.';message.setAttribute('aria-invalid','true');message.focus();return}
  const name=document.querySelector('#contact-name').value.trim(),company=document.querySelector('#contact-company').value.trim(),topic=document.querySelector('#contact-topic').value;
  output.value=['Gespreksnotitie ORYONX',...(name?['Naam: '+name]:[]),...(company?['Organisatie: '+company]:[]),'Onderwerp: '+topic,'','Mijn werkvraag:',text].join('\n');
  status.textContent='';result.hidden=false;result.focus();
 });
 document.querySelector('[data-edit]').addEventListener('click',()=>{result.hidden=true;message.focus()});
 copy.addEventListener('click',async()=>{
  try{if(!navigator.clipboard?.writeText)throw new Error('unavailable');await navigator.clipboard.writeText(output.value);status.textContent='Gekopieerd. Je kunt de notitie nu ergens anders plakken.'}
  catch{output.focus();output.select();status.textContent='Automatisch kopiëren lukt hier niet. De tekst is geselecteerd; kopieer deze met Ctrl+C of via het selectiemenu.'}
 });
}
// Native page navigation keeps history, modifier-clicks and anchors intact.
if(!('onpagereveal' in window)||location.protocol==='file:')root.classList.add('fade-fallback');
})();

// Accessible native subnavigation: one group open, Escape closes to trigger.
(()=>{const groups=[...document.querySelectorAll('.nav-dropdown')];groups.forEach(d=>d.addEventListener('toggle',()=>{if(d.open)groups.forEach(other=>{if(other!==d)other.open=false})}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=groups.find(d=>d.open);if(open){open.open=false;open.querySelector('summary').focus()}}});document.addEventListener('click',e=>{groups.forEach(d=>{if(!d.parentElement.contains(e.target))d.open=false})});})();
(()=>{const fine=matchMedia('(hover: hover) and (pointer: fine)');document.querySelectorAll('.nav-group').forEach(group=>{const dropdown=group.querySelector('.nav-dropdown');if(!dropdown)return;let timer;group.addEventListener('mouseenter',()=>{if(!fine.matches)return;clearTimeout(timer);document.querySelectorAll('.nav-dropdown').forEach(d=>{if(d!==dropdown)d.open=false});dropdown.open=true});group.addEventListener('mouseleave',()=>{if(!fine.matches)return;timer=setTimeout(()=>{if(!group.contains(document.activeElement))dropdown.open=false},180)});group.addEventListener('focusout',()=>{setTimeout(()=>{if(!group.contains(document.activeElement)&&!group.matches(':hover'))dropdown.open=false},0)})})})();

// Refresh the shared palette on pages published before asset versioning.
(()=>{const link=document.querySelector('link[href*="oryonx-page-palette.css"]');if(!link)return;const url=new URL(link.href,location.href);if(url.searchParams.get("rev")!=="20260907-muted-contact"){url.searchParams.set("rev","20260907-muted-contact");link.href=url.href;}})();

// Keep the shared footer wording consistent on earlier published pages.
(()=>{const label=document.querySelector(".footer-bottom>span");if(label)label.textContent=label.textContent.replace(", Nederland", "");})();

// Use the office number consistently on older published pages.
(()=>{document.querySelectorAll('a[href="tel:+31642296650"]').forEach(a=>a.setAttribute("href","tel:+31206366921"));const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(!["SCRIPT","STYLE"].includes(node.parentElement?.tagName)&&node.nodeValue.includes("+31 6 4229 6650"))node.nodeValue=node.nodeValue.replaceAll("+31 6 4229 6650","020 636 6921");}})();

(()=>{const link=document.querySelector('link[href*="oryonx-site.css"]');if(!link)return;const url=new URL(link.href,location.href);if(url.searchParams.get("rev")!=="20260907-mobile"){url.searchParams.set("rev","20260907-mobile");link.href=url.href;}})();
