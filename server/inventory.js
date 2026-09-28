import { CONFIG, ITEMS } from '../shared/data.js';

export const STACK_MAX = 99;

export function emptySlots() {
  return Array.from({ length: CONFIG.INVENTORY_SIZE }, () => null);
}

export function starterSlots() {
  const slots = emptySlots();
  slots[0] = { id: 'sword', n: 1 };
  slots[1] = { id: 'pickaxe', n: 1 };
  slots[2] = { id: 'rod', n: 1 };
  slots[3] = { id: 'can', n: 1 };
  slots[4] = { id: 'seed_turnip', n: 6 };
  slots[5] = { id: 'cookie', n: 2 };
  return slots;
}

function stackable(id) {
  return ITEMS[id] && ITEMS[id].cat !== 'tool';
}

export function canAdd(slots, id, n) {
  let room = 0;
  for (const s of slots) {
    if (!s) room += stackable(id) ? STACK_MAX : 1;
    else if (s.id === id && stackable(id)) room += STACK_MAX - s.n;
    if (room >= n) return true;
  }
  return room >= n;
}

// 넣지 못한 개수를 돌려줘요
export function addItem(slots, id, n) {
  if (!ITEMS[id] || n <= 0) return n;
  if (stackable(id)) {
    for (const s of slots) {
      if (n <= 0) break;
      if (s && s.id === id && s.n < STACK_MAX) {
        const put = Math.min(n, STACK_MAX - s.n);
        s.n += put; n -= put;
      }
    }
  }
  for (let i = 0; i < slots.length && n > 0; i++) {
    if (!slots[i]) {
      const put = stackable(id) ? Math.min(n, STACK_MAX) : 1;
      slots[i] = { id, n: put };
      n -= put;
    }
  }
  return n;
}

export function takeFromSlot(slots, index, n = 1) {
  const s = slots[index];
  if (!s || s.n < n) return false;
  s.n -= n;
  if (s.n <= 0) slots[index] = null;
  return true;
}
