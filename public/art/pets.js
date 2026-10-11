// 반려동물 12 종 (유아용 점토). (x,y)는 발이 닿는 점, 키 약 24px (캐릭터의 절반쯤). 오른쪽을 보는 기준.
export const PET_SPECIES = [
  ['dog', '강아지', ['#f2d2a0', '#fffaf2', '#8a6a4a']], ['cat', '고양이', ['#ffc98f', '#c9c6cf', '#4a4550']],
  ['hamster', '햄스터', ['#f3c98f', '#fffaf2', '#c9b8a6']], ['lizard', '도마뱀', ['#f3d27a', '#a8dc8f', '#ffb3a0']],
  ['rabbit', '토끼', ['#fffaf2', '#d9b38c', '#b9b6c0']], ['guinea', '기니피그', ['#e8a06a', '#fffaf2', '#8a6a4a']],
  ['turtle', '거북이', ['#a8dc8f', '#c9b58f', '#9fd6c8']], ['hedgehog', '고슴도치', ['#e8c9a6', '#fff1e3', '#b98a64']],
  ['parrot', '앵무새', ['#8fdc7a', '#8fc3ea', '#ffe066']], ['ferret', '페럿', ['#f3e6d0', '#c9a07a', '#6f6470']],
  ['goldfish', '금붕어', ['#ff9a3d', '#ffd23f', '#fffaf2']],
  ['chick', '병아리', ['#ffe066', '#fff3a8', '#ffd0a0']],
  // ===== 2 차 펫 (아기 느낌 · 머리가 크고 몸이 작고 동글동글 · 눈이 반짝) =====
  ['pig', '돼지', ['#ffc3cf', '#3e3a44', '#f3c0a8'], 2], ['squirrel', '다람쥐', ['#d9905a', '#c9a07a', '#a8a0a8'], 2],
  ['bear', '곰', ['#a8784f', '#e8c9a0', '#f4f0ea'], 2], ['crow', '까마귀', ['#3e3a4e', '#4a5a7a', '#5a4a5e'], 2],
  ['husky', '허스키', ['#8a92a0', '#c9a07a', '#4a4650'], 2], ['dino', '공룡', ['#9fd9a8', '#ffb3c6', '#a8c8ff'], 2],
  ['bee', '꿀벌', ['#ffd45a', '#ffb347', '#fff1a0'], 2], ['sheep', '양', ['#fffaf2', '#f6d8e4', '#d8d4dc'], 2],
  ['snake', '뱀', ['#8fd47a', '#ffb3d1', '#a8c8ff'], 2], ['raccoon', '라쿤', ['#9a96a2', '#b8a08a', '#7a7484'], 2],
  ['deer', '사슴', ['#d9a06a', '#e8c09a', '#c08a5a'], 2], ['otter', '수달', ['#a8784f', '#c9a07a', '#8a6a5a'], 2],
];
const PI = Math.PI, INK = '#3b2433', flat = {flat: true, noShadow: true};
const tone = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join(''); };
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
// 옆을 보는 얼굴: 구슬 눈 하나 + 볼 + 코
const face = (d, x, y, k = 1, nose = '#5a3a44') => { d.ell(x, y, 1.1 * k, 1.5 * k, INK, flat); d.dot(x + .35 * k, y - .55 * k, .4 * k, '#ffffff', .95); d.ell(x - .6 * k, y + 2.2 * k, 1.5 * k, .9 * k, '#ff8fb0', flat); if (nose) d.dot(x + 3.4 * k, y + .9 * k, .9 * k, nose); };
// 2 차 펫 눈: 흰자·반짝이 없는 콩알 눈 (••) + 볼터치. dark = 몸이 어두우면 볼을 더 밝게, iris = 눈 색
const eye2 = (d, x, y, k = 1, dark = false, iris = INK) => { d.ell(x, y, 1.15 * k, 1.35 * k, dark && iris === INK ? '#100c10' : iris, flat); if (dark) d.dot(x + .35 * k, y - .45 * k, .38 * k, '#ffffff', .85); /* 어두운 몸에서는 콩알 눈이 보이게 작은 빛 하나 */ d.ell(x - .9 * k, y + 2.5 * k, 1.8 * k, 1 * k, dark ? '#ff9fbf' : '#ff8fb0', flat); };
const lum = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11) / 255; };
const paws = (d, col, step, xs = [-4, 4], y = 0) => xs.forEach((px, i) => oval(d, px + (i % 2 ? step : -step) * .8, y - 1.6, 2.4, 1.8, 0, col));
const P = (fn) => (d, x, y, col, t = 0, walk = false) => { const c = d.ctx, step = walk ? Math.sin(t * 10) : 0, bob = walk ? Math.abs(Math.sin(t * 10)) * 1.2 : Math.sin(t * 2) * .3;
  c.save(); c.fillStyle = 'rgba(60,30,50,.14)'; c.beginPath(); c.ellipse(x, y + .5, 9, 2.6, 0, 0, PI * 2); c.fill(); c.restore();
  c.save(); c.translate(x, y - bob); fn(d, col, step, t); c.restore(); };

