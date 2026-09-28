import { CONFIG, CROPS, ITEMS } from '../../shared/data.js';
import { T, tileAt } from '../../shared/map.js';
import { addItem, canAdd, takeFromSlot } from '../inventory.js';

const key = (x, y) => `${x},${y}`;

export function publicCrop(c) {
  return { x: c.x, y: c.y, type: c.type, stage: c.stage, watered: c.watered, owner: c.ownerName };
}

export function plant(game, p, slotIndex, tx, ty) {
  const slot = p.slots[slotIndex];
  const seed = ITEMS[slot.id];
  if (tileAt(game.map, tx, ty) !== T.SOIL) return game.toast(p, '밭(갈색 흙)을 바라보고 심어요.');
  if (game.crops.has(key(tx, ty))) return game.toast(p, '이미 무언가 심어져 있어요.');
  const mine = [...game.crops.values()].filter((c) => c.owner === p.token).length;
  if (mine >= CONFIG.MAX_CROPS_PER_PLAYER) {
    return game.toast(p, `작물은 한 사람당 ${CONFIG.MAX_CROPS_PER_PLAYER}개까지 심을 수 있어요.`);
  }
  takeFromSlot(p.slots, slotIndex, 1);
  const crop = { x: tx, y: ty, type: seed.crop, stage: 0, watered: false, growAt: null, owner: p.token, ownerName: p.name };
  game.crops.set(key(tx, ty), crop);
  game.markDirty(p);
  game.broadcast('crop', { key: key(tx, ty), crop: publicCrop(crop) });
  game.fx('plant', tx + 0.5, ty + 0.5);
  return true;
}

export function water(game, p, tx, ty) {
  const crop = game.crops.get(key(tx, ty));
  game.fx('water', tx + 0.5, ty + 0.5);
  if (!crop) return false;
  const def = CROPS[crop.type];
  if (crop.stage >= def.stages - 1) return game.toast(p, '다 자랐어요! E 키로 수확해요.');
  if (crop.watered) return false;
  crop.watered = true;
  crop.growAt = game.now() + def.stageMs;
  game.broadcast('crop', { key: key(tx, ty), crop: publicCrop(crop) });
  return true;
}

export function harvest(game, p, tx, ty) {
  const k = key(tx, ty);
  const crop = game.crops.get(k);
  if (!crop) return false;
  const def = CROPS[crop.type];
  if (crop.stage < def.stages - 1) {
    game.toast(p, `${crop.ownerName}님의 ${def.name} (${crop.stage + 1}/${def.stages}단계)${crop.watered ? ' · 촉촉해요' : ' · 목말라요'}`);
    return true;
  }
  if (crop.owner !== p.token) {
    game.toast(p, `${crop.ownerName}님의 작물이에요. 주인만 수확할 수 있어요.`);
    return true;
  }
  const [lo, hi] = def.yield;
  const n = lo + Math.floor(game.rng() * (hi - lo + 1));
  if (!canAdd(p.slots, def.product, n)) return game.toast(p, '가방이 꽉 찼어요!');
  addItem(p.slots, def.product, n);
  game.crops.delete(k);
  p.stats.harvested += n;
  game.markDirty(p);
  game.broadcast('crop', { key: k, crop: null });
  game.fx('pop', tx + 0.5, ty + 0.5);
  game.toast(p, `${ITEMS[def.product].name} ${n}개를 수확했어요!`);
  return true;
}

export function tickCrops(game, now) {
  for (const [k, c] of game.crops) {
    if (c.watered && c.growAt && now >= c.growAt) {
      c.stage = Math.min(c.stage + 1, CROPS[c.type].stages - 1);
      c.watered = false;
      c.growAt = null;
      game.broadcast('crop', { key: k, crop: publicCrop(c) });
    }
  }
}
