// 물고기 그림 f01..f25 (오른쪽을 바라보는 옆모습, 폭 약 40)
const INK = '#2b2233', WHITE = '#ffffff', BLUSH = '#ff8fa8';

const eye = (d, x, y, r = 2) => {
  d.dot(x, y, r, WHITE);
  d.dot(x + r * 0.2, y, r * 0.62, INK);
  d.dot(x + r * 0.45, y - r * 0.35, r * 0.25, WHITE);
};
const blush = (d, x, y, r = 1.6) => d.dot(x, y, r, BLUSH, 0.45);
const smile = (d, x, y, s = 1.4, col = INK) =>
  d.line(c => { c.moveTo(x - s, y - s * 0.3); c.quadraticCurveTo(x - s * 0.2, y + s * 0.6, x + s * 0.2, y - s * 0.1); }, col, 0.8);
// 갈라진 꼬리 (x = 붙는 곳, 왼쪽으로 뻗음)
const forkTail = (d, x, y, w, h, col, notch = 0.5) => {
  const c = d.ctx;
  d.shape(() => { c.beginPath(); c.moveTo(x + 2, y - 1.5); c.lineTo(x - w, y - h); c.quadraticCurveTo(x - w * (1 - notch), y, x - w, y + h); c.lineTo(x + 2, y + 1.5); c.closePath(); }, col, [x - w / 2, y, h]);
};
// 둥근 부채꼴 꼬리
const roundTail = (d, x, y, w, h, col) => {
  const c = d.ctx;
  d.shape(() => { c.beginPath(); c.moveTo(x + 2, y - 1.2); c.lineTo(x - w * 0.7, y - h); c.quadraticCurveTo(x - w * 1.2, y, x - w * 0.7, y + h); c.lineTo(x + 2, y + 1.2); c.closePath(); }, col, [x - w / 2, y, h]);
};
// 자유 지느러미 (점 목록)
const poly = (d, pts, col) => {
  const c = d.ctx;
  let sx = 0, sy = 0; for (const [x, y] of pts) { sx += x; sy += y; }
  d.shape(() => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); }, col, [sx / pts.length, sy / pts.length, 6]);
};
// 비늘 무늬 (작은 호)
const scales = (d, x0, x1, y0, y1, step, col, alpha = 0.5) => {
  d.stitch(c => {
    let row = 0;
    for (let y = y0; y <= y1; y += step * 0.8, row++) {
      for (let x = x0 + (row % 2) * step / 2; x <= x1; x += step) { c.moveTo(x + step / 2, y); c.arc(x, y, step / 2, 0, Math.PI * 0.9); }
    }
  }, col, alpha);
};

