// 몬스터 그림 (d, t): 발/바닥이 y=0, 몸은 위로 약 -40 (보스급 -55)
// 유아용 점토 느낌: 동글동글한 몸, 구슬 눈, 분홍 볼, 살짝 삐친 작은 입. 가시·털·가는 다리 대신 둥근 혹과 짧은 덩어리 발.
const S = Math.sin, PI = Math.PI;
const tone = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
};
const EYE = '#3b2433', flat = {flat: true, noShadow: true};
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
// 얼굴: 구슬 눈 + 하이라이트 + 분홍 볼 + 작은 입 (mood: 'pout' 삐침, 'o' 놀람, 'smile')
const face = (d, x, y, k = 1, mood = 'pout', eye = EYE, glow) => {
  for (const s of [-1, 1]) {
    const ex = x + s * 4.4 * k;
    if (glow) d.dot(ex, y, 3.4 * k, glow, .35);
    d.ell(ex, y, 1.6 * k, 2.1 * k, glow || eye, flat); d.dot(ex + .5 * k, y - .8 * k, .6 * k, '#ffffff', .95);
    if (mood === 'pout') d.line(c => { c.moveTo(ex + s * 2 * k, y - 3.6 * k); c.lineTo(ex - s * 1.2 * k, y - 3 * k); }, glow || eye, .9 * k, .7);
    d.ell(x + s * 7.4 * k, y + 2.6 * k, 2 * k, 1.2 * k, '#ff8fb0', flat);
  }
  if (mood === 'o') d.ell(x, y + 3.6 * k, 1.1 * k, 1.4 * k, eye, flat);
  else if (mood === 'smile') d.line(c => { c.moveTo(x - 1.4 * k, y + 2.8 * k); c.quadraticCurveTo(x, y + 4.2 * k, x + 1.4 * k, y + 2.8 * k); }, eye, .9 * k);
  else d.line(c => { c.moveTo(x - 1.6 * k, y + 3.8 * k); c.quadraticCurveTo(x, y + 2.6 * k, x + 1.6 * k, y + 3.8 * k); }, eye, .9 * k);
};
// 짧은 덩어리 발
const feet = (d, col, gap = 6, y = -2, r = 3.4) => { for (const s of [-1, 1]) oval(d, s * gap, y, r * 1.2, r, 0, col); };
// 몽글몽글 먼지 몸: 둥근 혹을 둘러 붙인 공
const fluff = (d, x, y, r, col, n = 9) => { for (let i = 0; i < n; i++) { const a = i / n * PI * 2; d.circle(x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .72, r * .42, col); } d.circle(x, y, r * .86, tone(col, .08)); };
const shine = (d, x, y, r = 2.6) => d.dot(x, y, r, '#ffffff', .45);
// 둥근 날개 (박쥐·나방): 동그란 덩어리 세 개
const wings = (d, y, col, t, span = 14, r = 6) => { const f = S(t * 9) * .18; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) d.circle(s * (span - i * 2.6), y - 2 + i * 3.4 - f * 10 * (i === 0 ? 1 : .5), r - i * 1.2, col); };
// 유령 몸: 아래가 물결 모양으로 둥글게 끝나는 방울
const ghost = (d, y0, h, w, col, t) => d.shape(c => { c.beginPath(); c.moveTo(-w, y0); c.bezierCurveTo(-w, y0 - h * 1.25, w, y0 - h * 1.25, w, y0);
  for (let i = 0; i < 4; i++) { const x1 = w - (i + 1) * w / 2; c.quadraticCurveTo(x1 + w / 4, y0 + 4 + S(t * 4 + i) * 1.2, x1, y0); } c.closePath(); }, col, [0, y0 - h * .5, w]);

