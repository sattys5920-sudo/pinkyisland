// 콩이??? (공태식 · 안에 갇힌 서하람) 보스 그림 · 시안(boss.html)의 그림 코드를 옮겼어요
// 모든 함수는 첫 인자로 받은 캔버스(ctx)에 그려요. 무거운 몸 그림은 wolfCanvas 로 한 번 그려 두고 drawImage
let g = null, sd = 91;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const FONT = s => `bold ${Math.round(s/.7)}px "Dongle",sans-serif`; // 시안의 메이플 글꼴 크기 → Dongle (70%)
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
const rr = (x, y, w, h, f, r = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col) => { g.save(); g.font = FONT(s); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };

// 하람의 말풍선 (찢긴 모서리)
export function bubble(c, x, y, t, s = 1, rot = 0, tail = 1, torn = false, al = 1, fg = '#8a1818', bg = '#f4f0ea'){ g = c; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = al; g.font = FONT(18); const w = g.measureText(t).width + 30, h = 40;
  g.fillStyle = bg; g.beginPath(); g.roundRect(-w/2, -h/2, w, h, 18); g.fill(); g.beginPath(); g.moveTo(tail*w*.15, h/2 - 2); g.lineTo(tail*w*.15 + tail*16, h/2 + 18); g.lineTo(tail*w*.15 + tail*20, h/2 - 2); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(60,40,40,.6)'; g.lineWidth = 1.6; g.beginPath(); g.roundRect(-w/2, -h/2, w, h, 18); g.stroke();
  if (torn){ g.fillStyle = 'rgba(10,10,14,.9)'; g.beginPath(); g.moveTo(w/2 - 30, -h/2); g.lineTo(w/2 - 18, -4); g.lineTo(w/2 - 26, 4); g.lineTo(w/2, h/2); g.lineTo(w/2, -h/2); g.closePath(); g.fill(); }
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = fg; g.fillText(t, 0, 1); g.restore(); }
// 경비대 배지 (cracked: 금 가고 안에 갇힌 작은 늑대 · glow: 빛)
export function badge(c, x, y, s, cracked, glow){ g = c; g.save(); g.translate(x, y); g.scale(s, s); if (glow){ const q = g.createRadialGradient(0, 0, 4, 0, 0, 40); q.addColorStop(0, 'rgba(255,240,180,.8)'); q.addColorStop(1, 'rgba(255,240,180,0)'); g.fillStyle = q; g.fillRect(-40, -40, 80, 80); }
  g.fillStyle = lg(-16, -20, 16, 20, '#f0d070', '#9a7420'); g.beginPath(); for (let i = 0; i < 12; i++){ const a = i/12*6.28 - Math.PI/2, r2 = i%2 ? 13 : 19; g.lineTo(Math.cos(a)*r2, Math.sin(a)*r2); } g.closePath(); g.fill(); ell(0, 0, 8, 8, '#2a3a6a');
  if (cracked){ g.strokeStyle = '#1a1208'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-6, -16); g.lineTo(0, -2); g.lineTo(-4, 8); g.lineTo(4, 16); g.stroke(); g.fillStyle = 'rgba(240,236,224,.9)'; g.beginPath(); g.arc(1, 1, 4, 0, 7); g.fill(); for (const sx of [-1, 1]){ g.beginPath(); g.moveTo(1 + sx*2, -2); g.lineTo(1 + sx*4, -7); g.lineTo(1 + sx*5, -1); g.fill(); } }
  else txt('경비', 0, 4, 7, '#f0e6c0'); g.restore(); }
// 배지 뒷면 (증거): 손톱으로 긁은 "문 열지 마 — 하람"
export function badgeBack(c, x, y, s, al = 1){ g = c; g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = al;
  const q = g.createRadialGradient(0, 0, 10, 0, 0, 90); q.addColorStop(0, 'rgba(255,244,190,.75)'); q.addColorStop(1, 'rgba(255,244,190,0)'); g.fillStyle = q; g.fillRect(-90, -90, 180, 180);
  g.fillStyle = lg(-40, -50, 40, 50, '#c8b070', '#6a5420'); g.beginPath(); for (let i = 0; i < 12; i++){ const a = i/12*6.28 - Math.PI/2, r2 = i%2 ? 40 : 54; g.lineTo(Math.cos(a)*r2, Math.sin(a)*r2); } g.closePath(); g.fill();
  g.strokeStyle = '#3a2a10'; g.lineWidth = 3; g.beginPath(); g.moveTo(-24, -30); g.lineTo(24, -30); g.stroke(); ell(0, -30, 5, 5, '#3a2a10');
  g.save(); g.font = FONT(13); g.textAlign = 'center'; g.fillStyle = '#2a1608'; g.fillText('문 열지 마', 0, 4); g.font = FONT(10); g.fillText('— 하람', 8, 22); g.restore(); g.restore(); }
