// 몽실??? (문세실) · 이름표 사건 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md "보스 패턴 규칙"
// 기본 공격: 줄자 휘두르기 (보스 둘레 근접 부채꼴)
// 1 단계 ① 몽실아~ (얼음) ② 줄자 묶기 ③ 실패 굴리기 → 50% 변신 (바늘이 화면을 꿰매고 실밥이 터져요)
// 2 단계 ④ 거울 연습 ⑤ 이름 지키기 (노리는 몸) ⑥ 창고 실 줄다리기 (→ 기절) → 20% 아래 ⑦ 실 감옥
// 움직일 때: 천장에서 내려온 실에 매달린 꼭두각시처럼 덜컥덜컥 끌려가요
import { pick, beat, warnCircle, warnLine, inSector, inEll, shadow, tint, text, cl, lerp, ease, dist } from './kit.js';
import { bossArt, tagArt, spoolArt, drawNeedle, drawSnip, NAMES, FOOT_U } from './mongsil_art.js';

const S = .34;                                   // 그림 단위 → 월드 px
// 경기장 (벽 · 가장자리 빼고) · 방 크기 · 보스 집 자리 기준 (층이 바뀌어도 같은 지역 좌표)
let X0 = 110, X1 = 990, Y0 = 310, Y1 = 800, WALL = 262;
function arena(B){ X0 = 110; X1 = B.W - 110; WALL = Math.max(0, B.hy - 298); Y0 = WALL + 48; Y1 = Math.min(B.H - 100, B.hy + 240); }
const P = {
  1: [{id:'freeze', len:13}, {id:'tether', len:12}, {id:'spool', len:11}],
  2: [{id:'mirror', len:13}, {id:'letters', len:15}, {id:'tug', len:13}],
  3: [{id:'prison', len:17}],
};
const GAP = 2.5, TRANS = 5;
const LOCK = {freeze:0, tether:1, spool:.5, mirror:1, letters:1, tug:.25, prison:.3}; // 패턴 중 돌아다니는 세기
const hsh = n => { const v = Math.sin(n*127.1 + 311.7)*43758.5453; return v - Math.floor(v); };
const pk = B => pick(B, P, {gap:GAP, trans:TRANS});
const stunned = B => (B.bs.stun || 0) > B.now;
const transOn = B => B.phase === 2 && B.ph2 >= 0 && B.ph2 < TRANS;

// ===== 내 화면에서만 쓰는 기억 (싸움마다 새로) =====
let fight = null, L = null;
function local(B){ const k = B.r.bossAt || 0; if (fight !== k){ fight = k; L = {once:new Set(), geo:new Map(), txAt:0, txKey:new Map(), tug:{s:'', n:0}, bpOn:false, hitAt:0, look:new Map(), sawFail:new Map()}; } return L; }
function once(B, key){ const l = local(B); if (l.once.has(key)) return false; l.once.add(key); if (l.once.size > 600){ const a = [...l.once].slice(-300); l.once = new Set(a); } return true; }
function geo(B, key, make){ const l = local(B); if (!l.geo.has(key)){ l.geo.set(key, make()); if (l.geo.size > 200) l.geo.delete(l.geo.keys().next().value); } return l.geo.get(key); }
// 호스트만 · 일이 생길 때만 · 0.33 초 넘게 간격 · 같은 일은 1.5 초 안에 다시 안 보내요
function hostTx(B, key, fn){ if (!B.host) return; const l = local(B); if (B.now - l.txAt < 330) return; const last = l.txKey.get(key); if (last && B.now - last < 1500) return;
  l.txAt = B.now; l.txKey.set(key, B.now); if (l.txKey.size > 100) l.txKey.delete(l.txKey.keys().next().value); try { const p = B.tx(fn); p?.catch?.(() => {}); } catch(e){} }
const dmg = (B, add) => Math.round(B.lo + add);

// ===== 보스 자리 (모두에게 같아요: B.now · B.t · B.bs 로만) =====
const shift = (B, d) => d ? {...B, now:B.now - d*1000, t:B.t - d, pt:B.pt - d, ph2:B.ph2 >= 0 ? B.ph2 - d : -1, ph3:B.ph3 >= 0 ? B.ph3 - d : -1} : B;
function wander(B, t, a){ return [B.hx + (Math.cos(t*.42)*150 + Math.sin(t*1.07)*34)*a, B.hy + (Math.sin(t*.61)*62 + Math.sin(t*1.3)*12)*a]; }
function rawPos(B){
  const p = pk(B), bs = B.bs; let a = 1;
  if (p.id === 'trans') a = 1 - cl(p.t/.6);
  else if (p.id && LOCK[p.id] != null){ const lv = LOCK[p.id]; a = 1 - (1 - lv)*Math.min(cl(p.t/.6), cl((p.len - p.t)/.6)); }
  let q = wander(B, B.t, a);
  if (p.id === 'mirror'){ const mv = bs.mv; if (mv && mv.s === p.seed){ const k = ease(cl((B.now - mv.at)/450)), m = [lerp(mv.x0, mv.x1, k), lerp(mv.y0, mv.y1, k)], u = cl((p.len - p.t)/.6); q = [lerp(q[0], m[0], u), lerp(q[1], m[1], u)]; } }
  if (bs.stun && bs.sx != null){ if (B.now < bs.stun) return [bs.sx, bs.sy]; const k = (B.now - bs.stun)/800; if (k < 1) return [lerp(bs.sx, q[0], ease(k)), lerp(bs.sy, q[1], ease(k))]; }
  return q;
}
let pc = {now:-1, bs:null, v:null};
function bossPos(B){ if (pc.now === B.now && pc.bs === B.bs) return pc.v; const v = rawPos(B); pc = {now:B.now, bs:B.bs, v}; return v; }
const posAgo = (B, d) => rawPos(shift(B, d));
function bossVel(B){ const a = bossPos(B), b = posAgo(B, .05); return [(a[0] - b[0])/.05, (a[1] - b[1])/.05]; }
const meXY = B => B.me ? [B.me.x, B.me.y] : null;
const alive = B => B.alive;
const byUid = (B, u) => B.all.find(p => p.uid === u) || null;

// ===== 기본 공격: 줄자 휘두르기 =====
const CONE_R = 230, CONE_A = .6, BA_WARN = .8, BA_SWEEP = .25;
function baList(B){
  if (B.t < 3 || transOn(B) || stunned(B) || !B.alive.length) return [];
  const p = pk(B);
  if (p.id === 'freeze'){ const lk = looks(p); if (lk.some(([a, b]) => p.t > a - 1.4 && p.t < b + .2)) return []; }
  const b = beat(B, 2.8, BA_WARN + BA_SWEEP + .15);
  const n = b.n, out = [], al = B.alive, cnt = B.phase >= 2 && al.length >= 3 ? 2 : 1;
  for (let j = 0; j < cnt; j++){
    const tg = al[(n + j*Math.ceil(al.length/2)) % al.length], key = `ba${n}.${j}`;
    const gm = geo(B, key, () => { const [x, y] = bossPos(B); return {x, y, a:Math.atan2((tg.y - y)/.6, tg.x - x)}; });
    out.push({...gm, t:b.t, key, n});
  }
  return out;
}
function drawBaFloor(B, c){ for (const s of baList(B)){ if (s.t > BA_WARN) continue; const k = s.t/BA_WARN;
  c.save(); c.translate(s.x, s.y); c.scale(1, .6); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, CONE_R, s.a - CONE_A, s.a + CONE_A); c.closePath();
  c.fillStyle = `rgba(255,220,80,${.1 + .12*k + .06*Math.abs(Math.sin(k*12))})`; c.fill(); c.setLineDash([9, 7]); c.lineWidth = 3/.6; c.strokeStyle = `rgba(255,220,80,${.5 + .4*Math.abs(Math.sin(k*12))})`; c.stroke(); c.restore(); } }
