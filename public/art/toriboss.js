// 토리??? (다크 모드 첫 방 보스): 꿰맨 다람쥐 인형. 앞모습 · 뒤도는 모습 · 등이 갈라져 손이 나오는 뒷모습
// 시안(boss_anim)의 그림 코드를 그대로 옮겼어요. 모든 함수는 첫 인자로 받은 캔버스(ctx)에 그려요
let g = null, sd = 5;
const R = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
const fur='#c8844a', furD='#8a5530', furL='#e8b080', belly='#f1d6b4';
function shade(x,y,r,col,dark){const q=g.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r*1.1);q.addColorStop(0,col);q.addColorStop(1,dark);return q;}
function blob(x,y,rx,ry,col,dark,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.fillStyle=shade(0,0,Math.max(rx,ry),col,dark);g.beginPath();g.ellipse(0,0,rx,ry,0,0,7);g.fill();g.restore();}
function stitch(pts,w=2.4){g.save();g.strokeStyle='#1a0c10';g.lineWidth=w;g.lineCap='round';g.setLineDash([]);g.beginPath();g.moveTo(...pts[0]);for(const p of pts.slice(1))g.lineTo(...p);g.globalAlpha=.55;g.stroke();g.globalAlpha=1;
  for(let i=0;i<pts.length-1;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1],L=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.floor(L/12)),a=Math.atan2(y2-y1,x2-x1)+Math.PI/2;for(let k=0;k<n;k++){const t=(k+.5)/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;g.beginPath();g.moveTo(x-Math.cos(a)*7,y-Math.sin(a)*7);g.lineTo(x+Math.cos(a)*7,y+Math.sin(a)*7);g.stroke();}}g.restore();}
function letter(x,y,a,s=1){g.save();g.translate(x,y);g.rotate(a);g.scale(s,s);g.fillStyle='#e6dcc8';g.fillRect(-16,-11,32,22);g.strokeStyle='rgba(60,40,30,.6)';g.lineWidth=1;g.beginPath();g.moveTo(-16,-11);g.lineTo(0,1);g.lineTo(16,-11);g.stroke();g.fillStyle='#8a2a3a';g.beginPath();g.arc(0,1,3,0,7);g.fill();g.restore();}

// 다람쥐 부품: 뾰족한 귀(끝에 털), 크게 말린 꼬리, 줄무늬
function sqEar(x,y,rot,torn){g.save();g.translate(x,y);g.rotate(rot);g.fillStyle=shade(0,-20,40,fur,furD);g.beginPath();g.moveTo(-18,10);g.quadraticCurveTo(-14,-30,0,-52);g.quadraticCurveTo(14,-30,18,10);g.closePath();g.fill();
  g.fillStyle='#f0b0a0';g.beginPath();g.moveTo(-9,4);g.quadraticCurveTo(-7,-22,0,-38);g.quadraticCurveTo(7,-22,9,4);g.closePath();g.fill();
  g.strokeStyle=furD;g.lineWidth=2;for(let i=0;i<6;i++){g.beginPath();g.moveTo(0,-50);g.lineTo(-6+i*2.4,-64-(i%2)*5);g.stroke();} if(torn) stitch([[-14,-6],[14,-30]],1.8); g.restore();}
function sqTail(x,y,s2,flip){g.save();g.translate(x,y);g.scale(flip?-s2:s2,s2);const q=g.createLinearGradient(0,-260,0,40);q.addColorStop(0,furL);q.addColorStop(.5,fur);q.addColorStop(1,furD);g.fillStyle=q;
  g.beginPath();g.moveTo(-10,40);g.bezierCurveTo(90,20,140,-80,110,-170);g.bezierCurveTo(90,-240,10,-270,-30,-220);g.bezierCurveTo(-60,-180,-20,-140,20,-160);g.bezierCurveTo(60,-180,60,-110,30,-60);g.bezierCurveTo(10,-20,-30,0,-40,20);g.closePath();g.fill();
  g.strokeStyle='rgba(90,50,24,.45)';g.lineWidth=2;for(let i=0;i<26;i++){const t=i/25;g.beginPath();g.moveTo(40+Math.sin(t*5)*40,-t*220+20);g.lineTo(60+Math.sin(t*5)*50,-t*220+8);g.stroke();}
  stitch([[0,30],[80,-20],[110,-120],[70,-220],[0,-230]]);g.restore();}
