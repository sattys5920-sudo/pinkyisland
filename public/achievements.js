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
  { id:'juke_1',     name:'얼쑤~ 덩!',         desc:'주크박스 사기',                  stat:'jukebox',     n:1,       reward:{gold:1000,  title:'얼쑤~ 덩!'},         icon:'🎶' },
  { id:'dlv_50',     name:'배달의 민족',       desc:'배달 주문 50 건 배달하기',       stat:'deliveries',  n:50,      reward:{gold:3000,  title:'배달의 민족'},       icon:'📦' },
  { id:'mg_50',      name:'알바의 인생',       desc:'미니게임 50 판 하기',            stat:'mgPlayed',    n:50,      reward:{gold:3000,  title:'알바의 인생'},       icon:'🧺' },
  { id:'coffee_ace', name:'초천재',            desc:'커피 만들기에서 5 잔 모두 완벽',  stat:'coffeePerfect', n:1,     reward:{gold:3000,  title:'초천재'},            icon:'🧠' },
  { id:'otumo_3',    name:'오투모의 친구',     desc:'오투모에게 편지 보내기 · 오투모가 깨워 주기 합쳐서 3 번', stat:'otumoFriend', n:3, reward:{gold:1500, title:'오투모의 친구'}, icon:'🤖' },
  { id:'friend_5',   name:'친구모아',          desc:'친구 5 명 추가하기',             stat:'friendCount', n:5,       reward:{gold:1500,  title:'친구모아'},          icon:'🤝' },
  { id:'pet_100',    name:'강형욱',            desc:'펫에게 밥 100 번 주기',          stat:'petFed',      n:100,     reward:{gold:3000,  title:'강형욱'},            icon:'🐶' },
  { id:'emote_100',  name:'귀염둥이',          desc:'이모티콘 100 번 보내기',         stat:'emotesSent',  n:100,     reward:{gold:1000,  title:'귀염둥이'},          icon:'🥰' },
  { id:'heart_50',   name:'사랑스러운',        desc:'❤️ 이모티콘 50 번 보내기',       stat:'heartEmotes', n:50,      reward:{gold:1000,  title:'사랑스러운'},        icon:'💗' },
  { id:'outfit_50',  name:'입을 줄 아는',      desc:'옷 50 번 갈아입기',              stat:'outfitChanged', n:50,    reward:{gold:2000,  title:'입을 줄 아는'},      icon:'👗' },
  // ── 장난스러운 칭호 ──
  { id:'solo_60',    name:'나는솔로',          desc:'섬에 나 혼자 있을 때 60 분 놀기', stat:'aloneMin',    n:60,      reward:{gold:1500,  title:'나는솔로'},          icon:'🧍' },
  { id:'letter_20',  name:'호그와트 장학생',   desc:'토리 우체국 편지 20 통 보내기',   stat:'lettersSent', n:20,      reward:{gold:2000,  title:'호그와트 장학생'},   icon:'🦉' },
  { id:'saw_god',    name:'신을 본 자',        desc:'섬을 걷는 오투모를 직접 만나기',  stat:'sawGod',      n:1,       reward:{gold:1000,  title:'신을 본 자'},        icon:'🤖' },
  { id:'eat_300',    name:'돼지',              desc:'음식 300 번 먹기',               stat:'foodEaten',   n:300,     reward:{gold:2000,  title:'돼지'},              icon:'🐷' },
  { id:'cook_1500',  name:'요리왕 비룡',       desc:'요리 1500 번 만들기',            stat:'dishesCooked', n:1500,   reward:{gold:15000, title:'요리왕 비룡'},       icon:'🐉' },
  { id:'faint_30',   name:'류크',              desc:'기절 30 번 하기',                stat:'faints',      n:30,      reward:{gold:1500,  title:'류크'},              icon:'📓' },
  { id:'dex_100',    name:'콜렉터',            desc:'물고기·광석·몬스터 도감 합쳐서 100 종', stat:'dexTotal', n:100,  reward:{gold:10000, title:'콜렉터'},            icon:'🗂️' },
  { id:'mg_200',     name:'퇴사할게요',        desc:'미니게임 알바 200 판 하기',      stat:'mgPlayed',    n:200,     reward:{gold:5000,  title:'퇴사할게요'},        icon:'🏃' },
  { id:'broke',      name:'돈이 없어',         desc:'10 만 G 넘게 벌어 놓고 지갑이 100 G 아래',  stat:'brokeNow', n:1, reward:{gold:100, title:'돈이 없어'},      icon:'🕳️' },
  { id:'homeless',   name:'집이 없어',         desc:'집을 한 번도 안 늘리고 출석 14 일', stat:'homeless',   n:1,       reward:{gold:1400,  title:'집이 없어'},         icon:'⛺' },
  { id:'legend',     name:'레전드',            desc:'업적 60 개 달성하기',            stat:'achCount',    n:60,      reward:{gold:30000, title:'레전드'},            icon:'🏆' },
];

