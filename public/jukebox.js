// ===== 주크박스 곡: 핑키 섬을 위해 새로 지은 곡이에요 (저작권 걱정 없음). 브라우저가 직접 연주하고 무한 반복해요 =====
// 멜로디는 [음계 몇 번째 음(1 = 으뜸음, 8 = 한 옥타브 위), 박자 수], null 은 쉼표. 8 마디(32 박) 한 바퀴
export const JUKE_SONGS = [
  { id:'dew', name:'아침 이슬', when:'아침 6~10 시', mood:'오르골처럼 맑고 가벼워요. 일어나서 텃밭에 물 줄 때.', key:60, scale:'maj', bpm:92, lead:'bell', acc:'arp', drums:false,
    chords:[1,5,6,4,1,4,5,1],
    mel:[[5,1],[3,1],[5,1],[8,1], [7,2],[5,2], [6,1],[8,1],[10,1],[8,1], [6,3],[null,1],
         [5,1],[3,1],[5,1],[8,1], [9,1],[8,1],[6,1],[4,1], [5,1.5],[4,.5],[2,2], [1,3],[null,1]] },
  { id:'sea', name:'바닷가 산책', when:'낮 10~14 시', mood:'우쿨렐레를 튕기는 느낌. 등대 해변을 걸을 때.', key:65, scale:'maj', bpm:104, lead:'pluck', acc:'strum', drums:false,
    chords:[1,6,4,5,1,6,2,5],
    mel:[[3,.5],[5,.5],[8,1],[7,.5],[8,.5],[5,1], [6,1],[5,.5],[3,.5],[1,2], [4,.5],[6,.5],[8,1],[6,.5],[8,.5],[10,1], [9,2],[7,1],[5,1],
         [3,.5],[5,.5],[8,1],[7,.5],[8,.5],[10,1], [10,1],[8,.5],[6,.5],[8,2], [9,1],[6,1],[4,1],[2,1], [5,1],[7,1],[9,2]] },
  { id:'market', name:'딸기 마켓', when:'낮 12~16 시', mood:'통통 튀는 장터 음악. 주민에게 팔고 살 때.', key:67, scale:'maj', bpm:120, lead:'chip', acc:'strum', drums:true,
    chords:[1,4,1,5,1,4,5,1],
    mel:[[5,.5],[3,.5],[5,.5],[8,.5],[7,.5],[5,.5],[3,1], [4,.5],[6,.5],[8,.5],[6,.5],[4,1],[null,1], [3,.5],[5,.5],[8,.5],[10,.5],[9,.5],[8,.5],[5,1], [7,.5],[5,.5],[2,.5],[5,.5],[7,2],
         [5,.5],[3,.5],[5,.5],[8,.5],[7,.5],[5,.5],[3,1], [6,.5],[8,.5],[11,.5],[10,.5],[8,1],[6,1], [5,.5],[7,.5],[9,.5],[7,.5],[5,1],[2,1], [1,1],[3,.5],[5,.5],[8,2]] },
  { id:'nap', name:'오후의 낮잠', when:'오후 14~17 시', mood:'느리고 포근해요. 집 안에서 쉴 때.', key:62, scale:'maj', bpm:70, lead:'bell', acc:'pad', drums:false,
    chords:[1,3,4,4,1,6,2,5],
    mel:[[3,2],[2,1],[1,1], [3,3],[5,1], [6,2],[5,1],[4,1], [4,4], [3,2],[5,1],[8,1], [8,2],[6,2], [6,1],[5,1],[4,1],[2,1], [7,2],[5,2]] },
  { id:'festa', name:'반짝 축제', when:'저녁 17~19 시', mood:'마림바와 북으로 신나게. 보스를 잡은 날.', key:65, scale:'maj', bpm:132, lead:'marimba', acc:'strum', drums:true,
    chords:[1,4,5,1,6,2,5,1],
    mel:[[1,.5],[3,.5],[5,.5],[8,.5],[5,.5],[3,.5],[5,1], [4,.5],[6,.5],[8,.5],[11,.5],[10,1],[8,1], [7,.5],[9,.5],[12,.5],[9,.5],[7,1],[5,1], [8,1.5],[10,.5],[8,1],[null,1],
         [6,.5],[8,.5],[10,.5],[13,.5],[12,1],[10,1], [9,.5],[11,.5],[13,.5],[11,.5],[9,1],[6,1], [7,.5],[9,.5],[12,.5],[14,.5],[12,1],[9,1], [8,1],[12,1],[15,1],[null,1]] },
  { id:'rain', name:'비 오는 창가', when:'비 오는 날', mood:'빗소리 위에 잔잔한 전자 피아노. 비 오는 날 집에서.', key:64, scale:'min', bpm:74, lead:'epiano', acc:'pad7', drums:'soft', rain:true,
    chords:[1,4,7,3,6,4,5,1],
    mel:[[3,1.5],[5,.5],[7,1],[5,1], [8,2],[6,1],[4,1], [9,1.5],[7,.5],[11,2], [10,3],[null,1], [8,1],[10,1],[12,1],[10,1], [11,1.5],[10,.5],[8,2], [7,1],[9,1],[12,1],[9,1], [8,3],[null,1]] },
  { id:'star', name:'별빛 언덕', when:'밤 19~6 시', mood:'메아리가 길게 남는 첼레스타. 별똥별을 기다릴 때.', key:57, scale:'min', bpm:80, lead:'celesta', acc:'arp', drums:false, echo:true,
    chords:[1,6,3,7,1,4,6,5],
    mel:[[5,1],[8,1],[7,.5],[8,.5],[5,1], [6,2],[3,1],[1,1], [3,1],[5,1],[7,1],[8,.5],[7,.5], [9,2],[7,2], [8,1],[10,1],[12,1],[10,1], [11,2],[8,1],[6,1], [10,1],[8,1],[6,1],[8,1], [7,2],[5,2]] },
];


