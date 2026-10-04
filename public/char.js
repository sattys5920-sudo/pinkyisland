// ===== 플레이어 캐릭터: 매트 클레이 피규어 (얼굴·표정·머리 30 종·옷 60 종) =====
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
  if (!side){ c.beginPath(); c.ellipse(x-9.5, y+4, 4.4, 2.6, 0,0,7); c.fill(); }
  c.beginPath(); c.ellipse(x+(side?R*.05:9.5), y+4, 4.4, 2.6, 0,0,7); c.fill(); c.restore();
  const eyes = side ? [x+R*.42] : [x-6.5, x+6.5];
  const dot = (e, r=1.7) => { c.save(); c.fillStyle = ink; c.beginPath(); c.ellipse(e, y, r*.85, r*1.35, 0,0,7); c.fill(); c.restore(); d.dot(e-.4, y-.9, .5, '#fff', .9); };
  const arc = (e, up=true) => d.line(k=>{ k.moveTo(e-2, y+(up?.8:-.8)); k.quadraticCurveTo(e, y+(up?-2.2:2), e+2, y+(up?.8:-.8)); }, ink, 1.5);
  const lid = (e) => d.line(k=>{ k.moveTo(e-2, y-.3); k.quadraticCurveTo(e, y+1.4, e+2, y-.3); }, ink, 1.5);
  eyes.forEach((e,i)=>{
    if (expr==='happy') arc(e);
    else if (expr==='sleepy') lid(e);
    else if (expr==='wink') (i===0 ? dot(e) : arc(e));
    else if (expr==='surprised') dot(e, 2.1);
    else if (expr==='sparkle'){ dot(e, 1.9); d.dot(e+.9, y+.7, .45, '#fff', .9); }
    else if (expr==='sad'){ dot(e); d.dot(e+(i===0?-1.6:1.6), y+2.6, .9, '#8fd0ff'); }
    else dot(e);
  });
  if (expr==='surprised') for (const e of eyes) d.line(k=>{ k.moveTo(e-1.6, y-6); k.lineTo(e+1.6, y-6.3); }, mixHex(L.hairColor,'#000',.1), 1, .7);
  const mx = x+(side?R*.5:0);
  if (expr==='surprised'){ c.save(); c.fillStyle = mo; c.beginPath(); c.ellipse(mx, y+5.5, 1.1, 1.4, 0,0,7); c.fill(); c.restore(); }
  else if (expr==='cat') d.line(k=>{ k.moveTo(mx-2.2, y+4.6); k.quadraticCurveTo(mx-1.1, y+6.2, mx, y+4.8); k.quadraticCurveTo(mx+1.1, y+6.2, mx+2.2, y+4.6); }, mo, 1);
  else if (expr==='sleepy') d.line(k=>{ k.moveTo(mx-1, y+5.4); k.lineTo(mx+1, y+5.4); }, mo, 1);
  else if (expr==='sad') d.line(k=>{ k.moveTo(mx-1.3, y+5.8); k.quadraticCurveTo(mx, y+4.6, mx+1.3, y+5.8); }, mo, 1);
  else if (expr==='happy') d.line(k=>{ k.moveTo(mx-1.8, y+4.6); k.quadraticCurveTo(mx, y+6.8, mx+1.8, y+4.6); }, mo, 1.1);
  else d.line(k=>{ k.moveTo(mx-1.1, y+5); k.quadraticCurveTo(mx, y+6, mx+1.1, y+5); }, mo, 1);
}
// 머리: 동물의 숲 주민 느낌 — 가로로 넓고 납작한 둥근 네모, 턱은 평평하게, 볼은 윤곽 안에서 은은하게
function headShape(d, x, y, R, col){
  const c = d.ctx, W = R*2.3, H = R*1.78, rr = R*.82;
  const path = k => { k.beginPath(); k.roundRect(x-W/2, y-H*.52, W, H, [rr, rr, rr*.95, rr*.95]); };
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
  tight:   {side:-.14, back:.42, mass:0,    nape:.4},
  short:   {side:-.06, back:.52, mass:0,    nape:.5},
  ear:     {side:.3,   back:.72, mass:0,    nape:.66},
  nape:    {side:.22,  back:1.08, mass:0,   nape:.95},
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
    if (sp.tie==='halfup') T.ball(0, -1.3, .27);
    if (sp.tie==='pony'){ T.tail(.75, -.85, 1.42, .95, .34, .35); }
    if (sp.tie==='twin'){ T.tail(-1.12, -.22, -1.42, 1.05, .3, -.28); T.tail(1.12, -.22, 1.42, 1.05, .3, .28); }
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
  if (sp.tie==='twin'){ T.tie(-1.13, -.22); T.tie(1.13, -.22); }
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
    if (sp.tie==='halfup') T.ball(-.72, -1.05, .27);
    if (sp.tie==='pony') T.tail(-1.22, -.62, -1.62, .95, .36, -.4);
    if (sp.tie==='twin') T.tail(-1.0, -.2, -1.38, 1.05, .3, -.28);
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
  d.ell(x-u(.42), y+u(.14), u(.17), u(.22), L.skin); d.ell(x-u(.42), y+u(.15), u(.08), u(.12), mixHex(L.skin, '#c97a70', .25), {flat:true, noShadow:true});
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
  if (sp.tie==='sidepony'){ T.tail(-.72, .12, -.95, 1.3, .34, -.25); T.tie(-.72, .1); }
  if (sp.tie==='braid'){ T.braid(-.62, .05, -.78, 1.2, 6); T.tie(-.78, 1.3, .12); }
  T.gloss(-.3, -.95);
}
// ---------- 뒷모습 ----------
function hairBack(d, x, y, R, L, sp){
  const hc = L.hairColor, T = hairTools(d, x, y, R, hc), u = T.u, ln = LENS[sp.len] || LENS.short, B = ln.back, ox = CROWN.rx;
  if (sp.tie==='pony') T.tail(0, -.5, .06, 1.15, .44, .08);
  if (sp.tie==='twin'){ T.tail(-1.12, -.22, -1.42, 1.05, .3, -.28); T.tail(1.12, -.22, 1.42, 1.05, .3, .28); }
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
  if (sp.tie==='halfup'){ T.ball(0, -.85, .27); T.tie(0, -.62, .12); }
  if (sp.tie==='twin'){ T.tie(-1.13, -.22); T.tie(1.13, -.22); }
  if (sp.tie==='sidepony'){ T.tail(1.15, -.05, 1.35, 1.25, .34, .3); T.tie(1.15, -.06); }
  if (sp.tie==='braid'){ T.braid(-1.08, -.15, -1.16, 1.15, 6); T.tie(-1.16, 1.25, .12); }
  T.gloss(0, -.95, .7, .22);
}
function hair(d, x, y, L, side, R, layer, up=false){
  const sp = HAIR[L.hair] || HAIR.short;
  if (up){ hairBack(d, x, y, R, L, sp); return; }
  if (side){ hairSide(d, x, y, R, L, sp, layer); return; }
  hairFront(d, x, y, R, L, sp, layer);
}


