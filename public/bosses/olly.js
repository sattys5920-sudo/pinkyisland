// 올리??? (오유리 · 3 시 17 분 사건) 다크 보스 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md "보스 패턴 규칙"
// 기본 공격: 물감 웅덩이 (발밑 원 → 3 초 남는 장판)
// ① 연습 스케치 (세 갈래 나선) · ② 보안 레이저 (경비 공백에 때리기) · ③ 진품과 위작 (멈춘 시계가 진짜)
// ④ 3:17 정전 (어둠 · 발자국 돌진) · ⑤ 전시 조명 (노리는 몸 · 몸으로 가림) · ⑥ 새벽 파랑 (흰색 + 남색 동시에 → 기절) · ⑦ 입찰 패들 (가장 많이 때린 사람)
// 움직일 때: 액자 속으로 스며들었다가 다른 액자에서 걸어 나와요 (천천히 걸을 땐 작은 액자 잔상) · 50%: 화면이 유화로 금 가고 흑백 · 물감이 흘러내려요
import { pick, beat, warnCircle, warnLine, text, shadow, cl, lerp, ease, dist } from './kit.js';
import * as A from './olly_art.js';

const S = .36, KR = 2*S, FOOT = A.FOOTL, REACH = 125, HEIGHT = Math.round((FOOT - A.BY0 + 30)*S);
const P = {
  1:[{id:'sketch', len:12}, {id:'laser', len:11.2}, {id:'clone', len:11}],
  2:[{id:'dark', len:12}, {id:'plate', len:11}, {id:'blue', len:15}],
  3:[{id:'bid', len:11.6}],
};
const GAP = 2.5, SINK = .45, EMERGE = .5;
const AMP = {sketch:0, laser:.5, clone:0, dark:0, plate:.45, blue:.55, bid:.6};
const LINES = {sketch:'마흔일곱 번 그렸어요', laser:'경비는… 없었죠', clone:'진짜는 하나뿐', dark:'3 시 17 분', plate:'소장품 No.13', blue:'그 색은 없어요', bid:'가장 많이 부른 분께'};
const L = {st:null, key:'', tp:0, say:null, txAt:0, carry:'', spillT:0, spills:0, gauge:0, exU:0, beamA:null, hits:0, hitW:-1, skImm:0, memo:{}, fx:[], mixSeen:'', dk:null};
const env = (t, a, b, c, d) => cl((t - a)/(b - a))*(1 - cl((t - c)/(d - c)));
const wv = t => [Math.cos(t*.42)*150 + Math.sin(t*1.07)*30, Math.sin(t*.61)*50 + Math.sin(t*1.3)*10];
const ampOf = (id, tt, len) => { if (!id || AMP[id] == null) return 1; return lerp(1, AMP[id], Math.min(cl(tt/.7), cl((len - tt)/.7))); };
const say = (text, ms = 2600) => { L.say = {text, until:performance.now() + ms}; };
const lo = B => B.lo || 140;

// ===== 보스 자리 (모두에게 같아요: B.t · B.bs 만으로) =====
function state(B, nc){
  if (!nc && L.st && L.st.now === B.now && L.st.bs === B.bs && L.st.ph === B.phase) return L.st;
  const cur = pick(B, P, {gap:GAP}), t = B.t, bs = B.bs || {}, T0 = t - cur.t;
  const s = {now:B.now, bs, ph:B.phase, cur, moves:[], fakes:null, stun:bs.stun > B.now, cage:false};
  const amp = tt => ampOf(cur.id, tt, cur.len), W = (abs, a) => { const w = wv(abs); return [B.hx + w[0]*a, B.hy + w[1]*a]; };
  let p = W(t, amp(cur.t));
  const run = list => { for (const m of list){ s.moves.push(m); if (!m.fake && t >= m.t0) p = m.live ? W(t, amp(cur.t)) : m.to; } };
  if (s.stun && bs.sx != null) p = [bs.sx, bs.sy];
  else if (cur.id === 'trans'){ p = [B.hx, B.hy]; s.moves.push({t0:T0, t1:T0 + .25, from:null, to:p}); }
  else if (cur.id === 'clone'){
    const SL = slots(B), seq = realSeq(B, cur.seed), TS = [.6, 4.2, 7.6, 10.3];
    s.slots = SL; s.seq = seq; s.seg = cur.t < TS[1] ? 0 : cur.t < TS[2] ? 1 : 2;
    run([{t0:T0 + TS[0], t1:T0 + TS[0] + .3, from:W(T0 + TS[0], amp(TS[0])), to:SL[seq[0]]},
      {t0:T0 + TS[1], t1:T0 + TS[1] + .3, from:SL[seq[0]], to:SL[seq[1]]},
      {t0:T0 + TS[2], t1:T0 + TS[2] + .3, from:SL[seq[1]], to:SL[seq[2]]},
      {t0:T0 + TS[3], t1:T0 + TS[3] + .3, from:SL[seq[2]], to:W(T0 + TS[3] + .3, amp(TS[3] + .3)), live:true}]);
    const others = i => [0, 1, 2].filter(j => j !== seq[i]);
    for (let i = 0; i < 3; i++){ const o = others(i), prev = i ? others(i - 1) : [null, null];
      o.forEach((j, q) => s.moves.push({fake:true, t0:T0 + TS[i], t1:T0 + TS[i] + .3, from:prev[q] == null ? null : SL[prev[q]], to:SL[j]})); }
    others(2).forEach(j => s.moves.push({fake:true, t0:T0 + TS[3], t1:T0 + TS[3] + .3, from:SL[j], to:null}));
    if (cur.t > TS[0] + .3 && cur.t < TS[3]) s.fakes = others(s.seg).map(j => SL[j]);
  }
  else if (cur.id === 'dark'){
    const d = bs.d4 && bs.d4.s === cur.seed ? bs.d4.p || [] : [], list = [], home = [B.hx, B.hy]; let prev = home; p = cur.n > 0 ? W(t, 1) : home;
    if (cur.n > 0) list.push({t0:T0 + .3, t1:T0 + .6, from:W(T0 + .3, 1), to:home});
    for (let k = 0; k < 3 && d[k]; k++){ const ta = T0 + darkW(k) + 1; list.push({t0:ta, t1:ta + .4, from:prev, to:d[k], dash:k}); prev = d[k]; }
    if (d.length) list.push({t0:T0 + 11.2, t1:T0 + 11.5, from:prev, to:W(T0 + 11.5, amp(11.5)), live:true});
    run(list); s.dashes = list.filter(m => m.dash != null);
  }
  if (!s.stun && bs.stun && bs.sx != null){ const te = t - (B.now - bs.stun)/1000; if (t - te < 2.5) s.moves.push({t0:te, t1:te + .3, from:[bs.sx, bs.sy], to:p}); }
  if (B.phase === 3 && B.pt < 1.5 && !s.stun) s.moves.push({t0:t - B.pt, t1:t - B.pt + .25, from:null, to:p});
  let a = 1, sc = 1;
  for (const m of s.moves){ if (m.fake || m.quiet) continue;
    if (m.from && t > m.t0 - SINK && t <= m.t0){ const u = ease((t - m.t0 + SINK)/SINK); a = Math.min(a, 1 - u); sc = Math.min(sc, 1 - .1*u); }
    else if (t > m.t0 && t < m.t1) a = 0;
    else if (t >= m.t1 && t < m.t1 + EMERGE){ const u = ease((t - m.t1)/EMERGE); a = Math.min(a, u); sc = Math.min(sc, .86 + .14*u); } }
  s.a = a; s.sc = sc; s.p = p;
  s.cage = cur.id === 'laser' && cur.t > .3 && !(cur.t > 6.75 && cur.t < 9.3) && !s.stun;
  if (!nc) L.st = s; return s;
}
const slots = B => [[B.hx - 175, B.hy - 10], [B.hx, B.hy - 10], [B.hx + 175, B.hy - 10]];
function realSeq(B, seed){ const r = B.rng('cl' + seed); let q = Math.floor(r()*3); const seq = [q]; for (let i = 1; i < 3; i++){ q = (q + 1 + Math.floor(r()*2)) % 3; seq.push(q); } return seq; }
const darkW = k => 1.2 + k*3.4;
// 보스 발 → 돋보기 (⑤ 빛이 나오는 곳)
const magOf = p => [p[0] - 208*S, p[1] + (216 - FOOT)*S];
// 조금 전 자리 (이동 연출용)
function stateAgo(B, sec){ const ms = sec*1000; return state({...B, now:B.now - ms, t:B.t - sec, pt:B.pt - sec, ph2:B.ph2 >= 0 ? B.ph2 - sec : -1, ph3:B.ph3 >= 0 ? B.ph3 - sec : -1}, true); }