function sqStripes(cx,y0,h){g.save();g.strokeStyle='rgba(70,36,16,.6)';g.lineWidth=7;g.lineCap='round';for(const dx of [-14,0,14]){g.beginPath();g.moveTo(cx+dx,y0);g.quadraticCurveTo(cx+dx*1.4,y0+h/2,cx+dx,y0+h);g.stroke();}g.strokeStyle='rgba(250,230,200,.55)';g.lineWidth=3;for(const dx of [-7,7]){g.beginPath();g.moveTo(cx+dx,y0+4);g.quadraticCurveTo(cx+dx*1.4,y0+h/2,cx+dx,y0+h-4);g.stroke();}g.restore();}
function humanHand(x,y,s,rot){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);const sk=g.createLinearGradient(-20,0,20,0);sk.addColorStop(0,'#b8a8a0');sk.addColorStop(.5,'#ddd0c6');sk.addColorStop(1,'#a89890');g.fillStyle=sk;
  g.beginPath();g.ellipse(0,10,16,20,0,0,7);g.fill();[[-12,-14,4.2,22,-.15],[-4,-20,4.4,26,-.05],[5,-19,4.3,25,.05],[13,-12,3.8,20,.18]].forEach(([fx,fy,w2,h2,r2])=>{g.save();g.translate(fx,fy);g.rotate(r2);g.beginPath();g.roundRect(-w2,-h2/2,w2*2,h2,w2);g.fill();g.fillStyle='rgba(120,90,90,.5)';g.fillRect(-w2*.7,-h2/2+2,w2*1.4,3);g.restore();g.fillStyle=sk;});
  g.beginPath();g.ellipse(18,8,4,11,.9,0,7);g.fill();g.strokeStyle='rgba(90,70,70,.35)';g.lineWidth=1;g.beginPath();g.moveTo(-8,14);g.quadraticCurveTo(0,20,8,12);g.stroke();g.restore();}
function humanEye(x,y,r){g.save();g.fillStyle='#120608';g.beginPath();g.ellipse(x,y,r*1.25,r*.95,0,0,7);g.fill();const w=g.createRadialGradient(x,y,1,x,y,r);w.addColorStop(0,'#f4ece4');w.addColorStop(1,'#c8b4ac');g.fillStyle=w;g.beginPath();g.ellipse(x,y,r,r*.7,0,0,7);g.fill();
  g.strokeStyle='rgba(170,40,50,.55)';g.lineWidth=.8;for(let i=0;i<6;i++){const a=R()*7;g.beginPath();g.moveTo(x+Math.cos(a)*r*.95,y+Math.sin(a)*r*.65);g.quadraticCurveTo(x+Math.cos(a+.3)*r*.7,y+Math.sin(a+.3)*r*.5,x+Math.cos(a)*r*.5,y+Math.sin(a)*r*.35);g.stroke();}
  const ir=g.createRadialGradient(x-r*.1,y,1,x-r*.1,y,r*.42);ir.addColorStop(0,'#1a1410');ir.addColorStop(.5,'#5a4430');ir.addColorStop(1,'#2a1e14');g.fillStyle=ir;g.beginPath();g.arc(x-r*.1,y,r*.42,0,7);g.fill();g.fillStyle='#050302';g.beginPath();g.arc(x-r*.1,y,r*.18,0,7);g.fill();g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(x-r*.24,y-r*.14,r*.08,0,7);g.fill();
  g.strokeStyle='#120608';g.lineWidth=2;g.beginPath();g.ellipse(x,y,r*1.08,r*.8,0,Math.PI*1.05,Math.PI*1.95);g.stroke();g.restore();}
