// 몽실??? (문세실) 보스 그림: 이름표투성이 털실 양 · 실패 받침 · 큰 가위와 바늘 (시안 mhelpers 를 그대로 옮겼어요)
// 무거운 그림은 처음 한 번 캔버스에 그려 두고 drawImage 해요. 'front' 앞모습 · 'back' 등 돌린 모습 · 'half' 털실이 풀린 문세실
let g = null, sd = 41;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
export const NAMES = ['소미', '하양', '구름', '보들', '포근', '단비', '모리', '송이', '몽실', '꼬마', '솜이', '나나'];
const FONT = s => `bold ${s}px "Dongle",sans-serif`;

function pin(x, y, rot){ g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = '#d8d8e0'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-9, 0); g.lineTo(9, 0); g.moveTo(-9, -3); g.lineTo(7, -3); g.stroke(); g.fillStyle = '#e8e8f0'; g.beginPath(); g.arc(9, -1.5, 2.6, 0, 7); g.fill(); g.restore(); }
function tagC(x, y, t, rot, s = 1, real){ g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.font = FONT(19); const w = g.measureText(t).width + 16; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-w/2 + 2, -9, w, 20); g.fillStyle = real ? '#fff4c8' : '#f8eef0'; g.beginPath(); g.roundRect(-w/2, -11, w, 20, 4); g.fill(); g.strokeStyle = real ? '#c8a040' : '#d07090'; g.lineWidth = 1.8; g.stroke(); g.fillStyle = real ? '#5a3a10' : '#6a2a40'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 0); g.restore(); pin(x - 4, y - 12, rot); }
function puff(x, y, r, col = '#f6f0ea'){ ell(x, y, r, r*.92, rg(x, y, r, '#ffffff', col)); g.strokeStyle = 'rgba(160,140,150,.35)'; g.lineWidth = 1.2; for (let k = 0; k < 3; k++){ g.beginPath(); g.arc(x + (R() - .5)*r*.6, y + (R() - .5)*r*.6, r*(.3 + R()*.3), R()*6, R()*6 + 2.4); g.stroke(); } }
function spool(){ g.save(); g.save(); g.scale(1, .22); ell(0, 1700, 250, 250, 'rgba(0,0,0,.6)'); g.restore();
  ell(0, 370, 190, 40, lg(-190, 0, 190, 0, '#6a4430', '#c89870', '#5a3420')); g.fillStyle = lg(-150, 0, 150, 0, '#a02848', '#f070a0', '#8a1838'); g.fillRect(-150, 310, 300, 60); g.strokeStyle = 'rgba(80,10,30,.4)'; g.lineWidth = 1.2; for (let i = 0; i < 14; i++){ g.beginPath(); g.moveTo(-150, 314 + i*4); g.lineTo(150, 316 + i*4); g.stroke(); } ell(0, 310, 190, 40, lg(-190, 0, 190, 0, '#7a5038', '#e0b080', '#6a4028')); ell(0, 306, 40, 9, '#2a1a10'); g.restore(); }
