// 하나??? (백하은) 보스 그림 · 밀짚모자 여우 꼬마 농부 (물뿌리개엔 물 대신 등유)
// 무거운 몸 그림은 처음 한 번 캔버스에 그려 두고 drawImage 해요. 불꽃만 매 프레임.
export const S = .3;            // 원본 그림 → 월드 배율
export const FOOT = 340;        // 원본 그림에서 발(밭 가운데) y
const SX = 460, SY0 = -540, SY1 = 420, RES = 2; // 캐시 범위 (원본 좌표)

const mkCanvas = (w, h) => { const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h)); return cv; };

// 불꽃 하나 (원본 데모와 같은 모양)
export function flame(g, x, y, s, t, k = 0){
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const [col, sc] of FL){ g.fillStyle = col; g.beginPath(); const w = 30*sc, h = 80*sc*(1 + .15*Math.sin(t*9 + k));
    g.moveTo(-w, 0); g.bezierCurveTo(-w, -h*.5, -w*.2 + Math.sin(t*7 + k)*8*sc, -h*.7, Math.sin(t*6 + k)*10*sc, -h); g.bezierCurveTo(w*.2, -h*.6, w, -h*.5, w, 0); g.quadraticCurveTo(0, 18*sc, -w, 0); g.fill(); }
  g.restore(); }
const FL = [['rgba(255,80,20,.85)', 1], ['rgba(255,170,40,.9)', .7], ['rgba(255,240,170,.95)', .4]];

