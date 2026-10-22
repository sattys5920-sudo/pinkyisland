// 하나??? (백하은) · 맑은 밤의 번개 사건 · 규칙은 docs/BOSS_ENGINE.md
import { pick, beat, warnCircle, cl, lerp, ease, dist, inEll, text } from './kit.js';
import { drawFox, flame, printShape, glow, puff, drawBurn, hsh, HAND, SPOUT, CHEST, TOP } from './hana_art.js';

// ===== 차례 =====
const P = {
  1: [{id:'fuse', len:14}, {id:'bolt', len:11}, {id:'smoke', len:12}],
  2: [{id:'plow', len:12}, {id:'spread', len:13}, {id:'relay', len:16}],
  3: [{id:'match', len:14}],
};
const OPT = {gap:2.5, trans:5};
// 패턴마다 보스가 돌아다니는 세기 (바닥을 피해야 하는 패턴일수록 덜 움직여요)
const LV = {fuse:.3, bolt:.35, smoke:.6, trans:0, plow:.12, spread:.8, relay:.45, match:.5};
let X0 = 90, X1 = 1010, Y0 = 255, Y1 = 810, TROUGH = [[330, 715], [770, 715]]; // 걸을 수 있는 바닥 (보스 집 자리 기준 · arena(B) 가 맞춰요)
function arena(B){ const hx = B.hx, hy = B.hy; X0 = Math.max(20, hx - 460); X1 = Math.min((B.W || 1100) - 20, hx + 460); Y0 = Math.max(20, hy - 305); Y1 = Math.min((B.H || 900) - 20, hy + 250); TROUGH = [[hx - 220, Y1 - 95], [hx + 220, Y1 - 95]]; }
const PI = Math.PI;

// ===== 내 화면에만 있는 값 (모두에게 같은 장면은 B 로만 정해요) =====
const L = {txAt:0, ring:{}, mt:{}, rf:{}, once:{}, br:100, brSeed:'', prev:null, rlAcc:0, rlSeed:''};
const once = key => { if (L.once[key]) return false; L.once[key] = 1; return true; };
function tidy(){ for (const o of [L.ring, L.mt, L.once, L.rf]){ const ks = Object.keys(o); if (ks.length > 300) for (const k of ks.slice(0, 150)) delete o[k]; } }
function tx(B, fn){ const n = performance.now(); if (n - L.txAt < 350) return false; L.txAt = n; B.tx(fn); return true; }

// ===== 시각 · 자리 =====
function ctxAt(B, now){ const r = B.r, ph = r.lowAt && now >= r.lowAt ? 3 : r.rageAt && now >= r.rageAt ? 2 : 1, ps = ph === 3 ? r.lowAt : ph === 2 ? r.rageAt : r.bossAt;
  return {r, bs:B.bs, now, t:(now - (r.bossAt || now))/1000, phase:ph, pt:(now - (ps || now))/1000, ph2:r.rageAt && now >= r.rageAt ? (now - r.rageAt)/1000 : -1, hx:B.hx, hy:B.hy}; }
let CUR = null, CURk = '';
function cur(B){ const k = B.now + ':' + B.phase + ':' + (B.r.bossAt || 0); if (CURk !== k){ CURk = k; CUR = pick(B, P, OPT); } return CUR; }
function rawAmp(C){ const p = pick(C, P, OPT); if (!p.id) return 1; return lerp(1, LV[p.id] ?? 1, Math.min(cl(p.t/.6), cl((p.len - p.t)/.6))); }
function amp(C){ let a = rawAmp(C); if (C.phase > 1 && C.pt < .6){ const ps = C.phase === 3 ? C.r.lowAt : C.r.rageAt; a = lerp(rawAmp(ctxAt({r:C.r, bs:C.bs, hx:C.hx, hy:C.hy}, ps - 1)), a, C.pt/.6); } return a; }
function basePos(C){ const a = amp(C), t = C.t; return [C.hx + a*(Math.cos(t*.42)*125 + Math.sin(t*1.07)*30), C.hy + a*(Math.sin(t*.61)*44 + Math.sin(t*1.3)*10)]; }
function posAt(B, now){ const C = ctxAt(B, now); let p = basePos(C); const bs = B.bs;
  if (bs.stunAt && now >= bs.stunAt && now < bs.stun + 600){ const q = basePos(ctxAt(B, bs.stunAt)), w = cl((now - bs.stunAt)/300)*cl((bs.stun + 600 - now)/600); p = [lerp(p[0], q[0], w), lerp(p[1], q[1], w)]; }
  return p; }
const stunned = B => B.bs.stun > B.now;
const hot = B => B.bs.hot > B.now;

// ===== 기본 공격: 성냥 불꽃 고리 (도넛 · 가운데만 안전) =====
const RIN = 40, ROUT = 100, RSQ = .55, RDMG = 20;
function rings(B){ const p = cur(B); if (p.id === 'trans' || !B.alive.length) return [];
  const bt = beat(B, 3.4), out = [];
  for (const m of [bt.n - 1, bt.n]){ const k = B.t - m*bt.len; if (k < 0 || k > 1.7) continue;
    const cnt = B.phase === 2 ? Math.min(2, B.alive.length) : 1;
    for (let i = 0; i < cnt; i++){ const key = `${B.r.bossAt}.${B.phase}.${m}.${i}`;
      if (!L.ring[key]){ if (k > .5 || stunned(B)){ L.ring[key] = 'x'; continue; }
        const n = B.alive.length, base = Math.floor(B.rng(`${B.r.bossAt}.${B.phase}.${m}.tg`)()*n), pl = B.alive[(base + i) % n], a = B.rng(key)()*PI*2; L.ring[key] = [pl.x + Math.cos(a)*55, pl.y + Math.sin(a)*55*RSQ, m]; } // 고리마다 노리는 사람을 무작위로 (둘이면 서로 다른 사람)
      const c = L.ring[key]; if (c === 'x') continue; out.push({key, x:c[0], y:c[1], k}); } }
  return out; }
const inDonut = (x, y, r) => { const d = Math.hypot(x - r.x, (y - r.y)/RSQ); return d > RIN && d < ROUT; };

// ===== ① 등유 도화선 =====
const FUSE_W = 46, BURN = 2.2;
let FU = null, FUk = '';
function fuses(B, p){ if (FUk === p.seed) return FU; FUk = p.seed; const R = B.rng(p.seed + 'f'), dir = R() < .5 ? 1 : -1, ph = R()*6, m = R() < .5 ? 1 : -1, hx = B.hx, hy = B.hy;
  const A = []; for (let i = 0; i < 9; i++) A.push([hx + dir*(-400 + i*100), cl(hy + 70 + Math.sin(i*1.25 + ph)*50 + (R() - .5)*30, Y0 + 30, Y1 - 20)]);
  const Bp = [[hx + m*390, Y1 - 30], [hx + m*270, hy + 120], [hx + m*150, hy + 15], [hx + m*20, hy - 60], [hx - m*120, hy - 25], [hx - m*240, hy + 70], [hx - m*350, Y1 - 50]];
  FU = [{pts:A, pour:[.4, 3.4], lit:4.0, run:3.0}, {pts:Bp, pour:[7.4, 8.6], lit:9.0, run:1.8}];
  for (const F of FU){ F.len = [0]; for (let i = 1; i < F.pts.length; i++) F.len.push(F.len[i - 1] + dist(...F.pts[i], ...F.pts[i - 1])); F.L = F.len[F.len.length - 1]; }
  return FU; }
