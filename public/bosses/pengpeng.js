// 펭펭??? (팽해준 · 검은 돛 사건) 다크 보스 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md
// 기본 공격: 물기둥 (보스 둘레 아무 데서나 흩어져 솟음)
// 1 단계 ① 물살 ② 해적 졸개 ③ 몫 1/5 · 50% 변신 (물이 차오름 · 등대 불빛 · 검은 돛) · 2 단계 ④ 안개 뱃고동 ⑤ 승선권 ⑥ 깃발 던지기 · 20% 아래 ⑦ 기울어진 갑판
import { pick, beat, warnCircle, warnLine, inEll, shadow, tint, text, cl, lerp, ease, dist } from './kit.js';
import { bodyArt, lanternArt, pirateArt, flagPiece, coin, FOOT, BOX } from './pengpeng_art.js';

const S = .36, K = .54;                        // 그림 1 단위 → 월드 · 캐시 해상도
const P = {
  1: [{id:'cur', len:12}, {id:'crew', len:13}, {id:'share', len:11}],
  2: [{id:'fog', len:13}, {id:'tk', len:14}, {id:'flag', len:14}],
  3: [{id:'tilt', len:14}],
};
const OPT = {gap:2.5, trans:5};
const LV = {cur:.4, crew:1, share:.15, fog:.3, tk:1, flag:1, tilt:.4}; // 패턴 중 돌아다니는 세기
const LINES = {cur:'물때가 바뀌었어요.', crew:'선원들! 손님이다!', share:'몫은 1/5 씩!', fog:'뿌우우…', tk:'남쪽 나라행, 편도.', flag:'검은 돛을 올려라!', tilt:'큰 배 오는 날은 바다가 시끄러워요.'};
const TAU = Math.PI*2;
const hsh = n => { const x = Math.sin(n*127.1 + 311.7)*43758.5453; return x - Math.floor(x); };
const WIN = [230, 380, 550, 720, 870];          // 졸개가 뛰어나오는 창문 (위쪽 벽)
const lo = B => B.lo;

// ===== 보스 자리 =====
const wander = t => [Math.cos(t*.42)*125 + Math.sin(t*1.07)*30, Math.sin(t*.61)*44 + Math.sin(t*1.3)*10];
function stunF(B){ const st = B.bs.stun || 0; if (!st) return 0; const s0 = st - 8000; if (B.now < s0) return 0; if (B.now < st) return cl((B.now - s0)/500); return 1 - cl((B.now - st)/600); }
function ampOf(B, k){
  let a = 1;
  if (k.id === 'trans') a = k.t < .8 ? 1 - ease(k.t/.8) : k.t > 4.2 ? ease((k.t - 4.2)/.8) : 0;
  else if (k.id && LV[k.id] != null){ const r = Math.min(cl(k.t/.6), cl((k.len - k.t)/.6)); a = 1 - r*(1 - LV[k.id]); }
  return a*(1 - stunF(B)); }
function posOf(B, k = pick(B, P, OPT)){ const a = ampOf(B, k), w = wander(B.t); return [B.hx + w[0]*a, B.hy + 10 + w[1]*a]; }
const shift = (B, d) => ({...B, t:B.t - d, pt:B.pt - d, ph2:B.ph2 >= 0 ? B.ph2 - d : -1, now:B.now - d*1000});
const posAt = (B, d) => d ? posOf(shift(B, d)) : posOf(B);
const half = B => B.phase >= 3 || (B.phase === 2 && B.ph2 >= 1.9);

// ===== 기본 공격: 물기둥 =====
const WC = new Map();
function cols(B){
  const bt = beat(B, 1.7), out = [];
  for (let q = 0; q < 3; q++){ const n = bt.n - q; if (n < 0) continue; const key = `${B.r.bossAt}.${B.phase}.${n}`; let cs = WC.get(key);
    if (!cs){ const start = n*bt.len, Bs = shift(B, B.t - start); cs = [];
      const trans = B.phase === 2 && Bs.ph2 < 5.4, st = B.bs.stun || 0, stun = st && Bs.now > st - 8400 && Bs.now < st;
      if (!trans && !stun){ const rnd = B.rng('w' + key), [cx, cy] = posOf(Bs), m = B.phase === 1 ? 3 : 4;
        for (let j = 0; j < m; j++){ const a = rnd()*TAU, r = 90 + rnd()*250; cs.push({key:key + '.' + j, t:start + j*.12, x:cl(cx + Math.cos(a)*r, 170, 930), y:cl(cy + 30 + Math.sin(a)*r*.55, 380, 870)}); } }
      WC.set(key, cs); if (WC.size > 30) WC.delete(WC.keys().next().value); }
    for (const c of cs){ const k = B.t - c.t; if (k >= 0 && k < 1.7) out.push({...c, k}); } }
  return out; }

// ===== ① 물살 =====
const CUR0 = .8, CSEG = 3.2;
function dirs(B, seed, n){ const r = B.rng(seed + 'd'), d = [r() < .5 ? 1 : -1]; for (let i = 1; i < n; i++) d.push(r() < .75 ? -d[i - 1] : d[i - 1]); return d; }
function curState(B, k){ const ds = dirs(B, k.seed, 6), j = Math.floor((k.t - CUR0)/CSEG), s = k.t - CUR0 - j*CSEG;
  if (j < 0) return {j, d:0, f:0, next:ds[0], w:k.t/CUR0};
  const f = ease(cl(s/.5))*cl((k.len - k.t)/.5), nx = k.t - CUR0 + .8 > (j + 1)*CSEG && k.t < k.len - .9 ? ds[j + 1] : 0;
  return {j, d:ds[j], f, next:nx, w:nx ? 1 - ((j + 1)*CSEG - (k.t - CUR0))/.8 : 0}; }

// ===== ② 해적 졸개 · ⑤ 승선권 졸개 =====
function crewList(B, k){ const cr = B.bs.cr; if (!cr || cr.s !== k.seed) return []; const n = cr.n, out = [], c = posOf(B, k), r = B.rng(k.seed + 'c');
  for (let i = 0; i < n*2 + 1; i++){ const w2 = i >= n, t0 = w2 ? 6.6 + (i - n)*.25 : .8 + i*.25, sx = WIN[Math.floor(r()*WIN.length)], a0 = r()*TAU, sp = (r() < .5 ? -1 : 1)*.55, off = r()*2.6;
    if (k.t < t0) continue; const dead = (cr.h?.[i] || 0) >= 2, gone = k.t > k.len - .8;
    const u = cl((k.t - t0)/1.4), a = a0 + sp*(k.t - t0), p = ((k.t - t0 - 1.4 + off)%2.6 + 2.6)%2.6, lunge = u >= 1 && p > .5 && p < 1 ? Math.sin(Math.PI*(p - .5)/.5) : 0, R = 150 + 90*lunge;
    let x = c[0] + Math.cos(a)*R, y = c[1] + Math.sin(a)*R*.6; x = lerp(sx, x, ease(u)); y = lerp(262, y, ease(u)) - Math.sin(u*Math.PI)*40;
    if (gone){ const g = cl((k.t - k.len + .8)/.6); x = lerp(x, sx, g); y = lerp(y, 262, g); }
    out.push({i, x, y, hp:2 - (cr.h?.[i] || 0), dead, gone, warn:u >= 1 && p < .5 && !gone, alive:!dead && !gone, ready:u >= 1}); }
  return out; }
