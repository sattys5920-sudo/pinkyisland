// 가구 그림 2탄 20종. (x,y)는 바닥에 닿는 점, 위로(-y) 약 90px·폭 약 100px 안에 그려요.
// FURN_LIST 와 같은 형식: [이름, 골드, 재료, 개수, 모양 id, 기본색]
export const FURN2 = [
  ['책 더미', 300, 'ore:o01', 3, 'bookpile', '#ff9fbf'],
  ['이젤과 그림', 600, 'ore:o02', 2, 'easel', '#d9a46f'],
  ['티 테이블 세트', 700, 'ore:o05', 3, 'teaset', '#ffd3e2'],
  ['지구본', 800, 'ore:o03', 2, 'globe', '#8fd3f5'],
  ['커튼 창문', 900, 'ore:o06', 3, 'window', '#ffb3d1'],
  ['아기 텐트', 1000, 'ore:o07', 3, 'tent', '#ffb3c6'],
  ['실내 그네', 1100, 'ore:o17', 2, 'swing', '#c98e5b'],
  ['미니 냉장고', 1200, 'ore:o11', 4, 'fridge', '#bfe3ff'],
  ['기타 스탠드', 1300, 'ore:o10', 3, 'guitar', '#e08a4f'],
  ['오븐', 1400, 'ore:o14', 3, 'oven', '#ff9fbf'],
  ['화장대', 1500, 'ore:o12', 3, 'vanity', '#ffd3e2'],
  ['캣타워', 1700, 'ore:o19', 2, 'catTower', '#f0d5b0'],
  ['욕조', 2000, 'ore:o15', 3, 'bath', '#f4fbff'],
  ['도넛 의자', 2200, 'ore:o18', 2, 'donutChair', '#ff9fc4'],
  ['마카롱 타워', 2800, 'ore:o24', 2, 'macaronTower', '#ffd6e8'],
  ['주크박스', 3200, 'ore:o20', 3, 'jukebox', '#ff5a78'],
  ['미니 분수', 3600, 'ore:o26', 2, 'fountainMini', '#9fe0c9'],
  ['컵케이크 조명', 4400, 'ore:o29', 2, 'cupcakeLamp', '#fff3a8'],
  ['미니 관람차', 5000, 'ore:o27', 2, 'ferris', '#ffb3d9'],
  ['초승달 침대', 8000, 'ore:o37', 2, 'moonBed', '#fff6b0'],
];

const PI = Math.PI;
const sh = (col, k) => globalThis.shade(col, k);
const WOOD = '#c98e5b', WOOD_D = '#8a5a3b', WHITE = '#ffffff', INK = '#3b3b46', METAL = '#c9c9d6';
// 작은 반짝이 (십자 별)
const sparkle = (d, x, y, s, col = '#fff6b0') => d.shape(() => { const c = d.ctx; c.beginPath(); c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s); c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s); c.closePath(); }, col, [x, y, s]);
// 마카롱 한 개 (가운데 y, 반지름 r)
const macaron = (d, x, y, r, col) => {
  d.rr(x - r, y - r * .55, r * 2, r * .55, [r * .45, r * .45, r * .15, r * .15], col);
  d.rr(x - r * .9, y - r * .05, r * 1.8, r * .3, r * .1, WHITE);
  d.rr(x - r, y + r * .15, r * 2, r * .55, [r * .15, r * .15, r * .45, r * .45], sh(col, -.08));
  d.dot(x - r * .45, y - r * .35, r * .18, WHITE, .7);
};