function fuseAt(F, s){ const d = cl(s)*F.L; for (let i = 1; i < F.pts.length; i++) if (d <= F.len[i]){ const u = (d - F.len[i - 1])/(F.len[i] - F.len[i - 1] || 1); return [lerp(F.pts[i - 1][0], F.pts[i][0], u), lerp(F.pts[i - 1][1], F.pts[i][1], u)]; } return F.pts[F.pts.length - 1]; }
function fuseNear(F, x, y){ let best = 1e9, bs = 0; for (let i = 1; i < F.pts.length; i++){ const [ax, ay] = F.pts[i - 1], [bx, by] = F.pts[i], vx = bx - ax, vy = by - ay, l2 = vx*vx + vy*vy || 1, u = cl(((x - ax)*vx + (y - ay)*vy)/l2), px = ax + vx*u, py = ay + vy*u, d = Math.hypot(x - px, y - py);
    if (d < best){ best = d; bs = (F.len[i - 1] + u*(F.len[i] - F.len[i - 1]))/F.L; } } return [best, bs]; }

// ===== ② 맑은 날 번개 (표시가 뜬 쪽이 안전) =====
const BOLT_T = [1.0, 4.4, 7.8], BOLT_D = 1.6;
function boltZones(B, p, j){ const R = B.rng(p.seed + 'b' + j), safeA = R() < .5, hx = B.hx, sy = B.hy + 30;
  const z = j === 2 ? [[X0, Y0, X1, sy], [X0, sy, X1, Y1]] : [[X0, Y0, hx, Y1], [hx, Y0, X1, Y1]];
  return safeA ? {safe:z[0], bad:z[1]} : {safe:z[1], bad:z[0]}; }
const inRect = (x, y, z) => x >= z[0] && x <= z[2] && y >= z[1] && y <= z[3];

// ===== ③ 헛간 연기 (숨 게이지 · 맑은 공기 방울) =====
const BUB = 85;
function smokeA(p){ return cl((p.t - .3)/.8)*cl((p.len - .4 - p.t)/.6); }
function bubbles(B, p){ const a0 = B.rng(p.seed + 's')()*PI*2, out = [];
  for (let i = 0; i < 2; i++){ const a = a0 + p.t*.32 + i*PI; out.push([cl(B.hx + Math.cos(a)*230, X0 + 120, X1 - 120), cl(B.hy + 40 + Math.sin(a)*150, Y0 + 90, Y1 - 50)]); } return out; }

// ===== ④ 밭고랑 벽 (솟아오르는 벽 · 틈) =====
const GAP = 120;
let RI = null, RIk = '';
function ridges(B, p){ if (RIk === p.seed) return RI; RIk = p.seed; const R = B.rng(p.seed + 'r'), gx = () => X0 + 130 + R()*(X1 - X0 - 260), gy = () => Y0 + 90 + R()*(Y1 - Y0 - 160);
  RI = [{warn:.4, up:1.2, down:6.4, w:[{o:'h', c:B.hy + 80, g:gx()}, {o:'h', c:B.hy - 75, g:gx()}]},
        {warn:5.8, up:6.6, down:11.6, w:[{o:'v', c:B.hx - 125, g:gy()}, {o:'v', c:B.hx + 125, g:gy()}]}]; return RI; }
const wallD = (w, x, y) => w.o === 'h' ? [y - w.c, Math.abs(x - w.g) < GAP/2 - 8] : [x - w.c, Math.abs(y - w.g) < GAP/2 - 8];

// ===== ⑤ 옮는 불씨 =====
const SPREAD = 80, IGN = [.8, 6.8];
const emOn = (B, p) => B.bs.em && B.bs.em.k === p.seed ? B.bs.em.on || {} : {};

// ===== ⑥ 양동이 릴레이 =====
const NEED = 4;
function relayGeo(B, p){ const rl = B.bs.rl && B.bs.rl.k === p.seed ? B.bs.rl : null, n = Math.max(1, Math.min(8, rl ? rl.n : B.alive.length)), D = Math.min(760, 230*(n + 1)), R = Math.max(230, D/(n + 1) + 40), f = B.rng(p.seed + 'w')() < .5 ? 1 : -1;
  const well = [B.hx + f*D/2, Y1 - 65], barn = [B.hx - f*D/2, Y1 - 75];
  // 실제로 줄에 선 사람만 세요 (가만히 있는 사람 때문에 못 깨는 일이 없게): 선 사람이 적으면 팔이 더 멀리 닿아요
  const on = B.alive.filter(q => segD(q.x, q.y, well, barn) < 150).length;
  return {rl, n, R:Math.max(R, D/(Math.max(1, on) + 1) + 40), well, barn}; }
function segD(x, y, a, b){ const vx = b[0] - a[0], vy = b[1] - a[1], u = cl(((x - a[0])*vx + (y - a[1])*vy)/(vx*vx + vy*vy || 1)); return Math.hypot(x - a[0] - vx*u, y - a[1] - vy*u); }
function chain(B, G){ const nodes = [G.well, ...B.alive.map(q => [q.x, q.y]), G.barn], N = nodes.length, prev = new Array(N).fill(-1), seen = [true]; const Q = [0];
  while (Q.length){ const a = Q.shift(); if (a === N - 1) break; for (let b = 1; b < N; b++) if (!seen[b] && dist(...nodes[a], ...nodes[b]) <= G.R){ seen[b] = true; prev[b] = a; Q.push(b); } }
  if (!seen[N - 1]){ // 끊긴 곳: 우물에서 닿는 데까지 + 가장 가까운 사람
    let best = 0, bd = 1e9; for (let i = 0; i < N - 1; i++) if (seen[i]){ const d = dist(...nodes[i], ...G.barn); if (d < bd){ bd = d; best = i; } }
    const path = []; for (let i = best; i >= 0; i = prev[i]) path.unshift(nodes[i]); return {ok:false, path}; }
  const path = []; for (let i = N - 1; i >= 0; i = prev[i]) path.unshift(nodes[i]); return {ok:true, path}; }

// ===== ⑦ 마지막 성냥 (되받아치기) =====
const FLY = 1.6, BACK = .5, MR = 90;
function throws(B, p){ const out = [], n = B.alive.length; if (!n) return out; const h = B.hash(p.seed);
  for (let i = 0; ; i++){ const ti = 1.0 + i*1.5; if (ti + FLY + .4 > p.len) break; const k = p.t - ti; if (k < -.6 || k > FLY + BACK + 1.2) continue;
    const id = `${p.seed}.${i}`; if (!L.mt[id] && k >= 0){ const pl = B.alive[(h + i) % n], bp = posAt(B, B.now - k*1000); L.mt[id] = {land:[pl.x, pl.y], from:[bp[0], bp[1]]}; }
    out.push({i, id, ti, k, m:L.mt[id] || null}); }
  return out; }