const crewGuard = (B, k) => k.id === 'crew' && crewList(B, k).some(m => m.alive);
function tkStove(B, k){ const tk = B.bs.tk; return tk && tk.s === k.seed ? tk : null; }
function tkCrew(B, k){ const tk = tkStove(B, k); if (!tk) return []; const n = tk.n, out = [], r = B.rng(k.seed + 'p'), a0 = r()*TAU, [sx0, sy0] = tk.st;
  for (let i = 0; i < n; i++){ const t0 = 1 + i*.8, sx = WIN[Math.floor(r()*WIN.length)], off = r()*2.4; if (k.t < t0) continue;
    const dead = (tk.h?.[i] || 0) >= 2, gone = k.t > k.len - .6 || (!!tk.b && B.now > tk.b + 600), u = cl((k.t - t0)/1.6), a = a0 + i*TAU/n + .35*(k.t - t0), p = ((k.t - t0 - 1.6 + off)%2.4 + 2.4)%2.4, lunge = u >= 1 && p > .5 && p < 1 ? Math.sin(Math.PI*(p - .5)/.5) : 0, R = 80 + 80*lunge;
    let x = lerp(sx, sx0 + Math.cos(a)*R, ease(u)), y = lerp(262, sy0 + Math.sin(a)*R*.6, ease(u)) - Math.sin(u*Math.PI)*40;
    out.push({i, x, y, hp:2 - (tk.h?.[i] || 0), dead, gone, warn:u >= 1 && p < .5 && !gone, alive:!dead && !gone, ready:u >= 1}); }
  return out; }
const STOVES = [[330, 470], [770, 470], [330, 690], [770, 690]];

// ===== ③ 몫 1/5 =====
const CC = new Map();
function coins(B, k){ let cs = CC.get(k.seed); if (cs) return cs; const [cx, cy] = posAt(B, k.t), r = B.rng(k.seed + 'g'), lane = r()*TAU; cs = [];
  for (let tries = 0; cs.length < 24 && tries < 400; tries++){ const a = r()*TAU, rad = 135 + r()*250; let bad = false; for (let m = 0; m < 4; m++){ const d = Math.abs(((a - lane - m*Math.PI/2)%TAU + TAU*1.5)%TAU - Math.PI); if (d < .22) bad = true; } if (bad) continue;
    const x = cx + Math.cos(a)*rad, y = cy + 20 + Math.sin(a)*rad*.55; if (x < 190 || x > 910 || y < 385 || y > 865) continue; if (cs.some(q => Math.hypot(q.x - x, q.y - y) < 40)) continue; cs.push({i:cs.length, x, y, sx:cx, sy:cy - 90, d:r()*.3}); }
  CC.set(k.seed, cs); if (CC.size > 6) CC.delete(CC.keys().next().value); return cs; }
const coinTaken = (B, k, i) => B.bs.sh && B.bs.sh.s === k.seed && B.bs.sh.g?.[i];

// ===== ④ 안개 뱃고동 =====
const HORN = [.8, 3.4, 6.0, 8.6, 11.0], RSPD = 300;
const HC = new Map();
function horns(B, k){ let hs = HC.get(k.seed); if (hs) return hs; const r = B.rng(k.seed + 'h'); hs = HORN.map(h => { const g0 = r()*TAU, [x, y] = posAt(B, k.t - h); return {h, x, y, gaps:[g0, g0 + TAU/3, g0 + TAU*2/3]}; }); HC.set(k.seed, hs); if (HC.size > 4) HC.delete(HC.keys().next().value); return hs; }
const ringR = (hn, t) => (t - hn.h - .9)*RSPD + 40;
const inGap = (hn, a) => hn.gaps.some(gA => Math.abs(((a - gA)%TAU + TAU*1.5)%TAU - Math.PI) < .3);

// ===== ⑥ 깃발 =====
function flagSpots(B, k, n){ const r = B.rng(k.seed + 'f'), a0 = r()*TAU, out = []; for (let i = 0; i < n; i++){ const a = a0 + i*TAU/n + (r() - .5)*.5, rad = 290 + r()*70; out.push([cl(B.hx + Math.cos(a)*rad, 200, 900), cl(B.hy + 40 + Math.sin(a)*rad*.6, 395, 855)]); } return out; }
const FLY = .45;

// ===== ⑦ 기울어진 갑판 =====
const TL0 = .8, TSEG = 2.6;
function tiltState(B, k){ if (k.id !== 'tilt') return {d:0, f:0, j:-1, next:0, w:0}; const ds = dirs(B, k.seed, 7), j = Math.floor((k.t - TL0)/TSEG), s = k.t - TL0 - j*TSEG;
  if (j < 0) return {d:0, f:0, j, next:ds[0], w:k.t/TL0};
  const f = ease(cl(s/.6))*cl((k.len - k.t)/.6), nxt = k.t - TL0 + .7 > (j + 1)*TSEG && k.t < k.len - .9 ? ds[j + 1] : 0;
  return {j, d:ds[j], f, next:nxt, w:nxt ? 1 - ((j + 1)*TSEG - (k.t - TL0))/.7 : 0}; }

// ===== 내 화면 상태 (장식 · 보낸 일 기억) =====
const L = {said:'', sent:{}, hostT:0, txT:0, shN:0, trK:'', stunK:'', cols:{}, horn:'', flip:'', tilt:'', heal:0, healT:0, startK:''};
function once(key){ if (L.sent[key]) return false; L.sent[key] = 1; const ks = Object.keys(L.sent); if (ks.length > 300) delete L.sent[ks[0]]; return true; }