export const PET_DRAW = {
  dog: P((d, col, s) => { const dk = tone(col, -.2); d.line(c => { c.moveTo(-7, -9); c.quadraticCurveTo(-12, -14, -10, -18); }, col, 3); paws(d, dk, s); oval(d, -1, -8, 8, 6.5, 0, col); d.circle(6, -15, 7, col); oval(d, 10.5, -13, 3.6, 2.8, 0, tone(col, .4)); oval(d, 3, -14, 2.6, 5, .3, dk); face(d, 7.5, -16, 1, INK); }),
  cat: P((d, col, s) => { const dk = tone(col, -.18); d.line(c => { c.moveTo(-7, -8); c.quadraticCurveTo(-13, -12, -10, -21); }, col, 2.6); paws(d, dk, s); oval(d, -1, -8, 7.5, 6, 0, col);
    for (const ex of [2.5, 8.5]) d.shape(c => { c.beginPath(); c.moveTo(ex - 3, -19); c.lineTo(ex, -25); c.lineTo(ex + 3, -19); c.closePath(); }, col, [ex, -21, 3]); d.circle(6, -15, 6.5, col); oval(d, 10, -13.4, 2.6, 2, 0, tone(col, .4)); face(d, 7.5, -16, 1, '#e8899c'); }),
  hamster: P((d, col, s) => { paws(d, tone(col, -.2), s, [-3, 3]); oval(d, 0, -7, 9, 7.5, 0, col); oval(d, 1, -5, 6, 4.4, 0, '#fffaf2', flat); for (const ex of [-2, 4]) d.circle(ex, -13.5, 2.2, tone(col, -.1)); oval(d, 6, -7, 2.6, 2, 0, '#ffd0d8', flat); face(d, 4.6, -9.5, .9, '#e8899c'); }),
  lizard: P((d, col, s) => { const dk = tone(col, -.2); d.line(c => { c.moveTo(-8, -4); c.quadraticCurveTo(-16, -3, -18, -7); }, col, 3.4); for (const px of [-6, 0, 5]) oval(d, px + s * (px % 2 ? 1 : -1), -1.5, 2, 1.6, 0, dk); oval(d, -2, -5, 9, 4.4, 0, col);
    for (const px of [-6, -2, 2]) d.dot(px, -6.5, 1.1, tone(col, -.25)); oval(d, 9, -7, 5.4, 4, 0, col); face(d, 10, -8.5, .9, null); d.line(c => { c.moveTo(12, -5.6); c.quadraticCurveTo(13, -5, 14, -5.8); }, INK, .6); }),
  rabbit: P((d, col, s) => { d.circle(-8, -8, 3, '#ffffff'); paws(d, tone(col, -.12), s); oval(d, -1, -8, 7.5, 6.5, 0, col); for (const [ex, r] of [[3.5, -.25], [6.5, .1]]) { oval(d, ex, -25, 2.2, 6.4, r, col); oval(d, ex, -25, 1, 4.6, r, '#ffc3d6', flat); } d.circle(6, -14.5, 6.4, col); face(d, 7.6, -15.6, 1, '#e8899c'); }),
  guinea: P((d, col, s) => { paws(d, tone(col, -.2), s, [-4, 3]); oval(d, 0, -7, 11, 7.4, 0, col); oval(d, -3, -9, 5, 4, 0, '#fffaf2', flat); d.circle(5, -12.5, 2.2, tone(col, -.15)); oval(d, 9.6, -6.6, 2.4, 2, 0, '#ffd0d8', flat); face(d, 7.4, -9, .9, '#e8899c'); }),
  turtle: P((d, col, s) => { const sk = '#b8e0a0'; for (const px of [-6, 5]) oval(d, px + s, -1.6, 2.6, 2, 0, sk); d.circle(10, -7, 4.6, sk); oval(d, 0, -7, 10, 7, 0, col); for (const [px, py] of [[-4, -9], [2, -10], [-1, -5]]) d.circle(px, py, 2.2, tone(col, -.15), flat); face(d, 11, -8, .85, null); }),
  hedgehog: P((d, col, s) => { const sp = tone(col, -.35); paws(d, tone(col, -.2), s, [-3, 3]); for (let i = 0; i < 7; i++) { const a = PI * (.95 + i * .13); d.circle(Math.cos(a) * 8 - 1, -8 + Math.sin(a) * 7, 3.6, sp); } oval(d, -1, -7, 8.4, 6.6, 0, sp); oval(d, 5, -6.5, 5.4, 4.6, 0, col); face(d, 6.5, -8, .9, INK); }),
  parrot: P((d, col, s) => { const dk = tone(col, -.2); for (const px of [-2, 2]) d.rr(px - .8, -3, 1.6, 3, .8, '#ffb347'); oval(d, -4, -4, 3, 7, -.7, dk); oval(d, 0, -9, 6.4, 8, -.15, col); oval(d, -2, -9, 3.6, 5.4, -.3, dk, flat); d.circle(3, -17, 5.4, col); oval(d, 7.6, -16, 2.4, 2, .3, '#ffd27a'); d.circle(2, -22, 1.6, '#ff8fb0'); face(d, 4.2, -18, .85, null); }),
  ferret: P((d, col, s) => { const dk = tone(col, -.25); d.line(c => { c.moveTo(-10, -6); c.quadraticCurveTo(-15, -6, -16, -9); }, dk, 2.6); paws(d, dk, s, [-6, 5]); oval(d, -1, -6, 11, 4.6, 0, col); d.circle(9, -10, 4.8, col); oval(d, 9.6, -10.4, 3.6, 1.6, 0, dk, flat); d.circle(7, -14.5, 1.6, col); face(d, 10.6, -10.6, .8, '#e8899c'); }),
  chinchilla: P((d, col, s) => { d.line(c => { c.moveTo(-7, -8); c.quadraticCurveTo(-13, -10, -12, -16); }, tone(col, -.12), 3.6); paws(d, tone(col, -.2), s, [-3, 3]); oval(d, 0, -8, 8, 7.4, 0, col); for (const ex of [1.5, 6]) d.circle(ex, -18, 3.4, col); d.circle(5, -12, 6, col); face(d, 7, -13, .9, '#e8899c'); }),
  goldfish: P((d, col, s, t) => { oval(d, 0, -1, 9, 2.6, 0, '#c9e8f5'); d.circle(0, -10, 10, '#dff3ff', {noShadow: true}); const fx = Math.sin(t * 1.5) * 2.4; d.circle(fx - 5.4, -10, 2.6, col); oval(d, fx, -10, 4.6, 3.4, 0, col); face(d, fx + 2.2, -11, .7, null); d.dot(-4, -15, 1.2, '#ffffff', .8); }),
  chick: P((d, col, s) => { for (const px of [-2, 2]) d.rr(px - .7, -3, 1.4, 3, .7, '#ffb347'); d.circle(0, -7.5, 7, col); oval(d, -2, -7, 3, 2.2, -.4, tone(col, -.08), flat); d.circle(2.4, -15, 1.6, col); oval(d, 6.6, -8.6, 1.8, 1.2, 0, '#ffb347'); face(d, 4, -9.6, .8, null); }),
  glider: P((d, col, s) => { const dk = tone(col, -.3); d.line(c => { c.moveTo(-7, -7); c.quadraticCurveTo(-14, -6, -15, -10); }, col, 3); paws(d, dk, s, [-3, 3]); oval(d, 0, -7, 9, 6, 0, col); oval(d, 0, -5, 6, 3.4, 0, '#fffaf2', flat); for (const ex of [2, 7]) d.circle(ex, -17.5, 2.8, col); d.circle(5, -12, 5.6, col); oval(d, 4, -14, .9, 3, 0, dk, flat); face(d, 7, -12.6, 1.1, '#e8899c'); }),
  // ===== 2 차 펫 =====
  pig: P((d, col, s) => { const dark = lum(col) < .35, dk = tone(col, dark ? .15 : -.1), sn = dark ? '#f6a8bc' : tone(col, .3); d.line(c => { c.moveTo(-7, -6); c.bezierCurveTo(-11, -9, -11, -3, -9, -4.5); }, dk, 1.1); paws(d, dk, s, [-3, 2.4]); oval(d, -1, -6, 6.4, 5.2, 0, col);
    for (const [ex, r] of [[1.4, -.7], [8.4, .7]]) { oval(d, ex, -22, 2.4, 3.2, r, col); oval(d, ex, -21.6, 1.2, 1.8, r, dark ? '#f6a8bc' : '#ff9fb4', flat); } d.circle(5, -15, 8.4, col);
    oval(d, 11.2, -13.4, 3.2, 2.5, 0, sn); d.dot(10.2, -13.4, .6, dark ? '#c0607a' : tone(col, -.4)); d.dot(12.2, -13.4, .6, dark ? '#c0607a' : tone(col, -.4)); eye2(d, 6.6, -16.4, 1.05, dark); }),
  squirrel: P((d, col, s) => { const lt = tone(col, .45); oval(d, -8.4, -14, 5.6, 8.4, -.3, col); oval(d, -9, -15, 2.8, 5.4, -.3, tone(col, .25), flat); paws(d, tone(col, -.2), s, [-2.4, 2.4]); oval(d, 0, -6, 5.6, 5, 0, col); oval(d, 1, -5.4, 3.4, 3, 0, lt, flat);
    d.circle(4.6, -14.4, 7.6, col); for (const ex of [1, 7.4]) { d.shape(c => { c.beginPath(); c.moveTo(ex - 2.2, -19.6); c.lineTo(ex, -25.4); c.lineTo(ex + 2.2, -19.6); c.closePath(); }, col, [ex, -22, 2]); d.dot(ex, -25.6, .9, tone(col, -.15)); } oval(d, 9.6, -12.4, 2.8, 2.2, 0, lt); d.dot(11.6, -13, .7, INK); eye2(d, 6.2, -15.6, 1);
    oval(d, 5.4, -5.6, 2.4, 2.8, 0, '#b07a3a'); d.ell(5.4, -8, 2.6, 1.1, '#7a4a20'); d.dot(5.4, -9.6, .5, '#7a4a20'); }),
  bear: P((d, col, s) => { const dk = tone(col, -.15), mz = tone(col, .5); paws(d, dk, s, [-3, 2.6]); oval(d, -1, -6.4, 6.6, 5.6, 0, col); oval(d, 0, -5.4, 3.6, 3, 0, mz, flat);
    for (const ex of [-.6, 9.6]) { d.circle(ex, -21.6, 3.2, col); d.circle(ex, -21.4, 1.6, tone(col, .35), flat); } d.circle(4.6, -15, 8.4, col); oval(d, 10, -12.6, 3.4, 2.8, 0, mz); d.ell(11.6, -13.4, 1.2, .9, INK); eye2(d, 6, -16.4, 1.05); }),
  crow: P((d, col, s) => { const dk = tone(col, -.2); for (const px of [-1.6, 1.6]) d.rr(px - .6, -2.6, 1.2, 2.6, .6, '#e8a04a'); oval(d, -5.6, -5.4, 3, 2, .4, dk); d.circle(0, -9, 8, col); oval(d, -2.6, -8.4, 3.6, 3.4, -.3, dk, flat);
    for (const [dx, h] of [[-.4, 4.4], [1.6, 3.2]]) d.shape(c => { c.beginPath(); c.moveTo(dx - 1.1, -16.4); c.lineTo(dx + .5, -16.4 - h); c.lineTo(dx + 1.3, -16.4); c.closePath(); }, col, [dx, -18, 2]);
    d.shape(c => { c.beginPath(); c.moveTo(6.4, -10.4); c.quadraticCurveTo(9.6, -9.6, 10.2, -9); c.quadraticCurveTo(9.4, -8.2, 6.4, -7.8); c.closePath(); }, '#ffc04a', [8, -9, 2]); eye2(d, 3.6, -11.4, 1.05, true); }),
  husky: P((d, col, s) => { const wh = '#fffaf2'; d.line(c => { c.moveTo(-6, -8); c.bezierCurveTo(-12, -11, -11, -17, -7.4, -15.4); }, col, 3.2); paws(d, wh, s, [-3, 2.6]); oval(d, -1, -6.4, 6.4, 5.2, 0, col); oval(d, 0, -5, 4.4, 2.8, 0, wh, flat);
    for (const ex of [1, 8.6]) { d.shape(c => { c.beginPath(); c.moveTo(ex - 2.6, -20); c.lineTo(ex, -26); c.lineTo(ex + 2.6, -20); c.closePath(); }, col, [ex, -22, 3]); d.shape(c => { c.beginPath(); c.moveTo(ex - 1.2, -20.4); c.lineTo(ex, -23.6); c.lineTo(ex + 1.2, -20.4); c.closePath(); }, '#ffc3d6', [ex, -21.4, 1], flat); }
    d.circle(4.8, -15, 8.2, col); oval(d, 7.4, -13, 5, 4.4, 0, wh, flat); oval(d, 11, -12.4, 2.8, 2.2, 0, wh); d.ell(12.6, -13, 1.1, .8, INK); eye2(d, 6.6, -16.4, 1.05, false, '#4a8ad0'); }),
  dino: P((d, col, s) => { const dk = tone(col, -.2), sp = tone(col, -.28); d.line(c => { c.moveTo(-6, -4.4); c.quadraticCurveTo(-12, -3.4, -13, -6); }, col, 3.4); paws(d, dk, s, [-3, 2.4]); oval(d, -1, -6, 6.4, 5.2, 0, col); oval(d, 0, -4.6, 4, 2.6, 0, tone(col, .45), flat);
    for (let i = 0; i < 4; i++){ const a = PI * (1.15 + i * .2), px = Math.cos(a) * 7 - 1, py = -7 + Math.sin(a) * 6.4; d.circle(px + Math.cos(a) * 1.4, py + Math.sin(a) * 1.4, 1.6, sp); }
    d.circle(5, -14.4, 8.2, col); for (const [x, y] of [[0, -22], [3.4, -23.2], [6.8, -22.6]]) d.circle(x, y, 1.6, sp); oval(d, 11.4, -12, 2.8, 2.2, 0, col); d.dot(12.6, -12.8, .45, dk); eye2(d, 6.6, -15.6, 1.05); }),
  bee: P((d, col, s, t) => { const k = '#4a3a3a', fl = Math.sin(t * 14) * .35; d.ctx.save(); d.ctx.globalAlpha = .85; for (const [wx, r] of [[-3, -.6 + fl], [0, -.2 - fl]]) oval(d, wx, -19, 3, 4.4, r, '#eef8ff', {noShadow: true}); d.ctx.restore();
    oval(d, -2, -9.6, 6, 5.4, 0, col); for (const x of [-5.2, -2.6]) d.rr(x, -14.6, 1.6, 10, .8, k, flat); d.shape(c => { c.beginPath(); c.moveTo(-7.6, -10); c.lineTo(-9.8, -9.4); c.lineTo(-7.6, -8.6); c.closePath(); }, k, [-8.6, -9.4, 1]);
    d.circle(5, -12.6, 7.4, col); for (const ax of [3.6, 7.4]) { d.line(c => { c.moveTo(ax, -19.4); c.quadraticCurveTo(ax + .6, -22.6, ax + 1.8, -23.6); }, k, .6); d.circle(ax + 1.8, -23.8, 1.2, k, {noShadow: true}); } eye2(d, 6.8, -13.4, 1); for (const px of [-1, 1.2]) d.rr(px - .4, -4.6, .8, 2, .4, k); }),
  sheep: P((d, col, s) => { const fc = '#f4e0d0', lg = '#5a4a50'; for (const px of [-3.4, 2.6]) d.rr(px - .9 + s * .5, -3.4, 1.8, 3.4, .9, lg); for (const [x, y, r] of [[-5, -6.6, 3.2], [-2.4, -10, 3.4], [1, -10.4, 3.2], [-1, -5.6, 3.6], [2.6, -6.6, 3.2], [-6, -9.4, 2.6]]) d.circle(x, y, r, col);
    oval(d, 6.4, -13.4, 6.2, 6.4, 0, fc); for (const [x, y, r] of [[2.4, -18.6, 2.6], [5.6, -19.8, 2.8], [8.8, -18.8, 2.6], [10.4, -16.6, 1.8]]) d.circle(x, y, r, col); oval(d, 2.4, -13.4, 3.2, 1.4, .7, fc); eye2(d, 7.6, -13.6, 1); d.dot(11.6, -11.6, .6, '#e8899c'); }),
  snake: P((d, col, s, t) => { const dk = tone(col, -.15), w = Math.sin(t * 4) * 1.1; d.line(c => { c.moveTo(-11, -2.4); c.bezierCurveTo(-7, -6 - w, -3.6, 1.6 + w, .4, -3.4); c.quadraticCurveTo(3, -6, 3.4, -8.6); }, col, 5.4);
    for (const [x, y] of [[-8, -3.4], [-3.6, -1.8], [.8, -4.4]]) d.dot(x, y, 1, tone(col, .4)); d.circle(5.4, -13, 7.2, col); d.line(c => { c.moveTo(12, -11.4); c.lineTo(14, -11.4); c.moveTo(14, -11.4); c.lineTo(15, -12.4); c.moveTo(14, -11.4); c.lineTo(15, -10.4); }, '#ff6f8f', .6); eye2(d, 6.8, -14, 1.05); d.dot(10.6, -12.8, .4, dk); }),
  raccoon: P((d, col, s) => { const dk = tone(col, -.45), lt = tone(col, .6); oval(d, -8.4, -9.4, 3.2, 6, -.6, col); for (const [x, y] of [[-9.8, -12], [-7.8, -8.4]]) oval(d, x, y, 2.6, .95, -.6, dk, flat); paws(d, dk, s, [-3, 2.6]); oval(d, -1, -6.4, 6.2, 5, 0, col);
    for (const ex of [0, 9.4]) { d.circle(ex, -21.4, 2.8, col); d.circle(ex, -21.4, 1.3, dk, flat); } d.circle(4.8, -15, 8.2, col); oval(d, 8, -13, 4.8, 3.8, 0, lt, flat); oval(d, 6.8, -16, 3.8, 2.6, -.15, dk, flat); d.ell(11.6, -12.8, 1.1, .8, INK); eye2(d, 6.8, -16, 1.05, true); }),
  deer: P((d, col, s) => { const dk = tone(col, -.2), lt = '#fffaf2'; for (const px of [-4, -1.6, 2.4, 4.8]) d.rr(px - .7 + (px > 0 ? s : -s) * .4, -5, 1.4, 5, .7, dk); oval(d, 0, -8, 6.6, 4.4, 0, col); for (const [x, y] of [[-3, -9.6], [0, -10.6], [2.6, -9.6], [-1, -7.6]]) d.dot(x, y, .75, lt);
    d.circle(-6.2, -9.6, 1.5, lt); d.circle(6, -16, 7.4, col); for (const [ex, r] of [[.4, -1], [12, 1]]) { oval(d, ex, -18.4, 1.7, 3.6, r, col); oval(d, ex, -18.4, .8, 2.4, r, '#ffc3d6', flat); }
    for (const ax of [4, 7.6]) { d.circle(ax, -23.4, 1.3, '#c9a06a'); } oval(d, 11, -13.6, 2.6, 2, 0, tone(col, .45)); d.ell(12.6, -14, .9, .7, INK); eye2(d, 7.4, -16.8, 1.05); }),
  otter: P((d, col, s) => { const dk = tone(col, -.2), lt = tone(col, .55); d.line(c => { c.moveTo(-7.6, -3.6); c.quadraticCurveTo(-12, -2.6, -13, -4.6); }, col, 3.4); paws(d, dk, s, [-4, 3]); oval(d, -1, -6, 7.6, 4.8, 0, col); oval(d, 0, -4.8, 4.6, 2.6, 0, lt, flat);
    d.circle(5.4, -13.4, 7.6, col); for (const ex of [1, 10.4]) d.circle(ex, -19.4, 1.7, dk); oval(d, 9, -11.4, 4.4, 3.4, 0, lt); d.ell(12, -12.6, 1.1, .8, INK); eye2(d, 6.4, -14.8, 1.05);
    d.shape(c => { c.beginPath(); c.moveTo(3.4, -5.4); c.lineTo(8.4, -5.4); c.quadraticCurveTo(5.9, -9.6, 3.4, -5.4); c.closePath(); }, '#ffd0e0', [5.9, -6.6, 3]); d.line(c => { for (const x of [4.8, 5.9, 7]) { c.moveTo(5.9, -8.8); c.lineTo(x, -5.6); } }, '#ff9fbe', .4); }),
};
