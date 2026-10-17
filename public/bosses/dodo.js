// 도도??? (도진규 · 3 번 갱도 사건) 다크 보스 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md "보스 패턴 규칙"
// 기본 공격: 곡괭이 부메랑 (사람 쪽으로 휘어 날아갔다가 돌아와요 · 두 번 지나가요)
// 1 단계 ① 두더지 굴 ② 광차 선로 ③ 발파 → 50% 갱도 붕괴 → 2 단계 ④ 갱도 지도 ⑤ 금 간 바닥 ⑥ 쿵쿵쿵 → 20% ⑦ 출구로
import { pick, beat, inEll, cl, lerp, ease, dist, text, shadow } from './kit.js';
import { S, FOOT, LAMP, bossArt, rock, fxH, cartSpr, pickSpr, bigRock, wallSpr, blit, nuggetSpr } from './dodo_art.js';

const PAT = { 1:[{id:'mole', len:12.6}, {id:'rail', len:12.5}, {id:'blast', len:11}], 2:[{id:'map', len:12}, {id:'crack', len:12}, {id:'knock', len:14.8}], 3:[{id:'esc', len:999}] };
const GAP = 2.5, TRANS = 5;
const AMP = { mole:0, rail:.25, blast:.4, trans:0, map:.3, crack:.7, knock:.5, esc:0 }; // 패턴마다 돌아다니는 세기
const LINES = { mole:'땅속은 조용해야 해.', rail:'광차는 멈추지 않아.', blast:'입구는… 막아야 했어.', map:'지도대로야. 다 무너져.', knock:'바람 소리야. 그냥 바람 소리.', esc:'내 몫은 내가 챙겨!' };
const LAMP_Y = (FOOT + LAMP)*S; // 발에서 헬멧 불빛까지

// ① 두더지 굴
const HOLES = [[330, 545], [770, 545], [400, 745], [700, 745]], POP_RX = 75, POP_RY = 45;
const MOLE_I = .6, MOLE_C = 3.7, MOLE_BUMP = 2.0, MOLE_UP = 3.4;
// ② 광차 선로
const RY = 700, LEV = { L:[392, 628], R:[708, 628] }, FORKX = { L:380, R:720 }, CV = 320;
// ③ 발파
const ROCKS3 = [[310, 640], [560, 770], [800, 640]];
// ④ 갱도 지도
const COLS = [0, 367, 733, 1100], ROWS = [330, 615, 900], MAPR = [[.8, 2.8], [4.4, 6.4], [8.0, 10.0]], PIT = 1.6;
// ⑥ 쿵쿵쿵
const WALL = [860, 455], RHY = [[0, .5, 1.0], [0, .45, .9, 1.6], [0, .9, 1.35], [0, .5, 1.4, 1.9], [0, .6, 1.0, 1.45]], KN0 = 1.0, KNC = 4.2;
// ⑦ 출구로
const EXITS = [[165, 530], [935, 530]], EV = 92;

let lastB = null; // 레버를 누르러 걸어간 뒤에 쓸 가장 새 B
const sm = {}; // 이 화면만의 기억 (말한 줄 · 부메랑 겨눔 · 호스트 기록 …)
const later = (k, ms, now) => { if (sm['tx' + k] && now - sm['tx' + k] < ms) return false; sm['tx' + k] = now; return true; };
const once = k => { if (sm['o' + k]) return false; sm['o' + k] = 1; return true; };
function prune(){ const ks = Object.keys(sm); if (ks.length < 500) return; for (const x of ks.slice(0, 250)) if (!/^(still|dyn|heal|esc|tx)/.test(x)) delete sm[x]; } // 오래된 기억 정리

// 시간을 dt 초 뒤로 (음수면 앞으로) 돌린 B
function shiftB(B, dt){ const o = Object.create(B); o.now = B.now - dt*1000; o.t = B.t - dt; o.pt = B.pt - dt; o.ph2 = B.ph2 >= 0 ? B.ph2 - dt : -1; o.ph3 = B.ph3 >= 0 ? B.ph3 - dt : -1; o._p = o._i = undefined; return o; }
const pk = B => B._p || (B._p = pick(B, PAT, {gap:GAP, trans:TRANS}));
const wander = t => [Math.cos(t*.42)*125 + Math.sin(t*1.07)*30, Math.sin(t*.61)*44 + Math.sin(t*1.3)*10];
const stunned = B => (B.bs.stun || 0) > B.now;
const half = B => B.phase >= 3 || (B.phase === 2 && B.ph2 >= 1.9);