function rfAt(B, p, th){ if (L.rf[th.id]) return L.rf[th.id]; const rf = B.bs.rf; return rf && rf.k === p.seed && rf.m ? rf.m[th.i] || 0 : 0; }
function mGround(th, u){ const m = th.m; u = cl(u); return [lerp(m.from[0], m.land[0], u), lerp(m.from[1], m.land[1], u)]; }
const mHeight = u => lerp(-HAND[1], 0, cl(u)) + Math.sin(cl(u)*PI)*120;

// ===== 매 프레임 =====
function tick(B, dt){ arena(B);
  const p = cur(B), me = B.me, lo = B.lo; tidy();
  // 기본 공격
  for (const r of rings(B)){ if (r.k < .1 && once('rw' + r.key)) B.sfx('warn', 300); if (r.k >= .9 && once('rs' + r.key)) B.sfx('slam', 250);
    if (me && !me.down && r.k >= .9 && r.k < 1.25 && inDonut(me.x, me.y, r)) B.hurt(lo + RDMG, 'rg' + r.key); }
  if (B.phase === 3 && B.pt > .3 && once('ph3' + B.r.lowAt)) B.say('마지막 하나 남았어.', 2600);
  if (p.id === 'trans'){ if (p.t > 1.7 && once('tp' + B.r.rageAt)){ B.sfx('slam'); B.shake(); } if (p.t > 2.2 && once('ts' + B.r.rageAt)) B.say(`${B.targetNick !== '???' ? B.targetNick : B.target ? B.target.nick : '네'} 집터, 다음 밭으로 딱이네.`, 3200); }
  if (p.id === 'fuse'){ for (const [i, F] of fuses(B, p).entries()){ const k = p.t;
      if (k >= F.pour[0] && once(`fp${p.seed}${i}`)) B.sfx('warn', 200); if (k >= F.lit && once(`fl${p.seed}${i}`)) B.sfx('slam', 200);
      if (me && !me.down && k >= F.lit && k < F.lit + F.run + BURN){ const [d, s] = fuseNear(F, me.x, me.y), ig = F.lit + s*F.run; if (d < FUSE_W/2 + 10 && k >= ig && k < ig + BURN) B.hurt(lo + 80, `fu${p.seed}.${i}`); } } }
  if (p.id === 'bolt') BOLT_T.forEach((t0, j) => { const k = p.t - t0; if (k > -.25 && k < .3 && once(`bs${p.seed}${j}`)) B.say('번개가 떨어졌대요!', 1300);
    if (k >= 0 && once(`bw${p.seed}${j}`)) B.sfx('warn'); if (k >= BOLT_D && k < BOLT_D + .5 && once(`bb${p.seed}${j}`)){ B.sfx('slam'); B.shake(); }
    if (me && !me.down && k >= BOLT_D && k < BOLT_D + .35 && inRect(me.x, me.y, boltZones(B, p, j).bad)) B.hurt(lo + 100, `bo${p.seed}.${j}`); });
  if (p.id === 'smoke' || L.br < 100){ if (L.brSeed !== p.seed && p.id === 'smoke'){ L.brSeed = p.seed; L.br = 100; }
    const a = p.id === 'smoke' ? smokeA(p) : 0, inB = p.id === 'smoke' && me && bubbles(B, p).some(([x, y]) => inEll(me.x, me.y, x, y, BUB, BUB*.6));
    if (me && !me.down && a > .5 && !inB) L.br = Math.max(0, L.br - 16*dt); else L.br = Math.min(100, L.br + 60*dt);
    if (me && !me.down && L.br <= 0 && p.id === 'smoke'){ const n = Math.floor(p.t/1.5); if (B.hurt(lo, `sm${p.seed}.${n}`)) B.fx('쿨럭', me.x, me.y - 70, '#c8c8c8'); } }
  if (p.id === 'plow') tickPlow(B, p, me, lo); else L.prev = null;
  if (p.id === 'spread') tickSpread(B, p, me, lo);
  if (p.id === 'relay') tickRelay(B, p, dt);
  if (p.id === 'match') for (const th of throws(B, p)){ if (!th.m) continue;
    if (th.k >= -.4 && once('mw' + th.id)) B.sfx('warn', 200);
    const rf = rfAt(B, p, th); if (rf){ if (B.now >= rf + BACK*1000 && once('mh' + th.id)){ B.sfx('slam', 100); const [bx, by] = posAt(B, B.now); B.fx('화르륵', bx, by - 150, '#ffb070'); } continue; }
    if (th.k >= FLY + .2 && th.k < FLY + .6){ if (once('mx' + th.id)){ B.sfx('slam', 120); } if (me && !me.down && inEll(me.x, me.y, th.m.land[0], th.m.land[1], MR, MR*.6) && B.hurt(lo + 180, 'mt' + th.id)) B.shake(); } }
}
function tickPlow(B, p, me, lo){ if (!me || me.down){ L.prev = null; return; }
  const prev = L.prev || [me.x, me.y]; let x = me.x, y = me.y, moved = false;
  for (const [wi, S] of ridges(B, p).entries()){ if (p.t >= S.warn && once(`pw${p.seed}${wi}`)) B.sfx('warn');
    if (p.t < S.up || p.t > S.down) continue; if (once(`pu${p.seed}${wi}`)) B.sfx('slam', 150);
    for (const [k, w] of S.w.entries()){ const [d, inGap] = wallD(w, x, y); if (inGap) continue;
      if (p.t < S.up + .35 && Math.abs(d) < 22){ // 솟는 자리에 서 있으면 튕겨 나가요
        const s = d === 0 ? (w.o === 'h' ? (y < B.hy ? -1 : 1) : (x < B.hx ? -1 : 1)) : Math.sign(d);
        if (B.hurt(lo + 60, `pb${p.seed}.${wi}.${k}`)){ B.push(w.o === 'h' ? 0 : s, w.o === 'h' ? s : 0, 90); B.shake(); } continue; }
      const [pd] = wallD(w, prev[0], prev[1]);
      if (Math.abs(pd) >= 13 && (Math.abs(d) < 13 || Math.sign(d) !== Math.sign(pd))){ const v = w.c + Math.sign(pd)*14; if (w.o === 'h') y = v; else x = v; moved = true; } } }
  if (moved){ const dx = x - me.x, dy = y - me.y, d = Math.hypot(dx, dy); if (d > .5) B.push(dx, dy, d); } L.prev = [x, y]; } // B.tp 는 엔진에서 오류가 나서 밀기로 되돌려요