// ===== 기본 공격: 물감 웅덩이 =====
const PCOL = ['#c8306a', '#3a62c4', '#e8b030', '#6a3ac8', '#2a9a7a'];
function puddles(B, s){
  const bt = beat(B, 3.4), out = [], n0 = bt.n; if (!B.alive.length) return out;
  for (let j = n0; j >= Math.max(0, n0 - 3); j--){
    const tb = j*bt.len, age = B.t - tb; if (age > 3.8) break; if (B.t < 3) continue;
    const r = B.rng('pu' + B.r.bossAt + '.' + j), m = Math.min(B.alive.length, 1 + Math.floor((B.alive.length - 1)/3)), pool = B.alive.slice();
    for (let i = 0; i < m; i++){ const who = pool.splice(Math.floor(r()*pool.length), 1)[0], k = 'pu' + B.r.bossAt + '.' + j + '.' + i;
      let q = L.memo[k]; if (!q){ if (age > .8 || s.stun || s.cur.id === 'trans') { L.memo[k] = 'x'; continue; } q = L.memo[k] = [who.x + (r() - .5)*30, who.y + (r() - .5)*16, PCOL[(j + i) % 5], B.now]; }
      if (q === 'x') continue; out.push({x:q[0], y:q[1], col:q[2], age, key:'pp' + B.r.bossAt + '.' + j + '.' + i}); } }
  return out; }

// ===== ① 연습 스케치: 세 갈래로 도는 종이 =====
const SK = {burst:[[.8, 5.0, 1], [6.6, 10.4, -1]], spin:.35, v:300, every:.2, max:720};
function sketches(B, cur, fn){ const r = B.rng('sk' + cur.seed), a0 = r()*Math.PI*2, o = [B.hx, B.hy]; let id = 0;
  for (const [a, b, d] of SK.burst){ const base0 = a0 + (d < 0 ? 1.2 : 0);
    for (let te = a; te < b; te += SK.every){ const age = cur.t - te; if (age < 0) break; const rr = age*SK.v; if (rr > SK.max){ id += 3; continue; }
      const base = base0 + d*SK.spin*(te - a);
      for (let k = 0; k < 3; k++, id++){ const an = base + k*Math.PI*2/3; fn(o[0] + Math.cos(an)*rr, o[1] + Math.sin(an)*rr*.6, age, id, cl((SK.max - rr)/80)); } } } }

// ===== ② 보안 레이저 =====
const LZ = [.4, 2.6, 4.8, 9.3];
function lasers(B, cur, k){ const m = 'lz' + cur.seed + '.' + k, key = L.memo[m]; if (key) return key; const r = B.rng(m), xs = [250, 330, 410, 490, 610, 690, 770, 850], ys = [360, 440, 520, 640, 720, 800], v = [], h = [];
  const nv = 1 + Math.floor(r()*2.4), nh = Math.floor(r()*2.2); for (let i = 0; i < nv; i++) v.push(xs.splice(Math.floor(r()*xs.length), 1)[0]); for (let i = 0; i < nh; i++) h.push(ys.splice(Math.floor(r()*ys.length), 1)[0]);
  return L.memo[m] = {v, h}; }
const lzState = (cur, k) => { const tt = cur.t - LZ[k]; return tt < 0 ? -1 : tt < 1 ? 0 : tt < (k === 3 ? 1.8 : 1.9) ? 1 : -1; }; // 0 예고 · 1 켜짐

// ===== ⑤ 전시 조명 =====
const BEAM = [[1.0, 5.4], [6.2, 10.4]];
// ===== ⑥ 새벽 파랑 =====
const CAN = {w:[230, 700, '#f4f4f8', '흰색'], n:[870, 700, '#1e2e78', '남색']};
const cansUp = (s, B) => s.cur.id === 'blue' && s.cur.t > .5 && s.cur.t < 9.5 && B.bs.mixK !== s.cur.seed;
// ===== ⑦ 입찰 패들 =====
const HAM = [2.4, 5.0, 7.6, 10.2], WORD = ['하나', '둘', '셋', '낙찰!'];
const winOf = t => HAM.filter(h => t >= h - 1).length; // 지금 세는 창 번호
const bidCode = (cur, w) => (cur.n % 97)*10 + w;

function hostTx(B, fn){ if (performance.now() - L.txAt < 350) return; L.txAt = performance.now(); B.tx(fn); }

