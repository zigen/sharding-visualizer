// @flow

import { SHARD_TO_BEACON_DISTANCE, SLOT_HEIGHT } from "./";
class ShardBlock {
  id: string;
  height: number;
  parent: ShardBlock;
  constructor(id: string, height: number, parent: ?ShardBlock = null) {
    this.id = id;
    this.height = height;
    this.parent = parent;
  }

  getNode(ctx: any, index: number, base: number) {
    return {
      id: this.id,
      name: "Shard",
      val: 1.5,
      z: (1 + this.height) * SLOT_HEIGHT,
      x: ctx.x,
      y: ctx.y,
      color: "blue",
      type: "shard",
    };
  }
}

export { ShardBlock };
