// @flow

const SHARD_TO_BEACON_LENGTH = 6;
class Shard {
  id: string;
  index: number;
  constructor(id: string, index: number) {
    this.id = id;
    this.index = index;
  }

  getNode(ctx: any, index: number, base: number) {
    return {
      id: this.id,
      name: "Shard",
      val: 1.5,
      z: 0,
      x: Math.sin((Math.PI * 2 * index) / base) * SHARD_TO_BEACON_LENGTH,
      y: Math.cos((Math.PI * 2 * index) / base) * SHARD_TO_BEACON_LENGTH,
      color: "red",
      type: "shard",
    };
  }
}

export { Shard };