function tickSpread(B, p, me, lo){ const on = emOn(B, p);
  if (me && !me.down && on[me.uid]){ const since = on[me.uid], m = Math.floor((B.now - since - 1500)/2000); if (m >= 0) B.hurt(lo, `em${p.seed}.${since}.${m}`);
    if (p.t >= p.len - .5 && B.hurt(lo + 150, `eb${p.seed}`)){ B.shake(); B.sfx('slam'); } }
  if (p.t < IGN[0] && once('ew' + p.seed)) B.sfx('warn');
  if (!B.host) return;
  const st = B.bs.em && B.bs.em.k === p.seed ? B.bs.em : {k:p.seed, on:{}, wet:{}, i:0}, nOn = {...(st.on || {})}, wet = {...(st.wet || {})}; let i = st.i | 0, ch = !(B.bs.em && B.bs.em.k === p.seed);
  const ig = IGN.filter(x => p.t >= x).length; if (ig > i){ i = ig; ch = true; const tg = B.target; if (tg && !tg.down && !nOn[tg.uid]) nOn[tg.uid] = B.now; }
  const at = u => B.all.find(q => q.uid === u);
  for (const u of Object.keys(nOn)){ const pl = at(u); if (!pl || pl.down){ delete nOn[u]; ch = true; continue; } if (TROUGH.some(([x, y]) => inEll(pl.x, pl.y, x, y, 78, 48))){ delete nOn[u]; wet[u] = B.now; ch = true; } }
  const add = []; for (const u of Object.keys(nOn)){ if (B.now - nOn[u] < 900) continue; const pl = at(u);
    for (const q of B.alive) if (!nOn[q.uid] && !(wet[q.uid] && B.now - wet[q.uid] < 2000) && dist(pl.x, pl.y, q.x, q.y) < SPREAD) add.push(q.uid); }
  for (const u of add){ nOn[u] = B.now; ch = true; }
  if (ch) tx(B, bs => ({...bs, em:{k:p.seed, on:nOn, wet, i}})); }
function tickRelay(B, p, dt){ const G = relayGeo(B, p);
  if (p.t < .3 && once('rw' + p.seed)) B.sfx('warn');
  if (G.rl && G.rl.ok && once('ro' + p.seed)){ B.say('…그 모자, 어디서 났어?', 2600); B.sfx('slam'); B.shake(); }
  if (!B.host) return;
  if (L.rlSeed !== p.seed){ L.rlSeed = p.seed; L.rlAcc = 0; }
  if (!G.rl){ tx(B, bs => ({...bs, rl:{k:p.seed, n:Math.max(1, B.alive.length), d:0}})); return; }
  if (G.rl.ok || p.t > p.len - .2) return;
  const ch = chain(B, G); if (!ch.ok){ L.rlAcc = 0; return; } if (!L.rlAcc) L.rlAcc = B.now; // 줄이 이어진 채로 1.6 초마다 양동이 하나
  if (B.now - L.rlAcc >= 1600){ const d = (G.rl.d | 0) + 1, now = B.now;
    if (tx(B, bs => ({...bs, rl:{...G.rl, d, ...(d >= NEED ? {ok:now} : {})}, ...(d >= NEED ? {stun:now + 8000, stunAt:now} : {})}))) L.rlAcc = now; } }