export default {
  reach: REACH,
  height: HEIGHT,
  pos(B){ return state(B).p; },
  hitMul(B){ const s = state(B); if (s.a < .35) return 0; if (s.cage) return 0; return s.stun ? 2 : 1; },

  swing(B, cx, cy){
    const s = state(B), cur = s.cur;
    if (cur.id === 'clone' && s.fakes){ const dr = dist(cx, cy, s.p[0], s.p[1]);
      for (const f of s.fakes){ const df = dist(cx, cy, f[0], f[1]); if (df <= REACH && df < dr){ B.hurt(lo(B) + 60, 'fk' + B.now); B.sfx('slam'); B.shake(); L.fx.push({k:'burst', x:f[0], y:f[1], at:performance.now()}); return true; } } }
    if (cur.id === 'bid' && dist(cx, cy, s.p[0], s.p[1]) <= REACH){ const w = bidCode(cur, winOf(cur.t)); if (L.hitW !== w){ L.hitW = w; L.hits = 0; } L.hits++; }
    return false;
  },

  tick(B, dt){
    const s = state(B), cur = s.cur, me = B.me, alive = !!(me && !me.down), now = B.now, t = cur.t, LO = lo(B), BA = B.r.bossAt;
    const key = B.phase + ':' + cur.id + ':' + cur.n, fresh = L.key !== key, prevT = fresh ? (L.key ? -1e-3 : t) : L.tp; L.key = key; L.tp = t;
    const ev = te => t >= te && prevT < te;
    if (fresh){ if (Object.keys(L.memo).length > 400) L.memo = {}; if (cur.id && LINES[cur.id] && prevT < 0) say(LINES[cur.id]); }
    const bp = {}; let speed = 1;
    if (cur.id === 'trans'){ if (ev(.2)) B.sfx('warn'); if (ev(1.9)){ B.sfx('slam'); B.shake(); } if (ev(2.2)) say('다음 소장품은 ' + B.targetNick, 3000); }

    // 기본 공격: 물감 웅덩이
    for (const q of puddles(B, s)){
      if (q.age >= .8 && L.memo['s' + q.key] == null){ L.memo['s' + q.key] = 1; if (q.age < 1.1 && me && dist(me.x, me.y, q.x, q.y) < 300) B.sfx('slam', 200); }
      if (!alive || q.age < .8) continue; const inn = ((me.x - q.x)/54)**2 + ((me.y - q.y)/32)**2 < 1;
      if (inn){ speed = Math.min(speed, .55); B.hurt(LO + 60, q.key); } }
    if (beat(B, 3.4).t < dt*1.5 && !s.stun && cur.id !== 'trans') B.sfx('warn', 400);

    if (!s.stun){
      // ① 연습 스케치
      if (cur.id === 'sketch'){ if (ev(.8) || ev(6.6)) B.sfx('warn');
        if (alive && now > L.skImm) sketches(B, cur, (x, y, age, id) => { if (Math.abs(me.x - x) < 24 && Math.abs(me.y - y) < 17){ if (B.hurt(LO + 40, 'sk' + BA + '.' + cur.n + '.' + id)){ L.skImm = now + 700; B.push(me.x - B.hx, me.y - B.hy, 40); } } }); }
      // ② 보안 레이저
      if (cur.id === 'laser') LZ.forEach((_, k) => { if (ev(LZ[k])) B.sfx('warn'); if (ev(LZ[k] + 1)) B.sfx('slam');
        if (!alive || lzState(cur, k) !== 1) return; const z = lasers(B, cur, k);
        if (z.v.some(x => Math.abs(me.x - x) < 13) || z.h.some(y => Math.abs(me.y - y) < 11)) B.hurt(LO + 100, 'lz' + BA + '.' + cur.n + '.' + k); });
      // ③ 진품과 위작: 섞일 때 소리
      if (cur.id === 'clone'){ if (ev(.6) || ev(4.2) || ev(7.6)) B.sfx('warn'); }
      // ④ 3:17 정전: 호스트가 돌진 끝 자리를 정해요
      if (cur.id === 'dark'){
        for (let k = 0; k < 3; k++){ const w = darkW(k); if (ev(w)) B.sfx('warn'); if (ev(w + 1)){ B.sfx('slam'); B.shake(); } }
        const d = B.bs.d4 && B.bs.d4.s === cur.seed ? B.bs.d4.p || [] : [], k = d.length;
        if (B.host && k < 3 && t >= darkW(k) - .35 && t < darkW(k) + .9 && B.alive.length){
          const n = B.alive.length, who = B.alive[(Math.floor(B.rng('d4' + cur.seed)()*n) + k) % n], prev = k ? d[k - 1] : [B.hx, B.hy];
          let x = cl(who.x, 150, 950), y = cl(who.y, 340, 840); if (dist(x, y, prev[0], prev[1]) < 80){ x = cl(x + (x > 550 ? -140 : 140), 150, 950); }
          hostTx(B, bs => { const cd = bs.d4 && bs.d4.s === cur.seed ? bs.d4.p || [] : []; if (cd.length !== k) return undefined; return {...bs, d4:{s:cur.seed, p:[...cd, [Math.round(x), Math.round(y)]]}}; }); }
        if (alive) for (const m of s.dashes || []){ const tt = B.t; if (tt < m.t0 - .05 || tt > m.t1 + .05) continue;
          const [ax, ay] = m.from, [bx, by] = m.to, vx = bx - ax, vy = (by - ay)/.7, L2 = vx*vx + vy*vy || 1, u = cl(((me.x - ax)*vx + (me.y - ay)/.7*vy)/L2), px = ax + vx*u - me.x, py = (ay + (by - ay)*u - me.y)/.7;
          if (Math.hypot(px, py) < 52 && B.hurt(LO + 150, 'd4' + BA + '.' + cur.n + '.' + m.dash)) B.push(-px || 1, -py, 70); } }
      // ⑤ 전시 조명
      if (cur.id === 'plate' && B.target){ const tg = B.target, o = magOf(s.p), want = Math.atan2(tg.y - 24 - o[1], tg.x - o[0]), bi = BEAM.findIndex(([a, b]) => t >= a - .8 && t < b), on = bi >= 0 && t >= BEAM[bi][0];
        if (L.beamA == null || !on) L.beamA = want; else { let da = Math.atan2(Math.sin(want - L.beamA), Math.cos(want - L.beamA)); const mx = .95*dt; L.beamA += cl(da, -mx, mx); }
        BEAM.forEach(([a], i) => { if (ev(a - .8)) B.sfx('warn'); });
        if (tg.me && alive){ const d = dist(o[0], o[1], tg.x, tg.y - 24), diff = Math.abs(Math.atan2(Math.sin(want - L.beamA), Math.cos(want - L.beamA))), lit = on && diff < Math.atan2(30, d) && now > L.exU, blk = on && blocker(B, o, L.beamA, d);
          if (lit && !blk) L.gauge += dt*.32; else L.gauge = Math.max(0, L.gauge - dt*.2);
          if (L.gauge >= 1){ L.gauge = 0; L.exU = now + 1600; B.hurt(LO + 200, 'pl' + BA + '.' + cur.n + '.' + bi); B.sfx('slam'); B.shake(); }
          if (L.gauge > .02) bp.g = Math.round(L.gauge*20)/20; if (now < L.exU) bp.x = 1; } }
      if (now < L.exU) B.ctl.lock = true;
      // ⑥ 새벽 파랑: 흰색 · 남색 (혼자면 혼자 둘 다)
      if (cur.id === 'blue'){
        const up = cansUp(s, B), solo = B.alive.length <= 1, near = q => dist(q.x, q.y, s.p[0], s.p[1]) < 150;
        if (!up) L.carry = '';
        if (up && alive){ for (const c of ['w', 'n']){ const cn = CAN[c]; if (dist(me.x, me.y, cn[0], cn[1]) < 44 && !L.carry.includes(c)){ L.carry = solo ? [...new Set((L.carry + c).split(''))].sort().reverse().join('') : c; B.sfx('hit', 300); } }
          if (L.carry){ speed = Math.min(speed, .8);
            const cols = new Set(); for (const q of B.alive) if (near(q)) for (const ch of (q.me ? L.carry : (q.bp && q.bp.c) || '')) cols.add(ch);
            if (near(me) && !(cols.has('w') && cols.has('n'))){ L.spillT += dt; if (L.spillT > 1.4){ L.spillT = 0; L.carry = ''; B.hurt(LO + 80, 'sp' + BA + '.' + cur.n + '.' + (L.spills++)); B.fx('철퍽', me.x, me.y - 60, '#9ad0ff'); B.sfx('slam'); } } else L.spillT = 0; }
          if (L.carry) bp.c = L.carry; }
        if (B.host && up){ const cols = new Set(); for (const q of B.alive) if (near(q)) for (const ch of (q.me ? L.carry : (q.bp && q.bp.c) || '')) cols.add(ch);
          if (cols.has('w') && cols.has('n')){ const [sx, sy] = s.p; hostTx(B, bs => bs.mixK === cur.seed ? undefined : {...bs, stun:B.now + 8000, sx:Math.round(sx), sy:Math.round(sy), mixK:cur.seed, mixAt:B.now}); } } }
      // ⑦ 입찰 패들
      if (cur.id === 'bid'){
        HAM.forEach((h, k) => { if (ev(h - 1)) B.sfx('warn'); if (ev(h)){ B.sfx('slam'); B.shake(); if (k === 3) say('낙찰!', 1500); } });
        const w = winOf(t); if (L.hitW !== bidCode(cur, w)){ L.hitW = bidCode(cur, w); L.hits = 0; } bp.h = L.hits; bp.w = L.hitW;
        const k = w - 1, bid = B.bs.bid;
        if (B.host && k >= 0 && k < 4 && t < HAM[k] - .2 && !(bid && bid.s === cur.seed && bid.k >= k) && B.alive.length){
          const code = bidCode(cur, k); let best = null, bh = 0; for (const q of B.alive){ const h = q.me ? (L.hitW === code ? L.hits : 0) : q.bp && q.bp.w === code ? q.bp.h | 0 : 0; if (h > bh){ bh = h; best = q; } }
          if (!best) best = B.alive[Math.floor(B.rng('bd' + cur.seed + k)()*B.alive.length)];
          const u = best.uid; hostTx(B, bs => bs.bid && bs.bid.s === cur.seed && bs.bid.k >= k ? undefined : {...bs, bid:{s:cur.seed, k, u}}); }
        if (alive && bid && bid.s === cur.seed && bid.u === me.uid){ const h = HAM[bid.k], q = bidSpot(B, cur, bid);
          if (q && t >= h && t < h + .18 && ((me.x - q[0])/(bid.k === 3 ? 110 : 86))**2 + ((me.y - q[1])/((bid.k === 3 ? 110 : 86)*.6))**2 < 1) B.hurt(LO + (bid.k === 3 ? 200 : 150), 'bd' + BA + '.' + cur.n + '.' + bid.k); } }
    }
    // ⑥ 성공: 모두 내려놓고 기절
    if (B.bs.mixK && B.bs.mixK !== L.mixSeen && B.now - (B.bs.mixAt || 0) < 4000){ L.mixSeen = B.bs.mixK; L.carry = ''; say('새벽 파랑…!', 2400); B.sfx('slam'); B.shake(); }
    if (speed < 1) B.ctl.speed = speed;
    B.setBp(Object.keys(bp).length ? bp : null);
  },

  drawFloor(B, c){ const s = state(B), cur = s.cur, t = B.t, now = performance.now();
    // 이동: 바닥 붓자국 (빠를수록 굵게)
    for (const m of s.moves){ if (!m.from || !m.to || m.fake || t < m.t0 - .1 || t > m.t1 + .9) continue; const k = cl((t - m.t0)/Math.max(.25, m.t1 - m.t0)), al = cl((m.t1 + .9 - t)/.5), d = dist(m.from[0], m.from[1], m.to[0], m.to[1]), wd = 10 + Math.min(26, d/14);
      const a = m.from, b = [lerp(a[0], m.to[0], k), lerp(a[1], m.to[1], k)]; c.save(); c.lineCap = 'round';
      for (let i = 0; i < 6; i++){ const off = (i - 2.5)/2.5*wd*.5; c.globalAlpha = al*(.35 + .1*(i % 3)); c.strokeStyle = A.OILC[i % 4]; c.lineWidth = wd*(.25 + .12*((i*5) % 3)); c.beginPath(); c.moveTo(a[0], a[1] + off); c.quadraticCurveTo((a[0] + b[0])/2 + off*1.5, (a[1] + b[1])/2 + off - 16, b[0], b[1] + off*.5); c.stroke(); } c.restore(); }
    // 물감 웅덩이
    for (const q of puddles(B, s)){
      if (q.age < .8) warnCircle(c, q.x, q.y, 54, 32, q.age/.8, '230,120,200');
      else { c.save(); c.globalAlpha = .78*cl((3.8 - q.age)/.6); c.fillStyle = q.col; c.beginPath(); c.ellipse(q.x, q.y, 56, 32, 0, 0, 7); c.fill(); for (let j = 0; j < 5; j++){ c.beginPath(); c.ellipse(q.x + Math.cos(j*1.3)*54, q.y + Math.sin(j*1.3)*30, 9, 5, 0, 0, 7); c.fill(); }
        c.globalAlpha *= .5; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(q.x - 16, q.y - 9, 14, 5, -.2, 0, 7); c.fill(); c.restore(); } }
    if (s.stun) return;
    // ② 레이저 예고 (점선) · 보스 둘레 레이저 우리
    if (cur.id === 'laser'){ LZ.forEach((_, k) => { if (lzState(cur, k) !== 0) return; const z = lasers(B, cur, k), u = cur.t - LZ[k]; for (const x of z.v) warnLine(c, x, 260, x, 890, u, 4); for (const y of z.h) warnLine(c, 30, y, 1070, y, u, 4); });
      const [x, y] = s.p, on = s.cage; c.save(); c.strokeStyle = on ? 'rgba(255,40,70,.7)' : 'rgba(120,255,190,.55)'; c.lineWidth = 3; c.setLineDash(on ? [] : [8, 8]); c.beginPath(); c.ellipse(x, y, 105, 50, 0, 0, 7); c.stroke(); c.restore(); }
    // ④ 발자국 (어둠 위에도 다시 그려요)
    if (cur.id === 'dark') footprints(B, s, c, p => p);
    // ⑤ 노리는 몸 표시
    if (cur.id === 'plate' && B.target){ const q = B.target; c.save(); c.strokeStyle = `rgba(255,60,80,${.5 + .4*Math.sin(now/160)})`; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.beginPath(); c.ellipse(q.x, q.y + 2, 34, 13, 0, 0, 7); c.stroke(); c.restore(); }
    // ⑥ 물감 통 (구석 둘)
    if (cansUp(s, B)){ const a = cl((cur.t - .5)*2)*cl((9.5 - cur.t)*2); for (const c2 of ['w', 'n']){ const [x, y, col, nm] = CAN[c2], img = A.paintCan(col, nm); c.save(); c.globalAlpha = a; const gl = .35 + .25*Math.sin(now/200 + (c2 === 'n' ? 2 : 0)); c.fillStyle = c2 === 'w' ? `rgba(255,255,255,${gl*.4})` : `rgba(80,120,255,${gl*.5})`; c.beginPath(); c.ellipse(x, y, 40, 18, 0, 0, 7); c.fill(); c.drawImage(img, x - 28, y - 54, 56, 64); c.restore(); } }
    // ⑦ 가격표가 떨어질 자리
    if (cur.id === 'bid'){ const bid = B.bs.bid; if (bid && bid.s === cur.seed){ const q = bidSpot(B, cur, bid), h = HAM[bid.k], u = cur.t - (h - 1), R = bid.k === 3 ? 110 : 86;
      if (q && u >= 0 && u < 1) warnCircle(c, q[0], q[1], R, R*.6, u, '255,80,110'); else if (q && u >= 1 && u < 1.8){ c.save(); c.globalAlpha = cl((1.8 - u)/.5)*.6; c.fillStyle = '#8a1030'; c.beginPath(); c.ellipse(q[0], q[1], R, R*.6, 0, 0, 7); c.fill(); c.restore(); } } }
  },

  drawBody(B, c){ const s = state(B), cur = s.cur, t = B.t, half = B.phase >= 2 && !(cur.id === 'trans' && B.ph2 < 1.9), now = performance.now();
    // 액자: 옛 자리로 스며들고 새 자리에서 걸어 나와요
    for (const m of s.moves){ if (m.quiet) continue;
      if (m.from && t > m.t0 - SINK && t < m.t0 + .7){ const u = cl((t - m.t0 + SINK)/SINK), fa = cl((t - m.t0 + SINK)/.15)*cl((m.t0 + .7 - t)/.3); A.drawFrame(c, m.from[0], m.from[1] - 118, 1.04, fa, ease(u)*(1 - cl((t - m.t0 - .25)/.4)), half, cl((t - m.t0)/.6)); }
      if (m.to && t > m.t1 - .3 && t < m.t1 + EMERGE + .35){ const u = cl((t - m.t1)/EMERGE), fa = cl((t - m.t1 + .3)/.15)*cl((m.t1 + EMERGE + .35 - t)/.3); A.drawFrame(c, m.to[0], m.to[1] - 118, 1.04, fa, 1 - ease(u), half, 0); } }
    // 천천히 걸을 때: 지나온 쪽에 작은 액자 잔상
    if (s.a > .95 && !s.moves.some(m => !m.quiet && t > m.t0 - 1 && t < m.t1 + 1.2)){ const pv = stateAgo(B, .25), vx = s.p[0] - pv.p[0], vy = s.p[1] - pv.p[1], sp = Math.hypot(vx, vy)/.25, a = cl((sp - 8)/45);
      if (a > .02) for (let k = 3; k >= 1; k--){ const x = s.p[0] - vx/(sp*.25)*(52 + 46*k), y = s.p[1] - vy/(sp*.25)*(24 + 18*k) - 112 - Math.sin(now/500 + k)*6;
        c.save(); c.translate(x, y); c.rotate(Math.sin(now/700 + k)*.1); A.drawFrame(c, 0, 0, .42, a*(.62 - k*.14), .9, half, 0); c.restore(); } }
    // 50% 붉은 기운
    if (half && s.a > .05){ const pu = .75 + Math.sin(now/330)*.25, [x, y] = s.p, gq = c.createRadialGradient(x, y - 150, 14, x, y - 150, 150); gq.addColorStop(0, `rgba(220,20,60,${.38*pu*s.a})`); gq.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gq; c.fillRect(x - 150, y - 300, 300, 300); }
    // 가짜 둘 (③) · 시계가 째깍째깍
    const T = B.now/1000, big = cur.id === 'clone';
    if (s.fakes){ const fa = cur.t < .9 || cur.t > 10.3 ? 0 : s.a; for (const f of s.fakes) drawCurator(c, f[0], f[1], s.sc, fa, half, 'tick', T, true); }
    let sh = 0; if (cur.id === 'trans' && B.ph2 < 2.2) sh = Math.sin(now/14)*6*(1 - B.ph2/2.2); if (s.stun) sh = Math.sin(now/300)*4;
    drawCurator(c, s.p[0] + sh, s.p[1], s.sc, s.a, half, cur.id === 'trans' && B.ph2 < 2 ? 'spin' : 'stop', T, big);
    if (s.stun && B.bs.mixAt){ const k = (B.now - B.bs.mixAt)/1000, [x, y] = s.p; c.save(); c.globalAlpha = cl(8 - k)*.85; c.fillStyle = '#3a6ad8'; for (let i = 0; i < 7; i++){ const dx = (i - 3)*16, L2 = 20 + ((i*37) % 30) + Math.min(40, k*12); c.fillRect(x + dx - 3, y - 230, 6, L2); c.beginPath(); c.ellipse(x + dx, y - 230 + L2, 5, 7, 0, 0, 7); c.fill(); } c.restore(); }
  },

  drawTop(B, c){ const s = state(B), cur = s.cur, now = performance.now();
    // 웅덩이: 떨어지는 물감 방울 · 철퍽
    for (const q of puddles(B, s)){ if (q.age > .45 && q.age < .8){ const u = (q.age - .45)/.35; c.save(); c.fillStyle = q.col; c.beginPath(); c.ellipse(q.x, lerp(q.y - 300, q.y - 10, u*u), 11, 16, 0, 0, 7); c.fill(); c.restore(); }
      if (q.age > .8 && q.age < 1.2) text(c, '철퍽', q.x + 56, q.y - 24, 26, '#ffd8ee'); }
    // ③ 가짜를 쳤을 때 물감 터짐 (내 화면)
    L.fx = L.fx.filter(f => now - f.at < 1300); for (const f of L.fx){ const k = (now - f.at)/1000; c.save(); c.globalAlpha = cl(1.3 - k); for (let i = 0; i < 10; i++){ c.fillStyle = PCOL[i % 5]; c.beginPath(); c.ellipse(f.x + Math.cos(i*.63)*k*130, f.y - 120 + Math.sin(i*1.7)*k*90 + k*k*80, 9, 9, 0, 0, 7); c.fill(); } c.restore(); text(c, '가짜!', f.x, f.y - 280 - k*20, 30, '#ffb0c8'); }
    // ⑥ 새벽 파랑 터짐
    if (B.bs.mixAt && B.now - B.bs.mixAt < 2600 && B.bs.mixK){ const k = (B.now - B.bs.mixAt)/1000, [x, y] = s.p; c.save(); c.globalAlpha = cl(2.6 - k); for (let i = 0; i < 14; i++){ c.fillStyle = i % 2 ? 'rgba(90,140,230,.9)' : 'rgba(60,110,210,.9)'; c.beginPath(); c.ellipse(x + Math.cos(i*.7)*(20 + k*90), y - 60 + Math.sin(i*1.3)*(10 + k*40), 12, 9, 0, 0, 7); c.fill(); } c.restore(); }
    if (s.stun) return carried(B, c);
    // ① 날아가는 스케치
    if (cur.id === 'sketch') sketches(B, cur, (x, y, age, id, al) => { if (al <= 0) return; const img = A.sheet(1 + id % 47); c.save(); c.globalAlpha = al; c.translate(x, y - 22); c.rotate(age*3 + id); c.drawImage(img, -22, -26, 44, 52); c.restore(); });
    // ② 켜진 레이저
    if (cur.id === 'laser'){ LZ.forEach((_, k) => { if (lzState(cur, k) !== 1) return; const z = lasers(B, cur, k); c.save(); c.lineCap = 'round';
        for (const [w, col] of [[14, 'rgba(255,40,60,.25)'], [5, 'rgba(255,60,80,.95)'], [1.6, '#fff']]){ c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (const x of z.v){ c.moveTo(x, 250); c.lineTo(x, 895); } for (const y of z.h){ c.moveTo(20, y); c.lineTo(1080, y); } c.stroke(); } c.restore(); });
      const [x, y] = s.p; if (s.cage){ c.save(); c.strokeStyle = 'rgba(255,50,80,.75)'; c.lineWidth = 2; for (let i = 0; i < 7; i++){ const a = i/7*Math.PI*2 + B.now/1600, px = x + Math.cos(a)*105, py = y + Math.sin(a)*50; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py - 250); c.stroke(); } c.restore(); }
      else if (cur.t > 6.75 && cur.t < 9.3){ c.save(); c.fillStyle = 'rgba(10,8,20,.85)'; c.beginPath(); c.roundRect(x - 62, y - HEIGHT + 18, 124, 30, 8); c.fill(); c.restore(); text(c, '3:10 ~ 3:30', x, y - HEIGHT + 33, 28, '#9affd0'); } }
    // ③ 시계 글자는 drawCurator 에서
    // ⑤ 전시 조명
    if (cur.id === 'plate' && B.target){ const tg = B.target, o = magOf(s.p), bi = BEAM.findIndex(([a, b]) => cur.t >= a - .8 && cur.t < b + .4), d = dist(o[0], o[1], tg.x, tg.y - 24);
      if (bi >= 0){ const [on, off] = BEAM[bi], ang = L.beamA ?? 0;
        if (cur.t < on){ c.save(); c.setLineDash([10, 8]); c.strokeStyle = 'rgba(255,240,190,.7)'; c.lineWidth = 3; c.beginPath(); c.moveTo(o[0], o[1]); c.lineTo(o[0] + Math.cos(ang)*d, o[1] + Math.sin(ang)*d); c.stroke(); c.restore(); }
        else { const bl = blocker(B, o, ang, d, true), Lb = bl ? bl.d : d + 40, al = cl((off + .4 - cur.t)/.4);
          c.save(); c.globalAlpha = al; c.globalCompositeOperation = 'lighter'; c.translate(o[0], o[1]); c.rotate(ang); const q = c.createLinearGradient(0, 0, Lb, 0); q.addColorStop(0, 'rgba(255,246,200,.75)'); q.addColorStop(1, 'rgba(255,236,170,.3)'); c.fillStyle = q; c.beginPath(); c.moveTo(0, -7); c.lineTo(Lb, -32); c.lineTo(Lb, 32); c.lineTo(0, 7); c.closePath(); c.fill(); c.restore();
          if (!bl && Math.abs(Math.atan2(Math.sin(Math.atan2(tg.y - 24 - o[1], tg.x - o[0]) - ang), Math.cos(Math.atan2(tg.y - 24 - o[1], tg.x - o[0]) - ang))) < Math.atan2(30, d)){ const pw = 150; c.save(); c.fillStyle = 'rgba(232,192,96,.95)'; c.beginPath(); c.roundRect(tg.x - pw/2, tg.y - 132, pw, 26, 5); c.fill(); c.restore(); text(c, '소장품 No.13 — ' + (tg.nick || ''), tg.x, tg.y - 119, 21, '#3a2408', 'center', null); } } }
      const gv = tg.me ? L.gauge : (tg.bp && tg.bp.g) || 0; if (gv > .01){ c.save(); c.fillStyle = 'rgba(10,8,20,.8)'; c.fillRect(tg.x - 40, tg.y - 98, 80, 9); c.fillStyle = '#ffd860'; c.fillRect(tg.x - 40, tg.y - 98, 80*cl(gv), 9); c.restore(); }
      const ex = tg.me ? B.now < L.exU : tg.bp && tg.bp.x; if (ex){ c.save(); c.strokeStyle = 'rgba(200,230,255,.8)'; c.fillStyle = 'rgba(180,220,255,.18)'; c.lineWidth = 2; c.beginPath(); c.rect(tg.x - 30, tg.y - 86, 60, 92); c.fill(); c.stroke(); c.restore(); } }
    carried(B, c);
    // ⑦ 가격표 · 왕관
    if (cur.id === 'bid'){ const bid = B.bs.bid;
      if (bid && bid.s === cur.seed){ const q = bidSpot(B, cur, bid), h = HAM[bid.k], u = cur.t - h, img = A.priceTag(), sc = bid.k === 3 ? 1.25 : 1;
        if (q && u > -.3 && u < .8){ const y = u < 0 ? lerp(q[1] - 380, q[1] - 24, ((u + .3)/.3)**2) : q[1] - 24; c.save(); c.globalAlpha = u < 0 ? 1 : cl((.8 - u)/.5); c.translate(q[0], y); c.rotate(-.12); c.drawImage(img, -80*sc, -35*sc, 160*sc, 70*sc); c.restore(); }
        if (u > -.1 && u < 1){ const [x, y] = s.p; text(c, WORD[bid.k], x + 120, y - HEIGHT + 30 - u*14, bid.k === 3 ? 54 : 42, bid.k === 3 ? '#ff6a7a' : '#ffe9a0'); } }
      let best = null, bh = 0; for (const q of B.alive){ const hh = q.me ? L.hits : q.bp && q.bp.w === L.hitW ? q.bp.h | 0 : 0; if (hh > bh){ bh = hh; best = q; } }
      if (best){ c.save(); c.translate(best.x, best.y - 92 + Math.sin(now/200)*3); c.fillStyle = '#ffd860'; c.strokeStyle = '#6a4a10'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-14, 7); c.lineTo(-14, -5); c.lineTo(-7, 2); c.lineTo(0, -9); c.lineTo(7, 2); c.lineTo(14, -5); c.lineTo(14, 7); c.closePath(); c.fill(); c.stroke(); c.restore(); } }
  },

  drawScreen(B, c, w, h){ const s = state(B), cur = s.cur;
    // ④ 정전: 어둠 · 사람 둘레만 보여요 · 빨간 발자국과 보스 눈만 빛나요
    if (cur.id === 'dark' && !s.stun){ const a = .88*cl(cur.t/.6)*cl((cur.len - cur.t)/.8); if (a > .01){
      if (!L.dk || L.dk.width !== Math.ceil(w) || L.dk.height !== Math.ceil(h)){ L.dk = document.createElement('canvas'); L.dk.width = Math.ceil(w); L.dk.height = Math.ceil(h); }
      const d = L.dk.getContext('2d'), z = B.view.zoom || 1; d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, w, h); d.fillStyle = `rgba(4,0,8,${a})`; d.fillRect(0, 0, w, h); d.globalCompositeOperation = 'destination-out';
      const hole = (x, y, r, al) => { const q = d.createRadialGradient(x, y, r*.25, x, y, r); q.addColorStop(0, `rgba(0,0,0,${al})`); q.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = q; d.fillRect(x - r, y - r, r*2, r*2); };
      for (const q of B.alive){ const [x, y] = B.toScreen(q.x, q.y - 20); hole(x, y, 115*z, 1); }
      if (s.a > .1){ const [x, y] = B.toScreen(s.p[0], s.p[1] - 40); hole(x, y, 120*z, .45*s.a); }
      c.drawImage(L.dk, 0, 0, w, h);
      footprints(B, s, c, p => B.toScreen(p[0], p[1]), z);
      if (s.a > .1){ const [x, y] = B.toScreen(s.p[0] - 26*S*s.sc, s.p[1] - (FOOT + 170)*S*s.sc); c.save(); c.globalAlpha = s.a*(.7 + .3*Math.sin(B.now/150)); const q = c.createRadialGradient(x, y, 1, x, y, 16*z); q.addColorStop(0, 'rgba(255,90,110,1)'); q.addColorStop(1, 'rgba(255,0,40,0)'); c.fillStyle = q; c.fillRect(x - 16*z, y - 16*z, 32*z, 32*z); c.restore(); }
      if (cur.t < 1.4) text(c, '3:17', w/2, h*.32, 64, '#ff6a7a'); } }
    // 50% 변신: 유화로 금 가고 · 색이 빠지고 · 물감이 흘러내려요
    if (B.phase >= 2 && B.ph2 >= 0 && B.ph2 < 6.2){ transScreen(B, c, w, h, B.ph2, s);
      if (L.say && performance.now() < L.say.until){ const z = B.view.zoom || 1, [x, y] = B.toScreen(s.p[0], s.p[1] - HEIGHT); c.save(); c.font = 'bold 24px "Dongle",sans-serif'; c.textAlign = 'center'; const sw = c.measureText(L.say.text).width + 28; c.fillStyle = 'rgba(239,230,208,.96)'; c.beginPath(); c.roundRect(x - sw/2, y - 30*z - 16, sw, 34, 12); c.fill(); c.fillStyle = '#5a1030'; c.textBaseline = 'middle'; c.fillText(L.say.text, x, y - 30*z + 1); c.restore(); } }
  },

  label(B, c, x, y, t){ const s = state(B); if (s.a < .25) return;
    const spots = s.fakes && s.cur.t > .9 && s.cur.t < 10.3 ? s.slots : [[x, y]];
    for (const [lx, ly] of spots) nameTag(B, c, lx, ly, t, lx === x && ly === y, spots.length > 1 ? Math.abs(lx - B.hx) < 1 : true);
  },
};

