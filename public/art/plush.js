// 오락실 경품 인형 20 종 (말랑 찹쌀떡 몸 · 콩알 눈 · 간식 모자). 집에 가구처럼 놓아요.
// drawPlush(c, x, y, i, s): (x, y) 는 바닥에 닿는 점, s 는 크기 (1 이면 키 약 130px)
let g = null;
const lg = (x0, y0, x1, y1, ...st) => { const q = g.createLinearGradient(x0, y0, x1, y1); st.forEach((s, i) => q.addColorStop(i/(st.length - 1), s)); return q; };
const rg = (x, y, r, a, b) => { const q = g.createRadialGradient(x - r*.35, y - r*.4, r*.05, x, y, r*1.1); q.addColorStop(0, a); q.addColorStop(1, b); return q; };
const ell = (x, y, rx, ry, f, rot = 0) => { g.beginPath(); g.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, 7); g.fillStyle = f; g.fill(); };
const rr = (x, y, w, h, f, r = 10, st) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fillStyle = f; g.fill(); if (st){ g.strokeStyle = st; g.lineWidth = 2; g.stroke(); } };
const txt = (t, x, y, s, col) => { g.font = `${s}px sans-serif`; g.textAlign = 'center'; g.fillStyle = col; g.fillText(t, x, y); };
export const PLUSH = [
  ['딸기 토끼', '#ffd6e0', 'bunny', 'berry', 1], ['구름 양', '#ffffff', 'sheep', 'cloud', 1], ['푸딩 곰', '#ffe6a8', 'bear', 'pudding', 1], ['마카롱 햄찌', '#fff0d8', 'ham', 'macaron', 1],
  ['복숭아 병아리', '#fff09a', 'chick', 'peach', 1], ['솜사탕 강아지', '#fff4f8', 'dog', 'cotton', 1], ['벚꽃 여우', '#ffc9a0', 'cat', 'sakura', 1], ['수박 오리', '#fff6c8', 'duck', 'melon', 1],
  ['꿀벌 곰', '#ffd970', 'bear', 'bee', 2], ['리본 고양이', '#fdfbff', 'cat', 'ribbon', 2], ['민트 공룡', '#bff0dc', 'dino', 'mintchip', 2], ['젤리 문어', '#ffc2d8', 'octo', 'jelly', 2],
  ['도넛 수달', '#e8c8a8', 'bear', 'donut', 2], ['달빛 부엉이', '#d8d4f4', 'owl', 'moon', 2], ['하트 판다', '#ffffff', 'panda', 'heart', 2], ['아이스크림 펭귄', '#c8dcf8', 'peng', 'icecream', 2],
  ['무지개 유니콘', '#fff8fc', 'uni', 'rainbow', 3], ['별 고양이', '#fff2b8', 'cat', 'star', 3], ['꽃 사슴', '#f4dcc0', 'deer', 'flower', 3], ['왕관 토끼', '#fff6e0', 'bunny', 'crown', 4]];
const dk = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v*k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
function mochi(col, w = 62, h = 54){ // 말랑한 몸 하나 (머리 = 몸)
  ell(0, 60, w*.8, 8, 'rgba(120,80,110,.15)');
  const q = g.createRadialGradient(-w*.3, -h*.2, 4, 0, 6, w*1.15); q.addColorStop(0, '#fff'); q.addColorStop(.55, col); q.addColorStop(1, dk(col, .9));
  g.fillStyle = q; g.beginPath(); g.moveTo(-w, 34); g.bezierCurveTo(-w*1.04, -h*.9, w*1.04, -h*.9, w, 34); g.bezierCurveTo(w*.96, 62, -w*.96, 62, -w, 34); g.fill();
  g.strokeStyle = dk(col, .82); g.lineWidth = 2; g.stroke();
  ell(-w*.42, -h*.28, 14, 8, 'rgba(255,255,255,.7)', -.5); // 반짝
  for (const s of [-1, 1]) ell(s*w*.42, 58, 13, 7, dk(col, .95)); }