// ===== 그리기 =====
const T = B => B.now/1000;
function drawFloor(B, c){ arena(B); const p = cur(B), t = T(B);
  drawPrints(B, c, t);
  if (p.id === 'fuse') for (const F of fuses(B, p)){ const k = p.t; if (k < F.pour[0] || k > F.lit + F.run + BURN + .3) continue; const pu = cl((k - F.pour[0])/(F.pour[1] - F.pour[0])), N = 48;
    const segs = [[], [], []]; for (let i = 0; i < N; i++){ const s0 = i/N; if (s0 > pu) break; const ig = F.lit + s0*F.run, st = k > ig + BURN ? 2 : k >= ig ? 1 : 0; segs[st].push([fuseAt(F, s0), fuseAt(F, Math.min(pu, (i + 1)/N))]); }
    c.save(); c.lineCap = 'round'; [['rgba(30,24,40,.8)', FUSE_W], ['#ff7a2a', FUSE_W], ['rgba(20,10,8,.55)', FUSE_W]].forEach(([col, w], st) => { if (!segs[st].length) return; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (const [a, b] of segs[st]){ c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); } c.stroke(); });
    if (segs[0].length){ c.strokeStyle = 'rgba(170,140,230,.3)'; c.lineWidth = 6; c.beginPath(); for (const [a, b] of segs[0]){ c.moveTo(a[0], a[1] - 6); c.lineTo(b[0], b[1] - 6); } c.stroke(); } c.restore(); }
  if (p.id === 'bolt') BOLT_T.forEach((t0, j) => { const k = p.t - t0; if (k < 0 || k > BOLT_D + 1.1) return; const Z = boltZones(B, p, j);
    if (k < BOLT_D){ const z = Z.safe; c.save(); c.globalAlpha = .16 + .08*Math.sin(t*10); c.fillStyle = '#fff07a'; c.fillRect(z[0], z[1], z[2] - z[0], z[3] - z[1]); c.restore();
      for (let i = 0; i < 6; i++){ const x = lerp(z[0], z[2], (i % 3 + .5)/3), y = lerp(z[1], z[3], (Math.floor(i/3) + .5)/2); c.save(); c.globalAlpha = .85; c.strokeStyle = '#fff07a'; c.lineWidth = 3; c.setLineDash([7, 5]); c.beginPath(); c.ellipse(x, y, 44, 24, 0, 0, 7); c.stroke(); c.setLineDash([]); boltIcon(c, x, y - 4, 1); c.restore(); } }
    else { const z = Z.bad, al = cl((BOLT_D + 1.1 - k)*1.6); c.save(); c.globalAlpha = .38*al; c.fillStyle = '#ff5a1a'; c.fillRect(z[0], z[1], z[2] - z[0], z[3] - z[1]); c.restore(); } });
  if (p.id === 'fuse') for (const F of fuses(B, p)){ const k = p.t; if (k < F.lit || k > F.lit + F.run + BURN) continue;
    for (let i = 0; i < 18; i++){ const s = i/18, ig = F.lit + s*F.run; if (k < ig || k > ig + BURN) continue; const [x, y] = fuseAt(F, s); flame(c, x, y + 8, .5*cl((ig + BURN - k)*2), t, i); } }
  if (p.id === 'bolt') BOLT_T.forEach((t0, j) => { const k = p.t - t0; if (k < BOLT_D || k > BOLT_D + 1.1) return; const z = boltZones(B, p, j).bad, al = cl((BOLT_D + 1.1 - k)*1.6), h = cl((k - BOLT_D)/.2);
    c.save(); c.globalAlpha = al; for (let i = 0; i < 12; i++){ const x = lerp(z[0], z[2], ((i % 4) + .5)/4), y = lerp(z[1], z[3], (Math.floor(i/4) + .5)/3) + (i % 2)*16; flame(c, x, y, (.55 + .15*Math.sin(i))*h, t, i); } c.restore(); });
  if (p.id === 'smoke'){ const a = smokeA(p); if (a > 0) for (const [x, y] of bubbles(B, p)){ c.save(); c.globalAlpha = a; c.strokeStyle = 'rgba(200,240,255,.9)'; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, BUB, BUB*.6, 0, 0, 7); c.stroke(); c.fillStyle = 'rgba(180,230,255,.16)'; c.fill();
      for (let i = 0; i < 5; i++){ const u = (t*.5 + i/5) % 1; c.globalAlpha = a*(1 - u)*.8; c.beginPath(); c.arc(x + Math.sin(i*2.3 + t)*40, y - u*60, 3 + i % 3, 0, 7); c.stroke(); } c.restore(); } }
  if (p.id === 'plow') drawRidges(B, c, p, t);
  if (p.id === 'spread') for (const [x, y] of TROUGH){ c.save(); c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(x, y + 14, 66, 18, 0, 0, 7); c.fill(); const q = c.createLinearGradient(x - 60, 0, x + 60, 0); q.addColorStop(0, '#6a4a2a'); q.addColorStop(.5, '#9a7040'); q.addColorStop(1, '#6a4a2a'); c.fillStyle = q; c.beginPath(); c.roundRect(x - 60, y - 18, 120, 34, 8); c.fill();
    c.fillStyle = '#5ab0e0'; c.beginPath(); c.ellipse(x, y - 16, 54, 10, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(x - 14 + Math.sin(t*2)*8, y - 18, 12, 2.5, 0, 0, 7); c.fill(); c.restore(); }
  if (p.id === 'relay') drawRelayFloor(B, c, p, t); else if (B.bs.rl && B.bs.rl.ok && B.now - B.bs.rl.ok < 9000) drawRelayFloor(B, c, {seed:B.bs.rl.k}, t);
  for (const r of rings(B)){ if (r.k < .9){ c.save(); c.globalAlpha = .45 + .4*Math.abs(Math.sin(r.k*10)); c.strokeStyle = '#ffb070'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.ellipse(r.x, r.y, ROUT, ROUT*RSQ, 0, 0, 7); c.stroke(); c.beginPath(); c.ellipse(r.x, r.y, RIN, RIN*RSQ, 0, 0, 7); c.stroke();
      c.setLineDash([]); c.globalAlpha = .12 + .2*r.k/.9; c.fillStyle = '#ff7a2a'; c.beginPath(); c.ellipse(r.x, r.y, ROUT, ROUT*RSQ, 0, 0, 7); c.ellipse(r.x, r.y, RIN, RIN*RSQ, 0, 0, 7, true); c.fill('evenodd'); c.restore(); }
    else { const al = cl((1.6 - r.k)*2.5); c.save(); c.globalAlpha = .75*al; const q = c.createLinearGradient(r.x, r.y - 50, r.x, r.y + 50); q.addColorStop(0, '#ffd070'); q.addColorStop(1, '#ff5a1a'); c.fillStyle = q; c.beginPath(); c.ellipse(r.x, r.y, ROUT, ROUT*RSQ, 0, 0, 7); c.ellipse(r.x, r.y, RIN, RIN*RSQ, 0, 0, 7, true); c.fill('evenodd'); c.restore(); } }
  if (p.id === 'match') for (const th of throws(B, p)){ if (!th.m || rfAt(B, p, th) || th.k > FLY + .2) continue; const u = cl(th.k/FLY); warnCircle(c, th.m.land[0], th.m.land[1], MR, MR*.6, u, '255,140,40'); }
}
function boltIcon(c, x, y, s){ c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = '#fff07a'; c.beginPath(); c.moveTo(3, -14); c.lineTo(-7, 2); c.lineTo(0, 2); c.lineTo(-3, 14); c.lineTo(8, -3); c.lineTo(1, -3); c.closePath(); c.fill(); c.restore(); }
function drawPrints(B, c, t){ // 이동 연출: 발자국마다 불이 붙어 타오르다 재가 돼요
  const STEP = 380, LIFE = 2600, now = B.now, k1 = Math.floor(now/STEP), k0 = Math.floor((now - LIFE)/STEP) + 1, G = glow();
  for (let k = k0; k <= k1; k++){ const tk = k*STEP, age = (now - tk)/1000; if (age < 0) continue; const a = posAt(B, tk), b = posAt(B, tk - 120), d = dist(...a, ...b), sp = d/.12; if (sp < 10) continue;
    const ux = (a[0] - b[0])/d, uy = (a[1] - b[1])/d, side = k % 2 ? 1 : -1, x = a[0] - uy*14*side, y = a[1] + 3 + ux*14*side*.55, s = cl(sp/70), sc = 1.1 + .6*s;
    const ash = cl((LIFE/1000 - age)/1.2), sco = cl(age/.9);
    printShape(c, x, y, Math.atan2(uy*.55, ux), sc, `rgba(${lerp(255, 70, sco)|0},${lerp(120, 66, sco)|0},${lerp(40, 62, sco)|0},${(.35 + .45*s)*ash})`);
    if (age > .55){ c.save(); c.globalAlpha = cl((age - .55)/.5)*ash*.8; c.fillStyle = 'rgba(150,146,140,.9)'; for (let i = 0; i < 4; i++){ const r = ((k*31 + i*17) % 13)/13; c.beginPath(); c.ellipse(x + (r - .5)*26*sc, y + (((i*7 + k) % 5)/5 - .5)*10, 3 + r*3, 1.6 + r*1.5, 0, 0, 7); c.fill(); } c.restore(); }
    if (age < .9){ const fl = (1 - age/.9)*(.6 + .4*Math.sin(t*23 + k*2.1))*(.4 + .8*s); c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .6*fl; c.drawImage(G, x - 34*sc, y - 34*sc*.7, 68*sc, 68*sc*.7); c.restore(); flame(c, x - 4*sc, y + 3, .4*fl + .06, t, k); flame(c, x + 9*sc, y + 1, .18*fl, t, k + 3); } }
  const p0 = posAt(B, now), p1 = posAt(B, now - 80), sp = cl(dist(...p0, ...p1)/.08/70);
  if (sp > .1){ c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 10; i++){ const ph = (t*1.6 + i/10) % 1, sx = (i % 2 ? 1 : -1)*17; c.globalAlpha = sp*(1 - ph); c.fillStyle = i % 3 ? '#ffb050' : '#fff0a0'; c.beginPath(); c.arc(p0[0] + sx + Math.sin(i*3.7 + t*4)*12*ph, p0[1] - ph*60*sp, 2.4, 0, 7); c.fill(); } c.restore(); } }
function drawRidges(B, c, p, t){ for (const S of ridges(B, p)){ if (p.t < S.warn || p.t > S.down + .5) continue; const up = p.t >= S.up, al = p.t > S.down ? cl(1 - (p.t - S.down)/.5) : 1, h = up ? 18*cl((p.t - S.up)/.25) : 0;
    for (const w of S.w){ const segs = w.o === 'h' ? [[0, w.g - GAP/2], [w.g + GAP/2, B.W || 1100]] : [[Y0 - 10, w.g - GAP/2], [w.g + GAP/2, Y1 + 10]];
      for (const [a0, a1] of segs){ c.save(); c.globalAlpha = al;
        if (!up){ c.globalAlpha = .5 + .4*Math.sin(t*12); c.strokeStyle = '#e8b070'; c.lineWidth = 3; c.setLineDash([8, 6]); if (w.o === 'h') c.strokeRect(a0, w.c - 12, a1 - a0, 24); else c.strokeRect(w.c - 12, a0, 24, a1 - a0); c.restore(); continue; }
        if (w.o === 'h'){ c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(a0, w.c + 4, a1 - a0, 12); const q = c.createLinearGradient(0, w.c - 12 - h, 0, w.c + 12); q.addColorStop(0, '#a0703c'); q.addColorStop(1, '#5a3818'); c.fillStyle = q; c.beginPath(); c.roundRect(a0, w.c - 12 - h, a1 - a0, 24 + h, 10); c.fill();
          c.fillStyle = 'rgba(255,220,160,.25)'; c.fillRect(a0 + 6, w.c - 10 - h, a1 - a0 - 12, 4); c.fillStyle = '#3a6a2a'; for (let x = a0 + 20; x < a1 - 10; x += 46){ c.beginPath(); c.ellipse(x, w.c - 12 - h, 5, 3, 0, 0, 7); c.fill(); } }
        else { c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(w.c - 8, a0 + 6, 26, a1 - a0); const q = c.createLinearGradient(w.c - 12, 0, w.c + 12, 0); q.addColorStop(0, '#5a3818'); q.addColorStop(.5, '#a0703c'); q.addColorStop(1, '#5a3818'); c.fillStyle = q; c.beginPath(); c.roundRect(w.c - 12, a0 - h, 24, a1 - a0 + h, 10); c.fill();
          c.fillStyle = '#3a6a2a'; for (let y = a0 + 16; y < a1 - 10; y += 40){ c.beginPath(); c.ellipse(w.c, y - h, 4, 3, 0, 0, 7); c.fill(); } }
        c.restore(); } } } }