export default {
  reach: 125,
  height: 272,
  pos(B){ return posOf(B); },

  tick(B, dt){
    const k = pick(B, P, OPT), me = B.me && !B.me.down ? B.me : null, now = B.now, ctl = B.ctl;
    // --- 대사 ---
    const sk = `${B.r.bossAt}`; if (L.startK !== sk && B.t < 4){ L.startK = sk; B.say('등대 불빛 세어 본 적 있어요?', 2600); }
    if (k.id && k.id !== 'trans' && L.said !== k.seed){ L.said = k.seed; if (k.t < 1.5) B.say(LINES[k.id], 2200); }
    if (k.id === 'trans'){ const tk2 = `${B.r.rageAt}`; if (k.t > 1.7 && L.trK !== tk2){ L.trK = tk2; B.sfx('slam'); B.shake(); B.say(`${B.targetNick !== '???' ? B.targetNick : '그'} 몸으로 남쪽 나라에 갈 거야.`, 3000); } }
    if ((B.bs.stun || 0) > now && now > B.bs.stun - 8000 && L.stunK !== String(B.bs.stun)){ L.stunK = String(B.bs.stun); B.say('불빛이… 꺼졌어?', 2200); B.sfx('slam'); B.shake(); }

    // --- 기본 공격: 물기둥 ---
    for (const c of cols(B)){
      if (c.k > .9 && !L.cols[c.key]){ L.cols[c.key] = 1; if (!me || dist(me.x, me.y, c.x, c.y) < 360) B.sfx('slam', 260); }
      if (me && c.k > .9 && c.k < 1.25 && inEll(me.x, me.y, c.x, c.y, 48, 28)) B.hurt(lo(B) + 20, 'wc' + c.key); }
    if (Object.keys(L.cols).length > 80) L.cols = {};

    // --- 패턴 ---
    if (k.id === 'cur'){ const s = curState(B, k);
      if (s.next && s.w > 0 && once('cw' + k.seed + s.j)) B.sfx('warn');
      if (me && s.f > 0){ ctl.drift = [s.d*125*s.f, 0];
        if (s.f > .3 && ((s.d < 0 && me.x < 240) || (s.d > 0 && me.x > 860))){ if (B.hurt(lo(B) + 60, `reef.${k.seed}.${s.j}`)){ B.sfx('slam'); B.shake(); } B.push(-s.d, 0, 150); } } }

    if (k.id === 'crew'){
      if (B.host && (B.bs.cr?.s !== k.seed) && now - L.txT > 600){ L.txT = now; const n = Math.max(2, Math.min(5, 1 + Math.ceil(B.alive.length/2))); B.tx(bs => bs.cr?.s === k.seed ? undefined : {...bs, cr:{s:k.seed, n, h:{}}}); }
      if (me) for (const m of crewList(B, k)) if (m.alive && m.ready && inEll(me.x, me.y, m.x, m.y, 34, 22)){ if (B.hurt(lo(B), `cr.${k.seed}.${m.i}.${Math.floor(k.t/1.5)}`)) B.push(me.x - m.x, me.y - m.y, 50); } }

    if (k.id === 'share'){ const cs = coins(B, k), sh = B.bs.sh && B.bs.sh.s === k.seed ? B.bs.sh : null, nTaken = sh ? Object.keys(sh.g || {}).length : 0;
      if (nTaken > L.shN && L.shSeed === k.seed){ const [bx, by] = posOf(B, k); B.fx(`+몫 ${nTaken - L.shN}`, bx + 60, by - 250, '#9affb0'); }
      if (L.shSeed !== k.seed){ L.shSeed = k.seed; L.shN = 0; } L.shN = nTaken;
      if (me && sh){ for (const i in sh.g){ const g = sh.g[i]; if (g[0] === me.uid && now - g[1] < 2500) ctl.speed = .6; } }
      if (B.host && k.t > 1.1 && k.t < k.len - .3 && now - L.txT > 350){ const add = {};
        for (const p of B.alive) for (const c of cs) if (!coinTaken(B, k, c.i) && !L.sent['g' + k.seed + c.i] && !add[c.i] && inEll(p.x, p.y, c.x, c.y, 26, 16)) add[c.i] = [p.uid, now];
        const ids = Object.keys(add); if (ids.length){ L.txT = now; for (const i of ids) L.sent['g' + k.seed + i] = 1; B.sfx('warn', 300);
          B.tx(bs => { const o = bs.sh && bs.sh.s === k.seed ? bs.sh : {s:k.seed, g:{}}; const g2 = {...(o.g || {})}; for (const i of ids) if (!g2[i]) g2[i] = add[i]; return {...bs, sh:{s:k.seed, g:g2}}; });
          L.heal += ids.length; }
        if (L.heal && now - L.healT > 500){ B.heal(Math.round(B.r.max*.012*L.heal)); L.heal = 0; L.healT = now; } } }

    if (k.id === 'fog'){ const hs = horns(B, k);
      for (let i = 0; i < hs.length; i++){ const hn = hs[i];
        if (k.t > hn.h && k.t < hn.h + .9 && once('hw' + k.seed + i)) B.sfx('warn');
        if (!me) continue; const R = ringR(hn, k.t); if (R < 40 || R > 620) continue;
        const dx = me.x - hn.x, dy = (me.y - hn.y)/.55, rr = Math.hypot(dx, dy);
        if (Math.abs(rr - R) < 20 && !inGap(hn, Math.atan2(dy, dx))) B.hurt(lo(B) + 60, `horn.${k.seed}.${i}`); } }

    if (k.id === 'tk'){ const tk = tkStove(B, k);
      if (B.host && !tk && B.target && k.t < k.len - 2 && now - L.txT > 600){ L.txT = now; const tg = B.target, best = STOVES.map(s => [dist(s[0], s[1], tg.x, tg.y), s]).sort((a, b) => b[0] - a[0])[1][1], n = Math.max(2, Math.min(5, 1 + B.alive.length));
        B.tx(bs => bs.tk?.s === k.seed ? undefined : {...bs, tk:{s:k.seed, uid:tg.uid, st:best, n, h:{}}}); }
      if (tk){ const tgt = B.all.find(p => p.uid === tk.uid);
        if (me && me.uid === tk.uid && !tk.b) ctl.speed = .55;
        if (B.host && !tk.b && tgt && !tgt.down && k.t > 1 && inEll(tgt.x, tgt.y, tk.st[0], tk.st[1], 60, 40) && now - L.txT > 350){ L.txT = now; B.tx(bs => bs.tk?.s === k.seed && !bs.tk.b ? {...bs, tk:{...bs.tk, b:now}} : undefined); }
        if (tk.b && once('tb' + k.seed)){ B.sfx('slam'); B.fx('출항 취소', tk.st[0], tk.st[1] - 90, '#ffd8a0'); }
        if (!tk.b && k.t > k.len - .4){ if (me && me.uid === tk.uid && B.hurt(lo(B) + 180, 'tkf' + k.seed)){ B.shake(); B.sfx('slam'); }
          if (once('tkx' + k.seed)) B.say('출항이다!', 2000);
          if (B.host && tgt && !tgt.down && once('tkh' + k.seed)) B.heal(Math.round(B.r.max*.03)); }
        if (me) for (const m of tkCrew(B, k)) if (m.alive && m.ready && inEll(me.x, me.y, m.x, m.y, 34, 22)){ if (B.hurt(lo(B) + 20, `tc.${k.seed}.${m.i}.${Math.floor(k.t/1.5)}`)) B.push(me.x - m.x, me.y - m.y, 70); } } }

    if (k.id === 'flag'){ const fl = B.bs.fl && B.bs.fl.s === k.seed ? B.bs.fl : null;
      if (B.host && !fl && k.t < k.len - 2 && now - L.txT > 600){ L.txT = now; const n = Math.max(1, Math.min(3, B.alive.length)); B.tx(bs => bs.fl?.s === k.seed ? undefined : {...bs, fl:{s:k.seed, n, own:{}, th:{}}}); }
      if (fl && me && k.t > .8 && !(B.bs.stun > now)){ const sp = flagSpots(B, k, fl.n), aliveU = new Set(B.alive.map(p => p.uid));
        const carrying = Object.keys(fl.own || {}).some(i => fl.own[i] === me.uid && !fl.th?.[i]);
        if (!carrying) for (let i = 0; i < fl.n; i++){ const o = fl.own?.[i]; if (fl.th?.[i] || (o && aliveU.has(o))) continue;
          if (inEll(me.x, me.y, sp[i][0], sp[i][1], 38, 24) && now - L.txT > 400){ L.txT = now; B.sfx('hit');
            B.tx(bs => { const f = bs.fl; if (!f || f.s !== k.seed || f.th?.[i]) return undefined; const ow = f.own?.[i]; if (ow && ow !== me.uid && B.alive.some(p => p.uid === ow)) return undefined; return {...bs, fl:{...f, own:{...(f.own || {}), [i]:me.uid}}}; }); break; } } } }

    if (k.id === 'tilt'){ const s = tiltState(B, k);
      if (s.next && s.w > 0 && once('tw' + k.seed + s.j)) B.sfx('warn');
      if (me && s.f > 0){ ctl.drift = [s.d*120*s.f, 0]; ctl.slip = 2.2;
        if (s.f > .3 && ((s.d < 0 && me.x < 215) || (s.d > 0 && me.x > 885))){ if (B.hurt(lo(B) + 100, `sea.${k.seed}.${s.j}`)){ B.sfx('slam'); B.shake(); B.fx('풍덩', me.x, me.y - 60, '#9ad8ff'); } B.push(-s.d, 0, Math.abs(me.x - (B.hx - s.d*170))); } } }
  },

  hitMul(B){ const k = pick(B, P, OPT); if (crewGuard(B, k)) return 0; return (B.bs.stun || 0) > B.now ? 2 : 1; },

  swing(B, cx, cy){ const k = pick(B, P, OPT), me = B.me; if (!me) return false;
    if (k.id === 'crew' || k.id === 'tk'){ const list = k.id === 'crew' ? crewList(B, k) : tkCrew(B, k); let best = null, bd = 62;
      for (const m of list){ if (!m.alive || !m.ready) continue; const d = Math.hypot(m.x - cx, (m.y - 20) - cy); if (d < bd){ bd = d; best = m; } }
      if (best){ const key = k.id === 'crew' ? 'cr' : 'tk'; B.sfx('hit', 60); B.fx(best.hp <= 1 ? '퍽!' : '탁', best.x, best.y - 50, '#ffffff');
        B.tx(bs => { const o = bs[key]; if (!o || o.s !== k.seed) return undefined; const h = {...(o.h || {})}; if ((h[best.i] || 0) >= 2) return undefined; h[best.i] = (h[best.i] || 0) + 1; return {...bs, [key]:{...o, h}}; }); return true; } }
    if (k.id === 'flag'){ const fl = B.bs.fl && B.bs.fl.s === k.seed ? B.bs.fl : null; if (!fl) return false;
      const i = Object.keys(fl.own || {}).find(j => fl.own[j] === me.uid && !fl.th?.[j]); if (i == null) return false;
      const [bx, by] = posOf(B, k); if (dist(me.x, me.y, bx, by) > 340) return false;
      const now = B.now, x = Math.round(me.x), y = Math.round(me.y); B.sfx('warn', 60);
      B.tx(bs => { const f = bs.fl; if (!f || f.s !== k.seed || f.th?.[i] || f.own?.[i] !== me.uid) return undefined; const th = {...(f.th || {}), [i]:[now, x, y]}; const nb = {...bs, fl:{...f, th}};
        if (Object.keys(th).length >= f.n && !((bs.stun || 0) > now)) nb.stun = now + FLY*1000 + 8000; return nb; });
      return true; }
    return false; },

  // ===== 그리기 =====
  drawFloor(B, c){ const k = pick(B, P, OPT), t = B.t;
    drawSail(B, c, k);
    if (k.id === 'cur') drawCurrent(B, c, k);
    if (k.id === 'tilt') drawDeck(B, c, k);
    if (k.id === 'share') drawCoins(B, c, k);
    if (k.id === 'tk') drawStove(B, c, k);
    if (k.id === 'flag') drawFlagsFloor(B, c, k);
    if (k.id === 'crew') drawMinions(B, c, crewList(B, k), B.now, true);
    if (k.id === 'tk') drawMinions(B, c, tkCrew(B, k), B.now, true);
    // 물기둥 예고: 바닥 물결
    for (const w of cols(B)){ if (w.k >= .9) continue; c.save(); c.globalAlpha = .5 + .35*Math.abs(Math.sin(w.k*10)); c.strokeStyle = '#9ad8ff'; c.lineWidth = 3;
      for (let i = 0; i < 3; i++){ const r = 12 + ((w.k*40 + i*14)%42); c.beginPath(); c.ellipse(w.x, w.y, r, r*.5, 0, 0, TAU); c.stroke(); }
      c.globalAlpha = .18 + .25*w.k/.9; c.fillStyle = '#5ab0ff'; c.beginPath(); c.ellipse(w.x, w.y, 48*w.k/.9, 28*w.k/.9, 0, 0, TAU); c.fill(); c.restore(); }
    drawStreak(B, c, t); },

  drawBody(B, c){ const k = pick(B, P, OPT), [fx, fy] = posOf(B, k), hf = half(B), t = B.t, now = B.now;
    const v = vel(B), mv = cl((Math.hypot(v[0], v[1]) - 10)/55), ts = tiltState(B, k), st = stunF(B);
    shadow(c, fx, fy - 4, 92, 24, .4);
    c.save(); let sh = 0; if (k.id === 'trans' && k.t < 2.2) sh = Math.sin(now/14)*6*(1 - k.t/2.2); if (st > 0) sh += Math.sin(now/300)*5*st;
    c.translate(fx + sh, fy); const rot = (Math.sign(v[0])*mv*.3) + ts.d*ts.f*.12 + st*.12; if (rot) c.rotate(rot); if (mv > 0) c.scale(1 + mv*.05, 1 - mv*.08);
    const img = bodyArt(hf, K), [x0, y0, w, h] = BOX; c.drawImage(img, x0*S, (y0 - FOOT)*S, w*S, h*S);
    // 신호 랜턴: 길게 · 짧게 · 짧게
    const on = [1, 1, 1, 0, 1, 0, 1, 0, 0, 0][Math.floor(now/250)%10], ln = lanternArt(!!on, K), ls = 1.6*160*S; c.drawImage(ln, -230*S - ls/2, (120 - FOOT)*S - ls/2, ls, ls);
    // 머리 위 램프 불빛
    const ly = ((hf ? -300 : -270) - FOOT)*S; if (st < .5) beams(c, 0, ly, now/1000, hf, k);
    if (st > 0){ const n = 3; for (let i = 0; i < n; i++) flagPiece(c, -14 + i*14, ly + 4, i*.6 - .4, .8); }
    c.restore(); },

  drawTop(B, c){ const k = pick(B, P, OPT), now = B.now;
    // 물기둥
    for (const w of cols(B)){ if (w.k < .9) continue; const u = cl((w.k - .9)/.2), d = cl((1.7 - w.k)/.4), h = 140*u*d; c.save(); c.globalAlpha = .85*d;
      const q = c.createLinearGradient(w.x - 22, 0, w.x + 22, 0); q.addColorStop(0, 'rgba(120,190,255,.6)'); q.addColorStop(.5, 'rgba(230,248,255,.95)'); q.addColorStop(1, 'rgba(120,190,255,.6)'); c.fillStyle = q;
      c.beginPath(); c.moveTo(w.x - 22, w.y); c.quadraticCurveTo(w.x - 28, w.y - h*.6, w.x - 9, w.y - h); c.lineTo(w.x + 9, w.y - h); c.quadraticCurveTo(w.x + 28, w.y - h*.6, w.x + 22, w.y); c.closePath(); c.fill();
      c.fillStyle = 'rgba(230,248,255,.9)'; for (let i = 0; i < 6; i++){ c.beginPath(); c.arc(w.x + Math.cos(i)*24*u, w.y - h - 6 + Math.sin(i*2)*8, 5, 0, TAU); c.fill(); } c.restore(); }
    if (k.id === 'crew'){ const list = crewList(B, k); drawMinions(B, c, list, now, false); if (list.some(m => m.alive)){ const [bx, by] = posOf(B, k); c.save(); c.globalAlpha = .45 + .15*Math.sin(now/160); c.strokeStyle = '#9ad8ff'; c.lineWidth = 4; c.beginPath(); c.ellipse(bx, by - 110, 115, 165, 0, 0, TAU); c.stroke(); c.restore(); } }
    if (k.id === 'tk'){ drawMinions(B, c, tkCrew(B, k), B.now, false); drawTicket(B, c, k); }
    if (k.id === 'flag') drawFlagsTop(B, c, k);
    drawSpray(B, c); },

  drawScreen(B, c, w, h){ const k = pick(B, P, OPT);
    if (k.id === 'fog') drawFog(B, c, w, h, k);
    if (k.id === 'trans') drawFlood(B, c, w, h, k);
    if (k.id === 'tilt') drawTiltScreen(B, c, w, h, k);
    if (k.id === 'cur') drawCurScreen(B, c, w, h, k); },
};

