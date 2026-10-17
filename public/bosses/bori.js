// 보리??? (윤보혁 · 열쇠 꾸러미 사건) 다크 보스 · 엔진 규칙은 docs/BOSS_ENGINE.md
// 1 단계 ① 몇 시에 자? ② 똑같은 열쇠 ③ 철컥 → 50% 변신 → 2 단계 ④ 금고 다이얼 ⑤ 24 번째 꼬리표 ⑥ 오르골 → 20% ⑦ 빈집
// 기본 공격: 열쇠 던지기 (가슴에서 사람 쪽 직선) · 움직일 땐 스톱모션 '철컥' + 시곗바늘 잔상
import { pick, beat, warnCircle, warnRect, warnLine, inEll, inSector, tint, darkness, text, cl, lerp, ease, dist } from './kit.js';
import * as A from './bori_art.js';

const P = {
  1:[{id:'clock', len:12}, {id:'clone', len:11}, {id:'cage', len:11}],
  2:[{id:'dial', len:13}, {id:'chain', len:12}, {id:'music', len:13}],
  3:[{id:'dark', len:16}],
};
const GAP = 2.5, TRANS = 5, LOCK = 1.9, STEP = .2, BK = .5; // BK: 곰 그림 캔버스 → 월드 배율
const LV = {clock:.6, clone:.85, cage:.5, dial:.2, chain:.35, music:.15, trans:0}; // 패턴마다 돌아다니는 정도
const LINES = {clock:'보통 몇 시에 자?', clone:'똑같이 깎아 줄게.', cage:'문은 내가 잠가 줄게.', dial:'잠겼어. 못 열걸?', chain:'열쇠, 직접 건네줄래?', music:'이 노래… 알지?', dark:'아무도 없는 집이네.'};
const NONE = {id:null, t:0, len:0, n:0, k:0, seed:''};

// ===== 내 화면 기억 (그리기 · 한 번만 하기) =====
const L = { once:new Set(), hist:new Map(), lines:new Map(), txAt:{}, say:null, prevPlate:new Map(), myPlate:-1, dkHold:0, lastStun:0, pend:{}, B:null, pkK:'', pk:null, posK:'', pos:null, ckK:'', ck:null, muK:'', mu:null, dpK:'', dp:null };
const once = k => { if (L.once.has(k)) return false; if (L.once.size > 900) L.once.clear(); L.once.add(k); return true; };
const sayL = (text, ms = 2600) => { L.say = {text, until:performance.now() + ms}; };
function tx(B, kind, fn, gap = 350){ const t = performance.now(); if (t - (L.txAt[kind] || 0) < gap) return; L.txAt[kind] = t; try { const r = B.tx(fn); if (r && r.catch) r.catch(() => {}); } catch(e){} }
const clone = o => JSON.parse(JSON.stringify(o));

// ===== 시간 =====
const shift = (B, d) => ({...B, now:B.now + d*1000, t:B.t + d, pt:B.pt + d, ph2:B.ph2 >= 0 ? B.ph2 + d : -1, ph3:B.ph3 >= 0 ? B.ph3 + d : -1});
function cur(B){ const k = B.now + ':' + B.r.bossAt + ':' + B.phase; if (L.pkK === k) return L.pk; L.pkK = k; return (L.pk = pick(B, P, {gap:GAP, trans:TRANS})); }
const stunned = B => (B.bs.stun || 0) > B.now;
const active = B => stunned(B) ? NONE : cur(B); // 기절하면 패턴이 멈춰요

// ===== 보스 자리 (모두에게 같아요) =====
const wander = t => [Math.cos(t*.42)*125 + Math.sin(t*1.07)*30, Math.sin(t*.61)*44 + Math.sin(t*1.3)*10];
function ampOf(p){ if (!p.id) return 1; const lv = LV[p.id] ?? 1, k = Math.min(cl(p.t/.6), cl((p.len - p.t)/.6)); return 1 - k*(1 - lv); }
function posAt(B, noStun){
  if (!noStun && stunned(B)) return posAt(shift(B, (B.bs.stun - 8000 - B.now)/1000), true); // 기절: 쓰러진 자리에 멈춰요
  const p = cur(B); if (p.id === 'dark') return darkPos(B, p);
  const tq = Math.floor(B.t/STEP)*STEP, a = ampOf(p), w = wander(tq); // 스톱모션: STEP 마다 끊겨 움직여요
  return [B.hx + w[0]*a, B.hy + (w[1] < 0 ? w[1]*.5 : w[1])*a]; }
function bossPos(B){ const k = B.now + ':' + B.r.bossAt + ':' + (B.bs.stun || 0) + ':' + (B.bs.dk ? B.bs.dk.at : 0); if (L.posK === k) return L.pos; L.posK = k; return (L.pos = posAt(B)); }

// ===== 누가 갇혔나 (③) =====
const LAND = 1.2, HOLD = 4.2, KEYPOS = [[-58, 6], [0, 50], [58, 6]];
function cageOf(B, p, uid){ const cg = B.bs.cg; if (p.id !== 'cage' || !cg || cg.s !== p.seed || !cg.c || B.now > cg.at + (LAND + HOLD)*1000) return -1;
  for (const [u, i] of cg.c) if (u === uid && !(cg.f && cg.f[i])) return i; return -1; }

// ===== 기본 공격: 열쇠 던지기 =====
const BEVERY = 3.0, BWARN = .8, BFLY = .3;
function basicShot(B, p){
  if (p.id === 'trans' || p.id === 'dark' || stunned(B) || !B.alive.length) return null;
  const bt = beat(B, BEVERY); if (bt.t > BWARN + BFLY + .1 || bt.n < 1) return null;
  const key = B.r.bossAt + ':' + B.phase + ':' + bt.n; let s = L.lines.get(key);
  if (!s){ const list = B.alive.filter(o => cageOf(B, p, o.uid) < 0); if (!list.length) return null;
    const tg = list[B.hash(key) % list.length], [ox, oy] = posAt(shift(B, -bt.t)), sy = oy - 14, a = Math.atan2(tg.y - sy, tg.x - ox), len = Math.max(320, dist(ox, sy, tg.x, tg.y) + 170);
    s = {key, ox, oy:sy, a, len, uid:tg.uid}; if (L.lines.size > 40) L.lines.clear(); L.lines.set(key, s); }
  return {...s, t:bt.t}; }
function basicTick(B, p){ const s = basicShot(B, p), me = B.me; if (!s || !me || me.down) return;
  if (s.uid === me.uid && s.t < .15 && once('bw' + s.key)) B.sfx('warn', 300);
  if (s.t < BWARN || s.t > BWARN + BFLY + .05 || cageOf(B, p, me.uid) >= 0) return;
  const u = cl((s.t - BWARN)/BFLY), c = Math.cos(s.a), sn = Math.sin(s.a), u0 = Math.max(0, u - .35);
  // 지나간 열쇠 길 (u0 → u) 과 내 발 사이 거리
  const ax = s.ox + c*s.len*u0, ay = s.oy + sn*s.len*u0, bx = s.ox + c*s.len*u, by = s.oy + sn*s.len*u, dx = bx - ax, dy = by - ay, L2 = dx*dx + dy*dy || 1, q = cl(((me.x - ax)*dx + (me.y - ay)*dy)/L2);
  if (dist(me.x, me.y, ax + dx*q, ay + dy*q) < 30) B.hurt(B.lo, 'bk' + s.key); }

