// 서버와 클라이언트가 함께 쓰는 게임 데이터 정의

export const CONFIG = {
  MAX_PLAYERS: 14,
  TILE: 16,
  PLAYER_SPEED: 4.2, // 타일/초
  PLAYER_MAX_HP: 100,
  DAY_LENGTH_MS: 12 * 60 * 1000, // 게임 속 하루 = 현실 12분
  MAX_CROPS_PER_PLAYER: 12, // 소규모 농사
  HOTBAR_SIZE: 10,
  INVENTORY_SIZE: 24,
  HEART_POINTS: 100, // 하트 1개 = 100점
  MAX_HEARTS: 10,
};

// cat: tool | seed | crop | fish | ore | gem | monster | food
export const ITEMS = {
  sword: { name: '나무 검', cat: 'tool', icon: 'sword', desc: '몬스터를 공격해요.' },
  pickaxe: { name: '곡괭이', cat: 'tool', icon: 'pickaxe', desc: '광산의 바위를 캐요.' },
  rod: { name: '낚싯대', cat: 'tool', icon: 'rod', desc: '물을 바라보고 사용해요. 느낌표가 뜨면 다시 눌러요!' },
  can: { name: '물뿌리개', cat: 'tool', icon: 'can', desc: '작물에 물을 줘요.' },

  seed_turnip: { name: '순무 씨앗', cat: 'seed', icon: 'seed', color: '#e9d8ff', price: 20, sell: 5, crop: 'turnip' },
  seed_carrot: { name: '당근 씨앗', cat: 'seed', icon: 'seed', color: '#ffb35c', price: 35, sell: 8, crop: 'carrot' },
  seed_strawberry: { name: '딸기 씨앗', cat: 'seed', icon: 'seed', color: '#ff6f8e', price: 60, sell: 15, crop: 'strawberry' },
  seed_pumpkin: { name: '호박 씨앗', cat: 'seed', icon: 'seed', color: '#ff9a3c', price: 100, sell: 25, crop: 'pumpkin' },

  turnip: { name: '순무', cat: 'crop', icon: 'turnip', sell: 40, heal: 8 },
  carrot: { name: '당근', cat: 'crop', icon: 'carrot', sell: 70, heal: 12 },
  strawberry: { name: '딸기', cat: 'crop', icon: 'strawberry', sell: 120, heal: 18 },
  pumpkin: { name: '호박', cat: 'crop', icon: 'pumpkin', sell: 250, heal: 30 },

  fish_crucian: { name: '붕어', cat: 'fish', icon: 'fish', color: '#b5a06a', sell: 30 },
  fish_minnow: { name: '피라미', cat: 'fish', icon: 'fish', color: '#9fc4d8', sell: 25 },
  fish_trout: { name: '송어', cat: 'fish', icon: 'fish', color: '#d98f9f', sell: 60 },
  fish_salmon: { name: '연어', cat: 'fish', icon: 'fish', color: '#ff8a65', sell: 90 },
  fish_eel: { name: '뱀장어', cat: 'fish', icon: 'fish', color: '#5b6b4a', sell: 150 },
  fish_golden: { name: '황금잉어', cat: 'fish', icon: 'fish', color: '#ffd54a', sell: 500 },

  stone: { name: '돌', cat: 'ore', icon: 'ore', color: '#a39aa8', sell: 5 },
  copper: { name: '구리 광석', cat: 'ore', icon: 'ore', color: '#e08a4f', sell: 25 },
  iron: { name: '철 광석', cat: 'ore', icon: 'ore', color: '#c9d3dd', sell: 50 },
  gold: { name: '금 광석', cat: 'ore', icon: 'ore', color: '#ffd23f', sell: 120 },
  amethyst: { name: '자수정', cat: 'gem', icon: 'gem', color: '#b57bff', sell: 200 },

  slime_jelly: { name: '슬라임 젤리', cat: 'monster', icon: 'jelly', color: '#7be07b', sell: 15 },
  blue_jelly: { name: '푸른 젤리', cat: 'monster', icon: 'jelly', color: '#6fb6ff', sell: 35 },
  bat_wing: { name: '박쥐 날개', cat: 'monster', icon: 'wing', color: '#7a5c8f', sell: 30 },

  cookie: { name: '회복 쿠키', cat: 'food', icon: 'cookie', price: 50, sell: 10, heal: 35 },
  bouquet: { name: '작은 꽃다발', cat: 'food', icon: 'bouquet', price: 150, sell: 30, desc: '누군가에게 선물하면 기뻐할지도?' },
};