// ===== 그리기 도우미 =====
function drawCurator(c, x, y, sc, al, half, mode, T, bigWatch){ if (al <= .01) return; const k = S*sc, img = A.bossSprite(half, KR);
  c.save(); c.globalAlpha = al; c.drawImage(img, x + A.BX0*k, y - FOOT*k + A.BY0*k, (A.BX1 - A.BX0)*k, (A.BY1 - A.BY0)*k);
  const ox = x, oy = y - FOOT*k, wr = A.WATCH[2]*k*(bigWatch ? 1.7 : 1); A.watchFace(c, ox + A.WATCH[0]*k, oy + A.WATCH[1]*k, wr, mode, T, bigWatch); c.restore(); }
function nameTag(B, c, x, y, t, real, bubble){ const top = y - HEIGHT, nm = B.phase >= 2 ? (B.ph2 < 2.8 && B.ph2 > 1 && Math.floor(t/70) % 2 ? B.name + '???' : B.real || '오유리') : B.name + '???', w = 170, rage = B.phase >= 2;
  c.save(); c.font = 'bold 22px "Dongle",sans-serif'; c.textAlign = 'center'; const tw = c.measureText(nm).width + 34;
  c.fillStyle = 'rgba(16,4,10,.85)'; c.beginPath(); c.roundRect(x - tw/2, top - 44, tw, 28, 10); c.fill(); c.strokeStyle = rage ? '#e8c060' : '#b58cff'; c.lineWidth = 2; c.stroke();
  if (rage && Math.floor(t/90) % 13 === 0){ c.fillStyle = 'rgba(255,30,90,.8)'; c.fillText(nm, x - 3, top - 23); c.fillStyle = 'rgba(255,210,120,.7)'; c.fillText(nm, x + 3, top - 23); }
  c.fillStyle = rage ? '#ffdede' : '#f4ecff'; c.fillText(nm, x, top - 23);
  c.fillStyle = 'rgba(60,10,20,.9)'; c.fillRect(x - w/2, top - 12, w, 8); c.fillStyle = rage ? '#ff3b6b' : '#b58cff'; c.fillRect(x - w/2, top - 12, w*Math.max(0, B.r.hp)/B.r.max, 8);
  c.font = 'bold 13px "Dongle",sans-serif'; c.fillStyle = '#ffd0dc'; c.fillText(`${Math.max(0, Math.ceil(B.r.hp)).toLocaleString()} / ${B.r.max.toLocaleString()}`, x, top + 9);
  if (real && B.bs.stun > B.now){ for (let i = 0; i < 3; i++){ const a = t/300 + i*2.1; c.fillStyle = '#ffe14a'; c.font = 'bold 20px sans-serif'; c.fillText('★', x + Math.cos(a)*40, top + 30 + Math.sin(a)*10); } }
  if (bubble && L.say && performance.now() < L.say.until && !(B.phase >= 2 && B.ph2 < 6.2)){ c.font = 'bold 20px "Dongle",sans-serif'; const s = L.say.text, sw = c.measureText(s).width + 26; c.fillStyle = 'rgba(239,230,208,.96)'; c.beginPath(); c.roundRect(x - sw/2, top - 84, sw, 30, 12); c.fill(); c.fillStyle = '#5a1030'; c.fillText(s, x, top - 63); }
  c.restore(); }
