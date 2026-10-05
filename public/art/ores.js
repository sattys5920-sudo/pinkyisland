// 광석/보석 40 종 그림 (o01..o40). (0,0) 중심, 약 -22..+22.
// 유아용 점토 느낌: 몽글몽글한 덩어리, 말랑한 보석 방울. 각진 면·가는 결·뾰족한 끝은 쓰지 않아요.
const PI = Math.PI;
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
const shine = (d, x, y, r = 3) => d.dot(x, y, r, '#ffffff', .5);
const flat = {flat: true, noShadow: true};
// 몽글한 돌덩이: 둥근 혹 몇 개를 겹친 바위
const lump = (d, col, s = 1, y = 3) => { d.circle(-7 * s, y + 2, 9 * s, col); d.circle(7 * s, y + 2, 9 * s, col); d.circle(0, y - 3, 11 * s, col); oval(d, 0, y + 4, 15 * s, 8 * s, 0, col); };
// 돌에 박힌 말랑한 알갱이
const bits = (d, pts, col, r = 2.6) => { for (const [x, y] of pts) { d.circle(x, y, r, col); d.dot(x - r * .3, y - r * .35, r * .32, '#ffffff', .6); } };
// 말랑한 보석 방울: 둥근 모양 + 큰 반짝임 + 안쪽 밝은 동그라미
const gem = (d, col, kind = 'round', s = 1) => {
  if (kind === 'drop') d.shape(c => { c.beginPath(); c.moveTo(0, -16 * s); c.bezierCurveTo(9 * s, -6 * s, 14 * s, 4 * s, 0, 15 * s); c.bezierCurveTo(-14 * s, 4 * s, -9 * s, -6 * s, 0, -16 * s); c.closePath(); }, col, [0, 1, 14 * s]);
  else if (kind === 'heart') d.shape(c => { c.beginPath(); c.moveTo(0, 15 * s); c.bezierCurveTo(-18 * s, 3 * s, -14 * s, -14 * s, 0, -6 * s); c.bezierCurveTo(14 * s, -14 * s, 18 * s, 3 * s, 0, 15 * s); c.closePath(); }, col, [0, 1, 15 * s]);
  else if (kind === 'pill') oval(d, 0, 1, 9 * s, 15 * s, .35, col);
  else if (kind === 'cushion') d.rr(-13 * s, -11 * s, 26 * s, 24 * s, 10 * s, col);
  else d.circle(0, 1, 14 * s, col);
  d.dot(-2 * s, 2 * s, 7 * s, '#ffffff', .18);
  d.dot(-5 * s, -5 * s, 3.4 * s, '#ffffff', .75); d.dot(5 * s, 7 * s, 1.6 * s, '#ffffff', .45);
};
// 동글한 반짝이 방울
const twinkle = (d, pts, col = '#fff6c8') => { for (const [x, y, r] of pts) d.circle(x, y, r, col); };
// 몽글한 수정 기둥 (끝이 둥근 캡슐)
const crystal = (d, x, y, h, w, rot, col) => d.shape(c => { c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.roundRect(-w / 2, -h, w, h, w / 2); c.restore(); }, col, [x, y - h / 2, h / 2]);

