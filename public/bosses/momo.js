// 모모??? (모정민 · 4 월 16 일 새벽 골목길 뺑소니) 다크 보스
// 기본 공격: 크림 폭탄 (십자로 터짐)
// 1 단계: ① 새벽 배달 · ② 골목길로 유인 · ③ 하늘색 페인트 → 50% 비디오 되감기 변신 → 2 단계: ④ 되감기 · ⑤ 마지막 배달 · ⑥ 생일 케이크 쌓기 → 20%: ⑦ 수레와 호랑이
// 움직일 때: 붉은 바퀴 자국 · 크림 자국 · 바퀴 불꽃 · 끼익
import { pick, beat, warnCircle, warnRect, inEll, shadow, tint, text, cl, lerp, ease, dist } from './kit.js';
import { sprite, BOX, FOOT_FULL, FOOT_TIGER, FRAMES } from './momo_art.js';

const S = .32, Q = .64; // 그림 1 단위 = 0.32 월드 px (캐시는 2 배로 또렷하게)
const PAT = { 1:[{id:'race', len:11}, {id:'lure', len:13}, {id:'paint', len:12}], 2:[{id:'rew', len:12.5}, {id:'dlv', len:12}, {id:'cake', len:16}], 3:[{id:'split', len:17}] };
const GAP = 2.5, TRANS = 5;
const LV = {race:1, lure:1, paint:.4, rew:.3, dlv:.35, cake:.25, split:0, trans:0};
const l2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const hsh = n => { const s = Math.sin(n*127.1 + 311.7)*43758.5453; return s - Math.floor(s); };
const fnt = s => `bold ${s}px "Dongle",sans-serif`;

// ---------- 내 화면에만 있는 기록 (흔적 · 되감기 · 한 번만 하기) ----------
let L = null;
function loc(B){ const key = `${B.r.bossAt}.${B.r.wipe | 0}`; if (!L || L.key !== key) L = {key, once:new Set(), hist:[], bh:[], oh:new Map(), cb:{}, rw:{}, pend:{t:0, c:0, bell:0, bs:''}, txT:0, hostT:0, travel:0, sq:null, sqW:-1}; return L; }
function once(B, k){ const l = loc(B); if (l.once.has(k)) return false; l.once.add(k); if (l.once.size > 600){ const a = [...l.once].slice(-300); l.once = new Set(a); } return true; }
const sayOnce = (B, k, s, ms = 2600) => { if (once(B, 'say.' + k)) B.say(s, ms); };

// ---------- 차례 ----------
const P_ = B => B._mp || (B._mp = pick(B, PAT, {gap:GAP, trans:TRANS}));
const t0Abs = (B, p) => B.now - p.t*1000;
const nAlive = B => Math.max(1, B.alive.length);
const stunned = B => B.bs.stun > B.now;
function amp(p){ if (!p.id) return 1; const lv = LV[p.id] ?? 1, k = Math.min(cl(p.t/.6), cl((p.len - p.t)/.6)); return 1 - k*(1 - lv); }
const wand = (B, a) => { const t = B.t; return [B.hx + (Math.cos(t*.42)*125 + Math.sin(t*1.07)*30)*a, B.hy + (Math.sin(t*.61)*44 + Math.sin(t*1.3)*10)*a]; };

// ① 새벽 배달: 바깥 둘레를 달려요
const RC = [550, 645], RRX = 360, RRY = 185, RW = 1.05, RPRE = 1.2, RRUN = 9;
const racePt = a => [RC[0] + Math.cos(a)*RRX, RC[1] + Math.sin(a)*RRY];
const raceDir = (B, p) => B.rng(p.seed + 'rd')() < .5 ? 1 : -1;
function racePos(B, p, w){ const d = raceDir(B, p), a0 = Math.PI/2, t = p.t;
  if (t < RPRE) return l2(w, racePt(a0), ease(t/RPRE));
  if (t < RPRE + RRUN) return racePt(a0 + d*(t - RPRE)*RW);
  return l2(racePt(a0 + d*RRUN*RW), w, ease((t - RPRE - RRUN)/.8)); }
const raceRun = p => p.id === 'race' && p.t > RPRE && p.t < RPRE + RRUN;

// ② 골목길로 유인: 쫓는 사람 (호스트가 0.6 초마다 길을 적어요) · 골목길에 들어가면 얼어붙어요
const LU_SP = 135, LU_A = .8, LU_E = 8.8, LU_END = 12.2;
const luSide = (B, p) => B.rng(p.seed + 'ls')() < .5 ? -1 : 1;
const zone = side => side < 0 ? [170, 410, 330, 880] : [770, 410, 930, 880]; // x0 y0 x1 y1
const inZone = (x, y, side) => { const z = zone(side); return x > z[0] && x < z[2] && y > z[1] && y < z[3]; };
const luOf = (B, p) => { const u = B.bs.lu; return u && u.s === p.seed ? u : null; };
function lurePt(u, now){ if (u.fz && now >= u.fz) return [u.fx, u.fy]; const tt = Math.min(now, u.te), d = dist(u.x0, u.y0, u.gx, u.gy), s = Math.max(0, Math.min(d - 40, LU_SP*(tt - u.t0)/1000)); return d > 1 ? [u.x0 + (u.gx - u.x0)/d*s, u.y0 + (u.gy - u.y0)/d*s] : [u.x0, u.y0]; }
function lurePos(B, p, w){ const u = luOf(B, p); if (!u) return w; if (p.t < LU_END) return lurePt(u, B.now); return l2(lurePt(u, t0Abs(B, p) + LU_END*1000), w, ease((p.t - LU_END)/.8)); }
const frozen = (B, p) => { if (p.id !== 'lure') return false; const u = luOf(B, p); return !!(u && u.fz && B.now >= u.fz && p.t < LU_END); };

// ③ 하늘색 페인트: 칸칸이 번져요
const GX0 = 180, GW = 106, GY0 = 420, GH = 105;
const PORD = [[0, 0], [6, 0], [0, 3], [6, 3], [1, 0], [5, 0], [0, 1], [6, 1], [0, 2], [6, 2], [1, 3], [5, 3], [2, 3], [4, 3], [1, 1], [5, 1], [3, 3], [1, 2], [5, 2]];
const PT0 = 1.0, PDT = .34, PEND = .7;
function paintTiles(B, p){ const r = B.rng(p.seed + 'pf'), fx = r() < .5, fy = r() < .5; return PORD.map(([x, y]) => [fx ? 6 - x : x, fy ? 3 - y : y]); }

// ④ 되감기
const RK = [2.6, 6.2, 9.8], RBOOM = .85;
// ⑤ 마지막 배달
const DL0 = 1.2, DL1 = 11;
const dlOf = (B, p) => { const d = B.bs.dl; return d && d.s === p.seed ? d : null; };
const bellAt = ([x, y]) => [x + 214*S, y - (FOOT_FULL - 110)*S];
// ⑥ 생일 케이크
const CK = [550, 795], CKA = 150;
const ckOf = (B, p) => { const d = B.bs.ck; return d && d.s === p.seed ? d : null; };
const ckOff = (B, d) => { const tau = (B.now - d.at)/1000 - .45; if (tau < 0) return CKA; return CKA*Math.cos((2 + .3*d.k)*tau); };
const ckNeed = B => 5 + Math.min(2, nAlive(B) - 1);
// ⑦ 수레와 호랑이
const SP_A = 1, SP_E = 15.5, SP_J = 16.9;
const s7Of = (B, p) => { const s = B.bs.s7; return s && s.s === p.seed ? s : null; };
const s7Need = B => 3 + Math.min(5, nAlive(B));
const s7Win = B => nAlive(B) >= 2 ? 4500 : 8000;
function splitPos(B, p, w){ const m = B.rng(p.seed + 'sm')() < .5 ? 1 : -1, Tc = [550 - 230*m, 600], Cc = [550 + 230*m, 665];
  const Tl = t => [Tc[0] + Math.cos(t*.7)*40, Tc[1] + Math.sin(t*.9)*22], Cl = t => { const a = Math.PI/2 + (t - SP_A)*.9*m; return [Cc[0] + Math.cos(a)*110, Cc[1] + Math.sin(a)*55]; };
  const s = s7Of(B, p), t = p.t;
  if (s && s.ok){ const k = (s.ok - t0Abs(B, p))/1000; return {T:w, C:w, joined:true, ok:s.ok, okC:k < SP_A ? l2(w, Cl(SP_A), ease(k)) : k < SP_E ? Cl(k) : Cl(SP_E)}; }
  if (t < SP_A){ const u = ease(t/SP_A); return {T:l2(w, Tl(SP_A), u), C:l2(w, Cl(SP_A), u), hop:Math.sin(Math.PI*t/SP_A)*90}; }
  if (t < SP_E) return {T:Tl(t), C:Cl(t), live:true};
  const u = ease((t - SP_E)/(SP_J - SP_E)); return {T:l2(Tl(SP_E), w, u), C:l2(Cl(SP_E), w, u), joined:t >= SP_J}; }