function doorstep(half){ g.save(); g.scale(1, .22); ell(0, 1600, 260, 220, 'rgba(0,0,0,.65)'); g.restore(); g.fillStyle = lg(-200, 236, 200, 340, half ? '#1e2230' : '#4a5068', half ? '#08090e' : '#262a38'); g.beginPath(); g.moveTo(-210, 240); g.lineTo(210, 240); g.lineTo(190, 340); g.lineTo(-190, 340); g.closePath(); g.fill(); rr(-226, 226, 452, 24, half ? '#2a2e3a' : '#5a607a', 8); txt('출구', 0, 300, 26, half ? '#c02020' : '#e8ecf4'); }
// 늑대 경비대 (원점 = 몸 가운데 · 발판 바닥은 y = 340) · 손전등 빛은 빼고 그려요 (게임에서 따로)
export function wolf(c, half){ g = c; sd = 91; g.save();
  doorstep(half);
  if (half){ const au = g.createRadialGradient(0, -80, 30, 0, -80, 440); au.addColorStop(0, 'rgba(120,140,220,.3)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-460, -560, 920, 940); }
  const F = half ? '#7e8496' : '#9aa3b5', Fd = half ? '#2e3240' : '#5a6276', NV = half ? '#222a44' : '#2e3a66', NVd = half ? '#05060c' : '#1a2242';
  g.save(); g.translate(-120, 160); g.rotate(-.9); ell(0, 0, 34, 90, rg(0, -20, 90, F, Fd)); ell(0, -70, 20, 28, half ? '#8a8a8a' : '#e8ecf4'); g.restore();
  for (const s2 of [-1, 1]) rr(s2*56 - 32, 170, 64, 76, NVd, 16); for (const s2 of [-1, 1]) ell(s2*56, 244, 36, 16, '#1a1a1e');
  ell(0, 70, 132, 150, rg(-30, 20, 160, NV, NVd));
  g.fillStyle = half ? '#a8a8b0' : '#f4f6fa'; g.beginPath(); g.moveTo(-30, -60); g.lineTo(0, 30); g.lineTo(30, -60); g.closePath(); g.fill(); g.fillStyle = half ? '#4a0a0a' : '#c03040'; g.beginPath(); g.moveTo(-8, -50); g.lineTo(8, -50); g.lineTo(10, 40); g.lineTo(0, 54); g.lineTo(-10, 40); g.closePath(); g.fill();
  for (const yy of [60, 100, 140]) ell(36, yy, 5, 5, '#c9a050');
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*130, 0); g.rotate(s2*-.4); ell(0, 60, 30, 76, rg(0, 50, 80, NV, NVd)); ell(0, 136, 26, 22, F); g.restore(); }
  g.save(); g.translate(-200, 120); g.rotate(-.5); rr(-12, -10, 24, 70, '#2a2a30', 4); ell(0, -12, 18, 10, '#3a3a40'); g.restore();
  const hy = -150;
  for (const sx of [-1, 1]){ g.fillStyle = F; g.beginPath(); g.moveTo(sx*40, hy - 70); g.lineTo(sx*78, hy - 150); g.lineTo(sx*100, hy - 50); g.closePath(); g.fill(); g.fillStyle = half ? '#4a4a52' : '#e8c8cc'; g.beginPath(); g.moveTo(sx*54, hy - 72); g.lineTo(sx*78, hy - 124); g.lineTo(sx*90, hy - 66); g.closePath(); g.fill(); }
  ell(0, hy, 112, 100, rg(-30, hy - 40, 120, F, Fd)); ell(0, hy + 42, 56, 40, half ? '#9a9aa2' : '#eef0f6');
  rr(-96, hy - 92, 192, 46, NV, 14); rr(-112, hy - 54, 224, 16, NVd, 8); badge(g, 0, hy - 70, 1.1, false, false); g = c;
  if (!half){
    for (const s2 of [-1, 1]){ ell(s2*40, hy - 6, 12, 14, '#1a1a22'); ell(s2*40 - 4, hy - 11, 4, 4, '#fff'); ell(s2*68, hy + 28, 16, 9, 'rgba(255,140,150,.45)'); }
    ell(0, hy + 26, 14, 10, '#2a2a30'); g.strokeStyle = '#2a2a30'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-18, hy + 50); g.quadraticCurveTo(0, hy + 64, 18, hy + 50); g.stroke();
    badge(g, -70, 20, 1.6, false, false); g = c; }
  else {
    for (const s2 of [-1, 1]){ ell(s2*42, hy - 8, 16, 16, '#14141a'); ell(s2*42, hy - 8, 12, 12, '#2a2a34'); g.strokeStyle = '#d8d0c4'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(s2*42 - 6, hy - 14); g.lineTo(s2*42 + 6, hy - 2); g.moveTo(s2*42 + 6, hy - 14); g.lineTo(s2*42 - 6, hy - 2); g.stroke(); }
    ell(0, hy + 26, 14, 10, '#0a0a0e'); g.strokeStyle = '#0a0a0e'; g.lineWidth = 4; g.beginPath(); g.moveTo(-26, hy + 54); g.quadraticCurveTo(0, hy + 46, 26, hy + 60); g.stroke();
    const seam = () => { g.beginPath(); g.moveTo(-6, hy - 100); g.quadraticCurveTo(-74, hy + 40, -58, 40); g.quadraticCurveTo(-40, 120, 0, 180); g.quadraticCurveTo(40, 120, 58, 40); g.quadraticCurveTo(74, hy + 40, 6, hy - 100); g.closePath(); };
    g.fillStyle = '#030306'; seam(); g.fill();
    g.strokeStyle = '#d8d0c4'; g.lineWidth = 3; for (let k = 0; k < 14; k++){ const yy = hy - 80 + k*24, w = 40 + Math.sin(k/13*Math.PI)*26; g.beginPath(); g.moveTo(-w, yy); g.lineTo(-w + 12, yy + 6); g.moveTo(w, yy); g.lineTo(w - 12, yy + 6); g.stroke(); }
    g.save(); seam(); g.clip();
    ell(0, -40, 50, 92, lg(0, -130, 0, 50, '#f0eadf', '#a8a296')); for (const s2 of [-1, 1]){ ell(s2*18, -70, 11, 6, '#f8f6f0'); ell(s2*18, -70, 4, 4, '#1a1010'); ell(s2*18, -62, 12, 3, 'rgba(60,40,40,.35)'); } g.strokeStyle = '#2a1010'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(-34, -24); g.quadraticCurveTo(0, 4, 34, -24); g.stroke(); for (let k = 0; k < 11; k++){ g.beginPath(); g.moveTo(-30 + k*6, -20 + Math.sin(k/10*Math.PI)*10); g.lineTo(-30 + k*6, -14 + Math.sin(k/10*Math.PI)*12); g.stroke(); } g.restore();
    for (const [sx, yy] of [[-1, -40], [1, -10], [-1, 60], [1, 90]]){ g.strokeStyle = '#d8d2c8'; g.lineCap = 'round'; for (let f = 0; f < 4; f++){ g.lineWidth = 5; g.beginPath(); g.moveTo(sx*6, yy + f*8); g.quadraticCurveTo(sx*40, yy + f*8 - 10, sx*54, yy + f*9 + 6); g.stroke(); } }
    badge(g, -70, 20, 2.2, true, true); g = c;
    for (const [bx2, by2, tx, rot, sc] of [[-260, -40, '도망가', -.12, 1.3], [-300, 90, '문 열지 마', .08, 1.1], [-210, 200, '그건 내가 아니야', -.05, 1], [210, -330, '도망가...', .1, 1.1], [260, -60, '나는 여기 있어', -.08, 1], [230, 140, '도망가!', .06, 1.3], [-190, -330, '열면 바뀌어', -.1, 1]]){ bubble(g, bx2, by2, tx, sc, rot, bx2 < 0 ? 1 : -1, R() < .35, .95); g = c; }
    g.strokeStyle = 'rgba(244,240,234,.5)'; g.lineWidth = 2; g.setLineDash([4, 6]); for (const [bx2, by2] of [[-260, -40], [-300, 90], [-210, 200]]){ g.beginPath(); g.moveTo(-70, 20); g.lineTo(bx2 + 30, by2 + 20); g.stroke(); } g.setLineDash([]); }
  g.restore(); }