function shadowFloor(x,y,rx){const q=g.createRadialGradient(x,y,rx*.1,x,y,rx);q.addColorStop(0,'rgba(0,0,0,.6)');q.addColorStop(1,'rgba(0,0,0,0)');g.save();g.translate(x,y);g.scale(1,.22);g.translate(-x,-y);g.fillStyle=q;g.beginPath();g.arc(x,y,rx,0,7);g.fill();g.restore();} // 흐림 필터 대신 그라데이션 (가벼워요)
// ---------- 앞모습 ----------
function front(cx,cy,s){g.save();g.translate(cx,cy);g.scale(s,s);
  shadowFloor(0,190,170);
  // 꼬리 (뒤)
  sqTail(70,150,1,false);
  // 몸통
  blob(0,70,96,124,fur,furD);blob(0,90,62,92,belly,'#c8a888');stitch([[-60,-10],[-70,90],[-40,170]]);stitch([[0,-30],[0,180]],2);
  // 배에서 편지가 삐져나와요
  for(let i=0;i<5;i++)letter(-20+i*12,130+(i%2)*6,(R()-.5)*1.2,.9);
  g.fillStyle='#120608';g.beginPath();g.ellipse(-4,128,22,10,0,0,7);g.fill();
  // 팔 (한쪽은 축 늘어지고, 한쪽은 우편가방)
  blob(-115,60,30,70,fur,furD,.25);blob(-128,128,24,20,furL,furD);stitch([[-100,0],[-112,40]]);
  blob(115,50,30,66,fur,furD,-.4);g.save();g.translate(140,120);g.rotate(.2);g.fillStyle=shade(0,0,50,'#7a5a3a','#3a2a1a');g.beginPath();g.roundRect(-40,-30,80,60,10);g.fill();g.strokeStyle='#2a1a10';g.lineWidth=3;g.beginPath();g.moveTo(-40,-10);g.lineTo(40,-10);g.stroke();g.restore();for(let i=0;i<3;i++)letter(130+i*14,92-i*4,(R()-.5)*.8,.8);
  // 다리
  blob(-55,190,40,26,furL,furD);blob(55,190,40,26,furL,furD);
  // 머리
  blob(0,-110,92,84,fur,furD);sqStripes(0,-190,60);
  // 귀 (한쪽은 찢어져 꿰맴)
  sqEar(-54,-176,-.3,false);sqEar(56,-176,.3,true);
  // 볼·주둥이
  blob(-46,-82,30,24,belly,'#c8a888');blob(46,-82,30,24,belly,'#c8a888');blob(0,-80,34,28,belly,'#c8a888');g.fillStyle='#f4ecd8';g.fillRect(-7,-66,6,10);g.fillRect(1,-66,6,10);g.strokeStyle='#5a3a2a';g.lineWidth=1;g.strokeRect(-7,-66,6,10);g.strokeRect(1,-66,6,10);g.fillStyle='#3a1a1a';g.beginPath();g.ellipse(0,-96,9,6,0,0,7);g.fill();
  // 꿰맨 입 (웃는 모양)
  g.strokeStyle='#1a0c10';g.lineWidth=2.5;g.beginPath();g.moveTo(-26,-72);g.quadraticCurveTo(0,-56,26,-72);g.stroke();for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*8,-70+Math.abs(i)*1.2-6);g.lineTo(i*8,-70+Math.abs(i)*1.2+6);g.stroke();}
  // 왼쪽: 단추 눈 (실에 대롱)
  g.strokeStyle='#1a0c10';g.lineWidth=1.5;g.beginPath();g.moveTo(-38,-122);g.quadraticCurveTo(-46,-96,-42,-74);g.stroke();g.fillStyle=shade(-42,-70,10,'#3a3a44','#0a0a10');g.beginPath();g.arc(-42,-68,10,0,7);g.fill();g.fillStyle='#8a8a9a';for(const [bx,by] of [[-45,-71],[-39,-71],[-45,-65],[-39,-65]]){g.beginPath();g.arc(bx,by,1.4,0,7);g.fill();}
  g.fillStyle='#120608';g.beginPath();g.ellipse(-38,-122,14,11,0,0,7);g.fill();stitch([[-56,-134],[-22,-110]],1.6);
  // 오른쪽: 사람 눈
  stitch([[16,-140],[60,-140]],1.6);humanEye(38,-120,16);stitch([[16,-102],[60,-102]],1.6);
  // 머리 꿰맨 자국
  stitch([[-70,-170],[-20,-190],[30,-185],[80,-160]]);
  g.restore();}
