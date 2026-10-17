// 밤이??? (반세라) · 꽃집 주인 고슴도치 · 약초차 사건 — 기획: docs/DARK_STORY.md "보스 패턴 규칙" · 엔진: docs/BOSS_ENGINE.md
// 기본 공격: 덩굴 채찍 (발밑을 가로지르는 S 자 물결 띠)
// 1 단계: ① 가시 등 (배 쪽에서만) · ② 덩굴 번짐 (자라는 끝 베기) · ③ 어지럼 꽃가루 (걸음이 휘어요)
// 2 단계: ④ 쓰러진 척 · ⑤ 꽃향기 (노리는 몸 · 벌떼 태그) · ⑥ 두 찻잔 (야바위 → 기절)   3 단계: ⑦ 시드는 바닥 (씨앗으로 안전지대)
import { pick, beat, warnCircle, sector, cl, lerp, ease, dist, inEll, text, tint } from './kit.js';
import { sprite, ART, wiltFlower, vinePath, foxBell, flower, portrait, cmix } from './bami_art.js';

const S = .4, POT = 350*S, RES = .9;                  // 그림 크기 · 그림 원점에서 발(화분 바닥)까지
const GAP = 2.5, TRANS = 5;
const P = { 1:[{id:'back', len:12}, {id:'vine', len:15}, {id:'dizzy', len:12}],
            2:[{id:'fake', len:12}, {id:'bees', len:12}, {id:'cups', len:18}],
            3:[{id:'wither', len:16}] };
const AMP = { back:.3, vine:.25, dizzy:.5, fake:.12, bees:.6, cups:.2, wither:.3 };
const OPT = { gap:GAP, trans:TRANS };
const TAU = Math.PI*2;
const angD = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

// ===== 시간 · 자리 (모두에게 같아요: r.bossAt · rageAt · lowAt · bs 만 봐요) =====
function ctxAt(B, ms){ const r = B.r, b0 = r.bossAt || ms; let phase = 1, ps = b0;
  if (r.lowAt && ms >= r.lowAt){ phase = 3; ps = r.lowAt; } else if (r.rageAt && ms >= r.rageAt){ phase = 2; ps = r.rageAt; }
  return { r, phase, pt:(ms - ps)/1000, ph2:r.rageAt && ms >= r.rageAt ? (ms - r.rageAt)/1000 : -1, t:(ms - b0)/1000 }; }
const curAt = (B, ms) => pick(ctxAt(B, ms), P, OPT);
const wander = t => [Math.cos(t*.42)*125 + Math.sin(t*1.07)*30, Math.sin(t*.61)*44 + Math.sin(t*1.3)*10];
function ampOf(c, cur){ if (cur.id === 'trans') return 0; let a = 1;
  if (cur.id && AMP[cur.id] != null){ const k = Math.min(cl(cur.t/.6), cl((cur.len - cur.t)/.6)); a = 1 - (1 - AMP[cur.id])*k; }
  if (c.phase === 2) a *= ease(cl((c.ph2 - TRANS)/1.2));
  return a; }
function posRaw(B, ms){ const c = ctxAt(B, ms), cur = pick(c, P, OPT), w = wander(c.t), a = ampOf(c, cur), p = [B.hx + w[0]*a, B.hy + w[1]*a];
  if (c.phase === 2 && c.ph2 < 1.4 && B.r.rageAt){ const p0 = posRaw(B, B.r.rageAt - 1), k = ease(c.ph2/1.4); return [lerp(p0[0], p[0], k), lerp(p0[1], p[1], k)]; }
  if (c.phase === 3 && c.pt < 1.2 && B.r.lowAt){ const p0 = posRaw(B, B.r.lowAt - 1), k = ease(c.pt/1.2); return [lerp(p0[0], p[0], k), lerp(p0[1], p[1], k)]; }
  return p; }
function posAt(B, ms){ const bs = B.bs || {};
  if (bs.sa && ms >= bs.sa && bs.stun){ const p0 = posRaw(B, bs.sa); if (ms < bs.stun) return p0; if (ms < bs.stun + 1200){ const p = posRaw(B, ms), k = ease((ms - bs.stun)/1200); return [lerp(p0[0], p[0], k), lerp(p0[1], p[1], k)]; } }
  return posRaw(B, ms); }
// 지나간 자리 (꽃 흔적) 캐시
let pcache = new Map(), pcKey = '';
function posIdx(B, i){ const key = `${B.r.bossAt}|${B.r.rageAt || 0}|${B.r.lowAt || 0}|${B.bs.sa || 0}`; if (key !== pcKey || pcache.size > 400){ pcache = new Map(); pcKey = key; }
  let v = pcache.get(i); if (!v){ const ms = i*100, a = posAt(B, ms), b = posAt(B, ms - 60); v = [a[0], a[1], (a[0] - b[0])/.06, (a[1] - b[1])/.06]; pcache.set(i, v); } return v; }
const moveK = (vx, vy) => cl((Math.hypot(vx, vy) - 5)/45);

const stunned = B => B.bs.stun > B.now;
const halfLook = B => B.phase >= 2 && !(B.phase === 2 && B.ph2 < 1.9);
const half = (B) => B.phase >= 2;

// ===== 같은 패턴 차례 안에서 한 번 정해 두는 값 (각자 화면) =====
const memo = new Map();
function keep(key, f){ if (memo.has(key)) return memo.get(key); const v = f(); memo.set(key, v); if (memo.size > 300){ const it = memo.keys(); for (let i = 0; i < 100; i++) memo.delete(it.next().value); } return v; }
const once = new Set();
function first(key){ if (once.has(key)) return false; once.add(key); if (once.size > 600){ const it = once.values(); for (let i = 0; i < 200; i++) once.delete(it.next().value); } return true; }
let txT = 0; const txOk = (B, gap = 350) => { if (performance.now() - txT < gap) return false; txT = performance.now(); return true; };

// ===== 기본 공격: 덩굴 채찍 =====
const VL = 250, VWID = 30, WARN = .85, RISE = .45;
function waves(B){ if (B.phase === 2 && B.ph2 < TRANS + .5) return null; if (stunned(B)) return null;
  const bt = beat(B, 3.2); if (bt.t > WARN + RISE + .4) return null;
  const list = keep(`w${B.r.bossAt}.${B.phase}.${bt.n}`, () => { const al = B.alive.length ? B.alive : B.all; if (!al.length) return [];
    const n = Math.min(al.length, 1 + (al.length >= 3) + (al.length >= 6)), rn = B.rng(`w${B.r.bossAt}.${bt.n}`), out = [];
    for (let j = 0; j < n; j++){ const p = al[(B.hash(`${bt.n}.${j}`) + j) % al.length], a = rn()*Math.PI, o = (rn() - .5)*40;
      out.push({x:p.x - Math.sin(a)*o, y:p.y + Math.cos(a)*o*.6, a, ph:rn()*6}); } return out; });
  return {bt, list}; }
const waveAt = (w, u) => { const s = (u - .5)*VL, q = Math.sin(u*Math.PI*3 + w.ph*.2)*18; return [w.x + Math.cos(w.a)*s - Math.sin(w.a)*q, w.y + (Math.sin(w.a)*s + Math.cos(w.a)*q)*.6]; };
function onWave(w, x, y){ for (let i = 0; i <= 26; i++){ const p = waveAt(w, i/26); if ((p[0] - x)**2 + ((p[1] - y)/.6)**2 < 24*24) return true; } return false; }
function wavesTick(B){ const W = waves(B); if (!W) return; const {bt, list} = W, me = B.me;
  if (first(`ww${B.r.bossAt}.${B.phase}.${bt.n}`)) B.sfx('warn', 400);
  if (bt.t >= WARN && first(`ws${B.r.bossAt}.${B.phase}.${bt.n}`)) B.sfx('slam', 300);
  if (!me || bt.t < WARN || bt.t > WARN + .35) return;
  list.forEach((w, j) => { if (onWave(w, me.x, me.y) && B.hurt(B.lo + 20, `w${B.r.bossAt}.${B.phase}.${bt.n}.${j}`)) B.push(-Math.sin(w.a), Math.cos(w.a), 30); }); }
