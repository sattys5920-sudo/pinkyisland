// ===== 플레이어 캐릭터: 매트 클레이 피규어 (얼굴·표정·머리 30종·옷 60종) =====
export function mixHex(a, b, k){ const A=parseInt(a.slice(1),16), B=parseInt(b.slice(1),16); const f=(x,y)=>Math.round(x+(y-x)*k); return '#'+[f(A>>16,B>>16),f(A>>8&255,B>>8&255),f(A&255,B&255)].map(v=>v.toString(16).padStart(2,'0')).join(''); }
export function mattePainter(ctx){
  function paint(path, col, [cx,cy,r], opt={}){
    ctx.save();
    if (r >= 5 && !opt.noShadow){ ctx.save(); ctx.translate(Math.min(1.5, r*.06), Math.min(2.2, Math.max(.8, r*.1))); ctx.globalAlpha = .13; path(ctx); ctx.fillStyle = '#4a2a3a'; ctx.fill(); ctx.restore(); }
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
// ===== 머리 모양 30종 (남 15 · 여 15). 단위는 머리 반지름 R. layer: 'back'(머리 뒤) / 'front'(머리 앞) =====
function hairKit(d, x, y, R, hc){
  const u = v => v*R;
  const K = {
    // 돔: 윗머리 덮개. cy = 아랫선 높이, rx·ry 크기
    dome:(rx=1.24, ry=.78, cy=-.42)=>d.shape(c=>{ c.beginPath(); c.ellipse(x, y+u(cy), u(rx), u(ry), 0, Math.PI, 0); c.closePath(); }, hc, [x, y-u(.6), u(1.15)]),
    // 바가지: 돔 + 옆이 눈 높이까지 내려오는 덮개
    helmet:(rx=1.26, top=1.2, bottom=.15)=>d.shape(c=>{ c.beginPath(); c.moveTo(x-u(rx), y+u(bottom)); c.lineTo(x-u(rx), y-u(.2)); c.ellipse(x, y-u(.2), u(rx), u(top-.2), 0, Math.PI, 0); c.lineTo(x+u(rx), y+u(bottom)); c.closePath(); }, hc, [x, y-u(.4), u(1.2)]),
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
export const HAIR = {
  // ---------- 남 15 ----------
  short:  {g:'m', label:'숏컷',       back:K=>{}, front:K=>{ K.dome(); K.short(); K.gloss(); }},
  part:   {g:'m', label:'가르마',     back:K=>{}, front:K=>{ K.dome(); K.sweepR(); K.gloss(); }},
  dandy:  {g:'m', label:'댄디컷',     back:K=>{}, front:K=>{ K.helmet(1.26,1.2,-.25); K.straight(-.02); K.gloss(); }},
  center: {g:'m', label:'가운데 가르마', back:K=>{}, front:K=>{ K.dome(); K.curtain(); K.gloss(); }},
  perm:   {g:'m', label:'소프트 펌',  back:K=>{ K.back(2.3,-.6,1.1,.7); }, front:K=>{ K.dome(1.26,.85,-.4); K.lock(.2,-1.05,-.9,-.02,.44,-.5); K.lock(.2,-1.05,-.4,.0,.4,.25); K.lock(.2,-1.05,.2,-.22,.34,-.2); K.lock(.3,-1.0,.9,-.1,.4,.4); K.ball(-1.12,.3,.24); K.ball(1.12,.3,.24); K.ball(-1.0,-.35,.2); K.ball(1.05,-.4,.2); K.gloss(); }},
  twoblock:{g:'m', label:'투블럭',    back:K=>{}, front:K=>{ K.dome(1.1,.85,-.5); K.lock(.2,-1.1,-.9,-.1,.44,-.35); K.lock(.2,-1.15,-.3,-.05,.38,-.15); K.lock(.2,-1.1,.3,-.2,.34,.05); K.lock(.25,-1.1,.85,-.2,.36,.25); K.gloss(); }},
  slick:  {g:'m', label:'올백',       back:K=>{}, front:K=>{ K.dome(1.22,1.05,-.45); K.lock(-.7,-.55,-.4,-1.2,.3,-.1); K.lock(0,-.55,.05,-1.25,.32,0); K.lock(.7,-.55,.45,-1.2,.3,.1); K.gloss(0,-1.0,.6,.18); }},
  wolf:   {g:'m', label:'울프컷',     back:K=>{ K.lock(-.9,-.3,-1.05,1.0,.3,-.1); K.lock(.9,-.3,1.05,1.0,.3,.1); K.lock(0,-.2,.0,.9,.5,0); }, front:K=>{ K.dome(1.26,1.05); K.spikes(4,.15); K.sweepL(); K.gloss(); }},
  longm:  {g:'m', label:'장발',       back:K=>{ K.back(2.5,-.6,2.0,.6); }, front:K=>{ K.dome(); K.curtain(); K.sides(1.3,.32,-.3,1.12); K.gloss(); }},

  comma:  {g:'m', label:'쉼표머리',   back:K=>{}, front:K=>{ K.dome(1.22,.8,-.42); K.lock(-.15,-1.05,-.95,-.15,.4,-.35); K.lock(.1,-1.08,-.35,.05,.42,-.55); K.lock(.2,-1.05,.3,-.2,.34,.3); K.lock(.35,-1.0,.95,-.2,.36,.3); K.gloss(); }},
  gile:   {g:'m', label:'가일컷',     back:K=>{}, front:K=>{ K.dome(1.22,.8,-.42); K.lock(.55,-1.05,-1.0,.15,.46,-.5); K.lock(.55,-1.05,-.45,.05,.4,-.3); K.lock(.55,-1.0,.1,-.25,.3,-.05); K.lock(.6,-1.0,1.0,-.25,.34,.2); K.lock(-1.1,-.3,-1.12,.35,.3,-.05); K.gloss(); }},
  seethru:{g:'m', label:'시스루뱅',   back:K=>{}, front:K=>{ K.dome(1.22,.8,-.42); const dy=[.0,-.06,.03,-.04,.02]; for (let i=0;i<5;i++){ const lx=-.8+i*.4; K.lock(lx*.4,-1.05,lx,-.02+dy[i],.25,lx*.12); } K.lock(-1.1,-.3,-1.1,.3,.28,-.05); K.lock(1.1,-.3,1.1,.3,.28,.05); K.gloss(); }},
  layered:{g:'m', label:'레이어드컷', back:K=>{ K.back(2.4,-.6,1.5,.7); }, front:K=>{ K.dome(1.24,.8,-.42); K.curtain(); K.lock(-1.12,-.3,-1.2,.7,.34,-.1); K.lock(1.12,-.3,1.2,.7,.34,.1); K.lock(-1.05,.2,-1.15,.95,.28,-.05); K.lock(1.05,.2,1.15,.95,.28,.05); K.gloss(); }},
  softwave:{g:'m', label:'내추럴 웨이브', back:K=>{ K.back(2.4,-.6,1.3,.7); }, front:K=>{ K.dome(1.26,.85,-.4); K.lock(0,-1.05,-1.0,.05,.42,-.25); K.lock(0,-1.05,-.55,-.05,.36,.15); K.lock(0,-1.05,-.15,-.3,.3,-.1); K.lock(0,-1.05,1.0,.05,.42,.25); K.lock(0,-1.05,.55,-.05,.36,-.15); K.lock(0,-1.05,.15,-.3,.3,.1); K.ball(-1.15,.45,.22); K.ball(1.15,.45,.22); K.gloss(); }},
  asperm: {g:'m', label:'애즈펌',     back:K=>{ K.back(2.3,-.6,1.2,.7); }, front:K=>{ K.dome(1.24,.85,-.4); K.lock(0,-1.05,-.95,.0,.42,-.45); K.lock(0,-1.05,-.5,-.02,.36,-.2); K.lock(0,-1.05,.95,.0,.42,.45); K.lock(0,-1.05,.5,-.02,.36,.2); K.ball(-.95,.08,.2); K.ball(.95,.08,.2); K.ball(-1.15,.5,.22); K.ball(1.15,.5,.22); K.gloss(); }},
  // ---------- 여 15 ----------
  ccurl:  {g:'f', label:'C컬 단발',   back:K=>{ K.back(2.5,-.7,1.6,.7); K.ball(-1.0,.95,.3); K.ball(1.0,.95,.3); K.ball(-.45,1.05,.28); K.ball(.45,1.05,.28); }, front:K=>{ K.dome(); K.sweepR(); K.sides(.8,.34,-.3); K.gloss(); }},
  bob:    {g:'f', label:'단발',       back:K=>{ K.back(2.52,-.7,1.75,.7); }, front:K=>{ K.dome(); K.sweepR(); K.sides(.9,.34,-.3); K.gloss(); }},
  long:   {g:'f', label:'긴 생머리',  back:K=>{ K.back(2.56,-.6,2.5,.6); }, front:K=>{ K.dome(); K.sweepR(); K.sides(1.7,.34,-.3); K.gloss(); }},
  pony:   {g:'f', label:'포니테일',   back:K=>{ K.lock(1.05,-.7,1.3,.9,.32,.35); K.ball(1.05,-.72,.3); }, front:K=>{ K.dome(); K.sweepL(); K.gloss(); }},
  wave:   {g:'f', label:'웨이브',     back:K=>{ K.back(2.5,-.6,1.6,.7); K.curls(1.05, 6, .3, 1.25); K.curls(.65, 2, .32, 1.3); }, front:K=>{ K.dome(); K.curtain(); K.curls(.3, 2, .3, 1.28); K.gloss(); }},
  bun:    {g:'f', label:'똥머리',     back:K=>{ K.ball(0,-1.3,.4); }, front:K=>{ K.dome(1.2,1.0,-.4); K.lock(-.8,-.5,-.1,-1.1,.26,-.2); K.lock(.8,-.5,.1,-1.1,.26,.2); K.lock(.3,-1.0,-.6,-.2,.26,-.15); K.gloss(0,-1.0,.5,.15); }},
  twin:   {g:'f', label:'양갈래',     back:K=>{ K.lock(-1.1,-.3,-1.4,1.0,.3,-.3); K.lock(1.1,-.3,1.4,1.0,.3,.3); K.ball(-1.1,-.35,.26); K.ball(1.1,-.35,.26); }, front:K=>{ K.dome(); K.straight(-.05); K.gloss(); }},
  braid:  {g:'f', label:'땋은 머리',  back:K=>{ for (let i=0;i<5;i++) K.ball(1.05+(i%2?.08:-.08), -.3+i*.3, .22); }, front:K=>{ K.dome(); K.sweepR(); K.sides(.5,.3,-.3); K.gloss(); }},
  twinbun:{g:'f', label:'트윈 번',    back:K=>{ K.ball(-1.0,-1.05,.34); K.ball(1.0,-1.05,.34); }, front:K=>{ K.dome(1.2,1.0,-.35); K.lock(-.6,-.5,-.9,-1.0,.26,-.1); K.lock(.6,-.5,.9,-1.0,.26,.1); K.lock(.2,-1.0,-.5,-.2,.26,-.1); K.gloss(0,-1.0,.5,.15); }},
  shortbob:{g:'f', label:'앞머리 단발', back:K=>{ K.back(2.5,-.7,1.4,.7); }, front:K=>{ K.dome(); K.straight(-.05); K.sides(.7,.34,-.3); K.gloss(); }},
  sidepony:{g:'f', label:'사이드 포니', back:K=>{ K.lock(-1.1,-.2,-1.25,1.2,.34,-.3); K.ball(-1.1,-.25,.3); }, front:K=>{ K.dome(); K.sweepR(); K.gloss(); }},
  halfup: {g:'f', label:'반묶음',     back:K=>{ K.back(2.5,-.6,2.3,.6); K.ball(0,-1.25,.28); }, front:K=>{ K.dome(1.2,1.0,-.35); K.curtain(); K.sides(1.5,.3,-.3); K.gloss(); }},
  bangslong:{g:'f', label:'뱅 긴머리', back:K=>{ K.back(2.56,-.6,2.5,.6); }, front:K=>{ K.dome(); K.straight(-.02); K.sides(1.7,.34,-.3); K.gloss(); }},
  pixie:  {g:'f', label:'픽시컷',     back:K=>{}, front:K=>{ K.dome(1.22,.85,-.4); K.lock(.4,-1.0,-1.0,.0,.38,-.35); K.lock(.4,-1.05,-.4,-.1,.34,-.15); K.lock(.4,-1.0,.15,-.28,.3,0); K.lock(.45,-1.0,.75,-.3,.3,.15); K.lock(-.9,-.3,-1.08,.25,.26,-.05); K.gloss(); }},
  medium: {g:'f', label:'레이어드 미디움', back:K=>{ K.back(2.5,-.6,2.0,.7); K.lock(-1.1,.2,-1.3,1.2,.3,-.2); K.lock(1.1,.2,1.3,1.2,.3,.2); }, front:K=>{ K.dome(); K.curtain(); K.sides(1.2,.32,-.3); K.gloss(); }},
};

// ---------- 옆모습 머리 (오른쪽을 보는 기준, 앞 = +x) ----------
// fringe: 앞머리 종류 / fall: 뒤로 늘어지는 길이(R 단위) / tail: 포니테일 / bun: [x,y,r] / braid / twin / curls / curlEnd / thin
const SIDE_SPEC = {
  short:{fringe:'short'}, part:{fringe:'sweep'}, dandy:{fringe:'straight'}, center:{fringe:'curtain'}, perm:{fringe:'sweep', curls:true},
  twoblock:{fringe:'sweep'}, slick:{fringe:'up'}, wolf:{fringe:'sweep', fall:.9}, longm:{fringe:'curtain', fall:1.3}, comma:{fringe:'comma'},
  gile:{fringe:'gile'}, seethru:{fringe:'thin'}, layered:{fringe:'curtain', fall:.7}, softwave:{fringe:'curtain', curls:true, fall:.35}, asperm:{fringe:'curtain', curls:true},
  ccurl:{fringe:'sweep', fall:.9, curlEnd:true}, bob:{fringe:'sweep', fall:.9}, long:{fringe:'sweep', fall:1.8}, pony:{fringe:'sweep', tail:true}, wave:{fringe:'curtain', fall:1.2, curls:true},
  bun:{fringe:'up', bun:[-.45,-1.2,.4]}, twin:{fringe:'straight', twin:true}, braid:{fringe:'sweep', braid:true}, twinbun:{fringe:'up', bun:[-.55,-1.05,.34]}, shortbob:{fringe:'straight', fall:.7},
  sidepony:{fringe:'sweep', tail:true, low:true}, halfup:{fringe:'curtain', fall:1.5, bun:[-.35,-1.2,.28]}, bangslong:{fringe:'straight', fall:1.8}, pixie:{fringe:'sweep', short:true}, medium:{fringe:'curtain', fall:1.2},
};
function sideHair(d, x, y, R, hc, id, layer){
  const sp = SIDE_SPEC[id] || SIDE_SPEC.short, u = v => v*R, c = d.ctx;
  const L = (x0,y0,x1,y1,w,b=0,round=true)=>lock(d, hc, x+u(x0), y+u(y0), x+u(x1), y+u(y1), u(w), u(b), round);
  if (layer==='back'){
    // 뒤로 늘어지는 머리: 뒷통수 아래에서 등 뒤로
    if (sp.fall){ d.shape(k=>{ k.beginPath(); k.roundRect(x-u(1.32), y-u(.35), u(.95), u(.35+sp.fall), u(.4)); }, hc, [x-u(.85), y+u(sp.fall/2), u(.9)]);
      if (sp.curlEnd){ d.circle(x-u(.6), y+u(sp.fall-.2), u(.3), hc); d.circle(x-u(1.1), y+u(sp.fall-.1), u(.3), hc); }
      if (sp.curls){ for (let i=0;i<3;i++) d.circle(x-u(1.25)+u(i*.35), y+u(sp.fall-.25+(i%2)*.15), u(.27), hc); } }
    if (sp.tail){ const ty = sp.low ? .1 : -.55; L(-1.1, ty, -1.45, ty+1.5, .34, -.45); d.circle(x-u(1.1), y+u(ty), u(.3), hc); }
    if (sp.braid){ for (let i=0;i<5;i++) d.circle(x-u(1.15)+u(i%2?.07:-.07), y-u(.3)+u(i*.32), u(.22), hc); }
    if (sp.twin){ L(-1.15, -.2, -1.45, 1.0, .3, -.25); d.circle(x-u(1.15), y-u(.25), u(.26), hc); }
    if (sp.curls && !sp.fall){ for (let i=0;i<3;i++) d.circle(x-u(1.2)+u(i*.2), y-u(.1)+u(i*.3), u(.26), hc); }
    return;
  }
  // 덮개: 이마 끝 → 정수리 → 뒷통수 → 뒷목, 안쪽은 귀 뒤로
  const fy = sp.fringe==='up' ? -.72 : -.12, nape = sp.fall ? .3 : .55;
  d.shape(k=>{ k.beginPath(); k.moveTo(x+u(.98), y+u(fy));
    k.quadraticCurveTo(x+u(.95), y-u(1.18), x, y-u(1.22));
    k.quadraticCurveTo(x-u(1.32), y-u(1.18), x-u(1.28), y-u(.1));
    k.lineTo(x-u(1.22), y+u(nape));
    k.quadraticCurveTo(x-u(.95), y+u(nape+.12), x-u(.6), y+u(nape-.05));
    k.lineTo(x-u(.42), y-u(.15));
    k.quadraticCurveTo(x-u(.1), y-u(.55), x+u(.3), y+u(fy-.25));
    k.closePath(); }, hc, [x-u(.3), y-u(.5), u(1.15)]);
  // 앞머리
  const f = sp.fringe;
  if (f==='sweep' || f==='short'){ const e = f==='short' || sp.short ? -.3 : -.02; L(-.1,-1.1, .98, e, .42, .15); L(0,-1.1, .62, e-.18, .32, .05); }
  else if (f==='straight'){ d.shape(k=>{ k.beginPath(); k.roundRect(x+u(.1), y-u(1.0), u(.92), u(.98), [u(.1),u(.1),u(.3),u(.3)]); }, hc, [x+u(.55), y-u(.5), u(.6)], {seam:true}); L(.3,-.9,.95,-.02,.3,.05); }
  else if (f==='curtain'){ L(.2,-1.1, 1.0, -.08, .4, .25); L(.1,-1.1, .5, -.25, .28, .05); }
  else if (f==='comma'){ L(-.05,-1.12, .98, -.05, .44, .45); L(.05,-1.1, .55, -.3, .3, .1); }
  else if (f==='gile'){ L(-.1,-1.1, 1.05, .28, .46, .3); L(0,-1.1, .6, -.2, .3, .05); }
  else if (f==='thin'){ for (let i=0;i<3;i++) L(.1+i*.05,-1.05, .5+i*.24, -.02-(i%2)*.06, .2, .08); }
  else if (f==='up'){ L(.2,-.95, -.4,-1.3, .3, .05); L(.6,-.8, 0,-1.3, .3, .05); }
  if (sp.bun) d.circle(x+u(sp.bun[0]), y+u(sp.bun[1]), u(sp.bun[2]), hc);
  const g=d.ctx; g.save(); g.globalAlpha=.14; g.fillStyle='#fff6ee'; g.beginPath(); g.ellipse(x-u(.3), y-u(.95), u(.6), u(.2), -.1, 0, 7); g.fill(); g.restore();
}
function hair(d, x, y, L, side, R, layer, up=false){
  const st = HAIR[L.hair] || HAIR.short, c = d.ctx;
  if (up){ // 뒷모습: 뒷통수 전체가 머리카락
    const K = hairKit(d, x, y, R, L.hairColor);
    d.shape(k=>{ k.beginPath(); k.ellipse(x, y-R*.12, R*1.26, R*1.12, 0, 0, 7); }, L.hairColor, [x, y-R*.2, R*1.2]);
    st.back(K); K.gloss(0, -.95, .75, .22); return;
  }
  if (side){ sideHair(d, x, y, R, L.hairColor, L.hair, layer); return; }
  const K = hairKit(d, x, y, R, L.hairColor);
  (layer==='back' ? st.back : st.front)(K);
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
const legs = (d, g, col) => { if (!g.side){ d.rr(-5.6, -6.5-g.a, 4.4, 6.5, 2, col); d.rr(1.2, -6.5-g.b, 4.4, 6.5, 2, col); } else { d.rr(-2.6-g.step*1.5, -6.5, 4.4, 6.5, 2, col); } };
const shoe = (d, g, col, o={}) => { const [l,r] = g.side ? [-2.5-g.step*1.8, 1.5+g.step*1.8] : [-5, 5]; d.ell(l, -1.5-(g.side?0:g.a), 4.4, 2.8, col, o); d.ell(r, -1.5-(g.side?0:g.b), 4.4, 2.8, col, o); };
const dress = (d, g, col, trim) => { torso(d, g, col); skirt(d, g, col, 1.3, .5); if (trim && !g.up) d.rr(-g.bw*.42, BY+BH*.5, g.bw*.84, 1.6, .8, trim, {flat:true, noShadow:true}); };

export const TOPS = {
  t01:{name:'기본 티셔츠', price:0,   draw:(d,g)=>{ torso(d,g,'#fffaf2'); bareArms(d,g); }},
  t02:{name:'줄무늬 티',   price:400, draw:(d,g)=>{ torso(d,g,'#fffaf2'); stripe(d,g,'#8fb9e8',3); bareArms(d,g); }},
  t03:{name:'니트 스웨터', price:700, draw:(d,g)=>{ torso(d,g,'#bfe6d5'); if(!g.up) d.line(k=>{ for (let i=0;i<3;i++){ k.moveTo(-5+i*5, BY+3); k.lineTo(-5+i*5, BY+9); } }, '#93c9b3', 1.2, .7); sleeves(d,g,'#bfe6d5'); hands(d,g); }},
  t04:{name:'후드티',      price:660, draw:(d,g)=>{ torso(d,g,'#a9c7ef'); if(!g.up) d.ell(0, BY+1, 6.5, 3.2, '#8fb3e2'); else d.ell(0, BY+1.5, 7, 4, '#8fb3e2'); if(!g.up) d.line(k=>{ k.moveTo(-2.5, BY+3); k.lineTo(-3, BY+8); k.moveTo(2.5, BY+3); k.lineTo(3, BY+8); }, '#fffaf2', 1, .9); sleeves(d,g,'#a9c7ef'); hands(d,g); }},
  t05:{name:'카라 셔츠',   price:570, draw:(d,g)=>{ torso(d,g,'#fffaf2'); collar(d,g,'#e9eef7'); if(!g.up) d.line(k=>{ k.moveTo(0, BY+4); k.lineTo(0, BY+BH*.6); }, '#cfd6e3', 1, .9); if(!g.up){ d.dot(0, BY+6, .6, '#cfd6e3'); d.dot(0, BY+8.5, .6, '#cfd6e3'); } sleeves(d,g,'#fffaf2'); hands(d,g); }},
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
  sh01:{name:'운동화',     price:0,   draw:(d,g)=>{ shoe(d,g,'#fffaf4'); }},
  sh02:{name:'메리제인',   price:480, draw:(d,g)=>{ shoe(d,g,'#5a3a44'); if(!g.side){ d.line(k=>{ k.moveTo(-8,-2.6); k.lineTo(-2,-2.6); k.moveTo(2,-2.6); k.lineTo(8,-2.6); }, '#5a3a44', 1, .9); } }},
  sh03:{name:'노랑 장화',  price:570, draw:(d,g)=>{ shoe(d,g,'#ffd45a'); if(!g.side){ d.rr(-7,-6.5-g.a,4.2,5,1.5,'#ffd45a'); d.rr(2.8,-6.5-g.b,4.2,5,1.5,'#ffd45a'); } else { d.rr(-4.5-g.step*1.8,-6.5,4.2,5,1.5,'#ffd45a'); } }},
  sh04:{name:'샌들',       price:400, draw:(d,g)=>{ shoe(d,g,g.sk,{noShadow:true}); shoe(d,g,'#d9a06a',{flat:true,noShadow:true}); if(!g.side) d.line(k=>{ k.moveTo(-7.5,-2.4); k.lineTo(-2.5,-2.4); k.moveTo(2.5,-2.4); k.lineTo(7.5,-2.4); }, '#c9895a', 1.2, .9); }},
  sh05:{name:'갈색 부츠',  price:700, draw:(d,g)=>{ shoe(d,g,'#8a5a3c'); if(!g.side){ d.rr(-7,-6-g.a,4.2,4.5,1.5,'#8a5a3c'); d.rr(2.8,-6-g.b,4.2,4.5,1.5,'#8a5a3c'); } else d.rr(-4.5-g.step*1.8,-6,4.2,4.5,1.5,'#8a5a3c'); }},
  sh06:{name:'슬리퍼',     price:310, draw:(d,g)=>{ shoe(d,g,'#a9c7ef'); if(!g.side){ d.rr(-7.5,-3.2,5,1.6,.8,'#8fb3e2',{flat:true,noShadow:true}); d.rr(2.5,-3.2,5,1.6,.8,'#8fb3e2',{flat:true,noShadow:true}); } }},
  sh07:{name:'토끼 슬리퍼', price:660, draw:(d,g)=>{ shoe(d,g,'#fff0f5'); if(!g.side) for (const x of [-5,5]){ d.dot(x-1.3,-2.2,.5,'#5a3a44'); d.dot(x+1.3,-2.2,.5,'#5a3a44'); d.ell(x-1.5,-5,1,2,'#fff0f5',{noShadow:true}); d.ell(x+1.5,-5,1,2,'#fff0f5',{noShadow:true}); } }},
  sh08:{name:'빨간 하이탑', price:620, draw:(d,g)=>{ shoe(d,g,'#e85d5d'); if(!g.side){ d.rr(-7,-5-g.a,4.2,3.5,1.5,'#e85d5d'); d.rr(2.8,-5-g.b,4.2,3.5,1.5,'#e85d5d'); d.rr(-8.6,-1.6-g.a,7.4,1.4,.7,'#fffaf4',{flat:true,noShadow:true}); d.rr(1.2,-1.6-g.b,7.4,1.4,.7,'#fffaf4',{flat:true,noShadow:true}); } }},
  sh09:{name:'로퍼',       price:570, draw:(d,g)=>{ shoe(d,g,'#3f3a4a'); if(!g.side){ d.rr(-6.2,-3,2.4,1,.5,'#c9a85a',{flat:true,noShadow:true}); d.rr(3.8,-3,2.4,1,.5,'#c9a85a',{flat:true,noShadow:true}); } }},
  sh10:{name:'털 부츠',    price:750, draw:(d,g)=>{ shoe(d,g,'#d9b38c'); if(!g.side){ d.rr(-7.2,-6.5-g.a,4.6,5,1.8,'#d9b38c'); d.rr(2.6,-6.5-g.b,4.6,5,1.8,'#d9b38c'); d.rr(-7.4,-6.8-g.a,5,1.8,.9,'#fff6ea',{flat:true,noShadow:true}); d.rr(2.4,-6.8-g.b,5,1.8,.9,'#fff6ea',{flat:true,noShadow:true}); } }},
};
export const CATS = [['top','상의',TOPS],['bottom','하의',BOTTOMS],['set','세트',SETS],['hat','모자',HATS],['acc','악세사리',ACCS],['shoes','신발',SHOES]];
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
  else if (!(L.hair==='long' || L.hair==='bangslong' || L.hair==='halfup' || L.hair==='longm' || L.hair==='hime')) {}
  // 신발 → 하의 → 상의 (세트면 한 번에)
  shoes.draw(d, g);
  if (set) set.draw(d, g); else { bottom.draw(d, g); top.draw(d, g); }
  if (up && (L.hair==='long' || L.hair==='bangslong' || L.hair==='halfup' || L.hair==='longm')) { const K = hairKit(d, 0, HY, R, L.hairColor); (HAIR[L.hair]||HAIR.long).back(K); }
  // 머리
  if (!side) { d.ell(-R*1.2, HY+R*.1, 2.4, 3, L.skin); d.ell(R*1.2, HY+R*.1, 2.4, 3, L.skin); }
  else d.ell(-R*.5, HY+R*.12, 2.6, 3.2, L.skin); // 옆모습: 귀는 머리 가운데 뒤쪽
  headShape(d, 0, HY, R, L.skin);
  if (!up) face(d, side ? R*.22 : 0, HY+R*.28, L, side, expr);
  if (up) hair(d, 0, HY, L, side, R, 'back', true);
  else hair(d, 0, HY, L, side, R, 'front');
  acc.draw(d, g); hat.draw(d, g);
  c.restore();
}
export const FIG_BOX = {w:72, h:92, ox:36, oy:82}; // 스프라이트 캔버스 크기와 발 위치
