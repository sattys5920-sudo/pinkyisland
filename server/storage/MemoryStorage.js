// 임시 저장소: 서버 메모리에만 보관 (재시작하면 초기화)
// 나중에 DB/파일 저장소를 만들 때 같은 메서드를 구현해서 교체하면 돼요.
export class MemoryStorage {
  constructor() {
    this.players = new Map();
    this.world = null;
  }

  async loadPlayer(token) {
    const data = this.players.get(token);
    return data ? structuredClone(data) : null;
  }

  async savePlayer(token, data) {
    this.players.set(token, structuredClone(data));
  }

  async loadWorld() {
    return this.world ? structuredClone(this.world) : null;
  }

  async saveWorld(data) {
    this.world = structuredClone(data);
  }
}