// 시험용 (혼자 보기 · 게임에선 안 써요)
export const dev = {pick:B => pick(B, P, OPT), posOf, crewList, tkCrew, coins, horns, flagSpots, ringR, inGap, curState, tiltState};

// ===== 움직일 때: 배로 미끄러지며 젖은 자국 · 옆으로 튀는 물보라 =====
function vel(B){ const a = posOf(B), b = posAt(B, .05); return [(a[0] - b[0])/.05, (a[1] - b[1])/.05]; }
function drawStreak(B, c, t){ const q = Math.floor(t/.1), pts = [[...posOf(B), t]];
  for (let i = 0; i <= 26; i++){ const ts = (q - i)*.1; if (ts < 0) break; pts.push([...posAt(B, t - ts), ts]); }
  if (pts.length < 3) return;
  c.save(); c.lineCap = 'round';
  for (let i = 1; i < pts.length - 1; i++){ const [x, y, ts] = pts[i], [px, py] = pts[i - 1], [nx, ny] = pts[i + 1], sp = Math.hypot(x - nx, y - ny)/.1, m = cl((sp - 6)/40), a = m*cl(1 - (t - ts)/2.6); if (a < .02) continue;
    c.strokeStyle = `rgba(110,175,230,${.5*a})`; c.lineWidth = 36 + 12*m; c.beginPath(); c.moveTo(px, py - 4); c.lineTo(x, y - 4); c.stroke();
    c.strokeStyle = `rgba(225,248,255,${.6*a*(.6 + .4*Math.sin(ts*23))})`; c.lineWidth = 4; c.beginPath(); c.moveTo(px, py - 14); c.lineTo(x, y - 14); c.stroke(); }
  c.restore(); }
