// 검 11 종: 점토 모양 · 들고 있을 때 아우라 · 휘두르기 연출 (비싼 검일수록 화려하게)
// 렉 줄이기: 손에 든 검 그림은 index.html 의 sprite() 저장 그림으로 한 번만 그리고, 아우라와 휘두르기만 매 프레임 그려요
// 검 모양 10 종 · 캐릭터와 같은 점토(클레이) 칠하기: 테두리 없이 빛(왼쪽 위) → 그늘, 아래 그림자, 안쪽 어둠
// 날밑(0,0) 에서 +x 로 칼날, -x 로 손잡이 · 칼을 돌려 그려도 빛은 늘 화면 왼쪽 위에서 와요
const SWORD_LEN = { w1:23, w2:21, w3:27, w4:30, w5:28, w6:28, w7:28, w8:29, w9:30, w10:35, w11:34 };
const SWORD_GRIP = { w1:8, w2:7, w3:8, w4:8, w5:8, w6:9, w7:8, w8:8, w9:8, w10:11, w11:10 };
const CLAY = (() => {
  let LX = -.45, LY = -.9, SX = .5, SY = 1; // 칼 좌표에서 빛 · 그림자 방향
  const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v)*t).toString(16).padStart(2, '0')).join(''); };
  function setLight(ang, mirror){ // 화면 빛 (-.45,-.9) 을 칼 좌표로
    const rot = (x, y) => { const c = Math.cos(-ang), s = Math.sin(-ang); let rx = x*c - y*s, ry = x*s + y*c; return [rx, ry]; };
    let [lx, ly] = rot(mirror ? .45 : -.45, -.9), [sx, sy] = rot(mirror ? -.5 : .5, 1); LX = lx; LY = ly; SX = sx; SY = sy; }
  function paint(c, path, col, [cx, cy, r], o = {}){
    c.save();
    if (!o.noShadow){ c.save(); c.translate(SX*Math.max(.6, r*.12), SY*Math.max(.6, r*.12)); c.globalAlpha *= .16; path(c); c.fillStyle = '#4a2a3a'; c.fill(); c.restore(); }
    const g = c.createLinearGradient(cx + LX*r, cy + LY*r, cx - LX*r, cy - LY*r);
    const k = o.shine ?? .3; g.addColorStop(0, mix(col, '#fffaf4', k)); g.addColorStop(.5, col); g.addColorStop(1, mix(col, '#3a2030', o.dark ?? .28));
    path(c); c.fillStyle = g; c.fill();
    if (!o.flat){ path(c); c.clip(); const ao = c.createRadialGradient(cx - LX*r*.2, cy - LY*r*.2, r*.3, cx, cy, r*1.3); ao.addColorStop(0, 'rgba(60,30,50,0)'); ao.addColorStop(1, 'rgba(60,30,50,.18)'); c.fillStyle = ao; c.fillRect(cx - r*1.5, cy - r*1.5, r*3, r*3); }
    c.restore();
    if (o.seam){ c.save(); c.globalAlpha *= .22; c.lineWidth = .5; c.strokeStyle = mix(col, '#2a1420', .4); path(c); c.stroke(); c.restore(); }
  }
  // 하이라이트 점 (점토 윤기)
  const gloss = (c, x, y, rx, ry, a = .55) => { c.save(); c.globalAlpha *= a; c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); c.restore(); };
  const P = pts => c => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
  const RR = (x, y, w, h, r) => c => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const CI = (x, y, r) => c => { c.beginPath(); c.arc(x, y, r, 0, 7); };
  const EL = (x, y, rx, ry, a = 0) => c => { c.beginPath(); c.ellipse(x, y, rx, ry, a, 0, 7); };
  // 둥글게 다듬은 칼날: 뿌리 폭 w0 → 끝 쪽 폭 w1 → 끝은 둥근 뾰족
  const bladePath = (L, w0, w1, tip = 5, curve = 0) => c => { c.beginPath(); c.moveTo(0, -w0); c.quadraticCurveTo(L*.5, -w1 - .3 + curve, L - tip, -w1 + curve); c.quadraticCurveTo(L - 1, -w1*.6 + curve*1.4, L, curve*1.6); c.quadraticCurveTo(L - 1, w1*.6 + curve*1.4, L - tip, w1 + curve); c.quadraticCurveTo(L*.5, w1 + .3 + curve*.4, 0, w0); c.quadraticCurveTo(-.8, 0, 0, -w0); c.closePath(); };
  return { setLight, paint, gloss, P, RR, CI, EL, bladePath, mix };
})();
const SWORD_SHAPES = (() => {
  const { paint, gloss, RR, CI, EL, bladePath, P } = CLAY;
  const grip = (c, len, w, col, band) => { paint(c, RR(-len, -w/2, len, w, w/2), col, [-len/2, 0, len/2]); if (band){ c.save(); c.globalAlpha *= .35; c.fillStyle = band; for (let x = -len + 1.6; x < -1; x += 2.2){ c.beginPath(); c.roundRect(x, -w/2, .9, w, .45); c.fill(); } c.restore(); } };
  const knob = (c, x, r, col, o) => { paint(c, CI(x, 0, r), col, [x, 0, r], o); gloss(c, x - r*.3, -r*.35, r*.32, r*.25); };
  const bar = (c, w, h, col) => { paint(c, RR(-w/2, -h/2, w, h, Math.min(w, h)/2), col, [0, 0, h/2]); };
  const blade = (c, L, w0, w1, col, o = {}) => { paint(c, bladePath(L, w0, w1, o.tip ?? 5, o.curve ?? 0), col, [L/2, 0, L/2], { seam:true, shine:.38, ...o }); gloss(c, L*.42, -w1*.45 + (o.curve ?? 0)*.5, L*.28, .45, .5); };
  return {
    w1(c, L){ grip(c, 8, 2.8, '#8a6446', '#5a3a26'); knob(c, -8.6, 1.6, '#a87a52'); blade(c, L, 2.1, 1.9, '#d6ad7c', { tip:3.5 }); bar(c, 2.2, 7, '#a77850'); },
    w2(c, L){ grip(c, 7, 2.7, '#6a4030', '#3a2018'); knob(c, -7.7, 1.9, '#c07a44'); paint(c, P([[0, -1.7], [L*.4, -2.4], [L*.72, -2.9], [L, 0], [L*.72, 2.9], [L*.4, 2.4], [0, 1.7]]), '#d98a52', [L/2, 0, L/2], { seam:true, shine:.4 }); gloss(c, L*.45, -1.2, L*.25, .5); bar(c, 2.4, 7.4, '#b46a3a'); },
    w3(c, L){ grip(c, 8, 2.7, '#5a5260', '#3a3440'); knob(c, -8.9, 2, '#a8b0bc'); blade(c, L, 2.1, 1.8, '#c4ccd8'); c.save(); c.globalAlpha *= .3; c.fillStyle = '#6a7484'; c.beginPath(); c.roundRect(1.5, -.35, L*.66, .7, .35); c.fill(); c.restore(); bar(c, 2.4, 10.5, '#8e98a6'); },
    w4(c, L){ grip(c, 8, 2.3, '#e4e6ee', '#a8aebc'); knob(c, -8.6, 1.8, '#e8ecf4'); blade(c, L, 1.25, .8, '#e2e8f2', { tip:3 });
      c.save(); c.lineCap = 'round'; c.strokeStyle = '#d4d8e4'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(.4, -1); c.bezierCurveTo(1.4, -6.4, -6.6, -6.6, -8, -1.4); c.stroke(); c.globalAlpha *= .5; c.strokeStyle = '#ffffff'; c.lineWidth = .5; c.beginPath(); c.moveTo(-.2, -2.4); c.bezierCurveTo(.2, -5.6, -5.6, -5.8, -7, -2.4); c.stroke(); c.restore(); paint(c, EL(.6, 0, 1.6, 3.4), '#d4d8e4', [.6, 0, 3.4]); },
    w5(c, L){ grip(c, 8, 2.8, '#7a3040', '#4a1a26'); knob(c, -9, 2.2, '#e6be52'); paint(c, CI(-9, 0, 1.1), '#3a7ae0', [-9, 0, 1.1], { noShadow:true }); blade(c, L, 2.3, 2, '#d4dae4'); c.save(); c.globalAlpha *= .8; c.fillStyle = '#e8c252'; c.beginPath(); c.roundRect(1, -.5, L*.42, 1, .5); c.fill(); c.restore();
      for (const s of [-1, 1]) paint(c, cc => { cc.beginPath(); cc.moveTo(1.2, 0); cc.quadraticCurveTo(2.4, 4.4*s, -.8, 7.4*s); cc.quadraticCurveTo(-2.4, 6.4*s, -1.4, 5*s); cc.quadraticCurveTo(-.2, 3*s, -1.2, 0); cc.closePath(); }, '#e6be52', [0, 3.5*s, 3.6]); knob(c, 0, 1.4, '#3a7ae0'); },
    w6(c, L){ grip(c, 9, 2.7, '#3a2428', '#b02a3a'); knob(c, -9.6, 1.7, '#4a3434'); paint(c, bladePath(L, 1.7, 1.8, 6, -2.4), '#c8ced8', [L/2, -1, L/2], { seam:true, shine:.38 });
      c.save(); c.globalAlpha *= .75; c.strokeStyle = '#e8364f'; c.lineWidth = .8; c.lineCap = 'round'; c.beginPath(); c.moveTo(1.5, .6); c.quadraticCurveTo(L*.55, .2, L - 3, -2.6); c.stroke(); c.restore(); gloss(c, L*.4, -1.6, L*.22, .4, .5);
      paint(c, EL(.4, 0, 1.6, 4.2), '#3a2a2e', [.4, 0, 4.2]); knob(c, .4, 1.3, '#e81c38'); },
    w7(c, L){ grip(c, 8, 2.5, '#eef4fa', '#8aacc8'); knob(c, -8.6, 1.8, '#c8e8ff'); c.save(); c.shadowColor = 'rgba(170,225,255,.9)'; c.shadowBlur = 2.5; blade(c, L, 1.9, 2, '#cfe8fa', { tip:4, shine:.5 }); c.restore();
      for (const s of [-1, 1]) paint(c, EL(0, 3.4*s, 1.4, 3, .5*s), '#d8eefa', [0, 3.4*s, 3]); knob(c, .2, 1.1, '#9ad4ff'); },
    w8(c, L){ grip(c, 8, 2.6, '#2e2850', '#8a7ac8'); knob(c, -8.8, 1.9, '#cfc6f4'); blade(c, L, 2, 1.8, '#5a4aa8', { shine:.35, dark:.35 });
      c.save(); c.fillStyle = '#ffffff'; [[.15, .35, .55], [.32, -.5, .4], [.48, .45, .6], [.64, -.3, .45], [.8, .3, .4]].forEach(([f, y, r]) => { c.globalAlpha = .9; c.beginPath(); c.arc(L*f, y, r, 0, 7); c.fill(); }); c.restore();
      c.save(); c.lineCap = 'round'; c.strokeStyle = '#d8d0f4'; c.lineWidth = 1.6; c.beginPath(); c.arc(-2.4, 0, 4.8, -1.15, 1.15); c.stroke(); c.restore(); },
    w9(c, L){ grip(c, 8, 2.8, '#f4ecd8', '#c8a050'); paint(c, cc => { cc.beginPath(); for (let i = 0; i < 10; i++){ const a = i*Math.PI/5, r = i % 2 ? 1.3 : 2.9; cc.lineTo(-9.4 + Math.cos(a)*r, Math.sin(a)*r); } cc.closePath(); }, '#ffd86a', [-9.4, 0, 2.9]);
      c.save(); c.shadowColor = 'rgba(255,230,150,.95)'; c.shadowBlur = 3; blade(c, L, 2.4, 2.1, '#fff2cc', { shine:.5 }); c.restore(); c.save(); c.globalAlpha *= .7; c.fillStyle = '#e8b840'; c.beginPath(); c.roundRect(1, -.45, L*.55, .9, .45); c.fill(); c.restore();
      for (const s of [-1, 1]) paint(c, EL(-.6, 4.4*s, 1.9, 3.6, -.45*s), '#f6e2a0', [-.6, 4.4*s, 3.6]); knob(c, .1, 1.2, '#7ac0ff'); },
    w10(c, L){ grip(c, 11, 3.3, '#2a1a30', '#7a3aa0'); knob(c, -11.8, 2.5, '#4a2a5a'); paint(c, bladePath(L, 3.4, 3.2, 7), '#3a2a48', [L/2, 0, L/2], { seam:true, shine:.3, dark:.4 });
      c.save(); c.shadowColor = '#c060ff'; c.shadowBlur = 3; c.strokeStyle = '#d090ff'; c.lineWidth = .8; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(3, 0); c.lineTo(L*.32, -1.2); c.lineTo(L*.48, 1); c.lineTo(L*.66, -.8); c.lineTo(L*.8, .4); c.stroke(); c.restore(); gloss(c, L*.4, -2, L*.25, .5, .3);
      for (const s of [-1, 1]) paint(c, cc => { cc.beginPath(); cc.moveTo(1.4, -.6*s); cc.quadraticCurveTo(3, 5*s, .2, 8.6*s); cc.quadraticCurveTo(-1.6, 6*s, -1.4, .6*s); cc.closePath(); }, '#4a2a5a', [0, 4*s, 4.4]); knob(c, -.1, 1.5, '#c060ff'); },
    // 불꽃 고래 검: 붉은 칼날에 용암 금 · 날밑은 고래 꼬리 · 손잡이 끝에 불씨
    w11(c, L){ grip(c, 10, 3, '#3a1a14', '#ff6a3a'); knob(c, -10.8, 2.3, '#ffb347'); paint(c, CI(-10.8, 0, 1), '#fff0b0', [-10.8, 0, 1], { noShadow:true });
      c.save(); c.shadowColor = 'rgba(255,120,40,.9)'; c.shadowBlur = 2.5; paint(c, bladePath(L, 3, 2.7, 7, -.8), '#c8321e', [L/2, 0, L/2], { seam:true, shine:.42, dark:.38 }); c.restore();
      c.save(); c.strokeStyle = '#ffd23f'; c.lineWidth = .9; c.lineCap = 'round'; c.lineJoin = 'round'; c.globalAlpha *= .9; c.beginPath(); c.moveTo(2, .4); c.lineTo(L*.25, -.9); c.lineTo(L*.4, .5); c.lineTo(L*.58, -1); c.lineTo(L*.74, .2); c.lineTo(L*.86, -.9); c.stroke(); c.restore(); gloss(c, L*.42, -1.8, L*.26, .45, .45);
      for (const sd of [-1, 1]) paint(c, cc => { cc.beginPath(); cc.moveTo(1, 0); cc.quadraticCurveTo(1.6, 3.2*sd, -.6, 4.6*sd); cc.quadraticCurveTo(2.6, 6.2*sd, 4.6, 8.2*sd); cc.quadraticCurveTo(-.8, 8.8*sd, -2.6, 5.4*sd); cc.quadraticCurveTo(-2.2, 2.4*sd, -1.4, 0); cc.closePath(); }, '#5a2a3a', [0, 4.5*sd, 4.6]);
      knob(c, 0, 1.5, '#ff7a2f'); },
  };
})();
function drawHeldSword(c, k, hx, hy, ang, s = 1, mirror = false, aura = true){ const L = SWORD_LEN[k] || 26, G = SWORD_GRIP[k] || 8; CLAY.setLight(ang, mirror); c.save(); c.translate(hx, hy); c.rotate(ang); c.scale(s, s); c.translate(G*.5, 0); (SWORD_SHAPES[k] || SWORD_SHAPES.w1)(c, L); c.restore(); if (aura && typeof drawHeldSwordAura === 'function') drawHeldSwordAura(c, k, hx, hy, ang, s); }

