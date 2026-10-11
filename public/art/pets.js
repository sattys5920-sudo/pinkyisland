// 반려동물 12 종 (유아용 점토). (x,y)는 발이 닿는 점, 키 약 24px (캐릭터의 절반쯤). 오른쪽을 보는 기준.
export const PET_SPECIES = [
  ['dog', '강아지', ['#f2d2a0', '#fffaf2', '#8a6a4a']], ['cat', '고양이', ['#ffc98f', '#c9c6cf', '#4a4550']],
  ['hamster', '햄스터', ['#f3c98f', '#fffaf2', '#c9b8a6']], ['lizard', '도마뱀', ['#f3d27a', '#a8dc8f', '#ffb3a0']],
  ['rabbit', '토끼', ['#fffaf2', '#d9b38c', '#b9b6c0']], ['guinea', '기니피그', ['#e8a06a', '#fffaf2', '#8a6a4a']],
  ['turtle', '거북이', ['#a8dc8f', '#c9b58f', '#9fd6c8']], ['hedgehog', '고슴도치', ['#e8c9a6', '#fff1e3', '#b98a64']],
  ['parrot', '앵무새', ['#8fdc7a', '#8fc3ea', '#ffe066']], ['ferret', '페럿', ['#f3e6d0', '#c9a07a', '#6f6470']],
  ['goldfish', '금붕어', ['#ff9a3d', '#ffd23f', '#fffaf2']],
  ['chick', '병아리', ['#ffe066', '#fff3a8', '#ffd0a0']],
  // ===== 2 차 펫 (아기 느낌 · 머리가 크고 몸이 동글동글) =====
  ['pig', '아기 돼지', ['#ffc3cf', '#f3b8a0', '#e8dcd4'], 2], ['squirrel', '아기 다람쥐', ['#d9905a', '#c9a07a', '#a8a0a8'], 2],
  ['bear', '아기 곰', ['#a8784f', '#e8c9a0', '#f4f0ea'], 2], ['crow', '아기 까마귀', ['#3e3a4e', '#4a5a7a', '#5a4a5e'], 2],
  ['husky', '아기 허스키', ['#8a92a0', '#c9a07a', '#4a4650'], 2], ['dino', '아기 공룡', ['#9fd9a8', '#ffb3c6', '#a8c8ff'], 2],
  ['bee', '아기 꿀벌', ['#ffd45a', '#ffb347', '#fff1a0'], 2], ['sheep', '아기 양', ['#fffaf2', '#f6d8e4', '#d8d4dc'], 2],
  ['snake', '아기 뱀', ['#8fd47a', '#ffb3d1', '#a8c8ff'], 2], ['raccoon', '아기 라쿤', ['#9a96a2', '#b8a08a', '#7a7484'], 2],
  ['deer', '아기 사슴', ['#d9a06a', '#e8c09a', '#c08a5a'], 2], ['otter', '아기 수달', ['#a8784f', '#c9a07a', '#8a6a5a'], 2],
];
const PI = Math.PI, INK = '#3b2433', flat = {flat: true, noShadow: true};
const tone = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join(''); };
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
// 옆을 보는 얼굴: 구슬 눈 하나 + 볼 + 코
const face = (d, x, y, k = 1, nose = '#5a3a44') => { d.ell(x, y, 1.1 * k, 1.5 * k, INK, flat); d.dot(x + .35 * k, y - .55 * k, .4 * k, '#ffffff', .95); d.ell(x - .6 * k, y + 2.2 * k, 1.5 * k, .9 * k, '#ff8fb0', flat); if (nose) d.dot(x + 3.4 * k, y + .9 * k, .9 * k, nose); };
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
  pig: P((d, col, s) => { const dk = tone(col, -.12); d.line(c => { c.moveTo(-8, -8); c.bezierCurveTo(-12, -10, -12, -5, -10, -6); }, dk, 1.2); paws(d, dk, s, [-4, 3]); oval(d, -1, -7.5, 8.4, 6.6, 0, col); d.circle(5.5, -14, 7, col);
    for (const [ex, r] of [[2, -.6], [6.5, .4]]) oval(d, ex, -20.5, 2, 2.8, r, dk); oval(d, 11.4, -13, 2.8, 2.2, 0, tone(col, .25)); d.dot(10.6, -13, .5, tone(col, -.4)); d.dot(12.2, -13, .5, tone(col, -.4)); face(d, 7, -15.5, 1, null); }),
  squirrel: P((d, col, s) => { const lt = tone(col, .45); oval(d, -9, -15, 5.4, 8.6, -.35, col); oval(d, -9.6, -16, 2.6, 5.4, -.35, tone(col, .2), flat); paws(d, tone(col, -.2), s, [-3, 3]); oval(d, 0, -7, 7, 6.2, 0, col); oval(d, 1.4, -6, 4, 3.6, 0, lt, flat);
    d.circle(5, -14, 6.2, col); for (const ex of [2, 6]) { d.shape(c => { c.beginPath(); c.moveTo(ex - 2, -18.5); c.lineTo(ex, -23.5); c.lineTo(ex + 2, -18.5); c.closePath(); }, col, [ex, -21, 2]); } oval(d, 9.4, -12.6, 2.4, 2, 0, lt); face(d, 6.6, -15, 1, INK);
    oval(d, 6, -6.4, 2.2, 2.6, 0, '#a8743a'); d.ell(6, -8.6, 2.4, 1, '#7a4a20'); }),
  bear: P((d, col, s) => { const dk = tone(col, -.18), mz = tone(col, .45); paws(d, dk, s); oval(d, -1, -8, 8.2, 6.8, 0, col); for (const ex of [1.5, 8.5]) { d.circle(ex, -20.5, 2.8, col); d.circle(ex, -20.5, 1.4, tone(col, .3), flat); }
    d.circle(5, -14.5, 7, col); oval(d, 10, -12.8, 3.2, 2.6, 0, mz); d.dot(11.6, -13.6, .9, INK); face(d, 6.6, -16, 1, null); }),
  crow: P((d, col, s) => { const dk = tone(col, -.2); for (const px of [-2, 2]) d.rr(px - .7, -3, 1.4, 3, .7, '#e8a04a'); oval(d, -6, -6, 3.4, 2.2, .4, dk); d.circle(0, -8.5, 7.4, col); oval(d, -2.4, -8.6, 4, 3.4, -.3, dk, flat);
    for (const [dx, h] of [[0, 4], [1.6, 3]]) d.shape(c => { c.beginPath(); c.moveTo(dx - 1, -15.6); c.lineTo(dx + .4, -15.6 - h); c.lineTo(dx + 1.2, -15.6); c.closePath(); }, col, [dx, -17, 2]);
    d.shape(c => { c.beginPath(); c.moveTo(5.6, -11); c.lineTo(10.4, -9.6); c.lineTo(5.6, -8.2); c.closePath(); }, '#ffb347', [7, -9.6, 2]); d.ell(3.6, -11.4, 1.1, 1.5, '#fffaf2', flat); d.dot(3.8, -11.4, .8, INK); d.dot(4.1, -11.9, .3, '#fff', .9); d.ell(3, -8.4, 1.4, .8, '#ff8fb0', flat); }),
  husky: P((d, col, s) => { const wh = '#fffaf2'; d.line(c => { c.moveTo(-7, -9); c.bezierCurveTo(-13, -12, -12, -18, -8, -16); }, col, 3.4); paws(d, wh, s); oval(d, -1, -8, 8, 6.4, 0, col); oval(d, 0, -6, 5.6, 3.4, 0, wh, flat);
    for (const ex of [2.4, 8]) d.shape(c => { c.beginPath(); c.moveTo(ex - 2.6, -19); c.lineTo(ex, -25); c.lineTo(ex + 2.6, -19); c.closePath(); }, col, [ex, -21, 3]); d.circle(5.6, -15, 6.8, col); oval(d, 7.6, -13.4, 4.4, 3.8, 0, wh, flat); oval(d, 10.6, -12.6, 3, 2.2, 0, wh);
    d.dot(12.6, -13, .9, INK); d.ell(7.4, -16, 1.1, 1.5, '#4a8ad0', flat); d.dot(7.7, -16.6, .4, '#fff', .95); d.ell(6.8, -13.6, 1.4, .8, '#ff8fb0', flat); }),
  dino: P((d, col, s) => { const dk = tone(col, -.2), sp = tone(col, -.3); d.line(c => { c.moveTo(-7, -5); c.quadraticCurveTo(-14, -4, -15, -7); }, col, 3.6); paws(d, dk, s); oval(d, -1, -7, 8, 6.4, 0, col); oval(d, 0, -5, 5, 3.2, 0, tone(col, .4), flat);
    for (let i = 0; i < 5; i++){ const a = PI * (1.12 + i * .17), px = Math.cos(a) * 9 - 1, py = -8 + Math.sin(a) * 8; d.shape(c => { c.beginPath(); c.moveTo(px - 1.6, py + 1); c.lineTo(px + Math.cos(a) * 2.6, py + Math.sin(a) * 2.6); c.lineTo(px + 1.6, py + 1); c.closePath(); }, sp, [px, py, 2]); }
    oval(d, 6, -14.5, 7, 6.2, 0, col); oval(d, 10.6, -12.6, 3, 2.2, 0, col); d.dot(12, -13.4, .4, dk); face(d, 7, -16, 1, null); }),
  bee: P((d, col, s, t) => { const k = '#4a3a3a', fl = Math.sin(t * 12) * .3; d.ctx.save(); d.ctx.translate(0, -3); d.ctx.globalAlpha = .8; for (const [wx, r] of [[-2, -.5 + fl], [1, -.2 - fl]]) oval(d, wx, -16, 3, 4.6, r, '#eef8ff', {noShadow: true}); d.ctx.restore();
    oval(d, -1, -9, 8, 6.4, 0, col); for (const x of [-5, -1.6]) d.rr(x, -15, 2, 12, 1, k, flat); d.shape(c => { c.beginPath(); c.moveTo(-9, -9); c.lineTo(-11.6, -8.4); c.lineTo(-9, -7.6); c.closePath(); }, k, [-10, -8.4, 1]);
    d.circle(6, -12, 5.6, col); for (const ax of [5, 8]) { d.line(c => { c.moveTo(ax, -17); c.quadraticCurveTo(ax + 1, -20, ax + 2, -21); }, k, .6); d.dot(ax + 2, -21, .9, k); } face(d, 7.6, -12.6, .9, null); }),
  sheep: P((d, col, s) => { const fc = '#f4e0d0', lg = '#5a4a50'; for (const px of [-4, 3]) d.rr(px - 1 + s * .6, -4, 2, 4, 1, lg); for (const [x, y, r] of [[-6, -7, 3.6], [-3, -11, 3.8], [1, -11.6, 3.6], [-1, -6, 4], [3, -7, 3.6], [-7, -10, 3]]) d.circle(x, y, r, col);
    oval(d, 7, -12, 4.4, 4.8, 0, fc); for (const [x, y] of [[4.6, -16.6], [7.4, -17.4], [9.4, -15.8]]) d.circle(x, y, 2, col); oval(d, 4, -12, 2.6, 1.3, .7, fc); face(d, 7.6, -12.4, .85, '#e8899c'); }),
  snake: P((d, col, s, t) => { const dk = tone(col, -.18), w = Math.sin(t * 4) * 1.2; d.line(c => { c.moveTo(-12, -2); c.bezierCurveTo(-8, -6 - w, -4, 2 + w, 0, -3); c.quadraticCurveTo(3, -6, 4, -9); }, col, 5);
    for (const [x, y] of [[-9, -3], [-4, -1.4], [1, -4]]) d.dot(x, y, .9, dk); oval(d, 6, -12, 5.6, 4.6, -.1, col); d.line(c => { c.moveTo(11, -11); c.lineTo(13, -11); c.moveTo(13, -11); c.lineTo(14, -12); c.moveTo(13, -11); c.lineTo(14, -10); }, '#ff6f8f', .6); face(d, 7, -13, .95, null); }),
  raccoon: P((d, col, s) => { const dk = tone(col, -.45), lt = tone(col, .55); oval(d, -9, -10, 3.4, 6.4, -.6, col); for (const [x, y] of [[-10.4, -12.6], [-8.4, -9]]) oval(d, x, y, 2.8, 1, -.6, dk, flat); paws(d, dk, s); oval(d, -1, -8, 7.8, 6.2, 0, col);
    for (const ex of [2, 8]) { d.circle(ex, -20, 2.6, col); d.circle(ex, -20, 1.2, dk, flat); } d.circle(5.6, -14.4, 6.6, col); oval(d, 8.4, -13, 4, 3.2, 0, lt, flat); oval(d, 7.6, -15.8, 3.4, 2.2, -.2, dk, flat); d.dot(11.6, -12.8, .9, INK); d.ell(7.6, -15.8, 1, 1.4, '#fffaf2', flat); d.dot(7.7, -15.8, .7, INK); d.ell(7, -12.6, 1.3, .7, '#ff8fb0', flat); }),
  deer: P((d, col, s) => { const dk = tone(col, -.2), lt = '#fffaf2'; for (const px of [-5, -2, 3, 6]) d.rr(px - .8 + (px % 2 ? s : -s) * .5, -6, 1.6, 6, .8, dk); oval(d, 0, -9, 8, 5, 0, col); for (const [x, y] of [[-3, -11], [0, -12], [3, -11], [-1, -9]]) d.dot(x, y, .8, lt);
    d.circle(-7.4, -11, 1.6, lt); oval(d, 7, -16, 5.6, 5.2, 0, col); for (const [ex, r] of [[3.4, -.8], [10.4, .8]]) { oval(d, ex, -20, 1.6, 3.2, r, col); oval(d, ex, -20, .8, 2.2, r, '#ffc3d6', flat); }
    for (const ax of [5.6, 8.4]) d.rr(ax - .6, -24, 1.2, 3.4, .6, '#c9a06a'); oval(d, 11, -14.4, 2.4, 1.8, 0, tone(col, .4)); d.dot(12.4, -14.8, .7, INK); face(d, 8, -16.6, .95, null); }),
  otter: P((d, col, s) => { const dk = tone(col, -.2), lt = tone(col, .5); d.line(c => { c.moveTo(-9, -4); c.quadraticCurveTo(-14, -3, -15, -5); }, col, 3.6); paws(d, dk, s, [-5, 4]); oval(d, -1, -6.4, 10, 5.4, 0, col); oval(d, 1, -5, 6, 3.2, 0, lt, flat);
    d.circle(7, -13, 6, col); for (const ex of [3.6, 9.6]) d.circle(ex, -18, 1.6, dk); oval(d, 9.6, -11.6, 3.6, 2.8, 0, lt); d.dot(11.8, -12.6, .9, INK); face(d, 8, -14, .95, null);
    d.shape(c => { c.beginPath(); c.moveTo(4, -6); c.lineTo(9, -6); c.quadraticCurveTo(6.5, -10, 4, -6); c.closePath(); }, '#ffd0e0', [6.5, -7, 3]); d.line(c => { for (const x of [5.4, 6.5, 7.6]) { c.moveTo(6.5, -9.4); c.lineTo(x, -6.2); } }, '#ff9fbe', .4); }),
};