// ===== ① 몇 시에 자? (바닥 시계 · 바늘이 넘어간 시간대가 쾅) =====
const CX = 550, CY = 610, RX = 275, RY = 125, CT0 = 1.6, CTG = 1.3, CTN = 8, CWARN = 1.1;
const hAng = h => -Math.PI/2 + h*Math.PI/6;
function clockPlan(B, p){ if (L.ckK === p.seed) return L.ck; const rng = B.rng(p.seed + 'ck'), out = []; let prev = -9;
  for (let i = 0; i < CTN; i++){ let h; do { h = Math.floor(rng()*12); } while (Math.min(Math.abs(h - prev)%12, 12 - Math.abs(h - prev)%12) < 2); prev = h;
    const hs = [h]; if (i >= 3) hs.push((h + 4 + Math.floor(rng()*5))%12); if (B.phase > 1 || i >= 6) hs.push((h + 6)%12); out.push({t:CT0 + i*CTG, hs:[...new Set(hs)]}); }
  L.ckK = p.seed; return (L.ck = out); }
const inWedge = (x, y, h) => inSector(x, y, CX, CY, RX, hAng(h) - Math.PI/6, hAng(h) + Math.PI/6, RY/RX);
function clockTick(B, p){ const me = B.me; for (const [i, tk] of clockPlan(B, p).entries()){ const k = p.t - tk.t;
    if (k > -CWARN && k < -CWARN + .2 && once('cw' + p.seed + i)) B.sfx('warn', 200);
    if (k >= 0 && k < .3){ if (once('cs' + p.seed + i)) B.sfx('slam', 200);
      if (me && !me.down && tk.hs.some(h => inWedge(me.x, me.y, h))) B.hurt(B.lo + 80, 'ck' + p.seed + i); } } }
function clockFloor(B, p, c){ const al = cl(p.t*2)*cl((p.len - p.t)*2), face = A.floorClock(RX, RY); c.save(); c.globalAlpha = al*.95; c.drawImage(face, CX - RX - 20, CY - RY - 20); c.restore();
  const plan = clockPlan(B, p); let hh = 0, h2 = null;
  for (const tk of plan){ const k = p.t - tk.t; if (p.t > tk.t - .15){ hh = tk.hs[0]; h2 = tk.hs[1] ?? null; }
    if (k < -CWARN || k > .55) continue;
    for (const h of tk.hs){ const a = hAng(h); c.save(); c.beginPath(); c.moveTo(CX, CY); c.ellipse(CX, CY, RX, RY, 0, a - Math.PI/6, a + Math.PI/6); c.closePath();
      if (k < 0){ c.fillStyle = `rgba(255,80,80,${.12 + .14*cl((k + CWARN)/CWARN) + .08*Math.abs(Math.sin(k*12))})`; c.fill(); c.setLineDash([10, 7]); c.strokeStyle = 'rgba(255,120,120,.85)'; c.lineWidth = 3; c.stroke(); }
      else { c.globalAlpha = cl((.55 - k)/.55); c.fillStyle = 'rgba(220,30,40,.62)'; c.fill(); } c.restore(); } }
  // 바늘 (시침 · 분침) — 째깍 넘어가요
  const hand = (h, L, w, col) => { const a = hAng(h); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + Math.cos(a)*RX*L, CY + Math.sin(a)*RY*L); c.stroke(); };
  c.save(); c.globalAlpha = al; hand(hh, .82, 12, '#2a1a10'); hand(hh, .8, 5, '#b8913f'); if (h2 != null){ hand(h2, .9, 7, '#2a1a10'); hand(h2, .88, 3, '#d8b860'); } c.fillStyle = '#b8913f'; c.beginPath(); c.ellipse(CX, CY, 16, 9, 0, 0, 7); c.fill(); c.restore();
  for (const tk of plan){ const k = p.t - tk.t; if (k > 0 && k < .45) text(c, '째깍!', CX, CY - RY - 22 - k*20, 26, `rgba(255,214,200,${1 - k/.45})`); } }

// ===== ② 똑같은 열쇠 (1.6 초 늦게 따라오는 복제 · 멈추면 맞음) =====
const DELAY = 1.6, CL_ON = 1.0, CL_HIT = 2.0;
function histTick(B){ const now = B.now; for (const o of B.all){ let h = L.hist.get(o.uid); if (!h){ h = []; L.hist.set(o.uid, h); } const z = h[h.length - 1];
    if (!z || now - z[0] > 45) h.push([now, o.x, o.y]); while (h.length > 2 && now - h[0][0] > 2600) h.shift(); }
  if (L.hist.size > 24) for (const k of L.hist.keys()) if (!B.all.some(o => o.uid === k)) L.hist.delete(k); }
