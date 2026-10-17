// 다크 보스 공용 도구 (public/bosses/<주민>.js 가 가져다 써요) · 규칙은 docs/BOSS_ENGINE.md
// 난이도: 패턴 사이 쉬는 틈 · 기본 공격 간격 배수 (작을수록 어려워요)
export const HARD = { gap: .45, beat: .65 };
export const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, k) => a + (b - a)*k;
export const ease = k => { k = cl(k); return k < .5 ? 2*k*k : 1 - (-2*k + 2)**2/2; };
export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
// 바닥 타원 안 (rx · ry 반지름)
export const inEll = (px, py, x, y, rx, ry = rx*.6) => ((px - x)/rx)**2 + ((py - y)/ry)**2 < 1;

// 패턴 차례: 지금 단계(1 · 2 · 3)의 패턴을 순서대로 돌려요. 패턴 사이엔 gap 초 동안 기본 공격만.
// P = { 1:[{id, len}...], 2:[...], 3:[...] } · 2 단계 처음 trans 초는 변신 연출 ({id:'trans'})
// 돌려주는 값: {id, t: 패턴 안 시간(초), len, n: 몇 번째 차례, k: t/len, seed}
export function pick(B, P, opt = {}){
  const gap = (opt.gap ?? 2.5)*HARD.gap, trans = opt.trans ?? 5;
  if (B.phase === 2 && B.ph2 < trans) return {id:'trans', t:B.ph2, len:trans, n:0, k:B.ph2/trans, seed:'trans'};
  const list = P[B.phase] || [], t0 = B.phase === 2 ? B.pt - trans : B.pt; if (!list.length || t0 < 0) return {id:null, t:0, len:0, n:0, k:0, seed:''};
  const total = list.reduce((a, p) => a + p.len + gap, 0), n = Math.floor(t0/total); let tt = t0 - n*total, i = 0;
  for (const p of list){ if (tt < p.len) return {id:p.id, t:tt, len:p.len, n:n*list.length + i, k:tt/p.len, seed:`${B.r.bossAt}.${B.phase}.${n}.${i}`}; tt -= p.len; if (tt < gap) return {id:null, t:tt, len:gap, n:n*list.length + i, k:tt/gap, seed:''}; tt -= gap; i++; }
  return {id:null, t:0, len:0, n:0, k:0, seed:''};
}
// 기본 공격 박자: every 초마다 한 번 (50% · 20% 아래로 갈수록 자주). 같은 박자 번호를 돌려줘요 (모두 같은 값)
export function beat(B, every){ const f = B.phase === 3 ? .55 : B.phase === 2 ? .75 : 1, len = every*f*HARD.beat, n = Math.floor(B.t/len); return {n, t:B.t - n*len, len}; }

// 예고 표시 (깜빡이는 테두리 + 차오르는 안쪽). k: 0 → 1 (1 이면 곧 터짐)
export function warnCircle(c, x, y, rx, ry, k, col = '255,45,85'){
  c.save(); c.globalAlpha = .18 + .3*cl(k); c.fillStyle = `rgb(${col})`; c.beginPath(); c.ellipse(x, y, rx*cl(k), ry*cl(k), 0, 0, 7); c.fill();
  c.globalAlpha = .55 + .4*Math.abs(Math.sin(k*14)); c.strokeStyle = `rgb(${col})`; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.stroke(); c.restore(); }
export function warnRect(c, x, y, w, h, k, col = '255,45,85'){
  c.save(); c.globalAlpha = .15 + .3*cl(k); c.fillStyle = `rgb(${col})`; c.fillRect(x, y, w, h); c.globalAlpha = .55 + .4*Math.abs(Math.sin(k*14)); c.strokeStyle = `rgb(${col})`; c.lineWidth = 3; c.strokeRect(x, y, w, h); c.restore(); }
export function warnLine(c, x0, y0, x1, y1, k, w = 6, col = '255,45,85'){
  c.save(); c.globalAlpha = .35 + .5*Math.abs(Math.sin(k*14)); c.strokeStyle = `rgb(${col})`; c.lineWidth = w; c.setLineDash([10, 8]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); }
// 부채꼴 (a0 → a1 라디안, 바닥이라 세로를 .6 으로 눌러요)
export function sector(c, x, y, r, a0, a1, fill, sq = .6){ c.save(); c.translate(x, y); c.scale(1, sq); c.fillStyle = fill; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, a0, a1); c.closePath(); c.fill(); c.restore(); }
export const inSector = (px, py, x, y, r, a0, a1, sq = .6) => { const dx = px - x, dy = (py - y)/sq; if (Math.hypot(dx, dy) > r) return false; let a = Math.atan2(dy, dx); const T = Math.PI*2; a = ((a - a0)%T + T)%T; return a <= ((a1 - a0)%T + T)%T; };
// 바닥 위 그림자 · 반짝임
export function shadow(c, x, y, rx, ry = rx*.35, a = .35){ c.save(); c.fillStyle = `rgba(0,0,0,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); c.restore(); }
// 화면 전체 색 덮기 (drawScreen 에서)
export function tint(c, w, h, col, a){ if (a <= 0) return; c.save(); c.globalAlpha = cl(a); c.fillStyle = col; c.fillRect(0, 0, w, h); c.restore(); }
// 어둠: 화면을 덮고 (sx, sy) 둘레 r 만 보이게
export function darkness(c, w, h, a, holes = []){ c.save(); c.fillStyle = `rgba(4,2,8,${cl(a)})`; c.beginPath(); c.rect(0, 0, w, h); for (const [x, y, r] of holes){ c.moveTo(x + r, y); c.arc(x, y, r, 0, 7, true); } c.fill('evenodd'); c.restore(); }
// 글자 (Dongle)
export function text(c, s, x, y, size = 22, col = '#fff', align = 'center', stroke = 'rgba(20,6,12,.85)'){ c.save(); c.font = `bold ${size}px "Dongle",sans-serif`; c.textAlign = align; c.textBaseline = 'middle'; if (stroke){ c.lineWidth = 4; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = col; c.fillText(s, x, y); c.restore(); }