// 그림용 좌표: 발바닥 (0,0), 몸 윗선 by, 머리 중심 hy. 머리 높이 ≈ 몸 높이
const R = 15, BH = 17, BW = 17;
const BY = -BH, HY = BY - R + 3;

// ---------- 옷 카탈로그 ----------
// 각 항목: {name, price, draw(d, g)}  g = {c, side, up, bw, step, sk, L}
// 공통 그리기 도움
const torso = (d, g, col, o) => d.rr(-g.bw/2, BY, g.bw, BH*.62, 5, col, o);
const sleeves = (d, g, col) => { if (!g.side) d.ell(-g.bw/2-1.2, BY+BH*.36, 2.9, 5.2, col); d.ell(g.bw/2+1.2, BY+BH*.36, 2.9, 5.2, col); };
const hands = (d, g) => { if (!g.side) d.circle(-g.bw/2-1.2, BY+BH*.6, 2.6, g.sk); d.circle(g.bw/2+1.2, BY+BH*.6, 2.6, g.sk); };
const bareArms = (d, g) => { if (!g.side) d.ell(-g.bw/2-1.2, BY+BH*.36, 2.7, 5, g.sk); d.ell(g.bw/2+1.2, BY+BH*.36, 2.7, 5, g.sk); };
const collar = (d, g, col) => { if (g.up) return; d.shape(c=>{ c.beginPath(); c.moveTo(-4, BY); c.lineTo(0, BY+4); c.lineTo(4, BY); c.closePath(); }, col, [0,BY+2,4], {flat:true}); };
const stripe = (d, g, col, n=3) => { if (g.up) return; for (let i=0;i<n;i++) d.rr(-g.bw/2+1, BY+2.5+i*3.2, g.bw-2, 1.4, .7, col, {flat:true, noShadow:true}); };
const front = (d, g, col) => { if (!g.up) d.rr(-BW*.16, BY+1.5, BW*.32, BH*.55, 2.5, col, {flat:true}); };
const pants = (d, g, col, h=.4) => d.rr(-g.bw*.42, BY+BH*(1-h-.05), g.bw*.84, BH*h, 3, col);
const skirt = (d, g, col, flare=1.15, h=.42) => d.shape(c=>{ c.beginPath(); c.moveTo(-g.bw*.42, BY+BH*(1-h-.05)); c.lineTo(g.bw*.42, BY+BH*(1-h-.05)); c.lineTo(g.bw*.5*flare, BY+BH*.98); c.quadraticCurveTo(0, BY+BH*1.08, -g.bw*.5*flare, BY+BH*.98); c.closePath(); }, col, [0, BY+BH*.8, g.bw*.6]);
// 발 위치: 정면은 좌우 두 발, 옆모습은 앞뒤로 엇갈리는 두 발 (뒤쪽 발은 조금 어둡게)
const feet = g => g.side ? [{x:-.3-g.step*2.2, lift:0, back:true}, {x:-.3+g.step*2.2, lift:0}] : [{x:-3.4, lift:g.a}, {x:3.4, lift:g.b}];
const shade = (col, f) => f.back ? mixHex(col, '#2a1a24', .14) : col;
const legs = (d, g, col) => { for (const f of feet(g)) d.rr(f.x-2.2, -6.5-f.lift, 4.4, 6.5, 2, shade(col, f)); };
// 신발: 다리 끝을 감싸는 작은 신발 (다리보다 살짝 넓게, 옆모습은 앞코가 앞으로)
const shoe = (d, g, col, o={}) => { for (const f of feet(g)) d.ell(f.x+(g.side?.9:0), -1.5-f.lift, g.side?3.3:2.9, 2.0, shade(col, f), o); };
const shaft = (d, g, col, h, o={}) => { for (const f of feet(g)) d.rr(f.x-2.4, -1.6-f.lift-h, 4.8, h+.6, 1.6, shade(col, f), o); };
const band = (d, g, col, y, w=1.3, o={flat:true, noShadow:true}) => { for (const f of feet(g)) d.rr(f.x-2.5+(g.side?.6:0), y-f.lift, 5, w, w/2, shade(col, f), o); };
const dress = (d, g, col, trim) => { torso(d, g, col); skirt(d, g, col, 1.3, .5); if (trim && !g.up) d.rr(-g.bw*.42, BY+BH*.5, g.bw*.84, 1.6, .8, trim, {flat:true, noShadow:true}); };