// ④ 빨간 발자국: 보스 자리 → 돌진 끝
function footprints(B, s, c, toS, z = 1){ for (const m of s.dashes || []){ const k = B.t - (m.t0 - 1); if (k < 0 || k > 1.5) continue; const n = 8, ang = Math.atan2(m.to[1] - m.from[1], m.to[0] - m.from[0]) + Math.PI/2;
  for (let i = 0; i < n; i++){ if (k < i*.1) continue; const u = (i + .5)/n, [x, y] = toS([lerp(m.from[0], m.to[0], u) + (i % 2 ? 9 : -9)*Math.cos(ang), lerp(m.from[1], m.to[1], u) + (i % 2 ? 9 : -9)*Math.sin(ang)]);
    c.save(); c.globalAlpha = .9*cl((1.5 - k)*2); c.translate(x, y); c.rotate(ang); c.scale(z, z); c.fillStyle = '#e0203a'; c.shadowColor = '#ff2040'; c.shadowBlur = 6; c.beginPath(); c.ellipse(0, 0, 7, 11, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(0, -14, 4.5, 4.5, 0, 0, 7); c.fill(); c.restore(); } } }
// ⑤ 빛줄기를 가린 친구 (노리는 몸 말고 · 살아 있는 사람)
function blocker(B, o, ang, d, info){ const ca = Math.cos(ang), sa = Math.sin(ang); let best = null;
  for (const q of B.alive){ if (B.target && q.uid === B.target.uid) continue; const dx = q.x - o[0], dy = q.y - 24 - o[1], along = dx*ca + dy*sa, off = Math.abs(-dx*sa + dy*ca);
    if (along > d*.08 && along < d*.97 && off < 26 && (!best || along < best.d)) best = {d:along, q}; }
  return info ? best : !!best; }
// ⑥ 들고 있는 물감 통
function carried(B, c){ for (const q of B.all){ if (q.down) continue; const cs = q.me ? L.carry : (q.bp && q.bp.c) || ''; if (!cs) continue;
  [...cs].forEach((ch, i) => { const [, , col, nm] = CAN[ch] || []; if (!col) return; c.drawImage(A.paintCan(col, nm), q.x + 6 + i*22, q.y - 92, 34, 39); }); } }
// ⑦ 가격표 자리: 그 사람이 처음 보인 자리 (내 화면 · 나라면 정확해요)
function bidSpot(B, cur, bid){ const k = 'bs' + cur.seed + '.' + bid.k; if (L.memo[k]) return L.memo[k]; const q = B.all.find(p => p.uid === bid.u); if (!q) return null; return L.memo[k] = [q.x, q.y]; }
// 50% 변신 화면
let DRIPS = null;
function transScreen(B, c, w, h, k, s){
  const [bx, by] = B.toScreen(s.p[0], s.p[1] - 140);
  const oil = env(k, .2, 1.0, 4.0, 5.8); if (oil > 0){ c.save(); c.globalAlpha = oil*.9; c.drawImage(A.oilCanvas(Math.ceil(w), Math.ceil(h)), 0, 0, w, h); c.globalAlpha = oil*.25; c.fillStyle = '#08040e'; c.fillRect(0, 0, w, h); c.restore(); }
  const R = k < .9 ? 0 : k < 1.85 ? (k - .9)/.95*180 : 180 + ease((k - 1.85)/.35)*Math.hypot(w, h)*1.2, ca = k < 4 ? 1 : lerp(1, 0, cl((k - 4)/2));
  if (R > 0 && ca > 0){ const cr = A.crackCanvas(Math.ceil(w), Math.ceil(h)); c.save(); c.globalAlpha = ca; c.beginPath(); c.arc(bx, by, R, 0, 7); c.clip(); c.drawImage(cr, bx - cr.width/2, by - cr.height/2); c.restore(); }
  const gs = env(k, 1.2, 2.0, 3.8, 5.8); if (gs > 0){ c.save(); c.globalCompositeOperation = 'saturation'; c.globalAlpha = gs; c.fillStyle = 'rgb(128,128,128)'; c.fillRect(0, 0, w, h); c.restore(); }
  if (!DRIPS){ const r = B.rng('olly-drips'); DRIPS = Array.from({length:30}, () => ({x:r(), w:7 + r()*20, t0:1.5 + r()*1.1, L:.3 + r()*.7, v:.35 + r()*.5, c:['#7a0c1c', '#2a1830', '#b0782a', '#4a1a40', '#9a1a2a', '#1a1018'][Math.floor(r()*6)], seed:r()*6})); }
  for (const d of DRIPS){ const u = k - d.t0; if (u < 0) continue; const Lh = d.L*h*(1 - Math.exp(-u*d.v/d.L*1.6)), al = lerp(1, d.seed < 2 ? .15 : 0, cl((u - 2.2)/1.4))*cl((6.2 - k)/.7), ww = d.w*lerp(1, .4, cl((u - 2.2)/1.4)), x = d.x*w; if (al < .01) continue;
    c.save(); c.globalAlpha = al; c.fillStyle = d.c; c.beginPath(); c.moveTo(x - ww/2, 0); for (let y = 0; y <= Lh; y += 24) c.lineTo(x - ww/2 + Math.sin(y*.03 + d.seed)*ww*.12, y); c.lineTo(x + ww/2, Lh); for (let y = Lh; y >= 0; y -= 24) c.lineTo(x + ww/2 + Math.sin(y*.03 + d.seed + 1)*ww*.12, y); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(x, Lh + ww*.2, ww*.66, ww*.8, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(x - ww*.3, 0, ww*.12, Lh*.9); c.restore(); }
  if (k > 1.7 && k < 2.5){ c.save(); c.globalAlpha = .75*(1 - (k - 1.7)/.8); c.fillStyle = '#efe0ff'; c.fillRect(0, 0, w, h); c.restore(); }
  A.screenFrame(c, w, h, 18, env(k, .6, 1.3, 3.6, 4.6), env(k, 2.4, 2.8, 3.8, 4.6));
}
