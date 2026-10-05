// 물고기 그림 f01..f50 (오른쪽을 바라보는 옆모습, 폭 약 40)
// 유아용 점토 느낌: 동글동글한 몸, 둥근 지느러미, 구슬 눈 하나와 분홍 볼. 비늘·가시·가는 지느러미 살은 쓰지 않아요.
const PI = Math.PI, INK = '#2b2233';
const flat = {flat: true, noShadow: true};
const tone = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join(''); };
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
const eye = (d, x, y, r = 2.2) => { d.circle(x, y, r * 1.45, '#ffffff', flat); d.ell(x + r * .2, y, r * .75, r * .9, INK, flat); d.dot(x + r * .45, y - r * .4, r * .3, '#ffffff', .95); };
const blush = (d, x, y, r = 2) => d.ell(x, y, r, r * .6, '#ff8fb0', flat);
const smile = (d, x, y) => d.line(c => { c.moveTo(x - 1.4, y); c.quadraticCurveTo(x, y + 1.4, x + 1.4, y); }, INK, .8, .8);
const shine = (d, x, y, r = 2.6) => d.dot(x, y, r, '#ffffff', .45);
// 기본 물고기: 둥근 몸 + 둥근 꼬리 + 등지느러미 혹 + 얼굴
// o: {w, h, col, belly, fin, tail, spots, stripes, dorsal, whisk, glow}
const fish = (d, o) => {
  const w = o.w ?? 15, h = o.h ?? 10, col = o.col, fin = o.fin ?? tone(col, -.18), belly = o.belly ?? tone(col, .45);
  const tx = -w + 2, tr = o.tail ?? h * .7;
  d.circle(tx - tr * .55, -tr * .55, tr * .7, fin); d.circle(tx - tr * .55, tr * .55, tr * .7, fin);
  if (o.dorsal !== false) oval(d, -w * .1, -h * .9, w * .42, h * .36, 0, fin);
  oval(d, 0, 0, w, h, 0, col);
  if (o.belly !== false) oval(d, w * .1, h * .42, w * .7, h * .4, 0, belly, flat);
  for (const [x, y, r, c] of (o.spots || [])) d.circle(x, y, r, c || tone(col, -.25), flat);
  for (const [x, c] of (o.stripes || [])) oval(d, x, 0, w * .09, h * .82, 0, c || tone(col, -.25), flat);
  oval(d, w * .05, h * .35, w * .22, h * .22, .5, fin, flat);
  if (o.whisk) for (const s of [-1, 1]) d.line(c => { c.moveTo(w * .85, h * .25); c.quadraticCurveTo(w * 1.05, h * .3 + s * 2, w * 1.1, h * .55 + s * 2.5); }, fin, 1.3, .9);
  if (o.glow) { d.dot(w * .9, -h - 5, 4, o.glow, .35); d.line(c => { c.moveTo(w * .55, -h * .8); c.quadraticCurveTo(w * .9, -h - 6, w * .9, -h - 4); }, fin, 1.2); d.circle(w * .9, -h - 5, 2.4, o.glow); }
  eye(d, w * .55, -h * .18, Math.max(1.8, Math.min(2.8, h * .24)));
  blush(d, w * .45, h * .3, Math.max(1.4, h * .17)); smile(d, w * .82, h * .18);
  shine(d, -w * .25, -h * .45, Math.max(1.6, h * .22));
};
const eel = (d, col, len = 18, o = {}) => { const fin = tone(col, -.18);
  for (let i = 4; i >= 0; i--) d.circle(-len + i * len / 2.2, Math.sin(i * 1.4) * 2.4, 5.4 - (4 - i) * .25 * 0 - (i === 0 ? 1.4 : 0), i % 2 ? col : tone(col, .06));
  d.circle(len * .6, -.5, 6, col); eye(d, len * .7, -2, 1.9); blush(d, len * .62, 2, 1.4);
  if (o.whisk) d.line(c => { c.moveTo(len * .95, 1); c.quadraticCurveTo(len * 1.2, 3, len * 1.15, 6); }, fin, 1.2);
  if (o.shine) shine(d, -4, -3, 1.8); };

