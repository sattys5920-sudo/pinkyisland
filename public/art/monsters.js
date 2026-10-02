// 몬스터 그림 (d, t): 발/바닥이 y=0, 몸은 위로 약 -40 (보스급 -55)
const S = Math.sin, C = Math.cos, PI = Math.PI;
// hex 를 밝게(k>0)/어둡게(k<0) 한 '#rrggbb'
const tone = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))));
  return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map(v => v.toString(16).padStart(2, '0')).join('');
};
const EYE = '#3b2433';
// 귀엽지만 살짝 심술난 눈: 동그란 눈 + 하이라이트 + 안쪽으로 내려간 눈썹
const grumpy = (d, x, y, gap, r = 2.2, col = EYE, brow = col) => {
  for (const s of [-1, 1]) {
    const ex = x + s * gap;
    d.dot(ex, y, r, col);
    d.dot(ex - r * 0.35, y - r * 0.4, r * 0.38, '#ffffff');
    d.line(c => { c.moveTo(ex + s * r * 1.3, y - r * 2.0); c.lineTo(ex - s * r * 0.9, y - r * 1.25); }, brow, Math.max(0.8, r * 0.45));
  }
};
// 빛나는 눈 (어두운 몬스터용)
const glowEyes = (d, x, y, gap, r, col, t) => {
  const a = 0.35 + 0.2 * S(t * 3);
  for (const s of [-1, 1]) {
    const ex = x + s * gap;
    d.dot(ex, y, r * 2, col, a);
    d.dot(ex, y, r, col);
    d.dot(ex - r * 0.3, y - r * 0.3, r * 0.35, '#ffffff');
    d.line(c => { c.moveTo(ex + s * r * 1.4, y - r * 1.9); c.lineTo(ex - s * r * 0.8, y - r * 1.1); }, col, 0.9);
  }
};
const pout = (d, x, y, w = 2.2, col = EYE) => d.line(c => { c.moveTo(x - w, y + 0.6); c.quadraticCurveTo(x, y - 1, x + w, y + 0.6); }, col, 1);
const blush = (d, x, y, gap, r = 2.2) => { d.dot(x - gap, y, r, '#ffadc4', 0.7); d.dot(x + gap, y, r, '#ffadc4', 0.7); };
// 보송한 털뭉치 공: 테두리에 작은 원 여러 개
const fluffBall = (d, cx, cy, r, col, n, bump, t, wob = 0.6) => {
  const dark = tone(col, -0.12);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * PI * 2;
    const rr = bump * (0.85 + 0.25 * S(i * 2.3 + t * 3));
    d.circle(cx + C(a) * r, cy + S(a) * r * 0.95, rr, i % 2 ? dark : col);
  }
  d.circle(cx, cy, r + wob * S(t * 2), col);
};

