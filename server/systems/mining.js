import { ITEMS, ROCKS } from '../../shared/data.js';
import { T, ZONES, tileAt } from '../../shared/map.js';
import { addItem } from '../inventory.js';

export const MAX_ROCKS = 18;
const key = (x, y) => `${x},${y}`;

function rollRock(rng) {
  const entries = Object.entries(ROCKS);
  const total = entries.reduce((a, [, r]) => a + r.weight, 0);
  let r = rng() * total;
  for (const [type, def] of entries) if ((r -= def.weight) < 0) return type;
  return 'stone';
}

export function spawnRock(game) {
  const z = ZONES.mine;
  for (let tries = 0; tries < 30; tries++) {
    const x = z.x + Math.floor(game.rng() * z.w);
    const y = z.y + Math.floor(game.rng() * z.h);
    if (tileAt(game.map, x, y) !== T.CAVE) continue;
    if (x >= 52 && x <= 55 && y <= 35) continue; // 입구 통로는 비워 둬요
    if (game.rocks.has(key(x, y))) continue;
    let nearPlayer = false;
    for (const p of game.players.values()) {
      if (Math.abs(p.x - (x + 0.5)) < 1.5 && Math.abs(p.y - (y + 0.5)) < 1.5) nearPlayer = true;
    }
    if (nearPlayer) continue;
    const type = rollRock(game.rng);
    const rock = { x, y, type, hp: ROCKS[type].hp };
    game.rocks.set(key(x, y), rock);
    game.broadcast('rock', { key: key(x, y), rock });
    return rock;
  }
  return null;
}

export function mine(game, p, tx, ty) {
  const k = key(tx, ty);
  const rock = game.rocks.get(k);
  if (!rock) {
    if (tileAt(game.map, tx, ty) === T.ROCKWALL) game.fx('spark', tx + 0.5, ty + 0.5);
    return false;
  }
  rock.hp -= 1;
  game.fx('spark', tx + 0.5, ty + 0.5);
  if (rock.hp > 0) {
    game.broadcast('rock', { key: k, rock });
    return true;
  }
  game.rocks.delete(k);
  game.broadcast('rock', { key: k, rock: null });
  const got = [];
  for (const [id, lo, hi] of ROCKS[rock.type].drops) {
    const n = lo + Math.floor(game.rng() * (hi - lo + 1));
    if (n <= 0) continue;
    const left = addItem(p.slots, id, n);
    if (n - left > 0) got.push(`${ITEMS[id].name} ${n - left}`);
    if (left > 0) game.toast(p, '가방이 꽉 차서 일부를 놓쳤어요.');
  }
  p.stats.ores += 1;
  game.markDirty(p);
  if (got.length) game.toast(p, `${got.join(', ')} 획득!`);
  return true;
}

export function tickRocks(game) {
  if (game.rocks.size < MAX_ROCKS && game.rng() < 0.5) spawnRock(game);
}