function drawRelayFloor(B, c, p, t){ const G = relayGeo(B, p), [wx, wy] = G.well, [bx, by] = G.barn, d = G.rl ? G.rl.d | 0 : 0;
  c.save(); c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(wx, wy + 10, 50, 16, 0, 0, 7); c.fill(); const q = c.createLinearGradient(wx - 44, 0, wx + 44, 0); q.addColorStop(0, '#7a7a80'); q.addColorStop(.5, '#b0b0b8'); q.addColorStop(1, '#6a6a70'); c.fillStyle = q; c.beginPath(); c.roundRect(wx - 44, wy - 30, 88, 40, 6); c.fill(); c.fillStyle = '#2a4a6a'; c.beginPath(); c.ellipse(wx, wy - 30, 44, 12, 0, 0, 7); c.fill();
  c.strokeStyle = '#5a3a20'; c.lineWidth = 5; c.beginPath(); c.moveTo(wx - 38, wy - 30); c.lineTo(wx - 38, wy - 74); c.lineTo(wx + 38, wy - 74); c.lineTo(wx + 38, wy - 30); c.stroke(); c.restore();
  c.save(); c.fillStyle = '#4a2a18'; c.beginPath(); c.moveTo(bx - 70, by + 10); c.lineTo(bx - 70, by - 70); c.lineTo(bx, by - 115); c.lineTo(bx + 70, by - 70); c.lineTo(bx + 70, by + 10); c.closePath(); c.fill(); c.fillStyle = '#2a160c'; c.fillRect(bx - 20, by - 40, 40, 50); c.restore();
  for (let i = 0; i < NEED; i++){ c.save(); c.fillStyle = i < d ? '#7ad0ff' : 'rgba(30,20,20,.8)'; c.strokeStyle = '#cfeaff'; c.lineWidth = 1.5; c.beginPath(); c.arc(bx - (NEED - 1)*9 + i*18, by + 26, 6, 0, 7); c.fill(); c.stroke(); c.restore(); }
  if (p.id === 'relay' && !(G.rl && G.rl.ok)){ const ch = chain(B, G); c.save(); c.lineWidth = 3; c.setLineDash([8, 7]); for (let i = 0; i < ch.path.length - 1; i++){ c.strokeStyle = 'rgba(150,255,170,.7)'; c.beginPath(); c.moveTo(ch.path[i][0], ch.path[i][1] - 20); c.lineTo(ch.path[i + 1][0], ch.path[i + 1][1] - 20); c.stroke(); }
    if (!ch.ok && ch.path.length){ const a = ch.path[ch.path.length - 1]; c.strokeStyle = 'rgba(255,90,90,.75)'; c.beginPath(); c.moveTo(a[0], a[1] - 20); c.lineTo(bx, by - 20); c.stroke(); }
    c.restore(); const q = B.me; if (q && !q.down){ c.save(); c.globalAlpha = .22; c.strokeStyle = '#9affb0'; c.lineWidth = 1.5; c.setLineDash([4, 6]); c.beginPath(); c.ellipse(q.x, q.y, G.R, G.R*.6, 0, 0, 7); c.stroke(); c.restore(); } }
}
function drawBody(B, c){ const p = cur(B), t = T(B), [x, y] = posAt(B, B.now);
  let sx = 0, rot = 0; if (p.id === 'trans' && p.t < 2.2) sx = Math.sin(B.now*.07)*6*(1 - p.t/2.2); if (stunned(B)) rot = Math.sin(t*3)*.12; if (hot(B)) sx += Math.sin(B.now*.09)*3;
  const half = B.phase >= 2 && !(p.id === 'trans' && p.t < 1.7);
  drawFox(c, x + sx, y, {half, t, rot});
  if (hot(B)){ c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .55 + .2*Math.sin(t*9); c.drawImage(glow(), x - 110, y - 200, 220, 200); c.restore(); for (let i = 0; i < 4; i++) flame(c, x - 45 + i*30, y - 40 - (i % 2)*30, .45, t, i*2); } }