function drawSpray(B, c){ const t = B.t, k1 = Math.floor(t/.05); c.save(); c.fillStyle = 'rgba(190,230,255,.95)';
  for (let k = k1 - 14; k <= k1; k++){ const ts = k*.05, age = t - ts; if (ts < .1 || age < 0) continue; const p0 = posAt(B, age), p1 = posAt(B, age + .05), vx = (p0[0] - p1[0])/.05, vy = (p0[1] - p1[1])/.05, L2 = Math.hypot(vx, vy), m = cl((L2 - 10)/55); if (m < .06) continue;
    const dx = vx/L2, dy = vy/L2;
    for (const side of [-1, 1]) for (let j = 0; j < 2; j++){ const h1 = hsh(k*7 + j*3 + side), h2 = hsh(k*13 + j*5 - side), h3 = hsh(k*3 + j*11 + side*2);
      let px = -dy*side, py = dx*side*.5; if (Math.abs(dy) < .5){ px = side*(.55 + .3*h3); py = (h3 - .5)*.5; }
      const sp = (110 + h1*170)*m, z = (170 + h2*230)*m*age - 520*age*age; if (z < -4) continue;
      const x = p0[0] + px*40 + (px*sp - dx*50*m)*age, y = p0[1] - 6 + py*20 + (py*sp - dy*25*m)*age - Math.max(0, z), r = 2.2 + h3*3.4;
      c.globalAlpha = cl(1 - age/.75)*Math.min(1, m*1.6); c.beginPath(); c.ellipse(x, y, r, r*1.2, 0, 0, TAU); c.fill(); } }
  c.restore(); }

// 머리 위 등대 램프 불빛 (두 줄기 빙글빙글) · 깨지면 붉은 맥박
function beams(c, x, y, s, hf, k){ c.save(); c.globalCompositeOperation = 'lighter';
  if (!hf){ for (const a of [s*1.4, s*1.4 + Math.PI]){ c.save(); c.translate(x, y); c.rotate(a); const b = c.createLinearGradient(0, 0, 160, 0); b.addColorStop(0, 'rgba(255,240,170,.5)'); b.addColorStop(1, 'rgba(255,240,170,0)'); c.fillStyle = b; c.beginPath(); c.moveTo(4, -4); c.lineTo(160, -26); c.lineTo(160, 26); c.lineTo(4, 4); c.closePath(); c.fill(); c.restore(); } }
  else { const p = .5 + .5*Math.sin(s*5), q = c.createRadialGradient(x, y, 2, x, y, 46); q.addColorStop(0, `rgba(255,60,60,${.45 + .3*p})`); q.addColorStop(1, 'rgba(255,0,0,0)'); c.fillStyle = q; c.fillRect(x - 46, y - 46, 92, 92); }
  c.restore(); }