function scissorsBig(x, y, rot, open){ g.save(); g.translate(x, y); g.rotate(rot); for (const s2 of [-1, 1]){ g.save(); g.rotate(s2*open); g.fillStyle = lg(0, -8, 0, 8, '#f0f0f8', '#8a8a98'); g.beginPath(); g.moveTo(0, -5); g.lineTo(150, -1*s2); g.lineTo(0, 7); g.closePath(); g.fill(); g.strokeStyle = '#c8285a'; g.lineWidth = 9; g.beginPath(); g.ellipse(-30, s2*14, 22, 14, s2*.3, 0, 7); g.stroke(); g.restore(); } ell(0, 0, 5, 5, '#5a5a68'); g.restore(); }
function needle(x, y, rot){ g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = lg(0, -4, 0, 4, '#ffffff', '#9a9aa8'); g.beginPath(); g.moveTo(-90, -4); g.lineTo(80, 0); g.lineTo(-90, 4); g.closePath(); g.fill(); g.fillStyle = '#1a1018'; g.beginPath(); g.ellipse(-78, 0, 7, 2, 0, 0, 7); g.fill(); g.restore(); }
function sheepFace(cx, cy, s, torn){ g.save(); g.translate(cx, cy); g.scale(s, s);
  const face = () => { g.beginPath(); g.ellipse(0, 0, 70, 82, 0, 0, 7); };
  if (torn){ // 안쪽 사람 얼굴: 창백 · 퀭한 눈
    ell(0, 0, 66, 78, rg(0, 0, 78, '#e4d0c4', '#8a6a60')); ell(-24, -10, 15, 9, '#2a1418'); ell(-24, -10, 10, 7, '#f0e4dc'); ell(-26, -10, 5, 5, '#3a2a28'); ell(-27, -11, 2, 2, '#000'); ell(-29, -13, 1.2, 1.2, '#fff');
    g.strokeStyle = 'rgba(80,40,50,.6)'; g.lineWidth = 2; g.beginPath(); g.arc(-24, -2, 14, .3, 2.8); g.stroke(); g.strokeStyle = '#6a2a30'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-26, 36); g.quadraticCurveTo(-6, 30, 10, 38); g.stroke(); g.fillStyle = 'rgba(40,10,20,.25)'; g.beginPath(); g.moveTo(-6, 0); g.lineTo(-12, 22); g.lineTo(0, 24); g.fill(); }
  g.save(); if (torn){ g.beginPath(); g.moveTo(-10, -90); g.lineTo(80, -90); g.lineTo(80, 90); g.lineTo(-40, 90); g.lineTo(-30, 60); g.lineTo(6, 40); g.lineTo(-4, 10); g.lineTo(10, -20); g.lineTo(-4, -50); g.closePath(); g.clip(); g.translate(30, 10); g.rotate(.22); g.translate(-30, -10); }
  face(); g.fillStyle = rg(0, 0, 82, '#fffaf2', '#e0d4cc'); g.fill(); g.strokeStyle = '#c87090'; g.lineWidth = 3; g.setLineDash([7, 5]); face(); g.stroke(); g.setLineDash([]);
  for (const s2 of [-1, 1]){ ell(s2*28, -10, 13, 13, '#2a1a20'); ell(s2*28, -10, 9, 9, '#4a3a40'); for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) ell(s2*28 + dx, -10 + dy, 1.4, 1.4, '#c8b8c0'); g.strokeStyle = '#c8b8c0'; g.lineWidth = 1; g.beginPath(); g.moveTo(s2*28 - 3, -13); g.lineTo(s2*28 + 3, -7); g.moveTo(s2*28 + 3, -13); g.lineTo(s2*28 - 3, -7); g.stroke(); }
  ell(-44, 16, 12, 6, 'rgba(240,140,170,.6)'); ell(44, 16, 12, 6, 'rgba(240,140,170,.6)');
  g.strokeStyle = '#8a2040'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-26, 30); g.quadraticCurveTo(0, 50, 26, 30); g.stroke(); for (let i = 0; i < 7; i++){ const x = -22 + i*7.3; g.beginPath(); g.moveTo(x, 34 + Math.sin(i/6*Math.PI)*8 - 5); g.lineTo(x, 34 + Math.sin(i/6*Math.PI)*8 + 5); g.stroke(); }
  ell(0, 10, 10, 7, '#e8a8b8'); g.restore();
  if (torn){ g.strokeStyle = '#c87090'; g.lineWidth = 2; for (let k = 0; k < 6; k++){ g.beginPath(); g.moveTo(-4 + (R() - .5)*20, -50 + k*20); g.quadraticCurveTo(-30 - R()*30, -40 + k*22, -40 - R()*40, -20 + k*26 + R()*20); g.stroke(); } }
  g.restore(); }