function drawBaTop(B, c){ for (const s of baList(B)){ const k = s.t - BA_WARN; if (k < 0 || k > BA_SWEEP + .05) continue; const u = cl(k/BA_SWEEP), a = s.a - CONE_A + u*CONE_A*2;
  c.save(); c.translate(s.x, s.y - 30); c.scale(1, .6); c.strokeStyle = '#f0d040'; c.lineWidth = 14; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a)*CONE_R, Math.sin(a)*CONE_R); c.stroke();
  c.strokeStyle = '#3a3010'; c.lineWidth = 2; for (let j = 1; j < 10; j++){ const d = j*CONE_R/10; c.beginPath(); c.moveTo(Math.cos(a)*d - Math.sin(a)*6, Math.sin(a)*d + Math.cos(a)*6); c.lineTo(Math.cos(a)*d + Math.sin(a)*6, Math.sin(a)*d - Math.cos(a)*6); c.stroke(); }
  c.globalAlpha = .22*(1 - u*.5); c.fillStyle = '#fff0a0'; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, CONE_R, s.a - CONE_A, a); c.closePath(); c.fill(); c.restore(); } }
function tickBa(B){ const m = meXY(B); for (const s of baList(B)){
  if (s.t < .2 && once(B, 'baw' + s.key)) B.sfx('warn', 400);
  const k = s.t - BA_WARN; if (k < 0 || k > BA_SWEEP + .05) continue; if (once(B, 'bas' + s.key)) B.sfx('slam', 250);
  if (m && inSector(m[0], m[1], s.x, s.y, CONE_R, s.a - CONE_A, s.a + CONE_A, .6) && B.hurt(dmg(B, 20), `ba${B.r.bossAt}.${s.key}`)) B.push(m[0] - s.x, m[1] - s.y, 60); } }

// ===== ① 몽실아~ (얼음) =====
function looks(p){ const r = rngOf(p.seed + 'L'); return [0, 1, 2].map(i => { const a = 2.0 + i*3.5 + r()*.9; return [a, a + 1.5]; }); }
function rngOf(seed){ let s = 0; const str = String(seed); for (let i = 0; i < str.length; i++) s = (s*31 + str.charCodeAt(i)) >>> 0; s = s % 2147483646 + 1; return () => (s = s*16807 % 2147483647)/2147483647; }
function lookNow(p){ if (p.id !== 'freeze') return null; const lk = looks(p); for (let i = 0; i < lk.length; i++){ const [a, b] = lk[i]; if (p.t > a - .7 && p.t < a) return {cue:true, i, a, b}; if (p.t >= a && p.t < b) return {look:true, i, a, b}; } return null; }
function tickFreeze(B, p){
  const lk = lookNow(p); if (!lk) return; const key = p.seed + '.' + lk.i;
  if (lk.cue && once(B, 'fc' + key)) B.sfx('warn', 0);
  if (lk.look){ if (once(B, 'fl' + key)) B.sfx('slam', 0);
    const m = meXY(B); if (!m || B.me.down) return; const t0 = lk.a + .3; if (p.t < t0) return;
    const st = geo(B, 'fz' + key, () => m.slice());
    if (Math.hypot(m[0] - st[0], m[1] - st[1]) > 14) stitchMe(B, key); }
}
function stitchMe(B, key){ if (B.hurt(600, `fz${B.r.bossAt}.${key}`, {raw:1})){ B.fx('몽실?', B.me.x, B.me.y - 70, '#ff8ab0'); local(B).stitch = B.now; } }

// ===== ② 줄자 묶기 =====
const TW = [[.8, 5.6], [6.4, 11.2]];
const tlen = k => lerp(300, 190, cl(k));
function tetherWave(p){ for (let w = 0; w < TW.length; w++){ const [a, b] = TW[w]; if (p.t > a - .8 && p.t < b + .4) return {w, a, b, s:p.seed + '.' + w}; } return null; }
function partnerXY(B, u){ if (u === 'B') return bossPos(B); const q = byUid(B, u); return q ? [q.x, q.y] : null; }
function tickTether(B, p){
  const tw = tetherWave(p); if (!tw) return; const bs = B.bs, te = bs.te && bs.te.s === tw.s ? bs.te : null;
  if (p.t > tw.a - .8 && once(B, 'tw' + tw.s)) B.sfx('warn', 0);
  if (!te){ if (p.t > tw.a - .8) hostTx(B, 'te' + tw.s, cur => { if (cur.te && cur.te.s === tw.s) return undefined; const r = B.rng(tw.s), u = B.alive.map(q => q.uid); for (let i = u.length - 1; i > 0; i--){ const j = Math.floor(r()*(i + 1)); [u[i], u[j]] = [u[j], u[i]]; } const pr = []; for (let i = 0; i < u.length; i += 2) pr.push([u[i], u[i + 1] || 'B']); return {...cur, te:{s:tw.s, p:pr, x:[]}}; }); return; }
  const k = (p.t - tw.a)/(tw.b - tw.a), L = tlen(k);
  if (B.host && p.t > tw.a && p.t < tw.b){ const add = []; te.p.forEach(([a, b], i) => { if (te.x.includes(i)) return; const A = byUid(B, a), Bp = b === 'B' ? {x:bossPos(B)[0], y:bossPos(B)[1]} : byUid(B, b); if (!A || !Bp || A.down || Bp.down) return; if (Math.hypot(A.x - Bp.x, A.y - Bp.y) > L) add.push(i); });
    if (add.length) hostTx(B, 'tx' + tw.s + add.join(','), cur => { if (!cur.te || cur.te.s !== tw.s) return undefined; const x = [...new Set([...(cur.te.x || []), ...add])]; return {...cur, te:{...cur.te, x}}; }); }
  if (B.me) te.p.forEach(([a, b], i) => { if ((te.x || []).includes(i) && (a === B.me.uid || b === B.me.uid)){ if (once(B, 'tsn' + tw.s + i)) B.sfx('slam', 0); B.hurt(420, `te${tw.s}.${i}`, {raw:1}); } });
}
function drawTape(c, x1, y1, x2, y2, col, dash, T){ c.save(); c.strokeStyle = col; c.lineWidth = 8; c.lineCap = 'round'; if (dash) c.setLineDash([12, 8]); const mx = (x1 + x2)/2, my = (y1 + y2)/2 + 26 + Math.sin(T*3)*4; c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(mx, my, x2, y2); c.stroke(); c.strokeStyle = 'rgba(60,40,10,.6)'; c.lineWidth = 1.5; c.setLineDash([2, 10]); c.stroke(); c.restore(); }
function drawTether(B, c, p){
  const tw = tetherWave(p); if (!tw) return; const te = B.bs.te && B.bs.te.s === tw.s ? B.bs.te : null, T = B.now/1000; if (!te) return;
  const k = (p.t - tw.a)/(tw.b - tw.a), L = tlen(k), fade = cl((tw.b + .4 - p.t)/.4);
  te.p.forEach(([a, b], i) => { const A = partnerXY(B, a), Bq = partnerXY(B, b); if (!A || !Bq) return; const ya = A[1] - 26, yb = b === 'B' ? Bq[1] - 90 : Bq[1] - 26;
    if ((te.x || []).includes(i)){ const sk = geo(B, 'snapT' + tw.s + i, () => B.now), u = (B.now - sk)/700; if (u < 1){ c.save(); c.globalAlpha = 1 - u; const mx = (A[0] + Bq[0])/2, my = (ya + yb)/2; drawTape(c, A[0], ya, lerp(A[0], mx, .8 - u*.5), lerp(ya, my + 40, .8), '#ff7a5a', false, T); drawTape(c, Bq[0], yb, lerp(Bq[0], mx, .8 - u*.5), lerp(yb, my + 40, .8), '#ff7a5a', false, T); c.restore(); } return; }
    c.save(); c.globalAlpha = fade; if (p.t < tw.a){ drawTape(c, A[0], ya, Bq[0], yb, 'rgba(240,210,70,.55)', true, T); c.restore(); return; }
    const d = Math.hypot(A[0] - Bq[0], A[1] - Bq[1]), tight = d > L*.82; drawTape(c, A[0], ya, Bq[0], yb, tight ? '#ff7a5a' : '#f0d040', false, T);
    text(c, `${Math.round(d/2)}cm`, (A[0] + Bq[0])/2, (ya + yb)/2 + 30, 18, tight ? '#ffb0a0' : '#fff4c0'); c.restore(); });
}