export const TOPS = {
  t01:{name:'기본 티셔츠', price:0,   draw:(d,g)=>{ torso(d,g,'#fffaf2'); bareArms(d,g); }},
  t02:{name:'줄무늬 티',   price:400, draw:(d,g)=>{ torso(d,g,'#fffaf2'); stripe(d,g,'#8fb9e8',3); bareArms(d,g); }},
  t03:{name:'니트 스웨터', price:700, draw:(d,g)=>{ torso(d,g,'#bfe6d5'); if(!g.up) d.line(k=>{ for (let i=0;i<3;i++){ k.moveTo(-5+i*5, BY+3); k.lineTo(-5+i*5, BY+9); } }, '#93c9b3', 1.2, .7); sleeves(d,g,'#bfe6d5'); hands(d,g); }},
  t04:{name:'후드티',      price:660, draw:(d,g)=>{ torso(d,g,'#a9c7ef'); if(!g.up) d.ell(0, BY+1, 6.5, 3.2, '#8fb3e2'); else d.ell(0, BY+1.5, 7, 4, '#8fb3e2'); if(!g.up) d.line(k=>{ k.moveTo(-2.5, BY+3); k.lineTo(-3, BY+8); k.moveTo(2.5, BY+3); k.lineTo(3, BY+8); }, '#fffaf2', 1, .9); sleeves(d,g,'#a9c7ef'); hands(d,g); }},
  t05:{name:'칼라 셔츠',   price:570, draw:(d,g)=>{ torso(d,g,'#fffaf2'); collar(d,g,'#e9eef7'); if(!g.up) d.line(k=>{ k.moveTo(0, BY+4); k.lineTo(0, BY+BH*.6); }, '#cfd6e3', 1, .9); if(!g.up){ d.dot(0, BY+6, .6, '#cfd6e3'); d.dot(0, BY+8.5, .6, '#cfd6e3'); } sleeves(d,g,'#fffaf2'); hands(d,g); }},
  t06:{name:'카디건',      price:750, draw:(d,g)=>{ torso(d,g,'#f3e39a'); front(d,g,'#fffaf2'); if(!g.up) d.line(k=>{ k.moveTo(-BW*.16, BY+1.5); k.lineTo(-BW*.16, BY+BH*.55); k.moveTo(BW*.16, BY+1.5); k.lineTo(BW*.16, BY+BH*.55); }, '#cdb866', .8, .5); sleeves(d,g,'#f3e39a'); hands(d,g); }},
  t07:{name:'리본 블라우스', price:790, draw:(d,g)=>{ torso(d,g,'#fff0f5'); if(!g.up){ d.ell(-2.2, BY+3, 2.2, 1.5, '#f29ab8', {flat:true}); d.ell(2.2, BY+3, 2.2, 1.5, '#f29ab8', {flat:true}); d.dot(0, BY+3, 1, '#e98aa9'); } sleeves(d,g,'#fff0f5'); hands(d,g); }},
  t08:{name:'하트 맨투맨', price:620, draw:(d,g)=>{ torso(d,g,'#f6c6d3'); if(!g.up){ d.circle(-1.6, BY+5.2, 1.6, '#e85d7a', {flat:true, noShadow:true}); d.circle(1.6, BY+5.2, 1.6, '#e85d7a', {flat:true, noShadow:true}); d.shape(c=>{ c.beginPath(); c.moveTo(-3.1, BY+5.6); c.lineTo(0, BY+9); c.lineTo(3.1, BY+5.6); c.closePath(); }, '#e85d7a', [0,BY+7,3], {flat:true, noShadow:true}); } sleeves(d,g,'#f6c6d3'); hands(d,g); }},
  t09:{name:'오버핏 재킷', price:920, draw:(d,g)=>{ d.rr(-g.bw/2-1.5, BY-.5, g.bw+3, BH*.66, 5, '#9aa6d6'); front(d,g,'#fffaf2'); collar(d,g,'#8591c4'); d.ell(-g.bw/2-1.8, BY+BH*.38, 3.3, 5.6, '#9aa6d6'); d.ell(g.bw/2+1.8, BY+BH*.38, 3.3, 5.6, '#9aa6d6'); hands(d,g); }},
  t10:{name:'꽃무늬 티',   price:530, draw:(d,g)=>{ torso(d,g,'#e6f2d9'); if(!g.up) for (const [fx,fy,col] of [[-4,BY+4,'#ffb3c6'],[3,BY+7,'#ffe08a'],[-1,BY+9.5,'#ffb3c6'],[5,BY+3,'#fff']]){ d.dot(fx,fy,1.3,col); d.dot(fx,fy,.5,'#fff3a0'); } bareArms(d,g); }},
};
export const BOTTOMS = {
  b01:{name:'청바지',      price:0,   draw:(d,g)=>{ pants(d,g,'#7d8ab0'); legs(d,g,'#7d8ab0'); }},
  b02:{name:'반바지',      price:350, draw:(d,g)=>{ pants(d,g,'#a7b6cf',.28); legs(d,g,g.sk); }},
  b03:{name:'플리츠 치마', price:570, draw:(d,g)=>{ skirt(d,g,'#f6c6d3'); if(!g.up&&!g.side) d.line(k=>{ for (let i=-2;i<=2;i++){ k.moveTo(i*3, BY+BH*.6); k.lineTo(i*3.6, BY+BH*.97); } }, '#e2a3b6', .8, .6); legs(d,g,g.sk); }},
  b04:{name:'코듀로이 바지', price:620, draw:(d,g)=>{ pants(d,g,'#c9956a'); legs(d,g,'#c9956a'); }},
  b05:{name:'체크 치마',   price:660, draw:(d,g)=>{ skirt(d,g,'#c9657a'); if(!g.up) d.line(k=>{ for (let i=-1;i<=1;i++){ k.moveTo(i*4.5, BY+BH*.58); k.lineTo(i*5.2, BY+BH*.98); } k.moveTo(-8, BY+BH*.78); k.lineTo(8, BY+BH*.78); }, '#f3dfe4', .9, .5); legs(d,g,g.sk); }},
  b06:{name:'조거 팬츠',   price:480, draw:(d,g)=>{ pants(d,g,'#8f98a8'); legs(d,g,'#8f98a8'); if(!g.side){ d.rr(-5.6,-2.2,4.4,1.6,.8,'#6e7686',{flat:true,noShadow:true}); d.rr(1.2,-2.2,4.4,1.6,.8,'#6e7686',{flat:true,noShadow:true}); } }},
  b07:{name:'튤 스커트',   price:750, draw:(d,g)=>{ skirt(d,g,'#e9dcf7',1.4,.45); g.c.save(); g.c.globalAlpha=.5; skirt(d,g,'#f7f0ff',1.55,.5); g.c.restore(); legs(d,g,g.sk); }},
  b08:{name:'카고 반바지', price:440, draw:(d,g)=>{ pants(d,g,'#9fae8a',.3); if(!g.up&&!g.side){ d.rr(-7,BY+BH*.72,3,3,1,'#8a9877',{flat:true}); d.rr(4,BY+BH*.72,3,3,1,'#8a9877',{flat:true}); } legs(d,g,g.sk); }},
  b09:{name:'레깅스',      price:400, draw:(d,g)=>{ pants(d,g,'#5b5f73',.4); legs(d,g,'#5b5f73'); }},
  b10:{name:'롱 스커트',   price:700, draw:(d,g)=>{ skirt(d,g,'#f0d4a8',1.2,.5); d.rr(-g.bw*.46, BY+BH*.95, g.bw*.92, 4.5, 2, '#f0d4a8'); legs(d,g,g.sk); }},
};
export const SETS = {
  s01:{name:'멜빵바지',    price:0,   draw:(d,g)=>{ torso(d,g,'#fffaf2'); bareArms(d,g); pants(d,g,'#f29ab8',.5); legs(d,g,'#f29ab8'); if(!g.up){ d.rr(-5.5,BY,2.2,BH*.55,1,'#f29ab8',{flat:true}); d.rr(3.3,BY,2.2,BH*.55,1,'#f29ab8',{flat:true}); d.rr(-4,BY+5,8,5,1.5,'#f29ab8',{flat:true}); d.dot(-4.4,BY+5.5,.8,'#ffe08a'); d.dot(4.4,BY+5.5,.8,'#ffe08a'); } }},
  s02:{name:'핑크 원피스', price:1660, draw:(d,g)=>{ dress(d,g,'#f6c6d3','#fffaf2'); if(!g.up) collar(d,g,'#fffaf2'); sleeves(d,g,'#f6c6d3'); hands(d,g); legs(d,g,g.sk); }},
  s03:{name:'교복 세트',   price:2180, draw:(d,g)=>{ torso(d,g,'#5c6a92'); front(d,g,'#fffaf2'); collar(d,g,'#fffaf2'); if(!g.up) d.rr(-1,BY+3.5,2,5,1,'#e85d7a',{flat:true,noShadow:true}); sleeves(d,g,'#5c6a92'); hands(d,g); skirt(d,g,'#8a93b5',1.15,.4); if(!g.up&&!g.side) d.line(k=>{ for (let i=-2;i<=2;i++){ k.moveTo(i*3, BY+BH*.6); k.lineTo(i*3.6, BY+BH*.97); } }, '#6f789a', .8, .6); legs(d,g,g.sk); }},
  s04:{name:'공룡 잠옷',   price:2300, draw:(d,g)=>{ torso(d,g,'#9fd9a8'); pants(d,g,'#9fd9a8',.5); legs(d,g,'#9fd9a8'); sleeves(d,g,'#9fd9a8'); hands(d,g); if(!g.up) d.ell(0,BY+6,4,5,'#e8f6d8',{flat:true}); for (const [sx,sy] of [[-3,BY-1],[0,BY-2.2],[3,BY-1]]) d.shape(c=>{ c.beginPath(); c.moveTo(sx-1.6,sy+1); c.lineTo(sx,sy-2.2); c.lineTo(sx+1.6,sy+1); c.closePath(); }, '#6fc47a', [sx,sy,2], {flat:true}); }},
  s05:{name:'세일러복',    price:1920, draw:(d,g)=>{ torso(d,g,'#fffaf2'); if(!g.up){ d.shape(c=>{ c.beginPath(); c.moveTo(-6,BY); c.lineTo(0,BY+5); c.lineTo(6,BY); c.lineTo(6,BY+3); c.lineTo(0,BY+7.5); c.lineTo(-6,BY+3); c.closePath(); }, '#6f86b8', [0,BY+3,6], {flat:true}); d.dot(0,BY+6.5,1.1,'#e85d7a'); } sleeves(d,g,'#fffaf2'); hands(d,g); skirt(d,g,'#6f86b8',1.15,.4); legs(d,g,g.sk); }},
  s06:{name:'트레이닝 세트', price:1790, draw:(d,g)=>{ torso(d,g,'#f28c8c'); if(!g.up) d.line(k=>{ k.moveTo(-g.bw/2+1, BY+4); k.lineTo(g.bw/2-1, BY+4); }, '#fffaf2', 1.4, .9); sleeves(d,g,'#f28c8c'); hands(d,g); pants(d,g,'#f28c8c',.42); legs(d,g,'#f28c8c'); if(!g.side) d.line(k=>{ k.moveTo(-3.4,-6.5); k.lineTo(-3.4,-1); k.moveTo(3.4,-6.5); k.lineTo(3.4,-1); }, '#fffaf2', 1, .9); }},
  s07:{name:'파티 드레스', price:2880, draw:(d,g)=>{ dress(d,g,'#d2b8ff','#fff'); skirt(d,g,'#c4a6f5',1.5,.55); if(!g.up){ d.dot(-3,BY+BH*.75,1,'#fff',.9); d.dot(2,BY+BH*.85,.8,'#fff',.9); d.dot(5,BY+BH*.7,.8,'#fff',.9); d.ell(0,BY+2,3,1.8,'#fff',{flat:true}); } bareArms(d,g); legs(d,g,g.sk); }},
  s08:{name:'요리사 세트', price:2050, draw:(d,g)=>{ torso(d,g,'#fffaf2'); if(!g.up){ d.rr(-g.bw*.36,BY+3,g.bw*.72,BH*.9,3,'#f6c6a3',{flat:true}); d.dot(-2,BY+4.5,.7,'#8a6a5a'); d.dot(2,BY+4.5,.7,'#8a6a5a'); } sleeves(d,g,'#fffaf2'); hands(d,g); pants(d,g,'#5b5f73',.35); legs(d,g,'#5b5f73'); }},
  s09:{name:'농부 작업복', price:1540, draw:(d,g)=>{ torso(d,g,'#c9d7a3'); pants(d,g,'#b9915f',.5); legs(d,g,'#b9915f'); if(!g.up){ d.rr(-5.5,BY,2.2,BH*.55,1,'#b9915f',{flat:true}); d.rr(3.3,BY,2.2,BH*.55,1,'#b9915f',{flat:true}); d.rr(-4,BY+5,8,5,1.5,'#b9915f',{flat:true}); d.dot(0,BY+7.5,1,'#e85d7a'); } sleeves(d,g,'#c9d7a3'); hands(d,g); }},
  s10:{name:'토끼 잠옷',   price:2300, draw:(d,g)=>{ torso(d,g,'#fff0f5'); pants(d,g,'#fff0f5',.5); legs(d,g,'#fff0f5'); sleeves(d,g,'#fff0f5'); hands(d,g); if(!g.up) d.ell(0,BY+6.5,4,5,'#ffd9e6',{flat:true}); d.ell(-5,HY-R*1.5,2.2,6,'#fff0f5'); d.ell(5,HY-R*1.5,2.2,6,'#fff0f5'); d.ell(-5,HY-R*1.5,1.1,4,'#ffc3d6',{flat:true,noShadow:true}); d.ell(5,HY-R*1.5,1.1,4,'#ffc3d6',{flat:true,noShadow:true}); }},
};
export const HATS = {
  none:  {name:'없음', price:0, draw:()=>{}},
  straw: {name:'밀짚모자', price:680, draw:(d,g)=>{ d.ell(0,HY-R*1.0,R*1.45,3.8,'#f3d27a'); d.ell(0,HY-R*1.2,R*.78,6,'#f3d27a'); d.rr(-R*.78,HY-R*1.2,R*1.56,2.4,1.2,'#ff7a9a',{flat:true}); }},
  beanie:{name:'비니', price:620, draw:(d,g)=>{ d.rr(-R*1.15,HY-R*1.5,R*2.3,R*.9,R*.5,'#ff9f7a'); d.rr(-R*1.2,HY-R*.75,R*2.4,4,2,'#ffb896'); d.circle(0,HY-R*1.6,3.6,'#fffaf2'); }},
  cap:   {name:'캡모자', price:730, draw:(d,g)=>{ d.shape(c=>{ c.beginPath(); c.ellipse(0,HY-R*.7,R*1.2,R*.78,0,Math.PI,0); c.closePath(); },'#6fa8ff',[0,HY-R,R*1.2]); if (g.side) d.ell(R*1.0,HY-R*.72,6.5,2,'#5b93e6'); else if (!g.up) d.ell(0,HY-R*.62,R*.95,2.6,'#5b93e6'); d.dot(0,HY-R*1.5,1.4,'#5b93e6'); }},
  pin:   {name:'리본핀', price:310, draw:(d,g)=>{ if (g.up) return; const px = g.side ? R*.2 : R*.6, py = HY-R*.95; d.ell(px-2.4,py,2.6,1.8,'#ff86ad',{flat:true}); d.ell(px+2.4,py,2.6,1.8,'#ff86ad',{flat:true}); d.dot(px,py,1.1,'#ffd6e2'); }},
  beret: {name:'베레모', price:780, draw:(d,g)=>{ d.ell(-2,HY-R*1.22,R*1.25,R*.55,'#c9657a'); d.rr(-R*1.0,HY-R*.95,R*2.0,3,1.5,'#b85568'); d.dot(-2,HY-R*1.75,1.3,'#b85568'); }},
  bucket:{name:'버킷햇', price:730, draw:(d,g)=>{ d.rr(-R*1.0,HY-R*1.5,R*2.0,R*.75,R*.3,'#e6dcc3'); d.ell(0,HY-R*.78,R*1.4,3.6,'#d9ccae'); }},
  earmuff:{name:'귀도리', price:570, draw:(d,g)=>{ d.line(k=>{ k.moveTo(-R*1.05,HY-R*.2); k.quadraticCurveTo(0,HY-R*1.55,R*1.05,HY-R*.2); }, '#8a7a86', 1.6, .9); d.circle(-R*1.12,HY+R*.05,4.2,'#fff0f5'); d.circle(R*1.12,HY+R*.05,4.2,'#fff0f5'); }},
  crown: {name:'왕관', price:0, need:'loot:m28', n:1, draw:(d,g)=>{ d.rr(-8,HY-R*1.55,16,6,2,'#ffd23f'); for (const cx of [-6,0,6]) d.shape(c=>{ c.beginPath(); c.moveTo(cx-3,HY-R*1.5); c.lineTo(cx,HY-R*1.95); c.lineTo(cx+3,HY-R*1.5); c.closePath(); },'#ffd23f',[cx,HY-R*1.7,3],{flat:true}); d.dot(0,HY-R*1.35,1.6,'#ff4f6d'); }},
  flower:{name:'꽃 화관', price:780, need:'crop:c18', n:3, draw:(d,g)=>{ for (let a=Math.PI*1.02; a<Math.PI*1.98; a+=.26) d.circle(Math.cos(a)*R*1.15, HY-R*.35+Math.sin(a)*R*.95, 2.7, ['#ff8fc4','#ffe066','#ffffff','#c9a6ff'][Math.round(a*3)%4], {flat:true}); }},
  witch: {name:'마법사 모자', price:1300, need:'loot:m16', n:2, draw:(d,g)=>{ d.ell(0,HY-R*1.0,R*1.45,3.6,'#5b4a8f'); d.shape(c=>{ c.beginPath(); c.moveTo(-8,HY-R*1.05); c.quadraticCurveTo(0,HY-R*1.6,4,HY-R*2.6); c.quadraticCurveTo(4,HY-R*1.6,8,HY-R*1.05); c.closePath(); },'#6f5bb5',[0,HY-R*1.7,8]); d.dot(1,HY-R*1.25,1.6,'#ffd23f'); }},
};
export const ACCS = {
  none:   {name:'없음', price:0, draw:()=>{}},
  glassR: {name:'동그란 안경', price:530, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.line(k=>{ k.arc(e,y,3.4,0,7); }, '#6e5260', 1.2, .9); if (!g.side) d.line(k=>{ k.moveTo(-3.1,y); k.lineTo(3.1,y); }, '#6e5260', 1, .9); }},
  glassS: {name:'네모 안경', price:530, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.line(k=>{ k.roundRect(e-3.4,y-2.8,6.8,5.6,1.5); }, '#4a3a44', 1.2, .9); if (!g.side) d.line(k=>{ k.moveTo(-3.1,y); k.lineTo(3.1,y); }, '#4a3a44', 1, .9); }},
  sun:    {name:'선글라스', price:720, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.28, ex = g.side ? [R*.64] : [-6.5,6.5]; for (const e of ex) d.ell(e,y,3.6,3,'#3a3040',{flat:true}); if (!g.side) d.line(k=>{ k.moveTo(-3,y); k.lineTo(3,y); }, '#3a3040', 1.2, .9); for (const e of ex) d.dot(e-1.2,y-1,.8,'#fff',.6); }},
  bowtie: {name:'리본 넥타이', price:430, draw:(d,g)=>{ if (g.up) return; const y = BY+2.5; d.ell(-2.4,y,2.4,1.6,'#e85d7a',{flat:true}); d.ell(2.4,y,2.4,1.6,'#e85d7a',{flat:true}); d.dot(0,y,1,'#ff9fb8'); }},
  scarf:  {name:'목도리', price:670, draw:(d,g)=>{ d.rr(-g.bw/2-1, BY-2, g.bw+2, 4.5, 2.2, '#f28c8c'); if (!g.up) d.rr(2, BY+1, 3.4, 7, 1.5, '#f28c8c'); }},
  starch: {name:'별 볼 스티커', price:290, draw:(d,g)=>{ if (g.up) return; const y = HY+R*.5; for (const e of (g.side ? [R*.6] : [-R*.62, R*.62])) d.dot(e, y, 1.3, '#ffd23f'); }},
  neck:   {name:'목걸이', price:620, draw:(d,g)=>{ if (g.up) return; d.line(k=>{ k.moveTo(-4, BY); k.quadraticCurveTo(0, BY+4.5, 4, BY); }, '#e8c26a', .9, .9); d.dot(0, BY+2.8, 1.1, '#ff6f9a'); }},
  bandage:{name:'코 반창고', price:240, draw:(d,g)=>{ if (g.up) return; d.rr((g.side?R*.6:0)-2.4, HY+R*.42, 4.8, 1.8, .9, '#f6d9c2', {flat:true, noShadow:true}); d.dot((g.side?R*.6:0)-1.4, HY+R*.48, .35, '#d9b7a0'); d.dot((g.side?R*.6:0)+1.4, HY+R*.48, .35, '#d9b7a0'); }},
  headphone:{name:'헤드폰', price:910, draw:(d,g)=>{ d.line(k=>{ k.moveTo(-R*1.1,HY-R*.1); k.quadraticCurveTo(0,HY-R*1.5,R*1.1,HY-R*.1); }, '#8a7a86', 1.6, .9); d.rr(-R*1.3,HY-R*.3,4.5,7,2,'#f6c6d3'); d.rr(R*1.3-4.5,HY-R*.3,4.5,7,2,'#f6c6d3'); }},
  earring:{name:'꽃 귀걸이', price:480, draw:(d,g)=>{ if (g.up) return; for (const e of (g.side ? [R*1.15] : [-R*1.2, R*1.2])){ d.dot(e, HY+R*.35, 1.5, '#ff8fc4'); d.dot(e, HY+R*.35, .6, '#ffe066'); } }},
};
export const SHOES = {
  sh01:{name:'운동화',     price:0,   draw:(d,g)=>{ shoe(d,g,'#fffaf4'); band(d,g,'#e9dfe4',-1.1,.9); }},
  sh02:{name:'메리제인',   price:480, draw:(d,g)=>{ shoe(d,g,'#5a3a44'); if(!g.side) band(d,g,'#5a3a44',-3.4,.9); }},
  sh03:{name:'노랑 장화',  price:570, draw:(d,g)=>{ shaft(d,g,'#ffd45a',4.6); shoe(d,g,'#ffd45a'); }},
  sh04:{name:'샌들',       price:400, draw:(d,g)=>{ shoe(d,g,g.sk,{noShadow:true}); band(d,g,'#d9a06a',-2.6,1.1); band(d,g,'#c9895a',-.9,.9); }},
  sh05:{name:'갈색 부츠',  price:700, draw:(d,g)=>{ shaft(d,g,'#8a5a3c',4.0); shoe(d,g,'#8a5a3c'); }},
  sh06:{name:'슬리퍼',     price:310, draw:(d,g)=>{ shoe(d,g,'#a9c7ef'); band(d,g,'#8fb3e2',-2.8,1.5); }},
  sh07:{name:'토끼 슬리퍼', price:660, draw:(d,g)=>{ shoe(d,g,'#fff0f5'); for (const f of feet(g)){ const x = f.x+(g.side?1.6:0), y = -1.5-f.lift; if (!g.up){ d.dot(x-(g.side?0:1.1), y-.4, .45, '#5a3a44'); if(!g.side) d.dot(x+1.1, y-.4, .45, '#5a3a44'); } d.ell(x-.9, y-2.4, .8, 1.6, '#fff0f5', {noShadow:true}); d.ell(x+.9, y-2.4, .8, 1.6, '#fff0f5', {noShadow:true}); } }},
  sh08:{name:'빨간 하이탑', price:620, draw:(d,g)=>{ shaft(d,g,'#e85d5d',2.8); shoe(d,g,'#e85d5d'); band(d,g,'#fffaf4',-1.0,1.1); }},
  sh09:{name:'로퍼',       price:570, draw:(d,g)=>{ shoe(d,g,'#3f3a4a'); if(!g.up) for (const f of feet(g)) d.rr(f.x-1.2+(g.side?1.3:0), -2.9-f.lift, 2.4, .9, .45, '#c9a85a', {flat:true, noShadow:true}); }},
  sh10:{name:'털 부츠',    price:750, draw:(d,g)=>{ shaft(d,g,'#d9b38c',4.4); shoe(d,g,'#d9b38c'); for (const f of feet(g)) d.rr(f.x-2.7, -6.9-f.lift, 5.4, 1.9, .95, '#fff6ea', {noShadow:true}); }},
};
export const CATS = [['top','상의',TOPS],['bottom','하의',BOTTOMS],['set','세트',SETS],['hat','모자',HATS],['acc','액세서리',ACCS],['shoes','신발',SHOES]];
export const FREE = ['t01','t02','b01','b02','s01','sh01'];
export const HAIR_M = Object.keys(HAIR).filter(k=>HAIR[k].g==='m'), HAIR_F = Object.keys(HAIR).filter(k=>HAIR[k].g==='f');
export const SKINS = ['#ffe4d2','#f9d3b8','#eebd98','#d9a07a','#b87a55','#8d5a3c'];
export const HAIR_COLORS = ['#262227','#3a2a2a','#4a3228','#6a4a36','#a8784c','#c9a06a','#e8c77a','#9a9aa6','#f2a0b8','#8fc3ea','#b76e79','#5a3a2a'];
export const defaultLook = () => ({skin:'#f9d3b8', hair:'long', hairColor:'#4a3228', top:'t01', bottom:'b01', set:'', hat:'none', acc:'none', shoes:'sh01'});
// 옛 저장(outfit/outfitColor/eyes) → 새 형식
export function migrateLook(L){
  if (!L) return defaultLook();
  if (L.top || L.set) return {...defaultLook(), ...L};
  const n = {...defaultLook(), skin:L.skin||'#f9d3b8', hair:HAIR[L.hair] ? L.hair : 'long', hairColor:L.hairColor||'#4a3228', hat:HATS[L.hat] ? L.hat : 'none'};
  const o = L.outfit; if (o==='overall') n.set = 's01'; else if (o==='dress') n.set = 's02'; else if (o==='hoodie'){ n.top = 't04'; n.bottom = 'b06'; } else if (o==='shirt'){ n.top = 't05'; } else if (o==='tee'){ n.top = 't02'; }
  return n;
}
export const lookItems = L => [L.set || L.top, L.set ? null : L.bottom, L.hat, L.acc, L.shoes].filter(Boolean);
export const ITEM = id => TOPS[id] || BOTTOMS[id] || SETS[id] || HATS[id] || ACCS[id] || SHOES[id];