export const SHOP_STOCK = ['seed_turnip', 'seed_carrot', 'seed_strawberry', 'seed_pumpkin', 'cookie', 'bouquet'];

// 각 단계마다 물을 한 번씩 줘야 stageMs 후 다음 단계로 자라요
export const CROPS = {
  turnip: { name: '순무', stages: 4, stageMs: 15000, product: 'turnip', yield: [1, 2], color: '#f3e6ff', leaf: '#6cc04a' },
  carrot: { name: '당근', stages: 4, stageMs: 22000, product: 'carrot', yield: [1, 2], color: '#ff9533', leaf: '#4fae3c' },
  strawberry: { name: '딸기', stages: 4, stageMs: 30000, product: 'strawberry', yield: [2, 3], color: '#ff4f6d', leaf: '#3f9e46' },
  pumpkin: { name: '호박', stages: 4, stageMs: 45000, product: 'pumpkin', yield: [1, 1], color: '#ff8c1a', leaf: '#4a9a36' },
};

// window: 느낌표가 뜬 뒤 반응해야 하는 시간(ms)
export const FISH_TABLE = [
  { id: 'fish_minnow', weight: 30, window: 1100 },
  { id: 'fish_crucian', weight: 30, window: 1000 },
  { id: 'fish_trout', weight: 18, window: 800 },
  { id: 'fish_salmon', weight: 12, window: 700 },
  { id: 'fish_eel', weight: 7, window: 550 },
  { id: 'fish_golden', weight: 3, window: 420 },
];

export const ROCKS = {
  stone: { hp: 2, weight: 50, drops: [['stone', 1, 2]] },
  copper: { hp: 3, weight: 25, drops: [['copper', 1, 2], ['stone', 0, 1]] },
  iron: { hp: 4, weight: 14, drops: [['iron', 1, 2], ['stone', 0, 1]] },
  gold: { hp: 5, weight: 7, drops: [['gold', 1, 1]] },
  gem: { hp: 4, weight: 4, drops: [['amethyst', 1, 1]] },
};

export const MONSTERS = {
  slime: { name: '슬라임', hp: 24, dmg: 7, speed: 1.4, sight: 5, gold: [3, 8], drops: [['slime_jelly', 1, 1, 1]] },
  blue_slime: { name: '푸른 슬라임', hp: 40, dmg: 11, speed: 1.7, sight: 6, gold: [8, 15], drops: [['blue_jelly', 1, 1, 1]] },
  bat: { name: '동굴 박쥐', hp: 28, dmg: 9, speed: 2.4, sight: 6, gold: [6, 12], drops: [['bat_wing', 1, 1, 0.7]] },
};

export const GIFT_POINTS = { loved: 80, liked: 45, neutral: 20, disliked: -20, hated: -40 };
export const TALK_POINTS = 20;

