// 토토??? (탁도현 · 약속나무회 교주) 다크 보스 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md "보스 패턴 규칙"
// 기본 공격: 고래 꼬리 (발밑 V 자) · ① 약속의 원 ② 생활 규칙 ③ 의자 나눠 앉기 → 50% 변신 → ④ 고해 장부 ⑤ 세뇌 ⑥ 설교 끊기 → 20% ⑦ 고래 등
import { pick, beat, cl, lerp, ease, dist, inEll, shadow } from './kit.js';
import { bossArt, cultist, CULT, chair, CHAIR, ticket, sea, SC, BX0, BY0, BW, BH } from './toto_art.js';

const P = {
  1: [{id:'fence', len:13}, {id:'rule', len:12.5}, {id:'chair', len:11.5}],
  2: [{id:'pages', len:12.5}, {id:'brain', len:12}, {id:'sermon', len:13}],
  3: [{id:'back', len:3600}],
};
const GAP = 2.5, TRANS = 5;
const LV = {fence:1, rule:.5, chair:.3, pages:.6, brain:.5, sermon:.25};
const AX0 = 110, AX1 = 990, AY0 = 280, AY1 = 795;   // 걸을 수 있는 곳 (문 쪽으로 밀려 나가지 않게)
const clampX = x => cl(x, AX0, AX1), clampY = y => cl(y, AY0, AY1);
const FONT = s => `bold ${s}px "Dongle",sans-serif`;
const T2 = Math.PI*2;

// ===== 내 화면에서만 쓰는 값 =====
let lastB = null, phaseNow = 1, outT = 0, boundUntil = 0, bwH = null, bwBp = false, hostAt = 0, lastNow = 0;
const onceK = new Map(), localRip = new Set(), localCut = new Map(), hist = new Map();
function once(k, now){ if (onceK.has(k)) return false; onceK.set(k, now); if (onceK.size > 300) for (const [kk, v] of onceK) if (now - v > 90000) onceK.delete(kk); return true; }

// ===== 시간표 (아무 시각이나 · 모두 같은 값) =====
function stAt(B, now){
  const r = B.r, phase = r.lowAt && now >= r.lowAt ? 3 : r.rageAt && now >= r.rageAt ? 2 : 1, ps = phase === 3 ? r.lowAt : phase === 2 ? r.rageAt : r.bossAt;
  const ph2 = r.rageAt ? (now - r.rageAt)/1000 : -1, ph3 = r.lowAt ? (now - r.lowAt)/1000 : -1;
  return {phase, t:(now - r.bossAt)/1000, ph2, ph3, p:pick({phase, pt:(now - ps)/1000, ph2, r}, P, {gap:GAP, trans:TRANS})};
}
let stC = null, stCNow = -1, stCB = null;
function st(B){ if (stCNow !== B.now || stCB !== B.r){ stC = stAt(B, B.now); stCNow = B.now; stCB = B.r; } return stC; }

// ===== 보스 자리: 평소엔 방 가운데를 천천히 돌아다녀요 =====
function amp(p){ if (!p.id || !(p.id in LV)) return 1; const ramp = Math.min(cl(p.t/.6), cl((p.len - p.t)/.6)); return 1 - ramp*(1 - LV[p.id]); }
const wander = (B, t, a) => [B.hx + (Math.cos(t*.42)*150 + Math.sin(t*1.07)*30)*a, B.hy + 10 + (Math.sin(t*.61)*50 + Math.sin(t*1.3)*10)*a];
// ⑦ 고래 등 가운데 (바다 위를 떠다녀요)
const whaleC = (B, t3) => [B.hx + Math.sin(t3*.31)*150, B.hy + 40 + Math.sin(t3*.43)*50];
function diveK(t3){ if (t3 < 3) return 0; const u = (t3 - 3)%10; return Math.min(cl((u - 6.5)/.4), cl((8.5 - u)/.4)); }
const diveWarn = t3 => t3 >= 3 && (t3 - 3)%10 >= 5 && (t3 - 3)%10 < 6.5;
const backR = t3 => { const k = 1 - diveK(t3)*.42; return [300*k, 125*k]; };
function bodyAt(B, now, depth = 0){
  const s = stAt(B, now), r = B.r;
  if (s.phase === 3){ const C = whaleC(B, s.ph3), on = [C[0] + 110, C[1] - 4]; if (s.ph3 < 1.2 && depth < 2){ const f = bodyAt(B, r.lowAt - 1, depth + 1), k = ease(s.ph3/1.2); return [lerp(f[0], on[0], k), lerp(f[1], on[1], k)]; } return on; }
  if (s.p.id === 'trans'){ const f = depth < 2 ? bodyAt(B, r.rageAt - 1, depth + 1) : [B.hx, B.hy + 10], k = ease(s.ph2/1.5); return [lerp(f[0], B.hx, k), lerp(f[1], B.hy + 10, k)]; }
  const bs = B.bs;
  if (depth < 1 && bs.stunAt && now >= bs.stunAt){ const held = bodyAt(B, bs.stunAt, 1); if (now < bs.stun) return held; if (now < bs.stun + 1000){ const w = bodyAt(B, now, 1), k = ease((now - bs.stun)/1000); return [lerp(held[0], w[0], k), lerp(held[1], w[1], k)]; } }
  let w = wander(B, s.t, amp(s.p));
  if (s.phase === 2 && s.ph2 < TRANS + 1.5){ const k = ease((s.ph2 - TRANS)/1.5); w = [lerp(B.hx, w[0], k), lerp(B.hy + 10, w[1], k)]; }
  return w;
}
let bdC = null, bdNow = -1;
const body = B => { if (bdNow !== B.now){ bdC = bodyAt(B, B.now); bdNow = B.now; } return bdC; };
const nowAt = (B, p, pt) => B.now - (p.t - pt)*1000;   // 패턴 안 시각 pt 의 서버 시각

// ===== 기본 공격: 고래 꼬리 (보스 발밑에서 V 자로 내려쳐요) =====
const FL = {warn:.9, slam:1.15, end:1.6};
function flukes(B){
  const s = st(B); if (s.p.id === 'trans' || B.bs.stun > B.now || (s.phase === 3 && s.ph3 < 2.5)) return [];
  const bt = beat(B, 3.6); if (bt.t > FL.end || bt.n < 1) return [];
  const t0 = B.now - bt.t*1000, s0 = stAt(B, t0); if (s0.p.id === 'trans' || s0.phase !== s.phase) return [];
  const [fx, fy] = bodyAt(B, t0), rnd = B.rng(`${B.r.bossAt}.fl.${bt.n}`), a = rnd()*T2, out = [];
  const n = s.phase === 1 ? 1 : 2;
  for (let i = 0; i < n; i++){ const ai = a + i*Math.PI + (i ? (rnd() - .5)*.8 : 0); out.push({x:fx - Math.cos(ai)*30, y:fy - Math.sin(ai)*18, a:ai, k:bt.t, key:`${B.r.bossAt}.${bt.n}.${i}`}); }
  return out;
}
function inFluke(f, x, y){ const dx = x - f.x, dy = (y - f.y)/.62, ca = Math.cos(-f.a), sa = Math.sin(-f.a), lx = dx*ca - dy*sa, ly = dx*sa + dy*ca; return lx > -24 && lx < 230 && (Math.abs(ly - lx*.56) < 38 || Math.abs(ly + lx*.56) < 38); }
function flukePath(c, f, s){ c.save(); c.translate(f.x, f.y); c.scale(1, .62); c.rotate(f.a); c.beginPath(); c.moveTo(-20, 0); c.quadraticCurveTo(100, -20, 220*s, -124*s); c.quadraticCurveTo(160*s, -40*s, 80*s, -12); c.quadraticCurveTo(160*s, 40*s, 220*s, 124*s); c.quadraticCurveTo(100, 20, -20, 0); c.closePath(); c.restore(); }