function drawTop(B, c){ arena(B); const p = cur(B), t = T(B), bp = posAt(B, B.now);
  if (p.id === 'fuse') for (const F of fuses(B, p)){ const k = p.t; if (k < F.pour[0] || k > F.lit + F.run + BURN + .3) continue;
    if (k < F.pour[1]){ const pu = cl((k - F.pour[0])/(F.pour[1] - F.pour[0])), [hx, hy] = fuseAt(F, pu), sx = bp[0] + SPOUT[0], sy = bp[1] + SPOUT[1]; c.save(); c.strokeStyle = 'rgba(40,30,50,.85)'; c.lineWidth = 4; c.setLineDash([6, 6]); c.lineDashOffset = -t*60; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx)/2, Math.min(sy, hy) - 80, hx, hy); c.stroke(); c.restore(); }
    const fr = (k - F.lit)/F.run; if (fr >= 0 && fr <= 1){ const [x, y] = fuseAt(F, fr); c.save(); c.globalCompositeOperation = 'lighter'; c.drawImage(glow(), x - 40, y - 28, 80, 56); c.restore(); c.fillStyle = 'rgba(255,250,200,.95)'; c.beginPath(); c.ellipse(x, y, 16, 12, 0, 0, 7); c.fill(); }
    if (k > F.lit - .5 && k < F.lit){ const [x, y] = fuseAt(F, 0); matchStick(c, x, y - 30 + (k - F.lit)*60, (k - F.lit)*10, t); } }
  if (p.id === 'smoke') drawSmoke(B, c, p, t);
  for (const r of rings(B)){ if (r.k > .45 && r.k < .9){ const u = (r.k - .45)/.45, x = lerp(bp[0] + HAND[0], r.x, u), y = lerp(bp[1] + HAND[1], r.y, u) - Math.sin(u*PI)*110; matchStick(c, x, y, u*12, t); }
    else if (r.k >= .9 && r.k < 1.6){ const al = cl((1.6 - r.k)*2.5); c.save(); c.globalAlpha = al; for (let i = 0; i < 10; i++){ const a = i/10*PI*2 + r.x, rr = (RIN + ROUT)/2; flame(c, r.x + Math.cos(a)*rr, r.y + Math.sin(a)*rr*RSQ, .32, t, i); } c.restore(); } }
  if (p.id === 'spread'){ const on = emOn(B, p); for (const q of B.all){ if (!on[q.uid]) continue; c.save(); c.globalAlpha = .55 + .2*Math.sin(t*8); c.strokeStyle = '#ff7a2a'; c.lineWidth = 3; c.setLineDash([10, 6]); c.beginPath(); c.ellipse(q.x, q.y, SPREAD, SPREAD*.6, 0, 0, 7); c.stroke(); c.restore(); flame(c, q.x - 10, q.y - 30, .5, t, 1); flame(c, q.x + 12, q.y - 26, .4, t, 3); }
    if (p.t < IGN[0] + .2 || (p.t > IGN[1] - .6 && p.t < IGN[1] + .2)){ const tg = B.target; if (tg){ const k0 = p.t < IGN[0] + .2 ? IGN[0] : IGN[1], u = cl((p.t - (k0 - .6))/.6); if (u > 0 && u < 1) matchStick(c, lerp(bp[0] + HAND[0], tg.x, u), lerp(bp[1] + HAND[1], tg.y - 30, u) - Math.sin(u*PI)*90, u*10, t); } } }
  if (p.id === 'relay') drawRelayTop(B, c, p, t);
  if (B.bs.rl && B.bs.rl.ok && B.now - B.bs.rl.ok < 9000){ const G = relayGeo(B, p.id === 'relay' ? p : {seed:B.bs.rl.k}); hatIcon(c, G.barn[0], G.barn[1] - 46, cl((B.now - B.bs.rl.ok)/400)); }
  if (p.id === 'match') drawMatches(B, c, p, t, bp);
}
function matchStick(c, x, y, rot, t){ c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = '#e8d0a0'; c.fillRect(-2, -12, 4, 24); c.fillStyle = '#c82a2a'; c.beginPath(); c.ellipse(0, -13, 4, 5, 0, 0, 7); c.fill(); c.restore(); flame(c, x, y - 12, .18, t, 2); }
function hatIcon(c, x, y, a){ c.save(); c.globalAlpha = a; c.translate(x, y); c.fillStyle = '#5a4024'; c.beginPath(); c.ellipse(0, 8, 46, 12, 0, 0, 7); c.fill(); c.fillStyle = '#6a4a28'; c.beginPath(); c.ellipse(0, -4, 26, 16, 0, 0, 7); c.fill(); c.fillStyle = '#8a2a2a'; c.fillRect(-26, 0, 52, 5); c.fillStyle = '#140c08'; for (let k = 0; k < 6; k++){ c.beginPath(); c.ellipse(-36 + k*14, 10, 6, 4, 0, 0, 7); c.fill(); } c.restore(); }
function drawSmoke(B, c, p, t){ const a = smokeA(p); if (a <= 0) return; const bb = bubbles(B, p), P_ = puff();
  c.save(); c.beginPath(); c.rect(0, Y0 - 100, B.W || 1100, Y1 - Y0 + 140); for (const [x, y] of bb){ c.moveTo(x + BUB + 10, y - 20); c.ellipse(x, y - 20, BUB + 10, BUB*.6 + 40, 0, 0, 7, true); } c.clip('evenodd');
  c.globalAlpha = a*.42; c.fillStyle = '#4a4440'; c.fillRect(0, Y0 - 100, B.W || 1100, Y1 - Y0 + 140); c.globalAlpha = a*.85;
  for (let i = 0; i < 16; i++){ const x = ((i*173 + t*30*(i % 2 ? 1 : -1)) % 1400 + 1400) % 1400 - 150, y = Y0 - 30 + (i*97) % (Y1 - Y0 + 40); c.drawImage(P_, x - 160, y - 100, 320, 200); } c.restore(); }
function drawRelayTop(B, c, p, t){ const G = relayGeo(B, p), [bx, by] = G.barn, d = G.rl ? G.rl.d | 0 : 0, fire = G.rl && G.rl.ok ? 0 : 1 - d/NEED;
  if (fire > 0) for (let i = 0; i < 6; i++) flame(c, bx - 58 + i*23, by - 10 - (i % 2)*30, (.55 + .3*Math.sin(i*2))*fire + .1, t, i);
  if (G.rl && G.rl.ok) return; const ch = chain(B, G); if (!ch.ok) return; const path = [G.well, ...ch.path.slice(1, -1), G.barn], n = path.length - 1, u = (B.now/1600) % 1, seg = Math.min(n - 1, Math.floor(u*n)), v = ease(u*n - seg);
  const a = path[seg], b = path[seg + 1], x = lerp(a[0], b[0], v), y = lerp(a[1], b[1], v) - 40 - Math.sin(v*PI)*26;
  c.save(); c.fillStyle = '#8a8a90'; c.beginPath(); c.moveTo(x - 12, y - 10); c.lineTo(x + 12, y - 10); c.lineTo(x + 9, y + 10); c.lineTo(x - 9, y + 10); c.closePath(); c.fill(); c.fillStyle = '#5ab0e0'; c.beginPath(); c.ellipse(x, y - 10, 12, 4, 0, 0, 7); c.fill(); c.restore(); }
function drawMatches(B, c, p, t, bp){ for (const th of throws(B, p)){ const k = th.k;
    if (k < 0){ c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = cl((k + .6)*2); c.drawImage(glow(), bp[0] + HAND[0] - 30, bp[1] + HAND[1] - 30, 60, 60); c.restore(); continue; }
    if (!th.m) continue; const rf = rfAt(B, p, th);
    if (rf){ const kr = (B.now - rf)/1000, u0 = cl((rf/1000 - (B.now/1000 - k))/FLY), g0 = mGround(th, u0), h0 = mHeight(u0);
      if (kr < BACK){ const v = kr/BACK, x = lerp(g0[0], bp[0] + CHEST[0], v), y = lerp(g0[1] - h0, bp[1] + CHEST[1], v) - Math.sin(v*PI)*50; bigMatch(c, x, y, t, 1); }
      else if (kr < BACK + .8){ c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1 - (kr - BACK)/.8; const r = 60 + (kr - BACK)*160; c.drawImage(glow(), bp[0] - r, bp[1] + CHEST[1] - r*.7, r*2, r*1.4); c.restore(); }
      continue; }
    if (k <= FLY + .2){ const u = cl(k/FLY), [gx, gy] = mGround(th, u), h = mHeight(u); c.save(); c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(gx, gy, 16 + u*10, 6 + u*4, 0, 0, 7); c.fill(); c.restore(); bigMatch(c, gx, gy - h, t, 1); }
    else if (k < FLY + 1.1){ const e = (k - FLY - .2)/.9, [x, y] = th.m.land; c.save(); c.globalAlpha = 1 - e; c.fillStyle = 'rgba(255,110,30,.6)'; c.beginPath(); c.ellipse(x, y, MR*(.5 + e*.7), MR*.6*(.5 + e*.7), 0, 0, 7); c.fill(); c.restore(); c.save(); c.globalAlpha = 1 - e; for (let i = 0; i < 6; i++) flame(c, x - 50 + i*20, y + (i % 2)*10, .5*(1 - e*.5), t, i); c.restore(); } } }