function wavesDraw(B, c, under){ const W = waves(B); if (!W) return; const {bt, list} = W, k = bt.t;
  for (const w of list){
    if (under && k < WARN){ c.save(); c.globalAlpha = .45 + .4*Math.abs(Math.sin(k*10)); c.strokeStyle = '#b0f070'; c.lineWidth = 4; c.setLineDash([8, 7]); c.beginPath(); for (let i = 0; i <= 24; i++){ const p = waveAt(w, i/24); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke();
      c.globalAlpha = .12 + .2*k/WARN; c.setLineDash([]); c.lineWidth = VWID*k/WARN; c.stroke(); c.restore(); continue; }
    if (!under && k >= WARN){ const al = cl((WARN + RISE + .4 - k)*3), gr = cl((k - WARN)/.12); c.save(); c.globalAlpha = al; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); for (let i = 0; i <= 24; i++){ const p = waveAt(w, i/24); i ? c.lineTo(p[0], p[1] - 8*gr) : c.moveTo(p[0], p[1] - 8*gr); }
      c.strokeStyle = half(B) ? '#2a1a34' : '#2e4a1e'; c.lineWidth = VWID*gr; c.stroke(); c.strokeStyle = half(B) ? '#6a4a80' : '#6a9a3a'; c.lineWidth = VWID*.38*gr; c.stroke();
      c.fillStyle = '#10180a'; for (let i = 1; i < 12; i++){ const p = waveAt(w, i/12); c.beginPath(); c.moveTo(p[0] - 5, p[1] - 10*gr); c.lineTo(p[0], p[1] - 30*gr); c.lineTo(p[0] + 5, p[1] - 10*gr); c.fill(); }
      c.restore(); } } }

// ===== ① 가시 등: 배 쪽(부채꼴)에서만 · 등 · 옆 가시에 닿으면 따끔 =====
const WEDGE = .72;
const faceOf = (B, cur) => Math.PI/2 + Math.sin(cur.t*.5 + (B.hash(cur.seed) % 7))*1.9;
function inBelly(B, cur, x, y){ const [fx, fy] = posAt(B, B.now), a = Math.atan2((y - fy)/.6, x - fx); return angD(a, faceOf(B, cur)) < WEDGE + .08; }
function backTick(B, cur){ const me = B.me; if (!me) return; const [fx, fy] = posAt(B, B.now);
  if (cur.t > .6 && cur.t < cur.len - .3 && inEll(me.x, me.y, fx, fy, 112, 70) && !inBelly(B, cur, me.x, me.y) && B.hurt(B.lo, `bk${cur.seed}.${Math.floor(B.now/1200)}`)){ B.push(me.x - fx, me.y - fy, 46); B.fx('따끔', me.x, me.y - 70, '#ffb0c8'); } }
function backFloor(B, c, cur){ const [fx, fy] = posAt(B, B.now), f = faceOf(B, cur), al = Math.min(cl(cur.t*2), cl((cur.len - cur.t)*2));
  c.save(); c.globalAlpha = al; sector(c, fx, fy, 236, f + WEDGE, f - WEDGE + TAU, 'rgba(255,70,110,.12)'); sector(c, fx, fy, 236, f - WEDGE, f + WEDGE, 'rgba(120,255,150,.2)');
  c.translate(fx, fy); c.scale(1, .6); c.strokeStyle = 'rgba(150,255,170,.75)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 236, f - WEDGE, f + WEDGE); c.closePath(); c.stroke();
  c.strokeStyle = 'rgba(40,20,20,.5)'; c.lineWidth = 2; for (let i = 0; i < 26; i++){ const a = f + WEDGE + (i + .5)/26*(TAU - 2*WEDGE); c.beginPath(); c.moveTo(Math.cos(a)*120, Math.sin(a)*120); c.lineTo(Math.cos(a)*150, Math.sin(a)*150); c.stroke(); }
  c.restore(); }

// ===== ② 덩굴 번짐 =====
const VSPD = 70;
function vinesOf(B, cur){ return keep('v' + cur.seed, () => { const rn = B.rng(cur.seed + 'v'), n = Math.max(1, B.all.length);
    const roots = [[60, 520], [1040, 520], [550, 890], [160, 880], [940, 880], [60, 330], [1040, 330]];
    for (let i = roots.length - 1; i > 1; i--){ const j = 2 + Math.floor(rn()*(i - 1)); [roots[i], roots[j]] = [roots[j], roots[i]]; }
    const n1 = 2 + (n >= 3 ? 1 : 0), n2 = Math.min(4, 1 + Math.ceil(n/2)), out = []; let ri = 0;
    const mk = (root, t0) => { const [x0, y0] = root, x1 = B.hx + (x0 - B.hx)*.1, y1 = B.hy + 8, pts = [[x0, y0]], m = 8, sg = rn() < .5 ? 1 : -1;
      for (let i = 1; i <= m; i++){ const u = i/m, wv = Math.sin(u*Math.PI)*(40 + rn()*20)*(i%2 ? sg : -sg); const nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1; pts.push([lerp(x0, x1, u) + nx/L*wv, lerp(y0, y1, u) + ny/L*wv*.6]); }
      // 화분 가장자리에서 멈춰요
      const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const L = len[len.length - 1] - 70; return {pts, len, L, t0, reach:t0 + L/VSPD}; };
    for (let i = 0; i < n1; i++) out.push(mk(roots[ri++], .8 + i*.6));
    for (let i = 0; i < n2; i++) out.push(mk(roots[(ri++) % roots.length], 4.6 + i*.6));
    return out; }); }
function vAt(V, d){ for (let i = 1; i < V.pts.length; i++) if (d <= V.len[i]){ const u = (d - V.len[i - 1])/((V.len[i] - V.len[i - 1]) || 1); return [lerp(V.pts[i - 1][0], V.pts[i][0], u), lerp(V.pts[i - 1][1], V.pts[i][1], u)]; } return V.pts[V.pts.length - 1]; }
const localCut = new Map();
function cutAt(B, cur, i){ const vc = B.bs.vc; const s = vc && vc.s === cur.seed && vc.c && vc.c[i]; if (s) return s; const l = localCut.get(cur.seed + ':' + i); return l && B.now - l < 2500 ? l : 0; }
function vLen(B, cur, V, i){ const ct = cutAt(B, cur, i), tt = ct ? Math.min(cur.t, (ct - (B.now - cur.t*1000))/1000) : cur.t; return Math.max(0, Math.min(V.L, (tt - V.t0)*VSPD)); }
function vineTick(B, cur){ const vs = vinesOf(B, cur);
  vs.forEach((V, i) => { if (cur.t < V.reach || cutAt(B, cur, i)) return;
    if (first(`vr${cur.seed}.${i}`) && cur.t < V.reach + 1){ const [x, y] = posAt(B, B.now); B.fx('+', x + (i%3 - 1)*30, y - 200, '#9affb0'); B.sfx('warn', 200); }
    if (B.host && !(B.bs.vc && B.bs.vc.s === cur.seed && B.bs.vc.h && B.bs.vc.h[i]) && first(`vh${cur.seed}.${i}`)){ B.heal(Math.round(B.r.max*.03));
      B.tx(bs => { const v = bs.vc && bs.vc.s === cur.seed ? {...bs.vc} : {s:cur.seed, c:{}, h:{}}; if (v.h && v.h[i]) return undefined; v.h = {...(v.h || {}), [i]:1}; bs.vc = v; return bs; }); } }); }
function vineSwing(B, cur, cx, cy){ const vs = vinesOf(B, cur);
  for (let i = 0; i < vs.length; i++){ const V = vs[i]; if (cur.t < V.t0 || cur.t >= V.reach || cutAt(B, cur, i)) continue; const tp = vAt(V, vLen(B, cur, V, i));
    if (Math.hypot(tp[0] - cx, (tp[1] - cy)/.8) < 66){ localCut.set(cur.seed + ':' + i, B.now); const now = B.now;
      B.tx(bs => { const v = bs.vc && bs.vc.s === cur.seed ? {...bs.vc} : {s:cur.seed, c:{}, h:{}}; if ((v.c || {})[i] || (v.h || {})[i]) return undefined; v.c = {...(v.c || {}), [i]:now}; bs.vc = v; return bs; });
      B.fx('싹둑', tp[0], tp[1] - 40, '#d8ffd0'); B.sfx('hit', 60); return true; } }
  return false; }
