// 단단??? (단혜원) 보스 그림: 앞치마 판다 바리스타 · 쟁반 위 잔 · 큰 커피 주전자 · 받침 접시
// 체력 절반: 판다 무늬가 커피 얼룩으로 녹아 흐르고 충혈된 눈 · 주전자에서 하얀 가루
// 시안(boss.html)의 그림 코드를 옮겼어요. 한 번 캔버스에 그려 두고 drawImage 로 써요
let g = null, sd = 61, TT = 1;
const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
const FONT = s => `bold ${Math.round(s*1.5)}px "Dongle",sans-serif`;
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col) => { g.save(); g.font = FONT(s); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
function rr(x, y, w, h, f, r = 4){ g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); }
function minicup(x, y, s, powder){ g.save(); g.translate(x, y); g.scale(s, s); ell(0, 4, 18, 6, '#efe8de'); g.fillStyle = lg(-12, 0, 12, 0, '#fbf6ee', '#cfc4b4'); g.beginPath(); g.moveTo(-12, -14); g.lineTo(12, -14); g.lineTo(9, 2); g.lineTo(-9, 2); g.closePath(); g.fill(); ell(0, -14, 12, 4, '#4a2a18'); if (powder){ g.fillStyle = '#fff'; for (let k = 0; k < 5; k++){ g.beginPath(); g.arc(-6 + R()*12, -14, 1.4, 0, 7); g.fill(); } } g.restore(); }
function saucer(half){ g.save(); g.scale(1, .22); ell(0, 1650, 250, 250, 'rgba(0,0,0,.6)'); g.restore(); ell(0, 350, 210, 46, lg(-210, 0, 210, 0, '#c8bca8', '#fbf6ee', '#b8ac98')); ell(0, 340, 170, 34, '#efe6d6'); ell(0, 340, 120, 22, half ? '#4a2a14' : '#e6dccb'); if (half){ for (let k = 0; k < 9; k++){ rr(-80 + R()*160, 330 + R()*14, 10, 6, '#ffffff', 2); } txt('수면제', 0, 384, 16, '#8a1010'); } }
function pot(x, y, s, half){ g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-.5); ell(0, 0, 50, 58, lg(-50, 0, 50, 0, '#8a8e96', '#e8ecf0', '#6a6e76')); rr(-40, -66, 80, 14, '#5a5e66', 6); ell(0, -74, 12, 8, '#3a3e46'); g.strokeStyle = '#5a5e66'; g.lineWidth = 10; g.beginPath(); g.arc(-56, 0, 26, 1.8, 4.6); g.stroke(); g.fillStyle = lg(0, 0, 90, 0, '#8a8e96', '#c8ccd0'); g.beginPath(); g.moveTo(40, -10); g.lineTo(96, -44); g.lineTo(100, -36); g.lineTo(46, 12); g.closePath(); g.fill();
  if (half){ g.strokeStyle = '#1a1a1a'; g.lineWidth = 2; g.beginPath(); g.moveTo(-20, -40); g.lineTo(-6, -10); g.lineTo(-18, 20); g.stroke(); } g.restore(); }
