import { MemoryStorage } from './MemoryStorage.js';

// 저장소 인터페이스
//   loadPlayer(token) -> Promise<object|null>
//   savePlayer(token, data) -> Promise<void>
//   loadWorld() -> Promise<object|null>
//   saveWorld(data) -> Promise<void>
export function createStorage() {
  return new MemoryStorage();
}