// 보스 한 장 (단위 좌표 · 실패 바닥 가운데가 (0, 360))
function boss(v){ sd = 41; const half = v === 'half', back = v === 'back';
  spool();
  if (half){ const au = g.createRadialGradient(0, -60, 30, 0, -60, 330); au.addColorStop(0, 'rgba(230,40,90,.4)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-330, -390, 660, 720); }
  for (const s2 of [-1, 1]){ g.fillStyle = lg(0, 200, 0, 310, '#3a2a30', '#140a10'); g.beginPath(); g.roundRect(s2*50 - 18, 190, 36, 120, 16); g.fill(); ell(s2*50, 306, 26, 10, '#1a0e12'); }
  if (!half){
    const P = []; for (let i = 0; i < 46; i++){ const a = R()*6.283, rr2 = Math.sqrt(R()); P.push([Math.cos(a)*rr2*140, 60 + Math.sin(a)*rr2*150, 34 + R()*22]); } P.sort((a, b) => a[1] - b[1]); for (const [px, py, pr] of P) puff(px, py, pr);
    for (let i = 0; i < 12; i++){ const a = i/12*6.283 + .3, rr2 = 60 + (i%3)*35; tagC(Math.cos(a)*rr2, 60 + Math.sin(a)*rr2*.95, NAMES[i], (R() - .5)*.6, 1); }
    if (!back){ g.save(); g.strokeStyle = '#f0d040'; g.lineWidth = 16; g.beginPath(); g.ellipse(0, -66, 80, 22, 0, 0, Math.PI); g.stroke(); g.fillStyle = '#3a2a10'; for (let i = 0; i < 14; i++){ const a = i/13*Math.PI, xx = Math.cos(a)*80, yy = -66 + Math.sin(a)*22; g.fillRect(xx - 1, yy - 6, 2, i%2 ? 5 : 9); } g.fillStyle = '#f0d040'; g.beginPath(); g.moveTo(40, -48); g.lineTo(56, 40); g.lineTo(72, 38); g.lineTo(60, -50); g.fill(); g.restore(); }
  } else {
    g.fillStyle = lg(-130, -60, 130, 200, '#f0a8c0', '#7a3050'); g.beginPath(); g.moveTo(-60, -60); g.quadraticCurveTo(-70, 40, -150, 200); g.lineTo(150, 200); g.quadraticCurveTo(70, 40, 60, -60); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.2)'; for (let i = 0; i < 9; i++){ g.beginPath(); g.arc(-136 + i*34, 200, 16, Math.PI, 0); g.fill(); }
    g.fillStyle = '#0a0408'; g.beginPath(); g.moveTo(-40, -50); g.quadraticCurveTo(-60, 60, -90, 170); g.lineTo(90, 170); g.quadraticCurveTo(60, 60, 40, -50); g.closePath(); g.fill();
    g.fillStyle = '#6a5a50'; g.fillRect(-4, -50, 8, 230); g.fillRect(-40, 40, 80, 6);
    g.strokeStyle = 'rgba(255,120,160,.8)'; g.lineWidth = 2; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(-60, -60); g.quadraticCurveTo(-70, 40, -150, 200); g.moveTo(60, -60); g.quadraticCurveTo(70, 40, 150, 200); g.stroke(); g.setLineDash([]);
    for (const [px, py, pr] of [[-70, -40, 30], [80, -30, 26], [-110, 120, 24], [120, 150, 22]]) puff(px, py, pr, '#d8ccd0');
    for (let i = 0; i < 11; i++) tagC(-200 + i*40 + (R() - .5)*16, 330 + R()*40, NAMES[i], (R() - .5)*1.8, .9);
    tagC(0, 40, '문세실', -.08, 1.6, true);
  }
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*(half ? 64 : 130), -40); g.rotate(s2*-.5); if (half){ g.strokeStyle = '#6a5a50'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 140); g.stroke(); } else { for (let k = 0; k < 4; k++) puff(0, 20 + k*32, 26); } ell(0, 150, 20, 18, rg(0, 150, 20, '#3a2a30', '#140a10')); g.restore(); }
  scissorsBig(-210, 90, half ? -2.2 : -1.9, half ? .35 : .12); needle(220, 80, half ? -.9 : -.6);
  g.strokeStyle = '#e86090'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(155, 135); g.bezierCurveTo(240, 200, 120, 260, 220, 330); g.stroke();
  if (back){ // 등 돌린 모습: 머리 뒤 털 뭉치 · 리본 뒷면
    for (const s2 of [-1, 1]){ ell(s2*100, -150, 42, 16, rg(s2*100, -150, 42, '#fffaf2', '#c8bcb4'), s2*.4); }
    for (let i = 0; i < 14; i++){ const a = i/14*6.283, rr = i % 2 ? 44 : 22; puff(Math.cos(a)*rr, -146 + Math.sin(a)*rr*1.1, 34); } puff(0, -150, 36);
  } else {
    if (!half) for (let i = 0; i < 9; i++){ const a = Math.PI*(1.05 + i*.11); puff(Math.cos(a)*86, -150 + Math.sin(a)*90, 30); }
    else for (let i = 0; i < 4; i++){ const a = Math.PI*(1.1 + i*.25); puff(Math.cos(a)*86, -150 + Math.sin(a)*90, 24, '#c8bcc0'); }
    for (const s2 of [-1, 1]){ ell(s2*100, -150, 42, 16, rg(s2*100, -150, 42, '#fffaf2', '#c8bcb4'), s2*.4); ell(s2*100, -150, 28, 8, '#f0b0c0', s2*.4); }
    sheepFace(0, -146, 1, half);
  }
  g.save(); g.translate(back ? -64 : 64, -230); g.rotate(back ? -.25 : .25); for (const s2 of half ? [1] : [-1, 1]){ g.fillStyle = lg(0, -30, 0, 30, '#ff8ab0', '#c03060'); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(s2*30, -40, s2*60, -18); g.quadraticCurveTo(s2*66, 0, s2*60, 18); g.quadraticCurveTo(s2*30, 40, 0, 0); g.fill(); } ell(0, 0, 12, 14, '#e05080'); if (half){ g.strokeStyle = '#e05080'; g.lineWidth = 2; for (let k = 0; k < 4; k++){ g.beginPath(); g.moveTo(-6, k*6 - 8); g.lineTo(-30 - R()*20, k*10 - 4 + R()*10); g.stroke(); } } g.restore();
}