function clonePos(B, uid){ const h = L.hist.get(uid); if (!h || !h.length) return null; const t = B.now - DELAY*1000; if (t <= h[0][0]) return [h[0][1], h[0][2]];
  for (let i = h.length - 1; i > 0; i--){ const a = h[i - 1], b = h[i]; if (t >= a[0]){ const u = cl((t - a[0])/((b[0] - a[0]) || 1)); return [lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; } } return [h[0][1], h[0][2]]; }
function cloneTick(B, p){ const me = B.me; if (!me || me.down || p.t < CL_HIT || p.t > p.len - .3) return; const q = clonePos(B, me.uid);
  if (q && dist(q[0], q[1], me.x, me.y) < 26){ if (B.hurt(B.lo + 60, 'cl' + p.seed + Math.floor(p.t/1.5))) B.sfx('slam', 300); } }
function cloneTop(B, p, c){ if (p.t < CL_ON) return; const al = cl((p.t - CL_ON)/.8)*cl((p.len - p.t)*2)*.62;
  for (const o of B.alive){ const q = clonePos(B, o.uid); if (q) A.ghost(c, q[0], q[1], al, (o.nick || '') + '?'); } }

// ===== ③ 철컥 (자물쇠 우리 · 친구가 맞는 열쇠를 골라 꺼내 줘요) =====
const WAVES = [.8, 4.9];
function cageHost(B, p){ const cg = B.bs.cg;
  for (let w = 0; w < WAVES.length; w++){ if (p.t < WAVES[w] || p.t > WAVES[w] + 1.2 || (cg && cg.s === p.seed && cg.w >= w) || !B.alive.length) continue;
    const rng = B.rng(p.seed + 'cg' + w), pool = B.alive.slice(), n = Math.max(1, Math.ceil(pool.length/2)), sp = [];
    for (let i = 0; i < n && pool.length; i++){ const o = pool.splice(Math.floor(rng()*pool.length), 1)[0]; sp.push({x:Math.round(cl(o.x, 160, 940)), y:Math.round(cl(o.y, 330, 790)), ok:Math.floor(rng()*3)}); }
    const seed = p.seed, now = B.now; tx(B, 'cg', bs => (bs.cg && bs.cg.s === seed && bs.cg.w >= w) ? undefined : {...bs, cg:{s:seed, w, at:now, sp}}); return; }
  if (cg && cg.s === p.seed && !cg.c && B.now >= cg.at + LAND*1000){ const list = [];
    for (const o of B.alive) for (let i = 0; i < cg.sp.length; i++){ const s = cg.sp[i]; if (Math.abs(o.x - s.x) < 60 && Math.abs(o.y - s.y) < 36){ list.push([o.uid, i]); break; } }
    const seed = cg.s, w = cg.w; tx(B, 'cgc', bs => (!bs.cg || bs.cg.s !== seed || bs.cg.w !== w || bs.cg.c) ? undefined : {...bs, cg:{...clone(bs.cg), c:list}}); } }
function canPick(B, p, i){ const me = B.me; if (!me || me.down) return false; if (cageOf(B, p, me.uid) < 0) return true;
  return B.alive.every(o => cageOf(B, p, o.uid) >= 0); } // 갇힌 사람은 모두 갇혔을 때만 스스로
function chooseKey(B, i, k){ const p = active(B), cg = B.bs.cg; if (p.id !== 'cage' || !cg || cg.s !== p.seed || !cg.c || (cg.f && cg.f[i]) || ((cg.b && cg.b[i]) | 0) & (1 << k)) return false;
  if (!cg.c.some(([, j]) => j === i) || !canPick(B, p, i)) return false; const s = cg.sp[i], ok = s.ok === k, [kx, ky] = KEYPOS[k];
  if (ok){ B.sfx('slam', 100); B.fx('철컥', s.x, s.y - 130, '#c8ffd0'); } else { B.hurt(B.lo + 40, 'wk' + cg.s + cg.w + i + k); B.fx('삐—', s.x + kx, s.y + ky - 30, '#ff8a8a'); }
  const seed = cg.s, w = cg.w, now = B.now;
  tx(B, 'key' + i + k, bs => { const c2 = bs.cg; if (!c2 || c2.s !== seed || c2.w !== w) return undefined; const n = clone(c2);
    if (ok){ n.f = {...(n.f || {}), [i]:now}; } else { n.b = {...(n.b || {}), [i]:((n.b || {})[i] | 0) | (1 << k)}; } return {...bs, cg:n}; }, 0);
  return true; }
function cageKeys(B, p){ const cg = B.bs.cg, out = []; if (p.id !== 'cage' || !cg || cg.s !== p.seed || !cg.c || B.now > cg.at + (LAND + HOLD)*1000) return out;
  cg.sp.forEach((s, i) => { if ((cg.f && cg.f[i]) || !cg.c.some(([, j]) => j === i)) return; KEYPOS.forEach(([kx, ky], k) => { if (!(((cg.b && cg.b[i]) | 0) & (1 << k))) out.push({i, k, x:s.x + kx, y:s.y + ky}); }); }); return out; }
function cageTick(B, p){ const me = B.me, cg = B.bs.cg; if (!me || !cg || cg.s !== p.seed) return;
  if (B.now >= cg.at && B.now < cg.at + 200 && once('cgw' + cg.s + cg.w)) B.sfx('warn', 200);
  if (B.now >= cg.at + LAND*1000 && once('cgl' + cg.s + cg.w)) B.sfx('slam', 200);
  if (me.down) return; const i = cageOf(B, p, me.uid);
  if (i >= 0){ const s = cg.sp[i]; B.ctl.lock = true; if (dist(me.x, me.y, s.x, s.y) > 6) B.tp(s.x, s.y); }
  // 시간 안에 못 나오면 우리가 조여요
  const end = cg.at + (LAND + HOLD)*1000; if (cg.c && B.now >= end && B.now < end + 900){ for (const [u, j] of cg.c) if (u === me.uid && !(cg.f && cg.f[j])){ if (B.hurt(B.lo + 100, 'cr' + cg.s + cg.w)){ B.sfx('slam', 100); B.shake(); } } } }
function cageFloor(B, p, c){ const cg = B.bs.cg; if (!cg || cg.s !== p.seed) return; const k = (B.now - cg.at)/1000; if (k < 0 || k > LAND) return;
  for (const s of cg.sp) warnRect(c, s.x - 62, s.y - 36, 124, 72, k/LAND, '255,180,60'); }
function cageTop(B, p, c){ const cg = B.bs.cg; if (!cg || cg.s !== p.seed) return; const k = (B.now - cg.at)/1000, end = LAND + HOLD; if (k < LAND - .35 || k > end + 1) return;
  cg.sp.forEach((s, i) => { const pat = A.TEETH[s.ok], caught = cg.c ? cg.c.some(([, j]) => j === i) : null, fr = cg.f && cg.f[i];
    let y = s.y, al = 1, sh = 0;
    if (k < LAND) y = lerp(s.y - 320, s.y, ease((k - LAND + .35)/.35));
    else if (caught === false) { al = cl(1 - (k - LAND - .3)/.4); y = s.y - Math.max(0, k - LAND - .3)*120; }
    else if (fr){ const u = (B.now - fr)/1000; al = cl(1 - u/.8); y = s.y - u*220; }
    else if (k > end){ al = cl(1 - (k - end)/.5); sh = Math.sin(B.now/20)*4; }
    else if (k > end - 1) sh = Math.sin(B.now/25)*3*(k - end + 1);
    if (al > .01) A.cage(c, s.x + sh, y, al, pat); });
  for (const q of cageKeys(B, p)){ const s = cg.sp[q.i], glow = q.k === s.ok && k > LAND + HOLD - 1.2; A.keyTeeth(c, q.x, q.y - 10 + Math.sin(B.now/300 + q.k)*3, A.TEETH[q.k], .9, glow); } }

// ===== ④ 금고 다이얼 (바닥 숫자판을 차례로 밟으면 금고가 열려요 · 닫혀 있으면 무적) =====
const PLATES = (() => { const o = {}; '1234567890'.split('').forEach((d, i) => { o[d] = [280 + (i%5)*135, i < 5 ? 652 : 738]; }); return o; })();
const PRX = 52, PRY = 24, OPEN = 5.0;
const CODES2 = ['23', '24', '19', '17', '21', '45', '74', '31'], CODES3 = ['104', '745', '231', '248', '917'];
const codeFor = (B, seed, k) => k === 0 ? (B.alive.length > 2 ? '231' : '23') : k === 1 ? (B.alive.length > 2 ? '248' : '24') : (B.alive.length > 2 ? CODES3 : CODES2)[B.hash(seed + 'dl' + k) % (B.alive.length > 2 ? CODES3 : CODES2).length];
const plateAt = (x, y) => { for (const d in PLATES){ const [px, py] = PLATES[d]; if (inEll(x, y, px, py, PRX + 4, PRY + 8)) return d; } return null; };
function dialState(B, p){ const dl = B.bs.dl; return dl && dl.s === p.seed ? dl : null; }
const vaultOpenDial = (B, dl) => !!(dl && dl.op && B.now < dl.op + OPEN*1000);
function dialHost(B, p){ const dl = dialState(B, p), seed = p.seed, now = B.now;
  if (!dl){ const code = codeFor(B, seed, 0); tx(B, 'dl', bs => bs.dl && bs.dl.s === seed ? undefined : {...bs, dl:{s:seed, k:0, p:0, op:0, code}}); return; }
  if (dl.op && now > dl.op + OPEN*1000){ const k = dl.k, code = codeFor(B, seed, k + 1); tx(B, 'dl', bs => bs.dl && bs.dl.s === seed && bs.dl.k === k ? {...bs, dl:{s:seed, k:k + 1, p:0, op:0, code}} : undefined); return; }
  for (const o of B.alive){ const d = plateAt(o.x, o.y), pv = L.prevPlate.get(o.uid) ?? null; L.prevPlate.set(o.uid, d); if (d == null || d === pv || dl.op) continue;
    const k = dl.k; B.tx(bs => { const z = bs.dl; if (!z || z.s !== seed || z.k !== k || z.op) return undefined; const need = z.code[z.p];
      if (d === need){ const np = z.p + 1; return {...bs, dl:{...z, p:np, op:np >= z.code.length ? now : 0}}; }
      if (z.p > 0 && d === z.code[z.p - 1]) return undefined; return {...bs, dl:{...z, p:0, bad:{d, at:now}}}; }); } }
function dialTick(B, p){ const me = B.me, dl = dialState(B, p); if (!me || me.down || !dl){ L.myPlate = null; return; }
  const d = plateAt(me.x, me.y); if (d != null && d !== L.myPlate && !dl.op){ const need = dl.code[dl.p];
    if (d === need) B.sfx('hit', 100); else if (!(dl.p > 0 && d === dl.code[dl.p - 1])){ if (B.hurt(B.lo + 60, 'dw' + p.seed + dl.k + dl.p + d)) B.fx('삐—', PLATES[d][0], PLATES[d][1] - 40, '#ff8a8a'); } }
  L.myPlate = d;
  if (dl.op && B.now - dl.op < 400 && once('dlo' + p.seed + dl.k)){ B.sfx('slam', 100); B.shake(); } }
function dialFloor(B, p, c){ const dl = dialState(B, p), al = cl(p.t*2)*cl((p.len - p.t)*2); if (al <= 0) return; const done = dl ? (dl.op ? dl.code.length : dl.p) : 0;
  c.save(); c.globalAlpha = al; for (const d in PLATES){ const [x, y] = PLATES[d], lit = dl && dl.code.slice(0, done).includes(d), bad = dl && dl.bad && dl.bad.d === d && B.now - dl.bad.at < 900;
    c.fillStyle = bad ? 'rgba(255,60,70,.6)' : lit ? 'rgba(120,230,150,.55)' : 'rgba(40,52,48,.82)'; c.beginPath(); c.ellipse(x, y, PRX, PRY, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(210,220,200,.7)'; c.lineWidth = 3; c.stroke();
    c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, PRX*.75, PRY*.75, 0, 0, 7); c.stroke(); text(c, d, x, y + 1, 30, '#f0f4e8'); } c.restore(); }
function dialTop(B, p, c, bx, by){ const dl = dialState(B, p); if (!dl) return; const al = cl(p.t*2)*cl((p.len - p.t)*2), open = vaultOpenDial(B, dl), n = dl.code.length, done = open ? n : dl.p;
  c.save(); c.globalAlpha = al; const w = 40*n + 24, y0 = by - 300; c.fillStyle = 'rgba(10,14,12,.86)'; c.beginPath(); c.roundRect(bx - w/2, y0, w, 44, 10); c.fill(); c.strokeStyle = open ? '#9affb0' : '#b8913f'; c.lineWidth = 2; c.stroke();
  for (let i = 0; i < n; i++) text(c, i < done ? dl.code[i] : '?', bx - (n - 1)*20 + i*40, y0 + 23, 34, i < done ? '#9affb0' : '#ffd080'); c.restore();
  if (!open){ text(c, dl.code, bx, by - 66, 22, '#3a2a10', 'center', 'rgba(255,240,200,.6)'); } }

// ===== ⑤ 24 번째 꼬리표 (노리는 몸을 금고로 끌어가요 · 친구가 옆에 붙으면 멈추고 끊어져요) =====
const CHAINS = [[.6, 5.6], [6.4, 11.4]], PULL = 72, GUARD = 2.2;
function chainNow(B, p){ for (let j = 0; j < CHAINS.length; j++){ const [a, b] = CHAINS[j]; if (p.t >= a && p.t < b) return {j, a, b}; } return null; }
function chainState(B, p, j){ const ch = B.bs.ch; return ch && ch.s === p.seed && ch.j === j ? ch : null; }
function chainHost(B, p, bx, by){ const cn = chainNow(B, p), T = B.target; if (!cn || !T || T.down) return; const ch = chainState(B, p, cn.j), seed = p.seed, j = cn.j, now = B.now;
  if (!ch){ tx(B, 'ch', bs => chainState({bs}, {seed}, j) ? undefined : {...bs, ch:{s:seed, j, g:0, brk:0}}); return; }
  if (ch.brk) return;
  const guard = B.alive.some(o => o.uid !== T.uid && dist(o.x, o.y, T.x, T.y) < 92) || (B.alive.length === 1 && dist(T.x, T.y, bx, by) > 230);
  if (guard && !ch.g) tx(B, 'chg', bs => { const z = bs.ch; return z && z.s === seed && z.j === j && !z.g && !z.brk ? {...bs, ch:{...z, g:now}} : undefined; });
  else if (!guard && ch.g && now - ch.g < GUARD*1000) tx(B, 'chg', bs => { const z = bs.ch; return z && z.s === seed && z.j === j && z.g && !z.brk ? {...bs, ch:{...z, g:0}} : undefined; });
  else if (guard && ch.g && now - ch.g >= GUARD*1000) tx(B, 'chb', bs => { const z = bs.ch; return z && z.s === seed && z.j === j && !z.brk ? {...bs, ch:{...z, brk:now}} : undefined; }); }
function chainTick(B, p, bx, by){ const cn = chainNow(B, p), me = B.me, T = B.target; if (!cn || !T) return; const ch = chainState(B, p, cn.j);
  if (ch && ch.brk && B.now - ch.brk < 500 && once('chb' + p.seed + cn.j)) B.sfx('slam', 100);
  if (p.t - cn.a < .2 && once('chs' + p.seed + cn.j)) B.sfx('warn', 200);
  if (!me || me.down || me.uid !== T.uid || (ch && (ch.brk || ch.g))) return;
  const k = cl((p.t - cn.a - .3)/.6), dx = bx - me.x, dy = by - me.y, d = Math.hypot(dx, dy) || 1;
  if (k > 0) B.ctl.drift = [dx/d*PULL*k, dy/d*PULL*k];
  if (d < 80 && k > 0){ if (B.hurt(B.lo + 140, 'cd' + p.seed + cn.j + Math.floor(p.t/2.5))){ B.push(-dx, -dy, 170); B.sfx('slam', 100); B.shake(); } } }
function chainTop(B, p, c, bx, by){ const cn = chainNow(B, p), T = B.target; if (!T) return; let j = cn ? cn.j : -1, ch = j >= 0 ? chainState(B, p, j) : null;
  if (!cn){ for (let i = 0; i < CHAINS.length; i++){ const z = chainState(B, p, i); if (z && z.brk && B.now - z.brk < 900){ j = i; ch = z; } } if (!ch) return; }
  const ox = bx, oy = by - 70, tx_ = T.x, ty_ = T.y - 30, brk = ch && ch.brk ? (B.now - ch.brk)/900 : 0, prot = ch && ch.g && !ch.brk;
  if (brk >= 1) return; const grow = cn ? cl((p.t - cn.a)/.5) : 1, n = 16;
  c.save(); c.globalAlpha = 1 - brk; for (let i = 0; i <= n*grow; i++){ const u = i/n, sp = brk*60*(i%2 ? 1 : -1)*Math.sin(u*Math.PI);
    const x = lerp(ox, tx_, u) + sp, y = lerp(oy, ty_, u) + Math.sin(u*Math.PI)*(prot ? 10 : 26) + Math.sin(B.now/120 + i)*2 + brk*brk*80*u;
    c.strokeStyle = prot ? '#9aa8a0' : '#c8b070'; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, 9, 5, Math.atan2(ty_ - oy, tx_ - ox) + (i%2)*1.57, 0, 7); c.stroke(); }
  A.tag(c, tx_ + 30, ty_ - 44, `24 · ${B.targetNick}의 집`, -.2 + Math.sin(B.now/300)*.08, 1.5);
  c.setLineDash([7, 6]); c.lineWidth = 3; c.strokeStyle = prot ? 'rgba(130,255,160,.9)' : 'rgba(255,90,90,.75)'; c.beginPath(); c.ellipse(T.x, T.y, 92, 36, 0, 0, 7); c.stroke(); c.setLineDash([]);
  if (prot){ const u = cl((B.now - ch.g)/(GUARD*1000)); c.strokeStyle = '#9affb0'; c.lineWidth = 6; c.beginPath(); c.arc(T.x, T.y - 26, 40, -Math.PI/2, -Math.PI/2 + u*Math.PI*2); c.stroke(); }
  c.restore(); }