export const ART_PART = {
  // 1 먼지 뭉치: 단순한 먼지 공 + 작은 발
  m01: (d, t = 0) => {
    const col = '#bdb5c9', b = S(t * 3) * 0.8;
    d.ell(-6, -1.5, 4, 2.2, tone(col, -0.2)); d.ell(6, -1.5, 4, 2.2, tone(col, -0.2));
    fluffBall(d, 0, -17 + b, 14, col, 14, 4.5, t);
    for (const [x, y] of [[-7, -27], [6, -9], [9, -24]]) d.dot(x, y + b, 1, tone(col, -0.3), 0.6);
    grumpy(d, 0, -18 + b, 5, 2.2);
    pout(d, 0, -12 + b);
  },
  // 2 솜먼지: 아주 보송보송, 큰 볼터치, 가는 솜털
  m02: (d, t = 0) => {
    const col = '#e8e3f0', b = S(t * 2.5) * 1;
    for (let i = 0; i < 9; i++) {
      const a = -PI + (i / 8) * PI, sw = S(t * 3 + i) * 1.2;
      d.line(c => { c.moveTo(C(a) * 14, -17 + b + S(a) * 14); c.lineTo(C(a) * 21 + sw, -17 + b + S(a) * 21); }, '#f6f3fa', 1.2);
    }
    fluffBall(d, 0, -17 + b, 13, col, 18, 5, t);
    d.circle(-6, -24 + b, 5, '#f6f3fa'); d.circle(7, -25 + b, 4, '#f6f3fa');
    blush(d, 0, -14 + b, 8, 3);
    grumpy(d, 0, -18 + b, 5, 2);
    d.dot(0, -12.5 + b, 1, EYE);
  },
  // 3 보푸라기: 몸에 동글동글한 보풀 알갱이 + 이빨 하나
  m03: (d, t = 0) => {
    const col = '#c9b8d9', b = S(t * 3) * 0.7;
    d.ell(-5, -1.5, 3.5, 2, tone(col, -0.25)); d.ell(5, -1.5, 3.5, 2, tone(col, -0.25));
    d.ell(0, -16 + b, 15, 15, col);
    const pills = [[-12, -24], [-14, -12], [11, -27], [14, -14], [-4, -31], [6, -32], [-10, -4], [10, -5], [0, -3]];
    pills.forEach(([x, y], i) => {
      const s = 1 + 0.15 * S(t * 4 + i);
      d.line(c => { c.moveTo(x * 0.85, (y + b) * 0.9); c.lineTo(x, y + b); }, tone(col, -0.3), 0.7);
      d.circle(x, y + b, 3 * s, i % 2 ? '#d9cbe6' : '#b6a3c9');
    });
    grumpy(d, 0, -18 + b, 5.5, 2.3);
    d.line(c => { c.moveTo(-3, -11 + b); c.lineTo(3, -11 + b); }, EYE, 1);
    d.rr(-1, -11 + b, 2, 2, 0.5, '#ffffff');
  },
  // 4 털뭉치: 실타래 공 + 감긴 줄무늬 + 꼬리처럼 늘어진 실
  m04: (d, t = 0) => {
    const col = '#d9c2a6', b = S(t * 2.5) * 0.6, sw = S(t * 2) * 3;
    d.line(c => { c.moveTo(12, -8); c.bezierCurveTo(20, -4, 16 + sw, 2, 24, -1 + sw * 0.3); }, tone(col, -0.2), 1.6);
    d.circle(0, -15 + b, 15, col);
    const dk = tone(col, -0.22);
    d.line(c => {
      for (let k = -2; k <= 2; k++) { c.moveTo(-13, -15 + b + k * 5); c.quadraticCurveTo(0, -24 + b + k * 6, 13, -12 + b + k * 5); }
    }, dk, 1);
    d.line(c => { c.moveTo(-6, -28 + b); c.quadraticCurveTo(-14, -15 + b, -5, -2 + b); c.moveTo(6, -28 + b); c.quadraticCurveTo(14, -15 + b, 5, -2 + b); }, dk, 1);
    d.rr(-9, -21 + b, 18, 9, 4, '#f0e2cf');
    grumpy(d, 0, -17 + b, 4.5, 2);
    pout(d, 0, -13 + b, 1.6);
  },
  // 5 실밥벌레: 길쭉한 마디 애벌레 + 실밥 털
  m05: (d, t = 0) => {
    const col = '#9fc48f';
    for (let i = 4; i >= 0; i--) {
      const x = 14 - i * 6.5, y = -6 - (i === 0 ? 0 : 0) - Math.max(0, S(t * 5 - i * 0.9)) * 3 * (i > 0 && i < 4 ? 1 : 0.3);
      d.circle(x - 6, y, 6 - i * 0.2, i % 2 ? tone(col, -0.1) : col);
      d.line(c => { c.moveTo(x - 6, y - 5.5); c.lineTo(x - 5 + S(t * 4 + i) * 1.5, y - 9); }, '#ffffff', 0.9);
    }
    // 머리
    const hy = -14 + S(t * 3) * 0.8;
    d.circle(-13, hy, 9, col);
    d.line(c => { c.moveTo(-16, hy - 8); c.quadraticCurveTo(-20, hy - 16, -17 + S(t * 3), hy - 18); c.moveTo(-10, hy - 8); c.quadraticCurveTo(-8, hy - 16, -11 + S(t * 3 + 1), hy - 18); }, tone(col, -0.35), 1);
    d.dot(-17 + S(t * 3), hy - 18, 1.4, '#ffffff'); d.dot(-11 + S(t * 3 + 1), hy - 18, 1.4, '#ffffff');
    grumpy(d, -13, hy - 1, 3.5, 1.8);
    pout(d, -13, hy + 4, 1.4);
    d.stitch(c => { c.moveTo(-19, hy + 6); c.lineTo(17, -3); }, '#ffffff', 0.6);
  },
  // 6 좀벌레: 은빛 물방울형 납작 마디 몸 + 긴 더듬이 + 꼬리 털 3가닥
  m06: (d, t = 0) => {
    const col = '#a8a3b8', ws = S(t * 4) * 1.5;
    for (let i = 0; i < 3; i++) d.line(c => { c.moveTo(14, -6); c.lineTo(23, -9 + (i - 1) * 4 + ws * 0.5); }, tone(col, -0.3), 0.9);
    for (const lx of [-8, -2, 4, 10]) d.line(c => { c.moveTo(lx, -4); c.lineTo(lx - 2, 0); }, tone(col, -0.35), 1.1);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-16, -8); c.quadraticCurveTo(-14, -22, -4, -22); c.quadraticCurveTo(10, -18, 16, -6); c.quadraticCurveTo(0, -1, -16, -8); c.closePath(); }, col, [-2, -12, 15]);
    for (const x of [-4, 1, 6, 11]) d.line(c => { c.moveTo(x, -20 + (x + 4) * 0.5); c.quadraticCurveTo(x + 1.5, -12, x, -4); }, tone(col, -0.2), 0.9);
    d.dot(-5, -18, 3, '#ffffff', 0.35);
    d.line(c => { c.moveTo(-14, -16); c.quadraticCurveTo(-20, -28, -12 + ws, -34); c.moveTo(-11, -18); c.quadraticCurveTo(-10, -30, -2 - ws, -36); }, tone(col, -0.4), 1);
    grumpy(d, -10, -13, 3, 1.6);
  },
  // 7 거미줄 요정: 떠 있는 하얀 유령 + 거미줄 날개 + 몸의 거미줄 무늬
  m07: (d, t = 0) => {
    const col = '#f3f3ff', f = -4 - S(t * 2) * 2.5, web = '#a9a9c8';
    d.ell(0, -1, 7, 1.5, '#c9c9dd');
    for (const s of [-1, 1]) {
      const fl = 1 + S(t * 8) * 0.12;
      d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(s * 5, -24 + f); c.lineTo(s * 22 * fl, -38 + f); c.lineTo(s * 20 * fl, -18 + f); c.closePath(); }, '#ffffff', [s * 14, -27 + f, 10]);
      d.line(c => { c.moveTo(s * 5, -24 + f); c.lineTo(s * 20 * fl, -30 + f); c.moveTo(s * 11, -29 + f); c.lineTo(s * 12, -21 + f); c.moveTo(s * 16 * fl, -33 + f); c.lineTo(s * 16 * fl, -19 + f); }, web, 0.6);
    }
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-11, -4 + f); c.lineTo(-11, -22 + f); c.arc(0, -22 + f, 11, PI, 0); c.lineTo(11, -4 + f); for (let i = 0; i < 4; i++) { const x = 11 - (i + 0.5) * 5.5; c.quadraticCurveTo(x, -9 + f + S(t * 4 + i), x - 2.75, -4 + f); } c.closePath(); }, col, [0, -18 + f, 13]);
    // 거미줄 무늬
    d.line(c => {
      const cx = 0, cy = -24 + f;
      for (let i = 0; i < 6; i++) { const a = i * PI / 3; c.moveTo(cx, cy); c.lineTo(cx + C(a) * 9, cy + S(a) * 9); }
      for (const r of [3.5, 7]) { for (let i = 0; i <= 6; i++) { const a = i * PI / 3; i ? c.lineTo(cx + C(a) * r, cy + S(a) * r) : c.moveTo(cx + C(a) * r, cy + S(a) * r); } }
    }, web, 0.5);
    grumpy(d, 0, -18 + f, 4.5, 2);
    d.dot(0, -12.5 + f, 1, EYE);
  },
  // 8 먼지 토끼: 긴 두 귀, 동그란 꼬리
  m08: (d, t = 0) => {
    const col = '#c9c2d6', hop = Math.abs(S(t * 4)) * 2, ea = S(t * 2.5) * 0.12;
    d.circle(13, -9 - hop, 4.5, '#ece8f2');
    d.ell(-5, -1.5, 4, 2.2, tone(col, -0.15)); d.ell(5, -1.5, 4, 2.2, tone(col, -0.15));
    fluffBall(d, 0, -13 - hop, 11, col, 12, 3.5, t);
    for (const s of [-1, 1]) {
      const c = d.ctx; c.save(); c.translate(s * 5, -26 - hop); c.rotate(s * (0.2 + ea * s) );
      d.ell(0, -9, 3.8, 10, col); d.ell(0, -8, 1.8, 7, '#f2c9d8');
      c.restore();
    }
    d.circle(0, -20 - hop, 9, col);
    grumpy(d, 0, -20 - hop, 4, 1.8);
    d.dot(0, -16 - hop, 1.1, '#e88aa7');
    d.line(c => { c.moveTo(-6, -16 - hop); c.lineTo(-11, -17 - hop); c.moveTo(6, -16 - hop); c.lineTo(11, -17 - hop); }, tone(col, -0.35), 0.6);
  },
  // 9 회색 먼지곰: 큰 몸, 둥근 귀, 주둥이, 굵은 팔
  m09: (d, t = 0) => {
    const col = '#8f8899', br = S(t * 1.8) * 0.8;
    d.ell(-8, -2, 6, 3, tone(col, -0.2)); d.ell(8, -2, 6, 3, tone(col, -0.2));
    fluffBall(d, 0, -17, 15 + br, col, 16, 4, t, 0);
    d.ell(0, -14, 9, 8, '#b3adbc');
    for (const s of [-1, 1]) d.ell(s * 16, -16 + S(t * 1.8 + s) * 1, 4.5, 8, tone(col, -0.08));
    for (const s of [-1, 1]) { d.circle(s * 10, -46 - br, 5.5, col); d.circle(s * 10, -46 - br, 2.8, '#c9b3c4'); }
    d.circle(0, -36 - br, 13, col);
    d.ell(0, -32 - br, 6, 4.5, '#b3adbc');
    d.dot(0, -34 - br, 1.8, EYE);
    d.line(c => { c.moveTo(-2, -30 - br); c.quadraticCurveTo(0, -31.5 - br, 2, -30 - br); }, EYE, 1);
    grumpy(d, 0, -39 - br, 5.5, 2.1);
  },
  // 10 가시 덤불: 뾰족 가시가 난 덤불 + 빨간 열매
  m10: (d, t = 0) => {
    const col = '#4f8f46', sw = S(t * 1.5) * 1;
    for (let i = 0; i < 11; i++) {
      const a = PI + (i / 10) * PI, r = 17, cx = C(a) * r + sw * (i / 10), cy = -15 + S(a) * r;
      d.tri([[cx + C(a + 0.4) * 2, cy + S(a + 0.4) * 2], [cx + C(a) * 7, cy + S(a) * 7], [cx + C(a - 0.4) * 2, cy + S(a - 0.4) * 2]], '#3d7136');
    }
    d.circle(-8 + sw * 0.5, -18, 10, tone(col, -0.08));
    d.circle(8 + sw * 0.5, -18, 10, tone(col, -0.08));
    d.circle(sw, -24, 11, col);
    d.ell(0, -8, 17, 9, col);
    for (const [x, y] of [[-12, -22], [12, -25], [-3, -33], [14, -10], [-15, -8]]) {
      d.circle(x + sw * 0.6, y, 2.6, '#e8364f'); d.dot(x - 0.8 + sw * 0.6, y - 0.9, 0.7, '#ffffff');
    }
    d.ell(-6, -1, 2.5, 1.5, '#5c3c2a'); d.ell(6, -1, 2.5, 1.5, '#5c3c2a');
    grumpy(d, 0, -17, 5, 2.2, EYE, '#2a4a24');
    d.line(c => { c.moveTo(-3, -10); c.lineTo(-1, -11.5); c.lineTo(1, -10); c.lineTo(3, -11.5); }, EYE, 1);
  },
  // 11 그림자 솜: 어두운 연기 솜 + 빛나는 눈, 꼬리처럼 흐려지는 아래
  m11: (d, t = 0) => {
    const col = '#4b4660', f = -3 - S(t * 2) * 2;
    for (let i = 0; i < 5; i++) d.dot(-8 + i * 4 + S(t * 3 + i), -2 + S(t * 2 + i) * 1.5, 2.5 - Math.abs(i - 2) * 0.4, col, 0.35);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-6, -2 + f * 0.3); c.quadraticCurveTo(-15, -6 + f, -14, -18 + f); c.lineTo(14, -18 + f); c.quadraticCurveTo(15, -6 + f, 6, -2 + f * 0.3); c.closePath(); }, col, [0, -10 + f, 12]);
    fluffBall(d, 0, -22 + f, 12, col, 13, 4, t);
    for (const [x, y] of [[-15, -30], [16, -26], [12, -38]]) d.dot(x, y + f + S(t * 3 + x) * 1.5, 1.6, '#6c6488', 0.6);
    glowEyes(d, 0, -23 + f, 4.8, 2.2, '#ffe36b', t);
    d.line(c => { c.moveTo(-2, -16 + f); c.quadraticCurveTo(0, -17.5 + f, 2, -16 + f); }, '#ffe36b', 0.8);
  },
  // 12 독버섯 요정: 점박이 빨간 갓, 줄기 몸, 작은 날개
  m12: (d, t = 0) => {
    const col = '#c9304f', b = S(t * 3) * 0.6, fl = S(t * 10) * 0.2;
    for (const s of [-1, 1]) d.ell(s * 11, -16 + b, 6, 3 + fl * 6, '#e6f5ff');
    d.ell(-4, -1.5, 3, 1.8, '#c9b49a'); d.ell(4, -1.5, 3, 1.8, '#c9b49a');
    d.rr(-7, -22 + b, 14, 21, 6, '#f6ead8');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-19, -22 + b); c.quadraticCurveTo(-18, -44 + b, 0, -45 + b); c.quadraticCurveTo(18, -44 + b, 19, -22 + b); c.quadraticCurveTo(0, -18 + b, -19, -22 + b); c.closePath(); }, col, [0, -33 + b, 18]);
    for (const [x, y, r] of [[-10, -32, 3], [1, -39, 3.4], [10, -30, 2.6], [-3, -27, 1.8], [14, -24, 1.5]]) d.dot(x, y + b, r, '#fff4f4');
    grumpy(d, 0, -13 + b, 3.3, 1.7);
    d.line(c => { c.moveTo(-2, -7.5 + b); c.quadraticCurveTo(0, -9 + b, 2, -7.5 + b); }, EYE, 0.9);
    d.dot(5, -8 + b, 1.2, '#b8e05a', 0.8 + 0.2 * S(t * 4));
  },
  // 13 먼지 늑대: 네 발, 뾰족 귀, 송곳니, 풍성한 꼬리
  m13: (d, t = 0) => {
    const col = '#7a7489', dk = tone(col, -0.2), tw = S(t * 4) * 0.25;
    { const c = d.ctx; c.save(); c.translate(13, -18); c.rotate(-0.5 + tw); d.ell(5, -3, 8, 4.5, col); d.ell(10, -4, 3, 2.5, '#c9c4d2'); c.restore(); }
    for (const x of [-11, -5, 6, 12]) d.rr(x - 2, -10, 4.5, 10, 2, dk);
    d.ell(1, -16, 15, 8.5, col);
    for (let i = 0; i < 5; i++) d.tri([[-9 + i * 5, -23], [-6.5 + i * 5, -27 + S(t * 3 + i) * 0.6], [-4 + i * 5, -23]], col);
    // 머리
    const hy = -27 + S(t * 2) * 0.6;
    d.tri([[-17, hy - 6], [-13, hy - 17], [-8, hy - 7]], col); d.tri([[-15.5, hy - 7], [-13, hy - 13], [-10, hy - 7.5]], '#c9a3b4');
    d.tri([[-4, hy - 7], [1, hy - 17], [4, hy - 5]], col);
    d.circle(-8, hy, 9, col);
    d.ell(-15, hy + 3, 6, 4, '#a8a2b4');
    d.dot(-20, hy + 1.5, 1.5, EYE);
    d.tri([[-17, hy + 6], [-16, hy + 9], [-15, hy + 6]], '#ffffff');
    d.tri([[-13, hy + 6], [-12, hy + 9], [-11, hy + 6]], '#ffffff');
    d.line(c => { c.moveTo(-18, hy + 6); c.lineTo(-10, hy + 6); }, EYE, 0.8);
    grumpy(d, -8, hy - 2, 3.4, 1.8);
  },
  // 14 썩은 나뭇잎: 큰 시든 잎사귀 몸, 잎맥, 갈라진 끝, 구멍
  m14: (d, t = 0) => {
    const col = '#8a6a3b', sw = S(t * 1.6) * 0.08;
    const c0 = d.ctx; c0.save(); c0.rotate(sw);
    d.line(c => { c.moveTo(0, -2); c.lineTo(0, 0); }, '#5c4426', 2);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(0, -2); c.bezierCurveTo(-20, -8, -18, -30, -2, -42); c.lineTo(0, -38); c.lineTo(2, -43); c.bezierCurveTo(19, -30, 20, -8, 0, -2); c.closePath(); }, col, [0, -22, 18]);
    d.line(c => { c.moveTo(0, -3); c.lineTo(0, -38); for (let i = 0; i < 4; i++) { const y = -10 - i * 7; c.moveTo(0, y); c.lineTo(-10 + i * 1.5, y - 5); c.moveTo(0, y); c.lineTo(10 - i * 1.5, y - 5); } }, '#5c4426', 0.8);
    d.dot(-9, -14, 2, '#3e2c18', 0.8); d.dot(10, -30, 1.4, '#3e2c18', 0.8);
    d.dot(7, -10, 3, '#6b8f3a', 0.45); d.dot(-6, -33, 2.2, '#6b8f3a', 0.45);
    d.rr(-9, -27, 18, 9, 4, '#a3844f');
    grumpy(d, 0, -22, 4.5, 2);
    d.line(c => { c.moveTo(-2.5, -18); c.quadraticCurveTo(0, -20, 2.5, -18); }, EYE, 0.9);
    c0.restore();
    d.ell(-5, -1, 3, 1.5, '#5c4426'); d.ell(5, -1, 3, 1.5, '#5c4426');
  },
  // 15 밤그림자: 망토 같은 어둠 + 초승달 머리장식 + 별 점
  m15: (d, t = 0) => {
    const col = '#2f2f3a', f = -2 - S(t * 1.8) * 2;
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(0, -42 + f); c.quadraticCurveTo(18, -38 + f, 17, -4 + f * 0.3); for (let i = 0; i < 5; i++) { const x = 17 - (i + 1) * 6.8; c.lineTo(x + 3.4, -8 + f * 0.3 + S(t * 3 + i) * 1.5); c.lineTo(x, -1 + f * 0.3); } c.quadraticCurveTo(-18, -38 + f, 0, -42 + f); c.closePath(); }, col, [0, -22 + f, 18]);
    for (const [x, y] of [[-8, -12], [9, -18], [-3, -6], [5, -9]]) d.dot(x, y + f, 0.7 + 0.3 * S(t * 5 + x), '#fff6b0', 0.8);
    // 초승달
    d.shape(() => { const c = d.ctx; c.beginPath(); c.arc(0, -46 + f, 7, PI * 0.35, PI * 1.65, false); c.arc(3, -47 + f, 6, PI * 1.55, PI * 0.45, true); c.closePath(); }, '#ffe98a', [0, -46 + f, 7]);
    d.dot(-3, -46 + f, 7, '#ffe98a', 0.12);
    glowEyes(d, 0, -28 + f, 5, 2.1, '#c9b3ff', t);
    d.line(c => { c.moveTo(-3, -21 + f); c.lineTo(3, -21 + f); }, '#c9b3ff', 0.9);
  },
  // 16 먼지 여왕의 시녀: 드레스 몸, 하얀 앞치마, 머리 위 큰 리본, 프릴 머리띠
  m16: (d, t = 0) => {
    const col = '#b58cff', b = S(t * 2.4) * 0.8, sway = S(t * 2.4) * 1.2;
    d.ell(-5, -1.5, 3.5, 2, '#5c3c6f'); d.ell(5, -1.5, 3.5, 2, '#5c3c6f');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-7, -26 + b); c.lineTo(7, -26 + b); c.lineTo(15 + sway, -3); c.quadraticCurveTo(0, 0, -15 + sway, -3); c.closePath(); }, col, [0, -14, 15]);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-5, -20 + b); c.lineTo(5, -20 + b); c.lineTo(9 + sway, -5); c.quadraticCurveTo(0, -3, -9 + sway, -5); c.closePath(); }, '#ffffff', [0, -12, 9]);
    d.stitch(c => { c.moveTo(-8 + sway, -6); c.quadraticCurveTo(0, -4, 8 + sway, -6); }, '#d9c6ff', 0.9);
    d.ell(-6, -21 + b, 4, 2, '#ffffff'); d.ell(6, -21 + b, 4, 2, '#ffffff');
    for (const s of [-1, 1]) d.ell(s * 10, -19 + b, 2.5, 5, col);
    // 머리 (보송한 먼지 머리)
    fluffBall(d, 0, -34 + b, 10, '#d9cfe6', 11, 3, t, 0);
    d.rr(-9, -43 + b, 18, 3.5, 1.7, '#ffffff');
    for (let i = 0; i < 5; i++) d.dot(-8 + i * 4, -43 + b, 1.4, '#ffffff');
    // 큰 리본
    const rw = S(t * 3) * 0.6;
    d.tri([[0, -46 + b], [-11, -52 + b - rw], [-10, -41 + b]], '#ff6fae');
    d.tri([[0, -46 + b], [11, -52 + b + rw], [10, -41 + b]], '#ff6fae');
    d.circle(0, -46 + b, 2.6, '#ff8cc0');
    grumpy(d, 0, -33 + b, 4, 1.9);
    blush(d, 0, -30 + b, 6.5, 1.8);
    pout(d, 0, -28.5 + b, 1.5);
  },
  // 17 소금 게: 넓은 등껍질, 큰 집게 둘, 막대 눈, 소금 결정
  m17: (d, t = 0) => {
    const col = '#ff8f7a', cl = S(t * 4) * 0.25, dk = tone(col, -0.2);
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) d.line(c => { c.moveTo(s * (6 + i * 3), -7); c.lineTo(s * (12 + i * 3), -3 + S(t * 6 + i + s) * 0.6); c.lineTo(s * (13 + i * 3), 0); }, dk, 1.3);
    for (const s of [-1, 1]) {
      d.line(c => { c.moveTo(s * 12, -12); c.lineTo(s * 17, -18); }, dk, 2);
      const c = d.ctx; c.save(); c.translate(s * 18, -22); c.rotate(s * cl);
      d.ell(0, 0, 5.5, 4.5, col);
      d.tri([[s * -1, -2], [s * 3, -10], [s * 5, -2]], col);
      c.restore();
    }
    d.ell(0, -11, 14, 8.5, col);
    for (const [x, y] of [[-6, -16], [4, -17], [9, -13], [-1, -14]]) d.rr(x - 1, y - 1, 2, 2, 0.4, '#ffffff');
    for (const s of [-1, 1]) { d.line(c => { c.moveTo(s * 4, -17); c.lineTo(s * 5, -24); }, dk, 1.4); d.circle(s * 5, -25, 2.8, '#ffffff'); d.dot(s * 5, -25, 1.5, EYE); d.line(c => { c.moveTo(s * 7.5, -28.5); c.lineTo(s * 3, -27); }, EYE, 0.9); }
    d.line(c => { c.moveTo(-2.5, -8); c.quadraticCurveTo(0, -9.5, 2.5, -8); }, EYE, 0.9);
  },
  // 18 이끼 슬라임: 물방울 슬라임 + 위의 이끼 덩어리와 풀잎
  m18: (d, t = 0) => {
    const col = '#7fc46a', sq = S(t * 3) * 1.2;
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-17 - sq, 0); c.quadraticCurveTo(-18 - sq, -22 + sq, 0, -25 + sq); c.quadraticCurveTo(18 + sq, -22 + sq, 17 + sq, 0); c.closePath(); }, col, [0, -12, 17]);
    d.dot(-8, -17 + sq, 3, '#ffffff', 0.4);
    for (const [x, r] of [[-9, 5], [-2, 6], [6, 5.5], [12, 3.5]]) d.circle(x, -23 + sq + Math.abs(x) * 0.12, r, '#4f8f3a');
    for (let i = 0; i < 5; i++) d.line(c => { const x = -8 + i * 4; c.moveTo(x, -27 + sq); c.quadraticCurveTo(x + 1, -32 + sq, x + 2 + S(t * 3 + i), -34 + sq); }, '#3d7a2c', 1.1);
    d.circle(9, -31 + sq, 2.2, '#fff27a');
    d.dot(-12, -5, 1.4, '#4f8f3a', 0.6); d.dot(13, -8, 1.1, '#4f8f3a', 0.6);
    grumpy(d, 0, -13 + sq * 0.3, 5, 2.2);
    pout(d, 0, -7, 2);
  },
  // 19 해파리 유령: 반투명 종 모양 갓 + 흔들리는 촉수
  m19: (d, t = 0) => {
    const col = '#bfe0ff', f = -S(t * 2) * 2.5;
    for (let i = 0; i < 6; i++) {
      const x = -10 + i * 4;
      d.line(c => { c.moveTo(x, -22 + f); c.bezierCurveTo(x + S(t * 3 + i) * 4, -15 + f, x - S(t * 3 + i) * 4, -8 + f, x + S(t * 3 + i + 1) * 3, -2); }, i % 2 ? '#9fcaf5' : '#d6ecff', 1.4);
    }
    d.dot(0, -30 + f, 18, '#e0f0ff', 0.25);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-15, -22 + f); c.quadraticCurveTo(-16, -44 + f, 0, -44 + f); c.quadraticCurveTo(16, -44 + f, 15, -22 + f); for (let i = 0; i < 6; i++) { const x = 15 - (i + 1) * 5; c.quadraticCurveTo(x + 2.5, -19 + f, x, -22 + f); } c.closePath(); }, col, [0, -32 + f, 16]);
    d.dot(-7, -37 + f, 3, '#ffffff', 0.55);
    d.line(c => { c.moveTo(-10, -25 + f); c.quadraticCurveTo(0, -27 + f, 10, -25 + f); }, '#8fbbe8', 0.7);
    grumpy(d, 0, -31 + f, 4.5, 2, '#3a4a7a');
    d.dot(0, -26 + f, 1, '#3a4a7a');
  },
  // 20 따개비 골렘: 각진 바위 몸, 원뿔 따개비 여럿, 짧은 다리
  m20: (d, t = 0) => {
    const col = '#8f9aa6', b = S(t * 1.5) * 0.5;
    d.rr(-14, -9, 9, 9, 3, tone(col, -0.2)); d.rr(5, -9, 9, 9, 3, tone(col, -0.2));
    for (const s of [-1, 1]) d.rr(s > 0 ? 15 : -23, -30 + b + S(t * 1.5 + s), 8, 18, 4, tone(col, -0.08));
    d.rr(-17, -42 + b, 34, 35, 9, col);
    const barn = [[-11, -38], [10, -40], [-15, -22], [14, -24], [-6, -11], [8, -12], [-19, -26], [21, -18]];
    barn.forEach(([x, y], i) => {
      d.tri([[x - 3.5, y + 2 + b], [x, y - 3 + b], [x + 3.5, y + 2 + b]], '#e8e2d6');
      d.dot(x, y - 1 + b, 1, '#5a5a66');
    });
    d.dot(0, -15 + b, 3, '#7fb59a', 0.6);
    d.rr(-10, -34 + b, 20, 11, 4, '#a9b3bd');
    grumpy(d, 0, -29 + b, 5, 2.3);
    d.line(c => { c.moveTo(-4, -20 + b); c.lineTo(4, -20 + b); }, EYE, 1.2);
  },
  // 21 동굴 박쥐: 펄럭이는 박쥐 날개, 큰 귀, 작은 송곳니, 떠 있음
  m21: (d, t = 0) => {
    const col = '#5b4a6f', f = -6 - S(t * 4) * 2, flap = S(t * 10);
    for (const s of [-1, 1]) {
      d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(s * 6, -24 + f); c.lineTo(s * 22, -30 + f - flap * 6); c.lineTo(s * 20, -20 + f - flap * 2); c.quadraticCurveTo(s * 17, -22 + f, s * 15, -17 + f); c.quadraticCurveTo(s * 12, -20 + f, s * 9, -15 + f); c.closePath(); }, tone(col, -0.1), [s * 14, -22 + f, 10]);
    }
    d.line(c => { c.moveTo(-3, -12 + f); c.lineTo(-3, -9 + f); c.moveTo(3, -12 + f); c.lineTo(3, -9 + f); }, tone(col, -0.3), 1.2);
    for (const s of [-1, 1]) { d.tri([[s * 3, -30 + f], [s * 8, -40 + f], [s * 10, -27 + f]], col); d.tri([[s * 5, -30 + f], [s * 8, -36 + f], [s * 9, -29 + f]], '#c98fb0'); }
    d.circle(0, -22 + f, 10, col);
    d.ell(0, -18 + f, 5, 4, '#7a6890');
    grumpy(d, 0, -24 + f, 4, 2, '#ffd36b', '#2a2033');
    d.tri([[-2.5, -17 + f], [-1.8, -14.5 + f], [-1, -17 + f]], '#ffffff'); d.tri([[1, -17 + f], [1.8, -14.5 + f], [2.5, -17 + f]], '#ffffff');
  },
  // 22 심해 촉수: 바닥에서 솟은 큰 촉수 하나 + 빨판, 끝이 말림, 옆에 작은 촉수들
  m22: (d, t = 0) => {
    const col = '#6f4fb5', sw = S(t * 1.8) * 3;
    for (const s of [-1, 1]) d.line(c => { c.moveTo(s * 10, 0); c.quadraticCurveTo(s * 17, -10, s * 14 + sw * 0.5, -18); c.quadraticCurveTo(s * 11, -21, s * 13, -16); }, '#5a3d99', 3);
    d.ell(0, -2, 13, 3.5, '#4a3080');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-9, -1); c.bezierCurveTo(-11, -20, -6 + sw, -34, 2 + sw, -46); c.quadraticCurveTo(12 + sw, -50, 10 + sw, -42); c.quadraticCurveTo(7 + sw, -40, 8 + sw, -38); c.bezierCurveTo(6 + sw * 0.5, -28, 10, -16, 9, -1); c.closePath(); }, col, [0, -22, 16]);
    for (let i = 0; i < 5; i++) { const y = -6 - i * 7; const x = 7 - i * 0.3 + sw * (i / 6); d.circle(x, y, 2 - i * 0.15, '#c9a8f0'); d.dot(x, y, 0.8, '#8a6ac9'); }
    grumpy(d, -1 + sw * 0.4, -26, 3.6, 2.1, '#ffe36b', '#2a1a4a');
    pout(d, -1 + sw * 0.35, -19, 1.8, '#2a1a4a');
  },
  // 23 바위 두더지: 땅에서 반쯤 나온 몸, 큰 분홍 코, 커다란 발톱, 흙더미
  m23: (d, t = 0) => {
    const col = '#8a7a6a', pk = Math.max(0, S(t * 2)) * 2;
    d.ell(0, -4, 20, 6, '#a3825c');
    d.rr(-13, -34 - pk, 26, 32, 12, col);
    d.ell(0, -14 - pk, 8, 9, '#b3a493');
    for (const s of [-1, 1]) {
      d.ell(s * 13, -10 - pk, 5.5, 4, '#ffc2b0');
      for (let i = -1; i <= 1; i++) d.tri([[s * 15 + i * 2.4 - 1, -12 - pk], [s * 17 + i * 3, -19 - pk + Math.abs(i)], [s * 15 + i * 2.4 + 1.2, -12 - pk]], '#f3efe6');
    }
    d.circle(0, -23 - pk, 3.3, '#ff9fb2');
    d.dot(-1, -24 - pk, 1, '#ffffff');
    grumpy(d, 0, -28 - pk, 5.5, 1.4);
    d.line(c => { for (const s of [-1, 1]) { c.moveTo(s * 4, -22 - pk); c.lineTo(s * 11, -23 - pk); c.moveTo(s * 4, -21 - pk); c.lineTo(s * 11, -20 - pk); } }, '#4a3a2e', 0.5);
    for (const [x, y, r] of [[-17, -5, 3], [16, -6, 3.5], [-10, -1, 2.5], [11, -1, 2.2]]) d.circle(x, y, r, '#94765a');
    d.circle(-15, -3, 2.2, '#9a9aa6');
  },
  // 24 수정 박쥐: 각진 수정 날개, 이마의 수정, 반짝임
  m24: (d, t = 0) => {
    const col = '#b9a6ff', f = -7 - S(t * 4.5) * 2, flap = S(t * 11);
    for (const s of [-1, 1]) {
      d.tri([[s * 6, -26 + f], [s * 23, -36 + f - flap * 5], [s * 17, -16 + f]], '#d4c8ff');
      d.tri([[s * 7, -22 + f], [s * 19, -22 + f - flap * 2], [s * 12, -12 + f]], '#a08cf0');
      d.line(c => { c.moveTo(s * 6, -26 + f); c.lineTo(s * 17, -16 + f); }, '#ffffff', 0.6);
    }
    d.ell(0, -20 + f, 8.5, 10, col);
    d.tri([[-4, -28 + f], [-7, -38 + f], [-1, -29 + f]], col); d.tri([[4, -28 + f], [7, -38 + f], [1, -29 + f]], col);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(0, -34 + f); c.lineTo(2.5, -29 + f); c.lineTo(0, -26 + f); c.lineTo(-2.5, -29 + f); c.closePath(); }, '#7fe0ff', [0, -30 + f, 4]);
    const tw = 0.5 + 0.5 * S(t * 6);
    d.line(c => { c.moveTo(14, -40 + f); c.lineTo(14, -34 + f); c.moveTo(11, -37 + f); c.lineTo(17, -37 + f); }, '#ffffff', 0.8 * tw + 0.2);
    grumpy(d, 0, -21 + f, 3.6, 1.9, '#3a2a6a');
    d.tri([[-1.5, -15.5 + f], [-1, -13.5 + f], [-0.4, -15.5 + f]], '#ffffff');
    d.line(c => { c.moveTo(-2, -12 + f); c.lineTo(-2, -9 + f); c.moveTo(2, -12 + f); c.lineTo(2, -9 + f); }, '#8a76d9', 1.1);
  },
  // 25 광석 골렘: 바위 블록을 쌓은 몸, 반짝이는 광석 박힘, 가슴 심장석
  m25: (d, t = 0) => {
    const col = '#a39aa8', b = S(t * 1.4) * 0.6, dk = tone(col, -0.18);
    d.rr(-15, -12, 11, 12, 3, dk); d.rr(4, -12, 11, 12, 3, dk);
    d.rr(-18, -36 + b, 36, 26, 6, col);
    for (const s of [-1, 1]) { d.rr(s > 0 ? 17 : -26, -34 + b + S(t * 1.4 + s) * 1.2, 9, 22, 4, dk); d.circle(s * 21.5, -10 + b + S(t * 1.4 + s) * 1.2, 5.5, col); }
    d.rr(-11, -52 + b, 22, 17, 5, col);
    for (const [x, y, k] of [[-12, -30, '#ffd36b'], [11, -16, '#7fe0ff'], [-8, -15, '#ff8fb8'], [6, -48, '#ffd36b'], [13, -31, '#b38cff'], [-23, -24, '#7fe0ff']]) {
      d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(x, y - 2.5 + b); c.lineTo(x + 2.2, y + b); c.lineTo(x, y + 2.5 + b); c.lineTo(x - 2.2, y + b); c.closePath(); }, k, [x, y + b, 3]);
    }
    const g = 0.4 + 0.25 * S(t * 3);
    d.dot(0, -23 + b, 6, '#ff5a78', g);
    d.circle(0, -23 + b, 3.5, '#ff5a78');
    grumpy(d, 0, -44 + b, 4.5, 1.9, '#ffe36b', EYE);
    d.line(c => { c.moveTo(-3, -39 + b); c.lineTo(3, -39 + b); }, EYE, 1.1);
    d.line(c => { c.moveTo(-18, -26 + b); c.lineTo(-5, -26 + b); c.moveTo(5, -16 + b); c.lineTo(18, -16 + b); }, dk, 0.7);
  },
  // 26 용암 슬라임: 녹아내리는 오렌지 슬라임, 위가 굳은 검은 껍질, 빛나는 방울
  m26: (d, t = 0) => {
    const col = '#ff6b3b', sq = S(t * 2.5) * 1.3;
    d.dot(0, -12, 22, '#ffb36b', 0.18 + 0.08 * S(t * 3));
    d.ell(0, -1, 19, 3, '#ff4a2a');
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-18 - sq, -1); c.quadraticCurveTo(-19, -20 + sq, -8, -28 + sq); c.quadraticCurveTo(0, -36 + sq, 8, -28 + sq); c.quadraticCurveTo(19, -20 + sq, 18 + sq, -1); c.closePath(); }, col, [0, -14, 18]);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-10, -27 + sq); c.quadraticCurveTo(0, -38 + sq, 10, -27 + sq); c.lineTo(6, -24 + sq); c.lineTo(2, -27 + sq); c.lineTo(-3, -23 + sq); c.lineTo(-7, -26 + sq); c.closePath(); }, '#4a2a2a', [0, -29 + sq, 9]);
    for (let i = 0; i < 3; i++) {
      const x = [-13, 3, 14][i], ph = (t * 0.8 + i * 0.33) % 1;
      d.ell(x, -14 + ph * 10, 1.8, 2.6, '#ffd36b');
      d.dot(x, -5 + ph * 4, 1.2 * (1 - ph), '#ffe36b', 1 - ph);
    }
    for (const [x, y] of [[-8, -20], [9, -9], [-3, -7]]) d.dot(x, y + sq * 0.5, 1.5, '#ffd36b', 0.8);
    grumpy(d, 0, -17 + sq * 0.4, 5, 2.2, '#4a1a10');
    d.line(c => { c.moveTo(-3, -10); c.lineTo(-1, -11.5); c.lineTo(1, -10); c.lineTo(3, -11.5); }, '#4a1a10', 1);
  },
  // 27 그림자 광부: 그림자 몸, 헬멧과 빛나는 램프 빛줄기, 곡괭이
  m27: (d, t = 0) => {
    const col = '#3b3b46', f = -S(t * 2) * 1.5, beam = 0.15 + 0.08 * S(t * 5);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-5, -40 + f); c.lineTo(-24, -52 + f); c.lineTo(-24, -32 + f); c.closePath(); }, '#fff2a8', [-14, -42, 1]);
    d.dot(-14, -43 + f, 10, '#fff2a8', beam);
    // 곡괭이
    { const c = d.ctx; c.save(); c.translate(14, -20 + f); c.rotate(-0.35 + S(t * 2) * 0.1); d.rr(-1, -16, 2.4, 22, 1, '#9a6a45'); d.shape(() => { const c2 = d.ctx; c2.beginPath(); c2.moveTo(-9, -12); c2.quadraticCurveTo(0, -20, 9, -12); c2.quadraticCurveTo(0, -16, -9, -12); c2.closePath(); }, '#b8bcc8', [0, -15, 9]); c.restore(); }
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-13, -1); c.quadraticCurveTo(-16, -24 + f, -12, -32 + f); c.lineTo(12, -32 + f); c.quadraticCurveTo(16, -24 + f, 13, -1); for (let i = 0; i < 4; i++) { const x = 13 - (i + 1) * 6.5; c.quadraticCurveTo(x + 3.25, -6 + S(t * 3 + i), x, -1); } c.closePath(); }, col, [0, -16, 15]);
    d.circle(0, -30 + f, 12, col);
    d.circle(14, -14 + f, 3.5, col);
    // 헬멧
    d.shape(() => { const c = d.ctx; c.beginPath(); c.arc(0, -34 + f, 12.5, PI, 0); c.closePath(); }, '#e8b23a', [0, -40 + f, 12]);
    d.rr(-15, -35 + f, 30, 3, 1.5, '#c99528');
    d.circle(-4, -42 + f, 3.2, '#fff6c8');
    d.dot(-4, -42 + f, 1.5, '#ffffff');
    d.line(c => { c.moveTo(-3, -38 + f); c.lineTo(5, -45 + f); }, '#8a6a20', 0.6);
    glowEyes(d, 0, -27 + f, 4.5, 1.9, '#9fe8ff', t);
    d.line(c => { c.moveTo(-2.5, -21 + f); c.lineTo(2.5, -21 + f); }, '#9fe8ff', 0.8);
  },
  // 28 동굴의 주인: 거대 보스 골렘, 커다란 외눈, 왕관, 수정 어깨, 두꺼운 팔
  m28: (d, t = 0) => {
    const col = '#5b2f6f', b = S(t * 1.2) * 0.8, dk = tone(col, -0.25), lt = tone(col, 0.2);
    d.dot(0, -28, 26, '#b58cff', 0.12 + 0.06 * S(t * 2));
    d.rr(-17, -13, 13, 13, 4, dk); d.rr(4, -13, 13, 13, 4, dk);
    for (const s of [-1, 1]) {
      const a = S(t * 1.2 + s) * 1.5;
      d.rr(s > 0 ? 18 : -29, -38 + b + a, 11, 30, 5, dk);
      d.circle(s * 23.5, -7 + b + a, 7, col);
      d.tri([[s * 18, -40 + b], [s * 25, -52 + b], [s * 29, -38 + b]], '#c9a6ff');
      d.tri([[s * 22, -40 + b], [s * 29, -48 + b], [s * 30, -38 + b]], '#9f7ae0');
    }
    d.rr(-20, -46 + b, 40, 36, 10, col);
    d.rr(-12, -24 + b, 24, 12, 5, lt);
    for (const [x, y] of [[-14, -16], [14, -38], [-15, -40]]) d.dot(x, y + b, 1.3, '#c9a6ff', 0.8);
    // 외눈
    const look = S(t * 0.9) * 2;
    d.circle(0, -34 + b, 9.5, '#fff8ee');
    d.dot(look, -33.5 + b, 5.5, '#ff4a6a');
    d.dot(look, -33.5 + b, 3, '#2a1030');
    d.dot(look - 1.5, -35.5 + b, 1.4, '#ffffff');
    d.line(c => { c.moveTo(-11, -47 + b); c.lineTo(0, -43 + b); c.lineTo(11, -47 + b); }, '#2a1030', 2);
    d.line(c => { c.moveTo(-5, -18 + b); c.quadraticCurveTo(0, -20.5 + b, 5, -18 + b); }, '#2a1030', 1.4);
    // 왕관
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(-11, -48 + b); c.lineTo(-12, -57 + b); c.lineTo(-6, -52 + b); c.lineTo(0, -59 + b); c.lineTo(6, -52 + b); c.lineTo(12, -57 + b); c.lineTo(11, -48 + b); c.closePath(); }, '#ffd04a', [0, -53 + b, 10]);
    for (const [x, y, k] of [[0, -54, '#ff5a78'], [-7, -50.5, '#7fe0ff'], [7, -50.5, '#7fe0ff']]) d.dot(x, y + b, 1.4, k);
    d.dot(-12, -57 + b, 1, '#fff6c8'); d.dot(12, -57 + b, 1, '#fff6c8'); d.dot(0, -59 + b, 1.1, '#fff6c8');
  },
  // 29 별똥 유령: 별 모양 몸 + 뒤로 길게 흐르는 꼬리와 반짝이
  m29: (d, t = 0) => {
    const col = '#fff6b0', f = -6 - S(t * 2.2) * 2, wv = S(t * 3);
    d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(4, -32 + f); c.quadraticCurveTo(14, -26 + f + wv * 2, 22, -12 + wv * 2); c.quadraticCurveTo(16, -18 + f, 6, -14 + f); c.closePath(); }, '#ffd9f0', [12, -20 + f, 10]);
    d.line(c => { c.moveTo(4, -28 + f); c.quadraticCurveTo(14, -22 + f + wv * 2, 21, -10 + wv * 2); }, '#b8e0ff', 1.2);
    for (let i = 0; i < 4; i++) { const p = (t * 0.7 + i / 4) % 1; d.dot(8 + p * 14, -26 + f + p * 16 + wv * p * 2, 1.4 * (1 - p) + 0.3, '#fff6b0', 1 - p); }
    d.shape(() => {
      const c = d.ctx; c.beginPath();
      for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5 + S(t * 1.5) * 0.08, r = i % 2 ? 7.5 : 15; const x = C(a) * r, y = -24 + f + S(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.closePath();
    }, col, [0, -24 + f, 15]);
    d.dot(-4, -30 + f, 2.2, '#ffffff', 0.7);
    grumpy(d, 0, -24 + f, 3.6, 1.8, '#6a5a2a');
    blush(d, 0, -20 + f, 6, 1.6);
    pout(d, 0, -19 + f, 1.4, '#6a5a2a');
    d.ell(0, -1, 6, 1.3, '#e8e2b8');
  },
  // 30 달빛 나방: 넓은 네 장 날개에 달 무늬 점, 깃털 더듬이, 보송한 몸
  m30: (d, t = 0) => {
    const col = '#d9e3ff', fl = 0.8 + 0.2 * Math.abs(C(t * 6)), b = S(t * 2) * 1.2;
    for (const s of [-1, 1]) {
      const c = d.ctx; c.save(); c.translate(s * 3, -24 + b); c.scale(fl, 1);
      d.ell(s * 11, -7, 11, 9, col);
      d.ell(s * 9, 6, 8, 7, '#c3cff5');
      d.circle(s * 12, -8, 4, '#fff6c8');
      d.dot(s * 13.5, -9, 3.2, col);
      d.dot(s * 9, 6, 2, '#a3b3e8');
      d.dot(s * 5, -12, 1.2, '#a3b3e8');
      d.stitch(c2 => { c2.moveTo(s * 2, -10); c2.quadraticCurveTo(s * 14, -18, s * 21, -8); }, '#ffffff', 0.7);
      c.restore();
    }
    d.ell(0, -18 + b, 4.5, 12, '#f0f3ff');
    for (const y of [-14, -10, -6]) d.line(c => { c.moveTo(-3.5, y + b); c.lineTo(3.5, y + b); }, '#c3cff5', 0.6);
    d.circle(0, -30 + b, 6, '#f0f3ff');
    for (const s of [-1, 1]) {
      d.line(c => { c.moveTo(s * 2, -35 + b); c.quadraticCurveTo(s * 4, -42 + b, s * 9, -44 + b); }, '#8a96c8', 0.9);
      d.line(c => { for (let i = 1; i <= 4; i++) { const x = s * (2 + i * 1.6), y = -36 - i * 1.9 + b; c.moveTo(x, y); c.lineTo(x + s * 1.5, y - 1.8); } }, '#8a96c8', 0.6);
    }
    d.line(c => { c.moveTo(-2, -6 + b); c.lineTo(-3, 0); c.moveTo(2, -6 + b); c.lineTo(3, 0); }, '#8a96c8', 0.9);
    grumpy(d, 0, -30 + b, 2.6, 1.5, '#3a4070');
  },
};
