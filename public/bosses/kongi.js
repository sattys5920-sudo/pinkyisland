// 콩이??? → 공태식 (마지막 방 · 출구) · 안에 서하람이 갇혀 있어요 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md
// 기본 공격: 수갑 던지기 (고리 둘 + 사슬)
// 1 단계: ① 빨리감기 ② 손전등 수색 ③ 그림자 끝 · 50% 변신 · 2 단계: ④ 수정액 ⑤ 바뀐 이름표 (노리는 몸) ⑥ 하람 불러내기 (채팅 → 배지 뒷면 → 기절) · 20% 아래: ⑦ 열리는 출구
import { pick, beat, warnCircle, inEll, shadow, tint, text, cl, lerp, ease, dist } from './kit.js';
import { drawWolf, wolfCanvas, cuff, badge, badgeBack, bubble } from './kongi_art.js';

const S = .36, FOOTD = 340*S - 4;                       // 그림 크기 · 발(발판 바닥) → 몸 원점
const HAND = [-206*S, 110*S - FOOTD];                    // 손전등 머리 (발 기준)
const CR = 30, CG = 46;                                  // 수갑 고리 반지름 · 고리 사이 반
const P = { 1:[{id:'ff', len:12}, {id:'search', len:11}, {id:'shadow', len:10}], 2:[{id:'white', len:12}, {id:'link', len:12}, {id:'haram', len:14}], 3:[{id:'door', len:14}] };
const AMP = { ff:.4, search:.6, shadow:.5, white:.3, link:.6, haram:.2, door:.3 };
const SAY = { ff:'시간은 내 편이야', search:'어디 숨었어?', shadow:'그림자는 거짓말 안 해', white:'그런 일은 없었어', link:'이름표 바꿔 달았지', haram:'조용히 해', door:'문이 열린다' };
const PHRASE = '문열지마';                               // 배지 뒷면 「문 열지 마」 (떨어진 경비대 배지 · 방 단서 ⑫)
const norm = s => String(s || '').replace(/[\s.,!?~…·'"「」『』\-—]/g, '');

// ----- 내 화면에만 있는 기억 (그림 · 한 번만 하기) -----
const L = { cache:{}, done:{}, hist:[], prints:[], acc:0, side:0, said:'', seen:'', inCone:0, callUntil:0, callSeed:'', called:{}, lhN:{}, txAt:{}, stunSeen:0, bossAt:0 };
function reset(B){ if (L.bossAt === B.r.bossAt) return; L.bossAt = B.r.bossAt; L.cache = {}; L.done = {}; L.hist = []; L.prints = []; L.called = {}; L.lhN = {}; L.said = ''; L.callUntil = 0; }
const once = k => { if (L.done[k]) return false; L.done[k] = 1; L.nd = (L.nd || 0) + 1; if (L.nd > 600){ L.nd = 0; const ks = Object.keys(L.done); for (const q of ks.slice(0, ks.length - 200)) delete L.done[q]; } return true; };
function memo(k, f){ let v = L.cache[k]; if (v === undefined){ v = L.cache[k] = f(); const ks = Object.keys(L.cache); if (ks.length > 80) delete L.cache[ks[0]]; } return v; }
const txOk = (k, gap = 500) => { const n = performance.now(); if (n - (L.txAt[k] || 0) < gap) return false; L.txAt[k] = n; return true; };

// ----- 패턴 차례 · 보스 자리 -----
const cur = B => B._c || (B._c = pick(B, P, {gap:2.5, trans:5}));
const stunned = B => (B.bs.stun || 0) > B.now;
const wander = t => [Math.cos(t*.42)*125 + Math.sin(t*1.07)*30, Math.sin(t*.61)*44 + Math.sin(t*1.3)*10];
function amp(B){ const c = cur(B); let a;
  if (c.id === 'trans') a = c.t < .8 ? 1 - ease(c.t/.8) : c.t > c.len - .8 ? ease((c.t - c.len + .8)/.8) : 0;
  else if (!c.id) a = 1; else a = lerp(1, AMP[c.id] ?? 1, ease(Math.min(cl(c.t/.8), cl((c.len - c.t)/.8))));
  const st = B.bs.stun || 0; if (st && B.now > st - 8000 && B.now < st + 600) a *= 1 - (B.now < st ? cl((B.now - st + 8000)/400) : cl((st + 600 - B.now)/600));
  return a; }
function foot(B){ if (B._f) return B._f; const w = wander(B.t), a = amp(B); return (B._f = [B.hx + w[0]*a, B.hy + w[1]*a]); }
const hand = B => { const [x, y] = foot(B); return [x + HAND[0], y + HAND[1]]; };
const half = B => B.phase >= 2 && !(B.phase === 2 && B.ph2 < 1.9);
const meOk = B => B.me && !B.me.down;

// ===== 기본 공격: 수갑 던지기 =====
function basicCuffs(B, n){ const c = cur(B);
  return memo(`b${n}`, () => { const al = B.alive; if (!al.length || c.id === 'trans' || stunned(B) || ffFrozenSoon(B)) return [];
    const rnd = B.rng(`kb${B.r.bossAt}.${n}`), k = Math.min(al.length, B.phase === 1 ? 1 : 2), pickU = [], out = [];
    while (pickU.length < k){ const p = al[Math.floor(rnd()*al.length)]; if (!pickU.includes(p)) pickU.push(p); }
    for (const p of pickU){ const a = rnd()*Math.PI; out.push({x:p.x + Math.cos(a)*CG, y:p.y + Math.sin(a)*CG*.6, a}); }
    return out; }); }
const inCuff = (b, x, y, pad = 8) => { const ax = Math.cos(b.a)*CG, ay = Math.sin(b.a)*CG*.6; return inEll(x, y, b.x + ax, b.y + ay, CR + pad) || inEll(x, y, b.x - ax, b.y - ay, CR + pad); };
function basicTick(B){ const bt = beat(B, 2.8), cs = basicCuffs(B, bt.n);
  if (cs.length && bt.t < .3 && once(`bw${bt.n}`)) B.sfx('warn', 300);
  if (bt.t >= .9 && bt.t < 1.25 && once(`bl${bt.n}`) && cs.length){ B.sfx('slam', 200); if (meOk(B) && cs.some(b => inCuff(b, B.me.x, B.me.y))) B.hurt(B.lo + 20, `kb${B.r.bossAt}.${bt.n}`); } }
function basicDraw(B, c, top){ const bt = beat(B, 2.8);
  for (const n of [bt.n - 1, bt.n]){ const k = B.t - n*bt.len, cs = L.cache[`b${n}`]; if (!cs || k < 0 || k > 1.6) continue;
    for (const b of cs){ const ax = Math.cos(b.a)*CG, ay = Math.sin(b.a)*CG*.6;
      if (!top){ if (k < .9){ c.save(); c.globalAlpha = .45 + .4*Math.abs(Math.sin(k*10)); c.strokeStyle = '#9ab0ff'; c.lineWidth = 3; c.setLineDash([6, 5]); for (const s2 of [-1, 1]){ c.beginPath(); c.ellipse(b.x + s2*ax, b.y + s2*ay, CR, CR*.6, 0, 0, 7); c.stroke(); } c.beginPath(); c.moveTo(b.x - ax, b.y - ay); c.lineTo(b.x + ax, b.y + ay); c.stroke(); c.globalAlpha = .12 + .2*k; c.fillStyle = '#9ab0ff'; for (const s2 of [-1, 1]){ c.beginPath(); c.ellipse(b.x + s2*ax, b.y + s2*ay, CR*k/.9, CR*.6*k/.9, 0, 0, 7); c.fill(); } c.restore(); }
        else cuff(c, b.x, b.y, b.a, cl((1.6 - k)*2.5)); continue; }
      if (k > .5 && k < .9){ const [hx, hy] = hand(B), u = (k - .5)/.4, x = lerp(hx, b.x, u), y = lerp(hy, b.y, u) - Math.sin(u*Math.PI)*120; c.save(); c.translate(x, y); c.rotate(u*14); c.strokeStyle = '#d8dce8'; c.lineWidth = 4; c.beginPath(); c.arc(-10, 0, 8, 0, 7); c.moveTo(18, 0); c.arc(10, 0, 8, 0, 7); c.stroke(); c.restore(); }
      if (k > .9 && k < 1.25){ c.save(); c.globalAlpha = 1 - (k - .9)/.35; text(c, '철컥', b.x + 52, b.y - 28 - (k - .9)*30, 20, '#d8e0ff'); c.restore(); } } } }

// ===== ① 빨리감기: CCTV 배속 (▶▶ 두 배 · ❚❚ 멈춤) 이 수갑 덫의 시계를 바꿔요 =====
const FF_W = [.5, 4.3, 8.1], FF_T = 2.2, TRAP = 62;
const FF_TPL = [[], [[.5, 2]], [[.4, 0], [1.6, 2]], [[.6, 0], [1.4, 1]], [[.3, 2], [.9, 0], [1.9, 2]]];
function ffWave(c, i){ return memo(`fw${c.seed}.${i}`, () => { const r = (h => () => (h = h*16807 % 2147483647)/2147483647)((hashS(c.seed + 'w' + i) % 2147483646) + 1), ti = i === 0 ? Math.floor(r()*2) : 1 + Math.floor(r()*4), t0 = FF_W[i];
  const segs = FF_TPL[ti].map(([o, s]) => [t0 + o, s]); const F = {t0, segs}; let t = t0; while (ffProg(F, t) < FF_T && t < t0 + 8) t += .02; F.boom = t; return F; }); }
function hashS(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function ffProg(F, t){ let p = 0, last = F.t0, sp = 1; for (const [st, s2] of [...F.segs, [1e9, 1]]){ if (t <= st) return p + (t - last)*sp; p += (st - last)*sp; last = st; sp = s2; } return p; }
function ffSpeed(F, t){ if (t < F.t0 || t > F.boom) return 1; let sp = 1; for (const [st, s2] of F.segs) if (t >= st) sp = s2; return sp; }
function ffNow(B){ const c = cur(B); if (c.id !== 'ff') return null; for (let i = 0; i < FF_W.length; i++){ const F = ffWave(c, i); if (c.t >= F.t0 && c.t <= F.boom + .8) return {F, i, c}; } return null; }
function ffFrozenSoon(B){ const c = cur(B); if (c.id !== 'ff') return false; for (let i = 0; i < FF_W.length; i++){ const F = ffWave(c, i); if (F.segs.some(s => s[1] === 0) && c.t + 1.2 > F.t0 && c.t < F.boom) return true; } return false; }
function ffTraps(B, c, i, F){ return memo(`ft${c.seed}.${i}`, () => { const r = B.rng(c.seed + 't' + i), [fx, fy] = foot(B), out = B.alive.map(p => [p.x, p.y]);
  for (let k = 0; k < 2; k++) out.push([fx + (r() - .5)*260, fy + 40 + r()*110]); return out; }); }
function ffTick(B){ const w = ffNow(B); if (!w) return; const {F, i, c} = w, tr = ffTraps(B, c, i, F);
  if (once(`fa${c.seed}.${i}`)) B.sfx('warn');
  const sp = ffSpeed(F, c.t); if (sp === 0 && c.t < F.boom) B.ctl.lock = true;
  if (L.seen !== `${c.seed}.${i}.${sp}`){ if (L.seen.startsWith(`${c.seed}.${i}.`)) B.sfx('warn', 0); L.seen = `${c.seed}.${i}.${sp}`; }
  if (c.t >= F.boom && c.t < F.boom + .35 && once(`fb${c.seed}.${i}`)){ B.sfx('slam'); B.shake(); if (meOk(B) && tr.some(([x, y]) => inEll(B.me.x, B.me.y, x, y, TRAP))) B.hurt(B.lo + 80, `ff${c.seed}.${i}`); } }
function ffDraw(B, c2){ const w = ffNow(B); if (!w) return; const {F, i, c} = w, tr = L.cache[`ft${c.seed}.${i}`]; if (!tr) return; const prog = cl(ffProg(F, Math.min(c.t, F.boom))/FF_T), sp = ffSpeed(F, c.t);
  for (const [x, y] of tr){ if (c.t < F.boom){ c2.save(); c2.globalAlpha = .45 + .3*Math.sin(B.now/80); c2.strokeStyle = sp === 2 ? '#ff8a9a' : sp === 0 ? '#9affd0' : '#9ab0ff'; c2.lineWidth = 3; c2.setLineDash([6, 5]); c2.beginPath(); c2.ellipse(x, y, TRAP, TRAP*.6, 0, 0, 7); c2.stroke(); c2.globalAlpha = .3; c2.fillStyle = c2.strokeStyle; c2.beginPath(); c2.ellipse(x, y, TRAP*prog, TRAP*.6*prog, 0, 0, 7); c2.fill(); c2.restore();
      text(c2, Math.max(0, FF_T*(1 - prog)).toFixed(1), x, y - TRAP*.6 - 14, 22, '#d8e0ff'); }
    else cuff(c2, x, y, .3, cl((F.boom + .8 - c.t)*2), 1.4); } }
function ffScreen(B, c, w, h){ const cc = cur(B); if (cc.id !== 'ff') return; const al = Math.min(cl(cc.t*3), cl((cc.len - cc.t)*3)), wv = ffNow(B), sp = wv ? ffSpeed(wv.F, cc.t) : 1;
  let vt = cc.t; for (let i = 0; i < FF_W.length; i++){ const F = ffWave(cc, i); if (cc.t > F.t0){ const e = Math.min(cc.t, F.boom); vt += ffProg(F, e) - (e - F.t0); } } const base = 23*3600 + 41*60, ts = Math.floor(base + vt), hh = String(Math.floor(ts/3600)%24).padStart(2, '0'), mm = String(Math.floor(ts/60)%60).padStart(2, '0'), ss = String(ts%60).padStart(2, '0');
  c.save(); c.globalAlpha = al; const bw = 210, bx = w/2 - bw/2, by = Math.min(146, h*.17); c.fillStyle = 'rgba(10,14,24,.82)'; c.beginPath(); c.roundRect(bx, by, bw, 34, 8); c.fill();
  c.fillStyle = Math.floor(B.now/500)%2 ? '#ff3a3a' : '#5a1a1a'; c.beginPath(); c.arc(bx + 16, by + 17, 6, 0, 7); c.fill(); text(c, `REC  CAM 03  ${hh}:${mm}:${ss}`, bx + 116, by + 18, 20, '#e0e8ff', 'center', null);
  if (sp !== 1){ const p = .9 + .1*Math.abs(Math.sin(B.now/120)), cx = w/2, cy = by + 62, z = 16*p; c.fillStyle = sp === 2 ? '#ff8a8a' : '#9affd0'; c.strokeStyle = 'rgba(20,6,12,.85)'; c.lineWidth = 3; c.beginPath();
    if (sp === 2){ for (const o of [-z*1.6, -z*.2]){ c.moveTo(cx + o, cy - z); c.lineTo(cx + o + z*1.4, cy); c.lineTo(cx + o, cy + z); c.closePath(); } }
    else for (const o of [-z*.9, z*.3]) c.rect(cx + o, cy - z, z*.6, z*2);
    c.stroke(); c.fill(); if (sp === 2) text(c, '×2', cx + z*2.4, cy + 1, 30*p, '#ff8a8a'); }
  c.restore(); }

// ===== ② 손전등 수색: 쓸고 지나가는 빛에 들키면 '발견!' · 빛 밖에서만 때려요 =====
const CONE = .36, CONE_L = 520;
function coneA(B){ const c = cur(B); return Math.PI/2 + c.t*.45 + Math.sin(c.t*.9)*1.1 + (B.hash(c.seed) % 628)/100; }
function searchOn(B){ const c = cur(B); return c.id === 'search' && c.t > .8 && c.t < c.len - .3; }
function inCone(B, x, y){ if (!searchOn(B)) return false; const [hx, hy] = hand(B), d = Math.hypot(x - hx, y - hy); if (d > CONE_L) return false; if (d < 30) return true; const a = Math.atan2(y - hy, x - hx), da = Math.atan2(Math.sin(a - coneA(B)), Math.cos(a - coneA(B))); return Math.abs(da) < CONE; }
function searchTick(B){ const c = cur(B); if (c.id !== 'search') return; if (once(`sa${c.seed}`)) B.sfx('warn');
  if (!meOk(B) || !inCone(B, B.me.x, B.me.y)){ L.inCone = 0; return; }
  if (!L.inCone) L.inCone = B.now; if (B.now - L.inCone > 250){ const k = `sr${c.seed}.${Math.floor(c.t/1.5)}`; if (B.hurt(B.lo + 60, k)){ const [hx, hy] = hand(B); B.fx('발견!', B.me.x, B.me.y - 70, '#ffe08a'); B.push(B.me.x - hx, B.me.y - hy, 60); B.sfx('slam', 300); } } }
function searchDraw(B, c2){ const c = cur(B); if (c.id !== 'search') return; const al = Math.min(cl(c.t*1.5), cl((c.len - c.t)*3)), [hx, hy] = hand(B), a = coneA(B);
  c2.save(); c2.globalCompositeOperation = 'lighter'; c2.globalAlpha = al*.5; const q = c2.createRadialGradient(hx, hy, 10, hx, hy, CONE_L); q.addColorStop(0, 'rgba(255,250,210,.95)'); q.addColorStop(1, 'rgba(255,250,210,0)'); c2.fillStyle = q; c2.beginPath(); c2.moveTo(hx, hy); c2.arc(hx, hy, CONE_L, a - CONE, a + CONE); c2.closePath(); c2.fill(); c2.restore(); }

// ===== ③ 그림자 끝: 바닥에 놓인 손전등 따라 늘어나는 그림자 끝마다 수갑이 박혀요 =====
const SH_T = [1.6, 3.6, 5.6, 7.6, 9.2], SH_L = 150, SHB_L = 300;
function lampPos(B){ const c = cur(B), [fx, fy] = foot(B), a = c.t*.55 + (B.hash(c.seed + 'l') % 628)/100; return [fx + Math.cos(a)*240, fy + Math.sin(a)*240*.6]; }
function tipOf(px, py, lx, ly, len){ const dx = px - lx, dy = (py - ly)/.6, d = Math.hypot(dx, dy) || 1; return [px + dx/d*len, py + dy/d*len*.6]; }
function shTips(B, c, k){ return memo(`sh${c.seed}.${k}`, () => { const [lx, ly] = lampPos(B), [fx, fy] = foot(B), out = B.alive.map(p => [...tipOf(p.x, p.y, lx, ly, SH_L), 40]); out.push([...tipOf(fx, fy, lx, ly, SHB_L), 74]); return out; }); }
function shadowTick(B){ const c = cur(B); if (c.id !== 'shadow') return;
  SH_T.forEach((s, k) => { if (c.t >= s - .9 && c.t < s + .8){ const tp = shTips(B, c, k); if (once(`sw${c.seed}.${k}`)) B.sfx('warn', 200);
    if (c.t >= s && c.t < s + .35 && once(`sx${c.seed}.${k}`)){ B.sfx('slam', 200); if (meOk(B) && tp.some(([x, y, r]) => inEll(B.me.x, B.me.y, x, y, r))) B.hurt(B.lo + 70, `sh${c.seed}.${k}`); } } }); }
function shadowDraw(B, c2){ const c = cur(B); if (c.id !== 'shadow') return; const al = Math.min(cl(c.t*2), cl((c.len - c.t)*3)), [lx, ly] = lampPos(B), [fx, fy] = foot(B);
  c2.save(); c2.globalAlpha = al*.55; c2.fillStyle = '#04040a';
  const sh = (px, py, len, wd) => { const [tx, ty] = tipOf(px, py, lx, ly, len), dx = tx - px, dy = ty - py, d = Math.hypot(dx, dy) || 1, nx = -dy/d*wd, ny = dx/d*wd*.6; c2.beginPath(); c2.moveTo(px + nx, py + ny); c2.quadraticCurveTo((px + tx)/2 + nx*.8, (py + ty)/2 + ny*.8, tx, ty); c2.quadraticCurveTo((px + tx)/2 - nx*.8, (py + ty)/2 - ny*.8, px - nx, py - ny); c2.closePath(); c2.fill(); };
  for (const p of B.alive) sh(p.x, p.y, SH_L, 20); sh(fx, fy, SHB_L, 70); c2.restore();
  SH_T.forEach((s, k) => { const tp = L.cache[`sh${c.seed}.${k}`]; if (!tp) return; const kk = c.t - s;
    for (const [x, y, r] of tp){ if (kk > -.9 && kk < 0) warnCircle(c2, x, y, r, r*.6, (kk + .9)/.9, '255,110,130'); else if (kk >= 0 && kk < .7) cuff(c2, x, y, 0, 1 - kk/.7, r/40*.8); } });
  c2.save(); c2.globalAlpha = al; const q = c2.createRadialGradient(lx, ly - 6, 2, lx, ly - 6, 70); q.addColorStop(0, 'rgba(255,250,210,.95)'); q.addColorStop(1, 'rgba(255,250,210,0)'); c2.fillStyle = q; c2.fillRect(lx - 70, ly - 76, 140, 140);
  c2.translate(lx, ly - 4); c2.rotate(Math.atan2(fy - ly, fx - lx)); c2.fillStyle = '#2a2a30'; c2.beginPath(); c2.roundRect(-22, -6, 30, 12, 3); c2.fill(); c2.fillStyle = '#fff6c0'; c2.beginPath(); c2.ellipse(8, 0, 4, 8, 0, 0, 7); c2.fill(); c2.restore(); }

// ===== ④ 수정액: 덫 자리를 잠깐 보여 준 뒤 하얗게 덮어 지워요 =====
const WH_W = [.6, 4.4, 8.2], WH_SHOW = 1.1, WH_BOOM = 2.8;
function whSpots(B, c, i){ return memo(`ws${c.seed}.${i}`, () => { const r = B.rng(c.seed + 's' + i), n = 6 + Math.min(4, B.alive.length), out = []; for (let k = 0; k < n; k++) out.push([B.hx - 320 + r()*640, B.hy - 10 + r()*300]); return out; }); }
function whiteTick(B){ const c = cur(B); if (c.id !== 'white') return;
  WH_W.forEach((t0, i) => { const k = c.t - t0; if (k < 0 || k > WH_BOOM + .8) return; const sp = whSpots(B, c, i); if (once(`wa${c.seed}.${i}`)) B.sfx('warn');
    if (k >= WH_BOOM && k < WH_BOOM + .35 && once(`wb${c.seed}.${i}`)){ B.sfx('slam'); if (meOk(B) && sp.some(([x, y]) => inEll(B.me.x, B.me.y, x, y, 66, 40))) B.hurt(B.lo + 90, `wh${c.seed}.${i}`); } }); }
function whiteDraw(B, c2){ const c = cur(B); if (c.id !== 'white') return;
  WH_W.forEach((t0, i) => { const k = c.t - t0, sp = L.cache[`ws${c.seed}.${i}`]; if (!sp || k < 0 || k > WH_BOOM + .8) return;
    for (const [x, y] of sp){ if (k < WH_SHOW){ c2.save(); c2.globalAlpha = .5 + .3*Math.sin(B.now/70); c2.strokeStyle = '#ff6a7a'; c2.lineWidth = 3; c2.beginPath(); c2.ellipse(x, y, 66, 40, 0, 0, 7); c2.stroke(); c2.fillStyle = 'rgba(255,90,110,.22)'; c2.fill(); c2.restore(); } else if (k > WH_BOOM) cuff(c2, x, y, .2, cl((WH_BOOM + .8 - k)*2), 1.3); }
    if (k > WH_SHOW - .3 && k < WH_BOOM + .25){ const u = cl((k - WH_SHOW + .3)/.5), fade = cl((WH_BOOM + .25 - k)/.25), x0 = B.hx - 460, x1 = B.hx + 460, y0 = B.hy - 50, bh = 74;
      c2.save(); c2.globalAlpha = .92*fade; c2.fillStyle = '#ecece6'; for (let b = 0; b < 5; b++){ const y = y0 + b*bh, xe = x0 + cl(u*5 - b)*(x1 - x0); if (xe <= x0) continue; c2.beginPath(); c2.moveTo(x0, y); for (let x = x0; x <= xe; x += 30) c2.lineTo(x, y + Math.sin(x*.04 + b)*4); c2.lineTo(xe, y + bh + 4); for (let x = xe; x >= x0; x -= 30) c2.lineTo(x, y + bh + 4 + Math.sin(x*.03 + b*3)*4); c2.closePath(); c2.fill(); } c2.restore();
      if (u < 1){ const b = Math.floor(u*5), xe = x0 + cl(u*5 - b)*(x1 - x0), y = y0 + b*bh + bh/2; c2.save(); c2.fillStyle = '#e8e8ee'; c2.fillRect(xe - 8, y - 28, 16, 56); c2.fillStyle = '#5a6a9a'; c2.fillRect(xe - 6, y - 50, 12, 22); c2.restore(); text(c2, '쓱쓱', xe + 30, y - 30, 20, '#5a6a9a'); } } }); }

// ===== ⑤ 바뀐 이름표: 보스와 노리는 몸이 붉은 실로 이어져요 · 때리면 노리는 몸이 아파요 · 노리는 몸이 하람의 배지 빛에 들어가면 잠시 끊겨요 =====
function lightPos(B){ const c = cur(B), ph = (B.hash(c.seed + 'p') % 628)/100; return [B.hx + Math.cos(c.t*.55 + ph)*270, B.hy + 150 + Math.sin(c.t*.9 + ph)*70]; }
const linkCut = B => { const k = B.bs.cut5, c = cur(B); return !!(k && k.s === c.seed && k.u > B.now); };
const linkOn = B => { const c = cur(B); return c.id === 'link' && c.t > .6 && c.t < c.len - .2 && !!B.target && !linkCut(B); };
function linkTick(B){ const c = cur(B); if (c.id !== 'link') return; if (once(`la${c.seed}`)) B.sfx('warn');
  const tg = B.target, [lx, ly] = lightPos(B), k = B.bs.cut5;
  if (B.host && tg && c.t > .6 && inEll(tg.x, tg.y, lx, ly, 90, 54) && !(k && k.s === c.seed && k.u > B.now + 1500) && txOk('cut5', 600)){ const s = c.seed, u = B.now + 3500; B.tx(bs => ({...bs, cut5:{s, u}})); }
  const lh = B.bs.lh; if (lh && lh.s === c.seed && B.me && lh.u === B.me.uid && lh.n > (L.lhN[c.seed] || 0)){ L.lhN[c.seed] = lh.n; if (B.hurt(B.lo, `lh${c.seed}.${Math.floor(B.now/1500)}`)) B.fx('?!', B.me.x, B.me.y - 74, '#ff8a9a'); }
  if (linkCut(B) && once(`lc${k.s}.${k.u}`)) B.sfx('hit', 0); }
function linkHit(B){ const tg = B.target, c = cur(B); if (!tg) return; if (!txOk('lh', 300)) return; const s = c.seed, u = tg.uid; B.tx(bs => ({...bs, lh:{s, u, n:(bs.lh && bs.lh.s === s ? bs.lh.n : 0) + 1}})); }
function linkFloor(B, c2){ const c = cur(B); if (c.id !== 'link') return; const al = Math.min(cl(c.t*2), cl((c.len - c.t)*3)), [lx, ly] = lightPos(B);
  c2.save(); c2.globalAlpha = al; const q = c2.createRadialGradient(lx, ly, 6, lx, ly, 90); q.addColorStop(0, 'rgba(255,236,150,.6)'); q.addColorStop(1, 'rgba(255,236,150,0)'); c2.fillStyle = q; c2.beginPath(); c2.ellipse(lx, ly, 90, 54, 0, 0, 7); c2.fill(); c2.strokeStyle = 'rgba(255,236,150,.8)'; c2.lineWidth = 2; c2.setLineDash([6, 6]); c2.stroke(); c2.restore();
  const tg = B.target; if (tg){ c2.save(); c2.strokeStyle = `rgba(255,60,80,${.5 + .4*Math.sin(B.now/160)})`; c2.lineWidth = 2.5; c2.setLineDash([6, 5]); c2.beginPath(); c2.ellipse(tg.x, tg.y + 2, 34, 12, 0, 0, 7); c2.stroke(); c2.restore(); } }
function linkTop(B, c2){ const c = cur(B); if (c.id !== 'link') return; const [lx, ly] = lightPos(B); badge(c2, lx, ly - 70 + Math.sin(B.now/300)*5, 1.1, true, true);
  const tg = B.target; if (!tg || c.t < .6) return; const [fx, fy] = foot(B), bx = fx, by = fy - FOOTD + 30*S;
  c2.save(); c2.strokeStyle = `rgba(230,30,40,${.65 + .3*Math.sin(B.now/100)})`; c2.lineWidth = 4; c2.lineCap = 'round';
  if (linkOn(B)){ c2.beginPath(); c2.moveTo(bx, by); c2.quadraticCurveTo((bx + tg.x)/2, (by + tg.y)/2 + 40 + Math.sin(B.now/200)*20, tg.x, tg.y - 30); c2.stroke(); }
  else if (linkCut(B)){ c2.globalAlpha = .6; for (const [x0, y0, x1, y1] of [[bx, by, tg.x, tg.y - 30], [tg.x, tg.y - 30, bx, by]]){ c2.beginPath(); c2.moveTo(x0, y0); c2.quadraticCurveTo(lerp(x0, x1, .15), lerp(y0, y1, .15) + 30, lerp(x0, x1, .28), lerp(y0, y1, .28) + 50); c2.stroke(); } }
  c2.restore(); }

// ===== ⑥ 하람 불러내기: 배지 뒤에 긁힌 말을 채팅에 쳐요 · 치는 동안 못 움직여요 · 모두 부르면 하람이 깨어나 태식이 기절 =====
function haramTick(B){ const c = cur(B), on = c.id === 'haram';
  if (on && once(`ha${c.seed}`)) B.sfx('warn');
  let typing = false; try { typing = on && document.activeElement && document.activeElement.id === 'chatin'; } catch(e){}
  if (L.callUntil > B.now && meOk(B)){ B.ctl.lock = true; B.ctl.noAtk = true; typing = true; }
  else if (L.callUntil && L.callSeed){ const s = L.callSeed, u = B.me?.uid; L.callUntil = 0; L.callSeed = ''; if (u && meOk(B)){ L.called[s] = 1; B.sfx('hit', 0); B.tx(bs => { const c6 = bs.c6 && bs.c6.s === s ? bs.c6 : {s, u:{}}; if (c6.u[u]) return undefined; return {...bs, c6:{s, u:{...c6.u, [u]:1}}}; }); } }
  B.setBp(typing ? {c:1} : null);
  if (on && B.host && !stunned(B) && B.bs.st6 !== c.seed){ const c6 = B.bs.c6; if (c6 && c6.s === c.seed && B.alive.length && B.alive.every(p => c6.u[p.uid]) && txOk('st6', 800)){ const s = c.seed, until = B.now + 8000; B.tx(bs => bs.st6 === s ? undefined : {...bs, stun:until, st6:s}); } }
  const st = B.bs.stun || 0; if (st > B.now && L.stunSeen !== st){ L.stunSeen = st; B.sfx('slam', 0); B.shake(); B.say('…고마워. 나 여기 있어', 3200); } }
function haramChat(B, text){ const c = cur(B); if (c.id !== 'haram' || !meOk(B) || stunned(B) || L.called[c.seed] || L.callUntil > B.now) return; if (norm(text) !== PHRASE) return; L.callUntil = B.now + 2000; L.callSeed = c.seed; }
function haramTop(B, c2){ const c = cur(B), [fx, fy] = foot(B), top = fy - FOOTD - 150*S;
  for (const p of B.all){ if (!(p.bp && p.bp.c)) continue; c2.save(); c2.fillStyle = 'rgba(240,244,255,.95)'; c2.beginPath(); c2.roundRect(p.x - 26, p.y - 92, 52, 22, 10); c2.fill(); c2.fillStyle = '#5a6a9a'; for (let i = 0; i < 3; i++){ c2.beginPath(); c2.arc(p.x - 10 + i*10, p.y - 81 - (Math.floor(B.now/160 + i)%3 === 0 ? 3 : 0), 3, 0, 7); c2.fill(); } c2.restore(); }
  if (c.id === 'haram' && !stunned(B)){ const c6 = B.bs.c6, n = B.alive.length, got = c6 && c6.s === c.seed ? B.alive.filter(p => c6.u[p.uid]).length : 0;
    for (let i = 0; i < n; i++){ c2.save(); c2.globalAlpha = i < got ? 1 : .35; badge(c2, fx - (n - 1)*13 + i*26, fy + 22, .55, true, i < got); c2.restore(); }
    const k = Math.sin(B.now/330); bubble(c2, fx + 90, top + 10 + k*6, '…문… 열지…', .75, -.1, -1, true, .45 + .4*Math.abs(k)); }
  const st = B.bs.stun || 0; if (st > B.now){ const u = cl((B.now - st + 8000)/500), out = cl((st - B.now)/600); badgeBack(c2, fx, top - 40 - u*20, .8 + u*.4, out); } }

// ===== ⑦ 열리는 출구: 일정 시간마다 모두의 자리가 돌아가며 바뀌어요 · 바뀌기 전 내 자리에 덫이 뜨면 비켜 줘요 =====
const DOOR_S = [2.2, 5.4, 8.6, 11.8], DOOR_LEAD = 1.2;
function doorTick(B){ const c = cur(B); if (c.id !== 'door') return; if (once(`da${c.seed}`)) B.sfx('warn');
  DOOR_S.forEach((s, k) => { const key = `${c.seed}.${k}`, m = B.bs.m7;
    if (B.host && c.t >= s - DOOR_LEAD && c.t < s - .4 && !(m && m.k === key) && txOk('m7' + key, 700)){ const p = B.alive.map(q => [q.uid, Math.round(q.x), Math.round(q.y)]); B.tx(bs => bs.m7 && bs.m7.k === key ? undefined : {...bs, m7:{k:key, p}}); }
    if (m && m.k === key && c.t >= s - DOOR_LEAD && c.t < s && once(`dw${key}`)) B.sfx('warn', 0);
    if (c.t >= s && c.t < s + .5 && m && m.k === key){
      if (once(`ds${key}`)){ B.sfx('slam', 0); const i = B.me ? m.p.findIndex(q => q[0] === B.me.uid) : -1; if (i >= 0 && meOk(B) && m.p.length > 1){ const nu = m.p[(i + 1) % m.p.length][0], to = B.all.find(q => q.uid === nu && !q.down); if (to) try { B.tp(to.x, to.y); } catch(e){} } }
      else if (c.t >= s + .12 && once(`dh${key}`) && meOk(B) && m.p.some(([, x, y]) => inEll(B.me.x, B.me.y, x, y, 46, 28))) B.hurt(B.lo + 100, `d7${key}`); } }); }
function doorFloor(B, c2){ if (B.phase !== 3) return; const open = cl(B.ph3/45), gap = 8 + open*120, x = B.W/2;
  c2.save(); c2.globalCompositeOperation = 'lighter'; const q = c2.createLinearGradient(0, 0, 0, 640); q.addColorStop(0, `rgba(220,230,255,${.2 + open*.35})`); q.addColorStop(1, 'rgba(220,230,255,0)'); c2.fillStyle = q; c2.beginPath(); c2.moveTo(x - gap/2, 0); c2.lineTo(x + gap/2, 0); c2.lineTo(x + gap*2.2, 640); c2.lineTo(x - gap*2.2, 640); c2.closePath(); c2.fill(); c2.restore();
  c2.save(); c2.globalAlpha = .85; c2.fillStyle = '#e8eeff'; c2.fillRect(x - gap/2, 0, gap, 150); c2.restore();
  const c = cur(B), m = B.bs.m7; if (c.id !== 'door' || !m) return;
  DOOR_S.forEach((s, k) => { if (m.k !== `${c.seed}.${k}`) return; const kk = c.t - s;
    if (kk > -DOOR_LEAD && kk < 0) for (const [, mx, my] of m.p){ c2.save(); c2.globalAlpha = .55 + .35*Math.sin(B.now/60); c2.strokeStyle = '#ff6a7a'; c2.lineWidth = 3; c2.setLineDash([5, 4]); c2.beginPath(); c2.ellipse(mx, my, 46, 28, 0, 0, 7); c2.stroke(); c2.globalAlpha = .18; c2.fillStyle = '#ff6a7a'; c2.fill(); c2.restore(); }
    else if (kk >= 0 && kk < .6) for (const [, mx, my] of m.p) cuff(c2, mx, my, .2, 1 - kk/.6); }); }
function doorTop(B, c2){ const c = cur(B), m = B.bs.m7; if (c.id !== 'door' || !m || m.p.length < 2) return;
  DOOR_S.forEach((s, k) => { if (m.k !== `${c.seed}.${k}`) return; const kk = c.t - s; if (!(kk > -DOOR_LEAD && kk < 0)) return; const ps = m.p.map(([u, x, y]) => { const q = B.all.find(o => o.uid === u); return q ? [q.x, q.y] : [x, y]; });
    c2.save(); c2.strokeStyle = 'rgba(200,210,255,.7)'; c2.lineWidth = 2; c2.setLineDash([6, 6]); for (let i = 0; i < ps.length; i++){ const a = ps[i], b = ps[(i + 1) % ps.length]; c2.beginPath(); c2.moveTo(a[0], a[1] - 30); c2.quadraticCurveTo((a[0] + b[0])/2, (a[1] + b[1])/2 - 80, b[0], b[1] - 30); c2.stroke(); } c2.restore(); }); }
function doorScreen(B, c, w, h){ const cc = cur(B), m = B.bs.m7; if (cc.id !== 'door' || !m) return; for (let k = 0; k < DOOR_S.length; k++){ const kk = cc.t - DOOR_S[k]; if (m.k === `${cc.seed}.${k}` && kk >= 0 && kk < .5) tint(c, w, h, '#e8eeff', (1 - kk/.5)*.45); } }

// ===== 이동 연출: 지나간 자리에 노란 '출입 금지' 테이프가 풀려 따라오고 파랗게 빛나는 지문이 찍혀요 =====
function trailTick(B){ const [x, y] = foot(B), H = L.hist, last = H[H.length - 1];
  if (last && B.now < last.t) L.hist = [];
  if (!last || B.now - last.t > 40){ H.push({t:B.now, x, y}); while (H.length && B.now - H[0].t > 3200) H.shift(); }
  if (last){ const d = Math.hypot(x - last.x, y - last.y); if (d < 60) L.acc += d; if (L.acc > 46){ L.acc = 0; L.side ^= 1; L.prints.push({t:B.now, x:x + (L.side ? -30 : 30), y:y + 6, a:Math.atan2(y - last.y, x - last.x)}); if (L.prints.length > 40) L.prints.shift(); } } }
function trailDraw(B, c){ if (cur(B).id === 'trans') return; const H = L.hist; if (H.length < 3) return; const a = H[H.length - 1], b = H.find(p => a.t - p.t < 250) || a, sp = cl(Math.hypot(a.x - b.x, a.y - b.y)/((a.t - b.t)/1000 || 1)/60);
  if (sp > .05){ c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.globalAlpha = .2 + .6*sp; c.strokeStyle = '#e8c020'; c.lineWidth = 12; c.beginPath(); let i = 0; for (let k = H.length - 1; k >= 0; k -= 3, i++){ const p = H[k], yy = p.y + 12 + Math.sin(B.now/330 + i*.7)*4; i ? c.lineTo(p.x, yy) : c.moveTo(p.x, yy); } c.stroke(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; c.setLineDash([10, 12]); c.stroke(); c.restore();
    if (sp > .25) for (let k = H.length - 12, j = 0; k > 0 && j < 3; k -= 22, j++){ const p = H[k]; c.save(); c.globalAlpha = (.25 + .6*sp)*.9; text(c, '출입 금지', p.x, p.y + 13, 14, '#2a2a10', 'center', null); c.restore(); } }
  for (const p of L.prints){ const k = (B.now - p.t)/1000; if (k < 0 || k > 3) continue; c.save(); c.translate(p.x, p.y); c.rotate(p.a + 1.57); c.globalAlpha = cl(1 - k/3)*.85; c.strokeStyle = '#7ab8ff'; c.lineWidth = 1.6; for (let r = 3; r < 13; r += 2.5){ c.beginPath(); c.ellipse(0, 0, r*.75, r, 0, Math.PI*1.05, Math.PI*2.95); c.stroke(); } c.restore(); } }

// ===== 50% 변신 연출: 카메라 플래시 · '증거 #' 사진 · 수정액 붓 · 빨간 펜 '배달원 옷' · 하람의 말풍선 =====
let POLA = null;
function transScreen(B, c, w, h){ const k = B.phase === 2 ? B.ph2 : -1; if (k < 0 || k > 5) return;
  if (!POLA){ POLA = []; let s = 5; const r = () => (s = (s*16807) % 2147483647)/2147483647; for (let i = 0; i < 12; i++) POLA.push({t:.25 + i*.11, x:.1 + r()*.8, y:.18 + r()*.64, a:(r() - .5)*.6, n:i + 1}); }
  const fin = cl((5 - k)/.8), sz = Math.min(w, h)*.26, img = wolfCanvas(false, S);
  for (const P of POLA){ const kk = k - P.t; if (kk < 0) continue; const x = P.x*w, y = P.y*h;
    if (kk < .08) tint(c, w, h, '#ffffff', .75*(1 - kk/.08));
    const dr = ease(kk/.15), s = (1.4 - dr*.4)*sz/140; c.save(); c.globalAlpha = fin; c.translate(x, y); c.rotate(P.a); c.scale(s, s); c.fillStyle = '#f2f0e8'; c.fillRect(-70, -84, 140, 168); c.fillStyle = '#1a2032'; c.fillRect(-60, -74, 120, 120);
    c.save(); c.beginPath(); c.rect(-60, -74, 120, 120); c.clip(); c.globalAlpha = fin*.8; c.drawImage(img.cv, -60 - (P.n%3)*20, -78 - (P.n%2)*10, 160, 160); c.restore();
    c.fillStyle = 'rgba(80,120,255,.25)'; c.fillRect(-60, -74, 120, 120); text(c, `증거 #${P.n}`, 0, 64, 22, '#2a2a40', 'center', null); c.restore(); }
  if (k > 1.5){ const u = cl((k - 1.5)/.9), bh = h/7; c.save(); c.globalAlpha = .93*fin; c.fillStyle = '#f6f6f2'; for (let i = 0; i < 7; i++){ const y = i*bh, xe = cl(u*7 - i)*w; if (xe <= 0) continue; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= xe; x += 30) c.lineTo(x, y + Math.sin(x*.03 + i)*5); c.lineTo(xe, y + bh + 6); for (let x = xe; x >= 0; x -= 30) c.lineTo(x, y + bh + 6 + Math.sin(x*.025 + i*2)*5); c.closePath(); c.fill(); } c.restore();
    if (u < 1){ const i = Math.floor(u*7), y = i*bh + bh/2, x = cl(u*7 - i)*w; c.save(); c.fillStyle = '#e8e8ee'; c.fillRect(x - 12, y - 40, 24, 80); c.fillStyle = '#5a6a9a'; c.fillRect(x - 9, y - 70, 18, 32); c.restore(); } }
  if (k > 1.8 && k < 2.2) tint(c, w, h, '#e8eeff', (1 - Math.abs(k - 1.9)/.3)*.8);
  if (k > 2.3){ const u = cl((k - 2.3)/1.0), fs = Math.min(30, w/16), cy = h*.42; c.save(); c.globalAlpha = fin; text(c, '목격자 진술 : 키 큰 남자 · 비싼 시계', w/2, cy, fs, '#2a2a3a', 'center', null);
    c.strokeStyle = '#d01818'; c.lineWidth = 4; c.beginPath(); c.moveTo(w/2 - fs*4.6, cy); c.lineTo(w/2 - fs*4.6 + fs*9.4*cl(u*2), cy); c.stroke();
    const s2 = '→ 배달원 옷'; text(c, s2.slice(0, Math.ceil(s2.length*cl(u*1.6 - .3))), w/2 + fs, cy + fs*1.7, fs*1.4, '#d01818', 'center', null); text(c, '담당 형사 : 공태식', w/2, cy + fs*3.4, fs*.8, '#4a4a5a', 'center', null); c.restore(); }
  if (k > 2.6){ const words = ['도망가', '문 열지 마', '그건 내가 아니야', '나는 여기 있어', '열면 바뀌어', '하람이야']; for (let i = 0; i < 6; i++){ const kk = k - 2.6 - i*.12; if (kk < 0) continue; const a = i*1.05 + .3, r2 = Math.min(w, h)*.18 + kk*Math.min(w, h)*.32; bubble(c, w/2 + Math.cos(a)*r2, h*.48 + Math.sin(a)*r2*.75, words[i], Math.min(1.3, w/420)*(1 + kk*.2), Math.sin(i)*.2, 1, true, fin*cl(kk*4)); } } }
function smudges(B, c, w, h){ if (B.phase < 2 || (B.phase === 2 && B.ph2 < 4.4)) return; c.save(); c.globalAlpha = .28; c.fillStyle = '#e8e8e2'; for (const [x, y, w2, h2, a2] of [[0, .3, 70, 24, .2], [1, .38, 80, 22, -.15], [0, .86, 90, 26, -.1], [1, .82, 96, 24, .12]]){ c.save(); c.translate(x ? w - w2*.4 : w2*.4, y*h); c.rotate(a2); c.beginPath(); c.roundRect(-w2/2, -h2/2, w2, h2, 10); c.fill(); c.restore(); } c.restore(); }

// ===== 모듈 =====
export default {
  reach: 125,
  height: 248,
  pos(B){ return foot(B); },
  tick(B, dt){ reset(B); const c = cur(B);
    if (c.id && c.id !== 'trans' && L.said !== c.seed){ L.said = c.seed; { const nk = B.target?.nick || (B.targetNick !== '???' ? B.targetNick : ''); B.say(c.id === 'link' && nk ? `${nk}, 이름표 바꿔 달았지` : SAY[c.id], 2400); } }
    if (c.id === 'trans'){ if (c.t > 1.85 && once(`tr1${B.r.rageAt}`)){ B.shake(); B.sfx('slam', 0); } if (c.t > 4.2 && once(`tr2${B.r.rageAt}`)) { const nk = B.target?.nick || (B.targetNick !== '???' ? B.targetNick : ''); B.say(nk ? `${nk} 몸으로 나간다. 19 년 기다렸어` : '이 몸으로 나간다. 19 년 기다렸어', 2600); } }
    trailTick(B);
    if (!stunned(B)){ basicTick(B); ffTick(B); searchTick(B); shadowTick(B); whiteTick(B); linkTick(B); doorTick(B); }
    haramTick(B); },
  hitMul(B, x, y){ if (inCone(B, x, y)) return 0; if (linkOn(B)){ linkHit(B); return 0; } return stunned(B) ? 2 : 1; },
  chat(B, t){ haramChat(B, t); },
  drawFloor(B, c){ doorFloor(B, c); trailDraw(B, c); whiteDraw(B, c); linkFloor(B, c); if (!stunned(B)){ shadowDraw(B, c); ffDraw(B, c); basicDraw(B, c, false); } },
  drawBody(B, c){ const [fx, fy] = foot(B), hf = half(B); let sx = 0, rot = 0; const ox = fx, oy = fy - FOOTD;
    if (B.phase === 2 && B.ph2 >= 0 && B.ph2 < 2.2) sx = Math.sin(B.now/14)*6*(1 - B.ph2/2.2); if (stunned(B)) rot = Math.sin(B.now/330)*.1;
    c.save(); c.translate(ox + sx, oy); if (rot) c.rotate(rot); drawWolf(c, hf, 0, 0, S);
    const id = cur(B).id; if (id !== 'search' && id !== 'shadow' && !stunned(B)){ c.save(); c.translate(HAND[0], HAND[1] + FOOTD); c.rotate(-.5); c.globalCompositeOperation = 'lighter';
      if (!hf){ c.globalAlpha = .3; c.fillStyle = '#fff6c0'; c.beginPath(); c.moveTo(-5, -5); c.lineTo(5, -5); c.lineTo(43, -94); c.lineTo(-43, -94); c.closePath(); c.fill(); }
      else if (Math.floor(B.now/166)%3){ c.globalAlpha = .3; c.fillStyle = '#ff2020'; c.beginPath(); c.moveTo(-5, -5); c.lineTo(5, -5); c.lineTo(47, -100); c.lineTo(-47, -100); c.closePath(); c.fill(); c.globalAlpha = 1; c.fillStyle = '#ff3a3a'; c.beginPath(); c.ellipse(0, 0, 4.4, 2.2, 0, 0, 7); c.fill(); }
      c.restore(); }
    c.restore(); },
  drawTop(B, c){ if (!stunned(B)){ basicDraw(B, c, true); searchDraw(B, c); linkTop(B, c); doorTop(B, c); } haramTop(B, c); },
  drawScreen(B, c, w, h){ smudges(B, c, w, h); ffScreen(B, c, w, h); doorScreen(B, c, w, h); transScreen(B, c, w, h); },
};
