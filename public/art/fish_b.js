// 물고기 그림 f26..f50 (광어 ~ 실러캔스). 오른쪽을 보는 옆모습 (특수종 제외)
const eye = (d, x, y, r = 2.2) => { d.dot(x, y, r, '#ffffff'); d.dot(x + r * .25, y, r * .62, '#5b3345'); d.dot(x + r * .45, y - r * .35, r * .25, '#ffffff'); };
const blush = (d, x, y) => d.dot(x, y, 1.6, '#ffadc4', .7);
const sparkle = (d, x, y, s, col = '#fff6b0') => d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s); c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s); c.closePath(); }, col, [x, y, s]);
const alpha = (d, a, fn) => { const c = d.ctx; c.save(); c.globalAlpha = a; fn(); c.restore(); };
// 몸통(물방울형) 경로: 꼬리쪽 tx 에서 머리쪽 hx 까지, 위아래 높이 up/dn
const body = (d, col, tx, hx, up, dn, cy = 0) => d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(tx, cy); c.bezierCurveTo(tx + (hx - tx) * .3, cy - up * 1.1, hx - 4, cy - up, hx, cy); c.bezierCurveTo(hx - 4, cy + dn, tx + (hx - tx) * .3, cy + dn * 1.1, tx, cy); c.closePath(); }, col, [(tx + hx) / 2, cy, Math.max((hx - tx) / 2, up)]);
const fork = (d, col, x, y, w, h) => d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(x, y); c.lineTo(x - w, y - h); c.quadraticCurveTo(x - w * .55, y, x - w, y + h); c.closePath(); }, col, [x - w / 2, y, h]);