const splitOn = (B, p) => p.id === 'split' && !(p.t >= SP_J);

// ---------- 보스 자리 ----------
function basePos(B){ const p = P_(B), w = wand(B, amp(p));
  if (p.id === 'race') return racePos(B, p, w);
  if (p.id === 'lure') return lurePos(B, p, w);
  if (p.id === 'split') return splitPos(B, p, w).T;
  return w; }
function pos(B){ if (B._pos) return B._pos; let q = basePos(B); const bs = B.bs;
  if (bs.sp && bs.stun && B.now < bs.stun + 1000) q = B.now < bs.stun ? bs.sp : l2(bs.sp, q, ease((B.now - bs.stun)/1000));
  return (B._pos = q); }
const cartPos = B => { const p = P_(B); if (p.id === 'split' && !stunned(B)){ const sp = splitPos(B, p, wand(B, amp(p))); if (!sp.joined) return sp.C; } return pos(B); };

// ---------- 크림 폭탄 (기본 공격 · 십자) ----------
const ARM = 135, ARMW = 34, CBW = .9;
const inCross = (px, py, x, y) => { const dx = Math.abs(px - x), dy = Math.abs(py - y); return (dx < ARM && dy < ARMW*.6) || (dy < ARM*.55 && dx < ARMW); };
const cbBeat = B => beat(B, 3.4);
const cbOff = B => (B.phase === 2 && B.ph2 < TRANS) || stunned(B);
function cbTick(B){ const l = loc(B), b = cbBeat(B), me = B.me; if (cbOff(B)) return;
  let e = l.cb[b.n];
  if (!e && b.t < CBW - .25){ const al = B.alive; if (!al.length) return; const r = B.rng(`cb.${B.r.bossAt}.${b.n}`), cnt = Math.min(al.length, 1 + Math.floor(al.length/3)), i0 = Math.floor(r()*al.length), st = Math.max(1, Math.floor(al.length/cnt));
    e = l.cb[b.n] = {o:pos(B), pts:[]}; for (let j = 0; j < cnt; j++){ const q = al[(i0 + j*st) % al.length]; e.pts.push([q.x + (r() - .5)*40, q.y + (r() - .5)*20, !!q.me]); }
    for (const k in l.cb) if (+k < b.n - 3) delete l.cb[k]; }
  if (e && b.t >= CBW && !e.done){ e.done = true; if (b.t < CBW + .35 && me && !me.down){ if (e.pts.some(q => inCross(me.x, me.y, q[0], q[1]))){ B.hurt(B.lo + 40, `cb.${B.r.bossAt}.${b.n}`); B.shake(); } if (e.pts.some(q => dist(me.x, me.y, q[0], q[1]) < 320)) B.sfx('slam', 500); } } }
function plus(c, x, y, a, w){ const h = w*.6, v = a*.55; c.beginPath(); c.moveTo(x - a, y - h); c.lineTo(x - w, y - h); c.lineTo(x - w, y - v); c.lineTo(x + w, y - v); c.lineTo(x + w, y - h); c.lineTo(x + a, y - h); c.lineTo(x + a, y + h); c.lineTo(x + w, y + h); c.lineTo(x + w, y + v); c.lineTo(x - w, y + v); c.lineTo(x - w, y + h); c.lineTo(x - a, y + h); c.closePath(); }
function drawCross(c, x, y, k){ // k: 0 ~ 1 예고 · 1 ~ 터진 뒤 (1.6 까지 크림이 남아요)
  c.save();
  if (k < 1){ plus(c, x, y, ARM, ARMW); c.globalAlpha = .12 + .25*k; c.fillStyle = '#ffc8dc'; c.fill(); c.globalAlpha = .5 + .45*Math.abs(Math.sin(k*16)); c.strokeStyle = '#ffd0e0'; c.lineWidth = 3; c.setLineDash([7, 5]); c.stroke(); c.setLineDash([]);
    c.globalAlpha = .55; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, y, 10*k + 2, 5*k + 1, 0, 0, 7); c.fill(); }
  else { const a = cl((1.6 - k)/.6); c.globalAlpha = .85*a; c.fillStyle = '#fff4f6'; plus(c, x, y, ARM*(k < 1.08 ? .7 + (k - 1)*3.75 : 1), ARMW*.9); c.fill(); c.fillStyle = '#ffd6e2'; c.globalAlpha = .6*a; for (let i = 0; i < 5; i++){ const q = hsh(x + y + i); c.beginPath(); c.ellipse(x + (q - .5)*ARM*1.6, y + (hsh(i + x) - .5)*ARM*.6, 7, 4, 0, 0, 7); c.fill(); }
    if (k < 1.35){ c.globalAlpha = 1 - (k - 1)/.35; text(c, '철퍽', x + 50, y - 34 - (k - 1)*40, 22, '#ffe0ec'); } }
  c.restore(); }