// ===== ① 약속의 원 =====
function fence(B, p){ const [bx, by] = body(B), k = ease(p.t/2), rx = lerp(470, 270, k) - 50*cl((p.t - 2)/(p.len - 2)); return {x:bx, y:by + 24, rx, ry:rx*.56, on:p.t > 2 && p.t < p.len - .3, a:cl(p.t/.5)*cl((p.len - p.t)/.5)}; }
// ===== ② 생활 규칙 =====
function rules(B, p){
  const out = [], rnd0 = B.rng(p.seed + '.r'), flip = rnd0() < .5 ? 0 : 1, n = Math.max(1, B.alive.length);
  for (let i = 0; i < 3; i++){ const t0 = .5 + i*4, chk = t0 + 3.2, gather = (i + flip)%2 === 1, rnd = B.rng(`${p.seed}.r${i}`);
    const [fx, fy] = bodyAt(B, nowAt(B, p, t0)), a = rnd()*T2, rx = 80 + 16*n;
    out.push({i, t0, chk, gather, x:cl(fx + Math.cos(a)*130, 150 + rx*.5, 950 - rx*.5), y:cl(fy + Math.sin(a)*80, 330, 760), rx, ry:rx*.6, bx:fx, by:fy}); }
  return out;
}
const APART_BOSS = 230, APART_P = 170;
// ===== ③ 의자 =====
function chairs(B, p){
  const out = [], n = cl(B.alive.length, 1, 8);
  for (let i = 0; i < 3; i++){ const t0 = .3 + i*3.7, rnd = B.rng(`${p.seed}.c${i}`), [fx, fy] = bodyAt(B, nowAt(B, p, t0)), a0 = rnd()*T2, ps = [];
    for (let j = 0; j < n; j++){ const a = a0 + j*T2/n + (rnd() - .5)*.5, d = 170 + rnd()*120; ps.push([cl(fx + Math.cos(a)*d, 140, 960), cl(fy + Math.sin(a)*d*.62, 320, 780)]); }
    out.push({i, t0, blast:t0 + 2.4, end:t0 + 3.1, ps}); }
  return out;
}
// ===== ④ 고해 장부 =====
function pages(B, p){
  const out = [];
  for (let i = 0; i < 2; i++){ const t0 = .2 + i*6.1, land = t0 + 1.4, dead = land + 3.6, key = `${p.seed}.p${i}`, [fx, fy] = bodyAt(B, nowAt(B, p, t0));
    const own = B.alive.map((o, j) => { const rnd = B.rng(`${key}.${o.uid}`), a = rnd()*T2, d = 190 + rnd()*140; return {uid:o.uid, nick:o.nick || '???', j, x:cl(fx + Math.cos(a)*d, 140, 960), y:cl(fy + Math.sin(a)*d*.62, 320, 780)}; });
    out.push({i, t0, land, dead, gone:dead + 1.6, key, fx, fy, own}); }
  return out;
}
const torn = (B, pg, uid) => localRip.has(pg.key + '|' + uid) || !!(B.bs.rip && B.bs.rip.k === pg.key && B.bs.rip[uid]);
function curPages(B){ const s = st(B); if (s.p.id !== 'pages') return null; return pages(B, s.p).find(pg => s.p.t >= pg.t0 && s.p.t < pg.gone) || null; }
function tear(B, pg){
  const uid = B.me.uid, k = pg.key + '|' + uid; if (localRip.has(k)) return; localRip.add(k);
  B.sfx('hit'); B.fx('찌익', B.me.x, B.me.y - 70, '#f4ecd8');
  B.tx(bs => { const o = bs.rip && bs.rip.k === pg.key ? {...bs.rip} : {k:pg.key}; if (o[uid]) return undefined; o[uid] = 1; return {...bs, rip:o}; });
}
// ===== ⑤ 세뇌 =====
function brain(B, p){ const T = B.target, solo = B.alive.length < 2, s0 = 1.4, s1 = s0 + (solo ? 4 : 8), key = p.seed, woke = B.bs.wake && B.bs.wake.k === key;
  return {T, solo, s0, s1, key, woke, on:!!T && !T.down && p.t >= s0 && p.t < s1 && !woke}; }
function headOf(B, o){ if (o.bp && typeof o.bp.h === 'number') return o.bp.h; const h = hist.get(o.uid); if (!h || h.length < 2) return null; const a = h[h.length - 1]; let b = null; for (let i = h.length - 1; i >= 0; i--) if (a[0] - h[i][0] > 250){ b = h[i]; break; } if (!b) b = h[0]; return Math.hypot(a[1] - b[1], a[2] - b[2]) > 6 ? Math.atan2(a[2] - b[2], a[1] - b[1]) : null; }
// ===== ⑥ 설교 끊기 =====
function casts(B, p){ const out = []; for (let i = 0; i < 3; i++){ const t0 = .6 + i*4.1, w0 = t0 + 1.3 + B.rng(`${p.seed}.w${i}`)()*1.2; out.push({i, t0, end:t0 + 3.4, w0, w1:w0 + .7}); } return out; }
const cutMask = (B, p) => (B.bs.cut && B.bs.cut.s === p.seed ? B.bs.cut.m : 0) | (localCut.get(p.seed) || 0);
const bits = m => (m & 1) + (m >> 1 & 1) + (m >> 2 & 1);

// ===== 그리기 도우미 =====
function txt(c, s, x, y, size, col, a = 1, stroke = 'rgba(14,6,10,.85)'){ if (a <= 0) return; c.save(); c.globalAlpha = cl(a); c.font = FONT(size); c.textAlign = 'center'; c.textBaseline = 'middle'; if (stroke){ c.lineWidth = 4; c.strokeStyle = stroke; c.strokeText(s, x, y); } c.fillStyle = col; c.fillText(s, x, y); c.restore(); }
function ring(c, x, y, rx, ry, col, w, a = 1, dash){ c.save(); c.globalAlpha = cl(a); c.strokeStyle = col; c.lineWidth = w; if (dash) c.setLineDash(dash); c.beginPath(); c.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, T2); c.stroke(); c.restore(); }
function fillEll(c, x, y, rx, ry, col, a = 1){ c.save(); c.globalAlpha = cl(a); c.fillStyle = col; c.beginPath(); c.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, T2); c.fill(); c.restore(); }
const halfArt = B => { const s = st(B); return s.phase === 3 || (s.phase === 2 && s.ph2 >= 1.9); };