function vineDraw(B, c, cur, under){ const vs = vinesOf(B, cur), al = cl((cur.len + .3 - cur.t)*2), h = half(B);
  vs.forEach((V, i) => { if (cur.t < V.t0) return; const L = vLen(B, cur, V, i), ct = cutAt(B, cur, i), wilt = ct ? cl((B.now - ct)/1200) : 0;
    if (L < 2) return;
    if (under){ const pts = []; for (let d = 0; d <= L; d += 12) pts.push(vAt(V, d)); pts.push(vAt(V, L)); c.save(); c.globalAlpha = al*(1 - wilt*.7);
      vinePath(c, pts.reverse(), 15, wilt ? '#4a3a2a' : h ? '#1e1426' : '#1c3412', wilt ? '#7a6a5a' : h ? '#5a3a6a' : '#4f7f34', '#0c1806'); c.restore(); return; }
    if (ct || L >= V.L) return; const tp = vAt(V, L), pulse = .8 + .2*Math.sin(B.now/120);
    c.save(); c.globalAlpha = al; const gl = c.createRadialGradient(tp[0], tp[1] - 6, 2, tp[0], tp[1] - 6, 34*pulse); gl.addColorStop(0, 'rgba(230,150,255,.9)'); gl.addColorStop(1, 'rgba(200,100,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(tp[0], tp[1] - 6, 34*pulse, 0, 7); c.fill();
    foxBell(c, tp[0], tp[1] - 12, 1.7, Math.sin(B.now/300 + i)*.3); c.restore(); }); }

// ===== ③ 어지럼 꽃가루 =====
function dizzyOf(B, cur){ return keep('d' + cur.seed, () => { const rn = B.rng(cur.seed + 'd'), th = [];
    for (let i = 0; i < 7; i++){ for (let k = 0; k < 20; k++){ const a = rn()*TAU, r = 190 + rn()*230, x = B.hx + Math.cos(a)*r, y = B.hy + 40 + Math.sin(a)*r*.6;
        if (x < 110 || x > 990 || y < 290 || y > 800) continue; if (th.some(q => Math.hypot(q[0] - x, q[1] - y) < 110)) continue; th.push([x, y, .5 + i*.25]); break; } }
    return {sg:rn() < .5 ? 1 : -1, th}; }); }
const SPROUT = [1.8, 4.2, 6.6, 9.0];
function sprouts(B, cur){ const out = []; SPROUT.forEach((t0, j) => { if (cur.t < t0 - .9) return; const al = B.alive.length ? B.alive : B.all; if (!al.length) return;
    out.push(keep(`ds${cur.seed}.${j}`, () => { const p = al[B.hash(cur.seed + j) % al.length]; return {x:p.x, y:p.y, t0}; })); }); return out; }
function dizzyTick(B, cur){ const D = dizzyOf(B, cur), f = cl((cur.t - .4)/.6)*cl((cur.len - cur.t)/.4);
  if (f > 0) B.ctl.steer = D.sg*(.5 + .22*Math.sin(cur.t*1.1))*f;
  for (const s of sprouts(B, cur)){ if (cur.t >= s.t0 && first(`dz${cur.seed}.${s.t0}`)) B.sfx('slam', 200); else if (cur.t >= s.t0 - .9 && first(`dw${cur.seed}.${s.t0}`)) B.sfx('warn', 200); }
  const me = B.me; if (!me || cur.t > cur.len - .3) return;
  D.th.forEach(([x, y, t0], i) => { if (cur.t > t0 + .3 && inEll(me.x, me.y, x, y, 40, 20) && B.hurt(B.lo + 40, `dt${cur.seed}.${i}.${Math.floor(B.now/1400)}`)) B.push(me.x - x, me.y - y, 40); });
  sprouts(B, cur).forEach((s, j) => { if (cur.t > s.t0 && inEll(me.x, me.y, s.x, s.y, 44, 22) && B.hurt(B.lo + 40, `ds${cur.seed}.${j}.${cur.t < s.t0 + .4 ? 0 : Math.floor(B.now/1400)}`)) B.push(me.x - s.x, me.y - s.y, 40); }); }
function thornPatch(c, x, y, g, al){ if (g <= 0) return; c.save(); c.globalAlpha = al; c.fillStyle = 'rgba(20,30,10,.7)'; c.beginPath(); c.ellipse(x, y, 40*g, 16*g, 0, 0, 7); c.fill(); c.fillStyle = '#2a3a1a';
  for (let i = 0; i < 10; i++){ const xx = x - 32*g + i*7*g; c.beginPath(); c.moveTo(xx - 4, y + 4); c.lineTo(xx + (i % 2 ? 4 : -4), y - (20 + (i % 3)*7)*g); c.lineTo(xx + 4, y + 4); c.fill(); } c.restore(); }
let pollenImg = null;
function pollen(){ if (pollenImg) return pollenImg; const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), q = g.createRadialGradient(64, 64, 6, 64, 64, 64); q.addColorStop(0, 'rgba(255,180,220,.55)'); q.addColorStop(1, 'rgba(255,180,220,0)'); g.fillStyle = q; g.fillRect(0, 0, 128, 128); return pollenImg = cv; }
function dizzyDraw(B, c, cur, under){ const D = dizzyOf(B, cur), a = cl((cur.t - .2)*2)*cl((cur.len - cur.t)*2); if (a <= 0) return; const t = B.now/1000;
  if (under){ D.th.forEach(([x, y, t0]) => thornPatch(c, x, y, ease((cur.t - t0)/.4), a));
    for (const s of sprouts(B, cur)){ if (cur.t < s.t0) warnCircle(c, s.x, s.y, 44, 22, cl((cur.t - s.t0 + .9)/.9), '255,120,180'); else thornPatch(c, s.x, s.y, ease((cur.t - s.t0)/.15), a); }
    return; }
  c.save(); c.globalAlpha = a*.5; const im = pollen(); for (let i = 0; i < 12; i++){ const x = (i*211 + t*24) % 1300 - 100, y = 300 + (i*83) % 560; c.drawImage(im, x - 130, y - 110, 260, 220); }
  c.globalAlpha = a; c.fillStyle = 'rgba(255,230,120,.75)'; for (let i = 0; i < 36; i++){ const x = (i*137 + t*40) % 1100, y = 290 + ((i*61 + t*20) % 560); c.fillRect(x, y, 3, 3); }
  // 머리 위 어지럼 소용돌이 (모두)
  c.strokeStyle = 'rgba(255,200,230,.85)'; c.lineWidth = 2; for (const p of B.alive){ c.beginPath(); for (let i = 0; i < 22; i++){ const an = i*.45 + t*6*D.sg, r2 = 2 + i*.5, px = p.x + Math.cos(an)*r2, py = p.y - 92 + Math.sin(an)*r2*.5; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
  c.restore(); }

// ===== ④ 쓰러진 척 =====
const SLUMP = [[1.0, 3.6], [4.6, 7.2], [8.2, 10.8]], TRAP = 170;
function slumpsOf(B, cur){ return keep('f' + cur.seed, () => { const rn = B.rng(cur.seed + 'f'), k = [true, false, rn() < .5]; for (let i = 2; i > 0; i--){ const j = Math.floor(rn()*(i + 1)); [k[i], k[j]] = [k[j], k[i]]; } return SLUMP.map(([a, b], i) => ({t0:a, t1:b, fake:k[i], i})); }); }
const slumpNow = (B, cur) => slumpsOf(B, cur).find(s => cur.t >= s.t0 && cur.t < s.t1 + .5);
function fakeTick(B, cur){ const s = slumpNow(B, cur); if (!s) return;
  if (s.fake && cur.t < s.t1 && first(`fs${cur.seed}.${s.i}`)) B.say(s.i%2 ? '다리가… 아파요' : '아파요… 좀 도와줘요', 2200);
  if (s.fake && cur.t >= s.t1 && !stunned(B)){ if (first(`fb${cur.seed}.${s.i}`)){ B.sfx('slam', 100); B.shake(); }
    const me = B.me, [fx, fy] = posAt(B, B.now); if (me && cur.t < s.t1 + .5 && inEll(me.x, me.y, fx, fy - 10, TRAP, TRAP*.6) && B.hurt(B.lo + 150, `fb${cur.seed}.${s.i}`)) B.push(me.x - fx, me.y - fy, 90); }
  if (!s.fake && cur.t < s.t1 && first(`fr${cur.seed}.${s.i}`)) B.sfx('warn', 100); }
function fakeFloor(B, c, cur){ const s = slumpNow(B, cur); if (!s) return; const [fx, fy] = posAt(B, B.now);
  if (s.fake && cur.t < s.t1){ c.save(); c.globalAlpha = .12 + .1*Math.sin(B.now/90); c.strokeStyle = '#ff6a9a'; c.lineWidth = 2; c.setLineDash([4, 10]); c.beginPath(); c.ellipse(fx, fy - 10, TRAP, TRAP*.6, 0, 0, 7); c.stroke(); c.restore(); }
  if (!s.fake && cur.t < s.t1){ // 찻주전자를 내려놓고 물을 줘요 (발 옆 물웅덩이)
    c.save(); c.globalAlpha = .5; c.fillStyle = 'rgba(150,210,255,.5)'; c.beginPath(); c.ellipse(fx + 70, fy + 8, 44, 12, 0, 0, 7); c.fill(); c.restore(); } }
function fakeTop(B, c, cur){ const s = slumpNow(B, cur); if (!s) return; const [fx, fy] = posAt(B, B.now);
  if (s.fake && cur.t >= s.t1){ const k = (cur.t - s.t1)/.5; c.save(); c.globalAlpha = cl(1 - k); c.lineCap = 'round';
    for (let i = 0; i < 28; i++){ const a = i/28*TAU, r1 = 40, r2 = TRAP*(.55 + k*.55); c.strokeStyle = i%2 ? '#2a1018' : '#5a2a48'; c.lineWidth = 6; c.beginPath(); c.moveTo(fx + Math.cos(a)*r1, fy - 40 + Math.sin(a)*r1*.6); c.lineTo(fx + Math.cos(a)*r2, fy - 30 + Math.sin(a)*r2*.6); c.stroke(); } c.restore(); }
  if (!s.fake && cur.t < s.t1){ const t = B.now/1000; c.save(); for (let i = 0; i < 9; i++){ const u = (t*1.6 + i/9) % 1; c.fillStyle = `rgba(160,215,255,${.9 - u*.5})`; c.beginPath(); c.ellipse(fx + 96 - u*30, fy - 70 + u*70, 3, 5, 0, 0, 7); c.fill(); } c.restore();
    // 내려놓은 찻주전자
    c.save(); c.translate(fx + 118, fy + 2); c.fillStyle = half(B) ? '#4a3a50' : '#e8dce8'; c.beginPath(); c.ellipse(0, -14, 20, 16, 0, 0, 7); c.fill(); c.fillStyle = '#b03a64'; c.beginPath(); c.arc(0, -32, 3.5, 0, 7); c.fill(); c.restore(); } }

// ===== ⑤ 꽃향기 (벌떼 · 태그) =====
const BEE_V = 112;
let swarm = null;
function holderOf(B, cur){ const sc = B.bs.sc, al = B.alive; let h = null;
  if (sc && sc.s === cur.seed) h = al.find(p => p.uid === sc.u); if (!h && B.target && !B.target.down) h = al.find(p => p.uid === B.target.uid) || null; return h || al[0] || null; }
function beesTick(B, cur, dt){ const on = cur.t > .8 && cur.t < cur.len - .6, h = holderOf(B, cur), [fx, fy] = posAt(B, B.now);
  if (!swarm || swarm.s !== cur.seed){ swarm = {s:cur.seed, x:fx - 60, y:fy - 80}; if (first('bz' + cur.seed)) B.sfx('warn', 100); }
  if (on && h){ const tx = h.x, ty = h.y - 34, dx = tx - swarm.x, dy = ty - swarm.y, d = Math.hypot(dx, dy); if (d > 3){ const st = Math.min(d, BEE_V*Math.min(.1, dt)); swarm.x += dx/d*st; swarm.y += dy/d*st; } }
  else if (!on && cur.t >= cur.len - .6){ swarm.y -= 220*Math.min(.1, dt); }
  const me = B.me; if (on && me && h && h.uid === me.uid && Math.hypot(swarm.x - me.x, (swarm.y - me.y + 34)/.8) < 44) B.hurt(B.lo + 30, `bee${cur.seed}.${Math.floor(B.now/1100)}`);
  // 호스트: 쫓기는 사람이 친구와 닿으면 향기를 넘겨요
  if (B.host && on && h){ const sc = B.bs.sc && B.bs.sc.s === cur.seed ? B.bs.sc : null, at = sc ? sc.at : 0;
    if (B.now - at > 1300){ const o = B.alive.find(p => p.uid !== h.uid && Math.hypot(p.x - h.x, p.y - h.y) < 52 && !(sc && p.uid === sc.p && B.now - at < 3500));
      if (o && txOk(B, 400)) B.tx(bs => { const c0 = bs.sc && bs.sc.s === cur.seed ? bs.sc : null; if (c0 && c0.u === o.uid) return undefined; bs.sc = {s:cur.seed, u:o.uid, p:h.uid, at:B.now}; return bs; }); } }
  const sc = B.bs.sc; if (sc && sc.s === cur.seed && first(`bt${cur.seed}.${sc.at}`)){ const p = B.all.find(q => q.uid === sc.u); if (p){ B.fx('♥', p.x, p.y - 96, '#ffc8e0'); B.sfx('hit', 100); } } }
function beesDraw(B, c, cur){ if (!swarm || swarm.s !== cur.seed) return; const h = holderOf(B, cur), t = B.now/1000, al = cl((cur.t - .4)*3)*cl((cur.len - cur.t)*2);
  c.save(); c.globalAlpha = al;
  if (h && cur.t < cur.len - .6){ c.strokeStyle = `rgba(255,90,140,${.5 + .4*Math.sin(t*6)})`; c.lineWidth = 2.5; c.setLineDash([6, 5]); c.beginPath(); c.ellipse(h.x, h.y + 2, 34, 12, 0, 0, 7); c.stroke(); c.setLineDash([]);
    flower(c, h.x + 16, h.y - 84, 9, '#f08ab0', '#fff0a0'); for (let i = 0; i < 4; i++){ const a = t*2 + i*1.6; c.fillStyle = 'rgba(255,170,210,.85)'; c.beginPath(); c.arc(h.x + Math.cos(a)*30, h.y - 60 + Math.sin(a)*10, 3, 0, 7); c.fill(); } }
  const {x, y} = swarm; c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(x, y + 46, 34, 9, 0, 0, 7); c.fill();
  for (let i = 0; i < 12; i++){ const a = t*7 + i*.7, bx = x + Math.cos(a)*(16 + (i % 3)*9), by = y + Math.sin(a*1.3)*(10 + (i % 2)*7);
    c.fillStyle = '#f0c030'; c.beginPath(); c.ellipse(bx, by, 7, 5, 0, 0, 7); c.fill(); c.fillStyle = '#2a1a10'; c.fillRect(bx - 1.5, by - 4, 3, 8); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(bx - 2, by - 5, 4, 2.4, 0, 0, 7); c.fill(); }
  c.restore(); }

// ===== ⑥ 두 찻잔 (야바위 → 기절) =====
const RL = 5.8, R0 = .4, SHOW = .9, MV0 = 1.2, PICK0 = 3.5, REV = 5.2, NR = 3;
const roundOf = cur => { const k = cur.t - R0; if (k < 0) return null; const i = Math.floor(k/RL); return i < NR ? {i, t:k - i*RL} : null; };
const cupHome = B => [[B.hx - 125, B.hy + 150], [B.hx + 125, B.hy + 150]];
function movesOf(B, cur, ri){ return keep(`cm${cur.seed}.${ri}`, () => { const rn = B.rng(`${cur.seed}c${ri}`), n = 4 + ri, d = (PICK0 - MV0 - .1)/n, mv = [];
    for (let k = 0; k < n; k++) mv.push({t:MV0 + k*d, d:d*.9, fake:k > 0 && rn() < .3, up:rn() < .5}); return {water:rn() < .5 ? 1 : 0, mv}; }); }
// which: 'w' 맹물 · 't' 찻물 → [x, y, 들림]
function cupPos(B, cur, ri, which, t){ const M = movesOf(B, cur, ri), H = cupHome(B); let slot = which === 'w' ? M.water : 1 - M.water;
  for (const m of M.mv){ if (t >= m.t + m.d){ if (!m.fake) slot = 1 - slot; continue; } if (t > m.t){ const u = ease((t - m.t)/m.d), lift = Math.sin(u*Math.PI)*(slot === 0 === m.up ? -46 : 46)*.6;
      const from = H[slot], to = H[1 - slot], k = m.fake ? Math.sin(u*Math.PI)*.42 : u; return [lerp(from[0], to[0], k), lerp(from[1], to[1], k) + lift, slot]; } break; }
  return [H[slot][0], H[slot][1], slot]; }
const waterSlot = (B, cur, ri) => cupPos(B, cur, ri, 'w', 99)[2];
const choiceOf = (p, cur, ri) => { const c = p.bp && p.bp.c; if (!c || c[0] !== cur.n || c[1] !== ri) return -1; return c[2]; };
let myCup = null;
function chooseCup(B, cur, ri, slot){ myCup = [cur.n, ri, slot]; B.setBp({c:myCup}); B.sfx('hit', 60); }
function cupsTick(B, cur){ const R = roundOf(cur); if (!R){ if (myCup && cur.t > R0 + NR*RL){ myCup = null; B.setBp(null); } return; }
  const {i, t} = R;
  if (t < .2 && first(`cs${cur.seed}.${i}`)) B.sfx('warn', 100);
  if (t >= REV && first(`cr${cur.seed}.${i}`)){ const ws = waterSlot(B, cur, i), me = B.me;
    B.sfx('slam', 100);
    if (me && myCup && myCup[0] === cur.n && myCup[1] === i && myCup[2] !== ws){ B.hurt(B.lo + 70, `cup${cur.seed}.${i}`); }
    if (B.host){ let good = 0, bad = 0; for (const p of B.alive){ const ch = choiceOf(p, cur, i); if (ch < 0) continue; if (ch === ws) good++; else bad++; }
      const ok = good > 0 && good > bad ? 1 : 0, sn = B.now;
      B.tx(bs => { const cu = bs.cu && bs.cu.s === cur.seed ? {...bs.cu, r:{...bs.cu.r}} : {s:cur.seed, r:{}}; if (cu.r[i] != null) return undefined; cu.r[i] = ok;
        const w = Object.values(cu.r).filter(v => v).length; bs.cu = cu; if (w >= 2 && !cu.st){ cu.st = 1; bs.stun = sn + 8000; bs.sa = sn; } return bs; }); } }
  // 잔 고르기는 tap · 휘두르기 (아래)
  if (B.bs.sa && B.now - B.bs.sa < 1500 && first('st' + B.bs.sa)){ B.say('그건… 내 잔인데', 2500); B.sfx('slam', 100); B.shake(); } }
function cupAtPoint(B, cur, x, y, r = 62){ const R = roundOf(cur); if (!R || R.t < PICK0 || R.t >= REV) return null; const H = cupHome(B);
  for (let s = 0; s < 2; s++) if (Math.hypot(H[s][0] - x, (H[s][1] - 20 - y)/.8) < r) return {ri:R.i, s}; return null; }
function drawCup(c, x, y, kind, covered, t, glow){ c.save(); c.translate(x, y); c.fillStyle = 'rgba(0,0,0,.4)'; c.beginPath(); c.ellipse(0, 6, 42, 11, 0, 0, 7); c.fill();
  if (glow){ c.strokeStyle = glow; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 4, 50, 15, 0, 0, 7); c.stroke(); }
  c.fillStyle = '#e8e0e8'; c.beginPath(); c.ellipse(0, 0, 40, 10, 0, 0, 7); c.fill(); const q = c.createLinearGradient(-32, -40, 32, 0); q.addColorStop(0, '#fffaff'); q.addColorStop(1, '#c8b8d0'); c.fillStyle = q;
  c.beginPath(); c.moveTo(-32, -40); c.lineTo(32, -40); c.lineTo(24, -3); c.lineTo(-24, -3); c.closePath(); c.fill(); c.strokeStyle = '#c8b8d0'; c.lineWidth = 5; c.beginPath(); c.arc(37, -24, 10, -1.3, 1.3); c.stroke();
  if (!covered){ c.fillStyle = kind === 't' ? '#3a5a1a' : '#d8f0ff'; c.beginPath(); c.ellipse(0, -40, 32, 7, 0, 0, 7); c.fill();
    if (kind === 't') for (let i = 0; i < 3; i++){ const u = (t*.8 + i/3) % 1; c.fillStyle = `rgba(140,220,90,${.6*(1 - u)})`; c.beginPath(); c.ellipse(-12 + i*12, -48 - u*34, 5 + u*5, 3 + u*3, 0, 0, 7); c.fill(); }
    else { c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-10, -41, 8, 2, 0, 0, 7); c.fill(); } }
  else { c.fillStyle = '#f0e8f0'; c.beginPath(); c.ellipse(0, -43, 38, 10, 0, 0, 7); c.fill(); c.fillStyle = '#d8c8e0'; c.beginPath(); c.ellipse(0, -49, 7, 5, 0, 0, 7); c.fill(); }
  c.restore(); }
