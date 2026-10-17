// 밤이??? (반세라) 보스 그림: 고슴도치 꽃집 주인 (평소 · 변신) · 뒷모습 가시 공 · 디기탈리스 · 시드는 꽃
// 무거운 몸 그림은 처음 한 번 캔버스에 그려 두고 drawImage 해요 (sprite)
let g = null, sd = 53;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, u) => a + (b - a)*u;
const ease = u => { u = cl(u); return u*u*(3 - 2*u); };
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, 7); g.fillStyle = f; g.fill(); };
const rr = (x, y, w, h, f, r = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col) => { g.save(); g.font = `bold ${s}px "Dongle",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
const hexRgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const cmix = (a, b, u) => { const p = hexRgb(a), q = hexRgb(b); u = cl(u); return `rgb(${Math.round(mix(p[0], q[0], u))},${Math.round(mix(p[1], q[1], u))},${Math.round(mix(p[2], q[2], u))})`; };

function bloom(x, y, r, col, core = '#f4d060'){ for (let k = 0; k < 5; k++){ const a = k/5*6.28; ell(x + Math.cos(a)*r*.6, y + Math.sin(a)*r*.6, r*.55, r*.4, col, a); } ell(x, y, r*.3, r*.3, core); }
function foxBell0(x, y, s, rot, col = '#b050c0'){ g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.strokeStyle = '#2a3a1a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -10); g.lineTo(0, -6); g.stroke();
  g.fillStyle = lg(-8, -6, 8, 10, col, '#3a0840'); g.beginPath(); g.moveTo(-3, -7); g.bezierCurveTo(-7, -4, -7, 4, -10, 10); g.quadraticCurveTo(0, 14, 10, 10); g.bezierCurveTo(7, 4, 7, -4, 3, -7); g.closePath(); g.fill();
  ell(0, 10, 7, 2.6, '#1a0420'); g.fillStyle = 'rgba(255,220,255,.25)'; g.beginPath(); g.ellipse(-3, -1, 1.4, 5, .2, 0, 7); g.fill(); g.fillStyle = 'rgba(250,200,250,.85)'; for (let d = 0; d < 3; d++){ g.beginPath(); g.arc(-2.5 + d*2.5, 9.6, .8, 0, 7); g.fill(); } g.restore(); }
// 디기탈리스 한 송이 (밖에서 쓰는 것: 덩굴 끝 · 씨앗)
export function foxBell(c, x, y, s, rot, col){ const o = g; g = c; foxBell0(x, y, s, rot, col); g = o; }
export function flower(c, x, y, r, col, core){ const o = g; g = c; bloom(x, y, r, col, core); g = o; }

function pots(half){ g.save(); g.scale(1, .22); ell(0, 1600, 280, 240, 'rgba(0,0,0,.65)'); g.restore();
  g.fillStyle = lg(-220, 250, 220, 340, half ? '#3a2a30' : '#b8705a', half ? '#140a10' : '#6a3a2e'); g.beginPath(); g.moveTo(-230, 250); g.lineTo(230, 250); g.lineTo(200, 350); g.lineTo(-200, 350); g.closePath(); g.fill(); rr(-240, 238, 480, 24, half ? '#4a3038' : '#c8806a', 8);
  for (let k = 0; k < 14; k++){ const x = -210 + k*32, y = 236 - (k%3)*8; if (half){ g.strokeStyle = '#3a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 6, y - 22); g.stroke(); for (let j = 0; j < 3; j++) ell(x + (R() - .5)*30, y + 6 + R()*14, 5, 2.5, 'rgba(110,104,110,.9)', R()*3); }
    else bloom(x, y - 6, 13, ['#e8a0c8', '#c8a0e8', '#f4d050'][k%3]); } }

// opt: {noTea:true} 찻주전자 없이 (쓰러진 척 · 물 줄 때 내려놓아요)
function hedgehog(half, opt = {}){ sd = 53;
  pots(half);
  if (half){ const au = g.createRadialGradient(0, -60, 30, 0, -60, 420); au.addColorStop(0, 'rgba(150,40,190,.35)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-440, -480, 880, 860); }
  const SP = half ? '#1a1018' : '#7a5238', SPd = half ? '#05020a' : '#3a2416', FUR = half ? '#a89088' : '#e8c9a6', FURd = half ? '#4a3a3a' : '#b08a68';
  g.save(); for (let k = 0; k < 46; k++){ const a = Math.PI*.95 + k/45*Math.PI*1.1, r0 = 150 + (k%3)*8, L = half ? 90 + (k%5)*26 : 46 + (k%4)*8; const bx = Math.cos(a)*r0, by = -70 + Math.sin(a)*r0*1.05;
    g.fillStyle = lg(bx, by, bx + Math.cos(a)*L, by + Math.sin(a)*L, SP, SPd); g.beginPath(); g.moveTo(bx - Math.sin(a)*14, by + Math.cos(a)*14); if (half){ g.quadraticCurveTo(bx + Math.cos(a + .5)*L*.6, by + Math.sin(a + .5)*L*.6, bx + Math.cos(a + .2)*L, by + Math.sin(a + .2)*L); } else g.lineTo(bx + Math.cos(a)*L, by + Math.sin(a)*L); g.lineTo(bx + Math.sin(a)*14, by - Math.cos(a)*14); g.closePath(); g.fill();
    if (half && k%4 === 0) foxBell0(bx + Math.cos(a + .2)*L, by + Math.sin(a + .2)*L + 10, 1.6, a - Math.PI/2);
    if (half && k%3 === 1){ g.strokeStyle = '#05020a'; g.lineWidth = 2; for (let j = 1; j < 4; j++){ const px = bx + Math.cos(a + .3)*L*j/4, py = by + Math.sin(a + .3)*L*j/4; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a + 1.6)*10, py + Math.sin(a + 1.6)*10); g.stroke(); } } }
  g.restore();
  for (const s2 of [-1, 1]) ell(s2*56, 220, 36, 26, FURd);
  ell(0, 60, 150, 170, rg(-30, 20, 180, FUR, FURd));
  g.fillStyle = half ? '#4a2a38' : '#c84a7a'; g.beginPath(); g.moveTo(-90, -20); g.lineTo(90, -20); g.lineTo(120, 220); g.lineTo(-120, 220); g.closePath(); g.fill(); g.strokeStyle = half ? '#2a1420' : '#f8d8e4'; g.lineWidth = 6; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(-112, 210); g.lineTo(112, 210); g.stroke(); g.setLineDash([]);
  for (const s2 of [-1, 1]){ g.fillStyle = half ? '#3a2030' : '#b03a64'; g.fillRect(s2*58 - 10, -100, 20, 84); }
  rr(-54, 60, 108, 50, half ? '#2a1420' : '#f4d8e4', 8); txt(half ? '약초차' : '밤이', 0, 87, 40, half ? '#9adc6a' : '#b03a64');
  if (half) for (let k = 0; k < 10; k++){ g.fillStyle = `rgba(${90 + R()*40},${160 + R()*40},${60},.55)`; g.beginPath(); g.ellipse(-90 + R()*180, 0 + R()*200, 10 + R()*16, 5 + R()*8, R()*3, 0, 7); g.fill(); }
  if (half){ g.strokeStyle = '#e8e0d0'; g.lineWidth = 3; for (let k = 0; k < 8; k++){ g.beginPath(); g.moveTo(-10, -90 + k*14); g.lineTo(10, -84 + k*14); g.stroke(); } g.fillStyle = '#05020a'; g.beginPath(); g.moveTo(-4, -40); g.quadraticCurveTo(-26, -10, -2, 30); g.quadraticCurveTo(22, -10, -4, -40); g.fill(); for (let k = 0; k < 6; k++){ const yy = -30 + k*10, sd2 = k%2 ? 1 : -1; g.beginPath(); g.moveTo(-4, yy); g.lineTo(-4 + sd2*30, yy - 6); g.lineTo(-4, yy + 5); g.closePath(); g.fill(); } foxBell0(-4 + 30, -40, 1.4, .4); }
  // 왼팔 · 꽃다발
  g.save(); g.translate(-150, 20); g.rotate(.35); ell(0, 40, 30, 70, rg(0, 30, 70, FUR, FURd)); g.restore();
  g.save(); g.translate(-210, 40); g.rotate(-.35); g.fillStyle = half ? '#6a5a64' : '#f4ecf0'; g.beginPath(); g.moveTo(-14, 60); g.lineTo(14, 60); g.lineTo(44, -30); g.lineTo(-44, -30); g.closePath(); g.fill(); g.fillStyle = half ? '#0a0608' : '#b03a64'; g.fillRect(-16, 30, 32, 10);
    for (let k = 0; k < 9; k++){ const bx = -34 + (k%5)*17, by = -40 - Math.floor(k/5)*22 - (k%2)*6; g.strokeStyle = '#4a6a3a'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(bx, by); g.stroke(); if (!half) bloom(bx, by, 14, ['#c8a0e8', '#e8a0c8', '#f4d050'][k%3]); else foxBell0(bx, by + 8, 1.4, (R() - .5)*.6, '#6a5070'); } g.restore();
  ell(-200, 70, 24, 20, FURd);
  if (half) for (let k = 0; k < 22; k++){ const px = -260 + R()*120, py = 80 + R()*200; ell(px, py, 5, 2.4, `rgba(${110 + R()*30},${100 + R()*20},${110 + R()*30},${.5 + R()*.5})`, R()*3); }
  // 오른팔 · 찻주전자
  g.save(); g.translate(150, 20); g.rotate(-.35); ell(0, 40, 30, 70, rg(0, 30, 70, FUR, FURd)); g.restore();
  if (!opt.noTea){ g.save(); g.translate(220, 60); ell(0, -24, 50, 40, lg(-50, -60, 50, 10, half ? '#5a4a60' : '#f8f0f8', half ? '#1a1020' : '#b0a0b8')); g.fillStyle = half ? '#4a3a50' : '#e8dce8'; g.beginPath(); g.moveTo(44, -24); g.quadraticCurveTo(80, -28, 88, -64); g.lineTo(78, -64); g.quadraticCurveTo(70, -40, 44, -10); g.fill(); ell(0, -64, 22, 8, half ? '#3a2a40' : '#d8c8dc'); ell(0, -74, 7, 7, '#b03a64'); for (let k = 0; k < 4; k++) bloom(-26 + k*17, -22 + (k%2)*10, 7, half ? '#5a3a6a' : '#c88ad8'); g.restore(); }
  ell(190, 80, 24, 20, FURd);
  if (half){ for (let k = 0; k < 14; k++){ const px = 300 + Math.sin(k*.8)*26 - k*4, py = -8 - k*24, rad = 14 + k*3; const q = g.createRadialGradient(px, py, 2, px, py, rad); q.addColorStop(0, `rgba(140,235,100,${.42 - k*.022})`); q.addColorStop(1, 'rgba(80,180,50,0)'); g.fillStyle = q; g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill(); }
    for (let k = 0; k < 3; k++){ const cx = 230 + k*60, cy = 210 + (k%2)*16; g.save(); g.translate(cx, cy); ell(0, 2, 26, 7, '#3a2a40'); g.fillStyle = lg(-18, -24, 18, 0, '#6a5a70', '#2a1a30'); g.beginPath(); g.moveTo(-19, -24); g.lineTo(19, -24); g.quadraticCurveTo(18, 0, 0, 2); g.quadraticCurveTo(-18, 0, -19, -24); g.fill(); ell(0, -24, 18, 5, '#7ad040'); const gl = g.createRadialGradient(0, -24, 2, 0, -24, 30); gl.addColorStop(0, 'rgba(140,255,90,.5)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(-30, -54, 60, 60); g.restore(); } }
  // 머리
  ell(0, -150, 112, 100, rg(-30, -190, 120, FUR, FURd));
  for (let k = 0; k < 9; k++){ const a = Math.PI*1.15 + k/8*Math.PI*.7, bx = Math.cos(a)*96, by = -150 + Math.sin(a)*86, L = half ? 70 : 38; g.fillStyle = lg(bx, by, bx + Math.cos(a)*L, by + Math.sin(a)*L, SP, SPd); g.beginPath(); g.moveTo(bx - Math.sin(a)*12, by + Math.cos(a)*12); g.lineTo(bx + Math.cos(a)*L, by + Math.sin(a)*L); g.lineTo(bx + Math.sin(a)*12, by - Math.cos(a)*12); g.closePath(); g.fill(); }
  for (const s2 of [-1, 1]){ ell(s2*80, -226, 22, 20, FURd); ell(s2*80, -224, 12, 11, half ? '#3a2a30' : '#f0b0c0'); }
  if (!half){
    for (const s2 of [-1, 1]){ ell(s2*42, -150, 12, 14, '#1a1012'); ell(s2*42 - 3, -155, 4, 4, '#fff'); g.fillStyle = FUR; g.fillRect(s2*42 - 14, -168, 28, 10); g.strokeStyle = '#3a2418'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(s2*42 - 14, -159); g.lineTo(s2*42 + 14, -161); g.stroke(); ell(s2*72, -118, 18, 10, 'rgba(240,120,150,.45)'); }
    ell(0, -112, 14, 10, '#3a2020'); g.strokeStyle = '#3a2020'; g.lineWidth = 4; g.beginPath(); g.moveTo(-14, -90); g.quadraticCurveTo(0, -94, 14, -88); g.stroke();
    bloom(60, -236, 26, '#f08ab0', '#fff0a0'); bloom(90, -214, 16, '#c8a0e8', '#fff0a0'); }
  else {
    for (const s2 of [-1, 1]){ ell(s2*42, -150, 22, 18, '#05020a'); ell(s2*42, -150, 11, 11, '#c060ff'); ell(s2*42, -150, 3, 7, '#05020a'); const gl = g.createRadialGradient(s2*42, -150, 2, s2*42, -150, 40); gl.addColorStop(0, 'rgba(200,100,255,.55)'); gl.addColorStop(1, 'rgba(160,60,255,0)'); g.fillStyle = gl; g.fillRect(s2*42 - 40, -190, 80, 80); }
    ell(0, -112, 14, 10, '#1a0a10');
    g.strokeStyle = '#1a0a10'; g.lineWidth = 5; g.beginPath(); g.moveTo(-64, -98); g.quadraticCurveTo(0, -56, 64, -98); g.stroke(); g.strokeStyle = '#e8e0d0'; g.lineWidth = 2.5; for (let k = 0; k < 9; k++){ const tx = -56 + k*14, ty = -98 + 30*Math.sin((k + .5)/9*Math.PI)*1.1; g.beginPath(); g.moveTo(tx - 4, ty - 7); g.lineTo(tx + 4, ty + 7); g.stroke(); }
    for (let k = 0; k < 7; k++) foxBell0(30 + k*12, -232 - (k%2)*12, 1.8, (k - 3)*.18);
    g.strokeStyle = '#2a3a1a'; g.lineWidth = 3; g.beginPath(); g.moveTo(26, -220); g.quadraticCurveTo(70, -260, 120, -228); g.stroke();
    for (const s2 of [-1, 1]){ g.strokeStyle = 'rgba(130,220,90,.85)'; g.lineWidth = 4; g.beginPath(); g.moveTo(s2*42, -134); g.quadraticCurveTo(s2*46, -110, s2*40, -80); g.stroke(); ell(s2*40, -78, 4, 5, 'rgba(130,220,90,.9)'); } }
}
// 뒷모습: 등 전체가 가시 공 (가시 등 패턴에서 등을 돌릴 때 겹쳐 그려요)
function hedgeBack(half){ sd = 91; const SP = half ? '#1a1018' : '#6a4630', SPd = half ? '#05020a' : '#2a180c', FUR = half ? '#8a7470' : '#c8a886';
  ell(0, 60, 156, 176, rg(-30, 20, 180, SPd, '#140a06'));
  for (let ring = 0; ring < 4; ring++){ const n = 26 - ring*4; for (let k = 0; k < n; k++){ const a = k/n*Math.PI*2 + ring*.4, rr0 = 150 - ring*36, cx = Math.cos(a)*rr0*.95, cy = -40 + Math.sin(a)*rr0*1.1, L = (half ? 70 : 46) - ring*6, aa = a - .3;
    g.fillStyle = lg(cx, cy, cx + Math.cos(aa)*L, cy + Math.sin(aa)*L, SP, SPd); g.beginPath(); g.moveTo(cx - Math.sin(aa)*11, cy + Math.cos(aa)*11); g.lineTo(cx + Math.cos(aa)*L, cy + Math.sin(aa)*L - 14); g.lineTo(cx + Math.sin(aa)*11, cy - Math.cos(aa)*11); g.closePath(); g.fill(); } }
  for (let k = 0; k < 28; k++){ const a = Math.PI*1.02 + k/27*Math.PI*.96, bx = Math.cos(a)*120, by = -150 + Math.sin(a)*120, L = half ? 90 : 52; g.fillStyle = lg(bx, by, bx + Math.cos(a)*L, by + Math.sin(a)*L, SP, SPd); g.beginPath(); g.moveTo(bx - Math.sin(a)*13, by + Math.cos(a)*13); g.lineTo(bx + Math.cos(a)*L, by + Math.sin(a)*L); g.lineTo(bx + Math.sin(a)*13, by - Math.cos(a)*13); g.closePath(); g.fill();
    if (half && k%4 === 1) foxBell0(bx + Math.cos(a)*L, by + Math.sin(a)*L + 8, 1.6, a - Math.PI/2); }
  for (const s2 of [-1, 1]) ell(s2*80, -230, 22, 20, FUR);
  ell(0, -130, 118, 100, rg(-20, -170, 120, SP, SPd));
}

// 스프라이트 (처음 한 번): 0 평소 · 1 변신 · 2 평소 뒷모습 · 3 변신 뒷모습 · 4 평소 (주전자 없이) · 5 변신 (주전자 없이)
export const ART = { X0: -420, Y0: -480, W: 840, H: 860 };
const SPR = {};
export function sprite(i, res){ const key = i + ':' + res; if (SPR[key]) return SPR[key];
  const cv = document.createElement('canvas'); cv.width = Math.ceil(ART.W*res); cv.height = Math.ceil(ART.H*res); const o = g; g = cv.getContext('2d'); g.scale(res, res); g.translate(-ART.X0, -ART.Y0);
  try { if (i === 2 || i === 3){ pots(i === 3); hedgeBack(i === 3); } else hedgehog(i%2 === 1, {noTea:i >= 4}); } catch(e){ console.error(e); }
  g = o; SPR[key] = cv; return cv; }

// 꽃 하나: grow (0~1) · wilt (0~1 시듦) · nPet (남은 꽃잎 수)
export function wiltFlower(c, x, y, r, col, grow, wilt, al, side = 1, nPet = 5){ if (al <= 0 || grow <= 0) return; const o = g; g = c; g.save(); g.globalAlpha = cl(al);
  const h = r*2.6*grow, ang = -Math.PI/2 + side*wilt*2.1, hx = x + Math.cos(ang)*h*.9 + side*wilt*r*.4, hy = y + Math.sin(ang)*h*.9 + wilt*h*.25;
  g.strokeStyle = cmix('#3f6a2a', '#5a4630', wilt*1.3); g.lineWidth = Math.max(1.2, r*.18); g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + side*wilt*r*.3, y - h*.75, hx, hy); g.stroke();
  for (const s of [-1, 1]){ const ly = y - h*(s > 0 ? .3 : .5), lx = x + side*wilt*r*.1; ell(lx + s*r*.45, ly + wilt*r*.4, r*.45*grow, r*.18*grow, cmix('#4a7a30', '#5a4028', wilt*1.4), s*(.5 + wilt*1.1)); }
  const pc = wilt < .5 ? cmix(col, '#8a5a3a', wilt*2) : cmix('#8a5a3a', '#3e3028', (wilt - .5)*2), pr = r*grow*(1 - wilt*.3);
  for (let k = 0; k < nPet; k++){ const a = k/5*6.283 + wilt*.6, ox = Math.cos(a)*pr*.6*(1 - wilt*.45), oy = Math.sin(a)*pr*.6*(1 - wilt*.55) + wilt*pr*.55;
    ell(hx + ox, hy + oy, pr*.55*(1 - wilt*.25), pr*.4*(1 - wilt*.5), pc, a + wilt*1.2); }
  ell(hx, hy + wilt*pr*.2, pr*.28, pr*.28, cmix('#f4d060', '#4a3a22', wilt*1.5)); g.restore(); g = o; }

// 가시덩굴 한 줄 (굵기가 끝으로 갈수록 가늘어져요)
export function vinePath(c, pts, w0, dark, lite, thorns){ c.lineCap = 'round'; c.lineJoin = 'round';
  for (const [col, wk] of [[dark, 1], [lite, .38]]){ c.strokeStyle = col; for (let i = 1; i < pts.length; i++){ c.lineWidth = Math.max(1, w0*wk*(1 - i/pts.length*.8)); c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke(); } }
  c.fillStyle = thorns; for (let i = 1; i < pts.length - 1; i += 2){ const [x, y] = pts[i], [x2, y2] = pts[i + 1], a = Math.atan2(y2 - y, x2 - x) + (i % 4 === 1 ? 1.57 : -1.57), s = w0*(1 - i/pts.length*.7)*.9; c.beginPath(); c.moveTo(x - Math.cos(a - 1.57)*s*.4, y - Math.sin(a - 1.57)*s*.4); c.lineTo(x + Math.cos(a)*s*1.3 + Math.cos(a - 1.57)*s*.5, y + Math.sin(a)*s*1.3 + Math.sin(a - 1.57)*s*.5); c.lineTo(x + Math.cos(a - 1.57)*s*.4, y + Math.sin(a - 1.57)*s*.4); c.fill(); } }

// 가족 액자 (둘): 변신 때 초록 독이 번져 흘러요 · 왼쪽 사람(남편) 얼굴에 검은 줄
export function portrait(c, x, y){ c.save(); c.translate(x, y);
  c.fillStyle = '#3a2418'; c.fillRect(-84, -50, 168, 100); c.fillStyle = '#5a3a28'; c.fillRect(-78, -44, 156, 88); c.fillStyle = '#2a2228'; c.fillRect(-72, -38, 144, 76);
  const o = g; g = c;
  for (const [px, dead] of [[-34, true], [34, false]]){ g.save(); g.translate(px, 4); for (let k = 0; k < 9; k++){ const a = Math.PI*1.1 + k/8*Math.PI*.8; g.fillStyle = '#6a4a38'; g.beginPath(); g.moveTo(Math.cos(a)*14, Math.sin(a)*14 - 4); g.lineTo(Math.cos(a)*24, Math.sin(a)*24 - 4); g.lineTo(Math.cos(a + .2)*14, Math.sin(a + .2)*14 - 4); g.fill(); }
    ell(0, -4, 16, 15, dead ? '#c8b8a0' : '#e8c9a6'); ell(-5, -6, 2, 2.5, '#1a1012'); ell(5, -6, 2, 2.5, '#1a1012'); ell(0, 24, 19, 14, dead ? '#5a6a8a' : '#c84a7a'); g.restore();
    if (dead){ g.strokeStyle = '#111'; g.lineWidth = 5; g.beginPath(); g.moveTo(px - 20, -26); g.lineTo(px + 18, 30); g.stroke(); } }
  g = o; c.restore(); }
export { cl, mix, ease, R };