function tray(x, y, s, half){ g.save(); g.translate(x, y); g.scale(s, s); g.rotate(.12); ell(0, 0, 90, 20, lg(-90, 0, 90, 0, '#8a8e96', '#e0e4e8', '#7a7e86')); ell(0, -4, 82, 16, '#c8ccd2'); for (const dx of [-46, 0, 46]) minicup(dx, -8, 1.2, half); g.restore(); }
function panda(half){ sd = 61;
  saucer(half);
  if (half){ const au = g.createRadialGradient(0, -60, 30, 0, -60, 360); au.addColorStop(0, 'rgba(255,120,30,.35)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-380, -460, 760, 800); }
  for (const s2 of [-1, 1]){ ell(s2*62, 300, 42, 30, rg(s2*62, 290, 42, '#3a3438', '#141012')); }
  ell(0, 120, 158, 180, rg(-30, 60, 190, '#ffffff', half ? '#b8a080' : '#d8d4d0'));
  g.fillStyle = lg(-100, 0, 100, 0, '#6a3a20', '#8a5030', '#5a2e18'); g.beginPath(); g.moveTo(-80, -20); g.lineTo(80, -20); g.lineTo(110, 270); g.lineTo(-110, 270); g.closePath(); g.fill(); g.strokeStyle = '#f4e8d8'; g.lineWidth = 3; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(-74, -12); g.lineTo(74, -12); g.lineTo(102, 262); g.lineTo(-102, 262); g.closePath(); g.stroke(); g.setLineDash([]);
  rr(-50, 100, 100, 60, '#7a4426', 8); txt('단단 카페', 0, 84, 18, '#f4e8d8'); if (!half) txt('♥', 0, 146, 26, '#f4c0a0'); else txt('12', 0, 146, 28, '#f4e8d8');
  if (half) for (let k = 0; k < 7; k++){ const sx = -80 + R()*160, sy = 0 + R()*200; ell(sx, sy, 16 + R()*20, 10 + R()*14, 'rgba(30,14,6,.6)'); g.strokeStyle = 'rgba(30,14,6,.6)'; g.lineWidth = 5; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + (R() - .5)*6, sy + 30 + R()*40); g.stroke(); }
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*140, 0); g.rotate(s2*-.6); ell(0, 60, 36, 80, rg(0, 50, 80, '#3a3438', '#141012')); g.restore(); }
  tray(-230, 30, 1, half); pot(230, 40, 1, half);
  for (const s2 of [-1, 1]) ell(s2*86, -230, 36, 34, rg(s2*86, -236, 36, '#3a3438', '#141012'));
  ell(0, -150, 132, 112, rg(-30, -190, 132, '#ffffff', half ? '#b8a080' : '#d8d4d0'));
  g.fillStyle = '#ffffff'; for (const [cx, cy, r2] of [[-40, -270, 40], [0, -290, 46], [40, -270, 40]]){ g.beginPath(); g.arc(cx, cy, r2, 0, 7); g.fill(); } rr(-70, -260, 140, 30, '#f4f0ec', 6); if (half){ g.fillStyle = 'rgba(80,40,10,.5)'; g.beginPath(); g.ellipse(30, -280, 30, 12, .3, 0, 7); g.fill(); }
  if (!half){
    for (const s2 of [-1, 1]){ ell(s2*46, -150, 34, 40, '#141012', s2*-.35); g.strokeStyle = '#ffffff'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(s2*46, -142, 13, Math.PI*1.15, Math.PI*1.85); g.stroke(); }
    ell(0, -112, 14, 10, '#141012'); g.strokeStyle = '#141012'; g.lineWidth = 4; g.beginPath(); g.arc(-10, -96, 10, .2, 2.6); g.arc(10, -96, 10, .5, 2.9); g.stroke(); ell(-86, -110, 16, 9, 'rgba(255,150,170,.6)'); ell(86, -110, 16, 9, 'rgba(255,150,170,.6)'); }
  else {
    for (const s2 of [-1, 1]){ const x0 = s2*46; ell(x0, -150, 34, 40, '#2a160a', s2*-.35); for (let k = 0; k < 4; k++){ const dx = x0 - 22 + k*14, L = 40 + (k*31)%60 + Math.sin(TT*2 + k + s2)*8; g.strokeStyle = '#2a160a'; g.lineWidth = 10 - k; g.lineCap = 'round'; g.beginPath(); g.moveTo(dx, -130); g.lineTo(dx + (k%2 ? 2 : -2), -130 + L); g.stroke(); ell(dx, -126 + L, 6, 8, '#2a160a'); }
      ell(x0, -150, 15, 11, '#f4e4dc'); g.strokeStyle = 'rgba(200,30,40,.8)'; g.lineWidth = 1.2; for (let k = 0; k < 7; k++){ const a = R()*6.28; g.beginPath(); g.moveTo(x0 + Math.cos(a)*14, -150 + Math.sin(a)*10); g.lineTo(x0 + Math.cos(a)*6, -150 + Math.sin(a)*4); g.stroke(); } ell(x0 + s2*2, -150, 6, 6, '#4a3020'); ell(x0 + s2*2, -150, 3, 3, '#000'); ell(x0, -137, 14, 5, 'rgba(60,20,40,.45)'); }
    ell(0, -112, 14, 10, '#141012'); g.strokeStyle = '#141012'; g.lineWidth = 4; g.beginPath(); g.moveTo(-26, -88); g.lineTo(26, -88); g.stroke(); for (let k = 0; k < 6; k++){ g.beginPath(); g.moveTo(-22 + k*9, -92); g.lineTo(-22 + k*9, -84); g.stroke(); }
    g.fillStyle = 'rgba(232,220,200,.8)'; g.beginPath(); g.moveTo(-120, -110); g.quadraticCurveTo(-140, -40, -110, -20); g.lineTo(-96, -60); g.closePath(); g.fill(); }
}