function cupsDraw(B, c, cur){ const R = roundOf(cur), t = B.now/1000, H = cupHome(B), cu = B.bs.cu && B.bs.cu.s === cur.seed ? B.bs.cu : null;
  // 증거 자리 둘 (맞힌 만큼 맑은 잔이 놓여요)
  const wins = cu ? Object.values(cu.r || {}).filter(v => v).length : 0, al = cl(cur.t*2)*cl((cur.len - cur.t)*2);
  c.save(); c.globalAlpha = al; for (let k = 0; k < 2; k++){ const x = B.hx - 22 + k*44, y = B.hy + 205; c.strokeStyle = 'rgba(216,240,255,.6)'; c.lineWidth = 2; c.setLineDash([4, 4]); c.beginPath(); c.ellipse(x, y, 16, 6, 0, 0, 7); c.stroke(); c.setLineDash([]);
    if (k < wins){ c.fillStyle = 'rgba(216,240,255,.9)'; c.beginPath(); c.moveTo(x - 10, y - 18); c.lineTo(x + 10, y - 18); c.lineTo(x + 7, y); c.lineTo(x - 7, y); c.closePath(); c.fill(); } } c.restore();
  if (!R){ if (cur.t > R0 + NR*RL || cur.t < R0) return; }
  const {i, t: rt} = R, covered = rt >= SHOW && rt < REV, ws = waterSlot(B, cur, i), fade = cl((RL - rt)*3);
  c.save(); c.globalAlpha = fade*cl(rt*4);
  for (const kind of ['t', 'w']){ const [x, y, slot] = cupPos(B, cur, i, kind, rt);
    let glow = null; if (rt >= PICK0 && rt < REV){ glow = myCup && myCup[0] === cur.n && myCup[1] === i && myCup[2] === slot ? '#ffe0ec' : null; }
    if (rt >= REV) glow = kind === 'w' ? '#b8ffd0' : '#7ad04a';
    drawCup(c, x, y, kind, covered, t, glow);
    if (rt >= PICK0 && rt < REV){ let n = 0; for (const p of B.alive){ if (choiceOf(p.me ? {bp:{c:myCup}} : p, cur, i) === slot){ c.fillStyle = p.me ? '#ffd0e0' : '#d0e8ff'; c.beginPath(); c.arc(x - 20 + n*10, y + 22, 4, 0, 7); c.fill(); n++; } } }
    if (rt >= REV && kind === 't'){ const k = (rt - REV)/.6; c.save(); c.globalAlpha = .45*cl(1 - k); c.fillStyle = '#7ad04a'; c.beginPath(); c.ellipse(x, y - 30, 60 + k*30, 30 + k*14, 0, 0, 7); c.fill(); c.restore(); } }
  if (rt < SHOW){ const kw = cupPos(B, cur, i, 'w', rt), kt = cupPos(B, cur, i, 't', rt); text(c, '맹물', kw[0], kw[1] + 26, 20, '#d8f0ff'); text(c, '찻물', kt[0], kt[1] + 26, 20, '#b0f070'); }
  if (rt >= PICK0 && rt < REV){ const k = (rt - PICK0)/(REV - PICK0); c.strokeStyle = 'rgba(255,240,250,.7)'; c.lineWidth = 3; c.beginPath(); c.arc(B.hx, H[0][1] - 20, 14, -Math.PI/2, -Math.PI/2 + TAU*(1 - k)); c.stroke(); }
  c.restore(); }

