let inView=false;

const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d'),rm=matchMedia('(prefers-reduced-motion: reduce)'),pause=document.querySelector('[data-pause]');
let width=1,height=1,dpr=1,clock=0,last=0,frame=0,playing=!rm.matches,speed=1,intensity=1;

const cameraPoints=[
{yaw:-.3,pitch:.1,travel:1350,x:0,y:0},
{yaw:0,pitch:.15,travel:1050,x:.01,y:0},
{yaw:.9,pitch:-.18,travel:320,x:-.04,y:.03},
{yaw:2.1,pitch:.3,travel:-180,x:.05,y:-.03}
];
let cameraSegment=0;
const cameraDuration=8;
function randomBetween(a,b){return a+(b-a)*Math.random()}
function newCameraPoint(previous){
return {yaw:previous.yaw+randomBetween(-1.8,2.6),
pitch:randomBetween(-.7,.7),
travel:randomBetween(-600,1550),
x:randomBetween(-.085,.085),y:randomBetween(-.06,.06)};
}
function cameraAt(t){
const segment=Math.floor(t/cameraDuration);
while(cameraSegment<segment){cameraPoints.shift();cameraPoints.push(newCameraPoint(cameraPoints[2]));cameraSegment++}
const u=t/cameraDuration-segment,u2=u*u,u3=u2*u;
const weights=[(1-3*u+3*u2-u3)/6,(4-6*u2+3*u3)/6,(1+3*u+3*u2-3*u3)/6,u3/6];
const v={};for(const key of ['yaw','pitch','travel','x','y'])v[key]=cameraPoints.reduce((sum,p,i)=>sum+p[key]*weights[i],0);
return {yaw:v.yaw+Math.atan2(85,v.travel),pitch:v.pitch,distance:Math.hypot(v.travel,85),driftX:v.x,driftY:v.y};
}

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
function project(x,y,z,c){
const xx=x*Math.cos(c.yaw)+z*Math.sin(c.yaw),zz=-x*Math.sin(c.yaw)+z*Math.cos(c.yaw);
const yy=y*Math.cos(c.pitch)-zz*Math.sin(c.pitch),depth=y*Math.sin(c.pitch)+zz*Math.cos(c.pitch)+c.distance;
if(depth<40)return null;const focal=Math.min(width,height)*(1.35+intensity*.45);
return [width*(.5+c.driftX)+xx*focal/depth,height*(.5+c.driftY)+yy*focal/depth,depth];
}
function draw(){
if(!ctx)return;
ctx.setTransform(dpr,0,0,dpr,0,0);const sceneStyle=getComputedStyle(document.documentElement);ctx.fillStyle=sceneStyle.getPropertyValue('--scene').trim();ctx.fillRect(0,0,width,height);
const c={...configuration(clock),...cameraAt(clock)},N=width<700?34:48,P=width<700?80:120;
for(let i=0;i<N;i++){const u=i/(N-1);let connected=false,sum=0,count=0;ctx.beginPath();
for(let j=0;j<=P;j++){const v=project(...point(u,j/P*Math.PI*2,clock,c),c);if(!v||Math.abs(v[0])>width*20||Math.abs(v[1])>height*20){connected=false;continue}
if(connected)ctx.lineTo(v[0],v[1]);else ctx.moveTo(v[0],v[1]);connected=true;sum+=v[2];count++;}
if(count){const depth=sum/count,alpha=Math.max(.2,Math.min(.9,1.1-depth/2300));ctx.globalAlpha=alpha;ctx.strokeStyle=sceneStyle.getPropertyValue('--scene-text').trim();ctx.lineWidth=width<700?.8:1;ctx.stroke();ctx.globalAlpha=1}
}}
function stop(){cancelAnimationFrame(frame);frame=0;last=0}
function sync(){if(!pause)return;pause.textContent=rm.matches?'Beweging uit · systeemvoorkeur':playing?'Pauzeer':'Verder evolueren';pause.disabled=rm.matches||!ctx;pause.setAttribute('aria-pressed',String(playing&&!rm.matches))}
function tick(now){frame=0;if(!playing||document.hidden||rm.matches||!inView)return;
if(!last||now-last>=32){clock+=(last?Math.min(now-last,90):0)/1000*speed;last=now;draw()}frame=requestAnimationFrame(tick)}
function start(){if(ctx&&playing&&!document.hidden&&!rm.matches&&!frame&&inView)frame=requestAnimationFrame(tick)}
function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);draw()}
pause?.addEventListener('click',()=>{playing=!playing;sync();if(playing)start();else stop()});
document.querySelector('[data-speed]')?.addEventListener('input',e=>{speed=+e.target.value;document.querySelector('[data-speed-out]').value=speed.toFixed(1)+'×'});
document.querySelector('[data-intensity]')?.addEventListener('input',e=>{intensity=+e.target.value;draw()});
document.querySelector('[data-fullscreen]')?.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{document.querySelector('[data-status]').textContent='Volledig scherm is niet beschikbaar in deze viewer.'}});
rm.addEventListener('change',()=>{stop();sync();draw();start()});document.addEventListener('visibilitychange',()=>{stop();start()});addEventListener('resize',resize);
if(ctx){resize();document.body.classList.add('ready');sync()}




if('IntersectionObserver' in window){new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)start();else stop()},{threshold:.05}).observe(canvas)}else{inView=true;start()}



document.addEventListener('oryonx:theme',draw);
addEventListener('pagehide',stop);
addEventListener('pageshow',()=>{resize();start()});
