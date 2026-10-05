// 가구 43 종 (u01..u43). 유아용 점토 느낌: 둥근 모서리, 통통한 다리, 말랑한 쿠션. (x,y)는 바닥에 닿는 점.
// 크기 기준: 캐릭터 키가 약 56px. 의자·탁자는 허리 높이, 침대·소파는 캐릭터 한 명이 눕거나 앉을 만큼만.
// 목록 형식: [이름, 골드, 재료, 개수, 모양 id, 기본색]. 이미 가진 가구가 바뀌지 않게 순서(u01..)는 그대로 두고,
// 실내에 안 어울리던 것(실내 그네·미니 분수·미니 관람차)만 다른 가구로 바꿨어요.
export const FURN_ALL = [
  ['나무 의자', 160, 'ore:o01', 2, 'chair', '#c98e5b'], ['나무 탁자', 300, 'ore:o01', 4, 'table', '#c98e5b'], ['포근한 침대', 800, 'ore:o05', 3, 'bed', '#ff9fbf'],
  ['책장', 600, 'ore:o01', 5, 'shelf', '#a8744f'], ['둥근 러그', 240, 'ore:o06', 2, 'rug', '#ffd3e2'], ['작은 화분', 120, 'ore:o05', 1, 'plant', '#6cc46a'],
  ['스탠드 조명', 400, 'ore:o03', 2, 'lamp', '#ffe066'], ['말랑 소파', 1000, 'ore:o16', 2, 'sofa', '#a9d8ff'], ['옷장', 900, 'ore:o01', 6, 'wardrobe', '#d9a46f'],
  ['어항', 1200, 'ore:o15', 2, 'tank', '#8fd3f5'], ['벽난로', 1600, 'ore:o11', 4, 'fire', '#e8d6c6'], ['피아노', 2400, 'ore:o13', 4, 'piano', '#4a4458'],
  ['괘종시계', 1400, 'ore:o04', 3, 'clock', '#a8744f'], ['큰 거울', 1300, 'ore:o12', 2, 'mirror', '#c9a6ff'], ['곰 인형', 600, 'ore:o17', 1, 'bear', '#d9a46f'],
  ['황금 트로피', 3000, 'ore:o21', 3, 'trophy', '#ffd23f'], ['자수정 램프', 2600, 'ore:o23', 2, 'crystal', '#b57bff'], ['별빛 조명', 6000, 'ore:o38', 1, 'star', '#fff0a0'],
  ['보물 상자', 4000, 'ore:o22', 2, 'chest', '#c98e5b'], ['케이크 장식장', 1800, 'ore:o20', 2, 'cake', '#ff9fc4'],
  ['책 더미', 300, 'ore:o01', 3, 'bookpile', '#ff9fbf'], ['이젤과 그림', 600, 'ore:o02', 2, 'easel', '#d9a46f'], ['티 테이블 세트', 700, 'ore:o05', 3, 'teaset', '#ffd3e2'],
  ['지구본', 800, 'ore:o03', 2, 'globe', '#8fd3f5'], ['커튼 창문', 900, 'ore:o06', 3, 'window', '#ffb3d1'], ['아기 텐트', 1000, 'ore:o07', 3, 'tent', '#ffb3c6'],
  ['공부 책상', 1100, 'ore:o17', 2, 'desk', '#e8c9a0'], ['미니 냉장고', 1200, 'ore:o11', 4, 'fridge', '#bfe3ff'], ['기타 스탠드', 1300, 'ore:o10', 3, 'guitar', '#e08a4f'],
  ['오븐', 1400, 'ore:o14', 3, 'oven', '#ff9fbf'], ['화장대', 1500, 'ore:o12', 3, 'vanity', '#ffd3e2'], ['캣타워', 1700, 'ore:o19', 2, 'catTower', '#f0d5b0'],
  ['욕조', 2000, 'ore:o15', 3, 'bath', '#f4fbff'], ['도넛 의자', 2200, 'ore:o18', 2, 'donutChair', '#ff9fc4'], ['마카롱 타워', 2800, 'ore:o24', 2, 'macaronTower', '#ffd6e8'],
  ['주크박스', 3200, 'ore:o20', 3, 'jukebox', '#ff7a90'], ['폭신 빈백', 3600, 'ore:o26', 2, 'beanbag', '#9fe0c9'], ['컵케이크 조명', 4400, 'ore:o29', 2, 'cupcakeLamp', '#fff3a8'],
  ['동그란 TV', 1500, 'ore:o01', 5, 'tv', '#ffb3d9'], ['초승달 침대', 8000, 'ore:o37', 2, 'moonBed', '#fff0a0'],
  ['오투모 인형', 3500, 'ore:o25', 3, 'otumoDoll', '#fbfbfd'], ['토끼 인형', 700, 'ore:o16', 1, 'bunnyDoll', '#ffe6ee'], ['펭귄 인형', 700, 'ore:o10', 2, 'pengDoll', '#5b6a8a'],
];