// 선호도 목록: 아이템 id 또는 'cat:분류'
export const NPCS = {
  momo: {
    name: '모모', role: '잡화점 주인', shop: true,
    look: { hair: '#ff9ec7', shirt: '#fff3a8', pants: '#8a6fd1', skin: '#ffe0c9', acc: 'apron' },
    home: [27.5, 19.5],
    tastes: { loved: ['strawberry', 'bouquet'], liked: ['cat:crop', 'amethyst'], disliked: ['stone', 'cat:monster'], hated: [] },
    lines: [
      ['어서 와요~ 모모의 잡화점이에요!', '씨앗이 필요하면 언제든 말해요.', '오늘도 손님이 많았으면 좋겠다~'],
      ['또 왔네요! 당신 얼굴 보니까 반가워요.', '딸기가 요즘 제일 인기예요. 저도 좋아하고요... 헤헤.'],
      ['요즘 당신 덕분에 가게가 활기차졌어요!', '장부 정리하다가 당신 생각이 났어요. 이상하죠?'],
      ['당신은 이 섬에서 제일 믿음직한 친구예요.', '가게 문 닫고 같이 노을 보러 갈래요?'],
      ['당신이 오는 소리만 들어도 기분이 좋아져요.', '이 섬에 와 줘서... 정말 고마워요.'],
    ],
    reactions: {
      loved: '우와아! 이거 제가 제일 좋아하는 거예요! 정말 고마워요!',
      liked: '어머, 좋은 걸 주셨네요. 고마워요!',
      neutral: '고마워요. 잘 쓸게요!',
      disliked: '음... 마음만 받을게요.',
      hated: '으... 이건 좀...',
    },
    rewards: { 3: ['seed_strawberry', 5], 6: ['bouquet', 1], 10: ['fish_golden', 1] },
  },
  hana: {
    name: '하나', role: '꼬마 농부',
    look: { hair: '#8a5a3b', shirt: '#9be38b', pants: '#5a8fd6', skin: '#ffe3cf', acc: 'strawhat' },
    home: [14.5, 19.5],
    tastes: { loved: ['pumpkin', 'bouquet'], liked: ['cat:crop', 'cat:seed'], disliked: ['cat:ore'], hated: ['bat_wing'] },
    lines: [
      ['안녕! 나는 하나야. 저기 밭은 모두가 같이 쓰는 곳이야!', '씨앗을 심고 물을 매일 줘야 쑥쑥 자라~', '물 안 주면 작물이 시무룩해져.'],
      ['네 작물 봤어! 잘 키우고 있더라~', '호박은 오래 걸리지만 제일 비싸게 팔려!'],
      ['너랑 같이 밭일하니까 하나도 안 힘들어!', '비밀인데... 난 커서 섬 최고의 농부가 될 거야.'],
      ['너는 내 제일 친한 친구야!', '다음에 수확하면 제일 큰 거 너 줄게!'],
      ['너 없었으면 이 밭은 풀밭이었을 거야. 고마워!', '우리 평생 같이 농사짓자!'],
    ],
    reactions: {
      loved: '우와! 진짜 나 주는 거야? 최고야!!',
      liked: '헤헤, 고마워! 잘 먹을게!',
      neutral: '고마워~',
      disliked: '이건... 흙이 묻어서 별로야.',
      hated: '으악! 박쥐 날개는 싫어!!',
    },
    rewards: { 3: ['seed_carrot', 5], 6: ['seed_pumpkin', 3], 10: ['seed_pumpkin', 10] },
  },
  lulu: {
    name: '루루', role: '느긋한 어부',
    look: { hair: '#5fb3ff', shirt: '#ffffff', pants: '#3f5f9f', skin: '#ffd9bf', acc: 'cap' },
    home: [46.5, 16.5],
    tastes: { loved: ['fish_golden', 'fish_eel'], liked: ['cat:fish'], disliked: ['cat:monster'], hated: ['stone'] },
    lines: [
      ['어이~ 낚시하러 왔어? 다리 끝에서 연못을 바라보고 낚싯대를 던져봐.', '느낌표가 뜨면 바로 당겨야 해!', '물고기는 서두르면 도망가~'],
      ['오, 손맛 좀 봤나 보네?', '황금잉어는 정말 빨라. 눈 깜빡하면 놓쳐.'],
      ['너랑 낚시하면 시간 가는 줄 모르겠어.', '이 연못엔 전설이 하나 있지... 다음에 알려줄게.'],
      ['넌 이제 진짜 낚시꾼이야. 인정!', '파도 소리 들으면서 너랑 수다 떠는 게 좋아.'],
      ['평생 낚시 친구 해줄 거지?', '황금잉어 전설? 그건... 친구랑 나누는 행복이래.'],
    ],
    reactions: {
      loved: '이, 이건...! 정말 귀한 걸 주는구나. 고마워!',
      liked: '오~ 좋은 물고기네! 고마워.',
      neutral: '음, 고마워~',
      disliked: '끈적거려... 별로야.',
      hated: '돌은 왜 줘...?',
    },
    rewards: { 3: ['cookie', 3], 6: ['fish_eel', 1], 10: ['fish_golden', 2] },
  },
  dodo: {
    name: '도도', role: '광부 아저씨',
    look: { hair: '#4a3a33', shirt: '#d9823b', pants: '#5b4a3f', skin: '#f0c8a4', acc: 'helmet' },
    home: [53.5, 27.5],
    tastes: { loved: ['amethyst', 'gold'], liked: ['cat:ore', 'cookie'], disliked: ['cat:crop'], hated: ['bouquet'] },
    lines: [
      ['허허, 광산에 들어가려고? 박쥐 조심하게.', '곡괭이로 바위를 몇 번 두드리면 광석이 나온다네.', '반짝이는 바위엔 보석이 숨어 있지.'],
      ['자네 곡괭이질이 제법이야.', '금 광석은 단단해서 여러 번 쳐야 해.'],
      ['자네 같은 후배가 있어서 든든하구먼.', '옛날엔 이 광산에 사람이 북적였지...'],
      ['자네는 이제 어엿한 광부야. 자랑스럽네.', '우리 광산 이야기, 밤새 들려줄 수도 있지!'],
      ['자네를 만난 건 내 인생 최고의 발견일세.', '이 헬멧... 언젠가 자네에게 물려줄까 해.'],
    ],
    reactions: {
      loved: '오오! 이렇게 좋은 광석을! 자네 최고야!',
      liked: '허허, 좋은 걸 가져왔구먼.',
      neutral: '고맙네.',
      disliked: '난 채소는 영 별로라네.',
      hated: '꽃? 에취! 난 꽃가루 알레르기가 있다네...',
    },
    rewards: { 3: ['cookie', 3], 6: ['gold', 3], 10: ['amethyst', 5] },
  },
  bibi: {
    name: '비비', role: '씩씩한 모험가',
    look: { hair: '#ff5a5a', shirt: '#5a5aa8', pants: '#3a3a4a', skin: '#ffe0c9', acc: 'bandana' },
    home: [28.5, 32.5],
    tastes: { loved: ['blue_jelly', 'cookie'], liked: ['cat:monster', 'cat:gem'], disliked: ['cat:seed'], hated: ['turnip'] },
    lines: [
      ['남쪽 숲엔 슬라임이 살아. 검을 들고 스페이스를 눌러 싸워봐!', '체력이 떨어지면 쿠키를 먹어!', '쓰러져도 괜찮아. 광장에서 다시 일어나니까.'],
      ['오, 전투 좀 해본 눈빛인데?', '푸른 슬라임은 좀 더 세. 같이 가면 쉬워!'],
      ['너랑 같이 싸우면 무서울 게 없어!', '다음엔 누가 더 많이 잡나 내기하자!'],
      ['내 등을 맡길 수 있는 건 너뿐이야.', '모험 끝나면 같이 쿠키 먹자!'],
      ['너는 내 영원한 파트너야!', '세상 끝까지 같이 모험 가자!'],
    ],
    reactions: {
      loved: '우와! 이거 완전 내 스타일이야! 고마워!',
      liked: '오, 전리품이네! 좋아!',
      neutral: '고마워, 친구!',
      disliked: '씨앗은 심을 데가 없어서...',
      hated: '순무... 난 순무가 세상에서 제일 싫어!',
    },
    rewards: { 3: ['cookie', 5], 6: ['blue_jelly', 3], 10: ['amethyst', 3] },
  },
};