function drawBalls(c, o, pts, k){ if (k < .5 || k >= CBW) return; const u = (k - .5)/(CBW - .5); c.save(); for (const q of pts){ const x = lerp(o[0], q[0], u), y = lerp(o[1], q[1], u) - Math.sin(u*Math.PI)*120; c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(lerp(o[0], q[0], u), lerp(o[1], q[1], u), 10, 4, 0, 0, 7); c.fill();
    const gr = c.createRadialGradient(x - 4, y - 5, 2, x, y, 15); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#ffc0d4'); c.fillStyle = gr; c.beginPath(); c.arc(x, y, 14, 0, 7); c.fill(); } c.restore(); }

// ---------- 흔적 (움직일 때) ----------
function recBoss(B){ const l = loc(B), now = B.now, [x, y] = cartPos(B), h = l.bh, last = h[h.length - 1];
  if (!last || now - last[0] >= 33){ if (last){ const d = dist(x, y, last[1], last[2]); l.travel += d; } h.push([now, x, y]); }
  while (h.length && now - h[0][0] > 3000) h.shift();
  // 끼익: 빠르거나 휙 꺾일 때
  const W = Math.floor(now/500); if (W !== l.sqW && h.length > 6){ l.sqW = W; const a = h[h.length - 1], b = h[h.length - 4], c0 = h[h.length - 7], v1 = [(a[1] - b[1])/(a[0] - b[0] || 1)*1000, (a[2] - b[2])/(a[0] - b[0] || 1)*1000], v0 = [(b[1] - c0[1])/(b[0] - c0[0] || 1)*1000, (b[2] - c0[2])/(b[0] - c0[0] || 1)*1000], sp = Math.hypot(...v1);
    let tr = 0; if (sp > 80 && Math.hypot(...v0) > 80){ let d = Math.atan2(v1[1], v1[0]) - Math.atan2(v0[1], v0[0]); d = Math.atan2(Math.sin(d), Math.cos(d)); tr = Math.abs(d)/((a[0] - c0[0])/2000 || .1); }
    if (((tr > 2.2 && sp > 110) || sp > 330) && hsh(W) < .8){ l.sq = {at:now, side:hsh(W + 9) < .5 ? -1 : 1, sp}; B.sfx('slam', 2600); } } }
function velAt(h, i){ const a = h[Math.max(0, i - 1)], b = h[i]; const dt = (b[0] - a[0]) || 33; return [(b[1] - a[1])/dt*1000, (b[2] - a[2])/dt*1000]; }
const WX = 120*S, WY = (FOOT_FULL - 340 - 54)*S; // 바퀴 닿는 자리 (발에서)
function drawSkids(B, c){ const l = loc(B), h = l.bh, now = B.now; if (h.length < 2) return;
  c.save(); c.lineCap = 'round';
  const buckets = [[], [], [], [], []];
  for (let i = 1; i < h.length; i++){ const v = velAt(h, i), sp = Math.hypot(...v), k = cl((sp - 30)/260); if (k < .03) continue; const age = cl((now - h[i][0])/3000), al = (1 - age)*(1 - age)*cl(k*1.6), bi = Math.min(4, Math.floor(al*5)); if (al < .04) continue; buckets[bi].push(i); }
  buckets.forEach((list, bi) => { if (!list.length) return; c.strokeStyle = `rgba(110,8,20,${.14 + bi*.13})`; c.lineWidth = 6; c.beginPath(); for (const i of list){ const a = h[i - 1], b = h[i]; for (const s of [-1, 1]){ c.moveTo(a[1] + s*WX, a[2] - WY); c.lineTo(b[1] + s*WX, b[2] - WY); } } c.stroke(); });
  // 번진 크림
  for (let i = 1; i < h.length; i++){ const n = Math.floor(h[i][0]/33), v = velAt(h, i), sp = Math.hypot(...v), k = cl((sp - 30)/260); if (k < .12 || hsh(n) > .2*k) continue; const age = cl((now - h[i][0])/3000), al = (1 - age)*(1 - age), a = Math.atan2(v[1], v[0]), L0 = 16 + 26*k;
    c.save(); c.translate(h[i][1] + (hsh(n + 3) - .5)*60, h[i][2] - WY + (hsh(n + 5) - .5)*16); c.rotate(a); c.globalAlpha = .55*al; c.fillStyle = 'rgba(255,214,226,.95)'; c.beginPath(); c.ellipse(0, 0, L0, 6, 0, 0, 7); c.fill(); c.fillStyle = '#fff8fa'; c.beginPath(); c.ellipse(L0*.25, -1, L0*.55, 3.5, 0, 0, 7); c.fill(); for (let j = 0; j < 3; j++){ c.beginPath(); c.ellipse(-L0 - 6 - j*9, (hsh(n + j) - .5)*8, 4 - j, 2.5 - j*.6, 0, 0, 7); c.fill(); } c.restore(); }
  c.restore(); }
function drawSparks(B, c){ const l = loc(B), h = l.bh, now = B.now; if (h.length < 3) return; c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = Math.max(1, h.length - 14); i < h.length; i++){ const s = h[i], age = (now - s[0])/1000, v = velAt(h, i), sp = Math.hypot(...v) || 1, k = cl((sp - 30)/260); if (k < .3) continue; const cnt = Math.round((k - .2)*7), ux = v[0]/sp, uy = v[1]/sp, n = Math.floor(s[0]/33);
    for (let j = 0; j < cnt; j++){ const r1 = hsh(n*13 + j), r2 = hsh(n*7 + j*31), r3 = hsh(n*3 + j*17), life = .22 + r3*.24; if (age > life) continue; const wx = s[1] + (j % 2 ? WX : -WX), wy = s[2] - WY;
      const vx = -ux*(140 + r1*240) + (r2 - .5)*220, vy = -uy*(140 + r1*240)*.5 - 160 - r2*170, x = wx + vx*age, y = wy - 6 + vy*age + 900*age*age, a = 1 - age/life;
      c.strokeStyle = `rgba(255,${130 + (r3*100 | 0)},40,${a})`; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x - vx*.035, y - (vy + 1800*age)*.035); c.lineTo(x, y); c.stroke(); } }
  const v = velAt(h, h.length - 1), k = cl((Math.hypot(...v) - 30)/260), [cx, cy] = [h[h.length - 1][1], h[h.length - 1][2]];
  if (k > .3) for (const s of [-1, 1]){ const x = cx + s*WX, y = cy - WY, q = c.createRadialGradient(x, y, 0, x, y, 30); q.addColorStop(0, `rgba(255,170,60,${.45*k})`); q.addColorStop(1, 'rgba(255,120,40,0)'); c.fillStyle = q; c.fillRect(x - 30, y - 30, 60, 60); }
  c.restore();
  const sq = l.sq; if (sq && now - sq.at < 450){ const kk = (now - sq.at)/1000, [x, y] = cartPos(B), sz = (24 + 10*cl((sq.sp - 200)/300))*(1 + .5*cl(1 - kk/.12));
    c.save(); c.globalAlpha = 1 - kk/.45; c.translate(x + sq.side*(WX + 54 + kk*40), y - 30 - kk*24); c.rotate(sq.side*.18); text(c, '끼익', 0, 0, sz, '#ffd9a0'); c.restore(); } }

// ---------- 50% 변신: 낡은 비디오테이프 되감기 ----------
const vhsI = k => k < .4 || k > 3.5 ? 0 : k < .9 ? (k - .4)/.5 : k < 2.4 ? 1 : 1 - (k - 2.4)/1.1;
let NZ = null, SL = null, ALLEY = null;
function noiseCv(){ if (NZ) return NZ; NZ = document.createElement('canvas'); NZ.width = 160; NZ.height = 40; const g = NZ.getContext('2d'); for (let y = 0; y < 40; y++) for (let x = 0; x < 160; x += 2){ const r = hsh(x*7.3 + y*91.1); if (r < .35) continue; const v = 120 + (r*135 | 0); g.fillStyle = `rgba(${v},${v},${v},${r})`; g.fillRect(x, y, 2, 1); } return NZ; }
function scanPat(c){ if (!SL){ SL = document.createElement('canvas'); SL.width = 2; SL.height = 3; const g = SL.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 2, 1); } return c.createPattern(SL, 'repeat'); }
function alleyCv(){ if (ALLEY) return ALLEY; const W = 1100, H = 900; ALLEY = document.createElement('canvas'); ALLEY.width = 550; ALLEY.height = 450; const g = ALLEY.getContext('2d'); g.scale(.5, .5);
  g.fillStyle = '#04050a'; g.fillRect(0, 0, W, H); let q = g.createLinearGradient(0, 0, 0, 480); q.addColorStop(0, '#080a14'); q.addColorStop(1, '#121624'); g.fillStyle = q; g.fillRect(170, 0, W - 340, 480);
  g.strokeStyle = 'rgba(70,80,110,.22)'; g.lineWidth = 1.5; for (let r = 0, y = 14; y < 480; y += 26, r++){ g.beginPath(); g.moveTo(170, y); g.lineTo(W - 170, y); g.stroke(); for (let x = 170 + (r % 2)*30; x < W - 170; x += 60){ g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 26); g.stroke(); } }
  for (const s of [-1, 1]){ const x0 = s < 0 ? 0 : W, x1 = s < 0 ? 170 : W - 170; q = g.createLinearGradient(x0, 0, x1, 0); q.addColorStop(0, '#020208'); q.addColorStop(1, '#0a0c16'); g.fillStyle = q; g.beginPath(); g.moveTo(x0, -10); g.lineTo(x1, 0); g.lineTo(x1, 480); g.lineTo(x0, H); g.closePath(); g.fill(); }
  q = g.createLinearGradient(0, 480, 0, H); q.addColorStop(0, '#0e1220'); q.addColorStop(1, '#020306'); g.fillStyle = q; g.beginPath(); g.moveTo(170, 480); g.lineTo(W - 170, 480); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
  const LX = 740, LY = 170; g.fillStyle = '#1a1c24'; g.fillRect(LX + 36, LY - 6, 8, 480 - LY + 6); g.fillRect(LX, LY - 8, 44, 6); g.fillStyle = '#ffdc96'; g.beginPath(); g.ellipse(LX, LY + 4, 9, 5, 0, 0, 7); g.fill();
  g.globalCompositeOperation = 'lighter'; q = g.createLinearGradient(0, LY, 0, 660); q.addColorStop(0, 'rgba(255,190,110,.26)'); q.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(LX - 12, LY + 6); g.lineTo(LX + 12, LY + 6); g.lineTo(LX + 190, 660); g.lineTo(LX - 190, 660); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,180,100,.16)'; g.beginPath(); g.ellipse(LX, 640, 210, 46, 0, 0, 7); g.fill();
  for (let i = 0; i < 7; i++){ const px = 220 + hsh(i*3)*660, py = 560 + hsh(i*3 + 1)*300, rx = 50 + hsh(i*3 + 2)*90; g.fillStyle = 'rgba(110,140,210,.10)'; g.beginPath(); g.ellipse(px, py, rx, rx*.18, 0, 0, 7); g.fill(); }
  g.globalCompositeOperation = 'source-over'; g.font = fnt(30); g.textAlign = 'center'; g.fillStyle = 'rgba(200,190,170,.35)'; g.fillText('AM 05:50', 300, 120);
  return ALLEY; }
