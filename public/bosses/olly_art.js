// 올리??? (오유리) 보스 그림 · 처음 한 번 캔버스에 그려 두고 drawImage 해요 (public/bosses/olly.js 가 써요)
// 사슴 관장: 액자 몰딩 뿔 · 도자기 가면 · 벨벳 연미복 · 회중시계 (반 이후: 가면이 깨져 덜 그린 캔버스 얼굴 + 진짜 눈)
let g = null, sd = 31;
const R = () => (sd = (sd*16807) % 2147483647)/2147483647;
const F = (s, w = 'bold') => `${w} ${s}px "Dongle",sans-serif`;
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col) => { g.save(); g.font = F(s); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
export const GOLD = ['#fff0b0', '#e8c060', '#a87a22', '#5a3a0a'];
const FUR = '#a98366', FURD = '#5a4030', VEL = '#3a1830';
const goldGrad = (x0, y0, x1, y1) => lg(x0, y0, x1, y1, GOLD[2], GOLD[0], GOLD[1], GOLD[3], GOLD[1]);
export const OILC = ['#5a1830', '#2a1a40', '#b0782a', '#7a1020', '#3a2a58', '#c8a060'];

function antler(x, y, s, dir, broken){ g.save(); g.translate(x, y); g.scale(dir*s, s); g.lineCap = 'round'; g.lineJoin = 'round';
  const br = broken ? [[[0, 0], [18, -60], [12, -112]], [[14, -70], [56, -92]]] : [[[0, 0], [18, -60], [10, -130], [40, -200]], [[14, -70], [70, -100], [96, -94]], [[12, -120], [60, -160], [74, -190]], [[24, -168], [8, -230]]];
  for (const [w, col] of [[22, '#1a0e04'], [16, null], [5, broken ? 'rgba(160,140,110,.5)' : 'rgba(255,240,180,.7)']]){ g.strokeStyle = col || (broken ? lg(-20, -120, 60, 0, '#4a3a20', '#7a6a40', '#2a2010') : goldGrad(-20, -230, 100, 0)); g.lineWidth = w; for (const b of br){ g.beginPath(); g.moveTo(...b[0]); for (const p of b.slice(1)) g.lineTo(...p); g.stroke(); } }
  for (let i = 0; i < 18; i++){ g.fillStyle = '#6a4a2a'; g.beginPath(); g.arc(10 + R()*(broken ? 30 : 50), -R()*(broken ? 100 : 200), 2 + R()*4, 0, 7); g.fill(); }
  if (broken){ g.fillStyle = '#e8d8b0'; g.beginPath(); g.moveTo(2, -108); g.lineTo(8, -126); g.lineTo(14, -114); g.lineTo(20, -130); g.lineTo(24, -110); g.closePath(); g.fill(); g.beginPath(); g.moveTo(52, -100); g.lineTo(64, -98); g.lineTo(58, -86); g.closePath(); g.fill(); }
  g.restore(); }
function tagCard(x, y, t, rot, fake){ g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = 'rgba(30,20,10,.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -18); g.lineTo(0, -6); g.stroke(); g.fillStyle = fake ? '#f0d0c8' : '#efe4c8'; g.fillRect(-22, -6, 44, 20);
  txt(t, 0, 5, 17, fake ? '#b01010' : '#4a3020'); if (fake){ g.strokeStyle = '#b01010'; g.lineWidth = 2; g.beginPath(); g.moveTo(-18, -2); g.lineTo(18, 10); g.stroke(); } g.restore(); }
function humanEye(x, y, r){ ell(x, y, r*1.3, r*.95, '#120608'); const w = g.createRadialGradient(x, y, 1, x, y, r); w.addColorStop(0, '#f4ece4'); w.addColorStop(1, '#c8a8a0'); ell(x, y, r*1.1, r*.78, w);
  g.strokeStyle = 'rgba(170,40,50,.55)'; g.lineWidth = .8; for (let i = 0; i < 7; i++){ const a = R()*7; g.beginPath(); g.moveTo(x + Math.cos(a)*r, y + Math.sin(a)*r*.7); g.lineTo(x + Math.cos(a)*r*.5, y + Math.sin(a)*r*.4); g.stroke(); }
  ell(x - r*.1, y, r*.42, r*.42, '#3a5a4a'); ell(x - r*.1, y, r*.18, r*.18, '#050304'); ell(x - r*.25, y - r*.15, r*.08, r*.08, '#fff'); }
function canvasFace(cx, cy, rx, ry){ g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.clip(); g.fillStyle = '#e8dcc4'; g.fillRect(cx - rx, cy - ry, rx*2, ry*2);
  g.strokeStyle = 'rgba(120,100,70,.25)'; g.lineWidth = 1; for (let i = -rx; i < rx; i += 4){ g.beginPath(); g.moveTo(cx + i, cy - ry); g.lineTo(cx + i, cy + ry); g.stroke(); } for (let j = -ry; j < ry; j += 4){ g.beginPath(); g.moveTo(cx - rx, cy + j); g.lineTo(cx + rx, cy + j); g.stroke(); }
  for (let k = 0; k < 14; k++){ g.strokeStyle = `rgba(${150 + R()*60},${100 + R()*40},${80 + R()*30},.5)`; g.lineWidth = 8 + R()*10; g.lineCap = 'round'; g.beginPath(); const x = cx - rx*.6 + R()*rx*1.2, y = cy - ry*.5 + R()*ry; g.moveTo(x, y); g.lineTo(x + (R() - .5)*60, y + (R() - .5)*20); g.stroke(); }
  g.strokeStyle = 'rgba(40,30,30,.7)'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(cx, cy + 6, rx*.62, ry*.76, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx - 20, cy + 40); g.quadraticCurveTo(cx, cy + 48, cx + 20, cy + 40); g.stroke(); g.beginPath(); g.moveTo(cx, cy - 4); g.lineTo(cx - 6, cy + 22); g.lineTo(cx + 4, cy + 24); g.stroke();
  g.setLineDash([3, 3]); g.beginPath(); g.ellipse(cx + 26, cy - 10, 14, 8, 0, 0, 7); g.stroke(); g.setLineDash([]); g.restore();
  const gl = g.createRadialGradient(cx - 26, cy - 10, 4, cx - 26, cy - 10, 46); gl.addColorStop(0, 'rgba(120,255,170,.55)'); gl.addColorStop(1, 'rgba(120,255,170,0)'); g.fillStyle = gl; g.fillRect(cx - 76, cy - 60, 100, 100); humanEye(cx - 26, cy - 10, 19); }
function mask(cx, cy, rx, ry, broken){ g.save();
  if (broken){ g.translate(cx + rx, cy - ry*.3); g.rotate(.32); g.translate(-cx - rx, -cy + ry*.3); g.beginPath(); g.moveTo(cx + rx*.22, cy - ry*.05); g.lineTo(cx + rx*.5, cy - ry*.4); g.lineTo(cx + rx, cy - ry*.3); g.lineTo(cx + rx, cy + ry*.6); g.lineTo(cx + rx*.55, cy + ry*.85); g.lineTo(cx + rx*.3, cy + ry*.55); g.lineTo(cx + rx*.08, cy + ry*.4); g.closePath(); g.clip(); }
  ell(cx, cy, rx, ry, rg(cx, cy, Math.max(rx, ry), '#fbf6ee', '#c8bcb0'));
  ell(cx - rx*.38, cy - ry*.15, rx*.16, ry*.1, '#1a1018'); ell(cx + rx*.38, cy - ry*.15, rx*.16, ry*.1, '#1a1018');
  ell(cx - rx*.5, cy + ry*.25, rx*.14, ry*.06, 'rgba(230,140,150,.6)'); ell(cx + rx*.5, cy + ry*.25, rx*.14, ry*.06, 'rgba(230,140,150,.6)');
  g.strokeStyle = '#a02030'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - rx*.35, cy + ry*.38); g.quadraticCurveTo(cx, cy + ry*.62, cx + rx*.35, cy + ry*.38); g.stroke();
  g.strokeStyle = 'rgba(40,30,30,.7)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx + rx*.1, cy - ry); g.lineTo(cx + rx*.02, cy - ry*.4); g.lineTo(cx + rx*.2, cy); g.lineTo(cx + rx*.05, cy + ry*.5); g.stroke();
  g.restore(); }