// ===== 보스 자리 · 보이는 정도 =====
function rawInfo(B){
  const p = pk(B), w = wander(B.t); let a = 1;
  if (p.id && AMP[p.id] != null) a = lerp(1, AMP[p.id], Math.min(cl(p.t/.6), cl((p.len - p.t)/.6)));
  let x = B.hx + w[0]*a, y = B.hy + w[1]*a, vis = 1, ug = 0;
  if (p.id === 'mole'){ const m = moleAt(B, p, x, y); x = m.x; y = m.y; vis = m.vis; ug = m.ug; }
  else if (p.id === 'esc' && (p.t >= .8 || (B.bs.esc && B.bs.esc.k === p.seed))){ const e = escFoot(B, p); x = e.x; y = e.y; }
  return { x, y, vis, ug, p };
}
function info(B){
  if (B._i) return B._i; let i = rawInfo(B);
  const st0 = B.bs.st0, st1 = B.bs.stun; // 기절하면 그 자리에 멈춰요 (끝나면 0.6 초 동안 제자리로)
  if (st0 && st1 && B.now >= st0 && B.now < st1 + 600 && i.p.id !== 'esc'){ const f = rawInfo(shiftB(B, (B.now - st0)/1000)), k = ease((B.now - st1)/600); i = {...i, x:lerp(f.x, i.x, k), y:lerp(f.y, i.y, k)}; }
  return (B._i = i);
}
function moleOrder(B, p){ const k = 'mo' + p.seed; if (sm[k]) return sm[k]; const r = B.rng(p.seed + 'm'), o = [0, 1, 2, 3]; for (let i = 3; i > 0; i--){ const j = Math.floor(r()*(i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return (sm[k] = o.slice(0, 3)); }
function moleAt(B, p, x, y){
  const t = p.t, H = moleOrder(B, p);
  if (t < MOLE_I) return { x, y, vis:1 - t/MOLE_I, ug:0 };
  const i = Math.floor((t - MOLE_I)/MOLE_C);
  if (i >= 3){ const s = MOLE_I + 3*MOLE_C, [hx, hy] = HOLES[H[2]], k = ease((t - s)/.6); return { x:lerp(hx, x, k), y:lerp(hy, y, k), vis:cl((t - s - .6)/.3), ug:t < s + .6 ? 1 : 0 }; }
  const s = MOLE_I + i*MOLE_C, k = t - s, [hx, hy] = HOLES[H[i]], [px, py] = i ? HOLES[H[i - 1]] : [B.hx, B.hy];
  if (k < 1.0){ const u = ease(k); return { x:lerp(px, hx, u), y:lerp(py, hy, u), vis:0, ug:1 }; }
  if (k < MOLE_BUMP) return { x:hx, y:hy, vis:0, ug:0 };
  if (k < MOLE_UP) return { x:hx, y:hy, vis:cl((k - MOLE_BUMP)/.25), ug:0 };
  return { x:hx, y:hy, vis:1 - cl((k - MOLE_UP)/.3), ug:0 };
}
// ⑦ 출구 달리기 상태 (호스트가 정해서 bs.esc 에 적어요 · 없으면 처음 상태)
function escState(B, p){ const e = B.bs.esc; if (e && e.k === p.seed) return e; return { k:p.seed, x0:B.hx, y0:B.hy, side:B.rng(p.seed + 'e')() < .5 ? -1 : 1, p:0, at:B.now - (p.t - .8)*1000, run:1, seg:0 }; }
function escFoot(B, p){ const e = escState(B, p), [ex, ey] = EXITS[e.side < 0 ? 0 : 1], L = Math.max(1, dist(e.x0, e.y0, ex, ey)), prog = e.p + (e.run ? Math.max(0, (B.now - e.at)/1000)*EV : 0), u = Math.min(1, prog/L);
  return { x:lerp(e.x0, ex, u), y:lerp(e.y0, ey, u), u, prog, L, e, dx:(ex - e.x0)/L, dy:(ey - e.y0)/L, ex, ey }; }

// ===== 기본 공격: 곡괭이 부메랑 =====
const BEAT = 3.2;
function throws(B, n, t0){
  const key = `pk${B.r.bossAt}.${n}`; if (sm[key] !== undefined) return sm[key];
  const B0 = shiftB(B, B.t - t0), i0 = info(B0), p0 = i0.p;
  let out = null;
  if (i0.vis >= 1 && p0.id !== 'trans' && !stunned(B0) && B.alive.length && t0 > 1.5){
    const al = B.alive, r = B.rng(key), n2 = B.phase >= 2 && al.length >= 3 ? 2 : 1, j0 = (n + Math.floor(r()*al.length)) % al.length; out = [];
    for (let q = 0; q < n2; q++){ const tg = al[(j0 + q) % al.length], o = [i0.x - 58, i0.y - 72], dx = tg.x - o[0], dy = tg.y - 20 - o[1], d = Math.hypot(dx, dy) || 1, side = (r() < .5 ? 1 : -1)*(q ? -1 : 1);
      out.push({ o, p:[tg.x + dx/d*70, tg.y - 20 + dy/d*70], nm:[-dy/d*side, dx/d*side], key:`${key}.${q}` }); } }
  const ks = Object.keys(sm).filter(k => k.startsWith('pk')); if (ks.length > 12) delete sm[ks[0]];
  return (sm[key] = out);
}
const boomAt = (b, u) => { const out = u < .5, v = out ? u*2 : (u - .5)*2, A0 = out ? b.o : b.p, A1 = out ? b.p : b.o, bend = (out ? 1 : -1)*90*Math.sin(v*Math.PI); return [lerp(A0[0], A1[0], v) + b.nm[0]*bend, lerp(A0[1], A1[1], v) + b.nm[1]*bend]; };
function boomers(B){ const bt = beat(B, BEAT), out = []; for (const n of [bt.n, bt.n - 1]){ if (n < 0) continue; const t0 = n*bt.len, k = B.t - t0; if (k < 0 || k > 2.05) continue; const th = throws(B, n, t0); if (th) for (const b of th) out.push({...b, k}); } return out; }

// ===== ② 광차 =====
function carts(B, p){ const k = 'ca' + p.seed; if (sm[k]) return sm[k]; const r = B.rng(p.seed + 'c');
  return (sm[k] = [0, 1, 2].map(i => { const L = r() < .5, xs = L ? -40 : 1140, xf = FORKX[L ? 'L' : 'R']; return { i, L, t0:1.0 + i*3.6, xs, dir:L ? 1 : -1, xf, tf:Math.abs(xf - xs)/CV }; })); }
const switched = (B, p, c) => !!(B.bs.rl && B.bs.rl.k === p.seed && (B.bs.rl.on || []).includes(c.i));
function cartAt(B, p, c){ const k = p.t - c.t0; if (k < 0) return null;
  if (k < c.tf) return { x:c.xs + c.dir*k*CV, y:RY, a:0 };
  if (switched(B, p, c)){ const u = (k - c.tf)/.8; if (u > 1) return null; const i = info(B), ex = i.x - c.dir*62, ey = i.y + 4, cx = c.xf + c.dir*120, q = 1 - u;
    return { x:q*q*c.xf + 2*u*q*cx + u*u*ex, y:q*q*RY + 2*u*q*RY + u*u*ey, a:u, br:1 }; }
  const x = c.xf + c.dir*(k - c.tf)*CV*1.2; if (x < -80 || x > 1180) return null; return { x, y:RY, a:0 }; }
function leverCart(B, p, side){ for (const c of carts(B, p)) if ((side === 'L') === c.L && p.t < c.t0 + c.tf - .05) return c; return null; }
function pullLever(B, side){ const p = pk(B); if (p.id !== 'rail') return; const c = leverCart(B, p, side); if (!c || switched(B, p, c)) return;
  B.sfx('hit', 100); B.fx('철컥', LEV[side][0], LEV[side][1] - 50, '#c8ffb0');
  B.tx(bs => { const on = bs.rl && bs.rl.k === p.seed ? bs.rl.on || [] : []; if (on.includes(c.i)) return undefined; return {...bs, rl:{k:p.seed, on:[...on, c.i]}}; }); }

// ===== ③ 발파 =====
function blasts(B, p){ const k = 'bl' + p.seed; if (sm[k]) return sm[k]; const r = B.rng(p.seed + 'b'), a = r() < .5; return (sm[k] = [{ L:a, lit:1.0, boom:3.8, j:0 }, { L:r() < .6 ? !a : a, lit:6.0, boom:8.8, j:1 }]); }
const inShadow = (x, y, L) => ROCKS3.some(([rx, ry]) => Math.abs(y - ry) < 42 && (L ? x > rx + 28 && x < rx + 200 : x < rx - 28 && x > rx - 200));
const frontX = (bl, t) => { const u = (t - bl.boom)/.6; return bl.L ? lerp(40, 1060, u) : lerp(1060, 40, u); };

// ===== ④ 갱도 지도 =====
function mapCells(B, p){ const k = 'mc' + p.seed; if (sm[k]) return sm[k]; const r = B.rng(p.seed + 'g');
  return (sm[k] = MAPR.map(() => { const a = Math.floor(r()*6); let b = Math.floor(r()*5); if (b >= a) b++; return [a, b]; })); }
const cellOf = (x, y) => { if (y < ROWS[0]) return -1; const c = x < COLS[1] ? 0 : x < COLS[2] ? 1 : 2, r = y < ROWS[1] ? 0 : 1; return r*3 + c; };
const cellRect = i => { const c = i % 3, r = Math.floor(i/3); return [COLS[c], ROWS[r], COLS[c + 1] - COLS[c], ROWS[r + 1] - ROWS[r]]; };

// ===== ⑤ 금 간 바닥 =====
const crackHoles = (B, p) => B.bs.ch && B.bs.ch.k === p.seed ? B.bs.ch.h || [] : [];

// ===== ⑥ 쿵쿵쿵 =====
function knockRounds(B, p){ const k = 'kr' + p.seed; if (sm[k]) return sm[k]; const r = B.rng(p.seed + 'k'), used = [];
  return (sm[k] = [0, 1, 2].map(j => { let q; do q = Math.floor(r()*RHY.length); while (used.includes(q)); used.push(q); const b = RHY[q], t = KN0 + j*KNC, last = b[b.length - 1]; return { j, b, t, a0:t + last + .9, a1:t + last + 3.0, judge:t + last + 3.4 }; })); }
const kneed = B => B.alive.length >= 4 ? 2 : 1;
const kAns = (B, p, j) => B.bs.kn && B.bs.kn.k === p.seed ? (B.bs.kn.a || []).filter(a => a[0] === j).length : 0;
const kDone = (B, p) => [0, 1, 2].filter(j => kAns(B, p, j) >= kneed(B)).length;
const kOpen = (B, p) => B.bs.ko === p.seed;

// ===== 움직일 때 연출: 땅 밑으로 흙이 불룩 지나가요 · 천장에서 흙먼지 =====
function moveK(B){ const a = info(B), b = info(shiftB(B, .05)); if (Math.abs(a.vis - b.vis) > .01 && !a.ug) return [0, 0, 0]; const v = dist(a.x, a.y, b.x, b.y)/.05; if (v > 900) return [0, 0, 0]; const d = dist(a.x, a.y, b.x, b.y) || 1; return [cl((v - 6)/90), (a.x - b.x)/d, (a.y - b.y)/d]; }
const mkC = new Map(); // 지난 시각의 움직임은 바뀌지 않으니 기억해 둬요
function moveAt(B, a){ const key = `${B.r.bossAt}|${Math.round((B.t - a)*100)}`; let v = mkC.get(key); if (!v){ const Bb = shiftB(B, a), i = info(Bb); v = [...moveK(Bb), i.x, i.y]; mkC.set(key, v); if (mkC.size > 160) mkC.delete(mkC.keys().next().value); } return v; }
function crackSeg(c, x, y, rx, ry, seed){ const N = 18; c.beginPath(); for (let i = 0; i < N; i++){ if (fxH(seed + i*1.7) < .3) continue; const a0 = i/N*6.283, a1 = (i + 1)/N*6.283, j0 = .84 + fxH(seed + i)*.32, j1 = .84 + fxH(seed + (i + 1) % N)*.32; c.moveTo(x + Math.cos(a0)*rx*j0, y + Math.sin(a0)*ry*j0); c.lineTo(x + Math.cos(a1)*rx*j1, y + Math.sin(a1)*ry*j1); } c.stroke(); }
function drawTrailFloor(B, c){
  const [k, ux, uy] = moveK(B); if (k < .03) return; const i = info(B), fx = i.x, fy = i.y, t = B.t; c.save();
  for (let j = 1; j <= 6; j++){ const Bj = shiftB(B, j*.12), kj = moveK(Bj)[0]; if (kj < .03) continue; const ij = info(Bj); c.globalAlpha = kj*(1 - j/7)*.5; c.fillStyle = 'rgba(34,22,12,.9)'; c.beginPath(); c.ellipse(ij.x, ij.y + 3, 62 - j*4, 16 - j, 0, 0, 7); c.fill(); }
  const wob = Math.sin(t*23)*.05*k; c.globalAlpha = cl(k*1.3);
  c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(fx, fy + 6, 100*(1 + wob), 26, 0, 0, 7); c.fill();
  c.fillStyle = 'rgba(110,80,50,.55)'; c.beginPath(); c.ellipse(fx, fy - 4*k, 92*(1 + wob), 22 + 6*k, 0, 0, 7); c.fill();
  c.strokeStyle = 'rgba(20,12,6,.85)'; c.lineWidth = 2; c.beginPath();
  for (let n = 0; n < 9; n++){ const a = n/9*6.283 + .2, L = (50 + fxH(n*3.1)*50)*k + 30; let px = fx + Math.cos(a)*40, py = fy + Math.sin(a)*11; c.moveTo(px, py); for (let s = 1; s <= 3; s++){ const r = 40 + L*s/3, aa = a + (fxH(n*5 + s) - .5)*.35; px = fx + Math.cos(aa)*r; py = fy + Math.sin(aa)*r*.3; c.lineTo(px, py); } } c.stroke();
  for (let j = 0; j < 2; j++){ const ph = (t*1.25 + j*.5) % 1, cyc = Math.floor(t*1.25 + j*.5), d = 60 + ph*130, cx = fx + ux*d, cy = fy + uy*d*.5 + 6, env = Math.sin(ph*Math.PI)*k, rx = 36*(.7 + k*.6), ry = rx*.38, h = 10*env;
    c.globalAlpha = env; c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(cx + 5, cy + 4, rx*1.2, ry*1.2, 0, 0, 7); c.fill();
    c.fillStyle = 'rgba(140,104,66,.95)'; c.beginPath(); c.ellipse(cx, cy - h*.5, rx, ry + h*.6, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(190,150,104,.6)'; c.beginPath(); c.ellipse(cx - rx*.2, cy - h*.8, rx*.5, (ry + h*.6)*.45, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(24,14,6,.9)'; c.lineWidth = 2; crackSeg(c, cx, cy - h*.5, rx*.7, (ry + h*.6)*.7, cyc*31 + j*7);
    for (let r = 0; r < 2; r++){ const q = (ph*1.6 + r*.5) % 1; c.globalAlpha = env*(1 - q)*.9; c.strokeStyle = 'rgba(30,18,8,.95)'; crackSeg(c, cx, cy, rx*(1.1 + q*1.8), ry*(1.1 + q*1.8), cyc*13 + r*5 + j); } }
  c.restore(); }
function drawTrailTop(B, c){
  const t = B.t; c.save();
  { const Sx = .07, n0 = Math.floor(t/Sx); for (let j = 0; j < 8; j++){ const n = n0 - j, tb = n*Sx, a = t - tb; if (a < 0 || a > .55) continue; const [k, ux, uy, bx, by] = moveAt(B, a); if (k < .1) continue; const ib = {x:bx, y:by};
    for (let q = 0; q < 2; q++){ const s = n*7.13 + q*3.31; if (fxH(s) > k) continue; const side = fxH(s + 1)*2 - 1, x0 = ib.x + ux*(40 + fxH(s + 2)*70) + side*56, y0 = ib.y + uy*24 + (fxH(s + 3) - .5)*20, vy = -(150 + fxH(s + 4)*180)*(.6 + k*.5), y = y0 + vy*a + 850*a*a;
      if (y > y0 + 6) continue; c.globalAlpha = 1 - a/.6; rock(c, x0 + (side*70 + ux*60)*a, y, 3 + fxH(s + 5)*4*(.6 + k*.6), s*7, a*9); } } }
  { const Sx = .1, n0 = Math.floor(t/Sx); for (let j = 0; j < 10; j++){ const n = n0 - j, tb = n*Sx, a = t - tb; if (a < 0) continue; const [k, ux, , bx, by] = moveAt(B, a); if (k < .08) continue; const ib = {x:bx, y:by}, s = n*5.31 + 3;
    if (fxH(s) > k*.85) continue; const x = ib.x + ux*60 + (fxH(s + 1) - .5)*220, yL = ib.y - 30 + fxH(s + 2)*70, top = ib.y - 360, dust = fxH(s + 3) < .35, acc = dust ? 900 : 1500, fT = Math.sqrt(2*(yL - top)/acc);
    if (a < fT){ const y = top + .5*acc*a*a; c.globalAlpha = .6; c.strokeStyle = 'rgba(176,156,126,.35)'; c.lineWidth = dust ? 5 : 2; c.beginPath(); c.moveTo(x, Math.max(top, y - 26 - a*70)); c.lineTo(x, y); c.stroke(); c.globalAlpha = 1; if (!dust) rock(c, x, y, 3 + fxH(s + 4)*4, s, a*4); else { c.fillStyle = 'rgba(150,132,106,.45)'; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); } }
    else if (a < fT + .4){ const q = (a - fT)/.4; c.globalAlpha = (1 - q)*.6; c.fillStyle = 'rgba(160,138,108,.7)'; c.beginPath(); c.ellipse(x, yL - q*10, 6 + q*24, 2 + q*8, 0, 0, 7); c.fill(); } } }
  c.restore(); }

// ===== 50% 변신: 갱도 붕괴 → 어둠이 조여 들어 헬멧 불빛만 → 붉게 =====
let CAVE = null;
function caveRocks(B){ if (CAVE) return CAVE; const P = []; let id = 0, W = B.W, H = B.H;
  for (const side of [-1, 1]) for (let r = 0; r < 5; r++){ const w = 240 - r*44, n = Math.max(1, Math.floor(w/28)); for (let i = 0; i < n; i++){ const s = 500 + (id++)*13.7, xo = 10 + (i + .5)*(w/n) + (fxH(s) - .5)*10; P.push({ x:side < 0 ? xo : W - xo, y:H - 14 - r*22 - (1 - i/n)*10, sz:17 - r*1.4 + fxH(s + 2)*10, t0:.05 + r*.17 + fxH(s + 3)*.35, s, pile:1 }); } }
  for (let i = 0; i < 60; i++){ const s = 900 + i*7.31; P.push({ x:110 + fxH(s)*880, y:380 + fxH(s + 1)*480, sz:6 + Math.pow(fxH(s + 2), 2)*30, t0:fxH(s + 3)*1.35, s, pile:0 }); }
  for (const p of P) p.land = p.t0 + Math.sqrt(2*620/2400);
  return (CAVE = P.sort((a, b) => a.y - b.y)); }
function drawRubble(B, c){ const k = B.ph2; if (k < 0) return; for (const p of caveRocks(B)){ if (!p.pile || k < p.land) continue; const q = cl((k - p.land)/.3), by = Math.abs(Math.sin(q*Math.PI*2))*p.sz*.35*(1 - q); rock(c, p.x, p.y - by, p.sz, p.s, fxH(p.s + 4)*6); } }
function drawFallTop(B, c){ const k = B.ph2; if (k < 0 || k > 3.2) return; c.save();
  for (const p of caveRocks(B)){ const a = k - p.t0; if (a < 0) continue;
    if (k < p.land){ const y = p.y - 620 + 1200*a*a; c.globalAlpha = .35; c.strokeStyle = 'rgba(150,130,104,.6)'; c.lineWidth = p.sz*.5; c.beginPath(); c.moveTo(p.x, y - 60); c.lineTo(p.x, y - p.sz*.5); c.stroke(); c.globalAlpha = 1; rock(c, p.x, y, p.sz, p.s, a*(fxH(p.s + 5) - .5)*10); continue; }
    const u = (k - p.land)/.6; if (u > 1) continue; c.globalAlpha = 1 - u; c.fillStyle = 'rgba(150,126,98,.6)'; c.beginPath(); c.ellipse(p.x, p.y + p.sz*.3 - u*20, p.sz*(1 + u*2.4), p.sz*(.4 + u*.9), 0, 0, 7); c.fill(); c.globalAlpha = 1;
    if (!p.pile){ c.globalAlpha = 1 - cl(u*3); rock(c, p.x, p.y, p.sz, p.s); for (let f = 0; f < 3; f++){ const fa = -Math.PI*(.15 + f*.35), sp = 60 + fxH(p.s + f)*90; c.globalAlpha = 1 - u; rock(c, p.x + Math.cos(fa)*sp*u, p.y + Math.sin(fa)*sp*u + 260*u*u, p.sz*.3, p.s + f, u*8); } } }
  c.restore(); }
let irisC = null;
function drawIris(B, c, w, h){ const k = B.ph2; if (k < .4 || k > 3.7) return; const amt = ease((k - .5)/.8)*(1 - ease((k - 2.75)/.85)); if (amt <= 0) return;
  const i = info(B), [lx, ly] = B.toScreen(i.x, i.y - LAMP_Y), red = k > 1.9, z = B.view.zoom || 1;
  const flick = k > 1.3 && k < 1.9 ? [1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0][Math.floor((k - 1.3)*22) % 13] : 1;
  const pulse = red ? 1 + .2*Math.sin((k - 1.9)*12) : 1, rad = lerp(Math.max(w, h)*1.3, 120*z, amt)*pulse*(flick ? 1 : .45);
  if (!irisC) irisC = document.createElement('canvas'); const s = .5, cw = Math.ceil(w*s), ch = Math.ceil(h*s); if (irisC.width !== cw || irisC.height !== ch){ irisC.width = cw; irisC.height = ch; }
  const g = irisC.getContext('2d'); g.setTransform(s, 0, 0, s, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h); g.fillStyle = red ? '#060000' : '#000'; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'destination-out'; const q = g.createRadialGradient(lx, ly + 40*z, rad*.3, lx, ly + 40*z, rad); q.addColorStop(0, 'rgba(0,0,0,1)'); q.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = q; g.fillRect(0, 0, w, h);
  const bw = 150*z*pulse, bh = 320*z; if (flick){ const cq = g.createLinearGradient(0, ly, 0, ly + bh); cq.addColorStop(0, 'rgba(0,0,0,.95)'); cq.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = cq; g.beginPath(); g.moveTo(lx - 8, ly); g.lineTo(lx + 8, ly); g.lineTo(lx + bw, ly + bh); g.lineTo(lx - bw, ly + bh); g.closePath(); g.fill(); }
  c.save(); c.globalAlpha = cl(amt*1.3); c.drawImage(irisC, 0, 0, w, h);
  c.globalAlpha = amt; c.globalCompositeOperation = 'lighter';
  if (flick){ const col = red ? '255,24,12' : '255,236,170', R = (red ? 150 : 100)*z*pulse, gl = c.createRadialGradient(lx, ly, 2, lx, ly, R); gl.addColorStop(0, `rgba(${col},${red ? .75 : .6})`); gl.addColorStop(1, `rgba(${col},0)`); c.fillStyle = gl; c.fillRect(lx - R, ly - R, R*2, R*2);
    const cq = c.createLinearGradient(0, ly, 0, ly + bh); cq.addColorStop(0, `rgba(${col},.35)`); cq.addColorStop(1, `rgba(${col},0)`); c.fillStyle = cq; c.beginPath(); c.moveTo(lx - 8, ly); c.lineTo(lx + 8, ly); c.lineTo(lx + bw, ly + bh); c.lineTo(lx - bw, ly + bh); c.closePath(); c.fill(); }
  c.globalCompositeOperation = 'source-over';
  const hu = ease((k - 1.95)/.55)*(1 - ease((k - 2.6)/.45)); // 어둠 속에서 뻗어 오는 손 (갱도에 남겨진 사람들)
  if (hu > 0){ c.globalAlpha = hu; c.lineCap = 'round'; const R0 = Math.max(w, h)*.75;
    for (let n = 0; n < 8; n++){ const a = n/8*6.283 + .35 + Math.sin(k*3 + n)*.06, r1 = Math.max(rad, 80*z)*lerp(2.4, 1.05, hu)*(.9 + fxH(n)*.2), x0 = lx + Math.cos(a)*R0, y0 = ly + Math.sin(a)*R0*.85, x1 = lx + Math.cos(a)*r1, y1 = ly + Math.sin(a)*r1*.85;
      const ex = (x0 + x1)/2 + Math.cos(a + 1.57)*(40 + Math.sin(k*6 + n)*18), ey = (y0 + y1)/2 + Math.sin(a + 1.57)*(40 + Math.sin(k*6 + n)*18);
      for (const [lw, col] of [[16, 'rgba(160,16,12,.7)'], [11, '#0a0304']]){ c.strokeStyle = col; c.lineWidth = lw; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(ex, ey, x1, y1); c.stroke();
        c.lineWidth = lw*.35; for (let f = 0; f < 4; f++){ const fa = a + Math.PI + (f - 1.5)*.32, fl = 26 + Math.sin(k*9 + n + f)*6; c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(x1 + Math.cos(fa)*fl*.6, y1 + Math.sin(fa)*fl*.6 - 6, x1 + Math.cos(fa + .3)*fl, y1 + Math.sin(fa + .3)*fl); c.stroke(); } } } }
  if (k > 1.9 && k < 2.35){ const f = 1 - (k - 1.9)/.45; c.globalAlpha = .75*f; c.fillStyle = k < 1.96 ? '#ffe0d0' : '#c00a08'; c.fillRect(0, 0, w, h); }
  c.restore(); }
function drawHaze(B, c, w, h){ const k = B.ph2; if (k < 0 || k > 3.4) return; const a = Math.min(cl(k/.3), cl((3.2 - k)/1.4)); c.save(); c.fillStyle = `rgba(92,74,56,${.3*a})`; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 7; i++){ const s = 700 + i*3.7, x = w*(.05 + fxH(s)*.9), cw = 18 + fxH(s + 1)*40, al = Math.min(cl((k - fxH(s + 2)*.5)/.2), cl((1.9 - k)/.6))*(.5 + .5*Math.sin(k*9 + i)); if (al <= 0) continue;
    c.globalAlpha = al*.35; c.fillStyle = 'rgba(160,140,110,1)'; const len = h*(.35 + fxH(s + 3)*.45); c.beginPath(); c.moveTo(x - cw*.3, 0); c.lineTo(x + cw*.3, 0); c.lineTo(x + cw, len); c.lineTo(x - cw, len); c.closePath(); c.fill(); }
  c.restore(); }
let vigC = null, vigK = '';
function drawVignette(c, w, h, a){ const key = `${w}x${h}`; if (vigK !== key){ vigK = key; vigC = document.createElement('canvas'); vigC.width = Math.ceil(w/2); vigC.height = Math.ceil(h/2); const g = vigC.getContext('2d'), q = g.createRadialGradient(w/4, h/4, Math.min(w, h)*.18, w/4, h/4, Math.max(w, h)*.6); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(50,0,0,.85)'); g.fillStyle = q; g.fillRect(0, 0, w, h); }
  c.save(); c.globalAlpha = a; c.drawImage(vigC, 0, 0, w, h); c.restore(); }

// ===== 그리기 도우미 =====
function ring(c, x, y, rx, ry, col, lw = 3, dash){ c.save(); c.strokeStyle = col; c.lineWidth = lw; if (dash) c.setLineDash(dash); c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.stroke(); c.restore(); }
function fill(c, x, y, rx, ry, col){ c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }
function bubble(c, x, y, s, bg = '#fff4e0', fg = '#5a3a10'){ c.save(); c.font = 'bold 20px "Dongle",sans-serif'; const w = c.measureText(s).width + 24; c.fillStyle = bg; c.beginPath(); c.roundRect(x - w/2, y - 15, w, 30, 12); c.fill(); c.beginPath(); c.moveTo(x - 6, y + 14); c.lineTo(x + 2, y + 26); c.lineTo(x + 8, y + 14); c.fill(); c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y + 1); c.restore(); }
function railSleepers(c, x0, y0, x1, y1){ const n = Math.hypot(x1 - x0, y1 - y0)/22; c.fillStyle = '#3e2c1a'; for (let i = 0; i < n; i++){ const u = i/n; c.fillRect(lerp(x0, x1, u) - 4, lerp(y0, y1, u) - 13, 8, 26); } }

export default {
  _t: { pk, info, mapCells, carts, blasts, knockRounds, escFoot, WALL, EXITS }, // 혼자 시험용 (엔진은 안 써요)
  reach: 125,
  height: 255,
  pos(B){ const i = info(B); return [i.x, i.y]; },

  hitMul(B){ const i = info(B); if (i.vis < .9 || pk(B).id === 'trans') return 0; return stunned(B) ? 2 : 1; },

  swing(B, cx, cy){ const p = pk(B);
    if (p.id === 'rail') for (const s of ['L', 'R']) if (dist(cx, cy, LEV[s][0], LEV[s][1]) < 70){ pullLever(B, s); return true; }
    if (p.id === 'knock' && !kOpen(B, p) && dist(cx, cy, WALL[0], WALL[1] - 50) < 115){ knockSwing(B, p); return true; }
    return false; },

  tap(B, wx, wy){ const p = pk(B);
    if (p.id === 'rail') for (const s of ['L', 'R']){ const [lx, ly] = LEV[s]; if (Math.abs(wx - lx) < 40 && wy > ly - 60 && wy < ly + 20) return { x:lx + (s === 'L' ? -34 : 34), y:ly + 14, act:() => pullLever(lastB || B, s) }; }
    return null; },

  tick(B, dt){
    const p = pk(B), now = B.now, me = B.me, lo = B.lo, i = info(B); lastB = B; prune();
    for (const pl of B.all){ const k = 'still' + pl.uid, st = sm[k]; if (!st || dist(st.x, st.y, pl.x, pl.y) > 14) sm[k] = { x:pl.x, y:pl.y, at:now }; }
    // 대사: 패턴이 바뀔 때 (모두 같은 때에)
    if (p.id && p.t < 1 && once('say' + p.seed + p.id)){ const s = p.id === 'crack' ? `${B.targetNick}, 헬멧 하나 줄까?` : LINES[p.id]; if (s) B.say(s, 2600); }
    if (p.id === 'trans'){ for (const [at, n] of [[0, 'a'], [.5, 'b'], [1.0, 'c'], [1.5, 'd'], [1.9, 'e']]) if (p.t >= at && p.t < at + .6 && once('sh' + B.r.rageAt + n)){ B.shake(); if (n === 'a' || n === 'e') B.sfx('slam', 200); }
      if (p.t > 2.4 && once('ts' + B.r.rageAt)) B.say('자기 몫은 자기가 챙기는 거야.', 2800); return; }
    // 기본 공격 (내 몸만)
    for (const b of boomers(B)){ if (b.k < .1 && once('bw' + b.key)) B.sfx('warn', 300);
      const k0 = Math.max(.6, Math.min(b.k, sm['bk' + b.key] ?? b.k)); sm['bk' + b.key] = b.k; // 프레임이 느려도 지나간 길을 다 봐요
      if (me && !me.down && b.k > .6) for (let k = k0; k <= Math.min(2.0, b.k) + 1e-6; k += .025){ const u = cl((k - .6)/1.4), [x, y] = boomAt(b, u); if (dist(x, y, me.x, me.y - 20) < 32){ if (B.hurt(lo + 40, b.key + (u < .5 ? 'a' : 'b'))) B.push(b.nm[0], b.nm[1], 40); break; } } }
    // 패턴
    if (p.id === 'mole') tickMole(B, p, me, lo);
    else if (p.id === 'rail') tickRail(B, p, me, lo);
    else if (p.id === 'blast') tickBlast(B, p, me, lo);
    else if (p.id === 'map') tickMap(B, p, me, lo);
    else if (p.id === 'crack') tickCrack(B, p, me, lo);
    else if (p.id === 'knock') tickKnock(B, p, me, lo);
    else if (p.id === 'esc') tickEsc(B, p, me, lo, i);
  },

  drawFloor(B, c){
    const p = pk(B), t = p.t;
    drawRubble(B, c);
    if (p.id === 'mole'){ const H = moleOrder(B, p);
      for (const [x, y] of HOLES){ fill(c, x, y, 40, 16, 'rgba(0,0,0,.8)'); ring(c, x, y, 44, 18, 'rgba(120,100,80,.6)', 3); }
      for (let n = 0; n < 3; n++){ const s = MOLE_I + n*MOLE_C, k = t - s, [x, y] = HOLES[H[n]];
        if (k > .2 && k < MOLE_BUMP){ const q = cl((k - .2)/(MOLE_BUMP - .2)); for (let m = 0; m < 6; m++){ const a = m/6*6.28 + B.t*3; fill(c, x + Math.cos(a)*30, y - 4 + Math.sin(a)*10 - Math.abs(Math.sin(B.t*20 + m))*8*q, 9, 6, '#6a5040'); }
          ring(c, x, y, POP_RX, POP_RY, `rgba(255,216,112,${.45 + .4*Math.sin(B.t*14)})`, 3, [7, 5]); }
        if (k > MOLE_BUMP && k < MOLE_BUMP + .4){ c.save(); c.globalAlpha = 1 - (k - MOLE_BUMP)/.4; fill(c, x, y, POP_RX*1.1, POP_RY*1.1, 'rgba(160,120,80,.7)'); c.restore(); } } }
    else if (p.id === 'rail'){ const al = Math.min(cl(t*3), cl((p.len + .4 - t)*3)); c.save(); c.globalAlpha = al; railSleepers(c, 20, RY, 1080, RY);
      c.strokeStyle = '#8a8a92'; c.lineWidth = 3; c.beginPath(); for (const o of [-9, 9]){ c.moveTo(20, RY + o); c.lineTo(1080, RY + o); } c.stroke();
      const i = info(B);
      for (const s of ['L', 'R']){ const xf = FORKX[s], d = s === 'L' ? 1 : -1, cx = xf + d*120, ex = i.x - d*62, ey = i.y + 4, nc = leverCart(B, p, s), on = nc ? switched(B, p, nc) : false;
        c.strokeStyle = on ? 'rgba(170,230,150,.85)' : 'rgba(120,120,128,.55)'; c.lineWidth = 3; c.setLineDash(on ? [] : [8, 7]); c.beginPath(); for (const o of [-8, 8]){ c.moveTo(xf, RY + o); c.quadraticCurveTo(cx, RY + o, ex + o*.3*d, ey + o*.6); } c.stroke(); c.setLineDash([]);
        const [lx, ly] = LEV[s]; c.fillStyle = '#2a2a30'; c.fillRect(lx - 22, ly - 4, 44, 12); c.save(); c.translate(lx, ly); c.rotate(on ? -d*.6 : d*.6); c.fillStyle = '#9a9aa2'; c.fillRect(-3, -38, 6, 38); fill(c, 0, -40, 8, 8, on ? '#7aff9a' : '#ff6a5a'); c.restore(); }
      for (const ct of carts(B, p)){ const k = t - ct.t0; if (k > -1.0 && k < ct.tf){ const fx = ct.L ? 20 : 1080, len = 520; c.globalAlpha = al*(.35 + .3*Math.sin(B.t*18)); c.fillStyle = '#ffd870'; c.fillRect(ct.L ? fx : fx - len, RY - 3, len, 6); c.globalAlpha = al; } }
      c.restore(); }
    else if (p.id === 'blast'){ const al = Math.min(cl(t*3), cl((p.len + .4 - t)*3));
      for (const bl of blasts(B, p)){ if (t < bl.lit - .2 || t > bl.boom + .2) continue; const fl = .5 + .2*Math.sin(B.t*30); c.save(); c.globalAlpha = al*fl*cl((t - bl.lit + .2)*3);
        c.fillStyle = 'rgba(6,8,18,.75)'; for (const [rx, ry] of ROCKS3){ const x0 = bl.L ? rx + 20 : rx - 20, x1 = bl.L ? rx + 210 : rx - 210; c.beginPath(); c.moveTo(x0, ry - 36); c.lineTo(x1, ry - 42); c.lineTo(x1, ry + 42); c.lineTo(x0, ry + 30); c.closePath(); c.fill(); } c.restore(); }
      c.save(); c.globalAlpha = al; for (let n = 0; n < 3; n++){ const [rx, ry] = ROCKS3[n]; blit(c, bigRock(n), rx, ry); } c.restore();
      for (const bl of blasts(B, p)){ if (t < bl.lit - .4 || t > bl.boom) continue; const x0 = bl.L ? 46 : 1054, fu = cl((bl.boom - t)/(bl.boom - bl.lit)); c.save(); c.globalAlpha = al;
        for (let n = 0; n < 6; n++){ c.fillStyle = '#c82a2a'; c.fillRect(x0 - 18 + (n % 3)*12, 560 + Math.floor(n/3)*30, 10, 28); } c.strokeStyle = '#e8d0a0'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, 560); c.lineTo(x0, 560 - 90*fu); c.stroke();
        fill(c, x0, 560 - 90*fu, 6 + Math.sin(B.t*40)*2, 6 + Math.sin(B.t*40)*2, '#fff0a0'); c.restore(); } }
    else if (p.id === 'map'){ const cells = mapCells(B, p);
      MAPR.forEach(([, f], r) => { if (t < f || t > f + PIT + .4) return; const fade = cl((f + PIT + .4 - t)*2.5), grow = cl((t - f)/.25);
        for (const ci of cells[r]){ const [x, y, w, h] = cellRect(ci), cx = x + w/2, cy = y + h/2; c.save(); c.globalAlpha = fade; c.fillStyle = '#050302'; c.beginPath();
          for (let n = 0; n < 14; n++){ const a = n/14*6.283, r2 = (.85 + ((n*37 + ci*11) % 10)/60)*grow; c.lineTo(cx + Math.cos(a)*w*.5*r2, cy + Math.sin(a)*h*.5*r2); } c.closePath(); c.fill(); c.strokeStyle = 'rgba(220,170,110,.9)'; c.lineWidth = 6; c.stroke(); c.restore(); } }); }
    else if (p.id === 'crack'){ const al = cl((p.len + 1 - t)*2);
      for (const h of crackHoles(B, p)){ const k = (B.now - h[2])/1000; if (k < 0 || k > 8) continue; const gr = cl(k/.4); c.save(); c.globalAlpha = al*cl((8 - k)*2); fill(c, h[0], h[1], 22*gr, 11*gr, '#050303');
        c.strokeStyle = 'rgba(150,120,90,.7)'; c.lineWidth = 2; c.beginPath(); for (let j = 0; j < 4; j++){ const a = j*1.6 + h[2]%7; c.moveTo(h[0] + Math.cos(a)*20*gr, h[1] + Math.sin(a)*10*gr); c.lineTo(h[0] + Math.cos(a)*34*gr, h[1] + Math.sin(a)*16*gr); } c.stroke(); c.restore(); }
      const tg = B.target; if (tg){ const st = sm['still' + tg.uid], still = st ? (B.now - Math.max(st.at, B.now - (t - 1)*1000))/1000 : 0; if (still > .4 && t > 1){ const q = cl((still - .4)/1.1); c.save(); c.strokeStyle = `rgba(30,16,8,${.5 + q*.5})`; c.lineWidth = 2 + q*2; crackSeg(c, tg.x, tg.y + 2, 18 + q*26, 7 + q*10, Math.floor(st.at/100)); c.restore(); } } }
    else if (p.id === 'knock'){ const open = kOpen(B, p), oa = open ? cl((B.now - (B.bs.st0 || B.now))/600) : 0;
      if (oa < 1){ c.save(); c.globalAlpha = 1 - oa*.8; const kr = knockRounds(B, p), act = kr.find(r => t > r.a0 && t < r.a1); if (act && !open){ ring(c, WALL[0], WALL[1] - 4, 110, 30, `rgba(150,255,170,${.35 + .3*Math.sin(B.t*10)})`, 3); }
        let sh = 0; for (const r of kr) for (const b of r.b){ const k = t - r.t - b; if (k > 0 && k < .25) sh = (1 - k/.25)*5; }
        blit(c, wallSpr(), WALL[0] + Math.sin(B.t*80)*sh, WALL[1] + oa*40); c.restore(); }
      if (open){ for (let n = 0; n < 8; n++){ const a = n*.8; rock(c, WALL[0] - 80 + n*22, WALL[1] + 6 + Math.sin(a)*8, 10 + fxH(n)*8, n); } } }
    else if (p.id === 'esc'){
      for (const [x, y] of EXITS){ fill(c, x, y - 10, 58, 80, 'rgba(0,0,0,.85)'); c.save(); c.strokeStyle = '#6a5030'; c.lineWidth = 8; c.beginPath(); c.moveTo(x - 50, y + 60); c.lineTo(x - 50, y - 80); c.lineTo(x + 50, y - 80); c.lineTo(x + 50, y + 60); c.stroke(); c.restore();
        c.save(); c.globalAlpha = .5 + .3*Math.sin(B.t*3); fill(c, x, y - 20, 22, 30, 'rgba(200,220,255,.12)'); c.restore(); }
      for (const d of dynList(B)){ const k = (B.now - d.at)/1000; if (k < 0 || k > 1.8) continue;
        if (k < 1.3){ c.fillStyle = '#c82a2a'; c.fillRect(d.x - 5, d.y - 16, 10, 22); fill(c, d.x, d.y - 18, 4, 4, Math.floor(B.t*10) % 2 ? '#fff0a0' : '#ff8a3a'); ring(c, d.x, d.y, 60, 33, `rgba(255,106,58,${.4 + .3*Math.sin(B.t*12)})`, 2, [5, 5]); }
        else { c.save(); c.globalAlpha = 1 - (k - 1.3)/.5; fill(c, d.x, d.y, 70, 38, 'rgba(255,170,70,.7)'); c.restore(); } } }
    // 부메랑 예고 (휘어 날아갈 길)
    for (const b of boomers(B)){ if (b.k > .6) continue; c.save(); c.globalAlpha = .4 + .4*Math.abs(Math.sin(b.k*10)); c.strokeStyle = '#ffd870'; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); for (let n = 0; n <= 20; n++){ const q = boomAt(b, n/40); n ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); } c.stroke(); c.restore(); }
    drawTrailFloor(B, c);
  },

  drawBody(B, c){
    const i = info(B); if (i.vis <= 0) return; const art = bossArt(half(B)), x = i.x, y = i.y; let sh = 0;
    if (B.phase === 2 && B.ph2 >= 0 && B.ph2 < 2.2) sh = Math.sin(B.t*70)*6*(1 - B.ph2/2.2);
    shadow(c, x, y - 4, 80, 18, .45*i.vis);
    c.save(); if (i.vis < 1){ c.beginPath(); c.rect(x - 200, y - 400, 400, 406); c.clip(); }
    c.translate(x + sh, y + (1 - i.vis)*(art.h - 40)); if (stunned(B)) c.rotate(Math.sin(B.t*3)*.08);
    c.drawImage(art.cv, -art.ox, -art.oy, art.w, art.h);
    if (half(B)){ const on = Math.floor(B.t*5) % 3 !== 0; fill(c, 0, -LAMP_Y, 7, 6, on ? '#ff3a2a' : '#2a0a08'); if (on){ c.globalCompositeOperation = 'lighter'; c.globalAlpha = .55; fill(c, 0, -LAMP_Y, 34, 30, 'rgba(255,40,30,.45)'); fill(c, 0, -LAMP_Y, 16, 14, 'rgba(255,90,60,.6)'); } }
    c.restore();
  },

  drawTop(B, c){
    const p = pk(B), t = p.t;
    drawFallTop(B, c);
    if (p.id === 'rail'){ for (const ct of carts(B, p)){ const q = cartAt(B, p, ct); if (q){ blit(c, cartSpr(), q.x, q.y + 4); if (Math.floor(B.t*8) % 2) text(c, '덜컹', q.x, q.y - 54, 18, '#e8e0d0'); }
        const kc = t - ct.t0 - ct.tf - .8; if (switched(B, p, ct) && kc > 0 && kc < 1.2){ const i = info(B); text(c, '쾅!', i.x - ct.dir*40, i.y - 40 - kc*20, 40, '#ffe08a'); c.save(); c.globalAlpha = 1 - kc/1.2; for (let n = 0; n < 7; n++){ const a = -Math.PI*(.1 + n*.13); blit(c, nuggetSpr(), i.x - ct.dir*50 + Math.cos(a)*kc*140, i.y - 20 + Math.sin(a)*kc*120 + 200*kc*kc); } c.restore(); } } }
    else if (p.id === 'blast'){ for (const bl of blasts(B, p)){ if (t < bl.boom || t > bl.boom + 1.3) continue; const fx = frontX(bl, t), fade = cl((bl.boom + 1.3 - t)*1.5); c.save(); c.globalAlpha = fade*.4;
        c.beginPath(); c.rect(bl.L ? 40 : fx, 330, bl.L ? fx - 40 : 1060 - fx, 570); c.clip(); c.beginPath(); c.rect(0, 330, 1100, 570);
        for (const [rx, ry] of ROCKS3){ if (bl.L) c.rect(rx + 28, ry - 42, 172, 84); else c.rect(rx - 200, ry - 42, 172, 84); } c.fillStyle = '#ff9a40'; c.fill('evenodd'); c.restore();
        c.save(); c.globalAlpha = fade; c.fillStyle = 'rgba(255,240,200,.85)'; c.fillRect(fx - 8, 330, 16, 570); c.restore(); if (t < bl.boom + .6) text(c, '콰-앙!', info(B).x, 380, 44, '#ffe0a0'); } }
    else if (p.id === 'map'){ MAPR.forEach(([, f], r) => { if (t > f && t < f + .5) for (const ci of mapCells(B, p)[r]){ const [x, y, w, h] = cellRect(ci); text(c, '쿵', x + w/2, y + h/2, 34, '#ffd8a0'); } }); }
    else if (p.id === 'crack'){ const tg = B.target; if (tg && t > .3){ c.save(); c.translate(tg.x, tg.y - 50); c.fillStyle = '#e0b828'; c.beginPath(); c.arc(0, 2, 18, Math.PI, 0); c.fill(); c.fillStyle = '#b08a18'; c.fillRect(-22, 0, 44, 5); fill(c, 0, -9, 5, 4, '#fffad0'); c.restore(); } }
    else if (p.id === 'knock') drawKnockTop(B, c, p);
    else if (p.id === 'esc'){ const f = escFoot(B, p); if (f.e.mode !== 'catch' && f.u < 1 && f.e.run && Math.floor(B.t*2) % 2 === 0){ c.save(); c.globalAlpha = .7; text(c, '…', f.x + f.dx*80, f.y - 40, 30, '#ffd0a0'); c.restore(); } }
    // 부메랑
    for (const b of boomers(B)){ if (b.k < .6) continue; const u = (b.k - .6)/1.4;
      c.save(); for (let j = 1; j < 4; j++){ const [x2, y2] = boomAt(b, Math.max(0, u - j*.025)); c.globalAlpha = .25 - j*.06; c.strokeStyle = '#d8d8e0'; c.lineWidth = 5; c.beginPath(); c.arc(x2, y2, 20, 0, 7); c.stroke(); } c.restore();
      const [x, y] = boomAt(b, u); c.save(); c.translate(x, y); c.rotate(b.k*16); blit(c, pickSpr(), 0, 0); c.restore(); }
    drawTrailTop(B, c);
  },

  drawScreen(B, c, w, h){
    const p = pk(B);
    if (half(B)) drawVignette(c, w, h, B.phase === 2 && B.ph2 < 3 ? cl((B.ph2 - 2)/1) : .55);
    if (p.id === 'trans' || (B.ph2 >= 0 && B.ph2 < 3.8)){ drawHaze(B, c, w, h); drawIris(B, c, w, h); }
    if (p.id === 'blast') for (const bl of blasts(B, p)){ const t = p.t; if (t < bl.lit || t > bl.boom + .3) continue; const k = t < bl.boom ? .25 + .25*Math.abs(Math.sin(B.t*(6 + (t - bl.lit)*4))) : .8*(1 - (t - bl.boom)/.3);
      c.save(); const q = c.createLinearGradient(bl.L ? 0 : w, 0, bl.L ? 60 : w - 60, 0); q.addColorStop(0, `rgba(255,140,50,${k})`); q.addColorStop(1, 'rgba(255,140,50,0)'); c.fillStyle = q; c.fillRect(bl.L ? 0 : w - 60, 0, 60, h); c.restore(); }
    if (p.id === 'map') drawMapPanel(B, c, w, h, p);
  },
};

