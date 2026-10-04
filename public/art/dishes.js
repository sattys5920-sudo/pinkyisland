// 요리 아이콘 24 종 (d01..d24). (0,0) 중심, 약 -22..22 범위.
const PI = Math.PI;
const steam = (d, xs, y0, col = '#ffffff') => {
  xs.forEach((x, i) => d.line(c => { c.moveTo(x, y0); c.quadraticCurveTo(x - 3, y0 - 4, x, y0 - 8); c.quadraticCurveTo(x + 3, y0 - 12, x, y0 - 15 + (i % 2) * 2); }, col, 1.6));
};
// 그릇 아래 반원 (위 테두리 y, 반폭 w, 깊이 h)
const bowl = (d, y, w, h, col) => {
  const c = d.ctx;
  d.shape(() => { c.beginPath(); c.moveTo(-w, y); c.quadraticCurveTo(-w, y + h, 0, y + h); c.quadraticCurveTo(w, y + h, w, y); c.closePath(); }, col, [0, y + h / 2, w]);
};
// 케이크 조각 (옆면 삼각 쐐기): 앞면 사각 + 윗면
const wedgeTop = (d, x1, x2, y, tipX, tipY, col) => {
  const c = d.ctx;
  d.shape(() => { c.beginPath(); c.moveTo(x1, y); c.lineTo(tipX, tipY); c.lineTo(x2, y); c.closePath(); }, col, [(x1 + x2 + tipX) / 3, (y * 2 + tipY) / 3, Math.abs(x2 - x1) / 2]);
};
const poly = (d, pts, col) => {
  const c = d.ctx;
  let sx = 0, sy = 0; pts.forEach(p => { sx += p[0]; sy += p[1]; });
  const cx = sx / pts.length, cy = sy / pts.length;
  let r = 0; pts.forEach(p => { r = Math.max(r, Math.hypot(p[0] - cx, p[1] - cy)); });
  d.shape(() => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); }, col, [cx, cy, r]);
};
const sparkle = (d, x, y, r, col = '#ffffff') => {
  d.line(c => { c.moveTo(x - r, y); c.lineTo(x + r, y); c.moveTo(x, y - r); c.lineTo(x, y + r); }, col, 1.4);
  d.dot(x, y, r * .3, col);
};
const strawberry = (d, x, y, s) => {
  const c = d.ctx;
  d.shape(() => { c.beginPath(); c.moveTo(x - 4 * s, y - 2 * s); c.quadraticCurveTo(x - 4.5 * s, y + 3 * s, x, y + 5 * s); c.quadraticCurveTo(x + 4.5 * s, y + 3 * s, x + 4 * s, y - 2 * s); c.quadraticCurveTo(x, y - 4 * s, x - 4 * s, y - 2 * s); c.closePath(); }, '#ff4f6a', [x, y, 5 * s]);
  d.ell(x, y - 3 * s, 3 * s, 1.3 * s, '#4fae3c');
  d.dot(x - 1.5 * s, y, .5 * s, '#ffe9a0'); d.dot(x + 1.5 * s, y + 1 * s, .5 * s, '#ffe9a0'); d.dot(x, y + 2.5 * s, .5 * s, '#ffe9a0');
};
const fishShape = (d, x, y, len, col, belly) => {
  const c = d.ctx, h = len * .32;
  d.shape(() => { c.beginPath(); c.moveTo(x + len * .4, y - h * .7); c.lineTo(x + len * .55, y); c.lineTo(x + len * .4, y + h * .7); c.closePath(); }, col, [x + len * .47, y, h]);
  d.ell(x - len * .05, y, len * .45, h, col);
  if (belly) d.ell(x - len * .05, y + h * .4, len * .35, h * .4, belly);
  d.dot(x - len * .32, y - h * .2, len * .05, '#2d2d3a');
  d.dot(x - len * .33, y - h * .27, len * .02, '#ffffff');
};

