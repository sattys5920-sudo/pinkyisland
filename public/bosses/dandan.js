// 단단??? (단혜원 · 느린 오후 사건) 다크 보스 · 규칙은 docs/BOSS_ENGINE.md · 기획은 docs/DARK_STORY.md
// 기본 공격: 각설탕 통통 (사람 쪽으로 세 번 튀어 오는 각설탕 · 착지마다 표시)
// 1 단계 ① 졸음 향기 ② 분실물 상자 ③ 계산기 테이프 · 50% 커피 소용돌이 변신 · 2 단계 ④ 잔 치우기 ⑤ 특별히 진하게 ⑥ 식은 커피잔 밀기 · 20% ⑦ 영업 마감
// 움직일 때: 몸이 커피 김으로 흩어졌다가 다른 자리에서 다시 뭉쳐요
import { pick, beat, warnCircle, inEll, shadow, tint, darkness, text, cl, lerp, ease, dist } from './kit.js';
import { pandaArt, cubeArt, blobArt, cupArt, bigCupArt, ART_S, FOOT } from './dandan_art.js';

const P = {
  1: [{id:'sleep', len:14}, {id:'grab', len:13}, {id:'tape', len:13}],
  2: [{id:'cups', len:14}, {id:'strong', len:12}, {id:'push', len:15}],
  3: [{id:'close', len:42}],
};
const GAP = 2.5, CLOSE_T = 40;
const pk = B => pick(B, P, {gap:GAP});
const hsh = n => { const v = Math.sin(n*12.9898 + 78.233)*43758.5453; return v - Math.floor(v); };
const CREAM = '250,236,214', BROWN = '120,74,44';

// ===== 내 화면에만 있는 상태 (장식 · 내 몸 상태) =====
let L = null;
function loc(B){
  const key = `${B.r.bossAt}:${B.r.wipe | 0}`;
  if (!L || L.key !== key) L = {key, hist:[], d:0, sleepAt:0, wakeImm:0, stolen:null, boxT:0, snaps:{}, said:{}, flag:{}, push:null, cupR:null, bp:'', lastWake:0};
  return L;
}
const once = (k) => { if (L.flag[k]) return false; L.flag[k] = 1; return true; };
const sayOnce = (B, k, s, ms = 2400) => { if (!L.said[k]){ L.said[k] = 1; B.say(s, ms); } };

// ===== 보스 자리 (발) =====
const home = B => [B.hx, B.hy + 30];
const wander = t => [Math.cos(t*.42)*125 + Math.sin(t*1.07)*30, Math.sin(t*.61)*40 + Math.sin(t*1.3)*10];
const SEG = 9; // 9 초마다 김으로 흩어져 다른 자리로
function anchor(B, n){ if (n < 1) return [0, 0]; const r = B.rng(`${B.r.bossAt}.a.${n}`); return [(r() - .5)*320, (r() - .5)*140]; }
function hopOff(B, t){ const n = Math.floor(t/SEG), u = t - n*SEG, a0 = anchor(B, n - 1), a1 = anchor(B, n), k = ease(cl(u/1.3)); return [lerp(a0[0], a1[0], k), lerp(a0[1], a1[1], k)]; }
// 패턴마다 걸음 세기 [돌아다님, 김 이동]
const AMP = {sleep:[.5, 0], grab:[1, 1], tape:[.4, 0], trans:[0, 0], strong:[1, 1], push:[.2, 0], close:[1, 1]};
function baseFoot(B, t, aw, ah){ const [hx, hy] = home(B), w = wander(t), h = hopOff(B, t); return [hx + h[0]*ah + w[0]*.62*aw, hy + h[1]*ah + w[1]*aw]; }
function footAt(B, p, t){
  if (p.id === 'cups') return cupsFoot(B, p, t);
  const a = AMP[p.id] || [1, 1], r = p.id ? Math.min(cl(p.t/.8), cl((p.len - p.t)/.8)) : 0, aw = 1 + (a[0] - 1)*(p.id === 'trans' ? 1 : r), ah = 1 + (a[1] - 1)*(p.id === 'trans' ? 1 : r);
  return baseFoot(B, t, aw, ah);
}
function bossFoot(B, p = pk(B)){
  const st = B.bs.stun; if (st > B.now && st - 8000 < B.now && B.bs.sp) return B.bs.sp; if (st > B.now && st - 8000 < B.now) return footAt(B, p, B.t - (B.now - (st - 8000))/1000); // 기절: 그 자리에 멈춰요
  return footAt(B, p, B.t);
}

// ===== ④ 잔 치우기: 손님 잔 셋 · 보스가 차례로 걸어가 부어요 =====
const CUP_SPOTS = [[300, 450], [800, 450], [290, 700], [810, 700], [550, 770], [420, 580], [690, 590]];
const ARRIVE = [3.2, 7.4, 11.6], POUR = .9;
function cupsOf(B, p){
  if (L && L.cupsK === p.seed) return L.cups;
  const r = B.rng(p.seed + 'c'), s = CUP_SPOTS.map(v => [v, r()]).sort((a, b) => a[1] - b[1]).slice(0, 3).map(v => v[0]);
  const [hx, hy] = home(B), out = []; let cx = hx, cy = hy; // 가까운 잔부터
  while (s.length){ let bi = 0; s.forEach((v, i) => { if (dist(v[0], v[1], cx, cy) < dist(s[bi][0], s[bi][1], cx, cy)) bi = i; }); const v = s.splice(bi, 1)[0]; out.push(v); [cx, cy] = v; }
  if (L){ L.cupsK = p.seed; L.cups = out; } return out;
}
const standAt = c => [c[0] - 95, c[1] - 12];
function cupsFoot(B, p, t){
  const cups = cupsOf(B, p), t0 = B.t - p.t, start = baseFoot(B, t0, 1, 1), u = t - t0;
  const pts = [[0, start]]; ARRIVE.forEach((a, i) => { pts.push([a, standAt(cups[i])], [a + POUR, standAt(cups[i])]); });
  if (u >= p.len - 1.4){ const k = ease((u - (p.len - 1.4))/1.4), e = baseFoot(B, t, 1, 1), s = standAt(cups[2]); return [lerp(s[0], e[0], k), lerp(s[1], e[1], k)]; }
  for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]){ const [ta, a] = pts[i - 1], [tb, b] = pts[i], k = ease((u - ta)/Math.max(.01, tb - ta)); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; }
  return standAt(cups[2]);
}
const cupMask = (B, p) => B.bs.cups?.k === p.seed ? B.bs.cups.m | 0 : 0;
function knockCup(B, p, i){ const k = p.seed, bit = 1 << i; if (cupMask(B, p) & bit) return; if (!once(`kn.${k}.${i}`)) return;
  B.sfx('hit'); B.tx(bs => { const m = bs.cups?.k === k ? bs.cups.m | 0 : 0; if (m & bit) return undefined; return {...bs, cups:{k, m:m | bit}}; }); }