export const ART_PART = {
  // 송사리: 아주 작고 투명한 몸, 큰 눈, 등이 평평, 뒤쪽 뒷지느러미 길게
  f01: (d) => {
    const col = '#c9d3dd';
    forkTail(d, -9, 1, 6, 4.5, '#b3c0cc', 0.2);
    poly(d, [[-8, 3], [3, 3.5], [-4, 7.5], [-9, 6]], '#b3c0cc');
    poly(d, [[-6, -3.5], [-3, -3.5], [-6, -6.5]], '#b3c0cc');
    d.ell(1, 1, 11, 4.6, col);
    d.line(c => { c.moveTo(-8, 0.5); c.lineTo(8, 0.5); }, '#9fb3c2', 0.7);
    d.dot(4, 3.2, 1.6, '#e8eef4', 0.8);
    eye(d, 7.5, -0.2, 2.6);
    blush(d, 7, 2.6, 1.1);
  },
  // 피라미: 날씬, 혼인색 분홍 옆구리와 청록 가로띠, 큰 뒷지느러미
  f02: (d) => {
    const col = '#9fc4d8';
    forkTail(d, -12, 0, 8, 6, '#8ab3c8', 0.45);
    poly(d, [[-6, 3.5], [2, 4], [-3, 11], [-8, 9]], '#ff9fb3');
    poly(d, [[-3, -4.5], [3, -4.5], [-2, -10]], '#8ab3c8');
    d.ell(2, 0, 15, 5.4, col);
    d.ell(1, 2.5, 11, 2.2, '#ffb3c6');
    for (const x of [-7, -3, 1, 5]) d.dot(x, -1, 1.3, '#4f8fa8', 0.7);
    d.ell(9, 2.5, 3, 1.2, '#ff8fa8');
    eye(d, 11, -1, 2.2);
    smile(d, 15, 1, 1);
  },
  // 붕어: 둥근 몸, 굵은 비늘, 갈색빛, 꼬리 살짝 갈라짐
  f03: (d) => {
    const col = '#b5a06a';
    forkTail(d, -10, 0, 9, 8, '#9e8a55', 0.35);
    poly(d, [[-8, -7], [5, -10], [4, -13], [-6, -12]], '#9e8a55');
    poly(d, [[-5, 8], [1, 9], [-3, 12]], '#9e8a55');
    d.ell(1, 0, 13, 10, col);
    scales(d, -8, 6, -5, 6, 4, '#7d6c3f', 0.55);
    d.ell(9, 0, 5, 7.5, '#c4b07c');
    d.line(c => { c.moveTo(6.5, -6); c.quadraticCurveTo(4.5, 0, 6.5, 6); }, '#8a7748', 1);
    eye(d, 9.5, -2, 2.4);
    smile(d, 13.4, 2, 1.1);
    blush(d, 9, 3, 1.4);
  },
  // 버들치: 가늘고 긴 원통형, 둥근 꼬리, 짙은 세로 가운데 줄, 작은 점들
  f04: (d) => {
    const col = '#a8b98f';
    roundTail(d, -12, 0, 8, 5.5, '#93a479');
    poly(d, [[-3, -4], [3, -4], [0, -9]], '#93a479');
    poly(d, [[-6, 3.5], [-1, 4], [-5, 8]], '#93a479');
    d.ell(2, 0, 15, 5, col);
    d.ell(2, 1.8, 13, 2.2, '#d4dfc0');
    d.line(c => { c.moveTo(-12, 0); c.lineTo(12, -0.5); }, '#5e6e48', 1.4);
    for (const [x, y] of [[-8, -2.5], [-3, -3], [3, -3], [7, -2.6], [-5, 2.5], [1, 2.6]]) d.dot(x, y, 0.8, '#6e7f55', 0.8);
    eye(d, 11.5, -1.2, 2.1);
    smile(d, 16, 1, 1);
  },
  // 납자루: 납작하고 높은 마름모꼴, 분홍·보라 혼인색, 꼬리자루 검은 줄, 지느러미 붉은 테
  f05: (d) => {
    const col = '#ff9fb3';
    forkTail(d, -10, 0, 7, 6, '#ff8fa8', 0.4);
    poly(d, [[-8, -6], [4, -9], [1, -13], [-6, -11]], '#ff8fa8');
    poly(d, [[-8, 6], [3, 8], [-1, 12], [-7, 10]], '#ff8fa8');
    d.line(c => { c.moveTo(-6, -11); c.lineTo(1, -13); c.moveTo(-7, 10); c.lineTo(-1, 12); }, '#e0405e', 1.3);
    d.ell(1, 0, 12, 9, col);
    d.ell(2, -3, 9, 4, '#c9a6ff');
    d.line(c => { c.moveTo(-12, 0); c.lineTo(-1, 0); }, '#6a3f7a', 1.6);
    d.dot(6, -2, 1.5, '#7ab8ff', 0.8);
    eye(d, 8, -2, 2.3);
    smile(d, 12.4, 1.5, 1);
    blush(d, 8, 2.5, 1.3);
  },
  // 미꾸라지: 아주 가늘고 긴 몸, 입 수염 여러 가닥, 둥근 꼬리, 얼룩점
  f06: (d) => {
    const col = '#8a7a5a';
    const c = d.ctx;
    roundTail(d, -18, 0.5, 4, 3.5, '#75664a');
    d.shape(() => { c.beginPath(); c.moveTo(-19, -1.5); c.quadraticCurveTo(-4, -5, 12, -4); c.quadraticCurveTo(18, -3.5, 18, 0.5); c.quadraticCurveTo(17, 3.5, 12, 3.5); c.quadraticCurveTo(-4, 4, -19, 2); c.closePath(); }, col, [0, -1, 12]);
    d.ell(2, 2, 13, 1.3, '#b3a47f');
    for (const [x, y] of [[-14, -0.5], [-10, -1.8], [-6, 0], [-2, -2], [2, -0.3], [6, -2], [9, 0]]) d.dot(x, y, 0.9, '#5a4c32', 0.75);
    poly(d, [[-4, -3.8], [0, -4], [-3, -6.5]], '#75664a');
    d.line(c => { c.moveTo(17.5, 1.5); c.quadraticCurveTo(21, 3, 21, 6); c.moveTo(17, 2); c.quadraticCurveTo(19, 5, 17.5, 7); c.moveTo(17.8, 1); c.quadraticCurveTo(21.5, 0.5, 21.5, -1.5); }, '#5a4c32', 0.8);
    eye(d, 14.5, -1.3, 1.5);
  },
  // 블루길: 높고 둥근 원반형, 아가미 뚜껑의 검푸른 귀점, 세로 줄무늬, 주황 배
  f07: (d) => {
    const col = '#5b8cff';
    forkTail(d, -10, 0, 7, 7, '#4a78e0', 0.3);
    poly(d, [[-9, -7], [6, -11], [2, -15], [-4, -14], [-8, -11]], '#4a78e0');
    d.line(c => { for (const x of [-6, -3, 0]) { c.moveTo(x, -10); c.lineTo(x - 0.5, -13.5); } }, '#3a5fbf', 0.8);
    poly(d, [[-7, 7], [3, 9], [-3, 13]], '#4a78e0');
    d.ell(1, 0, 12, 11, col);
    d.ell(2, 6, 8, 3.5, '#ffb066');
    d.stitch(c => { for (const x of [-7, -3, 1, 5]) { c.moveTo(x, -9); c.lineTo(x - 1, 8); } }, '#3a5fbf', 0.6);
    d.ell(6, 0, 2.6, 2.2, '#1e2a5a');
    eye(d, 9, -3, 2.3);
    smile(d, 12.4, 1, 0.9);
    blush(d, 9.5, 2, 1.2);
  },
  // 잉어: 크고 묵직한 몸, 큰 비늘 그물무늬, 입 수염 2 쌍, 긴 등지느러미
  f08: (d) => {
    const col = '#d9a46f';
    forkTail(d, -13, 0, 8, 8, '#c48d58', 0.4);
    poly(d, [[-10, -6], [4, -8], [2, -12], [-9, -10]], '#c48d58');
    poly(d, [[-6, 6], [0, 7], [-4, 11]], '#c48d58');
    d.ell(1, 0, 15, 8.5, col);
    scales(d, -11, 6, -5, 5, 5, '#9e6a3a', 0.6);
    d.line(c => { c.moveTo(-12, 0.5); c.lineTo(8, 0.5); }, '#b07a48', 0.8);
    d.ell(11, 0.5, 5, 6.5, '#e6b685');
    eye(d, 11.5, -2, 2.3);
    d.line(c => { c.moveTo(15.5, 2.2); c.quadraticCurveTo(18, 4, 18.5, 6.5); c.moveTo(16, 1.5); c.quadraticCurveTo(19.5, 2, 20, 3.5); }, '#9e6a3a', 0.9);
    d.dot(16, 1.5, 1, '#9e6a3a');
    blush(d, 11, 3.2, 1.3);
  },
  // 배스: 큰 입(턱이 눈 뒤까지), 옆줄 짙은 얼룩 띠, 가시 등지느러미 두 개
  f09: (d) => {
    const col = '#6a8f4a';
    forkTail(d, -13, 0, 8, 7, '#587c3c', 0.35);
    poly(d, [[-9, -6], [-5, -12], [-1, -11], [1, -7]], '#587c3c');
    d.line(c => { for (const x of [-7, -5, -3]) { c.moveTo(x, -7); c.lineTo(x + 0.5, -11.5); } }, '#3e5a28', 0.7);
    poly(d, [[0, -7], [4, -11], [7, -6]], '#587c3c');
    poly(d, [[-6, 6], [1, 6.5], [-3, 10]], '#587c3c');
    d.ell(1, 0, 15, 8, col);
    d.ell(2, 4.5, 12, 3, '#d8e6b8');
    for (const [x, y] of [[-10, 0], [-6, -0.5], [-2, 0.3], [2, -0.4], [6, 0]]) d.ell(x, y, 2.4, 1.6, '#34502a');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(16.5, 0); c.lineTo(9, 1.3); c.lineTo(16, 3.5); c.closePath(); }, '#2e3a22', [13, 1.5, 3]);
    d.line(c => { c.moveTo(16.5, 0); c.lineTo(8.5, 1.3); c.lineTo(15.5, 3.5); }, '#2e3a22', 1);
    eye(d, 11, -2.6, 2.3);
  },
  // 무지개송어: 유선형, 옆구리 분홍 띠, 몸·꼬리 전체에 검은 점
  f10: (d) => {
    const col = '#c9d8c0';
    forkTail(d, -13, 0, 8, 7, '#b3c4a8', 0.25);
    poly(d, [[-4, -6], [2, -6.5], [-1, -11]], '#b3c4a8');
    poly(d, [[-9, -5], [-7.5, -5.5], [-8.5, -8]], '#b3c4a8');
    poly(d, [[-6, 6], [0, 6.5], [-3, 10]], '#b3c4a8');
    d.ell(1, 0, 15, 7.5, col);
    d.ell(1, 4, 12, 2.6, '#f4f6ee');
    d.ell(1, 0.8, 14, 2.4, '#ff9fc4');
    d.ell(11, 0.5, 3, 2.4, '#ff8fb8');
    for (const [x, y] of [[-10, -3], [-7, -4.5], [-4, -2.5], [-1, -4.6], [2, -3], [5, -4.4], [8, -3], [-8, 3], [-3, 3.5], [3, 3.5], [-17, -3], [-18, 2], [-15.5, 4], [-16, -5]]) d.dot(x, y, 0.75, INK, 0.8);
    eye(d, 12, -2.2, 2.2);
    smile(d, 15.6, 1.5, 1);
  },
  // 산천어: 은빛 연어형, 옆구리 타원형 파마크(세로 얼룩) 줄, 작은 기름지느러미
  f11: (d) => {
    const col = '#9fd6ff';
    forkTail(d, -13, 0, 8, 6.5, '#86c2ee', 0.3);
    poly(d, [[-3, -6], [3, -6.5], [0, -11]], '#86c2ee');
    d.ell(-9, -5.5, 1.8, 1.4, '#86c2ee');
    poly(d, [[-6, 6], [0, 6], [-3, 9.5]], '#86c2ee');
    d.ell(1, 0, 15, 7, col);
    d.ell(1, 3.8, 12, 2.6, '#e8f6ff');
    for (const x of [-9, -4.5, 0, 4.5, 8.5]) d.ell(x, 0, 1.7, 3.6, '#5b7fa8');
    for (const [x, y] of [[-6.5, -4], [-2, -4.5], [2.5, -4.5], [6.5, -4]]) d.dot(x, y, 0.7, INK, 0.7);
    for (const [x, y] of [[-6.5, 3], [2, 3]]) d.dot(x, y, 0.6, '#ff6b8a', 0.8);
    eye(d, 12, -1.8, 2.2);
    smile(d, 15.6, 1.5, 1);
    blush(d, 11.5, 2.4, 1.2);
  },
  // 메기: 넓적한 머리, 큰 입, 긴 수염 두 쌍, 꼬리 쪽 길고 납작, 짧은 등지느러미
  f12: (d) => {
    const col = '#5b5266';
    const c = d.ctx;
    roundTail(d, -15, 1, 5, 4.5, '#4a4255');
    poly(d, [[-14, 3.5], [2, 5], [-2, 8.5], [-13, 6.5]], '#4a4255');
    d.shape(() => { c.beginPath(); c.moveTo(-16, -1); c.quadraticCurveTo(-4, -6, 8, -7); c.quadraticCurveTo(17, -7, 17, 0.5); c.quadraticCurveTo(16, 5, 8, 5); c.quadraticCurveTo(-4, 5.5, -16, 3); c.closePath(); }, col, [2, -2, 12]);
    d.ell(4, 3.5, 11, 1.8, '#8a8296');
    poly(d, [[0, -6.5], [3, -6.8], [1, -10]], '#4a4255');
    d.line(c => { c.moveTo(9, 2.5); c.quadraticCurveTo(13, 3.6, 17, 2); }, '#2a2433', 1);
    d.line(c => { c.moveTo(15, -3); c.quadraticCurveTo(20, -8, 21, -2); c.moveTo(16.5, 1.5); c.quadraticCurveTo(21, 4, 19, 9); c.moveTo(14, 3.5); c.quadraticCurveTo(15, 7, 12, 9); }, '#2a2433', 0.9);
    eye(d, 12, -3.2, 1.5);
    blush(d, 10, 0.5, 1.4);
  },
  // 쏘가리: 노란 몸에 표범 같은 둥근 무늬, 날카로운 가시 등지느러미, 큰 입
  f13: (d) => {
    const col = '#e8b84f';
    roundTail(d, -12, 0, 7, 7, '#d4a03c');
    poly(d, [[-11, -5], [-9, -12], [-6, -9], [-4, -13], [-1, -9], [1, -13], [3, -8], [5, -6]], '#d4a03c');
    poly(d, [[-6, 6], [0, 6.5], [-3, 11]], '#d4a03c');
    d.ell(1, 0, 14, 8.5, col);
    d.ell(2, 4.5, 11, 3, '#f6dc96');
    for (const [x, y, r] of [[-8, -3, 1.8], [-4, 1, 1.6], [-1, -4, 1.7], [3, 0, 1.5], [6, -4, 1.3], [-9, 3, 1.3], [1, 4, 1.2], [9, 1, 1]]) { d.dot(x, y, r, '#6b4a1f', 0.85); d.dot(x, y, r * 0.45, '#e8b84f', 0.7); }
    d.line(c => { c.moveTo(-2, -4); c.lineTo(12, -3); }, '#6b4a1f', 0.8);
    d.line(c => { c.moveTo(15, 0.5); c.lineTo(9.5, 1.5); c.lineTo(14, 3.5); }, '#6b4a1f', 1);
    eye(d, 10.5, -2.5, 2.2);
  },
  // 뱀장어: 아주 긴 S자 물결 몸, 끝까지 이어진 지느러미, 작은 머리
  f14: (d) => {
    const col = '#4a5a4a';
    const pts = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24; const x = -20 + t * 37; pts.push([x, Math.sin(t * Math.PI * 2.2) * 4 * (1 - t * 0.6)]); }
    const half = (t) => 1.2 + 2.8 * Math.sin(Math.min(1, t * 1.3) * Math.PI * 0.5);
    d.line(c => { c.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts) c.lineTo(x, y - half((x + 20) / 37) - 1.2); }, '#3a4a3a', 1.6);
    d.line(c => { c.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts) c.lineTo(x, y + half((x + 20) / 37) + 1.2); }, '#3a4a3a', 1.6);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts) c.lineTo(x, y - half((x + 20) / 37)); c.quadraticCurveTo(21, pts[24][1], pts[24][0], pts[24][1] + half(1)); for (let i = 24; i >= 0; i--) { const [x, y] = pts[i]; c.lineTo(x, y + half((x + 20) / 37)); } c.closePath(); }, col, [0, 0, 18]);
    d.line(c => { c.moveTo(pts[3][0], pts[3][1] + 1.5); for (let i = 4; i <= 20; i++) c.lineTo(pts[i][0], pts[i][1] + 2); }, '#c9d3a8', 1.2);
    poly(d, [[11, 2], [13, 3.5], [10.5, 5]], '#3a4a3a');
    eye(d, 15.5, pts[24][1] - 1.5, 1.4);
    smile(d, 19, pts[24][1] + 1, 0.8);
  },
  // 황금잉어: 금빛 잉어, 반짝이, 수염, 지느러미 길게 하늘하늘
  f15: (d) => {
    const col = '#ffd23f';
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-10, -1); c.quadraticCurveTo(-16, -10, -21, -7); c.quadraticCurveTo(-17, 0, -21, 8); c.quadraticCurveTo(-15, 9, -10, 1); c.closePath(); }, '#ffb81f', [-15, 0, 8]);
    poly(d, [[-9, -6], [4, -8], [1, -14], [-6, -13]], '#ffb81f');
    poly(d, [[-4, 6], [2, 7], [-2, 12]], '#ffb81f');
    d.ell(1, 0, 13, 8.5, col);
    scales(d, -9, 5, -5, 5, 4.5, '#d69a1f', 0.55);
    d.ell(9, 0.5, 4.5, 6, '#ffe680');
    eye(d, 9.5, -2, 2.3);
    d.line(c => { c.moveTo(13.5, 2); c.quadraticCurveTo(16, 4, 16.5, 7); c.moveTo(14, 1.3); c.quadraticCurveTo(17, 1.5, 18, 3.5); }, '#c4861a', 0.9);
    blush(d, 9, 3.3, 1.3);
    for (const [x, y, r] of [[-4, -12, 2], [14, -9, 1.6], [-18, 10, 1.4]]) {
      d.line(c => { c.moveTo(x - r, y); c.lineTo(x + r, y); c.moveTo(x, y - r); c.lineTo(x, y + r); }, WHITE, 0.9);
      d.dot(x, y, r * 0.35, WHITE);
    }
    d.dot(-2, -3, 1.4, WHITE, 0.8);
  },
  // 철갑상어: 뾰족한 주둥이, 등·옆의 골판 줄, 위로 긴 비대칭 꼬리, 아래 수염
  f16: (d) => {
    const col = '#7a8a9a';
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-13, -1); c.lineTo(-21, -9); c.quadraticCurveTo(-19, -1, -17, 3); c.lineTo(-13, 2); c.closePath(); }, '#66778a', [-17, -2, 6]);
    d.shape(() => { c.beginPath(); c.moveTo(-14, -1); c.quadraticCurveTo(-2, -7, 10, -4.5); c.quadraticCurveTo(17, -3, 22, -0.5); c.quadraticCurveTo(16, 2, 10, 3.5); c.quadraticCurveTo(-2, 5.5, -14, 2); c.closePath(); }, col, [0, -2, 14]);
    d.ell(0, 2.8, 11, 1.4, '#b9c4cf');
    poly(d, [[-8, -4], [-5, -4.5], [-8, -8]], '#66778a');
    poly(d, [[-4, 4], [0, 4], [-3, 7]], '#66778a');
    for (const x of [-10, -6, -2, 2, 6]) d.tri([[x - 1.4, -4.8 + (x > 0 ? -0.6 : 0)], [x, -7 + (x > 0 ? -0.6 : 0)], [x + 1.4, -4.8 + (x > 0 ? -0.6 : 0)]], '#d4dce4');
    for (const x of [-10, -6.5, -3, 0.5, 4]) d.tri([[x - 1.1, 0], [x, -1.4], [x + 1.1, 0]], '#d4dce4');
    for (const x of [14, 15.5, 17]) d.line(c => { c.moveTo(x, 1.8); c.lineTo(x - 0.3, 4.5); }, '#4a5866', 0.7);
    eye(d, 11.5, -2, 1.6);
  },
  // 정어리: 날씬한 은색, 푸른 등, 옆구리에 검은 점 한 줄
  f17: (d) => {
    const col = '#a7c4d6';
    forkTail(d, -12, 0, 7, 5.5, '#8fb0c4', 0.55);
    poly(d, [[-3, -4], [2, -4.5], [-1, -8]], '#8fb0c4');
    d.ell(2, 0, 14, 5, col);
    d.ell(2, -2.6, 12, 2.2, '#4f78a8');
    d.ell(2, 2.4, 11, 2, '#eef4f8');
    for (const x of [-7, -4, -1, 2, 5]) d.dot(x, 0.2, 0.9, '#2b3a55', 0.85);
    d.dot(-8, 2, 1, WHITE, 0.6);
    eye(d, 11, -0.6, 2);
    smile(d, 15.2, 1, 0.9);
  },
  // 전갱이: 방추형, 꼬리 쪽 옆줄의 모비늘(가시 비늘) 줄, 아가미 검은 점, 노란 꼬리
  f18: (d) => {
    const col = '#b9d3e0';
    forkTail(d, -12, 0, 8, 7, '#e0c96a', 0.45);
    poly(d, [[-6, -5], [-2, -5.5], [-5, -10]], '#9fbccc');
    poly(d, [[-1, -6], [6, -5], [0, -9]], '#9fbccc');
    poly(d, [[-8, 4.5], [2, 5], [-5, 8.5]], '#9fbccc');
    d.ell(1, 0, 14, 7, col);
    d.ell(1, -3.5, 12, 2.4, '#7aa0b8');
    d.line(c => { c.moveTo(-13, 0.5); c.lineTo(-2, 0.5); c.quadraticCurveTo(5, 0.5, 9, -3); }, '#7a8f9f', 1);
    for (let x = -12; x <= -2; x += 2) d.tri([[x - 0.9, 1.4], [x, -0.4], [x + 0.9, 1.4]], '#e8eef4');
    d.dot(8, -2.5, 1.2, '#2b3a55', 0.85);
    eye(d, 11, -1.2, 2.2);
    smile(d, 14.6, 1.6, 1);
    blush(d, 10.5, 2.4, 1.2);
  },
  // 고등어: 날렵한 방추형, 등에 짙은 물결 줄무늬, 꼬리 앞 작은 토막지느러미들
  f19: (d) => {
    const col = '#5b8cff';
    forkTail(d, -13, 0, 8, 7, '#4a78e0', 0.55);
    poly(d, [[-4, -5], [1, -5.5], [-2, -9]], '#4a78e0');
    for (const x of [-11, -9, -7]) { d.tri([[x - 0.8, -3.4], [x, -5], [x + 0.8, -3.4]], '#4a78e0'); d.tri([[x - 0.8, 3.4], [x, 5], [x + 0.8, 3.4]], '#4a78e0'); }
    d.ell(1, 0, 15, 6.5, col);
    d.ell(1, 2.8, 13, 3, '#e8f0ff');
    d.line(c => { for (let x = -9; x <= 7; x += 3) { c.moveTo(x, -5.5); c.quadraticCurveTo(x + 2, -3.5, x, -1.5); c.quadraticCurveTo(x - 1.5, -0.2, x + 0.5, 0.5); } }, '#1e3a8a', 1);
    eye(d, 11.5, -1.3, 2.1);
    smile(d, 15.4, 1.2, 1);
  },
  // 꽁치: 바늘처럼 가늘고 긴 몸, 뾰족한 주둥이(노란 끝), 꼬리 앞 토막지느러미
  f20: (d) => {
    const col = '#7c86d6';
    const c = d.ctx;
    forkTail(d, -17, 0, 4.5, 4, '#6a74c4', 0.4);
    for (const x of [-15.5, -14, -12.5]) { d.tri([[x - 0.6, -1.8], [x, -3], [x + 0.6, -1.8]], '#6a74c4'); d.tri([[x - 0.6, 1.8], [x, 3], [x + 0.6, 1.8]], '#6a74c4'); }
    d.shape(() => { c.beginPath(); c.moveTo(-17, -1); c.quadraticCurveTo(0, -4, 14, -1.5); c.lineTo(20, 0); c.lineTo(14, 1.5); c.quadraticCurveTo(0, 4, -17, 1); c.closePath(); }, col, [0, -1, 10]);
    d.shape(() => { c.beginPath(); c.moveTo(-15, 0.5); c.quadraticCurveTo(0, 3.6, 13, 1.2); c.quadraticCurveTo(0, 1.4, -15, 0.5); c.closePath(); }, '#e8eef4', [0, 1.5, 8]);
    d.line(c => { c.moveTo(-15, 0.2); c.lineTo(12, 0.2); }, '#c9d3dd', 0.6);
    d.tri([[17.5, -0.6], [21, 0], [17.5, 0.6]], '#ffd23f');
    eye(d, 12, -0.7, 1.4);
  },
  // 학꽁치: 가늘고 긴 몸, 아래턱만 길게 튀어나온 붉은 끝 주둥이
  f21: (d) => {
    const col = '#9fd6ff';
    const c = d.ctx;
    forkTail(d, -16, 0.5, 5, 4.5, '#86c2ee', 0.3);
    poly(d, [[-13, -1.5], [-9, -2.2], [-12, -5]], '#86c2ee');
    poly(d, [[-13, 2.5], [-9, 3], [-12, 6]], '#86c2ee');
    d.shape(() => { c.beginPath(); c.moveTo(-16, -0.5); c.quadraticCurveTo(-2, -4, 10, -2.4); c.quadraticCurveTo(12, -1.5, 12, 0); c.lineTo(21, 1.2); c.lineTo(21, 2.6); c.lineTo(10, 2.6); c.quadraticCurveTo(-2, 4.5, -16, 1.5); c.closePath(); }, col, [0, 0, 10]);
    d.dot(20.5, 1.9, 1, '#ff6b6b');
    d.line(c => { c.moveTo(-14, 0.5); c.lineTo(8, 0.5); }, '#4f8fbf', 1);
    d.ell(-2, 2.3, 9, 1, '#eef8ff');
    eye(d, 8.5, -0.9, 1.6);
  },
  // 쥐치: 높은 마름모꼴, 머리 위 뿔 같은 가시, 작은 뾰족 입, 얼룩무늬
  f22: (d) => {
    const col = '#c9b58f';
    roundTail(d, -12, 0, 6, 6, '#b39f78');
    poly(d, [[-12, 0], [-2, -11], [10, -4], [14, 0], [10, 4], [-2, 11]], col);
    poly(d, [[-11, -2], [-5, -7], [-7, -10], [-11, -6]], '#b39f78');
    poly(d, [[-11, 2], [-5, 7], [-7, 10], [-11, 6]], '#b39f78');
    d.line(c => { c.moveTo(3, -8); c.lineTo(1, -16); }, '#7a6a48', 1.6);
    d.dot(1, -16, 0.9, '#7a6a48');
    for (const [x, y, r] of [[-6, -2, 1.6], [-2, 3, 1.5], [1, -4, 1.3], [-7, 4, 1.2], [4, 2, 1.1], [-3, -6, 1]]) d.dot(x, y, r, '#8f7a52', 0.7);
    d.ell(15, 0, 2, 1.2, '#b39f78');
    d.dot(16.6, 0, 0.6, INK);
    eye(d, 8, -2.5, 2.1);
    blush(d, 9, 1.5, 1.2);
  },
  // 가자미: 위에서 본 납작한 타원, 지느러미가 몸 둘레를 감쌈, 두 눈이 한쪽(오른쪽)에 몰림
  f23: (d) => {
    const col = '#a8744f';
    d.ell(-1, 0, 18, 13, '#946240');
    d.stitch(c => { for (let a = 0; a < Math.PI * 2; a += 0.35) { c.moveTo(-1 + Math.cos(a) * 14.5, Math.sin(a) * 10); c.lineTo(-1 + Math.cos(a) * 17.5, Math.sin(a) * 12.5); } }, '#6e4528', 0.6);
    d.tri([[-17, 0], [-22, -5], [-22, 5]], '#946240');
    d.ell(-1, 0, 14.5, 10, col);
    for (const [x, y, r] of [[-8, -3, 1.6], [-4, 4, 1.4], [1, -5, 1.2], [-10, 4, 1], [3, 3, 1.5], [-1, 0, 0.9], [7, 5, 0.9]]) { d.dot(x, y, r, '#6e4528', 0.6); d.dot(x - r * 0.2, y - r * 0.2, r * 0.4, '#d9a87a', 0.6); }
    d.line(c => { c.moveTo(-14, 0); c.quadraticCurveTo(0, -0.5, 8, -2); }, '#7a4f30', 0.6);
    eye(d, 10, -3.5, 1.9);
    eye(d, 9, 1.5, 1.9);
    smile(d, 13, 4.5, 1);
  },
  // 우럭(조피볼락): 머리에 가시, 굵은 가시 등지느러미, 몸에 짙은 비스듬한 띠, 두툼한 입
  f24: (d) => {
    const col = '#5a4a4a';
    roundTail(d, -12, 0, 7, 7, '#4a3c3c');
    poly(d, [[-10, -6], [-9, -13], [-6, -9], [-4, -14], [-1, -9], [1, -14], [4, -8], [6, -13], [8, -6]], '#4a3c3c');
    d.line(c => { for (const [x, y] of [[-9, -13], [-4, -14], [1, -14], [6, -13]]) { c.moveTo(x, y + 4); c.lineTo(x, y); } }, '#2a2020', 0.7);
    poly(d, [[-7, 6], [1, 6.5], [-4, 11]], '#4a3c3c');
    d.ell(1, 0, 14, 8.5, col);
    d.ell(2, 5, 10, 2.6, '#8a7676');
    d.stitch(c => { for (const x of [-9, -4, 1]) { c.moveTo(x + 2, -7); c.lineTo(x - 2, 6); } }, '#2a2020', 0.7);
    for (const x of [-7, -2]) d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(x + 2.5, -7.5); c.lineTo(x + 4.5, -7); c.lineTo(x + 0.5, 7); c.lineTo(x - 1.5, 6.5); c.closePath(); }, '#3a2c2c', [x + 1.5, 0, 4]);
    d.tri([[9, -6.5], [10.5, -10], [12, -6]], '#4a3c3c');
    d.tri([[6, -6.8], [7, -9.5], [8.5, -7]], '#4a3c3c');
    d.line(c => { c.moveTo(7, 3); c.lineTo(11, 5.5); }, '#2a2020', 0.7);
    d.ell(14.5, 1.5, 1.6, 2.2, '#7a6464');
    d.line(c => { c.moveTo(15.8, 0.5); c.lineTo(12, 1.8); }, INK, 0.8);
    eye(d, 10, -2.6, 2.4);
  },
  // 복어: 동글동글 부푼 몸, 온몸에 작은 가시, 등에 검은 점무늬, 작은 꼬리
  f25: (d) => {
    const col = '#ffd88a';
    roundTail(d, -13, 0, 5, 5, '#f0c06a');
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 9) {
      const x = Math.cos(a) * 13, y = Math.sin(a) * 13;
      d.tri([[Math.cos(a - 0.1) * 12, Math.sin(a - 0.1) * 12], [Math.cos(a) * 16, Math.sin(a) * 16], [Math.cos(a + 0.1) * 12, Math.sin(a + 0.1) * 12]], '#e8b860');
      void x; void y;
    }
    d.circle(0, 0, 13, col);
    d.ell(0, 5, 10, 6, '#fff3d6');
    for (const [x, y, r] of [[-6, -6, 1.6], [-1, -9, 1.4], [4, -7, 1.3], [-8, -1, 1.3], [-3, -3, 1.2], [1, -4, 1]]) d.dot(x, y, r, '#5a4a3a', 0.8);
    poly(d, [[-1, -12.5], [3, -12], [1, -16]], '#f0c06a');
    d.ell(1, 4, 2.5, 1.6, '#f0c06a');
    eye(d, 6.5, -2.5, 2.7);
    d.ell(12.4, 1.5, 1.4, 1.2, '#ff9f7a');
    blush(d, 7, 2.5, 1.7);
  },
};
