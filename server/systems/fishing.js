import { FISH_TABLE, ITEMS } from '../../shared/data.js';
import { DIRS, T, tileAt } from '../../shared/map.js';
import { addItem, canAdd } from '../inventory.js';

const LATENCY_GRACE = 250;

function rollFish(rng) {
  const total = FISH_TABLE.reduce((a, f) => a + f.weight, 0);
  let r = rng() * total;
  for (const f of FISH_TABLE) {
    if ((r -= f.weight) < 0) return f;
  }
  return FISH_TABLE[0];
}

export function useRod(game, p) {
  if (p.fishing) return reel(game, p);
  const [dx, dy] = DIRS[p.dir];
  let target = null;
  for (let d = 1; d <= 3; d++) {
    const tx = Math.floor(p.x) + dx * d, ty = Math.floor(p.y - 0.15) + dy * d;
    if (tileAt(game.map, tx, ty) === T.WATER) { target = { x: tx + 0.5, y: ty + 0.5 }; break; }
  }
  if (!target) return game.toast(p, '물을 바라보고 낚싯대를 던져요.');
  const fish = rollFish(game.rng);
  const now = game.now();
  p.fishing = {
    state: 'wait', fish, x: p.x, y: p.y,
    bobber: target,
    biteAt: now + 1500 + game.rng() * 4500,
    biteEnd: 0,
  };
  game.fx('splash', target.x, target.y);
  return true;
}

function reel(game, p) {
  const f = p.fishing;
  const now = game.now();
  p.fishing = null;
  if (f.state === 'wait') {
    game.toast(p, '너무 일찍 당겼어요! 느낌표가 뜰 때까지 기다려요.');
    return false;
  }
  if (now > f.biteEnd + LATENCY_GRACE) {
    game.toast(p, '앗, 물고기가 도망갔어요...');
    return false;
  }
  const id = f.fish.id;
  if (!canAdd(p.slots, id, 1)) return game.toast(p, '가방이 꽉 찼어요!');
  addItem(p.slots, id, 1);
  p.stats.fish += 1;
  game.markDirty(p);
  game.fx('splash', f.bobber.x, f.bobber.y);
  game.send(p, 'caught', { item: id });
  game.toast(p, `${ITEMS[id].name}을(를) 낚았어요!`);
  if (id === 'fish_golden') game.systemChat(`${p.name}님이 전설의 황금잉어를 낚았어요!`);
  return true;
}

export function cancelFishing(game, p, reason) {
  if (!p.fishing) return;
  p.fishing = null;
  if (reason) game.toast(p, reason);
}

export function tickFishing(game, now) {
  for (const p of game.players.values()) {
    const f = p.fishing;
    if (!f) continue;
    if (f.state === 'wait' && now >= f.biteAt) {
      f.state = 'bite';
      f.biteEnd = now + f.fish.window;
      game.send(p, 'bite', { window: f.fish.window });
    } else if (f.state === 'bite' && now > f.biteEnd + LATENCY_GRACE) {
      p.fishing = null;
      game.toast(p, '앗, 물고기가 도망갔어요...');
    }
  }
}