// ===== 칭호 효과: 지금 달고 있는 칭호 하나만 적용돼요 =====
// hp/sta 최대 체력·기력 +N · atk 공격력 +% · dr 받는 피해 -% · regen 체력 회복 +% · revive 하루 한 번 쓰러지면 바로 일어남(30%)
// fish 희귀 물고기 확률 +% · ore 희귀 광석 확률 +% · crop 수확 +1 개 확률 · sell 판매가 +% · loot 몬스터 골드 +%
// speed 이동 속도 +% · xp 경험치 +% · free 기력 안 쓸 확률 · food 음식 회복량 +%
export const TITLE_FX = {
  fish_10:{fish:.05}, fish_100:{fish:.1}, fish_500:{fish:.15}, fish_2000:{fish:.25, sta:30}, fish3_10:{fish:.12}, fish3_100:{fish:.2, xp:.05},
  dexfish_10:{fish:.06}, dexfish_25:{fish:.12}, dexfish_50:{fish:.2, free:.1},
  ore_10:{ore:.05}, ore_100:{ore:.1}, ore_500:{ore:.15}, ore_2000:{ore:.25, sta:30}, dexore_10:{ore:.06}, dexore_25:{ore:.12}, dexore_40:{ore:.2, free:.1},
  mon_10:{atk:.03}, mon_100:{atk:.06}, mon_1000:{atk:.12, hp:50}, dexmon_15:{loot:.1}, dexmon_30:{loot:.2, atk:.05},
  boss_1:{dr:.03}, boss_5:{dr:.06, hp:30}, boss_30:{dr:.1, hp:80}, cave_1:{atk:.08, dr:.05}, weapon_8:{atk:.15},
  crop_10:{crop:.05}, crop_100:{crop:.1}, crop_1000:{crop:.2, sta:30}, plots_6:{crop:.08, free:.05},
  cook_10:{food:.1}, cook_100:{food:.2}, cook_500:{food:.3, sta:20}, cook_1500:{food:.5, sta:40},
  earn_1k:{sell:.02}, earn_10k:{sell:.04}, earn_100k:{sell:.07}, earn_1m:{sell:.12}, sold_100:{sell:.04}, sold_1000:{sell:.08},
  mkt_sold_10:{sell:.05}, mkt_bought_10:{loot:.08}, stock_10k:{sell:.05}, stock_100k:{sell:.1},
  bought_10:{speed:.03}, closet_30:{speed:.05}, closet_60:{speed:.08, xp:.05},
  furn_10:{regen:.2}, furn_20:{regen:.4}, house_3:{hp:30, regen:.2}, house_5:{hp:80, regen:.5}, interior_10:{regen:.3, sta:20},
  hearts_7:{xp:.05}, soulmate_1:{xp:.08}, soulmates_14:{xp:.15, hp:50}, friends_7:{xp:.1}, gift_50:{sell:.03, xp:.03}, gift_300:{xp:.1, sell:.05},
  errand_30:{speed:.05, free:.05}, attend_30:{hp:40, sta:40}, museum_120:{xp:.12, fish:.05, ore:.05}, zones_13:{speed:.06}, wish_10:{revive:1},
  walk_100k:{speed:.1}, zone_300:{speed:.08, free:.05},
  auc_win:{sell:.05}, juke_1:{regen:.3}, dlv_50:{speed:.08}, mg_50:{xp:.06}, coffee_ace:{food:.2, xp:.03}, otumo_3:{revive:1},
  friend_5:{xp:.05, hp:20}, pet_100:{regen:.3, food:.1}, emote_100:{sta:20}, heart_50:{hp:30}, outfit_50:{speed:.05},
  solo_60:{atk:.08, dr:.05}, letter_20:{xp:.12}, saw_god:{revive:1, hp:50}, eat_300:{food:.4, hp:60}, faint_30:{revive:1},
  dex_100:{fish:.1, ore:.1, loot:.1}, mg_200:{free:.15}, broke:{loot:.2}, homeless:{speed:.1, sta:30}, legend:{hp:100, atk:.1, dr:.05, xp:.1},
  goal1:{free:.1, xp:.05, crop:.05}, // 고급 노동자 (오늘의 섬 목표 기여 1 위)
};
const PCT = v => Math.round(v*100) + '%';
export function titleFxText(f){ if (!f) return ''; const o = [];
  if (f.hp) o.push(`최대 체력 +${f.hp}`); if (f.sta) o.push(`최대 기력 +${f.sta}`); if (f.atk) o.push(`공격력 +${PCT(f.atk)}`); if (f.dr) o.push(`받는 피해 -${PCT(f.dr)}`);
  if (f.regen) o.push(`체력 회복 +${PCT(f.regen)}`); if (f.revive) o.push('하루 한 번 즉시 부활'); if (f.fish) o.push(`희귀 물고기 +${PCT(f.fish)}`); if (f.ore) o.push(`희귀 광석 +${PCT(f.ore)}`);
  if (f.crop) o.push(`수확 +1 확률 ${PCT(f.crop)}`); if (f.sell) o.push(`판매가 +${PCT(f.sell)}`); if (f.loot) o.push(`몬스터 골드 +${PCT(f.loot)}`); if (f.speed) o.push(`이동 속도 +${PCT(f.speed)}`);
  if (f.xp) o.push(`경험치 +${PCT(f.xp)}`); if (f.free) o.push(`기력 안 쓸 확률 ${PCT(f.free)}`); if (f.food) o.push(`음식 회복 +${PCT(f.food)}`); return o.join(' · '); }