// 보스 몸 (회중시계 판은 따로 · 매 프레임 바늘만 그려요). 원점 = 몸 가운데, 발(받침대 바닥) = y 380
function curator(half){ sd = 31;
  g.save(); g.scale(1, .2); ell(0, 2050, 230, 230, 'rgba(0,0,0,.6)'); g.restore(); g.fillStyle = goldGrad(-160, 300, 160, 360); g.beginPath(); g.roundRect(-160, 300, 320, 70, 8); g.fill(); txt(half ? 'No.317 · 가짜' : 'No.317 · 진품', 0, 336, 36, half ? '#8a1010' : '#3a2408');
  for (const s2 of [-1, 1]){ g.fillStyle = lg(s2*60, 180, s2*60, 300, '#2a1424', '#120810'); g.beginPath(); g.roundRect(s2*60 - 26, 170, 52, 140, 20); g.fill(); ell(s2*60, 304, 34, 14, '#1a0e0a'); }
  g.fillStyle = lg(-140, -60, 140, 200, VEL, '#1a0814'); g.beginPath(); g.moveTo(-120, -40); g.quadraticCurveTo(-150, 120, -100, 210); g.lineTo(100, 210); g.quadraticCurveTo(150, 120, 120, -40); g.quadraticCurveTo(0, -80, -120, -40); g.fill();
  ell(0, 60, 62, 120, rg(0, 60, 120, '#f0dcc0', '#b89a78'));
  for (const s2 of [-1, 1]){ g.fillStyle = '#5a2040'; g.beginPath(); g.moveTo(s2*20, -50); g.lineTo(s2*70, 30); g.lineTo(s2*40, 190); g.lineTo(s2*58, 190); g.lineTo(s2*95, 20); g.closePath(); g.fill(); }
  g.strokeStyle = '#120608'; g.lineWidth = 2.4; for (let i = 0; i < 10; i++){ const yy = -30 + i*22; g.beginPath(); g.moveTo(-8, yy); g.lineTo(8, yy + 8); g.stroke(); }
  for (const s2 of [-1, 1]){ g.fillStyle = lg(0, -30, 0, 160, VEL, '#1a0814'); g.save(); g.translate(s2*120, -10); g.rotate(s2*-.35); g.beginPath(); g.roundRect(-24, 0, 48, 150, 22); g.fill(); ell(0, 160, 26, 22, rg(0, 160, 26, '#c8a080', '#6a4a30')); g.restore(); }
  g.save(); g.translate(-178, 140); g.strokeStyle = '#3a2a1a'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(-20, 50); g.stroke(); ell(-30, 76, 30, 30, goldGrad(-60, 46, 0, 106)); ell(-30, 76, 23, 23, 'rgba(200,220,255,.35)'); g.restore();
  g.save(); g.translate(176, 140); g.rotate(.5); g.fillStyle = '#6a4a2a'; g.fillRect(-4, 0, 8, 80); g.fillStyle = '#c8b090'; g.fillRect(-6, 76, 12, 14); g.fillStyle = '#9a1428'; g.beginPath(); g.ellipse(0, 98, 7, 12, 0, 0, 7); g.fill(); for (let k = 0; k < 3; k++){ g.beginPath(); g.ellipse(2 + k*3, 124 + k*22, 4, 6, 0, 0, 7); g.fill(); } g.restore();
  if (half){ const edge = []; for (let x = -200; x <= 200; x += 16) edge.push([x, 40 + R()*36]);
    g.save(); g.beginPath(); g.moveTo(-200, 340); for (const [x, y] of edge) g.lineTo(x, y); g.lineTo(200, 340); g.closePath(); g.clip();
    const body = () => { g.beginPath(); g.moveTo(-120, -40); g.quadraticCurveTo(-150, 120, -100, 210); g.lineTo(100, 210); g.quadraticCurveTo(150, 120, 120, -40); g.quadraticCurveTo(0, -80, -120, -40); for (const s2 of [-1, 1]) g.roundRect(s2*60 - 26, 170, 52, 140, 20); };
    g.fillStyle = '#e8dcc4'; body(); g.fill(); g.save(); body(); g.clip(); g.strokeStyle = 'rgba(110,90,70,.35)'; g.lineWidth = 1.2; for (let k = -400; k < 400; k += 9){ g.beginPath(); g.moveTo(k, 0); g.lineTo(k + 340, 340); g.stroke(); } g.restore();
    g.strokeStyle = 'rgba(50,40,40,.85)'; g.lineWidth = 2.4; g.setLineDash([14, 5, 3, 5]); body(); g.stroke(); g.beginPath(); g.moveTo(-60, 60); g.lineTo(-38, 190); g.moveTo(60, 60); g.lineTo(38, 190); g.moveTo(0, 60); g.lineTo(0, 200); g.stroke(); g.setLineDash([]);
    txt('(미완성)', 0, 146, 30, 'rgba(60,50,50,.6)'); g.restore();
    edge.forEach(([x, y], i) => { if (x < -140 || x > 140) return; const L = (18 + (i*37)%50)*.9; g.strokeStyle = i%3 ? '#5a1440' : '#a0102a'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y - 4); g.lineTo(x, y + L); g.stroke(); ell(x, y + L + 4, 6, 8, g.strokeStyle); }); }
  // 회중시계 줄 + 금테 (판은 매 프레임)
  g.strokeStyle = GOLD[1]; g.lineWidth = 3; g.setLineDash([5, 3]); g.beginPath(); g.moveTo(56 - 70, 40 - 120); g.quadraticCurveTo(56 - 30, 40 - 30, 56, 40 - 34); g.stroke(); g.setLineDash([]); ell(56, 40, 42, 42, goldGrad(22, 6, 90, 74));
  for (const [tx, ty, rt] of [[-90, 0, -.2], [-70, 120, .15], [90, 110, -.12], [-30, 200, .1], [110, -20, .2]]) tagCard(tx, ty, half ? '가짜' : '진품', rt, half);
  ell(0, -70, 50, 40, rg(0, -70, 50, FUR, FURD));
  for (const s2 of [-1, 1]) antler(s2*58, -200, 1, s2, half);
  for (const s2 of [-1, 1]){ ell(s2*112, -158, 46, 20, rg(s2*112, -158, 46, FUR, FURD), s2*.45); ell(s2*112, -158, 30, 10, '#e8a0a0', s2*.45); }
  ell(0, -150, 100, 110, rg(0, -150, 110, '#c8a080', FURD)); ell(0, -96, 56, 46, rg(0, -96, 56, '#f0dcc0', '#b89a78')); ell(0, -112, 18, 13, '#2a1810');
  g.strokeStyle = '#120608'; g.lineWidth = 2.2; for (let i = 0; i < 9; i++){ const a = Math.PI*1.1 + i*.11; g.beginPath(); g.moveTo(Math.cos(a)*92, -150 + Math.sin(a)*100); g.lineTo(Math.cos(a)*104, -150 + Math.sin(a)*112); g.stroke(); }
  if (half){ canvasFace(0, -160, 72, 82); mask(0, -160, 76, 86, true); g.strokeStyle = '#a0102a'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-28, -160); g.quadraticCurveTo(-34, -120, -30, -84); g.stroke(); ell(-30, -78, 6, 9, '#a0102a');
    for (let k = 0; k < 8; k++){ const px = (R() - .5)*240, py = 260 + R()*40; g.save(); g.translate(px, py); g.rotate(R()*6); g.fillStyle = '#f0e8dc'; g.beginPath(); g.moveTo(0, 0); g.lineTo(14 + R()*14, 4); g.lineTo(6, 12 + R()*10); g.closePath(); g.fill(); g.restore(); } }
  else mask(0, -160, 76, 86, false); }