// ===== 패턴별 판정 (내 화면 · 나만) =====
function tickMole(B, p, me, lo){ const H = moleOrder(B, p);
  for (let n = 0; n < 3; n++){ const s = MOLE_I + n*MOLE_C, k = p.t - s, [x, y] = HOLES[H[n]];
    if (k > .2 && k < .4 && once('mw' + p.seed + n)) B.sfx('warn', 200);
    if (k >= MOLE_BUMP && k < MOLE_BUMP + .4){ if (once('ms' + p.seed + n)){ B.sfx('slam', 150); B.shake(); }
      if (me && !me.down && inEll(me.x, me.y, x, y, POP_RX, POP_RY) && B.hurt(lo + 80, `mp${p.seed}.${n}`)) B.push(me.x - x || 1, me.y - y, 80); } } }
function tickRail(B, p, me, lo){
  for (const ct of carts(B, p)){ const k = p.t - ct.t0;
    if (k > -1 && k < -.8 && once('cw' + p.seed + ct.i)) B.sfx('warn', 200);
    const kk = 'cl' + p.seed + ct.i, t0 = Math.max(p.t - .5, Math.min(p.t, sm[kk] ?? p.t)); sm[kk] = p.t;
    if (me && !me.down && Math.abs(me.y - RY) < 26) for (let tt = t0; tt <= p.t + 1e-6; tt += .03){ const q = cartAt(B, {...p, t:tt}, ct); if (q && !q.br && Math.abs(me.x - q.x) < 44){ if (B.hurt(lo + 120, `ct${p.seed}.${ct.i}`)) B.push(0, me.y < RY ? -1 : 1, 80); break; } }
    const tc = ct.t0 + ct.tf + .8; if (switched(B, p, ct) && p.t >= tc && p.t < tc + .5){ if (once('cs' + p.seed + ct.i)){ B.sfx('slam', 100); B.shake(); }
      if (B.host && once('ch' + p.seed + ct.i)){ const at = Math.round(B.now - (p.t - tc)*1000); B.tx(bs => (bs.stun || 0) >= at + 3000 ? undefined : {...bs, stun:at + 3000, st0:at}); } } } }
