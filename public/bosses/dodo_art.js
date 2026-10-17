// 도도??? (도진규) 보스 그림: 두더지 광부 · 헬멧 불빛 · 곡괭이 · 등에 금광석 자루 · 광석 수레 위
// 체력 절반: 헬멧이 깨져 불빛이 붉게 깜빡 · 얼굴이 석탄으로 굳고 눈구멍에 금광석 · 자루를 찢고 시커먼 손 다섯
// 무거운 그림은 처음 한 번 캔버스에 그려 두고 drawImage 로만 써요.
export const S = .32;            // 그림 한 단위 → 월드 픽셀
const RES = 2;                   // 캔버스 해상도 (월드 픽셀당)
const BX0 = 440, BY0 = 560, BW = 880, BH = 960; // 그림 범위 (단위)
export const FOOT = 362;         // 그림 안 발(수레 바퀴 밑) 높이
export const LAMP = 336;         // 헬멧 불빛 높이 (발 위로 FOOT + LAMP 단위)

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };

function painter(g){
  let sd = 97; const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
  const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
  const ell = (x, y, rx, ry, f) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fillStyle = f; g.fill(); };
  const txt = (t, x, y, s, col) => { g.save(); g.font = `bold ${s}px "Dongle",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
  const rr = (x, y, w, h, f, r = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); };
  function nugget(x, y, r){ g.fillStyle = lg(x - r, y - r, x + r, y + r, '#fff0a0', '#e0a820', '#8a5a10'); g.beginPath(); for (let j = 0; j < 7; j++){ const a = j/7*6.28, r2 = r*(.75 + ((j*37)%10)/30); j ? g.lineTo(x + Math.cos(a)*r2, y + Math.sin(a)*r2) : g.moveTo(x + Math.cos(a)*r2, y + Math.sin(a)*r2); } g.closePath(); g.fill(); }
  function cart(half){ g.fillStyle = lg(-200, 240, 200, 340, '#6a6a72', '#26262c'); g.beginPath(); g.moveTo(-210, 240); g.lineTo(210, 240); g.lineTo(180, 340); g.lineTo(-180, 340); g.closePath(); g.fill();
    for (let k = 0; k < 16; k++) nugget(-180 + k*24, 236 - (k%3)*6, 12); for (const wx of [-130, 130]){ ell(wx, 346, 30, 30, '#1a1a1e'); ell(wx, 346, 12, 12, '#4a4a50'); }
    if (half) for (let k = 0; k < 4; k++){ g.strokeStyle = 'rgba(10,8,8,.95)'; g.lineWidth = 12; g.lineCap = 'round'; const x = -150 + k*90; g.beginPath(); g.moveTo(x, 300); g.quadraticCurveTo(x + 10, 340, x - 8, 372); g.stroke(); for (let f = 0; f < 4; f++){ g.lineWidth = 4; g.beginPath(); g.moveTo(x - 8, 372); g.lineTo(x - 18 + f*7, 388); g.stroke(); } } }
  function helmet(half){ g.save(); g.translate(0, -262); g.fillStyle = lg(-110, -60, 110, 20, '#f4cc30', '#9a7010'); g.beginPath(); g.arc(0, 10, 112, Math.PI, 0); g.fill(); rr(-130, 4, 260, 22, '#c89820', 8); rr(-30, -96, 60, 44, '#3a3a40', 10);
    if (!half){ ell(0, -74, 22, 18, '#fffad0'); g.save(); g.globalCompositeOperation = 'lighter'; const q = g.createLinearGradient(0, -74, 0, 526); q.addColorStop(0, 'rgba(255,240,170,.55)'); q.addColorStop(1, 'rgba(255,240,170,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(-18, -74); g.lineTo(18, -74); g.lineTo(240, 520); g.lineTo(-240, 520); g.closePath(); g.globalAlpha = .45; g.fill(); g.restore(); }
    else { ell(0, -74, 22, 18, '#2a0a08'); g.strokeStyle = '#1a1208'; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, -30); g.lineTo(-20, 0); g.lineTo(-36, 10); g.moveTo(40, -50); g.lineTo(70, -10); g.stroke(); for (let k = 0; k < 10; k++) ell(-90 + R()*180, -40 + R()*40, 6 + R()*8, 3 + R()*3, 'rgba(20,14,10,.7)'); }
    g.restore(); }
  function mole(half){ sd = 97;
    cart(half);
    if (half){ const au = g.createRadialGradient(0, -60, 30, 0, -60, 400); au.addColorStop(0, 'rgba(200,20,20,.35)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-420, -500, 840, 880); }
    const F = half ? '#3a3236' : '#7a6a72', Fd = half ? '#120e10' : '#3a2e34', SN = half ? '#5a4448' : '#f4b0b8';
    g.save(); g.translate(150, -40); g.rotate(.25); g.fillStyle = lg(-80, 0, 80, 0, '#a08860', '#5a4630'); g.beginPath(); g.moveTo(-70, 140); g.quadraticCurveTo(-110, -40, -30, -110); g.lineTo(40, -110); g.quadraticCurveTo(110, -40, 70, 140); g.closePath(); g.fill(); for (let k = 0; k < 6; k++) nugget(-36 + k*14, -112 - (k%2)*8, 10); txt('금', 0, 20, 44, '#3a2a10');
    if (half){ g.fillStyle = '#0a0606'; g.beginPath(); g.moveTo(-40, -20); g.lineTo(-10, -40); g.lineTo(20, -10); g.lineTo(50, -30); g.lineTo(40, 40); g.lineTo(-30, 50); g.closePath(); g.fill(); } g.restore();
    for (const s2 of [-1, 1]) rr(s2*56 - 32, 170, 64, 80, half ? '#1a1a1e' : '#3a3a44', 16);
    ell(0, 70, 140, 160, rg(-30, 20, 170, F, Fd)); g.fillStyle = half ? '#2a2620' : '#c87a2a'; g.beginPath(); g.moveTo(-104, 20); g.lineTo(104, 20); g.lineTo(116, 220); g.lineTo(-116, 220); g.closePath(); g.fill(); for (const s2 of [-1, 1]) g.fillRect(s2*62 - 13, -60, 26, 84);
    rr(-50, 70, 100, 50, half ? '#1a1612' : '#a8601e', 6); txt(half ? '혼자' : '도도', 0, 96, 34, half ? '#c02020' : '#fff0d0');
    if (half) for (let k = 0; k < 9; k++) ell(-90 + R()*180, 20 + R()*190, 12 + R()*14, 6 + R()*6, 'rgba(6,4,4,.6)');
    for (const s2 of [-1, 1]){ g.save(); g.translate(s2*130, 0); g.rotate(s2*-.5); ell(0, 60, 32, 80, rg(0, 50, 80, F, Fd)); g.fillStyle = SN; for (let f = 0; f < 5; f++){ g.beginPath(); g.ellipse(-16 + f*8, 146, 6, 16, 0, 0, 7); g.fill(); } ell(0, 132, 28, 22, SN); g.restore(); }
    g.save(); g.translate(-230, 80); g.rotate(-.6); g.fillStyle = '#6a4a2a'; g.fillRect(-5, -150, 10, 200); g.fillStyle = half ? '#4a2020' : '#9a9aa2'; g.beginPath(); g.moveTo(-80, -150); g.quadraticCurveTo(0, -176, 80, -150); g.lineTo(72, -138); g.quadraticCurveTo(0, -158, -72, -138); g.closePath(); g.fill(); g.restore();
    ell(0, -150, 120, 108, rg(-30, -190, 120, F, Fd));
    if (!half){ ell(0, -96, 40, 30, SN); ell(0, -110, 20, 14, '#e87a8a'); for (const s2 of [-1, 1]){ g.strokeStyle = '#1a1214'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(s2*30, -158); g.lineTo(s2*58, -158); g.stroke(); g.lineWidth = 2; for (let k = 0; k < 3; k++){ g.beginPath(); g.moveTo(s2*40, -100 + k*8); g.lineTo(s2*90, -106 + k*12); g.stroke(); } }
      g.lineWidth = 4; g.beginPath(); g.moveTo(-14, -74); g.quadraticCurveTo(0, -66, 14, -74); g.stroke(); ell(-70, -110, 14, 8, 'rgba(255,140,150,.4)'); ell(70, -110, 14, 8, 'rgba(255,140,150,.4)'); }
    else {
      for (let k = 0; k < 40; k++){ g.strokeStyle = `rgba(${60 + R()*40},${50 + R()*30},${50 + R()*30},.7)`; g.lineWidth = 1.5; const a = R()*6.28, r0 = R()*100; g.beginPath(); g.moveTo(Math.cos(a)*r0, -150 + Math.sin(a)*r0*.9); g.lineTo(Math.cos(a)*r0 + (R() - .5)*30, -150 + Math.sin(a)*r0*.9 + (R() - .5)*20); g.stroke(); }
      for (const s2 of [-1, 1]){ ell(s2*44, -158, 28, 22, '#050304'); nugget(s2*44, -158, 17); const gl = g.createRadialGradient(s2*44, -158, 2, s2*44, -158, 34); gl.addColorStop(0, 'rgba(255,220,80,.6)'); gl.addColorStop(1, 'rgba(255,180,0,0)'); g.fillStyle = gl; g.fillRect(s2*44 - 34, -192, 68, 68); }
      ell(0, -100, 40, 28, SN); ell(0, -112, 18, 12, '#2a1416');
      g.fillStyle = '#050304'; g.beginPath(); g.moveTo(-60, -76); g.lineTo(-30, -60); g.lineTo(-10, -72); g.lineTo(12, -56); g.lineTo(34, -70); g.lineTo(62, -60); g.lineTo(40, -48); g.lineTo(-40, -46); g.closePath(); g.fill();
      for (let k = 0; k < 18; k++){ g.fillStyle = `rgba(255,${200 + R()*40},80,${.6 + R()*.4})`; g.beginPath(); g.arc(-30 + R()*60, -46 + R()*120, 2 + R()*2, 0, 7); g.fill(); }
      const H5 = [[150, -120, -2.5], [170, -130, -1.9], [200, -110, -1.0], [200, -30, -.3], [150, 40, -2.9]];
      for (const [hx, hy, a] of H5){ g.save(); g.translate(hx, hy); g.rotate(a); g.lineCap = 'round'; g.strokeStyle = '#8a7a7e'; g.lineWidth = 24; g.beginPath(); g.moveTo(0, 0); g.lineTo(90, 0); g.stroke(); g.strokeStyle = '#2a2024'; g.lineWidth = 19; g.beginPath(); g.moveTo(0, 0); g.lineTo(90, 0); g.stroke(); g.lineWidth = 6; for (let f = 0; f < 4; f++){ g.beginPath(); g.moveTo(90, 0); g.quadraticCurveTo(110, -14 + f*9, 126, -16 + f*11); g.stroke(); } g.restore(); } }
    helmet(half); }
  return { mole, nugget, lg, ell };
}

// 보스 그림 (평소 · 절반) → {cv, w, h, ox, oy}: 월드에서 (발x - ox, 발y - oy) 에 w × h 로 그려요
const cache = {};
export function bossArt(half){
  const k = half ? 'h' : 'n'; if (cache[k]) return cache[k];
  const sc = S*RES, cv = mk(BW*sc, BH*sc), g = cv.getContext('2d'); g.setTransform(sc, 0, 0, sc, BX0*sc, BY0*sc); painter(g).mole(half);
  return (cache[k] = { cv, w:BW*S, h:BH*S, ox:BX0*S, oy:(BY0 + FOOT)*S });
}

// 바위 조각 (떨어지는 돌 · 돌무더기) · 여섯 가지
const fxH = n => { const s = Math.sin(n*12.9898 + 78.233)*43758.5453; return s - Math.floor(s); };
export { fxH };
let ROCKS = null;
export function rockSprites(){
  if (ROCKS) return ROCKS; ROCKS = [];
  for (let v = 0; v < 6; v++){ const r = 24, cv = mk(r*2*RES + 4, r*2*RES + 4), g = cv.getContext('2d'); g.setTransform(RES, 0, 0, RES, r*RES + 2, r*RES + 2); const s = 11 + v*7.7;
    g.beginPath(); for (let i = 0; i < 7; i++){ const a = i/7*6.283, q = r*(.72 + fxH(s + i)*.28); i ? g.lineTo(Math.cos(a)*q, Math.sin(a)*q*.82) : g.moveTo(Math.cos(a)*q, Math.sin(a)*q*.82); } g.closePath();
    const tn = fxH(s + 9), q = g.createLinearGradient(-r, -r, r, r); q.addColorStop(0, tn < .5 ? '#958a7c' : '#7e7064'); q.addColorStop(.5, tn < .5 ? '#4c453e' : '#4a3a2e'); q.addColorStop(1, '#1a1612'); g.fillStyle = q; g.fill();
    g.strokeStyle = 'rgba(8,6,4,.85)'; g.lineWidth = 1.5; g.stroke(); g.beginPath(); g.moveTo(-r*.55, -r*.4); g.lineTo(r*.15, -r*.6); g.lineTo(-r*.1, -r*.1); g.closePath(); g.fillStyle = 'rgba(255,240,220,.14)'; g.fill();
    ROCKS.push(cv); }
  return ROCKS;
}
// 바위 하나 그리기 (r = 반지름 월드 픽셀)
export function rock(c, x, y, r, v, rot = 0){ const cv = rockSprites()[(v|0) % 6], d = r*2*(1 + 4/(48*RES)); if (rot){ c.save(); c.translate(x, y); c.rotate(rot); c.drawImage(cv, -d/2, -d/2, d, d); c.restore(); } else c.drawImage(cv, x - d/2, y - d/2, d, d); }

// 작은 광차 (선로 위) · 곡괭이 (부메랑) · 큰 바위 (엄폐) · 무너진 돌벽
const SPR = {};
function sprite(key, w, h, ox, oy, draw){ if (SPR[key]) return SPR[key]; const cv = mk(w*RES, h*RES), g = cv.getContext('2d'); g.setTransform(RES, 0, 0, RES, ox*RES, oy*RES); draw(g, painter(g)); return (SPR[key] = { cv, w, h, ox, oy }); }
export function blit(c, s, x, y, a = 1){ if (a < 1){ c.save(); c.globalAlpha *= a; c.drawImage(s.cv, x - s.ox, y - s.oy, s.w, s.h); c.restore(); } else c.drawImage(s.cv, x - s.ox, y - s.oy, s.w, s.h); }
export const cartSpr = () => sprite('cart', 84, 64, 42, 46, (g, p) => {
  p.ell(0, 14, 40, 8, 'rgba(0,0,0,.45)'); g.fillStyle = p.lg(-34, -30, 34, 10, '#8a8a92', '#2a2a30'); g.beginPath(); g.moveTo(-38, -30); g.lineTo(38, -30); g.lineTo(30, 6); g.lineTo(-30, 6); g.closePath(); g.fill();
  g.strokeStyle = '#1a1a1e'; g.lineWidth = 2; g.stroke(); for (let i = 0; i < 6; i++) p.nugget(-26 + i*10.5, -32 - (i%2)*3, 7); p.ell(-19, 9, 8, 8, '#141418'); p.ell(19, 9, 8, 8, '#141418'); p.ell(-19, 9, 3, 3, '#5a5a60'); p.ell(19, 9, 3, 3, '#5a5a60'); });
export const pickSpr = () => sprite('pick', 76, 76, 38, 38, g => {
  g.fillStyle = '#6a4a2a'; g.fillRect(-4, -30, 8, 60); g.fillStyle = '#c0c0c8'; g.beginPath(); g.moveTo(-34, -28); g.quadraticCurveTo(0, -42, 34, -28); g.lineTo(29, -20); g.quadraticCurveTo(0, -32, -29, -20); g.closePath(); g.fill(); g.strokeStyle = '#3a3a40'; g.lineWidth = 1.5; g.stroke(); });
export const bigRock = v => sprite('br' + v, 120, 80, 60, 60, (g, p) => {
  p.ell(0, 16, 56, 16, 'rgba(0,0,0,.5)'); const s = v*13; g.fillStyle = p.lg(-50, -50, 50, 20, '#8a8478', '#3a3630'); g.beginPath(); g.moveTo(-52, 14); g.lineTo(-46 + fxH(s)*6, -26); g.lineTo(-10, -50 - fxH(s + 1)*6); g.lineTo(30, -44); g.lineTo(52, -10); g.lineTo(46, 16); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(10,8,6,.8)'; g.lineWidth = 2; g.stroke(); g.fillStyle = 'rgba(255,240,220,.12)'; g.beginPath(); g.moveTo(-38, -22); g.lineTo(-10, -44); g.lineTo(-14, -18); g.closePath(); g.fill(); g.strokeStyle = 'rgba(10,8,6,.6)'; g.beginPath(); g.moveTo(-6, -40); g.lineTo(4, -12); g.lineTo(-2, 10); g.stroke(); });
export const wallSpr = () => sprite('wall', 200, 170, 100, 150, (g, p) => {
  p.ell(0, 6, 100, 22, 'rgba(0,0,0,.55)'); let sd = 211; const R = () => (sd = (sd*16807) % 2147483647)/2147483647;
  for (let i = 0; i < 16; i++){ const x = -66 + (i % 4)*44 + (R() - .5)*12, y = -126 + Math.floor(i/4)*36 + (R() - .5)*8; g.save(); g.translate(x, y); g.fillStyle = p.lg(-24, -24, 24, 24, '#7a746a', '#2a2622'); g.beginPath(); g.moveTo(-24, 10); g.lineTo(-18, -20); g.lineTo(10, -26); g.lineTo(26, -4); g.lineTo(18, 22); g.lineTo(-14, 24); g.closePath(); g.fill(); g.strokeStyle = 'rgba(8,6,4,.8)'; g.lineWidth = 1.5; g.stroke(); g.restore(); } });
export const nuggetSpr = () => sprite('nug', 24, 24, 12, 12, (g, p) => p.nugget(0, 0, 9));