// 몸 그림 범위 (몸 좌표) · 발 = y 380
export const BX0 = -265, BX1 = 265, BY0 = -445, BY1 = 465, FOOTL = 380, WATCH = [56, 40, 34];
const bossCache = {};
export function bossSprite(half, k){ const key = (half ? 'h' : 'n') + k; if (bossCache[key]) return bossCache[key];
  const c = cv((BX1 - BX0)*k, (BY1 - BY0)*k); g = c.getContext('2d'); g.setTransform(k, 0, 0, k, -BX0*k, -BY0*k); curator(half); g = null; return bossCache[key] = c; }

// 회중시계 판 (매 프레임 · 가벼워요). mode: 'stop' (3:17 에 멈춤) · 'tick' (째깍째깍 가짜) · 'spin' (미친 듯 돎)
export function watchFace(c, x, y, r, mode, T, label){ g = c; g.save(); g.translate(x, y); const s = r/34; g.scale(s, s);
  ell(0, 0, 34, 34, '#efe6d0'); g.fillStyle = '#2a2018'; for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2; g.beginPath(); g.arc(Math.cos(a)*27, Math.sin(a)*27, 2.6, 0, 7); g.fill(); }
  const hands = mode === 'tick' ? [[T*.4 - 1.2, .5], [Math.floor(T*2)*.52, .78]] : mode === 'spin' ? [[T*3, .5], [T*11, .78], [-T*6, .7]] : [[((3 + 17/60)/12)*Math.PI*2 - Math.PI/2, .5], [(17/60)*Math.PI*2 - Math.PI/2, .78]];
  g.strokeStyle = '#1a1410'; g.lineCap = 'round'; hands.forEach(([a, l], i) => { g.globalAlpha = i > 1 ? .4 : 1; g.lineWidth = i%2 ? 3 : 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a)*34*l, Math.sin(a)*34*l); g.stroke(); }); g.globalAlpha = 1;
  if (mode === 'stop'){ g.strokeStyle = 'rgba(40,30,30,.7)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-20, -24); g.lineTo(-6, -8); g.lineTo(-12, 6); g.lineTo(4, 22); g.stroke(); }
  g.fillStyle = '#1a1410'; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill();
  if (label){ const t = mode === 'tick' ? '3:1' + (8 + Math.floor(T*2)%2) : mode === 'spin' ? '?:??' : '3:17'; g.font = F(30); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 5; g.strokeStyle = 'rgba(20,6,12,.85)'; g.strokeText(t, 0, 50); g.fillStyle = mode === 'stop' ? '#f0e0b0' : '#ffb0b0'; g.fillText(t, 0, 50); }
  g.restore(); g = null; }