// ---------- 뒷모습: 등이 갈라져 열려 있어요 ----------
// ---------- 뒷모습 (애니메이션): o = 등이 벌어진 정도, snapped = 끊어진 실 수, hx = 손이 나온 정도 ----------
function backA(cx,cy,s,o,snapped,hx,t,pz){g.save();g.translate(cx,cy);g.scale(s,s);
  shadowFloor(0,190,170*(1-(pz?pz.hop:0)/90));
  if(pz){g.translate(0,190-pz.hop);g.rotate(pz.tilt);g.scale(pz.sqx,pz.sqy);g.translate(0,-190);}
  sqTail(-70,160,1.05,true);blob(0,70,96,124,fur,furD);blob(0,-110,92,84,fur,furD);sqEar(-54,-176,-.3,false);sqEar(56,-176,.3,true);sqStripes(-50,-60,180);sqStripes(50,-60,180);
  blob(-55,190,40,26,furL,furD);blob(55,190,40,26,furL,furD);blob(-100,60,26,64,fur,furD,.25);blob(100,60,26,64,fur,furD,-.25);
  const ow=Math.max(.04,o);
  g.save();g.beginPath();g.moveTo(0,-170);g.bezierCurveTo(60*ow,-120,70*ow,40,22*ow,170);g.lineTo(-22*ow,170);g.bezierCurveTo(-70*ow,40,-60*ow,-120,0,-170);g.closePath();
  const inner=g.createLinearGradient(0,-170,0,170);inner.addColorStop(0,'#1a0a10');inner.addColorStop(.5,'#2a1218');inner.addColorStop(1,'#0a0406');g.fillStyle=inner;g.fill();g.clip();
  g.strokeStyle='rgba(30,22,20,.95)';g.lineWidth=1.4;for(let i=0;i<70;i++){const x0=-30+R()*60;g.beginPath();g.moveTo(x0,-150);g.bezierCurveTo(x0+(R()-.5)*30,-80,x0+(R()-.5)*40,-30,x0+(R()-.5)*50,20+R()*40);g.stroke();}
  // 숨 쉬듯 들썩이는 피부
  const br=1+Math.sin(t*5)*.06*o;const skin=g.createRadialGradient(-6,40,4,0,40,70*br);skin.addColorStop(0,'#d8c8bc');skin.addColorStop(1,'rgba(150,120,110,0)');g.fillStyle=skin;g.beginPath();g.ellipse(0,50,40*br,60*br,0,0,7);g.fill();
  for(let i=0;i<7;i++){g.fillStyle='rgba(60,40,40,.35)';g.beginPath();g.ellipse(0,0+i*18,6,4,0,0,7);g.fill();}
  for(let i=0;i<9;i++)letter((R()-.5)*50,120+R()*50,(R()-.5)*1.6,.8);
  g.restore();
  for(let i=0;i<22;i++){const tt=i/21,y=-160+tt*320,ex=Math.sin(tt*Math.PI)*62*ow*(i%2?1:-1);g.fillStyle='rgba(235,228,220,.9)';g.beginPath();g.arc(ex+(R()-.5)*8,y,(5+R()*5)*Math.min(1,o*2+.2),0,7);g.fill();}
  // 가로 실밥: 아직 안 끊어진 건 팽팽하게, 끊어진 건 늘어져 흔들려요
  g.strokeStyle='#1a0c10';g.lineWidth=2;for(let i=0;i<9;i++){const tt=(i+.5)/9,y=-150+tt*300,w=Math.sin(tt*Math.PI)*62*ow;
    if(i>=9-snapped){g.globalAlpha=.75;const sw=Math.sin(t*6+i)*6;g.beginPath();g.moveTo(-w-8,y);g.quadraticCurveTo(-w-14+sw,y+20,-w-10+sw,y+34);g.stroke();g.beginPath();g.moveTo(w+8,y+4);g.quadraticCurveTo(w+14-sw,y+22,w+10-sw,y+36);g.stroke();}
    else{g.globalAlpha=.9;g.beginPath();g.moveTo(-w-8,y);g.lineTo(w+8,y+4);g.stroke();}
    g.globalAlpha=1;}
  // 안에서 밖으로 나오는 팔과 손
  if(hx>0){for(const [fx,fy,fr,fs,ph] of [[-58,-40,-.9,1.15,0],[52,30,.7,1.05,1.3]]){const k=Math.min(1,hx),wig=Math.sin(t*7+ph)*.12*k;
    const sx=-4*(fx<0?1:-1),sy=fy+10,x=sx+(fx-sx)*k,y=sy+(fy-sy)*k;
    g.save();g.strokeStyle='#b8a8a0';g.lineCap='round';g.lineWidth=13;g.beginPath();g.moveTo(sx,sy+20);g.quadraticCurveTo((sx+x)/2,(sy+y)/2+18,x,y+8);g.stroke();g.strokeStyle='rgba(90,60,60,.4)';g.lineWidth=2;g.stroke();g.restore();
    humanHand(x,y,fs*(.5+.5*k),fr*k+wig);}}
  g.strokeStyle='#d8d8e0';g.lineWidth=2;g.beginPath();g.moveTo(70,-150);g.lineTo(100,-190);g.stroke();
  stitch([[-70,-170],[-20,-190],[30,-185],[80,-160]]);
  g.restore();}

