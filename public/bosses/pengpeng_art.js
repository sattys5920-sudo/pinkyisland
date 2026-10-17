// 펭펭??? (팽해준) 보스 그림 · 처음 한 번 캔버스에 그려 두고 drawImage 해요
// 평소: 노란 비옷 펭귄 등대지기 · 머리 위 등대 램프 · 신호 랜턴 · 등대 받침
// 50% 뒤: 램프가 깨져 붉은 빛 · 해적 코트와 금화 · 안대 · 금이빨 · 갈고리
let g = null, sd = 53;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
const rr = (x, y, w, h, f) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, 4); else g.rect(x, y, w, h); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col) => { g.save(); g.font = `bold ${s}px "Dongle",sans-serif`; g.textAlign = 'center'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
export function coin(c, x, y, r){ const o = g; g = c; ell(x, y, r, r*.8, lg(x - r, y - r, x + r, y + r, '#fff0a0', '#e0a820', '#8a5a10')); g.strokeStyle = 'rgba(90,60,10,.6)'; g.lineWidth = 1; g.beginPath(); g.ellipse(x, y, r*.65, r*.5, 0, 0, 7); g.stroke(); g = o; }
const coinG = (x, y, r) => coin(g, x, y, r);
function base(half){ g.save(); g.scale(1, .22); ell(0, 1650, 240, 240, 'rgba(0,0,0,.6)'); g.restore();
  for (let i = 0; i < 2; i++){ const y0 = 300 + i*30; g.fillStyle = i%2 ? '#f0ece4' : '#c82830'; g.fillRect(-170, y0, 340, 30); } ell(0, 360, 170, 36, '#8a2028'); ell(0, 300, 170, 36, lg(-170, 0, 170, 0, '#6a6e78', '#c8ccd4', '#5a5e68'));
  if (half) for (let i = 0; i < 14; i++) coinG(-150 + R()*300, 290 + R()*30, 9 + R()*5); }
function lamp(x, y, s, broken){ g.save(); g.translate(x, y); g.scale(s, s);
  rr(-44, 40, 88, 14, '#2a2e38');
  if (!broken){ const q = g.createRadialGradient(0, 0, 4, 0, 0, 60); q.addColorStop(0, '#fffbe0'); q.addColorStop(.5, '#ffd870'); q.addColorStop(1, 'rgba(255,200,90,.2)'); g.fillStyle = q; g.beginPath(); g.moveTo(-40, 40); g.lineTo(-40, -10); g.quadraticCurveTo(-40, -50, 0, -54); g.quadraticCurveTo(40, -50, 40, -10); g.lineTo(40, 40); g.closePath(); g.fill();
    g.strokeStyle = '#2a2e38'; g.lineWidth = 4; for (const xx of [-20, 0, 20]){ g.beginPath(); g.moveTo(xx, 40); g.lineTo(xx, -48 + Math.abs(xx)*.3); g.stroke(); } }
  else { g.fillStyle = 'rgba(200,40,40,.85)'; g.beginPath(); g.arc(0, 10, 18, 0, 7); g.fill(); const q = g.createRadialGradient(0, 10, 2, 0, 10, 90); q.addColorStop(0, 'rgba(255,60,60,.6)'); q.addColorStop(1, 'rgba(255,0,0,0)'); g.fillStyle = q; g.fillRect(-90, -80, 180, 180);
    g.strokeStyle = 'rgba(220,230,255,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-40, 40); g.lineTo(-40, 0); g.lineTo(-30, -14); g.lineTo(-36, -30); g.moveTo(40, 40); g.lineTo(40, -4); g.lineTo(26, -20); g.moveTo(10, 40); g.lineTo(6, -6); g.stroke();
    g.fillStyle = 'rgba(220,230,255,.6)'; for (let k = 0; k < 7; k++){ g.save(); g.translate(-60 + R()*120, 50 + R()*20); g.rotate(R()*6); g.beginPath(); g.moveTo(0, 0); g.lineTo(10, 3); g.lineTo(3, 9); g.fill(); g.restore(); } }
  g.restore(); }
function lantern(on){ g.strokeStyle = '#2a2a30'; g.lineWidth = 3; g.beginPath(); g.arc(0, -36, 8, Math.PI, 0); g.stroke(); rr(-16, -30, 32, 6, '#3a3a40'); rr(-14, -24, 28, 34, on ? 'rgba(255,220,120,.98)' : 'rgba(70,70,80,.9)'); g.strokeStyle = '#2a2a30'; g.lineWidth = 2; g.strokeRect(-14, -24, 28, 34); rr(-16, 10, 32, 6, '#3a3a40');
  if (on){ const q = g.createRadialGradient(0, -7, 2, 0, -7, 70); q.addColorStop(0, 'rgba(255,220,120,.5)'); q.addColorStop(1, 'rgba(255,220,120,0)'); g.fillStyle = q; g.fillRect(-70, -77, 140, 140); } }
function hook(x, y, s){ g.save(); g.translate(x, y); g.scale(s, s); rr(-14, -20, 28, 26, '#3a2a20'); g.strokeStyle = lg(-20, 0, 20, 0, '#e8e8f0', '#8a8a98'); g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 6); g.lineTo(0, 30); g.arc(-16, 30, 16, 0, Math.PI*.9); g.stroke(); g.restore(); }
function penguin(half){ sd = 53;
  base(half);
  if (half){ const au = g.createRadialGradient(0, -60, 30, 0, -60, 360); au.addColorStop(0, 'rgba(255,40,40,.35)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-380, -460, 760, 800); }
  for (const s2 of [-1, 1]){ rr(s2*60 - 34, 240, 68, 64, half ? '#2a1a12' : '#e8c020'); ell(s2*60, 300, 40, 12, half ? '#1a0e08' : '#a88010'); }
  ell(0, 80, 150, 190, rg(0, 40, 190, '#4a5068', '#14161e')); ell(0, 110, 100, 150, rg(-20, 80, 150, '#ffffff', '#c8ccd8'));
  if (!half){ g.fillStyle = lg(-160, 0, 160, 0, '#f0c820', '#ffe060', '#c89810'); g.beginPath(); g.moveTo(-90, -70); g.quadraticCurveTo(-170, 60, -160, 250); g.lineTo(-70, 250); g.quadraticCurveTo(-90, 100, -40, -40); g.closePath(); g.fill(); g.beginPath(); g.moveTo(90, -70); g.quadraticCurveTo(170, 60, 160, 250); g.lineTo(70, 250); g.quadraticCurveTo(90, 100, 40, -40); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(120,90,0,.5)'; g.lineWidth = 2; for (let k = 0; k < 5; k++){ g.beginPath(); g.moveTo(-150 + k*6, 40 + k*40); g.lineTo(-80, 50 + k*40); g.stroke(); g.beginPath(); g.moveTo(150 - k*6, 40 + k*40); g.lineTo(80, 50 + k*40); g.stroke(); } for (const yy of [20, 90, 160]) ell(-60, yy, 7, 7, '#a07800');
    rr(-56, 170, 112, 30, '#f4f0e4'); txt('등대지기 펭펭', 0, 194, 26, '#2a3a5a'); }
  else { g.fillStyle = lg(-170, 0, 170, 0, '#4a0c14', '#8a1a24', '#3a0810'); g.beginPath(); g.moveTo(-90, -70); g.quadraticCurveTo(-180, 60, -170, 250); g.lineTo(-70, 250); g.quadraticCurveTo(-90, 100, -40, -40); g.closePath(); g.fill(); g.beginPath(); g.moveTo(90, -70); g.quadraticCurveTo(180, 60, 170, 250); g.lineTo(70, 250); g.quadraticCurveTo(90, 100, 40, -40); g.closePath(); g.fill();
    g.strokeStyle = '#e8c040'; g.lineWidth = 5; g.beginPath(); g.moveTo(-90, -70); g.quadraticCurveTo(-180, 60, -170, 250); g.moveTo(90, -70); g.quadraticCurveTo(180, 60, 170, 250); g.stroke(); for (const yy of [10, 70, 130, 190]){ coinG(-56, yy, 9); coinG(56, yy, 9); }
    g.fillStyle = '#e8c020'; for (const [px, py, r2] of [[-150, 40, 1], [140, 120, -1]]){ g.save(); g.translate(px, py); g.rotate(r2*.3); g.beginPath(); g.moveTo(-20, -30); g.lineTo(20, -24); g.lineTo(14, 10); g.lineTo(4, 2); g.lineTo(-6, 22); g.lineTo(-14, 4); g.closePath(); g.fill(); g.restore(); }
    rr(-110, 200, 220, 26, '#1a1210'); rr(-18, 196, 36, 34, '#e8c040'); skull(0, 213, 11, '#1a1210'); for (let k = 0; k < 10; k++) coinG(-40 + R()*80, 236 + k*6, 8); }
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*140, -10); g.rotate(s2*-.45); ell(0, 70, 30, 90, rg(0, 60, 90, '#3a4058', '#10121a')); ell(0, 50, 34, 70, half ? 'rgba(120,20,30,.95)' : 'rgba(240,200,32,.95)'); g.restore(); }
  if (half) hook(220, 130, 1.6); else { g.strokeStyle = '#6a4a2a'; g.lineWidth = 9; g.beginPath(); g.moveTo(210, 100); g.lineTo(250, 300); g.stroke(); }
  ell(0, -140, 112, 104, rg(0, -160, 112, '#4a5068', '#14161e')); ell(-34, -120, 44, 52, '#f8f8fc'); ell(34, -120, 44, 52, '#f8f8fc');
  if (!half){ for (const s2 of [-1, 1]){ ell(s2*34, -126, 12, 14, '#14161e'); ell(s2*34 - 4, -131, 4, 4, '#fff'); } ell(-56, -96, 13, 7, 'rgba(255,140,160,.6)'); ell(56, -96, 13, 7, 'rgba(255,140,160,.6)');
    g.fillStyle = '#f0a020'; g.beginPath(); g.moveTo(-26, -96); g.quadraticCurveTo(0, -70, 26, -96); g.quadraticCurveTo(0, -88, -26, -96); g.fill(); }
  else { g.fillStyle = '#0a0a0a'; g.beginPath(); g.ellipse(-34, -126, 26, 22, -.2, 0, 7); g.fill(); g.strokeStyle = '#0a0a0a'; g.lineWidth = 5; g.beginPath(); g.moveTo(-100, -170); g.lineTo(90, -110); g.stroke();
    ell(34, -126, 14, 10, '#f4ecd8'); ell(34, -126, 7, 7, '#7a1010'); ell(34, -126, 3, 3, '#000'); g.strokeStyle = '#14161e'; g.lineWidth = 4; g.beginPath(); g.moveTo(16, -146); g.lineTo(54, -138); g.stroke();
    g.fillStyle = '#d08010'; g.beginPath(); g.moveTo(-34, -100); g.lineTo(34, -100); g.lineTo(26, -72); g.lineTo(-26, -72); g.closePath(); g.fill(); g.fillStyle = '#3a0a0a'; g.fillRect(-26, -90, 52, 10); g.fillStyle = '#f0f0e0'; for (let k = 0; k < 5; k++) g.fillRect(-24 + k*10, -90, 8, 5); g.fillStyle = '#ffd030'; g.fillRect(-4, -90, 8, 6);
    g.strokeStyle = 'rgba(200,40,40,.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(60, -170); g.lineTo(80, -110); g.stroke(); }
  if (half){ g.fillStyle = '#14100c'; g.beginPath(); g.moveTo(-150, -210); g.quadraticCurveTo(0, -260, 150, -210); g.quadraticCurveTo(110, -250, 70, -290); g.quadraticCurveTo(0, -270, -70, -290); g.quadraticCurveTo(-110, -250, -150, -210); g.fill(); g.strokeStyle = '#e8c040'; g.lineWidth = 4; g.beginPath(); g.moveTo(-150, -210); g.quadraticCurveTo(0, -260, 150, -210); g.stroke(); skull(0, -240, 13, '#f0f0e0'); }
  lamp(0, half ? -300 : -270, 1.1, half); }
// 해골 (글꼴에 없을 수 있어서 직접 그려요)
function skull(x, y, r, col){ g.save(); g.fillStyle = col; g.beginPath(); g.arc(x, y - r*.15, r*.8, 0, 7); g.fill(); g.fillRect(x - r*.45, y + r*.3, r*.9, r*.45); g.strokeStyle = col; g.lineWidth = r*.28; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r, y + r*.6); g.lineTo(x + r, y + r*1.1); g.moveTo(x + r, y + r*.6); g.lineTo(x - r, y + r*1.1); g.stroke();
  g.fillStyle = col === '#1a1210' ? '#e8c040' : '#14100c'; g.beginPath(); g.arc(x - r*.3, y - r*.2, r*.2, 0, 7); g.arc(x + r*.3, y - r*.2, r*.2, 0, 7); g.fill(); g.restore(); }