const PI = Math.PI;
const tone = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join(''); };
const flat = {flat: true, noShadow: true};
const WOOD = '#c98e5b', WHITE = '#fffaf2', INK = '#3b2433';
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
const legs = (d, x, y, w, h, col, r = 3) => { for (const s of [-1, 1]) d.rr(x + s * w - r, y - h, r * 2, h, r, col); };
const shine = (d, x, y, r = 3) => d.dot(x, y, r, '#ffffff', .4);
// 인형 얼굴: 구슬 눈·볼·작은 입
const dollFace = (d, x, y, k = 1) => { for (const s of [-1, 1]) { d.ell(x + s * 3.4 * k, y, 1.2 * k, 1.6 * k, INK, flat); d.dot(x + s * 3.4 * k + .4 * k, y - .6 * k, .45 * k, '#ffffff', .95); d.ell(x + s * 5.8 * k, y + 2.2 * k, 1.6 * k, 1 * k, '#ff8fb0', flat); } d.line(c => { c.moveTo(x - 1.2 * k, y + 2.4 * k); c.quadraticCurveTo(x, y + 3.6 * k, x + 1.2 * k, y + 2.4 * k); }, INK, .8 * k); };

export const FURN_DRAW = {
  chair: (d, x, y, col) => { legs(d, x, y, 9, 12, tone(col, -.2)); d.rr(x - 13, y - 44, 26, 26, 9, col); d.rr(x - 14, y - 20, 28, 9, 4.5, tone(col, .12)); },
  table: (d, x, y, col) => { legs(d, x, y, 20, 18, tone(col, -.2), 3.4); d.rr(x - 28, y - 26, 56, 11, 5.5, col); shine(d, x - 16, y - 23, 2.4); },
  // 침대: 머리판이 뒤에 서 있고, 매트리스가 앞으로(아래로) 길게 놓인 모습
  bed: (d, x, y, col) => { d.rr(x - 27, y - 72, 54, 30, 12, tone(col, -.1)); d.rr(x - 25, y - 50, 50, 50, 10, WHITE); d.rr(x - 25, y - 32, 50, 32, 10, col);
    d.rr(x - 18, y - 47, 36, 12, 6, '#ffffff'); d.rr(x - 23, y - 33, 46, 5, 2.5, tone(col, .25), flat); },
  shelf: (d, x, y, col) => { d.rr(x - 22, y - 70, 44, 72, 8, col); for (const [yy, a, b] of [[-56, '#ff8fb3', '#7cc8ff'], [-34, '#ffd27a', '#a6e0b0'], [-12, '#c9a6ff', '#ff8fb3']]) { d.rr(x - 17, y + yy - 2, 34, 18, 4, tone(col, -.25), flat); d.rr(x - 13, y + yy, 7, 14, 3, a); d.rr(x - 4, y + yy + 2, 6, 12, 3, b); d.circle(x + 9, y + yy + 8, 5, a); } },
  rug: (d, x, y, col) => { oval(d, x, y - 8, 42, 15, 0, col); oval(d, x, y - 8, 32, 10, 0, tone(col, .3), flat); oval(d, x, y - 8, 18, 5, 0, col, flat); },
  plant: (d, x, y, col) => { d.rr(x - 10, y - 16, 20, 17, 7, '#e8a07a'); d.circle(x - 7, y - 22, 8, col); d.circle(x + 7, y - 24, 8, col); d.circle(x, y - 32, 9, tone(col, .15)); },
  lamp: (d, x, y, col) => { oval(d, x, y - 2, 10, 4, 0, '#b8a898'); d.rr(x - 2.6, y - 46, 5.2, 46, 2.6, '#b8a898'); d.shape(c => { c.beginPath(); c.moveTo(x - 9, y - 62); c.lineTo(x + 9, y - 62); c.quadraticCurveTo(x + 17, y - 46, x + 15, y - 44); c.lineTo(x - 15, y - 44); c.quadraticCurveTo(x - 17, y - 46, x - 9, y - 62); c.closePath(); }, col, [x, y - 52, 14]); d.dot(x, y - 40, 7, '#fff6c8', .5); },
  sofa: (d, x, y, col) => { legs(d, x, y, 28, 5, tone(col, -.3), 3); d.rr(x - 34, y - 44, 68, 26, 12, col); d.rr(x - 38, y - 24, 76, 20, 10, tone(col, -.06)); for (const s of [-1, 1]) d.rr(x + s * 36 - 7, y - 36, 14, 32, 7, col); d.rr(x - 26, y - 38, 22, 14, 7, tone(col, .25)); },
  wardrobe: (d, x, y, col) => { legs(d, x, y, 17, 5, tone(col, -.3), 3); d.rr(x - 25, y - 80, 50, 76, 11, col); d.rr(x - 1.2, y - 74, 2.4, 64, 1.2, tone(col, -.25), flat); for (const s of [-1, 1]) d.circle(x + s * 5, y - 42, 2.4, '#ffd23f'); d.rr(x - 25, y - 84, 50, 8, 4, tone(col, .12)); },
  tank: (d, x, y, col) => { d.rr(x - 24, y - 12, 48, 12, 5, '#c9a6a6'); d.rr(x - 26, y - 46, 52, 36, 12, col); d.rr(x - 22, y - 30, 44, 14, 7, tone(col, -.15), flat); d.circle(x - 8, y - 30, 4.4, '#ff8f7a'); d.circle(x + 10, y - 22, 3.4, '#ffd23f'); for (const [a, b] of [[-14, -40], [-10, -36], [12, -38]]) d.circle(x + a, y + b, 1.4, '#ffffff'); },
  fire: (d, x, y, col) => { d.rr(x - 32, y - 58, 64, 60, 12, col); d.rr(x - 36, y - 62, 72, 10, 5, tone(col, -.1)); d.rr(x - 18, y - 36, 36, 36, 14, '#6a4a4a'); d.circle(x - 5, y - 10, 7, '#ff8c3a'); d.circle(x + 5, y - 12, 8, '#ffb347'); d.circle(x, y - 18, 6, '#ffd27a'); },
  piano: (d, x, y, col) => { legs(d, x, y, 28, 14, tone(col, -.2), 3.4); d.rr(x - 34, y - 58, 68, 46, 12, col); d.rr(x - 32, y - 24, 64, 9, 4, '#ffffff'); for (let i = 0; i < 6; i++) d.rr(x - 26 + i * 10, y - 24, 4, 5, 2, col, flat); d.circle(x + 18, y - 46, 4, '#ffd23f'); },
  clock: (d, x, y, col) => { d.rr(x - 15, y - 82, 30, 84, 13, col); d.circle(x, y - 64, 11, '#fff7ee'); d.line(c => { c.moveTo(x, y - 64); c.lineTo(x, y - 71); c.moveTo(x, y - 64); c.lineTo(x + 5, y - 63); }, INK, 1.6); d.rr(x - 6, y - 44, 12, 30, 6, tone(col, -.2), flat); d.circle(x, y - 22, 4.4, '#ffd23f'); },
  mirror: (d, x, y, col) => { oval(d, x, y - 2, 14, 4, 0, tone(col, -.2)); d.rr(x - 18, y - 76, 36, 74, 18, col); d.rr(x - 13, y - 70, 26, 62, 13, '#e8f4ff'); d.rr(x - 8, y - 64, 6, 24, 3, '#ffffff', flat); },
  bear: (d, x, y, col) => { for (const s of [-1, 1]) d.circle(x + s * 10, y - 6, 5, col); d.ell(x, y - 13, 12, 11, col); d.ell(x, y - 11, 6, 5, tone(col, .35), flat); for (const s of [-1, 1]) d.circle(x + s * 9, y - 40, 5, col); d.circle(x, y - 31, 11, col); d.ell(x, y - 28, 4.4, 3.4, tone(col, .35)); d.dot(x, y - 29.5, 1.4, INK); dollFace(d, x, y - 33, .8); },
  trophy: (d, x, y, col) => { d.rr(x - 12, y - 12, 24, 13, 5, '#c98e5b'); d.rr(x - 3.4, y - 22, 6.8, 11, 3, col); d.shape(c => { c.beginPath(); c.moveTo(x - 13, y - 44); c.lineTo(x + 13, y - 44); c.quadraticCurveTo(x + 13, y - 22, x, y - 22); c.quadraticCurveTo(x - 13, y - 22, x - 13, y - 44); c.closePath(); }, col, [x, y - 34, 13]); for (const s of [-1, 1]) d.line(c => c.arc(x + s * 14, y - 37, 4.4, 0, PI * 2), col, 2.6); d.circle(x, y - 34, 3.4, '#fff6c8'); },
  crystal: (d, x, y, col) => { d.rr(x - 11, y - 12, 22, 13, 6, '#b8a898'); d.rr(x - 9, y - 40, 18, 30, 9, col); d.dot(x, y - 26, 12, '#ffffff', .25); shine(d, x - 3, y - 32, 2.6); },
  star: (d, x, y, col) => { oval(d, x, y - 2, 9, 3.4, 0, '#c9c9d6'); d.rr(x - 2.4, y - 44, 4.8, 44, 2.4, '#c9c9d6'); for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * PI * 2 / 5; d.circle(x + Math.cos(a) * 8, y - 56 + Math.sin(a) * 8, 6, col); } d.circle(x, y - 56, 8, tone(col, .3)); d.dot(x, y - 56, 16, '#fff6c8', .25); },
  chest: (d, x, y, col) => { d.rr(x - 24, y - 26, 48, 27, 8, col); d.rr(x - 26, y - 38, 52, 16, 9, tone(col, .12)); for (const s of [-1, 1]) d.rr(x + s * 14 - 2.4, y - 38, 4.8, 39, 2.4, '#ffd23f', flat); d.rr(x - 5, y - 28, 10, 9, 3, '#ffd23f'); },
  cake: (d, x, y, col) => { d.rr(x - 22, y - 46, 44, 47, 10, '#ffffff'); d.rr(x - 18, y - 40, 36, 16, 6, '#fff3f6', flat); d.rr(x - 12, y - 36, 24, 11, 5, col); d.circle(x, y - 40, 3, '#ff4f6d'); d.rr(x - 18, y - 20, 36, 16, 6, '#fff3f6', flat); for (const s of [-1, 1]) d.circle(x + s * 7, y - 12, 5, s < 0 ? '#ffe08a' : '#ffc2d6'); },
  bookpile: (d, x, y, col) => { for (const [i, c, w] of [[0, col, 34], [1, '#7cc8ff', 30], [2, '#ffd27a', 32], [3, '#a6e0b0', 26]]) d.rr(x - w / 2 + (i % 2 ? 3 : -2), y - 10 - i * 10, w, 10, 5, c); d.circle(x + 2, y - 48, 5, '#fff3f6'); },
  easel: (d, x, y, col) => { for (const s of [-1, 1]) d.rr(x + s * 12 - 2.4, y - 40, 4.8, 40, 2.4, col); d.rr(x - 22, y - 70, 44, 38, 8, '#ffffff'); d.rr(x - 17, y - 64, 34, 26, 6, '#cdeeff', flat); d.circle(x - 6, y - 52, 6, '#a6e0b0', flat); d.circle(x + 8, y - 58, 4, '#ffd27a', flat); d.rr(x - 20, y - 34, 40, 5, 2.5, col); },
  teaset: (d, x, y, col) => { d.rr(x - 3, y - 26, 6, 26, 3, '#e0c8d0'); oval(d, x, y - 1, 12, 3.6, 0, '#e0c8d0'); oval(d, x, y - 28, 24, 8, 0, col); d.circle(x - 6, y - 36, 6, '#ffffff'); d.rr(x - 8, y - 44, 4, 4, 2, '#ffffff'); for (const s of [-1, 1]) d.rr(x + 8 + s * 6 - 3, y - 36, 6, 6, 3, '#ffffff'); },
  globe: (d, x, y, col) => { oval(d, x, y - 2, 11, 4, 0, '#c98e5b'); d.rr(x - 2.4, y - 18, 4.8, 17, 2.4, '#c98e5b'); d.circle(x, y - 34, 16, col); for (const [a, b, r] of [[-6, -38, 5], [5, -30, 6], [-2, -26, 3.4]]) d.circle(x + a, y + b, r, '#7fd06a', flat); d.line(c => c.arc(x, y - 34, 19, PI * .6, PI * 1.9), '#ffd23f', 2.4); },
  window: (d, x, y, col) => { d.rr(x - 24, y - 82, 48, 50, 10, '#ffffff'); d.rr(x - 20, y - 78, 40, 42, 8, '#cdeeff', flat); d.circle(x + 8, y - 68, 5, '#fff6b0', flat); for (const s of [-1, 1]) d.rr(x + s * 22 - 8, y - 88, 16, 60, 8, col); d.rr(x - 30, y - 92, 60, 8, 4, tone(col, -.15)); d.rr(x - 26, y - 34, 52, 10, 5, '#c98e5b'); for (const [a, c] of [[-14, '#ff8fb0'], [0, '#ffd27a'], [14, '#a6e0ff']]) d.circle(x + a, y - 36, 4.4, c); },
  tent: (d, x, y, col) => { d.shape(c => { c.beginPath(); c.moveTo(x, y - 76); c.quadraticCurveTo(x - 34, y - 10, x - 36, y); c.lineTo(x + 36, y); c.quadraticCurveTo(x + 34, y - 10, x, y - 76); c.closePath(); }, col, [x, y - 34, 34]);
    d.shape(c => { c.beginPath(); c.moveTo(x, y - 44); c.quadraticCurveTo(x - 12, y - 10, x - 13, y); c.lineTo(x + 13, y); c.quadraticCurveTo(x + 12, y - 10, x, y - 44); c.closePath(); }, '#fff3f6', [x, y - 18, 12], flat); for (const a of [-20, -8, 8, 20]) d.circle(x + a, y - 48 + Math.abs(a) * .9, 2.6, ['#ffd27a', '#a6e0ff', '#a6e0b0', '#c9a6ff'][(a + 20) / 8 | 0] || '#ffd27a'); d.circle(x, y - 78, 3.4, '#ffd23f'); },
  desk: (d, x, y, col) => { legs(d, x, y, 24, 24, tone(col, -.2), 3.4); d.rr(x - 30, y - 34, 60, 11, 5.5, col); d.rr(x + 6, y - 24, 22, 14, 5, tone(col, -.08)); d.circle(x + 17, y - 17, 2, '#ffd23f'); d.rr(x - 22, y - 44, 18, 10, 3, '#a6e0ff'); d.rr(x - 2, y - 48, 4, 14, 2, '#b8a898'); oval(d, x + 4, y - 50, 9, 5, -.4, '#ffd27a'); },
  fridge: (d, x, y, col) => { d.rr(x - 20, y - 74, 40, 76, 12, col); d.rr(x - 20, y - 50, 40, 3, 1.5, tone(col, -.2), flat); for (const yy of [-64, -40]) d.rr(x + 10, y + yy, 4, 12, 2, '#ffffff'); for (const [a, b, c] of [[-8, -64, '#ff8fb0'], [-4, -58, '#ffd27a'], [-10, -30, '#a6e0b0']]) d.circle(x + a, y + b, 3, c); },
  guitar: (d, x, y, col) => { oval(d, x, y - 2, 12, 4, 0, '#8a7a86'); d.rr(x - 2.6, y - 82, 5.2, 30, 2.6, '#8a5a3b'); d.rr(x - 5, y - 88, 10, 9, 4, '#8a5a3b'); d.circle(x, y - 20, 14, col); d.circle(x, y - 40, 10.5, col); d.circle(x, y - 28, 4.4, '#6a4a3a', flat); d.rr(x - 6, y - 14, 12, 3.4, 1.7, '#8a5a3b', flat); },
  oven: (d, x, y, col) => { d.rr(x - 26, y - 56, 52, 58, 12, col); d.rr(x - 20, y - 40, 40, 32, 9, '#fff3f6'); d.rr(x - 15, y - 34, 30, 20, 7, '#ffd9a8', flat); d.circle(x, y - 22, 6, '#e8a07a'); for (const a of [-14, -4, 6, 16]) d.circle(x + a, y - 49, 3, '#ffffff'); },
  vanity: (d, x, y, col) => { legs(d, x, y, 20, 10, tone(col, -.2), 3); d.rr(x - 26, y - 34, 52, 26, 9, col); for (const s of [-1, 1]) d.circle(x + s * 11, y - 21, 2.4, '#ffd23f'); oval(d, x, y - 60, 18, 22, 0, '#ffffff'); oval(d, x, y - 60, 14, 18, 0, '#e8f4ff', flat); d.rr(x + 14, y - 46, 6, 12, 3, '#ff8fb0'); d.circle(x - 17, y - 39, 4, '#c9a6ff'); },
  catTower: (d, x, y, col) => { d.rr(x - 22, y - 10, 44, 11, 5.5, col); d.rr(x - 5, y - 70, 10, 62, 5, '#d9b07a'); d.rr(x - 20, y - 46, 26, 9, 4.5, col); d.rr(x - 4, y - 76, 26, 9, 4.5, col); d.circle(x + 18, y - 84, 7, '#ffd6a8'); for (const s of [-1, 1]) d.circle(x + 18 + s * 4.4, y - 90, 2.6, '#ffd6a8'); d.circle(x - 12, y - 32, 3, '#ff8fb0'); },
  bath: (d, x, y, col) => { for (const s of [-1, 1]) d.circle(x + s * 24, y - 2, 3.4, '#ffd23f'); d.rr(x - 34, y - 34, 68, 32, 14, col); oval(d, x, y - 32, 30, 6, 0, '#bfe6ff', flat); for (const [a, r] of [[-16, 6], [-6, 7], [6, 6], [15, 5]]) d.circle(x + a, y - 36, r, '#ffffff'); d.circle(x + 20, y - 42, 4.4, '#ffd23f'); },
  donutChair: (d, x, y, col) => { legs(d, x, y, 12, 8, '#c98e5b', 3); d.circle(x, y - 34, 24, '#e8b07a'); d.circle(x, y - 35, 20, col); d.circle(x, y - 35, 7.4, '#e8b07a'); for (const [a, b, c] of [[-12, -46, '#ffd27a'], [10, -48, '#a6e0ff'], [14, -28, '#ffffff'], [-14, -26, '#a6e0b0']]) d.rr(x + a - 2, y + b - 1, 4, 2.4, 1.2, c, flat); },
  macaronTower: (d, x, y, col) => { oval(d, x, y - 3, 22, 5, 0, '#ffffff'); const cols = ['#ffb3c6', '#a6e0b0', '#ffe08a', '#c9a6ff', '#a6d6ff']; for (let r = 0; r < 4; r++) for (let i = 0; i <= 3 - r; i++) { const cx = x + (i - (3 - r) / 2) * 11, cy = y - 10 - r * 10, c = cols[(r + i) % 5]; d.rr(cx - 5, cy - 4, 10, 8, 4, c); d.rr(cx - 5.4, cy - .8, 10.8, 1.6, .8, '#fff7f0', flat); } d.circle(x, y - 52, 3.4, '#ff4f6d'); },
  jukebox: (d, x, y, col) => { d.rr(x - 24, y - 70, 48, 72, 22, col); d.rr(x - 17, y - 58, 34, 22, 11, '#fff3f6'); d.circle(x, y - 47, 7, '#3b3b46'); d.circle(x, y - 47, 2.4, '#ffd23f'); for (let i = 0; i < 4; i++) d.rr(x - 15 + i * 8, y - 28, 6, 16, 3, ['#a6e0ff', '#ffd27a', '#a6e0b0', '#c9a6ff'][i]); },
  beanbag: (d, x, y, col) => { d.shape(c => { c.beginPath(); c.moveTo(x - 30, y); c.quadraticCurveTo(x - 34, y - 26, x - 12, y - 38); c.quadraticCurveTo(x + 6, y - 46, x + 18, y - 34); c.quadraticCurveTo(x + 36, y - 18, x + 30, y); c.closePath(); }, col, [x, y - 18, 30]); oval(d, x - 2, y - 18, 16, 9, -.2, tone(col, .25), flat); shine(d, x - 14, y - 30, 3); },
  cupcakeLamp: (d, x, y, col) => { oval(d, x, y - 2, 11, 4, 0, '#c9c9d6'); d.rr(x - 2.4, y - 40, 4.8, 40, 2.4, '#c9c9d6'); d.rr(x - 14, y - 58, 28, 18, 6, '#ffb3c6'); for (const [a, b, r] of [[-8, -62, 8], [8, -62, 8], [0, -70, 9]]) d.circle(x + a, y + b, r, col); d.circle(x, y - 78, 3.4, '#ff4f6d'); d.dot(x, y - 62, 18, '#fff6c8', .2); },
  tv: (d, x, y, col) => { d.rr(x - 30, y - 22, 60, 22, 9, '#c98e5b'); for (const s of [-1, 1]) d.circle(x + s * 14, y - 11, 2.4, '#ffd23f'); d.rr(x - 24, y - 62, 48, 40, 16, col); d.rr(x - 18, y - 56, 36, 28, 11, '#cdeeff'); d.circle(x - 5, y - 44, 5, '#ffd27a', flat); d.circle(x + 6, y - 40, 4, '#ffb3c6', flat); for (const s of [-1, 1]) d.line(c => { c.moveTo(x + s * 6, y - 62); c.lineTo(x + s * 12, y - 72); }, '#8a7a86', 1.6); },
  moonBed: (d, x, y, col) => { // 초승달 머리판 + 폭신한 매트리스
    d.shape(c => { c.beginPath(); c.arc(x - 6, y - 40, 30, PI * .55, PI * 1.95, false); c.arc(x + 6, y - 46, 24, PI * 1.85, PI * .62, true); c.closePath(); }, col, [x - 8, y - 46, 28]);
    d.rr(x - 30, y - 24, 60, 24, 11, '#ffffff'); d.rr(x - 26, y - 16, 52, 16, 8, '#ffc2d6'); d.rr(x - 24, y - 28, 20, 10, 5, '#fff7ee');
    for (const [a, b, r] of [[20, -62, 2.6], [30, -48, 2], [-34, -76, 2.4]]) d.circle(x + a, y + b, r, '#fff6c8'); },
  // ===== 인형 =====
  otumoDoll: (d, x, y, col) => { // 오투모: 하얀 동그란 헬멧 머리 + 검은 바이저 + 파란 머리띠 + 노란 귀 + 하얀 몸
    const W = '#fbfbfd', Y = '#ffb627', B = '#3f6fe0';
    for (const s of [-1, 1]) oval(d, x + s * 6, y - 3, 5, 3.4, 0, '#e8e8f0');
    d.ell(x, y - 15, 11, 12, W); d.circle(x, y - 14, 4.4, '#d6dbe6', flat); d.circle(x, y - 14, 2.2, '#9aa3b4', flat);
    for (const s of [-1, 1]) { d.circle(x + s * 13, y - 16, 4.4, Y); for (const k of [-1, 0, 1]) d.circle(x + s * (16 + Math.abs(k)), y - 18 + k * 3, 1.8, Y); }
    for (const s of [-1, 1]) oval(d, x + s * 18, y - 42, 5, 7, s * .2, Y);
    d.circle(x, y - 40, 18, W);
    d.line(c => c.arc(x, y - 40, 18.5, PI * 1.08, PI * 1.92), B, 4.4);
    d.rr(x - 5, y - 58.5, 10, 4, 2, '#2b3a6a', flat);
    d.rr(x - 17, y - 42, 34, 11, 5.5, '#2b2b36');
    for (const s of [-1, 1]) { d.ell(x + s * 5.5, y - 36.5, 1.6, 2.2, '#9fe8ff', flat); d.dot(x + s * 5.5 + .5, y - 37.5, .5, '#ffffff'); }
    for (const s of [-1, 1]) d.ell(x + s * 10, y - 27, 2.2, 1.3, '#ff9fb8', flat);
    d.dot(x - 8, y - 50, 3, '#ffffff', .8); },
  bunnyDoll: (d, x, y, col) => { for (const s of [-1, 1]) d.circle(x + s * 8, y - 5, 5, col); d.ell(x, y - 14, 11, 11, col); d.rr(x - 8, y - 18, 16, 8, 4, '#ffb3c6', flat); for (const s of [-1, 1]) { oval(d, x + s * 5, y - 50, 4, 11, s * .15, col); oval(d, x + s * 5, y - 50, 2, 8, s * .15, '#ffc3d6', flat); } d.circle(x, y - 32, 12, col); dollFace(d, x, y - 31, .85); },
  pengDoll: (d, x, y, col) => { for (const s of [-1, 1]) oval(d, x + s * 6, y - 2, 4.4, 2.6, 0, '#ffb347'); d.ell(x, y - 18, 14, 17, col); d.ell(x, y - 14, 9, 11, '#ffffff', flat); for (const s of [-1, 1]) oval(d, x + s * 14, y - 18, 3.4, 8, s * -.3, col); d.circle(x, y - 34, 12, col); d.ell(x, y - 32, 9, 8, '#ffffff', flat); oval(d, x, y - 30, 2.6, 1.6, 0, '#ffb347'); dollFace(d, x, y - 33, .75); d.rr(x - 11, y - 25, 22, 4, 2, '#ff8fb0'); },
};
