// 토토??? (탁도현) 보스 그림: 100 살 고래 촌장 · 변신 뒤 금화를 뿜는 교주 (시안 boss.html · thelpers.js 를 그대로 옮겼어요)
// 무거운 그림은 처음 한 번 캔버스에 그려 두고 drawImage 해요
let g = null, sd = 71;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
// 시안 글꼴(메이플 s px) = 게임의 "Dongle" s/0.7 px
const txt = (t, x, y, s, col) => { g.save(); g.font = `bold ${Math.round(s/.7)}px "Dongle",sans-serif`; g.textAlign = 'center'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
function rr(x, y, w, h, f, r = 6){ g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); }
function coin(x, y, r){ ell(x, y, r, r, lg(x - r, y - r, x + r, y + r, '#fff2a0', '#e0a820', '#8a5a10')); g.strokeStyle = 'rgba(120,70,10,.6)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, r*.7, 0, 7); g.stroke(); }
function envelope(x, y, s, rot, label){ g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(-26, -16, 52, 32, '#e8dcbc', 2); g.fillStyle = '#d4c69e'; g.beginPath(); g.moveTo(-26, -16); g.lineTo(0, 4); g.lineTo(26, -16); g.fill(); g.fillStyle = '#5a8a4a'; g.fillRect(-18, -22, 24, 7); if (label) txt(label, 0, 12, 9, '#8a1010'); g.restore(); }
function barnEye(x, y, r, look){ ell(x, y, r*1.35, r*1.2, '#5a5248'); ell(x, y, r, r*.85, '#e8e2cc'); const q = g.createRadialGradient(x, y, 1, x, y, r); q.addColorStop(.6, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(160,40,40,.6)'); g.fillStyle = q; g.beginPath(); g.ellipse(x, y, r, r*.85, 0, 0, 7); g.fill(); ell(x + Math.cos(look)*r*.4, y + Math.sin(look)*r*.3, r*.38, r*.38, '#1a0e08'); ell(x + Math.cos(look)*r*.4 - r*.12, y + Math.sin(look)*r*.3 - r*.12, r*.1, r*.1, '#fff'); }
function drip(x, y, len, w = 5){ g.fillStyle = '#07060a'; g.beginPath(); g.moveTo(x - w/2, y); g.quadraticCurveTo(x - w/2, y + len*.8, x, y + len); g.quadraticCurveTo(x + w/2, y + len*.8, x + w/2, y); g.fill(); ell(x, y + len, w*.7, w*.8, '#07060a'); }
function tinyHand(x, y, a, s){ g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.strokeStyle = '#d8d0c4'; g.lineCap = 'round'; g.lineWidth = 7; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -28); g.stroke(); g.lineWidth = 3; for (let f = 0; f < 4; f++){ g.beginPath(); g.moveTo(0, -28); g.quadraticCurveTo(-6 + f*4, -36, -8 + f*5.4, -42 - (f%2)*3); g.stroke(); } g.restore(); }
function podium(half){
  g.fillStyle = lg(-200, 230, 200, 350, half ? '#2a3a2a' : '#7a5a3a', half ? '#0e140e' : '#4a3420'); g.beginPath(); g.moveTo(-210, 240); g.lineTo(210, 240); g.lineTo(190, 350); g.lineTo(-190, 350); g.closePath(); g.fill(); rr(-226, 226, 452, 24, half ? '#3a4a3a' : '#9a7448', 8);
  ell(0, 296, 34, 34, half ? '#5a4a20' : '#c9a050'); txt(half ? '헌금' : '마을', 0, 305, 22, half ? '#b02020' : '#5a3a10');
  if (half) for (let k = 0; k < 26; k++) coin(-200 + R()*400, 236 - R()*14, 8 + R()*5); }
// 고래 촌장 (원점 = 몸 가운데 · 발판 바닥 y = 350 · 발판 없으면 발 y = 246)
function whale(half, pod){ sd = 71;
  if (pod) podium(half);
  if (half){ const au = g.createRadialGradient(0, -80, 30, 0, -80, 440); au.addColorStop(0, 'rgba(220,180,40,.32)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-460, -560, 920, 940);
    for (let k = 0; k < 11; k++){ const a = k/11*6.28 + .3; envelope(Math.cos(a)*310, -40 + Math.sin(a)*200, 1.3, a*.3, '헌금'); } }
  const B = half ? '#4a5a66' : '#7fa8d9', Bd = half ? '#0e1418' : '#4a74a8', BL = half ? '#8a8676' : '#f3ead2';
  g.save(); g.translate(150, 120); g.rotate(-.5); g.fillStyle = Bd; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(40, -40, 30, -110); g.quadraticCurveTo(10, -70, -10, -60); g.quadraticCurveTo(-40, -90, -80, -90); g.quadraticCurveTo(-40, -40, 0, 0); g.fill();
    if (half){ g.strokeStyle = '#050402'; g.lineWidth = 6; g.beginPath(); g.moveTo(10, -20); g.lineTo(-10, -50); g.lineTo(6, -70); g.stroke(); } g.restore();
  for (const s2 of [-1, 1]) ell(s2*60, 222, 40, 24, Bd);
  ell(0, 10, 170, 210, rg(-40, -60, 220, B, Bd));
  g.save(); g.beginPath(); g.ellipse(0, 10, 170, 210, 0, 0, 7); g.clip(); ell(0, 120, 140, 130, BL); g.strokeStyle = half ? 'rgba(40,40,30,.4)' : 'rgba(180,160,120,.45)'; g.lineWidth = 4; for (let k = 0; k < 5; k++){ g.beginPath(); g.moveTo(-110 + k*10, 40 + k*30); g.quadraticCurveTo(0, 60 + k*30, 110 - k*10, 40 + k*30); g.stroke(); } g.restore();
  g.fillStyle = half ? '#2a2018' : '#c98e5b'; for (const s2 of [-1, 1]){ g.beginPath(); g.moveTo(s2*150, 40); g.quadraticCurveTo(s2*60, 30, s2*30, 200); g.lineTo(s2*130, 190); g.quadraticCurveTo(s2*170, 120, s2*150, 40); g.fill(); }
  for (const yy of [80, 120, 160]) ell(-40, yy, 6, 6, half ? '#c9a050' : '#f0d070');
  if (!half){ g.fillStyle = '#f0d070'; g.fillRect(56, 80, 46, 4); txt('촌장', 80, 108, 18, '#fff0d0'); } else txt('헌금', 82, 116, 22, '#b02020');
  if (half){
    g.fillStyle = '#07060a'; g.beginPath(); g.moveTo(-6, 20); g.quadraticCurveTo(-46, 90, -10, 170); g.quadraticCurveTo(30, 90, -6, 20); g.fill();
    for (let k = 0; k < 14; k++) coin(-30 + R()*40, 50 + R()*110, 6 + R()*4); for (let k = 0; k < 6; k++) ell(-20 + R()*24, 40 + R()*130, 6 + R()*5, 4 + R()*3, 'rgba(230,226,214,.9)');
    g.strokeStyle = '#d8d0c4'; g.lineWidth = 3; for (let k = 0; k < 9; k++){ const yy = 30 + k*17, w = 18 + Math.sin(k/8*Math.PI)*22; g.beginPath(); g.moveTo(-6 - w, yy); g.lineTo(-6 - w*.5, yy + 6); g.moveTo(-6 + w*.6, yy + 2); g.lineTo(-6 + w, yy - 4); g.stroke(); }
    for (const [ex, ey, r, lk] of [[-122, -40, 17, .4], [124, -10, 15, 2.6], [-104, 70, 13, 1.4], [76, -210, 14, 2], [-86, -200, 12, .8], [136, 80, 12, 3.6], [-146, 24, 10, -.4], [0, -230, 11, 1.6]]) barnEye(ex, ey, r, lk);
    for (let k = 0; k < 10; k++) ell(-150 + R()*300, -200 + R()*380, 10 + R()*16, 6 + R()*10, 'rgba(40,52,40,.35)', R()*3); }
  g.save(); g.translate(-160, 60); g.rotate(.5); ell(0, 30, 28, 62, rg(0, 20, 60, B, Bd)); g.restore();
  g.save(); g.translate(-210, 110); g.rotate(-.2); if (!half){ rr(-50, -66, 100, 130, '#3a5a3a', 6); rr(-42, -58, 84, 114, '#efe6cc', 3); txt('마을', 0, -10, 20, '#2a3a2a'); txt('장부', 0, 18, 20, '#2a3a2a'); }
  else { rr(-80, -60, 160, 110, '#efe6cc', 3); g.fillStyle = 'rgba(80,60,30,.3)'; g.fillRect(-1, -60, 2, 110); for (let i = 0; i < 5; i++){ rr(-70, -46 + i*20, 60, 12, '#fbfaf4', 2); txt('헌금', -40, -36 + i*20, 10, '#b02020'); rr(10, -46 + i*20, 60, 12, '#fbfaf4', 2); txt('헌금', 40, -36 + i*20, 10, '#b02020'); }
    for (let k = 0; k < 7; k++){ g.save(); g.translate(-60 + R()*120, -90 - R()*120); g.rotate((R() - .5)*1.4); rr(-16, -8, 32, 16, '#8aa86a', 2); txt('G', 0, 5, 11, '#f0e090'); g.restore(); } } g.restore();
  g.save(); g.translate(160, 60); g.rotate(-.5); ell(0, 30, 28, 62, rg(0, 20, 60, B, Bd)); g.restore();
  if (!half){ g.strokeStyle = '#7a5a3a'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(230, 230); g.lineTo(220, 80); g.quadraticCurveTo(216, 40, 190, 46); g.stroke(); }
  else { g.strokeStyle = '#3a2a1a'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(210, 120); g.lineTo(280, -60); g.stroke(); g.save(); g.translate(290, -90); g.rotate(.4); rr(-50, -40, 100, 60, '#5a1a1a', 10); rr(-60, 18, 120, 26, '#b02020', 6); txt('헌금', 0, 38, 20, '#ffe0e0'); g.restore(); }
  const hy = -120;
  if (!half){ g.strokeStyle = '#a8d8ff'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -190); g.lineTo(0, -240); g.stroke(); for (const [dx, dy, r] of [[-22, -248, 10], [0, -262, 12], [22, -248, 10], [-36, -232, 7], [36, -232, 7]]) ell(dx, dy, r, r, '#c8e8ff'); }
  else { for (let k = 0; k < 18; k++){ const a = -Math.PI/2 + (R() - .5)*1.4, d2 = 40 + R()*170; ell(Math.cos(a)*d2, -200 + Math.sin(a)*d2, 6 + R()*8, 5 + R()*7, 'rgba(7,6,10,.92)'); } for (let k = 0; k < 26; k++){ const a = -Math.PI/2 + (R() - .5)*1.6, d2 = 60 + R()*160; coin(Math.cos(a)*d2, -200 + Math.sin(a)*d2, 7 + R()*6); } for (let k = 0; k < 6; k++){ g.save(); g.translate((R() - .5)*200, -280 - R()*90); g.rotate((R() - .5)*1.4); rr(-18, -9, 36, 18, '#8aa86a', 2); txt('G', 0, 5, 12, '#f0e090'); g.restore(); } }
  for (const s2 of [-1, 1]){ g.fillStyle = half ? '#c8c0b0' : '#fffaf2'; g.beginPath(); g.ellipse(s2*50, hy - 44, 30, 12, s2*-.25, 0, 7); g.fill(); }
  for (const s2 of [-1, 1]){ const ex = s2*50, ey = hy;
    if (!half){ g.strokeStyle = '#1a2030'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(ex, ey + 6, 12, Math.PI*1.15, Math.PI*1.85); g.stroke(); }
    else { ell(ex, ey, 24, 24, '#e8e0d0'); g.strokeStyle = 'rgba(170,30,30,.8)'; g.lineWidth = 1.4; for (let k = 0; k < 8; k++){ const a = k/8*6.28; g.beginPath(); g.moveTo(ex + Math.cos(a)*23, ey + Math.sin(a)*23); g.lineTo(ex + Math.cos(a + .2)*15, ey + Math.sin(a + .2)*15); g.stroke(); } coin(ex, ey, 13); drip(ex - 8, ey + 22, 60 + s2*14, 6); const gl = g.createRadialGradient(ex, ey, 2, ex, ey, 40); gl.addColorStop(0, 'rgba(255,220,90,.55)'); gl.addColorStop(1, 'rgba(255,200,60,0)'); g.fillStyle = gl; g.fillRect(ex - 40, ey - 40, 80, 80); }
    g.strokeStyle = '#c9a050'; g.lineWidth = 6; g.beginPath(); g.arc(ex, ey, 32, 0, 7); g.stroke(); g.fillStyle = 'rgba(220,240,255,.18)'; g.beginPath(); g.arc(ex, ey, 30, 0, 7); g.fill(); }
  g.strokeStyle = '#c9a050'; g.lineWidth = 5; g.beginPath(); g.moveTo(-18, hy - 2); g.quadraticCurveTo(0, hy - 10, 18, hy - 2); g.stroke();
  if (half){ g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2; for (const ex of [-50, 50]){ g.beginPath(); g.moveTo(ex - 24, hy - 18); g.lineTo(ex - 4, hy + 2); g.lineTo(ex - 18, hy + 22); g.moveTo(ex - 4, hy + 2); g.lineTo(ex + 22, hy - 6); g.stroke(); } }
  if (!half){ g.strokeStyle = '#1a2030'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-34, hy + 48); g.quadraticCurveTo(0, hy + 66, 34, hy + 48); g.stroke(); ell(-90, hy + 30, 18, 10, 'rgba(255,140,150,.45)'); ell(90, hy + 30, 18, 10, 'rgba(255,140,150,.45)'); }
  else {
    g.fillStyle = '#050402'; g.beginPath(); g.moveTo(-130, hy + 36); g.quadraticCurveTo(0, hy + 200, 130, hy + 36); g.quadraticCurveTo(0, hy + 70, -130, hy + 36); g.fill();
    for (let k = 0; k < 15; k++){ const t2 = (k + .5)/15, bx = -118 + t2*236, top = hy + 44 + Math.sin(t2*Math.PI)*24, bot = hy + 40 + Math.sin(t2*Math.PI)*148; g.fillStyle = lg(bx - 4, 0, bx + 4, 0, '#3a3228', '#8a7e66', '#3a3228'); g.fillRect(bx - 3.6, top, 7.2, bot - top); }
    for (const [hx, a2, sc] of [[-74, -.5, 1.5], [-28, .2, 1.7], [22, -.15, 1.8], [70, .45, 1.55]]) tinyHand(hx, hy + 96 + Math.abs(hx)*.1, Math.PI + a2, sc);
    for (const [dx, len] of [[-110, 70], [-60, 110], [70, 96], [118, 60]]) drip(dx, hy + 40 + Math.sin((dx + 130)/260*Math.PI)*120, len, 7);
    envelope(-30, hy + 150, .7, .4, ''); for (let k = 0; k < 6; k++) coin(-80 + R()*160, hy + 160 + R()*20, 6); }
}

// ===== 캐시: 고래 그림 (평소 · 변신 · 변신+발판 없음) =====
// 그림 범위: x -470 ~ 470, y -580 ~ 380 (단위) · 게임에선 SC 배로 그려요
export const SC = .4, BX0 = -470, BY0 = -580, BW = 940, BH = 960;
const cache = {};
const fontOk = () => { try { return document.fonts.check('bold 20px "Dongle"'); } catch(e){ return true; } };
function mk(w, h){ const cv = document.createElement('canvas'); cv.width = Math.ceil(w); cv.height = Math.ceil(h); return cv; }
export function bossArt(half, pod = true){
  const key = (half ? 'h' : 'n') + (pod ? 'p' : ''), ok = fontOk(), cur = cache[key];
  if (cur && (cur.ok || !ok)) return cur.cv;
  const k = SC*2, cv = mk(BW*k, BH*k); g = cv.getContext('2d'); g.scale(k, k); g.translate(-BX0, -BY0); whale(half, pod); g = null;
  cache[key] = {cv, ok}; return cv;
}
// 두건 쓴 신도 그림자 (촛불) · 눈 감음/뜸
export function cultist(open, dark){
  const key = 'c' + (open ? 1 : 0) + (dark ? 1 : 0); if (cache[key]) return cache[key].cv;
  const k = 3, cv = mk(60*k, 100*k); g = cv.getContext('2d'); g.scale(k, k); g.translate(30, 80);
  if (!dark){ const gl = g.createRadialGradient(10, -30, 2, 10, -30, 40); gl.addColorStop(0, 'rgba(255,190,90,.4)'); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(-30, -80, 60, 100); }
  g.fillStyle = dark ? '#07060a' : '#2a2236'; g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(-16, -40, -6, -54); g.quadraticCurveTo(0, -62, 6, -54); g.quadraticCurveTo(16, -40, 14, 0); g.closePath(); g.fill();
  if (!dark){ g.strokeStyle = 'rgba(220,190,140,.55)'; g.lineWidth = 1.5; g.stroke(); ell(0, 0, 14, 4, '#0a0a10'); }
  if (open){ ell(-3.5, -44, 2, 1.4, '#ffdd88'); ell(3.5, -44, 2, 1.4, '#ffdd88'); } else if (dark) ell(4, -44, 5, 6.5, '#121018'); else { ell(-3, -46, 1.8, 1.2, 'rgba(255,220,140,.9)'); ell(3, -46, 1.8, 1.2, 'rgba(255,220,140,.9)'); }
  g.fillStyle = '#e8e0c8'; g.fillRect(9, -30, 3, 12); ell(10.5, -33, 2.5, 4, 'rgba(255,210,90,.95)');
  g = null; cache[key] = {cv}; return cv;
}
export const CULT = {w:60, h:100, ox:30, oy:80};
// 의자 · 장부 쪽 · 배표
export function chair(){ if (cache.ch) return cache.ch.cv; const k = 2, cv = mk(70*k, 90*k); g = cv.getContext('2d'); g.scale(k, k); g.translate(35, 82);
  ell(0, 4, 32, 9, 'rgba(0,0,0,.4)'); g.fillStyle = '#6a4a2a'; g.fillRect(-26, -40, 52, 10); g.fillRect(-26, -76, 8, 76); g.fillRect(18, -76, 8, 76); g.fillRect(-26, -10, 8, 16); g.fillRect(18, -10, 8, 16); g.fillStyle = '#8a6a3a'; g.fillRect(-30, -14, 60, 8); g.fillStyle = '#c8a050'; g.beginPath(); g.ellipse(0, -62, 10, 5, 0, 0, 7); g.fill();
  g.strokeStyle = '#3a2410'; g.lineWidth = 2; g.beginPath(); g.moveTo(-20, -56); g.lineTo(20, -56); g.stroke();
  g = null; cache.ch = {cv}; return cv; }
export const CHAIR = {w:70, h:90, ox:35, oy:82};
export function ticket(){ if (cache.tk && (cache.tk.ok || !fontOk())) return cache.tk.cv; const ok = fontOk(), k = 2, cv = mk(130*k, 56*k); g = cv.getContext('2d'); g.scale(k, k); g.translate(65, 28);
  g.fillStyle = '#f4e8c8'; g.fillRect(-60, -24, 120, 48); g.strokeStyle = '#8a6a3a'; g.setLineDash([4, 3]); g.strokeRect(-56, -20, 112, 40); g.setLineDash([]);
  txt('구원의 섬 · 1 매', 0, -2, 13, '#4a2a10'); txt('207', 0, 16, 12, '#b02020');
  g = null; cache.tk = {cv, ok}; return cv; }
// 바다 (⑦): 방 바닥 전체
export function sea(W, H){ if (cache.sea) return cache.sea.cv; const cv = mk(W/2, H/2); g = cv.getContext('2d'); g.scale(.5, .5);
  g.fillStyle = lg(0, 240, 0, H, '#0c3050', '#041420'); g.fillRect(0, 0, W, H);
  sd = 9; for (let i = 0; i < 70; i++){ const x = R()*W, y = 250 + R()*(H - 250); ell(x, y, 20 + R()*50, 3 + R()*4, 'rgba(120,190,230,.10)'); }
  g = null; cache.sea = {cv}; return cv; }