// ===== ⑥ 오르골 (음마다 빛나는 원 안만 안전 → 반지 → 기절) =====
const NT0 = 1.8, NTG = 1.25, NTN = 7, CRX = 96, CRY = 42, RING_T = 10.0;
const mbox = B => [B.hx + 205, B.hy + 12], ringAt = B => [B.hx + 150, B.hy + 92];
function musicPlan(B, p){ const n2 = B.alive.length > 4 ? 2 : 1, key = p.seed + ':' + n2; if (L.muK === key) return L.mu; const rng = B.rng(p.seed + 'mu'), out = []; let prev = [B.hx - 60, B.hy + 120];
  for (let i = 0; i < NTN; i++){ let best = null; for (let tries = 0; tries < 24; tries++){ const a = rng()*Math.PI*2, d = 110 + rng()*95, x = cl(B.hx + Math.cos(a)*d, 190, 910), y = cl(B.hy + 30 + Math.sin(a)*d*.6, 420, 780), dd = dist(x, y, prev[0], prev[1]);
      if (dd > 90 && dd < 230){ best = [x, y]; break; } if (!best || Math.abs(dd - 160) < Math.abs(dist(best[0], best[1], prev[0], prev[1]) - 160)) best = [x, y]; }
    const cs = [best]; if (n2 > 1) cs.push([cl(2*B.hx - best[0], 190, 910), cl(2*(B.hy + 30) - best[1], 420, 780)]); out.push({t:NT0 + i*NTG, cs}); prev = best; }
  L.muK = key; return (L.mu = out); }