export const ART_PART = {
  // 토마토 수프: 하얀 그릇 + 빨간 수프 + 바질잎 + 김
  d01: (d) => {
    steam(d, [-6, 0, 6], -4);
    d.ell(0, 0, 18, 5, '#f4efe8');
    d.ell(0, 0, 15.5, 3.8, '#e8452f');
    d.dot(-4, -.5, 2.2, '#ffffff', .8);
    d.ell(4, 0, 3, 1.4, '#4fae3c');
    bowl(d, 1.5, 18, 15, '#fbf6ef');
    d.stitch(c => { c.moveTo(-15, 7); c.quadraticCurveTo(0, 14, 15, 7); }, '#ff8f8f', .8);
    d.rr(-7, 15, 14, 4, 2, '#ece2d6');
  },
  // 새싹 샐러드: 초록 유리볼 + 상추, 방울토마토, 새싹
  d02: (d) => {
    d.circle(-8, -2, 7, '#7cc95a');
    d.circle(7, -3, 7, '#8fd66a');
    d.circle(0, -5, 7, '#a8e27f');
    [-3, 1, 5].forEach((x, i) => {
      d.line(c => { c.moveTo(x, -2); c.lineTo(x + (i - 1) * 2, -13); }, '#f6f8ea', 1.3);
      d.ell(x + (i - 1) * 2 - 2, -14, 2.4, 1.3, '#9fdc6a'); d.ell(x + (i - 1) * 2 + 2, -14, 2.4, 1.3, '#c9f0a0');
    });
    d.circle(-9, -6, 3.5, '#ff4f4f'); d.dot(-10, -7, 1, '#ffffff', .7);
    d.circle(10, -7, 3, '#ff4f4f');
    bowl(d, 0, 18, 16, '#7fd0c8');
    d.ell(0, 0, 18, 2, '#a6e6df');
    d.dot(-9, 6, 2.5, '#ffffff', .4);
    d.rr(-6, 15, 12, 4, 2, '#5fb8af');
  },
  // 래디시 피클: 유리병 + 분홍 동그라미 조각 + 체크 천 뚜껑
  d03: (d) => {
    d.rr(-12, -10, 24, 30, 6, '#dff3f2');
    for (let i = 0; i < 6; i++) { const x = -6 + (i % 3) * 6, y = 0 + Math.floor(i / 3) * 9; d.circle(x, y + 3, 4, '#ff7fae'); d.circle(x, y + 3, 2.3, '#fff0f4'); }
    d.dot(-8, -4, 2, '#ffffff', .7);
    d.rr(-10, -14, 20, 5, 2, '#e6d4c0');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-14, -14); c.quadraticCurveTo(0, -24, 14, -14); c.lineTo(10, -11); c.lineTo(-10, -11); c.closePath(); }, '#ff8fb0', [0, -15, 14]);
    d.dot(-6, -16, 1.5, '#ffffff'); d.dot(0, -18, 1.5, '#ffffff'); d.dot(6, -16, 1.5, '#ffffff');
    d.line(c => { c.moveTo(-11, -12); c.lineTo(11, -12); }, '#c9566f', 1.5);
  },
  // 시금치 키슈: 접시 위 파이 조각, 노란 속 + 초록 시금치 점
  d04: (d) => {
    d.ell(0, 10, 20, 7, '#f2f2f8');
    d.ell(0, 10, 15, 4.5, '#e6e6ef');
    poly(d, [[-16, 0], [14, -6], [14, 4], [-16, 10]], '#ffe08a');
    wedgeTop(d, 14, 14, -6, -16, 0, '#ffe08a');
    poly(d, [[-16, 0], [14, -6], [10, -14]], '#ffe7a0');
    d.dot(-2, -6, 1.8, '#3f8e32'); d.dot(5, -9, 1.5, '#4fae3c'); d.dot(-7, -3, 1.4, '#3f8e32');
    d.dot(-4, 3, 1.6, '#3f8e32'); d.dot(6, 0, 1.6, '#4fae3c'); d.dot(-10, 6, 1.3, '#3f8e32');
    d.rr(12, -14, 6, 19, 3, '#d99a4e');
    d.stitch(c => { c.moveTo(15, -12); c.lineTo(15, 3); }, '#fff2d6', .8);
  },
  // 당근 케이크: 갈색 시트 3단 + 흰 크림 + 위에 크림 당근
  d05: (d) => {
    d.ell(0, 15, 19, 5, '#f2f2f8');
    poly(d, [[-16, -2], [12, -8], [12, 14], [-16, 18]], '#c98a4b');
    d.line(c => { c.moveTo(-16, 4); c.lineTo(12, -1); c.moveTo(-16, 11); c.lineTo(12, 7); }, '#fff6ea', 2.2);
    d.dot(-8, 8, 1, '#ff9a3c'); d.dot(2, 2, 1, '#ff9a3c'); d.dot(-3, 14, 1, '#ff9a3c'); d.dot(6, 11, 1, '#ff9a3c');
    poly(d, [[-16, -2], [12, -8], [16, -6], [16, 12], [12, 14], [12, -8]], '#b07840');
    poly(d, [[-17, -3], [12, -9], [17, -7]], '#fff6ea');
    d.circle(-4, -11, 3, '#ffffff'); d.circle(4, -12, 3, '#ffffff');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-2, -13); c.lineTo(2, -14); c.lineTo(8, -21); c.closePath(); }, '#ff8a2a', [3, -16, 5]);
    d.ell(-1, -15, 2, 1.2, '#4fae3c');
  },
  // 감자 그라탕: 타원 도자기 그릇 + 노릇 치즈, 탄 반점
  d06: (d) => {
    d.ell(-19, 4, 3, 2, '#e8d9c4'); d.ell(19, 4, 3, 2, '#e8d9c4');
    d.ell(0, 6, 18, 10, '#f6efe4');
    d.ell(0, 3, 15, 7, '#ffd25a');
    d.dot(-6, 1, 3, '#d98c2a', .8); d.dot(5, 4, 2.5, '#c97a20', .8); d.dot(1, -1, 2, '#e09a38', .8); d.dot(9, 0, 1.8, '#c97a20', .7); d.dot(-9, 6, 1.6, '#e09a38', .7);
    d.dot(-2, 5, 1.2, '#7a4a1a', .6);
    d.dot(-1, -1, 1, '#4fae3c'); d.dot(3, 1, .9, '#4fae3c');
    d.stitch(c => { c.ellipse(0, 6, 17, 9.5, 0, 0.2, PI - .2); }, '#c9b090', .8);
    steam(d, [-4, 4], -5);
  },
  // 옥수수 버터구이: 꼬치 + 구운 자국 + 녹는 버터
  d07: (d) => {
    d.ctx.save(); d.ctx.rotate(-.5);
    d.rr(-1.5, 10, 3, 12, 1.5, '#e0c08a');
    d.rr(-8, -20, 16, 32, 8, '#ffd23f');
    for (let y = -16; y <= 8; y += 4) for (let x = -5; x <= 5; x += 3.4) d.dot(x, y, 1.4, '#ffe680');
    d.line(c => { c.moveTo(-7, -8); c.lineTo(7, -12); c.moveTo(-7, 2); c.lineTo(7, -2); }, '#a8641c', 2);
    d.rr(-4, -18, 8, 5, 1.5, '#fff4b0');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-4, -13); c.quadraticCurveTo(-4, -8, -2, -8); c.quadraticCurveTo(0, -11, 2, -6); c.quadraticCurveTo(4, -9, 4, -13); c.closePath(); }, '#fff4b0', [0, -10, 4]);
    d.dot(-1, -17, 1, '#ffffff');
    d.ctx.restore();
  },
  // 딸기 케이크: 흰 생크림 조각 + 딸기 단면 + 위에 딸기
  d08: (d) => {
    d.ell(0, 15, 19, 5, '#ffe8f0');
    poly(d, [[-16, -2], [12, -8], [12, 14], [-16, 18]], '#ffe6a8');
    d.line(c => { c.moveTo(-16, 5); c.lineTo(12, -1); }, '#ffffff', 3.5);
    [-11, -4, 3].forEach((x, i) => { d.ell(x, 4.5 - i * 1.5 + 0.3 * (x), 2.5, 2, '#ff4f6a'); });
    poly(d, [[12, -8], [16, -6], [16, 12], [12, 14]], '#fff6f8');
    poly(d, [[-17, -3], [12, -9], [17, -7]], '#ffffff');
    d.circle(-8, -6, 2.5, '#ffffff'); d.circle(-1, -8, 2.5, '#ffffff'); d.circle(6, -9, 2.5, '#ffffff');
    strawberry(d, 2, -15, 1.2);
  },
  // 블루베리 머핀: 주름 컵 + 볼록한 머핀 머리 + 블루베리 점
  d09: (d) => {
    poly(d, [[-13, 2], [13, 2], [10, 20], [-10, 20]], '#7fb0ff');
    d.line(c => { for (let x = -9; x <= 9; x += 4.5) { c.moveTo(x * 1.3, 3); c.lineTo(x, 19); } }, '#5a8ae0', 1.2);
    d.circle(-8, -3, 8, '#e8b46a');
    d.circle(8, -3, 8, '#e8b46a');
    d.circle(0, -8, 11, '#f0c27a');
    d.ell(0, 3, 16, 3, '#e0a85e');
    [[-6, -10], [3, -13], [7, -5], [-2, -4], [-10, -2], [11, -1], [4, -9]].forEach(([x, y]) => { d.circle(x, y, 2.3, '#4a4fb8'); d.dot(x - .6, y - .7, .6, '#b8c0ff'); });
    d.dot(-5, -14, 2.5, '#ffffff', .4);
  },
  // 고구마 맛탕: 접시 위 노란 속살 덩어리 + 보라 껍질 + 시럽 반짝 + 깨
  d10: (d) => {
    d.ell(0, 9, 21, 9, '#ffffff');
    d.ell(0, 9, 17, 6.5, '#f3e6d0');
    const chunk = (x, y, a) => {
      d.ctx.save(); d.ctx.translate(x, y); d.ctx.rotate(a);
      poly(d, [[-6, -4], [5, -5], [7, 3], [-5, 5]], '#ffb43a');
      d.line(c => { c.moveTo(-6, -4); c.lineTo(5, -5); }, '#8a3f8a', 2.2);
      d.dot(-2, -1, 1.8, '#ffffff', .7);
      d.ctx.restore();
    };
    chunk(-8, 7, -.3); chunk(7, 8, .4); chunk(0, 0, .1); chunk(-3, 11, .6);
    d.dot(-6, 3, .7, '#2d2d2d'); d.dot(4, 2, .7, '#fff8e0'); d.dot(9, 5, .7, '#2d2d2d'); d.dot(-1, 7, .7, '#fff8e0');
    d.line(c => { c.moveTo(-14, -6); c.quadraticCurveTo(-12, -14, -4, -12); }, '#ffcf5a', 1.8);
    sparkle(d, 12, -8, 3);
  },
  // 호박 파이: 주황 조각 + 굵은 물결 크러스트 + 크림 한 덩이
  d11: (d) => {
    d.ell(0, 14, 20, 6, '#f2f2f8');
    poly(d, [[-17, 4], [14, -4], [14, 10], [-17, 16]], '#d99a4e');
    poly(d, [[-17, 4], [14, -4], [14, 2], [-17, 10]], '#f08a24');
    poly(d, [[-17, 4], [14, -4], [6, -16]], '#ff9a30');
    for (let i = 0; i < 5; i++) d.circle(14 - i * .5, -14 + i * 4, 3, '#e8b06a');
    d.circle(0, -7, 4, '#fff8ee'); d.circle(-2, -10, 2.8, '#ffffff'); d.dot(-1, -13, 1.2, '#ffffff');
    d.dot(4, -6, .8, '#8a5020'); d.dot(-8, -1, .8, '#8a5020');
  },
  // 수박 화채: 넓은 유리 볼 + 분홍 국물 + 동그란 수박 알 + 잎
  d12: (d) => {
    bowl(d, -2, 20, 18, '#cfeef0');
    d.ell(0, -2, 20, 5, '#e6fafb');
    d.ell(0, -2, 17.5, 3.8, '#ff9ab0');
    [[-11, -3], [-5, -1], [2, -4], [8, -1], [13, -3]].forEach(([x, y], i) => { d.circle(x, y, 3.5, i % 2 ? '#ff5f73' : '#ffd2dc'); });
    d.dot(-5, -1, .8, '#2d2d2d'); d.dot(-11, -3, .6, '#ff5f73');
    d.circle(-4, 7, 3, '#ff7fa0'); d.circle(5, 9, 2.6, '#ffe7ef'); d.circle(10, 4, 2.2, '#ff5f73');
    d.ell(5, -8, 4, 1.8, '#5cc46a');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-16, -7); c.lineTo(-10, -10); c.arc(-13, -10, 3.5, 0, PI); c.closePath(); }, '#4caf50', [-13, -9, 4]);
    d.dot(-9, 4, 3, '#ffffff', .4);
    d.rr(-7, 15, 14, 4, 2, '#a8dfe2');
  },
  // 멜론 빙수: 굽 달린 유리컵 + 소복한 연두 얼음 산 + 멜론 볼 + 숟가락
  d13: (d) => {
    d.rr(-2, 12, 4, 6, 1, '#d6f2f7');
    d.ell(0, 19, 9, 2.5, '#d6f2f7');
    bowl(d, 2, 15, 12, '#d6f2f7');
    d.circle(-7, -1, 8, '#c8f2a8');
    d.circle(7, -1, 8, '#c8f2a8');
    d.circle(0, -7, 11, '#d8f8bc');
    d.circle(-3, -14, 3, '#9ee07a'); d.circle(4, -15, 3, '#9ee07a'); d.circle(0, -19, 3, '#b5ea8a');
    d.dot(-6, -9, 1.2, '#ffffff'); d.dot(5, -6, 1.2, '#ffffff'); d.dot(-1, -2, 1, '#ffffff'); d.dot(-9, 0, 1, '#ffffff');
    d.line(c => { c.moveTo(10, -6); c.lineTo(17, -18); }, '#ff9fbf', 2);
    d.ell(9.5, -5, 2, 1.4, '#ff9fbf');
    d.dot(-8, 8, 2, '#ffffff', .6);
  },
  // 파인애플 타르트: 둥근 주름 타르트 껍질 + 노란 방사형 파인애플 + 체리
  d14: (d) => {
    for (let i = 0; i < 14; i++) { const a = i * 2 * PI / 14; d.circle(Math.cos(a) * 16, 3 + Math.sin(a) * 9, 3.6, '#e0a860'); }
    d.ell(0, 3, 16, 9, '#e8b46a');
    d.ell(0, 2, 13, 7, '#fff2c0');
    for (let i = 0; i < 8; i++) {
      const a = i * PI / 4;
      d.ctx.save(); d.ctx.translate(Math.cos(a) * 7.5, 2 + Math.sin(a) * 4); d.ctx.rotate(a);
      d.ell(0, 0, 4, 2.3, '#ffd23f'); d.ctx.restore();
    }
    d.dot(-5, 0, 1, '#ffffff', .8); d.dot(5, 3, 1, '#ffffff', .8);
    d.circle(0, 1, 3.4, '#e8304a'); d.dot(-1, 0, 1, '#ffffff', .8);
    d.line(c => { c.moveTo(0, -2); c.quadraticCurveTo(2, -9, 6, -11); }, '#4fae3c', 1.3);
    d.ell(0, -12, 4, 2, '#5cb85c'); d.ell(-5, -11, 3, 1.5, '#7fd07a');
  },
  // 바닐라 아이스크림: 와플 콘 + 크림 두 스쿱 + 녹는 방울 + 바닐라 점
  d15: (d) => {
    d.tri([[-9, 0], [9, 0], [0, 22]], '#e0a85e');
    d.line(c => { c.moveTo(-6, 2); c.lineTo(3, 15); c.moveTo(0, 1); c.lineTo(6, 9); c.moveTo(6, 2); c.lineTo(-3, 15); c.moveTo(0, 1); c.lineTo(-6, 9); }, '#b0742e', 1.2);
    d.circle(0, -4, 9, '#fff6dc');
    d.circle(0, -13, 7.5, '#fffaea');
    d.ell(-6, 1, 3, 4, '#fff6dc'); d.ell(5, 1, 2.5, 5, '#fff6dc');
    d.dot(-3, -6, .7, '#5a3a20'); d.dot(3, -2, .7, '#5a3a20'); d.dot(1, -14, .7, '#5a3a20'); d.dot(-3, -12, .7, '#5a3a20');
    d.dot(-3, -16, 2, '#ffffff', .8);
    d.rr(3, -26, 4, 8, 2, '#c08850');
  },
  // 라벤더 쿠키: 겹쳐진 동그란 쿠키 두 장 + 보라 아이싱 꽃 + 라벤더 줄기
  d16: (d) => {
    d.circle(-6, 4, 12, '#f0d29a');
    d.dot(-12, 2, 1, '#c99a50'); d.dot(-3, 10, 1, '#c99a50'); d.dot(-9, 10, 1, '#c99a50');
    d.circle(6, -2, 12, '#f5dca8');
    d.circle(6, -2, 9, '#d8c0f5');
    for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * 2 * PI / 5; d.circle(6 + Math.cos(a) * 3.5, -2 + Math.sin(a) * 3.5, 2.2, '#a77ee0'); }
    d.dot(6, -2, 1.6, '#fff4b0');
    d.stitch(c => { c.arc(6, -2, 10.5, 0, 2 * PI); }, '#ffffff', .7);
    d.line(c => { c.moveTo(-18, 18); c.lineTo(-12, -14); }, '#6cae5a', 1.2);
    [-14, -10, -6, -2].forEach((y, i) => { d.ell(-12.5 - (y + 14) * .2 - 1.5, y - 1, 1.6, 2.2, '#9b6ee0'); d.ell(-12.5 - (y + 14) * .2 + 1.5, y, 1.6, 2.2, '#b590f0'); });
  },
  // 초콜릿 봉봉: 하트 상자 뚜껑 + 종이컵 속 봉봉 넷
  d17: (d) => {
    d.rr(-20, -4, 40, 22, 4, '#ff7fae');
    d.rr(-17, -1, 34, 16, 3, '#ffd6e6');
    const bon = (x, y, kind) => {
      d.circle(x, y + 1, 5.6, '#ffffff');
      d.circle(x, y, 4.6, kind === 1 ? '#f6e6d0' : '#5a3020');
      if (kind === 0) d.line(c => { c.moveTo(x - 3, y - 1); c.lineTo(x - 1, y + 1); c.lineTo(x + 1, y - 1); c.lineTo(x + 3, y + 1); }, '#c08860', 1);
      if (kind === 1) d.dot(x, y - 1, 1.5, '#ff4f6a');
      if (kind === 2) { d.dot(x - 1.5, y - 1, .7, '#ff9fbf'); d.dot(1 + x, y, .7, '#fff4b0'); d.dot(x, y - 2.5, .7, '#9fdcff'); }
      if (kind === 3) d.ell(x, y - 1.5, 3, 1.3, '#8a5030');
      d.dot(x - 1.8, y - 2, 1, '#ffffff', .6);
    };
    bon(-10, 3, 0); bon(-3, 9, 1); bon(4, 3, 2); bon(11, 9, 3);
    d.ctx.save(); d.ctx.translate(-2, -12); d.ctx.rotate(-.18);
    d.rr(-16, -6, 32, 9, 4, '#ff5f95');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-7, -4, -4, -10, 0, -6); c.bezierCurveTo(4, -10, 7, -4, 0, 0); c.closePath(); }, '#ffffff', [0, -4, 5]);
    d.ctx.restore();
  },
  // 카페라테: 받침 접시 + 손잡이 컵 + 하트 라테아트
  d18: (d) => {
    d.ell(0, 15, 21, 5, '#f4efe8');
    d.ell(0, 14, 12, 2.5, '#e2d8cc');
    d.circle(14, 2, 6, '#ffffff'); d.circle(14, 2, 3.2, '#f4efe8');
    bowl(d, -4, 15, 19, '#ffffff');
    d.ell(0, -4, 15, 5, '#f4efe8');
    d.ell(0, -4, 13, 4, '#b0703a');
    d.ell(0, -4, 10, 3, '#d9a874');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(0, -1); c.bezierCurveTo(-7, -4, -4, -8, 0, -5.5); c.bezierCurveTo(4, -8, 7, -4, 0, -1); c.closePath(); }, '#fff8ee', [0, -4, 4]);
    d.dot(-8, 4, 2, '#ff9fbf', .5); d.dot(8, 4, 2, '#ff9fbf', .5);
    steam(d, [-5, 5], -10);
  },
  // 솜사탕: 나무 막대 + 분홍/하늘 뭉게 구름
  d19: (d) => {
    d.line(c => { c.moveTo(0, 2); c.lineTo(2, 22); }, '#e0c08a', 2.6);
    [[-8, -6, 8, '#ffb3d1'], [8, -8, 8, '#bfe3ff'], [0, -14, 9, '#ffc8de'], [-4, 0, 7, '#d8ecff'], [6, 0, 7, '#ffb3d1'], [0, -5, 8, '#ffd6e6']].forEach(([x, y, r, col]) => d.circle(x, y, r, col));
    d.dot(-5, -15, 2.5, '#ffffff', .7); d.dot(6, -11, 1.8, '#ffffff', .6);
    d.stitch(c => { c.moveTo(-10, -4); c.quadraticCurveTo(-4, -9, 2, -5); c.moveTo(1, -16); c.quadraticCurveTo(7, -14, 10, -8); }, '#ffffff', .8);
    sparkle(d, 15, -17, 2.5, '#fff4b0');
  },
  // 황금딸기 파르페: 긴 유리잔 층층이 + 위에 금빛 딸기, 반짝이
  d20: (d) => {
    d.rr(-1.5, 15, 3, 4, 1, '#e6f6ff');
    d.ell(0, 20, 7, 2, '#e6f6ff');
    poly(d, [[-10, -8], [10, -8], [7, 15], [-7, 15]], '#e6f6ff');
    poly(d, [[-9.4, 9], [9.4 - 0.1, 9], [7, 15], [-7, 15]], '#ff7f9a');
    poly(d, [[-9.6, 4], [9.6, 4], [9.3, 9], [-9.3, 9]], '#fffaf0');
    poly(d, [[-9.8, -1], [9.8, -1], [9.6, 4], [-9.6, 4]], '#e0a85e');
    poly(d, [[-10, -6], [10, -6], [9.8, -1], [-9.8, -1]], '#fff2c4');
    d.circle(-5, -9, 5, '#ffffff'); d.circle(5, -9, 5, '#fffaea'); d.circle(0, -12, 5.5, '#ffffff');
    d.rr(5, -22, 2, 12, 1, '#7a4a20');
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(-5, -16); c.quadraticCurveTo(-5.5, -10, 0, -8); c.quadraticCurveTo(5.5, -10, 5, -16); c.quadraticCurveTo(0, -19, -5, -16); c.closePath(); }, '#ffcc2a', [0, -13, 6]);
    d.ell(0, -17, 3.5, 1.4, '#4fae3c');
    d.dot(-2, -13, .7, '#fff8d0'); d.dot(2, -12, .7, '#fff8d0'); d.dot(0, -10.5, .7, '#fff8d0');
    d.dot(-7, 4, 1.8, '#ffffff', .6);
    sparkle(d, -15, -14, 3, '#ffe066'); sparkle(d, 15, -4, 2.5, '#ffe066'); sparkle(d, -14, 6, 2, '#ffe066');
  },
  // 생선구이: 길쭉한 사각 접시 + 구운 생선 + 칼집 + 레몬 조각
  d21: (d) => {
    d.rr(-21, 2, 42, 14, 5, '#f4f6fb');
    d.rr(-18, 4, 36, 10, 4, '#e2e6f0');
    fishShape(d, -2, 3, 34, '#d9a46a', '#f0d0a0');
    d.line(c => { c.moveTo(-6, -2); c.lineTo(-3, 6); c.moveTo(0, -2); c.lineTo(3, 6); c.moveTo(6, -2); c.lineTo(9, 6); }, '#8a5020', 1.6);
    d.dot(-12, 1, 2, '#ffffff', .4);
    d.circle(15, -9, 5.5, '#ffe14f'); d.circle(15, -9, 4.3, '#fff6b0');
    d.line(c => { for (let i = 0; i < 3; i++) { const a = i * PI / 3; c.moveTo(15 + Math.cos(a) * 4, -9 + Math.sin(a) * 4); c.lineTo(15 - Math.cos(a) * 4, -9 - Math.sin(a) * 4); } }, '#ffe14f', .9);
    d.ell(-15, 12, 3, 1.5, '#5cb85c');
  },
  // 피시 앤드 칩스: 체크무늬 종이 콘 + 튀김 생선 + 감자튀김 막대
  d22: (d) => {
    [[-8, -4, -.3], [-3, -7, -.1], [2, -6, .1], [7, -5, .3], [-5, -2, -.2]].forEach(([x, y, a]) => {
      d.ctx.save(); d.ctx.translate(x, y); d.ctx.rotate(a); d.rr(-1.6, -9, 3.2, 14, 1, '#ffd25a'); d.ctx.restore();
    });
    d.ctx.save(); d.ctx.translate(7, -9); d.ctx.rotate(-.9);
    d.ell(0, 0, 9, 5, '#e09a38');
    d.dot(-3, -1, 1, '#c97a20'); d.dot(2, 1, 1, '#c97a20'); d.dot(4, -2, .8, '#fff0b0'); d.dot(-1, 2, .8, '#fff0b0');
    d.ctx.restore();
    d.tri([[-14, -2], [14, -2], [0, 22]], '#ffffff');
    d.line(c => { c.moveTo(-7, -2); c.lineTo(4, 14); c.moveTo(0, -2); c.lineTo(7, 7); c.moveTo(7, -2); c.lineTo(-4, 14); c.moveTo(0, -2); c.lineTo(-7, 7); }, '#5a9ae0', 1.6);
    d.rr(-15, -4, 30, 4, 2, '#5a9ae0');
    d.circle(-12, -9, 3, '#ffffff'); d.dot(-12, -9, 1.6, '#e8f0c0');
  },
  // 해물 토마토 파스타: 넓은 접시 + 돌돌 면 + 토마토 소스 + 새우·조개
  d23: (d) => {
    d.ell(0, 5, 21, 13, '#ffffff');
    d.ell(0, 5, 16, 9, '#f3eee8');
    d.ell(0, 3, 13, 8, '#ffe08a');
    d.stitch(c => { c.ellipse(0, 3, 9, 5, 0, 0, 2 * PI); c.moveTo(-6, 4); c.ellipse(0, 3, 5, 3, 0, PI, 3 * PI); }, '#e8b84a', 1);
    d.ell(0, 1, 9, 5, '#e8452f');
    d.dot(-3, 0, 2, '#ff6a50', .8);
    d.line(c => { c.arc(-9, 7, 4.5, PI * .1, PI * 1.3); }, '#ff8a5a', 3.2);
    d.dot(-12.5, 4, 1.2, '#ff8a5a');
    d.ell(9, 7, 5, 3.6, '#5a4a6a'); d.ell(9, 6, 4, 2.4, '#ffd8b8');
    d.ell(6, -6, 3.5, 2.5, '#f0e6d8'); d.line(c => { c.moveTo(4, -7); c.lineTo(8, -5); }, '#c0b0a0', .8);
    d.ell(-2, -3, 3, 1.4, '#4fae3c'); d.dot(2, 2, 1, '#4fae3c');
    d.line(c => { c.moveTo(16, -18); c.lineTo(5, -2); }, '#c8ccd8', 1.6);
  },
  // 물고기 초밥: 나무 판 + 연어/참치/계란 초밥 + 와사비 + 생강
  d24: (d) => {
    d.rr(-21, 4, 42, 12, 3, '#d9a86a');
    d.rr(-17, 15, 5, 4, 1, '#b5824a'); d.rr(12, 15, 5, 4, 1, '#b5824a');
    d.line(c => { c.moveTo(-19, 9); c.lineTo(19, 9); }, '#c0905a', .8);
    const nigiri = (x, top, stripe) => {
      d.rr(x - 6, -2, 12, 9, 4.5, '#ffffff');
      d.dot(x - 3, 3, .6, '#e8e8f0'); d.dot(x + 2, 4, .6, '#e8e8f0');
      d.rr(x - 7, -7, 14, 7, 3.5, top);
      if (stripe) d.line(c => { c.moveTo(x - 4, -6); c.lineTo(x - 2, -1); c.moveTo(x, -6.5); c.lineTo(x + 2, -1); c.moveTo(x + 4, -6); c.lineTo(x + 5.5, -2); }, stripe, 1);
      d.dot(x - 3, -5, 1.2, '#ffffff', .6);
    };
    nigiri(-12, '#ff9a6a', '#ffe0d0');
    nigiri(1, '#e8304a', null);
    nigiri(14, '#ffd84a', null);
    d.rr(9.5, -5, 9, 3, 1, '#2d4a2d');
    d.circle(-7, -14, 3.5, '#9fd06a'); d.dot(-8, -15, 1, '#ffffff', .6);
    d.ell(2, -14, 3.5, 2, '#ffc0c8'); d.ell(5, -16, 3, 1.8, '#ffd6dc');
  },
};
