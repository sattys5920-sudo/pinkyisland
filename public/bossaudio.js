// ===== 다크 보스전 음악 · 효과음 =====
// 주민마다 다른 테마곡을 브라우저가 직접 연주해요 (저작권 걱정 없음). 8 마디를 무한 반복해요.
// 효과음도 주민 특징에 맞게: 예고(warn) · 내려찍기(slam) · 내가 맞음(hurt) · 보스를 때림(hit) · 50% 변신(rage · 기괴하게) · 쓰러뜨림(down)
export function bossAudio(opts = {}){
  let ctx = null, out = null, dry = null, wet = null, musicBus = null, sfxBus = null, cur = null, timer = 0, next = 0, bar = 0, noiseBuf = null;
  const VOL = opts.volume ?? .5;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  let R = 1; const rnd = () => (R = (R * 16807) % 2147483647) / 2147483647;

  function init(c){
    if (ctx) return; ctx = c || new (window.AudioContext || window.webkitAudioContext)();
    out = ctx.createGain(); out.gain.value = VOL; const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; out.connect(comp); comp.connect(opts.dest || ctx.destination);
    // 긴 울림 (방 안이 텅 빈 느낌)
    const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++){ const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random()*2 - 1) * Math.pow(1 - i/len, 2.6); }
    const conv = ctx.createConvolver(); conv.buffer = ir; wet = ctx.createGain(); wet.gain.value = .55; wet.connect(conv); conv.connect(out);
    dry = ctx.createGain(); dry.gain.value = .8; dry.connect(out);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(dry); musicBus.connect(wet);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(dry); sfxBus.connect(wet);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random()*2 - 1;
  }

  // ----- 악기 -----
  function tone(f, t, d, v, type = 'sine', o = {}){
    const os = ctx.createOscillator(), g = ctx.createGain(); os.type = type; os.frequency.setValueAtTime(f, t);
    if (o.glide) os.frequency.exponentialRampToValueAtTime(Math.max(20, o.glide), t + (o.glideT ?? d));
    if (o.detune) os.detune.value = o.detune;
    if (o.vib){ const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vib; lg.gain.value = f * (o.vibD ?? .012); l.connect(lg); lg.connect(os.frequency); l.start(t); l.stop(t + d + .1); }
    const a = o.a ?? .01, r = o.r ?? d; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a);
    if (o.hold) g.gain.setValueAtTime(v, t + Math.max(a, d - r)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    let node = os; if (o.lp || o.bp || o.hp){ const fl = ctx.createBiquadFilter(); fl.type = o.lp ? 'lowpass' : o.bp ? 'bandpass' : 'highpass'; fl.frequency.value = o.lp || o.bp || o.hp; fl.Q.value = o.q ?? 1; if (o.lpTo) fl.frequency.exponentialRampToValueAtTime(o.lpTo, t + d); node.connect(fl); node = fl; }
    node.connect(g); g.connect(o.dest || musicBus); os.start(t); os.stop(t + d + .05);
  }
  function noise(t, d, v, o = {}){
    const s = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter(); s.buffer = noiseBuf; s.loop = true; s.playbackRate.value = o.rate ?? 1;
    fl.type = o.type || 'bandpass'; fl.frequency.setValueAtTime(o.f ?? 1000, t); if (o.fTo) fl.frequency.exponentialRampToValueAtTime(o.fTo, t + d); fl.Q.value = o.q ?? 1;
    const a = o.a ?? .005; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); if (o.hold) g.gain.setValueAtTime(v, t + d - (o.r ?? d*.5)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(o.dest || musicBus); s.start(t, rnd()*1.5); s.stop(t + d + .05);
  }
  const musicbox = (m, t, v = .12, dest) => { const f = hz(m) * (1 + (rnd() - .5)*.012); tone(f, t, 1.6, v, 'sine', {dest}); tone(f*3.01, t, .5, v*.25, 'sine', {dest}); tone(f*5.4, t, .18, v*.08, 'sine', {dest}); };
  const bell = (m, t, v = .12, d = 3, dest) => { const f = hz(m); [[1, 1], [2.76, .45], [5.4, .25], [8.93, .12]].forEach(([k, a]) => tone(f*k, t, d/(1 + k*.4), v*a, 'sine', {dest})); };
  const pluck = (m, t, v = .1, d = .8, dest) => tone(hz(m), t, d, v, 'sawtooth', {lp:4200, lpTo:500, dest});
  const organ = (m, t, d, v = .06, dest) => [[1, 1], [2, .5], [3, .3], [4, .22], [8, .08]].forEach(([k, a]) => tone(hz(m)*k, t, d, v*a, 'sine', {a:.25, hold:true, r:.4, dest}));
  const pad = (m, t, d, v = .04, lp = 900, dest) => { for (const dt of [-7, 7]) tone(hz(m), t, d, v, 'sawtooth', {a:d*.35, hold:true, r:d*.4, detune:dt, lp, dest}); };
  const drone = (m, t, d, v = .05, lp = 400, dest) => tone(hz(m), t, d, v, 'sawtooth', {a:1, hold:true, r:1.2, lp, vib:.15, vibD:.006, dest});
  const thud = (t, v = .5, f = 110, dest) => tone(f, t, .45, v, 'sine', {glide:38, glideT:.35, dest});
  const click = (t, v = .1, f = 3200, dest) => noise(t, .03, v, {f, q:3, dest});
  const metal = (t, v = .06, f = 1800, dest) => [1, 1.47, 2.09, 2.76].forEach((k, i) => tone(f*k*(1 + (rnd() - .5)*.02), t + i*.004, .35, v/(i + 1), 'square', {hp:900, dest}));
  const creak = (t, d, v = .05, f = 300, dest) => tone(f, t, d, v, 'sawtooth', {bp:f*2, q:6, vib:7 + rnd()*5, vibD:.04, a:.08, hold:true, r:.2, dest});
  const voice = (m, t, d, v = .05, dest) => { const f = hz(m); tone(f, t, d, v, 'triangle', {a:d*.4, hold:true, r:d*.4, vib:5, vibD:.01, dest}); noise(t, d, v*.25, {f:f*2.5, q:12, a:d*.4, hold:true, dest}); };
  const ghost = (m1, m2, t, d, v = .04, dest) => tone(hz(m1), t, d, v, 'sine', {glide:hz(m2), glideT:d, a:d*.3, hold:true, r:d*.3, vib:6, vibD:.02, dest});
  const heart = (t, v = .45, dest) => { thud(t, v, 70, dest); thud(t + .2, v*.7, 64, dest); };

  // 일그러진 신음: 톱니파 → 찌그러뜨림 → 입 모양처럼 움직이는 띠 거르개 · 떨림이 점점 빨라져요
  let shapeCurve = null;
  function growl(t, d, f0, v){
    const os = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), ws = ctx.createWaveShaper(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    if (!shapeCurve){ shapeCurve = new Float32Array(1024); for (let i = 0; i < 1024; i++) shapeCurve[i] = Math.tanh((i/512 - 1)*6); }
    os.type = 'sawtooth'; os.frequency.setValueAtTime(f0, t); os.frequency.linearRampToValueAtTime(f0*.62, t + d);
    lfo.frequency.setValueAtTime(4, t); lfo.frequency.linearRampToValueAtTime(22, t + d); lg.gain.value = f0*.09; lfo.connect(lg); lg.connect(os.frequency);
    ws.curve = shapeCurve; bp.type = 'bandpass'; bp.Q.value = 4; bp.frequency.setValueAtTime(380, t); bp.frequency.exponentialRampToValueAtTime(1500, t + d*.45); bp.frequency.exponentialRampToValueAtTime(260, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .25); g.gain.setValueAtTime(v, t + d*.6); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    os.connect(ws); ws.connect(bp); bp.connect(g); g.connect(sfxBus); os.start(t); lfo.start(t); os.stop(t + d + .05); lfo.stop(t + d + .05);
  }

  // ----- 주민별 테마곡 (한 마디씩 예약) -----
  const sc = (root, steps) => i => root + steps[((i % steps.length) + steps.length) % steps.length] + 12*Math.floor(i/steps.length);
  const MIN = [0, 2, 3, 5, 7, 8, 10], PHR = [0, 1, 3, 5, 7, 8, 10], HAR = [0, 2, 3, 5, 7, 8, 11], LOC = [0, 1, 3, 5, 6, 8, 10];
  const THEMES = {
    // 토리: 음정이 살짝 틀린 오르골 + 타자기 · 도장 쿵 · 종이 바스락
    tori:{ bpm:70, beats:4, bar(b, t, B){ const s = sc(69, PHR), mel = [[0, 2, 4, 3], [2, 1, 0, -1], [4, 6, 5, 4], [3, 1, 2, 0], [0, 2, 4, 7], [6, 4, 5, 3], [2, 4, 1, -2], [0, null, -3, null]][b % 8];
      mel.forEach((n, i) => n != null && musicbox(s(n) + (rnd() < .15 ? -1 : 0), t + i*B, .13));
      drone(45, t, B*4, .035); thud(t, .35, 90); thud(t + 2*B, .25, 85); for (let i = 0; i < 8; i++) if (rnd() < .55) click(t + i*B/2 + rnd()*.03, .05, 2600 + rnd()*1200);
      if (b % 2 === 1) noise(t + 2.5*B, 1.2, .03, {f:3000, q:.6, a:.2}); } },
    // 보리: 똑딱 시계 · 열쇠 꾸러미 · 증3도 종 · 쇠사슬 끌림
    bori:{ bpm:60, beats:4, bar(b, t, B){ for (let i = 0; i < 4; i++) click(t + i*B, i % 2 ? .07 : .1, i % 2 ? 1800 : 2600);
      pad(b % 4 < 2 ? 40 : 46, t, B*4, .028, 600); if (b % 2 === 0){ bell(64, t + .1, .07, 4); bell(70, t + B*2, .05, 4); }
      if (b % 4 === 3){ for (let i = 0; i < 6; i++) metal(t + B*3 + i*.07, .025, 2200 + rnd()*900); }
      if (b % 8 === 5) noise(t + B, B*2.5, .05, {type:'lowpass', f:300, fTo:120, a:.6}); if (b % 8 === 7) voice(52, t + B, B*3, .04); } },
    // 올리: 쳄발로 비가 (내려가는 베이스) · 늦게 따라오는 음정 나간 메아리 · 거꾸로 부푸는 소리
    olly:{ bpm:66, beats:4, bar(b, t, B){ const roots = [57, 55, 53, 52, 57, 55, 53, 52], r = roots[b % 8], ch = r === 52 ? [0, 4, 8, 11] : [0, 3, 7, 12];
      for (let i = 0; i < 8; i++){ const n = r + ch[i % 4] + (i > 3 ? 12 : 0); pluck(n, t + i*B/2, .07); pluck(n + .3, t + i*B/2 + .19, .025); }
      pluck(r - 24, t, .1, 1.6); tone(120, t, B*4, .012, 'sine', {a:1, hold:true}); if (b % 4 === 3) pad(r + 12, t + B*2, B*2, .05, 1800); } },
    // 몽실: 드르륵 재봉틀 · 휘파람 자장가 · 가위 싹둑
    mongsil:{ bpm:92, beats:4, bar(b, t, B){ const s = sc(64, MIN), mel = [[4, 3, 2, null], [1, 2, 0, null], [4, 5, 6, 5], [4, 2, 1, null], [7, 6, 4, null], [5, 4, 2, 1], [0, 1, 2, 4], [0, null, null, null]][b % 8];
      mel.forEach((n, i) => n != null && tone(hz(s(n) + 12), t + i*B, B*.95, .045, 'sine', {a:.04, vib:5.5, vibD:.015}));
      const run = 6 + Math.floor(rnd()*8), st = Math.floor(rnd()*4); for (let i = 0; i < run; i++) click(t + st*B/4 + i*B/4, .06, 1400); pad(40, t, B*4, .022, 500);
      if (rnd() < .5){ const at = t + B*(2 + Math.floor(rnd()*2)); metal(at, .03, 3400); metal(at + .09, .03, 3000); } } },
    // 펭펭: 안개 뱃고동 · 파도 · 수중 탐지 핑 · 느린 단조 뱃노래
    pengpeng:{ bpm:56, beats:4, bar(b, t, B){ const s = sc(57, MIN), mel = [[0, 2, 4, 2], [3, 1, -1, null], [0, 2, 4, 7], [5, 4, 2, null], [4, 5, 7, 5], [4, 2, 0, null], [-1, 0, 2, -3], [0, null, null, null]][b % 8];
      mel.forEach((n, i) => n != null && organ(s(n), t + i*B, B*.9, .025)); noise(t, B*4, .04, {type:'lowpass', f:500, a:B*1.5, hold:true, r:B*1.5});
      if (b % 2 === 0) tone(hz(33), t, B*2.2, .09, 'sawtooth', {a:.4, hold:true, r:.6, lp:240, vib:.5}); if (b % 4 === 1){ tone(1250, t + B*1.5, .5, .05, 'sine'); tone(1250, t + B*2.5, .4, .02, 'sine'); } } },
    // 단단: 늘어진 테이프 왈츠 (3 박) · 커피 방울 · 스푼 땡 · 하품
    dandan:{ bpm:84, beats:3, bar(b, t, B){ const s = sc(62, MIN), mel = [[4, 2, 0], [1, 2, 4], [5, 4, 2], [4, null, null], [7, 5, 4], [2, 4, 1], [0, -1, -3], [0, null, null]][b % 8], warp = 1 - (b % 8)*.004;
      mel.forEach((n, i) => n != null && tone(hz(s(n))*warp, t + i*B, B*.9, .055, 'triangle', {vib:1.2, vibD:.02, lp:1800}));
      thud(t, .22, 70); tone(hz(s(2) - 12)*warp, t + B, .3, .03, 'triangle'); tone(hz(s(4) - 12)*warp, t + 2*B, .3, .03, 'triangle');
      if (rnd() < .7) tone(1600 + rnd()*900, t + rnd()*B*3, .12, .04, 'sine', {glide:900}); if (b % 4 === 0) bell(88, t, .03, 1.5); if (b % 8 === 6) ghost(64, 52, t + B, B*2, .035); } },
    // 모모: 녹아내리는 아이스크림 트럭 종소리 (점점 느려짐) · 삐걱이는 바퀴 · 비디오 늘어짐
    momo:{ bpm:100, beats:4, bar(b, t, B){ const s = sc(72, [0, 2, 4, 5, 7, 9, 11]), mel = [[0, 2, 4, 4], [5, 4, 2, 0], [2, 4, 5, 7], [6, null, 4, null], [0, 2, 4, 4], [5, 4, 2, 0], [1, 2, 3, 2], [0, null, null, null]][b % 8], wow = Math.sin(b*.9)*.025;
      mel.forEach((n, i) => n != null && (tone(hz(s(n) + (b % 8 === 6 ? -1 : 0))*(1 + wow), t + i*B, B*.8, .04, 'square', {lp:2400}), bell(s(n) + 12, t + i*B, .025, .8)));
      tone(hz(36), t, B*4, .05, 'triangle', {a:.2, hold:true}); if (b % 2 === 1) creak(t + B*2.5, B*1.2, .03, 260 + rnd()*120); noise(t, B*4, .012, {f:5000, q:.4, a:.5, hold:true}); } },
    // 하나: 탁탁 불꽃 · 낮은 바이올린 드론 · 화성단음 민요 · 심장 소리
    hana:{ bpm:76, beats:4, bar(b, t, B){ const s = sc(62, HAR), mel = [[0, 1, 2, 4], [3, 2, 1, null], [4, 5, 6, 4], [5, 3, 2, null], [7, 6, 4, 2], [3, 4, 2, 1], [0, -1, 1, 0], [0, null, null, null]][b % 8];
      mel.forEach((n, i) => n != null && tone(hz(s(n)), t + i*B, B*.95, .045, 'sawtooth', {bp:1600, q:1.4, vib:5.5, vibD:.01, a:.06}));
      drone(38, t, B*4, .04, 500); drone(45, t, B*4, .02, 500); for (let i = 0; i < 14; i++) click(t + rnd()*B*4, .03 + rnd()*.05, 900 + rnd()*2500); noise(t, B*4, .02, {type:'lowpass', f:260, a:1, hold:true}); heart(t + B*3, .25); } },
    // 도도: 땅울림 · 곡괭이 메아리 (쿵쿵쿵 세 번) · 물방울 · 아주 낮은 신음
    dodo:{ bpm:54, beats:4, bar(b, t, B){ noise(t, B*4, .06, {type:'lowpass', f:90, a:1.2, hold:true}); for (let i = 0; i < 3; i++){ thud(t + B*2 + i*.32, .32, 80); metal(t + B*2 + i*.32, .014, 900); }
      if (b % 2 === 0) metal(t + B*.5, .03, 2600 + rnd()*400); for (let i = 0; i < 2; i++) tone(1800 + rnd()*1400, t + rnd()*B*4, .15, .035, 'sine', {glide:700, glideT:.12});
      if (b % 4 === 2) voice(40, t, B*3.5, .045); pad(b % 8 < 4 ? 33 : 32, t, B*4, .03, 300); } },
    // 밤이: 장난감 피아노 자장가 (한 음씩 어긋남) · 찻잔 땡그랑 · 풍경 · 속삭이는 합창
    bami:{ bpm:80, beats:4, bar(b, t, B){ const s = sc(76, [0, 2, 4, 5, 7, 9, 11]), mel = [[4, 2, 0, 2], [4, 4, 4, null], [3, 3, 3, null], [4, 6, 6, null], [4, 2, 0, 2], [4, 4, 4, 4], [3, 3, 4, 3], [0, null, null, null]][b % 8], sour = Math.floor(rnd()*4);
      mel.forEach((n, i) => n != null && bell(s(n) + (i === sour ? 1 : 0), t + i*B, .06, 1.6)); voice(64, t, B*4, .02); voice(67.5, t, B*4, .014);
      if (b % 2 === 1) bell(96, t + B*3.5, .025, 1); if (rnd() < .5) for (let i = 0; i < 4; i++) tone(2600 + rnd()*1800, t + B*2 + i*.09, .5, .012, 'sine'); } },
    // 토토: 파이프 오르간 · 종 · 웅얼거리는 찬송 · 고래 울음
    toto:{ bpm:50, beats:4, bar(b, t, B){ const ch = [[45, 48, 52], [41, 45, 48], [38, 41, 45], [40, 44, 47], [45, 48, 52], [41, 45, 48], [43, 46, 50], [40, 44, 47]][b % 8];
      ch.forEach(m => organ(m, t, B*4, .028)); organ(ch[0] - 12, t, B*4, .03); bell(45, t, .09, 5); voice(57 + (b % 2 ? 3 : 0), t + B, B*2.5, .03); voice(64, t + B, B*2.5, .02);
      if (b % 4 === 2) ghost(55, 43, t + B*1.5, B*2.5, .05); } },
    // 콩이: 누아르 워킹 베이스 · 약음기 트럼펫 · 무전기 잡음 · 먼 사이렌 · 아이 오르골 (하람)
    kongi:{ bpm:72, beats:4, bar(b, t, B){ const bass = [[45, 46, 47, 48], [50, 49, 48, 47], [45, 48, 51, 50], [49, 48, 47, 44]][b % 4]; bass.forEach((m, i) => pluck(m - 12, t + i*B, .09, B*.9));
      const s = sc(69, [0, 3, 5, 6, 7, 10]), mel = [[0, null, 2, 3], [4, 3, 2, null], [5, 4, 2, 0], [1, null, null, null], [0, 2, 3, 4], [5, null, 4, 2], [3, 2, 1, 0], [null, null, null, null]][b % 8];
      mel.forEach((n, i) => n != null && tone(hz(s(n)), t + i*B, B*.9, .04, 'square', {lp:1100, vib:5, vibD:.008, a:.04}));
      if (rnd() < .6) noise(t + rnd()*B*3, .25 + rnd()*.3, .03, {f:1800, q:.8}); if (b % 4 === 1) tone(hz(76), t, B*3, .012, 'sine', {glide:hz(81), glideT:B*1.5, a:.6, hold:true});
      if (b % 8 >= 5) [0, 4, 7, 4].forEach((n, i) => musicbox(81 + n, t + i*B, .03)); } },
  };

  // 곡마다 소리 크기가 달라서 비슷하게 맞춰요
  const GAIN = { tori:3.3, bori:8.9, olly:8.2, mongsil:11, pengpeng:7.1, dandan:7, momo:10.8, hana:6.2, dodo:4.1, bami:8.8, toto:2.8, kongi:9.7 };
  function schedule(){
    if (!cur) return; const T = THEMES[cur]; if (!T) return; const B = 60/T.bpm, barLen = B*T.beats;
    while (next < ctx.currentTime + 1.2){ T.bar(bar, next, B); bar++; next += barLen; }
  }
  function play(npc){
    init(); if (!THEMES[npc]) return; if (!opts.offline && ctx.resume) ctx.resume().catch(()=>{}); if (cur === npc) return; cur = npc; bar = 0; R = 7 + npc.length;
    next = ctx.currentTime + .15; musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(GAIN[npc] || 6, ctx.currentTime + 1.5);
    if (!timer && !opts.offline) timer = setInterval(schedule, 300); schedule();
  }
  function stop(){ if (!ctx || !cur) return; cur = null; if (timer){ clearInterval(timer); timer = 0; } musicBus.gain.cancelScheduledValues(ctx.currentTime); musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime); musicBus.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); }

  // ----- 효과음: 공통 뼈대 + 주민마다 다른 겹소리 -----
  const S = sfxBus, LAY = {
    tori:{ warn:t => noise(t, .5, .05, {f:3500, q:.5, a:.1, dest:S}), slam:t => { thud(t, .7, 140, S); click(t, .25, 1200, S); } },
    bori:{ warn:t => { metal(t, .04, 2400, S); click(t + .1, .12, 2000, S); }, slam:t => { metal(t, .1, 600, S); metal(t + .05, .07, 900, S); } },
    olly:{ warn:t => creak(t, .6, .05, 220, S), slam:t => { noise(t, .5, .2, {type:'highpass', f:3000, dest:S}); bell(96, t, .05, 1.2, S); } },
    mongsil:{ warn:t => { metal(t, .05, 3400, S); metal(t + .09, .05, 3000, S); }, slam:t => { tone(900, t, .25, .15, 'sawtooth', {glide:120, dest:S}); click(t, .2, 900, S); } },
    pengpeng:{ warn:t => { tone(1250, t, .5, .07, 'sine', {dest:S}); }, slam:t => noise(t, .9, .3, {type:'lowpass', f:2400, fTo:200, dest:S}) },
    dandan:{ warn:t => noise(t, .6, .06, {type:'highpass', f:4000, a:.3, dest:S}), slam:t => { for (let i = 0; i < 5; i++) tone(2000 + rnd()*3000, t + i*.02, .3, .05, 'sine', {dest:S}); thud(t, .4, 90, S); } },
    momo:{ warn:t => bell(84, t, .07, 1, S), slam:t => { creak(t, .4, .1, 500, S); thud(t, .6, 100, S); } },
    hana:{ warn:t => noise(t, .6, .08, {f:600, fTo:2400, q:.7, a:.4, dest:S}), slam:t => { noise(t, .8, .3, {type:'lowpass', f:1800, fTo:300, dest:S}); for (let i = 0; i < 8; i++) click(t + rnd()*.5, .08, 2000 + rnd()*2000, S); } },
    dodo:{ warn:t => { for (let i = 0; i < 5; i++) click(t + i*.08, .06, 1500 + rnd()*800, S); }, slam:t => { thud(t, .8, 70, S); noise(t, 1.2, .25, {type:'lowpass', f:500, fTo:80, dest:S}); } },
    bami:{ warn:t => { for (let i = 0; i < 4; i++) tone(2600 + i*400, t + i*.06, .6, .03, 'sine', {dest:S}); }, slam:t => { tone(400, t, .2, .2, 'sawtooth', {glide:2400, glideT:.12, bp:1500, dest:S}); thud(t, .4, 120, S); } },
    toto:{ warn:t => bell(57, t, .08, 2, S), slam:t => { noise(t, .7, .3, {type:'lowpass', f:1400, fTo:150, dest:S}); thud(t, .6, 60, S); } },
    kongi:{ warn:t => noise(t, .25, .08, {f:1800, q:.8, dest:S}), slam:t => { metal(t, .08, 1300, S); metal(t + .06, .06, 1700, S); click(t, .3, 2500, S); } },
  };
  function sfx(npc, kind, at){
    init(); if (!opts.offline && ctx.resume) ctx.resume().catch(()=>{}); const t = at ?? ctx.currentTime + .01, L = LAY[npc] || {};
    if (kind === 'warn'){ tone(380, t, .7, .05, 'sine', {glide:820, glideT:.6, a:.2, dest:S}); L.warn?.(t); }
    else if (kind === 'slam'){ thud(t, .55, 100, S); noise(t, .35, .18, {type:'lowpass', f:900, fTo:150, dest:S}); L.slam?.(t); }
    else if (kind === 'hurt'){ tone(220, t, .3, .12, 'sawtooth', {glide:110, lp:1400, dest:S}); tone(233, t, .3, .08, 'sawtooth', {glide:104, lp:1400, dest:S}); }
    else if (kind === 'hit'){ noise(t, .12, .12, {f:1500, q:1.2, dest:S}); tone(180, t, .12, .08, 'square', {glide:90, lp:900, dest:S}); }
    else if (kind === 'rage'){ // 50% 변신 (기괴하게): 거꾸로 부푸는 숨 + 속삭임 · 늘어지는 오르골 → 쾅 + 일그러진 신음 두 겹 (맥놀이) + 금속 비명 + 엇박 심장 + 빨라지는 딸깍
      noise(t, 2.2, .16, {type:'lowpass', f:200, fTo:4000, a:1.9, dest:S});
      for (let i = 0; i < 26; i++){ const w = t + .15 + rnd()*1.65; noise(w, .06 + rnd()*.12, .05 + rnd()*.05, {f:1100 + rnd()*2400, q:14, a:.02, dest:S}); }
      [84, 82, 79, 75].forEach((m, i) => { const st = t + .3 + i*.38, f = hz(m); tone(f, st, 1.1, .07, 'sine', {glide:f*.84, glideT:1, vib:4.5, vibD:.02, dest:S}); tone(f*3.01, st, .35, .02, 'sine', {glide:f*2.4, dest:S}); });
      thud(t + 1.9, 1.1, 55, S); noise(t + 1.9, .6, .3, {type:'lowpass', f:700, fTo:60, dest:S});
      growl(t + 1.9, 2.6, 55, .2); growl(t + 1.95, 2.5, 58.3, .14);
      tone(2400, t + 1.95, 1.7, .035, 'sine', {glide:260, glideT:1.6, vib:11, vibD:.04, dest:S}); tone(2470, t + 1.95, 1.7, .03, 'sine', {glide:240, glideT:1.6, vib:13, vibD:.04, dest:S});
      [2.5, 2.95, 3.75].forEach((k, i) => heart(t + k, .5 - i*.08, S));
      for (let i = 0; i < 12; i++) click(t + 3.5 + (1 - Math.pow(.86, i))*4.2*.25, .14, 900 + i*180, S);
      L.slam?.(t + 1.9); L.warn?.(t + .6); }
    else if (kind === 'down'){ tone(hz(72), t, 2.5, .08, 'triangle', {glide:hz(36), glideT:2.4, dest:S}); [0, 3, 7, 12].forEach((n, i) => musicbox(72 + n, t + .6 + i*.35, .1, S)); }
  }
  // 미리 녹음용 (OfflineAudioContext): until 초까지 한꺼번에 예약해요
  function fill(until){ if (!cur) return; const T = THEMES[cur], B = 60/T.bpm, barLen = B*T.beats; while (next < until){ T.bar(bar, next, B); bar++; next += barLen; } }
  const playing = () => cur;
  return { play, stop, sfx, playing, init, fill, get ctx(){ return ctx; }, themes:Object.keys(THEMES) };
}