// 들고 있을 때 아우라 (칼 좌표: 날밑 0 → 칼끝 L) · t = 초
const SWORD_AURA = (() => {
  const h = (i, s = 1) => { const x = Math.sin(i*127.1 + s*311.7)*43758.5453; return x - Math.floor(x); };
  const B = 1.8; const dot = (c, x, y, r, col, a) => { r *= B; c.globalAlpha = Math.min(1, a*1.15); c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  const star4 = (c, x, y, r, col, a) => { r *= B; c.globalAlpha = Math.min(1, a*1.15); c.fillStyle = col; c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r*.28, y); c.lineTo(x, y + r); c.lineTo(x - r*.28, y); c.closePath(); c.moveTo(x - r, y); c.lineTo(x, y + r*.28); c.lineTo(x + r, y); c.lineTo(x, y - r*.28); c.closePath(); c.fill(); };
  const glow = (c, L, w, col, a) => { w *= 1.7; c.globalAlpha = Math.min(1, a*1.35); const q = c.createLinearGradient(0, -w, 0, w); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(.5, col); q.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = q; c.beginPath(); c.roundRect(-1, -w, L + 3, w*2, w); c.fill(); };
  const sheen = (c, L, t, per, col, w = 4) => { const p = (t/per) % 1; if (p > .45) return; const x = p/.45*(L + 8) - 4; c.globalAlpha = Math.sin(p/.45*Math.PI)*.9; const q = c.createLinearGradient(x - 4, 0, x + 4, 0); q.addColorStop(0, 'rgba(255,255,255,0)'); q.addColorStop(.5, col); q.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = q; c.fillRect(x - 4, -w, 8, w*2); };
  // 위로 오르는 입자: 칼 좌표에서 '위' 는 화면 위가 아니라서, 화면 기준으로 올리려면 up 벡터를 받아요
  const rise = (c, L, t, n, per, up, fn) => { for (let i = 0; i < n; i++){ const p = (t/per + h(i)) % 1, x = h(i, 2)*L, y = (h(i, 3) - .5)*4; fn(x + up[0]*p*24, y + up[1]*p*24, p, i); } };
  return {
    w1(c, L, t, up){ sheen(c, L, t, 3.2, 'rgba(255,240,210,.5)', 2); },
    w2(c, L, t, up){ sheen(c, L, t, 2.4, 'rgba(255,200,140,.8)'); rise(c, L, t, 2, 1.8, up, (x, y, p) => dot(c, x, y, .6, '#ffb070', (1 - p)*.7)); },
    w3(c, L, t, up){ sheen(c, L, t, 1.8, 'rgba(255,255,255,.95)'); const p = (t/1.8) % 1; if (p > .42 && p < .6) star4(c, L + 1, 0, 3.5*Math.sin((p - .42)/.18*Math.PI), '#ffffff', .95); },
    w4(c, L, t, up){ sheen(c, L, t, 2, 'rgba(255,255,255,.9)', 2); for (let i = 0; i < 3; i++){ const p = (t*1.3 + i/3) % 1; star4(c, L*(.35 + i*.25), (h(i) - .5)*5, 2.6*Math.sin(p*Math.PI), '#ffffff', .9); } },
    w5(c, L, t, up){ glow(c, L, 4.5, 'rgba(255,220,100,.55)', .5 + .3*Math.sin(t*3)); sheen(c, L, t, 1.6, 'rgba(255,250,210,.95)'); rise(c, L, t, 5, 1.4, up, (x, y, p, i) => star4(c, x, y, 1.6*(1 - p) + .4, i % 2 ? '#fff3b0' : '#ffd23f', (1 - p)*.9)); },
    w6(c, L, t, up){ glow(c, L, 4.5, 'rgba(255,60,60,.6)', .45 + .25*Math.sin(t*9) + .1*Math.sin(t*23)); for (let i = 0; i < 6; i++){ const p = (t*1.6 + h(i)) % 1, x = h(i, 4)*L*.9 + 2; c.globalAlpha = (1 - p)*.85; c.fillStyle = i % 2 ? '#ffb347' : '#ff4f2f'; c.beginPath(); const bx = x + up[0]*p*10, by = up[1]*p*10; c.ellipse(bx, by, 1.2*(1 - p) + .4, 2.4*(1 - p) + .5, Math.atan2(up[1], up[0]) - Math.PI/2, 0, 7); c.fill(); }
      rise(c, L, t, 3, 1.2, up, (x, y, p) => dot(c, x, y, .7, '#ffd27a', (1 - p))); },
    w7(c, L, t, up){ glow(c, L, 5, 'rgba(170,225,255,.6)', .5 + .2*Math.sin(t*2.2)); sheen(c, L, t, 2.2, 'rgba(255,255,255,.9)'); rise(c, L, t, 5, 2.2, [-up[0], -up[1]], (x, y, p, i) => star4(c, x, y, 1.4, '#e8f8ff', Math.sin(p*Math.PI)*.9)); },
    w8(c, L, t, up){ glow(c, L, 4.5, 'rgba(160,140,255,.5)', .45 + .2*Math.sin(t*2.6)); for (let i = 0; i < 4; i++){ const a = t*2.2 + i*Math.PI/2, x = L*.5 + Math.cos(a)*L*.5, y = Math.sin(a)*5; star4(c, x, y, 1.8 + .8*Math.sin(t*6 + i), i % 2 ? '#ffffff' : '#d9c9ff', .55 + .45*(Math.sin(a) > 0 ? 1 : .4)); } },
    w9(c, L, t, up){ const pu = .5 + .35*Math.sin(t*3.2); glow(c, L, 6, 'rgba(255,230,140,.7)', pu); c.globalAlpha = pu*.5; c.strokeStyle = '#fff3b0'; c.lineWidth = .7; for (let i = 0; i < 6; i++){ const a = i*Math.PI/3 + t*.8; c.beginPath(); c.moveTo(L + Math.cos(a)*4, Math.sin(a)*4); c.lineTo(L + Math.cos(a)*(7 + 2*Math.sin(t*5 + i)), Math.sin(a)*(7 + 2*Math.sin(t*5 + i))); c.stroke(); }
      rise(c, L, t, 6, 1.6, up, (x, y, p, i) => star4(c, x, y, 1.8*(1 - p) + .5, i % 2 ? '#ffffff' : '#ffe07a', (1 - p))); },
    w10(c, L, t, up){ glow(c, L, 6, 'rgba(170,70,240,.6)', .45 + .3*Math.sin(t*2)); for (let i = 0; i < 7; i++){ const p = (t*.7 + h(i)) % 1, x = h(i, 5)*L, r = 1.5 + p*4; dot(c, x + up[0]*p*16 + Math.sin(t*3 + i)*1.5, up[1]*p*16, r, i % 2 ? '#2a1038' : '#5a2a80', (1 - p)*.45); }
      for (let i = 0; i < 3; i++){ const a = t*1.5 + i*2.1; dot(c, L*.5 + Math.cos(a)*L*.45, Math.sin(a)*6, .9, '#d890ff', .8); } },
    w11(c, L, t, up, lv = 0){ glow(c, L, 6 + lv*.8, 'rgba(255,110,40,.65)', .5 + lv*.06 + .25*Math.sin(t*7) + .1*Math.sin(t*19)); // 강화 단계(+1 ~ +5)마다 불꽃이 커져요
      if (lv >= 3){ for (let i = 0; i < lv - 1; i++){ const a = t*2.4 + i*Math.PI*2/(lv - 1), x = L*.5 + Math.cos(a)*L*.55, y = Math.sin(a)*7; dot(c, x, y, 1.2, i % 2 ? '#ffe07a' : '#ff7a2f', .55 + .45*(Math.sin(a) > 0 ? 1 : .3)); } }
      if (lv >= 5) glow(c, L, 10, 'rgba(255,220,120,.35)', .4 + .2*Math.sin(t*3));
      for (let i = 0; i < 9 + lv*3; i++){ const p = (t*1.4 + h(i)) % 1, x = h(i, 6)*L*.95 + 1, ang = Math.atan2(up[1], up[0]); c.globalAlpha = (1 - p)*.9; c.fillStyle = i % 3 === 0 ? '#ffe07a' : i % 2 ? '#ff9a3a' : '#ff3b1f'; c.beginPath(); c.ellipse(x + up[0]*p*14 + Math.sin(t*6 + i)*1.2, up[1]*p*14, 2.6*(1 - p) + .5, 1.3*(1 - p) + .4, ang, 0, 7); c.fill(); }
      rise(c, L, t, 4 + lv, 1.1, up, (x, y, p) => dot(c, x, y, .7, '#ffe8a0', (1 - p)));
      const sp = (t/2.6) % 1; if (sp < .35){ const q = sp/.35; for (let i = 0; i < 5; i++){ const a = (i - 2)*.35; dot(c, L + up[0]*q*14 + Math.cos(a)*q*5, up[1]*q*14 + Math.sin(a)*q*5, .9*(1 - q) + .3, '#ffd27a', 1 - q); } } },
  };
})();
function drawHeldSwordAura(c, k, hx, hy, ang, s = 1, t = performance.now()/1000, lv = 0){ const L = SWORD_LEN[k] || 26, G = SWORD_GRIP[k] || 9, f = SWORD_AURA[k]; if (!f) return;
  // 화면 '위' 방향을 칼 좌표로
  const up = [Math.cos(-Math.PI/2 - ang), Math.sin(-Math.PI/2 - ang)];
  c.save(); c.translate(hx, hy); c.rotate(ang); c.scale(s, s); c.translate(G*.5, 0); f(c, L, t, up, lv|0); c.restore(); }