// ===== ① 졸음 향기: 커피 향 구름 =====
const CLOUDS = [[330, 520, 120, 70, .5], [780, 520, 120, 70, .62], [550, 720, 220, 40, .44], [550, 430, 200, 30, .55]];
function clouds(B, p){
  if (p.id !== 'sleep') return []; const n = B.alive.length >= 4 ? 4 : 3, a = cl(p.t/1.2)*cl((p.len - p.t)/1), out = [];
  for (let i = 0; i < n; i++){ const [x, y, ax, ay, w] = CLOUDS[i]; out.push({x:x + Math.sin(B.t*w + i*2)*ax, y:y + Math.cos(B.t*w*.8 + i)*ay, a}); }
  const f = bossFoot(B, p), fa = Math.min(cl((p.t - 5)/1), cl((9.6 - p.t)/1)); if (fa > 0) out.push({x:f[0], y:f[1] + 10, a:fa*a}); // 보스 발밑으로 한 번
  return out;
}
const CR = [100, 56];

// ===== ② 분실물 상자: 긴 손이 칼을 훔쳐 상자에 =====
const boxPos = B => B.hash(B.r.bossAt + 'box') % 2 ? [262, 420] : [838, 420];
function grabs(B, p){
  if (p.id !== 'grab' || !B.alive.length) return []; const out = [];
  for (let i = 0; ; i++){ const ts = 1.2 + i*2.3; if (ts + 1.6 > p.len) break; const r = B.rng(`${p.seed}.g${i}`), m = B.alive.length >= 4 ? 2 : 1;
    for (let j = 0; j < m; j++){ const who = B.alive[Math.floor(r()*B.alive.length)]; out.push({key:`${p.seed}.${i}.${j}`, ts, uid:who.uid}); } }
  return out;
}
function grabAim(B, gr){ // 손을 뻗기 시작한 순간 그 사람이 있던 자리 (내 화면에서 한 번 찍어 둬요)
  let s = L.snaps[gr.key]; if (s) return s; const who = B.all.find(q => q.uid === gr.uid); if (!who) return null;
  return L.snaps[gr.key] = [who.x, who.y];
}

// ===== ③ 계산기 테이프: 뱀처럼 기어 다니는 영수증 =====
const TP_N = 18, TP_GAP = .09;
function tapeHead(p, u){ const ph = hsh(p.n*3.7)*6.28; u = Math.max(0, Math.min(u, p.len - 1.6)); return [550 + Math.sin(u*.85 + ph)*330, 600 + Math.sin(u*1.7 + ph*1.3)*165]; }
function tapeBody(p){ const u = p.t - .8, pts = []; for (let k = 0; k < TP_N; k++) pts.push(tapeHead(p, u - k*TP_GAP)); return pts; }

// ===== ⑤ 특별히 진하게: 노리는 몸 위로 큰 잔 =====
const DROPS = [3.6, 9.2], SR = [110, 62];
function strongAt(B, p, i){ const key = `${p.seed}.s${i}`, st = B.bs.st; if (st && st.k === key) return {key, x:st.x, y:st.y, c:st.c, lock:true};
  const t = B.target; return t ? {key, x:t.x, y:t.y, c:null, lock:false} : null; }
function strongDmg(B, c){ const need = Math.min(3, Math.max(1, B.alive.length)); if (need <= 1) return B.lo + 100; return c >= need ? B.lo : B.lo + 200*(need - c)/(need - 1); }

// ===== ⑥ 식은 커피잔 밀기 =====
const PUSH_SPOTS = [[240, 450], [860, 450], [260, 730], [840, 730]];
const pushSpawn = (B, p) => PUSH_SPOTS[B.hash(p.seed + 'p') % 4];
function pushCup(B, p){
  const k = p.seed, s = B.bs.push && B.bs.push.k === k ? B.bs.push : null;
  if (B.host && L.push && L.push.k === k) return L.push;
  const sp = s ? [s.x, s.y] : pushSpawn(B, p); if (!L.cupR || L.cupR.k !== k) L.cupR = {k, x:sp[0], y:sp[1]};
  return {k, x:L.cupR.x, y:L.cupR.y, tx:sp[0], ty:sp[1], hit:s?.hit | 0};
}

// ===== 기본 공격: 각설탕 통통 =====
const HOP = .42, LAUNCH = .35, CUBE_R = [34, 34, 50];
function volleys(B, p){
  if (B.t < 2 || p.id === 'trans' || (p.id === 'close' && p.t > CLOSE_T)) return [];
  const bt = beat(B, 3.4), out = [], f = bossFoot(B, p);
  for (const n of [bt.n, bt.n - 1]){ const age = B.t - n*bt.len; if (age < 0 || age > LAUNCH + HOP*3 + .3) continue;
    const key = `${B.phase}.${n}`; let v = L.snaps['c' + key];
    if (!v){ if (age > LAUNCH || !B.alive.length) continue; const r = B.rng(`${B.r.bossAt}.cube.${key}`), m = B.phase === 1 || p.id === 'strong' ? 1 : Math.min(2, B.alive.length); v = [];
      for (let j = 0; j < m; j++){ const who = B.alive[Math.floor(r()*B.alive.length)], o = [f[0] - 92, f[1] + 4]; let x = who.x, y = who.y;
        if (j && v.some(q => dist(q.x, q.y, x, y) < 40)){ const a = Math.atan2(y - o[1], x - o[0]) + Math.PI/2; x += Math.cos(a)*85; y += Math.sin(a)*85*.6; }
        v.push({o, x, y}); }
      L.snaps['c' + key] = v; }
    out.push({key, age, v}); }
  return out;
}
const hopPt = (c, h) => [lerp(c.o[0], c.x, h/3), lerp(c.o[1], c.y, h/3)];

