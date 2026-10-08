// 핑크 시장 가게 만들기: 메뉴마다 다른 과정(3~6 단계)을 손으로 해요.
// openKitchen({shop, rec, n, onDone(score), onClose}) 로 열어요. 점수 평균 .85↑ PERFECT · .6↑ GOOD.
import { mattePainter, mixHex } from './char.js';
import { ART_PART as CROP } from './art/crops.js';
import { ART_PART as FISH } from './art/fish_a.js';
import { ART_PART as ORE } from './art/ores.js';
import { ART_PART as DISH } from './art/dishes.js';
import { UI } from './art/ui.js';
import { FORAGE, FORAGE_DRAW } from './forage.js';
import { MENU, ING } from './shopdata.js';
const FG = Object.fromEntries(FORAGE.map(f => [f.id, f]));

const W = 360, H = 540, K = 2, TAU = Math.PI*2;
const cv = document.createElement('canvas'); cv.width = W*K; cv.height = H*K; cv.id = 'kitCv';
let ctx = cv.getContext('2d');
function painter(c){ const m = mattePainter(c); m.tri = (pts,k)=>m.shape(()=>{c.beginPath();c.moveTo(...pts[0]);c.lineTo(...pts[1]);c.lineTo(...pts[2]);c.closePath();},k,[pts[1][0],pts[1][1]+6,8]); m.stitch=(fn,k='#fff',a=.85)=>{c.save();c.globalAlpha=a;c.setLineDash([2,1.6]);c.lineWidth=.9;c.strokeStyle=k;c.beginPath();fn(c);c.stroke();c.restore();}; return m; }
let d = painter(ctx);
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b-a)*t;