// ===== ③ 실패 굴리기 =====
const SP_GO = .9, SP_N = 3;
const bounce = (v, lo, hi) => { const L = hi - lo, m = ((v - lo) % (2*L) + 2*L) % (2*L); return lo + (m < L ? m : 2*L - m); };
function spools(B, p){ const o = geo(B, 'spo' + p.seed, () => { const q = posAgo(B, p.t), r = B.rng(p.seed + 'S'), a0 = r()*6.283; return {x:q[0], y:q[1], v:[0, 1, 2].map(i => { const a = a0 + i*2.094 + (r() - .5)*.5, sp = 240 + r()*60; return [Math.cos(a)*sp, Math.sin(a)*sp*.8]; })}; });
  const k = Math.max(0, Math.min(p.t, p.len - .5) - SP_GO); return o.v.slice(0, SP_N).map(([vx, vy]) => ({x:bounce(o.x + vx*k, X0, X1), y:bounce(o.y + vy*k, Y0, Y1), vx, vy, ox:o.x, oy:o.y})); }
function tickSpool(B, p){ if (p.t > SP_GO && once(B, 'sp' + p.seed)) B.sfx('slam', 0); if (p.t < SP_GO || p.t > p.len - .5) return; const m = meXY(B); if (!m) return;
  spools(B, p).forEach((s, i) => { const d = Math.hypot(m[0] - s.x, (m[1] - s.y)/.8); if (d < 44 && B.hurt(500, `sp${p.seed}.${i}.${Math.floor(p.t/1.5)}`, {raw:1})) B.push(m[0] - s.x, m[1] - s.y, 80); }); }
function drawSpoolsFloor(B, c, p){ const ss = spools(B, p); if (p.t < SP_GO){ const k = p.t/SP_GO; ss.forEach(s => { const a = Math.atan2(s.vy, s.vx); warnLine(c, s.ox, s.oy, s.ox + Math.cos(a)*260, s.oy + Math.sin(a)*260, k, 5, '255,140,190'); }); return; }
  const al = cl((p.len - p.t)/.5); ss.forEach(s => shadow(c, s.x, s.y + 6, 44*al, 14*al, .4)); }
function drawSpoolsTop(B, c, p){ if (p.t < SP_GO) return; const al = cl((p.len - p.t)/.5)*cl((p.t - SP_GO)/.2), A = spoolArt(), T = B.now/1000;
  spools(B, p).forEach((s, i) => { c.save(); c.globalAlpha = al; c.translate(s.x, s.y - 22); c.rotate(T*6*(i % 2 ? -1 : 1)); c.drawImage(A.img, -42, -42, 84, 84); c.restore(); }); }

// ===== ④ 거울 연습 =====
const MIR_W = [1.6, 4.8, 8.0, 11.2];
function mirrorOwner(B, p){ const mo = B.bs.mo; if (mo && mo.s === p.seed){ const q = byUid(B, mo.u); if (q && !q.down) return q; } return null; }
function mirrorPt(B, x, y){ return [cl(2*B.hx - x, X0, X1), cl(y, Y0, Y1)]; }
function tickMirror(B, p){
  const own = mirrorOwner(B, p);
  if (B.host && p.t > .1 && p.t < p.len - .7){
    if (!own){ if (B.alive.length) hostTx(B, 'mo' + p.seed + (B.bs.mo?.u || ''), cur => { if (cur.mo && cur.mo.s === p.seed && B.alive.some(q => q.uid === cur.mo.u)) return undefined; const r = B.rng(p.seed + 'M' + Math.floor(B.now/3000)); return {...cur, mo:{s:p.seed, u:B.alive[Math.floor(r()*B.alive.length)].uid}}; }); }
    else { const q = mirrorPt(B, own.x, own.y), mv = B.bs.mv, ok = mv && mv.s === p.seed;
      if (!ok || (Math.hypot(q[0] - mv.x1, q[1] - mv.y1) > 24 && B.now - mv.at > 420)){ const cur0 = bossPos(B), qq = [Math.round(q[0]), Math.round(q[1])]; hostTx(B, 'mv' + qq.join(','), cur => ({...cur, mv:{s:p.seed, x0:Math.round(cur0[0]), y0:Math.round(cur0[1]), x1:qq[0], y1:qq[1], at:B.now}})); } } }
  if (stunned(B)) return; const m = meXY(B);
  MIR_W.forEach((w, j) => { if (p.t < w || p.t > w + 1.4) return; const key = p.seed + '.' + j, pts = mirrorSnips(B, key);
    if (once(B, 'mw' + key)) B.sfx('warn', 0);
    if (p.t > w + 1){ if (once(B, 'ms' + key)) B.sfx('slam', 0); if (m && p.t < w + 1.15 && pts.some(([x, y]) => inEll(m[0], m[1], x, y, 70, 42))) B.hurt(650, `mi${key}`, {raw:1}); } });
}
const mirrorSnips = (B, key) => geo(B, 'mp' + key, () => B.alive.map(q => [2*B.hx - q.x, q.y]));
function drawMirrorFloor(B, c, p){ const al = cl(p.t/.6)*cl((p.len - p.t)/.5), T = B.now/1000, mx = B.hx;
  c.save(); c.globalAlpha = al*.55; const q = c.createLinearGradient(mx - 40, 0, mx + 40, 0); q.addColorStop(0, 'rgba(200,230,255,0)'); q.addColorStop(.5, `rgba(200,230,255,${.25 + .1*Math.sin(T*3)})`); q.addColorStop(1, 'rgba(200,230,255,0)'); c.fillStyle = q; c.fillRect(mx - 40, WALL, 80, Y1 + 60 - WALL);
  c.strokeStyle = '#c8e8ff'; c.lineWidth = 3; c.setLineDash([14, 10]); c.lineDashOffset = -T*20; c.beginPath(); c.moveTo(mx, WALL); c.lineTo(mx, Y1 + 60); c.stroke(); c.restore();
}
function drawMirrorTop(B, c, p){ const al = cl(p.t/.6)*cl((p.len - p.t)/.5), own = mirrorOwner(B, p), T = B.now/1000;
  if (own){ const [bx, by] = bossPos(B); c.save(); c.globalAlpha = al*.7; c.strokeStyle = 'rgba(200,230,255,.8)'; c.lineWidth = 1.5; c.setLineDash([4, 6]); c.beginPath(); c.moveTo(own.x, own.y - 40); c.quadraticCurveTo((own.x + bx)/2, Math.min(own.y, by) - 160, bx, by - 150); c.stroke(); c.setLineDash([]);
    // 손거울
    const hx = own.x, hy = own.y - 92 + Math.sin(T*3)*3; c.translate(hx, hy); c.rotate(Math.sin(T*2)*.15); c.fillStyle = '#c8a0b0'; c.fillRect(-3, 8, 6, 16); c.fillStyle = '#e8c0d0'; c.beginPath(); c.ellipse(0, 0, 13, 15, 0, 0, 7); c.fill(); const gq = c.createLinearGradient(-10, -12, 10, 12); gq.addColorStop(0, '#f8fcff'); gq.addColorStop(1, '#8ab8e0'); c.fillStyle = gq; c.beginPath(); c.ellipse(0, 0, 10, 12, 0, 0, 7); c.fill(); c.restore(); }
  if (stunned(B)) return;
  MIR_W.forEach((w, j) => { if (p.t < w || p.t > w + 1) return; c.save(); c.globalAlpha = .8; for (const [x, y] of mirrorSnips(B, p.seed + '.' + j)) warnCircle(c, x, y, 70, 42, (p.t - w), '200,230,255'); c.restore(); });
  MIR_W.forEach((w, j) => { const k = p.t - w - 1; if (k < 0 || k > .4) return; for (const [x, y] of mirrorSnips(B, p.seed + '.' + j)){ c.save(); c.globalAlpha = 1 - k/.4; drawSnip(c, x, y - 30, k < .12 ? .5 - k*4 : .02, 1.1, -.6 + (j % 2 ? .4 : 0)); c.strokeStyle = '#e0f0ff'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 50, y - 6); c.lineTo(x + 50, y + 6); c.stroke(); c.restore(); } });
}