// 그림 좌표: 발(받침 바닥) = (0, 370) · 머리 위 램프 가운데 = (0, -270) (깨지면 -300)
export const FOOT = 370, BOX = [-400, -480, 800, 880];
const cache = {}; let fontOk = false;
function mk(w, h){ const cv = document.createElement('canvas'); cv.width = Math.ceil(w); cv.height = Math.ceil(h); return cv; }
// K: 그림 1 단위 → 캐시 픽셀
export function bodyArt(half, K){
  const ok = !!(document.fonts && document.fonts.check && document.fonts.check('bold 20px "Dongle"'));
  if (ok && !fontOk){ fontOk = true; delete cache.b0; } // 글꼴이 늦게 오면 한 번 다시 그려요
  const key = 'b' + (half ? 1 : 0); if (cache[key]) return cache[key];
  const [x0, y0, w, h] = BOX, cv = mk(w*K, h*K); g = cv.getContext('2d'); g.scale(K, K); g.translate(-x0, -y0); penguin(half); g = null;
  return cache[key] = cv; }
// 신호 랜턴 (켜짐 · 꺼짐) · 그림 좌표 (-230, 120) 에 1.6 배
export function lanternArt(on, K){ const key = 'l' + (on ? 1 : 0); if (cache[key]) return cache[key];
  const s = 1.6, cv = mk(160*s*K, 160*s*K); g = cv.getContext('2d'); g.scale(K*s, K*s); g.translate(80, 80); lantern(on); g = null; return cache[key] = cv; }