function musicTick(B, p){ const me = B.me, plan = musicPlan(B, p);
  plan.forEach((nt, i) => { const k = p.t - nt.t; if (k >= 0 && k < .3){ if (once('mn' + p.seed + i)) B.sfx('slam', 150);
      if (me && !me.down && !nt.cs.some(([x, y]) => inEll(me.x, me.y, x, y, CRX, CRY))) B.hurt(B.lo + 40, 'mu' + p.seed + i); } });
  if (p.t > RING_T - .4 && once('mo' + p.seed)) B.sfx('warn', 100);
  const mu = B.bs.mu, got = mu && mu.s === p.seed; if (got || !me || me.down || p.t < RING_T) return; const [rx, ry] = ringAt(B);
  if (dist(me.x, me.y, rx, ry) < 44 && !(L.pend.mu > performance.now())){ L.pend.mu = performance.now() + 1500; const seed = p.seed, now = B.now, uid = me.uid;
    B.tx(bs => bs.mu && bs.mu.s === seed ? undefined : {...bs, mu:{s:seed, got:uid, at:now}, stun:now + 8000}); } }
function musicFloor(B, p, c){ const plan = musicPlan(B, p);
  plan.forEach((nt, i) => { const k = p.t - nt.t; if (k < -NTG || k > .5) return; c.save(); c.globalAlpha = cl((k + NTG)*3)*cl((.5 - k)*3);
    for (const [x, y] of nt.cs){ c.fillStyle = 'rgba(255,240,180,.2)'; c.beginPath(); c.ellipse(x, y, CRX, CRY, 0, 0, 7); c.fill(); c.strokeStyle = '#ffe9a0'; c.lineWidth = 4; c.setLineDash(k < 0 ? [8, 6] : []); c.stroke(); c.setLineDash([]);
      if (k < 0){ c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, CRX*cl(-k/NTG), CRY*cl(-k/NTG), 0, 0, 7); c.stroke(); } } c.restore(); });
  plan.forEach(nt => { const k = p.t - nt.t; if (k < 0 || k > .45) return; c.save(); c.globalAlpha = (1 - k/.45)*.5; c.fillStyle = '#d02838'; c.beginPath(); c.rect(0, 240, B.W, B.H - 240); for (const [x, y] of nt.cs) c.ellipse(x, y, CRX, CRY, 0, 0, 7); c.fill('evenodd'); c.restore(); });
  const [mx, my] = mbox(B); A.musicBox(c, mx, my, ease((p.t - RING_T + .5)/.6), B.now/1000); }
const SYM = ['♪', '♫', '♩', '♬'];
function musicTop(B, p, c){ const [mx, my] = mbox(B), plan = musicPlan(B, p);
  plan.forEach((nt, i) => { const k = p.t - nt.t; if (k < 0 || k > 1) return; for (let j = 0; j < 4; j++) text(c, SYM[(i + j)%4], mx + Math.cos(j*1.7 + i)*k*110, my - 40 - k*70 + Math.sin(j*2)*24, 24, `rgba(255,233,160,${1 - k})`); });
  const mu = B.bs.mu, got = mu && mu.s === p.seed; if (p.t < RING_T - .4) return; const [rx, ry] = ringAt(B);
  if (!got){ const u = ease((p.t - RING_T + .4)/.4); A.ring(c, lerp(mx, rx, u), lerp(my - 40, ry, u) - Math.sin(u*Math.PI)*60 + Math.sin(B.now/250)*2, 1.2); text(c, '만석 ♥ 금자', rx, ry - 34, 18, '#ffe9a0'); } }

// ===== ⑦ 빈집 (어둠 · 보이지 않는 보스를 짤랑 소리로 찾아 둘러싸기) =====
const LEG = 2.6, MOVE = .9, REVEAL = 4000, SNEAK = 3.4;
function darkPath(B, p){ if (L.dpK === p.seed) return L.dp; const rng = B.rng(p.seed + 'path'), pts = [[B.hx, B.hy]];
  for (let i = 0; i < 9; i++){ const [px, py] = pts[pts.length - 1]; let x = 0, y = 0; for (let t = 0; t < 14; t++){ x = 230 + rng()*640; y = 400 + rng()*350; if (dist(x, y, px, py) > 230) break; } pts.push([x, y]); }
  L.dpK = p.seed; return (L.dp = pts); }