// ---------- 뒤뚱뒤뚱 돌기: 부위마다 원통 위 각도를 줘서 입체처럼 돌아요 ----------
// 장식(얼굴·배·등 무늬): 각도 a=th+phi 에서 cos 만큼 눌리고 sin 만큼 옆으로 가요
function dec(Rr,phi,th,x,fn){const a=th+phi,sc=Math.cos(a);if(sc<.04)return;const s0=sd;sd=(Math.abs(Math.round(x*131+phi*977))%9999)+11;g.save();g.translate(Rr*Math.sin(a),0);g.scale(sc,1);g.translate(-x,0);fn();g.restore();sd=s0;}
function limb(Rr,phi,th,x,fn){g.save();g.translate(Rr*Math.sin(th+phi)-x,0);fn();g.restore();}
function turnTori(cx,cy,s,th,thh,lift,hop,tilt,sqx,sqy,lag){
  g.save();g.translate(cx,cy);g.scale(s,s);
  shadowFloor(0,190,170*(1-hop/90));
  g.translate(0,190-hop);g.rotate(tilt);g.scale(sqx,sqy);g.translate(0,-190);
  const tailPhi=Math.PI-.9, tailZ=Math.cos(th+tailPhi), tailSx=Math.cos(Math.min(Math.PI,th*1.5));
  const tail=()=>{g.save();g.translate(90*Math.sin(th+tailPhi),150+10*(1-Math.cos(th))/2);g.rotate(-lag*.8);sqTail(0,0,1+.05*(1-Math.cos(th))/2,false);g.restore();};
  const tailT=()=>{g.save();g.translate(90*Math.sin(th+tailPhi),150+5*(1-Math.cos(th)));g.scale(tailSx,1);g.rotate(-lag*.8);sqTail(0,0,1,false);g.restore();};
  const armL=()=>limb(115,-Math.PI/2,th,-115,()=>{blob(-115,60,30,70,fur,furD,.25+lag);blob(-128,128,24,20,furL,furD);stitch([[-100,0],[-112,40]]);});
  const armR=()=>limb(115,Math.PI/2,th,115,()=>{blob(115,50,30,66,fur,furD,-.4-lag);if(Math.cos(th)<-.45)return;g.save();g.translate(140,120);g.rotate(.2+lag*1.5);g.fillStyle=shade(0,0,50,'#7a5a3a','#3a2a1a');g.beginPath();g.roundRect(-40,-30,80,60,10);g.fill();g.strokeStyle='#2a1a10';g.lineWidth=3;g.beginPath();g.moveTo(-40,-10);g.lineTo(40,-10);g.stroke();g.restore();for(let i=0;i<3;i++)letter(130+i*14,92-i*4,[.3,-.2,.1][i],.8);});
  const legL=()=>limb(55,-Math.PI/2,th,-55,()=>blob(-55,190-lift[0],40,26,furL,furD));
  const legR=()=>limb(55,Math.PI/2,th,55,()=>blob(55,190-lift[1],40,26,furL,furD));
  const zL=Math.cos(th-Math.PI/2), zR=Math.cos(th+Math.PI/2);
  if(tailZ<0) tailT();
  if(zL<-.3){armL();legL();} if(zR<-.3){armR();legR();}
  // 몸통 + 배 장식 + 등 장식
  blob(0,70,96,124,fur,furD);
  dec(90,0,th,0,()=>{blob(0,90,62,92,belly,'#c8a888');stitch([[-60,-10],[-70,90],[-40,170]]);stitch([[0,-30],[0,180]],2);for(let i=0;i<5;i++)letter(-20+i*12,130+(i%2)*6,[.4,-.5,.2,-.3,.5][i],.9);g.fillStyle='#120608';g.beginPath();g.ellipse(-4,128,22,10,0,0,7);g.fill();});
  dec(96,Math.PI,th,0,()=>{sqStripes(-50,-60,180);sqStripes(50,-60,180);g.fillStyle='#1a0a10';g.beginPath();g.ellipse(0,0,4,165,0,0,7);g.fill();g.strokeStyle='#1a0c10';g.lineWidth=2;for(let i=0;i<9;i++){const tt=(i+.5)/9,y=-150+tt*300,w=Math.sin(tt*Math.PI)*4;g.beginPath();g.moveTo(-w-8,y);g.lineTo(w+8,y+4);g.globalAlpha=.9;g.stroke();g.globalAlpha=1;}});
  if(zL>=-.3){armL();legL();} if(zR>=-.3){armR();legR();}
  // 머리 (몸보다 살짝 먼저 돌아요)
  blob(0,-110,92,84,fur,furD);
  dec(60,0,thh,0,()=>sqStripes(0,-190,60));
  dec(88,-46/88,thh,-46,()=>blob(-46,-82,30,24,belly,'#c8a888'));
  dec(88,46/88,thh,46,()=>blob(46,-82,30,24,belly,'#c8a888'));
  dec(88,0,thh,0,()=>{blob(0,-80,34,28,belly,'#c8a888');g.fillStyle='#f4ecd8';g.fillRect(-7,-66,6,10);g.fillRect(1,-66,6,10);g.strokeStyle='#5a3a2a';g.lineWidth=1;g.strokeRect(-7,-66,6,10);g.strokeRect(1,-66,6,10);g.fillStyle='#3a1a1a';g.beginPath();g.ellipse(0,-96,9,6,0,0,7);g.fill();
    g.strokeStyle='#1a0c10';g.lineWidth=2.5;g.beginPath();g.moveTo(-26,-72);g.quadraticCurveTo(0,-56,26,-72);g.stroke();for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*8,-70+Math.abs(i)*1.2-6);g.lineTo(i*8,-70+Math.abs(i)*1.2+6);g.stroke();}});
  dec(88,-40/88,thh,-40,()=>{g.strokeStyle='#1a0c10';g.lineWidth=1.5;g.beginPath();g.moveTo(-38,-122);g.quadraticCurveTo(-46+lag*30,-96,-42+lag*40,-74);g.stroke();g.fillStyle=shade(-42,-70,10,'#3a3a44','#0a0a10');g.beginPath();g.arc(-42+lag*40,-68,10,0,7);g.fill();
    g.fillStyle='#120608';g.beginPath();g.ellipse(-38,-122,14,11,0,0,7);g.fill();stitch([[-56,-134],[-22,-110]],1.6);});
  dec(88,38/88,thh,38,()=>{stitch([[16,-140],[60,-140]],1.6);humanEye(38,-120,16);stitch([[16,-102],[60,-102]],1.6);});
  // 귀: 각도 따라 얇아지고, 흔들림에 늦게 따라와요
  for(const [ph,rot,torn] of [[-.62,-.3,false],[.62,.3,true]]){const a=thh+ph;g.save();g.translate(92*Math.sin(a),-176);g.scale(Math.max(.35,Math.abs(Math.cos(a))),1);sqEar(0,0,rot-lag*1.8,torn);g.restore();}
  stitch([[-70,-170],[-20,-190],[30,-185],[80,-160]]);
  if(tailZ>=0) tailT();
  g.restore();}