// 꼬마 해적 펭귄 (졸개)
export function pirateArt(K){ if (cache.p) return cache.p; const cv = mk(64*K, 70*K); g = cv.getContext('2d'); g.scale(K, K); g.translate(32, 60);
  ell(0, 2, 16, 5, 'rgba(0,0,0,.4)'); ell(0, -18, 15, 18, '#1a1a24'); ell(0, -14, 10, 12, '#f0f0f4'); g.fillStyle = '#1a1a1e'; g.beginPath(); g.moveTo(-16, -32); g.lineTo(16, -32); g.lineTo(0, -46); g.closePath(); g.fill(); ell(-4, -24, 3, 3, '#000'); ell(5, -24, 4, 3, '#0a0a0a');
  g.fillStyle = '#c81828'; g.fillRect(-12, -36, 24, 4); g.fillStyle = '#d8d8e0'; g.fillRect(12, -24, 14, 3); g.fillStyle = '#f0a020'; g.beginPath(); g.moveTo(-3, -19); g.lineTo(3, -19); g.lineTo(0, -14); g.fill(); g = null; return cache.p = cv; }
// 검은 돛 깃발 조각
export function flagPiece(c, x, y, rot, s = 1){ c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = '#121216'; c.beginPath(); c.moveTo(-18, -14); c.lineTo(20, -10); c.lineTo(14, 4); c.lineTo(18, 14); c.lineTo(-16, 12); c.closePath(); c.fill(); c.strokeStyle = 'rgba(200,40,60,.8)'; c.lineWidth = 1.5; c.stroke(); c.fillStyle = '#e8e8e8'; c.beginPath(); c.arc(0, 0, 4, 0, 7); c.fill(); c.restore(); }