// ── 그리기 도우미 ──
function at(x, y, s, fn, rot=0){ ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s, s); try { fn(); } catch(e){ console.warn(e.message); } ctx.restore(); }
function txt(s, x, y, size=16, col='#2a2429', w=700, align='center'){ ctx.font = `${w} ${size}px Maple, sans-serif`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); }
function pill(x, y, w, h, col){ ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x, y, w, h, h/2); ctx.fill(); }
function staple(k){
  if (k==='flour'){ d.rr(-13, -12, 26, 30, 8, '#fff6e8'); d.rr(-13, -16, 26, 8, 4, '#f1e2c8'); d.dot(0, 4, 5, '#ffd35c'); }
  if (k==='rice'){ d.ell(0, 6, 17, 10, '#ffffff'); d.ell(0, -2, 15, 9, '#f8f6f0'); d.ell(0, 10, 17, 5, '#7fb2ff'); }
  if (k==='milk'){ d.rr(-9, -10, 18, 28, 6, '#ffffff'); d.rr(-6, -18, 12, 10, 3, '#eaf4ff'); d.rr(-9, 0, 18, 9, 2, '#9fd9ff', {flat:true}); }
  if (k==='egg'){ d.ell(0, 2, 12, 15, '#fff3e3'); d.dot(-4, -5, 2.4, '#ffffff', .8); }
  if (k==='sugar'){ d.rr(-12, -8, 24, 24, 5, '#ffffff'); d.rr(-12, -8, 24, 7, 3, '#ffd9e4', {flat:true}); }
}
function ing(k, x, y, s=.6, rot=0){ at(x, y, s, () => { if (ICON[k]) ICON[k](); else if (['flour','rice','milk','egg','sugar'].includes(k)) staple(k); else if (k[0]==='c') CROP[k](d, 0); else if (k[0]==='f') FISH[k](d, 0); else if (k[0]==='o') ORE[k](d, 0); else if (k[0]==='g'){ const f = FG[k]; FORAGE_DRAW[f.draw](ctx, f.col); } else if (k[0]==='d') DISH[k](d); else if (ICON[k]) ICON[k](); }, rot); }
function fishPath(x, y, s){ ctx.beginPath(); ctx.ellipse(x-4*s, y, 26*s, 16*s, 0, 0, TAU); ctx.moveTo(x+18*s, y); ctx.lineTo(x+34*s, y-14*s); ctx.quadraticCurveTo(x+30*s, y, x+34*s, y+14*s); ctx.closePath(); }
function bread(x, y, s, col){ d.shape(()=>fishPath(x, y, s), col, [x, y, 26*s]); const ln = mixHex(col, '#2a1420', .25); d.dot(x-20*s, y-4*s, 3*s, '#3a2430'); for (let i=0;i<3;i++) d.line(k=>{ k.arc(x-2*s+i*7*s, y, 9*s, -.85, .85); }, ln, 1.4*s); }
function bowl(x, y, r, soup, rim='#fbf6ef'){ d.ell(x, y, r, r*.3, soup); d.shape(()=>{ ctx.beginPath(); ctx.moveTo(x-r, y); ctx.quadraticCurveTo(x-r, y+r*.95, x, y+r*.95); ctx.quadraticCurveTo(x+r, y+r*.95, x+r, y); ctx.closePath(); }, rim, [x, y+r*.4, r]); }
function steam(x, y, n=3, gap=14, a=.7){ for (let i=0;i<n;i++) d.line(k=>{ k.moveTo(x+i*gap, y); k.quadraticCurveTo(x+i*gap-7, y-14, x+i*gap, y-28); k.quadraticCurveTo(x+i*gap+6, y-38, x+i*gap, y-48); }, '#ffffff', 3.5, a); }
function flame(x, y, n, k){ for (let i=0;i<n;i++){ const fx = x + (i-(n-1)/2)*22, h = 14 + 18*k + Math.sin(T*12+i)*3; d.shape(()=>{ ctx.beginPath(); ctx.moveTo(fx-8, y); ctx.quadraticCurveTo(fx-10, y-h*.6, fx, y-h); ctx.quadraticCurveTo(fx+10, y-h*.6, fx+8, y); ctx.closePath(); }, i%2 ? '#ffa14f' : '#ff6b86', [fx, y-h/2, 10], {flat:true}); } }
function counter(top='#ffe9d2', board='#e0b07a'){ ctx.fillStyle = top; ctx.fillRect(0, 0, W, H); ctx.fillStyle = mixHex(top, '#e48fac', .12); for (let y=0;y<H;y+=30) for (let x=((y/30)%2)*15; x<W; x+=30) ctx.fillRect(x, y, 15, 15); d.rr(-20, 150, W+40, 420, 30, board); d.rr(-20, 150, W+40, 18, 14, mixHex(board, '#ffffff', .3), {flat:true}); }
function gaugeH(x, y, w, h, segs, mark, zone){ d.rr(x, y, w, h, h/2, '#fffdfd', {flat:true}); let px = x+4; for (const [k, col] of segs){ const zw = (w-8)*k; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(px, y+4, zw, h-8, 4); ctx.fill(); px += zw; } if (zone){ ctx.strokeStyle = '#2f9e6a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x+4+(w-8)*zone[0], y+1, (w-8)*(zone[1]-zone[0]), h-2, 5); ctx.stroke(); } const mx = x+4+(w-8)*clamp(mark); ctx.fillStyle = '#2a2429'; ctx.beginPath(); ctx.moveTo(mx-8, y-11); ctx.lineTo(mx+8, y-11); ctx.lineTo(mx, y+1); ctx.closePath(); ctx.fill(); ctx.fillRect(mx-1.5, y+1, 3, h-2); }
function hint(s, y=H-26){ ctx.font = '700 14px Maple, sans-serif'; const w = ctx.measureText(s).width + 28; d.rr(W/2-w/2, y-16, w, 32, 16, '#e48fac', {flat:true}); txt(s, W/2, y+1, 14, '#fff'); }
function hand(x, y, a=1){ ctx.save(); ctx.globalAlpha = a; d.ell(x, y, 11, 13, '#ffe4d2'); d.rr(x-4, y-28, 9, 24, 4.5, '#ffe4d2'); ctx.restore(); }

// 그릇·도구 아이콘 (ICON 키로 ing() 에서도 써요)
const ICON = {
  bung: () => bread(0, 0, .75, '#e39a45'),
  kimbap: () => { for (const [x,y] of [[-12,4],[10,-2],[0,10]]){ d.circle(x, y, 11, '#2f3a2a'); d.circle(x, y, 8.5, '#ffffff', {flat:true}); d.dot(x-3, y-2, 2.4, '#ff9533'); d.dot(x+3, y-1, 2.2, '#4fae3c'); d.dot(x, y+3, 2.2, '#ffd35c'); } },
  udon: () => { bowl(0, -2, 20, '#f1d8a8'); for (let i=0;i<4;i++) d.line(k=>{ k.moveTo(-14+i*7, -4); k.quadraticCurveTo(-10+i*7, -1, -12+i*7, 2); }, '#fff8e6', 3); d.ell(8, -4, 5, 2.4, '#5aa35a'); },
  hansik: () => { bowl(0, -2, 20, '#ffffff'); d.ell(-6, -4, 5, 2.4, '#ff7a3d'); d.ell(5, -5, 5, 2.4, '#4fae3c'); d.ell(0, -1, 4, 2, '#ffd35c'); },
  juice: () => { d.shape(()=>{ ctx.beginPath(); ctx.moveTo(-13, -14); ctx.lineTo(13, -14); ctx.lineTo(9, 18); ctx.lineTo(-9, 18); ctx.closePath(); }, '#ffa14f', [0, 2, 16]); d.ell(0, -14, 13, 3.4, '#ffc78f'); d.line(k=>{ k.moveTo(4, -14); k.lineTo(9, -24); k.lineTo(15, -24); }, '#ff6b86', 2.6); d.circle(-9, -15, 6, '#ff4f6d'); },
  jar: () => { d.rr(-14, -10, 28, 28, 8, '#c25a86'); d.rr(-11, -6, 22, 18, 6, '#a8406c', {flat:true}); d.rr(-15, -19, 30, 10, 4, '#fff3e3'); d.rr(-9, 0, 18, 10, 3, '#fffaf2', {flat:true}); },
  perfume: () => { d.rr(-5, -20, 10, 8, 3, '#ffd35c'); d.circle(0, 5, 14, '#c9b5ff'); d.circle(0, 5, 10, '#e2c9ff', {flat:true}); d.dot(-5, 0, 2.6, '#fff', .8); },
  vase: () => { d.shape(()=>{ ctx.beginPath(); ctx.moveTo(-6, -18); ctx.lineTo(6, -18); ctx.quadraticCurveTo(4, -8, 14, 2); ctx.quadraticCurveTo(18, 16, 0, 18); ctx.quadraticCurveTo(-18, 16, -14, 2); ctx.quadraticCurveTo(-4, -8, -6, -18); ctx.closePath(); }, '#e9e3d6', [0, 2, 16]); d.line(k=>{ k.moveTo(-12, 6); k.quadraticCurveTo(0, 0, 12, 6); }, '#7fb2ff', 2.4); },
  candy: () => { d.rr(-2, 0, 4, 22, 2, '#ffffff'); d.circle(0, -6, 15, '#ff9fc4'); d.line(k=>{ k.arc(0, -6, 8, 0, 5); }, '#ffffff', 3); },
  shaved: () => { d.shape(()=>{ ctx.beginPath(); ctx.moveTo(-16, 4); ctx.lineTo(16, 4); ctx.lineTo(10, 18); ctx.lineTo(-10, 18); ctx.closePath(); }, '#9fd9ff', [0, 10, 16]); d.circle(0, -4, 16, '#ffe3ec'); d.circle(5, -14, 5, '#ff4f6d'); },
  petal: () => { d.ell(0, 0, 9, 14, '#ff9fc4'); d.ell(0, -3, 5, 8, '#ffc2dc', {flat:true}); },
  wilted: () => { d.ell(0, 0, 9, 14, '#b9a07a'); d.line(k=>{ k.moveTo(-5, -8); k.lineTo(4, 6); }, '#8a7350', 1.6); },
  plate: () => { d.ell(0, 0, 26, 12, '#ffffff'); d.ell(0, -1, 18, 8, '#f6f2ee', {flat:true}); },
  noodle: () => { for (let i=0;i<4;i++) d.line(k=>{ k.moveTo(-16, -6+i*4); k.quadraticCurveTo(0, -10+i*4, 16, -6+i*4); }, '#fff3d9', 3.5); },
};

// ── 판정 ──
const zoneScore = (v, [a, b]) => { const m = (a+b)/2, h = (b-a)/2; if (v >= a && v <= b) return 1 - .2*Math.abs(v-m)/h; return Math.max(0, .7 - Math.abs(v - (v < a ? a : b))*3); };
const gradeOf = s => s >= .85 ? ['PERFECT', '#e2486a'] : s >= .6 ? ['GOOD', '#e9a93a'] : ['아쉬움', '#a297b4'];

// ── 조작 15 가지 ──
// 공통: m.update(dt) · m.draw() · m.down/move/up(p) · this.done(score)
const MECH = {
  // 꾹 누르기: 누르는 동안 차오르고, 초록 칸에서 떼요
  hold: (o) => ({ v:0, on:false, time:0,
    update(dt){ if (this.on){ this.v += (o.speed||.42)*dt; if (this.v > 1.06){ this.on = false; this.fx = '넘쳤어요!'; this.finish(0); } } },
    down(){ this.on = true; }, up(){ if (!this.on) return; this.on = false; if (this.v > .03) this.finish(zoneScore(this.v, o.zone)); },
    draw(){ counter(o.bg||'#fff4e6', o.board||'#e0b07a'); o.scene?.(this.v, this.on);
      const gx = 40, gy = 430; gaugeH(gx, gy, W-80, 24, [[o.zone[0], '#f3e6ec'], [o.zone[1]-o.zone[0], '#9fe3c4'], [1-o.zone[1], '#ffb3c2']], this.v, o.zone);
      txt(o.gl || '모자람 · 딱 좋아 · 넘침', W/2, gy+40, 12, '#6f6569', 400);
      hint(this.on ? '지금 떼면 여기서 멈춰요' : '꾹 누르고 있다가 초록 칸에서 떼기'); } }),
  // 타이밍: 색이 변하는 동안 알맞은 순간에 탭 (rounds 번)
  timing: (o) => ({ p:0, dir:1, r:0, sc:[], wait:0,
    update(dt){ if (this.wait > 0){ this.wait -= dt; if (this.wait <= 0){ this.p = 0; } return; } this.p += dt*(o.speed||.28)*(o.oneway === false ? this.dir : 1); if (o.oneway === false){ if (this.p > 1){ this.p = 1; this.dir = -1; } if (this.p < 0){ this.p = 0; this.dir = 1; } } else if (this.p >= 1){ this.tap(0); } },
    tap(s){ this.sc.push(s ?? zoneScore(this.p, o.zone)); this.r++; this.fx = (o.rounds||1) > 1 && this.r < o.rounds ? (o.between || '뒤집었어요!') : null; if (this.r >= (o.rounds||1)) this.finish(this.sc.reduce((a,b)=>a+b,0)/this.sc.length); else this.wait = .6; },
    down(){ if (this.wait <= 0) this.tap(); },
    draw(){ counter(o.bg||'#fff4e6', o.board); const segs = o.segs; let acc = 0, col = segs[0][1]; for (const [k, c] of segs){ if (this.p >= acc) col = c; acc += k; }
      const blended = (() => { let a = 0; for (let i=0;i<segs.length;i++){ const [k, c] = segs[i]; if (this.p <= a+k || i === segs.length-1){ const nx = segs[Math.min(i+1, segs.length-1)][1]; return mixHex(c, nx, clamp((this.p-a)/k)*.5); } a += k; } return col; })();
      o.scene(blended, this.p, this.r);
      gaugeH(30, 430, W-60, 26, segs, this.p, o.zone); txt(o.gl, W/2, 474, 12, '#6f6569', 400);
      if ((o.rounds||1) > 1) txt(`${Math.min(this.r+1, o.rounds)} / ${o.rounds} ${o.roundName||'번째'}`, W/2, 110, 15, '#5b3345');
      hint(o.tip || '초록 칸에 왔을 때 탭!'); } }),
  // 돌리기: 가운데를 빙글빙글
  rotate: (o) => ({ ang:0, last:null, t:0,
    update(dt){ this.t += dt; if (this.t > o.time){ this.finish(clamp(this.ang/(o.turns*TAU))*.75); } },
    down(p){ this.last = Math.atan2(p.y-CY, p.x-W/2); }, up(){ this.last = null; },
    move(p){ if (this.last == null) return; const a = Math.atan2(p.y-CY, p.x-W/2); let da = a - this.last; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU; this.ang += Math.abs(da); this.last = a; if (this.ang >= o.turns*TAU) this.finish(1 - .35*clamp((this.t - o.time*.5)/(o.time*.5))); },
    draw(){ counter(o.bg||'#eaf6ff', o.board||'#c3b8d2'); const k = clamp(this.ang/(o.turns*TAU));
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(W/2, CY, 118, 0, TAU); ctx.stroke();
      ctx.strokeStyle = '#e48fac'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(W/2, CY, 118, -Math.PI/2, -Math.PI/2 + TAU*k); ctx.stroke();
      o.scene(k, this.ang);
      const ha = this.ang - Math.PI/2; d.circle(W/2 + Math.cos(ha)*118, CY + Math.sin(ha)*118, 17, '#ffffff'); d.circle(W/2 + Math.cos(ha)*118, CY + Math.sin(ha)*118, 9, '#e48fac', {flat:true});
      setTimer(o.time - this.t); hint(o.tip || '손가락으로 원을 그리며 돌리기'); } }),
  // 연타
  mash: (o) => ({ n:0, t:0, pop:0, idle:0,
    update(dt){ this.t += dt; this.pop = Math.max(0, this.pop - dt*6); if (o.exact){ if (this.n > 0) this.idle += dt; if (this.idle > 1.1) this.finish(this.n === o.taps ? 1 : Math.abs(this.n - o.taps) === 1 ? .55 : .15); } else if (this.t > o.time) this.finish(clamp(this.n/o.taps)*.75); },
    down(){ this.n++; this.pop = 1; this.idle = 0; if (!o.exact && this.n >= o.taps) this.finish(1 - .3*clamp((this.t - o.time*.5)/(o.time*.5))); },
    draw(){ counter(o.bg, o.board); o.scene(this.pop, this.n); if (!o.exact){ setTimer(o.time - this.t); const k = clamp(this.n/o.taps); pill(60, 440, W-120, 16, '#fffdfd'); pill(60, 440, Math.max(16, (W-120)*k), 16, '#ffc23f'); txt(`${this.n} / ${o.taps}`, W/2, 476, 14, '#5b3345'); } else txt(`${this.n} 번`, W/2, 450, 26, '#5b3345');
      hint(o.tip || '빠르게 탭탭탭!'); } }),
  // 긋기: 점선 따라 한 번에
  slice: (o) => ({ i:0, pts:[], sc:[], cuts:[],
    down(p){ this.pts = [p]; }, move(p){ if (this.pts.length) this.pts.push(p); },
    up(){ const L = o.lines[this.i], P = this.pts; this.pts = []; if (!L || P.length < 3) return; const [x1,y1,x2,y2] = L, a = P[0], b = P[P.length-1];
      const e1 = Math.min(Math.hypot(a.x-x1, a.y-y1) + Math.hypot(b.x-x2, b.y-y2), Math.hypot(a.x-x2, a.y-y2) + Math.hypot(b.x-x1, b.y-y1));
      const len = Math.hypot(x2-x1, y2-y1); let dev = 0; for (const q of P){ dev += Math.abs((x2-x1)*(y1-q.y) - (x1-q.x)*(y2-y1))/len; } dev /= P.length;
      const s = clamp(1 - e1/(len*.9)) * .6 + clamp(1 - dev/26) * .4; if (s < .2 && e1 > len) return;
      this.sc.push(s); this.cuts.push([a, b]); this.i++; if (this.i >= o.lines.length) this.finish(this.sc.reduce((x,y)=>x+y,0)/this.sc.length); },
    draw(){ counter(o.bg, o.board); o.scene(this.i, this.cuts);
      const L = o.lines[this.i]; if (L){ ctx.setLineDash([8, 7]); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(L[0], L[1]); ctx.lineTo(L[2], L[3]); ctx.stroke(); ctx.setLineDash([]); d.dot(L[0], L[1], 7, '#e48fac'); }
      for (const [a, b] of this.cuts){ ctx.strokeStyle = 'rgba(90,40,60,.55)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      if (this.pts.length > 1){ ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); this.pts.forEach((q, j) => j ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke(); }
      txt(`${this.i} / ${o.lines.length}`, W/2, 110, 15, '#5b3345'); hint(o.tip || '분홍 점에서 시작해 점선 따라 슥'); } }),
  // 흔들기: 좌우로 왔다 갔다
  shake: (o) => ({ n:0, t:0, x0:null, dir:0, off:0, ext:null,
    update(dt){ this.t += dt; this.off *= Math.pow(.02, dt); if (this.t > o.time) this.finish(clamp(this.n/o.count)*.75); },
    down(p){ this.x0 = p.x; this.ext = p.x; this.dir = 0; }, up(){ this.x0 = null; },
    move(p){ if (this.x0 == null) return; this.off = clamp(p.x - this.x0, -60, 60); const dx = p.x - this.ext; if (this.dir >= 0 && dx < -28){ if (this.dir > 0) this.count(); this.dir = -1; this.ext = p.x; } else if (this.dir <= 0 && dx > 28){ if (this.dir < 0) this.count(); this.dir = 1; this.ext = p.x; } else if ((this.dir > 0 && p.x > this.ext) || (this.dir < 0 && p.x < this.ext)) this.ext = p.x; },
    count(){ this.n++; if (this.n >= o.count) this.finish(1 - .3*clamp((this.t - o.time*.5)/(o.time*.5))); },
    draw(){ counter(o.bg, o.board); o.scene(this.off, this.n); setTimer(o.time - this.t); const k = clamp(this.n/o.count); pill(60, 440, W-120, 16, '#fffdfd'); pill(60, 440, Math.max(16, (W-120)*k), 16, '#ffc23f'); hint(o.tip || '좌우로 쓱쓱 흔들기'); } }),
  // 따라 그리기
  trace: (o) => { const path = o.path(); return { path, hit:new Array(path.length).fill(false), on:false, stroke:[], off:0, tot:0,
    down(p){ this.on = true; this.add(p); }, move(p){ if (this.on) this.add(p); },
    up(){ this.on = false; const cov = this.hit.filter(Boolean).length/this.hit.length; if (cov > .55) this.finish(cov*.8 + clamp(1 - this.off/Math.max(1, this.tot)*1.5)*.2); },
    add(p){ this.stroke.push(p); this.tot++; let near = false; this.path.forEach((q, i) => { if (Math.hypot(q.x-p.x, q.y-p.y) < 20){ this.hit[i] = true; near = true; } }); if (!near) this.off++; const cov = this.hit.filter(Boolean).length/this.hit.length; if (cov > .97) this.finish(.8 + clamp(1 - this.off/this.tot*1.5)*.2); },
    draw(){ counter(o.bg, o.board); o.scene?.();
      ctx.setLineDash([6, 7]); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 4; ctx.beginPath(); this.path.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke(); ctx.setLineDash([]);
      d.dot(this.path[0].x, this.path[0].y, 7, '#e48fac');
      ctx.strokeStyle = o.col; ctx.lineWidth = o.w || 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); this.stroke.forEach((q, i) => i && Math.hypot(q.x-this.stroke[i-1].x, q.y-this.stroke[i-1].y) < 40 ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke();
      const cov = this.hit.filter(Boolean).length/this.hit.length; txt(`${Math.round(cov*100)}%`, W/2, 110, 15, '#5b3345'); hint(o.tip || '분홍 점부터 점선 따라 그리기'); } }; },
  // 끌어 놓기: 쟁반 재료를 자리에
  drag: (o) => ({ held:null, placed:[], sc:[],
    tray(){ const g = Math.min(72, 320/o.items.length); return o.items.map((k, i) => ({k, x: W/2 + (i - (o.items.length-1)/2)*g, y: 470, g})); },
    down(p){ const t = this.tray().find(t => Math.abs(t.x-p.x) < t.g/2 && Math.abs(t.y-p.y) < 34); if (t) this.held = {k:t.k, x:p.x, y:p.y}; },
    move(p){ if (this.held){ this.held.x = p.x; this.held.y = p.y; } },
    up(){ const h = this.held; this.held = null; if (!h) return; const free = o.targets.map((t, i) => ({...t, i})).filter(t => !this.placed[t.i]); let best = null, bd = 1e9; for (const t of free){ const dd = Math.hypot(t.x-h.x, t.y-h.y); if (dd < bd){ bd = dd; best = t; } } if (!best || bd > best.r*1.6) return;
      const ok = !best.k || best.k === h.k; this.placed[best.i] = {k:h.k, x:h.x, y:h.y}; this.sc.push((ok ? 1 : .3) * clamp(1 - Math.max(0, bd - best.r*.35)/(best.r*1.3)) );
      if (this.placed.filter(Boolean).length >= o.targets.length) this.finish(this.sc.reduce((a,b)=>a+b,0)/this.sc.length); },
    draw(){ counter(o.bg, o.board); o.scene?.(this.placed);
      o.targets.forEach((t, i) => { if (this.placed[i]) return; ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, TAU); ctx.stroke(); ctx.setLineDash([]); if (t.k){ ctx.save(); ctx.globalAlpha = .35; ing(t.k, t.x, t.y, o.s||.6); ctx.restore(); } });
      this.placed.forEach(p => p && ing(p.k, p.x, p.y, o.s||.6));
      d.rr(14, 428, W-28, 84, 22, '#fffdfd', {flat:true}); this.tray().forEach(t => { const w = Math.min(60, t.g-6); d.rr(t.x-w/2, t.y-32, w, 60, 16, '#fff3f7', {flat:true}); ing(t.k, t.x, t.y-2, Math.min(.7, w/86)); });
      if (this.held) ing(this.held.k, this.held.x, this.held.y, (o.s||.6)*1.1);
      txt(o.tip || '아래 쟁반에서 끌어다 놓기', W/2, 410, 13, '#5b3345'); } }),
  // 온도 유지: 누르면 올라가고 떼면 내려가요
  slider: (o) => ({ v:.25, vel:0, on:false, t:0, inn:0, zt:0,
    zone(){ if (!o.move) return o.zone; const c = (o.zone[0]+o.zone[1])/2 + Math.sin(this.t*o.move)*.2, h = (o.zone[1]-o.zone[0])/2; return [c-h, c+h]; },
    update(dt){ this.t += dt; this.vel += (this.on ? 1.3 : -1.1)*dt; this.vel *= Math.pow(.25, dt); this.v = clamp(this.v + this.vel*dt*1.6); if (this.v <= 0 || this.v >= 1) this.vel *= -.2; const z = this.zone(); if (this.v >= z[0] && this.v <= z[1]) this.inn += dt; if (this.t >= o.time) this.finish(clamp(this.inn/o.time*1.15)); },
    down(){ this.on = true; }, up(){ this.on = false; },
    draw(){ counter(o.bg, o.board); const z = this.zone(), ins = this.v >= z[0] && this.v <= z[1]; o.scene(this.v, ins, z);
      const bx = W-52, by = 150, bh = 250; d.rr(bx, by, 26, bh, 13, '#fffdfd', {flat:true}); ctx.fillStyle = 'rgba(159,227,196,.9)'; ctx.fillRect(bx+4, by+bh-bh*z[1], 18, bh*(z[1]-z[0]));
      d.rr(bx+5, by+bh-bh*this.v-5, 16, 10, 5, ins ? '#2f9e6a' : '#e2486a', {flat:true}); ctx.fillStyle = '#ff6b4f'; ctx.beginPath(); ctx.arc(bx+13, by+bh+14, 13, 0, TAU); ctx.fill();
      setTimer(o.time - this.t); pill(60, 440, W-120, 14, '#fffdfd'); pill(60, 440, Math.max(14, (W-120)*clamp(this.inn/o.time)), 14, '#9fe3c4'); txt(o.gl || '초록 칸 안에 있는 시간만큼 점수', W/2, 472, 12, '#6f6569', 400);
      hint(o.tip || '꾹 누르면 올라가고, 떼면 내려가요'); } }),
  // 골라 탭하기
  pick: (o) => { const items = []; const n = o.n || 12; for (let i=0;i<n;i++){ items.push({good: i < (o.good||8), x: 0, y: 0, gone:false, w:Math.random()*TAU}); } items.sort(() => Math.random()-.5); items.forEach((it, i) => { it.x = 70 + (i%4)*74; it.y = 190 + Math.floor(i/4)*78; });
    return { items, t:0, got:0, bad:0,
    update(dt){ this.t += dt; if (this.t > o.time) this.end(); },
    end(){ const total = this.items.filter(i => i.good).length; this.finish(clamp((this.got - this.bad)/total)); },
    down(p){ const it = this.items.find(i => !i.gone && Math.hypot(i.x-p.x, i.y-p.y) < 30); if (!it) return; it.gone = true; if (it.good) this.got++; else { this.bad++; this.fx = '앗, 시든 거예요'; } if (this.got >= this.items.filter(i => i.good).length) this.end(); },
    draw(){ counter(o.bg, o.board); for (const it of this.items){ if (it.gone) continue; ing(it.good ? o.goodK : o.badK, it.x, it.y + Math.sin(T*2+it.w)*2, .95); } setTimer(o.time - this.t); txt(`${this.got} 개`, W/2, 110, 15, '#5b3345'); hint(o.tip || '좋은 것만 골라 탭'); } }; },
  // 참기: 다 될 때까지 기다렸다가 '지금!'에 탭
  wait: (o) => ({ t:0, pen:0, ready:-1, shake:0,
    update(dt){ this.t += dt; this.shake = Math.max(0, this.shake - dt*4); if (this.t >= o.time && this.ready < 0) this.ready = 0; if (this.ready >= 0){ this.ready += dt; if (this.ready > 2.2) this.finish(Math.max(0, .45 - this.pen)); } },
    down(){ if (this.ready < 0){ this.pen += .3; this.shake = 1; this.fx = '아직이에요!'; } else this.finish(clamp(1 - this.pen - Math.max(0, this.ready - .6)*.4)); },
    draw(){ counter(o.bg, o.board); const k = clamp(this.t/o.time); ctx.save(); ctx.translate(Math.sin(T*60)*6*this.shake, 0); o.scene(k, this.ready >= 0); ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(W/2, 110, 26, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#ffc23f'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(W/2, 110, 26, -Math.PI/2, -Math.PI/2 + TAU*k); ctx.stroke();
      if (this.ready >= 0){ const s = 1 + Math.sin(T*14)*.06; ctx.save(); ctx.translate(W/2, 430); ctx.scale(s, s); d.rr(-70, -26, 140, 52, 26, '#ff5a8a', {flat:true}); txt('지금!', 0, 1, 26, '#fff'); ctx.restore(); }
      else txt(o.waitText || '기다리는 중… 건드리지 마세요', W/2, 430, 15, '#5b3345');
      hint(o.tip || '다 될 때까지 참았다가 "지금!"에 탭'); } }),
  // 떨어뜨리기: 흔들리는 위치에서 탭 → 떨어져요
  drop: (o) => ({ i:0, t:0, fall:null, sc:[], stuck:[],
    update(dt){ this.t += dt; if (this.fall){ this.fall.vy += 900*dt; this.fall.y += this.fall.vy*dt; if (this.fall.y >= o.ty){ const dx = Math.abs(this.fall.x - this.tx()); const s = clamp(1 - dx/(o.tol||46)); this.sc.push(s); this.stuck.push({x:this.fall.x - this.tx(), k:this.fall.k, s}); this.fx = s > .8 ? '딱!' : s > .4 ? '조금 빗나감' : '떨어졌어요'; this.fall = null; this.i++; if (this.i >= o.n) this.finish(this.sc.reduce((a,b)=>a+b,0)/o.n); } } },
    hx(){ return W/2 + Math.sin(this.t*(o.speed||2.2))*120; }, tx(){ return o.tmove ? W/2 + Math.sin(this.t*o.tmove)*70 : W/2; },
    down(){ if (this.fall || this.i >= o.n) return; this.fall = {x:this.hx(), y:120, vy:0, k:o.items[this.i % o.items.length]}; },
    draw(){ counter(o.bg, o.board); const tx = this.tx(); o.scene(tx, this.stuck); if (!this.fall && this.i < o.n){ d.line(k=>{ k.moveTo(this.hx(), 70); k.lineTo(this.hx(), 100); }, '#c3b8d2', 2); ing(o.items[this.i % o.items.length], this.hx(), 120, o.s||.7); }
      if (this.fall) ing(this.fall.k, this.fall.x, this.fall.y, o.s||.7); txt(`${this.i} / ${o.n}`, W/2, 64, 14, '#5b3345'); hint(o.tip || '그릇 바로 위에 왔을 때 탭!'); } }),
  // 리듬: 원이 줄어들어 딱 맞을 때 탭
  rhythm: (o) => ({ t:0, b:0, sc:[], cuts:0,
    beatT(i){ return .9 + i*(o.gap||.7); },
    update(dt){ this.t += dt; const bt = this.beatT(this.b); if (this.t > bt + .35){ this.sc.push(0); this.fx = '놓쳤어요'; this.next(); } },
    next(){ this.b++; if (this.b >= o.beats) this.finish(this.sc.reduce((a,c)=>a+c,0)/o.beats); },
    down(){ if (this.b >= o.beats) return; const e = Math.abs(this.t - this.beatT(this.b)); if (e > .45) return; const s = clamp(1 - Math.max(0, e - .05)/.3); this.sc.push(s); this.cuts++; this.fx = s > .8 ? '탁!' : s > .4 ? '조금 빨랐어요' : null; this.next(); },
    draw(){ counter(o.bg, o.board); o.scene(this.cuts); const bt = this.beatT(this.b), k = clamp((bt - this.t)/.8);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(W/2, 400, 26, 0, TAU); ctx.stroke(); if (this.b < o.beats){ ctx.strokeStyle = '#e48fac'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(W/2, 400, 26 + k*70, 0, TAU); ctx.stroke(); }
      txt(`${this.b} / ${o.beats}`, W/2, 110, 15, '#5b3345'); hint(o.tip || '분홍 원이 흰 원에 닿을 때 탭'); } }),
  // 섞기: 병을 탭해서 목표 색에 맞추기 → 완료
  mix: (o) => ({ drops:o.bottles.map(() => 0),
    color(){ const tot = this.drops.reduce((a,b)=>a+b,0); if (!tot) return '#f4f0ec'; let r=0,g=0,b=0; o.bottles.forEach((bt, i) => { const n = parseInt(bt.col.slice(1),16); r += (n>>16)*this.drops[i]; g += (n>>8&255)*this.drops[i]; b += (n&255)*this.drops[i]; }); return '#'+[r,g,b].map(v => Math.round(v/tot).toString(16).padStart(2,'0')).join(''); },
    down(p){ o.bottles.forEach((bt, i) => { const x = 70 + i*110; if (Math.hypot(p.x-x, p.y-380) < 40) this.drops[i]++; }); if (p.y > 440 && p.y < 490){ if (p.x < W/2) this.drops = this.drops.map(() => 0); else this.done1(); } },
    done1(){ const c1 = parseInt(this.color().slice(1),16), c2 = parseInt(o.target.slice(1),16); const dd = Math.hypot((c1>>16)-(c2>>16), (c1>>8&255)-(c2>>8&255), (c1&255)-(c2&255)); this.finish(clamp(1 - dd/110)); },
    draw(){ counter(o.bg, o.board); txt('목표 향', 100, 120, 13, '#5b3345'); txt('지금 섞은 향', 260, 120, 13, '#5b3345');
      d.circle(100, 190, 46, o.target); d.circle(260, 190, 46, this.color()); d.dot(84, 172, 8, '#fff', .5); d.dot(244, 172, 8, '#fff', .5);
      o.bottles.forEach((bt, i) => { const x = 70 + i*110; d.rr(x-6, 340, 12, 12, 3, '#ffd35c'); d.circle(x, 380, 30, bt.col); txt(bt.label, x, 424, 12, '#5b3345'); txt(`×${this.drops[i]}`, x, 381, 14, '#fff'); });
      d.rr(30, 444, 140, 42, 21, '#fbdbe5', {flat:true}); txt('다시 섞기', 100, 466, 15, '#e48fac'); d.rr(190, 444, 140, 42, 21, '#e48fac', {flat:true}); txt('완성', 260, 466, 15, '#fff');
      hint(o.tip || '병을 탭해서 한 방울씩, 목표 색에 맞추기'); } }),
  // 간 맞추기: + / − 로 눈금 맞추고 완료
  meter: (o) => ({ v:o.start ?? .15, taste:false,
    down(p){ if (p.y > 360 && p.y < 420){ if (p.x < 130) this.v = clamp(this.v + o.plus[1]); else if (p.x < 230) this.taste = true; else this.v = clamp(this.v - o.minus[1]); } if (p.y > 440 && p.y < 490) this.finish(clamp(1 - Math.abs(this.v - o.target)*3.2)); },
    draw(){ counter(o.bg, o.board); o.scene(this.v); const diff = this.v - o.target;
      if (this.taste){ d.rr(60, 100, 240, 44, 22, '#fffdfd', {flat:true}); txt(Math.abs(diff) < .06 ? '딱 좋아요!' : diff > 0 ? (diff > .2 ? '으악 짜요!' : '살짝 짜요') : (diff < -.2 ? '너무 싱거워요' : '살짝 싱거워요'), W/2, 123, 16, '#5b3345'); }
      [[o.plus[0], 80, '#fff3f7'], ['맛보기', 180, '#fff6d9'], [o.minus[0], 280, '#eaf6ff']].forEach(([s, x, col]) => { d.rr(x-46, 364, 92, 52, 18, col); txt(s, x, 391, 15, '#5b3345'); });
      d.rr(60, 444, 240, 42, 21, '#e48fac', {flat:true}); txt('이대로 완성', W/2, 466, 15, '#fff'); hint(o.tip || '맛보면서 간 맞추기'); } }),
};
const CY = 280;

// ── 12 가게 · 단계 ──
const BAT = '#f6e3b4', RAW = '#f1cf8a', GOLD = '#e39a45', BURNT = '#5e3a2a';
const moldScene = (fill) => { d.rr(70, 190, 220, 180, 18, '#6f7280'); d.rr(78, 198, 204, 164, 13, '#4b4d58', {flat:true}); d.rr(44, 270, 30, 18, 9, '#9a6a45'); d.rr(286, 270, 30, 18, 9, '#9a6a45'); [[130,240],[230,240],[130,320],[230,320]].forEach(([x,y], i) => { ctx.save(); fishPath(x, y, 1.05); ctx.fillStyle = '#33343c'; ctx.fill(); ctx.restore(); fill?.(x, y, i); }); };
const potScene = (soup, lvl=.6, fl=.5) => { flame(W/2, 400, 5, fl); d.rr(70, 230, 220, 150, 26, '#7d8090'); d.rr(80, 238, 200, 26, 12, soup, {flat:true}); d.rr(40, 250, 34, 14, 7, '#585a66'); d.rr(286, 250, 34, 14, 7, '#585a66'); };
const knife = () => { d.rr(-6, -70, 12, 60, 4, '#c3b8d2'); d.rr(-8, -14, 16, 26, 6, '#5b3345'); };
const nm = k => ING[k]?.[0] || k;
const kc = k => ING[k]?.[1] || '#ffb3c2';
const uniq = ks => [...new Set(ks)];
const STAPLES = ['flour','rice','milk','egg','sugar'];
const ringPos = (n, cx=W/2, cy=280, r=72) => n === 1 ? [[cx, cy]] : Array.from({length:n}, (_, i) => [cx + Math.cos(-Math.PI/2 + i*TAU/n)*r, cy + Math.sin(-Math.PI/2 + i*TAU/n)*r*.82]);
const josa = (w, a, b) => { const c = w.charCodeAt(w.length-1); return w + ((c - 0xac00) % 28 ? a : b); };

// 그릇 장면
const V = {
  pot: (col='#e6f0f5') => potScene(col, .6, .5),
  bowl: (col='#fbf6ef') => bowl(W/2, 262, 120, col),
  rice: () => { bowl(W/2, 262, 120, '#ffffff', '#5b5266'); for (let i=0;i<16;i++) d.dot(W/2 - 80 + (i*37)%160, 254 + (i*11)%18, 2.5, '#f1ede4'); },
  pan: (col='#585a66') => { flame(W/2, 400, 4, .5); d.rr(W/2+100, 270, 80, 14, 7, '#5b3345'); d.ell(W/2, 280, 124, 74, '#4a4a52'); d.ell(W/2, 274, 110, 62, col, {flat:true}); },
  plate: () => at(W/2, 280, 5, () => ICON.plate()),
  board: () => { d.rr(50, 196, 260, 170, 20, '#e0b07a'); d.rr(56, 202, 248, 10, 5, '#f3cf9d', {flat:true}); },
  tray: (col='#e8e3ef') => { d.rr(50, 190, 260, 180, 14, '#c3b8d2'); d.rr(60, 200, 240, 160, 10, col, {flat:true}); },
  glass: () => d.shape(()=>{ ctx.beginPath(); ctx.moveTo(W/2-60, 200); ctx.lineTo(W/2+60, 200); ctx.lineTo(W/2+44, 380); ctx.lineTo(W/2-44, 380); ctx.closePath(); }, '#f4fbff', [W/2, 290, 60]),
  jar: () => { d.rr(W/2-70, 190, 140, 190, 30, '#f4fbff'); d.rr(W/2-56, 168, 112, 26, 8, '#fff3e3'); },
  blender: () => { d.rr(W/2-50, 340, 100, 50, 12, '#5b5266'); d.shape(()=>{ ctx.beginPath(); ctx.moveTo(W/2-70, 180); ctx.lineTo(W/2+70, 180); ctx.lineTo(W/2+48, 340); ctx.lineTo(W/2-48, 340); ctx.closePath(); }, '#eaf6ff', [W/2, 260, 70]); },
  gim: () => { d.rr(70, 190, 220, 200, 8, '#c9b37a'); d.rr(84, 200, 192, 180, 6, '#2f3a2a'); d.rr(92, 206, 176, 160, 6, '#ffffff'); },
  mold: () => moldScene((x, y) => { ctx.save(); fishPath(x, y, 1.02); ctx.fillStyle = BAT; ctx.fill(); ctx.restore(); }),
  sang: () => { d.rr(30, 180, 300, 210, 20, '#9a6a45'); d.rr(40, 190, 280, 190, 14, '#b5845a', {flat:true}); },
  lamp: () => { d.rr(W/2-10, 330, 20, 50, 6, '#c98e5b'); d.circle(W/2, 270, 80, '#f4fbff'); },
  dish: (col='#e9e3d6') => { d.ell(W/2, 290, 130, 70, col); d.ell(W/2, 284, 100, 50, mixHex(col, '#ffffff', .4), {flat:true}); },
  bag: () => { d.rr(W/2-80, 200, 160, 180, 10, '#f3e3c4'); d.rr(W/2-80, 200, 160, 26, 6, '#e9cfa0', {flat:true}); },
};
const PATH = {
  spiral: () => { const p = []; for (let a=0; a<TAU*2.2; a+=.15){ const r = 10 + a*9; p.push({x:W/2 + Math.cos(a)*r, y:CY + Math.sin(a)*r*.75}); } return p; },
  zigzag: () => { const p = []; for (let x=-110; x<=110; x+=5) p.push({x:W/2 + x, y:CY + ((Math.floor((x+110)/30)%2) ? 1 : -1)*(16 - Math.abs(((x+110)%30)-15)*1.6) + 16}); return p; },
  wave: () => { const p = []; for (let x=-110; x<=110; x+=6) p.push({x:W/2 + x, y:CY + Math.sin(x/18)*22}); return p; },
  heart: () => { const p = []; for (let t=0; t<TAU; t+=.08){ p.push({x:W/2 + 16*Math.pow(Math.sin(t),3)*5, y:CY - (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t))*5}); } return p; },
  circle: () => { const p = []; for (let t=0; t<=TAU; t+=.1) p.push({x:W/2 + Math.cos(t)*90, y:CY + Math.sin(t)*60}); return p; },
};

// ── 단계 만들기 ──
const S = (mech, t, g, h, o) => ({mech, t, g, h, o});
const B = {
  add: (keys, vessel='bowl', t='재료 넣기', h) => { const ks = uniq(keys).slice(0, 6); const pos = vessel === 'gim' ? ks.map((_, i) => [W/2, 225 + i*(140/Math.max(1, ks.length-1))]) : ringPos(ks.length); return S('drag', t, '배치', h || `${ks.map(nm).join(', ')} 자리 맞춰 올리기`, {items:ks, s:.55, targets:ks.map((k, i) => ({x:pos[i][0], y:pos[i][1], r:28, k})), scene:()=>V[vessel]()}); },
  chop: (k, t, h) => S('rhythm', t || `${nm(k)} 썰기`, '리듬', h || '칼질 박자에 맞춰 탭', {beats:6, gap:.6, scene:(n)=>{ V.board(); for (let i=0;i<6;i++){ if (i < n) ing(k, 100 + i*30, 284, .5); else if (i === n) ing(k, 100 + i*30, 284, .85); } at(W/2+80, 236, 1, knife); }}),
  cut: (k, n=3, t, h) => { const lines = Array.from({length:n}, (_, i) => { const y = n === 1 ? 280 : 225 + i*110/(n-1); return [100, y, 260, y]; }); return S('slice', t || `${nm(k)} 손질`, '긋기', h || '점선 따라 한 번에 슥', {lines, scene:()=>{ V.board(); ing(k, W/2, 284, 3.2); }}); },
  cutBlock: (col, n=3, t='자르기', h='점선 따라 반듯하게') => { const lines = Array.from({length:n}, (_, i) => { const x = 110 + (i+1)*140/(n+1); return [x, 210, x, 350]; }); return S('slice', t, '긋기', h, {lines, scene:()=>{ V.board(); d.rr(100, 210, 160, 140, 12, col); d.rr(104, 214, 152, 18, 8, mixHex(col, '#ffffff', .3), {flat:true}); }}); },
  roll: () => S('slice', '김밥 말기', '스와이프', '아래에서 위로 쓸어 올리기', {lines:[[W/2,380,W/2,200]], tip:'아래 분홍 점에서 위로 쭉', scene:(i)=>{ d.rr(70, 190, 220, 200, 8, '#c9b37a'); if (!i){ V.gim(); d.rr(100, 300, 160, 8, 4, '#ff9533'); d.rr(100, 312, 160, 8, 4, '#4fae3c'); d.rr(100, 324, 160, 8, 4, '#ffd35c'); } else d.rr(84, 260, 192, 46, 23, '#2f3a2a'); }}),
  stir: (col, bits, t, h, turns=4, base='#7d8090') => S('rotate', t, '돌리기', h || '숟가락으로 빙글빙글', {turns, time:turns*1.8, scene:(k, ang)=>{ d.circle(W/2, CY, 92, base); d.circle(W/2, CY, 82, col, {flat:true}); for (let i=0;i<10;i++){ const a = ang*.6 + i*TAU/10, r = 22 + (i%3)*18; ing(bits[i % bits.length], W/2 + Math.cos(a)*r, CY + Math.sin(a)*r, .4); } }}),
  timing: (t, h, o) => S('timing', t, '타이밍', h, o),
  boil: (col, t='보글보글 끓이기', h='넘치기 직전에 불 줄이기', keys=[]) => B.timing(t, h, {zone:[.6,.8], speed:.26, segs:[[.4, mixHex(col, '#ffffff', .5)],[.2, mixHex(col, '#ffffff', .2)],[.2, col],[.2,'#e2486a']], gl:'아직 · 보글보글 · 딱 좋아 · 넘침', tip:'딱 좋아 칸에서 탭!', scene:(c, p)=>{ potScene(c, .6, p); keys.forEach((k, i) => ing(k, 120 + i*50, 250 + Math.sin(T*4+i)*3, .5)); for (let i=0;i<Math.round(p*12);i++) d.circle(100 + (i*41)%160, 250 - (T*30 + i*13)%20, 4 + (i%3), '#fff6e8'); }}),
  noodle: (t='면 삶기') => B.timing(t, '꼬들꼬들 칸에서 건지기', {zone:[.5,.7], speed:.25, segs:[[.45,'#fffaf0'],[.25,'#fff0c9'],[.3,'#f3d9a0']], gl:'딱딱 · 꼬들꼬들 · 퍼짐', tip:'꼬들꼬들 칸에서 탭!', scene:(col)=>{ potScene('#e6f0f5', .6, .6); for (let i=0;i<5;i++) d.line(k=>{ k.moveTo(110, 252 + i*4); k.quadraticCurveTo(180, 240 + i*4 + Math.sin(T*3+i)*6, 250, 252 + i*4); }, col, 4); steam(130, 230, 4, 30); }}),
  float: (col, t, h='동동 떠오르면 건지기') => B.timing(t, h, {zone:[.55,.75], speed:.26, segs:[[.55,'#e6f0f5'],[.2,'#cfeefb'],[.25,'#b9a07a']], gl:'가라앉음 · 동동 · 퍼짐', tip:'떠오르면 탭!', scene:(c, p)=>{ potScene('#e6f0f5', .6, .6); for (let i=0;i<6;i++) d.ell(110 + i*28, 262 - p*16 + Math.sin(T*5+i)*2, 10, 7, col); }}),
  grill: (k, t, h='노릇노릇할 때 뒤집기, 앞뒤 2번', rounds=2) => B.timing(t || `${nm(k)} 굽기`, h, {rounds, roundName:'면', zone:[.48,.7], speed:.24, segs:[[.45, RAW],[.25, GOLD],[.12,'#b5703a'],[.18, BURNT]], gl:'덜 익음 · 노릇노릇 · 진함 · 탐', scene:(c, p)=>{ flame(W/2, 400, 5, .6); d.rr(60, 210, 240, 150, 16, '#4a4a52'); for (let i=0;i<6;i++){ ctx.fillStyle = '#585a66'; ctx.fillRect(70 + i*40, 214, 6, 142); } ing(k, W/2, 284, 2.6); ctx.save(); ctx.globalAlpha = clamp(p)*.75; ctx.fillStyle = mixHex('#c9853a', '#2a1410', clamp((p-.6)/.4)); ctx.beginPath(); ctx.ellipse(W/2, 284, 70, 40, 0, 0, TAU); ctx.fill(); ctx.restore(); if (p > .8) for (let i=0;i<3;i++) d.line(q=>{ q.moveTo(140+i*40, 210); q.quadraticCurveTo(130+i*40, 190, 142+i*40, 170); }, '#6f6569', 3, .6); }}),
  pancake: (col, t='부치기') => B.timing(t, '노릇할 때 뒤집기, 앞뒤 2번', {rounds:2, roundName:'면', zone:[.48,.7], speed:.24, segs:[[.45, col],[.25, GOLD],[.12,'#b5703a'],[.18, BURNT]], gl:'덜 익음 · 노릇노릇 · 진함 · 탐', scene:(c)=>{ V.pan(); d.ell(W/2, 274, 92, 50, c); }}),
  oven: (col, t='오븐에 굽기', h='오븐 창 색 보고 꺼내기') => B.timing(t, h, {zone:[.5,.72], speed:.24, segs:[[.45, mixHex(col, '#ffffff', .4)],[.27, col],[.28, BURNT]], gl:'덜 구움 · 딱 좋아 · 탐', scene:(c)=>{ d.rr(60, 180, 240, 220, 20, '#e8e3ef'); d.rr(80, 210, 200, 140, 14, '#3a3440'); ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = '#ff9533'; ctx.fillRect(84, 214, 192, 132); ctx.restore(); d.rr(110, 280, 140, 50, 10, c); for (let i=0;i<3;i++) d.circle(110 + i*70, 196, 7, '#c3b8d2'); }}),
  thick: (col, t='농도 보기', h='숟가락에서 뚝 떨어지는 순간 불 끄기') => B.timing(t, h, {zone:[.55,.75], speed:.25, segs:[[.5, mixHex(col, '#ffffff', .5)],[.2, col],[.3, mixHex(col, '#2a1420', .5)]], gl:'묽음 · 딱 좋아 · 딱딱', tip:'방울이 뚝 떨어질 때 탭!', scene:(c, p)=>{ potScene(c, .6, .5); at(W/2, 150, 1, () => { d.rr(-6, -60, 12, 60, 6, '#c98e5b'); d.ell(0, 6, 22, 12, '#c98e5b'); }); const dl = 14 + p*60; d.line(k=>{ k.moveTo(W/2, 162); k.lineTo(W/2, 162 + dl); }, c, 8*(1 - p*.4)); d.circle(W/2, 166 + dl, 8 + p*4, c); }}),
  heat: (col, t, h='꾹 누르면 불이 세지고, 떼면 약해져요', zone=[.45,.65], keys=[]) => S('slider', t, '슬라이더', h, {zone, time:6, scene:(v)=>{ potScene(mixHex(col, '#5a1a10', clamp(v-.5)*.8), .6, v); keys.forEach((k, i) => ing(k, 130 + i*50, 250 + Math.sin(T*6+i)*2, .5)); if (v > .7) steam(140, 230, 4, 26); if (v > .85) txt('탈 것 같아요!', W/2, 200, 15, '#e2486a'); }}),
  fry: (k, t='튀기기') => S('slider', t, '슬라이더', '기름 온도를 초록 칸에 유지', {zone:[.5,.68], time:6, scene:(v)=>{ potScene(mixHex('#ffd35c', '#c97a35', v), .6, v); for (let i=0;i<3;i++) ing(k, 130 + i*50, 250 + Math.sin(T*8+i)*2, .6); for (let i=0;i<Math.round(v*10);i++) d.dot(100 + (i*37)%160, 246 + (i*7)%10, 2.5, '#fff6c9', .9); }}),
  pour: (col, vessel='glass', t, h, zone=[.72,.88]) => S('hold', t, '꾹', h || '선까지 넘치지 않게', {zone, speed:.36, gl:'모자람 · 딱 선까지 · 넘침', scene:(v, on)=>{ V[vessel](); const top = vessel === 'jar' ? 372 : vessel === 'pan' ? 300 : 378, hh = vessel === 'pan' ? 60 : 170; ctx.save(); ctx.globalAlpha = .9; ctx.fillStyle = col; if (vessel === 'pan'){ ctx.beginPath(); ctx.ellipse(W/2, 274, 100*clamp(v), 56*clamp(v), 0, 0, TAU); ctx.fill(); } else { ctx.beginPath(); ctx.roundRect(W/2-44, top - hh*clamp(v), 88, hh*clamp(v), 10); ctx.fill(); } ctx.restore(); if (vessel !== 'pan'){ ctx.strokeStyle = '#e48fac'; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(W/2-58, top - hh*zone[1]); ctx.lineTo(W/2+58, top - hh*zone[1]); ctx.stroke(); ctx.setLineDash([]); } if (on) d.line(k=>{ k.moveTo(W/2+10, 130); k.lineTo(W/2, top - hh*v); }, col, 6); }}),
  batter: () => S('hold', '반죽 붓기', '꾹', '초록 칸에서 손을 떼요. 넘치면 0점', {zone:[.6,.8], speed:.4, scene:(v)=>{ moldScene((x, y, i) => { if (i === 0){ ctx.save(); fishPath(x, y, 1.05*Math.sqrt(clamp(v))); ctx.fillStyle = BAT; ctx.fill(); ctx.restore(); } }); }}),
  fill: (keys) => S('drag', '속 넣기', '드래그', `${keys.map(nm).join(', ')} 칸마다 넣기`, {items:uniq(keys), s:.55, targets:[[130,240],[230,240],[130,320],[230,320]].map(([x,y], i) => ({x, y, r:34, k: keys.length >= 4 ? keys[i] : null})), scene:()=>V.mold()}),
  bake: (t='굽기 · 뒤집기') => B.timing(t, '노릇노릇 칸에서 탭해서 뒤집기, 앞뒤 2번', {rounds:2, roundName:'면', zone:[.48,.7], speed:.24, segs:[[.45, RAW],[.25, GOLD],[.12, '#b5703a'],[.18, BURNT]], gl:'덜 익음 · 노릇노릇 · 진함 · 탐', scene:(col)=>{ flame(W/2, 400, 6, .6); moldScene((x, y)=>bread(x, y, 1.0, col)); }}),
  knead: (col, t='반죽 치대기', h='빠르게 연타해서 쫀득하게', taps=20) => S('mash', t, '연타', h, {taps, time:5, scene:(pop, n)=>{ V.board(); at(W/2, 290, 1, () => d.ell(0, 0, 70 + pop*14, 40 - pop*12, col)); hand(W/2-40, 262 + pop*16); hand(W/2+40, 262 + pop*16); }}),
  pull: (col='#fff3d9', t='면 뽑기', h='좌우로 크게 늘렸다 접기') => S('shake', t, '스와이프', h, {count:8, time:6, tip:'좌우로 크게 쓱쓱', scene:(off, n)=>{ const w = 60 + Math.abs(off)*1.6; for (let i=0;i<Math.min(8, 1 + n);i++) d.line(k=>{ const y = 270 + i*5 - Math.min(8,n)*2.5; k.moveTo(W/2 - w, y); k.quadraticCurveTo(W/2, y + 10, W/2 + w, y); }, col, 5); hand(W/2 - w, 276); hand(W/2 + w, 276); }}),
  toss: (keys, t='팬에 볶기', h='좌우로 흔들어서 골고루') => S('shake', t, '흔들기', h, {count:10, time:6, scene:(off)=>{ flame(W/2, 390, 4, .6); at(W/2+off, 300, 1, () => { d.rr(100, -8, 90, 14, 7, '#5b3345'); d.ell(0, 0, 110, 40, '#4a4a52'); d.ell(0, -6, 96, 30, '#585a66', {flat:true}); keys.forEach((k, i) => ing(k, -50 + i*34, -10 + (i%2)*6, .55)); }); }}),
  rinse: () => S('shake', '찬물에 헹구기', '흔들기', '체를 좌우로 흔들어 물기 빼기', {count:8, time:6, scene:(off)=>{ at(W/2+off, 290, 1, () => { d.ell(0, 0, 100, 40, '#c3b8d2'); d.ell(0, -4, 88, 30, '#eaf6ff', {flat:true}); for (let i=0;i<4;i++) d.line(k=>{ k.moveTo(-60, -10 + i*5); k.quadraticCurveTo(0, -2 + i*5, 60, -10 + i*5); }, '#fff3d9', 4); }); for (let i=0;i<6;i++) d.dot(W/2 - 40 + i*16, 340 + ((T*90 + i*17)%40), 3, '#9fd9ff'); }}),
  rest: (t, h, text, scene) => S('wait', t, '참기', h, {time:4, waitText:text, scene}),
  steamRice: () => B.rest('밥 짓기', '뜸 들이는 동안 뚜껑을 열면 안 돼요', '뜸 들이는 중… 뚜껑 열지 마세요', (k)=>{ flame(W/2, 400, 3, .3); d.ell(W/2, 300, 100, 70, '#2f2f3a'); d.ell(W/2, 250, 90, 22, '#4a4a52'); d.circle(W/2, 236, 10, '#7a4a3a'); steam(W/2-30, 220, 3, 30, .3 + k*.6); }),
  season: (col, t='간 맞추기', plus=['소금 톡', .15], minus=['물 조금', .1], keys=[]) => S('meter', t, '조절', `${plus[0]}, 맛보고, 짜면 ${minus[0]}`, {target:.55, plus, minus, tip:'맛보면서 간 맞추기', scene:(v)=>{ potScene(mixHex(col, '#7a4a3a', v*.5), .5, .4); keys.forEach((k, i) => ing(k, 140 + i*50, 252, .5)); }}),
  drizzle: (col, shape='zigzag', t='소스 뿌리기', h, base='plate') => S('trace', t, '따라 그리기', h || '분홍 점부터 점선 따라 그리기', {col, w:8, path:PATH[shape], scene:()=>{ if (base === 'plate') V.plate(); else if (base === 'shave'){ d.ell(W/2, CY+20, 140, 110, '#ffffff'); } else if (base === 'roll'){ d.rr(40, CY-14, 280, 60, 30, '#2f3a2a'); } else if (base === 'vase'){ d.shape(()=>{ ctx.beginPath(); ctx.moveTo(W/2-80, CY-90); ctx.lineTo(W/2+80, CY-90); ctx.quadraticCurveTo(W/2+150, CY, W/2+70, CY+110); ctx.lineTo(W/2-70, CY+110); ctx.quadraticCurveTo(W/2-150, CY, W/2-80, CY-90); ctx.closePath(); }, '#d9a07a', [W/2, CY, 120]); } else if (base === 'dish') V.dish('#fbf6ef'); else if (base === 'mold') moldScene((x, y)=>bread(x, y, 1.0, GOLD)); else if (base === 'bowl') V.bowl(); else if (base === 'egg') V.pot('#f1d8a8'); else if (base === 'candy') { d.rr(W/2-4, CY, 8, 140, 4, '#ffffff'); d.circle(W/2, CY, 120, '#fff3f7'); } }}),
  drop: (keys, base='rice', t='올리기', h='그릇 바로 위에 왔을 때 탭!') => S('drop', t, '타이밍', h, {n:Math.min(3, Math.max(2, keys.length)), items:keys, ty:base === 'shave' ? 236 : 300, s:.7, tmove:1.4, scene:(tx, stuck)=>{ if (base === 'rice'){ d.ell(tx, 312, 64, 28, '#ffffff'); stuck.forEach((s, i) => ing(s.k, tx + s.x, 296 - i*6, .8)); } else if (base === 'shave'){ d.shape(()=>{ ctx.beginPath(); ctx.moveTo(tx-70, 270); ctx.lineTo(tx+70, 270); ctx.lineTo(tx+46, 320); ctx.lineTo(tx-46, 320); ctx.closePath(); }, '#9fd9ff', [tx, 295, 70]); d.circle(tx, 250, 64, '#ffe3ec'); stuck.forEach((s, i) => ing(s.k, tx + s.x, 222 - i*8, .7)); } else { bowl(tx, 300, 70, base); stuck.forEach((s, i) => ing(s.k, tx + s.x, 296 - i*6, .7)); } }}),
  press3: () => S('mash', '밥 쥐기', '딱 3번', '꾹꾹 딱 3번만 누르고 기다려요', {taps:3, exact:true, tip:'딱 3번 탭하고 손 떼기', scene:(pop, n)=>{ at(W/2, 280, 1 - pop*.12, () => { d.ell(0, 0, 70, 34 + (3-Math.min(n,3))*6, '#ffffff'); for (let i=0;i<14;i++) d.dot(-50 + (i*37)%100, -10 + (i*13)%24, 3, '#f1ede4'); }); hand(W/2+20, 230 + pop*20, .9); }}),
  wasabi: () => S('hold', '와사비 바르기', '꾹', '살짝만! 많이 바르면 매워서 감점', {zone:[.15,.3], speed:.5, gl:'살짝 · 적당 · 매워요', scene:(v)=>{ d.ell(W/2, 290, 80, 36, '#ffffff'); d.ell(W/2, 284, 40*Math.sqrt(v)+1, 16*Math.sqrt(v)+1, '#8fd66a'); if (v > .45) txt('맵다!!', W/2, 220, 18, '#e2486a'); }}),
  shave: () => S('rotate', '얼음 갈기', '돌리기', '핸들을 빙글빙글, 곱게 갈수록 좋아요', {turns:5, time:8, scene:(k)=>{ d.shape(()=>{ ctx.beginPath(); ctx.moveTo(W/2-60, 330); ctx.lineTo(W/2+60, 330); ctx.lineTo(W/2+40, 370); ctx.lineTo(W/2-40, 370); ctx.closePath(); }, '#9fd9ff', [W/2, 350, 60]); d.circle(W/2, 330 - 40*k, 10 + 54*k, '#ffffff'); d.rr(W/2-30, 180, 60, 50, 10, '#c3b8d2'); for (let i=0;i<6;i++) d.dot(W/2 - 20 + (i*13)%40, 236 + ((T*80 + i*20)%60), 2.5, '#ffffff'); }}),
  blend: (col, t='믹서 갈기') => S('hold', t, '꾹', '꾹 누른 채 유지, 너무 오래 갈면 묽어져요', {zone:[.55,.75], speed:.33, gl:'덩어리 · 부드러움 · 묽음', scene:(v, on)=>{ const sx = on ? Math.sin(T*70)*2 : 0; ctx.save(); ctx.translate(sx, 0); V.blender(); ctx.fillStyle = mixHex(col, '#ffffff', v*.35); const hh = 130*Math.min(1, .4 + v*.5); ctx.fillRect(W/2-46, 336 - hh, 92, hh); if (v < .5) for (let i=0;i<4;i++) d.rr(W/2-30 + i*16, 300 - i*8, 12, 12, 3, mixHex(col, '#2a1420', .2)); ctx.restore(); }}),
  pick: (good, t='꽃잎 따기', h='싱싱한 것만 골라 탭') => S('pick', t, '탭', h, {good:8, n:12, time:7, goodK:good, badK:'wilted'}),
  distill: (col) => S('slider', '증류', '슬라이더', '약불 유지, 한 방울씩', {zone:[.3,.48], time:6, scene:(v)=>{ flame(110, 400, 2, v); d.circle(110, 330, 50, '#eaf6ff'); d.line(k=>{ k.moveTo(130, 290); k.quadraticCurveTo(200, 200, 250, 300); }, '#c3b8d2', 7); d.rr(226, 310, 50, 70, 14, '#f4ecff'); for (let i=0;i<Math.round(v*4);i++) d.dot(250, 300 + ((T*120 + i*30) % 40), 4, col); if (v > .7) txt('너무 세요!', 110, 250, 15, '#e2486a'); }}),
  mix: (target, bottles, t='향 섞기', h='병을 탭해서 목표 색에 맞추기') => S('mix', t, '조절', h, {target, bottles}),
  bottle: (col, t='병에 담기', h='작은 병이라 아주 조금만') => S('hold', t, '꾹', h, {zone:[.55,.68], speed:.5, gl:'모자람 · 딱 · 넘침', scene:(v, on)=>{ d.circle(W/2, 320, 56, '#f4ecff'); d.rr(W/2-14, 250, 28, 20, 5, '#ffd35c'); ctx.save(); ctx.beginPath(); ctx.arc(W/2, 320, 50, 0, TAU); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(W/2-60, 370 - 100*clamp(v), 120, 100); ctx.restore(); if (on) d.line(k=>{ k.moveTo(W/2, 170); k.lineTo(W/2, 360 - 100*v); }, col, 3); }}),
  wheel: (col='#d9a07a', t='물레 돌리기') => S('slider', t, '드래그', '움직이는 초록 칸을 따라가며 모양 잡기', {zone:[.4,.6], move:1.6, time:7, tip:'꾹 누르면 위로, 떼면 아래로', gl:'초록 칸을 따라간 시간만큼 모양이 예뻐요', scene:(v)=>{ d.ell(W/2, 380, 110, 26, '#7d8090'); const w = 40 + v*50; d.shape(()=>{ ctx.beginPath(); ctx.moveTo(W/2-40, 370); ctx.quadraticCurveTo(W/2-w-20, 300, W/2-30, 220); ctx.lineTo(W/2+30, 220); ctx.quadraticCurveTo(W/2+w+20, 300, W/2+40, 370); ctx.closePath(); }, col, [W/2, 300, 60]); }}),
  kiln: (t='가마 굽기') => S('slider', t, '슬라이더', '온도 유지, 너무 뜨거우면 금이 가요', {zone:[.58,.78], time:6, scene:(v)=>{ d.shape(()=>{ ctx.beginPath(); ctx.moveTo(W/2-110, 400); ctx.quadraticCurveTo(W/2-110, 180, W/2, 180); ctx.quadraticCurveTo(W/2+110, 180, W/2+110, 400); ctx.closePath(); }, '#d9a07a', [W/2, 300, 110]); d.rr(W/2-40, 300, 80, 100, 30, '#5e3a2a'); ctx.save(); ctx.globalAlpha = .4 + v*.6; d.rr(W/2-30, 314, 60, 86, 24, mixHex('#ff8c1a', '#fff3a0', v), {flat:true}); ctx.restore(); if (v > .85) txt('쩍! 금 갈 것 같아요', W/2, 160, 15, '#e2486a'); }}),
  glassHeat: () => S('slider', '유리 녹이기', '슬라이더', '불을 세게, 하지만 너무 세면 안 돼요', {zone:[.6,.8], time:6, scene:(v)=>{ flame(W/2, 400, 5, v); d.circle(W/2, 320, 40 + v*6, mixHex('#cfeefb', '#ff9533', v)); }}),
  blow: (col='#cfeefb') => S('hold', '유리 불기', '꾹', '꾹 불어서 알맞게 부풀리기, 너무 불면 터져요', {zone:[.6,.8], speed:.35, gl:'작음 · 딱 좋아 · 펑', scene:(v)=>{ d.rr(W/2-4, 150, 8, 100, 4, '#7d8090'); d.circle(W/2, 290, 20 + 80*clamp(v), col); d.dot(W/2 - 20, 260, 8 + 10*v, '#ffffff', .6); }}),
  polish: (col, t='연마') => S('rotate', t, '문지르기', '문질러서 반짝이게', {turns:4, time:7, scene:(k)=>{ d.circle(W/2, CY, 60, col); ctx.save(); ctx.globalAlpha = k; for (let i=0;i<4;i++) at(W/2 - 40 + i*26, CY - 40 + (i%2)*60, .5, () => UI.sparkle(d)); ctx.restore(); }}),
  coat: () => S('hold', '튀김옷 입히기', '꾹', '반죽에 꾹 담갔다가 알맞게 빼기', {zone:[.5,.72], speed:.45, gl:'얇음 · 바삭 · 두꺼움', scene:(v)=>{ V.bowl('#fff3d9'); d.rr(W/2-6, 160, 12, 90 + v*40, 6, '#c3b8d2'); d.ell(W/2, 250 + v*40, 30, 16, mixHex('#ffffff', '#f1cf8a', v)); }}),
  pack: (keys, t='봉투에 담기') => S('drag', t, '배치', '봉투 칸마다 하나씩', {items:uniq(keys), s:.55, targets:[[W/2-40,250],[W/2+40,250],[W/2-40,320],[W/2+40,320]].map(([x,y], i) => ({x, y, r:30, k:keys[i % keys.length]})), scene:()=>V.bag()}),
  cream: (col='#ffffff', t='크림 짜기') => B.drizzle(col, 'zigzag', t, '짤주머니로 지그재그', 'mold'),
};

// ── 가게 12 × 메뉴 8 : 메뉴마다 만드는 과정 ──
const PROC = [
  /* 양식집 */ [
    () => [B.chop('c01', '토마토 썰기'), B.noodle('스파게티 삶기'), B.toss(['c01','c01','flour'], '토마토 소스에 볶기'), B.add(['c01','g26'], 'plate', '플레이팅')],
    () => [B.knead('#f3e3c0', '감자 반죽 치대기'), B.cutBlock('#f3e3c0', 4, '한입 크기로 자르기'), B.float('#f3e3c0', '뇨끼 삶기'), B.add(['c07','egg'], 'plate', '플레이팅')],
    () => [B.chop('g01', '버섯 썰기'), B.stir('#f4ecd8', ['rice','c08','g01'], '쌀 볶기', '눌어붙지 않게 저어요'), B.pour('#ffffff', 'pan', '우유 붓기', '팬에 우유를 알맞게', [.55,.75]), B.heat('#f1e3c4', '크림 졸이기')],
    () => [B.knead('#fff3d9', '라자냐 면 반죽'), B.add(['c05','c01','milk','flour'], 'tray', '층층이 쌓기'), B.oven('#e9b56a'), B.cutBlock('#e9b56a', 3, '네모나게 자르기')],
    () => [B.chop('c17', '파프리카 썰기'), B.add(['rice','f29','f30','c10'], 'pan', '해물 올리기'), B.heat('#f3c64f', '약불 유지'), B.rest('뜸 들이기', '쌀이 익을 때까지 건드리지 않기', '뜸 들이는 중…', ()=>V.pan('#f3c64f'))],
    () => [B.season('#ffe9c9', '연어 밑간', ['소금 톡', .15], ['허브 더', .1], ['f34','g26']), B.grill('f34', '연어 굽기'), B.add(['c07','c19'], 'plate', '감자·브로콜리 곁들이기')],
    () => [B.chop('c21', '단호박 썰기'), B.boil('#ffb347', '단호박 삶기'), B.blend('#ffb347', '곱게 갈기'), B.drizzle('#ffffff', 'spiral', '크림 무늬 그리기', null, 'bowl')],
    () => [B.cut('g08', 2, '황금 송이 손질'), B.grill('g08', '송이 굽기'), B.heat('#c98e5b', '소스 졸이기'), B.add(['g08','f35','c19','g27'], 'plate', '코스 플레이팅')],
  ],
  /* 붕어빵 */ [
    () => [B.batter(), B.fill(['f03','f03','f03','f03']), B.bake()],
    () => [B.batter(), B.fill(['g19','g19','g19','g19']), B.bake()],
    () => [B.knead('#b5547a', '고구마 으깨기', '연타해서 곱게 으깨요'), B.batter(), B.fill(['c15','c15','c15','c15']), B.bake()],
    () => [B.batter(), B.bake(), B.cream('#ffffff', '생크림 짜기'), B.fill(['c12','c12','c12','c12'])],
    () => [B.heat('#ffe39a', '커스터드 끓이기'), B.batter(), B.fill(['c25','c25','c25','c25']), B.bake()],
    () => [B.heat('#6b3a2a', '초코 녹이기'), B.batter(), B.fill(['c27','c25','c27','c25']), B.bake()],
    () => [B.batter(), B.fill(['c15','c27','c25','c12']), B.bake(), B.pack(['c15','c27','c25','c12'], '봉투에 담기')],
    () => [B.batter(), B.fill(['f15','c30','f15','c30']), B.bake('황금빛으로 굽기'), B.cream('#ffd23f', '황금 시럽 바르기')],
  ],
  /* 초밥집 */ [
    () => [B.cut('f19', 3, '고등어 손질'), B.press3(), B.drop(['f19','f19'], 'rice', '고등어 올리기')],
    () => [B.cut('f29', 3, '오징어 손질'), B.press3(), B.wasabi(), B.drop(['f29','f29'], 'rice', '오징어 올리기')],
    () => [B.cut('f34', 3, '연어 손질'), B.press3(), B.wasabi(), B.drop(['f34','f34','f34'], 'rice', '연어 올리기')],
    () => [B.cut('f26', 3, '광어 손질'), B.press3(), B.wasabi(), B.drop(['f26','f26','c16'], 'rice', '광어 올리기')],
    () => [B.grill('f14', '장어 굽기'), B.heat('#5a3a1a', '단짠 소스 졸이기'), B.add(['rice','f14','c16'], 'rice', '덮밥 담기'), B.drizzle('#5a3a1a', 'zigzag', '소스 뿌리기', null, 'bowl')],
    () => [B.cut('f35', 4, '참치 뱃살 손질'), B.press3(), B.wasabi(), B.drop(['f35','f35','f35'], 'rice', '대뱃살 올리기')],
    () => [B.cut('f36', 3, '청새치 손질'), B.cut('f35', 3, '참치 손질'), B.press3(), B.drop(['f36','f35','c16'], 'rice', '특선 올리기')],
    () => [B.cut('f35', 3, '참치 손질'), B.cut('f49', 3, '보석가오리 손질'), B.press3(), B.drop(['f35','f36','f49'], 'rice', '오마카세 올리기'), B.add(['f35','f36','f49','g43'], 'board', '나무 접시에 내기')],
  ],
  /* 분식집 */ [
    () => [B.knead('#f3e3d0', '생선살 반죽', '연타해서 탱글하게'), B.cutBlock('#f3e3d0', 3, '어묵 모양 자르기'), B.fry('f17', '어묵 튀기기')],
    () => [B.cut('f29', 3, '오징어 링 썰기'), B.coat(), B.fry('f29', '바삭하게 튀기기')],
    () => [B.add(['rice','c06','c05','egg'], 'gim', '재료 깔기'), B.roll(), B.drizzle('rgba(255,214,90,.8)', 'zigzag', '참기름 바르기', '김밥 위를 지그재그로', 'roll'), B.chop('egg', '김밥 썰기', '같은 박자로 탭탭탭')],
    () => [B.chop('c08', '양파 썰기'), B.heat('#e2486a', '고추장 소스 끓이기'), B.stir('#e2486a', ['rice','c08','c17'], '떡볶이 젓기', '눌어붙지 않게 휘휘')],
    () => [B.noodle('라면 삶기'), B.heat('#e2486a', '소스 끓이기'), B.stir('#e2486a', ['flour','rice','f17'], '라면이랑 떡 섞기'), B.drop(['egg','egg'], '#e2486a', '삶은 달걀 올리기')],
    () => [B.cut('c15', 3, '고구마 썰기'), B.coat(), B.fry('c15', '모둠 튀기기'), B.add(['f29','f38','c15','c07'], 'plate', '접시에 담기')],
    () => [B.chop('c17', '파프리카 썰기'), B.add(['f29','f30','c08','rice'], 'pan', '해물이랑 떡 넣기'), B.heat('#e2486a', '소스 졸이기'), B.stir('#e2486a', ['f29','f30','rice'], '골고루 젓기')],
    () => [B.add(['rice','g38','egg'], 'gim', '김밥 재료 깔기'), B.roll(), B.stir('#e2486a', ['rice','c17','f30'], '떡볶이 젓기'), B.fry('c15', '튀김 튀기기'), B.add(['g38','c17','c15','egg'], 'sang', '한 상 차리기')],
  ],
  /* 한식 밥집 */ [
    () => [B.steamRice(), B.knead('#7fae6a', '떡 치기', '쿵덕쿵덕 연타!'), B.cutBlock('#7fae6a', 3, '먹기 좋게 자르기')],
    () => [B.season('#e6f0f5', '소금 뿌리기', ['소금 톡', .15], ['털어내기', .1], ['f19']), B.grill('f19', '고등어 굽기')],
    () => [B.steamRice(), B.season('#4fae3c', '나물 무치기', ['간장 톡', .15], ['나물 더', .1], ['g23','c05']), B.add(['g23','c05','c04','egg'], 'rice', '고명 올리기'), B.stir('#ffffff', ['g23','c05','c04','egg'], '비비기', '숟가락으로 골고루 비비기', 4, '#5b5266')],
    () => [B.chop('g01', '버섯 썰기'), B.add(['g01','g02','c08','c07'], 'pot', '전골 냄비에 담기'), B.boil('#ffd39a', '보글보글 끓이기'), B.season('#ffe9c9', '간 맞추기')],
    () => [B.chop('c07', '감자 썰기'), B.add(['f19','c07','c17','c08'], 'pot', '조림 냄비에 담기'), B.heat('#c9302f', '국물 졸이기'), B.rest('뜸 들이기', '간이 배도록 기다리기', '간이 배는 중…', ()=>V.pot('#c9302f'))],
    () => [B.pour('#f3e3c0', 'pan', '반죽 붓기', '팬에 반죽을 알맞게', [.55,.75]), B.add(['f29','f30','f38','c08'], 'pan', '해물 올리기'), B.pancake('#f3e3c0', '파전 부치기')],
    () => [B.cut('f31', 3, '갈치 손질'), B.chop('c21', '호박 썰기'), B.add(['f31','c07','c21','c17'], 'pot', '조림 냄비에 담기'), B.heat('#c9302f', '국물 졸이기')],
    () => [B.steamRice(), B.grill('f28', '참돔 굽기'), B.chop('g08', '송이 썰기'), B.add(['rice','f28','g08','g06','c19','g38'], 'sang', '수라상 차리기')],
  ],
  /* 우동집 */ [
    () => [B.knead('#fff3d9'), B.pull(), B.noodle(), B.add(['g38'], 'bowl', '미역 올리기')],
    () => [B.knead('#fff3d9'), B.pull(), B.noodle(), B.chop('g01', '버섯 썰기'), B.add(['g01','g02'], 'bowl', '버섯 올리기')],
    () => [B.knead('#fff3d9'), B.pull(), B.noodle(), B.drizzle('#ffd35c', 'spiral', '달걀 풀기', '국물 위에 달걀을 빙글빙글', 'egg')],
    () => [B.coat(), B.fry('f38', '새우 튀기기'), B.knead('#fff3d9'), B.noodle(), B.add(['f38','egg','c08','g38'], 'bowl', '고명 올리기')],
    () => [B.chop('c17', '파프리카 썰기'), B.add(['f29','f30','f38','c08'], 'pot', '해물 넣기'), B.noodle(), B.season('#f1d8a8', '국물 간 맞추기')],
    () => [B.knead('#fff3d9'), B.pull(), B.noodle(), B.rinse(), B.add(['c16','egg','g27','c17'], 'bowl', '고명 올리기')],
    () => [B.cut('f40', 2, '수정게 손질'), B.knead('#fff3d9'), B.pull(), B.noodle(), B.add(['f40','g06','egg','c19'], 'bowl', '고명 올리기')],
    () => [B.cut('f48', 2, '초롱아귀 손질'), B.knead('#fff3d9'), B.pull(), B.noodle(), B.season('#f1d8a8', '국물 간 맞추기'), B.add(['f48','f47','g07','g08'], 'bowl', '동굴 진미 올리기')],
  ],
  /* 빙수 가게 */ [
    () => [B.shave(), B.drizzle('#fffaf0', 'spiral', '연유 뿌리기', '나선 따라 연유를', 'shave'), B.drizzle('#f4e8d0', 'zigzag', '우유 가루 뿌리기', '지그재그로 솔솔', 'shave')],
    () => [B.shave(), B.chop('c12', '딸기 썰기'), B.drop(['c12','c12','c12'], 'shave', '딸기 올리기', '흔들리는 그릇에 정확히')],
    () => [B.shave(), B.drizzle('#5b6bd6', 'spiral', '블루베리 시럽', '나선 따라 시럽을', 'shave'), B.drop(['c14','c14','c14'], 'shave', '블루베리 올리기', '흔들리는 그릇에 정확히')],
    () => [B.heat('#ffd84f', '옥수수 졸이기'), B.shave(), B.drop(['c11','c11','c25'], 'shave', '옥수수 올리기', '흔들리는 그릇에 정확히')],
    () => [B.heat('#6b3a2a', '초코 녹이기'), B.shave(), B.drizzle('#6b3a2a', 'zigzag', '초코 뿌리기', '지그재그로', 'shave'), B.drop(['c27','c25'], 'shave', '초코 올리기', '흔들리는 그릇에 정확히')],
    () => [S('rotate', '원두 갈기', '돌리기', '손잡이를 빙글빙글', {turns:4, time:7, scene:(k)=>{ d.rr(W/2-50, 230, 100, 120, 16, '#9a6a45'); d.circle(W/2, 220, 40, '#7a4a3a'); for (let i=0;i<8;i++) d.ell(W/2 - 24 + (i*13)%48, 214 + (i*7)%14, 5, 3.5, '#4a2a20'); }}), B.pour('#5a3a1a', 'glass', '에스프레소 내리기', '선까지 천천히'), B.shave(), B.drizzle('#5a3a1a', 'spiral', '커피 시럽 뿌리기', '나선 따라', 'shave')],
    () => [B.cut('c23', 2, '멜론 반 가르기'), B.shave(), B.drop(['c23','c12','c25'], 'shave', '멜론 올리기', '흔들리는 그릇에 정확히')],
    () => [B.shave(), B.drizzle('#ffd23f', 'spiral', '황금 시럽', '나선 따라', 'shave'), B.drop(['c30','c30','g15'], 'shave', '황금딸기 올리기', '흔들리는 그릇에 정확히'), B.drizzle('#ffffff', 'zigzag', '크림 마무리', '지그재그로', 'shave')],
  ],
  /* 주스 바 */ [
    () => [B.chop('c01', '토마토 썰기'), B.blend('#ff4f4f'), B.pour('#ff4f4f')],
    () => [B.cut('c06', 3, '당근 썰기'), B.blend('#ff9533'), B.pour('#ff9533')],
    () => [B.add(['c14','milk','sugar'], 'blender', '믹서에 넣기'), B.blend('#8a7ad6'), B.pour('#8a7ad6')],
    () => [B.chop('c12', '딸기 썰기'), B.knead('#ff6b86', '딸기 으깨기', '연타해서 으깨요'), B.pour('#ffc2d4', 'glass', '우유 붓기'), B.stir('#ffc2d4', ['c12'], '휘휘 젓기', '빨대로 빙글빙글', 3, '#f4fbff')],
    () => [B.cut('c24', 3, '파인애플 썰기'), B.blend('#ffc94f'), B.pour('#fff3b0', 'glass', '탄산 붓기', '거품이 넘치지 않게'), B.drop(['g24','g24'], '#f4fbff', '민트 올리기')],
    () => [B.cut('c22', 2, '수박 가르기'), B.pick('c22', '씨 빼기', '수박 조각만 골라 탭, 씨는 두기'), B.blend('#ff6b6b'), B.pour('#ff6b6b')],
    () => [B.cut('c23', 3, '멜론 썰기'), B.add(['c23','milk','c25','c12'], 'blender', '믹서에 넣기'), B.blend('#c9e88a'), B.pour('#c9e88a')],
    () => [B.add(['g15','c30','milk','g14'], 'blender', '믹서에 넣기'), B.blend('#c98ad6'), B.pour('#c98ad6', 'glass', '컵에 따르기'), B.drizzle('#ffd23f', 'zigzag', '무지개 시럽', '지그재그로', 'dish')],
  ],
  /* 사탕 가게 */ [
    () => [B.heat('#ffffff', '설탕 녹이기'), B.pull('#ffffff', '사탕 늘리기', '좌우로 늘려서 하얗게'), B.cutBlock('#e9fbf4', 4, '톡톡 자르기')],
    () => [B.knead('#ff4f6d', '산딸기 으깨기', '연타해서 으깨요'), B.heat('#ff4f6d', '젤리 끓이기'), B.pour('#ff4f6d', 'jar', '틀에 붓기'), B.rest('굳히기', '굳을 때까지 기다리기', '굳는 중… 만지면 찌그러져요', ()=>V.tray('#ffd9e4'))],
    () => [B.heat('#ffffff', '설탕 녹이기'), S('rotate', '막대에 감기', '돌리기', '빙글빙글 크게 감기', {turns:4, time:7, scene:(k, ang)=>{ d.rr(W/2-3, CY, 6, 120, 3, '#ffffff'); d.circle(W/2, CY, 16 + 50*k, '#ff9fc4'); for (let i=0;i<3;i++) d.line(c=>{ c.arc(W/2, CY, (8 + 16*i)*(.3 + k), ang + i, ang + i + 4); }, '#ffffff', 4); }}), B.rest('굳히기', '식는 동안 기다리기', '식는 중…', ()=>{ for (let i=0;i<3;i++){ d.rr(110 + i*60, 260, 6, 90, 3, '#ffffff'); d.circle(113 + i*60, 250, 26, '#ff9fc4'); } })],
    () => [B.heat('#c98e5b', '캐러멜 끓이기', '갈색이 되면 불 줄이기', [.5,.68]), B.pour('#c98e5b', 'jar', '틀에 붓기'), B.rest('굳히기', '굳을 때까지 기다리기', '굳는 중…', ()=>V.tray('#f3e3c4')), B.cutBlock('#c98e5b', 3, '네모나게 자르기')],
    () => [B.heat('#6b3a2a', '초코 녹이기'), B.pour('#6b3a2a', 'jar', '틀에 붓기'), B.drop(['g19','g19'], '#6b3a2a', '호두 올리기'), B.rest('굳히기', '굳을 때까지 기다리기', '굳는 중…', ()=>V.tray('#f3e3c4'))],
    () => [B.heat('#ffffff', '설탕 녹이기'), B.stir('#fff6d9', ['g14','sugar','g05'], '별 모양 굴리기', '빙글빙글 굴려서 뿔을 만들어요', 5, '#c3b8d2'), B.rest('굳히기', '식는 동안 기다리기', '식는 중…', ()=>V.tray('#fff6d9'))],
    () => [B.heat('#ffffff', '설탕 녹이기'), B.mix('#c9a3f0', [{col:'#a77bff', label:'라벤더'}, {col:'#ff6b9a', label:'딸기'}, {col:'#ffffff', label:'설탕'}], '색 섞기', '라벤더 색에 맞추기'), B.pull('#c9a3f0', '사탕 늘리기'), B.rest('굳히기', '식는 동안 기다리기', '식는 중…', ()=>V.tray('#f4ecff'))],
    () => [B.heat('#ffffff', '설탕 녹이기'), B.mix('#ffb36b', [{col:'#ff6b9a', label:'딸기'}, {col:'#ffd35c', label:'황금'}, {col:'#7fb2ff', label:'무지개'}], '색 섞기', '노을 색에 맞추기'), S('drop', '사탕 쌓기', '타이밍', '탑이 무너지지 않게 정확히', {n:3, items:['candy','candy','candy'], ty:300, s:.9, tmove:1.2, tol:36, scene:(tx, stuck)=>{ d.rr(tx-60, 320, 120, 16, 6, '#c98e5b'); stuck.forEach((s, i) => at(tx + s.x, 300 - i*30, .9, () => ICON.candy())); }}), B.drizzle('#ffffff', 'zigzag', '아이싱 장식', '지그재그로', 'candy')],
  ],
  /* 잼·피클 */ [
    () => [B.knead('#ff4f6d', '산딸기 으깨기', '연타해서 으깨요'), B.stir('#ff4f6d', ['g09','sugar'], '설탕이랑 졸이기'), B.pour('#ff4f6d', 'jar', '병에 담기')],
    () => [B.knead('#5b2a5a', '오디 으깨기', '연타해서 으깨요'), B.stir('#5b2a5a', ['g11','sugar'], '졸이며 젓기'), B.thick('#5b2a5a'), B.pour('#5b2a5a', 'jar', '병에 담기')],
    () => [B.cut('c08', 3, '양파 썰기'), B.heat('#fff6d9', '절임물 끓이기', '소금물이 끓어오르면 유지'), B.pour('#fff6d9', 'jar', '병에 붓기')],
    () => [B.pick('g13', '앵두 고르기', '잘 익은 앵두만 골라 탭'), B.stir('#c2304f', ['c14','g13','sugar'], '졸이며 젓기'), B.thick('#c2304f'), B.pour('#c2304f', 'jar', '병에 담기')],
    () => [B.chop('c12', '딸기 썰기'), B.stir('#e2486a', ['c12','sugar'], '졸이며 젓기'), B.thick('#e2486a'), B.pour('#e2486a', 'jar', '병에 담기')],
    () => [B.pick('g12', '머루 고르기', '잘 익은 것만 골라 탭'), B.stir('#4a2a5a', ['g12','g10','sugar'], '졸이며 젓기'), B.thick('#4a2a5a'), B.pour('#4a2a5a', 'jar', '병에 담기')],
    () => [B.cut('c17', 3, '파프리카 썰기'), B.heat('#fff6d9', '절임물 끓이기'), B.add(['c17','c08','g26'], 'jar', '병에 채우기'), B.pour('#fff6d9', 'jar', '절임물 붓기')],
    () => [B.pick('g14', '은하 열매 고르기', '빛나는 것만 골라 탭'), B.stir('#4a5ad6', ['g14','c30','sugar'], '졸이며 젓기'), B.thick('#4a5ad6'), B.pour('#4a5ad6', 'jar', '병에 담기'), B.drizzle('#ffd23f', 'circle', '별가루 뿌리기', '빙 둘러서', 'dish')],
  ],
  /* 향수 가게 */ [
    () => [B.pick('g24', '민트 잎 따기', '싱싱한 잎만 골라 탭'), B.distill('#9fe3c4'), B.bottle('#9fe3c4')],
    () => [B.pick('g25', '캐모마일 따기'), B.distill('#fff3a0'), B.bottle('#fff3a0')],
    () => [B.pick('g32', '해당화 꽃잎 따기'), B.distill('#ff6b9a'), B.mix('#e88ab8', [{col:'#ff6b9a', label:'해당화'}, {col:'#a77bff', label:'라벤더'}, {col:'#ffffff', label:'물'}]), B.bottle('#e88ab8')],
    () => [B.pick('g31', '은방울꽃 따기'), B.distill('#f4f8ff'), B.mix('#e6eef8', [{col:'#ffffff', label:'은방울'}, {col:'#9fd9ff', label:'이슬'}, {col:'#ffe3a0', label:'데이지'}]), B.bottle('#e6eef8')],
    () => [B.pick('g34', '연꽃잎 따기'), B.distill('#ffb3d9'), B.mix('#f0b0d8', [{col:'#ffb3d9', label:'연꽃'}, {col:'#fff3a0', label:'달맞이'}, {col:'#9fe3c4', label:'형석'}]), B.bottle('#f0b0d8')],
    () => [B.pick('c18', '장미 꽃잎 따기'), B.distill('#ff3b5c'), B.mix('#e8506e', [{col:'#ff3b5c', label:'장미'}, {col:'#ff9fc4', label:'해당화'}, {col:'#ffffff', label:'이슬'}]), B.bottle('#e8506e')],
    () => [B.pick('c26', '라벤더 따기'), B.distill('#a77bff'), B.mix('#b48af0', [{col:'#a77bff', label:'라벤더'}, {col:'#fff3a0', label:'달맞이'}, {col:'#ffffff', label:'이슬'}]), B.bottle('#b48af0'), B.polish('#e8a07a', '마노 장식 닦기')],
    () => [B.pick('g36', '무지개 꽃잎 따기'), B.distill('#ff9fe0'), B.mix('#c8a0e8', [{col:'#ff9fe0', label:'무지개'}, {col:'#9fd9ff', label:'설화'}, {col:'#fff3a0', label:'오팔'}]), B.bottle('#c8a0e8'), B.polish('#fff7f0', '진주 장식 닦기')],
  ],
  /* 도자기 공방 */ [
    () => [B.knead('#d9a07a', '점토 반죽', '연타해서 공기 빼기'), B.wheel(), B.kiln()],
    () => [B.knead('#d9a07a', '점토 반죽', '연타해서 공기 빼기'), B.wheel(), B.drizzle('#7a4a3a', 'wave', '무늬 그리기', '화분에 물결 무늬', 'vase'), B.kiln()],
    () => [B.wheel('#efe8d8', '접시 빚기'), B.drizzle('#3f6fbf', 'circle', '테두리 무늬', '빙 둘러 그리기', 'dish'), B.kiln()],
    () => [B.glassHeat(), B.blow(), B.rest('식히기', '천천히 식히기', '식는 중… 만지면 깨져요', ()=>{ d.circle(W/2, 290, 80, '#cfeefb'); })],
    () => [B.glassHeat(), B.blow('#9fe0c9'), B.add(['o19','o03'], 'lamp', '램프 장식 달기'), B.rest('식히기', '천천히 식히기', '식는 중…', ()=>V.lamp())],
    () => [B.wheel('#efe8d8', '찻잔 빚기'), B.pour('#5cc48a', 'jar', '청자 유약 바르기', '유약을 알맞게', [.55,.75]), B.kiln()],
    () => [B.knead('#d9a07a', '점토 반죽', '연타해서 공기 빼기'), B.wheel(), B.add(['o23','o12'], 'dish', '자수정 박기'), B.kiln()],
    () => [B.knead('#d9a07a', '점토 반죽', '연타해서 공기 빼기'), B.wheel(), B.drizzle('#ffd23f', 'wave', '금 무늬 그리기', '물결 따라', 'vase'), B.add(['o27','o22','o21'], 'dish', '오팔 박기'), B.kiln()],
  ],
];
const SHOP_IC = [['dish','d23'],['icon','bung'],['dish','d24'],['icon','kimbap'],['icon','hansik'],['icon','udon'],['icon','shaved'],['icon','juice'],['icon','candy'],['icon','jar'],['icon','perfume'],['icon','vase']];
const SHOPS = MENU.map((m, i) => ({...m, ic:SHOP_IC[i]}));



// ── 실행기: 게임 위에 뜨는 조리대 ──
let T = 0, run = null, fxText = null, fxT = 0, raf = 0, lastT = 0;
const $k = id => document.getElementById(id);
function setTimer(s){ const el = $k('kitTm'); if (el){ el.hidden = false; el.textContent = Math.max(0, s).toFixed(1) + '초'; } }
const CSS = `#kitBox{position:fixed;inset:0;z-index:72;background:rgba(60,30,50,.45);display:grid;place-items:center;padding:10px}
#kitBox .kit-card{position:relative;width:min(400px,100%);max-height:100%;overflow:auto;background:#fff8fb;border-radius:22px;border:3px solid #ffd3e4;box-shadow:0 6px 0 #f1c6d8;padding:10px 12px 12px;color:#5a3346;font-family:"Maple",sans-serif}
#kitBox .kit-top{display:flex;align-items:center;gap:8px;font-size:18px;margin-bottom:6px}#kitBox .kit-top small{margin-left:auto;color:#b07a92;font-size:14px}
#kitBox .kit-stage{position:relative}#kitBox canvas{width:100%;aspect-ratio:360/540;border-radius:16px;display:block;touch-action:none;-webkit-user-select:none;user-select:none}
#kitBox .kit-tm{position:absolute;right:10px;top:10px;background:#fffdfd;border-radius:12px;padding:2px 10px;font-size:14px;font-variant-numeric:tabular-nums}
#kitBox .kit-over{position:absolute;inset:0;display:grid;place-items:center;padding:14px;background:rgba(251,238,243,.82);border-radius:16px}
#kitBox .kit-c{background:#fffdfd;border-radius:20px;padding:16px;width:100%;max-width:300px;text-align:center;display:flex;flex-direction:column;gap:8px;box-shadow:0 6px 18px rgba(212,163,181,.35)}
#kitBox .kit-c h3{margin:0;font-size:22px}#kitBox .kit-c p{margin:0;color:#8a6f7c;font-size:15px;line-height:1.45}#kitBox .kit-c .k{font-size:13px;color:#9a7f8c}
#kitBox .kit-chip{display:inline-block;font-size:12px;border-radius:9px;padding:2px 8px;background:#f6f2ff;color:#7d6ab0}
#kitBox .kit-g{font-size:32px;font-weight:bold}#kitBox .kit-row{display:flex;gap:8px}#kitBox .kit-row .btn{flex:1}`;
function injectCSS(){ if ($k('kitCss')) return; const s = document.createElement('style'); s.id = 'kitCss'; s.textContent = CSS; document.head.appendChild(s); }
const grade = s => s >= .85 ? ['PERFECT', '#e2486a'] : s >= .6 ? ['GOOD', '#e9a93a'] : ['아쉬움', '#a297b4'];
export const gradeIdx = s => s >= .85 ? 0 : s >= .6 ? 1 : 2;

function stepIntro(){
  const st = run.steps[run.i]; run.phase = 'intro'; run.mech = MECH[st.mech](st.o); run.mech.finish = finishStep; $k('kitTm').hidden = true;
  $k('kitSub').textContent = `${run.i+1} / ${run.steps.length} 단계`;
  const ov = $k('kitOver'); ov.hidden = false;
  ov.innerHTML = `<div class="kit-c"><div class="k">${run.title} · ${run.i+1} / ${run.steps.length} 단계</div><h3>${st.t}</h3><div><span class="kit-chip">${st.g}</span></div><p>${st.h}</p><button class="btn" id="kitGo">시작</button></div>`;
  $k('kitGo').onclick = () => { ov.hidden = true; run.phase = 'play'; };
}
function finishStep(s){
  if (!run || run.phase !== 'play') return; run.phase = 'judge'; run.scores.push(s);
  const [g] = grade(s); fxText = run.mech.fx && s < .4 ? run.mech.fx : g; fxT = 1.1;
  setTimeout(() => { if (!run) return; run.i++; if (run.i >= run.steps.length) showResult(); else stepIntro(); }, 1100);
}
function showResult(){
  run.phase = 'result'; $k('kitTm').hidden = true; const avg = run.scores.reduce((a,b)=>a+b,0)/run.scores.length, [g, col] = grade(avg);
  const ov = $k('kitOver'); ov.hidden = false;
  ov.innerHTML = `<div class="kit-c"><div class="k">${run.title} 완성 · ${run.n} 개</div><div class="kit-g" style="color:${col}">${g}</div><p>평균 ${Math.round(avg*100)} 점${avg >= .85 ? ' · 1.5 배 가격' : avg >= .6 ? ' · 보통 가격' : ' · 반값'}</p><button class="btn" id="kitOk">진열대에 올리기</button></div>`;
  $k('kitOk').onclick = () => { const r = run; closeKitchen(true); r.onDone && r.onDone(avg); };
}
export function closeKitchen(done){ const r = run; run = null; cancelAnimationFrame(raf); $k('kitBox')?.remove(); if (!done && r && r.onClose) r.onClose(); }
export function kitchenOpen(){ return !!run; }
export function stepsOf(shop, rec){ return PROC[shop][rec](); }
export function openKitchen({shop, rec, n=1, onDone, onClose}){
  injectCSS(); closeKitchen(true);
  const title = MENU[shop].r[rec].n;
  const box = document.createElement('div'); box.id = 'kitBox';
  box.innerHTML = `<div class="kit-card"><div class="kit-top"><b>${title}</b><small id="kitSub"></small><button class="mini" id="kitClose">그만두기</button></div><div class="kit-stage"><div class="kit-tm" id="kitTm" hidden></div><div class="kit-over" id="kitOver"></div></div></div>`;
  document.body.appendChild(box); box.querySelector('.kit-stage').prepend(cv);
  $k('kitClose').onclick = () => closeKitchen(false);
  run = {shop, rec, n, title, steps: PROC[shop][rec](), i:0, scores:[], phase:'intro', mech:null, onDone, onClose};
  stepIntro(); lastT = performance.now(); raf = requestAnimationFrame(frame);
}
const P = e => { const r = cv.getBoundingClientRect(); return {x:(e.clientX - r.left)/r.width*W, y:(e.clientY - r.top)/r.height*H}; };
cv.addEventListener('pointerdown', e => { if (!run || run.phase !== 'play') return; cv.setPointerCapture(e.pointerId); run.mech.down?.(P(e)); e.preventDefault(); });
cv.addEventListener('pointermove', e => { if (run && run.phase === 'play') run.mech.move?.(P(e)); });
cv.addEventListener('pointerup', e => { if (run && run.phase === 'play') run.mech.up?.(P(e)); });
cv.addEventListener('pointercancel', e => { if (run && run.phase === 'play') run.mech.up?.(P(e)); });
addEventListener('keydown', e => { if (!run) return; if (e.code === 'Space'){ e.preventDefault(); e.stopImmediatePropagation(); if (run.phase === 'play' && !e.repeat) run.mech.down?.({x:W/2, y:CY}); } else if (e.key === 'Escape') closeKitchen(false); else e.stopImmediatePropagation(); }, true);
addEventListener('keyup', e => { if (!run) return; if (e.code === 'Space'){ e.preventDefault(); e.stopImmediatePropagation(); if (run.phase === 'play') run.mech.up?.({x:W/2, y:CY}); } }, true);
function frame(now){ if (!run) return; const dt = Math.min(.05, (now - lastT)/1000); lastT = now; T += dt;
  ctx.setTransform(K, 0, 0, K, 0, 0);
  try { if (run.mech){ if (run.phase === 'play') run.mech.update?.(dt); run.mech.draw(); } } catch(e){ console.warn(e); }
  if (fxT > 0){ fxT -= dt; const col = fxText === 'PERFECT' ? '#e2486a' : fxText === 'GOOD' ? '#e9a93a' : '#7d6ab0'; ctx.save(); ctx.globalAlpha = clamp(fxT*2); const s = 1 + (1.1 - fxT)*.15; ctx.translate(W/2, 200); ctx.scale(s, s); ctx.font = '700 15px Maple'; const w = Math.max(150, ctx.measureText(fxText).width*2 + 40); d.rr(-w/2, -32, w, 64, 32, col, {flat:true}); txt(fxText, 0, 2, 30, '#fff'); ctx.restore(); }
  raf = requestAnimationFrame(frame); }
// 가게·재료 그림 (패널에서 써요)
const iconCache = new Map();
function iconURL(key, fn, size=96){ if (iconCache.has(key)) return iconCache.get(key); const c2 = document.createElement('canvas'); c2.width = c2.height = size; const x = c2.getContext('2d'); x.setTransform(size/52, 0, 0, size/52, size/2, size/2); const oc = ctx, od = d; ctx = x; d = painter(x); try { fn(); } catch(e){} finally { ctx = oc; d = od; } const url = c2.toDataURL(); iconCache.set(key, url); return url; }
export const shopIconURL = i => iconURL('shop'+i, () => { const [t, id] = SHOP_IC[i]; if (t === 'dish') DISH[id](d); else ICON[id](); });
export const stapleIconURL = k => iconURL('st'+k, () => staple(k));
export { MENU, ING };