function darkPosT(B, p, tp){ const pts = darkPath(B, p), tq = Math.floor(Math.max(0, tp)/STEP)*STEP, i = Math.min(pts.length - 2, Math.floor(tq/LEG)), u = ease(cl((tq - i*LEG)/MOVE)), a = pts[i], b = pts[i + 1]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
const revealed = (B, p) => { const dk = B.bs.dk; return !!(dk && dk.s === p.seed && B.now - dk.at < REVEAL); };
function darkPos(B, p){ const dk = B.bs.dk; if (dk && dk.s === p.seed && B.now - dk.at < REVEAL) return darkPosT(B, p, p.t - (B.now - dk.at)/1000); return darkPosT(B, p, p.t); }
const hidden = B => { const p = cur(B); return p.id === 'dark' && !revealed(B, p) && !stunned(B); };
function darkHost(B, p, bx, by, dt){ if (revealed(B, p) || p.t < 1 || p.t > p.len - .5){ L.dkHold = 0; return; }
  const need = Math.min(3, B.alive.length), near = B.alive.filter(o => inEll(o.x, o.y, bx, by, 165, 105)).length;
  if (need && near >= need){ L.dkHold += dt; if (L.dkHold > .4){ const seed = p.seed, now = B.now; tx(B, 'dk', bs => { const z = bs.dk; if (z && z.s === seed && now - z.at < REVEAL) return undefined; return {...bs, dk:{s:seed, c:(z && z.s === seed ? z.c : 0) + 1, at:now}}; }, 600); } }
  else L.dkHold = 0; }
function sneakShot(B, p){ if (p.t < 1.2 || p.t > p.len - .8 || !B.alive.length) return null; const bt = beat(B, SNEAK); if (bt.t > 1.35) return null;
  const key = 'sn' + B.r.bossAt + ':' + bt.n; let s = L.lines.get(key); if (!s){ const tg = B.alive[B.hash(key) % B.alive.length]; s = {key, x:tg.x + (B.hash(key + 'x') % 2 ? 30 : -30), y:tg.y - 4, uid:tg.uid}; L.lines.set(key, s); } return {...s, t:bt.t}; }
function darkTick(B, p, bx, by){ const me = B.me, s = sneakShot(B, p);
  if (s && me && !me.down){ if (s.uid === me.uid && s.t < .15 && once('snw' + s.key)) B.sfx('warn', 200); if (s.t >= 1 && s.t < 1.3 && inEll(me.x, me.y, s.x, s.y, 66, 32)){ if (B.hurt(B.lo + 80, s.key)) B.sfx('slam', 100); } }
  const dk = B.bs.dk; if (dk && dk.s === p.seed && B.now - dk.at < 600 && once('dkc' + p.seed + dk.c)){ B.sfx('slam', 100); B.shake(); sayL('들켰네.', 1600); }
  // 짤랑: 가까이 있을수록 자주 들려요
  if (me && !revealed(B, p)){ const d = dist(me.x, me.y, bx, by), per = d < 200 ? .55 : d < 380 ? 1.1 : 2.2, n = Math.floor(B.now/1000/per); if (d < 520 && once('jg' + per + ':' + n)) B.sfx('warn', 250); } }
function darkFloor(B, p, c){ const s = sneakShot(B, p); if (!s) return; if (s.t < 1) warnCircle(c, s.x, s.y, 66, 32, s.t, '255,170,60');
  else if (s.t < 1.35){ c.save(); c.globalAlpha = cl((1.35 - s.t)/.35); c.strokeStyle = '#ffb060'; c.lineWidth = 5; c.lineCap = 'round'; for (let i = -1; i <= 1; i++){ c.beginPath(); c.moveTo(s.x - 50, s.y - 30 + i*14); c.lineTo(s.x + 50, s.y + 10 + i*14); c.stroke(); } c.restore(); } }

// ===== 움직임 연출: 시곗바늘 잔상 · '철컥' =====
function trailFloor(B, c, bx, by){ if (hidden(B)) return; const n = Math.floor(B.t/STEP);
  c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = '#b8f0c8'; c.lineCap = 'round';
  for (let k = 1; k <= 7; k++){ const tk = (n - k)*STEP, [px, py] = posAt(shift(B, tk - B.t)), d = dist(px, py, bx, by); if (d < 8) continue;
    const age = (B.t - tk)/(8*STEP), al = .5*(1 - age)*cl(d/16); if (al <= .01) continue; const hx = px + (px - bx)*1.2, hy = py - 110 + (py - by)*1.2;
    c.globalAlpha = al; if (k <= 2){ c.setLineDash([3, 7]); c.lineWidth = 1.5; c.beginPath(); c.arc(hx, hy, 42, 0, 7); c.stroke(); c.setLineDash([]); }
    const a1 = tk*5 - (B.t - tk)*9, a2 = -tk*11 + (B.t - tk)*14; c.lineWidth = 4; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + Math.cos(a1)*28, hy + Math.sin(a1)*28); c.stroke();
    c.lineWidth = 2.2; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + Math.cos(a2)*42, hy + Math.sin(a2)*42); c.stroke(); }
  c.restore(); }
function trailTop(B, c){ if (hidden(B)) return; const n = Math.floor(B.t/STEP);
  for (let k = 0; k < 2; k++){ const m = n - k, tm = m*STEP, a = posAt(shift(B, tm - B.t)), b = posAt(shift(B, tm - STEP - B.t)), d = dist(a[0], a[1], b[0], b[1]), age = (B.t - tm)/(2*STEP); if (d < 9) continue;
    const sx = ((m*37)%5 - 2)*18; text(c, '철컥', a[0] + sx + 60*Math.sign(sx || 1), a[1] - 40 - age*14, 17, `rgba(240,248,232,${cl(d/14)*(1 - age)*.85})`); } }

// ===== 50% 변신: 거꾸로 미친 듯 도는 시계판 · 화면 가장자리에서 감기는 쇠사슬 · 철컥 잠기는 자물쇠 =====
function handsAt(hk){ const sp = hk < LOCK ? -(Math.pow(hk, 2.6)*2.2) : -(Math.pow(LOCK, 2.6)*2.2) + Math.sin(hk*60)*.03*cl(1 - (hk - LOCK)/1.2) + Math.max(0, hk - 3.2)*.05;
  return [-Math.PI/2 + sp, -Math.PI/2 + sp*12, -Math.PI/2 + (hk < LOCK ? sp*40 : sp*40 + (hk - LOCK))]; }