function tickBlast(B, p, me, lo){
  for (const bl of blasts(B, p)){ if (p.t > bl.lit && p.t < bl.lit + .3 && once('bw' + p.seed + bl.j)) B.sfx('warn', 200);
    if (p.t >= bl.boom && p.t < bl.boom + .7){ if (once('bb' + p.seed + bl.j)){ B.sfx('slam', 100); B.shake(); }
      if (me && !me.down){ const fx = frontX(bl, p.t), passed = bl.L ? fx >= me.x : fx <= me.x; if (passed && !inShadow(me.x, me.y, bl.L) && B.hurt(lo + 160, `bl${p.seed}.${bl.j}`)) B.push(bl.L ? 1 : -1, 0, 90); } } } }
function tickMap(B, p, me, lo){ const cells = mapCells(B, p);
  MAPR.forEach(([wn, f], r) => { if (p.t > wn && p.t < wn + .3 && once('gw' + p.seed + r)) B.sfx('warn', 200);
    if (p.t >= f && p.t < f + PIT){ if (once('gf' + p.seed + r)){ B.sfx('slam', 100); B.shake(); }
      if (me && !me.down && cells[r].includes(cellOf(me.x, me.y))) B.hurt(lo + 120, `pt${p.seed}.${r}`); } }); }
