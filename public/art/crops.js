// 수확 작물 아이콘 30 종 (c01..c30). (0,0) 중심, 약 -22..22 범위.
// 유아용 점토 느낌: 동글동글한 덩어리, 통통한 잎, 굵은 줄기. 가는 선·뾰족한 끝·실사 무늬는 쓰지 않아요.
const PI = Math.PI;
// 기울어진 타원 (통통한 잎·꽃잎·꼬투리)
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(c => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
// 통통한 잎: 밑동에서 각도 a 방향으로 뻗은 둥근 잎
const leaf = (d, x, y, len, wid, a, col) => oval(d, x + Math.cos(a) * len * .5, y + Math.sin(a) * len * .5, len * .5, wid, a, col);
// 굵은 줄기
const stem = (d, x, y, h, w = 3.4, col = '#6cc46a') => d.rr(x - w / 2, y, w, h, w / 2, col);
// 말랑한 반짝임
const shine = (d, x, y, r = 3) => d.dot(x, y, r, '#ffffff', .45);
// 꼭지: 둥근 잎 여러 장을 별처럼
const cap = (d, x, y, r, n, col) => { for (let i = 0; i < n; i++){ const a = -PI / 2 + (i - (n - 1) / 2) * (PI * .9 / Math.max(1, n - 1)) + PI; leaf(d, x, y, r, r * .42, a + PI, col); } d.circle(x, y, r * .38, col); };

export const ART_PART = {
  // 토마토: 동그란 빨강 + 둥근 꼭지
  c01: d => { d.circle(0, 4, 15, '#ff5a5a'); cap(d, 0, -9, 8, 5, '#5fbf4f'); stem(d, 0, -15, 6, 3, '#4fae3c'); shine(d, -6, -1, 3.4); },
  // 무순: 굵은 하얀 줄기 다발 + 동글한 떡잎 + 분홍 끈
  c02: d => { for (const [x, top] of [[-7, -9], [-2.5, -13], [2.5, -11], [7, -8]]){ d.rr(x - 1.8, top, 3.6, 30 - top - 9, 1.8, '#f6f4e4'); d.circle(x - 2.6, top - 1.5, 3.4, '#9fdc6a'); d.circle(x + 2.6, top - 1.5, 3.4, '#bfe98a'); }
    d.rr(-10, 8, 20, 6, 3, '#ff9fbf'); },
  // 래디시: 동그란 분홍 뿌리 + 작은 꼬리 + 통통한 잎
  c03: d => { leaf(d, -1, -4, 15, 5, -PI / 2 - .45, '#6cc46a'); leaf(d, 1, -4, 15, 5, -PI / 2 + .45, '#5cb85c'); leaf(d, 0, -4, 14, 4.6, -PI / 2, '#7fd07a');
    oval(d, 0, 17, 2.4, 4, 0, '#fff0f4'); d.circle(0, 5, 12, '#ff6fa0'); shine(d, -4, 1, 3.2); },
  // 상추: 동글동글 잎 덩어리
  c04: d => { for (let i = 0; i < 5; i++){ const a = PI + .3 + i * (PI - .6) / 4; d.circle(Math.cos(a) * 10, 7 + Math.sin(a) * 7, 8.5, i % 2 ? '#8fd66a' : '#7cc95a'); }
    d.circle(-8, 9, 8, '#86d064'); d.circle(8, 9, 8, '#86d064'); d.circle(0, 6, 9.5, '#a8e27f'); d.circle(0, 4, 5.5, '#c8ef9e'); },
  // 시금치: 통통한 잎 세 장 + 분홍 밑동
  c05: d => { leaf(d, 0, 12, 22, 7, -PI / 2 - .55, '#4fae3c'); leaf(d, 0, 12, 22, 7, -PI / 2 + .55, '#4fae3c'); leaf(d, 0, 12, 24, 7.5, -PI / 2, '#5cbf4a');
    d.rr(-3.5, 10, 7, 9, 3.5, '#ff8fb0'); },
  // 당근: 동그란 끝의 통통한 원뿔 + 둥근 잎
  c06: d => { leaf(d, 0, -10, 12, 4.2, -PI / 2 - .5, '#5cb85c'); leaf(d, 0, -10, 12, 4.2, -PI / 2 + .5, '#5cb85c'); leaf(d, 0, -10, 13, 4.4, -PI / 2, '#6cc46a');
    d.shape(c => { c.beginPath(); c.moveTo(-9, -8); c.quadraticCurveTo(0, -13, 9, -8); c.quadraticCurveTo(7, 10, 1.5, 19); c.quadraticCurveTo(0, 21, -1.5, 19); c.quadraticCurveTo(-7, 10, -9, -8); c.closePath(); }, '#ff9a3d', [0, 4, 12]);
    d.rr(-5, -1, 6, 2.4, 1.2, '#ffb36a', {flat: true, noShadow: true}); d.rr(-1, 6, 5, 2.4, 1.2, '#ffb36a', {flat: true, noShadow: true}); },
  // 감자: 몽글한 타원 + 작은 점 두 개
  c07: d => { oval(d, 0, 3, 17, 12.5, -.12, '#d9b07a'); d.dot(-6, 1, 1.4, '#b98a55'); d.dot(5, 6, 1.4, '#b98a55'); d.dot(8, -2, 1.2, '#b98a55'); shine(d, -6, -3, 3.4); },
  // 양파: 동그란 보라 알뿌리 + 둥근 꼭지 + 짧은 뿌리
  c08: d => { for (const x of [-3, 0, 3]) d.rr(x - 1.1, 13, 2.2, 6, 1.1, '#f3ead6'); d.circle(0, 4, 14, '#e2c4ff'); d.shape(c => { c.beginPath(); c.moveTo(-5, -7); c.quadraticCurveTo(0, -18, 1, -16); c.quadraticCurveTo(2, -14, 5, -7); c.closePath(); }, '#d6b3f7', [0, -10, 5]);
    oval(d, -4, 4, 3, 9, .1, '#ecd8ff', {flat: true, noShadow: true}); },
  // 튤립: 동그란 꽃잎 세 장 + 굵은 줄기 + 통통한 잎
  c09: d => { stem(d, 0, -2, 20); leaf(d, 0, 16, 14, 4.6, -PI / 2 - .7, '#6cc46a'); leaf(d, 0, 16, 14, 4.6, -PI / 2 + .7, '#5cb85c');
    oval(d, -5, -6, 6, 9, -.25, '#ff7fa8'); oval(d, 5, -6, 6, 9, .25, '#ff7fa8'); oval(d, 0, -5, 6, 9.5, 0, '#ff6b9a'); },
  // 완두콩: 통통한 꼬투리 + 동그란 콩 세 알
  c10: d => { oval(d, 0, 2, 19, 9, -.3, '#6fbf5c'); oval(d, 0, 1, 16, 5.5, -.3, '#4f9e44', {flat: true}); for (const i of [-1, 0, 1]){ const x = i * 9, y = 1 - i * 2.7; d.circle(x, y, 5.4, '#a8e27f'); } },
  // 옥수수: 동그란 노란 알 + 통통한 껍질 잎
  c11: d => { leaf(d, 2, 18, 30, 6.5, -PI / 2 - .35, '#7cc96a'); oval(d, 0, -2, 9, 16, 0, '#ffd84f');
    for (let r = 0; r < 4; r++) for (const x of [-4, 0, 4]) d.dot(x + (r % 2) * 1.5 - .7, -12 + r * 6, 1.9, '#ffe98a');
    leaf(d, -2, 18, 28, 6, -PI / 2 + .35, '#6cc46a'); },
  // 딸기: 동그란 하트 모양 + 노란 점 + 둥근 꼭지
  c12: d => { d.shape(c => { c.beginPath(); c.moveTo(0, 18); c.bezierCurveTo(-18, 6, -15, -10, -4, -10); c.quadraticCurveTo(0, -9, 4, -10); c.bezierCurveTo(15, -10, 18, 6, 0, 18); c.closePath(); }, '#ff5a72', [0, 3, 15]);
    for (const [x, y] of [[-6, -2], [0, 2], [6, -2], [-3, 9], [4, 9], [0, -5]]) d.dot(x, y, 1.3, '#ffe27a'); cap(d, 0, -10, 7, 5, '#5fbf4f'); shine(d, -7, -3, 2.8); },
  // 데이지: 동그란 하얀 꽃잎 + 노란 가운데 + 굵은 줄기
  c13: d => { stem(d, 0, 4, 16); for (let i = 0; i < 8; i++){ const a = i * PI / 4; d.circle(Math.cos(a) * 9.5, -4 + Math.sin(a) * 9.5, 5.4, '#ffffff'); } d.circle(0, -4, 6.5, '#ffd84f'); },
  // 블루베리: 동그란 열매 세 알 + 작은 왕관 + 잎
  c14: d => { leaf(d, 2, -10, 12, 4.4, -.6, '#6cc46a'); for (const [x, y] of [[-7, 6], [7, 6], [0, -4]]){ d.circle(x, y, 9, '#5b6bd6'); d.circle(x, y - 6, 2.6, '#3e4bb0', {flat: true}); shine(d, x - 3, y - 2, 2.2); } },
  // 고구마: 통통한 자주 타원
  c15: d => { oval(d, 0, 2, 19, 10, -.35, '#c06a8e'); d.circle(16, -5, 3, '#ffe9a8'); shine(d, -6, -2, 3.2); },
  // 오이: 동그란 끝의 통통한 막대 + 노란 꽃 방울
  c16: d => { d.shape(c => { c.beginPath(); c.ellipse(0, 2, 20, 8, -.6, 0, PI * 2); }, '#5cb85c', [0, 2, 18]); for (const [x, y] of [[-8, 9], [-2, 4], [4, -1], [9, -6]]) d.dot(x, y, 1.6, '#9fdc8a'); d.circle(14, -11, 3.6, '#ffd84f'); },
  // 파프리카: 몽글몽글 세 덩이 + 초록 꼭지
  c17: d => { d.circle(-6, 6, 9.5, '#ff7a3d'); d.circle(6, 6, 9.5, '#ff7a3d'); d.circle(0, 4, 10.5, '#ff8a4f'); d.rr(-6, -8, 12, 5, 2.5, '#4fae3c'); stem(d, 0, -14, 7, 3.2, '#3f9e32'); shine(d, -4, 1, 3); },
  // 장미: 겹겹이 동그란 꽃 + 통통한 잎 + 줄기
  c18: d => { stem(d, 0, 4, 16, 3.4, '#4fae3c'); leaf(d, 0, 12, 10, 4.2, -PI + .5, '#5cb85c'); leaf(d, 0, 12, 10, 4.2, -.5, '#5cb85c');
    for (let i = 0; i < 5; i++){ const a = -PI / 2 + i * PI * 2 / 5; d.circle(Math.cos(a) * 7, -4 + Math.sin(a) * 7, 7, '#ff4f6d'); } d.circle(0, -4, 7.5, '#ff6a85'); d.circle(0, -4, 3.8, '#e8435f'); },
  // 브로콜리: 동글동글 꽃송이 + 굵은 줄기
  c19: d => { d.rr(-5, 2, 10, 17, 5, '#a8dc8f'); for (const [x, y, r] of [[-10, -2, 7.5], [10, -2, 7.5], [-5, -9, 8], [5, -9, 8], [0, -1, 8.5]]) d.circle(x, y, r, '#4fae46'); for (const [x, y] of [[-6, -10], [5, -11], [-1, -3]]) d.dot(x, y, 1.6, '#7fd06a'); },
  // 해바라기: 동그란 노란 꽃잎 + 큰 갈색 가운데 + 통통한 잎
  c20: d => { stem(d, 0, 6, 15, 3.6, '#5cb85c'); leaf(d, 0, 15, 10, 4.2, -PI + .4, '#6cc46a'); leaf(d, 0, 15, 10, 4.2, -.4, '#6cc46a');
    for (let i = 0; i < 10; i++){ const a = i * PI / 5; oval(d, Math.cos(a) * 11, -4 + Math.sin(a) * 11, 5.4, 3.8, a, '#ffcf3f'); } d.circle(0, -4, 8.5, '#9a5a3b'); for (const [x, y] of [[-3, -6], [3, -6], [0, -1]]) d.dot(x, y, 1.4, '#b87a52'); },
  // 호박: 몽글한 세 덩이 + 굵은 꼭지 + 둥근 잎
  c21: d => { oval(d, -8, 5, 9, 12, 0, '#ff9a3d'); oval(d, 8, 5, 9, 12, 0, '#ff9a3d'); oval(d, 0, 5, 9.5, 13, 0, '#ffa850'); d.rr(-2, -11, 4, 7, 2, '#7a9a3a'); leaf(d, 1, -9, 10, 4, -.5, '#6cc46a'); shine(d, -4, -1, 3); },
  // 수박: 동그란 초록 + 굵은 줄무늬 + 동글한 조각
  c22: d => { d.circle(-3, 0, 15, '#4fb86a'); for (const x of [-11, -3, 5]) oval(d, x, 0, 2.6, 13, 0, '#2f8a4a', {flat: true}); shine(d, -9, -6, 3);
    d.shape(c => { c.beginPath(); c.moveTo(4, 8); c.arc(12, 8, 9, 0, PI); c.closePath(); }, '#7fd06a', [12, 12, 8]); d.shape(c => { c.beginPath(); c.moveTo(5.5, 8); c.arc(12, 8, 7.2, 0, PI); c.closePath(); }, '#ff6b7a', [12, 11, 7], {flat: true}); for (const x of [9, 12, 15]) d.dot(x, 11, 1, '#3a2a2a'); },
  // 멜론: 동그란 연두 + 부드러운 그물 무늬 + T 꼭지
  c23: d => { d.circle(0, 3, 15, '#c9e88a'); for (const [x, y] of [[-6, -4], [4, -6], [-9, 6], [1, 4], [9, 4], [-3, 12], [6, 12]]) d.circle(x, y, 2.2, '#e4f6bf', {flat: true, noShadow: true}); d.rr(-4, -15, 8, 3, 1.5, '#7a9a3a'); stem(d, 0, -14, 4, 3, '#7a9a3a'); shine(d, -6, -4, 3); },
  // 파인애플: 통통한 몸통 + 점 + 통통한 잎 왕관
  c24: d => { for (const [a, l] of [[-PI / 2 - .5, 11], [-PI / 2, 13], [-PI / 2 + .5, 11]]) leaf(d, 0, -9, l, 4, a, '#5cb85c'); oval(d, 0, 6, 11, 14, 0, '#ffc94f');
    for (let r = 0; r < 3; r++) for (const x of [-5, 0, 5]) d.dot(x + (r % 2) * 2.5 - 1.2, -1 + r * 6, 1.5, '#e0a63a'); shine(d, -5, 0, 2.8); },
  // 바닐라: 통통한 갈색 꼬투리 두 개 + 분홍 리본 + 동그란 꽃
  c25: d => { oval(d, -3, 3, 3.6, 17, -.2, '#7a4a2c'); oval(d, 4, 3, 3.6, 17, .25, '#8a5a3b'); d.rr(-7, 6, 14, 5, 2.5, '#ff9fbf');
    for (let i = 0; i < 5; i++){ const a = i * PI * 2 / 5 - PI / 2; d.circle(10 + Math.cos(a) * 3.6, -12 + Math.sin(a) * 3.6, 3, '#fff6dc'); } d.circle(10, -12, 2, '#ffd84f'); },
  // 라벤더: 동글동글 보라 송이 + 굵은 줄기 + 리본
  c26: d => { for (const x of [-5, 0, 5]) stem(d, x, -4, 22, 2.6, '#7cc96a');
    for (const x of [-5, 0, 5]) for (let k = 0; k < 4; k++) d.circle(x + (k % 2 ? 1.6 : -1.6), -14 + k * 4.4 - (x === 0 ? 3 : 0), 3.4, k % 2 ? '#a77bff' : '#b994ff'); d.rr(-7, 9, 14, 5, 2.5, '#ff9fbf'); },
  // 카카오: 통통한 갈색 꼬투리 + 동그란 콩
  c27: d => { oval(d, 0, 0, 10, 17, .25, '#9a5a3b'); oval(d, -1, 0, 3, 13, .25, '#b87a52', {flat: true}); d.rr(1, -19, 3.4, 5, 1.7, '#6b8a3a'); for (const [x, y] of [[-12, 13], [-7, 16]]) d.circle(x, y, 3.6, '#fff1dc'); },
  // 커피콩: 통통한 콩 두 알 + 동그란 빨간 열매 + 잎
  c28: d => { for (const [x, y] of [[-9, -9], [-4, -4], [-11, -2]]) d.circle(x, y, 4.6, '#e8434f'); leaf(d, -6, -12, 11, 4, -.4, '#6cc46a');
    for (const [x, y, r] of [[5, 8, .4], [12, 4, -.3]]){ oval(d, x, y, 6, 8, r, '#7a4a2c'); oval(d, x, y, 1.2, 6, r, '#5a3420', {flat: true, noShadow: true}); } },
  // 사탕수수: 통통한 분홍 마디 막대 세 개 + 초록 끈 + 잎
  c29: d => { leaf(d, 0, -14, 12, 3.8, -PI / 2 - .6, '#7cc96a'); leaf(d, 0, -14, 12, 3.8, -PI / 2 + .5, '#6cc46a');
    for (const x of [-6, 0, 6]){ d.rr(x - 3, -16, 6, 34, 3, x ? '#ffb3d9' : '#ffc2e0'); for (const y of [-6, 4]) d.rr(x - 3.4, y, 6.8, 2.4, 1.2, '#f39ac4', {flat: true, noShadow: true}); } d.rr(-10, 9, 20, 5, 2.5, '#7cc96a'); },
  // 황금딸기: 동그란 금빛 딸기 + 반짝이 방울
  c30: d => { d.shape(c => { c.beginPath(); c.moveTo(0, 18); c.bezierCurveTo(-18, 6, -15, -10, -4, -10); c.quadraticCurveTo(0, -9, 4, -10); c.bezierCurveTo(15, -10, 18, 6, 0, 18); c.closePath(); }, '#ffd23f', [0, 3, 15]);
    for (const [x, y] of [[-6, -2], [0, 2], [6, -2], [-3, 9], [4, 9]]) d.dot(x, y, 1.3, '#fff3b0'); cap(d, 0, -10, 7, 5, '#5fbf4f'); shine(d, -7, -3, 3);
    for (const [x, y, r] of [[-15, -12, 2.4], [16, -8, 2], [15, 12, 1.8]]) d.circle(x, y, r, '#fff6c8'); },
};
