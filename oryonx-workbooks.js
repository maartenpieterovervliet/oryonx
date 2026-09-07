(()=>{
'use strict';
const fields=[...document.querySelectorAll('[data-workbook]')];
const money=n=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
fields.forEach(w=>{
 const status=w.querySelector('[data-status]');
 const calculate=()=>{if(w.dataset.workbook!=='kosten')return;const n=id=>Math.max(0,Math.min(1e7,Number(w.querySelector('#'+id).value)||0));
 const hours=n('volume')*(n('before')-n('after'))/60;
 const once=n('setup')*n('rate')+n('external'),monthly=n('licenses')+n('maintenance')*n('rate'),net=hours*n('rate')-monthly;
 Object.entries({once:money(once),monthly:money(monthly),hours:new Intl.NumberFormat('nl-NL',{maximumFractionDigits:1}).format(hours)+' uur',net:money(net)}).forEach(([key,val])=>w.querySelector('[data-total="'+key+'"]').textContent=val);
 };w.addEventListener('input',calculate);calculate();
 const text=()=>[document.querySelector('h1').textContent.trim(),'ORYONX werkblad','',...[...w.querySelectorAll('input,textarea')].map(f=>w.querySelector('label[for="'+f.id+'"]').textContent+'\n'+(f.value||'Nog in te vullen')), ...(w.querySelector('.workbook-result')?['',w.querySelector('.workbook-result').innerText]:[])].join('\n\n');
 w.querySelector('[data-download]').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([text()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='oryonx-'+w.dataset.workbook+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Je werkblad is als tekstbestand aangeboden om te bewaren.'});
 w.querySelector('[data-print]').addEventListener('click',()=>{w.querySelectorAll('textarea').forEach(t=>{t.style.height='auto';t.style.height=t.scrollHeight+'px'});window.print()});
});
const header=document.querySelector('.site-header'),nav=header?.querySelector('.nav');
if(!nav||!('HTMLDialogElement' in window))return;
const open=document.createElement('button');open.type='button';open.className='mobile-menu-button';open.textContent='Menu';open.setAttribute('aria-haspopup','dialog');open.setAttribute('aria-expanded','false');open.setAttribute('aria-controls','mobile-navigation');header.append(open);
const dialog=document.createElement('dialog');dialog.id='mobile-navigation';dialog.className='mobile-drawer';dialog.setAttribute('aria-label','Hoofdnavigatie');
const top=document.createElement('div');top.className='drawer-head';const brand=document.createElement('a');brand.className='brand';brand.href='./';brand.textContent='ORYONX';brand.setAttribute('aria-label','ORYONX — naar de homepage');const close=document.createElement('button');close.type='button';close.className='drawer-close';close.textContent='Sluiten ×';top.append(brand,close);
const location=document.createElement('p');location.className='drawer-location';location.textContent='Je bent op '+(document.querySelector('.breadcrumb [aria-current=page]')?.textContent||'Home');
const body=document.createElement('nav');body.className='drawer-body';body.setAttribute('aria-label','Pagina’s');
nav.querySelectorAll('.nav-group').forEach(group=>{const primary=group.querySelector('.nav-primary');if(primary.classList.contains('nav-contact'))return;const details=document.createElement('details');details.className='drawer-group';const summary=document.createElement('summary');summary.textContent=primary.textContent;const links=document.createElement('div');links.className='drawer-links';const overview=primary.cloneNode(true);overview.className='';overview.textContent='Overzicht '+primary.textContent.toLowerCase();overview.removeAttribute('aria-current');links.append(overview);
group.querySelectorAll('.nav-panel>a').forEach(a=>{const link=a.cloneNode(true);link.removeAttribute('class');links.append(link)});
links.querySelectorAll('a').forEach(a=>{const target=new URL(a.href);if(target.pathname===window.location.pathname&&!target.hash)a.setAttribute('aria-current','page')});details.append(summary,links);details.addEventListener('toggle',()=>{if(details.open)body.querySelectorAll('details').forEach(d=>{if(d!==details)d.open=false})});body.append(details)});
const bottom=document.createElement('div');bottom.className='drawer-bottom';bottom.innerHTML='<a class="drawer-contact" href="oryonx-kennismaken.html">Contact opnemen</a><a href="tel:+31206366921">020 636 6921</a>';
dialog.append(top,location,body,bottom);document.body.append(dialog);document.documentElement.classList.add("has-mobile-drawer");
const shut=()=>dialog.close();open.addEventListener('click',()=>{dialog.showModal();document.body.classList.add('menu-open');open.setAttribute('aria-expanded','true');close.focus()});close.addEventListener('click',shut);dialog.addEventListener('close',()=>{document.body.classList.remove('menu-open');open.setAttribute('aria-expanded','false');open.focus()});dialog.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));matchMedia('(min-width:1051px)').addEventListener('change',e=>{if(e.matches&&dialog.open)shut()});
})();
(()=>{
const context={
overdracht:['Processen en samenwerking','Je overdracht verbeteren'],
sales:['Processen en samenwerking','Je verkoopproces verbeteren'],
systemen:['Data en kennis verbinden','Je kennisomgeving verbinden'],
modellen:['AI toepassen','Je AI-landschap bespreken'],
kosten:['AI toepassen','Je kostenafweging bespreken'],
proef:['AI toepassen','Een eerste proef afbakenen'],
content:['Marketing uitvoeren','Je contentproces verbeteren']
};
const key=new URLSearchParams(location.search).get('vraag'),match=context[key],select=document.querySelector('#contact-topic');
if(match&&select){select.value=match[0];const heading=document.querySelector('[data-contact-form] h2');if(heading)heading.textContent=match[1]+'.';}
})();