// 금박 액자 (테두리만) — 가운데는 비어 있어요
function gild(cx, cy, w, h, th){ const x0 = cx - w/2, y0 = cy - h/2;
  g.beginPath(); g.rect(x0 - th, y0 - th, w + th*2, h + th*2); g.rect(x0, y0, w, h); g.fillStyle = goldGrad(x0 - th, y0 - th, x0 + w + th, y0 + h + th); g.fill('evenodd');
  g.lineWidth = 2; g.strokeStyle = 'rgba(70,40,8,.85)'; g.strokeRect(x0, y0, w, h); g.strokeRect(x0 - th, y0 - th, w + th*2, h + th*2);
  g.lineWidth = 1; g.strokeStyle = 'rgba(255,244,190,.55)'; g.strokeRect(x0 - th + 3, y0 - th + 3, w + th*2 - 6, h + th*2 - 6); g.strokeStyle = 'rgba(90,55,10,.6)'; g.strokeRect(x0 - th*.45, y0 - th*.45, w + th*.9, h + th*.9);
  const bead = (x, y) => ell(x, y, th*.16, th*.16, 'rgba(255,236,170,.75)');
  for (let x = x0; x <= x0 + w; x += th*1.1){ bead(x, y0 - th*.45); bead(x, y0 + h + th*.45); } for (let y = y0; y <= y0 + h; y += th*1.1){ bead(x0 - th*.45, y); bead(x0 + w + th*.45, y); }
  for (const [x, y] of [[x0, y0], [x0 + w, y0], [x0, y0 + h], [x0 + w, y0 + h]]){ const ox = x + (x > cx ? th*.5 : -th*.5), oy = y + (y > cy ? th*.5 : -th*.5); for (let i = 0; i < 4; i++){ const a = i*1.5708 + .785; ell(ox + Math.cos(a)*th*.6, oy + Math.sin(a)*th*.6, th*.5, th*.28, goldGrad(ox - th, oy - th, ox + th, oy + th), a); } ell(ox, oy, th*.4, th*.4, '#7a1020'); ell(ox - th*.12, oy - th*.12, th*.14, th*.14, 'rgba(255,220,220,.6)'); }
  g.beginPath(); g.ellipse(cx, y0 - th*.9, th*1.7, th*1.05, 0, 0, 7); g.fillStyle = goldGrad(cx - th*2, y0 - th*2, cx + th*2, y0); g.fill(); g.strokeStyle = 'rgba(70,40,8,.8)'; g.lineWidth = 1.5; g.stroke();
  for (const s of [-1, 1]){ g.beginPath(); g.moveTo(cx + s*th*1.5, y0 - th*.9); g.quadraticCurveTo(cx + s*th*3.2, y0 - th*2.2, cx + s*th*3.4, y0 - th*.6); g.quadraticCurveTo(cx + s*th*2.6, y0 - th*1.1, cx + s*th*2.7, y0 - th*.5); g.lineWidth = th*.3; g.strokeStyle = goldGrad(cx - th*3, y0 - th*2, cx + th*3, y0); g.stroke(); }
  ell(cx, y0 - th*.9, th*.55, th*.4, '#2a0a14'); ell(cx, y0 - th*.95, th*.22, th*.16, '#e0203a'); }