// ===== ⑦ 시드는 바닥 =====
const BLOOM_D = 7000, BR = 74, PULSE0 = 3.0, PULSE_GAP = 3.2, PWARN = 1.4;
function seedsOf(B, cur){ return keep('s' + cur.seed, () => { const rn = B.rng(cur.seed + 's'), n = Math.min(8, 3 + B.all.length), o = rn()*TAU, out = [];
    for (let i = 0; i < n; i++){ const a = o + i/n*TAU, r = 1 + (i%2)*.25; out.push([B.hx + Math.cos(a)*165*r, B.hy + 20 + Math.sin(a)*100*r]); } return out; }); }
const pulses = cur => { const out = []; for (let j = 0; ; j++){ const t = PULSE0 + j*PULSE_GAP; if (t > cur.len - .4) break; out.push(t); } return out; };
const localBloom = new Map();
function bloomAt(B, cur, i){ const sd = B.bs.sd, b = sd && sd.s === cur.seed && sd.b && sd.b[i]; const l = localBloom.get(cur.seed + ':' + i); return Math.max(b || 0, l && B.now - l < 1500 ? l : 0); }
const bloomOn = (B, cur, i, ms) => { const b = bloomAt(B, cur, i); return b && ms >= b + 250 && ms < b + BLOOM_D; };
function inBloom(B, cur, x, y, ms){ const sd = seedsOf(B, cur); for (let i = 0; i < sd.length; i++) if (bloomOn(B, cur, i, ms) && inEll(x, y, sd[i][0], sd[i][1], BR, BR*.6)) return true; return false; }
function witherTick(B, cur){ const ps = pulses(cur), me = B.me;
  for (const [j, pt] of ps.entries()){ if (cur.t >= pt - PWARN && cur.t < pt && first(`pw${cur.seed}.${j}`)) B.sfx('warn', 100);
    if (cur.t >= pt && cur.t < pt + .3){ if (first(`pp${cur.seed}.${j}`)){ B.sfx('slam', 100); B.shake(); }
      if (me && !inBloom(B, cur, me.x, me.y, B.now)) B.hurt(B.lo + 180, `pp${cur.seed}.${j}`); } } }