export const ART_PART = {
  // ===== 먼지 숲 =====
  m01: (d, t = 0) => { feet(d, '#a69eb3'); fluff(d, 0, -14, 13, '#bdb5c9'); face(d, 0, -14); shine(d, -6, -21); },                        // 먼지 뭉치
  m02: (d, t = 0) => { feet(d, '#d6d0e0'); fluff(d, 0, -14, 13, '#efeaf6', 10); face(d, 0, -14, 1, 'o'); },                               // 솜먼지
  m03: (d, t = 0) => { feet(d, '#b3a3c6'); fluff(d, 0, -14, 12, '#c9b8d9', 7); for (const [x, y] of [[-9, -24], [8, -25], [0, -27]]) d.circle(x, y, 3, '#d8cae6'); face(d, 0, -13); }, // 보푸라기
  m04: (d, t = 0) => { feet(d, '#c4ad92'); d.circle(0, -14, 13, '#d9c2a6'); d.line(c => { c.arc(0, -14, 8, .4, 2.4); }, '#c4ad92', 3, .7); oval(d, 15, -6, 5, 3, .6, '#d9c2a6'); face(d, 0, -15); }, // 털뭉치
  m05: (d, t = 0) => { for (let i = 3; i >= 0; i--) d.circle(-12 + i * 7, -7 - (i === 3 ? 4 : 0) + S(t * 6 + i) * .8, i === 3 ? 9 : 6.5, i % 2 ? '#9fc48f' : '#b2d4a2'); face(d, 9, -11, .75); for (const s of [-1, 1]) d.circle(9 + s * 4, -21, 2, '#9fc48f'); }, // 실밥벌레
  m06: (d, t = 0) => { oval(d, 0, -8, 15, 8, 0, '#a8a3b8'); for (const x of [-7, 0, 7]) d.rr(x - 1, -15, 2, 12, 1, '#bcb7ca', flat); d.circle(14, -11, 6.5, '#b8b3c6'); face(d, 14, -11, .65); feet(d, '#938ea4', 9, -1, 2.4); }, // 좀벌레
  m07: (d, t = 0) => { for (const s of [-1, 1]) d.circle(s * 13, -22 + S(t * 3) * 1, 5, '#ffffff'); ghost(d, -4, 18, 11, '#f3f3ff', t); face(d, 0, -17, 1, 'o'); },        // 거미줄 요정
  m08: (d, t = 0) => { for (const s of [-1, 1]) oval(d, s * 5, -30, 3.4, 8, s * .15, '#c9c2d6'); feet(d, '#b3abc2'); fluff(d, 0, -13, 12, '#c9c2d6'); d.circle(-12, -8, 3.6, '#ffffff'); face(d, 0, -14, 1, 'smile'); }, // 먼지 토끼
  // ===== 깊은 먼지 숲 =====
  m09: (d, t = 0) => { for (const s of [-1, 1]) d.circle(s * 10, -34, 5, '#8f8899'); feet(d, '#7a7385', 7, -2, 4.4); d.circle(0, -14, 14, '#8f8899'); d.circle(0, -30, 11, '#9b94a5'); oval(d, 0, -12, 8, 7, 0, '#aaa4b4', flat); face(d, 0, -31, .9); }, // 회색 먼지곰
  m10: (d, t = 0) => { d.circle(0, -13, 14, '#4f8f46'); for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; d.circle(Math.cos(a) * 13, -13 + Math.sin(a) * 12, 3.6, '#5ca052'); } for (const [x, y] of [[-8, -20], [9, -18], [6, -4], [-10, -6]]) d.circle(x, y, 2.4, '#ff6b7a'); face(d, 0, -13, .9); }, // 가시 덤불
  m11: (d, t = 0) => { fluff(d, 0, -15, 13, '#4b4660', 9); face(d, 0, -15, 1, 'pout', EYE, '#ffe066'); },                                 // 그림자 솜
  m12: (d, t = 0) => { feet(d, '#e8dcc8', 5); d.rr(-6, -16, 12, 14, 6, '#f3ead8'); d.shape(c => { c.beginPath(); c.ellipse(0, -18, 15, 11, 0, PI, 0); c.closePath(); }, '#c9304f', [0, -24, 14]); for (const [x, y] of [[-8, -22], [2, -26], [8, -21]]) d.circle(x, y, 2.4, '#ffe8ec'); face(d, 0, -9, .7); }, // 독버섯 요정
  m13: (d, t = 0) => { feet(d, '#686276', 8, -2, 3.6); oval(d, -2, -11, 13, 9, 0, '#7a7489'); oval(d, -15, -14, 4, 7, -.6, '#7a7489'); for (const s of [-1, 1]) oval(d, 9 + s * 4, -29, 3.4, 5, s * .2, '#7a7489'); d.circle(9, -21, 9, '#857f94'); oval(d, 15, -18, 4, 3, 0, '#9b95a8'); face(d, 9, -22, .75); }, // 먼지 늑대
  m14: (d, t = 0) => { d.rr(-1.2, -4, 2.4, 6, 1.2, '#6b4f2a'); oval(d, 0, -16, 11, 14, 0, '#8a6a3b'); d.rr(-.8, -28, 1.6, 22, .8, '#a07e4c', flat); face(d, 0, -16, .9); }, // 썩은 나뭇잎
  m15: (d, t = 0) => { ghost(d, -2, 22, 12, '#2f2f3a', t); d.circle(7, -31, 4.4, '#ffe8a0'); d.circle(9, -32, 3.6, '#2f2f3a'); face(d, 0, -19, 1, 'pout', EYE, '#b9a6ff'); }, // 밤그림자
  m16: (d, t = 0) => { d.shape(c => { c.beginPath(); c.moveTo(-6, -16); c.lineTo(6, -16); c.quadraticCurveTo(14, -2, 12, 0); c.lineTo(-12, 0); c.quadraticCurveTo(-14, -2, -6, -16); c.closePath(); }, '#b58cff', [0, -8, 12]); d.rr(-12, -3, 24, 3, 1.5, '#ffffff', flat);
    d.circle(0, -25, 10, '#e8e0f0'); for (const s of [-1, 1]) d.circle(s * 5, -36, 4, '#ff9fc4'); d.circle(0, -35, 2, '#ff86ad'); face(d, 0, -24, .85, 'smile'); },          // 먼지 여왕의 시녀
  // ===== 비밀 해식 동굴 =====
  m17: (d, t = 0) => { for (const s of [-1, 1]) { d.circle(s * 15, -20 + S(t * 4 + s) * 1.5, 5.6, '#ff8f7a'); d.circle(s * 15, -24 + S(t * 4 + s) * 1.5, 2.6, '#fff4ee'); for (const i of [0, 1]) d.circle(s * (7 + i * 4), -2, 2.8, '#f07a66'); } oval(d, 0, -10, 13, 9, 0, '#ff8f7a'); face(d, 0, -11, .85); }, // 소금 게
  m18: (d, t = 0) => { const q = S(t * 4) * .8; d.shape(c => { c.beginPath(); c.moveTo(-14, 0); c.bezierCurveTo(-15, -26 - q, 15, -26 - q, 14, 0); c.closePath(); }, '#7fc46a', [0, -10, 14]); for (const [x, y] of [[-6, -20], [2, -22], [8, -18]]) d.circle(x, y, 3.4, '#5aa84a'); shine(d, -8, -12); face(d, 0, -9, .9); }, // 이끼 슬라임
  m19: (d, t = 0) => { for (const x of [-7, -2.5, 2.5, 7]) d.rr(x - 1.6, -12, 3.2, 12 + S(t * 4 + x) * 1.5, 1.6, '#d6ebff'); d.shape(c => { c.beginPath(); c.ellipse(0, -14, 13, 12, 0, PI, 0); c.closePath(); }, '#bfe0ff', [0, -20, 13]); face(d, 0, -18, .85, 'o'); }, // 해파리 유령
  m20: (d, t = 0) => { feet(d, '#7d8794', 8, -2, 4); d.rr(-14, -26, 28, 25, 10, '#8f9aa6'); for (const [x, y] of [[-8, -20], [9, -10], [-9, -7]]) { d.circle(x, y, 3.2, '#e8ecf0'); d.circle(x, y, 1.3, '#8f9aa6', flat); } face(d, 1, -16, .9); }, // 따개비 골렘
  m21: (d, t = 0) => { wings(d, -18, '#5b4a6f', t); for (const s of [-1, 1]) d.circle(s * 5, -28, 3, '#5b4a6f'); d.circle(0, -18, 9, '#6b5a80'); face(d, 0, -18, .8, 'pout', EYE, '#ffe066'); }, // 동굴 박쥐
  m22: (d, t = 0) => { for (const s of [-1, 1]) for (let i = 0; i < 3; i++) d.circle(s * (12 + i * 2), -4 - i * 5 + S(t * 3 + i) * 1.2, 3.6 - i * .5, '#8a6fd0'); d.rr(-9, -32, 18, 32, 9, '#6f4fb5'); for (const y of [-22, -12]) for (const s of [-1, 1]) d.circle(s * 9, y, 2.2, '#c9b8ff'); face(d, 0, -22, .85); }, // 심해 촉수
  // ===== 의문의 동굴 =====
  m23: (d, t = 0) => { oval(d, 0, -2, 16, 5, 0, '#a08d78'); d.circle(0, -13, 11, '#8a7a6a'); d.circle(0, -9, 3, '#ff8fa6'); for (const s of [-1, 1]) oval(d, s * 8, -4, 3.4, 2.4, 0, '#f3d6c4'); face(d, 0, -16, .8); }, // 바위 두더지
  m24: (d, t = 0) => { wings(d, -18, '#b9a6ff', t); for (const s of [-1, 1]) d.circle(s * 5, -28, 3, '#cbbcff'); d.circle(0, -18, 9, '#c4b4ff'); d.circle(0, -11, 2.4, '#ffffff', flat); face(d, 0, -19, .8); }, // 수정 박쥐
  m25: (d, t = 0) => { feet(d, '#8e8694', 8, -2, 4.4); for (const s of [-1, 1]) d.circle(s * 17, -18, 5.4, '#a39aa8'); d.rr(-13, -32, 26, 30, 11, '#a39aa8'); for (const [x, y, c] of [[-6, -10, '#ff6f9a'], [6, -8, '#7fe0ff'], [0, -4, '#ffd23f']]) d.circle(x, y, 2.6, c); face(d, 0, -22, .9); }, // 광석 골렘
  m26: (d, t = 0) => { const q = S(t * 4) * .8; d.shape(c => { c.beginPath(); c.moveTo(-14, 0); c.bezierCurveTo(-15, -26 - q, 15, -26 - q, 14, 0); c.closePath(); }, '#ff6b3b', [0, -10, 14]); for (const [x, y] of [[-7, -16], [6, -20]]) d.circle(x, y, 2.6, '#ffc94f'); shine(d, -8, -14); face(d, 0, -9, .9); }, // 용암 슬라임
  m27: (d, t = 0) => { ghost(d, -2, 20, 11, '#3b3b46', t); d.shape(c => { c.beginPath(); c.ellipse(0, -25, 12, 7, 0, PI, 0); c.closePath(); }, '#f3c63f', [0, -29, 12]); d.circle(0, -29, 2.6, '#fff6c8'); face(d, 0, -16, .9, 'pout', EYE, '#7fe0ff'); }, // 그림자 광부
  m28: (d, t = 0) => { feet(d, '#4a2558', 10, -2, 5.4); for (const s of [-1, 1]) d.circle(s * 21, -22, 7, '#5b2f6f'); d.rr(-17, -44, 34, 42, 15, '#5b2f6f'); for (const [x, y] of [[-10, -12], [10, -16], [-12, -30]]) d.circle(x, y, 3, '#b99aff');
    for (const x of [-7, 0, 7]) d.circle(x, -47, 3.2, '#ffd23f'); d.rr(-10, -48, 20, 5, 2.5, '#ffd23f'); d.circle(0, -46, 1.6, '#ff4f6d', flat); face(d, 0, -30, 1.25); }, // 동굴의 주인
  // ===== 별빛 언덕 =====
  m29: (d, t = 0) => { for (let i = 1; i <= 3; i++) d.circle(-6 - i * 5, -12 + i * 4, 4 - i, '#fff6b0'); for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * PI * 2 / 5; d.circle(Math.cos(a) * 9, -20 + Math.sin(a) * 9, 6, '#fff6b0'); } d.circle(0, -20, 9, '#fff0a0'); face(d, 0, -20, .8, 'smile'); }, // 별똥 유령
  m30: (d, t = 0) => { wings(d, -18, '#d9e3ff', t, 15, 7); for (const s of [-1, 1]) d.circle(s * 12, -14, 2, '#b9c9ff', flat); for (const s of [-1, 1]) d.circle(s * 4, -33, 2.4, '#d9e3ff'); oval(d, 0, -17, 7, 11, 0, '#eef2ff'); face(d, 0, -21, .7, 'o'); }, // 달빛 나방
};
// ===== 구역 보스 (다 같이 잡는 큰 몬스터): 원래 몬스터 그림에 왕관을 씌우고 색을 바꿔요. 크기는 게임에서 두 배로 =====
const bossCrown = (d, y, col = '#ffd23f') => { d.rr(-9, y, 18, 5, 2.5, col); for (const x of [-7, 0, 7]) d.circle(x, y - 1, 3, col); d.circle(0, y + 1, 1.5, '#ff4f6d', flat); };
ART_PART.m31 = (d, t = 0) => { ART_PART.m01(d, t); bossCrown(d, -31); };            // 먼지 뭉치 대왕
ART_PART.m32 = (d, t = 0) => { ART_PART.m10(d, t); bossCrown(d, -32, '#ffe08a'); }; // 가시 덤불 거인
ART_PART.m33 = (d, t = 0) => { ART_PART.m22(d, t); bossCrown(d, -35, '#bfe9ff'); }; // 심연의 크라켄
ART_PART.m34 = (d, t = 0) => { ART_PART.m26(d, t); bossCrown(d, -23, '#ffd23f'); }; // 용암 군주
ART_PART.m35 = (d, t = 0) => { ART_PART.m29(d, t); bossCrown(d, -34, '#ffd23f'); }; // 별고래 유령
// ===== 강한 몬스터 (원래 몬스터를 바탕으로 뿔과 다른 색 무늬를 더해요) =====
const elite = (base, col, top, k = 1) => (d, t = 0) => { ART_PART[base](d, t); for (const s of [-1, 1]){ d.circle(s * 7 * k, top + 1, 3.4 * k, col); d.circle(s * 8.6 * k, top - 3, 2.3 * k, col); d.circle(s * 9.6 * k, top - 6, 1.4 * k, col); } };
Object.assign(ART_PART, {
  m36: elite('m08', '#8a5a3b', -30), m37: elite('m04', '#ff6b6b', -27), m38: elite('m02', '#7fb3ff', -26),
  m39: elite('m14', '#4f8f46', -28), m40: elite('m10', '#b03a7a', -29), m41: elite('m13', '#2f2f3a', -30),
  m42: elite('m17', '#c9504f', -17), m43: elite('m19', '#5fb5c9', -32), m44: elite('m20', '#ff8fb1', -34),
  m45: elite('m25', '#2b2440', -34), m46: elite('m24', '#ff7a2f', -28), m47: elite('m23', '#b9a6ff', -30),
  m48: elite('m13', '#ffd84f', -30), m49: elite('m30', '#ffb35a', -34), m50: elite('m08', '#d9e3ff', -30),
});