export const ART_PART = {
  // ◆ 흔함
  o01: d => { d.circle(-6, 5, 9, '#a39aa8'); d.circle(7, 7, 7, '#b4acb8'); shine(d, -9, 1, 2.4); },                          // 돌멩이
  o02: d => { lump(d, '#3b3b46'); shine(d, -6, -4, 2.6); d.dot(5, 3, 1.6, '#6a6a78'); },                                     // 석탄
  o03: d => { lump(d, '#8a7f8c'); bits(d, [[-6, 0], [5, -3], [2, 7], [-9, 8]], '#ff9a5a'); },                                // 구리 광석
  o04: d => { lump(d, '#7d7888'); bits(d, [[-5, -1], [6, 1], [-1, 7]], '#dfe3ec', 3); },                                     // 주석 광석
  o05: d => { oval(d, 0, 4, 16, 11, 0, '#c98e5b'); d.circle(-4, -3, 7, '#d6a070'); shine(d, -6, -3, 2.8); },                 // 점토
  o06: d => { lump(d, '#efe8d8'); d.circle(3, 1, 3.6, '#e2d6bf', flat); d.circle(-6, 6, 2.4, '#e2d6bf', flat); },             // 석회석
  o07: d => { lump(d, '#e8c99a'); for (const y of [-2, 5]) d.rr(-12, y, 24, 3, 1.5, '#d9b07a', flat); },                     // 사암
  o08: d => { d.circle(-5, 4, 10, '#5b5266'); d.circle(6, 5, 8, '#6b6278'); shine(d, -8, 0, 2.6); },                         // 부싯돌
  o09: d => { for (const [y, w] of [[8, 14], [2, 12], [-4, 10]]) d.rr(-w, y - 3, w * 2, 7, 3.5, '#4a4a52'); shine(d, -7, -5, 2.2); }, // 흑연
  o10: d => { for (const [x, y, r] of [[-7, 6, 7], [6, 6, 7], [0, -3, 7.5]]) { d.rr(x - r, y - r, r * 2, r * 2, r * .6, '#f4f8ff'); d.dot(x - 2, y - 2, 1.8, '#ffffff', .9); } }, // 소금 결정
  // ◆◆ 보통
  o11: d => { lump(d, '#7d7888'); bits(d, [[-6, 0], [6, -2], [0, 7]], '#c9d2dc', 3.2); },                                   // 철 광석
  o12: d => { lump(d, '#6e6a78'); bits(d, [[-5, -2], [5, 1], [-1, 8], [8, 7]], '#f4f7fb', 3); },                            // 은 광석
  o13: d => { lump(d, '#7d8090'); d.circle(4, 0, 5, '#9497a6', flat); shine(d, -6, -3, 2.4); },                              // 납 광석
  o14: d => { lump(d, '#8a8494'); bits(d, [[-5, 0], [5, 3], [0, -6]], '#c3ccd8', 2.8); },                                   // 아연 광석
  o15: d => { lump(d, '#9a92a2', .8, 8); crystal(d, -5, 6, 15, 7, -.3, '#f3f0ff'); crystal(d, 4, 6, 18, 8, .2, '#ebe6ff'); }, // 석영
  o16: d => { lump(d, '#f3d9c9'); d.circle(-4, 0, 4, '#f8e6da', flat); d.circle(6, 6, 3, '#e8c6b2', flat); },                 // 장석
  o17: d => { for (const [y, w, c] of [[8, 13, '#d9c9a6'], [3, 11, '#e6d8b8'], [-2, 9, '#d9c9a6']]) oval(d, 0, y, w, 4, 0, c); shine(d, -5, -3, 2); }, // 운모
  o18: d => { for (const [x, y, r] of [[-7, 6, 7], [6, 6, 7.5], [0, -3, 8]]) d.circle(x, y, r, '#ffe066'); shine(d, -3, -6, 2.6); }, // 황
  o19: d => { gem(d, '#9fe0c9', 'cushion', .9); d.rr(-11, -1, 22, 4, 2, '#c8b6ff', flat); },                                // 형석
  o20: d => { d.circle(0, 2, 15, '#e8a07a'); d.circle(0, 2, 10, '#f3c2a0', flat); d.circle(0, 2, 5.5, '#e08a62', flat); shine(d, -7, -5, 2.6); }, // 마노
  // ◆◆◆ 귀함
  o21: d => { for (const [x, y, r] of [[-6, 6, 8], [7, 5, 7], [0, -3, 8.5]]) d.circle(x, y, r, '#ffd23f'); shine(d, -3, -6, 3); twinkle(d, [[13, -10, 1.8]]); }, // 금 광석
  o22: d => { for (const [x, y, r] of [[-6, 6, 7], [7, 6, 7], [0, -2, 8]]) d.circle(x, y, r, '#e8eef4'); shine(d, -3, -5, 3); }, // 백금 광석
  o23: d => { lump(d, '#8a7f9c', .85, 9); for (const [x, r] of [[-6, -.35], [0, 0], [6, .35]]) crystal(d, x, 8, 16, 7, r, '#b57bff'); }, // 자수정
  o24: d => { crystal(d, -4, 15, 26, 11, -.2, '#ffc94f'); crystal(d, 6, 15, 18, 8, .3, '#ffd977'); },                         // 황수정
  o25: d => gem(d, '#c9304f'),                                                                                               // 가넷
  o26: d => { gem(d, '#4fd6c9'); d.circle(5, -3, 2.4, '#3ab0a6', flat); d.circle(-4, 7, 2, '#3ab0a6', flat); },              // 터키석
  o27: d => { gem(d, '#ffe3f3'); for (const [x, y, c] of [[-4, -1, '#a6e0ff'], [4, 4, '#ffd27a'], [-2, 7, '#b8f0c0']]) d.circle(x, y, 2.6, c, flat); }, // 오팔
  o28: d => { d.circle(0, 2, 14, '#5cc48a'); d.circle(0, 2, 5, '#fff7f0', flat); shine(d, -6, -4, 3); },                     // 옥
  o29: d => { for (const [x, y, r] of [[0, 8, 4], [-6, 0, 3.4], [6, -1, 3.4], [0, -6, 3.4], [-9, -8, 3], [9, -9, 3]]) d.circle(x, y, r, '#ff8f9f'); d.rr(-2.4, -4, 4.8, 18, 2.4, '#ff8f9f'); }, // 산호석
  // ◆◆◆◆ 아주 귀함
  o30: d => { gem(d, '#ff2f4f', 'heart'); twinkle(d, [[13, -11, 2]]); },                                                    // 루비
  o31: d => { gem(d, '#3f6fff', 'cushion'); twinkle(d, [[14, -11, 2]]); },                                                  // 사파이어
  o32: d => { gem(d, '#2fbf6f', 'cushion', .95); d.rr(-6, -5, 12, 12, 5, '#5ad690', flat); twinkle(d, [[13, -12, 2]]); },    // 에메랄드
  o33: d => { gem(d, '#ffb347', 'drop'); twinkle(d, [[12, -12, 1.8]]); },                                                   // 토파즈
  o34: d => { gem(d, '#7fe0ff', 'pill'); twinkle(d, [[13, -11, 1.8]]); },                                                   // 아쿠아마린
  o35: d => { oval(d, 0, 9, 16, 6, 0, '#ffb3c6'); d.circle(0, 1, 10, '#fff7f0'); d.dot(-3, -3, 3, '#ffffff', .9); d.circle(6, -7, 1.8, '#fff6c8'); }, // 진주
  o36: d => { gem(d, '#bfe3ff', 'cushion'); d.circle(0, 1, 6, '#e6f4ff', flat); twinkle(d, [[-13, -11, 1.8], [13, 10, 1.6]], '#ffffff'); }, // 미스릴
  // ◆◆◆◆◆ 전설
  o37: d => { d.circle(0, 2, 18, '#dff6ff', {flat: true, noShadow: true}); gem(d, '#e8fbff', 'drop', 1.05); twinkle(d, [[-14, -12, 2.4], [14, -8, 2], [12, 13, 1.8]], '#ffffff'); }, // 다이아몬드
  o38: d => { d.circle(0, 2, 18, '#ece4ff', {flat: true, noShadow: true}); for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * PI * 2 / 5; d.circle(Math.cos(a) * 8, 2 + Math.sin(a) * 8, 6, '#c9b4ff'); } d.circle(0, 2, 8, '#d9c9ff'); shine(d, -3, -2, 2.6); twinkle(d, [[14, -12, 2]]); }, // 별빛 수정
  o39: d => { d.circle(0, 2, 15, '#ff9fe0'); d.circle(0, 2, 11.5, '#ffd27a', flat); d.circle(0, 2, 8, '#a6f0b0', flat); d.circle(0, 2, 4.5, '#a6d6ff', flat); shine(d, -7, -5, 3); twinkle(d, [[15, -11, 2]]); }, // 무지개 원석
  o40: d => { d.circle(0, 2, 19, '#ffd6c8', {flat: true, noShadow: true}); gem(d, '#ff4f2f', 'heart', 1.05); d.circle(0, 2, 3, '#ffb347', flat); twinkle(d, [[-14, -10, 2], [14, -12, 2]]); }, // 용의 심장석
};