export const ART_PART = {
  // ===== 사탕 연못 =====
  f01: d => fish(d, {w: 11, h: 6.5, col: '#c9d3dd'}),                                                           // 송사리
  f02: d => fish(d, {w: 13, h: 7, col: '#9fc4d8', stripes: [[-3, '#ff9fb3'], [3, '#ff9fb3']]}),                  // 피라미
  f03: d => fish(d, {w: 14, h: 10.5, col: '#b5a06a'}),                                                          // 붕어
  f04: d => fish(d, {w: 14, h: 7, col: '#a8b98f', spots: [[-6, -2, 1.4], [-1, -3, 1.4], [4, -2, 1.4]]}),           // 버들치
  f05: d => fish(d, {w: 12, h: 9, col: '#ff9fb3', fin: '#c9a6ff'}),                                             // 납자루
  f06: d => eel(d, '#8a7a5a', 14, {whisk: true}),                                                               // 미꾸라지
  f07: d => fish(d, {w: 13, h: 11, col: '#5b8cff', belly: '#ffc28a'}),                                          // 블루길
  f08: d => fish(d, {w: 16, h: 10, col: '#d9a46f', whisk: true}),                                               // 잉어
  f09: d => fish(d, {w: 16, h: 9.5, col: '#6a8f4a', stripes: [[-4], [3]]}),                                     // 배스
  f10: d => fish(d, {w: 16, h: 8.5, col: '#b8d6c2', belly: false, spots: [[-8, 0, 7, '#ff9fc4'], [-2, 0, 6, '#ff9fc4'], [4, 0, 4.4, '#ff9fc4']]}), // 무지개송어
  f11: d => fish(d, {w: 15, h: 8.5, col: '#9fd6ff', spots: [[-7, 0, 2.4, '#6fa8e0'], [-1, 0, 2.4, '#6fa8e0'], [5, 0, 2.2, '#6fa8e0']]}), // 산천어
  f12: d => fish(d, {w: 17, h: 8, col: '#5b5266', dorsal: false, whisk: true}),                                 // 메기
  f13: d => fish(d, {w: 15, h: 10, col: '#e8b84f', spots: [[-6, -3, 1.8, '#a07a2a'], [0, 2, 1.8, '#a07a2a'], [5, -4, 1.6, '#a07a2a']]}), // 쏘가리
  f14: d => eel(d, '#4a5a4a', 18, {shine: true}),                                                               // 뱀장어
  f15: d => { fish(d, {w: 16, h: 10, col: '#ffd23f', whisk: true}); d.circle(13, -14, 2, '#fff6c8'); d.circle(-14, -12, 1.6, '#fff6c8'); }, // 황금잉어
  f16: d => fish(d, {w: 19, h: 8, col: '#7a8a9a', spots: [[-8, -6, 2, '#e8eef4'], [-2, -7, 2, '#e8eef4'], [4, -6, 2, '#e8eef4']]}), // 철갑상어
  // ===== 등대 해변 =====
  f17: d => fish(d, {w: 12, h: 6.5, col: '#a7c4d6', spots: [[-4, -1, 1.2, '#5b7a9a'], [0, -1, 1.2, '#5b7a9a']]}), // 정어리
  f18: d => fish(d, {w: 13, h: 8, col: '#b9d3e0', fin: '#ffd88a'}),                                             // 전갱이
  f19: d => fish(d, {w: 15, h: 8, col: '#5b8cff', belly: '#eef4ff', stripes: [[-6, '#3d5fb5'], [-1, '#3d5fb5'], [4, '#3d5fb5']]}), // 고등어
  f20: d => fish(d, {w: 18, h: 5.5, col: '#7c86d6', tail: 4}),                                                  // 꽁치
  f21: d => { fish(d, {w: 17, h: 5, col: '#9fd6ff', tail: 4}); d.rr(15, -.5, 7, 2.6, 1.3, '#ff9fb3'); },          // 학꽁치
  f22: d => fish(d, {w: 12, h: 11, col: '#c9b58f', fin: '#a8946c'}),                                            // 쥐치
  f23: d => fish(d, {w: 16, h: 9, col: '#a8744f', dorsal: false, spots: [[-5, -1, 2.2], [2, 3, 2.2]]}),          // 가자미
  f24: d => fish(d, {w: 14, h: 10, col: '#7a6a6a', fin: '#5a4a4a'}),                                            // 우럭
  f25: d => { d.circle(-11, -4, 4, '#f3c46a'); d.circle(-11, 4, 4, '#f3c46a'); d.circle(0, 0, 12, '#ffd88a'); for (const [x, y] of [[-6, -6], [0, -9], [-8, 2]]) d.circle(x, y, 1.6, '#e0b45a', flat); oval(d, 2, 6, 7, 4, 0, '#fff4d8', flat); eye(d, 6, -2, 2.6); blush(d, 5, 4, 2); smile(d, 10, 2); }, // 복어
  f26: d => fish(d, {w: 17, h: 10, col: '#8a6a4a', dorsal: false, spots: [[-6, -2, 2.4], [1, 3, 2.4], [-1, -5, 2]]}), // 광어
  f27: d => fish(d, {w: 15, h: 10, col: '#7a8a9a', stripes: [[-5], [0], [5]]}),                                 // 감성돔
  f28: d => fish(d, {w: 15, h: 10.5, col: '#ff6b6b', spots: [[-5, -3, 1.4, '#9fe0ff'], [0, -5, 1.4, '#9fe0ff'], [2, 1, 1.4, '#9fe0ff']]}), // 참돔
  // 오징어: 둥근 머리 + 짧은 다리 방울
  f29: d => { for (let i = 0; i < 5; i++) d.rr(-6 + i * 3, 4, 2.8, 10 + (i % 2) * 3, 1.4, '#ffc2d6'); oval(d, 0, -6, 8, 12, 0, '#ffd9e6'); for (const s of [-1, 1]) oval(d, s * 7, -15, 4, 3, s * .5, '#ffc2d6'); for (const s of [-1, 1]) eye(d, s * 3.2, 2, 1.9); blush(d, 0, 5, 1.6); }, // 오징어
  f30: d => { for (let i = 0; i < 6; i++) { const x = -10 + i * 4; d.circle(x, 9, 3.2, '#ff8f7a'); d.circle(x + 1, 13, 2.6, '#ff8f7a'); } d.circle(0, -3, 11, '#ff8f7a'); for (const [x, y] of [[-4, -9], [3, -11]]) d.circle(x, y, 1.6, '#ffb3a3', flat); for (const s of [-1, 1]) eye(d, s * 4, 0, 2.2); smile(d, 0, 5); }, // 문어
  f31: d => fish(d, {w: 20, h: 5, col: '#e8eef4', tail: 3.4, dorsal: false}),                                  // 갈치
  f32: d => fish(d, {w: 16, h: 9, col: '#9aa6b6', spots: [[-6, -3, 1.4, '#5a6676'], [-1, -4, 1.4, '#5a6676']]}),  // 농어
  f33: d => fish(d, {w: 17, h: 9.5, col: '#6a8fd6', belly: '#eef4ff', stripes: [[0, '#ffd23f']]}),               // 방어
  f34: d => fish(d, {w: 16, h: 9, col: '#ff9f7a', belly: '#ffe0d0'}),                                           // 연어
  f35: d => fish(d, {w: 18, h: 11, col: '#3d4785', belly: '#eef0ff', stripes: [[6, '#ffd23f']]}),                // 참치
  f36: d => { oval(d, 18, 1, 6, 1.6, 0, '#3d6fc4'); oval(d, -2, -11, 9, 6, -.3, '#3d6fc4'); fish(d, {w: 17, h: 8.5, col: '#4b7bd6', belly: '#eef4ff', dorsal: false}); }, // 청새치
  // ===== 해식 동굴 =====
  f37: d => { for (const s of [-1, 1]) oval(d, -4, s * 9, 8, 5, s * .5, '#e0c4ff'); fish(d, {w: 11, h: 8, col: '#c9a6ff', tail: 5}); }, // 바다나비
  f38: d => { for (let i = 0; i < 4; i++) d.circle(-12 + i * 5, 2 - Math.abs(i - 2) * 1.6, 4.4 - (3 - i) * .2, '#ff9f7a'); d.circle(-15, 6, 3, '#ffb39a'); d.circle(9, -1, 6, '#ff9f7a'); for (const s of [0, 1]) d.line(c => { c.moveTo(12, -5); c.quadraticCurveTo(18 + s * 2, -12, 22, -8 + s * 3); }, '#ff8f6a', 1.2); eye(d, 11, -2, 1.9); }, // 동굴새우
  f39: d => { fish(d, {w: 13, h: 8, col: '#f3e6ff'}); },                                                        // 장님물고기
  f40: d => { for (const s of [-1, 1]) { d.circle(s * 14, -8, 4.4, '#9fe0f0'); for (const i of [0, 1, 2]) d.circle(s * (6 + i * 3.4), 8, 2.4, '#9fe0f0'); } oval(d, 0, 1, 12, 8, 0, '#b9f0ff'); d.circle(-3, -2, 2.4, '#ffffff', flat); for (const s of [-1, 1]) eye(d, s * 4, -2, 1.9); blush(d, 0, 4, 1.4); }, // 수정게
  f41: d => { d.dot(0, 0, 14, '#e8eef4', .25); fish(d, {w: 13, h: 8, col: '#e8eef4'}); },                         // 유령고기
  f42: d => fish(d, {w: 13, h: 10, col: '#ff8fc4', belly: false, stripes: [[-6, '#ffd27a'], [-2, '#a6f0b0'], [2, '#a6d6ff'], [6, '#c9a6ff']]}), // 무지개산호어
  f43: d => { for (let i = 0; i < 4; i++) d.rr(10, -6 + i * 3.4, 8, 2.2, 1.1, '#ffb39a'); d.circle(-1, 1, 13, '#e8b84f'); d.circle(-2, 1, 8.5, '#f3d088', flat); d.circle(-3, 1, 4.4, '#e8b84f', flat); eye(d, 9, -3, 2); }, // 앵무조개
  f44: d => { for (const x of [-6, -2, 2, 6]) d.rr(x - 1.4, -2, 2.8, 14 + (Math.abs(x) < 3 ? 3 : 0), 1.4, '#d6ebff'); d.shape(c => { c.beginPath(); c.ellipse(0, -3, 12, 11, 0, PI, 0); c.closePath(); }, '#bfe0ff', [0, -8, 12]); d.circle(7, -11, 1.6, '#fff6c8'); for (const s of [-1, 1]) eye(d, s * 4, -5, 1.8); }, // 별빛해파리
  f45: d => fish(d, {w: 14, h: 8, col: '#3d4785', spots: [[-6, 2, 1.6, '#6fe0c4'], [-1, 3, 1.6, '#6fe0c4'], [4, 2, 1.6, '#6fe0c4']], glow: '#6fe0c4'}), // 심해랜턴피시
  f46: d => fish(d, {w: 17, h: 8, col: '#5b5266', dorsal: false, whisk: true}),                                 // 동굴메기
  f47: d => eel(d, '#c9d3dd', 18, {shine: true}),                                                               // 은빛장어
  f48: d => fish(d, {w: 14, h: 11, col: '#3d4785', glow: '#ffe066'}),                                           // 초롱아귀
  f49: d => { d.line(c => { c.moveTo(-12, 2); c.quadraticCurveTo(-18, 4, -21, 1); }, '#a07ae0', 2.2); d.shape(c => { c.beginPath(); c.moveTo(16, 0); c.quadraticCurveTo(4, -15, -12, 1); c.quadraticCurveTo(4, 14, 16, 0); c.closePath(); }, '#bf8cff', [0, 0, 14]); for (const [x, y, c] of [[-3, -3, '#ffd27a'], [2, 3, '#7fe0ff'], [-6, 2, '#ff9fc4']]) d.circle(x, y, 1.8, c, flat); eye(d, 9, -2, 1.9); blush(d, 8, 2, 1.4); }, // 보석가오리
  f50: d => fish(d, {w: 18, h: 10, col: '#4a5a7a', spots: [[-8, -3, 2, '#e8eef4'], [-2, 2, 2, '#e8eef4'], [4, -4, 1.8, '#e8eef4'], [-5, 5, 1.6, '#e8eef4']]}), // 실러캔스
};