function transScreen(B, c, w, h){ const hk = B.ph2; if (B.phase !== 2 || hk < 0 || hk > TRANS) return; const env = cl(hk/.5)*cl((TRANS - .1 - hk)/.9);
  tint(c, w, h, '#020604', env*.6); const [ah, am, as] = handsAt(hk), R0 = Math.min(w, h)*.47, rot = hk < LOCK ? Math.sin(hk*23)*.02*hk : 0;
  A.bigClock(c, w/2, h*.47, R0, env*.85, ah, am, as, rot);
  if (hk < LOCK){ c.save(); c.globalAlpha = env*.4*cl(hk/LOCK); c.strokeStyle = '#c8ffd8'; c.lineWidth = 2; for (let i = 0; i < 3; i++){ const a = am - .25*(i + 1); c.beginPath(); c.arc(w/2, h*.47, R0*(.72 - i*.03), a, a + .25); c.stroke(); } c.restore(); }
  // 쇠사슬: 화면 가장자리 → 보스
  const [bx, by] = bossPos(B), [sx, sy] = B.toScreen(bx, by - 90), z = B.view.zoom || 1, fade = cl((TRANS - .2 - hk)/.8)*(hk > 3 ? .55 + .45*cl((3.5 - hk)/.5) : 1);
  if (hk > .9){ c.save(); c.globalAlpha = fade; const FROM = [[-30, h*.22], [w + 30, h*.2], [-30, h*.62], [w + 30, h*.66], [w*.22, h + 30], [w*.78, h + 30]];
    FROM.forEach(([fx, fy], i) => { const pr = ease((hk - .95 - i*.07)/.75); if (pr <= 0) return; const Ln = Math.hypot(sx - fx, sy - fy), nx = -(sy - fy)/Ln, ny = (sx - fx)/Ln, amp = (hk < LOCK ? 110 : 110*(1 - ease((hk - LOCK)/.25)))*(i%2 ? 1 : -1), n = Math.floor(Ln/20);
      let px = fx, py = fy; for (let j = 0; j <= n*pr; j++){ const u = j/n, ww = Math.sin(u*Math.PI)*amp*(1 - u*.3), x = lerp(fx, sx, u) + nx*ww + (hk > LOCK && hk < LOCK + .5 ? Math.sin(hk*90 + j)*3 : 0), y = lerp(fy, sy, u) + ny*ww; A.chainLink(c, x, y, Math.atan2(y - py, x - px), j); px = x; py = y; } });
    if (hk > LOCK - .1){ const k = cl((hk - LOCK + .1)/.2), rr = 100*z; c.globalAlpha = fade*k; for (const [dy, ry] of [[-40*z, 40*z], [30*z, 34*z]]) for (let j = 0; j < 26; j++){ const a = j/26*Math.PI*2; if (Math.sin(a) < -.2) continue; A.chainLink(c, sx + Math.cos(a)*rr, sy + dy + Math.sin(a)*ry*.5, a + Math.PI/2, j); } }
    if (hk > 1.3){ const sc = (hk < LOCK ? 1.7 - .7*ease((hk - 1.3)/.6) : 1)*Math.max(.55, z*.9); c.globalAlpha = fade; A.padlock(c, sx, sy + 20*z, sc, hk >= LOCK); }
    c.restore(); }
  if (hk > LOCK && hk < LOCK + 1){ const k = hk - LOCK; c.save(); c.globalAlpha = (1 - k)*.8; c.strokeStyle = '#fff6d0'; c.lineWidth = 4; for (let i = 0; i < 16; i++){ const a = i/16*Math.PI*2, r0 = (70 + k*160)*z; c.beginPath(); c.moveTo(sx + Math.cos(a)*r0, sy + Math.sin(a)*r0*.7); c.lineTo(sx + Math.cos(a)*(r0 + 60*z), sy + Math.sin(a)*(r0 + 60*z)*.7); c.stroke(); } c.restore();
    if (k < .45) tint(c, w, h, '#e0f0d8', .6*(1 - k/.45));
    c.save(); c.translate(w/2, h*.3 - (1 - ease(k*3))*30); c.rotate(-.06); c.scale(1 + .25*(1 - ease(k*4)), 1 + .25*(1 - ease(k*4))); text(c, '철컥!', 0, 0, Math.min(140, w*.3), `rgba(255,242,200,${1 - ease((k - .5)*2)})`); c.restore(); } }
function transTick(B){ const hk = B.ph2; if (B.phase !== 2 || hk < 0 || hk > TRANS) return; const key = B.r.rageAt;
  if (hk > .9 && hk < 1.6 && once('tw' + key)) B.sfx('warn', 0);
  if (hk >= LOCK && hk < LOCK + .6 && once('tl' + key)){ B.sfx('slam', 0); B.shake(); }
  if (hk >= 2.4 && hk < 3.5 && once('ts' + key)) sayL(`다음 집은 ${B.targetNick}네야.`, 3000); }

// ===== 그림 =====
function vaultOpen(B, p){ if (B.phase < 2) return false; if (B.phase === 2 && B.ph2 < LOCK) return false; if (p.id === 'dial'){ const dl = dialState(B, p); return !dl || vaultOpenDial(B, dl) || p.t > p.len - .4; } return true; }
function drawBear(B, c, bx, by){ const p = active(B), hk = B.phase === 2 ? B.ph2 : -1; let sh = 0, al = 1;
  if (hk >= 0 && hk < 2.2) sh = Math.sin(B.now*.07)*6*(1 - hk/2.2); if (stunned(B)) sh = Math.sin(B.now/300)*6;
  if (p.id === 'dark' && revealed(B, p)){ const k = (B.now - B.bs.dk.at)/REVEAL; al = k > .85 ? cl((1 - k)/.15) : 1; }
  const img = A.bear(vaultOpen(B, p), B.targetNick || '???'), w = A.BEAR.w*BK, h = A.BEAR.h*BK;
  c.save(); c.globalAlpha = al; c.drawImage(img, bx - A.BEAR.fx*BK + sh, by - A.BEAR.fy*BK, w, h); c.restore(); }

// ===== 이름표 (엔진 모양 그대로 · 어둠에 숨으면 안 보여요 · 말풍선은 여기서) =====
function drawLabel(B, c, x, y, t){ if (hidden(B)) return; const top = y - 262, rage = B.phase >= 2, hk = B.phase === 2 ? B.ph2 : -1, glitchSwap = hk >= 0 && Math.abs(hk - LOCK) < .9 && Math.floor(B.now/50)%2;
  const nm = glitchSwap ? (Math.floor(B.now/33)%2 ? B.name + '???' : B.real) : rage && !(hk >= 0 && hk < LOCK) ? B.real : B.name + '???', w = 190, glit = rage && Math.floor(t/90)%13 === 0;
  c.save(); c.font = 'bold 22px "Dongle",sans-serif'; c.textAlign = 'center'; const tw = c.measureText(nm).width + 34;
  c.fillStyle = 'rgba(12,16,16,.9)'; c.beginPath(); c.roundRect(x - tw/2, top - 44, tw, 28, 8); c.fill(); c.strokeStyle = rage ? '#e0a040' : '#7f9a96'; c.lineWidth = 2; c.stroke();
  if (glit || glitchSwap){ c.fillStyle = 'rgba(230,140,40,.8)'; c.fillText(nm, x - 3, top - 23); c.fillStyle = 'rgba(80,200,190,.7)'; c.fillText(nm, x + 3, top - 23); }
  c.fillStyle = rage ? '#ffe6d0' : '#eef4ee'; c.fillText(nm, x, top - 23);
  c.fillStyle = 'rgba(20,30,28,.9)'; c.fillRect(x - w/2, top - 12, w, 8); c.fillStyle = rage ? '#ff7a5a' : '#a8c890'; c.fillRect(x - w/2, top - 12, w*Math.max(0, B.r.hp)/B.r.max, 8);
  c.font = 'bold 13px "Dongle",sans-serif'; c.fillStyle = '#e0ecd8'; c.fillText(`${Math.max(0, Math.ceil(B.r.hp)).toLocaleString()} / ${B.r.max.toLocaleString()}`, x, top + 9);
  if (stunned(B)) for (let i = 0; i < 3; i++){ const a = t/300 + i*2.1; c.fillStyle = '#ffe14a'; c.font = 'bold 20px sans-serif'; c.fillText('★', x + Math.cos(a)*44, top + 34 + Math.sin(a)*10); }
  if (L.say && performance.now() < L.say.until){ c.font = 'bold 20px "Dongle",sans-serif'; const s = L.say.text, sw = c.measureText(s).width + 26; c.fillStyle = 'rgba(232,226,208,.96)'; c.beginPath(); c.roundRect(x - sw/2, top - 84, sw, 30, 12); c.fill(); c.fillStyle = '#5a2a10'; c.fillText(s, x, top - 63); }
  c.restore(); }