// 1.8초 동안: 움츠림 → 세 번 뒤뚱 → 출렁 멈춤
function turnPose(T){const P=Math.PI;let th=0,hop=0,tilt=0,sqx=1,sqy=1,lift=[0,0];
  if(T<.3){const u=T/.3;sqy=1-.1*Math.sin(u*P/2);sqx=1+.08*Math.sin(u*P/2);}
  else if(T<1.65){const k=Math.min(2,Math.floor((T-.3)/.45)),u=(T-.3-k*.45)/.45;th=(k+ease(u))*P/3;hop=Math.sin(u*P)*26;tilt=(k%2?1:-1)*.14*Math.sin(u*P);
    const land=u<.15?1-u/.15:u>.85?(u-.85)/.15:0;sqy=1+.07*Math.sin(u*P)-.1*land;sqx=1-.05*Math.sin(u*P)+.08*land;lift[k%2]=Math.sin(u*P)*22;}
  else{const u=(T-1.65)/.15;th=P+Math.sin(u*P*2)*.06*(1-u);sqy=1-.06*Math.sin(u*P);sqx=1+.05*Math.sin(u*P);}
  return {th,hop,tilt,sqx,sqy,lift};}

const ease=x=>x<0?0:x>1?1:x*x*(3-2*x), cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function glitchName(x,y,frame,heavy){ const Z=['̷','̸','̶','̴','̵','͓','͙','̖','̗']; const zal=t=>[...t].map(ch=>ch+Z[(ch.charCodeAt(0)+frame)%Z.length]+(frame%2||heavy?Z[(frame*3)%Z.length]:'')).join('');
  const reveal=heavy?frame%2===0:frame%5===3, base=reveal?'이도윤':'토리???', txt=base; // 겹침 기호(zal)는 게임 글꼴에 없어서 네모로 보여요 → 색 어긋남만
  g.save(); g.font='bold 30px "Dongle",sans-serif'; g.textAlign='center'; const w2=g.measureText(base).width+70;
  g.fillStyle='rgba(16,4,10,.9)'; g.beginPath(); g.roundRect(x-w2/2,y-26,w2,40,12); g.fill(); g.strokeStyle=reveal?'#ff2040':'#ff6f9a'; g.lineWidth=2; g.stroke();
  const sp=heavy?7:3; g.globalCompositeOperation='screen'; g.fillStyle='rgba(255,30,90,.85)'; g.fillText(txt,x-sp,y+3); g.fillStyle='rgba(30,240,230,.75)'; g.fillText(txt,x+sp,y+3); g.globalCompositeOperation='source-over';
  g.fillStyle=reveal?'#ffdede':'#fff0f4'; g.fillText(txt,x,y+3);
  for(let k=0;k<(heavy?6:3);k++){ const yy=y-22+((frame*13+k*11)%34), hh=2+(k*frame)%4, dx=((frame*17+k*29)%30)-15; g.fillStyle=k%2?'rgba(255,40,90,.45)':'rgba(40,240,230,.35)'; g.fillRect(x-w2/2+dx*(heavy?2:1),yy,w2*.6,hh); } // 지지직 줄
  if(!reveal){ g.globalAlpha=.25; g.fillStyle='#ff2040'; g.font='bold 14px "Dongle",sans-serif'; g.fillText('이 도 윤',x+40+(frame%5)*6,y-30); g.globalAlpha=1; }
  g.restore(); }