// ===== 모듈 =====
export default {
  reach: 125,
  height: 292,
  pos(B){ loc(B); return bossFoot(B); },

  tick(B, dt){
    loc(B); const p = pk(B), f = bossFoot(B, p), now = B.now, me = B.me, ctl = B.ctl;
    // 지나온 자리 (김 꼬리) · 50 ms 마다
    const bn = Math.floor(now/50), H = L.hist, last = H[H.length - 1];
    if (!last || last.n !== bn){ const v = last ? Math.min(900, dist(f[0], f[1], last.x, last.y)/Math.max(.02, (now - last.at)/1000)) : 0; H.push({n:bn, at:now, x:f[0], y:f[1], v}); while (H.length && now - H[0].at > 1400) H.shift(); }
    // 대사 · 소리 (모두 같은 때)
    const pid = p.id ? `${p.seed}` : '';
    if (p.id === 'sleep' && p.t < .5) sayOnce(B, pid, '우리 카페 의자 편하죠?');
    if (p.id === 'grab' && p.t < .5) sayOnce(B, pid, '분실물 상자가 또 꽉 찼네요.');
    if (p.id === 'tape'){ if (p.t < .5) sayOnce(B, pid, '계산은… 이쪽이에요.'); if (p.t < .8) B.sfx('warn', 600); }
    if (p.id === 'trans'){ if (p.t > 2.2) sayOnce(B, 'trans' + B.r.rageAt, `창가 자리는 ${tgNick(B)} 님 예약이에요`, 3200); if (p.t < 2) B.sfx('slam', 700); if (p.t > 1.6 && p.t < 2) B.shake(); }
    if (p.id === 'cups' && p.t < .5) sayOnce(B, pid, '손님 잔이 비었네요.');
    if (p.id === 'strong' && p.t < .5) sayOnce(B, pid, `${tgNick(B)} 님, 특별히 진하게.`);
    if (p.id === 'push' && p.t < .5) sayOnce(B, pid, '그 잔은… 치웠는데.');
    if (p.id === 'close' && p.t < .5) sayOnce(B, pid, '영업 마감이에요.');
    if (p.id === 'close' && p.t > CLOSE_T) sayOnce(B, pid + 'f', '다들 졸다 가요.');
    if (B.bs.stun > now && B.bs.push?.hit) sayOnce(B, 'stun' + B.bs.stun, '…하얀 가루?', 2000);

    hostTick(B, p, f, dt);

    const alive = me && !me.down;
    if (!alive){ L.d = 0; L.sleepAt = 0; L.boxT = 0; setBp(B); return; }
    // ① 졸음 · 잠듦 (패턴이 끝나도 깨워 줄 때까지 · 혼자면 스스로 깨요)
    if (L.sleepAt){
      const w = B.bs.wake?.[me.uid] || 0, lim = B.alive.length > 1 ? 6500 : 3500;
      if (w > L.sleepAt || now - L.sleepAt > lim){ L.sleepAt = 0; L.d = 0; L.wakeImm = now + 2000; B.fx('!', me.x, me.y - 70, '#c8ffd0'); }
      else { ctl.lock = true; ctl.noAtk = true; }
    } else {
      const inC = clouds(B, p).some(c => c.a > .45 && inEll(me.x, me.y, c.x, c.y, CR[0], CR[1]));
      L.d = cl(L.d + (inC && now > L.wakeImm ? dt/2.1 : -dt*.4));
      if (L.d >= 1){ L.sleepAt = now; B.sfx('warn'); B.fx('Zz', me.x, me.y - 70, '#d8c0ff'); }
      else if (L.d > .5) ctl.speed = 1 - (L.d - .5)*.8;
    }
    // ② 긴 손 · 칼 빼앗김 → 분실물 상자에서 되찾기
    for (const gr of grabs(B, p)){ if (p.t < gr.ts) continue; const aim = grabAim(B, gr); if (!aim) continue;
      if (p.t > gr.ts + .3 && p.t < gr.ts + .35) B.sfx('warn', 300);
      if (p.t >= gr.ts + 1.0 && p.t < gr.ts + 1.25 && once('gh' + gr.key)){ if (inEll(me.x, me.y, aim[0], aim[1], 62, 40) && !L.stolen){ L.stolen = {at:now}; B.shake(); B.sfx('slam'); } } }
    if (L.stolen){ ctl.noAtk = true; const bx = boxPos(B);
      if (inEll(me.x, me.y, bx[0], bx[1] + 30, 80, 55)) L.boxT += dt; else L.boxT = Math.max(0, L.boxT - dt);
      if (L.boxT > .6 || now - L.stolen.at > 30000){ L.stolen = null; L.boxT = 0; B.sfx('hit'); B.fx('칼 되찾음', me.x, me.y - 70, '#c8ffd0'); } }
    // ③ 테이프 몸통
    if (p.id === 'tape' && p.t > .8 && p.t < p.len - .8){ const body = tapeBody(p);
      for (const [sx, sy] of body){ const d = Math.hypot(me.x - sx, (me.y - sy)*1.3); if (d < 32){ if (B.hurt(B.lo + 40, `tp.${p.seed}.${Math.floor(p.t/1.1)}`)){ B.push(me.x - sx || 1, me.y - sy, 70); B.sfx('hit'); } break; } } }
    // ④ 붓는 순간 둘레 · 남은 수면 커피 웅덩이
    if (p.id === 'cups' || (B.phase === 2 && p.id === null)){ const pc = p.id === 'cups' ? p : null;
      if (pc){ const cups = cupsOf(B, pc), m = cupMask(B, pc); ARRIVE.forEach((a, i) => { if (m & (1 << i)) return; const c = cups[i];
        if (pc.t >= a && pc.t < a + .3 && inEll(me.x, me.y, c[0], c[1], 125, 72)){ if (B.hurt(B.lo + 120, `pour.${pc.seed}.${i}`)){ B.shake(); B.sfx('slam'); } }
        if (pc.t > a + .3 && inEll(me.x, me.y, c[0], c[1] + 8, 92, 36)){ ctl.speed = Math.min(ctl.speed ?? 1, .55); B.hurt(B.lo, `pud.${pc.seed}.${i}.${Math.floor(pc.t/2)}`); } }); } }
    // ⑤ 큰 잔: 모인 수만큼 나눠 맞아요 (호스트가 센 수)
    if (p.id === 'strong') DROPS.forEach((imp, i) => { if (p.t < imp) return; const s = strongAt(B, p, i); if (!s) return;
      let c = s.c; if (c == null && p.t > imp + 1.2) c = B.alive.filter(q => inEll(q.x, q.y, s.x, s.y, SR[0], SR[1])).length || 1;
      if (c == null || !once('sd' + s.key)) return; if (inEll(me.x, me.y, s.x, s.y, SR[0], SR[1])){ B.hurt(strongDmg(B, c), 'st' + s.key); B.shake(); } B.sfx('slam'); });
    // ⑦ 영업 마감: 시간이 다 되면 모두 크게 맞고 잠깐 잠들어요
    if (p.id === 'close' && p.t > CLOSE_T){ ctl.lock = true; ctl.noAtk = true; if (B.hurt(B.lo + 200, 'cl' + p.seed)){ B.shake(); B.sfx('slam'); } }
    // 기본 공격 · 각설탕
    for (const vl of volleys(B, p)) vl.v.forEach((c, j) => { for (let h = 1; h <= 3; h++){ const tl = LAUNCH + HOP*h; if (vl.age < tl || vl.age > tl + .12) continue; const [x, y] = hopPt(c, h), r = CUBE_R[h - 1];
      if (inEll(me.x, me.y, x, y, r, r*.55)){ if (B.hurt(h === 3 ? B.lo + 60 : B.lo, `cb.${vl.key}.${j}.${h}`)) B.sfx('hit'); }
      if (h === 3 && once(`cbs.${vl.key}.${j}`)) B.sfx('slam', 150); } });
    setBp(B);
  },

  swing(B, cx, cy){
    loc(B); const p = pk(B);
    // 잠든 친구 툭툭
    for (const q of B.all){ if (q.me || q.down || !q.bp?.z) continue; if (dist(q.x, q.y - 20, cx, cy) < 75){ wake(B, q.uid); return true; } }
    // ④ 손님 잔 엎기
    if (p.id === 'cups'){ const cups = cupsOf(B, p), m = cupMask(B, p); for (let i = 0; i < 3; i++){ if (m & (1 << i)) continue; const c = cups[i]; if (dist(c[0], c[1] - 14, cx, cy) < 58 || (B.me && dist(c[0], c[1], B.me.x, B.me.y) < 62)){ knockCup(B, p, i); return true; } } }
    return false;
  },

  tap(B, wx, wy){
    loc(B); const p = pk(B);
    for (const q of B.all){ if (q.me || q.down || !q.bp?.z) continue; if (dist(q.x, q.y - 20, wx, wy) < 50) return {x:q.x + (B.me && B.me.x < q.x ? -40 : 40), y:q.y, act:() => wake(B, q.uid)}; }
    if (p.id === 'cups'){ const cups = cupsOf(B, p), m = cupMask(B, p); for (let i = 0; i < 3; i++){ const c = cups[i]; if (!(m & (1 << i)) && dist(c[0], c[1] - 14, wx, wy) < 50) return {x:c[0], y:c[1] + 34, act:() => knockCup(B, pk(B), i)}; } }
    return null;
  },

  drawFloor(B, c){
    loc(B); const p = pk(B), f = bossFoot(B, p);
    drawTrail(B, c);
    // ② 분실물 상자 (칼이 들어 있는 동안)
    const anyStolen = !!L.stolen || B.all.some(q => q.bp?.w);
    if (p.id === 'grab' || anyStolen) drawBox(B, c, p, anyStolen);
    // ③ 테이프
    if (p.id === 'tape') drawTape(B, c, p);
    // ④ 잔 · 웅덩이
    if (p.id === 'cups') drawCups(B, c, p, f);
    // ⑤ 큰 잔 그림자 · 동그라미
    if (p.id === 'strong') DROPS.forEach((imp, i) => { const k = p.t - (imp - 3); if (k < 0 || p.t > imp + 1.4) return; const s = strongAt(B, p, i); if (!s) return;
      if (p.t < imp){ warnCircle(c, s.x, s.y, SR[0], SR[1], k/3, '255,140,80'); const n = B.alive.filter(q => inEll(q.x, q.y, s.x, s.y, SR[0], SR[1])).length; for (let j = 0; j < n; j++){ c.fillStyle = '#ffd0b0'; c.beginPath(); c.arc(s.x - (n - 1)*9 + j*18, s.y + SR[1] + 14, 5, 0, 7); c.fill(); } }
      else { const kk = p.t - imp; c.save(); c.globalAlpha = .7*(1 - kk/1.4); c.fillStyle = '#4a2810'; c.beginPath(); c.ellipse(s.x, s.y, SR[0]*cl(kk*5), SR[1]*cl(kk*5), 0, 0, 7); c.fill(); c.restore(); } });
    // ⑥ 식은 커피잔
    if (p.id === 'push' || (B.bs.stun > B.now && B.bs.push?.hit)) drawPush(B, c, p, f);
    // 각설탕 착지 표시
    for (const vl of volleys(B, p)) vl.v.forEach(cb => { for (let h = 1; h <= 3; h++){ const tl = LAUNCH + HOP*h; if (vl.age < tl - .5 || vl.age > tl + .15) continue; const [x, y] = hopPt(cb, h), r = CUBE_R[h - 1];
      c.save(); c.globalAlpha = h === 3 ? .9 : .6; c.strokeStyle = h === 3 ? '#ffd890' : '#e8d8b8'; c.lineWidth = 3; c.setLineDash([5, 4]); c.beginPath(); c.ellipse(x, y, r, r*.55, 0, 0, 7); c.stroke();
      c.setLineDash([]); c.globalAlpha = .25*cl((vl.age - tl + .5)/.5); c.fillStyle = '#fff2d0'; c.fill(); c.restore(); } });
  },

  drawBody(B, c){
    loc(B); const p = pk(B), [x, y] = bossFoot(B, p), now = B.now, half = B.phase >= 2 && !(p.id === 'trans' && p.t < 1.9), art = pandaArt(half);
    const v = L.hist.length ? L.hist[L.hist.length - 1].v : 0, hk = cl((v - 95)/55);
    let sx = 0; if (p.id === 'trans' && p.t < 2.2) sx = Math.sin(now*.07)*6*(1 - p.t/2.2); if (B.bs.stun > now) sx = Math.sin(now*.003)*6;
    const oy = y - FOOT*ART_S, ox = x + sx;
    c.save(); c.globalAlpha = 1 - .72*hk; c.drawImage(art.cv, ox - art.ox, oy - art.oy, art.cv.width*art.s, art.cv.height*art.s);
    // 쟁반 잔 김 · 주전자 줄기
    c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 1.5; for (let i = 0; i < 3; i++){ const bx = ox + (-276 + i*46)*ART_S, by = oy + 2; c.beginPath(); c.moveTo(bx, by); c.bezierCurveTo(bx - 3, by - 5, bx + 3, by - 9, bx + Math.sin(now/300 + i)*2, by - 15); c.stroke(); }
    const px = ox + 298*ART_S, py = oy - 43*ART_S; c.strokeStyle = half ? 'rgba(240,240,240,.9)' : '#5a3018'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(px, py); c.quadraticCurveTo(px + 11, py + 9, px + 10, py + 92); c.stroke();
    if (half){ c.fillStyle = '#fff'; for (let k = 0; k < 6; k++){ const yy = ((now/400 + k/6) % 1)*92; c.fillRect(px + 8 + Math.sin(k*2)*2, py + yy, 2, 2); } }
    c.restore();
    // 변신: 하얗게 번쩍
    if (p.id === 'trans' && p.t > 1.7 && p.t < 2.5){ c.save(); c.globalAlpha = (1 - (p.t - 1.7)/.8)*.8; c.fillStyle = '#ffe8d0'; c.beginPath(); c.ellipse(x, y - 140, 220, 200, 0, 0, 7); c.fill(); c.restore(); }
  },

  drawTop(B, c){
    loc(B); const p = pk(B), f = bossFoot(B, p), now = B.now;
    // ① 커피 향 구름
    for (const cd of clouds(B, p)){ const b1 = blobArt('214,160,108'), b2 = blobArt(CREAM); c.save();
      c.globalAlpha = cd.a*.5; c.strokeStyle = 'rgba(232,196,150,.8)'; c.lineWidth = 2; c.setLineDash([3, 7]); c.beginPath(); c.ellipse(cd.x, cd.y, CR[0], CR[1], 0, 0, 7); c.stroke(); c.setLineDash([]);
      for (let j = 0; j < 7; j++){ const x = cd.x + Math.cos(j + B.t*.6)*58, y = cd.y + Math.sin(j*1.7 + B.t*.5)*22 - 10; c.globalAlpha = cd.a*.6; c.drawImage(j % 2 ? b2 : b1, x - 75, y - 45, 150, 90); }
      c.globalAlpha = 1; c.restore(); for (let j = 0; j < 3; j++){ const ph = (B.t*.6 + j/3) % 1; text(c, '~', cd.x + (j - 1)*40, cd.y - 30 - ph*60, 26, `rgba(240,216,176,${cd.a*(1 - ph)})`, 'center', null); } }
    // ② 긴 손
    if (p.id === 'grab') for (const gr of grabs(B, p)){ const k = p.t - gr.ts; if (k < 0 || k > 1.6) continue; const aim = grabAim(B, gr); if (!aim) continue; const hx = f[0] - 92, hy = f[1] - 128;
      if (k < 1.0){ c.save(); c.setLineDash([8, 6]); c.strokeStyle = `rgba(255,200,120,${.4 + .4*Math.abs(Math.sin(k*12))})`; c.lineWidth = 3; c.beginPath(); c.moveTo(hx, hy); c.lineTo(aim[0], aim[1] - 30); c.stroke(); c.restore(); warnCircle(c, aim[0], aim[1], 62, 40, k, '255,190,110'); }
      else { const u = Math.sin(cl((k - 1.0)/.6)*Math.PI*.5 + Math.PI*.5), x = lerp(hx, aim[0], u), y = lerp(hy, aim[1] - 30, u); c.save(); c.strokeStyle = '#2a1a10'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo((hx + x)/2, Math.min(hy, y) - 40, x, y); c.stroke();
        c.fillStyle = '#1a1210'; c.beginPath(); c.ellipse(x, y, 17, 15, 0, 0, 7); c.fill(); c.fillStyle = '#3a3438'; for (const a of [-.6, 0, .6]){ c.beginPath(); c.arc(x + Math.cos(a - 1.57)*14, y + Math.sin(a - 1.57)*14, 5, 0, 7); c.fill(); } c.restore(); } }
    // 칼 날아가는 그림 (내가 막 빼앗겼을 때)
    if (L.stolen && now - L.stolen.at < 900 && B.me){ const u = (now - L.stolen.at)/900, bx = boxPos(B); drawSword(c, lerp(B.me.x, bx[0], u), lerp(B.me.y - 40, bx[1], u) - Math.sin(u*Math.PI)*90, u*10, 1.1); }
    // ⑤ 떨어지는 큰 잔 (주문서)
    if (p.id === 'strong') DROPS.forEach((imp, i) => { const k = p.t - (imp - 3); if (k < 0 || p.t > imp) return; const s = strongAt(B, p, i); if (!s) return; const u = cl(k/3);
      c.save(); c.globalAlpha = .35 + u*.65; c.translate(s.x, s.y - 380 + u*330); c.fillStyle = '#f4ece0'; c.fillRect(-50, -60, 100, 70); c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(25, -60, 25, 70); c.fillStyle = '#3a2010'; c.beginPath(); c.ellipse(0, -60, 50, 14, 0, 0, 7); c.fill();
      c.strokeStyle = '#f4ece0'; c.lineWidth = 8; c.beginPath(); c.arc(56, -26, 16, -1.3, 1.3); c.stroke(); c.restore();
      text(c, `손님 · ${tgNick(B)}`, s.x, s.y - 380 + u*330 - 26, 22, '#5a2a10', 'center', null); text(c, '특별히 진하게', s.x, s.y - 380 + u*330 - 8, 20, '#8a1010', 'center', null); });
    // 각설탕 (날아가는 중)
    const cb = cubeArt(); for (const vl of volleys(B, p)) vl.v.forEach(q => { const k = vl.age - LAUNCH; if (k < -LAUNCH || k > HOP*3) return;
      if (k < 0){ c.save(); c.globalAlpha = .6 + .4*Math.sin(now/40); c.drawImage(cb, q.o[0] - 12, q.o[1] - 150, 24, 24); c.restore(); return; }
      const h = Math.min(2, Math.floor(k/HOP)), u = (k - h*HOP)/HOP, a = hopPt(q, h), b = hopPt(q, h + 1), x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u) - Math.sin(u*Math.PI)*(70 - h*12) - (h === 0 ? (1 - u)*110 : 0);
      shadow(c, x, lerp(a[1], b[1], u), 12, 5, .3); c.save(); c.translate(x, y); c.rotate(k*8); c.drawImage(cb, -14, -14, 28, 28); c.restore(); });
    // 사람 머리 위: 졸음 · 잠듦 · 칼 없음
    for (const q of B.all){ if (q.down) continue; const d = q.me ? L.d : (q.bp?.d | 0)/9, z = q.me ? !!L.sleepAt : !!q.bp?.z, w = q.me ? !!L.stolen : !!q.bp?.w;
      if (d > .03 && !z){ c.fillStyle = 'rgba(10,8,20,.8)'; c.fillRect(q.x - 26, q.y - 84, 52, 7); c.fillStyle = '#c8a0ff'; c.fillRect(q.x - 26, q.y - 84, 52*d, 7); }
      if (z) for (let j = 0; j < 3; j++){ const ph = (B.t*.8 + j/3) % 1; text(c, 'Z', q.x + 16 + ph*26, q.y - 70 - ph*36, 20 + j*5, `rgba(216,192,255,${1 - ph})`); }
      if (w){ drawSword(c, q.x + 22, q.y - 66, .5, .55); c.strokeStyle = '#ff5a6a'; c.lineWidth = 3; c.beginPath(); c.arc(q.x + 22, q.y - 74, 12, 0, 7); c.moveTo(q.x + 14, q.y - 82); c.lineTo(q.x + 30, q.y - 66); c.stroke(); } }
    drawCondense(B, c, f);
  },

  drawScreen(B, c, w, h){
    loc(B); const p = pk(B);
    if (B.phase >= 2 && B.ph2 >= 0 && B.ph2 < 8) drawVortex(B, c, w, h, B.ph2);
    // 졸음: 눈꺼풀이 감겨요
    if (B.me && !B.me.down){ const [sx, sy] = B.toScreen(B.me.x, B.me.y - 30);
      if (L.sleepAt) darkness(c, w, h, .82, [[sx, sy, 70]]); else if (L.d > .35) darkness(c, w, h, (L.d - .35)*.9, [[sx, sy, 420 - L.d*260]]); }
    // ⑦ 영업 마감 셔터
    if (B.phase === 3) drawShutter(B, c, w, h, p);
  },
};