const SCALES = {maj:[0,2,4,5,7,9,11], min:[0,2,3,5,7,8,10]};
const semi = (d, sc) => { const i = d - 1, o = Math.floor(i / 7); return SCALES[sc][((i % 7) + 7) % 7] + 12 * o; };
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const totalBars = s => Math.round(s.mel.reduce((n,[,b])=>n+b, 0) / 4);
// 아이폰 무음 스위치가 켜져 있어도 들리게: 재생용 오디오 세션 + 아주 짧은 무음 소리를 같이 틀어요
const SILENT = 'data:audio/wav;base64,UklGRsQPAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaAPAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';

export function jukeEngine(volume = .35){
  let ctx = null, master = null, echoIn = null, timer = 0, cur = null, nextT = 0, step = 0, rainSrc = null, keep = null, noiseBuf = null;
  function audio(){
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = volume; master.connect(ctx.destination);
    const d = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain();
    d.delayTime.value = .36; fb.gain.value = .38; wet.gain.value = .45;
    echoIn = ctx.createGain(); echoIn.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(master);
  }
  function unlock(){
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch(e){}
    try { if (!keep){ keep = new Audio(SILENT); keep.loop = true; keep.setAttribute('playsinline', ''); } keep.play().catch(()=>{}); } catch(e){}
  }
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); };
  function osc(type, f, t, dur, peak, dest, a = .005, filt){
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
    let n = o; if (filt){ const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = filt; o.connect(lp); n = lp; }
    n.connect(g); g.connect(dest); env(g, t, a, peak, dur); o.start(t); o.stop(t + a + dur + .05);
  }
  const LEAD = {
    bell:    (f,t,d,out)=>{ osc('sine', f, t, Math.max(.9, d*1.5), .22, out); osc('sine', f*2, t, .5, .06, out); },
    pluck:   (f,t,d,out)=>{ osc('triangle', f, t, .45, .26, out, .003, 2400); osc('sine', f*2, t, .18, .05, out); },
    chip:    (f,t,d,out)=>{ osc('square', f, t, Math.min(.22, d*.6), .07, out, .004, 1800); },
    marimba: (f,t,d,out)=>{ osc('sine', f, t, .35, .28, out, .002); osc('sine', f*4, t, .07, .06, out, .002); },
    epiano:  (f,t,d,out)=>{ osc('sine', f, t, Math.max(1, d*1.2), .2, out, .01); osc('triangle', f*2, t, .4, .04, out, .01, 1600); },
    celesta: (f,t,d,out)=>{ osc('sine', f*2, t, 1.2, .16, out); osc('sine', f*4, t, .4, .04, out); },
  };
  const chordNotes = (s, deg, seventh) => { const ns = [deg, deg+2, deg+4]; if (seventh) ns.push(deg+6); return ns.map(d => s.key - 12 + semi(d, s.scale)); };
  const noise = () => { if (noiseBuf) return noiseBuf; noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const a = noiseBuf.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random()*2-1; return noiseBuf; };
  function kick(t, v){ const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + .12); o.connect(g); g.connect(master); env(g, t, .002, v, .16); o.start(t); o.stop(t + .25); }
  function hat(t, v){ const s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise(); hp.type = 'highpass'; hp.frequency.value = 7000; s.connect(hp); hp.connect(g); g.connect(master); env(g, t, .001, v, .04); s.start(t, Math.random()); s.stop(t + .08); }
  function rainOn(){ const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise(); s.loop = true; bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = .6; g.gain.value = .045; s.connect(bp); bp.connect(g); g.connect(master); s.start(); rainSrc = s; }
  function bar(s, b, t0){
    const beat = 60 / s.bpm, out = s.echo ? echoIn : master, ch = chordNotes(s, s.chords[b % s.chords.length], s.acc === 'pad7');
    if (s.acc === 'arp') for (let i = 0; i < 8; i++) osc('triangle', hz(ch[[0,1,2,1,0,1,2,1][i]] + (i===2||i===6 ? 12 : 0)), t0 + i*beat/2, .5, .055, master, .004, 1500);
    if (s.acc === 'strum'){ osc('triangle', hz(ch[0]-12), t0, beat*1.6, .2, master); osc('triangle', hz(ch[0]-12+7), t0 + beat*2, beat*1.6, .16, master);
      for (const k of [1,3]) ch.forEach((m,j)=>osc('triangle', hz(m), t0 + k*beat + j*.012, .3, .05, master, .003, 1800)); }
    if (s.acc === 'pad' || s.acc === 'pad7'){ ch.forEach(m=>{ osc('triangle', hz(m), t0, beat*4, .045, master, .35, 1200); osc('triangle', hz(m)*1.003, t0, beat*4, .03, master, .35, 1200); }); osc('sine', hz(ch[0]-12), t0, beat*3, .16, master, .02); }
    if (s.drums === true){ for (const k of [0,2]) kick(t0 + k*beat, .5); for (let i = 0; i < 8; i++) hat(t0 + i*beat/2, i%2 ? .05 : .08); }
    if (s.drums === 'soft'){ kick(t0, .28); kick(t0 + 2.5*beat, .2); for (let i = 1; i < 8; i += 2) hat(t0 + i*beat/2 + beat*.08, .035); }
    let pos = 0; const st = b*4, en = st + 4;
    for (const [d, n] of s.mel){ if (pos >= st && pos < en && d != null) LEAD[s.lead](hz(s.key + 12 + semi(d, s.scale)), t0 + (pos - st)*beat, n*beat, out); pos += n; }
  }
  function tick(){ if (!cur) return; const n = totalBars(cur), len = 240 / cur.bpm; while (nextT < ctx.currentTime + 1.2){ bar(cur, step % n, nextT); nextT += len; step++; } }
  function stop(){
    if (!cur) return; cur = null; clearInterval(timer); timer = 0;
    if (rainSrc){ try { rainSrc.stop(); } catch(e){} rainSrc = null; }
    try { keep && keep.pause(); } catch(e){}
    if (ctx){ const g = master; g.gain.setTargetAtTime(0, ctx.currentTime, .05); master = ctx.createGain(); master.gain.value = volume; master.connect(ctx.destination);
      echoIn.disconnect(); const d = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain(); d.delayTime.value = .36; fb.gain.value = .38; wet.gain.value = .45; echoIn = ctx.createGain(); echoIn.connect(d); d.connect(fb); fb.connect(d); d.connect(wet); wet.connect(master);
      setTimeout(()=>{ try { g.disconnect(); } catch(e){} }, 600); }
  }
  // 화면 터치 안에서 불러야 소리가 나요
  function play(s){ audio(); unlock(); ctx.resume(); stop(); cur = s; step = 0; nextT = ctx.currentTime + .08; if (s.rain) rainOn(); tick(); timer = setInterval(tick, 100); }
  function pause(){ if (ctx) ctx.suspend().catch(()=>{}); }
  function resume(){ if (ctx && cur) ctx.resume().catch(()=>{}); }
  return { play, stop, pause, resume, get playing(){ return cur; } };
}
