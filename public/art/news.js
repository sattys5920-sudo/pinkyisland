// 다크 모드 TV 뉴스 장면 (사람 없이, 사진처럼 흐림 · 빛 번짐 · 노이즈) · 960×540 캔버스에 그려요

let seed=7; const R=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
function grain(x,w,h,a=.10){const im=x.getImageData(0,0,w,h),d=im.data;for(let i=0;i<d.length;i+=4){const n=(R()-.5)*255*a;d[i]+=n;d[i+1]+=n;d[i+2]+=n;}x.putImageData(im,0,0);}
function vign(x,w,h,s=.75){const g=x.createRadialGradient(w/2,h/2,h*.2,w/2,h/2,w*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${s})`);x.fillStyle=g;x.fillRect(0,0,w,h);}
function bokeh(x,cx,cy,r,col,a){const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col.replace('A',a));g.addColorStop(.7,col.replace('A',a*.6));g.addColorStop(1,col.replace('A',0));x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,7);x.fill();}
// A: 밤 아파트 단지 + 경찰차 불빛 (흐림)
function sceneA(x){const W=960,H=540;seed=7;
 let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05070d');g.addColorStop(.6,'#0b1020');g.addColorStop(1,'#141018');x.fillStyle=g;x.fillRect(0,0,W,H);
 x.filter='blur(2px)';
 for(const [bx,bw,bh] of [[60,220,420],[330,260,470],[640,240,400]]){x.fillStyle='#0d1018';x.fillRect(bx,H-bh,bw,bh);for(let fy=H-bh+20;fy<H-40;fy+=26)for(let fx=bx+14;fx<bx+bw-20;fx+=30){const on=R()<.32;x.fillStyle=on?(R()<.7?'rgba(255,210,150,.85)':'rgba(170,200,255,.7)'):'rgba(30,34,46,.9)';x.fillRect(fx,fy,18,12);}}
 x.filter='blur(14px)';for(let i=0;i<8;i++)bokeh(x,120+i*110+R()*40,470+R()*30,40+R()*30,i%2?'rgba(255,40,40,A)':'rgba(40,90,255,A)',.55);
 x.filter='blur(30px)';bokeh(x,300,500,240,'rgba(255,30,40,A)',.35);bokeh(x,700,500,260,'rgba(30,70,255,A)',.35);
 x.filter='none';x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,0,W,H);vign(x,W,H,.8);grain(x,W,H,.12);}
// B: 어두운 방 · 책상 위 켜진 휴대 전화 (얕은 심도)
function sceneB(x){const W=960,H=540;seed=11;
 x.fillStyle='#07070a';x.fillRect(0,0,W,H);
 x.filter='blur(10px)';x.fillStyle='#14161e';x.fillRect(80,30,240,130);x.fillStyle='#1d2432';x.fillRect(96,42,208,106);x.fillStyle='rgba(40,60,90,.5)';x.fillRect(96,42,208,34);
 x.fillStyle='#101014';x.fillRect(640,60,180,260);x.fillStyle='#16161c';x.fillRect(600,300,260,40);
 x.filter='blur(3px)';let g=x.createLinearGradient(0,220,0,H);g.addColorStop(0,'#2a2018');g.addColorStop(1,'#120d0a');x.fillStyle=g;x.beginPath();x.moveTo(0,232);x.lineTo(W,214);x.lineTo(W,H);x.lineTo(0,H);x.fill();
 x.filter='blur(50px)';bokeh(x,480,290,260,'rgba(255,140,200,A)',.5);
 x.filter='blur(1px)';x.save();x.translate(480,295);x.transform(1,0,-.35,.42,0,0);x.fillStyle='#0b0b0d';x.beginPath();x.roundRect(-70,-130,140,260,18);x.fill();
 g=x.createLinearGradient(0,-120,0,120);g.addColorStop(0,'#ffd6e8');g.addColorStop(1,'#f39cc2');x.fillStyle=g;x.beginPath();x.roundRect(-62,-120,124,240,12);x.fill();
 x.fillStyle='rgba(255,255,255,.7)';x.fillRect(-40,-90,80,14);x.fillStyle='rgba(200,120,170,.8)';for(let i=0;i<3;i++)x.fillRect(-46+i*34,60,26,26);x.restore();
 x.filter='blur(4px)';x.fillStyle='#d8d2c8';x.beginPath();x.roundRect(250,250,46,58,6);x.fill();x.fillStyle='rgba(255,255,255,.15)';x.fillRect(258,254,8,48);
 x.filter='blur(2px)';for(let i=0;i<70;i++){x.fillStyle=`rgba(255,220,240,${R()*.35})`;x.beginPath();x.arc(320+R()*320,120+R()*200,R()*2+.5,0,7);x.fill();}
 x.filter='none';vign(x,W,H,.85);grain(x,W,H,.14);}
// C: 아파트 복도 · 폴리스 라인 (원근 + 심도)
function sceneC(x){const W=960,H=540,vx=560,vy=230;seed=13;
 x.fillStyle='#1a1c20';x.fillRect(0,0,W,H);
 const face=(pts,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(...pts[0]);for(const p of pts.slice(1))x.lineTo(...p);x.fill();};
 face([[0,0],[W,0],[vx+60,vy-40],[vx-60,vy-40]],'#2a2c30');face([[0,H],[W,H],[vx+60,vy+60],[vx-60,vy+60]],'#3a3a3c');
 face([[0,0],[vx-60,vy-40],[vx-60,vy+60],[0,H]],'#2e3034');face([[W,0],[vx+60,vy-40],[vx+60,vy+60],[W,H]],'#26282c');
 x.fillStyle='#0c0d10';x.fillRect(vx-60,vy-40,120,100);
 x.filter='blur(6px)';for(let i=0;i<4;i++){const t=i/4,lx=vx+(-60+(0-(-60))*0)*1;x.fillStyle='rgba(255,240,210,.9)';x.fillRect(vx-20+(-380)*(1-t)*0,vy-40-(220)*(1-t)*.9,40*(1-t)+10,6);}
 x.filter='blur(2px)';const door=(t,col)=>{const x1=W-(W-vx-60)*t,top=0+(vy-40)*t,bot=H-(H-vy-60)*t,x2=W-(W-vx-60)*(t+.12),top2=(vy-40)*(t+.12),bot2=H-(H-vy-60)*(t+.12);x.fillStyle=col;x.beginPath();x.moveTo(x1,top+(bot-top)*.18);x.lineTo(x2,top2+(bot2-top2)*.18);x.lineTo(x2,bot2);x.lineTo(x1,bot);x.fill();};
 door(.08,'#5b4632');door(.42,'#4e3c2c');door(.68,'#433426');
 x.filter='blur(30px)';bokeh(x,820,260,180,'rgba(255,240,200,A)',.12);
 x.filter='blur(1.2px)';const tape=(y1,y2,txt)=>{x.save();const ang=Math.atan2(y2-y1,W);x.translate(-20,y1);x.rotate(ang);x.fillStyle='#f2c200';x.fillRect(0,0,W+80,34);x.fillStyle='#111';x.font="900 19px sans-serif";for(let k=0;k<6;k++)x.fillText(txt,20+k*220,24);x.restore();};
 tape(250,330,'POLICE LINE  출입 금지');tape(340,300,'출입 금지  POLICE LINE');
 x.filter='none';vign(x,W,H,.8);grain(x,W,H,.13);}

export const NEWS_SCENES = [sceneA, sceneB, sceneC];
