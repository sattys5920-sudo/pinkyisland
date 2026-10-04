// UI 아이콘: 이모지 대신 쓰는 클레이 아이콘들. 게임 아트와 같은 painter(d)로 그려요.
// 좌표는 가운데가 (0,0), 대략 -22 ~ 22 안에 그려요. index.html 의 uiURL(name) 이 PNG 로 구워 캐시해요.
const C = {
  gold:'#ffd35c', goldD:'#e9a93a', pink:'#ff9fc4', pinkD:'#f07aa6', red:'#ff6b86', redD:'#e2486a', cream:'#fff3e3', white:'#ffffff',
  sky:'#9fd9ff', skyD:'#6cbbe8', blue:'#7fb2ff', mint:'#9fe3c4', green:'#7fd07a', greenD:'#55ad57', leaf:'#6cc46a', brown:'#c98e5b', brownD:'#9a6a45',
  wood:'#e0b07a', stone:'#c3b8d2', stoneD:'#a297b4', gem:'#bf8cff', gemL:'#e2c9ff', lilac:'#c9b5ff', ink:'#5b3345', grey:'#d9d3df', orange:'#ffa14f', choco:'#9a5a45', yellow:'#fff09a',
};
const L = (d, fn, col, w) => d.line(fn, col, w);
const eyes = (d, x, y, gap=5, r=1.5) => { d.dot(x-gap, y, r, C.ink); d.dot(x+gap, y, r, C.ink); };
const blush = (d, x, y, gap=8) => { d.dot(x-gap, y, 2.4, '#ffadc4', .8); d.dot(x+gap, y, 2.4, '#ffadc4', .8); };
const heartPath = (c, x, y, s) => { c.beginPath(); c.moveTo(x, y+s*.9); c.bezierCurveTo(x-s*1.5, y-s*.1, x-s*.9, y-s*1.25, x, y-s*.45); c.bezierCurveTo(x+s*.9, y-s*1.25, x+s*1.5, y-s*.1, x, y+s*.9); c.closePath(); };
const starPath = (c, x, y, R, r=R*.48, n=5, rot=-Math.PI/2) => { c.beginPath(); for (let i=0;i<n*2;i++){ const a = rot + i*Math.PI/n, rr = i%2 ? r : R; c.lineTo(x+Math.cos(a)*rr, y+Math.sin(a)*rr); } c.closePath(); };
const heart = (d, x, y, s, col=C.red) => { d.shape(()=>heartPath(d.ctx, x, y, s), col, [x, y, s*1.2]); d.dot(x-s*.55, y-s*.45, s*.18, '#fff', .7); };
const star = (d, x, y, R, col=C.gold) => { d.shape(()=>starPath(d.ctx, x, y, R), col, [x, y, R]); d.dot(x-R*.25, y-R*.3, R*.14, '#fff', .75); };
const sparkle = (d, x, y, R, col='#fff6b0') => d.shape(()=>starPath(d.ctx, x, y, R, R*.28, 4, 0), col, [x, y, R]);
const coin = (d, x, y, r=15) => { d.circle(x, y, r, C.goldD); d.circle(x, y-1.2, r*.9, C.gold); d.circle(x, y-1.2, r*.62, '#ffe48f'); d.shape(()=>heartPath(d.ctx, x, y-r*.08, r*.3), C.goldD, [x, y, r*.3]); d.dot(x-r*.45, y-r*.5, r*.13, '#fff', .8); };
const fish = (d, x, y, s, body=C.sky, fin=C.skyD) => {
  d.tri([[x+s*.75, y], [x+s*1.35, y-s*.55], [x+s*1.35, y+s*.55]], fin);
  d.ell(x, y, s, s*.62, body); d.ell(x-s*.15, y+s*.22, s*.65, s*.25, mixLight(body)); d.dot(x-s*.48, y-s*.12, s*.13, C.ink); d.dot(x-s*.52, y-s*.17, s*.05, '#fff');
};
function mixLight(h){ const n = parseInt(h.slice(1),16), r = n>>16, g = n>>8&255, b = n&255, m = v => Math.round(v + (255-v)*.45); return '#'+((1<<24)|(m(r)<<16)|(m(g)<<8)|m(b)).toString(16).slice(1); }
const cloud = (d, x, y, s=1, col='#fffaff') => { d.circle(x-9*s, y+2*s, 8*s, col); d.circle(x+9*s, y+2*s, 8*s, col); d.circle(x, y-4*s, 11*s, col); d.rr(x-16*s, y, 32*s, 10*s, 5*s, col); };
const leaf = (d, x, y, s, rot, col=C.leaf) => d.shape(()=>{ const c = d.ctx; c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.ellipse(0, -s, s*.5, s, 0, 0, 7); c.restore(); }, col, [x, y-s, s]);
const tag = (d, x, y, w, h, col) => d.rr(x-w/2, y-h/2, w, h, Math.min(w,h)*.35, col);