// ===== 도움 함수 =====
const tgNick = B => B.targetNick && B.targetNick !== '???' ? B.targetNick : B.target?.nick || '손님';
function setBp(B){
  const me = B.me, o = me && !me.down ? {d:Math.round(L.d*9), z:L.sleepAt ? 1 : 0, w:L.stolen ? 1 : 0} : null, s = o && (o.d || o.z || o.w) ? JSON.stringify(o) : '';
  if (s !== L.bp){ L.bp = s; B.setBp(s ? o : null); }
}
function wake(B, uid){ const now = B.now; if (now - L.lastWake < 400) return; L.lastWake = now; B.sfx('hit');
  B.tx(bs => { const w = {}; for (const k in bs.wake || {}) if (now - bs.wake[k] < 20000) w[k] = bs.wake[k]; w[uid] = now; return {...bs, wake:w}; }); }

function hostTick(B, p, f, dt){
  if (!B.host) return; const now = B.now;
  // ⑤ 떨어질 자리 고정 · 모인 수 세기
  if (p.id === 'strong') DROPS.forEach((imp, i) => { const key = `${p.seed}.s${i}`, st = B.bs.st;
    if (p.t >= imp - .5 && p.t < imp && !(st && st.k === key) && B.target && once('stl' + key)){ const t = B.target; B.tx(bs => bs.st?.k === key ? undefined : {...bs, st:{k:key, x:Math.round(t.x), y:Math.round(t.y)}}); }
    if (p.t >= imp && st && st.k === key && st.c == null && once('stc' + key)){ const n = Math.max(1, B.alive.filter(q => inEll(q.x, q.y, st.x, st.y, SR[0], SR[1])).length); B.tx(bs => bs.st?.k === key && bs.st.c == null ? {...bs, st:{...bs.st, c:n}} : undefined); } });
  // ④ 놓친 잔: 보스가 따라 마셔요 (조금 회복)
  if (p.id === 'cups'){ const m = cupMask(B, p); ARRIVE.forEach((a, i) => { if (!(m & (1 << i)) && p.t >= a + .2 && p.t < a + 1 && once(`heal.${p.seed}.${i}`)) B.heal(B.r.max*.015); }); }
  // ⑥ 다 같이 밀면 빨라져요 · 보스에 닿으면 기절 (bs.stun)
  if (p.id === 'push'){ const k = p.seed; let Hs = L.push;
    if (!Hs || Hs.k !== k){ const s = B.bs.push?.k === k ? B.bs.push : null, sp = s ? [s.x, s.y] : pushSpawn(B, p); Hs = L.push = {k, x:sp[0], y:sp[1], hit:s?.hit | 0, sent:0, sx:sp[0], sy:sp[1]}; }
    if (!Hs.hit && p.t > .8 && p.t < p.len - .5){
      const ps = B.alive.filter(q => inEll(q.x, q.y, Hs.x, Hs.y, 92, 62));
      if (ps.length){ let cx = 0, cy = 0; for (const q of ps){ cx += q.x; cy += q.y; } cx /= ps.length; cy /= ps.length; let dx = Hs.x - cx, dy = Hs.y - cy, d = Math.hypot(dx, dy);
        if (d < 6){ dx = f[0] - Hs.x; dy = f[1] - Hs.y; d = Math.hypot(dx, dy) || 1; } const sp = Math.min(170, 72 + 30*(ps.length - 1));
        Hs.x = cl(Hs.x + dx/d*sp*dt, 120, 980); Hs.y = cl(Hs.y + dy/d*sp*dt, 300, 800); }
      if (inEll(Hs.x, Hs.y, f[0], f[1], 135, 80)){ Hs.hit = 1; const x = Math.round(Hs.x), y = Math.round(Hs.y); B.tx(bs => bs.push?.k === k && bs.push.hit ? undefined : {...bs, push:{k, x, y, hit:1}, stun:now + 8000, sp:[Math.round(f[0]), Math.round(f[1])]}); }
      else if (now - Hs.sent > 350 && (Math.abs(Hs.x - Hs.sx) > 2 || Math.abs(Hs.y - Hs.sy) > 2)){ Hs.sent = now; Hs.sx = Hs.x; Hs.sy = Hs.y; const x = Math.round(Hs.x), y = Math.round(Hs.y); B.tx(bs => bs.push?.k === k && bs.push.hit ? undefined : {...bs, push:{k, x, y}}); } } }
  // ⑦ 마감 시작 체력 기록 · 시간이 다 되면 그동안 깎은 만큼의 절반 회복 (최대 5%)
  if (p.id === 'close'){ const k = p.seed;
    if (p.t < CLOSE_T && !(B.bs.cl?.k === k) && once('clw' + k)){ const hp = Math.round(B.r.hp); B.tx(bs => bs.cl?.k === k ? undefined : {...bs, cl:{k, hp0:hp}}); }
    if (p.t > CLOSE_T + .3 && B.bs.cl?.k === k && !B.bs.cl.h && once('clh' + k)){ const lost = Math.max(0, (B.bs.cl.hp0 || B.r.hp) - B.r.hp); B.heal(Math.max(B.r.max*.01, lost*.5)); B.tx(bs => bs.cl?.k === k ? {...bs, cl:{...bs.cl, h:1}} : undefined); } }
}

