// 핑키 디저트 아일랜드 - 업적 목록
// stat: me.stats 의 카운터 키, n: 달성 수치, reward.title: 닉네임 아래 표시되는 칭호
export const ACHIEVEMENTS = [
  // ── 낚시 ──
  { id:'fish_10',    name:'초보 낚시꾼',       desc:'물고기 10 마리 낚기',            stat:'fishCaught',  n:10,      reward:{gold:300,   title:'초보 낚시꾼'},       icon:'🎣' },
  { id:'fish_100',   name:'바다의 단골',       desc:'물고기 100 마리 낚기',           stat:'fishCaught',  n:100,     reward:{gold:1000,  title:'바다의 단골'},       icon:'🐟' },
  { id:'fish_500',   name:'파도와 친구',       desc:'물고기 500 마리 낚기',           stat:'fishCaught',  n:500,     reward:{gold:3000,  title:'파도와 친구'},       icon:'🌊' },
  { id:'fish_2000',  name:'전설의 강태공',     desc:'물고기 2000 마리 낚기',          stat:'fishCaught',  n:2000,    reward:{gold:10000, title:'전설의 강태공'},     icon:'🐋' },
  { id:'fish3_10',   name:'반짝이는 손맛',     desc:'★3 물고기 10 마리 낚기',         stat:'fish3Star',   n:10,      reward:{gold:1500,  title:'반짝이는 손맛'},     icon:'✨' },
  { id:'fish3_100',  name:'별빛 어부',         desc:'★3 물고기 100 마리 낚기',        stat:'fish3Star',   n:100,     reward:{gold:8000,  title:'별빛 어부'},         icon:'🌟' },
  { id:'dexfish_10', name:'물고기 수집가',     desc:'물고기 10 종 발견하기',          stat:'dexFish',     n:10,      reward:{gold:500,   title:'물고기 수집가'},     icon:'📘' },
  { id:'dexfish_25', name:'바닷속 탐험가',     desc:'물고기 25 종 발견하기',          stat:'dexFish',     n:25,      reward:{gold:2500,  title:'바닷속 탐험가'},     icon:'🤿' },
  { id:'dexfish_50', name:'바다를 품은 사람',  desc:'물고기 50 종 모두 발견하기',     stat:'dexFish',     n:50,      reward:{gold:12000, title:'바다를 품은 사람'},  icon:'🐠' },

  // ── 채광 ──
  { id:'ore_10',     name:'곡괭이 입문자',     desc:'광석 10 개 캐기',                stat:'oreMined',    n:10,      reward:{gold:300,   title:'곡괭이 입문자'},     icon:'⛏️' },
  { id:'ore_100',    name:'동굴 탐험가',       desc:'광석 100 개 캐기',               stat:'oreMined',    n:100,     reward:{gold:1000,  title:'동굴 탐험가'},       icon:'🪨' },
  { id:'ore_500',    name:'반짝돌 수집가',     desc:'광석 500 개 캐기',               stat:'oreMined',    n:500,     reward:{gold:3000,  title:'반짝돌 수집가'},     icon:'💎' },
  { id:'ore_2000',   name:'지하 왕국의 주인',  desc:'광석 2000 개 캐기',              stat:'oreMined',    n:2000,    reward:{gold:10000, title:'지하 왕국의 주인'},  icon:'👑' },
  { id:'dexore_10',  name:'돌멩이 감별사',     desc:'광석 10 종 발견하기',            stat:'dexOre',      n:10,      reward:{gold:500,   title:'돌멩이 감별사'},     icon:'🔍' },
  { id:'dexore_25',  name:'보석 감정사',       desc:'광석 25 종 발견하기',            stat:'dexOre',      n:25,      reward:{gold:2500,  title:'보석 감정사'},       icon:'💍' },
  { id:'dexore_40',  name:'땅속 비밀을 아는 자', desc:'광석 40 종 모두 발견하기',     stat:'dexOre',      n:40,      reward:{gold:12000, title:'땅속 비밀을 아는 자'}, icon:'🗿' },

  // ── 전투 ──
  { id:'mon_10',     name:'먼지떨이',         desc:'몬스터 10 마리 처치하기',        stat:'monsterKills', n:10,     reward:{gold:300,   title:'먼지떨이'},         icon:'🧹' },
  { id:'mon_100',    name:'먼지 사냥꾼',       desc:'몬스터 100 마리 처치하기',       stat:'monsterKills', n:100,    reward:{gold:1500,  title:'먼지 사냥꾼'},       icon:'⚔️' },
  { id:'mon_1000',   name:'섬의 수호자',       desc:'몬스터 1000 마리 처치하기',      stat:'monsterKills', n:1000,   reward:{gold:8000,  title:'섬의 수호자'},       icon:'🛡️' },
  { id:'dexmon_15',  name:'몬스터 관찰자',     desc:'몬스터 15 종 발견하기',          stat:'dexMon',      n:15,      reward:{gold:1500,  title:'몬스터 관찰자'},     icon:'👀' },
  { id:'dexmon_30',  name:'몬스터 박사',       desc:'몬스터 30 종 발견하기',     stat:'dexMon',      n:30,      reward:{gold:10000, title:'몬스터 박사'},       icon:'🎓' },
  { id:'boss_1',     name:'여왕을 마주한 자',  desc:'먼지 여왕 토벌 보상 1 회 받기',  stat:'bossKills',   n:1,       reward:{gold:1000,  title:'여왕을 마주한 자'},  icon:'👸' },
  { id:'boss_5',     name:'먼지 여왕의 천적',  desc:'먼지 여왕 토벌 보상 5 회 받기',  stat:'bossKills',   n:5,       reward:{gold:4000,  title:'먼지 여왕의 천적'},  icon:'🔥' },
  { id:'boss_30',    name:'왕관을 부수는 자',  desc:'먼지 여왕 토벌 보상 30 회 받기', stat:'bossKills',   n:30,      reward:{gold:15000, title:'왕관을 부수는 자'},  icon:'💥' },
  { id:'cave_1',     name:'동굴의 정복자',     desc:'동굴의 주인 처치하기',          stat:'caveBossKills', n:1,     reward:{gold:5000,  title:'동굴의 정복자'},     icon:'🦇' },
  { id:'weapon_8',   name:'전설의 검사',       desc:'최종 8 단계 무기 장착하기',      stat:'weaponTier',  n:8,       reward:{gold:12000, title:'전설의 검사'},       icon:'🏆' },

  // ── 농사 & 요리 ──
  { id:'crop_10',    name:'새싹 농부',         desc:'작물 10 개 수확하기',            stat:'cropsHarvested', n:10,   reward:{gold:300,   title:'새싹 농부'},         icon:'🌱' },
  { id:'crop_100',   name:'텃밭지기',         desc:'작물 100 개 수확하기',           stat:'cropsHarvested', n:100,  reward:{gold:1500,  title:'텃밭지기'},         icon:'🥕' },
  { id:'crop_1000',  name:'황금 들판의 주인',  desc:'작물 1000 개 수확하기',          stat:'cropsHarvested', n:1000, reward:{gold:10000, title:'황금 들판의 주인'},  icon:'🌾' },
  { id:'plots_6',    name:'정원 설계사',       desc:'텃밭 6 칸 모두 열기',            stat:'plots',       n:6,       reward:{gold:3000,  title:'정원 설계사'},       icon:'🏡' },
  { id:'cook_10',    name:'견습 파티시에',     desc:'요리 10 번 만들기',              stat:'dishesCooked', n:10,     reward:{gold:300,   title:'견습 파티시에'},     icon:'🍳' },
  { id:'cook_100',   name:'달콤한 손길',       desc:'요리 100 번 만들기',             stat:'dishesCooked', n:100,    reward:{gold:2000,  title:'달콤한 손길'},       icon:'🧁' },
  { id:'cook_500',   name:'디저트 마에스트로', desc:'요리 500 번 만들기',             stat:'dishesCooked', n:500,    reward:{gold:8000,  title:'디저트 마에스트로'}, icon:'🎂' },

  // ── 돈 & 거래 ──
  { id:'earn_1k',    name:'용돈 모으기',       desc:'골드 1,000 벌기',               stat:'earned',      n:1000,    reward:{gold:200,   title:'용돈 모으기'},       icon:'🪙' },
  { id:'earn_10k',   name:'알뜰살뜰',          desc:'골드 10,000 벌기',              stat:'earned',      n:10000,   reward:{gold:1000,  title:'알뜰살뜰'},          icon:'💰' },
  { id:'earn_100k',  name:'디저트 섬의 큰손',  desc:'골드 100,000 벌기',             stat:'earned',      n:100000,  reward:{gold:5000,  title:'디저트 섬의 큰손'},  icon:'💸' },
  { id:'earn_1m',    name:'핑키 재벌',         desc:'골드 1,000,000 벌기',           stat:'earned',      n:1000000, reward:{gold:20000, title:'핑키 재벌'},         icon:'🏦' },
  { id:'sold_100',   name:'장터 단골',         desc:'아이템 100 개 판매하기',         stat:'sold',        n:100,     reward:{gold:800,   title:'장터 단골'},         icon:'🧺' },
  { id:'sold_1000',  name:'거래의 달인',       desc:'아이템 1000 개 판매하기',        stat:'sold',        n:1000,    reward:{gold:5000,  title:'거래의 달인'},       icon:'🤝' },
  { id:'mkt_sold_10', name:'플리마켓 사장님',  desc:'장터에서 10 번 판매하기',        stat:'marketSold',  n:10,      reward:{gold:1000,  title:'플리마켓 사장님'},   icon:'🏪' },
  { id:'mkt_bought_10', name:'눈 밝은 쇼핑러', desc:'장터에서 10 번 구매하기',        stat:'marketBought', n:10,     reward:{gold:1000,  title:'눈 밝은 쇼핑러'},    icon:'🛍️' },
  { id:'stock_10k',  name:'행운의 투자자',     desc:'홈쇼핑 별사탕으로 10,000 골드 수익 내기', stat:'stockProfit', n:10000,  reward:{gold:3000,  title:'행운의 투자자'},     icon:'📈' },
  { id:'stock_100k', name:'월가의 핑키',       desc:'홈쇼핑 별사탕으로 100,000 골드 수익 내기', stat:'stockProfit', n:100000, reward:{gold:15000, title:'월가의 핑키'},      icon:'🐂' },

  // ── 패션 & 집 ──
  { id:'bought_10',  name:'옷장 꾸미기',       desc:'옷 10 벌 구매하기',              stat:'bought',      n:10,      reward:{gold:800,   title:'옷장 꾸미기'},       icon:'👗' },
  { id:'closet_30',  name:'섬의 패셔니스타',   desc:'옷장에 옷 30 벌 모으기',         stat:'closetCount', n:30,      reward:{gold:4000,  title:'섬의 패셔니스타'},   icon:'👒' },
  { id:'closet_60',  name:'런웨이의 여왕',     desc:'옷 60 벌 모두 모으기',           stat:'closetCount', n:60,      reward:{gold:15000, title:'런웨이의 여왕'},     icon:'💃' },
  { id:'furn_10',    name:'아늑한 집주인',     desc:'가구 10 개 모으기',              stat:'furnCount',   n:10,      reward:{gold:2000,  title:'아늑한 집주인'},     icon:'🛋️' },
  { id:'furn_20',    name:'인테리어 장인',     desc:'가구 20 개 모두 모으기',         stat:'furnCount',   n:20,      reward:{gold:8000,  title:'인테리어 장인'},     icon:'🪑' },
  { id:'house_3',    name:'아늑한 거실',       desc:'집을 3 단계로 늘리기',           stat:'houseLevel',  n:3,       reward:{gold:4000,  title:'아늑한 거실'},       icon:'🏡' },
  { id:'house_5',    name:'꿈의 저택 주인',    desc:'집을 5 단계 꿈의 저택으로 늘리기', stat:'houseLevel',  n:5,       reward:{gold:30000, title:'꿈의 저택 주인'},    icon:'👑' },
  { id:'interior_10',name:'인테리어 디자이너', desc:'벽지·바닥 10 종 모으기',          stat:'interiorCount', n:10,    reward:{gold:8000,  title:'인테리어 디자이너'}, icon:'🛋️' },

  // ── 우정 ──
  { id:'hearts_7',   name:'마음을 여는 열쇠',  desc:'누군가와 하트 7 달성하기',      stat:'maxHearts',   n:7,       reward:{gold:1500,  title:'마음을 여는 열쇠'},  icon:'🔑' },
  { id:'soulmate_1', name:'소중한 짝',         desc:'누군가와 하트 10 달성하기',     stat:'soulmates',   n:1,       reward:{gold:5000,  title:'소중한 짝'},         icon:'💞' },
  { id:'soulmates_14', name:'모두의 사랑',     desc:'주민 12 명 모두와 하트 10 달성하기', stat:'soulmates', n:12,     reward:{gold:20000, title:'모두의 사랑'},       icon:'💖' },
  { id:'friends_7',  name:'마을의 인기쟁이',   desc:'하트 7 이상 주민 7 명 만들기',   stat:'friends7',    n:7,       reward:{gold:5000,  title:'마을의 인기쟁이'},   icon:'🎉' },
  { id:'gift_50',    name:'선물 요정',         desc:'선물 50 번 주기',                stat:'giftsGiven',  n:50,      reward:{gold:1500,  title:'선물 요정'},         icon:'🎁' },
  { id:'gift_300',   name:'마음을 전하는 사람', desc:'선물 300 번 주기',              stat:'giftsGiven',  n:300,     reward:{gold:8000,  title:'마음을 전하는 사람'}, icon:'💌' },
  { id:'errand_30',  name:'토리의 조수',       desc:'토리의 심부름 30 번 완료하기',   stat:'errandsDone', n:30,      reward:{gold:3000,  title:'토리의 조수'},       icon:'📦' },
  { id:'attend_30',  name:'성실한 섬 주민',    desc:'토토에게 출석 30 일 하기',       stat:'daysAttended', n:30,     reward:{gold:5000,  title:'성실한 섬 주민'},    icon:'📅' },

  // ── 탐험 & 기타 ──
  { id:'museum_120', name:'박물관의 은인',     desc:'섬 박물관 120 점이 다 채워지기 (나도 1 점 이상 기증)',  stat:'museumDonated', n:120,   reward:{gold:20000, title:'박물관의 은인'},     icon:'🏛️' },
  { id:'zones_13',   name:'섬 구석구석',       desc:'섬의 13 구역 모두 방문하기',     stat:'zonesVisited', n:13,     reward:{gold:1500,  title:'섬 구석구석'},       icon:'🗺️' },
  { id:'wish_10',    name:'별을 세는 사람',    desc:'별빛 언덕에서 소원 10 번 빌기',  stat:'wishes',      n:10,      reward:{gold:3000,  title:'별을 세는 사람'},    icon:'🌠' },
  { id:'walk_100k',  name:'섬 한 바퀴',        desc:'100,000 px 걷기',                stat:'distanceWalked', n:100000, reward:{gold:1000, title:'섬 한 바퀴'},        icon:'👣' },
  { id:'zone_300',   name:'동에 번쩍 서에 번쩍', desc:'구역을 300 번 오가기',          stat:'zoneMoves',   n:300,     reward:{gold:2000,  title:'동에 번쩍 서에 번쩍'}, icon:'⚡' },

  // ── 함께 놀기 ──
  { id:'auc_win',    name:'경매 낙찰자',       desc:'오투모 경매에서 낙찰받기',       stat:'aucWon',      n:1,       reward:{gold:2000,  title:'경매 낙찰자'},       icon:'🔨' },
  { id:'mg_50',      name:'알바의 인생',       desc:'미니게임 50 판 하기',            stat:'mgPlayed',    n:50,      reward:{gold:3000,  title:'알바의 인생'},       icon:'🧺' },
  { id:'coffee_ace', name:'초천재',            desc:'커피 만들기에서 5 잔 모두 완벽',  stat:'coffeePerfect', n:1,     reward:{gold:3000,  title:'초천재'},            icon:'🧠' },
  { id:'otumo_3',    name:'오투모의 친구',     desc:'오투모에게 편지 보내기 · 오투모가 깨워 주기 합쳐서 3 번', stat:'otumoFriend', n:3, reward:{gold:1500, title:'오투모의 친구'}, icon:'🤖' },
  { id:'friend_5',   name:'친구모아',          desc:'친구 5 명 추가하기',             stat:'friendCount', n:5,       reward:{gold:1500,  title:'친구모아'},          icon:'🤝' },
  { id:'pet_100',    name:'강형욱',            desc:'펫에게 밥 100 번 주기',          stat:'petFed',      n:100,     reward:{gold:3000,  title:'강형욱'},            icon:'🐶' },
  { id:'emote_100',  name:'귀염둥이',          desc:'이모티콘 100 번 보내기',         stat:'emotesSent',  n:100,     reward:{gold:1000,  title:'귀염둥이'},          icon:'🥰' },
  { id:'heart_50',   name:'사랑스러운',        desc:'❤️ 이모티콘 50 번 보내기',       stat:'heartEmotes', n:50,      reward:{gold:1000,  title:'사랑스러운'},        icon:'💗' },
  { id:'outfit_50',  name:'입을 줄 아는',      desc:'옷 50 번 갈아입기',              stat:'outfitChanged', n:50,    reward:{gold:2000,  title:'입을 줄 아는'},      icon:'👗' },
];