export const LOOK_OPTIONS = {
  hair: ['#4a3a33', '#8a5a3b', '#f2c46d', '#ff9ec7', '#5fb3ff', '#9b7bff', '#ff5a5a', '#f5f5f5'],
  shirt: ['#ff8fb1', '#9be38b', '#8fd3ff', '#fff3a8', '#c9a6ff', '#ffb36b', '#ffffff', '#5a5aa8'],
};

export function heartsOf(points) {
  return Math.max(0, Math.min(CONFIG.MAX_HEARTS, Math.floor(points / CONFIG.HEART_POINTS)));
}

export function tasteOf(npcId, itemId) {
  const npc = NPCS[npcId];
  const item = ITEMS[itemId];
  if (!npc || !item) return 'neutral';
  for (const level of ['loved', 'hated', 'liked', 'disliked']) {
    const list = npc.tastes[level] || [];
    if (list.includes(itemId)) return level;
  }
  for (const level of ['loved', 'hated', 'liked', 'disliked']) {
    const list = npc.tastes[level] || [];
    if (list.includes('cat:' + item.cat)) return level;
  }
  return 'neutral';
}

export function gameClock(now, startedAt) {
  const elapsed = now - startedAt;
  const day = Math.floor(elapsed / CONFIG.DAY_LENGTH_MS) + 1;
  const frac = (elapsed % CONFIG.DAY_LENGTH_MS) / CONFIG.DAY_LENGTH_MS;
  // 하루는 오전 6시에 시작해서 다음날 오전 2시에 끝나요 (20시간)
  const minutes = Math.floor(6 * 60 + frac * 20 * 60);
  return { day, frac, hour: Math.floor(minutes / 60) % 24, minute: minutes % 60 };
}
