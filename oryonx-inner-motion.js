(()=>{'use strict';let canvas=document.querySelector('[data-organism-canvas]');if(!canvas){const art=document.querySelector('.immersive-hero .immersive-art');if(!art)return;canvas=document.createElement('canvas');canvas.setAttribute('data-organism-canvas','');art.appendChild(canvas);}const ctx=canvas.getContext('2d');if(!ctx)return;const host=canvas.closest('.immersive-hero'),pause=host.querySelector('[data-organism-pause]'),rm=matchMedia('(prefers-reduced-motion: reduce)');const variant=JSON.parse(host.dataset.variant);let width=1,height=1,dpr=1,time=variant.seed,frame=0,last=0,visible=false,playing=true;
function configuration(t){
return {
stretch:1+.34*Math.sin(t*.193)+.12*Math.sin(t*.419),
open:.5+.5*Math.sin(t*.237+.8*Math.sin(t*.071)),
bend:Math.sin(t*.173+1.1*Math.sin(t*.113)),
twist:Math.sin(t*.281+.6*Math.sin(t*.097)),
depth:380+170*Math.sin(t*.157)+65*Math.sin(t*.359),
roll:.45*Math.sin(t*.131)+.18*Math.sin(t*.307),
yaw:.52*Math.sin(t*.149)+.2*Math.sin(t*.337),
pitch:.34*Math.sin(t*.181)+.13*Math.cos(t*.401),
distance:720+230*Math.sin(t*.211)+110*Math.cos(t*.089),
driftX:Math.sin(t*.101),driftY:Math.cos(t*.127)
}}
function point(u,a,t,c){
const b=Math.sin(u*Math.PI),wave=Math.sin(u*6.283+c.bend);
const cx=30*Math.sin(u*6.283)+c.bend*105*(u-.5);
const cy=110*(u-.5)+40*c.twist*wave;
const rx=(235-105*b)*c.stretch*(1+.14*Math.sin(u*3.14+t*.167));
const ry=38+155*b*(.55+c.open*.8);
const angle=(38*(1-u*.3))*Math.PI/180+c.twist*(u-.5)*1.1+c.roll;
const lobe=1+.09*Math.sin(a*3+t*.137+u*2);
const ex=rx*Math.cos(a)*lobe,ey=ry*Math.sin(a);
return [cx+ex*Math.cos(angle)-ey*Math.sin(angle),cy+ex*Math.sin(angle)+ey*Math.cos(angle),(u-.5)*c.depth+80*c.bend*Math.sin(a*2+u*2)+35*Math.sin(a+t*.227+u*4)];
}

function draw(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);const c=configuration(time);c.yaw+=variant.yaw;c.pitch+=variant.pitch;c.stretch*=variant.stretch;c.depth*=variant.depth;c.twist+=variant.twist;c.roll+=variant.roll;const scale=Math.min(width/650,height/510)*variant.scale;ctx.strokeStyle=getComputedStyle(host).color;ctx.lineWidth=.85;const N=width<500?36:52;for(let i=0;i<N;i++){ctx.beginPath();for(let j=0;j<=100;j++){const [x,y,z]=point(i/(N-1),j/100*Math.PI*2,time,c);const xx=x*Math.cos(c.yaw)+z*Math.sin(c.yaw),zz=-x*Math.sin(c.yaw)+z*Math.cos(c.yaw);const yy=y*Math.cos(c.pitch)-zz*Math.sin(c.pitch);const perspective=900/(900+zz*.35);const px=width*variant.x+xx*scale*perspective,py=height*variant.y+yy*scale*perspective;if(j)ctx.lineTo(px,py);else ctx.moveTo(px,py)}ctx.globalAlpha=.32+.36*Math.sin(i/(N-1)*Math.PI);ctx.stroke()}ctx.globalAlpha=1;}function stop(){cancelAnimationFrame(frame);frame=0;last=0}function tick(now){frame=0;if(!visible||!playing||rm.matches||document.hidden)return;if(!last||now-last>40){time+=(last?Math.min(now-last,100):0)/1000*.35;last=now;draw()}frame=requestAnimationFrame(tick)}function start(){if(visible&&playing&&!rm.matches&&!document.hidden&&!frame)frame=requestAnimationFrame(tick)}function sync(){if(!pause)return;pause.disabled=rm.matches;pause.textContent=rm.matches?'Beweging uit':' '+(playing?'Pauzeer beweging':'Hervat beweging');pause.setAttribute('aria-pressed',String(!playing));}function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw()}pause?.addEventListener('click',()=>{playing=!playing;stop();sync();start()});rm.addEventListener('change',()=>{stop();sync();draw();start()});document.addEventListener('visibilitychange',()=>{stop();start()});document.addEventListener('oryonx:theme',draw);addEventListener('resize',resize);addEventListener('pagehide',stop);addEventListener('pageshow',start);if('IntersectionObserver'in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;stop();start()}).observe(host);else visible=true;resize();host.classList.add('organism-ready');sync();start();})();