// 걸어 들어가는 액자: 세 장 (테두리 · 빈 캔버스 · 보스 초상) · 크기 FW × FH (월드)
export const FW = 150, FH = 225, FTH = 13;
const frameCache = {};
export function frameArt(kind, half){ const key = kind + (half ? 'h' : 'n'); if (frameCache[key]) return frameCache[key];
  const k = 1.6, pad = FTH*4, c = cv((FW + pad*2)*k, (FH + pad*2)*k); g = c.getContext('2d'); g.setTransform(k, 0, 0, k, pad*k, pad*k);
  if (kind === 'gild'){ g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 10; gild(FW/2, FH/2, FW, FH, FTH); g.shadowBlur = 0; }
  else { const q = g.createRadialGradient(FW/2, FH/2, 8, FW/2, FH/2, FH*.7); q.addColorStop(0, '#3a2430'); q.addColorStop(1, '#0e070c'); g.fillStyle = q; g.fillRect(0, 0, FW, FH);
    if (kind === 'port'){ const sp = bossSprite(half, .5), sw = sp.width, sh = sp.height, sc = Math.min(FW*1.1/sw, FH*.98/sh); g.save(); try { g.filter = 'sepia(.45) saturate(1.35) contrast(1.15)'; } catch(e){} g.drawImage(sp, FW/2 - sw*sc/2, FH - sh*sc + 4, sw*sc, sh*sc); g.restore(); g.filter = 'none';
      sd = 913; g.globalAlpha = .3; g.lineCap = 'round'; for (let i = 0; i < 40; i++){ const x = R()*FW, y = R()*FH, a = R()*3.14, l = (.08 + R()*.18)*FW; g.strokeStyle = OILC[Math.floor(R()*6)]; g.lineWidth = 3 + R()*6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a)*l*.5, y + Math.sin(a + .6)*l*.3, x + Math.cos(a)*l, y + Math.sin(a)*l); g.stroke(); } g.globalAlpha = 1;
      g.fillStyle = 'rgba(120,80,30,.12)'; g.fillRect(0, 0, FW, FH); } }
  g = null; c.pad = pad; c.k = k; return frameCache[key] = c; }