// ===== 50% 변신 · 검은 돛 (월드 바닥 층 · 배경을 덮어요) =====
function drawSail(B, c, k){ if (B.phase < 2) return; const s = B.now/1000, hk = k.id === 'trans' ? k.t : 9;
  if (hk < 1) return; const un = ease((hk - 1.1)/1.5), al = hk < 3.8 ? 1 : lerp(1, .16, ease((hk - 3.8)/1.2)), W = B.W, top = 40, bot = lerp(top + 20, 880, un), lx = 60, rx = W - 60, bil = 70*un;
  c.save(); c.globalAlpha = al; c.fillStyle = '#1a100a'; c.fillRect(W/2 - 9, 0, 18, bot); c.fillRect(20, top - 14, W - 40, 16);
  c.beginPath(); c.moveTo(lx, top); for (let i = 0; i <= 12; i++) c.lineTo(lerp(lx, rx, i/12), top + Math.sin(i*1.3 + s*2)*3);
  for (let i = 0; i <= 10; i++){ const u = i/10; c.lineTo(rx + Math.sin(u*Math.PI)*bil*.6 + Math.sin(u*9 + s*3)*6*un, lerp(top, bot, u)); }
  for (let i = 20; i >= 0; i--){ const u = i/20, tear = (hsh(i) > .55 ? 1 : 0)*(18 + hsh(i + 9)*48); c.lineTo(lerp(lx, rx, u), bot - tear*un + Math.sin(u*14 + s*4)*9); }
  for (let i = 10; i >= 0; i--){ const u = i/10; c.lineTo(lx - Math.sin(u*Math.PI)*bil*.6 + Math.sin(u*9 + s*3 + 1)*6*un, lerp(top, bot, u)); }
  c.closePath(); const q = c.createLinearGradient(0, top, 0, bot); q.addColorStop(0, '#050508'); q.addColorStop(.5, '#14101a'); q.addColorStop(1, '#020204'); c.fillStyle = q; c.fill();
  c.strokeStyle = `rgba(200,30,50,${.75*un})`; c.lineWidth = 4; c.stroke();
  // 흐릿한 붉은 해골 · 눈이 깜빡여요
  const sy = lerp(top, 300, un), X = W/2; c.globalAlpha = al*un*.8; c.fillStyle = 'rgba(200,40,50,.32)'; c.beginPath(); c.ellipse(X, sy, 110, 100, 0, 0, TAU); c.fill();
  c.fillStyle = '#050508'; for (const e of [[-38, -6, 26, 30], [38, -6, 26, 30], [0, 34, 10, 14]]){ c.beginPath(); c.ellipse(X + e[0], sy + e[1], e[2], e[3], 0, 0, TAU); c.fill(); }
  c.save(); c.translate(X, sy + 150); c.fillStyle = 'rgba(200,40,50,.3)'; for (const r of [-.6, .6]){ c.save(); c.rotate(r); c.fillRect(-170, -12, 340, 24); c.restore(); } c.restore();
  c.fillStyle = 'rgba(255,60,60,.9)'; c.beginPath(); c.ellipse(X - 38, sy - 6, 6*Math.abs(Math.sin(s*5)) + .1, 6, 0, 0, TAU); c.ellipse(X + 38, sy - 6, 6*Math.abs(Math.sin(s*5 + 1)) + .1, 6, 0, 0, TAU); c.fill();
  c.restore(); }
// 방에 물이 차오르고 물속을 등대 불빛이 휘돌아요 (화면)
function drawFlood(B, c, w, h, k){ const hk = k.t, s = B.now/1000;
  let L; if (hk < .3) L = h + 30; else if (hk < 1.9) L = lerp(h + 30, h*.14, ease((hk - .3)/1.6)); else if (hk < 2.7) L = h*.14 + Math.sin(hk*9)*8; else if (hk < 4.1) L = lerp(h*.14, h*.93, ease((hk - 2.7)/1.4)); else L = h*.93 + Math.sin(s*2.2)*5;
  const lin = hk > 4.1 ? cl((5 - hk)/.9) : 1, deep = cl((h - L)/(h*.6)), surf = x => L + Math.sin(x*.025 + s*3.1)*9 + Math.sin(x*.06 - s*4.3)*4;
  c.save(); c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 12) c.lineTo(x, surf(x)); c.lineTo(w, h); c.closePath(); c.clip();
  const q = c.createLinearGradient(0, L, 0, h); q.addColorStop(0, `rgba(10,50,80,${.42*lin})`); q.addColorStop(1, `rgba(4,16,40,${(.7*deep + .12)*lin})`); c.fillStyle = q; c.fillRect(0, 0, w, h);
  // 물속 등대 불빛 두 줄기
  const bsA = cl((hk - .7)/.6)*cl((4.4 - hk)/.8); if (bsA > 0){ const [fx, fy] = posOf(B, k), [ox, oy] = B.toScreen(fx, fy - (FOOT + (hk >= 1.9 ? 300 : 270))*S), a0 = hk*2.4, R = Math.max(w, h)*1.5;
    c.globalCompositeOperation = 'lighter'; for (const off of [0, Math.PI]){ const a = a0 + off, g2 = c.createRadialGradient(ox, oy, 10, ox, oy, R); g2.addColorStop(0, `rgba(255,${hk >= 1.9 ? 110 : 230},140,${.55*bsA})`); g2.addColorStop(1, 'rgba(255,160,120,0)'); c.fillStyle = g2; c.beginPath(); c.moveTo(ox, oy); c.arc(ox, oy, R, a - .17, a + .17); c.closePath(); c.fill(); }
    c.globalCompositeOperation = 'source-over'; }
  c.strokeStyle = '#cfefff'; c.lineWidth = 1.5; for (let i = 0; i < 34; i++){ const x = hsh(i)*w + Math.sin(s*2 + i)*12, y = h - ((s*(60 + hsh(i + 1)*90) + hsh(i + 2)*900)%(h + 40)); if (y < L + 8) continue; c.globalAlpha = .55*lin; c.beginPath(); c.arc(x, y, 2 + hsh(i + 3)*5, 0, TAU); c.stroke(); }
  c.restore();
  c.save(); c.globalAlpha = lin; c.lineWidth = 3; c.strokeStyle = 'rgba(190,235,255,.85)'; c.beginPath(); for (let x = 0; x <= w; x += 12) c.lineTo(x, surf(x)); c.stroke();
  c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.7)'; for (let i = 0; i < 12; i++){ const x = ((i*67 + s*40)%(w + 60)) - 30, y = surf(x) + 6; c.globalAlpha = lin*(.4 + .4*Math.sin(s*6 + i)); c.beginPath(); c.moveTo(x - 14, y); c.lineTo(x + 14, y); c.stroke(); }
  c.restore();
  if (hk > 1.7 && hk < 2.5) tint(c, w, h, '#ffd8d8', 1 - (hk - 1.7)/.8); }

// ===== ① 물살 그리기 =====
function reef(c, x, y, s){ c.fillStyle = '#3a4450'; c.beginPath(); c.ellipse(x, y, 46*s, 22*s, 0, 0, TAU); c.fill(); c.fillStyle = '#56606c'; c.beginPath(); c.ellipse(x - 10*s, y - 14*s, 26*s, 18*s, 0, 0, TAU); c.fill(); c.fillStyle = '#4a5460'; c.beginPath(); c.ellipse(x + 14*s, y - 8*s, 18*s, 12*s, 0, 0, TAU); c.fill(); }
function drawCurrent(B, c, k){ const s = curState(B, k), al = cl(k.t*2)*cl((k.len - k.t)*2), t = B.now/1000;
  c.save(); c.globalAlpha = al;
  for (const side of [-1, 1]){ const x0 = side < 0 ? 205 : 895, hot = s.d === side && s.f > .3; c.fillStyle = hot ? 'rgba(255,255,255,.25)' : 'rgba(160,210,255,.12)'; c.fillRect(side < 0 ? 150 : 860, 380, 90, 490);
    for (let i = 0; i < 6; i++) reef(c, x0 + Math.sin(i*2.1)*14, 410 + i*85, .75 + hsh(i + side)*.3);
    if (hot){ c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 2; for (let i = 0; i < 8; i++){ const y = 400 + i*60 + Math.sin(t*6 + i)*6; c.beginPath(); c.arc(x0 - side*30, y, 8 + 4*Math.sin(t*9 + i), 0, TAU); c.stroke(); } } }
  if (s.d && s.f > 0){ c.globalAlpha = al*.6*s.f; c.strokeStyle = '#bfe6ff'; c.lineWidth = 2; for (let i = 0; i < 26; i++){ const y = 390 + (i*37)%470, ph = ((t*1.4*s.d + i*.37)%1 + 1)%1, x = 200 + ph*700; c.beginPath(); c.moveTo(x, y); c.lineTo(x - s.d*60, y); c.stroke(); } }
  c.restore(); }