export const UI = {
  // ── HUD ──
  coin: d => coin(d, 0, 2, 17),
  coins: d => { coin(d, -7, 6, 12); coin(d, 7, 2, 12); coin(d, 0, -6, 12); },
  pin: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.arc(0, -6, 13, Math.PI*.82, Math.PI*2.18); c.lineTo(0, 19); c.closePath(); }, C.red, [0, -2, 15]); d.circle(0, -6, 5.5, C.cream); },
  people: d => { d.circle(-8, -4, 7, '#ffd9c2'); d.rr(-17, 3, 18, 15, 8, C.pink); d.circle(8, -6, 7.5, '#ffe3cf'); d.rr(-1, 2, 19, 17, 8, C.blue); eyes(d, 8, -6, 2.6, 1.1); eyes(d, -8, -4, 2.4, 1); },
  heart: d => heart(d, 0, 2, 16),
  hp: d => heart(d, 0, 2, 16, C.red),

  // ── 도구 막대 ──
  can: d => {
    L(d, c=>{ c.moveTo(10, -6); c.lineTo(20, -16); }, C.skyD, 5); d.circle(20, -16, 3.5, C.skyD);
    d.rr(-15, -8, 26, 24, 7, C.sky); d.ell(-2, -8, 13, 3.5, '#c8ecff');
    L(d, c=>{ c.arc(-2, -10, 10, Math.PI*1.1, Math.PI*1.9); }, C.skyD, 3.2);
    d.dot(-9, -1, 2.2, '#fff', .7); d.ell(-21, 12, 2.4, 3.6, C.sky); d.ell(-17, 18, 2, 3, C.sky);
  },
  rod: d => {
    L(d, c=>{ c.moveTo(-16, 18); c.quadraticCurveTo(0, -8, 18, -18); }, C.brown, 3.6);
    L(d, c=>{ c.moveTo(18, -18); c.lineTo(14, 8); }, '#8aa0b8', 1);
    d.circle(-9, 9, 5.5, C.grey); d.dot(-9, 9, 2, '#8a7a86');
    d.circle(14, 11, 4, C.red); d.ell(14, 8.5, 4, 2, '#fff');
  },
  pick: d => {
    L(d, c=>{ c.moveTo(-14, 18); c.lineTo(10, -8); }, C.brown, 5);
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-6, -18); c.quadraticCurveTo(12, -20, 22, -2); c.quadraticCurveTo(14, -10, 6, -6); c.quadraticCurveTo(-2, -12, -6, -18); c.closePath(); }, C.stone, [8, -10, 14]);
    d.dot(4, -14, 1.6, '#fff', .7);
  },
  sword: d => {
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(19, -20); c.lineTo(17, -11); c.lineTo(0, 6); c.lineTo(-6, 0); c.lineTo(11, -17); c.closePath(); }, '#e6eef7', [7, -7, 14]);
    L(d, c=>{ c.moveTo(16, -17); c.lineTo(-2, 2); }, '#c4d2e2', 1.2);
    d.shape(()=>{ const c = d.ctx; c.save(); c.translate(-4, 3); c.rotate(Math.PI/4); c.beginPath(); c.roundRect(-9, -3, 18, 6, 3); c.restore(); }, C.gold, [-4, 3, 9]);
    L(d, c=>{ c.moveTo(-6, 6); c.lineTo(-14, 14); }, C.brownD, 4.5); d.circle(-15, 15, 3.4, C.gold);
    d.dot(10, -11, 1.4, '#fff', .9);
  },
  swords: d => { UI.sword(d); d.ctx.save(); d.ctx.scale(-1, 1); UI.sword(d); d.ctx.restore(); },
  bag: d => {
    L(d, c=>{ c.arc(0, -8, 9, Math.PI, 0); }, C.redD, 3.6);
    d.rr(-16, -8, 32, 28, 11, C.red); d.rr(-9, 4, 18, 12, 5, '#ff8aa0');
    d.rr(-17, -6, 34, 9, 5, '#ff8a9f'); d.dot(0, 0, 2.2, C.gold); d.stitch(c=>{ c.roundRect(-13, -4, 26, 21, 8); });
  },

  // ── 이모티콘 ──
  wave: d => {
    d.rr(-10, -6, 20, 22, 9, '#ffd9c2');
    for (const [x, h] of [[-8, 14], [-3, 18], [2, 18], [7, 15]]) d.rr(x-2.4, -6-h+6, 5, h, 2.5, '#ffd9c2');
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.ellipse(-12, 4, 4, 8, -.6, 0, 7); }, '#ffd9c2', [-12, 4, 8]);
    L(d, c=>{ c.arc(0, 0, 20, -Math.PI*.9, -Math.PI*.7); }, C.pinkD, 2); L(d, c=>{ c.arc(0, 0, 20, -Math.PI*.3, -Math.PI*.1); }, C.pinkD, 2);
  },
  love: d => heart(d, 0, 2, 16, C.red),
  sparkle: d => { sparkle(d, -4, 2, 15, '#ffe873'); sparkle(d, 13, -12, 6.5, '#fff6b0'); sparkle(d, 12, 13, 5, '#ffd0e4'); },
  sad: d => { d.circle(0, 0, 18, C.gold); eyes(d, 0, -2, 6, 1.8); L(d, c=>{ c.arc(0, 10, 5, Math.PI*1.15, Math.PI*1.85); }, C.ink, 1.8); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-6, 1); c.quadraticCurveTo(-10, 9, -6, 11); c.quadraticCurveTo(-2, 9, -6, 1); }, C.sky, [-6, 7, 4]); },
  smile: d => { d.circle(0, 0, 18, C.gold); L(d, c=>{ c.arc(-6, -2, 2.6, Math.PI*1.1, Math.PI*1.9); }, C.ink, 1.8); L(d, c=>{ c.arc(6, -2, 2.6, Math.PI*1.1, Math.PI*1.9); }, C.ink, 1.8); L(d, c=>{ c.arc(0, 4, 6, Math.PI*.15, Math.PI*.85); }, C.ink, 1.8); blush(d, 0, 4, 11); },

  // ── 건물 간판 ──
  cake: d => {
    d.rr(-17, -2, 34, 18, 6, C.cream); d.rr(-17, -6, 34, 9, 5, C.pink);
    for (const x of [-11, -3, 5, 13]) d.ell(x, 3, 3, 4, C.pink);
    d.circle(0, -11, 5.5, C.red); L(d, c=>{ c.moveTo(0, -16); c.quadraticCurveTo(3, -20, 6, -19); }, C.greenD, 1.5); d.dot(-1.6, -13, 1.2, '#fff', .8);
  },
  cupcake: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-13, 0); c.lineTo(13, 0); c.lineTo(9, 18); c.lineTo(-9, 18); c.closePath(); }, C.sky, [0, 9, 13]); d.circle(-7, -3, 8, C.pink); d.circle(7, -3, 8, C.pink); d.circle(0, -9, 9, '#ffb8d4'); d.circle(0, -18, 4, C.red); },
  shirt: d => {
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-7, -16); c.lineTo(-20, -9); c.lineTo(-15, 0); c.lineTo(-11, -2); c.lineTo(-11, 17); c.lineTo(11, 17); c.lineTo(11, -2); c.lineTo(15, 0); c.lineTo(20, -9); c.lineTo(7, -16); c.quadraticCurveTo(0, -10, -7, -16); c.closePath(); }, C.sky, [0, 0, 18]);
    d.stitch(c=>{ c.moveTo(-10, 12); c.lineTo(10, 12); }); heart(d, 0, 3, 4.5, C.pink);
  },
  dress: d => {
    L(d, c=>{ c.moveTo(-5, -19); c.lineTo(-6, -12); c.moveTo(5, -19); c.lineTo(6, -12); }, C.pinkD, 2);
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-8, -13); c.quadraticCurveTo(0, -9, 8, -13); c.lineTo(7, -3); c.lineTo(-7, -3); c.closePath(); }, C.pink, [0, -8, 8]);
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-7, -4); c.lineTo(7, -4); c.quadraticCurveTo(15, 6, 19, 15); c.quadraticCurveTo(14, 20, 9, 16); c.quadraticCurveTo(5, 21, 0, 17); c.quadraticCurveTo(-5, 21, -9, 16); c.quadraticCurveTo(-14, 20, -19, 15); c.quadraticCurveTo(-15, 6, -7, -4); c.closePath(); }, C.pink, [0, 7, 18]);
    d.rr(-8, -5.5, 16, 4, 2, C.pinkD); d.ell(-4, -3.5, 3.4, 2.4, '#fff3f8'); d.ell(4, -3.5, 3.4, 2.4, '#fff3f8'); d.dot(0, -3.5, 1.8, C.pinkD);
    for (const [x, y] of [[-8, 8], [0, 11], [8, 8], [-4, 2], [4, 2]]) d.dot(x, y, 1.5, '#fff', .85);
  },
  sunhat: d => { d.ell(0, 6, 21, 8, '#ffe7b0'); d.ell(0, -2, 11, 10, '#ffe7b0'); d.rr(-11, -1, 22, 5, 2.5, C.pink); d.circle(9, -1, 4, C.red); },
  cup: d => {
    L(d, c=>{ c.arc(13, 4, 6, -Math.PI/2, Math.PI/2); }, C.white, 3.4);
    d.rr(-14, -6, 26, 22, 8, '#fffaf6'); d.ell(-1, -6, 13, 3.6, C.choco); d.ell(-1, 17, 17, 3.5, '#f3e6ee');
    for (const x of [-6, 0, 6]) L(d, c=>{ c.moveTo(x, -10); c.bezierCurveTo(x-3, -14, x+3, -16, x, -20); }, '#e6d6de', 1.8);
    heart(d, -1, 4, 3.6, C.pink);
  },
  letter: d => {
    d.rr(-19, -12, 38, 26, 5, C.cream);
    L(d, c=>{ c.moveTo(-17, -10); c.lineTo(0, 3); c.lineTo(17, -10); }, '#e7cdb8', 2);
    heart(d, 0, 2, 5.5, C.red);
  },
  loveletter: d => { UI.letter(d); },
  museum: d => {
    d.tri([[-20, -6], [0, -19], [20, -6]], C.lilac); d.rr(-19, -7, 38, 4, 2, '#e8ddff');
    for (const x of [-14, -5, 4, 13]) d.rr(x-2, -3, 5, 15, 2, '#fffaff');
    d.rr(-20, 12, 40, 6, 3, C.lilac); d.dot(0, -11, 2, C.gold);
  },
  bouquet: d => {
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-10, 2); c.lineTo(10, 2); c.lineTo(3, 19); c.lineTo(-3, 19); c.closePath(); }, '#ffe7b0', [0, 10, 10]);
    leaf(d, -9, 2, 7, -.8); leaf(d, 9, 2, 7, .8);
    d.circle(-8, -6, 6.5, C.pink); d.circle(8, -6, 6.5, '#c9b5ff'); d.circle(0, -12, 7, C.red); d.circle(0, -3, 5.5, '#fff09a');
    d.dot(0, -12, 2, '#ffd0dc'); d.rr(-5, 6, 10, 4, 2, C.pinkD);
  },
  hammer: d => {
    L(d, c=>{ c.moveTo(-12, 18); c.lineTo(6, -2); }, C.brown, 5);
    d.shape(()=>{ const c = d.ctx; c.save(); c.translate(7, -5); c.rotate(.82); c.beginPath(); c.roundRect(-14, -7, 28, 14, 4); c.restore(); }, C.stone, [7, -5, 14]);
    d.dot(3, -12, 1.5, '#fff', .7);
  },
  house: d => { d.tri([[-20, -2], [0, -19], [20, -2]], C.pink); d.rr(-15, -3, 30, 21, 5, C.cream); d.rr(-4, 6, 8, 12, 3, C.brown); d.rr(7, 2, 6, 6, 2, C.sky); d.dot(2, 12, 1, C.gold); },
  store: d => { d.rr(-17, -4, 34, 22, 4, C.cream); for (let i=0;i<5;i++) d.rr(-19+i*7.6, -14, 7.6, 10, 3, i%2 ? '#fff' : C.pink); d.rr(-11, 4, 9, 14, 2, C.sky); d.rr(3, 4, 9, 7, 2, C.sky); },
  bank: d => { d.tri([[-20, -6], [0, -19], [20, -6]], C.gold); for (const x of [-13, -4, 5, 14]) d.rr(x-2.4, -5, 5, 17, 2, C.cream); d.rr(-20, 12, 40, 6, 3, C.goldD); d.circle(0, -10, 3.4, '#fff3c4'); },

  // ── 표시 ──
  scroll: d => { d.rr(-13, -14, 26, 28, 4, C.cream); d.circle(-13, -14, 4, '#e7cdb8'); d.circle(13, 14, 4, '#e7cdb8'); d.rr(-17, -18, 30, 7, 3.5, '#f3dcc6'); d.rr(-13, 11, 30, 7, 3.5, '#f3dcc6'); for (const y of [-5, 0, 5]) L(d, c=>{ c.moveTo(-7, y); c.lineTo(7, y); }, '#d8b9a0', 1.6); },
  check: d => { d.circle(0, 0, 18, C.green); L(d, c=>{ c.moveTo(-8, 0); c.lineTo(-2, 7); c.lineTo(9, -7); }, '#fff', 4.2); },
  news: d => { d.rr(-18, -14, 36, 28, 4, '#fffaf2'); d.rr(-14, -10, 12, 9, 2, C.sky); for (const y of [-9, -4]) L(d, c=>{ c.moveTo(1, y); c.lineTo(14, y); }, '#cbbfc8', 1.8); for (const y of [3, 8]) L(d, c=>{ c.moveTo(-14, y); c.lineTo(14, y); }, '#cbbfc8', 1.8); },
  close: d => { d.circle(0, 0, 16, C.grey); L(d, c=>{ c.moveTo(-6, -6); c.lineTo(6, 6); c.moveTo(6, -6); c.lineTo(-6, 6); }, '#fff', 3.6); },
  door: d => {
    d.rr(-15, -19, 30, 38, 6, C.cream); d.rr(-11, -15, 19, 32, 5, C.brown); d.dot(4, 2, 2, C.gold);
    d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(10, 2); c.lineTo(21, 2); c.lineTo(21, -3); c.lineTo(27, 4); c.lineTo(21, 11); c.lineTo(21, 6); c.lineTo(10, 6); c.closePath(); }, C.pinkD, [18, 4, 8]);
  },
  menu: d => { d.circle(0, 0, 19, '#fffaff'); for (const y of [-7, 0, 7]) d.rr(-9, y-2, 18, 4.4, 2.2, C.pinkD); },
  emo: d => UI.smile(d),

  // ── 날씨 ──
  sun: d => { for (let i=0;i<8;i++){ const a = i*Math.PI/4; d.ell(Math.cos(a)*16, Math.sin(a)*16, 3, 3, '#ffc94d'); } d.circle(0, 0, 11, '#ffd35c'); eyes(d, 0, -1, 4, 1.3); blush(d, 0, 3, 6.5); },
  cloud: d => { cloud(d, 0, 2, 1.05, '#f4f1ff'); },
  rain: d => { cloud(d, 0, -5, .95, '#e4e7f6'); for (const [x, y] of [[-9, 13], [0, 17], [9, 13]]) d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(x, y-6); c.quadraticCurveTo(x-4, y, x, y+3); c.quadraticCurveTo(x+4, y, x, y-6); }, C.sky, [x, y, 4]); },
  rainbow: d => { const cols = ['#ff8fa8', '#ffc56b', '#fff09a', '#9fe3a4', '#9fd0ff', '#c9b5ff']; cols.forEach((col, i) => L(d, c=>{ c.arc(0, 10, 19-i*3, Math.PI, 0); }, col, 3.2)); cloud(d, -15, 10, .45); cloud(d, 15, 10, .45); },
  star: d => star(d, 0, 1, 18),
  shootingStar: d => { L(d, c=>{ c.moveTo(-18, 16); c.lineTo(2, -2); }, '#ffe873', 3); L(d, c=>{ c.moveTo(-14, 19); c.lineTo(4, 3); }, '#ffd0e4', 2); star(d, 6, -6, 12); },
  bigStar: d => { star(d, 0, 2, 17, '#ffe24d'); sparkle(d, 15, -14, 5); sparkle(d, -16, 13, 4); },

  // ── 업적 ──
  fish: d => fish(d, -3, 0, 15),
  tropical: d => { fish(d, -3, 0, 15, '#ffb36b', '#ff8a4d'); for (const x of [-8, 0]) L(d, c=>{ c.moveTo(x, -8); c.lineTo(x, 8); }, '#fff', 2.4); },
  whale: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(14, 2); c.quadraticCurveTo(20, -10, 24, -12); c.quadraticCurveTo(22, -2, 22, 4); c.closePath(); }, C.blue, [19, -4, 7]); d.ell(-3, 3, 18, 12, C.blue); d.ell(-3, 9, 13, 5, '#d6e6ff'); d.dot(-12, 0, 1.8, C.ink); for (const x of [-6, -3, 0]) L(d, c=>{ c.moveTo(-3, -9); c.quadraticCurveTo(x, -16, x-2, -20); }, C.sky, 1.8); },
  ocean: d => { for (const [y, col] of [[-6, C.sky], [3, '#7fc4f0'], [12, C.skyD]]) d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-20, y+6); for (let x=-20; x<=20; x+=10) c.quadraticCurveTo(x+5, y-5, x+10, y+1); c.lineTo(20, y+10); c.lineTo(-20, y+10); c.closePath(); }, col, [0, y+3, 20]); d.dot(-10, -7, 2, '#fff', .9); },
  book: d => { d.rr(-15, -17, 30, 34, 4, C.sky); d.rr(-12, -17, 4, 34, 2, C.skyD); d.rr(-4, -9, 15, 9, 3, '#fff'); fish(d, 3, -4.5, 4, C.sky, C.skyD); },
  goggles: d => { d.rr(-19, -4, 38, 6, 3, C.skyD); d.circle(-8, 0, 9, '#ffd35c'); d.circle(8, 0, 9, '#ffd35c'); d.circle(-8, 0, 6, '#c8ecff'); d.circle(8, 0, 6, '#c8ecff'); d.dot(-10, -2, 1.6, '#fff'); d.dot(6, -2, 1.6, '#fff'); for (const [x, y, r] of [[13, -15, 3], [17, -9, 2]]) d.circle(x, y, r, '#e8f7ff'); },
  rock: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-18, 14); c.lineTo(-14, -4); c.lineTo(-4, -14); c.lineTo(10, -11); c.lineTo(18, 2); c.lineTo(15, 14); c.closePath(); }, C.stone, [0, 1, 18]); d.dot(-6, -5, 2, '#fff', .6); L(d, c=>{ c.moveTo(-2, -3); c.lineTo(5, 4); }, C.stoneD, 1.4); },
  gem: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-16, -6); c.lineTo(-8, -15); c.lineTo(8, -15); c.lineTo(16, -6); c.lineTo(0, 17); c.closePath(); }, C.gem, [0, 0, 17]); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-8, -6); c.lineTo(0, -15); c.lineTo(8, -6); c.closePath(); }, C.gemL, [0, -9, 8]); L(d, c=>{ c.moveTo(-16, -6); c.lineTo(16, -6); }, '#efe0ff', 1.2); },
  crown: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-17, 13); c.lineTo(-19, -9); c.lineTo(-9, 0); c.lineTo(0, -14); c.lineTo(9, 0); c.lineTo(19, -9); c.lineTo(17, 13); c.closePath(); }, C.gold, [0, 0, 18]); d.rr(-17, 9, 34, 6, 3, C.goldD); for (const [x, col] of [[-9, C.red], [0, C.gem], [9, C.sky]]) d.circle(x, 5, 2.6, col); for (const [x, y] of [[-19, -10], [0, -15], [19, -10]]) d.circle(x, y, 2.6, '#fff3c4'); },
  tiara: d => { UI.crown(d); d.circle(0, -2, 3.4, C.pink); },
  magnifier: d => { L(d, c=>{ c.moveTo(6, 6); c.lineTo(17, 17); }, C.brown, 5.5); d.circle(-4, -4, 13, C.grey); d.circle(-4, -4, 9.5, '#e8f7ff'); d.dot(-8, -8, 2.4, '#fff'); },
  ring: d => { L(d, c=>{ c.arc(0, 5, 12, 0, 7); }, C.gold, 4.6); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-7, -9); c.lineTo(0, -18); c.lineTo(7, -9); c.lineTo(0, -4); c.closePath(); }, '#d6f1ff', [0, -10, 8]); },
  statue: d => { d.rr(-12, -18, 24, 32, 10, C.stone); d.rr(-14, 12, 28, 7, 3, C.stoneD); d.rr(-9, -7, 18, 4, 2, C.stoneD); d.rr(-2, -4, 5, 9, 2, C.stoneD); L(d, c=>{ c.moveTo(-5, 9); c.lineTo(5, 9); }, C.stoneD, 1.6); },
  broom: d => { L(d, c=>{ c.moveTo(14, -18); c.lineTo(-2, 4); }, C.brown, 4); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-3, 0); c.lineTo(4, 6); c.lineTo(-8, 20); c.lineTo(-20, 12); c.closePath(); }, '#ffe7b0', [-6, 9, 12]); d.rr(-5, -1, 10, 5, 2, C.red); },
  shield: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(0, -18); c.quadraticCurveTo(10, -12, 17, -13); c.quadraticCurveTo(17, 8, 0, 19); c.quadraticCurveTo(-17, 8, -17, -13); c.quadraticCurveTo(-10, -12, 0, -18); c.closePath(); }, C.sky, [0, 0, 18]); heart(d, 0, 0, 6.5, C.pink); },
  eyes: d => { for (const x of [-9, 9]){ d.ell(x, 0, 8, 11, '#fff'); d.circle(x+1.4, 2, 4.6, C.ink); d.dot(x+3, 0, 1.4, '#fff'); } },
  gradcap: d => { d.rr(-10, -2, 20, 11, 5, C.ink); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(0, -16); c.lineTo(21, -6); c.lineTo(0, 4); c.lineTo(-21, -6); c.closePath(); }, '#6e4a5f', [0, -6, 21]); L(d, c=>{ c.moveTo(12, -4); c.lineTo(14, 12); }, C.gold, 1.6); d.circle(14, 13, 2.4, C.gold); },
  fire: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(0, 19); c.bezierCurveTo(-18, 17, -16, -2, -6, -8); c.quadraticCurveTo(-6, 0, -1, 2); c.quadraticCurveTo(-4, -12, 6, -19); c.quadraticCurveTo(5, -8, 12, -3); c.bezierCurveTo(19, 4, 14, 18, 0, 19); c.closePath(); }, C.orange, [0, 2, 18]); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(0, 17); c.bezierCurveTo(-9, 15, -8, 5, -2, 1); c.quadraticCurveTo(1, 6, 4, 5); c.bezierCurveTo(9, 9, 7, 16, 0, 17); c.closePath(); }, '#ffe873', [0, 9, 8]); },
  boom: d => { d.shape(()=>starPath(d.ctx, 0, 0, 20, 11, 8, 0), C.orange, [0, 0, 20]); d.shape(()=>starPath(d.ctx, 0, 0, 12, 7, 8, .3), '#ffe873', [0, 0, 12]); },
  bat: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(0, -2); c.quadraticCurveTo(-10, -14, -21, -6); c.quadraticCurveTo(-16, -2, -17, 5); c.quadraticCurveTo(-11, 1, -8, 6); c.quadraticCurveTo(-4, 2, 0, 6); c.quadraticCurveTo(4, 2, 8, 6); c.quadraticCurveTo(11, 1, 17, 5); c.quadraticCurveTo(16, -2, 21, -6); c.quadraticCurveTo(10, -14, 0, -2); c.closePath(); }, '#8f7aa8', [0, -2, 20]); d.circle(0, 0, 7, '#a993c2'); d.tri([[-5, -5], [-4, -12], [-1, -6]], '#a993c2'); d.tri([[5, -5], [4, -12], [1, -6]], '#a993c2'); eyes(d, 0, 0, 2.6, 1.2); },
  trophy: d => { L(d, c=>{ c.arc(-12, -6, 6, Math.PI*.5, Math.PI*1.5); }, C.goldD, 3); L(d, c=>{ c.arc(12, -6, 6, -Math.PI*.5, Math.PI*.5); }, C.goldD, 3); d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-12, -15); c.lineTo(12, -15); c.quadraticCurveTo(12, 6, 0, 7); c.quadraticCurveTo(-12, 6, -12, -15); c.closePath(); }, C.gold, [0, -5, 13]); d.rr(-3, 6, 6, 7, 2, C.goldD); d.rr(-10, 12, 20, 6, 3, C.brown); star(d, 0, -6, 5, '#fff3c4'); },
  sprout: d => { d.ell(0, 15, 14, 4, C.brown); L(d, c=>{ c.moveTo(0, 14); c.lineTo(0, -2); }, C.greenD, 3); leaf(d, -1, -2, 8, -1.1); leaf(d, 1, -2, 8, 1.1); },
  carrot: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-8, -8); c.quadraticCurveTo(0, -12, 8, -8); c.quadraticCurveTo(4, 8, 0, 20); c.quadraticCurveTo(-4, 8, -8, -8); c.closePath(); }, C.orange, [0, 3, 14]); leaf(d, -3, -9, 7, -.5); leaf(d, 3, -9, 7, .5); leaf(d, 0, -10, 8, 0, C.greenD); for (const y of [-1, 6]) L(d, c=>{ c.moveTo(-4, y); c.lineTo(0, y); }, '#e8833a', 1.4); },
  wheat: d => { for (const [x, r] of [[-8, -.25], [0, 0], [8, .25]]){ L(d, c=>{ c.moveTo(x*.4, 19); c.lineTo(x, -4); }, C.goldD, 2); for (let i=0;i<4;i++){ leaf(d, x-2.4+i*.3, -4-i*4.4, 3.4, -.6, C.gold); leaf(d, x+2.4+i*.3, -4-i*4.4, 3.4, .6, C.gold); } } },
  pan: d => { L(d, c=>{ c.moveTo(12, 4); c.lineTo(22, -8); }, C.brownD, 5); d.circle(0, 6, 14, '#7a6a7a'); d.circle(0, 5, 11, '#9a8a9a'); d.circle(-1, 4, 6.5, '#fff'); d.circle(-1, 4, 3, '#ffcf4d'); },
  birthdayCake: d => { d.rr(-17, 0, 34, 17, 6, C.cream); d.rr(-17, -3, 34, 8, 4, C.pink); for (const x of [-8, 0, 8]){ d.rr(x-1.6, -14, 3.2, 11, 1.5, x ? C.sky : '#fff09a'); d.ell(x, -17, 2, 3, C.orange); } d.stitch(c=>{ c.moveTo(-14, 11); c.lineTo(14, 11); }); },
  gift: d => { d.rr(-16, -4, 32, 22, 4, C.pink); d.rr(-18, -10, 36, 9, 4, '#ffb8d4'); d.rr(-3, -10, 6, 28, 2, C.gold); d.ell(-6, -14, 6, 4, C.gold); d.ell(6, -14, 6, 4, C.gold); d.circle(0, -12, 3, C.goldD); },
  box: d => { d.rr(-17, -10, 34, 26, 4, C.wood); d.rr(-19, -16, 38, 9, 3, '#ecc28f'); d.rr(-4, -16, 8, 32, 2, '#f4d9b4'); L(d, c=>{ c.moveTo(-13, 9); c.lineTo(-6, 9); }, C.brownD, 1.6); },
  party: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-17, 18); c.lineTo(-4, -8); c.lineTo(8, 6); c.closePath(); }, C.pink, [-4, 5, 13]); for (const [x, y, col] of [[4, -12, C.gold], [12, -5, C.sky], [14, -16, C.red], [-2, -18, C.mint], [18, 4, C.lilac]]) d.rr(x-2, y-3.5, 4, 7, 2, col); },
  money: d => { d.shape(()=>{ const c = d.ctx; c.save(); c.rotate(-.2); c.beginPath(); c.roundRect(-18, -10, 36, 20, 4); c.restore(); }, '#bfe8a8', [0, 0, 18]); d.circle(0, 0, 6, '#a3d98a'); L(d, c=>{ c.moveTo(0, -4); c.lineTo(0, 4); }, '#6aa85a', 2); sparkle(d, 15, -14, 5); sparkle(d, -16, 13, 4); },
  basket: d => { L(d, c=>{ c.arc(0, -2, 13, Math.PI, 0); }, C.brown, 3.2); d.rr(-18, -2, 36, 20, 8, C.wood); for (const y of [4, 10]) d.stitch(c=>{ c.moveTo(-15, y); c.lineTo(15, y); }, C.brownD, .7); d.circle(-7, -4, 5, C.red); d.circle(3, -5, 5, C.orange); d.circle(10, -3, 4, C.green); },
  shake: d => { d.rr(-21, -4, 18, 12, 6, '#ffd9c2'); d.rr(3, -4, 18, 12, 6, '#ffe3cf'); d.ell(0, 2, 10, 8, '#ffd9c2'); for (const x of [-4, 0, 4]) L(d, c=>{ c.moveTo(x, -3); c.lineTo(x, 6); }, '#eab79c', 1.2); heart(d, 0, -14, 5, C.pink); },
  shopping: d => { L(d, c=>{ c.arc(0, -6, 7, Math.PI, 0); }, C.pinkD, 2.6); d.rr(-14, -6, 28, 25, 5, C.pink); d.rr(-14, -6, 28, 6, 3, '#ffb8d4'); heart(d, 0, 7, 5, '#fff'); },
  chart: d => { d.rr(-18, -16, 36, 34, 5, '#fffaf2'); L(d, c=>{ c.moveTo(-12, 10); c.lineTo(-4, 2); c.lineTo(3, 6); c.lineTo(12, -8); }, C.green, 3.2); d.tri([[8, -10], [14, -11], [13, -5]], C.green); for (const x of [-12, -4, 3]) d.dot(x, x===-12 ? 10 : x===-4 ? 2 : 6, 2, C.greenD); },
  bull: d => { d.ell(0, 4, 15, 12, '#c98e5b'); d.ell(0, 10, 8, 5, '#f0c7a8'); for (const s of [-1, 1]){ d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(s*9, -5); c.quadraticCurveTo(s*20, -8, s*19, -18); c.quadraticCurveTo(s*14, -10, s*6, -9); c.closePath(); }, C.cream, [s*14, -10, 7]); } eyes(d, 0, 1, 5, 1.6); d.dot(-3, 10, 1.2, C.ink); d.dot(3, 10, 1.2, C.ink); },
  sofa: d => { d.rr(-19, -8, 38, 18, 8, C.pink); d.rr(-21, -2, 9, 18, 4, C.pinkD); d.rr(12, -2, 9, 18, 4, C.pinkD); d.rr(-12, 3, 24, 9, 4, '#ffb8d4'); d.rr(-17, 15, 4, 5, 2, C.brownD); d.rr(13, 15, 4, 5, 2, C.brownD); },
  chair: d => { d.rr(-11, -18, 22, 20, 5, C.wood); d.rr(-13, 0, 26, 7, 3, '#ecc28f'); for (const x of [-11, 8]) d.rr(x, 6, 3.5, 13, 1.5, C.brownD); heart(d, 0, -9, 4.5, C.pink); },
  key: d => { L(d, c=>{ c.moveTo(-2, 2); c.lineTo(17, 17); c.moveTo(11, 11); c.lineTo(7, 15); c.moveTo(15, 15); c.lineTo(11, 19); }, C.goldD, 3.6); d.circle(-8, -6, 10, C.gold); d.circle(-8, -6, 4, C.cream); heart(d, -8, -6, 2.8, C.pink); },
  hearts: d => { heart(d, -6, -3, 11, C.pink); heart(d, 8, 6, 9, C.red); },
  heartGlow: d => { heart(d, 0, 2, 15, '#ff7fae'); sparkle(d, 15, -13, 5); sparkle(d, -16, -11, 4); sparkle(d, 15, 13, 3.5); },
  dancer: d => { UI.dress(d); sparkle(d, 15, -13, 5); sparkle(d, -15, -8, 4); },
  calendar: d => { d.rr(-17, -14, 34, 32, 5, '#fffaf2'); d.rr(-17, -14, 34, 10, 5, C.red); for (const x of [-9, 9]) d.rr(x-1.6, -19, 3.2, 8, 1.6, C.stoneD); for (let r=0;r<3;r++) for (let k=0;k<4;k++) d.dot(-10.5+k*7, 1+r*6, 1.6, r===1&&k===2 ? C.pink : '#d9c9d2'); },
  map: d => { d.shape(()=>{ const c = d.ctx; c.beginPath(); c.moveTo(-19, -12); c.lineTo(-7, -16); c.lineTo(7, -12); c.lineTo(19, -16); c.lineTo(19, 14); c.lineTo(7, 18); c.lineTo(-7, 14); c.lineTo(-19, 18); c.closePath(); }, '#fff0d4', [0, 1, 19]); d.ell(-4, 1, 8, 6, C.green); d.ell(8, -5, 4, 3, C.green); L(d, c=>{ c.setLineDash([2.4, 2.4]); c.moveTo(-14, 10); c.quadraticCurveTo(0, 14, 9, 6); }, C.red, 1.6); d.ctx.setLineDash([]); L(d, c=>{ c.moveTo(7, 3); c.lineTo(11, 7); c.moveTo(11, 3); c.lineTo(7, 7); }, C.red, 2); },
  feet: d => { for (const [x, y, r] of [[-7, 6, -.2], [7, -6, .2]]){ d.shape(()=>{ const c = d.ctx; c.save(); c.translate(x, y); c.rotate(r); c.beginPath(); c.ellipse(0, 3, 5.5, 7.5, 0, 0, 7); c.restore(); }, '#ffd9c2', [x, y+3, 7]); for (let i=0;i<4;i++) d.circle(x-4.5+i*3+r*6, y-7+Math.abs(i-1.5)*1.2, 1.9, '#ffd9c2'); } },
};