function bigMatch(c, x, y, t, s){ c.save(); c.globalCompositeOperation = 'lighter'; c.drawImage(glow(), x - 44*s, y - 44*s, 88*s, 88*s); c.restore(); c.save(); c.translate(x, y); c.rotate(Math.sin(t*6)*.3); c.fillStyle = '#e8d0a0'; c.fillRect(-4, 0, 8, 40); c.fillStyle = '#c82a2a'; c.beginPath(); c.ellipse(0, -2, 10, 12, 0, 0, 7); c.fill(); c.restore(); flame(c, x, y + 6, .6*s, t, 1); }

// ===== 화면 고정 =====
function drawScreen(B, c, w, h){ const p = cur(B), t = T(B);
  if (B.phase >= 2){ const k = B.ph2;
    if (k < 5){ const env = cl(k/.5)*cl((5 - k)/.7); if (env > 0){ c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .55*env; c.fillStyle = '#ff7a4a'; c.fillRect(0, 0, w, h); c.restore(); }
      const lv = k < 1.7 ? .64*Math.pow(cl(k/1.7), 1.6) : k < 3.4 ? lerp(.64, .045, ease((k - 1.7)/1.7)) : .045;
      if (k < 3.7) drawBurn(c, w, h, lv, true, t); else drawBurn(c, w, h, .045, false, t);
      const [bx, by] = posAt(B, B.now), [sx, sy] = B.toScreen(bx, by - 60), z = B.view?.zoom || 1; vortex(c, sx, sy, k, env, z);
      const pk = k - 1.7; if (pk > -.12 && pk < .55){ c.save(); c.globalAlpha = pk < 0 ? cl((pk + .12)/.12) : 1 - pk/.55; c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); c.restore(); }
      if (pk > 0 && pk < 1.1){ const r = (40 + pk*900)*z, al = cl(1 - pk/1.1); c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = `rgba(255,170,70,${al})`; c.lineWidth = 26*al + 2; c.beginPath(); c.ellipse(sx, sy + 20*z, r, r*.62, 0, 0, 7); c.stroke(); c.strokeStyle = `rgba(255,250,210,${al*.8})`; c.lineWidth = 6*al + 1; c.stroke(); c.restore(); }
      shimmer(c, w, h, k, t); }
    else drawBurn(c, w, h, .045, false, t, .85); }
  if (p.id === 'bolt'){ const a = cl(p.t/.5)*cl((p.len - p.t)/.5), x = w - 128, y = 66; c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(14,18,34,.9)'; c.beginPath(); c.roundRect(x, y, 116, 46, 8); c.fill(); c.strokeStyle = 'rgba(160,190,255,.4)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#ffd860'; c.beginPath(); c.arc(x + 22, y + 23, 8, 0, 7); c.fill(); c.strokeStyle = '#ffd860'; c.lineWidth = 2; for (let i = 0; i < 8; i++){ const a2 = i*PI/4; c.beginPath(); c.moveTo(x + 22 + Math.cos(a2)*11, y + 23 + Math.sin(a2)*11); c.lineTo(x + 22 + Math.cos(a2)*14, y + 23 + Math.sin(a2)*14); c.stroke(); } c.restore();
    c.save(); c.globalAlpha = a; text(c, '8월 9일', x + 74, y + 15, 20, '#cfe0ff', 'center', null); text(c, '맑음', x + 74, y + 33, 22, '#9affd0', 'center', null); c.restore(); }
  const me = B.me; if (me && L.br < 99.5 && (p.id === 'smoke' || L.br < 99)){ const [sx, sy] = B.toScreen(me.x, me.y), z = B.view?.zoom || 1, v = L.br/100, x = sx - 26, y = sy - 78*z; c.save(); c.fillStyle = 'rgba(10,10,16,.85)'; c.beginPath(); c.roundRect(x - 2, y - 2, 56, 11, 4); c.fill();
    c.fillStyle = v < .3 ? (Math.floor(t*6) % 2 ? '#ff6a6a' : '#ff9a9a') : '#9ad8ff'; c.fillRect(x, y, 52*v, 7); c.restore(); }
}
function vortex(c, cx, cy, k, env, z){ if (env <= 0) return; const pk = 1 + 1.4*Math.exp(-Math.pow((k - 1.7)/.35, 2));
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < 90; i++){ const ph = (hsh(i, 1) + k*(.32 + .25*hsh(i, 2))) % 1, r = (40 + 430*hsh(i, 3))*(1 - ph)*z, sp = 2.2 + 140/(r/z + 30), a = hsh(i, 4)*6.283 + k*sp*pk, a2 = a - .14*pk;
    const al = env*cl(ph*5)*cl((1 - ph)*4), hotS = hsh(i, 5) > .7; c.strokeStyle = hotS ? `rgba(255,240,170,${al})` : `rgba(255,${100 + 80*hsh(i, 6) | 0},30,${al*.85})`; c.lineWidth = (hotS ? 2.6 : 1.8)*(1 + .5*ph);
    c.beginPath(); c.moveTo(cx + Math.cos(a2)*r, cy + Math.sin(a2)*r*.62); c.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r*.62); c.stroke(); }
  c.globalAlpha = .5*env*pk/2; c.drawImage(glow(), cx - 260*z, cy - 260*z, 520*z, 520*z); c.restore(); }
// 화면 아지랑이: 가로 띠를 사인 곡선만큼 밀어요 (변신 처음 3 초만)
function shimmer(c, w, h, k, t){ const amp = 10*Math.pow(cl(k/1.7), 1.3)*(k < 1.7 ? 1 : cl(1 - (k - 1.7)/1.1)); if (amp < .5) return; const cv = c.canvas, s = cv.width/w, H = cv.height, band = Math.ceil(28*s);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); try { for (let y = 0; y < H; y += band){ const off = (Math.sin(y/s*.045 + t*13)*amp + Math.sin(y/s*.013 - t*7)*amp*.6)*s; c.drawImage(cv, 0, y, cv.width, band, off, y, cv.width, band); } } catch(e){} c.restore(); }

// ===== 칼 · 배수 =====
function swing(B, cx, cy){ arena(B); const p = cur(B); if (p.id !== 'match') return false;
  for (const th of throws(B, p)){ if (!th.m || rfAt(B, p, th) || th.k < FLY - .8 || th.k > FLY + .15) continue; const [gx, gy] = mGround(th, th.k/FLY);
    if (dist(cx, cy, gx, gy) > 95) continue; const at = B.now, seed = p.seed, i = th.i; L.rf[th.id] = at; B.sfx('hit'); B.fx('탁!', gx, gy - 60, '#fff0a0');
    B.tx(bs => { const rf = bs.rf && bs.rf.k === seed ? {...bs.rf, m:{...(bs.rf.m || {})}} : {k:seed, m:{}}; if (rf.m[i]) return undefined; rf.m[i] = at; return {...bs, rf, hot:Math.max(bs.hot || 0, at + (BACK + 3)*1000)}; });
    return true; }
  return false; }
function hitMul(B){ if (hot(B)) return 3; if (stunned(B)) return 2; return 1; }

export default { reach:125, height:TOP + 8, pos:B => posAt(B, B.now), tick, hitMul, swing, drawFloor, drawBody, drawTop, drawScreen };