function drawCurScreen(B, c, w, h, k){ const s = curState(B, k); if (!s.next || s.w <= 0) return; const a = .5 + .5*Math.abs(Math.sin(s.w*12));
  c.save(); c.globalAlpha = a; c.fillStyle = '#9ad8ff'; c.font = 'bold 44px "Dongle",sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 5; c.strokeStyle = 'rgba(6,20,40,.8)'; const s2 = s.next > 0 ? '≫ ≫ ≫' : '≪ ≪ ≪'; c.strokeText(s2, w/2, h*.3); c.fillText(s2, w/2, h*.3); c.restore(); }

// ===== ② · ⑤ 졸개 =====
function drawMinions(B, c, list, now, back){ const img = pirateArt(1.6), S2 = 1.25, by = posOf(B)[1];
  for (const m of list){ if (m.dead || (m.y < by) !== back) continue; const al = m.gone ? .55 : 1, b = Math.abs(Math.sin(now/70 + m.i))*3, sh = m.warn ? Math.sin(now/30)*2.5 : 0;
    c.save(); c.globalAlpha = al; if (m.hp === 1 && Math.floor(now/90)%2) c.globalAlpha = al*.55; c.drawImage(img, m.x - 32*S2 + sh, m.y - 60*S2 - b, 64*S2, 70*S2); c.restore();
    if (m.warn) text(c, '!', m.x, m.y - 78, 26, '#ff6a6a'); } }

// ===== ③ 금화 =====
function drawCoins(B, c, k){ const cs = coins(B, k), al = cl((k.len - k.t)*2), t = k.t;
  c.save(); c.globalAlpha = al;
  for (const q of cs){ if (coinTaken(B, k, q.i)) continue; const u = cl((t - .3 - q.d)/.8);
    if (u < 1){ if (t < .3 + q.d) continue; const x = lerp(q.sx, q.x, u), y = lerp(q.sy, q.y, u) - Math.sin(u*Math.PI)*120; coin(c, x, y, 7); continue; }
    c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(q.x, q.y + 4, 12, 4, 0, 0, TAU); c.fill(); coin(c, q.x, q.y - Math.abs(Math.sin(B.now/400 + q.i))*2, 9); }
  if (t < .6){ const [bx, by] = posOf(B, k); c.globalAlpha = 1 - t/.6; c.fillStyle = '#ffe080'; for (let i = 0; i < 10; i++){ const a = i*.63, r = t*260; c.beginPath(); c.arc(bx + Math.cos(a)*r, by - 90 + Math.sin(a)*r*.6, 4, 0, TAU); c.fill(); } }
  c.restore(); }

// ===== ④ 안개 =====
let fogCv = null;
function drawFog(B, c, w, h, k){ const al = cl(k.t/.8)*cl((k.len - k.t)/.8); if (al <= 0) return; const z = B.view.zoom || 1, fw = Math.ceil(w/3), fh = Math.ceil(h/3);
  if (!fogCv) fogCv = document.createElement('canvas'); if (fogCv.width !== fw || fogCv.height !== fh){ fogCv.width = fw; fogCv.height = fh; }
  const g = fogCv.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, fw, fh); g.fillStyle = `rgba(150,165,185,${.88*al})`; g.fillRect(0, 0, fw, fh);
  g.globalCompositeOperation = 'destination-out'; g.setTransform(1/3, 0, 0, 1/3, 0, 0);
  const hole = (x, y, r, a = 1) => { const q = g.createRadialGradient(x, y, r*.2, x, y, r); q.addColorStop(0, `rgba(0,0,0,${a})`); q.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = q; g.fillRect(x - r, y - r, r*2, r*2); };
  for (const p of B.all){ if (p.down) continue; const [x, y] = B.toScreen(p.x, p.y - 20); hole(x, y, (p.me ? 130 : 80)*z, p.me ? 1 : .8); }
  const [bx, by] = posOf(B, k), [sx, sy] = B.toScreen(bx, by - 110); hole(sx, sy, 150*z, .55);
  c.drawImage(fogCv, 0, 0, w, h);
  // 퍼지는 고리 (틈 셋) · 안개 위로 보여요
  for (const hn of horns(B, k)){ const R = ringR(hn, k.t); if (R < 40 || R > 620) continue; const [cx, cy] = B.toScreen(hn.x, hn.y);
    c.save(); c.translate(cx, cy); c.scale(1, .55); c.strokeStyle = 'rgba(210,235,255,.9)'; c.lineWidth = 34*z; c.shadowColor = 'rgba(160,220,255,.9)'; c.shadowBlur = 0;
    for (let i = 0; i < 3; i++){ const a0 = hn.gaps[i] + .3, a1 = hn.gaps[(i + 1)%3] - .3 + (i === 2 ? TAU : 0); c.beginPath(); c.arc(0, 0, R*z, a0, a1); c.stroke(); } c.restore(); }
  for (const hn of horns(B, k)) if (k.t > hn.h && k.t < hn.h + .9){ const u = (k.t - hn.h)/.9, [cx, cy] = B.toScreen(hn.x, hn.y); for (const gA of hn.gaps) warnLine(c, cx, cy, cx + Math.cos(gA)*520*z, cy + Math.sin(gA)*520*.55*z, u, 4, '220,240,255'); }
  for (const hn of horns(B, k)) if (k.t > hn.h && k.t < hn.h + .7){ const [x, y] = B.toScreen(posOf(B, k)[0], posOf(B, k)[1] - 290); text(c, '뿌우우~', x, Math.max(40, y), 34, '#e0f0ff'); } }

// ===== ⑤ 승선권 =====
function drawStove(B, c, k){ const tk = tkStove(B, k); if (!tk) return; const [x, y] = tk.st, t = B.now/1000, al = cl((k.len - k.t)*1.5);
  c.save(); c.globalAlpha = al; shadow(c, x, y + 2, 40, 12, .4); c.fillStyle = '#7a4a2a'; c.fillRect(x - 34, y - 50, 68, 52); c.fillStyle = '#5a3a20'; c.beginPath(); c.ellipse(x, y - 50, 34, 9, 0, 0, TAU); c.fill(); c.fillStyle = '#2a1a10'; c.fillRect(x - 16, y - 34, 32, 22);
  const fire = tk.b ? 1.8 : 1; for (let i = 0; i < 5; i++){ c.fillStyle = i%2 ? '#ffb040' : '#ff6020'; c.beginPath(); c.ellipse(x + Math.sin(t*9 + i)*10, y - 60 - i*8*fire, (10 - i)*fire, (12 - i)*fire, 0, 0, TAU); c.fill(); }
  const q = c.createRadialGradient(x, y - 40, 4, x, y - 40, 110); q.addColorStop(0, 'rgba(255,150,60,.35)'); q.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = q; c.fillRect(x - 110, y - 150, 220, 220); c.restore(); }