function foxArt(g, half){
  let sd = 83; const R = () => (sd = (sd*16807) % 2147483647) / 2147483647;
  const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
  const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
  const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
  const rr = (x, y, w, h, f, r = 6) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); };
  const txt = (t, x, y, s, col) => { g.save(); g.font = `bold ${s}px "Dongle",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
  // 밭 (발밑 고랑)
  g.save(); g.scale(1, .22); ell(0, 1650, 260, 260, 'rgba(0,0,0,.6)'); g.restore(); rr(-220, 300, 440, 80, half ? '#2a1a12' : '#6a4026', 14);
  for (let i = 0; i < 4; i++){ g.fillStyle = half ? '#140c08' : '#4a2a16'; g.fillRect(-210, 310 + i*18, 420, 8);
    if (!half) for (let k = 0; k < 10; k++) ell(-190 + k*42, 312 + i*18, 6, 4, '#6a9a3a');
    else for (let k = 0; k < 14; k++){ g.fillStyle = `rgba(255,${100 + R()*80},40,${.5 + R()*.4})`; g.beginPath(); g.arc(-200 + R()*400, 310 + i*18 + R()*8, 2 + R()*2, 0, 7); g.fill(); } }
  if (half){ const au = g.createRadialGradient(0, -80, 30, 0, -80, 420); au.addColorStop(0, 'rgba(255,90,30,.45)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-440, -520, 880, 900); }
  const F = half ? '#a0582a' : '#ff9a4d', Fd = half ? '#3a1a0c' : '#c8641e', CR = half ? '#c8b8a8' : '#fff4e6';
  // 꼬리
  g.save(); g.translate(130, 180); g.rotate(-.7); ell(0, -70, 50, 100, rg(0, -70, 100, F, Fd)); ell(0, -150, 32, 40, CR); g.restore();
  // 다리 · 장화
  for (const s2 of [-1, 1]) rr(s2*56 - 30, 230, 60, 70, half ? '#3a2a1a' : '#e8c020', 16);
  // 몸 · 멜빵바지
  ell(0, 110, 130, 150, rg(-30, 60, 160, F, Fd)); g.fillStyle = half ? '#3a3a50' : '#5a7ab0'; g.beginPath(); g.moveTo(-100, 40); g.lineTo(100, 40); g.lineTo(110, 240); g.lineTo(-110, 240); g.closePath(); g.fill();
  for (const s2 of [-1, 1]){ g.fillStyle = half ? '#3a3a50' : '#5a7ab0'; g.fillRect(s2*60 - 12, -40, 24, 90); ell(s2*60, 44, 8, 8, '#e8c040'); }
  rr(-40, 100, 80, 50, half ? '#2a2a3a' : '#4a6aa0', 6);
  if (!half) txt('하나', 0, 128, 34, '#fff'); else { txt('내 밭', 0, 128, 34, '#ff8a4a'); for (let k = 0; k < 6; k++) ell(-80 + R()*160, 60 + R()*160, 14, 8, 'rgba(10,6,4,.6)'); }
  // 팔
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*120, 10); g.rotate(s2*-.55); ell(0, 60, 30, 76, rg(0, 50, 76, F, Fd)); ell(0, 132, 24, 22, CR); g.restore(); }
  // 물뿌리개 (등유)
  g.save(); g.translate(-260, 90); g.rotate(.5); rr(-40, -34, 80, 60, lg(-40, 0, 40, 0, '#4a7a9a', '#8ac0e0', '#3a6a8a'), 10); g.strokeStyle = '#3a5a7a'; g.lineWidth = 8; g.beginPath(); g.arc(-10, -40, 26, Math.PI, 0); g.stroke();
  g.fillStyle = '#4a7a9a'; g.beginPath(); g.moveTo(36, -10); g.lineTo(100, -40); g.lineTo(104, -32); g.lineTo(40, 6); g.closePath(); g.fill(); ell(104, -36, 10, 14, '#3a6a8a', .5); g.restore();
  g.save(); g.translate(-260, 90); g.strokeStyle = '#1a1410'; g.lineWidth = 9; g.lineCap = 'round'; for (let k = 0; k < 3; k++){ g.beginPath(); g.moveTo(96 + k*6, 12); g.quadraticCurveTo(110 + k*8, 90, 104 + k*10, 230); g.stroke(); }
  g.strokeStyle = 'rgba(160,120,220,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(100, 14); g.quadraticCurveTo(114, 90, 110, 230); g.stroke(); ell(110, 240, 60, 12, 'rgba(20,14,10,.85)'); ell(104, 238, 40, 6, 'rgba(160,120,220,.35)'); g.restore();
  // 성냥
  g.save(); g.translate(230, 100); g.rotate(.4); g.fillStyle = '#e8d0a0'; g.fillRect(-3, -80, 6, 80); ell(0, -84, 7, 9, half ? '#2a1a1a' : '#c82a2a'); g.restore();
  // 머리
  for (const s2 of [-1, 1]){ g.fillStyle = F; g.beginPath(); g.moveTo(s2*50, -230); g.lineTo(s2*110, -330); g.lineTo(s2*120, -210); g.closePath(); g.fill(); g.fillStyle = half ? '#1a0c06' : '#2a1a14'; g.beginPath(); g.moveTo(s2*80, -264); g.lineTo(s2*108, -316); g.lineTo(s2*112, -236); g.closePath(); g.fill(); }
  ell(0, -160, 128, 110, rg(-30, -200, 128, F, Fd)); g.fillStyle = CR; g.beginPath(); g.moveTo(-120, -130); g.quadraticCurveTo(-60, -60, 0, -70); g.quadraticCurveTo(60, -60, 120, -130); g.quadraticCurveTo(60, -100, 0, -150); g.quadraticCurveTo(-60, -100, -120, -130); g.fill();
  ell(0, -128, 16, 12, '#2a1a14');
  if (!half){ g.strokeStyle = '#2a1a14'; g.lineWidth = 6; g.lineCap = 'round'; for (const s2 of [-1, 1]){ g.beginPath(); g.arc(s2*48, -170, 15, Math.PI*1.15, Math.PI*1.85); g.stroke(); }
    ell(-86, -136, 18, 10, 'rgba(255,120,120,.5)'); ell(86, -136, 18, 10, 'rgba(255,120,120,.5)');
    g.lineWidth = 4; g.beginPath(); g.moveTo(-24, -108); g.quadraticCurveTo(0, -88, 24, -108); g.stroke(); ell(-40, -110, 10, 5, 'rgba(90,60,30,.5)'); ell(56, -104, 7, 4, 'rgba(90,60,30,.5)'); }
  else { // 얼굴 왼쪽 반은 숯 · 오른쪽은 웃는 채 굳은 얼굴 · 귀까지 찢어진 웃음
    g.save(); g.beginPath(); g.moveTo(-140, -280); g.lineTo(-10, -280); g.lineTo(-24, -230); g.lineTo(4, -190); g.lineTo(-18, -150); g.lineTo(6, -110); g.lineTo(-14, -60); g.lineTo(-140, -60); g.closePath(); g.clip();
    ell(0, -160, 130, 112, '#140806'); for (let k = 0; k < 60; k++){ const x = -130 + R()*130, y = -270 + R()*210; g.strokeStyle = `rgba(255,${80 + R()*100},30,${.4 + R()*.5})`; g.lineWidth = 1 + R()*2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5)*30, y + (R() - .5)*20); g.stroke(); }
    const gl = g.createRadialGradient(-48, -170, 2, -48, -170, 40); gl.addColorStop(0, 'rgba(255,220,120,1)'); gl.addColorStop(.3, 'rgba(255,100,30,.9)'); gl.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = gl; g.fillRect(-100, -220, 100, 100); g.restore();
    for (let k = 0; k < 16; k++){ g.fillStyle = `rgba(${40 + R()*30},${36 + R()*20},${34 + R()*16},.9)`; g.beginPath(); g.ellipse(-60 + R()*60, -60 + R()*120, 3 + R()*6, 2 + R()*4, R()*3, 0, 7); g.fill(); }
    g.strokeStyle = '#2a1a14'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.arc(48, -170, 15, Math.PI*1.15, Math.PI*1.85); g.stroke(); ell(86, -136, 18, 10, 'rgba(255,90,60,.6)');
    g.fillStyle = '#2a0a06'; g.beginPath(); g.moveTo(-10, -112); g.quadraticCurveTo(50, -60, 118, -120); g.quadraticCurveTo(60, -86, -10, -112); g.closePath(); g.fill();
    g.fillStyle = '#fff4e6'; for (let k = 0; k < 7; k++){ const t = k/7, x = -4 + t*118, y = -108 + Math.sin(t*Math.PI)*26; g.beginPath(); g.moveTo(x, y - 2); g.lineTo(x + 7, y - 2); g.lineTo(x + 3, y + 8); g.closePath(); g.fill(); } }
  // 밀짚모자
  g.save(); g.translate(0, -250); g.rotate(-.08); ell(0, 14, 170, 38, half ? '#5a4024' : '#e8c870'); ell(0, -10, 90, 52, half ? '#6a4a28' : '#f0d488'); g.fillStyle = '#d04040'; g.fillRect(-90, 4, 180, 14);
  if (half) for (let k = 0; k < 9; k++) ell(-150 + k*38, 22 + (k%2)*6, 14, 8, '#140c08'); g.restore();
}

// 살아 움직이는 불꽃 자리 (원본 좌표 · 반쪽 모습에서만): [x, y, 크기]
const HAT = [0, 1, 2, 3, 4].map(k => { const x = -120 + k*60; return [x*Math.cos(-.08), -250 + x*Math.sin(-.08), .9 + (k%2)*.4]; });
const LIVE = [[220, 30, 1.5], [200, 60, 1], [-150, 330, .8], [264, 21, .55], ...HAT];

const CACHE = {};
function art(half){ const k = half ? 'h' : 'n'; if (CACHE[k]) return CACHE[k];
  const cv = mkCanvas(SX*2*S*RES, (SY1 - SY0)*S*RES), g = cv.getContext('2d'); g.scale(S*RES, S*RES); g.translate(SX, -SY0); foxArt(g, half); return (CACHE[k] = cv); }

// 보스 몸: (x, y) = 발 자리. o = {half, t, rot, alpha, glow}
export function drawFox(c, x, y, o){
  const cv = art(o.half), w = cv.width/RES, h = cv.height/RES, bob = 1 + Math.sin(o.t*2.4)*.012;
  c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); c.scale(1, bob); c.translate(0, -FOOT*S);
  if (o.alpha != null) c.globalAlpha = o.alpha;
  c.drawImage(cv, -SX*S, SY0*S, w, h);
  if (o.half){ c.scale(S, S); LIVE.forEach(([fx, fy, fs], i) => flame(c, fx, fy, fs, o.t, i*1.7)); }
  else { c.scale(S, S); const sp = .5 + .5*Math.sin(o.t*5); c.fillStyle = `rgba(255,200,80,${.15 + .2*sp})`; c.beginPath(); c.arc(264, 21, 14, 0, 7); c.fill(); }
  c.restore(); }
// 손 · 물뿌리개 주둥이 (발 기준 월드 오프셋)
export const HAND = [264*S, (21 - FOOT)*S], SPOUT = [-151*S, (108 - FOOT)*S], CHEST = [0, (60 - FOOT)*S];
export const TOP = (FOOT + 330)*S;

// 발자국 모양 (여우 발)
export function printShape(c, x, y, a, sc, col){ c.save(); c.translate(x, y); c.rotate(a); c.scale(1, .55); c.fillStyle = col;
  c.beginPath(); c.ellipse(4*sc, 0, 11*sc, 8*sc, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(-12*sc, 0, 6*sc, 6*sc, 0, 0, 7); c.fill();
  for (let i = -1; i <= 1; i++){ c.beginPath(); c.ellipse(17*sc, i*6*sc, 3.2*sc, 2.6*sc, 0, 0, 7); c.fill(); } c.restore(); }

// 불빛 동그라미 (lighter 로 겹쳐 그리는 빛)
let GLOW = null;
export function glow(){ if (GLOW) return GLOW; const cv = mkCanvas(64, 64), g = cv.getContext('2d'), q = g.createRadialGradient(32, 32, 1, 32, 32, 32);
  q.addColorStop(0, 'rgba(255,170,70,1)'); q.addColorStop(.45, 'rgba(255,100,30,.45)'); q.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = q; g.fillRect(0, 0, 64, 64); return (GLOW = cv); }
// 연기 덩어리
let PUFF = null;
export function puff(){ if (PUFF) return PUFF; const cv = mkCanvas(128, 80), g = cv.getContext('2d'); g.scale(1, .62); const q = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  q.addColorStop(0, 'rgba(120,112,106,.75)'); q.addColorStop(.6, 'rgba(96,90,86,.45)'); q.addColorStop(1, 'rgba(80,76,72,0)'); g.fillStyle = q; g.fillRect(0, 0, 128, 128); return (PUFF = cv); }

// ===== 50% 변신: 가장자리부터 종이처럼 타들어 가는 화면 =====
const GW = 150, GH = 124;
const hsh = (i, j) => { const s = Math.sin(i*127.1 + j*311.7)*43758.5453; return s - Math.floor(s); };
const mix = (a, b, u) => a + (b - a)*u;
function vnoise(x, y){ const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx*fx*(3 - 2*fx), v = fy*fy*(3 - 2*fy);
  return mix(mix(hsh(i, j), hsh(i + 1, j), u), mix(hsh(i, j + 1), hsh(i + 1, j + 1), u), v); }
let BN = null, BNk = '', BM = null, BG = null, RESID = null, RESk = '';
function burnInit(w, h){ const key = `${w|0}x${h|0}`; if (BN && BNk === key) return; BNk = key; BN = new Float32Array(GW*GH); const m = Math.min(w, h)/2;
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++){ const x = i/(GW - 1)*w, y = j/(GH - 1)*h, e = Math.min(x, w - x, y, h - y)/m;
    const n = vnoise(i/9, j/9)*.6 + vnoise(i/3.4, j/3.4)*.3 + vnoise(i/1.4, j/1.4)*.1; BN[j*GW + i] = e + (n - .5)*.38; }
  BM = mkCanvas(GW, GH); BG = mkCanvas(GW, GH); RESID = null; }
function burnPaint(p, live, t){ const mc = BM.getContext('2d'), gc = BG.getContext('2d'), md = mc.createImageData(GW, GH), gd = gc.createImageData(GW, GH), M = md.data, G = gd.data;
  const band = live ? .06 : .035, gI = live ? 1 : .5, hA = live ? 255 : 220;
  for (let k = 0; k < GW*GH; k++){ const v = BN[k] + Math.sin(k*.37 + t*5)*.004, o = k*4;
    if (v < p - band){ M[o] = 4; M[o + 1] = 1; M[o + 2] = 0; M[o + 3] = hA; if (live && hsh(k, Math.floor(t*6)) > .992){ G[o] = 255; G[o + 1] = 90; G[o + 2] = 20; G[o + 3] = 200; } }
    else if (v < p){ const u = (v - (p - band))/band; M[o] = 20 + u*60; M[o + 1] = 6 + u*10; M[o + 2] = 0; M[o + 3] = hA; G[o] = 255; G[o + 1] = 70 + u*170; G[o + 2] = 10 + u*90; G[o + 3] = 255*gI*(.5 + .5*u); }
    else if (v < p + .035){ const u = (v - p)/.035; M[o] = 40; M[o + 1] = 22; M[o + 2] = 10; M[o + 3] = 200*(1 - u); } }
  mc.putImageData(md, 0, 0); gc.putImageData(gd, 0, 0); }
// 화면 테두리 타들어 감. p = 정도 (0 ~ .7) · live = 지금 타는 중
export function drawBurn(c, w, h, p, live, t, alpha = 1){ if (p <= .002) return; burnInit(w, h);
  if (!live){ const key = `${w|0}x${h|0}:${p.toFixed(3)}`; if (!RESID || RESk !== key){ burnPaint(p, false, 0); RESk = key; RESID = [mkCanvas(GW, GH), mkCanvas(GW, GH)]; RESID[0].getContext('2d').drawImage(BM, 0, 0); RESID[1].getContext('2d').drawImage(BG, 0, 0); }
    c.save(); c.imageSmoothingEnabled = true; c.globalAlpha = alpha; c.drawImage(RESID[0], 0, 0, w, h); c.globalCompositeOperation = 'lighter'; c.globalAlpha = alpha*(.3 + .1*Math.sin(t*3.1)); c.drawImage(RESID[1], 0, 0, w, h); c.restore(); return; }
  burnPaint(p, true, t);
  c.save(); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.globalAlpha = alpha; c.drawImage(BM, 0, 0, w, h); c.globalCompositeOperation = 'lighter'; c.drawImage(BG, -6, -6, w + 12, h + 12); c.globalAlpha = alpha*.8; c.drawImage(BG, 0, 0, w, h); c.restore(); }
export { hsh };
