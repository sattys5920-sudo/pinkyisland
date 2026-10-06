// ===== 다크 모드: 주민 12 명의 집 = 방탈출 방 =====
// 관리자가 다크 모드를 켜면 하루에 한 방씩 열려요 (order 순서). 한 방에 여러 명이 같이 들어가 문제 15 개를 풀고,
// 다 풀면 그 주민이 최종 보스로 깨어나요. 문제를 풀기 시작한 순간부터 2 시간 안에 보스까지 쓰러뜨려야 해요.
//
// 문제 하나: { id, furn(방에 놓일 가구 그림), x, y, title, q(문제 글), a:[정답들], hint, need:[먼저 풀어야 하는 문제 id] }
//  - 정답은 띄어쓰기·대소문자를 무시하고 비교해요. 여러 개를 넣으면 그중 하나만 맞아도 정답.
//  - 스토리가 정해지면 rooms.<주민 id>.puzzles 에 진짜 문제를 넣으면 돼요. 없으면 아래 임시 문제가 쓰여요.

export const DARK_ORDER = ['hana', 'momo', 'dodo', 'tori', 'bori', 'mongsil', 'olly', 'pengpeng', 'dandan', 'bami', 'toto', 'kongi'];
export const DARK_LIMIT_MS = 2 * 3600 * 1000;   // 첫 입장부터 2 시간
export const DARK_ROOM = { W: 1100, H: 900, door: [550, 800] };
export const DARK_BOSS = { hp: 60000, touch: 35, slam: 60, slamR: 80, slamGap: 3.6, slamWarn: 1.2 }; // 아주 강해요
export const DARK_REWARD = { gold: 20000, exp: 800 };

// 방 가장자리를 따라 놓이는 물건 15 개 (가운데는 보스와 싸우는 자리)
const SPOTS = [
  [150, 300], [320, 300], [490, 300], [660, 300], [830, 300], [980, 300],
  [120, 450], [120, 600], [120, 740],
  [980, 450], [980, 600], [980, 740],
  [260, 790], [400, 790], [840, 790],
];
const FURN = ['u04', 'u13', 'u14', 'u22', 'u24', 'u19', 'u12', 'u09', 'u11', 'u31', 'u27', 'u10', 'u36', 'u15', 'u21'];
const TITLE = ['책장', '괘종시계', '큰 거울', '그림', '지구본', '보물 상자', '피아노', '옷장', '벽난로', '화장대', '책상', '어항', '주크박스', '곰 인형', '책 더미'];

export function placeholderPuzzles(){
  return SPOTS.map(([x, y], i) => {
    const n = i + 1, id = 'p' + String(n).padStart(2, '0');
    const need = n === 13 ? ['p01', 'p02', 'p03', 'p04'] : n === 14 ? ['p05', 'p06', 'p07', 'p08'] : n === 15 ? ['p09', 'p10', 'p11', 'p12'] : [];
    return { id, furn: FURN[i], x, y, title: TITLE[i], q: `(임시 문제 ${n}) 아직 진짜 문제가 정해지지 않았어요. 정답은 ${n} 이에요.`, a: [String(n)], hint: `숫자 ${n} 을 넣어 봐요.`, need };
  });
}

// 주민별 진짜 문제 (스토리가 정해지면 채워요)
export const DARK_ROOMS = {
  // momo: { puzzles: [ { id:'p01', furn:'u04', x:150, y:300, title:'책장', q:'...', a:['...'], hint:'...', need:[] }, ... ] },
};