function drawTicket(B, c, k){ const tk = tkStove(B, k); if (!tk) return; const tg = B.all.find(p => p.uid === tk.uid); const now = B.now;
  if (tk.b){ const u = cl((now - tk.b)/700); if (u >= 1) return; const [x, y] = tk.st; c.save(); c.globalAlpha = 1 - u; c.translate(x, y - 70 - u*40); c.rotate(u*3); c.fillStyle = '#f4ecd8'; c.fillRect(-40*(1 - u), -14, 80*(1 - u), 28); c.restore(); return; }
  if (!tg) return; let x = tg.x, y = tg.y - 92; if (k.t > k.len - .4){ const u = cl((k.t - k.len + .4)/.4); y -= u*120; }
  c.save(); c.translate(x, y); c.rotate(Math.sin(now/300)*.08); c.fillStyle = '#f4ecd8'; c.fillRect(-48, -18, 96, 36); c.strokeStyle = '#2a4a8a'; c.lineWidth = 2; c.strokeRect(-44, -14, 88, 28); c.restore();
  text(c, '남쪽 나라 · 편도', x, y - 5, 15, '#2a4a8a', 'center', null); text(c, `승객 : ${tg.nick || B.targetNick}`, x, y + 8, 14, '#8a1818', 'center', null);
  const left = Math.max(0, Math.ceil(k.len - .4 - k.t)); text(c, `⚓ ${left}`, x, y - 32, 22, left <= 3 ? '#ff6a7a' : '#ffe0e4'); }

// ===== ⑥ 깃발 =====
function flagState(B, k){ return B.bs.fl && B.bs.fl.s === k.seed ? B.bs.fl : null; }
function drawFlagsFloor(B, c, k){ const fl = flagState(B, k); if (!fl) return; const sp = flagSpots(B, k, fl.n), alive = new Set(B.alive.map(p => p.uid)), t = B.now/1000;
  for (let i = 0; i < fl.n; i++){ const o = fl.own?.[i]; if (fl.th?.[i] || (o && alive.has(o))) continue; const [x, y] = sp[i];
    c.save(); c.globalAlpha = .35 + .2*Math.sin(t*4 + i); c.fillStyle = '#c8d8ff'; c.beginPath(); c.ellipse(x, y, 30, 12, 0, 0, TAU); c.fill(); c.restore(); flagPiece(c, x, y - 12 + Math.sin(t*3 + i)*3, .2, 1.4); } }
function drawFlagsTop(B, c, k){ const fl = flagState(B, k); if (!fl) return; const now = B.now, [bx, by] = posOf(B, k), ly = by - (FOOT + 300)*S;
  for (let i = 0; i < fl.n; i++){ const th = fl.th?.[i], o = fl.own?.[i];
    if (th){ const u = (now - th[0])/(FLY*1000); if (u >= 0 && u < 1){ flagPiece(c, lerp(th[1], bx, u), lerp(th[2] - 60, ly, u) - Math.sin(u*Math.PI)*90, u*12, 1.2); } continue; }
    if (o){ const p = B.all.find(q => q.uid === o && !q.down); if (p) flagPiece(c, p.x + 22, p.y - 70 + Math.sin(now/160)*3, Math.sin(now/170)*.3, 1.2); } }
  const n = Object.values(fl.th || {}).filter(th => now - th[0] > FLY*1000).length; if (n && !((B.bs.stun || 0) > now)) for (let i = 0; i < n; i++) flagPiece(c, bx - 16 + i*16, ly + 4, i*.6 - .4, .9); }

// ===== ⑦ 기울어진 갑판 =====
function drawDeck(B, c, k){ const s = tiltState(B, k), al = cl(k.t*2)*cl((k.len - k.t)*2), t = B.now/1000, d = s.d*s.f;
  c.save(); c.globalAlpha = al*.5; c.strokeStyle = 'rgba(30,18,10,.55)'; c.lineWidth = 2; for (let y = 380; y < 880; y += 34){ const sk = d*10; c.beginPath(); c.moveTo(160, y - sk); c.lineTo(940, y + sk); c.stroke(); }
  if (Math.abs(d) > .02){ const q = c.createLinearGradient(160, 0, 940, 0), a = Math.abs(d)*.35; if (d > 0){ q.addColorStop(0, 'rgba(255,240,200,0)'); q.addColorStop(1, `rgba(0,0,20,${a})`); } else { q.addColorStop(0, `rgba(0,0,20,${a})`); q.addColorStop(1, 'rgba(255,240,200,0)'); } c.globalAlpha = al; c.fillStyle = q; c.fillRect(160, 370, 780, 510); }
  c.restore();
  // 바다: 양 끝 (기울어진 쪽은 물이 넘실)
  for (const side of [-1, 1]){ const hot = s.d === side ? s.f : 0, wv = 30 + 40*hot, x0 = side < 0 ? 150 : 950; c.save(); c.globalAlpha = al*(.45 + .45*hot);
    const q = c.createLinearGradient(x0, 0, x0 - side*(wv + 30), 0); q.addColorStop(0, 'rgba(20,70,130,.95)'); q.addColorStop(1, 'rgba(60,140,200,0)'); c.fillStyle = q; c.beginPath(); c.moveTo(x0, 370);
    for (let y = 370; y <= 880; y += 20) c.lineTo(x0 - side*(wv + Math.sin(y*.05 + t*4)*10), y); c.lineTo(x0, 880); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(220,245,255,.8)'; c.lineWidth = 2; c.beginPath(); for (let y = 370; y <= 880; y += 20) c.lineTo(x0 - side*(wv + Math.sin(y*.05 + t*4)*10), y); c.stroke(); c.restore(); } }
function drawTiltScreen(B, c, w, h, k){ const s = tiltState(B, k), d = s.d*s.f;
  if (Math.abs(d) > .02){ c.save(); c.translate(w/2, h*.55); c.rotate(d*.06); c.strokeStyle = 'rgba(160,210,255,.18)'; c.lineWidth = 2; for (let i = -6; i <= 6; i++){ c.beginPath(); c.moveTo(-w, i*h/8); c.lineTo(w, i*h/8); c.stroke(); } c.restore(); }
  if (s.next && s.w > 0){ const a = .5 + .5*Math.abs(Math.sin(s.w*12)); c.save(); c.globalAlpha = a; const x = s.next > 0 ? w - 26 : 26, q = c.createLinearGradient(x, 0, s.next > 0 ? w - 90 : 90, 0); q.addColorStop(0, 'rgba(60,140,220,.6)'); q.addColorStop(1, 'rgba(60,140,220,0)'); c.fillStyle = q; c.fillRect(s.next > 0 ? w - 90 : 0, 0, 90, h); c.restore(); } }
