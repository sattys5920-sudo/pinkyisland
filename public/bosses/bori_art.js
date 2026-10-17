// 보리??? (윤보혁) 그림 · 녹슨 태엽 깡통 곰 (bori/boss2.html 시안에서 옮겼어요)
// 무거운 그림(곰 몸 · 시계판)은 처음 한 번 캔버스에 그려 두고 drawImage 로 써요
let g = null, sd = 29;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const F = s => `bold ${Math.round(s/.7)}px "Dongle",sans-serif`; // "Dongle" 은 메이플스토리 70% 크기
const fontsOk = () => { try { return document.fonts.check(F(20)); } catch(e){ return true; } };
const mk = (w, h) => { const o = document.createElement('canvas'); o.width = w; o.height = h; return o; };
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col, al = 1) => { g.save(); g.globalAlpha = Math.max(0, Math.min(1, al)); g.font = F(s); g.textAlign = 'center'; g.lineWidth = 4; g.strokeStyle = 'rgba(0,0,0,.55)'; g.strokeText(t, x, y); g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
const metal = (x, y, r, a, b, c0 = '#e8f0f0') => { const q = g.createRadialGradient(x - r*.4, y - r*.45, r*.05, x, y, r*1.15); q.addColorStop(0, c0); q.addColorStop(.25, a); q.addColorStop(1, b); return q; };
const TIN = '#7f9a96', TIND = '#2c3a3a';
function rust(clipFn, n, x0, y0, w, h){ g.save(); clipFn(); g.clip(); for (let i = 0; i < n; i++){ const x = x0 + R()*w, y = y0 + R()*h, r = 4 + R()*16; const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(${120 + R()*40|0},${50 + R()*30|0},20,.8)`); q.addColorStop(1, 'rgba(120,60,20,0)'); g.fillStyle = q; g.fillRect(x - r, y - r, r*2, r*2); } for (let i = 0; i < 40; i++){ g.fillStyle = 'rgba(60,24,8,.7)'; g.fillRect(x0 + R()*w, y0 + R()*h, 1.5, 3 + R()*8); } g.restore(); }
function chipped(clipFn, col, x0, y0, w, h, n = 14){ const T = mk(g.canvas.width, g.canvas.height), t = T.getContext('2d'); t.setTransform(g.getTransform()); const g0 = g; g = t; g.save(); clipFn(); g.clip(); g.fillStyle = col; g.fillRect(x0, y0, w, h); g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < n; i++){ g.beginPath(); const cx = x0 + R()*w, cy = y0 + R()*h; for (let k = 0; k < 9; k++){ const a = k/9*6.28, r = 5 + R()*16; g.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r); } g.closePath(); g.fill(); } g.restore(); g = g0; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(T, 0, 0); g.restore(); }
function rivets(pts, r = 3.2){ for (const [x, y] of pts) ell(x, y, r, r, metal(x, y, r, '#a8b8b4', '#3a4848')); }
function seamLine(x0, y0, x1, y1){ g.strokeStyle = 'rgba(20,26,26,.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L/22), pts = []; for (let k = 1; k < n; k++) pts.push([x0 + (x1 - x0)*k/n, y0 + (y1 - y0)*k/n + 5]); rivets(pts, 2.6); }
function keyG(x, y, s, rot, col = '#b8913f'){ g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.arc(0, 0, 5, 0, 7); g.fill(); g.fillStyle = '#120c06'; g.beginPath(); g.arc(0, 0, 2, 0, 7); g.fill(); g.fillStyle = col; g.fillRect(-1.3, 4, 2.6, 16); g.fillRect(1, 12, 3.5, 2.2); g.fillRect(1, 16, 4.5, 2.2); g.restore(); }
function tagG(x, y, t, rot = 0, s = 1){ g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.font = F(10); const w = Math.max(20, g.measureText(t).width + 10); g.fillStyle = '#d8c89a'; g.fillRect(-w/2, 0, w, 14); g.fillStyle = '#5a1010'; g.textAlign = 'center'; g.fillText(t, 0, 11); g.restore(); }
function keyhole(x, y, s, look){ g.save(); g.translate(x, y); g.scale(s, s); ell(0, 0, 17, 17, metal(0, 0, 17, '#c8b070', '#5a4418', '#fff2c0')); g.fillStyle = '#040302'; g.beginPath(); g.arc(0, -2, 8, 0, 7); g.fill(); g.beginPath(); g.moveTo(-4.5, 2); g.lineTo(4.5, 2); g.lineTo(7, 18); g.lineTo(-7, 18); g.closePath(); g.fill();
  const q = g.createRadialGradient(look, -2, .3, look, -2, 5); q.addColorStop(0, '#fff8d0'); q.addColorStop(.5, '#e0b040'); q.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = q; g.beginPath(); g.arc(look, -2, 5, 0, 7); g.fill(); g.fillStyle = '#000'; g.fillRect(look - .7, -5.5, 1.4, 7); g.restore(); }
function chainBunch(x0, y0, x1, y1, s, nick){ g.save(); g.strokeStyle = '#3a3a34'; g.lineWidth = 3; const n = 9; for (let i = 0; i < n; i++){ const t = i/n, x = x0 + (x1 - x0)*t, y = y0 + (y1 - y0)*t + Math.sin(t*Math.PI)*16; g.beginPath(); g.ellipse(x, y, 6, 3.5, Math.atan2(y1 - y0, x1 - x0) + (i%2 ? 1.57 : 0), 0, 7); g.stroke(); } g.restore();
  g.save(); g.translate(x1, y1); g.scale(s, s); g.strokeStyle = metal(0, 0, 28, '#8a8a80', '#2a2a24'); g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.stroke(); for (let i = 0; i < 24; i++){ const a = Math.PI*.05 + i/24*Math.PI*.9; keyG(Math.cos(a)*26, Math.sin(a)*26 + 4, 2 + (i%3)*.25, -a + Math.PI/2 + (R() - .5)*.4, i%4 ? '#b08a3a' : '#8a8a7a'); } tagG(-12, 66, '3번 집', .25); tagG(16, 72, `24 · ${nick}`, -.2); g.restore(); }
function vault(x, y, r, open, nick){ ell(x, y, r + 8, r + 8, metal(x, y, r + 8, '#5a6a68', '#1a2222'));
  if (!open){ ell(x, y, r, r, metal(x, y, r, '#9ab0ac', '#3a4a4a', '#f0fff8')); rust(() => { g.beginPath(); g.arc(x, y, r, 0, 7); }, 12, x - r, y - r, r*2, r*2);
    for (let k = 0; k < 12; k++){ const a = k/12*6.28; rivets([[x + Math.cos(a)*(r - 9), y + Math.sin(a)*(r - 9)]], 3); }
    ell(x, y, r*.42, r*.42, metal(x, y, r*.42, '#c8b070', '#5a4418', '#fff2c0')); g.strokeStyle = '#2a2010'; g.lineWidth = 1.2; for (let k = 0; k < 40; k++){ const a = k/40*6.28; g.beginPath(); g.moveTo(x + Math.cos(a)*r*.32, y + Math.sin(a)*r*.32); g.lineTo(x + Math.cos(a)*r*(k%5 ? .37 : .4), y + Math.sin(a)*r*(k%5 ? .37 : .4)); g.stroke(); }
    g.fillStyle = '#1a1208'; g.beginPath(); g.moveTo(x, y - r*.4); g.lineTo(x - 4, y - r*.48); g.lineTo(x + 4, y - r*.48); g.fill(); return; }
  // 열림: 문은 옆으로 젖혀지고, 안에 '노리는 몸의 방' 이 작게 들어 있어요
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  g.fillStyle = lg(0, y - r, 0, y + r, '#e8d8c0', '#b8a080'); g.fillRect(x - r, y - r, r*2, r); g.fillStyle = '#a07858'; g.fillRect(x - r, y, r*2, r); for (let k = 0; k < 6; k++){ g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x - r, y + k*12, r*2, 1.5); }
  g.fillStyle = '#9fc8e8'; g.fillRect(x - 30, y - r + 16, 26, 22); g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(x - 30, y - r + 16, 26, 22);
  g.fillStyle = '#ffb3c8'; g.fillRect(x - r + 14, y + 4, 54, 22); g.fillStyle = '#fff'; g.fillRect(x - r + 14, y + 2, 14, 10);
  g.fillStyle = 'rgba(40,30,30,.55)'; g.beginPath(); g.ellipse(x - r + 50, y + 8, 14, 7, 0, 0, 7); g.fill();
  g.fillStyle = '#8a5a3a'; g.fillRect(x + 10, y - 6, 40, 8); g.fillRect(x + 14, y + 2, 4, 20); g.fillRect(x + 42, y + 2, 4, 20);
  txt(`24 · ${nick}의 방`, x, y - r + 54, 12, '#7a1010');
  const sh = g.createRadialGradient(x, y, r*.6, x, y, r); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = sh; g.fillRect(x - r, y - r, r*2, r*2); g.restore();
  g.save(); g.translate(x - r - 6, y); g.scale(.32, 1); ell(0, 0, r, r, metal(0, 0, r, '#9ab0ac', '#2a3a3a', '#e0f0e8')); g.restore(); rivets([[x - r - 8, y - r*.6], [x - r - 8, y + r*.6]], 4); }
function gears(x, y){ for (const [dx, dy, r, n] of [[-30, -10, 26, 12], [20, 20, 18, 9], [36, -24, 12, 8]]){ g.save(); g.translate(x + dx, y + dy); g.rotate(R()*3); g.fillStyle = metal(0, 0, r, '#b8a070', '#4a3a18'); g.beginPath(); for (let k = 0; k < n*2; k++){ const a = k/(n*2)*6.28, rr = k%2 ? r : r*.8; g.lineTo(Math.cos(a)*rr, Math.sin(a)*rr); } g.closePath(); g.fill(); ell(0, 0, r*.3, r*.3, '#1a1208'); g.restore(); } }
function tinBear(open, nick){
  const sh = g.createRadialGradient(0, 300, 10, 0, 300, 220); sh.addColorStop(0, 'rgba(0,0,0,.8)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.save(); g.scale(1, .2); g.fillStyle = sh; g.beginPath(); g.arc(0, 1500, 220, 0, 7); g.fill(); g.restore();
  g.save(); g.translate(120, -40); g.rotate(-.5); g.scale(1.5, 1.5); g.fillStyle = metal(30, 0, 60, '#c8b070', '#5a4418', '#fff2c0'); g.fillRect(-6, -7, 64, 14); for (const s2 of [-1, 1]){ g.beginPath(); g.ellipse(76, s2*24, 24, 28, 0, 0, 7); g.fill(); g.fillStyle = '#0a0806'; g.beginPath(); g.ellipse(76, s2*24, 11, 14, 0, 0, 7); g.fill(); g.fillStyle = metal(30, 0, 60, '#c8b070', '#5a4418', '#fff2c0'); } g.restore();
  for (const s2 of [-1, 1]){ g.fillStyle = lg(s2*70 - 44, 0, s2*70 + 44, 0, TIND, TIN, '#c8dcd8', TIN, TIND); g.beginPath(); g.roundRect(s2*70 - 44, 200, 88, 90, 14); g.fill(); ell(s2*70, 290, 46, 14, '#1a2222'); rust(() => { g.beginPath(); g.roundRect(s2*70 - 44, 200, 88, 90, 14); }, 10, s2*70 - 44, 200, 88, 90); seamLine(s2*70 - 44, 250, s2*70 + 44, 250); }
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*150, -10); g.rotate(s2*-.18); g.fillStyle = lg(-34, 0, 34, 0, TIND, TIN, '#c8dcd8', TIN, TIND); g.beginPath(); g.roundRect(-34, 0, 68, 170, 20); g.fill(); rust(() => { g.beginPath(); g.roundRect(-34, 0, 68, 170, 20); }, 10, -34, 0, 68, 170); seamLine(-34, 84, 34, 84); ell(0, 0, 26, 26, metal(0, 0, 26, '#8a9a96', '#2a3434')); rivets([[0, 0]], 6); g.restore(); chainBunch(s2*172, 150, s2*196, 236, 1.1, nick); }
  const body = () => { g.beginPath(); g.ellipse(0, 90, 150, 178, 0, 0, 7); };
  body(); g.fillStyle = lg(-150, 0, 150, 0, TIND, TIN, '#d8ece8', TIN, TIND); g.fill();
  chipped(body, 'rgba(226,140,168,.8)', -150, -90, 300, 360, 34); rust(body, 30, -150, -90, 300, 360);
  seamLine(-142, 40, 142, 40); seamLine(-120, 210, 120, 210); g.save(); body(); g.clip(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 6; g.beginPath(); g.ellipse(-60, 40, 40, 120, -.2, 3.5, 4.6); g.stroke(); g.restore();
  if (!open) vault(0, 115, 68, false, nick); else { gears(-90, 170); gears(90, 30); vault(0, 115, 68, true, nick); for (let i = 0; i < 4; i++){ g.save(); g.translate(-160 + i*20, 260 + i*8); g.rotate(.4 + i*.3); g.fillStyle = lg(0, 0, 40, 0, TIND, TIN); g.fillRect(0, 0, 44, 30); rivets([[6, 6], [36, 6]], 2.4); g.restore(); } }
  txt('Bori · No.24', 0, 260, 13, 'rgba(240,230,200,.55)');
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*104, -250); g.rotate(s2*.15); if (s2 > 0) g.scale(1, .8); ell(0, 0, 40, 38, metal(0, 0, 40, '#9ab0ac', TIND, '#f0fff8')); ell(0, 4, 22, 20, 'rgba(232,140,170,.75)'); g.restore(); }
  const head = () => { g.beginPath(); g.ellipse(0, -160, 140, 120, 0, 0, 7); };
  head(); g.fillStyle = lg(-140, 0, 140, 0, TIND, TIN, '#e0f0ec', TIN, TIND); g.fill();
  chipped(() => { g.beginPath(); g.ellipse(0, -136, 104, 86, 0, 0, 7); }, 'rgba(240,226,200,.95)', -110, -230, 220, 190, 16);
  rust(head, 26, -140, -280, 280, 240); seamLine(-138, -170, 138, -170);
  for (const s2 of [-1, 1]) ell(s2*72, -112, 20, 11, 'rgba(255,130,160,.55)');
  keyhole(-52, -168, 1.5, 1.5); keyhole(52, -168, 1.5, -1.5);
  ell(0, -128, 16, 11, '#1a1414');
  g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(-58, -96); g.lineTo(58, -96); g.lineTo(52, -74); g.lineTo(-52, -74); g.closePath(); g.fill();
  g.fillStyle = '#d8d0c0'; for (let i = 0; i < 10; i++) g.fillRect(-54 + i*11, -96, 8, 7); for (let i = 0; i < 10; i++) g.fillRect(-50 + i*10.5, -81, 7, 6);
  g.fillStyle = lg(-60, 0, 60, 0, TIND, TIN, '#c8dcd8', TIN, TIND); g.beginPath(); g.roundRect(-62, -74, 124, 22, 8); g.fill(); rivets([[-56, -84], [56, -84]], 4.5);
  g.strokeStyle = 'rgba(30,20,20,.8)'; g.lineWidth = 2.5; g.beginPath(); g.arc(0, -150, 60, Math.PI*.2, Math.PI*.8); g.stroke();
  g.fillStyle = 'rgba(80,40,10,.75)'; for (let i = 0; i < 4; i++) g.fillRect(-48 + i*30, -150, 3, 24 + R()*30);
}

// 곰 그림: 캔버스 420 × 510 · 발(바닥) = (210, 482) · 시안 크기의 0.8 배
export const BEAR = { w:420, h:510, fx:210, fy:482, k:.8 };
const bearCache = new Map();
export function bear(open, nick){
  const key = (open ? 'o' : 'c') + '|' + nick + '|' + (fontsOk() ? 1 : 0); let o = bearCache.get(key); if (o) return o;
  if (bearCache.size > 8) bearCache.clear();
  o = mk(BEAR.w, BEAR.h); const g0 = g, s0 = sd; g = o.getContext('2d'); sd = 29; g.translate(210, 250); g.scale(.8, .8); tinBear(open, nick); g = g0; sd = s0; bearCache.set(key, o); return o; }

// ===== 작은 물건 (가벼워서 매번 그려요) =====
export function key(c, x, y, s, rot, col = '#b8913f'){ c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = col; c.beginPath(); c.arc(0, 0, 5, 0, 7); c.fill(); c.fillStyle = '#120c06'; c.beginPath(); c.arc(0, 0, 2, 0, 7); c.fill(); c.fillStyle = col; c.fillRect(-1.3, 4, 2.6, 16); c.fillRect(1, 12, 3.5, 2.2); c.fillRect(1, 16, 4.5, 2.2); c.restore(); }
// 빛나는 던지는 열쇠 (번짐은 미리 그려 둬요)
let glowKey = null;
export function keyShot(c, x, y, rot, s = 1){ if (!glowKey){ glowKey = mk(64, 64); const q = glowKey.getContext('2d'), gr = q.createRadialGradient(32, 32, 2, 32, 32, 30); gr.addColorStop(0, 'rgba(255,220,120,.85)'); gr.addColorStop(1, 'rgba(255,180,60,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 64); key(q, 32, 22, 1.6, 0, '#e8c060'); }
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.drawImage(glowKey, -32, -32); c.restore(); }
export function tag(c, x, y, t, rot = 0, s = 1){ c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.font = F(10); const w = Math.max(20, c.measureText(t).width + 10); c.fillStyle = '#d8c89a'; c.fillRect(-w/2, 0, w, 14); c.strokeStyle = '#6a5020'; c.lineWidth = 1; c.strokeRect(-w/2, 0, w, 14); c.fillStyle = '#5a1010'; c.textAlign = 'center'; c.fillText(t, 0, 11); c.restore(); }
export const TEETH = [[1, 0, 1, 1], [0, 1, 1, 0], [1, 1, 0, 1]];
export function keyTeeth(c, x, y, pat, s, glow, al = 1){ c.save(); c.globalAlpha = al; c.translate(x, y); c.scale(s, s); if (glow){ c.fillStyle = 'rgba(255,240,160,.35)'; c.beginPath(); c.ellipse(0, 2, 44, 22, 0, 0, 7); c.fill(); } c.fillStyle = '#c8a040'; c.beginPath(); c.arc(-26, 0, 11, 0, 7); c.fill(); c.fillRect(-16, -4, 46, 8); pat.forEach((v, i) => { if (v) c.fillRect(-6 + i*9, 4, 6, 8); }); c.fillStyle = '#1a1208'; c.beginPath(); c.arc(-26, 0, 4, 0, 7); c.fill(); c.restore(); }
export function cage(c, x, y, al, pat){ c.save(); c.globalAlpha = al; c.translate(x, y); c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(0, 4, 56, 14, 0, 0, 7); c.fill();
  c.strokeStyle = '#6a7270'; c.lineWidth = 5; for (let i = -4; i <= 4; i++){ c.beginPath(); c.moveTo(i*13, 4); c.lineTo(i*13, -110); c.stroke(); } c.lineWidth = 7; c.beginPath(); c.ellipse(0, -110, 56, 12, 0, 0, 7); c.stroke(); c.beginPath(); c.ellipse(0, 4, 56, 12, 0, 0, Math.PI); c.stroke();
  c.fillStyle = '#b8913f'; c.beginPath(); c.roundRect(-20, -66, 40, 34, 6); c.fill(); c.strokeStyle = '#8a6a2a'; c.lineWidth = 6; c.beginPath(); c.arc(0, -66, 12, Math.PI, 0); c.stroke(); c.fillStyle = '#1a1208'; pat.forEach((v, i) => { c.fillRect(-14 + i*8, -52, 5, v ? 10 : 4); }); c.restore(); }
export function musicBox(c, x, y, open, t){ c.save(); c.translate(x, y); c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(0, 30, 54, 12, 0, 0, 7); c.fill();
  const q = c.createLinearGradient(-50, 0, 50, 0); q.addColorStop(0, '#8a5a30'); q.addColorStop(.5, '#c8905a'); q.addColorStop(1, '#7a4a24'); c.fillStyle = q; c.fillRect(-48, -10, 96, 40); c.fillStyle = '#6a3a1a'; c.save(); c.translate(-48, -10); c.rotate(-open*1.2); c.fillRect(0, -16, 96, 16); c.restore();
  if (open > .3){ c.globalAlpha = open; c.fillStyle = 'rgba(255,240,180,.4)'; c.beginPath(); c.arc(0, -30, 14, 0, 7); c.fill(); c.strokeStyle = '#ffd860'; c.lineWidth = 4; c.beginPath(); c.arc(0, -30, 9, 0, 7); c.stroke(); c.globalAlpha = 1; }
  c.fillStyle = '#d8b070'; c.translate(52, 6); c.rotate(t*3); c.fillRect(-2, -10, 4, 20); c.restore(); }
export function ring(c, x, y, s = 1){ c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = 'rgba(255,230,140,.25)'; c.beginPath(); c.arc(0, 0, 22, 0, 7); c.fill(); c.strokeStyle = '#ffd860'; c.lineWidth = 5; c.beginPath(); c.ellipse(0, 0, 12, 10, 0, 0, 7); c.stroke(); c.fillStyle = '#e8f8ff'; c.beginPath(); c.moveTo(0, -16); c.lineTo(5, -10); c.lineTo(0, -6); c.lineTo(-5, -10); c.closePath(); c.fill(); c.restore(); }
export function chainLink(c, x, y, a, i){ c.strokeStyle = i % 2 ? '#8e9894' : '#b8c2bc'; c.lineWidth = 5; c.beginPath(); c.ellipse(x, y, 13, 7, a + (i % 2)*1.57, 0, 7); c.stroke(); }
export function padlock(c, x, y, sc, closed){ c.save(); c.translate(x, y); c.scale(sc, sc);
  c.strokeStyle = '#c9a24a'; c.lineWidth = 11; c.beginPath(); c.arc(0, closed ? -34 : -52, 26, Math.PI, 0); c.lineTo(26, closed ? -34 : -34); c.moveTo(-26, closed ? -34 : -52); c.lineTo(-26, closed ? -20 : -40); c.stroke();
  const q = c.createLinearGradient(-40, 0, 40, 0); q.addColorStop(0, '#7a5a1e'); q.addColorStop(.5, '#e8c060'); q.addColorStop(1, '#7a5a1e'); c.fillStyle = q; c.beginPath(); c.roundRect(-40, -34, 80, 66, 10); c.fill(); c.fillStyle = '#1a1208'; c.beginPath(); c.arc(0, -8, 8, 0, 7); c.fill(); c.fillRect(-3, -8, 6, 22); c.restore(); }
// 복제 (회색 그림자 · 빨간 눈)
export function ghost(c, x, y, al, name){ c.save(); c.globalAlpha = al; c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(x, y + 2, 20, 6, 0, 0, 7); c.fill();
  c.fillStyle = '#6a6a7a'; c.beginPath(); c.ellipse(x - 12, y - 46, 7, 9, 0, 0, 7); c.ellipse(x + 12, y - 46, 7, 9, 0, 0, 7); c.fill();
  const q = c.createRadialGradient(x - 8, y - 34, 2, x, y - 26, 26); q.addColorStop(0, '#a8a8b8'); q.addColorStop(1, '#4a4a5a'); c.fillStyle = q; c.beginPath(); c.ellipse(x, y - 24, 22, 24, 0, 0, 7); c.fill();
  c.fillStyle = '#ff3a4a'; c.beginPath(); c.arc(x - 8, y - 28, 3.5, 0, 7); c.arc(x + 8, y - 28, 3.5, 0, 7); c.fill();
  if (name){ c.font = F(12); c.textAlign = 'center'; c.fillStyle = 'rgba(0,0,0,.6)'; c.fillText(name, x + 1, y + 17); c.fillStyle = '#ff8a9a'; c.fillText(name, x, y + 16); } c.restore(); }

// ===== 시계판 =====
// ① 바닥 시계 (누운 타원) · 미리 그려 둬요
const faceCache = {};
export function floorClock(rx, ry){ const k = rx + 'x' + ry + (fontsOk() ? 'f' : ''); if (faceCache[k]) return faceCache[k]; const o = mk(rx*2 + 40, ry*2 + 40), q = o.getContext('2d'), cx = rx + 20, cy = ry + 20;
  q.fillStyle = 'rgba(230,220,190,.10)'; q.beginPath(); q.ellipse(cx, cy, rx, ry, 0, 0, 7); q.fill(); q.strokeStyle = 'rgba(230,220,190,.55)'; q.lineWidth = 4; q.stroke(); q.lineWidth = 1.5; q.beginPath(); q.ellipse(cx, cy, rx*.8, ry*.8, 0, 0, 7); q.stroke();
  for (let i = 0; i < 60; i++){ const a = -Math.PI/2 + i/60*Math.PI*2, big = i%5 === 0, r0 = big ? .9 : .95; q.lineWidth = big ? 3 : 1; q.beginPath(); q.moveTo(cx + Math.cos(a)*rx*r0, cy + Math.sin(a)*ry*r0); q.lineTo(cx + Math.cos(a)*rx, cy + Math.sin(a)*ry); q.stroke(); }
  q.font = F(18); q.textAlign = 'center'; q.textBaseline = 'middle'; for (let h = 0; h < 12; h++){ const a = -Math.PI/2 + h*Math.PI/6; q.lineWidth = 3; q.strokeStyle = 'rgba(0,0,0,.5)'; q.strokeText(String(h || 12), cx + Math.cos(a)*rx*.86, cy + Math.sin(a)*ry*.82); q.fillStyle = 'rgba(240,230,200,.85)'; q.fillText(String(h || 12), cx + Math.cos(a)*rx*.86, cy + Math.sin(a)*ry*.82); }
  faceCache[k] = o; return o; }
// 50% 큰 시계 (로마 숫자) · 판은 미리, 바늘은 매번
const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
let bigFace = null;
function bigFaceImg(){ if (bigFace && bigFace.f === fontsOk()) return bigFace.o; const r = 400, o = mk(r*2 + 20, r*2 + 20), q = o.getContext('2d'); q.translate(r + 10, r + 10);
  q.strokeStyle = '#e4eedc'; q.fillStyle = '#e4eedc'; q.lineWidth = 7; q.beginPath(); q.arc(0, 0, r, 0, 7); q.stroke(); q.lineWidth = 2; q.beginPath(); q.arc(0, 0, r*.93, 0, 7); q.stroke(); q.beginPath(); q.arc(0, 0, r*.62, 0, 7); q.stroke();
  for (let i = 0; i < 60; i++){ const a = i/60*Math.PI*2, big = i%5 === 0, r0 = big ? r*.82 : r*.88; q.lineWidth = big ? 6 : 2; q.beginPath(); q.moveTo(Math.cos(a)*r0, Math.sin(a)*r0); q.lineTo(Math.cos(a)*r*.93, Math.sin(a)*r*.93); q.stroke(); }
  q.font = F(r*.11); q.textAlign = 'center'; q.textBaseline = 'middle'; ROMAN.forEach((rn, i) => { const a = -Math.PI/2 + i*Math.PI/6; q.save(); q.translate(Math.cos(a)*r*.72, Math.sin(a)*r*.72); q.rotate(a + Math.PI/2); q.fillText(rn, 0, 0); q.restore(); });
  bigFace = {o, f:fontsOk()}; return o; }
export function bigClock(c, cx, cy, r, al, ah, am, as, rot = 0){ if (al <= .003) return; c.save(); c.globalAlpha = al; c.translate(cx, cy); c.rotate(rot); const s = r/400; c.drawImage(bigFaceImg(), -410*s, -410*s, 820*s, 820*s);
  const hand = (a, L, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(-Math.cos(a)*L*.15, -Math.sin(a)*L*.15); c.lineTo(Math.cos(a)*L, Math.sin(a)*L); c.stroke(); };
  hand(ah, r*.48, Math.max(4, 16*s), '#e4eedc'); hand(am, r*.74, Math.max(3, 9*s), '#e4eedc'); hand(as, r*.86, 3, '#ff4a4a'); c.fillStyle = '#e4eedc'; c.beginPath(); c.arc(0, 0, Math.max(5, 16*s), 0, 7); c.fill(); c.restore(); }
export const font = F;