function face(y = 18, gap = 19, dark){ for (const s of [-1, 1]){ ell(s*gap, y, 5, 6.2, '#2a1a24'); ell(s*gap - 1.6, y - 2.4, 1.8, 1.8, '#fff'); ell(s*gap + 1.4, y + 1.8, .9, .9, 'rgba(255,255,255,.8)'); ell(s*(gap + 12), y + 10, 8, 4.6, 'rgba(255,120,150,.5)'); }
  g.strokeStyle = '#4a2a34'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.arc(-3.5, y + 8, 3.5, .1, Math.PI - .1); g.arc(3.5, y + 8, 3.5, .1, Math.PI - .1); g.stroke(); }
function ears(kind, col){ const ec = dk(col, .97), inn = '#ffc8d6';
  if (kind === 'bunny') for (const s of [-1, 1]){ g.save(); g.translate(s*22, -36); g.rotate(s*.18); ell(0, -30, 13, 34, ec); ell(0, -28, 6, 24, inn); g.restore(); }
  if (kind === 'bear' || kind === 'panda' || kind === 'ham') for (const s of [-1, 1]){ const r = kind === 'ham' ? 11 : 15; ell(s*40, -36, r, r, kind === 'panda' ? '#3a3a46' : ec); ell(s*40, -35, r*.55, r*.55, kind === 'panda' ? '#55556a' : inn); }
  if (kind === 'cat') for (const s of [-1, 1]){ g.fillStyle = ec; g.beginPath(); g.moveTo(s*20, -38); g.quadraticCurveTo(s*40, -74, s*54, -30); g.fill(); g.fillStyle = inn; g.beginPath(); g.moveTo(s*28, -38); g.quadraticCurveTo(s*40, -62, s*48, -34); g.fill(); }
  if (kind === 'dog') for (const s of [-1, 1]){ g.save(); g.translate(s*52, -20); g.rotate(s*.35); ell(0, 14, 14, 26, dk(col, .9)); g.restore(); }
  if (kind === 'sheep'){ for (let i = 0; i < 9; i++){ const a = Math.PI*(1.1 + i/8*.8); ell(Math.cos(a)*50, -2 + Math.sin(a)*40, 15, 15, '#fff'); } for (const s of [-1, 1]){ g.save(); g.translate(s*58, 0); g.rotate(s*.6); ell(0, 0, 8, 16, '#ffe4d4'); g.restore(); } }
  if (kind === 'chick'){ g.strokeStyle = '#f0c040'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -44); g.quadraticCurveTo(-6, -60, 4, -64); g.moveTo(0, -44); g.quadraticCurveTo(8, -58, 14, -56); g.stroke(); }
  if (kind === 'deer'){ g.strokeStyle = '#c8945a'; g.lineWidth = 5; g.lineCap = 'round'; for (const s of [-1, 1]){ g.beginPath(); g.moveTo(s*18, -40); g.lineTo(s*26, -68); g.moveTo(s*23, -58); g.lineTo(s*38, -64); g.stroke(); g.save(); g.translate(s*50, -26); g.rotate(s*.7); ell(0, 0, 8, 15, ec); ell(0, 0, 4, 9, inn); g.restore(); } }
  if (kind === 'owl') for (const s of [-1, 1]){ g.fillStyle = ec; g.beginPath(); g.moveTo(s*30, -40); g.lineTo(s*48, -62); g.lineTo(s*52, -30); g.fill(); }
  if (kind === 'uni'){ g.fillStyle = lg(-8, -90, 8, -40, '#fff2a0', '#ffc840'); g.beginPath(); g.moveTo(-9, -42); g.lineTo(0, -88); g.lineTo(9, -42); g.fill(); g.strokeStyle = 'rgba(200,140,40,.5)'; g.lineWidth = 1.5; for (let i = 0; i < 4; i++){ g.beginPath(); g.moveTo(-7 + i*1.5, -50 - i*9); g.lineTo(7 - i*1.5, -46 - i*9); g.stroke(); } for (const s of [-1, 1]){ g.fillStyle = ec; g.beginPath(); g.moveTo(s*24, -36); g.lineTo(s*36, -60); g.lineTo(s*44, -30); g.fill(); } }
  if (kind === 'dino') for (let i = 0; i < 5; i++){ const a = Math.PI*(1.2 + i*.15); g.fillStyle = '#7ad8b0'; g.beginPath(); g.moveTo(Math.cos(a - .1)*52, 4 + Math.sin(a - .1)*46); g.lineTo(Math.cos(a)*68, 4 + Math.sin(a)*60); g.lineTo(Math.cos(a + .1)*52, 4 + Math.sin(a + .1)*46); g.fill(); }
}
function hat(kind){
  if (kind === 'berry'){ g.save(); g.translate(0, -44); g.fillStyle = lg(0, -26, 0, 22, '#ff8aa0', '#ff4a6a'); g.beginPath(); g.moveTo(-30, -6); g.quadraticCurveTo(0, -18, 30, -6); g.quadraticCurveTo(24, 26, 0, 30); g.quadraticCurveTo(-24, 26, -30, -6); g.fill(); for (let i = 0; i < 9; i++) ell(-16 + (i%3)*16, 0 + Math.floor(i/3)*9, 1.8, 2.4, '#fff4a0'); for (let i = 0; i < 5; i++){ g.fillStyle = '#5ac46a'; g.beginPath(); g.ellipse(-16 + i*8, -12, 9, 4, (i - 2)*.5, 0, 7); g.fill(); } g.restore(); }
  if (kind === 'cloud'){ for (const [x, y, r] of [[-26, -46, 16], [0, -54, 20], [24, -46, 16], [-10, -40, 14], [12, -40, 14]]) ell(x, y, r, r*.8, '#e8f4ff'); ell(30, -66, 4, 4, '#bfe0ff'); }
  if (kind === 'pudding'){ g.fillStyle = '#c87830'; g.beginPath(); g.moveTo(-26, -40); g.quadraticCurveTo(0, -56, 26, -40); g.quadraticCurveTo(28, -30, 18, -28); g.quadraticCurveTo(12, -20, 6, -30); g.quadraticCurveTo(-4, -18, -10, -30); g.quadraticCurveTo(-24, -26, -26, -40); g.fill(); ell(0, -56, 9, 9, '#ff3a5a'); ell(-3, -59, 2.5, 2.5, '#fff'); g.strokeStyle = '#4a8a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -64); g.quadraticCurveTo(4, -74, 10, -76); g.stroke(); }
  if (kind === 'macaron'){ ell(0, -44, 26, 10, '#ffb8d0'); ell(0, -50, 24, 4, '#fff8f0'); ell(0, -55, 26, 10, '#ffb8d0'); }
  if (kind === 'peach'){ ell(0, -40, 24, 20, rg(0, -42, 24, '#fff0e0', '#ffa898')); g.strokeStyle = 'rgba(220,110,110,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -58); g.quadraticCurveTo(-6, -40, 0, -22); g.stroke(); ell(10, -60, 10, 5, '#7ac46a', -.4); }
  if (kind === 'cotton'){ for (let i = 0; i < 8; i++){ const a = i/8*6.28; ell(Math.cos(a)*16, -54 + Math.sin(a)*12, 12, 12, i%2 ? '#ffc8e0' : '#c8e4ff'); } ell(0, -54, 16, 13, '#ffd8ec'); }
  if (kind === 'sakura'){ for (let i = 0; i < 5; i++){ const a = i/5*6.28 - 1.57; ell(30 + Math.cos(a)*9, -40 + Math.sin(a)*9, 7, 5, '#ffb8cc', a); } ell(30, -40, 4, 4, '#ffe080'); ell(-30, 20, 0, 0, '#000'); }
  if (kind === 'melon'){ g.save(); g.translate(0, -40); g.fillStyle = '#4ab060'; g.beginPath(); g.arc(0, 0, 30, Math.PI, 0); g.fill(); g.fillStyle = '#ff6a7a'; g.beginPath(); g.arc(0, 0, 25, Math.PI, 0); g.fill(); for (const x of [-12, 0, 12]) ell(x, -10, 2, 3, '#2a1a20'); g.restore(); }
  if (kind === 'bee'){ g.fillStyle = 'rgba(80,50,30,.75)'; for (const y of [26, 40]){ g.beginPath(); g.ellipse(0, y, 56, 5, 0, 0, 7); g.fill(); } for (const s of [-1, 1]) ell(s*30, -40, 18, 12, 'rgba(220,240,255,.85)', s*.5); g.strokeStyle = '#4a3020'; g.lineWidth = 2.5; for (const s of [-1, 1]){ g.beginPath(); g.moveTo(s*8, -42); g.quadraticCurveTo(s*14, -60, s*20, -62); g.stroke(); ell(s*20, -62, 4, 4, '#4a3020'); } }
  if (kind === 'ribbon'){ for (const s of [-1, 1]){ g.fillStyle = '#ff7fa8'; g.beginPath(); g.moveTo(26, -40); g.quadraticCurveTo(26 + s*24, -60, 26 + s*20, -28); g.closePath(); g.fill(); } ell(26, -40, 6, 6, '#ff5a8a'); }
  if (kind === 'mintchip'){ for (let i = 0; i < 8; i++) ell(-30 + (i*17)%60, 10 + (i*13)%30, 3, 2, '#5a3a2a'); }
  if (kind === 'jelly'){ for (let i = 0; i < 6; i++){ const x = -45 + i*18; g.fillStyle = dk('#ffc2d8', .95); g.beginPath(); g.ellipse(x, 52, 8, 14, (i - 2.5)*.15, 0, 7); g.fill(); } ell(-26, -40, 0, 0, '#000'); for (const [x, y, c] of [[-20, -48, '#ff6a8a'], [0, -56, '#ffc840'], [20, -48, '#7ac8ff']]) ell(x, y, 8, 8, c); }
  if (kind === 'donut'){ ell(0, -44, 26, 12, '#e8b878'); ell(0, -47, 23, 9, '#ff9ac0'); ell(0, -47, 8, 3.5, '#e8b878'); for (let i = 0; i < 8; i++) g.fillRect(-18 + i*5, -50 + (i%3)*3, 3, 1.5); }
  if (kind === 'moon'){ g.fillStyle = '#ffe070'; g.beginPath(); g.arc(28, -46, 14, 0, 7); g.fill(); g.fillStyle = '#d8d4f4'; g.beginPath(); g.arc(34, -50, 12, 0, 7); g.fill(); for (const s of [-1, 1]){ ell(s*19, 18, 13, 13, 'rgba(255,255,255,.7)'); } ell(0, 28, 5, 4, '#ffb84a'); }
  if (kind === 'heart'){ for (const s of [-1, 1]) ell(s*19, 18, 12, 14, '#3a3a46', s*-.3); g.fillStyle = '#ff6a8a'; g.save(); g.translate(28, -44); g.beginPath(); g.moveTo(0, 8); g.bezierCurveTo(-14, -2, -8, -14, 0, -6); g.bezierCurveTo(8, -14, 14, -2, 0, 8); g.fill(); g.restore(); }
  if (kind === 'icecream'){ g.save(); g.translate(0, -44); g.fillStyle = '#e8b06a'; g.beginPath(); g.moveTo(-14, 0); g.lineTo(0, 0); g.lineTo(14, 0); g.lineTo(0, 0); g.fill(); ell(0, -2, 22, 14, '#ffd0e0'); ell(-8, -14, 14, 12, '#c8f0e0'); ell(10, -14, 13, 11, '#fff2c8'); ell(0, -26, 5, 5, '#ff3a5a'); g.restore(); ell(0, 20, 30, 26, 'rgba(255,255,255,.85)'); ell(0, 30, 6, 4, '#ffb84a'); }
  if (kind === 'rainbow'){ const cs = ['#ff9aa8', '#ffc88a', '#fff09a', '#a8e8a8', '#9ad0ff', '#c8a8ff']; cs.forEach((cc, i) => ell(-50 + i*4, -10 + i*14, 14, 12, cc)); }
  if (kind === 'star'){ g.save(); g.translate(26, -48); g.fillStyle = '#ffc820'; g.beginPath(); for (let i = 0; i < 10; i++){ const a = i/10*6.28 - 1.57, r = i%2 ? 7 : 16; g.lineTo(Math.cos(a)*r, Math.sin(a)*r); } g.fill(); g.restore(); for (const [x, y] of [[-46, -30], [50, 10], [-40, 40]]) txt('✦', x, y, 12, '#ffd040'); }
  if (kind === 'flower'){ for (const [x, c] of [[-24, '#ffb8cc'], [0, '#fff09a'], [24, '#c8b8ff']]){ for (let i = 0; i < 5; i++){ const a = i/5*6.28; ell(x + Math.cos(a)*6, -46 + Math.sin(a)*6, 5, 5, c); } ell(x, -46, 3, 3, '#ffa040'); } }
  if (kind === 'crown'){ g.fillStyle = lg(0, -78, 0, -44, '#fff2a0', '#ffb820'); g.beginPath(); g.moveTo(-24, -44); g.lineTo(-26, -70); g.lineTo(-12, -56); g.lineTo(0, -78); g.lineTo(12, -56); g.lineTo(26, -70); g.lineTo(24, -44); g.closePath(); g.fill(); for (const x of [-12, 0, 12]) ell(x, -50, 3.5, 3.5, x ? '#ff6a8a' : '#6ac8ff'); for (let i = 0; i < 7; i++) txt('✦', Math.cos(i*.9)*66, 8 + Math.sin(i*1.7)*46, 13, '#ffd040'); }
}
function snout(kind){ if (kind === 'chick' || kind === 'duck'){ g.fillStyle = '#ffb040'; g.beginPath(); g.ellipse(0, 28, kind === 'duck' ? 12 : 6, kind === 'duck' ? 5 : 4, 0, 0, 7); g.fill(); return true; }
  if (kind === 'peng'){ g.fillStyle = '#ffb040'; g.beginPath(); g.moveTo(-5, 26); g.lineTo(5, 26); g.lineTo(0, 32); g.fill(); return true; } return false; }
function plush(x, y, k, col, ek, hk){ g.save(); g.translate(x, y);
  if (hk === 'rainbow') hat(hk);
  if (ek === 'dino'){ ears(ek, col); g.fillStyle = dk(col, .92); g.beginPath(); g.moveTo(52, 30); g.quadraticCurveTo(84, 40, 92, 20); g.quadraticCurveTo(80, 52, 50, 50); g.fill(); }
  if (ek === 'octo') hat(hk);
  if (ek !== 'dino' && ek !== 'octo') ears(ek, col);
  if (ek === 'peng'){ mochi('#5a6488'); ell(0, 22, 44, 34, '#fff'); for (const s of [-1, 1]) ell(s*60, 22, 9, 18, '#5a6488', s*.4); }
  else mochi(col);
  if (ek === 'panda' && hk !== 'heart') for (const s of [-1, 1]) ell(s*19, 18, 12, 14, '#3a3a46', s*-.3);
  if (hk !== 'rainbow' && hk !== 'jelly') hat(hk);
  if (!snout(ek === 'chick' || ek === 'duck' || ek === 'peng' ? ek : '')) face(); else { for (const s of [-1, 1]){ ell(s*19, 16, 5, 6.2, '#2a1a24'); ell(s*19 - 1.6, 13.6, 1.8, 1.8, '#fff'); ell(s*31, 26, 8, 4.6, 'rgba(255,120,150,.5)'); } }
  if (ek === 'panda' || hk === 'moon' || hk === 'heart'){ for (const s of [-1, 1]){ ell(s*19, 18, 5, 6.2, '#fff'); ell(s*19, 18, 3.6, 4.6, '#2a1a24'); ell(s*19 - 1.2, 16, 1.4, 1.4, '#fff'); } }
  g.save(); g.translate(42, 44); g.rotate(.25); rr(0, 0, 18, 13, '#fff', 2, 'rgba(120,90,100,.4)'); g.fillStyle = '#ff7fa8'; g.font = '8px M'; g.textAlign = 'center'; g.fillText('♥', 9, 10); g.restore();
  g.restore(); }

export function drawPlush(c, x, y, i, s = .4){ const p = PLUSH[i]; if (!p) return; g = c; c.save(); c.translate(x, y - 62*s); c.scale(s, s); try { plush(0, 0, p[0], p[1], p[2], p[3]); } finally { c.restore(); g = null; } }
export const PLUSH_TIER = ['', '흔함', '희귀', '아주 희귀', '전설'];