// 액자 그리기 (cx, cy 가운데 · s 크기)
export function drawFrame(c, cx, cy, s, al, pa, half, drain){ if (al <= .01) return; const gl = frameArt('gild', half), em = frameArt('empty', half), pt = frameArt('port', half), w = gl.width/gl.k*s, h = gl.height/gl.k*s, x = cx - w/2, y = cy - h/2;
  c.save(); c.globalAlpha = al; c.drawImage(em, x, y, w, h); if (pa > .01){ c.globalAlpha = al*Math.min(1, pa); c.drawImage(pt, x, y, w, h); c.globalAlpha = al; }
  if (drain > 0){ for (let i = 0; i < 6; i++){ const dx = cx - FW*s*.38 + i*FW*s*.15, L = drain*(26 + ((i*37) % 40))*s*1.6; c.fillStyle = OILC[i % 4]; c.beginPath(); c.roundRect(dx - 3*s, cy + FH*s/2 - 6*s, 6*s, L, 3*s); c.fill(); c.beginPath(); c.ellipse(dx, cy + FH*s/2 - 2*s + L, 5*s, 6*s, 0, 0, 7); c.fill(); } }
  c.drawImage(gl, x, y, w, h); c.restore(); }

// ① 연습 스케치 종이 (#1 ~ #47)
const sheetCache = [];
export function sheet(n){ if (sheetCache[n]) return sheetCache[n]; const k = 2, c = cv(44*k, 52*k); g = c.getContext('2d'); g.setTransform(k, 0, 0, k, 22*k, 26*k);
  g.fillStyle = 'rgba(200,170,255,.35)'; g.fillRect(-19, -23, 38, 46); g.fillStyle = '#efe8f6'; g.fillRect(-14, -18, 28, 36); g.strokeStyle = 'rgba(80,60,90,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-8, -6); g.quadraticCurveTo(0, -14, 8, -4); g.moveTo(-6, 6); g.lineTo(6, 2); g.moveTo(-5, -12); g.lineTo(-9, -16); g.moveTo(5, -12); g.lineTo(9, -16); g.stroke();
  txt('#' + n, 0, 12, 15, '#5a3a6a'); g = null; return sheetCache[n] = c; }
