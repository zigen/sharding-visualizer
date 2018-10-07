// @flow

import { ShardBlock, SHARD_TO_BEACON_DISTANCE, SLOT_HEIGHT } from "./";

class ShardChain {
  id: string;
  index: number;
  blocks: Array<ShardBlock>;
  height: number;

  constructor(id: string, index: number) {
    this.id = id;
    this.index = index;
    this.blocks = [];
    this.height = 0;
    this.generateGenesisBlock();
  }

  generateGenesisBlock() {
    const block = new ShardBlock(`${this.id}-0`, 0, null);
    this.blocks.push(block);
    this.height += 1;
  }

  proposeBlock() {
    const block = new ShardBlock(
      `${this.id}-${this.height}`,
      this.height,
      this.latestBlock
    );
    this.blocks.push(block);
    this.height += 1;
  }

  get latestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  getNode(ctx: any, index: number, base: number) {
    const x = Math.sin((Math.PI * 2 * index) / base) * SHARD_TO_BEACON_DISTANCE;
    const y = Math.cos((Math.PI * 2 * index) / base) * SHARD_TO_BEACON_DISTANCE;
    const shardCtx = { x, y };
    return [
      {
        id: this.id,
        name: "ShardChain",
        val: 1.5,
        z: 0,
        x,
        y,
        color: "red",
        type: "shard",
      },
    ].concat(this.blocks.map(b => b.getNode(shardCtx)));
  }

  getLinks() {
    return this.blocks.filter(b => b.parent != null).map(b => ({
      target: b.parent.id,
      source: b.id,
      id: b.parent.id + "-" + b.id,
      type: "shard",
    }));
  }
}

export { ShardChain };