// 검마다 다른 휘두르기 연출 · 비싼 검일수록 화려하게 (단계 1 → 11)
// 상태 없이 "휘두른 뒤 지난 시간(ms)" 과 seed 만으로 그려요
const SWFX = (() => {
  const hash = (s, i) => { let h = (s*374761393 + i*668265263) | 0; h = (h ^ (h >>> 13))*1274126177; return ((h ^ (h >>> 16)) >>> 0)/4294967295; };
  const ease = a => 1 - Math.pow(1 - a, 3);
  const A = (c, a) => { c.globalAlpha = Math.max(0, Math.min(1, a)); };
  function arc(c, r, from, to, w, col, alpha){ c.save(); c.globalAlpha *= Math.max(0, alpha); c.lineCap = 'round'; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(0, 0, r, from, to); c.stroke(); c.restore(); }
  // 초승달: 끝으로 갈수록 가늘어지는 칼바람
  function crescent(c, r, from, to, thick, col, alpha){ if (to - from < .02) return; c.save(); c.globalAlpha *= Math.max(0, alpha); c.fillStyle = col; c.beginPath(); const n = 24; for (let i = 0; i <= n; i++){ const t = i/n, a = from + (to - from)*t, w = thick*Math.sin(Math.PI*Math.min(1, t*1.15))*.5 + .4; c.lineTo(Math.cos(a)*(r + w), Math.sin(a)*(r + w)); } for (let i = n; i >= 0; i--){ const t = i/n, a = from + (to - from)*t, w = thick*Math.sin(Math.PI*Math.min(1, t*1.15))*.5 + .4; c.lineTo(Math.cos(a)*(r - w), Math.sin(a)*(r - w)); } c.closePath(); c.fill(); c.restore(); }
  function glowDisc(c, x, y, r, col, a){ c.save(); A(c, a); const q = c.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, col); q.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = q; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore(); }
  let CUR = 'w1';
  function blade(c, ang){ if (typeof CLAY !== 'undefined') CLAY.setLight(ang, false); c.save(); c.rotate(ang); c.translate(12, 0); c.scale(.85, .85); SWORD_SHAPES[CUR](c, SWORD_LEN[CUR]); c.restore(); }
  function star(c, x, y, r, col, rot = 0){ c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath(); for (let i = 0; i < 10; i++){ const a = i*Math.PI/5 - Math.PI/2, rr = i % 2 ? r*.45 : r; c.lineTo(Math.cos(a)*rr, Math.sin(a)*rr); } c.closePath(); c.fill(); c.restore(); }
  function spark4(c, x, y, r, col){ c.fillStyle = col; c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r*.25, y); c.lineTo(x, y + r); c.lineTo(x - r*.25, y); c.closePath(); c.moveTo(x - r, y); c.lineTo(x, y + r*.25); c.lineTo(x + r, y); c.lineTo(x, y - r*.25); c.closePath(); c.fill(); }
  function dot(c, x, y, r, col){ c.fillStyle = col; c.beginPath(); c.arc(x, y, Math.max(.1, r), 0, 7); c.fill(); }
  // 칼끝 앞쪽 (맞는 곳)
  const hitAt = (from, to, d) => { const m = (from + to)/2; return [Math.cos(m)*d, Math.sin(m)*d]; };
  // 퍼지는 입자: 각도 범위에서 바깥으로
  function burst(c, s, n, cx, cy, life, speed, fn, off = 0){ for (let i = 0; i < n; i++){ const a = hash(s, i + off)*Math.PI*2, v = speed*(.5 + hash(s, i + off + 50)*.7); fn(cx + Math.cos(a)*v*life, cy + Math.sin(a)*v*life, a, i); } }
  const K = {
    // 1 나무 검: 가는 호 하나뿐
    w1: { ms: 180, life: 300, R: 38, span: 2.0, draw(c, a, p, s, col, from, to, life){
      if (a <= 1) arc(c, 38, from, to, 3, 'rgba(255,255,255,.7)', 1 - a*.7); if (a <= 1) blade(c, to); } },
    // 2 구리 검: 호 + 주황 불티 몇 개
    w2: { ms: 175, life: 360, R: 40, span: 2.1, draw(c, a, p, s, col, from, to, life){
      if (a <= 1){ crescent(c, 40, from, to, 6, 'rgba(255,240,220,.75)', 1 - a*.6); arc(c, 40, from + .2, to, 1.5, col, 1 - a*.5); blade(c, to); }
      const [hx, hy] = hitAt(from, to, 46); c.save(); burst(c, s, 5, hx, hy, life, 50, (x, y) => { A(c, 1 - life); dot(c, x, y, 1.4*(1 - life) + .4, '#ffa060'); }); c.restore(); } },
    // 3 철 검: 두 겹 칼바람 + 칼끝 반짝
    w3: { ms: 165, life: 380, R: 42, span: 2.2, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.4); crescent(c, 44, from, to, 9, 'rgba(255,255,255,.85)', f); crescent(c, 38, from + .15, to, 4, 'rgba(190,200,215,.9)', f); if (a <= 1) blade(c, to);
      const fl = Math.max(0, 1 - Math.abs(life - .25)*4); if (fl > 0){ const [hx, hy] = hitAt(from, to, 50); c.save(); A(c, fl); spark4(c, hx, hy, 9*fl, '#ffffff'); c.restore(); } } },
    // 4 은빛 검: 넓은 은빛 칼바람 + 칼 잔상 + 반짝이 셋
    w4: { ms: 175, life: 450, R: 44, span: 2.4, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.3); crescent(c, 44, from, to, 15, 'rgba(255,255,255,.8)', f); crescent(c, 44, from + .1, to, 6, '#e8eef8', f);
      for (let k = 3; k >= 1; k--){ const ang = to - k*.32; if (ang > from){ c.save(); c.globalAlpha *= .22*f; blade(c, ang); c.restore(); } } if (a <= 1) blade(c, to);
      const [hx, hy] = hitAt(from, to, 50); c.save(); for (let i = 0; i < 3; i++){ const t = life - i*.08; if (t > 0 && t < .6){ A(c, Math.sin(t/.6*Math.PI)); spark4(c, hx + (hash(s, i) - .5)*30, hy + (hash(s, i + 9) - .5)*30, 6, '#ffffff'); } } c.restore(); } },
    // 5 금빛 검: 금빛 큰 칼바람 + 맞은 곳 빛 번쩍 + 금가루 폭발
    w5: { ms: 180, life: 560, R: 46, span: 2.6, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.25); crescent(c, 46, from, to, 20, 'rgba(255,248,210,.85)', f); crescent(c, 46, from + .08, to, 9, '#ffd23f', f); arc(c, 58, from + .3, to, 1.5, '#fff3b0', f*.8); if (a <= 1) blade(c, to);
      const [hx, hy] = hitAt(from, to, 52); if (life < .4) glowDisc(c, hx, hy, 34*(.5 + life), 'rgba(255,230,120,.9)', 1 - life/.4);
      c.save(); burst(c, s, 14, hx, hy, ease(life), 70, (x, y, ang, i) => { A(c, 1 - life); if (i % 3) dot(c, x, y + life*life*20, 2*(1 - life) + .5, i % 2 ? '#ffd23f' : '#fff3b0'); else spark4(c, x, y, 5*(1 - life) + 1, '#ffffff'); }); c.restore(); } },
    // 6 루비 검: 불꽃 칼바람 세 겹 + 불길 꼬리 + 불꽃 고리 + 불씨
    w6: { ms: 185, life: 650, R: 48, span: 2.7, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.3); crescent(c, 52, from, to, 26, 'rgba(255,200,90,.55)', f); crescent(c, 48, from + .06, to, 16, '#ff7a2f', f*.9); crescent(c, 46, from + .14, to, 8, '#ff2f4f', f); if (a <= 1) blade(c, to);
      c.save(); for (let i = 0; i < 16; i++){ const ang = from + hash(s, i)*(to - from), d = 48 + (hash(s, i + 2) - .5)*18, t = life; const x = Math.cos(ang)*d + Math.sin(t*10 + i)*4, y = Math.sin(ang)*d - 60*t*(.5 + hash(s, i + 7)); A(c, (1 - t)*.95); c.fillStyle = i % 3 ? '#ffb347' : '#ff4f2f'; c.beginPath(); c.ellipse(x, y, 2.4*(1 - t) + .6, 4.5*(1 - t) + 1, 0, 0, 7); c.fill(); } c.restore();
      const [hx, hy] = hitAt(from, to, 54); if (life > .1 && life < .7){ const b = (life - .1)/.6; c.save(); A(c, 1 - b); c.strokeStyle = '#ff7a2f'; c.lineWidth = 4*(1 - b) + 1; c.beginPath(); c.arc(hx, hy, 10 + 40*b, 0, 7); c.stroke(); c.restore(); }
      if (life < .35) glowDisc(c, hx, hy, 36, 'rgba(255,120,60,.85)', 1 - life/.35); } },
    // 7 미스릴 검: 얼음 칼바람 + 얼음 결정 터짐 + 땅에 서리 고리 둘 + 눈가루
    w7: { ms: 175, life: 700, R: 48, span: 2.8, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.3); crescent(c, 50, from, to, 22, 'rgba(225,248,255,.85)', f); crescent(c, 48, from + .1, to, 9, '#9ad4ff', f); arc(c, 62, from + .4, to, 1.4, '#ffffff', f*.8); if (a <= 1) blade(c, to);
      const [hx, hy] = hitAt(from, to, 54);
      for (const [d, k] of [[0, 1], [.12, .7]]){ const b = Math.max(0, life - d); if (b > 0 && b < .8){ c.save(); A(c, (1 - b/.8)*.8*k); c.strokeStyle = '#d8f2ff'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(hx, hy + 14, 14 + 70*b, (14 + 70*b)*.38, 0, 0, 7); c.stroke(); c.restore(); } }
      c.save(); burst(c, s, 12, hx, hy, ease(life), 80, (x, y, ang, i) => { A(c, 1 - life); c.save(); c.translate(x, y + life*life*30); c.rotate(ang); c.fillStyle = i % 2 ? '#ffffff' : '#bfe3ff'; c.beginPath(); c.moveTo(0, -5); c.lineTo(2.2, 0); c.lineTo(0, 5); c.lineTo(-2.2, 0); c.fill(); c.restore(); }); c.restore();
      if (life < .3) glowDisc(c, hx, hy, 34, 'rgba(200,240,255,.9)', 1 - life/.3); } },
    // 8 별빛 검: 보랏빛 큰 칼바람에 별 박힘 + 별 폭죽 + 반짝이는 별가루 꼬리
    w8: { ms: 185, life: 800, R: 50, span: 2.9, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.4); crescent(c, 52, from, to, 26, 'rgba(240,230,255,.85)', f); crescent(c, 50, from + .05, to, 11, '#a48af0', f); crescent(c, 50, from + .1, to, 4, '#ffffff', f*.8); if (a <= 1) blade(c, to);
      c.save(); for (let i = 0; i < 10; i++){ const ang = from + (i + .5)/10*(to - from), d = 50 + (hash(s, i) - .5)*24, born = (i + .5)/10*.2, tw = life - born; if (tw < 0) continue; A(c, Math.max(0, 1 - tw*1.4)*(.6 + .4*Math.sin(tw*30 + i))); star(c, Math.cos(ang)*d, Math.sin(ang)*d, 4 + hash(s, i + 1)*4, i % 2 ? '#fff' : '#f4e8ff', tw*3); } c.restore();
      const [hx, hy] = hitAt(from, to, 56); c.save(); burst(c, s, 10, hx, hy, ease(life), 90, (x, y, ang, i) => { A(c, 1 - life); star(c, x, y, 5*(1 - life) + 1.5, i % 2 ? '#ffffff' : '#d9c9ff', life*4); }); c.restore();
      if (life < .35) glowDisc(c, hx, hy, 40, 'rgba(190,170,255,.9)', 1 - life/.35); } },
    // 9 소원의 별검: X 자로 두 번 베기 + 별똥별 + 빛줄기 퍼짐 + 별비 + 화면 빛
    w9: { ms: 240, life: 950, R: 52, span: 3.2, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.3); crescent(c, 54, from, to, 28, 'rgba(255,250,220,.9)', f); crescent(c, 54, from + .08, to, 12, '#ffe07a', f); crescent(c, 54, from + .14, to, 4, '#ffffff', f);
      const p2 = Math.max(0, Math.min(1, (a - .45)/.55)); if (p2 > 0){ const f2 = from + .5, t2 = f2 + (k => k)(2.2*ease(p2)); crescent(c, 44, f2, t2, 18, 'rgba(255,250,220,.8)', f*.9); crescent(c, 44, f2 + .08, t2, 7, '#fff3b0', f); }
      if (a <= 1) blade(c, to);
      const [hx, hy] = hitAt(from, to, 60);
      if (life > .05 && life < .8){ const b = (life - .05)/.75; c.save(); A(c, (1 - b)*.8); c.strokeStyle = '#fff3b0'; c.lineCap = 'round'; for (let i = 0; i < 10; i++){ const ang = i/10*Math.PI*2 + hash(s, 3)*2; c.lineWidth = 2.5*(1 - b) + .5; c.beginPath(); c.moveTo(hx + Math.cos(ang)*(12 + 30*b), hy + Math.sin(ang)*(12 + 30*b)); c.lineTo(hx + Math.cos(ang)*(26 + 70*b), hy + Math.sin(ang)*(26 + 70*b)); c.stroke(); } c.restore(); }
      c.save(); for (let i = 0; i < 12; i++){ const t = (life*1.3 - hash(s, i + 40)*.3); if (t < 0 || t > 1) continue; A(c, 1 - t); star(c, hx + (hash(s, i) - .5)*120, hy - 70 + t*90, 3 + hash(s, i + 5)*3, i % 2 ? '#ffffff' : '#ffe07a', t*5); } c.restore();
      if (life < .4){ glowDisc(c, hx, hy, 70, 'rgba(255,240,170,.85)', 1 - life/.4); glowDisc(c, 0, 0, 160, 'rgba(255,250,220,.35)', (1 - life/.4)*.8); } } },
    // 10 심연 대검: 거대한 검은 칼바람 여러 겹 + 보랏빛 번개 + 땅 갈라짐 충격파 두 겹 + 검은 안개 + 어두운 번쩍 + 화면 흔들림
    w10: { ms: 260, life: 1100, R: 58, span: 3.1, shake: 7, draw(c, a, p, s, col, from, to, life){
      const f = Math.max(0, 1 - life*1.2); crescent(c, 62, from, to, 40, 'rgba(20,6,30,.55)', f); crescent(c, 60, from + .05, to, 24, 'rgba(90,30,140,.85)', f); crescent(c, 58, from + .1, to, 9, '#c060ff', f); crescent(c, 58, from + .15, to, 3, '#f0d0ff', f); if (a <= 1) blade(c, to);
      const [hx, hy] = hitAt(from, to, 62);
      if (life < .45){ c.save(); A(c, (1 - life/.45)); c.lineJoin = 'round'; c.lineCap = 'round'; for (let k = 0; k < 4; k++){ const ang = hash(s, k + 60)*Math.PI*2; c.beginPath(); let x = hx, y = hy; c.moveTo(x, y); for (let j = 0; j < 5; j++){ x += Math.cos(ang + (hash(s, k*9 + j) - .5)*1.4)*14; y += Math.sin(ang + (hash(s, k*9 + j) - .5)*1.4)*14; c.lineTo(x, y); } c.strokeStyle = 'rgba(192,96,255,.45)'; c.lineWidth = 5; c.stroke(); c.strokeStyle = '#f0d0ff'; c.lineWidth = 1.6; c.stroke(); } c.restore(); }
      for (const [d, k] of [[.15, 1], [.3, .7]]){ if (life > d){ const b = (life - d)/(1 - d); c.save(); A(c, (1 - b)*k); c.strokeStyle = '#c060ff'; c.lineWidth = 4*(1 - b) + 1; c.beginPath(); c.ellipse(hx, hy + 18, 20 + 120*b, (20 + 120*b)*.35, 0, 0, 7); c.stroke(); c.restore(); } }
      if (life > .12){ const b = Math.min(1, (life - .12)*3); c.save(); A(c, (1 - life)*.9); c.strokeStyle = '#140818'; c.lineWidth = 3; c.lineCap = 'round'; for (let i = 0; i < 6; i++){ const ang = hash(s, i + 20)*Math.PI*2; c.beginPath(); c.moveTo(hx, hy + 18); c.lineTo(hx + Math.cos(ang)*50*b, hy + 18 + Math.sin(ang)*18*b); c.lineTo(hx + Math.cos(ang + .35)*90*b, hy + 18 + Math.sin(ang + .35)*30*b); c.stroke(); } c.restore(); }
      c.save(); for (let i = 0; i < 14; i++){ const ang = from + hash(s, i)*(to - from), d = 58, t = life; const x = Math.cos(ang)*d + (hash(s, i + 3) - .5)*50*t, y = Math.sin(ang)*d - 50*t; A(c, (1 - life)*.5); dot(c, x, y, 8 + 22*t, i % 2 ? '#1a0824' : '#4a1a70'); } c.restore();
      if (life < .3){ glowDisc(c, hx, hy, 80, 'rgba(160,60,240,.8)', 1 - life/.3); glowDisc(c, 0, 0, 200, 'rgba(20,0,30,.45)', (1 - life/.3)); } } },
    // 11 불꽃 고래 검: 세 겹 불꽃 칼바람 + 불꽃 고래 꼬리가 바닥을 내려침 + 용암 기둥 + 불씨 폭풍 + 붉은 번쩍 + 화면 흔들림
    w11: { ms: 270, life: 1200, R: 60, span: 3.2, shake: 8, draw(c, a, p, s, col, from, to, life, lv = 0){
      const f = Math.max(0, 1 - life*1.2); crescent(c, 66, from, to, 44, 'rgba(255,190,80,.5)', f); crescent(c, 62, from + .05, to, 28, '#ff6a2f', f*.9); crescent(c, 60, from + .1, to, 12, '#ff2f1a', f); crescent(c, 60, from + .16, to, 4, '#fff0b0', f); if (a <= 1) blade(c, to);
      const [hx, hy] = hitAt(from, to, 64);
      if (life > .08 && life < .7){ const b = (life - .08)/.62, tx = hx, ty = hy - 40 + b*30; c.save(); A(c, Math.sin(b*Math.PI)*.9); c.fillStyle = '#ff7a2f'; c.translate(tx, ty); c.scale(1.4, 1.4); c.beginPath(); c.moveTo(0, 14); c.quadraticCurveTo(-4, 2, -18, -8); c.quadraticCurveTo(-6, -6, 0, 2); c.quadraticCurveTo(6, -6, 18, -8); c.quadraticCurveTo(4, 2, 0, 14); c.fill(); c.fillStyle = '#ffd23f'; c.scale(.55, .55); c.beginPath(); c.moveTo(0, 12); c.quadraticCurveTo(-4, 2, -16, -6); c.quadraticCurveTo(-5, -4, 0, 3); c.quadraticCurveTo(5, -4, 16, -6); c.quadraticCurveTo(4, 2, 0, 12); c.fill(); c.restore(); }
      for (const [d, k] of [[.18, 1], [.32, .7]]){ if (life > d){ const b = (life - d)/(1 - d); c.save(); A(c, (1 - b)*k); c.strokeStyle = '#ff5a1f'; c.lineWidth = 5*(1 - b) + 1; c.beginPath(); c.ellipse(hx, hy + 18, 20 + 130*b, (20 + 130*b)*.35, 0, 0, 7); c.stroke(); c.restore(); } }
      if (life > .2 && life < .85){ const b = (life - .2)/.65; c.save(); for (let i = 0; i < 5 + lv; i++){ const ang = hash(s, i + 30)*Math.PI*2, d = 30 + hash(s, i + 31)*70, x = hx + Math.cos(ang)*d, y = hy + 18 + Math.sin(ang)*d*.35, hgt = 70*Math.sin(Math.min(1, b*1.6)*Math.PI)*(.6 + hash(s, i + 32)*.6); A(c, (1 - b)*.9); const q = c.createLinearGradient(0, y, 0, y - hgt); q.addColorStop(0, '#ff3b1f'); q.addColorStop(.6, '#ffb347'); q.addColorStop(1, 'rgba(255,240,170,0)'); c.fillStyle = q; c.beginPath(); c.moveTo(x - 6, y); c.quadraticCurveTo(x - 3, y - hgt*.6, x, y - hgt); c.quadraticCurveTo(x + 3, y - hgt*.6, x + 6, y); c.closePath(); c.fill(); } c.restore(); }
      c.save(); burst(c, s, 22 + lv*6, hx, hy, ease(life), 110 + lv*10, (x, y, ang, i) => { A(c, 1 - life); dot(c, x, y - life*40, 2.6*(1 - life) + .5, i % 3 === 0 ? '#ffe07a' : i % 2 ? '#ff9a3a' : '#ff3b1f'); }); c.restore();
      if (life < .3){ glowDisc(c, hx, hy, 90 + lv*10, 'rgba(255,110,40,.85)', 1 - life/.3); glowDisc(c, 0, 0, 220 + lv*20, 'rgba(255,60,20,.3)', (1 - life/.3)); } } },
  };
  function draw(c, kind, x, y, base, ms, seed, col, lv = 0){ CUR = K[kind] ? kind : 'w1'; const k = K[kind] || K.w1; const total = k.ms + k.life; if (ms < 0 || ms > total) return false;
    const a = ms/k.ms, p = ease(Math.min(1, a)), from = base - k.span/2, to = from + k.span*p, life = Math.max(0, (ms - k.ms*.5)/(total - k.ms*.5));
    c.save(); c.translate(x, y); k.draw(c, a, p, seed, col, from, to, life, lv|0); if (a > 1 && a < 2.2){ c.save(); c.globalAlpha *= Math.min(1, (2.2 - a)/.5); blade(c, to); c.restore(); } c.restore(); return true; }
  const shake = (kind, ms) => { const k = K[kind]; if (!k || !k.shake || ms < k.ms*.8 || ms > k.ms + 200) return [0, 0]; const f = 1 - (ms - k.ms*.8)/(k.ms*.2 + 200); return [Math.sin(ms*.9)*k.shake*f, Math.cos(ms*1.3)*k.shake*f*.6]; };
  return { draw, shake, K };
})();