function bossBar(hp,max,frame,heavy){ glitchName(600,236,frame,heavy);
  g.save(); g.fillStyle='rgba(60,10,20,.9)'; g.fillRect(450,262,300,12); const q=g.createLinearGradient(450,0,750,0); q.addColorStop(0,'#ff3b6b'); q.addColorStop(1,'#a0102c'); g.fillStyle=q; g.fillRect(450,262,300*hp/max,12);
  g.font='bold 15px "Dongle",sans-serif'; g.textAlign='center'; g.fillStyle='#ffd0dc'; g.fillText(`${Math.round(hp).toLocaleString()} / ${max.toLocaleString()}`,600,292); g.restore(); }
function warnCircle(x,y,r,k){ g.save(); g.fillStyle='rgba(255,40,80,.18)'; g.beginPath(); g.ellipse(x,y,r,r*.6,0,0,7); g.fill(); g.strokeStyle='#ff3b6b'; g.lineWidth=3; g.stroke(); g.fillStyle='rgba(255,40,80,.38)'; g.beginPath(); g.ellipse(x,y,r*k,r*.6*k,0,0,7); g.fill(); g.restore(); }
function letterShot(x,y,a,al=1){ g.save(); g.globalAlpha=al; g.shadowColor='rgba(255,80,120,.9)'; g.shadowBlur=12; letter(x,y,a,1.1); g.restore(); }
// 바닥에서 솟는 손: rise 0~1
function floorHand(x,y,rise,t){ g.save(); g.fillStyle='#050203'; g.beginPath(); g.ellipse(x,y,34*cl(rise*3),11*cl(rise*3),0,0,7); g.fill();
  g.strokeStyle='rgba(20,8,10,.8)'; g.lineWidth=2; for(let i=0;i<6;i++){const a=i*1.05+.3,L=40*cl(rise*3);g.beginPath();g.moveTo(x+Math.cos(a)*30,y+Math.sin(a)*9);g.lineTo(x+Math.cos(a)*(30+L),y+Math.sin(a)*(9+L*.3));g.stroke();}
  g.beginPath(); g.rect(x-80,y-200,160,200+Math.sin(0)); g.clip(); const up=90*ease(rise);
  g.strokeStyle='#b8a8a0'; g.lineCap='round'; g.lineWidth=16; g.beginPath(); g.moveTo(x,y+10); g.lineTo(x+Math.sin(t*8)*4,y+30-up); g.stroke();
  humanHand(x+Math.sin(t*8)*4,y+14-up,1.05,Math.sin(t*10)*.15); g.restore(); }
const use = f => (ctx, ...a) => { g = ctx; sd = 5; return f(...a); };
export const drawTurn = use(turnTori), drawBack = use(backA), drawWarn = use(warnCircle), drawLetter = use(letterShot), drawHand = use(floorHand), drawName = use(glitchName);
export { turnPose, ease, cl };