function vhs(B, c, w, h, I, k, words = true){ const cv = c.canvas, f = Math.floor(B.now/42), dpr = cv.width/Math.max(1, w);
  if (I > 0){
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const n = Math.round(3 + 9*I); for (let i = 0; i < n; i++){ const y = Math.floor(hsh(f*5 + i)*cv.height), hh = Math.max(2, Math.floor((6 + hsh(f*7 + i)*50)*dpr)), dx = Math.round((hsh(f*11 + i) - .5)*90*I*dpr); try { c.drawImage(cv, 0, y, cv.width, Math.min(hh, cv.height - y), dx, y, cv.width, Math.min(hh, cv.height - y)); } catch(e){} } c.restore();
    tint(c, w, h, 'rgb(40,0,60)', .2*I);
    const nz = noiseCv(); for (let b = 0; b < 2; b++){ const bh = 30 + 70*I, y = ((B.now/1000*(320 + b*170) + b*400) % (h + bh*2)) - bh; c.save(); c.globalAlpha = .55*I; c.drawImage(nz, (hsh(f + b) - .5)*60, (hsh(f*3 + b))*30*0, 160, 40, -40, y, w + 80, bh); c.restore(); c.fillStyle = `rgba(255,255,255,${.12*I})`; c.fillRect(0, y + bh*.4, w, 4); }
    c.fillStyle = `rgba(255,255,255,${.5*I})`; for (let i = 0; i < 3 + Math.round(4*I); i++){ const y = hsh(f*17 + i)*h; for (let x = 0; x < w;){ const ww = 20 + hsh(f + x + i)*140; if (hsh(f*3 + x + i) > .3) c.fillRect(x, y, ww, 2); x += ww; } }
    c.save(); c.globalAlpha = .1 + .12*I; c.fillStyle = scanPat(c); c.fillRect(0, 0, w, h); c.restore();
    c.save(); c.globalAlpha = .7*I; c.drawImage(nz, 0, 0, 160, 20, 0, h - 22, w, 22); c.restore();
    if (!words) return; const fs = Math.min(64, w*.13); c.save(); c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    if (k < 2.6){ c.globalAlpha = cl(I*1.4); if (I > .85 || Math.floor(B.now/333) % 2 === 0){ const s = '◀◀ 05:40', x = w*.06 + Math.sin(B.now/20)*3*I, y = h*.36; c.font = `bold ${fs}px monospace`; c.fillStyle = 'rgba(255,40,80,.7)'; c.fillText(s, x + 4, y); c.fillStyle = 'rgba(40,220,255,.7)'; c.fillText(s, x - 4, y + 1); c.fillStyle = '#f4f4f0'; c.fillText(s, x, y); }
      c.font = `bold ${Math.round(fs*.32)}px monospace`; c.fillStyle = '#f4f4f0'; c.fillText(`REW  SP   AM 05:40:${String(59 - (Math.floor(k*14) % 60)).padStart(2, '0')}`, w*.06, h*.36 + fs*.6); c.textAlign = 'right'; c.fillText('TRACKING ▒▒▒░░', w - 16, h - 34); }
    else { c.globalAlpha = cl(1 - (k - 2.6)/.9); c.font = `bold ${Math.round(fs*.45)}px monospace`; c.fillStyle = '#f4f4f0'; c.fillText('▶ PLAY   AM 05:40', w*.06, h*.36); }
    c.restore(); } }
function trackLine(B, c, w, h, a){ const cv = c.canvas, dpr = cv.width/Math.max(1, w), P = 4.7, ph = (B.now/1000) % P, cyc = Math.floor(B.now/1000/P); if (ph > .35) return; const y = lerp(h*hsh(cyc), h*hsh(cyc) + 120, ph/.35), f = Math.floor(B.now/42);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const Y = Math.floor(y*dpr), HH = Math.floor(14*dpr); if (Y > 0 && Y + HH < cv.height) try { c.drawImage(cv, 0, Y, cv.width, HH, Math.round((hsh(f) - .5)*24*dpr), Y, cv.width, HH); } catch(e){} c.restore();
  c.save(); c.globalAlpha = .35*a; c.drawImage(noiseCv(), 0, 0, 160, 12, 0, y, w, 12); c.restore(); }

// ---------- 보스 그리기 ----------
const halfNow = B => B.phase >= 3 || (B.phase === 2 && (B.ph2 >= 1.9 || (B.ph2 > 1.3 && hsh(Math.floor(B.now/60)) < .5)));
function blit(c, kind, half, x, y, a = 1, rot = 0){ const fr = Math.floor((L ? L.travel : 0)/14) % FRAMES, cv = sprite(kind, half, fr, Q), fy = kind === 'tiger' ? FOOT_TIGER : FOOT_FULL;
  c.save(); if (a < 1) c.globalAlpha = a; c.translate(x, y); if (rot) c.rotate(rot); c.drawImage(cv, BOX.x0*S, (BOX.y0 - fy)*S, BOX.w*S, BOX.h*S); c.restore(); }