function tickCrack(B, p, me, lo){
  const tg = B.target, now = B.now, t1 = now - (p.t - 1)*1000;
  if (!tg || p.t < 1 || p.t > p.len - .3) return;
  // 노리는 몸: 멈추면 발밑이 꺼져요
  if (me && tg.uid === me.uid && !me.down){ const st = sm['still' + me.uid], a0 = Math.max(st.at, t1), still = (now - a0)/1000; if (still > 1.5 && B.hurt(lo + 100, `cs${Math.round(a0)}.${Math.floor((still - 1.5)/1.5)}`)){ B.sfx('slam', 200); B.fx('쿵', me.x, me.y - 40, '#ffd0a0'); } }
  // 친구: 구멍을 밟으면 빠져요
  if (me && tg.uid !== me.uid && !me.down) for (const h of crackHoles(B, p)){ const k = (now - h[2])/1000; if (k > .4 && k < 8 && inEll(me.x, me.y, h[0], h[1], 24, 13) && B.hurt(lo + 40, `hl${h[2]}`)){ B.push(me.x - h[0] || 1, me.y - h[1], 40); break; } }
  // 호스트: 노리는 몸이 지나간 자리를 모아서 1 초마다 적어요
  if (B.host){ const k = 'chb' + p.seed, buf = sm[k] || (sm[k] = { h:[], at:now, last:null });
    if (!buf.last || dist(buf.last[0], buf.last[1], tg.x, tg.y) > 30){ buf.last = [Math.round(tg.x), Math.round(tg.y + 4), Math.round(now)]; buf.h.push(buf.last); }
    if (buf.h.length && now - buf.at > 1000){ buf.at = now; const add = buf.h.splice(0); B.tx(bs => { const old = bs.ch && bs.ch.k === p.seed ? bs.ch.h || [] : []; return {...bs, ch:{k:p.seed, h:[...old, ...add].filter(h => B.now - h[2] < 8000).slice(-40)}}; }); } } }