function drawSword(c, x, y, rot, s = 1){ c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.fillStyle = '#d8e0e8'; c.fillRect(-3, -34, 6, 34); c.fillStyle = '#8a6a3a'; c.fillRect(-10, 0, 20, 5); c.fillRect(-3, 5, 6, 12); c.restore(); }

function drawBox(B, c, p, full){ const [x, y] = boxPos(B), a = p.id === 'grab' ? cl(p.t*2)*cl((p.len - p.t)*2) : 1, al = Math.max(a, full ? 1 : 0);
  c.save(); c.globalAlpha = al; shadow(c, x, y + 32, 62, 16, .4); c.fillStyle = '#7a5434'; c.fillRect(x - 56, y - 16, 112, 48); c.fillStyle = '#5a3a20'; c.fillRect(x - 56, y - 16, 112, 10); c.strokeStyle = '#3a2412'; c.lineWidth = 2; c.strokeRect(x - 56, y - 16, 112, 48);
  c.fillStyle = '#f4e8d0'; c.fillRect(x - 30, y + 2, 60, 18); text(c, '분실물', x, y + 10, 20, '#5a2a10', 'center', null);
  // 넘치는 지갑 · 칼
  c.fillStyle = '#3a2a40'; c.fillRect(x - 46, y - 26, 22, 14); c.fillStyle = '#8a2a2a'; c.fillRect(x + 22, y - 24, 20, 12);
  if (full){ drawSword(c, x - 6, y - 14, -.3, .9); drawSword(c, x + 10, y - 12, .4, .8); const k = (B.t*2) % 1; c.strokeStyle = `rgba(255,232,170,${.8 - k*.8})`; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y + 30, 60 + k*30, 22 + k*10, 0, 0, 7); c.stroke(); }
  c.restore(); }

