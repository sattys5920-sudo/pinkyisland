// 반려동물 14 종 (유아용 점토). (x,y)는 발이 닿는 점, 키 약 24px (캐릭터의 절반쯤). 오른쪽을 보는 기준.
export const PET_SPECIES = [
  ['dog', '강아지', ['#f2d2a0', '#fffaf2', '#8a6a4a']], ['cat', '고양이', ['#ffc98f', '#c9c6cf', '#4a4550']],
  ['hamster', '햄스터', ['#f3c98f', '#fffaf2', '#c9b8a6']], ['lizard', '도마뱀', ['#f3d27a', '#a8dc8f', '#ffb3a0']],
  ['rabbit', '토끼', ['#fffaf2', '#d9b38c', '#b9b6c0']], ['guinea', '기니피그', ['#e8a06a', '#fffaf2', '#8a6a4a']],
  ['turtle', '거북이', ['#a8dc8f', '#c9b58f', '#9fd6c8']], ['hedgehog', '고슴도치', ['#e8c9a6', '#fff1e3', '#b98a64']],
  ['parrot', '앵무새', ['#8fdc7a', '#8fc3ea', '#ffe066']], ['ferret', '페럿', ['#f3e6d0', '#c9a07a', '#6f6470']],
  ['chinchilla', '친칠라', ['#c9c6cf', '#f3f0ec', '#8a8494']], ['goldfish', '금붕어', ['#ff9a3d', '#ffd23f', '#fffaf2']],
  ['chick', '병아리', ['#ffe066', '#fff3a8', '#ffd0a0']], ['glider', '슈가글라이더', ['#b9b6c0', '#d9c2a6', '#fffaf2']],
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
};