// ⑥ 물감 통
const canCache = {};
export function paintCan(col, name){ if (canCache[col]) return canCache[col]; const k = 2, c = cv(56*k, 64*k); g = c.getContext('2d'); g.setTransform(k, 0, 0, k, 28*k, 54*k);
  ell(0, 6, 26, 8, 'rgba(0,0,0,.45)'); g.fillStyle = lg(-22, 0, 22, 0, '#8a8a96', '#d8d8e4', '#7a7a86'); g.fillRect(-22, -44, 44, 50); ell(0, -44, 22, 7, '#c8c8d4'); ell(0, -44, 17, 5, col); g.fillStyle = col; g.fillRect(-22, -32, 44, 22);
  g.strokeStyle = 'rgba(40,40,50,.6)'; g.lineWidth = 1.5; g.beginPath(); g.arc(0, -44, 24, Math.PI*1.05, Math.PI*1.95); g.stroke();
  txt(name, 0, -21, 18, col === '#f4f4f8' ? '#333' : '#fff'); g = null; return canCache[col] = c; }
// ⑦ 가격표
let tagC = null;
export function priceTag(){ if (tagC) return tagC; const k = 2, c = cv(160*k, 70*k); g = c.getContext('2d'); g.setTransform(k, 0, 0, k, 80*k, 35*k);
  g.fillStyle = '#f4ecd8'; g.beginPath(); g.moveTo(-74, -30); g.lineTo(50, -30); g.lineTo(76, 0); g.lineTo(50, 30); g.lineTo(-74, 30); g.closePath(); g.fill(); g.strokeStyle = '#8a1030'; g.lineWidth = 3; g.stroke();
  txt('3억 원', -8, 2, 40, '#8a1030'); ell(54, 0, 6, 6, '#3a2010'); g = null; return tagC = c; }

