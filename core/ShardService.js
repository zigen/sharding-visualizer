// @flow

import { ShardChain, SHARD_COUNT } from "./";

class ShardService {
  shards: Array<ShardChain>;
  constructor(n: number = SHARD_COUNT) {
    this.shards = [];
    for (let i = 0; i < n; i++) {
      this.shards.push(new ShardChain(`shard-${i}`, i));
    }
  }
  proposeAllShardsBlocks() {
    this.shards.forEach(s => s.proposeBlock());
  }

  getShardChain(id: string): ?ShardChain {
    return this.shards.find(s => s.id === id);
  }
}

export { ShardService };
