// 섬 지도 생성 (서버/클라이언트 공용, 시드 고정이라 항상 같은 지도)

export const T = {
  GRASS: 0, PATH: 1, WATER: 2, TREE: 3, WALL: 4, SOIL: 5, SAND: 6,
  CAVE: 7, ROCKWALL: 8, FLOWER: 9, BRIDGE: 10, FENCE: 11,
};

const BLOCKING = new Set([T.WATER, T.TREE, T.WALL, T.ROCKWALL, T.FENCE]);

export const MAP_W = 64;
export const MAP_H = 48;

export const ZONES = {
  farm: { x: 6, y: 7, w: 12, h: 9 },
  forest: { x: 4, y: 35, w: 38, h: 9 },
  forestDeep: { x: 4, y: 40, w: 20, h: 5 },
  mine: { x: 47, y: 33, w: 14, h: 12 },
  pond: { x: 41, y: 4, w: 19, h: 12 },
  village: { x: 20, y: 12, w: 22, h: 20 },
};

export const SPAWN = { x: 30.5, y: 22.5 };

// 건물: 그리기 전용 정보 (타일은 WALL로 막혀 있음)
export const BUILDINGS = [
  { id: 'shop', x: 24, y: 14, w: 6, h: 4, roof: '#ff8fb1', label: '모모 잡화점' },
  { id: 'house1', x: 35, y: 14, w: 5, h: 4, roof: '#8fb8ff', label: '' },
  { id: 'house2', x: 22, y: 26, w: 5, h: 4, roof: '#b3e38f', label: '' },
  { id: 'house3', x: 36, y: 26, w: 5, h: 4, roof: '#c9a6ff', label: '' },
];

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMap(seed = 20260928) {
  const rnd = mulberry32(seed);
  const tiles = new Uint8Array(MAP_W * MAP_H);
  const idx = (x, y) => y * MAP_W + x;
  const set = (x, y, t) => { if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) tiles[idx(x, y)] = t; };
  const get = (x, y) => tiles[idx(x, y)];
  const rect = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) set(i, j, t); };

  rect(0, 0, MAP_W, MAP_H, T.GRASS);

  // 가장자리 숲
  for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
    if (x < 2 || y < 2 || x >= MAP_W - 2 || y >= MAP_H - 2) set(x, y, T.TREE);
  }

  // 북쪽 들판에 드문드문 나무
  for (let y = 2; y < 13; y++) for (let x = 20; x < 42; x++) if (rnd() < 0.07) set(x, y, T.TREE);

  // 남쪽 숲
  for (let y = 34; y < 46; y++) for (let x = 2; x < 45; x++) if (rnd() < 0.16) set(x, y, T.TREE);

  // 꽃
  for (let y = 2; y < MAP_H - 2; y++) for (let x = 2; x < MAP_W - 2; x++) {
    if (get(x, y) === T.GRASS && rnd() < 0.035) set(x, y, T.FLOWER);
  }

  // 연못 + 모래
  const pcx = 50.5, pcy = 9.5;
  for (let y = 2; y < 18; y++) for (let x = 40; x < 62; x++) {
    const d = ((x - pcx) / 8.5) ** 2 + ((y - pcy) / 5) ** 2;
    if (d < 1) set(x, y, T.WATER);
    else if (d < 1.55) set(x, y, T.SAND);
  }
  // 낚시 다리
  rect(49, 11, 2, 5, T.BRIDGE);

  // 도로
  rect(8, 23, 49, 2, T.PATH); // 동서
  rect(31, 12, 2, 28, T.PATH); // 남북
  rect(22, 18, 20, 12, T.PATH); // 광장
  rect(49, 16, 2, 7, T.PATH); // 연못 가는 길
  rect(53, 25, 2, 6, T.PATH); // 광산 가는 길
  rect(11, 18, 2, 5, T.PATH); // 농장 가는 길

  // 분수
  rect(36, 21, 2, 2, T.WATER);

  // 농장 (울타리 + 밭)
  rect(4, 5, 16, 13, T.GRASS);
  for (let x = 4; x < 20; x++) { set(x, 5, T.FENCE); set(x, 17, T.FENCE); }
  for (let y = 5; y < 18; y++) { set(4, y, T.FENCE); set(19, y, T.FENCE); }
  set(11, 17, T.PATH); set(12, 17, T.PATH);
  const f = ZONES.farm;
  rect(f.x, f.y, f.w, f.h, T.SOIL);
  rect(f.x, f.y + 4, f.w, 1, T.PATH); // 밭 가운데 통로
  rect(11, f.y, 2, f.h, T.PATH);

  // 건물
  for (const b of BUILDINGS) rect(b.x, b.y, b.w, b.h, T.WALL);

  // 광산
  rect(45, 30, 18, 16, T.ROCKWALL);
  const m = ZONES.mine;
  rect(m.x, m.y, m.w, m.h, T.CAVE);
  rect(53, 30, 2, 3, T.CAVE); // 입구
  for (let i = 0; i < 9; i++) {
    const x = m.x + 1 + Math.floor(rnd() * (m.w - 2));
    const y = m.y + 2 + Math.floor(rnd() * (m.h - 3));
    if (Math.abs(x - 53.5) > 2) set(x, y, T.ROCKWALL);
  }
  rect(53, 30, 2, 6, T.CAVE);

  return { w: MAP_W, h: MAP_H, tiles: Array.from(tiles) };
}

export function tileAt(map, x, y) {
  x = Math.floor(x); y = Math.floor(y);
  if (x < 0 || y < 0 || x >= map.w || y >= map.h) return T.TREE;
  return map.tiles[y * map.w + x];
}

export function isBlocking(t) {
  return BLOCKING.has(t);
}

// 캐릭터 발밑 히트박스 (가로 0.5, 세로 0.3)
export function canStand(map, x, y, extraBlocked) {
  const hw = 0.25, top = 0.3;
  const pts = [[x - hw, y - top], [x + hw, y - top], [x - hw, y - 0.02], [x + hw, y - 0.02]];
  for (const [px, py] of pts) {
    if (isBlocking(tileAt(map, px, py))) return false;
    if (extraBlocked && extraBlocked(Math.floor(px), Math.floor(py))) return false;
  }
  return true;
}

export function inZone(zone, x, y) {
  return x >= zone.x && y >= zone.y && x < zone.x + zone.w && y < zone.y + zone.h;
}

export const DIRS = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };

export function facingTile(x, y, dir) {
  const [dx, dy] = DIRS[dir] || DIRS.down;
  return { x: Math.floor(x) + dx, y: Math.floor(y - 0.15) + dy };
}