// ===== ⑤ 이름 지키기 (노리는 몸) =====
const LW = 7.2, L_SC = .6, L_DUR = 6.3;
function letterWave(p){ for (let w = 0; w < 2; w++){ const a = .4 + w*LW; if (p.t >= a && p.t < a + L_SC + L_DUR + .4) return {w, a, s:p.seed + '.' + w, end:a + L_SC + L_DUR}; } return null; }
function nickPick(nick, n){ const ch = [...String(nick || '???')]; const idx = []; for (let i = 0; i < n; i++) idx.push(Math.floor(i*ch.length/n)); return {ch, idx}; }
function letterSpots(B, lw, n){ return geo(B, 'ls' + lw.s + n, () => { const r = B.rng(lw.s + 'P'), a0 = r()*6.283; return Array.from({length:n}, (_, i) => { const a = a0 + i*6.283/n + (r() - .5)*.6, rr = 220 + r()*110; return [cl(B.hx + Math.cos(a)*rr*1.25, X0 + 20, X1 - 20), cl(B.hy + Math.sin(a)*rr*.75, Y0, Y1 - 10)]; }); }); }
function tickLetters(B, p){
  const lw = letterWave(p); if (!lw) return; const lt = B.bs.lt && B.bs.lt.s === lw.s ? B.bs.lt : null;
  if (!lt){ if (B.target && p.t < lw.end) hostTx(B, 'lt' + lw.s, cur => { if (cur.lt && cur.lt.s === lw.s) return undefined; const tg = B.target, nk = tg.nick || B.targetNick, n = Math.min([...String(nk)].length, Math.max(2, Math.min(4, B.alive.length + 1))); return {...cur, lt:{s:lw.s, n, tu:tg.uid, tn:nk, st:Array(n).fill(0)}}; }); return; }
  if (once(B, 'lw' + lw.s)) B.sfx('warn', 0);
  const spots = letterSpots(B, lw, lt.n), tgt = byUid(B, lt.tu);
  if (B.host && p.t > lw.a + L_SC && p.t < lw.end){ const st = lt.st.slice(); let ch = false;
    st.forEach((v, i) => { if (v === 1) return; if (v === 0){ const [x, y] = spots[i]; const q = B.alive.find(q => Math.hypot(q.x - x, q.y - y) < 46); if (q){ st[i] = q.uid === lt.tu ? 1 : q.uid; ch = true; } return; }
      const cq = byUid(B, v); if (!cq || cq.down){ st[i] = 0; ch = true; return; } if (tgt && Math.hypot(cq.x - tgt.x, cq.y - tgt.y) < 72){ st[i] = 1; ch = true; } });
    if (ch) hostTx(B, 'ls' + lw.s + st.join(','), cur => cur.lt && cur.lt.s === lw.s ? {...cur, lt:{...cur.lt, st}} : undefined); }
  if (p.t >= lw.end && p.t < lw.end + .4){ const fail = lt.st.some(v => v !== 1);
    if (fail){ if (once(B, 'lf' + lw.s)){ B.sfx('slam', 0); local(B).sawFail.set(lw.s, B.now); } if (B.me && B.me.uid === lt.tu) B.hurt(dmg(B, 180), `lf${lw.s}`); if (B.host && once(B, 'lh' + lw.s)) B.heal(B.r.max*.02); }
    else if (once(B, 'lok' + lw.s)) B.sfx('hit', 0); }
}
function drawLettersFloor(B, c, p){ const lw = letterWave(p); if (!lw) return; const lt = B.bs.lt && B.bs.lt.s === lw.s ? B.bs.lt : null; if (!lt || p.t > lw.end) return; const T = B.now/1000, spots = letterSpots(B, lw, lt.n);
  spots.forEach(([x, y], i) => { if (lt.st[i] !== 0 || p.t < lw.a + L_SC) return; c.save(); c.globalAlpha = .35 + .2*Math.sin(T*5 + i); const q = c.createRadialGradient(x, y, 2, x, y, 46); q.addColorStop(0, 'rgba(255,200,225,.9)'); q.addColorStop(1, 'rgba(255,200,225,0)'); c.fillStyle = q; c.beginPath(); c.ellipse(x, y, 46, 28, 0, 0, 7); c.fill(); c.restore(); }); }
function drawLettersTop(B, c, p){ const lw = letterWave(p); if (!lw) return; const lt = B.bs.lt && B.bs.lt.s === lw.s ? B.bs.lt : null; if (!lt) return; const T = B.now/1000, spots = letterSpots(B, lw, lt.n), tgt = byUid(B, lt.tu), {ch, idx} = nickPick(lt.tn, lt.n);
  const fail = p.t >= lw.end && lt.st.some(v => v !== 1);
  if (tgt && p.t < lw.end + .4){ // 노리는 몸 이름표 (빠진 글자는 ?) · 새 이름표 꿰매는 실
    const shown = fail ? '몽실' : ch.map((cc, i) => { const j = idx.indexOf(i); return j >= 0 && lt.st[j] !== 1 ? '?' : cc; }).join(''), A = tagArt(shown, !fail && lt.st.every(v => v === 1));
    c.save(); c.globalAlpha = cl((lw.end + .4 - p.t)/.4 + (fail ? 1 : 0)); c.drawImage(A.img, tgt.x - A.w/2*1.1, tgt.y - 112, A.w*1.1, A.h*1.1); c.restore();
    const g = cl((p.t - lw.a - L_SC)/L_DUR); if (p.t < lw.end && g > 0){ const [bx, by] = bossPos(B); c.save(); c.strokeStyle = 'rgba(255,140,180,.6)'; c.lineWidth = 1.5; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(bx + 60, by - 120); c.quadraticCurveTo((bx + tgt.x)/2, Math.min(by, tgt.y) - 180, tgt.x, tgt.y - 100); c.stroke(); c.setLineDash([]);
      c.fillStyle = 'rgba(10,8,20,.85)'; c.fillRect(tgt.x - 40, tgt.y - 126, 80, 8); c.fillStyle = g > .75 ? '#ff4f7a' : '#ff8ab0'; c.fillRect(tgt.x - 40, tgt.y - 126, 80*g, 8); c.restore();
      drawNeedle(c, tgt.x + 44 + Math.sin(T*9)*6, tgt.y - 100 - Math.abs(Math.sin(T*9))*8, -.5, 46, false); } }
  if (p.t > lw.end) return;
  spots.forEach(([x, y], i) => { const v = lt.st[i], cc = ch[idx[i]] || '?';
    if (p.t < lw.a + L_SC){ if (!tgt) return; const u = (p.t - lw.a)/L_SC; text(c, cc, lerp(tgt.x, x, u), lerp(tgt.y - 100, y - 20, u) - Math.sin(u*Math.PI)*90, 34, '#ffd0e0'); return; }
    if (v === 0){ text(c, cc, x, y - 22 + Math.sin(T*4 + i)*4, 34, '#ffe0ec', 'center', 'rgba(120,20,60,.9)'); return; }
    if (v !== 1){ const q = byUid(B, v); if (q) text(c, cc, q.x + 22, q.y - 70 + Math.sin(T*6)*3, 28, '#ffe0ec', 'center', 'rgba(120,20,60,.9)'); } });
}