function witherSwing(B, cur, cx, cy){ const sd = seedsOf(B, cur);
  for (let i = 0; i < sd.length; i++){ const b = bloomAt(B, cur, i); if (b && B.now < b + BLOOM_D + 400) continue; if (Math.hypot(sd[i][0] - cx, (sd[i][1] - cy)/.8) > 58) continue;
    localBloom.set(cur.seed + ':' + i, B.now); const now = B.now;
    B.tx(bs => { const s = bs.sd && bs.sd.s === cur.seed ? {...bs.sd, b:{...bs.sd.b}} : {s:cur.seed, b:{}}; const o = s.b[i]; if (o && now < o + BLOOM_D) return undefined; s.b[i] = now; bs.sd = s; return bs; });
    B.sfx('hit', 60); return true; }
  return false; }
function witherFloor(B, c, cur){ const sd = seedsOf(B, cur), t = B.now/1000, al = cl(cur.t*2)*cl((cur.len - cur.t)*2), ps = pulses(cur);
  // 독 예고: 바닥 전체가 보랏빛으로 차올라요 (꽃 둘레만 비어요)
  for (const pt of ps){ const k = cur.t - (pt - PWARN); if (k < 0 || k > PWARN + .7) continue; const warn = k < PWARN, a = warn ? .1 + .25*k/PWARN + .06*Math.sin(t*14) : .5*(1 - (k - PWARN)/.7);
    c.save(); c.globalAlpha = a*al; c.beginPath(); c.rect(0, 250, 1100, 650); for (let i = 0; i < sd.length; i++){ if (!bloomOn(B, cur, i, B.now + (warn ? (PWARN - k)*1000 : 0))) continue; c.moveTo(sd[i][0] + BR, sd[i][1]); c.ellipse(sd[i][0], sd[i][1], BR, BR*.6, 0, 0, TAU); }
    c.fillStyle = warn ? '#6a2a9a' : '#9a3ad0'; c.fill('evenodd'); c.restore(); }
  sd.forEach(([x, y], i) => { const b = bloomAt(B, cur, i); c.save(); c.globalAlpha = al;
    if (!b || B.now > b + BLOOM_D + 400){ c.fillStyle = '#8a6a3a'; c.beginPath(); c.ellipse(x, y, 11, 6, 0, 0, 7); c.fill(); const gl = .5 + .5*Math.sin(t*6 + i); c.fillStyle = `rgba(255,240,140,${gl})`; c.beginPath(); c.arc(x, y - 5, 5, 0, 7); c.fill();
      c.strokeStyle = `rgba(255,240,160,${.25 + .25*gl})`; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, BR*.5, BR*.3, 0, 0, 7); c.stroke(); c.restore(); return; }
    const k = (B.now - b)/1000, life = BLOOM_D/1000, gr = ease(k/.3), wl = cl((k - (life - 1.4))/1.4);
    c.globalAlpha = al*(1 - wl*.6); c.fillStyle = 'rgba(255,200,230,.28)'; c.beginPath(); c.ellipse(x, y, BR*gr, BR*.6*gr, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(255,220,240,.9)'; c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, BR*gr, BR*.6*gr, 0, 0, 7); c.stroke();
    // 남은 시간 (테두리가 줄어요)
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y, BR*gr + 5, BR*.6*gr + 4, 0, -Math.PI/2, -Math.PI/2 + TAU*cl(1 - k/life)); c.stroke();
    c.restore(); for (let q = 0; q < 6; q++){ const a = q/6*TAU; wiltFlower(c, x + Math.cos(a)*46*gr, y + Math.sin(a)*26*gr, 10*gr + .1, ['#f08ab0', '#c8a0e8', '#f4d050'][q % 3], gr, wl, al, q%2 ? 1 : -1); } }); }

// ===== 움직일 때: 발밑 덩굴이 몸을 실어 나르고 · 지나간 자리에 꽃이 피었다 시들어요 =====
function trailDraw(B, c){ const i0 = Math.floor(B.now/100), h = half(B);
  for (let i = i0 - 22; i <= i0; i++){ const [x, y, vx, vy] = posIdx(B, i), mk = moveK(vx, vy); if (mk < .08) continue;
    const k = (B.now - i*100)/1000, j = (B.hash('tj' + i) % 1000)/1000, life = 1.6 + j*.5; if (k < 0 || k > life) continue;
    const L = Math.hypot(vx, vy) || 1, dx = vx/L, dy = vy/L, side = i%2 ? 1 : -1, lat = side*(16 + j*80), fx = x - dy*lat, fy = y + dx*lat*.45 + 6, r = (10 + j*6)*(.75 + .5*mk);
    const grow = ease(k/.22), wilt = ease((k - .38)/(life*.45)), al = cl((life - k)/(life*.35)), col = (h ? ['#b050c0', '#8a3aa0', '#c070d0'] : ['#f08ab0', '#c8a0e8', '#f4d050', '#ff9ab8'])[i % (h ? 3 : 4)];
    if (k < .3){ c.save(); c.globalAlpha = (1 - k/.3)*.5; c.fillStyle = h ? 'rgba(200,120,255,.5)' : 'rgba(255,220,240,.5)'; c.beginPath(); c.ellipse(fx, fy - r, r*2.2, r*1.4, 0, 0, 7); c.fill(); c.restore(); }
    wiltFlower(c, fx, fy, r, col, grow, wilt, al, side);
    if (wilt > .6){ c.save(); c.globalAlpha = al*.5; c.fillStyle = '#4a3a2e'; c.beginPath(); c.ellipse(fx + side*r*1.6, fy + 2, r*.8, r*.3, 0, 0, 7); c.fill(); c.restore(); } } }
function footVines(B, c, front, fx, fy, vx, vy){ const mk = moveK(vx, vy); if (mk < .03) return; const t = B.now/1000, L = Math.hypot(vx, vy) || 1, dx = vx/L, dy = vy/L, h = half(B);
  const dark = h ? '#1e1426' : '#1c3412', lite = h ? '#5a3a6a' : '#5a8a3a', th = h ? '#08040c' : '#0c1806';
  c.save(); c.globalAlpha = cl(mk*1.6);
  if (!front){ c.save(); c.globalAlpha *= .55; c.fillStyle = h ? 'rgba(80,20,110,.5)' : 'rgba(20,50,10,.6)'; c.beginPath(); c.ellipse(fx, fy + 4, 120 + mk*30, 28 + mk*6, 0, 0, 7); c.fill(); c.restore();
    for (let i = 0; i < 7; i++){ const o = (i/6 - .5)*190, len = (60 + (i*37 % 50))*(.5 + mk), pts = [];
      for (let s = 0; s <= 12; s++){ const u = s/12, wv = Math.sin(u*5 + t*8 + i*1.9)*(6 + 16*u)*mk; pts.push([fx + o*(1 - u*.3) - dx*u*len - dy*wv, fy + 2 + o*.08 - dy*u*len*.6 + dx*wv*.6 + Math.sin(t*6 + i)*2]); }
      vinePath(c, pts.reverse(), 8 + mk*4, dark, lite, th); } }
  else { for (let i = 0; i < 6; i++){ const bx = fx + (i/5 - .5)*200, ph = t*7 + i*1.7, hgt = (24 + (i % 3)*11)*mk, pts = [];
      for (let s = 0; s <= 9; s++){ const u = s/9, cur = Math.sin(ph + u*4)*10*u + (i < 3 ? -1 : 1)*u*u*14; pts.push([bx + cur, fy + 8 - u*hgt - Math.abs(Math.sin(ph*.5))*4*u]); }
      vinePath(c, pts, 7 + mk*3, dark, lite, th); } }
  c.restore(); }