function knockSwing(B, p){ const kr = knockRounds(B, p), r = kr.find(r => p.t > r.a0 && p.t < r.a1); B.sfx('hit', 60); B.fx('쿵', WALL[0] + (Math.random() - .5)*40, WALL[1] - 120, '#c8ffd0');
  if (!r || !B.me) return; const k = 'ks' + p.seed + r.j, L = sm[k] || (sm[k] = []); L.push(B.now); if (L.length > 8) L.shift();
  const n = r.b.length; if (L.length < n || sm['kok' + p.seed + r.j]) return; const s = L.slice(-n), ok = r.b.every((b, q) => Math.abs((s[q] - s[0]) - b*1000) < 180);
  if (ok){ sm['kok' + p.seed + r.j] = 1; const uid = B.me.uid; B.fx('!', B.me.x, B.me.y - 70, '#c8ffd0'); B.tx(bs => { const a = bs.kn && bs.kn.k === p.seed ? bs.kn.a || [] : []; if (a.some(x => x[0] === r.j && x[1] === uid)) return undefined; return {...bs, kn:{k:p.seed, a:[...a, [r.j, uid]]}}; }); } }
function tickKnock(B, p, me, lo){ const kr = knockRounds(B, p), open = kOpen(B, p);
  if (!open) for (const r of kr) for (let q = 0; q < r.b.length; q++){ const k = p.t - r.t - r.b[q]; if (k >= 0 && k < .2 && once('kb' + p.seed + r.j + '.' + q)) B.sfx('slam', 80); }
  if (B.host && !open && kDone(B, p) >= 2 && later('ko', 600, B.now)){ const now = Math.round(B.now); B.tx(bs => bs.ko === p.seed ? undefined : {...bs, ko:p.seed, stun:now + 8000, st0:now}); }
  if (open && once('kop' + p.seed)){ B.sfx('slam', 100); B.shake(); B.say('…바람 소리가 아니었어.', 2600); }
  for (const r of kr) if (!open && p.t > r.judge && p.t < r.judge + .3 && kAns(B, p, r.j) < kneed(B) && once('kf' + p.seed + r.j)) B.say('바람 소리야.', 1500); }
