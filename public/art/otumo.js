// 오투모(관리자가 걸어 다닐 때의 모습): 하얀 동그란 헬멧 머리 + 검은 바이저 + 하늘색 눈 + 파란 머리띠 + 노란 귀·손 + 하얀 몸
// 오투모 인형(가구)과 같은 생김새를 캐릭터 크기(키 약 60px)로, 앞·뒤·옆 네 방향 + 걷기 흔들림까지. (x,y)는 발이 닿는 점.
const PI = Math.PI;
const flat = {flat: true, noShadow: true};
const W = '#fbfbfd', WS = '#e3e6ef', Y = '#ffb627', B = '#3f6fe0', NAVY = '#2b3a6a', VIS = '#2b2b36', EYE = '#9fe8ff';
// 게임 화면 붓(painter)은 모양 함수에 붓을 넘겨주지 않아서 d.ctx 를 직접 써요
const oval = (d, x, y, rx, ry, rot, col, o) => d.shape(() => { const c = d.ctx; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, PI * 2); }, col, [x, y, Math.max(rx, ry)], o);
// 노란 손: 동글동글한 손가락 세 개
function hand(d, x, y, s, sw){
  d.circle(x, y, 4.4, Y);
  for (const k of [-1, 0, 1]) d.circle(x + s * (3 + Math.abs(k)), y - 2 + k * 3 + sw, 1.8, Y);
}
export function drawOtumo(d, x, y, dir = 'down', t = 0, moving = false){
  const ph = t * 9, bob = moving ? -Math.abs(Math.sin(ph)) * 2.2 : Math.sin(t * 2) * .6, step = moving ? Math.sin(ph) : 0;
  { const c = d.ctx; c.save(); c.fillStyle = 'rgba(0,0,0,.14)'; c.beginPath(); c.ellipse(x, y + 1, 15, 4.5, 0, 0, PI * 2); c.fill(); c.restore(); } // 바닥 그림자 (반투명 색은 붓 대신 직접)
  if (dir === 'left' || dir === 'right'){
    const s = dir === 'right' ? 1 : -1;
    // 발: 앞뒤로 번갈아
    oval(d, x - s * 2 + step * 4, y - 3 - Math.max(0, -step) * 2, 6, 3.4, 0, '#e8e8f0');
    oval(d, x + s * 2 - step * 4, y - 3 - Math.max(0, step) * 2, 6, 3.4, 0, '#dcdce6');
    const by = y + bob;
    // 뒤쪽 귀 (살짝 보여요)
    oval(d, x - s * 6, by - 42, 4, 6.5, -s * .25, '#e9a21c');
    d.ell(x, by - 15, 10, 12, W);
    d.circle(x + s * 4, by - 14, 3.2, '#d6dbe6', flat);
    d.circle(x, by - 40, 18, W);
    d.line(c => c.arc(x, by - 40, 18.5, PI * 1.12, PI * 1.88), B, 4.4);
    // 옆 귀: 머리 가운데쯤, 노란 볼트
    oval(d, x - s * 2, by - 41, 5, 7, s * .1, Y);
    d.circle(x - s * 2, by - 41, 2, '#e9a21c', flat);
    // 바이저는 앞쪽으로 치우쳐요
    d.rr(s > 0 ? x + 2 : x - 18, by - 42, 16, 11, 5.5, VIS);
    d.ell(x + s * 11, by - 36.5, 1.6, 2.2, EYE, flat); d.dot(x + s * 11 + .5, by - 37.5, .5, '#ffffff');
    d.ell(x + s * 12, by - 27, 2, 1.2, '#ff9fb8', flat);
    // 손: 걸을 때 앞뒤로 흔들려요
    hand(d, x + s * 3 + step * 5 * s, by - 16, s, 0);
    d.dot(x - s * 7, by - 50, 2.6, '#ffffff', .8);
    return;
  }
  const back = dir === 'up';
  // 발
  for (const k of [-1, 1]) oval(d, x + k * 6, y - 3 - (moving ? Math.max(0, k * step) * 2.4 : 0), 5, 3.4, 0, '#e8e8f0');
  const by = y + bob;
  // 몸
  d.ell(x, by - 15, 11, 12, W);
  if (back){ d.rr(x - 5, by - 21, 10, 9, 3, WS, flat); for (const k of [-1, 1]) d.dot(x + k * 2.6, by - 16.5, .9, '#9aa3b4'); }
  else { d.circle(x, by - 14, 4.4, '#d6dbe6', flat); d.circle(x, by - 14, 2.2, '#9aa3b4', flat); }
  // 손 (걸을 때 위아래로 흔들려요)
  for (const k of [-1, 1]) hand(d, x + k * 13, by - 16 + (moving ? k * step * 1.6 : 0), k, 0);
  // 귀
  for (const k of [-1, 1]) oval(d, x + k * 18, by - 42, 5, 7, k * .2, Y);
  // 머리
  d.circle(x, by - 40, 18, W);
  d.line(c => c.arc(x, by - 40, 18.5, PI * 1.08, PI * 1.92), B, 4.4);
  if (back){
    d.rr(x - 5, by - 58.5, 10, 4, 2, NAVY, flat);
    d.line(c => c.arc(x, by - 18, 24, PI * 1.3, PI * 1.7), '#d3d7e2', 1.4); // 뒤통수 이음선
  } else {
    d.rr(x - 5, by - 58.5, 10, 4, 2, NAVY, flat);
    d.rr(x - 17, by - 42, 34, 11, 5.5, VIS);
    // 눈: 가끔 깜빡여요
    const blink = (t % 4) < .12;
    for (const k of [-1, 1]){ if (blink) d.rr(x + k * 5.5 - 1.8, by - 37, 3.6, 1, .5, EYE, flat); else { d.ell(x + k * 5.5, by - 36.5, 1.6, 2.2, EYE, flat); d.dot(x + k * 5.5 + .5, by - 37.5, .5, '#ffffff'); } }
    for (const k of [-1, 1]) d.ell(x + k * 10, by - 27, 2.2, 1.3, '#ff9fb8', flat);
  }
  d.dot(x - 8, by - 50, 3, '#ffffff', .8);
}
// 옷 입은 오투모: 캐릭터 몸 위에 오투모 머리(귀 · 헬멧 · 바이저)만 얹어요. cy = 머리 가운데, k = 크기
export function otumoHead(d, x, cy, side, back, k = .9){
  const r = 18*k, ex = 18*k;
  if (side){ oval(d, x - 2*k, cy - k, 5*k, 7*k, .1, Y); }
  else for (const s of [-1, 1]) oval(d, x + s*ex, cy - 2*k, 5*k, 7*k, s*.2, Y);
  d.circle(x, cy, r, W);
  d.line(c => c.arc(x, cy, r + .5, PI*1.08, PI*1.92), B, 4.4*k);
  d.rr(x - 5*k, cy - 18.5*k, 10*k, 4*k, 2*k, NAVY, flat);
  if (side){ d.circle(x - 2*k, cy - k, 2*k, '#e9a21c', flat); d.rr(x + 2*k, cy - 2*k, 16*k, 11*k, 5.5*k, VIS); d.ell(x + 11*k, cy + 3.5*k, 1.6*k, 2.2*k, EYE, flat); d.ell(x + 12*k, cy + 13*k, 2*k, 1.2*k, '#ff9fb8', flat); }
  else if (back) d.line(c => c.arc(x, cy + 22*k, 24*k, PI*1.3, PI*1.7), '#d3d7e2', 1.4);
  else { d.rr(x - 17*k, cy - 2*k, 34*k, 11*k, 5.5*k, VIS); for (const s of [-1, 1]){ d.ell(x + s*5.5*k, cy + 3.5*k, 1.6*k, 2.2*k, EYE, flat); d.dot(x + s*5.5*k + .5, cy + 2.5*k, .5, '#ffffff'); d.ell(x + s*10*k, cy + 13*k, 2.2*k, 1.3*k, '#ff9fb8', flat); } }
  d.dot(x - 8*k, cy - 10*k, 3*k, '#ffffff', .8);
}
// 오투모 체력: 1 천만 (관리자라 줄지 않아요)
export const OTUMO_HP = 10000000;