export const ART_PART = {
  // 광어: 위에서 본 납작한 타원 + 테두리 지느러미 + 눈 둘 다 한쪽 + 이빨
  f26: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.ellipse(-1, 0, 20, 15, 0, 0, 7); }, '#c9a27a', [-1, 0, 20]);
    d.ell(-1, 0, 16, 12, '#8a6a4a');
    d.tri([[-15, 0], [-22, -6], [-22, 6]], '#a5835e');
    d.stitch(c => c.ellipse(-1, 0, 18, 13.5, 0, 0, 7), '#ffffff', .5);
    for (const [x, y, r] of [[-8, -5, 2], [-3, 5, 1.6], [-11, 4, 1.4], [2, -7, 1.3], [-4, -1, 1.2]]) d.dot(x, y, r, '#5e452e', .7);
    for (const [x, y] of [[-6, 2], [1, 3], [-9, -2]]) d.dot(x, y, .9, '#f2e2c6', .8);
    eye(d, 7, -6, 2.3); eye(d, 10, -1.5, 2.1);
    d.shape(() => { c.beginPath(); c.moveTo(9, 4); c.quadraticCurveTo(13, 7, 17, 3); c.quadraticCurveTo(13, 9, 9, 4); c.closePath(); }, '#6b3a4d', [13, 5, 4]);
    for (const x of [11, 13, 15]) d.tri([[x - .8, 5.2], [x + .8, 5], [x, 7]], '#ffffff');
  },
  // 감성돔: 키 큰 은회색 몸 + 세로 줄무늬 + 가시 등지느러미
  f27: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); for (let i = 0; i < 6; i++) { c.lineTo(-9 + i * 3.4, -11 - (i % 2 ? 7 : 3)); } c.lineTo(10, -11); c.lineTo(-10, -9); c.closePath(); }, '#4f5866', [0, -14, 8]);
    fork(d, '#5f6a7a', -12, 0, 9, 9);
    body(d, '#9aa6b4', -15, 18, 15, 13);
    for (const x of [-7, -1, 5]) d.line(c => { c.moveTo(x, -11); c.quadraticCurveTo(x + 1.5, 0, x, 10); }, '#5f6a7a', 2.2);
    d.tri([[0, 9], [-4, 17], [3, 11]], '#4f5866');
    d.line(c => { c.moveTo(-12, 0); c.lineTo(13, -1); }, '#d8dee6', .8);
    eye(d, 11, -4, 2.3); blush(d, 13, 2);
    d.line(c => { c.moveTo(16, 3); c.lineTo(18, 2); }, '#5b3345', 1);
  },
  // 참돔: 분홍빨강 + 파란 점 + 등지느러미
  f28: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-10, -9); c.quadraticCurveTo(-2, -20, 8, -11); c.closePath(); }, '#ff8f8f', [0, -13, 8]);
    fork(d, '#ff7a7a', -12, 0, 10, 10);
    body(d, '#ff6b6b', -15, 19, 14, 12);
    d.ell(4, 4, 11, 6, '#ffb3a8');
    for (const [x, y] of [[-8, -4], [-3, -7], [2, -5], [-5, 1], [0, 0], [6, -8], [-10, 3], [5, -1]]) d.dot(x, y, 1.1, '#5fd0ff');
    d.tri([[1, 9], [-3, 16], [4, 11]], '#ff8f8f');
    eye(d, 12, -3, 2.4); blush(d, 14, 3);
    d.line(c => { c.moveTo(17, 3); c.lineTo(19, 2.5); }, '#5b3345', 1);
  },
  // 오징어: 위쪽에 삼각 지느러미 달린 원뿔 외투막, 아래로 다리
  f29: (d) => {
    const c = d.ctx;
    d.tri([[-8, -14], [0, -22], [8, -14]], '#ffc6d9');
    d.shape(() => { c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(10, -10, 7, 4); c.lineTo(-7, 4); c.quadraticCurveTo(-10, -10, 0, -20); c.closePath(); }, '#ffd9e6', [0, -8, 11]);
    for (const [x, y] of [[-3, -11], [2, -14], [3, -6], [-2, -4]]) d.dot(x, y, 1, '#ff8fb3', .8);
    for (let i = 0; i < 8; i++) { const x = -6 + i * 1.7; d.line(c => { c.moveTo(x, 4); c.quadraticCurveTo(x + (i % 2 ? 2 : -2), 10, x + (i - 3.5) * .6, 14); }, '#ffc6d9', 1.6); }
    d.line(c => { c.moveTo(-3, 4); c.quadraticCurveTo(-9, 14, -12, 20); }, '#ffb3cc', 1.4);
    d.line(c => { c.moveTo(3, 4); c.quadraticCurveTo(9, 14, 12, 20); }, '#ffb3cc', 1.4);
    d.ell(-12, 20, 1.8, 1.2, '#ffb3cc'); d.ell(12, 20, 1.8, 1.2, '#ffb3cc');
    eye(d, -3.5, 1, 1.8); eye(d, 3.5, 1, 1.8);
  },
  // 문어: 둥근 머리 + 말린 다리 8 개 + 빨판
  f30: (d) => {
    const c = d.ctx;
    for (let i = 0; i < 8; i++) {
      const a = Math.PI * (.08 + i * .12), sx = Math.cos(a) * 9, ex = Math.cos(a) * 19, ey = 4 + Math.sin(a) * 13;
      const k = i < 4 ? 1 : -1;
      d.line(c => { c.moveTo(sx, 4); c.quadraticCurveTo(ex * .9, ey + 4, ex, ey - 1); c.arc(ex + k * 2.2, ey - 1, 2.2, Math.PI * (k > 0 ? 1 : 0), Math.PI * (k > 0 ? 2.6 : 1.6), k < 0); }, '#ff8f7a', 3.2);
      d.dot((sx + ex) / 2, (4 + ey) / 2 + 2, .9, '#ffe0d6');
    }
    d.ell(0, -7, 13, 13, '#ff8f7a');
    d.ell(0, 2, 10, 5, '#ff8f7a');
    d.dot(-4, -13, 3, '#ffffff', .35);
    for (const [x, y] of [[-6, -6], [6, -9], [3, -15]]) d.dot(x, y, 1, '#e5664f', .6);
    eye(d, -4, -2, 2.1); eye(d, 4, -2, 2.1);
    d.circle(0, 3, 2, '#ff6f5a'); d.dot(0, 3, 1, '#c94a3a');
  },
  // 갈치: 긴 은색 리본, 송곳니, 꼬리 끝 가늘게
  f31: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(20, -1); c.quadraticCurveTo(10, -8, -2, -4); c.quadraticCurveTo(-14, 0, -21, 7); c.quadraticCurveTo(-13, 3, -2, 2); c.quadraticCurveTo(10, 2, 20, 3); c.closePath(); }, '#e8eef4', [0, -1, 20]);
    d.line(c => { c.moveTo(13, -5.5); c.quadraticCurveTo(0, -9, -14, -1); }, '#bcd6ff', 1.4);
    d.line(c => { c.moveTo(16, -2); c.quadraticCurveTo(0, -3, -16, 3); }, '#ffffff', .8);
    d.dot(4, -2, 3, '#ffffff', .5);
    eye(d, 14, -3, 2.1);
    d.line(c => { c.moveTo(20, 1); c.lineTo(15, 1.5); }, '#5b3345', .9);
    d.tri([[18.5, 1], [19.5, 1], [19, 3.5]], '#ffffff'); d.tri([[16.5, 1.2], [17.5, 1.2], [17, -1.3]], '#ffffff');
  },
  // 농어: 은회색 긴 몸 + 뾰족한 가시 등지느러미 두 개 + 큰 입
  f32: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-6, -7); for (let i = 0; i < 5; i++) { c.lineTo(-5 + i * 2.4, -16 + i * 1.3); c.lineTo(-4 + i * 2.4, -9); } c.lineTo(7, -8); c.closePath(); }, '#6f7c8e', [0, -11, 6]);
    d.shape(() => { c.beginPath(); c.moveTo(-14, -5); c.quadraticCurveTo(-10, -12, -6, -7); c.closePath(); }, '#7d8a9c', [-10, -8, 4]);
    fork(d, '#7d8a9c', -15, 0, 7, 8);
    body(d, '#9aa6b6', -18, 20, 9, 8);
    d.ell(2, 3, 14, 3.5, '#dfe5ec');
    for (const [x, y] of [[-10, -3], [-5, -5], [0, -4], [4, -6]]) d.dot(x, y, .9, '#5a6575', .8);
    d.line(c => { c.moveTo(-14, 0); c.lineTo(10, -1); }, '#6f7c8e', .8);
    eye(d, 13, -2.5, 2.1);
    d.line(c => { c.moveTo(20, .5); c.lineTo(14, 2.5); }, '#5b3345', 1.2);
    d.line(c => { c.moveTo(10, -4); c.quadraticCurveTo(11, 0, 9, 3); }, '#6f7c8e', .9);
  },
  // 방어: 어뢰형 + 노란 옆줄 + 파란 등
  f33: (d) => {
    const c = d.ctx;
    fork(d, '#e8c440', -15, 0, 8, 10);
    d.tri([[-4, -7], [2, -12], [5, -7]], '#4f6fb3');
    body(d, '#dfe8f2', -17, 20, 9, 8);
    d.shape(() => { c.beginPath(); c.moveTo(-17, 0); c.bezierCurveTo(-10, -10, 15, -9, 20, -.5); c.quadraticCurveTo(0, -3, -17, 0); c.closePath(); }, '#6a8fd6', [0, -4, 18]);
    d.line(c => { c.moveTo(-15, 0); c.quadraticCurveTo(2, -1.5, 17, -.5); }, '#ffd23f', 2.2);
    d.tri([[-1, 7], [3, 12], [5, 7]], '#c9d3dd');
    eye(d, 13, -3, 2); blush(d, 14, 3);
  },
  // 연어: 주황 몸 + 갈고리 턱 + 검은 반점 + 기름지느러미
  f34: (d) => {
    const c = d.ctx;
    fork(d, '#d9806a', -14, 0, 8, 9);
    d.shape(() => { c.beginPath(); c.moveTo(-6, -8); c.quadraticCurveTo(-2, -16, 3, -9); c.closePath(); }, '#d9806a', [-2, -11, 5]);
    d.ell(-11, -6, 1.8, 1.4, '#d9806a');
    body(d, '#ff9f7a', -17, 17, 10, 9);
    d.ell(1, 4, 13, 4, '#ffd0b8');
    for (const [x, y] of [[-10, -3], [-6, -6], [-2, -3], [3, -6], [7, -4], [-13, -1]]) d.dot(x, y, .9, '#5b3345', .75);
    d.shape(() => { c.beginPath(); c.moveTo(14, -3); c.quadraticCurveTo(21, -4, 22, 3); c.quadraticCurveTo(19, 1, 16, 2); c.closePath(); }, '#e8846a', [18, 0, 4]);
    d.shape(() => { c.beginPath(); c.moveTo(14, 3); c.quadraticCurveTo(18, 6, 19, 3); c.closePath(); }, '#e8846a', [17, 4, 3]);
    eye(d, 10, -3, 2.1);
    d.tri([[2, 8], [-1, 13], [5, 9]], '#e8846a');
  },
  // 참치: 크고 통통한 어뢰 + 초승달 꼬리 + 노란 토막지느러미
  f35: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-15, 0); c.quadraticCurveTo(-20, -6, -22, -13); c.quadraticCurveTo(-17, -2, -19, 0); c.quadraticCurveTo(-17, 2, -22, 13); c.quadraticCurveTo(-20, 6, -15, 0); c.closePath(); }, '#3d4785', [-19, 0, 10]);
    d.tri([[-2, -10], [3, -18], [6, -10]], '#3d4785');
    d.tri([[0, 10], [4, 16], [6, 10]], '#c9d3dd');
    body(d, '#c9d3dd', -17, 21, 12, 11);
    d.shape(() => { c.beginPath(); c.moveTo(-17, 0); c.bezierCurveTo(-10, -13, 15, -13, 21, -.5); c.quadraticCurveTo(0, -1, -17, 0); c.closePath(); }, '#3d4785', [0, -5, 18]);
    for (let i = 0; i < 4; i++) { d.tri([[-14 + i * 2.6, -4.5 + i * -.3], [-13 + i * 2.6, -7.5], [-12 + i * 2.6, -5]], '#ffd23f'); d.tri([[-14 + i * 2.6, 4.5], [-13 + i * 2.6, 7.5], [-12 + i * 2.6, 5]], '#ffd23f'); }
    d.line(c => { c.moveTo(-2, 2); c.quadraticCurveTo(5, 0, 11, 1); }, '#ffd23f', 1.3);
    d.ell(4, 4, 3.5, 1.4, '#3d4785');
    eye(d, 14, -2.5, 2.3); blush(d, 16, 3);
  },
  // 청새치(전설): 창 같은 주둥이 + 돛 지느러미 + 반짝이
  f36: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-12, -4); c.quadraticCurveTo(-8, -22, 8, -19); c.quadraticCurveTo(10, -10, 8, -6); c.closePath(); }, '#2f5fb3', [-2, -12, 10]);
    for (const x of [-7, -3, 1, 5]) d.line(c => { c.moveTo(x, -5); c.lineTo(x - 1, -17); }, '#1f3f80', .7);
    d.shape(() => { c.beginPath(); c.moveTo(-14, 0); c.quadraticCurveTo(-18, -5, -22, -12); c.quadraticCurveTo(-18, 0, -22, 12); c.quadraticCurveTo(-18, 5, -14, 0); c.closePath(); }, '#2f5fb3', [-18, 0, 10]);
    body(d, '#cfe0f5', -16, 13, 7, 7, 1);
    d.shape(() => { c.beginPath(); c.moveTo(-16, 1); c.bezierCurveTo(-8, -8, 8, -7, 13, 0); c.quadraticCurveTo(0, -1, -16, 1); c.closePath(); }, '#4b7bd6', [0, -2, 14]);
    for (const x of [-8, -4, 0, 4]) d.line(c => { c.moveTo(x, -3); c.lineTo(x, 4); }, '#8fc0ff', .9);
    d.tri([[12, -1], [22, 1], [12, 3]], '#3d63b0');
    d.tri([[2, 6], [0, 13], [5, 6]], '#2f5fb3');
    eye(d, 9, -1.5, 1.9);
    sparkle(d, 15, -14, 3.2); sparkle(d, -19, 16, 2.5); sparkle(d, 18, 12, 2);
    d.dot(-16, -16, 1, '#fff6b0');
  },
  // 바다나비(나비고기): 둥근 원반형 + 굵은 눈 줄 + 꼬리쪽 눈 무늬 + 뾰족 주둥이
  f37: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-14, -2); c.quadraticCurveTo(-6, -19, 8, -12); c.lineTo(-14, 6); c.quadraticCurveTo(-6, 18, 8, 12); c.closePath(); }, '#b48ef0', [-3, 0, 14]);
    d.tri([[-12, 0], [-19, -7], [-19, 7]], '#c9a6ff');
    d.ell(0, 0, 13, 13, '#e3d1ff');
    d.ell(17, 1, 4, 2, '#e3d1ff');
    for (const y of [-6, -2, 2, 6]) d.line(c => { c.moveTo(-10, y); c.quadraticCurveTo(-2, y - 3, 6, y - 1); }, '#c9a6ff', .9);
    d.line(c => { c.moveTo(9, -12); c.quadraticCurveTo(11, 0, 9, 12); }, '#5b3345', 2.6);
    d.dot(-6, -4, 3.4, '#5b3345'); d.dot(-6, -4, 2, '#ffffff', .25); d.line(c => c.arc(-6, -4, 4.2, 0, 7), '#ffd23f', 1);
    eye(d, 10, -2, 2);
    d.dot(20.5, 1, .8, '#5b3345');
  },
  // 동굴새우: 둥글게 말린 마디 몸 + 더듬이 + 다리
  f38: (d) => {
    const c = d.ctx;
    d.line(c => { c.moveTo(12, -6); c.quadraticCurveTo(20, -18, 6, -21); }, '#e8846a', 1);
    d.line(c => { c.moveTo(13, -4); c.quadraticCurveTo(22, -12, 21, -20); }, '#e8846a', 1);
    for (let i = 0; i < 6; i++) { const a = -0.4 + i * .5, x = Math.cos(a) * 8, y = Math.sin(a) * 8 + 2; d.line(c => { c.moveTo(x * .9, y * .9); c.lineTo(x * .9 - 1, y + 6); }, '#e8846a', .9); }
    for (let i = 0; i < 6; i++) { const a = -0.6 + i * .55, r = 9 - i * .4; d.circle(Math.cos(a) * r - 1, Math.sin(a) * r + 1 - 2, 5.4 - i * .45, i % 2 ? '#ff9f7a' : '#ffb394'); }
    d.shape(() => { c.beginPath(); c.moveTo(-6, 9); c.lineTo(-15, 7); c.lineTo(-12, 12); c.lineTo(-15, 16); c.closePath(); }, '#ff8f6a', [-11, 11, 5]);
    d.ell(9, -5, 7, 5, '#ff9f7a');
    d.tri([[14, -7], [20, -9], [15, -4]], '#ff8f6a');
    for (let i = 0; i < 5; i++) { const a = -0.3 + i * .55; d.line(c => c.arc(-1, -1, 8.5, a, a + .1), '#ffffff', .8); }
    eye(d, 11, -7, 1.7);
  },
  // 장님물고기: 창백한 반투명, 눈 없음(피부로 덮인 자리), 분홍 아가미
  f39: (d) => {
    const c = d.ctx;
    alpha(d, .9, () => {
      fork(d, '#f3e6ff', -13, 0, 8, 8);
      d.shape(() => { c.beginPath(); c.moveTo(-6, -7); c.quadraticCurveTo(0, -14, 4, -7); c.closePath(); }, '#ece0f8', [-1, -9, 5]);
      body(d, '#f3e6ff', -16, 18, 10, 9);
    });
    d.dot(-2, 1, 4, '#ffc6d9', .45);
    d.ell(11, -3, 2.4, 1.6, '#ece0f8');
    d.line(c => { c.moveTo(9.5, -3); c.quadraticCurveTo(11, -1.8, 12.5, -3); }, '#c9b6e0', .8);
    d.line(c => { c.moveTo(6, -5); c.quadraticCurveTo(8, 0, 6, 5); }, '#ffadc4', 1.4);
    for (const x of [-10, -6, -2]) d.stitch(c => { c.moveTo(x, -6); c.lineTo(x + 2, 6); }, '#d9c6f0', .7);
    d.line(c => { c.moveTo(17, 2); c.lineTo(14, 3); }, '#c9a6c9', .9);
    d.tri([[0, 8], [-3, 13], [3, 9]], '#ece0f8');
  },
  // 수정게: 보석처럼 각진 껍데기 + 집게 + 다리
  f40: (d) => {
    const c = d.ctx;
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) d.line(c => { c.moveTo(s * 8, 2 + i * 3); c.lineTo(s * 15, 4 + i * 4); c.lineTo(s * 18, 11 + i * 3); }, '#8fd8f0', 1.6);
    for (const s of [-1, 1]) {
      d.line(c => { c.moveTo(s * 9, -3); c.quadraticCurveTo(s * 15, -6, s * 15, -11); }, '#8fd8f0', 2.4);
      d.shape(() => { c.beginPath(); c.moveTo(s * 15, -10); c.lineTo(s * 20, -15); c.lineTo(s * 17, -20); c.lineTo(s * 14, -16); c.lineTo(s * 12, -19); c.lineTo(s * 11, -14); c.closePath(); }, '#b9f0ff', [s * 15, -15, 5]);
    }
    d.shape(() => { c.beginPath(); c.moveTo(-12, 0); c.lineTo(-7, -9); c.lineTo(7, -9); c.lineTo(12, 0); c.lineTo(6, 7); c.lineTo(-6, 7); c.closePath(); }, '#b9f0ff', [0, -1, 12]);
    d.tri([[-7, -9], [0, -1], [7, -9]], '#e6fbff');
    d.tri([[-12, 0], [0, -1], [-6, 7]], '#8fd8f0');
    d.tri([[12, 0], [0, -1], [6, 7]], '#a6e6f8');
    d.line(c => { c.moveTo(-7, -9); c.lineTo(0, -1); c.lineTo(7, -9); c.moveTo(-12, 0); c.lineTo(12, 0); c.moveTo(0, -1); c.lineTo(-6, 7); c.moveTo(0, -1); c.lineTo(6, 7); }, '#ffffff', .6);
    d.line(c => { c.moveTo(-3, -9); c.lineTo(-4, -13); c.moveTo(3, -9); c.lineTo(4, -13); }, '#8fd8f0', 1.2);
    eye(d, -4, -13.5, 1.8); eye(d, 4, -13.5, 1.8);
    sparkle(d, -3, -5, 2, '#ffffff'); d.dot(5, 3, .8, '#ffffff');
  },
  // 유령고기: 반투명 몸 + 비치는 뼈 + 흐늘한 꼬리
  f41: (d) => {
    const c = d.ctx;
    alpha(d, .5, () => {
      d.shape(() => { c.beginPath(); c.moveTo(-13, 0); c.quadraticCurveTo(-19, -10, -21, -6); c.quadraticCurveTo(-18, 0, -21, 7); c.quadraticCurveTo(-18, 9, -13, 0); c.closePath(); }, '#e8eef4', [-17, 0, 7]);
      body(d, '#e8eef4', -15, 18, 10, 9);
    });
    d.line(c => { c.moveTo(-14, 0); c.lineTo(8, -.5); }, '#9aa6b6', 1.3);
    for (let i = 0; i < 7; i++) { const x = -12 + i * 3; d.line(c => { c.moveTo(x, 0); c.quadraticCurveTo(x - 1.5, -4, x - 2.5, -7 + Math.abs(i - 3) * .4); c.moveTo(x, 0); c.quadraticCurveTo(x - 1.5, 4, x - 2.5, 6.5 - Math.abs(i - 3) * .4); }, '#9aa6b6', .8); }
    d.line(c => c.arc(12, -1, 5, 0, 7), '#9aa6b6', .8);
    d.dot(12, -2, 2.8, '#5b6b80', .9); d.dot(12.6, -2.8, .9, '#ffffff');
    d.dot(-1, 3, 2, '#bfe0ff', .5);
    d.dot(16, -8, 1, '#ffffff', .6); d.dot(19, -12, .7, '#ffffff', .5);
  },
  // 무지개산호어: 둥근 몸 + 무지개 세로 줄무늬 + 하늘하늘 지느러미
  f42: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-12, 0); c.quadraticCurveTo(-18, -12, -21, -8); c.quadraticCurveTo(-17, 0, -21, 8); c.quadraticCurveTo(-18, 12, -12, 0); c.closePath(); }, '#bf8cff', [-17, 0, 8]);
    d.shape(() => { c.beginPath(); c.moveTo(-9, -8); c.quadraticCurveTo(-4, -19, 8, -10); c.closePath(); }, '#ffd23f', [0, -12, 8]);
    d.shape(() => { c.beginPath(); c.moveTo(-9, 8); c.quadraticCurveTo(-4, 18, 6, 10); c.closePath(); }, '#5fd0ff', [0, 12, 7]);
    body(d, '#ff8fc4', -14, 18, 12, 12);
    c.save(); c.beginPath(); c.ellipse(1, 0, 16, 11, 0, 0, 7); c.clip && c.clip();
    const cols = ['#ff6b6b', '#ffa64f', '#ffe066', '#7fe08a', '#5fb3ff', '#a68cff'];
    cols.forEach((col, i) => d.line(c => { const x = -11 + i * 3.6; c.moveTo(x, -12); c.quadraticCurveTo(x + 2, 0, x, 12); }, col, 2.6));
    c.restore();
    eye(d, 12, -3, 2.3); blush(d, 13, 3);
    d.dot(17, 1, .9, '#5b3345');
  },
  // 앵무조개: 줄무늬 소용돌이 껍데기 + 촉수 + 두건
  f43: (d) => {
    const c = d.ctx;
    for (let i = 0; i < 6; i++) { const y = -1 + i * 2.2; d.line(c => { c.moveTo(11, y); c.quadraticCurveTo(17, y + 1 + i * .5, 21, y + 3 + i * .6); }, '#ffc6a8', 1.3); }
    d.circle(-2, 0, 15, '#fff0d6');
    for (let i = 0; i < 6; i++) { const a = -2.6 + i * .5; d.shape(() => { c.beginPath(); c.moveTo(-2, 0); c.arc(-2, 0, 15, a, a + .22); c.closePath(); }, '#d98a4f', [-2, 0, 8]); }
    d.line(c => { for (let t = 0; t < 12.5; t += .2) { const r = 1 + t * 1.05, x = -2 + Math.cos(t + 1) * r, y = Math.sin(t + 1) * r; t ? c.lineTo(x, y) : c.moveTo(x, y); } }, '#b36a3a', 1);
    d.circle(-2, 0, 3.5, '#e8b84f');
    d.shape(() => { c.beginPath(); c.moveTo(7, -11); c.quadraticCurveTo(16, -9, 14, 0); c.quadraticCurveTo(12, 6, 7, 6); c.quadraticCurveTo(10, -3, 7, -11); c.closePath(); }, '#c97a4a', [11, -3, 8]);
    eye(d, 11, -3, 1.8);
    d.dot(-8, -8, 2.5, '#ffffff', .5);
  },
  // 별빛해파리: 반투명 종 + 빛나는 점 + 긴 촉수
  f44: (d) => {
    const c = d.ctx;
    const tc = ['#bfe0ff', '#d9c6ff', '#bfe0ff', '#d9c6ff', '#bfe0ff'];
    tc.forEach((col, i) => { const x = -9 + i * 4.5; d.line(c => { c.moveTo(x, 0); c.bezierCurveTo(x + 4, 6, x - 4, 12, x + (i - 2), 22); }, col, 1.2); });
    d.line(c => { c.moveTo(-3, 0); c.quadraticCurveTo(-5, 6, -2, 12); c.moveTo(3, 0); c.quadraticCurveTo(5, 7, 1, 13); }, '#ffadc4', 2);
    alpha(d, .85, () => d.shape(() => { c.beginPath(); c.moveTo(-14, 1); c.bezierCurveTo(-15, -22, 15, -22, 14, 1); c.quadraticCurveTo(10, -1, 7, 2); c.quadraticCurveTo(3.5, -1, 0, 2); c.quadraticCurveTo(-3.5, -1, -7, 2); c.quadraticCurveTo(-10, -1, -14, 1); c.closePath(); }, '#bfe0ff', [0, -8, 14]));
    d.ell(0, -8, 7, 5, '#e6f3ff');
    for (const [x, y, r] of [[-8, -6, 1.3], [7, -10, 1.1], [-3, -14, 1], [4, -4, 1.2], [10, -3, .9], [-10, -1, .8], [1, 8, .9], [-7, 15, .8], [6, 18, .8]]) { d.dot(x, y, r * 2.2, '#fff6b0', .35); d.dot(x, y, r, '#fff6b0'); }
    sparkle(d, 0, -10, 2.4, '#ffffff');
    d.dot(-5, -5, 1.1, '#5b3345'); d.dot(5, -5, 1.1, '#5b3345');
  },
  // 심해랜턴피시: 어두운 몸 + 큰 눈 + 배를 따라 빛나는 발광점
  f45: (d) => {
    const c = d.ctx;
    fork(d, '#2f3a5a', -13, 0, 8, 8);
    d.tri([[-5, -7], [-1, -13], [2, -7]], '#2f3a5a');
    d.ell(-9, -6, 1.6, 1.4, '#2f3a5a');
    body(d, '#3f4b6e', -16, 17, 9, 9);
    d.ell(1, 4, 12, 3.5, '#5a6688');
    for (let i = 0; i < 8; i++) { const x = -12 + i * 3.3, y = 5.5 - Math.abs(i - 4) * .3; d.dot(x, y, 2.2, '#6fe0c4', .3); d.dot(x, y, 1.1, '#b8fff0'); }
    for (const [x, y] of [[-8, 1], [-3, 1.5], [2, 1]]) d.dot(x, y, .8, '#6fe0c4');
    d.dot(13, 0.5, 2, '#6fe0c4', .35); d.dot(13, .5, 1, '#d8fff6');
    d.dot(10, -3, 3.6, '#ffffff'); d.dot(10.8, -3, 2.6, '#1e2440'); d.dot(11.6, -4, .9, '#ffffff');
    d.line(c => { c.moveTo(17, 1); c.lineTo(13, 3); }, '#1e2440', 1);
  },
  // 동굴메기: 창백한 넓적 머리 + 긴 수염 + 아주 작은 눈
  f46: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-12, -1); c.quadraticCurveTo(-20, -5, -22, -2); c.quadraticCurveTo(-21, 2, -22, 5); c.quadraticCurveTo(-18, 5, -12, 2); c.closePath(); }, '#cbbfd9', [-18, 1, 5]);
    d.shape(() => { c.beginPath(); c.moveTo(-14, -2); c.quadraticCurveTo(-4, -6, 2, -5); c.lineTo(2, -3); c.closePath(); }, '#cbbfd9', [-6, -4, 7]);
    d.shape(() => { c.beginPath(); c.moveTo(-14, 0); c.quadraticCurveTo(-6, -7, 6, -7); c.quadraticCurveTo(17, -7, 18, 1); c.quadraticCurveTo(17, 7, 6, 7); c.quadraticCurveTo(-6, 6, -14, 2); c.closePath(); }, '#ddd3e8', [2, 0, 16]);
    d.ell(4, 4, 11, 2.6, '#f0eaf6');
    d.tri([[2, 4], [-2, 10], [6, 6]], '#cbbfd9');
    d.dot(12, -3, 1, '#5b5266');
    d.line(c => { c.moveTo(17, -1); c.quadraticCurveTo(22, -10, 15, -15); }, '#a596b8', 1.2);
    d.line(c => { c.moveTo(17, 2); c.quadraticCurveTo(23, 6, 21, 13); }, '#a596b8', 1.2);
    d.line(c => { c.moveTo(16, 4); c.quadraticCurveTo(17, 10, 13, 14); }, '#a596b8', 1);
    d.line(c => { c.moveTo(18, 1.5); c.lineTo(14, 2); }, '#5b5266', .9);
    for (const x of [-8, -3, 2]) d.dot(x, -1, .7, '#b8aac9');
  },
  // 은빛장어: 길고 S자로 굽은 반짝이는 몸 + 이어진 등지느러미
  f47: (d) => {
    const c = d.ctx;
    const path = c => { c.moveTo(-20, 8); c.bezierCurveTo(-12, -10, -2, 14, 6, 0); c.quadraticCurveTo(10, -7, 18, -6); };
    d.line(path, '#9aa6b6', 9);
    d.line(path, '#c9d3dd', 7);
    d.line(c => { c.moveTo(-19, 6); c.bezierCurveTo(-12, -11, -2, 12, 6, -2); c.quadraticCurveTo(10, -8, 17, -8); }, '#f4f8ff', 1.6);
    d.line(c => { c.moveTo(-20, 11); c.bezierCurveTo(-12, -6, -2, 18, 6, 4); }, '#9aa6b6', .8);
    d.ell(18, -5.5, 4.5, 3.6, '#c9d3dd');
    eye(d, 18.5, -6.5, 1.6);
    d.line(c => { c.moveTo(22, -4.5); c.lineTo(19, -3.5); }, '#5b3345', .8);
    d.dot(-15, -8, 1, '#ffffff'); sparkle(d, 0, -10, 2.2, '#ffffff'); sparkle(d, 10, 9, 1.6, '#ffffff');
  },
  // 초롱아귀: 둥글고 어두운 몸 + 큰 입 + 뾰족 이빨 + 빛나는 초롱
  f48: (d) => {
    const c = d.ctx;
    d.tri([[-15, 2], [-22, -6], [-22, 10]], '#2f3769');
    d.circle(-2, 2, 15, '#3d4785');
    d.line(c => { c.moveTo(4, -11); c.quadraticCurveTo(10, -24, 18, -16); }, '#5a6699', 1.3);
    d.dot(18, -15, 5, '#fff6b0', .3); d.dot(18, -15, 3, '#ffe066'); d.dot(17, -16, 1, '#ffffff');
    d.shape(() => { c.beginPath(); c.moveTo(13, -2); c.quadraticCurveTo(1, 3, 13, 13); c.quadraticCurveTo(17, 6, 13, -2); c.closePath(); }, '#1e2440', [12, 5, 6]);
    for (let i = 0; i < 4; i++) { d.tri([[6 + i * 2, -1 + i * .2], [8 + i * 2, -.6], [7.2 + i * 2, 2.5]], '#ffffff'); d.tri([[7 + i * 1.8, 11.5 - i * .3], [9 + i * 1.8, 11], [8 + i * 1.8, 8]], '#ffffff'); }
    d.dot(2, -5, 3, '#ffffff'); d.dot(2.6, -5, 1.8, '#1e2440'); d.dot(3.2, -5.8, .6, '#ffffff');
    d.tri([[-6, 15], [-9, 21], [-2, 16]], '#2f3769');
    for (const [x, y] of [[-10, -4], [-7, 7], [-12, 3]]) d.dot(x, y, .9, '#6f7bb8');
  },
  // 보석가오리: 위에서 본 마름모 + 보석 점 + 긴 꼬리
  f49: (d) => {
    const c = d.ctx;
    d.line(c => { c.moveTo(0, 10); c.quadraticCurveTo(3, 17, -2, 22); }, '#9a6ad9', 1.6);
    d.tri([[-1.5, 17], [2.5, 15], [1, 19]], '#ffd23f');
    d.shape(() => { c.beginPath(); c.moveTo(0, -17); c.quadraticCurveTo(10, -10, 21, -1); c.quadraticCurveTo(8, 3, 0, 12); c.quadraticCurveTo(-8, 3, -21, -1); c.quadraticCurveTo(-10, -10, 0, -17); c.closePath(); }, '#bf8cff', [0, -2, 20]);
    d.ell(0, -2, 6, 8, '#d1adff');
    d.line(c => { c.moveTo(0, -15); c.lineTo(0, 9); }, '#a678e6', .7);
    const gem = (x, y, s, col) => { d.shape(() => { c.beginPath(); c.moveTo(x, y - s); c.lineTo(x + s * .8, y); c.lineTo(x, y + s); c.lineTo(x - s * .8, y); c.closePath(); }, col, [x, y, s]); d.dot(x - s * .25, y - s * .35, s * .25, '#ffffff', .8); };
    gem(-10, -2, 2.4, '#5fd0ff'); gem(10, -2, 2.4, '#5fd0ff'); gem(-5, 4, 1.8, '#ff6b9a'); gem(5, 4, 1.8, '#ff6b9a'); gem(0, -9, 2, '#7fe08a');
    eye(d, -3, -12, 1.5); eye(d, 3, -12, 1.5);
    d.line(c => { c.moveTo(-1.5, -8); c.quadraticCurveTo(0, -7, 1.5, -8); }, '#5b3345', .8);
  },
  // 실러캔스(전설): 두툼한 몸 + 다리 같은 엽상 지느러미 + 흰 반점 + 세 갈래 꼬리 + 반짝이
  f50: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-13, 0); c.lineTo(-20, -9); c.quadraticCurveTo(-18, -2, -22, 0); c.quadraticCurveTo(-18, 2, -20, 9); c.closePath(); }, '#3d4a68', [-18, 0, 8]);
    d.ell(-20, 0, 2.5, 1.8, '#3d4a68');
    d.ell(-6, -10, 4, 2.2, '#3d4a68'); d.tri([[-8, -11], [-6, -16], [-3, -11]], '#3d4a68');
    body(d, '#4a5a7a', -16, 19, 11, 10);
    for (const [x, y, rx] of [[-9, 10, 3.8], [3, 10, 4], [-2, -11, 3.6]]) { d.ell(x, y + (y > 0 ? 1.5 : -1), rx * .5, 2.6, '#3d4a68'); d.ell(x, y + (y > 0 ? 4 : -4), rx * .9, 2, '#56688c'); }
    d.ell(5, 1, 3.5, 2, '#56688c'); d.tri([[5, 3], [1, 7], [8, 4]], '#3d4a68');
    for (const [x, y, r] of [[-11, -3, 1.4], [-6, 2, 1.2], [-2, -5, 1.5], [2, 3, 1.1], [6, -5, 1.3], [-9, 4, 1], [-14, 0, .9], [9, 4, 1]]) d.dot(x, y, r, '#e8eef4', .9);
    eye(d, 13, -3, 2.3);
    d.line(c => { c.moveTo(19, 1); c.lineTo(14, 2.5); }, '#2a3350', 1);
    sparkle(d, 16, -14, 3.2); sparkle(d, -17, 15, 2.5); sparkle(d, 19, 13, 2);
  },
};