function shakeX(B){ let s = 0; if (B.phase === 2 && B.ph2 < 2.2) s += Math.sin(B.now*.07)*6*(1 - B.ph2/2.2); const p = P_(B); if (stunned(B) || frozen(B, p)) s += Math.sin(B.now/45)*3; return s; }
function drawBoss(B, c){ const p = P_(B), half = halfNow(B), [x, y] = pos(B), sx = shakeX(B);
  if (p.id === 'split' && !stunned(B)){ const sp = splitPos(B, p, wand(B, amp(p))), s = s7Of(B, p);
    if (sp.joined && !sp.ok){ blit(c, 'full', true, x + sx, y); return; }
    if (sp.ok){ const k = (B.now - sp.ok)/700; if (k < 1){ const cp = l2(sp.okC, [x, y], ease(k)); blit(c, 'cart', true, cp[0], cp[1]); blit(c, 'tiger', true, x, y - (FOOT_FULL - FOOT_TIGER)*S*ease(k)); return; } blit(c, 'full', true, x + sx, y); return; }
    const C = sp.C, tdn = s && s.td, cdn = s && s.cd;
    blit(c, 'cart', true, C[0] + (cdn ? Math.sin(B.now/40)*2 : 0), C[1], cdn ? .55 : 1, cdn ? .12 : 0);
    shadow(c, x, y, 50, 16, .3); blit(c, 'tiger', true, x, y - (sp.hop || 0), tdn ? .55 : 1, tdn ? -.35 : 0);
    if (tdn || cdn){ const q = tdn ? [x, y] : C; text(c, '…', q[0] + 40, q[1] - 120, 30, '#cfd8ff'); }
    return; }
  if (p.id === 'cake' && stunned(B)){ blit(c, 'full', half, x + sx, y, 1, Math.sin(B.now/400)*.04); return; }
  blit(c, 'full', half, x + sx, y);
  if (frozen(B, p)){ for (let i = 0; i < 6; i++){ c.fillStyle = 'rgba(180,210,255,.85)'; c.beginPath(); c.ellipse(x - 60 + i*24, y - 150 + Math.sin(B.now/50 + i)*3, 3, 6, 0, 0, 7); c.fill(); } }
  if (B.phase === 2 && B.ph2 > 1.7 && B.ph2 < 2.5){ c.save(); c.globalAlpha = (1 - (B.ph2 - 1.7)/.8)*.8; c.fillStyle = '#ffe0ec'; c.beginPath(); c.ellipse(x, y - 130, 200, 200, 0, 0, 7); c.fill(); c.restore(); } }

// ---------- 패턴 tick ----------
function hist(B){ const l = loc(B), me = B.me, now = B.now; if (me){ const h = l.hist; if (!h.length || now - h[h.length - 1][0] > 40) h.push([now, me.x, me.y]); while (h.length && now - h[0][0] > 4200) h.shift(); }
  if (B.phase >= 2) for (const q of B.all){ if (q.me) continue; let h = l.oh.get(q.uid); if (!h) l.oh.set(q.uid, h = []); if (!h.length || now - h[h.length - 1][0] > 60) h.push([now, q.x, q.y]); while (h.length && now - h[0][0] > 4200) h.shift(); } }
function histAt(h, t){ if (!h || !h.length || h[0][0] > t + 200) return null; let best = h[0]; for (const s of h){ if (s[0] <= t) best = s; else break; } return [best[1], best[2]]; }
const ghostOf = (B, q, t) => histAt(q.me ? loc(B).hist : loc(B).oh.get(q.uid), t);

function txQ(B){ // 모은 타격 보내기 (0.35 초마다)
  const l = loc(B), pd = l.pend; if (B.now - l.txT < 350 || !(pd.t || pd.c || pd.bell)) return; l.txT = B.now; const p = P_(B), seed = pd.bs, a = pd.t, b = pd.c, bell = pd.bell; pd.t = pd.c = pd.bell = 0;
  if ((a || b) && p.id === 'split' && p.seed === seed){ const need = s7Need(B), now = B.now, T = splitPos(B, p, wand(B, amp(p))).T, cycEnd = t0Abs(B, p) + (p.len + GAP)*1000;
    B.tx(bs => { const s0 = bs.s7, s = s0 && s0.s === seed ? {...s0} : {s:seed, t:0, c:0}; if (s.ok) return undefined; if (!s.td) s.t += a; if (!s.cd) s.c += b; if (s.t >= need && !s.td) s.td = now; if (s.c >= need && !s.cd) s.cd = now;
      const out = {...bs, s7:s}; if (s.td && s.cd){ s.ok = now; out.stun = Math.min(now + 7700, cycEnd); out.sp = [Math.round(T[0]), Math.round(T[1])]; out.sk = 3; } return out; }); }
  if (bell && p.id === 'dlv' && p.seed === seed){ const now = B.now; B.tx(bs => { const d = bs.dl; if (!d || d.s !== seed || d.cut || d.done) return undefined; const h = (d.h | 0) + bell; return {...bs, dl:{...d, h, ...(h >= d.need ? {cut:now} : {})}}; }); } }

function hostTick(B, p){ const l = loc(B); if (!B.host || B.now - l.hostT < 600) return; l.hostT = B.now; const now = B.now, al = B.alive, bs = B.bs;
  if (p.id === 'lure' && p.t >= LU_A && p.t < LU_E){ let u = luOf(B, p); if (u && u.fz) return;
    const cur = pos(B), ch = u && al.find(q => q.uid === u.uid);
    if (u && inZone(cur[0], cur[1], u.side)){ const fz = now; B.tx(b => { const v = b.lu; if (!v || v.s !== p.seed || v.fz) return undefined; return {...b, lu:{...v, fz, fx:Math.round(cur[0]), fy:Math.round(cur[1])}}; }); return; }
    let tg = ch; if (!tg){ if (!al.length) return; tg = al[Math.floor(B.rng(p.seed + 'lu' + (u ? now : ''))()*al.length)]; }
    const nu = {s:p.seed, uid:tg.uid, side:luSide(B, p), x0:Math.round(cur[0]), y0:Math.round(cur[1]), t0:now, gx:Math.round(tg.x), gy:Math.round(tg.y), te:Math.round(t0Abs(B, p) + LU_E*1000)};
    if (u && u.uid === nu.uid && dist(u.gx, u.gy, nu.gx, nu.gy) < 6) return;
    B.tx(b => { const v = b.lu; if (v && v.s === p.seed && v.fz) return undefined; return {...b, lu:nu}; }); return; }
  if (p.id === 'dlv' && p.t >= .5 && p.t < DL1){ const d = dlOf(B, p); if (!d){ const tg = B.target; if (!tg) return; const cs = [[200, 845], [900, 845], [200, 450], [900, 450]].sort((a, b) => dist(b[0], b[1], tg.x, tg.y) - dist(a[0], a[1], tg.x, tg.y)), box = cs[0], need = 2 + Math.min(4, al.length);
      B.tx(b => { const v = b.dl; if (v && v.s === p.seed) return undefined; return {...b, dl:{s:p.seed, uid:tg.uid, box, h:0, need}}; }); }
    else if (d.done && once(B, 'heal.' + p.seed)) B.heal(B.r.max*.03);
    return; }
  if (p.id === 'cake' && p.t >= .4 && p.t < p.len - 1 && !ckOf(B, p)){ const need = ckNeed(B); B.tx(b => { const v = b.ck; if (v && v.s === p.seed) return undefined; return {...b, ck:{s:p.seed, k:0, at:now, need}}; }); return; }
  if (p.id === 'split'){ const s = s7Of(B, p); if (s && !s.ok && (s.td || s.cd) && !(s.td && s.cd) && now - (s.td || s.cd) > s7Win(B)){ const f = now; B.tx(b => { const v = b.s7; if (!v || v.s !== p.seed || v.ok || !(v.td || v.cd) || (v.td && v.cd)) return undefined; return {...b, s7:{s:p.seed, t:0, c:0, f}}; }); B.heal(B.r.max*.015); } } }