function drawTape(B, c, p){
  if (p.t < .8){ const [x, y] = tapeHead(p, 0); c.save(); c.globalAlpha = cl(p.t*2); c.fillStyle = '#e8dcc8'; c.beginPath(); c.ellipse(x, y - 8, 18, 18, 0, 0, 7); c.fill(); c.restore(); text(c, '찌르르륵…', x, y - 44, 26, '#fff0d0'); return; }
  const pts = tapeBody(p), al = cl((p.len - p.t)/.8); c.save(); c.globalAlpha = al; c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 28; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y + 4) : c.moveTo(x, y + 4)); c.stroke();
  c.strokeStyle = '#f6f0e4'; c.lineWidth = 26; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y - 8) : c.moveTo(x, y - 8)); c.stroke();
  c.strokeStyle = 'rgba(80,60,40,.5)'; c.lineWidth = 2; c.setLineDash([3, 9]); c.stroke(); c.setLineDash([]);
  c.font = 'bold 16px "Dongle",sans-serif'; c.fillStyle = '#5a3a20'; c.textAlign = 'center'; const LB = ['₩4,500', '₩5,000', 'No.11', 'No.13', '₩6,000'];
  pts.forEach(([x, y], i) => { if (i % 3 === 1) c.fillText(LB[i % 5], x, y - 4); });
  const [hx, hy] = pts[0]; c.fillStyle = '#e8dcc8'; c.beginPath(); c.ellipse(hx, hy - 8, 18, 18, 0, 0, 7); c.fill(); c.fillStyle = '#c03030'; c.fillRect(hx - 8, hy - 12, 16, 3); c.restore(); }

function drawCups(B, c, p, f){ const cups = cupsOf(B, p), m = cupMask(B, p), ca = cupArt();
  cups.forEach(([x, y], i) => { const kn = m & (1 << i), a = ARRIVE[i];
    if (kn){ c.save(); c.translate(x + 8, y - 4); c.rotate(1.45); c.globalAlpha = cl((p.len - p.t)); c.drawImage(ca, -32, -44, 64, 64); c.restore(); c.save(); c.globalAlpha = .5*cl(p.len - p.t); c.fillStyle = '#3a2010'; c.beginPath(); c.ellipse(x + 34, y + 6, 26, 8, 0, 0, 7); c.fill(); c.restore(); return; }
    if (p.t < a){ shadow(c, x, y + 2, 22, 7, .4); c.drawImage(ca, x - 32, y - 44, 64, 64); const k = cl((p.t - (a - 1.2))/1.2); if (k > 0) warnCircle(c, x, y, 125, 72, k, '255,150,90');
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y - 30); c.bezierCurveTo(x - 6, y - 38, x + 6, y - 46, x + Math.sin(B.t*3 + i)*3, y - 56); c.stroke(); return; }
    // 부었다: 수면 커피 웅덩이
    const u = cl((p.t - a)/.4); c.save(); c.globalAlpha = .75*cl(p.len - p.t); c.fillStyle = 'rgba(70,40,20,.9)'; c.beginPath(); c.ellipse(x, y + 8, 92*u, 36*u, 0, 0, 7); c.fill(); c.fillStyle = '#f0f0f0'; for (let j = 0; j < 7; j++){ c.beginPath(); c.ellipse(x + Math.cos(j*.9)*52*u, y + 8 + Math.sin(j*1.3)*18*u, 4, 2.5, 0, 0, 7); c.fill(); } c.restore();
    if (p.t < a + POUR){ c.save(); c.strokeStyle = 'rgba(240,236,228,.9)'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(f[0] + 120, f[1] - 140); c.quadraticCurveTo(x + 4, y - 120, x, y - 24); c.stroke(); c.restore(); }
    if (p.t < a + .6){ const k = (p.t - a)/.6; c.save(); c.globalAlpha = 1 - k; c.strokeStyle = '#c89a70'; c.lineWidth = 6; c.beginPath(); c.ellipse(x, y, 125*k, 72*k, 0, 0, 7); c.stroke(); c.restore(); } }); }

