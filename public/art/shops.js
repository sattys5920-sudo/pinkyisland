// 핑크 시장 가게 외관 12 종: 동글동글한 점토 장난감 느낌. drawShop(d, type, cx, gy, name) — (cx, gy) 는 건물 바닥 가운데
import { mixHex } from '../char.js';
function txt(c, s, x, y, size=16, col='#2a2429', w=700, align='left'){ c.font = `${w} ${size}px "Maple",sans-serif`; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y); }
function bowl(d, x, y, r, soup, rim='#fbf6ef'){ const c = d.ctx; d.ell(x, y, r, r*.3, soup); d.shape(()=>{ c.beginPath(); c.moveTo(x-r, y); c.quadraticCurveTo(x-r, y+r*.95, x, y+r*.95); c.quadraticCurveTo(x+r, y+r*.95, x+r, y); c.closePath(); }, rim, [x, y+r*.4, r]); }
const K2 = {
  body(d, cx, gy, w, h, col, r){ d.rr(cx-w/2, gy-h, w, h, r ?? Math.min(w, h)*.3, col); d.rr(cx-w/2+10, gy-h+8, w-20, 14, 7, mixHex(col, '#ffffff', .35), {flat:true}); },
  puff(d, cx, y, w, col, n=5, r){ const rr = r ?? w/(n*1.6); for (let i=0;i<n;i++) d.circle(cx - w/2 + rr + i*(w-2*rr)/(n-1), y, rr, col); d.rr(cx-w/2+rr*.4, y-rr*.2, w-rr*.8, rr*1.2, rr*.6, col, {flat:true}); for (let i=0;i<n;i++) d.dot(cx - w/2 + rr*.7 + i*(w-2*rr)/(n-1), y - rr*.45, rr*.22, '#ffffff', .45); },
  scallop(d, cx, y, w, n, a, b='#ffffff', drop=26){ const c = d.ctx, sw = w/n; for (let i=0;i<n;i++){ const x = cx - w/2 + i*sw; d.shape(()=>{ c.beginPath(); c.moveTo(x, y); c.lineTo(x+sw, y); c.lineTo(x+sw, y+drop-sw/2); c.arc(x+sw/2, y+drop-sw/2, sw/2, 0, Math.PI); c.closePath(); }, i%2 ? b : a, [x+sw/2, y+drop/2, sw/2]); } },
  win(d, x, y, r, frame='#fffaf2', glass='#cfeefb'){ d.circle(x, y, r, frame); d.circle(x, y, r*.74, glass, {flat:true}); d.line(k=>{ k.moveTo(x-r*.74, y); k.lineTo(x+r*.74, y); k.moveTo(x, y-r*.74); k.lineTo(x, y+r*.74); }, frame, r*.14); d.dot(x-r*.3, y-r*.32, r*.16, '#ffffff', .85); },
  door(d, x, gy, w, h, col){ const c = d.ctx; d.shape(()=>{ c.beginPath(); c.moveTo(x-w/2, gy); c.lineTo(x-w/2, gy-h+w/2); c.arc(x, gy-h+w/2, w/2, Math.PI, 0); c.lineTo(x+w/2, gy); c.closePath(); }, col, [x, gy-h/2, h/2]); d.dot(x+w*.26, gy-h*.42, 3.4, '#ffd35c'); d.rr(x-w/2-6, gy-8, w+12, 10, 5, mixHex(col, '#ffffff', .4), {flat:true}); },
  sign(d, x, y, s, bg='#fffaf2', fg='#5b3345', size=16){ const c = d.ctx; c.font = `700 ${size}px Maple`; const w = c.measureText(s).width + 30; d.rr(x-w/2, y-size*.95, w, size*1.9, size*.95, bg); txt(c, s, x, y+1, size, fg, 700, 'center'); },
  face(d, x, y, s=1, eye='#3a2430'){ d.dot(x-7*s, y, 2.6*s, eye); d.dot(x+7*s, y, 2.6*s, eye); d.dot(x-6.2*s, y-.9*s, .9*s, '#ffffff'); d.dot(x+7.8*s, y-.9*s, .9*s, '#ffffff'); d.dot(x-12*s, y+4.5*s, 3.2*s, '#ff9fb8', .7); d.dot(x+12*s, y+4.5*s, 3.2*s, '#ff9fb8', .7); d.line(k=>{ k.arc(x, y+2.5*s, 3.2*s, .3, Math.PI-.3); }, eye, 1.4*s); },
  bush(d, x, gy, s=1, col='#7fd07a'){ d.circle(x-12*s, gy-12*s, 14*s, col); d.circle(x+12*s, gy-12*s, 14*s, col); d.circle(x, gy-22*s, 16*s, mixHex(col, '#ffffff', .1)); },
  shadow(d, cx, gy, w){ const c = d.ctx; c.save(); c.globalAlpha = .16; c.fillStyle = '#5b3345'; c.beginPath(); c.ellipse(cx, gy+4, w/2+14, 12, 0, 0, Math.PI*2); c.fill(); c.restore(); },
};
const FAC2 = [
  // 1 양식집: 테라코타 몸통 · 초록 물결 차양 · 얼굴 토마토
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); K2.body(d, cx, gy, 220, 150, '#f6b88a', 44); K2.scallop(d, cx, gy-150, 228, 7, '#6cc46a', '#fffaf2', 34); d.rr(cx-118, gy-176, 236, 30, 15, '#c9657a');
    K2.win(d, cx-68, gy-72, 26); K2.win(d, cx+68, gy-72, 26); K2.door(d, cx, gy, 54, 92, '#a8574a');
    d.circle(cx, gy-212, 40, '#ff5a5a'); d.ell(cx, gy-250, 18, 8, '#4fae3c'); d.circle(cx-6, gy-256, 6, '#4fae3c'); K2.face(d, cx, gy-210, 1.3); K2.sign(d, cx, gy-162, nm, '#fffaf2', '#a8574a', 15); K2.bush(d, cx-128, gy, .9); },
  // 2 붕어빵: 동글 포장마차 · 몽실 빨간 천막 · 얼굴 붕어빵
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); d.circle(cx-62, gy-20, 22, '#5b5266'); d.circle(cx+62, gy-20, 22, '#5b5266'); d.circle(cx-62, gy-20, 9, '#e8e3ef'); d.circle(cx+62, gy-20, 9, '#e8e3ef');
    K2.body(d, cx, gy-24, 210, 90, '#ffb347', 36); d.rr(cx-84, gy-100, 168, 34, 17, '#7d8090'); for (let i=0;i<4;i++){ const x = cx-60+i*40; d.ell(x, gy-83, 15, 10, '#e39a45'); d.dot(x-8, gy-85, 2, '#3a2430'); }
    d.rr(cx-98, gy-190, 12, 90, 6, '#c98e5b'); d.rr(cx+86, gy-190, 12, 90, 6, '#c98e5b'); K2.puff(d, cx, gy-188, 240, '#ff6b5a', 6);
    const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx-6, gy-246, 52, 34, 0, 0, Math.PI*2); c.moveTo(cx+38, gy-246); c.quadraticCurveTo(cx+70, gy-280, cx+72, gy-260); c.quadraticCurveTo(cx+62, gy-246, cx+72, gy-230); c.quadraticCurveTo(cx+70, gy-212, cx+38, gy-246); c.closePath(); }, '#eaa04f', [cx, gy-246, 52]); for (let i=0;i<3;i++) d.line(k=>{ k.arc(cx+4+i*10, gy-246, 14, -.9, .9); }, '#c97a35', 2.4); K2.face(d, cx-26, gy-250, 1.2);
    K2.sign(d, cx, gy-140, nm, '#fffaf2', '#c9657a', 15); },
  // 3 초밥집: 크림 몸통 · 몽실 남색 지붕 · 얼굴 연어초밥
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 210); K2.body(d, cx, gy, 210, 140, '#fff1dc', 40); K2.puff(d, cx, gy-146, 250, '#4a5a7a', 6); d.circle(cx-128, gy-150, 18, '#4a5a7a'); d.circle(cx+128, gy-150, 18, '#4a5a7a');
    for (let i=0;i<3;i++) d.rr(cx-66+i*46, gy-118, 40, 52, 16, '#5b7fd6'); d.ell(cx-20, gy-96, 10, 6, '#ff9f7a'); K2.door(d, cx, gy, 56, 64, '#9a6a45');
    for (const sx of [-82, 82]){ d.ell(cx+sx, gy-70, 16, 22, '#ff6b5a'); d.rr(cx+sx-8, gy-94, 16, 6, 3, '#3a2a2a'); d.rr(cx+sx-8, gy-50, 16, 6, 3, '#3a2a2a'); }
    d.ell(cx, gy-196, 46, 22, '#ffffff'); d.ell(cx, gy-212, 50, 20, '#ff9f7a'); for (let i=0;i<3;i++) d.line(k=>{ k.moveTo(cx-30+i*24, gy-226); k.quadraticCurveTo(cx-24+i*24, gy-212, cx-30+i*24, gy-198); }, '#ffd9c8', 3); K2.face(d, cx, gy-196, 1.1);
    K2.sign(d, cx, gy-150, nm, '#fffaf2', '#3a3a5a', 15); },
  // 4 분식집: 분홍 동글 상자 · 얼굴 김밥
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); K2.body(d, cx, gy, 220, 160, '#ffd9e6', 50); d.rr(cx-112, gy-180, 224, 46, 23, '#ff5a8a'); txt(d.ctx, nm, cx, gy-156, 17, '#fff', 700, 'center');
    d.rr(cx-88, gy-124, 120, 70, 26, '#ffffff'); d.rr(cx-82, gy-118, 108, 58, 22, '#cfeefb', {flat:true}); d.dot(cx-64, gy-104, 6, '#ffffff', .8); K2.door(d, cx+64, gy, 46, 84, '#ff9fc4');
    for (const x of [-70, -36]){ d.circle(cx+x, gy-24, 12, '#ff4f4f'); d.rr(cx+x-2, gy-24, 4, 24, 2, '#c3b8d2'); }
    d.circle(cx, gy-228, 38, '#2f3a2a'); d.circle(cx, gy-228, 30, '#ffffff', {flat:true}); d.dot(cx-12, gy-232, 6, '#ff9533'); d.dot(cx+12, gy-232, 6, '#4fae3c'); d.dot(cx, gy-218, 6, '#ffd35c'); K2.face(d, cx, gy-236, .9); },
  // 5 한식 밥집: 몽실 기와 · 동그란 창호지 · 얼굴 장독
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); d.rr(cx-118, gy-24, 236, 24, 12, '#c3b8d2'); K2.body(d, cx, gy-20, 200, 110, '#fffaf0', 36); for (const x of [-60, 0, 60]){ d.circle(cx+x, gy-76, 24, '#c98e5b'); d.circle(cx+x, gy-76, 19, '#fff8e6', {flat:true}); d.line(k=>{ k.moveTo(cx+x-19, gy-76); k.lineTo(cx+x+19, gy-76); k.moveTo(cx+x, gy-95); k.lineTo(cx+x, gy-57); }, '#c98e5b', 2); }
    K2.puff(d, cx, gy-142, 250, '#6a6080', 6); const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx-128, gy-156, 22, 14, -.5, 0, Math.PI*2); c.ellipse(cx+128, gy-156, 22, 14, .5, 0, Math.PI*2); }, '#6a6080', [cx, gy-156, 130]);
    K2.sign(d, cx, gy-140, nm, '#7a4a3a', '#fff3e3', 15);
    for (const [x, s] of [[-140, 1], [-112, .75], [138, .9]]){ d.ell(cx+x, gy-22*s, 20*s, 22*s, '#7a4a3a'); d.ell(cx+x, gy-42*s, 12*s, 5*s, '#5a3424'); K2.face(d, cx+x, gy-22*s, .55*s, '#fff3e3'); } },
  // 6 우동집: 버섯 같은 둥근 지붕 오두막 · 얼굴 우동 그릇
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 200); K2.body(d, cx, gy, 190, 130, '#f3dcb4', 40); const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx, gy-140, 128, 66, 0, Math.PI, 0); c.quadraticCurveTo(cx+128, gy-122, cx+110, gy-122); c.lineTo(cx-110, gy-122); c.quadraticCurveTo(cx-128, gy-122, cx-128, gy-140); c.closePath(); }, '#c98e5b', [cx, gy-170, 128]); for (const [x,y] of [[-60,-170],[30,-180],[80,-150],[-20,-150]]) d.circle(cx+x, gy+y, 8, '#e0b07a');
    K2.door(d, cx-30, gy, 52, 80, '#7a4a3a'); K2.win(d, cx+48, gy-62, 22, '#9a6a45', '#fff3d9');
    d.line(k=>{ k.moveTo(cx-120, gy-128); k.lineTo(cx-120, gy-96); }, '#3a2a2a', 2); d.ell(cx-120, gy-74, 18, 24, '#ff5a5a'); d.rr(cx-128, gy-100, 16, 6, 3, '#3a2a2a'); d.rr(cx-128, gy-52, 16, 6, 3, '#3a2a2a');
    bowl(d, cx, gy-232, 40, '#f1d8a8'); for (let i=0;i<4;i++) d.line(k=>{ k.moveTo(cx-24+i*12, gy-234); k.quadraticCurveTo(cx-18+i*12, gy-230, cx-22+i*12, gy-226); }, '#fff8e6', 3); K2.face(d, cx, gy-212, 1); for (let i=0;i<3;i++) d.line(k=>{ k.moveTo(cx-16+i*16, gy-244); k.quadraticCurveTo(cx-22+i*16, gy-258, cx-16+i*16, gy-272); }, '#ffffff', 3, .8);
    K2.sign(d, cx, gy-130, nm, '#fffaf2', '#7a4a3a', 15); },
  // 7 빙수 가게: 통통 이글루 · 얼굴 빙수
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 230); const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx, gy, 120, 130, 0, Math.PI, 0); c.closePath(); }, '#eef8ff', [cx, gy-60, 120]); for (let r=0;r<3;r++) for (let i=0;i<5+r;i++){ const a = Math.PI + (i+.5)*Math.PI/(5+r); d.dot(cx+Math.cos(a)*(100-r*30), gy+Math.sin(a)*(108-r*32), 5, '#cfe6ff', .9); }
    K2.door(d, cx, gy, 64, 76, '#7fbfff'); d.shape(()=>{ c.beginPath(); c.moveTo(cx-28, gy-150); c.lineTo(cx+28, gy-150); c.lineTo(cx+16, gy-116); c.lineTo(cx-16, gy-116); c.closePath(); }, '#9fd9ff', [cx, gy-134, 28]); d.circle(cx, gy-168, 32, '#ffe3ec'); d.circle(cx+12, gy-194, 9, '#ff4f6d'); K2.face(d, cx, gy-164, 1.1);
    K2.sign(d, cx, gy-96, nm, '#7fbfff', '#ffffff', 15); for (const x of [-138, 136]){ d.circle(cx+x, gy-14, 16, '#ffffff'); d.circle(cx+x, gy-38, 12, '#ffffff'); K2.face(d, cx+x, gy-40, .5); } },
  // 8 주스 바: 둥근 오두막 · 몽실 짚 지붕 · 얼굴 오렌지
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 210); d.rr(cx+96, gy-150, 12, 150, 6, '#c98e5b'); for (let i=0;i<5;i++){ const a = -2.6 + i*.55; d.ctx.save(); d.ctx.translate(cx+102, gy-152); d.ctx.rotate(a); d.ell(30, 0, 34, 12, '#55ad57'); d.ctx.restore(); }
    K2.body(d, cx-10, gy, 180, 96, '#fff3d9', 36); for (let i=0;i<4;i++) d.rr(cx-84+i*40, gy-90, 20, 84, 10, 'rgba(255,161,79,.35)', {flat:true}); d.rr(cx-110, gy-64, 200, 20, 10, '#e0b07a');
    K2.puff(d, cx-10, gy-118, 230, '#ecc66a', 6); for (const [x, col] of [[-60, '#ff4f6d'], [-10, '#ffd35c'], [40, '#7fd07a']]) { d.rr(cx+x-10, gy-92, 20, 26, 8, col); }
    d.circle(cx-10, gy-188, 38, '#ffa14f'); d.circle(cx-10, gy-188, 31, '#ffd39a', {flat:true}); for (let i=0;i<8;i++){ const a = i*Math.PI/4; d.line(k=>{ k.moveTo(cx-10, gy-188); k.lineTo(cx-10+Math.cos(a)*29, gy-188+Math.sin(a)*29); }, '#ffb85a', 3); } K2.face(d, cx-10, gy-190, 1.1);
    K2.sign(d, cx-10, gy-132, nm, '#ff6b86', '#ffffff', 15); },
  // 9 사탕 가게: 크림 흘러내리는 둥근 집 · 롤리팝 기둥 · 얼굴 사탕
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); K2.body(d, cx, gy, 200, 140, '#ffe3f3', 50); const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx, gy-140, 122, 76, 0, Math.PI, 0); c.closePath(); }, '#c25a86', [cx, gy-170, 122]);
    d.shape(()=>{ c.beginPath(); c.moveTo(cx-122, gy-140); for (let i=0;i<7;i++){ const x = cx-122+i*35; c.quadraticCurveTo(x+8, gy-112-((i*5)%3)*8, x+17, gy-140); c.quadraticCurveTo(x+26, gy-150, x+35, gy-140); } c.lineTo(cx+122, gy-150); c.quadraticCurveTo(cx, gy-180, cx-122, gy-150); c.closePath(); }, '#fffaff', [cx, gy-140, 122]);
    for (const [x,y,col] of [[-60,-176,'#7fd07a'],[-20,-196,'#ffd35c'],[30,-192,'#7fb2ff'],[70,-170,'#ff4f4f']]) d.circle(cx+x, gy+y, 8, col);
    K2.win(d, cx-50, gy-70, 26, '#ffffff', '#ffd9ec'); K2.door(d, cx+40, gy, 52, 88, '#ff9fc4');
    for (const [x, col] of [[-128, '#7fb2ff'], [128, '#ffd35c']]){ d.rr(cx+x-4, gy-80, 8, 80, 4, '#ffffff'); d.circle(cx+x, gy-96, 24, col); d.line(k=>{ k.arc(cx+x, gy-96, 13, 0, 5); }, '#ffffff', 4); }
    d.rr(cx-4, gy-250, 8, 40, 4, '#ffffff'); d.circle(cx, gy-262, 30, '#ff9fc4'); d.line(k=>{ k.arc(cx, gy-262, 18, .5, 5.4); }, '#ffffff', 5); K2.face(d, cx, gy-260, 1);
    K2.sign(d, cx, gy-128, nm, '#fffaf2', '#c25a86', 15); },
  // 10 잼·피클 가게: 동글 빨간 헛간 · 얼굴 잼 병
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); K2.body(d, cx, gy, 210, 140, '#e2486a', 44); const c = d.ctx; d.shape(()=>{ c.beginPath(); c.moveTo(cx-124, gy-130); c.quadraticCurveTo(cx-110, gy-200, cx, gy-206); c.quadraticCurveTo(cx+110, gy-200, cx+124, gy-130); c.closePath(); }, '#8a3a5a', [cx, gy-170, 124]);
    for (let i=0;i<8;i++) d.rr(cx-96+i*24, gy-134, 24, 14, 0, i%2 ? '#fffaf2' : '#ff9fb8', {flat:true}); K2.door(d, cx, gy, 60, 86, '#fffaf2'); d.line(k=>{ k.moveTo(cx-24, gy-60); k.lineTo(cx+24, gy-6); k.moveTo(cx+24, gy-60); k.lineTo(cx-24, gy-6); }, '#c9a07a', 4);
    for (const sx of [-1, 1]){ const bx = cx + sx*70; d.rr(bx-26, gy-58, 52, 8, 4, '#e0b07a'); for (let i=0;i<3;i++){ d.rr(bx-22+i*16, gy-80, 13, 20, 5, ['#5b6bd6','#ffd35c','#7fd07a'][i]); d.rr(bx-23+i*16, gy-84, 15, 5, 2, '#fff3e3', {flat:true}); } }
    d.rr(cx-34, gy-262, 68, 64, 24, '#ff4f6d'); d.rr(cx-38, gy-276, 76, 20, 9, '#fff3e3'); d.rr(cx-38, gy-276, 76, 8, 4, '#ff9fb8', {flat:true}); K2.face(d, cx, gy-230, 1.1);
    K2.sign(d, cx, gy-172, nm, '#fffaf2', '#c2304f', 15); },
  // 11 향수 가게: 통통 보라 탑 · 동그란 지붕 · 얼굴 향수병
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 200); K2.body(d, cx, gy, 170, 170, '#efe6ff', 56); const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx, gy-166, 100, 70, 0, Math.PI, 0); c.closePath(); }, '#9a7ad6', [cx, gy-190, 100]); d.rr(cx-104, gy-174, 208, 18, 9, '#c9b5ff');
    K2.win(d, cx-44, gy-112, 22, '#ffffff', '#e2c9ff'); K2.win(d, cx+44, gy-112, 22, '#ffffff', '#e2c9ff'); K2.door(d, cx, gy, 56, 82, '#6a4aa6');
    d.rr(cx-12, gy-292, 24, 18, 6, '#ffd35c'); d.circle(cx, gy-252, 34, '#e2c9ff'); d.circle(cx, gy-252, 26, '#f4ecff', {flat:true}); K2.face(d, cx, gy-250, 1); for (let i=0;i<4;i++) d.dot(cx+40+i*10, gy-286-i*9, 4-i*.6, '#ffc2e6', .9);
    K2.sign(d, cx, gy-150, nm, '#6a4aa6', '#ffffff', 15); K2.bush(d, cx-112, gy, .9, '#b57bff'); K2.bush(d, cx+112, gy, .9, '#b57bff'); },
  // 12 도자기 공방: 동글 가마 · 굴뚝 연기 · 얼굴 항아리
  (d, cx, gy, nm) => { K2.shadow(d, cx, gy, 220); d.rr(cx+48, gy-210, 30, 80, 14, '#9a6a45'); for (let i=0;i<3;i++) d.circle(cx+64+i*10, gy-226-i*20, 12+i*4, '#eeeaf3');
    const c = d.ctx; d.shape(()=>{ c.beginPath(); c.ellipse(cx, gy, 118, 176, 0, Math.PI, 0); c.closePath(); }, '#e2a982', [cx, gy-90, 118]); for (let i=1;i<5;i++){ const y = gy - i*34, w = Math.sqrt(Math.max(0, 1 - Math.pow((i*34)/176, 2)))*112; d.line(k=>{ k.moveTo(cx-w, y); k.quadraticCurveTo(cx, y+6, cx+w, y); }, 'rgba(154,90,60,.35)', 3); }
    K2.door(d, cx, gy, 66, 80, '#5e3a2a'); c.save(); c.globalAlpha = .85; d.ell(cx, gy-22, 20, 18, '#ffa14f', {flat:true}); c.restore();
    K2.sign(d, cx, gy-118, nm, '#fffaf2', '#7a4a3a', 15);
    for (const [x, s, col] of [[-142, 1, '#efe8d8'], [-112, .72, '#7fb2ff'], [136, .9, '#c98e5b']]){ d.shape(()=>{ c.beginPath(); c.ellipse(cx+x, gy-22*s, 20*s, 22*s, 0, 0, Math.PI*2); }, col, [cx+x, gy-22*s, 20*s]); d.rr(cx+x-8*s, gy-50*s, 16*s, 10*s, 4*s, col); K2.face(d, cx+x, gy-22*s, .5*s); } },
];
export function drawShop(d, type, cx, gy, name){ const c = d.ctx; c.save(); try { FAC2[type](d, cx, gy, name); } catch(e){ console.warn(e); } c.restore(); c.textBaseline = 'alphabetic'; }
// 빈 터: 흙바닥 + 팻말
export function drawLot(d, x, gy, n){ const c = d.ctx; d.rr(x-110, gy-120, 220, 120, 16, '#e7cfa8'); c.save(); c.setLineDash([10, 8]); c.strokeStyle = '#c9a47a'; c.lineWidth = 4; c.beginPath(); c.roundRect(x-110, gy-120, 220, 120, 16); c.stroke(); c.restore(); d.rr(x-4, gy-170, 8, 90, 4, '#9a6a45'); d.rr(x-66, gy-196, 132, 40, 10, '#fffaf2'); txt(c, `${n}번 빈 터`, x, gy-175, 20, '#9a6a45', 700, 'center'); for (const [a,b] of [[-70,-30],[60,-50],[-20,-70]]) d.ell(x+a, gy+b, 10, 5, '#d9b98a'); c.textBaseline = 'alphabetic'; }