// ===== ⑥ 창고 실 줄다리기 (→ 기절) =====
function tugGeo(B, p){ return geo(B, 'tg' + p.seed, () => { const right = B.rng(p.seed + 'K')() < .5, sx = right ? 1 : -1; return {knot:[B.hx + sx*300, B.hy + 110], door:[B.hx + sx*390, WALL - 12], sx}; }); }
const TUG_A = .8, YANK = [2.0, 5.0, 8.0, 11.0];
const tugNeed = n => 6 + 5*Math.max(1, n);
const tugOk = (B, p) => B.bs.tg && B.bs.tg.s === p.seed && B.bs.tg.ok;
function tickTug(B, p){
  const G = tugGeo(B, p), bs = B.bs, l = local(B), short = String(B.hash(p.seed) % 100000);
  if (l.tug.s !== p.seed){ l.tug = {s:p.seed, n:0}; }
  // 호스트: 모두가 친 횟수를 더해 적어요 · 다 차면 문이 터지고 기절
  if (B.host && p.t > TUG_A && p.t < p.len - .3 && !tugOk(B, p)){ let n = 0; for (const q of B.all) if (q.bp && q.bp.s === short) n += q.bp.g | 0; const tg = bs.tg && bs.tg.s === p.seed ? bs.tg : null, need = tg?.need || tugNeed(B.alive.length);
    if (n !== (tg?.n | 0)){ const pz = bossPos(B), ok = n >= need; hostTx(B, 'tg' + p.seed + n, cur => { if (cur.tg && cur.tg.s === p.seed && cur.tg.ok) return undefined; const o = {...cur, tg:{s:p.seed, n, need, ok:ok ? 1 : 0}}; if (ok){ o.stun = B.now + 8000; o.sx = Math.round(pz[0]); o.sy = Math.round(pz[1]); } return o; }); } }
  if (tugOk(B, p) && once(B, 'tok' + p.seed)){ B.sfx('slam', 0); B.shake(); }
  if (tugOk(B, p) || stunned(B)) return; const m = meXY(B);
  YANK.forEach((w, j) => { if (w + 1.05 > p.len - .5 || p.t < w || p.t > w + 1.05) return; const key = p.seed + '.' + j; if (once(B, 'yw' + key)) B.sfx('warn', 0);
    if (p.t > w + .9){ if (once(B, 'ys' + key)) B.sfx('slam', 0); if (!m) return; const [bx, by] = bossPos(B), [kx, ky] = G.knot, d = segDist(m[0], m[1], bx, by, kx, ky);
      if (d.d < 34 && B.hurt(700, `yk${key}`, {raw:1})){ const nx = -(ky - by), ny = kx - bx, sg = (m[0] - d.x)*nx + (m[1] - d.y)*ny >= 0 ? 1 : -1; B.push(nx*sg, ny*sg, 70); } } });
}
function segDist(px, py, ax, ay, bx, by){ const vx = bx - ax, vy = by - ay, k = cl(((px - ax)*vx + (py - ay)*vy)/(vx*vx + vy*vy || 1)), x = ax + vx*k, y = ay + vy*k; return {d:Math.hypot(px - x, py - y), x, y}; }
function drawTugFloor(B, c, p){ const G = tugGeo(B, p), al = cl(p.t/.5)*cl((p.len + 3 - p.t)/.6), ok = tugOk(B, p), T = B.now/1000, [dx, dy] = G.door;
  c.save(); c.globalAlpha = al; // 창고 문 (벽)
  if (ok){ const k = cl((B.now - (geo(B, 'tdo' + p.seed, () => B.now)))/600); const q = c.createRadialGradient(dx, dy, 10, dx, dy + 40, 200); q.addColorStop(0, `rgba(255,250,220,${.55*k})`); q.addColorStop(1, 'rgba(255,250,220,0)'); c.fillStyle = q; c.fillRect(dx - 220, dy - 160, 440, 400); }
  c.fillStyle = ok ? '#0a0806' : '#2a3a34'; c.fillRect(dx - 45, dy - 150, 90, 150); c.strokeStyle = '#1a2420'; c.lineWidth = 4; c.strokeRect(dx - 45, dy - 150, 90, 150);
  if (!ok){ c.strokeStyle = '#1a2420'; for (let i = 0; i < 5; i++){ c.beginPath(); c.moveTo(dx - 45, dy - 130 + i*26); c.lineTo(dx + 45, dy - 126 + i*26); c.stroke(); } c.strokeStyle = '#f0e0e8'; c.lineWidth = 2; for (let i = 0; i < 7; i++){ c.beginPath(); c.moveTo(dx - 45 + hsh(i)*90, dy - 150); c.lineTo(dx - 45 + hsh(i + 9)*90, dy); c.stroke(); } }
  else { c.fillStyle = '#3a4a44'; c.save(); c.translate(dx + 45, dy); c.transform(1, -.3, 0, 1, 0, 0); c.fillRect(0, -150, 60, 150); c.restore(); }
  c.restore();
  if (ok || stunned(B)) return;
  YANK.forEach(w => { if (w + 1.05 > p.len - .5 || p.t < w || p.t > w + .9) return; const [bx, by] = bossPos(B); warnLine(c, bx, by, G.knot[0], G.knot[1], (p.t - w)/.9, 54, '255,170,200'); });
}
function drawTugTop(B, c, p){ const G = tugGeo(B, p), ok = tugOk(B, p), T = B.now/1000, [kx, ky] = G.knot, [bx, by] = bossPos(B), [dx, dy] = G.door, al = cl(p.t/.5)*cl((p.len - p.t)/.4);
  if (!ok && p.t < p.len){ const l = local(B), jig = l.hitAt && B.now - l.hitAt < 200 ? Math.sin(B.now/20)*5 : 0, ten = YANK.some(w => p.t > w + .9 && p.t < w + 1.1) ? 1 : 0;
    c.save(); c.globalAlpha = al; c.strokeStyle = ten ? '#ffffff' : '#f0e0e8'; c.lineWidth = ten ? 8 : 5; c.beginPath(); c.moveTo(bx + 60*G.sx, by - 130); c.quadraticCurveTo((bx + kx)/2, (by + ky)/2 - 60 + Math.sin(T*10)*6*(1 - ten), kx + jig, ky - 20); c.quadraticCurveTo((kx + dx)/2 + G.sx*40, (ky + dy)/2, dx - 30*G.sx, dy - 60); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(kx + jig, ky - 20, 24, 19, 0, 0, 7); const q = c.createRadialGradient(kx - 8, ky - 28, 2, kx, ky - 20, 26); q.addColorStop(0, '#ffffff'); q.addColorStop(1, '#e888b0'); c.fillStyle = q; c.fill(); c.strokeStyle = 'rgba(120,30,70,.6)'; c.lineWidth = 2; for (let i = 0; i < 3; i++){ c.beginPath(); c.arc(kx + jig, ky - 20, 8 + i*5, i, i + 2.4); c.stroke(); }
    const tg = B.bs.tg && B.bs.tg.s === p.seed ? B.bs.tg : null, need = tg?.need || tugNeed(B.alive.length), v = cl((tg?.n | 0)/need); c.fillStyle = 'rgba(10,20,16,.85)'; c.fillRect(kx - 50, ky - 62, 100, 10); const gq = c.createLinearGradient(kx - 50, 0, kx + 50, 0); gq.addColorStop(0, '#ff8ab0'); gq.addColorStop(1, '#9affd0'); c.fillStyle = gq; c.fillRect(kx - 50, ky - 62, 100*v, 10); c.restore(); }
  if (ok){ const k = (B.now - geo(B, 'tdo' + p.seed, () => B.now))/1000; if (k < 3.4){ text(c, '여기 있어요!', dx, dy + 30, 30, '#fff6c8', 'center'); if (k > 1.1) text(c, '내 이름은 민소윤!', dx - 20*G.sx, dy + 62, 30, '#fff6c8'); } }
}

// ===== ⑦ 실 감옥 =====
function prisonR(t, len){ if (t < 1) return 470; if (t < 13) return lerp(470, 150, ease((t - 1)/12)); if (t < len - 1.5) return 150; return lerp(150, 560, ease((t - (len - 1.5))/1.5)); }
function tickPrison(B, p){ if (once(B, 'pw' + p.seed)) B.sfx('warn', 0); if (p.t < 1.6 || p.t > p.len - 1.5) return; const m = meXY(B); if (!m) return; const [bx, by] = bossPos(B), r = prisonR(p.t, p.len) + 12;
  if (!inEll(m[0], m[1], bx, by, r, r*.6)) B.hurt(654, `pr${p.seed}.${Math.floor(p.t/1.4)}`, {raw:1}); }
function drawPrisonFloor(B, c, p){ const [bx, by] = bossPos(B), r = prisonR(p.t, p.len), al = cl(p.t/.8)*cl((p.len - p.t)/1.2);
  c.save(); c.globalAlpha = al; c.fillStyle = 'rgba(80,0,30,.42)'; c.beginPath(); c.rect(-200, 0, B.W + 400, B.H + 200); c.ellipse(bx, by, r, r*.6, 0, 0, 7); c.fill('evenodd'); c.restore(); }
function drawPrisonTop(B, c, p){ const [bx, by] = bossPos(B), r = prisonR(p.t, p.len), al = cl(p.t/.8)*cl((p.len - p.t)/1.2), T = B.now/1000, n = 32;
  c.save(); c.globalAlpha = al; c.lineWidth = 2;
  for (let i = 0; i < n; i++){ const a = i/n*6.283 + T*.2, a2 = a + 6.283/n, x = bx + Math.cos(a)*r, y = by + Math.sin(a)*r*.6, x2 = bx + Math.cos(a2)*r, y2 = by + Math.sin(a2)*r*.6;
    c.strokeStyle = i % 2 ? '#f0e0e8' : '#e888b0'; for (const h of [8, 26]){ c.beginPath(); c.moveTo(x, y - h); c.lineTo(x2, y2 - h); c.stroke(); }
    c.strokeStyle = '#c8c8d4'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 34); c.stroke(); c.fillStyle = '#e8e8f0'; c.beginPath(); c.arc(x, y - 35, 3.5, 0, 7); c.fill(); }
  c.restore(); }