export const FURN2_DRAW = {
  // 책 더미: 알록달록 책 5권 + 꼭대기에 작은 머그컵
  bookpile: (d, x, y, col) => {
    const books = [[col, 44, 0], ['#a9d8ff', 40, 2], ['#ffe066', 42, -3], ['#b5e6a3', 36, 1], ['#c9a6ff', 32, -2]];
    books.forEach(([bc, w, off], i) => {
      const by = y - 11 * (i + 1), bx = x - w / 2 + off;
      d.rr(bx, by, w, 11, 3, bc);
      d.rr(bx + w - 5, by + 2, 4, 7, 1.5, '#fff7ee'); // 책장 단면
      d.line(c => { c.moveTo(bx + 5, by + 5.5); c.lineTo(bx + w * .4, by + 5.5); }, sh(bc, .5), 1.4); // 책등 글씨
    });
    d.rr(x - 18, y - 42, 3, 14, 1.5, '#ff5a78'); // 책갈피 리본
    d.rr(x - 8, y - 68, 16, 13, 4, WHITE); // 머그컵
    d.line(c => { c.arc(x + 9, y - 61.5, 4, -PI / 2, PI / 2); }, WHITE, 2.4);
    d.ell(x, y - 68, 6, 2, '#c98e5b');
    d.dot(x - 2, y - 61, 2.2, '#ff8fb3');
  },
  // 이젤과 그림: 나무 다리 셋 + 캔버스에 풍경화
  easel: (d, x, y, col) => {
    d.line(c => { c.moveTo(x - 28, y); c.lineTo(x - 8, y - 82); c.moveTo(x + 28, y); c.lineTo(x + 8, y - 82); c.moveTo(x, y - 76); c.lineTo(x + 2, y - 4); }, col, 4.5);
    d.rr(x - 24, y - 72, 48, 42, 3, WHITE);
    d.rr(x - 20, y - 68, 40, 20, 2, '#bfe8ff');
    d.rr(x - 20, y - 50, 40, 16, 2, '#b5e6a3');
    d.circle(x - 10, y - 60, 4.5, '#ffe066');
    d.circle(x + 8, y - 44, 5, '#ff9fbf'); d.rr(x + 7, y - 42, 2, 8, 1, WOOD_D);
    d.dot(x + 12, y - 62, 3, WHITE, .9); d.dot(x + 16, y - 61, 2.4, WHITE, .9);
    d.rr(x - 27, y - 30, 54, 5, 2, sh(col, -.15)); // 받침대
    d.rr(x + 12, y - 36, 3, 9, 1.5, '#ff5a78'); d.rr(x + 18, y - 35, 3, 8, 1.5, '#5b8cff'); // 붓
  },
  // 티 테이블 세트: 둥근 테이블 + 찻주전자 + 잔 두 개
  teaset: (d, x, y, col) => {
    const c = d.ctx;
    d.ell(x, y - 2, 16, 4, sh(col, -.3));
    d.rr(x - 3, y - 30, 6, 28, 3, sh(col, -.12));
    d.ell(x, y - 32, 30, 9, col);
    d.stitch(c => c.ellipse(x, y - 32, 24, 6, 0, 0, 7), WHITE, .6); // 레이스
    // 잔
    [-24, 16].forEach((ox, i) => { d.rr(x + ox, y - 42, 11, 8, 3, WHITE); d.line(c => { c.arc(x + ox + (i ? 11 : 0), y - 38, 3, -PI / 2, PI / 2, !i); }, WHITE, 1.8); d.ell(x + ox + 5.5, y - 42, 4, 1.5, '#d9a46f'); });
    // 주전자
    d.shape(() => { c.beginPath(); c.moveTo(x + 7, y - 48); c.quadraticCurveTo(x + 15, y - 52, x + 16, y - 60); c.lineTo(x + 13, y - 60); c.quadraticCurveTo(x + 12, y - 53, x + 5, y - 44); c.closePath(); }, WHITE, [x + 12, y - 53, 5]);
    d.line(c => { c.arc(x - 10, y - 48, 5, PI / 2, PI * 1.5); }, WHITE, 2.4);
    d.circle(x, y - 47, 9.5, WHITE);
    d.rr(x - 5, y - 59, 10, 4, 2, WHITE); d.dot(x, y - 60, 2, '#ff8fb3');
    d.dot(x - 2, y - 48, 2.2, '#ff8fb3'); d.dot(x - 5, y - 46, 1.2, '#6cc46a'); d.dot(x + 1, y - 46, 1.2, '#6cc46a');
    d.dot(x - 4, y - 52, 1.6, WHITE, .9);
  },
  // 지구본: 나무 받침 + 둥근 지구 + 반고리
  globe: (d, x, y, col) => {
    d.ell(x, y - 2, 14, 4, WOOD_D);
    d.rr(x - 2.5, y - 16, 5, 14, 2, WOOD_D);
    d.circle(x, y - 40, 22, col);
    d.ell(x - 7, y - 47, 8, 6, '#6cc46a'); d.ell(x + 9, y - 35, 7, 5, '#6cc46a'); d.ell(x - 9, y - 30, 5, 3.5, '#6cc46a'); d.ell(x + 6, y - 52, 4, 3, '#6cc46a');
    d.dot(x - 11, y - 51, 2, WHITE, .6);
    d.dot(x - 8, y - 50, 3, WHITE, .35);
    d.line(c => { c.arc(x, y - 40, 25, -PI * .5, PI * .5); }, '#e8c56a', 3.2);
    d.dot(x, y - 65, 2.6, '#e8c56a'); d.dot(x, y - 15, 2.6, '#e8c56a');
  },
  // 커튼 창문: 하얀 창틀 + 하늘 + 커튼 + 아래 꽃 화분
  window: (d, x, y, col) => {
    const c = d.ctx;
    d.rr(x - 30, y - 88, 60, 62, 5, WHITE);
    d.rr(x - 25, y - 83, 50, 52, 4, '#bfe8ff');
    d.circle(x + 10, y - 70, 6, '#ffe066');
    d.ell(x - 8, y - 60, 8, 3.5, WHITE); d.ell(x + 12, y - 50, 7, 3, WHITE);
    d.line(c => { c.moveTo(x, y - 83); c.lineTo(x, y - 31); c.moveTo(x - 25, y - 57); c.lineTo(x + 25, y - 57); }, WHITE, 3);
    // 커튼 (양쪽, 허리를 묶음)
    [[-1, x - 25], [1, x + 25]].forEach(([s, ex]) => {
      d.shape(() => { c.beginPath(); c.moveTo(ex, y - 86); c.lineTo(ex + s * 6, y - 86); c.quadraticCurveTo(ex + s * 2, y - 60, ex + s * 20, y - 48); c.quadraticCurveTo(ex + s * 8, y - 40, ex + s * 20, y - 33); c.lineTo(ex, y - 33); c.closePath(); }, col, [ex + s * 10, y - 60, 20]);
      d.rr(ex + (s < 0 ? -6 : 0), y - 50, 6, 4, 2, sh(col, -.25));
    });
    d.rr(x - 32, y - 30, 64, 5, 2, '#fff7ee'); // 창턱
    // 화분
    d.rr(x - 26, y - 18, 52, 18, 5, WOOD);
    d.rr(x - 28, y - 20, 56, 6, 3, sh(WOOD, .15));
    [[-16, '#ff5a78'], [0, '#ffe066'], [16, '#c9a6ff']].forEach(([ox, fc]) => { d.circle(x + ox - 5, y - 22, 3.5, '#6cc46a'); d.circle(x + ox + 5, y - 23, 3.5, '#6cc46a'); d.circle(x + ox, y - 26, 4.5, fc); d.dot(x + ox, y - 26, 1.6, '#fff7ee'); });
  },
  // 아기 텐트: 뾰족 삼각 텐트 + 하얀 줄무늬 + 입구 + 깃발과 가랜드
  tent: (d, x, y, col) => {
    const c = d.ctx;
    d.rr(x - 1.5, y - 86, 3, 20, 1.5, WOOD);
    d.tri([[x + 1, y - 86], [x + 14, y - 81], [x + 1, y - 76]], '#ff5a78');
    d.shape(() => { c.beginPath(); c.moveTo(x - 42, y); c.quadraticCurveTo(x - 20, y - 36, x, y - 72); c.quadraticCurveTo(x + 20, y - 36, x + 42, y); c.closePath(); }, col, [x, y - 24, 62]);
    // 하얀 줄무늬
    [[-32, -14], [32, 14], [-22, -9], [22, 9]].forEach(([bx, tx]) => d.shape(() => { c.beginPath(); c.moveTo(x + bx, y); c.lineTo(x + bx + Math.sign(bx) * 6, y); c.quadraticCurveTo(x + tx * 1.4, y - 34, x + tx * .3, y - 66); c.lineTo(x + tx * .1, y - 68); c.quadraticCurveTo(x + tx * 1.2, y - 36, x + bx, y); c.closePath(); }, '#fff7f0', [x + bx / 2, y - 24, 62]));
    // 입구 (살짝 열린 플랩)
    d.shape(() => { c.beginPath(); c.moveTo(x - 13, y); c.quadraticCurveTo(x - 7, y - 20, x, y - 40); c.quadraticCurveTo(x + 7, y - 20, x + 13, y); c.closePath(); }, '#b58fc9', [x, y - 14, 62]);
    d.shape(() => { c.beginPath(); c.moveTo(x, y - 40); c.quadraticCurveTo(x + 7, y - 20, x + 13, y); c.lineTo(x + 25, y - 3); c.quadraticCurveTo(x + 14, y - 20, x + 2, y - 36); c.closePath(); }, sh(col, .35), [x + 12, y - 14, 62]);
    d.dot(x + 20, y - 7, 1.8, '#ff5a78');
    // 가랜드
    d.line(c => { c.moveTo(x - 30, y - 30); c.quadraticCurveTo(x, y - 12, x + 30, y - 30); }, '#8a5a3b', 1.2);
    [[-22, '#ff9fbf'], [-10, '#a9d8ff'], [3, '#ffe066'], [16, '#b5e6a3']].forEach(([ox, fc]) => { const gy = y - 30 + 14 * (1 - (ox / 30) ** 2); d.tri([[x + ox - 3.5, gy], [x + ox, gy + 7], [x + ox + 3.5, gy]], fc); });
    d.dot(x - 8, y - 56, 2.4, WHITE, .9); d.dot(x + 6, y - 50, 1.6, WHITE, .9);
  },
  // 실내 그네: A자 틀 + 밧줄 + 쿠션 얹은 널빤지
  swing: (d, x, y, col) => {
    d.line(c => { c.moveTo(x - 36, y - 84); c.lineTo(x - 46, y); c.moveTo(x - 36, y - 84); c.lineTo(x - 26, y); c.moveTo(x + 36, y - 84); c.lineTo(x + 46, y); c.moveTo(x + 36, y - 84); c.lineTo(x + 26, y); }, col, 5);
    d.rr(x - 42, y - 88, 84, 7, 3.5, sh(col, -.15));
    d.line(c => { c.moveTo(x - 18, y - 84); c.lineTo(x - 18, y - 36); c.moveTo(x + 18, y - 84); c.lineTo(x + 18, y - 36); }, '#e8d2a6', 2.2);
    d.rr(x - 26, y - 34, 52, 7, 3.5, sh(col, .1));
    d.rr(x - 22, y - 40, 44, 8, 4, '#ff9fbf');
    d.dot(x - 10, y - 36, 1.4, WHITE, .9); d.dot(x + 10, y - 36, 1.4, WHITE, .9);
    d.circle(x - 32, y - 80, 2.2, WHITE); d.circle(x + 32, y - 80, 2.2, WHITE);
  },
  // 미니 냉장고: 둥근 하얀 몸통 + 손잡이 + 자석
  fridge: (d, x, y, col) => {
    d.rr(x - 22, y - 74, 44, 74, 9, col);
    d.line(c => { c.moveTo(x - 20, y - 46); c.lineTo(x + 20, y - 46); }, sh(col, -.3), 1.6);
    d.rr(x + 11, y - 66, 4.5, 12, 2.2, WHITE); d.rr(x + 11, y - 38, 4.5, 20, 2.2, WHITE);
    d.dot(x - 9, y - 60, 3.4, '#ff5a78'); d.dot(x - 9, y - 61, 1.2, WHITE, .8);
    d.rr(x - 13, y - 34, 11, 8, 2, '#ffe066'); d.dot(x - 7.5, y - 30, 1.6, '#ff8fb3');
    d.dot(x - 4, y - 20, 3, '#6cc46a'); d.dot(x - 3, y - 21, 1, WHITE, .8);
    d.rr(x - 18, y - 2, 6, 2.5, 1, sh(col, -.4)); d.rr(x + 12, y - 2, 6, 2.5, 1, sh(col, -.4));
    d.dot(x - 14, y - 68, 2.2, WHITE, .8);
  },
  // 기타 스탠드: 삼각 받침 + 통기타
  guitar: (d, x, y, col) => {
    d.line(c => { c.moveTo(x, y - 24); c.lineTo(x - 18, y); c.moveTo(x, y - 24); c.lineTo(x + 18, y); c.moveTo(x, y - 24); c.lineTo(x, y - 4); }, INK, 3.5);
    d.rr(x - 3.5, y - 82, 7, 48, 2.5, WOOD_D);
    d.rr(x - 6, y - 90, 12, 11, 3, WOOD_D);
    d.dot(x - 7, y - 87, 1.6, METAL); d.dot(x + 7, y - 87, 1.6, METAL); d.dot(x - 7, y - 82, 1.6, METAL); d.dot(x + 7, y - 82, 1.6, METAL);
    d.ell(x, y - 24, 19, 17, col);
    d.ell(x, y - 48, 14, 12, col);
    d.circle(x, y - 38, 5.5, '#3b2f2f');
    d.line(c => { c.arc(x, y - 38, 7, 0, 7); }, sh(col, .35), 1.2);
    d.rr(x - 8, y - 24, 16, 4, 2, INK);
    d.line(c => { for (let i = -1.5; i <= 1.5; i++) { c.moveTo(x + i * 1.6, y - 79); c.lineTo(x + i * 1.6, y - 23); } }, '#fff7ee', .7);
    d.dot(x - 8, y - 32, 2.4, WHITE, .5);
  },
  // 오븐: 몸통 + 둥근 창 안의 빵 + 다이얼
  oven: (d, x, y, col) => {
    d.rr(x - 30, y - 56, 60, 56, 7, col);
    d.rr(x - 30, y - 56, 60, 12, 6, sh(col, .25));
    [-18, -6, 6, 18].forEach(ox => { d.circle(x + ox, y - 50, 3.2, WHITE); d.line(c => { c.moveTo(x + ox, y - 50); c.lineTo(x + ox, y - 52.5); }, sh(col, -.4), 1); });
    d.rr(x - 24, y - 38, 48, 28, 6, '#4a3a4a');
    d.rr(x - 20, y - 34, 40, 20, 4, '#ffb366');
    d.rr(x - 20, y - 24, 40, 10, [0, 0, 4, 4], '#e8a054');
    d.ell(x - 6, y - 26, 8, 5, '#d9a46f'); d.ell(x + 7, y - 25, 6, 4.5, '#d9a46f');
    d.dot(x - 8, y - 28, 1.6, '#fff0d0', .7); d.dot(x + 6, y - 27, 1.4, '#fff0d0', .7);
    d.rr(x - 22, y - 42, 44, 4, 2, WHITE); // 손잡이
    d.dot(x - 24, y - 50, 2.2, WHITE, .8);
    d.rr(x - 26, y - 2, 7, 2.5, 1, sh(col, -.4)); d.rr(x + 19, y - 2, 7, 2.5, 1, sh(col, -.4));
  },
  // 화장대: 서랍장 + 타원 거울 + 전구 + 화장품
  vanity: (d, x, y, col) => {
    d.rr(x - 32, y - 30, 64, 30, 6, col);
    d.rr(x - 34, y - 34, 68, 6, 3, sh(col, .25));
    d.line(c => { c.moveTo(x - 28, y - 16); c.lineTo(x + 28, y - 16); c.moveTo(x, y - 26); c.lineTo(x, y - 4); }, sh(col, -.25), 1.4);
    d.dot(x - 14, y - 22, 2, WHITE); d.dot(x + 14, y - 22, 2, WHITE); d.dot(x - 14, y - 10, 2, WHITE); d.dot(x + 14, y - 10, 2, WHITE);
    d.ell(x, y - 62, 20, 26, sh(col, -.12));
    d.ell(x, y - 62, 15, 21, '#e8f4ff');
    d.dot(x - 6, y - 72, 4, WHITE, .5); d.dot(x - 4, y - 68, 2.4, WHITE, .5);
    for (let a = -PI * .75; a <= -PI * .25 + .01; a += PI * .25) d.dot(x + Math.cos(a) * 22, y - 62 + Math.sin(a) * 28, 2.4, '#fff6b0');
    d.rr(x - 26, y - 44, 5, 10, 1.5, '#ff5a78'); d.rr(x - 26, y - 46, 5, 3, 1, INK);
    d.rr(x + 20, y - 46, 9, 12, 3.5, '#c9a6ff'); d.rr(x + 22.5, y - 50, 4, 5, 1.5, '#ffd23f');
    d.rr(x - 30, y - 2, 6, 2.5, 1, sh(col, -.4)); d.rr(x + 24, y - 2, 6, 2.5, 1, sh(col, -.4));
  },
  // 캣타워: 기둥 + 발판 + 집 + 꼭대기의 고양이
  catTower: (d, x, y, col) => {
    d.rr(x - 32, y - 8, 64, 8, 4, sh(col, -.2));
    d.rr(x - 5, y - 74, 10, 68, 4, '#d9a46f');
    d.line(c => { for (let yy = -68; yy < -10; yy += 5) { c.moveTo(x - 5, y + yy); c.lineTo(x + 5, y + yy + 2); } }, '#b57f4a', 1.2);
    d.rr(x - 30, y - 50, 32, 8, 4, col);
    d.rr(x - 30, y - 54, 32, 6, 3, sh(col, .25)); // 발판 쿠션
    d.rr(x + 4, y - 36, 28, 28, 7, sh(col, -.08));
    d.circle(x + 18, y - 24, 7, '#5b4a5f');
    d.rr(x - 6, y - 78, 38, 8, 4, col);
    d.line(c => { c.moveTo(x - 24, y - 50); c.lineTo(x - 24, y - 36); }, '#b57f4a', 1.2); d.dot(x - 24, y - 33, 3.5, '#ff8fb3'); // 장난감
    // 고양이
    d.ell(x + 14, y - 83, 10, 5.5, WHITE);
    d.circle(x + 23, y - 86, 5.5, WHITE);
    d.tri([[x + 19, y - 90], [x + 20.5, y - 95], [x + 23, y - 90]], WHITE); d.tri([[x + 23.5, y - 90], [x + 26.5, y - 95], [x + 27.5, y - 89]], WHITE);
    d.line(c => { c.moveTo(x + 4, y - 83); c.quadraticCurveTo(x - 4, y - 84, x, y - 90); }, WHITE, 2.6);
    d.dot(x + 21.5, y - 86, .9, INK); d.dot(x + 25, y - 86, .9, INK); d.dot(x + 23.3, y - 84.3, .7, '#ff8fb3');
    d.ell(x + 10, y - 82, 3, 2.5, '#ffd3a8'); d.ell(x + 18, y - 81, 2.4, 2, '#ffd3a8');
  },
  // 욕조: 하얀 욕조 + 물과 거품 + 수도꼭지 + 고무 오리
  bath: (d, x, y, col) => {
    d.circle(x - 30, y - 3, 3.5, '#e8c56a'); d.circle(x + 30, y - 3, 3.5, '#e8c56a');
    d.rr(x - 42, y - 34, 84, 30, [10, 10, 16, 16], col);
    d.ell(x, y - 34, 42, 9, sh(col, .2));
    d.ell(x, y - 34, 35, 5.5, '#8fd3f5');
    d.dot(x - 20, y - 36, 3.6, WHITE, .9); d.dot(x - 14, y - 39, 2.6, WHITE, .9); d.dot(x + 20, y - 38, 3, WHITE, .9); d.dot(x + 26, y - 35, 2, WHITE, .9); d.dot(x + 4, y - 44, 1.8, WHITE, .8); d.dot(x - 26, y - 46, 1.4, WHITE, .8);
    d.rr(x + 30, y - 56, 4, 22, 2, METAL);
    d.line(c => { c.moveTo(x + 32, y - 55); c.quadraticCurveTo(x + 32, y - 62, x + 24, y - 62); c.lineTo(x + 22, y - 58); }, METAL, 3.5);
    d.dot(x + 32, y - 57, 3.2, METAL); d.dot(x + 38, y - 54, 2.4, '#ff5a78'); d.dot(x + 26, y - 54, 2.4, '#5b8cff');
    d.ell(x - 4, y - 38, 6, 4, '#ffe066'); d.circle(x + 1, y - 43, 3.6, '#ffe066'); d.tri([[x + 4, y - 43], [x + 8, y - 42], [x + 4, y - 41]], '#ff8c1a'); d.dot(x + 2, y - 44, .8, INK);
    d.dot(x - 30, y - 22, 3, WHITE, .5);
  },
  // 도넛 의자: 도넛 등받이 + 둥근 방석 + 스프링클
  donutChair: (d, x, y, col) => {
    const c = d.ctx;
    d.rr(x - 20, y - 14, 5, 14, 2, '#e8b87a'); d.rr(x + 15, y - 14, 5, 14, 2, '#e8b87a');
    d.shape(() => { c.beginPath(); c.arc(x, y - 52, 26, 0, 7); c.arc(x, y - 52, 9, 0, 7, true); }, '#e8b87a', [x, y - 52, 26]);
    d.shape(() => { c.beginPath(); c.moveTo(x - 26, y - 52); c.arc(x, y - 52, 26, PI, 0); c.quadraticCurveTo(x + 26, y - 44, x + 20, y - 42); c.quadraticCurveTo(x + 15, y - 36, x + 12, y - 44); c.quadraticCurveTo(x + 8, y - 30, x + 2, y - 40); c.quadraticCurveTo(x - 6, y - 32, x - 8, y - 44); c.quadraticCurveTo(x - 16, y - 34, x - 20, y - 42); c.quadraticCurveTo(x - 26, y - 44, x - 26, y - 52); c.closePath(); c.arc(x, y - 52, 9, 0, 7, true); }, col, [x, y - 52, 26]);
    [[-16, -58, '#ffe066'], [-8, -70, '#a9d8ff'], [4, -73, '#b5e6a3'], [14, -64, '#fff7ee'], [19, -52, '#ffe066'], [-20, -48, '#c9a6ff'], [10, -58, '#ff5a78']].forEach(([ox, oy, sc]) => d.rr(x + ox - 2.5, y + oy - 1, 5, 2.2, 1.1, sc));
    d.circle(x, y - 52, 8, '#fff0e0');
    d.ell(x, y - 20, 32, 11, sh(col, .15));
    d.ell(x, y - 24, 26, 6, sh(col, .4));
    d.dot(x - 12, y - 26, 1.6, WHITE, .9); d.dot(x + 10, y - 24, 1.6, WHITE, .9);
  },
  // 마카롱 타워: 접시 위에 4단으로 쌓은 마카롱 + 꼭대기 체리
  macaronTower: (d, x, y, col) => {
    d.ell(x, y - 4, 34, 7, WHITE); d.ell(x, y - 6, 26, 4, '#f4f0ff');
    const rows = [[-14, 11, [-33, -11, 11, 33]], [-34, 10, [-21, 0, 21]], [-52, 9, [-10, 10]], [-67, 8, [0]]];
    const cols = [col, '#b5e6a3', '#fff3a8', '#c9a6ff', '#a9d8ff', '#ffb3b3', '#ffd6a8', '#ffffff', '#ff9fc4', '#c9f0e8'];
    let i = 0;
    rows.forEach(([ry, r, xs]) => xs.forEach(ox => macaron(d, x + ox, y + ry, r, cols[i++ % cols.length])));
    d.circle(x, y - 80, 4, '#ff4f6d'); d.line(c => { c.moveTo(x, y - 84); c.quadraticCurveTo(x + 2, y - 89, x + 5, y - 89); }, '#6cc46a', 1.4); d.dot(x - 1.4, y - 81.4, 1.2, WHITE, .8);
  },
  // 주크박스: 아치형 몸통 + 유리창 속 레코드 + 스피커 + 색색 전구
  jukebox: (d, x, y, col) => {
    const c = d.ctx;
    d.shape(() => { c.beginPath(); c.moveTo(x - 30, y); c.lineTo(x - 30, y - 56); c.arc(x, y - 56, 30, PI, 0); c.lineTo(x + 30, y); c.closePath(); }, col, [x, y - 44, 42]);
    d.shape(() => { c.beginPath(); c.moveTo(x - 22, y - 42); c.lineTo(x - 22, y - 56); c.arc(x, y - 56, 22, PI, 0); c.lineTo(x + 22, y - 42); c.closePath(); }, '#fff0c8', [x, y - 56, 22]);
    d.circle(x, y - 58, 11, INK); d.dot(x, y - 58, 3.5, '#ffe066'); d.line(c => { c.arc(x, y - 58, 7, .3, 1.6); }, WHITE, 1, .4);
    d.rr(x - 24, y - 36, 48, 24, 5, sh(col, -.4));
    d.line(c => { for (let yy = -31; yy < -14; yy += 4.5) { c.moveTo(x - 19, y + yy); c.lineTo(x + 19, y + yy); } }, sh(col, -.1), 1.4);
    d.rr(x - 30, y - 8, 60, 8, [0, 0, 3, 3], METAL);
    const lights = ['#ffe066', '#7fe0ff', '#ff9fe0', '#b5e6a3', '#ffe066', '#7fe0ff', '#ff9fe0'];
    lights.forEach((lc, i) => { const a = PI + PI * (i + .5) / lights.length; d.dot(x + Math.cos(a) * 26, y - 56 + Math.sin(a) * 26, 2.6, lc); });
    d.rr(x - 26, y - 44, 52, 5, 2.5, METAL);
    d.dot(x - 16, y - 50, 2, WHITE, .6);
  },
  // 미니 분수: 두 겹 돌 수반 + 솟는 물줄기
  fountainMini: (d, x, y, col) => {
    d.ell(x, y - 6, 38, 11, col);
    d.ell(x, y - 8, 31, 7, '#8fd3f5');
    d.rr(x - 6, y - 42, 12, 36, 4, sh(col, -.15));
    d.ell(x, y - 42, 20, 7, col);
    d.ell(x, y - 44, 15, 4.5, '#8fd3f5');
    d.rr(x - 2.5, y - 56, 5, 14, 2, sh(col, -.2));
    d.line(c => { c.moveTo(x, y - 60); c.quadraticCurveTo(x - 10, y - 68, x - 14, y - 46); c.moveTo(x, y - 60); c.quadraticCurveTo(x + 10, y - 68, x + 14, y - 46); c.moveTo(x, y - 60); c.lineTo(x, y - 66); }, '#bfe8ff', 2.6);
    d.line(c => { c.moveTo(x - 20, y - 40); c.quadraticCurveTo(x - 26, y - 30, x - 28, y - 12); c.moveTo(x + 20, y - 40); c.quadraticCurveTo(x + 26, y - 30, x + 28, y - 12); }, '#bfe8ff', 2.2);
    d.dot(x, y - 70, 2.4, WHITE, .9); d.dot(x - 8, y - 66, 1.6, WHITE, .9); d.dot(x + 9, y - 65, 1.6, WHITE, .9);
    d.dot(x - 18, y - 10, 2, WHITE, .7); d.dot(x + 12, y - 44, 1.6, WHITE, .8); d.dot(x - 30, y - 6, 2.4, WHITE, .6);
    d.circle(x + 24, y - 10, 3.6, '#6cc46a'); d.circle(x - 26, y - 11, 3, '#6cc46a');
  },
  // 컵케이크 조명: 기둥 위에 컵케이크 갓, 크림이 빛나요
  cupcakeLamp: (d, x, y, col) => {
    const c = d.ctx;
    d.ell(x, y - 2, 13, 4.5, METAL);
    d.rr(x - 2.5, y - 48, 5, 46, 2.5, METAL);
    d.dot(x, y - 70, 30, col, .18);
    d.shape(() => { c.beginPath(); c.moveTo(x - 17, y - 66); c.lineTo(x + 17, y - 66); c.lineTo(x + 13, y - 44); c.quadraticCurveTo(x, y - 40, x - 13, y - 44); c.closePath(); }, '#ff9fbf', [x, y - 54, 16]);
    d.line(c => { for (let i = -2; i <= 2; i++) { c.moveTo(x + i * 6, y - 64); c.lineTo(x + i * 5.2, y - 45); } }, '#ff7faa', 1.2);
    d.circle(x - 9, y - 70, 9, col); d.circle(x + 9, y - 70, 9, col); d.circle(x, y - 68, 11, col);
    d.circle(x - 5, y - 78, 7.5, sh(col, .25)); d.circle(x + 5, y - 78, 7.5, sh(col, .25));
    d.circle(x, y - 85, 6, sh(col, .45));
    d.circle(x, y - 90, 3.6, '#ff4f6d'); d.dot(x - 1.2, y - 91.2, 1.1, WHITE, .8);
    d.dot(x - 10, y - 66, 1.6, '#ff9fbf'); d.dot(x + 6, y - 72, 1.6, '#7fe0ff'); d.dot(x - 2, y - 78, 1.6, '#ff9fbf');
    d.dot(x - 8, y - 82, 2, WHITE, .8);
  },
  // 미니 관람차: 바퀴 + 알록달록 곤돌라 + 삼각 받침
  ferris: (d, x, y, col) => {
    d.line(c => { c.moveTo(x - 22, y); c.lineTo(x, y - 50); c.lineTo(x + 22, y); }, WHITE, 5);
    d.rr(x - 26, y - 6, 52, 6, 3, WHITE);
    d.line(c => { c.arc(x, y - 50, 30, 0, 7); }, col, 4.5);
    d.line(c => { for (let i = 0; i < 6; i++) { const a = i * PI / 3 + .2; c.moveTo(x, y - 50); c.lineTo(x + Math.cos(a) * 30, y - 50 + Math.sin(a) * 30); } }, sh(col, .3), 2);
    const gcols = ['#ffe066', '#a9d8ff', '#b5e6a3', '#c9a6ff', '#ff9fbf', '#ffd6a8'];
    gcols.forEach((gc, i) => { const a = i * PI / 3 + .2, gx = x + Math.cos(a) * 30, gy = y - 50 + Math.sin(a) * 30; d.line(c => { c.moveTo(gx, gy); c.lineTo(gx, gy + 4); }, INK, 1.2); d.rr(gx - 6, gy + 4, 12, 10, 4, gc); d.rr(gx - 3, gy + 7, 6, 3.5, 1.5, WHITE); });
    d.circle(x, y - 50, 5.5, WHITE); d.dot(x, y - 50, 2, '#ff5a78');
  },
  // 초승달 침대: 노란 초승달 요람 + 베개 + 이불 + 별
  moonBed: (d, x, y, col) => {
    const c = d.ctx;
    d.rr(x - 24, y - 10, 7, 10, 2.5, '#e8c56a'); d.rr(x + 17, y - 10, 7, 10, 2.5, '#e8c56a');
    d.shape(() => { c.beginPath(); c.arc(x, y - 56, 48, PI * .08, PI * .92); c.arc(x, y - 70, 46, PI * .88, PI * .12, true); c.closePath(); }, col, [x, y - 30, 62]);
    d.circle(x + 44, y - 46, 3.5, col); d.circle(x - 44, y - 46, 3.5, col);
    d.ell(x + 2, y - 28, 30, 7, '#ff9fbf'); // 이불
    d.ell(x + 2, y - 32, 24, 4, '#ffb9d0');
    d.ell(x - 26, y - 34, 11, 6, WHITE); // 베개
    d.dot(x - 29, y - 36, 1.8, WHITE, .9);
    d.dot(x - 10, y - 30, 1.6, WHITE, .9); d.dot(x + 12, y - 29, 1.6, WHITE, .9);
    d.dot(x + 36, y - 40, 1, INK); d.line(c => { c.moveTo(x + 32, y - 36); c.quadraticCurveTo(x + 36, y - 33, x + 40, y - 36); }, INK, 1); d.dot(x + 36, y - 33, 1.6, '#ffadc4', .8); // 달의 얼굴
    sparkle(d, x - 38, y - 72, 5); sparkle(d, x + 40, y - 80, 4); sparkle(d, x + 10, y - 88, 3); sparkle(d, x - 20, y - 84, 2.4);
  },
};