function patTick(B, p){ const me = B.me, now = B.now, live = me && !me.down, seed = p.seed;
  if (p.id === 'race'){ if (p.t < .6) { if (once(B, 'rw' + seed)){ B.sfx('warn'); sayOnce(B, 'r' + seed, '땡땡! 새벽 배달이요~'); } }
    if (raceRun(p) && live){ const [x, y] = pos(B); if (inEll(me.x, me.y, x, y, 75, 42) && B.hurt(B.lo + 100, `rc.${seed}.${Math.floor(now/900)}`)){ B.push(me.x - RC[0], me.y - RC[1], 80); B.shake(); } } }
  else if (p.id === 'lure'){ const u = luOf(B, p);
    if (p.t < .6 && once(B, 'lw' + seed)){ B.sfx('warn'); sayOnce(B, 'l' + seed, '주문하신 케이크 왔어요~'); }
    if (frozen(B, p) && once(B, 'lf' + seed)){ B.sfx('slam'); B.say('…골목길은… 싫어', 2600); }
    if (u && !u.fz && p.t > LU_A && p.t < LU_E && live){ const [x, y] = pos(B); if (inEll(me.x, me.y, x, y, 62, 38) && B.hurt(B.lo + 60, `lu.${seed}.${Math.floor(now/1100)}`)) B.push(me.x - x, me.y - y, 70); } }
  else if (p.id === 'paint'){ if (p.t < .6 && once(B, 'pw' + seed)) sayOnce(B, 'p' + seed, '새로 칠했어요. 하늘색으로.');
    if (live && p.t < p.len - PEND){ const tl = paintTiles(B, p), cx = Math.floor((me.x - GX0)/GW), cy = Math.floor((me.y - GY0)/GH); const i = tl.findIndex(q => q[0] === cx && q[1] === cy);
      if (i >= 0){ const pt = PT0 + i*PDT; if (p.t >= pt){ B.ctl.slip = .7; if (p.t < pt + .3) B.hurt(B.lo + 20, `pt.${seed}.${i}`); } } } }
  else if (p.id === 'trans'){ if (B.ph2 > 2.2) sayOnce(B, 'tr' + B.r.rageAt, `${B.targetNick} 님, 새벽 5 시 40 분에 갈게요`, 3200); }
  else if (p.id === 'rew'){ const l = loc(B); if (p.t < .6) sayOnce(B, 'rw' + seed, '다시… 처음부터…');
    RK.forEach((rk, i) => { const key = seed + '.' + i;
      if (p.t >= rk - 1 && p.t < rk && once(B, 'rwb' + key)){ B.sfx('warn'); const [x, y] = pos(B); B.fx('땡… 땡…', x + 90, y - 150, '#ffe9a0'); }
      if (p.t >= rk && p.t < rk + .5 && once(B, 'rwt' + key) && !stunned(B)){ const t3 = now - 3000, e = {pts:[]}; for (const q of B.alive){ const gpos = q.me ? histAt(l.hist, t3) : histAt(l.oh.get(q.uid), t3); if (gpos) e.pts.push([gpos[0], gpos[1], !!q.me]); }
        l.rw[key] = e; B.sfx('slam'); if (live){ const d = histAt(l.hist, t3); if (d) B.tp(d[0], d[1]); } }
      if (p.t >= rk + RBOOM && p.t < rk + RBOOM + .4 && once(B, 'rwx' + key)){ const e = l.rw[key]; if (e && live && e.pts.some(q => q[2] && inCross(me.x, me.y, q[0], q[1]))){ B.hurt(B.lo + 80, 'rwx.' + key); B.shake(); } } }); }
  else if (p.id === 'dlv'){ const d = dlOf(B, p); if (p.t < .6 && once(B, 'dw' + seed)) B.sfx('warn');
    if (d && once(B, 'ds' + seed)) B.say(`${B.all.find(q => q.uid === d.uid)?.nick || B.targetNick} 님, 마지막 배달이요`, 2800);
    if (d && d.cut && once(B, 'dc' + seed)){ const [x, y] = pos(B); B.fx('배달 취소', x, y - 170, '#c8ffd0'); B.sfx('slam'); }
    if (d && live && d.uid === me.uid && !d.cut && !d.done && p.t > DL0 && p.t < DL1){ const dx = d.box[0] - me.x, dy = d.box[1] - me.y, dd = Math.hypot(dx, dy) || 1, D = nAlive(B) <= 1 ? 45 : 120;
      B.ctl.drift = [dx/dd*D, dy/dd*D]; B.ctl.speed = .55;
      if (dd < 50 && once(B, 'dd' + seed)){ B.hurt(B.lo + 200, 'dl.' + seed); B.shake(); const t = now; B.tx(b => { const v = b.dl; if (!v || v.s !== seed || v.done || v.cut) return undefined; return {...b, dl:{...v, done:t}}; }); } } }
  else if (p.id === 'cake'){ const d = ckOf(B, p); if (p.t < .6) sayOnce(B, 'c' + seed, '생일 케이크… 보내지 못했어');
    if (d && d.ev && once(B, 'ce' + seed)){ B.sfx('slam'); B.say('…하늘아…', 3000); B.shake(); } }
  else if (p.id === 'split'){ const s = s7Of(B, p), sp = splitPos(B, p, wand(B, amp(p)));
    if (p.t < .6 && once(B, 'sw' + seed)) B.sfx('slam');
    if (p.t > SP_A) sayOnce(B, 's' + seed, '내가 안 그랬어… 바퀴 탓이야');
    if (s && s.f && once(B, 'sf' + seed + s.f)){ B.sfx('warn'); B.say('…다시 붙었다', 1800); }
    if (s && s.ok && once(B, 'so' + seed)){ B.sfx('slam'); B.shake(); }
    if (sp.live && !(s && s.ok) && live && !stunned(B)){ const [x, y] = sp.C; if (inEll(me.x, me.y, x, y, 66, 36) && B.hurt(B.lo + 60, `sc.${seed}.${Math.floor(now/1200)}`)) B.push(me.x - x, me.y - y, 70); } } }

// ---------- 바닥 그리기 ----------
function drawAlleyZone(c, side, a){ const z = zone(side), x0 = z[0], x1 = z[2], y0 = z[1], y1 = z[3]; c.save(); c.globalAlpha = a;
  const q = c.createLinearGradient(side < 0 ? x1 : x0, 0, side < 0 ? x0 : x1, 0); q.addColorStop(0, 'rgba(0,0,10,.15)'); q.addColorStop(1, 'rgba(0,0,10,.82)'); c.fillStyle = q; c.fillRect(x0, y0, x1 - x0, y1 - y0);
  c.strokeStyle = 'rgba(90,110,160,.25)'; c.lineWidth = 1.5; for (let y = y0 + 20; y < y1; y += 30){ c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }
  c.strokeStyle = 'rgba(160,190,255,.35)'; c.setLineDash([8, 8]); c.strokeRect(x0, y0, x1 - x0, y1 - y0); c.setLineDash([]);
  const lx = side < 0 ? x0 + 30 : x1 - 30; c.fillStyle = '#1a1c24'; c.fillRect(lx - 3, y0 + 10, 6, 120); c.fillStyle = 'rgba(255,210,140,.8)'; c.beginPath(); c.arc(lx, y0 + 10, 7, 0, 7); c.fill();
  text(c, '골목길', (x0 + x1)/2, y0 + 26, 24, '#9ab0d8'); c.restore(); }