// ===== 보스 몸 · 꼭두각시 실 =====
function pose(B){ const [x, y] = bossPos(B), v = bossVel(B), sp = cl(Math.hypot(v[0], v[1])/90), T = B.now/1000, q = Math.floor(T*11);
  const rot = sp*(.11*Math.sin(T*17) + .06*Math.sign(v[0]) + (hsh(q) - .5)*.12) + Math.sin(T*1.3)*.012;
  return {x, y, v, sp, rot, ox:sp*(hsh(q + 7) - .5)*14, oy:-sp*(Math.abs(Math.sin(T*8.5))*14 + hsh(q + 3)*6), px:x, py:y - 150}; }
const poseXf = (P, lx, ly) => { const dx = lx - P.px, dy = ly - P.py, c = Math.cos(P.rot), s = Math.sin(P.rot); return [P.px + dx*c - dy*s + P.ox, P.py + dx*s + dy*c + P.oy]; };
const U = (P, u, v) => [P.x + u*S, P.y + (v - FOOT_U)*S];   // 그림 단위 → 월드
function variant(B, p){ if (B.phase >= 3 || (B.phase === 2 && B.ph2 >= 1.9)) return 'half'; if (p.id === 'freeze' && p.t > .4 && p.t < p.len - .3 && !lookNow(p)?.look) return 'back'; return 'front'; }
function drawThreads(B, c, P, half){ const T = B.now/1000, hx = half ? 136 : 202, pts = [[0, -240], [-81, -212], [81, -212], [-hx, 96], [hx, 96]], a = .22 + .6*P.sp; c.save();
  pts.forEach(([u, v], i) => { const [lx, ly] = U(P, u, v), [ex, ey] = poseXf(P, lx, ly), tx = ex - P.v[0]*.35 + (i - 2)*14 + Math.sin(T*.7 + i)*6, ty = P.y - 620, vib = P.sp*Math.sin(T*60 + i*2)*3;
    c.globalAlpha = a; c.strokeStyle = half ? '#ffb0c8' : '#f4eef8'; c.lineWidth = 1.3 + P.sp*1.2; c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo((tx + ex)/2 + vib, (ty + ey)/2, ex, ey); c.stroke();
    if (P.sp > .15){ c.globalAlpha = a*.35; c.lineWidth = 5; c.strokeStyle = half ? '#ff5a8a' : '#c8d8ff'; c.stroke(); }
    const k = (T*(.4 + P.sp*1.4) + i*.21) % 1; c.globalAlpha = a*(.6 + P.sp*.4); c.fillStyle = '#fff'; c.beginPath(); c.arc(lerp(ex, tx, k), lerp(ey, ty, k), 2.2, 0, 7); c.fill();
    c.globalAlpha = Math.min(1, a + .2); c.fillStyle = half ? '#ff7aa0' : '#e8e0f0'; c.beginPath(); c.arc(ex, ey, 3, 0, 7); c.fill(); }); c.restore(); }
function drawStrands(B, c, P){ const T = B.now/1000; c.save(); c.lineCap = 'round';
  for (let k = 0; k < 12; k++){ let x = (hsh(k) - .5)*240, y = -40 + hsh(k + 30)*200; const [sx, sy] = U(P, x, y); c.strokeStyle = ['#f6f0ea', '#f0c8d8', '#e8e0f0'][k % 3]; c.lineWidth = 1.2 + hsh(k + 60)*1.2; c.globalAlpha = .85; c.beginPath(); c.moveTo(sx, sy);
    for (let t = 0; t < 6; t++){ const nx = x + (hsh(k*7 + t) - .5)*70 + Math.sin(T*2.2 + k + t*.7)*14*t/4, ny = y - 40 - hsh(k*5 + t)*30, mx = x + (hsh(k*3 + t + 90) - .5)*80; const [ax, ay] = U(P, mx, (y + ny)/2), [bx, by] = U(P, nx, ny); c.quadraticCurveTo(ax, ay, bx, by); x = nx; y = ny; } c.stroke(); } c.restore(); }
function drawBoss(B, c){
  const p = pk(B), P = pose(B), T = B.now/1000, v = variant(B, p), A = bossArt(v), sc = S/A.k, half = v === 'half';
  shadow(c, P.x, P.y + 4, 74, 22, .45);
  c.save(); let sh = 0; if (transOn(B) && B.ph2 < 2.2) sh = Math.sin(T*70)*6*(1 - B.ph2/2.2); if (stunned(B)) sh += Math.sin(T*3)*6;
  c.translate(P.px + P.ox + sh, P.py + P.oy); c.rotate(P.rot); c.translate(-P.px, -P.py);
  c.drawImage(A.img, P.x + A.x0*S, P.y + (A.y0 - FOOT_U)*S, A.img.width*sc, A.img.height*sc);
  if (half) drawStrands(B, c, P);
  const lk = lookNow(p); if (lk?.look){ for (const s2 of [-1, 1]){ const [ex, ey] = U(P, s2*28, -156); c.fillStyle = `rgba(255,40,90,${.7 + .3*Math.sin(T*20)})`; c.beginPath(); c.arc(ex, ey, 4, 0, 7); c.fill(); c.globalAlpha = .4; c.beginPath(); c.arc(ex, ey, 9, 0, 7); c.fill(); c.globalAlpha = 1; } }
  if (v === 'back'){ for (let i = 0; i < 2; i++){ const k = (T*.7 + i*.5) % 1; c.globalAlpha = 1 - k; text(c, '♪', P.x + 40 + i*24 + Math.sin(T*3 + i)*10, P.y - 230 - k*50, 26, '#e0f0e8'); } c.globalAlpha = 1; }
  c.restore();
  drawThreads(B, c, P, half);
}

// ===== 50% 변신: 거대한 바늘이 화면을 꿰매고 → 실밥이 터지며 화면이 천처럼 찢겨 벌어져요 · 이름표가 흩날려요 =====
const NDL0 = .1, NDL1 = 1.45, POP0 = 1.4, POP1 = 1.95, SEAM_N = 34, SEAM_A = .4;
function seamOpen(h, mx){ if (h < 1.55) return 0; if (h < 2.6) return mx*ease((h - 1.55)/1.05); if (h < 3.5) return mx + Math.sin((h - 2.6)*5)*6; if (h < 4.7) return lerp(mx, 4, ease((h - 3.5)/1.2)); return 4; }
let seamC = {w:0, h:0};
function seam(w, h){ if (seamC.w === w && seamC.h === h) return seamC; const d = [Math.cos(SEAM_A), Math.sin(SEAM_A)], nr = [-Math.sin(SEAM_A), Math.cos(SEAM_A)], c0 = [w/2, h*.46], L = Math.hypot(w, h)*.62, pts = [];
  for (let i = 0; i <= SEAM_N; i++){ const s = -L + 2*L*i/SEAM_N, z = (i % 2 ? 1 : -1)*18 + (hsh(i)*8 - 4); pts.push([c0[0] + d[0]*s + nr[0]*z, c0[1] + d[1]*s + nr[1]*z]); }
  return (seamC = {w, h, d, nr, pts, c0, L}); }