// 한 번 그려 둔 몸 그림: {cv, s, ox, oy} · 그릴 땐 drawImage(cv, x - ox/s*S, ...) 대신 wolfImg 사용
const CACHE = {}; let fontsOk = false;
try { document.fonts?.ready?.then(() => { fontsOk = true; for (const k in CACHE) delete CACHE[k]; }); } catch(e){}
const BX0 = -470, BY0 = -570, BW = 940, BH = 940; // 그림 범위 (늑대 단위)
export function wolfCanvas(half, S, res = 2.4){ const k = `${half ? 1 : 0}`; let o = CACHE[k];
  if (!o){ const cv = document.createElement('canvas'), m = S*res; cv.width = Math.ceil(BW*m); cv.height = Math.ceil(BH*m); const c = cv.getContext('2d'); c.scale(m, m); c.translate(-BX0, -BY0); wolf(c, half); o = CACHE[k] = {cv, m}; }
  return o; }
// 몸 원점 (ox, oy) 에 S 크기로 그려요
export function drawWolf(c, half, ox, oy, S){ const o = wolfCanvas(half, S); c.drawImage(o.cv, ox + BX0*S, oy + BY0*S, BW*S, BH*S); }
// 수갑 (고리 둘 + 사슬)
export function cuff(c, x, y, a, al, s = 1, CR = 30, CG = 46){ const ax = Math.cos(a)*CG*s, ay = Math.sin(a)*CG*.6*s; c.save(); c.globalAlpha = al; c.strokeStyle = '#c8ccd8'; c.lineWidth = 7*s; for (const s2 of [-1, 1]){ c.beginPath(); c.ellipse(x + s2*ax, y + s2*ay, CR*s, CR*.6*s, 0, 0, 7); c.stroke(); } c.lineWidth = 3; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(x - ax*.6, y - ay*.6); c.lineTo(x + ax*.6, y + ay*.6); c.stroke(); c.restore(); }