function dynList(B){ const L = sm.dyn || []; return L.filter(d => B.now - d.at < 2000); }
function tickEsc(B, p, me, lo, i){
  const f = escFoot(B, p), e = f.e, now = B.now, running = e.run && e.mode !== 'catch' && f.u < 1 && p.t > .8;
  // 지나간 자리에 화약 (1 초마다)
  const sec = Math.floor(now/1000); if (running && sm.dynS !== sec){ sm.dynS = sec; (sm.dyn = dynList(B)).push({ x:f.x, y:f.y, at:sec*1000 }); }
  for (const d of dynList(B)){ const k = (now - d.at)/1000; if (k >= 1.3 && k < 1.6){ if (once('dx' + d.at)) B.sfx('slam', 200); if (me && !me.down && inEll(me.x, me.y, d.x, d.y, 60, 33) && B.hurt(lo + 100, `dy${d.at}`)) B.push(me.x - d.x || 1, me.y - d.y, 70); } }
  if (f.u >= 1 && once('ex' + e.k + e.seg)){ B.sfx('slam', 100); B.shake(); }
  if (!B.host || !later('esc', 350, now)) return;
  const set = o => B.tx(bs => { const cur = bs.esc && bs.esc.k === p.seed ? bs.esc : e; if ((cur.seg|0) !== (e.seg|0) || (cur.v|0) !== (e.v|0)) return undefined; return {...bs, esc:{...cur, ...o, v:(cur.v|0) + 1}}; });
  const next = (x0, y0) => set({ x0:Math.round(x0), y0:Math.round(y0), side:-e.side, p:0, at:Math.round(now + 400), run:1, seg:(e.seg|0) + 1, mode:'', hold0:0, until:0 });
  if (e.mode === 'catch'){ if (now > e.until) next(f.x, f.y); return; }
  if (f.u >= 1){ const arr = e.at + (f.L - e.p)/EV*1000; if (sm.healSeg !== e.k + e.seg){ sm.healSeg = e.k + e.seg; B.heal(B.r.max*.04); B.say('헤헤… 내 몫.', 1600); } if (now - arr > 1500) next(f.ex, f.ey); return; }
  if (p.t < .8) return;
  const fx = f.x + f.dx*55, fy = f.y + f.dy*55, blocked = B.alive.some(pl => inEll(pl.x, pl.y, fx, fy, 70, 56));
  if (blocked && e.run) set({ p:Math.round(f.prog), at:Math.round(now), run:0, hold0:Math.round(now) });
  else if (blocked && !e.run && e.hold0 && now - e.hold0 > 2200){ const at = Math.round(now); set({ mode:'catch', until:at + 3500 }); B.tx(bs => ({...bs, stun:at + 3500, st0:at})); }
  else if (!blocked && !e.run){ if (!sm.escFree) sm.escFree = now; if (now - sm.escFree > 500){ sm.escFree = 0; set({ at:Math.round(now), run:1, hold0:0 }); } return; }
  if (blocked) sm.escFree = 0; }