// ===== 50% 변신: 꽃들이 한꺼번에 시들고 꽃잎이 눈처럼 흩날리다 재로 · 가족 액자에서 초록 독이 번져 흘러요 =====
let FX = null;
function fxData(){ if (FX) return FX; let s = 977; const R = () => (s = (s*16807) % 2147483647)/2147483647;
  const ROOMF = []; for (let i = 0; i < 56; i++){ const x = 90 + R()*920, y = 280 + Math.pow(R(), .8)*560; ROOMF.push({x, y, r:9 + R()*9, side:R() < .5 ? -1 : 1, col:['#f08ab0', '#c8a0e8', '#f4d050', '#ff9ab8', '#e8a0c8'][i % 5], d:Math.hypot(x - 550, y - 560)/2200, pet:[0, 1, 2].map(j => ({td:.2 + j*.2 + R()*.25, ph:R()*6.28, wind:(R() - .3)*30, fall:110 + R()*80, rot:R()*6}))}); }
  const ASH = []; for (const f of ROOMF) for (const p of f.pet.slice(0, 2)) ASH.push({x:f.x + f.side*f.r*1.4 + p.wind*2.3 + Math.sin(2.3*2.8 + p.ph)*26*1.5, y:f.y - f.r*1.2 + p.fall*(2.3*.7 + 2.3*2.3*.12)/1.2 + 6, t0:1.4 + f.d + p.td + 2.0, r:3 + R()*5, rot:R()*3});
  for (let i = 0; i < 30; i++) ASH.push({x:120 + R()*860, y:300 + R()*520, t0:3.2 + R()*.8, r:4 + R()*7, rot:R()*3});
  const SNOW = []; for (let i = 0; i < 70; i++) SNOW.push({x:R(), t0:1.6 + R()*1.6, sp:.14 + R()*.14, ph:R()*6.28, r:1.5 + R()*2.5});
  const DRIPS = []; for (let i = 0; i < 7; i++) DRIPS.push({x:-60 + i*20 + R()*8, ds:.35 + R()*1.0, v:90 + R()*100, maxL:70 + R()*170, w:3 + R()*3, keep:i % 3 === 1, ph:R()*6});
  const VEINS = []; for (let i = 0; i < 12; i++){ const e = i % 4, sx = R(); let x = e === 0 ? 0 : e === 1 ? 1 : sx, y = e < 2 ? .25 + sx*.75 : e === 2 ? 1 : .05; const pts = [[x, y]], tx = .5 + (R() - .5)*.3, ty = .6 + (R() - .5)*.2;
    for (let k = 0; k < 14; k++){ const a = Math.atan2(ty - y, tx - x) + (R() - .5)*1.4; x += Math.cos(a)*.035; y += Math.sin(a)*.03; pts.push([x, y]); } VEINS.push({pts, d:R()*.4}); }
  return FX = {ROOMF, ASH, SNOW, DRIPS, VEINS}; }
const bell = (x, a, p, b) => x <= a || x >= b ? 0 : x < p ? ease((x - a)/(p - a)) : ease((b - x)/(b - p));
const petalAt = (f, P, k) => [f.x + f.side*f.r*1.4 + Math.sin(k*2.8 + P.ph)*26*Math.sqrt(k) + P.wind*k, f.y - f.r*1.2 + P.fall*(k*.7 + k*k*.12)/1.2];
const PX = 575, PY = 150;   // 가족 액자 (벽)
let ashCv = null;
function ashLayer(){ if (ashCv) return ashCv; ashCv = document.createElement('canvas'); ashCv.width = 1100; ashCv.height = 900; const g = ashCv.getContext('2d');
  for (const a of fxData().ASH){ g.globalAlpha = .3; g.fillStyle = '#6a6466'; g.beginPath(); g.ellipse(a.x, a.y, a.r*1.4, a.r*.5, a.rot*.2, 0, 7); g.fill(); g.fillStyle = '#8a8486'; g.beginPath(); g.ellipse(a.x + a.r*.6, a.y - 1, a.r*.6, a.r*.3, 0, 0, 7); g.fill(); } return ashCv; }
function transFloor(B, c){ const hk = B.ph2; if (hk < 0) return; const D = fxData();
  if (hk > 6.5) c.drawImage(ashLayer(), 0, 0); else for (const a of D.ASH){ const k = hk - a.t0; if (k < 0) continue; c.save(); c.globalAlpha = cl(k/.6)*.3; c.fillStyle = '#6a6466'; c.beginPath(); c.ellipse(a.x, a.y, a.r*1.4, a.r*.5, a.rot*.2, 0, 7); c.fill(); c.restore(); }
  if (hk < 4) for (const f of D.ROOMF){ const k = hk - f.d, grow = ease(k/.4), wilt = ease((k - .85)/.9), al = cl((3.6 - k)/.8); let left = 5; for (const P of f.pet) if (k > 1.4 + P.td) left--; wiltFlower(c, f.x, f.y, f.r, f.col, grow, wilt, al, f.side, Math.max(1, left)); } }
