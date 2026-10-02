// 수확 작물 아이콘 30종 (c01..c30). (0,0) 중심, 약 -22..22 범위.
const PI = Math.PI;
const leafShape = (d, x, y, len, wid, ang, col) => {
  const c = d.ctx, ca = Math.cos(ang), sa = Math.sin(ang);
  const tx = x + ca * len, ty = y + sa * len, nx = -sa * wid, ny = ca * wid;
  const mx = x + ca * len * .5, my = y + sa * len * .5;
  d.shape(() => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx + nx, my + ny, tx, ty); c.quadraticCurveTo(mx - nx, my - ny, x, y); c.closePath(); }, col, [mx, my, Math.max(len / 2, wid)]);
  return [tx, ty];
};
const calyxStar = (d, x, y, r, n, col) => {
  for (let i = 0; i < n; i++) { const a = -PI / 2 + i * 2 * PI / n; leafShape(d, x, y, r, r * .35, a, col); }
};

export const ART_PART = {
  // 토마토: 둥글고 약간 납작, 초록 별 꼭지
  c01: (d) => {
    d.ell(0, 3, 16, 14, '#ff4f4f');
    d.line(c => { c.moveTo(-6, -9); c.quadraticCurveTo(-9, 3, -5, 14); }, '#d93a3a', 1);
    d.line(c => { c.moveTo(6, -9); c.quadraticCurveTo(9, 3, 5, 14); }, '#d93a3a', 1);
    calyxStar(d, 0, -9, 8, 5, '#4fae3c');
    d.rr(-1.2, -16, 2.4, 6, 1, '#3f8e32');
    d.dot(-7, -2, 3, '#ffffff', .5);
  },
  // 무순: 가는 하얀 줄기 다발 + 작은 떡잎 두 장씩, 묶음 끈
  c02: (d) => {
    const xs = [-9, -5, -1, 3, 7, 10];
    xs.forEach((x, i) => {
      const top = -10 - (i % 3) * 3;
      d.line(c => { c.moveTo(x * .3, 18); c.quadraticCurveTo(x * .6, 4, x, top); }, '#f6f8ea', 1.6);
      d.ell(x - 3, top - 1, 3.2, 1.8, '#9fdc6a');
      d.ell(x + 3, top - 1, 3.2, 1.8, '#c9f0a0');
    });
    d.rr(-5, 6, 10, 4, 2, '#ff9fbf');
    d.dot(0, 8, 1.2, '#ffffff');
  },
  // 래디시: 동글한 분홍 뿌리 + 하얀 꼬리 + 긴 잎
  c03: (d) => {
    leafShape(d, -1, -4, 15, 4, -PI / 2 - .4, '#6cc46a');
    leafShape(d, 1, -4, 16, 4, -PI / 2 + .35, '#5cb85c');
    leafShape(d, 0, -4, 14, 3.5, -PI / 2, '#7fd07a');
    d.circle(0, 6, 11, '#ff6fa0');
    d.line(c => { c.moveTo(0, 16); c.quadraticCurveTo(1, 19, -1, 22); }, '#fff0f4', 2);
    d.dot(-4, 2, 3, '#ffffff', .5);
    d.dot(0, 15, 3, '#fff0f4');
  },
  // 상추: 주름진 잎 겹겹이 퍼진 둥근 포기
  c04: (d) => {
    for (let i = 0; i < 7; i++) { const a = PI + i * PI / 6; d.circle(Math.cos(a) * 11, 6 + Math.sin(a) * 9, 8, i % 2 ? '#8fd66a' : '#7cc95a'); }
    d.circle(0, 4, 10, '#a8e27f');
    d.circle(0, 2, 6, '#c4ef9a');
    d.stitch(c2 => { for (const a of [-2.4, -1.57, -.7]) { c2.moveTo(0, 6); c2.lineTo(Math.cos(a) * 15, 6 + Math.sin(a) * 13); } }, '#f0ffe0', .7);
    d.rr(-6, 12, 12, 6, 3, '#e8f7d0');
  },
  // 시금치: 뿌리 쪽 분홍 줄기, 숟가락 모양 진한 잎 다발
  c05: (d) => {
    const angs = [-PI / 2 - .7, -PI / 2 - .25, -PI / 2 + .2, -PI / 2 + .65];
    angs.forEach((a, i) => {
      const [tx, ty] = [Math.cos(a) * 12, 10 + Math.sin(a) * 12];
      d.line(c => { c.moveTo(0, 14); c.lineTo(tx * .6, 10 + (ty - 10) * .6); }, '#8fcf6a', 2);
      d.ell(tx, ty - 3, 6, 8, i % 2 ? '#4fae3c' : '#3f9a32');
      d.line(c => { c.moveTo(tx * .7, ty); c.lineTo(tx, ty - 9); }, '#7fd07a', .8);
    });
    d.ell(0, 16, 4, 3, '#ff7fa0');
    d.line(c => { c.moveTo(0, 18); c.lineTo(0, 22); }, '#e8c9a8', 1.2);
  },
  // 당근: 긴 주황 원뿔 + 가로 주름 + 깃털 잎
  c06: (d) => {
    const c = d.ctx;
    for (const [a, col] of [[-PI / 2 - .5, '#5cb85c'], [-PI / 2, '#6cc46a'], [-PI / 2 + .5, '#4fae3c']]) leafShape(d, 4, -8, 13, 3.2, a + .3, col);
    c.save(); c.translate(0, 2); c.rotate(.5);
    d.shape(() => { c.beginPath(); c.moveTo(-7, -14); c.quadraticCurveTo(0, -18, 7, -14); c.quadraticCurveTo(4, 6, 0, 18); c.quadraticCurveTo(-4, 6, -7, -14); c.closePath(); }, '#ff9533', [0, -2, 16]);
    d.line(c2 => { for (const y of [-8, -1, 6]) { c2.moveTo(-4 + y * .1, y); c2.lineTo(-1 + y * .1, y + 1); } c2.moveTo(2, -4); c2.lineTo(5, -3); c2.moveTo(1, 3); c2.lineTo(3.5, 4); }, '#d96f1a', 1);
    d.dot(-3, -10, 2, '#ffffff', .5);
    c.restore();
  },
  // 감자: 울퉁불퉁 타원 + 눈(점)
  c07: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-15, 0); c.bezierCurveTo(-16, -10, -4, -13, 3, -11); c.bezierCurveTo(13, -10, 18, -3, 15, 5); c.bezierCurveTo(13, 12, 0, 13, -7, 11); c.bezierCurveTo(-13, 9, -14, 5, -15, 0); c.closePath(); }, '#d9b07a', [0, 0, 16]);
    for (const [x, y] of [[-8, -3], [2, -6], [9, 2], [-2, 5], [5, 8], [-10, 5]]) { d.dot(x, y, 1.3, '#9a7048'); d.dot(x + .5, y - .6, .6, '#f2d8b0'); }
    d.dot(-6, -7, 3, '#ffffff', .35);
  },
  // 양파: 물방울 모양 + 세로 줄 + 위쪽 뾰족 + 아래 수염뿌리
  c08: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(0, -18); c.bezierCurveTo(4, -10, 16, -6, 15, 4); c.bezierCurveTo(14, 12, 6, 15, 0, 15); c.bezierCurveTo(-6, 15, -14, 12, -15, 4); c.bezierCurveTo(-16, -6, -4, -10, 0, -18); c.closePath(); }, '#e8c9ff', [0, 0, 16]);
    d.line(c2 => { for (const k of [-.6, -.25, .25, .6]) { c2.moveTo(0, -16); c2.quadraticCurveTo(k * 26, 0, k * 8, 14); } }, '#c9a0e8', 1);
    d.line(c2 => { c2.moveTo(0, -18); c2.quadraticCurveTo(2, -21, 1, -22); }, '#b88a5a', 2);
    d.line(c2 => { for (const x of [-3, -1, 1, 3]) { c2.moveTo(x * .6, 15); c2.lineTo(x * 1.3, 19); } }, '#e8d8b0', .9);
    d.dot(-7, -2, 3, '#ffffff', .5);
  },
  // 튤립: 컵 모양 3갈래 꽃 + 줄기 + 칼 모양 잎
  c09: (d) => {
    const c = d.ctx;
    d.line(c2 => { c2.moveTo(0, -2); c2.lineTo(0, 21); }, '#4f9e46', 2.4);
    leafShape(d, 0, 20, 17, 3.6, -PI / 2 - .55, '#6cc46a');
    leafShape(d, 0, 20, 14, 3.2, -PI / 2 + .6, '#5cb85c');
    d.shape(() => { c.beginPath(); c.moveTo(-9, -14); c.lineTo(-4, -8); c.lineTo(0, -16); c.lineTo(4, -8); c.lineTo(9, -14); c.quadraticCurveTo(11, 0, 0, 1); c.quadraticCurveTo(-11, 0, -9, -14); c.closePath(); }, '#ff6b9a', [0, -7, 10]);
    d.line(c2 => { c2.moveTo(0, -15); c2.quadraticCurveTo(-2, -6, 0, 0); }, '#e04f80', 1);
    d.dot(-5, -7, 2, '#ffffff', .45);
  },
  // 완두콩: 초승달 꼬투리가 열려 콩알 줄지어 보임
  c10: (d) => {
    const c = d.ctx;
    c.save(); c.rotate(-.5);
    d.shape(() => { c.beginPath(); c.moveTo(-20, 0); c.quadraticCurveTo(0, -14, 20, -2); c.quadraticCurveTo(0, 12, -20, 0); c.closePath(); }, '#5cb85c', [0, 0, 18]);
    d.shape(() => { c.beginPath(); c.moveTo(-17, -1); c.quadraticCurveTo(0, -9, 17, -2); c.quadraticCurveTo(0, 5, -17, -1); c.closePath(); }, '#e8f7d0', [0, -1, 14]);
    for (const x of [-11, -5.5, 0, 5.5, 11]) d.circle(x, -1.5, 3, '#7cc96a');
    d.line(c2 => { c2.moveTo(-20, 0); c2.quadraticCurveTo(-23, -4, -21, -7); }, '#4f9e46', 1.5);
    calyxStar(d, -19, 0, 4, 4, '#4f9e46');
    c.restore();
  },
  // 옥수수: 낱알 격자 이삭 + 양쪽 껍질
  c11: (d) => {
    const c = d.ctx;
    c.save(); c.rotate(.35);
    d.ell(0, -1, 7.5, 17, '#ffd84f');
    for (let row = -14; row <= 12; row += 3.6) {
      const w = Math.sqrt(Math.max(0, 1 - (row / 17) ** 2)) * 6.5;
      for (let x = -w + 1.5; x <= w - 1; x += 3.2) d.dot(x, row, 1.35, '#ffe98a');
    }
    d.line(c2 => { c2.moveTo(0, -18); c2.quadraticCurveTo(-2, -21, -1, -23); c2.moveTo(1, -18); c2.quadraticCurveTo(3, -21, 3, -23); }, '#c98e5b', 1);
    d.shape(() => { c.beginPath(); c.moveTo(0, 18); c.quadraticCurveTo(-14, 10, -9, -10); c.quadraticCurveTo(-6, 4, 0, 14); c.closePath(); }, '#8fcf6a', [-5, 6, 10]);
    d.shape(() => { c.beginPath(); c.moveTo(0, 18); c.quadraticCurveTo(14, 10, 10, -6); c.quadraticCurveTo(6, 6, 0, 14); c.closePath(); }, '#6cc46a', [5, 7, 10]);
    d.rr(-2, 16, 4, 5, 1.5, '#7fb85a');
    c.restore();
  },
  // 딸기: 역하트 원뿔 + 씨 점 + 잎 꼭지
  c12: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-14, -6); c.bezierCurveTo(-15, -14, 15, -14, 14, -6); c.bezierCurveTo(13, 6, 4, 16, 0, 18); c.bezierCurveTo(-4, 16, -13, 6, -14, -6); c.closePath(); }, '#ff4f6d', [0, 2, 16]);
    for (const [x, y] of [[-8, -3], [-2, -4], [4, -4], [9, -2], [-6, 3], [0, 2], [6, 3], [-3, 8], [3, 9], [0, 14]]) d.dot(x, y, .9, '#ffe066');
    for (const a of [-2.6, -2, -1.57, -1.1, -.5]) leafShape(d, 0, -10, 8, 2.6, a + PI, '#4fae3c');
    for (const a of [-2.6, -2, -1.57, -1.1, -.5]) leafShape(d, 0, -10, 7, 2.4, -a - PI, '#5cb85c');
    d.rr(-1, -17, 2, 6, 1, '#3f8e32');
  },
  // 데이지: 가는 하얀 꽃잎 여러 장 방사형 + 큰 노란 중심
  c13: (d) => {
    d.line(c => { c.moveTo(4, 8); c.quadraticCurveTo(8, 16, 6, 22); }, '#4f9e46', 2);
    for (let i = 0; i < 14; i++) { const a = i * 2 * PI / 14; leafShape(d, Math.cos(a) * 4, -2 + Math.sin(a) * 4, 13, 2.6, a, i % 2 ? '#ffffff' : '#f4f0ff'); }
    d.circle(0, -2, 6, '#ffd23f');
    for (const [x, y] of [[-2, -4], [2, -3], [0, 0], [-3, 0], [3, 0.5]]) d.dot(x, y, .8, '#e0a020');
  },
  // 블루베리: 작은 구슬 3알 무리 + 별 모양 꽃받침 구멍
  c14: (d) => {
    const c = d.ctx;
    d.line(c2 => { c2.moveTo(-2, -16); c2.quadraticCurveTo(0, -20, 6, -20); }, '#7a5236', 1.5);
    leafShape(d, 2, -18, 12, 4, -.3, '#5cb85c');
    for (const [x, y, r] of [[-8, 4, 9], [8, 6, 8.5], [0, -6, 8]]) {
      d.circle(x, y, r, '#5b6bd6');
      d.dot(x - r * .35, y - r * .35, r * .25, '#c9d0ff', .6);
      c.save(); c.translate(x, y - r * .1);
      d.line(c2 => { for (let i = 0; i < 5; i++) { const a = i * 2 * PI / 5; c2.moveTo(0, 0); c2.lineTo(Math.cos(a) * 2.4, Math.sin(a) * 2.4); } }, '#2f357a', 1);
      c.restore();
    }
  },
  // 고구마: 양끝 가늘어지는 방추형 + 가는 뿌리털 + 노란 단면
  c15: (d) => {
    const c = d.ctx;
    c.save(); c.rotate(-.45);
    d.shape(() => { c.beginPath(); c.moveTo(-21, 1); c.bezierCurveTo(-12, -11, 10, -12, 18, -3); c.quadraticCurveTo(20, 0, 18, 3); c.bezierCurveTo(10, 11, -12, 10, -21, 1); c.closePath(); }, '#b5547a', [0, 0, 18]);
    d.line(c2 => { c2.moveTo(-8, -6); c2.quadraticCurveTo(-6, 0, -9, 6); c2.moveTo(5, -7); c2.quadraticCurveTo(7, 0, 4, 7); }, '#93405f', 1);
    d.line(c2 => { c2.moveTo(-4, 8); c2.lineTo(-5, 12); c2.moveTo(8, 6); c2.lineTo(10, 10); c2.moveTo(-21, 1); c2.lineTo(-23, 2); }, '#c98aa0', .8);
    d.ell(18.5, 0, 2, 3.2, '#ffe38a');
    d.dot(-6, -5, 2.5, '#ffffff', .35);
    c.restore();
  },
  // 오이: 길쭉한 원통 + 오돌토돌 돌기 + 노란 꽃 끝
  c16: (d) => {
    const c = d.ctx;
    c.save(); c.rotate(-.7);
    d.rr(-21, -6, 40, 12, 6, '#4fa04f');
    d.line(c2 => { c2.moveTo(-17, -2); c2.lineTo(15, -2); c2.moveTo(-17, 2.5); c2.lineTo(15, 2.5); }, '#7fcf7a', 1);
    for (let x = -15; x <= 13; x += 5) { d.dot(x, -3.8, .9, '#d9f5c8'); d.dot(x + 2.5, 0, .9, '#d9f5c8'); d.dot(x, 3.8, .9, '#d9f5c8'); }
    d.rr(-23, -1.5, 4, 3, 1, '#3f8e32');
    for (let i = 0; i < 5; i++) { const a = i * 2 * PI / 5; d.ell(20 + Math.cos(a) * 2.2, Math.sin(a) * 2.2, 1.8, 1.8, '#ffe066'); }
    c.restore();
  },
  // 파프리카: 4개 로브 종 모양 + 굵은 초록 꼭지
  c17: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-14, -8); c.quadraticCurveTo(-18, 6, -11, 15); c.quadraticCurveTo(-7, 19, -3, 15); c.quadraticCurveTo(0, 19, 3, 15); c.quadraticCurveTo(7, 19, 11, 15); c.quadraticCurveTo(18, 6, 14, -8); c.quadraticCurveTo(7, -13, 0, -9); c.quadraticCurveTo(-7, -13, -14, -8); c.closePath(); }, '#ff7a3d', [0, 3, 16]);
    d.line(c2 => { c2.moveTo(-5, -8); c2.quadraticCurveTo(-7, 4, -3, 15); c2.moveTo(5, -8); c2.quadraticCurveTo(7, 4, 3, 15); }, '#e05a20', 1.2);
    d.ell(0, -10, 7, 3, '#3f9a32');
    d.shape(() => { c.beginPath(); c.moveTo(-2, -11); c.quadraticCurveTo(-2, -18, 4, -20); c.lineTo(5, -18); c.quadraticCurveTo(1, -16, 2, -11); c.closePath(); }, '#4fae3c', [1, -15, 5]);
    d.dot(-9, -2, 3, '#ffffff', .5);
  },
  // 장미: 꽃잎 소용돌이 + 바깥 꽃잎 + 잎
  c18: (d) => {
    leafShape(d, 0, 10, 12, 4.5, PI * .8, '#4fae3c');
    leafShape(d, 0, 10, 12, 4.5, PI * .2, '#5cb85c');
    d.line(c => { c.moveTo(0, 10); c.lineTo(0, 22); }, '#3f8e32', 2.2);
    for (let i = 0; i < 6; i++) { const a = i * PI / 3 + .3; d.circle(Math.cos(a) * 8, -3 + Math.sin(a) * 7, 7, '#e8304e'); }
    d.circle(0, -3, 9, '#ff3b5c');
    d.line(c => { for (let t = 0; t < 16; t += .3) { const r = .5 + t * .5, a = t * .9; t === 0 ? c.moveTo(Math.cos(a) * r, -3 + Math.sin(a) * r) : c.lineTo(Math.cos(a) * r, -3 + Math.sin(a) * r); } }, '#b81f3e', 1.3);
    d.dot(-4, -7, 2, '#ffffff', .4);
  },
  // 브로콜리: 몽글몽글 송이 구름 + 굵은 연두 줄기
  c19: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-5, 0); c.lineTo(-4, 20); c.quadraticCurveTo(0, 22, 4, 20); c.lineTo(5, 0); c.closePath(); }, '#a8d98a', [0, 10, 10]);
    d.line(c2 => { c2.moveTo(-2, 2); c2.lineTo(-8, -2); c2.moveTo(2, 4); c2.lineTo(8, 0); }, '#a8d98a', 3);
    for (const [x, y, r] of [[-12, -3, 7], [12, -3, 7], [-7, -11, 8], [7, -11, 8], [0, -15, 8], [0, -5, 8]]) d.circle(x, y, r, '#3f9e46');
    for (const [x, y] of [[-12, -4], [-7, -13], [0, -17], [7, -13], [12, -4], [-3, -6], [4, -7], [0, -11]]) { d.dot(x, y, 1.6, '#5cc066'); d.dot(x + 2, y + 2, 1.1, '#2f7e36'); }
  },
  // 해바라기: 큰 갈색 씨앗 중심 + 짧은 뾰족 노란 꽃잎 두 겹
  c20: (d) => {
    for (let i = 0; i < 16; i++) { const a = i * 2 * PI / 16 + .2; d.tri([[Math.cos(a - .25) * 8, Math.sin(a - .25) * 8], [Math.cos(a) * 21, Math.sin(a) * 21], [Math.cos(a + .25) * 8, Math.sin(a + .25) * 8]], '#f0b020'); }
    for (let i = 0; i < 16; i++) { const a = i * 2 * PI / 16; d.tri([[Math.cos(a - .25) * 8, Math.sin(a - .25) * 8], [Math.cos(a) * 18, Math.sin(a) * 18], [Math.cos(a + .25) * 8, Math.sin(a + .25) * 8]], '#ffcf3f'); }
    d.circle(0, 0, 10, '#7a4a2a');
    for (let r = 2.5; r < 9; r += 2.6) for (let a = 0; a < 2 * PI; a += 2.2 / r) d.dot(Math.cos(a + r) * r, Math.sin(a + r) * r, .9, '#4a2a18');
  },
  // 호박: 납작한 골 진 몸통 + 굵은 꼭지 + 덩굴손
  c21: (d) => {
    const c = d.ctx;
    d.ell(-9, 4, 9, 13, '#e87a10');
    d.ell(9, 4, 9, 13, '#e87a10');
    d.ell(-4, 4, 8, 14, '#ff8c1a');
    d.ell(4, 4, 8, 14, '#ff8c1a');
    d.ell(0, 4, 6, 14, '#ffa040');
    d.shape(() => { c.beginPath(); c.moveTo(-3, -9); c.lineTo(-2, -17); c.quadraticCurveTo(1, -20, 4, -18); c.lineTo(3, -9); c.closePath(); }, '#7a8a3a', [0, -13, 5]);
    d.line(c2 => { c2.moveTo(3, -14); c2.bezierCurveTo(10, -18, 12, -12, 8, -12); c2.quadraticCurveTo(6, -13, 8, -15); }, '#5cb85c', 1.2);
    leafShape(d, -2, -13, 10, 4, PI + .3, '#5cb85c');
  },
  // 수박: 큰 원 + 진한 지그재그 줄무늬 (반달 조각 함께)
  c22: (d) => {
    const c = d.ctx;
    d.circle(-3, -2, 17, '#3fae5a');
    d.line(c2 => { for (const k of [-.75, -.35, .05, .45]) { const x0 = -3 + k * 17; c2.moveTo(x0, -18); for (let y = -16; y <= 14; y += 4) c2.lineTo(x0 + (y / 4 % 2 ? 2 : -1) + k * (y + 2) * .4, y); } }, '#1f6e34', 2.4);
    d.rr(-1.5, -21, 3, 4, 1, '#7a8a3a');
    c.save(); c.translate(9, 12); c.rotate(-.3);
    d.shape(() => { c.beginPath(); c.moveTo(-11, 0); c.arc(0, 0, 11, 0, PI); c.closePath(); }, '#2f9e4a', [0, 4, 11]);
    d.shape(() => { c.beginPath(); c.moveTo(-9.5, 0); c.arc(0, 0, 9.5, 0, PI); c.closePath(); }, '#ffffff', [0, 4, 9]);
    d.shape(() => { c.beginPath(); c.moveTo(-8.5, 0); c.arc(0, 0, 8.5, 0, PI); c.closePath(); }, '#ff5a6a', [0, 4, 8]);
    for (const [x, y] of [[-4, 3], [0, 5], [4, 3], [-2, 2], [2, 2]]) d.ell(x, y, .8, 1.2, '#3a2a2a');
    c.restore();
  },
  // 멜론: 둥근 연두 + 그물 무늬 + T자 꼭지
  c23: (d) => {
    d.circle(0, 2, 18, '#c9e88a');
    d.ctx.save(); d.ctx.beginPath(); d.ctx.arc(0, 2, 17, 0, 7); d.ctx.clip();
    d.line(c => { for (let k = -24; k <= 24; k += 6) { c.moveTo(k - 10, -18); c.quadraticCurveTo(k + 3, 2, k - 4, 22); c.moveTo(-20, k); c.quadraticCurveTo(0, k + 5, 20, k - 1); } }, '#f6fbe0', 1);
    d.ctx.restore();
    d.rr(-1.5, -20, 3, 6, 1, '#8a9a4a');
    d.rr(-5, -21, 10, 2.4, 1.2, '#8a9a4a');
    d.dot(-7, -6, 3, '#ffffff', .4);
  },
  // 파인애플: 타원 몸통 + 마름모 격자 + 뾰족 잎 왕관
  c24: (d) => {
    const c = d.ctx;
    for (const [a, l, col] of [[-PI / 2, 14, '#3f9a32'], [-PI / 2 - .45, 12, '#4fae3c'], [-PI / 2 + .45, 12, '#4fae3c'], [-PI / 2 - .9, 9, '#5cb85c'], [-PI / 2 + .9, 9, '#5cb85c']]) leafShape(d, 0, -8, l, 2.4, a, col);
    d.ell(0, 7, 11, 14, '#ffc94f');
    c.save(); c.beginPath(); c.ellipse(0, 7, 11, 14, 0, 0, 7); c.clip();
    d.line(c2 => { for (let k = -30; k <= 30; k += 5) { c2.moveTo(k - 14, -8); c2.lineTo(k + 14, 22); c2.moveTo(k + 14, -8); c2.lineTo(k - 14, 22); } }, '#c98e1a', 1);
    c.restore();
    for (const [x, y] of [[-5, 2], [0, 5], [5, 2], [-5, 10], [0, 13], [5, 10], [0, -3]]) d.dot(x, y + 2.5, .8, '#8a5a1a');
  },
  // 바닐라: 가늘고 긴 검갈색 꼬투리 두 개 + 하얀 바닐라 꽃
  c25: (d) => {
    const c = d.ctx;
    for (const [rot, col] of [[-.35, '#5a3a22'], [.15, '#6b4528']]) {
      c.save(); c.rotate(rot);
      d.rr(-2, -18, 4, 36, 2, col);
      d.line(c2 => { c2.moveTo(0, -16); c2.quadraticCurveTo(1, 0, 0, 16); }, '#3a2414', .7);
      c.restore();
    }
    c.save(); c.translate(8, -10);
    for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * 2 * PI / 5; leafShape(d, 0, 0, 8, 2.8, a, '#f3e6c9'); }
    d.circle(0, 0, 3, '#ffe38a');
    d.dot(0, 0, 1.2, '#e8b040');
    c.restore();
    d.rr(-6, 6, 12, 3, 1.5, '#ff9fbf');
  },
  // 라벤더: 세 줄기 + 줄기마다 촘촘한 보라 꽃송이 이삭
  c26: (d) => {
    for (const [bx, tilt, h] of [[-7, -.25, 20], [0, 0, 24], [7, .25, 20]]) {
      const tx = bx * .4 + Math.sin(tilt) * h, ty = 18 - h;
      d.line(c => { c.moveTo(0, 18); c.quadraticCurveTo(bx * .3, 6, tx, ty + 10); }, '#6a9e5a', 1.5);
      for (let i = 0; i < 6; i++) { const y = ty + 10 - i * 2.8, x = tx + Math.sin(tilt) * (-i * 1.2); d.ell(x - 1.6, y, 1.9, 1.5, i % 2 ? '#a77bff' : '#9060f0'); d.ell(x + 1.6, y - 1.2, 1.9, 1.5, '#b890ff'); }
      d.circle(tx + Math.sin(tilt) * -7, ty - 6, 1.6, '#c8a8ff');
    }
    d.rr(-4, 12, 8, 3.5, 1.5, '#ff9fbf');
  },
  // 카카오: 럭비공 모양 꼬투리 + 세로 골 + 반 갈라진 단면의 하얀 씨
  c27: (d) => {
    const c = d.ctx;
    c.save(); c.rotate(.5);
    d.shape(() => { c.beginPath(); c.moveTo(0, -20); c.bezierCurveTo(13, -14, 13, 12, 0, 20); c.bezierCurveTo(-13, 12, -13, -14, 0, -20); c.closePath(); }, '#8a5a3b', [0, 0, 18]);
    d.line(c2 => { for (const k of [-.6, -.2, .2, .6]) { c2.moveTo(0, -19); c2.bezierCurveTo(k * 18, -10, k * 18, 10, 0, 19); } }, '#6a4028', 1.1);
    d.dot(-4, -8, 2.5, '#ffffff', .3);
    c.restore();
    d.rr(-2, -21, 4, 4, 1.5, '#5a8a3a');
    for (const [x, y] of [[-15, 12], [-10, 16], [-16, 18]]) { d.ell(x, y, 3, 2.2, '#f8f0e0'); d.dot(x - .8, y - .6, .7, '#ffffff'); }
  },
  // 커피콩: 가지에 붉은 커피체리 송이 + 갈색 원두(가운데 골) 두 알
  c28: (d) => {
    const c = d.ctx;
    d.line(c2 => { c2.moveTo(-20, -14); c2.quadraticCurveTo(-4, -16, 10, -8); }, '#7a5236', 2);
    leafShape(d, 6, -10, 12, 4, -.6, '#3f8e32');
    for (const [x, y] of [[-12, -8], [-6, -6], [-9, -1], [-2, -2]]) { d.circle(x, y, 4, '#d0303a'); d.dot(x - 1.2, y - 1.4, 1, '#ffb0b0', .7); d.dot(x + .5, y + 1.2, .8, '#7a1a20'); }
    for (const [x, y, r] of [[6, 10, -.4], [14, 6, .5]]) {
      c.save(); c.translate(x, y); c.rotate(r);
      d.ell(0, 0, 6, 7.5, '#6b3a2a');
      d.line(c2 => { c2.moveTo(0, -6); c2.quadraticCurveTo(2.5, 0, 0, 6); }, '#2f1a12', 1.3);
      d.dot(-2.5, -3, 1.5, '#ffffff', .3);
      c.restore();
    }
  },
  // 사탕수수: 마디 있는 굵은 줄기 세 개 묶음 + 끝 잎
  c29: (d) => {
    const c = d.ctx;
    for (const [rot, x, col] of [[-.3, -4, '#e88ac0'], [.3, 4, '#ff9fcf'], [0, 0, '#ffb3d9']]) {
      c.save(); c.rotate(rot); c.translate(x * .3, 0);
      d.rr(-3, -19, 6, 39, 2.5, col);
      for (const y of [-11, -3, 5, 13]) { d.rr(-3.6, y - 1, 7.2, 2.2, 1, '#c86aa0'); d.dot(-1.5, y - 3.5, .7, '#ffffff', .6); }
      leafShape(d, 0, -19, 9, 2, -PI / 2 + rot * 2 + .5, '#6cc46a');
      c.restore();
    }
    d.rr(-6, 2, 12, 4, 2, '#8fd66a');
  },
  // 황금딸기: 금색 딸기(넓고 각진 모양) + 왕관 같은 잎 + 반짝이 별
  c30: (d) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-13, -5); c.bezierCurveTo(-14, -13, 14, -13, 13, -5); c.bezierCurveTo(12, 6, 4, 15, 0, 17); c.bezierCurveTo(-4, 15, -12, 6, -13, -5); c.closePath(); }, '#ffd23f', [0, 2, 15]);
    for (const [x, y] of [[-7, -3], [0, -4], [7, -3], [-4, 3], [4, 3], [0, 9]]) { d.dot(x, y, 1.1, '#e0a010'); d.dot(x - .4, y - .4, .45, '#fff8c0'); }
    for (let i = -2; i <= 2; i++) { const x0 = i * 4; d.tri([[x0 - 2.6, -9], [x0 * 1.3, i === 0 ? -19 : -16 + Math.abs(i)], [x0 + 2.6, -9]], '#4fae3c'); }
    d.dot(0, -18, 1.4, '#ffffff', .8);
    d.dot(-6, -4, 3, '#ffffff', .55);
    const star = (x, y, r) => d.shape(() => { c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4, rr = i % 2 ? r * .3 : r; i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + rr, y); } c.closePath(); }, '#fff6b0', [x, y, r]);
    star(15, -12, 5); star(-16, 6, 4); star(13, 12, 3);
  },
};
