import { otumoHead } from './art/otumo.js';
// ===== 플레이어·주민 캐릭터: 매트 클레이 피규어 (표정 15 · 머리 39 · 옷·모자·액세서리·신발 126 × 색 5 · 주민 동물 18) =====
export function mixHex(a, b, k){ const A=parseInt(a.slice(1),16), B=parseInt(b.slice(1),16); const f=(x,y)=>Math.round(x+(y-x)*k); return '#'+[f(A>>16,B>>16),f(A>>8&255,B>>8&255),f(A&255,B&255)].map(v=>v.toString(16).padStart(2,'0')).join(''); }
export function mattePainter(ctx){
  function paint(path, col, [cx,cy,r], opt={}){
    ctx.save();
    if (r >= 5 && !opt.noShadow){ const k = opt.shadow ?? 1; ctx.save(); ctx.translate(Math.min(1.5, r*.06)*k, Math.min(2.2, Math.max(.8, r*.1))*k); ctx.globalAlpha = .13*Math.min(1, k+.3); path(ctx); ctx.fillStyle = '#4a2a3a'; ctx.fill(); ctx.restore(); }
    const g = ctx.createLinearGradient(cx-r*.6, cy-r, cx+r*.4, cy+r);
    g.addColorStop(0, mixHex(col, '#fffaf4', opt.flat ? .08 : .16)); g.addColorStop(.55, col); g.addColorStop(1, mixHex(col, '#3a2030', opt.flat ? .08 : .16));
    path(ctx); ctx.fillStyle = g; ctx.fill();
    if (r >= 5 && !opt.flat){ path(ctx); ctx.clip(); const ao = ctx.createRadialGradient(cx, cy-r*.1, r*.45, cx, cy+r*.1, r*1.2); ao.addColorStop(0,'rgba(60,30,50,0)'); ao.addColorStop(1,'rgba(60,30,50,.16)'); ctx.fillStyle = ao; ctx.fillRect(cx-r*1.4, cy-r*1.4, r*2.8, r*2.8); }
    ctx.restore();
    if (opt.seam){ ctx.save(); ctx.globalAlpha = .2; ctx.lineWidth = .7; ctx.strokeStyle = mixHex(col, '#2a1420', .35); path(ctx); ctx.stroke(); ctx.restore(); }
  }
  return { ctx,
    circle:(x,y,r,k,o)=>paint(()=>{ctx.beginPath();ctx.arc(x,y,r,0,7);},k,[x,y,r],o),
    ell:(x,y,rx,ry,k,o)=>paint(()=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);},k,[x,y,Math.max(rx,ry)],o),
    rr:(x,y,w,h,r,k,o)=>paint(()=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);},k,[x+w/2,y+h/2,Math.max(w,h)/2],o),
    shape:(fn,k,box,o)=>paint(fn,k,box||[0,0,10],o),
    dot:(x,y,r,k,a=1)=>{ctx.save();ctx.globalAlpha=a;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fillStyle=k;ctx.fill();ctx.restore();},
    line:(fn,k,w=1,a=1)=>{ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=k;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();fn(ctx);ctx.stroke();ctx.restore();},
  };
}
// 머리카락 한 가닥: 뿌리(x0,y0)에서 끝(x1,y1)으로 흐르는 두툼한 잎 모양. w = 가닥 두께, bend = 휘는 방향(±)
// 머리카락 한 가닥: 뿌리(x0,y0)에서 끝(x1,y1)으로 흐르는 두툼한 가닥. w = 두께, bend = 휘는 방향(±), round = 끝을 둥글게
function lock(d, hc, x0, y0, x1, y1, w, bend=0, round=true){
  const mx = (x0+x1)/2 + bend, my = (y0+y1)/2, dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy)||1, nx = -dy/L*w, ny = dx/L*w, tx = dx/L*w*.9, ty = dy/L*w*.9;
  d.shape(c=>{ c.beginPath(); c.moveTo(x0-nx*.7, y0-ny*.7); c.quadraticCurveTo(mx-nx, my-ny, x1-nx*(round?.55:0), y1-ny*(round?.55:0));
    if (round) c.quadraticCurveTo(x1+tx, y1+ty, x1+nx*.55, y1+ny*.55);
    c.quadraticCurveTo(mx+nx, my+ny, x0+nx*.7, y0+ny*.7); c.closePath(); }, hc, [mx,my,Math.max(w,L/2)], {seam:true});
}
// 표정: 눈은 작은 점이 기본. dot 점눈 / happy 웃는 눈 / sleepy 졸린 눈 / wink 윙크 / sparkle 반짝 눈 / surprised 놀란 눈 / cat 고양이 입
function face(d, x, y, L, side, expr){
  expr = expr || L.expr || 'dot';
  const sk = L.skin, bl = mixHex(sk, '#ff5f85', .5), c = d.ctx, ink = '#2b2228', mo = '#9a5566';
  c.save(); c.globalAlpha = .5; c.fillStyle = bl;
  const cks = side ? [x+R*.12] : [x-8.6, x+8.6];
  for (const cx of cks){ c.beginPath(); c.ellipse(cx, y+3.6, 3.6, 2.1, 0,0,7); c.fill(); }
  c.restore();
  for (const cx of cks) d.line(k=>{ for (let i=-1;i<=1;i++){ k.moveTo(cx+i*1.45-.55, y+4.5); k.lineTo(cx+i*1.45+.55, y+2.7); } }, mixHex(sk, '#d4425f', .55), .5, .8);
  const eyes = side ? [x+R*.46] : [x-6.2, x+6.2];
  const dot = (e, r=2.05) => { c.save(); c.fillStyle = ink; c.beginPath(); c.ellipse(e, y, r*.82, r*1.2, 0,0,7); c.fill(); c.restore(); d.dot(e+.45, y-.85, .55, '#fff', .95); d.dot(e-.55, y+.9, .28, '#fff', .8); };
  const arc = (e, up=true) => d.line(k=>{ k.moveTo(e-2, y+(up?.8:-.8)); k.quadraticCurveTo(e, y+(up?-2.2:2), e+2, y+(up?.8:-.8)); }, ink, 1.5);
  const lid = (e) => d.line(k=>{ k.moveTo(e-2, y-.3); k.quadraticCurveTo(e, y+1.4, e+2, y-.3); }, ink, 1.5);
  eyes.forEach((e,i)=>{
    if (expr==='happy') arc(e);
    else if (expr==='sleepy') lid(e);
    else if (expr==='wink') (i===0 ? dot(e) : arc(e));
    else if (expr==='surprised') dot(e, 2.1);
    else if (expr==='sparkle'){ dot(e, 1.9); d.dot(e+.9, y+.7, .45, '#fff', .9); }
    else if (expr==='sad'){ dot(e); d.dot(e+(i===0?-1.6:1.6), y+2.6, .9, '#8fd0ff'); }
    else if (expr==='laugh') arc(e);
    else if (expr==='angry'){ dot(e, 1.8); const s = side ? 1 : (i===0 ? 1 : -1); d.line(k=>{ k.moveTo(e-2.3*s, y-3.6); k.lineTo(e+1.8*s, y-2.4); }, ink, 1.1); }
    else if (expr==='love'){ const hc = '#ff4f7a'; d.circle(e-1, y-.6, 1.25, hc, {flat:true, noShadow:true}); d.circle(e+1, y-.6, 1.25, hc, {flat:true, noShadow:true}); d.shape(k=>{ k.beginPath(); k.moveTo(e-2.15, y-.2); k.lineTo(e, y+2.3); k.lineTo(e+2.15, y-.2); k.closePath(); }, hc, [e,y,2], {flat:true, noShadow:true}); d.dot(e-1.2, y-1, .35, '#fff', .9); }
    else if (expr==='shy'){ const s = side ? 1 : (i===0 ? 1 : -1); d.line(k=>{ k.moveTo(e-1.6*s, y-1.6); k.lineTo(e+1.4*s, y); k.lineTo(e-1.6*s, y+1.6); }, ink, 1.2); }
    else if (expr==='dizzy') d.line(k=>{ for (let a=0; a<Math.PI*3.6; a+=.3){ const r = .35+a*.17; k.lineTo(e+Math.cos(a)*r, y+Math.sin(a)*r); } }, ink, .7);
    else if (expr==='cry'){ arc(e, false); d.rr(e-.6, y+1.2, 1.2, 6.5, .6, '#9fd6ff', {flat:true, noShadow:true}); }
    else if (expr==='tongue') (i===0 ? dot(e) : d.line(k=>{ k.moveTo(e-1.8, y-1.4); k.lineTo(e+1.4, y); k.lineTo(e-1.8, y+1.4); }, ink, 1.2));
    else dot(e);
  });
  if (expr==='surprised') for (const e of eyes) d.line(k=>{ k.moveTo(e-1.6, y-6); k.lineTo(e+1.6, y-6.3); }, mixHex(L.hairColor,'#000',.1), 1, .7);
  const mx = x+(side?R*.5:0);
  if (expr==='surprised'){ c.save(); c.fillStyle = mo; c.beginPath(); c.ellipse(mx, y+5.5, 1.1, 1.4, 0,0,7); c.fill(); c.restore(); }
  else if (expr==='cat') d.line(k=>{ k.moveTo(mx-2.2, y+4.6); k.quadraticCurveTo(mx-1.1, y+6.2, mx, y+4.8); k.quadraticCurveTo(mx+1.1, y+6.2, mx+2.2, y+4.6); }, mo, 1);
  else if (expr==='sleepy') d.line(k=>{ k.moveTo(mx-1, y+5.4); k.lineTo(mx+1, y+5.4); }, mo, 1);
  else if (expr==='sad') d.line(k=>{ k.moveTo(mx-1.3, y+5.8); k.quadraticCurveTo(mx, y+4.6, mx+1.3, y+5.8); }, mo, 1);
  else if (expr==='happy') d.line(k=>{ k.moveTo(mx-1.8, y+4.6); k.quadraticCurveTo(mx, y+6.8, mx+1.8, y+4.6); }, mo, 1.1);
  else if (expr==='laugh'){ c.save(); c.fillStyle = '#7a3a4a'; c.beginPath(); c.moveTo(mx-2.6, y+4.2); c.quadraticCurveTo(mx, y+9, mx+2.6, y+4.2); c.closePath(); c.fill(); c.fillStyle = '#ff8fa6'; c.beginPath(); c.ellipse(mx, y+6.4, 1.3, .8, 0,0,7); c.fill(); c.restore(); }
  else if (expr==='angry') d.line(k=>{ k.moveTo(mx-1.6, y+6); k.quadraticCurveTo(mx, y+4.6, mx+1.6, y+6); }, mo, 1);
  else if (expr==='love') d.line(k=>{ k.moveTo(mx-1.6, y+4.8); k.quadraticCurveTo(mx, y+6.6, mx+1.6, y+4.8); }, mo, 1);
  else if (expr==='shy'){ d.line(k=>{ k.moveTo(mx-1.8, y+5.2); k.quadraticCurveTo(mx-.9, y+4.4, mx, y+5.2); k.quadraticCurveTo(mx+.9, y+6, mx+1.8, y+5.2); }, mo, .9); c.save(); c.globalAlpha = .35; c.fillStyle = bl; for (const cx of cks){ c.beginPath(); c.ellipse(cx, y+3.6, 4.6, 2.8, 0,0,7); c.fill(); } c.restore(); }
  else if (expr==='dizzy') d.line(k=>{ k.moveTo(mx-2, y+5.4); for (let i=1;i<=4;i++) k.lineTo(mx-2+i, y+5.4+(i%2?-.8:0)); }, mo, .9);
  else if (expr==='cry'){ c.save(); c.fillStyle = '#7a3a4a'; c.beginPath(); c.ellipse(mx, y+5.8, 1.6, 1.2, 0,0,7); c.fill(); c.restore(); }
  else if (expr==='tongue'){ d.line(k=>{ k.moveTo(mx-1.6, y+4.8); k.quadraticCurveTo(mx, y+6, mx+1.6, y+4.8); }, mo, 1); c.save(); c.fillStyle = '#ff8fa6'; c.beginPath(); c.ellipse(mx+.4, y+6.1, 1, 1.2, 0,0,7); c.fill(); c.restore(); }

}
// 머리: 동물의 숲 주민 느낌 — 가로로 넓고 납작한 둥근 네모, 턱은 평평하게, 볼은 윤곽 안에서 은은하게
function headShape(d, x, y, R, col){
  const c = d.ctx, W = R*2.3, H = R*2.12, rr = R*1.08;
  const path = k => { k.beginPath(); k.roundRect(x-W/2, y-H*.5, W, H, [rr, rr, rr, rr]); };
  d.shape(path, col, [x, y+R*.05, R*1.15]);
  c.save(); path(c); c.clip();
  for (const sx of [-1, 1]){ const hx = x+sx*R*.6, hy = y+R*.3; const g = c.createRadialGradient(hx, hy, 0, hx, hy, R*.62); g.addColorStop(0,'rgba(255,250,244,.26)'); g.addColorStop(1,'rgba(255,250,244,0)'); c.fillStyle = g; c.fillRect(hx-R*.7, hy-R*.7, R*1.4, R*1.4); }
  const sh = c.createLinearGradient(0, y+R*.7, 0, y+R*1.3); sh.addColorStop(0,'rgba(90,40,60,0)'); sh.addColorStop(1,'rgba(90,40,60,.13)'); c.fillStyle = sh; c.fillRect(x-W, y+R*.7, W*2, R);
  c.restore();
}
// ===== 머리 모양 30 종 (남 15 · 여 15). 단위는 머리 반지름 R. layer: 'back'(머리 뒤) / 'front'(머리 앞) =====
function hairKit(d, x, y, R, hc){
  const u = v => v*R;
  const K = {
    // 돔: 윗머리 덮개. cy = 아랫선 높이, rx·ry 크기
    // 돔: 윗머리 덮개. 옆은 관자놀이(귀 위)까지 감싸 내려오고, 안쪽 경계는 둥근 아치 헤어라인 → 이마·옆에 피부 줄이 안 생겨요
    dome:(rx=1.24, ry=.78, cy=-.42)=>d.shape(c=>{ const sb = Math.max(cy+.32, -.08), hl = cy-.04;
      c.beginPath(); c.moveTo(x-u(rx), y+u(sb)); c.lineTo(x-u(rx), y+u(cy));
      c.ellipse(x, y+u(cy), u(rx), u(ry), 0, Math.PI, 0); c.lineTo(x+u(rx), y+u(sb));
      c.quadraticCurveTo(x+u(rx*.98), y+u(hl+.02), x+u(rx*.62), y+u(hl)); c.quadraticCurveTo(x, y+u(hl-.14), x-u(rx*.62), y+u(hl)); c.quadraticCurveTo(x-u(rx*.98), y+u(hl+.02), x-u(rx), y+u(sb));
      c.closePath(); }, hc, [x, y-u(.6), u(1.15)], {shadow:.3}),
    // 바가지: 돔 + 옆이 눈 높이까지 내려오는 덮개
    helmet:(rx=1.26, top=1.2, bottom=.15)=>d.shape(c=>{ c.beginPath(); c.moveTo(x-u(rx), y+u(bottom)); c.lineTo(x-u(rx), y-u(.2)); c.ellipse(x, y-u(.2), u(rx), u(top-.2), 0, Math.PI, 0); c.lineTo(x+u(rx), y+u(bottom)); c.closePath(); }, hc, [x, y-u(.4), u(1.2)], {shadow:.3}),
    lock:(x0,y0,x1,y1,w,bend=0)=>lock(d, hc, x+u(x0), y+u(y0), x+u(x1), y+u(y1), u(w), u(bend)),
    back:(w, top, h, r=.6)=>d.shape(c=>{ c.beginPath(); c.roundRect(x-u(w/2), y+u(top), u(w), u(h), u(r)); }, hc, [x, y+u(top+h/2), u(w/2)]),
    ball:(bx, by, r)=>d.circle(x+u(bx), y+u(by), u(r), hc),
    curls:(cy, n, r, span=1.2)=>{ for (let i=0;i<n;i++) d.circle(x+u(-span+2*span*i/(n-1)), y+u(cy), u(r), hc); },
    sides:(len, w=.34, top=-.4, dx=1.1)=>{ K.lock(-dx, top, -dx+.03, top+len, w, -.08); K.lock(dx, top, dx-.03, top+len, w, .08); },
    tuft:(tx, ty, r)=>d.ell(x+u(tx), y+u(ty), u(r), u(r*.75), hc),
    gloss:(gx=-.2, gy=-.95, rx=.7, ry=.22)=>{ const c=d.ctx; c.save(); c.globalAlpha=.14; c.fillStyle='#fff6ee'; c.beginPath(); c.ellipse(x+u(gx), y+u(gy), u(rx), u(ry), -.15, 0, 7); c.fill(); c.restore(); },
    // 앞머리 묶음
    sweepR:()=>{ K.lock(.35,-1.0,-1.0,.0,.42,-.4); K.lock(.35,-1.05,-.5,-.02,.36,-.2); K.lock(.35,-1.0,-.05,-.12,.3,-.05); K.lock(.4,-1.0,.45,-.2,.3,.1); K.lock(.45,-1.0,1.0,-.1,.34,.3); },
    sweepL:()=>{ K.lock(-.35,-1.0,1.0,.0,.42,.4); K.lock(-.35,-1.05,.5,-.02,.36,.2); K.lock(-.35,-1.0,.05,-.12,.3,.05); K.lock(-.4,-1.0,-.45,-.2,.3,-.1); K.lock(-.45,-1.0,-1.0,-.1,.34,-.3); },
    curtain:()=>{ K.lock(0,-1.05,-1.02,.05,.42,-.45); K.lock(0,-1.05,-.6,-.0,.34,-.2); K.lock(0,-1.05,-.22,-.3,.26,-.05); K.lock(0,-1.05,1.02,.05,.42,.45); K.lock(0,-1.05,.6,-.0,.34,.2); K.lock(0,-1.05,.22,-.3,.26,.05); },
    straight:(bottom=-.05)=>{ const dy=[.0,-.08,.03,-.06,.01,-.05]; for (let i=0;i<6;i++){ const lx=-.9+i*.36; K.lock(lx*.55,-1.05,lx,bottom+dy[i],.34,lx*.08); } },
    short:()=>{ K.lock(.3,-1.0,-.85,-.25,.4,-.25); K.lock(.3,-1.05,-.35,-.18,.34,-.12); K.lock(.3,-1.0,.1,-.3,.3,0); K.lock(.35,-1.0,.6,-.22,.32,.15); K.lock(.45,-1.0,1.0,-.38,.3,.2); },
    spikes:(n=5, h=.35)=>{ for (let i=0;i<n;i++){ const lx=-.8+1.6*i/(n-1); K.lock(lx*.7,-1.0,lx,-1.15-h+Math.abs(lx)*.2,.22,0,false); } },
  };
  return K;
}
// ===== 머리 모양 30종 (남 15 · 여 15) =====
// 모든 머리는 같은 '정수리 윤곽'(가로 반지름 1.27R, 위 끝 -1.25R)에서 시작해서
// 앞모습·옆모습·뒷모습이 하나의 덩어리로 이어지게 그려요. 단위는 머리 반지름 R, 원점은 머리 중심.
//   len   : 길이 (LENS)   fr: 정면 앞머리   sf: 옆모습 앞머리
//   wave  : 0 생머리 · 1 잔웨이브 · 2 펌   curl: 끝만 안으로 C컬   layer: 끝을 층지게
//   tie   : pony 포니테일 · sidepony · bun 똥머리 · twinbun · twin 양갈래 · braid 땋은 머리 · halfup 반묶음
const CROWN = {rx:1.27, cy:-.3, ry:.95};
// side: 정면에서 얼굴 옆으로 내려오는 옆머리 끝 / back: 뒷모습 끝 / mass: 등 뒤로 늘어지는 덩어리 끝(없으면 0) / nape: 옆모습 뒷목 끝
const LENS = {
  tight:   {side:-.14, back:.8,  mass:0,    nape:.74},
  short:   {side:-.06, back:.92, mass:0,    nape:.86},
  ear:     {side:.3,   back:1.0, mass:0,    nape:.95},
  nape:    {side:.22,  back:1.16, mass:0,   nape:1.05},
  chin:    {side:.98,  back:1.08, mass:1.08, nape:.8},
  shoulder:{side:1.3,  back:1.42, mass:1.42, nape:.8},
  long:    {side:1.78, back:1.92, mass:1.92, nape:.8},
};
export const HAIR = {
  // ---------- 남 15 ----------
  short:   {g:'m', label:'숏컷',         len:'short', fr:'short',    sf:'short'},
  part:    {g:'m', label:'가르마',       len:'short', fr:'sweepR',   sf:'sweep'},
  dandy:   {g:'m', label:'댄디컷',       len:'ear',   fr:'straight', sf:'straight'},
  center:  {g:'m', label:'가운데 가르마', len:'short', fr:'curtain',  sf:'curtain'},
  perm:    {g:'m', label:'소프트 펌',    len:'ear',   fr:'perm',     sf:'sweep', wave:2},
  twoblock:{g:'m', label:'투블록',       len:'tight', fr:'twoblock', sf:'sweep'},
  slick:   {g:'m', label:'올백',         len:'short', fr:'up',       sf:'up'},
  wolf:    {g:'m', label:'울프컷',       len:'nape',  fr:'wolf',     sf:'sweep', layer:true},
  longm:   {g:'m', label:'장발',         len:'shoulder', fr:'curtain', sf:'curtain'},
  comma:   {g:'m', label:'쉼표머리',     len:'short', fr:'comma',    sf:'comma'},
  gile:    {g:'m', label:'가일컷',       len:'ear',   fr:'gile',     sf:'gile'},
  seethru: {g:'m', label:'시스루뱅',     len:'short', fr:'thin',     sf:'thin'},
  layered: {g:'m', label:'레이어드컷',   len:'chin',  fr:'curtain',  sf:'curtain', layer:true},
  softwave:{g:'m', label:'내추럴 웨이브', len:'ear',  fr:'softwave', sf:'curtain', wave:1},
  asperm:  {g:'m', label:'애즈펌',       len:'ear',   fr:'asperm',   sf:'curtain', wave:2},
  crop:    {g:'m', label:'스포츠머리',   len:'tight', fr:'crop',     sf:'short'},
  crew:    {g:'m', label:'크루컷',       len:'tight', fr:'crew',     sf:'short'},
  ivy:     {g:'m', label:'아이비리그컷', len:'tight', fr:'ivy',      sf:'short'},
  regent:  {g:'m', label:'리젠트컷',     len:'tight', fr:'regent',   sf:'up'},
  shortdandy:{g:'m', label:'짧은 댄디컷', len:'short', fr:'shortstraight', sf:'short'},
  // ---------- 여 15 ----------
  ccurl:   {g:'f', label:'C컬 단발',     len:'chin',  fr:'sweepR',   sf:'sweep', curl:true},
  bob:     {g:'f', label:'단발',         len:'chin',  fr:'sweepR',   sf:'sweep'},
  long:    {g:'f', label:'긴 생머리',    len:'long',  fr:'sweepR',   sf:'sweep'},
  pony:    {g:'f', label:'포니테일',     len:'tight', fr:'sweepL',   sf:'sweep', tie:'pony'},
  wave:    {g:'f', label:'웨이브',       len:'shoulder', fr:'curtain', sf:'curtain', wave:2},
  bun:     {g:'f', label:'똥머리',       len:'tight', fr:'upbun',    sf:'up', tie:'bun'},
  twin:    {g:'f', label:'양갈래',       len:'tight', fr:'straight', sf:'straight', tie:'twin'},
  braid:   {g:'f', label:'땋은 머리',    len:'tight', fr:'sweepR',   sf:'sweep', tie:'braid'},
  twinbun: {g:'f', label:'트윈 번',      len:'tight', fr:'upbun',    sf:'up', tie:'twinbun'},
  shortbob:{g:'f', label:'앞머리 단발',  len:'chin',  fr:'straight', sf:'straight'},
  sidepony:{g:'f', label:'사이드 포니',  len:'tight', fr:'sweepR',   sf:'sweep', tie:'sidepony'},
  halfup:  {g:'f', label:'반묶음',       len:'long',  fr:'curtain',  sf:'curtain', tie:'halfup'},
  bangslong:{g:'f', label:'뱅 긴 머리',  len:'long',  fr:'straight', sf:'straight'},
  pixie:   {g:'f', label:'픽시컷',       len:'short', fr:'pixie',    sf:'sweep'},
  medium:  {g:'f', label:'레이어드 미디엄', len:'shoulder', fr:'curtain', sf:'curtain', layer:true},
  odango:  {g:'f', label:'만두 긴 머리', len:'long',  fr:'straight', sf:'straight', tie:'odango'},
  twinlong:{g:'f', label:'긴 양갈래',   len:'tight', fr:'straight', sf:'straight', tie:'twinlong'},
  twinbraid:{g:'f', label:'땋은 양갈래', len:'tight', fr:'curtain',  sf:'curtain', tie:'twinbraid'},
  longbun: {g:'f', label:'똥머리 긴 머리', len:'long', fr:'sweepR', sf:'sweep', tie:'bun'},
};
// 정면 앞머리 (hairKit 의 가닥으로)
const FRINGE = {
  short:K=>K.short(), sweepR:K=>K.sweepR(), sweepL:K=>K.sweepL(), curtain:K=>K.curtain(), straight:K=>K.straight(-.04),
  comma:K=>{ K.lock(-.15,-1.05,-.95,-.15,.4,-.35); K.lock(.1,-1.08,-.35,.05,.42,-.55); K.lock(.2,-1.05,.3,-.2,.34,.3); K.lock(.35,-1.0,.95,-.2,.36,.3); },
  gile:K=>{ K.lock(.55,-1.05,-1.0,.15,.46,-.5); K.lock(.55,-1.05,-.45,.05,.4,-.3); K.lock(.55,-1.0,.1,-.25,.3,-.05); K.lock(.6,-1.0,1.0,-.25,.34,.2); },
  thin:K=>{ const dy=[.0,-.06,.03,-.04,.02]; for (let i=0;i<5;i++){ const lx=-.8+i*.4; K.lock(lx*.4,-1.05,lx,-.02+dy[i],.25,lx*.12); } },
  up:K=>{ K.lock(-.7,-.62,-.4,-1.2,.3,-.1); K.lock(0,-.68,.05,-1.24,.32,0); K.lock(.7,-.62,.45,-1.2,.3,.1); },
  upbun:K=>{ K.lock(-.75,-.55,-.15,-1.12,.26,-.18); K.lock(.75,-.55,.15,-1.12,.26,.18); K.lock(.35,-1.0,-.55,-.28,.26,-.15); },
  twoblock:K=>{ K.lock(.2,-1.1,-.9,-.1,.44,-.35); K.lock(.2,-1.15,-.3,-.05,.38,-.15); K.lock(.2,-1.1,.3,-.2,.34,.05); K.lock(.25,-1.1,.85,-.2,.36,.25); },
  perm:K=>{ K.lock(.2,-1.05,-.9,-.02,.44,-.5); K.lock(.2,-1.05,-.4,.0,.4,.25); K.lock(.2,-1.05,.2,-.22,.34,-.2); K.lock(.3,-1.0,.9,-.1,.4,.4); },
  wolf:K=>{ K.sweepL(); K.lock(-1.1,-.3,-1.16,.45,.28,-.06); K.lock(1.1,-.3,1.16,.45,.28,.06); },
  softwave:K=>{ K.lock(0,-1.05,-1.0,.05,.42,-.25); K.lock(0,-1.05,-.55,-.05,.36,.15); K.lock(0,-1.05,-.15,-.3,.3,-.1); K.lock(0,-1.05,1.0,.05,.42,.25); K.lock(0,-1.05,.55,-.05,.36,-.15); K.lock(0,-1.05,.15,-.3,.3,.1); },
  asperm:K=>{ K.lock(0,-1.05,-.95,.0,.42,-.45); K.lock(0,-1.05,-.5,-.02,.36,-.2); K.lock(0,-1.05,.95,.0,.42,.45); K.lock(0,-1.05,.5,-.02,.36,.2); },
  crop:K=>{ for (let i=0;i<6;i++){ const lx=-.85+i*.34; K.lock(lx*.5,-1.12,lx,-.62+(i%2)*.05,.3,lx*.06); } },
  crew:K=>{ K.spikes(6,.12); for (let i=0;i<5;i++){ const lx=-.8+i*.4; K.lock(lx*.45,-1.12,lx,-.55,.3,lx*.05); } },
  ivy:K=>{ K.lock(.45,-1.08,-.9,-.42,.38,-.2); K.lock(.45,-1.1,-.4,-.5,.32,-.1); K.lock(.5,-1.08,.1,-.62,.28,0); K.lock(.55,-1.05,.85,-.5,.3,.15); },
  regent:K=>{ K.lock(-.2,-.7,-.1,-1.38,.5,-.25); K.lock(.25,-.72,.3,-1.36,.44,.2); K.lock(-.8,-.55,-.62,-1.12,.3,-.1); K.lock(.8,-.55,.62,-1.12,.3,.1); },
  shortstraight:K=>K.straight(-.32),
  pixie:K=>{ K.lock(.4,-1.0,-1.0,.0,.38,-.35); K.lock(.4,-1.05,-.4,-.1,.34,-.15); K.lock(.4,-1.0,.15,-.28,.3,0); K.lock(.45,-1.0,.75,-.3,.3,.15); },
};
const TIE_COL = '#ff9fc4';
function hairTools(d, x, y, R, hc){
  const u = v => v*R, dark = mixHex(hc, '#1a0f14', .3), deep = mixHex(hc, '#1a0f14', .42), c = d.ctx;
  const T = {
    u, dark, deep,
    crownArc:k=>k.ellipse(x, y+u(CROWN.cy), u(CROWN.rx), u(CROWN.ry), 0, Math.PI, 0),
    // 가닥 결: 어두운 곡선 몇 줄
    strand:(pts, a=.32, w=.06)=>d.line(k=>{ k.moveTo(x+u(pts[0]), y+u(pts[1])); k.quadraticCurveTo(x+u(pts[2]), y+u(pts[3]), x+u(pts[4]), y+u(pts[5])); }, dark, u(w), a),
    gloss:(gx, gy, rx=.62, ry=.2)=>{ c.save(); c.globalAlpha=.16; c.fillStyle='#fff6ee'; c.beginPath(); c.ellipse(x+u(gx), y+u(gy), u(rx), u(ry), -.15, 0, 7); c.fill(); c.restore(); },
    ball:(bx, by, r, col=hc)=>d.circle(x+u(bx), y+u(by), u(r), col),
    tie:(bx, by, r=.15)=>{ d.ell(x+u(bx), y+u(by), u(r*1.25), u(r), TIE_COL); d.dot(x+u(bx-r*.35), y+u(by-r*.3), u(r*.28), '#fff', .7); },
    tail:(x0, y0, x1, y1, w, bend)=>lock(d, hc, x+u(x0), y+u(y0), x+u(x1), y+u(y1), u(w), u(bend)),
    braid:(x0, y0, x1, y1, n=5, r=.21)=>{ for (let i=0;i<n;i++){ const t = i/(n-1); d.circle(x+u(x0+(x1-x0)*t+(i%2?.05:-.05)), y+u(y0+(y1-y0)*t), u(r*(1-t*.18)), hc); } },
  };
  return T;
}
// 뒤로 늘어지는 덩어리(정면·뒷모습 공용 윤곽): 정수리에서 그대로 내려와 끝에서 둥글게 모여요
function massPath(k, x, y, u, L, flare, curlIn){
  const ox = CROWN.rx;
  k.moveTo(x-u(ox), y+u(CROWN.cy)); k.ellipse(x, y+u(CROWN.cy), u(ox), u(CROWN.ry), 0, Math.PI, 0);
  k.bezierCurveTo(x+u(ox+flare*.4), y+u(L*.35), x+u(ox+flare), y+u(L*.7), x+u(ox+flare*.7), y+u(L-.12));
  k.quadraticCurveTo(x+u(ox+flare*.4), y+u(L+(curlIn?.06:0)), x+u(ox-.3), y+u(L));
  k.lineTo(x-u(ox-.3), y+u(L));
  k.quadraticCurveTo(x-u(ox+flare*.4), y+u(L+(curlIn?.06:0)), x-u(ox+flare*.7), y+u(L-.12));
  k.bezierCurveTo(x-u(ox+flare), y+u(L*.7), x-u(ox+flare*.4), y+u(L*.35), x-u(ox), y+u(CROWN.cy));
  k.closePath();
}
function waveEdge(T, L, side, n, r){ // 웨이브: 옆선과 끝에 둥근 컬
  for (let i=0;i<n;i++){ const t = (i+1)/(n+1), yy = -.1 + (L+.1)*t; for (const s of side) T.ball(s*(CROWN.rx+.06+Math.sin(i*1.7)*.04), yy, r); }
}
// ---------- 정면 ----------
function hairFront(d, x, y, R, L, sp, layer){
  const hc = L.hairColor, T = hairTools(d, x, y, R, hc), u = T.u, ln = LENS[sp.len] || LENS.short;
  if (layer==='back'){
    if (sp.tie==='bun') T.ball(0, -1.32, .42);
    if (sp.tie==='twinbun'){ T.ball(-.95, -1.08, .36); T.ball(.95, -1.08, .36); }
    if (sp.tie==='odango'){ T.ball(-.84, -1.16, .47); T.ball(.84, -1.16, .47); T.tie(-.6, -.82, .13); T.tie(.6, -.82, .13); }
    if (sp.tie==='halfup') T.ball(0, -1.3, .27);
    if (sp.tie==='pony'){ T.tail(.75, -.85, 1.42, .95, .34, .35); }
    if (sp.tie==='twin'){ T.tail(-1.12, -.22, -1.42, 1.05, .3, -.28); T.tail(1.12, -.22, 1.42, 1.05, .3, .28); }
    if (sp.tie==='twinlong'){ T.tail(-1.12, -.22, -1.5, 1.95, .36, -.32); T.tail(1.12, -.22, 1.5, 1.95, .36, .32); }
    if (ln.mass){
      d.shape(k=>{ k.beginPath(); massPath(k, x, y, u, ln.mass, sp.wave ? .16 : .08, sp.curl); }, hc, [x, y+u(ln.mass/2-.3), u(1.35)], {shadow:.35});
      // 안쪽(목 뒤) 그늘: 머리카락 덩어리의 속
      d.shape(k=>{ k.beginPath(); k.roundRect(x-u(.92), y+u(.45), u(1.84), u(ln.mass-.5), u(.35)); }, T.deep, [x, y+u(ln.mass/2), u(.9)], {flat:true, noShadow:true});
      if (sp.wave) waveEdge(T, ln.mass, [-1, 1], 3, .2);
      if (sp.curl){ T.ball(-1.05, ln.mass-.06, .25); T.ball(1.05, ln.mass-.06, .25); }
      if (sp.layer) for (const s of [-1, 1]) T.tail(s*1.2, ln.mass*.55, s*1.32, ln.mass+.08, .22, s*.06);
    }
    return;
  }
  // 앞 덮개: 정수리 → 관자놀이 → (길이에 따라) 얼굴 옆을 따라 내려오는 옆머리. 안쪽은 이마 헤어라인
  const ox = CROWN.rx, sb = ln.side, ix = sb > .5 ? .98 : sb > .1 ? 1.06 : 1.13, fl = sb > .5 ? .05 : 0;
  d.shape(k=>{ k.beginPath();
    k.moveTo(x-u(ox+fl), y+u(sb-.14)); k.lineTo(x-u(ox), y+u(CROWN.cy)); T.crownArc(k); k.lineTo(x+u(ox+fl), y+u(sb-.14));
    k.quadraticCurveTo(x+u(ox+fl), y+u(sb), x+u((ox+ix)/2), y+u(sb)); k.quadraticCurveTo(x+u(ix), y+u(sb), x+u(ix), y+u(sb-.16));
    k.lineTo(x+u(ix), y-u(.28));
    k.quadraticCurveTo(x+u(ix*.96), y-u(.47), x+u(.62), y-u(.5)); k.quadraticCurveTo(x, y-u(.64), x-u(.62), y-u(.5)); k.quadraticCurveTo(x-u(ix*.96), y-u(.47), x-u(ix), y-u(.28));
    k.lineTo(x-u(ix), y+u(sb-.16)); k.quadraticCurveTo(x-u(ix), y+u(sb), x-u((ox+ix)/2), y+u(sb)); k.quadraticCurveTo(x-u(ox+fl), y+u(sb), x-u(ox+fl), y+u(sb-.14));
    k.closePath(); }, hc, [x, y-u(.5), u(1.2)], {shadow:.3});
  if (sb > .5) for (const s of [-1, 1]){ T.strand([s*1.12, -.2, s*1.18, sb*.5, s*1.1, sb-.1]); }
  if (sp.wave && !ln.mass){ for (const s of [-1, 1]){ T.ball(s*1.2, Math.max(sb, .05)-.1, .25); T.ball(s*1.25, -.32, .2); } }
  if (sp.wave && ln.mass) for (const s of [-1, 1]){ T.ball(s*1.08, sb-.05, .2); }
  if (sp.curl) for (const s of [-1, 1]) T.ball(s*1.02, sb-.04, .2);
  if (sp.layer && ln.mass) for (const s of [-1, 1]) T.tail(s*1.05, sb*.45, s*1.0, sb+.08, .2, s*-.05);
  // 정수리 가르마 결
  T.strand([0, -1.22, -.35, -1.0, -.75, -.72], .22); T.strand([0, -1.22, .35, -1.0, .75, -.72], .22);
  const K = hairKit(d, x, y, R, hc); (FRINGE[sp.fr] || FRINGE.short)(K);
  if (sp.tie==='sidepony'){ T.tail(-1.15, -.05, -1.35, 1.25, .34, -.3); T.tie(-1.15, -.06); }
  if (sp.tie==='braid'){ T.braid(1.08, -.15, 1.16, 1.15, 6); T.tie(1.16, 1.25, .12); }
  if (sp.tie==='twin' || sp.tie==='twinlong'){ T.tie(-1.13, -.22); T.tie(1.13, -.22); }
  if (sp.tie==='twinbraid'){ T.braid(-1.08, -.1, -1.2, 1.6, 8); T.braid(1.08, -.1, 1.2, 1.6, 8); T.tie(-1.2, 1.7, .12); T.tie(1.2, 1.7, .12); T.tie(-1.1, -.2); T.tie(1.1, -.2); }
  if (sp.tie==='bun' || sp.tie==='twinbun') { /* 앞에서는 머리끈이 안 보여요 */ }
  T.gloss(-.25, -.95);
}
// ---------- 옆모습 (오른쪽을 보는 기준, 앞 = +x) ----------
const SIDE_FR = {
  sweep:(L)=>{ L(-.1,-1.12, .98, -.02, .42, .15); L(0,-1.12, .62, -.2, .32, .05); },
  short:(L)=>{ L(-.1,-1.12, .98, -.3, .42, .15); L(0,-1.12, .62, -.48, .32, .05); },
  straight:(L, d, x, y, u, hc)=>{ d.shape(k=>{ k.beginPath(); k.roundRect(x+u(.1), y-u(1.05), u(.92), u(1.03), [u(.12),u(.12),u(.3),u(.3)]); }, hc, [x+u(.55), y-u(.5), u(.6)], {seam:true, shadow:.4}); L(.3,-.9,.95,-.02,.3,.05); },
  curtain:(L)=>{ L(.2,-1.12, 1.0, -.08, .4, .25); L(.1,-1.12, .5, -.25, .28, .05); },
  comma:(L)=>{ L(-.05,-1.14, .98, -.05, .44, .45); L(.05,-1.12, .55, -.3, .3, .1); },
  gile:(L)=>{ L(-.1,-1.12, 1.05, .28, .46, .3); L(0,-1.12, .6, -.2, .3, .05); },
  thin:(L)=>{ for (let i=0;i<5;i++) L(.05+i*.04,-1.08, .32+i*.17, -.03-(i%2)*.07, .24, .1); },
  up:(L)=>{ L(.2,-.95, -.4,-1.28, .3, .05); L(.6,-.8, 0,-1.3, .3, .05); },
};
function hairSide(d, x, y, R, L, sp, layer){
  const hc = L.hairColor, T = hairTools(d, x, y, R, hc), u = T.u, ln = LENS[sp.len] || LENS.short;
  if (layer==='back'){
    if (sp.tie==='bun') T.ball(-.5, -1.25, .42);
    if (sp.tie==='twinbun'){ T.ball(-.2, -1.18, .34); T.ball(-.62, -1.05, .36); }
    if (sp.tie==='odango'){ T.ball(-.12, -1.32, .45); T.ball(-.68, -1.15, .47); }
    if (sp.tie==='halfup') T.ball(-.72, -1.05, .27);
    if (sp.tie==='pony') T.tail(-1.22, -.62, -1.62, .95, .36, -.4);
    if (sp.tie==='twin') T.tail(-1.0, -.2, -1.38, 1.05, .3, -.28);
    if (sp.tie==='twinlong') T.tail(-1.0, -.2, -1.45, 1.95, .34, -.32);
    if (sp.tie==='twinbraid') T.braid(-.95, 0, -1.15, 1.6, 8);
    if (ln.mass){ // 뒤통수에서 등 뒤로 이어지는 머리: 덮개의 뒷선과 같은 선에서 출발
      const M = ln.mass, fl = sp.wave ? .16 : .08;
      d.shape(k=>{ k.beginPath(); k.moveTo(x+u(.1), y-u(1.24)); k.quadraticCurveTo(x-u(1.34), y-u(1.2), x-u(1.32), y-u(.15));
        k.bezierCurveTo(x-u(1.34+fl), y+u(M*.5), x-u(1.36+fl), y+u(M-.3), x-u(1.18), y+u(M));
        k.quadraticCurveTo(x-u(.8), y+u(M+.06), x-u(.42), y+u(M-.06));
        k.quadraticCurveTo(x-u(.25), y+u(M*.6), x-u(.3), y+u(.3)); k.lineTo(x+u(.1), y-u(.2)); k.closePath(); }, hc, [x-u(.6), y+u(M/2-.4), u(1.2)], {shadow:.35});
      if (sp.wave) for (let i=0;i<3;i++) T.ball(-1.3-fl*.5, .2+(M-.2)*(i+1)/4, .2);
      if (sp.curl) T.ball(-1.0, M-.05, .25);
      if (sp.layer) T.tail(-1.2, M*.5, -1.32, M+.08, .22, -.06);
      T.strand([-1.1, -.2, -1.22, M*.5, -1.1, M-.12]); T.strand([-.7, .1, -.75, M*.5, -.65, M-.1], .25);
    }
    return;
  }
  // 귀: 머리 옆면 가운데보다 조금 뒤 (덮개보다 먼저 그려서 머리선이 귀를 감싸게)
  d.ell(x-u(.36), y+u(.2), u(.3), u(.32), L.skin);
  // 앞머리 끝 높이: 옆에서 봐도 이마가 비치지 않게 덮개가 이 선까지 내려와요 (올림머리만 이마를 드러내요)
  const FB = {sweep:-.02, short:-.16, straight:-.02, curtain:-.06, comma:-.04, gile:.08, thin:-.04, up:-.72};
  const fy = FB[sp.sf] ?? -.04, nape = ln.nape, fx = sp.sf==='up' ? 1.0 : 1.21;
  d.shape(k=>{ k.beginPath(); k.moveTo(x+u(fx), y+u(fy));
    if (sp.sf==='up') k.quadraticCurveTo(x+u(.98), y-u(1.22), x, y-u(1.25));
    else { k.lineTo(x+u(1.21), y-u(.5)); k.quadraticCurveTo(x+u(1.22), y-u(1.22), x, y-u(1.25)); }  // 머리 앞 윤곽 바깥으로 감싸 내려와요
    k.quadraticCurveTo(x-u(1.34), y-u(1.2), x-u(1.32), y-u(.15));
    k.lineTo(x-u(1.25), y+u(nape));
    k.quadraticCurveTo(x-u(.95), y+u(nape+.12), x-u(.66), y+u(nape-.04));
    k.quadraticCurveTo(x-u(.62), y+u(.12), x-u(.62), y-u(.08)); // 귀 뒤로 돌아서
    k.quadraticCurveTo(x-u(.45), y-u(.22), x-u(.24), y-u(.12)); // 귀 위
    k.lineTo(x-u(.2), y+u(.1)); k.lineTo(x-u(.08), y-u(.18)); // 구레나룻
    if (sp.sf==='up') k.quadraticCurveTo(x+u(.3), y+u(fy-.08), x+u(fx), y+u(fy));
    else k.bezierCurveTo(x+u(.15), y+u(fy-.04), x+u(.6), y+u(fy+.03), x+u(fx), y+u(fy)); // 이마를 덮는 아래 경계 = 앞머리 끝
    k.closePath(); }, hc, [x-u(.3), y-u(.5), u(1.15)], {shadow:.3});
  if (ln.mass) T.tail(-.2, -.85, -.6, Math.min(ln.mass, 1.2), .34, -.12); // 귀를 덮고 어깨 뒤로 흐르는 옆머리
  if (sp.wave && !ln.mass){ T.ball(-1.24, nape-.22, .25); T.ball(-.95, nape-.1, .23); T.ball(-1.3, -.35, .2); }
  T.strand([-.1, -1.22, -.85, -1.0, -1.15, -.35], .22); T.strand([.3, -1.15, -.3, -.75, -.6, -.2], .18);
  const Lk = (x0,y0,x1,y1,w,b=0)=>lock(d, hc, x+u(x0), y+u(y0), x+u(x1), y+u(y1), u(w), u(b));
  (SIDE_FR[sp.sf] || SIDE_FR.sweep)(Lk, d, x, y, u, hc);
  if (sp.tie==='pony') T.tie(-1.22, -.62);
  if (sp.tie==='bun') T.tie(-.42, -.92, .13);
  if (sp.tie==='twin'){ T.tail(-.62, -.15, -.92, 1.05, .3, -.25); T.tie(-.62, -.15); }
  if (sp.tie==='twinlong'){ T.tail(-.62, -.15, -.98, 1.9, .34, -.28); T.tie(-.62, -.15); }
  if (sp.tie==='twinbraid'){ T.braid(-.62, .05, -.82, 1.62, 8); T.tie(-.82, 1.72, .12); T.tie(-.62, -.1); }
  if (sp.tie==='sidepony'){ T.tail(-.72, .12, -.95, 1.3, .34, -.25); T.tie(-.72, .1); }
  if (sp.tie==='braid'){ T.braid(-.62, .05, -.78, 1.2, 6); T.tie(-.78, 1.3, .12); }
  T.gloss(-.3, -.95);
}
// ---------- 뒷모습 ----------
function hairBack(d, x, y, R, L, sp){
  const hc = L.hairColor, T = hairTools(d, x, y, R, hc), u = T.u, ln = LENS[sp.len] || LENS.short, B = ln.back, ox = CROWN.rx;
  if (sp.tie==='pony') T.tail(0, -.5, .06, 1.15, .44, .08);
  if (sp.tie==='twin'){ T.tail(-1.12, -.22, -1.42, 1.05, .3, -.28); T.tail(1.12, -.22, 1.42, 1.05, .3, .28); }
  if (sp.tie==='twinlong'){ T.tail(-1.12, -.22, -1.5, 1.95, .36, -.32); T.tail(1.12, -.22, 1.5, 1.95, .36, .32); }
  if (ln.mass){
    d.shape(k=>{ k.beginPath(); massPath(k, x, y, u, B, sp.wave ? .16 : .08, sp.curl); }, hc, [x, y+u(B/2-.3), u(1.35)], {shadow:.35});
  } else {
    // 짧은 머리: 뒤통수를 감싸고 뒷목에서 가닥 끝이 살짝 갈라져요
    const tips = sp.len==='nape' ? 4 : 3;
    d.shape(k=>{ k.beginPath(); k.moveTo(x-u(ox), y+u(CROWN.cy)); T.crownArc(k);
      k.quadraticCurveTo(x+u(ox+.02), y+u(B*.55), x+u(ox-.12), y+u(B-.08));
      for (let i=0;i<tips;i++){ const x0 = ox-.12 - (2*(ox-.12))*(i/tips), x1 = ox-.12 - (2*(ox-.12))*((i+1)/tips), xm = (x0+x1)/2;
        k.quadraticCurveTo(x+u(xm+.06), y+u(B+(sp.len==='nape'?.22:.07)), x+u(x1), y+u(B-.04)); }
      k.quadraticCurveTo(x-u(ox+.02), y+u(B*.55), x-u(ox), y+u(CROWN.cy)); k.closePath(); }, hc, [x, y-u(.3), u(1.25)], {shadow:.35});
  }
  // 가마와 결
  const Bend = Math.min(B, 1.0) - .1;
  for (const s of [-1, -.4, .4, 1]) T.strand([.08, -.9, s*.75, -.4, s*(1.0), Bend], .2);
  d.line(k=>{ k.arc(x+u(.08), y-u(.88), u(.12), 0, 5); }, T.dark, u(.05), .35);
  if (ln.mass){ if (sp.wave){ for (let i=0;i<5;i++) T.ball(-1.0+i*.5, B-.04, .24); waveEdge(T, B, [-1, 1], 3, .2); }
    if (sp.curl) for (let i=0;i<4;i++) T.ball(-.9+i*.6, B-.04, .25);
    if (sp.layer) for (const s of [-1, 0, 1]) T.tail(s*.7, B*.6, s*.78, B+.1, .24, s*.05); }
  if (sp.wave && !ln.mass) for (let i=0;i<4;i++) T.ball(-.9+i*.6, B-.02, .22);
  if (sp.tie==='pony') T.tie(0, -.5, .17);
  if (sp.tie==='bun'){ T.ball(0, -1.18, .42); T.tie(0, -.82, .14); }
  if (sp.tie==='twinbun'){ T.ball(-.95, -1.05, .36); T.ball(.95, -1.05, .36); }
  if (sp.tie==='odango'){ T.ball(-.84, -1.14, .47); T.ball(.84, -1.14, .47); T.tie(-.6, -.8, .13); T.tie(.6, -.8, .13); }
  if (sp.tie==='halfup'){ T.ball(0, -.85, .27); T.tie(0, -.62, .12); }
  if (sp.tie==='twin' || sp.tie==='twinlong'){ T.tie(-1.13, -.22); T.tie(1.13, -.22); }
  if (sp.tie==='twinbraid'){ T.braid(-1.08, -.1, -1.2, 1.6, 8); T.braid(1.08, -.1, 1.2, 1.6, 8); T.tie(-1.2, 1.7, .12); T.tie(1.2, 1.7, .12); T.tie(-1.1, -.2); T.tie(1.1, -.2); }
  if (sp.tie==='sidepony'){ T.tail(1.15, -.05, 1.35, 1.25, .34, .3); T.tie(1.15, -.06); }
  if (sp.tie==='braid'){ T.braid(-1.08, -.15, -1.16, 1.15, 6); T.tie(-1.16, 1.25, .12); }
  T.gloss(0, -.95, .7, .22);
}
function hair(d, x, y, L, side, R, layer, up=false){
  if (L.hair==='none') return;
  const sp = HAIR[L.hair] || HAIR.short;
  if (up){ hairBack(d, x, y, R, L, sp); return; }
  if (side){ hairSide(d, x, y, R, L, sp, layer); return; }
  hairFront(d, x, y, R, L, sp, layer);
}


// 그림용 좌표: 발바닥 (0,0), 몸 윗선 by, 머리 중심 hy. 머리 높이 ≈ 몸 높이
const R = 15, BH = 21, BW = 15.5;
const BY = -BH, HY = BY - R*1.06 + 1.6;

// ---------- 옷 카탈로그 ----------
// 각 항목: {name, price, draw(d, g)}  g = {c, side, up, bw, step, sk, L}
// 공통 그리기 도움
const torso = (d, g, col, o) => d.rr(-g.bw/2, BY, g.bw, BH*.64, 4.5, col, o);
// 소원 빌기: 팔은 안쪽으로 모이고, 손은 가슴 앞에서 맞닿아요
const praySleeves = (d, g, col) => { d.ell(-g.bw/2+.6, BY+BH*.36, 3.2, 4.2, col); d.ell(g.bw/2-.6, BY+BH*.36, 3.2, 4.2, col); };
const prayHands = (d, g) => { d.ell(-1.45, BY+BH*.16, 2.4, 4.5, g.sk); d.ell(1.45, BY+BH*.16, 2.4, 4.5, g.sk); d.line(k=>{ k.moveTo(0, BY+BH*.16-3.8); k.lineTo(0, BY+BH*.16+3.6); }, 'rgba(150,100,90,.5)', .7, .8); };
const sleeves = (d, g, col) => { if (g.pray) return praySleeves(d, g, col); if (!g.side) d.ell(-g.bw/2-1.4, BY+BH*.34, 3.2, 4.6, col); d.ell(g.bw/2+1.4, BY+BH*.34, 3.2, 4.6, col); };
const hands = (d, g) => { if (g.pray) return prayHands(d, g); if (!g.side) d.ell(-g.bw/2-1.6, BY+BH*.48, 3.1, 3.7, g.sk); d.ell(g.bw/2+1.6, BY+BH*.48, 3.1, 3.7, g.sk); };
const bareArms = (d, g) => { if (g.pray){ praySleeves(d, g, g.sk); return prayHands(d, g); } if (!g.side) d.ell(-g.bw/2-1.6, BY+BH*.44, 3.1, 4.4, g.sk); d.ell(g.bw/2+1.6, BY+BH*.44, 3.1, 4.4, g.sk); };
const collar = (d, g, col) => { if (g.up) return; d.shape(c=>{ c.beginPath(); c.moveTo(-4, BY); c.lineTo(0, BY+4); c.lineTo(4, BY); c.closePath(); }, col, [0,BY+2,4], {flat:true}); };
const stripe = (d, g, col, n=3) => { if (g.up) return; for (let i=0;i<n;i++) d.rr(-g.bw/2+1, BY+2.5+i*3.2, g.bw-2, 1.4, .7, col, {flat:true, noShadow:true}); };
const front = (d, g, col) => { if (!g.up) d.rr(-BW*.16, BY+1.5, BW*.32, BH*.55, 2.5, col, {flat:true}); };
const pants = (d, g, col, h=.4) => d.rr(-g.bw*.4, BY+BH*.48, g.bw*.8, BH*.2, 3, col);
const SK0 = BY+BH*.56, skB = h => BY+BH*.64 + 4.6*(h/.42);
const skirt = (d, g, col, flare=1.15, h=.42) => { const b = skB(h); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.42, SK0); c.lineTo(g.bw*.42, SK0); c.lineTo(g.bw*.5*flare, b); c.quadraticCurveTo(0, b+BH*.08, -g.bw*.5*flare, b); c.closePath(); }, col, [0, (SK0+b)/2, g.bw*.6]); };
const pleats = (d, g, col, h=.42, n=2) => { if (g.up || g.side) return; const b = skB(h); d.line(k=>{ for (let i=-n;i<=n;i++){ k.moveTo(i*3, BY+BH*.66); k.lineTo(i*3.6, b-.4); } }, col, .8, .6); };
const shorts = (d, g, col, len=3.2) => { for (const f of feet(g)) d.rr(f.x-2.35, -8.8-f.lift, 4.7, len, 1.4, shade(col, f)); };
const longArms = (d, g, col) => { sleeves(d, g, col); hands(d, g); };
const dots = (d, g, col, pts, r=.7) => { if (g.up) return; for (const [px,py] of pts) d.dot(px, BY+py, r, col); };
const checks = (d, g, col, y0, y1, step=3) => { if (g.up && false) return; d.line(k=>{ for (let x=-g.bw/2+step; x<g.bw/2; x+=step){ k.moveTo(x, y0); k.lineTo(x, y1); } for (let y=y0+step; y<y1; y+=step){ k.moveTo(-g.bw/2+.5, y); k.lineTo(g.bw/2-.5, y); } }, col, .7, .45); };
// 발 위치: 정면은 좌우 두 발, 옆모습은 앞뒤로 엇갈리는 두 발 (뒤쪽 발은 조금 어둡게)
const feet = g => g.side ? [{x:-.3-g.step*2.2-.8, lift:0, back:true}, {x:-.3+g.step*2.2+.8, lift:0}] : [{x:-3.3, lift:g.a}, {x:3.3, lift:g.b}];
const shade = (col, f) => f.back ? mixHex(col, '#2a1a24', .14) : col;
const legs = (d, g, col) => { for (const f of feet(g)) d.rr(f.x-2.05, -8.5-f.lift, 4.1, 8.5, 1.6, shade(col, f)); };
// 신발: 다리 끝을 감싸는 작은 신발 (다리보다 살짝 넓게, 옆모습은 앞코가 앞으로)
const shoe = (d, g, col, o={}) => { for (const f of feet(g)) d.ell(f.x+(g.side?1.1:0), -1.6-f.lift, g.side?3.7:3.1, 2.2, shade(col, f), o); };
const shaft = (d, g, col, h, o={}) => { for (const f of feet(g)) d.rr(f.x-2.4, -1.6-f.lift-h, 4.8, h+.6, 1.6, shade(col, f), o); };
const band = (d, g, col, y, w=1.3, o={flat:true, noShadow:true}) => { for (const f of feet(g)) d.rr(f.x-2.5+(g.side?.6:0), y-f.lift, 5, w, w/2, shade(col, f), o); };
const dress = (d, g, col, trim) => { torso(d, g, col); skirt(d, g, col, 1.3, .5); if (trim && !g.up) d.rr(-g.bw*.42, BY+BH*.5, g.bw*.84, 1.6, .8, trim, {flat:true, noShadow:true}); };

const heart = (d, x, y, r, col, o={flat:true, noShadow:true}) => { d.circle(x-r*.5, y, r*.58, col, o); d.circle(x+r*.5, y, r*.58, col, o); d.shape(c=>{ c.beginPath(); c.moveTo(x-r*1.05, y+r*.15); c.lineTo(x, y+r*1.25); c.lineTo(x+r*1.05, y+r*.15); c.closePath(); }, col, [x, y+r*.5, r], o); };
const cloud = (d, x, y, r, col) => { const o = {flat:true, noShadow:true}; d.circle(x-r*.7, y+r*.15, r*.55, col, o); d.circle(x, y-r*.2, r*.7, col, o); d.circle(x+r*.7, y+r*.15, r*.55, col, o); d.rr(x-r*1.2, y, r*2.4, r*.65, r*.32, col, o); };
const ruffle = (d, x0, x1, y, col, r=.9) => { for (let x = x0; x <= x1 + .01; x += r*1.6) d.circle(x, y, r, col, {flat:true, noShadow:true}); };
const animalFace = (d, g, x, y, col, ear, inner, kind) => { // 가슴에 동물 얼굴 (고양이/토끼)
  const o = {noShadow:true}, f = {flat:true, noShadow:true};
  if (kind === 'cat') for (const sx of [-1, 1]) d.shape(c=>{ c.beginPath(); c.moveTo(x+sx*3.6, y-1.6); c.lineTo(x+sx*3.4, y-5.4); c.lineTo(x+sx*1.2, y-3.2); c.closePath(); }, ear, [x+sx*2.6, y-3.4, 2.4], o);
  else for (const sx of [-1, 1]){ d.ell(x+sx*1.7, y-5.4, 1.3, 3.2, ear, o); d.ell(x+sx*1.7, y-5.2, .6, 2.2, inner, f); }
  d.circle(x, y, 3.9, col, o); d.dot(x-1.5, y-.5, .6, '#3a2430'); d.dot(x+1.5, y-.5, .6, '#3a2430'); d.dot(x, y+.9, .5, '#e9849f'); d.dot(x-2.6, y+1, .75, '#ff9fb8', .7); d.dot(x+2.6, y+1, .75, '#ff9fb8', .7);
};
const petal = (d, x, y, r, col, mid='#ffe98a') => { for (let i=0;i<5;i++){ const a = i*1.2566 - 1.5708; d.dot(x + Math.cos(a)*r, y + Math.sin(a)*r, r*.72, col); } d.dot(x, y, r*.55, mid); };
const hoodBack = (d, col) => d.ell(0, HY-1, R*1.32, R*1.22, col);
const handPos = g => (g.side ? [[g.bw/2+1.6, BY+BH*.48]] : [[-g.bw/2-1.6, BY+BH*.48], [g.bw/2+1.6, BY+BH*.48]]);
const mitts = (d, g, col) => { if (g.pray) return; for (const [x, y] of handPos(g)) d.ell(x, y, 3.3, 3.8, col); };
const capeSides = (d, g, col) => { if (g.side){ d.rr(-g.bw/2-2.4, BY-.4, 4, BH*.78, 2, col); return; } d.rr(-g.bw/2-2.6, BY-.4, 3.6, BH*.78, 1.8, col); d.rr(g.bw/2-1, BY-.4, 3.6, BH*.78, 1.8, col); };
const ff = {flat:true, noShadow:true};
const robe = (d, g, col, hem=-2.4, flare=.74) => d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2, BY+2); c.quadraticCurveTo(-g.bw/2, BY, -g.bw/2+2.4, BY); c.lineTo(g.bw/2-2.4, BY); c.quadraticCurveTo(g.bw/2, BY, g.bw/2, BY+2); c.lineTo(g.bw*flare, hem); c.quadraticCurveTo(0, hem+1.2, -g.bw*flare, hem); c.closePath(); }, col, [0, (BY+hem)/2, BH*.6]);
const bigSleeves = (d, g, col, cuff) => { if (g.pray){ praySleeves(d, g, col); return prayHands(d, g); } for (const sx of (g.side ? [1] : [-1, 1])){ d.ell(sx*(g.bw/2+2), BY+BH*.4, 3.9, 5.8, col); if (cuff) d.ell(sx*(g.bw/2+2), BY+BH*.4+4.6, 3.4, 1.2, cuff, {flat:true, noShadow:true}); } hands(d, g); };
const capSleeve = (d, g, col) => { bareArms(d, g); if (g.pray) return; for (const sx of (g.side ? [1] : [-1, 1])) d.ell(sx*(g.bw/2+1.2), BY+BH*.2, 3.2, 3, col); };
const mandarin = (d, col, edge) => { d.rr(-3.4, BY-2.2, 6.8, 2.8, 1.2, col); if (edge) d.rr(-3.4, BY-2.4, 6.8, .7, .35, edge, {flat:true, noShadow:true}); };
// ===== 단체 후드티 12 벌: 폭닥한 플리스 + 후드에 동물 · 가슴에 이름 =====
const lighten = (h, a) => mixHex(h, '#ffffff', a), darken = (h, a) => mixHex(h, '#3a2430', a);
const fluffRow = (d, x0, x1, y, r, col) => { for (let x = x0; x <= x1 + .01; x += r*1.5) d.circle(x, y, r, col, {noShadow:true}); };
const topEyes = (d, g, y = HY-R*1.2, gap = R*.42, r = 1.15) => { if (g.up) return; for (const sx of (g.side ? [.5] : [-1, 1])) d.dot(sx*gap + (g.side ? R*.2 : 0), y, r, '#2b2228'); };
const eyes2 = (d, g, cy, gap = R*.5, r = 1.15) => { for (const sx of (g.side ? [.55] : [-1, 1])) d.dot(sx*gap + (g.side ? R*.12 : 0), cy, r, '#2b2228'); };
const ANI = { // back: 후드 뒤·위로 솟는 것 (귀 · 지느러미 · 볏) / face: 앞자락 위 무늬 (눈은 없어요)
  turtle:{ back:(d,g,c)=>{ const sh = darken(c,.28); d.ell(0, HY-R*1.38, R*1.0, R*.46, sh); d.line(k=>{ for (const sx of [-1, 1]){ k.moveTo(sx*R*.34,HY-R*1.62); k.lineTo(sx*R*.5,HY-R*1.38); k.lineTo(sx*R*.34,HY-R*1.14); k.moveTo(sx*R*.5,HY-R*1.38); k.lineTo(sx*R*.92,HY-R*1.38); } k.moveTo(-R*.34,HY-R*1.62); k.lineTo(R*.34,HY-R*1.62); k.moveTo(-R*.34,HY-R*1.14); k.lineTo(R*.34,HY-R*1.14); }, lighten(sh,.45), .6); }, face:(d,g,c,cy)=>{ for (const [x, y] of [[-R*.7,cy+.5],[R*.68,cy+.3],[0,cy-1.2]]) d.circle(x, y, 1.3, darken(c,.18), ff); } },
  goldfish:{ back:(d,g,c)=>{ const f = lighten(c,.35), f2 = darken(c,.08); for (const sx of (g.side?[-1]:[-1,1])){ d.shape(k=>{ k.beginPath(); k.moveTo(sx*R*1.1,HY-R*.55); k.quadraticCurveTo(sx*R*2.15,HY-R*1.25,sx*R*2.0,HY+R*.05); k.quadraticCurveTo(sx*R*1.6,HY-R*.2,sx*R*1.1,HY-R*.0); k.closePath(); }, f, [sx*R*1.6,HY-R*.5,5]); d.line(k=>{ for (const t of [.3,.55,.8]){ k.moveTo(sx*R*1.15,HY-R*.3); k.lineTo(sx*R*(1.15+.85*t),HY-R*(.95-.9*t)); } }, f2, .45); } d.shape(k=>{ k.beginPath(); k.moveTo(-R*.55,HY-R*1.24); k.quadraticCurveTo(-R*.1,HY-R*2.25,R*.6,HY-R*1.2); k.closePath(); }, f, [0,HY-R*1.6,5]); }, face:(d,g,c,cy)=>{ for (let i = 0; i < 5; i++) d.shape(k=>{ const x = -R*.6 + i*R*.3; k.beginPath(); k.arc(x, cy-.6, 1.5, 0, Math.PI); }, lighten(c,.3), [0,cy,2], {noShadow:true}); } },
  puppy:{ back:(d,g,c)=>{ const e = darken(c,.34); for (const sx of (g.side?[-1]:[-1,1])) d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*1.24, HY-R*.4, R*.4, R*.8, sx*.32, 0, 7); }, e, [sx*R*1.2,HY-R*.4,6]); }, face:(d,g,c,cy)=>{ if (!g.side) d.ell(R*.55, cy-.4, R*.38, 2.4, darken(c,.25), ff); } },
  hedgehog:{ back:(d,g,c)=>{ const sp = darken(c,.45); for (let i = 0; i < 11; i++){ const a = Math.PI*(1.0 + i*.1), cx = Math.cos(a), cy = Math.sin(a), x = cx*R*1.3, y = HY-1+cy*R*1.24; d.shape(k=>{ k.beginPath(); k.moveTo(x-cy*2.4,y+cx*2.4); k.lineTo(x+cx*5,y+cy*5); k.lineTo(x+cy*2.4,y-cx*2.4); k.closePath(); }, sp, [x,y,2]); } }, face:(d,g,c,cy)=>{ for (let i = 0; i < 6; i++) d.shape(k=>{ const x = -R*.75 + i*R*.3; k.beginPath(); k.moveTo(x-1.1, cy+.6); k.lineTo(x, cy-1.6); k.lineTo(x+1.1, cy+.6); k.closePath(); }, darken(c,.35), [0,cy,2], ff); } },
  ferret:{ back:(d,g,c)=>{ for (const sx of (g.side?[-.2]:[-1,1])){ d.circle(sx*R*.88, HY-R*1.2, 3.4, '#9c7a62'); d.circle(sx*R*.88, HY-R*1.2, 1.9, '#f6c3cf', ff); } d.ell(0, HY-R*1.3, R*.5, R*.3, '#c9ad96'); }, face:(d,g,c,cy)=>{ if (!g.side) d.shape(k=>{ k.beginPath(); k.ellipse(0, cy-.4, R*.8, 2.2, 0, 0, 7); }, '#c9ad96', [0,cy,4], ff); } },
  guinea:{ back:(d,g,c)=>{ const e = darken(c,.38); for (const sx of (g.side?[-.2]:[-1,1])) d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*1.04, HY-R*1.02, 3.4, 2.3, sx*-.5, 0, 7); }, e, [sx*R,HY-R,3]); d.ell(-R*.42, HY-R*1.32, R*.5, R*.3, '#fff6ea'); }, face:(d,g,c,cy)=>{ if (!g.side){ d.ell(R*.45, cy-.6, R*.42, 2.4, '#fff6ea', ff); d.ell(-R*.5, cy, R*.3, 1.8, darken(c,.3), ff); } } },
  lizard:{ back:(d,g,c)=>{ const k2 = darken(c,.3); for (let i = 0; i < 7; i++){ const a = Math.PI*(1.2 + i*.1), cx = Math.cos(a), cy = Math.sin(a), x = cx*R*1.3, y = HY-1+cy*R*1.24; d.shape(k=>{ k.beginPath(); k.moveTo(x-cy*2,y+cx*2); k.quadraticCurveTo(x+cx*4.2-cy*.8,y+cy*4.2+cx*.8,x+cy*2,y-cx*2); k.closePath(); }, k2, [x,y,2]); } }, face:(d,g,c,cy)=>{ for (const [x, y, r] of [[-R*.8,cy+.4,1.3],[-R*.35,cy-1.2,.9],[R*.15,cy+.2,1.2],[R*.6,cy-1,1],[R*.9,cy+.8,.8]]) d.circle(x, y, r, darken(c,.25), ff); } },
  cat:{ back:(d,g,c)=>{ for (const sx of (g.side?[-.3]:[-1,1])){ d.shape(k=>{ k.beginPath(); k.moveTo(sx*R*.38,HY-R*1.14); k.lineTo(sx*R*.92,HY-R*1.92); k.lineTo(sx*R*1.14,HY-R*.9); k.closePath(); }, c, [sx*R*.75,HY-R*1.3,5]); d.shape(k=>{ k.beginPath(); k.moveTo(sx*R*.58,HY-R*1.2); k.lineTo(sx*R*.9,HY-R*1.7); k.lineTo(sx*R*.98,HY-R*1.08); k.closePath(); }, '#f6b8c8', [sx*R*.78,HY-R*1.3,1.5], ff); } }, face:(d,g,c,cy)=>{ d.line(k=>{ for (const x of [-R*.25, 0, R*.25]){ k.moveTo(x, cy-2.2); k.lineTo(x, cy+.4); } }, darken(c,.28), .9); } },
  hamster:{ back:(d,g,c)=>{ for (const sx of (g.side?[-.2]:[-1,1])){ d.circle(sx*R*.82, HY-R*1.22, 3.3, c); d.circle(sx*R*.82, HY-R*1.22, 1.9, '#f6b8c8', ff); } }, face:(d,g,c,cy)=>{ if (!g.side){ d.ell(0, cy-.4, R*.36, 2.1, '#fff6ea', ff); for (const sx of [-1,1]) d.ell(sx*R*.9, cy+1, 1.8, 1.1, '#ffb3c4', ff); } } },
  parrot:{ back:(d,g,c)=>{ ['#ff7a7a','#ffd14f','#6fcf7f'].forEach((cc, i) => d.shape(k=>{ const x = (i-1)*3; k.beginPath(); k.moveTo(x-1.8, HY-R*1.25); k.quadraticCurveTo(x-2.6+i*1.2, HY-R*2.15, x+1.5, HY-R*1.95); k.quadraticCurveTo(x+.8, HY-R*1.5, x+1.8, HY-R*1.25); k.closePath(); }, cc, [(i-1)*3,HY-R*1.6,4])); }, face:(d,g,c,cy)=>{ const bx = g.side ? R*.85 : 0; d.shape(k=>{ k.beginPath(); k.moveTo(bx-2.2,cy-.6); k.quadraticCurveTo(bx+(g.side?3:0),cy-1.2,bx+2.2,cy-.6); k.quadraticCurveTo(bx+(g.side?2:0),cy+3.6,bx-2.2,cy-.6); k.closePath(); }, '#ffb347', [bx,cy,3]); } },
  bunny:{ back:(d,g,c)=>{ for (const sx of (g.side?[-.3,.2]:[-1,1])){ d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*.5, HY-R*1.85, 3.2, 7.2, sx*.18, 0, 7); }, c, [sx*R*.5,HY-R*1.85,7]); d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*.5, HY-R*1.82, 1.5, 5, sx*.18, 0, 7); }, '#ff9fbb', [sx*R*.5,HY-R*1.82,5], ff); } }, face:(d,g,c,cy)=>{} },
  robot:{ back:(d,g,c)=>{ d.line(k=>{ k.moveTo(0, HY-R*1.28); k.lineTo(0, HY-R*1.75); }, '#9aa3b4', 1.6); d.circle(0, HY-R*1.82, 2.6, '#ffb627'); d.dot(-.7, HY-R*1.88, .7, '#fff', .8); for (const sx of (g.side?[-1]:[-1,1])){ d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*1.3, HY-R*.35, R*.3, R*.42, sx*.2, 0, 7); }, '#ffb627', [sx*R*1.3,HY-R*.35,5]); d.circle(sx*R*1.3, HY-R*.35, 1.6, '#e9a21c', ff); } }, face:(d,g,c,cy)=>{ if (g.side) return; d.rr(-R*.62, cy-2.4, R*1.24, 4.6, 2.3, '#2b2b36', ff); for (const sx of [-1, 1]) d.dot(sx*R*.75, cy+.2, .9, '#9aa3b4'); } },
  chick:{ back:(d,g,c)=>{ d.shape(k=>{ k.beginPath(); k.moveTo(-1.4,HY-R*1.26); k.quadraticCurveTo(-3.4,HY-R*2.0,0,HY-R*1.78); k.quadraticCurveTo(3.2,HY-R*2.1,1.6,HY-R*1.26); k.closePath(); }, darken(c,.06), [0,HY-R*1.6,4]); for (const sx of (g.side?[-1]:[-1,1])) d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*1.25, HY-R*.2, 2.2, 4, sx*-.6, 0, 7); }, darken(c,.05), [sx*R*1.25,HY-R*.2,4]); }, face:(d,g,c,cy)=>{ const bx = g.side ? R*.85 : 0; d.shape(k=>{ k.beginPath(); k.moveTo(bx-2,cy-.4); k.lineTo(bx+2,cy-.4); k.lineTo(bx+(g.side?2.4:0),cy+2); k.closePath(); }, '#ff9a3c', [bx,cy+.6,2]); } },
};
const groupHood = (name, col, ani) => ({ main:col,
  draw:(d, g) => { const lt = lighten(col, .45), dk = darken(col, .14), ctx = d.ctx;
    d.ell(0, HY-1, R*1.34, R*1.26, col); // 후드 뒤
    torso(d, g, col);
    if (g.up){ d.ell(0, BY+2.2, 7.6, 4.6, dk); fluffRow(d, -g.bw/2+1, g.bw/2-1, BY+BH*.62, 1.5, lt); }
    else {
      fluffRow(d, -g.bw/2+1.2, g.bw/2-1.2, BY+BH*.62, 1.5, lt); // 밑단 뽀글이
      if (!g.side){ d.line(k=>{ k.moveTo(-2.4, BY+.8); k.lineTo(-2.8, BY+3.4); k.moveTo(2.4, BY+.8); k.lineTo(2.8, BY+3.4); }, lt, .7);
        if (ctx && ctx.fillText){ ctx.save(); ctx.font = '700 7.4px "HoodHand", "Dongle", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 1.1; ctx.strokeStyle = '#fffaf2'; ctx.strokeText(name, 0, BY+BH*.31); ctx.fillStyle = darken(col, .62); ctx.fillText(name, 0, BY+BH*.31); ctx.restore(); } } // 가슴에 크게 손글씨 이름
      else d.rr(g.bw*.05, BY+BH*.38, g.bw*.4, 4.6, 2, dk, {flat:true});
    }
    for (let i = 0; i < 6; i++) d.dot(-g.bw/2+2 + (i*37%10)*1.2, BY+2 + (i*53%9)*1.1, .35, lt, .7); // 플리스 결
    sleeves(d, g, col); for (const [hx, hy] of handPos(g)) d.circle(hx, hy-2.6, 1.6, lt, {noShadow:true}); hands(d, g); },
  // 머리카락 위: 동물 얼굴 후드 (귀·볏은 뒤에서, 앞자락과 얼굴은 위에서)
  over:(d, g) => { const lt = lighten(col, .45), cy = HY-1.5, ox = g.side ? R*.12 : 0, A = ANI[ani];
    A.back(d, g, col);
    if (g.up){ d.ell(0, cy, R*1.32, R*1.24, col); return; }
    d.shape(c=>{ c.beginPath(); c.ellipse(ox, cy, R*1.32, R*1.24, 0, Math.PI*1.03, Math.PI*1.97); c.ellipse(ox, cy+R*.14, R*1.04, R*.8, 0, Math.PI*1.92, Math.PI*1.08, true); c.closePath(); }, col, [ox,cy-R*.5,R*1.35]);
    const fl = lighten(col, .22); for (let i = 0; i <= 16; i++){ const a = Math.PI*(1.1 + i*.05); d.circle(ox+Math.cos(a)*R*1.04, cy+R*.14+Math.sin(a)*R*.8, 1.35, fl, {noShadow:true}); } // 폭닥한 앞자락 테두리 (털처럼 촘촘히)
    A.face(d, g, col, cy - R*1.0); } });
export const TOPS = {
  t01:{name:'기본 티셔츠', price:0,   draw:(d,g)=>{ torso(d,g,'#fffaf2'); bareArms(d,g); }},
  t02:{name:'줄무늬 티',   price:0,   draw:(d,g)=>{ torso(d,g,'#fffaf2'); stripe(d,g,'#8fb9e8',3); bareArms(d,g); }},
  t03:{name:'니트 스웨터', price:72000, draw:(d,g)=>{ torso(d,g,'#bfe6d5'); if(!g.up) d.line(k=>{ for (let i=0;i<3;i++){ k.moveTo(-5+i*5, BY+3); k.lineTo(-5+i*5, BY+9); } }, '#93c9b3', 1.2, .7); sleeves(d,g,'#bfe6d5'); hands(d,g); }},
  t04:{name:'후드티',      price:67000, draw:(d,g)=>{ torso(d,g,'#a9c7ef'); if(!g.up) d.ell(0, BY+1, 6.5, 3.2, '#8fb3e2'); else d.ell(0, BY+1.5, 7, 4, '#8fb3e2'); if(!g.up) d.line(k=>{ k.moveTo(-2.5, BY+3); k.lineTo(-3, BY+8); k.moveTo(2.5, BY+3); k.lineTo(3, BY+8); }, '#fffaf2', 1, .9); sleeves(d,g,'#a9c7ef'); hands(d,g); }},
  t05:{name:'칼라 셔츠',   price:56000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); collar(d,g,'#e9eef7'); if(!g.up) d.line(k=>{ k.moveTo(0, BY+4); k.lineTo(0, BY+BH*.6); }, '#cfd6e3', 1, .9); if(!g.up){ d.dot(0, BY+6, .6, '#cfd6e3'); d.dot(0, BY+8.5, .6, '#cfd6e3'); } sleeves(d,g,'#fffaf2'); hands(d,g); }},
  t06:{name:'카디건',      price:78000, draw:(d,g)=>{ torso(d,g,'#f3e39a'); front(d,g,'#fffaf2'); if(!g.up) d.line(k=>{ k.moveTo(-BW*.16, BY+1.5); k.lineTo(-BW*.16, BY+BH*.55); k.moveTo(BW*.16, BY+1.5); k.lineTo(BW*.16, BY+BH*.55); }, '#cdb866', .8, .5); sleeves(d,g,'#f3e39a'); hands(d,g); }},
  t07:{name:'리본 블라우스', price:84000, draw:(d,g)=>{ torso(d,g,'#fff0f5'); if(!g.up){ d.ell(-2.2, BY+3, 2.2, 1.5, '#f29ab8', {flat:true}); d.ell(2.2, BY+3, 2.2, 1.5, '#f29ab8', {flat:true}); d.dot(0, BY+3, 1, '#e98aa9'); } sleeves(d,g,'#fff0f5'); hands(d,g); }},
  t08:{name:'하트 맨투맨', price:62000, draw:(d,g)=>{ torso(d,g,'#f6c6d3'); if(!g.up){ d.circle(-1.6, BY+5.2, 1.6, '#e85d7a', {flat:true, noShadow:true}); d.circle(1.6, BY+5.2, 1.6, '#e85d7a', {flat:true, noShadow:true}); d.shape(c=>{ c.beginPath(); c.moveTo(-3.1, BY+5.6); c.lineTo(0, BY+9); c.lineTo(3.1, BY+5.6); c.closePath(); }, '#e85d7a', [0,BY+7,3], {flat:true, noShadow:true}); } sleeves(d,g,'#f6c6d3'); hands(d,g); }},
  t09:{name:'오버핏 재킷', price:100000, draw:(d,g)=>{ d.rr(-g.bw/2-1.5, BY-.5, g.bw+3, BH*.66, 5, '#9aa6d6'); front(d,g,'#fffaf2'); collar(d,g,'#8591c4'); d.ell(-g.bw/2-1.8, BY+BH*.38, 3.3, 5.6, '#9aa6d6'); d.ell(g.bw/2+1.8, BY+BH*.38, 3.3, 5.6, '#9aa6d6'); hands(d,g); }},
  t10:{name:'꽃무늬 티',   price:52000, draw:(d,g)=>{ torso(d,g,'#e6f2d9'); if(!g.up) for (const [fx,fy,col] of [[-4,BY+4,'#ffb3c6'],[3,BY+7,'#ffe08a'],[-1,BY+9.5,'#ffb3c6'],[5,BY+3,'#fff']]){ d.dot(fx,fy,1.3,col); d.dot(fx,fy,.5,'#fff3a0'); } bareArms(d,g); }},
  t11:{name:'검정 티셔츠', price:0,   draw:(d,g)=>{ torso(d,g,'#4a4550'); bareArms(d,g); }},
  t12:{name:'민트 반팔 티', price:0,  draw:(d,g)=>{ torso(d,g,'#bfe8dc'); if(!g.up&&!g.side) d.rr(2,BY+3.2,3.4,3,1,'#a6d8c9',{flat:true}); bareArms(d,g); }},
  t13:{name:'회색 맨투맨', price:0,   draw:(d,g)=>{ torso(d,g,'#c9c6cf'); d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,'#b5b1bc',{flat:true, noShadow:true}); longArms(d,g,'#c9c6cf'); }},
  t14:{name:'체크 셔츠',   price:51000, draw:(d,g)=>{ torso(d,g,'#e9a0a0'); checks(d,g,'#fff3f3',BY+1,BY+12.8,3); collar(d,g,'#e08a8a'); longArms(d,g,'#e9a0a0'); }},
  t15:{name:'데님 재킷',   price:95000, draw:(d,g)=>{ torso(d,g,'#7f9cc9'); front(d,g,'#fffaf2'); collar(d,g,'#6d89b5'); if(!g.up) d.line(k=>{ k.moveTo(-g.bw/2+1.5,BY+5); k.lineTo(-2.6,BY+5); k.moveTo(2.6,BY+5); k.lineTo(g.bw/2-1.5,BY+5); }, '#f0c27a', .6, .8); longArms(d,g,'#7f9cc9'); }},
  t16:{name:'크롭 티',     price:46000, draw:(d,g)=>{ d.rr(-g.bw/2, BY, g.bw, BH*.5, 4.5, '#ffd1dc'); bareArms(d,g); }},
  t17:{name:'폴로 티',     price:55000, draw:(d,g)=>{ torso(d,g,'#9fd0f0'); collar(d,g,'#fffaf2'); if(!g.up){ d.dot(0,BY+4.6,.55,'#fffaf2'); d.dot(0,BY+6.4,.55,'#fffaf2'); } bareArms(d,g); }},
  t18:{name:'야구 점퍼',   price:108000, draw:(d,g)=>{ torso(d,g,'#3f4f7a'); d.rr(-g.bw/2+.4,BY+BH*.56,g.bw-.8,1.8,.9,'#e85d7a',{flat:true, noShadow:true}); if(!g.up&&!g.side){ d.circle(-3.6,BY+5,1.8,'#fffaf2',{flat:true}); d.dot(-3.6,BY+5,.8,'#e85d7a'); } longArms(d,g,'#fffaf2'); }},
  t19:{name:'패딩 점퍼',   price:124000, draw:(d,g)=>{ d.rr(-g.bw/2-1, BY-.6, g.bw+2, BH*.68, 5.5, '#f2b880'); d.line(k=>{ for (let i=1;i<4;i++){ k.moveTo(-g.bw/2, BY+i*3.4); k.lineTo(g.bw/2, BY+i*3.4); } }, '#d99a62', .8, .7); if (!g.side) d.ell(-g.bw/2-2, BY+BH*.36, 3.8, 5, '#f2b880'); d.ell(g.bw/2+2, BY+BH*.36, 3.8, 5, '#f2b880'); hands(d,g); }},
  t20:{name:'터틀넥',      price:65000, draw:(d,g)=>{ torso(d,g,'#e7d8c4'); d.rr(-4.2,BY-2.4,8.4,3.6,1.6,'#e7d8c4'); longArms(d,g,'#e7d8c4'); }},
  t21:{name:'꽈배기 니트', price:80000, draw:(d,g)=>{ torso(d,g,'#f3efe4'); if(!g.up) d.line(k=>{ for (const cx of [-3.6,0,3.6]){ k.moveTo(cx,BY+1.5); for (let y=BY+1.5; y<BY+12.5; y+=2.2){ k.quadraticCurveTo(cx+1.2,y+1.1,cx,y+2.2); } } }, '#d9d2c1', .8, .9); longArms(d,g,'#f3efe4'); }},
  t22:{name:'별무늬 티',   price:48000, draw:(d,g)=>{ torso(d,g,'#fff6c8'); dots(d,g,'#f3c63f',[[-4,3],[3,5],[-1,8],[4.5,10],[-5,10.5]],.9); bareArms(d,g); }},
  t23:{name:'하와이안 셔츠', price:71000, draw:(d,g)=>{ torso(d,g,'#7ccfc0'); dots(d,g,'#fffaf2',[[-4.5,4],[2,3.5],[4.5,8.5],[-2,9.5]],1.2); dots(d,g,'#ff9fb0',[[-4.5,4],[2,3.5],[4.5,8.5],[-2,9.5]],.5); collar(d,g,'#6abba9'); bareArms(d,g); }},
  t24:{name:'레이스 블라우스', price:87000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); if(!g.up){ for (let i=-3;i<=3;i++) d.dot(i*2, BY+BH*.62, .9, '#fffaf2'); d.line(k=>{ for (let i=-3;i<=3;i++){ k.moveTo(i*2+.7, BY+BH*.62); k.arc(i*2, BY+BH*.62, .7, 0, 3.2); } }, '#e8dcd2', .4, .9); collar(d,g,'#f3e9e1'); } longArms(d,g,'#fffaf2'); }},
  t25:{name:'퍼프 블라우스', price:82000, draw:(d,g)=>{ torso(d,g,'#f9e0ea'); if (!g.side) d.ell(-g.bw/2-1.4, BY+BH*.2, 3.9, 3.6, '#f9e0ea'); d.ell(g.bw/2+1.4, BY+BH*.2, 3.9, 3.6, '#f9e0ea'); hands(d,g); }},
  t26:{name:'곰돌이 후드', price:98000, draw:(d,g)=>{ torso(d,g,'#c9a07a');
    if (g.up){ // 뒤: 모자에 동그란 곰 귀
      d.ell(0, BY+1.5, 7.5, 4.4, '#b48a64'); for (const sx of [-1, 1]){ d.circle(sx*5.2, BY-1.6, 2.4, '#b48a64'); d.circle(sx*5.2, BY-1.6, 1.2, '#f1c6b4', {flat:true, noShadow:true}); } d.circle(0, BY+10.2, 2.6, '#9a7250', {noShadow:true}); d.dot(-.8, BY+9.4, .8, '#ffffff', .35); }
    else { // 앞·옆: 모자 + 가슴에 곰돌이 얼굴
      d.ell(0, BY+1, 6.5, 3.2, '#b48a64');
      const fx = g.side ? 2.4 : 0, fy = BY+7.6, ex = g.side ? [1] : [-1, 1];
      for (const sx of ex) { d.circle(fx + sx*3.3, fy-3.1, 1.9, '#9a7250', {noShadow:true}); d.circle(fx + sx*3.3, fy-3.1, .95, '#f1c6b4', {flat:true, noShadow:true}); }
      d.circle(fx, fy, 4.1, '#9a7250', {noShadow:true});
      d.ell(fx + (g.side ? 1 : 0), fy+1.3, 2.2, 1.6, '#f3e2cc', {flat:true, noShadow:true});
      d.dot(fx + (g.side ? 1.2 : 0), fy+.8, .75, '#3a2430');
      if (g.side) d.dot(fx + .6, fy-1.1, .62, '#3a2430'); else { d.dot(fx-1.6, fy-1, .62, '#3a2430'); d.dot(fx+1.6, fy-1, .62, '#3a2430'); d.dot(fx-2.6, fy+.6, .8, '#ff9fb8', .75); d.dot(fx+2.6, fy+.6, .8, '#ff9fb8', .75); }
    }
    longArms(d,g,'#c9a07a'); }},
  t27:{name:'트위드 재킷', price:118000, draw:(d,g)=>{ torso(d,g,'#e9c9cf'); if(!g.up){ d.line(k=>{ k.moveTo(-2.4,BY+1); k.lineTo(-2.4,BY+BH*.62); k.moveTo(2.4,BY+1); k.lineTo(2.4,BY+BH*.62); }, '#fffaf2', 1, .9); for (const y of [5,8.5]){ d.dot(-3.6,BY+y,.6,'#e0b84a'); d.dot(3.6,BY+y,.6,'#e0b84a'); } } longArms(d,g,'#e9c9cf'); }},
  t28:{name:'니트 조끼',   price:71000, main:'#c9b28a', draw:(d,g)=>{ torso(d,g,'#fffaf2'); collar(d,g,'#f0ece4'); if(!g.up) d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2+.6,BY+1.4); c.lineTo(-2.2,BY+1.4); c.lineTo(0,BY+6); c.lineTo(2.2,BY+1.4); c.lineTo(g.bw/2-.6,BY+1.4); c.lineTo(g.bw/2-.6,BY+BH*.6); c.lineTo(-g.bw/2+.6,BY+BH*.6); c.closePath(); }, '#c9b28a', [0,BY+7,7]); else d.rr(-g.bw/2+.6,BY+1,g.bw-1.2,BH*.56,3,'#c9b28a'); longArms(d,g,'#fffaf2'); }},
  t29:{name:'무지개 니트', price:91000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); ['#f6a6a6','#f7cf8f','#f3ec9a','#b5e3b0','#a9c7ef'].forEach((col,i)=>d.rr(-g.bw/2+.3, BY+1.2+i*2.3, g.bw-.6, 2.1, .6, col, {flat:true, noShadow:true})); longArms(d,g,'#fffaf2'); }},
  t30:{name:'딸기 맨투맨', price:65000, draw:(d,g)=>{ torso(d,g,'#ffd6dc'); if(!g.up){ d.ell(0,BY+7,2.6,3,'#e8505f',{flat:true}); d.ell(0,BY+4.4,2,1,'#6fbf73',{flat:true, noShadow:true}); dots(d,g,'#ffe9a8',[[-1,6.5],[1,7.6],[0,9]],.3); } longArms(d,g,'#ffd6dc'); }},
  t31:{excl:1, name:'고양이 니트', price:86000, draw:(d,g)=>{ torso(d,g,'#d9d4e2'); if(!g.up&&!g.side) animalFace(d,g,0,BY+7.4,'#fffaf2','#fffaf2','#f6c6d3','cat'); else if(g.up) d.ell(0,BY+12.6,1.2,1.2,'#c3bdd0'); d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,'#c3bdd0',{flat:true, noShadow:true}); longArms(d,g,'#d9d4e2'); }},
  t32:{excl:1, name:'체리 카디건', price:79000, draw:(d,g)=>{ torso(d,g,'#ffc9d6'); front(d,g,'#fffaf2'); if(!g.up){ for (const y of [4,7.5,11]){ d.dot(-BW*.16-.2,BY+y,.95,'#e8505f'); d.dot(-BW*.16+.2,BY+y-.3,.3,'#fff',.8); } if(!g.side){ d.dot(-5,BY+9.6,1,'#e8505f'); d.dot(-3.6,BY+10,1,'#e8505f'); d.line(k=>{ k.moveTo(-5,BY+8.8); k.quadraticCurveTo(-4.4,BY+6.6,-3.4,BY+6.4); k.lineTo(-3.6,BY+9.2); }, '#6fbf73', .45); } } sleeves(d,g,'#ffc9d6'); hands(d,g); }},
  t33:{excl:1, name:'세일러 블라우스', price:76000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-6,BY); c.lineTo(0,BY+5.5); c.lineTo(6,BY); c.lineTo(5,BY+2.4); c.lineTo(0,BY+7.6); c.lineTo(-5,BY+2.4); c.closePath(); }, '#8fb9e8', [0,BY+3,5], {flat:true}); d.ell(-1.5,BY+7.4,1.6,1.1,'#ff8fb0',{flat:true}); d.ell(1.5,BY+7.4,1.6,1.1,'#ff8fb0',{flat:true}); d.dot(0,BY+7.4,.8,'#f2759b'); } else d.rr(-6,BY,12,5,1.5,'#8fb9e8',{flat:true}); sleeves(d,g,'#fffaf2'); if(!g.side) for (const sx of [-1,1]) d.rr(sx*(g.bw/2+1.4)-2.6,BY+BH*.44,5.2,1,.5,'#8fb9e8',{flat:true, noShadow:true}); hands(d,g); }},
  t34:{excl:1, name:'구름 후드', price:92000, draw:(d,g)=>{ torso(d,g,'#b9dcf7'); if(!g.up){ d.ell(0,BY+1,6.5,3.2,'#a3cdf0'); if(!g.side) cloud(d,0,BY+8,3.4,'#fffaf2'); else cloud(d,1.6,BY+8,2.8,'#fffaf2'); } else { d.ell(0,BY+1.5,7,4,'#a3cdf0'); cloud(d,0,BY+9,3,'#fffaf2'); } longArms(d,g,'#b9dcf7'); }},
  t35:{excl:1, name:'토끼 맨투맨', price:68000, draw:(d,g)=>{ torso(d,g,'#d9c8f5'); if(!g.up&&!g.side) animalFace(d,g,0,BY+8.2,'#fffaf2','#fffaf2','#ffc4d6','bunny'); else if(g.up) d.circle(0,BY+11.4,1.6,'#fffaf2'); longArms(d,g,'#d9c8f5'); }},
  t36:{excl:1, name:'하트 니트 조끼', price:74000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); collar(d,g,'#f0ece4'); const v='#ffb3c6'; if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2+.6,BY+1.4); c.lineTo(-2.2,BY+1.4); c.lineTo(0,BY+6); c.lineTo(2.2,BY+1.4); c.lineTo(g.bw/2-.6,BY+1.4); c.lineTo(g.bw/2-.6,BY+BH*.6); c.lineTo(-g.bw/2+.6,BY+BH*.6); c.closePath(); }, v, [0,BY+7,7]); if(!g.side) for (const [hx,hy] of [[-3.6,8.6],[3.6,8.6],[0,10.4]]) heart(d,hx,BY+hy,1,'#ff6f9f'); } else d.rr(-g.bw/2+.6,BY+1,g.bw-1.2,BH*.56,3,v); longArms(d,g,'#fffaf2'); }},
  t37:{excl:1, name:'프레피 니트', price:84000, draw:(d,g)=>{ const v='#3e4a86'; torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2+.4,BY+1); c.lineTo(-2.4,BY+1); c.lineTo(0,BY+6.4); c.lineTo(2.4,BY+1); c.lineTo(g.bw/2-.4,BY+1); c.lineTo(g.bw/2-.4,BY+BH*.62); c.lineTo(-g.bw/2+.4,BY+BH*.62); c.closePath(); }, v, [0,BY+7,7]); d.line(k=>{ k.moveTo(-2.2,BY+1.6); k.lineTo(0,BY+6); k.lineTo(2.2,BY+1.6); }, '#f3d27a', .5, .9); d.rr(-g.bw/2+.6,BY+BH*.56,g.bw-1.2,1,.5,'#f3d27a',ff); } else d.rr(-g.bw/2+.4,BY+.8,g.bw-.8,BH*.6,3,v); longArms(d,g,v); }},
  t38:{excl:1, name:'리본 크롭 가디건', price:78000, draw:(d,g)=>{ const v='#d9c8f5'; torso(d,g,'#fffaf2'); d.rr(-g.bw/2-.3, BY-.3, g.bw+.6, BH*.46, 4, v); if(!g.up){ d.rr(-1.1,BY+.6,2.2,BH*.4,.8,'#fffaf2',ff); for (const y of [3,6]) d.dot(-1.9,BY+y,.55,'#fffaf2'); d.ell(-1.8,BY+1.2,1.8,1.2,'#ff8fb6',ff); d.ell(1.8,BY+1.2,1.8,1.2,'#ff8fb6',ff); d.dot(0,BY+1.2,.75,'#f2759b'); } longArms(d,g,v); }},
  t39:{excl:1, name:'별자수 데님 셔츠', price:76000, draw:(d,g)=>{ const v='#8fa8d6'; torso(d,g,v); collar(d,g,'#7f98c6'); if(!g.up){ d.line(k=>{ k.moveTo(0,BY+4); k.lineTo(0,BY+BH*.6); }, '#7a92c0', .7, .9); for (const [x,y,r] of [[-4,5,1],[3.8,8.6,.8],[-2.6,10.4,.6]]){ d.shape(c=>{ c.beginPath(); for (let i=0;i<10;i++){ const rr = i%2 ? r*.45 : r*1.1, a = -Math.PI/2 + i*Math.PI/5; c.lineTo(x + Math.cos(a)*rr, BY + y + Math.sin(a)*rr); } c.closePath(); }, '#ffe08a', [x,BY+y,r], ff); } } longArms(d,g,v); }},
  t40:{excl:1, name:'가죽 재킷', price:118000, draw:(d,g)=>{ const v='#3a3440'; torso(d,g,'#fffaf2'); if(!g.up){ d.rr(-g.bw/2-.4,BY-.3,g.bw*.42,BH*.66,3,v); d.rr(g.bw/2+.4-g.bw*.42,BY-.3,g.bw*.42,BH*.66,3,v); d.shape(c=>{ c.beginPath(); c.moveTo(-3,BY); c.lineTo(-1.2,BY+5); c.lineTo(-3.6,BY+4.4); c.closePath(); c.moveTo(3,BY); c.lineTo(1.2,BY+5); c.lineTo(3.6,BY+4.4); c.closePath(); }, '#4a4452', [0,BY+3,3], ff); d.line(k=>{ k.moveTo(-g.bw/2+2,BY+4); k.lineTo(-g.bw/2+2,BY+BH*.6); }, '#c9ced8', .5, .9); d.dot(-g.bw/2+2,BY+4,.6,'#c9ced8'); } else d.rr(-g.bw/2-.4,BY-.3,g.bw+.8,BH*.66,4,v); longArms(d,g,v); }},
  t41:{excl:1, name:'마린 줄무늬 티', price:58000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); stripe(d,g,'#3e4a86',4); if(!g.up&&!g.side){ d.line(k=>{ k.moveTo(3.6,BY+5.2); k.lineTo(3.6,BY+9); k.moveTo(2,BY+6.2); k.lineTo(5.2,BY+6.2); k.moveTo(2,BY+8.2); k.quadraticCurveTo(3.6,BY+9.8,5.2,BY+8.2); }, '#e85d6a', .7, .95); } else if (g.up) stripe(d,{...g,up:false},'#3e4a86',4); longArms(d,g,'#fffaf2'); }},
  t42:{excl:1, name:'퍼 코트', price:132000, draw:(d,g)=>{ const v='#f3e6d2'; d.rr(-g.bw/2-1.2, BY-.6, g.bw+2.4, BH*.7, 5, v); for (let i=-3;i<=3;i++) d.circle(i*1.6, BY-.2+Math.abs(i)*.15, 1.5, '#fffaf2', {noShadow:true}); if(!g.up) for (const y of [5,8.5,12]) d.dot(-.2,BY+y,.75,'#a07a5a'); sleeves(d,g,v); if(!g.side){ d.ell(-g.bw/2-1.4,BY+BH*.5,3.2,1.4,'#fffaf2',ff); } d.ell(g.bw/2+1.4,BY+BH*.5,3.2,1.4,'#fffaf2',ff); hands(d,g); }},
  t43:{excl:1, name:'하트 집업 후드', price:88000, draw:(d,g)=>{ const v='#ffb3cd'; torso(d,g,v); if(!g.up){ d.ell(0,BY+1,6.5,3.2,'#ff9fbe'); d.line(k=>{ k.moveTo(0,BY+3); k.lineTo(0,BY+BH*.62); }, '#e87a9c', .8, .95); d.dot(0,BY+4,.6,'#c9ced8'); if(!g.side) heart(d,-3.4,BY+7.4,1.3,'#fffaf2'); } else { d.ell(0,BY+1.5,7,4,'#ff9fbe'); heart(d,0,BY+8,1.8,'#fffaf2'); } d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,'#ff9fbe',ff); longArms(d,g,v); }},
  t44:{excl:1, name:'반짝이 시퀸 탑', price:96000, draw:(d,g)=>{ const v='#f3d27a'; torso(d,g,v); for (let i=0;i<14;i++){ const x = -g.bw/2+1.2 + (i*3.7)%(g.bw-2.4), y = BY+1.4 + ((i*5.3)%11); d.dot(x, y, .55, i%3 ? '#fff8d8' : '#ffffff', .9); } capSleeve(d,g,v); }},
  t45:{excl:1, name:'체크 조끼 셔츠', price:92000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); const v='#8a8f9e'; if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2+.6,BY+1.4); c.lineTo(-2.2,BY+1.4); c.lineTo(0,BY+6.4); c.lineTo(2.2,BY+1.4); c.lineTo(g.bw/2-.6,BY+1.4); c.lineTo(g.bw/2-.6,BY+BH*.62); c.lineTo(-g.bw/2+.6,BY+BH*.62); c.closePath(); }, v, [0,BY+7,7]); checks(d,g,'#b3b7c4',BY+6.6,BY+BH*.6,3); d.rr(-.8,BY+1.4,1.6,4.6,.6,'#c9384f',ff); for (const y of [8,11]) d.dot(0,BY+y,.55,'#3a3440'); } else d.rr(-g.bw/2+.6,BY+1,g.bw-1.2,BH*.6,3,v); longArms(d,g,'#fffaf2'); }},
  t46:{excl:1, name:'꽁 후드티 (거북이)', price:118000, ...groupHood('꽁','#a6dba8','turtle')},
  t47:{excl:1, name:'솔 후드티 (금붕어)', price:118000, ...groupHood('솔','#ffad8f','goldfish')},
  t48:{excl:1, name:'월 후드티 (강아지)', price:118000, ...groupHood('월','#f1dcb8','puppy')},
  t49:{excl:1, name:'걔 후드티 (고슴도치)', price:118000, ...groupHood('걔','#c9ab92','hedgehog')},
  t50:{excl:1, name:'냥 후드티 (페럿)', price:118000, ...groupHood('냥','#f7f3ea','ferret')},
  t51:{excl:1, name:'움 후드티 (기니피그)', price:118000, ...groupHood('움','#e8b77d','guinea')},
  t52:{excl:1, name:'멍 후드티 (도마뱀)', price:118000, ...groupHood('멍','#8fd3c8','lizard')},
  t53:{excl:1, name:'돈 후드티 (고양이)', price:118000, ...groupHood('돈','#cfc3ea','cat')},
  t54:{excl:1, name:'영 후드티 (햄스터)', price:118000, ...groupHood('영','#ffd6c0','hamster')},
  t55:{excl:1, name:'째 후드티 (앵무새)', price:118000, ...groupHood('째','#a9d3ff','parrot')},
  t56:{excl:1, name:'쭈 후드티 (토끼)', price:118000, ...groupHood('쭈','#ffc3d5','bunny')},
  t57:{excl:1, name:'하 후드티 (병아리)', price:118000, ...groupHood('하','#fff1a0','chick')},
  t58:{excl:1, name:'투 후드티 (오투모)', price:118000, ...groupHood('투','#bfd2ff','robot')},
};
export const BOTTOMS = {
  b01:{name:'청바지',      price:0,   draw:(d,g)=>{ pants(d,g,'#7d8ab0'); legs(d,g,'#7d8ab0'); }},
  b02:{name:'반바지',      price:0,   draw:(d,g)=>{ pants(d,g,'#a7b6cf'); legs(d,g,g.sk); shorts(d,g,'#a7b6cf'); }},
  b03:{name:'플리츠 치마', price:56000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#f6c6d3'); pleats(d,g,'#e2a3b6'); }},
  b04:{name:'코듀로이 바지', price:62000, draw:(d,g)=>{ pants(d,g,'#c9956a'); legs(d,g,'#c9956a'); }},
  b05:{name:'체크 치마',   price:67000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#c9657a'); checks(d,g,'#f3dfe4',SK0+3,skB(.42)-.5,3.4); }},
  b06:{name:'조거 팬츠',   price:46000, draw:(d,g)=>{ pants(d,g,'#8f98a8'); legs(d,g,'#8f98a8'); if(!g.side){ d.rr(-5.6,-2.2,4.4,1.6,.8,'#6e7686',{flat:true,noShadow:true}); d.rr(1.2,-2.2,4.4,1.6,.8,'#6e7686',{flat:true,noShadow:true}); } }},
  b07:{name:'튤 스커트',   price:78000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#e9dcf7',1.4,.45); g.c.save(); g.c.globalAlpha=.5; skirt(d,g,'#f7f0ff',1.55,.5); g.c.restore(); }},
  b08:{name:'카고 반바지', price:41000, draw:(d,g)=>{ pants(d,g,'#9fae8a'); legs(d,g,g.sk); shorts(d,g,'#9fae8a',4); if(!g.up&&!g.side){ d.rr(-5.8,-7.6,2.4,2.2,.8,'#8a9877',{flat:true}); d.rr(3.4,-7.6,2.4,2.2,.8,'#8a9877',{flat:true}); } }},
  b09:{name:'레깅스',      price:37000, draw:(d,g)=>{ pants(d,g,'#5b5f73',.4); legs(d,g,'#5b5f73'); }},
  b10:{name:'롱 스커트',   price:72000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#f0d4a8',1.2,.64); }},
  b11:{name:'검정 면바지', price:0,   draw:(d,g)=>{ pants(d,g,'#4a4550'); legs(d,g,'#4a4550'); }},
  b12:{name:'회색 트레이닝 바지', price:0, draw:(d,g)=>{ pants(d,g,'#b9b6c0'); legs(d,g,'#b9b6c0'); if(!g.side) for (const f of feet(g)) d.rr(f.x-2.2,-2.6-f.lift,4.4,1.4,.7,'#a19ead',{flat:true, noShadow:true}); }},
  b13:{name:'남색 A라인 치마', price:0, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#5c6a92',1.15,.4); }},
  b14:{name:'와이드 팬츠', price:65000, draw:(d,g)=>{ pants(d,g,'#e3d3b8'); for (const f of feet(g)) d.rr(f.x-2.9,-9-f.lift,5.8,9,1.8,shade('#e3d3b8',f)); }},
  b15:{name:'체크 바지',   price:71000, draw:(d,g)=>{ pants(d,g,'#a9a0c9'); legs(d,g,'#a9a0c9'); for (const f of feet(g)) d.line(k=>{ for (const y of [-7,-4.6,-2.2]){ k.moveTo(f.x-2,y-f.lift); k.lineTo(f.x+2,y-f.lift); } k.moveTo(f.x,-8.4-f.lift); k.lineTo(f.x,-.6-f.lift); }, '#8e86b0', .5, .6); }},
  b16:{name:'흰 바지',     price:55000, draw:(d,g)=>{ pants(d,g,'#f6f2ea'); legs(d,g,'#f6f2ea'); }},
  b17:{name:'청반바지',    price:39000, draw:(d,g)=>{ pants(d,g,'#8fa5cf'); legs(d,g,g.sk); shorts(d,g,'#8fa5cf',3); for (const f of feet(g)) d.line(k=>{ for (let i=-1;i<=1;i++){ k.moveTo(f.x+i*1.3,-5.7-f.lift); k.lineTo(f.x+i*1.3,-5-f.lift); } }, '#dfe6f3', .5, .9); }},
  b18:{name:'테니스 치마', price:62000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#fffaf2',1.2,.38); pleats(d,g,'#dcd6cc',.38,3); if(!g.up) d.rr(-g.bw*.55,skB(.38)-1.3,g.bw*1.1,.7,.35,'#5c6a92',{flat:true, noShadow:true}); }},
  b19:{name:'데님 치마',   price:60000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#7f9cc9',1.05,.4); if(!g.up&&!g.side) d.line(k=>{ k.moveTo(0,SK0+2); k.lineTo(0,skB(.4)); }, '#f0c27a', .5, .8); }},
  b20:{name:'꽃무늬 치마', price:70000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#ffe3ea',1.25,.45); if(!g.up) for (const [px,py,col] of [[-4,-6.5,'#ff8fb0'],[1,-5,'#ffd45a'],[4.5,-7,'#ff8fb0'],[-1.5,-3.2,'#b5a6f0'],[5,-3.6,'#ffd45a']]){ d.dot(px,py,.9,col); d.dot(px,py,.35,'#fffaf2'); } }},
  b21:{name:'카고 바지',   price:75000, draw:(d,g)=>{ pants(d,g,'#9fae8a'); legs(d,g,'#9fae8a'); if(!g.up) for (const f of feet(g)) d.rr(f.x+(g.side?-1.2:(f.x<0?-2.6:.6)),-6-f.lift,2,2.2,.6,'#8a9877',{flat:true}); }},
  b22:{name:'찢어진 청바지', price:80000, draw:(d,g)=>{ pants(d,g,'#86a0cc'); legs(d,g,'#86a0cc'); if(!g.up) for (const f of feet(g)){ d.rr(f.x-1.3,-5.2-f.lift,2.6,1.2,.6,g.sk,{flat:true, noShadow:true}); d.line(k=>{ k.moveTo(f.x-1.4,-5.3-f.lift); k.lineTo(f.x+1.4,-5.3-f.lift); k.moveTo(f.x-1.4,-3.9-f.lift); k.lineTo(f.x+1.4,-3.9-f.lift); }, '#eef2f8', .4, .9); } }},
  b23:{name:'줄무늬 바지', price:65000, draw:(d,g)=>{ pants(d,g,'#fff6e6'); legs(d,g,'#fff6e6'); for (const f of feet(g)) d.line(k=>{ for (const dx of [-1.1,1.1]){ k.moveTo(f.x+dx,-8.3-f.lift); k.lineTo(f.x+dx,-.6-f.lift); } }, '#e5a36b', .6, .8); }},
  b24:{name:'체크 반바지', price:51000, draw:(d,g)=>{ pants(d,g,'#d7b46a'); legs(d,g,g.sk); shorts(d,g,'#d7b46a',3.4); for (const f of feet(g)) d.line(k=>{ k.moveTo(f.x-2.2,-7-f.lift); k.lineTo(f.x+2.2,-7-f.lift); k.moveTo(f.x,-8.6-f.lift); k.lineTo(f.x,-5.5-f.lift); }, '#b8944c', .5, .6); }},
  b25:{name:'반짝이 치마', price:98000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#e6d7a8',1.3,.45); if(!g.up) for (const [px,py] of [[-4,-7],[0,-5],[4,-7.5],[-2,-3.4],[3,-3.2],[5.5,-5]]) d.dot(px,py,.45,'#ffffff',.95); }},
  b26:{name:'핑크 트레이닝 바지', price:53000, draw:(d,g)=>{ pants(d,g,'#f6b8c8'); legs(d,g,'#f6b8c8'); if(!g.side) d.line(k=>{ k.moveTo(-5.2,-8.3); k.lineTo(-5.2,-1.2); k.moveTo(5.2,-8.3); k.lineTo(5.2,-1.2); }, '#fffaf2', .9, .9); }},
  b27:{name:'가죽 치마',   price:82000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#3b3440',1.0,.36); if(!g.up) d.line(k=>{ k.moveTo(-3,SK0+3); k.quadraticCurveTo(-3.4,skB(.36)-2,-2.6,skB(.36)-.8); }, '#8a8090', .5, .7); }},
  b28:{name:'니트 치마',   price:67000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#c9b9a0',1.05,.55); if(!g.up&&!g.side) d.line(k=>{ for (let i=-3;i<=3;i++){ k.moveTo(i*1.8,SK0+3); k.lineTo(i*1.9,skB(.55)-.3); } }, '#b3a286', .45, .7); }},
  b29:{name:'물방울 치마', price:65000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#9fc6ef',1.25,.42); if(!g.up) for (const [px,py] of [[-4,-7],[0,-6],[4,-7.4],[-2.4,-4],[2.2,-3.8],[5.6,-4.4],[-5.6,-4.2]]) d.dot(px,py,.65,'#fffaf2'); }},
  b30:{name:'롤업 청바지', price:72000, draw:(d,g)=>{ pants(d,g,'#7d8ab0'); legs(d,g,'#7d8ab0'); for (const f of feet(g)) d.rr(f.x-2.3,-3.4-f.lift,4.6,1.6,.8,shade('#a9b6d6',f)); }},
  b31:{excl:1, name:'딸기 치마', price:69000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#f2647a',1.25,.44); if(!g.up){ for (const [px,py] of [[-4,-7],[0,-5.6],[4,-7.2],[-2.2,-3.6],[2.4,-3.4],[5.4,-4.6],[-5.4,-4.2]]) d.dot(px,py,.4,'#ffe9a8'); ruffle(d,-g.bw*.42-1.6,g.bw*.42+1.6,SK0+.2,'#7cc97f',.75); } }},
  b32:{excl:1, name:'프릴 치마', price:76000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#bfe8dc',1.35,.48); skirt(d,g,'#d3f1e8',1.2,.3); if(!g.up){ ruffle(d,-g.bw*.66,g.bw*.66,skB(.48)-.3,'#fffaf2',.75); ruffle(d,-g.bw*.54,g.bw*.54,skB(.3)-.3,'#fffaf2',.65); } }},
  b33:{excl:1, name:'하트 바지', price:64000, draw:(d,g)=>{ pants(d,g,'#ffd1dc'); legs(d,g,'#ffd1dc'); if(!g.up) for (const f of feet(g)) for (const y of [-7.2,-3.4]) heart(d,f.x+(y<-5?-.6:.6),y-f.lift,.75,'#ff6f9f'); }},
  b34:{excl:1, name:'곰돌이 반바지', price:52000, draw:(d,g)=>{ pants(d,g,'#c9a07a'); legs(d,g,g.sk); shorts(d,g,'#c9a07a',3.4); if(!g.up&&!g.side){ const x=3.4,y=-6.6; d.circle(x-1.3,y-1.3,.8,'#9a7250',{flat:true, noShadow:true}); d.circle(x+1.3,y-1.3,.8,'#9a7250',{flat:true, noShadow:true}); d.circle(x,y,1.6,'#ecd5b8',{flat:true, noShadow:true}); d.dot(x-.6,y-.2,.3,'#3a2430'); d.dot(x+.6,y-.2,.3,'#3a2430'); d.dot(x,y+.6,.32,'#3a2430'); } if(g.up) d.circle(0,BY+BH*.7,1.5,'#b48a64'); }},
  b35:{excl:1, name:'별 트레이닝 바지', price:58000, draw:(d,g)=>{ pants(d,g,'#4f5c8f'); legs(d,g,'#4f5c8f'); if(!g.side) d.line(k=>{ k.moveTo(-5.2,-8.3); k.lineTo(-5.2,-1.2); k.moveTo(5.2,-8.3); k.lineTo(5.2,-1.2); }, '#ffe08a', .8, .9); if(!g.up) for (const f of feet(g)) for (const y of [-6.6,-3]) d.dot(f.x+(y<-5?.5:-.5),y-f.lift,.55,'#ffe08a'); }},
  b36:{excl:1, name:'레이스 캉캉 치마', price:84000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#fff4f8',1.4,.42); if(!g.up){ ruffle(d,-g.bw*.62,g.bw*.62,skB(.42)-.2,'#ffffff',.8); d.line(k=>{ for (let x=-g.bw*.6; x<=g.bw*.6; x+=1.6){ k.moveTo(x+.5,skB(.42)+.4); k.arc(x,skB(.42)+.4,.5,0,3.2); } }, '#f3bfd0', .35, .9); d.rr(-g.bw*.42,SK0,g.bw*.84,1.2,.6,'#ffb3c6',{flat:true, noShadow:true}); } }},
  b37:{excl:1, name:'타탄 플리츠 치마', price:72000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#3f6a5a',1.2,.44); checks(d,g,'#e8505f',SK0+2.6,skB(.44)-.6,3.6); if(!g.up) d.line(k=>{ for (let x=-g.bw*.5+1.8; x<g.bw*.5; x+=3.6){ k.moveTo(x,SK0+1); k.lineTo(x*1.15,skB(.44)-.4); } }, '#ffe08a', .35, .8); pleats(d,g,'#2f5446',.44,3); }},
  b38:{excl:1, name:'벨벳 치마', price:78000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#8a2f4a',1.22,.48); if(!g.up){ d.line(k=>{ k.moveTo(-3.2,SK0+2); k.quadraticCurveTo(-3.8,skB(.48)-3,-3,skB(.48)-1); }, '#c8607e', .9, .6); d.dot(g.bw*.3,SK0+1.4,.7,'#f3d27a'); } }},
  b39:{excl:1, name:'가죽 바지', price:88000, draw:(d,g)=>{ pants(d,g,'#2f2a33'); legs(d,g,'#2f2a33'); for (const f of feet(g)) d.line(k=>{ k.moveTo(f.x-.8,-8-f.lift); k.lineTo(f.x-.6,-1.5-f.lift); }, '#6a6276', .6, .8); }},
  b40:{excl:1, name:'데이지 치마', price:68000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#ffe9a0',1.25,.46); if(!g.up) for (const [px,py] of [[-4,-7],[1,-5.4],[4.6,-7.4],[-2,-3.4],[3,-3],[-5.6,-4]]) petal(d,px,py,.6,'#fffaf2','#f7b733'); }},
  b41:{excl:1, name:'꽃 반바지', price:54000, draw:(d,g)=>{ pants(d,g,'#ffc4d6'); legs(d,g,g.sk); shorts(d,g,'#ffc4d6',3.4); if(!g.up) for (const f of feet(g)) petal(d,f.x,-7-f.lift,.45,'#fffaf2','#ff7fa8'); }},
  b42:{excl:1, name:'무지개 치마', price:92000, draw:(d,g)=>{ legs(d,g,g.sk); [['#b49bff',1.42,.5],['#7cbcff',1.34,.42],['#8fd68a',1.27,.34],['#ffe070',1.2,.26],['#ff8f9a',1.12,.18]].forEach(([c,f,h],i)=>skirt(d,g,c,f,h)); }},
  b43:{excl:1, name:'별빛 롱스커트', price:86000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#2a3466',1.22,.66); if(!g.up) for (const [px,py,r] of [[-4,-6.5,.7],[1,-4.6,.5],[4.6,-7,.6],[-1.6,-2.6,.45],[3.4,-2.2,.5],[-5.6,-3.4,.4],[0,-8.4,.4]]) d.dot(px,py,r,'#ffe08a'); }},
  b44:{excl:1, name:'체크 슬랙스', price:76000, draw:(d,g)=>{ pants(d,g,'#9a9eab'); legs(d,g,'#9a9eab'); for (const f of feet(g)) d.line(k=>{ for (const y of [-7.4,-4.6,-1.8]){ k.moveTo(f.x-2,y-f.lift); k.lineTo(f.x+2,y-f.lift); } k.moveTo(f.x-.7,-8.4-f.lift); k.lineTo(f.x-.7,-.6-f.lift); k.moveTo(f.x+1,-8.4-f.lift); k.lineTo(f.x+1,-.6-f.lift); }, '#7f8494', .45, .8); }},
  b45:{excl:1, name:'레이스 반바지', price:58000, draw:(d,g)=>{ pants(d,g,'#fffaf2'); legs(d,g,g.sk); shorts(d,g,'#fffaf2',3.2); for (const f of feet(g)) ruffle(d,f.x-2.2,f.x+2.2,-5.6-f.lift,'#ffe4ec',.55); }},
};
export const SETS = {
  s01:{name:'멜빵바지',    price:98000,   draw:(d,g)=>{ torso(d,g,'#fffaf2'); bareArms(d,g); pants(d,g,'#f29ab8',.5); legs(d,g,'#f29ab8'); if(!g.up){ d.rr(-5.5,BY,2.2,BH*.55,1,'#f29ab8',{flat:true}); d.rr(3.3,BY,2.2,BH*.55,1,'#f29ab8',{flat:true}); d.rr(-4,BY+5,8,5,1.5,'#f29ab8',{flat:true}); d.dot(-4.4,BY+5.5,.8,'#ffe08a'); d.dot(4.4,BY+5.5,.8,'#ffe08a'); } }},
  s02:{name:'핑크 원피스', price:204000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#f6c6d3','#fffaf2'); if(!g.up) collar(d,g,'#fffaf2'); sleeves(d,g,'#f6c6d3'); hands(d,g); }},
  s03:{name:'여자 교복',   price:282000, draw:(d,g)=>{ torso(d,g,'#5c6a92'); front(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); if(!g.up) d.rr(-1,BY+3.5,2,5,1,'#e85d7a',{flat:true,noShadow:true}); sleeves(d,g,'#5c6a92'); hands(d,g); legs(d,g,g.sk); skirt(d,g,'#8a93b5',1.15,.4); pleats(d,g,'#6f789a',.4); }},
  s04:{name:'공룡 잠옷',   price:301000, draw:(d,g)=>{ const gr='#9fd9a8', dk='#6fc47a', bl='#e8f6d8';
    if (g.side || g.up){ const tx = g.up ? 0 : -g.bw/2-2; d.shape(c=>{ c.beginPath(); c.moveTo(tx+(g.up?-5:2), BY+8); c.quadraticCurveTo(tx+(g.up?0:-8), BY+20, tx+(g.up?0:-13), BY+21); c.quadraticCurveTo(tx+(g.up?0:-6), BY+15, tx+(g.up?5:2), BY+15); c.closePath(); }, gr, [tx-4,BY+16,6]); for (const k of [0,1]) d.shape(c=>{ const x0 = g.up ? 0 : tx-3-k*4.5, y0 = BY+12+k*4; c.beginPath(); c.moveTo(x0-1.6,y0+.6); c.lineTo(x0,y0-2.2); c.lineTo(x0+1.6,y0+.6); c.closePath(); }, dk, [tx,BY+14,2], {flat:true}); } // 꼬리
    d.ell(0, HY-1.5, R*1.36, R*1.3, gr); // 후드 뒤
    torso(d,g,gr); pants(d,g,gr,.5); legs(d,g,gr); longArms(d,g,gr); if(!g.up) d.ell(0,BY+6,4,5,bl,{flat:true});
    if (g.up) for (const y of [BY+1, BY+5, BY+9]) d.shape(c=>{ c.beginPath(); c.moveTo(-1.8,y+1); c.lineTo(0,y-2.2); c.lineTo(1.8,y+1); c.closePath(); }, dk, [0,y,2], {flat:true}); },
    // 머리카락 위로: 공룡 얼굴 후드 (등뼈 가시 · 눈 · 이빨)
    over:(d,g)=>{ const gr='#9fd9a8', dk='#6fc47a', cy = HY-1.5, ox = g.side ? R*.12 : 0;
      const sp = g.side ? [-2.95,-2.55,-2.15,-1.75] : g.up ? [-2.5,-2.05,-1.57,-1.09,-.64] : [-2.45,-2.0,-1.57,-1.14,-.69];
      for (const a of sp){ const cx = Math.cos(a), sy = Math.sin(a), x = cx*R*1.3, y = cy+sy*R*1.24, s = Math.abs(a+1.57) < .1 ? 5 : 4; d.shape(c=>{ c.beginPath(); c.moveTo(x-sy*3, y+cx*3); c.lineTo(x+cx*s, y+sy*s); c.lineTo(x+sy*3, y-cx*3); c.closePath(); }, dk, [x,y,3]); }
      if (g.up){ d.ell(0, cy, R*1.3, R*1.24, gr); for (const y of [cy-R*.6, cy-R*.1, cy+R*.4]) d.shape(c=>{ c.beginPath(); c.moveTo(-2.4,y+1.4); c.lineTo(0,y-2.6); c.lineTo(2.4,y+1.4); c.closePath(); }, dk, [0,y,3]); return; }
      // 윗턱: 이마를 덮는 초승달
      d.shape(c=>{ c.beginPath(); c.ellipse(ox, cy, R*1.3, R*1.24, 0, Math.PI*1.04, Math.PI*1.96); c.ellipse(ox, cy+R*.12, R*1.02, R*.78, 0, Math.PI*1.9, Math.PI*1.1, true); c.closePath(); }, gr, [ox,cy-R*.9,8]);
      // 이빨 (아래로 톡톡)
      d.shape(c=>{ c.beginPath(); for (let i = 0; i < 7; i++){ const a = Math.PI*(1.2 + i*.087), a2 = a + Math.PI*.0435; const x0 = ox+Math.cos(a)*R*1.02, y0 = cy+R*.12+Math.sin(a)*R*.78; c.moveTo(x0, y0); c.lineTo(ox+Math.cos(a2)*R*.9, cy+R*.12+Math.sin(a2)*R*.62); c.lineTo(ox+Math.cos(a + Math.PI*.087)*R*1.02, cy+R*.12+Math.sin(a + Math.PI*.087)*R*.78); } }, '#fffaf2', [ox,cy-R*.6,4], {noShadow:true});
      // 눈 · 콧구멍
      for (const sx of (g.side ? [.55] : [-1, 1])){ const ex = ox + sx*R*.5, ey = cy - R*1.02; d.circle(ex, ey, 3, '#fffaf2', {noShadow:true}); d.dot(ex + (g.side ? .8 : 0), ey + .3, 1.4, '#2b2228'); d.dot(ex + .5, ey - .6, .5, '#fff'); }
      if (!g.side){ d.dot(-1.6, cy - R*.72, .55, dk); d.dot(1.6, cy - R*.72, .55, dk); } } },
  s05:{name:'세일러복',    price:243000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-6,BY); c.lineTo(0,BY+5); c.lineTo(6,BY); c.lineTo(6,BY+3); c.lineTo(0,BY+7.5); c.lineTo(-6,BY+3); c.closePath(); }, '#6f86b8', [0,BY+3,6], {flat:true}); d.dot(0,BY+6.5,1.1,'#e85d7a'); } sleeves(d,g,'#fffaf2'); hands(d,g); legs(d,g,g.sk); skirt(d,g,'#6f86b8',1.15,.4); }},
  s06:{name:'트레이닝 세트', price:223000, draw:(d,g)=>{ torso(d,g,'#f28c8c'); if(!g.up) d.line(k=>{ k.moveTo(-g.bw/2+1, BY+4); k.lineTo(g.bw/2-1, BY+4); }, '#fffaf2', 1.4, .9); sleeves(d,g,'#f28c8c'); hands(d,g); pants(d,g,'#f28c8c',.42); legs(d,g,'#f28c8c'); if(!g.side) d.line(k=>{ k.moveTo(-3.3,-8.3); k.lineTo(-3.3,-1.2); k.moveTo(3.3,-8.3); k.lineTo(3.3,-1.2); }, '#fffaf2', 1, .9); }},
  s07:{name:'파티 드레스', price:395000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#d2b8ff','#fff'); skirt(d,g,'#c4a6f5',1.5,.55); if(!g.up){ d.dot(-3,BY+BH*.75,1,'#fff',.9); d.dot(2,BY+BH*.85,.8,'#fff',.9); d.dot(5,BY+BH*.7,.8,'#fff',.9); d.ell(0,BY+2,3,1.8,'#fff',{flat:true}); } bareArms(d,g); }},
  s08:{name:'요리사 세트', price:262000, draw:(d,g)=>{ torso(d,g,'#fffaf2'); if(!g.up){ d.rr(-g.bw*.36,BY+3,g.bw*.72,BH*.6,3,'#f6c6a3',{flat:true}); d.dot(-2,BY+4.5,.7,'#8a6a5a'); d.dot(2,BY+4.5,.7,'#8a6a5a'); } sleeves(d,g,'#fffaf2'); hands(d,g); pants(d,g,'#5b5f73',.35); legs(d,g,'#5b5f73'); }},
  s09:{name:'농부 작업복', price:186000, draw:(d,g)=>{ torso(d,g,'#c9d7a3'); pants(d,g,'#b9915f',.5); legs(d,g,'#b9915f'); if(!g.up){ d.rr(-5.5,BY,2.2,BH*.55,1,'#b9915f',{flat:true}); d.rr(3.3,BY,2.2,BH*.55,1,'#b9915f',{flat:true}); d.rr(-4,BY+5,8,5,1.5,'#b9915f',{flat:true}); d.dot(0,BY+7.5,1,'#e85d7a'); } sleeves(d,g,'#c9d7a3'); hands(d,g); }},
  s10:{name:'토끼 잠옷',   price:301000, draw:(d,g)=>{ torso(d,g,'#fff0f5'); pants(d,g,'#fff0f5',.5); legs(d,g,'#fff0f5'); sleeves(d,g,'#fff0f5'); hands(d,g); if(!g.up) d.ell(0,BY+6.5,4,5,'#ffd9e6',{flat:true}); d.ell(-5,HY-R*1.5,2.2,6,'#fff0f5'); d.ell(5,HY-R*1.5,2.2,6,'#fff0f5'); d.ell(-5,HY-R*1.5,1.1,4,'#ffc3d6',{flat:true,noShadow:true}); d.ell(5,HY-R*1.5,1.1,4,'#ffc3d6',{flat:true,noShadow:true}); }},
  s11:{name:'여자 한복', price:349000, main:'#f28aa8', draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#f28aa8',1.55,.66); d.rr(-g.bw/2,BY,g.bw,BH*.42,4.5,'#fff1c4'); if(!g.up){ d.line(k=>{ k.moveTo(-g.bw*.3,BY+.5); k.lineTo(1.2,BY+6); }, '#e8c96a', .8, .9); d.rr(.6,BY+5,1.4,6,.7,'#e85d7a',{flat:true}); d.rr(2,BY+5,1.3,4.6,.6,'#e85d7a',{flat:true}); } for (const sx of (g.side?[1]:[-1,1])){ const ax = sx*(g.bw/2+1.4); d.ell(ax, BY+BH*.34, 3.2, 4.6, '#fff1c4'); ['#f6a6a6','#a9c7ef','#b5e3b0'].forEach((col,i)=>d.rr(ax-2.9, BY+BH*.34+.6+i*1.2, 5.8, 1.1, .5, col, {flat:true, noShadow:true})); } hands(d,g); }},
  s12:{name:'생활 한복', price:349000, draw:(d,g)=>{ pants(d,g,'#e9e3d4'); for (const f of feet(g)){ d.rr(f.x-2.6,-9-f.lift,5.2,9,1.8,shade('#e9e3d4',f)); d.rr(f.x-2.4,-3-f.lift,4.8,1.3,.6,shade('#8fb0d6',f),{flat:true}); } torso(d,g,'#cfe3f2'); if(!g.up){ d.line(k=>{ k.moveTo(-g.bw*.3,BY+.5); k.lineTo(1.6,BY+7); }, '#fffaf2', 1, .9); d.rr(1,BY+6,1.3,5,.6,'#5c6a92',{flat:true}); } longArms(d,g,'#cfe3f2'); }},
  s13:{name:'정장 세트',   price:317000, draw:(d,g)=>{ pants(d,g,'#3f4458'); legs(d,g,'#3f4458'); torso(d,g,'#3f4458'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-3,BY); c.lineTo(0,BY+7); c.lineTo(3,BY); c.closePath(); }, '#fffaf2', [0,BY+3,3], {flat:true}); d.shape(c=>{ c.beginPath(); c.moveTo(-.9,BY+1.4); c.lineTo(.9,BY+1.4); c.lineTo(.6,BY+6.5); c.lineTo(0,BY+7.3); c.lineTo(-.6,BY+6.5); c.closePath(); }, '#e85d7a', [0,BY+4,1], {flat:true, noShadow:true}); d.dot(0,BY+9.5,.55,'#2a2e3c'); } longArms(d,g,'#3f4458'); }},
  s14:{name:'고양이 잠옷', price:301000, draw:(d,g)=>{ torso(d,g,'#d9d2e9'); pants(d,g,'#d9d2e9'); legs(d,g,'#d9d2e9'); longArms(d,g,'#d9d2e9'); if(!g.up) d.ell(0,BY+6.5,4,4.6,'#f3f0f8',{flat:true}); for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.35,HY-R*1.15); c.lineTo(sx*R*.85,HY-R*1.75); c.lineTo(sx*R*1.05,HY-R*.95); c.closePath(); }, '#d9d2e9', [sx*R*.7,HY-R*1.3,4]); if (!g.up) for (const sx of (g.side?[1]:[-1,1])) d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.6,HY-R*1.17); c.lineTo(sx*R*.81,HY-R*1.5); c.lineTo(sx*R*.9,HY-R*1.09); c.closePath(); }, '#f6b8c8', [sx*R*.77,HY-R*1.25,1.5], {flat:true, noShadow:true}); }},
  s15:{name:'노랑 우비',   price:239000, draw:(d,g)=>{ legs(d,g,g.sk); d.ell(0, HY-1, R*1.32, R*1.22, '#ffd45a'); d.rr(-g.bw/2-.8, BY-.5, g.bw+1.6, BH*.8, 5, '#ffd45a'); if(!g.up){ d.line(k=>{ k.moveTo(0,BY+1); k.lineTo(0,BY+BH*.78); }, '#e6b93c', .8, .9); for (const y of [4,8,12]) d.dot(1.4,BY+y,.6,'#fffaf2'); } longArms(d,g,'#ffd45a'); }},
  s16:{name:'마법사 로브', price:381000, draw:(d,g)=>{ legs(d,g,'#4a3a6a'); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2,BY+1); c.quadraticCurveTo(-g.bw/2-.4,BY-.6,-g.bw/2+3,BY-.6); c.lineTo(g.bw/2-3,BY-.6); c.quadraticCurveTo(g.bw/2+.4,BY-.6,g.bw/2,BY+1); c.lineTo(g.bw/2+2.2,-2.4); c.quadraticCurveTo(0,-1.2,-g.bw/2-2.2,-2.4); c.closePath(); }, '#6f5bb5', [0,BY+10,g.bw*.6]); if(!g.up){ for (const [px,py] of [[-4,6],[3,9],[-2,13],[4.5,15]]) d.dot(px,BY+py,.6,'#ffd23f'); d.dot(0,BY+1.6,1.1,'#ffd23f'); } longArms(d,g,'#6f5bb5'); }},
  s17:{name:'산타 옷',     price:286000, draw:(d,g)=>{ pants(d,g,'#e85d5d'); legs(d,g,'#e85d5d'); torso(d,g,'#e85d5d'); d.rr(-g.bw/2,BY+BH*.56,g.bw,2.2,1.1,'#fffaf2'); if(!g.up){ d.line(k=>{ k.moveTo(0,BY+.5); k.lineTo(0,BY+BH*.56); }, '#fffaf2', 1.4, .9); } d.rr(-g.bw/2,BY+BH*.42,g.bw,1.6,.6,'#3a3040',{flat:true}); if(!g.up) d.rr(-1.4,BY+BH*.42-.3,2.8,2.2,.4,'#ffd23f',{flat:true, noShadow:true}); longArms(d,g,'#e85d5d'); }},
  s18:{name:'곰돌이 잠옷', price:301000, draw:(d,g)=>{ torso(d,g,'#c9a07a'); pants(d,g,'#c9a07a'); legs(d,g,'#c9a07a'); longArms(d,g,'#c9a07a'); if(!g.up) d.ell(0,BY+6.5,4,4.6,'#ecd5b8',{flat:true}); for (const sx of (g.side?[-.2]:[-1,1])){ d.circle(sx*R*.82,HY-R*1.12,3.6,'#c9a07a'); d.circle(sx*R*.82,HY-R*1.12,1.8,'#ecd5b8',{flat:true, noShadow:true}); } }},
  s19:{name:'기사 갑옷',   price:448000, draw:(d,g)=>{ pants(d,g,'#9aa1ae'); legs(d,g,'#9aa1ae'); torso(d,g,'#c9ced8'); d.line(k=>{ for (const y of [4.5,8.5]){ k.moveTo(-g.bw/2+.6,BY+y); k.lineTo(g.bw/2-.6,BY+y); } }, '#a7aebb', .8, .9); if(!g.up){ d.circle(0,BY+6.4,2,'#e0b84a',{flat:true}); d.dot(0,BY+6.4,.8,'#e85d7a'); } for (const sx of (g.side?[1]:[-1,1])) d.ell(sx*(g.bw/2+1.2),BY+1.8,3.6,2.4,'#b7bdc9'); longArms(d,g,'#b7bdc9'); }},
  s20:{name:'별빛 드레스', price:414000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#3d4a86','#f3d27a'); skirt(d,g,'#3d4a86',1.45,.55); if(!g.up) for (const [px,py] of [[-4,-6.5],[2,-5],[5,-7],[-1.5,-3.2],[4,-2.8],[-5.5,-3.6],[0,4-BY]]) d.dot(px,py>0?BY+py:py,.55,'#f3d27a'); bareArms(d,g); }},
  s21:{name:'남자 교복',   price:282000, draw:(d,g)=>{ pants(d,g,'#5f6475'); legs(d,g,'#5f6475'); torso(d,g,'#3e4a6e'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-3.2,BY); c.lineTo(0,BY+7.5); c.lineTo(3.2,BY); c.closePath(); }, '#fffaf2', [0,BY+3,3], {flat:true}); d.shape(c=>{ c.beginPath(); c.moveTo(-.9,BY+1.2); c.lineTo(.9,BY+1.2); c.lineTo(.6,BY+6.6); c.lineTo(0,BY+7.4); c.lineTo(-.6,BY+6.6); c.closePath(); }, '#b8475e', [0,BY+4,1], {flat:true, noShadow:true}); d.line(k=>{ for (const y of [2.6,4.4]){ k.moveTo(-.8,BY+y); k.lineTo(.8,BY+y+.8); } }, '#f3d27a', .45, .9); if(!g.side){ d.rr(-6.2,BY+3.6,2.6,2,.5,'#e0b84a',{flat:true}); d.dot(1.8,BY+9.6,.5,'#2a3150'); d.dot(1.8,BY+11.6,.5,'#2a3150'); } } longArms(d,g,'#3e4a6e'); }},
  s22:{name:'남자 한복',   price:349000, main:'#4e7fa8', draw:(d,g)=>{ pants(d,g,'#f4efe3'); for (const f of feet(g)){ d.rr(f.x-2.6,-9-f.lift,5.2,9,1.8,shade('#f4efe3',f)); d.rr(f.x-2.4,-3-f.lift,4.8,1.3,.6,shade('#4e7fa8',f),{flat:true}); } torso(d,g,'#f4efe3'); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2-.4,BY+.6); c.lineTo(g.bw/2+.4,BY+.6); c.lineTo(g.bw/2+1,-4.4); c.lineTo(-g.bw/2-1,-4.4); c.closePath(); }, '#4e7fa8', [0,BY+8,g.bw*.6]); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-2.6,BY+.6); c.lineTo(0,BY+5); c.lineTo(2.6,BY+.6); c.closePath(); }, '#f4efe3', [0,BY+2,2.5], {flat:true}); d.line(k=>{ k.moveTo(0,BY+5); k.lineTo(0,-4.6); }, '#3c6688', .7, .9); } d.rr(-g.bw/2-.6,BY+BH*.44,g.bw+1.2,1.7,.8,'#c94a5c',{flat:true}); longArms(d,g,'#f4efe3'); }},
  s23:{excl:1, name:'딸기 원피스', price:236000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#f2647a'); if(!g.up){ for (const [px,py] of [[-3.5,BY+4],[3,BY+6],[-1,BY+9],[4,BY+11],[-4.5,BY+14],[1,BY+15.5],[5,BY+16.5],[-2.6,BY+17.6]]) d.dot(px,py,.45,'#ffe9a8'); } ruffle(d,-5.2,5.2,BY+.6,'#7cc97f',1); sleeves(d,g,'#f2647a'); hands(d,g); }},
  s24:{excl:1, name:'병아리 잠옷', price:298000, draw:(d,g)=>{ const y='#ffe27a'; d.ell(0, HY-1, R*1.3, R*1.2, y); torso(d,g,y); pants(d,g,y,.5); legs(d,g,y); sleeves(d,g,y); hands(d,g); if(!g.up) d.ell(0,BY+6.5,4,4.6,'#fff3c4',{flat:true}); if(!g.side) for (const sx of [-1,1]) d.ell(sx*(g.bw/2+1.2),BY+BH*.3,1.6,3,'#f7cf4f',{noShadow:true}); for (const [dx,h] of [[-1.8,3],[0,4.2],[1.8,3]]) d.ell(dx,HY-R*1.2-h*.5,1.2,h*.8,'#f7cf4f',{noShadow:true}); if(!g.up&&!g.side) d.ell(0,BY+1.4,1.6,1,'#ff9f4a',{flat:true}); }},
  s25:{excl:1, name:'체리 앞치마 원피스', price:248000, draw:(d,g)=>{ legs(d,g,g.sk); torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); skirt(d,g,'#c9657a',1.3,.5); if(!g.up){ d.rr(-4.2,BY+3.6,8.4,BH*.5,2,'#c9657a',{flat:true}); d.rr(-4.6,BY,1.6,4,.8,'#c9657a',{flat:true}); d.rr(3,BY,1.6,4,.8,'#c9657a',{flat:true}); d.dot(-.9,BY+8.6,1,'#e8364f'); d.dot(.9,BY+8.9,1,'#e8364f'); d.line(k=>{ k.moveTo(-.9,BY+7.8); k.quadraticCurveTo(0,BY+5.6,.4,BY+5.6); k.lineTo(.9,BY+8.1); }, '#5fae63', .4); } else d.line(k=>{ k.moveTo(-4,BY); k.lineTo(4,BY+10); k.moveTo(4,BY); k.lineTo(-4,BY+10); }, '#c9657a', 1.4); sleeves(d,g,'#fffaf2'); hands(d,g); }},
  s26:{excl:1, name:'메이드 카페복', price:318000, draw:(d,g)=>{ const k='#2e3448', w='#fffaf2', p='#ff8fb0';
    legs(d,g,g.sk); dress(d,g,k); skirt(d,g,k,1.45,.54); ruffle(d,-g.bw*.7,g.bw*.7,skB(.54)-.1,w,.9); // 검은 원피스 + 밑단 흰 레이스
    if (!g.up){ const ax = g.side ? g.bw*.08 : 0, aw = g.side ? 4.2 : 5.4;
      d.shape(c=>{ c.beginPath(); c.moveTo(ax-aw*.7, BY+3); c.lineTo(ax+aw*.7, BY+3); c.lineTo(ax+aw*.8, SK0); c.lineTo(ax+aw*1.25, skB(.5)-1); c.quadraticCurveTo(ax, skB(.5)+.8, ax-aw*1.25, skB(.5)-1); c.lineTo(ax-aw*.8, SK0); c.closePath(); }, w, [ax, (BY+skB(.5))/2, 8], {flat:true}); // 하얀 앞치마 (가슴받이 + 넓은 치마)
      ruffle(d, ax-aw*1.25, ax+aw*1.25, skB(.5)-.6, w, .8); ruffle(d, ax-aw*.7, ax+aw*.7, BY+3, w, .65); // 앞치마 레이스
      d.rr(ax-aw*.85, SK0-.6, aw*1.7, 1.2, .6, p, {flat:true, noShadow:true}); // 허리 리본띠
      if (!g.side){ d.shape(c=>{ c.beginPath(); c.moveTo(0,SK0+3.2); c.bezierCurveTo(-2.2,SK0+1.4,-1.6,SK0+.3,0,SK0+1.4); c.bezierCurveTo(1.6,SK0+.3,2.2,SK0+1.4,0,SK0+3.2); c.closePath(); }, p, [0,SK0+2,2], ff); // 하트 주머니
        collar(d,g,w); for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(0,BY+1.6); c.lineTo(sx*2.6,BY+.4); c.lineTo(sx*2.6,BY+2.8); c.closePath(); }, p, [0,BY+1.6,2], ff); d.circle(0,BY+1.6,.75,'#ff6f99',ff); } } // 목 리본
    bigSleeves(d,g,k,w); }, // 봉긋한 소매 + 흰 커프스
    over:(d,g)=>{ const w='#fffaf2', y = HY-R*1.02; if (g.up){ d.rr(-R*.75, y-1.4, R*1.5, 3, 1.5, w); for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(0,SK0); c.quadraticCurveTo(sx*4.6,SK0-4,sx*5.2,SK0+.4); c.quadraticCurveTo(sx*3.4,SK0+1.6,0,SK0); c.closePath(); }, w, [sx*2.6,SK0,3]); for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(sx*.6,SK0+.6); c.quadraticCurveTo(sx*1.8,SK0+5,sx*3.4,SK0+6.6); c.lineTo(sx*1.6,SK0+6.8); c.quadraticCurveTo(sx*.8,SK0+4,sx*.2,SK0+.8); c.closePath(); }, w, [sx*1.6,SK0+3.6,3]); d.circle(0,SK0+.2,1.4,w); return; } /* 뒤: 머리띠 + 머리카락 위로 보이는 큰 앞치마 리본 */ const x0 = g.side ? -R*.55 : -R*.82, x1 = g.side ? R*.75 : R*.82; // 머리 위 레이스 머리띠 (카츄샤)
      d.shape(c=>{ c.beginPath(); c.moveTo(x0, y+1.4); c.quadraticCurveTo((x0+x1)/2, y-2.6, x1, y+1.4); c.quadraticCurveTo((x0+x1)/2, y-.6, x0, y+1.4); c.closePath(); }, w, [(x0+x1)/2, y, 5]);
      for (let i = 0; i <= 9; i++){ const t = i/9, x = x0 + (x1-x0)*t, yy = y + 1.4 - Math.sin(t*Math.PI)*3.4; d.circle(x, yy-1.1, 1.6, w, {noShadow:true}); } d.line(c=>{ c.moveTo(x0+.6, y+.9); c.quadraticCurveTo((x0+x1)/2, y-1.6, x1-.6, y+.9); }, '#ff8fb0', .5); } },
  s27:{excl:1, name:'구름 잠옷', price:276000, draw:(d,g)=>{ const b='#b9dcf7'; torso(d,g,b); pants(d,g,b,.5); legs(d,g,b); longArms(d,g,b); if(!g.up){ cloud(d,-2.6,BY+5,1.8,'#fffaf2'); cloud(d,3,BY+10,1.6,'#fffaf2'); for (const f of feet(g)) cloud(d,f.x,-5-f.lift,1.1,'#fffaf2'); d.dot(4,BY+4,.5,'#ffe08a'); d.dot(-3.8,BY+11,.45,'#ffe08a'); } else cloud(d,0,BY+7,2.6,'#fffaf2'); }},
  s28:{excl:1, name:'꿀벌 원피스', price:262000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#ffd45a'); if(!g.up) for (const y of [BY+5,BY+9.4,BY+15]) d.rr(-g.bw*.48,y,g.bw*.96,1.8,.9,'#4a3a3a',{flat:true, noShadow:true}); else { g.c.save(); g.c.globalAlpha=.85; for (const sx of [-1,1]){ d.ell(sx*3.4,BY+3,3.4,2.4,'#f4fbff',{flat:true}); d.ell(sx*3,BY+6.4,2.4,1.7,'#eef8ff',{flat:true}); } g.c.restore(); } sleeves(d,g,'#ffd45a'); hands(d,g); for (const sx of (g.side?[.3]:[-1,1])){ d.line(k=>{ k.moveTo(sx*3,HY-R*.9); k.quadraticCurveTo(sx*4,HY-R*1.25,sx*5,HY-R*1.35); }, '#4a3a3a', .6); d.circle(sx*5,HY-R*1.35,1.1,'#4a3a3a',{noShadow:true}); } }},
  s29:{excl:1, name:'개구리 우비', price:252000, draw:(d,g)=>{ const gr='#8fd47a'; legs(d,g,g.sk); d.ell(0, HY-1, R*1.32, R*1.22, gr); d.rr(-g.bw/2-.8, BY-.5, g.bw+1.6, BH*.8, 5, gr); for (const sx of (g.side?[.5]:[-1,1])){ d.circle(sx*R*.62,HY-R*1.12,3.3,gr); d.circle(sx*R*.62,HY-R*1.1,2.2,'#fffaf2',{flat:true, noShadow:true}); if(!g.up) d.dot(sx*R*.62,HY-R*1.06,1.1,'#3a2430'); } if(!g.up){ d.line(k=>{ k.moveTo(0,BY+1); k.lineTo(0,BY+BH*.78); }, '#6fb85c', .8, .9); for (const y of [4,8,12]) d.dot(1.4,BY+y,.6,'#ffe08a'); } longArms(d,g,gr); }},
  s30:{excl:1, name:'마카롱 파자마', price:268000, draw:(d,g)=>{ const cs=['#ffc9d6','#c8f0dc','#d9c8f5','#fff0b8']; torso(d,g,'#fffaf2'); pants(d,g,'#fffaf2',.5); legs(d,g,'#ffc9d6'); longArms(d,g,'#d9c8f5'); cs.forEach((c,i)=>d.rr(-g.bw/2+.3,BY+1+i*3.1,g.bw-.6,1.7,.8,c,{flat:true, noShadow:true})); collar(d,g,'#ffc9d6'); if(!g.up) for (const f of feet(g)) for (const y of [-7,-4.4,-1.8]) d.rr(f.x-2,y-f.lift,4,.9,.45,'#fffaf2',{flat:true, noShadow:true}); }},
  s31:{excl:1, name:'벚꽃 원피스', price:242000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#ffd0dc','#fffaf2'); if(!g.up) for (const [px,py] of [[-3.6,BY+4],[3,BY+7],[-1,BY+15],[4.4,BY+17],[-5,BY+18]]) petal(d,px,py,.55,'#fffaf2','#ff9fbe'); collar(d,g,'#fffaf2'); sleeves(d,g,'#ffd0dc'); hands(d,g); }},
  s32:{excl:1, name:'체크 멜빵 스커트', price:236000, draw:(d,g)=>{ legs(d,g,g.sk); torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); skirt(d,g,'#d9506a',1.25,.45); checks(d,g,'#f6c7d2',SK0+2.4,skB(.45)-.6,3.2); if(!g.up){ d.rr(-4.8,BY,1.7,BH*.58,.8,'#d9506a',{flat:true}); d.rr(3.1,BY,1.7,BH*.58,.8,'#d9506a',{flat:true}); d.dot(-3.95,BY+BH*.5,.6,'#ffe08a'); d.dot(3.95,BY+BH*.5,.6,'#ffe08a'); } else d.line(k=>{ k.moveTo(-4,BY); k.lineTo(4,BY+11); k.moveTo(4,BY); k.lineTo(-4,BY+11); }, '#d9506a', 1.5); sleeves(d,g,'#fffaf2'); hands(d,g); }},
  s33:{excl:1, name:'아이돌 무대복', price:356000, draw:(d,g)=>{ const gd='#f3c64f'; legs(d,g,g.sk); skirt(d,g,'#3e4a86',1.3,.42); pleats(d,g,'#2f3a70',.42,3); if(!g.up) d.rr(-g.bw*.62,skB(.42)-1.4,g.bw*1.24,1,.5,gd,ff); torso(d,g,'#fffaf2'); if(!g.up){ d.line(k=>{ k.moveTo(-2.6,BY+.6); k.lineTo(-2.6,BY+BH*.6); k.moveTo(2.6,BY+.6); k.lineTo(2.6,BY+BH*.6); }, gd, .9, .95); for (const y of [4,7.5,11]){ d.dot(-1.2,BY+y,.55,gd); d.dot(1.2,BY+y,.55,gd); } d.dot(-4.6,BY+3,.5,'#fff',.9); d.dot(5,BY+9,.45,'#fff',.9); } for (const sx of (g.side?[1]:[-1,1])) d.rr(sx*(g.bw/2+.4)-2.2,BY-1,4.4,2,1,gd); sleeves(d,g,'#fffaf2'); hands(d,g); }},
  s34:{excl:1, name:'왕자님 옷', price:388000, draw:(d,g)=>{ const gd='#f3c64f', nv='#2f3f7a'; pants(d,g,'#f6f2ea'); legs(d,g,'#f6f2ea'); torso(d,g,nv); if(!g.up){ for (const y of [3.5,6.5,9.5]){ d.dot(-2,BY+y,.6,gd); d.dot(2,BY+y,.6,gd); } d.line(k=>{ k.moveTo(-g.bw/2+1,BY+1); k.lineTo(g.bw/2-1,BY+BH*.6); }, '#e0505a', 1.6, .85); collar(d,g,'#fffaf2'); } d.rr(-g.bw/2,BY+BH*.58,g.bw,1.2,.6,gd,ff); for (const sx of (g.side?[1]:[-1,1])){ d.rr(sx*(g.bw/2+.6)-2.4,BY-1.2,4.8,2.2,1.1,gd); d.line(k=>{ for (let i=-1;i<=1;i++){ k.moveTo(sx*(g.bw/2+.6)+i*1.4,BY+1); k.lineTo(sx*(g.bw/2+.6)+i*1.4,BY+2.4); } }, gd, .5, .9); } sleeves(d,g,nv); hands(d,g); }},
  s35:{excl:1, name:'공주 드레스', price:412000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#ffb3cd',1.8,.66); g.c.save(); g.c.globalAlpha=.85; skirt(d,g,'#ffd2e0',1.55,.52); g.c.restore(); torso(d,g,'#ffb3cd'); d.rr(-g.bw*.44,BY+BH*.52,g.bw*.88,1.4,.7,'#f3c64f',ff); if(!g.up){ ruffle(d,-g.bw*.8,g.bw*.8,skB(.66)-.3,'#fffaf2',.8); d.dot(0,BY+2.4,1,'#ff6f9f'); d.dot(-.3,BY+2.1,.35,'#fff',.9); for (const [px,py] of [[-5,-6],[0,-4],[5,-6.5],[-2.5,-8.5],[3,-9]]) d.dot(px,py,.45,'#fff',.9); } if (!g.side) d.ell(-g.bw/2-1.4,BY+BH*.2,3.9,3.6,'#ffd2e0'); d.ell(g.bw/2+1.4,BY+BH*.2,3.9,3.6,'#ffd2e0'); hands(d,g); }},
  s36:{excl:1, name:'펭귄 잠옷', price:302000, draw:(d,g)=>{ const k='#3f4660'; hoodBack(d,k); torso(d,g,k); pants(d,g,k,.5); legs(d,g,k); longArms(d,g,k); if(!g.up){ d.ell(0,BY+7,4.6,5.6,'#fffaf2',{flat:true}); } for (const sx of (g.side?[.5]:[-1,1])){ d.circle(sx*R*.5,HY-R*1.24,2.8,'#fffaf2',{noShadow:true}); if(!g.up) d.dot(sx*R*.5,HY-R*1.2,1.2,'#2b2228'); } if(!g.up) d.ell(g.side?R*.75:0,HY-R*1.08,1.8,1.1,'#ffa94d',{noShadow:true}); }},
  s37:{excl:1, name:'여우 잠옷', price:306000, draw:(d,g)=>{ const o='#f2944a'; if (g.side || g.up){ const tx = g.up ? 0 : -g.bw/2-4; d.ell(tx, BY+12, g.up?4.6:3.6, 6.2, o); d.ell(tx, BY+17, g.up?2.8:2.2, 2.4, '#fffaf2'); } hoodBack(d,o); for (const sx of (g.side?[-.2]:[-1,1])){ d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.4,HY-R*1.1); c.lineTo(sx*R*.85,HY-R*1.75); c.lineTo(sx*R*1.12,HY-R*.9); c.closePath(); }, o, [sx*R*.8,HY-R*1.3,4]); d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.58,HY-R*1.12); c.lineTo(sx*R*.85,HY-R*1.55); c.lineTo(sx*R*1.0,HY-R*1.0); c.closePath(); }, '#fff0e0', [sx*R*.8,HY-R*1.2,2], ff); } torso(d,g,o); pants(d,g,o,.5); legs(d,g,o); longArms(d,g,o); if(!g.up) d.ell(0,BY+7,4,5,'#fff0e0',{flat:true}); }},
  s38:{excl:1, name:'해적 옷', price:296000, draw:(d,g)=>{ pants(d,g,'#7a5640'); legs(d,g,'#7a5640'); torso(d,g,'#fffaf2'); stripe(d,g,'#3e4a6e',4); if(!g.up){ d.rr(-g.bw/2-.3,BY-.2,3.4,BH*.62,1.4,'#6b4a3c'); d.rr(g.bw/2-3.1,BY-.2,3.4,BH*.62,1.4,'#6b4a3c'); } else d.rr(-g.bw/2,BY,g.bw,BH*.62,3,'#6b4a3c'); d.rr(-g.bw/2,BY+BH*.5,g.bw,2.4,1.2,'#e0505a'); if(!g.up) d.rr(g.side?-g.bw/2-.6:2.6,BY+BH*.5+1.6,2,4,1,'#e0505a'); longArms(d,g,'#fffaf2'); }},
  s39:{excl:1, name:'탐정 코트', price:338000, draw:(d,g)=>{ const v='#d9b98a'; pants(d,g,'#5a4a40'); legs(d,g,'#5a4a40'); d.rr(-g.bw/2-.8, BY-.4, g.bw+1.6, BH*.86, 4.5, v); d.rr(-g.bw/2-.8,BY+BH*.5,g.bw+1.6,1.6,.8,'#b9966a'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-4,BY); c.lineTo(0,BY+6); c.lineTo(4,BY); c.lineTo(2.2,BY+5.4); c.lineTo(0,BY+7); c.lineTo(-2.2,BY+5.4); c.closePath(); }, '#c9a676', [0,BY+3,4], {flat:true}); d.line(k=>{ k.moveTo(0,BY+7); k.lineTo(0,BY+BH*.84); }, '#b9966a', .6, .8); for (const y of [9,13]){ d.dot(-1.6,BY+y,.6,'#6b4a3c'); d.dot(1.6,BY+y,.6,'#6b4a3c'); } d.rr(-.9,BY+BH*.5-.2,1.8,2,.4,'#e8c26a',ff); } longArms(d,g,v); }},
  s40:{excl:1, name:'발레리나 옷', price:286000, draw:(d,g)=>{ legs(d,g,'#ffe0e8'); torso(d,g,'#d9c8f5'); g.c.save(); g.c.globalAlpha=.8; skirt(d,g,'#efe6ff',1.95,.28); skirt(d,g,'#f7f2ff',1.7,.22); g.c.restore(); if(!g.up){ d.ell(0,BY+1.6,1.6,1,'#ff9fbe',ff); for (const [px,py] of [[-6,SK0+2.4],[0,SK0+3],[6,SK0+2]]) d.dot(px,py,.45,'#fff',.95); } bareArms(d,g); }},
  s41:{excl:1, name:'판다 잠옷', price:302000, draw:(d,g)=>{ const w='#f6f4f0', k='#3a3640'; hoodBack(d,w); for (const sx of (g.side?[-.2]:[-1,1])) d.circle(sx*R*.85,HY-R*1.1,3.6,k); torso(d,g,w); pants(d,g,k,.5); legs(d,g,k); longArms(d,g,k); if(!g.up&&!g.side){ d.ell(-2.2,BY+6,1.6,1.9,k,ff); d.ell(2.2,BY+6,1.6,1.9,k,ff); d.dot(-2,BY+5.6,.55,'#fff'); d.dot(2.4,BY+5.6,.55,'#fff'); d.dot(0,BY+8,.6,k); } }},
  s42:{excl:1, name:'꽃집 앞치마 세트', price:248000, draw:(d,g)=>{ legs(d,g,g.sk); torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); skirt(d,g,'#e9d8b8',1.15,.5); if(!g.up){ d.rr(-4.2,BY+3,8.4,BH*.7,2,'#8fc48a',{flat:true}); d.rr(-4.6,BY,1.4,3.4,.7,'#8fc48a',ff); d.rr(3.2,BY,1.4,3.4,.7,'#8fc48a',ff); d.rr(-2.6,BY+10,5.2,3.4,1,'#7cb377',ff); petal(d,-1.4,BY+10.6,.5,'#ff8fb6'); petal(d,1.2,BY+10.2,.45,'#ffe08a','#ff9f4a'); } else { d.line(k=>{ k.moveTo(-4,BY); k.lineTo(4,BY+10); k.moveTo(4,BY); k.lineTo(-4,BY+10); }, '#8fc48a', 1.3); d.ell(-1.8,BY+BH*.56,2,1.3,'#8fc48a'); d.ell(1.8,BY+BH*.56,2,1.3,'#8fc48a'); } longArms(d,g,'#fffaf2'); }},
  s43:{excl:1, name:'스키복', price:318000, draw:(d,g)=>{ const v='#7cb7f0'; pants(d,g,v,.5); for (const f of feet(g)) d.rr(f.x-2.5,-8.8-f.lift,5,8.8,2,shade(v,f)); d.rr(-g.bw/2-1,BY-.6,g.bw+2,BH*.68,5.5,v); d.rr(-g.bw/2-.6,BY+4.4,g.bw+1.2,2.2,1,'#fffaf2',ff); d.rr(-g.bw/2-.6,BY+7,g.bw+1.2,1.2,.6,'#ff7a8a',ff); if(!g.up) d.line(k=>{ k.moveTo(0,BY); k.lineTo(0,BY+BH*.62); }, '#5f9bd6', .7, .9); d.rr(-3.6,BY-2,7.2,3,1.4,'#fffaf2'); if (!g.side) d.ell(-g.bw/2-2.2,BY+BH*.34,3.6,5,v); d.ell(g.bw/2+2.2,BY+BH*.34,3.6,5,v); mitts(d,g,'#ff7a8a'); }},
  s44:{excl:1, name:'레몬 썬드레스', price:238000, draw:(d,g)=>{ legs(d,g,g.sk); dress(d,g,'#fff3b0'); if(!g.up) for (const [px,py] of [[-3.6,BY+5],[3,BY+8],[-1,BY+15.5],[4.6,BY+17],[-5.2,BY+18]]){ d.ell(px,py,1.3,.95,'#ffd84d',ff); d.ell(px+1,py-.8,.7,.4,'#7cc97f',ff); } else { d.ell(-1.8,BY+BH*.56,2.2,1.4,'#fffaf2'); d.ell(1.8,BY+BH*.56,2.2,1.4,'#fffaf2'); } d.rr(-g.bw*.44,BY+BH*.54,g.bw*.88,1.1,.5,'#fffaf2',ff); bareArms(d,g); }},
  s45:{excl:1, name:'가을 니트 원피스', price:258000, draw:(d,g)=>{ const v='#b9835a'; legs(d,g,g.sk); dress(d,g,v); collar(d,g,'#fffaf2'); if(!g.up&&!g.side) d.line(k=>{ for (let i=-2;i<=2;i++){ k.moveTo(i*2.6,BY+3); k.lineTo(i*2.6,BY+BH*.6); } }, '#a5714a', .7, .7); if(!g.up) for (const y of [5,8]) d.dot(0,BY+y,.6,'#fffaf2'); longArms(d,g,v); }},
  s46:{excl:1, name:'별자리 망토', price:396000, draw:(d,g)=>{ const nv='#2a3466'; pants(d,g,nv); legs(d,g,nv); torso(d,g,'#fffaf2'); if (g.up){ d.rr(-g.bw/2-2.4,BY-.6,g.bw+4.8,BH*.82,4,nv); for (const [px,py,r] of [[-3,4,.8],[2.6,7,.9],[-1,11,.6],[4,12.6,.5],[-4.6,14,.55],[0,2.4,.5]]) d.dot(px,BY+py,r,'#ffe08a'); d.line(k=>{ k.moveTo(-3,BY+4); k.lineTo(-1,BY+11); k.lineTo(2.6,BY+7); }, '#ffe08a', .3, .6); } else { if(!g.side){ d.line(k=>{ k.moveTo(0,BY+3); k.lineTo(0,BY+BH*.6); }, '#e8e2f0', .7, .9); } capeSides(d,g,nv); d.dot(-g.bw/2-.8,BY+6,.5,'#ffe08a'); d.dot(g.bw/2+.8,BY+10,.5,'#ffe08a'); d.circle(0,BY+.6,1.5,'#f3c64f'); } sleeves(d,g,nv); hands(d,g); }},
  s47:{excl:1, name:'카우보이 세트', price:288000, draw:(d,g)=>{ pants(d,g,'#7d8ab0'); legs(d,g,'#7d8ab0'); torso(d,g,'#f3e3c4'); if(!g.up){ d.rr(-g.bw/2-.3,BY-.2,3.6,BH*.62,1.4,'#9a6a45'); d.rr(g.bw/2-3.3,BY-.2,3.6,BH*.62,1.4,'#9a6a45'); d.shape(c=>{ c.beginPath(); c.moveTo(-4.2,BY-.4); c.lineTo(4.2,BY-.4); c.lineTo(0,BY+4.6); c.closePath(); }, '#e0505a', [0,BY+1.5,4], {flat:true}); d.dot(-1.6,BY+.8,.35,'#fff'); d.dot(1.4,BY+1.6,.35,'#fff'); } else { d.rr(-g.bw/2,BY,g.bw,BH*.62,3,'#9a6a45'); d.shape(c=>{ c.beginPath(); c.moveTo(-4.2,BY-.4); c.lineTo(4.2,BY-.4); c.lineTo(0,BY+3.4); c.closePath(); }, '#e0505a', [0,BY+1,3], {flat:true}); } d.rr(-g.bw/2,BY+BH*.56,g.bw,1.6,.8,'#6b4a3c',ff); if(!g.up) d.rr(-1.3,BY+BH*.56-.3,2.6,2.2,.5,'#f3c64f',ff); longArms(d,g,'#f3e3c4'); }},
  s48:{excl:1, name:'유니콘 잠옷', price:328000, draw:(d,g)=>{ const w='#fff8fc'; hoodBack(d,w); const rb=['#ff9fb0','#ffd27a','#9fe0b0','#9fc8ff','#c9a6ff']; if (g.side || g.up) rb.forEach((c,i)=>d.circle(g.up?0:-R*1.05, HY-R*.95+i*3.2, 2.2, c, {noShadow:true})); d.shape(c=>{ c.beginPath(); c.moveTo(-2.2,HY-R*1.1); c.lineTo(g.side?2.6:0,HY-R*1.95); c.lineTo(2.2,HY-R*1.1); c.closePath(); }, '#f3c64f', [0,HY-R*1.4,4]); d.line(k=>{ for (const t of [.3,.55,.78]){ k.moveTo(-2.2*(1-t)-.4,HY-R*(1.1+.85*t)+.6); k.lineTo(2.2*(1-t)+.4,HY-R*(1.1+.85*t)-.4); } }, '#e0ad3a', .45, .8); torso(d,g,w); pants(d,g,w,.5); legs(d,g,'#ffd9e8'); longArms(d,g,w); if(!g.up){ d.ell(0,BY+6.5,3.8,4.6,'#ffe6f0',{flat:true}); d.dot(-1.2,BY+5.4,.5,'#c9a6ff'); d.dot(1.4,BY+7.6,.5,'#9fc8ff'); } }},
  s49:{excl:1, name:'치파오', price:328000, draw:(d,g)=>{ const r='#d9364a', gd='#f3c64f'; legs(d,g,g.sk); torso(d,g,r); skirt(d,g,r,1.0,.66); if(!g.up){ d.line(k=>{ k.moveTo(0,BY+.4); k.quadraticCurveTo(2,BY+2.4,g.bw/2-.8,BY+4.4); }, gd, .7, .95); for (const [x,y] of [[1.6,BY+2],[3.6,BY+3.4]]) d.dot(x,y,.55,gd); for (const [px,py] of [[-3.4,BY+7.6],[-1.4,BY+15.6],[3.6,BY+11]]) petal(d,px,py,.6,gd,'#fff3c4'); if(!g.side) d.line(k=>{ k.moveTo(g.bw*.4,SK0+6); k.lineTo(g.bw*.5,skB(.66)); }, '#a8283a', .7, .9); } mandarin(d,r,gd); capSleeve(d,g,r); }},
  s50:{excl:1, name:'여름 하복 (여)', price:226000, draw:(d,g)=>{ legs(d,g,g.sk); skirt(d,g,'#3e4a6e',1.2,.42); pleats(d,g,'#2f3a58',.42,2); torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); if(!g.up){ d.ell(-1.6,BY+2.4,1.7,1.1,'#3e4a86',ff); d.ell(1.6,BY+2.4,1.7,1.1,'#3e4a86',ff); d.dot(0,BY+2.4,.7,'#2f3a70'); if(!g.side) d.rr(-5.4,BY+5,3.6,1.3,.4,'#a9c7ef',ff); } capSleeve(d,g,'#fffaf2'); }},
  s51:{excl:1, name:'여름 하복 (남)', price:226000, draw:(d,g)=>{ pants(d,g,'#8a8f9e'); legs(d,g,'#8a8f9e'); torso(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); if(!g.up){ const x = g.side ? 2.2 : 0; d.shape(c=>{ c.beginPath(); c.moveTo(x-1.2,BY+.2); c.lineTo(x+1.2,BY+.2); c.lineTo(x+.7,BY+2); c.lineTo(x+1.5,BY+8.6); c.lineTo(x,BY+10); c.lineTo(x-1.5,BY+8.6); c.lineTo(x-.7,BY+2); c.closePath(); }, '#3e4a86', [x,BY+5,4], {flat:true}); if(!g.side) d.rr(-5.4,BY+5,3.6,1.3,.4,'#a9c7ef',ff); } d.rr(-g.bw/2,BY+BH*.6,g.bw,1.2,.6,'#3a3440',ff); capSleeve(d,g,'#fffaf2'); }},
  s52:{excl:1, name:'저승사자 옷', price:366000, draw:(d,g)=>{ const k='#25212b'; legs(d,g,k); robe(d,g,k); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-3.8,BY); c.lineTo(1.6,BY+6.6); c.lineTo(3.4,BY+6.6); c.lineTo(-1.6,BY); c.closePath(); }, '#fffaf2', [0,BY+3,3], {flat:true}); d.line(k2=>{ k2.moveTo(-g.bw/2+1,BY+BH*.56); k2.lineTo(g.bw/2-1,BY+BH*.56); }, '#3a3542', 1.2, .9); } bigSleeves(d,g,k,'#3a3542'); }},
  s53:{excl:1, name:'선비 도포', price:342000, draw:(d,g)=>{ const w='#f4f1ea'; legs(d,g,'#e9e3d4'); robe(d,g,w); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-3.8,BY); c.lineTo(1.6,BY+6.6); c.lineTo(3.4,BY+6.6); c.lineTo(-1.6,BY); c.closePath(); }, '#dfe6ee', [0,BY+3,3], {flat:true}); d.line(k=>{ k.moveTo(-g.bw/2+.6,BY+8); k.lineTo(g.bw/2-.6,BY+8); }, '#3e4a86', .9, .95); d.line(k=>{ k.moveTo(2.4,BY+8); k.lineTo(2,BY+14); k.moveTo(3.4,BY+8); k.lineTo(3.8,BY+13); }, '#3e4a86', .6, .9); } else d.line(k=>{ k.moveTo(-g.bw/2+.6,BY+8); k.lineTo(g.bw/2-.6,BY+8); }, '#3e4a86', .9, .95); bigSleeves(d,g,w,'#dfe6ee'); }},
  s54:{excl:1, name:'곤룡포', price:468000, draw:(d,g)=>{ const r='#c8343e', gd='#f3c64f'; legs(d,g,'#8a2a32'); robe(d,g,r,-2.6,.7); if(!g.up){ d.rr(-1.4,BY-1.8,2.8,2,1,'#fffaf2',ff); } const cy = BY+5.4; d.circle(0,cy,3.6,gd); d.circle(0,cy,2.8,'#d9505a',ff); cloud(d,0,cy+.2,1.5,gd); d.dot(-.9,cy-1.2,.35,gd); d.dot(1,cy-1.3,.35,gd); d.rr(-g.bw/2-.2,BY+BH*.56,g.bw+.4,1.8,.9,'#2f5446'); for (const x of [-4.4,-1.5,1.5,4.4]) d.dot(x,BY+BH*.56+.9,.55,gd); bigSleeves(d,g,r,'#a82a34'); }},
  s55:{excl:1, name:'아오자이', price:298000, draw:(d,g)=>{ const v='#9fd0f0'; pants(d,g,'#fffaf2'); for (const f of feet(g)) d.rr(f.x-2.8,-9-f.lift,5.6,9,1.8,shade('#fffaf2',f)); torso(d,g,v); if (!g.side){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.42,BY+BH*.55); c.lineTo(g.bw*.42,BY+BH*.55); c.lineTo(g.bw*.5,-4.2); c.quadraticCurveTo(0,-3,-g.bw*.5,-4.2); c.closePath(); }, v, [0,-8,6]); } else d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.4,BY+BH*.55); c.lineTo(g.bw*.4,BY+BH*.55); c.lineTo(g.bw*.62,-4.6); c.lineTo(g.bw*.2,-4); c.closePath(); }, v, [0,-8,6]); if(!g.up){ for (const [px,py] of [[-2.6,BY+5],[2.8,BY+9],[-1,-7],[2.6,-5.6]]) petal(d,px,py,.6,'#fffaf2','#ffb3cd'); d.line(k=>{ k.moveTo(0,BY+.4); k.quadraticCurveTo(2,BY+2.4,g.bw/2-.8,BY+4.4); }, '#7fb8e0', .6, .9); } mandarin(d,v,'#7fb8e0'); longArms(d,g,v); }},
  s56:{excl:1, name:'유카타', price:286000, draw:(d,g)=>{ const v='#3e4a86'; legs(d,g,g.sk); robe(d,g,v,-3,.62); if(!g.up){ d.line(k=>{ k.moveTo(-3.6,BY); k.lineTo(2.2,BY+8); k.moveTo(3.6,BY); k.lineTo(.4,BY+4.4); }, '#fffaf2', .9, .95); for (const [px,py] of [[-3.6,BY+12],[3,BY+15],[-1,BY+17.6],[4.2,BY+4]]) petal(d,px,py,.7,'#fffaf2','#ffb3cd'); } d.rr(-g.bw/2-.2,BY+BH*.44,g.bw+.4,3.4,1.2,'#ff9fbe'); d.rr(-g.bw/2-.2,BY+BH*.44+1.4,g.bw+.4,.7,.35,'#f3c64f',ff); if (g.up){ d.rr(-4.4,BY+BH*.38,8.8,4.6,1.6,'#ff9fbe'); d.rr(-1.4,BY+BH*.38-.4,2.8,5.4,1,'#f27aa0'); } bigSleeves(d,g,v,'#2f3a70'); }},
  s57:{excl:1, name:'경찰 제복', price:328000, draw:(d,g)=>{ const nv='#2f3f6a'; pants(d,g,nv); legs(d,g,nv); torso(d,g,nv); collar(d,g,'#a9c7ef'); if(!g.up){ d.rr(-.5,BY+2,1,6,.5,'#1f2a4a',ff); d.shape(c=>{ c.beginPath(); for (let i=0;i<10;i++){ const r = i%2 ? .8 : 1.8, a = -Math.PI/2 + i*Math.PI/5; c.lineTo(-3.6 + Math.cos(a)*r, BY+5 + Math.sin(a)*r); } c.closePath(); }, '#f3c64f', [-3.6,BY+5,2], ff); d.rr(1.6,BY+6,3.2,2.4,.6,'#26335a',ff); } for (const sx of (g.side?[1]:[-1,1])) d.rr(sx*(g.bw/2-.6)-1.8,BY-.4,3.6,1.4,.6,'#26335a',ff); d.rr(-g.bw/2,BY+BH*.58,g.bw,1.6,.8,'#1f1c24',ff); if(!g.up) d.rr(-1,BY+BH*.58-.2,2,2,.4,'#c9ced8',ff); longArms(d,g,nv); }},
  s58:{excl:1, name:'간호사복', price:262000, draw:(d,g)=>{ legs(d,g,'#fff6f6'); dress(d,g,'#fffaf2','#ffb3cd'); collar(d,g,'#ffd0dc'); if(!g.up&&!g.side){ d.rr(2.4,BY+4,3.2,1,.3,'#ff6f8f',ff); d.rr(3.5,BY+2.9,1,3.2,.3,'#ff6f8f',ff); } if(!g.up) d.rr(-g.bw*.44,BY+BH*.54,g.bw*.88,1,.5,'#ffb3cd',ff); capSleeve(d,g,'#fffaf2'); }},
  s59:{excl:1, name:'우주복', price:398000, draw:(d,g)=>{ const w='#f3f4f8'; g.c.save(); g.c.globalAlpha=.35; d.circle(0,HY+1,R*1.42,'#bfe4ff',{noShadow:true}); g.c.restore(); d.line(k=>{ k.arc(0,HY+1,R*1.42,0,7); }, '#ffffff', 1.4, .9); d.line(k=>{ k.arc(0,HY+1,R*1.32,Math.PI*1.15,Math.PI*1.45); }, '#ffffff', 1.6, .8); pants(d,g,w,.5); for (const f of feet(g)) d.rr(f.x-2.5,-8.8-f.lift,5,8.8,2,shade(w,f)); d.rr(-g.bw/2-1,BY-.6,g.bw+2,BH*.68,5.5,w); d.rr(-g.bw/2-1,BY+BH*.56,g.bw+2,1.4,.7,'#ff9f4a',ff); if(!g.up){ d.rr(-3.4,BY+3,6.8,4.6,1.2,'#c9ced8',ff); d.dot(-1.8,BY+4.6,.7,'#ff6f8f'); d.dot(0,BY+4.6,.7,'#ffe070'); d.dot(1.8,BY+4.6,.7,'#7cc8ff'); d.rr(-2.2,BY+6.2,4.4,.7,.3,'#7cc97f',ff); } else d.rr(-4,BY+1.6,8,8.6,2.4,'#d9dde6'); if (!g.side) d.ell(-g.bw/2-2.2,BY+BH*.34,3.6,5,w); d.ell(g.bw/2+2.2,BY+BH*.34,3.6,5,w); mitts(d,g,'#ff9f4a'); }},
  s60:{excl:1, name:'마법소녀 드레스', price:376000, draw:(d,g)=>{ legs(d,g,'#fffaf2'); skirt(d,g,'#ff9fc4',1.6,.5); g.c.save(); g.c.globalAlpha=.8; skirt(d,g,'#ffe0ec',1.4,.38); g.c.restore(); torso(d,g,'#ff9fc4'); collar(d,g,'#fffaf2'); if(!g.up){ for (const sx of [-1,1]) d.ell(sx*2.6,BY+4,2.8,1.9,'#e8364f',{flat:true}); d.circle(0,BY+4,1.4,'#f3c64f'); d.dot(0,BY+4,.6,'#fff8d0'); ruffle(d,-g.bw*.7,g.bw*.7,skB(.5)-.3,'#fffaf2',.75); } else { d.ell(-3,BY+BH*.54,3.4,2,'#e8364f'); d.ell(3,BY+BH*.54,3.4,2,'#e8364f'); d.rr(-2.2,BY+BH*.54,1.6,6,.8,'#e8364f'); d.rr(.6,BY+BH*.54,1.6,6,.8,'#e8364f'); } if (!g.side) d.ell(-g.bw/2-1.4,BY+BH*.2,3.9,3.6,'#ffe0ec'); d.ell(g.bw/2+1.4,BY+BH*.2,3.9,3.6,'#ffe0ec'); mitts(d,g,'#fffaf2'); }},
  s61:{excl:1, name:'뱀파이어 망토', price:384000, draw:(d,g)=>{ const k='#25212b', rd='#b8283a'; if (!g.up) for (const sx of (g.side?[-1]:[-1,1])) d.shape(c=>{ c.beginPath(); c.moveTo(sx*3,BY+.6); c.lineTo(sx*R*.95,BY-11); c.lineTo(sx*R*.62,BY-1); c.closePath(); }, k, [sx*7,BY-5,6]); pants(d,g,k); legs(d,g,k); torso(d,g,'#fffaf2'); if(!g.up){ d.ell(-1.4,BY+2,1.5,1,rd,ff); d.ell(1.4,BY+2,1.5,1,rd,ff); d.dot(0,BY+2,.6,rd); for (const y of [6,9]) d.dot(0,BY+y,.5,'#3a3440'); } if (g.up){ d.rr(-g.bw/2-2.6,BY-1,g.bw+5.2,BH*.86,4,k); d.shape(c=>{ c.beginPath(); c.moveTo(-8,BY-1); c.lineTo(-R*.95,BY-11); c.lineTo(0,BY-3); c.lineTo(R*.95,BY-11); c.lineTo(8,BY-1); c.closePath(); }, k, [0,BY-5,8]); } else { capeSides(d,g,k); if(!g.side){ d.rr(-g.bw/2-1.2,BY+1,1.2,BH*.7,.6,rd,ff); d.rr(g.bw/2,BY+1,1.2,BH*.7,.6,rd,ff); } } sleeves(d,g,k); hands(d,g); }},
  s62:{excl:1, name:'턱시도', price:392000, draw:(d,g)=>{ const k='#25212b'; pants(d,g,k); legs(d,g,k); torso(d,g,k); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-3.4,BY); c.lineTo(0,BY+8); c.lineTo(3.4,BY); c.closePath(); }, '#fffaf2', [0,BY+3,3], {flat:true}); d.line(k2=>{ k2.moveTo(-3.6,BY+.2); k2.lineTo(-.6,BY+8.4); k2.moveTo(3.6,BY+.2); k2.lineTo(.6,BY+8.4); }, '#4a4452', 1.2, .9); d.ell(-1.6,BY+1.4,1.7,1.1,k,ff); d.ell(1.6,BY+1.4,1.7,1.1,k,ff); d.dot(0,BY+1.4,.6,k); for (const y of [4.6,6.6]) d.dot(0,BY+y,.4,'#3a3440'); d.dot(-4.6,BY+4,.7,'#ff8fb6'); } longArms(d,g,k); }},
  s63:{excl:1, name:'웨딩 드레스', price:468000, draw:(d,g)=>{ g.c.save(); g.c.globalAlpha=.6; d.ell(0,HY-2,R*1.38,R*1.25,'#ffffff',{noShadow:true}); d.rr(-R*1.2,HY,R*2.4,(BY+14)-HY,R*.9,'#ffffff',{noShadow:true}); g.c.restore(); legs(d,g,g.sk); skirt(d,g,'#fffaf2',1.8,.66); g.c.save(); g.c.globalAlpha=.8; skirt(d,g,'#ffffff',1.55,.5); g.c.restore(); torso(d,g,'#fffaf2'); if(!g.up){ ruffle(d,-g.bw*.8,g.bw*.8,skB(.66)-.3,'#f6eef2',.8); d.line(k=>{ for (let x=-g.bw*.4; x<=g.bw*.4; x+=1.5){ k.moveTo(x+.5,BY+1.4); k.arc(x,BY+1.4,.5,0,3.2); } }, '#e8d8e0', .35, .9); for (const [px,py] of [[-5,-6],[0,-4],[5,-6.5],[-2.5,-8.5],[3,-9]]) d.dot(px,py,.4,'#f3d27a',.9); } d.rr(-g.bw*.44,BY+BH*.52,g.bw*.88,1.2,.6,'#f6d9e2',ff); capSleeve(d,g,'#fffaf2'); }},
  s64:{excl:1, name:'오리 잠옷', price:302000, draw:(d,g)=>{ const y='#ffe27a'; hoodBack(d,y); d.ell(0,HY-R*1.15,R*.9,R*.5,y); torso(d,g,y); pants(d,g,y,.5); legs(d,g,y); longArms(d,g,y); if(!g.up) d.ell(0,BY+7,4,5,'#fffaf2',{flat:true}); for (const sx of (g.side?[.5]:[-1,1])){ d.circle(sx*R*.44,HY-R*1.4,2.4,'#fffaf2',{noShadow:true}); if(!g.up) d.dot(sx*R*.44,HY-R*1.37,1.1,'#2b2228'); } if(!g.up){ d.ell(g.side?R*.75:0,HY-R*1.2,g.side?3.4:4,1.7,'#ff9f4a'); d.line(k=>{ k.moveTo((g.side?R*.75:0)-3,HY-R*1.2); k.lineTo((g.side?R*.75:0)+3,HY-R*1.2); }, '#e07f2e', .5, .8); } else d.ell(0,BY+BH*.66,3,2,'#ffe27a'); }},
  s65:{excl:1, name:'상어 잠옷', price:306000, draw:(d,g)=>{ const b='#7f9fbf'; hoodBack(d,b); d.shape(c=>{ c.beginPath(); c.moveTo(-R*.3,HY-R*1.15); c.lineTo(g.side?-R*.5:R*.05,HY-R*1.85); c.lineTo(R*.45,HY-R*1.1); c.closePath(); }, b, [0,HY-R*1.4,5]); if(!g.up) for (const sx of (g.side?[1]:[-1,1])) for (let i=0;i<4;i++){ const x = sx*R*1.12, yy = HY - R*.3 + i*3.4; d.shape(c=>{ c.beginPath(); c.moveTo(x, yy); c.lineTo(x - sx*2.4, yy + 1.4); c.lineTo(x, yy + 2.8); c.closePath(); }, '#fffaf2', [x,yy+1.4,2], ff); } torso(d,g,b); pants(d,g,b,.5); legs(d,g,b); longArms(d,g,b); if(!g.up) d.ell(0,BY+7,4,5,'#eef3f8',{flat:true}); if (g.up || g.side){ const tx = g.up ? 0 : -g.bw/2-3; d.shape(c=>{ c.beginPath(); c.moveTo(tx-2,BY+12); c.lineTo(tx+(g.up?0:-3),BY+19); c.lineTo(tx+2.6,BY+13); c.closePath(); }, b, [tx,BY+15,3]); } }},
  s66:{excl:1, name:'서커스 단장', price:356000, draw:(d,g)=>{ const r='#d9364a', gd='#f3c64f'; pants(d,g,'#fffaf2'); legs(d,g,'#fffaf2'); if (g.up){ d.rr(-g.bw/2+.6,BY+BH*.5,3.4,BH*.5,1.6,r); d.rr(g.bw/2-4,BY+BH*.5,3.4,BH*.5,1.6,r); } torso(d,g,r); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-3.4,BY); c.lineTo(0,BY+7); c.lineTo(3.4,BY); c.closePath(); }, '#fffaf2', [0,BY+3,3], {flat:true}); d.line(k=>{ k.moveTo(-3.6,BY+.2); k.lineTo(-.6,BY+7.4); k.moveTo(3.6,BY+.2); k.lineTo(.6,BY+7.4); }, gd, 1, .95); for (const y of [8.6,11]){ d.dot(-2,BY+y,.6,gd); d.dot(2,BY+y,.6,gd); } d.ell(-1.4,BY+1.4,1.5,1,'#25212b',ff); d.ell(1.4,BY+1.4,1.5,1,'#25212b',ff); } for (const sx of (g.side?[1]:[-1,1])){ d.rr(sx*(g.bw/2+.4)-2.2,BY-1,4.4,2,1,gd); } sleeves(d,g,r); hands(d,g); }},
  s67:{excl:1, name:'축구 유니폼', price:236000, draw:(d,g)=>{ const v='#7cb7f0'; pants(d,g,'#fffaf2'); legs(d,g,g.sk); shorts(d,g,'#fffaf2',3.4); for (const f of feet(g)) d.rr(f.x-2.15,-4.6-f.lift,4.3,4.6,1.4,shade(v,f)); torso(d,g,v); d.line(k=>{ for (const x of [-4,0,4]){ k.moveTo(x,BY+1); k.lineTo(x,BY+BH*.6); } }, '#fffaf2', 1.2, .9); collar(d,g,'#fffaf2'); g.c.save(); g.c.font = 'bold 6px sans-serif'; g.c.textAlign = 'center'; g.c.fillStyle = '#2f3f6a'; if (g.up) g.c.fillText('10', 0, BY+10); else if (!g.side){ g.c.font = 'bold 3.4px sans-serif'; g.c.fillText('10', 3.6, BY+6); } g.c.restore(); capSleeve(d,g,v); }},
  s68:{excl:1, name:'요정 드레스', price:342000, draw:(d,g)=>{ for (const sx of (g.side?[-1]:[-1,1])){ g.c.save(); g.c.globalAlpha=.6; d.ell(sx*(g.up?4.6:g.bw/2+3.6),BY+1,4.2,5.6,'#d8fff0'); d.ell(sx*(g.up?3.6:g.bw/2+2.6),BY+7.4,3,3.6,'#e8fff6'); g.c.restore(); } legs(d,g,g.sk); const lv='#8fd68a'; for (let i=-3;i<=3;i++){ const x = i*2.4; d.shape(c=>{ c.beginPath(); c.moveTo(x-2,SK0); c.quadraticCurveTo(x-2.6,SK0+4,x,skB(.5)); c.quadraticCurveTo(x+2.6,SK0+4,x+2,SK0); c.closePath(); }, i%2 ? '#a8e0a0' : lv, [x,SK0+3,3]); } torso(d,g,'#bfe8c0'); if(!g.up){ petal(d,0,BY+2,.8,'#ffb3cd','#ffe08a'); } d.rr(-g.bw*.44,BY+BH*.52,g.bw*.88,1,.5,'#6fbf73',ff); bareArms(d,g); }},
  s69:{excl:1, name:'인어 드레스', price:388000, draw:(d,g)=>{ const t='#5fc8c0'; legs(d,g,t); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.42,SK0); c.lineTo(g.bw*.42,SK0); c.quadraticCurveTo(g.bw*.4,-6,g.bw*.24,-5); c.quadraticCurveTo(g.bw*.7,-1,g.bw*.78,0); c.quadraticCurveTo(0,1,-g.bw*.78,0); c.quadraticCurveTo(-g.bw*.7,-1,-g.bw*.24,-5); c.quadraticCurveTo(-g.bw*.4,-6,-g.bw*.42,SK0); c.closePath(); }, t, [0,-5,8]); if(!g.up) d.line(k=>{ for (let y=SK0+2;y<-6;y+=2.2) for (let x=-4;x<=4;x+=2.4){ k.moveTo(x+1,y); k.arc(x,y,1,0,3.2); } }, '#8fe0d8', .4, .8); torso(d,g,'#9fe0d8'); if(!g.up){ for (const sx of [-1,1]){ d.ell(sx*2.6,BY+3.4,2.6,2.2,'#ffc4d6'); d.line(k=>{ for (const a of [-.6,0,.6]){ k.moveTo(sx*2.6,BY+5.2); k.lineTo(sx*2.6+Math.sin(a)*2.2,BY+5.2-Math.cos(a)*2.2); } }, '#ff9fbe', .35, .9); } for (const [px,py] of [[-3,-10],[2,-12],[0,-8]]) d.dot(px,py,.5,'#fffaf2',.9); } bareArms(d,g); }},
  s70:{excl:1, name:'유령 잠옷', price:288000, draw:(d,g)=>{ const w='#fbfbff'; hoodBack(d,w); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2-1,BY+1); c.quadraticCurveTo(-g.bw/2-1,BY-.6,-g.bw/2+2,BY-.6); c.lineTo(g.bw/2-2,BY-.6); c.quadraticCurveTo(g.bw/2+1,BY-.6,g.bw/2+1,BY+1); c.lineTo(g.bw*.66,-4); for (let i=0;i<5;i++){ const x0 = g.bw*.66 - i*(g.bw*1.32/5); c.quadraticCurveTo(x0 - g.bw*.13, -1.6, x0 - g.bw*.264, -4); } c.closePath(); }, w, [0,BY+10,BH*.6]); legs(d,g,'#e8e8f4'); if(!g.up&&!g.side){ d.ell(-2.2,BY+7,.9,1.3,'#d0d4e8',ff); d.ell(2.2,BY+7,.9,1.3,'#d0d4e8',ff); d.ell(0,BY+10,1.2,.9,'#d0d4e8',ff); } if (!g.side) d.ell(-g.bw/2-2,BY+BH*.38,3,4.2,w); d.ell(g.bw/2+2,BY+BH*.38,3,4.2,w); }},
  // ===== 보물 지도 전용 세트옷 5 벌 (tmap: 그 구역 지도를 다 맞추고 파야 나와요) =====
  s71:{tmap:'village', excl:1, name:'생크림 파티시에', price:0, draw:(d,g)=>{ const w='#fffaf2', p='#ff8fb0'; pants(d,g,'#f6c6d3'); legs(d,g,'#f6c6d3'); torso(d,g,w); ruffle(d,-g.bw/2+.8,g.bw/2-.8,BY+BH*.64,'#ffe0ea',1); if(!g.up){ for (const sx of [-1,1]) for (const y of [4,7.6,11.2]) d.dot(sx*2.5,BY+y,.6,p); d.rr(-4.4,BY-.8,8.8,2.6,1.3,p); d.shape(c=>{ c.beginPath(); c.moveTo(1,BY+1.2); c.lineTo(3.8,BY+6.4); c.lineTo(1.2,BY+5.8); c.closePath(); }, p, [2,BY+3,2], ff); d.ell(-4.4,BY+BH*.5,1.7,1.2,'#e8364f',ff); d.ell(-4.4,BY+BH*.5-1.2,1.2,.5,'#5fae63',ff); } longArms(d,g,w); }},
  s72:{tmap:'seacave', excl:1, name:'해파리 드레스', price:0, draw:(d,g)=>{ const l='#c9b8f0', p='#ffb3e0'; legs(d,g,g.sk); g.c.save(); g.c.globalAlpha=.9; d.line(k=>{ for (let i=-4;i<=4;i++){ const x=i*1.7; k.moveTo(x,SK0+1); k.bezierCurveTo(x+1.6,SK0+5,x-1.6,SK0+9,x+.6,-3.4); } }, p, .9, .9); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.42,SK0); c.lineTo(g.bw*.42,SK0); c.quadraticCurveTo(g.bw*.75,SK0+3,g.bw*.7,SK0+5.2); for (let i=0;i<=6;i++){ const x = g.bw*.7 - i*g.bw*1.4/6; c.quadraticCurveTo(x+g.bw*.1, SK0+7, x, SK0+5.2); } c.quadraticCurveTo(-g.bw*.75,SK0+3,-g.bw*.42,SK0); c.closePath(); }, l, [0,SK0+3,8]); g.c.restore(); torso(d,g,l); if(!g.up){ ruffle(d,-4.4,4.4,BY+.4,'#fffaf2',.75); for (const [px,py] of [[-3,5],[3,6],[0,8.6]]) d.dot(px,BY+py,.75,'#fffaf2'); d.dot(-3.2,BY+4.6,.3,'#fff',.9); } bareArms(d,g); }},
  s73:{tmap:'bazaar', excl:1, name:'줄무늬 차양 원피스', price:0, draw:(d,g)=>{ const pk='#ff8fb6', w='#fffaf2', gd='#ffd23f'; legs(d,g,g.sk); torso(d,g,w); collar(d,g,'#ffe0ea'); const b = skB(.5); d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.42,SK0); c.lineTo(g.bw*.42,SK0); c.lineTo(g.bw*.66,b); for (let i=0;i<=6;i++){ const x = g.bw*.66 - i*g.bw*1.32/6; c.quadraticCurveTo(x + g.bw*.11, b+2.6, x, b); } c.closePath(); }, w, [0,(SK0+b)/2,8]); for (let i=-3;i<=3;i+=2) d.shape(c=>{ c.beginPath(); c.moveTo(i*g.bw*.12-g.bw*.06,SK0); c.lineTo(i*g.bw*.12+g.bw*.06,SK0); c.lineTo(i*g.bw*.19+g.bw*.095,b); c.quadraticCurveTo(i*g.bw*.19,b+2.6,i*g.bw*.19-g.bw*.095,b); c.closePath(); }, pk, [i*2,(SK0+b)/2,3], ff); d.rr(-g.bw/2,BY+BH*.5,g.bw,2,1,pk,ff); if(!g.up){ heart(d,0,BY+4.4,1.6,pk); d.ell(g.bw/2-1.6,BY+BH*.62,2,2.2,gd,ff); d.dot(g.bw/2-1.6,BY+BH*.62-1.6,.7,'#d09020'); d.dot(g.bw/2-2.1,BY+BH*.62+.2,.4,'#fff6c8',.9); } sleeves(d,g,'#ffd6e4'); hands(d,g); }},
  s74:{tmap:'cave', excl:1, name:'박쥐 망토', price:0, draw:(d,g)=>{ const k='#2e2838', pu='#7a4fa8'; legs(d,g,'#3a3046'); torso(d,g,pu); d.rr(-g.bw/2,BY+BH*.5,g.bw,1.6,.7,'#c9a6ff',ff); const wing = sx => d.shape(c=>{ c.beginPath(); c.moveTo(sx*(g.bw/2-1),BY); c.lineTo(sx*(g.bw/2+5),BY+1); c.lineTo(sx*(g.bw/2+5.4),BY+BH*.8); c.quadraticCurveTo(sx*(g.bw/2+3.6),BY+BH*.66,sx*(g.bw/2+2.4),BY+BH*.84); c.quadraticCurveTo(sx*(g.bw/2+.8),BY+BH*.7,sx*(g.bw/2-.6),BY+BH*.86); c.closePath(); }, k, [sx*(g.bw/2+2),BY+8,5]); if (g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2-4,BY); c.lineTo(g.bw/2+4,BY); c.lineTo(g.bw/2+5,BY+BH*.86); for (let i=0;i<=4;i++){ const x = g.bw/2+5 - (i+.5)*(g.bw+10)/5; c.quadraticCurveTo(x, BY+BH*.66, x-(g.bw+10)/10, BY+BH*.86); } c.closePath(); }, k, [0,BY+8,10]); } else for (const sx of (g.side?[-1]:[-1,1])) wing(sx); if(!g.up){ d.rr(-3.6,BY-1,7.2,2.4,1.2,k); d.dot(0,BY+.2,.9,'#ff5f7f'); } longArms(d,g,pu); }},
  s75:{tmap:'cave2', excl:1, name:'눈꽃 요정 원피스', price:0, draw:(d,g)=>{ const ic='#cfe9ff', w='#fffaf2', dp='#8fc4f0'; legs(d,g,g.sk); dress(d,g,ic); for (const f of feet(g)) d.rr(f.x-2.3,-4.6-f.lift,4.6,3.2,1.4,shade(w,f)); const b = skB(.5); fluffRow(d,-g.bw*.64,g.bw*.64,b-.4,1.2,w); fluffRow(d,-g.bw*.46,g.bw*.46,BY+.2,1,w); const flake = (x,y,r) => d.line(k=>{ for (let i=0;i<3;i++){ const a = i*Math.PI/3; k.moveTo(x-Math.cos(a)*r,y-Math.sin(a)*r); k.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r); } }, w, .55, .95); if(!g.up){ flake(0,BY+5.4,2.2); d.dot(0,BY+5.4,.6,dp); for (const [px,py,r] of [[-3.6,SK0+2.4,1.2],[3.4,SK0+3.6,1.3],[0,SK0+5,1],[-4.8,SK0+5.4,.9],[4.6,BY+9,.8]]) flake(px,py,r); } else for (const [px,py] of [[-3,BY+6],[3,BY+9],[0,SK0+3]]) flake(px,py,1.3); for (const sx of (g.side?[1]:[-1,1])) d.ell(sx*(g.bw/2+1.6),BY+BH*.3,3.6,4,ic); fluffRow(d,g.side?g.bw/2-1:-g.bw/2-3.6,g.side?g.bw/2+4:-g.bw/2+.6,BY+BH*.44,.9,w); if(!g.side) fluffRow(d,g.bw/2-.6,g.bw/2+3.6,BY+BH*.44,.9,w); hands(d,g); }},
};
// 모자: 머리 덮개보다 살짝 큰 돔이 머리를 감싸고, 챙·띠는 이마 높이에 걸쳐요
const capPath = (k, rx, top, bottom, sag=.08, cx=0) => { const cy = HY + R*CROWN.cy, ry = cy - (HY - R*top);
  k.beginPath(); k.moveTo(cx - R*rx, HY + R*bottom); k.lineTo(cx - R*rx, cy); k.ellipse(cx, cy, R*rx, ry, 0, Math.PI, 0); k.lineTo(cx + R*rx, HY + R*bottom);
  k.quadraticCurveTo(cx, HY + R*(bottom + sag), cx - R*rx, HY + R*bottom); k.closePath(); };
const cap = (d, col, rx, top, bottom, sag, o) => d.shape(k=>capPath(k, rx, top, bottom, sag), col, [0, HY - R*.7, R*rx], o);
export const HATS = {
  none:  {name:'없음', price:0, draw:()=>{}},
  straw: {name:'밀짚모자', price:70000, draw:(d,g)=>{ d.ell(g.side?R*.15:0, HY-R*.62, R*1.72, R*.34, '#f3d27a'); cap(d,'#f3d27a',1.36,1.5,-.6,.06); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.36,HY-R*.88); k.quadraticCurveTo(0,HY-R*.8,R*1.36,HY-R*.88); k.lineTo(R*1.36,HY-R*.66); k.quadraticCurveTo(0,HY-R*.58,-R*1.36,HY-R*.66); k.closePath(); }, '#ff7a9a', [0,HY-R*.75,R], {flat:true, noShadow:true}); }},
  beanie:{name:'비니', price:62000, draw:(d,g)=>{ cap(d,'#ff9f7a',1.36,1.42,-.3,.06); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.38,HY-R*.62); k.quadraticCurveTo(0,HY-R*.52,R*1.38,HY-R*.62); k.lineTo(R*1.38,HY-R*.26); k.quadraticCurveTo(0,HY-R*.16,-R*1.38,HY-R*.26); k.closePath(); }, '#ffb896', [0,HY-R*.45,R*1.3]); if (!g.up) d.line(k=>{ for (let i=-4;i<=4;i++){ k.moveTo(i*R*.3,HY-R*.58); k.lineTo(i*R*.3,HY-R*.24); } }, '#f09676', .6, .7); d.circle(g.side?-R*.2:0, HY-R*1.5, 3.8, '#fffaf2'); }},
  cap:   {name:'캡모자', price:76000, draw:(d,g)=>{ if (g.side) d.shape(k=>{ k.beginPath(); k.moveTo(R*.5,HY-R*.48); k.quadraticCurveTo(R*1.55,HY-R*.6,R*1.75,HY-R*.32); k.quadraticCurveTo(R*1.2,HY-R*.28,R*.5,HY-R*.3); k.closePath(); }, '#5b93e6', [R*1.1,HY-R*.4,R*.6]); cap(d,'#6fa8ff',1.34,1.4,-.42,.08); if (!g.up && !g.side) d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.05,HY-R*.44); k.quadraticCurveTo(0,HY-R*.36,R*1.05,HY-R*.44); k.quadraticCurveTo(R*.9,HY-R*.12,0,HY-R*.08); k.quadraticCurveTo(-R*.9,HY-R*.12,-R*1.05,HY-R*.44); k.closePath(); }, '#5b93e6', [0,HY-R*.3,R]); if (!g.side) d.line(k=>{ k.moveTo(0,HY-R*1.38); k.lineTo(0,HY-R*.5); }, '#5b93e6', .7, .6); d.dot(0,HY-R*1.4,1.4,'#5b93e6'); if (g.up) d.rr(-R*.35,HY-R*.62,R*.7,R*.2,R*.1,'#5b93e6',{flat:true}); }},
  pin:   {name:'리본핀', price:27000, draw:(d,g)=>{ if (g.up) return; const px = g.side ? R*.2 : R*.6, py = HY-R*.95; d.ell(px-2.4,py,2.6,1.8,'#ff86ad',{flat:true}); d.ell(px+2.4,py,2.6,1.8,'#ff86ad',{flat:true}); d.dot(px,py,1.1,'#ffd6e2'); }},
  beret: {name:'베레모', price:82000, draw:(d,g)=>{ const sx = g.up ? 1 : -1; d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*.22, HY-R*1.02, R*1.5, R*.62, sx*.12, 0, Math.PI*2); }, '#c9657a', [0,HY-R,R*1.4]); d.shape(k=>capPath(k,1.3,1.3,-.62,.06), '#b85568', [0,HY-R*.7,R*1.2], {flat:true}); d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*.22, HY-R*1.08, R*1.48, R*.5, sx*.12, Math.PI*1.05, Math.PI*1.95); k.ellipse(sx*R*.22, HY-R*1.02, R*1.5, R*.62, sx*.12, Math.PI*1.95, Math.PI*1.05, true); }, '#c9657a', [0,HY-R*1.2,R*1.4], {flat:true, noShadow:true}); d.dot(sx*R*.1,HY-R*1.6,1.3,'#b85568'); }},
  bucket:{name:'버킷햇', price:76000, draw:(d,g)=>{ cap(d,'#e6dcc3',1.37,1.45,-.6,.04); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.37,HY-R*.66); k.quadraticCurveTo(0,HY-R*.54,R*1.37,HY-R*.66); k.lineTo(R*1.62,HY-R*.3); k.quadraticCurveTo(0,HY-R*.06,-R*1.62,HY-R*.3); k.closePath(); }, '#d9ccae', [0,HY-R*.45,R*1.4]); d.line(k=>{ k.moveTo(-R*1.36,HY-R*.7); k.quadraticCurveTo(0,HY-R*.58,R*1.36,HY-R*.7); }, '#c9bb98', .7, .8); }},
  earmuff:{name:'귀도리', price:56000, draw:(d,g)=>{ d.line(k=>{ k.moveTo(-R*1.05,HY-R*.2); k.quadraticCurveTo(0,HY-R*1.55,R*1.05,HY-R*.2); }, '#8a7a86', 1.6, .9); d.circle(-R*1.12,HY+R*.05,4.2,'#fff0f5'); d.circle(R*1.12,HY+R*.05,4.2,'#fff0f5'); }},
  crown: {name:'왕관', price:0, need:'loot:m28', n:1, draw:(d,g)=>{ const y0 = HY-R*1.12; d.rr(-8,y0-2,16,5.5,2,'#ffd23f'); for (const cx of [-6,0,6]) d.shape(c=>{ c.beginPath(); c.moveTo(cx-3,y0-1.6); c.lineTo(cx,y0-R*.5); c.lineTo(cx+3,y0-1.6); c.closePath(); },'#ffd23f',[cx,y0-4,3],{flat:true}); for (const cx of [-6,0,6]) d.dot(cx,y0-R*.5,.9,'#ffe98a'); if (!g.up) d.dot(0,y0+.8,1.6,'#ff4f6d'); }},
  flower:{name:'꽃 화관', price:82000, need:'crop:c18', n:3, draw:(d,g)=>{ const cy = HY-R*.82, rx = R*1.3, ry = R*.36, cols = ['#ff8fc4','#ffe066','#ffffff','#c9a6ff'];
    d.line(k=>{ k.ellipse(0, cy, rx, ry, 0, 0, Math.PI*2); }, '#7fb36a', 1.1, .9);
    for (let i=0;i<14;i++){ const a = i/14*Math.PI*2, back = Math.sin(a) < 0; if (!back) continue; d.circle(Math.cos(a)*rx, cy+Math.sin(a)*ry, 2.1, cols[i%4], {flat:true}); }
    for (let i=0;i<14;i++){ const a = i/14*Math.PI*2; if (Math.sin(a) < 0) continue; d.circle(Math.cos(a)*rx, cy+Math.sin(a)*ry, 2.7, cols[i%4], {flat:true}); d.dot(Math.cos(a)*rx, cy+Math.sin(a)*ry, .8, '#ffe98a'); } }},
  witch: {name:'마법사 모자', price:152000, need:'loot:m16', n:2, draw:(d,g)=>{ d.ell(0, HY-R*.66, R*1.78, R*.36, '#5b4a8f'); d.shape(c=>{ c.beginPath(); c.moveTo(-R*1.34,HY-R*.7); c.quadraticCurveTo(-R*.8,HY-R*1.8,R*.3,HY-R*2.55); c.quadraticCurveTo(R*.45,HY-R*2.25,R*.38,HY-R*1.95); c.quadraticCurveTo(R*.95,HY-R*1.25,R*1.34,HY-R*.7); c.quadraticCurveTo(0,HY-R*.6,-R*1.34,HY-R*.7); c.closePath(); },'#6f5bb5',[0,HY-R*1.4,R*1.1]); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.26,HY-R*.94); k.quadraticCurveTo(0,HY-R*.86,R*1.26,HY-R*.94); k.lineTo(R*1.32,HY-R*.72); k.quadraticCurveTo(0,HY-R*.64,-R*1.32,HY-R*.72); k.closePath(); }, '#ffd23f', [0,HY-R*.8,R], {flat:true, noShadow:true}); if (!g.up) d.dot(0,HY-R*.82,1.4,'#fff6c8'); }},
  chef:  {name:'요리사 모자', price:80000, draw:(d,g)=>{ for (const [bx,by,br] of [[-.62,-1.42,.56],[.62,-1.42,.56],[0,-1.66,.66]]) d.circle(R*bx, HY+R*by, R*br, '#fffaf2'); cap(d,'#fffaf2',1.37,1.3,-.38,.05); d.line(k=>{ k.moveTo(-R*1.3,HY-R*.82); k.quadraticCurveTo(0,HY-R*.74,R*1.3,HY-R*.82); }, '#e8e0d6', .7, .8); }},
  santa: {name:'산타 모자', price:87000, draw:(d,g)=>{ const fx = g.up ? -1 : 1; d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.3,HY-R*.8); k.quadraticCurveTo(-R*.6,HY-R*1.9,fx*R*.7,HY-R*1.75); k.quadraticCurveTo(fx*R*1.4,HY-R*1.55,fx*R*1.55,HY-R*.95); k.lineTo(fx*R*1.3,HY-R*.95); k.quadraticCurveTo(R*.4,HY-R*.7,R*1.3,HY-R*.8); k.closePath(); }, '#e85d5d', [0,HY-R*1.2,R*1.3]); cap(d,'#e85d5d',1.36,1.3,-.5,.05); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.4,HY-R*.7); k.quadraticCurveTo(0,HY-R*.6,R*1.4,HY-R*.7); k.lineTo(R*1.4,HY-R*.32); k.quadraticCurveTo(0,HY-R*.2,-R*1.4,HY-R*.32); k.closePath(); }, '#fffaf2', [0,HY-R*.5,R*1.3]); d.circle(fx*R*1.55, HY-R*.82, 3.6, '#fffaf2'); }},
  fedora:{name:'페도라', price:108000, draw:(d,g)=>{ d.ell(0, HY-R*.62, R*1.78, R*.32, '#6b5a4c'); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.3,HY-R*.66); k.lineTo(-R*1.2,HY-R*1.35); k.quadraticCurveTo(-R*.6,HY-R*1.62,0,HY-R*1.38); k.quadraticCurveTo(R*.6,HY-R*1.62,R*1.2,HY-R*1.35); k.lineTo(R*1.3,HY-R*.66); k.quadraticCurveTo(0,HY-R*.56,-R*1.3,HY-R*.66); k.closePath(); }, '#7a6857', [0,HY-R*1.05,R*1.2]); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.28,HY-R*.92); k.quadraticCurveTo(0,HY-R*.84,R*1.28,HY-R*.92); k.lineTo(R*1.3,HY-R*.7); k.quadraticCurveTo(0,HY-R*.62,-R*1.3,HY-R*.7); k.closePath(); }, '#3a3040', [0,HY-R*.8,R], {flat:true, noShadow:true}); }},
  frog:  {name:'개구리 모자', price:95000, draw:(d,g)=>{ cap(d,'#9fd28a',1.38,1.42,-.3,.06); for (const ex of (g.side ? [.35] : [-.55,.55])){ d.circle(R*ex, HY-R*1.32, R*.4, '#9fd28a'); if (!g.up){ d.circle(R*ex, HY-R*1.34, R*.26, '#fffaf2', {flat:true}); d.dot(R*ex+.5, HY-R*1.34, R*.13, '#2b2228'); d.dot(R*ex+.1, HY-R*1.42, .5, '#fff'); } } if (!g.up && !g.side){ d.dot(-R*.95, HY-R*.62, .9, '#ff9fb0'); d.dot(R*.95, HY-R*.62, .9, '#ff9fb0'); d.line(k=>{ k.moveTo(-R*.5,HY-R*.62); k.quadraticCurveTo(0,HY-R*.48,R*.5,HY-R*.62); }, '#6fae5a', .8, .9); } }},
  trapper:{name:'귀달이 털모자', price:98000, draw:(d,g)=>{ for (const sx of (g.side ? [-.38] : [-1.28, 1.28])) d.ell(R*sx, HY+R*.12, R*.34, R*.58, '#c99a6e'); cap(d,'#c99a6e',1.38,1.42,-.42,.06); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.4,HY-R*.68); k.quadraticCurveTo(0,HY-R*.58,R*1.4,HY-R*.68); k.lineTo(R*1.4,HY-R*.36); k.quadraticCurveTo(0,HY-R*.24,-R*1.4,HY-R*.36); k.closePath(); }, '#fff6ea', [0,HY-R*.5,R*1.3]); for (const sx of (g.side ? [-.38] : [-1.28, 1.28])) d.ell(R*sx, HY+R*.54, R*.3, R*.18, '#fff6ea', {flat:true}); }},
  robot: {name:'오투모 모자', price:498000, main:'#fbfbfd', draw:(d,g)=>{ // 하얀 헬멧 + 파란 머리띠 + 노란 귀
    for (const sx of (g.side ? [-.36] : [-1.38, 1.38])){ d.ell(R*sx, HY-R*.15, R*.3, R*.42, '#ffb627'); if (!g.side) d.circle(R*sx*1.12, HY-R*.15, R*.12, '#ffb627'); }
    cap(d,'#fbfbfd',1.36,1.42,-.42,.06);
    d.line(k=>{ k.ellipse(0, HY-R*.48, R*1.36, R*.98, 0, Math.PI*1.08, Math.PI*1.92); }, '#3f6fe0', 3.2, .95);
    if (!g.up) d.rr(-R*.32, HY-R*1.46, R*.64, R*.24, R*.12, '#2b3a6a', {flat:true, noShadow:true});
    d.dot(-R*.55, HY-R*1.05, 2.4, '#ffffff', .8); }},
  bunnyh:{excl:1, name:'토끼 귀 비니', price:72000, draw:(d,g)=>{ for (const sx of (g.side?[-.15,.35]:[-1,1])){ const x = g.side ? R*sx : sx*R*.48; d.ell(x,HY-R*1.75,R*.26,R*.62,'#fffaf2'); d.ell(x,HY-R*1.72,R*.12,R*.44,'#ffc4d6',ff); } cap(d,'#fffaf2',1.36,1.42,-.34,.06); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.38,HY-R*.62); k.quadraticCurveTo(0,HY-R*.52,R*1.38,HY-R*.62); k.lineTo(R*1.38,HY-R*.32); k.quadraticCurveTo(0,HY-R*.22,-R*1.38,HY-R*.32); k.closePath(); }, '#ffd9e5', [0,HY-R*.45,R*1.3]); }},
  bearh:{excl:1, name:'곰돌이 비니', price:72000, draw:(d,g)=>{ const b='#c9a07a'; for (const sx of (g.side?[-.3]:[-1,1])){ d.circle(sx*R*.92,HY-R*1.22,R*.34,b); d.circle(sx*R*.92,HY-R*1.22,R*.17,'#ecd5b8',ff); } cap(d,b,1.36,1.42,-.34,.06); d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.38,HY-R*.62); k.quadraticCurveTo(0,HY-R*.52,R*1.38,HY-R*.62); k.lineTo(R*1.38,HY-R*.32); k.quadraticCurveTo(0,HY-R*.22,-R*1.38,HY-R*.32); k.closePath(); }, '#b48a64', [0,HY-R*.45,R*1.3]); }},
  sailorh:{excl:1, name:'세일러 모자', price:66000, draw:(d,g)=>{ cap(d,'#fffaf2',1.32,1.3,-.66,.05); d.rr(-R*1.32,HY-R*.9,R*2.64,R*.26,R*.1,'#3e4a86'); if (g.up) for (const sx of [-1,1]) d.rr(sx*2.4-1,HY-R*.7,2,R*.7,.8,'#3e4a86'); else if(!g.side) d.dot(R*.7,HY-R*.77,1,'#f3c64f'); }},
  tiara:{excl:1, name:'티아라', price:148000, draw:(d,g)=>{ const y0 = HY-R*1.02, w = g.side ? R*.7 : R*1.05; d.shape(c=>{ c.beginPath(); c.moveTo(-w,y0+1.4); for (let i=0;i<=8;i++){ const x = -w + i*w/4, up = i%2 ? 0 : (i===4 ? 6.2 : i===2||i===6 ? 4 : 2.2); c.lineTo(x, y0 - up); } c.lineTo(w,y0+1.4); c.quadraticCurveTo(0,y0+2.6,-w,y0+1.4); c.closePath(); }, '#dfe3ee', [0,y0-2,w]); d.dot(0,y0-3.6,1.3,'#ff6f9f'); d.dot(-w/2,y0-1.6,.9,'#7cc8ff'); d.dot(w/2,y0-1.6,.9,'#7cc8ff'); d.dot(-.4,y0-4.1,.4,'#fff',.9); }},
  berryh:{excl:1, name:'딸기 모자', price:78000, draw:(d,g)=>{ cap(d,'#f2556a',1.38,1.45,-.4,.06); for (const [x,y] of [[-.8,-.9],[-.3,-1.15],[.25,-.95],[.75,-1.1],[-.55,-.62],[.5,-.66],[0,-.78]]) d.dot(R*x,HY+R*y,.6,'#ffe9a8'); for (let i=0;i<5;i++){ const a = -Math.PI/2 + (i-2)*.5; d.ell(Math.cos(a)*R*.42, HY-R*1.42+Math.sin(a)*R*.1+R*.12, R*.26, R*.1, '#6fbf73', {noShadow:true}); } d.rr(-.6,HY-R*1.72,1.2,R*.3,.6,'#5aa35e'); }},
  bigbow:{excl:1, name:'큰 리본', price:52000, draw:(d,g)=>{ const x = g.side ? -R*.1 : 0, y = HY-R*1.18, p='#ff8fb6'; for (const sx of [-1,1]){ d.shape(c=>{ c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+sx*R*.5,y-R*.62,x+sx*R*.85,y-R*.3); c.quadraticCurveTo(x+sx*R*.95,y+R*.1,x+sx*R*.6,y+R*.22); c.quadraticCurveTo(x+sx*R*.3,y+R*.2,x,y); c.closePath(); }, p, [x+sx*R*.5,y-R*.1,R*.5]); } d.circle(x,y,R*.18,'#f2759b'); }},
  sunhat:{excl:1, name:'꽃 챙모자', price:94000, draw:(d,g)=>{ d.ell(g.side?R*.1:0, HY-R*.64, R*1.95, R*.38, '#f6ead2'); cap(d,'#f6ead2',1.3,1.42,-.62,.05); d.rr(-R*1.3,HY-R*.94,R*2.6,R*.24,R*.1,'#ff9fbe'); const fx = g.up ? -R*.9 : R*.85; petal(d,fx,HY-R*.84,1.4,'#fffaf2','#ffd84d'); petal(d,fx-R*.32,HY-R*.88,1.1,'#ffb3cd','#ff7fa8'); d.ell(fx+R*.25,HY-R*.76,1.6,.8,'#7cc97f',ff); }},
  tophat:{excl:1, name:'실크햇', price:132000, draw:(d,g)=>{ const k='#2f2a36'; d.ell(0, HY-R*.66, R*1.62, R*.3, k); d.rr(-R*.95,HY-R*2.2,R*1.9,R*1.56,R*.22,k); d.rr(-R*.95,HY-R*1.02,R*1.9,R*.26,R*.1,'#c9384f'); d.ell(0,HY-R*2.2,R*.95,R*.2,'#3d3746',{noShadow:true}); if(!g.up) d.line(k2=>{ k2.moveTo(-R*.6,HY-R*2); k2.lineTo(-R*.6,HY-R*1.2); }, '#5a5266', 1, .6); }},
  pirate:{excl:1, name:'해적 모자', price:118000, draw:(d,g)=>{ const k='#2f2a36'; cap(d,k,1.3,1.32,-.6,.05); d.shape(c=>{ c.beginPath(); c.moveTo(-R*1.75,HY-R*.6); c.quadraticCurveTo(-R*1.2,HY-R*1.75,0,HY-R*1.45); c.quadraticCurveTo(R*1.2,HY-R*1.75,R*1.75,HY-R*.6); c.quadraticCurveTo(0,HY-R*1.0,-R*1.75,HY-R*.6); c.closePath(); }, k, [0,HY-R*1.1,R*1.6]); d.line(k2=>{ k2.moveTo(-R*1.6,HY-R*.66); k2.quadraticCurveTo(-R*1.1,HY-R*1.6,0,HY-R*1.36); k2.quadraticCurveTo(R*1.1,HY-R*1.6,R*1.6,HY-R*.66); }, '#f3c64f', .8, .9); if(!g.up){ d.circle(0,HY-R*1.15,2.2,'#fffaf2',ff); d.dot(-.8,HY-R*1.17,.45,k); d.dot(.8,HY-R*1.17,.45,k); d.line(k2=>{ k2.moveTo(-2.6,HY-R*1.15+3.2); k2.lineTo(2.6,HY-R*1.15+1.4); k2.moveTo(2.6,HY-R*1.15+3.2); k2.lineTo(-2.6,HY-R*1.15+1.4); }, '#fffaf2', .7); } }},
  grad:{excl:1, name:'학사모', price:96000, draw:(d,g)=>{ const k='#2f2a36'; cap(d,k,1.3,1.26,-.62,.05); const y = HY-R*1.24; d.shape(c=>{ c.beginPath(); c.moveTo(-R*1.5,y); c.lineTo(0,y-R*.42); c.lineTo(R*1.5,y); c.lineTo(0,y+R*.42); c.closePath(); }, k, [0,y,R*1.5]); d.dot(0,y,.9,'#f3c64f'); d.line(k2=>{ k2.moveTo(0,y); k2.lineTo(R*1.05,y+R*.1); k2.lineTo(R*1.1,y+R*.65); }, '#f3c64f', .8); d.rr(R*1.1-1,y+R*.6,2,3.6,.8,'#f3c64f'); }},
  cowboy:{excl:1, name:'카우보이 모자', price:112000, draw:(d,g)=>{ const b='#a8744f'; d.shape(c=>{ c.beginPath(); c.moveTo(-R*1.9,HY-R*1.05); c.quadraticCurveTo(-R*1.6,HY-R*.5,0,HY-R*.56); c.quadraticCurveTo(R*1.6,HY-R*.5,R*1.9,HY-R*1.05); c.quadraticCurveTo(R*1.5,HY-R*.7,0,HY-R*.78); c.quadraticCurveTo(-R*1.5,HY-R*.7,-R*1.9,HY-R*1.05); c.closePath(); }, b, [0,HY-R*.7,R*1.8]); d.shape(c=>{ c.beginPath(); c.moveTo(-R*1.05,HY-R*.72); c.lineTo(-R*1.0,HY-R*1.6); c.quadraticCurveTo(-R*.5,HY-R*1.82,0,HY-R*1.55); c.quadraticCurveTo(R*.5,HY-R*1.82,R*1.0,HY-R*1.6); c.lineTo(R*1.05,HY-R*.72); c.closePath(); }, b, [0,HY-R*1.2,R]); d.rr(-R*1.04,HY-R*1.02,R*2.08,R*.2,R*.08,'#6b4a3c'); }},
  mushh:{excl:1, name:'버섯 모자', price:88000, draw:(d,g)=>{ d.shape(c=>{ c.beginPath(); c.moveTo(-R*1.72,HY-R*.5); c.bezierCurveTo(-R*1.7,HY-R*2.05,R*1.7,HY-R*2.05,R*1.72,HY-R*.5); c.quadraticCurveTo(0,HY-R*.25,-R*1.72,HY-R*.5); c.closePath(); }, '#e8505f', [0,HY-R*1.1,R*1.7]); for (const [x,y,r] of [[-.9,-1.0,.26],[.1,-1.55,.3],[.95,-.95,.22],[-.3,-.8,.16],[.55,-1.3,.14],[-1.2,-.62,.12]]) d.circle(R*x,HY+R*y,R*r,'#fffaf2',ff); }},
  halo:{excl:1, name:'천사 고리', price:126000, draw:(d,g)=>{ const y = HY-R*1.72; g.c.save(); g.c.globalAlpha=.35; d.line(k=>{ k.ellipse(0,y,R*.92,R*.26,0,0,7); }, '#fff3a0', 4.2); g.c.restore(); d.line(k=>{ k.ellipse(0,y,R*.88,R*.24,0,0,7); }, '#f3c64f', 1.8, .95); d.line(k=>{ k.ellipse(0,y-.3,R*.84,R*.2,0,Math.PI*1.1,Math.PI*1.6); }, '#fff8d0', .7, .9); }},
  devil:{excl:1, name:'악마 뿔', price:68000, draw:(d,g)=>{ d.line(k=>{ k.ellipse(0,HY-R*.35,R*1.12,R*.98,0,Math.PI*1.1,Math.PI*1.9); }, '#3a3040', 1.2, .9); for (const sx of (g.side?[-.1]:[-1,1])) d.shape(c=>{ const x = sx*R*.62; c.beginPath(); c.moveTo(x-R*.22,HY-R*1.12); c.quadraticCurveTo(x-sx*R*.05,HY-R*1.55,x+sx*R*.12,HY-R*1.72); c.quadraticCurveTo(x+sx*R*.05,HY-R*1.4,x+R*.24,HY-R*1.1); c.closePath(); }, '#e8445a', [sx*R*.62,HY-R*1.35,4]); }},
  party:{excl:1, name:'고깔 모자', price:58000, draw:(d,g)=>{ const tip = [R*.2, HY-R*2.15]; d.shape(c=>{ c.beginPath(); c.moveTo(-R*.68,HY-R*1.02); c.lineTo(tip[0],tip[1]); c.lineTo(R*.8,HY-R*1.06); c.quadraticCurveTo(0,HY-R*.9,-R*.68,HY-R*1.02); c.closePath(); }, '#7cbcff', [0,HY-R*1.5,R*.8]); g.c.save(); d.line(k=>{ for (const t of [.3,.6]){ k.moveTo(-R*.68+(tip[0]+R*.68)*t, HY-R*1.02+(tip[1]-HY+R*1.02)*t); k.lineTo(R*.8+(tip[0]-R*.8)*t, HY-R*1.06+(tip[1]-HY+R*1.06)*t); } }, '#ffe070', 1.6, .95); g.c.restore(); for (const x of [-.45,0,.4,.7]) d.dot(R*x,HY-R*1.0,.9,'#ff8fb6'); d.circle(tip[0],tip[1],2.2,'#ff8fb6'); }},
  gat:{excl:1, name:'갓', price:158000, draw:(d,g)=>{ const k='#25212b'; g.c.save(); g.c.globalAlpha=.88; d.ell(0, HY-R*.86, R*2.05, R*.36, k); g.c.restore(); d.line(k2=>{ k2.ellipse(0, HY-R*.86, R*2.05, R*.36, 0, 0, 7); }, '#3e3848', .7, .9); d.shape(c=>{ c.beginPath(); c.moveTo(-R*.62,HY-R*.9); c.lineTo(-R*.56,HY-R*1.95); c.quadraticCurveTo(0,HY-R*2.08,R*.56,HY-R*1.95); c.lineTo(R*.62,HY-R*.9); c.quadraticCurveTo(0,HY-R*.82,-R*.62,HY-R*.9); c.closePath(); }, k, [0,HY-R*1.4,R*.7]); d.rr(-R*.62,HY-R*1.08,R*1.24,R*.16,R*.06,'#3e3848',ff); if (!g.up){ for (const sx of (g.side ? [1] : [-1, 1])) for (let i=0;i<9;i++){ const t = i/8, x = sx*R*(g.side?.55:1.02) * (1 - t*.15), y = HY - R*.8 + t*R*1.62; d.dot(x, y, .75, i%2 ? '#f3c64f' : '#c9384f'); } } }},
  iksun:{excl:1, name:'익선관', price:188000, draw:(d,g)=>{ const k='#2f2a36'; for (const sx of (g.side ? [-.55] : [-1, 1])){ const x = g.side ? R*sx : sx*R*.55; d.ell(x, HY-R*1.62, R*.34, R*.5, k); d.ell(x, HY-R*1.62, R*.2, R*.34, '#3e3848', ff); } cap(d,k,1.32,1.4,-.58,.05); d.rr(-R*1.32,HY-R*.82,R*2.64,R*.18,R*.08,'#4a4452',ff); d.line(k2=>{ k2.moveTo(-R*.9,HY-R*1.25); k2.quadraticCurveTo(0,HY-R*1.45,R*.9,HY-R*1.25); }, '#4a4452', .7, .8); }},
  // ===== 보물 지도 전용 모자 5 개 =====
  tmbeach:{tmap:'beach', excl:1, name:'등대 모자', price:0, draw:(d,g)=>{ cap(d,'#2f4a7a',1.3,1.3,-.6,.05); d.rr(-R*1.32,HY-R*.82,R*2.64,R*.2,R*.08,'#f3c64f',ff); const top = HY-R*1.3; d.shape(c=>{ c.beginPath(); c.moveTo(-3.4,top+1); c.lineTo(-2.4,top-9); c.lineTo(2.4,top-9); c.lineTo(3.4,top+1); c.closePath(); }, '#fffaf2', [0,top-4,4]); for (const y of [-2,-6]) d.rr(-3.1,top+y-1,6.2,1.8,.4,'#e8505f',ff); d.circle(0,top-11,2.6,'#ffe07a'); d.dot(0,top-11,4.6,'rgba(255,230,120,.28)'); d.shape(c=>{ c.beginPath(); c.moveTo(-3,top-12.6); c.lineTo(0,top-16); c.lineTo(3,top-12.6); c.closePath(); }, '#e8505f', [0,top-14,3]); }},
  tmmeadow:{tmap:'meadow', excl:1, name:'해바라기 모자', price:0, draw:(d,g)=>{ for (let i=0;i<16;i++){ const a = Math.PI + i/15*Math.PI; { const px=Math.cos(a)*R*1.32, py=HY-R*.25+Math.sin(a)*R*1.25; d.shape(c=>{ c.beginPath(); c.ellipse(px,py,R*.32,R*.15,a,0,7); }, '#ffd23f', [px,py,R*.32]); } } cap(d,'#8a5a2a',1.3,1.36,-.6,.05); d.line(k=>{ for (let i=-3;i<=3;i++){ k.moveTo(i*R*.3-R*.12,HY-R*1.15); k.lineTo(i*R*.3+R*.12,HY-R*.75); } }, '#6a4220', .6, .7); }},
  tmforest:{tmap:'forest', excl:1, name:'도토리 모자', price:0, draw:(d,g)=>{ cap(d,'#a8743a',1.4,1.44,-.5,.05); d.line(k=>{ for (let i=-3;i<=3;i++){ k.moveTo(i*R*.3-R*.16,HY-R*1.25); k.lineTo(i*R*.3+R*.16,HY-R*.8); k.moveTo(i*R*.3+R*.16,HY-R*1.25); k.lineTo(i*R*.3-R*.16,HY-R*.8); } }, '#7a4a20', .5, .7); d.rr(-R*1.4,HY-R*.74,R*2.8,R*.2,R*.1,'#8a5a2a',ff); d.rr(-1,HY-R*1.6,2,R*.3,.8,'#6a4220'); d.shape(c=>{ c.beginPath(); c.ellipse(2.6,HY-R*1.55,2.6,1.2,-.5,0,7); }, '#7fbf6a', [2.6,HY-R*1.55,2.6]); }},
  tmminegate:{tmap:'minegate', excl:1, name:'헤드랜턴 헬멧', price:0, draw:(d,g)=>{ cap(d,'#f4cc30',1.38,1.5,-.6,.05); d.ell(g.side?R*.15:0,HY-R*.62,R*1.6,R*.26,'#d8a820'); d.line(k=>{ k.moveTo(0,HY-R*1.5); k.lineTo(0,HY-R*.7); }, '#d8a820', 1.2, .9); if(!g.up){ const x = g.side ? R*.95 : 0; d.rr(x-3,HY-R*1.22,6,4.4,1.2,'#3a3a40'); d.circle(x,HY-R*1.22+2.2,1.7,'#fff8c0',ff); d.dot(x,HY-R*1.22+2.2,4,'rgba(255,240,170,.3)'); } }},
  tmcave1:{tmap:'cave1', excl:1, name:'반딧불 버섯 머리띠', price:0, draw:(d,g)=>{ d.line(k=>{ k.ellipse(0,HY-R*.1,R*1.08,R*1.0,0,Math.PI*1.1,Math.PI*1.9); }, '#7ad8c8', 1.6, .95); const mush = (x,y,s,col,face) => { d.dot(x,y-s*2.6,s*3.4,'rgba(160,255,240,.2)'); d.rr(x-s*.9,y-s*1.6,s*1.8,s*2.2,s*.8,'#fffaf2'); d.shape(c=>{ c.beginPath(); c.moveTo(x-s*3,y-s*1.4); c.bezierCurveTo(x-s*3,y-s*4.8,x+s*3,y-s*4.8,x+s*3,y-s*1.4); c.quadraticCurveTo(x,y-s*.8,x-s*3,y-s*1.4); c.closePath(); }, col, [x,y-s*2.6,s*3]); for (const [dx,dy,r] of [[-1.3,-2.8,.55],[.9,-3.4,.5],[1.6,-2.1,.38]]) d.circle(x+dx*s,y+dy*s,r*s,'#eafffb',ff); if (face){ d.dot(x-s*.5,y-s*.5,s*.22,'#2b2228'); d.dot(x+s*.5,y-s*.5,s*.22,'#2b2228'); d.dot(x-s*1,y-s*.1,s*.25,'#ff9fb8',.7); d.dot(x+s*1,y-s*.1,s*.25,'#ff9fb8',.7); } }; if (g.side){ mush(-R*.15,HY-R*.95,2.3,'#6fd8c8',false); mush(R*.62,HY-R*.8,1.9,'#9fb8ff',true); return; } mush(-R*.6,HY-R*.88,2.3,'#6fd8c8',!g.up); mush(R*.66,HY-R*.82,1.9,'#9fb8ff',!g.up); for (const [x,y] of [[-R*1.1,HY-R*1.5],[R*1.15,HY-R*1.35],[0,HY-R*1.7]]){ d.dot(x,y,2.4,'rgba(220,255,140,.35)'); d.dot(x,y,.9,'#efffb0'); } }},
};
export const ACCS = {
  none:   {name:'없음', price:0, draw:()=>{}},
  glassR: {name:'동그란 안경', price:52000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.line(k=>{ k.arc(e,y,3.4,0,7); }, '#6e5260', 1.2, .9); if (!g.side) d.line(k=>{ k.moveTo(-3.1,y); k.lineTo(3.1,y); }, '#6e5260', 1, .9); }},
  glassS: {name:'네모 안경', price:52000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.line(k=>{ k.roundRect(e-3.4,y-2.8,6.8,5.6,1.5); }, '#4a3a44', 1.2, .9); if (!g.side) d.line(k=>{ k.moveTo(-3.1,y); k.lineTo(3.1,y); }, '#4a3a44', 1, .9); }},
  sun:    {name:'선글라스', price:75000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.ell(e,y,3.6,3,'#3a3040',{flat:true}); if (!g.side) d.line(k=>{ k.moveTo(-3,y); k.lineTo(3,y); }, '#3a3040', 1.2, .9); for (const e of ex) d.dot(e-1.2,y-1,.8,'#fff',.6); }},
  bowtie: {name:'리본 넥타이', price:40000, draw:(d,g)=>{ if (g.up) return; const y = BY+2.5; d.ell(-2.4,y,2.4,1.6,'#e85d7a',{flat:true}); d.ell(2.4,y,2.4,1.6,'#e85d7a',{flat:true}); d.dot(0,y,1,'#ff9fb8'); }},
  scarf:  {name:'목도리', price:69000, draw:(d,g)=>{ d.rr(-g.bw/2-1, BY-2, g.bw+2, 4.5, 2.2, '#f28c8c'); if (!g.up) d.rr(2, BY+1, 3.4, 7, 1.5, '#f28c8c'); }},
  starch: {name:'별 볼 스티커', price:25000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.5; for (const e of (g.side ? [R*.6] : [-R*.62, R*.62])) d.dot(e, y, 1.3, '#ffd23f'); }},
  neck:   {name:'목걸이', price:62000, draw:(d,g)=>{ if (g.up) return; d.line(k=>{ k.moveTo(-4, BY); k.quadraticCurveTo(0, BY+4.5, 4, BY); }, '#e8c26a', .9, .9); d.dot(0, BY+2.8, 1.1, '#ff6f9a'); }},
  bandage:{name:'코 반창고', price:20000, draw:(d,g)=>{ if (g.up) return; d.rr((g.side?R*.6:0)-2.4, HY+R*.42, 4.8, 1.8, .9, '#f6d9c2', {flat:true, noShadow:true}); d.dot((g.side?R*.6:0)-1.4, HY+R*.48, .35, '#d9b7a0'); d.dot((g.side?R*.6:0)+1.4, HY+R*.48, .35, '#d9b7a0'); }},
  headphone:{name:'헤드폰', price:99000, draw:(d,g)=>{ d.line(k=>{ k.moveTo(-R*1.1,HY-R*.1); k.quadraticCurveTo(0,HY-R*1.5,R*1.1,HY-R*.1); }, '#8a7a86', 1.6, .9); d.rr(-R*1.3,HY-R*.3,4.5,7,2,'#f6c6d3'); d.rr(R*1.3-4.5,HY-R*.3,4.5,7,2,'#f6c6d3'); }},
  earring:{name:'꽃 귀걸이', price:46000, draw:(d,g)=>{ if (g.up) return; for (const e of (g.side ? [R*1.15] : [-R*1.2, R*1.2])){ d.dot(e, HY+R*.35, 1.5, '#ff8fc4'); d.dot(e, HY+R*.35, .6, '#ffe066'); } }},
  heartsun:{name:'하트 선글라스', price:80000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.4,6.4]; for (const e of ex){ d.circle(e-1.4,y-.8,1.8,'#ff6f9a',{flat:true}); d.circle(e+1.4,y-.8,1.8,'#ff6f9a',{flat:true}); d.shape(c=>{ c.beginPath(); c.moveTo(e-3.1,y-.4); c.lineTo(e,y+3); c.lineTo(e+3.1,y-.4); c.closePath(); }, '#ff6f9a', [e,y,3], {flat:true, noShadow:true}); d.dot(e-1.6,y-1.4,.5,'#fff',.7); } if (!g.side) d.line(k=>{ k.moveTo(-3,y-.8); k.lineTo(3,y-.8); }, '#e85d7a', .9, .9); }},
  pearl:  {name:'진주 목걸이', price:70000, draw:(d,g)=>{ if (g.up) return; for (let i=0;i<=8;i++){ const t = i/8, px = -4.6+9.2*t, py = BY+.4+Math.sin(t*Math.PI)*3.6; d.dot(px, py, .75, '#fffaf2'); } }},
  backpack:{name:'작은 배낭', price:95000, draw:(d,g)=>{ if (g.up){ d.rr(-5.6,BY+1.4,11.2,11,3.4,'#f2b880'); d.rr(-3.6,BY+7,7.2,4.4,1.6,'#e4a466'); d.dot(0,BY+4,.7,'#8a5a3c'); } else if (g.side){ d.rr(-g.bw/2-3.6,BY+1.6,4.2,10,2,'#f2b880'); } else { d.line(k=>{ k.moveTo(-4.6,BY+.2); k.lineTo(-4.2,BY+BH*.5); k.moveTo(4.6,BY+.2); k.lineTo(4.2,BY+BH*.5); }, '#e4a466', 1.4, .95); } }},
  wings:  {name:'천사 날개', price:138000, draw:(d,g)=>{ const side = g.side ? [-1] : [-1,1]; for (const sx of side){ const ox = g.up ? sx*4 : sx*(g.bw/2+5.2); for (let i=0;i<4;i++) d.ell(ox+sx*i*1.3*(g.up?1:.7), BY-1.5+i*2.4, g.up?5.4-i*.8:4.2-i*.6, 2.3, '#fffaf8'); } }},
  catband:{name:'고양이 머리띠', price:51000, draw:(d,g)=>{ for (const sx of (g.side?[-.3]:[-1,1])) d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.42,HY-R*1.12); c.lineTo(sx*R*.78,HY-R*1.72); c.lineTo(sx*R*1.0,HY-R*.98); c.closePath(); }, '#3a3040', [sx*R*.7,HY-R*1.3,4]); if (!g.up && !g.side) for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.55,HY-R*1.16); c.lineTo(sx*R*.76,HY-R*1.55); c.lineTo(sx*R*.88,HY-R*1.08); c.closePath(); }, '#f6b8c8', [sx*R*.7,HY-R*1.3,2], {flat:true, noShadow:true}); }},
  starglass:{excl:1, name:'별 안경', price:66000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.line(k=>{ for (let i=0;i<=10;i++){ const r = i%2 ? 2.1 : 4.4, a = -Math.PI/2 + i*Math.PI/5; i ? k.lineTo(e + Math.cos(a)*r, y + Math.sin(a)*r) : k.moveTo(e + Math.cos(a)*r, y + Math.sin(a)*r); } }, '#f3b72f', 1.2, .95); if (!g.side) d.line(k=>{ k.moveTo(-2.4,y); k.lineTo(2.4,y); }, '#f3b72f', 1, .9); }},
  monocle:{excl:1, name:'외알 안경', price:88000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, e = g.side ? R*.64 : 6.5; d.line(k=>{ k.arc(e,y,3.6,0,7); }, '#e0ad3a', 1.1, .95); d.line(k=>{ k.moveTo(e+2.6,y+2.6); k.quadraticCurveTo(e+4.4,y+7,e+2.6,BY+3); }, '#e0ad3a', .5, .9); g.c.save(); g.c.globalAlpha=.25; d.dot(e,y,3.2,'#ffffff'); g.c.restore(); }},
  mask:{excl:1, name:'핑크 마스크', price:32000, draw:(d,g)=>{ if (g.up){ d.line(k=>{ k.moveTo(-R*1.0,HY+R*.35); k.quadraticCurveTo(0,HY+R*.2,R*1.0,HY+R*.35); }, '#fffaf2', .7, .9); return; } const x = g.side ? R*.45 : 0, w = g.side ? 7.5 : 11; d.rr(x-w/2,HY+R*.48,w,6.2,2.6,'#ffd0dc'); d.line(k=>{ k.moveTo(x-w/2+1,HY+R*.48+2.2); k.lineTo(x+w/2-1,HY+R*.48+2.2); k.moveTo(x-w/2+1,HY+R*.48+4); k.lineTo(x+w/2-1,HY+R*.48+4); }, '#f2a6bb', .4, .8); if(!g.side) heart(d,3,HY+R*.48+3.6,.5,'#ff6f9f'); }},
  choker:{excl:1, name:'리본 초커', price:38000, draw:(d,g)=>{ d.rr(-4.6,BY-1.6,9.2,1.6,.8,'#2f2a36',ff); if (g.up) return; const x = g.side ? 2.4 : 0; d.ell(x-1.5,BY-.8,1.6,1.1,'#ff8fb6',ff); d.ell(x+1.5,BY-.8,1.6,1.1,'#ff8fb6',ff); d.dot(x,BY-.8,.6,'#f2759b'); }},
  necktie:{excl:1, name:'넥타이', price:46000, draw:(d,g)=>{ if (g.up) return; const x = g.side ? 2.2 : 0; d.shape(c=>{ c.beginPath(); c.moveTo(x-1.4,BY+.2); c.lineTo(x+1.4,BY+.2); c.lineTo(x+.8,BY+2.2); c.lineTo(x+1.8,BY+9.4); c.lineTo(x,BY+11); c.lineTo(x-1.8,BY+9.4); c.lineTo(x-.8,BY+2.2); c.closePath(); }, '#3e4a86', [x,BY+5,4], {flat:true}); d.line(k=>{ k.moveTo(x-1.2,BY+4.6); k.lineTo(x+1.4,BY+3.4); k.moveTo(x-1.5,BY+7.4); k.lineTo(x+1.6,BY+6.2); }, '#f3c64f', .5, .9); }},
  backbow:{excl:1, name:'등 리본', price:58000, draw:(d,g)=>{ const p='#ff8fb6'; if (!g.up){ if (g.side){ d.ell(-g.bw/2-2.6,BY+BH*.4,2.6,3.2,p); d.rr(-g.bw/2-2.4,BY+BH*.5,1.8,5,.8,p); } return; } const y = BY+BH*.48; for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(0,y); c.quadraticCurveTo(sx*4,y-5.4,sx*7.4,y-2.4); c.quadraticCurveTo(sx*7.6,y+1.8,sx*4.4,y+2.4); c.quadraticCurveTo(sx*2,y+2.2,0,y); c.closePath(); }, p, [sx*4,y-1,4]); for (const sx of [-1,1]) d.rr(sx*1.4-1,y+.6,2,6.6,.9,p); d.circle(0,y,1.6,'#f2759b'); }},
  devilwing:{excl:1, name:'작은 악마 날개', price:92000, draw:(d,g)=>{ for (const sx of (g.side?[-1]:[-1,1])){ const ox = g.up ? sx*2.4 : sx*(g.bw/2+1), y = BY+1, k = 1.5; d.shape(c=>{ c.beginPath(); c.moveTo(ox,y); c.quadraticCurveTo(ox+sx*4*k,y-5*k,ox+sx*8*k,y-4.4*k); c.quadraticCurveTo(ox+sx*7.2*k,y-1.4*k,ox+sx*8.2*k,y+.8*k); c.quadraticCurveTo(ox+sx*6*k,y,ox+sx*5.6*k,y+2.6*k); c.quadraticCurveTo(ox+sx*4*k,y+1.4*k,ox+sx*2.6*k,y+3.8*k); c.closePath(); }, '#5a3a6a', [ox+sx*6,y,7]); d.line(k2=>{ k2.moveTo(ox+sx*2,y+.4); k2.lineTo(ox+sx*10,y-4.6); }, '#8a5a9a', .6, .8); } }},
  butterfly:{excl:1, name:'나비 날개', price:128000, draw:(d,g)=>{ for (const sx of (g.side?[-1]:[-1,1])){ const ox = g.up ? sx*1.2 : sx*(g.bw/2+.6), y = BY+2; g.c.save(); g.c.globalAlpha=.92; g.c.translate(ox,y); g.c.rotate(sx*-.35); d.ell(sx*6,-5,6.4,5,'#c9a6ff'); d.ell(sx*4.6,3.4,4.2,3.4,'#9fd8ff'); g.c.restore(); g.c.save(); g.c.translate(ox,y); g.c.rotate(sx*-.35); d.dot(sx*7,-6,1.6,'#fffaf2',.8); d.dot(sx*4.2,-3,.9,'#ffe08a',.9); d.dot(sx*5.2,3.6,1,'#fffaf2',.8); g.c.restore(); } }},
  crossbag:{excl:1, name:'크로스백', price:64000, draw:(d,g)=>{ if (g.up){ d.line(k=>{ k.moveTo(-4.6,BY+.6); k.lineTo(5,BY+BH*.5); }, '#a8744f', 1.1); return; } d.line(k=>{ k.moveTo(g.side?-3:-4.4,BY+.4); k.lineTo(g.side?2.6:4.8,BY+BH*.5); }, '#a8744f', 1.1); const x = g.side ? 3.6 : 6.4, y = BY+BH*.5; d.rr(x-3.2,y-1.4,6.4,5.2,2,'#ffb3cd'); d.rr(x-3.2,y-1.4,6.4,2.4,1.2,'#ff9fbe'); d.dot(x,y+1,.6,'#f3c64f'); }},
  teddy:{excl:1, name:'곰인형 안기', price:72000, draw:(d,g)=>{ const b='#c9a07a', m='#f3dcc0', k='#3a2430', S = .88;
    const bear = (x, y, back) => { const P = (dx, dy) => [x+dx*S, y+dy*S];
      if (!back){ d.ell(...P(0, 3.4), 5*S, 5.2*S, b); d.ell(...P(0, 4), 3*S, 3.2*S, m, ff); for (const sx of [-1,1]) d.ell(...P(sx*3.4, 8), 2*S, 1.6*S, b); }
      for (const sx of [-1,1]){ d.circle(...P(sx*3.7, -6.6), 1.9*S, b); if (!back) d.circle(...P(sx*3.7, -6.6), 1*S, '#f0b8c4', ff); }
      d.circle(...P(0, -2.6), 4.8*S, b); if (back) return;
      d.ell(...P(0, -1.2), 2.2*S, 1.6*S, m, ff); d.dot(...P(-2, -2.9), .62, k); d.dot(...P(2, -2.9), .62, k); d.ell(...P(0, -1.75), .7, .5, k, ff); // 콕 박힌 점 눈 · 작은 코
      const [mx, my] = P(0, -.9); d.line(c=>{ c.moveTo(mx-.8, my); c.quadraticCurveTo(mx-.4, my+.5, mx, my); c.quadraticCurveTo(mx+.4, my+.5, mx+.8, my); }, k, .3); d.ell(...P(-3.2, -1.4), 1.1, .65, '#f4a3b6', ff); d.ell(...P(3.2, -1.4), 1.1, .65, '#f4a3b6', ff);
      for (const sx of [-1,1]) d.shape(c=>{ const [ax, ay] = P(0, 1.6); c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax+sx*2.8*S, ay-1.3*S); c.lineTo(ax+sx*2.8*S, ay+1.3*S); c.closePath(); }, '#ff8fb0', [...P(0, 1.6), 2], ff); d.circle(...P(0, 1.6), .85, '#ff6f99', ff); };
    if (g.up){ bear(-g.bw/2-2.4, BY+BH*.42, true); return; } // 뒤에서는 옆구리 너머로 곰 머리
    const [hx, hy] = handPos(g).at(-1), x = g.side ? hx + 1 : hx - 3.4, y = hy - 1.6; bear(x, y); // 곰은 몸 안쪽으로 쏙
    d.ell(g.side ? x + 3.6 : hx, g.side ? hy + 1.2 : hy, 3.1, 3.7, g.sk); // 손은 곰 바깥에서 감싸 안아요
  }},
  balloon:{excl:1, name:'하트 풍선', price:42000, draw:(d,g)=>{ const [hx,hy] = handPos(g).at(-1), bx = hx + 5, by = HY - R*1.3; d.line(k=>{ k.moveTo(hx,hy); k.quadraticCurveTo(hx+4,hy-16,bx,by+6); }, '#9a8a94', .5, .9); if (g.up) return; heart(d,bx,by,4.4,'#ff6f9f',{}); d.dot(bx-2.4,by-1.2,1,'#fff',.7); }},
  foxtail:{excl:1, name:'여우 꼬리', price:86000, draw:(d,g)=>{ const o='#f2944a'; if (g.up){ d.ell(0,BY+BH*.62,4.4,6.8,o); d.ell(0,BY+BH*.62+5,2.6,2.4,'#fffaf2'); return; } if (g.side){ d.ell(-g.bw/2-3.6,BY+BH*.56,3,6,o); d.ell(-g.bw/2-4,BY+BH*.56-4,1.8,2,'#fffaf2'); return; } d.ell(g.bw/2+3.6,BY+BH*.62,2.4,4.6,o); d.ell(g.bw/2+4.2,BY+BH*.62-3.4,1.4,1.6,'#fffaf2'); }},
  cattail:{name:'고양이 꼬리', price:52000, draw:(d,g)=>{ const k='#d9d2e9', tip='#b8aecd', b = g.bw/2, B = (p0, p1, p2, p3) => t => { const u = 1-t; return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0], u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]; };
    const P = g.up ? B([0,BY+BH*.86],[7,BY+BH*.66],[-7,BY+BH*.34],[-2,BY+BH*.16]) : g.side ? B([-b,BY+BH*.8],[-b-10,BY+BH*.92],[-b-11,BY+BH*.3],[-b-5,BY+BH*.12]) : B([b,BY+BH*.86],[b+10,BY+BH*.96],[b+10,BY+BH*.32],[b+5,BY+BH*.14]);
    const N = 24, L = [], Rr = []; for (let i = 0; i <= N; i++){ const t = i/N, [x, y] = P(t), [x2, y2] = P(Math.min(1, t + .02)), [x0, y0] = P(Math.max(0, t - .02)), dx = x2 - x0, dy = y2 - y0, m = Math.hypot(dx, dy) || 1, w = 2.5 - t*.7; L.push([x - dy/m*w, y + dx/m*w]); Rr.unshift([x + dy/m*w, y - dx/m*w]); }
    const [ex, ey] = P(1); d.shape(c=>{ c.beginPath(); [...L, ...Rr].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); }, k, [ex, (ey + P(0)[1])/2, 6]); d.circle(ex, ey, 1.85, tip, {noShadow:true}); }},
  freckles:{excl:1, name:'주근깨', price:22000, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.5; for (const e of (g.side ? [R*.6] : [-R*.62, R*.62])) for (const [dx,dy] of [[-1.4,0],[0,-.8],[1.2,.2],[.2,.9]]) d.dot(e+dx, y+dy, .38, '#b07a5a', .85); }},
  heartear:{excl:1, name:'하트 귀걸이', price:52000, draw:(d,g)=>{ if (g.up) return; for (const e of (g.side ? [R*1.15] : [-R*1.2, R*1.2])){ d.line(k=>{ k.moveTo(e,HY+R*.3); k.lineTo(e,HY+R*.48); }, '#e0ad3a', .4); heart(d,e,HY+R*.56,1.1,'#ff4f7a'); } }},
  medal:{excl:1, name:'금메달', price:108000, draw:(d,g)=>{ if (g.up){ d.line(k=>{ k.moveTo(-3.6,BY); k.quadraticCurveTo(0,BY+1.6,3.6,BY); }, '#e85d6a', 1.2); return; } const x = g.side ? 2 : 0; d.shape(c=>{ c.beginPath(); c.moveTo(x-3.8,BY-.4); c.lineTo(x-1,BY+6); c.lineTo(x+1,BY+6); c.lineTo(x+3.8,BY-.4); c.lineTo(x+2.2,BY-.4); c.lineTo(x,BY+4.4); c.lineTo(x-2.2,BY-.4); c.closePath(); }, '#e85d6a', [x,BY+3,3], {flat:true}); d.circle(x,BY+7.6,2.4,'#f3c64f'); d.dot(x,BY+7.6,1.2,'#e0ad3a'); d.dot(x-.8,BY+6.8,.5,'#fff',.8); }},
  // ===== 보물 지도 전용 액세서리 5 개 =====
  tmmuseum:{tmap:'museum', excl:1, name:'탐험가 망원경', price:0, draw:(d,g)=>{ if (g.up) return; const [hx0,hy0] = handPos(g).at(-1); g.c.save(); g.c.translate(hx0,hy0); g.c.scale(1.4,1.4); const hx = 0, hy = 0; d.shape(c=>{ c.beginPath(); c.moveTo(hx-1.8,hy+.6); c.lineTo(hx+6.6,hy-7.6); c.lineTo(hx+8.6,hy-5.6); c.lineTo(hx+.2,hy+2.6); c.closePath(); }, '#c99a3a', [hx+4,hy-3,5]); d.line(k=>{ k.moveTo(hx+2.2,hy-3.4); k.lineTo(hx+4.2,hy-1.4); k.moveTo(hx+4.4,hy-5.6); k.lineTo(hx+6.4,hy-3.6); }, '#7a5a20', .7); d.circle(hx+7.8,hy-6.8,2.3,'#e8c060'); d.circle(hx+7.8,hy-6.8,1.3,'#9fdcff',ff); d.dot(hx+7.4,hy-7.2,.45,'#fff',.9); g.c.restore(); }},
  tmpond:{tmap:'pond', excl:1, name:'왕 막대사탕', price:0, draw:(d,g)=>{ const [hx,hy] = handPos(g).at(-1), bx = hx+(g.up ? 2 : 6), by = hy-13; d.rr(bx-.7,by,1.4,hy-by+1,.6,'#fffaf2'); d.circle(bx,by,8,'#ffb3d1'); if (g.up) return; d.line(k=>{ k.moveTo(bx,by); for (let a=0;a<13;a+=.3){ const r=a*.58; k.lineTo(bx+Math.cos(a)*r,by+Math.sin(a)*r); } }, '#fffaf2', 1.4, .95); d.dot(bx-3.4,by-3.6,1.2,'#fff',.7); d.ell(bx-2.6,by+8.6,2.6,1.6,'#bff0e0',ff); d.ell(bx+2.6,by+8.6,2.6,1.6,'#bff0e0',ff); d.dot(bx,by+8.6,1,'#8fdcc8'); }},
  tmdeepforest:{tmap:'deepforest', excl:1, name:'어깨 부엉이', price:0, draw:(d,g)=>{ const b='#7a5a46'; g.c.save(); g.c.translate(g.side ? -R*.3 : g.up ? -g.bw/2-3.6 : g.bw/2+3.8, g.side ? BY-3.4 : BY+.6); g.c.scale(1.35,1.35); for (const s2 of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(s2*1.4,-3.4); c.lineTo(s2*3.4,-6.8); c.lineTo(s2*3.6,-2.6); c.closePath(); }, b, [s2*3,-4,2]); d.ell(0,0,4,4.8,b); if (g.up){ d.line(k=>{ for (let r=0;r<3;r++){ k.moveTo(-2.4,-1+r*1.8); k.quadraticCurveTo(0,.2+r*1.8,2.4,-1+r*1.8); } }, '#5a4034', .5, .8); g.c.restore(); return; } d.ell(0,1.6,2.8,2.6,'#c9a684',ff); for (const s2 of [-1,1]){ d.circle(s2*1.6,-1.2,1.55,'#fffaf2',ff); d.dot(s2*1.6,-1.1,.8,'#2b2228'); } d.shape(c=>{ c.beginPath(); c.moveTo(-.7,0); c.lineTo(.7,0); c.lineTo(0,1.4); c.closePath(); }, '#f3c64f', [0,0,1], ff); for (const s2 of [-1,1]) d.dot(s2*1,4.6,.6,'#f3c64f'); g.c.restore(); }},
  tmworkshop:{tmap:'workshop', excl:1, name:'태엽 열쇠', price:0, draw:(d,g)=>{ const key = (x,y,ang) => { g.c.save(); g.c.translate(x,y); g.c.rotate(ang); g.c.scale(1.5,1.5); d.rr(-.8,0,1.6,6.4,.6,'#c99a3a'); for (const s2 of [-1,1]) d.ell(s2*2.9,8,3.1,2.3,'#e0b84a'); d.dot(0,8,1.1,'#c99a3a'); for (const s2 of [-1,1]) d.dot(s2*2.9,8,.9,'#fff6c8',.8); g.c.restore(); }; if (g.up) key(0,BY+7,Math.PI); else if (g.side) key(-g.bw/2+.8,BY+6,Math.PI/2); else key(g.bw/2-1.2,BY+2.4,-Math.PI*.75); }},
  tmcave3:{tmap:'cave3', excl:1, name:'불꽃 날개', price:0, draw:(d,g)=>{ for (const sx of (g.side?[-1]:[-1,1])){ const ox = g.up ? sx*2 : sx*(g.bw/2+.6), y = BY+3; for (const [k,col] of [[1.6,'#ff7a2f'],[1.15,'#ffb347'],[.7,'#ffe07a']]) d.shape(c=>{ c.beginPath(); c.moveTo(ox,y+2*k); c.quadraticCurveTo(ox+sx*3*k,y-1*k,ox+sx*5*k,y-7*k); c.quadraticCurveTo(ox+sx*5.4*k,y-2*k,ox+sx*7*k,y-3.6*k); c.quadraticCurveTo(ox+sx*6.2*k,y+1.6*k,ox+sx*7.4*k,y+1*k); c.quadraticCurveTo(ox+sx*4*k,y+4*k,ox,y+2*k); c.closePath(); }, col, [ox+sx*4*k,y,5*k], ff); } }},
};
export const SHOES = {
  sh01:{name:'운동화',     price:0,   draw:(d,g)=>{ shoe(d,g,'#fffaf4'); band(d,g,'#e9dfe4',-1.1,.9); }},
  sh02:{name:'메리제인',   price:46000, draw:(d,g)=>{ shoe(d,g,'#5a3a44'); if(!g.side) band(d,g,'#5a3a44',-3.4,.9); }},
  sh03:{name:'노랑 장화',  price:56000, draw:(d,g)=>{ shaft(d,g,'#ffd45a',4.6); shoe(d,g,'#ffd45a'); }},
  sh04:{name:'샌들',       price:37000, draw:(d,g)=>{ shoe(d,g,g.sk,{noShadow:true}); band(d,g,'#d9a06a',-2.6,1.1); band(d,g,'#c9895a',-.9,.9); }},
  sh05:{name:'갈색 부츠',  price:72000, draw:(d,g)=>{ shaft(d,g,'#8a5a3c',4.0); shoe(d,g,'#8a5a3c'); }},
  sh06:{name:'슬리퍼',     price:0,   draw:(d,g)=>{ shoe(d,g,'#a9c7ef'); band(d,g,'#8fb3e2',-2.8,1.5); }},
  sh07:{name:'토끼 슬리퍼', price:67000, draw:(d,g)=>{ shoe(d,g,'#fff0f5'); for (const f of feet(g)){ const x = f.x+(g.side?1.6:0), y = -1.5-f.lift; if (!g.up){ d.dot(x-(g.side?0:1.1), y-.4, .45, '#5a3a44'); if(!g.side) d.dot(x+1.1, y-.4, .45, '#5a3a44'); } d.ell(x-.9, y-2.4, .8, 1.6, '#fff0f5', {noShadow:true}); d.ell(x+.9, y-2.4, .8, 1.6, '#fff0f5', {noShadow:true}); } }},
  sh08:{name:'빨간 하이탑', price:62000, draw:(d,g)=>{ shaft(d,g,'#e85d5d',2.8); shoe(d,g,'#e85d5d'); band(d,g,'#fffaf4',-1.0,1.1); }},
  sh09:{name:'로퍼',       price:56000, draw:(d,g)=>{ shoe(d,g,'#3f3a4a'); if(!g.up) for (const f of feet(g)) d.rr(f.x-1.2+(g.side?1.3:0), -2.9-f.lift, 2.4, .9, .45, '#c9a85a', {flat:true, noShadow:true}); }},
  sh10:{name:'털 부츠',    price:78000, draw:(d,g)=>{ shaft(d,g,'#d9b38c',4.4); shoe(d,g,'#d9b38c'); for (const f of feet(g)) d.rr(f.x-2.7, -6.9-f.lift, 5.4, 1.9, .95, '#fff6ea', {noShadow:true}); }},
  sh11:{name:'검정 운동화', price:0,  draw:(d,g)=>{ shoe(d,g,'#3f3a4a'); band(d,g,'#fffaf4',-1.1,.9); }},
  sh12:{name:'발레 슈즈',  price:62000, draw:(d,g)=>{ shoe(d,g,'#f6c6d3'); if(!g.up) for (const f of feet(g)) d.dot(f.x+(g.side?1.6:0), -2.6-f.lift, .6, '#e85d7a'); }},
  sh13:{name:'러닝화',     price:70000, draw:(d,g)=>{ shoe(d,g,'#ff9f5a'); band(d,g,'#fffaf4',-1.0,1.1); if(!g.up) for (const f of feet(g)) d.line(k=>{ k.moveTo(f.x-1.6+(g.side?1:0), -2.4-f.lift); k.quadraticCurveTo(f.x, -1.6-f.lift, f.x+1.8+(g.side?1:0), -2.8-f.lift); }, '#fffaf4', .5, .9); }},
};
// ===== 오투모 전용 옷 70 벌 (세트 20 · 모자 20 · 액세서리 20 · 상의 10) =====
// otumo: 관리자의 '오투모 옷 입히기' 창에만 보여요. 가게 · 경매 · OX 퀴즈 상품 · 거래소에는 절대 나오지 않아요.
const OTU = {otumo:1, excl:1, price:0};
const star5 = (d, x, y, r, col, o=ff) => d.shape(c=>{ c.beginPath(); for (let i=0;i<10;i++){ const rr = i%2 ? r*.45 : r, a = -Math.PI/2 + i*Math.PI/5; c.lineTo(x+Math.cos(a)*rr, y+Math.sin(a)*rr); } c.closePath(); }, col, [x,y,r], o);
const sides2 = g => g.side ? [1] : [-1, 1];
const cuffs = (d, g, col) => { if (g.pray) return; for (const sx of sides2(g)) d.rr(sx*(g.bw/2+1.4)-2.9, BY+BH*.44, 5.8, 1.3, .65, col, ff); };
const heldAt = g => handPos(g).at(-1); // 오른손 (옆모습은 앞쪽 손)
// 오투모 후드: 머리(헬멧) 뒤 덮개는 draw 에서, 앞자락 테두리는 over 에서. back(cy, ox): 귀·가시처럼 뒤로 솟는 것 / face(cy, ox): 앞자락 무늬
const otuHoodBack = (d, col) => d.ell(0, HY-1, R*1.34, R*1.26, col);
const otuHood = (d, g, col, rim, back, face) => { const cy = HY-1.5, ox = g.side ? R*.12 : 0;
  if (back) back(cy, ox);
  if (g.up){ d.ell(0, cy, R*1.32, R*1.24, col); return; }
  d.shape(c=>{ c.beginPath(); c.ellipse(ox, cy, R*1.32, R*1.24, 0, Math.PI*1.03, Math.PI*1.97); c.ellipse(ox, cy+R*.14, R*1.04, R*.8, 0, Math.PI*1.92, Math.PI*1.08, true); c.closePath(); }, col, [ox,cy-R*.5,R*1.35]);
  for (let i = 0; i <= 16; i++){ const a = Math.PI*(1.1 + i*.05); d.circle(ox+Math.cos(a)*R*1.04, cy+R*.14+Math.sin(a)*R*.8, 1.3, rim, {noShadow:true}); }
  if (face) face(cy, ox); };
const tail = (d, g, col, tip) => { if (!g.side && !g.up) return; const tx = g.up ? 0 : -g.bw/2-2; // 공룡 꼬리 (옆·뒤)
  d.shape(c=>{ c.beginPath(); c.moveTo(tx+(g.up?-4.5:2), BY+8); c.quadraticCurveTo(tx+(g.up?0:-8), BY+19, tx+(g.up?0:-12.5), BY+20.5); c.quadraticCurveTo(tx+(g.up?0:-6), BY+15, tx+(g.up?4.5:2), BY+15); c.closePath(); }, col, [tx-4,BY+16,6]);
  if (tip) for (const k of [0,1]) d.shape(c=>{ const x0 = g.up ? 0 : tx-3-k*4.4, y0 = BY+12+k*4; c.beginPath(); c.moveTo(x0-1.5,y0+.6); c.lineTo(x0,y0-2); c.lineTo(x0+1.5,y0+.6); c.closePath(); }, tip, [x0Box(g,tx),BY+14,2], ff); };
const x0Box = (g, tx) => g.up ? 0 : tx-5;
const wingPair = (d, g, cols, alpha=.9) => { for (const sx of (g.side ? [-1] : [-1, 1])){ const ox = g.up ? sx*1.6 : sx*(g.bw/2+.4), y = BY+5.4; g.c.save(); g.c.globalAlpha = alpha; g.c.translate(ox, y); g.c.rotate(sx*-.3);
  d.ell(sx*5.6, -4.6, 5.8, 4.6, cols[0]); d.ell(sx*4.2, 3.2, 3.9, 3.2, cols[1]); g.c.restore(); g.c.save(); g.c.translate(ox, y); g.c.rotate(sx*-.3); d.dot(sx*6.4, -5.6, 1.3, '#ffffff', .75); d.dot(sx*4.4, 3.2, .8, '#ffffff', .7); g.c.restore(); } };
const SETS_OTU = {
  os01:{...OTU, name:'꼬마 우주 비행사', draw:(d,g)=>{ const v='#cdbcf5', dk='#a996e6', o='#ffb36b';
    const pack = x => { d.rr(x-3,BY+.6,6,10.6,2.6,'#d9dde8'); d.rr(x-2.2,BY+10.8,4.4,1.6,.7,'#9aa1ae'); d.shape(c=>{ c.beginPath(); c.moveTo(x-1.8,BY+12.4); c.quadraticCurveTo(x,BY+18.6,x+1.8,BY+12.4); c.closePath(); }, o, [x,BY+15,3], ff); d.shape(c=>{ c.beginPath(); c.moveTo(x-.9,BY+12.4); c.quadraticCurveTo(x,BY+15.8,x+.9,BY+12.4); c.closePath(); }, '#fff3a0', [x,BY+14,2], ff); };
    if (g.side) pack(-g.bw/2-1.6);
    pants(d,g,v,.5); for (const f of feet(g)) d.rr(f.x-2.4,-8.8-f.lift,4.8,8.6,1.8,shade(v,f));
    torso(d,g,v); d.rr(-g.bw/2,BY+BH*.54,g.bw,1.6,.8,dk,ff);
    if (g.up) for (const sx of [-1,1]) pack(sx*3.3);
    else { const px = g.side ? 2 : -3.3; d.circle(px,BY+5,2,'#7cc8ff',ff); d.line(k=>{ k.ellipse(px,BY+5,3.3,.9,-.3,0,7); }, '#ffd36b', .7, .95);
      if (!g.side){ d.line(k=>{ k.moveTo(1.6,BY+1); k.lineTo(1.6,BY+BH*.54); }, dk, .7, .9); star5(d,4.2,BY+4.4,1.4,'#ffd36b'); d.rr(2.6,BY+7.4,3.6,1,.4,'#fffaf2',ff); }
      d.dot(px+.9, BY+BH*.54+.8, .6, '#ffd36b'); }
    sleeves(d,g,v); cuffs(d,g,o); hands(d,g); }},
  os02:{...OTU, name:'달빛 마법사 로브', draw:(d,g)=>{ const v='#9fd8cf', dk='#76c2b6', lv='#b9a6f0', gd='#ffd36b';
    legs(d,g,'#7f6fb5'); robe(d,g,v,-2.2,.72);
    if (g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2-1,BY-.6); c.lineTo(g.bw/2+1,BY-.6); c.lineTo(g.bw*.62,-4.4); c.quadraticCurveTo(0,-3,-g.bw*.62,-4.4); c.closePath(); }, lv, [0,BY+8,9]); for (const [x,y,r] of [[-3,5,1.2],[2.6,9.5,1],[-1.2,14,1.1]]) star5(d,x,BY+y,r,gd); }
    else { const cx = g.side ? 2.4 : 0;
      d.rr(cx-1.3,BY+.6,2.6,BH-3.4,1.2,dk,ff); for (const y of [3.5,7.2,10.9,14.6]) star5(d,cx,BY+y,.95,gd);
      if (!g.side){ d.circle(-4.4,BY+12.4,2.2,gd,ff); d.circle(-3.6,BY+11.8,2,v,ff); for (const [x,y] of [[4.2,5],[4.8,13.4],[-4.6,5.6]]) d.dot(x,BY+y,.55,'#fffaf2'); }
      d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2-.8,BY+.4); c.quadraticCurveTo(cx,BY+5,g.bw/2+.8,BY+.4); c.lineTo(g.bw/2-1,BY-1.2); c.quadraticCurveTo(cx,BY+1.8,-g.bw/2+1,BY-1.2); c.closePath(); }, lv, [0,BY+1,6]); }
    bigSleeves(d,g,v,lv); }},
  os03:{...OTU, name:'하늘 왕자님 망토', draw:(d,g)=>{ const w='#fbf8ff', bl='#8fb8f0', gd='#f3c64f', rd='#ff8fa6';
    pants(d,g,'#f2eee6'); legs(d,g,'#f2eee6'); torso(d,g,w);
    if (!g.up){ if (!g.side){ d.line(k=>{ k.moveTo(-g.bw/2+1.2,BY+.8); k.lineTo(g.bw/2-1.4,BY+BH*.56); }, rd, 1.8, .9); for (const y of [3.6,6.6,9.6]){ d.dot(-2.4,BY+y,.6,gd); d.dot(2.4,BY+y,.6,gd); } star5(d,-3.4,BY+4.2,1.3,gd); } else for (const y of [3.6,6.6,9.6]) d.dot(3.4,BY+y,.6,gd); collar(d,g,'#fffaf2'); }
    d.rr(-g.bw/2,BY+BH*.56,g.bw,1.3,.6,gd,ff);
    if (g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2-1.6,BY-.8); c.lineTo(g.bw/2+1.6,BY-.8); c.lineTo(g.bw/2+3.4,-2.6); for (let i=0;i<=4;i++){ const x = g.bw/2+3.4 - (i+1)*(g.bw+6.8)/5; c.quadraticCurveTo(x+(g.bw+6.8)/10, -.6, x, -2.6); } c.closePath(); }, bl, [0,BY+9,10]); d.line(k=>{ k.moveTo(-g.bw/2-1.4,BY-.4); k.lineTo(g.bw/2+1.4,BY-.4); }, gd, 1.2, .95); star5(d,0,BY+8,2,gd,{}); }
    else capeSides(d,g,bl);
    for (const sx of sides2(g)){ d.rr(sx*(g.bw/2+.6)-2.4,BY-1.2,4.8,2.2,1.1,gd); d.line(k=>{ for (let i=-1;i<=1;i++){ k.moveTo(sx*(g.bw/2+.6)+i*1.4,BY+1); k.lineTo(sx*(g.bw/2+.6)+i*1.4,BY+2.4); } }, gd, .5, .9); }
    sleeves(d,g,w); cuffs(d,g,bl); hands(d,g); }},
  os04:{...OTU, name:'장미 공주 드레스', draw:(d,g)=>{ const p='#ffc6da', p2='#ffd9e6', p3='#ffadc8', rs='#ff7fa6';
    legs(d,g,g.sk); skirt(d,g,p2,1.75,.66); ruffle(d,-g.bw*.84,g.bw*.84,skB(.66)-.2,'#fff0f6',.95); skirt(d,g,p3,1.45,.42);
    if (!g.up && !g.side) for (const x of [-5.6,-2,2,5.6]){ const y = skB(.42)-.6; d.circle(x,y,1.4,rs,ff); d.line(k=>{ k.arc(x,y,.7,0,5); }, '#ffd9e6', .45, .9); d.ell(x+1.3,y+.6,.9,.5,'#8fd08f',ff); }
    torso(d,g,p); d.rr(-g.bw/2,BY+BH*.5,g.bw,1.6,.8,'#fff0f6',ff);
    if (g.up){ for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(0,SK0-1); c.quadraticCurveTo(sx*4.4,SK0-5,sx*5,SK0-.6); c.quadraticCurveTo(sx*3.2,SK0+.8,0,SK0-1); c.closePath(); }, rs, [sx*2.6,SK0-1,3]); d.circle(0,SK0-1,1.3,'#ff6f99'); }
    else { ruffle(d,-4,4,BY+.4,'#fff0f6',.8); if (!g.side){ heart(d,0,BY+5.6,1.3,rs); d.dot(-.4,BY+5.2,.35,'#fff',.8); } }
    if (!g.pray) for (const sx of sides2(g)) d.ell(sx*(g.bw/2+1.4), BY+BH*.2, 3.9, 3.6, p);
    if (g.pray) praySleeves(d,g,p); hands(d,g); }},
  os05:{...OTU, name:'꼬마 선장 코트', draw:(d,g)=>{ const nv='#5a7fbf', gd='#f3c64f';
    pants(d,g,'#f6f2ea'); legs(d,g,'#f6f2ea'); torso(d,g,'#fffaf2'); stripe(d,g,'#a9c7ef',4);
    if (g.up){ d.rr(-g.bw/2-.4,BY-.3,g.bw+.8,BH*.8,3,nv); d.line(k=>{ k.moveTo(0,BY+BH*.5); k.lineTo(0,BY+BH*.78); }, '#4a6aa8', .8, .9); for (const sx of [-1,1]) d.dot(sx*2,BY+BH*.48,.6,gd); }
    else if (g.side){ d.rr(-g.bw/2-.4,BY-.3,g.bw*.62,BH*.8,2,nv); d.rr(g.bw/2-2.2,BY-.3,2.6,BH*.6,1.2,nv); for (const y of [4,8]) d.dot(-g.bw/2+g.bw*.62-1.6,BY+y,.6,gd); }
    else { for (const sx of [-1,1]){ d.rr(sx>0 ? g.bw/2+.4-g.bw*.38 : -g.bw/2-.4, BY-.3, g.bw*.38, BH*.8, 2, nv); for (const y of [4,7.6,11.2]) d.dot(sx*3.6,BY+y,.65,gd); } for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(sx*2,BY); c.lineTo(sx*3.8,BY+4.6); c.lineTo(sx*4.6,BY); c.closePath(); }, '#7d9bd0', [sx*3,BY+2,2], ff); }
    d.rr(-g.bw/2,BY+BH*.48,g.bw,1.8,.9,'#ff8f8f',ff); if (!g.up) d.rr(g.side?1:-1.2,BY+BH*.48-.3,2.4,2.4,.5,gd,ff);
    for (const sx of sides2(g)) d.rr(sx*(g.bw/2+.6)-2.4,BY-1.2,4.8,2,1,gd);
    sleeves(d,g,nv); if (!g.pray) for (const sx of sides2(g)) d.line(k=>{ k.moveTo(sx*(g.bw/2+1.4)-2.6,BY+BH*.4); k.lineTo(sx*(g.bw/2+1.4)+2.6,BY+BH*.4); }, gd, .7, .95); hands(d,g); }},
  os06:{...OTU, name:'꼬마 셰프 옷', draw:(d,g)=>{ const w='#fffaf2', pk='#d9cfe8', rd='#ff7a8a';
    pants(d,g,pk); legs(d,g,pk); for (const f of feet(g)) for (const [dx,y] of [[-1,-7],[1,-5.4],[-1,-3.8],[1,-2.2]]) d.dot(f.x+dx,y-f.lift,.5,shade('#b3a6cc',f));
    torso(d,g,w);
    if (g.up){ for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(0,BY+BH*.5); c.quadraticCurveTo(sx*3.6,BY+BH*.5-3.6,sx*4.4,BY+BH*.5); c.quadraticCurveTo(sx*3,BY+BH*.5+1.6,0,BY+BH*.5); c.closePath(); }, '#ffb3c6', [sx*2,BY+BH*.5,2.4]); d.dot(0,BY+BH*.5,.9,'#ff8fb0'); }
    else { const cx = g.side ? 2.2 : 0; if (!g.side) for (const sx of [-1,1]) for (const y of [4,7,10]) d.dot(sx*2.6,BY+y,.6,'#d9cfe0');
      d.shape(c=>{ c.beginPath(); c.moveTo(cx-3.4,BY-.4); c.lineTo(cx+3.4,BY-.4); c.lineTo(cx,BY+4.4); c.closePath(); }, rd, [cx,BY+1.4,3], ff); d.circle(cx,BY+.6,1,'#ff5f75',ff);
      const aw = g.side ? 3.6 : 5.2; d.rr(cx-aw,BY+6.4,aw*2,BH*.62-5.6,1.6,'#ffc2d0'); ruffle(d,cx-aw+.6,cx+aw-.6,BY+BH*.62+.6,'#ffe0ea',.7); if (!g.side){ d.rr(-4.2,BY+9,2.6,2.2,.6,'#ffe0ea',ff); d.rr(-3.2,BY+7.6,.5,2.6,.25,'#c9a06a',ff); d.ell(-2.95,BY+7.4,.8,1,'#c9a06a',ff); heart(d,2.6,BY+9.4,.9,'#ff7a8a'); } }
    d.rr(-g.bw/2,BY+BH*.56,g.bw,1.2,.6,'#f0e6f0',ff);
    sleeves(d,g,w); cuffs(d,g,'#f0e6f0'); hands(d,g); }},
  os07:{...OTU, name:'반짝 아이돌 무대복', draw:(d,g)=>{ const j='#c9b3ff', p='#ffb3d9';
    legs(d,g,g.sk); skirt(d,g,p,1.35,.42); pleats(d,g,'#f28fc0',.42,2); ruffle(d,-g.bw*.66,g.bw*.66,skB(.42)-.1,'#fff0f8',.8);
    torso(d,g,'#fffaf2'); d.rr(-g.bw/2-.3,BY-.3,g.bw+.6,BH*.48,4,j);
    if (!g.up){ if (!g.side){ d.rr(-1.6,BY+.4,3.2,BH*.4,1,'#fffaf2',ff); star5(d,-4.2,BY+4,1.5,'#ffe07a'); } else d.rr(2.6,BY+.4,2.2,BH*.4,1,'#fffaf2',ff); }
    else star5(d,0,BY+5,2.6,'#ffe07a',{});
    for (let i=0;i<12;i++){ const x = -g.bw/2+1 + (i*3.7)%(g.bw-2), y = BY+.8 + (i*2.3)%8.4; d.dot(x,y,.42,i%3 ? '#fff8d8' : '#ffffff',.9); }
    for (const sx of sides2(g)) d.ell(sx*(g.bw/2+.4),BY+.6,3,1.8,'#b39dfa');
    sleeves(d,g,j); cuffs(d,g,'#ffe07a'); hands(d,g); }},
  os08:{...OTU, name:'하늘 경찰 제복', draw:(d,g)=>{ const s='#b9d6f5', nv='#4e5f92', gd='#f3c64f';
    pants(d,g,nv); legs(d,g,nv); if (!g.up) for (const f of feet(g)) d.rr(f.x+(g.side?1.2:-.4),-8.4-f.lift,.8,7.6,.4,shade('#8fb3e2',f),ff);
    torso(d,g,s); collar(d,g,'#a3c5ec');
    if (!g.up){ const cx = g.side ? 2.4 : 0; d.shape(c=>{ c.beginPath(); c.moveTo(cx-.9,BY+1.6); c.lineTo(cx+.9,BY+1.6); c.lineTo(cx+.7,BY+7); c.lineTo(cx,BY+8); c.lineTo(cx-.7,BY+7); c.closePath(); }, nv, [cx,BY+4,1], ff);
      if (!g.side){ star5(d,-3.8,BY+4.4,1.5,gd,{}); d.dot(-3.8,BY+4.4,.4,'#fff6c8'); d.rr(2.2,BY+3.4,3.6,1.2,.5,'#a3c5ec',ff); d.dot(4,BY+4,.4,'#fffaf2'); d.rr(2.4,BY+6.2,3.2,.8,.4,'#ff8fa6',ff); } }
    d.rr(-g.bw/2,BY+BH*.54,g.bw,1.8,.9,nv,ff); if (!g.up) d.rr((g.side?2.4:0)-1.2,BY+BH*.54-.2,2.4,2.2,.5,gd,ff);
    for (const sx of sides2(g)) d.rr(sx*(g.bw/2+.4)-2.2,BY-.9,4.4,1.6,.8,nv);
    sleeves(d,g,s); hands(d,g); }},
  os09:{...OTU, name:'체크 탐정 망토 코트', draw:(d,g)=>{ const b='#dcc39c', ln='#b08e62', br='#8a6248';
    legs(d,g,'#6b5a4c'); robe(d,g,b,-3.4,.6); checks(d,g,ln,BY+BH*.62,-3.6,3);
    if (!g.up && !g.side){ d.line(k=>{ k.moveTo(0,BY+1); k.lineTo(0,-3.6); }, ln, .7, .8); for (const y of [12.6,15.6]){ d.dot(-1.6,BY+y,.6,br); d.dot(1.6,BY+y,.6,br); } }
    sleeves(d,g,b);
    d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2+1,BY-.6); c.lineTo(g.bw/2-1,BY-.6); c.quadraticCurveTo(g.bw/2+3.4,BY+2,g.bw/2+3.6,BY+BH*.4); c.quadraticCurveTo(0,BY+BH*.48,-g.bw/2-3.6,BY+BH*.4); c.quadraticCurveTo(-g.bw/2-3.4,BY+2,-g.bw/2+1,BY-.6); c.closePath(); }, b, [0,BY+4,g.bw*.7]);
    d.line(k=>{ for (let x=-g.bw/2-1; x<=g.bw/2+1; x+=3){ k.moveTo(x,BY+.4); k.lineTo(x*1.12,BY+BH*.42); } for (const y of [3,6]){ k.moveTo(-g.bw/2-1.6,BY+y); k.lineTo(g.bw/2+1.6,BY+y); } }, ln, .6, .45);
    if (!g.up){ const cx = g.side ? 2.4 : 0; d.shape(c=>{ c.beginPath(); c.moveTo(cx-4.4,BY-1); c.lineTo(cx,BY+2.6); c.lineTo(cx+4.4,BY-1); c.lineTo(cx+3,BY-1.8); c.lineTo(cx,BY+.6); c.lineTo(cx-3,BY-1.8); c.closePath(); }, br, [cx,BY,3], ff); d.dot(cx,BY+4.4,.7,br); }
    hands(d,g); }},
  os10:{...OTU, name:'아기 판다 잠옷', draw:(d,g)=>{ const w='#fffaf2', k='#4a4550';
    otuHoodBack(d,w); torso(d,g,w); pants(d,g,w,.5); legs(d,g,k); longArms(d,g,k);
    if (g.up) d.circle(0,BY+BH*.6,2.6,w);
    else { const cx = g.side ? 2 : 0; d.ell(cx,BY+7,4,4.6,'#f0ece6',ff); if (!g.side){ for (const [x,y,a] of [[3.6,3.4,.5],[4.6,5,.9]]) d.shape(c=>{ c.beginPath(); c.ellipse(x,BY+y,1.6,.7,a,0,7); }, '#8fd08f', [x,BY+y,1.6], ff); d.rr(3.4,BY+2.2,.8,5.4,.4,'#7cc07c',ff); } } },
    over:(d,g)=>otuHood(d,g,'#fffaf2','#f3efe8', (cy)=>{ for (const sx of (g.side?[-.3]:[-1,1])){ d.circle(sx*R*.9,cy-R*1.08,3.8,'#4a4550'); if (!g.up) d.circle(sx*R*.9,cy-R*1.08,1.8,'#6a6470',ff); } },
      (cy, ox)=>{ for (const sx of (g.side?[.6]:[-1,1])){ d.shape(c=>{ c.beginPath(); c.ellipse(ox+sx*R*.42, cy-R*.98, 2.6, 1.8, sx*.5, 0, 7); }, '#4a4550', [ox+sx*R*.42,cy-R*.98,2.6], ff); d.dot(ox+sx*R*.42+.5, cy-R*1.0, .7, '#fffaf2'); } if (!g.side) d.ell(ox, cy-R*.82, 1.1, .7, '#4a4550', ff); }) },
  os11:{...OTU, name:'아기 티라노 옷', draw:(d,g)=>{ const o='#ffc58f', bl='#fff1d6', sp='#ff9f6b';
    tail(d,g,o,sp); otuHoodBack(d,o); torso(d,g,o); pants(d,g,o,.5); legs(d,g,o); longArms(d,g,o);
    if (g.up) for (const y of [BY+1.4, BY+5.4, BY+9.4]) d.shape(c=>{ c.beginPath(); c.moveTo(-1.8,y+1); c.lineTo(0,y-2.2); c.lineTo(1.8,y+1); c.closePath(); }, sp, [0,y,2], ff);
    else { const cx = g.side ? 2 : 0; d.ell(cx,BY+6.6,3.8,5,bl,ff); d.line(k=>{ for (const y of [4,6.4,8.8]){ k.moveTo(cx-2.6,BY+y); k.lineTo(cx+2.6,BY+y); } }, '#f3d9b0', .6, .9); }
    if (!g.pray) for (const [hx,hy] of handPos(g)) for (const dx of [-1.2,0,1.2]) d.dot(hx+dx,hy+3.4,.55,'#fffaf2'); },
    over:(d,g)=>otuHood(d,g,'#ffc58f','#ffd6ad', (cy)=>{ const sp = g.side ? [-2.95,-2.55,-2.15,-1.75] : [-2.3,-1.9,-1.57,-1.24,-.84]; for (const a of sp){ const cx = Math.cos(a), sy = Math.sin(a), x = cx*R*1.3, y = cy+sy*R*1.22; d.shape(c=>{ c.beginPath(); c.moveTo(x-sy*2.6, y+cx*2.6); c.lineTo(x+cx*4.4, y+sy*4.4); c.lineTo(x+sy*2.6, y-cx*2.6); c.closePath(); }, '#ff9f6b', [x,y,3]); } },
      (cy, ox)=>{ d.shape(c=>{ c.beginPath(); for (let i = 0; i < 6; i++){ const a = Math.PI*(1.24 + i*.1), a2 = a + Math.PI*.05; c.moveTo(ox+Math.cos(a)*R*1.04, cy+R*.14+Math.sin(a)*R*.8); c.lineTo(ox+Math.cos(a2)*R*.94, cy+R*.14+Math.sin(a2)*R*.66); c.lineTo(ox+Math.cos(a+Math.PI*.1)*R*1.04, cy+R*.14+Math.sin(a+Math.PI*.1)*R*.8); } }, '#fffaf2', [ox,cy-R*.6,4], {noShadow:true}); for (const sx of (g.side?[.55]:[-1,1])){ const ex = ox+sx*R*.5, ey = cy-R*1.04; d.circle(ex,ey,2.4,'#fffaf2',{noShadow:true}); d.dot(ex+(g.side?.7:0),ey+.3,1.15,'#2b2228'); d.dot(ex+.4,ey-.5,.4,'#fff'); } }) },
  os12:{...OTU, name:'꽃 당의 한복', draw:(d,g)=>{ const lv='#d9b8f0', pk='#ff9fc0', gd='#f3c64f';
    legs(d,g,g.sk); skirt(d,g,pk,1.6,.66); if (!g.up) for (const x of [-6,-3,0,3,6]) petal(d,x*(g.side?.7:1),skB(.66)-2.2,.8,gd,'#fff3c4'); else d.line(k=>{ k.moveTo(-g.bw*.7,skB(.66)-2.4); k.quadraticCurveTo(0,skB(.66)-1.2,g.bw*.7,skB(.66)-2.4); }, gd, 1.2, .9);
    d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2,BY+2); c.quadraticCurveTo(-g.bw/2,BY,-g.bw/2+2.4,BY); c.lineTo(g.bw/2-2.4,BY); c.quadraticCurveTo(g.bw/2,BY,g.bw/2,BY+2); c.lineTo(g.bw/2+.6,BY+BH*.7); c.quadraticCurveTo(g.bw*.25,BY+BH*.7,0,BY+BH*.56); c.quadraticCurveTo(-g.bw*.25,BY+BH*.7,-g.bw/2-.6,BY+BH*.7); c.closePath(); }, lv, [0,BY+7,8]);
    if (!g.up){ const cx = g.side ? 1.6 : 0; d.line(k=>{ k.moveTo(cx-g.bw*.3,BY+.5); k.lineTo(cx+1.4,BY+6); }, '#fffaf2', 1.1, .95); d.rr(cx+.8,BY+5.2,1.4,6,.7,'#e85d7a',ff); d.rr(cx+2.2,BY+5.2,1.3,4.6,.6,'#e85d7a',ff); if (!g.side) for (const [x,y] of [[-4.4,9],[4.4,9.6],[-3.2,13]]) petal(d,x,BY+y,.75,gd,'#fff3c4'); }
    else for (const [x,y] of [[-3,5],[3,6],[0,10]]) petal(d,x,BY+y,.8,gd,'#fff3c4');
    sleeves(d,g,lv); if (!g.pray) for (const sx of sides2(g)) d.rr(sx*(g.bw/2+1.4)-2.9,BY+BH*.44,5.8,1.4,.6,'#fffaf2',ff); hands(d,g); }},
  os13:{...OTU, name:'꼬마 산타 망토', draw:(d,g)=>{ const r='#ef6f7a', w='#fffaf2', gr='#7cc08a';
    legs(d,g,w); for (const f of feet(g)) for (const y of [-7.6,-5,-2.4]) d.rr(f.x-2.05,y-f.lift,4.1,1.2,.5,shade(r,f),ff);
    dress(d,g,r); ruffle(d,-g.bw*.62,g.bw*.62,skB(.5)-.4,w,1.1);
    sleeves(d,g,r); cuffs(d,g,w); hands(d,g);
    d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2+1,BY-.6); c.lineTo(g.bw/2-1,BY-.6); c.quadraticCurveTo(g.bw/2+3,BY+2,g.bw/2+3.2,BY+BH*.34); c.quadraticCurveTo(0,BY+BH*.42,-g.bw/2-3.2,BY+BH*.34); c.quadraticCurveTo(-g.bw/2-3,BY+2,-g.bw/2+1,BY-.6); c.closePath(); }, r, [0,BY+3,g.bw*.7]);
    ruffle(d,-g.bw/2-2.6,g.bw/2+2.6,BY+BH*.37,w,1.05);
    if (!g.up){ const cx = g.side ? 2.4 : 0; ruffle(d,cx-4,cx+4,BY-.4,w,1.05); d.circle(cx,BY+2.2,1.5,'#ffd36b'); d.dot(cx,BY+2.6,.45,'#b8862a'); if (!g.side) for (const sx of [-1,1]) d.ell(sx*2.4,BY+1.6,1.4,.7,gr,ff); }
    else { ruffle(d,-4.6,4.6,BY-.4,w,1.05); for (const sx of [-1,1]) d.ell(sx*1.8,BY+1,1.6,1,gr,ff); } }},
  os14:{...OTU, name:'무지개 요정 드레스', draw:(d,g)=>{ const RB = ['#f6a6a6','#f7cf8f','#f3ec9a','#b5e3b0','#a9c7ef','#cdb8f5'];
    if (!g.up) wingPair(d,g,['#d9c8ff','#ffc9e0'],.9);
    legs(d,g,g.sk); RB.forEach((col,i)=>skirt(d,g,col,1.8-i*.1,.7-i*.09));
    torso(d,g,'#fffaf2'); d.rr(-g.bw/2,BY+BH*.5,g.bw,1.6,.8,'#cdb8f5',ff);
    if (!g.up){ ruffle(d,-4,4,BY+.4,'#ffe0ef',.8); if (!g.side) star5(d,0,BY+5.6,1.8,'#ffe07a',{}); }
    for (const [x,y] of [[-5,-6],[4.6,-3.4],[-2,-2.4],[6,-7.6]]) d.dot(x*(g.side?.7:1),y,.5,'#ffffff',.9);
    if (g.up) wingPair(d,g,['#d9c8ff','#ffc9e0'],.9);
    capSleeve(d,g,'#ffe0ef'); }},
  os15:{...OTU, name:'벚꽃 비 원피스', draw:(d,g)=>{ const p='#ffdbe6', p2='#ffc2d4', br='#a8744f';
    legs(d,g,g.sk); dress(d,g,p); skirt(d,g,p,1.5,.58);
    for (const [x,y] of [[-4.6,-7],[1.2,-5],[5,-8],[-2.2,-3],[4,-2.6],[-6,-3.2]]) petal(d,x*(g.side?.7:1),y,.85,'#ff9fbe','#ffe98a');
    d.rr(-g.bw/2,BY+BH*.52,g.bw,1.4,.6,br,ff); if (!g.up && !g.side){ petal(d,2.6,BY+BH*.52+.6,1,'#fff0f5','#ff9fbe'); d.ell(4.2,BY+BH*.52+.2,1,.5,'#8fd08f',ff); }
    sleeves(d,g,p); cuffs(d,g,'#fff0f5'); hands(d,g);
    for (let i=0;i<7;i++){ const a = Math.PI*(i/6), x = Math.cos(a)*(g.bw/2+.6), y = BY+.6+Math.sin(a)*(g.up?2.2:3.6); if (g.side && x < -g.bw/2+1) continue; d.circle(x,y,1.8,p2,{noShadow:true}); d.dot(x,y,.5,'#fff0f5'); } }},
  os16:{...OTU, name:'바다 왕 로브', draw:(d,g)=>{ const t='#7fd3d0', dk='#4fa9b8', gd='#f3c64f', pe='#fffaf2';
    legs(d,g,'#5d8fb0');
    if (g.up) d.rr(-g.bw/2-2.6,BY-1,g.bw+5.2,BH*.86,4,dk); else capeSides(d,g,dk);
    robe(d,g,t,-2.6,.7);
    for (let i=0;i<7;i++){ const x = -g.bw*.66 + i*g.bw*.22; d.shape(c=>{ c.beginPath(); c.arc(x,-3,1.7,Math.PI,0); c.closePath(); }, '#e9fbff', [x,-3.6,1.7], ff); }
    d.line(k=>{ for (let r=0;r<3;r++) for (let x=-g.bw/2+2+(r%2)*1.4; x<g.bw/2-1; x+=2.8){ k.moveTo(x-1.2,BY+BH*.62+r*1.8); k.arc(x,BY+BH*.62+r*1.8,1.2,Math.PI,0,true); } }, '#a8e6e0', .5, .8);
    if (!g.up){ const cx = g.side ? 2.2 : 0; for (let i=0;i<=8;i++){ const tt = i/8; d.dot(cx-4.4+8.8*tt, BY+.6+Math.sin(tt*Math.PI)*3.4, .6, pe); }
      d.shape(c=>{ c.beginPath(); c.moveTo(cx,BY+7.6); for (let i=0;i<=4;i++){ const a = Math.PI*(1.1 + i*.2); c.lineTo(cx+Math.cos(a)*3, BY+6.2+Math.sin(a)*3); } c.closePath(); }, '#ffc2d4', [cx,BY+5,3]); d.line(k=>{ for (let i=0;i<=4;i++){ const a = Math.PI*(1.1 + i*.2); k.moveTo(cx,BY+7.6); k.lineTo(cx+Math.cos(a)*2.6, BY+6.2+Math.sin(a)*2.6); } }, '#f29ab8', .4, .9); }
    d.rr(-g.bw/2,BY+BH*.5,g.bw,1.4,.6,gd,ff);
    bigSleeves(d,g,t,'#e9fbff'); }},
  os17:{...OTU, name:'로봇 정비공 작업복', draw:(d,g)=>{ const y='#ffd36b', dk='#e8b84a', br='#a8744f';
    pants(d,g,y,.5); legs(d,g,y); for (const f of feet(g)) d.rr(f.x-2.2,-2.6-f.lift,4.4,1.2,.6,shade(dk,f),ff);
    torso(d,g,y); d.rr(-g.bw/2,BY+BH*.5,g.bw,2,1,br,ff);
    if (!g.up){ const cx = g.side ? 2.2 : 0; d.line(k=>{ k.moveTo(cx,BY+.6); k.lineTo(cx,BY+BH*.5); }, dk, .8, .9); d.rr(cx-1,BY+BH*.5-.2,2,2.4,.5,'#c9ced8',ff);
      if (!g.side){ d.rr(-5.6,BY+3,3.6,3.2,.8,dk,ff); d.rr(2,BY+3.2,3.8,1.8,.6,'#fffaf2',ff); d.line(k=>{ k.moveTo(2.6,BY+4.1); k.lineTo(5.2,BY+4.1); }, '#7a92c0', .5, .9); d.dot(-4.4,BY+8.6,1.1,'#9aa1ae',.55); d.dot(-3.4,BY+9.2,.7,'#9aa1ae',.5); }
      const tx = g.side ? -1.2 : 4.2; d.rr(tx-.5,BY+BH*.5-2.6,1,4,.4,'#ff8fa6',ff); d.rr(tx+1.1,BY+BH*.5-3,1.2,3.2,.4,'#9fb8ff',ff); d.ell(tx+1.7,BY+BH*.5-3.2,1.1,.9,'#c9ced8',ff); }
    else { d.rr(-3.4,BY+2.4,6.8,4.6,1.4,dk,ff); d.dot(0,BY+4.7,1.2,'#fffaf2',.9); }
    sleeves(d,g,y); cuffs(d,g,dk); hands(d,g); }},
  os18:{...OTU, name:'꿀벌 점프슈트', draw:(d,g)=>{ const y='#ffd84d', k='#5a4650';
    if (!g.up) wingPair(d,g,['#eaf6ff','#eaf6ff'],.75);
    pants(d,g,y,.5); legs(d,g,k); torso(d,g,y); d.line(k2=>{ for (const yy of [4.6,8.4,12.2]){ k2.moveTo(-g.bw/2+.4,BY+yy); k2.lineTo(g.bw/2-.4,BY+yy); } }, k, 1.8, .95);
    fluffRow(d,-g.bw/2+1,g.bw/2-1,BY+.2,1.3,'#fffaf2');
    if (g.side) d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw/2,BY+BH*.5); c.lineTo(-g.bw/2-3.6,BY+BH*.58); c.lineTo(-g.bw/2,BY+BH*.66); c.closePath(); }, k, [-g.bw/2-1,BY+12,2]);
    if (g.up){ wingPair(d,g,['#eaf6ff','#eaf6ff'],.75); d.shape(c=>{ c.beginPath(); c.moveTo(-1.4,BY+BH*.62); c.lineTo(0,BY+BH*.62+3.4); c.lineTo(1.4,BY+BH*.62); c.closePath(); }, k, [0,BY+15,2]); }
    else if (!g.side) heart(d,3.4,BY+2.6,.9,'#ff8fb0');
    sleeves(d,g,k); hands(d,g); }},
  os19:{...OTU, name:'딸기 우유 잠옷', draw:(d,g)=>{ const p='#ffd1dc', w='#fffaf2', rd='#f2647a';
    pants(d,g,w,.5); legs(d,g,w); if (!g.up) for (const f of feet(g)) for (const yy of [-7,-3.6]){ d.ell(f.x+(g.side?.6:0),yy-f.lift,.9,1.1,shade(rd,f),ff); d.dot(f.x+(g.side?.6:0),yy-1-f.lift,.45,'#7cc07c'); }
    torso(d,g,p); collar(d,g,w);
    if (!g.up){ const cx = g.side ? 2.4 : 0; d.line(k=>{ k.moveTo(cx,BY+4); k.lineTo(cx,BY+BH*.62); }, w, .8, .9); for (const yy of [6,9,12]) d.dot(cx+.9,BY+yy,.55,w);
      if (!g.side){ d.rr(-5.8,BY+6.6,4,5.2,.6,w,ff); d.shape(c=>{ c.beginPath(); c.moveTo(-5.8,BY+6.6); c.lineTo(-3.8,BY+4.8); c.lineTo(-1.8,BY+6.6); c.closePath(); }, '#ffb3c6', [-3.8,BY+5.8,2], ff); heart(d,-3.8,BY+8.4,.8,rd); d.ell(4,BY+4.6,1.2,1.4,rd,ff); d.ell(4,BY+3.4,.9,.4,'#7cc07c',ff); } }
    else { d.ell(0,BY+6,2,2.4,rd,ff); d.ell(0,BY+3.8,1.4,.6,'#7cc07c',ff); }
    d.line(k=>{ k.moveTo(-g.bw/2+.6,BY+BH*.6); k.lineTo(g.bw/2-.6,BY+BH*.6); }, w, .8, .9);
    sleeves(d,g,p); cuffs(d,g,w); hands(d,g); }},
  os20:{...OTU, name:'구름 왕 망토', draw:(d,g)=>{ const s='#a9d3ff', w='#fffaf2', gd='#f3c64f';
    pants(d,g,'#eaf3ff'); legs(d,g,'#eaf3ff');
    if (g.up){ d.rr(-g.bw/2-2.6,BY-1,g.bw+5.2,BH*.84,4,w); for (let i=0;i<6;i++) d.circle(-g.bw/2-1.4+i*(g.bw+2.8)/5, BY-1+BH*.84, 2.2, w); star5(d,0,BY+7,2.4,gd,{}); d.line(k=>{ k.moveTo(-g.bw/2-2.4,BY-.4); k.lineTo(g.bw/2+2.4,BY-.4); }, gd, 1, .9); }
    else { capeSides(d,g,w); for (const sx of (g.side ? [-1] : [-1,1])) for (const yy of [3,8,13]) d.circle(sx*(g.bw/2+.8)+(g.side?-1.6:0),BY+yy,1.9,w,{noShadow:true}); }
    torso(d,g,s); d.rr(-g.bw/2,BY+BH*.5,g.bw,1.8,.9,gd,ff);
    if (!g.up){ const cx = g.side ? 2.2 : 0; if (!g.side){ cloud(d,-2.6,BY+5,2,w); for (const xx of [2.4,4.6]) d.rr(xx-.3,BY+4,.6,2.2,.3,'#7cbcff',ff); } d.circle(cx,BY+BH*.5+.9,1.4,'#7cc8ff'); d.dot(cx-.4,BY+BH*.5+.5,.4,'#fff',.9); }
    if (!g.up){ fluffRow(d,-g.bw/2-1.2,g.bw/2+1.2,BY-.4,1.6,w); }
    sleeves(d,g,s); cuffs(d,g,w); hands(d,g); }},
};
Object.assign(SETS, SETS_OTU);
// ----- 오투모 모자 · 액세서리 · 상의 도움 -----
// 오투모 헬멧: 중심 (0, HC), 반지름 약 R*1.1. 바이저는 HY-2.8 ~ HY+7.3 (앞모습 x ±15.6) — 손에 든 물건은 바깥쪽으로 기울여 바이저를 가리지 않아요
const HC = HY - 1;
const leafAt = (d, x, y, rx, ry, a, col, o=ff) => d.shape(c=>{ c.beginPath(); c.ellipse(x, y, rx, ry, a, 0, 7); }, col, [x, y, Math.max(rx, ry)], o);
const clipTo = (g, path, fn) => { const c = g.c; c.save(); path(c); c.clip(); fn(); c.restore(); };
const bandPath = (a, b, w=1.38) => k=>{ k.beginPath(); k.moveTo(-R*w,HY-R*a); k.quadraticCurveTo(0,HY-R*(a-.1),R*w,HY-R*a); k.lineTo(R*w,HY-R*b); k.quadraticCurveTo(0,HY-R*(b-.1),-R*w,HY-R*b); k.closePath(); };
const headband = (d, col, w=1.8) => d.line(k=>{ k.ellipse(0,HY-R*.3,R*1.14,R*1.02,0,Math.PI*1.08,Math.PI*1.92); }, col, w, .95);
const sunflower = (d, x, y, r) => { for (let i=0;i<12;i++){ const a = i*Math.PI/6; leafAt(d, x+Math.cos(a)*r*.64, y+Math.sin(a)*r*.64, r*.46, r*.22, a, i%2 ? '#ffd23f' : '#ffc21a'); }
  d.circle(x, y, r*.44, '#8a5a3c', ff); for (const [dx,dy] of [[-.16,-.1],[.12,-.16],[0,.12],[.18,.1],[-.12,.18]]) d.dot(x+dx*r, y+dy*r, r*.06, '#5a3a24'); };
const MAPLE = [[0,-10],[1.8,-6.4],[4.2,-7.6],[3.6,-3.4],[8.6,-5],[7.2,-1.8],[9.4,.2],[5,1.4],[5.8,4],[1.6,2.6],[.5,4.6],[.6,9],[-.6,9],[-.5,4.6],[-1.6,2.6],[-5.8,4],[-5,1.4],[-9.4,.2],[-7.2,-1.8],[-8.6,-5],[-3.6,-3.4],[-4.2,-7.6],[-1.8,-6.4]];
const maple = (d, x, y, s, col, a=0) => { const T = ([px,py]) => [x + (px*Math.cos(a) - py*Math.sin(a))*s/10, y + (px*Math.sin(a) + py*Math.cos(a))*s/10], P = MAPLE.map(T), o = T([0,1]);
  d.shape(c=>{ c.beginPath(); P.forEach(([px,py],i) => i ? c.lineTo(px,py) : c.moveTo(px,py)); c.closePath(); }, col, [x, y, s], {flat:true});
  d.line(c=>{ for (const i of [0,4,8,15,19,11]){ c.moveTo(...o); c.lineTo(...P[i]); } }, darken(col,.28), .45, .75); };
const spike = (d, x, y, a, s, col) => d.shape(c=>{ c.beginPath(); c.moveTo(x+Math.cos(a+1.57)*1.3*s, y+Math.sin(a+1.57)*1.3*s); c.lineTo(x+Math.cos(a)*3*s, y+Math.sin(a)*3*s); c.lineTo(x-Math.cos(a+1.57)*1.3*s, y-Math.sin(a+1.57)*1.3*s); c.closePath(); }, col, [x,y,2*s], ff);
const HATS_OTU = {
  oh01:{...OTU, name:'개구리 모자', draw:(d,g)=>{ const gr='#9fdc8a', lt='#d4f2c0', k='#2b2228';
    cap(d,gr,1.36,1.38,-.34,.06); d.shape(bandPath(.6,.3), lt, [0,HY-R*.45,R*1.3]);
    for (const [x, r, back] of (g.side ? [[-R*.18, 3.6, true], [R*.5, 4.6]] : [[-R*.56, 4.6], [R*.56, 4.6]])){ const y = HY-R*1.3; d.circle(x, y, r, gr); if (g.up || back) continue;
      const ix = x+(g.side?.6:0); d.circle(ix, y-.3, r*.7, '#fffaf2', ff); d.dot(ix+(g.side?.7:0), y, r*.36, k); d.dot(ix-.3, y-1.1, r*.13, '#ffffff'); }
    if (g.up){ for (const [x,y] of [[-5,-.9],[4,-1.05],[0,-.75],[-1.6,-1.25]]) d.dot(x, HY+R*y, 1.1, '#86c872'); return; }
    const mx = g.side ? R*.62 : 0, mw = g.side ? R*.36 : R*.5; d.line(k2=>{ k2.moveTo(mx-mw,HY-R*.86); k2.quadraticCurveTo(mx,HY-R*.66,mx+mw,HY-R*.86); }, '#5fa54f', .8, .95);
    for (const sx of (g.side?[1]:[-1,1])) d.dot(mx+sx*R*(g.side?.42:.82), HY-R*.8, 1.2, '#ffb3c6', .8); }},
  oh02:{...OTU, name:'해바라기 밀짚모자', draw:(d,g)=>{ const st='#f3d27a';
    d.ell(g.side?R*.15:0, HY-R*.62, R*1.72, R*.34, '#ecc566'); cap(d,st,1.3,1.46,-.6,.06); d.shape(bandPath(.9,.68,1.32), '#8fcf7a', [0,HY-R*.79,R*1.3], ff);
    d.line(k=>{ for (const x of [-.8,-.4,0,.4,.8]){ k.moveTo(R*x-1, HY-R*1.22); k.lineTo(R*x+1, HY-R*1.06); } }, '#d9b45a', .5, .7);
    const f = g.up ? -1 : 1, fx = g.side ? -R*.35 : f*R*.8, fy = HY-R*.98;
    leafAt(d, fx-f*4.8, fy+3, 3.2, 1.5, f*.5, '#7cc07c'); leafAt(d, fx+f*3.6, fy+4.4, 2.6, 1.3, -f*.6, '#6fb36f'); sunflower(d, fx, fy, 6.4); }},
  oh03:{...OTU, name:'빨간 버섯 모자', draw:(d,g)=>{ const rd='#f0646e', ox = g.side ? R*.1 : 0, yb = HY-R*.74, f = g.up ? -1 : 1;
    d.ell(ox, yb+1, R*1.46, 2.6, '#f3dcc0');
    d.shape(c=>{ c.beginPath(); c.moveTo(ox-R*1.62, yb); c.bezierCurveTo(ox-R*1.62, yb-R*1.46, ox+R*1.62, yb-R*1.46, ox+R*1.62, yb); c.quadraticCurveTo(ox, yb+R*.14, ox-R*1.62, yb); c.closePath(); }, rd, [ox, yb-R*.55, R*1.5]);
    for (const [x,y,r] of [[-.86,-.42,3.1],[.08,-.88,3.5],[.9,-.46,2.6],[.46,-.16,1.7],[-.3,-.22,1.5],[-1.3,-.14,1.4],[-.42,-.96,1.3],[1.32,-.12,1.2]]) d.circle(ox+f*R*x, yb+R*y, r, '#fffaf2', ff); }},
  oh04:{...OTU, name:'고양이 귀 머리띠', draw:(d,g)=>{ const fur='#f2b880', dk='#d98f55', pk='#ffb3c6';
    headband(d, dk, 2.2);
    for (const sx of (g.side?[-.3,.4]:[-1,1])){ const x0 = g.side ? R*sx : sx*R*.62, y0 = g.side ? HY-R*1.08 : HY-R*.96, s = g.side ? (sx < 0 ? -.6 : .6) : sx, c0 = g.c, x = 0, y = 0;
      c0.save(); c0.translate(x0, y0); c0.scale(1.45, 1.45); c0.rotate(g.side ? 0 : sx*.12);
      d.shape(c=>{ c.beginPath(); c.moveTo(x-4.6,y+1.4); c.quadraticCurveTo(x-2.4+s*1.2,y-6,x+s*1.6,y-9.6); c.quadraticCurveTo(x+2.6+s*1.2,y-5,x+4.6,y+1.4); c.quadraticCurveTo(x,y-.6,x-4.6,y+1.4); c.closePath(); }, fur, [x,y-4,5]);
      if (!g.up) d.shape(c=>{ c.beginPath(); c.moveTo(x-2.4,y); c.quadraticCurveTo(x-1+s*.8,y-4,x+s*1.2,y-6.6); c.quadraticCurveTo(x+1.6+s*.8,y-3.4,x+2.4,y); c.closePath(); }, pk, [x,y-3,3], ff);
      d.line(k=>{ k.moveTo(x-3.9,y-2.2); k.lineTo(x-2.5,y-2.7); k.moveTo(x+3.9,y-2.2); k.lineTo(x+2.5,y-2.7); }, dk, .7, .9); c0.restore(); } }},
  oh05:{...OTU, name:'여우 털모자', draw:(d,g)=>{ const o='#f2944a', w='#fffaf2', dk='#6a4434', lp = (A,B,t) => [A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t];
    for (const sx of (g.side?[-.35,.3]:[-1,1])){ const x = g.side ? R*sx : sx*R*.76, y = HY-R*1.02, s = g.side ? .4 : sx, T = [x+s*2.6, y-10.4], L0 = [x-4.4, y+2], R0 = [x+4.4, y+2];
      d.shape(c=>{ c.beginPath(); c.moveTo(...L0); c.lineTo(...T); c.lineTo(...R0); c.closePath(); }, o, [x,y-4,5]);
      d.shape(c=>{ c.beginPath(); c.moveTo(...T); c.lineTo(...lp(T,L0,.32)); c.lineTo(...lp(T,R0,.32)); c.closePath(); }, dk, [T[0],T[1]+2,2], ff);
      if (!g.up) d.shape(c=>{ c.beginPath(); c.moveTo(x-2.2,y+1.2); c.lineTo(x+s*1.6,y-5); c.lineTo(x+2.2,y+1.2); c.closePath(); }, w, [x,y-1,2.4], ff); }
    cap(d,o,1.36,1.38,-.46,.06); fluffRow(d,-R*1.36,R*1.36,HY-R*.48,2.3,w);
    if (!g.up){ const fx = g.side ? R*.55 : 0, fy = HY-R*.98; d.ell(fx, fy+2.2, g.side?3.2:4.4, 2.4, w, ff);
      for (const sx of (g.side?[-1]:[-1,1])) d.line(k=>{ k.moveTo(fx+sx*3.4-1,fy-.8); k.quadraticCurveTo(fx+sx*3.4,fy-2,fx+sx*3.4+1,fy-.8); }, dk, .7);
      d.ell(fx+(g.side?2:0), fy+1.2, 1, .7, dk, ff); } }},
  oh06:{...OTU, name:'수박 헬멧', draw:(d,g)=>{ const P = k=>capPath(k,1.38,1.44,-.56,.06);
    d.shape(P, '#6cc06c', [0,HY-R*.8,R*1.38]);
    clipTo(g, P, ()=>d.line(k=>{ for (let i=-4;i<=4;i++){ const x0 = i*R*.34 + (g.up ? R*.17 : 0); k.moveTo(x0, HY-R*.5); for (let j=1;j<=7;j++) k.lineTo(x0+(j%2?1.3:-1.3), HY-R*.5-j*R*.15); } }, '#3f8f4f', 1.7, .85));
    d.shape(bandPath(.64,.5), '#f4ffe8', [0,HY-R*.57,R*1.3], ff); d.shape(bandPath(.54,.34), '#ff6b7a', [0,HY-R*.44,R*1.3], ff);
    for (let i=-3;i<=3;i++){ const x = i*R*.3 + (g.side ? R*.15 : 0); if (Math.abs(x) < R*1.2) d.ell(x, HY-R*.4, .55, .9, '#3a2a2a', ff); }
    d.rr(-.8, HY-R*1.56, 1.6, 2.6, .6, '#8a6a3c'); d.line(k=>{ k.moveTo(.6,HY-R*1.5); k.quadraticCurveTo(3.6,HY-R*1.75,2.4,HY-R*1.55); }, '#5fae6f', .7, .9); }},
  oh07:{...OTU, name:'야구 모자', draw:(d,g)=>{ const rd='#f27a7a', dk='#d95f63', w='#fffaf2';
    if (g.side) d.shape(k=>{ k.beginPath(); k.moveTo(R*.5,HY-R*.5); k.quadraticCurveTo(R*1.5,HY-R*.62,R*1.72,HY-R*.36); k.quadraticCurveTo(R*1.2,HY-R*.3,R*.5,HY-R*.32); k.closePath(); }, dk, [R*1.1,HY-R*.42,R*.6]);
    cap(d,rd,1.34,1.4,-.44,.08);
    d.line(k=>{ for (const x of (g.side ? [-.3, .35] : [-.55, 0, .55])){ k.moveTo(R*x*.4, HY-R*1.4); k.quadraticCurveTo(R*x*1.3, HY-R*1.1, R*x*1.6, HY-R*.5); } }, dk, .5, .55);
    d.circle(0, HY-R*1.4, 1.4, w);
    if (g.up){ d.shape(c=>{ c.beginPath(); c.arc(0, HY-R*.44, 3.4, Math.PI, 0); c.closePath(); }, '#ffe3e4', [0,HY-R*.5,3], ff); d.rr(-3.6, HY-R*.48, 7.2, 1.2, .5, dk, ff); return; }
    const bx = g.side ? R*.62 : 0, by = HY-R*.96; d.circle(bx, by, 3.4, w, ff);
    d.line(k=>{ k.arc(bx-4.6, by, 3.4, -.7, .7); k.moveTo(bx+2, by+Math.sin(Math.PI-.7)*3.4); k.arc(bx+4.6, by, 3.4, Math.PI-.7, Math.PI+.7); }, '#ff5f6a', .5, .95);
    if (!g.side) d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.02,HY-R*.46); k.quadraticCurveTo(0,HY-R*.38,R*1.02,HY-R*.46); k.quadraticCurveTo(R*.86,HY-R*.18,0,HY-R*.14); k.quadraticCurveTo(-R*.86,HY-R*.18,-R*1.02,HY-R*.46); k.closePath(); }, dk, [0,HY-R*.32,R]); }},
  oh08:{...OTU, name:'우산 모자', draw:(d,g)=>{ const a='#8fd3e8', b='#fffaf2', st='#a8744f', ox = g.side ? R*.08 : 0, yb = HY-R*1.32, W = R*1.62, H = R*.92, n = 6, X = i => ox-W+2*W*i/n;
    headband(d, '#f3c64f');
    d.rr(ox-.7, yb-1, 1.4, R*.22+1, .6, st);
    const P = c=>{ c.beginPath(); c.ellipse(ox, yb, W, H, 0, Math.PI, 0); for (let i=n;i>0;i--) c.quadraticCurveTo((X(i)+X(i-1))/2, yb+3.2, X(i-1), yb); c.closePath(); };
    d.shape(P, a, [ox, yb-H*.5, W]);
    clipTo(g, P, ()=>{ for (let i=(g.up?1:0);i<n;i+=2) d.shape(c=>{ c.beginPath(); c.moveTo(ox, yb-H-2); c.lineTo(X(i), yb+4); c.lineTo(X(i+1), yb+4); c.closePath(); }, b, [(X(i)+X(i+1))/2, yb-H*.4, 6], ff); });
    d.line(k=>{ for (let i=1;i<n;i++){ k.moveTo(ox, yb-H); k.lineTo(X(i), yb); } }, '#6fbcd6', .4, .55);
    for (let i=0;i<=n;i++) d.dot(X(i), yb+.2, .8, st);
    d.circle(ox, yb-H-1.2, 1.3, st); }},
  oh09:{...OTU, name:'펭귄 비니', draw:(d,g)=>{ const nv='#3e4a6e', w='#fffaf2';
    cap(d,nv,1.36,1.42,-.34,.06); d.shape(bandPath(.62,.3), '#4f5c84', [0,HY-R*.46,R*1.3]);
    d.line(k=>{ for (let i=-4;i<=4;i++){ k.moveTo(i*R*.3,HY-R*.58); k.lineTo(i*R*.3,HY-R*.34); } }, '#36406a', .6, .6);
    if (g.up){ d.ell(0, HY-R*1.0, 2.6, 1.6, '#4f5c84', ff); return; }
    const fx = g.side ? R*.55 : 0, fy = HY-R*1.0;
    if (g.side) d.ell(fx, fy, 4.6, 4.8, w, ff); else { for (const sx of [-1,1]) d.ell(fx+sx*3.2, fy-.4, 4.2, 4.4, w, ff); d.ell(fx, fy+1.6, 6.6, 3.2, w, ff); }
    for (const sx of (g.side?[1]:[-1,1])){ const ex = g.side ? fx+1.2 : fx+sx*3; d.dot(ex, fy-.8, 1, '#2b2228'); d.dot(ex+.35, fy-1.15, .35, '#ffffff'); }
    const bx = g.side ? fx+3.4 : fx; d.shape(c=>{ c.beginPath(); c.moveTo(bx-1.4,fy+1); c.lineTo(bx+1.4,fy+1); c.lineTo(bx+(g.side?1.6:0),fy+3.2); c.closePath(); }, '#ffb347', [bx,fy+2,1.6], ff);
    for (const sx of (g.side?[-1]:[-1,1])) d.dot(fx+sx*5.2, fy+1.6, 1, '#ffb3c6', .8); }},
  oh10:{...OTU, name:'아기 양 털모자', draw:(d,g)=>{ const wl='#f6efe2', ear='#e8c9a6';
    for (const sx of (g.side?[-1]:[-1,1])){ const ex = g.side ? -R*.25 : sx*(R*1.22+2.4), ea = g.side ? .9 : sx*.45;
      leafAt(d, ex, HY-R*.62, 4.6, 2.2, ea, ear, {}); if (!g.up) leafAt(d, ex, HY-R*.62, 3, 1.1, ea, '#ffc9d0'); }
    cap(d,wl,1.36,1.4,-.42,.06);
    for (let i=0;i<=10;i++){ const a = Math.PI*(1.0 + i*.1); d.circle(Math.cos(a)*R*1.3, HY-R*.3 + Math.sin(a)*R*1.06, 3.4, wl, {noShadow:true}); }
    d.line(k=>{ for (const [x,y] of [[-.7,-1.0],[0,-1.2],[.7,-1.0],[-.35,-.75],[.4,-.78],[-1,-.62],[1,-.6]]){ const px = R*x, py = HY+R*y; k.moveTo(px+1.4,py); k.arc(px,py,1.4,0,Math.PI*1.5); } }, '#e2d3bb', .6, .9);
    if (g.up) return;
    const fx = g.side ? R*.62 : 0, fy = HY-R*.6; d.ell(fx, fy, g.side ? 3.2 : 4.4, 3, '#f3d9c0', ff);
    for (const sx of (g.side?[1]:[-1,1])) d.line(k=>{ const x = fx+(g.side?.6:sx*1.8); k.moveTo(x-.8,fy-.6); k.quadraticCurveTo(x,fy+.2,x+.8,fy-.6); }, '#5a3a44', .55);
    d.ell(fx+(g.side?2:0), fy+1.3, .7, .45, '#e98fa0', ff); }},
  oh11:{...OTU, name:'단풍잎 니트 모자', draw:(d,g)=>{ const bd='#b0754a', f = g.up ? -1 : 1;
    cap(d,'#c98a5a',1.36,1.42,-.3,.06); d.shape(bandPath(.62,.28), bd, [0,HY-R*.45,R*1.3]);
    d.line(k=>{ for (let i=-4;i<=4;i++){ k.moveTo(i*R*.3,HY-R*.58); k.lineTo(i*R*.3,HY-R*.32); } }, '#9a6440', .6, .6);
    d.circle(0, HY-R*1.44, 2.6, bd);
    const lx = g.side ? -R*.1 : f*R*.5; maple(d, lx, HY-R*1.2, 7, '#f0703f', f*.35); maple(d, lx+(g.side?-7:f*7.4), HY-R*.98, 5, '#f7a541', f*-.5); }},
  oh12:{...OTU, name:'무당벌레 머리띠', draw:(d,g)=>{ const rd='#f05a5a', k='#2e2838', bx = g.side ? R*.05 : 0, by = HY-R*1.36;
    headband(d, k);
    const head = () => g.side ? d.circle(bx+7, by+1.8, 3, k) : d.circle(bx, by+5, 3.3, k);
    if (g.up) head(); d.ell(bx, by, g.side ? 7.6 : 8.4, 6.2, rd); if (!g.up) head();
    if (!g.side) d.line(c=>{ c.moveTo(bx, by-6); c.lineTo(bx, by+(g.up?6:3)); }, k, .7, .9);
    for (const [x,y,r] of [[-4.4,-1.6,1.5],[4.4,-1.6,1.5],[-2.6,2.4,1.2],[2.6,2.4,1.2],[-2,-3.8,1],[2,-3.8,1]]) d.circle(bx+x*(g.side?.9:1), by+y, r, k, ff);
    if (g.up) return;
    const hx = g.side ? bx+7.6 : bx; for (const sx of (g.side?[1]:[-1,1])) d.dot(hx+sx*1.3, by+(g.side?1.4:4.8), .7, '#fffaf2');
    d.line(c=>{ for (const sx of (g.side?[1]:[-1,1])){ c.moveTo(hx+sx*1, by+(g.side?-.6:2.2)); c.quadraticCurveTo(hx+sx*3, by-(g.side?3:1), hx+sx*4.4, by-(g.side?3:1.6)); } }, k, .6, .9); }},
  oh13:{...OTU, name:'컵케이크 모자', draw:(d,g)=>{ const fr='#bfeedd', fr2='#a6e3cc', ox = g.side ? R*.08 : 0, f = g.up ? -1 : 1;
    d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.38,HY-R*.38); k.lineTo(-R*1.22,HY-R*1.0); k.quadraticCurveTo(0,HY-R*1.08,R*1.22,HY-R*1.0); k.lineTo(R*1.38,HY-R*.38); k.quadraticCurveTo(0,HY-R*.28,-R*1.38,HY-R*.38); k.closePath(); }, '#ffb3c6', [0,HY-R*.7,R*1.3]);
    d.line(k=>{ for (let i=-5;i<=5;i++){ k.moveTo(i*R*.225, HY-R*1.02); k.lineTo(i*R*.25, HY-R*.36); } }, '#f598b8', .7, .8);
    for (const [y,rx,ry,col] of [[-1.06,1.42,.34,fr],[-1.34,1.14,.32,fr2],[-1.6,.84,.28,fr],[-1.82,.5,.22,fr2]]) d.ell(ox, HY+R*y, R*rx, R*ry, col);
    d.shape(c=>{ c.beginPath(); c.moveTo(ox-2.4,HY-R*1.9); c.quadraticCurveTo(ox,HY-R*2.24,ox+1.2,HY-R*2.2); c.quadraticCurveTo(ox+.6,HY-R*2.0,ox+2.4,HY-R*1.9); c.closePath(); }, fr, [ox,HY-R*2,2.4]);
    for (const [x,y,a,col] of [[-.8,-1.1,.6,'#ff8fb0'],[-.3,-1.2,-.5,'#ffe07a'],[.5,-1.12,.3,'#a9c7ef'],[.95,-1.02,-.8,'#ff8fb0'],[-.45,-1.42,.9,'#a9c7ef'],[.35,-1.46,-.3,'#ff8fb0'],[0,-1.66,.5,'#ffe07a'],[-1.1,-1.0,-.2,'#ffe07a']]){ const px = ox+R*x*f, py = HY+R*y; d.line(k=>{ k.moveTo(px-Math.cos(a)*.9, py-Math.sin(a)*.9); k.lineTo(px+Math.cos(a)*.9, py+Math.sin(a)*.9); }, col, .8, .95); } }},
  oh14:{...OTU, name:'바이킹 투구', draw:(d,g)=>{ const st='#c9ced8', dk='#9aa1ae';
    const horn = (sx, s) => { d.shape(c=>{ c.beginPath(); c.moveTo(sx*R*.9*s, HY-R*.72); c.quadraticCurveTo(sx*R*1.8*s, HY-R*.9, sx*R*1.78*s, HY-R*1.98); c.quadraticCurveTo(sx*R*1.42*s, HY-R*1.2, sx*R*.9*s, HY-R*1.18); c.closePath(); }, '#fff1d6', [sx*R*1.4*s, HY-R*1.3, 6]);
      d.line(k=>{ k.moveTo(sx*R*1.24*s, HY-R*1.2); k.lineTo(sx*R*1.5*s, HY-R*.98); }, '#d9b38c', 1.1, .9); };
    horn(-1, g.side ? .62 : 1); horn(1, g.side ? .62 : 1);
    cap(d,st,1.36,1.42,-.4,.06);
    d.rr(-R*1.36, HY-R*.74, R*2.72, R*.32, R*.14, dk);
    if (!g.up) for (let i=-4;i<=4;i++) d.dot(i*R*.3+(g.side?R*.1:0), HY-R*.58, .6, '#eef0f6');
    d.rr(-1.3+(g.side?R*.5:0), HY-R*1.42, 2.6, R*.7, 1.2, dk, ff);
    if (!g.up && !g.side) d.rr(-1.4, HY-R*.5, 2.8, 3.6, 1.3, dk); }},
  oh15:{...OTU, name:'문어 모자', draw:(d,g)=>{ const p='#ff9fb0', dk='#f27f95', lt='#ffd1da', ox = g.side ? R*.08 : 0, yb = HY-R*.86;
    for (const sx of [-1,1]){ const arm = k=>{ k.moveTo(ox+sx*R*1.0, yb); k.quadraticCurveTo(ox+sx*R*1.55, yb+2, ox+sx*R*1.44, HY-R*.05); k.quadraticCurveTo(ox+sx*R*1.38, HY+R*.18, ox+sx*R*1.2, HY+R*.06); };
      d.line(arm, p, 3.4); for (const t of [.35,.6]) d.dot(ox+sx*R*(1.38+t*.06), yb+(HY-yb)*t+2, .55, lt);
      d.line(k=>{ k.moveTo(ox+sx*R*.52, yb); k.quadraticCurveTo(ox+sx*R*.8, HY-R*.62, ox+sx*R*.76, HY-R*.42); k.quadraticCurveTo(ox+sx*R*.7, HY-R*.3, ox+sx*R*.58, HY-R*.38); }, p, 2.8); }
    d.shape(c=>{ c.beginPath(); c.moveTo(ox-R*1.1, yb+1); c.bezierCurveTo(ox-R*1.25, yb-R*1.55, ox+R*1.25, yb-R*1.55, ox+R*1.1, yb+1); c.quadraticCurveTo(ox, yb+R*.2, ox-R*1.1, yb+1); c.closePath(); }, p, [ox, yb-R*.5, R*1.2]);
    for (const [x,y,r] of [[-.6,-.9,1.4],[.5,-1.0,1.1],[.05,-1.15,.9]]) d.dot(ox+x*R*(g.up?-1:1), yb+R*y, r, lt, .85);
    if (g.up) return;
    for (const sx of (g.side?[1]:[-1,1])){ const ex = g.side ? ox+R*.55 : ox+sx*R*.42, ey = yb-R*.42; d.ell(ex, ey, 2, 2.6, '#fffaf2', ff); d.dot(ex+(g.side?.6:.3), ey+.3, 1.2, '#2b2228'); d.dot(ex-.2, ey-.6, .4, '#ffffff'); d.dot(ex+(g.side?-2.4:sx*2.8), ey+2.6, 1.1, dk, .8); }
    d.circle(g.side ? ox+R*.9 : ox, yb-R*.1, .9, dk, ff); }},
  oh16:{...OTU, name:'카우보이 모자', draw:(d,g)=>{ const br='#c98f5a', dk='#7a4a32', ox = g.side ? R*.1 : 0, yb = HY-R*.78, W = g.side ? R*1.7 : R*1.9;
    d.shape(c=>{ c.beginPath(); c.moveTo(ox-R*.98, yb+1); c.lineTo(ox-R*1.05, yb-R*.75); c.quadraticCurveTo(ox-R*.55, yb-R*1.15, ox, yb-R*.85); c.quadraticCurveTo(ox+R*.55, yb-R*1.15, ox+R*1.05, yb-R*.75); c.lineTo(ox+R*.98, yb+1); c.closePath(); }, br, [ox,yb-R*.5,R]);
    d.line(k=>{ k.moveTo(ox, yb-R*.84); k.lineTo(ox, yb-R*.55); }, '#a8744f', .8, .7);
    d.rr(ox-R*1.0, yb-R*.3, R*2.0, R*.26, 1, dk);
    if (!g.up) d.rr(ox+(g.side?R*.5:R*.35), yb-R*.32, 2.6, R*.3, .5, '#f3c64f', ff);
    d.shape(c=>{ c.beginPath(); c.moveTo(ox-W, yb-R*.4); c.quadraticCurveTo(ox-W*.75, yb+R*.25, ox, yb+R*.24); c.quadraticCurveTo(ox+W*.75, yb+R*.25, ox+W, yb-R*.4); c.quadraticCurveTo(ox+W*.7, yb-R*.05, ox, yb-R*.06); c.quadraticCurveTo(ox-W*.7, yb-R*.05, ox-W, yb-R*.4); c.closePath(); }, br, [ox, yb, W]);
    d.line(k=>{ k.moveTo(ox-W*.8, yb-R*.12); k.quadraticCurveTo(ox, yb+R*.2, ox+W*.8, yb-R*.12); }, '#e0b07a', .6, .7); }},
  oh17:{...OTU, name:'프로펠러 모자', draw:(d,g)=>{ const pk='#ffadc0', y='#ffe07a', bl='#9fd0ff';
    if (g.side) d.shape(k=>{ k.beginPath(); k.moveTo(R*.5,HY-R*.48); k.quadraticCurveTo(R*1.45,HY-R*.6,R*1.6,HY-R*.34); k.quadraticCurveTo(R*1.15,HY-R*.28,R*.5,HY-R*.3); k.closePath(); }, '#9fe0c8', [R*1.1,HY-R*.4,R*.6]);
    cap(d,pk,1.34,1.4,-.42,.08);
    if (!g.side) d.shape(c=>{ c.beginPath(); c.ellipse(0,HY-R*.9,R*.36,R*.5,0,Math.PI,0); c.lineTo(R*.36,HY-R*.45); c.quadraticCurveTo(0,HY-R*.4,-R*.36,HY-R*.45); c.closePath(); }, y, [0,HY-R*.9,R*.5], {flat:true});
    else d.shape(c=>{ c.beginPath(); c.ellipse(R*.3,HY-R*.9,R*.4,R*.5,0,Math.PI,0); c.lineTo(R*.7,HY-R*.45); c.quadraticCurveTo(R*.3,HY-R*.4,-R*.1,HY-R*.45); c.closePath(); }, bl, [R*.3,HY-R*.9,R*.5], {flat:true});
    if (!g.up && !g.side) d.shape(k=>{ k.beginPath(); k.moveTo(-R*1.0,HY-R*.44); k.quadraticCurveTo(0,HY-R*.36,R*1.0,HY-R*.44); k.quadraticCurveTo(R*.85,HY-R*.14,0,HY-R*.1); k.quadraticCurveTo(-R*.85,HY-R*.14,-R*1.0,HY-R*.44); k.closePath(); }, '#9fe0c8', [0,HY-R*.3,R]);
    const py = HY-R*1.52; d.rr(-.6,py,1.2,R*.16,.5,'#9aa3b4'); d.ell(-4.6,py-.6,4.4,1.3,bl); d.ell(4.6,py-.6,4.4,1.3,y); d.circle(0,py-.4,1.6,'#ff7fa6'); }},
  oh18:{...OTU, name:'낮잠 병아리', draw:(d,g)=>{ const y='#ffe27a', o='#ff9f4a', s = g.up ? -1 : 1, bx = 0, by = HY-R*1.24;
    d.ell(bx, by+1.2, 8.4, 2.6, '#c9a06a'); d.line(k=>{ for (let i=-3;i<=3;i++){ k.moveTo(bx+i*2.2-1.4,by+.4); k.lineTo(bx+i*2.2+1.4,by+2.2); } }, '#a8804a', .5, .8);
    d.ell(bx, by-2.2, 6, 4.6, y);
    const hx = g.side ? bx+2.2 : bx, hy = by-7.4; d.circle(hx, hy, 4, y);
    d.ell(hx+(g.side?-1:-.6)*s, hy-4.2, .8, 1.6, '#f7cf4f', {noShadow:true}); d.ell(hx+.8*s, hy-4, .7, 1.3, '#f7cf4f', {noShadow:true});
    if (g.side) d.ell(bx-1.4, by-2.2, 2.6, 1.8, '#f7cf4f', {noShadow:true}); else for (const sx of [-1,1]) d.ell(bx+sx*5.6, by-2, 1.4, 2.6, '#f7cf4f', {noShadow:true});
    if (g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(bx-1.4,by-3); c.lineTo(bx,by-6); c.lineTo(bx+1.4,by-3); c.closePath(); }, '#f7cf4f', [bx,by-4,2]); return; }
    const ex = g.side ? [hx+1.8] : [hx-1.6, hx+1.6]; for (const e of ex) d.line(k=>{ k.moveTo(e-.9,hy-.3); k.quadraticCurveTo(e,hy+.7,e+.9,hy-.3); }, '#2b2228', .6);
    const kx = g.side ? hx+4 : hx; d.shape(c=>{ c.beginPath(); c.moveTo(kx-1,hy+.9); c.lineTo(kx+(g.side?1.6:1),hy+.9+(g.side?.5:0)); c.lineTo(kx+(g.side?0:0),hy+2.4); c.closePath(); }, o, [kx,hy+1.4,1.4], ff);
    for (const e of ex) d.dot(e+(e<hx?-.9:.9)*(g.side?0:1)+(g.side?.4:0), hy+1.6, .75, '#ffb3a6', .7);
    d.line(k=>{ k.moveTo(hx+5,hy-4); k.lineTo(hx+7,hy-4); k.lineTo(hx+5,hy-2); k.lineTo(hx+7,hy-2); }, '#9fb8ff', .6, .9); }},
  oh19:{...OTU, name:'선인장 화분 모자', draw:(d,g)=>{ const gr='#7cc78a', dk='#5fae6f', ox = g.side ? R*.08 : 0, py = HY-R*1.36, f = g.up ? -1 : 1;
    headband(d, '#c96f45');
    d.rr(ox-f*8.6-(f<0?3.6:0), py-12.4, 3.6, 7, 1.8, gr); d.rr(ox-f*7.2-(f<0?4.4:0), py-7.4, 4.4, 3, 1.5, gr);
    d.rr(ox+f*5-(f<0?3.6:0), py-15, 3.6, 7, 1.8, gr); d.rr(ox+f*2.8-(f<0?4.4:0), py-10, 4.4, 3, 1.5, gr);
    d.rr(ox-4.4, py-17.6, 8.8, 15, 4.4, gr);
    d.line(k=>{ for (const x of [-1.6,1.6]){ k.moveTo(ox+x, py-15.6); k.lineTo(ox+x, py-4); } }, dk, .6, .8);
    for (const [x,y] of [[-3,-13],[0,-15.4],[3,-11.6],[-3,-8],[2.8,-6.4],[0,-10],[-7,-9.6],[6.8,-12.6]]) d.dot(ox+f*x, py+y, .45, '#fffaf2');
    d.shape(c=>{ c.beginPath(); c.moveTo(ox-6.2,py-3.2); c.lineTo(ox+6.2,py-3.2); c.lineTo(ox+4.8,py+4.4); c.quadraticCurveTo(ox,py+5.2,ox-4.8,py+4.4); c.closePath(); }, '#e0875a', [ox,py+1,6]);
    d.rr(ox-7,py-4.8,14,3,1.3,'#c96f45');
    if (!g.up){ const fx = ox+(g.side?1.6:0); for (const sx of (g.side?[1]:[-1,1])) d.dot(fx+sx*2, py+.8, .6, '#5a3a2a'); d.line(k=>{ k.moveTo(fx-.9,py+2); k.quadraticCurveTo(fx,py+2.9,fx+.9,py+2); }, '#5a3a2a', .5); } }},
  oh20:{...OTU, name:'화가 베레모', draw:(d,g)=>{ const sx = g.up ? 1 : -1, p='#d9616f', p2='#c24f5e';
    const brush = (x, y, a) => { const c = g.c; c.save(); c.translate(x, y); c.rotate(a); d.rr(-.7, -2, 1.4, 11, .6, '#c9935f'); d.rr(-.9, -4.2, 1.8, 2.6, .4, '#c9ced8'); d.shape(k=>{ k.beginPath(); k.moveTo(-.9,-4.2); k.quadraticCurveTo(-1.1,-7,0,-8.6); k.quadraticCurveTo(1.1,-7,.9,-4.2); k.closePath(); }, '#5fa8ff', [0,-6,2], ff); c.restore(); };
    if (g.side) brush(-R*.6, HY-R*1.0, -.5); else brush(-sx*R*1.05, HY-R*.9, -sx*.45);
    d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*.22, HY-R*1.02, R*1.5, R*.62, sx*.12, 0, Math.PI*2); }, p, [0,HY-R,R*1.4]);
    d.shape(k=>capPath(k,1.3,1.3,-.62,.06), p2, [0,HY-R*.7,R*1.2], {flat:true});
    d.shape(k=>{ k.beginPath(); k.ellipse(sx*R*.22, HY-R*1.08, R*1.48, R*.5, sx*.12, Math.PI*1.05, Math.PI*1.95); k.ellipse(sx*R*.22, HY-R*1.02, R*1.5, R*.62, sx*.12, Math.PI*1.95, Math.PI*1.05, true); }, p, [0,HY-R*1.2,R*1.4], {flat:true, noShadow:true});
    d.dot(sx*R*.1,HY-R*1.6,1.3,p2);
    for (const [x,y,col] of [[.6,-1.25,'#5fa8ff'],[.05,-1.42,'#ffd45a'],[-.5,-1.3,'#7cc78a'],[1.0,-1.0,'#fffaf2']]){ d.circle(-sx*R*x, HY+R*y, 1.5, col, ff); d.dot(-sx*R*x+.9, HY+R*y+1.3, .55, col); } }},
};
const ACCS_OTU = {
  oa01:{...OTU, name:'비눗방울 막대', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), c = g.c, lx = hx+4.4, ly = hy-8.4;
    const bub = (x, y, r) => { c.save(); c.globalAlpha = .35; d.circle(x, y, r, '#cfefff', ff); c.restore(); d.line(k=>{ k.arc(x, y, r, 0, 7); }, '#a6dcf0', .5, .85); d.line(k=>{ k.arc(x, y, r*.7, Math.PI*1.05, Math.PI*1.45); }, '#ffffff', .6, .95); d.line(k=>{ k.arc(x, y, r*.78, Math.PI*.1, Math.PI*.42); }, '#ffb3d9', .5, .8); };
    for (const [dx,dy,r] of [[9.6,-15,3.8],[14.2,-8.4,2.6],[11.6,-23.4,2.4],[16.6,-17.4,1.7],[12.6,-19.4,1.2]]) bub(hx+dx, hy+dy, r);
    d.line(k=>{ k.moveTo(hx-.4,hy+2.6); k.lineTo(lx-1.4,ly+2.2); }, '#ff9fbe', 1.3);
    d.line(k=>{ k.arc(lx, ly, 2.6, 0, 7); }, '#ff9fbe', 1.1); c.save(); c.globalAlpha = .35; d.circle(lx, ly, 2.1, '#d9f2ff', ff); c.restore();
    d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa02:{...OTU, name:'종이 연', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), kx = hx+15, ky = HY-R*.95;
    const bz = t => { const u = 1-t; return [u*u*u*kx+3*u*u*t*(kx+4)+3*u*t*t*(kx-1)+t*t*t*(kx+4), u*u*u*(ky+9)+3*u*u*t*(ky+13)+3*u*t*t*(ky+16)+t*t*t*(ky+21)]; };
    d.line(k=>{ k.moveTo(hx+.4,hy-1.6); k.quadraticCurveTo(hx+12,hy-8,kx-.6,ky+8.6); }, '#9a8a94', .45, .9);
    d.line(k=>{ k.moveTo(kx,ky+9); k.bezierCurveTo(kx+4,ky+13,kx-1,ky+16,kx+4,ky+21); }, '#9a8a94', .45, .9);
    for (const [t,col] of [[.35,'#ffe07a'],[.68,'#9fdcc8'],[1,'#ff8f8f']]){ const [x,y] = bz(t); d.shape(c=>{ c.beginPath(); c.moveTo(x-1.5,y-1); c.lineTo(x+1.5,y-1); c.lineTo(x,y+1.3); c.closePath(); }, col, [x,y,1.5], ff); }
    const Q = [[kx,ky-8.6],[kx+6.2,ky-1],[kx,ky+9],[kx-6.2,ky-1]];
    for (let i=0;i<4;i++){ const [x1,y1] = Q[i], [x2,y2] = Q[(i+1)%4]; d.shape(c=>{ c.beginPath(); c.moveTo(kx,ky-1); c.lineTo(x1,y1); c.lineTo(x2,y2); c.closePath(); }, i%2 ? '#fffaf2' : '#ff8f8f', [kx,ky-1,6], {flat:true}); }
    d.line(k=>{ k.moveTo(kx,ky-8.6); k.lineTo(kx,ky+9); k.moveTo(kx-6.2,ky-1); k.lineTo(kx+6.2,ky-1); }, '#c9935f', .6, .9);
    if (!g.up){ d.dot(kx-2,ky-2.6,.6,'#5a3a44'); d.dot(kx+2,ky-2.6,.6,'#5a3a44'); d.line(k=>{ k.moveTo(kx-1,ky+.6); k.quadraticCurveTo(kx,ky+1.6,kx+1,ky+.6); }, '#5a3a44', .5); }
    d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa03:{...OTU, name:'아이스크림 콘', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), c = g.c;
    c.save(); c.translate(hx,hy); c.rotate(g.up ? -.3 : g.side ? .62 : .42); c.scale(1.25, 1.25);
    d.shape(k=>{ k.beginPath(); k.moveTo(-3.2,-5); k.lineTo(3.2,-5); k.lineTo(0,4.2); k.closePath(); }, '#e8b878', [0,-1,4]);
    d.line(k=>{ k.moveTo(-2.2,-4.6); k.lineTo(1.2,1.8); k.moveTo(.4,-4.8); k.lineTo(2.4,-1); k.moveTo(2.2,-4.6); k.lineTo(-1.2,1.8); k.moveTo(-.4,-4.8); k.lineTo(-2.4,-1); }, '#c9935f', .5, .8);
    d.circle(0,-12.4,3.1,'#c9a07a'); for (const [x,y] of [[-1.2,-13.4],[1,-12.2],[-.2,-14.4]]) d.dot(x,y,.4,'#7a5040');
    d.circle(0,-7.6,3.7,'#bfeedd'); for (const x of [-2.8,-1,1,2.8]) d.circle(x,-5.2,1.1,'#bfeedd',ff); d.dot(-1.2,-8.8,.8,'#ffffff',.7);
    c.restore(); d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa04:{...OTU, name:'거북이 등딱지', draw:(d,g)=>{ const sh='#7fbf6a', pl='#a6d98a', rim='#e8d49a', st='#5f9a52';
    const plates = (x, y, s) => { d.shape(c=>{ c.beginPath(); for (let i=0;i<6;i++){ const a = i*Math.PI/3; c.lineTo(x+Math.cos(a)*2.4*s, y+Math.sin(a)*2.2*s); } c.closePath(); }, pl, [x,y,2.4*s], ff); for (let i=0;i<6;i++){ const a = i*Math.PI/3 + Math.PI/6; d.ell(x+Math.cos(a)*4.6*s, y+Math.sin(a)*4.2*s, 1.5*s, 1.3*s, pl, ff); } };
    if (g.up){ d.ell(0,BY+16.4,1.5,1.9,pl); d.ell(0,BY+9,8.6,7.8,rim); d.ell(0,BY+9,7.6,6.8,sh); plates(0,BY+9,1); return; }
    if (g.side){ const x0 = -g.bw/2+.4; d.shape(c=>{ c.beginPath(); c.moveTo(x0,BY+1.6); c.quadraticCurveTo(x0-7.4,BY+2,x0-6.8,BY+9.4); c.quadraticCurveTo(x0-5.6,BY+15.8,x0,BY+15.6); c.closePath(); }, sh, [x0-3,BY+9,7]);
      d.line(k=>{ k.moveTo(x0-.4,BY+15.4); k.quadraticCurveTo(x0-6,BY+15.6,x0-6.9,BY+9.4); }, rim, 1.2, .95); d.ell(x0-3.4,BY+7,1.8,2.4,pl,ff); d.ell(x0-3.6,BY+12,1.6,1.8,pl,ff);
      d.line(k=>{ k.moveTo(x0+.6,BY+1.4); k.quadraticCurveTo(1,BY+2.6,2.4,BY+BH*.5); }, st, 1.2, .95); return; }
    d.line(k=>{ k.moveTo(-4.6,BY+.4); k.lineTo(-4.2,BY+BH*.5); k.moveTo(4.6,BY+.4); k.lineTo(4.2,BY+BH*.5); }, st, 1.4, .95);
    const cx = -4.2, cy = BY+7; for (const [dx,dy] of [[-2.2,2],[2.2,2]]) d.ell(cx+dx, cy+dy, 1, .8, pl, ff); d.circle(cx-3.6,cy-.6,1.6,pl,ff); d.dot(cx-4.1,cy-1,.42,'#2b2228');
    d.ell(cx,cy,3.2,2.6,sh,ff); plates(cx, cy, .42); }},
  oa05:{...OTU, name:'강아지 인형 안기', draw:(d,g)=>{ const b='#f2dcb8', br='#b07a4f', cr='#fff6ea', k='#3a2430', S = .88;
    const pup = (x, y, back) => { const P = (dx, dy) => [x+dx*S, y+dy*S];
      if (!back){ d.ell(...P(0, 3.4), 5*S, 5.2*S, b); d.ell(...P(0, 4), 3*S, 3.2*S, cr, ff); for (const sx of [-1,1]) d.ell(...P(sx*3.4, 8), 2*S, 1.6*S, b); }
      d.circle(...P(0, -2.6), 4.8*S, b);
      for (const sx of [-1,1]){ const [ex, ey] = P(sx*4.3, -2.2); leafAt(d, ex, ey, 1.8*S, 3.6*S, sx*-.25, br, {}); }
      if (back) return;
      d.ell(...P(1.9, -3.1), 1.7*S, 1.5*S, '#d9b48c', ff); d.dot(...P(-1.9, -3), .62, k); d.dot(...P(1.9, -3), .62, k);
      d.ell(...P(0, -.9), 2.4*S, 1.7*S, cr, ff); d.ell(...P(0, -1.5), .95, .65, k, ff); d.ell(...P(0, .2), .55, .75, '#ff8fa6', ff);
      const [cx2, cy2] = P(0, 1.9); d.rr(cx2-2.8*S, cy2-.6, 5.6*S, 1.2, .5, '#ff7a7a', ff); d.dot(cx2, cy2+.9, .7, '#f3c64f'); };
    if (g.up){ pup(-g.bw/2-2.4, BY+BH*.42, true); return; }
    const [hx, hy] = handPos(g).at(-1), x = g.side ? hx + 1 : hx - 3.4, y = hy - 1.6; pup(x, y);
    d.ell(g.side ? x + 3.6 : hx, g.side ? hy + 1.2 : hy, 3.1, 3.7, g.sk); }},
  oa06:{...OTU, name:'풍선 다발', draw:(d,g)=>{ const [hx,hy] = g.pray ? [0, BY+BH*.16] : heldAt(g), B = [[hx+8,HY-R*1.55,'#ffb3d9'],[hx+14,HY-R*1.1,'#a9e6d0'],[hx+12,HY-R*2.0,'#ffe07a']];
    d.line(k=>{ for (const [bx,by] of B){ k.moveTo(hx,hy-1); k.quadraticCurveTo(hx+7,(hy+by)/2,bx,by+5.4); } }, '#9a8a94', .5, .9);
    for (const [bx,by,col] of B){ d.ell(bx,by,3.6,4.4,col); d.shape(c=>{ c.beginPath(); c.moveTo(bx-.9,by+5.2); c.lineTo(bx,by+4.2); c.lineTo(bx+.9,by+5.2); c.closePath(); }, col, [bx,by+4.6,1], ff); if (!g.up) d.ell(bx-1.3,by-1.6,.8,1.3,'#ffffff',ff); }
    if (!g.pray) d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa07:{...OTU, name:'뿅망치', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), c = g.c, pk='#ff9fbe', bl='#8fc8f0';
    c.save(); c.translate(hx, hy+.6); c.rotate(g.up ? -.35 : .55);
    d.rr(-.9, -9.6, 1.8, 12, .8, '#ffe07a');
    d.rr(-5.6, -15, 11.2, 6, 2.8, pk); for (const sx of [-1,1]) d.rr(sx > 0 ? 4.4 : -6.6, -15.4, 2.2, 6.8, 1, bl);
    d.line(k=>{ k.moveTo(-3.2,-13.6); k.quadraticCurveTo(0,-14.4,3.2,-13.6); }, '#ffffff', .7, .6);
    c.restore(); d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa08:{...OTU, name:'네잎클로버 목걸이', main:'#7cc78a', draw:(d,g)=>{ const gd='#e0ad3a', gr='#7cc78a', dk='#5fae6f';
    if (g.up){ d.line(k=>{ k.moveTo(-4,BY+.2); k.quadraticCurveTo(0,BY+1.6,4,BY+.2); }, gd, .7, .9); return; }
    const x = g.side ? 2.4 : 0, y = BY+5;
    d.line(k=>{ k.moveTo(x-(g.side?2.4:4.2),BY-.2); k.quadraticCurveTo(x,BY+4.4,x+(g.side?2.4:4.2),BY-.2); }, gd, .7, .95);
    d.circle(x, y, 3.6, '#fffaf2'); d.line(k=>{ k.arc(x,y,3.6,0,7); }, gd, .7, .95);
    for (const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]]) d.circle(x+dx*1.15, y+dy*1.15, 1.3, gr, ff);
    d.line(k=>{ k.moveTo(x+.4,y+.6); k.quadraticCurveTo(x+1.2,y+2,x+2,y+2.6); }, dk, .5, .95); d.dot(x,y,.5,dk); d.dot(x-2.2,y-1.6,.5,'#ffffff',.9); }},
  oa09:{...OTU, name:'큰 리본 핀', draw:(d,g)=>{ const bl='#7fc8f8', dk='#5fb0e8', c = g.c, bx = g.side ? -R*.3 : g.up ? -R*.74 : R*.74, by = g.side ? HY-R*1.1 : HY-R*.96;
    c.save(); c.translate(bx, by); c.rotate(g.up ? -.3 : .3);
    for (const sx of [-1,1]) d.shape(k=>{ k.beginPath(); for (const [px,py] of [[.3,.6],[1.6,.8],[3.6,6.6],[2.6,5.8],[1.8,7]]) k.lineTo(sx*px,py); k.closePath(); }, dk, [sx*2,4,3]);
    for (const sx of [-1,1]){ d.shape(k=>{ k.beginPath(); k.moveTo(0,0); k.quadraticCurveTo(sx*5.2,-6.2,sx*6.6,-1.6); k.quadraticCurveTo(sx*6.4,3.2,0,0); k.closePath(); }, bl, [sx*3.4,-1,4]);
      for (const [px,py] of [[4.2,-2],[5.4,.2],[2.8,-3.2],[3.4,.6]]) d.dot(sx*px, py, .5, '#ffffff', .9); }
    d.rr(-1.6,-1.8,3.2,3.6,1.4,dk); c.restore(); }},
  oa10:{...OTU, name:'아기 뱀 목도리', draw:(d,g)=>{ const m='#9fdcb0', dk='#7cc496', k='#2b2228', w = g.bw+2, x0 = -g.bw/2-1;
    d.rr(x0, BY-2, w, 4.4, 2.2, m); for (let x = x0+2; x < x0+w-1; x += 2.6) d.dot(x, BY+.2, .7, dk);
    if (g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-2.2,BY+1.4); c.quadraticCurveTo(1.6,BY+6,-.4,BY+10.4); c.quadraticCurveTo(2.4,BY+6,1,BY+1.4); c.closePath(); }, m, [0,BY+5,4]); return; }
    if (!g.side) d.shape(c=>{ c.beginPath(); c.moveTo(-6,BY+1.2); c.quadraticCurveTo(-6.8,BY+5.4,-4.6,BY+8.8); c.quadraticCurveTo(-4.8,BY+4.6,-3,BY+1.6); c.closePath(); }, m, [-5,BY+4,3]);
    const hx = g.side ? 3.4 : 4.4, hy = BY+4.8; d.rr(hx-1.8, BY, 3.6, 4.2, 1.6, m); d.ell(hx, hy, 3.4, 2.7, m);
    for (const sx of (g.side?[1]:[-1,1])){ const ex = hx+(g.side?1.2:sx*1.3); d.dot(ex, hy-.6, .6, k); d.dot(ex+.2, hy-.8, .22, '#ffffff'); d.dot(hx+(g.side?2.2:sx*2.4), hy+.6, .7, '#ffb3c6', .8); }
    d.line(c=>{ const tx = hx+(g.side?1.6:0); c.moveTo(tx,hy+2.4); c.lineTo(tx,hy+3.6); c.lineTo(tx-.6,hy+4.3); c.moveTo(tx,hy+3.6); c.lineTo(tx+.6,hy+4.3); }, '#ff7a8a', .45, .95); }},
  oa11:{...OTU, name:'돼지 저금통', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), px = hx+2.6, py = hy+1.6, p='#ffb8c8', dk='#f598b0'; g.c.save(); g.c.translate(hx, hy); g.c.scale(1.2, 1.2); g.c.translate(-hx, -hy);
    for (const dx of [-2.6,2.2]) d.rr(px+dx-.9, py+3.2, 1.8, 2.2, .7, dk);
    d.ell(px, py, 5.2, 4.2, p);
    d.shape(c=>{ c.beginPath(); c.moveTo(px-1.6,py-3.6); c.lineTo(px-3.4,py-6); c.lineTo(px-.2,py-4.2); c.closePath(); }, dk, [px-2,py-4.6,2], ff);
    d.rr(px-1.6,py-4.6,3.2,.8,.4,'#c9657a',ff);
    d.ell(px+4.6,py+.2,1.4,1.6,dk,ff); d.dot(px+4.3,py-.2,.3,'#c9657a'); d.dot(px+4.3,py+.6,.3,'#c9657a');
    d.dot(px+2.4,py-1.2,.55,'#3a2430'); d.dot(px+2.6,py+1,.8,'#ff8fa6',.6);
    d.line(k=>{ k.moveTo(px-5,py-.4); k.quadraticCurveTo(px-6.8,py-1.4,px-6,py-2.6); }, dk, .6, .9);
    d.circle(px-.2,py-6.4,1.5,'#f3c64f'); d.dot(px-.5,py-6.7,.4,'#fff8d8');
    g.c.restore(); d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa12:{...OTU, name:'커다란 칫솔', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), c = g.c;
    c.save(); c.translate(hx, hy+.6); c.rotate(g.up ? -.4 : .5);
    d.rr(-1.3, -14, 2.6, 16.6, 1.2, '#8fc8f0'); d.rr(-1.3, -2.4, 2.6, 4.4, 1.2, '#ffb3c6', ff);
    d.rr(1.2, -14.4, 2.8, 5.4, .8, '#fffaf2'); d.line(k=>{ for (let y=-14; y<=-9.6; y+=1.1){ k.moveTo(1.4,y); k.lineTo(3.8,y); } }, '#cfe4f5', .5, .9);
    d.shape(k=>{ k.beginPath(); k.moveTo(1.4,-14.6); k.quadraticCurveTo(3.6,-17,5.2,-15.4); k.quadraticCurveTo(4.4,-14.2,3.8,-14.4); k.closePath(); }, '#a6e3cc', [3,-15,2], ff);
    c.restore(); d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa13:{...OTU, name:'다람쥐 꼬리', draw:(d,g)=>{ const b='#c08552', lt='#e8b98a', dk='#9a643c';
    const tail = (x, y, s, f) => { leafAt(d, x, y, 5*s, 8.6*s, f*.28, b, {}); d.circle(x+f*2.4*s, y-8.4*s, 4*s, b); leafAt(d, x+f*.6*s, y+.6*s, 2.6*s, 6*s, f*.28, lt); d.circle(x+f*2.6*s, y-8.6*s, 2*s, lt, ff);
      for (const [dx,dy] of [[-4.6,-2],[-4.4,3],[-3,7.4],[1.2,9],[4.6,4.4]]) d.dot(x+f*dx*s, y+dy*s, 1*s, dk, .45); };
    if (g.up) return tail(2, BY+8.6, .95, 1);
    if (g.side) return tail(-g.bw/2-5.4, BY+7.6, 1, 1);
    tail(g.bw/2+6.6, BY+3, .66, 1); }},
  oa14:{...OTU, name:'토끼 배낭', draw:(d,g)=>{ const p='#fff0f5', pk='#ffb3cd';
    if (g.up){ for (const sx of [-1,1]){ d.ell(sx*2.6,BY-2.4,1.9,4.6,p); d.ell(sx*2.6,BY-2.2,.9,3.2,pk,ff); } d.rr(-5.6,BY+1.4,11.2,11,4.2,p); d.dot(-2.2,BY+6,.7,'#5a3a44'); d.dot(2.2,BY+6,.7,'#5a3a44'); d.ell(0,BY+7.4,.8,.55,'#ff8fa6',ff); for (const sx of [-1,1]) d.dot(sx*3.6,BY+8,1,'#ffb3c6',.7); d.rr(-3.6,BY+9.4,7.2,2.4,1.2,pk,ff); return; }
    if (g.side){ d.rr(-g.bw/2-3.8,BY+1.4,4.4,10.4,2,p); d.ell(-g.bw/2-2,BY-1.2,1.5,3.4,p); return; }
    d.line(k=>{ k.moveTo(-4.6,BY+.2); k.lineTo(-4.2,BY+BH*.5); k.moveTo(4.6,BY+.2); k.lineTo(4.2,BY+BH*.5); }, pk, 1.4, .95); for (const sx of [-1,1]) heart(d,sx*4.4,BY+4.4,.8,'#ff7fa6'); }},
  oa15:{...OTU, name:'캠핑 랜턴', main:'#5f8f6a', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), c = g.c, lx = hx+1.4, ly = hy+4.6, gr='#5f8f6a';
    c.save(); c.globalAlpha = .28; d.circle(lx, ly, 7.4, '#fff3b0', {noShadow:true}); c.restore();
    d.line(k=>{ k.moveTo(lx-2.4,ly-4.4); k.quadraticCurveTo(lx,ly-8.6,lx+2.4,ly-4.4); }, '#4a4550', .8);
    d.rr(lx-2.3,ly-3,4.6,6,1.4,'#ffe9a0'); d.ell(lx,ly+.2,1,1.6,'#ffb347',ff); d.ell(lx,ly+.6,.5,.8,'#fff6c8',ff);
    d.line(k=>{ k.moveTo(lx-2.3,ly-2.6); k.lineTo(lx-2.3,ly+2.6); k.moveTo(lx+2.3,ly-2.6); k.lineTo(lx+2.3,ly+2.6); }, gr, .7);
    d.rr(lx-3,ly-4.8,6,2,1,gr); d.rr(lx-3,ly+2.6,6,1.8,.9,gr); d.dot(lx,ly-5.2,.7,gr);
    d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa16:{...OTU, name:'따르릉 자명종', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), cx = hx+4.4, cy = hy-5.4, gd='#f3c64f'; g.c.save(); g.c.translate(hx, hy); g.c.scale(1.2, 1.2); g.c.translate(-hx, -hy);
    for (const sx of [-1,1]) d.line(k=>{ k.moveTo(cx+sx*2.4,cy+4); k.lineTo(cx+sx*3.4,cy+6); }, '#9a8a94', .9);
    for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.ellipse(cx+sx*3.2, cy-4.4, 2.4, 2, sx*.6, Math.PI, 0); c.closePath(); }, gd, [cx+sx*3.2,cy-4.6,2.4]);
    d.line(k=>{ k.moveTo(cx,cy-4); k.lineTo(cx,cy-6.4); }, '#9a8a94', .6); d.dot(cx,cy-6.6,.7,gd);
    d.circle(cx, cy, 4.8, '#ff8f8f'); d.circle(cx, cy, 3.8, '#fffaf2', ff);
    for (let i=0;i<4;i++){ const a = i*Math.PI/2; d.dot(cx+Math.cos(a)*3, cy+Math.sin(a)*3, .4, '#9a8a94'); }
    d.line(k=>{ k.moveTo(cx,cy); k.lineTo(cx,cy-2.6); k.moveTo(cx,cy); k.lineTo(cx+1.8,cy+.6); }, '#3a2430', .55);
    if (!g.up) d.line(k=>{ for (const sx of [-1,1]){ k.moveTo(cx+sx*6.6,cy-7); k.lineTo(cx+sx*7.8,cy-8.4); k.moveTo(cx+sx*7.4,cy-4.8); k.lineTo(cx+sx*8.8,cy-5.4); } }, '#ffc94f', .6, .9);
    g.c.restore(); d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa17:{...OTU, name:'반짝 요요', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), yx = hx+3.4, yy = hy+7.2;
    d.line(k=>{ k.moveTo(hx+.6,hy+1); k.lineTo(yx,yy); }, '#9a8a94', .5, .95);
    d.circle(yx,yy,3.8,'#ff8f8f'); d.shape(c=>{ c.beginPath(); c.arc(yx,yy,3.8,-Math.PI/2,Math.PI/2); c.closePath(); }, '#ffe07a', [yx,yy,3.8], ff);
    d.circle(yx,yy,1.2,'#fffaf2',ff); d.line(k=>{ k.arc(yx,yy,2.8,Math.PI*1.1,Math.PI*1.4); }, '#ffffff', .6, .8);
    d.line(k=>{ k.arc(yx,yy,5.6,Math.PI*.05,Math.PI*.4); k.moveTo(yx+Math.cos(Math.PI*.6)*5.6, yy+Math.sin(Math.PI*.6)*5.6); k.arc(yx,yy,5.6,Math.PI*.6,Math.PI*.9); }, '#c9b3ff', .6, .7);
    d.ell(hx,hy,3.1,3.7,g.sk); }},
  oa18:{...OTU, name:'우체부 가방', draw:(d,g)=>{ const st='#a8744f';
    if (g.up){ d.line(k=>{ k.moveTo(-4.6,BY+.6); k.lineTo(5,BY+BH*.5); }, st, 1.2); return; }
    d.line(k=>{ k.moveTo(g.side?-3:-4.4,BY+.4); k.lineTo(g.side?2.6:4.8,BY+BH*.5); }, st, 1.2);
    const x = g.side ? 3.8 : 6.6, y = BY+BH*.5;
    d.rr(x-2.6, y-4.4, 5.2, 3.6, .4, '#fffaf2'); d.line(k=>{ k.moveTo(x-2.4,y-4.2); k.lineTo(x,y-2.4); k.lineTo(x+2.4,y-4.2); }, '#cfc3d6', .5, .95); d.dot(x+1.6,y-3.6,.55,'#ff7a8a');
    d.rr(x-3.8,y-1.6,7.6,6,1.6,'#d9a35a');
    d.shape(c=>{ c.beginPath(); c.moveTo(x-3.8,y-1.6); c.lineTo(x+3.8,y-1.6); c.lineTo(x+3.8,y+1.2); c.quadraticCurveTo(x,y+3.4,x-3.8,y+1.2); c.closePath(); }, '#c98f4a', [x,y,3.8], ff);
    d.rr(x-.8,y+1.6,1.6,1.4,.4,'#f3c64f',ff); }},
  oa19:{...OTU, name:'카메라 목걸이', draw:(d,g)=>{ const st='#a8744f', bd='#f3e6d0', lt='#8a6a50', ln='#3f3a4a';
    if (g.up){ d.line(k=>{ k.moveTo(-4,BY+.2); k.quadraticCurveTo(0,BY+1.6,4,BY+.2); }, st, .9, .9); return; }
    const x = g.side ? 2.4 : 0, y = BY+6.2;
    d.line(k=>{ k.moveTo(x-(g.side?2.4:4.6),BY-.4); k.lineTo(x-(g.side?1.6:3),y-1); k.moveTo(x+(g.side?2.4:4.6),BY-.4); k.lineTo(x+(g.side?1.6:3),y-1); }, st, .9, .95);
    if (g.side){ d.rr(x-2.2,y-2.8,4.4,6,1.2,bd); d.rr(x-2.2,y-.6,4.4,2.6,.5,lt,ff); d.rr(x+2,y-1.6,2.4,3.4,1,ln); d.ell(x+4.4,y+.1,.6,1.4,'#7fa8d8',ff); return; }
    d.rr(x-4.4,y-2.8,8.8,6,1.4,bd); d.rr(x-4.4,y-.6,8.8,2.6,.6,lt,ff); d.rr(x-1.6,y-4,3.2,1.6,.6,'#d9cbb5');
    d.rr(x+2.2,y-3.6,1.4,.9,.4,'#ff7a7a',ff); d.rr(x-3.8,y-2.2,1.6,1,.3,'#fff8d8',ff);
    d.circle(x,y+.2,2.4,ln); d.circle(x,y+.2,1.5,'#7fa8d8',ff); d.dot(x-.5,y-.3,.5,'#ffffff',.9); }},
  oa20:{...OTU, name:'스프링클 도넛', main:'#ffadd0', draw:(d,g)=>{ if (g.pray) return; const [hx,hy] = heldAt(g), cx = hx+4.4, cy = hy-5; g.c.save(); g.c.translate(hx, hy); g.c.scale(1.2, 1.2); g.c.translate(-hx, -hy);
    d.circle(cx, cy, 5.4, '#e8b878');
    d.shape(c=>{ c.beginPath(); for (let i=0;i<=48;i++){ const a = i/48*Math.PI*2, r = 4.5 + Math.sin(a*7)*.45; c.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); } c.closePath(); }, '#ffadd0', [cx,cy,5], {flat:true});
    d.circle(cx, cy, 1.9, '#d99a5c', ff); d.circle(cx, cy+.3, 1.2, '#b97a44', ff);
    for (const [a,r,col] of [[.3,3.2,'#ffe07a'],[1.2,3.4,'#8fc8f0'],[2.2,3,'#fffaf2'],[3.1,3.4,'#9fdcc8'],[4.1,3.1,'#ffe07a'],[5,3.4,'#8fc8f0'],[5.8,3,'#fffaf2']]){ const x = cx+Math.cos(a)*r, y = cy+Math.sin(a)*r; d.line(k=>{ k.moveTo(x-Math.cos(a*2)*.7, y-Math.sin(a*2)*.7); k.lineTo(x+Math.cos(a*2)*.7, y+Math.sin(a*2)*.7); }, col, .7, .95); }
    g.c.restore(); d.ell(hx,hy,3.1,3.7,g.sk); }},
};
const TOPS_OTU = {
  ot01:{...OTU, name:'아보카도 맨투맨', draw:(d,g)=>{ const v='#c4e39a', dk='#5f9a52';
    torso(d,g,v); d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,'#a8d07a',ff);
    const avo = (x, y, s, face) => { d.shape(c=>{ c.beginPath(); c.moveTo(x,y-4.6*s); c.bezierCurveTo(x+2.6*s,y-4.6*s,x+3.8*s,y+.2*s,x+3.6*s,y+2*s); c.bezierCurveTo(x+3.4*s,y+5*s,x-3.4*s,y+5*s,x-3.6*s,y+2*s); c.bezierCurveTo(x-3.8*s,y+.2*s,x-2.6*s,y-4.6*s,x,y-4.6*s); c.closePath(); }, dk, [x,y,4*s], ff);
      d.ell(x, y+.9*s, 2.7*s, 3.3*s, '#eef7b8', ff); d.circle(x, y+1.9*s, 1.6*s, '#b07a4f', ff);
      if (face){ d.dot(x-.6*s, y+1.6*s, .3, '#3a2430'); d.dot(x+.6*s, y+1.6*s, .3, '#3a2430'); d.line(k=>{ k.moveTo(x-.4*s,y+2.4*s); k.quadraticCurveTo(x,y+2.8*s,x+.4*s,y+2.4*s); }, '#3a2430', .3); } };
    if (g.up) avo(0, BY+7.4, .8, false); else avo(g.side ? 2.2 : 0, BY+7.2, g.side ? .85 : 1.05, true);
    longArms(d,g,v); }},
  ot02:{...OTU, name:'체리 니트', draw:(d,g)=>{ const w='#fff3ea', rd='#f0505f';
    torso(d,g,w); d.rr(-g.bw/2+.4,BY+BH*.56,g.bw-.8,2,.9,rd,ff); d.line(k=>{ for (let x=-g.bw/2+1.6; x<g.bw/2-1; x+=1.4){ k.moveTo(x,BY+BH*.56+.3); k.lineTo(x,BY+BH*.56+1.7); } }, '#d93a4c', .4, .6);
    const cherry = (x, y, s) => { d.line(k=>{ k.moveTo(x-1.3*s,y); k.quadraticCurveTo(x-.9*s,y-2.4*s,x+.3*s,y-3.4*s); k.moveTo(x+1.3*s,y+.2*s); k.quadraticCurveTo(x+1.1*s,y-2.2*s,x+.3*s,y-3.4*s); }, '#7a9a4a', .5);
      leafAt(d, x+1.4*s, y-3.4*s, 1.2*s, .55*s, -.4, '#6fbf73'); for (const [dx,dy] of [[-1.3,.3],[1.3,.5]]){ d.circle(x+dx*s, y+dy*s+1, 1.3*s, rd, ff); d.dot(x+dx*s-.4*s, y+dy*s+.6, .35*s, '#ffffff', .8); } };
    for (const [x,y,s] of (g.up ? [[-3,5.6,1],[3.2,8.6,1]] : g.side ? [[2.2,6.8,1]] : [[-3.4,5.4,1.05],[3.4,8.4,1.05]])) cherry(x, BY+y, s);
    sleeves(d,g,w); if (!g.pray) for (const sx of sides2(g)) d.dot(sx*(g.bw/2+1.4), BY+BH*.28, .9, rd); cuffs(d,g,rd); hands(d,g); }},
  ot03:{...OTU, name:'고슴도치 후드', draw:(d,g)=>{ const b='#e3c39c', sp='#9a6a48', sp2='#b8875e', cr='#fff1dc';
    torso(d,g,b);
    if (g.up){ d.ell(0,BY+3,8,5.6,sp); for (let r=0;r<3;r++) for (let i=0;i<6;i++){ const x = -6.2+i*2.4+(r%2)*1.2; if (x > 6.6) continue; spike(d, x, BY+1.4+r*3, Math.PI/2, .85, (i+r)%2 ? sp : sp2); } }
    else { const hx = g.side ? 2.4 : 0, hy = BY+8.6;
      for (const a of (g.side ? [Math.PI, Math.PI+.35, Math.PI-.3] : [-.45,-.15,.15,Math.PI-.15,Math.PI+.15,Math.PI+.45])) spike(d, Math.cos(a)*6.8, BY+1.4+Math.sin(a)*2.4, a, .9, sp);
      if (g.side) for (const y of [4,6.6,9.2]) spike(d, -g.bw/2+.4, BY+y, Math.PI, .8, sp);
      const s = g.side ? .8 : 1; d.ell(hx, hy, 3.6*s, 2.8*s, sp2, ff); for (const a of [-2.7,-2.2,-1.7,-1.2,-.7]) spike(d, hx+Math.cos(a)*3.1*s, hy+Math.sin(a)*2.4*s, a, .6*s, sp);
      d.ell(hx+2.6*s, hy+.6*s, 1.9*s, 1.6*s, cr, ff); d.dot(hx+4.4*s, hy+.4*s, .45, '#3a2430'); d.dot(hx+2.4*s, hy, .35, '#3a2430'); for (const dx of [-1.4,1.4]) d.dot(hx+dx*s, hy+2.8*s, .55, sp); }
    sleeves(d,g,b); cuffs(d,g,cr); hands(d,g); }},
  ot04:{...OTU, name:'기린 무늬 니트', draw:(d,g)=>{ const y='#f7d58a', br='#c9884f', F = g.side ? .8 : 1, m = g.up ? -1 : 1;
    torso(d,g,y);
    const blob = (x, yy, w, h, r) => d.shape(c=>{ c.beginPath(); [[-w,-h*.7],[w*.2,-h],[w,-h*.3],[w*.7,h*.8],[-w*.3,h],[-w*.9,h*.4]].forEach(([px,py],i)=>{ const qx = x + px*Math.cos(r) - py*Math.sin(r), qy = yy + px*Math.sin(r) + py*Math.cos(r); i ? c.lineTo(qx,qy) : c.moveTo(qx,qy); }); c.closePath(); }, br, [x,yy,w], ff);
    clipTo(g, k=>{ k.beginPath(); k.roundRect(-g.bw/2, BY, g.bw, BH*.64, 4.5); }, ()=>{ for (const [x,yy,w,h,r] of [[-5.4,3.2,2,1.6,.3],[-.6,4,2.2,1.5,-.2],[4.6,3,1.8,1.8,.5],[-3.4,7.8,2.1,1.7,-.4],[2,8.2,2.3,1.6,.2],[6.4,7.6,1.4,1.6,0],[-6.4,11.2,1.6,1.2,.2],[-.6,11.6,2,1.1,0],[4.8,11.4,1.8,1.2,.3]]) blob(m*x*F+(g.side?1:0), BY+yy, w, h, r); });
    if (g.up) d.rr(-.9, BY+1, 1.8, 9, .9, '#b8743f', ff);
    d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,br,ff);
    sleeves(d,g,y); if (!g.pray) for (const sx of sides2(g)){ d.dot(sx*(g.bw/2+1.4)-.6, BY+BH*.26, .8, br); d.dot(sx*(g.bw/2+1.4)+.8, BY+BH*.38, .7, br); } cuffs(d,g,br); hands(d,g); }},
  ot05:{...OTU, name:'그림책 니트', draw:(d,g)=>{ const m='#cdeee0', dk='#a8dcc8';
    torso(d,g,m); d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,dk,ff);
    const book = (x, y, s) => { d.rr(x-5*s, y-2.4*s, 10*s, 6*s, 1*s, '#ff9f7a', ff);
      for (const sx of [-1,1]) d.shape(c=>{ c.beginPath(); c.moveTo(x, y-2.6*s); c.quadraticCurveTo(x+sx*2.4*s, y-3.6*s, x+sx*4.6*s, y-2.8*s); c.lineTo(x+sx*4.6*s, y+2.8*s); c.quadraticCurveTo(x+sx*2.4*s, y+2*s, x, y+3*s); c.closePath(); }, '#fffaf2', [x+sx*2.3*s, y, 3*s], ff);
      d.line(k=>{ for (const t of [-1.3,-.2,.9]) for (const sx of [-1,1]){ k.moveTo(x+sx*1*s, y+t*s); k.lineTo(x+sx*3.8*s, y+t*s-.3*s); } }, '#9aa1ae', .4, .8);
      d.line(k=>{ k.moveTo(x, y-2.6*s); k.lineTo(x, y+3*s); }, '#e0d6c8', .5, .9); };
    if (g.up) book(0, BY+7.4, .8); else book(g.side ? 2 : 0, BY+7.4, g.side ? .75 : 1.05);
    if (!g.up && !g.side) for (const [x,yy,col] of [[-5.4,3.2,'#ffe07a'],[5.6,3.6,'#ff9fbe'],[5.4,11.2,'#a9c7ef'],[-5.6,11.4,'#ff9fbe']]) d.dot(x, BY+yy, .7, col);
    sleeves(d,g,m); cuffs(d,g,dk); hands(d,g); }},
  ot06:{...OTU, name:'아기 코끼리 니트', draw:(d,g)=>{ const gy='#b9c3e0', dk='#9aa6cc', pk='#ffc9d6';
    torso(d,g,gy); d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,dk,ff);
    if (g.up){ d.line(k=>{ k.moveTo(0,BY+8.6); k.quadraticCurveTo(1.6,BY+10.6,1,BY+12); }, dk, .8, .9); d.ell(1,BY+12.2,.8,1,'#7f8bb5',ff); }
    else { const fx = g.side ? 2.4 : 0, fy = BY+6.8;
      for (const sx of (g.side?[-1]:[-1,1])){ d.ell(fx+sx*3.8, fy-.4, 2.8, 3.4, dk, {noShadow:true}); d.ell(fx+sx*3.9, fy-.2, 1.7, 2.2, pk, ff); }
      d.circle(fx, fy, 3.2, gy, {noShadow:true, seam:true});
      d.shape(c=>{ c.beginPath(); c.moveTo(fx-1,fy+.6); c.quadraticCurveTo(fx-1.2,fy+4.4,fx+.6,fy+4.8); c.quadraticCurveTo(fx+2,fy+4.6,fx+1.6,fy+3.6); c.quadraticCurveTo(fx+.8,fy+4,fx+1,fy+.6); c.closePath(); }, gy, [fx,fy+3,2], {flat:true, noShadow:true, seam:true});
      for (const sx of [-1,1]) d.dot(fx+sx*1.3, fy-.8, .45, '#3a2430'); for (const sx of [-1,1]) d.dot(fx+sx*2.2, fy+1, .6, '#ffb3c6', .7); }
    longArms(d,g,gy); }},
  ot07:{...OTU, name:'레몬 셔츠', draw:(d,g)=>{ const w='#fffbe0', y='#ffe45a', yd='#f0c830';
    torso(d,g,w); collar(d,g,y);
    const slice = (x, yy, r) => { d.circle(x, yy, r, yd, ff); d.circle(x, yy, r*.8, '#fff6b0', ff); d.line(k=>{ for (let i=0;i<6;i++){ const a = i*Math.PI/3; k.moveTo(x, yy); k.lineTo(x+Math.cos(a)*r*.78, yy+Math.sin(a)*r*.78); } }, yd, .4, .9); };
    const lemon = (x, yy, s) => { d.ell(x, yy, 2.3*s, 1.6*s, y, ff); d.dot(x-2.3*s, yy, .5*s, y); d.dot(x+2.3*s, yy, .5*s, y); leafAt(d, x+.6*s, yy-1.9*s, 1.3*s, .6*s, -.5, '#7cc07c'); };
    if (g.up){ slice(-3,BY+5.4,1.8); lemon(3,BY+9.4,1); slice(3.6,BY+4,1.2); lemon(-3.8,BY+10.4,.9); }
    else if (g.side){ slice(3.2,BY+5.4,1.6); lemon(1.4,BY+9.8,.9); }
    else { slice(-4.2,BY+4.6,1.7); lemon(3.8,BY+4.4,1); slice(4,BY+9.8,1.6); lemon(-3.8,BY+10.6,1); d.line(k=>{ k.moveTo(0,BY+4); k.lineTo(0,BY+BH*.62); }, '#efe3b0', .6, .9); for (const yy of [6,9,12]) d.dot(0,BY+yy,.5,yd); }
    sleeves(d,g,w); cuffs(d,g,y); hands(d,g); }},
  ot08:{...OTU, name:'부엉이 니트', draw:(d,g)=>{ const b='#a88468', lt='#d9bc98', cr='#f6ead6', dk='#7a5a46';
    torso(d,g,b);
    const chev = (cx, rows) => d.line(k=>{ for (const [x,y] of rows){ k.moveTo(cx+x-.9,BY+y-.5); k.lineTo(cx+x,BY+y+.3); k.lineTo(cx+x+.9,BY+y-.5); } }, dk, .55, .9);
    if (g.up) chev(0, [[-3,4],[0,4],[3,4],[-1.5,7],[1.5,7],[-3,10],[0,10],[3,10]]);
    else { const cx = g.side ? 2.4 : 0;
      d.ell(cx, BY+10.2, g.side ? 3.2 : 4.4, 2.8, lt, ff); chev(cx, g.side ? [[0,9.6],[-1,11.4],[1,11.4]] : [[-2,9.6],[0,10.6],[2,9.6],[-1,11.8],[1,11.8]]);
      for (const sx of (g.side?[1]:[-1,1])){ const ex = g.side ? cx+1.2 : cx+sx*2.6; d.circle(ex, BY+5, 2.4, cr, ff); d.circle(ex, BY+5.1, 1.3, '#3a2430', ff); d.dot(ex-.4, BY+4.6, .45, '#ffffff'); }
      const bx = g.side ? cx+3.6 : cx; d.shape(c=>{ c.beginPath(); c.moveTo(bx-1,BY+6.4); c.lineTo(bx+1,BY+6.4); c.lineTo(bx+(g.side?.8:0),BY+8.4); c.closePath(); }, '#f3b04f', [bx,BY+7,1.4], ff); }
    sleeves(d,g,b); if (!g.pray) for (const sx of sides2(g)) d.line(k=>{ const x = sx*(g.bw/2+1.4); for (const yy of [4.6,7.2]){ k.moveTo(x-1.2,BY+yy-.5); k.lineTo(x,BY+yy+.4); k.lineTo(x+1.2,BY+yy-.5); } }, dk, .5, .8);
    cuffs(d,g,lt); hands(d,g); }},
  ot09:{...OTU, name:'사자 갈기 후드', draw:(d,g)=>{ const gd='#f2c46f', mn='#e0904a', mn2='#f0a95a';
    const cx = g.side ? R*.08 : 0; for (let i=0;i<20;i++){ const a = i/20*Math.PI*2; d.circle(cx+Math.cos(a)*R*1.28, HC+Math.sin(a)*R*1.24, 4, i%2 ? mn : mn2, {noShadow:true}); }
    torso(d,g,gd);
    if (!g.up){ const px = g.side ? 2.4 : 0, py = BY+8.4; d.ell(px, py+1, 2.2, 1.8, mn, ff); for (const [dx,dy] of [[-2.2,-1.4],[-.8,-2.4],[.8,-2.4],[2.2,-1.4]]) d.circle(px+dx*(g.side?.8:1), py+dy, .9, mn, ff); }
    else { d.line(k=>{ k.moveTo(0,BY+10); k.quadraticCurveTo(3,BY+12,4.4,BY+10.6); }, mn, .9, .9); d.circle(4.8,BY+10.2,1.4,mn); }
    sleeves(d,g,gd); if (!g.pray) for (const sx of sides2(g)) fluffRow(d,sx*(g.bw/2+1.4)-2.2,sx*(g.bw/2+1.4)+2.2,BY+BH*.46,1,mn2); hands(d,g); }},
  ot10:{...OTU, name:'마카롱 스웨터', draw:(d,g)=>{ const lv='#d9c8f0', dk='#c4afe6';
    torso(d,g,lv); d.rr(-g.bw/2+.4,BY+BH*.58,g.bw-.8,1.5,.7,dk,ff);
    const mac = (x, y, s, col) => { d.rr(x-3*s, y-2.1*s, 6*s, 1.8*s, .9*s, col, ff); d.rr(x-2.7*s, y-.45*s, 5.4*s, .9*s, .45*s, '#fffaf2', ff); d.rr(x-3*s, y+.35*s, 6*s, 1.8*s, .9*s, col, ff);
      d.line(k=>{ for (let i=-2;i<=2;i++){ k.moveTo(x+i*1.1*s-.3*s, y-.5*s); k.lineTo(x+i*1.1*s+.3*s, y-.5*s); k.moveTo(x+i*1.1*s-.3*s, y+.5*s); k.lineTo(x+i*1.1*s+.3*s, y+.5*s); } }, darken(col,.12), .35, .8); };
    if (g.up){ mac(-2.6,BY+6,.85,'#ffb3c6'); mac(2.8,BY+9.4,.85,'#a9e6d0'); }
    else if (g.side) mac(2.2,BY+7.6,.85,'#a9e6d0');
    else { mac(0,BY+10.6,1.05,'#ffb3c6'); mac(0,BY+7,.95,'#a9e6d0'); mac(0,BY+3.6,.85,'#ffe59a'); }
    sleeves(d,g,lv); cuffs(d,g,dk); hands(d,g); }},
};
Object.assign(HATS, HATS_OTU); Object.assign(ACCS, ACCS_OTU); Object.assign(TOPS, TOPS_OTU);
export const CATS = [['top','상의',TOPS],['bottom','하의',BOTTOMS],['set','세트',SETS],['hat','모자',HATS],['acc','액세서리',ACCS],['shoes','신발',SHOES]];
export const FREE = ['t01','t02','t11','t12','t13','b01','b02','b11','b12','b13','sh01','sh06','sh11'];
export const HAIR_M = Object.keys(HAIR).filter(k=>HAIR[k].g==='m'), HAIR_F = Object.keys(HAIR).filter(k=>HAIR[k].g==='f');
export const SKINS = ['#ffe4d2','#f9d3b8','#eebd98','#d9a07a','#b87a55','#8d5a3c'];
export const HAIR_COLORS = ['#262227','#3a2a2a','#4a3228','#6a4a36','#a8784c','#c9a06a','#e8c77a','#9a9aa6','#f2a0b8','#8fc3ea','#b76e79','#5a3a2a','#efe0bf','#b9a3e3','#9fd8c4'];
export const defaultLook = () => ({skin:'#f9d3b8', hair:'long', hairColor:'#4a3228', top:'t01', bottom:'b01', set:'', hat:'none', acc:'none', shoes:'sh01', expr:'dot', cc:{}});
// 표정 15 가지: 캐릭터를 만들 때 하나 골라요
export const EXPRS = [['dot','기본'],['happy','웃음'],['laugh','깔깔'],['sparkle','반짝'],['wink','윙크'],['love','하트 눈'],['shy','부끄'],['tongue','메롱'],['surprised','깜짝'],['angry','화남'],['sad','눈물'],['cry','엉엉'],['sleepy','졸림'],['dizzy','어질'],['cat','고양이 입']];
// 옛 저장(outfit/outfitColor/eyes) → 새 형식
export function migrateLook(L){
  if (!L) return defaultLook();
  if ('top' in L || L.set) return {...defaultLook(), ...L};
  const n = {...defaultLook(), skin:L.skin||'#f9d3b8', hair:HAIR[L.hair] ? L.hair : 'long', hairColor:L.hairColor||'#4a3228', hat:HATS[L.hat] ? L.hat : 'none'};
  const o = L.outfit; if (o==='overall') n.set = 's01'; else if (o==='dress') n.set = 's02'; else if (o==='hoodie'){ n.top = 't04'; n.bottom = 'b06'; } else if (o==='shirt'){ n.top = 't05'; } else if (o==='tee'){ n.top = 't02'; }
  return n;
}
export const lookItems = L => [L.set || L.top, L.set ? null : L.bottom, L.hat, L.acc, L.shoes].filter(Boolean);
export const ITEM = id => TOPS[id] || BOTTOMS[id] || SETS[id] || HATS[id] || ACCS[id] || SHOES[id];

// ---------- 전체 그리기 ----------
// dir: down(정면) / left / right / up(뒷모습). t: 초. walk: 걷는 중. expr: 표정
export function figure(d, L, dir, t, walk, expr){
  // 'pray': 소원 빌기 — 정면을 보고 눈을 감고 가슴 앞에서 두 손을 모아요
  const pray = expr === 'pray'; if (pray){ expr = 'sleepy'; dir = 'down'; walk = false; }
  const c = d.ctx, side = dir==='left' || dir==='right', up = dir==='up';
  const ph = t*8, step = walk ? Math.sin(ph) : 0, bob = walk ? Math.abs(Math.sin(ph))*1.2 : Math.sin(t*2)*.3+.3;
  const a = Math.max(0,step)*1.6, b = Math.max(0,-step)*1.6;
  c.save(); if (dir==='left') c.scale(-1,1);
  c.save(); c.fillStyle='rgba(60,30,50,.14)'; c.beginPath(); c.ellipse(0, 1, BW*.75, 3, 0,0,7); c.fill(); c.restore();
  c.translate(0, -bob);
  const g = {c, side, up, bw: side ? BW*.8 : BW, step, a, b, sk:L.skin, L, pray};
  const set = SETS[L.set], top = TOPS[L.top] || TOPS.t01, bottom = BOTTOMS[L.bottom] || BOTTOMS.b01;
  const hat = HATS[L.hat] || HATS.none, acc = ACCS[L.acc] || ACCS.none, shoes = SHOES[L.shoes] || SHOES.sh01;
  const AN = L.animal && ANIMALS[L.animal.kind], AP = AN && {d, g, L, A:L.animal, side, up, fx: side ? R*.22 : 0, fy: HY+R*.28};
  if (AN?.tail && !up) AN.tail(AP);
  if (!up) hair(d, 0, HY, L, side, R, 'back');
  // 하의(다리) → 신발 → 상의. 세트는 한 번에 그리고 신발을 마지막에
  const cc = L.cc || {}, P = (cat, id) => tinted(d, cat, id, cc[cat] || 0, L.skin);
  if (set){ set.draw(P('set', L.set), g); shoes.draw(P('shoes', L.shoes), g); } else { bottom.draw(P('bottom', L.bottom), g); shoes.draw(P('shoes', L.shoes), g); top.draw(P('top', L.top), g); }
  // 머리
  if (AN?.tail && up) AN.tail(AP);
  if (AN?.ears) AN.ears(AP);
  else if (!side) { d.circle(-R*1.13, HY+R*.18, 4.3, L.skin); d.circle(R*1.13, HY+R*.18, 4.3, L.skin); }
  headShape(d, 0, HY, R, L.skin);
  if (AN?.head) AN.head(AP);
  if (!up) face(d, side ? R*.22 : 0, HY+R*.28, L, side, expr);
  if (AN?.snout && !up) AN.snout(AP);
  hair(d, 0, HY, L, side, R, 'front', up);
  const otu = L.animal?.kind === 'otumo'; if (otu && AN?.over) AN.over(AP); // 오투모 머리는 후드 안쪽에 (후드를 쓰면 위로 덮여요)
  if (set?.over) set.over(P('set', L.set), g); else if (!set && top.over) top.over(P('top', L.top), g); // 후드 앞자락처럼 머리카락 위로 덮는 부분
  if (!otu && AN?.over) AN.over(AP);
  acc.draw(P('acc', L.acc), g); hat.draw(P('hat', L.hat), g);
  if (AN?.top) AN.top(AP);
  c.restore();
}
export const FIG_BOX = {w:72, h:92, ox:36, oy:82}; // 스프라이트 캔버스 크기와 발 위치

// ===== 옷 색상 5 가지: 아이템의 대표색을 바꾸면 같은 계열의 색이 함께 바뀌어요 =====
export const PALETTE = ['#f6c6d3','#a9c7ef','#bfe6d5','#f3e39a','#d2b8ff','#4a4550','#fffaf2','#f2b880','#c9657a','#7d8ab0','#9fae8a','#e85d5d'];
const hex2hsl = h => { const n = parseInt(h.slice(1),16), r = (n>>16)/255, g = (n>>8&255)/255, b = (n&255)/255, mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/2;
  if (mx===mn) return [0, 0, l]; const dd = mx-mn, s = l>.5 ? dd/(2-mx-mn) : dd/(mx+mn); let hh = mx===r ? (g-b)/dd + (g<b?6:0) : mx===g ? (b-r)/dd+2 : (r-g)/dd+4; return [hh*60, s, l]; };
const chroma = h => { const [, s, l] = hex2hsl(h); return s*(1-Math.abs(2*l-1)); };
const hsl2hex = (h, s, l) => { h = ((h%360)+360)%360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
  const k = n => (n + h/30) % 12, a = s*Math.min(l, 1-l), f = n => l - a*Math.max(-1, Math.min(k(n)-3, 9-k(n), 1)); return '#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join(''); };
const ALL = () => ({top:TOPS, bottom:BOTTOMS, set:SETS, hat:HATS, acc:ACCS, shoes:SHOES});
const MAIN = {};
// 대표색: 그림에서 가장 넓게 칠하는 색 (피부색 제외)
function mainColor(cat, id){
  const key = cat+':'+id; if (key in MAIN) return MAIN[key];
  const it = ALL()[cat]?.[id]; if (it?.main) return MAIN[key] = it.main;
  const SK = '#010203', skins = new Set([SK, mixHex(SK,'#2a1a24',.14)]), area = {}, first = [];
  const isHex = v => typeof v==='string' && /^#[0-9a-f]{6}$/i.test(v) && !skins.has(v);
  const add = (col, a) => { if (!isHex(col)) return; if (!(col in area)){ area[col] = 0; first.push(col); } area[col] += a; };
  const rec = { ctx: new Proxy({}, {get:()=>()=>{}, set:()=>true}),
    rr:(x,y,w,h,r,col)=>add(col, Math.abs(w*h)), ell:(x,y,rx,ry,col)=>add(col, Math.PI*rx*ry), circle:(x,y,r,col)=>add(col, Math.PI*r*r),
    dot:(x,y,r,col)=>add(col, Math.PI*r*r*.5), shape:(fn,col,box)=>add(col, box ? box[2]*box[2]*2 : 10), line:(fn,col)=>add(col, .5) };
  if (it){ try { it.draw(rec, {c:rec.ctx, side:false, up:false, bw:BW, step:0, a:0, b:0, sk:SK, L:{skin:SK}}); } catch(e){} }
  let best = null; for (const c of first) if (best===null || area[c] > area[best] + 1e-6) best = c;
  return MAIN[key] = best;
}
const dist = (a, b) => { const A = parseInt(a.slice(1),16), B = parseInt(b.slice(1),16); return Math.hypot((A>>16)-(B>>16), (A>>8&255)-(B>>8&255), (A&255)-(B&255)); };
// 아이템마다 5 색: 유채색은 밝기는 그대로 두고 색상만 돌리고, 흰색·검은색·회색 계열은 정해 둔 색으로
const NEUTRAL_SETS = { light:['#f6c6d3','#a9c7ef','#bfe6d5','#3f3a4a'], dark:['#3e4a6e','#7a3a4a','#4f5e3f','#b9b6c0'], mid:['#f6c6d3','#a9c7ef','#4a4550','#fffaf2'] };
const COLORS = {};
export function colorsOf(cat, id){
  const key = cat+':'+id; if (COLORS[key]) return COLORS[key];
  const m = mainColor(cat, id); if (!m) return COLORS[key] = [null];
  const [h, s, l] = hex2hsl(m);
  if (chroma(m) < .1) return COLORS[key] = [m, ...NEUTRAL_SETS[l > .8 ? 'light' : l < .4 ? 'dark' : 'mid']];
  return COLORS[key] = [m, ...[65, 145, 215, 290].map(dh => { const hh = ((h + dh) % 360 + 360) % 360, vivid = hh > 60 && hh < 200; return hsl2hex(hh, Math.min(Math.max(s, .35), vivid ? .42 : .58), vivid ? Math.min(.86, l + .04) : l); })];
}
export function tinted(d, cat, id, idx, skin){
  if (!idx || !id || id==='none') return d;
  const cols = colorsOf(cat, id), from = cols[0], to = cols[idx]; if (!from || !to) return d;
  const [h0, s0, l0] = hex2hsl(from), [h1, s1, l1] = hex2hsl(to), neutral0 = chroma(from) < .1, skins = new Set([skin, mixHex(skin,'#2a1a24',.14)]), memo = {};
  const map = c => { if (skins.has(c)) return c; if (c in memo) return memo[c]; const [h, s, l] = hex2hsl(c); let out = c;
    const hd = Math.abs(((h - h0 + 540) % 360) - 180);
    const ch = s*(1-Math.abs(2*l-1)); if (neutral0 ? (ch < .1 && Math.abs(l - l0) < .16) : (ch >= .08 && hd < 28 && Math.abs(l - l0) < .22)) out = hsl2hex(h + (h1 - h0), neutral0 ? s1 : s * (s1 / Math.max(s0, .01)), l + (l1 - l0));
    return memo[c] = out; };
  return new Proxy(d, {get:(t, k)=> typeof t[k]==='function' ? (...a)=>t[k](...a.map(v => typeof v==='string' && /^#[0-9a-f]{6}$/i.test(v) ? map(v) : v)) : t[k]});
}

// ===== 주민(동물): 플레이어와 같은 몸에 귀·주둥이·꼬리·무늬를 붙여요 =====
// 동물 부위 그리기에 쓰는 값: A.fur 털색, A.fur2 밝은 털(주둥이·배), A.dark 진한 털, A.inner 귀 안쪽
const SH = (c, k) => mixHex(c, k > 0 ? '#ffffff' : '#2a1a24', Math.abs(k));
const muzzle = (P, col, rx=4.4, ry=3.1, nose='#5a3a44', nr=1.1) => { const {d, side, fx, fy} = P;
  if (side){ d.ell(R*.98, fy+3.6, rx*.72, ry, col); d.ell(R*1.12, fy+2.4, nr*1.1, nr*.85, nose, {noShadow:true}); }
  else { d.ell(fx, fy+4.2, rx, ry, col); d.ell(fx, fy+2.6, nr*1.3, nr, nose, {noShadow:true}); d.line(k=>{ k.moveTo(fx, fy+3.4); k.lineTo(fx, fy+4.6); k.moveTo(fx-1.6, fy+5.6); k.quadraticCurveTo(fx-.8, fy+6.2, fx, fy+4.6); k.quadraticCurveTo(fx+.8, fy+6.2, fx+1.6, fy+5.6); }, nose, .55, .8); } };
const triEars = (P, col, inner, tip, h=1.5, w=.42, x=.62) => { const {d, side, up} = P;
  for (const sx of (side ? [-.15] : [-1, 1])){ const ex = side ? R*sx : sx*R*x, base = HY - R*.62;
    d.shape(k=>{ k.beginPath(); k.moveTo(ex - R*w, base); k.quadraticCurveTo(ex - R*w*.4, HY - R*h, ex + (side ? 0 : sx*R*.08), HY - R*h); k.quadraticCurveTo(ex + R*w*.3, HY - R*h*.75, ex + R*w, base); k.closePath(); }, col, [ex, HY - R*1.05, R*.4]);
    if (!up && inner) d.shape(k=>{ k.beginPath(); k.moveTo(ex - R*w*.5, base - R*.08); k.quadraticCurveTo(ex - R*w*.2, HY - R*(h-.2), ex + (side ? 0 : sx*R*.06), HY - R*(h-.18)); k.quadraticCurveTo(ex + R*w*.2, HY - R*(h-.4), ex + R*w*.5, base - R*.08); k.closePath(); }, inner, [ex, HY - R*1.05, 2], {flat:true, noShadow:true});
    if (tip) d.shape(k=>{ k.beginPath(); k.moveTo(ex - R*w*.32, HY - R*(h-.28)); k.quadraticCurveTo(ex - R*w*.2, HY - R*h, ex + (side ? 0 : sx*R*.08), HY - R*h); k.quadraticCurveTo(ex + R*w*.15, HY - R*(h-.12), ex + R*w*.3, HY - R*(h-.3)); k.closePath(); }, tip, [ex, HY - R*h, 2], {flat:true}); } };
const roundEars = (P, col, inner, r=.32, x=.78, y=.86) => { const {d, side, up} = P;
  for (const sx of (side ? [-.2] : [-1, 1])){ const ex = side ? R*sx : sx*R*x; d.circle(ex, HY - R*y, R*r, col); if (!up && inner) d.circle(ex, HY - R*(y-.04), R*r*.55, inner, {flat:true, noShadow:true}); } };
const tailBall = (P, col, r=3.4) => { const {d, side, up} = P; if (up) d.circle(0, BY + BH*.58, r, col); else if (side) d.circle(-BW*.42, BY + BH*.6, r, col); };
export const ANIMALS = {
  // 옷 입은 오투모: 사람 귀·얼굴·머리카락 위를 오투모 머리로 덮어요 (모자는 그 위에)
  otumo:{ ears:P=>{}, over:P=>otumoHead(P.d, P.side ? R*.08 : 0, HY - 1, P.side, P.up, .92) },
  // 사슴: 옆으로 뻗은 귀, 작은 뿔, 이마의 흰 점
  deer:{ tail:P=>tailBall(P, '#ffffff', 3),
    ears:P=>{ const {d, side, up, A} = P; for (const sx of (side ? [-.25] : [-1, 1])){ const ex = side ? R*sx : sx*R*1.06; d.shape(k=>{ k.beginPath(); k.ellipse(ex, HY - R*.46, R*.44, R*.2, side ? -.3 : sx*-.42, 0, Math.PI*2); }, A.fur, [ex, HY - R*.46, R*.4]); if (!up && !side) d.shape(k=>{ k.beginPath(); k.ellipse(ex, HY - R*.46, R*.26, R*.09, sx*-.42, 0, Math.PI*2); }, '#ffd2c2', [ex, HY - R*.46, 2], {flat:true, noShadow:true}); } },
    top:P=>{ const {d, side} = P; for (const sx of (side ? [1] : [-1, 1])){ const x0 = side ? -R*.05 : sx*R*.4; d.line(k=>{ k.moveTo(x0, HY - R*.92); k.quadraticCurveTo(x0 + sx*R*.08, HY - R*1.3, x0 + sx*R*.3, HY - R*1.62); k.moveTo(x0 + sx*R*.07, HY - R*1.22); k.lineTo(x0 + sx*R*.46, HY - R*1.34); k.moveTo(x0 + sx*R*.17, HY - R*1.44); k.lineTo(x0 - sx*R*.06, HY - R*1.7); }, '#a8744f', 2.3, 1); } },
    head:P=>{ if (P.up || P.side) return; for (const [x,y] of [[-.5,-.5],[.55,-.55],[-.2,-.74],[.25,-.36]]) P.d.dot(R*x, HY + R*y, 1.2, '#fff6ea', .9); },
    snout:P=>muzzle(P, P.A.fur2, 4.2, 3, '#3a2a2a', 1.1) },
  // 늑대: 뾰족 귀, 얼굴 가운데 흰 털, 끝이 흰 복슬 꼬리
  wolf:{ tail:P=>{ const {d, side, up, A} = P; const tx = up ? 0 : side ? -BW*.7 : BW*.55; d.shape(k=>{ k.beginPath(); k.ellipse(tx, BY+BH*.42, R*.38, R*.74, up ? 0 : side ? -.6 : .55, 0, Math.PI*2); }, A.fur, [tx, BY+BH*.4, R*.6]); d.circle(tx + (up ? 0 : side ? -4 : 3), BY+BH*.42 - R*.58, R*.24, A.fur2); },
    ears:P=>triEars(P, P.A.fur, '#ffd2dc', P.A.dark, 1.62, .4, .58),
    head:P=>{ if (P.up || P.side) return; const {d, fx, fy, A} = P; d.shape(k=>{ k.beginPath(); k.moveTo(fx, fy-7.5); k.quadraticCurveTo(fx-3.5, fy-2, fx-7.5, fy+4); k.quadraticCurveTo(fx, fy+11, fx+7.5, fy+4); k.quadraticCurveTo(fx+3.5, fy-2, fx, fy-7.5); k.closePath(); }, A.fur2, [fx, fy+2, 6], {flat:true, noShadow:true}); },
    snout:P=>muzzle(P, P.A.fur2, 4.8, 3.3, '#2f2f3a', 1.25) },
  // 호랑이: 둥근 귀, 이마·볼 줄무늬, 줄무늬 꼬리
  tiger:{ tail:P=>{ const {d, side, up, A} = P; const s = side ? -1 : 1, p0 = up ? [0, BY+BH*.62] : [side ? -BW*.4 : BW*.35, BY+BH*.62], p1 = up ? [R*.7, BY+BH*.45] : [p0[0] + s*BW*.6, BY+BH*.55], p2 = up ? [R*.5, BY-1] : [p0[0] + s*BW*.42, BY-1];
      d.line(k=>{ k.moveTo(...p0); k.quadraticCurveTo(...p1, ...p2); }, A.fur, 3.4, 1);
      for (const t of [.35, .6, .85]){ const q = i => (1-t)*(1-t)*p0[i] + 2*(1-t)*t*p1[i] + t*t*p2[i]; d.circle(q(0), q(1), 1.5, '#5a3a2a', {flat:true, noShadow:true}); } },
    ears:P=>roundEars(P, P.A.fur, '#fff1e6', .3, .8, .84),
    head:P=>{ if (P.up) return; const {d, side} = P; d.line(k=>{ if (side){ k.moveTo(-R*.15, HY-R*.98); k.lineTo(-R*.02, HY-R*.72); k.moveTo(-R*.55, HY-R*.86); k.lineTo(-R*.38, HY-R*.62); }
      else { k.moveTo(0, HY-R*1.0); k.lineTo(0, HY-R*.74); k.moveTo(-R*.34, HY-R*.96); k.lineTo(-R*.25, HY-R*.76); k.moveTo(R*.34, HY-R*.96); k.lineTo(R*.25, HY-R*.76); for (const s of [-1,1]){ k.moveTo(s*R*1.0, HY+R*.08); k.lineTo(s*R*.76, HY+R*.14); k.moveTo(s*R*.98, HY+R*.32); k.lineTo(s*R*.78, HY+R*.34); } } }, '#5a3a2a', 1.4, .85); },
    snout:P=>muzzle(P, P.A.fur2, 4.8, 3.2, '#e8899c', 1.1) },
  // 고래: 귀 대신 머리 위 물줄기, 밝은 턱, 등 뒤 꼬리지느러미
  whale:{ tail:P=>{ const {d, side, up, A} = P; const tx = up ? 0 : side ? -BW*.62 : BW*.6, ty = BY+BH*.3, s = side ? -1 : 1;
      d.ell(tx, ty+3, 2.6, 5, A.fur); for (const r of [-1, 1]) d.shape(k=>{ k.beginPath(); k.ellipse(tx + (up ? r*R*.28 : s*R*.06 + r*R*.22), ty - 4 - (r===s ? 1.5 : 0), R*.34, R*.13, r*-.5, 0, Math.PI*2); }, A.fur, [tx, ty-4, R*.3]); },
    ears:()=>{},
    head:P=>{ if (P.up) return; const {d, side, A} = P; d.shape(k=>{ k.beginPath(); k.ellipse(side ? R*.3 : 0, HY + R*.8, side ? R*.55 : R*.62, R*.2, 0, 0, Math.PI*2); }, A.fur2, [0, HY + R*.8, R*.4], {flat:true, noShadow:true}); },
    top:P=>{ const {d, side} = P; const x = side ? -R*.1 : 0, y = HY - R*1.02; d.line(k=>{ k.moveTo(x, y); k.lineTo(x, y - 4); }, '#9fd6ff', 1.6, .9); for (const [dx,dy,r] of [[-3.4,-5.4,1.6],[0,-7,1.8],[3.4,-5.4,1.6]]) d.circle(x+dx, y+dy, r, '#bfe6ff', {flat:true}); },
    snout:P=>{ const {d, side, fx, fy} = P; d.line(k=>{ if (side){ k.moveTo(R*.42, fy+4.6); k.quadraticCurveTo(R*.66, fy+6.8, R*.9, fy+4.6); } else { k.moveTo(fx-4.2, fy+4.4); k.quadraticCurveTo(fx, fy+7.6, fx+4.2, fy+4.4); } }, '#3f5a86', 1, .9); } },

  rabbit:{ tail:P=>tailBall(P, '#ffffff', 3.8), ears:()=>{}, snout:P=>muzzle(P, '#ffffff', 4.2, 3, '#e8899c', 1),
    top:P=>{ const {d, side, up, A} = P; for (const sx of (side ? [-.12] : [-1, 1])){ const ex = side ? R*sx - 1 : sx*R*.42, tilt = side ? -.18 : sx*.12; d.shape(k=>{ k.beginPath(); k.ellipse(ex, HY - R*1.62, R*.27, R*.66, tilt, 0, Math.PI*2); }, A.fur, [ex, HY - R*1.6, R*.4]); if (!up) d.shape(k=>{ k.beginPath(); k.ellipse(ex, HY - R*1.6, R*.13, R*.48, tilt, 0, Math.PI*2); }, '#ffc3d6', [ex, HY - R*1.6, 2], {flat:true, noShadow:true}); } } },
  cat:{ tail:P=>{ const {d, side, up, A} = P; d.line(k=>{ if (up){ k.moveTo(0, BY+BH*.62); k.quadraticCurveTo(R*.6, BY+BH*.4, R*.4, BY); } else { k.moveTo(-BW*.4, BY+BH*.62); k.quadraticCurveTo(-BW*.95, BY+BH*.5, -BW*.75, BY-2); } }, A.fur, 3.2, 1); },
    ears:P=>triEars(P, P.A.fur, '#ffb3c1', null), head:P=>{ if (P.up || P.side) return; P.d.line(k=>{ for (const dx of [-2.2, 0, 2.2]){ k.moveTo(dx, HY - R*1.0); k.lineTo(dx*.8, HY - R*.72); } }, P.A.dark, 1, .7); },
    snout:P=>{ muzzle(P, P.A.fur2, 4, 2.8, '#e8899c', .95); const {d, side, fx, fy} = P; d.line(k=>{ for (const s of (side ? [1] : [-1, 1])) for (const dy of [-.6, .9]){ const x0 = side ? R*1.0 : fx + s*3.4; k.moveTo(x0, fy+4+dy); k.lineTo(x0 + (side ? 4 : s*5), fy+3.4+dy*1.6); } }, '#8a6a5a', .45, .7); } },
  fox:{ tail:P=>{ const {d, side, up, A} = P; const tx = up ? 0 : side ? -BW*.7 : BW*.55; d.shape(k=>{ k.beginPath(); k.ellipse(tx, BY+BH*.42, R*.42, R*.78, up ? 0 : side ? -.6 : .55, 0, Math.PI*2); }, A.fur, [tx, BY+BH*.4, R*.6]); d.circle(tx + (up ? 0 : side ? -4 : 3), BY+BH*.42 - R*.62, R*.26, '#ffffff'); },
    ears:P=>triEars(P, P.A.fur, '#fff1e6', '#3a2a2a', 1.55, .44, .64), snout:P=>muzzle(P, '#ffffff', 5, 3.4, '#3a2a2a', 1.1) },
  otter:{ tail:P=>{ const {d, side, up, A} = P; if (up) d.ell(0, BY+BH*.7, 3, 6, A.fur); else if (side) d.ell(-BW*.55, BY+BH*.75, 5.5, 2.6, A.fur); },
    ears:P=>roundEars(P, P.A.fur, P.A.dark, .22, .86, .62), snout:P=>muzzle(P, P.A.fur2, 5, 3.3, '#4a3230', 1.15) },
  mole:{ tail:P=>tailBall(P, P.A.fur, 2.4), ears:P=>roundEars(P, P.A.fur, null, .18, .9, .55), snout:P=>{ const {d, side, fx, fy} = P; if (side) d.circle(R*1.12, fy+3, 2.6, '#ff8fa6'); else d.circle(fx, fy+3.4, 2.7, '#ff8fa6'); } },
  turtle:{ tail:P=>{ const {d, side, up} = P; const sx = up ? 0 : side ? -BW*.45 : 0, rx = up ? BW*.62 : side ? BW*.45 : BW*.62; if (!up && !side){ d.ell(0, BY+BH*.38, rx, BH*.44, '#6fae5f'); return; } d.ell(sx, BY+BH*.4, rx, BH*.44, '#6fae5f'); if (up) d.line(k=>{ k.moveTo(-4,BY+3); k.lineTo(4,BY+3); k.lineTo(6,BY+9); k.lineTo(0,BY+12); k.lineTo(-6,BY+9); k.closePath(); }, '#4f8f45', .8, .9); },
    ears:()=>{}, snout:P=>{ const {d, side, fx, fy} = P; d.line(k=>{ if (side){ k.moveTo(R*.8, fy+5); k.quadraticCurveTo(R*.95, fy+6, R*1.08, fy+4.6); } else { k.moveTo(fx-1.8, fy+5); k.quadraticCurveTo(fx, fy+6.4, fx+1.8, fy+5); } }, '#4f8f45', .8, .9); } },
  bear:{ tail:P=>tailBall(P, P.A.fur, 2.8), ears:P=>roundEars(P, P.A.fur, P.A.fur2, .32, .78, .86), snout:P=>muzzle(P, P.A.fur2, 4.6, 3.3, '#3a2a2a', 1.2) },
  panda:{ tail:P=>tailBall(P, '#ffffff', 2.8), ears:P=>roundEars(P, '#2f2f3a', null, .32, .78, .86),
    head:P=>{ if (P.up) return; const {d, side, fx, fy} = P; for (const ex of (side ? [R*.46] : [-6.2, 6.2])) d.shape(k=>{ k.beginPath(); k.ellipse(fx + ex*(side?0:1) + (side ? ex : 0), fy+.4, 3.4, 4.2, side ? .3 : (ex < 0 ? .45 : -.45), 0, Math.PI*2); }, '#2f2f3a', [fx+ex, fy, 4], {flat:true, noShadow:true}); },
    snout:P=>muzzle(P, '#ffffff', 4, 2.8, '#2f2f3a', 1.1) },
  sheep:{ tail:P=>tailBall(P, '#ffffff', 3), ears:P=>{ const {d, side} = P; for (const sx of (side ? [-.3] : [-1, 1])) d.ell(side ? R*sx : sx*R*1.18, HY + R*.02, R*.34, R*.18, P.A.dark); },
    over:P=>{ const {d, side, up} = P; const pts = up ? [[-.9,-.7],[-.45,-.95],[0,-1.02],[.45,-.95],[.9,-.7],[-1.05,-.2],[1.05,-.2],[-.7,-.35],[.7,-.35],[0,-.55],[-.35,-.45],[.35,-.45]] : side ? [[-.9,-.6],[-.5,-.95],[-.05,-1.02],[.4,-.9],[-1.05,-.15],[-.75,.15],[-.6,-.5]] : [[-.95,-.62],[-.5,-.92],[0,-1.02],[.5,-.92],[.95,-.62],[-1.12,-.15],[1.12,-.15],[-.3,-.72],[.3,-.72]];
      for (const [x,y] of pts) d.circle(R*x, HY + R*y, R*.36, '#ffffff'); },
    snout:P=>muzzle(P, P.A.fur2, 3.8, 2.6, '#e8899c', .9) },
  squirrel:{ tail:P=>{ const {d, side, up, A} = P; const tx = up ? 0 : side ? -BW*.75 : BW*.7, s = up ? 1 : side ? -1 : 1; d.shape(k=>{ k.beginPath(); k.moveTo(tx - s*3, BY+BH*.75); k.bezierCurveTo(tx + s*R*.9, BY+BH*.6, tx + s*R*.9, BY - R*.9, tx - s*R*.1, BY - R*.75); k.quadraticCurveTo(tx - s*R*.55, BY - R*.4, tx - s*R*.2, BY - R*.1); k.quadraticCurveTo(tx + s*R*.3, BY+BH*.2, tx - s*3, BY+BH*.75); k.closePath(); }, A.fur, [tx, BY, R*.7]); d.circle(tx - s*R*.05, BY - R*.62, R*.3, SH(A.fur, .2)); },
    ears:P=>triEars(P, P.A.fur, '#ffd2c2', SH(P.A.fur, -.25), 1.45, .34, .6), snout:P=>muzzle(P, P.A.fur2, 4.4, 3.1, '#5a3a44', 1) },
  owl:{ tail:()=>{}, ears:P=>triEars(P, P.A.fur, null, null, 1.32, .3, .7),
    head:P=>{ if (P.up) return; const {d, side, fx, fy} = P; for (const ex of (side ? [R*.46] : [-6.2, 6.2])) d.circle(fx + ex, fy, 4.4, P.A.fur2, {flat:true}); },
    snout:P=>{ const {d, side, fx, fy} = P; if (side) d.shape(k=>{ k.beginPath(); k.moveTo(R*1.0, fy+1.5); k.lineTo(R*1.26, fy+3); k.lineTo(R*1.0, fy+4.6); k.closePath(); }, '#f3b64a', [R*1.1, fy+3, 2], {flat:true}); else d.shape(k=>{ k.beginPath(); k.moveTo(fx-1.8, fy+2.2); k.lineTo(fx+1.8, fy+2.2); k.lineTo(fx, fy+5.4); k.closePath(); }, '#f3b64a', [fx, fy+3, 2], {flat:true}); } },
  penguin:{ tail:P=>{ const {d, side, up} = P; if (up) d.shape(k=>{ k.beginPath(); k.moveTo(-3, BY+BH*.6); k.lineTo(0, BY+BH*.78); k.lineTo(3, BY+BH*.6); k.closePath(); }, P.A.fur, [0, BY+BH*.7, 3]); },
    ears:()=>{}, head:P=>{ if (P.up) return; const {d, side, fx, fy} = P; if (side) d.ell(R*.5, fy+2, R*.55, R*.62, '#ffffff', {flat:true}); else d.shape(k=>{ k.beginPath(); k.moveTo(fx, fy-5); k.bezierCurveTo(fx-4, fy-9.5, fx-12.5, fy-4, fx-11, fy+4); k.quadraticCurveTo(fx-9, fy+11, fx, fy+11); k.quadraticCurveTo(fx+9, fy+11, fx+11, fy+4); k.bezierCurveTo(fx+12.5, fy-4, fx+4, fy-9.5, fx, fy-5); k.closePath(); }, '#ffffff', [fx, fy+2, R*.7], {flat:true}); },
    snout:P=>{ const {d, side, fx, fy} = P; if (side) d.ell(R*1.12, fy+3.4, 2.6, 1.4, '#ffa94d'); else d.ell(fx, fy+3.6, 2.4, 1.5, '#ffa94d'); } },
  dog:{ tail:P=>{ const {d, side, up, A} = P; d.line(k=>{ if (up){ k.moveTo(0, BY+BH*.6); k.quadraticCurveTo(R*.4, BY+BH*.35, R*.25, BY+BH*.15); } else if (side){ k.moveTo(-BW*.4, BY+BH*.6); k.quadraticCurveTo(-BW*.85, BY+BH*.45, -BW*.7, BY+BH*.2); } }, A.fur, 3, 1); },
    ears:()=>{}, over:P=>{ const {d, side, A} = P; for (const sx of (side ? [-.3] : [-1, 1])) d.shape(k=>{ k.beginPath(); k.ellipse(side ? R*sx : sx*R*1.02, HY - R*.12, R*.3, R*.62, side ? .2 : sx*-.32, 0, Math.PI*2); }, A.dark, [sx*R, HY, R*.4]); },
    snout:P=>muzzle(P, P.A.fur2, 4.6, 3.3, '#3a2a2a', 1.2) },
  hedgehog:{ tail:()=>{}, ears:P=>{ const {d, side, up, A} = P; const n = 11; for (let i=0;i<n;i++){ const a = Math.PI*(side ? .45 + i/(n-1)*1.0 : up ? i/(n-1)*1.0 + 0 : .95 + i/(n-1)*1.1) + (up ? Math.PI : 0); const x0 = Math.cos(a)*R*1.05, y0 = Math.sin(a)*R*1.0;
      d.shape(k=>{ k.beginPath(); k.moveTo(x0 + Math.cos(a+1.57)*R*.2, HY + y0 + Math.sin(a+1.57)*R*.2); k.lineTo(Math.cos(a)*R*1.55, HY + Math.sin(a)*R*1.5); k.lineTo(x0 - Math.cos(a+1.57)*R*.2, HY + y0 - Math.sin(a+1.57)*R*.2); k.closePath(); }, A.dark, [x0, HY + y0, 3]); }
      if (!side && !up) roundEars(P, A.fur, '#ffc3d6', .2, .82, .72); },
    head:P=>{ const {d, side, up, A} = P; if (up){ d.shape(k=>{ k.beginPath(); k.ellipse(0, HY - R*.1, R*1.14, R*1.0, 0, 0, Math.PI*2); }, A.dark, [0, HY, R]); return; } d.shape(k=>{ k.beginPath(); k.ellipse(side ? -R*.55 : 0, HY - R*.62, side ? R*.62 : R*1.1, R*.48, 0, Math.PI, 0); }, A.dark, [0, HY - R*.7, R], {flat:true}); },
    snout:P=>muzzle(P, P.A.fur2, 3.8, 2.6, '#3a2a2a', 1) },
};