function drawTrans(B, c, w, h){
  const t = B.ph2, T = B.now/1000, Sm = seam(w, h), {pts, nr, d} = Sm, o = seamOpen(t, Math.min(110, h*.13)), fadeAll = cl((5.4 - t)/.7);
  c.save(); c.globalAlpha = fadeAll;
  if (o > .5){ const side = (sg) => pts.map(([x, y], i) => { const r = hsh(i + 50)*o*.35; return [x + nr[0]*sg*(o/2 + r), y + nr[1]*sg*(o/2 + r)]; }), A = side(-1), Bq = side(1);
    tint(c, w, h, '#030104', .35*cl(o/50));
    c.beginPath(); A.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); for (let i = Bq.length - 1; i >= 0; i--) c.lineTo(Bq[i][0], Bq[i][1]); c.closePath(); c.fillStyle = '#050106'; c.fill();
    c.save(); c.clip(); const gl = c.createRadialGradient(Sm.c0[0], Sm.c0[1], 10, Sm.c0[0], Sm.c0[1], Sm.L); gl.addColorStop(0, `rgba(140,10,45,${.5*cl(o/60)})`); gl.addColorStop(1, 'rgba(40,0,10,.2)'); c.fillStyle = gl; c.fillRect(0, 0, w, h);
      if (o > 24) for (let i = 0; i < 9; i++){ const s = -Sm.L*.8 + i*Sm.L*.2, ex = Sm.c0[0] + d[0]*s, ey = Sm.c0[1] + d[1]*s + (hsh(i) - .5)*o*.3, bl = Math.sin(T*3 + i*1.7) > -.85 ? 1 : .1; c.globalAlpha = fadeAll*cl((o - 24)/40)*bl*.95; c.fillStyle = '#ff3060'; c.beginPath(); c.ellipse(ex - 6, ey, 3.5, 2, 0, 0, 7); c.ellipse(ex + 6, ey, 3.5, 2, 0, 0, 7); c.fill(); }
      c.globalAlpha = fadeAll; c.strokeStyle = 'rgba(240,210,225,.5)'; c.lineWidth = 1.2; for (let i = 1; i < SEAM_N; i += 2){ const [x, y] = pts[i], ww = o/2 + 10; c.beginPath(); c.moveTo(x - nr[0]*ww, y - nr[1]*ww); c.quadraticCurveTo(x + d[0]*10*Math.sin(T*2 + i), y + 16 + Math.sin(T*2.4 + i)*6, x + nr[0]*ww, y + nr[1]*ww); c.stroke(); } c.restore();
    const pk2 = cl(o/100); for (const [E, sg] of [[A, -1], [Bq, 1]]) for (let i = 0; i < SEAM_N; i++){ const a = E[i], b = E[i + 1], curl = (8 + hsh(i*3 + (sg > 0 ? 1 : 2))*24)*pk2 + 3, m = [(a[0] + b[0])/2 + nr[0]*sg*curl, (a[1] + b[1])/2 + nr[1]*sg*curl];
      c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(m[0] + nr[0]*sg*6, m[1] + nr[1]*sg*6); c.lineTo(b[0], b[1]); c.fill();
      c.fillStyle = i % 2 ? '#6a3a4a' : '#8a5060'; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(m[0], m[1], b[0], b[1]); c.fill(); c.strokeStyle = 'rgba(240,200,215,.55)'; c.lineWidth = 1; c.stroke(); } }
  // 바늘땀 (터지기 전엔 팽팽한 실) · 톡 톡 터져요 · 아문 뒤엔 희미한 크로스 스티치
  if (t < POP1 + .2){ const shown = t < NDL1 ? (t - NDL0)/(NDL1 - NDL0) : 1; c.lineCap = 'round';
    for (let i = 0; i < SEAM_N; i++){ if (i/SEAM_N > shown) break; const pop = POP0 + Math.abs(i - SEAM_N/2)/(SEAM_N/2)*(POP1 - POP0 - .1);
      if (t > pop){ if (t < pop + .35){ const k = (t - pop)/.35, [x, y] = pts[i]; c.globalAlpha = fadeAll*(1 - k); c.strokeStyle = '#fff0f6'; c.lineWidth = 2; for (let j = 0; j < 5; j++){ const a = j*1.256 + i; c.beginPath(); c.moveTo(x + Math.cos(a)*18*k, y + Math.sin(a)*18*k); c.lineTo(x + Math.cos(a)*44*k, y + Math.sin(a)*44*k); c.stroke(); } if (i % 5 === 0) text(c, '톡', x, y - 16 - k*20, 22, '#ffd0e0'); c.globalAlpha = fadeAll; } continue; }
      const tight = t > POP0 - .4 ? Math.sin(T*80 + i)*1.5 : 0; c.strokeStyle = '#ff6a9a'; c.lineWidth = 5; c.beginPath(); c.moveTo(pts[i][0], pts[i][1] + tight); c.lineTo(pts[i + 1][0], pts[i + 1][1] - tight); c.stroke(); c.strokeStyle = 'rgba(255,230,240,.8)'; c.lineWidth = 1.5; c.stroke(); c.fillStyle = '#2a0a14'; c.beginPath(); c.arc(pts[i][0], pts[i][1], 3, 0, 7); c.fill(); } }
  else if (t > 4.2){ c.globalAlpha = fadeAll*cl((t - 4.2)/.6)*.45; c.strokeStyle = '#ff9ab8'; c.lineWidth = 2; for (let i = 1; i < SEAM_N; i += 2){ const [x, y] = pts[i], s = 9; c.beginPath(); c.moveTo(x - d[0]*s - nr[0]*s, y - d[1]*s - nr[1]*s); c.lineTo(x + d[0]*s + nr[0]*s, y + d[1]*s + nr[1]*s); c.moveTo(x + d[0]*s - nr[0]*s, y + d[1]*s - nr[1]*s); c.lineTo(x - d[0]*s + nr[0]*s, y - d[1]*s + nr[1]*s); c.stroke(); } c.globalAlpha = fadeAll; }
  // 거대한 바늘: 지그재그로 화면을 가로질러요
  if (t > NDL0 - .3 && t < NDL1 + .4){ const u = cl((t - NDL0)/(NDL1 - NDL0)), f = u*SEAM_N, i = Math.min(SEAM_N - 1, Math.floor(f)), k = f - i, a = pts[i], b = pts[i + 1];
    const tip = t < NDL0 ? [pts[0][0] - d[0]*300*(NDL0 - t)/.3, pts[0][1] - d[1]*300*(NDL0 - t)/.3] : t > NDL1 ? [pts[SEAM_N][0] + d[0]*900*(t - NDL1), pts[SEAM_N][1] + d[1]*900*(t - NDL1)] : [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
    const ang = SEAM_A + (t > NDL0 && t < NDL1 ? (i % 2 ? -.35 : .35) : 0), Ln = Math.min(420, w*.8);
    for (let gh = 3; gh >= 1; gh--){ c.globalAlpha = fadeAll*.12; drawNeedle(c, tip[0] - d[0]*gh*40, tip[1] - d[1]*gh*40, ang, Ln, false); } c.globalAlpha = fadeAll; drawNeedle(c, tip[0], tip[1], ang, Ln, true);
    c.save(); c.translate(tip[0], tip[1]); c.rotate(ang); c.strokeStyle = '#ff6a9a'; c.lineWidth = 5; c.beginPath(); c.moveTo(-Ln + 34, 0); c.bezierCurveTo(-Ln - 60, 60 + Math.sin(T*9)*20, -Ln - 160, -40, -Ln - 260, 30 + Math.sin(T*7)*30); c.stroke(); c.restore();
    if (t > NDL0 && t < NDL1 && Math.floor(f*2) % 2 === 0){ c.fillStyle = 'rgba(255,240,250,.45)'; c.beginPath(); c.arc(tip[0], tip[1], 14, 0, 7); c.fill(); } }
  // 이름표 수십 장이 떨어져 날려요
  if (t > 1.45){ for (let i = 0; i < 30; i++){ const t0 = 1.5 + hsh(i + 200)*.5, k = t - t0; if (k < 0) continue; const sky = i % 3 === 0;
      const x0 = sky ? w*(.05 + hsh(i + 300)*.9) : w/2 + (hsh(i + 400) - .5)*w*.3, y0 = sky ? h*.2 - hsh(i + 500)*h*.15 : h*.46 + (hsh(i + 600) - .5)*h*.1, vx = sky ? (hsh(i + 700) - .5)*60 : (hsh(i + 700) - .5)*w*1.3, vy = sky ? 0 : -h*.3 - hsh(i + 800)*h*.3, fall = h*(.07 + hsh(i + 900)*.06);
      const dr = 1 - Math.exp(-k*1.6), x = x0 + vx*dr/1.6 + Math.sin(k*3 + i)*30, y = Math.min(h*.95, y0 + vy*dr/1.6 + fall*k*k*.5 + 40*k), al = cl((5.4 - t)/1)*cl(k*6), A = tagArt(NAMES[i % NAMES.length]), s = .6 + hsh(i + 77)*.35;
      c.save(); c.globalAlpha = al; c.translate(x, y); c.rotate(Math.sin(k*4 + i)*.7 + i); c.scale(Math.cos(k*5 + i)*s, s); c.drawImage(A.img, -A.w/2, -A.h/2, A.w, A.h); c.restore(); } }
  c.globalAlpha = fadeAll;
  if (t > 1.4 && t < 4.4){ const k = t - 1.4, a = Math.sin(Math.min(1, k/3)*Math.PI)*(.55 + .2*Math.sin(T*14)); const vg = c.createRadialGradient(w/2, h*.5, Math.min(w, h)*.25, w/2, h*.5, Math.hypot(w, h)*.6); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(140,0,40,${a})`); c.fillStyle = vg; c.fillRect(0, 0, w, h); }
  if (t > 1.7 && t < 2.5){ c.globalAlpha = (1 - (t - 1.7)/.8)*.85; c.fillStyle = '#ffe0ec'; c.fillRect(0, 0, w, h); }
  c.restore();
}

// ===== 화면 가장자리: 화면 밖 글자 · 매듭 표시 =====
function edgeMark(B, c, w, h, x, y, draw){ const [sx, sy] = B.toScreen(x, y), m = 26; if (sx > m && sx < w - m && sy > m + 60 && sy < h - m - 80) return; const cx = cl(sx, m, w - m), cy = cl(sy, m + 60, h - m - 80); draw(cx, cy, Math.atan2(sy - cy, sx - cx)); }
function arrow(c, x, y, a, col){ c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = col; c.beginPath(); c.moveTo(22, 0); c.lineTo(10, -8); c.lineTo(10, 8); c.closePath(); c.fill(); c.restore(); }

export default {
  reach: 125,
  height: 222,
  pushMul(B){ return pk(B).id === 'prison' ? .3 : 1; }, // 실 감옥 동안 밀쳐 내기는 살짝만 (울타리 밖으로 튕겨 나가지 않게)
  pos(B){ arena(B); return bossPos(B); },
  tick(B, dt){
    arena(B);
    const p = pk(B), l = local(B);
    // 대사 · 소리 (모두 같은 때에)
    const LINES = {freeze:'♪ 흥얼흥얼…', tether:'치수 좀 잴게요', spool:'실이 엉켰네요', mirror:'웃는 법… 이렇게요?', letters:'이름표 달아 드릴까요? 무슨 이름으로요?', tug:'창고는… 보여 드리기 좀 그래요', prison:'여기서는 아무도 못 나가요. 41 일 동안요.'};
    if (p.id && LINES[p.id] && p.t < 1 && once(B, 'say' + p.seed)) B.say(LINES[p.id], 2400);
    if (p.id === 'trans'){ if (once(B, 'tr0')){ B.sfx('warn', 0); } if (p.t > 1.4 && once(B, 'tr1')){ B.sfx('slam', 0); B.shake(); } if (p.t > 2.4 && once(B, 'tr2')) B.say(`${B.target?.nick || B.targetNick} 님 치수는 다 재 뒀어요`, 2800); }
    if (p.id === 'freeze'){ const lk = lookNow(p); if (lk?.cue && once(B, 'fcs' + p.seed + lk.i)) B.say('몽…실…아…', 700); if (lk?.look && once(B, 'fls' + p.seed + lk.i)) B.say('몽실아~!', 1500); }
    if (stunned(B) && once(B, 'st' + B.bs.stun)) B.say('…그 이름 부르지 마요', 2400);
    tickBa(B);
    if (p.id === 'freeze') tickFreeze(B, p);
    else if (p.id === 'tether') tickTether(B, p);
    else if (p.id === 'spool') tickSpool(B, p);
    else if (p.id === 'mirror') tickMirror(B, p);
    else if (p.id === 'letters') tickLetters(B, p);
    else if (p.id === 'tug') tickTug(B, p);
    else if (p.id === 'prison') tickPrison(B, p);
    if (p.id !== 'tug' && l.bpOn){ B.setBp(null); l.bpOn = false; }
  },
  swing(B, cx, cy){
    const p = pk(B);
    if (p.id === 'freeze'){ const lk = lookNow(p); if (lk?.look && B.me) stitchMe(B, p.seed + '.' + lk.i); return false; }
    if (p.id === 'tug' && p.t > TUG_A && p.t < p.len - .3 && !tugOk(B, p)){ const [kx, ky] = tugGeo(B, p).knot; if (Math.hypot(cx - kx, cy - (ky - 10)) < 80){ const l = local(B); if (l.tug.s !== p.seed) l.tug = {s:p.seed, n:0};
      l.tug.n++; l.hitAt = B.now; l.bpOn = true; B.setBp({s:String(B.hash(p.seed) % 100000), g:l.tug.n}); B.sfx('hit', 60); B.fx('+1', kx + (Math.random() - .5)*40, ky - 60, '#9affd0'); return true; } }
    return false;
  },
  drawFloor(B, c){
    const p = pk(B);
    if (p.id === 'spool') drawSpoolsFloor(B, c, p);
    else if (p.id === 'mirror') drawMirrorFloor(B, c, p);
    else if (p.id === 'letters') drawLettersFloor(B, c, p);
    else if (p.id === 'tug') drawTugFloor(B, c, p);
    else if (p.id === 'prison') drawPrisonFloor(B, c, p);
    drawBaFloor(B, c);
  },
  drawBody(B, c){ drawBoss(B, c); },
  drawTop(B, c){
    const p = pk(B);
    if (p.id === 'tether') drawTether(B, c, p);
    else if (p.id === 'spool') drawSpoolsTop(B, c, p);
    else if (p.id === 'mirror') drawMirrorTop(B, c, p);
    else if (p.id === 'letters') drawLettersTop(B, c, p);
    else if (p.id === 'tug') drawTugTop(B, c, p);
    else if (p.id === 'prison') drawPrisonTop(B, c, p);
    drawBaTop(B, c);
  },
  drawScreen(B, c, w, h){
    const p = pk(B), T = B.now/1000;
    if (p.id === 'trans'){ drawTrans(B, c, w, h); return; }
    if (p.id === 'freeze'){ const lk = lookNow(p); if (lk?.look) tint(c, w, h, '#ff2060', .12 + .04*Math.sin(T*10)); }
    if (p.id === 'prison' && B.me && !B.me.down && p.t > 1.6 && p.t < p.len - 1.5){ const [bx, by] = bossPos(B), r = prisonR(p.t, p.len) + 12; if (!inEll(B.me.x, B.me.y, bx, by, r, r*.6)){ const vg = c.createRadialGradient(w/2, h/2, Math.min(w, h)*.3, w/2, h/2, Math.hypot(w, h)*.6); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(160,0,40,${.45 + .15*Math.sin(T*8)})`); c.fillStyle = vg; c.fillRect(0, 0, w, h); } }
    if (p.id === 'letters'){ const lw = letterWave(p), lt = lw && B.bs.lt && B.bs.lt.s === lw.s ? B.bs.lt : null; if (lt && p.t > lw.a + L_SC && p.t < lw.end){ const sp = letterSpots(B, lw, lt.n), {ch, idx} = nickPick(lt.tn, lt.n);
      sp.forEach(([x, y], i) => { if (lt.st[i] !== 0) return; edgeMark(B, c, w, h, x, y, (ex, ey, a) => { arrow(c, ex, ey, a, 'rgba(255,170,205,.9)'); text(c, ch[idx[i]] || '?', ex - Math.cos(a)*6, ey - Math.sin(a)*6, 26, '#ffe0ec', 'center', 'rgba(120,20,60,.9)'); }); });
      const tg = byUid(B, lt.tu); if (tg && B.me && tg.uid !== B.me.uid && lt.st.some(v => v === B.me.uid)) edgeMark(B, c, w, h, tg.x, tg.y - 40, (ex, ey, a) => arrow(c, ex, ey, a, 'rgba(255,90,140,.95)')); } }
    if (p.id === 'tug' && !tugOk(B, p) && p.t < p.len - .3){ const [kx, ky] = tugGeo(B, p).knot; edgeMark(B, c, w, h, kx, ky - 20, (ex, ey, a) => { arrow(c, ex, ey, a, 'rgba(240,224,232,.9)'); c.fillStyle = '#e888b0'; c.beginPath(); c.arc(ex - Math.cos(a)*4, ey - Math.sin(a)*4, 7, 0, 7); c.fill(); }); }
    if (p.id === 'mirror'){ const own = mirrorOwner(B, p); if (own && B.me && own.uid !== B.me.uid) edgeMark(B, c, w, h, own.x, own.y - 40, (ex, ey, a) => arrow(c, ex, ey, a, 'rgba(200,230,255,.9)')); }
  },
};
