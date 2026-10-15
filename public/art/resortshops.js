// 솜사탕 리조트 가게 12 종: 핑크 시장 가게와 같은 점토 장난감 그림체. drawResortShop(d, type, cx, gy, name) — (cx, gy) 는 건물 바닥 가운데
import { mixHex } from '../char.js';
import { K2, txt } from './shops.js';
const W = '#fffaf2', INK = '#3a2430';
// 줄무늬 몽실 지붕 (두 색 번갈아)
function stripePuff(d, cx, y, w, a, b, n=6){ const r = w/(n*1.6), cs = Array.isArray(b) ? b : [b]; for (let i=0;i<n;i++) d.circle(cx - w/2 + r + i*(w-2*r)/(n-1), y, r, i%2 ? cs[(i>>1)%cs.length] : a); d.rr(cx-w/2+r*.4, y-r*.2, w-r*.8, r*1.2, r*.6, a, {flat:true}); for (let i=0;i<n;i++) d.dot(cx - w/2 + r*.7 + i*(w-2*r)/(n-1), y - r*.45, r*.22, '#ffffff', .45); }
function steam(d, x, y, s=1){ for (let i=0;i<3;i++) d.line(k=>{ k.moveTo(x+i*10*s-10*s, y); k.bezierCurveTo(x+i*10*s-18*s, y-12*s, x+i*10*s-2*s, y-20*s, x+i*10*s-10*s, y-32*s); }, '#ffffff', 4*s); }
function sparkle(d, x, y, r, col='#ffd35c'){ const c = d.ctx; d.shape(()=>{ c.beginPath(); for (let i=0;i<8;i++){ const a = i*Math.PI/4 - Math.PI/2, rr = i%2 ? r*.38 : r; c.lineTo(x+Math.cos(a)*rr, y+Math.sin(a)*rr); } c.closePath(); }, col, [x, y, r]); }
const FAC = [
  // 1 놀이공원: 분홍·흰 줄무늬 서커스 지붕 · 뒤에 대관람차 · 꼭대기 얼굴 관람차 바퀴
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230);
    d.circle(cx+70, gy-170, 74, '#fff6d0'); d.line(k=>{ k.arc(cx+70, gy-170, 70, 0, 7); }, '#6ac8ff', 6); for (let i=0;i<8;i++){ const a = i*Math.PI/4; d.line(k=>{ k.moveTo(cx+70, gy-170); k.lineTo(cx+70+Math.cos(a)*68, gy-170+Math.sin(a)*68); }, '#9fd9ff', 3); d.rr(cx+70+Math.cos(a)*70-9, gy-170+Math.sin(a)*70-6, 18, 16, 6, ['#ff6b8a','#ffd35c','#6ac8ff','#7ad86a'][i%4]); }
    d.circle(cx+70, gy-170, 20, '#ffffff'); K2.face(d, cx+70, gy-172, .9);
    K2.body(d, cx-14, gy, 190, 120, '#bff0dc', 40); stripePuff(d, cx-14, gy-122, 214, '#ff6b9a', ['#ffd35c', '#6ac8ff', W], 7); d.tri([[cx-40, gy-138], [cx-14, gy-196], [cx+12, gy-138]], '#ffb020'); d.circle(cx-14, gy-200, 8, '#ffd35c');
    K2.win(d, cx-74, gy-64, 20); K2.door(d, cx-14, gy, 50, 74, '#9a6ae8'); K2.sign(d, cx-14, gy-98, nm, W, '#e0507a', 14);
    for (const x of [-110, 82]) { d.circle(cx+x, gy-30, 10, ['#6ac8ff','#ffd35c'][x>0?1:0]); d.line(k=>{ k.moveTo(cx+x, gy-20); k.lineTo(cx+x, gy); }, '#c3b8d2', 2); } },
  // 2 수영장: 하늘색 몸통 · 물결 차양 · 옆에 미끄럼틀 · 꼭대기 얼굴 튜브 오리
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230); const c = d.ctx;
    d.line(k=>{ k.moveTo(cx+80, gy-150); k.bezierCurveTo(cx+150, gy-130, cx+90, gy-60, cx+140, gy-10); }, '#ffd35c', 18); d.line(k=>{ k.moveTo(cx+80, gy-150); k.bezierCurveTo(cx+150, gy-130, cx+90, gy-60, cx+140, gy-10); }, '#ffe58a', 8);
    K2.body(d, cx-6, gy, 200, 130, '#cdeeff', 40); K2.scallop(d, cx-6, gy-132, 210, 7, '#ff8a7a', W, 30); d.rr(cx-112, gy-156, 212, 28, 14, '#2fb8a8');
    for (const x of [-60, 48]) K2.win(d, cx+x, gy-72, 20, W, '#9fe0ff'); K2.door(d, cx-6, gy, 46, 70, '#ffb020');
    d.ell(cx-6, gy-12, 96, 8, '#7fd0ff'); K2.sign(d, cx-6, gy-142, nm, W, '#1f8a7a', 14);
    d.circle(cx-6, gy-202, 36, '#7ad86a'); d.circle(cx-6, gy-202, 16, '#cdeeff', {flat:true}); for (let i=0;i<4;i++){ const a = i*Math.PI/2 + .78; d.dot(cx-6+Math.cos(a)*27, gy-202+Math.sin(a)*27, 7, '#ffffff', .95); }
    d.circle(cx-6, gy-238, 22, '#ffd35c'); d.ell(cx+14, gy-234, 10, 5, '#ff9533'); K2.face(d, cx-10, gy-240, .8); },
  // 3 찜질방: 살구색 둥근 지붕 · 온천 표시 김 · 꼭대기 양머리 수건 얼굴
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); const c = d.ctx;
    K2.body(d, cx, gy, 210, 130, '#ffe9a8', 40); d.shape(()=>{ c.beginPath(); c.ellipse(cx, gy-128, 112, 56, 0, Math.PI, 0); c.closePath(); }, '#e0605a', [cx, gy-150, 110]);
    d.rr(cx-112, gy-134, 224, 16, 8, '#a8404a'); K2.sign(d, cx, gy-108, nm, W, '#a8404a', 14);
    for (const x of [-62, 62]) { d.rr(cx+x-24, gy-86, 48, 40, 14, W); d.rr(cx+x-18, gy-80, 36, 28, 10, '#9fe3c4', {flat:true}); }
    d.rr(cx-28, gy-74, 56, 74, 24, '#fff4e8'); d.rr(cx-26, gy-60, 52, 30, 0, '#3a9ad8', {flat:true}); txt(c, '♨', cx, gy-46, 22, '#ffffff', 700, 'center');
    steam(d, cx-70, gy-176, .9); steam(d, cx+80, gy-170, .8);
    d.circle(cx, gy-214, 34, '#ffd9b8'); d.circle(cx-30, gy-232, 18, '#ffe9f0'); d.circle(cx+30, gy-232, 18, '#ffe9f0'); d.ell(cx, gy-244, 36, 16, '#ffe9f0'); d.circle(cx-30, gy-232, 9, '#ffd0e0', {flat:true}); d.circle(cx+30, gy-232, 9, '#ffd0e0', {flat:true}); K2.face(d, cx, gy-208, 1.1); },
  // 4 캠핑장: 초록 세모 텐트 집 · 모닥불 · 꼭대기 얼굴 마시멜로 꼬치
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230); const c = d.ctx;
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-110, gy); c.quadraticCurveTo(cx-60, gy-120, cx-8, gy-178); c.quadraticCurveTo(cx, gy-186, cx+8, gy-178); c.quadraticCurveTo(cx+60, gy-120, cx+110, gy); c.closePath(); }, '#ff9a4a', [cx, gy-80, 110]);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-56, gy); c.quadraticCurveTo(cx-30, gy-70, cx, gy-110); c.quadraticCurveTo(cx+30, gy-70, cx+56, gy); c.closePath(); }, '#fff1dc', [cx, gy-50, 56]); d.shape(()=>{ c.beginPath(); c.moveTo(cx-30, gy); c.quadraticCurveTo(cx-14, gy-44, cx, gy-70); c.quadraticCurveTo(cx+14, gy-44, cx+30, gy); c.closePath(); }, '#3ab0a0', [cx, gy-30, 30]);
    for (const s of [-1, 1]) d.line(k=>{ k.moveTo(cx+s*96, gy-30); k.lineTo(cx+s*128, gy); }, '#9a6a45', 3);
    K2.sign(d, cx, gy-136, nm, W, '#c8602a', 13);
    const fx = cx+138; d.ell(fx, gy-6, 22, 7, '#9a6a45'); d.circle(fx, gy-20, 12, '#ff9533'); d.circle(fx, gy-28, 8, '#ffd35c');
    d.line(k=>{ k.moveTo(cx-6, gy-172); k.lineTo(cx+12, gy-206); }, '#c98e5b', 5); d.rr(cx-14, gy-252, 56, 50, 20, '#fffaf2'); d.rr(cx-14, gy-252, 56, 14, 8, '#e8b87a', {flat:true}); K2.face(d, cx+14, gy-222, 1);
    K2.bush(d, cx-134, gy, .8); },
  // 5 낚싯배 투어: 배 모양 몸통 · 구명 튜브 · 꼭대기 얼굴 물고기
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 240); const c = d.ctx;
    d.ell(cx, gy-10, 120, 12, '#7fd0ff'); d.shape(()=>{ c.beginPath(); c.moveTo(cx-120, gy-70); c.lineTo(cx+124, gy-70); c.quadraticCurveTo(cx+110, gy-6, cx+70, gy-4); c.lineTo(cx-80, gy-4); c.quadraticCurveTo(cx-116, gy-10, cx-120, gy-70); c.closePath(); }, '#ff6b6b', [cx, gy-40, 120]);
    d.rr(cx-118, gy-78, 242, 14, 7, W); for (const x of [-70, -20, 30, 80]) d.circle(cx+x, gy-40, 9, '#cdeeff');
    K2.body(d, cx-14, gy-74, 150, 90, '#c8f0dc', 26); d.rr(cx-94, gy-180, 160, 24, 12, '#2f5aa8'); for (const x of [-56, 4]) d.rr(cx+x-20, gy-148, 40, 30, 10, '#bfe6ff');
    d.circle(cx+48, gy-120, 16, '#ffb020'); d.circle(cx+48, gy-120, 8, '#c8f0dc', {flat:true}); for (let i=0;i<4;i++){ const a = i*Math.PI/2+.78; d.dot(cx+48+Math.cos(a)*12, gy-120+Math.sin(a)*12, 3.4, '#ffffff'); }
    d.rr(cx-16, gy-240, 6, 64, 3, '#9a6a45'); d.shape(()=>{ c.beginPath(); c.moveTo(cx-10, gy-238); c.lineTo(cx+34, gy-226); c.lineTo(cx-10, gy-214); c.closePath(); }, '#ffd35c', [cx+6, gy-226, 20]);
    K2.sign(d, cx-14, gy-168, nm, W, '#2f5aa8', 13);
    d.ell(cx+100, gy-196, 30, 20, '#ff9f7a'); d.shape(()=>{ c.beginPath(); c.moveTo(cx+126, gy-196); c.lineTo(cx+148, gy-214); c.lineTo(cx+148, gy-178); c.closePath(); }, '#ff9f7a', [cx+138, gy-196, 14]); K2.face(d, cx+94, gy-198, .75); },
  // 6 서핑 교실: 민트 오두막 · 짚 지붕 · 기대 놓은 서핑보드 · 꼭대기 얼굴 파도
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230); const c = d.ctx;
    for (const [x, col, a] of [[-112, '#ff6b8a', -.12], [-92, '#ffd35c', .06], [108, '#6ac8ff', .1]]){ c.save(); c.translate(cx+x, gy-60); c.rotate(a); d.ell(0, 0, 13, 62, col); d.line(k=>{ k.moveTo(0, -56); k.lineTo(0, 56); }, '#ffffff', 3); c.restore(); }
    K2.body(d, cx, gy, 180, 120, '#d8f59a', 36); K2.puff(d, cx, gy-124, 220, '#e8c87a', 6); d.circle(cx-112, gy-130, 14, '#e8c87a'); d.circle(cx+112, gy-130, 14, '#e8c87a');
    for (let i=0;i<9;i++) d.line(k=>{ k.moveTo(cx-100+i*25, gy-112); k.lineTo(cx-104+i*25, gy-100); }, '#c9a050', 3);
    K2.win(d, cx-50, gy-62, 18, W, '#bfe6ff'); K2.door(d, cx+30, gy, 46, 72, '#ff7a6a'); K2.sign(d, cx, gy-150, nm, W, '#5a9a2a', 14);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-44, gy-176); c.bezierCurveTo(cx-40, gy-250, cx+46, gy-262, cx+44, gy-206); c.bezierCurveTo(cx+28, gy-226, cx+4, gy-214, cx+14, gy-196); c.quadraticCurveTo(cx+30, gy-176, cx+46, gy-176); c.closePath(); }, '#4ac0e8', [cx, gy-214, 46]); d.line(k=>{ k.moveTo(cx+44, gy-206); k.bezierCurveTo(cx+34, gy-216, cx+18, gy-212, cx+16, gy-200); }, '#ffffff', 5); K2.face(d, cx-14, gy-208, .8); },
  // 7 공연장: 보라 몸통 · 빨간 커튼 무대 · 꼭대기 얼굴 별
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230); const c = d.ctx;
    K2.body(d, cx, gy, 220, 150, '#aab8ff', 44); K2.puff(d, cx, gy-152, 240, '#ff5ab0', 6);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-74, gy-6); c.lineTo(cx-74, gy-84); c.arc(cx, gy-84, 74, Math.PI, 0); c.lineTo(cx+74, gy-6); c.closePath(); }, '#2a2a5a', [cx, gy-70, 74]);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-70, gy-6); c.lineTo(cx-70, gy-84); c.arc(cx, gy-84, 70, Math.PI, Math.PI*1.5); c.quadraticCurveTo(cx-20, gy-60, cx-40, gy-6); c.closePath(); }, '#e0405a', [cx-50, gy-80, 50]);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx+70, gy-6); c.lineTo(cx+70, gy-84); c.arc(cx, gy-84, 70, 0, -Math.PI*.5, true); c.quadraticCurveTo(cx+20, gy-60, cx+40, gy-6); c.closePath(); }, '#e0405a', [cx+50, gy-80, 50]);
    d.rr(cx-84, gy-12, 168, 14, 7, '#ffd35c'); for (const x of [-96, 96]) { d.circle(cx+x, gy-120, 9, '#ffd35c'); d.dot(cx+x, gy-120, 4, '#ffffff', .8); }
    K2.sign(d, cx, gy-152, nm, W, '#d03a8a', 14); sparkle(d, cx, gy-212, 44); K2.face(d, cx, gy-208, 1); sparkle(d, cx-62, gy-236, 12, '#ff9fc4'); sparkle(d, cx+60, gy-244, 10, '#9fd9ff'); },
  // 8 사진관: 노란 몸통 · 커다란 둥근 창 · 꼭대기 얼굴 카메라
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220);
    K2.body(d, cx, gy, 210, 140, '#ffd0c8', 42); K2.scallop(d, cx, gy-142, 220, 7, '#3ac0c0', W, 30); d.rr(cx-114, gy-166, 228, 28, 14, '#2a9a9a');
    d.circle(cx-46, gy-74, 38, W); d.circle(cx-46, gy-74, 30, '#fff3b0', {flat:true}); d.circle(cx-46, gy-80, 10, '#ffd0a8'); d.rr(cx-60, gy-70, 28, 22, 10, '#ff9fc4'); d.dot(cx-56, gy-90, 4, '#ffffff', .8);
    K2.door(d, cx+56, gy, 46, 80, '#5a7ad8'); K2.sign(d, cx, gy-152, nm, W, '#1f7a7a', 14);
    d.rr(cx-46, gy-246, 92, 62, 18, '#ffc83a'); d.rr(cx-30, gy-256, 30, 14, 6, '#ffc83a'); d.rr(cx+18, gy-254, 18, 10, 5, '#fffaf2'); d.circle(cx+6, gy-214, 22, '#5b5266'); d.circle(cx+6, gy-214, 15, '#9fd9ff', {flat:true}); d.dot(cx, gy-220, 5, '#ffffff', .9);
    K2.face(d, cx-28, gy-226, .55); },
  // 9 오락실: 진분홍 몸통 · 반짝 전구 테두리 · 인형 뽑기 창 · 꼭대기 얼굴 조이스틱
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); const c = d.ctx;
    K2.body(d, cx, gy, 210, 150, '#7a5ad8', 44); d.rr(cx-110, gy-186, 220, 46, 23, '#ff3a8a'); txt(c, nm, cx, gy-162, 16, '#fff', 700, 'center');
    for (let i=0;i<11;i++) d.dot(cx-100+i*20, gy-138, 4, ['#ffd35c','#9fd9ff','#ffffff'][i%3]);
    d.rr(cx-92, gy-120, 90, 104, 18, '#ffd35c'); d.rr(cx-84, gy-112, 74, 60, 12, '#e8f6ff', {flat:true}); for (const [x, col] of [[-72,'#ffd35c'],[-50,'#ff9fc4'],[-30,'#9fe3c4']]) d.circle(cx+x, gy-62, 9, col); d.line(k=>{ k.moveTo(cx-48, gy-112); k.lineTo(cx-48, gy-88); }, '#5b5266', 2); d.line(k=>{ k.moveTo(cx-56, gy-84); k.lineTo(cx-48, gy-90); k.lineTo(cx-40, gy-84); }, '#5b5266', 3);
    K2.door(d, cx+50, gy, 50, 84, '#3ad0e0');
    d.rr(cx-40, gy-208, 80, 22, 11, '#2a2a4a'); d.rr(cx-4, gy-246, 8, 40, 4, '#c3b8d2'); d.circle(cx, gy-252, 24, '#7ad86a'); K2.face(d, cx, gy-252, .7); d.circle(cx+26, gy-198, 6, '#ffd35c'); d.circle(cx-26, gy-198, 6, '#6ac8ff'); },
  // 10 볼링장: 살구 몸통 · 레인 무늬 · 볼링공 · 꼭대기 얼굴 볼링핀
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230); const c = d.ctx;
    K2.body(d, cx, gy, 220, 130, '#c8e4ff', 40); stripePuff(d, cx, gy-132, 236, '#ff5a5a', W, 7);
    d.rr(cx-90, gy-90, 120, 60, 18, W); d.rr(cx-84, gy-84, 108, 48, 14, '#f3d29a', {flat:true}); for (let i=0;i<5;i++) d.line(k=>{ k.moveTo(cx-80+i*24, gy-82); k.lineTo(cx-80+i*24, gy-40); }, '#e0b46a', 2);
    K2.door(d, cx+64, gy, 44, 72, '#ff9a3a'); K2.sign(d, cx, gy-120, nm, W, '#d03a3a', 14);
    d.circle(cx-128, gy-18, 18, '#b04ae0'); for (const [a, b] of [[-6,-6],[2,-9],[-1,0]]) d.dot(cx-128+a, gy-18+b, 2.6, '#2a2a5a');
    d.shape(()=>{ c.beginPath(); c.moveTo(cx, gy-276); c.bezierCurveTo(cx+18, gy-276, cx+18, gy-244, cx+10, gy-236); c.bezierCurveTo(cx+34, gy-216, cx+30, gy-178, cx+16, gy-164); c.lineTo(cx-16, gy-164); c.bezierCurveTo(cx-30, gy-178, cx-34, gy-216, cx-10, gy-236); c.bezierCurveTo(cx-18, gy-244, cx-18, gy-276, cx, gy-276); c.closePath(); }, '#ffffff', [cx, gy-220, 34]);
    d.rr(cx-12, gy-238, 24, 6, 3, '#ff5a5a', {flat:true}); d.rr(cx-14, gy-230, 28, 5, 3, '#ff5a5a', {flat:true}); K2.face(d, cx, gy-200, .85); },
  // 11 스쿠버 다이빙: 잠수함 모양 몸통 · 동그란 창 · 꼭대기 얼굴 문어
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 240); const c = d.ctx;
    d.rr(cx-118, gy-128, 236, 124, 62, '#ffd23f'); d.rr(cx-100, gy-120, 196, 14, 7, '#ffe98a', {flat:true}); for (const x of [-64, 0, 64]){ d.circle(cx+x, gy-66, 24, '#ff8a3a'); d.circle(cx+x, gy-66, 18, '#3a8ad8', {flat:true}); d.dot(cx+x-6, gy-72, 4, '#ffffff', .85); }
    d.circle(cx-64, gy-62, 6, '#ff9533'); d.circle(cx+4, gy-60, 5, '#ff6b8a'); d.circle(cx+66, gy-64, 6, '#7ad86a');
    d.rr(cx-40, gy-160, 80, 40, 16, '#ff8a3a'); d.rr(cx+18, gy-196, 10, 40, 5, '#ff8a3a'); d.rr(cx+18, gy-198, 26, 10, 5, '#ff8a3a');
    for (const [x, y, r] of [[-110, -150, 6], [-122, -170, 4], [118, -140, 5]]) { d.circle(cx+x, gy+y, r, '#cdeeff'); d.dot(cx+x-r*.3, gy+y-r*.3, r*.3, '#ffffff'); }
    K2.sign(d, cx, gy-14, nm, W, '#c8602a', 13);
    for (let i=0;i<5;i++) d.line(k=>{ const x = cx-36+i*18; k.moveTo(x, gy-196); k.quadraticCurveTo(x-6, gy-176, x+4, gy-166); }, '#ff7aa8', 9);
    d.ell(cx-6, gy-222, 40, 34, '#ff7aa8'); d.rr(cx-30, gy-232, 48, 16, 8, '#cdeeff'); K2.face(d, cx-6, gy-214, .9); },
  // 12 열기구 투어: 크림 몸통 · 하늘 창 · 꼭대기 얼굴 열기구
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); const c = d.ctx;
    K2.body(d, cx, gy, 200, 120, '#e6d8ff', 40); K2.puff(d, cx, gy-124, 220, '#4ab0f0', 6);
    for (const x of [-50, 50]){ d.rr(cx+x-24, gy-88, 48, 44, 16, W); d.rr(cx+x-18, gy-82, 36, 32, 12, '#bfe6ff', {flat:true}); d.ell(cx+x+4, gy-66, 10, 5, '#ffffff'); }
    K2.door(d, cx, gy, 44, 66, '#9a5ad8'); 
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-22, gy-196); c.bezierCurveTo(cx-70, gy-230, cx-60, gy-312, cx, gy-312); c.bezierCurveTo(cx+60, gy-312, cx+70, gy-230, cx+22, gy-196); c.closePath(); }, '#ff5a7a', [cx, gy-240, 56]);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-8, gy-198); c.bezierCurveTo(cx-24, gy-232, cx-22, gy-306, cx, gy-310); c.bezierCurveTo(cx+22, gy-306, cx+24, gy-232, cx+8, gy-198); c.closePath(); }, '#ffd35c', [cx, gy-260, 30], {flat:true});
    for (const s of [-1, 1]) d.line(k=>{ k.moveTo(cx+s*20, gy-196); k.lineTo(cx+s*14, gy-180); }, '#9a6a45', 2); d.rr(cx-16, gy-182, 32, 18, 6, '#c98e5b');
    K2.sign(d, cx, gy-128, nm, W, '#7a4ac8', 14); K2.face(d, cx, gy-256, 1); for (const [x, y] of [[-96, -210], [92, -232]]) { d.ell(cx+x, gy+y, 22, 10, '#ffffff'); d.circle(cx+x+8, gy+y-6, 10, '#ffffff'); } },
];
export function drawResortShop(d, type, cx, gy, name){ const c = d.ctx; c.save(); try { FAC[type](d, cx, gy, name); } catch(e){ console.warn(e); } c.restore(); c.textBaseline = 'alphabetic'; }