// ---------- 전체 그리기 ----------
// dir: down(정면) / left / right / up(뒷모습). t: 초. walk: 걷는 중. expr: 표정
export function figure(d, L, dir, t, walk, expr){
  const c = d.ctx, side = dir==='left' || dir==='right', up = dir==='up';
  const ph = t*8, step = walk ? Math.sin(ph) : 0, bob = walk ? Math.abs(Math.sin(ph))*1.2 : Math.sin(t*2)*.3+.3;
  const a = Math.max(0,step)*1.6, b = Math.max(0,-step)*1.6;
  c.save(); if (dir==='left') c.scale(-1,1);
  c.save(); c.fillStyle='rgba(60,30,50,.14)'; c.beginPath(); c.ellipse(0, 1, BW*.75, 3, 0,0,7); c.fill(); c.restore();
  c.translate(0, -bob);
  const g = {c, side, up, bw: side ? BW*.8 : BW, step, a, b, sk:L.skin, L};
  const set = SETS[L.set], top = TOPS[L.top] || TOPS.t01, bottom = BOTTOMS[L.bottom] || BOTTOMS.b01;
  const hat = HATS[L.hat] || HATS.none, acc = ACCS[L.acc] || ACCS.none, shoes = SHOES[L.shoes] || SHOES.sh01;
  if (!up) hair(d, 0, HY, L, side, R, 'back');
  // 하의(다리) → 신발 → 상의. 세트는 한 번에 그리고 신발을 마지막에
  if (set){ set.draw(d, g); shoes.draw(d, g); } else { bottom.draw(d, g); shoes.draw(d, g); top.draw(d, g); }
  // 머리
  if (!side) { d.ell(-R*1.2, HY+R*.1, 2.4, 3, L.skin); d.ell(R*1.2, HY+R*.1, 2.4, 3, L.skin); }
  headShape(d, 0, HY, R, L.skin);
  if (!up) face(d, side ? R*.22 : 0, HY+R*.28, L, side, expr);
  hair(d, 0, HY, L, side, R, 'front', up);
  acc.draw(d, g); hat.draw(d, g);
  c.restore();
}
export const FIG_BOX = {w:72, h:92, ox:36, oy:82}; // 스프라이트 캔버스 크기와 발 위치