function drawFloor(B, c){ const p = P_(B), now = B.now;
  if (p.id === 'trans'){ const k = B.ph2, I = vhsI(k); if (I > 0 && hsh(Math.floor(now/71) + 77) < (k > 1.7 && k < 2.3 ? .8 : .18 + .5*I)) c.drawImage(alleyCv(), 0, 0, 1100, 900); }
  if (p.id === 'race'){ const al = cl(p.t*2)*cl((p.len - .4 - p.t)*2); if (al > 0){ c.save(); c.globalAlpha = al*.55; c.strokeStyle = 'rgba(255,160,190,.6)'; c.lineWidth = 36; c.beginPath(); c.ellipse(RC[0], RC[1], RRX, RRY, 0, 0, 7); c.stroke(); c.setLineDash([16, 12]); c.lineWidth = 3; c.strokeStyle = '#ffd0e0'; c.stroke(); c.restore(); } }
  if (p.id === 'lure') drawAlleyZone(c, luSide(B, p), cl(p.t*2)*cl((p.len - p.t)*2));
  if (p.id === 'paint'){ const tl = paintTiles(B, p), fade = cl((p.len - p.t)/PEND); tl.forEach(([cx, cy], i) => { const pt = PT0 + i*PDT, x = GX0 + cx*GW, y = GY0 + cy*GH; if (p.t < pt - .7) return;
      c.save(); if (p.t < pt){ c.globalAlpha = .6*fade; c.strokeStyle = '#9ad8ff'; c.lineWidth = 3; c.setLineDash([6, 5]); c.strokeRect(x + 4, y + 4, GW - 8, GH - 8); c.restore(); return; }
      const u = ease(cl((p.t - pt)/.3)); c.globalAlpha = .62*fade; c.fillStyle = '#7cc6f6'; if (u < 1){ c.save(); c.beginPath(); c.rect(x + 2, y + 2, GW - 4, GH - 4); c.clip(); c.beginPath(); c.ellipse(x + GW/2, y + GH/2, GW*.75*u, GH*.75*u, 0, 0, 7); c.fill(); c.restore(); } else c.fillRect(x + 2, y + 2, GW - 4, GH - 4);
      if (u >= 1){ c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 2; for (let j = 0; j < 3; j++){ c.beginPath(); c.moveTo(x + 14 + j*34, y + 18); c.lineTo(x + 30 + j*34, y + GH - 18); c.stroke(); } }
      c.restore(); }); }
  drawSkids(B, c);
  if (p.id === 'dlv'){ const d = dlOf(B, p); if (d && !d.cut){ const [x, y] = d.box; c.save(); shadow(c, x, y + 4, 34, 10, .35); c.fillStyle = '#fff4f6'; c.fillRect(x - 28, y - 44, 56, 44); c.fillStyle = '#ffc8d8'; c.fillRect(x - 30, y - 50, 60, 10); c.fillStyle = '#ff8fb0'; c.fillRect(x - 4, y - 50, 8, 50); c.restore(); text(c, d.done ? '배달 완료' : '5:40', x, y - 64, 20, d.done ? '#ff8aa0' : '#ffe0ec'); } }
  { const ck = B.bs.ck; if (ck && ((p.id === 'cake' && ck.s === p.seed) || (ck.ev && B.now - ck.ev < 9000))) drawCake(B, c, ck); }
  // 크림 폭탄
  const l = loc(B), b = cbBeat(B); for (const n of [b.n - 1, b.n]){ const e = l.cb[n]; if (!e) continue; const k = n === b.n ? b.t : b.t + b.len; if (k > 1.6*CBW + .2) continue; for (const q of e.pts) drawCross(c, q[0], q[1], k/CBW); }
  // ④ 되감기: 유령 · 돌아간 자리 폭탄
  if (p.id === 'rew'){ const t3 = now - 3000, near = RK.find(rk => p.t > rk - 1.2 && p.t < rk + RBOOM + .8);
    if (!stunned(B)) for (const q of B.alive){ const gp = ghostOf(B, q, t3); if (!gp) continue; drawGhost(c, gp[0], gp[1], q.me); if (near !== undefined && p.t < near) drawCross(c, gp[0], gp[1], cl((p.t - near + 1.2)/1.2)*.6); }
    RK.forEach((rk, i) => { const e = l.rw[p.seed + '.' + i]; if (!e || p.t < rk) return; let k = (p.t - rk)/RBOOM; if (k > 1.7) return; if (k < 1) k = .6 + .4*k; for (const q of e.pts) drawCross(c, q[0], q[1], k); }); } }
