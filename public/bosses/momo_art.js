// 모모??? (모정민) 보스 그림: 웃는 호랑이 파티시에 + 분홍 배달 수레 · 50% 뒤엔 반죽 탈이 갈라진 모습
// 무거운 그림이라 처음 한 번만 작은 캔버스에 그려 두고 drawImage 해요 (momo.js 가 가져다 써요)
let g = null, sd = 71;
const R = () => (sd = (sd*16807) % 2147483647)/2147483647;
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fillStyle = f; g.fill(); };
const txt = (t, x, y, s, col) => { g.save(); g.font = `bold ${s*1.35}px "Dongle",sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(t, x, y); g.restore(); };
function rr(x, y, w, h, f, r = 6){ g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); }
function bow(x, y, s, col){ g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; for (const sx of [-1, 1]){ g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(sx*14, -14, sx*22, -5); g.quadraticCurveTo(sx*22, 7, 0, 0); g.fill(); g.beginPath(); g.moveTo(sx*2, 2); g.lineTo(sx*9, 18); g.lineTo(sx*5, 20); g.closePath(); g.fill(); } ell(0, 0, 5, 5, col); g.restore(); }
function wheel(x, y, r, rot, broken, ribbon){ g.save(); g.translate(x, y); g.rotate(rot); ell(0, 0, r, r, broken ? '#5a3a24' : '#d8a860'); ell(0, 0, r - 9, r - 9, '#2a1a12'); g.strokeStyle = broken ? '#8a6a4a' : '#f0d090'; g.lineWidth = 6; for (let k = 0; k < 8; k++){ if (broken && (k === 2 || k === 5)) continue; const a = k/8*6.283; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a)*(r - 9), Math.sin(a)*(r - 9)); g.stroke(); } if (broken){ g.strokeStyle = '#8a6a4a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(2/8*6.283)*(r*.45), Math.sin(2/8*6.283)*(r*.45)); g.lineTo(Math.cos(2/8*6.283)*(r*.45) + 8, Math.sin(2/8*6.283)*(r*.45) + 4); g.stroke(); } ell(0, 0, 10, 10, broken ? '#8a6a4a' : '#f0d090'); g.restore();
  if (ribbon){ g.save(); g.translate(x, y); g.rotate(rot + 2/8*6.283); g.strokeStyle = '#ff8fb0'; g.lineWidth = 5; for (let k = 0; k < 4; k++){ g.beginPath(); g.ellipse(r*.25 + k*6, 0, 4, 9, 0, 0, 7); g.stroke(); } g.restore(); bow(x + Math.cos(rot + 1.57)*r*.4, y + Math.sin(rot + 1.57)*r*.4, .9, '#ff8fb0'); } }
function cart(half, rot){ g.save(); g.scale(1, .22); ell(0, 1700, 260, 260, 'rgba(0,0,0,.6)'); g.restore();
  g.save(); if (half) g.rotate(-.08); rr(-190, 230, 380, 90, lg(0, 230, 0, 320, '#f4c0cc', '#b07884'), 12); rr(-196, 222, 392, 16, '#9a5a66', 6); txt(half ? '새벽 배달 · 5:40' : '모모 케이크 · 새벽 배달', 0, 280, 26, '#4a1a24'); g.restore();
  wheel(-120, 340, 54, rot, half, half); wheel(120, 340, 54, rot, false, false);
  if (half){ g.strokeStyle = '#5a4030'; g.lineWidth = 2; g.beginPath(); g.moveTo(170, 300); g.lineTo(176, 360); g.stroke(); g.save(); g.translate(178, 372); g.rotate(.4); g.fillStyle = '#9ad8ff'; g.beginPath(); g.moveTo(-16, 6); g.quadraticCurveTo(-16, -10, -2, -10); g.lineTo(8, -10); g.quadraticCurveTo(18, -8, 18, 6); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(-16, 3, 34, 4); g.restore(); // 수레에 걸린 작은 하늘색 운동화
    for (let k = 0; k < 8; k++){ g.save(); g.translate(-120 + (R() - .5)*120, 390 + R()*20); g.rotate(R()*6); g.fillStyle = '#8a6a4a'; g.fillRect(-12, -2, 24, 4); g.restore(); } } }
function cakeTower(half){ const tiers = [[0, -270, 110, 50, '#fff4f0'], [0, -320, 82, 44, '#fff8f4'], [0, -364, 56, 38, '#fffafa']];
  if (!half){ for (const [x, y, w, h, col] of tiers){ rr(x - w, y - h, w*2, h, lg(0, y - h, 0, y, col, '#f0ccc0'), 10); for (let i = 0; i < 9; i++) ell(x - w + 8 + i*(w*2 - 16)/8, y - h, 7, 6, '#fffafa'); bow(x, y - h/2, .7, '#8ac8ff'); } ell(0, -406, 12, 12, '#e83a4a'); g.strokeStyle = '#c8202e'; g.lineWidth = 3; g.beginPath(); g.moveTo(4, -396); g.quadraticCurveTo(10, -370, 6, -350); g.stroke(); ell(6, -348, 3, 4, '#c8202e'); g.fillStyle = '#5a8a3a'; g.fillRect(-2, -422, 4, 12); for (let k = 0; k < 6; k++) ell(-80 + k*32, -276, 6, 6, '#e83a4a'); }
  else { g.save(); g.translate(0, -262); g.rotate(.32); rr(-110, -50, 220, 50, lg(0, -50, 0, 0, '#f4e0d8', '#c89888'), 10); g.restore(); g.save(); g.translate(70, -310); g.rotate(.7); rr(-70, -40, 140, 40, '#f0d8cc', 10); g.restore();
    for (let k = 0; k < 8; k++){ const x = -100 + k*28, L = 40 + (k*37)%60; g.strokeStyle = '#fff0ec'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, -262); g.lineTo(x + 4, -262 + L); g.stroke(); }
    bow(-60, -290, .7, '#9ab8d0'); } }
// parts: 1 = 호랑이만 · 2 = 수레만 · 3 = 둘 다
function tiger(half, rot, parts = 3){ sd = 71;
  if (parts & 2) cart(half, rot);
  if (!(parts & 1)) return;
  if (half){ const au = g.createRadialGradient(0, -60, 30, 0, -60, 300); au.addColorStop(0, 'rgba(200,30,50,.38)'); au.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = au; g.fillRect(-300, -380, 600, 620); }
  if (parts === 1){ g.save(); g.scale(1, .3); ell(0, 236/.3, 150, 120, 'rgba(0,0,0,.45)'); g.restore(); }
  const OR = '#f0a050', ORd = '#c06a20', CR = '#fff4e6';
  for (const s2 of [-1, 1]) ell(s2*56, 210, 32, 26, rg(s2*56, 200, 32, half ? '#e0c098' : OR, half ? '#8a6a4a' : ORd));
  ell(0, 80, 140, 160, rg(-30, 30, 170, half ? '#e8c8a0' : '#ffc080', half ? '#8a6a4a' : ORd)); ell(0, 110, 90, 120, rg(-20, 80, 120, '#fffaf0', '#f0d8c0'));
  g.strokeStyle = '#3a2010'; g.lineWidth = 9; g.lineCap = 'round'; for (const s2 of [-1, 1]) for (let k = 0; k < 3; k++){ const yy = 20 + k*60; g.beginPath(); if (half){ g.setLineDash([14, 6]); g.moveTo(s2*140, yy); g.lineTo(s2*96, yy + 14); g.lineTo(s2*120, yy + 30); } else { g.moveTo(s2*138, yy); g.quadraticCurveTo(s2*112, yy + 6, s2*100, yy + 24); } g.stroke(); g.setLineDash([]); }
  g.fillStyle = half ? '#e8d8d0' : '#fff0f4'; g.beginPath(); g.moveTo(-70, -10); g.lineTo(70, -10); g.lineTo(96, 200); g.lineTo(-96, 200); g.closePath(); g.fill(); g.strokeStyle = '#ff9ab0'; g.lineWidth = 4; g.stroke();
  for (let i = 0; i < 9; i++) ell(-90 + i*22.5, 200, 10, 8, half ? '#e8d8d0' : '#fff0f4');
  if (!half){ bow(0, 60, 1.1, '#8ac8ff'); txt('모모', 0, 140, 24, '#c05070'); }
  else { for (let k = 0; k < 5; k++) ell(-50 + R()*100, 40 + R()*140, 10 + R()*10, 6 + R()*6, 'rgba(200,180,170,.8)'); bow(0, 60, 1.1, '#ff8fb0'); txt('5:40', 0, 140, 26, '#8a1010');
    g.strokeStyle = 'rgba(60,40,30,.6)'; g.lineWidth = 8; g.setLineDash([16, 6]); g.beginPath(); g.moveTo(-90, 180); g.lineTo(90, 40); g.stroke(); g.setLineDash([]); }
  for (const s2 of [-1, 1]){ g.save(); g.translate(s2*130, 0); g.rotate(s2*-.55); ell(0, 60, 32, 80, rg(0, 50, 80, half ? '#e0c098' : OR, half ? '#8a6a4a' : ORd)); ell(0, 136, 26, 22, CR); g.restore(); }
  // 짤주머니 (크림 폭탄) · 배달 종
  g.save(); g.translate(-210, 110); g.rotate(-.5); g.fillStyle = lg(-24, 0, 24, 0, '#ffffff', '#e0d0d8'); g.beginPath(); g.moveTo(-26, -40); g.lineTo(26, -40); g.lineTo(4, 40); g.lineTo(-4, 40); g.closePath(); g.fill(); ell(0, 44, 6, 8, half ? '#d8c8c0' : '#ffe0ec'); g.restore();
  g.save(); g.translate(214, 110); ell(0, -30, 4, 10, '#7a5a3a'); g.fillStyle = lg(-30, 0, 30, 0, '#d8a840', '#fff0a0', '#a87820'); g.beginPath(); g.moveTo(-30, 20); g.quadraticCurveTo(-26, -24, 0, -26); g.quadraticCurveTo(26, -24, 30, 20); g.closePath(); g.fill(); ell(0, 24, 6, 6, '#8a6a20'); g.restore();
  for (const s2 of [-1, 1]){ ell(s2*88, -240, 30, 30, rg(s2*88, -246, 30, half ? '#e0c098' : OR, half ? '#8a6a4a' : ORd)); ell(s2*88, -238, 16, 16, '#ffe0d0'); }
  ell(0, -160, 130, 112, rg(-30, -200, 130, half ? '#ecd0a8' : '#ffc080', half ? '#8a6a4a' : ORd));
  g.strokeStyle = '#3a2010'; g.lineWidth = 8; for (const s2 of [-1, 1]) for (let k = 0; k < 3; k++){ g.beginPath(); if (half) g.setLineDash([10, 5]); g.moveTo(s2*128, -190 + k*30); g.lineTo(s2*(98 - k*4), -184 + k*30); g.stroke(); g.setLineDash([]); } for (let k = 0; k < 3; k++){ g.beginPath(); g.moveTo(-14 + k*14, -268); g.lineTo(-10 + k*10, -236); g.stroke(); }
  if (!half){ ell(0, -118, 70, 50, CR); ell(0, -136, 14, 10, '#e87a8a'); } else ell(-30, -118, 44, 40, '#f0e0cc');
  if (!half){ g.strokeStyle = '#2a1810'; g.lineWidth = 5; for (const s2 of [-1, 1]){ g.beginPath(); g.arc(s2*44, -166, 14, Math.PI*1.15, Math.PI*1.85); g.stroke(); } g.lineWidth = 4; g.beginPath(); g.moveTo(-30, -122); g.quadraticCurveTo(-15, -100, 0, -116); g.quadraticCurveTo(15, -100, 30, -122); g.stroke(); ell(-82, -132, 18, 10, 'rgba(255,130,150,.55)'); ell(82, -132, 18, 10, 'rgba(255,130,150,.55)'); }
  else { // 반죽 탈이 쩍 갈라져요: 속은 어둡고 충혈된 사람 눈 하나 · 귀까지 찢어진 크림 미소 · 분홍 크림 눈물
    g.save(); g.beginPath(); g.moveTo(-6, -272); g.lineTo(10, -226); g.lineTo(-8, -190); g.lineTo(14, -150); g.lineTo(-4, -112); g.lineTo(10, -60); g.lineTo(60, -60); g.lineTo(60, -280); g.closePath(); g.clip();
    ell(0, -160, 122, 104, '#120806'); const gl = g.createRadialGradient(30, -168, 4, 30, -168, 50); gl.addColorStop(0, 'rgba(255,60,60,.35)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(-20, -220, 100, 110);
    ell(30, -166, 18, 13, '#efe4dc'); g.strokeStyle = 'rgba(190,20,30,.85)'; g.lineWidth = 1.4; for (let k = 0; k < 10; k++){ const a = R()*6.28; g.beginPath(); g.moveTo(30 + Math.cos(a)*17, -166 + Math.sin(a)*12); g.lineTo(30 + Math.cos(a)*7, -166 + Math.sin(a)*5); g.stroke(); } ell(28, -166, 7, 7, '#5a3a20'); ell(28, -166, 3.5, 3.5, '#000'); ell(26, -168, 1.5, 1.5, '#fff');
    g.restore();
    g.strokeStyle = '#f4dcc0'; g.lineWidth = 4; g.beginPath(); g.moveTo(-6, -272); g.lineTo(10, -226); g.lineTo(-8, -190); g.lineTo(14, -150); g.lineTo(-4, -112); g.lineTo(10, -60); g.stroke();
    g.strokeStyle = '#2a1810'; g.lineWidth = 5; g.beginPath(); g.arc(-44, -166, 14, Math.PI*1.15, Math.PI*1.85); g.stroke();
    g.fillStyle = '#3a0a10'; g.beginPath(); g.moveTo(-110, -128); g.quadraticCurveTo(-60, -70, -4, -100); g.lineTo(-4, -116); g.quadraticCurveTo(-60, -96, -110, -128); g.closePath(); g.fill();
    g.fillStyle = '#fffaf2'; for (let k = 0; k < 9; k++){ const t = k/9, x = -108 + t*102, y = -126 + Math.sin(t*Math.PI)*26; g.beginPath(); g.moveTo(x, y - 2); g.lineTo(x + 6, y - 2); g.lineTo(x + 3, y + 9); g.closePath(); g.fill(); }
    for (const [x0, L] of [[-44, 120], [30, 150]]){ g.strokeStyle = '#ff7aa0'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, -152); g.quadraticCurveTo(x0 + 6, -152 + L*.5, x0 - 2, -152 + L); g.stroke(); ell(x0 - 2, -146 + L, 8, 11, '#ff7aa0'); }
  }
  cakeTower(half); }

// 그림 상자 (그림 좌표): x -300 ~ 300, y -440 ~ 440 · 발(수레 그림자 가운데)은 y 392 · 호랑이만 그릴 땐 발이 y 236
export const BOX = { x0: -300, y0: -440, w: 600, h: 880 }, FOOT_FULL = 392, FOOT_TIGER = 236;
export const BELL = [214, 110], BAG = [-210, 154];
const FR = 4, cache = new Map();
// 미리 그린 캔버스: kind 'full' | 'tiger' | 'cart' · half (갈라진 탈) · fr 바퀴 돌림 칸 (0 ~ 3) · q 그림 1 단위의 화소 수
export function sprite(kind, half, fr, q){
  const key = `${kind}.${half ? 1 : 0}.${kind === 'tiger' ? 0 : fr % FR}.${q}`; let cv = cache.get(key); if (cv) return cv;
  cv = document.createElement('canvas'); cv.width = Math.ceil(BOX.w*q); cv.height = Math.ceil(BOX.h*q); g = cv.getContext('2d');
  g.setTransform(q, 0, 0, q, -BOX.x0*q, -BOX.y0*q); tiger(!!half, (fr % FR)/FR*(Math.PI/4), kind === 'tiger' ? 1 : kind === 'cart' ? 2 : 3); g = null;
  cache.set(key, cv); return cv;
}
export const FRAMES = FR;
export function clearArt(){ cache.clear(); }