function drawPush(B, c, p, f){ const k = p.seed; let cp;
  if (p.id === 'push'){ cp = pushCup(B, p); if (!B.host || !L.push || L.push.k !== k){ const r = L.cupR; if (r){ const a = Math.min(1, B.dt*8 || .15); r.x += (cp.tx - r.x)*a; r.y += (cp.ty - r.y)*a; cp = {...cp, x:r.x, y:r.y}; } } }
  else { const s = B.bs.push; if (!s) return; cp = {x:s.x, y:s.y, hit:1}; }
  const im = bigCupArt(), sh = p.id === 'push' ? cl(p.t*2) : 1; c.save(); c.globalAlpha = sh; c.drawImage(im, cp.x - 100, cp.y - 140, 200, 180); c.restore();
  // 미는 사람 수만큼 김
  if (p.id === 'push' && !cp.hit){ const n = B.alive.filter(q => inEll(q.x, q.y, cp.x, cp.y, 92, 62)).length; for (let j = 0; j < n*3; j++){ const ph = (B.t*1.2 + j/(n*3)) % 1; c.save(); c.globalAlpha = (1 - ph)*.5; c.drawImage(blobArt(CREAM), cp.x - 40 + hsh(j)*80 - 12, cp.y - 120 - ph*60, 24, 24); c.restore(); } }
  // 부딪혀 쏟아진 하얀 가루
  if (cp.hit && B.bs.stun > B.now){ const kk = cl((B.now - (B.bs.stun - 8000))/1000); c.save(); c.fillStyle = 'rgba(70,40,20,.6)'; c.beginPath(); c.ellipse(cp.x + 50, cp.y + 4, 90*kk, 30*kk, 0, 0, 7); c.fill(); c.fillStyle = '#f6f6f6';
    for (let i = 0; i < 18; i++){ c.beginPath(); c.ellipse(cp.x + 50 + Math.cos(i*1.7)*(14 + hsh(i)*70)*kk, cp.y + 4 + Math.sin(i*1.3)*(5 + hsh(i + 9)*22)*kk, 5, 3, 0, 0, 7); c.fill(); } c.restore(); }
  if (p.id === 'push' && cp.hit && B.now - (B.bs.stun - 8000) < 900) B.shake(); }

// ===== 이동 연출: 커피 김으로 흩어졌다가 다시 뭉쳐요 =====
function drawTrail(B, c){ const H = L.hist, now = B.now, b1 = blobArt(CREAM), b2 = blobArt(BROWN);
  for (let i = 0; i < H.length; i++){ const s = H[i], age = (now - s.at)/1000; if (age > 1.3) continue; const lk = cl(s.v/60), hk = cl((s.v - 95)/55); if (lk < .05) continue; const fade = 1 - age/1.3;
    if (hk > .02) for (let k = 0; k < 3; k++){ const h1 = hsh(s.n*7 + k), h2 = hsh(s.n*13 + k*3), h3 = hsh(s.n*5 + k*11), px = s.x + (h1 - .5)*110 + Math.sin(age*3 + k)*14, py = s.y - h2*230 - age*90, r = 22 + age*46 + h3*14;
      c.globalAlpha = hk*fade*(h3 < .45 ? .42 : .5); c.drawImage(h3 < .45 ? b1 : b2, px - r, py - r, r*2, r*2); }
    const h1 = hsh(s.n*3.1), px = s.x + (h1 - .5)*70 + Math.sin(age*4 + s.n)*10, py = s.y - 30 - hsh(s.n*9.7)*140 - age*55, r = 10 + age*22;
    c.globalAlpha = lk*(1 - hk*.6)*fade*.4; c.drawImage(h1 < .5 ? b1 : b2, px - r, py - r, r*2, r*2);
    if (lk > .15 && s.n % 2 === 0){ c.globalAlpha = lk*fade*.35; c.strokeStyle = '#f2e4cc'; c.lineWidth = 2; c.beginPath(); for (let k = 0; k < 6; k++){ const yy = py + 10 - k*8, xx = px + Math.sin(k*1.2 + age*6 + s.n)*6; k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); } }
  c.globalAlpha = 1; }
function drawCondense(B, c, f){ const v = L.hist.length ? L.hist[L.hist.length - 1].v : 0, hk = cl((v - 95)/55); if (hk < .02) return; const x = f[0], y = f[1] - 120, b1 = blobArt(CREAM), b2 = blobArt(BROWN);
  c.save(); for (let j = 0; j < 18; j++){ const p = (B.t*1.3 + j/18) % 1, r = 150*(1 - p) + 8, a = j*2.4 + p*6.5, px = x + Math.cos(a)*r, py = y + Math.sin(a)*r*.55, s = 16 - p*8, al = hk*Math.sin(p*Math.PI)*.55;
    c.globalAlpha = al; c.drawImage(j % 3 ? b1 : b2, px - s, py - s, s*2, s*2); if (j % 2){ c.globalAlpha = al*.8; c.strokeStyle = '#f4e6cc'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(x, y, r, r*.55, 0, a - .5, a); c.stroke(); } }
  c.restore(); }