// 그림 단위 → 월드: ART_S 배 · 발(받침 접시 바닥)은 그림 원점에서 FOOT 아래
export const ART_S = .4, FOOT = 352;
const BX0 = -390, BY0 = -350, BW = 780, BH = 790, RES = .8; // 캐시 범위 (그림 단위) · 해상도
const cache = {};
const fontOK = () => { try { return document.fonts.check('bold 20px "Dongle"'); } catch(e){ return true; } };
// half: 체력 절반 모습. 돌려주는 값: {cv, ox, oy, s} → drawImage(cv, x - ox, y - oy, cv.width*s, cv.height*s) (x, y = 그림 원점)
export function pandaArt(half){
  const key = half ? 'h' : 'n', cur = cache[key];
  if (cur && (cur.font || !fontOK() || performance.now() - cur.at < 1500)) return cur;
  const cv = document.createElement('canvas'); cv.width = Math.ceil(BW*RES); cv.height = Math.ceil(BH*RES);
  g = cv.getContext('2d'); g.scale(RES, RES); g.translate(-BX0, -BY0); panda(half); g = null;
  const k = ART_S/RES; return cache[key] = {cv, ox:-BX0*ART_S, oy:-BY0*ART_S, s:k, font:fontOK(), at:performance.now()};
}
// 각설탕 (작은 캐시)
let cubeCv = null;
export function cubeArt(){
  if (cubeCv) return cubeCv; const cv = document.createElement('canvas'); cv.width = cv.height = 40; const c = cv.getContext('2d'); c.translate(20, 20); c.scale(2, 2);
  c.fillStyle = '#fbf8f2'; c.fillRect(-9, -9, 18, 18); c.strokeStyle = 'rgba(160,140,120,.7)'; c.lineWidth = 1.5; c.strokeRect(-9, -9, 18, 18); c.fillStyle = 'rgba(220,210,190,.7)'; c.fillRect(-9, -9, 18, 5);
  c.fillStyle = 'rgba(255,255,255,.9)'; for (const [x, y] of [[-4, 1], [3, 4], [0, -2], [5, -1]]) c.fillRect(x, y, 1.5, 1.5);
  return cubeCv = cv;
}
// 부드러운 김 덩어리 (색마다 하나씩 캐시)
const blobs = {};
export function blobArt(col){
  if (blobs[col]) return blobs[col]; const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d'), q = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  q.addColorStop(0, `rgba(${col},1)`); q.addColorStop(.45, `rgba(${col},.55)`); q.addColorStop(1, `rgba(${col},0)`); c.fillStyle = q; c.fillRect(0, 0, 64, 64); return blobs[col] = cv;
}
// 손님 잔 (작은 캐시) · 엎어진 잔은 돌려 그려요
let cupCv = null;
export function cupArt(){
  if (cupCv) return cupCv; const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; const c = cv.getContext('2d'); c.translate(32, 44);
  c.fillStyle = '#f4ece0'; c.fillRect(-16, -26, 32, 30); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(6, -26, 10, 30); c.beginPath(); c.ellipse(0, -26, 16, 6, 0, 0, 7); c.fillStyle = '#3a2010'; c.fill();
  c.strokeStyle = '#f4ece0'; c.lineWidth = 4; c.beginPath(); c.arc(18, -12, 7, -1.4, 1.4); c.stroke(); c.fillStyle = '#fff'; for (const x of [-6, 0, 5]){ c.beginPath(); c.arc(x, -26, 1.4, 0, 7); c.fill(); }
  return cupCv = cv;
}
// 식은 커피잔 No.12 (큰 잔)
let bigCv = null;
export function bigCupArt(){
  if (bigCv && bigCv.font) return bigCv; const cv = document.createElement('canvas'); cv.width = 200; cv.height = 180; const c = cv.getContext('2d'); c.translate(100, 140);
  c.save(); c.scale(1, .28); c.beginPath(); c.ellipse(0, 60, 82, 82, 0, 0, 7); c.fillStyle = 'rgba(0,0,0,.45)'; c.fill(); c.restore();
  const q = c.createLinearGradient(-70, 0, 70, 0); q.addColorStop(0, '#d8d0c4'); q.addColorStop(.5, '#fbf6ee'); q.addColorStop(1, '#cfc6b8'); c.fillStyle = q;
  c.beginPath(); c.moveTo(-70, -110); c.lineTo(70, -110); c.lineTo(56, 14); c.lineTo(-56, 14); c.closePath(); c.fill(); c.beginPath(); c.ellipse(0, -110, 70, 18, 0, 0, 7); c.fillStyle = '#4a2a14'; c.fill();
  c.beginPath(); c.ellipse(0, -112, 54, 12, 0, 0, 7); c.fillStyle = '#5a3a20'; c.fill(); c.strokeStyle = '#e8e0d4'; c.lineWidth = 12; c.beginPath(); c.arc(76, -56, 26, -1.3, 1.3); c.stroke();
  c.font = FONT(17); c.textAlign = 'center'; c.fillStyle = '#6a3a1a'; c.fillText('No.12', 0, -42); c.strokeStyle = 'rgba(120,90,60,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-40, -20); c.lineTo(40, -20); c.stroke();
  cv.font = fontOK(); return bigCv = cv;
}