export default {
  reach: 125,
  height: 262,
  pos(B){ return bossPos(B); },
  tick(B, dt){ L.B = B; histTick(B); const p = active(B), [bx, by] = bossPos(B);
    transTick(B);
    // 기절 · 대사
    const st = B.bs.stun || 0; if (st !== L.lastStun){ if (st > B.now && st - 8000 > B.now - 3000){ sayL('그 반지… 어디서….', 2600); B.sfx('slam', 0); B.shake(); } L.lastStun = st; }
    if (p.id && p.id !== 'trans' && p.t < 1.5 && once('say' + p.seed)) sayL(LINES[p.id] || '', 2600);
    basicTick(B, p);
    if (p.id === 'clock') clockTick(B, p);
    else if (p.id === 'clone') cloneTick(B, p);
    else if (p.id === 'cage'){ if (B.host) cageHost(B, p); cageTick(B, p); }
    else if (p.id === 'dial'){ if (B.host) dialHost(B, p); dialTick(B, p); }
    else if (p.id === 'chain'){ if (B.host) chainHost(B, p, bx, by); chainTick(B, p, bx, by); }
    else if (p.id === 'music') musicTick(B, p);
    else if (p.id === 'dark'){ if (B.host) darkHost(B, p, bx, by, dt); darkTick(B, p, bx, by); }
    if (p.id !== 'dial') L.myPlate = null; },
  hitMul(B){ if (stunned(B)) return 2; const p = cur(B);
    if (p.id === 'dial'){ const dl = dialState(B, p); return !dl || vaultOpenDial(B, dl) ? 1.5 : 0; }
    if (p.id === 'dark') return revealed(B, p) ? 2 : 0;
    return 1; },
  swing(B, cx, cy){ const p = active(B); if (p.id !== 'cage') return false;
    for (const q of cageKeys(B, p)) if (dist(cx, cy, q.x, q.y) < 40){ chooseKey(B, q.i, q.k); return true; } return false; },
  tap(B, wx, wy){ const p = active(B), me = B.me; if (!me) return null;
    if (p.id === 'cage') for (const q of cageKeys(B, p)) if (Math.abs(wx - q.x) < 34 && Math.abs(wy - (q.y - 10)) < 28){
      if (cageOf(B, p, me.uid) >= 0){ chooseKey(B, q.i, q.k); return {x:me.x, y:me.y, act:null}; }
      const s = B.bs.cg.sp[q.i], ox = q.k === 0 ? -34 : q.k === 2 ? 34 : 0, oy = q.k === 1 ? 30 : 0; return {x:q.x + ox, y:q.y + oy, act:() => chooseKey(L.B || B, q.i, q.k)}; }
    if (p.id === 'music' && p.t > RING_T - .4){ const [rx, ry] = ringAt(B); if (dist(wx, wy, rx, ry - 10) < 40) return {x:rx, y:ry, act:null}; }
    return null; },
  drawFloor(B, c){ const p = active(B), [bx, by] = bossPos(B);
    if (B.phase >= 2 && B.ph2 > 3){ const t = B.now/1000; A.bigClock(c, 550, 470, 380, .07*cl((B.ph2 - 3)/1.5), -Math.PI/2 + t*.02, -Math.PI/2 + t*.24, -Math.PI/2 + t*1.05); } // 변신 뒤 배경에 남는 큰 시계
    if (p.id === 'clock') clockFloor(B, p, c);
    else if (p.id === 'cage') cageFloor(B, p, c);
    else if (p.id === 'dial') dialFloor(B, p, c);
    else if (p.id === 'music') musicFloor(B, p, c);
    else if (p.id === 'dark') darkFloor(B, p, c);
    const s = basicShot(B, p); if (s && s.t < BWARN){ const L2 = s.len; warnLine(c, s.ox, s.oy, s.ox + Math.cos(s.a)*L2, s.oy + Math.sin(s.a)*L2, s.t, 4, '255,190,80'); }
    trailFloor(B, c, bx, by); },
  drawBody(B, c){ if (hidden(B)) return; const [bx, by] = bossPos(B); drawBear(B, c, bx, by); },
  drawTop(B, c){ const p = active(B), [bx, by] = bossPos(B);
    if (p.id === 'clone') cloneTop(B, p, c);
    else if (p.id === 'cage') cageTop(B, p, c);
    else if (p.id === 'dial') dialTop(B, p, c, bx, by);
    else if (p.id === 'chain') chainTop(B, p, c, bx, by);
    else if (p.id === 'music') musicTop(B, p, c);
    const s = basicShot(B, p); if (s && s.t >= BWARN && s.t < BWARN + BFLY){ const u = (s.t - BWARN)/BFLY; A.keyShot(c, s.ox + Math.cos(s.a)*s.len*u, s.oy + Math.sin(s.a)*s.len*u - 46, s.a + Math.PI/2, .9); }
    trailTop(B, c); },
  drawScreen(B, c, w, h){ transScreen(B, c, w, h); const p = cur(B); if (p.id !== 'dark' || stunned(B)) return;
    const al = cl(p.t/.8)*cl((p.len - p.t)/.6), z = B.view.zoom || 1, holes = [], soft = [], [bx, by] = bossPos(B);
    for (const o of B.all){ const [x, y] = B.toScreen(o.x, o.y - 26), r = (o.down ? 60 : 118)*z; holes.push([x, y, r]); soft.push([x, y, r*.68]); }
    if (revealed(B, p)){ const [x, y] = B.toScreen(bx, by - 100), r = 190*z; holes.push([x, y, r]); soft.push([x, y, r*.7]); }
    darkness(c, w, h, .5*al, soft); darkness(c, w, h, .82*al, holes);
    // 짤랑: 어둠 속 열쇠 꾸러미가 잠깐씩 반짝여요
    if (!revealed(B, p)){ const per = 1.4, n = Math.floor(B.now/1000/per), k = (B.now/1000 - n*per)/.35; if (k < 1){ const rng = B.rng(p.seed + 'jg' + n), [x, y] = B.toScreen(bx + (rng() - .5)*90, by - 60 - rng()*80);
        c.save(); c.globalAlpha = al*(1 - k); for (let i = 0; i < 4; i++){ const a = i*1.7 + n; A.keyShot(c, x + Math.cos(a)*22*k*z, y - k*16*z + Math.sin(a)*8*z, a, .5*Math.max(.7, z)); } c.restore();
        text(c, '짤랑…', x + 40*z, y - 10, 20, `rgba(255,233,160,${al*(1 - k)*.9})`); } } },
  label(B, c, x, y, t){ drawLabel(B, c, x, y, t); },
};