// ===== 50% 변신 연출 재료 =====
const CONF = ['아버지, 고백합니다', '집을 바쳤습니다', '딸에게 연락했습니다', '떠나고 싶었습니다', '약속을 어겼습니다', '편지를 숨겼습니다', '반지를 바쳤습니다', '참회실이 무섭습니다', '어머니가 보고 싶습니다', '312'];
const SCRIPT = []; { let s = 11; const r = () => (s = (s*16807) % 2147483647)/2147483647; for (let i = 0; i < 110; i++) SCRIPT.push({x:r(), y:r(), s:15 + r()*13, a:(r() - .5)*.3, w:CONF[Math.floor(r()*CONF.length)], red:i % 7 === 0}); }
const PINS = [[.08, .1], [.92, .1], [.2, .05], [.8, .05], [.04, .3], [.96, .3], [.1, .5], [.9, .48], [.5, .02], [.3, .2], [.7, .2]];

export default {
  reach: 125,
  get height(){ return phaseNow === 3 ? 198 : 236; },

  pos(B){ return body(B); },

  tick(B, dt){
    const s = st(B), p = s.p, me = B.me, now = B.now; phaseNow = s.phase; lastB = B;
    if (now < lastNow - 5000){ onceK.clear(); localRip.clear(); localCut.clear(); } lastNow = now;   // 되감기 (시험) · 다시 시작
    // 위치 기록 (세뇌 · 등 뒤 판정)
    for (const o of B.all){ let h = hist.get(o.uid); if (!h) hist.set(o.uid, h = []); const l = h[h.length - 1]; if (!l || now - l[0] > 40) h.push([now, o.x, o.y]); while (h.length && now - h[0][0] > 700) h.shift(); }
    // 보스 대사 (모두 같은 때)
    const LINES = {fence:'약속의 원 안에 있게나', rule:'생활 규칙은 지켜야지', chair:'자, 앉게. 설교 시간이야', pages:'네 고해는 내가 다 적어 두었지', brain:`${B.targetNick}, 아버지에게 오너라`, sermon:'세상은 곧 가라앉는다…', back:'가라앉는다! 내 등에 타라!'};
    if (p.id && LINES[p.id] && p.t < .8 && once('say.' + p.seed, now)){ B.say(LINES[p.id], 2600); B.sfx('warn'); }
    if (p.id === 'trans' && p.t > 2.6 && p.t < 3.4 && once('say.tr.' + B.r.rageAt, now)) B.say(`${B.targetNick}, 다음 '큰 고래'는 자네야`, 2600);
    if (B.bs.stun > now && B.bs.stunAt && now - B.bs.stunAt < 1500 && once('say.st.' + B.bs.stunAt, now)){ B.say('배표는… 한 장뿐이었는데', 2600); B.sfx('slam'); B.shake(); }
    if (!me || me.down){ if (bwBp){ B.setBp(null); bwBp = false; } outT = 0; return; }
    const mx = me.x, my = me.y;
    if (now < boundUntil){ B.ctl.lock = true; B.ctl.noAtk = true; }

    // 기본 공격: 고래 꼬리
    for (const f of flukes(B)){
      if (f.k < .3 && once('fw.' + f.key, now)) B.sfx('warn', 300);
      if (f.k >= FL.warn && f.k < FL.slam){ if (once('fs.' + f.key, now)){ B.sfx('slam', 200); }
        if (inFluke(f, mx, my) && B.hurt(B.lo + 20, 'fl.' + f.key)){ B.shake(); const n = f.a + Math.PI/2, side = Math.sign(Math.sin(Math.atan2((my - f.y)/.62, mx - f.x) - f.a)) || 1; B.push(Math.cos(n)*side, Math.sin(n)*side, 60); } }
    }

    // ① 약속의 원: 밖에 오래 있으면 채찍
    if (p.id === 'fence'){ const F = fence(B, p);
      if (F.on && !inEll(mx, my, F.x, F.y, F.rx, F.ry)){ outT += dt; if (outT > .45 && B.hurt(B.lo + 50, `fn.${p.seed}.${Math.floor(p.t/1.5)}`)){ B.sfx('slam'); B.push(F.x - mx, F.y - my, 70); } } else outT = 0;
    } else outT = 0;

    // ② 생활 규칙: 판이 바뀌는 때에 맞춰 봐요
    if (p.id === 'rule') for (const R of rules(B, p)){
      if (p.t >= R.t0 && p.t < R.t0 + .4 && once(`rw.${p.seed}.${R.i}`, now)) B.sfx('warn');
      if (p.t >= R.chk && p.t < R.chk + .5 && once(`rc.${p.seed}.${R.i}`, now)){
        let bad;
        if (R.gather) bad = !inEll(mx, my, R.x, R.y, R.rx, R.ry);
        else { const [bx, by] = body(B); bad = inEll(mx, my, bx, by, APART_BOSS, APART_BOSS*.6) || B.alive.some(o => !o.me && dist(o.x, o.y, mx, my) < APART_P); }
        if (bad && B.hurt(B.lo + 80, `rl.${p.seed}.${R.i}`)){ B.sfx('slam'); B.shake(); }
      }
    }

    // ③ 의자 나눠 앉기: 파동 때 의자에 없거나, 먼저 앉은 사람이 있으면 맞아요
    if (p.id === 'chair') for (const C of chairs(B, p)){
      if (p.t >= C.t0 && p.t < C.t0 + .4 && once(`cw.${p.seed}.${C.i}`, now)) B.sfx('warn');
      if (p.t >= C.blast && p.t < C.blast + .4 && once(`cb.${p.seed}.${C.i}`, now)){
        B.sfx('slam'); const seat = C.ps.findIndex(([x, y]) => dist(x, y, mx, my) < 40);
        const taken = seat >= 0 && B.alive.some(o => !o.me && o.uid < me.uid && dist(o.x, o.y, C.ps[seat][0], C.ps[seat][1]) < 40);
        if ((seat < 0 || taken) && B.hurt(B.lo + 70, `ch.${p.seed}.${C.i}`)) B.shake();
      }
    }

    // ④ 고해 장부: 내 이름 쪽을 못 찢으면 묶여요
    if (p.id === 'pages') for (const pg of pages(B, p)){
      if (p.t >= pg.t0 && p.t < pg.t0 + .4 && once('pw.' + pg.key, now)) B.sfx('warn');
      if (p.t >= pg.dead && p.t < pg.dead + .5 && pg.own.some(o => o.uid === me.uid) && !torn(B, pg, me.uid) && once('pd.' + pg.key, now)){
        if (B.hurt(B.lo + 60, 'pg.' + pg.key)){ boundUntil = now + 1800; B.sfx('slam'); B.shake(); } }
    }

    // ⑤ 세뇌: 노리는 몸이 친구를 쫓아요 · 등 뒤에서 닿으면 깨어나요
    let bwOn = false;
    if (p.id === 'brain'){ const W = brain(B, p);
      if (p.t < W.s0 && p.t > .2 && once('bw.' + W.key, now)) B.sfx('warn');
      if (W.on && W.T.uid === me.uid){ bwOn = true; B.ctl.lock = true; B.ctl.noAtk = true;
        const fr = B.alive.filter(o => !o.me); let tx, ty;
        if (fr.length){ let best = null, bd = 1e9; for (const o of fr){ const d = dist(o.x, o.y, mx, my); if (d < bd){ bd = d; best = o; } } tx = best.x; ty = best.y; } else { [tx, ty] = body(B); ty += 40; }
        const want = Math.atan2(ty - my, tx - mx); if (bwH === null) bwH = want;
        let da = ((want - bwH + Math.PI*3)%T2) - Math.PI; bwH += cl(da, -1.7*dt, 1.7*dt);
        const sp = fr.length ? 118 : 70, far = dist(tx, ty, mx, my) > 30;
        if (far) B.tp(clampX(mx + Math.cos(bwH)*sp*dt), clampY(my + Math.sin(bwH)*sp*dt));
        B.setBp({h:Math.round(bwH*100)/100}); bwBp = true;
      }
      if (W.on && W.T.uid !== me.uid){ const T = W.T, d = dist(T.x, T.y, mx, my), h = headOf(B, T);
        const rear = h !== null && d > 1 && ((mx - T.x)*Math.cos(h) + (my - T.y)*Math.sin(h))/d < -.34;
        if (d < 46 && !rear && B.hurt(B.lo + 40, `bt.${W.key}.${Math.floor(p.t/1.2)}`)) B.push(mx - T.x, my - T.y, 70); }
      // 호스트: 등 뒤로 닿은 친구가 있으면 깨워요
      if (B.host && W.on && now - hostAt > 300){ const T = W.T, h = headOf(B, T);
        if (h !== null){ const by = B.alive.find(o => o.uid !== T.uid && dist(o.x, o.y, T.x, T.y) < 66 && ((o.x - T.x)*Math.cos(h) + (o.y - T.y)*Math.sin(h))/Math.max(1, dist(o.x, o.y, T.x, T.y)) < -.34);
          if (by){ hostAt = now; B.tx(bs => bs.wake && bs.wake.k === W.key ? undefined : {...bs, wake:{k:W.key, by:by.uid, at:now}}); } } }
      if (W.woke && once('wk.' + W.key, now)){ B.sfx('hit'); const T = W.T; if (T) B.fx('툭!', T.x, T.y - 80, '#c8ffd0'); }
      if (!W.woke && W.T && W.T.uid === me.uid && !W.solo && p.t >= W.s1 && p.t < W.s1 + .5 && once('bx.' + W.key, now)){ if (B.hurt(B.lo + 100, 'bx.' + W.key)) B.shake(); }
    }
    if (!bwOn){ bwH = null; if (bwBp){ B.setBp(null); bwBp = false; } }

    // ⑥ 설교 끊기: 다 외우면 둘레가 울려요
    if (p.id === 'sermon' && !(B.bs.stun > now)){ const m = cutMask(B, p), [bx, by] = body(B);
      for (const S of casts(B, p)){ if (bits(m) >= 2) break;
        if (p.t >= S.t0 && p.t < S.t0 + .4 && once(`sw.${p.seed}.${S.i}`, now)) B.sfx('warn');
        if (!(m & 1 << S.i) && p.t >= S.end && p.t < S.end + .45 && inEll(mx, my, bx, by, 400, 250) && B.hurt(B.lo + 120, `se.${p.seed}.${S.i}`)){ B.sfx('slam'); B.shake(); B.push(mx - bx, my - by, 80); } } }

    // ⑦ 고래 등: 등 위에서 같이 떠다녀요 · 바다에 빠지면 아프고 등으로 올려져요
    if (s.phase === 3 && s.ph3 > 1.2){ const t3 = s.ph3, C = whaleC(B, t3), C2 = whaleC(B, t3 + .1), [rx, ry] = backR(t3);
      if (diveWarn(t3) && once('dv.' + Math.floor((t3 - 3)/10), now)) B.sfx('warn');
      let vx = (C2[0] - C[0])/.1 + Math.cos(now/700)*14, vy = (C2[1] - C[1])/.1 + Math.sin(now/530)*10;
      if (!inEll(mx, my, C[0], C[1], rx, ry)){
        if (t3 < 3.2){ const d = Math.max(1, dist(mx, my, C[0], C[1])); vx += (C[0] - mx)/d*230; vy += (C[1] - my)/d*230; }
        else { if (B.hurt(B.lo + 100, 'sea.' + Math.floor(now/1600))){ B.fx('풍덩', mx, my - 60, '#cfeaff'); B.sfx('slam'); }
          const a = Math.atan2((my - C[1])/ry, (mx - C[0])/rx); B.tp(C[0] + Math.cos(a)*rx*.62, C[1] + Math.sin(a)*ry*.62); } }
      B.ctl.drift = [vx, vy];
    }
  },

  hitMul(B, x, y){ const s = st(B); if (s.phase === 3) return diveK(s.ph3) > .3 ? 0 : 1.5; return B.bs.stun > B.now ? 2 : 1; },

  swing(B, cx, cy){
    const s = st(B), p = s.p; if (!B.me) return false;
    const pg = curPages(B);
    if (pg && p.t >= pg.land && p.t < pg.dead){
      for (const o of pg.own){ if (dist(o.x, o.y - 20, cx, cy) > 62 || torn(B, pg, o.uid)) continue;
        if (o.uid === B.me.uid){ tear(B, pg); return true; }
        B.fx('팅', o.x, o.y - 70, '#9ab0c0'); return true; } }
    if (p.id === 'sermon' && !(B.bs.stun > B.now)){ const [bx, by] = body(B);
      if (dist(bx, by, cx, cy) <= 125){ const m = cutMask(B, p);
        for (const S of casts(B, p)){ const bit = 1 << S.i; if (p.t < S.w0 || p.t > S.w1 || (m & bit) || bits(m) >= 2) continue;
          localCut.set(p.seed, m | bit); B.sfx('hit'); B.fx('뚝!', bx, by - 230, '#f0d0ff'); const seed = p.seed, now = B.now;
          B.tx(bs => { const c = bs.cut && bs.cut.s === seed ? {...bs.cut} : {s:seed, m:0}; if (c.m & bit) return undefined; c.m |= bit; const o = {...bs, cut:c}; if (bits(c.m) >= 2 && !(bs.stun > now)){ o.stun = now + 8000; o.stunAt = now; } return o; });
          break; } } }
    return false;
  },

  tap(B, wx, wy){ const s = st(B), pg = curPages(B); if (!pg || !B.me || s.p.t < pg.land || s.p.t >= pg.dead) return null;
    const o = pg.own.find(o => o.uid === B.me.uid); if (!o || torn(B, pg, o.uid) || dist(o.x, o.y - 20, wx, wy) > 60) return null;
    return {x:o.x, y:o.y + 16, act:() => { const B2 = lastB || B; if (B2.me && !B2.me.down && dist(B2.me.x, B2.me.y, o.x, o.y) < 70) tear(B2, pg); }}; },

  drawFloor(B, c){
    const s = st(B), p = s.p, now = B.now;
    // ⑦ 바다 · 고래 등
    if (s.phase === 3){ const t3 = s.ph3, a = cl(t3/1.2), C = whaleC(B, t3), [rx, ry] = backR(t3), dk = diveK(t3);
      c.save(); c.globalAlpha = a*.95; c.drawImage(sea(B.W, B.H), 0, 0, B.W, B.H);
      c.globalAlpha = a*.4; c.strokeStyle = '#4a8ab0'; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 10; i++){ const y = 280 + i*58; for (let x = 0; x <= B.W; x += 44){ const yy = y + Math.sin(x*.02 + now/500 + i)*6; x ? c.lineTo(x, yy) : c.moveTo(x, yy); } } c.stroke(); c.restore();
      c.save(); c.globalAlpha = a;
      fillEll(c, C[0], C[1] + 10, rx + 34, ry + 18, 'rgba(180,230,255,.18)', a);
      c.fillStyle = '#23406a'; c.beginPath(); c.moveTo(C[0] - rx + 14, C[1]); c.quadraticCurveTo(C[0] - rx - 60, C[1] - 50, C[0] - rx - 90, C[1] - 74); c.quadraticCurveTo(C[0] - rx - 50, C[1], C[0] - rx - 90, C[1] + 60); c.quadraticCurveTo(C[0] - rx - 60, C[1] + 40, C[0] - rx + 14, C[1]); c.fill();
      const gr = c.createLinearGradient(0, C[1] - ry, 0, C[1] + ry); gr.addColorStop(0, '#46689a'); gr.addColorStop(1, '#1a2a4a'); c.fillStyle = gr; c.beginPath(); c.ellipse(C[0], C[1], rx, ry, 0, 0, T2); c.fill();
      c.strokeStyle = 'rgba(200,230,255,.55)'; c.lineWidth = 3; c.stroke();
      c.strokeStyle = 'rgba(20,30,50,.35)'; c.lineWidth = 2; for (let k = -2; k <= 2; k++){ c.beginPath(); c.ellipse(C[0] - 30, C[1] + k*ry*.28, rx*.7, 8, 0, .3, 2.8); c.stroke(); }
      for (const [ox, oy, r] of [[-180, -30, 9], [-120, 40, 7], [40, -60, 8], [180, 50, 6], [-60, 70, 6]]) fillEll(c, C[0] + ox*rx/300, C[1] + oy*ry/125, r, r*.7, '#8a8a7a', .8);
      const [hx, hy] = body(B), open = dk < .3; fillEll(c, hx + 58, hy + 12, 18, 8, '#0a1424');
      if (open){ const gl = c.createRadialGradient(hx + 58, hy + 12, 2, hx + 58, hy + 12, 44); gl.addColorStop(0, 'rgba(255,230,140,.7)'); gl.addColorStop(1, 'rgba(255,230,140,0)'); c.fillStyle = gl; c.fillRect(hx + 14, hy - 32, 88, 88); }
      if (dk > 0) fillEll(c, C[0], C[1], rx + 20, ry + 10, '#0c3050', dk*.55);
      if (diveWarn(t3)){ for (let i = 0; i < 16; i++){ const an = i/16*T2 + now/900, r0 = 1 + ((now/400 + i*.37)%1)*.12; fillEll(c, C[0] + Math.cos(an)*rx*r0, C[1] + Math.sin(an)*ry*r0, 6, 4, 'rgba(200,240,255,.7)'); } ring(c, C[0], C[1], rx*.58, ry*.58, 'rgba(200,240,255,.7)', 2, .5 + .4*Math.sin(now/90), [8, 8]); }
      c.restore(); }
    // 변신 뒤: 방 구석의 촛불
    if (s.phase >= 2 && s.ph2 > 4){ for (const [x, y] of [[120, 300], [980, 300], [120, 790], [980, 790]]){ c.save(); c.fillStyle = 'rgba(232,224,200,.8)'; c.fillRect(x - 3, y - 22, 6, 22); c.restore(); fillEll(c, x, y - 26, 3.5, 7, `rgba(255,${190 + Math.sin(now/70 + x)*40|0},90,.95)`); const gl = c.createRadialGradient(x, y - 26, 2, x, y - 26, 60); gl.addColorStop(0, 'rgba(255,190,90,.22)'); gl.addColorStop(1, 'rgba(255,190,90,0)'); c.fillStyle = gl; c.fillRect(x - 60, y - 86, 120, 120); } }
    // 이동 연출: 촛불 든 두건 신도 그림자들이 줄지어 행진해요
    { const [x0, y0] = body(B), [x1, y1] = bodyAt(B, now - 150), sp = cl(dist(x0, y0, x1, y1)/.15/50);
      if (sp > .05){ const im = cultist(false, false);
        for (let i = 1; i <= 8; i++){ const [x, y] = bodyAt(B, now - i*700), al = sp*(.75 - i*.06); if (al < .04) continue; const side = i%2 ? -1 : 1, bob = Math.sin(now/250 + i)*2, sc = 1.2;
          c.save(); c.globalAlpha = al; c.drawImage(im, x + side*(50 + (i%3)*10) - CULT.ox*sc, y + 18 + bob - CULT.oy*sc, CULT.w*sc, CULT.h*sc); c.restore();
          fillEll(c, x + side*(50 + (i%3)*10) + 10.5*sc, y + 18 + bob - 33*sc, 2.2, 3.5, `rgba(255,${200 + Math.sin(now/50 + i)*40|0},90,${al})`); }
        if (sp > .3 && Math.floor(now/1600)%3 === 0){ const [x, y] = bodyAt(B, now - 2800); txt(c, '아버지…', x, y - 70, 17, '#c8b8a0', sp*.8); } } }
    // ① 약속의 원
    if (p.id === 'fence'){ const F = fence(B, p); fillEll(c, F.x, F.y, F.rx, F.ry, '#ffe0a0', F.a*.12);
      ring(c, F.x, F.y, F.rx, F.ry, '#a07a4a', 7, F.a); ring(c, F.x, F.y, F.rx, F.ry, '#5a3a1a', 2, F.a, [8, 6]);
      c.save(); c.globalAlpha = F.a; for (let i = 0; i < 16; i++){ const an = i/16*T2 + .1, x = F.x + Math.cos(an)*F.rx, y = F.y + Math.sin(an)*F.ry; c.save(); c.translate(x, y); c.fillStyle = '#5a3a1a'; c.fillRect(-2, -26, 4, 26); c.rotate(Math.sin(now/300 + i)*.2); c.fillStyle = '#f0e8d0'; c.fillRect(-6, -22, 12, 18); c.fillStyle = '#b02020'; c.fillRect(-4, -18, 8, 2); c.fillRect(-4, -13, 8, 2); c.restore(); } c.restore(); }
    // ② 생활 규칙: 모이는 자리 · 흩어질 때 보스 둘레와 사람마다 작은 원
    if (p.id === 'rule'){ for (const R of rules(B, p)){ if (p.t < R.t0 - .1 || p.t > R.chk + .8) continue; const a = cl((p.t - R.t0 + .1)*4)*cl((R.chk + .8 - p.t)*3), k = cl((p.t - R.t0)/(R.chk - R.t0));
        if (R.gather){ fillEll(c, R.x, R.y, R.rx, R.ry, '#7ab0ff', a*(.12 + .2*k)); ring(c, R.x, R.y, R.rx, R.ry, '#9ac8ff', 4, a); for (let i = 0; i < 8; i++){ const an = i/8*T2 + now/2000; fillEll(c, R.x + Math.cos(an)*R.rx*.86, R.y + Math.sin(an)*R.ry*.86, 3, 5, '#ffd890', a); } }
        else { const [bx, by] = body(B); fillEll(c, bx, by, APART_BOSS, APART_BOSS*.6, '#ff3050', a*(.1 + .18*k)); ring(c, bx, by, APART_BOSS, APART_BOSS*.6, '#ff6070', 3, a, [10, 8]);
          for (const o of B.alive) ring(c, o.x, o.y, APART_P/2, APART_P/2*.6, '#ffb0a0', 2, a*.8, [5, 5]); }
        if (p.t > R.chk && p.t < R.chk + .8 && !R.gather){ c.save(); c.globalAlpha = 1 - (p.t - R.chk)/.8; c.strokeStyle = '#ff4a4a'; c.lineWidth = 3; c.setLineDash([5, 5]); c.beginPath(); for (let i = 0; i < B.alive.length; i++) for (let j = i + 1; j < B.alive.length; j++){ const u = B.alive[i], v = B.alive[j]; if (dist(u.x, u.y, v.x, v.y) < APART_P){ c.moveTo(u.x, u.y - 24); c.lineTo(v.x, v.y - 24); } } c.stroke(); c.restore(); } } }
    // ③ 의자
    if (p.id === 'chair'){ const im = chair(); for (const C of chairs(B, p)){ if (p.t < C.t0 || p.t > C.end) continue; const a = cl((p.t - C.t0)*4)*cl((C.end - p.t)*3), drop = (1 - ease((p.t - C.t0)/.35))*80;
        for (const [x, y] of C.ps){ shadow(c, x, y + 2, 30, 9, .35*a); if (p.t < C.blast) ring(c, x, y, 40, 24, '#e8d0ff', 2, a*.7, [4, 4]); c.save(); c.globalAlpha = a; c.drawImage(im, x - CHAIR.ox, y - CHAIR.oy - drop, CHAIR.w, CHAIR.h); c.restore(); } } }
    // ⑤ 세뇌: 노리는 몸 둘레 (예고 소용돌이 · 등 뒤 빛)
    if (p.id === 'brain'){ const W = brain(B, p), T = W.T;
      if (T && p.t < W.s0){ const k = p.t/W.s0; for (let i = 0; i < 3; i++) ring(c, T.x, T.y, 70*(1 - k) + 20 + i*16, (70*(1 - k) + 20 + i*16)*.55, '#b070ff', 3, .4 + .5*k); }
      if (W.on){ const h = headOf(B, T); if (h !== null){ c.save(); c.globalAlpha = .22 + .1*Math.sin(now/160); c.fillStyle = '#80ff90'; c.translate(T.x, T.y); c.scale(1, .6); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 66, h + Math.PI - .9, h + Math.PI + .9); c.closePath(); c.fill(); c.restore(); } ring(c, T.x, T.y, 46, 26, '#b070ff', 3, .7); } }
    // 기본 공격 예고 · 자국
    for (const f of flukes(B)){
      if (f.k < FL.warn){ c.save(); c.globalAlpha = .45 + .4*Math.abs(Math.sin(f.k*12)); c.strokeStyle = '#9ad8ff'; c.lineWidth = 3; c.setLineDash([7, 6]); flukePath(c, f, 1); c.stroke(); c.globalAlpha = .1 + .25*f.k/FL.warn; c.fillStyle = '#6ab8ff'; c.fill(); c.restore(); }
      else { c.save(); c.globalAlpha = .7*cl((FL.end - f.k)*2); c.fillStyle = '#122a44'; flukePath(c, f, 1); c.fill(); c.restore(); } }
    // ⑥ 다 외운 설교 파동 · ③ 의자 파동
    if (p.id === 'sermon'){ const m = cutMask(B, p), [bx, by] = body(B); for (const S of casts(B, p)){ const kb = p.t - S.end; if ((m & 1 << S.i) || kb < 0 || kb > .7 || bits(m) >= 2) continue; fillEll(c, bx, by, 400, 250, '#a060ff', .25*(1 - kb/.7)); ring(c, bx, by, 80 + kb/.7*320, (80 + kb/.7*320)*.62, '#c080ff', 16, 1 - kb/.7); } }
    if (p.id === 'chair'){ const [bx, by] = body(B); for (const C of chairs(B, p)){ const kb = p.t - C.blast; if (kb < 0 || kb > .7) continue; const r = 80 + kb*1000; ring(c, bx, by, r, r*.6, '#c080ff', 18, 1 - kb/.7); } }
  },

  drawBody(B, c){
    const s = st(B), [x, y] = body(B), now = B.now, half = halfArt(B), pod = s.phase !== 3, stun = B.bs.stun > now;
    const im = bossArt(half, pod), oy = y - (pod ? 350 : 246)*SC + Math.sin(now/420)*2;
    let sh = 0; if (s.phase === 2 && s.ph2 >= 0 && s.ph2 < 2.4) sh = Math.sin(now/14)*6*(1 - s.ph2/2.4);
    if (!pod) shadow(c, x, y + 2, 70, 16, .3); else shadow(c, x, y, 85, 18, .35);
    c.save(); c.translate(x + sh, oy); if (stun) c.rotate(Math.sin(now/330)*.08); c.drawImage(im, BX0*SC, BY0*SC, BW*SC, BH*SC);
    // 물줄기 (평소) · 금화 (변신)
    if (!half){ for (let i = 0; i < 4; i++){ const k = ((now/600 + i/4)%1), a = -Math.PI/2 + (i - 1.5)*.35; fillEll(c, Math.cos(a)*k*40, -250*SC - 14 + Math.sin(a)*k*40 + k*k*40, 3.5*(1 - k*.5), 3.5*(1 - k*.5), '#c8e8ff', 1 - k); } }
    else { for (let i = 0; i < 6; i++){ const k = ((now/700 + i/6)%1), a = -Math.PI/2 + (i - 2.5)*.3; fillEll(c, Math.cos(a)*k*70, -200*SC + Math.sin(a)*k*80 + k*k*70, 4, 4, '#f0c040', 1 - k); } }
    c.restore();
    // ⑥ 설교 중 장부를 높이 들어요 (끊을 칸)
    const p = s.p;
    if (p.id === 'sermon' && !stun){ const m = cutMask(B, p); for (const S of casts(B, p)){ if (p.t < S.w0 - .15 || p.t > S.w1 || (m & 1 << S.i) || bits(m) >= 2) continue; const lift = ease((p.t - S.w0 + .15)/.2);
        c.save(); c.translate(x - 70, y - 175 - lift*40); c.rotate(-.2); const gl = c.createRadialGradient(0, 0, 4, 0, 0, 60); gl.addColorStop(0, 'rgba(210,140,255,.6)'); gl.addColorStop(1, 'rgba(210,140,255,0)'); c.fillStyle = gl; c.fillRect(-60, -60, 120, 120);
        c.fillStyle = '#3a5a3a'; c.fillRect(-26, -32, 52, 64); c.fillStyle = '#efe6cc'; c.fillRect(-21, -27, 42, 54); c.fillStyle = '#b02020'; c.fillRect(-14, -14, 28, 3); c.fillRect(-14, -4, 28, 3); c.fillRect(-14, 6, 20, 3); c.restore(); } }
    // 기절: 장부에서 떨어진 배표 한 장
    if (stun && B.bs.stunAt){ const k = cl((now - B.bs.stunAt)/700), tx = x + 70 + k*40, ty = y - 120 + k*110; c.save(); c.translate(tx, ty); c.rotate(.3 - k*.25 + Math.sin(now/500)*.05); c.drawImage(ticket(), -65, -28, 130, 56); c.restore(); }
  },

  drawTop(B, c){
    const s = st(B), p = s.p, now = B.now, [bx, by] = body(B);
    // 꼬리가 위에서 내려와요
    for (const f of flukes(B)){ if (f.k > .55 && f.k < FL.slam){ const u = cl((f.k - .55)/(FL.warn - .55)); c.save(); c.globalAlpha = .9; c.translate(0, -90*(1 - u)); c.fillStyle = s.phase >= 2 ? '#2e3c48' : '#3a6a9a'; flukePath(c, f, .8 + u*.2); c.fill(); c.strokeStyle = 'rgba(200,230,255,.5)'; c.lineWidth = 2; c.stroke(); c.restore(); }
      if (f.k >= FL.warn && f.k < FL.warn + .35) txt(c, '철썩', f.x + Math.cos(f.a)*120, f.y + Math.sin(f.a)*70 - 30, 22, '#cfeaff', 1 - (f.k - FL.warn)/.35); }
    // ① 채찍: 원 밖에 있는 사람에게
    if (p.id === 'fence'){ const F = fence(B, p); if (F.on) for (const o of B.alive){ if (inEll(o.x, o.y, F.x, F.y, F.rx, F.ry) || Math.floor(now/120)%3) continue; const a = Math.atan2((o.y - F.y)/F.ry, (o.x - F.x)/F.rx), ex = F.x + Math.cos(a)*F.rx, ey = F.y + Math.sin(a)*F.ry;
        c.save(); c.strokeStyle = '#d0a060'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(ex, ey - 20); c.quadraticCurveTo((ex + o.x)/2 + 30, Math.min(ey, o.y) - 90, o.x, o.y - 30); c.stroke(); c.restore(); } }
    // ② 규칙 판 (보스 머리 위)
    if (p.id === 'rule'){ const R = rules(B, p).find(R => p.t >= R.t0 - .1 && p.t < R.chk + .8); if (R){ const a = cl((p.t - R.t0 + .1)*4)*cl((R.chk + .8 - p.t)*3), k = cl((R.chk - p.t)/(R.chk - R.t0)), x = bx, y = by - 330;
        c.save(); c.globalAlpha = a; c.translate(x, y); c.rotate(Math.sin(p.t*20)*.03*cl(1 - (p.t - R.t0)*2)); c.fillStyle = '#3a2a1a'; c.fillRect(-120, -36, 240, 72); c.fillStyle = '#f0e4c8'; c.fillRect(-113, -29, 226, 58);
        c.fillStyle = R.gather ? '#2060a0' : '#c03030'; c.fillRect(-113, 22, 226*k, 7); c.restore();
        txt(c, R.gather ? '생활 규칙 제 1 조' : '생활 규칙 제 3 조', x, y - 14, 17, '#4a2a10', a, null); txt(c, R.gather ? '다 함께 기도한다' : '가족은 따로 지낸다', x, y + 8, 22, R.gather ? '#2060a0' : '#c03030', a, null); } }
    // ③ 남은 시간 (의자 위 숫자 대신 보스 손짓) · 겹친 의자 표시
    if (p.id === 'chair'){ for (const C of chairs(B, p)){ if (p.t < C.t0 || p.t > C.blast) continue; const k = (C.blast - p.t)/(C.blast - C.t0); c.save(); c.globalAlpha = .9; c.strokeStyle = '#e0c8ff'; c.lineWidth = 5; c.beginPath(); c.arc(bx, by - 330, 16, -Math.PI/2, -Math.PI/2 + T2*k); c.stroke(); c.restore(); } }
    // ④ 고해 장부 쪽
    if (p.id === 'pages'){ for (const pg of pages(B, p)){ if (p.t < pg.t0 || p.t >= pg.gone) continue;
        for (const o of pg.own){ if (torn(B, pg, o.uid)) continue; let x, y, rot = Math.sin(now/250 + o.j)*.2, sc = 1;
          if (p.t < pg.land){ const u = (p.t - pg.t0)/(pg.land - pg.t0); x = lerp(pg.fx - 40 + o.j*20, o.x, ease(u)) + Math.sin(now/200 + o.j)*20*(1 - u); y = lerp(pg.fy - 200, o.y - 30, u) - Math.sin(u*Math.PI)*160; rot = u*6; }
          else if (p.t < pg.dead){ x = o.x; y = o.y - 30; shadow(c, o.x, o.y + 2, 20, 6, .35); if ((p.t - pg.land)/(pg.dead - pg.land) > .6) rot += Math.sin(now/40)*.1; }
          else { const T = B.all.find(q => q.uid === o.uid); if (!T) continue; x = T.x; y = T.y - 50; sc = .8; }
          c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc); c.fillStyle = '#f4ecd8'; c.fillRect(-24, -30, 48, 60); c.strokeStyle = '#8a6a4a'; c.lineWidth = 1; c.strokeRect(-24, -30, 48, 60); c.beginPath(); for (let l = 0; l < 4; l++){ c.moveTo(-17, 2 + l*7); c.lineTo(17, 2 + l*7); } c.stroke();
          c.font = FONT(o.nick.length > 4 ? 13 : 17); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#8a1a1a'; c.fillText(o.nick.slice(0, 6), 0, -14); c.restore();
          if (p.t >= pg.dead){ const T = B.all.find(q => q.uid === o.uid); if (T && p.t < pg.dead + 1.8){ c.save(); c.strokeStyle = '#8a8a90'; c.lineWidth = 4; for (let i = 0; i < 3; i++){ c.beginPath(); c.ellipse(T.x, T.y - 34 + i*11, 28, 8, 0, 0, T2); c.stroke(); } c.restore(); } } } } }
    // ⑤ 세뇌된 노리는 몸: 두건 · 소용돌이 눈 · 보스와 이어진 실
    if (p.id === 'brain'){ const W = brain(B, p), T = W.T;
      if (W.on){ c.save(); c.globalAlpha = .55; c.strokeStyle = '#a060e0'; c.setLineDash([4, 6]); c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by - 150); c.quadraticCurveTo((bx + T.x)/2, Math.min(by, T.y) - 160, T.x, T.y - 60); c.stroke(); c.restore();
        c.save(); c.translate(T.x, T.y); c.fillStyle = 'rgba(30,20,40,.88)'; c.beginPath(); c.moveTo(-28, -30); c.quadraticCurveTo(0, -96, 28, -30); c.lineTo(24, -18); c.quadraticCurveTo(0, -74, -24, -18); c.closePath(); c.fill();
        c.strokeStyle = '#c080ff'; c.lineWidth = 1.6; for (const s2 of [-1, 1]){ c.beginPath(); for (let i = 0; i < 12; i++){ const a = i*.7 + now/120*s2, r2 = .5 + i*.4; const px = s2*8 + Math.cos(a)*r2, py = -46 + Math.sin(a)*r2; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); } c.restore();
        if (Math.floor(now/1400)%2) txt(c, '아버지…', T.x, T.y - 104, 17, '#d8b0ff'); }
      if (W.woke && now - (B.bs.wake.at || 0) < 900 && T){ const k = (now - B.bs.wake.at)/900; ring(c, T.x, T.y - 30, 30 + k*60, (30 + k*60)*.7, '#c8ffd0', 4, 1 - k); } }
    // ⑥ 설교 막대 (끊을 칸이 보라색)
    if (p.id === 'sermon' && !(B.bs.stun > now)){ const m = cutMask(B, p); for (const S of casts(B, p)){ if (bits(m) >= 2) break; const cut = m & 1 << S.i; if (p.t < S.t0 || p.t > S.end + (cut ? .8 : .2)) continue;
        const x0 = bx - 110, y0 = by - 318, W = 220, u = cl((p.t - S.t0)/(S.end - S.t0)), w0 = (S.w0 - S.t0)/(S.end - S.t0)*W, w1 = (S.w1 - S.t0)/(S.end - S.t0)*W;
        c.save(); c.fillStyle = 'rgba(10,8,14,.88)'; c.fillRect(x0 - 4, y0 - 4, W + 8, 20); c.fillStyle = cut ? '#7a6a8a' : '#e0c8ff'; c.fillRect(x0, y0, W*u, 12);
        const inW = p.t >= S.w0 && p.t <= S.w1; c.fillStyle = inW ? 'rgba(200,80,255,.75)' : 'rgba(170,70,240,.35)'; c.fillRect(x0 + w0, y0, w1 - w0, 12); c.strokeStyle = '#c060ff'; c.lineWidth = inW ? 4 : 2; c.strokeRect(x0 + w0, y0 - 2, w1 - w0, 16);
        if (cut){ c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 + W*u - 6, y0 - 8); c.lineTo(x0 + W*u + 6, y0 + 20); c.stroke(); } c.restore();
        txt(c, '약속을 지킨 자만…', bx, y0 - 16, 18, '#f0e0ff', cut ? .4 : 1); }
      for (let i = 0; i < 2; i++){ fillEll(c, bx + 124 + i*18, by - 312, 6, 6, i < bits(m) ? '#c080ff' : 'rgba(60,40,80,.8)'); } }
  },

  drawScreen(B, c, w, h){
    const s = st(B); if (s.phase !== 2 || s.ph2 < 0 || s.ph2 > 5.2) return;
    const k = s.ph2, now = B.now, fin = cl(k/.4)*cl((5.2 - k)/.8);
    // 1. 어둠 + 손글씨 고해가 벽을 빽빽이 덮어요
    c.save(); c.globalAlpha = .6*fin; c.fillStyle = '#0c0606'; c.fillRect(0, 0, w, h); c.restore();
    const n = Math.floor(cl((k - .2)/1.5)*SCRIPT.length);
    c.save(); c.textAlign = 'left'; for (let i = 0; i < n; i++){ const q = SCRIPT[i], age = k - .2 - i/SCRIPT.length*1.5; c.globalAlpha = fin*cl(age*3)*(.5 + .3*Math.sin(now/330 + i)); c.save(); c.translate(q.x*w - 40 + Math.sin(now/500 + i)*2, q.y*h); c.rotate(q.a); c.font = `300 ${q.s}px "Dongle",sans-serif`; c.fillStyle = q.red ? '#ff4a3a' : '#c8a080'; c.fillText(q.w, 0, 0); c.restore(); } c.restore();
    // 2. 정리판 사진의 실이 장부로 팽팽히 당겨져요
    const [lx, ly0] = B.toScreen(...body(B)), ly = ly0 - 150*B.view.zoom;
    if (k > .6){ const pull = cl((k - .6)/1.2); c.save(); c.globalAlpha = fin; c.strokeStyle = `rgba(220,30,30,${.5 + .4*Math.sin(now/80)})`; c.lineWidth = 2 + pull*3; c.beginPath(); for (const [px, py] of PINS){ const x = px*w, y = py*h; c.moveTo(x, y); c.quadraticCurveTo(lerp(x, lx, .5), lerp(y, ly, .5) + (1 - pull)*40, lx, ly); } c.stroke();
      c.fillStyle = '#4a6a3a'; c.fillRect(lx - 30, ly - 22, 60, 44); c.fillStyle = '#efe6cc'; c.fillRect(lx - 25, ly - 17, 50, 34); for (const [px, py] of PINS){ c.fillStyle = '#e0d8c0'; c.fillRect(px*w - 12, py*h - 14, 24, 28); c.fillStyle = '#c02020'; c.beginPath(); c.arc(px*w, py*h - 14, 3, 0, T2); c.fill(); } c.restore(); }
    // 3. 촛불 든 신도 312 명이 바닥에서 솟아 · 1.9 초에 일제히 눈을 떠요
    const rise = ease((k - .8)/1.0), open = k > 1.9, im = cultist(open, true), sc = Math.max(.9, w/430);
    if (rise > 0){ const cols = Math.ceil(w/(40*sc)) + 1; c.save(); c.globalAlpha = fin*.94;
      for (let row = 0; row < 6; row++){ const ss = sc*(1 + row*.14), yb = h*.42 + row*h*.1 + (1 - rise)*h*.7; if (yb - 80*ss > h) continue;
        for (let i = 0; i < cols; i++){ const x = (i + (row%2)*.5)*40*sc - 10, y = yb + Math.sin(now/330 + i*1.7 + row)*2; c.drawImage(im, x - CULT.ox*ss, y - CULT.oy*ss, CULT.w*ss, CULT.h*ss); if (!((i + row)%3)) fillEll(c, x + 10.5*ss, y - 33*ss, 2*ss, 3.5*ss, `rgba(255,${200 + Math.sin(now/45 + i + row*3)*45|0},80,.95)`); } }
      c.restore(); }
    // 4. 고래 문양이 불타며 새겨져요
    if (k > 1.7 && k < 3.4){ const u = cl((k - 1.7)/.3), f = cl((3.4 - k)/.8), z = Math.min(w, h*1.2)/1100*(.9 + u*.6); c.save(); c.globalAlpha = f; c.translate(w/2, h*.42); c.scale(z, z);
      c.beginPath(); c.ellipse(0, 0, 150, 80, 0, Math.PI*.15, Math.PI*1.85); c.moveTo(130, -40); c.quadraticCurveTo(200, -60, 230, -110); c.moveTo(130, 40); c.quadraticCurveTo(200, 60, 230, 110); c.moveTo(-60, -80); c.lineTo(-60, -150); c.moveTo(-80, -140); c.quadraticCurveTo(-60, -170, -40, -140);
      c.strokeStyle = 'rgba(255,60,10,.35)'; c.lineWidth = 30; c.stroke(); c.strokeStyle = '#ff6a2a'; c.lineWidth = 11; c.stroke(); c.strokeStyle = '#ffd890'; c.lineWidth = 3; c.stroke();
      fillEll(c, -90, -10, 12, 12, '#ff6a2a'); c.restore();
      txt(c, '약속을 지킨 자만 구원의 섬으로', w/2, h*.42 + 150*z, Math.round(26*Math.max(1, w/700)), '#ffd0a0', f); }
    if (Math.abs(k - 1.9) < .12){ c.save(); c.globalAlpha = .7; c.fillStyle = '#fff0d0'; c.fillRect(0, 0, w, h); c.restore(); }
  },
};
// 시험용 (혼자 보기 모드에서 위치 확인)
export const _t = {st, body, flukes, fence, rules, chairs, pages, brain, casts, whaleC, backR, diveK};