function drawGhost(c, x, y, mine){ c.save(); c.globalAlpha = mine ? .42 : .26; c.fillStyle = '#c8b8ff'; c.beginPath(); c.ellipse(x, y, 20, 7, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(x, y - 24, 20, 20, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(x - 12, y - 42, 7, 8, 0, 0, 7); c.ellipse(x + 12, y - 42, 7, 8, 0, 0, 7); c.fill();
  c.globalAlpha = mine ? .8 : .5; c.strokeStyle = '#e8dcff'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.ellipse(x, y, 26, 9, 0, 0, 7); c.stroke(); c.restore(); }
function drawCake(B, c, d){ const [cx, cy] = CK, k = Math.min(d.k, d.need);
  c.save(); shadow(c, cx, cy + 10, 120, 26, .4); c.fillStyle = '#e8d8d0'; c.beginPath(); c.ellipse(cx, cy, 110, 24, 0, 0, 7); c.fill();
  for (let i = 0; i < k; i++){ const w = 100 - i*9, y = cy - 6 - i*16; const g = c.createLinearGradient(cx - w, 0, cx + w, 0); g.addColorStop(0, '#ffd0dc'); g.addColorStop(.5, '#fff4f6'); g.addColorStop(1, '#ffc0d0'); c.fillStyle = g; c.fillRect(cx - w, y - 16, w*2, 17); c.fillStyle = '#fff8fa'; c.beginPath(); c.ellipse(cx, y - 16, w, 6, 0, 0, 7); c.fill(); }
  if (d.ev){ const top = cy - 6 - k*16 - 4; for (let i = 0; i < 7; i++){ c.fillStyle = '#9ad8ff'; c.fillRect(cx - 38 + i*12, top - 18, 4, 18); c.fillStyle = '#ffd860'; c.beginPath(); c.ellipse(cx - 36 + i*12, top - 22 + Math.sin(B.now/90 + i), 3, 5, 0, 0, 7); c.fill(); } text(c, '하늘이 생일 축하해', cx, cy + 40, 22, '#bfe6ff'); }
  else { // 가운데 표시
    c.globalAlpha = .4; c.strokeStyle = '#fff'; c.setLineDash([4, 6]); c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy - 6 - k*16 - 70); c.lineTo(cx, cy - 6 - k*16 - 10); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
    for (let i = 0; i < d.need; i++){ c.fillStyle = i < k ? '#ffc8dc' : 'rgba(30,20,30,.7)'; c.beginPath(); c.arc(cx - (d.need - 1)*9 + i*18, cy + 38, 5, 0, 7); c.fill(); } }
  c.restore(); }
function drawCakeTop(B, c, p){ const d = ckOf(B, p); if (!d || d.ev || p.t > p.len - .3) return; const [cx, cy] = CK, k = d.k, off = ckOff(B, d), w = 100 - k*9, y = cy - 6 - k*16 - 46, x = cx + off;
  c.save(); const g = c.createLinearGradient(x - w, 0, x + w, 0); g.addColorStop(0, '#ffd0dc'); g.addColorStop(.5, '#fff4f6'); g.addColorStop(1, '#ffc0d0'); c.globalAlpha = .92; c.fillStyle = g; c.fillRect(x - w, y - 16, w*2, 17); c.fillStyle = '#fff8fa'; c.beginPath(); c.ellipse(x, y - 16, w, 6, 0, 0, 7); c.fill();
  if (Math.abs(off) < 34){ c.globalAlpha = .7; c.strokeStyle = '#fff6b0'; c.lineWidth = 3; c.strokeRect(x - w - 3, y - 22, w*2 + 6, 26); }
  if (d.miss && B.now - d.miss < 600){ c.globalAlpha = 1 - (B.now - d.miss)/600; text(c, '철퍽', cx + 130, cy - 70, 26, '#ffb0b0'); }
  c.restore(); }

// ---------- 위 그리기 ----------
function drawTopAll(B, c){ const p = P_(B), now = B.now, l = loc(B);
  const b = cbBeat(B), e = l.cb[b.n]; if (e && !cbOff(B)) drawBalls(c, bagAt(pos(B)), e.pts, b.t);
  drawSparks(B, c);
  if (p.id === 'lure'){ const u = luOf(B, p); if (u && !u.fz && p.t < LU_E){ const q = B.all.find(v => v.uid === u.uid); if (q){ const y = q.y - 78 + Math.sin(now/200)*3; c.save(); c.fillStyle = '#fff4f6'; c.fillRect(q.x - 18, y - 12, 36, 22); c.fillStyle = '#ffc8d8'; c.fillRect(q.x - 20, y - 16, 40, 7); c.fillStyle = '#ff8fb0'; c.fillRect(q.x - 3, y - 16, 6, 26); c.restore(); } } }
  if (p.id === 'dlv'){ const d = dlOf(B, p); if (d && !d.cut && !d.done && p.t > DL0 - .4 && p.t < DL1){ const q = B.all.find(v => v.uid === d.uid), [bx, by] = pos(B), bl = bellAt([bx, by]);
      if (q){ c.save(); c.strokeStyle = '#ff9ab8'; c.lineWidth = 5; c.beginPath(); c.moveTo(bx, by - 120); c.quadraticCurveTo((bx + q.x)/2, (by + q.y)/2 + 60, q.x, q.y - 30); c.stroke(); c.setLineDash([8, 8]); c.strokeStyle = 'rgba(255,200,220,.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(d.box[0], d.box[1]); c.stroke(); c.setLineDash([]);
        c.fillStyle = '#fff4f6'; c.fillRect(q.x - 62, q.y - 112, 124, 30); c.restore(); text(c, `받는 사람: ${q.nick || '???'}`, q.x, q.y - 104, 17, '#8a1a3a', 'center', null); text(c, '새벽 5:40 · 마지막 배달', q.x, q.y - 90, 15, '#5a2a3a', 'center', null); }
      c.save(); c.strokeStyle = `rgba(255,240,160,${.6 + .3*Math.sin(now/120)})`; c.lineWidth = 3; c.setLineDash([5, 5]); c.beginPath(); c.arc(bl[0], bl[1], 26, 0, 7); c.stroke(); c.setLineDash([]); for (let i = 0; i < d.need; i++){ c.fillStyle = i < (d.h | 0) ? '#9affb0' : 'rgba(20,20,26,.8)'; c.beginPath(); c.arc(bl[0] - (d.need - 1)*8 + i*16, bl[1] - 38, 6, 0, 7); c.fill(); } c.restore(); } }
  if (p.id === 'cake') drawCakeTop(B, c, p);
  if (p.id === 'split' && !stunned(B)){ const sp = splitPos(B, p, wand(B, amp(p))); if (!sp.joined && !sp.ok){ const s = s7Of(B, p), need = s7Need(B), bar = (x, y, v, down) => { c.save(); c.fillStyle = 'rgba(10,10,20,.8)'; c.fillRect(x - 50, y, 100, 8); c.fillStyle = down ? '#6a6a7a' : '#ff6a8a'; c.fillRect(x - 50, y, 100*cl(1 - v/need), 8); c.restore(); };
      bar(sp.C[0], sp.C[1] - 84, s ? s.c : 0, s && s.cd); bar(sp.T[0], sp.T[1] - 236 - (sp.hop || 0), s ? s.t : 0, s && s.td);
      if (s && (s.td || s.cd) && !(s.td && s.cd)){ const left = Math.max(0, (s7Win(B) - (now - (s.td || s.cd)))/1000), q = s.td ? sp.C : sp.T; text(c, left.toFixed(1), q[0], q[1] - (s.td ? 110 : 262), 30, '#ffd0d8'); } } } }
const bagAt = ([x, y]) => [x - 210*S, y - (FOOT_FULL - 154)*S];

// ---------- 모듈 ----------
export default {
  reach: 125,
  height: 268,
  pos,
  tick(B, dt){ const p = P_(B); hist(B); recBoss(B); if (B.t < 2.5) sayOnce(B, 'hi', '어서 오세요~ 모모 케이크예요!');
    cbTick(B); patTick(B, p); hostTick(B, p); txQ(B); },
  hitMul(B){ if (B.phase === 2 && B.ph2 < TRANS) return 0; if (stunned(B)) return B.bs.sk || 2; const p = P_(B); if (frozen(B, p)) return 2; const d = p.id === 'dlv' && dlOf(B, p); if (d && d.cut && B.now - d.cut < 3500) return 1.5; return 1; },
  swing(B, cx, cy){ const p = P_(B), l = loc(B), now = B.now;
    if (p.id === 'split' && !stunned(B)){ const sp = splitPos(B, p, wand(B, amp(p))), s = s7Of(B, p); if (sp.joined || sp.ok) return false; const R = this.reach;
      const nT = dist(cx, cy, sp.T[0], sp.T[1]) < R, nC = dist(cx, cy, sp.C[0], sp.C[1]) < R; if (!nT && !nC) return false; if (!sp.live) return true;
      const toT = nT && (!nC || dist(cx, cy, sp.T[0], sp.T[1]) <= dist(cx, cy, sp.C[0], sp.C[1])), q = toT ? sp.T : sp.C, down = s && (toT ? s.td : s.cd);
      if (down){ B.fx('…', q[0], q[1] - 120, '#9ab0c0'); return true; }
      if (l.pend.bs !== p.seed){ l.pend = {t:0, c:0, bell:0, bs:p.seed}; } if (toT) l.pend.t++; else l.pend.c++; B.sfx('hit', 60); B.fx(toT ? '퍽' : '쾅', q[0] + (hsh(now) - .5)*40, q[1] - 110, toT ? '#ffd0a0' : '#ffc8dc'); return true; }
    if (p.id === 'dlv'){ const d = dlOf(B, p); if (d && !d.cut && !d.done && p.t > DL0 - .4 && p.t < DL1){ const bl = bellAt(pos(B)); if (dist(cx, cy, bl[0], bl[1] + 80) < 62){ if (l.pend.bs !== p.seed){ l.pend = {t:0, c:0, bell:0, bs:p.seed}; } l.pend.bell++; B.sfx('warn', 120); B.fx('땡!', bl[0] + 24, bl[1] - 20, '#fff0a0'); return true; } } }
    if (p.id === 'cake'){ const d = ckOf(B, p); if (d && !d.ev && dist(cx, cy, CK[0], CK[1] - 10) < 85){ const k0 = d.k, ok = Math.abs(ckOff(B, d)) < 34, seed = p.seed, T = pos(B);
        if (ok){ B.fx('딱!', CK[0] + 120, CK[1] - 60 - k0*16, '#c8ffd0'); B.sfx('hit', 60); B.tx(bs => { const v = bs.ck; if (!v || v.s !== seed || v.k !== k0 || v.ev) return undefined; const k = k0 + 1, out = {...bs, ck:{...v, k, at:now}}; if (k >= v.need){ out.ck.ev = now; out.stun = now + 8000; out.sp = [Math.round(T[0]), Math.round(T[1])]; out.sk = 2; } return out; }); }
        else { if (now - (d.miss || 0) > 400) B.tx(bs => { const v = bs.ck; if (!v || v.s !== seed || v.ev) return undefined; return {...bs, ck:{...v, at:now, miss:now}}; }); }
        return true; } }
    return false; },
  drawFloor(B, c){ drawFloor(B, c); },
  drawBody(B, c){ drawBoss(B, c); },
  drawTop(B, c){ drawTopAll(B, c); },
  drawScreen(B, c, w, h){ const p = P_(B);
    if (p.id === 'trans') vhs(B, c, w, h, vhsI(B.ph2), B.ph2);
    if (B.phase === 2 && B.ph2 > 1.7 && B.ph2 < 2.5) tint(c, w, h, '#ffe0ec', (1 - (B.ph2 - 1.7)/.8)*.55);
    if (p.id === 'rew'){ for (const rk of RK){ const k = p.t - rk; if (k >= 0 && k < .6){ vhs(B, c, w, h, (1 - k/.6)*.6, 1, false); tint(c, w, h, '#e8d8ff', (1 - k/.6)*.35); } } }
    if (p.id === 'lure' && frozen(B, p)) tint(c, w, h, '#0a1030', .12);
    if (B.phase >= 2 && p.id !== 'trans'){ c.save(); c.globalAlpha = .05; c.fillStyle = scanPat(c); c.fillRect(0, 0, w, h); c.restore(); trackLine(B, c, w, h, 1); } },
};