// ===== 50% 변신 (화면) =====
// 유화 붓자국 덮개 · 크라클뤼르 (화면 크기마다 한 번)
let oilC = null, crkC = null;
export function oilCanvas(w, h){ if (oilC && oilC.w0 === w && oilC.h0 === h) return oilC; const c = cv(w, h); g = c.getContext('2d'); sd = 77; g.lineCap = 'round';
  const pal = ['122,40,60', '60,40,90', '176,120,42', '40,30,40', '90,70,110', '200,160,96'];
  for (let i = 0; i < Math.min(2600, w*h/90); i++){ const x = R()*w, y = R()*h, a = Math.sin(x*.012) + Math.cos(y*.015) + R()*.6, L = 6 + R()*16; g.strokeStyle = `rgba(${pal[Math.floor(R()*6)]},${.18 + R()*.22})`; g.lineWidth = 2 + R()*5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + .5)*L*.5, y + Math.sin(a + .5)*L*.5, x + Math.cos(a)*L, y + Math.sin(a)*L); g.stroke(); }
  g.globalAlpha = .07; g.strokeStyle = '#fff'; g.lineWidth = 1; g.beginPath(); for (let x = 0; x < w; x += 4){ g.moveTo(x, 0); g.lineTo(x, h); } for (let y = 0; y < h; y += 4){ g.moveTo(0, y); g.lineTo(w, y); } g.stroke(); g.globalAlpha = 1;
  g = null; c.w0 = w; c.h0 = h; return oilC = c; }
// 금: 가운데(캔버스 한가운데)에서 뻗는 큰 금 + 흔들린 격자 · 크기 2w × 2h
export function crackCanvas(w, h){ if (crkC && crkC.w0 === w && crkC.h0 === h) return crkC; const W = w*2, H = h*2, c = cv(W, H); g = c.getContext('2d'); sd = 5; const CX = W/2, CY = H/2, S = 54, nx = Math.ceil(W/S) + 1, ny = Math.ceil(H/S) + 1, P = [], segs = [];
  for (let j = 0; j <= ny; j++){ P.push([]); for (let i = 0; i <= nx; i++) P[j].push([i*S + (j % 2)*S*.5 + (R() - .5)*S*.7, j*S + (R() - .5)*S*.7]); }
  const add = (a, b, wd) => { if (R() < .14) return; const m = [(a[0] + b[0])/2 + (R() - .5)*14, (a[1] + b[1])/2 + (R() - .5)*14]; segs.push([a, m, wd], [m, b, wd]); };
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++){ if (i < nx) add(P[j][i], P[j][i + 1], 1 + R()); if (j < ny) add(P[j][i], P[j + 1][Math.min(nx, i + (j % 2))], 1 + R()); }
  for (let k = 0; k < 11; k++){ let a = k/11*6.283 + R()*.4, p = [CX, CY]; for (let st = 0; st < 30; st++){ a += (R() - .5)*.7; const q = [p[0] + Math.cos(a)*34, p[1] + Math.sin(a)*34]; segs.push([p, q, 3.2 - st*.08]); p = q; } }
  g.lineCap = 'round'; g.strokeStyle = 'rgba(255,244,220,.35)'; g.lineWidth = 1; g.beginPath(); for (const [a, b] of segs){ g.moveTo(a[0] + 1, a[1] + 1.2); g.lineTo(b[0] + 1, b[1] + 1.2); } g.stroke();
  g.strokeStyle = 'rgba(18,6,8,.85)'; for (const wd of [1, 2, 3]){ g.beginPath(); for (const [a, b, ww] of segs) if (Math.min(3, Math.ceil(ww)) === wd){ g.moveTo(...a); g.lineTo(...b); } g.lineWidth = wd*.85; g.stroke(); }
  g = null; c.w0 = w; c.h0 = h; return crkC = c; }
// 화면 테두리 금박 액자 + 명판
export function screenFrame(c, w, h, th, al, plate){ if (al <= .01) return; g = c; g.save(); g.globalAlpha = al; gild(w/2, h/2, w - th*2 - 6, h - th*2 - 6, th);
  if (plate > .01){ g.globalAlpha = al*plate; const pw = Math.min(w - 40, 260); g.fillStyle = goldGrad(w/2 - pw/2, h - 60, w/2 + pw/2, h - 20); g.beginPath(); g.roundRect(w/2 - pw/2, h - th - 40, pw, 32, 6); g.fill(); g.strokeStyle = 'rgba(70,40,8,.8)'; g.lineWidth = 2; g.stroke(); txt('No.317 · 오유리 · 미완성 · 유채', w/2, h - th - 23, 24, '#3a1408'); }
  g.restore(); g = null; }