// ===== 50% 변신: 화면 전체가 커피를 젓듯 소용돌이 · 시계가 녹아 흘러요 · 각설탕이 와르르 =====
const vortexV = k => k < 0 || k > 7.5 ? 0 : k < 1.8 ? ease(k/1.8) : k < 3.4 ? lerp(1, .15, ease((k - 1.8)/1.6)) : k < 6 ? .15 : .15*(1 - ease((k - 6)/1.5));
let swirlCv = null;
function drawVortex(B, c, w, h, k){ const V = vortexV(k), cx = w/2, cy = h*.5, Rm = Math.hypot(w, h)/2, t = B.now/1000;
  if (V > .01){
    // 지금 화면을 빙글빙글 (고리마다 조금씩 더 돌아요)
    try { const src = c.canvas, ow = Math.max(1, src.width >> 1), oh = Math.max(1, src.height >> 1); if (!swirlCv) swirlCv = document.createElement('canvas'); if (swirlCv.width !== ow || swirlCv.height !== oh){ swirlCv.width = ow; swirlCv.height = oh; }
      const o = swirlCv.getContext('2d'); o.drawImage(src, 0, 0, ow, oh); const N = 9;
      for (let i = 0; i < N; i++){ const r = Rm*(1 - i/N), u = 1 - r/Rm, th = V*Math.pow(u + .12, 1.4)*(3.4 + k*1.4); c.save(); c.beginPath(); c.arc(cx, cy, r, 0, 7); c.clip(); c.translate(cx, cy); c.rotate(th); c.translate(-cx, -cy); c.drawImage(swirlCv, 0, 0, w, h); c.restore(); } } catch(e){}
    // 휘저어지는 크림 줄무늬
    c.save(); c.lineCap = 'round'; for (let j = 0; j < 7; j++){ c.beginPath(); for (let s = 0; s <= 40; s++){ const r = 12 + s*Rm/40, u = cl(1 - r/(Rm + 150)), a = j*Math.PI*2/7 + V*Math.pow(u, 1.4)*(4.2 + k*1.6) + t*V*1.5 + r*.004; const px = cx + Math.cos(a)*r, py = cy + Math.sin(a)*r*.8; s ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.strokeStyle = j % 2 ? `rgba(245,228,200,${.3*V})` : `rgba(90,50,24,${.38*V})`; c.lineWidth = 9 + j*2; c.stroke(); } c.restore();
    const q = c.createRadialGradient(cx, cy, 20, cx, cy, Rm); q.addColorStop(0, `rgba(60,30,10,${.45*V})`); q.addColorStop(.5, `rgba(110,64,30,${.22*V})`); q.addColorStop(1, `rgba(20,8,0,${.55*V})`); c.fillStyle = q; c.fillRect(0, 0, w, h); }
  drawClocks(c, w, h, k, V, t); drawAvalanche(c, w, h, k);
  if (k > 1.7 && k < 2.5) tint(c, w, h, '#ffe8d0', (1 - (k - 1.7)/.8)*.55); }
const CLOCKS = [[.12, .3, 44, .3], [.88, .34, 40, 1.1], [.3, .2, 30, 2.0], [.74, .58, 34, 2.7]];
function drawClocks(c, w, h, k, V, t){ if (k < .2) return; const al = cl((k - .2)*3)*cl((8 - k)/1.5), sc = Math.min(1.2, Math.min(w, h)/600);
  CLOCKS.forEach(([fx, fy, R0, ph], ci) => { const cx = fx*w, cy = fy*h, R = R0*sc, m = ease((k - .5 - ci*.15)/2.4);
    const def = (dx, dy) => { const sg = cl((dy/R + .35)/1.35), ww = 1 + .3*Math.sin(dx/R*3 + ph); return [cx + dx*(1 - m*sg*.35) + m*sg*sg*Math.sin(ph + dx*.05)*10, cy + dy + m*sg*sg*R*1.9*ww]; };
    c.save(); c.globalAlpha = al; c.beginPath(); for (let i = 0; i <= 32; i++){ const a = i/32*Math.PI*2, [px, py] = def(Math.cos(a)*R, Math.sin(a)*R); i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.fillStyle = '#efe0c0'; c.fill(); c.strokeStyle = '#a07838'; c.lineWidth = 4; c.stroke();
    c.fillStyle = '#3a2412'; for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2, [px, py] = def(Math.cos(a)*R*.8, Math.sin(a)*R*.8); c.beginPath(); c.arc(px, py, i % 3 ? 1.6 : 2.6, 0, 7); c.fill(); }
    c.strokeStyle = '#2a1408'; c.lineCap = 'round'; for (const [len, sp, lw] of [[.5, 1.2 + V*9, 4], [.75, 3 + V*24, 2.5]]){ const a = t*sp*(ci % 2 ? -1 : 1) + ph, [hx, hy] = def(Math.cos(a)*R*len, Math.sin(a)*R*len), [ox, oy] = def(0, 0); c.lineWidth = lw; c.beginPath(); c.moveTo(ox, oy); c.lineTo(hx, hy); c.stroke(); }
    for (let d = 0; d < 3; d++){ const dx = (d - 1)*R*.45, [bx, by] = def(dx, Math.sqrt(Math.max(0, R*R - dx*dx))*.98), Ld = m*(18 + hsh(ci*7 + d)*46)*sc; if (Ld < 1) continue;
      c.fillStyle = '#e6d4b0'; c.beginPath(); c.moveTo(bx - 5, by - 4); c.lineTo(bx - 2.5, by + Ld); c.arc(bx, by + Ld, 4.5, Math.PI, 0, true); c.lineTo(bx + 5, by - 4); c.fill();
      const fp = (t*.9 + hsh(ci*3 + d)) % 1; if (m > .5){ c.globalAlpha = al*(1 - fp); c.beginPath(); c.ellipse(bx, by + Ld + 6 + fp*fp*160, 3.5, 5, 0, 0, 7); c.fill(); c.globalAlpha = al; } }
    c.restore(); }); }
function drawAvalanche(c, w, h, k){ if (k < .5 || k > 5.2) return; const fadeAll = cl((5.2 - k)/1.2), cb = cubeArt(), G = h*1.3;
  c.save(); c.globalAlpha = fadeAll; for (let i = 0; i < 70; i++){ const ts = .5 + hsh(i*1.7)*1.5, a = k - ts; if (a < 0) continue; const x = hsh(i*2.3)*w, y0 = -40 - hsh(i*3.9)*160, yf = h*(.6 + hsh(i*5.1)*.36), tf = Math.sqrt((yf - y0)/G);
    let y, rot; if (a < tf){ y = y0 + G*a*a; rot = a*(6 + hsh(i)*8); } else { const b = a - tf; y = yf - Math.abs(Math.sin(b*9))*34*Math.exp(-b*4); rot = tf*(6 + hsh(i)*8) + b*2*Math.exp(-b*3); }
    const s = 24 + hsh(i*7.7)*26; c.save(); c.translate(x, y); c.rotate(rot); c.drawImage(cb, -s/2, -s/2, s, s); c.restore(); }
  c.restore(); if (k > 1.3 && k < 2.6) text(c, '와르르르르…', w*.62, h*.72, 40, `rgba(251,244,228,${cl((k - 1.3)*3)*cl((2.6 - k)*3)})`); }

// ===== ⑦ 영업 마감: 셔터가 내려와요 =====
function drawShutter(B, c, w, h, p){ let u;
  if (p.id === 'close') u = p.t < CLOSE_T ? p.t/CLOSE_T : 1; else if (p.id === null) u = 1 - cl(p.t/1.5); else return; if (u <= 0) return;
  const top = 0, sh = u*h*.27; c.save(); const q = c.createLinearGradient(0, 0, 0, sh); q.addColorStop(0, '#5a5a62'); q.addColorStop(1, '#3a3a42'); c.fillStyle = q; c.fillRect(0, top, w, sh);
  c.strokeStyle = 'rgba(20,20,26,.6)'; c.lineWidth = 3; for (let y = top + sh % 16; y < top + sh; y += 16){ c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } c.fillStyle = '#2a2a30'; c.fillRect(0, sh - 8, w, 8); c.restore();
  if (p.id === 'close' && p.t < CLOSE_T){ const left = Math.ceil(CLOSE_T - p.t), s = `영업 마감 0:${String(left).padStart(2, '0')}`; c.save(); c.fillStyle = 'rgba(30,14,6,.92)'; c.beginPath(); c.roundRect(w/2 - 80, sh + 4, 160, 40, 8); c.fill(); c.strokeStyle = left <= 5 ? '#ff6a6a' : '#d8b890'; c.lineWidth = 2; c.stroke(); c.restore();
    text(c, s, w/2, sh + 25, 30, left <= 5 ? '#ff9a9a' : '#fff0d0'); if (left <= 5) B.sfx('warn', 1000); }
  if (p.id === 'close' && p.t >= CLOSE_T) tint(c, w, h, '#120804', .55*cl((p.t - CLOSE_T)*3)); }