let portCv = null;
function portraitDraw(B, c){ if (!portCv){ portCv = document.createElement('canvas'); portCv.width = 260; portCv.height = 160; const g = portCv.getContext('2d'); g.scale(1.5, 1.5); portrait(g, 87, 53); }
  c.drawImage(portCv, PX - 87*.72, PY - 53*.72, 174*.72, 106.7*.72);
  const hk = B.ph2; if (hk < .3) return; const stage = hk < 4.6, fadeS = cl((5.6 - hk)/1.0), t = B.now/1000;
  c.save(); c.translate(PX, PY); c.scale(.72, .72); c.lineCap = 'round';
  const seep = stage ? cl((hk - .3)/1.2) : lerp(.35, 1, fadeS);
  if (seep > 0){ c.globalAlpha = seep*.85; const q = c.createLinearGradient(0, -10, 0, 38); q.addColorStop(0, 'rgba(60,140,30,0)'); q.addColorStop(1, 'rgba(110,220,60,.75)'); c.fillStyle = q; c.fillRect(-72, -10, 144, 48);
    c.strokeStyle = 'rgba(120,230,70,.9)'; c.lineWidth = 2.5; for (const ex of [-39, -29, 29, 39]){ const L = 6 + cl((hk - .4)/1.4)*30; c.beginPath(); c.moveTo(ex, -2); c.quadraticCurveTo(ex + 2, -2 + L*.5, ex - 1, -2 + L); c.stroke(); } }
  for (const Dp of fxData().DRIPS){ const k = hk - Dp.ds; if (k < 0) continue; const L = Math.min(Dp.maxL, k*Dp.v*(1 - Math.min(.6, k*.08))), al = stage ? cl(k*3) : Dp.keep ? lerp(.45, 1, fadeS) : fadeS; if (al <= 0) continue;
    const pts = []; for (let s = 0; s <= 10; s++){ const u = s/10; pts.push([Dp.x + Math.sin(u*5 + Dp.ph)*3*u, 48 + u*L]); }
    c.globalAlpha = al; for (const [col, wk] of [['rgba(30,80,20,.9)', 1.6], ['rgba(120,220,70,.95)', 1]]){ c.strokeStyle = col; c.lineWidth = Dp.w*wk; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
    const tp = pts[pts.length - 1]; c.fillStyle = 'rgba(140,235,90,.95)'; c.beginPath(); c.ellipse(tp[0], tp[1] + 2, Dp.w*.9, Dp.w*1.3, 0, 0, 7); c.fill(); }
  if (stage){ const fl = bell(hk, .3, 1.9, 4.6); c.globalAlpha = fl*(.6 + .4*Math.sin(t*23)); c.strokeStyle = '#8af050'; c.lineWidth = 5; c.strokeRect(-86, -52, 172, 104); }
  c.restore(); }
function transTop(B, c){ const hk = B.ph2; if (hk < 1 || hk > 6.2) return; const D = fxData(); c.save();
  for (const f of D.ROOMF) for (const P of f.pet){ const k = hk - f.d - 1.4 - P.td; if (k < 0 || k > 2.6) continue; const [x, y] = petalAt(f, P, k), al = cl((2.6 - k)/.7);
    if (k < 1.2){ c.globalAlpha = al; c.fillStyle = k < .6 ? cmix(f.col, '#7a4a2a', k/.6) : cmix('#7a4a2a', '#7c7678', (k - .6)/.6); c.beginPath(); c.ellipse(x, y, f.r*.5, f.r*.3*(.5 + .5*Math.abs(Math.sin(k*5 + P.ph))), P.rot + k*4, 0, 7); c.fill(); }
    else { const q = (k - 1.2)/1.4; c.globalAlpha = al*.9; for (let j = 0; j < 3; j++){ const a = P.ph + j*2.1; c.fillStyle = j % 2 ? '#8a8486' : '#5a5456'; c.beginPath(); c.ellipse(x + Math.cos(a)*q*12, y + Math.sin(a)*q*5 + q*q*10, f.r*.2*(1 - q*.5), f.r*.15*(1 - q*.5), 0, 0, 7); c.fill(); } } }
  c.restore(); }
function transScreen(B, c, w, h){ const hk = B.ph2; if (hk < 0 || hk > 6.4) return; const D = fxData(), t = B.now/1000;
  // 꽃잎 눈 (화면 위에서)
  c.save(); for (const s of D.SNOW){ const k = hk - s.t0; if (k < 0 || k > 3) continue; c.globalAlpha = cl(k*2)*cl((3 - k)/.8)*.75; c.fillStyle = k < 1.2 ? '#e8a0c8' : '#9a9496'; c.beginPath(); c.ellipse(s.x*w + Math.sin(k*2 + s.ph)*30, k*s.sp*h*2.2, s.r*1.3, s.r, k*2, 0, 7); c.fill(); } c.restore();
  const a = bell(hk, .8, 1.95, 3.8); if (a > 0){ c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = a*.55; c.fillStyle = '#7adf5a'; c.fillRect(0, 0, w, h); c.globalCompositeOperation = 'source-over';
    c.globalAlpha = a*.35*(.75 + .25*Math.sin(t*16)); const q = c.createRadialGradient(w/2, h*.6, Math.min(w, h)*.15, w/2, h*.6, Math.max(w, h)*.75); q.addColorStop(0, 'rgba(120,255,60,0)'); q.addColorStop(1, 'rgba(90,220,40,.9)'); c.fillStyle = q; c.fillRect(0, 0, w, h);
    c.lineCap = 'round'; for (const V of D.VEINS){ const u = cl((hk - .9 - V.d)/.9), n = Math.floor(u*(V.pts.length - 1)); if (n < 1) continue; c.globalAlpha = a*.85; c.strokeStyle = 'rgba(60,160,30,.9)';
      for (let i = 1; i <= n; i++){ c.lineWidth = 5*(1 - i/V.pts.length) + 1; c.beginPath(); c.moveTo(V.pts[i - 1][0]*w, V.pts[i - 1][1]*h); c.lineTo(V.pts[i][0]*w, V.pts[i][1]*h); c.stroke(); } } c.restore(); }
  if (hk > 1.7 && hk < 2.5) tint(c, w, h, '#f0d8ff', 1 - (hk - 1.7)/.8); }

// ===== 보스 몸 =====
function drawBoss(B, c, fx, fy, vx, vy, cur){ const mk = moveK(vx, vy), t = B.now/1000, st = stunned(B), hk = B.ph2;
  let hl = halfLook(B) ? 1 : 0, back = 0, flip = 1, sx = 1, rot = Math.sin(t*5.3)*.03*mk, dy = -mk*(6 + 3*Math.sin(t*9)), dx = 0, noTea = false;
  if (B.phase === 2 && hk >= 0 && hk < 2.2) dx = Math.sin(t*70)*6*(1 - hk/2.2);
  if (cur.id === 'back' && !st){ const f = faceOf(B, cur), s = Math.sin(f); back = cl(.55 - s*1.4); flip = Math.cos(f) < -.15 ? -1 : 1; sx = .82 + .18*Math.abs(s); }
  if (cur.id === 'fake' && !st){ const s = slumpNow(B, cur); if (s && cur.t < s.t1){ const k = ease((cur.t - s.t0)/.4); if (s.fake){ dy += 14*k; rot += -.13*k; } else { dy += 10*k; rot += .14*k; noTea = true; } } }
  if (st) rot += Math.sin(t*3)*.1;
  const W = ART.W*S, H = ART.H*S, x0 = ART.X0*S, y0 = ART.Y0*S;
  c.save(); c.translate(fx + dx, fy - POT + dy); c.rotate(rot); c.scale(sx*flip, 1);
  if (back < 1){ c.drawImage(sprite(noTea ? 4 + hl : hl, RES), x0, y0, W, H); }
  if (back > 0){ c.globalAlpha = back; c.drawImage(sprite(2 + hl, RES), x0, y0, W, H); c.globalAlpha = 1; }
  if (B.phase === 2 && hk >= 0 && hk < 1.9 && Math.floor(t*14) % 3 === 0){ c.globalAlpha = .35; c.globalCompositeOperation = 'lighter'; c.drawImage(sprite(1, RES), x0, y0, W, H); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; }
  c.restore(); }

// 혼자 보기 시험용 (엔진은 default 만 써요)
export const __test = { cur:B => pick(B, P, OPT), posAt, faceOf, vinesOf, vAt, vLen:(B, cur, i) => vLen(B, cur, vinesOf(B, cur)[i], i), waterSlot, cupHome, roundOf, seedsOf, slumpsOf, holderOf };

// ===== 모듈 =====
let lastSeed = '', curK = null;
function cur0(B){ return pick(B, P, OPT); }
const LINES = { back:'등은 만지지 마요. 따가워요.', vine:'꽃은 꾸준히 자라야 좋대요.', dizzy:'향이 좋죠? 깊이 들이마셔요.', bees:null, cups:'한 잔 드세요. 어느 쪽이든요.', wither:'꽃은 꺾여도 한동안은 예뻐요.' };

export default {
  reach: 125,
  get height(){ return curK ? 330 : 285; },
  pos(B){ return posAt(B, B.now); },
  tick(B, dt){ const cur = cur0(B); curK = halfLook(B);
    if (cur.id && cur.seed !== lastSeed){ lastSeed = cur.seed; const ln = cur.id === 'bees' ? `${B.targetNick} 님, 향기 좋죠?` : LINES[cur.id]; if (ln && cur.t < 1.5) B.say(ln, 2600); }
    if (B.phase === 2 && B.ph2 >= 0 && B.ph2 < TRANS){ const k = B.r.rageAt;
      if (B.ph2 >= 1.9 && first('tf' + k)){ B.shake(); B.sfx('slam', 0); }
      if (B.ph2 >= 2.2 && first('ts' + k)) B.say(`${B.targetNick} 님, 차는 꾸준히 드셔야 좋대요`, 3000); }
    wavesTick(B);
    if (stunned(B) && cur.id !== 'cups') return;
    if (cur.id === 'back') backTick(B, cur);
    else if (cur.id === 'vine') vineTick(B, cur);
    else if (cur.id === 'dizzy') dizzyTick(B, cur);
    else if (cur.id === 'fake') fakeTick(B, cur);
    else if (cur.id === 'bees') beesTick(B, cur, dt);
    else if (cur.id === 'cups') cupsTick(B, cur);
    else if (cur.id === 'wither') witherTick(B, cur);
    if (cur.id !== 'cups' && myCup){ myCup = null; B.setBp(null); } },
  hitMul(B, x, y){ const cur = cur0(B), st = stunned(B); let m = st ? 2 : 1;
    if (cur.id === 'back' && !st && cur.t > .3 && cur.t < cur.len - .2 && !inBelly(B, cur, x, y)) return 0;
    if (cur.id === 'fake' && !st){ const s = slumpNow(B, cur); if (s && !s.fake && cur.t < s.t1) m *= 1.5; }
    return m; },
  swing(B, cx, cy){ const cur = cur0(B);
    if (cur.id === 'vine') return vineSwing(B, cur, cx, cy);
    if (cur.id === 'wither') return witherSwing(B, cur, cx, cy);
    if (cur.id === 'cups'){ const h = cupAtPoint(B, cur, cx, cy, 70); if (h){ chooseCup(B, cur, h.ri, h.s); return true; } }
    return false; },
  tap(B, wx, wy){ const cur = cur0(B); if (cur.id !== 'cups') return null; const h = cupAtPoint(B, cur, wx, wy, 60); if (!h) return null; const H = cupHome(B);
    return {x:H[h.s][0], y:H[h.s][1] + 46, act:() => { const c2 = cur0(B), h2 = c2.id === 'cups' && cupAtPoint(B, c2, H[h.s][0], H[h.s][1] - 20, 80); if (h2) chooseCup(B, c2, h2.ri, h2.s); }}; },
  drawFloor(B, c){ const cur = cur0(B), [fx, fy] = posAt(B, B.now), i = Math.floor(B.now/100), v = posIdx(B, i);
    portraitDraw(B, c); transFloor(B, c);
    if (cur.id === 'wither') witherFloor(B, c, cur);
    trailDraw(B, c); footVines(B, c, false, fx, fy, v[2], v[3]);
    if (cur.id === 'back') backFloor(B, c, cur);
    else if (cur.id === 'vine') vineDraw(B, c, cur, true);
    else if (cur.id === 'dizzy') dizzyDraw(B, c, cur, true);
    else if (cur.id === 'fake') fakeFloor(B, c, cur);
    wavesDraw(B, c, true); },
  drawBody(B, c){ const cur = cur0(B), [fx, fy] = posAt(B, B.now), v = posIdx(B, Math.floor(B.now/100));
    drawBoss(B, c, fx, fy, v[2], v[3], cur); footVines(B, c, true, fx, fy, v[2], v[3]);
    if (cur.id === 'cups') cupsDraw(B, c, cur); },
  drawTop(B, c){ const cur = cur0(B);
    if (cur.id === 'vine') vineDraw(B, c, cur, false);
    else if (cur.id === 'dizzy') dizzyDraw(B, c, cur, false);
    else if (cur.id === 'fake') fakeTop(B, c, cur);
    else if (cur.id === 'bees') beesDraw(B, c, cur);
    wavesDraw(B, c, false); transTop(B, c); },
  drawScreen(B, c, w, h){ transScreen(B, c, w, h);
    const cur = cur0(B); if (cur.id === 'dizzy'){ const a = cl((cur.t - .3)*2)*cl((cur.len - cur.t)*2); tint(c, w, h, '#ff9ad0', .08*a*(1 + .4*Math.sin(B.now/400))); }
    if (cur.id === 'wither'){ for (const pt of pulses(cur)){ const k = cur.t - pt; if (k >= 0 && k < .5) tint(c, w, h, '#8a2ad0', .3*(1 - k/.5)); } } },
};