// ===== 화면 위 그림 =====
function drawKnockTop(B, c, p){ const kr = knockRounds(B, p), open = kOpen(B, p), t = p.t, [wx, wy] = WALL;
  if (!open) for (const r of kr){ for (const b of r.b){ const k = t - r.t - b; if (k > 0 && k < .35){ c.save(); c.globalAlpha = 1 - k/.35; text(c, '쿵', wx + 10, wy - 170 - k*20, 34, '#ffe8a0'); c.restore(); } }
    if (t > r.t - .2 && t < r.a1 + .5){ const y = wy - 200, x0 = wx - 70, sc = 70; for (const b of r.b) fill(c, x0 + b*sc, y, 7, 7, t > r.t + b ? '#ffe08a' : 'rgba(80,70,50,.8)');
      const L = sm['ks' + p.seed + r.j] || [], mine = L.filter(x => (x - B.now)/1000 + t > r.a0); if (mine.length){ const s0 = mine[Math.max(0, mine.length - r.b.length)]; for (const x of mine.slice(-r.b.length)) fill(c, x0 + (x - s0)/1000*sc, y + 18, 6, 6, sm['kok' + p.seed + r.j] ? '#9affb0' : '#c8e0ff'); } } }
  const dn = Math.min(2, kDone(B, p)); for (let q = 0; q < 2; q++){ fill(c, wx - 14 + q*28, wy + 36, 8, 8, q < dn ? '#ffe070' : 'rgba(40,34,24,.9)'); ring(c, wx - 14 + q*28, wy + 36, 9, 9, 'rgba(200,170,90,.7)', 2); }
  if (open){ const k = (B.now - (B.bs.st0 || B.now))/1000; if (k < 8){ c.save(); c.globalAlpha = cl(k*3)*cl((8 - k)*2); bubble(c, wx, wy - 190, '여기 사람 있어요!');
      c.translate(wx - 30, wy - 110); c.rotate(-.05); c.fillStyle = '#f0e8d0'; c.fillRect(-110, -26, 220, 52); c.strokeStyle = '#8a7650'; c.lineWidth = 2; c.strokeRect(-110, -26, 220, 52);
      text(c, '구조대원 메모', 0, -10, 18, '#7a5a30', 'center', null); text(c, '"반장 말로는 바람 소리래"', 0, 11, 20, '#3a2a18', 'center', null); c.restore(); } } }
function drawMapPanel(B, c, w, h, p){ const cells = mapCells(B, p), t = p.t, al = Math.min(cl(t*3), cl((p.len - t)*3)); if (al <= 0) return;
  const mw = Math.min(150, w*.34), mh = mw*.62, mx = 10, my = h*.2; c.save(); c.globalAlpha = al; c.translate(mx, my); c.rotate(-.02);
  c.fillStyle = '#d8c8a0'; c.beginPath(); c.roundRect(0, 0, mw, mh + 20, 6); c.fill(); c.strokeStyle = '#5a4630'; c.lineWidth = 2; c.stroke(); text(c, '갱도 지도', mw/2, 11, 18, '#3a2a18', 'center', null);
  const gx = 8, gy = 22, gw = (mw - 16)/3, gh = (mh - 8)/2;
  for (let n = 0; n < 6; n++){ const cc = n % 3, r = Math.floor(n/3); let col = '#b8a888'; MAPR.forEach(([wn, f], q) => { if (cells[q].includes(n) && t > wn && t < f + PIT) col = t < f ? (Math.floor(B.t*6) % 2 ? '#e83a2a' : '#8a1a10') : '#1a0a08'; });
    c.fillStyle = col; c.fillRect(gx + cc*gw + 1.5, gy + r*gh + 1.5, gw - 3, gh - 3); }
  c.strokeStyle = 'rgba(90,70,48,.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(gx + gw*.5, gy + gh); c.lineTo(gx + gw*1.5, gy + gh*.6); c.lineTo(gx + gw*2.5, gy + gh*1.4); c.stroke();
  const mp = (x, y) => [gx + cl(x/1100)*gw*3, gy + cl((y - ROWS[0])/(ROWS[2] - ROWS[0]))*gh*2], i = info(B), [bx, by] = mp(i.x, i.y); fill(c, bx, by, 4, 4, '#3a2a18');
  if (B.me){ const [px, py] = mp(B.me.x, B.me.y); fill(c, px, py, 3.5, 3.5, '#ff5a9a'); ring(c, px, py, 5.5, 5.5, '#fff', 1.5); }
  c.restore(); }