// ===== 캐시 =====
export const FOOT_U = 360;                   // 실패 바닥 (발) 의 단위 y
const BX0 = -340, BX1 = 340, BY0 = -400, BY1 = 470;
const cache = {}; let fontOk = false;
const fontReady = () => { try { return document.fonts ? document.fonts.check(FONT(20)) : true; } catch(e){ return true; } };
try { document.fonts?.ready.then(() => { for (const k in cache) delete cache[k]; fontOk = true; }); } catch(e){}
// 보스 그림 캔버스: {img, x0, y0, k} · 단위 (u, v) → 캔버스 ((u - x0)*k, (v - y0)*k)
export function bossArt(v, k = .7){
  const key = v + k; if (cache[key] && (cache[key].font || !fontReady())) return cache[key];
  const cv = document.createElement('canvas'); cv.width = Math.ceil((BX1 - BX0)*k); cv.height = Math.ceil((BY1 - BY0)*k);
  g = cv.getContext('2d'); g.scale(k, k); g.translate(-BX0, -BY0); boss(v); g = null;
  return (cache[key] = {img:cv, x0:BX0, y0:BY0, k, font:fontReady() || fontOk});
}
// 이름표 한 장 (떠다니는 이름표 · 글자 조각용)
export function tagArt(t, real = false){
  const key = 'tag' + t + (real ? 1 : 0); if (cache[key] && (cache[key].font || !fontReady())) return cache[key];
  const k = 2, cv = document.createElement('canvas'); g = cv.getContext('2d'); g.font = FONT(19); const w = g.measureText(t).width + 16;
  cv.width = Math.ceil((w + 24)*k); cv.height = Math.ceil(44*k); g = cv.getContext('2d'); g.scale(k, k); tagC((w + 24)/2, 26, t, 0, 1, real); g = null;
  return (cache[key] = {img:cv, w:(w + 24), h:44, font:fontReady() || fontOk});
}
// 굴러다니는 큰 실패 (위에서 본 둥근 실패)
export function spoolArt(){
  if (cache.spool) return cache.spool; const k = 2, cv = document.createElement('canvas'); cv.width = cv.height = 100*k; g = cv.getContext('2d'); g.scale(k, k); g.translate(50, 50);
  ell(0, 0, 46, 46, '#c89a68'); ell(0, 0, 36, 36, '#e88ab0'); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2; for (let i = 0; i < 6; i++){ g.beginPath(); g.arc(0, 0, 14 + i*4, i, i + 2); g.stroke(); }
  g.strokeStyle = 'rgba(90,50,30,.6)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.stroke(); ell(0, 0, 8, 8, '#6a4a2a'); g = null;
  return (cache.spool = {img:cv, r:50});
}
// 바늘 (화면을 꿰매는 큰 바늘) · 그 자리에서 바로 그려요
export function drawNeedle(c, x, y, ang, L, glow){ c.save(); c.translate(x, y); c.rotate(ang); if (glow){ c.shadowColor = 'rgba(255,200,230,.8)'; c.shadowBlur = 18; }
  const q = c.createLinearGradient(0, -12, 0, 12); q.addColorStop(0, '#ffffff'); q.addColorStop(1, '#7a7a8a'); c.fillStyle = q; c.beginPath(); c.moveTo(0, 0); c.lineTo(-L, -12); c.quadraticCurveTo(-L - 20, 0, -L, 12); c.closePath(); c.fill(); c.shadowBlur = 0;
  c.fillStyle = '#120810'; c.beginPath(); c.ellipse(-L + 34, 0, 18, 4.5, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-L + 60, -5); c.lineTo(-40, -2); c.stroke(); c.restore(); }
// 가위 (작게 · 싹둑)
export function drawSnip(c, x, y, open, s = 1, rot = -.6){ c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); for (const s2 of [-1, 1]){ c.save(); c.rotate(s2*open); c.fillStyle = '#e8e8f2'; c.beginPath(); c.moveTo(0, -4); c.lineTo(70, -1*s2); c.lineTo(0, 5); c.closePath(); c.fill(); c.strokeStyle = '#c8285a'; c.lineWidth = 6; c.beginPath(); c.ellipse(-18, s2*9, 12, 8, s2*.3, 0, 7); c.stroke(); c.restore(); } c.fillStyle = '#5a5a68'; c.beginPath(); c.arc(0, 0, 3.5, 0, 7); c.fill(); c.restore(); }