// 업적 이모지 → 아이콘 이름 (achievements.js 의 icon 값을 그대로 두고 여기서 바꿔 그려요)
export const EMOJI_UI = {
  '🎣':'rod', '🐟':'fish', '🌊':'ocean', '🐋':'whale', '✨':'sparkle', '🌟':'bigStar', '📘':'book', '🤿':'goggles', '🐠':'tropical',
  '⛏️':'pick', '🪨':'rock', '💎':'gem', '👑':'crown', '🔍':'magnifier', '💍':'ring', '🗿':'statue',
  '🧹':'broom', '⚔️':'swords', '🛡️':'shield', '👀':'eyes', '🎓':'gradcap', '👸':'tiara', '🔥':'fire', '💥':'boom', '🦇':'bat', '🏆':'trophy',
  '🌱':'sprout', '🥕':'carrot', '🌾':'wheat', '🏡':'house', '🍳':'pan', '🧁':'cupcake', '🎂':'birthdayCake',
  '🪙':'coin', '💰':'coins', '💸':'money', '🏦':'bank', '🧺':'basket', '🤝':'shake', '🏪':'store', '🛍️':'shopping', '📈':'chart', '🐂':'bull',
  '👗':'dress', '👒':'sunhat', '💃':'dancer', '🛋️':'sofa', '🪑':'chair', '🔑':'key', '💞':'hearts', '💖':'heartGlow', '🎉':'party', '🎁':'gift',
  '💌':'loveletter', '📦':'box', '📅':'calendar', '🏛️':'museum', '🗺️':'map', '🌠':'shootingStar', '👣':'feet',
  // 이모티콘·간판·날씨
  '👋':'wave', '❤️':'love', '😢':'sad', '😊':'smile', '🍰':'cake', '👕':'shirt', '☕':'cup', '✉️':'letter', '💐':'bouquet', '🔨':'hammer',
  '☀️':'sun', '☁️':'cloud', '🌧️':'rain', '🌈':'rainbow', '📜':'scroll', '✅':'check', '📰':'news', '🗡️':'sword', '💧':'can', '🎒':'bag', '📍':'pin', '👥':'people',
};
